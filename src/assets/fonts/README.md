# Bundled site fonts

Manrope and Caveat are the same families used by the site previously. Their
Latin variable WOFF2 files are bundled so production builds do not need to fetch
Google Fonts CSS or font files. Next.js loads and self-hosts them with
`next/font/local`.

- Manrope: weights 200–800; site body font.
- Caveat: weights 400–700; gallery handwriting font.

Downloaded from Google's official Fonts service on 2026-10-14:

- https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap
- https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap

The fonts use the SIL Open Font License 1.1. Their accompanying license files
are preserved here from Google's font repository:

- https://github.com/google/fonts/tree/main/ofl/manrope
- https://github.com/google/fonts/tree/main/ofl/caveat
