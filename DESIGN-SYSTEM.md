# Website Builder 3.0 Design System

## Core Principles

### 1. Consistency
- Use established design tokens for all spacing, typography, and colors
- Follow the 8-point grid system
- Maintain consistent interaction patterns across the platform

### 2. Accessibility First
- WCAG 2.1 AA compliance minimum
- Keyboard navigation for all interactive elements
- Screen reader friendly with proper ARIA labels
- Color contrast ratios: 4.5:1 for normal text, 3:1 for large text

### 3. Mobile First
- Design for mobile viewports first, then enhance for larger screens
- Touch-friendly targets (minimum 44x44px)
- Responsive typography and spacing

### 4. Performance
- Minimize CSS bundle size
- Use CSS variables for theming
- Lazy load heavy components
- Optimize for Core Web Vitals

## Design Tokens

### Typography Scale (Perfect Fourth - 1.333 ratio)
```
text-xs: 0.75rem (12px)
text-sm: 0.875rem (14px)
text-base: 1rem (16px)
text-lg: 1.125rem (18px)
text-xl: 1.333rem (~21px)
text-2xl: 1.777rem (~28px)
text-3xl: 2.369rem (~38px)
text-4xl: 3.157rem (~51px)
text-5xl: 4.209rem (~67px)
text-6xl: 5.610rem (~90px)
```

### Spacing System (8-point grid)
```
space-1: 8px
space-2: 16px
space-3: 24px
space-4: 32px
space-5: 40px
space-6: 48px
space-8: 64px
space-10: 80px
space-12: 96px
space-16: 128px
space-20: 160px
```

### Color System
- Primary: Brand color for primary actions
- Secondary: Supporting brand color
- Accent: Highlight and focus states
- Muted: Subdued backgrounds and text
- Destructive: Error and delete actions

### Elevation
```
elevation-sm: Subtle shadow for cards
elevation-md: Default shadow for dropdowns
elevation-lg: Prominent shadow for modals
elevation-xl: Maximum elevation for tooltips
```

## Component Guidelines

### Buttons
- Primary: High emphasis actions
- Secondary: Medium emphasis actions
- Outline: Low emphasis actions
- Ghost: Minimal emphasis, often for icons
- Sizes: sm (32px), default (40px), lg (48px)

### Forms
- Input height: 40px (default)
- Label spacing: 8px from input
- Error messages: Below input with 4px spacing
- Required fields: Marked with * after label

### Layout Components
- Container: Max widths (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- Section: Consistent vertical spacing (sm: 48px, md: 64px, lg: 96px)
- Stack: Flexbox utilities with gap prop

### Feedback
- Loading: Skeleton screens for content, spinners for actions
- Empty states: Icon, title, description, and action
- Error states: Clear messaging with recovery actions

## Implementation Patterns

### Compound Components
```tsx
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### Polymorphic Components
```tsx
<Button as="a" href="/link">Link Button</Button>
<Text as="span">Inline text</Text>
```

### Responsive Props
```tsx
<Stack gap={{ base: 2, md: 4, lg: 6 }}>
  <Box padding={{ base: 3, md: 5 }}>Content</Box>
</Stack>
```

## Best Practices

1. **Component Composition**
   - Build complex UIs from simple, reusable components
   - Use composition over configuration
   - Keep components focused on a single responsibility

2. **State Management**
   - Lift state up when needed for sibling communication
   - Use controlled components for forms
   - Implement proper loading and error states

3. **Performance**
   - Memoize expensive computations
   - Use React.lazy for code splitting
   - Implement virtual scrolling for long lists

4. **Testing**
   - Write tests for all interactive components
   - Test accessibility with automated tools
   - Manual testing on real devices

5. **Documentation**
   - Document all component props with TypeScript
   - Provide usage examples
   - Include accessibility notes