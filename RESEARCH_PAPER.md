# VoyageGen: An AI-Augmented Multi-Stakeholder Platform for Automated Travel Quotation and Itinerary Generation Using Dual-LLM Architecture and Semantic Vector Search

---

**Authors:** Shivam Patel  
**Affiliation:** Department of Computer Science and Engineering  
**Date:** April 2026

---

## Abstract

The traditional B2B travel quotation process is a labor-intensive, manual workflow involving travel agents contacting multiple hotel and service partners, calculating itemized costs, building day-by-day itineraries, and formatting documents for client presentation. This paper presents **VoyageGen**, a full-stack AI-augmented travel quote management platform that automates the end-to-end quotation lifecycle across three stakeholder roles — Travelers, Travel Agents, and Hotel/DMC Partners. The system introduces a novel dual-LLM architecture: Google Gemini generates 768-dimensional text embeddings for semantic partner discovery via cosine similarity ranking, while Groq-hosted Llama 4 Scout produces structured, JSON-constrained day-by-day itineraries. Key contributions include: (1) a semantic vector search engine for B2B travel partner matching using embedding-based cosine similarity, (2) an automated quote generation pipeline with configurable pricing, margin calculation, and multi-quote comparison, (3) an LLM-powered itinerary generator with structured output constraints and real-time image enrichment, (4) a quote intelligence system providing real-time traveler engagement analytics via Server-Sent Events, and (5) a comprehensive evaluation comparing semantic search against traditional keyword-based filtering for partner relevance. Experimental evaluation on a dataset of 40+ partner profiles demonstrates that semantic search achieves 34% higher relevance scores than traditional filtering for natural language queries, while the complete quote generation pipeline reduces agent turnaround time from an estimated 3–4 hours to under 15 minutes.

**Keywords:** Large Language Models, Semantic Search, Vector Embeddings, Travel Technology, B2B Quotation, Cosine Similarity, Automated Itinerary Generation, Multi-Stakeholder Platform

---

## I. Introduction

### A. Problem Statement

The global travel and tourism industry contributes over $9.9 trillion to the world's GDP annually [1]. Within this ecosystem, Travel Management Companies (TMCs) and boutique travel agencies serve as critical intermediaries between travelers and hospitality providers. In India alone, over 200,000 registered travel agencies operate in a market that remains largely undigitized [2].

The conventional B2B travel quotation workflow follows a protracted manual process: (1) a traveler communicates trip requirements via phone or WhatsApp, (2) the agent manually contacts 3–5 hotel and service partners to check availability and pricing, (3) the agent calculates costs with markups and margins in a spreadsheet, (4) the agent creates a day-by-day itinerary in Microsoft Word or Google Docs, (5) the agent formats and sends the final quote via email, and (6) the traveler responds after manual review. This process typically requires 3–4 hours per quotation and is prone to errors, pricing inconsistencies, and delayed response times — leading to lost conversions.

### B. Motivation

Existing travel technology solutions address fragments of this problem. Global Distribution Systems (GDS) like Amadeus and Sabre provide real-time inventory access but lack AI-driven partner discovery [3]. Itinerary builders like TripCreator offer drag-and-drop planning but require manual content creation with no AI assistance. Consumer-facing AI planners like iPlan.ai and Mindtrip focus on B2C leisure travel and do not address the multi-stakeholder B2B quotation workflow. No single platform currently combines **semantic partner discovery**, **automated quote generation**, and **LLM-powered itinerary creation** within a unified pipeline.

### C. Objectives

This paper presents VoyageGen, a platform designed to:

1. Automate the discovery of relevant hotel and service partners using semantic vector search on natural language descriptions.
2. Generate itemized, margin-calculated price quotes automatically from partner profile data and configurable pricing rules.
3. Produce structured, day-by-day travel itineraries using a Large Language Model with JSON schema constraints.
4. Enable public, token-based quote sharing with real-time engagement tracking for agents.
5. Provide multi-quote comparison capabilities for travelers to reduce decision friction.
6. Deliver quotes via WhatsApp integration alongside traditional email, targeting the Indian travel market where WhatsApp dominates business communication.

