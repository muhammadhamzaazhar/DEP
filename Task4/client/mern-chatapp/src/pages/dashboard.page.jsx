import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import Avatar from "../assets/profile.svg";
import Input from "../components/input.component";

const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const messageRef = useRef(null);

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user?.id);
    socket?.on("getUsers", (users) => {
      console.log("activeUsers :>> ", users);
    });
    socket?.on("getMessage", (data) => {
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { user: data.user, message: data.message },
        ],
      }));
    });
  }, [socket]);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.messages]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));
    const fetchConversations = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/conversation/${loggedInUser?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resData = await res.json();
      setConversations(resData);
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${user?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resData = await res.json();
      setUsers(resData);
    };
    fetchUsers();
  }, []);

  const fetchMessages = async (conversationId, receiver) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/message/${conversationId}?senderId=${
        user?.id
      }&&receiverId=${receiver?.receiverId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    setMessages({ messages: resData, receiver, conversationId });
  };

  const sendMessage = async (e) => {
    setMessage("");
    socket?.emit("sendMessage", {
      senderId: user?.id,
      receiverId: messages?.receiver?.receiverId,
      message,
      conversationId: messages?.conversationId,
    });
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: messages?.conversationId,
        senderId: user?.id,
        message,
        receiverId: messages?.receiver?.receiverId,
      }),
    });
  };

  return (
    <div className="w-screen flex h-screen">
      <div className="w-[20%] h-screen bg-[#475569] overflow-y-scroll hide-scrollbar shadow-md">
        <div className="flex justify-center items-center my-8">
          <div>
            <img
              src={Avatar}
              width={75}
              height={75}
              className="border border-[#e2e8f0] p-[2px] rounded-full"
            />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold text-white">{user?.fullName}</h3>
            <p className="text-lg font-light text-gray-300">My Account</p>
          </div>
        </div>
        <hr className="border-gray-500" />
        <div className="mx-10 mt-5">
          <div className="text-white text-lg font-bold">Messages</div>
          <div>
            {conversations.length > 0 ? (
              conversations.map(({ conversationId, user }) => (
                <div
                  key={conversationId}
                  className="flex items-center py-8 border-b border-b-gray-500 hover:bg-[#64748b]"
                >
                  <div
                    className="cursor-pointer flex items-center"
                    onClick={() => fetchMessages(conversationId, user)}
                  >
                    <img
                      src={Avatar}
                      alt="user-profile"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white cursor-pointer">
                      {user?.fullName}
                    </h3>
                    <p className="text-sm font-light text-gray-300 cursor-pointer">
                      {user?.email}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-lg font-semibold text-white mt-24">
                No Conversations
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-[63%] h-screen bg-[#334155] flex flex-col items-center shadow-md">
        {messages?.receiver?.fullName && (
          <div className="w-[75%] bg-[#082f49] h-[60px] mt-6 rounded-full flex items-center px-14 shadow-sm">
            <div className="cursor-pointer">
              <img
                src={Avatar}
                alt="user-profile"
                width={50}
                height={50}
                className="rounded-full"
              />
            </div>
            <div className="ml-6 mr-auto">
              <h3 className="text-lg font-bold text-white">
                {messages?.receiver?.fullName}
              </h3>
              <p className="text-sm font-light text-gray-300 cursor-pointer">
                {messages?.receiver?.email}
              </p>
            </div>
            <div className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-phone-outgoing"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                <line x1="15" y1="9" x2="20" y2="4" />
                <polyline points="16 4 20 4 20 8" />
              </svg>
            </div>
          </div>
        )}
        <div className="h-[85%] w-full overflow-y-scroll hide-scrollbar shadow-sm">
          <div className="px-6 py-10">
            {messages?.messages?.length > 0 ? (
              messages.messages.map(({ message, user: { id } = {} }, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className={`max-w-[40%] rounded-b-xl p-4 mb-2 ${
                        id === user?.id
                          ? "bg-[#0284c7] text-white rounded-tl-xl ml-auto"
                          : "bg-[#0f172a] rounded-tr-xl text-white"
                      } shadow-sm`}
                    >
                      {message}
                    </div>
                    <div ref={messageRef}></div>
                  </>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold text-white mt-24">
                No Messages or No Conversation Selected
              </div>
            )}
          </div>
        </div>
        {messages?.receiver?.fullName && (
          <div className="py-4 w-full flex items-center shadow-sm">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="px-4 py-3 ml-6 border-gray-900 shadow-lg rounded-full bg-gray-900 text-white  focus:ring-blue-500 focus:border-blue-500 outline-none"
              inputClassName="w-[75%] mx-auto"
            />
            <div
              className={`flex items-center p-2 cursor-pointer bg-[#0284c7] rounded-md mr-24 mt-2 hover:bg-[#0369a1] ${
                !message && "pointer-events-none"
              }`}
              onClick={() => sendMessage()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-send"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <line x1="10" y1="14" x2="21" y2="3" />
                <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="w-[17%] bg-[#1e293b] overflow-y-scroll hide-scrollbar shadow-md p-2">
        <div className="text-white text-lg p-4 font-bold">People</div>
        <div>
          {users.length > 0 ? (
            users.map(({ userId, user }) => {
              return (
                <div
                  key={userId}
                  className="flex items-center py-8 border-b border-b-gray-500 hover:bg-[#475569]"
                >
                  <div
                    className="cursor-pointer flex items-center"
                    onClick={() => fetchMessages("new", user)}
                  >
                    <div>
                      <img
                        src={Avatar}
                        alt="user-profile"
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-white">
                        {user?.fullName}
                      </h3>
                      <p className="text-sm font-light text-gray-300 cursor-pointer">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-lg font-semibold text-white mt-20">
              No Conversations
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
