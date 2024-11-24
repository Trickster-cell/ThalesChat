
# Quantum Secure Real-Time Chat Application

This repository contains the **Frontend** and **Backend** of a full-stack application built using **React** and **Node.js**. The application uses **MongoDB** as the database, and **MongoDB Compass** is required for managing the database locally.

## Project Structure

```
.
├── Frontend/   # React-based Frontend
├── Backend/    # Node.js-based Backend
```

---

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [MongoDB Compass](https://www.mongodb.com/products/compass) (for database management)

---

## Setup Instructions

Follow the steps below to set up and run the application on your local machine:

### Step 1: Clone the Repository

```bash
git clone https://github.com/Trickster-cell/ThalesChat.git
cd ThalesChat
```

### Step 2: Install Dependencies

#### Frontend

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

#### Backend

1. Open a new terminal and navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

### Step 3: Setup Environment Variables

Sample `.env` files are provided in both `Frontend` and `Backend` folders. Update them as needed:

#### Frontend `.env`
Located in the `Frontend` folder, the sample `.env` file looks like this:

```env
VITE_SERVER=http://localhost:3000
```

- `VITE_SERVER`: URL of the Backend server.

#### Backend `.env`
Located in the `Backend` folder, the sample `.env` file looks like this:

```env
MONGO_URI=mongodb://127.0.0.1:27017
JWT_SECRET=JWTSECRETKEY
ADMIN_SECRET_KEY=sample_admin_key
NODE_ENV=DEVELOPMENT
CLIENT_URL=http://localhost:5173/
CLOUDINARY_CLOUD_NAME=cloudinarycloudname
CLOUDINARY_API_KEY=cloudinaryapikey
CLOUDINARY_API_SECRET=cloudinaryapisecret
```

- `MONGO_URI`: MongoDB connection URI. Replace `your-database-name` with your desired database name.
- `JWT_SECRET`: A secret key for JWT authentication.
- `ADMIN_SECRET_KEY`: Secret key for admin operations.
- `NODE_ENV`: The environment mode (`DEVELOPMENT` or `PRODUCTION`).
- `CLIENT_URL`: URL of the Frontend.
- `CLOUDINARY_*`: Cloudinary configuration for file uploads.

---

### Step 4: Start MongoDB

1. Ensure that MongoDB is installed and running on your system.
2. Open **MongoDB Compass** and connect to your local MongoDB server (default: `mongodb://localhost:27017`).
3. Create a database if needed (the Backend may handle this automatically based on configuration).

---

### Step 5: Run the Application

#### Frontend

1. Start the React development server:
   ```bash
   cd Frontend
   npm run dev
   ```
2. The Frontend should be accessible at `http://localhost:5173`.

#### Backend

1. In the second terminal, start the Node.js server:
   ```bash
   cd Backend
   npm run dev
   ```
2. The Backend API should be running at `http://localhost:3000`.

---

## Scripts

### Frontend

- `npm run dev`: Starts the React development server.

### Backend

- `npm run dev`: Starts the Node.js server with hot reloading (if using nodemon).

---

## Troubleshooting

- **MongoDB Connection Issues**: Ensure MongoDB is running and accessible via the `MONGO_URI` defined in the `.env` file.
- **Port Conflicts**: Ensure the ports `3000` (Backend) and `5173` (Frontend) are not in use by other applications.
- **Environment Variables**: Double-check the `.env` files for typos or missing values.

---
