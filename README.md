# Image Sharing Backend service

## Requirements:
The service should allow for:
- Listing availabe images
- Seeing image metadata (title, timestamp, canonical URL)
- Uploading and downloading images

User authentication is not in scope

## Features of this service:
- Allows querying metadata for all the images on the server (GET on /images)
- Allows uploading an image from a form-based client (POST on /images)
- Allows downloading an image using the canonical url from previous operations (GET on /images/:id)
- Allows deleting an image using canonical url from previous operations (DELETE on /images/:id)

## Technologies used:
- Nodejs, Expressjs, Typescript
- Multer - to allow uploading and downloading of files to/from server
- lokijs - filesystem based database to store metadata of the images loaded

## How to build and run the project?
- Download Node package manager
- Download and unpack the code repository
- Goto base directory which has pacakage.json file
- Run command: npm run prod
- You may use HTTP clients like - Postman, SOAPUI, Chrome browser (for GET operations), etc for testing

## Design considerations

