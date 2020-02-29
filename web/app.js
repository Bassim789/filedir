
//console.log(tree_file_data)

const url_params = new Url_params()
const dark_mode = new Dark_mode()
const tree_file = new Tree_file()

tree_file.add_info(tree_file_info)
tree_file.add_directories(directories_data)
tree_file.add_files(files_data)

dark_mode.append_to_body()
dark_mode.init_actions()

tree_file.append_to_body()

console.log(files_data)
