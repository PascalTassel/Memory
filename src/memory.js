const Card = require('./card.js');
const Counter = require('./counter.js');
const Progress = require('./progress.js');

class Memory {
  
  constructor(settings) {
    if(typeof settings === 'object') {
      for (let setting in settings) {
        this[setting] = settings[setting];
      }
    }
    this.counterSettings.duration = this.duration;
    this.cards = [];                                       // card game
    this.counter = new Counter(this.counterSettings);      // counter
    this.nb_visible_cards = 0;                            // nb visible's cards
    this.progress = new Progress(this.progressSettings);  // progress bar
    this.selected_cards = [];                             // current selected cards
    this.score = (this.duration * 6000);                  // score (max by default)
    this.isWin = false;                                   // game status
    
    // clone cards
    let n = 1;
    while (n < this.nb_occurences) {
      this.cards_values = this.cards_values.concat(this.cards_values);
      n ++;
    }
    
    // add cards to card game
    for (let i = 0; i < this.cards_values.length; i ++) {
      let value = this.cards_values[i],
          bg_position = `0px ${((this.bg_card_increment * -1) * i)}px`,
          card = new Card(value, bg_position);
          
      this.cards.push(card);
    }
    
    // launch game
    this.launch();
  }
  
  displayCards () {
    // mix card game
    this.cards.sort(() => Math.random() - 0.5);
    
    // create li elements contains card's back and front
    for (var i in this.cards) {
      let card = this.cards[i],
          li = document.createElement('li'),
          front = document.createElement('div'),
          back = document.createElement('div'),
          _this = this;
      front.classList.add('front');
      front.style.backgroundPosition = card.bg_position;
      back.classList.add('back');
      back.innerHTML = process.env.NODE_ENV === 'development' ? `<span class="card-value">${card.value}</span>` : '';
      li.appendChild(back);
      li.appendChild(front);
      
      // on click
      li.addEventListener ('click', function(e) {
        // get index
        let li = this,
            nodes = Array.from(li.closest('ul').children),
            i = nodes.indexOf(li),
            card = _this.cards[i];
        card.isFlipped = true;
        
        // is card clickable ?
        if (card.isClickable) {
          // disable clickable state
          card.isClickable = false;
          // flip card
          li.classList.add('is-flipped');
          // store card's value
          _this.selected_cards.push(card.value);
          // if stored cards number == number cards to find
          if(_this.selected_cards.length == _this.nb_occurences)
          {
            // Compare selected cards
            _this.checkFlippedCards();
          }
          
          return true;
        }
        
        // Sinon, inhibition de l'évènement clic
        return false;
      });
      //Ajout de l'élément à la liste
      this.elem.appendChild(li);
    }
  }
  
  // Compare selected cards
  checkFlippedCards () {
    var _this = this,
        isSame = _this.selected_cards[0] === _this.selected_cards[1];
    
    // Disable active cards
    for (let i in this.cards) {
      let li = this.elem.querySelectorAll('li')[i];
      if (isSame && this.cards[i].isFlipped) {
        this.cards[i].isActive = false;
        li.classList.add('blink');
      } else if (this.cards[i].isActive && (this.cards[i].isFlipped === false)) {
        li.classList.add('is-disabled');
      }
    }
    
    // if same cards
    if (isSame) {
      // update visible cards number
      this.nb_visible_cards += this.selected_cards.length;
      // if all cards are visible
      if (this.nb_visible_cards === this.cards.length) {
        this.isWin = true;
        // game over
        this.gameOver();
        return;
      }
    }
    
    // empty selected cards
    this.selected_cards = [];

    // flip actives cards
    setTimeout(function(){
      for (let i in _this.cards) {
        if (_this.cards[i].isActive) {
          _this.cards[i].isClickable = true;
          _this.cards[i].isFlipped = false;
          _this.elem.querySelectorAll('li')[i].classList.remove('is-flipped');
          _this.elem.querySelectorAll('li')[i].classList.remove('is-disabled');
        }
      }
    }, _this.visible_duration * 1000);
  };

  launch () {
    var _this = this;
    
    // display cards
    this.displayCards();
  
    // enable click on cards
    for (let i in this.cards) {
      this.cards[i].isClickable = true;
    }
    // launch counter
    this.counter.start();
    
    // check counter
    this.checkCounter = setInterval(function(){
      if(_this.counter.elapsed_time === (_this.duration * 6000)) {
        _this.gameOver();
      }
      // progress
      let width = ((_this.counter.elapsed_time + 1) / (_this.duration * 6000)) * 100;
      _this.progress.move(width);
    }, 10);
  }

  // Arrêt du jeu
  gameOver () {
    clearInterval(this.checkCounter);
    
    // stop counter
    this.counter.stop();
    
    // disable click on active's cards
    for (let i in this.cards) {
      if (this.cards[i].isActive) {
        this.cards[i].isClickable = false;
      }
    }
    
    // dispatch on game over
    this.score = this.counter.elapsed_time;
    let time = this.counter.getTime(),
        event = new CustomEvent('on game over', {'detail': {time: `${time.mins}:${time.secs}:${time.tenths}` }});
    this.elem.dispatchEvent(event);
  };

  replay () {
    this.elem.innerHTML = '';
    // Réinitialisation du compteur
    this.counter.reset();
    // Réinitialisation de la barre de progression
    this.progress.reset();
    // Initialisation du memory
    this.launch();
  };
};

// Export
module.exports = Memory;
