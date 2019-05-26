# Memory
Test d'évaluation d'un développement full stack à travers la création d'un memory.

## Pré-requis
```
Php 7.0.33 / MySQL 5.7.24
```
## Mise en route

Récupérez une copie du projet et placez-le dans le répertoire /www de votre serveur local.

### Base de données

Importez la base de données dans phpMyAdmin à partir du fichier **memory.sql**. La table scores contient un enregistrement permettant d'afficher le classement lors du premier lancement.

Modifiez si besoin les paramètres de connexion définis dans le constructeur de la class Datas, depuis **datas.php**.

### Css

Compilez les fichiers .scss à partir du fichier **assets/css/config.rb**.

## Fonctionnalités

Éditez les différents paramètres du jeu et de ses composants depuis le fichier **assets/js/memory.js**.

Retrouvez ci-dessous la liste des paramètres :

```
const $app = {
  dev_mode :          false            // Permet d'afficher la valeur au dos des cartes
};

const $memory = {
  'duration' :          600,            // Temps imparti (sec.)
  'visible_duration' :  2,              // Durée de visibilité d'une carte avant son retournement (sec.)
  'elem' :              '#cards',       // Élément du DOM contenant les cartes
  'flip_duration' :     500,            // Durée de l'animation CSS lorsque la carte se retourne
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
  'display_ranking' :   true,         // Affichage des meilleurs scores en début de partie
  'ranking_duration' :  6             // Durée d'affichage des meilleurs scores en début de partie (sec.)
};

const $datas = {
  'path' :              'datas.php',  // Chemin d'accès au fichier de récupération des données
  'ranking_limit' :     5             // Nombre de résultats à afficher dans le tableau des meilleurs scores
}

```

#### Auteur

Pascal Tassel

#### Environnement de travail

Wampserver 3.1.7 sur Windows 10.
