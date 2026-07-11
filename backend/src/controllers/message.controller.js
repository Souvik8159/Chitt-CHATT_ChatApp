import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      {
        senderId: userToChatId,
        receiverId: myId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = "";

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chat-app",
      });

      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      isRead: false,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUnreadCounts = async (req, res) => {
  try {
    const myId = req.user._id;
console.log("Logged in user:", myId);

const unread = await Message.aggregate([
  {
    $match: {
      receiverId: myId,
      isRead: false,
    },
  },
  {
    $group: {
      _id: "$senderId",
      count: { $sum: 1 },
    },
  },
]);

console.log("Unread:", unread);
    const unreadMap = {};

    unread.forEach((item) => {
      unreadMap[item._id.toString()] = item.count;
    });

    res.status(200).json(unreadMap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};