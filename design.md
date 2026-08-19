# design.md — Hackathon Team Matcher (PS-03)

This design system is built directly from the landing page UI prompt (video-background, dark, dot-matrix headline aesthetic). The landing page uses it exactly as specified below; inner app screens (dashboard, discover, profile, requests) extend the same tokens for consistency, without the full-bleed video treatment.

## 1. Reference Spec — Landing Page (source of truth)

**Type:** Single-viewport, full-bleed video-background landing page. Static HTML/CSS/vanilla JS on the marketing side (or React port using the same tokens for the actual app).

**Document title:** `Intelligence Designed To Evolve` (marketing framing — adapt copy for team matcher context, e.g. `Team Up. Build Something That Evolves.`)

**Body base:** `#000` background, `overflow: hidden`, `height: 100vh` / `100dvh`, antialiased text.

### Background video
Full-viewport cover video behind all UI:
```css
.bg-video {
  position: absolute; inset: 0;
  object-fit: cover;
  pointer-events: none;
  z-index: 0;
}
```
`.bg` wrapper: black `#000`, `position: absolute; inset: 0; overflow: hidden`.
(For the app itself, replace with a static dark background or a lighter looping loop clip — video is landing-page only, not used inside authenticated screens.)

## 2. Fonts

| Font | Use | Source |
|---|---|---|
| **Inter** (400/500/600) | UI text, body, nav, labels | Google Fonts: `family=Inter:wght@400;500;600&display=swap` |
| **BubbledotICG-FinePos** | Display / headline / stat glyphs (retro dot-matrix) | OnlineWebFonts CDN — see below |
| **Geist Pixel Circle** | Fallback display font | Local `fonts/GeistPixel-Circle.woff2`, weight 400, `font-display: swap` |
| **Font Awesome 6.5.2** | Brand/enterprise icons | cdnjs, with integrity hash |

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
<link href="https://db.onlinewebfonts.com/c/8cb707a9b8a73f8a7403336b861c3074?family=BubbledotICG-FinePos" rel="stylesheet" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
  integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" />
```

Font stacks:
```css
--font-sans: "Inter", "Segoe UI", system-ui, sans-serif;
--font-display: "BubbledotICG-FinePos", "Geist Pixel Circle", monospace;
```

## 3. Color Tokens (CSS variables — use across the whole app, not just landing)

```css
--bg: #000000;
--text: #ffffff;
--muted: #8e8e8e;
--nav-text: #2e2e2e;
--pill-dark: #28282a;
--sign-in-text: #c8c8c8;
--nav-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
--trust-bg: #28282a;
--trust-border: rgba(255, 255, 255, 0.4);
--trust-text: #c4c2c3;
```

**App-screen additions** (for Discover/Profile/Requests, kept in the same palette):
```css
--surface: #111111;         /* card backgrounds on dark app screens */
--surface-alt: #1a1a1a;
--border: rgba(255,255,255,0.08);
--success: #4ade80;         /* accepted request */
--warning: #fbbf24;         /* pending request */
--danger: #f87171;          /* declined request */
```

## 4. Layout — Landing Page (single viewport, 3 regions)

`.page`: flex column, centered, padding `clamp(16px, 2.4vh, 28px) clamp(14px, 3vw, 32px)`, `height: 100vh/100dvh`, `overflow: hidden`.

1. **Header** (shrink 0) — logo + nav pill + sign in
2. **Hero** (flex 1, centered) — trust row, headline, subhead, CTA
3. **Stats footer** (shrink 0) — 4-metric grid

All content `z-index: 1` above the video (`z-index: 0`).

### Header
- Logo: circular button `clamp(40px, 4.4vw, 46px)`, white bg `#fff`, `--nav-shadow`, icon scaled to 72% inside via CSS grid, hover `scale(1.04)`
- Nav pill: white `#fff`, height `clamp(44px, 5.2vw, 48px)`, max-width 430px, radius 999, links Home/Product/Case Studies/Contact — Inter 500, `clamp(13px, 1.4vw, 15px)`, `-0.01em` tracking, color `#2e2e2e`, opacity 0.5 default / 0.75 hover / 1 active, active indicator = 3 small dots via `::after`
- Sign in: dark pill `#28282a`, text `#c8c8c8`, hover bg `#323234` + text `#fff` + `translateY(-1px)`
- Entrance: `slideDown 0.7s cubic-bezier(0.22,1,0.36,1)`

