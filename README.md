# Tierarztpraxis Erhan Adigüzel

Static redesign of `tierarzt-eggenfelden.de`. The site has no build step and no third-party runtime dependencies.

## Preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Before publishing

- Confirm every service description with the practice owner.
- Add verified details only if desired: treated animal types, parking, accessibility, payment methods and team qualifications.
- Renew the expired TLS certificate and force HTTPS before launch.

## Google indexing after deployment

- Upload `robots.txt` and `sitemap.xml` to the domain's document root alongside all four HTML pages and their assets. The filename is `sitemap.xml`, not `sitemaps.xml`.
- The sitemap lists the homepage, gallery, imprint and privacy page. All four allow indexing and have canonical URLs under `https://www.tierarzt-eggenfelden.de/`. `robots.txt` allows crawling, including images, styles and scripts.
- Activate a valid SSL certificate in STRATO and permanently redirect HTTP and the non-`www` hostname to the matching HTTPS `www` URLs. Confirm the new pages, sitemap and robots file return successful responses without login protection or an `X-Robots-Tag: noindex` header.
- Verify ownership of `tierarzt-eggenfelden.de` in Google Search Console and submit `https://www.tierarzt-eggenfelden.de/sitemap.xml` under Sitemaps. Use URL Inspection to check the deployed homepage and gallery and request indexing.
- Add any new public pages to the sitemap and link to them from the website. Sitemap submission helps discovery but does not guarantee indexing, rankings or a specific timeline; see [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Files

- `index.html` — complete one-page website and structured local-business data
- `styles.css` — responsive design, scroll effects, accessibility states and legal-page styles
- `script.js` — navigation, live opening status and scroll animations
- `footer.js` — shared automatic copyright year on every page
- `gallery.html` — practice photo album with visible photographs and captions
- `gallery-page.css` — responsive album layout and image enlargement styles
- `gallery-page.js` — accessible image enlargement and legacy category links
- `assets/` — practice logo and locally optimized photography

## Shared header

The homepage and gallery use the same header classes in `styles.css` and load
`script.js` for the mobile menu, opening status and scroll effects. Gallery
navigation links point to the matching sections on `index.html`.

## Shared footer

All four HTML pages use the same static footer markup and the shared footer
styles in `styles.css`. Keep footer content changes in sync across `index.html`,
`gallery.html`, `impressum.html` and `datenschutz.html`. The footer stays visible
without JavaScript; `footer.js` only updates the copyright year.

## Adding gallery photos

Gallery photos are grouped into these folders:

- `assets/gallery/treatment/`
- `assets/gallery/outside/`
- `assets/gallery/eingangsbereich/`
- `assets/gallery/room/`
- `assets/gallery/diagnostics/`

After adding an image, duplicate an appropriate `figure.album-photo` in
`gallery.html`. Point both the image link and its image `src` at the new file,
set the image's actual `width` and `height`, and write a descriptive `alt`,
heading and caption. Keep `data-album-photo` on the link: the enlargement
controls read their order and captions directly from the HTML. Update the
visible photo numbers and the link's accessible label as needed.

The album has separate chapters for animal visitors, outdoor views, the entrance
and waiting area, rooms and treatments, and X-rays. The Milo X-rays appear next
to each other in before/after order. Chapter links provide shortcuts through the
album. Keep accented filenames unchanged and use their percent-encoded paths in
HTML. Each photo remains a
working image link without JavaScript. With JavaScript, photos open in a native
dialog with previous/next buttons and keyboard navigation. Existing
`?category=treatment`, `?category=room` and `?category=diagnostics` links scroll
to the relevant part of the album.
