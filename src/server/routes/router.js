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
  apis: [path.resolve(__dirname, 'router.js'), path.resolve(__dirname, '../db/models/event.js')],
};

const specs = swaggerJSdoc(options);

/* Utility Functions */
const {
  createUser,
  getAllUsers,
  getUserRSVPs
} = require("./util/userUtil");

const {
  addAttendee,
  addOrganizationToEvent,
  addRSVP,
  deleteAttendee,
  deleteOrganizationFromEvent,
  deleteRSVP,
  getAllEvents,
  getAttendees,
  getEventById,
  getRSVP,
  updateRSVP
} = require("./util/eventUtil");

const {
  addOrganizationMember,
  createOrganization,
  deleteOrganization,
  getEventsByOrganization,
  getOrganizations,
  updateOrganization
} = require("./util/organizationUtil");

const {
  addEvents,
  addOrganizations,
  addUsers,
  wipeDatabase
} = require("./util/dataManipulation");

const router = express.Router();

/********** API DOCUMENTATION **********/

router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

/********** USER FUNCTIONALITY **********/

// Get all users.
router.get("/users", getAllUsers);

// Get all RSVP's for a user.
router.get("/users/rsvps", getUserRSVPs);

// Create a user.
router.post("/users", createUser);


/********** ORGANIZATION FUNCTIONALITY **********/

// Get all organizations.
router.get("/organizations", getOrganizations);

// Get all events for an organization.
router.get("/organizations/:orgId/events", getEventsByOrganization);

// Create an organization.
router.post("/organizations", createOrganization);

// Update an organization.
router.patch("/organizations/:orgId/update-organization", updateOrganization);

// Delete an organization.
router.delete("/organizations/:orgId", deleteOrganization);

// Add an executive board member to an organization.
router.post("/organizations/add-member", addOrganizationMember);


/********** EVENT FUNCTIONALITY **********/

/**
 * @swagger
 * /events:
 *    get:
 *      description: This should return all events.
 *      tags: 
 *      - Events
 *      produces: application/json
 *      responses:
 *       200:
 *         description: An array of events.
 */
router.get("/events", getAllEvents);

/**
 * @swagger
 * /events/{eventId}:
 *    get:
 *      description: Get event by ID.
 *      tags: 
 *      - Events
 *      produces: application/json
 *      parameters:
 *        - name: eventId
 *          in: path
 *          description: Event ID.
 *          required: true
 *      responses:
 *       200:
 *         description: An event.
 */
router.route("/events/:eventId")
  .get(getEventById)

/**
 * @swagger
 * /events/{eventId}/organization:
 *    put:
 *      description: Adds an organization to an event.
 *      tags: 
 *      - Events
 *      parameters:
 *        - name: eventId
 *          in: path
 *          description: Event ID.
 *          required: true
 *        - name: orgId
 *          in: body
 *          description: Organization ID.
 *          required: true
 *      responses:
 *       200:
 *         description: Join Table Confirmation
 *    delete:
 *      description: Delete an organization from an event.
 *      tags: 
 *      - Events
 *      parameters:
 *        - name: eventId
 *          in: path
 *          description: Event ID.
 *          required: true
 *      responses:
 *       200:
 *         description: Confirmation message.
 */
// Add an organization as a host to an event.
router.route("/events/:eventId/organization")
  .put(addOrganizationToEvent)
  .delete(deleteOrganizationFromEvent)

// Delete an organization as a host to an event.
router.delete("/events/:eventId/delete-organization/:orgId", deleteOrganizationFromEvent);

// Add an RSVP to an event.
router.post("/events/:eventId/add-rsvp", addRSVP);

// Get an RSVP for an event.
router.get("/events/:eventId/rsvp/:userId", getRSVP);

// Update an RSVP for an event.
router.patch("/events/:eventId/update-rsvp", updateRSVP)

// Delete an attendee from an event.
router.delete("/events/:eventId/delete-rsvp/:userId", deleteRSVP);

// Get all attendees for an event.
router.get("/events/:eventId/attendees", getAttendees);

// Add an attendee to an event.
router.post("/events/:eventId/add-attendee", addAttendee);

// Delete an attendee from an event.
router.delete("/events/:eventId/delete-attendee/:userId", deleteAttendee);


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
