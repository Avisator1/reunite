import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthTokens } from '../utils/api';

const Sidebar = ({ activeTab, onTabChange, user, onLogout, isMobileOpen, onMobileClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthTokens();
    if (onLogout) {
      onLogout();
    } else {
      navigate('/');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: '🏠', color: 'blue' },
    { id: 'found', label: 'Found Items', icon: '🔍', color: 'emerald' },
    { id: 'lost', label: 'Lost Items', icon: '📢', color: 'rose' },
    { id: 'claims', label: 'My Claims', icon: '📋', color: 'blue' },
    { id: 'matches', label: 'AI Matches', icon: '🤖', color: 'purple' },
    { id: 'qr-codes', label: 'My QR Codes', icon: '📱', color: 'amber' },
    { id: 'rewards', label: 'Rewards', icon: '🏆', color: 'yellow' },
    { id: 'chat', label: 'AI Chat', icon: '💬', color: 'indigo' },
  ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileOpen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.sidebar-container') && !e.target.closest('.mobile-menu-button')) {
          onMobileClose?.();
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobileOpen, onMobileClose]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
      )}
      
      {/* Sidebar */}
      <div className={`sidebar-container w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col shadow-sm z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 text-[#4278ff]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-extrabold text-lg text-[#2f303c]">Reunite</span>
        </a>
        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 text-[#5C5B61]">
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
          </svg>
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="text-[#4278ff] font-bold text-sm">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#2f303c] truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-[#5C5B61] truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const handleClick = () => {
            if (item.id === 'dashboard') {
              navigate('/dashboard');
            } else if (item.id === 'found') {
              navigate('/dashboard/found');
            } else if (item.id === 'lost') {
              navigate('/dashboard/lost');
            } else if (item.id === 'claims') {
              navigate('/dashboard/claims');
            } else if (item.id === 'qr-codes') {
              navigate('/dashboard/qr-codes');
            } else if (item.id === 'matches') {
              navigate('/dashboard/matches');
            } else if (item.id === 'rewards') {
              navigate('/dashboard/rewards');
            } else if (item.id === 'chat') {
              navigate('/dashboard/chat');
            } else {
              navigate('/dashboard');
              if (onTabChange) {
                onTabChange(item.id);
              }
            }
          };
          return (
            <button
              key={item.id}
              onClick={() => {
                handleClick();
                onMobileClose?.(); // Close mobile menu on navigation
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold text-sm ${
                isActive
                  ? `bg-[#4278ff] text-white shadow-lg shadow-[#4278ff]/20`
                  : 'text-[#5C5B61] hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#5C5B61] hover:bg-rose-50 hover:text-rose-600 transition-all font-semibold text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M2 2.75A.75.75 0 0 1 2.75 2h5.5a.75.75 0 0 1 0 1.5H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06L3.5 4.56v3.69a.75.75 0 0 1-1.5 0v-5.5Zm10.22 3.97a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 1 1-1.06-1.06l1.97-1.97H8.75a.75.75 0 0 1 0-1.5h5.44l-1.97-1.97a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
