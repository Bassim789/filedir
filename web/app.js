const url_params = new Url_params()
const dark_mode = new Dark_mode()
const filedir = new Filedir()
const last_modified_files = new Last_modified_files()
const footer = new Footer()
const metacat = new Metacat()

let catalog_name = undefined
catalog_name = url_params.get_param('catalog')

if(catalog_name){
  loader.load('', ['data/' + catalog_name + '/data.json.js'], () => {
    console.log('data', data)
    filedir.add_data(data.main_data)
    filedir.add_directories(data.directories_data)
    filedir.add_files(data.files_data)
    filedir.init()

    dark_mode.append_to_body()
    dark_mode.init_actions()

    footer.add_data(data.main_data)
    footer.render()

    $('.loading').hide()
  })
} else {
  const catalogs = []
  let catalog_loaded = 0
  for(const catalog of catalog_names){
    loader.load('', ['data/' + catalog + '/basic_data.json.js'], () => {
      catalogs.push({...basic_data, catalog})
      catalog_loaded += 1
      if(catalog_names.length === catalog_loaded){
        metacat.init()
        metacat.add_data(catalogs)
        metacat.render()
        dark_mode.append_to_body()
        dark_mode.init_actions()
        $('.loading').hide()
      }
    })
  }
}