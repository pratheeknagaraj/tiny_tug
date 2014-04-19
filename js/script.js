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
        return;
    }
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

function create_skill_orbs(){
    if ( powerups.length < max_skill_orbs ){
        if ( Math.random() > skill_orb_frequency ){
            var new_skill_orb = create_skill_orb();
            new_skill_orb.set_random_position(x_range,y_range,x_min,y_min);
            skill_orbs.push( new_skill_orb );
        }
    }
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

function update_game_status(){
    return;
}



function get_keyboard_moves(id){
    if ( id in move_mappings == false ){
        return [0,0]
    }
    var key_map = move_mappings[id];
    var result = [0,0]

    console.log(key_map)
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
        create_skill_orb();
        remove_lost_coins();
        remove_dead_missiles();
        create_powerups();
        detect_collisions();
    }
    else {
        draw_end_screen();
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
            run_game_over_stats();
        }
    }
}

function games(){
    var game_presets = new Game_Presets();
    return game_presets.get_game_preset(selected_game_preset);
}

// Buttons //

var sfx_button = {x: 730, y: 500, width: 30, height: 25};

var buttons = [sfx_button];
function mouse_pressed(x,y){
    for ( var i = 0; i < buttons.length; i++ ){
        var button = buttons[i];
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
