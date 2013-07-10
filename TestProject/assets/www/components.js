
// The Grid component allows an element to be located
// on a grid of tiles
Crafty.c('Grid', {
init: function() {
this.attr({
w: Game.map_grid.tile.width,
h: Game.map_grid.tile.height
})
},
 
// Locate this entity at the given position on the grid
at: function(x, y) {
if (x === undefined && y === undefined) {
return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
} else {
this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
return this;
}
}
});
 
//----------------------------------------------------------
//--------------Basic Components----------------------------
//----------------------------------------------------------

// An "Actor" is an entity that is drawn in 2D on canvas
// via our logical coordinate grid
Crafty.c('Actor', {
init: function() {
this.requires('2D, Canvas, Grid');
}
});


//----------------------------------------------------------
//--------------Moving Components---------------------------
//----------------------------------------------------------

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
init: function() {
this.arrowTimer = 0;
this.hurtTimer = 0;
this.direction = 'n';
this.enttype = 'PlayerCharacter';
this.requires('Actor, Fourway, Collision, Persist, Keyboard, spr_player, SpriteAnimation')
.fourway(speed)
.onHit('Village', this.visitVillage)
.onHit('Door', this.enterRoom)
.onHit('NPC', this.hurt)
.onHit('Consumeable',this.feast)
.stopOnSolids()
.stopOnNPC()
.bind('EnterFrame', function() {
	if (this.isDown('W')) {
		this.direction = 'n'
	} else if (this.isDown('S')) {
		this.direction = 's'
	} else if (this.isDown('A')) {
		this.direction = 'w'
	} else if (this.isDown('D')) {
		this.direction = 'e'
	} if (this.isDown('SPACE')) {
		if (this.arrowTimer == 0) {
			Crafty.e('Arrow').at(this.at().x,this.at().y).direction = this.direction;
			this.arrowTimer = 30;
		}
	}

	if (this.arrowTimer > 0) {
		this.arrowTimer = this.arrowTimer - 1;
	}
	if (this.hurtTimer > 0) {
        this.hurtTimer -= 1;
    }
	if(exp>=next_level){
		var level_up_array = new Array ()
		var ding = Crafty.e('2D, DOM, Color, Text')
		ding.attr({x:50,y:100,w:200,alpha:1.0})
		//ding.text('Press J to boost HP, K to boost speed and L to boost the D')
		if(this.isDown('J')&& exp>=next_level){
			level++;
			max_hp=+max_hp*1.2
			player_hp+=max_hp/2
			var rollOver = exp-next_level
			exp=rollOver
			next_level=next_level*1.33
			ding.destroy()
		}else if(this.isDown('K') && exp>=next_level){
			level++;
			speed+=50
			var rollOver = exp-next_level
			exp=rollOver
			next_level=next_level*1.33
			ding.destroy()
		}
		
	}
    
    
		resetHUD();
		HUD();
	
})
.bind("SaveData", function (data, prepare) {
    data.attr.x = this.x;
    data.attr.y = this.y;
});

//for animation later
/*
.animate('Pup',0,0,2)
.animate('Pr',0,1,2)
.animate('Pd',0,2,2)
.animate('Pl',0,3,2);
var animation_speed = 8;
this.bind('NewDirection',function(data){
 if (data.x > 0) {
this.animate('PlayerMovingRight', animation_speed, -1);
} else if (data.x < 0) {
this.animate('PlayerMovingLeft', animation_speed, -1);
} else if (data.y > 0) {
this.animate('PlayerMovingDown', animation_speed, -1);
} else if (data.y < 0) {
this.animate('PlayerMovingUp', animation_speed, -1);
} else {
this.stop();
}
});
*/
},

stopOnSolids: function() {
	this.onHit('Block', this.stopMovement);
	return this;
},

stopMovement: function () {
	if (this._movement) {
		this.x -= this._movement.x;
			if (this.hit('Block') != false) {
					this.x += this._movement.x;
						this.y -= this._movement.y;
							if (this.hit('Block') != false) {
								this.x -= this._movement.x;
									this.y -= this._movement.y;
							}
			}
	} else {
	this._speed = 0;
	}
},

stopOnNPC: function () {
	(this.onHit('NPC',this.stopNPC));
		return this;
},

//Stops the movement
stopNPC: function() {
	this._speed = 0;
	if (this._movement) {
		this.x -= this._movement.x;
		this.y -= this._movement.y;
}},

hurt:function() {
    if (this.hurtTimer == 0) {
        player_hp -= 1;
    }
    this.hurtTimer = 20;
    
    
    if (player_hp <= 0) {
		this.destroy();
        Crafty.scene("YouLose");
    }
    
},

