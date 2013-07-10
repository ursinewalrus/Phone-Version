//*************************************
//*************************************
//*************************************
//A18 ON LINE 74, 75 //
//*************************************
//*************************************
//*************************************
gameView = {w:400, h:400};

/*
The game model takes place in a 100x100 board where the bubbles
stay in the top 80% of the board...
*/
function game_model(){
	this.game = true;
	this.directionRight = true;
	this.moveDownLevel = false;
	this.invaders=[];
	this.airballs=[];
	this.running=false;
	this.startTime = 0;
	this.theStraw = new straw();
	this.update = function(){
		// Change Bubble direction if one runs into an edge!
		for(var i = 0;  i < this.invaders.length; i++){
			var bubb = this.invaders[i];
			if (bubb.x<bubb.r && bubb.active) {
				this.directionRight = true;
				this.moveDownLevel = true;
			} else if (bubb.x>100-bubb.r && bubb.active) {
				this.directionRight = false;
				this.moveDownLevel = true;
			}
		}
		for(var i = 0;  i < this.invaders.length; i++){
			var bubb = this.invaders[i];
			if(bubb.y<=0 && bubb.active && gm.game){
				alert("You lose the game silly, press restart game to try again, ya dunce");
				gm.game = !gm.game;
				break;
			}
		}
		// to update the model just update all of the bubbles
		for(var i=0; i<this.invaders.length; i++){
			this.invaders[i].update();
		}
		this.moveDownLevel = false;
		/*
		if (this.moveDownLevel) {
			this.moveDownLevel = false;
			for(var i=0; i<this.bubbles.length; i++){
				this.bubbles[i].update();
			}
		}
		*/
		// check for collisions
		var airballList = this.airballs;
		for(var i=airballList.length-1; i>=0; i--){
			var a = this.airballs[i];
			a.update();
			for(var j=0; j<this.invaders.length; j++){
				var b = this.invaders[j];
				//console.log("test intersection "+[a,b])
				if (a.intersects(b)){
					b.active=false;
					//console.log("intersect!!! ");
				}
			}
			if (a.y > 95 || a.x<5 || a.x > 95) {
				this.airballs = this.airballs.slice(0,i).concat(this.airballs.slice(i+1));
				// remove element a from airballList
				
			}
		}
		kills=0;
		
		for(var i=0;i<gm.invaders.length;i++){
			if(!gm.invaders[i].active){
				kills++;
				window.localStorage.setItem("kills", kills);
				var score = window.localStorage.getItem("kills");//just to see if it worked without having to win the game
				console.log(score);

			}
			if(kills==gm.invaders.length && gm.game){
				alert("You are winner! Press the Restart Game button to enjoy the experience again!!!!");
				gm.game = !gm.game;
				var score = window.localStorage.getItem("kills");
				console.log(score);

			}
		}
	}

	for(var i=0;i<6;i++){
		var bx= 10 + (i*15);
		var by=100;
		this.invaders.push(new invader(bx,by,4) );
	}
	for(var i=0;i<6;i++){
		var bx= 10 + (i*15);
		var by=90;
		this.invaders.push(new invader(bx,by,4) );
	}
	for(var i=0;i<6;i++){
		var bx= 10 + (i*15);
		var by=80;
		this.invaders.push(new invader(bx,by,4) );
	}
	for(var i=0;i<6;i++){
		var bx= 10 + (i*15);
		var by=70;
		this.invaders.push(new invader(bx,by,4) );
	}
	/*	
	for(var i=0; i<4;i++){
		var bx=Math.round(Math.random()*100);
		var by=35;
		var b = new bubble(bx,by,1);
		//b.vx *= 4; b.vy*=4;
		this.airballs.push(b);
	}
	*/
}

