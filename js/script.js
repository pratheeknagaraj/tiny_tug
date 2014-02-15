// -------------------------------------------------------------

// global variables :

var game_start = false;
var keys_pressed = {};

// colors :
var gold_yellow_color = 'rgba(255, 200, 0, 1.0)';

var canvas, ctx;
var gridPoints = [];
var board;
var cells = [];
var cell_map = {};
var galaxy_selected;
var selectedCell;
var selected_galaxy_cell;
var hoveredCell;
var keyPressed;
var playerList = [];
var playerCount;
var playerNames = {};
var playerTypes = {};
var playerColors = {};
var galaxy_map = {};
var currentPlayer;
var x_grid_max;
var y_grid_max;
var game_statistics;
var selection_map = {};
var galaxy_abbreviation_toggle = false;

// -------------------------------------------------------------

// objects :

function Board(board_array){
    this.array = board_array;

    this.printBoard_Players = function(){
        for (var i = 0; i < this.array.length; i++){
            console.log(this.array[i]);
        }  
    };
}

function Circle(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
}

function GridPoint(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius;    
}

function GridCell(x, y, x_grid, y_grid, cell_id, size){
    this.x = x;
    this.y = y;
    this.x_grid = x_grid;
    this.y_grid = y_grid;
    this.cell_id = cell_id;
    this.size = size;
    this.properties = new CellProperties({},0);
    this.playerId = 0;
    this.occupied = 0;
    this.galaxy = undefined;
    this.captured = false;
    this.captured_from = 0;
}

function CellProperties(influence_map,galaxies_influencing){
    this.influence = new Influence(influence_map);
    this.galaxies_influencing = galaxies_influencing;
}

function Influence(percent_map){
    this.percents = percent_map;
}

function GameStatistics(){
    this.galaxy_count;
    this.player_galaxies;
    this.player_cells;
    this.player_cell_count;
    this.player_cell_percents;
    this.player_percents;
    this.player_aggregated_percents;
    this.cell_count;
    this.empty_cells;

    this.reset_statistics = function(){
        this.galaxy_count = 0;
        this.player_galaxies = undefined;
        this.player_cells = undefined;
        this.player_cell_count = {0: cells.length};
        this.player_cell_percents = {0: 1.0};
        this.player_percents = undefined;
        this.player_aggregated_percents = undefined;
        this.cell_count = cells.length;
        this.empty_cells = undefined;

    };
}

// -------------------------------------------------------------

// helper functions

function getColor(){
    return playerColors[currentPlayer];
}

function getColor(playerId){
    return playerColors[playerId];
}

function getIfAllowedMove(cell){
    if (cell.occupied != 0){
        return false;
    }
    if (cell.playerId == 0){
        return true;
    }
    if (cell.playerId != currentPlayer){
        return false;
    }
    return true;
}

function distance(cell1, cell2, metric){
    if ( metric == 'manhattan' ){
        x_grid1 = cell1.x_grid;
        y_grid1 = cell1.y_grid;
        x_grid2 = cell2.x_grid;
        y_grid2 = cell2.y_grid;
        return Math.abs(x_grid1 - x_grid2) + Math.abs(y_grid1 - y_grid2);
    }
    else if ( metric == 'manhattan_max' ){
        x_grid1 = cell1.x_grid;
        y_grid1 = cell1.y_grid;
        x_grid2 = cell2.x_grid;
        y_grid2 = cell2.y_grid;
        return Math.max( Math.abs(x_grid1 - x_grid2), Math.abs(y_grid1 - y_grid2) );
    }
    else if ( metric == 'lines' ){
        x_grid1 = cell1.x_grid;
        y_grid1 = cell1.y_grid;
        x_grid2 = cell2.x_grid;
        y_grid2 = cell2.y_grid;
        if ( Math.abs(x_grid1 - x_grid2) == 0 ){
            return Math.abs(y_grid1 - y_grid2);
        }

        if ( Math.abs(y_grid1 - y_grid2) == 0 ){
            return Math.abs(x_grid1 - x_grid2);
        }

        return Number.MAX_VALUE;
    }
}

