import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Requirement } from '../../types';
import { motion } from 'framer-motion';

const AgentDashboard: React.FC = () => {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchRequirements();
    }, []);

    const fetchRequirements = async () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) return;

            const { token } = JSON.parse(userInfo);
            const { data } = await axios.get<Requirement[]>(
                `${import.meta.env.VITE_API_URL}/api/requirements`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRequirements(data);
        } catch (error) {
            console.error('Error fetching requirements:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-white">Loading...</div>;
    }

    return (
        <div className="p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Manage travel requirements and quotes</p>
            </motion.div>

            <div className="grid gap-6">
                {requirements.map((req) => (
                    <Link
                        key={req._id}
                        to={`/agent/requirement/${req._id}`}
                        className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition-colors"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{req.destination}</h3>
                                <p className="text-gray-400">{req.tripType} • {req.pax.adults} Adults</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${req.status === 'NEW' ? 'bg-blue-500/20 text-blue-400' :
                                    req.status === 'IN_PROGRESS' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                {req.status}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AgentDashboard;
