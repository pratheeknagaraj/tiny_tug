function update_time(){
    time += delta_time;
}

function get_time(){
    return time;
}

function time_step(){
    update_time();
    update_players();
    update_game_status();
}
