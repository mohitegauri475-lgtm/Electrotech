# THE GIFT EDIT — Full-Stack Application

A luxury Indian bespoke hamper e-commerce and customization studio web application designed in **Stitch** and built with **React 18 + Vite** on the frontend, **Spring Boot 3.x (Java 17)** on the backend, and **Microsoft SQL Server (MSSQL)** with **Flyway** schema migrations.

---

## 🏛️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios
- **Backend:** Spring Boot 3.3.x, Java 17, Spring Security + JWT, Spring Data JPA, Flyway Migrations
- **Database:** Microsoft SQL Server (MSSQL), Flyway versioned migrations (`/database/migrations`)
- **Branding & Design System:**
  - Colors: Royal Indian Wine (`#6E2334`), Champagne Gold (`#D6A85F` / `#EFBF73`), Warm Ivory (`#FFF8F7` / `#FAF7F2`)
  - Fonts: Playfair Display & Plus Jakarta Sans, Google Material Symbols

---

## 📁 Repository Structure

```
ELECTROTECH/
├── database/
│   └── migrations/
│       ├── V1__init_schema.sql       # Version-controlled MSSQL DDL schema
│       └── V2__seed_data.sql         # Initial catalog (boxes, products, hampers, reviews, users)
│
├── backend/
│   ├── src/main/java/com/yourorg/appname/
│   │   ├── config/                   # SecurityConfig (JWT filter chain), CorsConfig
│   │   ├── controller/               # Auth, Boxes, Products, Hampers, CustomHampers, Cart, Orders, Reviews
│   │   ├── dto/
│   │   │   ├── request/              # Login, Register, CustomHamper, CartItem, Order requests
│   │   │   └── response/             # Standard response DTOs and ApiResponse envelope
│   │   ├── entity/                   # JPA Entities (User, BoxOption, Product, Hamper, CustomHamper, etc.)
│   │   ├── exception/                # GlobalExceptionHandler, ResourceNotFoundException, BadRequestException
│   │   ├── mapper/                   # EntityMapper for decoupled entity-to-DTO conversion
│   │   ├── repository/               # Spring Data JPA Repositories
│   │   ├── security/                 # JwtUtil, JwtAuthFilter, CustomUserDetailsService, UserPrincipal
│   │   └── service/                  # Service interfaces and implementations
│   ├── src/main/resources/
│   │   ├── application.properties    # MSSQL datasource, Flyway, JWT, Hibernate config
│   │   └── db/migration/             # Classpath migrations for Flyway
│   └── pom.xml                       # Maven configuration (Java 17, Spring Boot 3.x)
│
├── frontend/
│   ├── public/
│   │   └── logo.svg                  # Brand SVG logo exported from Stitch
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Navbar, Footer, AnnouncementBar
│   │   │   └── layout/               # MainLayout
│   │   ├── constants/                # apiEndpoints, themeConstants
│   │   ├── context/                  # AuthContext, CartContext
│   │   ├── hooks/                    # useAuth, useCart
│   │   ├── pages/
│   │   │   ├── Home/                 # Stitch Home page (Hero, Occasions, Bestsellers, Reviews, Instagram)
│   │   │   ├── CustomizeHamper/      # 5-Step Hamper Customizer Studio with Live 3D Staging
│   │   │   ├── ShopHampers/          # Full catalog with filtering & search
│   │   │   ├── Cart/                 # Cart overview & item quantity updates
│   │   │   ├── Checkout/             # Order placement with shipping address & payment
│   │   │   ├── Auth/                 # LoginPage & RegisterPage
│   │   │   └── Account/              # User profile & order tracking
│   │   ├── routes/                   # AppRoutes, ProtectedRoute
│   │   ├── services/                 # apiClient (Axios + JWT interceptor), authService, hamperService, etc.
│   │   ├── utils/                    # formatters (INR currency), storage (JWT)
│   │   ├── App.jsx
│   │   ├── index.css                 # Tailwind base layers
│   │   └── main.jsx
│   ├── index.html                    # Fonts & icons preconnect
│   ├── tailwind.config.js            # Design tokens exactly matched from Stitch
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Database Setup (Microsoft SQL Server)

1. Ensure your local Microsoft SQL Server instance (or `SQLEXPRESS`) is running.
2. Create the application database:
   ```sql
   CREATE DATABASE giftedit_db;
   ```
3. In `backend/src/main/resources/application.properties`, configure your datasource connection:

   **Using SQL Authentication (Recommended for development):**
   ```properties
   spring.datasource.url=jdbc:sqlserver://localhost;instanceName=SQLEXPRESS;databaseName=giftedit_db;encrypt=true;trustServerCertificate=true
   spring.datasource.driverClassName=com.microsoft.sqlserver.jdbc.SQLServerDriver
   spring.datasource.username=sa
   spring.datasource.password=YourStrongPasswordHere
   ```

   **Using Windows Integrated Security:**
   ```properties
   spring.datasource.url=jdbc:sqlserver://localhost;instanceName=SQLEXPRESS;databaseName=giftedit_db;encrypt=true;trustServerCertificate=true;integratedSecurity=true
   spring.datasource.driverClassName=com.microsoft.sqlserver.jdbc.SQLServerDriver
   ```

4. Flyway will automatically run the schema and seed scripts on application startup:
   - `V1__init_schema.sql` creates tables for users, boxes, products, hampers, custom hampers, cart items, orders, and reviews.
   - `V2__seed_data.sql` populates initial catalog boxes, delicacies, bestselling hampers, testimonials, and demo accounts.

---

### 2. Backend Setup & Execution

Run the Spring Boot application using Maven:

```bash
cd backend
mvn spring-boot:run
```

The REST API will be available at `http://localhost:8080`.

