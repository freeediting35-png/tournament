import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckSquare, Square, ChevronRight, X, Copy, Check } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { SKILL_GAME_WARNING } from '../../constants/gameRules';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../store/uiStore';
import { validateRedeemCode, consumeRedeemCode, redeemGiftCard } from '../../services/redeemService';
import { createFampayOrder, checkPaymentStatus, logPaymentTransaction } from '../../services/paymentService';
import { registerForTournament } from '../../services/tournamentService';
import type { Tournament, RegistrationStep } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    tournament: Tournament;
}

type PaymentTab = 'FAMPAY' | 'GIFT_CARD' | 'REDEEM_CODE' | 'WALLET';

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, tournament }) => {
    const { user } = useAuth();
    const addToast = useUIStore(s => s.addToast);
    const [step, setStep] = useState<RegistrationStep>('WARNING');
    const [agreed, setAgreed] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [payTab, setPayTab] = useState<PaymentTab>('FAMPAY');
    const [giftCode, setGiftCode] = useState('');
    const [redeemCode, setRedeemCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [giftValue, setGiftValue] = useState(0);
    const [codeApplied, setCodeApplied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [slotNumber, setSlotNumber] = useState(0);
    const [orderId, setOrderId] = useState('');
    const [paymentUrl, setPaymentUrl] = useState('');
    const [copied, setCopied] = useState(false);

    const finalAmount = Math.max(0, tournament.entryFee - discount - giftValue);

    const reset = () => {
        setStep('WARNING');
        setAgreed(false);
        setTeamName('');
        setPayTab('FAMPAY');
        setGiftCode('');
        setRedeemCode('');
        setDiscount(0);
        setGiftValue(0);
        setCodeApplied(false);
        setLoading(false);
        setOrderId('');
        setPaymentUrl('');
    };

    const handleClose = () => { reset(); onClose(); };

    // ── Step 1: Accept warning ──────────────────────────────
    const WarningStep = () => (
        <div className="p-5 space-y-4">
            <div className="flex items-center gap-3 bg-warning/10 border border-warning/30 rounded-xl p-4">
                <AlertTriangle size={24} className="text-warning shrink-0" />
                <p className="text-warning font-display font-bold text-base">{SKILL_GAME_WARNING.title}</p>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {SKILL_GAME_WARNING.rules.map((rule, i) => (
                    <div key={i} className="flex gap-2 bg-white/3 rounded-lg p-3 text-sm leading-relaxed text-text-secondary">
                        <span className="shrink-0">{rule.split(' ')[0]}</span>
                        <span>{rule.split(' ').slice(1).join(' ')}</span>
                    </div>
                ))}
            </div>
            <button
                className="flex items-center gap-3 group select-none w-full"
                onClick={() => setAgreed(a => !a)}
            >
                {agreed
                    ? <CheckSquare size={22} className="text-primary shrink-0" />
                    : <Square size={22} className="text-text-secondary shrink-0" />}
                <span className="text-text-secondary text-sm text-left">{SKILL_GAME_WARNING.acknowledgmentText}</span>
            </button>
            <Button variant="primary" fullWidth disabled={!agreed} onClick={() => setStep('TEAM_DETAILS')}>
                {SKILL_GAME_WARNING.buttonText} <ChevronRight size={18} />
            </Button>
        </div>
    );

    // ── Step 2: Team details ────────────────────────────────
    const TeamStep = () => (
        <div className="p-5 space-y-4">
            <div className="bg-white/5 rounded-xl p-4">
                <p className="text-text-secondary text-xs mb-1">Your Free Fire Details</p>
                <p className="text-white font-bold">{user?.freefireName}</p>
                <p className="text-text-secondary font-mono text-sm">UID: {user?.freefireId}</p>
            </div>
            {tournament.mode !== 'SOLO' && (
                <div>
                    <label className="block text-text-secondary text-sm font-semibold mb-2">
                        Team Name <span className="text-primary">*</span>
                    </label>
                    <input
                        type="text"
                        value={teamName}
                        onChange={e => setTeamName(e.target.value)}
                        placeholder={`Your ${tournament.mode} team name`}
                        className="input-field"
                        maxLength={30}
                    />
                </div>
            )}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-3 text-center">
                    <p className="text-secondary font-bold font-display text-lg">{formatCurrency(tournament.prizePool)}</p>
                    <p className="text-text-secondary text-xs">Prize Pool</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                    <p className="text-primary font-bold font-display text-lg">{tournament.entryFee === 0 ? 'FREE' : formatCurrency(tournament.entryFee)}</p>
                    <p className="text-text-secondary text-xs">Entry Fee</p>
                </div>
            </div>
            <Button
                variant="primary"
                fullWidth
                disabled={tournament.mode !== 'SOLO' && !teamName.trim()}
                onClick={() => { if (tournament.entryFee === 0) handleFreeRegister(); else setStep('PAYMENT'); }}
            >
                {tournament.entryFee === 0 ? '🎮 JOIN FOR FREE' : `PROCEED TO PAYMENT →`}
            </Button>
        </div>
    );

    // ── Free registration ───────────────────────────────────
    const handleFreeRegister = async () => {
        if (!user) return;
        setStep('CONFIRMING');
        try {
            const slot = tournament.filledSlots + 1;
            await registerForTournament({
                userId: user.uid,
                userDisplayName: user.displayName ?? '',
                userEmail: user.email ?? '',
                freefireId: user.freefireId ?? '',
                freefireName: user.freefireName ?? '',
                tournamentId: tournament.id,
                tournamentTitle: tournament.title,
                teamName: teamName || undefined,
                paymentStatus: 'CONFIRMED',
                paymentMethod: 'FREE',
                amountPaid: 0,
                paymentOrderId: `FREE_${Date.now()}`,
                registeredAt: new Date().toISOString(),
                slotNumber: slot,
            });
            setSlotNumber(slot);
            setStep('SUCCESS');
        } catch {
            addToast({ type: 'error', message: 'Registration failed. Please try again.' });
            setStep('TEAM_DETAILS');
        }
    };

    // ── Apply redeem code ───────────────────────────────────
    const applyRedeemCode = async () => {
        if (!redeemCode.trim()) return;
        setLoading(true);
        const result = await validateRedeemCode(redeemCode, tournament.id, tournament.entryFee);
        setLoading(false);
        if (result.valid) {
            setDiscount(result.discount);
            setCodeApplied(true);
            addToast({ type: 'success', message: result.message });
        } else {
            addToast({ type: 'error', message: result.message });
        }
    };

    // ── Apply gift card ─────────────────────────────────────
    const applyGiftCard = async () => {
        if (!giftCode.trim() || !user) return;
        setLoading(true);
        const result = await redeemGiftCard(giftCode, user.uid);
        setLoading(false);
        if (result.success) {
            setGiftValue(result.value);
            setCodeApplied(true);
            addToast({ type: 'success', message: result.message });
        } else {
            addToast({ type: 'error', message: result.message });
        }
    };

    // ── Fampay payment ──────────────────────────────────────
    const handleFampayPay = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const order = await createFampayOrder(finalAmount, user.uid, tournament.id);
            setOrderId(order.orderId);
            setPaymentUrl(order.paymentUrl ?? '');
            addToast({ type: 'info', message: 'Complete payment in the Fampay app.' });
            // Poll for payment status
            const poll = setInterval(async () => {
                const status = await checkPaymentStatus(order.orderId);
                if (status === 'PAID') {
                    clearInterval(poll);
                    await completeRegistration(order.orderId, 'FAMPAY', finalAmount);
                } else if (status === 'FAILED') {
                    clearInterval(poll);
                    addToast({ type: 'error', message: 'Payment failed. Please try again.' });
                    setLoading(false);
                }
            }, 3000);
            // Auto-stop polling after 5 min
            setTimeout(() => clearInterval(poll), 300000);
        } catch {
            addToast({ type: 'error', message: 'Failed to create payment order. Please try again.' });
        }
        setLoading(false);
    };

    // ── Wallet payment ──────────────────────────────────────
    const handleWalletPay = async () => {
        if (!user) return;
        if ((user.wallet ?? 0) < finalAmount) {
            addToast({ type: 'error', message: 'Insufficient wallet balance.' });
            return;
        }
        setStep('CONFIRMING');
        await completeRegistration(`WALLET_${Date.now()}`, 'WALLET', finalAmount);
    };

    const completeRegistration = async (pid: string, method: any, amount: number) => {
        if (!user) return;
        setStep('CONFIRMING');
        try {
            if (redeemCode && codeApplied) await consumeRedeemCode(redeemCode);
            const slot = tournament.filledSlots + 1;
            await registerForTournament({
                userId: user.uid,
                userDisplayName: user.displayName ?? '',
                userEmail: user.email ?? '',
                freefireId: user.freefireId ?? '',
                freefireName: user.freefireName ?? '',
                tournamentId: tournament.id,
                tournamentTitle: tournament.title,
                teamName: teamName || undefined,
                paymentStatus: 'CONFIRMED',
                paymentMethod: method,
                amountPaid: amount,
                paymentOrderId: pid,
                registeredAt: new Date().toISOString(),
                slotNumber: slot,
            });
            await logPaymentTransaction({
                userId: user.uid,
                userName: user.displayName ?? '',
                tournamentId: tournament.id,
                tournamentTitle: tournament.title,
                amount,
                method,
                orderId: pid,
                status: 'CONFIRMED',
                createdAt: new Date().toISOString(),
            });
            setSlotNumber(slot);
            setStep('SUCCESS');
        } catch {
            addToast({ type: 'error', message: 'Registration failed. Please contact support.' });
            setStep('PAYMENT');
        }
    };

    // ── Payment step ────────────────────────────────────────
    const PaymentStep = () => (
        <div className="p-5 space-y-4">
            {/* Summary */}
            <div className="bg-white/5 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                    <span className="text-text-secondary text-sm">Entry Fee</span>
                    <span className="text-white font-bold">{formatCurrency(tournament.entryFee)}</span>
                </div>
                {discount > 0 && <div className="flex justify-between mb-2"><span className="text-success text-sm">Redeem Discount</span><span className="text-success font-bold">-{formatCurrency(discount)}</span></div>}
                {giftValue > 0 && <div className="flex justify-between mb-2"><span className="text-success text-sm">Gift Card</span><span className="text-success font-bold">-{formatCurrency(giftValue)}</span></div>}
                <div className="border-t border-white/10 pt-2 flex justify-between">
                    <span className="text-white font-bold">Total Payable</span>
                    <span className="text-primary font-bold text-xl font-display">{finalAmount === 0 ? 'FREE' : formatCurrency(finalAmount)}</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-1 pb-1">
                {(['FAMPAY', 'GIFT_CARD', 'REDEEM_CODE', 'WALLET'] as PaymentTab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setPayTab(tab)}
                        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${payTab === tab ? 'bg-primary text-white' : 'bg-white/5 text-text-secondary hover:text-white'}`}
                    >
                        {tab === 'FAMPAY' ? '📱 Fampay' : tab === 'GIFT_CARD' ? '🎁 Gift Card' : tab === 'REDEEM_CODE' ? '🎟️ Redeem' : '💼 Wallet'}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                <motion.div key={payTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {payTab === 'FAMPAY' && (
                        <div className="space-y-3">
                            <div className="bg-white/5 border border-accent/20 rounded-xl p-4 text-center">
                                <p className="text-4xl mb-2">📱</p>
                                <p className="text-white font-bold">Pay via Fampay</p>
                                <p className="text-text-secondary text-sm mt-1">You'll be redirected to Fampay to complete payment</p>
                            </div>
                            {paymentUrl && (
                                <div className="flex gap-2">
                                    <input readOnly value={paymentUrl} className="input-field text-xs" />
                                    <button onClick={() => { navigator.clipboard.writeText(paymentUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="btn-secondary px-3 py-2 text-xs shrink-0">
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                </div>
                            )}
                            {finalAmount === 0
                                ? <Button variant="primary" fullWidth onClick={() => completeRegistration(`ZERO_${Date.now()}`, 'FAMPAY', 0)}>✅ COMPLETE FREE REGISTRATION</Button>
                                : <Button variant="primary" fullWidth onClick={handleFampayPay} loading={loading}>{paymentUrl ? '⏳ WAITING FOR PAYMENT...' : `💰 PAY ${formatCurrency(finalAmount)} VIA FAMPAY`}</Button>
                            }
                        </div>
                    )}

                    {payTab === 'GIFT_CARD' && (
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={giftCode}
                                onChange={e => setGiftCode(e.target.value.toUpperCase())}
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                className="input-field font-mono tracking-widest"
                                disabled={codeApplied && payTab === 'GIFT_CARD'}
                            />
                            <Button variant={codeApplied ? 'ghost' : 'primary'} fullWidth onClick={applyGiftCard} loading={loading} disabled={codeApplied || !giftCode.trim()}>
                                {codeApplied ? '✅ GIFT CARD APPLIED' : '🎁 APPLY GIFT CARD'}
                            </Button>
                            {finalAmount > 0 && giftValue > 0 && (
                                <Button variant="primary" fullWidth onClick={() => setPayTab('FAMPAY')}>
                                    PAY REMAINING {formatCurrency(finalAmount)} →
                                </Button>
                            )}
                            {finalAmount === 0 && giftValue > 0 && (
                                <Button variant="primary" fullWidth onClick={() => completeRegistration(`GIFT_${Date.now()}`, 'GIFT_CARD', giftValue)}>
                                    ✅ COMPLETE REGISTRATION
                                </Button>
                            )}
                        </div>
                    )}

                    {payTab === 'REDEEM_CODE' && (
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={redeemCode}
                                onChange={e => setRedeemCode(e.target.value.toUpperCase())}
                                placeholder="e.g. FF2025FREE"
                                className="input-field font-mono tracking-widest"
                                disabled={codeApplied}
                            />
                            <Button variant={codeApplied ? 'ghost' : 'primary'} fullWidth onClick={applyRedeemCode} loading={loading} disabled={codeApplied || !redeemCode.trim()}>
                                {codeApplied ? '✅ CODE APPLIED' : '🎟️ APPLY CODE'}
                            </Button>
                            {finalAmount > 0 && codeApplied && <Button variant="primary" fullWidth onClick={() => setPayTab('FAMPAY')}>PAY {formatCurrency(finalAmount)} →</Button>}
                            {finalAmount === 0 && codeApplied && <Button variant="primary" fullWidth onClick={() => completeRegistration(`REDEEM_${Date.now()}`, 'REDEEM_CODE', 0)}>✅ COMPLETE FREE REGISTRATION</Button>}
                        </div>
                    )}

                    {payTab === 'WALLET' && (
                        <div className="space-y-3">
                            <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center">
                                <span className="text-text-secondary">Wallet Balance</span>
                                <span className={`font-bold font-display text-lg ${(user?.wallet ?? 0) >= finalAmount ? 'text-success' : 'text-danger'}`}>
                                    {formatCurrency(user?.wallet ?? 0)}
                                </span>
                            </div>
                            <Button
                                variant="primary"
                                fullWidth
                                disabled={(user?.wallet ?? 0) < finalAmount}
                                onClick={handleWalletPay}
                            >
                                {(user?.wallet ?? 0) >= finalAmount ? `💼 PAY ${formatCurrency(finalAmount)} FROM WALLET` : '❌ INSUFFICIENT BALANCE'}
                            </Button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );

    const stepTitles: Record<RegistrationStep, string> = {
        WARNING: '⚠️ Important Notice',
        TEAM_DETAILS: '🎮 Registration Details',
        PAYMENT: '💳 Payment',
        CONFIRMING: '⏳ Processing...',
        SUCCESS: '🎉 You\'re In!',
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={stepTitles[step]} hideClose={step === 'SUCCESS' || step === 'CONFIRMING'}>
            <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    {step === 'WARNING' && <WarningStep />}
                    {step === 'TEAM_DETAILS' && <TeamStep />}
                    {step === 'PAYMENT' && <PaymentStep />}
                    {step === 'CONFIRMING' && (
                        <div className="p-10 text-center">
                            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-white font-display font-bold text-lg">Processing Registration...</p>
                            <p className="text-text-secondary text-sm mt-2">Please don't close this window</p>
                        </div>
                    )}
                    {step === 'SUCCESS' && (
                        <div className="p-8 text-center">
                            <div className="text-7xl mb-4 animate-float">🎉</div>
                            <h2 className="font-display font-bold text-2xl text-white mb-2">Registration Confirmed!</h2>
                            <p className="text-text-secondary mb-4">You've secured your spot in</p>
                            <p className="text-primary font-bold text-lg mb-6">{tournament.title}</p>
                            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
                                <p className="text-text-secondary text-sm">Your Slot Number</p>
                                <p className="font-accent text-5xl text-primary">#{slotNumber}</p>
                            </div>
                            <p className="text-text-secondary text-sm mb-6">
                                📱 Room ID will be shared 1 hour before the match via notification.
                            </p>
                            <Button variant="primary" fullWidth onClick={handleClose}>CLOSE</Button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </Modal>
    );
};

export default RegistrationModal;
