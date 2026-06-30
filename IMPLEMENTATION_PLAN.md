# Tactile Landing Implementation Plan

## Goal

Build a premium, highly interactive landing page for Tactile Manifesto using React and TypeScript with smooth motion, tactile-feeling poster interactions, and a vinyl player that controls real audio playback.

The page should feel editorial, deliberate, and polished rather than template-driven.

## Product Direction

- Recreate the provided mockup faithfully as the baseline layout.
- Prioritize motion quality, layered composition, and tactile interaction.
- Keep the UI system minimal and custom rather than relying on a heavy component library.
- Make the experience responsive and performant across desktop and mobile.
- Respect accessibility and reduced-motion preferences.

## Stack

- Build tool: Vite
- Framework: React
- Language: TypeScript
- State management: Zustand
- UI primitives: Radix Primitives
- Animation: GSAP
- Audio: native `HTMLAudioElement` with optional Web Audio API enhancement
- Styling: custom CSS with design tokens

## Why This Stack

### React + TypeScript + Vite

- Fast local iteration
- Clean component boundaries
- Strong typing for interaction-heavy UI
- Good fit for a custom landing page rather than a CMS-style build

### Zustand

- Lightweight shared state
- Ideal for cross-component interaction state
- Avoids overengineering for a single-page experience

### Radix Primitives

- Accessible behavior for tooltips, dialogs, and future overlays
- Unstyled, so the design stays fully custom
- Better fit than a full UI kit for an art-directed experience

### GSAP

- Best fit for timeline-based choreography
- Strong control over layered transforms
- Good for tactile motion like peel, hover drift, vinyl rotation, and orchestrated entrance sequences

### Custom CSS

- Better than utility-heavy styling for this kind of composed, editorial layout
- Easier to maintain fine-grained art direction, spacing, and layered visuals

## Core Experience Areas

### 1. Hero Composition

- Large editorial headline
- Date and panel metadata
- Left-side rail markers
- Signed closing section
- Strong white-space composition based on the mockup

### 2. Vinyl Player

- Interactive play, pause, stop, and mute controls
- Real audio playback
- Rotating record while playing
- Tonearm and indicator details
- Optional audio-reactive enhancements later

### 3. Poster Stack

- Layered poster composition on the right side
- Posters feel like stacked printed sheets
- Hover and pointer interactions create subtle depth
- Top paper sheet should feel peelable or loosely floating

### 4. CTA Layer

- Waitlist CTA in the header
- Repeat CTA lower in the composition
- Clear but not overbearing emphasis

## State Model

Global shared state should stay small and interaction-focused.

### Store fields

- `audioStatus`: `idle | playing | paused | stopped`
- `muted`
- `activePosterId`
- `reducedMotion`
- `audioController`

### Local state

Use local component state for isolated UI behavior that does not need to be shared globally.

### Refs

Use refs for:

- GSAP timelines
- DOM handles
- Audio element/controller instances

## Project Structure

```text
src/
  app/
    App.tsx
  components/
    audio/
      VinylPlayer.tsx
    cta/
      WaitlistButton.tsx
    hero/
      HeroCopy.tsx
    layout/
      TopBar.tsx
    posters/
      PosterCard.tsx
      PosterStack.tsx
    signature/
      SignatureBlock.tsx
  lib/
    animation/
      landingTimeline.ts
      posterMotion.ts
    audio/
      audioController.ts
  state/
    useLandingStore.ts
  styles/
    base.css
    index.css
    tokens.css
```

## Motion Strategy

### Entrance motion

- Header enters first
- Hero copy follows with a slight vertical lift
- Right-side art enters with offset and stagger
- Motion should feel smooth and intentional, not flashy

### Vinyl motion

- Record rotates while audio is playing
- Rotation stops cleanly on pause or stop
- Tonearm can shift subtly between idle and active states
- Controls respond with precise hover and press feedback

### Poster motion

- Stack responds to pointer hover with subtle spread and drift
- Top layer should slightly separate from the stack
- Paper sheet should feel light and physical
- Motion should rely mostly on transforms and opacity

### Reduced motion

- Disable non-essential movement
- Preserve layout and interaction clarity
- Avoid relying on animation alone to communicate state

## Audio Strategy

### Phase 1

- Use a plain `HTMLAudioElement`
- Control playback with play, pause, stop, and mute
- Keep the audio file in `public/audio/`

### Phase 2

- Optionally add Web Audio API features:
  - analyser-based visual feedback
  - subtle reactive glow or pulse
  - richer playback synchronization

### Notes

- Audio should only begin after user interaction
- UI state must always reflect true playback state
- Provide clear mute and stop behavior

## Styling Strategy

### Tokens

Centralize:

- colors
- typography stacks
- spacing
- radii
- shadows
- content width

### Layout

- Custom CSS layout, not generic app-shell styling
- Preserve the editorial asymmetry of the mockup
- Use responsive breakpoints without flattening the design language

### Component styling

- Semantic class names
- Shared tokens
- Minimal visual coupling between components

## Performance Rules

- Prefer animating `transform` and `opacity`
- Avoid layout-heavy animation
- Keep shadows and blur effects controlled
- Preload only essential assets
- Keep poster/media assets optimized
- Avoid unnecessary rerenders from shared state

## Accessibility Rules

- Maintain keyboard access to interactive controls
- Use Radix where accessible behavior matters
- Ensure visible focus states
- Respect `prefers-reduced-motion`
- Label audio controls clearly
- Avoid tooltip-only communication for important actions

## Implementation Phases

### Phase 1. Foundation

- Scaffold the app structure
- Set up styles, tokens, and base layout
- Add state store and audio controller abstraction
- Establish placeholder content and art blocks

### Phase 2. Static Visual Match

- Recreate the mockup layout precisely
- Tune spacing, hierarchy, and typography
- Shape the vinyl composition and poster stack
- Add responsive behavior

### Phase 3. Functional Interaction

- Wire vinyl controls to real audio playback
- Connect store state to UI
- Add active poster selection behavior

### Phase 4. Motion Layer

- Add page entrance timeline
- Add vinyl active-state animation
- Add poster hover/spread/parallax behavior
- Add paper sheet movement

### Phase 5. Polish

- Improve motion timing and physicality
- Tune shadows, spacing, and micro-interactions
- Add hover and focus refinements
- Verify mobile layout quality

### Phase 6. QA

- Cross-check responsiveness
- Test reduced-motion behavior
- Verify keyboard navigation
- Confirm audio state transitions
- Optimize assets and performance

## Dependencies To Install

```bash
npm install zustand gsap @radix-ui/react-tooltip @radix-ui/react-dialog
```

## Asset Checklist

- final logo/wordmark
- final poster artwork
- final vinyl artwork
- signature asset or polished vector treatment
- production audio file for the vinyl player

## Immediate Next Steps

1. Install dependencies.
2. Replace placeholder poster shapes with real artwork assets.
3. Add the production audio file to `public/audio/manifesto-loop.mp3`.
4. Tune the static layout until it matches the mockup closely.
5. Begin the first GSAP interaction pass for the vinyl and poster stack.

## Success Criteria

- The page visually matches the design direction of the mockup.
- Audio controls work reliably and feel polished.
- Poster interactions feel tactile and premium.
- The page remains smooth on modern devices.
- The codebase stays modular and easy to iterate on.
