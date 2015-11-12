'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    cheerio = require("cheerio"),
    request = require("request"),
    validators = require('mongoose-validators');


/**
 * Page Schema
 */
var PageSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    url: {
        type: String,
        default: '',
        trim: true,
        required: 'Url cannot be blank',
        validate: validators.isURL({require_protocol: true, message: "Url must be a valid url such as 'http://www.wordler.com'"})
    },
    host: {
        type: String,
        default: ''
    },
    note: {
        type: String,
        default: '',
        trim: true
    },
    words: {
        type: Object
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

var scrapeWords = function(host, scraper, body) {
    var $page = scraper.load(body),
        corpus = {},
        staging = {},
        words = [],
        text = $page("p").text();
    //[(\s\s+)/_/-\/]

    text = text.replace(host, '') //delete host name
        .replace(/[^a-zA-Z ]/g, " ")//replace non-alpha with space
        .replace(/\s+/g, ' ')//Singlify multiple whitespaces
        .toLowerCase();

    text.split(" ").forEach(function (word) {
        // We don't want to include very short or long words because they're
        // probably bad data.
        if (word.length > 20 || word.length < 3) {
            return;
        }
        if(staging[word]) {
            if (corpus[word]) {
                corpus[word]++;
            } else {
                corpus[word] = 2;
            }
        } else {
            staging[word] = 1;
        }

    });
    for (var prop in corpus) {
        var kvp = {
            k : prop,
            v : corpus[prop]
        };
        words.push(kvp);
    }

    return JSON.stringify(words);
};

PageSchema.pre('save', function (next) {
    var self = this;
    request(this.url, function (error, response, body) {
        if(error || response.statusCode !== 200){
            console.log("We’ve encountered an error: " + error);
        } else {
            self.host =  response.request.uri.host;
            self.words = scrapeWords(self.host, cheerio, body);
            next();
        }
    });
});

//pageSchema.index({created: 1, url: 1}, {unique: true});
mongoose.model('Page', PageSchema);
