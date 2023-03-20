# Dashboard for Visualizing Social Media User Connections

I started this project as a way to get experience integrating and experience creating a front-end framework, an API, and a back-end framework to allow data to be sent back and forth.

I chose to create a dashboard that allows the user to visually investigate networks of twitter-user interactions concerning a specific hashtag. 

The idea behind the project came from more of a social science perspective. I wanted to create a prototype for an application that could allow researchers to visualize interaction within social media platforms. For better or worse, social media companies provide a marketplace in which information and dis-information is spread by accident as well as by actors with malicious intent. A visualization of these connections can make the investigation of what happens, who posts what and which users have what kind of influence more intuitive. 

![alt-text](https://github.com/Philipp-Bischoff/Twitter-Network-Analysis/blob/main/Frontend/hashtag-monitor/src/Example.gif)

The front-end was created in **React+ Typescript**  the API was created in **Flask** and the back-end houses a **Python** Script that connects to the Twitter API Endpoints through the Tweepy Module.

The visualization is done through Vasco Asturiano's amazing <a href="https://github.com/vasturiano/react-force-graph">module</a> that propogates the visualization of nodes and links in various versions of a  <a href="https://en.wikipedia.org/wiki/Force-directed_graph_drawing">force-directed graph </a> 


# II. Project Description
The main part of the application runs in the backend. 

The user supplies the following information through a form in the frontend

- the specific hashtag
- the amount of tweets to be found 
- the time period over which the search is extended

The python script then:

- authenticates the access to the Twitter API
- creates a dataframe that stores each tweet's information
- acceses tweepy's  <a href = "https://docs.tweepy.org/en/v3.5.0/cursor_tutorial.html"> cursor object</a>
- loop through the tweets and record data and store in the following data frame

```python  
	network_db = pd.DataFrame(columns=[
        'screen_name', 'id', 'user_mention_screen_name',
        'user_retweet_screen_name', 'user_retweet_id',
        'user_reply_to_user_name', 'user_reply_to_id', 'tweet_replied_to'
   	 ]) 
```



At this point we have gathered the information from the Twitter endpoint and can start creating the network connections.

This is done by:

- cleaning the data set
- creating an object containing two lists for nodes and links respectively
- iterating through the data frame and finding and recording nodes, connections and the type of connection (reply, mention, retweet)

The data is now transformed according to the frontend visualization tool's JSON template and returned to the front-end through the API.

```typescript
{
    "nodes": [ 
        { 
          "id": "id1",
          "name": "name1",
          "val": 1 
        },
        { 
          "id": "id2",
          "name": "name2",
          "val": 10 
        },
        ...
    ],
    "links": [
        {
            "source": "id1",
            "target": "id2"
        },
        ...
    ]
}
```

# III. Technical Details

## Frontend

The main function of the frontend is to take in the user input, validate the values, send API-Requests, and display the returned values as a network graph.

The input settings are defined as:

```typescript
export  type  Settings = {

	hashtag: string,

	tweetAmount: number,

	dateSince: string

}
```

The checks therefore consist of checking if the ```hashtag``` is a string and not empty, if the ```tweetAmount``` is between 1 and 1500 (API Limit) and if the ```dateSince``` matches the RegEx that only allows for the date-format YYYY-MM-DD (API specific) to be valid.

Once the input is validified we're creating the following API request

```typescript

  const handleSubmit = (event: React.SyntheticEvent): void => {
  
    if(validForm()){

      event.preventDefault();

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
        .then(()=> clearInterval(interval))
        .then(()=> setActiveCall(false))
  	}	

  }
```

To give the user an understanding of where the backend process is currently, while we're waiting for the response of the main API requests, we're fetching a status update request every second by 

```typescript
const  handlePoolingRequest = () => {

	fetch('http://127.0.0.1:5000/update')

	.then(response  =>  response.json())

	.then((data)=>  setUpdate({...update, status:  data.data.status, current_tweet:  data.data.current_tweet}))

}
```

And displaying the corresponding status overimposed on the app by rednering it in the following switch statement

```typescript
const  renderUpdateSwitch = (param:String) => {

	switch(param) {

		case  "Scraping Data":

			return  <div>{update.status} - ({update.current_tweet} out of {filterSettings.tweetAmount} Tweets)</div>;

	case  'Transforming Data':

		return  <div>Creating Network Connections</div>

	default:

		return  'Initializing Twitter Bot';

	}

}
```

As the data format is strictily specified by the visualization tool, I created these 3 types

```typescript
export  type  Node = {

	id: string;

	name: string,

	value: number

}

export  type  Link = {

	source: string,

	target: string,

	color: string

}

export  interface  NetworkData {

	"nodes": Node [],

	"links": Link [],

}

```

A succesfull response from the initial API call is then transformed into JSON and saved in data strcuture with the format above.

## Backend

Our POST-ENDPOINT in the Flask API accepts the settings the user put into the form and sends these to a scraping module. Here we authorize the TwitterAPI connection, create a dataframe for the specific request and consequently send a request to the Twitter API. The returned data is then iterated and used to fill the data frame.

This dataframe is then cleaned and reformatted to be send back to the frontend.

For our update call we have the following endpoint that keeps track of how many tweets have already been scraped and at what process the transformation of the data is at currently

```python
class  Update(Resource):

	def  get(self):
	
		update = {
			"status": status,
			"current_tweet": scrape_data.increment_counter
			}
		return {'data': update}, 200
```


# IV. Demonstration

The following demonstrates searching for the "F1" hashtag on the day of the Jeddah Corniche Circuit event.

https://user-images.githubusercontent.com/47418990/226273753-b2511f21-ad29-4f80-b0f5-9ca02c4ea2fb.mov

The "F1" hasthag is a good demonstration of the idea behind the project. It clearly shows that most users found in the sample interact with the official Formula One account. 


# VI. Conclusion

I liked the minimum viable product that resulted from this project, it gave me valuable insights into structuring data with TypeScript, how to send data back and forth and how to connect to external APIs. The limitations, as always, are essentially in it's computational ability and the bottleneck to the API access. To actually get relevant information for a scientific inquiry, one would have to scrape much more data. This is either coupled with paying for elevated API priviliges or finding out a way to scrape them from the website directly. Nonetheless, I think the concept I created holds merit in the investigation to what is happening between online actors.
