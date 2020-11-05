class Datas {
  
  constructor (url, limit) {
    this.limit = rankingLimit;
    this.scores = [];
    this.url = url;
    
    var _this = this;
    var request = new XMLHttpRequest();
    request.open('GET', this.url);
    request.responseType = 'json';
    request.onload = function() {
      _this.scores = request.response;
      _this.scores.sort(function(a, b){
        return a.seconds - b.seconds;
      });
      console.log(_this.scores);
    }
    request.send();
  }
};

// Export
module.exports = Datas;
