# One Stop Physiotherapy (OSP) website: mock-up

A static mock-up for client review. There are 16 pages: plain HTML, CSS and JavaScript, with no framework.

## Editing

The pages are generated. Edit the sources, then rebuild:

- `src/pages/*.html`: the content of each page. The first line is a JSON header with the title, description and nav key.
- `src/layout.html`: the shared head, header, menu and footer.
- `src/cta.html`: the "Book your assessment" band that closes every inner page.
- `assets/css/site.css`, `assets/js/site.js`: styles and behaviour.

Rebuild:

```bash
node build.mjs
```

This writes the finished pages to the project root. GitHub Pages can serve the root as it is.

Preview locally:

```bash
python -m http.server 5173
```

## Design

Clean medical style in the OSP brand palette (logo teal, deep teal, soft teal tints): rounded cards, pill buttons with icons, Plus Jakarta Sans for headings and Inter for body text. One left-aligned 1200px grid on every page.

The home page has one interactive feature: the "Where does it hurt?" body map.

## Before launch: content to confirm or replace

Every item marked with a yellow label on the site needs input from OSP:

- Hajar D'zohir's portrait photo, plus both founders' messages (the current text is a sample)
- Team names, photos and qualifications
- The "How OSP grew" timeline dates
- Physiotherapy price ranges, the sports massage price, payment methods, panel and insurance coverage
- The home physio coverage area and travel fee, and the student rate
- Patient reviews (copied with permission)
- Careers positions
- A legal check of the privacy notice and policies
- Opening hours (currently Saturday to Thursday, 9am to 6pm, closed Friday)
- The original logo file (the current mark is a redrawn approximation)

## Images

- Clinic photos are crops of OSP's own TikTok video covers and of the client's posters.
- The founder photo comes from Zhafri Zakaria's public Facebook profile.
- `assets/img/rehab-walk.jpg` was supplied by the client, but it looks AI-generated. Replace it with a real photo.
- Two archive photos are used under CC BY-SA and credited in the footer and on `legal.html`. The details are in `assets/credits.json`.
