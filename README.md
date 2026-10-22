# BID BATTLE — Cricket Auction Battle

A two-player cricket auction game played on **one phone**. Player 2 sits at the top (their half of the screen is upside down, so it reads correctly from their side), Player 1 at the bottom, and the shared auction arena sits in the middle. It is a Progressive Web App (installable, works offline after the first load). No server, login, or paid API is needed.

* **Modes:** Timed (15 s, resets on each raise) · Classic (close bidding with a two-tap confirm) · Hidden Bid (sealed bids with a "pass the phone" privacy screen, rematch on a tie).
* **Players:** 276 bundled players (see "Player database" below) + your own custom players.
* **Saving:** manual only. Save Game, Resume Saved Auction, save results to History, export JSON/CSV.

---

## 1. Folder structure

```
bid-battle/
  index.html            page shell + PWA/iOS meta tags
  package.json          dependencies and the npm commands
  vite.config.js        build tool config
  netlify.toml          Netlify build, redirect and cache-header settings
  public/               copied as-is into the final site
    manifest.webmanifest  app name, colours, icons (PWA)
    sw.js                 service worker (offline support)
    favicon.svg
    icons/                192, 512, maskable-512, apple-touch, 32, 96, 144 PNGs
  src/
    main.jsx            starts the app + registers the service worker
    App.jsx             screens, saving, history, custom players
    index.css           all styling
    components/         Home, Setup, Auction, Results, Players, History, SettingsScreen, ui
    data/players.js     the bundled player list (easy to edit)
    utils/engine.js     ALL auction rules (pure logic, unit-tested)
    utils/money.js      rupee / lakh / crore formatting (money stored as integer rupees)
    utils/scoring.js    results scoring + CSV export
    utils/storage.js    versioned localStorage + image resizing
    utils/audio.js      sound effects generated with the Web Audio API
    utils/rng.js        seeded shuffle (same order after loading a save)
  tests/                node tests for the rules engine and the player data
```

## 2. Install Node.js
Go to <https://nodejs.org>, download the **LTS** version, and run the installer (keep the defaults). Check it worked by opening a terminal and typing `node -v` — you should see a version number (18 or newer).

## 3. Extract the ZIP
Right-click the ZIP → *Extract All* (Windows) or double-click it (Mac). You get a folder called `bid-battle`.

## 4. Open a terminal in that folder
* **Windows:** open the folder in File Explorer, click the address bar, type `cmd`, press Enter.
* **Mac:** right-click the folder → *New Terminal at Folder* (or open Terminal and type `cd ` then drag the folder onto it).
* **VS Code:** *File → Open Folder*, then *Terminal → New Terminal*.

## 5. Install, run, test
```bash
npm install        # downloads the libraries (needs internet, takes a minute; creates package-lock.json)
npm run dev        # starts the game at http://localhost:5173
```
Open the address in your browser. To try it on your phone while developing, use the `Network` address Vite prints (phone and computer must be on the same Wi-Fi). Desktop tip: use the browser's *Device toolbar* (F12 → phone icon) to see the mobile layout.

**Quick things to try:** tap *Quick Start* → bottom player taps **Bid base** → the top player's (upside-down) buttons light up → keep bidding until the timer ends → SOLD. Then try *Start New Auction* with **Hidden Bid**.

Run the rules tests any time: `npm test`.

## 6. Production build
```bash
npm run build      # creates the /dist folder (the finished website)
npm run preview    # serves /dist at http://localhost:4173 so you can test the real build
```
The service worker only registers in the production build (so use `preview` to test installing/offline).

## 7. Deploy to Netlify
`netlify.toml` already contains the right settings: build command `npm run build`, publish directory `dist`, an SPA redirect, and cache headers that keep `sw.js` and `index.html` fresh so updates are picked up.

**Option A — GitHub (recommended, automatic updates)**
1. Create a free GitHub account and a new repository; upload the project files (not `node_modules` or `dist`).
2. On <https://app.netlify.com> choose *Add new site → Import an existing project → GitHub* and pick the repo.
3. Leave the detected settings (build `npm run build`, publish `dist`) and click *Deploy*.
4. To update later: change files → commit/push to GitHub → Netlify redeploys automatically.

