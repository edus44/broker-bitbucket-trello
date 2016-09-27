'use strict';

const Trello = require('node-trello');
const _ = require('lodash')
const trim = require('trim')
const moment = require('moment')

//Initialize trello service
const parameters = require('./parameters')
const trello = new Trello( parameters.trelloApiKey, parameters.trelloApiToken );


/**
 * Post a comment in a trello card
 * @param  {String}   card Trello cardId
 * @param  {String}   text Comment message
 * @param  {Function} cb   
 * @return {Void}        
 */
exports.postComment = function(card,text,cb){
    trello.post('/1/cards/'+card+'/actions/comments',{text:text}, cb);
}


/**
 * Parses a bitbucket webhook body and returns a commit summary
 * Also finds trello cards references in commit message
 * Supports commits like 'fixing this one [cardId0] and this three [cardId1,cardId2,cardId3]'
 */
exports.getCommitsFromBody = function(body){
    if (!_.get(body,'push.changes[0].commits')){
        return []
    }

    let commits = _.flatten(_.map(_.get(body,'push.changes'),'commits'))
    
    return _.map(commits,(commit)=>{

        var cards = []

        var match = commit.message.match(/\[(.*?)\]/g)
        if (match && match.length){
            cards =_.flatten(_.map(match,(m)=>{
                //Matchs `[cardId]` and `[cardId,cardId]`
                return m.slice(1,-1).split(',');
            }))
        }
        return {
            type:commit.type,
            date:moment(commit.date).format('DD MMM YYYY HH:mm ZZ'),
            author : commit.author.user.username,
            message:trim(commit.message),
            hash:commit.hash,
            cards : cards,
            short:commit.hash.slice(0,7),
            link:commit.links.html.href,
        }
    })
}