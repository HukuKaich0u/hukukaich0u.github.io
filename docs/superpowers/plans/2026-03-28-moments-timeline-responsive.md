# Moments Timeline Responsive Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the expanded homepage `Moments` timeline readable on narrow screens while preserving the desktop timeline look and structure.

**Architecture:** Keep the existing Astro markup intact and implement the change entirely in `src/styles/global.css`. Add a mobile breakpoint scoped to `.toggle-section-timeline` that compresses the left rail, moves the period label above the entry body, and keeps images inside the content column without affecting other history lists.

**Tech Stack:** Astro 5, CSS, `bun run build` for verification

---

## Chunk 1: Responsive timeline CSS

### Task 1: Add mobile-specific timeline layout overrides

**Files:**
- Modify: `src/styles/global.css`
- Reference: `src/components/TimelineToggleSection.astro`
- Spec: `docs/superpowers/specs/2026-03-28-moments-timeline-responsive-design.md`

- [ ] **Step 1: Inspect the current timeline selectors that control desktop layout**

Review these selectors in `src/styles/global.css` before editing:

```css
.toggle-section-timeline .history-item
.toggle-section-timeline .history-period
.toggle-section-timeline .history-period::before
.toggle-section-timeline .history-period::after
.toggle-section-timeline .history-item:last-child .history-period::after
```

Expected outcome: Confirm that the current rail and dot are attached to `.history-period`, so the mobile change should stay scoped to the same selectors.

- [ ] **Step 2: Write the mobile media query for the timeline variant**

Add a scoped breakpoint near the existing history/timeline rules:

```css
@media (max-width: 640px) {
  .toggle-section-timeline .history-item {
    grid-template-columns: 1.1rem minmax(0, 1fr);
    column-gap: 0.95rem;
    row-gap: 0.18rem;
  }

  .toggle-section-timeline .history-period {
    grid-column: 2;
    padding-right: 0;
    padding-left: 0;
    white-space: normal;
    --timeline-axis-x: -0.95rem;
  }

  .toggle-section-timeline .history-main {
    grid-column: 2;
  }

  .toggle-section-timeline .history-period::before,
  .toggle-section-timeline .history-period::after {
    left: var(--timeline-axis-x);
  }
}
```

Implementation notes:
- Keep selectors scoped to `.toggle-section-timeline` so `Work` and `Education` remain unchanged.
- Use a narrow first column only as the visual rail gutter.
- Place both the period and the main content in column 2 so the mobile layout reads top-to-bottom.
- Allow the period label to wrap if needed instead of forcing overflow.

- [ ] **Step 3: Add narrow-screen image safeguards for timeline entries**

Extend the same media query so the image-bearing item stays inside the content width:

```css
@media (max-width: 640px) {
  .toggle-section-timeline .moment-image {
    width: 100%;
    max-width: min(100%, 420px);
    height: auto;
  }
}
```

Expected outcome: Image entries remain below the text and do not overflow the viewport.

- [ ] **Step 4: Tune the final-item rail ending for the mobile layout**

Adjust the existing last-item rule if needed after the new gutter positioning:

```css
@media (max-width: 640px) {
  .toggle-section-timeline .history-item:last-child .history-period::after {
    bottom: 0.15rem;
  }
}
```

Expected outcome: The final rail segment stops cleanly near the last mobile entry without extending too far below the content.

- [ ] **Step 5: Run the production build**

Run:

```bash
bun run build
```

Expected: Astro build completes successfully with no CSS parsing errors.

- [ ] **Step 6: Manually verify the responsive behavior**

Run:

```bash
bun run dev
```

Then verify in the browser:
- Open `/`
- Expand `Moments`
- Check desktop width to confirm no regression
- Check around `640px`, `390px`, and `320px`
- Confirm there is no horizontal scrolling
- Confirm the rail and dot still read as a timeline
- Confirm the `Progate x AWS Hackathon` image stays in bounds below the text

Expected: Mobile timeline remains readable and visually consistent with desktop.

- [ ] **Step 7: Commit the implementation**

Run:

```bash
git add src/styles/global.css
git commit -m "fix(ui): make moments timeline responsive"
```

Expected: A single commit containing only the responsive timeline styling change.
