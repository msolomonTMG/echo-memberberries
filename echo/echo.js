'use strict';

var memories = [
  "chewbacca", "AT-ATs", "Ghostbusters", "Slimer", "Stormtroopers", "The Fugitive",
  "Akira", "Alien Nation", "Explorers", "The Millennium Falcon", "Tri-corders",
  "Bionic Man", "Feeling safe", "Spock", "Cloud City", "Robocop", "The Terminator",
  "The Rancor", "Boba Fett", "Sandlot", "ice cream trucks", "when america was great",
  "Captain Kirk", "the original gameboy", "sonic the hedgehog", "dreamcast",
  "duck hunt", "super mario brothers on nintendo", "princess leia", "when luke blew up the death star",
  "back to the future", "Indiana Jones", "the Temple of Doom", "Raiders of the Lost Ark",
  "E.T. the extra terrestrial", "link from Zelda", "the long cinematic scenes from Final Fantasy?",
  "Tony Hawk's pro skater 2", "the ewoks from Endor", "John Connor from the Terminator",
  "Top Gun", "When goose got shot down in Top Gun", "when Michael Keaton was batman",
  "Wendy Peppercorn from the Sandlot", "when weed wasn't so strong", "Golden eye",
  "making mix tapes on cassettes", "Napster", "Limewire", "Bear share", "Metal Gear Solid",
  "Space Balls", "Honey I Shrunk the Kids", "Home Improvement", "The Godfather Part 2",
  "Angry Beavers", "Ren and Stimpy", "Rocko's Modern Life", "Lando Calrissian",
  "Die Hard with Bruce Willis", "Hans Gruber from Die Hard", "Beverly Hills Cop with Eddy Murphy",
  "Chips? That show with the California police on motorcycles", "The Nutty Professor 2",
  "The Chappelle Show", "when nobody watched the UFC", "when George Lucas ruined everything in 1999?",
  "oregon trail", "pacman", "pinball machines",
  "when there would be a guy at the arcade who was way better than you at dance dance revolution",
  "when Ross cheated on Rachel but they were actually on a break", "Summer Sanders from Nickelodeon",
  "when you enjoyed Adam Sandler movies",
]

var helpers = {
  getNewMemory: function() {
    return new Promise(function(resolve, reject) {
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
  handleIntent: function(echoData) {
    return new Promise(function(resolve, reject) {
      let intent = echoData.request.intent
      let responseData = {}
      switch(intent.name) {
        case 'AskIfMember':
          let userMemory = echoData.request.intent.slots.userMemory.value
          let agreementSpeechChoices = ["Oh I member ", "Oh I love "]
          let agreementSpeech = agreementSpeechChoices[Math.floor(Math.random() * agreementSpeechChoices.length)]

          helpers.getNewMemory().then(memory => {
            responseData.speech = agreementSpeech + userMemory + ". Member " + memory + "?"
            helpers.formatResponse(responseData, echoData).then(response => {
              return resolve(response)
            }).catch(err => {
              return reject(err)
            })
          })
          break;
        case 'TellMemory':
          helpers.getNewMemory().then(memory => {
            responseData.speech = "Member " + memory + "?"
            helpers.formatResponse(responseData, echoData).then(response => {
              return resolve(response)
            }).catch(err => {
              return reject(err)
            })
          })
          break;
        case 'AMAZON.StopIntent':
          responseData.endSession = true
          responseData.speech = "" // don't say anything
          helpers.formatResponse(responseData, echoData).then(response => {
            return resolve(response)
          }).catch(err => {
            return reject(err)
          })
          break;
        case 'AMAZON.HelpIntent':
          responseData.speech = "We are the member berries. Ask us if we member things from the past. Like, do you member chewbacca?"
          helpers.formatResponse(responseData, echoData).then(response => {
            return resolve(response)
          }).catch(err => {
            return reject(err)
          })
          break;
      }
    })
  },
  handleLaunch: function(echoData) {
    return new Promise(function(resolve, reject) {
      let responseData = {}
      let audoFiles = ["bionic_man", "chewbacca_again", "ghostbusters", "slime_man"]
      let randomAudioFile = audoFiles[Math.floor(Math.random() * audoFiles.length)]
      helpers.getNewMemory().then(memory => {
        responseData.speech = "<audio src='https://echo-memberberries.herokuapp.com/audio/" + randomAudioFile + ".mp3' /> " + memory + "?"
        helpers.formatResponse(responseData, echoData).then(response => {
          return resolve(response)
        }).catch(err => {
          return reject(err)
        })
      }).catch(err => {
        return reject(err)
      })
    })
  },
  handleSessionEnded: function(echoData) {
    return new Promise(function(resolve, reject) {
      let responseData = {}
      responseData.endSession = true
      responseData.speech = "" // don't say anything
      helpers.formatResponse(responseData, echoData).then(response => {
        return resolve(response)
      }).catch(err => {
        return reject(err)
      })
    })
  }
}

module.exports = functions;
