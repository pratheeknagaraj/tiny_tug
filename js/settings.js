// --------------- GAME SETTINGS ----------------- //

var sfx_on = true;
var use_icons = true;

// --------------- POWERUP VARIABLES ----------------- //

//var powerups_available = ['Attack','Steal','Magnet','CoinBurst','SpeedBoost','Elastic','Missile'];
var powerups_available = ['Attack','Steal','Magnet','SpeedBoost','Missile'];
// var powerups_available = ['Magnet','Attack','CoinBurst'];
//var powerups_available = ['Missile'];
//var powerups_available = ['Elastic'];
//var powerups_available = ['Magnet'];

var powerups = [];
var max_powerups = 5;
var powerup_frequency = 0.97;
var max_skill_orbs = 1;
var skill_orb_frequency = 0.98;

// --------------- COIN VARIABLES ----------------- //

var coins = [];
var lost_coins = [];
var max_coins = 100;

// --------------- MISSILE VARIABLES ----------------- //

var missiles = [];
var dead_missiles = [];

// --------------- GAME CONTROL ----------------- //

var game_start = false;
var has_ended = false;
var new_game_ready = false;

var selected_game_preset = 1;

// --------------- KEYBOARD CONTROL ----------------- //

var keys_pressed = {};
var key_code_pressed = {};
var move_mappings = {};
var mapped = 0;

var key_up_times = {};
var key_down_times = {};
var double_tap = {};
var double_tap_sensitivity = 15;

// --------------- GAME VARIABLES ----------------- //

var players = [];
var id_to_player = {};
var teathers = {};

var teams = [];
var team_stats = {};

// --------------- TIME VARIABLES ----------------- //

var time = 0;
var delta_time = 1;
var end_time = 60000;
var time_warning_count = 0;

var fps = 60;
var frame_interval = Math.round(1000/fps);

// --------------- BOUNDARY VARIABLES ----------------- //

var x_min = 25;
var y_min = 25;
var x_range = 600;
var y_range = 500;
var boundaries = [x_min,y_min,x_min+x_range,y_min+y_range];

// --------------- GRID VARIABLES ----------------- //

var grid = [];
var grid_types = [];
var tile_size = 25;

// --------------- DRAW VARIABLES ----------------- //

var canvas, ctx;
