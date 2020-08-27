var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided, restart, gameOver, restart_img, gameOver_img;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var bgImg;
var score;


function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  bgImg = loadImage("background.jpg");

  gameOver_img = loadImage("gameOver.png");
  restart_img = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(200, 180, 1600, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;


  invisibleGround = createSprite(200, 190, 1600, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;

  gameOver = createSprite(300, 100);
  restart = createSprite(300, 140);

  gameOver.visible = false;
  restart.visible = false
  restart.addImage("restart", restart_img);
  gameOver.addImage("gameOver", gameOver_img);
  gameOver.scale = 0.5;
  restart.scale = 0.5;

}

function draw() {
  background(bgImg);
  camera.x = trex.x+200;
 camera.y = displayHeight/8;
 gameOver.x = trex.x+200;
 restart.x = trex.x+200;

 fill(0)
  text("Score: " + score, trex.x-20, 50);
   if(trex.y>=163){
    trex.y = 162;
   }
  
  if (gameState === PLAY) {
    //move the ground
    trex.velocityX = (6 + 3 * score / 100);
    if(frameCount%40 === 0){
      ground.x = trex.x+800;
    }
    score = score + Math.round(getFrameRate() / 60);
    if (keyDown("space") && (trex.y > 161)) {
      trex.velocityY = -12;
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    spawnClouds();
    spawnObstacles();
    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    
    }
} else if (gameState === END) {
  trex.velocityX = 0;
  gameOver.visible = true;
  restart.visible = true;

  //set velcity of each game object to 0

  trex.velocityY = 0;
  obstaclesGroup.setVelocityXEach(0);
  cloudsGroup.setVelocityXEach(0);

  //change the trex animation
  trex.changeAnimation("collided", trex_collided);

  //set lifetime of the game objects so that they are never destroyed
  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);
if(mousePressedOver(restart)) {
    reset();
  }
}

trex.collide(invisibleGround);

drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 30 === 0) {
    var cloud = createSprite(trex.x+500, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -1;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(trex.x+500, 165, 10, 40);
    // obstacle.velocityX = -(6 + 3 * score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex);
  
  score = 0;
  
}