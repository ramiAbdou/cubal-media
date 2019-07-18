/* NPM Installation Dependencies */
const express = require("express");
const path = require("path");
const swaggerJSdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    info: {
      title: 'CUBAL Media API',
      version: '1.0.0',
      description: 'Test Express API with autogenerated Swagger Documentation.',
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'.
  apis: [
    path.resolve(__dirname, 'router.js'),
    path.resolve(__dirname, 'userRouter.js'),
    path.resolve(__dirname, 'organizationRouter.js'),
    path.resolve(__dirname, 'eventRouter.js')],
};

const specs = swaggerJSdoc(options);

/* Utility Functions */
const {
  addEvents,
  addOrganizations,
  addUsers,
  wipeDatabase
} = require("../util/dataManipulation");

const router = express.Router();

/********** API DOCUMENTATION **********/

router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));


/********** DUMMY DATA FUNCTIONALITY /**********/

// Populate User table with arbitrary number of users.
router.get("/users/add-users/:num", addUsers);

// Populate Organizations table with arbitrary number of organizations.
router.get("/organizations/add-organizations/:num", addOrganizations);

// Populate Events table with arbitrary number of events.
router.get("/events/add-events/:num", addEvents);

/* Wipe current DB. */
router.get("/wipe-db", wipeDatabase);

module.exports = router;