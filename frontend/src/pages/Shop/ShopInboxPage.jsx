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
import Avatar from "react-avatar";
import Loader from "../../components/Layout/Loader";
import Header from "../../components/Layout/Header";
import SellerHeader from "../../components/Layout/SellerHeader";
const ENDPOINT = "https://socket-9hvq.onrender.com/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const ShopInboxPage = () => {
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
        const resonse = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${seller?._id}`,
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
    };

    const receiverId = currentChat.members.find(
      (member) => member.id !== seller._id
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
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
        console.log(res.data.conversation);
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
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, {
          images: e,
          sender: seller._id,
          text: newMessage,
          conversationId: currentChat._id,
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
    <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {!open && (
            <>
              <SellerHeader />
              {!conversations ? (
                <div className="relative top-20 bg-beige min-h-[80vh] fe-car mx-auto text-center flex flex-col items-center justify-center">
                  <p className="font-bold text-xl md:text-3xl lg:tex-4xl">
                    Inbox Empty
                  </p>
                  <img
                    src="/images/inbox-cleanup-animate.svg"
                    alt=""
                    className=" w-[300px] md:w-[500px]"
                  />
                </div>
              ) : (
                <div className="relative  bg-beige min-h-[100vh] fe-car">
                  <h1 className="text-center text-4xl pt-5 font-bold py-3">
                    All Messages
                  </h1>
                  {/* All messages list */}
                  <div className="bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 w-3/4 mx-auto rounded-xl shadow-xl  ">
                    {conversations &&
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
                      ))}
                  </div>
                </div>
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
        </>
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
  online,
  setActiveStatus,
  isLoading,
}) => {
  console.log(data);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/shop-message?${id}`);
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
      className={`w-full flex p-3 px-3 ${
        active === index ? "bg-[#00000010]" : "bg-transparent"
      }  cursor-pointer`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className="relative">
        {user?.avatar?.url ? (
          <img
            src={`${user?.avatar?.url}`}
            className="w-[35px] h-[35px] rounded-full"
            alt=""
          />
        ) : (
          <Avatar name={user.name} size="40" round={true} color="#A91151" />
        )}
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#000c]">
          {!isLoading && data?.lastMessageId !== user?._id
            ? "You:"
            : user?.name?.split(" ")[0] + ": "}{" "}
          {data?.lastMessage}
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
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* message header */}
      <div className="w-full flex p-3 items-center justify-between  shadow-lg border-b border-black">
        <div className="flex">
          <img
            src={`${userData?.avatar?.url}`}
            alt=""
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1>{activeStatus ? "Active Now" : "Offline"}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* messages */}
      <div className="px-3 h-[75vh] py-3 overflow-y-scroll bg-gradient-to-r from-red-200 via-red-300 to-yellow-200">
        {messages &&
          messages.map((item, index) => {
            return (
              <div
                className={`flex w-full my-2 ${
                  item.sender === sellerId ? "justify-end" : "justify-start"
                }`}
                ref={scrollRef}
              >
                {item.sender !== sellerId && (
                  <img
                    src={`${userData?.avatar?.url}`}
                    className="w-[40px] h-[40px] rounded-full mr-3"
                    alt=""
                  />
                )}
                {item.images && (
                  <img
                    src={`${item.images?.url}`}
                    className="w-[300px] h-[300px] object-cover rounded-[10px] mr-2"
                  />
                )}
                {item.text !== "" && (
                  <div>
                    <div
                      className={`w-max p-2 rounded ${
                        item.sender === sellerId
                          ? "bg-[#000] rounded-l-xl rounded-b-xl"
                          : "bg-[#38c776] rounded-r-xl rounded-t-xl"
                      } text-[#fff] h-min`}
                    >
                      <p>{item.text}</p>
                    </div>

                    <p className="text-[12px] text-[#000000d3] pt-1">
                      {format(item.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* send message input */}
      <form
        className="p-3 relative w-full h-fit flex justify-evenly items-center mt-5 "
        onSubmit={sendMessageHandler}
      >
        <div className="">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <label htmlFor="image">
          <TfiGallery className="cursor-pointer mr-2" size={20} />
        </label>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input} rounded-xl bg-gradient-to-r from-red-200 via-red-300 to-yellow-200`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
        </div>
        <label htmlFor="send">
          <AiOutlineSend
            size={20}
            className="cursor-pointer"
          />
        </label>
      </form>
    </div>
  );
};

export default ShopInboxPage;
