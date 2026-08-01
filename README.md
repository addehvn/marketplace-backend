# Marketplace Backend

## About the Project

A backend REST API for a marketplace application built with Node.js, Express.js, and MySQL.


## Features 

- User registration and login
- JWT authentication
- Role-based authorization
- Admin access control
- Product creation, updating, and deletion
- Product image upload
- Product search
- Product filtering by price
- Product sorting
- Pagination
- Input validation
- Error handling
- Automated API testing with Jest and Supertest


## Technologies

- Node.js
- Express.js
- MySQL
- JWT
- Multer
- Jest
- Supertest


## API Endpoints  

### Authentication 

  | Method | Endpoint | Description | Access |
  |----|----|----|----|
  | POST | `/users/signup/` | user sign up | public 
  | POST | `/users/login/`  | user login | public 
  | PATCH | `/users/updateUser/:id` | update user | Authenticated 
  | DELETE | `/user/deleteUser/:id` | delete user | Authenticated 



### products

  | Method | Endpoint | Description | Access |
  |----|----|----|----|
  | GET | `/products/` | Get all Products | public |
  | GET | `/products/singleProduct/:id` | Get single product | public |
  | POST | `products/newProduct` | creating new Product | Authenticated |
  | PATCH | `/products/updateProducts/:id` | update product | Authenticated |
  | DELETE | `/products/deleteProduct/:id` | delete product | Authenticated |
  | GET | `/products/search` | search product by title | public |
  | GET | `/products/sort ` | sort by price | public 



### admin 

  | method | Endpoint | Description | Access |
  |----|----|----|----|
  | POST | `/admin/login` | admin login | Authenticated |
  | GET | `/admin/users` | users list | Authenticated |
  | GET | `/admin/products` | products list | Authenticated | 
  | PATCH | `/admin/updateUser/:id` |  update user | Authenticated | 
  | PATCH | `/admin/updateProduct/:id` | update product | Authenticated | 
  | GET | ` admin/searchUser` | search user | Authenticated | 
  | GET | ` admin/searchProduct ` | search product | Authenticated |



## Authentication 

Protected routes require a JWT token.
Add the token to the request header:
Authorization: Bearer YOUR_TOKEN


## Test 

The project uses Jest and Supertest for automated API testing.

## Installation 

1. Clone the repository:
- git clone (https://github.com/addehvn/marketplace-backend)


2. Navigate to the project:
- cd marketplace-backend


3. Install dependencies:
- npm install
- Environment



4. Configure environment variables

Create a .env file in the root directory and add the required environment variables:

PORT=3005

DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

JWT_SECRET=your_jwt_secret

5. Start the server 

npm start 
