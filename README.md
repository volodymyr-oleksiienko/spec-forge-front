# 🛠 Spec-Forge Front

![Status](https://img.shields.io/badge/Status-In_Development-orange?style=for-the-badge)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=volodymyr-oleksiienko_spec-forge-front&metric=alert_status)](https://sonarcloud.io/dashboard?id=volodymyr-oleksiienko_spec-forge-front)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=volodymyr-oleksiienko_spec-forge-front&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=volodymyr-oleksiienko_spec-forge-front)

![React Version](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

![Architecture](https://img.shields.io/badge/Arch-FSD-FF4081?style=for-the-badge)
![License](https://img.shields.io/badge/License-AGPL--3.0-blue?style=for-the-badge)

**Spec-Forge Front** is the web workspace for the **Spec-Forge API**. It lets you upload data sources to visualize and
edit the generated Intermediate Representation (IR) in real time. Built to be **Confluence-friendly**, it can be
injected into docs to turn static specs into live tools for generating **Java** and **TypeScript**.

---

## 🚀 Quick Start

### 📋 Prerequisites

Ensure you have the following environment configurations before starting:

- **Node.js 24+**
- **NPM 11+**

### 💻 Run Locally

Execute the following commands in your terminal to clone the repository and start the development server:

```bash
# Clone the repository
git clone https://github.com/volodymyr-oleksiienko/spec-forge-front.git

# Navigate into the project directory
cd spec-forge-front

# Install dependencies using clean install
npm ci

# Run the development server
npm run dev
```

---

## 🧰 Tech Stack

- **Language:** TypeScript 5+
- **Framework:** React 19+
- **Build Tool:** Vite 7+

---

## 🏛️ Architecture Spec-Forge

Spec-Forge Front follows the **Feature-Sliced Design (FSD)** methodology to ensure modularity and clear dependency flow.

---

### 🛡️ Business Logic (Entities)

- Pure Domain Layer
- Contains: Intermediate Representation (IR) models

---

### ⚙️ Application Logic (Features & Widgets)

- User Interaction & Composition
- Contains:
  - Features: Actions like "Upload Source" or "Edit Spec Property"
  - Widgets: Complex UI blocks like "IR Visualizer" or "Code Preview"

---

### 🗺️ View Layer (Pages)

- Routing & Composition
- Contains: Full application views assembled from widgets and features.

---

### 🧱 Foundation (Shared & App)

- Infrastructure & Toolkit
- Contains:
  - Shared: Generic UI Kit, Fetch clients, and low-level utils
  - App: Global providers, styles, and store initialization

---

### 🧩 Project Structure

```
src/
├── app/          # Global setup (providers, styles)
├── pages/        # Route-level composition
├── widgets/      # Big autonomous blocks
├── features/     # User actions with business value
├── entities/     # Business logic & Domain models
├── shared/       # Reusable toolkit (UI Kit, API)
└── main.tsx      # Entry point
```

---

## 🔄 CI / CD

- **CI**: GitHub Actions on every push
- **CD (prod)**: triggered by `v*` git tags or manual run
- **Image**: `ghcr.io/volodymyr-oleksiienko/spec-forge-front`
- **Deploy**: Docker Compose on production server

---

## ⚖️ License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

### Special licensing

If you require **special licensing conditions** (e.g. commercial use, closed-source distribution, or other exceptions),
**you must contact the project author directly** to discuss alternative licensing options.

## 🤝 Contributing

Contributions are welcome! To keep the codebase clean and the history readable, please follow these steps:

### 1. The Workflow

1. Fork the project and create your feature branch:
   ```bash
   git checkout -b feat/amazing-feature
   ```
2. Code your changes.
3. Format your code (see below).
4. Verify the production build:
   ```bash
   npm run build
   ```
5. Submit a Pull Request.

### 2. Code Style (Linter)

We use **ESLint** for logic and **Prettier** for code style.
The CI pipeline will fail if these standards are not met.

- Manual Fix: Run `npm run lint`
- Automation: Husky and lint-staged format your code automatically on git commit.
- IDE Setup: Install the ESLint and Prettier plugins and enable "Format on Save."

### 3. Automated Checks

Every Pull Request triggers a CI pipeline to ensure code integrity:

- **Style Enforcement (All Branches):** The build will fail if there are any linting errors or if the TypeScript compiler finds type mismatches.
- **Verification:**
  - **Main Branch:** Fast-path verification of the production build.
  - **Develop Branch:** Full deep-scan including **SonarCloud** static analysis for code smells and maintainability.
