import React from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

interface QuoteFiltersProps {
    searchTerm: string;
    filterStatus: string;
    onSearchChange: (value: string) => void;
    onFilterChange: (value: string) => void;
}

const QuoteFilters: React.FC<QuoteFiltersProps> = ({
    searchTerm,
    filterStatus,
    onSearchChange,
    onFilterChange
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search quotes..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full sm:w-64 bg-zinc-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-emerald-500 outline-none transition-all"
                />
            </div>
            <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select
                    value={filterStatus}
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="w-full sm:w-48 bg-zinc-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-emerald-500 outline-none appearance-none cursor-pointer"
                >
                    <option value="ALL">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="READY">Ready</option>
                    <option value="SENT_TO_USER">Sent</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="DECLINED">Declined</option>
                </select>
            </div>
        </div>
    );
};

export default QuoteFilters;
