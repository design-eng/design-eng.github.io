# Tactile landing page design QA

## Manifesto mobile poster peel — 2026-08-01

### Evidence

- Desktop interaction source: shared `PeelPosterCanvas` used by `HomePosterStack`.
- Mobile browser evidence: `artifacts/audits/manifesto-mobile-peel-2026-08-01/`.
- Viewport: 393 × 852 CSS pixels at device scale factor 1.
- States: expanded purple foreground before peel, completed peel with orange foreground, partial-peel rollback, and collapsed carousel after the completed cycle.

### Findings and implementation

- The expanded foreground card now uses the same Three.js shader, diagonal fold geometry, completion threshold, GSAP settlement, reverse animation, back-face paper treatment, and reduced-motion behavior as desktop.
- The touch surface mounts only when the divider is fully expanded. The flat carousel retains its horizontal swipe handler with no peel canvas mounted, preventing gesture competition.
- A completed peel rotates all four poster identities through the existing four stack slots, advances the selected poster, and remounts the peel canvas on the new foreground card.
- A short drag below the 0.42 completion threshold returns to the original foreground. Browser verification reported no lingering `.is-peeling` state after rollback.
- Collapsing the divider removes the peel canvas and preserves the cycled poster order in the flat row.

### Required fidelity surfaces

- Typography, colors, copy, card geometry, supplied poster rasters, rotations, divider endpoints, and pagination placement remain unchanged.
- The effect reuses the real desktop raster/shader pipeline; no replacement asset, CSS drawing, or approximate fold was introduced.
- Accessibility: poster buttons keep their labels and selected identity; reduced-motion behavior is inherited from the shared peel component. The WebGL canvas remains presentation-only.

### Engineering verification

- Full peel completion: passed; purple advanced to orange.
- Partial peel rollback: passed; orange remained selected and peeling state cleared.
- Flat-state gesture isolation: passed; peel canvas count changed from one expanded canvas to zero collapsed canvases.
- TypeScript/Vite production build: passed with Node 22.20.0.
- ESLint: passed.

final result: passed

## Manifesto cross-device responsive correction — 2026-08-01

### Evidence and normalization

- Source visual truth: the approved 393 × 852 raised and lowered manifesto references listed below.
- Browser-rendered evidence: `artifacts/audits/manifesto-cross-device-final-2026-08-01/`.
- All captures use device scale factor 1 and match their named CSS viewport.
- Tested states and boundaries: 375 × 667, 393 × 852, 448 × 998, 768 × 1024, 820 × 1180, 821 × 1180, 844 × 390, and 932 × 430. Mobile split layouts include both divider endpoints; desktop/landscape captures show the fixed editorial spread.

### Comparison history and fixes

1. Earlier [P2]: tall portrait viewports vertically centered the raised stack but left the flat four-card carousel pinned 39 px from the panel top, producing excessive empty space below it.
   - Fix: apply the same non-negative block offset to both poster endpoints while preserving each endpoint's internal deltas.
   - Post-fix evidence: 448 × 998, 768 × 1024, and 820 × 1180 lowered captures show the card row centered within the available poster panel; raised captures retain the stack-to-pagination rhythm.
2. Earlier [P1]: widths from 821–1120 inherited a generic one-column grid rule, moving the manifesto art pane below the fixed viewport. At short landscape heights, the poster stage was additionally translated above the viewport.
   - Fix: explicitly place the art pane in desktop grid column 2/row 1, restore the poster stage at 821–900 px, and add compact landscape scaling/vertical placement at heights up to 600 px.
   - Post-fix evidence: 821 × 1180, 844 × 390, and 932 × 430 captures all show the reading pane and full poster composition simultaneously.
3. Earlier [P2]: the fixed 0.7727 tablet scale was horizontally misaligned near the 821 px breakpoint, and `K10 PANEL`/copyright could clip inside the narrow desktop pane.
   - Fix: progressively translate the fixed poster composition across 821–1039 px, constrain the metadata row at 821–959 px, and allow the footer copy to wrap at 12 px in the narrowest desktop pane.
   - Post-fix evidence: the 821 × 1180 capture keeps the poster centered, `K10 PANEL` fully visible, and copyright contained.

### Required fidelity surfaces

- Typography: approved phone metrics are unchanged; narrow desktop metadata/footer sizing changes only where necessary to prevent clipping.
- Spacing/layout: both mobile poster endpoints center in extra portrait height; tablet and landscape desktop panes retain a stable 60.6/39.4 split with the art pane in the correct grid column.
- Colors/tokens: unchanged across all breakpoints.
- Image quality: exact supplied poster rasters remain in use; responsive behavior only transforms their existing stage.
- Copy/content: unchanged, with overflow corrections preserving all visible labels.
- Focused comparison: the poster panel, metadata row, and narrow desktop footer were inspected at native pixel density because these were the affected regions.

### Engineering verification

- Divider endpoint controls remain functional at every mobile viewport.
- TypeScript/Vite production build: passed with Node 22.20.0.
- ESLint: passed.
- No server-side behavior, routes, or assets were added.

final result: passed

## Manifesto larger-iPhone spacing correction — 2026-08-01

### Source and implementation evidence

- Source visual truth: the approved 393 × 852 raised and lowered manifesto references listed in `Manifesto mobile divider correction — 2026-08-01` below.
- Browser-rendered implementation folder: `artifacts/audits/manifesto-mobile-responsive-2026-08-01/`.
- Captured viewports, each at device scale factor 1:
  - iPhone 12 Pro regression: 390 × 844, raised and lowered.
  - iPhone 16 Pro: 402 × 874, raised and lowered.
  - iPhone 14/15 Pro Max: 430 × 932, raised and lowered.
  - iPhone 16 Pro Max: 440 × 956, raised and lowered.

### Findings and correction

1. Earlier [P2]: poster coordinates were fixed to the 393 × 852 source canvas. At 430–440 px, both compositions were left-biased; in the taller raised panel, the stack remained top-biased while the pagination stayed bottom-anchored, creating an oversized vertical gap.
   - Fix: added non-negative viewport-relative inline and block offsets. Wider devices center all four cards as a composition; taller devices move the raised stack and pagination together by half of the extra height. The 393 × 852 source remains the zero-offset reference.
   - Post-fix evidence: the 430 × 932 and 440 × 956 raised captures show equal visual side spacing and the original stack-to-pagination rhythm; their lowered captures show an evenly distributed four-card row.
2. Regression check: viewports at or below the approved reference size receive zero additional offset.
   - Post-fix evidence: the 390 × 844 captures retain the prior iPhone 12 Pro geometry, clipping, poster scale, and divider endpoints.

### Required fidelity surfaces

- Typography: unchanged; headline, metadata, and manifesto copy retain their existing font metrics and responsive wrapping.
- Spacing/layout: poster composition now centers progressively from 393 through 440 px; raised-state vertical spacing expands symmetrically instead of accumulating below the stack.
- Colors/tokens: unchanged.
- Image quality: exact supplied poster rasters remain in use at their existing sizes and rotations.
- Copy/content: unchanged.
- Interaction states: both keyboard divider endpoints were captured at every tested viewport; the same interpolation remains active between endpoints.

### Engineering verification

- TypeScript/Vite production build: passed with Node 22.20.0.
- ESLint: passed.
- No new assets, routes, or server-side behavior were introduced.

final result: passed

## Manifesto mobile divider correction — 2026-08-01

### Comparison target

- Raised stack reference: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-d92d8bf2-290b-46fa-9c86-cd7c864ae685.png`
- Lowered carousel reference: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-8ad752b1-8d26-4b5b-b5a3-a1d306694b01.png`
- Raised implementation: `artifacts/audits/manifesto-mobile-divider-final-2026-08-01/raised-final.png`
- Lowered implementation: `artifacts/audits/manifesto-mobile-divider-final-2026-08-01/lowered-final.png`

### Findings

- Corrected only the cyan poster's raised-state interpolation by moving its endpoint 10 px left and 15 px up.
- The raised cyan poster now matches the reference's top edge, right edge, lower edge, rotation, and overlap with the purple foreground poster.
- The lowered endpoint remains unchanged: four 96 × 136 px posters retain the source-aligned clipping, spacing, and vertical position.
- Header, copy crop, divider endpoints, rounded corners, drag handle, other poster transforms, and pagination remain aligned at 393 × 852.
- TypeScript/Vite production build and ESLint pass with Node 22.20.0.

final result: passed

## Comparison target

- Desktop source visual truth:
  `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-a5f1b5ff-8cc8-4fbb-8b35-cf1b1e1c9154.png`
- Mobile top source visual truth:
  `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-7641069c-cbba-4a86-bbbf-68c5f673d8ab.png`
- Mobile lower source visual truth:
  `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-ce8ddb4d-4a94-4db1-8de8-adbec340a905.png`
- Final desktop implementation:
  `/Users/trapintrovert/Desktop/universe/Node-UI/tactile-landing/artifacts/audits/mobile-home/desktop-final-reference-state.jpg`
- Final mobile top implementation:
  `/Users/trapintrovert/Desktop/universe/Node-UI/tactile-landing/artifacts/audits/mobile-home/mobile-final-top.jpg`
- Final mobile lower implementation:
  `/Users/trapintrovert/Desktop/universe/Node-UI/tactile-landing/artifacts/audits/mobile-home/mobile-final-lower.jpg`
- Preview:
  `http://127.0.0.1:4173/`

## Normalization and state

- Desktop source and implementation: 1440 × 1024 image pixels at a
  1440 × 1024 CSS-pixel viewport.
- Mobile top source and implementation: 393 × 852 image pixels at a
  393 × 852 CSS-pixel viewport.
- Mobile lower source and implementation: 393 × 969 image pixels at a
  393 × 969 CSS-pixel viewport, scrolled to the page end.
- Density normalization: 1 image pixel per CSS pixel for every comparison.
- Theme: light.
- Demonstration state: initial `.isMounted` property state, playing, showcase
  context menu visible.
