import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { qrCodesAPI } from '../utils/api';

const QRCodeContact = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [qrInfo, setQrInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    finder_name: '',
    finder_email: '',
    message: ''
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadQRInfo();
  }, [code]);

  const loadQRInfo = async () => {
    try {
      setLoading(true);
      const data = await qrCodesAPI.getQRInfo(code);
      setQrInfo(data);
    } catch (err) {
      console.error('Error loading QR info:', err);
      setResult({ success: false, message: 'Invalid QR code' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      setResult({ success: false, message: 'Please enter a message' });
      return;
    }

    try {
      setSubmitting(true);
      setResult(null);
      const response = await qrCodesAPI.contactQROwner(code, formData);
      setResult({ success: true, message: response.message || 'Your message has been sent! The owner will be notified.' });
      setFormData({ finder_name: '', finder_email: '', message: '' });
    } catch (err) {
      setResult({ success: false, message: err.message || 'Failed to send message' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 gabarito">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4278ff] mb-4"></div>
          <div className="text-[#2f303c] text-xl font-bold">Loading...</div>
        </div>
      </div>
    );
  }

  if (!qrInfo && result && !result.success) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 gabarito">
        <div className="card bg-white rounded-xl shadow-md w-full max-w-md border border-gray-200">
          <div className="text-center p-6">
            <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-8 h-8 text-red-600">
                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">Invalid QR Code</h1>
            <p className="text-sm text-gray-600 mb-6">{result.message}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-[#4278ff] text-white text-sm font-medium py-2.5 rounded hover:bg-[#3a6ce0] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4278ff] focus:ring-offset-1"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 gabarito">
      <div className="card bg-white rounded-xl shadow-md w-full max-w-lg border border-gray-200">
        {/* Header */}
        <div className="text-center pt-6 pb-4 px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
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
            <h1 className="text-2xl font-bold text-black">Reunite</h1>
          </div>
          <h2 className="text-xl font-bold text-black mb-1">Item Found</h2>
          <p className="text-sm text-gray-600">
            This item belongs to someone. Please fill out the form below to contact the owner.
          </p>
        </div>

        <div className="px-6 pb-6">
          {qrInfo?.lost_item && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-xs font-medium text-gray-700 mb-1">Linked Item</p>
              <p className="text-sm font-semibold text-black">{qrInfo.lost_item.title}</p>
              {qrInfo.lost_item.description && (
                <p className="text-xs text-gray-600 mt-1">{qrInfo.lost_item.description}</p>
              )}
            </div>
          )}

          {qrInfo?.contact_info && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs font-medium text-gray-700 mb-1">Contact Information</p>
              <p className="text-sm font-semibold text-black">{qrInfo.contact_info}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="section-header text-xs font-medium text-gray-700 mb-1 block">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.finder_name}
                onChange={(e) => setFormData({ ...formData, finder_name: e.target.value })}
                required
                placeholder="Enter your name"
                className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-[#4278ff] focus:ring-1 focus:ring-[#4278ff]"
              />
            </div>

            <div className="mb-3">
              <label className="section-header text-xs font-medium text-gray-700 mb-1 block">
                Your Email (Optional)
              </label>
              <input
                type="email"
                value={formData.finder_email}
                onChange={(e) => setFormData({ ...formData, finder_email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-[#4278ff] focus:ring-1 focus:ring-[#4278ff]"
              />
            </div>

            <div className="mb-4">
              <label className="section-header text-xs font-medium text-gray-700 mb-1 block">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                placeholder="I found your item! How can I return it to you?"
                className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-[#4278ff] focus:ring-1 focus:ring-[#4278ff] resize-none"
              />
            </div>

            {result && (
              <div className={`mb-4 p-3 rounded text-sm ${
                result.success 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{result.message}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#4278ff] text-white text-sm font-medium py-2.5 rounded hover:bg-[#3a6ce0] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4278ff] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QRCodeContact;
