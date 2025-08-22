import os
from rq import Queue, Connection, Worker
from redis import Redis

redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
conn = Redis.from_url(redis_url)
q = Queue("routing", connection=conn)

if __name__ == "__main__":
    with Connection(conn):
        worker = Worker(["routing"])
        worker.work()
