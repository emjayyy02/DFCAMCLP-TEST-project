---
name: anti-vibecoded-ui
description: Audit, design, or improve web and app UI so it feels product-specific rather than generically AI-generated. Use for UI/UX implementation, redesign, polish, or visual review where recurring "vibecoded" patterns should be avoided without blindly banning valid design techniques.
license: MIT
metadata:
  author: yasircs4
  repository: https://github.com/yasircs4/anti-vibecoded-ui
---

# Anti-Vibecoded UI

Treat the checklist below as risk signals, not universal prohibitions. A gradient, card, icon set, or animation is acceptable when it follows the product's brand, content, task, and established design system. Remove or replace a pattern only when it is an unconsidered default, harms usability, or makes the interface feel interchangeable with unrelated products.

## Design standard

- Start from the user's primary task, real content, existing product conventions, and target platforms or viewports.
- Establish a coherent visual direction and reusable tokens for typography, color, spacing, radius, elevation, and motion.
- Prefer information hierarchy and task flow over decorative novelty.
- Keep semantics, accessibility, responsiveness, localization, performance, and maintainability intact.
- For an audit-only request, report evidence-backed findings and stop before implementation.
- For implementation, inspect the rendered result at representative sizes and test relevant loading, empty, error, disabled, focus, hover, and reduced-motion states.

## Twenty risk signals

Check whether the interface relies on any of these as defaults:

1. Purple-to-blue gradients without a brand or content reason.
2. Gradient hero text used as a substitute for hierarchy.
3. Emojis in headings that do not match the product voice.
4. Inter everywhere without considering the brand, language, or reading context.
5. Colored borders used to differentiate otherwise identical cards.
6. Glassmorphism cards that weaken legibility or structure.
7. Low-contrast dark mode.
8. A compulsory row of three generic icon feature boxes.
9. A decorative badge above every headline.
10. Lucide icons everywhere, including where text or a product-specific symbol is clearer.
11. Untouched shadcn UI or another component library with default tokens and composition.
12. Repetitive fade-in-on-scroll animation.
13. Cursor-following beams or spotlights unrelated to the task.
14. Buttons that fade or lose contrast on hover.
15. Inconsistent spacing without a deliberate scale.
16. Em dashes used so often that copy develops a synthetic rhythm.
17. Generic buzzword copy that could describe any product.
18. Serif italic accents added as a fashionable flourish rather than a meaningful voice.
19. Space Grotesk paired with Instrument Serif by default.
20. Grain laid over a gradient without a visual or narrative purpose.

## Response to a finding

For each relevant signal:

1. Point to the concrete component, screen, selector, or screenshot region.
2. Explain the user or brand impact; do not call something bad merely because it appears on the list.
3. Keep it when it is intentional and effective, or replace it with a solution derived from the product's content and design system.
4. Check the change in context so fixing one pattern does not create weaker hierarchy, accessibility, or consistency elsewhere.

## Completion bar

The result should have clear task hierarchy, concrete product-specific copy, consistent tokens, accessible contrast and interaction states, responsive behavior, and no unexplained reliance on the twenty signals. Call the work verified only after inspecting the closest real rendered runtime; otherwise state that verification remains pending.
