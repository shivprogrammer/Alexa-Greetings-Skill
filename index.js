'use strict';

var http = require('http');

exports.handler = function (event, context) {
  try {
    var request = event.request;

    if (request.type === 'LaunchRequest') {
      let options = {};
      options.speechText = 'Welcome to the Greetings skill, where you can kindly greet your guests with my soothing voice. Who would you like to greet?';
      options.repromptText = 'You can say for example, say hello to John.';
      options.endSession = false;
      context.succeed(buildResponse(options));
    }

    else if (request.type === 'IntentRequest') {
      let options = {};
      if (request.intent.name === 'HelloIntent') {
        let name = request.intent.slots.FirstName.value;
        options.speechText = 'Hello ' + name + '.';
        options.speechText += getWish();
        getQuote((quote, err) => {
          if (err) {
            context.fail(err);
          }
          else {
            options.speechText += quote;
            options.endSession = true;
            context.succeed(buildResponse(options));
          }
        });
      }
      else {
        throw 'Unknown intent';
      }
    }

    else {
      throw 'Unknown intent type';
    }
  } catch (err) {
    context.fail('Exception: ' + err);
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

function getWish() {
  var myDate = new Date();
  var hours = myDate.getUTCHours() - 8;
  if (hours < 0) {
    hours += 24;
  }

  if (hours < 12) {
    return ' Good Morning. ';
  }
  else if (hours < 18) {
    return ' Good Afternoon. ';
  }
  else {
    return ' Good Evenning. ';
  }
}

function getQuote(callback) {
  var url = 'http://api.forismatic.com/api/1.0/json?method=getQuote&lang=en&format=json';
  var req = http.get(url, (res) => {
    var body = '';

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      body = body.replace(/\\/g, '');
      var quote = JSON.parse(body);
      callback(quote.quoteText);
    });
  });

  req.on('error', (err) => {
    callback('', err);
  });
}
