import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface LoadingStateProps {}

const LoadingState: React.FC<LoadingStateProps> = () => {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <FaSpinner className="animate-spin text-4xl text-emerald-400 mx-auto mb-4" />
                <div className="text-white text-xl font-medium">Loading your quotes...</div>
                <div className="text-gray-400 text-sm mt-2">Fetching latest travel quotations</div>
            </div>
        </div>
    );
};

export default LoadingState;
