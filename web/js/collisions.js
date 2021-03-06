function detect_collisions(){
    player_player_collisions();
    player_coin_collisions();
    player_powerup_collisions();
    player_missile_collisions();
    player_skill_orb_collisions();
}

function player_player_collisions(){
    for ( var i = 0; i < players.length; i++ ){
        for ( var j = i+1; j < players.length; j++ ){
            var player1 = players[i];
            var player2 = players[j];

            if ( player1.invisible || player2.invisible ){
                continue;
            }

            var distance = get_sprite_distance( player1, player2 );
            var sizes = ( player1.get_size() + player2.get_size() )/2.0;
            if ( distance-2 < sizes ){ // Collision
                var p1_momentum = player1.get_total_momentum();
                var p2_momentum = player2.get_total_momentum();

                var angle1_new = -1*get_sprite_angle(player2,player1);
                var angle2_new = -1*get_sprite_angle(player1,player2);

                var angle1 = get_sprite_angle(player1,player2);
                var angle2 = Math.PI - get_sprite_angle(player1,player2);

                player1.collision_velocity_update(p2_momentum,angle1_new);
                player2.collision_velocity_update(p1_momentum,angle2_new);

                var penetration = sizes-distance+4;
                player1.collision_position_update(penetration/2,angle1);
                player2.collision_position_update(penetration/2,angle2);

                player1.inflict_collision_powerups(player2.get_collision_powerups(),player2);
                player2.inflict_collision_powerups(player1.get_collision_powerups(),player1);

                play_sfx('bump');
            }
        }
    }
}

function player_coin_collisions(){
    var remaining_coins = []
    for ( var i = 0; i < coins.length; i++ ){
        var coin = coins[i];
        var coin_remains = true;
        for ( var j = 0; j < players.length; j++ ){
            var player = players[j];

            var distance = get_sprite_distance( player, coin );
            var sizes = ( player.get_size() + coin.get_size() )/2.0;
            if ( distance-2 < sizes ){ // Collision
                coin_remains = false;
                player.add_coin();
            }
            else if ( player.is_magent() == true ){
                if ( distance < sizes * 15 ){
                    coin.move(player,5);
                }
            }
            else {
                if ( distance < sizes * 3 ){
                    coin.move(player,1);
                }
            }
            
        }
        if ( coin_remains == true ){
            remaining_coins.push( coin );
        }
    }
    coins = remaining_coins;
}

function player_skill_orb_collisions(){
    var remaining_skill_orbs = []
    for ( var i = 0; i < skill_orbs.length; i++ ){
        var skill_orb = skill_orbs[i];
        var skill_orb_remains = true;
        skill_orb.drift();
        for ( var j = 0; j < players.length; j++ ){
            var player = players[j];

            var distance = get_sprite_distance( player, skill_orb );
            var sizes = ( player.get_size() + skill_orb.get_size() )/2.0;
            if ( distance < sizes ){ // Collision
                skill_orb_remains = player.add_skill_orb_hit();
                var angle = -1*get_sprite_angle(player,skill_orb);
                var player_momentum = player.get_total_momentum();
                var penetration = sizes-distance+4;
                player.collision_position_update(penetration/2,angle);
                skill_orb.collision_velocity_update(player_momentum,angle);
                play_sfx('twing');
                //var multiplier = 1.2;
                //player.collision_velocity_update([multiplier*player_momentum[0],multiplier*player_momentum[1]],angle);
            }
            /*
            else if ( player.is_magent() == true ){
                if ( distance < sizes * 15 ){
                    skill_orb.move(player,5);
                }
            }
            else {
                if ( distance < sizes * 3 ){
                    skill_orb.move(player,1);
                }
            }
            */
            
        }
        if ( skill_orb_remains == true ){
            remaining_skill_orbs.push( skill_orb );
        }
    }
    skill_orbs = remaining_skill_orbs;
}

function get_collide_with_player(sprite){
    for ( var j = 0; j < players.length; j++ ){
        var player = players[j];
        if ( get_sprite_distance( player, sprite ) - 2 < ( player.get_size() + sprite.get_size() )/2.0 ){
            return true;
        }
    }
}

function player_powerup_collisions(){
    var remaining_powerups = []
    for ( var i = 0; i < powerups.length; i++ ){
        var powerup = powerups[i];
        var powerup_remains = true;
        for ( var j = 0; j < players.length; j++ ){
            var player = players[j];

            var distance = get_sprite_distance( player, powerup );
            var sizes = ( player.get_size() + powerup.get_size() )/2.0;
            if ( distance-2 < sizes ){ // Collision
                powerup_remains = false;
                player.add_powerup(powerup.get_ability(player));
            }
        }
        if ( powerup_remains == true ){
            remaining_powerups.push( powerup );
        }
    }
    powerups = remaining_powerups;
}

function player_missile_collisions(){
    var remaining_missiles = []
    for ( var i = 0; i < missiles.length; i++ ){
        var missile = missiles[i];
        var missile_remains = true;
        var team = missile.get_team();

        var min_distance = undefined;
        var selected_player = undefined;

        for ( var j = 0; j < players.length; j++ ){

            var player = players[j];

            // Same Team
            if ( player.team.team_id == team.team_id ) {
                //console.log( player.team.team_id, team.team_id, player.player_name, missile.get_owner().player_name );
                continue;
            }

            // Invisible Player
            if ( player.invisible ){
                continue;
            }

            var distance = get_sprite_distance( player, missile );
            var sizes = ( player.get_size() + missile.get_size() )/2.0;

            if ( distance-2 < sizes ){ // Collision
                missile_remains = false;
                missile.has_hit = true;
                player.missile_hit(missile);
            }

            if ( missile.get_is_dead() ){
                missile_remains = false;
            }
            else if ( min_distance == undefined || distance < min_distance ){
                selected_player = player;
                min_distance = distance;
            }
        }

        if ( selected_player == undefined ){
            missile_remains = false;
        }

        if ( missile_remains == true ){
            if ( selected_player.is_magent() == true ){
                //if ( distance < sizes * 100 ){
                    missile.move(selected_player,2);
                //}
            }
            else {
            //else if ( distance < sizes * 100 ){
                missile.move(selected_player,1);
            }            

            remaining_missiles.push( missile );
        }
        else {
            add_dead_missile(missile);
        }
    
        missile.update();

    }
    missiles = remaining_missiles;
}