- Manifest state: first highlight active in the mobile reference captures.
- Waitlist and mobile navigation menus: closed for visual comparison.

## Findings

No actionable P0, P1, or P2 differences remain.

- [P3] The supplied orb retains a marginally softer outer glow than the static
  source image.
  - Location: `.home-demo__orb`
  - Evidence: source and implementation use the same scale, placement, palette,
    and overlap order; the source screenshot has a slightly tighter glow edge.
  - Impact: visible only in a close focused comparison and does not change the
    composition or interaction.
  - Follow-up: keep the supplied asset unless a lossless source orb is provided.

## Required fidelity surfaces

- Fonts and typography: SF Pro Display is used for the brand and headline;
  Inter is used for body, navigation, buttons, and the showcase menu; Geist
  Mono is used for the commit status and every text element inside the
  demonstration panel. Weight, 32/38 mobile headline metrics, desktop wrapping,
  letter spacing, and small-label hierarchy match the references.
- Spacing and layout rhythm: the mobile page uses a 16 px edge rail, the exact
  hero/demo/manifest/art/footer order, and source-aligned vertical section gaps.
  At 393 × 852 the header is at x=16/y=25, the headline at x=16/y=164, actions
  at y=355, and the demonstration at y=503. At the lower capture the manifest
  is y=330, artwork y=638, and footer y=797. Desktop retains the 148 px left
  and 121 px right rails, manifest y=467, artwork y=731, and footer y=929.
- Colors and visual tokens: white background, #007AFF interaction blue,
  #777A82 commit text, neutral border/shadow values, status green, and menu
  selection blue align with the source. No unintended gradients or generic
  surface treatments were introduced.
- Image quality and asset fidelity: the supplied Tactile logo, pexels artwork,
  orb, playhead, and avatar assets are used directly. Their crop, aspect ratio,
  transparency, and z-index match the source. No image asset was replaced with
  CSS art, emoji, or a placeholder.
- Copy and content: headline, CTA labels, manifest title/link/copy, demonstration
  properties, context-menu rows, copyright, and mobile navigation labels match
  the supplied design and existing product language.
- Icons and surfaces: the mobile manifest arrow is 20 × 20 px, the panel and
  status radii/shadows match the reference, the pause mark has the source optical
  weight, and the context menu has all three source dividers.
- Responsiveness and accessibility: there is no horizontal overflow at 393 px;
  the mobile menu exposes its expanded state, closes with Escape, and uses
  semantic links/buttons. The waitlist dialog opens from the primary CTA and
  closes through its labelled control. Reduced-motion handling remains present.

## Full-view comparison evidence

- The desktop source and final implementation were opened together at
  1440 × 1024. Header rails, title wrap, CTA positions, manifest block,
  demonstration panel/menu, art crop, and footer align without an actionable
  mismatch.
- The mobile top source and final implementation were opened together at
  393 × 852. The four headline lines, stacked full-width CTAs, commit row, panel
  crop, property chips, timeline labels, and playhead align.
- The mobile lower source and final implementation were opened together at
  393 × 969 and scrollY=825. Panel/menu crop, manifest arrow and text rhythm,
  pagination, art, footer button, and copyright align.

## Focused region comparison evidence

- Demonstration: checked the 326 × 465 panel, 222 × 32 commit pill, 152 × 225
  menu, property rows, timeline labels, playhead/orb overlap, playback pill, and
  all three dividers at native pixel density.
- Manifest/footer: checked the mobile arrow bounding box at x=356/y=332 and
  20 × 20 px, the artwork at x=16/y=638 and 361 × 119.23 px, and the footer at
  x=16/y=797.23 and 361 × 106 px.
- Header/hero: checked the mobile logo/menu row, headline wrapping, and both CTA
  bounds at native density; no additional crop was needed because all details
  remain readable in the normalized full-view pair.

## Comparison history

1. Earlier finding: [P1] the responsive DOM order could not reproduce the source
   sequence, leaving the desktop-oriented left column ahead of the mobile
   demonstration.
   - Fix: converted the home content into named grid areas and set the mobile
     order to hero → demonstration → manifest → artwork.
   - Post-fix evidence: `mobile-final-top.jpg` and `mobile-final-lower.jpg`.
2. Earlier finding: [P2] the desktop grid's implicit row stretching moved the
   manifest about 18 px and the artwork about 35 px below the source after the
   mobile restructuring.
   - Fix: added source-measured desktop row tracks (310/273/234 px) with
     start-aligned grid content, while restoring auto rows below 900 px.
   - Post-fix evidence: `desktop-final-reference-state.jpg`; measured manifest
     y=467 and artwork y=731.
3. Earlier finding: [P2] the mobile-only manifest arrow leaked into the desktop
   label because a broader link selector overrode its hidden state.
   - Fix: increased the base hidden selector specificity and retained the
     matched mobile override.
   - Post-fix evidence: desktop arrow display is `none`; mobile arrow display is
     `grid` at 20 × 20 px.

## Interaction and engineering checks

- Mobile Menu: one trigger found; opens three actions, exposes
  `aria-expanded=true`, closes with Escape, and removes the popover.
- Waitlist: the visible primary CTA opens one dialog containing the expected
  form and the labelled close control removes it.
- Manifest carousel: continues to rotate automatically and retains manual
  indicator navigation and reduced-motion handling.
- Demonstration: continues to play and remains interactive; the real Radix
  context menu retains the same eight rows and three dividers as the showcase.
- Browser console: no runtime errors found.
- Layout: 393 px viewport reports a 393 px document scroll width.
- Engineering: TypeScript/Vite production build and ESLint pass with
  Node 22.20.0.

## Implementation checklist

- [x] Exact mobile content order and 16 px edge rail
- [x] Mobile header and functional Menu popover
- [x] Four-line mobile headline and stacked CTAs
- [x] Full mobile demonstration with source crop and overlay order
- [x] Mobile manifest arrow, copy, pagination, artwork, and footer
- [x] Desktop spacing regression corrected
- [x] Three demonstration-menu dividers retained
- [x] Responsive overflow, interactions, build, lint, and console verified

prior mobile/demo result: passed

## Poster-driven desktop extension — 2026-07-31

### Comparison targets

- Purple/sign-work state:
  `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-f9b84a67-eb57-4f7d-bd58-f8269132b02f.png`
- Orange/dreamers state:
  `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-1c66a871-f857-49c9-82e0-73bdfd0896ac.png`
- Blue/process state:
  `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-c43cff59-fbf2-4c4e-a9f3-d36f24e4bb0a.png`
- Green/demo state:
  `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-677e7b7b-bf26-4110-86cb-08e19f313b39.png`

### Implemented surfaces

- The desktop split is fixed at x=770 in the 1440 × 1024 target.
- Four supplied poster images occupy the source-measured slots. Purple uses its
  x=909/y=182 front slot and the source-matched x=922/y=239 inactive slot;
  activation otherwise changes stacking order without resizing the posters.
- Purple, orange, blue, and green poster states update the right pane and lower
  pexels artwork from a single controlled state.
- Poster selection supports pointer, Enter/Space, arrow, Home, and End keyboard
  behavior through a shared poster controller.
- Desktop primary CTAs use the supplied near-black treatment.
- The current mobile demo layout and its original lower artwork remain active
  at 900 px and below.
- The 4200 × 5950 poster masters remain untouched; production imports use new
  840 × 1190 derivatives.

### Engineering checks

- TypeScript project build: passed with Node 22.20.0.
- Vite production bundle: passed with Node 22.20.0.
- ESLint: passed.
- Original poster sources: approximately 41–42 MB each.
- Web poster derivatives: approximately 2.3–2.5 MB each.

### Poster-state comparison evidence

- Purple:
  `artifacts/audits/poster-home-plan-2026-07-31/captures/desktop-purple-final.png`
- Orange:
  `artifacts/audits/poster-home-plan-2026-07-31/captures/desktop-orange-final.png`
- Blue:
  `artifacts/audits/poster-home-plan-2026-07-31/captures/desktop-blue-final.png`
- Green:
  `artifacts/audits/poster-home-plan-2026-07-31/captures/desktop-green-final.png`
- Mobile top regression:
  `artifacts/audits/poster-home-plan-2026-07-31/captures/mobile-top-regression.png`
- Mobile lower regression:
  `artifacts/audits/poster-home-plan-2026-07-31/captures/mobile-lower-regression.png`

Each desktop implementation capture was opened together with its corresponding
1440 × 1024 source image. No actionable P0, P1, or P2 differences remain.

- Header identity is x=80/y=25; header actions are x=1031/y=25.5.
- Heading is x=87/y=155 and 600 × 144 px; hero actions begin at y=336.
- Manifest is x=87/y=467; its copy begins at x=239.
- Lower artwork is x=80/y=731 and 439 × 145 px.
- Footer action is x=1173/y=929; copyright begins at x=97.
- The document is exactly 1440 px wide with no horizontal overflow.
- Pointer selection updates the active poster, pane color, and pexels source
  together. Pointer activation leaves no focus artifact; keyboard activation
  retains a visible focus treatment.
- The mobile poster stage and desktop pexels image are hidden. At 393 px the
  original mobile artwork is x=16/y=638 and 361 × 119.23 px, the document is
  exactly 393 px wide, and the prior 393 px layout remains intact.
- Browser console errors and warnings: none.

### Comparison-history fixes

1. [P2] Pointer poster selection left a blue keyboard-focus outline around the
   active poster.
   - Fix: prevented mouse-down focus while preserving focus-visible behavior
     for keyboard navigation.
2. [P2] The desktop 145 px artwork height leaked into mobile and stretched the
   lower artwork by about 26 px.
   - Fix: restored intrinsic artwork height at 900 px and below.
3. [P2] Inactive purple stayed in its front slot and layered over orange.
   - Fix: added the 13 px/right and 57 px/down inactive offset and placed purple
     below orange in the stable non-active stack.

### Remaining P3

- The requested recolorable Tactile SVG has not been delivered yet. The
  implementation already exposes the active `--home-surface-color`, but the
  temporary opaque PNG hides that surface. Swap the SVG into the existing logo
  wrapper when it arrives; no layout or state-architecture change is required.

