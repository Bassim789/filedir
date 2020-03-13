class Filedir{
  constructor(){
    this.file_type = ''
  }
  add_info(info){
    this.filedir_info = info
    this.root_path = info.root_path
    this.folder_to_scan = info.folder_to_scan
    this.path = info.folder_to_scan
    this.file_type_icons = info.file_type_icons
    this.scan_info = get_time_ago(info.scan_timestamp)
    this.scan_duration = info.scan_duration
  }
  add_directories(directories){
    this.directories = directories
  }
  add_files(files){
    this.files = files
  }
  append_to_body(){
    $('body').append('<div id="filedir"></div>')
    this.init_path_param()
    this.init_file_type_param()
    this.update()
    this.actions()
  }
  init_path_param(){
    this.param_path = url_params.get_param('path')
    if(this.param_path !== undefined){
      this.param_path = decodeURI(this.param_path)
    }
    if(this.param_path === undefined) this.param_path = this.folder_to_scan
    this.path = this.param_path
  }
  init_file_type_param(){
    this.file_type = url_params.get_param('file_type')
  }
  clean_path(path){
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
  update(){
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

    let current_directories = []
    let parent_directory

    if(this.file_type === '' || this.file_type === undefined){
      parent_directory = this.directories[this.path]
      parent_directory.nb_folder_clean = parent_directory.nb_folder.toLocaleString()
      parent_directory.nb_file_clean = parent_directory.nb_file.toLocaleString()
      parent_directory.size_clean = this.get_size_clean(parent_directory.size)

      for(const [key, directory] of Object.entries(this.directories)){
        if(directory.path === this.path){
          directory.rows_info = [{
            percent: Math.round(directory.nb_folder / parent_directory.nb_folder * 100),
            nb_clean: parseInt(directory.nb_folder).toLocaleString(),
            img_folder: true
          }, {
            percent: Math.round(directory.nb_file / parent_directory.nb_file * 100),
            nb_clean: parseInt(directory.nb_file).toLocaleString(),
            img_file: true
          }, {
            percent: Math.round(directory.size / Math.max(parent_directory.size, 1) * 100),
            nb_clean: this.get_size_clean(directory.size)
          }]
          current_directories.push(directory)
        }
      }
    } else {
      parent_directory = this.directories[this.path].file_types[this.file_type]
      parent_directory.nb_file_clean = parent_directory.nb_file.toLocaleString()

      for(const [key, directory] of Object.entries(this.directories)){
        if(directory.path === this.path && directory.file_types[this.file_type] !== undefined){
          const nb_file = directory.file_types[this.file_type].nb_file
          const nb_file_parent = parent_directory.nb_file
          const size = directory.file_types[this.file_type].size
          const size_clean = this.get_size_clean(directory.file_types[this.file_type].size)
          const size_parent = parent_directory.size
          directory.rows_info = [{
            name: '',
            percent: Math.round(nb_file / nb_file_parent * 100),
            nb_clean: parseInt(nb_file).toLocaleString(),
            img_file: true
          }, {
            name: '',
            percent: Math.round(size / size_parent * 100),
            nb_clean: this.get_size_clean(size)
          }]
          current_directories.push(directory)
        }
      }
    }

    let current_files = []
    for(const [key, file] of Object.entries(this.files)){
      if(file.path === this.path){

        if(this.file_type !== '' && this.file_type !== undefined
            && !file.file_name.endsWith('.' + this.file_type)) continue

        file.file_type_short_name = ''
        if(file.file_name.split('.').length > 1 && file.file_name.split('.')[0] !== ''){
          file.file_type_short_name = file.file_name.split('.').pop()
          if(this.file_type_icons.includes(file.file_type_short_name)){
            file.is_icon = true
          }
        }

        file.rows_info = [
          {
            name: '',
            percent: Math.round(file.size / Math.max(parent_directory.size, 1) * 100),
            nb_clean: this.get_size_clean(file.size)
          }
        ]
        
        // if more than 3 days ago get date, else get time ago
        if(Date.now() - file.last_modif * 1000 > 3 * 24 * 3600 * 1000){
          file.last_modif_clean = get_datetime(file.last_modif)
        } else {
          file.last_modif_clean = get_time_ago(file.last_modif)
        }

        current_files.push(file)
      }
    }

    current_directories.sort((a, b) => (a.directory > b.directory) ? 1 : -1)
    current_files.sort((a, b) => (a.file_name > b.file_name) ? 1 : -1)

    let file_types = []

    if(this.file_type === '' || this.file_type === undefined){

      if(parent_directory.file_types !== undefined){

        for(const [file_type, data] of Object.entries(parent_directory.file_types)){
          const file_type_data = {
            file_type, 
            nb_file: data.nb_file,
            size: data.size,
            nb_file_clean: data.nb_file.toLocaleString(),
            size_clean: this.get_size_clean(data.size),
            is_icon: false
          }
         
          if(this.file_type_icons.includes(file_type)){
            file_type_data.is_icon = true
          }

          file_types.push(file_type_data)
        }
      }
    } else {
      const file_type_data = {
        file_type: this.file_type, 
        nb_file: parent_directory.nb_file,
        size: parent_directory.size,
        nb_file_clean: parent_directory.nb_file.toLocaleString(),
        size_clean: this.get_size_clean(parent_directory.size),
        is_icon: false
      }
     
      if(this.file_type_icons.includes(this.file_type)){
        file_type_data.is_icon = true
      }

      file_types.push(file_type_data)
    }

    file_types.sort((a, b) => (a.size < b.size) ? 1 : -1)
   
    current_directories = this.put_hidden_at_the_end(current_directories, 'directory')
    current_files = this.put_hidden_at_the_end(current_files, 'file_name')

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
      parent_directory_description: parent_directory.description,
      scan_info: this.scan_info,
      scan_duration: this.scan_duration
    })

    if(this.file_type !== '' && this.file_type !== undefined){
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
        that.file_type = ''
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
      $(this).parent().find('.hidden_box').show()
    })

    window.onpopstate = () => {
      this.init_path_param()
      this.update()
    }
  }
}
