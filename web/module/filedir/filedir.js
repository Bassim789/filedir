class Filedir{
  constructor(){
    this.file_type = false
    this.time_ago_limit = 3 * 24 * 3600 // 3 days
    this.date_now = Date.now() / 1000
  }
  add_data(data){
    this.root_path = data.root_path
    this.folder_to_scan = data.folder_to_scan
    this.path = '__root__'
    this.file_type_icons = data.file_type_icons
    this.alias = data.alias
    this.use_alias_on_file = data.use_alias_on_file
    if(!this.alias.endsWith('/')) this.alias += '/'
  }
  add_directories(directories){
    for(const [key, directory] of Object.entries(directories)){
      directory.nb_folder_clean = parseInt(directory.nb_folder).toLocaleString()
      directory.nb_file_clean = parseInt(directory.nb_file).toLocaleString()
      directory.size_clean = this.get_size_clean(directory.size)
    }
    this.directories = directories
  }
  add_files(files){
    for(const file of files){
      file.size_clean = this.get_size_clean(file.size)
      file.extension = '__nothing__'
      file.extension_clean = ''
      if(this.has_file_type(file.file_name)){
        file.extension = file.file_name.split('.').pop()
        file.extension_clean = file.extension
        if(this.file_type_icons.includes(file.extension)){
          file.is_icon = true
        }
      }
    }
    files.sort((a, b) => (a.last_modif < b.last_modif) ? 1 : -1)
    this.files = files
  }
  init(){
    this.init_path_param()
    this.init_file_type_param()
    this.update()
    this.actions()
  }
  init_path_param(){
    let param_path = url_params.get_param('path')
    if(param_path !== undefined){
      param_path = decodeURI(param_path)
    }
    if(param_path === undefined) param_path = '__root__'
    this.path = this.clean_path(param_path).replace(/\/+$/, '')
  }
  init_file_type_param(){
    this.file_type = this.clean_path(url_params.get_param('file_type'))
  }
  clean_path(path){
    if(!path || path === undefined) return path
    if(path.charAt(0) === '/')
      path = path.slice(1)
    return path
  }
  put_hidden_at_the_end(array, item_name){
    const array_temp = array
    array = []
    const items_hidden = []
    for(const [key, item] of Object.entries(array_temp)){
      if(item[item_name].startsWith('.')){
        if(items_hidden.length === 0){
          item.first_hidden = true
        }
        items_hidden.push(item)
      } else {
        array.push(item)
      }
    }
    if(items_hidden.length > 0){
      items_hidden[items_hidden.length - 1].last_hidden = true
    }
    return [...array, ...items_hidden]
  }
  get_size_clean(size_in_bytes){
    if(size_in_bytes > (1024*1024*1024)){
      return Math.round(size_in_bytes / (1024*1024*1024) * 10) / 10 + ' GB'
    } else if(size_in_bytes > (1024*1024)){
      return Math.round(size_in_bytes / (1024 * 1024) * 10) / 10 + ' MB'
    } else if(size_in_bytes > 1024){
      return Math.round(size_in_bytes / 1024 * 10) / 10 + ' KB'
    } else{
      return size_in_bytes + ' B'
    }
  }
  has_file_type(file){
    return file.split('.').length > 1 && file.split('.')[0] !== ''
  }
  get_inner_path_parts(){
    if(this.path === '') this.path = '__root__'
    if(this.path === '__root__') return false

    this.path = this.clean_path(this.path.replace('__root__', ''))
    if(this.path.startsWith(this.folder_to_scan)){
      this.path = this.clean_path(this.path.substring(this.folder_to_scan.length))
    }

    const current_dir = this.directories[this.path]
    const inner_path = this.clean_path([current_dir.path, current_dir.directory].join('/'))
    const inner_path_parts = []
    let inner_path_part_value = this.folder_to_scan
    
    for(const item of inner_path.split('/')){
      //if(item === this.folder_to_scan) continue
      inner_path_part_value += '/' + item
      inner_path_parts.push({
        inner_path_part: item,
        inner_path_part_value: this.clean_path(inner_path_part_value)
      })
    }
    return inner_path_parts
  }
  get_parent_directory(){
    const parent_directory = JSON.parse(JSON.stringify(this.directories[this.path]))
    if(this.file_type){
      const file_type_directory = this.directories[this.path].file_types[this.file_type]
      parent_directory.nb_file = file_type_directory.nb_file
      parent_directory.size = file_type_directory.size
      parent_directory.nb_folder_clean = ''
      parent_directory.nb_file_clean = parseInt(parent_directory.nb_file).toLocaleString()
      parent_directory.size_clean = this.get_size_clean(parent_directory.size)
    }
    return parent_directory
  }
  get_current_directories(parent_directory){
    let current_directories = []
    let directory_path = this.path
    if(directory_path === '__root__') directory_path = ''
    for(const [key, directory] of Object.entries(this.directories)){
      if(key === '__root__') continue
      if(directory.path !== directory_path) continue
      directory.rows_info = []
      let nb_file, nb_file_clean, size, size_clean
      if(this.file_type){
        if(directory.file_types[this.file_type] === undefined) continue
        nb_file = directory.file_types[this.file_type].nb_file
        nb_file_clean = parseInt(nb_file).toLocaleString()
        size = directory.file_types[this.file_type].size
        size_clean = this.get_size_clean(size)
      } else {
        nb_file = directory.nb_file
        nb_file_clean = directory.nb_file_clean
        size = directory.size
        size_clean = directory.size_clean
        directory.rows_info.push({
          percent: Math.round(directory.nb_folder / parent_directory.nb_folder * 100),
          nb_clean: directory.nb_folder_clean,
          img_folder: true
        })
      }
      directory.rows_info.push({
        percent: Math.round(nb_file / Math.max(parent_directory.nb_file, 1) * 100),
        nb_clean: nb_file_clean,
        img_file: true
      })
      directory.rows_info.push({
        percent: Math.round(size / Math.max(parent_directory.size, 1) * 100),
        nb_clean: size_clean
      })
      current_directories.push(directory)
    }
    current_directories.sort((a, b) => (a.directory > b.directory) ? 1 : -1)
    current_directories = this.put_hidden_at_the_end(current_directories, 'directory')
    return current_directories
  }
  get_current_files(parent_directory){
    let current_files = []
    let directory_path = this.path
    if(directory_path === '__root__') directory_path = ''
    for(const file of this.files){
      if(file.path !== directory_path) continue
      if(this.file_type && this.file_type !== file.extension) continue
      file.rows_info = [{
          name: '',
          percent: Math.round(file.size / Math.max(parent_directory.size, 1) * 100),
          nb_clean: file.size_clean
      }]
      if(this.date_now - file.last_modif < this.time_ago_limit){
        file.last_modif_clean = get_time_ago(file.last_modif)
      } else {
        file.last_modif_clean = get_datetime(file.last_modif)
      }
      current_files.push(file)
    }
    current_files.sort((a, b) => (a.file_name > b.file_name) ? 1 : -1)
    current_files = this.put_hidden_at_the_end(current_files, 'file_name')
    return current_files
  }
  get_file_types(parent_directory){
    let file_types = []

    if(this.file_type){
      const file_type_data = {
        file_type: this.file_type, 
        file_type_clean: this.file_type,
        nb_file: parent_directory.nb_file,
        size: parent_directory.size,
        nb_file_clean: parent_directory.nb_file.toLocaleString(),
        size_clean: this.get_size_clean(parent_directory.size),
        is_icon: false
      }
     
      if(this.file_type_icons.includes(this.file_type)){
        file_type_data.is_icon = true
      }

      if(file_type_data.file_type === '__nothing__') file_type_data.file_type_clean = ''
    
      file_types.push(file_type_data)
      
    } else if(parent_directory.file_types !== undefined){

      for(const [file_type, data] of Object.entries(parent_directory.file_types)){
        const file_type_data = {
          file_type,
          file_type_clean: file_type,
          nb_file: data.nb_file,
          size: data.size,
          nb_file_clean: data.nb_file.toLocaleString(),
          size_clean: this.get_size_clean(data.size),
          is_icon: false
        }
       
        if(this.file_type_icons.includes(file_type)){
          file_type_data.is_icon = true
        }

        if(file_type_data.file_type === '__nothing__') file_type_data.file_type_clean = ''

        file_types.push(file_type_data)
      }
    }

    file_types.sort((a, b) => (a.size < b.size) ? 1 : -1)
    return file_types
  }
  update(){
    const inner_path_parts = this.get_inner_path_parts()
    const parent_directory = this.get_parent_directory()
    const current_directories = this.get_current_directories(parent_directory)
    const current_files = this.get_current_files(parent_directory)
    const file_types = this.get_file_types(parent_directory)

    this.current_files = current_files

    template.render('#filedir', 'filedir', {
      root_path: this.root_path,
      alias: this.alias,
      inner_path_parts,
      parent_directory: parent_directory,
      file_types,
      current_directories,
      current_files,
      nb_file_types: file_types.length,
      nb_folder: current_directories.length,
      nb_file: current_files.length,
      parent_directory_description: parent_directory.description
    })

    last_modified_files.prepare_data(parent_directory)
    last_modified_files.render()

    if(this.file_type){
      $('.variable_box.click_filter_type.' + this.file_type).addClass('selected')
    }

    new Readmore('.database_description_wrap', {
      collapsedHeight: 35,
      speed: 300,
      moreLink: '<a href="#" class="readmore_btn">More...</a>',
      lessLink: '<a href="#" class="readless_btn">Less...</a>'
    })


    
    $('#select_path_wrap').html('')
    const template_select_path = `
      <select>
        <option selected="selected" value=""></option>
        {{#folders}}
          <option value="{{directory}}">
          {{directory}}
          </option>
        {{/folders}}
        {{#files}}
          <option value="{{file_name}}">
          {{file_name}}
          </option>
        {{/files}}
      </select>
    `;
    $('#select_path_wrap').html(Mustache.to_html(template_select_path, {
      folders: current_directories,
      files: current_files
    }))
    
    const selectize = $('#select_path_wrap select').selectize({
      // sortField: 'text',
      options: [...current_directories, ...current_files],
      render: {
        option: function(item, escape) {
          let select, name
          let img = false
          if(item.file_name === undefined){
            name = item.directory
            img = "web/media/img/folder_icon.png"
          } else {
            name = item.file_name
            if(item.is_icon){
              img = 'web/media/img/file_icon/' + item.extension + '.png'
            }
          }
          select = `
            <div class="option">
              <div class="text">
                <span class="name">${name}</span>
              </div>
          `;
          if(img){
            select += `
              <div class="image">
                <img class="avatar" src="${img}">
              </div>
            `
          }
          return select + '</div>'
        }
      },
    })
    $('#select_path_wrap select')[0].selectize.focus()
  }

  is_filename(name){
    for(const current_file of this.current_files){
      if(current_file.file_name === name){
        return true
      }
    }
    return false
  }
  open_file(filename){
    console.log(this.path)
    const path_clean = this.path.replace('__root__', '')
    let path = ''
    console.log(this.use_alias_on_file)
    if(this.use_alias_on_file === 'true'){
      path += 'https://'
      path += this.alias
      if(!path.endsWith('/')) path += '/' 
      path += path_clean
      if(!path.endsWith('/')) path += '/' 
      path += filename
    } else {
      path = this.root_path + this.folder_to_scan + '/' + path_clean + '/' + filename
    }
    console.log(path)
    const win = window.open(path, '_blank')
    win.focus()
  }
  go_to_folder(folder){
    if(folder === ''){ return false}
    if(this.is_filename(folder)){
      $('#select_path_wrap select')[0].selectize.clear()
      this.open_file(folder)
      $('#select_path_wrap select')[0].selectize.focus()
      return false
    }
    this.path += '/' + folder
    let param_to_set = this.path
    if(param_to_set === this.folder_to_scan) param_to_set = ''
    param_to_set = this.clean_path(param_to_set.replace('__root__', ''))
    url_params.set_param('path', param_to_set)
    this.update()
  }
  go_to_folder_parent(){
    if(this.path === '__root__') return false
    this.path = this.path.substring(0, this.path.lastIndexOf('/'))
    let param_to_set = this.path
    if(param_to_set === this.folder_to_scan) param_to_set = ''
    url_params.set_param('path', param_to_set)
    this.update()
  }

  actions(){
    const that = this

    $('body').on('click', '.click_folder', function() {
      const dir_name = $(this).data('directory').toString().trim()
      that.go_to_folder(dir_name)
    })

    $('body').on('click', '.click_file', function() {
      const filename = $(this).data('file').toString().trim()
      that.open_file(filename)
    })

    $('body').on('click', '.inner_path_part', function() {
      const inner_path_part_value = $(this).data('value').toString()
      console.log(inner_path_part_value)
      that.path = inner_path_part_value
      let param_to_set = inner_path_part_value
      if(param_to_set === that.folder_to_scan) param_to_set = ''
      if(param_to_set.startsWith(that.folder_to_scan)){
        param_to_set = that.clean_path(param_to_set.substring(that.folder_to_scan.length))
      }
      url_params.set_param('path', param_to_set)
      that.update()
    })
    $('body').on('click', '.alias', function() {
      that.path = ''
      url_params.set_param('path', '')
      that.update()
    })
  
    $('body').on('click', '.click_filter_type', function() {
      const file_type = $(this).data('file_type').toString()
      if(file_type === that.file_type){
        that.file_type = false
        url_params.set_param('file_type', '')
        $(this).removeClass('selected')
      } else {
        that.file_type = file_type
        url_params.set_param('file_type', file_type)
      }
      that.update()
    })

    $('body').on('click', '.btn_show_hidden', function() {
      $(this).hide()
      const boxes = $(this).parent().find('.hidden_box').html()
      $(this).parent().append(boxes)
    })

    $('body').on('change', '#select_path_wrap select', function() {
      that.go_to_folder($(this).val())
    })

    $('body').on('keydown', '.selectize-input input', function(event) {
      if(event.keyCode === 8 && $(this).val() === ''){
        that.go_to_folder_parent()
      }
    })

    window.onpopstate = () => {
      this.init_path_param()
      this.init_file_type_param()
      this.update()
    }
  }
}