## Persistent poster handoff QA — 2026-07-31

### Target and evidence

- Source visual truth:
  `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-660df0d6-fe8e-4d5d-9aa5-047ce5fbc846.png`
- Pre-fix browser sequence:
  `artifacts/audits/poster-transition-shake-2026-07-31/06-transition-contact-sheet.png`
- Post-fix browser sequence:
  `artifacts/audits/poster-transition-static-rest-2026-07-31/08-before-after-contact-sheet.png`
- Post-fix individual captures:
  `artifacts/audits/poster-transition-static-rest-2026-07-31/01-before.png`
  through
  `artifacts/audits/poster-transition-static-rest-2026-07-31/05-settled.png`
- CSS viewport: 1200 × 369; full-page captures: 1200 × 1024.
- State: complete purple-to-orange pointer peel, immediate release,
  60/180 ms transition frames, and settled poster.

The source image targets the peel rather than the surrounding application.
Accordingly, the poster region in the combined contact sheet is the focused
comparison evidence. It is large enough to judge silhouette, artwork alignment,
stack continuity, and settlement.

### Required fidelity surfaces

- Fonts and typography: poster lettering remains in the supplied raster assets;
  application typography is unchanged.
- Spacing and layout: poster slots remain at their measured coordinates. The
  poster directly underneath now occupies its eventual active coordinates,
  including the purple poster at the end of the cycle.
- Colors and tokens: pane colors still crossfade over 200 ms; poster textures
  retain their original color without shader treatment while resting.
- Image quality: the resting and underlying posters now use the same optimized
  `<img>` rasterization. WebGL is visible only while the paper is deforming.
- Copy and content: no visible labels were added or changed. The live current
  poster announcement remains intact.

### Comparison history

1. [P1] The incoming poster shook when a stacked `<img>` was replaced by a
   newly mounted WebGL canvas.
   - Fix: removed both keyed remounts and kept the R3F canvas persistent.
2. [P1] A persistent canvas alone still produced a small rasterization snap
   between the inactive image and resting GPU plane.
   - Fix: made the optimized poster image the canonical resting surface and
     expose WebGL only while `progress > 0.001`.
   - Post-fix evidence: the incoming poster remains at the same coordinates
     before and after settlement; image matching finds a 0 px x/y positional
     offset.
3. [P1] The completion tail left a rigid white panel on screen.
   - Fix: translate the mesh offscreen from late progress and fade only the
     final completion tail, after the interactive white reverse has been shown.
4. [P2] Purple could jump when promoted because its inactive offset differed
   from its active slot.
   - Fix: the circularly next poster always uses its active slot before
     promotion.

### Interaction and engineering verification

- Complete pointer peel advances purple to orange.
- The active live-region text updates to
  `Current poster: We are here to help dreamers dream`.
- The resting incoming poster no longer swaps rendering surfaces.
- Persistent canvas remains mounted across active-poster changes.
- Reduced-motion behavior and keyboard advancement remain intact.
- Production build: passed.
- ESLint: passed.

### Remaining P3

- The late exit uses an art-directed opacity falloff rather than a physically
  simulated occlusion. It removes the distracting slab while keeping the
  interaction responsive.

final result: passed

---

## Compact waitlist popover — 2026-08-01

- Source visual truth: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-9957a88a-c4a3-45d4-8da6-83bbb7a4ec26.png`.
- State compared: `/manifesto`, light theme, waitlist open, `Maersk David` and `groupwork@tactile.so` entered, welcome bundle checked, email field focused.
- Desktop geometry at 1440 × 1024: card 420 × 283 at x558.14/y76; text fields 392 × 36; checkbox 16 × 16; submit action 392 × 32 at y311. The popover is centered on the desktop trigger with the reference caret and 19px trigger gap.
- Reference fidelity: compact white card, 15px radius, restrained shadow, centered title/description, blue focus ring, green valid-email mark, native blue checkbox, and black full-width action match the supplied state. The previous poster artwork, branding header, close pill, cancel action, blur, and tall modal treatment were removed.
- Responsive check: 393 × 852 renders a centered 365 × 283 dialog at x14 with no horizontal overflow; the caret is removed and a restrained scrim is added.
- Interaction check: controlled name/email fields, valid-email indicator, checked/unchecked bundle preference, local loading/success state, Escape/outside dismissal, and focus restoration are implemented. No network request or server integration is present.
- Accessibility: Radix dialog title/description and focus trap remain; fields have accessible labels, invalid fields expose `aria-invalid`, errors use an `aria-live` region, and the success confirmation uses `role=status`.
- Browser console errors: none at desktop or mobile target viewports.
- TypeScript project build: passed.
- Focused ESLint check: passed.
- Vite production build with the bundled supported Node runtime: passed; the existing bundle-size advisory remains non-blocking.

final result: passed

---

## Manifesto mobile split-screen recreation — 2026-08-01

### Comparison target

- Source visual truth:
  - `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-2e60bccd-3f52-4923-bb46-c6032870dee6.png`
  - `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-0e6cbef9-a10e-4f17-a115-22247e17ad62.png`
  - `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-4d7a02c9-a76f-47ee-bef8-532933b8f244.png`
  - `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-567d49e8-9c8a-4ffc-8c2f-f5ad0ade85cf.png`
- Browser-rendered implementation:
  - `design-qa-mobile-rest.png`
  - `design-qa-mobile-expanded.png`
  - `design-qa-mobile-stack.png`
  - `design-qa-mobile-scrolled.png`
- Combined comparison input: `design-qa-mobile-comparison.png`.
- Route and preview: `/manifesto` at `http://127.0.0.1:4173/manifesto`.

### Normalization and states

- All sources and browser captures are 393 × 852 image pixels at a 393 × 852 CSS-pixel viewport and device scale factor 1. No density normalization was required.
- Theme: light.
- States compared: 509 px reading panel at scroll top, 291 px reading panel with flat carousel, 291 px reading panel with the selected stack, and 509 px reading panel retaining its article scroll position.
- Reference and implementation were opened together in `design-qa-mobile-comparison.png`; each column places the source over its matching browser capture.

### Findings

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: the implementation uses the supplied SF Pro Display files. The title is locked to the reference's four lines at 32/37.76 px, metadata is 13/16 px, and body copy is 15.5/24 px. The first-line 47 px indent and full-width continuation lines reproduce the reference wrapping.
- Spacing and layout rhythm: the header is 97 px, reading states end at y606 and y388, the divider is 32 px, the handle is 37 × 6 px, and poster panels start at y638 and y420. Rest cards are 96 × 136 px; expanded cards are 183 × 260 px at x21/x230; dots settle at y778.
- Colors and visual tokens: white paper, #06070d divider, #141516 waitlist button, #777980 drag handle, #26262a active dot, and #d1d1d6 inactive dots match the visible reference palette.
- Image quality and asset fidelity: the exact Tactile mark, binder handle, and four existing 840 × 1190 poster rasters are used. No poster, logo, or decorative image was approximated with CSS art, SVG, emoji, or placeholders.
- Copy and content: title, date, panel label, waitlist copy, manifesto prose, and poster artwork match the source and existing product language.
- Accessibility and interaction: the divider supports pointer drag plus Home/End and ArrowUp/ArrowDown. The carousel supports touch swipe, direct poster selection, pagination, and a selected stacked composition. The waitlist CTA opens the existing labelled dialog and its labelled close control dismisses it.

### Full-view and focused evidence

- Full-view comparison confirms the fixed header, independent reading scroll, two panel heights, rounded corners, four-card tray, two-card carousel, centered stack, and pagination placement.
- Focused measurements were read from the rendered DOM at native density: header 393 × 97, reading panel 393 × 509 or 393 × 291, divider 393 × 32, and expanded poster panel 393 × 432. The same-size full captures keep the brand, headline, body baselines, card edges, and dots readable, so no additional rescaled crop was needed.

### Comparison history

1. Earlier [P1]: the previous mobile implementation had a two-row audio/theme header and an unrelated three-poster flipbook/detail view.
   - Fix: replaced it with the 97 px source header, draggable editorial split, and exact four supplied home poster assets while leaving desktop unchanged.
   - Post-fix evidence: `design-qa-mobile-rest.png` and `design-qa-mobile-expanded.png`.
2. Earlier [P2]: the first implementation pass used a permanent body grid column and automatic title wrapping, causing copy lines to diverge from the source.
   - Fix: added the mobile-specific four-line title, SF Pro body face, 47 px first-line indent, and full-width continuation lines.
   - Post-fix evidence: the rest capture reproduces the source's first four body lines and title baselines.
3. Earlier [P2]: the reading-state binder handle was missing and the stacked back cards were offset left/up.
   - Fix: mounted the real handle inside the scroll content so it leaves with the title, then source-aligned each stack card's x/y/rotation while retaining the purple front sheet at y478.
   - Post-fix evidence: `design-qa-mobile-rest.png` and `design-qa-mobile-stack.png`.
4. Follow-up [P2]: returning the divider to the reading state retained the expanded stack instead of restoring the four-card tray shown by the source.
   - Fix: scoped stack visibility to the combined expanded-and-stacked state; the resting panel now always restores its source tray without discarding the selected poster.
   - Post-fix evidence: `design-qa-mobile-scrolled.png`; the rendered stack is `display:none` and the tray remains visible.

### Browser and engineering verification

- Divider: keyboard transition settles at copy y97/h291, divider y388/h32, poster y420/h432; returning settles at copy h509 and poster y638/h214.
- Carousel: left swipe advanced `FRRR? product canvas` to `Take back the process`; pagination returned the selected poster and exited stack mode.
- Waitlist: one primary trigger opened one `Join our waitlist` dialog; the labelled close control dismissed it.
- Responsive checks: 360 × 800, 375 × 812, and 430 × 932 all reported document width equal to viewport width. Their resting copy/poster heights were 457/214, 469/214, and 509/294 respectively.
- Browser console errors and warnings: none.
- ESLint: passed.
- TypeScript and Vite production build: passed using the bundled supported Node runtime. The existing bundle-size advisory remains non-blocking.

