import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import {Settings} from './types'

interface Props {
  filterSettings: Settings;
  setFilterSettings: (value: Settings ) => void;
  handleSubmit: (value: React.SyntheticEvent) => void;
}


function Sidebar(props: Props) {

  const [isOpen, setIsOpen] = useState(true);

  const handleTrigger = () => setIsOpen(!isOpen);

  return (

    <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
    <div className="trigger" onClick={handleTrigger}>
    <i className="fa-solid fa-x fa-sm"></i>
    </div>
    <form>
      <div className="sidebar-position">
      <i className="fa-solid fa-magnifying-glass" onClick={handleTrigger}></i>
      {isOpen ? ( 
        <label>
          Enter a Hashtag:
        <input
          type = "text" 
          required
          name = "hashtag"
          value = {props.filterSettings.hashtag}
          onChange={(e) => props.setFilterSettings({...props.filterSettings, hashtag: e.target.value})}
        />
        </label>)
        :  "" } 
      </div>
      <div className="sidebar-position">
        <i className="fa-solid fa-arrow-up-wide-short" onClick={handleTrigger}></i>
        {isOpen ? ( 
        <label>
          Amount of Tweets:
        <input
          type = "number" 
          name = "tweetAmount"
          value = {props.filterSettings.tweetAmount}
          onChange={
            (e) => props.setFilterSettings({...props.filterSettings, tweetAmount: e.target.valueAsNumber})}
        />
        </label>):""}
      </div>
      <div className="sidebar-position">
        <i className="fa-solid fa-calendar-days" onClick={handleTrigger}></i>
        {isOpen ? ( 
        <label>Date since (yyyy-mm--dd)"
        <input
          type = "text"
          required
          name = "dateSince"
          value = {props.filterSettings.dateSince}
          onChange={(e) => props.setFilterSettings({...props.filterSettings, dateSince: e.target.value})}
        />
        </label>):""}
        </div>
        <div className="sidebar-position">
        <i className="fa-solid fa-check" onClick={handleTrigger}></i>
        {isOpen ? ( 
        <button 
        className='form-submit-button'
        onClick={props.handleSubmit}>
          Submit
        </button>):""}
      </div>
      </form>
      </div>
  );
}

export default Sidebar