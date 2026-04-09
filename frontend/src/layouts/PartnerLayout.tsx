import React from 'react';
import { Outlet } from 'react-router-dom';
import PartnerHeader from '../components/PartnerHeader';

const PartnerLayout: React.FC = () => {
    return (
        <div className="page-shell">
            <PartnerHeader />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default PartnerLayout;
