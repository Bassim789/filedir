const url_params = new Url_params()
const dark_mode = new Dark_mode()
const filedir = new Filedir()
const last_modified_files = new Last_modified_files()
const footer = new Footer()
const metacat = new Metacat()

;(async () => {

  const config = await loader.load_js_data('config.json.js')

  let catalog_name = undefined
  catalog_name = url_params.get_param('catalog')

  const load_catalog = async () => {
    const filedir_data = await loader.load_js_data('data/' + catalog_name + '/data.json.js')
    console.log('filedir_data', filedir_data)

    filedir.add_data(data.main_data)
    filedir.add_directories(data.directories_data)
    filedir.add_files(data.files_data)
    filedir.init()

    dark_mode.append_to_body()
    dark_mode.init_actions()

    footer.add_data(data.main_data)
    footer.render()

    $('.loading').hide()
  }

  const load_dashboard = async () => {
    const catalogs = []
    let catalog_loaded = 0
    for(const catalog of config.catalog_names){
      loader.load_js_data('data/' + catalog + '/basic_data.json.js').then(basic_data => {
        catalogs.push({...basic_data, catalog})
        catalog_loaded += 1
        if(config.catalog_names.length !== catalog_loaded) return false
        metacat.init()
        metacat.add_data(catalogs)
        metacat.render()
        dark_mode.append_to_body()
        dark_mode.init_actions()
        $('.loading').hide()
      })
    }
  }

  if(catalog_name){
    load_catalog()
  } else {
    load_dashboard()
  }
})();
