

function get_total_tension(id){
    var tension = [0,0];
    var player = id_to_player[id];
    var player_pos = player.get_position();
    for ( var j in teathers[id] ){
        var teather = teathers[id][j];
        var tension_value = teather.get_tension();
        var other_player = id_to_player[j];
        var other_player_pos = other_player.get_position();
        var angle = Math.atan2( -(player_pos[1] - other_player_pos[1]), -(player_pos[0] - other_player_pos[0]) );
        tension[0] = tension[0] + tension_value*Math.cos(angle);
        tension[1] = tension[1] + tension_value*Math.sin(angle);
    }
    return tension;
}

function update_players(){
    
    for ( var i in players ){  
        var player = players[i];

        var friction = 1.00;
        var fatigue = 1.00;
        var horiz = 0;
        var vert = 0;
        var tension = get_total_tension(player.get_player_id());

        var keyboard_moves = get_keyboard_moves(player.get_player_id());
        var double_taps = get_double_taps(player.get_player_id());

        var modifiers = get_modifiers_from_position(player.get_position())
        
        var others = [];
        for ( key in modifiers ){
            if ( key == "Friction" ){
                friction = modifiers["Friction"];
            }
            else if ( key == "Fatigue" ){
                fatigue = modifiers["Fatigue"];
            }
            else {
                others.push( [key,modifiers[key]] );
            }
        }

        player.calculate_move(tension,keyboard_moves[0],keyboard_moves[1],double_taps[0],double_taps[1],friction,fatigue,others,delta_time);
    }

    for ( var j in players ){
        var player = players[j];
        
        player.update();
    }
}

// --------------- HELPER FUNCTIONS ----------------- //

function get_sprite_angle(s1,s2){
    var pos1 = s1.get_position();
    var pos2 = s2.get_position();
    return Math.atan2( pos1[1] - pos2[1], pos1[0] - pos2[0] );
}

function check_if_valid_interior(x,y){
    var boundaries = get_game_boundaries();
    if ( x > boundaries[0] && x < boundaries[2] && y > boundaries[1] && y < boundaries[3] ){
        return true;
    }
    return false;
}

function get_game_boundaries(){
    return boundaries;
}


function get_distance(x1,x2,y1,y2){
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function get_sprite_distance(s1,s2){
    var s1_pos = s1.get_position();
    var s2_pos = s2.get_position();
    return get_distance( s1_pos[0], s2_pos[0], s1_pos[1], s2_pos[1] );
}

