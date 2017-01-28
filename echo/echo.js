'use strict';

var memories = [
  "chewbacca", "AT-ATs", "Ghostbusters", "Slimer", "Stormtroopers", "The Fugitive",
  "Akira", "Alien Nation", "Explorers", "The Millennium Falcon", "Tri-corders",
  "Bionic Man", "Feeling safe", "Spock", "Cloud City", "Robocop", "The Terminator",
  "The Rancor", "Boba Fett"
]

var helpers = {
  getNewMemory: function() {
    return new Promise(function(resolve, reject) {
      console.log('getting memory')
      //TODO: make sure that the user can't get the same random memory in the same session
      return resolve (memories[Math.floor(Math.random() * memories.length)])
    })
  },
  formatResponse: function(respData, echoData) {
    return new Promise(function(resolve, reject) {

      let isSessionOver = respData.endSession || false

      return resolve({
        version: 1.0,
        sessionAttributes: {
          sessionId: echoData.session.sessionId,
          application: echoData.session.application,
          user: echoData.session.user
        },
        response: {
          shouldEndSession: isSessionOver,
          outputSpeech: {
            type: "SSML",
            ssml: "<speak>" + respData.speech + "</speak>"
          }
        }
      })
    })
  }
}

var functions = {
  handleRequest: function(echoData) {
    return new Promise(function(resolve, reject) {
      let intent = echoData.request.intent
      let responseData = {}
      switch(intent.name) {
        case 'AskIfMember':
          let usersMemory = echoData.request.intent.slots.Thing.value
          helpers.getNewMemory().then(memory => {
            responseData.speech = "Oh I member " + usersMemory + ". Member " + memory + "?"
            helpers.formatResponse(responseData, echoData).then(response => {
              console.log(response)
              return resolve(response)
            }).catch(err => {
              return reject(err)
            })
          })
          break;
      }
    })
  }
}

module.exports = functions;
