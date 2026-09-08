# Restaurant Open Graph images

`app/restaurant/[id]/opengraph-image.tsx` serves a 1200×630 PNG at
`/restaurant/{id}/opengraph-image`. Next.js attaches the image metadata to the
restaurant segment. Existing canonical/robots behavior and the homepage's
static `/og-image.png` are unchanged. Unknown/coming-soon IDs return 404.

## Product styling

`lib/og/MenuItemPreview.tsx` mirrors the stacked menu card used below the desktop
breakpoint: SurfaceCard's 24px radius, 20px padding, subtle border/shadow;
MenuItemCardHeader's 190px gray image surface, 16px radius and 12px contained-image
padding; Unbounded title; MenuItemMacroSummary's separator/spacing; MacroStat's
22px colored values and 10px uppercase labels. It imports the actual macro color
and formatting tokens, ProteinScorePill tier styles and nutrition score logic.
Satori requires inline styles; Tailwind, client title scrolling and interactive
variant/cart controls cannot be reused directly. The OG-safe component omits
those interactions. No editorial labels or supporting marketing copy are added.

The left side has a restaurant brand row (52px logo and 28px Unbounded name),
a black `Find high-protein {restaurant} meals` headline for every restaurant,
and a smaller app brand row (unchanged `/public/logo.svg` at 28px plus the
existing footer-style 18px Unbounded bold app name). The headline sits 48px below
the restaurant row; the app row sits 64px below the headline. This is the
user's final icon with its own background. All old white-logo references in app
navigation, footer and legal pages now use that same asset without added black
backgrounds or padding. Fonts are bundled Outfit and Unbounded with OFL licenses.

## Selection

`lib/og/restaurant.ts` uses the existing `getRestaurantData` output. Fixed menus
prefer standalone entree/single items with at least 25g protein in their default
portion, then photos, regular availability and existing menu order. Protein and
ID break ties. It excludes internal and shareable records. This favors a normal
representative item rather than the largest protein total. Current Chick-fil-A
selection is its regular Chicken Sandwich.

Build-your-own menus select only ingredients in Protein/Meat categories, also
consulting builder category labels. Builders with other naming can set
`builderConfig.primaryProteinCategory`. The highest-protein default ingredient
portion wins, with menu order then ID breaking ties. No prebuilt meals participate.
Chipotle selects Chicken (180 cal, 32g protein, 0g carbs, 7g fat). Missing protein
categories produce an empty preview, never a promotional meal.

Assets load directly from public or via bounded HTTPS requests. Sharp validates
photography; missing/corrupt photos use the final logo on the product's gray image
surface. Missing nutrition renders a dash. Long text wraps and is capped. Fonts
and images are included by production file tracing; images revalidate daily.

Validation: `node --import tsx --test tests/restaurantOg.test.mjs`, TypeScript,
ESLint and production build. Preview:
- http://localhost:3000/restaurant/chickfila/opengraph-image
- http://localhost:3000/restaurant/chipotle/opengraph-image
