var tiles_available = ['Normal','Ice','Grass','Gel','Fire'];
var tile_patches = {'Ice': [20], 'Grass': [30,10], 'Gel': [20], 'Fire': [10]}

// --------------- Tiles ------------- //

function Tile(x,y,size){ 

    this.x = x;
    this.y = y;
    this.size = size-2;
    this.type;    

    this.get_position = function(){
        return [this.x,this.y];
    }

    this.get_size = function(){
        return this.size;
    }

    this.draw_generic = function(){
        ctx.globalAlpha=0.15;
        ctx.beginPath();
        ctx.lineWidth=0.25;
        ctx.strokeStyle=colors.WHITE;
        ctx.rect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
        ctx.stroke();

        //ctx.globalAlpha=0.05;
        //ctx.fillStyle = colors.WHITE;
        //ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
        ctx.globalAlpha=1.0;
    }

    this.get_type = function(){
        return this.type;
    }  

} 

// Normal Tile
NormalTile.prototype = new Tile();
NormalTile.prototype.constructor=NormalTile; 
function NormalTile(x,y,size){

    Tile.call(this,x,y,size);
    this.type = "Normal";

    this.get_modifiers = function(){
        modifiers = {};
        return modifiers;
    }

    this.draw = function(ctx){
        this.draw_generic();
        this.draw_unique();
    }

    this.draw_unique = function(){
        
    }
}

// Ice Tile
IceTile.prototype = new Tile();
IceTile.prototype.constructor=IceTile; 
function IceTile(x,y,size){

    Tile.call(this,x,y,size);
    this.type = "Ice";

    this.get_modifiers = function(){
        modifiers = {};
        modifiers["Friction"] = 1.05;
        modifiers["Fatigue"] = 0.9;
        return modifiers;
    }

    this.draw = function(ctx){
        this.draw_generic();
        this.draw_unique();
    }

    this.draw_unique = function(){
        ctx.globalAlpha=0.15;
        ctx.fillStyle = colors.ICE;
        ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
        ctx.globalAlpha=1.0;    

        ctx.beginPath();
        ctx.lineWidth=0.2;
        ctx.strokeStyle=colors.ICE;
        ctx.rect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
        ctx.stroke();       
    }
}

// Grass Tile
GrassTile.prototype = new Tile();
GrassTile.prototype.constructor=GrassTile; 
function GrassTile(x,y,size){

    Tile.call(this,x,y,size);
    this.type = "Grass";

    this.get_modifiers = function(){
        modifiers = {};
        modifiers["Friction"] = 0.9;
        modifiers["Fatigue"] = 0.9;
        return modifiers;
    }

    this.draw = function(ctx){
        this.draw_generic();
        this.draw_unique();
    }

    this.draw_unique = function(){
        ctx.globalAlpha=0.15;
        ctx.fillStyle = colors.GRASS;
        ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
        ctx.globalAlpha=1.0;  

        ctx.beginPath();
        ctx.lineWidth=0.2;
        ctx.strokeStyle=colors.GRASS2;
        ctx.rect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
        ctx.stroke();         
    }
}

// Gel Tile
GelTile.prototype = new Tile();
GelTile.prototype.constructor=GelTile; 
function GelTile(x,y,size){

    Tile.call(this,x,y,size);
    this.type = "Gel";

    this.get_modifiers = function(){
        modifiers = {};
        modifiers["Friction"] = -0.8;
        modifiers["Fatigue"] = 2;
        return modifiers;
    }

    this.draw = function(ctx){
        this.draw_generic();
        this.draw_unique();
    }

    this.draw_unique = function(){
        ctx.globalAlpha=0.15;
        ctx.fillStyle = colors.GEL;
        ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
        ctx.globalAlpha=1.0;  

        ctx.beginPath();
        ctx.lineWidth=0.2;
        ctx.strokeStyle=colors.GEL;
        ctx.rect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
        ctx.stroke();       
    }
}

