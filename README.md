# 🎬 Movie Watchlist App

A modern, responsive React + Vite movie tracking web application.

## Features

- **Register / Login** with client-side validation
- **Per-user watchlists** stored in `localStorage`
- **Add movies** with title, genre, star rating, and watched status
- **Filter** by All / Watched / Unwatched
- **Toggle** watched status or remove any movie
- **Stats dashboard** showing totals at a glance
- **Protected routes** — only logged-in users can access the dashboard

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI |
| Vite 5 | Build tool / dev server |
| React Router DOM 6 | Client-side routing |
| localStorage | Data persistence |
| CSS (vanilla) | Styling |

## Project Structure

```
movie-watchlist-app/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx                  # Routes (BrowserRouter)
    ├── utils/
    │   └── storage.js           # All localStorage helpers
    ├── components/
    │   ├── StarRating.jsx
    │   └── MovieCard.jsx
    ├── pages/
    │   ├── Landing.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   └── Dashboard.jsx
    └── styles/
        ├── global.css
        ├── landing.css
        ├── auth.css
        └── dashboard.css
```

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

### Installation & Run

```bash
# 1. Enter the project folder
cd movie-watchlist-app

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Usage

1. Visit the **Landing page** and click **Get Started**
2. Fill in the **Register** form and submit
3. You'll be redirected to **Login** — sign in with your credentials
4. On the **Dashboard**:
   - Add a movie using the left-hand form
   - Rate it with the star picker
   - Toggle watched status with the **✓ Watch** button
   - Remove a movie with the **✕ Remove** button
   - Filter the list using the **All / Watched / Unwatched** tabs
5. Click **Log out** to end your session

## Notes

- All data is stored locally in the browser's `localStorage`. Clearing browser data will erase all accounts and watchlists.
- Passwords are stored in plain text for simplicity (frontend-only demo). Do **not** use real passwords.
