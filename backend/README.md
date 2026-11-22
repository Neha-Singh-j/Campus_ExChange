# CampusZon — Backend (MVC Architecture)

RESTful API backend for **CampusZon** (UC Berkeley Verified Student Marketplace), built with **Node.js, Express, and Mongoose** following standard **Model-View-Controller (MVC)** architecture.

---

## 🏛️ Architecture Overview

```text
backend/
├── config/
│   └── db.js                 # Database connection & auto-seeding logic
├── models/                   # [M] Mongoose Schemas / Data Models
│   ├── Listing.js            # Marketplace listing model
│   ├── Bundle.js             # Move-Out Bundle model
│   ├── Wanted.js             # Wanted / ISO request model
│   ├── Wishlist.js           # Wishlist & Course Watchlist model
│   ├── Verification.js       # Student verification profile model
│   └── Hub.js                # Safe meetup hubs model
├── controllers/              # [C] Business Logic & Request Handlers
│   ├── listingController.js  # CRUD & filtering for listings
│   ├── bundleController.js   # CRUD & claim handoffs for move-out bundles
│   ├── wantedController.js   # CRUD & offers for wanted requests
│   ├── searchController.js   # Syllabus & catalog search engine
│   ├── wishlistController.js # Saved items & course watchlists
│   ├── verifyController.js   # Institutional student verification
│   └── hubController.js      # Meetup zones & safety pledge
├── routes/                   # Routing Layer (REST API Endpoints)
│   ├── listingRoutes.js      # /api/listings
│   ├── bundleRoutes.js       # /api/bundles
│   ├── wantedRoutes.js       # /api/wanted
│   ├── searchRoutes.js       # /api/search
│   ├── wishlistRoutes.js     # /api/wishlist
│   ├── verifyRoutes.js       # /api/verify
│   ├── hubRoutes.js          # /api/hubs
│   └── index.js              # Aggregated API router
├── middleware/
│   └── errorHandler.js       # Central error handling & 404 middleware
├── utils/
│   ├── seedData.js           # Canonical UC Berkeley seed dataset
│   └── memoryStore.js        # Automatic in-memory fallback store
├── .env                      # Environment configuration
├── app.js                    # Express application configuration
├── server.js                 # Server entry point
└── test-api.js               # Automated REST API test suite
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (`.env`)
The default `.env` is already configured:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campuszon
NODE_ENV=development
```
> **Note on Database:** If MongoDB is running locally or via Atlas, the server automatically connects and seeds initial data. If MongoDB is not running, the backend seamlessly activates an **In-Memory Store** so all CRUD endpoints work immediately out-of-the-box.

### 3. Start the Server
```bash
npm start
```
The server will start on `http://localhost:5000`:
- **API Base**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

### 4. Run API Tests
```bash
npm test
```

---

## 📡 REST API Reference

### 1. Marketplace Listings (`/api/listings`)
- `GET /api/listings` — Get all listings (supports query parameters: `cat`, `condition`, `fastResponder`, `search`, `sort`)
- `GET /api/listings/:id` — Get single listing by ID
- `POST /api/listings` — Create a new item listing (`title`, `price`, `category`, `desc`, `loc`)
- `PATCH /api/listings/:id/like` — Toggle item like / increment favorites
- `DELETE /api/listings/:id` — Delete a listing
- `GET /api/listings/stats/summary` — Get active listings count, handoff stats, and live feed

### 2. Move-Out Bundles (`/api/bundles`)
- `GET /api/bundles` — Get all move-out bundles (filters: `cat`, `zone`, `sweetSpot`, `dollyOnly`, `seniorOnly`)
- `GET /api/bundles/:id` — Get single bundle details
- `POST /api/bundles` — Create a move-out bundle
- `POST /api/bundles/:id/claim` — Claim a bundle and initiate escrow hold
- `GET /api/bundles/stats/overview` — Get countdown target and savings metrics

### 3. Wanted & ISO Board (`/api/wanted`)
- `GET /api/wanted` — Get active ISO requests (filters: `category`, `urgency`, `zone`, `search`)
- `GET /api/wanted/:id` — Get single wanted request
- `POST /api/wanted` — Post a new student request (`title`, `budget`, `desc`, `zone`, `urgency`)
- `POST /api/wanted/:id/offer` — Submit a peer offer for a request

### 4. Advanced Course Search (`/api/search`)
- `GET /api/search` — Query course syllabus items (filters: `q`, `course` e.g. `BIO 1A`, `department`, `maxPrice`, `condition`, `verifiedOnly`, `sameDay`, `sort`)

### 5. Wishlist & Course Watchlists (`/api/wishlist`)
- `GET /api/wishlist` — Retrieve user's saved wishlist items
- `POST /api/wishlist` — Add item to wishlist
- `DELETE /api/wishlist/:id` — Remove item from wishlist
- `GET /api/wishlist/watchlists` — Get active course watchlist alerts
- `POST /api/wishlist/watchlists` — Create new course watchlist
- `PATCH /api/wishlist/watchlists/:id/toggle-notify` — Toggle auto-notify
- `DELETE /api/wishlist/watchlists/:id` — Delete a course watchlist

### 6. Student Verification (`/api/verify`)
- `GET /api/verify/profile` — Get active student verification profile
- `POST /api/verify/request` — Submit student verification (`campus`, `academicEmail`, `studentType`, `idScanFileName`, `consent`)

### 7. Campus Meetup Hubs (`/api/hubs`)
- `GET /api/hubs` — Get designated safe meetup hubs (Moffitt, MLK Union, UCPD Station)
- `GET /api/hubs/safety-pledge` — ScamShield™ protocol & data protection policies
