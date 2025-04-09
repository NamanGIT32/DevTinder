const socket = require("socket.io");
const { Chat } = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  // "connection" is the built-in event
  io.on("connection", (socket) => {
    //below are the custom events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, image, userId, targetUserId, text }) => {
        try {
          // TODO - check if userId and targetUserId are connected and friends.
          const roomId = [userId, targetUserId].sort().join("_");

          // here 2 cases are possible either this is a entire new chat or a chat already exists.
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            // if no chat is present we create a new chat
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text: text,
          });
          await chat.save();
          // we have received the message to the backend by sendMessage event
          // now using messageReceived event we will send the message to the room so everyone can see it.
          io.to(roomId).emit("messageReceived", {
            firstName,
            image,
            text,
            id: userId,
          });
        } catch (error) {
          // Emit an error event to the client who sent the message
          socket.emit("errorMessage", {
            response: "Something went wrong while sending message",
            error: error.message,
          });
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
