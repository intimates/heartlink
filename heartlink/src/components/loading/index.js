require('insert-css')(require('./style.css'))

module.exports = {
  template: require('./template.html'),
  replace: true,
}
