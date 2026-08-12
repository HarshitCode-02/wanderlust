# 🏠 Wanderlust - Airbnb Clone

A full-stack web application that mimics the core functionality of Airbnb, allowing users to browse, create, edit, and delete property listings. Built with **Express.js**, **MongoDB**, and **EJS** templating.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Utilities](#utilities)
- [Environment Configuration](#environment-configuration)
- [Scripts](#scripts)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## ✨ Features

- 🔍 **Browse Listings** - View all available property listings
- ➕ **Create Listings** - Add new properties with details (title, description, price, location, country)
- ✏️ **Edit Listings** - Modify existing property information
- 🗑️ **Delete Listings** - Remove listings from the platform
- 📊 **Database Seeding** - Populate database with initial sample data
- ✅ **Input Validation** - Server-side validation using Joi schema
- 🎨 **Responsive Design** - Clean, user-friendly interface
- 📱 **Mobile Friendly** - Responsive layouts for all devices
- ⚠️ **Error Handling** - Comprehensive error handling and user feedback

## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** (v5.2.1) - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** (v9.9.2) - MongoDB object modeling

### Frontend
- **EJS** (v6.0.1) - Templating engine
- **EJS-Mate** (v4.0.0) - Express.js layout support for EJS
- **CSS** - Custom styling
- **JavaScript** - Client-side interactivity

### Utilities
- **Joi** (v18.2.3) - Schema validation
- **Method-Override** (v3.0.0) - HTTP method override middleware
- **Nodemon** (v3.1.14) - Development auto-reload

## 📁 Project Structure

```
AIRBNB/
├── app.js                          # Main application file
├── package.json                    # Project dependencies & scripts
├── schema.js                       # Joi validation schemas
│
├── models/
│   └── listing.js                  # Listing Mongoose schema
│
├── init/
│   ├── index.js                    # Database initialization
│   └── data.js                     # Sample listing data
│
├── utils/
│   ├── ExpressError.js             # Custom error class
│   └── wrapAsync.js                # Async error wrapper
│
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs        # Main layout template
│   ├── includes/
│   │   ├── navbar.ejs              # Navigation bar component
│   │   └── footer.ejs              # Footer component
│   └── listings/
│       ├── index.ejs               # All listings page
│       ├── show.ejs                # Single listing details
│       ├── new.ejs                 # Create listing form
│       ├── edit.ejs                # Edit listing form
│       └── error.ejs               # Error page
│
└── public/
    ├── css/
    │   └── style.css               # Custom styling
    └── js/
        └── script.js               # Client-side scripts
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local or Atlas connection)

### Step 1: Clone the Repository
```bash
git clone https://github.com/HarshitCode-02/AIRBNB-CLONE.git
cd AIRBNB-CLONE
```

### Step 2: Install Dependencies
```bash
npm install
```

## ⚙️ Setup

### Step 1: MongoDB Setup
Ensure MongoDB is running on your local machine at `mongodb://127.0.0.1:27017/` or update the connection string in `app.js`:

```javascript
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
```

**For MongoDB Atlas (Cloud):** Replace with your connection string:
```javascript
const MONGO_URL = "mongodb+srv://username:password@cluster.mongodb.net/wanderlust";
```

### Step 2: Environment Variables (Optional)
Create a `.env` file in the root directory for sensitive configuration:
```env
MONGO_URL=mongodb://127.0.0.1:27017/wanderlust
PORT=8080
```

Then update `app.js` to use `process.env.MONGO_URL`

## 📖 Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Seed Database with Sample Data
```bash
npm run seed
```

The application will start on `http://localhost:8080` by default.

## 🌐 API Routes

### Listings

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Home page |
| GET | `/listings` | Get all listings (Index) |
| GET | `/listings/new` | Show create listing form (New) |
| POST | `/listings` | Create a new listing (Create) |
| GET | `/listings/:id` | View listing details (Show) |
| GET | `/listings/:id/edit` | Show edit listing form (Edit) |
| PUT | `/listings/:id` | Update a listing (Update) |
| DELETE | `/listings/:id` | Delete a listing (Delete) |

### Example Usage

**Get all listings:**
```
GET http://localhost:8080/listings
```

**View single listing:**
```
GET http://localhost:8080/listings/[listing-id]
```

**Create new listing (HTML form):**
```
POST http://localhost:8080/listings
Content-Type: application/x-www-form-urlencoded

listing[title]=Beautiful House&listing[description]=...
```

## 📊 Database Schema

### Listing Schema
```javascript
{
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    filename: String,
    url: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
}
```

## 🔧 Utilities

### ExpressError
Custom error class for consistent error handling:
```javascript
throw new ExpressError(400, "Invalid listing data");
```

### wrapAsync
Wrapper function to handle async errors in route handlers:
```javascript
app.get("/listings", wrapAsync(async (req, res) => {
  // Route logic
}));
```

### Joi Validation
Schema validation in `schema.js`:
```javascript
const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0)
  }).required()
});
```

## 🔐 Environment Configuration

Key configuration in `app.js`:
- **View Engine**: EJS
- **Views Directory**: `./views`
- **Static Files**: `./public`
- **URL Encoding**: Extended (for nested objects)
- **Method Override**: `_method` parameter

## 📝 Scripts

- `npm start` - Run production server
- `npm run dev` - Run development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests (currently not configured)

## 🚧 Future Enhancements

- [ ] User Authentication (Login/Register)
- [ ] User Profiles & Bookmarks
- [ ] Reviews & Ratings System
- [ ] Image Upload Functionality
- [ ] Search & Filter Features
- [ ] Advanced Geolocation Features
- [ ] Payment Integration (Stripe)
- [ ] Admin Dashboard
- [ ] Real-time Notifications
- [ ] Unit & Integration Tests
- [ ] API Documentation (Swagger)
- [ ] Deployment (Heroku/AWS)

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this project and submit pull requests.

## 📧 Contact & Support

For questions or support, please open an issue on GitHub or contact the project maintainer.

---

**Built with ❤️ by Harshit Kushwaha**

Repository: [GitHub - AIRBNB-CLONE](https://github.com/HarshitCode-02/AIRBNB-CLONE)
