# VoyageGen — AI-Powered Travel Quote Management Platform

> An end-to-end multi-role travel platform that connects **Travelers**, **Travel Agents**, and **Hotel/DMC Partners** through an AI-driven workflow for travel requirement gathering, partner discovery via semantic search, automated quote generation, AI-powered itinerary creation, and programmatic PDF export.

---

## 1. Project Overview

### What It Does

VoyageGen is a full-stack web application that digitizes and automates the B2B travel quotation pipeline. A **Traveler** submits their trip preferences (destination, budget, dates, party size, hotel preferences), and a **Travel Agent** receives the requirement, searches for matching **Partners** (hotels, cab providers, DMCs) using both traditional filters and AI-powered semantic search, generates itemized price quotes, enriches them with AI-generated day-by-day itineraries, and sends a branded public link to the Traveler via email. The Traveler can then review, accept, or decline the quote — and optionally download a high-fidelity PDF itinerary.

### Problem It Solves

In the travel industry, creating a customized trip quotation is a labor-intensive process that involves manually contacting multiple hotels and service providers, calculating costs with margins, building itineraries, and formatting everything into a presentable document. VoyageGen automates this entire lifecycle:

- **Requirement intake** is standardized through a structured form.
- **Partner discovery** uses Gemini-powered vector embeddings + cosine similarity to semantically match traveler descriptions to partner offerings.
- **Quote generation** automatically builds itemized cost breakdowns (hotels, transport, activities) from partner profiles.
- **Itinerary creation** leverages Groq's Llama 4 Scout LLM to produce immersive, day-by-day travel plans.
- **PDF export** generates professional, multi-page branded documents using jsPDF with Pexels images.
- **Email delivery** sends shareable public quote links via Web3Forms.

### Real-World Use Case

A boutique travel agency in India uses VoyageGen to handle inquiries. When a honeymoon couple requests a Maldives trip, the agent searches for matching luxury resorts using a natural language query like _"romantic overwater villa with private pool"_. The system returns semantically ranked partners, auto-generates a costed quote, creates a 5-day itinerary with LLM, and emails a branded link to the couple — all within minutes instead of hours.

---

## 2. Key Features

| Feature                                                     | Status      | Description                                                                |
| ----------------------------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| Multi-role authentication (Traveler, Agent, Partner, Admin) | [CONFIRMED] | JWT-based auth with role-based route protection                            |
| Public requirement submission form                          | [CONFIRMED] | Travelers submit trip preferences without authentication                   |
| Agent dashboard with requirement management                 | [CONFIRMED] | View, filter, and manage incoming travel requirements                      |
| AI-powered partner semantic search                          | [CONFIRMED] | Gemini embedding + cosine similarity matching on partner descriptions      |
| Traditional partner filtering                               | [CONFIRMED] | Filter by destination, budget range, type, hotel star rating               |
| Automated quote generation from partner profiles            | [CONFIRMED] | Builds itemized hotel/transport/activity cost sections automatically       |
| Quote editor with cost management                           | [CONFIRMED] | Edit sections, costs, margins, and status (DRAFT → READY → SENT)           |
| AI itinerary generation via Groq LLM                        | [CONFIRMED] | Llama 4 Scout produces structured JSON day-by-day itineraries              |
| Immersive itinerary timeline UI with Pexels images          | [CONFIRMED] | Real-time image fetching per day, skeleton loading, color-coded cards      |
| Programmatic PDF export (jsPDF)                             | [CONFIRMED] | Multi-page branded PDF with cover page, hero images, and styled content    |
| Public quote sharing via unique tokens                      | [CONFIRMED] | Cryptographically generated UUIDs for shareable quote URLs                 |
| Email delivery via Web3Forms                                | [CONFIRMED] | Sends branded quote links to travelers via Web3Forms API                   |
| Quote accept/decline by traveler (public)                   | [CONFIRMED] | Public endpoint lets travelers accept or decline without login             |
| Partner profile management                                  | [CONFIRMED] | Partners manage company info, destinations, specializations, budget ranges |
| Partner inventory system (Hotels, Transport, Activities)    | [CONFIRMED] | Three separate Mongoose models for partner inventory items                 |
| 3D animated landing page with Vanta.js clouds               | [CONFIRMED] | Three.js-powered cloud animation on the hero section                       |
| GSAP scroll-driven animations                               | [CONFIRMED] | ScrollTrigger-powered gallery, service cards, and destination strips       |
| Lenis smooth scroll                                         | [CONFIRMED] | Custom easing for the landing page (disabled in portals)                   |
| Framer Motion page transitions                              | [CONFIRMED] | AnimatePresence-wrapped route transitions                                  |
| Comprehensive seed data (40+ luxury partners)               | [CONFIRMED] | 20 Indian + 20 international partner profiles with embeddings              |
| Responsive design with mobile support                       | [CONFIRMED] | Full mobile menu, responsive grids, and touch-friendly forms               |
| Partner dashboard                                           | [PARTIAL]   | Basic layout exists but minimal content                                    |
| Admin role                                                  | [PARTIAL]   | Role exists in schema and auth, but no admin-specific UI                   |
| Rate limiting / request throttling                          | [PLANNED]   | Not implemented; no middleware observed                                    |
| Password reset flow                                         | [PLANNED]   | Not implemented                                                            |

