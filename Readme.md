
#  Pet Adoption System - Backend

This is the server-side application for the Pet Adoption System, built with **Node.js**, **Express**, and **MongoDB**. It handles user authentication, pet management, and a complete adoption workflow with role-based access control.

##  Key Features

* **User Authentication:** JWT-based login with Access and Refresh tokens.
* **Secure Cookies:** Refresh tokens stored in `httpOnly` cookies for enhanced security.
* **Role-Based Access Control (RBAC):** - `User`: Can browse pets, view details, and apply for adoption.
* `Admin`: Can manage pet listings (CRUD) and manage adoption requests.


* **Adoption Workflow:** Automated logic to mark pets as "Adopted" and reject competing applications once one is approved.
* **MVC Architecture:** Code organized into Models, Routes, and Controllers for scalability.

---

##  Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **Auth:** JSON Web Tokens (JWT) & Bcrypt.js
* **Middleware:** CORS, Cookie-parser, Dotenv

---

##  Project Structure

```text
 src/
    controllers/    # Business logic for Auth, Pets, and Adoptions
    middleware/     # Auth guards (isAdmin, isUser)
    models/         # Mongoose Schemas (User, Pet, Adoption)
    routes/         # API Route definitions
    index.js        # Entry point and server configuration
 .env                # Secret keys and DB URI
 package.json        # Project metadata and dependencies

```

---

##  Setup and Installation

1. **Clone the repository:**
```bash
git clone <https://github.com/in-abhishek/pet-backend.git>
cd backend

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
Create a `.env` file in the root folder:
```env
PORT=5002
MONGODB_URI=your_mongodb_connection_string
FRONTEND_BASE_URL=http://localhost:5173
ACCESS_TOKEN_SECRET=access_token_secret
REFRESH_TOKEN_SECRET=refresh_token_secret

```


4. **Start the server:**
```bash
# For development
npm run dev

# For production
npm start

```



---


###  Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/register` | Public | Register a new user |
| POST | `/api/login` | Public | Authenticate user & set cookies |
| POST | `/api/refresh-token` | Public | Get new access token via refresh token |
| POST | `/api/logout` | Public | Clear session cookies |

###  Pet Management

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/pets` | Public | Get all available pets |
| GET | `/api/get-edit-pets/:id` | Admin | Fetch specific pet data for editing |
| POST | `/api/add-pet` | Admin | Add a new pet to the system |
| PUT | `/api/update-pet/:id` | Admin | Update pet details |
| DELETE | `/api/pets/:id` | Admin | Remove a pet from listing |

###  Adoptions

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/adopt` | User | Submit an adoption application |
| GET | `/api/my-adoptions` | User | View current user's applications |
| GET | `/api/admin/adoptions` | Admin | View all adoption requests |
| POST | `/api/admin/update-status` | Admin | Approve/Reject a request |

---

##  Security Features

* **Bcrypt:** Passwords are never stored in plain text; they are hashed before saving.
* **JWT Protection:** Routes are protected by custom middleware that verifies the token's validity and user's role.
* **CORS:** Configured to only allow requests from the trusted frontend origin.

---
