class Edition_mode{
  constructor(){
    if(window.localStorage.getItem('edition_mode') === 'on'){
      $('html').addClass('edition_mode_on')
    } else {
      $('html').addClass('edition_mode_off')
    }
  }
  append_to_body(){
    template.append('body', 'edition_mode')
    if(window.localStorage.getItem('edition_mode') === 'on'){
      $('#switch_edition_mode').prop('checked', true)
    }
  }
  init_actions(){
    $('body').on('change', '#switch_edition_mode', function() {
      if($(this).is(':checked')){
        $('html').addClass('edition_mode_on')
        $('html').removeClass('edition_mode_off')
        window.localStorage.setItem('edition_mode', 'on')
      } else {
        $('html').addClass('edition_mode_off')
        $('html').removeClass('edition_mode_on')
        window.localStorage.setItem('edition_mode', 'off')
      }
    })
  }
}