### Hero
- **Trust row:** "Trusted by 2000+ Enterprises" — 3 overlapping avatar rings (`--trust-size: clamp(36px, 4.5vw, 42px)`, 34px ≤420px), dark ring `#28282a` + border + 5px padding + white inner circle + Font Awesome brand icon (black), overlap via negative margin, trust pill overlapping last avatar
- **Headline** (two lines, exact copy adapted to product):
  ```
  Line 1
  Line 2
  ```
  Font: BubbledotICG-FinePos / Geist Pixel Circle fallback, solid white, no gradient/shimmer. Desktop size `clamp(28px, 6.2vw, 80px)`, letter-spacing `-0.04em` (→ `-0.08em` ≤720px → `-0.09em` ≤420px), line-height 1.12. Per-line fade-in via `headlineFade 0.85s`, staggered delays (0.12s / 0.3s).
- **Subhead:** max-width `min(500px, 92%)`, color `#d0d0d0` at opacity 0.8, `clamp(15.5px, calc(1.55vw + 2pt), 18.5px)`, line-height 1.55.
- **CTA:** white pill, black text, Inter 600, glow `0 0 0 1px rgba(255,255,255,.15), 0 0 22px rgba(255,255,255,.32), 0 0 44px rgba(255,255,255,.12)`, hover lift + stronger glow, `revealPulse` entrance.

### Stats footer
4-col grid (2×2 ≤720px), max-width 920px. Icon (display font, white) → count-up value (Inter, tabular-nums) → muted label (`#8e8e8e`). Count-up via `easeOutCubic`, IntersectionObserver threshold 0.25, once.

Suggested stats for this product (replace the AI-infra metaphor with matcher-relevant ones):
| Icon | Value | Label |
|---|---|---|
| `<` | e.g. 500 | Students Matched |
| `%` | e.g. 92.00% | Match Satisfaction |
| `*` | e.g. 24/7 | Live Matching |
| `#` | e.g. 1.2K | Teams Formed |

## 5. Shared entrance animation
```css
.anim { opacity: 0; transform: translateY(22px) scale(0.98); filter: blur(6px); }
.anim { animation: reveal 0.85s cubic-bezier(0.22,1,0.36,1) forwards; animation-delay: var(--d); }
```
Respect `prefers-reduced-motion: reduce` — kill animation, show final state, headline stays solid white.

## 6. Mobile (≤720px)
- Hide desktop nav + sign in; header becomes space-between with logo (48×48) + circular burger (48×48, `#28282a`, 3 white bars)
- Burger open → white circle, bars morph to black X
- Overlay: fixed, `rgba(0,0,0,0.62)`, blur 6px
- White sheet menu, radius 28px, staggered link-in animation, three-dot active indicator
- Stats collapse to 2 columns
- ≤420px: tighter headline/trust sizing; ≤700px height: tighten hero vertical spacing

## 7. Extending this system to app screens (Discover / Profile / Requests / My Team)

Keep it consistent, not a re-skin:
- Same dark base (`--bg: #000` or `--surface: #111` for cards), same Inter body font
- Reserve **BubbledotICG-FinePos** for headings/section titles and key stats only (compatibility % badge is a great place to use the display font) — never for body copy or form labels, it's not readable at small sizes
- Cards (student profile cards, team cards) use `--surface` bg, `--border` outline, `--nav-shadow`-style soft shadow, radius ~16–20px (slightly less rounded than the pill/circle landing elements, to read as "content," not "chrome")
- Buttons: primary = white pill + black text (same as CTA); secondary = dark pill `#28282a` (same as Sign in)
- Compatibility score badge: circular or pill, white bg, black BubbledotICG-FinePos numeral, small glow like the CTA for high scores (>80%)
- Status colors (`--success` / `--warning` / `--danger`) only for request status chips — nowhere else, to keep the palette disciplined

## 8. Assets checklist
- `assets/logo.webp`
- `fonts/GeistPixel-Circle.woff2`
- Background video: exact CloudFront URL from the landing prompt (landing page only)
- Font Awesome brand icons (Microsoft/Amazon/Google or swap for relevant hackathon sponsor logos if applicable)
