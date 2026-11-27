# Campus Exchange

### Smart Campus Resource Exchange & Reuse Platform

Campus Exchange is a campus-focused marketplace that helps students buy,
sell, exchange, or donate useful items within their university
community. It is designed to make the exchange of academic, hostel, and
placement-related essentials easier, more affordable, and more
sustainable.

Unlike a general online marketplace, Campus Exchange focuses on a
trusted campus ecosystem. Students can list items, discover relevant
products, post what they are looking for, connect with other students,
and make better buying decisions with intelligent price guidance.

------------------------------------------------------------------------

## Key Features

### 1. Student Authentication

-   Secure registration and login.
-   JWT-based authentication.
-   Password hashing using bcrypt.
-   Email OTP verification for account verification.

### 2. Campus Marketplace

-   Create, update, and delete item listings.
-   Browse items listed by other students.
-   View item details, images, condition, and expected price.
-   Organize listings into relevant categories such as books,
    electronics, hostel essentials, and placement resources.

### 3. Search and Discovery

-   Search listings by title or keywords.
-   Filter items by category, price, and condition.
-   Explore relevant listings through a student-friendly interface.

### 4. Wanted Posts and Smart Matching

-   Publish a wanted post when a required item is not currently listed.
-   Allow other students to discover requests and respond with suitable
    listings.
-   Support matching between a student's requirement and available
    marketplace items.

### 5. Offers and Negotiation

-   Send offers for listed items.
-   Allow sellers to review and respond to offers.
-   Help buyers and sellers reach a mutually acceptable price.

### 6. Wishlist

-   Save interesting listings for later.
-   Quickly revisit shortlisted items.

### 7. Intelligent Price Guidance

-   Provide indicative price suggestions to help students estimate a
    reasonable resale price.
-   Use item-related information and available listing data as inputs
    for future machine-learning enhancements.
-   Price guidance is intended to support decisions; the final price
    remains between the buyer and seller.

### 8. Move-Out and Reuse

-   Support the exchange or donation of items students no longer need.
-   Encourage reuse of books, furniture, appliances, and other campus
    essentials.
-   Help reduce waste at the end of a semester or academic year.

### 9. Admin and Resource Management

-   Provide administrative oversight of users and listings.
-   Support moderation of inappropriate or misleading content.
-   Offer a foundation for campus resource information and platform
    analytics.

### 10. Real-Time Communication

-   The planned architecture supports real-time buyer-seller
    communication using Socket.IO.
-   Advanced communication features can be introduced incrementally
    after the core marketplace workflow is stable.

------------------------------------------------------------------------

## Technology Stack

  Layer                     Technologies
  ------------------------- ----------------------------------------------
  Frontend                  React.js, Vite, Tailwind CSS
  Backend                   Node.js, Express.js
  Database                  **MongoDB**, MongoDB Atlas
  ODM                       Mongoose
  Authentication            JWT, bcrypt
  Real-time communication   Socket.IO
  Image storage             Cloudinary
  Email verification        Nodemailer, OTP
  AI/ML service             Python, FastAPI, Pandas, NumPy, scikit-learn
  API testing               Postman
  Version control           Git, GitHub
  Deployment                Vercel (frontend), Render (backend)

> **Database note:** Campus Exchange uses MongoDB as its database, with
> Mongoose for data modelling and database operations. MySQL is not
> used.

------------------------------------------------------------------------

## System Architecture

Campus Exchange follows a modular full-stack architecture:

1.  **Frontend:** The React application provides the student and
    administrator interfaces.
2.  **Backend API:** The Node.js and Express.js server handles
    authentication, listings, wanted posts, offers, wishlists, and
    administrative operations.
3.  **Database:** MongoDB stores application data such as users,
    listings, requests, offers, and related records.
4.  **Media Storage:** Cloudinary stores listing images and returns
    image URLs for use in the application.
5.  **Email Service:** Nodemailer supports email-based OTP verification.
6.  **AI/ML Service:** A separate Python FastAPI service is planned for
    intelligent price guidance and other data-driven features.
