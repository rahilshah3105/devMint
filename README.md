# DevMint — The Ultimate Developer Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React Version](https://img.shields.io/badge/React-19.2.0-blue?logo=react)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)](https://vite.dev/)
[![TailwindCSS Version](https://img.shields.io/badge/TailwindCSS-4.1.13-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![GitHub stars](https://img.shields.io/github/stars/rahilshah3105/code-line-formatter.svg?style=social)](https://github.com/rahilshah3105/code-line-formatter)

**DevMint** is a high-performance, developer-focused suite of utilities designed to speed up daily workflows. Featuring formatting, conversion, code execution, regex testing, hash generation, and automated testing tools, DevMint provides all the essential tools developers need in one centralized, privacy-first, local-execution workspace.

🌐 **Live Website**: [https://devmint-tools.vercel.app](https://devmint-tools.vercel.app)

---

## 💡 The Problem It Solves

Developers constantly need small utility tools—formatting JSON, decoding JWTs, base64 encoding/decoding, checking diffs, or writing regex patterns. The current landscape is fragmented:
* **Privacy Risks**: Many online utility tools upload your payload or code snippet to a backend server. If you format a JSON string containing client data or a production token, that data is exposed.
* **Bad UX and Ads**: Most web utility tools are filled with distracting ads, slow load times, and poor styling.
* **Context Switching**: Navigating between multiple websites for different tools disrupts development concentration.

**DevMint** solves this by centralizing a wide collection of tools into a single web application. With an emphasis on **local-first execution**, your data never leaves your browser, ensuring absolute security, instant feedback, and maximum privacy.

---

## 🚀 Key Features

DevMint is packed with utility tabs organized into clear functional areas:

### 1. Code Editors & Formatters
* **Code Formatter**: Instantly clean up code scripts for various formats.
* **Multi-Language Editor**: A robust editor panel that lets you draft, edit, and examine script snippets.
* **Diff Checker**: Side-by-side comparison of text and code with precise highlights.
* **Code Shrinker**: Minify and shrink code outputs for easier sharing and smaller payloads.

### 2. Converters & Decoders
* **JSON to Types**: Generate strict TypeScript interfaces or type definitions directly from JSON payloads.
* **JSON Toolkit**: Fast parser, formatter, and validation tools for nested structures.
* **Base64 Converter**: Decode and encode payloads or text headers securely.
* **URL Encoder/Decoder**: Clean up parameters and query strings to avoid malformed URL errors.
* **JWT Decoder**: Inspect JSON Web Tokens (JWT) payload, header details, and signatures entirely client-side.
* **Color Converter**: Seamlessly translate colors between HEX, RGB, and HSL values.
* **Number Base Converter**: Convert values across binary, octal, decimal, and hexadecimal bases.
* **Timestamp Converter**: Fast conversions between Unix timestamps and human-readable dates.

### 3. Execution & Validation Tools
* **JavaScript Runner**: Execute JavaScript logic snippets in a safe sandbox directly in your browser.
* **Remote Runner**: Run backend code snippets or execute experiment scripts.
* **Regex Tester**: Check regular expressions and view matches in real time with syntax highlighting.
* **Hash & UUID Generator**: Create MD5, SHA-256 checksums, and standard UUID/GUID identifiers.
* **Lorem Ipsum Generator**: Quick placeholder text constructor for design mockups.

### 4. AI & Productivity Accelerators
* **Prompt Improver**: Optimize raw prompts into highly structured inputs for LLMs.
* **API Test Case Generator**: Auto-generate robust test scenarios and edge cases for API endpoints.
* **Mock Data Generator**: Quickly generate mock records for schemas, APIs, and seeding.
* **JSON Schema Validator**: Validate JSON data structures against Schema declarations.
* **HTTP Request Builder**: Compose, verify, and inspect API request headers and parameters.
* **Testing Scaffolds**: Auto-generate boilerplates for unit tests and E2E Cypress/Playwright flows.
* **Log Analyzer**: Clean up, parse, and highlight key events in raw production logs.
* **Git PR Helper**: Generate formatted descriptions and change logs for Pull Requests.

---

## 🛠️ Tech Stack

DevMint is engineered with a modern, high-performance stack:
* **Frontend Library**: [React 19](https://react.dev) — Component-driven architecture utilizing modern hooks.
* **Build System**: [Vite 7](https://vite.dev) — Ultra-fast HMR and building.
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com) & Vanilla CSS for elegant layouts.
* **Editor Integration**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) — Embeds VS Code's editor experience (intellisense, formatting, keymaps).
* **Routing**: [React Router v7](https://reactrouter.com) — Fast Client-Side Routing.
* **Icons**: [Lucide React](https://lucide.dev) — Clean, consistent iconography.

---

## 📦 Installation & Setup

Set up DevMint locally in less than 2 minutes:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) (v18+ recommended) and `npm` installed.

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/rahilshah3105/code-line-formatter.git
   cd code-line-formatter
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` to see it in action.

4. **Build for Production**:
   ```bash
   npm run build
   ```
   This generates the optimized, production-ready bundle in the `dist` directory.

---

## 📖 Usage Instructions

* **Select a Tool**: Use the sidebar navigation to jump between different category suites.
* **Local Processing**: Simply paste your text or script into the editor components. Calculations and formatters execute instantly client-side.
* **Generate Sitemap**: The application utilizes a prebuild script to automatically compile a sitemap from configured routes.
  * To run it manually: `npm run sitemap:generate`

---

## 🔍 Google Search Console & SEO Verification

To index DevMint and show its pages on Google, Google Search Console ownership verification is fully configured in this repository.

### Setup Steps:
1. **Deploy to production** (e.g. Vercel, Netlify, or custom server) using `npm run build`.
2. **Open [Google Search Console](https://search.google.com/search-console)** and choose the **URL prefix** property type.
3. Enter your domain: `https://devmint-tools.vercel.app/`
4. **Choose Verification Method**:
   * **HTML File Upload**: Google Search Console provides a verification file. A pre-configured verification file exists at `public/googled1a543d80e38cfa9.html`. If you use this file, verify it's accessible at `https://devmint-tools.vercel.app/googled1a543d80e38cfa9.html`.
   * **HTML Tag Method**: You can copy the `<meta name="google-site-verification" content="..." />` tag from your console and paste it into [index.html](index.html). The template currently has a verification tag prepared in the head.
5. Click **Verify** in the console.
6. **Submit Sitemap**:
   * Go to **Sitemaps** in the Search Console dashboard.
   * Input the path `sitemap.xml` and click **Submit**.
   * The crawler will discover all dynamic tool routes (e.g., `/formatter`, `/json-types`, etc.) mapped out in `src/utils/seo.js`.

---

## 🖼️ Screenshots

*Include visual previews of the application interface here.*

| Sidebar Navigation & Dashboard | Code Formatter in Action |
| --- | --- |
| ![Sidebar Placeholder](https://via.placeholder.com/600x350?text=DevMint+Dashboard) | ![Formatter Placeholder](https://via.placeholder.com/600x350?text=Code+Formatter+Editor) |

| JSON Toolkit Utility | Responsive Layout Preview |
| --- | --- |
| ![JSON Toolkit Placeholder](https://via.placeholder.com/600x350?text=JSON+Toolkit+Interface) | ![Responsive Placeholder](https://via.placeholder.com/300x500?text=Mobile+View) |

---

## 🔮 Future Improvements

We plan to expand the suite with the following additions:
* [ ] **Progressive Web App (PWA) Support**: Enable complete offline execution for all tools.
* [ ] **Custom Plugin API**: Allow developers to build and run their own mini web-based utilities within the interface.
* [ ] **Secure Sync Workspace**: Optional cloud backup and team sharing for runners/templates using WebSockets (`collab-server`).
* [ ] **Local DB Integration**: Save recent state, history, and workspace configurations in indexedDB.

---

## ✍️ Author

Created by Rahil Shah (rahilshah3105)

* **GitHub**: [@rahilshah3105](https://github.com/rahilshah3105)
* **Project Repository**: [code-line-formatter](https://github.com/rahilshah3105/code-line-formatter)

Feel free to open issues or pull requests to suggest new utilities and optimizations!
