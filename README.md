# RaddiBook — explainer site

A standalone marketing/explainer page for **RaddiBook**, the scrap-buying book
for kabadiwala and small scrap dealers.

> **Weigh it. Pay it. Know your margin.** — pricing on discovery, subscription basis

This is *not* the product UI. It is a polished, self-contained landing page that
makes the idea instantly clear to a non-technical scrap dealer and to an investor
skimming for 30 seconds.

## What the product does

Buying scrap is a solved sum — weight × rate, cash in hand. The leak is in the
middle: the stock sitting in the godown and the margin between what you paid and
what the big dealer paid you. RaddiBook keeps that book:

- **Weight × rate purchases** — line items by category, each weighed at its own rate.
- **Cash payout slips** — a numbered PAY-YYYYMMDD-NNNN slip + a WhatsApp receipt.
- **Stock by category** — on-hand kg and value, derived as purchased − sold.
- **Weighted-average buy rate** — stock valued at what it actually cost you.
- **Resale margin** — every dealer sale priced against average cost (green/red).
- **Dashboard** — today's payouts, stock by category, this month's sales & margin.

Categories: paper, cardboard, plastic, iron, glass, e-waste.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup — all sections, inline SVG only. |
| `styles.css` | All styling. Palette built around the burnt-amber accent `#b45309`. |
| `app.js` | Sticky-nav highlight, smooth scroll, and the animated hero "weigh-slip" that totals itself as the plastic is weighed in. No dependencies. |
| `favicon.svg` | Scrap-book mark. |

## Design notes

- Palette: burnt-amber accent `#b45309`, deep kraft-brown ink, warm kraft paper,
  a muted sand tint, an olive green for resale gain and a deep rust for loss.
- **Signature:** money and weights are always set in tabular monospace, so the
  whole page reads like a weigh-slip ledger (the kabadiwala's book). The hero
  widget is a live payout slip: the plastic line is weighed in, the amount fills,
  and the cash-to-pay total ticks up until the slip is printed.
- Fully self-contained: no CDNs, no external fonts, images or scripts. System
  font stack only. Renders correctly opened as a local `file://` and deploys to
  any static host unchanged.
- Responsive down to mobile with no horizontal page scroll; the wide stock table
  scrolls inside its own container.
- Respects `prefers-reduced-motion` (the hero animation freezes on its end-state).

## Run it

Just open `index.html` in a browser. No build step. To serve locally:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Upload the folder to any static host (Netlify, Cloudflare Pages, GitHub Pages,
S3). This repo ships a GitHub Actions workflow (`.github/workflows/deploy-pages.yml`)
that publishes to GitHub Pages on every push to `main`. No configuration required.

---

A **KARYA** studio build · sreeni.nintendo@gmail.com
