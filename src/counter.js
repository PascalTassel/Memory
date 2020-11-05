class Counter {
  
  constructor(settings) {
    if(typeof settings === 'object') {
      for (let setting in settings) {
        this[setting] = settings[setting];
      }
    }
    this.elapsed_time =  0;
    
    // Display duration
    this.durationSecs.innerHTML = this.pad((this.duration * 6000) % 60);
    this.durationMins.innerHTML = this.pad(parseInt((this.duration * 6000) / 6000, 10));
  }

  // Display ellapsed time
  displayTime () {
    let time = this.getTime();
    this.countUpSecs.innerHTML = time.secs;
    this.countUpMins.innerHTML = time.mins;
  };
  
  // Format ellapsed time
  getTime () {
    let time = this.elapsed_time,
        tenths =  this.pad(parseInt(time % 100,10)),
        seconds = this.pad(parseInt(time / 100, 10)),
        mins = this.pad(parseInt(seconds / 60, 10)),
        secs = this.pad(parseInt(seconds % 60, 10));
        
    return {mins: mins, secs: secs, tenths: tenths};
  };

  // Format one digit to too digit
  pad (val) {
    return val > 9 ? val : `0${val}`;
  }
  
  // Start counter
  start () {
    var _this = this;
    // each 0.1 seconds
    this.interval = setInterval( function () {
      _this.elapsed_time ++;
      _this.displayTime();
    }, 10);
  }

  // Stop counter
  stop () {
    clearInterval(this.interval);
  };

  // Reset counter
  reset () {
    this.elapsed_time = 0;
    this.countUpSecs.innerHTML = '00';
    this.countUpMins.innerHTML = '00';
  }
};

// Export
module.exports = Counter;
