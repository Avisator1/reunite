import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, studentAPI, rewardsAPI, itemsAPI, claimsAPI, qrCodesAPI, clearAuthTokens } from '../utils/api';
import ReportLostItem from '../components/ReportLostItem';
import ReportFoundItem from '../components/ReportFoundItem';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [activeTab] = useState('dashboard');
  const [showReportLost, setShowReportLost] = useState(false);
  const [showReportFound, setShowReportFound] = useState(false);
  const [points, setPoints] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    lostItems: 0,
    foundItems: 0,
    myClaims: 0,
    matches: 0,
    qrCodes: 0
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const userData = await authAPI.getCurrentUser();
      setUser(userData.user);

      if (userData.user.role === 'admin') {
        navigate('/admin');
        return;
      }

      // Load school info if user is in a school
      try {
        const schoolData = await studentAPI.getMySchool();
        setSchool(schoolData.school);
        
        // Load points if in school
        try {
          const pointsData = await rewardsAPI.getMyPoints();
          setPoints(pointsData.total_points || 0);
        } catch (err) {
          // Points might not be available yet
        }

        // Load statistics
        await loadStatistics();
      } catch (err) {
        // User might not be in a school yet
        if (!err.message.includes('Not a member')) {
          throw err;
        }
      }
    } catch (err) {
      if (err.status === 401 || err.status === 403 || err.message.includes('401') || err.message.includes('403') || err.message.includes('missing') || err.message.includes('Invalid token')) {
        clearAuthTokens();
        navigate('/login');
      } else {
        setError(err.message || 'Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSchool = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setError('Join code is required');
      return;
    }

    try {
      setJoining(true);
      setError('');
      const response = await studentAPI.joinSchool(joinCode.trim().toUpperCase());
      setSchool(response.school);
      setJoinCode('');
      setShowJoinModal(false);
      await loadData(); // Reload to get updated user info
    } catch (err) {
      setError(err.message || 'Failed to join school');
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveSchool = async () => {
    if (!window.confirm('Are you sure you want to leave this school?')) {
      return;
    }

    try {
      await studentAPI.leaveSchool();
      setSchool(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to leave school');
    }
  };

  const loadStatistics = async () => {
    try {
      const [lostData, foundData, claimsData, matchesData, qrCodesData] = await Promise.all([
        itemsAPI.getLostItems().catch(() => ({ items: [] })),
        itemsAPI.getFoundItems().catch(() => ({ items: [] })),
        claimsAPI.getMyClaims().catch(() => ({ claims: [] })),
        itemsAPI.getMatches().catch(() => ({ matches: [] })),
        qrCodesAPI.getMyQRCodes().catch(() => ({ qr_codes: [] }))
      ]);

      // Count user's lost items
      const myLostItems = lostData.items?.filter(item => item.user_id === user?.id) || [];
      
      // Count available found items
      const availableFoundItems = foundData.items?.filter(item => item.status === 'available') || [];

      setStats({
        lostItems: myLostItems.length,
        foundItems: availableFoundItems.length,
        myClaims: claimsData.claims?.length || 0,
        matches: matchesData.matches?.length || 0,
        qrCodes: qrCodesData.qr_codes?.length || 0
      });
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  const handleLogout = () => {
    clearAuthTokens();
    navigate('/');
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

      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
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
          } else {
            setActiveTab(tab);
          }
        }}
        user={user}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-rose-100/75 border border-rose-200 rounded-xl text-rose-700 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 mt-12 lg:mt-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2f303c] tracking-tight mb-2">
            Welcome back, {user?.first_name}! 👋
          </h2>
          <p className="text-sm sm:text-base text-[#5C5B61]">Manage your school and lost & found items</p>
        </div>

        {/* School Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 mb-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-lg p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 text-[#4278ff]">
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#2f303c]">School Organization</h3>
              <p className="text-sm text-[#5C5B61]">Your school membership status</p>
            </div>
          </div>
          
          {school ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 sm:p-6 border border-emerald-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1 block">School Name</label>
                    <p className="text-xl sm:text-2xl font-bold text-[#2f303c] break-words">{school.name}</p>
                  </div>
                  <div className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 self-start">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                    Member
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2 block">Join Code</label>
                  <div className="bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-emerald-200">
                    <code className="font-mono text-lg sm:text-xl font-bold text-[#4278ff] tracking-wider break-all">{school.join_code}</code>
                  </div>
                  <p className="text-xs text-emerald-700 mt-2">Share this code with other students to join</p>
                </div>
              </div>
              
              <button
                onClick={handleLeaveSchool}
                className="flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700 font-semibold transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                </svg>
                Leave School
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-[#4278ff]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-[#2f303c] mb-2">No School Yet</h4>
              <p className="text-[#5C5B61] mb-6 max-w-sm mx-auto">You're not part of any school organization yet. Join one to access lost & found features.</p>
              <button
                onClick={() => setShowJoinModal(true)}
                className="group inline-flex items-center gap-2 bg-[#4278ff] text-white px-6 py-3 rounded-xl hover:bg-[#3a6ce0] transition-all duration-200 font-semibold shadow-lg shadow-[#4278ff]/20 hover:shadow-xl hover:shadow-[#4278ff]/30 active:scale-[0.98]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                  <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                </svg>
                Join a School
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform">
                  <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Lost & Found Features */}
        {school ? (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[#2f303c]">Quick Actions</h3>
                <div className="flex items-center gap-2 bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 px-3 py-1 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#4278ff]">
                    <path d="M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10.9 12.006c.11.542-.348.994-.9.994H2c-.553 0-1.01-.452-.902-.994a5.002 5.002 0 0 1 9.803 0ZM14.002 12h-1.59a2.556 2.556 0 0 0-.04-.29 6.476 6.476 0 0 0-1.167-2.603 3.002 3.002 0 0 1 3.633 1.911c.18.522-.283.982-.836.982ZM12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                  </svg>
                  <span className="text-sm font-semibold text-[#4278ff]">{points} Points</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setShowReportLost(true)}
                  className="flex items-center gap-3 p-4 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 rounded-lg transition-colors text-left"
                >
                  <div className="bg-rose-600 text-white p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#2f303c]">Report Lost Item</div>
                    <div className="text-xs text-[#5C5B61]">AI will help find it</div>
                  </div>
                </button>
                <button
                  onClick={() => setShowReportFound(true)}
                  className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 rounded-lg transition-colors text-left"
                >
                  <div className="bg-emerald-600 text-white p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#2f303c]">Report Found Item</div>
                    <div className="text-xs text-[#5C5B61]">Earn 15 points</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-rose-100 rounded-lg p-2 sm:p-3">
                    <span className="text-xl sm:text-2xl">📢</span>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard/lost')}
                    className="text-xs sm:text-sm text-[#4278ff] hover:text-[#3a6ce0] font-semibold"
                  >
                    View →
                  </button>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2f303c] mb-1">{stats.lostItems}</h3>
                <p className="text-xs sm:text-sm text-[#5C5B61]">My Lost Items</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-emerald-100 rounded-lg p-2 sm:p-3">
                    <span className="text-xl sm:text-2xl">🔍</span>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard/found')}
                    className="text-xs sm:text-sm text-[#4278ff] hover:text-[#3a6ce0] font-semibold"
                  >
                    View →
                  </button>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2f303c] mb-1">{stats.foundItems}</h3>
                <p className="text-xs sm:text-sm text-[#5C5B61]">Available Found Items</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-blue-100 rounded-lg p-2 sm:p-3">
                    <span className="text-xl sm:text-2xl">📋</span>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard/claims')}
                    className="text-xs sm:text-sm text-[#4278ff] hover:text-[#3a6ce0] font-semibold"
                  >
                    View →
                  </button>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2f303c] mb-1">{stats.myClaims}</h3>
                <p className="text-xs sm:text-sm text-[#5C5B61]">My Claims</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-purple-100 rounded-lg p-2 sm:p-3">
                    <span className="text-xl sm:text-2xl">🤖</span>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard/matches')}
                    className="text-xs sm:text-sm text-[#4278ff] hover:text-[#3a6ce0] font-semibold"
                  >
                    View →
                  </button>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2f303c] mb-1">{stats.matches}</h3>
                <p className="text-xs sm:text-sm text-[#5C5B61]">AI Matches</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-amber-100 rounded-lg p-2 sm:p-3">
                    <span className="text-xl sm:text-2xl">📱</span>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard/qr-codes')}
                    className="text-xs sm:text-sm text-[#4278ff] hover:text-[#3a6ce0] font-semibold"
                  >
                    View →
                  </button>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2f303c] mb-1">{stats.qrCodes}</h3>
                <p className="text-xs sm:text-sm text-[#5C5B61]">My QR Codes</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-yellow-100 rounded-lg p-2 sm:p-3">
                    <span className="text-xl sm:text-2xl">🏆</span>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard/rewards')}
                    className="text-xs sm:text-sm text-[#4278ff] hover:text-[#3a6ce0] font-semibold"
                  >
                    View →
                  </button>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2f303c] mb-1">{points}</h3>
                <p className="text-xs sm:text-sm text-[#5C5B61]">Reward Points</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 text-amber-600 shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900 mb-1">Join a school to unlock these features</p>
              <p className="text-xs text-amber-700">These features will be available once you join a school organization.</p>
            </div>
          </div>
        )}

        {/* Report Lost Modal */}
        {showReportLost && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-2xl my-4">
              <ReportLostItem
                onSuccess={() => {
                  setShowReportLost(false);
                  loadData();
                  setRefreshKey(prev => prev + 1); // Force FoundItems to reload (for lost items that might match)
                }}
                onCancel={() => setShowReportLost(false)}
              />
            </div>
          </div>
        )}

        {/* Report Found Modal */}
        {showReportFound && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-2xl my-4">
              <ReportFoundItem
                onSuccess={(result) => {
                  setShowReportFound(false);
                  loadData();
                  setRefreshKey(prev => prev + 1); // Force FoundItems to reload
                  if (result?.qr_code) {
                    alert(`QR Code generated! Code: ${result.qr_code.code}`);
                  }
                }}
                onCancel={() => setShowReportFound(false)}
              />
            </div>
          </div>
        )}
        </div>

        {/* Report Lost Modal */}
        {showReportLost && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-2xl my-4">
              <ReportLostItem
                onSuccess={() => {
                  setShowReportLost(false);
                  loadData();
                  setRefreshKey(prev => prev + 1);
                }}
                onCancel={() => setShowReportLost(false)}
              />
            </div>
          </div>
        )}

        {/* Report Found Modal */}
        {showReportFound && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-2xl my-4">
              <ReportFoundItem
                onSuccess={(result) => {
                  setShowReportFound(false);
                  loadData();
                  setRefreshKey(prev => prev + 1);
                }}
                onCancel={() => setShowReportFound(false)}
              />
            </div>
          </div>
        )}

        {/* Join School Modal */}
        {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 text-[#4278ff]">
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2f303c]">Join a School</h3>
                  <p className="text-sm text-[#5C5B61]">Enter your school's join code</p>
                </div>
              </div>
              
              <form onSubmit={handleJoinSchool}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#2f303c] mb-2">
                    Join Code
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    maxLength="6"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#4278ff] focus:ring-4 focus:ring-[#4278ff]/10 transition-all font-mono text-lg font-bold tracking-wider uppercase text-center"
                    style={{ textTransform: 'uppercase' }}
                    autoFocus
                  />
                  <div className="flex items-start gap-2 mt-3 text-xs text-[#5C5B61]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5 text-[#4278ff]">
                      <path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z" clipRule="evenodd" />
                    </svg>
                    <span>Get the 6-character join code from your school administrator or teacher</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowJoinModal(false);
                      setJoinCode('');
                      setError('');
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm text-[#2f303c]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={joining}
                    className="flex-1 bg-[#4278ff] text-white px-4 py-3 rounded-lg hover:bg-[#3a6ce0] transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4278ff]/20"
                  >
                    {joining ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Joining...
                      </span>
                    ) : 'Join School'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Dashboard;

