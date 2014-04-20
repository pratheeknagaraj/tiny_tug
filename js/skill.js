var skills_list = ['lightning','plunder','nuclear','barrage','invisible'];

// ------------- Skill Objects -------------------- //
function Skill(){ 

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

// Lightning Skill
LightningSkill.prototype = new Powerup();
LightningSkill.prototype.constructor=LightningSkill; 
function LightningSkill(player){

    this.start_time = get_time();
    this.lifetime = 30;
    this.collision_based = false;
    this.type = "Lightning";
    this.set_owner(player);
    this.activate();
    this.hit = false;
    this.players_hit = [];
    this.angle = 0;

    this.run_skill = function(){
        if ( this.hit == false ){
            players_hit = invoke_lightning(this.owner);
            this.hit = true;
            play_sfx('electric_spark');
        }        
        draw_lightning(players_hit,this.angle);
        this.angle += Math.PI*4/this.lifetime;

    }

    this.end_skill = function(){
        return;
    }
}

// Barrage Skill
BarrageSkill.prototype = new Powerup();
BarrageSkill.prototype.constructor=BarrageSkill; 
function BarrageSkill(player){

    this.start_time = get_time();
    this.lifetime = 120;
    this.collision_based = false;
    this.type = "Barrage";
    this.set_owner(player);
    this.activate();
    this.angle = 0;

    this.run_skill = function(){
        if ( ( get_time() - this.lifetime )%2 == 0 ){
            invoke_barrage(this.owner,this.angle);
            this.angle += 6 * (2*Math.PI)/this.lifetime;
            play_sfx('missile_blip');
        }
    }

    this.end_skill = function(){
        return;
    }
}

// Invisible Skill
InvisibleSkill.prototype = new Powerup();
InvisibleSkill.prototype.constructor=InvisibleSkill; 
function InvisibleSkill(player){

    this.start_time = get_time();
    this.lifetime = 5*60;
    this.collision_based = false;
    this.type = "Invisible";
    this.set_owner(player);
    this.activate();
    this.angle = 0;

    play_sfx('invisible');

    this.run_skill = function(){
        invoke_invisible(this.owner,true);
    }

    this.end_skill = function(){
        invoke_invisible(this.owner,false);
    }
}

// Nuclear Skill
NuclearSkill.prototype = new Powerup();
NuclearSkill.prototype.constructor=NuclearSkill; 
function NuclearSkill(player){

    this.start_time = get_time();
    this.lifetime = 3*60;
    this.collision_based = false;
    this.type = "Nuclear";
    this.set_owner(player);
    this.activate();

    this.owner.nuclear_start();
    play_sfx('nuclear');

    this.run_skill = function(){
        return;
    }

    this.end_skill = function(){
        var nuclear_x = this.owner.nuclear_x;
        var nuclear_y = this.owner.nuclear_y;
        var nuclear_size = this.owner.nuclear_size;
        invoke_nuclear(nuclear_x,nuclear_y,nuclear_size,this.owner);
        this.owner.nuclear_end();
    }
}

// Plunder Skill
PlunderSkill.prototype = new Powerup();
PlunderSkill.prototype.constructor=PlunderSkill; 
function PlunderSkill(player){

    this.start_time = get_time();
    this.lifetime = 3*60;
    this.collision_based = false;
    this.type = "Plunder";
    this.set_owner(player);
    this.activate();
    this.loser = undefined;

    this.run_skill = function(){
      if ( ( get_time() - this.lifetime )%2 == 0 ){
            this.loser = invoke_plunder(this.owner);
        } 
        draw_plunders(this.owner,this.loser);
    }

    this.end_skill = function(){
        return;
    }
}

// ----------------- Skill Functionality ------------- //
function invoke_lightning(owner){

    var players_hit = [];

    for ( var j = 0; j < players.length; j++ ){
        var player = players[j];
        
        // Owner Player Skip
        if ( player.player_id == owner.player_id ){
            continue;
        }

        // Team Mates Skip
        if ( player.team == owner.team ){
            continue;
        }

        var owner_coins = owner.get_coins();
        var player_coins = player.get_coins();

        var new_player_coins = Math.floor(player_coins*0.66);
        var aggressive_value = player_coins - new_player_coins;

        owner.add_aggressive_count( aggressive_value );
        player.subtract_coins( aggressive_value );

        players_hit.push(player);
    }

    return players_hit;

}

function invoke_barrage(owner,angle){
    add_missiles(1,owner,angle);
}

function invoke_invisible(owner,setting){
    owner.set_invisible(setting);
}

function invoke_nuclear(cen_x,cen_y,size,owner){

    for ( var j = 0; j < players.length; j++ ){
        var player = players[j];
        
        // Owner Player Skip
        if ( player.player_id == owner.player_id ){
            continue;
        }

        // Team Mates Skip
        if ( player.team == owner.team ){
            continue;
        }

        var distance = get_sprite_coord_distance(player,cen_x,cen_y);
        if ( distance - player.get_size()/2.0 < size ){
            // Nuclear HIT!
            var player_coins = player.get_coins();
            var hit_ratio = 1.0 - ( (distance - player.get_size()/2.0) / size );
            var new_player_coins = Math.floor(player_coins * hit_ratio * 0.25);
            var aggressive_value = player_coins - new_player_coins;

            owner.add_aggressive_count( aggressive_value );
            player.subtract_coins( aggressive_value );
        } 
    }
}

function invoke_plunder(owner){

    var threshold_distance = 250;
    var selected_player = undefined;
    var selected_distance = undefined;

    for ( var j = 0; j < players.length; j++ ){
        var player = players[j];
        
        // Owner Player Skip
        if ( player.player_id == owner.player_id ){
            continue;
        }

        // Team Mates Skip
        if ( player.team == owner.team ){
            continue;
        }

        var distance = get_sprite_distance(player,owner);

        if ( distance < threshold_distance && ( selected_player == undefined || distance < selected_distance ) ){
            // Plunder!
            var player_coins = player.get_coins();
            if ( player_coins < 1 ){
                continue;
            }
            selected_player = player;
            selected_distance = distance;
            
        } 
    }

    var aggressive_value = 1;

    if ( selected_player != undefined ){
        owner.add_aggressive_count( aggressive_value );
        owner.add_coins( aggressive_value );

        selected_player.subtract_coins( aggressive_value );
        play_sfx('plunder_pop');
    }
    return selected_player;
}

// ------------------- Skill Helper ------------------ //
function activate_skill(player){
    return get_skill(player);
}

function get_skill(player){
    var player_skill = player.get_skill_type();

    if ( player_skill == 'lightning' ){
        return new LightningSkill(player);
    }
    else if ( player_skill == 'plunder' ){
        return new PlunderSkill(player);
    }
    else if ( player_skill == 'nuclear' ){
        return new NuclearSkill(player);    
    }
    else if ( player_skill == 'barrage' ){
        return new BarrageSkill(player);
    }
    else if ( player_skill == 'invisible' ){
        return new InvisibleSkill(player);    
    }
    return;
}
