# Hindi lunar guides: accuracy and organic growth

Prepared 4 October 2026. The site combines `/panchang` and `/hindu-calendar` with four educational guides: `/tithi`, `/ekadashi`, `/purnima` and `/amavasya`. The calendar provides **approximate astronomical information**, not an authoritative ritual panchang. The guides publish no festival-date table, fasting prescription, muhurat or parana window. Search visibility, indexation and a #1 position are not guaranteed.

## Distinct reader needs

| Route | Reader need | Original utility |
| --- | --- | --- |
| `/tithi` | Understand what a tithi means and read a calendar | All 15 names in each paksha, the 12° calculation, instant versus sunrise, skipped/repeated sunrise labels |
| `/ekadashi` | Understand why a tithi label cannot settle fasting | Separate interval, observance date and parana; location/tradition checklist; Smarta/Vaishnava distinction |
| `/purnima` | Distinguish full Moon, tithi, fasting and puja | Explain the interval ending at full Moon, Purnimanta months, puja-date differences and lunar eclipses |
| `/amavasya` | Understand new Moon and read local ritual information | Explain the interval ending at new Moon, Amanta months, ancestral-remembrance context and crescent/eclipse differences |

Keep these purposes distinct when revising. Do not clone them into city/year doorway pages, append keyword lists or present approximations as ritual dates. Each route has its own title, description, canonical, Open Graph URL and Twitter text; Hindi language alternates point to that route. The existing brand image is reused. Visible FAQs and each route's `FAQPage` come from the same array; breadcrumbs use the site's `BreadcrumbList` helper.

## Final release checks

All six routes are implemented, navigation and the sitemap are updated, and the global FAQ block is removed. Customized calendar URL variants have `noindex, follow` and a canonical pointing to their calendar hub. Verify these behaviors on the final production deployment.

1. Ensure `/panchang` and `/hindu-calendar` are deployed, return 200 and describe their actual calculation basis. All four guides link to them. The current engine samples tithi at local sunrise; the distinction from the current instant in the guides explains how to read that result.
2. Confirm the deployed `/sitemap.xml` contains all four guides and both calendar hubs and lists only canonical, indexable URLs. Inspect customized date/city/month variants for `noindex, follow` and the matching `/panchang` or `/hindu-calendar` canonical; keep those variants out of the sitemap. The plain hubs and guides should remain indexable. Use meaningful content modification dates if supplying `lastModified`, rather than refreshing it merely because a build ran.
3. Follow the updated navigation and contextual links from the calendar pages and `/parv` to the guides. The guides cross-link to one another and to both calendar destinations. Confirm each target returns 200 and preserves the intended destination.
4. Confirm rendered guide HTML contains only its own visible Q/A in `FAQPage`, with no inherited global FAQ. Keep homepage-only markup on the page that displays those answers. Check the final rendered HTML, not just these page files.
5. Confirm production metadata has one intended canonical, correct route-specific social text and no redirecting language alternate. Check mobile overflow, heading order, source links and keyboard access to contents, table scrolling and FAQ controls.

