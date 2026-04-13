# 🏨 Hotel Haven — Frontend

> A modern, production-ready hotel listing and management application built with React, Vite, TailwindCSS, and Redux Toolkit.

**Live Demo:** [https://hotelhaven-client-bzzq.vercel.app](https://hotelhaven-client-bzzq.vercel.app)  
**Backend API:** [https://hotelhaven-api.vercel.app](https://hotelhaven-api.vercel.app)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Deployment](#deployment)

---

## Overview

Hotel Haven is a full-stack CRUD application that allows users to browse, search, add, edit, and delete hotel listings. The frontend is a single-page application (SPA) that communicates with a Node.js/Express REST API backed by PostgreSQL.

Key design goals:
- Smooth user experience with animated transitions (Framer Motion)
- Interactive map display per hotel (Leaflet + OpenStreetMap)
- Cloudinary-powered image uploads directly from the browser
- Debounced real-time search and server-side pagination

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | TailwindCSS 3 |
| State Management | Redux Toolkit + React-Redux |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Animations | Framer Motion |
| Maps | React Leaflet + Leaflet.js (OpenStreetMap) |
| Image Upload | Cloudinary (browser-side unsigned upload) |
| Notifications | React Toastify |
| SEO | React Helmet Async |
---

## Features

- **Browse Hotels** — Responsive card grid with skeleton loading states
- **Real-Time Search** — Debounced search by hotel name (400ms delay)
- **Price Filtering** — Filter hotels by minimum and maximum price per night
- **Server-Side Pagination** — 9 hotels per page; smooth scroll to top on page change
- **Add Hotel** — Form with client-side validation, drag-and-drop image upload
- **Edit Hotel** — Pre-populated form; image can be replaced or kept
- **Delete Hotel** — Confirmation modal before deletion; Cloudinary image cleanup on server
- **Hotel Detail Page** — Full description, price, and interactive Leaflet map
- **Animated Page Transitions** — Route-level enter/exit animations via Framer Motion
- **404 Page** — Custom not-found route

---

## Project Structure

```
hotelhaven-client/
├── public/
├── src/
│   ├── api/
│   │   └── hotelApi.js          # Axios instance + all API calls
│   ├── components/
│   │   ├── ConfirmModal.jsx     # Delete confirmation dialog
│   │   ├── Footer.jsx
│   │   ├── HotelCard.jsx        # Card displayed in the grid
│   │   ├── HotelForm.jsx        # Reusable create/edit form with image upload
│   │   ├── MapView.jsx          # Leaflet map component
│   │   ├── Navbar.jsx
│   │   ├── Pagination.jsx       # Page controls
│   │   ├── SearchFilter.jsx     # Sidebar search + price filter
│   │   └── SkeletonCard.jsx     # Loading placeholder
│   ├── pages/
│   │   ├── AddHotel.jsx         # /add route
│   │   ├── EditHotel.jsx        # /edit/:id route
│   │   ├── HotelDetail.jsx      # /hotel/:id route
│   │   ├── HotelList.jsx        # / (home) route
│   │   └── NotFound.jsx         # * route
│   ├── store/
│   │   ├── hotelSlice.js        # Redux slice — async thunks + reducers
│   │   └── index.js             # Redux store configuration
│   ├── App.jsx                  # Root component + route definitions
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles + Tailwind directives
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── vercel.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- A running instance of the [Hotel Haven API](https://github.com/[YOUR_USERNAME]/hotelhaven-api)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/[YOUR_USERNAME]/hotelhaven-client.git
cd hotelhaven-client

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Then fill in the values (see Environment Variables below)

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Base URL of the Hotel Haven API
VITE_API_URL=http://localhost:5000

# Cloudinary — required for image uploads
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

> **Important:** All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser.

### How to get Cloudinary credentials

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier available)
2. Go to **Settings → Upload → Upload presets**
3. Create a new **unsigned** upload preset
4. Set the folder to `hotel-haven`
5. Copy the preset name and your cloud name into `.env`

---

## API Integration

All API communication lives in `src/api/hotelApi.js`.

An Axios instance is created with the base URL from the environment variable and a 30-second timeout. A response interceptor normalizes all error messages — whether they come from validation arrays, single error strings, or network failures — into a single string that can be displayed in the UI.

**Image Upload Flow:**

Images are uploaded **directly from the browser to Cloudinary** (unsigned upload). The resulting `secure_url` is then sent as `image_url` in the hotel create/update JSON payload to the backend. The backend stores this URL in PostgreSQL; it never handles binary image data.

---

## State Management

The app uses a single Redux slice (`hotelSlice`) with the following state shape:

```js
{
  list: [],              // Hotels on the current page
  currentHotel: null,   // Hotel currently being viewed/edited
  pagination: {
    currentPage, totalPages, totalCount, limit, hasNext, hasPrev
  },
  filters: {
    search, minPrice, maxPrice, page
  },
  loading: false,        // List loading state
  detailLoading: false,  // Single hotel loading state
  submitting: false,     // Form submission state
  error: null
}
```

Async operations (fetch, create, update, delete) are handled via Redux Toolkit's `createAsyncThunk`.

---

## Deployment

The frontend is deployed on **Vercel**.

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Set the following **environment variables** in the Vercel dashboard under Project → Settings → Environment Variables:

```
VITE_API_URL            = https://your-api-url.vercel.app
VITE_CLOUDINARY_CLOUD_NAME   = your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET = your_upload_preset
```

The `vercel.json` in the repo configures all routes to serve `index.html`, which is required for client-side routing to work correctly:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Deploy to Netlify

1. Run `npm run build`
2. Deploy the `dist/` folder
3. Add a `_redirects` file in `public/`: `/* /index.html 200`
4. Set environment variables in Netlify dashboard


## License

[MIT](LICENSE)
