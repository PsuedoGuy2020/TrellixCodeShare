import React from "react";
import Doubt from "./Doubt";
import "./DoubtSection.module.css";

function DoubtSection({ status, setDoubt, doubt, askDoubt, allDoubts }) {
  return (
    <div className="doubt_section_container">
      <div className="header">
        <h3>Doubt Box</h3>
        <button className="btm" onClick={() => status(false)}>x</button>
      </div>
      <div className="doubts_wrapper">
        {Object.keys(allDoubts).length > 0 &&
          Object.keys(allDoubts).map((key, index) => (
            <Doubt username={key} doubttext={allDoubts[key]} />
          ))}
      </div>
      <form onSubmit={(e) => askDoubt(e)} className="ask_doubt_wrapper">
        <input
          type="text"
          value={doubt}
          onChange={(e) => setDoubt(e.target.value)}
        />
        <button
          className="btn"
          class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-0.5 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          onClick={(e) => askDoubt(e)}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default DoubtSection;
