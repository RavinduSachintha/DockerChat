const db = require("../handlers/mongo-handler");

const Schema = db.Schema;

// User schema

const UserSchema = new Schema({
  userId: {
    type: String,
    required: [true, "Need User ID"],
  },
});

const User = db.model("User", UserSchema);

// Room schema

const RoomSchema = new Schema({
  roomId: {
    type: String,
    required: [true, "Need Room ID"],
  },
  hostId: {
    type: String,
    required: [true, "Need Host ID"],
  },
  roomName: {
    type: String,
  },
  members: [
    {
      type: String,
    },
  ],
});

const Room = db.model("Room", RoomSchema);

module.exports = { User, Room };
