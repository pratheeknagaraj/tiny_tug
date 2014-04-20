function remove_key_down(key,key_code){
    if (key in keys_pressed){
        delete keys_pressed[key];
    }
    if (key_code in key_code_pressed){
        delete key_code_pressed[key_code];
    }
    key_up_times[key] = get_time();
}

function is_key_down(key,key_code){
    if (key in keys_pressed){
        return true;
    }
    if (key_code in key_code_pressed){
        return true;
    }
    return false;
}

function add_key_down(key,key_code){
    if (key in keys_pressed == false){
        keys_pressed[key] = true;
    }
    if (key_code in key_code_pressed == false){
        key_code_pressed[key_code] = true;
    }
    if ( key in double_tap == false && key in key_up_times && 
        get_time() - key_up_times[key] < double_tap_sensitivity && key in key_down_times && 
        get_time() - key_down_times[key] < double_tap_sensitivity ){
        double_tap[key] = true;
    }
    key_down_times[key] = get_time();
}

/*
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
*/
function get_default_move_mappings(count){
    if ( count == 0 ){
        return {'T': [0,-1], 'F': [-1,0], 'G': [0,1], 'H': [1,0]};
    }
    
    if ( count == 1 ){
        return {'W': [0,-1], 'A': [-1,0], 'S': [0,1], 'D': [1,0]};
    }

    if ( count == 2 ){
        return {'h': [0,-1], 'd': [-1,0], 'e': [0,1], 'f': [1,0]};
    }

    if ( count == 3 ){
        return {'&': [0,-1], '%': [-1,0], '(': [0,1], '\'': [1,0]};
    }

    if ( count == 4 ){
        return {'I': [0,-1], 'J': [-1,0], 'K': [0,1], 'L': [1,0]};
    }
}

function set_mappings(){
    mapped += 1;
    return get_default_move_mappings(mapped-1);
}

function clear_variables(){
    keys = [];
    for ( var elem in keys_pressed ){
        keys.push(elem);
    }

    ctx.globalAlpha=0.25;
    ctx.font="16px Ubuntu";
    ctx.fillStyle = colors.WHITE;
    ctx.fillText("Keys Pressed: " + keys.toString(), 30, 545);   
}
