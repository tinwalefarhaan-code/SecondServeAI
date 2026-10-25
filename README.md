# 🍃 SecondServeAI
### Turning Surplus Food Into Shared Hope.

<p align="center">
  <strong>A smarter way to connect surplus food with communities that need it.</strong>
</p>

<p align="center">
  <a href="https://tinwalefarhaan-code.github.io/SecondServeAI/">🌐 LIVE DEMO</a> ·
  <a href="ADD_YOUR_VIDEO_LINK_HERE">▶️ WATCH DEMO VIDEO</a> ·
  <a href="https://github.com/tinwalefarhaan-code/SecondServeAI">💻 SOURCE CODE</a> ·
  <a href="#-getting-started">🚀 GET STARTED</a>
</p>

---

## 🌍 About the Project

Food waste and food insecurity can exist side by side. While perfectly usable food is discarded, individuals and community organizations may struggle to access meals.

**SecondServeAI** is a food redistribution platform designed to help bridge this gap by connecting food donors with people and organizations that can make use of surplus food.

Our goal is to make food sharing easier, improve visibility into available donations, and help surplus food find a second purpose.

> **Our mission:** Give surplus food a second chance and help build a world where less food is wasted and more people are supported.

## ✨ Key Features

- 🍱 **Food Donation Listings** — Organize surplus food into listings with relevant details.
- 🖼️ **Food Image Uploads** — Cloudinary integration for cloud-based image storage.
- 🤝 **Food Redistribution** — Help donors and recipient organizations discover food-sharing opportunities.
- 📦 **Listing Management** — Track donation quantities, reservations, collection progress, and availability.
- 🎨 **Modern Interface** — A polished, responsive experience designed for clear navigation.
- 🔒 **Environment-Based Configuration** — Keep API credentials out of frontend code.
- 🧪 **Automated Testing** — Tests help verify core server and API behavior.

## 💡 The Problem

Surplus food is not always distributed efficiently to people who could use it. Donors and recipient organizations may lack a convenient way to discover available food, coordinate quantities, and arrange collection.

SecondServeAI aims to reduce this coordination gap through a centralized food-sharing platform.

### 🎯 Who Can Benefit?

- **Food donors:** Restaurants, bakeries, markets, and other food providers.
- **Community organizations:** Food banks, charities, and community kitchens.
- **Recipients:** People who can benefit from accessible food redistribution programs.

## ⚙️ How It Works

1. **List:** A donor creates a listing for available surplus food.
2. **Discover:** Potential recipients explore available listings.
3. **Reserve:** A recipient reserves an available quantity where supported.
4. **Coordinate:** Donors and recipients arrange collection.
5. **Track:** Listing quantities and collection status help organize redistribution.

*The workflow depends on the features enabled in the current application.*

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Responsive styling |
| JavaScript | Frontend interactions |
| Node.js | Server runtime |
| Native Node.js HTTP | Backend API |
| Cloudinary | Cloud-based image storage |
| JSON | Local listing data |
| Node.js tests | Automated API testing |

## 🚀 Live Project

- **Live Website:** [Open SecondServeAI](https://tinwalefarhaan-code.github.io/SecondServeAI/)
- **GitHub Repository:** [Explore the source code](https://github.com/tinwalefarhaan-code/SecondServeAI)
- **Demo Video:** Coming soon.

> **Note:** GitHub Pages serves static files. Backend API features and Cloudinary uploads may require the Node.js server to be deployed separately. Test the live website to confirm which features are available.

## 🖥️ Getting Started

Run SecondServeAI locally on your computer.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- A [Cloudinary](https://cloudinary.com/) account for image uploads

### 1. Clone the repository

```bash
git clone https://github.com/tinwalefarhaan-code/SecondServeAI.git
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

**Security:** Never commit `.env` to GitHub. Keep it excluded in `.gitignore`.

### 4. Start the application

```bash
npm run dev
```

Open the local application at:

`http://localhost:3000`

### 5. Check server health

Visit:

`http://localhost:3000/api/health`

This endpoint checks server availability and whether Cloudinary settings are detected. It does not guarantee that uploads will succeed.

## 🧪 Testing

Run the project's automated tests:

```bash
node --test tests/api.test.js
```

Verify the test results before submitting or deploying the application.

## 🔐 Security Practices

- Store secrets in environment variables.
- Keep `.env` out of version control.
- Never expose Cloudinary API secrets in browser-side JavaScript.
- Validate image types and file sizes on the server.
- Test uploads with valid credentials before deployment.

## 🔮 Future Scope

- AI-assisted food categorization and listing descriptions.
- Smarter donor-to-recipient matching.
- Pickup scheduling and notifications.
- Food freshness and expiry awareness.
- Impact analytics for food saved and meals supported.
- Location-aware discovery of available donations.

*These are potential future enhancements, not claims that every feature is already implemented.*

## 🌱 Our Vision

We believe technology can make food redistribution easier, more transparent, and more accessible.

SecondServeAI is a step toward a connected food-sharing ecosystem where surplus food becomes an opportunity to support communities.

**Less waste. More sharing. A better second serve.**

---

<p align="center">
  <strong>Built with purpose ❤️ for a world with less food waste.</strong>
</p>
