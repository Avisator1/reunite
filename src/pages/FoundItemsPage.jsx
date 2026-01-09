import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FoundItems from '../components/FoundItems';
import Sidebar from '../components/Sidebar';
import { authAPI, clearAuthTokens } from '../utils/api';

const FoundItemsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData.user);
    } catch (err) {
      console.error('Error loading user:', err);
      clearAuthTokens();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthTokens();
    navigate('/');
  };

  const handleTabChange = (tab) => {
    if (tab === 'found') {
      navigate('/dashboard/found');
    } else if (tab === 'lost') {
      navigate('/dashboard/lost');
    } else if (tab === 'claims') {
      navigate('/dashboard/claims');
    } else if (tab === 'qr-codes') {
      navigate('/dashboard/qr-codes');
    } else if (tab === 'matches') {
      navigate('/dashboard/matches');
    } else if (tab === 'rewards') {
      navigate('/dashboard/rewards');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center gabarito">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4278ff] mb-4"></div>
          <div className="text-[#2f303c] text-xl font-bold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 gabarito flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 text-[#2f303c]">
          <path fillRule="evenodd" d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
        </svg>
      </button>

      <Sidebar 
        activeTab="found" 
        onTabChange={handleTabChange}
        user={user}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 lg:ml-64 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <FoundItems key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundItemsPage;
