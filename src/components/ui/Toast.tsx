import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import type { Toast } from '../../types';

const ICONS: Record<Toast['type'], React.ReactNode> = {
    success: <CheckCircle size={18} className="text-success shrink-0" />,
    error: <XCircle size={18} className="text-danger shrink-0" />,
    warning: <AlertTriangle size={18} className="text-warning shrink-0" />,
    info: <Info size={18} className="text-accent shrink-0" />,
};

const COLORS: Record<Toast['type'], string> = {
    success: 'border-success/30 bg-success/10',
    error: 'border-danger/30 bg-danger/10',
    warning: 'border-warning/30 bg-warning/10',
    info: 'border-accent/30 bg-accent/10',
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
    const removeToast = useUIStore(s => s.removeToast);
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl max-w-sm ${COLORS[toast.type]}`}
            style={{ background: 'rgba(18,18,26,0.95)' }}
        >
            {ICONS[toast.type]}
            <p className="text-white text-sm flex-1 leading-snug">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="shrink-0 hover:opacity-70 transition-opacity">
                <X size={14} className="text-text-secondary" />
            </button>
        </motion.div>
    );
};

const Toast: React.FC = () => {
    const toasts = useUIStore(s => s.toasts);
    return (
        <div className="toast-container">
            <AnimatePresence>
                {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
            </AnimatePresence>
        </div>
    );
};

export default Toast;
