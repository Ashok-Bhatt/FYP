import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import PlanJourney from '../pages/PlanJourney';
import ThankYou from '../pages/ThankYou';

// Layouts
import AgentLayout from '../layouts/AgentLayout';
import PartnerLayout from '../layouts/PartnerLayout';
import TravelerLayout from '../layouts/TravelerLayout';

// Agent Pages
import AgentDashboard from '../pages/agent/AgentDashboard';
import RequirementDetails from '../pages/agent/RequirementDetails';
import QuoteEditor from '../pages/agent/QuoteEditor';
import QuotesList from '../pages/agent/QuotesList';
import AgentAnalytics from '../pages/agent/AgentAnalytics';

// Partner Pages
import PartnerDashboard from '../pages/partner/PartnerDashboard';
import Inventory from '../pages/partner/Inventory';
import PartnerProfile from '../pages/partner/PartnerProfile';
import PartnerQuotes from '../pages/partner/PartnerQuotes';

// Traveler Pages
import TravelerDashboard from '../pages/traveler/TravelerDashboard';
import TravelerQuotes from '../pages/traveler/TravelerQuotes';

// Public Pages
import PublicQuoteView from '../pages/PublicQuoteView';
import QuoteAccepted from '../pages/public/QuoteAccepted';
import QuoteComparePage from '../pages/public/QuoteComparePage';

// Components
import ProtectedRoute from './ProtectedRoute';

const AnimatedRoutes: React.FC = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/thank-you" element={<ThankYou />} />

                {/* Public View */}
                <Route path="/quote/view/:token" element={<PublicQuoteView />} />
                <Route path="/quote/accepted/:quoteId" element={<QuoteAccepted />} />
                <Route path="/quote/compare/:token" element={<QuoteComparePage />} />

                {/* Agent Routes */}
                <Route path="/agent" element={
                    <ProtectedRoute role="AGENT">
                        <AgentLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<AgentDashboard />} />
                    <Route path="dashboard" element={<AgentDashboard />} />
                    <Route path="requirement/:id" element={<RequirementDetails />} />
                    <Route path="quote/:id" element={<QuoteEditor />} />
                    <Route path="quotes" element={<QuotesList />} />
                    <Route path="analytics" element={<AgentAnalytics />} />
                </Route>

                {/* Partner Routes */}
                <Route path="/partner" element={
                    <ProtectedRoute role="PARTNER">
                        <PartnerLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<PartnerDashboard />} />
                    <Route path="dashboard" element={<PartnerDashboard />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="profile" element={<PartnerProfile />} />
                    <Route path="quotes" element={<PartnerQuotes />} />
                </Route>

                {/* Traveler Routes */}
                <Route path="/traveler" element={
                    <ProtectedRoute role="USER">
                        <TravelerLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<TravelerDashboard />} />
                    <Route path="dashboard" element={<TravelerDashboard />} />
                    <Route path="quotes" element={<TravelerQuotes />} />
                    <Route path="quotes/:requirementId" element={<TravelerQuotes />} />
                    <Route path="plan-journey" element={<PlanJourney />} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
