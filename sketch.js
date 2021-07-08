var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_swimming;
var ground, invisibleGround, groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){ 
  groundImage = loadImage("download.jpg");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");

  trex_swimming = loadImage("fish.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(1000, 300);

  var message = "This is a message";
  console.log(message)

  ground = createSprite(500,150,1000,300);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  ground.scale = 7;
 
 trex = createSprite(50,160,20,50);
 trex.addAnimation("swimming", trex_swimming);
 trex.scale = 0.13;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg); 
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,250,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  background("blue");

    //displaying score
    text("Score: "+ score, 500,50);

  trex.x=camera.position.x-270;
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
     
    //jump when the space key is pressed
    if(keyDown("space")) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
    
      ground.velocityX = 0;
      trex.velocityY = 0
      
      //set lifetime of the game objects so that they are never destroyed
     obstaclesGroup.setLifetimeEach(-1);
     obstaclesGroup.setVelocityXEach(0);   
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
 gameState=PLAY 
 obstaclesGroup.destroyEach();
score=0
}


function spawnObstacles(){
 if (frameCount % 60 === 0){

   var obstacle = createSprite(camera.position.x+600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
      obstacle1.scale = 0.01;
              break;
      case 2: obstacle.addImage(obstacle3);
              break;
      case 3: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle          
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}
