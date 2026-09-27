# DFCAM Portal — Phase 4 Manual Audit

## Purpose

This document summarizes everything reviewed so far and feeds directly into Phase 4 planning.

**Clear goal:** Make the DFCAMCLP portal genuinely good — not something that looks like AI-generated "vibe-coded" slop. Our motto: **functional, well-designed, and feature-complete enough that presenting this to actual professors and faculty admins for production approval is realistic.** The project should feel professionalized, as if built by senior IT developers in the region.

**Note:** This covers everything checked and reviewed so far. Some things may have been missed or overlooked — if there are recommendations that could help this project, they're welcome.

---

## 1. Login (Email & Password)

- Email field: add a placeholder/example (e.g. `name@example.com`).
- Password field: add a show/hide toggle using an eye icon.

---

## 2. Account Creation & Recovery

*(UI exists, but functionality is currently disabled.)*

### 2.1 Account Creation

- Anyone can apply, but we need a **basic idempotency check** to prevent one person from creating multiple applicant accounts. This doesn't need to be a full backend system — just a simple duplicate-prevention check.
- **Students** can be validated by staff using COR, COE, or other supporting documents.
- **Other roles** (non-applicant) should see a message like: *"Is this you? Please contact the admin to have your account created."*

### 2.1.1 Applicant Accounts

- Creating an account should immediately count as starting an application.
- Required info should mirror what a college normally requires from a new applicant: full personal details, birth certificate, ID photo, prior school records (report card, good moral certificate, etc.) from their SHS, and the program they're applying for.
- **Applications live under an annual cycle**, e.g. *DFCAT 2025*, *DFCAT 2026*, *DFCAT 2027*.
  - Example: DFCAT 2027 opens in **January 2027**. An applicant creates an account and can keep adding/updating documents up until **April**, when physical document submission is required. **May** is the exam period.
  - If an applicant's account/documents aren't complete by the deadline, the application is considered failed — they'd need to try again in the next cycle (e.g. 2028).
  - We don't need to build the full backend logic now — the goal is to design the UI around this flow so that if this becomes a full-stack build later, the backend foundation is already accounted for and can be implemented on top of it.

### 2.2 Account Recovery

- **Applicants:** easy self-recovery via email or another simple recovery method.
- **All other roles:** recovery requires submitting an admin ticket request.

---

## 3. Home Page

1. **Hero section:** Keep the school background and the two buttons, but:
   - Replace "Employees" with **"Workers."**
   - Remove the word "Integrated" — just **"Student & Workers Portal"** sounds cleaner and more modern.
2. **Button priority:** Swap the visual emphasis between "Portal Sign In" and "Explore Admissions" — Portal Sign In should be the more prominent/prioritized action.
3. **Quick Access section:** Remove it — we already have enough buttons covering these actions elsewhere.
4. **School description / identity:** Rewrite to answer the "what, who, where" style questions (e.g., something like *"for Las Piñas, a love for young people"*). Write this as flowing paragraphs, not bullet points — concise, not overly wordy. Research similar school "About" sections online for accuracy and tone.
5. **Programs & Admission Journey:**
   - Programs offered: display in a clean, quick **table format** — minimal text.
   - Admission journey: keep the current layout, but enhance it with scroll-based animations.
6. **"Explore the Portal" section:** Remove — this is redundant since we already have an "About" section in the nav.
7. **School brief history:** Present as a **timeline**, fitting into roughly 1–2 screens (1080p), with short descriptions per milestone. Research real articles related to the school's history for accuracy.
8. **Footer:** Make it more professional — consider adding a proper copyright line (e.g. `© [Year] DFCAM. All rights reserved.`), even though this is a demo. Open question: is that appropriate, or should we keep it simple? If not, a simple footer is fine.

---

## 4. Background Images

Add background images to homepage sections that need them — specifically the **history** section and the **school description** section (not needed everywhere). These can be AI-generated placeholders for now (e.g. via Codex), to be swapped later with real school photos when available.

---

## 5. Web Pages

*(Note: some issues/fixes found on one page may apply to other pages with the same pattern — apply fixes globally where relevant, even if not explicitly called out below.)*

### 5.1 `/applicant`
Functionality is solid. Suggestion: move the "demo scenario" selector out of the main field area — placing it near/in the sidebar would make it easier for users to compare and understand the different scenarios.

### 5.2 `/student`
Mostly fine as-is.
- We don't have the complete official subject list for every year/program yet — placeholder/fake data is fine for now.
- **Calendar section:** currently shows military (24-hour) time — switch to **12-hour AM/PM format** for now; can revisit formatting during the final design lock-in.
- **Grades section:** set the test student's standing to **3rd year, 2nd semester**, so grade history and past subjects are visible for testing.