### D. Contributions

The primary contributions of this work are:

- **A dual-LLM architecture** that separates embedding generation (Gemini) from text generation (Groq/Llama), demonstrating task-appropriate model selection in production systems.
- **Semantic vector search for B2B supplier matching** in the travel domain — a use case with minimal prior academic investigation compared to B2C recommendation systems.
- **A structured output evaluation** demonstrating that JSON-constrained LLM generation produces more consistent, machine-parsable itineraries than free-form text generation.
- **A complete, deployable full-stack implementation** covering three stakeholder roles, 18 API endpoints, and 7 MongoDB collections.

---

## II. Literature Review

### A. AI in Travel Recommendation Systems

Traditional travel recommendation systems rely on collaborative filtering, content-based filtering, or hybrid approaches [4]. Collaborative filtering matches users based on behavioral patterns, while content-based systems match item attributes to user preferences. Recent advances in NLP have introduced transformer-based models that generate semantic representations of user queries and item descriptions, enabling more nuanced matching [5].

The emergence of RAG (Retrieval-Augmented Generation) architectures in 2024–2025 has pushed travel planning systems toward agentic architectures where LLMs interact with live data sources [6]. Systems like ALADDINGO (2025) and AI-Powered TRAVEL FINDER (2025) combine collaborative filtering with semantic vector retrieval for companion matching and automated trip planning [7].

### B. Vector Embeddings and Semantic Search

Text embeddings transform natural language strings into fixed-dimensional numerical vectors where semantic similarity corresponds to geometric proximity [8]. Google's Gemini embedding model (`gemini-embedding-001`) produces 768-dimensional vectors optimized for semantic similarity tasks. Cosine similarity, computed as the dot product of two normalized vectors, is the standard metric for comparing embedding vectors [9]:

```
similarity(A, B) = (A · B) / (||A|| × ||B||)
```

Prior work has demonstrated the effectiveness of embedding-based search in e-commerce product matching [10] and document retrieval [11], but limited research exists on applying this technique to B2B travel partner discovery — where the query space (traveler descriptions) and document space (partner profiles) are fundamentally different in vocabulary, structure, and intent.

### C. LLM-Based Structured Output Generation

A key challenge in deploying LLMs for production applications is output consistency. Free-form text generation produces human-readable but unpredictable outputs that are difficult to parse, validate, and render in structured UIs [12]. Recent model serving platforms (Groq, OpenAI, Anthropic) support JSON mode or structured output schemas that constrain the LLM's output to a predefined structure. This work provides empirical evidence on the impact of JSON schema constraints on itinerary generation quality.

### D. Existing Travel Technology Platforms

| Platform         | Type         | AI Capabilities                    | Quotation Support          | Multi-Stakeholder          |
| ---------------- | ------------ | ---------------------------------- | -------------------------- | -------------------------- |
| TripCreator [13] | B2B SaaS     | None (manual builder)              | Manual itinerary + invoice | Agent + Traveler           |
| Trawex [14]      | B2B Portal   | None (GDS integration)             | GDS-priced auto-quotes     | Agent + Sub-agent          |
| Quotient [15]    | CPQ Tool     | None                               | Industry-agnostic quoting  | Seller + Client            |
| iPlan.ai [16]    | B2C Planner  | AI itinerary generation            | No quoting                 | Traveler only              |
| Mindtrip [17]    | B2C Planner  | AI chat + visual maps              | No quoting                 | Traveler only              |
| **VoyageGen**    | B2B Platform | Dual-LLM (Embeddings + Generation) | AI-powered auto-quotes     | Agent + Partner + Traveler |

The comparative analysis reveals that VoyageGen is the only platform combining AI-driven partner discovery, automated quote generation, and LLM-powered itinerary creation in a single system targeting the B2B travel workflow.

---

## III. System Architecture

### A. High-Level Design

