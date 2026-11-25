# CoreLogic Platform Console

The Platform Console is the operator console of the CoreLogic platform. Platform staff use it to
manage tenants, plans, background jobs, migrations and platform-wide settings. Tenant users never
see it: it runs on its own origin, with its own authentication and its own API surface
(`/api/platform/v1`) on the [CoreLogic](https://github.com/YavuzMuhammetAli/CoreLogic) backend.

Part of the CoreLogic platform:

| Repository | Role |
|---|---|
| [CoreLogic](https://github.com/YavuzMuhammetAli/CoreLogic) | ASP.NET Core Web API, migrations, deployment |
| [CoreLogicUI](https://github.com/YavuzMuhammetAli/CoreLogicUI) | Tenant-facing Angular app |
| **CoreLogic-PlatformConsole** (this repo) | Operator console for the platform |

## Features

| Section | What you can do |
|---|---|
| Overview | Platform summary |
| Tenants | Tenant list and details: suspend, resume, schedule or cancel a purge, and view backups |
| Access | Manage platform users; request, approve and use impersonation |
| Security | Audit logs, security center, compliance |
| Operations | Manage jobs (retry, parked jobs) and workers (on/off, interval). View health, alerts, notifications and the registry. Run tenant database migrations, or schedule automatic upgrades with a cron schedule |
| Observability | API metrics and performance, from the telemetry database |
| Billing | Plans and plan features, subscriptions, usage, cost |
| Settings | Platform configuration (SMTP, AI provider and keys), feature flags, integrations (webhooks, API keys), announcements |

Access is controlled by 14 capabilities grouped into 6 system roles: PlatformOwner, PlatformAdmin,
Operator, SupportEngineer, SecurityAuditor and BillingAdmin. The interface is available in TR/EN,
supports light and dark themes, and has an in-page help panel.

## Tech stack

| Area | Technology |
|---|---|
| Framework | Angular 22 (standalone components, signals, zone.js) |
| Language | TypeScript 6.0 (strict, strict templates) |
| Build | Angular CLI 22 / `@angular/build`; client-side only |
| Styling | Custom SCSS design system, with no UI or chart libraries |
| Icons | Material Symbols, inlined as SVG via `npm run icons` |

## Getting started

### Prerequisites

- Node.js 22 or 24
- The [CoreLogic backend](https://github.com/YavuzMuhammetAli/CoreLogic) running on
  `http://localhost:5245`

### Run

```bash
npm install
npm start          # http://localhost:4300
```

`ng serve` runs on port **4300** and uses [proxy.conf.json](proxy.conf.json) to forward
`/api/platform` to `http://localhost:5245`.

Signing in requires MFA. The first account is created by the backend from its `PlatformBootstrap`
settings. The development sign-in details are in the console guide under `docs/`.

### Authentication

- The console uses a platform JWT (audience `corelogic.platform`) that is separate from tenant
  sessions.
- The access token is kept in memory only and is never written to browser storage.
- The refresh token is an HttpOnly, `SameSite=Strict` cookie that rotates on every use.
- Because of that cookie, the console and the API must share an origin. This is why
  `platformApiBaseUrl` is the relative path `/api/platform/v1` in every environment.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Dev server on port 4300 |
| `npm run build` | Production build into `dist/platform-console/` |
| `npm run watch` | Development build in watch mode |
| `npm run check:i18n` | Checks that every TR/EN key and page-help entry is complete |
| `npm run icons` | Regenerates `icons.generated.ts` from Material Symbols |

There is no unit-test setup yet: `angular.json` has no test target, so `npm test` does not run.
`npm run check:i18n` is the automated check today.

## Project structure

```
src/
├── index.html, main.ts, styles.scss   # entry point and global design system
└── app/
    ├── core/
    │   ├── auth/           # platform auth service and in-memory session store
    │   ├── guards/         # platform auth and capability guards
    │   ├── interceptors/   # correlation id, language, error/refresh, auth header
    │   ├── models/         # API DTOs and the capability catalog
    │   └── utils/          # cron builder
    ├── domains/<area>/     # one folder per section: component + service per screen
    ├── i18n/               # TR/EN dictionaries and page help texts
    ├── pipes/              # translate pipe
    ├── services/           # language, theme, metric catalog
    └── shared/             # console shell layout and UI components
```

## Deployment

The console is built and served by the backend repository's deployment:

- **Build:** `deploy/web.Dockerfile` builds this app and copies it into the `web` nginx image.
- **Serving:** nginx serves it on its own server block (port 8081), and Tailscale exposes it as
  `https://<host>:8443/`.
- **Clone name:** on the server this repository must be cloned as `CoreLogicPlatformConsole`, with no
  hyphen, because Docker Compose refers to that path.

See the backend [deploy/README.md](https://github.com/YavuzMuhammetAli/CoreLogic/blob/main/deploy/README.md).

## Further documentation

- [docs/platform-console-rehberi.md](docs/platform-console-rehberi.md): per-page reference, endpoint
  map and known pitfalls (Turkish). Parts of it are out of date: for example, it predates the Workers
  screen and the cookie-based refresh token.
- The backend [docs/platform/](https://github.com/YavuzMuhammetAli/CoreLogic/tree/main/docs/platform)
  folder holds the platform design documents (frontend architecture, UI/UX, API design).
