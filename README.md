# Campus Exchange

A marketplace where verified students of one campus buy, sell, negotiate and request items
(textbooks, calculators, lab gear, hostel items). React + Vite frontend, Express + MongoDB backend.

## What is real now

| Feature | How it works |
|---|---|
| Accounts | Register / login with **JWT** (7 days) and **bcrypt** password hashing |
| Campus-only sign-up | Only emails ending in `ALLOWED_EMAIL_DOMAINS` (default `gla.ac.in`, subdomains allowed) can register |
| No email code | Sign-up is just name, campus email and password - there is **no OTP / email verification**. The domain is only checked by its text, so the app cannot prove someone owns that address |
| Ownership | Every listing, offer, wishlist item and watchlist belongs to a user. Only the seller can edit / delete / change status of a listing |
| Photos | Up to 5 per listing (JPG/PNG/WebP, 5 MB each, real file type checked). **Cloudinary** if configured, otherwise `backend/uploads/` |
| Offers | Buyer offers, seller accepts / declines / **counters**, either side can counter back (max 8 rounds). Accepting reserves the item atomically; seller marks it sold after hand-off; either side can cancel an agreed deal |
| Wanted board | Requests and offers are tied to users; owners can see offers, mark fulfilled, delete |
| Wishlist + course watchlists | Per user. A new listing matching a watchlist (course code in the title / course field, price under your limit) emails you |
| No mock data | The frontend reads everything from the API. Empty database = empty (honest) pages |

## Run it

You need **Node 20+** and **MongoDB** (local, or a free MongoDB Atlas connection string).

```bash
# 1) Backend
cd backend
cp .env.example .env        # then edit it (see below)
npm install
npm run seed                # optional demo students + listings (password Demo@12345)
npm start                   # http://localhost:5000/api/health

# 2) Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

### Settings that matter (`backend/.env`)

- `MONGODB_URI` - your database (the server stops with a clear message if it cannot connect).
- `ALLOWED_EMAIL_DOMAINS` - your university's email domain.
- `JWT_SECRET` - **required in production**. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- Email is **optional** and only used for offer / watchlist notifications. For real emails set `BREVO_API_KEY` + `BREVO_SENDER_EMAIL` (free Brevo account) or the `SMTP_*` values; with neither, emails are just printed in the backend console.
- Photos: set `CLOUDINARY_URL` (or the 3 `CLOUDINARY_*` values) for cloud storage.

### Demo accounts (after `npm run seed`)

`aarav@demo.gla.ac.in`, `diya@demo.gla.ac.in`, `rohan@demo.gla.ac.in` - password `Demo@12345`.
`npm run seed:reset` removes demo data again. These addresses are not real mailboxes.

### Tests

With the backend running: `cd backend && npm test` runs an end-to-end check of sign-up
rules, ownership, uploads, wishlist and the full offer -> counter -> accept -> sold flow.

## Make it your own campus

1. `frontend/src/data/campuses.js` - name, email domain, currency, **real meetup spots** (current ones are placeholders).
2. `backend/.env` - `CAMPUS_ID`, `ALLOWED_EMAIL_DOMAINS`.
3. `backend/utils/seed.js` - demo data (placeholders to edit).

## Not built yet

Real-time chat, in-app notifications (emails only), forgot-password, admin panel, reviews/ratings,
price-suggestion ML service, move-out bundles (removed - it was a mock page; see `_removed/README.md`).
The Synopsis page text is the original project document and still describes the planned scope.
