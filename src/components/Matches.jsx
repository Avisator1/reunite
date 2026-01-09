import React, { useState, useEffect } from 'react';
import { itemsAPI, claimsAPI } from '../utils/api';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await itemsAPI.getMatches();
      setMatches(data.matches || []);
    } catch (err) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (match) => {
    if (!window.confirm('Are you sure this is your item? You\'ll need to verify ownership.')) {
      return;
    }

    try {
      await claimsAPI.createClaim(
        match.lost_item_id,
        match.found_item_id,
        ''
      );
      alert('Claim created! Please verify ownership with a photo.');
      loadMatches();
    } catch (err) {
      alert(err.message || 'Failed to create claim');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4278ff] mb-4"></div>
        <div className="text-[#5C5B61]">Loading matches...</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-10 h-10 text-[#4278ff]">
            <path fillRule="evenodd" d="M8.5 1.709a.75.75 0 0 0-1 0 8.963 8.963 0 0 1-4.84 2.217.75.75 0 0 0-.654.72 10.499 10.499 0 0 0 5.647 9.672.75.75 0 0 0 .694-.001 10.499 10.499 0 0 0 5.647-9.672.75.75 0 0 0-.654-.719A8.963 8.963 0 0 1 8.5 1.71Zm2.34 5.504a.75.75 0 0 0-1.18-.926L7.394 9.17l-1.156-.99a.75.75 0 1 0-.976 1.138l1.75 1.5a.75.75 0 0 0 1.078-.106l2.75-3.5Z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#2f303c] mb-2">No matches yet</h3>
        <p className="text-[#5C5B61]">We'll notify you when we find potential matches for your lost items!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-xl p-6 border border-[#4278ff]/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-[#2f303c] mb-2">AI Matches</h2>
            <p className="text-[#5C5B61]">Potential matches for your lost items powered by AI</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-[#4278ff]/20">
            <span className="text-lg font-bold text-[#4278ff]">{matches.length} {matches.length === 1 ? 'match' : 'matches'}</span>
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-6">
      {matches.map((match) => {
        const matchReasons = match.match_reasons ? JSON.parse(match.match_reasons) : [];
        const confidenceColor = match.confidence_score >= 80 ? 'emerald' : match.confidence_score >= 60 ? 'amber' : 'gray';

        return (
          <div key={match.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`bg-${confidenceColor}-100 text-${confidenceColor}-700 px-3 py-1 rounded-lg text-sm font-bold`}>
                    {Math.round(match.confidence_score)}% Match
                  </div>
                  <span className="text-sm text-[#5C5B61]">AI Confidence</span>
                </div>
                <h4 className="font-bold text-[#2f303c] mb-1">{match.lost_item?.title}</h4>
                <p className="text-sm text-[#5C5B61]">Found: {match.found_item?.title}</p>
              </div>
              {match.found_item?.photo_url && (
                <img
                  src={`http://localhost:5000${match.found_item.photo_url}`}
                  alt="Found item"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
              )}
            </div>

            {matchReasons.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-[#5C5B61] uppercase mb-2">Why it matches:</p>
                <ul className="space-y-1">
                  {matchReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-[#5C5B61]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5">
                        <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                      </svg>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => handleClaim(match)}
              className="w-full bg-[#4278ff] text-white px-4 py-2 rounded-lg hover:bg-[#3a6ce0] transition-colors font-semibold text-sm"
            >
              Claim This Item
            </button>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default Matches;
