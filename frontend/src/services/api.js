/**
 * Campus Exchange API client. Every call goes to the Express backend; the JWT
 * (saved in localStorage after login) is attached automatically.
 */
const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'campusexchange.token';

export const tokenStore = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable - user stays logged in for this tab only */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

let onSessionExpired = null;
/** AuthContext registers a callback so an expired token logs the user out everywhere. */
export const setSessionExpiredHandler = (fn) => {
  onSessionExpired = fn;
};

export class ApiError extends Error {
  constructor(message, { status = 0, code, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

const query = (params = {}) => {
  const q = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();
  return q ? `?${q}` : '';
};

const request = async (path, { method = 'GET', json, form } = {}) => {
  const headers = {};
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json !== undefined) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: json !== undefined ? JSON.stringify(json) : form,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and that the backend is running.', {
      code: 'NETWORK',
    });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token && data.code === 'AUTH_INVALID') onSessionExpired?.();
    throw new ApiError(data.message || `Request failed (${res.status})`, {
      status: res.status,
      code: data.code,
      data,
    });
  }
  return data;
};

export const api = {
  // ---- Auth ----
  register: (payload) => request('/auth/register', { method: 'POST', json: payload }),
  login: (email, password) => request('/auth/login', { method: 'POST', json: { email, password } }),
  me: () => request('/auth/me'),
  updateMe: (payload) => request('/auth/me', { method: 'PATCH', json: payload }),

  // ---- Listings (create/update take a FormData so photos can be uploaded) ----
  getListings: (params) => request(`/listings${query(params)}`),
  getMyListings: () => request('/listings/mine'),
  getListingStats: (params) => request(`/listings/stats/summary${query(params)}`),
  createListing: (formData) => request('/listings', { method: 'POST', form: formData }),
  updateListing: (id, formData) => request(`/listings/${id}`, { method: 'PATCH', form: formData }),
  setListingStatus: (id, status) => request(`/listings/${id}/status`, { method: 'PATCH', json: { status } }),
  deleteListing: (id) => request(`/listings/${id}`, { method: 'DELETE' }),

  // ---- Wishlist + course watchlists ----
  getWishlist: () => request('/wishlist'),
  addToWishlist: (listingId) => request('/wishlist', { method: 'POST', json: { listingId } }),
  removeFromWishlist: (listingId) => request(`/wishlist/${listingId}`, { method: 'DELETE' }),
  getWatchlists: () => request('/wishlist/watchlists'),
  createWatchlist: (payload) => request('/wishlist/watchlists', { method: 'POST', json: payload }),
  toggleWatchlistNotify: (id) => request(`/wishlist/watchlists/${id}/toggle-notify`, { method: 'PATCH' }),
  deleteWatchlist: (id) => request(`/wishlist/watchlists/${id}`, { method: 'DELETE' }),

  // ---- Offers & negotiation on listings ----
  getOffers: () => request('/offers'),
  createOffer: (listingId, amount, message) =>
    request('/offers', { method: 'POST', json: { listingId, amount, message } }),
  respondToOffer: (id, action, payload = {}) =>
    request(`/offers/${id}/respond`, { method: 'POST', json: { action, ...payload } }),
  withdrawOffer: (id) => request(`/offers/${id}/withdraw`, { method: 'POST' }),
  cancelDeal: (id) => request(`/offers/${id}/cancel`, { method: 'POST', json: {} }),
  completeDeal: (id) => request(`/offers/${id}/complete`, { method: 'POST' }),

  // ---- Wanted board ----
  getWanted: (params) => request(`/wanted${query(params)}`),
  createWanted: (payload) => request('/wanted', { method: 'POST', json: payload }),
  submitWantedOffer: (id, payload) => request(`/wanted/${id}/offer`, { method: 'POST', json: payload }),
  getWantedOffers: (id) => request(`/wanted/${id}/offers`),
  setWantedStatus: (id, status) => request(`/wanted/${id}/status`, { method: 'PATCH', json: { status } }),
  deleteWanted: (id) => request(`/wanted/${id}`, { method: 'DELETE' }),

  // ---- Move-out bundles ----
  getBundles: (params) => request(`/bundles${query(params)}`),
  claimBundle: (id) => request(`/bundles/${id}/claim`, { method: 'POST' }),
};

export default api;