---

## 3. Tech Stack

### Frontend

| Technology       | Version  | Purpose                                                 |
| ---------------- | -------- | ------------------------------------------------------- |
| React            | 19.2.0   | UI framework                                            |
| TypeScript       | 5.9.3    | Type safety                                             |
| Vite             | 7.2.4    | Build tool & dev server                                 |
| TailwindCSS      | 4.1.17   | Utility-first CSS framework                             |
| Framer Motion    | 12.23.24 | Page transitions & micro-animations                     |
| GSAP             | 3.13.0   | Scroll-driven animations (ScrollTrigger)                |
| Three.js         | 0.134.0  | 3D rendering (used by Vanta)                            |
| Vanta.js         | 0.5.24   | Animated cloud background                               |
| Lenis            | 1.3.15   | Smooth scroll library                                   |
| Axios            | 1.13.2   | HTTP client                                             |
| React Router DOM | 7.9.6    | Client-side routing                                     |
| React Icons      | 5.5.0    | Icon library (Font Awesome set)                         |
| jsPDF            | 4.2.1    | Programmatic PDF generation                             |
| html2canvas      | 1.4.1    | HTML-to-canvas rendering (installed, not actively used) |

### Backend

| Technology            | Version | Purpose                           |
| --------------------- | ------- | --------------------------------- |
| Express               | 5.1.0   | REST API framework                |
| TypeScript            | 5.9.3   | Type safety                       |
| tsx                   | 4.20.6  | TypeScript execution & hot-reload |
| Mongoose              | 9.0.0   | MongoDB ODM                       |
| JSON Web Token        | 9.0.2   | Authentication tokens             |
| bcryptjs              | 3.0.3   | Password hashing                  |
| @google/generative-ai | 0.24.1  | Gemini API (embeddings)           |
| groq-sdk              | 1.1.2   | Groq API (Llama 4 Scout LLM)      |
| cors                  | 2.8.5   | Cross-origin resource sharing     |
| dotenv                | 17.2.3  | Environment variable management   |

### Database

| Technology    | Purpose                                    |
| ------------- | ------------------------------------------ |
| MongoDB Atlas | Cloud-hosted NoSQL database                |
| Mongoose ODM  | Schema definitions, validation, population |

### External APIs

| Service                                            | Purpose                                                    |
| -------------------------------------------------- | ---------------------------------------------------------- |
| Google Gemini (`gemini-embedding-001`)             | Text embedding generation for semantic search              |
| Groq (`meta-llama/llama-4-scout-17b-16e-instruct`) | LLM-based itinerary generation                             |
| Pexels API                                         | Destination/activity photography for itinerary UI and PDFs |
| Web3Forms                                          | Transactional email delivery                               |

---

