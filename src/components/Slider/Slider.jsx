import { useState } from "react";
import { useEffect } from "react";
import { GiSplitCross } from "react-icons/gi";
import "./slider.css";
const Sidebar = ({ setSlider, output, setOutput }) => {
  const [loaded, setLoaded] = useState(true);

  const reset = () => {
    setOutput({
      result: "",
      memeory: "",
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoaded(false);
    }, 3000);
  }, []);

  return (
    <aside className="sidebar">
      <div className="closeButton" onClick={() => setSlider(false)}>
        <GiSplitCross className="closeBtnSty"color="#fff" size={40} />
      </div>
      <div className="yo">
        <h1 style={{ color: "white" }}><b>OUTPUT</b></h1>
      </div>
      {loaded ? <h6 style={{ color: "white" }}>Please Wait...</h6> : null}
      <em style={{ color: "skyblue" }}>Preview:</em>
      <h6 style={{ color: "white" }}>{output.result}</h6>
      <em style={{ color: "skyblue" }}>Memory:</em>
      <h6 style={{ color: "white" }}>{output.memory}</h6>
      <p style={{ color: "red" }}>{output.error}</p>
      <button className="clear" onClick={reset}>
        C L E A R
        <div id="clip">
          <div id="leftTop" className="corner"></div>
          <div id="rightBottom" className="corner"></div>
          <div id="rightTop" className="corner"></div>
          <div id="leftBottom" className="corner"></div>
        </div>
        <span id="rightArrow" className="arrow"></span>
        <span id="leftArrow" className="arrow"></span>
      </button>
    </aside>
  );
};

export default Sidebar;