**Option B — manual drag-and-drop**
1. Run `npm run build` on your computer.
2. On Netlify open *Sites*, then drag the **`dist` folder** onto the "drag and drop your site output folder" area.
3. To update: run `npm run build` again and drag the new `dist` folder onto your site's *Deploys* page.

**Test the deployed site:** open the Netlify URL on your phone over HTTPS, play a round, then in Chrome menu choose *Install app* / *Add to Home screen*. Turn on airplane mode and re-open it to confirm offline start. After an update, close and reopen the app once or twice to load the new version.

## 8. Install as an app on Android
Open the deployed HTTPS URL in **Chrome** → ⋮ menu → **Install app** (or *Add to Home screen*). Support varies by browser: Chrome/Edge on Android work best; Samsung Internet and Firefox have their own options; iPhone Safari uses *Share → Add to Home Screen* (and does not always show an install prompt).

## 9. Change the app name or icon
* **Name:** edit `name` and `short_name` in `public/manifest.webmanifest`, the `<title>` in `index.html`, and the `BID BATTLE` text in `src/components/Home.jsx`.
* **Icon:** replace the PNGs in `public/icons/` keeping the same file names and sizes (192, 512, maskable 512 — keep important art inside the middle 80% for the maskable one — and 180 for apple-touch-icon), and replace `public/favicon.svg`. Then rebuild and redeploy. Installed apps may need to be reinstalled to show a new icon.

## 10. Add or edit players
* **Inside the app (no code):** Home → *Players* → *+ Add*. Name, country, role, category, base price, optional ratings and an optional photo (JPG/PNG/WebP up to 2 MB, resized to a small square). Custom players are stored in your browser only and never overwrite the built-in list.
* **In the code:** open `src/data/players.js` and add a line to `RAW` in the format `Name|CountryCode|Role|Category|bat|bowl`. Role: `B` batter, `O` bowler, `A` all-rounder, `K` keeper. Category: `C` common, `S` star, `X` superstar, `L` legend. Country codes are listed in `COUNTRIES` in the same file. Run `node tests/db.test.mjs` to check for typos/duplicates.

## 11. Troubleshooting
| Problem | Fix |
|---|---|
| `npm: command not found` | Install Node.js (step 2), then close and reopen the terminal. |
| `npm install` fails with network errors | Check your internet / proxy and retry. |
| Port already in use | Close the other dev server, or run `npm run dev -- --port 3000`. |
| Blank page after deploy | Check the Netlify deploy log; the publish directory must be `dist`. |
| Old version still showing after an update | Close the app fully and reopen it; or clear site data in the browser. |
| No sound | Tap the screen once (browsers block audio until you interact); check the 🔊 button and Settings; check the phone isn't on silent. |
| "Could not save: storage full/blocked" | Private/incognito mode or full storage; free space or use a normal tab. |
| Can't resume a save after an update | Saves are versioned; an incompatible one is reported and can be deleted in Settings. |

## 12. Player database — honest notes
* **276 bundled players** (25 Superstar, 89 Star, 62 Common, 100 Legend; 91 batters, 88 bowlers, 67 all-rounders, 30 keepers). Names, countries and roles were assembled from general cricket knowledge; they have not been checked against an official source.
* The **bat / bowl numbers are BID BATTLE's own rough game ratings, not statistics**, and categories are editorial choices. Edit them freely.
* **No franchise/team data** is bundled (IPL squads change every season), and **no photographs** are bundled (rights). Every player gets an offline initials avatar; custom players can have an uploaded photo.
* The database is smaller than the 500+ target on purpose: quality over quantity.

## 13. Known limitations
* Needs a modern browser (Chrome/Edge/Safari/Firefox from the last few years); `localStorage`, Web Audio and service workers must be allowed.
* The mirrored layout is designed for portrait phones around 360×640 and larger. On very small screens (e.g. 320×568) the panels may need a little scrolling.
* Hidden Bid is a **local privacy feature, not secure secrecy**: anyone deliberately inspecting the device or its stored data could see bids.
* Audio is synthesised; "FAAAH!" / "OMGGG!" are original synthesised sounds, not recordings. Spoken announcements depend on the device's speech voices.
* Data lives only in the browser on one device. Clearing site data deletes saves, history and custom players.
* The "budget reserve" feature is a warning only; no rule blocks bids for low reserve.
* Timed auctions use real clock timestamps, so switching apps does not extend time; opening the pause menu freezes it.
