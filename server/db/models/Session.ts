import * as Sequelize from "sequelize";

import db from "../index";

import { encodeJWT, decodeJWT } from "../lib/hash";
import FormError from "../lib/error";

export const Session = db.define(
  "session",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    expiresAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  },
  {
    timestamps: false,
    hooks: {
      beforeValidate(inst) {
        // Set expiration to be 30 days from now
        const now = new Date();
        now.setDate(now.getDate() + 30);
        inst.expiresAt = now;
      }
    }
  }
);

Session.prototype.jwt = function jwt() {
  return encodeJWT({ id: this.id });
};

// Create a new session.  Accepts a loaded user instance, and returns a
// new session object
export async function createSession(user) {
  return Session.create({
    userId: user.id
  });
}

// Retrieve a session based on the JWT token.
export async function getSessionOnJWT(token) {
  const e = new FormError();
  let session;

  try {
    // Attempt to decode the JWT token
    const data = decodeJWT(token);
    // We should have an ID attribute
    if (!data.id) throw new Error();

    // Check that we've got a valid session
    session = await Session.findById(data.id);
    if (!session) throw new Error();
  } catch (_) {
    e.set("session", "Invalid session ID");
  }

  // Throw if we have errors
  e.throwIf();

  return session;
}
