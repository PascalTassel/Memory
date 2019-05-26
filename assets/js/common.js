const $app = {
  'dev_mode' :          false            // Permet d'afficher la valeur au dos des cartes
};

const $memory = {
  'duration' :          600,            // Temps imparti (en secondes)
  'visible_duration' :  2,              // Durée de visibilité d'une carte avant son retournement (en secondes)
  'elem' :              '#cards',       // Élément du DOM contenant les cartes
  'flip_duration' :     500,            // Durée de l'animation CSS lorsque la carte se retourne - valeur identique à celle définie dans le CSS sur l'élément <li> (en millisecondes)
  'nb_cards' :          18,             // Nombre initial de cartes
  'cards_values' :                      // Valeur des cartes (déclarées selon l'ordre défini dans assets/cards.png)
  ['red apple', 'banana', 'orange', 'green lemon', 'pomegranate',
    'apricot', 'yellow lemon', 'strawberry', 'green apple', 'peach',
    'grapes', 'watermelon', 'plum', 'pear', 'red cherries', 'raspberry',
    'mango', 'yellow cherries'],
  'bg_card_increment' : 100,            // incrémentation de l'image de fond (en pixels)
  'nb_occurences' :     2               // Nombre de cartes identiques à retourner pour scorer
};

const $counter = {
  'count_up_elem' :     '#count-up',    // Élément du DOM correspondant au temps écoulé
  'duration_elem' :     '#duration',    // Élément du DOM correspondant au temps imparti
  'elapsed_time' :      0               // Temps écoulé
};

const $progress = {
  'elem' :              '.bar'         // Élément du DOM correspondant à la barre de progression
};

const $alert = {
  'elem' :              '#alert',     // Élément du DOM correspondant à l'alerte
  'display_ranking' :   true         // Affichage des meilleurs scores en début de partie
};

const $datas = {
  'path' :              'datas.php',  // Chemin d'accès au fichier de récupération des données
  'ranking_limit' :     5             // Nombre de résultats à afficher dans le tableau des meilleurs scores
}

// =========================================
// memory
// =========================================

// Initialisation du Memory
$memory.init = function(){
  // Affichage du temps imparti
  $counter.init();
  // Initialisation du tableau dans lequel seront stockées temporairement les valeurs des dernières cartes retournées
  this.selected_cards = [];
  // Nombre de cartes visibles
  this.nb_visible_cards = 0;
  // Tableau dans lequel seront insérées les cartes
  var $cards = [];
  // Création des cartes
  for(var $i = 0; $i < this.nb_cards; $i ++){
    // Création d'un objet carte avec ses paramètres
    var $card = {
      'value' :       this.cards_values[$i],                // Valeur de la carte
      'bg_position' : '0px ' + ((this.bg_card_increment * -1) * $i) + 'px' // Ajustement vertical de l'image d'arrière-plan
    };
    // Ajout de la carte dans le tableau des cartes
    $cards.push($card);
  }
  // Duplication de l'ensemble des cartes en fonction du paramètre nb_occurences
  var $n = 1;
  while($n < this.nb_occurences){
    $cards = $cards.concat($cards);
    $n ++;
  }
  // Mélange des cartes
  $cards.sort(() => Math.random() - 0.5);
  // Appel de la fonction d'affichage des cartes
  this.display_cards($cards);
};

// Affichage des cartes
$memory.display_cards = function($cards){
  // Création d'une carte à partir d'un élément <li> puis ajout dans l'élément <ul#cards>
  for(var $i = 0; $i < $cards.length; $i ++){
    $('<li>')
    .append(
      '<div class="back">' + ($app.dev_mode ? $cards[$i].value : '') + '</div>' + // Face cachée au dessus
      '<div class="front" style="background-position:' + $cards[$i].bg_position + '"></div>' // Face illustrée au dessous
    )
    .data({
      'value' :         $cards[$i].value,     // Valeur de la carte
      'is_clickable' :  false,                // État cliquable de la carte
      'is_active' :     true                  // État actif de la carte
    })
    // Au clic sur la carte
    .on('click', function(){
      // Si l'élément est cliquable
      if($(this).data('is_clickable')){
        // Désactivation de l'état clickable de la carte
        $(this).data('is_clickable', false);
        // Affichage de la carte via la classe .is-flipped
        $(this).addClass('is-flipped');
        // Ajout de la valeur de la carte dans le tableau des cartes cliquées
        $memory.selected_cards.push($(this).data('value'));
        // Si le nombre de cartes cliquées est atteint
        if($memory.selected_cards.length == $memory.nb_occurences)
        {
          // Comparaison de la valeur des cartes
          $memory.check_flipped_cards();
        }
      // Sinon, inhibition de l'évènement clic
      }else{
          return false;
      }
    })
    //Ajout de l'élément à la liste
    .appendTo(this.elem);
  }
  // Affichage des meilleurs scores ?
  if($alert.display_ranking){
    // Appel de la récupération des meilleurs scores
    $datas.get_ranking();
  // Sinon, lancement de la partie dès maintenant
  }else{
    $memory.start();
  }
};

