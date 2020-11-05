/* CSS */
require('./scss/memory.scss');

/* JS */
const Alert = require('./alert.js');
const Datas = require('./datas.js');
const Memory = require('./memory.js');

const settings = {
  alert : {
    overlay: document.querySelector('#overlay'),
    elem: document.querySelector('#alert'),
    body: document.querySelector('.alert-body'),
    footer: document.querySelector('.alert-footer')
  },
  memory : {
    // game duration (minutes)
    duration: 10,
    // card's bg posx increment (px)
    bg_card_increment: 100,
    // card's values, order same as ./public/im/cards.png img
    cards_values: ['red apple', 'banana', 'orange', 'green lemon', 'pomegranate', 'apricot', 'yellow lemon', 'strawberry', 'green apple', 'peach', 'grapes', 'watermelon', 'plum', 'pear', 'red cherries', 'raspberry', 'mango', 'yellow cherries'],
    // cardgame element
    elem: document.querySelector('#cards'),
    // card's number to find for score
    nb_occurences: 2,
    // card's visibility duration when flipped (seconds)
    visible_duration: 2,
    // counter elements
    counterSettings: {
      countUpMins: document.querySelector('#count-up').querySelector('.mins'),
      countUpSecs: document.querySelector('#count-up').querySelector('.secs'),
      durationMins: document.querySelector('#duration').querySelector('.mins'),
      durationSecs: document.querySelector('#duration').querySelector('.secs')
    },
    // progress bar
    progressSettings: {
      bar: document.querySelector('.bar')
    }
  },
  // highest's scores number to display when game over
  rankingLimit: 5
};

const alert = new Alert(settings.alert);
const game = new Memory(settings.memory);

// game events
game.elem.addEventListener('on game over', function (e) {
    if(game.isWin === false) {
      alert.loose();
    } else {
      let time = e.detail.time;
      let score = game.score;
      let request = new XMLHttpRequest();
      request.open('GET', `datas/rank/${score}`, true);
      request.responseType = 'text';
      request.onload = function() {
        alert.rank(time, request.responseText);
      }
      request.send();
    }
  }, false
);

// alert events
alert.body.addEventListener('on set name', function (e) {
    let time = game.counter.getTime();
    let datas = {
      name: e.detail.name.trim() !== '' ? e.detail.name.trim() : '-',
      score: game.score,
      time: `${time.mins}:${time.secs}:${time.tenths}`
    };
    request = new XMLHttpRequest();
    request.open('POST', 'datas', true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.responseType = 'json';
    request.onload = function() {
      let scores = request.response.slice(0, settings.rankingLimit);
      alert.scores(scores);
    }
    request.send(JSON.stringify(datas));
  }, false
);

alert.body.addEventListener('on replay', function (e) {
    game.replay();
  }, false
);
