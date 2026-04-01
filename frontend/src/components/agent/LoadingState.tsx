import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface LoadingStateProps {}

const LoadingState: React.FC<LoadingStateProps> = () => {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-emerald-400" />
        </div>
    );
};

export default LoadingState;