### Follow-up polish

- None required for this mobile scope.

final result: passed

---

## Manifesto desktop correction — 2026-08-01

- Source visual truth: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-851ea829-30a5-44f0-94cc-7e7bc5ab557c.png`.
- Browser-rendered implementation: `artifacts/audits/manifesto-desktop-correction-2026-08-01/05-final-purple.png`.
- Full-view comparison: `artifacts/audits/manifesto-desktop-correction-2026-08-01/06-final-reference-comparison.png`.
- Focused stack comparison: `artifacts/audits/manifesto-desktop-correction-2026-08-01/07-final-stack-comparison.png`.
- Viewport and normalization: the 1689 × 3072 source was downsampled to its 563 × 1024 CSS target. The browser implementation was captured at a 1440 × 1024 CSS viewport with device scale factor 1, then cropped to the 563 × 1024 right-hand design canvas.
- State: `/manifesto`, desktop light theme, purple “Sign your work” poster active, reading pane at rest, and keyboard focus cleared for the visual comparison.

### Findings

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: the copyright retains the existing Inter family, 14 px size, normal weight, single-line wrap, and centered placement. All poster typography remains embedded in the exact supplied raster assets.
- Spacing and layout rhythm: the active poster is fixed at x97/y218 and 370 × 524 px inside the 563 × 1024 canvas. The green, blue, and orange sheets use the source-aligned background slots; the footer is y907.80/h18.20 and remains completely outside the stack.
- Colors and visual tokens: the normalized source background samples as RGB 242/230/248 and the browser capture as RGB 242/229/249, a maximum one-channel delta of 1 after capture conversion. Purple, orange, blue, and green state tokens remain paired with the poster controller.
- Image quality and asset fidelity: the shared home poster masters and existing peel canvas are reused directly. No poster was redrawn, approximated, or replaced. The direct 1:1 desktop stage avoids the previous parent-scale softness.
- Copy and content: copyright and manifesto copy are unchanged. The retained player and legacy poster components were not deleted.
- Accessibility and interaction: the stage keeps its keyboard controller and now exposes a 3 px focus-visible outline without leaking that outline into pointer/rest captures.

### Comparison history

1. Earlier [P1]: active poster identity changed the foreground slot, so advancing the stack moved and resized the primary poster instead of preserving the reference composition.
   - Fix: introduced one manifesto foreground slot and three distance-based background slots inside the shared `HomePosterStack`; poster identity now changes artwork and color, not foreground geometry.
   - Post-fix evidence: all four states measure x97/y218 and 370 × 524 px; `04-corrected-state-cycle.png` records purple, orange, blue, and green.
2. Earlier [P2]: the manifesto stage was parent-scaled at the 1440 × 1024 target, the lavender token captured too gray, and the stack competed with the copyright.
   - Fix: rendered the 563 × 1024 design canvas directly, tuned the source-sampled light token to `#f5e4fb`, aligned the three background slots, and raised the footer to a protected bottom offset.
   - Post-fix evidence: `06-final-reference-comparison.png`; captured background differs by at most one RGB value and the footer remains unobstructed.
3. Earlier [P2]: no keyboard focus treatment existed for the shared interactive poster stage.
   - Fix: added a theme-aware focus-visible outline to the active manifesto poster.
   - Post-fix evidence: keyboard activation reports a 3 px solid outline; pointer/rest state reports no outline.

### Browser and engineering verification

- Fixed-pane behavior: after Page Down, the left reading pane reached `scrollTop=1118.5` while the poster stage stayed at y=0 and the footer stayed at y=907.80.
- Poster interaction: purple → orange → blue → green → purple retained one active poster, one peel canvas, stable foreground bounds, and the paired background color.
- Shared-home regression: `/` retains four desktop posters, a 420 × 595 px active poster, one peel canvas, and no horizontal overflow.
- Runtime error check: no Vite error overlay appeared, and no console event was emitted during the keyboard state transition probe.
- `npm run lint`: passed.
- TypeScript project build: passed.
- Vite production build: passed; the existing bundle-size advisory remains non-blocking.

final result: passed

---

## Latest QA result — manifesto mobile — 2026-08-01

- Full findings and comparison history: `Manifesto mobile split-screen recreation — 2026-08-01` above.
- Source truth: the four 393 × 852 clipboard captures ending in `dee6.png`, `ad62.png`, `f244.png`, and `85cf.png` listed in that section.
- Browser evidence: `design-qa-mobile-rest.png`, `design-qa-mobile-expanded.png`, `design-qa-mobile-stack.png`, and `design-qa-mobile-scrolled.png`.
- Same-size combined comparison: `design-qa-mobile-comparison.png`.
- Viewport and normalization: 393 × 852 CSS pixels, device scale factor 1, 393 × 852 source and implementation pixels, no density conversion.
- State coverage: reading panel at both 509 px and 291 px heights, article scroll retained, flat carousel, selected poster stack, swipe advance, pagination, and waitlist dialog open/close.
- Focused evidence: native DOM measurements confirmed the 97 px header, y388/y606 reading boundaries, 32 px divider, y420/y638 poster boundaries, 183 × 260 expanded cards, and 96 × 136 tray cards.
- Required fidelity surfaces: typography, spacing, colors, supplied raster quality, and copy/content were checked against the combined image; no actionable P0/P1/P2 issue remains.
- Responsive evidence: no horizontal overflow at 360 × 800, 375 × 812, 393 × 852, or 430 × 932.
- Browser console errors and warnings: none. ESLint, TypeScript, and the Vite production build passed with the bundled supported Node runtime.

final result: passed

---

## Manifesto handle rail and footer clearance — 2026-08-01

- Source visual truth: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-bd4f6a7c-9957-4cd1-bf53-480bc27d4da0.png` and the pre-existing seven-handle rail implementation.
- Browser-rendered states: `artifacts/audits/manifesto-rail-footer-2026-08-01/01-rail-top.png`, `02-rail-scrolled.png`, and `03-short-height-footer.png`.
- At 1440 × 1024, all seven handle elements are displayed. Their measured top positions are 165, 537, 910, 1282, 1655, 2027, and 2399 px, so the rail continues with the manifesto copy instead of stopping after three handles.
- The left copy pane remains the sole scrolling surface: document scroll stays fixed while later handles and copy move through the viewport; the poster pane remains fixed.
- At the short desktop viewport of 1440 × 800, the poster bottom is 577.44 px and the copyright begins at 735.80 px, leaving 158 px of clear separation with no overlap.
- The manifesto continues to reuse `HomePosterStack`; poster interaction and the home implementation remain unchanged. The retained player and legacy poster components were not deleted.
- Browser console errors: none.
- `npm run build`: passed.
- `npm run lint`: passed.

final result: passed

---

## Manifesto editorial screen — 2026-08-01

- Source visual truth: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-bd4f6a7c-9957-4cd1-bf53-480bc27d4da0.png`.
- Browser-rendered implementation: `artifacts/manifesto-implementation-light.png`.
- Dark-theme evidence: `artifacts/manifesto-implementation-dark.png`.
- Full-view comparison: `artifacts/manifesto-reference-comparison.jpg`.
- Viewport and density: source and implementation are 1440 × 1024 pixels at a 1440 × 1024 CSS-pixel viewport and device scale factor 1; no density normalization was required.
- State: `/manifesto`, first poster active, light theme for the source comparison; dark theme captured separately.
- Findings: no actionable P0, P1, or P2 differences remain. The 60.6/39.4 split, title position and wrap, numbered reading grid, binder rail, poster geometry, sticky art page, and copyright placement align with the supplied reference.
- Fonts and typography: SF Pro Display supplies the reference-like headline and brand weight; the existing Inter body face is retained at 14/24 px to match line length and vertical rhythm. Metadata, numbering, capitalization, and copy hierarchy match the source.
- Spacing and layout rhythm: the content begins at x=196, body copy at x=270, and the art page at x=872. The front poster begins at approximately x=969/y=215. Header, metadata, rings, and footer remain aligned at the reference viewport.
- Colors and tokens: light mode uses white paper and `#f5e8fb` art paper. Dark mode uses `#1d1d1f` paper, `#342739` art paper, warm off-white copy, and subdued metadata while preserving poster colors.
- Image quality and asset fidelity: the supplied Tactile mark and existing home poster rasters are used directly; no placeholder or code-drawn artwork was introduced. Poster crops remain sharp and use their native aspect ratios.
- Copy and content: the reference headline, `JUNE 5, 2026`, `K10 PANEL`, waitlist label, and copyright line are present. Existing manifesto paragraphs remain intact.
- Interaction verification: theme switching updates and persists the selected theme; the waitlist CTA remains a semantic button connected to the existing modal; the interactive poster stack remains mounted. The `VinylPlayer` component, audio controller, state, assets, CSS, and mobile rendering were not removed.
- Browser console errors and warnings: none in the tested light and dark states.
- Build: `npm run build` passed with the bundled Node runtime.
- Focused comparison was not needed because the source and implementation are equal-density full-view captures and the important text, logo, poster edges, and controls are legible in the combined comparison.
- Follow-up P3: the explicit theme button is an intentional addition beside the reference CTA so users can inspect dark mode without changing their operating-system preference.

final result: passed

---

# Mobile homepage implementation — design QA — 2026-07-31

## Evidence and comparison

