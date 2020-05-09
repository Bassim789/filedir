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

# with open(this_path + 'path_to_scan.txt') as file:
#   path_to_scan = file.readline()
# if path_to_scan.strip() == '':
#   path_to_scan = this_path
# if path_to_scan.endswith('/'): 
#   path_to_scan = path_to_scan[:-1]

alias = ''
exclude_folders = ''
use_alias_on_file = 'false'

with open(this_path + 'config.txt') as file:
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

  #root = iter_path[len(root_path):].strip('/')
  root = iter_path[len(root_path + folder_to_scan):].strip('/')

  if exclude_folders != '' and exclude_folders in root.split('/'): 
    continue

  for directory in dirs:
    key = get_clean_path(root + '/' + directory)
    directories_dict[key] = new_directory(root, directory)
    key = ''
    for directory_path in root.split('/'):
      key = get_clean_path(key + '/' + directory_path)
      directories_dict['__root__']['nb_folder'] += 1
      if key != '':
        directories_dict[key]['nb_folder'] += 1
    
  for filename in files:
    print(root_path + folder_to_scan + '/' + root + '/' + filename)
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

    key = ''
    for directory in root.split('/'):
      if directory == '': continue
      key = get_clean_path(key + '/' + directory)

      directories_dict['__root__']['nb_file'] += 1
      directories_dict['__root__']['size'] += size
      if not file_type in directories_dict['__root__']['file_types']:
        directories_dict['__root__']['file_types'][file_type] = {'nb_file': 0, 'size': 0}
      directories_dict['__root__']['file_types'][file_type]['nb_file'] += 1
      directories_dict['__root__']['file_types'][file_type]['size'] += size

      if key != '':
        directories_dict[key]['nb_file'] += 1
        directories_dict[key]['size'] += size
        if not file_type in directories_dict[key]['file_types']:
          directories_dict[key]['file_types'][file_type] = {'nb_file': 0, 'size': 0}
        directories_dict[key]['file_types'][file_type]['nb_file'] += 1
        directories_dict[key]['file_types'][file_type]['size'] += size

    if filename == '_info.txt':
      with open (root_path + root + '/' + filename, 'r') as file:
        directories_dict[root]['description'] = file.read()

file_type_icons = []
for file in os.listdir(this_path + 'web/media/img/file_icon'):
  if file.endswith(".png"):
    file_type_icons.append(file.split('.png')[0])

duration = round(time() - start_time, 1)

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

with open(this_path + 'data.json.js', 'w') as file:
  if (sys.version_info > (3, 0)):
    json.dump(data, file, default=str, indent=1)
  else:
    output_encoding = 'latin1' if 'latin1' in sys.argv else 'utf8'
    json.dump(data, file, default=str, indent=1, encoding=output_encoding)
with open(this_path + 'data.json.js', 'r+') as file:
  content = file.read()
  file.seek(0, 0)
  file.write('const data = ' + '\n' + content)

print('done in ' + str(duration) + ' seconds')
