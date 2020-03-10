class Timer{
  
  static milliseconds_to_object(milliseconds){
    const object = {}
    milliseconds = Math.abs(milliseconds)
    for (const [key, value] of Object.entries(this.times)) {
      let nb_unit = Math.floor(milliseconds / value)
      if(nb_unit > 0) object[key] = nb_unit
      milliseconds -= nb_unit * value
    }
    return object
  }

  static get_readable_duration(milliseconds, option = {max_part: 1}){
    let duration = ''
    let nb_part = 0
    const object = this.milliseconds_to_object(milliseconds)
    for (const [key, value] of Object.entries(object)) {
      duration += value + ' ' + key
      if (value > 1 && !duration.endsWith('s')) duration += 's'
      duration += ' '
      nb_part += 1
      if(nb_part === option.max_part) break
    }
    if(duration === '') duration = 'nothing'
    return duration.trim()
  }

  static timestamp_to_time_ago(timestamp){
    return this.get_readable_duration(Date.now() - timestamp * 1000)
  }
}

Timer.times  = {
  year: 365 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
  millisecond: 1
}

// Timer.times  = {
//   annee: 365 * 24 * 60 * 60 * 1000,
//   mois: 30 * 24 * 60 * 60 * 1000,
//   jour: 24 * 60 * 60 * 1000,
//   heure: 60 * 60 * 1000,
//   minute: 60 * 1000,
//   seconde: 1000,
//   milliseconde: 1
// }

for (const [key, value] of Object.entries(Timer.times)) 
  Timer[key.toUpperCase()] = value