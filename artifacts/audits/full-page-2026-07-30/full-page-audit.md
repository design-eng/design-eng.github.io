# Tactile landing page full-page audit

Audit viewport: 1440 × 1024  
Reference: supplied landing-page screenshot  
Implementation: local preview captured during this audit

## Verdict

The page frame, header, hero, CTA placement, main demo geometry, footer rails,
and supplied image assets are close to the reference. The remaining visible
work is concentrated in the manifest-preview spacing/state and the menu's
internal grouping. Typography families appear correct; the manifest wrap
difference comes from the copy track being too narrow, not an obviously wrong
font.

## Step health

1. **Header and hero — Healthy**
   - The 148 px left edge and 121 px right edge match.
   - Logo, brand lockup, Discord link, navigation, hero line breaks, and CTA
     positions match the source.
   - SF Pro Display is correctly used for the brand and hero. Inter matches the
     supporting UI/body letterforms.

2. **Manifest preview — Needs refinement**
   - The copy starts on the correct rail, but its 350 px track is approximately
     8–10 px too narrow. The source keeps “the” on line one; the implementation
     wraps it to line two.
   - The source's active pagination dot is the second dot at x 305–309 / y
     634–638. The implementation starts on the first dot at x 295–299 / y
     638–642.
   - Pagination is four pixels too low.
   - The automatic carousel pauses on hover/focus, but has no explicit visible
     pause control.

3. **Lower artwork and footer — Mostly healthy**
   - The supplied artwork is correctly rendered at 439 × 145 px and begins at
     x 148.
   - Its source vertical run is y 731–875; the implementation is y 737–881, six
     pixels too low.
   - The footer remains aligned, so only the artwork/manifest spacing should
     move.

4. **Interactive demonstration — Needs refinement**
   - Status row, card, property stack, timeline, orb, playback control, menu
     bounds, and menu overlap are close.
   - The source has three menu dividers: after List asset, after Copy as, and
     after Repeat action. Both the showcase and real context menu currently
     include only the latter two.
   - Adding the divider without retuning rows will make the menu about nine
     pixels taller. Preserve the current source-aligned outer height by
     tightening row/padding rhythm at the same time.
   - Pause bars remain slightly thinner than the source.
   - Panel/menu elevation and orb glow remain marginally softer/flatter than
     the source.

5. **Accessibility and responsive behavior — Functional, with one risk**
   - Strengths: semantic heading/nav structure, accessible CTA labels, native
     range semantics, visible timeline focus, reduced-motion handling,
     keyboard-capable context menu, and responsive portal cleanup.
   - Risk: an indefinitely auto-rotating carousel should expose an explicit
     pause/resume mechanism. Hover/focus pausing alone is not sufficient for
     every keyboard, touch, or assistive-technology user.
   - Small muted timeline/property text needs a numerical contrast check before
     claiming WCAG compliance.

## Prioritized fixes

### P1

- Add an explicit carousel pause/resume mechanism or otherwise stop automatic
  rotation after a finite sequence.

### P2

- Add the missing divider below List asset in both menu implementations.
- Preserve the menu's current outer height while adding it. A likely starting
  point is 23 px rows and 6 px vertical menu padding, followed by screenshot
  comparison.
- Expand the manifest copy track from 350 px to approximately 360 px.
- Make the source text/dot combination the initial carousel state: source copy
  with the second dot active.
- Move pagination up four pixels and the artwork up six pixels. A likely
  starting point is reducing the copy-to-pagination gap by four pixels and the
  artwork margin by two more pixels.

### P3

- Strengthen the pause bars slightly.
- Recheck panel/menu shadow density and the orb's apparent softness after the
  structural fixes.
- Recheck one-pixel vertical differences in the menu and demo card only after
  the third divider is present.

## Evidence limits

- The supplied design is a single desktop screenshot; no source mobile,
  hover, focus, open-dialog, or motion states were provided.
- Contrast ratios were not numerically measured.
- Raster antialiasing and JPEG browser capture can make subpixel font/shadow
  comparisons appear slightly softer. Layout and state findings above are
  based on stable rails and pixel runs, not blur alone.
