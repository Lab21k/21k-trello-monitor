'use strict';

const   fs     = require('fs'),
        data  = JSON.parse(fs.readFileSync(__dirname + '/../output.json')),
        _     = require('lodash');

let modulosKeys = Object.keys(data);
let regex = /([0-9]?[0-9]+h|[0-9]?[0-9]+m)/;

function _getTime(comments) {
    let time = 0;

    _.each(comments, (comment) => {
        let tempo = comment.match(regex);
        if (tempo != null) {
            if (tempo[0].indexOf('h') > -1) {
                tempo[0] = tempo[0].replace('h', '');
                time += parseInt(tempo[0]) * 60;
            } else if (tempo[0].indexOf('h') > -1) {
                tempo[0] = tempo[0].replace('m', '');
                time += parseInt(tempo[0]);
            }
        }
    });

    return time;
}

_.each(modulosKeys, (modulo) => {
    console.log('## ' + modulo + '##');
    let categoriasKeys = Object.keys(data[modulo]);

    _.each(categoriasKeys, (categoria) => {
        console.log('   ## ' + categoria + '##');
        let cards = data[modulo][categoria];
        _.each(cards, (card) => {
            let comments = _.map(card.card.comments, x => x.data.text);
            let time = _getTime(comments);
            console.log('       ' + card.card.name);
            if (time == null) {
                time = 0;
            }
            console.log('       TIME: ' + time);
        });
    });
});
