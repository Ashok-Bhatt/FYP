import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaPlane, FaCalendarAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const QuoteAccepted: React.FC = () => {
    const { quoteId } = useParams<{ quoteId: string }>();

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                        <FaCheckCircle className="text-4xl text-emerald-600" />
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Quote Accepted! 🎉
                    </h1>
                    
                    <p className="text-xl text-gray-600 mb-8">
                        Your travel quote has been successfully accepted. Get ready for an amazing trip!
                    </p>

                    <div className="bg-white rounded-2xl shadow-xl p-8 text-left">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <FaPlane className="text-emerald-600" />
                            What Happens Next
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <span className="text-emerald-600 font-bold text-sm">1</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Payment Confirmation</h3>
                                    <p className="text-gray-600">
                                        You'll receive a secure payment link via email within the next few minutes
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <span className="text-emerald-600 font-bold text-sm">2</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Partner Contact</h3>
                                    <p className="text-gray-600">
                                        Your travel partner will reach out within 24 hours to discuss details and finalize your itinerary
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <span className="text-emerald-600 font-bold text-sm">3</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Trip Preparation</h3>
                                    <p className="text-gray-600">
                                        Receive your complete itinerary, booking confirmations, and travel tips
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-4">Important Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <FaCalendarAlt className="text-emerald-600" />
                                        Free Cancellation
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Cancel up to 48 hours before travel for a full refund
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <FaEnvelope className="text-emerald-600" />
                                        Email Updates
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        You'll receive regular updates about your trip status
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-emerald-50 rounded-lg">
                            <h4 className="font-semibold text-emerald-900 mb-2">Need Help?</h4>
                            <p className="text-emerald-800 text-sm mb-4">
                                Our support team is here to assist you with any questions
                            </p>
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium text-sm">
                                    <FaPhone />
                                    Call Support
                                </button>
                                <button className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium text-sm">
                                    <FaEnvelope />
                                    Email Support
                                </button>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8"
                    >
                        <p className="text-gray-600 mb-4">Quote ID: {quoteId}</p>
                        <p className="text-sm text-gray-500">
                            Save this page for your records. You'll also receive a confirmation email with all details.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default QuoteAccepted;
