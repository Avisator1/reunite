import React, { useState, useEffect } from 'react';
import { qrCodesAPI, itemsAPI } from '../utils/api';

const MyQRCodes = ({ currentUserId }) => {
  const [qrCodes, setQRCodes] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLostItem, setSelectedLostItem] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [activeTab, setActiveTab] = useState('codes'); // 'codes' or 'messages'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [qrData, lostData, messagesData] = await Promise.all([
        qrCodesAPI.getMyQRCodes().catch(() => ({ qr_codes: [] })),
        itemsAPI.getLostItems().catch(() => ({ items: [] })),
        qrCodesAPI.getContactMessages().catch(() => ({ messages: [] }))
      ]);
      setQRCodes(qrData.qr_codes || []);
      setLostItems(lostData.items?.filter(item => item.status === 'active') || []);
      setContactMessages(messagesData.messages || []);
    } catch (err) {
      console.error('Error loading QR codes:', err);
      setError(err.message || 'Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQR = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await qrCodesAPI.createQRCode(
        selectedLostItem || null,
        contactInfo || null
      );
      alert('QR code created successfully! Print it and attach it to your items.');
      setShowCreateModal(false);
      setSelectedLostItem('');
      setContactInfo('');
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create QR code');
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = async (qrCode) => {
    try {
      const qrUrl = `http://localhost:5000${qrCode.qr_image_url}`;
      
      // Fetch the image
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${qrCode.code}.png`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading QR code:', err);
      alert('Failed to download QR code. Please try again.');
    }
  };

  const handleDelete = async (qrId, e) => {
    e.stopPropagation(); // Prevent any parent click handlers
    
    if (!window.confirm('Are you sure you want to delete this QR code? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(qrId);
      await qrCodesAPI.deleteQRCode(qrId);
      // Remove from local state
      setQRCodes(qrCodes.filter(qr => qr.id !== qrId));
    } catch (err) {
      alert(err.message || 'Failed to delete QR code');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4278ff] mb-4"></div>
        <div className="text-[#5C5B61]">Loading your QR codes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[#2f303c] mb-2">My QR Codes</h2>
            <p className="text-[#5C5B61]">Create QR codes to attach to your items. If found, scanners can contact you.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-amber-200 shadow-sm">
              <span className="text-lg font-bold text-amber-700">{qrCodes.length} {qrCodes.length === 1 ? 'code' : 'codes'}</span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#4278ff] text-white px-5 py-2.5 rounded-lg hover:bg-[#3a6ce0] transition-colors font-semibold text-sm flex items-center gap-2 shadow-lg shadow-[#4278ff]/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
              </svg>
              Create QR Code
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 border-b border-amber-200">
          <button
            onClick={() => setActiveTab('codes')}
            className={`px-4 py-2 font-semibold text-sm transition-colors ${
              activeTab === 'codes'
                ? 'text-amber-700 border-b-2 border-amber-700'
                : 'text-[#5C5B61] hover:text-amber-700'
            }`}
          >
            My QR Codes ({qrCodes.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 font-semibold text-sm transition-colors relative ${
              activeTab === 'messages'
                ? 'text-amber-700 border-b-2 border-amber-700'
                : 'text-[#5C5B61] hover:text-amber-700'
            }`}
          >
            Contact Messages ({contactMessages.length})
            {contactMessages.filter(m => !m.is_read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {contactMessages.filter(m => !m.is_read).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'messages' ? (
        <div className="space-y-4">
          {contactMessages.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-10 h-10 text-[#4278ff]">
                  <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0Z" />
                  <path d="M6.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L7.5 10.793 8.854 9.54a.5.5 0 0 0-.708-.708l-1.5 1.5a.5.5 0 0 0 0 .708Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#2f303c] mb-2">No messages yet</h3>
              <p className="text-[#5C5B61]">When someone scans your QR code and sends a message, it will appear here.</p>
            </div>
          ) : (
            contactMessages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-white rounded-xl border p-6 shadow-sm ${
                  !msg.is_read ? 'border-amber-300 bg-amber-50/30' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-[#2f303c]">{msg.finder_name}</h3>
                      {!msg.is_read && (
                        <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                    {msg.finder_email && (
                      <p className="text-sm text-[#5C5B61] mb-2">{msg.finder_email}</p>
                    )}
                    <p className="text-xs text-[#5C5B61]">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-[#2f303c] whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : qrCodes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-10 h-10 text-[#4278ff]">
              <path d="M3.5 1.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1Zm4 0a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1Zm4 0a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1Z" />
              <path fillRule="evenodd" d="M1.5 3A1.5 1.5 0 0 1 3 1.5h10A1.5 1.5 0 0 1 14.5 3v10a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 13V3ZM3 2.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H3ZM5 6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6Z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#2f303c] mb-2">No QR codes yet</h3>
          <p className="text-[#5C5B61] mb-6">Create QR codes to attach to your items so finders can contact you.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#4278ff] text-white px-6 py-3 rounded-lg hover:bg-[#3a6ce0] transition-colors font-semibold text-sm"
          >
            Create Your First QR Code
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <div key={qr.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all shadow-sm relative">
              {/* Delete button */}
              <button
                onClick={(e) => handleDelete(qr.id, e)}
                disabled={deleting === qr.id}
                className="absolute top-4 right-4 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50 z-10"
                title="Delete this QR code"
              >
                {deleting === qr.id ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                  </svg>
                )}
              </button>
              
              {qr.qr_image_url && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={`http://localhost:5000${qr.qr_image_url}`}
                    alt="QR Code"
                    className="w-48 h-48 border border-gray-200 rounded-lg"
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#5C5B61] mb-1">Code</p>
                  <p className="font-mono text-sm font-bold text-[#2f303c]">{qr.code}</p>
                </div>
                
                {qr.lost_item && (
                  <div>
                    <p className="text-xs text-[#5C5B61] mb-1">Linked to</p>
                    <p className="text-sm font-semibold text-[#2f303c]">{qr.lost_item.title}</p>
                  </div>
                )}
                
                {qr.contact_info && (
                  <div>
                    <p className="text-xs text-[#5C5B61] mb-1">Contact Info</p>
                    <p className="text-sm text-[#2f303c]">{qr.contact_info}</p>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleDownload(qr)}
                    className="w-full bg-[#4278ff] text-white px-4 py-2 rounded-lg hover:bg-[#3a6ce0] transition-colors font-semibold text-sm"
                  >
                    Download QR Code
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create QR Code Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 text-[#4278ff]">
                    <path d="M3.5 1.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1Zm4 0a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1Zm4 0a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1Z" />
                    <path fillRule="evenodd" d="M1.5 3A1.5 1.5 0 0 1 3 1.5h10A1.5 1.5 0 0 1 14.5 3v10a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 13V3ZM3 2.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H3ZM5 6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2f303c]">Create QR Code</h3>
                  <p className="text-sm text-[#5C5B61]">Generate a QR code for your items</p>
                </div>
              </div>

              <form onSubmit={handleCreateQR}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#2f303c] mb-2">
                    Link to Lost Item (Optional)
                  </label>
                  <select
                    value={selectedLostItem}
                    onChange={(e) => setSelectedLostItem(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#4278ff] focus:ring-4 focus:ring-[#4278ff]/10 transition-all"
                  >
                    <option value="">None - General QR Code</option>
                    {lostItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.title} - {item.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#2f303c] mb-2">
                    Contact Info (Optional)
                  </label>
                  <textarea
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#4278ff] focus:ring-4 focus:ring-[#4278ff]/10 transition-all"
                    placeholder="e.g., Email: your@email.com, Phone: (555) 123-4567"
                  />
                  <p className="text-xs text-[#5C5B61] mt-2">
                    This will be shown to people who scan your QR code
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setSelectedLostItem('');
                      setContactInfo('');
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
                    {creating ? 'Creating...' : 'Create QR Code'}
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

export default MyQRCodes;
