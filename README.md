# Booster Tasks - Frontend Application

This is the frontend client for the Booster Tasks application. It is built using Angular (standalone component structure) and styled with responsive, premium CSS layouts.

## Features
- **Statistics Dashboard**: Real-time reactive cards tracking total, pending, and completed tasks.
- **Task Creation**: Input validations for mandatory fields with clear inline error styling.
- **Task Listing**: Interactive status toggling, deletion action, search query filtering, and status tabs (All, Pending, Completed).
- **PWA & Offline Mode**: Configured with Angular service workers (`@angular/pwa`) and LocalStorage fallback cache. If the backend server goes offline, the app switches to offline view with a warning banner, allowing you to view previously cached tasks.
- **Modern UI**: Sleek dark-mode aesthetic with custom animations and glassmorphic layouts.

## Getting Started

### Prerequisites
- Node.js (v20+)
- npm

### Running the Application
To launch the Angular development server, run:
```bash
npm install
npm start
```
Once started, open your browser and navigate to `http://localhost:4200/`.

### Running Tests
To run unit tests using Vitest:
```bash
npm run test
```
