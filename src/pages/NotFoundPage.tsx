import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-4 text-center">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="text-8xl mb-6 animate-float">🔥</div>
            <h1 className="font-accent text-8xl gradient-text mb-4">404</h1>
            <h2 className="font-display font-bold text-white text-2xl mb-2">Page Not Found</h2>
            <p className="text-text-secondary text-sm mb-8 max-w-sm">
                This page got eliminated from the tournament. Head back to the arena!
            </p>
            <Link to="/">
                <button className="btn-primary px-8 py-3 flex items-center gap-2 mx-auto">
                    <Home size={18} />
                    GO BACK HOME
                </button>
            </Link>
        </motion.div>
    </div>
);

export default NotFoundPage;
