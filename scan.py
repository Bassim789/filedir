from __future__ import print_function
import os
import sys
import json
from time import time

def get_clean_path(path):
  return path[1:] if path.startswith('/') else path

def new_directory(path, directory):
  return {
    'path': path, 
    'directory': directory,
    'nb_folder': 0,
    'nb_file': 0,
    'size': 0,
    'file_types': {}
  }

start_time = time()
this_path_and_file = os.path.realpath(__file__)
this_path = this_path_and_file.split(os.path.basename(this_path_and_file))[0]

alias = ''
exclude_folders = ''
use_alias_on_file = 'false'
data_name = 'default'
with open(this_path + 'config/' + sys.argv[1]) as file:
  for line in file.readlines():
    if line.startswith('path:'):
      path_to_scan = line.split('path:')[1].strip()
      if path_to_scan == '':
        path_to_scan = this_path
      if path_to_scan.endswith('/'): 
        path_to_scan = path_to_scan[:-1]
    elif line.startswith('alias:'):
      alias = line.split('alias:')[1].strip()
    elif line.startswith('exclude_folders:'):
      exclude_folders = line.split('exclude_folders:')[1].strip()
    elif line.startswith('use_alias_on_file:'):
      use_alias_on_file = line.split('use_alias_on_file:')[1].strip()
    elif line.startswith('data:'):
      data_name = line.split('data:')[1].strip()
      
folder_to_scan = path_to_scan.split('/')[-1]
root_path = '/'.join(path_to_scan.split('/')[0:-1]) + '/'

if folder_to_scan == '':
  print('Cannot scan the root directory, you have to choose a directory.')
  exit()

if not os.path.exists(path_to_scan):
  print('Cannot find path: ' + path_to_scan)
  exit()

print('scan ' + path_to_scan)

directories_dict = {'__root__': new_directory('', folder_to_scan)}
files_data = []

for iter_path, dirs, files in os.walk(path_to_scan):

  root = iter_path[len(root_path + folder_to_scan):].strip('/')

  if exclude_folders != '' and exclude_folders in root.split('/'): 
    continue

  for directory in dirs:
    directories_dict['__root__']['nb_folder'] += 1
    key = get_clean_path(root + '/' + directory)
    directories_dict[key] = new_directory(root, directory)
    key = ''
    for directory_path in root.split('/'):
      key = get_clean_path(key + '/' + directory_path)
      if key != '':
        directories_dict[key]['nb_folder'] += 1
    
  for filename in files:
    try:
      size = os.path.getsize(root_path + folder_to_scan + '/' + root + '/' + filename)
      last_modif = os.path.getmtime(root_path + folder_to_scan + '/' + root + '/' + filename)
    except:
      size = 0
      last_modif = 0
    
    files_data.append({
      'path': root,
      'file_name': filename,
      'size': size,
      'last_modif': round(last_modif)
    })

    file_type = '__nothing__'
    if len(filename.split('.')) > 1 and filename.split('.')[0] != '':
      file_type = filename.split('.').pop()

    directories_dict['__root__']['nb_file'] += 1
    directories_dict['__root__']['size'] += size
    if not file_type in directories_dict['__root__']['file_types']:
      directories_dict['__root__']['file_types'][file_type] = {'nb_file': 0, 'size': 0}
    directories_dict['__root__']['file_types'][file_type]['nb_file'] += 1
    directories_dict['__root__']['file_types'][file_type]['size'] += size

    key = ''
    for directory in root.split('/'):
      if directory == '': continue
      key = get_clean_path(key + '/' + directory)
      if key != '':
        directories_dict[key]['nb_file'] += 1
        directories_dict[key]['size'] += size
        if not file_type in directories_dict[key]['file_types']:
          directories_dict[key]['file_types'][file_type] = {'nb_file': 0, 'size': 0}
        directories_dict[key]['file_types'][file_type]['nb_file'] += 1
        directories_dict[key]['file_types'][file_type]['size'] += size

    if filename == '_info.txt':
      with open (root_path + folder_to_scan + '/' + root + '/' + filename, 'r') as file:
        if root == '':
          directories_dict['__root__']['description'] = file.read()
        else:
          directories_dict[root]['description'] = file.read()

file_type_icons = []
for file in os.listdir(this_path + 'web/media/img/file_icon'):
  if file.endswith(".png"):
    file_type_icons.append(file.split('.png')[0])

duration = round(time() - start_time, 1)

if not os.path.exists(this_path + 'data/' + data_name):
    os.makedirs(this_path + 'data/' + data_name)

data = {
  'main_data': {
    'alias': alias,
    'use_alias_on_file': use_alias_on_file,
    'root_path': root_path if use_alias_on_file == 'false' else '',
    'folder_to_scan': folder_to_scan,
    'file_type_icons': file_type_icons,
    'scan_timestamp': round(time()),
    'scan_duration': duration
  },
  'directories_data': directories_dict,
  'files_data': files_data
}

indent = 1
if (sys.version_info > (3, 0)):
  json_data = json.dumps(data, default=str, indent=indent)
else:
  output_encoding = 'latin1' if 'latin1' in sys.argv else 'utf8'
  json_data = json.dumps(data, default=str, indent=indent, encoding=output_encoding)
with open(this_path + 'data/' + data_name + '/data.json.js', 'w') as file:
  file.write('data = ' + '\n' + json_data)

basic_data = {
  'scan_timestamp': round(time()),
  'alias': alias,
  'nb_file': directories_dict['__root__']['nb_file'],
  'nb_folder': directories_dict['__root__']['nb_folder'],
  'size': directories_dict['__root__']['size']
}
json_basic_data = json.dumps(basic_data, default=str, indent=indent)
with open(this_path + 'data/' + data_name + '/basic_data.json.js', 'w') as file:
  file.write('basic_data = ' + '\n' + json_basic_data)

print('done in ' + str(duration) + ' seconds')
