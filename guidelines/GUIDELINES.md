# System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.

This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs.

**TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need.**

---

# General Guidelines

Any general rules you want the AI to follow.

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files
* Always use TypeScript for type safety
* Use "use client" directive for all React components that use hooks or browser APIs
* Prefer functional components with hooks over class components
* Use React Router DOM for navigation (not Next.js router)
* All components should be exported as named exports (not default exports) for better tree-shaking

---

# Design System Guidelines

Rules for how the AI should make generations look like your company's design system.

## Typography

* **Headings**: Always use `font-['Fraunces']` with `font-bold` for all headings (h1, h2, h3, etc.)
* **Body Text**: Always use `font-['Inter']` for all body text, descriptions, and UI elements
* **Font Sizes**: Use semantic sizing (text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl, text-5xl, text-6xl)
* **Line Heights**: Use default Tailwind line heights (leading-tight, leading-normal, leading-relaxed)

## Colors

* **Primary Action**: Use `bg-button-green` with `text-text-dark` for primary CTAs
* **Borders**: Always use `border-black` for main borders, `border-warm-grey` for subtle dividers
* **Backgrounds**: Use `bg-background` for main backgrounds, `bg-accent-grey/20` for subtle sections
* **Text Colors**: Use `text-foreground` for primary text, `text-foreground/70` for secondary, `text-foreground/60` for tertiary
* **Never use**: Generic colors like `bg-blue-500` or `text-gray-600` - always use design system tokens

## Spacing

* Use the 8px grid system (spacing-2, spacing-4, spacing-6, spacing-8, etc.)
* Container padding: `px-4 sm:px-6 lg:px-8`
* Section padding: `py-12 sm:py-16 lg:py-24`
* Gap between elements: `gap-3`, `gap-4`, `gap-6`, `gap-8`

## Border Radius

* **Standard**: Always use `rounded-[10px]` for cards, buttons, and containers
* **Full**: Use `rounded-full` for avatars, badges, and circular elements
* **Never use**: Generic rounded classes like `rounded-md` or `rounded-lg`

## Shadows

* **Cards**: Use `shadow-md` for standard cards, `shadow-lg` on hover
* **Modals**: Use `shadow-2xl` for modals and overlays
* **Subtle**: Use `shadow-sm` for minimal elevation

## Animations

* **Fade In**: Use `animate-fade-in-up` for content appearing on scroll
* **Staggered**: Use `delay-100`, `delay-200`, `delay-300` for sequential animations
* **Hover**: Use `hover:scale-[1.02]` for subtle hover effects on cards
* **Active**: Use `active:scale-95` for button press feedback
* **Transitions**: Always include `transition-all duration-300` for smooth interactions

## Buttons

The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate users through the application.

### Usage

Buttons should be used for important actions that users need to take, such as form submissions, confirming choices, or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants

* **Primary Button (default)**
  * Purpose: Used for the main action in a section or page
  * Visual Style: `bg-button-green text-text-dark border border-black rounded-[10px]`
  * Usage: One primary button per section to guide users toward the most important action
  * Hover: `hover:bg-button-green/90 hover:scale-[1.02] hover:shadow-lg`
  * Font: `font-['Fraunces'] font-bold`

* **Secondary Button (outline)**
  * Purpose: Used for alternative or supporting actions
  * Visual Style: `bg-transparent text-foreground border border-black rounded-[10px]`
  * Usage: Can appear alongside a primary button for less important actions
  * Hover: `hover:bg-accent-grey/20`

* **Ghost Button**
  * Purpose: Used for the least important actions
  * Visual Style: `border-transparent` with minimal styling
  * Usage: For actions that should be available but not emphasized

### Button Sizes

* **Default**: `px-4 py-2` (h-9)
* **Small**: `px-3 py-1.5` (h-8) with `text-sm`
* **Large**: `px-8 py-6` (h-auto) with `text-lg` for hero CTAs

## Cards

* Always use `border border-black rounded-[10px]` for card containers
* Background: `bg-background` or `bg-card`
* Padding: `p-6` standard, `p-8` for larger cards
* Shadow: `shadow-md` default, `hover:shadow-lg` on hover
* Hover effect: `hover:scale-[1.02] transition-all duration-300`

## Forms

* **Inputs**: Use `border-[1px] border-black rounded-[10px] px-4 py-6 bg-white text-foreground`
* **Placeholders**: Use `placeholder:text-foreground/40`
* **Focus**: Use `focus-visible:ring-ring focus-visible:ring-[3px]`
* **Labels**: Use `font-['Inter'] text-sm` for form labels
* **Error States**: Use `border-red-600` and `text-red-600` for validation errors

## Modals & Dialogs