enterRoom: function(data) {
	dooor = data[0].obj;
	var player_X;
	var player_Y;
	var roundedX =  Math.round(this.at().x);
	if ((dooor.at().x == Game.map_grid.width - 1) ||
		(dooor.at().x == 0)) {
		player_X = Game.map_grid.width - roundedX - 1;
	} else {
		player_X = roundedX;
	}
	var roundedY = Math.round(this.at().y);
	if ((dooor.at().y == Game.map_grid.height - 1) ||
		(dooor.at().y == 0)) {
		player_Y = Game.map_grid.height - roundedY - 1;
	} else {
		player_Y = roundedY;
	}
	this.at(player_X, player_Y);
	allRooms[dooor.thisRoom].exit();
	console.log(dooor.linkedRoom);
	Crafty.scene(dooor.linkedRoom);
},


// Respond to this player visiting a village
visitVillage: function(data) {
	villlage = data[0].obj;
	villlage.visit();
	return data[0];
},

feast : function (data){
	foood = data[0].obj;
	foood.feast();
	return data[0];
}
});

Crafty.c('NPC', {
init: function() {
this.direction = 'n'
this.hp = 2;
this.reverseDirection = 's'
this.requires('Actor, Collision, DontRemove, Solid, spr_wolfyfront')
.onHit('PlayerCharacter', this.hurtPlayer)
.bind('EnterFrame' , function() {
if (Math.random() > .95) {
	var newDirection = Math.random();
		if (newDirection < .25) {
			this.direction = 'n'
			this.reverseDirection = 's'
		}
		else if (newDirection > .25 && newDirection < .5) {
			this.direction = 's'
			this.reverseDirection = 'n'
		}
		else if (newDirection >.5 && newDirection < .75) {
			this.direction = 'e'
			this.reverseDirection = 'w'
		}
		else if (newDirection > .76) {
			this.direction = 'w'
			this.reverseDirection = 'e'
		}
}
this.move(this.direction, 1);
if (this.hit('Solid')) {
	this.move(this.reverseDirection, 1);
}

/*
if (this.hit('Arrow')){
	this.hp-=1;
}
*/

if(this.hp<=0){
	this.destroy();
	exp+=10;
}
}
)
.bind("SaveData", function (data, prepare) {
    data.attr.x = this.x;
    data.attr.y = this.y;
});
},

hurtPlayer : function (data) {
	plaayer = data[0].obj;
	plaayer.hurt();
	this.move(this.reverseDirection, 1);
},

ouch : function () {
	this.hp-=1;
},
});

Crafty.c('Arrow', {
init: function() {
this.direction = ''
this.requires('Actor, spr_arrow2N, Collision')
.onHit('NPC',this.hurt)
.onHit('NPC',this.shatter)
.onHit('Solid',this.shatter)
.bind('EnterFrame', function() {
	this.move(this.direction, 6);
});
},

shatter : function(){
	this.destroy();
},

hurt: function(data) {
	damage = data[0].obj;
	damage.ouch();
	return data[0];
	},
});

//----------------------------------------------------------
//--------------Non Moving Components-----------------------
//----------------------------------------------------------

// A Tree is just an Actor with a certain sprite
Crafty.c('Tree', {
init: function() {
this.requires('Actor, Solid, Block, DontRemove, spr_tree2')
.bind("SaveData", function (data, prepare) {
    data.attr.x = this.x;
    data.attr.y = this.y;
});
}
});

Crafty.c('Door',{
init:function(){
	this.thisRoom;
	this.linkedRoom;
	this.requires('Actor, Solid, DontRemove, Block, spr_door')
	.bind("SaveData", function (data, prepare) {
		data.attr.x = this.x;
		data.attr.y = this.y;
		data.attr.thisRoom = this.thisRoom;
		data.attr.linkedRoom = this.linkedRoom;
	});
},
setThisRoom:function(room) {
	this.thisRoom = room;
},
setLinkedRoom:function(room) {
	this.linkedRoom = room;
}
});

// A Bush is just an Actor with a certain sprite
Crafty.c('Bush', {
init: function() {
this.requires('Actor, Solid, DontRemove, Block, spr_bush')
.bind("SaveData", function (data, prepare) {
	data.attr.x = this.x;
	data.attr.y = this.y;
});
}
});

// A village is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Village', {
init: function() {
this.requires('Actor, DontRemove, Block, spr_village')
.bind("SaveData", function (data, prepare) {
	data.attr.x = this.x;
	data.attr.y = this.y;
});
this.entType = 'Village';
},
 
// Process a visitation with this village
visit: function() {
this.destroy();
Crafty.trigger('VillageVisited', this);
},
});

Crafty.c('Consumeable', {
init: function () {
this.requires('Actor,DontRemove,Block,spr_village')
.bind("SaveData",function(data,prepare){
	data.attr.x = this.x;
	data.attr.y = this.y;
});
}
});

Crafty.c('Full_Heal',{
init: function () {
this.requires('Consumeable')
.bind("SaveData",function(data,prepare){
	data.attr.x = this.x;
	data.attr.y = this.y;
});
},
feast: function() {
this.destroy()
player_hp = max_hp;
},
});








