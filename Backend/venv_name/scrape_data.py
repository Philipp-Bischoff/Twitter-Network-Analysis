# Python Script to Extract tweets of a
# particular Hashtag using Tweepy and Pandas

# import modules
import os
import pandas as pd
import tweepy
import json
import server
from dotenv import load_dotenv

increment_counter = 1

load_dotenv()


#Function that authenticates the API access
def authpy():
    '''
    Authenticate to Twitter and get API object.
    '''

    key, secrets = os.getenv("API_KEY"), os.getenv("API_SECRETS")
    tk, tk_secrets = os.getenv("ACCESS_TOKEN"), os.getenv("ACCESS_SECRET")

    # Authenticate to Twitter
    auth = tweepy.OAuthHandler(key, secrets)
    auth.set_access_token(tk, tk_secrets)

    # Create the API object
    api = tweepy.API(auth)

    return api


#Reads credentials from json to not publicly display the keys when published later
def read_creds(filename):
    '''
    Read JSON file to load credentials.
    Store API credentials in a safe place.
    If you use Git, make sure to add the file to .gitignore
    '''
    with open(filename) as f:
        credentials = json.load(f)
    return credentials


# function to display data of each tweet
def printtweetdata(n, ith_tweet):
    print()
    print(f"Tweet {n}:")
    print(f"Username:{ith_tweet[0]}")
    print(f"Description:{ith_tweet[1]}")
    print(f"Location:{ith_tweet[2]}")
    print(f"Following Count:{ith_tweet[3]}")
    print(f"Follower Count:{ith_tweet[4]}")
    print(f"Total Tweets:{ith_tweet[5]}")
    print(f"Retweet Count:{ith_tweet[6]}")
    print(f"Tweet Text:{ith_tweet[7]}")
    print(f"Hashtags Used:{ith_tweet[8]}")


def printtweetdatanetwork(n, ith_tweet):

    print()
    print(f"Tweet {n}:")
    print(f"User who posted the Tweet:{ith_tweet[0]}")
    #print(f"id:{ith_tweet[1]}")
    print(f"@ in Tweet :{ith_tweet[2]}")
    #print(f"retweeted To:{ith_tweet[3]}")
    print(f"In reply to:{ith_tweet[4]}")
    # print(f"reply to:{ith_tweet[5]}")
    print(f"tweet replied to:{ith_tweet[6]}")


# function to perform data extraction
def scrape(words, date_since, num_tweets, api):

    global increment_counter

    network_db = pd.DataFrame(columns=[
        'screen_name', 'id', 'user_mention_screen_name',
        'user_retweet_screen_name', 'user_retweet_id',
        'user_reply_to_user_name', 'user_reply_to_id', 'tweet_replied_to'
    ])

    # We are using .Cursor() to search
    # through twitter for the required tweets.
    # The number of tweets can be
    # restricted using .items(number of tweets)
    tweets = tweepy.Cursor(api.search_tweets,
                           words,
                           lang="en",
                           since_id=date_since,
                           tweet_mode='extended').items(num_tweets)

    # .Cursor() returns an iterable object. Each item in
    # the iterator has various attributes
    # that you can access to
    # get information about each tweet
    list_tweets = [tweet for tweet in tweets]

    # Counter to maintain Tweet Count
    i = 1

    # we will iterate over each tweet in the
    # list for extracting information about each tweet

    #I need to find author of the tweet
    #Twitter users mention in the text of the Tweet
    #Account taking the retweet action

    for tweet in list_tweets:

        #print("retweet count : ", tweet.retweet_count)
        # print("tweet:" + tweet.full_text)

        #Person who tweeted
        network_username = tweet.user.screen_name

        #ID of Account who tweeted
        network_user_id = tweet.user.id

        #Is it retweeting someone?
        try:
            network_retweet_username = tweet.retweeted_status.user.screen_name
            network_retweet_id = tweet.retweeted_status.user.id
        except AttributeError:
            network_retweet_username = ""
            network_retweet_id = ""

        #Is it replying to someone?
        try:
            #Account to which the tweet replied
            network_user_replied_to_username = tweet.in_reply_to_screen_name
            network_user_replied_to_id = tweet.in_reply_to_user_id
            #Tweet the to which the tweet replied to
            network_tweet_replied_to = tweet.in_reply_to_status_id

        except AttributeError:
            network_user_replied_to_username = ""
            network_user_replied_to_id = ""
            network_tweet_replied_to = ""

        #Is it mentioning anyone?
        try:
            network_users_mentioned_name = tweet.entities['user_mentions'][0][
                'screen_name']
        except IndexError:
            network_users_mentioned_name = ""

        #increment(i)

        i += 1
        increment_counter += 1

        network_ith_tweet = [
            network_username, network_user_id, network_users_mentioned_name,
            network_retweet_username, network_retweet_id,
            network_user_replied_to_username, network_user_replied_to_id,
            network_tweet_replied_to
        ]

        network_db.loc[len(network_db)] = network_ith_tweet

    increment_counter = 0

    return network_db


def initialize_scrape(hashtag, date_since, num_tweets):

    api = authpy()

    scraped_dataframe = scrape(hashtag, date_since, num_tweets, api)

    return scraped_dataframe