* **Overlay**: `bg-black/50 backdrop-blur-sm`
* **Container**: `bg-background border border-black rounded-[10px] shadow-2xl`
* **Padding**: `p-6 lg:p-8`
* **Animation**: `animate-fade-in-up` for entrance
* **Max Width**: `max-w-2xl` for forms, `max-w-4xl` for content

## Navigation

* **Header**: `sticky top-0 z-50 border-b border-warm-grey bg-background/80 backdrop-blur-md`
* **Nav Links**: Use colored triangle SVG indicators (8x7 viewBox) with brand colors
* **Active States**: Underline animation with `after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-button-green after:transition-all hover:after:w-full`

## Icons

* Use Lucide React icons exclusively
* Standard size: `w-4 h-4` for inline, `w-5 h-5` for buttons, `w-6 h-6` for larger elements
* Color: Inherit from parent or use `text-foreground/70` for secondary icons

## Dark Mode

* Use `.dark` class on `document.documentElement` to toggle
* All color tokens are defined in `globals.css` with dark mode variants
* Test both light and dark modes for all components

## Responsive Design

* **Mobile First**: Design for mobile, then enhance for larger screens
* **Breakpoints**: 
  * `sm:` 640px and up
  * `md:` 768px and up
  * `lg:` 1024px and up
* **Container**: Always use `container mx-auto px-4 sm:px-6 lg:px-8`
* **Grid**: Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for responsive grids

## Accessibility

* Always include `aria-label` for icon-only buttons
* Use semantic HTML (`<nav>`, `<header>`, `<main>`, `<section>`)
* Ensure keyboard navigation works for all interactive elements
* Maintain sufficient color contrast (design system handles this)
* Use `sr-only` class for screen-reader-only text

## Code Organization

* **Component Structure**: 
  ```
  "use client";
  
  import statements
  
  interface Props {}
  
  export function ComponentName({ props }: Props) {
    // hooks
    // handlers
    // render
  }
  ```

* **File Naming**: Use PascalCase for component files (`Button.tsx`)
* **Folder Structure**: Group related components in folders (`onboarding/screens/`, `dashboard/`, etc.)
* **Exports**: Use named exports in `index.ts` files for cleaner imports

## Performance

* Use `React.memo()` for expensive components that re-render frequently
* Lazy load heavy components with `React.lazy()`
* Optimize images with proper sizing and formats
* Use `useCallback` and `useMemo` judiciously (not everywhere)

## Error Handling

* Always handle image loading errors (use `ImageWithFallback` component)
* Provide user-friendly error messages
* Log errors to console in development, handle gracefully in production

---

# Component-Specific Guidelines

## ICP Cards

* Use circular profile images with colored SVG backgrounds
* Locked content should be blurred with `blur-[4px] opacity-50`
* Card numbers should appear as badges outside the card (left for card 1, right for others)
* Use `animate-fade-in-up` for card entrance animations

## Onboarding Screens

* All screens should have `animate-fade-in-up` on the container
* Headings: `font-['Fraunces'] font-bold text-4xl`
* Descriptions: `text-foreground/70 max-w-md`
* Input fields: Large padding (`px-4 py-6`) for better mobile UX
* Support Enter key to continue where appropriate

## Paywall Components

* Always show feature comparison (Free vs Pro)
* Include legal disclaimers about recurring billing
* Use gradient backgrounds for premium tiers
* Show "Recommended" badge on annual plan
* Security badges at bottom of checkout form

## Dashboard Components

* Sidebar should be collapsible on desktop
* Use `border-r border-warm-grey` for sidebar separator
* Locked features should show crown icon for free users
* Upgrade CTAs should use gradient: `from-[#FFD336] to-[#FF9922]`

---

# Do's and Don'ts

## ✅ Do

* Use design system tokens for all colors, spacing, and typography
* Follow the 8px grid system
* Use semantic HTML elements
* Include proper TypeScript types
* Add hover and active states for interactive elements
* Test responsive behavior
* Use consistent animation patterns
* Include proper ARIA labels

## ❌ Don't

* Don't use arbitrary color values (use design tokens)
* Don't use generic border radius (always `rounded-[10px]`)
* Don't mix font families (Fraunces for headings, Inter for body)
* Don't skip TypeScript types
* Don't forget mobile responsiveness
* Don't use inline styles (use Tailwind classes)
* Don't create components without proper error handling
* Don't forget to export components properly

---

# Testing Checklist

Before considering a component complete:

- [ ] Uses correct font families (Fraunces/Inter)
- [ ] Uses design system colors (no arbitrary values)
- [ ] Has proper border radius (`rounded-[10px]`)
- [ ] Includes hover/active states
- [ ] Responsive on mobile, tablet, desktop
- [ ] Works in both light and dark mode
- [ ] Has proper TypeScript types
- [ ] Includes accessibility attributes
- [ ] Uses correct spacing (8px grid)
- [ ] Animations are smooth and performant

