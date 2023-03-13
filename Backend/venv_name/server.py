from flask import Flask, jsonify, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import pandas as pd
import convert_data
import scrape_data

app = Flask(__name__)
api = Api(app)

CORS(app)

status = "Not Inialized"


class Users(Resource):

    global status

    #Get function that should return the csv of scraped tweets and accounts
    def get(self):

        data = convert_data.convertData()

        return {"data": data}, 200  # return data and 200 OK code

    def post(self):

        received_hashtag = request.get_json()

        global status

        status = "Scraping Data\n"

        #returns csv#
        scraped_data = scrape_data.initialize_scrape(
            received_hashtag['value'], received_hashtag['date'],
            received_hashtag['amount'])

        status = "Transforming Data"

        final_data = convert_data.convertData(scraped_data)

        status = "Transforming Complete"

        return {'data': final_data}, 200


class Update(Resource):

    def get(self):
        update = {
            "status": status,
            "current_tweet": scrape_data.increment_counter
        }
        return {'data': update}, 200


#registers the routes with the framework using the given endpoint.
api.add_resource(Users, '/users')
api.add_resource(Update, '/update')

if __name__ == '__main__':
    app.run(threaded=True)  # run our Flask app