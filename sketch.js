var dog, happyDog, dogImg;
var database; 
var foodS, foodStock;
var addFood, feed;
var fedTime, lastFed;
var foodObj;

function preload()
{
  dogImg = loadImage("images/dogImg1.png");
  happyDog = loadImage("images/dogImg.png");
}

function setup() {
  createCanvas(1000, 500);

  database = firebase.database();
  
  dog = createSprite(820, 220, 100, 100);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Foods();

  feed = createButton('Feed The Dog');
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton('Add Food');
  addFood.position(800, 95)
  addFood.mousePressed(addFoods);
}

function draw() {
  background(46, 139, 87);

  foodObj.display();

  drawSprites();

  textFont("Times New Roman");
  fill("white");

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  
  //text("Food Remaining:" + " " + foodS, 220, 300);

  if(lastFed>=12){
    text("Last Fed:" + lastFed%12 + " " + "PM", 350, 30);
  }
  else if(lastFed === 0){
    text("Last Fed: 12:00 PM", 350, 30);
  }
  else{
    text("Last Fed:" + lastFed + " " + "PM", 350, 30);
  }
}
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x <= 0){
    x = 0;
  }
  else{
    x = x - 1;
  }
  database.ref('/').update({
    Food: x
  })
}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}