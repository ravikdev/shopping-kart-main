# Shopping-Cart-Backend
## _Project API Documentation_

# Use npm start to start the each microservice Application
_node version v18.17.1_

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# All the PORT's for four Microservices
## _Users PORT    -- 8000_
## _Products PORT -- 7001_
## _Orders PORT   -- 8002_
## _Carts PORT    -- 8001_

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

```
"dependencies": {
    "axios": "^1.6.2",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "crypto": "^1.0.1",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^3.6.3",
    "nodemon": "^3.0.1",
    "sequelize": "^6.35.1",
    "sequelize-cli": "^6.6.2",
    "@hapi/joi": "^17.1.1",
    "bcryptjs": "^2.4.3",
    "date-fns": "^2.30.0",
    "mysql": "^2.18.1",
  }
```

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Products API
## Get all products
Endpoint: [http://172.31.1.135:7001/api/v1/products]\
Method: GET\
Description: Retrieve all products.

## Get published products
Endpoint: [http://172.31.1.135:7001/api/v1/products/published] \
Method: GET \
Description: Retrieve published products.

## Get one product by ID
Endpoint: [http://172.31.1.135:7001/api/v1/products/get-one-product/:id] \
Method: GET \
Description: Find one product by product ID.

## Get products by category ID
Endpoint: [http://172.31.1.135:7001/api/v1/products/categories/:id] \
Method: GET \
Description: Get products within a category by providing the category ID.

## Get all categories
Endpoint: [http://172.31.1.135:7001/api/v1/products/all-categories] \
Method: GET \
Description: Get all categories.

## Delete one product by ID
Endpoint: [http://172.31.1.135:7001/api/v1/products/delete-one/:id] \
Method: DELETE \
Description: Delete a product by ID.

## Get all reviews
Endpoint: [http://172.31.1.135:7001/api/v1/products/all-reviews] \
Method: GET \
Description: Get all product reviews.

## Get product reviews by ID
Endpoint: [http://172.31.1.135:7001/api/v1/products/get-product-reviews/:id] \
Method: GET \
Description: Get product reviews by product ID.

----------------------------------------------------------------------------------------
# Cart API
## Add item to the cart
Endpoint: [http://172.31.1.135:8001/api/v1/add-cart] \
Method: POST \
Description: Add an item to the cart. \
Request Payload:
```
{
    "userId": 2,
    "productId": 2,
    "quantity": 1
}

```

## Get cart items
Endpoint: [http://172.31.1.135:8001/api/v1/get-cart] \
Method: POST \
Description: Get cart items. \
Request Payload:
```
{
    "userId": 1
}

```

## Update quantity of cart items
Endpoint: [http://172.31.1.135:8001/api/v1/update-cart] \
Method: PATCH \
Description: Update the quantity of cart items. \
Request Payload:
```
{
    "userId": 1,
    "productId": 1,
    "quantity": 12
}

```

## Delete a cart item
Endpoint: [http://172.31.1.135:8001/api/v1/delete-cart] \
Method: DELETE \
Description: Delete a cart item. \
Request Payload:
```
{
    "userId": 1,
    "productId": 2
}

```
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Orders API
## Place or create an order
Endpoint: [http://172.31.1.135:8002/api/v1/orders/create-order] \
Method: POST \
Description: Place or create an order. \
Request Payload:
```
{
    "userId": 1,
    "address": "Haryana",
    "contactNo": "8198960899",
    "products": [
        {
            "productId": 1,
            "quantity": 1
        },
        {
            "productId": 2,
            "quantity": 3
        }
    ]
}

```

## Get all orders placed by a specific user
Endpoint: [http://172.31.1.135:8002/api/v1/orders/get-orders] \
Method: POST \
Description: Get all orders placed by a specific user. \
Request Payload:
```
{
    "userId": "1"
}

```
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Users API
## User Signup
Endpoint: [http://172.31.1.135:8000/api/v1/signup] \
Method: POST \
Description: Sign up the user. \
Request Payload:
```
{
    "firstName": "bittu",
    "lastName":"bhadra",
    "email":"pitambar@gmail.com",
    "password":"Pitambar@123"
}
```

## User Login
Endpoint: [http://172.31.1.135:8000/api/v1/login] \
Method: POST \
Description: Sign in the user. \
Request Payload:
```
{
    "email": "pitambar@gmail.com",
    "password": "Pitambar123"
}

```

## to fetch the user details
Endpoint: [http://172.31.1.135:8000/api/v1/user/details] \
Method: GET \
Description: for fetching the specific user details. \


## To create access token using refresh token
Endpoint: [http://172.31.1.135:8000/api/v1/generate-token] \
Method: POST \
Description: To create access token using refresh token. \
req payload : -
```
{
    "refreshToken"" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjIsImlhdCI6MTcwMTQyNjE5MCwiZXhwIjoxNzA0MDE4MTkwfQ.ZKxza2wOkVClrpcrMSjzLjQ6UxnEPMzuX__iQQnAtd8"
}
```

## To logout the user using refresh token
Endpoint: [http://172.31.1.135:8000/api/v1/logout] \
Method: DELETE \
Description: To logout the user using refresh token. \
req payload : -
```
{
    "refreshToken" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjIsImlhdCI6MTcwMTQyNjgxMCwiZXhwIjoxNzA0MDE4ODEwfQ.tTs5FnXilBURVY2ozDlKgUDFSQFJq_GT17zfhkwKfcg"
}
```

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