## 4. System Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vite + React 19)               │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌────────────────┐  │
│  │ Landing  │  │ Auth     │  │ Agent     │  │ Partner        │  │
│  │ Page     │  │ (Login/  │  │ Portal    │  │ Portal         │  │
│  │ (Vanta,  │  │ Signup)  │  │ (Dash,    │  │ (Dash,         │  │
│  │ GSAP)    │  │          │  │ Quotes,   │  │ Inventory)     │  │
│  │          │  │          │  │ Editor)   │  │                │  │
│  └─────────┘  └──────────┘  └───────────┘  └────────────────┘  │
│                              │                                    │
│  ┌───────────────────────────┴──────────────────────────────┐    │
│  │  AuthContext (JWT in localStorage) + ProtectedRoute       │    │
│  └───────────────────────────────────────────────────────────┘    │
└──────────────────────────────┬───────────────────────────────────┘
                               │ Axios (REST)
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                     BACKEND (Express 5 + TypeScript)             │
│                                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Auth     │  │ Requirements │  │ Quotes   │  │ Partners   │  │
│  │ Routes   │  │ Routes       │  │ Routes   │  │ Routes     │  │
│  └────┬─────┘  └──────┬───────┘  └────┬─────┘  └─────┬──────┘  │
│       │               │               │              │          │
│  ┌────┴─────┐  ┌──────┴───────┐  ┌────┴─────┐  ┌────┴──────┐  │
│  │ Auth     │  │ Requirement  │  │ Quote    │  │ Partner   │  │
│  │Controller│  │ Controller   │  │Controller│  │Controller │  │
│  └──────────┘  └──────────────┘  └──────────┘  └───────────┘  │
│       │                                │              │          │
│  ┌────┴────────────────────────────────┴──────────────┴──────┐  │
│  │              Middleware: protect() + authorize()           │  │
│  └───────────────────────────────────────────────────────────┘  │
│       │                                │              │          │
│  ┌────┴────────────────────────────────┴──────────────┴──────┐  │
│  │    Utils: Gemini Embeddings │ Groq LLM │ Email │ Vector   │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────────┘
                               │ Mongoose
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      MongoDB Atlas                               │
│  Collections: users, requirements, quotes,                       │
│  partnerprofiles, partnerhotels, partnertransports,              │
│  partneractivities                                               │
└──────────────────────────────────────────────────────────────────┘
```

### Request Flow (Quote Generation)

1. **Traveler** fills out the `PlanJourney` form → `POST /api/requirements` (public)
2. **Agent** views requirement on dashboard → `GET /api/requirements` (protected)
3. Agent opens requirement details → searches partners via `POST /api/partners/filter` with semantic query
4. Agent selects partners → `POST /api/quotes/generate` auto-builds itemized quotes
5. Agent edits quote in QuoteEditor → `PUT /api/quotes/:id`
6. Agent generates AI itinerary → `POST /api/quotes/:id/itinerary` (calls Groq LLM)
7. Agent sends quote to traveler → `POST /api/quotes/:id/send` (generates shareToken, emails link)
8. **Traveler** opens `GET /api/quotes/public/:token` → views quote at `/quote/view/:token`
9. Traveler accepts/declines → `POST /api/quotes/public/:token/status`

---

## 5. Folder Structure Breakdown

```
VoyageGen/
├── shared/                         # Shared TypeScript types (DTOs)
│   └── types.ts                    # User, Requirement, Quote, PartnerProfile interfaces
│
├── backend/
│   ├── server.ts                   # Express app entry point, middleware, route mounting
│   ├── config/
│   │   └── env.ts                  # Centralized environment variable exports
│   ├── constants/
│   │   └── partners.ts             # 40+ seed partner data (Indian + International)
│   ├── controllers/
│   │   ├── authController.ts       # Register, login with JWT generation
│   │   ├── requirementController.ts# CRUD for travel requirements
│   │   ├── quoteController.ts      # Quote generation, editing, sending, itinerary
│   │   └── partnerController.ts    # Profile CRUD, inventory, semantic filter
│   ├── middleware/
│   │   └── authMiddleware.ts       # JWT protect() and RBAC authorize()
│   ├── models/
│   │   ├── User.ts                 # User schema with bcrypt password hashing
│   │   ├── Requirement.ts          # Travel requirement schema
│   │   ├── Quote.ts                # Quote schema with sections, costs, itinerary
│   │   ├── PartnerProfile.ts       # Partner profile with description_embedding
│   │   └── PartnerInventory.ts     # Hotel, Transport, Activity sub-models
│   ├── routes/
│   │   ├── authRoutes.ts           # POST /signup, POST /login
│   │   ├── requirementRoutes.ts    # CRUD with RBAC protection
│   │   ├── quoteRoutes.ts          # Full quote lifecycle + public endpoints
│   │   └── partnerRoutes.ts        # Partner profile + agent filter
│   ├── seeders/
│   │   ├── seedIndianPartners.ts   # Seeds 20 Indian luxury hotel partners
│   │   └── seedPartners.ts         # Seeds 20 international luxury partners
│   ├── types/
│   │   └── express.d.ts            # Express Request augmentation for user
│   └── utils/
│       ├── emailUtils.ts           # Web3Forms email sending with fallback
│       ├── errorHandler.ts         # Centralized error response utility
│       ├── geminiUtils.ts          # Gemini embedding (single + batch)
│       ├── groqUtils.ts            # Groq LLM itinerary generation
│       └── vectorUtils.ts          # Cosine similarity computation
│
├── frontend/
│   ├── index.html                  # SPA entry with favicon
│   ├── vite.config.js              # Vite + React + TailwindCSS plugins
│   ├── src/
│   │   ├── main.tsx                # React 19 createRoot entry
│   │   ├── App.tsx                 # Router, AuthProvider, Lenis smooth scroll
│   │   ├── index.css               # Global styles, Tailwind imports, animations
│   │   ├── App.css                 # Legacy Vite template CSS (mostly unused)
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Auth state, login/logout/register via Axios
│   │   ├── types/
│   │   │   └── index.ts            # Re-exports shared types + frontend User extension
│   │   ├── data/
│   │   │   └── destinations.js     # Static destination data for landing page
│   │   ├── layouts/
│   │   │   ├── AgentLayout.tsx     # Agent portal shell with Outlet
│   │   │   └── PartnerLayout.tsx   # Partner portal shell with Outlet
│   │   ├── components/
│   │   │   ├── AnimatedRoutes.tsx   # All route definitions with AnimatePresence
│   │   │   ├── ProtectedRoute.tsx   # Role-based route guard
│   │   │   ├── Header.tsx           # Landing page glassmorphism header (GSAP)
│   │   │   ├── Hero.tsx             # 3D cloud background hero (Vanta + GSAP)
│   │   │   ├── AgentHeader.tsx      # Agent portal header with navigation
│   │   │   ├── BentoGrid.tsx        # Feature showcase bento grid
│   │   │   ├── Services.tsx         # Three-column service cards
│   │   │   ├── FeaturedDestinations.tsx # Clickable destination grid
│   │   │   ├── DestinationGallery.tsx   # GSAP horizontal scroll gallery
│   │   │   ├── DestinationStrip.tsx     # Quick destination strip cards
│   │   │   ├── DestinationFeedback.tsx  # Review/rating display for destinations
│   │   │   ├── TestimonialMarquee.tsx   # Infinite CSS marquee testimonials
│   │   │   ├── Footer.tsx               # Site footer with social links
│   │   │   ├── RequirementForm.tsx      # Modal overlay trip requirement form
│   │   │   └── ItineraryTimeline.tsx    # AI itinerary display with Pexels images
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx      # Composed landing page
│   │   │   ├── Login.tsx            # Split-screen login with animations
│   │   │   ├── Signup.tsx           # Multi-role registration form
│   │   │   ├── PlanJourney.tsx      # Full-page trip requirement form (for Users)
│   │   │   ├── ThankYou.tsx         # Post-submission confirmation
│   │   │   ├── PublicQuoteView.tsx   # Token-based public quote view + accept/decline
│   │   │   ├── agent/
│   │   │   │   ├── AgentDashboard.tsx      # Requirements list with status badges
│   │   │   │   ├── RequirementDetails.tsx  # Detailed view + partner search + quote gen
│   │   │   │   ├── QuoteEditor.tsx         # Full quote editing + itinerary + PDF export
│   │   │   │   └── QuotesList.tsx          # All quotes list with management
│   │   │   └── partner/
│   │   │       ├── PartnerDashboard.tsx    # Basic partner dashboard
│   │   │       └── Inventory.tsx           # Partner inventory management UI
│   │   └── utils/
│   │       └── generatePDF.ts       # jsPDF-based multi-page itinerary PDF generator
│   └── public/
│       ├── favicon.png
│       └── vite.svg
```

---

## 6. API Design

### Authentication

| Method | Endpoint           | Purpose                                | Auth Required |
| ------ | ------------------ | -------------------------------------- | ------------- |
| POST   | `/api/auth/signup` | Register new user (Agent/Partner/User) | No            |
| POST   | `/api/auth/login`  | Authenticate and receive JWT           | No            |

### Requirements

| Method | Endpoint                | Purpose                         | Auth Required            |
| ------ | ----------------------- | ------------------------------- | ------------------------ |
| POST   | `/api/requirements`     | Submit a new travel requirement | No (public)              |
| GET    | `/api/requirements`     | List all requirements           | Yes (Agent, Admin)       |
| GET    | `/api/requirements/:id` | Get requirement by ID           | Yes (User, Agent, Admin) |
| PUT    | `/api/requirements/:id` | Update requirement status       | Yes (Agent, Admin)       |
| DELETE | `/api/requirements/:id` | Delete a requirement            | Yes (Agent, Admin)       |

### Quotes

| Method | Endpoint                           | Purpose                                    | Auth Required      |
| ------ | ---------------------------------- | ------------------------------------------ | ------------------ |
| POST   | `/api/quotes/generate`             | Auto-generate quotes for selected partners | Yes (Agent, Admin) |
| GET    | `/api/quotes`                      | List all quotes                            | Yes (Agent, Admin) |
| GET    | `/api/quotes/requirement/:id`      | Get quotes for a specific requirement      | Yes (Agent, Admin) |
| GET    | `/api/quotes/:id`                  | Get quote by ID                            | Yes (Agent, Admin) |
| PUT    | `/api/quotes/:id`                  | Update quote (sections, costs, status)     | Yes (Agent, Admin) |
| DELETE | `/api/quotes/:id`                  | Delete a quote                             | Yes (Agent, Admin) |
| POST   | `/api/quotes/:id/send`             | Send quote email to traveler               | Yes (Agent, Admin) |
| POST   | `/api/quotes/:id/itinerary`        | Generate AI day-by-day itinerary           | Yes (Agent, Admin) |
| GET    | `/api/quotes/public/:token`        | View quote via share token                 | No (public)        |
| POST   | `/api/quotes/public/:token/status` | Accept or decline quote                    | No (public)        |

### Partners

| Method | Endpoint                        | Purpose                                                | Auth Required      |
| ------ | ------------------------------- | ------------------------------------------------------ | ------------------ |
| GET    | `/api/partners/me`              | Get current partner's profile                          | Yes (Partner)      |
| POST   | `/api/partners/profile`         | Create/update partner profile                          | Yes (Partner)      |
| POST   | `/api/partners/inventory/:type` | Add inventory item (hotel/transport/activity)          | Yes (Partner)      |
| POST   | `/api/partners/filter`          | Search/filter partners (with optional semantic search) | Yes (Agent, Admin) |

### Data Flow: Quote Generation Endpoint

```
POST /api/quotes/generate { requirementId, partnerIds[] }

