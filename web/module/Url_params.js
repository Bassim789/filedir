class Url_params {
  constructor(){}
  get_params(){
    let vars = {}
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
        vars[key] = value
    })
    return vars
  }
  get_param(param){
    const params = this.get_params()
    return params[param]
  }
  set_param(name, value){
    let query = []
    let query_str = location.pathname
    let params = this.get_params()
    params[name] = value
    for(const [key, val] of Object.entries(params)) {
      if(!['', undefined].includes(val)){
        query.push(key + "=" + val)
      }
    }
    if(query.length > 0){
      query_str += '?' + query.join("&")
    }
    window.history.pushState('', '', query_str)
  }
  set_params(new_params){
    let query = []
    let query_str = location.pathname
    let params = this.get_params()
    for(const [key, val] of Object.entries(new_params)) {
      params[key] = val
    }
    for(const [key, val] of Object.entries(params)) {
      if(!['', undefined].includes(val)){
        query.push(key + "=" + val)
      }
    }
    if(query.length > 0){
      query_str += '?' + query.join("&")
    }
    window.history.pushState('', '', query_str)
  }
}