FAQ markup describes visible content and does not guarantee rich results. Validate JSON-LD syntax and correspondence with the visible answers using a schema validator. Check [Google's current documentation updates](https://developers.google.com/search/updates#may-2026) before making any search-enhancement claim; its May 2026 entry records retirement of the FAQ rich result feature.

## Search Console and Bing setup

1. In [Google Search Console](https://search.google.com/search-console), create a Domain property for `sanatanparivar.in`, add the supplied DNS TXT record through the domain's DNS provider, verify it and retain the record. This covers protocols and subdomains. Follow [Google's property setup](https://support.google.com/webmasters/answer/34592?hl=en) and [ownership verification instructions](https://support.google.com/webmasters/answer/9008080?hl=en).
2. If using a URL-prefix property instead, choose `https://sanatanparivar.in/`. The current `app/layout.tsx` supports the **token value** through `GOOGLE_SITE_VERIFICATION`; configure it in the production environment, redeploy, inspect the resulting `google-site-verification` meta tag and then verify. This tag does not verify a Domain property.
3. Submit `https://sanatanparivar.in/sitemap.xml` after deployment. Use URL Inspection on the six guide/calendar URLs: test the live URL, confirm crawl access and rendered content, inspect Google's chosen canonical once indexed, and request indexing when ready. Also inspect one customized calendar variant to confirm its noindex and hub canonical. Record failures and their actual reasons; repeatedly requesting indexing is not a growth strategy.
4. In [Bing Webmaster Tools](https://www.bing.com/webmasters/about), import the verified Search Console property, or add the canonical HTTPS site manually and follow the verification option Bing supplies. Import may also bring in the sitemap; confirm that the correct sitemap is present and processed. The current app has no dedicated Bing verification meta setting, so choose Bing's provided DNS option or coordinate any file/meta addition with the shared-file owner. See [Bing verification](https://www2.bing.com/webmasters/help/add-and-verify-site-12184f8b) and [Bing sitemaps](https://www2.bing.com/webmasters/help/sitemaps-3b5cf6ed).
5. Review crawl/indexation errors weekly during rollout. Keep `/metrics` private and `/api/` excluded as intended by the current robots rules. Confirm public guides are indexable after deployment; do not assume sitemap submission implies indexing.

## Baseline using the existing metrics

No production analytics or Search Console export was supplied for this change. **The numerical baseline is pending collection, not zero.** Collect it before release; preserve the time window and export date with every snapshot.

The repository already mounts `app/components/Track.tsx` on public routes. It sends the path, `document.referrer`, a tab-scoped session ID and `utm_source` to `/api/track`. The `page_views` table also holds timestamp, device, browser and country. The private `/metrics` dashboard and `/api/metrics?days=28` expose views, sessions, hashed-IP visitor counts, top paths, referrers, UTM sources and daily traffic. Authenticate with the existing `ADMIN_API_KEY`, preferably in the Bearer header, and keep exported data in private analytics storage. Do not put keys, raw user records or member names in this document.

Before release:

- Save the latest completed 28 days of existing traffic, with the exact `period.since` and collection timestamp. Record views/sessions and the existing calendar or `/parv` path totals if present. Newly launched URLs have no prelaunch history; distinguish that from unavailable data.
- From existing referrers, count Google/Bing search-host referrals as a **search-referral proxy**. Parse hostname and exclude own-domain navigation and known non-search services. Do not classify every Google-owned hostname as organic search. Missing referrer is “unknown/direct,” not “organic.” `utm_source` alone cannot distinguish paid from organic because `utm_medium` is not collected.
- The dashboard returns only the top 12 referrers and top 15 paths, grouped independently. Summing visible rows is not a complete route-level organic baseline. An authorized analyst should use a read-only aggregate of `page_views` grouped by path and referrer host for the exact window, excluding UTM-tagged rows from the conservative search-referral proxy. Do not expose individual session/IP records. State that paid or untagged traffic can still be misclassified.
- Client tracking records views, not true search landing sessions: referrer can persist during client navigation, and there is no first-event attribution in the current API. Tab sessions and hashed IPs are not unique people. The current metrics also cannot attribute member registrations to an organic entry route. Use these limits when interpreting changes.
- Export Search Console Web performance by date, page, query, country and device for the same completed period; record clicks, impressions, CTR and average position. Record branded (`सनातन परिवार`, `sanatan parivar`) and non-branded queries separately using consistent filters. Search Console query tables omit some data; do not expect query sums or client views to equal click totals. See [Google performance-report definitions](https://support.google.com/webmasters/answer/7576553?hl=en).
- Export Bing Search Performance separately with the result surface recorded, since its reporting can include more than conventional web links. See [Bing performance definitions](https://www.bing.com/webmasters/help/search-performance-c680da36).

Use this private measurement table rather than invented traffic estimates:

| Window / URL group | Search Console clicks / impressions / CTR / position | Bing clicks / impressions / surface | Existing views / sessions | Search-referral proxy | Coverage notes |
| --- | --- | --- | --- | --- | --- |
| Prelaunch, last completed 28 days | Pending export | Pending export | Pending authenticated snapshot | Pending full aggregate | Mark absent route history and unavailable sources explicitly |
| First completed 28 days after release | Collect | Collect | Collect | Collect | Indexation date, tracking gaps, festival season and device mix |
| Next completed 28 days | Compare with prior window | Compare with prior window | Compare | Compare | Keep filters and window definition unchanged |

Search Console daily dates and database timestamps may use different time bases; record them and avoid claiming exact cross-system reconciliation. Keep historical snapshots because the existing metrics endpoint supplies a rolling window, not an arbitrary historical range. Review high-impression queries weekly: improve an explanation when intent is underserved, refine a title only when it describes the visible answer, and log the change for the next comparable window. Evaluate seasonality and actual indexing before attributing movement to an edit.

## Content accuracy workflow

1. The editor records the claim, primary/source URL, relevant section, checked date and whether it is astronomy, a source's ritual rule or an explanatory inference. The 12° intervals in these guides are arithmetic derived from the tithi definition. Sources do not endorse this site's approximate engine.
2. Verify astronomical definitions with the [US Naval Observatory calendar reference, §15.7](https://aa.usno.navy.mil/downloads/c15_usb_online.pdf), [NASA Moon phases](https://science.nasa.gov/moon/moon-phases/) and [NASA eclipses](https://science.nasa.gov/moon/eclipses/). For an Indian institutional reference use [Positional Astronomy Centre](https://www.packolkata.gov.in/) and its national panchang/ephemeris publications. PAC deep pages were intermittently unavailable during verification; the indexed institutional homepage and publication descriptions were checked. Retry any needed publication before relying on its tables.
3. Use Drik Panchang's [timing methodology](https://www.drikpanchang.com/faq/faq-ans1.html?lang=en), [month settings](https://www.drikpanchang.com/settings/drikpanchang-settings.html?lang=en), [Ekadashi](https://www.drikpanchang.com/vrats/ekadashidates.html), [parana explanation](https://www.drikpanchang.com/ekadashis/indira/indira-ekadashi-date-time.html), [Purnima](https://www.drikpanchang.com/vrats/purnimasidates.html) and [Amavasya](https://www.drikpanchang.com/vrats/amavasyadates.html) pages for the rules that source describes. Dynamic pages default to a location: select the actual city/year before checking dates. Paraphrase explanations; do not copy lists, timings or prose.
4. A second reviewer checks Hindi terminology and mathematical boundaries: Shukla Ekadashi `[120°,132°)`, Krishna Ekadashi `[300°,312°)`, Purnima `[168°,180°)`, Amavasya `[348°,360°)` with `360° = 0°`. Separate current instant, sunrise tithi, exact phase moment and observance date throughout. A phase's appearance is not a precise tithi calculation.
   - Check the reference fixture in the deployed engine: **4 October 2026, New Delhi, local sunrise: Krishna Navami; approximate end 5 October at 03:54 IST**. The [Drik Panchang New Delhi reference for that date](https://www.drikpanchang.com/shraddha/tithi/navami-shraddha-date-time.html?geoname-id=1261481&lang=en&year=2026), checked during this review, lists the Navami end at **03:53 IST on 5 October**. Record the roughly one-minute difference as a sample comparison, not a proven global error bound or ritual-calendar certification. Do not apply an artificial offset to force agreement.
5. If dates or ritual times are proposed later, require a qualified tradition-specific reviewer and record city, coordinates/time zone, year, sunrise convention, month system, tradition and source. Verify two appropriately selected references, resolve disagreements and label remaining uncertainty. Do not derive festival dates or parana from this approximate engine.
6. Check source availability and methodology at least quarterly and whenever the engine or content changes. Replace the visible checked date only after a real review. Corrections should state what changed in the editorial log. Recheck rendered FAQ/answer matching and breadcrumbs after edits.

## Rollout order

- Before deployment: verify the integrated calendar links, sitemap and FAQ output; capture the baseline; review content and compiled output.
- First week after deployment: inspect all canonical URLs, confirm source/calendar links, record indexing and analytics availability, and submit the updated sitemap to both engines.
- At 28 and 56 completed days: compare consistent measurements, review reader query gaps, and make focused factual improvements. Publish a new guide only if it answers a distinct question with reviewed sources.