function get_neighbors(cell, type){
    board_array = board.array;
    if ( type == 1 ){
        var x_grid = cell.x_grid;
        var y_grid = cell.y_grid;
        var neighbors = {};
        if (x_grid > 0){
            neighbors['left'] = board_array[x_grid-1][y_grid];
        }
        if (x_grid < x_grid_max){
            neighbors['right'] = board_array[x_grid+1][y_grid];
        }
        if (y_grid > 0){
            neighbors['up'] = board_array[x_grid][y_grid-1];
        }
        if (y_grid < y_grid_max){
            neighbors['down'] = board_array[x_grid][y_grid+1];
        }
        return neighbors;
    }
    else if ( type == 2 ){
        var x_grid = cell.x_grid;
        var y_grid = cell.y_grid;
        array = [];
        if (x_grid > 0){
            array.push(board_array[x_grid-1][y_grid]);
        }
        if (x_grid < x_grid_max){
            array.push(board_array[x_grid+1][y_grid]);
        }
        if (y_grid > 0){
            array.push(board_array[x_grid][y_grid-1]);
        }
        if (y_grid < y_grid_max){
            array.push(board_array[x_grid][y_grid+1]);
        }
        return array;
    }
    console.log("Error - Incorrect Neighbor Call with: " + type);
    return;
}

// -------------------------------------------------------------

// game status functions

function getBoardWithPlayers(){
    players_board = [];
    for (var i = 0; i < board.length; i++ ){
        players_board_line = [];
        for (var j = 0; j < board[i].length; j++ ){
            players_board_line.push( board[i][j].playerId );
        }
        players_board.push(players_board_line);
    }
    return players_board;
}

// -------------------------------------------------------------

// game control functions

function makeMove(cell){
    cell.playerId = currentPlayer;
    cell.occupied = currentPlayer;
    var selection = selection_map[currentPlayer];
    var type = getGalaxyType( selection );
    var galaxy = addGalaxy(type);
    cell.galaxy = galaxy;
    galaxy_map[cell.cell_id] = galaxy;
    changePlayer();
    compute(false);
}

function getGalaxyType(selection){
    var type = undefined;
    if ( selection == 'Block' ){
        type = 'block_galaxy';
    }
    if ( selection == 'Spiral' ){
        type = 'spiral_galaxy';
    }
    if ( selection == 'Ring' ){
        type = 'ring_galaxy';
    }
    if ( selection == 'Line' ){
        type = 'line_galaxy';
    }
    return type;
}

function addGalaxy(type){
    var galaxy;
    return get_galaxy( type );
}

function compute_on_cell(cell){
    var temp_influence = {};
    var total_influence = 0.0;
    var galaxies_influencing = 0;
    for ( var galaxy_cell_id in galaxy_map ){

        if (!galaxy_map.hasOwnProperty(galaxy_cell_id)) { // Check for correct Property
            continue;
        }
        var galaxy_cell = cell_map[galaxy_cell_id];
        var galaxy = galaxy_map[galaxy_cell_id];

        var galaxy_influence = galaxy.getInfluence();
        var cell_distance = distance(cell, galaxy_cell, galaxy.metric);

        if (cell_distance in galaxy_influence){
            galaxies_influencing += 1;
            var cell_influence = galaxy_influence[cell_distance];

            var player = galaxy.player;
            if ( player in temp_influence == false ){
                temp_influence[player] = 0.0;
            }
            temp_influence[player] += cell_influence;
            total_influence += cell_influence;
        }
    }
    return [temp_influence,total_influence,galaxies_influencing];
}

