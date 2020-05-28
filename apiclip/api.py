import time
import sys
import os
import json
import shutil
from apiclip import Apiclip
sys.path.append('..')
from scan import scan

config_file = '../config.json.js'

class JsonJs():
  @staticmethod
  def get_data(file_path):
    with open(file_path, 'r') as file:
      file_str = file.read()
    return json.loads(file_str.split('\n', 1)[1])

  @staticmethod
  def save_data(file_path, data):
    json_data = json.dumps(data, default=str, indent=1)
    with open(file_path, 'w') as file:
      file.write('data = ' + '\n' + json_data)

apiclip = Apiclip()

@apiclip.action()
def scan_catalog(catalog_name):
  res = scan(catalog_name + '.json.js')
  if 'error' in res:
    return {'error': res['error']}
  else:
    config = JsonJs.get_data(config_file)
    config['catalog_names'][catalog_name]['has_been_scanned'] = True
    JsonJs.save_data(config_file, config)
    return res

@apiclip.action()
def delete_catalog(catalog_name):
  try:
    config = JsonJs.get_data(config_file)
    del config['catalog_names'][catalog_name]
    JsonJs.save_data(config_file, config)
  except:
    pass

  try:
    os.remove('../config/' + catalog_name + '.json.js')
  except:
    pass

  try:
    shutil.rmtree('../data/' + catalog_name)
  except:
    pass
    
  return 'ok'

@apiclip.action()
def add_new_catalog(data):
  file_path = '../config/' + data['catalog_name'] + '.json.js'
  JsonJs.save_data(file_path, data)

  config = JsonJs.get_data(config_file)
  config['catalog_names'][data['catalog_name']] = {
    "has_been_scanned": False
  }
  JsonJs.save_data(config_file, config)

  return 'ok'

@apiclip.action()
def update_catalog(data):
  print(data['old_catalog_name'])
  if 'old_catalog_name' in data:
    delete_catalog(data['old_catalog_name'])
  del data['old_catalog_name']
  add_new_catalog(data)
  return 'ok'

apiclip.run()
