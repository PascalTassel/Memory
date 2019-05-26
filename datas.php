<?php
// Création de la class Datas
class Datas{

  // Constructeur de la classe, dans lequel est initialisé la connexion à la bdd
  function __construct(){

    // Paramètres de connexion à la bdd
    $host =     'localhost';
    $db   =     'memory';
    $user =     'root';
    $pass =     ''; // 'root' Sous MAMP (Mac)
    $charset =  'utf8';

    // Chaîne des paramètres de connexion
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";

    // Option de connexion PDO
    $opts = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Activation mode erreur
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ          // Renvoie les résultats de requête sous forme d'objet
    ];

    // Si la connexion provoque une erreur
    try {
      // Connexion PDO à la bdd
      $this->db = new PDO($dsn, $user, $pass, $opts);

    // Affichage du message d'erreur de connexion
    } catch (Exception $e) {
      die('Erreur de connexion : '.$e->getMessage());
    }

  }

  /*
  * Récupère les meilleurs scores
  * @param int $limit Nombre de scores à retourner
  * @return boolean
  */
  public function get_ranking($limit){
    // Écriture de la requête comprenant le marqueur nommé :limit permettant de définir le nombre d'enregistrements à retourner
    $sql = "SELECT id, seconds, DATE_FORMAT(date, '%d/%m/%Y %H:%i') AS date FROM `scores` ORDER BY seconds ASC LIMIT :limit";
    // Création d'un objet statement préparant la reqête avant substitution du marqueur
    $stmt = $this->db->prepare($sql);
    // Association de la variable $limit au marqueur :limit, variable de type integer
    $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
    // Exécution de la requête
    $stmt->execute();

    // Renvoi des résultats de la requête
    return $stmt->fetchAll();
  }

  /*
  * Sauvegarde un score
  * @param int $seconds Temps de la partie en secondes
  * @return int ID de l'enregistrement
  */
  public function set_score(int $seconds, $ranking_limit){
    // Écriture de la requête comprenant les marqueurs nommé :id et :seconds
    $sql = "INSERT INTO `scores` (id, seconds) VALUES (:id, :seconds)";
    // Génération de l'ID de la partie sur 13 caractères
    $id = uniqid();
    // Création d'un objet statement préparant la reqête avant substitution des marqueurs
    $stmt = $this->db->prepare($sql);
    // Association de la variable $id au marqueur :id, variable de type string
    $stmt->bindValue(':id', $id, PDO::PARAM_STR);
    // Association de la variable $seconds au marqueur :seconds, variable de type integer
    $stmt->bindValue(':seconds', (int) $seconds, PDO::PARAM_INT);
    // Exécution de la requête
    $stmt->execute();

    // Récupération de classement, avec limitation $ranking_limit
    $top_ranking = $this->get_ranking($ranking_limit);
    // Initialisation du classement du joueur
    $is_ranked = 0;

    // Définition du numéro d'enregistrement
    $row_ranking = 1;
    // Pour chaque enregistrement
    foreach($top_ranking as $ranking){
      // Si l'ID de la partie est identique à celui de l'enregistrement
      if($ranking->id == $id){
        // Classement du joueur = numéro de ligne
        $is_ranked = $row_ranking;
      }
      // Incrémentation du numéro de ligne
      $row_ranking ++;
    }

    // Renvoi du classement du joueur
    return $is_ranked;
  }
}

// Création d'un objet Datas
$datas = new Datas();

// Récupération des paramètres POST transmis par memory.js

// Si la variable POST 'ranking' existe
if(isset($_POST['ranking'])){
  // Appel de la méthode get_ranking de l'objet $datas et passage en argument du paramètre attendu
  // Récupération du classement sous forme d'objet
  $result = $datas->get_ranking($_POST['ranking']);

  // Entête indiquant au navigateur que l'on renvoie du JSON
  header('Content-Type: application/json');
  // Écriture en JSON du résultat de la requête
  echo json_encode($result);
}
// Si la variable POST 'score' existe
else if(isset($_POST['score']))
{
  // Appel de la méthode set_score de l'objet $datas et passage en argument des paramètres attendus
  // Récupération du classement du joueur
  $ranking = $datas->set_score($_POST['score'], $_POST['limit']);

  // Entête indiquant au navigateur que l'on renvoie du texte
  header('Content-Type: text/html; charset=UTF-8');
  // Écriture du classement du joueur
  echo $ranking;
}
?>
