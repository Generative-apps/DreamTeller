from flask import Flask, json, Response, request
from backend.engine.models import GPT35
from backend.services import cache
from backend.dream_interpreter import DreamInterpreter, MaxInterpretationsError
from uuid import uuid1
max_reached_msg = "You have reached the maximum number of interpretations for this dream. Please wait 24 hours to try again."
from os.path import dirname
from time import sleep

try:
    config = json.load(open('../config.json', 'r'))
except FileNotFoundError:
    print("no config file found, using default config")
    config = {
        "max_interpretations": 3,
        "environment": "dev"
    }


static_folder = dirname(dirname(__file__)) + '/frontend/build' 
print("static folder: ", static_folder)
# if config['environment'] == "prod":
STANDALONE_MODE = config['environment'] == "dev"
print('STANDALONE_MODE: ', STANDALONE_MODE)
app = Flask(__name__, static_folder=static_folder, static_url_path='/dream')
# else:
    # app = Flask(__name__)

interpreter = DreamInterpreter(config)

# from time import sleep


@app.route("/dream/app", methods=['GET'])
def index(any=None):
    return app.send_static_file('index.html')

@app.route("/dream", methods=['GET'])
def index2(any=None):
    count = cache.get('count') or 0
    cache.set('count', count+1)
    print("connection count: ", count)
    return app.send_static_file('index.html')


def generate_user_id():
    id = str(uuid1()).replace('-', '')
    print('new user id: ', id)
    return id

@app.route("/dream/api/tell", methods=['POST'])
def dreamtell():
    dream, user_id = request.json['dream'], request.json.get('user_id', generate_user_id())



    print("got", request.json)
    try:
        if STANDALONE_MODE:
            sleep(5)
            formatted_questions = ["what is this", "where is this"]   
        else:
            formatted_questions = interpreter.start_interpretation(dream, user_id)
        
    except MaxInterpretationsError:
        return Response(json.dumps({"error": max_reached_msg}), status=403, mimetype='application/json')
    
    return Response(json.dumps({"questions": formatted_questions, "user_id": user_id}), status=200, mimetype='application/json')


@app.route("/dream/api/answer", methods=['POST'])
def dreamanswer():
    answers, user_id = request.json['answers'], request.json['user_id']
    try:        
        if STANDALONE_MODE:
            sleep(5)        
            dream_interpretation = "this is a dream interpretation"
        else:
            dream_interpretation = interpreter.finish_interpretation(user_id, answers)
    except KeyError:
        return Response(json.dumps({"error": "User not found"}), status=404, mimetype='application/json')  
    return Response(json.dumps({"interpretation": dream_interpretation}), status=200, mimetype='application/json')


if __name__ == "__main__":
    print("Starting cache...")
    cache.start(hour_delete_interval=1, config=config)
    print("starting server...")
    app.run(debug=True, host='0.0.0.0', port=5000)


