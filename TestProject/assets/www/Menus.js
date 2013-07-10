// ******** HP HUD ************
var HUD_Array = new Array ()
var menubool = true;
HUD = function () { 
	var hp = Crafty.e("2D, DOM,Color")
	hp.color('rgb(255,0,0)')
	hp.attr({w:player_hp*33, h:25,x:0,y:240,alpha:1.0})
	
	var hp_text = Crafty.e('2D, DOM, Color, Text')
	hp_text.attr({x:60,y:230,alpha:1.0})
	hp_text.text('HP')
	
	var item1 = Crafty.e("2D,DOM,spr_door,Mouse")
	.attr({w:16,h:16,x:0,y:214,alpha:1.0})
	
	var item2 = Crafty.e("2D,DOM,spr_door,Mouse")
	.attr({w:16,h:16,x:20,y:214,alpha:1.0})
	
	var item3 = Crafty.e("2D,DOM,spr_door,Mouse")
	.attr({w:16,h:16,x:40,y:214,alpha:1.0})
	
	var exp_bar = Crafty.e('2D,DOM,Color')
	exp_bar.color('rgb(0,0,255)')
	exp_bar.attr({w:(exp/next_level)*100,h:10,x:0,y:230,alpha:1.0})
	console.log(exp)
	
	var level_display = Crafty.e('2D,DOM,Color,Text')
	level_display.attr({x:5,y:10,alpha:1.0})
	level_display.text(level)
	
	
	HUD_Array.push(hp,hp_text,item1,item2,item3,exp_bar,level_display);
}

    

resetHUD = function() {
    while(HUD_Array.length > 0)
    {
    try{HUD_Array[0].destroy();}catch(err){console.log("Destroy failed");};
    try{HUD_Array.splice(0, 1);}catch(err){console.log("Splice failed")};
    }
   
}
// *************************** STATS ***************************************

exp = 0;

next_level = 100;

player_name = "Face_Guy";
max_hp = 3;

player_hp = 3;

beard_power = 1;

speed = 2; 

level = 1; 

