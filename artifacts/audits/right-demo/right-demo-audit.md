# Right demonstration audit

Audit viewport: 1440 × 1024  
Reference: supplied landing-page screenshot  
Implementation: local preview captured during this audit

## Verdict

The large geometry is close: the status row, card bounds, property stack, timeline, orb, playback control, and context-menu anchor all occupy approximately the correct regions. The implementation is not yet pixel-perfect, and the interaction currently reads as several working controls layered together rather than one deliberately choreographed product demonstration.

## Audit states

1. **Desktop default — Needs refinement**
   - Correct overall composition and hierarchy.
   - Panel and menu elevation are darker and more diffuse than the reference.
   - Pause glyph is too thin; the reference uses two substantial blue bars.
   - Playhead handle, stem fade, menu chevron, selection band, row rhythm, and small monospace typography do not yet match precisely.

2. **Animation in progress — Needs work**
   - The orb and playhead animate, but the context menu stays open throughout the loop.
   - Property values do not change with the timeline, so the chips, orb, and playhead do not explain one another.
   - The menu appears automatically without a pointer or staged interaction to motivate it.

3. **Responsive transition — Failing**
   - If the viewport crosses below the desktop breakpoint while the menu is open, the demonstration disappears but the portalled menu remains over the primary page content.

4. **Keyboard focus — At risk**
   - The timeline receives focus, but the captured focused state shows no visible focus indicator.
   - The 20 × 20 px plus control is below the 24 × 24 CSS-pixel WCAG 2.2 minimum target size.
   - The automatically opened menu can unexpectedly take interaction context on page load.

## Prioritized findings

### P1

- Close the context menu whenever the demo becomes hidden or unmounts.
- Add a visible keyboard focus treatment to the transparent range input through a visible sibling/wrapper state.

### P2

- Replace the permanent open-menu state with a timed sequence: play, progress, open menu near the intended moment, highlight Repeat action, close, and restart.
- Synchronize at least one property/value change with the playhead and orb so the demonstration communicates a feature rather than ambient motion.
- Reduce panel and menu shadows to the flatter, crisper reference elevation.
- Match the pause icon, playhead tab shape, fading stem, submenu chevron, active-row height, and menu row spacing.
- Give visually interactive menu rows feedback or remove affordances that imply unavailable behavior.

### P3

- Refine monospace font weight, glyph spacing, selection highlight, commit checkmark, border tone, and subtle orb sharpness/saturation.
- Recheck exact 1–3 px offsets after the shadow and icon assets are corrected.

## Strengths

- Overall desktop placement and component proportions are close to the source.
- Correct source assets are used for the avatar and animated orb.
- Native range semantics and Radix menu semantics provide a useful accessibility foundation.
- Reduced-motion handling is present.
- Scrubbing, play/pause, repeat, plus toggle, and the Copy as submenu are implemented.

## Evidence limits

- Contrast ratios were not measured numerically.
- The supplied reference is a static screenshot, so its intended timing and state transitions are inferred.
- JPEG capture can slightly alter blur and saturation; the orb-color difference should be verified from lossless captures before fine color tuning.
