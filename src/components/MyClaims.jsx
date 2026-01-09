import React, { useState, useEffect } from 'react';
import { claimsAPI, messagesAPI } from '../utils/api';
import ClaimDetail from './ClaimDetail';

const MyClaims = ({ currentUserId }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      setLoading(true);
      setError('');
      // Load both claims made by user and claims on items they found
      const [myClaimsData, foundItemClaimsData] = await Promise.all([
        claimsAPI.getMyClaims().catch(() => ({ claims: [] })),
        claimsAPI.getFoundItemClaims().catch(() => ({ claims: [] }))
      ]);
      
      // Combine and deduplicate claims
      const allClaims = [...(myClaimsData.claims || []), ...(foundItemClaimsData.claims || [])];
      const uniqueClaims = allClaims.filter((claim, index, self) =>
        index === self.findIndex(c => c.id === claim.id)
      );
      
      // Sort by most recent
      uniqueClaims.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setClaims(uniqueClaims);
    } catch (err) {
      console.error('Error loading claims:', err);
      setError(err.message || 'Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedClaim(null);
    loadClaims(); // Reload to get updated status
  };

  const getStatusBadge = (status, verificationStatus) => {
    if (status === 'approved') {
      return (
        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-semibold">
          ✓ Approved
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-semibold">
          ✗ Rejected
        </span>
      );
    }
    if (verificationStatus === 'verified') {
      return (
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
          ✓ Verified
        </span>
      );
    }
    return (
      <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-semibold">
        ⏳ Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4278ff] mb-4"></div>
        <div className="text-[#5C5B61]">Loading your claims...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-rose-100 border border-rose-200 rounded-lg p-4 text-rose-700">
          {error}
        </div>
      </div>
    );
  }

  if (claims.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-10 h-10 text-[#4278ff]">
            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#2f303c] mb-2">No claims yet</h3>
        <p className="text-[#5C5B61]">You haven't made any claims yet. Browse found items to claim your lost items.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-[#2f303c] mb-2">My Claims</h2>
            <p className="text-[#5C5B61]">Track your item claims and coordinate with finders</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm">
            <span className="text-lg font-bold text-blue-700">{claims.length} {claims.length === 1 ? 'claim' : 'claims'}</span>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.map((claim) => (
          <div
            key={claim.id}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all shadow-sm cursor-pointer"
            onClick={() => handleViewClaim(claim)}
          >
            <div className="flex items-start gap-4">
              {claim.found_item?.photo_url && (
                <img
                  src={`https://reunite.adiavi.com/${claim.found_item.photo_url}`}
                  alt={claim.found_item.title}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200 shrink-0"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#2f303c] text-lg mb-1 truncate">
                      {claim.found_item?.title || 'Unknown Item'}
                    </h4>
                    <p className="text-sm text-[#5C5B61]">
                      {claim.claimant_id === currentUserId ? (
                        <>Claimed for: <span className="font-semibold">{claim.lost_item?.title || 'Unknown'}</span></>
                      ) : (
                        <>Claimed by: <span className="font-semibold">{claim.claimant_name || 'Unknown'}</span></>
                      )}
                    </p>
                  </div>
                  {getStatusBadge(claim.status, claim.verification_status)}
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-[#5C5B61] mb-3">
                  {claim.found_item?.category && (
                    <span className="bg-[#4278ff]/10 text-[#4278ff] px-2 py-0.5 rounded">
                      {claim.found_item.category}
                    </span>
                  )}
                  {claim.verification_status === 'verified' && (
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                      Photo Verified
                    </span>
                  )}
                  {claim.proof_photo_url && (
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">
                      Proof Uploaded
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-[#5C5B61]">
                  <span>
                    Claimed {new Date(claim.created_at).toLocaleDateString()}
                  </span>
                  {claim.verified_at && (
                    <span>
                      Verified {new Date(claim.verified_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-5 h-5 text-[#5C5B61] shrink-0"
              >
                <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {showDetail && selectedClaim && (
        <ClaimDetail
          claim={selectedClaim}
          currentUserId={currentUserId}
          onClose={handleCloseDetail}
          onUpdate={loadClaims}
        />
      )}
    </div>
  );
};

export default MyClaims;
