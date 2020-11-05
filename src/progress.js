class Progress {
  
  constructor(settings) {
    if(typeof settings === 'object') {
      for (let setting in settings) {
        this[setting] = settings[setting];
      }
    }
  }

  move (width) {
    // Report de la valeur sur la largeur de l'élément du DOM
    this.bar.style.width = `${width}%`;
  }

  // Réinitialisation de la barre de progression
  reset () {
    this.bar.removeAttribute('style');
  }
};

// Export
module.exports = Progress;