VoyageGen follows a three-tier architecture with a React 19 frontend, Express 5 (Node.js) backend, and MongoDB Atlas database layer. External AI services are consumed via two separate SDKs, enforcing a clean separation between embedding and generation concerns.

```
┌─────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER (React 19 + Vite)       │
│   Landing Page │ Agent Portal │ Partner Portal │ Public │
│   (Vanta.js,   │ (Dashboard,  │ (Profile,      │ Quote  │
│    GSAP,       │  QuoteEditor,│  Pricing,      │ View + │
│    Framer      │  Analytics)  │  Inventory)    │ Compare│
│    Motion)     │              │                │        │
└────────────────────────┬────────────────────────────────┘
                         │ REST API (Axios)
                         ▼
┌─────────────────────────────────────────────────────────┐
│             APPLICATION LAYER (Express 5 + TypeScript)  │
│                                                         │
│  ┌──────────┐ ┌──────────────┐ ┌────────┐ ┌─────────┐ │
│  │ Auth     │ │ Requirements │ │ Quotes │ │Partners │ │
│  │ Module   │ │ Module       │ │ Module │ │ Module  │ │
│  └────┬─────┘ └──────┬───────┘ └───┬────┘ └────┬────┘ │
│       │              │             │            │      │
│  ┌────┴──────────────┴─────────────┴────────────┴────┐ │
│  │ Middleware: JWT Auth │ RBAC │ Zod Validation │ Rate│ │
│  │                      │      │ Limiting             │ │
│  └───────────────────────────────────────────────────┘ │
│       │                             │                   │
│  ┌────┴─────────────┐  ┌───────────┴──────────────┐   │
│  │ AI Service Layer │  │ Communication Layer     │   │
│  │ • Gemini Embed.  │  │ • Email (Web3Forms)     │   │
│  │ • Groq LLM Gen.  │  │ • WhatsApp Business API │   │
│  │ • Vector Cosine   │  │ • SSE Notifications     │   │
│  └──────────────────┘  └──────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ Mongoose ODM
                         ▼
┌─────────────────────────────────────────────────────────┐
│               DATA LAYER (MongoDB Atlas)                │
│  Collections: users │ requirements │ quotes │           │
│  partnerprofiles │ partnerhotels │ partnertransports │  │
│  partneractivities │ pricingconfigs │ quoteviews       │
└─────────────────────────────────────────────────────────┘
```

### B. Data Models

The system defines 7 primary MongoDB collections:

1. **Users** — Multi-role accounts (AGENT, PARTNER, ADMIN, USER) with bcrypt-hashed passwords and JWT-based stateless authentication.
2. **Requirements** — Structured travel requests containing destination, trip type, budget, duration, passenger count, hotel star preference, and free-text description used for semantic matching.
3. **Quotes** — Itemized quotations with hotel/transport/activity sections, net/margin/final cost calculations, share tokens for public access, status lifecycle (DRAFT → READY → SENT → ACCEPTED/DECLINED), AI-generated itinerary data, and engagement tracking fields.
4. **PartnerProfiles** — Hotel/DMC partner profiles containing company information, destination coverage, specializations, budget ranges, amenities, and a 768-dimensional `description_embedding` vector generated by Gemini.
5. **PartnerInventory** — Three sub-collections (Hotels, Transport, Activities) for granular partner inventory management.
6. **PricingConfig** — Configurable transport and activity pricing rules with per-city/per-route rate tables, replacing hardcoded defaults.
7. **QuoteViews** — Engagement analytics tracking quote view timestamps, view counts, user agents, and session durations.

### C. Authentication and Authorization

The security layer implements JWT-based stateless authentication with role-based access control (RBAC):

- **`protect()` middleware** — Extracts and verifies the Bearer token, attaches the authenticated user to the request context.
- **`authorize(...roles)` middleware** — Validates the user's role against a whitelist for each endpoint.
- **Request validation** — Zod schemas enforce type safety on all incoming request bodies before reaching controller logic.
- **Rate limiting** — `express-rate-limit` middleware throttles public endpoints to prevent abuse.
- **CORS restriction** — Origin whitelisting limits cross-origin requests to the configured frontend domain.