7.  **Real-Time Layer:** Socket.IO can support live communication and
    updates between users.


``` text
                 ┌──────────────────────────┐
                 │       React + Vite       │
                 │     Tailwind CSS UI      │
                 └────────────┬─────────────┘
                              │ HTTP / API
                 ┌────────────▼─────────────┐
                 │     Node.js + Express    │
                 │       Backend API        │
                 └──────┬──────┬──────┬─────┘
                        │      │      │
             ┌──────────┘      │      └────────────┐
             │                 │                   │
   ┌─────────▼────────┐ ┌──────▼────────┐ ┌────────▼─────────┐
   │ MongoDB Atlas    │ │  Cloudinary   │ │ Python FastAPI   │
   │ + Mongoose       │ │ Image Storage │ │ AI/ML Service    │
   └──────────────────┘ └───────────────┘ └──────────────────┘

                  ┌─────────────────────┐
                  │ Socket.IO / Email   │
                  │ Real-time / Nodemailer│
                  └─────────────────────┘
```

------------------------------------------------------------------------


## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Install the following tools:

-   Node.js (LTS version recommended)
-   npm
-   MongoDB Atlas account or a local MongoDB instance
-   Git


## Environment Variables

Never commit real credentials, database passwords, JWT secrets, or API
keys to GitHub. Keep them in local `.env` files and add those files to
`.gitignore`.

Provide a `.env.example` file containing placeholder values so other
contributors can configure the application safely.

------------------------------------------------------------------------

## Suggested Project Structure

The exact structure may differ as development progresses. A suggested
organization is:

``` text
campus-exchange/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       └── assets/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── ai-service/
│   ├── models/
│   ├── services/
│   ├── main.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

------------------------------------------------------------------------

## Development Roadmap

  Phase     Work
  --------- ------------------------------------------------------
  Phase 1   Requirement analysis, UI planning, and project setup
  Phase 2   Authentication and user profile management
  Phase 3   Marketplace listings, categories, and item details
  Phase 4   Search, filters, wanted posts, and matching
  Phase 5   Offers, wishlist, and price guidance
  Phase 6   Admin features, testing, and deployment
  Phase 7   Incremental AI/ML and real-time feature enhancements

------------------------------------------------------------------------

## Security and Privacy

-   Store passwords as secure hashes; never store plain-text passwords.
-   Protect private routes with JWT authentication.
-   Validate and sanitize incoming data on the server.
-   Keep secrets and API credentials in environment variables.
-   Restrict administrative actions to authorized users.
-   Do not expose private user information in public listing responses.

------------------------------------------------------------------------

## Sustainability and Impact

Campus Exchange encourages a reuse-oriented campus culture by making it
easier for students to pass on useful items instead of discarding them.
It can reduce unnecessary spending, improve access to affordable
academic and hostel essentials, and support a more connected student
community.

------------------------------------------------------------------------

## Future Enhancements

-   Improved recommendation and item-matching algorithms.
-   More advanced ML-based resale price estimation.
-   QR-based item handover or verification.
-   Enhanced real-time chat and notifications.
-   Additional campus resource-sharing workflows.
-   Expanded analytics for administrators.

------------------------------------------------------------------------

## Team

Developed as a **B.Tech. Computer Science and Engineering final-year
major project**.

**Project:** Campus Exchange --- Smart Campus Resource Exchange & Reuse
Platform\
**Institution:** GLA University, Mathura\
**Team Size:** 5 members (Neha Singh, Pavitra Malhotra, Shristi, Vanisha Mittal(Group Lead), Yati)

------------------------------------------------------------------------

## Contribution

Contributions from team members and suggestions for improving the
platform are welcome. For major changes, discuss the proposed feature
with the project team before submitting a pull request.

------------------------------------------------------------------------

## License

This project is developed for academic purposes. Add a suitable
open-source license only if the project team intends to distribute the
code under those terms.
