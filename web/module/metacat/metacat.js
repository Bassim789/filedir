class Metacat{
  constructor(){}
  init(){
    this.actions()
  }
  add_data(catalogs){
    this.catalogs = catalogs
  }
  render(){
    let nb_folder = 0
    let nb_file = 0
    let size = 0
    for(const catalog of this.catalogs){
      nb_folder += catalog.nb_folder
      nb_file += catalog.nb_file
      size += catalog.size
    }
    for(const catalog of this.catalogs){
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
          <option value="{{catalog}}">
          {{catalog}}
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
                <span class="name">${item.catalog}</span>
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

  actions(){
    const that = this
    $('body').on('click', '.click_catalog', function() {
      const catalog_name = $(this).data('catalog').toString().trim()
      console.log(catalog_name)
      url_params.set_param('catalog', catalog_name)
      location.reload()
    })

    window.onpopstate = () => {
      location.reload()
    }
  }
}