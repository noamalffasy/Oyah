// ----------------------
// IMPORTS

/* App */
import { User, Session } from './models';

// ----------------------

// User has many sessions
User.hasMany(Session);

// And a session belongs to a user
Session.belongsTo(User);