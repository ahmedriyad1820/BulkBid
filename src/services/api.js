const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Raw request method that returns the full response
  async rawRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
  }

  // Admin authentication methods
  async adminLogin(credentials) {
    const response = await this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    // Store admin token in localStorage
    if (response.token) {
      localStorage.setItem('adminToken', response.token);
    }
    
    return response;
  }

  async adminLogout() {
    localStorage.removeItem('adminToken');
  }

  async getAdminProfile() {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/profile', {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
  }

  async updateAdminProfile(profileData) {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(profileData)
    });
  }

  // Admin user management methods
  async getAllUsers(params = {}) {
    const token = localStorage.getItem('adminToken');
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${queryString}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
  }

  async getUserProfile(userId) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/users/${userId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
  }

  async updateUserStatus(userId, isActive) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({ isActive })
    });
  }

  async deleteUser(userId) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
  }

  async getAuctionStats() {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/stats/auctions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Auction methods
  async getAuctions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/auctions?${queryString}` : '/auctions';
    return this.request(endpoint);
  }

  async getAuction(id) {
    return this.request(`/auctions/${id}`);
  }

  async createAuction(auctionData) {
    return this.rawRequest('/auctions', {
      method: 'POST',
      body: JSON.stringify(auctionData)
    });
  }

  async updateAuction(id, auctionData) {
    return this.request(`/auctions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(auctionData)
    });
  }

  async deleteAuction(id) {
    return this.request(`/auctions/${id}`, {
      method: 'DELETE'
    });
  }

  async placeBid(auctionId, amount) {
    return this.request(`/auctions/${auctionId}/bid`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  }

  async getUserAuctions(status) {
    const endpoint = status ? `/auctions/user/my-auctions?status=${status}` : '/auctions/user/my-auctions';
    return this.request(endpoint);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

const apiService = new ApiService();

// Export individual functions for easier imports
export const createAuction = (auctionData) => apiService.createAuction(auctionData);
export const getAuctions = (params) => apiService.getAuctions(params);
export const getAuction = (id) => apiService.getAuction(id);
export const updateAuction = (id, auctionData) => apiService.updateAuction(id, auctionData);
export const deleteAuction = (id) => apiService.deleteAuction(id);
export const placeBid = (auctionId, amount) => apiService.placeBid(auctionId, amount);
export const getUserAuctions = (status) => apiService.getUserAuctions(status);
export const register = (userData) => apiService.register(userData);
export const login = (credentials) => apiService.login(credentials);
export const logout = () => apiService.logout();
export const getProfile = () => apiService.getProfile();
export const updateProfile = (profileData) => apiService.updateProfile(profileData);
export const adminLogin = (credentials) => apiService.adminLogin(credentials);
export const adminLogout = () => apiService.adminLogout();
export const getAdminProfile = () => apiService.getAdminProfile();
export const updateAdminProfile = (profileData) => apiService.updateAdminProfile(profileData);
export const getAllUsers = (params) => apiService.getAllUsers(params);
export const getUserProfile = (userId) => apiService.getUserProfile(userId);
export const updateUserStatus = (userId, isActive) => apiService.updateUserStatus(userId, isActive);
export const deleteUser = (userId) => apiService.deleteUser(userId);
export const getAuctionStats = () => apiService.getAuctionStats();
export const healthCheck = () => apiService.healthCheck();

export default apiService;

