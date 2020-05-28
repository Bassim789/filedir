class Apiclip{
  constructor(){
    this.loop_frequency = 50
    this.timeout = false
    this.waiting_response = false
    this.connected = false
    this.first_connexion_tried = false
    this.msg_loop = {}
    this.to_send_queue = []
    this.session_token = ''
    const file_src = document.querySelector('[apiclip]').src
    this.path = file_src.substr(0, file_src.lastIndexOf('/') + 1)
    this.set_default_events()
    this.load_config()
  }
  set_default_events(){
    this.event = {
      connected: () => {},
      unconnected: () => {},
      reconnected: () => {},
      start_loading: () => {},
      stop_loading: () => {}
    }
  }
  set_timeout(timeout){
    this.timeout = timeout
  }
  set_loop_frequency(loop_frequency){
    this.loop_frequency = loop_frequency
  }
  load_config(){
    return new Promise(resolve => {
      this.load_js_data(this.path + 'config.json.js').then(config => {
        this.config = config
        if(config.response_file) this.response_file = config.response_file
        if(config.session_token) this.session_token = config.session_token
        resolve()
      })
    })
  }
  connect(){
    const msg_id = Date.now()
    this.copy_to_clipboard({
      session_token: this.session_token,
      msg_id, 
      action: '_init_apiclip_connexion'
    })
    return new Promise((resolve, reject) => {
      this.waiting_response = true
      this.listen(
        msg_id,
        response => resolve(response), 
        error => reject(error),
        {},
        3000
      )
    })
  }
  try_connect(){
    this.first_connexion_tried = true
    return new Promise(resolve => {
      this.connect()
        .then(() => {
          this.connected = true
          this.event.connected()
          resolve()
        })
        .catch(err => {
          this.event.unconnected()
          resolve()
        })
    })
  }
  action(action_name, params={}){
    return (async () => {
      if(!this.first_connexion_tried){
        await this.try_connect()
      }
      if(!this.connected){
        return new Promise((resolve, reject) => reject('unconnected'))
      }
      this.event.start_loading()
      const msg_id = Date.now()
      this.to_send_queue.push(msg_id)
      this.action_name = action_name
      this.params = params
      return new Promise((resolve, reject) => {
        const waiter = () => {
          if(!this.waiting_response && this.to_send_queue[0] === msg_id){
            this.waiting_response = true
            this.listen(
              msg_id,
              response => resolve(response), 
              error => reject(error),
              params
            )
            this.copy_to_clipboard({
              session_token: this.session_token,
              msg_id, 
              action: action_name,
              params
            })
          } else {
            setTimeout(waiter, this.loop_frequency)
          }
        }
        waiter()
      })
    })()
  }
  listen(msg_id, resolve, reject, params={}, timeout=false){
    //console.log('start listen()', msg_id)
    const listen = async () => {
      if(!this.waiting_response) return false
      const data = await this.load_js_data(this.path + this.response_file)
      if(data.msg_id !== msg_id) return false
      this.stop_listen(msg_id)
      if(data.error){
        if(data.error === 'wrong_session_token'){
          await this.load_config()
          this.event.reconnected()
        }
        reject(data.error)
      }
      resolve(data.data)
    }
    this.msg_loop[msg_id] = setInterval(listen, this.loop_frequency)
    this.start_timeout(msg_id, timeout, reject)
  }
  copy_to_clipboard(data){
    //console.log('copy_to_clipboard()', data)
    const text = JSON.stringify(data, null, 1)
    navigator.clipboard.writeText(text).then(() => {
      
    }, err => {
      
    })
  }
  start_timeout(msg_id, timeout=false, reject=false){
    if(!timeout && this.timeout) timeout = this.timeout
    if(timeout) setTimeout(() => {
      if(this.msg_loop[msg_id]){
        this.stop_listen(msg_id)
        if(reject) reject()
        console.log('timeout: no response after ' + timeout + 'ms')
      }
    }, timeout)
  }
  remove_to_send_queue(msg_id){
    const index = this.to_send_queue.indexOf(msg_id)
    if (index > -1) {
      this.to_send_queue.splice(index, 1)
    }
  }
  stop_listen(msg_id){
    //console.log('stop_listen()', msg_id)
    window.clearInterval(this.msg_loop[msg_id])
    this.msg_loop[msg_id] = false
    this.waiting_response = false
    this.remove_to_send_queue(msg_id)
    if(this.to_send_queue.length === 0){
      this.event.stop_loading()
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
  on(event_name, event){
    this.event[event_name] = event
  }
}
const apiclip = new Apiclip()
