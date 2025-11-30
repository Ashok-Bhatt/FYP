import React from 'react';
import { Outlet } from 'react-router-dom';

const PartnerLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-black">
            <nav className="bg-zinc-900 border-b border-white/10 p-4">
                <h1 className="text-white text-xl font-bold">Partner Portal</h1>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default PartnerLayout;
