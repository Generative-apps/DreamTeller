from flask import Flask, json, Response, request
app = Flask(__name__)
from engine.models import GPT35
from services import cache
from dream_interpreter import start_interpretation, finish_interpretation, MaxInterpretationsError
from uuid import uuid1
max_reached_msg = "You have reached the maximum number of interpretations for this dream. Please wait 24 hours to try again."


# from time import sleep

def generate_user_id():
    id = str(uuid1()).replace('-', '')
    print('new user id: ', id)
    return id

@app.route("/tell", methods=['POST'])
def dreamtell():
    dream, user_id = request.json['dream'], request.json.get('user_id', generate_user_id())
    print("got", request.json)
    try:
        # formatted_questions = start_interpretation(dream, user_id)
        # sleep(5)
        formatted_questions = ["what is this", "where is this"]
    except MaxInterpretationsError:
        return Response(json.dumps({"error": max_reached_msg}), status=403, mimetype='application/json')
    
    return Response(json.dumps({"questions": formatted_questions, "user_id": user_id}), status=200, mimetype='application/json')


@app.route("/answer", methods=['POST'])
def dreamanswer():
    answers, user_id = request.json['answers'], request.json['user_id']
    try:
        dream_interpretation = finish_interpretation(user_id, answers)
        # sleep(5)        
        # dream_interpretation = "this is a dream interpretation"
    except KeyError:
        return Response(json.dumps({"error": "User not found"}), status=404, mimetype='application/json')  
    return Response(json.dumps({"interpretation": dream_interpretation}), status=200, mimetype='application/json')


if __name__ == "__main__":
    print("Starting cache...")
    cache.start(hour_delete_interval=1)
    print("starting server...")
    app.run(debug=True, host='0.0.0.0', port=5000)


