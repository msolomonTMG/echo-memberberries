var echo = require('./echo')

module.exports = {
  handleIntent: echo.handleIntent,
  handleLaunch: echo.handleLaunch,
  handleSessionEnded: echo.handleSessionEnded
}
