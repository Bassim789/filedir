from __future__ import print_function
import os
import sys
import json
from datetime import datetime
start_time = datetime.now()

def prepend_line(path, line):
  with open(path, 'r+') as file:
    content = file.read()
    file.seek(0, 0)
    file.write(line.rstrip('\r\n') + '\n' + content)

def get_clean_path(path):
  return path[1:] if path.startswith('/') else path

def get_size_clean(size_in_bytes):
  if size_in_bytes > (1024*1024*1024):
    return str(round(size_in_bytes / (1024*1024*1024 + 0.0), 1)) + ' GB'
  elif size_in_bytes > (1024*1024):
    return str(round(size_in_bytes / (1024 * 1024 + 0.0), 1)) + ' MB'
  elif size_in_bytes > 1024:
    return str(round(size_in_bytes / (1024 + 0.0), 1)) + ' KB'
  else:
    return str(size_in_bytes) + ' B'

if len(sys.argv) < 2:
  print("Error: no path given")
  exit()

path = sys.argv[1]
if not path.endswith('/'): path += '/'

this_path_and_file  = os.path.realpath(__file__)
this_filename = os.path.basename(this_path_and_file)
this_path = this_path_and_file.split(this_filename)[0]

folder_to_scan = path.split('/')[-2]
root_path = '/'.join(path.split('/')[0:-2])

print('SCAN ' + root_path + '/' + folder_to_scan)

directories_dict = {folder_to_scan: {
  'path': '', 
  'directory': folder_to_scan,
  'is_main_folder': True,
  'root_path': root_path,
  'nb_folder_recursive': 0,
  'nb_file_recursive': 0,
  'size_recursive': 0,
  'file_types': {}
}}

files_dict = {}

for r, dirs, files in os.walk(path):

  # d.endswith('node_modules') or
  dirs[:] = [d for d in dirs if not d.endswith('.git')]

  root = r.split(root_path)[1].strip('/')

  for directory in dirs:
    directory_info = {
      'path': root, 
      'directory': directory,
      'nb_folder_recursive': 0,
      'nb_file_recursive': 0,
      'size_recursive': 0,
      'file_types': {}
    }
    dir_path = root + '/' + directory
    key = get_clean_path(dir_path)
    directories_dict[key] = directory_info

    key = ''
    for directory_path in root.split('/'):
      key = get_clean_path(key + '/' + directory_path)
      directories_dict[key]['nb_folder_recursive'] += 1
    
  for file in files:

    if file == '.DS_Store':
      continue
  
    size = False
    try:
      size = os.path.getsize(root_path + '/' + root + '/' + file)
    except Exception as e:
      pass
    
    file_info = {
      'path': root,
      'file_name': file,
      'size': size,
      'size_clean': get_size_clean(size)
    }

    file_type = '__nothing__'
    if len(file.split('.')) > 1 and file.split('.')[0] != '':
      file_type = file.split('.').pop()

    key = ''
    for directory in root.split('/'):
      key = get_clean_path(key + '/' + directory)
      directories_dict[key]['nb_file_recursive'] += 1
      directories_dict[key]['size_recursive'] += size

      if not file_type in directories_dict[key]['file_types']:
        directories_dict[key]['file_types'][file_type] = {
          'nb_file_recursive': 0,
          'size_recursive': 0
        }

      directories_dict[key]['file_types'][file_type]['nb_file_recursive'] += 1
      directories_dict[key]['file_types'][file_type]['size_recursive'] += size

    file_key = key + '/' + file

    files_dict[file_key] = file_info


for key in directories_dict:
  directories_dict[key]['size_recursive_clean'] = get_size_clean(directories_dict[key]['size_recursive'])
  for key2 in directories_dict[key]['file_types']:
    directories_dict[key]['file_types'][key2]['size_recursive_clean'] = \
      get_size_clean(directories_dict[key]['file_types'][key2]['size_recursive'])



file_type_icons = []
for file in os.listdir(this_path + 'web/media/img/file_icon'):
  if file.endswith(".png"):
    file_type_icons.append(file.split('.png')[0])

main_data = {
  'root_path': root_path,
  'folder_to_scan': folder_to_scan,
  'file_type_icons': file_type_icons
}

if not os.path.exists(this_path + 'data'):
  os.makedirs(this_path + 'data')

path_and_file = this_path + 'data/main_data.js'
with open(path_and_file, 'w') as file:
  json.dump(main_data, file, default=str)
prepend_line(path_and_file, 'const main_data = ')

path_and_file = this_path + 'data/directories_data.js'
with open(path_and_file, 'w') as file:
  json.dump(directories_dict, file, default=str)
prepend_line(path_and_file, 'const directories_data = ')

path_and_file = this_path + 'data/files_data.js'
with open(path_and_file, 'w') as file:
  json.dump(files_dict, file, default=str)
prepend_line(path_and_file, 'const files_data = ')

duration = datetime.now() - start_time
print('done in ' + str(duration))


