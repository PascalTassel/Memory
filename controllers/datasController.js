var fs = require('fs');
var rawFile = './src/scores.json';

exports.get_scores = function(req, res) {
  fs.readFile(rawFile, 'utf8', (err, jsonString) => {
    if (err) {
      console.log('File read failed:', err)
      return
    }
    let scores = JSON.parse(jsonString);
    scores.sort(function(a, b){
      return a.score - b.score;
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(scores)); 
  });
};

exports.set_score = function(req, res) {
  
  fs.readFile(rawFile, 'utf8', (err, jsonString) => {
    if (err) {
      console.log('File read failed:', err)
      return
    }
    
    var scores = JSON.parse(jsonString);
    let d = new Date(),
        day = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`,
        player = {
          id: Object.keys(scores).length + 1,
          name: req.body.name,
          score: req.body.score,
          time: req.body.time,
          date: `${day}-${d.getMonth()+1}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
        };
    scores.push(player);
    
    fs.writeFile(rawFile, JSON.stringify(scores), 'utf8', (err) => {
      if (err) {
        console.log('File read failed:', err)
        return
      }
      
      scores.sort(function(a, b){
        return a.score - b.score;
      });
      
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(scores)); 
    });
  });
};

exports.get_rank = function(req, res) {
  let rawdata = fs.readFileSync(rawFile);
  var scores = JSON.parse(rawdata);
  var rank = scores.length + 1;
  scores.sort(function(a, b){
    return a.score - b.score;
  });
  for (let i in scores) {
    if (parseInt(req.params.score) < scores[i].score) {
      rank = (parseInt(i) + 1);
      break;
    }
  }
  res.send(rank.toString());
};
