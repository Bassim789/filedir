from __future__ import print_function
import os
import sys
import json
from time import time

class Data_exporter():
  def __init__(self, path, output_encoding):
    self.path = path
    self.output_encoding = output_encoding

  def prepend_line(self, path, line):
    with open(path, 'r+') as file:
      content = file.read()
      file.seek(0, 0)
      file.write(line.rstrip('\r\n') + '\n' + content)

  def export(self, file_name, data, var_name):
    with open(self.path + file_name, 'w') as file:
      if (sys.version_info > (3, 0)):
        json.dump(data, file, default=str, indent=1)
      else:
        json.dump(data, file, default=str, indent=1, encoding=self.output_encoding)
    self.prepend_line(self.path + file_name, 'const ' + var_name + ' = ')


def get_clean_path(path):
  return path[1:] if path.startswith('/') else path

def get_this_path():
  this_path_and_file = os.path.realpath(__file__)
  this_filename = os.path.basename(this_path_and_file)
  return this_path_and_file.split(this_filename)[0]

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
this_path = get_this_path()

if len(sys.argv) >= 2:
  path = sys.argv[1]
  if path == '~':
    path = os.path.expanduser(path)
  if not path.endswith('/'): path += '/'
else:
  path = this_path

output_encoding = 'utf8'
if len(sys.argv) == 3:
  output_encoding = sys.argv[2]

folder_to_scan = path.split('/')[-2]
root_path = '/'.join(path.split('/')[0:-2]) + '/'

if folder_to_scan == '':
  print('Cannot scan the root directory, you have to choose a directory.')
  exit()

if not os.path.exists(root_path + folder_to_scan):
  print('Cannot find path: ' + root_path + folder_to_scan)
  exit()

print('SCAN ' + root_path + folder_to_scan)

files_dict = {}
directories_dict = {folder_to_scan: new_directory('', folder_to_scan)}

for iter_path, dirs, files in os.walk(path):

  root = iter_path[len(root_path):].strip('/')

  for directory in dirs:
    dir_path = root + '/' + directory
    key = get_clean_path(dir_path)
    directories_dict[key] = new_directory(root, directory)

    key = ''
    for directory_path in root.split('/'):
      key = get_clean_path(key + '/' + directory_path)
      if key == '': continue
      directories_dict[key]['nb_folder'] += 1
    
  for file in files:
    size = False
    last_modif = False
    complete_path = root_path + root + '/' + file

    try:
      size = os.path.getsize(complete_path)
      last_modif = round(os.path.getmtime(complete_path))
    except Exception as e:
      pass
    
    file_info = {
      'path': root,
      'file_name': file,
      'size': size,
      'last_modif': last_modif
    }

    file_type = '__nothing__'
    if len(file.split('.')) > 1 and file.split('.')[0] != '':
      file_type = file.split('.').pop()

    key = ''
    for directory in root.split('/'):
      key = get_clean_path(key + '/' + directory)
      if key == '': continue
      directories_dict[key]['nb_file'] += 1
      directories_dict[key]['size'] += size

      if not file_type in directories_dict[key]['file_types']:
        directories_dict[key]['file_types'][file_type] = {
          'nb_file': 0,
          'size': 0
        }

      directories_dict[key]['file_types'][file_type]['nb_file'] += 1
      directories_dict[key]['file_types'][file_type]['size'] += size

    file_key = key + '/' + file

    files_dict[file_key] = file_info

    if file == '_info.txt':
      with open (root_path + file_key, 'r') as f:
        description = f.read()
        directories_dict[key]['description'] = description


# Save data

file_type_icons = []
for file in os.listdir(this_path + 'web/media/img/file_icon'):
  if file.endswith(".png"):
    file_type_icons.append(file.split('.png')[0])

duration = round(time() - start_time, 1)

main_data = {
  'root_path': root_path,
  'folder_to_scan': folder_to_scan,
  'file_type_icons': file_type_icons,
  'scan_timestamp': round(time()),
  'scan_duration': duration
}

data = {
  'main_data': main_data,
  'directories_data': directories_dict,
  'files_data': [file for file in files_dict.values()]
}

data_exporter = Data_exporter(this_path, output_encoding)
data_exporter.export('data.json.js', data, 'data')

print('done in ' + str(duration) + ' seconds')
