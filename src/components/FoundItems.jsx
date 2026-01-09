import React, { useState, useEffect } from 'react';
import { itemsAPI, claimsAPI } from '../utils/api';

const FoundItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [verificationAnswer, setVerificationAnswer] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [lostItems, setLostItems] = useState([]);
  const [selectedLostItem, setSelectedLostItem] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await itemsAPI.getFoundItems();
      
      // Filter to only show available items
      const availableItems = data.items?.filter(item => item.status === 'available') || [];
      setItems(availableItems);
      
      // Also load user's lost items for claiming
      try {
        const lostData = await itemsAPI.getLostItems();
        // Filter for active lost items (not found, not deleted)
        const activeLostItems = lostData.items?.filter(item => 
          item.status === 'active' || !item.status || item.status === ''
        ) || [];
        setLostItems(activeLostItems);
      } catch (lostErr) {
        console.error('Error loading lost items:', lostErr);
        // Don't fail the whole component if lost items fail to load
        setLostItems([]);
      }
    } catch (err) {
      console.error('Error loading found items:', err);
      setError(err.message || 'Failed to load found items');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimClick = (item) => {
    setSelectedItem(item);
    setSelectedLostItem('');
    setVerificationAnswer('');
    setShowClaimModal(true);
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem || !selectedLostItem) {
      alert('Please select which lost item this matches.');
      return;
    }

    if (!verificationAnswer.trim()) {
      alert('Please provide a verification answer.');
      return;
    }

    try {
      setClaiming(true);
      const lostItemId = parseInt(selectedLostItem);
      const foundItemId = parseInt(selectedItem.id);
      
      if (isNaN(lostItemId) || isNaN(foundItemId)) {
        throw new Error('Invalid item IDs');
      }
      
      console.log('Submitting claim:', { lostItemId, foundItemId, verificationAnswer });
      const result = await claimsAPI.createClaim(lostItemId, foundItemId, verificationAnswer);
      console.log('Claim result:', result);
      
      alert('Claim submitted successfully!');
      setShowClaimModal(false);
      setSelectedItem(null);
      setVerificationAnswer('');
      setSelectedLostItem('');
      loadItems(); // Reload to update status
    } catch (err) {
      console.error('Claim error:', err);
      const errorMessage = err.message || err.error || 'Failed to create claim. Please try again.';
      alert(errorMessage);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4278ff] mb-4"></div>
        <div className="text-[#5C5B61]">Loading found items...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-10 h-10 text-[#4278ff]">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#2f303c] mb-2">No items available</h3>
        <p className="text-[#5C5B61]">No found items are currently available to claim.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-[#2f303c] mb-2">Available Found Items</h2>
            <p className="text-[#5C5B61]">Items found by others - claim if they're yours</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-emerald-200 shadow-sm">
            <span className="text-lg font-bold text-emerald-700">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all shadow-sm"
          >
            {item.photo_url && (
              <div className="mb-5">
                <img
                  src={`http://localhost:5000${item.photo_url}`}
                  alt={item.title}
                  className="w-full h-56 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#4278ff]/10 text-[#4278ff] px-2 py-0.5 rounded text-xs font-semibold uppercase">
                    {item.category}
                  </span>
                  {item.brand && (
                    <span className="text-xs text-[#5C5B61]">{item.brand}</span>
                  )}
                </div>
                <h4 className="font-bold text-[#2f303c] text-lg mb-1">{item.title}</h4>
                {item.description && (
                  <p className="text-sm text-[#5C5B61] line-clamp-2">{item.description}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-[#5C5B61]">
                {item.color && (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: item.color.toLowerCase() }}></div>
                    <span>{item.color}</span>
                  </div>
                )}
                {item.location && (
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .381-.416 22.785 22.785 0 0 0 2.046-2.982c1.101-1.679 1.758-3.342 1.758-4.937 0-3.314-2.91-6-6.5-6S1.5 3.686 1.5 7c0 1.595.657 3.258 1.758 4.937a22.784 22.784 0 0 0 2.046 2.982 5.575 5.575 0 0 0 .381.416l.012.01ZM8 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate max-w-[120px]">{item.location}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleClaimClick(item)}
                  className="w-full bg-[#4278ff] text-white px-4 py-2 rounded-lg hover:bg-[#3a6ce0] transition-colors font-semibold text-sm"
                >
                  Claim This Item
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Modal */}
      {showClaimModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 text-[#4278ff]">
                    <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2f303c]">Claim Item</h3>
                  <p className="text-sm text-[#5C5B61]">Verify this is your item</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  {selectedItem.photo_url && (
                    <img
                      src={`http://localhost:5000${selectedItem.photo_url}`}
                      alt={selectedItem.title}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold text-[#2f303c]">{selectedItem.title}</h4>
                    <p className="text-sm text-[#5C5B61]">{selectedItem.category}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleClaimSubmit}>
                {lostItems.length === 0 ? (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-900">
                      You need to report a lost item first before claiming a found item.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-[#2f303c] mb-2">
                        Which lost item does this match? *
                      </label>
                      <select
                        value={selectedLostItem}
                        onChange={(e) => setSelectedLostItem(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#4278ff] focus:ring-4 focus:ring-[#4278ff]/10 transition-all"
                      >
                        <option value="">Select your lost item...</option>
                        {lostItems.map(lost => (
                          <option key={lost.id} value={lost.id}>
                            {lost.title} - {lost.category} {lost.color ? `(${lost.color})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#2f303c] mb-2">
                        Verification Answer *
                      </label>
                      <textarea
                        value={verificationAnswer}
                        onChange={(e) => setVerificationAnswer(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#4278ff] focus:ring-4 focus:ring-[#4278ff]/10 transition-all"
                        placeholder="Describe unique features, serial numbers, or answer any verification question..."
                        required
                      />
                      <p className="text-xs text-[#5C5B61] mt-2">
                        Provide details that prove this item belongs to you
                      </p>
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowClaimModal(false);
                      setSelectedItem(null);
                      setVerificationAnswer('');
                      setSelectedLostItem('');
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm text-[#2f303c]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={claiming || lostItems.length === 0}
                    className="flex-1 bg-[#4278ff] text-white px-4 py-3 rounded-lg hover:bg-[#3a6ce0] transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4278ff]/20"
                  >
                    {claiming ? 'Submitting...' : 'Submit Claim'}
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

export default FoundItems;
