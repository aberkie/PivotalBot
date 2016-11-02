var dotenv = require('dotenv');
var Botkit = require('botkit');
var tracker = require('pivotaltracker');
var moment = require('moment');
var utils = require('./utils');

dotenv.load();

var client = new tracker.Client(process.env.PIVOTAL_TOKEN);

var controller = Botkit.slackbot({
	json_file_store: 'db/',
    debug: false
});

var bot = controller.spawn({
    token: process.env.SLACK_TOKEN
}).startRTM();

controller.hears(['https://www.pivotaltracker.com/story/show/(.*)'], 'direct_message,direct_mention,mention,ambient', function(bot, message){
    
    var storyId = message.match[1];

    //for some reason, I think because the way Slack parses URLs, there's an extra character at the end of the match
    storyId = storyId.substring(0, storyId.length - 1);
    
    //Unfortunately, PT doesn't have a way to look up just a story, we need the project id too
    client.projects.all(function(error, projects) {
        if(error) {
            console.log(error);
        } else {
            for(i = 0; i < projects.length; i++) {
                client.project(projects[i].id).story(storyId).get(function(error, story) {
                    if(error) {
                        // console.log(error);
                    } else {

                        return bot.reply(message, {
                            attachments:[
                                {
                                    "fallback": story.name,
                                    "color" : utils.getColor(story.currentState),
                                    "title": story.name,
                                    "title_link": story.url,
                                    "fields": [
                                        {
                                            "title": "Status",
                                            "value": story.currentState,
                                            "short": true
                                        },
                                        {
                                            "title": "Description",
                                            "value": (story.description ? story.description.substring(0, 100) : ''),
                                            "short": false
                                        },
                                        {
                                            "title": "Last Updated",
                                            "value": moment().calendar(story.updatedAt)
                                        }
                                    ]
                                }
                            ]
                        });
                    }
                });
            }
        }
    });
});