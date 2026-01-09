import React, { useState, useEffect, useRef } from 'react';
import { claimsAPI, messagesAPI } from '../utils/api';

const ClaimDetail = ({ claim, currentUserId, onClose, onUpdate }) => {
  const [currentClaim, setCurrentClaim] = useState(claim);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [proofPhoto, setProofPhoto] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const isClaimant = currentClaim.claimant_id === currentUserId;
  const isFinder = currentClaim.found_item?.user_id === currentUserId;
  const canApprove = isFinder || false; // Add admin check if needed

  useEffect(() => {
    setCurrentClaim(claim); // Update current claim when prop changes
  }, [claim]);

  useEffect(() => {
    loadMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [currentClaim.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const data = await messagesAPI.getMessages(currentClaim.id);
      setMessages(data.messages || []);
      setLoading(false);
    } catch (err) {
      console.error('Error loading messages:', err);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await messagesAPI.sendMessage(currentClaim.id, newMessage.trim());
      setNewMessage('');
      await loadMessages();
    } catch (err) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleUploadProof = async () => {
    if (!proofPhoto) {
      alert('Please select a photo first');
      return;
    }

    try {
      setUploadingPhoto(true);
      const result = await claimsAPI.verifyClaim(currentClaim.id, proofPhoto);
      // Update the current claim with the response data
      if (result.claim) {
        setCurrentClaim(result.claim);
      }
      alert('Proof photo uploaded successfully!');
      setProofPhoto(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUpdate();
    } catch (err) {
      alert(err.message || 'Failed to upload proof photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleApproveClaim = async () => {
    if (!window.confirm('Are you sure you want to approve this claim? This will mark the item as returned.')) {
      return;
    }

    try {
      const result = await claimsAPI.approveClaim(currentClaim.id);
      // Update the current claim with the response data
      if (result.claim) {
        setCurrentClaim(result.claim);
      }
      alert('Claim approved successfully!');
      onUpdate(); // Refresh the parent list
      // Don't close immediately - let user see the updated status
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to approve claim');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-lg p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 text-[#4278ff]">
                <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#2f303c]">Claim Details</h3>
              <p className="text-sm text-[#5C5B61]">Coordinate with {isClaimant ? 'finder' : 'claimant'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 text-[#5C5B61]">
              <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Side - Item Info */}
          <div className="w-1/3 border-r border-gray-100 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Found Item */}
              <div>
                <h4 className="text-sm font-semibold text-[#5C5B61] uppercase mb-3">Found Item</h4>
              {currentClaim.found_item?.photo_url && (
                <img
                  src={`https://reunite.adiavi.com/${currentClaim.found_item.photo_url}`}
                  alt={currentClaim.found_item.title}
                  className="w-full h-48 object-cover rounded-lg border border-gray-200 mb-3"
                />
              )}
                <h5 className="font-bold text-[#2f303c] mb-1">{currentClaim.found_item?.title}</h5>
                <p className="text-sm text-[#5C5B61] mb-2">{currentClaim.found_item?.description}</p>
                <div className="flex flex-wrap gap-2">
                  {claim.found_item?.category && (
                    <span className="bg-[#4278ff]/10 text-[#4278ff] px-2 py-0.5 rounded text-xs">
                      {claim.found_item.category}
                    </span>
                  )}
                  {claim.found_item?.color && (
                    <span className="bg-gray-100 text-[#5C5B61] px-2 py-0.5 rounded text-xs">
                      {claim.found_item.color}
                    </span>
                  )}
                </div>
              </div>

              {/* Lost Item */}
              <div>
                <h4 className="text-sm font-semibold text-[#5C5B61] uppercase mb-3">Your Lost Item</h4>
              {currentClaim.lost_item?.photo_url && (
                <img
                  src={`https://reunite.adiavi.com/${currentClaim.lost_item.photo_url}`}
                  alt={currentClaim.lost_item.title}
                  className="w-full h-48 object-cover rounded-lg border border-gray-200 mb-3"
                />
              )}
                <h5 className="font-bold text-[#2f303c] mb-1">{currentClaim.lost_item?.title}</h5>
                <p className="text-sm text-[#5C5B61] mb-2">{currentClaim.lost_item?.description}</p>
              </div>

              {/* Verification Answer */}
              {currentClaim.verification_answer && (
                <div>
                  <h4 className="text-sm font-semibold text-[#5C5B61] uppercase mb-2">Verification</h4>
                  <p className="text-sm text-[#2f303c] bg-gray-50 p-3 rounded-lg">
                    {currentClaim.verification_answer}
                  </p>
                </div>
              )}

              {/* Status */}
              <div>
                <h4 className="text-sm font-semibold text-[#5C5B61] uppercase mb-2">Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#5C5B61]">Claim Status:</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      currentClaim.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      currentClaim.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {currentClaim.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#5C5B61]">Verification:</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      currentClaim.verification_status === 'verified' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {currentClaim.verification_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Proof Photo */}
              {currentClaim.proof_photo_url && (
                <div>
                  <h4 className="text-sm font-semibold text-[#5C5B61] uppercase mb-2">Proof Photo</h4>
                  <img
                    src={`https://reunite.adiavi.com/${currentClaim.proof_photo_url}`}
                    alt="Proof"
                    className="w-full rounded-lg border border-gray-200 mb-2"
                  />
                </div>
              )}

              {/* Proof Photo Upload (for claimant) */}
              {isClaimant && !currentClaim.proof_photo_url && (
                <div>
                  <h4 className="text-sm font-semibold text-[#5C5B61] uppercase mb-2">Upload Proof</h4>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofPhoto(e.target.files[0])}
                    className="text-sm mb-2"
                  />
                  {proofPhoto && (
                    <button
                      onClick={handleUploadProof}
                      disabled={uploadingPhoto}
                      className="w-full bg-[#4278ff] text-white px-4 py-2 rounded-lg hover:bg-[#3a6ce0] transition-colors font-semibold text-sm disabled:opacity-50"
                    >
                      {uploadingPhoto ? 'Uploading...' : 'Upload Proof Photo'}
                    </button>
                  )}
                </div>
              )}

              {/* Approve Button (for finder) */}
              {canApprove && currentClaim.status === 'pending' && (
                <button
                  onClick={handleApproveClaim}
                  className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-sm"
                >
                  ✓ Approve Claim
                </button>
              )}
            </div>
          </div>

          {/* Right Side - Messages */}
          <div className="flex-1 flex flex-col">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="text-center py-8 text-[#5C5B61]">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-8 h-8 text-[#4278ff]">
                      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                      <path fillRule="evenodd" d="M1.38 8.6a1 1 0 0 1-.63-1.897L2.912 5.5 1.38 3.297a1 1 0 0 1 .24-1.397l.5-.375a1 1 0 0 1 1.396.24L8.5 6.942l5.484-5.187a1 1 0 0 1 1.396-.24l.5.375a1 1 0 0 1 .24 1.397L13.088 5.5l1.532 2.203a1 1 0 0 1-.24 1.397l-.5.375a1 1 0 0 1-1.396-.24L8.5 4.058l-5.484 5.187a1 1 0 0 1-1.396.24l-.5-.375a1 1 0 0 1-.24-1.397L4.912 8.5 3.38 6.297a1 1 0 0 1 .24-1.397l.5-.375a1 1 0 0 1 1.396.24L8.5 6.942l3.384-3.177a1 1 0 0 1 1.396-.24l.5.375a1 1 0 0 1 .24 1.397L12.088 6.5l1.532 2.203a1 1 0 0 1-.24 1.397l-.5.375a1 1 0 0 1-1.396-.24L8.5 6.058l-3.384 3.177a1 1 0 0 1-1.396.24l-.5-.375a1 1 0 0 1-.24-1.397L4.912 8.5 3.38 6.297Z" />
                    </svg>
                  </div>
                  <p className="text-[#5C5B61]">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender_id === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isOwn
                            ? 'bg-[#4278ff] text-white'
                            : 'bg-gray-100 text-[#2f303c]'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          isOwn ? 'text-blue-100' : 'text-[#5C5B61]'
                        }`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-100 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#4278ff] focus:ring-4 focus:ring-[#4278ff]/10 transition-all"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="bg-[#4278ff] text-white px-6 py-2 rounded-lg hover:bg-[#3a6ce0] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? '...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetail;
