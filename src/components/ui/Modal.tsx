import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    hideClose?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, hideClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={e => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        className="modal-content"
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 60, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {(title || !hideClose) && (
                            <div className="flex items-center justify-between p-5 border-b border-white/10">
                                {title && (
                                    <h2 className="font-display font-bold text-white text-xl">{title}</h2>
                                )}
                                {!hideClose && (
                                    <button
                                        onClick={onClose}
                                        className="ml-auto p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <X size={20} className="text-text-secondary" />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="overflow-y-auto max-h-[80dvh]">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
