# Strata Publishing Co — Shed inspired rebuild map

Status: first executable static build lives in `site/`. Current root `index.html` remains preserved as live baseline. `blueprint/` holds typed contracts and query shapes for the CMS-backed build.

## Reference and boundary

The Shed reference suggests an image led, program led cultural site: large campaign media, clear editorial hierarchy, browseable programs, concise global navigation, contextual calls to action, and strong mobile behavior. Its designer describes a journey based on visitor context, mobile menus, calendar, and related editorial content. Direct homepage inspection was blocked by Queue-it on 2026-09-25, so exact current animation, colors, type, and breakpoints need a browser check before visual implementation. Sources: https://www.theshed.org/ ; https://www.theshed.org/calendar ; https://d3f1fx6enveicv.cloudfront.net/projects/86-the-shed-website

Borrow experience principles, not Shed identity, imagery, copy, or ticketing. Strata is a publishing house, not a venue. Translate program → publication/property/campaign; ticket CTA → read/subscribe/contact; visit mode → reader/investor/partner paths. No mock events or fake real time feed.

## Product decisions

- House identity remains distinct from STRATA-AF™. Canonical parent tokens in `../assets/tokens/strata-tokens.json`: warm dark canvas, bone text, terracotta accent, Bricolage/Spline/JetBrains. Shed influence comes through scale, media, rhythm, navigation, and transitions. Resolve conflicting old `index.html` colors/fonts against canonical tokens.
- Homepage sections: immersive featured story/campaign; latest from the desk; properties; editorial and research capabilities; house story; contact and newsletter. Show publishing work as actual linked content with dates and labels. Use approved assets only.
- Global nav: Work, Publications, About, Insights, Contact. Mobile menu as full viewport panel with focus trap, Escape close, scroll lock, and route close. Desktop header may compact on scroll; maintain clear logo and contact route.
- Route map: `/`, `/work`, `/work/[slug]`, `/publications`, `/publications/[slug]`, `/insights`, `/insights/[slug]`, `/about`, `/contact`, `/privacy`, `/terms`. `/api/subscribe`, `/api/contact`, `/api/revalidate` only where needed. Existing STRATA-AF links stay external and explicit.
- Interaction: media reveal, hover previews, filterable work index, editorial card transitions, active menu state. Progressive enhancement. `prefers-reduced-motion` removes reveal dependencies. Avoid scroll hijacking, custom cursors, autoplay audio, hover-only actions.
- Mobile first: portrait media crops, visible content without animation, 44px targets, efficient image payloads. Validate desktop 1440, tablet 768, mobile 390 and 320.

## Proposed multi-file layout

```text
strata-publishing-co/
  index.html                    # existing reference; preserve until cutover
  BUILD_MAP.md
  blueprint/                    # contracts/query reference for build model
    README.md
    content.ts
    queries.ts
  site/                         # create during build; independent Next app
    app/
      layout.tsx globals.css page.tsx
      (editorial)/work/page.tsx (editorial)/work/[slug]/page.tsx
      (editorial)/publications/page.tsx (editorial)/publications/[slug]/page.tsx
      (editorial)/insights/page.tsx (editorial)/insights/[slug]/page.tsx
      about/page.tsx contact/page.tsx privacy/page.tsx terms/page.tsx
      api/subscribe/route.ts api/contact/route.ts api/revalidate/route.ts
    components/
      chrome/SiteHeader.tsx chrome/MobileMenu.tsx chrome/SiteFooter.tsx
      home/FeaturedHero.tsx home/LatestDesk.tsx home/PropertyRail.tsx
      editorial/FeatureCard.tsx editorial/FilterBar.tsx editorial/StoryBody.tsx
      forms/NewsletterForm.tsx forms/ContactForm.tsx
      motion/Reveal.tsx motion/MediaCrossfade.tsx
    lib/
      cms/client.ts cms/queries.ts cms/mappers.ts
      content/featured.ts content/search.ts content/sitemap.ts
      services/subscribe.ts services/contact.ts
      security/rateLimit.ts security/validate.ts security/webhook.ts
      analytics/events.ts seo/metadata.ts
    public/media/               # approved assets, optimized derivatives
    tests/                       # behavior and route contract tests
    .env.example package.json next.config.ts tsconfig.json
```

