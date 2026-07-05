import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { server } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import styles from "../../styles/styles";
import { TfiGallery } from "react-icons/tfi";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import DashboardEmptyState from "../Dashboard/DashboardEmptyState";
import { FiMessageSquare } from "react-icons/fi";

// Socket.io endpoint url
const ENDPOINT = "https://guriraline-socket-awo9.onrender.com";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const { seller, isLoading } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState();
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        // You can leave out the token explicitly in the header, as cookies will be sent automatically
        const response = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${seller?._id}`,
          {
            withCredentials: true, // Ensure cookies are sent with the request
          }
        );

        const fetchedConversations = response.data.conversations;

        setConversations((prevConversations) => {
          // Create a set of existing member IDs for quick lookup
          const existingMemberSets = prevConversations.map(conv =>
            new Set(conv.members)
          );

          // Filter out conversations that are duplicates based on members
          const newConversations = fetchedConversations.filter(conv => {
            const currentMembersSet = new Set(conv.members);
            return !existingMemberSets.some(existingSet =>
              existingSet.size === currentMembersSet.size &&
              [...existingSet].every(member => currentMembersSet.has(member))
            );
          });

          // Return new conversations if there are any, or existing ones
          return prevConversations.length === 0 || newConversations.length > 0
            ? [...prevConversations, ...newConversations]
            : prevConversations;
        });
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [seller, messages]);



  useEffect(() => {
    if (seller) {
      const sellerId = seller?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
      product: currentChat.product || null,
    };

    const receiverId = currentChat.members.find(
      (member) => member.id !== seller._id
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
      product: currentChat.product || null,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (e) => {
    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: e,
      product: currentChat.product || null,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, {
          images: e,
          sender: seller._id,
          text: newMessage,
          conversationId: currentChat._id,
          product: currentChat.product || null,
        })
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: seller._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  return (
    <div className="yebone-fade-up">
      <div className="vendor-inbox-list dashboard-section yebone-surface min-h-[70vh] relative">
        {!open && (
          <>
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-Poppins text-lg font-semibold dark:text-white">Shop inbox</h2>
              <p className="text-sm text-gray-500">Customer conversations</p>
            </div>
            {conversations?.length === 0 ? (
              <DashboardEmptyState
                icon={FiMessageSquare}
                title="No messages yet"
                message="When customers reach out, conversations will appear here."
              />
            ) : (
              conversations.map((item, index) => (
                <MessageList
                  data={item}
                  key={index}
                  index={index}
                  setOpen={setOpen}
                  setCurrentChat={setCurrentChat}
                  me={seller._id}
                  setUserData={setUserData}
                  userData={userData}
                  online={onlineCheck(item)}
                  setActiveStatus={setActiveStatus}
                  isLoading={isLoading}
                />
              ))
            )}
          </>
        )}

        {open && (
          <SellerInbox
            setOpen={setOpen}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessageHandler={sendMessageHandler}
            messages={messages}
            sellerId={seller._id}
            userData={userData}
            activeStatus={activeStatus}
            scrollRef={scrollRef}
            setMessages={setMessages}
            handleImageUpload={handleImageUpload}
          />
        )}
      </div>
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
  isLoading
}) => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/dashboard-messages?${id}`);
    setOpen(true);
  };
  const [active, setActive] = useState(0);

  useEffect(() => {
    const userId = data.members.find((user) => user != me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  return (
    <div
      className={`vendor-inbox-item ${active === index ? "is-active" : ""}`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className="relative">
        <img
          src={`${user?.avatar?.url}`}
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px] dark:text-white">{user?.name}</h1>
        <p className="text-[16px] text-green-900">
          {!isLoading && data?.lastMessageId !== user?._id
            ? "You:"
            : (user?.name || "").split(" ")[0] + ": "}
          <span className="text-gray-700 dark:text-gray-400 text-sm">
            {data?.lastMessage?.slice(0, 10)}
          </span>
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  scrollRef,
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  handleImageUpload,
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-[#1f1f1f] overflow-hidden">
      {/* Header */}
      <div className="w-[100%] flex p-4 items-center justify-between bg-white dark:bg-[#2d2d2d] border-b dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={userData?.avatar?.url}
              alt=""
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
            {activeStatus && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#2d2d2d]"></span>
            )}
          </div>
          <div>
            <h1 className="font-medium text-gray-800 dark:text-white">{userData?.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeStatus ? "Active Now" : "Offline"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <AiOutlineArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-4">
        {messages.map((item, index) => (
          <div
            key={index}
            className={`flex ${
              item.sender === sellerId ? "justify-end" : "justify-start"
            }`}
            ref={scrollRef}
          >
            <div className={`flex max-w-[80%] ${item.sender === sellerId ? "flex-row-reverse" : "flex-row"}`}>
              {/* Sender Avatar */}
              {item.sender !== sellerId && (
                <img
                  src={userData?.avatar?.url}
                  className="w-8 h-8 rounded-full mr-2"
                  alt=""
                />
              )}

              {/* Message Content */}
              <div className={`flex flex-col ${item.sender === sellerId ? "items-end" : "items-start"}`}>
                {/* Product Context if exists */}
                {item.product && (
                  <div className="flex items-center gap-2 mb-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        RWF {item.product.discountPrice}
                      </p>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div
                  className={`rounded-lg px-4 py-2 max-w-sm break-words ${
                    item.sender === sellerId
                      ? "bg-[#29625d] text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
                  }`}
                >
                  {item.images && (
                    <img
                      src={item.images?.url}
                      alt="message-img"
                      className="max-w-[200px] rounded-lg mb-2"
                    />
                  )}
                  {item.text && <p className="text-sm">{item.text}</p>}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {format(item.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form 
        onSubmit={sendMessageHandler}
        className="absolute bottom-0 w-[100%] p-4 bg-white dark:bg-[#2d2d2d] border-t dark:border-gray-700"
      >
        <div className="flex items-center gap-2">
          <label 
            htmlFor="image"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer transition-colors"
          >
            <TfiGallery className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </label>
          
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-full focus:ring-2 focus:ring-[#29625d] dark:text-white"
          />
          
          <button
            type="submit"
            className="p-2 bg-[#29625d] hover:bg-[#1f4e45] rounded-full transition-colors"
          >
            <AiOutlineSend className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardMessages;
