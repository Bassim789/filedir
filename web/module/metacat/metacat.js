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
      if(catalog.nb_folder) nb_folder += catalog.nb_folder
      if(catalog.nb_file) nb_file += catalog.nb_file
      if(catalog.size) size += catalog.size
    }
    for(const [i, catalog] of Object.entries(this.catalogs)){
      console.log(nb_folder)
      catalog.rows_info = [
        {
          nb_clean: parseInt(catalog.nb_folder).toLocaleString(),
          percent: Math.round(catalog.nb_folder / nb_folder * 100),
          img_folder: true
        }, {
          nb_clean: parseInt(catalog.nb_file).toLocaleString(),
          percent: Math.round(catalog.nb_file / nb_file * 100),
          img_file: true
        }, {
          nb_clean: filedir.get_size_clean(catalog.size),
          percent: Math.round(catalog.size / size * 100)
        },
      ]
    }
    template.render('#metacat', 'metacat', {
      catalogs: this.catalogs,
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
      catalogs: this.catalogs
    }))

    const selectize = $('#select_path_wrap select').selectize({
      options: [...this.catalogs],
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
        const res = await apiclip.action('add_new_catalog', {data: {
          catalog_name,
          path_to_scan: $('#path_to_scan').val(),
          alias: $('#alias').val(), 
          use_alias_on_file: $('#use_alias_on_file').val(), 
          exclude_folders: $('#exclude_folders').val(), 
        }})
        console.log(res)
        this.dialog.dialog("close")
        this.catalogs.push({catalog_name})
        this.render()
      } catch(err){
        console.log(err)
      }
    })();
  }

  actions(){
    const that = this
    $('body').on('click', '.click_catalog', function() {
      const catalog_name = $(this).data('catalog').toString().trim()
      console.log(catalog_name)
      url_params.set_param('catalog', catalog_name)
      location.reload()
    })

    $('body').on('click', '.btn_scan_catalog', async function() {
      const catalog_name = $(this).data('catalog').toString().trim()
      try {
        const res = await apiclip.action('scan_catalog', {catalog_name})
        const msg = 'done in ' + res.duration + 's'
        $.notify(msg, 'success')
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
        that.catalogs = that.catalogs.filter(catalog => catalog.catalog_name !== catalog_name)
        that.render()
      } catch(err){
        console.error(err)
        $.notify(err, 'error')
      }
    })

    $('body').on('click', '.btn_add_new_catalog', async function() {
      const dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 500,
        width: 600,
        modal: true,
        buttons: {
          "Add catalog": () => {
            that.add_new_catalog()
          },
          Cancel: () => {
            dialog.dialog("close")
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

      $('#form_add_new_catalog input').on('focusin', function() {
        $(this).parent().find('label').addClass('active')
      })

      $('#form_add_new_catalog input').on('focusout', function() {
        if (!this.value) {
          $(this).parent().find('label').removeClass('active')
        }
      })

      that.dialog = dialog
    })

    window.onpopstate = () => {
      location.reload()
    }
  }
}