#### Default Preloaded Accounts:
- **Demo User:**
  - Username: `demo_user`
  - Password: `password123`
- **Administrator:**
  - Username: `admin`
  - Password: `password123`

---

### 3. Frontend Setup & Execution

Install Node dependencies and start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.
All requests to `/api/*` are automatically proxied to the backend at `http://localhost:8080`.

---

## 🔐 Authentication & Security

- **JWT Authentication:** Stateful user session with stateless token validation.
- **Axios Interceptor:** The frontend `apiClient.js` automatically attaches the JWT header (`Authorization: Bearer <token>`) to every outgoing request.
- **Auto-Logout / Redirect on 401:** When a token expires or is rejected with HTTP 401, the interceptor clears local credentials and safely redirects to `/login?expired=true`.
- **Protected Routes:** Orders, Cart Checkout, and User Account areas are protected via `ProtectedRoute.jsx`.

---

## 🎁 Feature Modules

1. **Home Screen (`/`)**:
   - Header with Announcement bar, brand logo, wishlist, cart badges, and user profile drawer.
   - Hero section with live trust stats and high-resolution lifestyle photography.
   - Occasion selector (Birthday, Anniversary, Wedding, Corporate, Festive, etc.).
   - Bestselling Hampers Grid with dynamic filter pills (All, Festive, Wedding, Corporate, Wellness) and instant "Quick Add".
   - Customer Reviews with verified buyer badges.

2. **5-Step Hamper Customizer Studio (`/customize-hamper`)**:
   - **Step 1:** Choose Keepsake Box (Petite, Heritage Classic, Grand Luxury Trunk, Imperial Pine Casket).
   - **Step 2:** Curate Delicacies & Keepsakes with real-time capacity progress indicator.
   - **Step 3:** Personalize satin ribbon color, gifting theme, greeting card stationery, recipient name, and gift note.
   - **Step 4:** Real-Time Hamper Staging visualizer displaying live card note and ribbon.
   - **Step 5 / Sticky Summary Drawer:** Live price breakdown, capacity bar, shipping ETA, and instant checkout.

3. **Shop Hampers (`/shop-hampers`)**:
   - Searchable, filterable catalog of all pre-curated ready-made hampers.

4. **Cart & Checkout (`/cart`, `/checkout`)**:
   - Dynamic cart supporting both ready-made and custom bespoke hampers.
   - Complete checkout with shipping address validation and order placement.

5. **Account & Order Tracking (`/account`)**:
   - Order history with tracking numbers, item breakdown, and saved bespoke hampers.
#   V m a x p l u s  
 