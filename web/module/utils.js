
const template = {
  render(container, template_name, data={}){
    $(container).html(Mustache.render(this[template_name], data))
  },
  append(container, template_name, data={}){
    $(container).append(Mustache.render(this[template_name], data))
  }
}

function log(value){
  console.log(JSON.parse(JSON.stringify(value)))
}

function get_datetime(timestamp){
  return new Date(timestamp * 1000).toLocaleDateString('en', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  })
}
function get_time_ago(timestamp){
  return Timer.timestamp_to_time_ago(timestamp) + ' ago'
}
