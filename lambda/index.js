/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const http = require('https');
var persistenceAdapter = getPersistenceAdapter();
// i18n library dependency, we use it below in a localisation interceptor
const i18n = require('i18next');
// We import a language strings object containing all of our strings.
// The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG')
const languageStrings = require('./localisation');
var options = {
  "method": "POST",
  "hostname": "api.razorpay.com",
  "port": null,
  "path": "/v1/invoices",
  "headers": {
    "content-type": "application/json",
    "authorization": "Basic cnpwX3Rlc3RfRVJwMmthbGFiWmgzMVk6NFBNTENIYnZqSUFPNGhtMnIxRkYzbmhI",
    "cache-control": "no-cache",
    "postman-token": "bdc479db-ad32-b467-752f-7f5b9bf762d2"
  }
};

function getPersistenceAdapter(tableName) {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET;
    }
    if (isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're using to run this lambda (via IAM policy)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({
            tableName: tableName || 'beauty_store',
            createTable: true
        });
    }
}
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
   async handle(handlerInput) {
        
        const speakOutput = handlerInput.t('WELCOME_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const amazonNoIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Thank you for using Beauty Store, Have a nice day.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const amazonResumeIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Please select from soap or shampoo ?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const InfoDetailsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'infoDetails';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        // the attributes manager allows us to access session attributes
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        
        
        const name = Alexa.getSlotValue(requestEnvelope, 'name');
        const mobile = Alexa.getSlotValue(requestEnvelope, 'mobile');
        const speakOutput = intent;
         if(name !== "" && mobile!==""){
            sessionAttributes['name'] = name;
            sessionAttributes['mobile'] = mobile; 
            
            return CheckoutIntentHandler.handle(handlerInput);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            // .reprompt(speakOutput)
            .getResponse();
    }
};

const OrderShampooIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'orderShampoo';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        // the attributes manager allows us to access session attributes
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        const shampooBrandSlot = Alexa.getSlot(requestEnvelope, 'shampooBrand');
        const shampooBrand = shampooBrandSlot.value
        
        const shampooSizeSlot = Alexa.getSlot(requestEnvelope, 'shampooSize');
        const shampooSize = shampooSizeSlot.value;
        // we get the slot instead of the value directly as we also want to fetch the id
        const shampooQuantitySlot = Alexa.getSlot(requestEnvelope, 'shampooQuantity');
        const shampooQuantity = shampooQuantitySlot.value;

        if(shampooBrand !== "" && shampooSize!=="" && shampooQuantity!=="" ){
       
            sessionAttributes['shampooBrand'] = shampooBrand;
            sessionAttributes['shampooSize'] = shampooSize;
            sessionAttributes['shampooQuantity'] = shampooQuantity;
            
            return CheckoutIntentHandler.handle(handlerInput);
        }  
        return handlerInput.responseBuilder
            // .speak(speakOutput)
            // .reprompt(speakOutput)
            .getResponse();
    }
};

const CheckoutIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckoutIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const name = sessionAttributes['name'];
        const mobile = sessionAttributes['mobile']; 
        const shampooBrand = sessionAttributes['shampooBrand'];
        const shampooSize = sessionAttributes['shampooSize'];
        const shampooQuantity = sessionAttributes['shampooQuantity'];
        let speakOutput = ''
        //const info = name && mobile;
        // if(info){
        //     const order = shampooBrand && shampooSize && shampooQuantity;
        //     if(order){
        //          speakOutput = 'Please pay using the Payment Link send on your registered mobile number.'
        //     }else {
        //         speakOutput += handlerInput.t('MISSING_ORDER_MSG');
        //         // we use intent chaining to trigger the birthday registration multi-turn
        //         // handlerInput.responseBuilder.addDelegateDirective({
        //         //     name: 'OrderShampooIntentHandler',
        //         //     confirmationStatus: 'NONE',
        //         //     slots: {}
        //         // });
        //     }
        // }else {
        //     speakOutput += handlerInput.t('MISSING_INFO_MSG');
        //     // we use intent chaining to trigger the birthday registration multi-turn
        //     // handlerInput.responseBuilder.addDelegateDirective({
        //     //     name: 'InfoDetailsIntentHandler',
        //     //     confirmationStatus: 'NONE',
        //     //     slots: {}
        //     // });
        // }
        
        var req = http.request(options, function (res) {
        var chunks = [];
        
          res.on("data", function (chunk) {
            chunks.push(chunk);
          });
        
          res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
          });
        });
        
        req.write(JSON.stringify(
            { 
                type: 'invoice',
            description: 'Invoice for the month of January 2020',
          partial_payment: true,
          customer: 
           { name: name,
             contact: 8446402303, //mobile,
            email: 'rohit@yopmail.com',
             billing_address: 
              { line1: 'Ground & 1st Floor, SJR Cyber Laskar',
                line2: 'Hosur Road',
                zipcode: '560068',
                city: 'Bengaluru',
                state: 'Karnataka',
                country: 'in' },
             shipping_address: 
              { line1: 'Ground & 1st Floor, SJR Cyber Laskar',
                line2: 'Hosur Road',
                zipcode: '560068',
                city: 'Bengaluru',
                state: 'Karnataka',
                country: 'in' } },
          line_items: 
           [ 
               { 
                   name: shampooBrand,
                   description:shampooQuantity +" of "+ shampooBrand + shampooSize ,
                   amount: 39900,
                   currency: 'INR',
                   quantity: shampooQuantity 
                   
               } 
           ],
          sms_notify: 1,
          email_notify: 1,
          currency: 'INR',
          expire_by: 4589765167 }));
          req.end();

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Thank you for using Beauty Store, Have a nice day.!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Please try again.You can try by saying, open online beauty store';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
         const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        // Any cleanup logic goes here.
        // delete sessionAttributes['name'];
        // delete sessionAttributes['mobile'];
        // delete sessionAttributes['shampooBrand'];
        // delete sessionAttributes['shampooQuantity']
        // delete sessionAttributes['shampooSize']
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = ``;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the handlerInput
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings
        }).then((t) => {
            handlerInput.t = (...args) => t(...args);
        });
    }
};

/* *
 * Below we use async and await ( more info: javascript.info/async-await )
 * It's a way to wrap promises and waait for the result of an external async operation
 * Like getting and saving the persistent attributes
 * */
const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        if (Alexa.isNewSession(requestEnvelope)){ //is this a new session? this check is not enough if using auto-delegate (more on next module)
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            console.log('Loading from persistent storage: ' + JSON.stringify(persistentAttributes));
            //copy persistent attribute to session attributes
            attributesManager.setSessionAttributes(persistentAttributes); // ALL persistent attributtes are now session attributes
        }
    }
};

// If you disable the skill and reenable it the userId might change and you loose the persistent attributes saved below as userId is the primary key
const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        if (!response) return; // avoid intercepting calls that have no outgoing response due to errors
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession); //is this a session end?
        if (shouldEndSession || Alexa.getRequestType(requestEnvelope) === 'SessionEndedRequest') { // skill was stopped or timed out
            // we increment a persistent session counter here
            sessionAttributes['sessionCounter'] = sessionAttributes['sessionCounter'] ? sessionAttributes['sessionCounter'] + 1 : 1;
            // we make ALL session attributes persistent
            console.log('Saving to persistent storage:' + JSON.stringify(sessionAttributes));
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        amazonNoIntent,
        amazonResumeIntent,
        InfoDetailsIntentHandler,
        OrderShampooIntentHandler,
        CheckoutIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
        .addErrorHandlers(ErrorHandler)
        .addRequestInterceptors(
        LocalisationRequestInterceptor,
        LoggingRequestInterceptor,
        LoadAttributesRequestInterceptor)
        .addResponseInterceptors(
        LoggingResponseInterceptor,
        SaveAttributesResponseInterceptor)
        .withPersistenceAdapter(persistenceAdapter)
        .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();