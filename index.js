exports.handler = function (event, context) {
  var request = event.request;

  if (request.type === 'LaunchRequest') {
    buildResponse({
      speechText: 'Welcome to the Greetings skill, where you can kindly greet your guests with my soothing voice.',
      repromptText: 'Who would you like to greet? You can say for example, say hello to John.',
      endSession: false
    });
  }
  else if (request.type === 'IntentRequest') {

  }
  else if (request.type === 'SessionEndedRequest') {

  }
  else {
    context.fail('Unknown intent type');
  }
};

function buildResponse(options) {
  var response = {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: options.speechText
      },
      shouldEndSession: options.endSession
    }
  };

    if (options.repromptText) {
      response.response.reprompt = {
        outputSpeech: {
          type: 'PlainText',
          text: options.repromptText
      }
    };
  }
  return response;
}
