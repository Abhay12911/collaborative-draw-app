import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
  return null;
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if (userId == null) {
    ws.close()
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('message', async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
    }

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      if (user) {
        user.rooms.push(parsedData.roomId);
        console.log(`User ${userId} joined room ${parsedData.roomId}`);
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter(x => x === parsedData.room);
      console.log(`User ${userId} left room ${parsedData.room}`);
    }

    console.log("message received")
    console.log(parsedData);

    if (parsedData.type === "chat") {
      try {
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        // Validate that the room exists
        const room = await prismaClient.room.findUnique({
          where: { id: Number(roomId) }
        });

        if (!room) {
          console.error(`Room ${roomId} not found`);
          ws.send(JSON.stringify({
            type: "error",
            message: "Room not found",
            roomId
          }));
          return;
        }

        // Check if user is a member of the room
        const user = users.find(x => x.ws === ws);
        if (!user || !user.rooms.includes(roomId)) {
          console.error(`User ${userId} not a member of room ${roomId}`);
          ws.send(JSON.stringify({
            type: "error",
            message: "You are not a member of this room",
            roomId
          }));
          return;
        }

        // Create the chat message
        const chat = await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            message,
            userId
          }
        });

        console.log(`Chat message created: ${chat.id}`);

        // Broadcast to all users in the room
        users.forEach(user => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
              type: "chat",
              message: message,
              roomId,
              userId,
              chatId: chat.id
            }))
          }
        })
      } catch (error) {
        console.error("Error creating chat message:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        ws.send(JSON.stringify({
          type: "error",
          message: "Failed to send message",
          error: errorMessage
        }));
      }
    }

  });

});

