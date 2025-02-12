# SEJELNI Platform

A digital platform connecting Moroccan and foreign students with agencies for academic and administrative support.

you can find the Front-End : https://github.com/Loai-Houmane/SejelniWebProject

## Table of Contents

- [SEJELNI Platform](#sejelni-platform)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
- [Project Structure](#project-structure)
    - [Notes](#notes)
  - [Dependencies](#dependencies)
  - [Setup and Installation](#setup-and-installation)
  - [Usage](#usage)
    - [Running the Server](#running-the-server)
    - [Running in Development Mode](#running-in-development-mode)
  - [API Endpoints](#api-endpoints)
    - [Admin Routes](#admin-routes)
    - [Agency Routes](#agency-routes)
    - [Student Routes](#student-routes)
  - [Database Schema](#database-schema)
  - [Seeding Data](#seeding-data)

## Features

- **User Authentication**: JWT-based authentication for students, agencies, and admins.
- **Agency Management**: CRUD operations for agencies, including uploading photos, videos, and logos.
- **Student Management**: CRUD operations for students, including profile picture uploads and subscription management.
- **Order and Lead Management**: Students can create orders and leads, and agencies can manage them.
- **Review System**: Students can review agencies, and admins can approve or reject reviews.
- **Dashboard**: Admin and agency dashboards to view statistics and manage data.
- **Email Notifications**: Sending emails using Nodemailer for various actions like lead creation.

# Project Structure  

```
📦 Project Root  
├── 📄 .env              # Environment variables  
├── 📄 .gitignore        # Git ignore file  
├── 📄 p.js              # Additional script (explain its purpose)  
├── 📄 package.json      # Project dependencies & scripts  
├── 📂 prisma/           # Prisma ORM configurations  
│   ├── 📄 schema.prisma # Database schema definition  
├── 📄 README.md         # Project documentation  
├── 📂 src/              # Application source code  
│   ├── 📄 app.js        # Main application entry  
│   ├── 📂 controllers/  # Controllers handling business logic  
│   │   ├── 📄 adminController.js  
│   │   ├── 📄 agencyController.js  
│   │   ├── 📄 studentController.js  
│   ├── 📂 middleware/   # Middleware for request validation  
│   │   ├── 📄 adminMiddleware.js  
│   │   ├── 📄 authMiddleware.js  
│   │   ├── 📄 checkOwnership.js  
│   │   ├── 📄 isOnSubscription.js (missing .js)  
│   ├── 📂 routes/       # API route definitions  
│   │   ├── 📄 adminRoutes.js  
│   │   ├── 📄 agencyRoutes.js  
│   │   ├── 📄 studentRoutes.js  
│   ├── 📂 Seeds/        # Database seeding scripts  
│   │   ├── 📄 adminSeed.js  
│   │   ├── 📄 seed.js  
│   ├── 📄 server.js     # Server initialization  
│   ├── 📂 services/     # Business logic layer  
│   │   ├── 📄 adminService.js  
│   │   ├── 📄 agencyService.js  
│   │   ├── 📄 emailService.js  
│   │   ├── 📄 studentService.js  
│   ├── 📂 utils/        # Utility/helper functions  
│   │   ├── 📄 db.js  
```  

### Notes  
- **`prisma/`**: Manages database schema and migrations.  
- **`controllers/`**: Handles API request logic.  
- **`middleware/`**: Authentication and request validation layers.  
- **`routes/`**: Defines API endpoints.  
- **`Seeds/`**: Contains scripts for populating the database with initial data.  
- **`services/`**: Implements business logic, interacting with controllers and database.  
- **`utils/`**: Contains helper functions like database connections.  


## Dependencies

- **Express**: Web framework for Node.js.
- **Prisma**: ORM for database interactions.
- **JWT**: JSON Web Token for authentication.
- **Bcrypt**: Password hashing.
- **Nodemailer**: Sending emails.
- **Multer**: Handling file uploads.
- **Dotenv**: Loading environment variables.

## Setup and Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/sejelni-platform.git
   cd sejelni-platform
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables in a .env file.

4. Run the development server:
   ```sh
   npm run dev
   ```

5. Access the application at `http://localhost:3000`.

## Usage

### Running the Server

To start the server, run:
```sh
npm start
```

### Running in Development Mode

To start the server in development mode with hot-reloading, run:
```sh
npm run dev
```

## API Endpoints
* Sejelni.postman_collection.json in the main folder.
### Admin Routes

- `POST /api/admin/login`: Admin login.
- `POST /api/admin/approve-agency/:id`: Approve an agency.
- `POST /api/admin/reject-agency/:id`: Reject an agency.
- `POST /api/admin/suspend-agency/:id`: Suspend an agency.
- `POST /api/admin/reactivate-agency/:id`: Reactivate an agency.
- `GET /api/admin/dashboard-stats`: Get dashboard statistics.
- `POST /api/admin/approve-review/:id`: Approve a review.
- `POST /api/admin/reject-review/:id`: Reject a review.
- `POST /api/admin/create-article`: Create an article.
- `PUT /api/admin/update-article/:id`: Update an article.
- `DELETE /api/admin/delete-article/:id`: Delete an article.
- `GET /api/admin/articles`: Get all articles.
- `POST /api/admin/create-filter`: Create a filter.
- `PUT /api/admin/toggle-filter-status/:id`: Toggle filter status.
- `PUT /api/admin/update-filter/:id`: Update a filter.
- `DELETE /api/admin/delete-filter/:id`: Delete a filter.
- `GET /api/admin/agency-activities/:id`: Get agency activities.
- `GET /api/admin/agencies`: Get all agencies.
- `GET /api/admin/orders`: Get all orders.
- `GET /api/admin/subscribedStudents`: Get recent students.
- `GET /api/admin/review-ratings`: Get review ratings.
- `GET /api/admin/lead-counts`: Get lead counts.
- `GET /api/admin/reviews`: Get all reviews.
- `GET /api/admin/student-name/:id`: Get student name by ID.
- `GET /api/admin/agency-name/:id`: Get agency name by ID.
- `GET /api/admin/article/:id`: Get article by ID.

### Agency Routes

- `POST /api/agencies/login`: Agency login.
- `POST /api/agencies/register`: Register a new agency profile.
- `PUT /api/agencies/update`: Update an existing agency profile.
- `DELETE /api/agencies/delete/:id`: Delete an agency profile.
- `GET /api/agencies/getAgencie/:id`: Get an agency by ID.
- `GET /api/agencies/getAgencieByUser`: Get an agency by user ID.
- `POST /api/agencies/offer/create`: Create an offer.
- `PUT /api/agencies/offer/update/:id`: Update an offer.
- `DELETE /api/agencies/offer/delete/:id`: Delete an offer.
- `GET /api/agencies/dashboard/:id`: Get the agency dashboard.
- `GET /api/agencies/lead/All`: Get leads by agency.
- `PUT /api/agencies/lead/update/:id`: Update lead status.
- `DELETE /api/agencies/lead/delete/:id`: Delete a lead.
- `POST /api/agencies/service/create`: Create a service.
- `PUT /api/agencies/service/update/:id`: Update a service.
- `DELETE /api/agencies/service/delete/:id`: Delete a service.
- `GET /api/agencies/services/:agencyId`: Get all services by agency ID.
- `GET /api/agencies/ordersByAgency`: Get orders by agency.
- `POST /api/agencies/upload-logo`: Upload a logo.
- `POST /api/agencies/upload-photos`: Upload photos.
- `POST /api/agencies/upload-video`: Upload video.
- `GET /api/agencies/logo/:id`: Get the agency logo.
- `GET /api/agencies/reviews/:id`: Get reviews by agency.
- `GET /api/agencies/all`: Get all agencies.
- `GET /api/agencies/allAdmin`: Get all agencies (admin).

### Student Routes

- `POST /api/student/signup`: Student signup.
- `POST /api/student/login`: Student login.
- `PUT /api/student/update`: Update student profile.
- `POST /api/student/lead`: Create a lead.
- `GET /api/student/search`: Search for agencies.
- `POST /api/student/create-order`: Create an order.
- `GET /api/student/orders-History`: View order history.
- `POST /api/student/appointments`: Book an appointment.
- `POST /api/student/send-review`: Send a review.
- `GET /api/student/student/:id`: Get student name and profile picture by ID.
- `GET /api/student/me`: Get student by token.
- `POST /api/student/upload-profile-picture`: Upload profile picture.
- `POST /api/student/can-review`: Check if student can review.
- `POST /api/student/is-service-bought`: Check if service is bought.
- `POST /api/student/buy-subscription`: Buy subscription.
- `GET /api/student/check-subscription`: Check subscription status.

## Database Schema

The database schema is defined in schema.prisma.

## Seeding Data

To seed the database with initial data, run the following commands:

1. Seed admin data:
   ```sh
   node src/Seeds/adminSeed.js
   ```

2. Seed other data:
   ```sh
   node src/Seeds/seed.js
   ```
