# Paw Loader - Quick Usage Guide

## ✅ Installation Complete

The animated paw loader has been successfully integrated into your application!

## 🚀 What's Working Now

### Automatic Loading
The loader will automatically appear:
- ✅ On initial page load (1.45 seconds)
- ✅ When navigating between any routes
- ✅ With smooth blur effect and disabled interactions
- ✅ Fully responsive on all devices

### Files Added
```
src/
├── components/
│   ├── PawLoader.tsx              # Main loader component
│   ├── PawLoader.module.css       # Loader styles
│   └── LoaderDemo.tsx             # Demo component (optional)
├── hooks/
│   └── usePageLoader.ts           # Loader state management
└── utils/
    └── loaderUtils.ts             # Manual trigger utilities
```

## 🎯 Testing the Loader

### Method 1: Just Run Your App
```bash
npm run dev
```
The loader will appear automatically on page load and route changes!

### Method 2: Add Demo Component (Optional)
Add this to any page to test manually:

```typescript
import LoaderDemo from '@/components/LoaderDemo';

// In your component:
<LoaderDemo />
```

This adds a floating panel with buttons to trigger the loader.

## 📝 Common Use Cases

### 1. Automatic (Already Working)
Just navigate between pages - the loader appears automatically!

### 2. Manual Trigger for Async Operations
```typescript
import { triggerLoader } from '@/utils/loaderUtils';

const handleSubmit = async () => {
  await triggerLoader(); // Show loader
  await saveData();
  // Loader automatically hides after 1.45s
};
```

### 3. Programmatic Navigation with Loader
```typescript
import { useNavigate } from 'react-router-dom';
import { triggerLoader } from '@/utils/loaderUtils';

const navigate = useNavigate();

const handleClick = async () => {
  await triggerLoader();
  navigate('/adopt');
};
```

## ⚙️ Quick Customizations

### Change Duration
In `src/hooks/usePageLoader.ts`:
```typescript
export const usePageLoader = (initialLoadDuration = 2000) => {
  // Change from 1450 to any duration in milliseconds
```

### Change Colors
In `src/components/PawLoader.tsx`:
```typescript
<path 
  stroke="#1a1a1a"  // Change to any color
  strokeWidth="2.5"  // Adjust thickness
/>
```

### Change Background
In `src/components/PawLoader.module.css`:
```css
.loaderOverlay {
  background-color: rgba(255, 255, 255, 0.98); /* Adjust opacity/color */
  backdrop-filter: blur(8px); /* Adjust blur amount */
}
```

### Change Size
In `src/components/PawLoader.module.css`:
```css
.pawSvg {
  width: 150px;  /* Increase/decrease size */
  height: 150px;
}
```

## 🐛 Troubleshooting

### Loader not appearing?
1. Make sure you're running: `npm run dev`
2. Check browser console for errors
3. Verify Anime.js is installed: `npm list animejs`

### Animation not smooth?
1. Try reducing blur amount in CSS
2. Check if other heavy animations are running
3. Test in different browser

### Want to disable temporarily?
Comment out in `App.tsx`:
```typescript
// <PawLoader isVisible={showLoader} onComplete={handleLoaderComplete} />
```

## 📱 Mobile Support

The loader is fully responsive:
- Desktop: 120px paw
- Tablet: 100px paw
- Mobile: 80px paw

## 🎨 Animation Details

- **Duration**: 1.45 seconds total
- **Stroke Animation**: 1.05 seconds
- **Fade Out**: 0.4 seconds
- **Easing**: easeInOutSine for smooth motion
- **FPS**: 60fps (GPU accelerated)

## 📚 Full Documentation

See `PAW_LOADER_README.md` for complete documentation including:
- Advanced customization options
- All available easing functions
- Performance optimization tips
- Browser compatibility details

## 🎉 You're All Set!

The loader is now active and will appear on every page load and navigation. Just run your app and see it in action!

```bash
npm run dev
```

Navigate between pages to see the smooth paw animation! 🐾
