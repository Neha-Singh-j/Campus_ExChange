import { useCallback, useEffect, useState } from 'react';
import { CampusProvider } from './context/CampusContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { useCampus } from './context/useCampus';
import api from './services/api';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import PostItemModal from './components/PostItemModal';
import MakeOfferModal from './components/MakeOfferModal';
import PostWantedModal from './components/PostWantedModal';
import OfferModal from './components/OfferModal';

import MarketplacePage from './pages/MarketplacePage';
import WantedBoardPage from './pages/WantedBoardPage';
import AdvancedSearchPage from './pages/AdvancedSearchPage';
import WishlistPage from './pages/WishlistPage';
import AccountPage from './pages/AccountPage';

const NEEDS_LOGIN = ['wishlist', 'account'];

function AppShell() {
  const { campus } = useCampus();
  const { user, loading: authLoading, isLoggedIn, logout, setUser } = useAuth();

  const [activeTab, setActiveTab] = useState('marketplace');

  // ---- data from the backend ----------------------------------------------
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [listingsState, setListingsState] = useState({ loading: true, error: '' });
  const [wanted, setWanted] = useState([]);
  const [dataVersion, setDataVersion] = useState(0); // bump to make child pages refetch

  // ---- dialogs ---------------------------------------------------------------
  const [auth, setAuth] = useState({ open: false, mode: 'login' });
  const [postModal, setPostModal] = useState({ open: false, listing: null });
  const [offerTarget, setOfferTarget] = useState(null); // listing being offered on
  const [isWantedModalOpen, setIsWantedModalOpen] = useState(false);
  const [wantedOfferTarget, setWantedOfferTarget] = useState(null);

  // ---- toast -----------------------------------------------------------------
  const [toast, setToast] = useState(null);
  const showNotification = useCallback((msg) => setToast({ msg, id: Date.now() }), []);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  const openAuth = useCallback((mode = 'login') => setAuth({ open: true, mode }), []);
  const bump = () => setDataVersion((v) => v + 1);

  // ---- loaders ----------------------------------------------------------------
  const loadListings = useCallback(async () => {
    try {
      const [l, s] = await Promise.all([
        api.getListings({ campusId: campus.id, limit: 100 }),
        api.getListingStats({ campusId: campus.id }),
      ]);
      setListings(l.data);
      setStats(s.data);
      setListingsState({ loading: false, error: '' });
    } catch (err) {
      setListingsState({ loading: false, error: err.message });
    }
  }, [campus.id]);

  const loadWanted = useCallback(async () => {
    try {
      const res = await api.getWanted({ campusId: campus.id });
      setWanted(res.data);
    } catch (err) {
      console.warn('Could not load wanted requests:', err.message);
    }
  }, [campus.id]);

  // Reload when the signed-in user changes so isWishlisted / isOwner are correct.
  const userId = user?.id;
  useEffect(() => {
    if (authLoading) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; state is set after the await
    loadListings();
    loadWanted();
  }, [authLoading, userId, loadListings, loadWanted]);

  // Pages that need an account fall back to the marketplace when logged out.
  const goTo = useCallback(
    (tab) => {
      if (NEEDS_LOGIN.includes(tab) && !isLoggedIn) {
        openAuth('login');
        showNotification('Please log in with your campus email to continue.');
        return;
      }
      setActiveTab(tab);
    },
    [isLoggedIn, openAuth, showNotification]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- redirect away from pages that need an account
    if (!authLoading && !isLoggedIn && NEEDS_LOGIN.includes(activeTab)) setActiveTab('marketplace');
  }, [authLoading, isLoggedIn, activeTab]);

  /** Wraps an action that needs a signed-in user: opens the login dialog instead when logged out. */
  const requireLogin = (fn) => (...args) => {
    if (!isLoggedIn) {
      openAuth('login');
      showNotification('Please log in with your campus email to continue.');
      return undefined;
    }
    return fn(...args);
  };

  // ---- actions ------------------------------------------------------------------
  const handleToggleWishlist = requireLogin(async (id, force) => {
    const item = listings.find((l) => l.id === id);
    const next = typeof force === 'boolean' ? force : !item?.isWishlisted;
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, isWishlisted: next } : l)));
    try {
      await (next ? api.addToWishlist(id) : api.removeFromWishlist(id));
      showNotification(next ? 'Saved to your wishlist.' : 'Removed from your wishlist.');
      bump();
    } catch (err) {
      setListings((prev) => prev.map((l) => (l.id === id ? { ...l, isWishlisted: !next } : l)));
      showNotification(err.message);
    }
  });

  const openPostModal = requireLogin((listing = null) => setPostModal({ open: true, listing }));

  const handleSubmitListing = async (formData) => {
    const editing = postModal.listing;
    const res = editing ? await api.updateListing(editing.id, formData) : await api.createListing(formData);
    setPostModal({ open: false, listing: null });
    showNotification(editing ? 'Listing updated.' : 'Your item is now listed!');
    await loadListings();
    bump();
    return res;
  };

  const openOfferModal = requireLogin((listing) => setOfferTarget(listing));

  const handleSendOffer = async (amount, message) => {
    await api.createOffer(offerTarget.id, amount, message);
    setOfferTarget(null);
    showNotification('Offer sent to the seller.');
  };

  const handleAddWanted = async (payload) => {
    await api.createWanted(payload);
    showNotification('Your request is live on the board.');
    loadWanted();
  };

  const handleSendWantedOffer = async (payload) => {
    await api.submitWantedOffer(wantedOfferTarget.id, payload);
    showNotification('Offer sent to the student.');
    loadWanted();
  };

  const handleWantedStatus = async (id, status) => {
    try {
      await api.setWantedStatus(id, status);
      showNotification('Request updated.');
      loadWanted();
    } catch (err) {
      showNotification(err.message);
    }
  };

  const handleDeleteWanted = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await api.deleteWanted(id);
      showNotification('Request deleted.');
      loadWanted();
    } catch (err) {
      showNotification(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    setActiveTab('marketplace');
    showNotification('You have been logged out.');
  };

  const wishlistCount = listings.filter((l) => l.isWishlisted).length;

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Loading…</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {toast && (
        <div role="status" className="fixed top-20 right-6 z-[60] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 max-w-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
          <span className="text-xs font-semibold">{toast.msg}</span>
        </div>
      )}

      <Navbar
        activeTab={activeTab}
        setActiveTab={goTo}
        onOpenPostModal={() => openPostModal()}
        wishlistCount={wishlistCount}
        user={user}
        onLogin={() => openAuth('login')}
        onSignup={() => openAuth('register')}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <MarketplacePage
            listings={listings}
            stats={stats}
            loading={listingsState.loading}
            error={listingsState.error}
            onRetry={loadListings}
            onToggleWishlist={handleToggleWishlist}
            onMakeOffer={openOfferModal}
            onPostItem={() => openPostModal()}
            onNavigateToHubs={() => goTo(isLoggedIn ? 'account' : 'marketplace')}
          />
        )}

        {activeTab === 'wanted' && (
          <WantedBoardPage
            wantedRequests={wanted}
            onOpenWantedModal={requireLogin(() => setIsWantedModalOpen(true))}
            onOpenOfferModal={requireLogin((req) => setWantedOfferTarget(req))}
            onSetWantedStatus={handleWantedStatus}
            onDeleteWanted={handleDeleteWanted}
          />
        )}

        {activeTab === 'advanced-search' && (
          <AdvancedSearchPage onMakeOffer={openOfferModal} onToggleWishlist={handleToggleWishlist} refreshKey={dataVersion} />
        )}

        {activeTab === 'wishlist' && isLoggedIn && (
          <WishlistPage onToggleWishlist={handleToggleWishlist} onMakeOffer={openOfferModal} onToast={showNotification} refreshKey={dataVersion} />
        )}

        {activeTab === 'account' && isLoggedIn && (
          <AccountPage
            user={user}
            onUserUpdated={setUser}
            onEditListing={(l) => openPostModal(l)}
            onPostItem={() => openPostModal()}
            onListingsChanged={() => {
              loadListings();
              bump();
            }}
            onToast={showNotification}
            refreshKey={dataVersion}
          />
        )}

      </main>

      <Footer onNavigate={goTo} />

      <AuthModal isOpen={auth.open} initialMode={auth.mode} onClose={() => setAuth((a) => ({ ...a, open: false }))} onAuthenticated={(u) => showNotification(`Welcome, ${u.name.split(' ')[0]}!`)} />

      <PostItemModal
        isOpen={postModal.open}
        listing={postModal.listing}
        onClose={() => setPostModal({ open: false, listing: null })}
        onSubmit={handleSubmitListing}
      />

      {offerTarget && <MakeOfferModal listing={offerTarget} onClose={() => setOfferTarget(null)} onSubmit={handleSendOffer} />}

      <PostWantedModal isOpen={isWantedModalOpen} onClose={() => setIsWantedModalOpen(false)} onAddWanted={handleAddWanted} />

      <OfferModal
        isOpen={Boolean(wantedOfferTarget)}
        onClose={() => setWantedOfferTarget(null)}
        wantedRequest={wantedOfferTarget}
        onSendOffer={handleSendWantedOffer}
      />
    </div>
  );
}

export default function App() {
  return (
    <CampusProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </CampusProvider>
  );
}
