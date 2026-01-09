import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, setAuthTokens } from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const response = await authAPI.login(formData.email, formData.password);

      // Verify we got tokens
      if (!response.access_token || !response.refresh_token) {
        throw new Error('Login failed: No tokens received from server');
      }

      // Store tokens
      setAuthTokens(response.access_token, response.refresh_token);
      
      // Small delay to ensure tokens are stored
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
          <p className="text-sm text-gray-600 mt-1">Sign in to your account</p>
        </div>

        <div className="provider px-6 pb-6">
          <form onSubmit={handleSubmit}>
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

            {/* Password Field */}
            <div className="mb-4">
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
                className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-[#4278ff] focus:ring-1 focus:ring-[#4278ff]"
              />
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-[#4278ff] font-medium hover:text-[#3a6ce0] transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Admin Login Hint */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            <strong>Admin Login:</strong> admin@reunite.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