1. Fetch Requirement from DB
2. For each partnerId:
   a. Fetch PartnerProfile (populated with User)
   b. Build QuoteSection:
      - Hotels: from partner.startingPrice × (duration - 1) nights
      - Transport: default ₹3000/day × duration
      - Activities: from partner.sightSeeing (top 3, varying prices)
   c. Calculate costs: net, margin (10%), final, perHead
   d. Create Quote document with status: DRAFT
3. Update Requirement status → QUOTES_READY
4. Return array of created quotes
```

---

## 7. Database Design

### Collections & Fields

#### `users`

| Field          | Type     | Constraints                       | Description                     |
| -------------- | -------- | --------------------------------- | ------------------------------- |
| `name`         | String   | Required                          | User's full name                |
| `email`        | String   | Required, Unique                  | Login identifier                |
| `password`     | String   | Required                          | bcrypt-hashed (salt rounds: 10) |
| `role`         | String   | Enum: AGENT, PARTNER, ADMIN, USER | Authorization role              |
| `companyName`  | String   | Optional                          | For Partner accounts            |
| `destinations` | [String] | Optional                          | For Partner accounts            |
| `createdAt`    | Date     | Auto                              | Mongoose timestamps             |
| `updatedAt`    | Date     | Auto                              | Mongoose timestamps             |

#### `requirements`

| Field                  | Type     | Constraints    | Description                                                 |
| ---------------------- | -------- | -------------- | ----------------------------------------------------------- |
| `destination`          | String   | Required       | Target destination                                          |
| `tripType`             | String   | Required       | Honeymoon, Family, Business, etc.                           |
| `budget`               | Number   | Required       | Total budget in INR                                         |
| `startDate`            | Date     | Optional       | Preferred start date                                        |
| `duration`             | Number   | Optional       | Trip length in days                                         |
| `pax.adults`           | Number   | Default: 1     | Number of adults                                            |
| `pax.children`         | Number   | Default: 0     | Number of children                                          |
| `hotelStar`            | Number   | Min: 1, Max: 5 | Hotel star preference                                       |
| `description`          | String   | Optional       | Free-text trip description (used for semantic search)       |
| `preferences`          | [String] | Optional       | E.g., "balcony", "pool"                                     |
| `contactInfo.name`     | String   | Required       | Traveler's name                                             |
| `contactInfo.email`    | String   | Required       | Traveler's email                                            |
| `contactInfo.phone`    | String   | Required       | Traveler's phone                                            |
| `contactInfo.whatsapp` | String   | Optional       | WhatsApp number                                             |
| `status`               | String   | Enum           | NEW → IN_PROGRESS → QUOTES_READY → SENT_TO_USER → COMPLETED |

#### `quotes`

| Field                 | Type     | Constraints                | Description                                                    |
| --------------------- | -------- | -------------------------- | -------------------------------------------------------------- |
| `requirementId`       | ObjectId | Ref: Requirement, Required | Linked requirement                                             |
| `partnerId`           | ObjectId | Ref: User, Required        | Source partner                                                 |
| `agentId`             | ObjectId | Ref: User, Required        | Creating agent                                                 |
| `title`               | String   | —                          | Auto-generated: "Destination Trip - TripType"                  |
| `sections.hotels`     | [Object] | —                          | Array of {name, city, roomType, nights, unitPrice, qty, total} |
| `sections.transport`  | [Object] | —                          | Array of {type, days, unitPrice, total}                        |
| `sections.activities` | [Object] | —                          | Array of {name, unitPrice, qty, total}                         |
| `costs.net`           | Number   | —                          | Sum of all section totals                                      |
| `costs.margin`        | Number   | —                          | Percentage (default 10%)                                       |
| `costs.final`         | Number   | —                          | net × (1 + margin/100)                                         |
| `costs.perHead`       | Number   | —                          | final ÷ adults                                                 |
| `shareToken`          | String   | Unique, Sparse             | UUID for public sharing                                        |
| `status`              | String   | Enum                       | DRAFT → READY → SENT_TO_USER → ACCEPTED / DECLINED             |
| `itinerary`           | [Object] | —                          | Array of ItineraryDay (AI-generated)                           |

#### `partnerprofiles`

| Field                   | Type     | Constraints                          | Description                     |
| ----------------------- | -------- | ------------------------------------ | ------------------------------- |
| `userId`                | ObjectId | Ref: User, Required, Unique          | Linked user account             |
| `companyName`           | String   | Required                             | Business name                   |
| `destinations`          | [String] | —                                    | Served destinations             |
| `type`                  | String   | Enum: DMC, Hotel, CabProvider, Mixed | Business type                   |
| `specializations`       | [String] | —                                    | E.g., "Honeymoon", "Luxury"     |
| `budgetRange.min/max`   | Number   | —                                    | Price range                     |
| `rating`                | Number   | Default: 4.5                         | Partner rating                  |
| `tripsHandled`          | Number   | Default: 0                           | Completed trips count           |
| `description`           | String   | —                                    | Free-text business description  |
| `description_embedding` | [Number] | —                                    | Gemini 768-dim vector embedding |
| `images`                | [String] | —                                    | Photo URLs                      |
| `amenities`             | [String] | —                                    | Hotel amenities                 |
| `sightSeeing`           | [String] | —                                    | Local attractions               |
| `startingPrice`         | Number   | —                                    | Base room rate per night        |
| `reviews`               | Number   | Default: 0                           | Review count                    |

#### `partnerhotels` / `partnertransports` / `partneractivities`

Separate inventory collections for granular partner offerings with `partnerId` foreign key.

### Relationships

```
User (1) ──── (1) PartnerProfile
User (1) ──── (N) PartnerHotel/Transport/Activity
Requirement (1) ──── (N) Quote
User [Agent] (1) ──── (N) Quote (as agentId)
User [Partner] (1) ──── (N) Quote (as partnerId)
```

---

## 8. Authentication & Security

### Authentication Mechanism [CONFIRMED]

- **JWT-based stateless authentication** with 30-day token expiry.
- Tokens are generated on registration and login, returned in the response body.
- Frontend stores the JWT and user info in `localStorage` as `userInfo`.
- All protected API calls include `Authorization: Bearer <token>` header.

### Middleware Stack [CONFIRMED]

1. **`protect()`** — Extracts Bearer token from the Authorization header, verifies it via `jwt.verify()`, fetches the user from MongoDB (excluding password), and attaches `req.user`.
2. **`authorize(...roles)`** — Checks `req.user.role` against a whitelist of allowed roles. Returns 403 if unauthorized.

### Role-Based Access Control [CONFIRMED]

| Role        | Capabilities                                                        |
| ----------- | ------------------------------------------------------------------- |
| **USER**    | Submit requirements, view own requirement, plan journey             |
| **AGENT**   | Full CRUD on requirements, quotes, partner filtering, itinerary gen |
| **PARTNER** | Manage own profile, add inventory items                             |
| **ADMIN**   | Same as Agent (shares route authorization)                          |

### Password Security [CONFIRMED]

- Passwords are hashed using `bcryptjs` with 10 salt rounds.
- The `userSchema.pre('save')` hook automatically hashes on create/update.
- `matchPassword()` instance method performs bcrypt comparison.

### Security Observations

> **WARNING**: The `.env` file containing live API keys and MongoDB credentials is tracked in git. This should be added to `.gitignore` immediately. The `backend/.gitignore` exists but the root `.gitignore` does not exclude `.env` files.

> **NOTE**: CORS is configured with `cors()` (no origin restrictions), allowing any domain. For production, this should be restricted to the frontend domain.

---

## 9. Environment Variables & Configuration

### Backend (`backend/.env`)

| Variable               | Purpose                              | Required                                 |
| ---------------------- | ------------------------------------ | ---------------------------------------- |
| `PORT`                 | Express server port                  | Yes (default: 5000)                      |
| `MONGO_URI`            | MongoDB Atlas connection string      | Yes                                      |
| `JWT_SECRET`           | Secret key for JWT signing           | Yes                                      |
| `GEMINI_API_KEY`       | Google Gemini API key for embeddings | Yes (degrades gracefully)                |
| `GROQ_API_KEY`         | Groq API key for Llama LLM           | Yes (throws if missing)                  |
| `WEB3FORMS_ACCESS_KEY` | Web3Forms key for email delivery     | Optional (falls back to console logging) |

### Frontend (`frontend/.env`)

| Variable              | Purpose                                              | Required                       |
| --------------------- | ---------------------------------------------------- | ------------------------------ |
| `VITE_API_URL`        | Backend API base URL (e.g., `http://localhost:5000`) | Yes                            |
| `VITE_PEXELS_API_KEY` | Pexels API key for itinerary/PDF images              | Optional (degrades gracefully) |

