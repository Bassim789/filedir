class Filedir{
  constructor(){
    this.file_type = false
    this.time_ago_limit = 3 * 24 * 3600 // 3 days
    this.date_now = Date.now() / 1000
  }
  add_data(data){
    this.root_path = data.root_path
    this.folder_to_scan = data.folder_to_scan
    this.path = data.folder_to_scan
    this.file_type_icons = data.file_type_icons
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
    if(param_path === undefined) param_path = this.folder_to_scan
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
    const current_dir = this.directories[this.path]
    const inner_path = this.clean_path([current_dir.path, current_dir.directory].join('/'))
    const inner_path_parts = []
    let inner_path_part_value = ''
    for(const item of inner_path.split('/')){
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
    for(const [key, directory] of Object.entries(this.directories)){
      if(directory.path !== this.path) continue
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
    for(const file of this.files){
      if(file.path !== this.path) continue
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

    template.render('#filedir', 'filedir', {
      root_path: this.root_path,
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
  }

  actions(){
    const that = this

    $('body').on('click', '.click_folder', function() {
      const dir_name = $(this).data('directory').toString().trim()
      that.path += '/' + dir_name
      let param_to_set = that.path
      if(param_to_set === that.folder_to_scan) param_to_set = ''
      url_params.set_param('path', param_to_set)
      that.update()
    })

    $('body').on('click', '.inner_path_part', function() {
      const inner_path_part_value = $(this).data('value').toString()
      that.path = inner_path_part_value
      let param_to_set = inner_path_part_value
      if(param_to_set === that.folder_to_scan) param_to_set = ''
      url_params.set_param('path', param_to_set)
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

    window.onpopstate = () => {
      this.init_path_param()
      this.init_file_type_param()
      this.update()
    }
  }
}
