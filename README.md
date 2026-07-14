# AI Saree Virtual Try-On System

## 📌 About the Project

Shopping for sarees online often lacks the personalized touch of a physical fitting room, leaving customers unsure of how a specific saree might look on them. The **AI Saree Virtual Try-On System** bridges this gap by enabling users to upload a single full-body image and virtually try on a variety of sarees powered by advanced AI technology.

This application provides a seamless, intuitive, and modern shopping experience. Users can effortlessly browse through a diverse collection of sarees, generating realistic try-on results instantly without the need to re-upload their photo.

---

## ✨ Key Features

- **Single Upload Convenience:** Upload a full-body image just once.
- **Interactive Browsing:** Explore a wide variety of sarees via an intuitive horizontal slider.
- **Instant AI Try-On:** Generate realistic, AI-powered virtual try-on images on the fly.
- **Seamless Switching:** Switch between different sarees instantly without re-uploading your image.
- **Secure Storage:** Reliable storage of both uploaded and generated images utilizing Cloudinary.
- **Try-On History:** Keep track of your virtual try-on sessions with MongoDB integration.
- **Download Option:** Easily download generated try-on images to your device.
- **Fully Responsive:** A beautifully designed interface optimized for both desktop and mobile devices.

---

## 🛠️ Technology Stack

### Frontend
- **React.js** (UI Library)
- **Vite** (Build Tool)
- **Context API** (State Management)
- **Axios** (HTTP Client)

### Backend
- **Node.js** (Runtime Environment)
- **Express.js** (Web Framework)

### Database & Storage
- **MongoDB** (NoSQL Database for storing history)
- **Cloudinary** (Cloud storage for images)

### AI Integration
- **FAL.ai** (Virtual Try-On Model for generating realistic draping)

---

## ⚙️ How It Works

1. **Upload:** The user uploads a full-body image.
2. **Store:** The image is securely uploaded to Cloudinary.
3. **Select:** The user chooses a saree from the available online collection.
4. **Process:** The selected saree and the user's image are processed through our integrated AI model (FAL.ai).
5. **Generate:** A new, realistic try-on image is generated and displayed on the screen.
6. **Explore:** Users can seamlessly continue trying on different sarees using the originally uploaded photo.

---

## 📁 Folder Structure

```text
AI-Saree-Virtual-Try-On-System
│
├── client/                 # Frontend React Application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Backend Express Application
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository

```bash
git clone <repository-url>
cd AI-Saree-Virtual-Try-On-System
```

### 2. Install Dependencies

**For Frontend:**
```bash
cd client
npm install
```

**For Backend:**
```bash
cd ../server
npm install
```

### 3. Environment Variables

Create a `.env` file inside the `server` folder and configure the following keys:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=<your_mongodb_connection_string>

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

# AI Integration
AI_PROVIDER=fal
FAL_KEY=<your_fal_ai_api_key>
```

### 4. Running the Application

**Start the Backend Server:**
```bash
cd server
npm run dev
```

**Start the Frontend Client:**
```bash
cd ../client
npm run dev
```

---

## 🔮 Future Improvements

- **Expanded Wardrobe:** Support for more clothing categories beyond sarees.
- **User Authentication:** Secure login and registration for personalized experiences.
- **Wishlist:** Allow users to save their favorite sarees for future reference.
- **Model Enhancements:** Continuously integrate better AI models for even more realistic and accurate draping.
- **Performance Optimization:** Implement caching and background processing for faster image generation.

---

## 👥 Team

Developed as part of an internship project by:

- **Sidramappa**
- **Sagar**


---

## 📄 License

This project was developed for educational and internship purposes.