---

## 10. Setup & Installation

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB Atlas** account (or local MongoDB instance)
- API keys: Google Gemini, Groq, Pexels (optional), Web3Forms (optional)

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/shivampatel88/VoyageGen.git
cd VoyageGen

# 2. Install backend dependencies
cd backend
npm install

# 3. Create backend .env file
cp .env.example .env
# Edit .env with your actual credentials:
#   PORT=5000
#   MONGO_URI=your_mongodb_connection_string
#   JWT_SECRET=your_secret_key
#   GEMINI_API_KEY=your_gemini_key
#   GROQ_API_KEY=your_groq_key
#   WEB3FORMS_ACCESS_KEY=your_web3forms_key (optional)

# 4. Seed the database with partner data
npx tsx seeders/seedIndianPartners.ts
npx tsx seeders/seedPartners.ts

# 5. Start the backend server
npm run dev

# 6. In a new terminal, install frontend dependencies
cd ../frontend
npm install

# 7. Create frontend .env file
# Add:
#   VITE_API_URL=http://localhost:5000
#   VITE_PEXELS_API_KEY=your_pexels_key (optional)

# 8. Start the frontend
npm run dev
```

The backend runs on `http://localhost:5000` and the frontend on `http://localhost:5173`.

## 11. Error Handling & Logging

