import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode; hideFooter?: boolean }> = ({ children, hideFooter }) => (
    <div className="min-h-screen bg-bg-dark flex flex-col">
        <Navbar />
        {/* Desktop: padding-top for sticky navbar; mobile: no top padding needed */}
        <main className="flex-1 xl:pt-16 has-bottom-nav xl:pb-0">
            {children}
        </main>
        {!hideFooter && <Footer />}
    </div>
);

export default Layout;
