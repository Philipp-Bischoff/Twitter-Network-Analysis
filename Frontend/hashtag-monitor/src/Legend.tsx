import React from 'react'
import "./styles.css";

function Legend() {
  return (
    <div className = 'info-legend'>
        <div className = 'legend-item'>
        <span className ="dot-red"></span> Retweet 
        </div>
        <div className = 'legend-item'>
        <span className ="dot-green"></span> Mention   
        </div>
        <div className = 'legend-item'>
        <span className ="dot-blue"></span> Replied
        </div>
    </div>
  )
}

export default Legend