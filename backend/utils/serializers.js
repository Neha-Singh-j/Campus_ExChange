// Turns database documents into the JSON shape the React app consumes.

const SELLER_FIELDS = 'name department year avatar isVerified';

const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const standingOf = (u) => [u.year, u.department].filter(Boolean).join(' • ') || 'Student';

const publicUser = (u) => {
  if (!u) return { id: null, name: 'Former student', role: 'Student', avatar: '', verified: false, initials: 'FS' };
  return {
    id: (u._id || u.id).toString(),
    name: u.name,
    role: standingOf(u),
    department: u.department || '',
    year: u.year || '',
    avatar: u.avatar || '',
    verified: u.isVerified !== undefined ? u.isVerified : Boolean(u.verified),
    initials: initialsOf(u.name),
  };
};

/**
 * `listing.sellerId` must be populated with SELLER_FIELDS.
 * opts.viewer: the signed-in user doc (or undefined); opts.wishIds: Set of listing ids they saved.
 */
const serializeListing = (l, opts = {}) => {
  const sellerDoc = l.sellerId && l.sellerId._id ? l.sellerId : null;
  const sellerId = (sellerDoc ? sellerDoc._id : l.sellerId)?.toString();
  const id = l._id.toString();
  const images = (l.images || []).map((i) => i.url);
  const isOwner = Boolean(opts.viewer && sellerId && opts.viewer._id.toString() === sellerId);
  const discount =
    l.originalPrice && l.originalPrice > l.price
      ? `${Math.round((1 - l.price / l.originalPrice) * 100)}% off`
      : '';

  return {
    id,
    title: l.title,
    desc: l.desc,
    price: l.price,
    originalPrice: l.originalPrice ?? null,
    discount,
    category: l.category,
    courseCode: l.courseCode,
    condition: l.condition,
    conditionBadge: l.conditionBadge,
    badge: l.courseCode ? 'COURSE MATCHED' : 'STUDENT DROP',
    meetupLocation: l.meetupLocation,
    tags: l.tags || [],
    images,
    image: images[0] || '',
    // Only the owner needs the storage ids (to remove photos when editing).
    ...(isOwner && { imageRecords: (l.images || []).map((i) => ({ url: i.url, publicId: i.publicId })) }),
    status: l.status,
    campusId: l.campusId,
    seller: publicUser(sellerDoc),
    isOwner,
    isWishlisted: Boolean(opts.wishIds && opts.wishIds.has(id)),
    createdAt: l.createdAt,
  };
};

const timeAgo = (date) => {
  const s = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const serializeWanted = (w, opts = {}) => {
  const owner = w.user && w.user._id ? w.user : null;
  const ownerId = (owner ? owner._id : w.user)?.toString();
  const n = (w.offers || []).length;
  const urgent = /urgent/i.test(w.urgency);
  return {
    id: w._id.toString(),
    user: owner ? owner.name : 'Former student',
    standing: owner ? standingOf(owner) : 'Student',
    avatar: owner?.avatar || '',
    campus: w.zone,
    timeAgo: timeAgo(w.createdAt),
    urgency: w.urgency,
    urgencyColor: urgent ? 'red' : /week/i.test(w.urgency) ? 'amber' : 'blue',
    tag: w.category,
    category: w.category,
    title: w.title,
    description: w.desc,
    budget: w.budget,
    activity: `${n} offer${n === 1 ? '' : 's'} received`,
    offersCount: n,
    status: w.status,
    isOwner: Boolean(opts.viewer && ownerId && opts.viewer._id.toString() === ownerId),
    createdAt: w.createdAt,
  };
};

const serializeOffer = (o, viewerId) => {
  const buyerId = (o.buyer._id || o.buyer).toString();
  const myRole = buyerId === viewerId.toString() ? 'buyer' : 'seller';
  const listing = o.listing && o.listing._id ? o.listing : null;
  return {
    id: o._id.toString(),
    status: o.status,
    turn: o.turn,
    myRole,
    awaitingMe: o.status === 'open' && o.turn === myRole,
    currentAmount: o.currentAmount,
    finalAmount: o.finalAmount ?? null,
    listingPrice: o.listingPrice,
    message: o.message,
    rounds: o.rounds,
    listing: listing
      ? {
          id: listing._id.toString(),
          title: listing.title,
          image: listing.images?.[0]?.url || '',
          price: listing.price,
          status: listing.status,
          category: listing.category,
          meetupLocation: listing.meetupLocation,
        }
      : { id: (o.listing || '').toString(), title: 'Removed listing', image: '', price: o.listingPrice, status: 'removed' },
    buyer: publicUser(o.buyer._id ? o.buyer : null),
    seller: publicUser(o.seller._id ? o.seller : null),
    history: (o.history || []).map((h) => ({
      action: h.action,
      role: h.role,
      amount: h.amount ?? null,
      message: h.message,
      at: h.at,
    })),
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
};

module.exports = { SELLER_FIELDS, publicUser, serializeListing, serializeWanted, serializeOffer, standingOf, initialsOf };
