# 📦 Warehouse Management System (WMS)

A full-stack **Warehouse Management System** built with React and Node.js, featuring QR code generation, camera-based scanning, real-time slot management, and role-based access control.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Features

### 📋 Product Management
- **Add Products** with name, description, quantity, origin, and destination
- **Photo Capture** via device camera or file upload
- **QR Code Generation** — automatically generates a unique QR code for every product
- **QR Code Download** — download product QR codes as PNG images
- **Auto-allocation** — products are automatically assigned to available warehouse slots
- **Custom Allocation** — admins can manually assign products to specific slots

### 📷 QR Scanner
- **Camera-based QR scanning** to quickly look up products
- Works on both desktop and mobile browsers

### 🏭 Warehouse View
- **Visual warehouse layout** showing all areas and slots
- Real-time **slot occupancy** status (occupied / available)
- Color-coded slot indicators

### 🔧 Slot & Area Management (Admin)
- **Create and manage warehouse areas** (e.g., Zone-A, Zone-B)
- **Create slots** within areas with custom naming
- **Delete slots and areas** as needed

### 👤 Role-Based Access
- **Admin** — full access to all features including slot management, product deletion, and custom allocation
- **Employee** — add products, scan QR codes, and view the warehouse

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|------------------------------------------|
| Frontend   | React 19, TailwindCSS 3, Lucide Icons   |
| Backend    | Node.js, Express 5                       |
| Database   | MongoDB with Mongoose                    |
| QR Codes   | `qrcode` (generation), `html5-qrcode` (scanning) |
| Camera     | MediaDevices API (getUserMedia)          |

---

## 📁 Project Structure

```
WMS2/
├── backend/                  # Express.js API server
│   ├── models/
│   │   ├── Area.js           # Warehouse area schema
│   │   ├── Product.js        # Product schema
│   │   ├── Slot.js           # Slot schema
│   │   └── User.js           # User schema
│   ├── routes/
│   │   └── api.js            # All API endpoints
│   ├── server.js             # Express server entry point
│   └── package.json
│
├── warehouse-system/         # React frontend (Create React App)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/         # Login form
│   │   │   ├── common/       # Header, StatsCard, TabButton
│   │   │   ├── management/   # Area & slot CRUD
│   │   │   ├── products/     # Product form, list, scanner, camera
│   │   │   └── warehouse/    # Warehouse grid view
│   │   ├── hooks/            # useAuth, useWarehouse
│   │   ├── utils/
│   │   │   ├── api.js        # API client utilities
│   │   │   └── qrGenerator.js # QR code generation & download
│   │   └── WarehouseQRSystem.jsx  # Main app component
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017`

### 1. Clone the Repository

```bash
git clone https://github.com/Codinggenie2004/WMS.git
cd WMS
```

### 2. Start the Backend

```bash
cd backend
npm install
node server.js
```

The API server will start on **http://localhost:5000**.

### 3. Start the Frontend

```bash
cd warehouse-system
npm install
npm start
```

The React app will start on **http://localhost:3000**.

---

## 📱 Mobile Access

Both the backend and frontend can be accessed from mobile devices on the same network:

1. Find your machine's local IP address
2. Access the frontend at `http://<YOUR_IP>:3000`
3. Ensure the backend is also accessible at `http://<YOUR_IP>:5000`

> **Note:** Camera features (QR scanning, photo capture) require HTTPS or `localhost`. On mobile, you may need to use HTTPS for camera access.

---

## 🔑 API Endpoints

| Method | Endpoint               | Description                     |
|--------|-------------------------|---------------------------------|
| POST   | `/api/auto-store`       | Add product with auto-allocation |
| POST   | `/api/allocate-custom`  | Add product to a specific slot   |
| GET    | `/api/products`         | Get all products                 |
| DELETE | `/api/products/:id`     | Delete a product                 |
| GET    | `/api/slots`            | Get all slots                    |
| POST   | `/api/slots`            | Create a new slot                |
| DELETE | `/api/slots/:id`        | Delete a slot                    |
| GET    | `/api/areas`            | Get all areas                    |
| POST   | `/api/areas`            | Create a new area                |
| DELETE | `/api/areas/:id`        | Delete an area                   |
| POST   | `/api/login`            | User authentication              |

---

## 📄 License

ISC
