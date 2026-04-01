import React from 'react';
import { FaFileInvoice } from 'react-icons/fa';

interface EmptyStateProps {
    onNavigateToDashboard: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onNavigateToDashboard }) => {
    return (
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-16 text-center">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaFileInvoice className="text-4xl text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Quotes Found</h3>
            <p className="text-gray-400 mb-8">Try adjusting your search or generate a new quote.</p>
            <button
                onClick={onNavigateToDashboard}
                className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
            >
                Go to Dashboard
            </button>
        </div>
    );
};

export default EmptyState;
