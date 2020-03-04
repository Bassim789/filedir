
$('.loading').hide()

const url_params = new Url_params()
const dark_mode = new Dark_mode()
const filedir = new Filedir()

filedir.add_info(main_data)
filedir.add_directories(directories_data)
filedir.add_files(files_data)

dark_mode.append_to_body()
dark_mode.init_actions()

filedir.append_to_body()
