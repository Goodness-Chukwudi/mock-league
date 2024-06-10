# Mock League

# Introduction

An API that serves the latest scores of fixtures of matches in a “Mock Premier League”. This system was built with Node.js/Express.js,Redis and MongoDB/Mongoosefor database.

## Prerequisites

Before you can set up and run this application on your machine, you need the following installed:

- Docker (You can still start the application without docker)
- Node.js
- MongoDB, either locally or remote
- Redis server, either locally or remote
- Postman to access the documentation and test the API endpoints

## Setup

Follow these steps to set up and run the Task Management System on your machine:

1. **Install Dependencies**:

   After cloning the project, navigate to the project folder using your terminal and enter the command "npm install" to install all the required dependencies. The package.json file specifies all the needed dependecies to run the application.

2.  **Create environment variables**:
   The env.example file file in the root of the project contains the need environment variable names. Create a file ".env" in the project root folder, copy the content of "env.example" into it and provided the values.

3. **Running The Application On Your Machine**:

   - Start your local engine, and enter "docker compose up" in your terminal from the project root folder.
   -  To start the application without docker on your machine, Enter "npm run dev" instead.
   - If running the application for the first time (no super admin has been created), the app creates a super admin and logs the login credentials on your console.
   - Additional the application has a user management feature through which the default super admin user can assign admin to other users.

## Usage

Once the application is up and running, you can interact with it using HTTP requests. You can find the full documentation of available endpoints and examples here https://www.postman.com/goodness-chukwudi-public/workspace/mock-league/collection/26100881-66784878-e838-41ec-a803-41fc14279489?action=share&creator=26100881

## Note

The live API is available on https://mock-league.onrender.com. The API is hosted on a free tier web service on Render and consequently will experience some delayed response after a period of inactivity.
