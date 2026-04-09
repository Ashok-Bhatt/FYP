import React from 'react';
import { Outlet } from 'react-router-dom';
import AgentHeader from '../components/AgentHeader';

const AgentLayout: React.FC = () => {
    return (
        <div className="page-shell">
            <AgentHeader />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default AgentLayout;
