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

/*              Keyboard                */

/** @namespace */
var THREEx  = THREEx        || {};

/**
 * - NOTE: it would be quite easy to push event-driven too
 *   - microevent.js for events handling
 *   - in this._onkeyChange, generate a string from the DOM event
 *   - use this as event name
*/
THREEx.KeyboardState    = function()
{
    // to store the current state
    this.keyCodes   = {};
    this.modifiers  = {};
    
    // create callback to bind/unbind keyboard events
    var self    = this;
    this._onKeyDown = function(event){ self._onKeyChange(event, true); };
    this._onKeyUp   = function(event){ self._onKeyChange(event, false);};

    // bind keyEvents
    document.addEventListener("keydown", this._onKeyDown, false);
    document.addEventListener("keyup", this._onKeyUp, false);
}

/**
 * To stop listening of the keyboard events
*/
THREEx.KeyboardState.prototype.destroy  = function()
{
    // unbind keyEvents
    document.removeEventListener("keydown", this._onKeyDown, false);
    document.removeEventListener("keyup", this._onKeyUp, false);
}

THREEx.KeyboardState.MODIFIERS  = ['shift', 'ctrl', 'alt', 'meta'];
THREEx.KeyboardState.ALIAS  = {
    'left'      : 37,
    'up'        : 38,
    'right'     : 39,
    'down'      : 40,
    'space'     : 32,
    'pageup'    : 33,
    'pagedown'  : 34,
    'tab'       : 9
};

/**
 * to process the keyboard dom event
*/
THREEx.KeyboardState.prototype._onKeyChange = function(event, pressed)
{
    // log to debug
    //console.log("onKeyChange", event, pressed, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)

    // update this.keyCodes
    var keyCode     = event.keyCode;
    this.keyCodes[keyCode]  = pressed;

    // update this.modifiers
    this.modifiers['shift']= event.shiftKey;
    this.modifiers['ctrl']  = event.ctrlKey;
    this.modifiers['alt']   = event.altKey;
    this.modifiers['meta']  = event.metaKey;
}

/**
 * query keyboard state to know if a key is pressed of not
 *
 * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
 * @returns {Boolean} true if the key is pressed, false otherwise
*/
THREEx.KeyboardState.prototype.pressed  = function(keyDesc)
{
    var keys    = keyDesc.split("+");
    for(var i = 0; i < keys.length; i++){
        var key     = keys[i];
        var pressed;
        if( THREEx.KeyboardState.MODIFIERS.indexOf( key ) !== -1 ){
            pressed = this.modifiers[key];
        }else if( Object.keys(THREEx.KeyboardState.ALIAS).indexOf( key ) != -1 ){
            pressed = this.keyCodes[ THREEx.KeyboardState.ALIAS[key] ];
        }else {
            pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)]
        }
        if( !pressed)   return false;
    };
    return true;
}
