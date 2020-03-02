class Tree_file{
  constructor(){
    this.file_type = ''
  }
  add_info(info){
    this.tree_file_info = info
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
    $('body').append('<div id="tree_file"></div>')
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

    const current_directories = []
    

    let parent_directory

    if(this.file_type === '' || this.file_type === undefined){
      parent_directory = this.directories[this.path]
      parent_directory.nb_folder_recursive_clean = parent_directory.nb_folder_recursive.toLocaleString()
      parent_directory.nb_file_recursive_clean = parent_directory.nb_file_recursive.toLocaleString()

      for(const [key, directory] of Object.entries(this.directories)){
        if(directory.path === this.path){
          directory.rows_info = [{
            name: 'dossiers',
            percent: Math.round(directory.nb_folder_recursive / parent_directory.nb_folder_recursive * 100),
            nb_clean: parseInt(directory.nb_folder_recursive).toLocaleString()
          }, {
            name: 'fichiers',
            percent: Math.round(directory.nb_file_recursive / parent_directory.nb_file_recursive * 100),
            nb_clean: parseInt(directory.nb_file_recursive).toLocaleString()
          }, {
            name: 'taille',
            percent: Math.round(directory.size_recursive / parent_directory.size_recursive * 100),
            nb_clean: directory.size_recursive_clean
          }]
          current_directories.push(directory)
        }
      }
    } else {

      parent_directory = this.directories[this.path].file_types[this.file_type]

      //console.log(parent_directory)

      parent_directory.nb_file_recursive_clean = parent_directory.nb_file_recursive.toLocaleString()

      for(const [key, directory] of Object.entries(this.directories)){
        if(directory.path === this.path && directory.file_types[this.file_type] !== undefined){
          const nb_file = directory.file_types[this.file_type].nb_file_recursive
          const nb_file_parent = parent_directory.nb_file_recursive
          const size = directory.file_types[this.file_type].size_recursive
          const size_clean = directory.file_types[this.file_type].size_recursive_clean
          const size_parent = parent_directory.size_recursive
          directory.rows_info = [{
            name: 'fichiers',
            percent: Math.round(nb_file / nb_file_parent * 100),
            nb_clean: parseInt(nb_file).toLocaleString()
          }, {
            name: 'taille',
            percent: Math.round(size / size_parent * 100),
            nb_clean: size_clean
          }]
          current_directories.push(directory)
        }
      }
    }

    const current_files = []
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
            name: 'taille',
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

    file_types.sort((a, b) => (a.nb_file_recursive < b.nb_file_recursive) ? 1 : -1)
    //file_types = file_types.splice(0, 30)

    //console.log(file_types)

    template.render('#tree_file', 'tree_file', {
      root_path: this.root_path,
      inner_path_parts,
      parent_directory: parent_directory,
      file_types,
      current_directories,
      current_files,
      nb_file_types: file_types.length
    })
  }

  actions(){
    const that = this

    $('body').on('click', '.click_folder', function() {
      const dir_name = $(this).data('directory').toString().trim()
      console.log(dir_name)
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
      } else {
        that.file_type = file_type
        url_params.set_param('file_type', file_type)
      }
      that.update()
    })

    window.onpopstate = () => {
      this.init_path_param()
      this.update()
    }
  }
}
