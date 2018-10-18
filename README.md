# Yellow ball tracking example using Opencv.js

## Quickstart

### Video streaming

To emulate the streaming of the video from a robot, we developed a simple python script that grab frames from the camera (using the python opencv bindings) and publish it to a WebSocket.

Requirements: cv2, tornado

### Ball tracking in the browser

Open index.html in your favorite webbrowser. 

It works better if your static file are served via a webserver. For instance in Python:

* python 2: ```python -m SimpleHttpServer```
* python 3: ```python -m http.server```

