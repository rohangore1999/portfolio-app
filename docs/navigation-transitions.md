# Navigation transitions

Internal navigation prefetches the destination immediately while a 400 ms cover
animation runs. When the cover finishes, `router.push` runs inside a React
transition. The cover stays up until the pathname changes and React finishes the
pending route transition. The incoming page gets a render frame underneath it,
then the cover exits over 400 ms.

The previous implementation delayed navigation by 700 ms, then could restart a
second 700 ms timer on a pathname change. Incoming page wrappers also started
transparent, making the wait appear longer. Incoming wrappers now use
`initial={false}` and only the outgoing page responds to `isTransitioning`.
Page-specific entrance animations remain intact.

One navigation remains active through the cover and reveal. Repeated clicks
are ignored during that period, same-path clicks skip the overlay, and a
15-second fallback uncovers the page with a retry message if navigation stalls.
Timers and scheduled frames are cleaned up. Reduced motion skips the slide.

The Home logo uses a motion-enhanced Next.js Link with prefetching. Navigation
links use `onNavigate`, preserving native modified-click/new-tab behavior.
Contact retains its existing footer-scroll behavior.

## Verification on 2026-10-19

Both versions were built with `npm run build` and served locally in production
mode. REA 6.4.0 replayed the same desktop sequence at 1440 × 900. Approximate
measurements run from the completion of the click action until the cover was
removed and the page wrapper was fully opaque. They are browser-observation
measurements, not network latency or a guarantee for all devices.

| Route | Before | After |
| --- | --- | --- |
| Work | 1.61 s | 0.83 s |
| About | 1.58 s | 0.88 s |
| Gallery | 1.61 s | 0.87 s |
| Home | 1.58 s | 0.87 s |
| About, repeat visit | 2.09 s | 0.87 s |

REA scenarios also verified mobile menu navigation at 390 × 844, reduced-motion
navigation, double-clicks, same-page clicks without an overlay, and a modified
keyboard activation opening Blog in a separate tab while Work remained active.
A local proxy delayed Work responses by three seconds to exercise the pending
route rather than just a warm cache: two seconds into loading, the destination
was not mounted and the cover was still visible; it cleared after arrival.
Blog and project detail navigation and their Back links also passed.
Native browser back/forward keyboard
shortcuts were not supported by the headless scenario and are not included in
these verified results.

The changed components pass ESLint, and the production build passes. No REA
configuration, runtime dependency, credentials, or captured browser data is
included in the application bundle.
