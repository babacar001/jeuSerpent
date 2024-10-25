// Fonction exécutée lorsque la page est complètement chargée
window.onload = function () {
    // Déclaration des variables principales
    var canvas; // Éléments de canvas pour dessiner le jeu
    var canvasWidth = 900; // Largeur du canvas
    var canvasHeight = 600; // Hauteur du canvas
    var blockSize = 30; // Taille d'un bloc du serpent
    var ctx; // Contexte de dessin du canvas
    var delay = 100; // Délai entre chaque rafraîchissement de l'écran
    var snakee; // Instance du serpent
    var applee; // Instance de la pomme
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    var score, timeout;

    // Initialisation du jeu
    init();

    // Fonction d'initialisation du jeu
    function init() {
        // Création d'un élément de canvas
        canvas = document.createElement("canvas");
        canvas.width = canvasWidth; // Définir la largeur
        canvas.height = canvasHeight; // Définir la hauteur
        canvas.style.border = "20px solid gray"; // Bordure du canvas
        canvas.style.margin = "50px  auto"; // Mise en page du canvas
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd"; 
        document.body.appendChild(canvas); // Ajout du canvas au corps du document
        ctx = canvas.getContext("2d"); // Obtention du contexte de dessin
        // Création d'une instance de serpent avec sa position initiale et direction
        snakee = new Snake([[6, 4], [5, 4], [4, 4], [3,4], [2,4]], "right");
         // Création d'une instance de la pomme avec sa position initiale et direction
         applee = new Apple([10, 10]);
         // Initialisation du score
         score =  0;

        // Démarrer le rafraîchissement du canvas
        refreshCanvas();
    }

    // Fonction pour rafraîchir le canvas à chaque délai
    function refreshCanvas() {

        snakee.advance(); // Avancer le serpent
        if (snakee.checkCollision()) {
            gameOver();
        }else{
            if (snakee.isEatingApple(applee)) {
                score ++;
                snakee.ateApple = true;
                do {
                    applee.setNewPosition();
                } while (applee.isOnSnake(snakee));
               
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Effacer le canvas
            drawScore();
            snakee.draw(); // Dessiner le serpent
            applee.draw(); // Dessiner la pomme
           
            timeout =  setTimeout(refreshCanvas, delay); // Répéter après le délai spécifié
        }

       
    }
    
    function gameOver() {
        ctx.save();
        ctx.font = "bold 45px sans-sherif"
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth =  5;
        var centerX =  canvasWidth / 2;
        var centerY =  canvasHeight / 2;
        ctx.strokeText("Game Over", centerX, centerY - 180);
        ctx.fillText("Game Over", centerX, centerY - 180);
        ctx.font = "bold 25px sans-sherif"
        ctx.strokeText("Appuper sur la touche espace pour rejouer", centerX, centerY - 120);
        ctx.fillText("Appuper sur la touche espace pour rejouer", centerX, centerY - 120);
        ctx.restore();
    }

    function restart() {
        snakee = new Snake([[6, 4], [5, 4], [4, 4], [3,4], [2,4]], "right");
        // Création d'une instance de la pomme avec sa position initiale et direction
        applee = new Apple([10, 10]);
        // Initialisation du score
        score  =  0;
        
        clearTimeout(timeout);
       // Démarrer le rafraîchissement du canvas
       refreshCanvas();
    }

    function drawScore() {
        ctx.save();
        ctx.font = "bold 100px sans-sherif"
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        var centerX =  canvasWidth / 2;
        var centerY =  canvasHeight / 2;

        ctx.fillText(score.toString(), centerX, centerY);
        ctx.restore();
    }

    // Fonction pour dessiner un bloc sur le canvas
    function drawBlock(ctx, position) {
        var x = position[0] * blockSize; // Calculer la position X
        var y = position[1] * blockSize; // Calculer la position Y
        ctx.fillRect(x, y, blockSize, blockSize); // Dessiner le bloc
    }

    // Constructeur pour créer un objet Snake
    function Snake(body, direction) {
        this.body = body; // Corps du serpent (tableau de segments)
        this.direction = direction; // Direction actuelle du serpent
        this.ateApple = false;
        // Méthode pour dessiner le serpent
        this.draw = function () {
            ctx.save(); // Sauvegarder le contexte actuel
            ctx.fillStyle = "#ff0000"; // Couleur du serpent
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]); // Dessiner chaque segment du serpent
            }
            ctx.restore(); // Restaurer le contexte
        };

        // Méthode pour avancer le serpent
        this.advance = function () {
            var nextPosition = this.body[0].slice(); // Copier la position actuelle de la tête
            // Déterminer la nouvelle position de la tête en fonction de la direction
            switch (this.direction) {
                case "left":
                    nextPosition[0] -= 1; // Déplacement vers la gauche
                    break;
                case "right":
                    nextPosition[0] += 1; // Déplacement vers la droite
                    break;
                case "down":
                    nextPosition[1] += 1; // Déplacement vers le bas
                    break;
                case "up":
                    nextPosition[1] -= 1; // Déplacement vers le haut
                    break;
                default:
                    throw ("Direction invalide"); // Gestion des directions invalides
            }

            // Ajouter la nouvelle position à l'avant du corps du serpent
            this.body.unshift(nextPosition);
            if(!this.ateApple)
                 this.body.pop(); // Supprimer le dernier segment (queue)
            else
              this.ateApple = false;
        };

        // Méthode pour changer la direction du serpent
        this.setDirection = function (newDirection) {
            var allowedDirection; // Directions autorisées
            // Déterminer les directions autorisées en fonction de la direction actuelle
            switch (this.direction) {
                case "left":
                case "right":
                    allowedDirection = ["up", "down"]; // Si à gauche ou droite, on peut aller en haut ou en bas
                    break;
                case "down":
                case "up":
                    allowedDirection = ["left", "right"]; // Si en haut ou bas, on peut aller à gauche ou à droite
                    break;
                default:
                    throw ("Direction invalide");
            }
            // Si la nouvelle direction est autorisée, la changer
            if (allowedDirection.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };
        this.checkCollision = function () {
            var wallCollision =  false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY =  0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX ||  snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY ||  snakeY > maxY;

            if (isNotBetweenVerticalWalls || isNotBetweenHorizontalWalls) {
                wallCollision = true;
            }

            for (var i = 0; i < rest.length; i++) {

                if(snakeX === rest[i][0] &&  snakeY === rest[i][1]) {

                snakeCollision = true;
               }
            }
            return wallCollision  || snakeCollision;

        }

        this.isEatingApple = function (appleToEat) {
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) 
                return true;
            else
                return false;
        }
    }

   // Constructeur pour créer une pomme (fruit) à une position donnée
    function Apple(position) {
        this.position = position; // Position de la pomme dans le jeu

        // Méthode pour dessiner la pomme
        this.draw = function () {
            ctx.save(); // Sauvegarder le contexte actuel du canvas
            ctx.fillStyle = "#33cc33"; // Couleur de la pomme (vert)

            ctx.beginPath(); // Commencer un nouveau chemin pour dessiner la pomme
            var radius = blockSize / 2; // Définir le rayon de la pomme (demi-taille d'un bloc)
            
            // Calculer les coordonnées x et y du centre de la pomme
            var x = this.position[0] * blockSize + radius; // Coordonnée x
            var y = this.position[1] * blockSize + radius; // Coordonnée y

            // Dessiner un arc (cercle) pour représenter la pomme
            ctx.arc(x, y, radius, 0, Math.PI * 2, true); // Créer un cercle complet
            ctx.fill(); // Remplir le cercle avec la couleur définie

            ctx.restore(); // Restaurer le contexte précédent
        };
       
        this.setNewPosition = function () {
            var newX = Math.round( Math.random() * (widthInBlocks - 1));
            var newY = Math.round( Math.random() * (heightInBlocks - 1));
           this.position = [newX, newY];
        }
        this.isOnSnake = function (snakeToCheck) {
            var isOnSnake = false;
            for (var i = 0; i < snakeToCheck.length; i++) {
                if (this.position[0] === snakeToCheck[i][0] && this.position[1]  === snakeToCheck[i][1]) {
                   isOnSnake = true;
                }
            }
            return isOnSnake;
        }
    }


    // Écouteur d'événements pour les touches du clavier
    document.onkeydown = function handleKeyDown(e) {
        var newDirection; // Variable pour la nouvelle direction
        // Déterminer la direction en fonction de la touche pressée
        switch (e.keyCode) {
            case 37: // Flèche gauche
                newDirection = "left";
                break;
            case 38: // Flèche haut
                newDirection = "up";
                break;
            case 39: // Flèche droite
                newDirection = "right";
                break;
            case 40: // Flèche bas
                newDirection = "down";
                break;
            case 32 :
                restart();
                return;
            default:
                return; // Si la touche n'est pas une flèche, ne rien faire
        }
        // Changer la direction du serpent
        snakee.setDirection(newDirection);
    };
};