function compute(captured){

    var mutual_threshold = 1e-5;

    var new_game_statistics = new GameStatistics();
    new_game_statistics.cell_count = cells.length;
    new_game_statistics.galaxy_count = galaxy_map.length;

    var new_player_galaxies = {};
    for ( var galaxy_cell_id in galaxy_map ){
        var galaxy = galaxy_map[galaxy_cell_id];
        var player = galaxy.player;
        if ( player in new_player_galaxies == false ){
            new_player_galaxies[player] = [];
        }
        new_player_galaxies[player].push( galaxy );
    }
    new_game_statistics.player_galaxies = new_player_galaxies;

    var captured_flag = false;
    var new_empty_cells = 0;
    for ( var i = 0; i < cells.length; i++ ){
        var cell = cells[i];
    
        var packaged_values = compute_on_cell(cell);
        var temp_influence = packaged_values[0];
        var total_influence = packaged_values[1];
        var galaxies_influencing = packaged_values[2];

        if ( galaxies_influencing != 0 ){

            var old_galaxy_count = cell.properties.galaxies_influencing;
            if ( old_galaxy_count != galaxies_influencing || captured == true){
                
                var max_players = [];
                var max_influence = 0.0;
                percent_map = {};
                for (var player in temp_influence){
                    percent_map[player] = temp_influence[player]/total_influence;
                    if ( Math.abs(temp_influence[player] - max_influence) < mutual_threshold ){
                        max_players.push( player );
                        continue;
                    }                
                    if ( temp_influence[player] > max_influence ){
                        max_influence = temp_influence[player];
                        max_players = [];
                        max_players.push( player );
                    }
                }

                var winning_player;
                if ( max_players.length > 1 ){
                    var id = Math.floor((Math.random()*max_players.length));
                    winning_player = max_players[id];
                }
                else {
                    winning_player = max_players[0];
                }
                cell.playerId = winning_player;
                if ( cell.occupied != 0 && cell.galaxy.player != winning_player ){
                    cell.captured_from = cell.galaxy.player;
                    cell.galaxy.player = winning_player;
                    cell.captured = true;
                    captured_flag = true;
                    break;
                }
                else {
                    cell.properties = new CellProperties(percent_map,galaxies_influencing);
                }
            }
        }
        else {
            new_empty_cells += 1 ;
        }
    }
    if ( captured_flag ){
        compute(true);
        return;
    }
    new_game_statistics.empty_cells = new_empty_cells;

    var new_player_cells = {};
    var new_player_cell_count = {};
    var new_player_percents = {};
    var new_player_aggregated_percents = {};

    for ( var i = 0; i < cells.length; i++ ){
        var cell = cells[i];
        var cell_owner = cell.playerId;
        
        if ( cell_owner in new_player_cells == false ){
            new_player_cells[cell_owner] = [];
            new_player_cell_count[cell_owner] = 0;
        }
        new_player_cells[cell_owner] = cell;
        new_player_cell_count[cell_owner] += 1;

        var influence = cell.properties.influence;
        for ( var player in influence ){
            if ( player in new_player_percents == false ){
                new_player_percents[player] = [];
                new_player_aggregated_percents[player] = 0.0;
            }
            new_player_percents[player].push( influence[player] ); 
            new_player_aggregated_percents[player] += influence[player];
        }
    }

    var new_player_cell_percents = {};
    for ( var player in new_player_cell_count ){
        new_player_cell_percents[player] = new_player_cell_count[player]/(1.0*cells.length);
    }

    new_game_statistics.player_cells = new_player_cells;
    new_game_statistics.player_cell_count = new_player_cell_count;
    new_game_statistics.player_cell_percents = new_player_cell_percents;
    new_game_statistics.player_percents = new_player_percents;
    new_game_statistics.player_aggregated_percents = new_player_aggregated_percents;

    game_statistics = new_game_statistics;
}



// -------------------------------------------------------------

// control functions

function checkKey(){
    if ( keyPressed == 'z' ){
        changePlayer();
    }
    if ( keyPressed == 'a' ){
        console.log( board.printBoard_Players() );
    }
    if ( keyPressed == 'g' ){
        galaxy_abbreviation_toggle = !galaxy_abbreviation_toggle;
    }
    if ( keyPressed == '1' ){
        selection_map[currentPlayer] = 'Block';
    }
    if ( keyPressed == '2' ){
        selection_map[currentPlayer] = 'Spiral';
    }
    if ( keyPressed == '3' ){
        selection_map[currentPlayer] = 'Ring';
    }
    if ( keyPressed == '4' ){
        selection_map[currentPlayer] = 'Line';
    }
    keyPressed = undefined;
}

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

// initialization function

