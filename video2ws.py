from threading import Thread

from tornado.ioloop import IOLoop
from tornado.web import Application
from tornado.websocket import WebSocketHandler

import cv2

RES = (176, 144)
FPS = 50


class VideoToWs(WebSocketHandler):
    def open(self):
        print('Connection opened.')
        Thread(target=self.pub_video).start()

    def pub_video(self):
        while True:
            self.pub_frame()
            cv2.waitKey(1000 / FPS)

    def pub_frame(self):
        success, img = self.video_cap.read()
        if success:
            img = cv2.resize(img, RES)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            message = img.tobytes()
            self.ioloop.add_callback(lambda: self.write_message(message, binary=True))

    def check_origin(self, origin):
        return True


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('--ws-port', type=int, default=9393)
    args = parser.parse_args()

    loop = IOLoop()

    VideoToWs.ioloop = loop

    cap = cv2.VideoCapture(0)
    VideoToWs.video_cap = cap

    app = Application([
        (r'/', VideoToWs)
    ])

    app.listen(args.ws_port)
    loop.start()


if __name__ == '__main__':
    main()
