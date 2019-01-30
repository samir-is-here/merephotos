# Image Sharing Backend service

## Quick Start

#### To Build and Run the project
- Download Node package manager for your OS - [link](https://nodejs.org/en/download/)
- Download and unpack the code repository in an empty directory
- Goto base directory which has package.json file
- Run commands: 
    1. `npm install` - to install all the node dependencies
    2. `npm run prod` - to build and run the server
- Once the server is up, the application will be available on port 3000 on localhost
- Goto http://localhost:3000/api-docs - to check swagger documentation of the APIs.

#### To Test the APIs
- You may use HTTP clients like - Postman, Fiddler, SOAPUI, curl or your favorite browser extension for testing

## Requirements:
The backend service should allow for:
- Listing availabe images
- Seeing image metadata (title, timestamp, canonical URL)
- Uploading and downloading images

_User authentication is not in scope_

## Features of this service:
- Allows querying metadata for all the images on the server (GET on /images)
- Allows uploading an image from a client (POST on /images)
- Allows downloading an image using the canonical url from previous operations (GET on /images/:id)
- Allows deleting an image using canonical url from previous operations (DELETE on /images/:id)

### Technologies used:
- Nodejs, Expressjs, Typescript
- Multer - to allow uploading and downloading of files to/from server
- lokijs - filesystem based database to store metadata of the images loaded
- swagger - to document and test APIs exposed

### Limitations (being sold as features)
- Does not allow for uploading/downloading multiple images
- No provision for filter when querying the images
- Idempotent PUT/POST is not supported - that means, if you (or your browser) uploads the same image twice, there will be duplicate entries for that image on server side
- A very limited number of image extension supported viz. jpg/jpeg/png/gif

### Assumptions
- This is a very basic service, to be hosted on single host with limited to no provision for security. But this can serve as a boilerplate to an application with better features for security, scalability and maintenance.
- To upload images, client has capability to send the file using multipart/form-data as content type
- There is no need for updating a photo at a given id - this can be achieved using combination of DELETE and POST
- To download an image
    1. The client with perform GET for all images
    2. Choose the image to download
    3. Use the canonical URL returned in the output to GET the image by Id
> _The last point seems like a design. The assumption here is that the client does not have a way to generate a unique ID, which can be later used to query the image._

### High Level Solution
- image-server.ts will have code to initialize and configure the server
- image-model.ts will have the data model to capture for input and output
- image-controller.ts will act as a router for exposing the endpoints for various operations
- dbutils.ts will have utilities to store image meta data in DB and image file in file system
- lokisjs will be used to store metadata - it has provision to persist the data in filesystem in JSON format
- Multer will be used store the uploaded image into server filesystem
- node module 'fs' will be used for allowing lokijs and multer to access the local file system

### References
1. lokijs - file system adapter - https://rawgit.com/techfort/LokiJS/master/jsdoc/LokiFsAdapter.html
2. Multer to upload files - https://www.npmjs.com/package/multer
3. Basics of Node, Express and Typescript -https://itnext.io/building-restful-web-apis-with-node-js-express-mongodb-and-typescript-part-1-2-195bdaf129cf

