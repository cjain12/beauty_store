module.exports = {
    en: {
        translation: {
            POSITIVE_SOUND: `<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_02'/>`,
            GREETING_SPEECHCON: `<say-as interpret-as="interjection">bravo</say-as>`,
            DOUBT_SPEECHCON: `<say-as interpret-as="interjection">hmm</say-as>`,
            
            WELCOME_MSG: `Welcome to JKT e catalogue system. I need to capture some basic details. Please say ready if you are okay else say cancel ? `,
            //WELCOME_BACK_MSG: 'Welcome back {{name}}! ',
            
            REJECTED_MSG: 'No problem. Please say the date again so I can get it right.',
            DAYS_LEFT_MSG: `{{name}} There's {{count}} day left `,
            DAYS_LEFT_MSG_plural: '{{name}} There are {{count}} days left ',
            WILL_TURN_MSG: `until you're {{count}} year old. `,
            WILL_TURN_MSG_plural: `until you're {{count}} years old. `,
            GREET_MSG: '$t(POSITIVE_SOUND) $t(GREETING_SPEECHCON) {{name}}. ',
            NOW_TURN_MSG: `You're now {{count}} year old! `,
            NOW_TURN_MSG_plural: `You're now {{count}} years old! `,
            
            MISSING_INFO_MSG:`$t(DOUBT_SPEECHCON). It looks like you haven't filled your Info Details. Please say ready if you are okay else say cancel ?`,
            MISSING_ORDER_MSG: `It looks like you haven't completed your order before Checkout.'Please select from soap or shampoo ?`,
            
            POST_SAY_HELP_MSG: `If you want to change the date, try saying, register my birthday. You can also try to set up a reminder for your birthday or check today's birthdays. What would you like to do next? `,
            HELP_MSG: 'I can remember your birthday if you tell me the date. I can also tell you the remaining days until your next birthday. Or allow you to set up a reminder for your birthday. Finally I can tell you whose birthday is it today. Which one would you like to try? ',
            REPROMPT_MSG: `If you're not sure what to do next try asking for help. If you want to leave just say stop. What would you like to do next? `,
            GOODBYE_MSG: ['Goodbye {{name}}! ', 'So long {{name}}! ', 'See you later {{name}}! ', 'Cheers {{name}}! '],
            REFLECTOR_MSG: 'You just triggered {{intent}}',
            FALLBACK_MSG: `Sorry, I don't know about that. Please try again.`,
            ERROR_MSG: 'Sorry, there was an error. Please try again.',
            NO_TIMEZONE_MSG: `I can't determine your timezone. Please check your device settings and make sure a timezone was selected. After that please reopen the skill and try again!`,
            REMINDER_CREATED_MSG: '{{name}} your reminder has been created successfully. ',
            REMINDER_ERROR_MSG: 'Sorry, there was an error creating the reminder. ',
            UNSUPPORTED_DEVICE_MSG: `This device doesn't support this operation. `,
            CANCEL_MSG: `Ok. Let's cancel that. `,
            MISSING_PERMISSION_MSG: `It looks like you haven't granted permissions for reminders. I have just sent you a card to your Alexa app so you can quickly enable this. `,
            POST_REMINDER_HELP_MSG: `If you want to know when your reminder will trigger, you can say, how many days until my birthday. Or maybe you prefer to check for today's birthdays. What would you like to do next?`,
            API_ERROR_MSG: `I'm sorry, I'm having trouble accessing the external A.P.I., Please try again later. `,
            PROGRESSIVE_MSG: 'Let me check other birthdays {{name}}. ',
            CONJUNCTION_MSG: ' and ',
            TURNING_YO_MSG: ' turning {{count}}',
            CELEBRITY_BIRTHDAYS_MSG: `These are today's birthdays: `,
            ALSO_TODAY_MSG: 'Also celebrating their birthday today are: ',
            POST_CELEBRITIES_HELP_MSG: 'Maybe you can now check how many days are left until your birthday. And remember that you can also create a reminder for it. What would you like to do next? ',
            POST_CELEBRITIES_APL_HELP_MSG: 'You can try tapping on each celebrity to get more information. Or maybe you can check how many days are left until your birthday. What would you like to do next? ',
            LAUNCH_HEADER_MSG: 'Happy Birthday',
            LAUNCH_HINT_MSG: ['how many days until my birthday?', 'which celebrities have birthdays today?', 'set up a reminder for my birthday', 'register my birthday'],
            LIST_HEADER_MSG: `Today's Birthdays`,
            LIST_HINT_MSG: 'who was born today?',
            LIST_YO_ABBREV_MSG: '{{count}} year old',
            LIST_YO_ABBREV_MSG_plural: '{{count}} years old',
            LIST_PERSON_DETAIL_MSG: `{{person.humanLabel.value}} was born {{person.date_of_birth.value}} ago in {{person.place_of_birthLabel.value}}. `,
            POST_TOUCH_HELP_MSG: `Try tapping on other celebrities to get more information. If you're done, you can try to check on the remaining days until your birthday, or set a reminder for it. What would you like to do?`
        }
    }
}