/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 * @package
 */

/* NPM Installation Dependencies */
const qr = require("qrcode");
const uniqid = require("uniqid");

/* DB Object */
const { db } = require("../../db/connection");

/* Common Utility Functions */
const util = require("./commonUtil");

/**
 * 
 * @param {*} request 
 * @param {*} response 
 */
const addAttendee = async (request, response) => {
  let event = await util.getEventById(request.params.eventId);
  let user = await util.getUserById(request.body.userId);

  event.addAttendee(user).then(attendee => {
    response.json(attendee);
  });
};

const addOrganizationToEvent = async (request, response) => {
  let event = await util.getEventById(request.params.eventId);
  let org = await util.getOrganizationById(request.body.orgId);

  event.addOrganization(org).then(org => {
    response.json(org);
  });
};

const addRSVP = async (request, response) => {
  let event = await util.getEventById(request.params.eventId);
  let user = await util.getUserById(request.body.userId);

  event
    .addRsvp(user, {
      through: {
        response: request.body.response
      }
    })
    .then(rsvp => {
      response.json(rsvp);
    });
};

const createEvent = (request, response) => {
  request.body.id = uniqid();

  db.events.create(request.body).then(event => {
    response.send(event);
  });
};

const createQRCode = eventId => {
  return new Promise((resolve, reject) => {
    qr.toDataURL(`localhost:8080/events/${eventId}`, (error, url) => {
      if (error) reject(error);

      resolve(url);
    });
  });
};

const deleteAttendee = async (request, response) => {
  let event = await util.getEventById(request.params.eventId);
  let user = await util.getUserById(request.params.userId);

  event.removeAttendee(user).then(() => {
    response.send("Attendee has been removed from event!");
  });
};

const deleteEventById = (request, response) => {
  db.events.destroy({
    where: { id: request.params.eventId }
  }).then(() => {
    response.send("Event has been deleted!");
  });
};

const deleteOrganizationFromEvent = async (request, response) => {
  let event = await util.getEventById(request.params.eventId);
  let org = await util.getOrganizationById(request.body.orgId);

  event.removeOrganization(org).then(() => {
    response.send("Organization has been removed from event!");
  });
};

const deleteRSVP = async (request, response) => {
  let event = await util.getEventById(request.params.eventId);
  let user = await util.getUserById(request.body.userId);

  event.removeRsvp(user).then(() => {
    response.send("RSVP has been removed from event!");
  });
};

const getAllEvents = (request, response) => {
  db.events
    .findAll({
      include: [
        {
          model: db.users,
          as: "rsvps"
        },
        {
          model: db.users,
          as: "attendees"
        },
        {
          model: db.organizations
        }
      ]
    })
    .then(events => {
      response.json(events);
    });
};

const getAttendees = (request, response) => {
  db.events
    .findByPk(request.params.eventId, {
      include: [
        {
          model: db.users,
          as: "attendees"
        }
      ]
    })
    .then(event => {
      response.send(event.attendees);
    });
};

const getEventById = (request, response) => {
  db.events
    .findByPk(request.params.eventId, {
      include: [
        {
          model: db.users,
          as: "rsvps"
        },
        {
          model: db.users,
          as: "attendees"
        },
        {
          model: db.organizations
        }
      ]
    }).then(event => {
      response.json(event);
    });
};

const getRSVP = (request, response) => {
  db.eventRSVPs.findAll({
    where: {
      eventId: request.params.eventId,
      userId: request.params.userId
    }
  }).then(rsvp => {
    response.send(rsvp);
  });
};

const updateEventById = (request, response) => {
  db.events
    .update(request.body, {
      where: { id: request.params.eventId },
      returning: true,
      plain: true
    })
    .then(event => {
      response.send(event[1]);
    });
};

const updateRSVP = (request, response) => {
  db.eventRSVPs
    .update(
      {
        response: request.body.response
      },
      {
        where: {
          eventId: request.params.eventId,
          userId: request.body.userId
        }
      }
    )
    .then(RSVP => {
      response.send(RSVP);
    });
};

module.exports = {
  addAttendee,
  addOrganizationToEvent,
  addRSVP,
  createQRCode,
  deleteAttendee,
  deleteOrganizationFromEvent,
  deleteRSVP,
  getAllEvents,
  getAttendees,
  getEventById,
  getRSVP,
  updateRSVP,
  createEvent,
  updateEventById,
  deleteEventById
};
