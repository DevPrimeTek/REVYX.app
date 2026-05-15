# Screenshots — M0.S1

This directory will host PNG captures of the 8 page stubs in `apps/web-preview/`
once the dev server is started locally. The remote Claude Code container that
authored M0.S1 does not run a headless browser, so screenshot capture is
deferred to a developer's local close step.

## Capture procedure (developer-local)

```bash
cd apps/web-preview
npm install
npm run dev               # serves on http://localhost:3000
```

Then capture (any of these works):

- **Manual (recommended for visual review):** open each page in a desktop browser at 1440×900 and save full-page PNG to `design/screenshots/<route>.png`.
- **Playwright headless:**
  ```bash
  npx playwright install chromium
  npx playwright codegen http://localhost:3000   # or scripted
  ```

## Routes to capture (8)

| File | Route |
|---|---|
| `01-landing.png`     | `/` |
| `02-login.png`       | `/login` |
| `03-dashboard.png`   | `/dashboard` |
| `04-leads-queue.png` | `/leads` |
| `05-lead-detail.png` | `/leads/L-0001` |
| `06-properties.png`  | `/properties` |
| `07-deals.png`       | `/deals` |
| `08-manager.png`     | `/manager` |
| `09-admin.png`       | `/admin` |

Once captured, mark T-M0.S1-08 ☑ in the Roadmap session log.
