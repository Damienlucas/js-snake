const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


// variables

// ----variable sur x
var vx = 10;

// ---------varaible sur y
var vy = 0;

// ---pommeX
let pommeX = 0;
// ---pommeY
let pommeY = 0;
// score
var score = 0;
// bugdirection
let bugDirection = false;
// stopGame
let stopGame = false;

let snake = [ {x:140, y:150}, {x:130, y:150}, {x:120, y:150}, {x:110, y:150} ];

function animation(){

    if(stopGame === true){
        return;
    }
    else{
        setTimeout(function(){
            bugDirection = false;
            // on remet bugDirection à zéro pour autoriser un nouveau mouvement
            nettoieCanvas();
            dessinePomme();
            faireAvancerSerpent();
           
            dessineLeSerpent();
    
            // on fait une recursion, c est une function qui s'appelle elle meme a l'infini
            animation();
        }, 100);
    } 
}
animation();
creerPomme();

function nettoieCanvas(){
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.strokeRect(0,0,canvas.width, canvas.height);
}

function dessineLesMorceaux(morceau){

    ctx.fillStyle = "#00fe14";
    ctx.strokeStyle = "black";
    ctx.fillRect(morceau.x, morceau.y, 10, 10);
    ctx.strokeRect(morceau.x, morceau.y, 10, 10);
}

function dessineLeSerpent(){
    snake.forEach(morceau => {
        dessineLesMorceaux(morceau);
    })
}



function faireAvancerSerpent(){

    const head = {x: snake[0].x + vx, y: snake[0].y + vy};
    snake.unshift(head);
    // .unshift permet de rajouter un élément au tableau
    // snake.pop(); on va pas le mettre là sinon le serpent ne grossira jamais, on ne veut pas enlever le dernier élément quand on mange une pomme pour le faire grandir

    if(finDuJeu()){
        snake.shift(head);
        // on lui enleve la tete que l on vient de dessiner puisqu on a perdu
        recommencer();
        stopGame = true;
        return;
    }

    const serpentMangePomme = snake[0].x === pommeX && snake[0].y === pommeY;

    if(serpentMangePomme){
        score += 1;
        document.getElementById("score").innerHTML = score;
        creerPomme();
    }
    else{
        snake.pop();
        // .pop enleve le dernier élément d'un tableau
    }
}

dessineLeSerpent();

document.addEventListener('keydown', changerDirection);

function changerDirection(event){
    // console.log(event);

    // eviter le bug
    if(bugDirection) return;
    bugDirection = true;
    // cela évite que l on puisse utiliser les touches directionnelles trop vite et cree un bug  la on est oblige de respecter le set time de animation()

    const FLECHE_GAUCHE = 37;
    const FLECHE_DROITE = 39;
    const FLECHE_ENHAUT = 38;
    const FLECHE_ENBAS = 40;

    const direction = event.keyCode;

    const monter = vy === -10;
    const descendre = vy === 10;
    const adroite = vx === 10;
    const agauche = vx === -10;

    // si on est en train d'aller à droite, alors vx=10 donc inverse de adroite =false, on interdit le retournement
    // imaginons que l'on veuille aller à gauche (premier cas)
    // on appuie sur la touche gauche, donc direction === FLECHE_GAUCHE === true
    // pi=uis on vérifie que l'on est pas en train d'aller à droite, pour éviter que le serpent se retourne sur lui-même
    // donc si on va à droite, adroite === true, donc on écrit !adroite pour avoir false afin d'empécher la condition && de s'executer
    if(direction === FLECHE_GAUCHE && !adroite) { vx = -10; vy = 0; }
    if(direction === FLECHE_ENHAUT && !descendre) { vx = 0; vy = -10; }
    if(direction === FLECHE_DROITE && !agauche) { vx = 10; vy = 0; }
    if(direction === FLECHE_ENBAS && !monter) { vx = 0; vy = 10; }
}

function random(){

    // .round sert à arrondir le chiffre que l on trouve avec .random on multiplie par 290 car on veut pas que ca sorte du canvas donc pas 300 (290+10)  on divise par 10 pour appliquer le .round par exemple 0.7*290=203 on divise par 10 donc 20.3 ca l arrondit a 20 que l on multiplie par dix pour retrouver 200. Car on ne veut que des chiffres qui finnissent par 0 pour etre place comme le serpent 
    return Math.round((Math.random() * 290) /10) *10;
    
}

function creerPomme(){

    pommeX = random();
    pommeY = random();
    // console.log(pommeX, pommeY);

    snake.forEach(function(part){

        const serpentSurPomme = part.x == pommeX && part.y == pommeY;

        if(serpentSurPomme){
            creerPomme();
        }
    })
}

function dessinePomme(){

    ctx.fillStyle = 'red';
    ctx.strokeStyle = "darkred";
    // ctx.fillRect(pommeX, pommeY, 10, 10)
    ctx.beginPath();
    ctx.arc(pommeX + 5, pommeY + 5, 5, 0, 2 * Math.PI);
    // on rajoute +5 car le cercle est decalé son point d origine est son centre qui se trouve en haut a gauche du carre si on veut voir et comprendre
    ctx.fill();
    ctx.stroke();
}

function finDuJeu(){

    let snakeSansTete = snake.slice(1, -1);
    // je coupe le tableau apres la tete
    let mordu = false;

    snakeSansTete.forEach(morceau => {
        if(morceau.x === snake[0].x && morceau.y === snake[0].y){
            // si un morceau est au meme endroit que la tete
            mordu = true;
        }
    })

    const toucheMurGauche = snake[0].x < -1;
    const toucheMurDroite = snake[0].x > canvas.width - 10;
    // -10 pour 290 pas 300 car a 290 on cree un carre de 10 mais a 300 on peut plus on est dehors
    const toucheMurTop = snake[0].y < -1;
    const toucheMurBottom = snake[0].y > canvas.height - 10;

    let gameOver = false;

    if(mordu || toucheMurGauche || toucheMurDroite || toucheMurTop || toucheMurBottom){
        gameOver = true;
    }
   
    return gameOver;
}

function recommencer(){
    const restart = document.getElementById('recommencer');
    restart.style.display = "block";

    document.addEventListener('keydown', (e) => {
        if(e.keyCode === 32){
            document.location.reload(true);
        }
    })
}