function setGrid(width, height, spacing, radius) {
    points = []
    x_count = Math.floor(width/spacing);
    y_count = Math.floor(height/spacing);
    for (var i=0; i < x_count+1; i++ ){
        for (var j=0; j < y_count+1; j++ ){
            point = new GridPoint( i*spacing, j*spacing, radius );
            points.push( point );
        }
    }
    return points;
}

function setCells(width, height, spacing){
    cells = [];
    new_board = []
    x_count = Math.floor(width/spacing);
    y_count = Math.floor(height/spacing);
    x_grid_max = x_count-1;
    y_grid_max = y_count-1;
    var totalCount = 0;
    for (var i=0; i < x_count; i++ ){
        new_board_line = [];
        for (var j=0; j < y_count; j++ ){
            var cell_id = totalCount;
            cell = new GridCell( i*spacing, j*spacing, i, j, cell_id, spacing );
            cell_map[cell_id] = cell;
            cells.push( cell );
            new_board_line.push(cell);
            totalCount += 1;
        }
        new_board.push(new_board_line);
    }
    board = new Board(new_board);
    return cells;
}
    
function setSelectionMap(){
    for (var i = 0; i < playerList.length; i++ ){
        player = playerList[i];
        selection_map[player] = 'Block';
    }
}

function random_start(){
    var cell_list = [];
    var players = playerList.slice(0);
    for ( var i = 0; i < playerList.length; i++ ){
        var player_pos = Math.floor( Math.random()*players.length );        
        currentPlayer = players[player_pos];
        players.splice(player_pos, 1);
        var valid = false;
        var cell_id = undefined;
        var cell = undefined;
        while ( valid == false ){
            cell_id = Math.floor( Math.random()*cells.length );
            cell = cell_map[cell_id];
            if ( cell.occupied == 0 ){
                valid = true;
                for ( var j = 0; j < cell_list.length; j++ ){
                    if ( distance( cell_list[j], cell, 'manhattan' ) < x_grid_max/playerList.length + y_grid_max/playerList.length ){
                        valid = false;
                        break;
                    }
                }
            } 
        }
        makeMove(cell);
        cell_list.push(cell);
    }
    currentPlayer = playerList[0];
}

// -------------------------------------------------------------

// draw functions :