- Visual source: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-831c9104-e775-48a1-9ad3-c21adf42e882.png`.
- Browser viewport: 461 × 2048 CSS px, matching the supplied mobile reference proportions.
- The implementation matches the reference section sequence and full-width rhythm: white header/hero, lavender poster composition, manifest copy, selection artwork, footer CTA, and copyright.
- Mobile uses the exact supplied logo, four poster files, and `tactile-pexels.png`; no approximated or generated substitutes are used.

## Findings and fixes

- Replaced the interactive mobile demo with the reference-specific static four-poster composition. Desktop keeps the existing React Three Fiber peel untouched.
- Reordered and restyled mobile CTAs to match the source: black “Read our manifest” first, white “Join waitlist” second, both full width.
- Locked the mobile headline to the source's four-line wrap and aligned header, hero, section boundaries, poster scale, manifest spacing, artwork, and footer to the 461 px composition.
- The reference's second manifest slide is part of the existing looping carousel; browser testing confirmed the expected copy and active pagination state during rotation.
- No horizontal overflow remains: document width equals viewport width at 461 px.
- Desktop regression at 1440 × 1024 passed: animated headline remains active, the mobile poster section is hidden, and the Three.js/R3F canvas remains mounted.

## Verification

- `npm run build`: passed.
- `npm run lint`: passed.
- Mobile menu: opens and exposes manifest, Discord, and waitlist actions.
- Hero waitlist CTA: opens the correctly labelled waitlist dialog.
- Browser console errors: none. One existing Three.js `Clock` deprecation warning remains and is unrelated to this mobile layout.

final result: passed

## Poster-peel gap-fix QA — 2026-07-31

### Comparison target and evidence

- Source visual truth:
  `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-660df0d6-fe8e-4d5d-9aa5-047ce5fbc846.png`
- Browser-rendered white-reverse frame:
  `artifacts/audits/poster-peel-fix-2026-07-31/07-white-reverse.png`
- Browser-rendered completed release:
  `artifacts/audits/poster-peel-fix-2026-07-31/09-release-fixed.png`
- Browser-rendered settled next poster:
  `artifacts/audits/poster-peel-fix-2026-07-31/10-settled-fixed.png`
- Combined focused comparison:
  `artifacts/audits/poster-peel-fix-2026-07-31/16-reverse-comparison.png`
- CSS viewport: 1200 × 369; full-page implementation captures are
  1200 × 1024.
- Source pixels: 1278 × 1952. The source and implementation poster regions
  were normalized to a common 1000 px comparison height.
- State: left-edge pointer drag, return/release, completed peel, and settled
  next-poster state.

The source is a poster-focused composition rather than the full Tactile page,
so the focused poster comparison is the relevant visual evidence. The
surrounding page is intentionally excluded from fidelity judgments.

### Required fidelity surfaces

- Fonts and typography: all poster type remains embedded in the supplied
  raster artwork; the peel adds no synthetic display type.
- Spacing and layout rhythm: the active mesh remains exactly 420 × 595 px and
  preserves the existing measured stack positions.
- Colors and tokens: the front retains the source texture; the reverse is
  neutral white with softened curvature shading. Theme color still follows
  the active poster.
- Image quality: the optimized source poster textures render through WebGL at
  up to 2× DPR with anisotropic filtering.
- Copy and content: no visible instruction or label was added. The existing
  accessible gesture label and the new live poster-status announcement carry
  the interaction semantics.

### Comparison history and fixes

1. [P1] The poster revealed by the peel did not match the poster promoted after
   release.
   - Fix: derive inactive z-order from circular distance to the active index,
     placing the actual next poster directly below the active mesh.
   - Post-fix evidence: a fresh purple-to-orange browser drag settles on
     `Current poster: We are here to help dreamers dream`.
2. [P1] A valid drag could snap back because pointer-up read a stale React
   progress value.
   - Fix: added a synchronous progress ref shared by pointer movement, GSAP,
     and the release threshold.
   - Post-fix evidence: the same browser drag now completes reliably and
     advances the live region.
3. [P1] Late-release geometry became a rigid, full-height white panel.
   - Fix: grow the cylindrical fold radius late in the gesture so the sheet
     remains curved through exit; add free-edge bowing, rounded ends, bottom
     extension, and grab-height-driven depth.
4. [P2] Fold shading read as dark and metallic.
   - Fix: widened and softened the fold/contact shading and reduced maximum
     reverse-side contrast.
5. [P2] The peel had no discoverable resting affordance.
   - Fix: added a subtle left-edge hover lift without adding visible UI.
6. [P2] Reduced motion and current-poster state were implicit.
   - Fix: reduced-motion users receive immediate completion/snapback, and an
     `aria-live="polite"` status announces the active poster.

### Interaction and engineering verification

- Real pointer drag from the poster edge advances purple to orange.
- ArrowRight advances the same controller state and updates the live region.
- Canvas count is one on desktop; the existing 393 px test confirms zero
  canvases and zero horizontal overflow on mobile.
- Browser console errors: none. React Three Fiber emits only the known
  upstream Three.js `Clock` deprecation warning in development.
- Production build: passed.
- ESLint: passed.

### Remaining P3

- The fold is an art-directed mesh deformation, not a full cloth solver. Paper
  stiffness and edge waviness can be tuned further without changing the
  interaction architecture.

final result: passed

## React Three Fiber poster-peel QA — 2026-07-31

### Comparison target and normalization

- Source visual truth:
  `artifacts/audits/poster-peel-2026-07-31/00-reference.png`
- Final interaction capture:
  `artifacts/audits/poster-peel-2026-07-31/06-r3f-mid-peel-refined.png`
- Combined comparison input:
  `artifacts/audits/poster-peel-2026-07-31/07-side-by-side-comparison.png`
- Completed transition:
  `artifacts/audits/poster-peel-2026-07-31/08-r3f-complete-no-flash.png`
- CSS viewport: 1277 × 1024.
- Source pixels: 2554 × 2048 at 2×; normalized to 1277 × 1024.
- Implementation pixels: 1277 × 1024 at browser capture density.
- State: partial left-edge drag showing the white reverse and curved fold.

The supplied reference uses different poster artwork and a poster-focused page
crop. QA therefore treats the poster peel—not unrelated page copy—as the visual
target. The combined comparison is the full-view evidence; the poster region is
large enough in that comparison to serve as the focused-region evidence.

### Required fidelity surfaces

- Fonts and typography: no new type is rendered by the peel. Poster typography
  remains part of the supplied raster artwork and is not recreated in code.
- Spacing and layout: existing measured poster slots are unchanged. The mesh
  occupies the same 420 × 595 px active-poster box.
- Colors and tokens: the front uses the unmodified poster texture; the reverse
  is white with curvature-driven neutral shading. Existing theme synchronization
  remains controlled by the active poster.
- Image quality: the supplied optimized poster images are used as GPU textures
  at up to 2× device density. No replacement artwork or generated placeholder
  is used.
- Copy and content: no peel label or instructional badge is drawn over the
  poster. The article's accessible label describes the left-edge gesture.

### Interaction verification

- Pointer movement continuously drives a subdivided 72 × 96 mesh.
- Dragging begins from the left 34% of the active poster.
- The fold follows both pointer x and pointer y, producing the reference's
  diagonal edge.
- The front retains the poster texture and the reverse is explicitly white.
- Release before 42% returns the sheet with eased deceleration.
- Release after 42% completes the peel and advances the shared poster/theme
  state.
- All four poster textures preload; the first completed peel has no blank or
  wrong-poster frame.
- At 393 × 852, the desktop poster stage is hidden, the WebGL canvas is
  unmounted, and document overflow is 0 px.
- Clean browser load console errors: none.
- Production build and ESLint: passed.

### Comparison history

1. [P0] The page-flip library produced only a conventional top-right dog-ear.
   - Fix: replaced it with a custom React Three Fiber mesh deforming from the
     left edge.
   - Post-fix evidence: `06-r3f-mid-peel-refined.png` shows a long diagonal fold
     and broad white reverse.
2. [P1] The white reverse was only a small triangle.
   - Fix: added a double-sided shader with a white back material and a
     cylindrical-to-folded vertex deformation.
3. [P2] Pointer interaction exposed the blue keyboard focus box.
   - Fix: made the canvas non-focusable, removed its native outline, and blurs
     pointer-originated focus while preserving section keyboard focus behavior.
4. [P2] Switching to an uncached poster briefly exposed the poster underneath.
   - Fix: preload all four WebGL textures before the first interaction.
5. [P2] WebGL remained mounted under the CSS-hidden mobile stage.
   - Fix: mount the canvas only while the desktop media query matches.

### Remaining P3

- The shader curl is intentionally art-directed rather than cloth-physics
  driven. Additional tuning can alter fold radius and paper stiffness without
  changing the architecture.
- Three.js currently emits its upstream `Clock` deprecation warning through
  React Three Fiber during development; clean-page error logs remain empty.

final result: passed

## New-poster hover-reset regression QA — 2026-07-31

### Evidence

- Source visual truth:
  `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-660df0d6-fe8e-4d5d-9aa5-047ce5fbc846.png`
- Browser-rendered regression capture:
  `artifacts/audits/poster-hover-reset-2026-07-31/01-settled-cursor-still-inside.png`
- CSS viewport: 1200 × 369; full-page pixels: 1200 × 1024.
- State: completed purple-to-orange pointer peel, cursor left inside the new
  orange poster, then moved to its left edge without first leaving the poster.

### Required fidelity surfaces

- Typography and copy: unchanged; poster type remains part of the source
  raster and the live region announces the orange poster.
- Spacing and layout: the orange poster remains in its settled slot.
- Colors: the peach theme completes normally without exposing WebGL.
- Image quality: the optimized resting poster image remains the visible surface.
- Interaction: no autonomous reverse peel appears on the new poster.

### Regression finding and fix

1. [P1] A stationary mouse could revive the completed peel on the new poster.
   - Cause: `progressRef` retained the completed value `1.16`; the next hover
     tween animated backward from that stale value.
   - Fix: poster changes now kill the old tween, reset the internal progress to
     zero, clear hover state, and suppress hover until the pointer leaves or a
     deliberate pointer-down begins.
   - Post-fix browser evidence: after completion and an internal move to the
     new poster's left edge, `.home-poster-peel-surface` has no
     `is-rendering-peel` class and the canvas computed opacity remains `0`.
   - Direct dragging is not blocked; pointer-down explicitly clears the
     suppression.

### Verification

- Current poster: `We are here to help dreamers dream`.
- Canvas opacity after completion: `0`.
- Canvas opacity after moving within the new poster: `0`.
- Production build: passed.
- ESLint: passed.
- Browser console errors: none.

final result: passed

## Active-peel duplicate-layer regression QA — 2026-07-31

### Evidence

- Source visual truth:
  `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-660df0d6-fe8e-4d5d-9aa5-047ce5fbc846.png`
- Browser-rendered active peel:
  `artifacts/audits/poster-dedup-2026-07-31/01-active-peel-next-poster-visible.png`
- Combined focused comparison:
  `artifacts/audits/poster-dedup-2026-07-31/02-reference-comparison.png`
- CSS viewport: 1200 × 369; full-page pixels: 1200 × 1024.
- State: completed-threshold drag while the outgoing purple WebGL sheet is
  still visible and the orange poster is exposed underneath.

### Required fidelity surfaces

- Typography and copy: unchanged; all poster lettering remains embedded in
  the supplied raster assets.
- Spacing and layout: the exposed orange poster uses its final active slot.
- Colors: the outgoing sheet and incoming poster retain their intended colors.
- Image quality: one GPU-deformed outgoing texture is composited over one
  optimized incoming raster; no duplicate purple raster remains visible.
- Interaction: the stabilizing active image returns only after the peel ends.

### Regression finding and fix

1. [P1] The outgoing poster appeared twice during the peel.
   - Cause: the resting image introduced for settlement stability remained
     visible underneath the WebGL version of the same poster.
   - Fix: `.home-poster-active-image` now becomes transparent whenever the
     poster stage has `.is-peeling`. The next stacked poster is therefore the
     only sheet visible beneath the deforming canvas.
   - Post-fix browser evidence: during the active peel, stage peeling is `true`,
     canvas opacity is `1`, and resting active-image opacity is `0`.

### Verification

- Active peel reveals orange below purple; no duplicate outgoing artwork.
- Post-settlement hover suppression remains intact.
- Production build: passed.
- ESLint: passed.
- Browser console errors: none.

final result: passed

---

# Experience headline animation — design QA

## Evidence

- Source visual truth: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-580f0039-55a5-47a1-a385-3b83e0d4d2aa.png`
- Supporting motion states: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-43777a61-00f5-4c29-823a-b44128109c8c.png` and `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-c596d7a5-d5e7-44f4-9c0f-0f5a4c5b609e.png`
- Browser-rendered implementation: `artifacts/audits/experience-animation-final-1440-corrected.png`
- Full-view comparison: `artifacts/audits/experience-animation-final-comparison.jpg`
- Focused headline comparison: `artifacts/audits/experience-animation-focus-comparison.jpg`
- Mobile regression capture: `artifacts/audits/experience-animation-mobile.png`
- Viewport: 1440 × 1024 CSS px; device scale factor 1.
- Pixel dimensions: source 1440 × 1024; implementation 1440 × 1024. No density normalization required.
- State: animation settled 1.75 seconds after reload. Initial and intermediate states were also captured and inspected.

## Findings

- No actionable P0/P1/P2 differences remain.
- Fonts and typography: the existing SF Pro Display stack, 44 px desktop size, 48 px line height, weight, and three-line wrap match the source. The accessible DOM continues to contain the word “experience” while the decorative images remain hidden from assistive technology.
- Spacing and layout rhythm: the final tile group begins at approximately x249 and spans 158 px, closely matching the source. The corrected 10 px tile gaps and animated side breathing room restore the source wrap with “design” ending line one and “software:” beginning line two.
- Colors and visual tokens: the supplied blue, pale-green, and peach tiles match the reference palette and preserve the existing page colors.
- Image quality and asset fidelity: all three supplied raster assets render sharply at 46 × 46 px with the intended rounded masks. No placeholder, CSS-drawn, or emoji substitute is used.
- Copy and content: headline copy remains unchanged. Mobile retains the original four-line headline without the animated replacement.
- Motion: the word collapses, then watch, browser, and phone reveal right-to-left through a center-opening mask. The inline token and its margins interpolate continuously, avoiding abrupt layout jumps.

## Comparison history

1. First pass finding — P2: the tile group was packed too tightly, allowing “software:” to remain on line one and changing the source headline rhythm.
   - Fix: increased tile gaps from 6 px to 10 px, expanded the final group to 158 px, and animated 10 px left / 18 px right breathing room into the final state.
   - Post-fix evidence: `artifacts/audits/experience-animation-final-1440-corrected.png` and `artifacts/audits/experience-animation-focus-comparison.jpg` show the expected three-line wrap and source-aligned icon positions.

## Verification

- `npm run build`: passed with the bundled supported Node runtime.
- `npm run lint`: passed.
- Browser console errors: none on desktop or mobile.
- Primary behavior tested: initial word state, staggered reveal, settled icon state, desktop wrapping, mobile fallback, and horizontal overflow.
- Mobile viewport 390 × 844: desktop title hidden, mobile title visible, body scroll width equals viewport width.
- Reduced-motion behavior is implemented as an immediate settled state without a timeline.

## Follow-up polish

- None required for this scope.

## Replay timing refinement — 2026-07-31

- Browser evidence: `artifacts/audits/experience-animation-loop-final.png`, `artifacts/audits/experience-animation-loop-restored.png`, and `artifacts/audits/experience-animation-loop-second-cycle.png`.
- The forward transformation was slowed to a 1.1 second initial hold with 0.58–1.05 second word/layout transitions and 0.82 second tile reveals.
- The settled tile state now holds before a staggered retraction restores “experience”; the timeline then waits 1.6 seconds and repeats indefinitely.
- Browser state checks confirmed the initial word, completed tiles, restored word, and second completed cycle. Console errors: none.
- Reduced-motion remains intentionally static and does not loop.

## Vertical reveal correction — 2026-07-31

- Source mid-state: `artifacts/audits/experience-reveal-fix-2026-07-31/00-reference-mid.png`.
- Browser-rendered mid-state: `artifacts/audits/experience-reveal-fix-2026-07-31/01-fixed-mid-reveal.png`.
- Same-size comparison: `artifacts/audits/experience-reveal-fix-2026-07-31/04-reference-fixed-comparison.jpg` at a 1440 × 1024 CSS viewport, device scale factor 1; the compared hero crops are both 699 × 443 px.
- Earlier P1 finding: images emerged through a horizontal clip and opacity fade, producing vertical slabs rather than centered capsules.
- Fix: replaced horizontal `clip-path`/opacity animation with fixed-width, fully opaque wrappers whose height, top position, and radius animate vertically from 15 px capsules to 46 px rounded squares.
- Post-fix measured mid-state: phone 46 × 18 px, browser 46 × 42 px, watch 46 × 45 px, all vertically centered and opacity 1. This matches the reference’s pill → partial square → full square progression.
- Reverse-state evidence: `artifacts/audits/experience-reveal-fix-2026-07-31/05-fixed-reverse.png`; the loop now collapses vertically in phone → browser → watch order before restoring the word.
- Settled-state evidence: `artifacts/audits/experience-reveal-fix-2026-07-31/02-fixed-settled.png`; final spacing, wrapping, imagery, typography, colors, and copy remain unchanged.
- Mobile behavior and reduced-motion behavior remain unchanged. Browser console errors: none.
- Build and lint: passed.

## Accessible headline correction — 2026-07-31

- Earlier P2 finding: GSAP `autoAlpha` removed “experience” from the accessibility tree while the decorative replacement tiles were `aria-hidden`.
- Fix: added a static visually hidden desktop headline containing the complete sentence and marked the animated desktop presentation `aria-hidden="true"`. The static desktop accessibility copy is disabled at the mobile breakpoint so the visible mobile headline is announced only once.
- Desktop browser accessibility snapshot in the settled image state now exposes: “The true experience design software: precision for an era of guesswork. All in code, of course”.
- Mobile browser accessibility snapshot exposes the complete mobile headline once, with no duplicate desktop copy.
- Mobile horizontal overflow remains clear: body scroll width 390 px at a 390 px viewport.
- Desktop and mobile browser console errors: none.
- Build and lint: passed.

final result: passed

---

## Mobile audit fixes — 2026-07-31

- Same-size visual comparison: `artifacts/audits/mobile-accuracy-2026-07-31/09-reference-vs-fixed-corrected.png` at 461 × 2048 CSS px.
- Hero alignment now matches the source measurements: headline y159 and CTA group y376.
- The manifest slide viewport is fixed at 168 px on mobile. All four slides were selected in the browser and the artwork remained locked at y1593 for every state.
- The artwork and footer no longer jump as manifest copy rotates; footer begins at y1822, matching the source rhythm.
- Mobile controls retain their 38 px visual height while receiving a 44 px pointer target through a 3 px interaction inset.
- Waitlist modal close behavior now restores focus to the exact button that opened it. Browser verification confirmed the dialog unmounts and the hero trigger regains focus.
- Mobile document width equals the 461 px viewport with no horizontal overflow.
- Desktop regression at 1440 × 1024 passed: the R3F canvas remains mounted, the desktop animated headline is visible, and the mobile poster composition is hidden.
- `npm run build`: passed.
- `npm run lint`: passed.
- Browser console errors: none. The existing Three.js `Clock` deprecation warning remains unrelated.

final result: passed

---

## Mobile desktop-interaction parity — 2026-07-31

- Rest-state comparison: `artifacts/audits/mobile-interactions-2026-07-31/04-reference-vs-interactive-rest.png` at 461 × 2048 CSS px.
- Animated headline evidence: `artifacts/audits/mobile-interactions-2026-07-31/02-mobile-headline-tiles.png`.
- Completed peel evidence: `artifacts/audits/mobile-interactions-2026-07-31/03-mobile-next-poster.png`.
- The approved rest layout remains aligned: headline y159, CTA group y376, active poster y658, selection artwork y1593, and document width 461 px.
- The mobile headline now runs the desktop word-to-device-tile loop at a touch-appropriate 36 px tile scale. Measurements across word, tile, and restored states confirmed the CTA stays fixed at y376 without line-wrap or layout shift.
- Mobile uses the same R3F peel shader and white reverse side as desktop, mounted only at the mobile breakpoint.
- Partial drag verification: an under-threshold release returned the active poster to progress zero, kept the same poster active, hid the canvas, and preserved scroll y0.
- Completion verification: four consecutive peel gestures advanced purple → orange → blue → green → purple. Every state had exactly one active poster, no residual peeling class, and no scroll movement.
- The mobile touch surface uses `touch-action: pan-y`, preserving vertical page scrolling while allowing horizontal peel gestures from the left-edge grab zone.
- Poster promotion rotates assets through the four reference slots, preventing duplicate foreground copies and stale-pointer movement on the next poster.
- Accessibility: the animated mobile presentation is decorative; a static complete headline supplies the accessible name. The poster region provides live current-poster status and keyboard arrow navigation.
- Desktop regression at 1440 × 1024: one canvas only, desktop peel remains mounted, mobile stack is not mounted, and horizontal overflow is clear.
- Clean browser session: no runtime errors; only the existing Three.js `Clock` deprecation warning.
- `npm run build`: passed.
- `npm run lint`: passed.

final result: passed

---

## Manifesto fixed-pane and shared-poster correction — 2026-08-01

- Source visual truth: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-bd4f6a7c-9957-4cd1-bf53-480bc27d4da0.png`.
- Resting implementation: `artifacts/audits/manifesto-fixed-2026-08-01/01-fixed-start.png`.
- Scrolled implementation: `artifacts/audits/manifesto-fixed-2026-08-01/02-fixed-left-scrolled.png`.
- Same-state comparison: `artifacts/audits/manifesto-fixed-2026-08-01/03-reference-comparison.jpg`.
- Viewport and normalization: source and implementation are 1440 × 1024 pixels at a 1440 × 1024 CSS-pixel viewport and device scale factor 1.
- State: `/manifesto`, light theme, purple poster at rest. The left text pane was then scrolled independently by 760 px.
- Findings: no actionable P0/P1/P2 issues remain. The resting composition preserves the approved split, typography, poster scale, and footer placement. After scrolling, `window.scrollY` remains 0, the left pane reaches `scrollTop: 760`, and the right pane remains at `top: 0` with poster and copyright visible.
- Shared component verification: the manifesto mounts `HomePosterStack` with one live peel canvas. The obsolete editorial `PosterStack` variant is absent. Keyboard navigation advanced purple to orange and completed a full cycle back to purple with the same accessible labels and controller used on home.
- Fonts and typography: existing SF Pro Display and Inter treatments remain unchanged by the structural correction.
- Spacing and layout rhythm: the right pane remains viewport-bound while the complete left header, numbered copy, and signature form one independently scrolling reading surface.
- Colors and tokens: manifesto light and dark tokens are unchanged; the fixed-pane work introduces no palette drift.
- Image quality and asset fidelity: the exact home poster rasters and peel canvas are now reused rather than reconstructed through a second stack.
- Copy and content: no manifesto copy changed during this correction.
- Accessibility: the left reading pane is a labelled, keyboard-focusable region; the shared poster stage retains keyboard arrow navigation and its live current-poster announcement.
- Console: no errors. The existing Three.js `Clock` deprecation warning remains unrelated.
- `npm run build`: passed.
- `npm run lint`: passed.
- Follow-up P3: the theme button remains an intentional visible addition to the supplied reference.

