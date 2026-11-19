import React, { useState } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [selectedCampus, setSelectedCampus] = useState('UC Berkeley • Main Campus');
  
  // Listings and Wanted requests state
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [wantedRequests, setWantedRequests] = useState(WANTED_REQUESTS);

  // Modals state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isWantedModalOpen, setIsWantedModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedWantedRequest, setSelectedWantedRequest] = useState(null);

  // Chat & Escrow State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTargetItem, setChatTargetItem] = useState(null);
  const [isEscrowOpen, setIsEscrowOpen] = useState(false);
  const [escrowTargetItem, setEscrowTargetItem] = useState(null);

  // Notification Toast state
  const [notificationMessage, setNotificationMessage] = useState(null);

  const showNotification = (msg) => {
    setNotificationMessage(msg);
    setTimeout(() => setNotificationMessage(null), 3500);
  };

  // Toggle Wishlist
  const handleToggleWishlist = (id) => {
    setListings(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.isWishlisted;
        showNotification(nextState ? `Added "${item.title}" to your Wishlist!` : `Removed from Wishlist.`);
        return { ...item, isWishlisted: nextState };
      }
      return item;
    }));
  };

  // Add new listing
  const handleAddItem = (newItem) => {
    setListings([newItem, ...listings]);
    showNotification(`Item "${newItem.title}" posted successfully!`);
  };

  // Add new wanted request
  const handleAddWanted = (newWanted) => {
    setWantedRequests([newWanted, ...wantedRequests]);
    showNotification(`Wanted request posted to 15,000+ campus peers!`);
  };

  // Open Chat with Seller
  const handleOpenChat = (item) => {
    setChatTargetItem(item);
    setIsChatOpen(true);
  };

  // Trigger Escrow Hold
  const handleTriggerEscrow = (item) => {
    setEscrowTargetItem(item);
    setIsEscrowOpen(true);
  };

  // Open Offer Modal for a wanted request
  const handleOpenOfferModal = (req) => {
    setSelectedWantedRequest(req);
    setIsOfferModalOpen(true);
  };

  // Send an offer
  const handleSendOffer = (requestId, offerDetails) => {
    showNotification(`Offer sent to student! Escrow handshake ready.`);
  };

  const wishlistCount = listings.filter(item => item.isWishlisted).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-900 selection:text-white">
      
      {/* Toast Alert */}
      {notificationMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-semibold">{notificationMessage}</span>
        </div>
      )}

      {/* Main Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        wishlistCount={wishlistCount}
        selectedCampus={selectedCampus}
        setSelectedCampus={setSelectedCampus}
        onOpenNotification={() => showNotification("You have 3 active escrow alerts and 1 price drop notification.")}
      />

      {/* Dynamic Page Views */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <MarketplacePage
            listings={listings}
            onToggleWishlist={handleToggleWishlist}
            onOpenChat={handleOpenChat}
            onTriggerEscrow={handleTriggerEscrow}
            onNavigateToHubs={() => setActiveTab('verification')}
            selectedCampus={selectedCampus}
          />
        )}

        {activeTab === 'verification' && (
          <VerificationPage
            selectedCampus={selectedCampus}
            setSelectedCampus={setSelectedCampus}
          />
        )}

        {activeTab === 'wanted' && (
          <WantedBoardPage
            wantedRequests={wantedRequests}
            onOpenWantedModal={() => setIsWantedModalOpen(true)}
            onOpenOfferModal={handleOpenOfferModal}
          />
        )}

        {activeTab === 'advanced-search' && (
          <AdvancedSearchPage
            onOpenChat={handleOpenChat}
            onTriggerEscrow={handleTriggerEscrow}
          />
        )}

        {activeTab === 'wishlist' && (
          <WishlistPage
            listings={listings}
            onToggleWishlist={handleToggleWishlist}
            onOpenChat={handleOpenChat}
            onTriggerEscrow={handleTriggerEscrow}
          />
        )}

        {activeTab === 'bundles' && (
          <MoveOutBundlesPage
            onTriggerEscrow={handleTriggerEscrow}
            onOpenPostModal={() => setIsPostModalOpen(true)}
          />
        )}

        {activeTab === 'synopsis' && (
          <SynopsisPage />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Global Modals & Drawers */}
      <PostItemModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onAddItem={handleAddItem}
        selectedCampus={selectedCampus}
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

      <EscrowModal
        isOpen={isEscrowOpen}
        onClose={() => setIsEscrowOpen(false)}
        targetItem={escrowTargetItem}
      />

    </div>
  );
}
