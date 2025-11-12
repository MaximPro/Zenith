# Radio Mein Studentenmädchen - Optimized

An optimized, offline-capable web audio player featuring both radio streaming and audiobook playback capabilities. This is an enhanced version of the original project with significant performance, code quality, and accessibility improvements.

## Features

- **Radio Player**: Stream live audio with volume control and play time tracking
- **Audiobook Player**: Multi-track playback with full controls (play/pause, previous/next, repeat)
- **Offline Support**: Progressive Web App (PWA) with service worker caching
- **Responsive Design**: Beautiful UI that works on all devices
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Media Session API**: Hardware media key support on compatible devices
- **Persistent State**: Remembers volume, track position, and play time across sessions

## Optimizations from Original

### 1. **Code Architecture & Organization**
- ✅ Proper directory structure (`src/components`, `src/hooks`, `src/types`, `src/utils`, `src/constants`)
- ✅ Separation of concerns with modular components
- ✅ Reusable components (`VolumeControl`, `TimeDisplay`, `ErrorBoundary`)
- ✅ Custom hooks (`useAudioPlayer`) for shared logic
- ✅ Centralized constants and configuration

### 2. **TypeScript & Type Safety**
- ✅ Strict TypeScript configuration with all safety checks enabled
- ✅ Comprehensive type definitions for all props and state
- ✅ Type-safe utility functions
- ✅ No `any` types - full type coverage

### 3. **Performance Optimizations**
- ✅ React.memo for component memoization
- ✅ useCallback hooks to prevent unnecessary re-renders
- ✅ Code splitting with manual chunks (vendor bundle separation)
- ✅ Lazy loading potential with dynamic imports
- ✅ Optimized service worker with separate caches for audio and static assets
- ✅ Tree-shaking enabled via ES modules

### 4. **Build & Development Tools**
- ✅ Complete package.json with all necessary dependencies
- ✅ Vite for fast development and optimized builds
- ✅ ESLint with strict rules for code quality
- ✅ Prettier for consistent code formatting
- ✅ TypeScript compiler for type checking
- ✅ Tailwind CSS with PostCSS for optimized styles

### 5. **PWA Enhancements**
- ✅ Vite PWA plugin with automatic service worker generation
- ✅ Improved caching strategies (CacheFirst for audio, NetworkFirst for pages)
- ✅ Automatic updates checking
- ✅ Proper cache versioning and cleanup
- ✅ Web App Manifest for installability

### 6. **Error Handling & Resilience**
- ✅ Error boundaries to catch React errors gracefully
- ✅ Try-catch blocks in async operations
- ✅ Fallback UI for error states
- ✅ LocalStorage error handling with defaults
- ✅ Network error recovery

### 7. **Accessibility (a11y)**
- ✅ ARIA labels on all interactive elements
- ✅ Proper semantic HTML structure
- ✅ Keyboard navigation support
- ✅ Focus management and visible focus indicators
- ✅ Screen reader friendly controls
- ✅ aria-valuetext for complex controls

### 8. **State Management**
- ✅ LocalStorage integration with error handling
- ✅ Persistent state across sessions
- ✅ Separate storage keys for different features
- ✅ State cleanup on unmount

### 9. **Code Quality**
- ✅ Consistent code style with Prettier
- ✅ ESLint rules to catch common issues
- ✅ TypeScript strict mode
- ✅ Proper component naming and organization
- ✅ Comprehensive comments and documentation

### 10. **Developer Experience**
- ✅ Hot module replacement (HMR) with Vite
- ✅ Fast build times
- ✅ Type checking in development
- ✅ Clear error messages
- ✅ Environment variable support
- ✅ Consistent code formatting

## Project Structure

```
/
├── public/
│   └── service-worker.js          # Custom service worker
├── src/
│   ├── components/
│   │   ├── AudiobookPlayer.tsx    # Audiobook player component
│   │   ├── ErrorBoundary.tsx      # Error boundary wrapper
│   │   ├── RadioPlayer.tsx        # Radio player component
│   │   ├── TimeDisplay.tsx        # Reusable time display
│   │   └── VolumeControl.tsx      # Reusable volume control
│   ├── hooks/
│   │   └── useAudioPlayer.ts      # Custom audio player hook
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── utils/
│   │   ├── formatTime.ts          # Time formatting utilities
│   │   └── storage.ts             # LocalStorage utilities
│   ├── constants/
│   │   └── index.ts               # App constants and config
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # App entry point
│   ├── index.css                  # Global styles
│   └── registerServiceWorker.ts   # SW registration
├── index.html                      # HTML template
├── server.js                       # Production server
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind CSS config
├── postcss.config.js               # PostCSS configuration
├── .eslintrc.cjs                   # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── .gitignore                      # Git ignore rules
├── .env.example                    # Environment variables example
└── package.json                    # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Zenith
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables (optional):
```bash
cp .env.example .env.local
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

Start the production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with service worker support

## Performance Metrics

### Bundle Size Optimization
- Vendor chunk separation
- Tree-shaking enabled
- CSS purging with Tailwind
- Minification and compression

### Loading Performance
- Service worker caching
- Code splitting
- Lazy loading potential
- Optimized asset loading

### Runtime Performance
- Memoized components
- Optimized re-renders
- Efficient event handlers
- Local state management

## Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- High contrast support
- Responsive touch targets

## Technical Stack

- **Framework**: React 18.3
- **Language**: TypeScript 5.5
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **Linting**: ESLint 8.57
- **Formatting**: Prettier 3.3
- **PWA**: Vite PWA Plugin 0.20

## License

This project is provided as-is for educational and personal use.

## Deployment

The application can be deployed to:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static hosting service

For Vercel deployment:
1. Build the project: `npm run build`
2. Deploy the `dist` directory

## Contributing

Contributions are welcome! Please ensure:
- Code passes TypeScript type checking
- Code passes ESLint checks
- Code is formatted with Prettier
- Tests pass (if applicable)

## Support

For issues or questions, please open an issue on the GitHub repository.