final result: passed

---

## Responsive interaction parity corrections — 2026-07-31

- Mobile rest-state visual truth remains the approved 461 × 2048 comparison in `artifacts/audits/mobile-interactions-2026-07-31/04-reference-vs-interactive-rest.png`; the corrected tablet state is captured in `artifacts/audits/desktop-mobile-interaction-audit-2026-07-31/09-tablet-fixed.png`.
- Poster and peel-canvas geometry now share the source aspect ratio at every mobile width. Browser measurements were 270 × 382.5 px at 461 px and 228.42 × 323.59 px at 390 px, with canvas and poster bounds matching exactly and no horizontal overflow.
- Completing a peel now swaps only the active and incoming posters. The two background posters retain their slots and coordinates, eliminating the previous whole-stack teleport/shake.
- The newly active poster updates the complete mobile experience: foreground poster, poster-section color, and lower selection artwork all advance together. Purple uses the exact approved mobile artwork; orange, blue, and green use their corresponding themed assets.
- A single delayed discovery cue briefly lifts the peel edge, exposes the white reverse, and returns to rest. It cancels immediately on real input and does not replay after the user begins interacting.
- Touch interaction is now available through the tablet range (621–900 px). At 768 × 1024 the active poster measures 420 × 595 px inside a 720 px stage, one peel canvas is mounted, a completed drag advances the theme, and scroll remains at zero.
- Narrow-mobile completion was verified at 390 × 844: one active poster, one canvas, correct themed background, and no page-width overflow.
- Desktop regression at 1440 × 1024 passed: the tablet/mobile stack is absent, the existing desktop peel remains active, one canvas is mounted, and document width equals the viewport.
- Browser console errors: none. The existing Three.js `Clock` deprecation warning remains unrelated.
- `npm run build`: passed.
- `npm run lint`: passed.

