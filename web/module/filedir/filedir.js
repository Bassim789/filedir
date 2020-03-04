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
  // add_numerotation(object){
  //   let count = 0
  //   for(const [key, item] of Object.entries(object)){
  //     count += 1
  //     item.order_num = count
  //   }
  //   return object
  // }
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
      parent_directory.nb_folder_recursive_clean = parent_directory.nb_folder_recursive.toLocaleString()
      parent_directory.nb_file_recursive_clean = parent_directory.nb_file_recursive.toLocaleString()

      for(const [key, directory] of Object.entries(this.directories)){
        if(directory.path === this.path){
          directory.rows_info = [{
            percent: Math.round(directory.nb_folder_recursive / parent_directory.nb_folder_recursive * 100),
            nb_clean: parseInt(directory.nb_folder_recursive).toLocaleString(),
            img_folder: true
          }, {
            percent: Math.round(directory.nb_file_recursive / parent_directory.nb_file_recursive * 100),
            nb_clean: parseInt(directory.nb_file_recursive).toLocaleString(),
            img_file: true
          }, {
            percent: Math.round(directory.size_recursive / parent_directory.size_recursive * 100),
            nb_clean: directory.size_recursive_clean
          }]
          current_directories.push(directory)
        }
      }
    } else {
      parent_directory = this.directories[this.path].file_types[this.file_type]
      parent_directory.nb_file_recursive_clean = parent_directory.nb_file_recursive.toLocaleString()

      for(const [key, directory] of Object.entries(this.directories)){
        if(directory.path === this.path && directory.file_types[this.file_type] !== undefined){
          const nb_file = directory.file_types[this.file_type].nb_file_recursive
          const nb_file_parent = parent_directory.nb_file_recursive
          const size = directory.file_types[this.file_type].size_recursive
          const size_clean = directory.file_types[this.file_type].size_recursive_clean
          const size_parent = parent_directory.size_recursive
          directory.rows_info = [{
            name: '',
            percent: Math.round(nb_file / nb_file_parent * 100),
            nb_clean: parseInt(nb_file).toLocaleString(),
            img_file: true
          }, {
            name: '',
            percent: Math.round(size / size_parent * 100),
            nb_clean: size_clean
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
            percent: Math.round(file.size / parent_directory.size_recursive * 100),
            nb_clean: file.size_clean //parseInt(directory.nb_file_recursive).toLocaleString()
          }
        ]

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
            nb_file_recursive: data.nb_file_recursive,
            size_recursive: data.size_recursive,
            nb_file_recursive_clean: data.nb_file_recursive.toLocaleString(),
            size_recursive_clean: data.size_recursive_clean,
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
        nb_file_recursive: parent_directory.nb_file_recursive,
        size_recursive: parent_directory.size_recursive,
        nb_file_recursive_clean: parent_directory.nb_file_recursive.toLocaleString(),
        size_recursive_clean: parent_directory.size_recursive_clean,
        is_icon: false
      }
     
      if(this.file_type_icons.includes(this.file_type)){
        file_type_data.is_icon = true
      }

      file_types.push(file_type_data)
    }

    file_types.sort((a, b) => (a.size_recursive < b.size_recursive) ? 1 : -1)
   
    // file_types = this.add_numerotation(file_types)
    // current_directories = this.add_numerotation(current_directories)
    // current_files = this.add_numerotation(current_files)

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
      parent_directory_description: parent_directory.description
    })

    if(this.file_type !== '' && this.file_type !== undefined){
      $('.variable_box.click_filter_type.' + this.file_type).addClass('selected')
    }

    new Readmore('.database_description_wrap', {
      collapsedHeight: 35,
      speed: 300,
      moreLink: '<a href="#" class="readmore_btn">Suite...</a>',
      lessLink: '<a href="#" class="readless_btn">Réduire...</a>'
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