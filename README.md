# HR Dashboard - Koshpal

A modern HR dashboard built with React, Tailwind CSS, and Recharts.

## Features

- 📊 Interactive dashboard with charts and statistics
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🔄 React Router for navigation
- 🔌 Ready for backend integration

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components (Dashboard, Resources, Sessions, etc.)
├── routes/        # React Router configuration
├── services/      # API service layer (ready for backend)
└── utils/         # Utility functions
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Backend Integration

The project is structured to easily connect to a backend API:

1. **API Service Layer**: All API calls are centralized in `src/services/api.js`
2. **Environment Variables**: Use `.env` file to configure your backend URL
3. **API Functions**: Ready-to-use functions for all endpoints

### Connecting to Backend

1. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

2. Update API calls in `src/services/api.js`:
   - Replace mock data with actual `apiRequest()` calls
   - Uncomment the TODO sections

3. Add authentication tokens when needed:
   - Update the `apiRequest` function in `src/services/api.js`
   - Add token management logic

## Pages

- `/` or `/dashboard` - Main dashboard
- `/resources` - Resources page
- `/sessions` - Sessions page
- `/schedule` - Schedule page
- `/finances` - My Finances page
- `/settings` - Settings page

## Technologies

- React 18
- React Router DOM
- Tailwind CSS
- Recharts
- React Icons
- Vite

## License

MIT
