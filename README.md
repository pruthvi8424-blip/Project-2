<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ChainTrust: Blockchain-Powered Product Authenticity 

**ChainTrust** is a decentralized application designed to combat counterfeit products. It combines a simulated blockchain ledger with AI-powered visual analysis and market intelligence to verify product authenticity securely.

## Features 

* **Admin Panel (Register):** Register new products onto the secure ledger (simulated via `localStorage`) with a unique Serial ID, Name, and Manufacturer Wallet Address.
* **Scanner (Verify):** Check a product's authenticity by entering its serial number to ensure it hasn't been duplicated or counterfeited.
* **AI Image Analysis:** Upload photos of product packaging, seals, or logos. Our integrated AI (via OpenRouter) acts as an expert product inspector to detect physical anomalies indicating counterfeits.
* **Market Intelligence:** Discover recent trends and new reporting on counterfeit goods using our integrated AI search feature.

## Technology Stack 

* **Frontend:** React 19, Vite, TypeScript, Tailwind CSS
* **Blockchain Simulation:** Web Storage API (`localStorage`) with simulated network latency
* **AI Integration:** OpenRouter API (supporting `gpt-4o-mini` and `mistral-7b-instruct` models)

## Setup & Run Locally 

**Prerequisites:** Node.js

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   The application requires an OpenRouter API key for the AI functionality. Create an `.env` or `.env.local` file in the root directory and add your API key:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Access the App:** Open the local URL provided in your terminal.

## How it Works ⚙️

1. **Register:** Go to the "Register" tab to create your products. They will be logged securely in our simulated ledger.
2. **Verify & Inspect:** In the "Verify" tab, scan a serial code or manually input it to confirm its authenticity. We ensure codes can't be reused infinitely. You can also upload a product image for AI analysis of its packaging.
3. **Insights:** Jump into the "Insights" tab to ask our intelligence assistant about recent counterfeit trends for specific items or manufacturers.
