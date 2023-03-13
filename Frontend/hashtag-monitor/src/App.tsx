import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ForceGraph3D from 'react-force-graph-3d'
import ForceGraph2D from 'react-force-graph-3d'
import "./styles.css";
import Legend from './Legend'
import Sidebar from './Sidebar'
import {Settings, Update, Node, Link, NetworkData} from './types'

function App() {

  const [activeCall, setActiveCall] = useState<boolean>(false)
  const [filterSettings, setFilterSettings] = useState<Settings>({
    hashtag:"",
    tweetAmount: 500,
    dateSince:""
  })
  const [update, setUpdate] = useState<Update>({
    status: "Initializing Twitter Bot",
    current_tweet: 0
  })
  const [data, setData] = useState <NetworkData>()


  const handlePoolingRequest = () => {
    fetch('http://127.0.0.1:5000/update')
    .then(response => response.json())
    .then((data)=> setUpdate({...update, status:  data.data.status, current_tweet: data.data.current_tweet}))
  }

  const renderUpdateSwitch = (param:String) => {
    switch(param) {
      case "Scraping Data\n":
        return <div>{update.status} - ({update.current_tweet} out of {filterSettings.tweetAmount} Tweets)</div>;
      case 'Transforming Data':
        return <div>Creating Network Connections</div>
      default:
        return 'Initializing Twitter Bot';
    }
  }

  const validDate = (providedDateFormatted: string) => {

    const currentDate = new Date(); 
    const providedDate = new Date(providedDateFormatted); 
    return(currentDate>providedDate)

  }

  const validForm = () => {

    const errors: string[] = []

    var dateFormat= new RegExp (/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)

    if(filterSettings.hashtag === ""){

      errors.push("Please provide a hashtag")
    
    }

    if (filterSettings.tweetAmount < 1 || filterSettings.tweetAmount > 1500){

      errors.push("Please only use an amount between 1-1500")

    }

    if(!dateFormat.test(filterSettings.dateSince)){
      errors.push("Please only use the proper date format")
    }

    if(!validDate(filterSettings.dateSince)){
      errors.push("Please provide a date in the past")
    }

    if(errors.length===0 && validDate(filterSettings.dateSince)){
      return true
    }
    else{
      window.alert(errors.join("\n"))
      return false
    }

  }

  const handleSubmit = (event: React.SyntheticEvent): void => {
  
    if(validForm()){

      event.preventDefault();

      console.log(`input is ${filterSettings.dateSince}, ${filterSettings.hashtag}, ${filterSettings.tweetAmount}}`)

      const interval = setInterval(handlePoolingRequest, 1000)

      setActiveCall(true)

      /*send information to backend*/
  
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: filterSettings.hashtag, date: filterSettings.dateSince, amount: filterSettings.tweetAmount})
      };

      fetch('http://127.0.0.1:5000/users', requestOptions)
        .then(response => response.json())
        .then(data => setData(data.data))
        .then(data => console.log(data))
        .then(()=> clearInterval(interval))
        .then(()=> setActiveCall(false))

  }

  }

  return (   
    <>
     <div className="App">
      <div className="page">
      <div className="content">
        <div className="wrapper">
        {activeCall ?
          <div className="update-block">
            {renderUpdateSwitch(update.status)}
             </div>
              : ""}
          <ForceGraph2D 
            graphData = {data}
          />
        <Legend/>
        </div>
      </div>
      <Sidebar
      filterSettings = {filterSettings}
      setFilterSettings = {setFilterSettings}
      handleSubmit = {handleSubmit}
      />



           {/* <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
              <div className="trigger" onClick={handleTrigger}>
              <i className="fa-solid fa-x fa-sm"></i>
              </div>
              <form>
                <div className="sidebar-position">
                <i className="fa-solid fa-magnifying-glass"></i>
                {isOpen ? ( 
                  <label>
                    Enter a Hashtag:
                  <input
                    type = "text" 
                    required
                    name = "hashtag"
                    value = {filterSettings.hashtag}
                    onChange={(e) => setFilterSettings({...filterSettings, hashtag: e.target.value})}
                  />
                  </label>)
                  :  "" } 
                </div>
                <div className="sidebar-position">
                  <i className="fa-solid fa-arrow-up-wide-short"></i>
                  <label>
                    Amount of Tweets:
                  <input
                    type = "number" 
                    name = "tweetAmount"
                    value = {filterSettings.tweetAmount}
                    onChange={
                      (e) => setFilterSettings({...filterSettings, tweetAmount: e.target.valueAsNumber})}
                  />
                  </label>
                </div>
                <div className="sidebar-position">
                  <i className="fa-solid fa-calendar-days"></i>
                  <label>Date since (yyyy-mm--dd)"
                  <input
                    type = "text"
                    required
                    name = "dateSince"
                    value = {filterSettings.dateSince}
                    onChange={(e) => setFilterSettings({...filterSettings, dateSince: e.target.value})}
                  />
                  </label>
                  </div>
                  <div className="sidebar-position">
                  <i className="fa-solid fa-check"></i>
                  <button 
                  className='form-submit-button'
                  onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
                </form>
                </div>*/}
      </div>
    </div>
</>
    )
}


