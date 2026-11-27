# Campus Exchange API

Express 5 + Mongoose. MongoDB is required.

```
npm install && cp .env.example .env && npm run seed && npm start
```

## Endpoints (all under `/api`)

Auth: `POST /auth/register`, `POST /auth/login`, `GET|PATCH /auth/me`

Listings: `GET /listings` (public; filters `search, category, condition, minPrice, maxPrice, sort, status, page, limit`),
`GET /listings/mine`, `GET /listings/stats/summary`, `GET /listings/:id`,
`POST /listings` and `PATCH /listings/:id` (multipart, field `images`), `PATCH /listings/:id/status`, `DELETE /listings/:id`

Offers (login required): `GET /offers`, `POST /offers`, `GET /offers/:id`,
`POST /offers/:id/respond` (`action: accept | reject | counter`), `/withdraw`, `/cancel`, `/complete`

Wanted: `GET|POST /wanted`, `GET|DELETE /wanted/:id`, `POST /wanted/:id/offer`, `GET /wanted/:id/offers`, `PATCH /wanted/:id/status`

Wishlist: `GET|POST /wishlist`, `DELETE /wishlist/:listingId`; watchlists under `/wishlist/watchlists`

Errors always look like `{ success: false, code, message }`.

## Layout

`config/` settings + DB, `models/`, `controllers/`, `routes/`, `middleware/` (auth, upload, errors),
`utils/` (mailer, image storage, serializers, seed), `uploads/` (local photos, git-ignored).
