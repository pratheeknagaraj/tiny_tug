// -------------------------------------------------------------

// global variables :
var sfx_on = false;
var time = 0;
var game_start = false;
var keys_pressed = {};
var players = [];
var id_to_player = {};
var teathers = {};
var move_mappings = {};
var mapped = 0;
var coins = [];
var lost_coins = [];
var max_coins = 10;

var missiles = [];
var dead_missiles = [];

var time_warning_count = 0;

var powerups = [];
var max_powerups = 5;
var powerup_frequency = 0.97;

var fps = 60;
var frame_interval = Math.round(1000/fps);
var game_over = false;

var teams = [];
var team_stats = {};

var key_up_times = {};
var key_down_times = {};
var double_tap = {};
var double_tap_sensitivity = 15;

var has_ended = false;
var delta_time = 1;
var end_time = 30000;

var x_min = 25;
var y_min = 25;
var x_range = 600;
var y_range = 500;
var boundaries = [x_min,y_min,x_min+x_range,y_min+y_range];

var MAX_INITIAL_SEPARATION = 200;

// colors :

var canvas, ctx;

// -------------------------------------------------------------

// objects :

function getMouseCoordinates(e){
    var x;
    var y;
    if (e.pageX || e.pageY) { 
        x = e.pageX;
        y = e.pageY;
    }
    else { 
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    return [x,y];
}

// -------------------------------------------------------------

// draw functions :

function clear() { // clear canvas function
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// drawing handler
    
function drawScene() { // main drawScene function
    clear(); // clear canvas

    drawSceneBackground();
    drawGrid();
    drawCells();
    drawBorders();
    drawSidePane();

    checkKey();
}

function check_start(){
    if ( keyPressed == 'p' ){

    }
}

function clear_variables(){
    keys = [];
    for ( var elem in keys_pressed ){
        keys.push(elem);
    }

    ctx.globalAlpha=0.75;
    ctx.font="16px Ubuntu";
    ctx.fillStyle = colors.WHITE;
    ctx.fillText("Keys Pressed: " + keys.toString(), 100, 550);
    
}

function game_time_update(){
    time_step();
    near_end();
}

function near_end(){
    var current_seconds = Math.floor(time/fps);
    var end_threshold = 10000;
    if ( current_seconds > (end_time-end_threshold)/1000 && current_seconds < end_time/1000 && current_seconds != Math.floor((time-1)/fps) ){
        time_warning_count += 1;
        play_sfx('pre_end_beep');
    }
}

function start(){
    current_game = games();
    set_tiles();
    create_players(current_game['teams']);
    create_teathers();
    create_team_stats(current_game['teams']);
}

function check_if_valid_interior(x,y){
    var boundaries = get_game_boundaries();
    if ( x > boundaries[0] && x < boundaries[2] && y > boundaries[1] && y < boundaries[3] ){
        return true;
    }
    return false;
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

function create_teathers(){
    var teather_count = 0;
    for ( var i in players ){
        var player = players[i];
        for ( var j in players ){
            if ( i == j ){
                continue;
            }
            var other_player = players[j];
            if ( player.get_team() == other_player.get_team() ){
                if (!( player.get_player_id() in teathers )){
                    teathers[player.get_player_id()] = {};
                }
                var new_teather;
                if ( other_player.get_player_id() in teathers &&
                     player.get_player_id() in teathers[other_player.get_player_id()] ) {
                    new_teather = teathers[other_player.get_player_id()][player.get_player_id()];
                }
                else {
                    new_teather = create_teather(player.get_team(), teather_count, player.get_player_id(), other_player.get_player_id() );
                    teather_count += 1;
                }
                teathers[player.get_player_id()][other_player.get_player_id()] = new_teather;
            }
        }
    }
}

function modify_teathers(player,max_size_multiplier){
    for ( var other_player_id in teathers[player.get_player_id()] ){
        var teather = teathers[player.get_player_id()][other_player_id];
        teather.set_max_size_multiplier(max_size_multiplier);
    }
}

function get_game_boundaries(){
    return boundaries;
}

function create_players(teams_info){

    var team_id = 0;
    var player_id = 0;

    for ( var team_name in teams_info ){
        var team_players = [];
        var team = teams_info[team_name];
        var team_color = get_team_color(team_id);
        for ( var i in team['players'] ){
            var player = team['players'][i];
            var player_name = player['name'];
            var player_ai = player['ai'];

            var new_player = create_player(team_id,player_name,player_id,player_ai,this);
            id_to_player[player_id] = new_player;
            new_player.set_random_start(x_range,y_range,x_min,y_min);
            players.push(new_player);
            team_players.push(new_player);

            if ( player_ai == false ){ // Not AI
                move_mappings[player_id] = set_mappings();
            }

            player_id += 1;

        }
        var new_team = create_team(team_name,team_id,team_players,team_color);
        teams.push(new_team);
        team_id += 1;
    }
}

function set_mappings(){
    mapped += 1;
    return get_default_move_mappings(mapped-1);
}

function get_team_color(team_id){
    if ( team_id == 0 ){
        return colors.RED;
    }    
    else if ( team_id == 1 ){
        return colors.GREEN;
    }    
    else if ( team_id == 2 ){
        return colors.BLUE;
    }
    else if ( team_id == 3 ){
        return colors.ORANGE;
    }
    else {
        return undefined;
    }
}

function get_distance(x1,x2,y1,y2){
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function get_sprite_distance(s1,s2){
    var s1_pos = s1.get_position();
    var s2_pos = s2.get_position();
    return get_distance( s1_pos[0], s2_pos[0], s1_pos[1], s2_pos[1] );
}



function create_powerups(){
    if ( powerups.length < max_powerups ){
        if ( Math.random() > powerup_frequency ){
            var new_powerup = create_powerup();
            new_powerup.set_random_position(x_range,y_range,x_min,y_min);
            powerups.push( new_powerup );
        }
    }
}

function draw_sprites(){
    draw_teathers();
    draw_players();
    draw_coins();
    draw_missiles();
    draw_powerups();
}


function get_default_move_mappings(count){
    if ( count == 0 ){
        return {'W': [0,-1], 'A': [-1,0], 'S': [0,1], 'D': [1,0]};
    }
    
    if ( count == 1 ){
        return {'I': [0,-1], 'J': [-1,0], 'K': [0,1], 'L': [1,0]};
    }

    if ( count == 2 ){
        return {'h': [0,-1], 'd': [-1,0], 'e': [0,1], 'f': [1,0]};
    }

    if ( count == 3 ){
        return {'&': [0,-1], '%': [-1,0], '(': [0,1], '\'': [1,0]};
    }
}

function update_time(){
    time += delta_time;
}

function get_time(){
    return time;
}

function update_game_status(){
    if ( 0 == 0 ){

    }
}

function time_step(){
    update_time();
    update_players();
    update_game_status();
}

function get_keyboard_moves(id){
    if ( id in move_mappings == false ){
        return [0,0]
    }
    var key_map = move_mappings[id];
    var result = [0,0]

    for ( var i in keys_pressed ){
        if ( i in key_map ){
            result[0] += key_map[i][0]
            result[1] += key_map[i][1]
        }
    } 
    return result
}

function get_double_taps(id){
    if ( id in move_mappings == false ){
        return [0,0];
    }
    var key_map = move_mappings[id];
    var result = [0,0];
    
    for ( var i in key_map ){
        if ( i in double_tap ){
            delete double_tap[i];
            result[0] += key_map[i][0];
            result[1] += key_map[i][1];
        }
    }
    return result;
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



function get_sprite_angle(s1,s2){
    var pos1 = s1.get_position();
    var pos2 = s2.get_position();
    return Math.atan2( pos1[1] - pos2[1], pos1[0] - pos2[0] );
}

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

function create_team_stats(teams){
    for ( var i in players ){
        var player = players[i];
        var team = player.get_team();

        if ( team in team_stats == false ){
            team_stats[team] = {'name': 'name', 'coins': 0, 'players': [], 'powerups': 0};            
        }
        team_stats[team]['players'].push(player);
    }
}

function get_team_stats(){
    for ( var key in team_stats ){
        var team = team_stats[key];
        team['coins'] = 0;
        for ( var i in team['players'] ){
            var player = team['players'][i];
            team['coins'] += player.get_coins();
        }
    }
}

function draw_info(){
    draw_team_stats();
    draw_time_stats();
}

function main(){
    clear();

    draw_screen();
    draw_board();
    draw_options();
    draw_sprites();
    check_start();


    get_team_stats();
    draw_info();

    check_end();

    if ( has_ended == false ){
        game_time_update();
        create_coins();
        remove_lost_coins();
        remove_dead_missiles();
        create_powerups();
        detect_collisions();
    }

    clear_variables();
}

function get_winner(){
    teams_ordered = order_teams();
    output = "";

    for ( var i in teams_ordered ){
        var team = teams_ordered[i][0];
        var team_name = team.get_team_name();
        var total_coins = teams_ordered[i][1];
        output += team_name + " " + total_coins;
        output += "\n";    
    }

    return output;
}

function check_end(){
    if ( has_ended == false ) {
        if ( (time*1000)/fps > end_time ) {
            has_ended = true;
            play_sfx('end_beep');
            console.log("Total Time: " + end_time/1000 + "\n" + get_winner());
        }
    }
}

function add_key_down(key){
    if (key in keys_pressed == false){
        keys_pressed[key] = true;
    }
    if ( key in double_tap == false && key in key_up_times && 
        get_time() - key_up_times[key] < double_tap_sensitivity && key in key_down_times && 
        get_time() - key_down_times[key] < double_tap_sensitivity ){
        double_tap[key] = true;
    }
    key_down_times[key] = get_time();
}

function remove_key_down(key){
    if (key in keys_pressed){
        delete keys_pressed[key];
    }
    //if ( key in double_tap == false && key in key_up_times && get_time() - key_up_times[key] < double_tap_sensitivity ){
    //    double_tap[key] = true;
    //}
    //key_up_times[key] = get_time();
    key_up_times[key] = get_time();
}

function games(){
    var game_presets = new Game_Presets();
    return game_presets.get_game_preset(1);
}



// Buttons //

var sfx_button = {x: 730, y: 500, width: 30, height: 25};

var buttons = [sfx_button];
function mouse_pressed(x,y){
    for ( var i = 0; i < buttons.length; i++ ){
        var button = buttons[i];
        console.log(x,y);
        if ( x > button.x && x < button.x+button.width && y > button.y && y < button.y+button.height ){
            sfx_on = !sfx_on;
            break;
        }
    }
}

// initialization

$(function(){

    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');

    start();

    var width = canvas.width;
    var height = canvas.height;

    //canvas.addEventListener("click", mousePressed, false);

    keyPressed = undefined;
    $(document).keypress(function(event){
        keyPressed = String.fromCharCode(event.which); 
    });

    $(document.body).keydown(function (evt) {
        var key_down = evt.keyCode;
        key = String.fromCharCode(evt.keyCode);
        add_key_down(key);
    });

    $(document.body).keyup(function (evt) {
        var key_down = evt.keyCode;
        key = String.fromCharCode(evt.keyCode);
        remove_key_down(key);
    });


    // binding mousedown event (for dragging)
    $('#scene').click(function(e) {
        var coords = getMouseCoordinates(e);
        var mouseX = coords[0];
        var mouseY = coords[1];
        mouse_pressed(mouseX,mouseY);
    });

    $('#scene').mousemove(function(e) { // binding mousemove event for cells
        var coords = getMouseCoordinates(e);
        var mouseX = coords[0];
        var mouseY = coords[1];

    });

    $('#scene').mouseup(function(e) { // on mouseup
        
    });

    setInterval(main, frame_interval); // loop drawScene
});
