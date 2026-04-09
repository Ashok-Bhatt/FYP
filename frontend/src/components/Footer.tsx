import React from 'react';
import { FaPlaneDeparture, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
    return (
        <footer className="border-t py-12" style={{ background: 'var(--surface-strong)', borderColor: 'var(--border-soft)', color: 'var(--text-primary)' }}>
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter mb-4 md:mb-0">
                        <FaPlaneDeparture className="text-emerald-500" />
                        <span>VoyageGen</span>
                    </div>

                    <div className="flex gap-6">
                        <a href="#" className="transition-colors hover:text-emerald-500" style={{ color: 'var(--text-muted)' }}><FaTwitter size={20} /></a>
                        <a href="#" className="transition-colors hover:text-emerald-500" style={{ color: 'var(--text-muted)' }}><FaInstagram size={20} /></a>
                        <a href="#" className="transition-colors hover:text-emerald-500" style={{ color: 'var(--text-muted)' }}><FaLinkedin size={20} /></a>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center text-sm border-t pt-8" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-soft)' }}>
                    <p>&copy; {new Date().getFullYear()} VoyageGen. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="transition-colors hover:text-emerald-500">Privacy Policy</a>
                        <a href="#" className="transition-colors hover:text-emerald-500">Terms of Service</a>
                        <a href="#" className="transition-colors hover:text-emerald-500">Contact Us</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