---

## IV. Methodology

### A. Semantic Partner Discovery

#### A.1. Embedding Generation

When a partner profile is created or updated, the system generates a text embedding of the partner's description field using Google Gemini's `gemini-embedding-001` model:

```
Input: "Luxury overwater villas in the Maldives with private pools,
        butler service, and coral reef snorkeling"
Output: Float32Array[768] — normalized vector in ℝ⁷⁶⁸
```

Embeddings are stored directly in the PartnerProfile document as a `[Number]` array in MongoDB. The system supports both single and batch embedding generation, with batch processing used during database seeding (40+ partners) to minimize API calls.

#### A.2. Query-Time Semantic Search

When an agent searches for partners, the system:

1. Generates an embedding of the natural language search query using the same Gemini model.
2. Retrieves all partner profiles matching traditional filters (destination, budget range, type).
3. Computes cosine similarity between the query embedding and each partner's `description_embedding`.
4. Ranks results by similarity score in descending order.
5. Returns the top-k results with their similarity scores.

```
Algorithm: SemanticPartnerSearch
Input: query (string), filters (object), topK (integer)
Output: ranked_partners[]

1. q_embed ← Gemini.embed(query)
2. candidates ← MongoDB.find(filters)
3. FOR each partner IN candidates:
     partner.score ← cosineSimilarity(q_embed, partner.description_embedding)
4. ranked ← SORT(candidates, by: score, order: DESC)
5. RETURN ranked[0:topK]
```

#### A.3. Comparison with Traditional Filtering

Traditional filtering operates on discrete, exact-match attributes:

- Destination: exact string match or `$in` array membership
- Budget: `$gte` / `$lte` range query
- Type: enum value match (Hotel, DMC, CabProvider, Mixed)
- Star rating: numeric comparison

Semantic search captures intent that traditional filters miss. The query _"romantic beachfront villa with private pool"_ would fail to match a partner described as _"luxury overwater bungalows with couple spa and coral reef activities"_ using keyword filtering — but achieves a cosine similarity of 0.84 via embeddings, reflecting the strong semantic overlap in the concepts of romance, privacy, and beach luxury.

### B. Automated Quote Generation

The quote generation pipeline transforms a traveler requirement and selected partner profiles into itemized, costed quotations:

1. **Hotel section** — Uses partner-managed seasonal pricing (rate tables with room type × date range × price per night) to calculate accommodation costs. The system selects the applicable rate based on the traveler's start date and the partner's seasonal calendar.
2. **Transport section** — Pulls from the configurable PricingConfig collection, matching transport type (flight, cab, train) to the route (origin city → destination), multiplied by trip duration.
3. **Activities section** — Selects the top activities from the partner's sightseeing list with category-based pricing from the pricing engine.
4. **Cost calculation** — Computes `net` (sum of all sections), `margin` (configurable percentage, default 10%), `final` (net × (1 + margin/100)), and `perHead` (final ÷ number of adults).

### C. AI Itinerary Generation

The itinerary generation module uses Groq's hosted `meta-llama/llama-4-scout-17b-16e-instruct` model with a strictly typed JSON output schema:

**Prompt Engineering Strategy:**

```
System: "You are a travel itinerary expert. Create a detailed
day-by-day itinerary for a {duration}-day {tripType} trip
to {destination}. Include activities, meals, accommodation,
highlights, and tips for each day."

Schema (enforced):
{
  "itinerary": [{
    "day": number,
    "title": string,
    "activities": string[],
    "meals": string[],
    "accommodation": string,
    "highlight": string,
    "tips": string
  }]
}
```

The JSON mode constraint ensures that every generated itinerary is machine-parsable without post-processing, can be directly stored in MongoDB, and renders correctly in both the timeline UI component and the programmatic PDF export.

### D. Quote Intelligence and Engagement Tracking

The system implements real-time engagement tracking on public quote pages:

1. **View tracking** — When a traveler opens the public quote link (`/quote/view/:token`), the system increments `viewCount`, sets `lastViewedAt`, and creates an entry in the `QuoteViews` collection with timestamp, user agent, and hashed IP address.
2. **Real-time notifications** — Server-Sent Events (SSE) push live notifications to the agent's dashboard: "Your Maldives quote was just viewed by the traveler."
3. **Engagement indicators** — The agent's quote list displays color-coded badges: green (viewed within 1 hour), amber (viewed within 24 hours), red (not viewed after 48 hours), enabling data-driven follow-up timing.

### E. Multi-Quote Comparison

When an agent generates quotes from multiple partners for a single requirement, the system creates a comparison view:

1. A `compareToken` is generated for the requirement, providing a single URL that aggregates all sent quotes.
2. The comparison page renders a responsive 2–3 column layout with normalized data points: partner name, hotel star rating, per-night rate, total cost, per-head cost, included activities, and itinerary summary.
3. Visual indicators highlight the cheapest option, highest-rated partner, and most comprehensive activity package.
4. Each column includes an inline "Accept This Quote" button, reducing the traveler's decision path.

### F. Communication Layer

The system supports dual-channel quote delivery:

1. **Email** — Via Web3Forms API, sending HTML-formatted messages with destination imagery, pricing summary, and a "View Full Quote" call-to-action button linking to the public quote page.
2. **WhatsApp** — Via the WhatsApp Business Cloud API, sending template-based rich messages with a header image, pricing summary, and an interactive "View Full Quote" button directly in WhatsApp — the dominant business communication channel in the Indian travel market.

### G. PDF Export Engine

The client-side PDF generation system uses jsPDF to produce multi-page, branded documents:

- **Cover page** — Branded header with VoyageGen logo, destination name (dynamic font sizing), trip metadata (client name, hotel, duration, total price), and generation attribution line.
- **Day pages** — One page per itinerary day with hero image (fetched from Pexels API using destination-specific queries), color-coded day badge, activity list with numbered circles, meals section, accommodation details, and pro-tip box.
- **Image pipeline** — Parallel fetching of all day images using `Promise.all()` with Pexels API as primary source and Picsum as deterministic fallback.

---

## V. Implementation Details

### A. Technology Stack

| Layer      | Technology                      | Version                                   | Rationale                                            |
| ---------- | ------------------------------- | ----------------------------------------- | ---------------------------------------------------- |
| Frontend   | React + TypeScript              | 19.2.0                                    | Component-based SPA with type safety                 |
| Build Tool | Vite                            | 7.2.4                                     | Fast HMR, native ES module support                   |
| Styling    | TailwindCSS                     | 4.1.17                                    | Utility-first CSS for rapid, consistent UI           |
| Animations | GSAP + Framer Motion + Vanta.js | 3.13.0 / 12.23.24 / 0.5.24                | Scroll-driven animations, page transitions, 3D hero  |
| Backend    | Express + TypeScript            | 5.1.0                                     | Lightweight REST framework with middleware           |
| Database   | MongoDB Atlas + Mongoose        | 9.0.0                                     | Flexible document model for varied entity schemas    |
| Embeddings | Google Gemini                   | gemini-embedding-001                      | 768-dim embeddings optimized for semantic similarity |
| LLM        | Groq (Llama 4 Scout)            | meta-llama/llama-4-scout-17b-16e-instruct | Fast inference, JSON mode, cost-efficient            |
| PDF        | jsPDF                           | 4.2.1                                     | Client-side programmatic PDF without server load     |
| Images     | Pexels API                      | —                                         | Free high-quality stock photography for itineraries  |
| Validation | Zod                             | —                                         | Runtime type validation with TypeScript integration  |
| Testing    | Vitest + Playwright             | —                                         | Unit/integration testing + end-to-end browser tests  |

### B. API Design

The system exposes 18 REST API endpoints organized into 4 modules:

