# Dashboard for Visualizing Social Media User Connections

I started this project as a way to get experience integrating and experience creating a front-end framework, an API, and a back-end framework to allow data to be sent back and forth.

I chose to create a dashboard that allows the user to visually investigate networks of twitter-user interactions concerning a specific hashtag. 

![Screenshot 2023-03-14 at 16 51 59](https://user-images.githubusercontent.com/47418990/225060892-42571e31-6fea-4e44-bfa2-49cbe4601a19.png)

The front-end was created in **React+ Typescript**  the API was created in **Flask** and the back-end houses a **Python** Script that connects to the Twitter API Endpoints through the Tweepy Module.

The visualization is done through Vasco Asturiano's amazing <a href="https://github.com/vasturiano/react-force-graph">module</a> that propogates the visualization of nodes and links in various versions of a  <a href="https://en.wikipedia.org/wiki/Force-directed_graph_drawing">force-directed graph </a> 


# II. Project Description
The main part of the application runs in the backend. 

The user supplies the following infroamtion through a form in the frontend

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



At this point we have gathered the information from the Twitter Endpoint and can start creating the network connections.

This is done by:

- cleaning the data set
- creating lists for the nodes and links
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

Main function of the frontend is to take in the user input, validate the  values, sent API-Requests, and display the returned values.

The input settings are defined as:

```typescript
export  type  Settings = {

	hashtag: string,

	tweetAmount: number,

	dateSince: string

}
```

The checks therefore consist of checking if the ```hashtag``` is a string and not empty, if the ```tweetAmount``` is between 1 and 1500 (API Limit) and if the ```dateSince``` matches the RegEx that only allows for the date-format YYYY-MM-DD (API specific) to be valid.

Once the input is validified we're creating an API request

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

And displaying the corresponding status overimposed on the app by rednering it like.

```typescript
const  renderUpdateSwitch = (param:String) => {

	switch(param) {

		case  "Scraping Data\n":

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

A succesfull response from the original API Call is then transformed into JSON and saved in data strcuture with the format above.

## Backend

Our POST-ENDPOINT in the Flask API accepts the settings the user put into the form and sends these to a scraping module. Here we create, authorize the TwitterAPI connection, create a dataframe for the specific request and consequently send a request to the Twitter API. The returned data frame is then iterated and used to fill the data frame.

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




# V. Impact

# VI. Conclusion

