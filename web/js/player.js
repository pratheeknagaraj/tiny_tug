Player.prototype = new Player();
Player.prototype.constructor=Player; 
function Player(team,name,id,ai,game){
    this.player_name = name;
    this.player_id = id;
    this.team = team;
    this.x = 0;
    this.y = 0;
    this.coins = 0;
    this.coins_collected = 0;
    this.base_size = 10;
    this.size = this.base_size; // + 10 * Math.random();
    this.ai = ai;
    this.game = game;
    this.team = undefined;

    this.double_tap_counter = 90;
    this.sprint_count = 0;
    this.total_press_count = 0;

    this.base_tension_multiplier = 1.0;
    this.tension_multiplier = this.base_tension_multiplier;

    this.vx = 0;
    this.vy = 0;
    this.dx = 0;
    this.dy = 0;

    this.distance_traveled = 0;

    this.base_mass = 25;
    this.growth_rate = 0.5;
    this.mass = this.base_mass;
    this.base_texture = 0.95;
    this.texture = this.base_texture;
    this.base_strength = 8;
    this.strength = this.base_strength; 
    this.base_fatigue = 1.00;
    this.fatigue = this.base_fatigue;  

    this.powerups_map = {};
    this.powerups = [];   

    this.powerups_collected = 0; 
    this.aggressive_count = 0;

    this.skill_hit_count = 0;
    this.skill_hit_threshold = 10;
    this.skill_activated = false;
    this.skill = undefined;
    this.skill_type = undefined;

    this.invisible = false;

    this.is_nuclear = false;
    this.nuclear_timer_max = 3*60;
    this.nuclear_x = -1;
    this.nuclear_y = -1;
    this.nuclear_timer = 0;
    this.nuclear_number = 0;

    this.self_timer = 0;
    this.last_orb_time = 0;

    this.game_xmin = -1;
    this.game_ymin = -1;
    this.game_xrange = -1;
    this.game_yrange = -1;

    this.set_skill_type = function(skill_type){
        this.skill_type = skill_type;
    }

    this.get_skill_type = function(){
        return this.skill_type;
    }

    this.get_position = function(){
        //return [this.x - this.size/2, this.y - this.size/2];
        return [this.x,this.y];
    }

    this.get_size = function(){
        return this.size;
    }

    this.get_mass = function(){
        return this.mass;
    }

    this.get_team = function(){
        return this.team;
    }

    this.get_player_id = function(){
        return this.player_id
    }

    this.is_magent = function(){
        return "Magnet" in this.powerups_map;
    }

    this.set_random_start = function(xrange,yrange,xmin,ymin){ 
        this.x = xrange*Math.random() + xmin;
        this.y = yrange*Math.random() + ymin;

        this.game_xmin = xmin;
        this.game_ymin = ymin;
        this.game_xrange = xrange;
        this.game_yrange = yrange;
    }

    this.in_fire = function(prob){
        if ( Math.random() < prob ) {
            this.subtract_coin();
        }
    }

    this.set_invisible = function(setting){
        this.invisible = setting;
    }

    this.set_metal = function(){
        
    }

    this.calculate_move = function(tension,horiz,vert,double_tap_x,double_tap_y,friction,fatigue,others,dt){

        if ( others.length > 0 ){
            for ( var i = 0; i < others.length; i++ ){
                var modifier = others[i];
                if ( modifier[0] == "Fire" ){
                    this.in_fire(modifier[1]);
                }
            }
        }

        if ( this.is_nuclear ){
            var nuclear_horiz = horiz;
            var nuclear_vert = vert;
            this.nuclear_move(nuclear_horiz,nuclear_vert);
            horiz = 0;
            vert = 0;        
        }

        var tx = tension[0]*this.tension_multiplier;
        var ty = tension[1]*this.tension_multiplier;

        var fx = horiz*this.strength*fatigue;
        var fy = vert*this.strength*fatigue;

        var eff_fx = fx;
        var eff_fy = fy;

        // Invisibility Bonus
        if ( this.invisible ){
            eff_fx *= 1.5;
            eff_fy *= 1.5;
        }

        if ( this.double_tap_counter > 90 && ( double_tap_x != 0 || double_tap_y != 0 )  ){
            eff_fx += double_tap_x*300;
            eff_fy += double_tap_y*300;
            this.double_tap_counter = 0;
            this.sprint_count += 1;
        }

        var ax = tx/this.mass+eff_fx/this.mass;
        var ay = ty/this.mass+eff_fy/this.mass;

        var dvx = ax*dt;
        var dvy = ay*dt;

        this.vx = friction*this.texture*(this.vx + dvx);
        this.vy = friction*this.texture*(this.vy + dvy);

        this.dx = (dvx + this.vx)*dt
        this.dy = (dvy + this.vy)*dt

        this.distance_traveled += Math.abs(this.dx) + Math.abs(this.dy);

        this.check_boundaries();

        this.double_tap_counter += 1;
    }

    this.nuclear_move = function(horiz,vert){
        this.nuclear_x += horiz*5;
        this.nuclear_y += vert*5;
        this.nuclear_timer += 1;
        this.nuclear_size = 50 + 75*(this.nuclear_timer*1.0/this.nuclear_timer_max);
        this.nuclear_number = Math.ceil( (this.nuclear_timer_max - this.nuclear_timer)/(1.0*fps) );

        if ( this.nuclear_x > this.game_xmin + this.game_xrange - this.nuclear_size/2.0 ){
            this.nuclear_x = this.game_xmin + this.game_xrange - this.nuclear_size/2.0;
        }

        if ( this.nuclear_x < this.game_xmin + this.nuclear_size/2.0 ){
            this.nuclear_x = this.game_xmin + this.nuclear_size/2.0;
        }

        if ( this.nuclear_y > this.game_ymin + this.game_yrange - this.nuclear_size/2.0 ){
            this.nuclear_y = this.game_ymin + this.game_yrange - this.nuclear_size/2.0;
        }

        if ( this.nuclear_y < this.game_ymin + this.nuclear_size/2.0 ){
            this.nuclear_y = this.game_ymin + this.nuclear_size/2.0;
        }
    }

    this.nuclear_start = function(){
        this.set_invisible(true);
        this.is_nuclear = true;
        this.nuclear_timer = 0;
        this.nuclear_x = this.game_xmin + this.game_xrange/2.0;
        this.nuclear_y = this.game_ymin + this.game_yrange/2.0;
    }

    this.nuclear_end = function(){
        this.set_invisible(false);
        this.is_nuclear = false;
        this.nuclear_timer = 0;
    }

    this.add_press_count = function(horiz,vert){
        this.total_press_count += Math.abs(horiz) + Math.abs(vert);
    }

    this.get_total_press_count = function(){
        return this.total_press_count;
    }

    this.get_distance_traveled = function(){
        return this.distance_traveled;
    }

    this.get_coins_collected_count = function(){
        return this.coins_collected;
    }

    this.get_powerups_collected_count = function(){
        return this.powerups_collected;
    }

    this.get_aggressive_count = function(){
        return this.aggressive_count;
    }

    this.get_sprint_count = function(){
        return this.sprint_count;
    }

    this.set_team = function(team){
        this.team = team;
    }

    this.update = function(){
        this.use_abilities();
        this.use_skills();
        this.make_move();
        this.update_timer();
    }

    this.update_timer = function(){
        this.self_timer += 1;
        this.skill_orb_timeout();
    }   

    this.collision_update = function(){
        this.update_mass(); 
        this.update_size();
    }

    this.make_move = function(){
        this.x += this.dx;
        this.y += this.dy;
    }

    this.get_total_momentum = function(){
        return [this.mass * this.vx, this.mass * this.vy];
    }

    this.add_coin = function(){
        this.coins += 1;
        this.coins_collected += 1;
        this.update_mass();
        this.update_size();
    }

    this.add_coins = function(count){
        for ( var i = 0; i < count; i++ ){
            this.add_coin();
        }
    }

    this.subtract_coin = function(){
        if ( this.coins > 0 ){
            this.coins -= 1;
            this.update_mass();
            this.update_size();
            add_lost_coins(1,this.get_position());
        }
    }

    this.subtract_coins = function(count){
        for ( var i = 0; i < count; i++ ){
            this.subtract_coin();
        }
    }

    this.get_coins = function(){
        return this.coins;
    }

    this.update_mass = function(){
        this.mass = this.base_mass + this.growth_rate * this.coins;
    }

    this.update_size = function(){
        this.size = this.base_size + this.growth_rate * this.coins;
    }

    this.check_boundaries = function(){

        var boundaries = game.get_game_boundaries();
        var hit = false;
        if ( this.x - this.size/2 < boundaries[0] ){
            this.x = boundaries[0] + this.size/2 - this.dx;
            this.vx *= -1;
            hit = true;
        }
        if ( this.y - this.size/2 < boundaries[1] ){
            this.y = boundaries[1] + this.size/2 - this.dy;
            this.vy *= -1;
            hit = true;
        }
        if ( this.x + this.size/2 > boundaries[2] ){
            this.x = boundaries[2] - this.size/2 - this.dx;
            this.vx *= -1;
            hit = true;
        }
        if ( this.y + this.size/2 > boundaries[3] ){
            this.y = boundaries[3] - this.size/2 - this.dy;
            this.vy *= -1;
            hit = true;
        }
        
        if ( hit == true ){
            play_sfx('bump2');
        }
    }
    
    this.collision_velocity_update = function(momentum,angle){

        /*
        var total_momentum = Math.pow(Math.pow(momentum[0],2) + Math.pow(momentum[1],2),0.5);
        var eff_momentum = total_momentum/this.mass;
        var vx2 = eff_momentum*Math.cos(angle);
        var vy2 = eff_momentum*Math.sin(angle);
        this.vx = vx2;
        this.vy = vy2;
        //console.log(vx2,vy2,this.player_name);
        return;
        */
        var add_velocity = [momentum[0]/this.mass, momentum[1]/this.mass];
        this.vx = add_velocity[0];
        this.vy = add_velocity[1];
    }

    this.collision_position_update = function(amount,angle){
        this.x += amount * Math.cos(angle);
        this.y += amount * Math.sin(angle); 
    }

    this.draw_info = function(ctx){

        /*
        ctx.globalAlpha=0.15;
        ctx.fillStyle = this.get_color();
        ctx.fillRect(this.x-this.size/2-5, this.y-this.size/2-12,35,10);
        ctx.globalAlpha=1.0;        
        */

        ctx.globalAlpha=0.75;
        ctx.font="10px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText(this.player_name, this.x-this.size/2-5, this.y-this.size/2-5);

        ctx.globalAlpha=1.0;
        ctx.font="8px Ubuntu";
        ctx.fillStyle = colors.GOLD_YELLOW;
        ctx.fillText(this.coins, this.x-this.size/2-10, this.y+this.size/2+10);
        //ctx.fillText(this.coins, this.x-4, this.y+4);

        //add_icon(this.x+this.size/2+5, this.y+this.size/2+5, "Attack_Red");

        ctx.globalAlpha=0.75;
        ctx.font="12px Ubuntu";
        ctx.fillStyle = colors.GREY_1;
        ctx.fillText(this.get_powerups_abbreviations_string(), this.x+this.size/2+5, this.y+this.size/2+5);
            
    }

    this.use_abilities = function(){
        this.powerups = [];
        for ( var type in this.powerups_map ){
            var powerup = this.powerups_map[type];
            if ( powerup.check_lifetime() == true ){
                
                // Remove Personal Abilities
                if ( powerup.get_type() == "SpeedBoost" ){
                    this.strength = this.base_strength;
                    this.texture = this.base_texture;
                }
                if ( powerup.get_type() == "Elastic" ){
                    modify_teathers(this,1);
                    this.tension_multiplier = this.base_tension_multiplier;
                }
                
                delete this.powerups_map[type];
                continue;
            } 

            // Add Personal Abilities
            if ( powerup.get_type() == "SpeedBoost" ){
                this.strength = this.base_strength * powerup.get_multiplier();
                this.texture = 0.9;
            }
            if ( powerup.get_type() == "Elastic" ){
                modify_teathers(this, 3);
                //this.tension_multiplier = this.base_tension_multiplier * powerup.get_multiplier();
            }
            this.powerups.push( powerup );
        }
    }

    this.get_color = function(){
        return this.team.get_color();
    }

    this.add_powerup = function( new_powerup ){
        this.powerups_map[new_powerup.get_type()] = new_powerup;
        this.powerups_collected += 1;
    }

    this.get_powerups_abbreviations_string = function(){
        var powerup_abbreviations = [];
        for ( var i in this.powerups ){
            powerup_abbreviations.push( this.powerups[i].get_abbreviation() );
        }
        var powerup_abbreviations_string = powerup_abbreviations.join();
        return powerup_abbreviations_string;
    }

    this.get_collision_powerups = function(){
        var collision_powerups = [];
        for ( var i in this.powerups ){
            var powerup = this.powerups[i];
            if ( powerup.get_collision_based() == true ){
                collision_powerups.push( powerup );
            }  
        } 
        return collision_powerups;
    }

    this.missile_hit = function(missile){
        var new_coin_count = Math.max( 0, this.coins - missile.get_hit_count() );
        var count = this.coins - new_coin_count;
        this.subtract_coins( count );
        missile.get_owner().add_aggressive_count(count);
    }

    this.add_aggressive_count = function(count){
        this.aggressive_count += count;
    }

    this.add_skill_orb_hit = function(){
        this.skill_hit_count += 1;
        if ( this.skill_hit_count >= this.skill_hit_threshold ){
            this.activate_skill();
            this.skill_hit_count = 0;
            return false;
        }
        this.last_orb_time = this.self_timer;
        return true;
    }

    this.skill_orb_timeout = function(){
        if ( this.last_orb_time < this.self_timer - 60 && (this.self_timer - this.last_orb_time)%10 == 0 ){
            this.skill_hit_count = Math.max(this.skill_hit_count - 1, 0);
        } 
    }
   
    this.get_skill_hit_percent = function(){
        return this.skill_hit_count*1.0/this.skill_hit_threshold;
    }

    this.activate_skill = function(){
        this.skill = activate_skill(this);
        this.skill_activated = true;
    }

    this.use_skills = function(){
        if ( this.skill_activated == true ){
            this.skill.run_skill();
        }
        else {
            return;
        }
        if ( this.skill.check_lifetime() == true ){
            this.skill.end_skill();
            this.skill_activated = false;
            this.skill = undefined;
        }

    }

    this.inflict_collision_powerups = function(inflicted,collision_player){
        for ( var i in inflicted ){
            var powerup = inflicted[i];

            // Enemy Collisions
            if ( this.team != collision_player.get_team() ){
                if ( powerup.get_type() == "Attack" ){
                    if ( this.coins > 0 ){
                        var new_coin_count = Math.floor( this.coins/1.1 );
                        collision_player.add_aggressive_count( this.coins - new_coin_count );
                        this.subtract_coins( this.coins - new_coin_count );
                    }
                }
                else if ( powerup.get_type() == "Steal" ){
                    if ( this.coins > 0 ){
                        this.subtract_coin();
                        this.subtract_coin();
                        collision_player.add_coin();
                        collision_player.add_coin();
                        collision_player.add_aggressive_count( 2 );   
                    }
                }
            }
        }
        this.collision_update();
    }

}

function create_player(team,name,id,ai,game){
    return new Player(team,name,id,ai,game);
}
