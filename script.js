// MAIN CODE
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

let table = makeTable();
let golfball = makeBall(160, 320, "#ffffdd");
golfball.xVel = -5;
golfball.yVel = -5;
setupTouch();
animate();

function makeBall(x, y, colorIn){
  const ball = {
    inPlay: true,
    radius: 10,
    xPos: x,
    yPos: y,
    xVel: 0,
    yVel: 0,
    xAcc: 0,
    yAcc: 0,
    friction: 0.985,
    elasticity: 0.7,
    color: colorIn,
    draw: function(){
      if (!this.inPlay) return;
      ctx.beginPath();
      ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    },
    update: function(){
      if (!this.inPlay) return;
      if (table.sinkable(this.xPos, this.yPos)){
        this.stop();
        this.isPlay = false;
      }
      this.xVel += this.xAcc;
      this.yVel += this.yAcc;
      this.xVel *= this.friction;
      this.yVel *= this.friction;
      if (Math.hypot(this.xVel, this.yVel) < 0.1){
        this.xVel = 0;
        this.yVel = 0;
      }
      this.xPos += this.xVel;
      this.yPos += this.yVel;
      // bounce off walls
      if (this.xPos < 0){
        this.xPos = 0;
        this.xVel *= -this.elasticity;
      }
      if (this.yPos < 0){
        this.yPos = 0;
        this.yVel *= -this.elasticity;
      }
      if (this.xPos > canvas.width){
        this.xPos = canvas.width;
        this.xVel *= -this.elasticity;
      }
      if (this.yPos > canvas.height){
        this.yPos = canvas.height;
        this.yVel *= -this.elasticity;
      }
    },
    push: function(dX, dY){
      this.xVel = dX / 20;
      this.yVel = dY / 20;
    },
    check: function(o){
      const padding = this.radius / 3;
      const xZone = (this.xPos > o.x - padding) && (this.xPos < o.x + o.width + 2 * padding);
      const yZone = (this.yPos > o.y + o.height) && (this.yPos < o.y + o.height + this.radius);
      if(xZone && yZone) {
        this.yVel = Math.abs(this.yVel * this.elasticity);
      }
    }
  };
  return ball;
}

function makeTable(){
  const table = 
  { 
    cupRadius: 15,
    cupColor: "#222222",
    cups : [
      {x : canvas.width / 2, y : 100}
    ],
    obstacles : [
      {x: 1, y: 150, width: 80, height: 20},
      {x: 210, y: 450, width: 100, height: 20}
    ],
    obstacleColor: "salmon",
    draw: function(){
      ctx.fillStyle  = "darkgreen";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      for (const loc of this.cups){
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, this.cupRadius, 0, 2 * Math.PI);
        ctx.fillStyle = this.cupColor;
        ctx.fill();
      }
      for (const obst of this.obstacles){
        ctx.beginPath();
        ctx.rect(obst.x, obst.y, obst.width, obst.height);
        ctx.fillStyle = this.obstacleColor;
        ctx.fill();
      }
    },
    sinkable: function(ballX, ballY){
      for (const loc of this.cups){
        if( Math.hypot(ballX - loc.x, ballY - loc.y) < this.cupRadius){
          return true;
        }
      }
      return false;
    }
  }
  return table;
}

function animate(){
  // draw
  table.draw();
  golfball.draw();
  // update
  golfball.update();
  checkCollisions();
   // repeat
  window.requestAnimationFrame(animate);
}

function checkCollisions(){
  for (const o of table.obstacles){
    golfball.check(o);
  }
   
}

function setupTouch() {
  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  });
  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    processTouch();
  });
}

function processTouch() {
  let deltaX = (touchEndX - touchStartX);
  let deltaY = (touchEndY - touchStartY);
  golfball.push(deltaX, deltaY);
}










