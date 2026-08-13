# AGENTS.md — Bússola Nerd API

## Commands

```bash
npm run start:dev    # dev server with watch
npm run build        # nest build -> dist/
npm run start:prod   # node dist/main
npm run test         # Jest (rootDir: src), regex: *.spec.ts
npm run test:e2e     # Jest config: test/jest-e2e.json, regex: *.e2e-spec.ts
npm run test:cov     # coverage
npm run lint         # ESLint flat config (eslint.config.mjs)
npm run format       # Prettier (singleQuote, trailingComma: all)
```

Single test file: `npx jest src/path/to/file.spec.ts` (jest rootDir is `src`)

## Architecture

- **NestJS 11 + MongoDB (Mongoose)**
- Entrypoint: `src/main.ts` — global prefix `api/v1`, CORS enabled, ValidationPipe (whitelist + transform + **forbidNonWhitelisted** — extra body fields → 400)
- Config via `@nestjs/config` with `registerAs` namespaces: `app`, `database`, `jwt`, `spotify`, `scrap`, `llm`, `releasesApi`. Access via `configService.get('namespace.key')`.
- Env validation: Joi schema at `src/config/validation.schema.ts` — **all vars required** except `JWT_EXPIRES_IN` and `LLM_MODEL`
- `tsconfig.json` uses `module: "nodenext"` (non-default for NestJS). `nest build` and `ts-jest` handle this transparently, but if adding raw `tsc` invocations, watch for ESM interop issues.

## Auth & Guards (global)

Two `APP_GUARD` registered in `app.module.ts`:
1. `JwtAuthGuard` — requires valid JWT on **every** route by default
2. `RolesGuard` — checks `@Roles()` decorator; passes if no roles specified on handler

Exempt routes via `@Public()` decorator (skips both guards).
Internal integration endpoint (`POST /internal/import/news`) uses `@Public()` + `@UseGuards(ApiKeyGuard)` — passes `x-api-key` header.

Roles: `ADMIN`, `EDITOR` (enum in `src/common/enums/role.enum.ts`).

## Module structure (per module)

```
module/
├── domain/
│   ├── interfaces/
│   │   └── *.repository.interface.ts   # interface + injection token (string constant)
│   └── *.service.ts                     # injects repository via @Inject(TOKEN)
├── infra/
│   ├── schemas/                         # @nestjs/mongoose @Schema classes
│   └── *.repository.ts                  # implements interface, uses @InjectModel()
├── dto/                                 # class-validator DTOs
├── *.controller.ts
└── *.module.ts                          # wires TOKEN -> useClass: MongooseRepository
```

Repository injection tokens are exported string constants (e.g. `USERS_REPOSITORY`, `CONTENTS_REPOSITORY`, `LLM_PROVIDER`). Services inject repositories via `@Inject(TOKEN)` — never via class directly.

Provider interfaces (e.g. `LlmProvider`, `SpotifyProvider`) live in `src/shared/providers/`.

## ESLint

Flat config at `eslint.config.mjs`. Uses `recommendedTypeChecked` rules from `typescript-eslint`. Key overrides:
- `@typescript-eslint/no-explicit-any`: **off**
- `@typescript-eslint/no-floating-promises`: **warn**
- `@typescript-eslint/no-unsafe-argument`: **warn**
- Prettier integrated as ESLint rule

## Repo conventions

- Repositories use `.lean().exec()` on queries (plain JS objects, not Mongoose docs)
- `create()` uses `new this.model(data).save()`
- `update()` uses `.findByIdAndUpdate(id, data, { new: true }).lean().exec()`
- Soft-delete for users: `remove()` sets `{ active: false }` via `update()`
- Content slugs auto-generated from title; collision-handled by appending `-${Date.now()}`

## Dependencies & DB

- MongoDB via Docker: `docker compose -f docker-compose-dev.yml up` (port 27017, auth: root/password)
- `.env` is gitignored; copy `.env.example`
- bcrypt for password hashing (salt rounds: 10)
- class-validator + class-transformer for DTO validation
- LangChain + Gemini for LLM (`@langchain/google`, `@langchain/core`)
- Cheerio for RSS/HTML parsing
- `@nestjs/schedule` for cron jobs

## Scrap Module (`src/modules/scrap/`)

Automated news scraping pipeline:
- **Cron**: `@Cron('0 */12 * * *')` triggers every 12h (configurable via `SCRAP_CRON`)
- **Manual trigger**: `POST /api/v1/scrap/trigger`
- **Portals**: Den of Geek (`/feed/`), IGN Brasil (`/feed.xml`) — RSS feeds
- **Pipeline**: Fetch RSS → Parse → Dedup check → LangChain Gemini summarize/translate → Save as Content
- **Dedup**: Checks `originalSourceUrl` (sparse unique) + title regex match
- **LLM**: LangChain Gemini (`ChatGoogle`) translates en→pt-BR, summarizes to 600 chars
- **Schema**: `ScrapedArticle` tracks raw articles, processing status, errors

## Tests

- Unit tests: `*.spec.ts` alongside source in `src/`
- Integration-style tests (e.g. `contents.integration.spec.ts`) also live in `src/`, not `test/` — they use `@nestjs/testing` + supertest with mocked repositories and a `MockAuthGuard`
- E2e tests: `test/` directory, config at `test/jest-e2e.json`, regex `*.e2e-spec.ts`
- When writing tests, replicate the `APP_GUARD` + `ValidationPipe` setup (see `contents.integration.spec.ts` as reference)

## Stubs (not yet implemented)

- Spotify, Releases API providers return mock data
- `ReleasesModule` returns empty arrays
