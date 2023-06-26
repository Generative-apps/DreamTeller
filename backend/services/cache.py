import redis
import atexit
from json import dumps, loads


from apscheduler.schedulers.background import BackgroundScheduler


redis_instance = None


def get(key) -> dict | None:
    if not redis_instance:
        raise Exception("Redis not started")
    value = redis_instance.get(key)
    return loads(value) if value else None

def set(key:str, value:dict):
    if not redis_instance:
        raise Exception("Redis not started")
     
    return redis_instance.set(key, dumps(value))

def delete(key):
    if not redis_instance:
       raise Exception("Redis not started")
    
    return redis_instance.delete(key)    

# Declaration of the task as a function.
def delete_old_records():
    if not redis_instance:
       raise Exception("Redis not started")
    
    for key in redis_instance.scan_iter():
        idle = redis_instance.object("idletime", key)
        if idle >=  3600:
            obj = redis_instance.get(key)
            obj['num_interpretations'] = 0
            set(key, obj)

def start(hour_delete_interval:int, config:dict):

    global redis_instance
    redis_instance = redis.Redis(host=config.get('host', 'redis'), port=config.get("port", 6379), decode_responses=True)
    # Create the background scheduler
    scheduler = BackgroundScheduler()
    # Create the job
    scheduler.add_job(func=delete_old_records, trigger="interval", hours=hour_delete_interval)
    # Start the scheduler
    scheduler.start()

    # /!\ IMPORTANT /!\ : Shut down the scheduler when exiting the app
    atexit.register(lambda: scheduler.shutdown())

pass