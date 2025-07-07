CropLynx
About
CropLynx is an AI-powered agricultural assistant designed to help modern farmers optimize fertilizer recommendations, monitor plant health, and make informed decisions for maximizing crop yield. The system leverages advanced machine learning models and knowledge graphs to provide personalized, real-time support for different plant types and soil conditions.

Features
AI-based fertilizer recommendations tailored to plant type, soil, and growth stage

Plant disease detection via image upload and analysis

Integration of knowledge graph for personalized user profiles and recommendations

Voice-first assistant for hands-free interaction

Interactive visual elements like fertilizer calendars, compatibility bars, and soil pH graphs

E-commerce marketplace integration for seamless product ordering

Data insights and progress tracking for smarter farming decisions

Technologies Used
Frontend: React, Vite, ShadCN UI

Backend: Node.js, Express.js

AI & ML: Replicate API for plant disease detection, GROQ API for chat and recommendations

Database: JSON-based user profiles (can be upgraded to real DB)

Deployment: GitHub for source control, environment variables for API keys

Others: REST API, Knowledge Graph for user data modeling

Getting Started
Prerequisites
Node.js (version 16 or later)

npm or yarn package manager

API keys for Replicate and GROQ services

Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/YourUsername/croplynx.git
cd croplynx
Install dependencies:

bash
Copy
Edit
npm install
# or
yarn install
Create a .env file in the root directory and add your API keys:

ini
Copy
Edit
REPLICATE_API_KEY=your_replicate_api_key_here
GROQ_API_KEY=your_groq_api_key_here
Start the development server:

bash
Copy
Edit
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser to use the application.

Usage
Use the AI assistant to ask questions about plants, fertilizers, and soil.

Upload images of plants for disease detection.

View fertilizer recommendations and add products to your cart.

Monitor your plant’s growth stage and soil conditions through visual graphs.

Manage your favorites and purchase history in the marketplace.
