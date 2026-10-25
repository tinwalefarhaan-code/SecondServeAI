# 🍃 SecondServeAI
### Turning Surplus Food Into Shared Hope.

<p align="center">
  <strong>A smarter way to connect surplus food with communities that need it.</strong>
</p>

<p align="center">
  <a href="YOUR_LIVE_DEMO_URL">🌐 Live Demo</a> ·
  <a href="YOUR_DEMO_VIDEO_URL">▶️ Watch Demo</a> ·
  <a href="YOUR_GITHUB_REPOSITORY_URL">💻 Source Code</a> ·
  <a href="#-getting-started">🚀 Get Started</a>
</p>

---

## 🌍 About the Project

Every day, perfectly usable food can go to waste while individuals and community organizations struggle to access meals.

**SecondServeAI** is a food redistribution platform designed to help bridge this gap by connecting food donors with people and organizations that can make use of surplus food.

The goal is simple: make food sharing easier, improve visibility into available donations, and help surplus food find a second purpose instead of going to waste.

> **Our mission:** Give surplus food a second chance and help build a world where less food is wasted and more people are supported.

## ✨ Key Features

- 🍱 **Food Donation Listings** — Organize surplus food into listings with relevant details.
- 🖼️ **Food Image Uploads** — Support food photos through Cloudinary integration.
- 🤝 **Food Redistribution** — Help donors and recipient organizations discover opportunities to share surplus food.
- 📦 **Listing Management** — Track donation quantities, reservations, collection progress, and availability.
- 🎨 **Modern User Interface** — A polished, responsive interface designed for a clear and engaging experience.
- 🔒 **Environment-Based Configuration** — Keep API credentials in environment variables rather than exposing them in frontend code.
- 🧪 **API Tests** — Automated tests help verify core server behavior.

## 💡 The Problem We Address

Food waste and food insecurity exist at the same time. Surplus food may be available, but potential recipients may not know where it is, how much is available, or when it can be collected.

SecondServeAI aims to reduce this coordination gap with a centralized food-sharing experience.

### 🎯 Who Can Benefit?

- **Food donors:** Restaurants, bakeries, markets, and other food providers with surplus food.
- **Community organizations:** Food banks, charities, and community kitchens.
- **Recipients:** People who can benefit from accessible food redistribution programs.

## ⚙️ How It Works

1. **List:** A donor creates a listing for available surplus food.
2. **Discover:** Potential recipients can view available listings.
3. **Reserve:** A recipient can reserve an available quantity where supported.
4. **Coordinate:** Donors and recipients arrange collection.
5. **Track:** Listing quantities and collection status help organize the process.

*The exact workflow depends on the features enabled in the current application.*

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Responsive styling and interface design |
| JavaScript | Frontend interactions |
| Node.js | Server runtime |
| Native Node.js HTTP | Backend API and request handling |
| Cloudinary | Cloud-based food image storage |
| JSON | Local listing data storage |
| Node.js test runner / project tests | Automated API testing |

## 🖥️ Getting Started

Run SecondServeAI locally on your computer.

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Git](https://git-scm.com/) installed
- A [Cloudinary](https://cloudinary.com/) account for image uploads

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd SecondServeAI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Replace the example values with your own Cloudinary credentials.

**Security:** Never commit `.env` to GitHub. The project `.gitignore` should exclude it.

### 4. Start the application

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

### 5. Check server health

```text
http://localhost:3000/api/health
```

This endpoint reports whether the server is responding and whether Cloudinary settings are detected. A successful configuration check does not, by itself, guarantee that an image upload will succeed.

## 🧪 Testing

Run the project's automated tests:

```bash
node --test tests/api.test.js
```

Use the test results to verify the current API behavior before submitting or deploying the application.

## 🔐 Security Practices

- Store secrets in environment variables.
- Keep `.env` out of version control.
- Do not expose Cloudinary API secrets in browser-side JavaScript.
- Validate image types and file sizes on the server.
- Test upload functionality using valid credentials before deployment.

## 🚀 Future Scope

- AI-assisted food categorization and listing descriptions.
- Smarter donor-to-recipient matching.
- Pickup scheduling and notifications.
- Food freshness and expiry awareness.
- Impact analytics for food saved and meals supported.
- Location-aware discovery of available donations.

*These are potential future enhancements, not claims that every feature is already implemented.*

## 🌱 Our Vision

We believe technology can make food redistribution easier, more transparent, and more accessible.

SecondServeAI is a step toward a more connected food-sharing ecosystem—where surplus food becomes an opportunity to support communities.

**Less waste. More sharing. A better second serve.**

---

<p align="center">
  <strong>Built with purpose ❤️ for a world with less food waste.</strong>
</p># SecondServeAI
SecondServeAI is an AI-powered food redistribution platform that connects food donors with people and organizations in need, helping reduce food waste and fight hunger through smarter food sharing.