final result: passed

---

## Mobile dark mode — 2026-07-31

- Source visual truth: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-ccb5c4e8-f59e-4fde-bc36-bd8c8d6b4b73.png`, with blue and green interaction states supplied alongside it.
- Browser-rendered implementation: `artifacts/audits/mobile-dark-mode-2026-07-31/03-purple-dark-final.jpg`.
- Full-view comparison: `artifacts/audits/mobile-dark-mode-2026-07-31/04-reference-vs-implementation.jpg`.
- Viewport and pixels: source 393 × 1746 px; implementation 393 × 1746 CSS px at device scale factor 1. No density normalization was required.
- State: mobile home, dark theme, purple poster at rest. Blue and green poster states were also exercised from the same browser session.
- Fonts and typography: the existing SF Pro Display/Inter treatment, hierarchy, weights, and wrapping are preserved. Dark mode changes color only; copy remains identical.
- Spacing and layout rhythm: reference-aligned measurements are heading y135, action group y319, poster field y469/h526, manifest y1073, artwork y1359, footer y1554, and document height 1746. No horizontal overflow at 393 px.
- Colors and tokens: browser-computed values match the supplied palette: page `#222326`, purple poster `#463251`, purple art/logo `#4c3458`, blue poster `#263c51`, green poster `#3c4f2e`, white primary CTA, and `#3e3f41` outlined controls.
- Image quality and asset fidelity: poster and logo assets are unchanged. Dark artwork variants preserve the supplied raster contents and replace only their flat background field; no CSS-drawn or placeholder asset was introduced.
- Copy and content: all visible text remains unchanged from the approved mobile page.
- Interaction states: purple → orange → blue → green advanced with exactly one active poster and one peel canvas. Poster field and dark artwork changed together, scroll remained at zero, and the dark waitlist dialog rendered with dark surfaces and inputs.
- Light-mode regression: direct browser verification restored the original white page, `#f8e7ff` purple field, original mobile artwork, one canvas, and 393 px document width.
- Browser console errors: none; the existing Three.js `Clock` deprecation warning remains unrelated.
- `npm run build`: passed.
- `npm run lint`: passed.

final result: passed

---

## Desktop dark mode — 2026-08-01

- Source visual truth: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-cb683e0e-a6d1-4d46-814b-167278a03e24.png`.
- Browser-rendered implementation: `artifacts/audits/desktop-dark-mode-2026-08-01/06-purple-dark-1440.jpg`.
- Same-state comparison: `artifacts/audits/desktop-dark-mode-2026-08-01/07-reference-vs-implementation-1440.jpg`.
- Viewport and normalization: the 3600 × 2560 source was normalized to its 1440 × 1024 CSS target; implementation capture is 1440 × 1024 at device scale factor 1.
- State: desktop home, dark theme, purple poster, manifest slide 2 of 4, headline in its word state.
- Findings: no actionable P0/P1/P2 differences remain. Split-pane geometry, headline wrap, buttons, manifest content, poster composition, interaction artwork, footer, and color balance align with the supplied reference.
- Fonts and typography: the existing SF Pro Display/Inter treatment, sizes, weights, line heights, and three-line headline wrap are preserved and match the reference.
- Spacing and layout rhythm: the 53.4722% split, header, hero, manifest, artwork, poster stack, and footer positions remain unchanged from the approved desktop layout.
- Colors and tokens: left pane `#222326`, purple right pane `#463251`, purple logo surface `#4c3458`, desktop artwork `#73637c`, white primary actions, `#3e3f41` secondary borders, white active pagination, and blue links match the source.
- Image quality and asset fidelity: poster and logo assets are unchanged. Four desktop artwork variants preserve every interaction pixel and replace only the original flat background; no placeholder or code-drawn replacement was introduced.
- Copy and content: all source copy remains unchanged.
- Interaction verification: purple → orange → blue → green updated pane, logo surface, and desktop artwork together with one active poster and one canvas. Scroll stayed at zero. The dark waitlist modal rendered with dark surfaces and light text.
- Responsive verification: mobile dark at 393 × 1746 retained the approved `#463251` poster field, dark mobile artwork, one active poster, and 1746 px document height. Tablet at 768 × 1024 rendered the dark page and poster field with one canvas and no horizontal overflow.
- Light-mode regression: desktop restored the white page, `#f8e7ff` pane, original desktop artwork, one canvas, and 1440/1800 px document widths at the tested viewports.
- Browser console errors: none; the existing Three.js `Clock` deprecation warning remains unrelated.
- `npm run build`: passed.
- `npm run lint`: passed.

final result: passed

---

## Manifesto poster pixel match and active color field — 2026-08-01