### 5.3 `/academic`
Functionality is fine, with some navigation notes:
- It's easy to lose track of context — e.g., when inside the "Teaching" tab and opening a class, there's no clear indication of where you are.
  - **Fix:** Add a unique heading/title plus a short one-line description on each sub-view, so users always know where they are. This applies to the **Coordinator** and **Faculty** pages as well.
- Some buttons appear to be "floating" without clear affordance.
- The **Announcements** section's cards look bland/lifeless and need a visual refresh.

### 5.4 `/records`
- Add more filters: **Program**, **Year Level**, etc. (currently incomplete — e.g., only 2 programs exist in the data; likely built before `dfcamclp.md` was finalized).
- Add **advanced/multi-field search** — e.g. support an `||` (OR) operator so a single search box can match against multiple fields/details at once.

### 5.5 `/operations` and `/operations/facilities`
- Overall good. Main fix: make **ticket status colors** clearer and more standardized (e.g., green = okay, yellow = warning, red = urgent/issue).
- The admin-side `/operations` view is solid too — same general UI polish applies.

### 5.6 `/technology`
Good overall — needs general UI/UX polish and spacing adjustments in some areas.

### 5.7 `/technology` (Multitester)
Same as above — UI is fine, but consider surfacing more information in certain sections to make it more useful.

---

## 6. Design Lock-In (Applies Project-Wide)

Covers styling, spacing, fonts, coloring, and all UI/UX — the goal is for this to look like it was built by a top-tier senior design team. Open to references: similar websites, templates, or design systems — happy to help find examples or provide direction.

### 6.1 Styling
Modern, professional — not a generic school portal. Aim for the quality bar of a team including a senior graphics designer, senior full-stack developer, senior QA engineer, and senior systems engineer: high-end look and feel, while staying true to a school portal's purpose. Roughly a 50/50 balance between visual polish and functional design.

### 6.2 Spacing
More breathing room throughout — buttons, text, images, everything. Avoid cramped layouts, but also avoid unnecessary wordiness. If one short phrase communicates a section's purpose, that's enough.

### 6.3 Typography
Introduce **2–3 distinct fonts** (currently everything looks the same, which hurts visual hierarchy). Also fix text hierarchy issues — some text is currently sized incorrectly relative to its importance (too big/too small).

### 6.4 Coloring
Current color scheme is fine as-is.

### 6.5 UI Clarity

**6.5.1 — Clickable elements:**
Make buttons clearly identifiable as buttons across every page. Example: on the `/academic` dashboard, some floating colored text isn't obviously clickable.

**6.5.1 — Navigation context:** *(note: duplicate numbering in original — kept both points under the same heading)*
When navigating deep into a page with many child sections, it's easy to lose track of location. Add a unique heading/title and short one-line description per view for clarity (same fix as noted in Section 5.3).

**6.5.2 — List/table hierarchy:**
Apply a sensible default sort to every list/table — alphabetical, status, or urgency, depending on context. Add an explicit sorter control where useful, separate from filtering.

**Important — Navigation structure:**
Where a nested sidebar, collapsible submenu, or tree-view navigation would improve usability and reduce disorientation, implement it. Getting lost while navigating is a recurring issue worth solving directly.

### 6.6 UX Clarity
To be planned in detail later — covers scrolling behavior, hover states, transitions/effects, and overall interaction feel. Target reaction: *"This feels like it was built by a highly professional team and is worth hundreds of thousands of pesos in development."*

---

## 7. Bonus Items

### Placeholder Names (for testing/demo data)
Use these for test students and employees (add more as needed):
> Juan Dela Cruz, Maria Santos, John Paul Reyes, Jose Garcia, Angelica Bautista, Mark Ramos, Mary Grace Mendoza, Angelo Cruz, Princess Aquino, Michael Castro

*(Do not use "Marvin" as a placeholder name.)*

### Bug: Logo Click Logs User Out
When logged in and clicking the DFCAM logo, it redirects to the home page **and logs the user out** — even though the session should still be persisting. Using the browser's Back/Forward buttons doesn't recover the session either. Needs investigation — this looks like a session/routing bug rather than intended behavior.

### Profile Pictures
Allow users to upload a profile image, and present their profile in a polished, high-quality layout — not just a rough collection of fields.

### Missing Logo
The DFCAMCLP logo is missing from some pages — it should persist in the top-left corner across every page.