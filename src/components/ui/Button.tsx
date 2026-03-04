import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    icon,
    className,
    disabled,
    ...rest
}) => {
    const base =
        'inline-flex items-center justify-center gap-2 font-display font-bold tracking-wide rounded-lg transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary';

    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'bg-transparent text-white hover:bg-white/10 border border-transparent hover:border-white/20',
        danger: 'bg-danger text-white hover:bg-red-700 border-none',
    };

    const sizes = {
        sm: 'text-sm px-4 py-2 min-h-[40px]',
        md: 'text-base px-6 py-3 min-h-[48px]',
        lg: 'text-lg px-8 py-4 min-h-[56px]',
    };

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            className={clsx(
                base,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                (disabled || loading) && 'opacity-60 cursor-not-allowed pointer-events-none',
                className
            )}
            disabled={disabled || loading}
            {...(rest as React.ComponentProps<typeof motion.button>)}
        >
            {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : icon ? (
                icon
            ) : null}
            {children}
        </motion.button>
    );
};

export default Button;
