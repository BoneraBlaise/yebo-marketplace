import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { server } from "../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../styles/styles";
import { socketUrl } from "../server";

const ENDPOINT = socketUrl;
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInbox = () => {
  const { user,loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [images, setImages] = useState();
  const [activeStatus, setActiveStatus] = useState(false);
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
        const resonse = await axios.get(
          `${server}/conversation/get-all-conversation-user/${user?._id}`,
          {
            withCredentials: true,
          }
        );

        setConversations(resonse.data.conversations);
      } catch (error) {
        // console.log(error);
      }
    };
    getConversation();
  }, [user, messages]);

  useEffect(() => {
    if (user) {
      const sellerId = user?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
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
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
      product: currentChat.product
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user?._id
    );

    socketId.emit("sendMessage", {
      senderId: user?._id,
      receiverId,
      text: newMessage,
      product: currentChat.product
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
      lastMessageId: user._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: user._id,
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
      (member) => member !== user._id
    );

    socketId.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(
          `${server}/message/create-new-message`,
          {
            images: e,
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
          }
        )
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
        lastMessageId: user._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  return (
    <div className="yebone-premium-screen w-full min-h-screen bg-yebone-light-gray dark:bg-gray-950">
      {!open && (
        <>
          <div className="max-w-3xl mx-auto px-4 py-6 lg:py-8">
            <h1 className="yebone-h3 text-center dark:text-white mb-6">Messages</h1>
            <div className="yebone-inbox-layout yebone-surface">
              <div className="overflow-y-auto max-h-[70vh] lg:max-h-[calc(100vh-12rem)]">
                {conversations &&
                  conversations.map((item, index) => (
                    <MessageList
                      data={item}
                      key={index}
                      index={index}
                      setOpen={setOpen}
                      setCurrentChat={setCurrentChat}
                      me={user?._id}
                      setUserData={setUserData}
                      userData={userData}
                      online={onlineCheck(item)}
                      setActiveStatus={setActiveStatus}
                      loading={loading}
                    />
                  ))}
              </div>
            </div>
          </div>
        </>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={user._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
        />
      )}
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
  userData,
  online,
  setActiveStatus,
  loading
}) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/inbox?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUser(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  return (
    <div
      className={`yebone-conversation-item ${active === index ? "is-active" : ""}`}
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
          <div className="w-[12px] h-[12px] bg-green-600 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px] dark:text-white">{user?.name}</h1>
        <p className="text-[16px] text-green-900">
          {!loading && data?.lastMessageId !== user?._id
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
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}) => {
  return (
    <div className="yebone-premium-screen w-full min-h-screen flex flex-col bg-yebone-light-gray dark:bg-gray-950">
      <div className="yebone-chat-header">
        <div className="flex">
          <img
            src={`${userData?.avatar?.url}`}
            alt=""
            className="w-[50px] h-[50px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600] dark:text-white mt-1">{userData?.name}</h1>
            <h1 className="text-sm text-green-600">{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer dark:text-gray-200"
          onClick={() => setOpen(false)}
        />
      </div>

      <div className="yebone-chat-messages flex-1 px-3 h-[75vh] lg:h-[calc(100vh-8rem)] hide-scrollbar">
        {messages &&
          messages.map((item, index) => (
            <div
              key={index}
              className={`flex ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
              ref={scrollRef}
            >
              <div className={`flex max-w-[80%] ${item.sender === sellerId ? "flex-row-reverse" : "flex-row"}`}>
                {item.sender !== sellerId && (
                  <img
                    src={userData?.avatar?.url}
                    className="w-8 h-8 rounded-full mr-2"
                    alt=""
                  />
                )}

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

                  <div
                    className={`yebone-chat-bubble break-words ${
                      item.sender === sellerId
                        ? "yebone-chat-bubble-sent"
                        : "yebone-chat-bubble-received"
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
                  <span className="yebone-chat-time">
                    {format(item.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* send message input */}
       <form className="yebone-chat-compose fixed bottom-0 left-0 w-full" onSubmit={sendMessageHandler}>
        <div className="w-8">
          <input
            type="file"
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="text-teal-600 cursor-pointer" size={24} />
          </label>
        </div>
        <div className="flex-1 mx-2">
          <input
            type="text"
            required
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="yebone-chat-input w-full"
          />
        </div>
        <button type="submit" className="text-teal-600">
          <AiOutlineSend size={24} />
        </button>
      </form>
    </div>
  );
};

export default UserInbox;
