# Framer Motion Animations Guide

## ✅ Implementation Complete

Professional Framer Motion animations have been added throughout your website to create a polished, elevated user experience.

## 📦 Animation Components Created

### Location: `src/components/animations/`

#### AnimatedSection.tsx
Provides scroll-triggered animations for sections:

- **FadeIn** - Smooth fade and slide up effect
- **SlideInLeft** - Slide in from left with fade
- **SlideInRight** - Slide in from right with fade
- **ScaleIn** - Scale up with fade
- **FloatIn** - Float up with scale effect
- **RotateIn** - Rotate and scale in
- **StaggerContainer** - Container for staggered children
- **StaggerItem** - Individual staggered items

#### AnimatedCard.tsx
Card-specific animations with hover effects:

- **AnimatedCard** - Card with hover lift and scale
- **AnimatedCardWithTilt** - Card with 3D tilt effect on hover

## 🎨 Animation Features

### Scroll-Triggered Animations
- Animations trigger when elements enter viewport
- `viewport={{ once: true }}` - Animations play once
- `margin: "-100px"` - Trigger slightly before element is visible
- Smooth easing: `[0.22, 1, 0.36, 1]` (custom cubic-bezier)

### Hover Effects
- Cards lift up on hover (`y: -8` to `-10`)
- Subtle scale increase (`scale: 1.02` to `1.03`)
- Smooth transitions (0.3s duration)

### Stagger Effects
- Children animate in sequence
- Customizable delay between items
- Creates professional cascading effect

## 📄 Pages with Animations

### ✅ Index (Homepage)
- **DogOfTheWeek card**: SlideInRight animation
- **StoriesSection**: SlideInLeft animation
- Both animate in from sides with 0.2s delay

### ✅ Adopt Page
- Already has comprehensive animations:
  - FadeIn for headers
  - StaggerContainer/StaggerItem for dog cards
  - Smooth card hover effects

### ✅ Donate Page
- Already has animations:
  - FadeIn for sections
  - StaggerContainer for donation cards
  - StaggerItem for wishlist items

### ✅ Volunteer Page
- Already has animations:
  - FadeIn for headers
  - StaggerContainer for opportunity cards
  - Smooth transitions throughout

### ✅ VolunteerDashboard
- Already has animations:
  - FadeIn for welcome header
  - StaggerContainer for stats cards
  - Professional dashboard feel

### ✅ StaffDashboard
- Already has animations:
  - FadeIn for sections
  - StaggerContainer for cards
  - Smooth data presentation

### ✅ AdminDashboard
- **NEW**: Added animations:
  - FadeIn for welcome header
  - StaggerContainer for stats cards (4 cards)
  - FadeIn for System Alerts section
  - FadeIn for Tabs section
  - Professional admin interface

### ✅ About Page
- Already has animations:
  - FadeIn for hero and mission
  - StaggerContainer for values cards
  - Team section animations

## 🎯 Usage Examples

### Basic Fade In
```tsx
import { FadeIn } from "@/components/animations/AnimatedSection";

<FadeIn delay={0.2}>
  <YourComponent />
</FadeIn>
```

### Slide In from Sides
```tsx
import { SlideInLeft, SlideInRight } from "@/components/animations/AnimatedSection";

<div className="grid grid-cols-2 gap-6">
  <SlideInLeft delay={0.2}>
    <LeftCard />
  </SlideInLeft>
  <SlideInRight delay={0.2}>
    <RightCard />
  </SlideInRight>
</div>
```

### Staggered Cards
```tsx
import { StaggerContainer, StaggerItem } from "@/components/animations/AnimatedSection";

<StaggerContainer className="grid grid-cols-3 gap-6">
  {items.map(item => (
    <StaggerItem key={item.id}>
      <Card>{item.content}</Card>
    </StaggerItem>
  ))}
</StaggerContainer>
```

### Animated Card with Hover
```tsx
import { AnimatedCard } from "@/components/animations/AnimatedCard";

<AnimatedCard delay={0.1}>
  <Card>Your content</Card>
</AnimatedCard>
```

## ⚙️ Customization

### Adjust Animation Duration
```tsx
<FadeIn delay={0.5}> {/* Delay before animation starts */}
  <Component />
</FadeIn>
```

### Modify Stagger Delay
```tsx
<StaggerContainer staggerDelay={0.15}> {/* Time between each child */}
  {/* children */}
</StaggerContainer>
```

### Custom Animation Variants
You can extend the animation components or create custom variants:

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
  <YourComponent />
</motion.div>
```

## 🎬 Animation Timing

- **Fast animations**: 0.3s - 0.4s (hover effects)
- **Standard animations**: 0.5s - 0.7s (most scroll animations)
- **Slow animations**: 0.8s+ (hero sections, important elements)
- **Stagger delay**: 0.08s - 0.15s between items

## 🚀 Performance

- Animations use GPU-accelerated properties (transform, opacity)
- `viewport={{ once: true }}` prevents re-animation on scroll
- Smooth 60fps animations
- No layout shift or jank

## 📱 Mobile Responsive

All animations work seamlessly on mobile devices:
- Touch-friendly hover states
- Reduced motion respected (system preference)
- Optimized for mobile performance

## 🎨 Best Practices

1. **Don't overuse**: Not every element needs animation
2. **Consistent timing**: Use similar durations for similar elements
3. **Meaningful motion**: Animations should enhance UX, not distract
4. **Test on devices**: Ensure smooth performance on all devices
5. **Accessibility**: Respect `prefers-reduced-motion` setting

## 🔧 Troubleshooting

### Animations not playing?
- Check that Framer Motion is installed: `npm list framer-motion`
- Ensure components are imported correctly
- Verify viewport settings

### Animations too slow/fast?
- Adjust `duration` in transition prop
- Modify `delay` prop for timing
- Change `staggerDelay` for stagger effects

### Performance issues?
- Reduce number of animated elements
- Use `viewport={{ once: true }}`
- Simplify complex animations

## 📚 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Easing Reference](https://easings.net/)
- [Motion Design Principles](https://material.io/design/motion)

---

Your website now has professional, polished animations that create a premium user experience! 🎉
