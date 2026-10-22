# Testing report

Environment used: an offline Linux sandbox (Node 22, Chromium via Playwright). **`npm install` and `npm run build` (Vite) could NOT be run there** because there was no network access. Everything below was actually run; the last section lists what was not.

## Actually run
1. **Rules engine unit tests** (`npm test` → `tests/engine.test.mjs`, 13 groups, all passing): money formatting/parsing; config validation; seeded shuffle reproducible + no duplicates; opener alternation and turn enforcement; bid validation (increment, purse, non-integer, self-outbid); no deduction before sale; timer reset + finalize only after the deadline; sale deducts exactly once, no double sale; unsold when no bids; classic pass/rejoin/close and both-pass; pause/resume; hidden bid privacy stages, higher bid wins and pays own bid, tie → rematch → unsold, pass rules, over-purse rejection; full squads cannot buy and a full auction ends with `purse + spent = budget`; save → load restores state and restarts the timer from the time left.
2. **Player data check** (`node tests/db.test.mjs`): 276 records, unique IDs, valid fields.
3. **Bundle compile check:** the full app (all JSX) was bundled with esbuild against React 19.2.5 with zero errors. This confirms there are no missing imports/syntax errors but is **not** the same as `vite build`.
4. **Real-browser tests (Chromium, touch emulation, 390×844 and 360×640):** P2 panel computed transform is rotate(180°) and P1 none; no horizontal overflow; centre arena visible; enabled buttons ≥ 40 px; P2 bid disabled out of turn; **real mouse clicks on the rotated P2 buttons and typing in the rotated custom-bid input work**; timer expiry produces SOLD; unsaved/saved indicator; Save → reload → Resume; Classic: no countdown, single tap does not sell, second tap sells, both pass → UNSOLD; Hidden: sealed display, privacy screen without the first amount (checked in page text and inputs), reveal shows both bids, higher bid wins, over-purse blocked; results screen; save/list/open/clear history; custom player create + persistence after reload; invalid image rejected; corrupted save JSON doesn't crash; no console errors.
5. **Layout fit** at 360×640, 375×667, 390×844, 412×915: both panels fit without scrolling. At 320×568 panels scroll slightly.
6. **Service worker (Chromium):** registers, precaches shell and built assets, and a reload while offline still starts the app and a new auction.

## NOT tested / still needs checking by you
* `npm install` and `npm run build` with real Vite (run them first; if anything fails, paste the error to me).
* Installability prompt, real Android devices, iOS Safari, Samsung Internet, Firefox.
* Sound quality on real phones (audio was never heard; only that it does not throw), speech synthesis voices.
* Image upload with a real JPG/PNG (only the invalid-type rejection was exercised).
* Netlify deployment (not done; no account access).
* Lighthouse/PWA audit, accessibility audit with a screen reader, performance on budget phones.
* Hidden-bid rematch round in the browser (covered only by engine unit tests), and the Superstar / bidding-war / high-value banners (only the Legend reveal banner was seen in a screenshot).
