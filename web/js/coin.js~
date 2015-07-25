Coin.prototype.constructor=Coin; 
function Coin(){
    this.x = 0;
    this.y = 0;
    this.size = 5;
    this.mass = 5;

    this.get_position = function(){
        return [this.x, this.y];
    }

    this.get_size = function(){
        return this.size;
    }

    this.set_random_position = function(xrange,yrange,xmin,ymin){ 
        this.x = xrange*Math.random() + xmin;
        this.y = yrange*Math.random() + ymin;
    }   

    this.set_position = function(x,y){ 
        this.x = x;
        this.y = y;
    } 

    this.move = function(player,multiplier){
        var force = 3 * multiplier * player.get_mass() * this.mass / Math.pow(get_sprite_distance(this,player),2.0);
        var angle = get_sprite_angle(player,this);
        this.x += force*Math.cos(angle);
        this.y += force*Math.sin(angle);
    }
}

function create_coin(){
    return new Coin();
}

LostCoin.prototype.constructor=LostCoin; 
function LostCoin(pos){
    this.x = pos[0];
    this.y = pos[1];
    this.size = 5;
    this.angle = Math.random()*2*Math.PI;
    this.dist = 2;
    this.dx = Math.cos(this.angle)*this.dist;
    this.dy = Math.sin(this.angle)*this.dist;
    this.lifetime = 25;
    this.life_count = 0;

    this.get_is_dead = function(){
        if ( this.life_count > this.lifetime ){
            return true;
        }
        return false;
    }

    this.get_position = function(){
        return [this.x, this.y];
    }

    this.get_size = function(){
        return this.size;
    }

    this.update = function(){
        this.x += this.dx;
        this.y += this.dy;
        this.life_count += 1;
    }

    this.get_alpha = function(){
        return 0.5 - this.life_count*2/100.0;
    }
}

function create_lost_coin(pos){
    return new LostCoin(pos);
}

function create_coins(){
    while ( coins.length < max_coins ){
        var new_coin = create_coin();
        new_coin.set_random_position(x_range,y_range,x_min,y_min);
        coins.push( new_coin );
    }
}

function add_lost_coins(count,pos){
    for ( var i = 0; i < count; i++ ){
        var coin = create_lost_coin(pos);
        lost_coins.push( coin );
    }
}

function remove_lost_coins(){
    var new_lost_coins = [];
    for ( var i = 0; i < lost_coins.length; i++ ){
        var coin = lost_coins[i];
        if ( coin.get_is_dead() == false ){
            new_lost_coins.push( coin );
        }
    }
    lost_coins = new_lost_coins;
}

function burst_coins(x,y,count,player){
    var radius = player.get_size();
    var position = player.get_position();
    for ( var i = 0; i < count; i++ ){
        var new_coin = create_coin();
        var angle = Math.random()*Math.PI*2;
        var x = Math.cos(angle) * ( radius + 10 ) + position[0];
        var y = Math.sin(angle) * ( radius + 10 ) + position[1];
        while ( check_if_valid_interior(x,y) == false ){
            var angle = Math.random()*Math.PI*2;
            var x = Math.cos(angle) * ( radius + 10 ) + position[0];
            var y = Math.sin(angle) * ( radius + 10 ) + position[1];
        }
        new_coin.set_position(x,y);
        coins.push( new_coin );
    }
}
