import React from 'react';
import { Outlet } from 'react-router-dom';
import TravelerHeader from '../components/TravelerHeader';

const TravelerLayout: React.FC = () => {
    return (
        <div className="page-shell">
            <TravelerHeader />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default TravelerLayout;
