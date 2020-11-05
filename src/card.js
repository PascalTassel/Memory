class Card {
  
  constructor(value, bg_position) {
    this.bg_position = bg_position; // card's background-position;
    this.value = value;             // card's value
    this.isActive = true;           // card's state
    this.isClickable = false;       // clickable card's state
    this.isFlipped = false;         // card flipped
  }
};

// Export
module.exports = Card;