export default App;

/*            {/*
            <form>

            <div className="sidebar-position">
            <i className="fa-solid fa-retweet"></i>
            { isOpen ? 
              <label>RETWEETS
              <input
                type = "checkbox" 
                name = "retweets"
                checked
              />
              </label> : ""}
            </div>

            <div className="sidebar-position">
            <i className="fa-regular fa-thumbs-up"></i>
            { isOpen ? 
              <label>LIKES
              <input
                type = "checkbox" 
                name = "retweets"
                checked
              />
              </label>: ""}
            </div>

            <div className="sidebar-position">
            <i className="fa-solid fa-quote-left"></i>
            { isOpen ? 
              <label>MENTIONS
              <input
                type = "checkbox" 
                name = "retweets"
                checked
              />
              </label> : "" }
            </div>

            </form>*/

/* {update.status} scraped ({update.current_tweet} out of {filterSettings.tweetAmount} Tweets)*/


/*          <div className="sidebar-position">
            <span>Menu item 2</span>
          </div>
          <div className="sidebar-position">
            <span>Menu item 3</span>
          </div>

          <div className="sidebar-position">
            <span>Position 4</span>
          </div>
          /*


/*<form onSubmit={handleSubmit}>
<label>Enter a Hashtag:
  <input
    type = "text" 
    name = "hashtag"
    value = {hashtag}
    onChange={(e) => setHashtag(e.target.value)}
  />
</label>
<label>Enter a Hashtag:
  <input
    type = "text" 
    name = "hashtag"
    value = {hashtag}
    onChange={(e) => setHashtag(e.target.value)}
  />
</label>
<label>Enter a Hashtag:
  <input
    type = "text" 
    name = "hashtag"
    value = {hashtag}
    onChange={(e) => setHashtag(e.target.value)}
  />
</label>
</form>*/

/*data ?
  <ForceGraph3D
  graphData={data}
  //width = {graphWidth}
  //height = {graphHeight}
  /> : "data loading"*/

  //const mockFetchData = Data as Types.DataObject

      /*
        <ForceGraph3D
        graphData={data}
        width = {graphWidth}
        height = {graphHeight}
        />
    */

  /*
  useEffect(()=> {

    const svg = select(svgRef.current)

   //const nodeData: Types.Node[] = mockData.nodes
    //const linkData: Types.Link[] = mockData.links

    //console.log(nodeData)
    //console.log(linkData)

    svg.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


    // Initialize the links
    const link = svg
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
        .style("stroke", "#aaa")

      // Initialize the nodes
    const node = svg
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
      .attr("r", 20)
      .style("fill", "#69b3a2")

  // Let's list the force we wanna apply on the network
  var simulation = forceSimulation<any>(data.nodes)                 // Force algorithm is applied to data.nodes
    .force("link", forceLink()                                 // This force provides links between nodes
          //.id(function(d) { return d.id; }) 
          .id((d) => {return d.id})                    // This provide  the id of a node
          .links(data.links)                                    // and this the list of links
    )
    .force("charge", forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force("center", forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
    .on("end", ticked);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
  
      node
           .attr("cx", function (d) { return d.x+6; })
           .attr("cy", function(d) { return d.y-6; });
    }

  }, [])*/

  /*useEffect(()=> {

    const svg = select(svgRef.current)

    //Tell the line where do we want to render each dot
    const myLine = line<any>()
    .x((value, index)=> index*50)
    .y((value)=> 150 - value)
    .curve(curveCardinal)

    svg.selectAll("path")
    .data([data])
    .join("path")
    .attr("d", value => myLine(value))
    .attr("fill", "none")
    .attr("stroke", "blue")*/
   /* svg
    //select all existing circle elements you find
    .selectAll("circle")
    //synch with the data
    .data(data)
    .join(
      "circle"
      //what to do when data enters
      //enter => enter.append("circle"),
      //what to do when data updates
      //update => update.attr("class", "updated"),
      //what to do when data exits (but its a given so not needed unless for specific animationetc.)
      //exit => exit.remove()
    ).attr("r", value => value)
    .attr("cx", value => value*2)
    .attr("cy", value => value*2)
    .attr("stroke", "red")*/
    //console.log(svg.selectAll('circle').data(data))
  //}, [data])
  
