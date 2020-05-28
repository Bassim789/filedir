class Metacat{
  constructor(){}
  init(){
    this.actions()
  }
  add_data(catalogs){
    this.catalogs = catalogs
    console.log(this.catalogs)
  }
  render(){
    let nb_folder = 0
    let nb_file = 0
    let size = 0
    for(const [i, catalog] of Object.entries(this.catalogs)){
      if(catalog.basic_data === undefined) continue
      if(catalog.basic_data.nb_folder) nb_folder += catalog.basic_data.nb_folder
      if(catalog.basic_data.nb_file) nb_file += catalog.basic_data.nb_file
      if(catalog.basic_data.size) size += catalog.basic_data.size
    }
    for(const [i, catalog] of Object.entries(this.catalogs)){
      if(catalog.basic_data === undefined) continue
      catalog.rows_info = [
        {
          nb_clean: parseInt(catalog.basic_data.nb_folder).toLocaleString(),
          percent: Math.round(catalog.basic_data.nb_folder / nb_folder * 100),
          img_folder: true
        }, {
          nb_clean: parseInt(catalog.basic_data.nb_file).toLocaleString(),
          percent: Math.round(catalog.basic_data.nb_file / nb_file * 100),
          img_file: true
        }, {
          nb_clean: filedir.get_size_clean(catalog.basic_data.size),
          percent: Math.round(catalog.basic_data.size / size * 100)
        },
      ]
    }

    template.render('#metacat', 'metacat', {
      catalogs: Object.values(this.catalogs),
      nb_catalog: this.catalogs.length,
      nb_folder_clean: parseInt(nb_folder).toLocaleString(), 
      nb_file_clean: parseInt(nb_file).toLocaleString(), 
      size_clean: filedir.get_size_clean(size)
    })

    $('#select_path_wrap').html('')
    const template_select_path = `
      <select>
        <option selected="selected" value=""></option>
        {{#catalogs}}
          <option value="{{catalog_name}}">
          {{catalog_name}}
          </option>
        {{/catalogs}}
      </select>
    `;

    $('#select_path_wrap').html(Mustache.to_html(template_select_path, {
      catalogs: Object.values(this.catalogs)
    }))

    const selectize = $('#select_path_wrap select').selectize({
      options: Object.values(this.catalogs),
      onDropdownClose: () => window.localStorage.setItem('selectize_dropdown_open', 'false'),
      onDropdownOpen: () => window.localStorage.setItem('selectize_dropdown_open', 'true'),
      onItemAdd: (value) => {
        window.localStorage.setItem('selectize_dropdown_open', 'true')
        url_params.set_param('catalog', value)
        location.reload()
      },
      render: {
        option: function(item, escape) {
          return `
            <div class="option">
              <div class="text">
                <span class="name">${item.catalog_name}</span>
              </div>
              <div class="image">
                <img class="avatar" src="web/media/img/catalog_icon.png">
              </div>
            </div>
          `;
        }
      },
    })
    if(window.localStorage.getItem('selectize_dropdown_open') === 'true'){
      $('#select_path_wrap select')[0].selectize.focus()
    }
  }

  add_new_catalog(){
    ;(async () => {
      try{
        const catalog_name = $('#catalog_name').val()
        const config = {
          catalog_name,
          path_to_scan: $('#path_to_scan').val(),
          alias: $('#alias').val(), 
          use_alias_on_file: $('#use_alias_on_file').val(), 
          exclude_folders: $('#exclude_folders').val(), 
        }
        const res = await apiclip.action('add_new_catalog', {data: config})
        this.dialog.dialog("close")
        this.catalogs[catalog_name] = {catalog_name, config}
        this.render()
      } catch(err){
        console.error(err)
      }
    })();
  }

  update_catalog(){
    ;(async () => {
      try{
        const catalog_name = $('#catalog_name').val()
        const old_catalog_name = $('#old_catalog_name').val()
        const config = {
          catalog_name, 
          old_catalog_name,
          path_to_scan: $('#path_to_scan').val(),
          alias: $('#alias').val(), 
          use_alias_on_file: $('#use_alias_on_file').val(), 
          exclude_folders: $('#exclude_folders').val()
        }
        console.log('update_catalog')
        const res = await apiclip.action('update_catalog', {data: config})
        this.dialog.dialog("close")
        delete this.catalogs[old_catalog_name]
        this.catalogs[catalog_name] = {catalog_name, config}
        this.render()
      } catch(err){
        console.error(err)
      }
    })();
  }

  actions(){
    const that = this
    $('body').on('click', '.click_catalog', function() {
      const catalog_name = $(this).data('catalog').toString().trim()
      url_params.set_param('catalog', catalog_name)
      location.reload()
    })

    $('body').on('click', '.btn_scan_catalog', async function() {
      const catalog_name = $(this).data('catalog').toString().trim()
      try {
        const res = await apiclip.action('scan_catalog', {catalog_name})
        const msg = 'done in ' + res.duration + 's'
        $.notify(msg, 'success')
        const basic_data = await loader.load_js_data('data/' + catalog_name + '/basic_data.json.js')
        that.catalogs[catalog_name].basic_data = basic_data
        that.render()
      } catch(err){
        console.error(err)
        $.notify(err, 'error')
      }
    })

    $('body').on('click', '.btn_delete_catalog', async function() {
      const catalog_name = $(this).data('catalog').toString().trim()
      try {
        const res = await apiclip.action('delete_catalog', {catalog_name})
        $.notify('deleted', 'success')
        delete  that.catalogs[catalog_name]
        that.render()
      } catch(err){
        console.error(err)
        $.notify(err, 'error')
      }
    })

    $('body').on('click', '.btn_config_catalog', async function() {
      const catalog_name = $(this).data('catalog').toString().trim()

      const dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 500,
        width: 600,
        modal: true,
        buttons: {
          save: () => {
            that.update_catalog()
          }
        },
        close: () => {
          form[0].reset()
        }
      })
    
      const form = dialog.find("form").on("submit", event => {
        event.preventDefault()
        that.update_catalog()
      })
   
      dialog.dialog("open")
      that.dialog = dialog

      

      $('#old_catalog_name').val(catalog_name)

      const config = that.catalogs[catalog_name].config
      for(const[key, value] of Object.entries(config)){
        $('#' + key).val(value)
        if(value !== '' && value !== undefined){
          $('#' + key).parent().addClass('active')
        } else {
          $('#' + key).parent().removeClass('active')
        }
      }
    })

    $('body').on('click', '.btn_add_new_catalog', async function() {

      $('#form_add_new_catalog input').parent().removeClass('active')

      const dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 500,
        width: 600,
        modal: true,
        buttons: {
          save: () => {
            that.add_new_catalog()
          }
        },
        close: () => {
          form[0].reset()
        }
      })
   
      const form = dialog.find("form").on("submit", event => {
        event.preventDefault()
        that.add_new_catalog()
      })
   
      dialog.dialog("open")

      that.dialog = dialog
      that.form = form
    })

    $('body').on('focusin', '#form_add_new_catalog input', function() {
      $(this).parent().addClass('active')
    })

    $('body').on('focusout', '#form_add_new_catalog input', function() {
      if (!this.value) {
        $(this).parent().removeClass('active')
      }
    })

    window.onpopstate = () => {
      location.reload()
    }
  }
}
