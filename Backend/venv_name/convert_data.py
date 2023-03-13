import pandas as pd
import json



def convertData(data):
    df = data

    #Filling all NA with empty strings
    df = df.fillna('')

    #Empty data frame
    return_data = {}

    #All users/nodes
    return_data['nodes'] = []
    return_data['links'] = []

    #for node in nodes
    for index, row in df.iterrows():

        #Node Structure, provided by the frontend visualization tool
        NewNode = {
            "id": row['screen_name'],
            "name": row['screen_name'],
            "val": 1
        }

        #add node to list 
        return_data['nodes'].append(NewNode)

        #Does it have a retweet?
        if (row['user_retweet_screen_name']):

            #Creating Node that did the retweet
            TargetNode = {
                "id": row['user_retweet_screen_name'],
                "name": row['user_retweet_screen_name'],
                "val": 1,
            }

            #If its a new node, add to list
            if (TargetNode not in return_data['nodes']):
                return_data['nodes'].append(TargetNode)

            #Add the connection for those two nodes
            return_data['links'].append({
                'source': NewNode['name'],
                'target': TargetNode['name'],
                'color': "#c42626"
            })

        #Does it have a mention
        if (row['user_mention_screen_name']):

            TargetNode = {
                "id": row['user_mention_screen_name'],
                "name": row['user_mention_screen_name'],
                "val": 1,
            }

            if (TargetNode not in return_data['nodes']):
                return_data['nodes'].append(TargetNode)

            return_data['links'].append({
                'source': NewNode['name'],
                'target': TargetNode['name'],
                'color': "#23FF00"
            })

        #Does it have a reply
        if ((row['user_reply_to_id'])):

            TargetNode = {
                "id": row['user_reply_to_id'],
                "name": row['user_reply_to_id'],
                "val": 1,
            }

            if (TargetNode not in return_data['nodes']):
                return_data['nodes'].append(TargetNode)

            return_data['links'].append({
                'source': NewNode['name'],
                'target': TargetNode['name'],
                'color': "#0027FF"
            })

    #with open("node_links.json", "w") as outfile:
    #    json.dump(return_data, outfile)

    return return_data
