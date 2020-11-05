class Alert {
  
  constructor (settings) {
    if(typeof settings === 'object') {
      for (let setting in settings) {
        this[setting] = settings[setting];
      }
    }
    
    this.buttons = [
      {action: 'Replay', label: 'Rejouer'},
      {action: 'Rank', label: 'Enregistrer mon score'}
    ];
    
    var _this = this;
    for (i in this.buttons) {
      this.[`btn${this.buttons[i].action}`] = document.createElement('button');
      this.[`btn${this.buttons[i].action}`].setAttribute('type', 'button');
      this.[`btn${this.buttons[i].action}`].textContent = this.buttons[i].label;
      this.[`btn${this.buttons[i].action}`].classList.add('hide');
      this.footer.appendChild(this.['btn' + this.buttons[i].action]);
    }
    this.btnRank.onclick = function (e) {
      let name = _this.body.querySelector('input').value;
      let event = new CustomEvent('on set name', {'detail': {name: name}});
      _this.body.dispatchEvent(event);
      _this.hide();
    };
    this.btnReplay.onclick = function (e) {
      let event = new CustomEvent('on replay', {'detail': {}});
      _this.body.dispatchEvent(event);
      _this.hide();
    };
  }
  
  // Hide alert
  hide () {
    this.overlay.classList.remove('show');
    this.elem.className = '';
    this.body.innerHTML = '';
    for (i in this.buttons) {
      this.['btn' + this.buttons[i].action].classList.add('hide');
    }
  }

  // Append content and show alert
  show (content) {
    this.body.innerHTML = content;
    this.overlay.classList.add('show');
  }

  // Get player's name
  rank (time, rank) {
    let content = `<p>Félicitations, vous avez gagné !<br>Votre temps est de <strong>${time}</strong>.</p>` + 
                  `<p>Vous occupez la <strong>${rank + (rank == 1 ? 'ère' : 'ème')}</strong> place du classement&nbsp;!</p>` + 
                  `<p><input type="text" name="pseudo" placeholder="Votre pseudo"></p>`;
    
    this.btnRank.classList.remove('hide');
    this.elem.classList.add('rank');
    
    this.show(content);
  }

  // On loose 
  loose () {
    let content = `<p>Désolé, le temps imparti est écoulé !</p>`;

    this.btnReplay.classList.remove('hide');
    this.elem.classList.add('loose');
    
    this.show(content);
  }

  // Display highest's scores
  scores (scores) {
    let content = `<h1>Meilleurs scores</h1>` +
                  `<table>` +
                    `<tbody>`;
                    for (let i in scores) {
                      content  += `<tr>` +
                                    `<td class="rank">${parseInt(i) + 1}</td>` +
                                    `<td class="player"><strong>${scores[i].name}</strong></td>` +
                                    `<td class="date">${scores[i].date.split(' ')[0]} <small>${scores[i].date.split(' ')[1]}</small></td>` +
                                    `<td class="score"><strong>${scores[i].time}</strong></td>` +
                                  `</tr>`;
                    };
                    content +=
                    `</tbody>` +
                  `</table>`;
    
    this.btnReplay.classList.remove('hide');
    this.elem.classList.add('scores');
    
    this.show(content);
  }

};

// Export
module.exports = Alert;
