Missile.prototype.constructor=Missile; 
function Missile(){
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.lifetime = 150 + Math.floor(150*Math.random());
    this.life_count = 0;
    this.hit_count = 3 + Math.floor(Math.random()*3);
    this.size = 1.5*this.hit_count;
    this.base_speed_multiplier = 1.0 - (this.hit_count-3)/8.0; 
    this.mass = 5;
    this.owner = undefined;
    this.has_hit = false;

    this.get_angle = function(){
        return this.angle;
    }

    this.get_is_dead = function(){
        if ( this.life_count > this.lifetime || this.has_hit == true){
            return true;
        }
        return false;
    }

    this.get_hit_count = function(){
        return this.hit_count;
    }

    this.get_position = function(){
        return [this.x, this.y];
    }

    this.get_alpha = function(){
        return 0.75 - 0.75*(this.life_count/this.lifetime);
    }

    this.get_size = function(){
        return this.size;
    }

    this.set_position = function(x,y){ 
        this.x = x;
        this.y = y;
    } 

    this.set_angle = function(angle){
        this.angle = angle;
    }

    this.set_owner = function(player){
        this.owner = player;
    }

    this.get_owner = function(){
        return this.owner;
    }

    this.get_team = function(){
        return this.owner.get_team();
    }

    this.move = function(player,force_constant){
        var force = 25 * force_constant * player.get_mass() * this.mass / Math.pow(get_sprite_distance(this,player),2.0) + 2*this.base_speed_multiplier;
        this.angle = get_sprite_angle(player,this);
        this.x += force*Math.cos(this.angle);
        this.y += force*Math.sin(this.angle);
    }

    this.update = function(){
        this.life_count += 1;
    }
}

DeadMissile.prototype.constructor=DeadMissile; 
function DeadMissile(){
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.lifetime = 25;
    this.life_count = 0;
    this.size = 7.5;
    this.mass = 5;
    this.owner = undefined;

    this.get_is_dead = function(){
        if ( this.life_count > this.lifetime ){
            return true;
        }
        return false;
    }

    this.get_position = function(){
        return [this.x, this.y];
    }

    this.get_alpha = function(){
        return 0.75 - 0.5*(this.life_count/this.lifetime);
    }

    this.get_size = function(){
        return this.size;
    }

    this.set_position = function(x,y){ 
        this.x = x;
        this.y = y;
    } 

    this.set_owner = function(player){
        this.owner = player;
    }

    this.get_owner = function(){
        return this.owner;
    }

    this.get_team = function(){
        return this.owner.get_team();
    }

    this.update = function(){
        this.life_count += 1;
        this.size += 0.2;
    }
}

function add_dead_missile(player){
    var position = player.get_position();
    var new_dead_missile = create_dead_missile();
    new_dead_missile.set_position(position[0],position[1]);
    new_dead_missile.set_owner(player);
    dead_missiles.push( new_dead_missile );
}

function remove_dead_missiles(){
    var new_dead_missiles = [];
    for ( var i = 0; i < dead_missiles.length; i++ ){
        var missile = dead_missiles[i];
        if ( missile.get_is_dead() == false ){
            missile.update();
            new_dead_missiles.push( missile );
        }
    }
    dead_missiles = new_dead_missiles;
}

function add_missiles(count,player){
    var radius = player.get_size();
    var position = player.get_position();
    for ( var i = 0; i < count; i++ ){
        var new_missile = create_missile();
        var angle = Math.random()*Math.PI*2;
        var x = Math.cos(angle) * ( radius + 10 ) + position[0];
        var y = Math.sin(angle) * ( radius + 10 ) + position[1];
        while ( check_if_valid_interior(x,y) == false ){
            angle = Math.random()*Math.PI*2;
            x = Math.cos(angle) * ( radius + 10 ) + position[0];
            y = Math.sin(angle) * ( radius + 10 ) + position[1];
        }
        new_missile.set_position(x,y);
        new_missile.set_angle(x,y);        
        new_missile.set_owner(player);
        
        missiles.push( new_missile );
    }
}

function create_missile(){
    return new Missile();
}

function create_dead_missile(){
    return new DeadMissile();
}