// Comparaison de la valeur des cartes dernièrement retournées
$memory.check_flipped_cards = function(){
  // Désactivation temporaire du clic sur les cartes
  $($memory.elem).find('li').filter(function(){
    return $(this).data('is_clickable') == true;
  })
  .data('is_clickable', false)
  .addClass('is-disabled');
  // Délai permettant d'attendre le retournement complet de la carte avant traitement
  setTimeout(function(){
    // Vérification si les cartes ont toutes la même valeur
    var $is_same = $memory.selected_cards.join('') == $memory.selected_cards[0].repeat($memory.selected_cards.length);
    // Si les cartes ont la même valeur
    if($is_same){
      // Définition des cartes de même valeur comme découvertes
      $($memory.elem).find('li').filter(function(){
        return $(this).data('value') == $memory.selected_cards[0];
      })
      .data({
        'is_active' : false
      })
      .addClass('blink');

      // Incrémentation du nombre de cartes visibles
      $memory.nb_visible_cards += $memory.selected_cards.length;

      // Si les cartes sont toutes visibles
      if($memory.nb_visible_cards == ($memory.nb_cards * $memory.nb_occurences)){
        // Compensation de l'incrémentation du compteur qui continue de tourner
        $counter.elapsed_time --;
        // Invocation de la fin du jeu
        $memory.end(true);
        // Arrêt de l'éxécution de la fonction
        return;
      }
    }
    // On vide ensuite le tableau temporaire des dernières cartes retournées
    $memory.selected_cards = [];

    // Passé le délai défini dans $memory.visible_duration, On retourne et réactive le clic sur les cartes non visibles
    setTimeout(function(){
      $($memory.elem).find('li').filter(function(){
        return $(this).data('is_active') == true;
      })
      .data('is_clickable', true)
      .removeClass('is-flipped')
      .removeClass('is-disabled');
    }, $memory.visible_duration * 1000);
  }, $memory.flip_duration);
};

// Lancement du jeu
$memory.start = function(){
  // Activation du clic sur les cartes
  $($memory.elem).find('li').data('is_clickable', true);
  // Lancement du compteur
  $counter.start();
};

// Arrêt du jeu
$memory.end = function($success){
  // Arrêt du Compteur
  $counter.stop();
  // Désactivation du clic sur toutes les cartes cachées restantes
  $($memory.elem).find('li').filter(function(){
    return $(this).data('is_active') == true;
  })
  .data('is_clickable', false);

  // En cas de succès
  if($success){
    // Sauvegarde du score
    $datas.save_score($counter.elapsed_time);
  // En cas de défaite
  }else{
    $alert.loose();
  }
};

// Nouvelle partie
$memory.replay = function(){
  // Fermeture de l'alerte
  $alert.hide();
  // Désactivation de l'affichage des scores
  $alert.display_ranking = false;
  // Réinitialisation du memory
  $memory.reset();
  // Réinitialisation du compteur
  $counter.reset();
  // Réinitialisation de la barre de progression
  $progress.reset();
  // Initialisation du memory
  $memory.init();
};

// Réinitialisation du memory
$memory.reset = function(){
  $($memory.elem).empty();
};

// =========================================
// counter
// =========================================

// Initialisation du compteur
$counter.init = function(){
  // Affichage formaté du temps imparti
  var $duration_time = $counter.format_time($memory.duration);
  $(this.duration_elem).find('.secs').html($duration_time['secs']);
  $(this.duration_elem).find('.mins').html($duration_time['mins']);
};

// Formatage du temps pour son affichage uniquement
$counter.format_time = function($seconds){
  return {
    'secs' : this.pad($seconds % 60),
    'mins' : this.pad(parseInt($seconds / 60, 10))
  };
};

// Fonction utilisée par $counter.format_time permettant d'ajouter un 0
// devant les secs ou mins si leur valeur est inérieure à 9
$counter.pad = function(val){
    return val > 9 ? val : '0' + val;
};

