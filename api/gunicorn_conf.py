from multiprocessing import cpu_count

# socket
bind = "unix:/opt/hashmarks/api/gunicorn.sock"

# Worker options
workers = cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"

loglevel = "debug"