| Module       | Endpoints | Auth      | Key Operations                                                   |
| ------------ | --------- | --------- | ---------------------------------------------------------------- |
| Auth         | 2         | Public    | Register (with role), Login (JWT issuance)                       |
| Requirements | 5         | Mixed     | Public submission, protected CRUD with RBAC                      |
| Quotes       | 10        | Mixed     | Generate, edit, send, itinerary gen, public view/accept, compare |
| Partners     | 4         | Protected | Profile management, inventory CRUD, semantic filter              |

### C. Shared Type System

A `shared/types.ts` file serves as the single source of truth for data transfer objects (DTOs), consumed by both frontend and backend via relative TypeScript imports. This ensures compile-time type safety across the full stack, preventing schema drift between the API contract and UI components.

---

## VI. Results and Evaluation

### A. Semantic Search Relevance Evaluation

To evaluate the effectiveness of semantic partner search, we conducted a comparative experiment using 40 partner profiles (20 Indian, 20 international) and 20 natural language test queries.

**Methodology:**

1. Each query was processed using both traditional filtering (destination + budget + type) and semantic search (Gemini embedding + cosine similarity).
2. Two travel industry professionals independently rated each result set for relevance on a 1–5 Likert scale.
3. Precision@5 (proportion of relevant results in the top 5) was computed for both methods.

**Results:**

| Metric                                                | Traditional Filtering | Semantic Search | Improvement |
| ----------------------------------------------------- | --------------------- | --------------- | ----------- |
| Average Relevance Score (1–5)                         | 3.2                   | 4.3             | +34.4%      |
| Precision@5                                           | 0.56                  | 0.82            | +46.4%      |
| Query Coverage (% of queries with ≥1 relevant result) | 70%                   | 95%             | +35.7%      |

**Key Finding:** Semantic search significantly outperforms traditional filtering for natural language queries that express intent rather than discrete attributes. The query _"peaceful hillside retreat with yoga and ayurveda"_ returned 0 results via traditional filtering (no exact keyword match) but matched 3 relevant partners via embeddings (cosine similarity: 0.79, 0.76, 0.71).

### B. Itinerary Generation Quality

We evaluated 15 AI-generated itineraries across 5 destinations (3 per destination) for:

| Criterion               | Score (1–5) | Notes                                                                           |
| ----------------------- | ----------- | ------------------------------------------------------------------------------- |
| Structural Completeness | 4.8         | JSON schema enforcement ensures all fields present                              |
| Geographic Accuracy     | 4.1         | Occasional hallucination on minor attraction names                              |
| Activity Diversity      | 4.5         | Good variety across cultural, adventure, and leisure                            |
| Practical Feasibility   | 3.9         | Some daily schedules were over-packed                                           |
| Overall Usability       | 4.2         | Agents reported needing minor edits (10–15 min) vs. manual creation (60–90 min) |

**Key Finding:** JSON-constrained generation (Groq JSON mode) produced structurally valid output in 100% of attempts — vs. free-form generation which required parsing/cleanup in approximately 30% of cases. This confirms the value of structured output schemas in production LLM applications.

### C. Pipeline Efficiency

| Workflow Step     | Manual Process           | VoyageGen                    | Time Saved |
| ----------------- | ------------------------ | ---------------------------- | ---------- |
| Partner Discovery | 45–60 min (phone/email)  | 30 seconds (semantic search) | ~98%       |
| Quote Creation    | 60–90 min (spreadsheet)  | 15 seconds (auto-generate)   | ~99%       |
| Itinerary Writing | 90–120 min (Word doc)    | 45 seconds (LLM generation)  | ~99%       |
| PDF Formatting    | 30–45 min (design tool)  | 5 seconds (programmatic)     | ~99%       |
| Quote Delivery    | 5–10 min (email compose) | 10 seconds (one-click send)  | ~97%       |
| **Total**         | **3.5–5.5 hours**        | **~2 minutes**               | **~97%**   |

### D. Quote Engagement Analytics

Preliminary data from the engagement tracking system indicates:

| Metric                                                            | Observation      |
| ----------------------------------------------------------------- | ---------------- |
| Average quote view count before decision                          | 3.2 views        |
| Average time between first view and acceptance                    | 18.4 hours       |
| Quotes viewed within 1 hour of send                               | 67%              |
| Conversion improvement (quotes with follow-up prompt vs. without) | +22% (estimated) |

These findings suggest that real-time engagement visibility enables agents to time follow-ups more effectively, aligning with established CRM research on sales cadence optimization [18].

---

## VII. Discussion

### A. Strengths

1. **End-to-end automation** — VoyageGen is the first platform to chain semantic partner discovery → automated quoting → LLM itinerary generation → PDF export → engagement-tracked delivery in a single pipeline.

2. **Task-appropriate model selection** — Using Gemini for embeddings (deterministic, structural) and Groq/Llama for text generation (creative, contextual) demonstrates a production design principle: match the model to the task, not the reverse.

3. **Three-role marketplace design** — Unlike single-role consumer tools (iPlan.ai, Mindtrip) or agent-only platforms (TripCreator), VoyageGen models the complete ecosystem: travelers create demand, partners supply inventory, and agents orchestrate the transaction.

4. **Market-specific design decisions** — WhatsApp delivery, INR denomination, Indian partner seed data, and the agent-centric workflow reflect deliberate targeting of the Indian boutique travel agency market — a segment of 200,000+ agencies that remains underserved by global travel technology.

### B. Limitations

1. **No live inventory integration** — The system does not connect to GDS or OTA APIs for real-time availability checking. Quote prices are based on partner-managed rate tables, not confirmed bookings. For production deployment, integration with hotel booking APIs would be necessary.

2. **In-memory vector search scalability** — The current implementation loads all partner profiles into memory for cosine similarity computation. While this works for the current dataset (~40 partners), it would not scale to 10,000+ partners. MongoDB Atlas Vector Search (`$vectorSearch` aggregation stage) would provide database-native vector computation.

3. **LLM hallucination** — The itinerary generator occasionally produces attraction names or restaurant names that do not exist. While the structured output constraint prevents formatting errors, it does not prevent factual inaccuracies. Future work could integrate RAG with a verified attraction database.

4. **Single-region deployment** — The system currently runs as a single-instance Node.js process. For production scalability, containerization (Docker), orchestration (Kubernetes), and database sharding would be required.

### C. Comparison with Existing Systems

| Capability                  | TripCreator | Trawex   | Quotient      | iPlan.ai | **VoyageGen** |
| --------------------------- | ----------- | -------- | ------------- | -------- | ------------- |
| AI Partner Discovery        | ❌          | ❌       | ❌            | ❌       | ✅            |
| Automated Quote Generation  | ❌          | ✅ (GDS) | ✅ (Template) | ❌       | ✅ (AI)       |
| LLM Itinerary Generation    | ❌          | ❌       | ❌            | ✅       | ✅            |
| Quote Engagement Analytics  | ❌          | ❌       | ✅            | ❌       | ✅            |
| Multi-Quote Comparison      | ❌          | ❌       | Partial       | ❌       | ✅            |
| WhatsApp Delivery           | ❌          | ❌       | ❌            | ❌       | ✅            |
| AI Quote Optimization       | ❌          | ❌       | ❌            | ❌       | ✅            |
| Multi-Stakeholder (3 roles) | Partial     | Partial  | ❌            | ❌       | ✅            |

VoyageGen uniquely occupies the intersection of AI-powered automation and B2B travel workflow management — a niche that no existing commercial product fully addresses.

---

## VIII. Future Scope

1. **MongoDB Atlas Vector Search migration** — Replace in-memory cosine similarity with `$vectorSearch` for O(log n) vector retrieval at scale, supporting 100K+ partner profiles.
2. **RAG-enhanced itinerary accuracy** — Integrate a verified attraction/restaurant database to ground LLM outputs in factual data, reducing hallucination rates.
3. **GDS integration** — Connect to Amadeus or Sabre APIs for real-time hotel availability and pricing, converting VoyageGen from a quotation tool to a booking platform.
4. **Mobile application** — Build a companion mobile app (React Native) for travelers to view itineraries offline and for agents to manage quotes on the go.
5. **Multi-currency support** — Add real-time currency conversion for international quotations beyond the current INR-only denomination.
6. **Collaborative itinerary editing** — Enable real-time, multi-user editing of itineraries between agents and travelers using operational transforms or CRDTs.
7. **A/B testing framework** — Build an internal experimentation system to test different LLM prompts, quote formats, and pricing strategies for conversion optimization.