// Démarrage du compteur
$counter.start = function(){
  // Fonction éxécutée chaque seconde
  this.interval = setInterval(function(){
    // Incrémentation des champs secondes et minutes
    var $formatted_time = $counter.format_time($counter.elapsed_time);
    $($counter.count_up_elem).find('.mins').text($formatted_time['mins']);
    $($counter.count_up_elem).find('.secs').text($formatted_time['secs']);
    // Barre de progression
    $progress.move();

    // Si le temps écoulé est inférieur au temps imparti
    if($counter.elapsed_time < $memory.duration){
      // Incrémentation du temps écoulé
      $counter.elapsed_time ++;
    // Sinon, fin de la partie
    }else{
      $memory.end(false);
    }
  }, 1000);
};

// Arrêt du compteur
$counter.stop = function(){
  // Arrêt de la fonction d'incrémentation
  clearInterval(this.interval);
};

// Réinitialisation du compteur
$counter.reset = function(){
  this.elapsed_time = 0;
  $($counter.count_up_elem).find('.mins').text('00');
  $($counter.count_up_elem).find('.secs').text('00');
};

// =========================================
// progress
// =========================================

// Barre de progression
$progress.move = function(){
  // Ratio (temps écoulé + 1s d'avance) / temps imparti
  var $width = (($counter.elapsed_time + 1) / $memory.duration) * 100;
  // Report de la valeur sur la largeur de l'élément du DOM
  $($progress.elem).css('width', $width + '%');
};

// Réinitialisation de la barre de progression
$progress.reset = function(){
  // Récupération la barre de progression actuelle
  var $bar = $($progress.elem);
  // Copie et insertion
  $($progress.elem).clone().css('width', '').insertAfter($progress.elem);
  // Suppression de l'ancienne barre
  $bar.remove();
};

// =========================================
// alert
// =========================================

// Cacher l'alerte
$alert.hide = function(){
  $('#overlay').removeClass('show').css('display', '');
  $(this.elem).empty();
};

// Afficher du contenu dans l'alerte
$alert.show = function($content){
  $(this.elem).append($content).parent('#overlay').addClass('show');
};

// Alerte du classement des meilleurs scores
$alert.ranking = function($ranking_array){
    var $content =
    '<h1>Meilleurs scores</h1>' +
    '<table>' +
      '<tbody>';
      var $i = 1;
      $ranking_array.forEach(function($score){
        var $score_time = $counter.format_time($score['seconds']);
        $content  +=
        '<tr>' +
          '<td>' + $i + '</td>' +
          '<td><strong>' + $score_time['mins'] + ' : ' + $score_time['secs'] + '</strong></td>' +
          '<td>' + $score['date'] + '</td>' +
        '</tr>';
        $i ++;
      });
      $content +=
      '</tbody>' +
    '</table>';
    // Ajout dun bouton jouer
    $content += '<p><button type="button" onclick="$alert.hide();$memory.start()">Jouer</button></p>';

    // Affichage du classement dans l'alerte
    this.show($content);
};

// Alerte en cas de victoire
$alert.win = function($score, $ranking){
    // Temps final
    var $final_time = $counter.format_time($score);
    var $score = $final_time['mins'] + ' : ' + $final_time['secs'];
    // Contenu de l'alerte
    var $content = '<p>Félicitations, vous avez gagné !<br>Votre temps est de <strong>' + $score + '</strong>.</p>';
    // Si le résultat est dans les top scores
    if($ranking != 0)
    {
      $content += '<p>Vous occupez la <strong>' + $ranking + ($ranking == 1 ? 'ère' : 'ème') + '</strong> place du classement&nbsp;!</p>';
    }
    // Ajout d'un bouton proposant de rejouer
    $content += '<p><button type="button" onclick="$memory.replay()">Rejouer</button></p>';

    // Affichage de l'alerte
    this.show($content);
};

// Alert en cas de défaite
$alert.loose = function(){
    // Contenu de l'alerte
    var $content = '<p>Désolé, le temps imparti est écoulé !</p>';
    // Ajout d'un bouton proposant de rejouer
    $content += '<p><button type="button" onclick="$memory.replay()">Rejouer</button></p>';

    // Affichage de l'alerte
    this.show($content);
};

// =========================================
// datas
// =========================================

// Récupération des meilleures scores
$datas.get_ranking = function(){
  $.ajax({
    type: 'POST',
    url: this.path,
    data: {ranking : this.ranking_limit},
    dataType: 'json',
    success: function($datas){
      if($datas.length){
        $alert.ranking($datas);
      } else {
        $memory.start();
      }
    }
  });
};

// Sauvegarde d'un score
$datas.save_score = function($score){
  $.ajax({
    type: 'POST',
    url: this.path,
    data: {score : $score, limit : this.ranking_limit},
    success: function($ranking){
      $alert.win($score, $ranking);
    }
  });
};

$(window).on('load', function(){
  // Initialisation du Memory
  $memory.init();
});
