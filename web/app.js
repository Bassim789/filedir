const url_params = new Url_params()
const dark_mode = new Dark_mode()
const filedir = new Filedir()
const last_modified_files = new Last_modified_files()
const footer = new Footer()
const metacat = new Metacat()
const edition_mode = new Edition_mode()

apiclip.on('start_loading', () => {
  $('.loading').show()
})
apiclip.on('stop_loading', () => {
  $('.loading').hide()
})

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
    const catalogs = {}
    let nb_catalog_loaded = 0
    let nb_catalog_to_load = 0
    for(const [catalog_name, catalog] of Object.entries(config.catalog_names)){

      catalogs[catalog_name] = {
        catalog_name,
        has_been_scanned: catalog.has_been_scanned
      }

      loader.load_js_data('config/' + catalog_name + '.json.js').then(config => {
        catalogs[catalog_name].config = config
      })
      if(!catalog.has_been_scanned) continue

      nb_catalog_to_load += 1
      loader.load_js_data('data/' + catalog_name + '/basic_data.json.js').then(basic_data => {
        catalogs[catalog_name].basic_data = basic_data
        nb_catalog_loaded += 1
        if(nb_catalog_to_load !== nb_catalog_loaded) return false
        metacat.init()
        metacat.add_data(catalogs)
        metacat.render()
        dark_mode.append_to_body()
        dark_mode.init_actions()
        edition_mode.append_to_body()
        edition_mode.init_actions()

        template.render('#form_modal', 'form_modal')

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