### Error Handling Strategy [CONFIRMED]

- **Centralized utility**: `handleError(res, error, message)` in `backend/utils/errorHandler.ts`
  - Logs the error context and original error to `console.error`
  - Returns a 500 JSON response with the error message
  - Extracts `error.message` for `Error` instances, falls back to "Unknown error occurred"
- **Controller-level try/catch**: Every controller function wraps its logic in try/catch and delegates to `handleError`
- **Input validation**: Manual validation at the controller level (e.g., required field checks in `registerUser`)
- **No global Express error middleware**: Each route handler manages its own error responses

### Logging Strategy [CONFIRMED]

- **Console-based logging only** — `console.log`, `console.error`, `console.warn`
- No structured logging framework (Winston, Pino, etc.) in the current codebase
- Key log points: MongoDB connection, email sending status, embedding generation warnings
- Graceful degradation logging: when `GEMINI_API_KEY` is missing, logs a warning and returns empty embeddings

---

## 12. Testing

**No tests found in codebase.**

- The `backend/package.json` test script echoes: `Error: no test specified`
- No test files (`*.test.ts`, `*.spec.ts`) exist in either frontend or backend
- No testing frameworks (Jest, Vitest, Cypress, Playwright) are installed
- The frontend `package.json` includes only a `lint` script for ESLint

