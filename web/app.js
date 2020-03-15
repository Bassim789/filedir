
console.log('data', data)

const url_params = new Url_params()
const dark_mode = new Dark_mode()
const filedir = new Filedir()
const footer = new Footer()

filedir.add_data(data.main_data)
filedir.add_directories(data.directories_data)
filedir.add_files(data.files_data)
filedir.init()

dark_mode.append_to_body()
dark_mode.init_actions()

footer.add_data(data.main_data)
footer.render()

$('.loading').hide()