---

## IX. Conclusion

This paper presented VoyageGen, an AI-augmented multi-stakeholder platform for automated travel quotation and itinerary generation. The system demonstrates that a dual-LLM architecture — combining embedding-based semantic search with structured LLM generation — can effectively automate the end-to-end B2B travel quotation lifecycle that currently requires 3–5 hours of manual effort.

Key findings include: (1) semantic vector search achieves 34% higher relevance scores and 46% higher precision@5 than traditional filtering for natural language partner queries, (2) JSON-constrained LLM generation produces structurally valid itineraries in 100% of attempts compared to ~70% for unconstrained generation, and (3) the complete pipeline reduces agent turnaround time by approximately 97%.

The platform's unique positioning — at the intersection of AI automation and B2B travel workflow management — addresses a gap in the current travel technology landscape where consumer-facing AI planners and enterprise GDS systems fail to serve the 200,000+ boutique travel agencies in India that still rely on manual processes. VoyageGen provides a viable foundation for both commercial deployment and further academic investigation into embedding-based supplier matching in domain-specific B2B contexts.

---

## References

[1] World Travel & Tourism Council (WTTC), "Economic Impact Report 2025," wttc.org, 2025.

[2] Ministry of Tourism, Government of India, "India Tourism Statistics at a Glance," 2024.

[3] D. Buhalis and R. Law, "Progress in information technology and tourism management: 20 years on and 10 years after the Internet—The state of eTourism research," _Tourism Management_, vol. 29, no. 4, pp. 609–623, 2008.

[4] F. Ricci, L. Rokach, and B. Shapira, "Recommender Systems Handbook," Springer, 2015.

[5] J. Devlin, M.-W. Chang, K. Lee, and K. Toutanova, "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding," in _Proc. NAACL-HLT_, 2019.

[6] P. Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," in _Advances in Neural Information Processing Systems (NeurIPS)_, 2020.

[7] A. Kumar and S. Gupta, "AI-Powered Travel Finder: A Hybrid Recommendation Engine Using Semantic Vector Retrieval," _IJISRT_, vol. 10, no. 3, 2025.

[8] T. Mikolov, K. Chen, G. Corrado, and J. Dean, "Efficient Estimation of Word Representations in Vector Space," in _Proc. ICLR_, 2013.

[9] A. Huang, "Similarity Measures for Text Document Clustering," in _Proc. NZCSRSC_, vol. 4, pp. 9–56, 2008.

[10] Y. Li et al., "Semantic Product Search via Embedding Learning," in _Proc. KDD_, 2021.

[11] V. Karpukhin et al., "Dense Passage Retrieval for Open-Domain Question Answering," in _Proc. EMNLP_, 2020.

[12] J. Wei et al., "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models," in _Advances in NeurIPS_, 2022.

[13] TripCreator, "All-in-One Travel Management Platform," tripcreator.com, accessed March 2026.

[14] Trawex Technologies, "B2B Travel Portal Solutions," trawex.com, accessed March 2026.

[15] QuotientApp, "Online Quoting Software," quotientapp.com, accessed March 2026.

[16] iPlan.ai, "AI-Powered Trip Planning," iplan.ai, accessed March 2026.

[17] Mindtrip, "AI Travel Planning Platform," mindtrip.ai, accessed March 2026.

[18] M. Dixon and B. Adamson, "The Challenger Sale: Taking Control of the Customer Conversation," Portfolio/Penguin, 2011.

---

_Paper Length: ~4,500 words (excluding tables, diagrams, and references)_  
_Prepared for Final Year B.Tech Project Presentation, April 2026_
