/**
 * CampusZon API Client
 * Connects frontend views and components to the MVC Express REST API backend.
 */

const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

export const api = {
  // ---- Listings ----
  getListings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/listings${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  getListingById: async (id) => {
    const res = await fetch(`${API_BASE}/listings/${id}`);
    return handleResponse(res);
  },

  createListing: async (listingData) => {
    const res = await fetch(`${API_BASE}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listingData),
    });
    return handleResponse(res);
  },

  toggleWishlist: async (id, isWishlisted) => {
    const res = await fetch(`${API_BASE}/listings/${id}/wishlist`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isWishlisted }),
    });
    return handleResponse(res);
  },

  toggleLikeListing: async (id) => {
    const res = await fetch(`${API_BASE}/listings/${id}/like`, {
      method: 'PATCH',
    });
    return handleResponse(res);
  },

  deleteListing: async (id) => {
    const res = await fetch(`${API_BASE}/listings/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  getMarketplaceStats: async () => {
    const res = await fetch(`${API_BASE}/listings/stats/summary`);
    return handleResponse(res);
  },

  // ---- Bundles ----
  getBundles: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/bundles${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  claimBundle: async (id) => {
    const res = await fetch(`${API_BASE}/bundles/${id}/claim`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  createBundle: async (bundleData) => {
    const res = await fetch(`${API_BASE}/bundles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bundleData),
    });
    return handleResponse(res);
  },

  getBundleStats: async () => {
    const res = await fetch(`${API_BASE}/bundles/stats/overview`);
    return handleResponse(res);
  },

  // ---- Wanted Board ----
  getWanted: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/wanted${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  createWanted: async (wantedData) => {
    const res = await fetch(`${API_BASE}/wanted`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wantedData),
    });
    return handleResponse(res);
  },

  submitOffer: async (id, offerData) => {
    const res = await fetch(`${API_BASE}/wanted/${id}/offer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData),
    });
    return handleResponse(res);
  },

  // ---- Advanced Catalog Search ----
  searchCatalog: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/search${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  // ---- Wishlist & Watchlists ----
  getWishlist: async () => {
    const res = await fetch(`${API_BASE}/wishlist`);
    return handleResponse(res);
  },

  addToWishlist: async (itemData) => {
    const res = await fetch(`${API_BASE}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    return handleResponse(res);
  },

  removeFromWishlist: async (id) => {
    const res = await fetch(`${API_BASE}/wishlist/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  getWatchlists: async () => {
    const res = await fetch(`${API_BASE}/wishlist/watchlists`);
    return handleResponse(res);
  },

  createWatchlist: async (watchlistData) => {
    const res = await fetch(`${API_BASE}/wishlist/watchlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(watchlistData),
    });
    return handleResponse(res);
  },

  toggleWatchlistNotify: async (id) => {
    const res = await fetch(`${API_BASE}/wishlist/watchlists/${id}/toggle-notify`, {
      method: 'PATCH',
    });
    return handleResponse(res);
  },

  deleteWatchlist: async (id) => {
    const res = await fetch(`${API_BASE}/wishlist/watchlists/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // ---- Student Verification ----
  getVerificationProfile: async () => {
    const res = await fetch(`${API_BASE}/verify/profile`);
    return handleResponse(res);
  },

  submitVerification: async (verificationData) => {
    const res = await fetch(`${API_BASE}/verify/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationData),
    });
    return handleResponse(res);
  },

  // ---- Meetup Hubs & Safety ----
  getHubs: async () => {
    const res = await fetch(`${API_BASE}/hubs`);
    return handleResponse(res);
  },

  getSafetyPledge: async () => {
    const res = await fetch(`${API_BASE}/hubs/safety-pledge`);
    return handleResponse(res);
  },

  // ---- Health Check ----
  checkHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },
};

export default api;
