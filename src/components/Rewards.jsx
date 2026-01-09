import React, { useState, useEffect } from 'react';
import { rewardsAPI } from '../utils/api';

const Rewards = () => {
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [pointsData, leaderboardData] = await Promise.all([
        rewardsAPI.getMyPoints().catch(() => ({ total_points: 0, rewards: [] })),
        rewardsAPI.getLeaderboard().catch(() => ({ leaderboard: [] }))
      ]);
      setPoints(pointsData.total_points || 0);
      setRewards(pointsData.rewards || []);
      setLeaderboard(leaderboardData.leaderboard || []);
    } catch (err) {
      console.error('Error loading rewards:', err);
      setError(err.message || 'Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4278ff] mb-4"></div>
        <div className="text-[#5C5B61]">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Points Summary */}
      <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-xl p-8 border border-[#4278ff]/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#5C5B61] uppercase tracking-wide mb-2">Total Points</p>
            <h2 className="text-5xl font-extrabold text-[#2f303c] mb-2">{points}</h2>
            <p className="text-sm text-[#5C5B61]">Keep reporting items to earn more!</p>
          </div>
          <div className="bg-gradient-to-br from-[#4278ff] to-[#06ABAB] rounded-full w-24 h-24 flex items-center justify-center">
            <span className="text-5xl">🏆</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <div className="flex gap-1 p-2">
            <button
              onClick={() => setShowLeaderboard(false)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                !showLeaderboard
                  ? 'bg-[#4278ff] text-white shadow-sm'
                  : 'text-[#5C5B61] hover:bg-gray-50'
              }`}
            >
              My Rewards
            </button>
            <button
              onClick={() => setShowLeaderboard(true)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                showLeaderboard
                  ? 'bg-[#4278ff] text-white shadow-sm'
                  : 'text-[#5C5B61] hover:bg-gray-50'
              }`}
            >
              Leaderboard
            </button>
          </div>
        </div>

        <div className="p-6">
          {!showLeaderboard ? (
            /* My Rewards */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#2f303c]">Reward History</h3>
                <span className="text-sm text-[#5C5B61]">{rewards.length} {rewards.length === 1 ? 'reward' : 'rewards'}</span>
              </div>

              {rewards.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🎁</span>
                  </div>
                  <p className="text-[#5C5B61]">No rewards yet. Start reporting items to earn points!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-[#4278ff] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                          +{reward.points}
                        </div>
                        <div>
                          <p className="font-semibold text-[#2f303c]">{reward.reason}</p>
                          <p className="text-xs text-[#5C5B61]">{formatDate(reward.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Leaderboard */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#2f303c]">School Leaderboard</h3>
                <span className="text-sm text-[#5C5B61]">{leaderboard.length} {leaderboard.length === 1 ? 'member' : 'members'}</span>
              </div>

              {leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📊</span>
                  </div>
                  <p className="text-[#5C5B61]">No leaderboard data yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.user_id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        index === 0
                          ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'
                          : index === 1
                          ? 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200'
                          : index === 2
                          ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'
                          : 'bg-gray-50 border-gray-100'
                      } hover:shadow-md transition-all`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                          index === 0
                            ? 'bg-yellow-400 text-yellow-900'
                            : index === 1
                            ? 'bg-gray-400 text-gray-900'
                            : index === 2
                            ? 'bg-orange-400 text-orange-900'
                            : 'bg-[#4278ff] text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-[#2f303c]">
                            {entry.first_name} {entry.last_name}
                          </p>
                          <p className="text-xs text-[#5C5B61]">{entry.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#4278ff]">{entry.total_points}</p>
                        <p className="text-xs text-[#5C5B61]">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
