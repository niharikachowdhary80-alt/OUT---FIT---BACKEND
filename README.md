# Out→Fit 👗

AI-powered outfit suggester with wardrobe manager and weather integration.

## Features
- 👔 Wardrobe manager (add/remove clothes)
- 🌤 Real-time weather for your city
- ✨ AI outfit suggestions based on weather & occasion

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your OpenAI API key
Create a `.env` file:
```
OPENAI_API_KEY=your_key_here
```

### 3. Run locally
```bash
node server.js
```
Open http://localhost:5000

## Deploy to Render
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variable**: `OPENAI_API_KEY` = your key
