"""
This module contains classes and functions that can be used to help test the project.
"""

import contextlib
import threading
import time
import uvicorn


class ThreadedServer(uvicorn.Server):
    """
    Extention of `uvicorn.Server` that allows the server to be run on a separate thread.
    """
    def install_signal_handlers(self):
        pass

    @contextlib.contextmanager
    def run_in_thread(self):
        """
        Runs this server in a seaparate thread.
        """
        thread = threading.Thread(target=self.run)
        thread.start()
        self.config.app
        try:
            while not self.started:
                time.sleep(3e-3)
            yield
        finally:
            self.should_exit = True
            thread.join()