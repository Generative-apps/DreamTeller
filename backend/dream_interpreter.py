from engine.models import GPT35
from services import cache
from dataclasses import dataclass
MaxInterpretations = 3

class MaxInterpretationsError(Exception):
    pass


@dataclass
class UserData:
    memory: str
    num_interpretations : int


def get_user_data(user_id : str) -> UserData:
    user_value = cache.get(user_id)
    if (user_value is not None):
       return UserData(memory=user_value['memory'], num_interpretations=user_value['num_interpretations'])
    else:
        return None 


def set_user_data(user_id : str, user_data : UserData):
    cache.set(user_id, user_data.__dict__)

def start_interpretation(dream_text : str, user_id : str):
    user_data = get_user_data(user_id)
    if user_data is None:
        user_data = UserData(memory="", num_interpretations=1)
    elif user_data.num_interpretations > MaxInterpretations:
        raise MaxInterpretationsError("max interpretations reached")

    gpt = GPT35()
    questions = gpt.send_dream_description(dream_text)
    print("received questions: ", questions)
    user_data.memory = gpt.get_raw_memory()
    set_user_data(user_id, user_data)
    formatted_questions = [q.split('.')[1].strip() for q in questions.split('\n')[1:]]
    return formatted_questions


def finish_interpretation(user_id : str, answers : list[str]):
    user_value = get_user_data(user_id)
    if user_value is None:
        raise KeyError("User not found in cache.")
    user_value.num_interpretations += 1
    dream_interpretation = GPT35(memory=user_value.memory).answer_questions(answers)
    set_user_data(user_id, user_value)

    return dream_interpretation


    
    

    