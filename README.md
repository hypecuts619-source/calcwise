# CalcWise

CalcWise is a modern, comprehensive suite of specialized calculators built with precision and ease of use in mind. Whether you're an industry professional, a student, or simply looking to make informed personal decisions, CalcWise offers verified mathematical tools wrapped in a clean, user-friendly interface.

## 🚀 Features

*   **Comprehensive Library**: A massive collection of high-precision calculators spanning various categories (Finance, Health, Math, Conversion, and more).
*   **Goal Seek Mechanism**: Powerful reverse-calculation capabilities allowing you to find the required input variables to hit a specific target or goal.
*   **Scenario Comparison**: Save multiple calculation scenarios to compare different variations and inputs side-by-side.
*   **Local History Tracking**: Automatically remembers your recently used calculators securely via client-side `localStorage`.
*   **Dynamic SEO Guides**: Each calculator features an in-depth, automatically generated read-time guide and article to help you better understand the calculations, formula components, and strategic applications.
*   **Share & Embed**: Easily share your exact calculation state via URL or grab an HTML embed code to integrate the calculator into your own website.
*   **Print & Export**: Built-in support to cleanly print your calculation results and scenarios without UI clutter.
*   **Global Formatting**: Built-in currency switching and localization settings for seamless international utility.

## 💻 Tech Stack

*   **Framework**: [React 18](https://react.dev/) powered by [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Routing**: [React Router](https://reactrouter.com/)

## 📂 Architecture overview

*   **`/src/pages/`**: Contains the main page views such as `Home.tsx`, `CategoryPage.tsx`, and `CalculatorDetail.tsx` (the dynamic page powering individual tools).
*   **`/src/components/calculator.tsx`**: The core interactive widget engine that renders calculation inputs, performs goal-seeking, and tabulates scenario comparisons.
*   **`/src/components/SEOArticleBlock.tsx`**: Dynamic article generator that creates 500+ word comprehensive guides based on the calculator's metadata and required inputs.
*   **`/src/constants.ts`**: The master registry containing metadata, IDs, formulas, and category mappings for all the calculators.
*   **`/src/lib/calculatorLogic.ts`**: Houses the strict mathematical models and algorithmic evaluations for every calculator.

## 🛠️ Development

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 📈 Creating a new Calculator

To add a new calculator to the suite:
1. Define the metadata (Title, Slug, Category, SEO descriptions) in `src/constants.ts`.
2. Define the input variables (Type, Constraints, Defaults) in the `INPUT_MAP`.
3. Build the core algorithmic function and map it in `src/lib/calculatorLogic.ts`.

## 📜 License

CalcWise is provided for educational and analytical purposes.
