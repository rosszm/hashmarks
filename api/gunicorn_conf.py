from multiprocessing import cpu_count

# socket
bind = "127.0.0.1:8000"

# Worker options
workers = cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"

loglevel = "debug"
