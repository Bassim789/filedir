class Tree_file{
  constructor(){}
  add_info(info){
    this.tree_file_info = info
    this.root_path = info.root_path
    this.folder_to_scan = info.folder_to_scan
    this.path = info.folder_to_scan
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
    this.update()
    this.actions()
  }
  init_path_param(){
    this.param_path = url_params.get_param('path')
    if(this.param_path === undefined) this.param_path = this.folder_to_scan
    this.path = this.param_path
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
    const parent_directory = this.directories[this.path]
    for(const [key, directory] of Object.entries(this.directories)){
      if(directory.path === this.path){
        directory.rows_info = [{
          name: 'dossiers',
          percent: Math.round(directory.nb_folder_recursive / parent_directory.nb_folder_recursive * 100),
          nb_clean: directory.nb_folder_recursive
        }, {
          name: 'fichiers',
          percent: Math.round(directory.nb_file_recursive / parent_directory.nb_file_recursive * 100),
          nb_clean: directory.nb_file_recursive
        }]
        current_directories.push(directory)
      }
    }

    const current_files = []
    for(const [key, file] of Object.entries(this.files)){
      if(file.path === this.path){    
        current_files.push(file)
      }
    }

    template.render('#tree_file', 'tree_file', {
      root_path: this.root_path,
      inner_path_parts,
      parent_directory: parent_directory,
      current_directories,
      current_files
    })
  }

  actions(){
    const that = this

    $('body').on('click', '.variable_name.clickable', function() {
      const dir_name = $(this).html().trim() 
      that.path += '/' + dir_name
      let param_to_set = that.path.slice(that.folder_to_scan.lenght)
      if(param_to_set === that.folder_to_scan) param_to_set = ''
      url_params.set_param('path', param_to_set)
      that.update()
    })

    $('body').on('click', '.inner_path_part', function() {
      const inner_path_part_value = $(this).data('value') 
      console.log(inner_path_part_value)
      that.path = inner_path_part_value
      let param_to_set = inner_path_part_value.slice(that.folder_to_scan.lenght)
      if(param_to_set === that.folder_to_scan) param_to_set = ''
      url_params.set_param('path', param_to_set)
      that.update()
    })

    window.onpopstate = () => {
      this.init_path_param()
      this.update()
    }
  }
}