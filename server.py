from tornado import websocket, web, ioloop, httpserver
import tornado
import json

session = {}
WAITING_FOR_PLAYERS = 0
GAME_IN_PROGRESS = 1
GAME_STATE = WAITING_FOR_PLAYERS

class WSHandler(tornado.websocket.WebSocketHandler):
            def check_origin(self, origin):
                return True
                        
            def open(self):
                print(self.get_player_address() + 'connected ')
                pass
 
            def on_message(self, message):
                global GAME_STATE
                # json.loads() returns a dict
                msg = json.loads(message)
                #print(msg['type'])
                if (msg['type'] == 'join' ):
                    self.join()
                if(msg['type'] == 'updateState' and GAME_STATE == GAME_IN_PROGRESS):
                    self.send_to_other_player(msg)
                if (msg['type'] == 'gameover' and GAME_STATE == GAME_IN_PROGRESS):
                    gameover = {"type" : "message", "data" : "GMAEOVER!"}
                    print(session)
                    for key, value in session.items():
                        value.write_message(gameover)
                    #self.send_to_other_player(gameover)

                    GAME_STATE = WAITING_FOR_PLAYERS
                    session.clear()
                    print("gameover")
                pass                            

            def send_to_other_player(self, message):
                for key, value in session.items():
                    if(key != self.get_player_address()):
                        #print('Sending: ' + str(message))
                        value.write_message(message)
                        #session[i].on_message(message)
                pass

            def on_close(self):
                global GAME_STATE
                # remove the current IP in session when web closed
                session.clear()
                GAME_STATE = WAITING_FOR_PLAYERS
                pass

            def get_player_address(self):
                player_address = str(self.request.remote_ip) + ':' # store the ip
                player_address = player_address + str(self.stream.socket.getpeername()[1]) # store the port  
                return player_address #return ip and port
            
            def join(self):
                global GAME_STATE
                #print(GAME_STATE)
                if (GAME_STATE == GAME_IN_PROGRESS):
                    msg = {"type" : "message", "data" : "the game is in progress!"}
                    #print("the game is in progress!")
                    self.write_message(msg)
                elif (GAME_STATE == WAITING_FOR_PLAYERS):
                    if (len(session) < 2):
                        session[self.get_player_address()] = self
                        #print(session)
                        if(len(session) == 1):
                            # return the player positon
                            msg = {"type" : "player", "data" : "1"}
                            self.write_message(msg)
                            print("one player")
                        if (len(session) == 2):
                            GAME_STATE = GAME_IN_PROGRESS
                            msg = {"type" : "player", "data" : "2"}
                            self.write_message(msg)
                            print("game start")
                    else :
                        msg = {"type" : "message", "data" : "No available space:Two player already in the game!"}
                        #print("No available space:Two player already in the game!")
                        self.write_message(msg)

 
app= tornado.web.Application([
            #map the handler to the URI named "test"
            (r'/wstest', WSHandler),
])

if __name__ == '__main__':
            server_port=8080
            app.listen(server_port)
            ioloop.IOLoop.instance().start()