- Source visual truth: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-851ea829-30a5-44f0-94cc-7e7bc5ab557c.png`.
- Browser-rendered implementation: `artifacts/audits/manifesto-poster-pixel-2026-08-01/01-final-manifesto-1440x1024.png`.
- Full-view, same-state comparison: `artifacts/audits/manifesto-poster-pixel-2026-08-01/02-reference-vs-implementation.png`.
- Viewport and normalization: the 1689 × 3072 source is an isolated 3× poster pane and was normalized to 563 × 1024 CSS pixels. The implementation was captured at a 1440 × 1024 CSS viewport at device scale factor 1; its 567 × 1024 right pane was normalized to the same 563 × 1024 comparison size.
- State: `/manifesto`, light theme, purple “Sign your work” poster active, one peel canvas mounted, left reading pane at rest.
- Findings: the final combined comparison has no actionable P0/P1/P2 differences. The foreground poster is x97.32/y218.16 at 369.60 × 523.60 px; background poster top bounds are orange y240.23, blue y177.75, and green y132.80. Their crop, rotation, overlap order, and the copyright y911.80 position reproduce the source composition.
- Comparison history: the first comparison found manifesto-specific P2 drift in the background sheets and color field while the foreground poster size was already correct. The stack was shifted 12 px right, the blue and green sheets were raised and the green sheet enlarged to the source bounds, then orange and blue received final 2–4 px vertical refinements. The post-fix combined comparison is `02-reference-vs-implementation.png`.
- Fonts and typography: the copyright retains the existing Inter treatment and matches the reference size, weight, centering, line height, and single-line wrap. No poster typography was recreated; it remains embedded in the supplied raster assets.
- Spacing and layout rhythm: the source top breathing room, four-sheet overlap, pane-edge crops, foreground dimensions, lower empty field, and copyright baseline match after density normalization. The fixed right pane and independently scrolling left pane are unchanged.
- Colors and visual tokens: the sampled source lavender is implemented exactly as `#f5ecf9`. Keyboard poster changes update the pane through purple `#f5ecf9`, orange `#fff4ef`, blue `#d6f3fd`, and green `#f1fce6`; dark mode updates through `#463251`, `#563a34`, `#263c51`, and `#3c4f2e`.
- Image quality and asset fidelity: the exact shared home poster rasters and peel canvas remain in use. No replacement, redraw, placeholder, gradient, or CSS-generated poster art was introduced.
- Copy and content: copyright copy is unchanged and matches the source. No manifesto or poster copy changed.
- Interaction verification: Arrow Right cycled purple → orange → blue → green → purple. Each state retained one active poster and one canvas while the pane background changed to the paired light color; the complete dark-color cycle also passed.
- Shared-home regression: the home placement still renders purple at 420 × 595 px and green at 420 × 596 px with one canvas. Manifesto slot overrides do not leak into the home composition.
- Responsive regression: the prior 1440 × 800 short-height check remains valid because the active foreground scale and short-height vertical rules are unchanged; poster and copyright remain separated. The player and legacy poster components remain retained.
- Browser console errors: none. The existing Three.js `Clock` deprecation warning remains unrelated.
- Focused comparison: not required because the normalized right-pane comparison renders the poster typography, edges, rotations, raster texture, and copyright legibly at their CSS size.
- `npm run lint`: passed.
- TypeScript build and Vite production build with the bundled supported Node runtime: passed.

final result: passed

---

## Manifesto short-height desktop correction — 2026-08-01

- Source visual truth: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-851ea829-30a5-44f0-94cc-7e7bc5ab557c.png`.
- User-browser defect evidence: `/var/folders/n3/7z9z5fy15_l0605s6vmxv1000000gn/T/codex-clipboard-a56371d1-7470-4e7d-9696-8da5f8f0f14e.png`.
- Browser-rendered short-height implementation: `artifacts/audits/manifesto-browser-mismatch-2026-08-01/07-fixed-1440x860-blue.png`.
- Same-state before/after comparison: `artifacts/audits/manifesto-browser-mismatch-2026-08-01/08-before-after-1440x860-right-pane.png`.
- Original-height regression comparison: `artifacts/audits/manifesto-browser-mismatch-2026-08-01/10-reference-regression-comparison.png`.
- Viewports and normalization: the supplied user capture is 2880 × 1800 at 2× density, representing a 1440 × 900 browser window and an approximately 1440 × 860 CSS content viewport after browser chrome. It was cropped to the 1126 × 1720 physical-pixel right pane and normalized to 563 × 860. The implementation was captured at 1440 × 860 CSS pixels with device scale factor 1. The original visual truth is 1689 × 3072 and was normalized to its 563 × 1024 CSS target for the regression comparison.
- State: `/manifesto`, desktop light theme. Blue “Take back the process” is active for the short-height before/after comparison; purple “Sign your work” is active for the 1440 × 1024 source comparison.

### Findings

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: manifesto copy and copyright typography were not changed. The short-height correction affects only poster-canvas overflow behavior; wrapping, weights, line heights, and antialiasing remain unchanged.
- Spacing and layout rhythm: at 1440 × 860 the stage remains 563 × 1024 at x874.81/y0, the active poster remains 370 × 524 at y218, and the footer begins at y795.80. The complete background stack ends at y788.89, leaving 6.91 px of clear space before the copyright region. At 1440 × 1024 the prior y218 foreground and y907.80 footer positions remain unchanged.
- Colors and visual tokens: the active blue field and all existing light/dark tokens are unchanged.
- Image quality and asset fidelity: removing the parent scale restores the native CSS rendering of the exact shared raster assets. No asset was added, regenerated, redrawn, or replaced.
- Copy and content: manifesto copy, poster copy, and copyright remain unchanged. The player and legacy components remain retained.
- Accessibility and interaction: keyboard poster navigation no longer scrolls the clipped right pane. The stage stays at y0 and `stickyScrollTop` stays 0 after state changes; focus-visible styling is preserved.

### Comparison history

1. Earlier [P1]: the `max-height: 900px` desktop rule applied `translateY(-29px) scale(0.8182)`, shrinking the authored 370 × 524 poster to roughly 303 × 429 in the user's browser.
   - Fix: removed height-based transforms from the manifesto stage while retaining the responsive footer offsets.
   - Post-fix evidence: `08-before-after-1440x860-right-pane.png`; the active blue poster now measures 370 × 524 and the stage transform is `none`.
2. Follow-up [P2]: once the canvas remained full-size, focusing the 1024 px-tall interactive stage could programmatically scroll its 860 px-tall `overflow: hidden` container, moving the poster origin above y0.
   - Fix: changed the fixed poster viewport from `overflow: hidden` to `overflow: clip`, which clips without creating a scroll container.
   - Post-fix evidence: after two keyboard transitions at 1440 × 860, the stage remains y0, active poster remains y218, and `stickyScrollTop=0`.

### Browser and engineering verification

- Short-height target: 1440 × 860, blue active, one canvas, no horizontal overflow, no Vite error overlay, 6.91 px stack-to-footer clearance.
- Original-height regression: 1440 × 1024, purple active, stage 563 × 1024 at y0, foreground 370 × 524 at y218, footer y907.80, one canvas, and no horizontal overflow.
- Fixed-pane behavior: scrolling the copy pane to 1100 leaves the poster stage at y0, the footer at y795.80, and the poster viewport at `scrollTop=0`.
- Runtime console probe: no console event was emitted during the tested poster transition.
- `npm run lint`: passed.
- TypeScript project build: passed.
- Vite production build: passed; the existing bundle-size advisory remains non-blocking.

final result: passed

---

## Current handoff gate — manifesto mobile — 2026-08-01

The complete mobile report, source paths, four browser captures, normalized comparison, findings, focused measurements, comparison history, interaction checks, responsive checks, and engineering verification are recorded under `Manifesto mobile split-screen recreation — 2026-08-01`. The same-size combined evidence is `design-qa-mobile-comparison.png`; the tested viewport is 393 × 852 at device scale factor 1. No actionable P0/P1/P2 issue remains, browser console output is clean, and lint plus the supported-runtime production build pass.

final result: passed

---

## Waitlist fidelity correction — 2026-08-01

- Source: `artifacts/audits/waitlist-critical-comparison-2026-08-01/00-reference.png`.
- Final capture: `artifacts/audits/waitlist-critical-comparison-2026-08-01/02-fixed-implementation-1440x1024.png`.
- Scope: waitlist popover and its manifesto trigger; the existing theme control and current manifesto content were preserved.
- Desktop measurements: card x559.13/y76 at 420 × 283; title y104; description y129; fields x574.13 at y170/y216 and 392 × 36; checkbox x579.13/y267 and 16 × 16; submit x574.13/y311 and 392 × 32; trigger 130 × 34.
- Visual corrections: intro placement, asymmetric field inset, checkbox inset, title weight, copy gray, focus-ring softness, card elevation, and outlined trigger treatment now match the supplied reference.
- Responsive regression: 393 × 852 renders a centered 365 × 283 card at x14 with no horizontal overflow.
- Browser console errors: none at desktop or mobile target viewports.
- TypeScript, focused ESLint, and supported-runtime Vite production build: passed. The existing bundle-size advisory remains non-blocking.

final result: passed

---

## Manifesto mobile divider and poster motion — 2026-08-01

- References: `artifacts/audits/manifesto-mobile-divider-motion-2026-08-01/00-reference-raised-stack.png` and `01-reference-lowered-carousel.png`.
- Final captures: `02-raised-stack-393x852.png` and `03-lowered-carousel-393x852.png` in the same audit folder.
- Viewport: 393 × 852 with copy scrollTop 84 for both reference states.
- Raised endpoint: copy 291px, divider y388, poster panel y420, foreground x119/y478 at 173 × 245, pagination y775.
- Lowered endpoint: copy 509px, divider y606, poster panel y638, four 96 × 136 cards at x−15/94/203/312 and y677.
- Motion: one poster composition interpolates card size, position, rotation, panel geometry, and pagination opacity from a shared progress value. Duplicate stack markup and independent stack toggling were removed.
- Interaction: direct pointer tracking, velocity-aware endpoint settling, keyboard endpoint animation, active poster persistence, and reduced-motion handling are present. Copy scroll position remained stable across endpoint changes.
- Browser console errors: none.
- TypeScript, focused ESLint, and supported-runtime Vite production build: passed. The existing bundle-size advisory remains non-blocking.

final result: passed
