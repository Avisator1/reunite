import React, { useState, useEffect } from 'react';
import { itemsAPI } from '../utils/api';

const LostItems = ({ refreshKey, currentUserId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadItems();
  }, [refreshKey]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await itemsAPI.getLostItems();
      // Filter to only show active lost items
      setItems(data.items?.filter(item => item.status === 'active') || []);
    } catch (err) {
      setError(err.message || 'Failed to load lost items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this lost item posting?')) {
      return;
    }

    try {
      setDeleting(itemId);
      await itemsAPI.deleteLostItem(itemId);
      // Remove from local state
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      alert(err.message || 'Failed to delete item');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4278ff] mb-4"></div>
        <div className="text-[#5C5B61]">Loading lost items...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-rose-100/50 to-rose-200/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-10 h-10 text-rose-600">
            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#2f303c] mb-2">No lost items</h3>
        <p className="text-[#5C5B61]">No one has reported losing items yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-[#2f303c] mb-2">Lost Items - Help Find Them</h2>
            <p className="text-[#5C5B61]">Items that others have lost - keep an eye out!</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-rose-200 shadow-sm">
            <span className="text-lg font-bold text-rose-700">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all shadow-sm relative"
          >
            {/* Delete button - only show for owner */}
            {currentUserId && item.user_id === currentUserId && (
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deleting === item.id}
                className="absolute top-3 right-3 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                title="Delete this item"
              >
                {deleting === item.id ? (
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
            )}

            {item.photo_url && (
              <div className="mb-5">
                <img
                  src={`https://reunite.adiavi.com/${item.photo_url}`}
                  alt={item.title}
                  className="w-full h-56 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-semibold uppercase">
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
                    <span className="truncate max-w-[120px]">Lost: {item.location}</span>
                  </div>
                )}
                {item.lost_date && (
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                      <path d="M5.75 14A1.75 1.75 0 0 1 4 12.25v-9.5C4 1.784 4.784 1 5.75 1h4.5c.966 0 1.75.784 1.75 1.75v9.5A1.75 1.75 0 0 1 10.25 14h-4.5ZM7.5 4.25a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0v-.5ZM10 4.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM5.75 3a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM11 7.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM5 7.25a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0v-.5ZM8.75 7a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM11 9.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM5.75 9a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM8 9.75a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0v-.5Z" />
                    </svg>
                    <span>{new Date(item.lost_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {item.unique_traits && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-[#5C5B61] uppercase mb-1">Unique Traits</p>
                  <p className="text-xs text-[#5C5B61]">{item.unique_traits}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostItems;
