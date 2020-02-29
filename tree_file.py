import os
import json

def prepend_line(path, line):
  with open(path, 'r+') as file:
    content = file.read()
    file.seek(0, 0)
    file.write(line.rstrip('\r\n') + '\n' + content)

def get_clean_path(path):
  return path[1:] if path.startswith('/') else path

path_and_file = os.path.realpath(__file__)
filename = os.path.basename(path_and_file)
path = path_and_file.split(filename)[0]

folder_to_scan = path.split('/')[-2]
root_path = '/'.join(path.split('/')[0:-2])

print 'SCAN ' + root_path + ' -> ' + folder_to_scan

directories_dict = {folder_to_scan: {
  'path': '', 
  'directory': folder_to_scan,
  'is_main_folder': True,
  'root_path': root_path,
  'nb_folder': 0,
  'nb_folder_recursive': 0,
  'nb_file': 0,
  'nb_file_recursive': 0
}}

files_dict = {}

for r, d, f in os.walk(path):

  root = r.split(root_path)[1].strip('/')

  for directory in d:
    directory_info = {
      'path': root, 
      'directory': directory,
      'nb_folder': 0,
      'nb_folder_recursive': 0,
      'nb_file': 0,
      'nb_file_recursive': 0
    }
    dir_path = root + '/' + directory
    key = get_clean_path(dir_path)
    directories_dict[key] = directory_info

    key = ''
    for directory_path in root.split('/'):
      key = get_clean_path(key + '/' + directory_path)
      directories_dict[key]['nb_folder_recursive'] += 1
    
  for file in f:
    key = ''
    for directory in root.split('/'):
      key = get_clean_path(key + '/' + directory)
      directories_dict[key]['nb_file_recursive'] += 1

    file_key = key + '/' + file

    file_info = {
      'path': root,
      'file_name': file,
      'size': 0, 
    }

    files_dict[file_key] = file_info


tree_file_info = {
  'root_path': root_path,
  'folder_to_scan': folder_to_scan
}

path_and_file = path + 'tree_file_info.js'
with open(path_and_file, 'w') as file:
  json.dump(tree_file_info, file, default=str)
prepend_line(path_and_file, 'const tree_file_info = ')


path_and_file = path + 'directories_data.js'
with open(path_and_file, 'w') as file:
  json.dump(directories_dict, file, default=str)
prepend_line(path_and_file, 'const directories_data = ')

path_and_file = path + 'files_data.js'
with open(path_and_file, 'w') as file:
  json.dump(files_dict, file, default=str)
prepend_line(path_and_file, 'const files_data = ')