---

## 13. Design Patterns & Architectural Decisions

### Patterns Identified

| Pattern                         | Where    | Evidence                                                                      |
| ------------------------------- | -------- | ----------------------------------------------------------------------------- |
| **MVC (Model-View-Controller)** | Backend  | Clear separation: `models/` → `controllers/` → `routes/`                      |
| **Repository-like Controller**  | Backend  | Controllers directly use Mongoose models (no separate repository layer)       |
| **Context Provider**            | Frontend | `AuthContext` wraps the entire app, providing auth state via React Context    |
| **Route Guard**                 | Frontend | `ProtectedRoute` component checks role before rendering children              |
| **Layout Composition**          | Frontend | `AgentLayout`/`PartnerLayout` with React Router `Outlet` for nested routing   |
| **Shared DTO Contract**         | Shared   | `shared/types.ts` is imported by both frontend and backend via relative paths |
| **Seeder Pattern**              | Backend  | Standalone scripts for database seeding with batch embedding generation       |
| **Utility Module**              | Both     | Small, focused utility files (emailUtils, vectorUtils, generatePDF)           |

### Notable Architectural Decisions

1. **Shared types via relative imports** rather than an npm workspace or monorepo tool — simple but requires careful path management. The `backend/tsconfig.json` sets `rootDir: "../"` specifically to include `../shared/`.

2. **Semantic search without a vector database** — Partner description embeddings are stored as plain `[Number]` arrays in MongoDB, and cosine similarity is computed in-memory in Node.js. This works for hundreds of partners but won't scale to thousands.

3. **Two LLM providers for different tasks** — Gemini for embeddings (deterministic, structural) and Groq/Llama for text generation (creative). This separates concerns and leverages each model's strength.

4. **PDF generation on the client side** — Using jsPDF in the browser avoids server load and allows immediate download, but makes the PDF generation logic frontend-bound.

### Notable Tech Debt

