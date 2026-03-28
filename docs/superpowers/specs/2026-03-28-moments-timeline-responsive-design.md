# Moments Timeline Responsive Design

**Context**

The homepage `Moments` section uses `TimelineToggleSection` to render an expandable timeline. On desktop, each item is a two-column layout with the period on the left and the content on the right. When the viewport becomes narrow, that layout does not compress cleanly and the expanded timeline is not mobile-friendly.

**Goal**

Keep the existing desktop visual language, but make the expanded `Moments` timeline work on narrow screens. The mobile layout should feel like the desktop timeline tightened into a smaller width, not like a separate card list.

**Non-goals**

- No markup change to `TimelineToggleSection`
- No redesign of the desktop timeline
- No change to non-timeline history sections such as `Work` or `Education`
- No change to the toggle interaction itself

## Recommended Approach

Use CSS-only responsive overrides in `src/styles/global.css`.

At a mobile breakpoint, keep the timeline axis visible but compress the layout:

- Shrink the left column used for the timeline rail to a narrow fixed width
- Move the period label into the content column so it appears above the item body
- Keep the dot and vertical rail, but reposition them into the narrower left rail
- Keep images below the body copy and let them scale to the available width

This approach preserves the current Astro markup and minimizes risk. The existing timeline-specific selectors already attach the rail and dot to `.history-period`, so the safest change is to redefine placement at smaller widths rather than re-implement the component structure.

## Alternative Approaches Considered

### 1. Full one-column mobile rewrite with new pseudo-elements

Convert each timeline item into a single-column block and redraw the rail on the list item itself.

This offers more freedom, but it increases CSS complexity and diverges from the current structure. It is unnecessary for the current requirement.

### 2. Remove the timeline rail on mobile

Render the items as a simple stacked list on small screens.

This would be simpler, but it does not satisfy the desired outcome of keeping the desktop timeline feel.

## Component And File Impact

### Modify: `src/styles/global.css`

Add a mobile media query for the `toggle-section-timeline` variant:

- Override `.toggle-section-timeline .history-item`
- Override `.toggle-section-timeline .history-period`
- Ensure `.history-main` remains in the content column
- Constrain timeline images so they do not overflow narrow screens

### No change: `src/components/TimelineToggleSection.astro`

The current markup is sufficient for the responsive fix and should remain unchanged.

## Responsive Behavior

At desktop widths:

- Preserve the current two-column timeline layout
- Preserve the current axis and dot positioning

At narrow widths:

- Timeline items remain visually tied to a left-side rail
- Period text appears above the corresponding title/body content
- Content wraps naturally without horizontal crowding
- Images stay below the text and scale to the available width

## Edge Cases

- Long period strings must wrap or fit without colliding with the rail
- Long titles or descriptions must wrap without causing horizontal overflow
- Entries with no description should still align correctly
- Entries with images should keep consistent spacing after the text block
- The last item should still terminate the vertical rail cleanly

## Testing Strategy

Manual verification is sufficient for this change:

- Expand the `Moments` section on the Japanese homepage
- Verify the timeline at desktop width
- Verify the timeline at tablet width
- Verify the timeline at mobile widths around 390px and 320px
- Confirm there is no horizontal scrolling
- Confirm image-bearing entries remain readable and aligned

## Risks

- The mobile override could unintentionally affect shared `.history-*` styles if selectors are not scoped to `.toggle-section-timeline`
- Repositioning the rail via pseudo-elements may require small visual tuning after checking real content widths

## Acceptance Criteria

- Expanding `Moments` on mobile shows a readable timeline without overflow
- The mobile presentation still reads as the same timeline design as desktop
- Images remain inside the content width and stack below text
- Desktop `Moments` styling remains unchanged
