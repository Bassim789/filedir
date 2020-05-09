class Last_modified_files{
  constructor(){
    this.nb_file_last_modif_max = 100
    this.search = this.get_search_param()
    this.init_container()
    this.actions()
  }
  get_search_param(){
    const param_search = url_params.get_param('search')
    if(param_search === undefined) return ''
    return param_search
  }
  init_container(){
    template.render('#last_modified_files', 'last_modified_files', {
      search: this.search
    })
  }
  prepare_data(parent_directory){
    this.parent_directory = parent_directory
    const path = filedir.clean_path(parent_directory.path + '/' + parent_directory.directory) + '/'
    let last_modified_files = []
    for(const file of filedir.files){
      if(!file.path.startsWith(filedir.path)) continue
      if(file.path.includes('/.')) continue
      if(filedir.file_type && filedir.file_type !== file.extension) continue
      if(file.file_name.startsWith('.')) continue
      if(this.search !== '' && !file.file_name.includes(this.search)) continue
      last_modified_files.push(file)
      if(last_modified_files.length === this.nb_file_last_modif_max) break
    }
    for(const file of last_modified_files){
      file.path_from_current_directory = file.path.substring(path.length)
      file.last_modif_ago_clean = get_time_ago(file.last_modif)
    }
    this.last_modified_files = last_modified_files
  }
  render(last_modified_files){
    template.render('#table_last_file_modif_container', 'last_modified_files_table', {
      is_file: this.last_modified_files.length > 0,
      last_modified_files: this.last_modified_files
    })
  }
  actions(){
    const that = this
    $('body').on('click', '.last_file_modif_td_path', function() { 
      filedir.path = (filedir.path + '/' + $(this).parent().data('path')).replace(/\/+$/, '')
      let param_to_set = filedir.path
      if(param_to_set === filedir.folder_to_scan) param_to_set = ''
      url_params.set_param('path', param_to_set)
      filedir.update()
    })
    $('body').on('click', '.file_name', function() { 
      const path = $(this).parent().data('path').replace(/\/+$/, '')
      const file = (path + '/' + $(this).data('file_name')).replace(/\/+$/, '')
      console.log(file)
      filedir.open_file(file)
    })
    $('body').on('keyup', '.search_bar', function() {
      if(that.search === $(this).val()) return false
      that.search = $(this).val()
      url_params.set_param('search', that.search)
      that.prepare_data(that.parent_directory)
      that.render()
    })
  }
}