- `App.css` is the default Vite template CSS and is effectively unused
- Several `any` type assertions in the frontend (e.g., `PublicQuoteView`, `RequirementDetails`)
- `html2canvas` is installed as a dependency but not imported or used anywhere
- The `RequirementForm` component and `PlanJourney` page contain nearly identical form logic (code duplication)

---

## 14. Current Limitations

| Limitation                   | Location                                         | Description                                                                          |
| ---------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| No pagination                | `requirementController.ts`, `quoteController.ts` | All queries use `find({})` — will degrade with volume                                |
| In-memory vector search      | `partnerController.ts:filterPartners`            | Cosine similarity computed in Node.js, not in MongoDB Atlas Vector Search            |
| No input sanitization        | All controllers                                  | Raw `req.body` is passed to Mongoose; no schema validation middleware (Zod, Joi)     |
| Hardcoded transport pricing  | `quoteController.ts:62`                          | Transport cost is fixed at ₹3000/day regardless of partner                           |
| No file upload               | Partner profile/inventory                        | All images are external URLs; no upload mechanism                                    |
| No WebSocket/SSE             | —                                                | No real-time updates for quote status changes                                        |
| No rate limiting             | `server.ts`                                      | No throttling on public endpoints (`/api/requirements`, `/api/quotes/public/:token`) |
| JWT in localStorage          | `AuthContext.tsx`                                | Vulnerable to XSS; HttpOnly cookies would be more secure                             |
| No refresh token             | —                                                | Single 30-day JWT with no rotation mechanism                                         |
| Partner dashboard is minimal | `PartnerDashboard.tsx`                           | Only 358 bytes; renders a simple "Partner Portal" heading                            |
| Admin UI missing             | —                                                | Admin role exists in auth but no admin-specific pages or routes                      |
| No HTTPS enforcement         | —                                                | Development-only HTTP setup                                                          |
| `.env` committed to git      | Root `.gitignore`                                | Contains live API keys and database credentials                                      |

---

## 15. Future Scope

### Inferred from Code

| Feature                              | Evidence                                                                                  | Source                                                                     |
| ------------------------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Multi-step form wizard               | `RequirementForm.tsx:14` — `const [step, setStep] = useState(1)` commented as `// Unused` | Component was designed for a multi-step flow but simplified to single-page |
| WhatsApp contact integration         | `Requirement` schema has `contactInfo.whatsapp` field                                     | `Requirement.ts:36`, `shared/types.ts:39`                                  |
| Partner descriptions as search index | `description_embedding` field with batch embedding on seed                                | `PartnerProfile.ts:48-51`, `seedPartners.ts:24`                            |
| Image gallery for partners           | `images: [String]` in PartnerProfile schema                                               | `PartnerProfile.ts:40`                                                     |
| Rating and review system             | `rating` and `reviews` fields exist on PartnerProfile                                     | `PartnerProfile.ts:31-47`                                                  |
| Preference-based filtering           | `preferences: [String]` in Requirement schema                                             | `Requirement.ts:31` — currently collected but not used in partner matching |

### Suggested — Not in Code

| Suggestion                                  | Rationale                                                                                |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **MongoDB Atlas Vector Search**             | Replace in-memory cosine similarity with native `$vectorSearch` for scalability          |
| **Pagination + infinite scroll**            | Add `skip`/`limit` to all list endpoints to handle growing data                          |
| **Input validation middleware** (Zod/Joi)   | Enforce request schemas before reaching controllers                                      |
| **Automated test suite**                    | Add Vitest for unit tests, Playwright for E2E flows                                      |
| **Admin dashboard**                         | Build analytics, user management, and system monitoring for the ADMIN role               |
| **Real-time notifications** (WebSocket/SSE) | Notify agents when new requirements arrive; notify travelers on quote status change      |
| **HttpOnly cookie auth**                    | Move JWT from localStorage to HttpOnly cookies to prevent XSS                            |
| **CI/CD pipeline**                          | GitHub Actions for linting, testing, building, and deploying                             |
| **Docker containerization**                 | Dockerfiles for frontend and backend with docker-compose for local development           |
| **Multi-currency support**                  | Currently hardcoded to INR; add currency conversion for international quotes             |
| **Quote comparison view for travelers**     | Allow travelers to view and compare multiple quotes side-by-side                         |
| **Itinerary collaborative editing**         | Real-time collaborative editing between agent and traveler                               |
| **Analytics dashboard**                     | Track conversion rates (quotes sent → accepted), popular destinations, agent performance |

---

## License

Not specified in the repository.

---

<p align="center">
  <em>Generated from comprehensive analysis of every source file in the VoyageGen codebase.</em><br/>
  <em>All features and observations are directly confirmed from code unless marked [INFERRED] or [SUGGESTED].</em>
</p>
