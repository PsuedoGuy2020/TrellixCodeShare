import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../../Actions";
import Client from "../../components/Client/Client";
import Editor from "../../components/Editor/Editor";
import { initSocket } from "../../socket";
import { MdSubdirectoryArrowLeft } from "react-icons/md";
import styles from "./EditorPage.module.css";
import Doubt from '../../components/Doubts/Doubt';
// import { onClick } from "../../components/Editor/Editor";
// import { VscDebugContinueSmall } from "react-icons/vsc";
import Slider from "../../components/Slider/Slider";
import DoubtSection from '../../components/Doubts/DoubtSection';
// import { VscRunAll } from "react-icons/vsc";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const [access, setAccess] = useState(false);
  const [liveCode, setLiveCode] = useState("");
  const [isChatShown, setChatShown] = useState(false);
  const location = useLocation();
  const [doubt, setDoubt] = useState("");
  const [allDoubts, setAllDoubts] = useState({});
  const { id } = useParams();
  const editorRef = useRef(null);
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  // const { id } = useParams();
  const imageStyle = {
    width: "55px",
    marginLeft: "20px",
  };
  const handleChat = (e) => {
    e.preventDefault();
    setChatShown(true);
  }

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        id,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.DOUBT, ({ doubts, username, socketId }) => {
        setAllDoubts(doubts);
        toast.success(`${username} asked a doubt!`)
      })

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          setClients(clients);
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    editorRef.current.setOption('readOnly', false)
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyid() {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("Room Id has been copied to your clipboard!", {
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
    } catch (err) {
      toast.error("Could not copy the Room Id!", {
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
      console.error(err);
    }
  }

  async function askDoubt(e) {
    e.preventDefault();
    socketRef.current.emit(ACTIONS.DOUBT, {
      id,
      username: location.state.username,
      doubt
    })
    setDoubt("");
  }

  async function lockAccess() {
    setAccess(!access);
    socketRef.current.emit("lock_access", {
      id,
      access,
    });
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center justify-start">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span class="sr-only">Open sidebar</span>
                <svg
                  class="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="https://flowbite.com" class="flex ml-2 md:mr-24">
                <img style={imageStyle} src="/images/logo-img.png" alt="logo" />
                <h1 className={styles.animateCharcter}>
                  <b>
                    <i>TRELLIX</i>
                  </b>
                </h1>
              </a>
            </div>
            <div class="flex items-center">
              <div class="flex items-center ml-3">
                <div>
                <button className={styles.doubtBtn} onClick={handleChat}>Ask a doubt? </button>
          {isChatShown && <DoubtSection status={setChatShown} setDoubt={setDoubt} doubt={doubt} askDoubt={askDoubt} allDoubts={allDoubts} />}
                  {/* <VscRunAll size={50} className={styles.runButton} type="submit" onClick={handleClick}/> */}
                  {/* <button
                    type="button"
                    class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span class="sr-only">Open user menu</span>
                    <button
                      className="btnAlign btn leaveBtn"
                      
                    >
                      Run Code
                    </button>
                  </button> */}
                </div>
                <div
                  class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                  id="dropdown-user"
                >
                  <div class="px-4 py-3" role="none">
                    <p
                      class="text-sm text-gray-900 dark:text-white"
                      role="none"
                    >
                      Neil Sims
                    </p>
                    <p
                      class="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                      role="none"
                    >
                      neil.sims@flowbite.com
                    </p>
                  </div>
                  <ul class="py-1" role="none">
                    <li>
                      <a
                        href="#"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Earnings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="aside">
        <div className="asideInner">
          <aside
            id="logo-sidebar"
            class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
            aria-label="Sidebar"
          >
            <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
              <ul class="space-y-2 font-medium">
                <div className="asideInner">
                  <h3 className="header1">
                    <b>Participants</b>
                  </h3>
                  <div className="clientsList">
                    {clients.map((client) => (
                      <Client
                        className="header2"
                        key={client.socketId}
                        username={client.username}
                      />
                    ))}
                  </div>
                </div>
                {/* <h3 className={styles.bcgColor}>
                  <b>Select your Language</b>
                </h3> */}
                <button className="btnAlign btn copyBtn" onClick={copyid}>
                  Copy Room Id
                </button>
                <button className="btnAlign btn leaveBtn" onClick={leaveRoom}>
                  Leave Room
                </button>
              </ul>
            </div>
          </aside>
        </div>
      </div>
      <div class="p-4 sm:ml-64">
        <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="editorWrap">
            <Editor
              socketRef={socketRef}
              // id={id}
              setLiveCode={setLiveCode}
              access={access}
              id={id}
              editorRef={editorRef}
              onCodeChange={(code) => {
                codeRef.current = code;
              }}
            />
          </div>
          {/* {clients.length !== 0 &&
            clients[0].username === location.state.username && (
              <button
                className="btn doubtBtn"
                style={{ right: "300px" }}
                onClick={lockAccess}
              >
                {access ? "Lock" : "Unlock"} Editor
              </button>
            )} */}
          <div class="flex items-center justify-center h-10 mb-4 rounded bg-gray-50 dark:bg-gray-800">
            <p class="text-2xl text-gray-400 dark:text-gray-500">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width=""
                d="M9 1v16M1 9h16"
              />
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditorPage;
