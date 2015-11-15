'use strict';

const   Trello    = require('node-trello'),
        fs        = require('fs'),
        keys      = JSON.parse(fs.readFileSync(__dirname + '/../config.json')),
        board     = 'f8fRBNOM',
        async     = require('async');

let trelloKeys = keys.trello;
let trello = new Trello(trelloKeys.key, trelloKeys.secret);
let re = /\(([^()]+)\)/;

trello.get('/1/boards/' + board + '/cards', function(err, data) {
    if (err) {
        console.log(err);
        return;
    }

    let cardsModulos = {};
    let fnsGetComments = [];

    let cards = data.map((card) => {
        let match = card.name.match(re);
        card.regexMatch = match;
        return card;
    }).filter(card => card.regexMatch !== null);

    cards.forEach((card) => {
        let conteudo = card.regexMatch[1];
        let data = conteudo.split(' - ');
        let modulo = data[0];
        let categoria = data[1] ? data[1] : 'Não Definido';

        card.labels = card.labels.map(x => x.name);

        fnsGetComments.push((callback) => {
            console.log('Get comment');
            trello.get('/1/cards/' + card.id + '/actions', {
                'filter': 'commentCard'
            }, (err, data) => {
                card.comments = data;
                callback(err, data);
            });
        });

        if (cardsModulos.hasOwnProperty(modulo)) {
            if (cardsModulos[modulo].hasOwnProperty(categoria)) {
                cardsModulos[modulo][categoria].push({
                    card: card
                });
            } else {
                cardsModulos[modulo][categoria] = [{
                    card: card
                }];
            }
        } else {
            cardsModulos[modulo] = {};
            cardsModulos[modulo][categoria] = [{
                card: card
            }];
        }
    });

    async.series(fnsGetComments, (err, results) => {
        console.log(cardsModulos);
    });
});
