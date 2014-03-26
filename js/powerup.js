var available = ['Attack','Steal','Magnet','CoinBurst','SpeedBoost','Elastic','Missile'];
//var available = ['Magnet','Attack','CoinBurst'];

var use_icons = true;
// --------------- Powerups ------------- //

function Powerup(){ 

    this.owner = undefined;

    this.get_collision_based = function(){
        return this.collision_based;
    }

    this.get_type = function(){
        return this.type;
    }  

    this.check_lifetime = function(){
        if ( get_time() > this.start_time + this.lifetime ){
            return true;
        }
        return false;
    }

    this.set_owner = function(owner){
        this.owner = owner;
    }

    this.activate = function(){
        this.sfx();
    }
        
    this.sfx = function(){
        play_sfx('beep');
    }

} 

// Attack Powerup
AttackPowerup.prototype = new Powerup();
AttackPowerup.prototype.constructor=AttackPowerup; 
function AttackPowerup(player){

    this.start_time = get_time();
    this.lifetime = 250;
    this.collision_based = true;
    this.type = "Attack";
    this.set_owner(player);
    this.activate();

    this.get_abbreviation = function(){
        return "A";
    }    
}

// Steal Powerup
StealPowerup.prototype = new Powerup();
StealPowerup.prototype.constructor=StealPowerup; 
function StealPowerup(player){

    this.start_time = get_time();
    this.lifetime = 250;
    this.collision_based = true;
    this.type = "Steal";
    this.set_owner(player);
    this.activate();

    this.get_abbreviation = function(){
        return "S";
    }    
}

// Magent Powerup
MagentPowerup.prototype = new Powerup();
MagentPowerup.prototype.constructor=MagentPowerup; 
function MagentPowerup(player){

    this.start_time = get_time();
    this.lifetime = 250;
    this.collision_based = false;
    this.type = "Magnet";
    this.set_owner(player);
    this.activate();

    this.get_abbreviation = function(){
        return "M";
    }    
}

// CoinBurst Powerup
CoinBurstPowerup.prototype = new Powerup();
CoinBurstPowerup.prototype.constructor=CoinBurstPowerup; 
function CoinBurstPowerup(x,y,player){

    this.start_time = get_time();
    this.lifetime = 0;
    this.collision_based = false;
    this.type = "CoinBurst";
    this.coin_count = 7;
    this.set_owner(player);
    this.activate();

    burst_coins(x,y,this.coin_count,player);

    this.get_abbreviation = function(){
        return "C";
    }    
}

// SpeedBoost Powerup
SpeedBoostPowerup.prototype = new Powerup();
SpeedBoostPowerup.prototype.constructor=SpeedBoostPowerup; 
function SpeedBoostPowerup(x,y,player){

    this.start_time = get_time();
    this.lifetime = 250;
    this.collision_based = false;
    this.type = "SpeedBoost";
    this.set_owner(player);
    this.multiplier = 3;
    this.activate();

    this.get_abbreviation = function(){
        return "Sp";
    }    

    this.get_multiplier = function(){
        return this.multiplier;
    }
}

// Elastic Powerup
ElasticPowerup.prototype = new Powerup();
ElasticPowerup.prototype.constructor=ElasticPowerup; 
function ElasticPowerup(x,y,player){

    this.start_time = get_time();
    this.lifetime = 250;
    this.collision_based = false;
    this.type = "Elastic";
    this.set_owner(player);
    this.activate();

    this.get_abbreviation = function(){
        return "E";
    }    

}

// Missile Powerup
MissilePowerup.prototype = new Powerup();
MissilePowerup.prototype.constructor=MissilePowerup; 
function MissilePowerup(x,y,player){

    this.start_time = get_time();
    this.lifetime = 0;
    this.collision_based = true;
    this.type = "Missile";
    this.set_owner(player);
    this.activate();
    this.count = 3;

    add_missiles(this.count,player);

    this.get_abbreviation = function(){
        return "Mi";
    }    
}

// --------------- Powerup Tokens ------------- //

function PowerupToken(){
    this.x;
    this.y;
    this.size = 15;
    
    this.get_position = function(){
        return [this.x,this.y];
    }

    this.get_size = function(){
        return this.size;
    }

    this.draw_generic = function(){
        ctx.globalAlpha=0.5;
        ctx.beginPath();
        ctx.lineWidth=1;
        ctx.strokeStyle=colors.WHITE;
        ctx.rect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
        ctx.stroke();

        ctx.globalAlpha=0.15;
        ctx.fillStyle = colors.WHITE;
        ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
        ctx.globalAlpha=1.0;
    }

    this.set_random_position = function(xrange,yrange,xmin,ymin){ 
        this.x = (xrange-this.size)*Math.random() + xmin + this.size/2.0;
        this.y = (yrange-this.size)*Math.random() + ymin + this.size/2.0;
    }
} 

// Attack Powerup Token
AttackPowerupToken.prototype = new PowerupToken();
AttackPowerupToken.prototype.constructor=AttackPowerupToken; 
function AttackPowerupToken(){

    this.get_ability = function(player){
        return new AttackPowerup(player);
    }

    this.draw = function(ctx){

        if ( !use_icons ){
            this.draw_generic();
            this.draw_non_icon();
        }
        else {        
            this.draw_generic();
            this.draw_icon();
        }
    
    }

    this.draw_non_icon = function(){
        ctx.globalAlpha=0.75;
        ctx.font="12px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText("A", this.x+3-this.size/2, this.y+11-this.size/2);        
    }

    this.draw_icon = function(){
        add_icon(this.x-this.size/2,this.y-this.size/2,'Attack');
    }

}

