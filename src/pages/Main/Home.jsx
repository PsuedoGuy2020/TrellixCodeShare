import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const brandStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
  };
  const imageStyle = {
    width: "55px",
    marginLeft: "20px",
  };

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room!", {
      style: {
        backgroundColor: "black",
        color: "white",
      },
    });
  };

  const joinRoom = () => {
    if (!roomId) {
      toast.error("Room Id is required!", {
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
      return;
    }

    if (!username) {
      toast.error("Username is required!", {
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };
  return (
    <>
      <nav className={`${styles.navbar} container`}>
        <div style={brandStyle}>
          <img style={imageStyle} src="/images/logo-img.png" alt="logo" />
          <h1 className={styles.animateCharcter}>
            <b>
              <i>TRELLIX</i>
            </b>
          </h1>
        </div>
        <div className={styles.homePageWrapper}>
          <div className={styles.formWrapper}>
            <h4 className={styles.mainLabel}>
              <b>Paste Invitation (ROOM ID)</b>
            </h4>
            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.inputBox}
                placeholder="ROOM ID"
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
                onKeyUp={handleInputEnter}
              />
              <input
                type="text"
                className={styles.inputBox}
                placeholder="USERNAME"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                onKeyUp={handleInputEnter}
              />
              <button
                className={`${styles.btn} ${styles.joinBtn}`}
                onClick={joinRoom}
              >
                Join
              </button>
              <span className={styles.createInfo}>
                <b>If you don't have an invite then create?</b> &nbsp;
                <a
                  onClick={createNewRoom}
                  href=""
                  className={styles.createNewBtn}
                >
                  new room
                </a>
              </span>
            </div>
          </div>
        </div>
        <ul className={styles.circles}>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </nav>
    </>
  );
};

export default Home;
