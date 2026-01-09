import React, { useState } from 'react';
import { itemsAPI } from '../utils/api';

const ReportFoundItem = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    color: '',
    brand: '',
    location: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['phone', 'wallet', 'bag', 'keys', 'clothing', 'electronics', 'books', 'other'];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (photo) {
        formDataToSend.append('photo', photo);
      }

      const result = await itemsAPI.reportFound(formDataToSend);
      onSuccess?.(result);
    } catch (err) {
      setError(err.message || 'Failed to report found item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 text-emerald-600">
            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#2f303c]">Report Found Item</h3>
          <p className="text-sm text-[#5C5B61]">Help reunite items with their owners</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-100/75 border border-rose-200 rounded-lg text-rose-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-semibold text-[#2f303c] mb-2">
            Photo * (AI will auto-detect details)
          </label>
          <div className="flex items-center gap-4">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-8 h-8 text-gray-400">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                required
                className="text-sm text-[#5C5B61]"
              />
              <p className="text-xs text-[#5C5B61] mt-1">AI will extract details and match with lost items</p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-[#2f303c] mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#4278ff] focus:ring-4 focus:ring-[#4278ff]/10"
            placeholder="e.g., Black iPhone 13"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-[#2f303c] mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#4278ff] focus:ring-4 focus:ring-[#4278ff]/10"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-[#2f303c] mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#4278ff] focus:ring-4 focus:ring-[#4278ff]/10"
            placeholder="Describe the found item..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Color */}
          <div>
            <label className="block text-sm font-semibold text-[#2f303c] mb-2">Color</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#4278ff] focus:ring-4 focus:ring-[#4278ff]/10"
              placeholder="e.g., Black"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-semibold text-[#2f303c] mb-2">Brand</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#4278ff] focus:ring-4 focus:ring-[#4278ff]/10"
              placeholder="e.g., Apple"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-[#2f303c] mb-2">Where did you find it?</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#4278ff] focus:ring-4 focus:ring-[#4278ff]/10"
            placeholder="e.g., Main building, Room 201"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 pb-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm text-[#2f303c]"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
          >
            {loading ? 'Reporting...' : 'Report Found Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportFoundItem;
