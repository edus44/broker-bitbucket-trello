'use strict'

const express = require('express')
const morgan = require('morgan')
const _ = require('lodash')
const fs = require('fs')
const bodyParser = require('body-parser')
const domainMiddleware = require('express-domain-middleware')

const parameters = require('./parameters')
const utils = require('./utils')

//HTTP app
const app = express()

//Catch async errors
app.use(domainMiddleware)

//Log request
app.use(morgan('dev'))

//Parses http body
app.use(bodyParser.json())

//Main controller
app.use(function(req,res){

    //Parse body
    var commits = utils.getCommitsFromBody(req.body);

    console.log('Found ',commits.length,'commits with',_.flatten(_.map(commits,'cards')).length,'cards');

    _.each( commits, commit => {

        //Create trello comment message
        var comment = '';
        comment += commit.date+'\n'
        comment += '['+commit.short+']('+commit.link+') '
        comment += '__'+commit.author+'__\n\n'
        comment += commit.message

        //Iterate cards
        _.each(commit.cards, card => {

            //Try to post comment in trello
            utils.postComment(card,comment,function(err,data){
                if (err){
                    console.log('-- Error posting',JSON.stringify(comment),'Error:',err.message);
                }else{
                    var board = data.data.board;
                    console.log('-- Posted OK',JSON.stringify(comment),'into board','['+board.shortLink+']',board.name);
                }
            })
        })
    })

    res.send('ok')
})

//Start listening
app.listen(parameters.listenPort,function(){
    console.log('listening '+parameters.listenPort);
})
