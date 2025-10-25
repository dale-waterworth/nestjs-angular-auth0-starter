# Features & Tasks

# Context
The instructions for features are as follows:
New Features:
## Feature 1: 
- The task todo
  - a subtask todo

Complete Features:
## Feature 2
- ✅The task done
  - ✅a subtask done

Where ✅ is completed and without is to do

Database:
add all migrations go into /database/migrations
The migrations will be run manually as needed

# Features & Tasks

## Database Setup
- ✅ Create a docker compose to set up image: mariadb:10.6.23
- ✅ Setup initial database and user to run locally

## Login and Authentication
- ✅ Create user table in the database
  - ✅ id (int), email (varchar 100), authid (varchar 100), created_at (CURRENT_TIMESTAMP)
- ✅ Create a new /user crud endpoint
  - ✅ GET /user/:id - get user by id
  - ✅ POST /user - create new user
  - ✅ PUT /user/:id - update user
  - ✅ DELETE /user/:id - delete user
  - ✅ Ensure only logged in users can access these endpoints
- ✅ After the user logs in via Auth0, check if the user exists in the database
  - ✅ If not
    - ✅ parse the jwt token and get the auth0 user id
    - ✅ call the auth0 userinfo endpoint to get the email
    - ✅ create a new user entry in the table with the info

## Logging
- ✅ Use the logging library pino