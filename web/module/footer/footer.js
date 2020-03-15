class Footer{
  constructor(){}
  add_data(data){
    this.scan_info = get_time_ago(data.scan_timestamp)
    this.scan_duration = data.scan_duration
  }
  render(){
    template.render('#footer', 'footer', {
      scan_info: this.scan_info,
      scan_duration: this.scan_duration
    })
  }
}