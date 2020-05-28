import os
import os.path
import time
import json
import inspect
from uuid import uuid4
import pyperclip

class Apiclip():
  def __init__(self, option={}):
    self.response_file = 'response.json.js'
    self.actions = {}
    self.loop_frequency = 0.05
    this_path_and_file = os.path.realpath(__file__)
    self.this_path = this_path_and_file.split(os.path.basename(this_path_and_file))[0]
    self.current_msg_id = ''
    if 'loop_frequency' in option:
      self.loop_frequency = option['loop_frequency']
  
  def action(self):
    def wrap(function):
      self.add_action(function.__name__, function)
      def wrapped_f(*args, **kwargs):
        function(*args, **kwargs)
      return wrapped_f
    return wrap

  def add_action(self, name, action):
    self.actions[name] = action

  def send(self, response):
    json_response = json.dumps(response, default=str, indent=1)
    with open(self.this_path + '/' + self.response_file, 'w') as file:
      file.write('data = ' + '\n' + json_response)

  def is_new_msg(self, msg):
    return msg and msg['msg_id'] != self.current_msg_id

  def has_valid_session_token(self, msg):
    return msg['session_token'] == self.session_token

  def is_valid_new_msg(self, msg):
    return msg and self.has_valid_session_token(msg) and self.is_new_msg(msg)

  def get_apiclip_msg(self, clipboard_content):
    try: 
      data = json.loads(clipboard_content)
      if type(data) is not dict or 'msg_id' not in data or 'session_token' not in data: 
        return False
      return data
    except ValueError: pass
    return False

  def run_action(self, msg):
    if not msg['params']: msg['params'] = {}
    return self.actions[msg['action']](**msg['params'])

  def set_config(self):
    file_path = self.this_path + '/config.json.js'
    if os.path.isfile(file_path):
      with open(file_path, 'r') as file:
        file_str = file.read()
      config = json.loads(file_str.split('\n', 1)[1])
      self.response_file = config['response_file']
    else:
      config = {
        'response_file': self.response_file
      }
      
    self.session_token = str(uuid4())
    config['session_token'] = self.session_token

    json_config = json.dumps(config, default=str, indent=1)
    with open(file_path, 'w') as file:
      file.write('data = ' + '\n' + json_config)

  def run(self):
    self.set_config()
    last_clipboard_content = ''
    while True:
      time.sleep(self.loop_frequency)
      clipboard_content = pyperclip.paste()

      msg = self.get_apiclip_msg(clipboard_content)

      if not self.is_valid_new_msg(msg):
        last_clipboard_content = clipboard_content
        continue

      pyperclip.copy(last_clipboard_content)

      self.current_msg_id = msg['msg_id']
      response = {
        "msg_id": msg['msg_id'],
        "session_token": msg['session_token']
      }

      if msg['session_token'] != self.session_token:
        response['error'] = 'wrong_session_token'
      elif msg['action'] == '_init_apiclip_connexion':
        response['data'] = 'connexion_done'
      elif 'action' not in msg:
        response['error'] = 'no action found'
      elif msg['action'] not in self.actions:
        response['error'] = 'action not found: ' + str(msg['action'])
      else:
        response['data'] = self.run_action(msg)

      print(response)
      self.send(response)
