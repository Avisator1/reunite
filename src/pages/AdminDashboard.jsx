import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, authAPI, clearAuthTokens } from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if token exists before making request
      const token = localStorage.getItem('access_token');
      if (!token) {
        clearAuthTokens();
        navigate('/login');
        return;
      }
      
      const userData = await authAPI.getCurrentUser();
      setUser(userData.user);

      if (userData.user.role === 'admin') {
        const schoolsData = await adminAPI.getSchools();
        setSchools(schoolsData.schools);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      if (err.status === 401 || err.status === 403 || err.status === 422 || 
          err.message.includes('401') || err.message.includes('403') || 
          err.message.includes('422') || err.message.includes('missing') || 
          err.message.includes('Invalid token') || err.message.includes('No authentication')) {
        clearAuthTokens();
        navigate('/login');
      } else {
        setError(err.message || 'Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();
    if (!newSchoolName.trim()) {
      setError('School name is required');
      return;
    }

    try {
      setCreating(true);
      setError('');
      const response = await adminAPI.createSchool(newSchoolName.trim());
      setSchools([...schools, response.school]);
      setNewSchoolName('');
      setShowCreateModal(false);
    } catch (err) {
      setError(err.message || 'Failed to create school');
    } finally {
      setCreating(false);
    }
  };

  const handleRegenerateCode = async (schoolId) => {
    try {
      const response = await adminAPI.regenerateJoinCode(schoolId);
      setSchools(schools.map(school => 
        school.id === schoolId 
          ? { ...school, join_code: response.join_code }
          : school
      ));
    } catch (err) {
      setError(err.message || 'Failed to regenerate join code');
    }
  };

  const handleLogout = () => {
    clearAuthTokens();
    navigate('/');
  };

  const copyToClipboard = (text, schoolId) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(schoolId);
    setTimeout(() => setCopiedCode(null), 2000);
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
    <div className="min-h-screen bg-base-100 gabarito">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
              <span className="hidden sm:inline text-[#5C5B61] text-sm ml-2">/ Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-emerald-100/70 text-emerald-700 px-3 py-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M8.5 1.709a.75.75 0 0 0-1 0 8.963 8.963 0 0 1-4.84 2.217.75.75 0 0 0-.654.72 10.499 10.499 0 0 0 5.647 9.672.75.75 0 0 0 .694-.001 10.499 10.499 0 0 0 5.647-9.672.75.75 0 0 0-.654-.719A8.963 8.963 0 0 1 8.5 1.71Zm2.34 5.504a.75.75 0 0 0-1.18-.926L7.394 9.17l-1.156-.99a.75.75 0 1 0-.976 1.138l1.75 1.5a.75.75 0 0 0 1.078-.106l2.75-3.5Z" clipRule="evenodd"></path>
                </svg>
                <span className="text-sm font-semibold">Admin</span>
              </div>
              <span className="text-sm text-[#5C5B61]">
                {user?.first_name} {user?.last_name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-[#4278ff] hover:text-[#3a6ce0] font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-rose-100/75 border border-rose-200 rounded-xl text-rose-700 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#2f303c] tracking-tight">School Organizations</h2>
              <p className="text-[#5C5B61] mt-2">Manage your schools and generate join codes for students</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="group inline-flex items-center gap-2 bg-[#4278ff] text-white px-6 py-3 rounded-xl hover:bg-[#3a6ce0] transition-all duration-200 font-semibold shadow-lg shadow-[#4278ff]/20 hover:shadow-xl hover:shadow-[#4278ff]/30 active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
              </svg>
              Create School
            </button>
          </div>
          
          {/* Stats */}
          {schools.length > 0 && (
            <div className="flex gap-6 text-sm text-[#5C5B61]">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#4278ff]">
                  <path d="M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10.9 12.006c.11.542-.348.994-.9.994H2c-.553 0-1.01-.452-.902-.994a5.002 5.002 0 0 1 9.803 0ZM14.002 12h-1.59a2.556 2.556 0 0 0-.04-.29 6.476 6.476 0 0 0-1.167-2.603 3.002 3.002 0 0 1 3.633 1.911c.18.522-.283.982-.836.982ZM12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                </svg>
                <span><strong className="font-semibold text-[#2f303c]">{schools.reduce((acc, s) => acc + (s.member_count || 0), 0)}</strong> Total Members</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#4278ff]">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <span><strong className="font-semibold text-[#2f303c]">{schools.length}</strong> Active {schools.length === 1 ? 'School' : 'Schools'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Schools Grid */}
        {schools.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="max-w-md mx-auto">
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
              <h3 className="text-xl font-bold text-[#2f303c] mb-2">No schools yet</h3>
              <p className="text-[#5C5B61] mb-6">Create your first school organization to get started with Reunite</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="group inline-flex items-center gap-2 bg-[#4278ff] text-white px-6 py-3 rounded-xl hover:bg-[#3a6ce0] transition-all duration-200 font-semibold shadow-lg shadow-[#4278ff]/20 hover:shadow-xl hover:shadow-[#4278ff]/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                  <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                </svg>
                Create Your First School
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <div
                key={school.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-[#4278ff]/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#2f303c] mb-1 group-hover:text-[#4278ff] transition-colors">{school.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-[#5C5B61]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10.9 12.006c.11.542-.348.994-.9.994H2c-.553 0-1.01-.452-.902-.994a5.002 5.002 0 0 1 9.803 0ZM14.002 12h-1.59a2.556 2.556 0 0 0-.04-.29 6.476 6.476 0 0 0-1.167-2.603 3.002 3.002 0 0 1 3.633 1.911c.18.522-.283.982-.836.982ZM12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                      </svg>
                      <span className="font-medium">{school.member_count || 0} {school.member_count === 1 ? 'member' : 'members'}</span>
                    </div>
                  </div>
                  <div className="bg-emerald-100/70 text-emerald-700 px-2 py-1 rounded-lg text-xs font-semibold">
                    Active
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-[#5C5B61] uppercase tracking-wide">Join Code</label>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-gradient-to-br from-[#4278ff]/5 to-[#06ABAB]/5 px-4 py-3 rounded-lg border border-[#4278ff]/20">
                        <code className="font-mono text-lg font-bold text-[#4278ff] tracking-wider">
                          {school.join_code}
                        </code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(school.join_code, school.id)}
                        className="p-3 hover:bg-[#4278ff]/10 rounded-lg transition-colors relative group/btn"
                        title="Copy to clipboard"
                      >
                        {copiedCode === school.id ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 text-emerald-600">
                            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-[#4278ff]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRegenerateCode(school.id)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-[#4278ff] hover:text-white font-semibold py-2.5 border-2 border-[#4278ff] rounded-lg hover:bg-[#4278ff] transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z" clipRule="evenodd" />
                    </svg>
                    Regenerate Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create School Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 text-[#4278ff]">
                    <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2f303c]">Create New School</h3>
                  <p className="text-sm text-[#5C5B61]">Add a new school organization</p>
                </div>
              </div>
              
              <form onSubmit={handleCreateSchool}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#2f303c] mb-2">
                    School Name
                  </label>
                  <input
                    type="text"
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    placeholder="e.g., Lincoln High School"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#4278ff] focus:ring-4 focus:ring-[#4278ff]/10 transition-all"
                    autoFocus
                  />
                  <p className="text-xs text-[#5C5B61] mt-2">Students will use this name to identify your school</p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewSchoolName('');
                      setError('');
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm text-[#2f303c]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 bg-[#4278ff] text-white px-4 py-3 rounded-lg hover:bg-[#3a6ce0] transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4278ff]/20"
                  >
                    {creating ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : 'Create School'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

