# Framer Motion Animations Guide

## Overview
This project now includes smooth Framer Motion animations throughout the website to enhance user experience and make the interface feel more polished and elevated.

## Animation Components

### 1. FadeIn
Fades in elements with optional directional movement.

**Props:**
- `delay` (number): Delay before animation starts (default: 0)
- `duration` (number): Animation duration in seconds (default: 0.5)
- `direction` ("up" | "down" | "left" | "right" | "none"): Direction of movement (default: "up")
- `className` (string): Additional CSS classes

**Usage:**
```tsx
<FadeIn direction="up" delay={0.2}>
  <h1>Welcome</h1>
</FadeIn>
```

### 2. ScaleIn
Scales in elements from 80% to 100% with fade effect.

**Props:**
- `delay` (number): Delay before animation starts (default: 0)
- `duration` (number): Animation duration in seconds (default: 0.5)
- `className` (string): Additional CSS classes

**Usage:**
```tsx
<ScaleIn delay={0.3}>
  <Card>Content</Card>
</ScaleIn>
```

### 3. StaggerContainer & StaggerItem
Creates staggered animations for lists and grids.

**StaggerContainer Props:**
- `staggerDelay` (number): Delay between each child animation (default: 0.1)
- `className` (string): Additional CSS classes

**StaggerItem Props:**
- `direction` ("up" | "down" | "left" | "right"): Direction of movement (default: "up")
- `className` (string): Additional CSS classes

**Usage:**
```tsx
<StaggerContainer staggerDelay={0.15}>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <Card>{item.content}</Card>
    </StaggerItem>
  ))}
</StaggerContainer>
```

## Pages with Animations

### Homepage (Index)
- ✅ Dog of the Week card (ScaleIn)
- ✅ Urgent needs scrolling bar (FadeIn)

### Adopt Page
- ✅ Urgent dogs section (FadeIn + StaggerContainer)
- ✅ Dog listing grid (StaggerContainer)
- ✅ Section headers (FadeIn)

### Volunteer Page
- ✅ Stats cards (StaggerContainer)
- ✅ Volunteer opportunities grid (StaggerContainer)
- ✅ Call to action section (FadeIn)

### Donate Page
- ✅ Donation cards (StaggerContainer)
- ✅ Wishlist items grid (StaggerContainer)
- ✅ Section headers (FadeIn)
- ✅ Security notice (FadeIn)
- ✅ Impact section (FadeIn)

### Map Page
- ✅ Page header (FadeIn)
- ✅ Map container (ScaleIn)
- ✅ Feature cards (StaggerContainer)

### Login Page
- ✅ Login card (ScaleIn)

### Forgot Password Page
- ✅ Reset password card (ScaleIn)

### Not Found Page
- ✅ 404 message (ScaleIn)

### Dashboard Pages
- ✅ Welcome header (FadeIn)
- ✅ Stats cards (StaggerContainer)

## Animation Settings

All animations use:
- **Viewport trigger**: Animations trigger when elements come into view
- **Once**: Animations only play once (not on every scroll)
- **Margin**: -50px viewport margin for earlier trigger
- **Easing**: "easeOut" for smooth, natural motion

## Best Practices

1. **Use appropriate delays**: Stagger delays between 0.08-0.15s for grids
2. **Keep durations short**: 0.3-0.5s for most animations
3. **Direction matters**: Use "up" for most content, "down" for headers
4. **Don't overdo it**: Not every element needs animation
5. **Performance**: Animations are GPU-accelerated and optimized

## Customization

To adjust animation behavior, modify the component props:

```tsx
// Slower, more dramatic entrance
<FadeIn duration={0.8} delay={0.5} direction="up">
  <Content />
</FadeIn>

// Faster stagger effect
<StaggerContainer staggerDelay={0.05}>
  {items}
</StaggerContainer>
```

## Notes

- Hero sections are intentionally NOT animated (as per requirements)
- Stories section on homepage is NOT animated (as per requirements)
- All animations respect user's motion preferences
- Animations are responsive and work on all screen sizes