function clear() { // clear canvas function
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function clear_variables(){
    selectedCell = undefined;
    hoveredCell = undefined;
}

function drawSceneBackground() {
    ctx.globalAlpha=0.10;
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.globalAlpha=1.0;
}

function drawCircle(ctx, x, y, radius) { // draw circle function
    ctx.fillStyle = 'rgba(255, 35, 55, 1.0)';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}

function drawGridPoint(ctx, gridPoint){
    x = gridPoint.x;
    y = gridPoint.y;
    radius = gridPoint.radius;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
    /*ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();*/
}

function drawCell(ctx, cell, type){
    x = cell.x;
    y = cell.y;
    size = cell.size;
    padding = 3;

    selected_galaxy_cell = undefined;

    if ( cell.playerId != 0 ){
        ctx.fillStyle = getColor(cell.playerId);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.0;
        if ( cell.occupied != 0 ){
            ctx.globalAlpha = 0.5;
            ctx.fillRect(x+padding,y+padding,size-2*padding,size-2*padding);
            ctx.globalAlpha = 1.0;
            if ( cell.captured == true ){
                ctx.globalAlpha = 0.5;
                ctx.fillRect(x+padding*3,y+padding*3,size-2*3*padding,size-2*3*padding);
 
                ctx.beginPath();
                ctx.lineWidth="1";
                ctx.strokeStyle=getColor(cell.captured_from);
                ctx.rect(x+padding*3,y+padding*3,size-2*3*padding,size-2*3*padding);
                ctx.stroke();
                ctx.globalAlpha = 1.0;

            }
            if ( galaxy_abbreviation_toggle == true ) {
                ctx.font= "32px Ubuntu";
                ctx.textAlign = 'center';
                ctx.strokeStyle = getColor(cell.playerId);
                ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
                ctx.fillText( cell.galaxy.abbreviation, x+cell.size/2.0, y+cell.size/1.35 ); 
                ctx.strokeText(cell.galaxy.abbreviation, x+cell.size/2.0, y+cell.size/1.35 );
                ctx.textAlign = 'left';
            }
            if ( type == 2 ){
                //console.log(cell);
                selected_galaxy_cell = cell;
            }
        }
        else {
            if ( type == 0 || type == 1 ){
                ctx.globalAlpha = 0.15;
                if ( type == 1 && cell.playerId == currentPlayer ){
                    ctx.globalAlpha = 0.35;
                }
                ctx.fillRect(x+padding,y+padding,size-2*padding,size-2*padding);
                ctx.globalAlpha = 1.0;
            }
            else if ( type == 2 ){
                if ( cell.playerId == currentPlayer ){
                    ctx.globalAlpha = 0.5;
                    ctx.fillRect(x,y,size,size);
                    ctx.globalAlpha = 1.0;  
                    if (getIfAllowedMove(cell)){
                        makeMove(cell);
                    }
                }
                else {
                    ctx.globalAlpha = 0.15;
                    ctx.fillRect(x+padding,y+padding,size-2*padding,size-2*padding);
                    ctx.globalAlpha = 1.0;
                }
            }
        }   
        return;    
    }

    if ( type == 0 ){ // None
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.fillRect(x+padding,y+padding,size-2*padding,size-2*padding);      
    }
    else if ( type == 1 ){ // Hovered
        padding = 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(x+padding,y+padding,size-2*padding,size-2*padding);   
    }
    else if ( type == 2 ){ // Selected
        //console.log(type, ctx.fillStyle, currentPlayer);
        ctx.fillStyle = getColor();
        ctx.globalAlpha = 0.1;
        ctx.fillRect(x,y,size,size); 
        ctx.globalAlpha = 1.0;
        //if (getIfAllowedMove(cell)){
        //    makeMove(cell);
        //}      
    }
}

function drawPlayer(){
    ctx.globalAlpha=0.15;
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    ctx.fillRect(canvas.width-180,10,160,75);
    ctx.globalAlpha=0.75;
    ctx.globalAlpha=1.0;
    ctx.font="24px Ubuntu";
    var playerId = currentPlayer.toString();
    var playerName = playerNames[currentPlayer];
    var playerType = playerTypes[currentPlayer];
    ctx.fillStyle = playerColors[currentPlayer];
    ctx.fillText(playerId + ": " + playerName, canvas.width-170, 40);
    ctx.font="20px Ubuntu";
    ctx.fillText("Type: " + playerType, canvas.width-170, 70); 
}

function drawMenuBackground(){
    var height = canvas.height;
    var width = canvas.width;
    ctx.globalAlpha=0.5;
    ctx.fillStyle = 'rgba(100, 75, 0, 1.0)';
    ctx.fillRect(width-205,0,200,height);
    ctx.globalAlpha=1.0;
    ctx.fillStyle = 'rgba(150, 100, 0, 1.0)';
    ctx.fillRect(width-202,0,5,height);
    ctx.globalAlpha=1.0;
}

function drawPercentBar(){
    var percents = game_statistics.player_cell_percents;
    var height = canvas.height;
    var width = canvas.width;
    var thickness = 5;

    var currentY = 0;
    ctx.globalAlpha=1.0;
    ctx.textAlign = 'right';
    for ( var player in percents ){
        var percent = percents[player]
        var percent_readable = Math.round(percent*100);
        var added_height = Math.round(percent*height);
        ctx.globalAlpha=0.15;
        ctx.fillStyle = getColor(player);
        ctx.fillRect(width-thickness-12,currentY,12,15); 
        ctx.globalAlpha=0.5;
        ctx.fillRect(width-thickness,currentY,thickness,added_height);
        ctx.globalAlpha=1.0;
        ctx.font="10px Ubuntu Light";
        ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
        ctx.fillText(percent_readable, width-thickness, currentY+10); 
        currentY += added_height; 
    }
    ctx.textAlign = 'left';
    ctx.globalAlpha=1.0;
}

function draw_galaxy_details_box(){

    if ( selected_galaxy_cell == undefined ){
        return;
    }

    ctx.globalAlpha=0.05;
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    ctx.fillRect(canvas.width-180,100,160,90);
    ctx.globalAlpha=1.0;

    ctx.globalAlpha=0.75;
    ctx.font="16px Ubuntu";
    ctx.fillText("Galaxy Selected", canvas.width-175, 120);
    ctx.fillStyle = 'rgba(255, 200, 0, 1.0)';
    ctx.fillRect(canvas.width-180, 128,160,1.5);
}

function drawHoverBox(){
    ctx.globalAlpha=0.05;
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    /*ctx.fillRect(canvas.width-180,400,160,150);*/
    ctx.globalAlpha=1.0;
    var endHeight = 400;
    if ( hoveredCell != undefined || selectedCell != undefined ){
        var cell = cells[hoveredCell];
        if ( hoveredCell == undefined ){
            cell = cells[selectedCell];
        }
        var properties = cell.properties;
        var influence = properties.influence;
        var galaxy_count = properties.galaxies_influencing;
        ctx.globalAlpha=0.75;
        ctx.font="16px Ubuntu";
        ctx.fillText("Proximal Galaxies: " + galaxy_count, canvas.width-175, 423);
        if ( galaxy_count != 0 ){
            ctx.fillStyle = 'rgba(255, 200, 0, 1.0)';
            ctx.fillRect(canvas.width-180, 428,160,1.5);
        }
        endHeight = 435;
        var playerCount = 0;
        for ( var player in influence.percents ){
            ctx.font="16px Ubuntu";
            ctx.globalAlpha = 0.05;
            if (cell.playerId == player){
                ctx.font="bold 16px Ubuntu";
                ctx.globalAlpha = 0.2;
            }
            ctx.fillStyle = getColor(player);
            ctx.fillRect(canvas.width-180, 455+(playerCount-1)*25,160,25);
            endHeight = 455+playerCount*25
            ctx.globalAlpha = 0.75;
            ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
            var percent =  Math.round(influence.percents[player]*100);
            var player_name = playerNames[player];
            ctx.textAlign = 'left';
            ctx.fillText(player_name + ": ", canvas.width-175, 450+playerCount*25);
            ctx.textAlign = 'right';
            ctx.fillText(percent + "%", canvas.width-25, 450+playerCount*25);
            ctx.textAlign = 'left';
            playerCount += 1;
        }           
    }
    ctx.globalAlpha=0.05;
    ctx.fillRect(canvas.width-180,400,160,endHeight-400);
    ctx.globalAlpha = 1.0; 
}

function drawGalaxyOptions(){
    ctx.globalAlpha=0.05;
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    ctx.fillRect(canvas.width-180,200,160,130);
    ctx.globalAlpha=1.0;

    ctx.globalAlpha=0.75;
    ctx.font="16px Ubuntu";
    ctx.fillText("Galaxies Available", canvas.width-175, 220);
    ctx.fillStyle = 'rgba(255, 200, 0, 1.0)';
    ctx.fillRect(canvas.width-180, 230,160,1.5);

    var galaxy_names = ['Block', 'Spiral', 'Ring', 'Line'];

    var currentY = 230;
    var box_height = 25;
    var selected = selection_map[currentPlayer];
    for ( var i = 0; i < galaxy_names.length; i++ ){

        var name = galaxy_names[i];

        ctx.globalAlpha=0.05;
        if (selected == name ){
            ctx.globalAlpha=0.15;
            ctx.font="Bold 16px Ubuntu";
        }
        else {
            ctx.globalAlpha=0.05;
            ctx.font="16px Ubuntu";
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
        ctx.fillRect(canvas.width-180,currentY,160,box_height);
        ctx.globalAlpha=0.75;
        ctx.fillText(name, canvas.width-175, currentY+box_height-5);
        currentY += box_height;
    }

}

function draw_screen(){
    ctx.globalAlpha=0.05;
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    ctx.fillRect(0,0,800,550);
    ctx.globalAlpha=1.0;

    ctx.globalAlpha=0.15;
    ctx.fillStyle = 'rgba(200, 200, 200, 1.0)';
    ctx.fillRect(25,25,500,500);
    ctx.globalAlpha=1.0;

    if ( game_start == false ){
        ctx.globalAlpha=0.50;
        ctx.fillStyle = gold_yellow_color;
        ctx.fillRect(600,250,150,50);
        ctx.globalAlpha=1.0;
        ctx.lineWidth=2;
        ctx.beginPath(); 
        ctx.strokeStyle='rgba(255, 255, 255, 0.5)';
        ctx.rect(600,250,150,50); 
        ctx.stroke();      
        ctx.closePath(); 

        ctx.globalAlpha=0.75;
        ctx.font="24px Ubuntu";
        ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
        ctx.fillText("Start", 650, 285);
    }

    ctx.globalAlpha=0.15;
    ctx.fillStyle = 'rgba(200, 200, 200, 1.0)';
    ctx.fillRect(25,25,500,500);
    ctx.globalAlpha=1.0;


    

    var galaxy_names = ['Block', 'Spiral', 'Ring', 'Line'];

    var currentY = 230;
    var box_height = 25;
    var selected = selection_map[currentPlayer];
    for ( var i = 0; i < galaxy_names.length; i++ ){

        var name = galaxy_names[i];

        ctx.globalAlpha=0.05;
        if (selected == name ){
            ctx.globalAlpha=0.15;
            ctx.font="Bold 16px Ubuntu";
        }
        else {
            ctx.globalAlpha=0.05;
            ctx.font="16px Ubuntu";
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
        ctx.fillRect(canvas.width-180,currentY,160,box_height);
        ctx.globalAlpha=0.75;
        ctx.fillText(name, canvas.width-175, currentY+box_height-5);
        currentY += box_height;
    }

}

// drawing organizers

function drawGrid() {
    for (var i=0; i<gridPoints.length; i++) { // display all our gridpoints
        drawGridPoint(ctx, gridPoints[i]);
    }
}

function drawCells(){
    for (var i=0; i<cells.length; i++) { // display all our cells
        type = 0;
        if ( i == hoveredCell ){
            type = 1;
        }
        if ( i == selectedCell ){
            type = 2;
        }
        drawCell(ctx, cells[i], type);
    }
    //console.log(hoveredCell,selectedCell);
}

function drawBorders(){
    for ( var i = 0; i < cells.length; i++ ){
        var cell = cells[i];
        if ( cell.playerId != 0 ){
            var neighbors = get_neighbors(cell,1);
            for ( var direction in neighbors ){
                var neighbor_cell = neighbors[direction];
                if ( neighbor_cell.playerId != cell.playerId ){
                        
                    ctx.globalAlpha = 1.0;
                    ctx.strokeStyle = getColor(cell.playerId);
                    ctx.lineWidth = 1.5;

                    var padding = 5;
                    if ( direction == 'up' ){
                        ctx.beginPath();
                        ctx.moveTo(cell.x          +padding, cell.y        +padding);
                        ctx.lineTo(cell.x+cell.size-padding, cell.y        +padding);                   
                        ctx.stroke();
                    }
                    else if ( direction == 'down' ){
                        ctx.beginPath();
                        ctx.moveTo(cell.x          +padding, cell.y+cell.size-padding);
                        ctx.lineTo(cell.x+cell.size-padding, cell.y+cell.size-padding);                      
                        ctx.stroke();
                    }
                    else if ( direction == 'left' ){
                        ctx.beginPath();
                        ctx.moveTo(cell.x         +padding, cell.y+         +padding);
                        ctx.lineTo(cell.x         +padding, cell.y+cell.size-padding);                      
                        ctx.stroke();
                    }
                    else if ( direction == 'right' ){
                        ctx.beginPath();
                        ctx.moveTo(cell.x+cell.size-padding, cell.y+         +padding);
                        ctx.lineTo(cell.x+cell.size-padding, cell.y+cell.size-padding);                      
                        ctx.stroke();
                    }
                    ctx.globalAlpha = 1.0;
                }
            }
        }
    }
}

function drawSidePane(){
    drawMenuBackground();
    drawPlayer();
    drawHoverBox();
    drawPercentBar();
    drawGalaxyOptions();
    draw_galaxy_details_box();

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
        alert("yes");
    }
}

function clear_variables(){
    keys = [];
    for ( var elem in keys_pressed ){
        keys.push(elem);
    }

    ctx.globalAlpha=0.75;
    ctx.font="16px Ubuntu";
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    ctx.fillText("Keys Pressed: " + keys.toString(), 100, 600);
    
}

function main(){
    clear();

    draw_screen();
    check_start();

    clear_variables();
}

function add_key_down(key){
    if (key in keys_pressed == false){
        keys_pressed[key] = true;
    }
}

function remove_key_down(key){
    if (key in keys_pressed){
        delete keys_pressed[key];
    }    
}
// -------------------------------------------------------------

// player data

function createPlayers(){
    /*
    playerList = [1,2,3];
    currentPlayer = 1;
    playerNames = {1: "Pratheek", 2: "Nagaraj", 3: "Sergei"};
    playerTypes = {1: "Human", 2: "AI", 3: "AI"};
    playerColors = {0: 'rgba(255, 255, 255, 1.0)', 1: 'rgba(255, 0, 0, 1.0)', 2: 'rgba(0, 0, 255, 1.0)', 3: 'rgba(0, 255, 0, 1.0)' };
    playerCount = playerList.length;
    */

    playerList = [1,2];
    currentPlayer = 1;
    playerNames = {1: "Pratheek", 2: "Kaustav"};
    playerTypes = {1: "Human", 2: "Human"};
    playerColors = {0: 'rgba(255, 255, 255, 1.0)', 1: 'rgba(255, 0, 0, 1.0)', 2: 'rgba(0, 0, 255, 1.0)' };
    playerCount = playerList.length;
}

function changePlayer(){
    newIndex = (playerList.indexOf(currentPlayer) + 1) % playerCount;
    currentPlayer = playerList[newIndex];
} 


// -------------------------------------------------------------

// initialization

$(function(){
    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');

    var circleRadius = 15;
    var width = canvas.width;
    var height = canvas.height;
    var spacing = 40;
    var gridRadius = 2.5;

    gridPoints = setGrid(width-200,height,spacing,gridRadius);
    cells = setCells(width-200,height,spacing);
    createPlayers();
    setSelectionMap();
    game_statistics = new GameStatistics();
    game_statistics.reset_statistics();

    keyPressed = undefined;
    $(document).keypress(function(event){
        keyPressed = String.fromCharCode(event.which); 
    });

    $(document.body).keydown(function (evt) {
        var key_down = pressedKeys[evt.keyCode];
        key = String.fromCharCode(evt.keyCode);
        add_key_down(key);
    });

    $(document.body).keyup(function (evt) {
        var key_down = pressedKeys[evt.keyCode];
        key = String.fromCharCode(evt.keyCode);
        remove_key_down(key);
    });


    // binding mousedown event (for dragging)
    $('#scene').click(function(e) {
        var coords = getMouseCoordinates(e);
        var mouseX = coords[0];
        var mouseY = coords[1];

        for (var i=0; i<cells.length; i++){ // find selected cell
            var cellX1 = cells[i].x;
            var cellY1 = cells[i].y;
            var spacing = cells[i].size;
            var cellX2 = cellX1 + spacing;
            var cellY2 = cellY1 + spacing;
            if (mouseX>cellX1 && mouseX<cellX2 && mouseY>cellY1 && mouseY<cellY2) {
                selectedCell = i;
                break;
            }
        }

    });

    $('#scene').mousemove(function(e) { // binding mousemove event for cells
        var coords = getMouseCoordinates(e);
        var mouseX = coords[0];
        var mouseY = coords[1];

        hoveredCell = undefined;
        for (var i=0; i<cells.length; i++){ // find hovered cell
            var cellX1 = cells[i].x;
            var cellY1 = cells[i].y;
            var spacing = cells[i].size;
            var cellX2 = cellX1 + spacing;
            var cellY2 = cellY1 + spacing;
            if (mouseX>cellX1 && mouseX<cellX2 && mouseY>cellY1 && mouseY<cellY2) {
                hoveredCell = i;
                break;
            }
        }
    });

    $('#scene').mouseup(function(e) { // on mouseup - cleaning selectedCircle
        selectedCircle = undefined;
        selectedCell = undefined;
    });

    random_start();

    setInterval(main, 30); // loop drawScene
});

var log = $('#log')[0],
    pressedKeys = [];