function bubble(x,y,r){
	this.x=x;
	this.y=y;
	this.vx=Math.random()*10;
	this.vy=Math.random()*10;
	this.r=r;
	this.lastTime = +new Date();
	this.active=true;
	this.update = function(){
		// to update a bubble calculate its new position
        // based on how much time has elapsed since it was last updated
		var t = +new Date();
		var dt = t-this.lastTime;
		this.lastTime=t;
		this.x += this.vx*dt/1000.0;
		this.y += this.vy*dt/1000.0;
		// and change velocity if it runs into an edge!
		if (this.x<this.r || this.x>100-this.r) this.vx *= -1;
		if (this.y<this.r|| this.y>100-this.r) this.vy *= -1;		
	}
	this.draw = function(cont){
		if (!this.active) return;
		gScale = Math.min(gameView.w,gameView.h);
		px = gScale*this.x/100;
		py = gScale*(100-this.y)/100;
		pr = gScale*this.r/100;
		cont.beginPath();
		cont.arc(px,py,pr,0,2*Math.PI,false);
		//cont.strokeStyle="#AAF";
		//cont.stroke();
		cont.fillStyle="#006";
		cont.fill();
	}
	this.intersects = function(b) {
		var dx = this.x -b.x;
		var dy = this.y - b.y;
		var d = Math.sqrt(dx*dx + dy*dy);
		//console.log([this,b,dx,dy,d]);
		return (d < b.r+this.r);
	}
}

function invader(x,y,r){
	this.x=x;
	this.y=y;
//	this.vx= 10;
//	this.vy= 0;
	this.r=r;
	this.lastTime = +new Date();
	this.active=true;
}

invader.prototype.update = function(){
		// to update a bubble calculate its new position
        // based on how much time has elapsed since it was last updated
		var t = +new Date();
		var dt = t-this.lastTime;
		this.lastTime=t;
		if (gm.moveDownLevel) {
			this.y -= 200.0*dt/1000.0
		}
		if (gm.directionRight) {
			this.x += 20.0*dt/1000.0
		} else {
			this.x -= 20.0*dt/1000.0
		}
//		this.x += this.vx*dt/1000.0;
//		this.y += this.vy*dt/1000.0;	
}

invader.prototype.draw = function(cont){
		if (!this.active) return;
		gScale = Math.min(gameView.w,gameView.h);
		px = gScale*this.x/100;
		py = gScale*(100-this.y)/100;
		pr = gScale*this.r/100;
		cont.beginPath();
		cont.arc(px,py,pr,0,2*Math.PI,false);
		//cont.strokeStyle="#AAF";
		//cont.stroke();
		cont.fillStyle="#006";
		cont.fill();
}
invader.prototype.intersects = function(b) {
		var dx = this.x -b.x;
		var dy = this.y - b.y;
		var d = Math.sqrt(dx*dx + dy*dy);
		//console.log([this,b,dx,dy,d]);
		return (d < b.r+this.r);
}




function game_loop(){
	gm.update();
	draw_view();
}

function draw_view(){
	if (!gm.running) return;
	var can = document.getElementById("mycanvas");
	var cont = can.getContext("2d");
	/*  clear the canvas */
	cont.fillStyle = "#000";
	cont.clearRect(0,0,gameView.w, gameView.h);
	//console.log([gm.bubbles.length,+new Date()]);
	for(var i=0; i<gm.invaders.length; i++){
		gm.invaders[i].draw(cont);
	}
	for(var i=0; i<gm.airballs.length; i++){
		gm.airballs[i].draw(cont);
	}
	draw_straw(cont);

}

function straw(){
    this.x = 200;
}


function draw_straw(cont, straw){
	// we can draw a straw easily using translation and rotation of the context
	cont.fillStyle = "#0F0";
	cont.fillRect(gm.theStraw.x,360,10,45);

}

function restart () {
    gm = new game_model();
    toggle();
    }
function shoot(){
    if (gm.airballs.length < 1) {
    var trans = gm.theStraw.x/4;
	var a = new bubble(trans,1,1);
	a.vy = 50;
	a.vx = 0;
	gm.airballs.push(a);
	}
}

function left(){
    if(gm.theStraw.x > 0) {
        gm.theStraw.x -= 20;
	}
}

function right(){
	if(gm.theStraw.x < 380) {
        gm.theStraw.x += 20;
	}
}


function toggle(){
	gm.running = !gm.running;
}

function initialize() {
	var c = document.getElementById("mycanvas");
	gm.running=true;
	document.onkeydown = function(evt){
		if (evt.keyCode==' '.charCodeAt(0)) {
			shoot();
		}else if (evt.keyCode=='A'.charCodeAt(0)){
			left();
		} else if (evt.keyCode='D'.charCodeAt(0)){
			right();
		}
	}

}

var gm = new game_model();

window.setInterval(game_loop,10);
window.onload = initialize;

