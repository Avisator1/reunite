import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, setAuthTokens } from '../utils/api';

const ReuniteSignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    joinCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        joinCode: formData.joinCode
      });

      // Store tokens
      setAuthTokens(response.access_token, response.refresh_token);
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ececec] flex items-center justify-center p-4 gabarito">
      <div className="card bg-white rounded-xl shadow-md w-full max-w-sm border border-gray-200">
        {/* Reunite Text at Top */}
        <div className="text-center pt-6 pb-4">
          <h1 className="text-2xl font-bold text-black">Reunite</h1>
          <p className="text-sm text-gray-600 mt-1">Create your account</p>
        </div>

        <div className="provider px-6 pb-6">
          <form onSubmit={handleSubmit}>

            {/* Compact Name Fields */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="section-header text-xs font-medium text-gray-700 mb-1 block" htmlFor="input-first-name">
                  First Name
                </label>
                <input 
                  id="input-first-name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-[#4278ff] focus:ring-1 focus:ring-[#4278ff]"
                />
              </div>
              <div className="flex-1">
                <label className="section-header text-xs font-medium text-gray-700 mb-1 block" htmlFor="input-last-name">
                  Last Name
                </label>
                <input 
                  id="input-last-name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-[#4278ff] focus:ring-1 focus:ring-[#4278ff]"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label className="section-header text-xs font-medium text-gray-700 mb-1 block" htmlFor="input-email">
                Email
              </label>
              <input 
                id="input-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
                className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-[#4278ff] focus:ring-1 focus:ring-[#4278ff]"
              />
            </div>

            {/* Password Fields */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="section-header text-xs font-medium text-gray-700 mb-1 block" htmlFor="input-password">
                  Password
                </label>
                <input 
                  id="input-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength="8"
                  className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-[#4278ff] focus:ring-1 focus:ring-[#4278ff]"
                />
              </div>
              <div className="flex-1">
                <label className="section-header text-xs font-medium text-gray-700 mb-1 block" htmlFor="input-confirm-password">
                  Confirm Password
                </label>
                <input 
                  id="input-confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength="8"
                  className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-[#4278ff] focus:ring-1 focus:ring-[#4278ff]"
                />
              </div>
            </div>

            {/* Join Code Field (Optional) */}
            <div className="mb-4">
              <label className="section-header text-xs font-medium text-gray-700 mb-1 block" htmlFor="input-join-code">
                School Join Code <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input 
                id="input-join-code"
                type="text"
                name="joinCode"
                value={formData.joinCode}
                onChange={handleChange}
                placeholder="ABC123"
                maxLength="6"
                className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-[#4278ff] focus:ring-1 focus:ring-[#4278ff] uppercase"
                style={{ textTransform: 'uppercase' }}
              />
              <p className="text-xs text-gray-500 mt-1">Enter your school's join code if you have one</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              id="submitButton" 
              type="submit"
              disabled={loading}
              className="w-full bg-[#4278ff] text-white text-sm font-medium py-2.5 rounded hover:bg-[#3a6ce0] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4278ff] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="text-[#4278ff] font-medium hover:text-[#3a6ce0] transition-colors duration-200"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReuniteSignupForm;