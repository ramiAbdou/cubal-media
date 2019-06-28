/* NPM Installation Dependencies */
const Sequelize = require('sequelize');

/* DB Model Schemas */
const UserModel = require('./models/user');
const OrganizationModel = require('./models/organization');
const EventModel = require('./models/event');

const { localDBUsername, localDBPassword } = require('./config');

/* Establish the DB Connection */
const devDBConnection =
  `postgres://${localDBUsername}:${localDBPassword}@localhost:5432/cubal-media`;
const sequelize = new Sequelize(devDBConnection);

/* Connect all the models/tables in the database to a db object, 
   so everything is accessible via one object. */
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = UserModel(sequelize, Sequelize);;
db.organizations = OrganizationModel(sequelize, Sequelize);
db.events = EventModel(sequelize, Sequelize);

/* Connect to the DB. */
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = {
  sequelize,
  db
}