Use Next.js App Router and TypeScript. Keep this site separate from `STRATA-AF™/`; share Sanity project only if house schemas are explicitly added. Avoid coupling to reader app route/component internals. Deploy to own Vercel project/domain after preview review.

## Content model and backend flow

Contracts live in `blueprint/content.ts`; GROQ examples in `blueprint/queries.ts`. Sanity document types: `housePage`, `houseFeature`, `houseWork`, `housePublication`, `houseInsight`, `housePerson`, `houseSiteSettings`. Each public item needs unique slug, publication state, title, dek, category, publishedAt, ordered media with alt/caption/credit, SEO data, related item refs, and CTA. Work and insight may reference STRATA-AF content using validated canonical URLs; do not duplicate article bodies.

`GET page` → server CMS query → schema validation/map → render RSC + cached media URLs. Query only published documents. Missing/unpublished slug → 404. Homepage featured item explicitly curated; fallback latest eligible item only when curation empty. Related items exclude current slug, dedupe, cap count. Index filters use URL query params so deep links, back button, and SSR work. Search over house content only unless cross property search is explicitly requested.

Revalidation: Sanity webhook with HMAC/secret verification and timestamp replay window → check document type/id/slug → `revalidateTag` for lists and item, `revalidatePath` for changed slug and previous slug. Return 401/400 on invalid request; log request id and type, never token/body. Use cache tags: `house:settings`, `house:home`, `house:work`, `house:publication`, `house:insight`, `house:item:<id>`.

Newsletter: same destination/provider as current business signup if confirmed; otherwise keep CTA as external link to existing subscribe route. If local endpoint built: validate email + consent, honeypot, IP based rate limit, provider timeout/retry, idempotent subscriber upsert, generic success to avoid email enumeration. Store consent timestamp/source and policy version. Never expose provider secret client side.

Contact: mailto links are valid first release. If form needed: server side validation, consent, honeypot, rate limit, no HTML in email body, send via provider, generic user response, request id for logs. Do not persist messages by default. Privacy/terms content must come from approved house legal text; no generated legal promises.

Media: Sanity asset metadata + focal point, responsive `sizes`, image CDN transform, descriptive alt (empty only for decorative), explicit video poster/captions/credit. Motion and image uploads require rights review. No Shed assets.

## Build sequence and gates

1. Confirm current deployed house domain and inspect Shed reference in real browser. Capture visual notes at desktop/mobile; record unavailable details as assumptions.
2. Inventory approved house content, logos, media, legal copy; pick feature candidates. Resolve source of newsletter/contact delivery.
3. Create `site/` app, tokens/fonts, route shells, global navigation, responsive layout.
4. Add Sanity schemas/queries/mappers, seeded draft content, content fallback and 404 behavior.
5. Implement visual system and interaction; validate keyboard, touch, reduced motion.
6. Add newsletter/contact only with configured service, revalidation, SEO, sitemap, OG, analytics.
7. Verify representative routes, mobile/desktop screenshots, build/lint, Lighthouse/a11y, malformed webhook, bad form input, unpublished content. Preview deploy and compare with reference principles. Cut over only after approval.

## Acceptance

- Editorial hierarchy and interaction feel comparable to Shed reference while unmistakably Strata.
- Real house content; no placeholders in production. All public CTAs lead to valid routes.
- Navigation works by keyboard/touch and at 320px. Reduced motion leaves all content visible.
- CMS updates reach site through authenticated revalidation; unpublished content stays private.
- Forms either work end to end or are omitted in favor of working external/mailto paths.
- Parent site never changes STRATA-AF reader routes or auth.

## Handoff prompt

Build `site/` from this map and `blueprint/` contracts. First verify current Shed visuals in browser and inspect approved Strata assets/content. Preserve existing `index.html` until preview accepted. Implement route/content/backend flows, test key behaviors, and report assumptions plus preview URL. Do not deploy production or replace house site before review.
