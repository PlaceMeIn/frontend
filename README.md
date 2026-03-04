# MUT Tech Club UI

This repository contains the **front-end** for the MUT Tech Club website, built with [Nuxt 3](https://nuxt.com) and TypeScript. It is designed as a **pnpm workspace** project and leverages Nuxt modules like `@nuxt/content` for markdown/content, `@pinia/nuxt` for state management, and TailwindCSS for styling.

> 📁 The code in this workspace is located under the `ui/` directory – all commands below should be run from that folder unless otherwise noted.

---

## 📂 Project Structure

The project follows the standard Nuxt 3 directory conventions, with some custom folders for organization:

```
ui/
├── app/
│   ├── assets/          # static assets (CSS, images, etc.)
│   ├── components/      # Vue components (organized by feature/section)
│   ├── composables/      # composable utilities (useApi, useSeoPage, etc.)
│   ├── layouts/         # Nuxt layouts (default.vue)
│   ├── pages/           # Pages get turned into routes automatically
│   ├── plugins/         # Nuxt plugins (client-only validators, etc.)
│   ├── stores/          # Pinia stores (auth, state)
│   └── utils/           # general helpers (clipboard, constants, links)
├── content/             # Markdown/YAML content for static pages
│   ├── about.yml
│   ├── blog.yml
│   ├── index.yml
│   ├── projects.yml
│   ├── speaking.yml
│   ├── blog/            # individual markdown posts
│   └── projects/        # project definitions in YAML
├── public/              # public static assets (robots.txt, hero images)
├── package.json         # npm scripts and dependencies
├── tsconfig.json        # TypeScript configuration
├── nuxt.config.ts       # Nuxt configuration file
├── eslint.config.mjs    # ESLint settings
└── ... other config files (pnpm-workspace.yaml, README.md, etc.)
```

### 🚪 Key Directories

- **`app/pages/`**: Each `.vue` file is automatically routed; nested directories create nested routes.
- **`app/components/`**: Reusable UI pieces split into subfolders (`landing`, `usagecards`, `cool`, etc.).
- **`content/`**: Holds structured data (YAML) and blog posts (Markdown). Used by `@nuxt/content` for dynamic content.
- **`app/stores/`**: Pinia stores used for global state and authentication.
- **`app/plugins/`**: Client-side plugins such as AOS for scroll animations and persisted Pinia state.

---

## ⚙️ Setup & Development

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (v8+) – the repo uses `pnpm@10.29.3` as specified in `package.json`

```bash
# install pnpm globally if you don't have it
npm install -g pnpm
```

### Install dependencies

Run the following from the `ui/` directory:

```bash
pnpm install
```

This will read `pnpm-lock.yaml` and install all required packages.

### Available Scripts

- `pnpm dev` – Start the development server with hot reload
- `pnpm build` – Compile production assets
- `pnpm preview` – Serve the built project locally for testing
- `pnpm lint` – Run ESLint over the codebase
- `pnpm lint:fix` – Run ESLint and auto-fix issues when possible
- `pnpm typecheck` – Run Nuxt's TypeScript checker

Example:

```bash
pnpm dev
# open http://localhost:3000 in your browser
```

> 📝 The `postinstall` script runs `nuxt prepare`, which generates necessary files after package install.

---

## 🛠 Configuration & Customization

- **nuxt.config.ts**: Central Nuxt configuration (modules, meta tags, runtime config, etc.).
- **tsconfig.json**: Enables path aliases (e.g., `~/` for root) and strict typing.
- **eslint.config.mjs**: ESLint rules extend Nuxt's recommended presets.

You can adjust TailwindCSS settings in `tailwind.config.js` if present (not shown above).

---

## 📦 Dependencies Overview

Major runtime libraries used:

- `nuxt` & related modules (`@nuxt/content`, `@nuxt/image`, `@pinia/nuxt`, etc.)
- `tailwindcss` for utility-first styling
- `pinia` for state management
- `@vueuse/nuxt` for useful Vue composition utilities
- `aos` & `motion-v` for animations
- `better-sqlite3` (likely for some backend or server-side feature)

Development dependencies include TypeScript, ESLint, vue-tsc, and Nuxt ESLint plugins.

---

## 📄 Content Management

The `content/` folder holds YAML definitions for the homepage, about page, projects, blog index, etc. Blog posts are written in markdown. The Nuxt Content module loads this data at build or runtime and makes it available via the `$content` API.

Add new posts or pages by creating files under the appropriate subdirectory and updating any related navigation logic.

---

## ✅ Running & Deployment

1. **Development**:
   ```bash
   cd ui
   pnpm install
   pnpm dev
   ```
2. **Build for production**:
   ```bash
   pnpm build
   pnpm preview  # optional local test
   ```
3. **Deploy**: Copy the generated `.output` directory (Nuxt 3 default) to your hosting environment or use a platform that supports Nuxt (Vercel, Netlify, etc.).

> 💡 For continuous deployment, ensure your CI runs `pnpm install && pnpm build` in the `ui` directory.

---

## 🧩 Contributing

1. Fork the repo and create a feature branch.
2. Install dependencies with `pnpm install` in the `ui` folder.
3. Add components, pages, or content as needed.
4. Run `pnpm lint` and `pnpm typecheck` before committing.
5. Submit a pull request describing your changes.

---

## 📬 Questions

Feel free to reach out to the maintainers for help or …

*This README was generated based on the current project layout and configuration.*
