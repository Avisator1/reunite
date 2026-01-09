const API_BASE_URL = 'https://reunite.adiavi.com//api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Helper function to set auth tokens
export const setAuthTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

// Helper function to clear auth tokens
export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Helper function to get headers with auth
const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    // Ensure token is a string and properly formatted
    const cleanToken = String(token).trim();
    if (cleanToken) {
      headers['Authorization'] = `Bearer ${cleanToken}`;
    }
  }
  
  return headers;
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();
  
  // Merge with any custom headers from options
  if (options.headers) {
    Object.assign(headers, options.headers);
  }
  
  const config = {
    method: options.method || 'GET',
    headers: headers,
    credentials: 'include', // Include cookies for CORS
  };

  // Don't add body if it's already a string or FormData
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  } else if (options.body) {
    config.body = options.body;
  }

  try {
    const response = await fetch(url, config);
    
    // Handle empty responses
    let data;
    const contentType = response.headers.get('content-type');
    try {
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } else {
        const text = await response.text();
        data = text ? (JSON.parse(text) || {}) : {};
      }
    } catch (parseError) {
      // If JSON parsing fails, create a basic error object
      data = { error: `Server returned invalid response (status ${response.status})` };
    }

    if (!response.ok) {
      const errorMessage = data.error || data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Re-throw if it's already our custom error
    if (error.status) {
      throw error;
    }
    // Handle network errors
    console.error('API request error:', error);
    throw new Error(error.message || 'Network error occurred. Please check your connection.');
  }
};

// Auth API
export const authAPI = {
  signup: async (userData) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: userData,
    });
  },

  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    
    // Verify token format (JWT tokens have 3 parts separated by dots)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      clearAuthTokens();
      throw new Error('Invalid token format. Please login again.');
    }
    
    return apiRequest('/auth/me');
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Token refresh failed');
    }
    
    // Update access token
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    
    return data;
  },
};

// Admin API
export const adminAPI = {
  createSchool: async (schoolName) => {
    return apiRequest('/admin/create-school', {
      method: 'POST',
      body: { name: schoolName },
    });
  },

  getSchools: async () => {
    return apiRequest('/admin/schools');
  },

  getSchool: async (schoolId) => {
    return apiRequest(`/admin/school/${schoolId}`);
  },

  deleteSchool: async (schoolId) => {
    return apiRequest(`/admin/school/${schoolId}`, {
      method: 'DELETE',
    });
  },

  regenerateJoinCode: async (schoolId) => {
    return apiRequest(`/admin/regenerate-join-code/${schoolId}`, {
      method: 'POST',
    });
  },
};

// Student API
export const studentAPI = {
  joinSchool: async (joinCode) => {
    return apiRequest('/student/join-school', {
      method: 'POST',
      body: { join_code: joinCode },
    });
  },

  getMySchool: async () => {
    return apiRequest('/student/my-school');
  },

  leaveSchool: async () => {
    return apiRequest('/student/leave-school', {
      method: 'POST',
    });
  },
};

// Items API
export const itemsAPI = {
  reportLost: async (formData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/items/lost`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to report lost item');
    return data;
  },

  reportFound: async (formData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/items/found`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to report found item');
    return data;
  },

  getLostItems: async () => {
    return apiRequest('/items/lost');
  },

  getFoundItems: async () => {
    return apiRequest('/items/found');
  },

  getMatches: async () => {
    return apiRequest('/items/matches');
  },

  getQRItem: async (code) => {
    return fetch(`${API_BASE_URL}/items/qr/${code}`).then(res => res.json());
  },

  deleteLostItem: async (itemId) => {
    return apiRequest(`/items/lost/${itemId}`, {
      method: 'DELETE',
    });
  },
};

// Claims API
export const claimsAPI = {
  createClaim: async (lostItemId, foundItemId, verificationAnswer) => {
    return apiRequest('/claims/create', {
      method: 'POST',
      body: {
        lost_item_id: lostItemId,
        found_item_id: foundItemId,
        verification_answer: verificationAnswer,
      },
    });
  },

  verifyClaim: async (claimId, proofPhoto) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('claim_id', claimId);
    if (proofPhoto) formData.append('proof_photo', proofPhoto);
    
    const response = await fetch(`${API_BASE_URL}/claims/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to verify claim');
    return data;
  },

  approveClaim: async (claimId) => {
    return apiRequest(`/claims/approve/${claimId}`, {
      method: 'POST',
    });
  },

  getMyClaims: async () => {
    return apiRequest('/claims/my-claims');
  },

  getFoundItemClaims: async () => {
    return apiRequest('/claims/found-item-claims');
  },
};

// Messages API
export const messagesAPI = {
  sendMessage: async (claimId, content) => {
    return apiRequest('/messages/send', {
      method: 'POST',
      body: {
        claim_id: claimId,
        content: content,
      },
    });
  },

  getMessages: async (claimId) => {
    return apiRequest(`/messages/claim/${claimId}`);
  },
};

// Rewards API
export const rewardsAPI = {
  getMyPoints: async () => {
    return apiRequest('/rewards/my-points');
  },

  getLeaderboard: async () => {
    return apiRequest('/rewards/leaderboard');
  },
};

// QR Codes API
export const qrCodesAPI = {
  createQRCode: async (lostItemId, contactInfo) => {
    return apiRequest('/qr-codes/create', {
      method: 'POST',
      body: {
        lost_item_id: lostItemId || null,
        contact_info: contactInfo || null,
      },
    });
  },

  getMyQRCodes: async () => {
    return apiRequest('/qr-codes/my-codes');
  },

  getQRInfo: async (code) => {
    return fetch(`${API_BASE_URL}/qr-codes/${code}`).then(res => res.json());
  },

  contactQROwner: async (code, contactData) => {
    return apiRequest(`/qr-codes/${code}/contact`, {
      method: 'POST',
      body: contactData,
    });
  },

  deleteQRCode: async (qrId) => {
    return apiRequest(`/qr-codes/${qrId}`, {
      method: 'DELETE',
    });
  },

  getContactMessages: async () => {
    return apiRequest('/qr-codes/contact-messages');
  },
};

// Chat API
export const chatAPI = {
  sendMessage: async (message, history = []) => {
    return apiRequest('/chat/message', {
      method: 'POST',
      body: {
        message,
        history
      },
    });
  },
};