// Fire Tile
FireTile.prototype = new Tile();
FireTile.prototype.constructor=FireTile; 
function FireTile(x,y,size){

    Tile.call(this,x,y,size);
    this.type = "Fire";

    this.get_modifiers = function(){
        modifiers = {};
        modifiers["Fire"] = 0.05;
        return modifiers;
    }

    this.draw = function(ctx){
        this.draw_generic();
        this.draw_unique();
    }

    this.draw_unique = function(){
        ctx.globalAlpha=0.15;
        ctx.fillStyle = colors.FIRE;
        ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
        ctx.globalAlpha=1.0;   

        ctx.beginPath();
        ctx.lineWidth=0.2;
        ctx.strokeStyle=colors.FIRE;
        ctx.rect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
        ctx.stroke();      
    }
}


// --------------- Create Tiles ------------- //

var grid = [];
var grid_types = [];
var tile_size = 25;

function set_tiles(){
    var boundaries = get_game_boundaries();
    var x_range = boundaries[2]-boundaries[0];
    var y_range = boundaries[3]-boundaries[1];
    var x_grid_size = x_range/tile_size;
    var y_grid_size = y_range/tile_size;
    for ( var i = 0; i < x_grid_size; i++ ) {
        var row = [];
        var row_types = [];
        for ( var j = 0; j < y_grid_size; j++ ) {
            var pos = get_tile_position(i,j);
            var tile = new NormalTile(pos[0],pos[1],tile_size);
            row.push( tile );
            row_types.push( tile.get_type() ); 
        }
        grid.push( row );
        grid_types.push( row_types );
    }

    add_special_tiles(x_grid_size,y_grid_size);
}

function add_special_tiles(x_size,y_size){

    for ( index in tile_patches ){
        var type = index;
        var counts = tile_patches[index];

        var tile_count = 20; // DEFAULT

        for ( var count_index = 0; count_index < counts.length; count_index++ ){
            tile_count = counts[count_index];

            var x_rand = Math.floor(Math.random()*x_size);
            var y_rand = Math.floor(Math.random()*y_size);

            var agenda = [];
            agenda.push( [x_rand,y_rand] );
            while ( tile_count > 0 && agenda.length > 0 ){
                var coords = agenda.pop();
                var i = coords[0];
                var j = coords[1];
                if ( i > 0 && i < x_size && j > 0 && j < y_size && grid_types[i][j] == "Normal" ) {
                    var pos = get_tile_position(i,j);
                    var new_tile = get_special_tile(type,pos);
                    grid[i][j] = new_tile;
                    grid_types[i][j] = new_tile.get_type();
                    var possible = [[-1,0],[0,-1],[1,0],[0,1]];
                    var rand = Math.floor(Math.random()*4);
                    var choice = possible[rand];
                    agenda.push( [i+choice[0],j+choice[1]] );
                    var possible = [[-1,0],[0,-1],[1,0],[0,1]];
                    var rand = Math.floor(Math.random()*4);
                    var choice = possible[rand];
                    agenda.push( [i+choice[0],j+choice[1]] );
                    tile_count -= 1;
                }
            }
        }
    }
}

function get_special_tile(type,pos){
    if ( type == "Ice" ){
        return new IceTile(pos[0],pos[1],tile_size);
    }
    if ( type == "Grass" ){
        return new GrassTile(pos[0],pos[1],tile_size);
    }
    if ( type == "Gel" ){
        return new GelTile(pos[0],pos[1],tile_size);
    }
    if ( type == "Fire" ){
        return new FireTile(pos[0],pos[1],tile_size);
    }
    return undefined;
}

function get_tile_position(i,j){
    var x_pos = x_min + i*tile_size + tile_size/2.0;
    var y_pos = y_min + j*tile_size + tile_size/2.0;
    return [x_pos,y_pos];
}

function get_tile_from_position(pos){
    var x_tile = Math.floor((pos[0]-x_min)/tile_size);
    var y_tile = Math.floor((pos[1]-y_min)/tile_size);
    if ( x_tile > grid.length-1 || y_tile > grid[0].length-1 || x_tile < 0 || y_tile < 0 ){
        return undefined;
    }
    var tile = grid[x_tile][y_tile];
    return tile;
}

function get_modifiers_from_position(pos){
    var tile = get_tile_from_position(pos);
    if ( tile == undefined ){
        return {};
    }
    return tile.get_modifiers();
}

