---
name: modern-web-architect
description: Guides Claude to build high-craft, non-generic modern web applications using React, Tailwind CSS, and intentional design systems.
---

# Modern Web App Design Instructions

When asked to design or build a web application, you must follow these core principles:

## 1. Aesthetic Direction (Anti-"AI Slop")
- NEVER use the default corporate gradient (purple-to-indigo mesh with generic rounded cards and floating blobs).
- Choose a distinct visual persona before writing code: 
  - *Option A:* Swiss Editorial / Brutalist (sharp borders, high-contrast monospace accents, exposed grids).
  - *Option B:* Calm / Tactile (soft stone/slate backgrounds, subtle shadows, grounded spacing).
  - *Option C:* High-Density SaaS (crisp 1px borders, compact data hierarchies, clear keyboard-first states).
- Establish a strict 60-30-10 color rule (dominant background, secondary surface/text, high-impact accent).

## 2. Typography & Hierarchy
- Pair a clean sans-serif (e.g., Inter, Plus Jakarta Sans, or Geist) with a distinct display or mono font for technical metadata.
- Enforce strict scale steps (`clamp()` for fluid headings).
- Maintain line lengths between 60ch–75ch for body copy.

## 3. Component & Layout Rules
- Avoid empty, oversized hero sections with generic stock-photo placeholders. Use live interactive UI previews, data tables, or functional code/inputs instead.
- Use responsive CSS Grid and Flexbox with intentional whitespace (at least 25% of the viewport should breathe).
- Implement micro-interactions (hover states, active focus rings, smooth transitions) using Tailwind or CSS transitions.

## 4. Output Requirements
- Provide clean, modular, production-ready code.
- Explain your rationale for color, layout, and typography choices before rendering the final artifact.
