import { useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MarketplacePage from './pages/MarketplacePage';
import VerificationPage from './pages/VerificationPage';
import WantedBoardPage from './pages/WantedBoardPage';
import AdvancedSearchPage from './pages/AdvancedSearchPage';
import WishlistPage from './pages/WishlistPage';
import MoveOutBundlesPage from './pages/MoveOutBundlesPage';
import SynopsisPage from './pages/SynopsisPage';

import PostItemModal from './components/PostItemModal';
import PostWantedModal from './components/PostWantedModal';
import OfferModal from './components/OfferModal';
import ChatDrawer from './components/ChatDrawer';
import EscrowModal from './components/EscrowModal';

import { INITIAL_LISTINGS, WANTED_REQUESTS } from './data/mockData';
import { localizeData } from './data/campuses';
import { CampusProvider } from './context/CampusContext';
import { useCampus } from './context/useCampus';

// Module-level cache (not a ref), so it is safe to call during render.
const seedCache = new Map();
function getSeed(c) {
  if (!seedCache.has(c.id)) {
    seedCache.set(c.id, {
      listings: localizeData(INITIAL_LISTINGS, c),
      wanted: localizeData(WANTED_REQUESTS, c),
    });
  }
  return seedCache.get(c.id);
}

function AppShell() {
  const { campus, selectCampus } = useCampus();

  const [activeTab, setActiveTab] = useState('marketplace');

  // ---- Per-campus data -----------------------------------------------------
  // Each campus gets its own listings + wanted board. The first time a campus is
  // opened, the Berkeley mock data is localized to it (landmarks, domain, names).
  // Edits (wishlist hearts, new posts) are kept separately per campus.
  const [store, setStore] = useState({}); // { [campusId]: { listings, wanted } }

  const current = store[campus.id] ?? getSeed(campus);
  const listings = current.listings;
  const wantedRequests = current.wanted;

  const patchCampus = (key, next) =>
    setStore((prev) => {
      const base = prev[campus.id] ?? getSeed(campus);
      return { ...prev, [campus.id]: { ...base, [key]: typeof next === 'function' ? next(base[key]) : next } };
    });

  // ---- Modals / drawers ----------------------------------------------------
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isWantedModalOpen, setIsWantedModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedWantedRequest, setSelectedWantedRequest] = useState(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTargetItem, setChatTargetItem] = useState(null);
  const [isEscrowOpen, setIsEscrowOpen] = useState(false);
  const [escrowTargetItem, setEscrowTargetItem] = useState(null);

  // ---- Toast ---------------------------------------------------------------
  const [notificationMessage, setNotificationMessage] = useState(null);
  const toastTimer = useRef(null);
  const showNotification = (msg) => {
    setNotificationMessage(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setNotificationMessage(null), 3500);
  };

  // ---- Handlers ------------------------------------------------------------
  const handleToggleWishlist = (id) => {
    const item = listings.find((l) => l.id === id);
    if (!item) return;
    const nextState = !item.isWishlisted;
    patchCampus('listings', (prev) => prev.map((l) => (l.id === id ? { ...l, isWishlisted: nextState } : l)));
    showNotification(nextState ? `Added "${item.title}" to your Wishlist!` : 'Removed from Wishlist.');
  };

  const handleAddItem = (newItem) => {
    patchCampus('listings', (prev) => [{ ...newItem, campusId: campus.id }, ...prev]);
    showNotification(`Item "${newItem.title}" posted at ${campus.short}!`);
  };

  const handleAddWanted = (newWanted) => {
    patchCampus('wanted', (prev) => [{ ...newWanted, campusId: campus.id }, ...prev]);
    showNotification(`Wanted request posted to ${campus.short} peers!`);
  };

  const handleOpenChat = (item) => {
    setChatTargetItem(item);
    setIsChatOpen(true);
  };

  const handleTriggerEscrow = (item) => {
    setEscrowTargetItem(item);
    setIsEscrowOpen(true);
  };

  const handleOpenOfferModal = (req) => {
    setSelectedWantedRequest(req);
    setIsOfferModalOpen(true);
  };

  const handleSendOffer = () => {
    showNotification('Offer sent to student! Escrow handshake ready.');
  };

  // Switching campus: close anything tied to the old campus and confirm the switch.
  const handleSelectCampus = (idOrLabel) => {
    selectCampus(idOrLabel);
    setIsChatOpen(false);
    setIsEscrowOpen(false);
    setIsOfferModalOpen(false);
    setChatTargetItem(null);
    setEscrowTargetItem(null);
    setSelectedWantedRequest(null);
  };

  const wishlistCount = listings.filter((item) => item.isWishlisted).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toast Alert */}
      {notificationMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-semibold">{notificationMessage}</span>
        </div>
      )}

      {/* Main Top Navigation Bar — render <CampusSelector /> inside it (see notes) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        wishlistCount={wishlistCount}
        selectedCampus={campus.label}
        setSelectedCampus={handleSelectCampus}
        onOpenNotification={() => showNotification('You have 3 active escrow alerts and 1 price drop notification.')}
      />

      {/* Dynamic Page Views — keyed by campus so page-local filters/search reset on switch */}
      <main className="flex-1" key={campus.id}>
        {activeTab === 'marketplace' && (
          <MarketplacePage
            listings={listings}
            onToggleWishlist={handleToggleWishlist}
            onOpenChat={handleOpenChat}
            onNavigateToHubs={() => setActiveTab('verification')}
          />
        )}

        {activeTab === 'verification' && (
          <VerificationPage selectedCampus={campus.label} setSelectedCampus={handleSelectCampus} />
        )}

        {activeTab === 'wanted' && (
          <WantedBoardPage
            wantedRequests={wantedRequests}
            onOpenWantedModal={() => setIsWantedModalOpen(true)}
            onOpenOfferModal={handleOpenOfferModal}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'advanced-search' && (
          <AdvancedSearchPage onOpenChat={handleOpenChat} onTriggerEscrow={handleTriggerEscrow} />
        )}

        {activeTab === 'wishlist' && (
          <WishlistPage
            listings={listings}
            onToggleWishlist={handleToggleWishlist}
            onOpenChat={handleOpenChat}
            onTriggerEscrow={handleTriggerEscrow}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'bundles' && (
          <MoveOutBundlesPage onTriggerEscrow={handleTriggerEscrow} onOpenPostModal={() => setIsPostModalOpen(true)} />
        )}

        {activeTab === 'synopsis' && <SynopsisPage />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} activeTab={activeTab} />

      {/* Global Modals & Drawers */}
      <PostItemModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onAddItem={handleAddItem}
        selectedCampus={campus.label}
      />

      <PostWantedModal
        isOpen={isWantedModalOpen}
        onClose={() => setIsWantedModalOpen(false)}
        onAddWanted={handleAddWanted}
      />

      <OfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        wantedRequest={selectedWantedRequest}
        onSendOffer={handleSendOffer}
      />

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        targetItem={chatTargetItem}
        onTriggerEscrow={(item) => {
          setIsChatOpen(false);
          handleTriggerEscrow(item);
        }}
      />

      <EscrowModal isOpen={isEscrowOpen} onClose={() => setIsEscrowOpen(false)} targetItem={escrowTargetItem} />
    </div>
  );
}

export default function App() {
  return (
    <CampusProvider>
      <AppShell />
    </CampusProvider>
  );
}