// Steal Powerup Token
StealPowerupToken.prototype = new PowerupToken();
StealPowerupToken.prototype.constructor=StealPowerupToken; 
function StealPowerupToken(){

    this.get_ability = function(player){
        return new StealPowerup(player);
    }

    this.draw = function(ctx){

        if ( !use_icons ){
            this.draw_generic();
            this.draw_non_icon();   
        }
        else {        
            this.draw_generic();
            this.draw_icon();
        }
    
    }

    this.draw_non_icon = function(){
        ctx.globalAlpha=0.75;
        ctx.font="12px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText("S", this.x+3-this.size/2, this.y+11-this.size/2);       
    }

    this.draw_icon = function(){
        add_icon(this.x-this.size/2,this.y-this.size/2,'Steal');
    }

}

// Magent Powerup Token
MagnetPowerupToken.prototype = new PowerupToken();
MagnetPowerupToken.prototype.constructor=MagnetPowerupToken; 
function MagnetPowerupToken(){

    this.get_ability = function(player){
        return new MagentPowerup(player);
    }

    this.draw = function(ctx){

        if ( !use_icons ){
            this.draw_generic();
            this.draw_non_icon();   
        }        
        else {        
            this.draw_generic();
            this.draw_icon();
        }
    
    }

    this.draw_non_icon = function(){
        ctx.globalAlpha=0.75;
        ctx.font="12px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText("M", this.x+3-this.size/2, this.y+11-this.size/2);     
    }

    this.draw_icon = function(){
        add_icon(this.x-this.size/2,this.y-this.size/2,'Magnet');
    }

}

// CoinBurst Powerup Token
CoinBurstPowerupToken.prototype = new PowerupToken();
CoinBurstPowerupToken.prototype.constructor=CoinBurstPowerupToken; 
function CoinBurstPowerupToken(){

    this.get_ability = function(player){
        return new CoinBurstPowerup(this.x,this.y,player);
    }

    this.draw = function(ctx){

        if ( !use_icons ){
            this.draw_generic();
            this.draw_non_icon();   
        }        
        else {  
            this.draw_generic();      
            this.draw_icon();
        }
    
    }

    this.draw_non_icon = function(){
        ctx.globalAlpha=0.75;
        ctx.font="12px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText("C", this.x+3-this.size/2, this.y+11-this.size/2);     
    }

    this.draw_icon = function(){
        add_icon(this.x-this.size/2,this.y-this.size/2,'CoinBurst');
    }

}

// SpeedBoost Powerup Token
SpeedBoostPowerupToken.prototype = new PowerupToken();
SpeedBoostPowerupToken.prototype.constructor=SpeedBoostPowerupToken; 
function SpeedBoostPowerupToken(){

    this.get_ability = function(player){
        return new SpeedBoostPowerup(this.x,this.y,player);
    }

    this.draw = function(ctx){

        if ( !use_icons ){
            this.draw_generic();
            this.draw_non_icon();   
        }        
        else {       
            this.draw_generic(); 
            this.draw_icon();
        }
    
    }

    this.draw_non_icon = function(){
        ctx.globalAlpha=0.75;
        ctx.font="12px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText("Sp", this.x+3-this.size/2, this.y+11-this.size/2);    
    }

    this.draw_icon = function(){
        add_icon(this.x-this.size/2,this.y-this.size/2,'SpeedBoost');
    }

}

// Elastic Powerup Token
ElasticPowerupToken.prototype = new PowerupToken();
ElasticPowerupToken.prototype.constructor=ElasticPowerupToken; 
function ElasticPowerupToken(){

    this.get_ability = function(player){
        return new ElasticPowerup(this.x,this.y,player);
    }

    this.draw = function(ctx){

        if ( !use_icons ){
            this.draw_generic();
            this.draw_non_icon();   
        }        
        else {   
            this.draw_generic();     
            this.draw_icon();
        }
    
    }

    this.draw_non_icon = function(){
        ctx.globalAlpha=0.75;
        ctx.font="12px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText("E", this.x+3-this.size/2, this.y+11-this.size/2);   
    }

    this.draw_icon = function(){
        add_icon(this.x-this.size/2,this.y-this.size/2,'Elastic');
    }

}

// Missile Powerup Token
MissilePowerupToken.prototype = new PowerupToken();
MissilePowerupToken.prototype.constructor=MissilePowerupToken; 
function MissilePowerupToken(){

    this.get_ability = function(player){
        return new MissilePowerup(this.x,this.y,player);
    }

    this.draw = function(ctx){

        if ( !use_icons ){
            this.draw_generic();
            this.draw_non_icon();   
        }        
        else {  
            this.draw_generic();      
            this.draw_icon();
        }
    
    }

    this.draw_non_icon = function(){
        ctx.globalAlpha=0.75;
        ctx.font="12px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText("Mi", this.x+3-this.size/2, this.y+11-this.size/2);  
    }

    this.draw_icon = function(){
        add_icon(this.x-this.size/2,this.y-this.size/2,'Missile');
    }

}

// --------------- Create Powerup ------------- //

function create_powerup(){
    var probe = available[Math.floor((Math.random()*available.length))];    
    var new_token = undefined;


    if ( probe == 'Attack' ){
        new_token = new AttackPowerupToken();
    }
    else if ( probe == 'Steal' ){
        new_token = new StealPowerupToken();
    }
    else if ( probe == 'Magnet' ){
        new_token = new MagnetPowerupToken();
    }
    else if ( probe == 'CoinBurst' ){
        new_token = new CoinBurstPowerupToken();
    }
    else if ( probe == 'SpeedBoost' ){
        new_token = new SpeedBoostPowerupToken();
    }
    else if ( probe == 'Elastic' ){
        new_token = new ElasticPowerupToken();
    }
    else if ( probe == 'Missile' ){
        new_token = new MissilePowerupToken();
    }
    return new_token;
}
