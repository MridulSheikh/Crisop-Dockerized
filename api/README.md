# Crisop API

## Description
Crisop API is a TypeScript + Express backend for an e-commerce/inventory workflow. It provides authentication, user and team role management, catalog management (categories, stock, warehouses, products), and order handling, with MongoDB as the data store.

## Features
- JWT-based authentication with refresh-token flow
- Email verification and password reset via SMTP templates
- OAuth login support (Google/Facebook flow hooks)
- Role-based authorization (`user`, `manager`, `admin`, `super`)
- Category, warehouse, stock, product, and order management modules
- Product image upload pipeline with Multer + Cloudinary
- Query support for search, filter, pagination, sorting, and field selection
- Centralized validation and global error handling

## Tech Stack
- Frontend: Not included in this repository (API is consumed by an external client URL)
- Backend: Node.js, Express, TypeScript
- Database: MongoDB with Mongoose
- Others: Zod, JWT, Bcrypt, Nodemailer, EJS, Multer, Cloudinary, CORS, Cookie Parser

## Installation
1. Clone the repository:
```bash
git clone <your-repo-url>
cd crisop-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root (see Environment Variables section).

4. Run in development:
```bash
npm run start:dev
```

5. Build and run production mode:
```bash
npm run build
npm run start:prod
```

## Usage
Base API prefix:
```text
/api/v1
```

Typical flow:
1. Register/login a user (`/api/v1/user/*`).
2. Use the returned access token in `Authorization: Bearer <token>`.
3. Create inventory entities in sequence: warehouse -> stock -> category -> product.
4. Place and manage orders through `/api/v1/order`.

## API Endpoints
All routes below are mounted under `/api/v1`.

### User & Auth
- `POST /user/create` - Register user
- `POST /user/login` - Login user
- `POST /user/refresh-token` - Issue new access token
- `POST /user/forgot-password` - Send reset password email
- `POST /user/reset-password` - Reset password using token
- `POST /user/oauth` - OAuth login handler
- `POST /user/verify` - Verify email with code
- `POST /user/change-role` - Change user role (protected)
- `POST /user/add-member` - Promote/add team member role (protected)
- `POST /user/logout-me` - Clear auth cookies
- `GET /user` - Get users list (protected)
- `GET /user/:email` - Get single user by email (protected)

### Contact
- `POST /contact/email` - Send contact email

### Category
- `POST /category` - Create category (protected)
- `GET /category` - Get all categories
- `GET /category/:id` - Get single category (protected)
- `PATCH /category/:id` - Update category (protected)
- `DELETE /category/:id` - Soft delete category (protected)

### Warehouse
- `POST /warehouse` - Create warehouse (protected)
- `GET /warehouse` - Get all warehouses (protected)
- `GET /warehouse/:id` - Get warehouse by id (protected)
- `PATCH /warehouse/:id` - Update warehouse (protected)
- `DELETE /warehouse/:id` - Delete warehouse (protected)

### Stock
- `POST /stock` - Create stock item (protected)
- `GET /stock` - Get all stock items (protected)
- `GET /stock/:id` - Get stock item by id (protected)
- `PATCH /stock/:id` - Update stock item (protected)
- `DELETE /stock/:id` - Soft delete stock item (protected)

### Product
- `POST /product` - Create product with up to 5 images (protected)
- `GET /product` - Get public product list
- `GET /product/admin` - Get admin product list (protected)
- `GET /product/:id` - Get product by id
- `PATCH /product/:id` - Update product + image set (protected)
- `DELETE /product/:id` - Soft delete product (protected)
- `PATCH /product/:id/featured` - Toggle featured status (protected)

### Order
- `POST /order` - Create order
- `GET /order` - Get all orders (protected)
- `GET /order/my-orders` - Get logged-in user orders
- `PATCH /order/:id/cancel` - Cancel order

## Project Structure
```text
src/
  app.ts                        # Express app setup
  server.ts                     # Server bootstrap and MongoDB connection
  app/
    config/                     # Environment configuration
    routes/                     # Route composition (/api/v1)
    middlewares/                # Auth, validation, error handling
    errors/                     # Custom error classes/transformers
    builder/                    # QueryBuilder (search/filter/sort/paginate)
    helpers/                    # Email sender, SKU helper
    modules/                    # Domain modules (user, product, order, etc.)
    utils/                      # Shared utils and email templates
    types/                      # Express type extensions
uploads/                        # Temporary local upload files
Dockerfile                      # Container runtime config
vercel.json                     # Vercel deployment config
```

## Environment Variables
Create `.env` in project root:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/crisop

SMTP_HOST=
SMTP_PORT=
SMTP_EMAIL=
SMTP_PASS=
SMTP_SERVICE=

SALT_ROUNDS=10
JWT_SECRET=
JWT_EXPIREIN=1d
JWT_REFRESH_TOKEN_SECRET=
JWT_REFRESH_EXPIREIN=7d
JWT_RESETPASSWORD_TOKEN_SECRET=
JWT_RESETPASSWORD_TOKEN_EXPIREIN=1h

CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
REDIS_CONNECTION=
GEMINI_API_KEY=
GROQ_API_KEY=
```

## Screenshots (Optional)
Add API testing screenshots here (Postman/Insomnia examples), such as:
- User login response
- Product creation with image upload
- Order creation flow

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push branch: `git push origin feature/your-feature-name`
5. Open a Pull Request.

## Author
Mridul Sheikh
