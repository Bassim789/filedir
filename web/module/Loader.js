class Loader{
  constructor(options){
    this.version = 1
    if(options !== undefined && options.version !== undefined){
      this.version = options.version
    }
  }
  load(path, files, callback=()=>{}){
    const head = document.getElementsByTagName('head')[0]
    for (const file of files){
      const path_file = path + file + '?v=' + this.version
      let tag = ''
      if(file.endsWith('.js')){
        tag = document.createElement('script')
        tag.type = 'text/javascript'
        tag.src = path_file
      } 
      else if(file.endsWith('.css')){
        tag = document.createElement('link')
        tag.rel = 'stylesheet'
        tag.href = path_file
      }
      tag.async = false
      tag.onload = callback
      head.appendChild(tag)
    }
  }
  load_js_data(src) {
    return new Promise(resolve => {
      const head = document.getElementsByTagName('head')[0]
      const tag = document.createElement('script')
      src += '?v=' + Math.random()
      tag.type = 'text/javascript'
      tag.src = src
      tag.async = false
      tag.onload = () => {
        resolve(data)
        document.querySelectorAll('script[src="' + src + '"]')[0].remove()
      }
      head.appendChild(tag)
    })
  }
}