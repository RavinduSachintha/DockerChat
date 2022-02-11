const { customAlphabet } = require("nanoid");
const { User, Room } = require("../models/mongoose-models");
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 10);

function start(io) {
  io.on("connection", (socket) => {
    const user = new User({
      userId: socket.id,
    });

    socketOnConnectionUserSave(socket, user);
    socketOnCreateRoom(socket, user);
    socketOnJoinRoom(socket, user);
    socketOnLeaveRoom(socket, user);
    socketOnDisconnecting(socket, user);
    socketOnDisconnect(socket);
  });
}

// Socket on connection event save current user
async function socketOnConnectionUserSave(socket, user) {
  try {
    await user.save();
  } catch (error) {
    console.error(error);
  } finally {
    console.log(`Socket client ID: ${socket.id} connected`);
  }
}

// Socket on create room event
function socketOnCreateRoom(socket, user) {
  socket.on("create-room", async (roomName, cb) => {
    const currentRoom = await Room.findOne({ members: user.userId });
    let result;

    if (!currentRoom) {
      const room = new Room({
        roomId: nanoid(),
        hostId: user.userId,
        roomName: roomName,
        members: [user.userId],
      });

      try {
        await room.save();
        socket.join(room.roomId);
        result = room;
      } catch (error) {
        console.error(error);
        result = error;
      }
    } else {
      result = "User already in a room";
    }

    cb(result);
  });
}

// Socket on join room event
function socketOnJoinRoom(socket, user) {
  socket.on("join-room", async (roomId, cb) => {
    const currentRoom = await Room.findOne({ members: user.userId });
    let result;

    if (!currentRoom) {
      try {
        const room = await Room.findOneAndUpdate(
          { roomId: roomId },
          { $push: { members: user.userId } },
          { new: true }
        );
        socket.join(roomId);
        result = room;
      } catch (error) {
        console.error(error);
        result = error;
      }

      socket.to(roomId).emit("user-connected", result);
    } else {
      result = "User already in a room";
    }

    cb(result);
  });
}

// Socket on leave room event
function socketOnLeaveRoom(socket, user) {
  socket.on("leave-room", async (roomId, cb) => {
    const currentRoom = await Room.findOne({ roomId: roomId });
    let result;

    if (currentRoom.members.includes(user.userId)) {
      try {
        if (currentRoom.members.length < 2) {
          // if current user is the last member
          await currentRoom.delete();
          socket.leave(roomId);
          result = `User leaved and room(${roomId} deleted)`;
        } else if (currentRoom.hostId === user.userId) {
          // if current user is the host
          let newHostId = currentRoom.members.filter(
            (id) => id !== user.userId
          )[0];
          const room = await Room.findOneAndUpdate(
            { roomId: roomId },
            { $pull: { members: user.userId }, $set: { hostId: newHostId } },
            { new: true }
          );
          socket.leave(roomId);
          result = room;
        } else {
          // if current user is a normal one
          const room = await Room.findOneAndUpdate(
            { roomId: roomId },
            { $pull: { members: user.userId } },
            { new: true }
          );
          socket.leave(roomId);
          result = room;
        }
      } catch (error) {
        console.error(error);
        result = error;
      }

      socket.to(roomId).emit("user-disconnected", result);
    } else {
      result = "User is not in the room";
    }

    cb(result);
  });
}

// Socket on disconnecting event
function socketOnDisconnecting(socket, user) {
  socket.on("disconnecting", async (reason) => {
    await user.delete();
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("user has left", socket.id);
      }
    }
  });
}

// Socket on disconnect event
function socketOnDisconnect(socket) {
  // https://socket.io/docs/v4/server-socket-instance/#disconnect
  socket.on("disconnect", (reason) => {
    console.log(
      `Socket client ID: ${socket.id} disconnected (reason :- ${reason})`
    );
  });
}

module.exports = { start };
