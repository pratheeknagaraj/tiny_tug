// --------------- DRAW BACKGROUND SCREEN ----------------- //

function draw_screen(){
    ctx.globalAlpha=0.05;
    ctx.fillStyle = colors.WHITE;
    ctx.fillRect(0,0,800,550);
    ctx.globalAlpha=1.0;

    ctx.globalAlpha=0.10;
    ctx.fillStyle = colors.GREY_1;
    ctx.fillRect(x_min,y_min,x_range,y_range);
    ctx.globalAlpha=1.0;

    if ( game_start == false && 0 == 1 ){
        ctx.globalAlpha=0.50;
        ctx.fillStyle = colors.GOLD_YELLOW;
        ctx.fillRect(650,250,150,50);
        ctx.globalAlpha=1.0;
        ctx.lineWidth=2;
        ctx.beginPath(); 
        ctx.strokeStyle=colors.WHITE;
        ctx.rect(650,250,150,50); 
        ctx.stroke();      
        ctx.closePath(); 

        ctx.globalAlpha=0.75;
        ctx.font="24px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText("Start", 700, 285);
    }

}


// --------------- DRAW BOARD ----------------- //
function draw_board(){
    for ( var i = 0; i < grid.length; i++ ) {
        for ( var j = 0; j < grid[i].length; j++ ) {
            var tile = grid[i][j];
            tile.draw(ctx);
        }
    }
}

// --------------- DRAW COINS ----------------- //

function draw_coins(){
    for ( var i in coins ){
        var coin = coins[i];
        var position = coin.get_position();

        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(position[0], position[1], coin.get_size()/2, 0, Math.PI*2); 
        ctx.fillStyle = colors.GOLD_YELLOW;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 1;
        ctx.strokeStyle = colors.GOLD_YELLOW;
        ctx.stroke();

    }

    for ( var i in lost_coins ){
        var coin = lost_coins[i];
        var position = coin.get_position();

        ctx.globalAlpha = coin.get_alpha();
        ctx.beginPath();
        ctx.arc(position[0], position[1], coin.get_size()/2, 0, Math.PI*2); 
        ctx.fillStyle = colors.GOLD_RED_YELLOW;
        ctx.fill();
        ctx.globalAlpha = coin.get_alpha()*2;
        ctx.lineWidth = 1;
        ctx.strokeStyle = colors.GOLD_RED_YELLOW;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        
        coin.update();

    }
}

// --------------- DRAW MISSILES ----------------- //

function draw_missiles(){
    for ( var i in missiles ){
        var missile = missiles[i];
        var position = missile.get_position();
        var team_owner = missile.get_team();
        var team_color = team_owner.team_color;
        var missile_alpha = missile.get_alpha();
        var angle = missile.get_angle();
        var size = missile.get_size();
        var cen = position;

        ctx.beginPath();
        ctx.moveTo(cen[0]+size*Math.cos(angle),position[1]+size*Math.sin(angle));
        ctx.lineTo(cen[0]+0.75*size*Math.cos(angle+Math.PI*2/3),cen[1]+0.75*size*Math.sin(angle+Math.PI*2/3));
        ctx.lineTo(cen[0]+0.75*size*Math.cos(angle+Math.PI*4/3),cen[1]+0.75*size*Math.sin(angle+Math.PI*4/3));
        ctx.closePath();

        ctx.globalAlpha = missile_alpha;
        ctx.fillStyle = team_color;
        ctx.fill();

        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 1;
        ctx.strokeStyle = team_color;
        ctx.stroke();

        //ctx.arc(position[0], position[1], missile.get_size()/2, 0, Math.PI*2); 

        //ctx.fill();
        //ctx.stroke();

    }

    for ( var i in dead_missiles ){
        var missile = dead_missiles[i];
        var position = missile.get_position();
        var team_owner = missile.get_team();
        var team_color = team_owner.team_color;
        var missile_alpha = missile.get_alpha();

        ctx.globalAlpha = missile_alpha;
        ctx.lineWidth = 1;
        ctx.strokeStyle = team_color;

        var arc_size = Math.PI/6;
        var arc_count = 4;

        for ( var i = 0; i < arc_count; i++ ){
            var center_angle = Math.PI*2/arc_count * i;

            ctx.beginPath();
            ctx.arc(position[0], position[1], missile.get_size()/2, -arc_size + center_angle, arc_size + center_angle);
            ctx.stroke();
        }

        ctx.globalAlpha = 1.0;

    }
}

// --------------- DRAW POWERUPS ----------------- //

function draw_powerups(){
    for ( var i in powerups ){
        var powerup = powerups[i];
        powerup.draw(ctx);
    }
}

// --------------- DRAW PLAYERS ----------------- //

function draw_players(){
    for ( var i in players ){
        player = players[i]
        color = player.get_color(player.get_team());
        
        ctx.globalAlpha=0.3;

        var position = player.get_position();
        var size = player.get_size();

        ctx.beginPath();
        ctx.arc(position[0], position[1], size/2, 0, Math.PI*2); 
        ctx.fillStyle = color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.stroke();

        ctx.globalAlpha=1.0;

        player.draw_info(ctx);
    }
}

// --------------- DRAW TEATHERS ----------------- //

function draw_teathers(){
    teather_list = []    
    for ( var start in teathers ){
        for ( var end in teathers[start] ){
            teather_list.push( teathers[start][end] );
        }    
    }

    for ( var j in teather_list ){
        var teather = teather_list[j]
        var ends = teather.get_ends();
        var player1 = id_to_player[ends[0]]
        var player2 = id_to_player[ends[1]]
        var player1_pos = player1.get_position();
        var player2_pos = player2.get_position();
        var distance = get_sprite_distance(player1,player2);
        teather.set_size(distance);
        var distance_ratio = distance/teather.get_max_size();
        var multiplier = Math.pow(distance_ratio,2.0); // Quadratic    

        ctx.beginPath();
        ctx.lineCap="round";
        ctx.strokeStyle = player1.get_color(teather.get_team());
        ctx.lineWidth = 5 * multiplier;  
        ctx.globalAlpha = 1.0 * multiplier;      
        ctx.moveTo(player1_pos[0],player1_pos[1]);
        ctx.lineTo(player2_pos[0],player2_pos[1]);
        ctx.stroke();

        ctx.globalAlpha = 1.0;
    }
    
}

// --------------- DRAW OPTIONS ----------------- //

function draw_options(){
    draw_sfx_button();
}

function draw_sfx_button(){
    
    ctx.globalAlpha=0.25;
    ctx.lineWidth=2;
    ctx.beginPath(); 
    ctx.strokeStyle=colors.WHITE;
    ctx.rect(730,500,30,25);
    ctx.closePath();  
    ctx.stroke();      
    

    if ( sfx_on == false ){
        ctx.globalAlpha=0.25;
        ctx.fillStyle = colors.RED;
        ctx.fillRect(730,500,30,25);
        
    }
    else{

        ctx.globalAlpha=0.15;
        ctx.fillStyle = colors.GREEN;
        ctx.fillRect(730,500,30,25);
    }
    ctx.globalAlpha=1.0;
    ctx.font="12px Ubuntu";
    ctx.fillStyle = colors.WHITE;
    ctx.fillText("SFX", 735, 517);

    ctx.globalAlpha=1.0;
}

// --------------- DRAW TEAM STATS ----------------- //

function order_teams(){
    var teams_ordered = [];
    for ( var i in teams ){
        var team = teams[i];
        var total_coins = team.get_total_coins();
        teams_ordered.push( [team,total_coins] );
    }

    teams_ordered.sort(function(a, b)
    {
        return b[1] - a[1];
    });

    return teams_ordered;
}

function draw_team_stats(){

    var teams_ordered = order_teams();
    //for ( var i in teams ){
    //    var team = teams[i];
    //    var total_coins = team.get_total_coins();
    //    teams_ordered.push( [team,total_coins] );
    //}

    //teams_ordered.sort(function(a, b)
    //{
    //    return b[1] - a[1];
    //});

    //teams_ordered.sort();

    var team_count = 0;
    for ( var i in teams_ordered ){
        var team = teams_ordered[i][0];
        var team_name = team.get_team_name();
        var total_coins = teams_ordered[i][1];

        ctx.globalAlpha=0.15;
        ctx.fillStyle = team.get_color();
        ctx.fillRect(640,65*team_count+75,150,60);
        ctx.globalAlpha=1.0;

        ctx.globalAlpha=0.10;
        ctx.fillStyle = team.get_color();
        ctx.fillRect(640,65*team_count+75,150,30);
        ctx.globalAlpha=1.0;


        ctx.globalAlpha=0.75;
        ctx.font="16px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText(team_name, 650, 65*team_count+95);

        ctx.font="12px Ubuntu";
        ctx.fillStyle = colors.GOLD_YELLOW;
        ctx.fillText("Coins: ", 650, 65*team_count+125);

        ctx.globalAlpha=0.50;
        ctx.fillStyle = colors.GOLD_YELLOW;
        ctx.fillRect(685,65*team_count+115,total_coins*1,10);
        ctx.globalAlpha=1.0;

        ctx.font="12px Ubuntu";
        ctx.fillStyle = colors.GOLD_YELLOW;
        ctx.fillText(total_coins, 685+total_coins*1 + 5, 65*team_count+125);

        team_count += 1;
    }

}

// --------------- DRAW TIME STATS ----------------- //

function draw_time_stats(){

        ctx.globalAlpha=0.10;
        ctx.fillStyle = colors.WHITE;
        ctx.fillRect(640,30,150,30);
        ctx.globalAlpha=1.0;


        if ( time_warning_count > 0 ){
            ctx.globalAlpha=0.15+time_warning_count/20.0;
            ctx.fillStyle = 'rgba(255,'+(255-time_warning_count*25).toString()+','+(255-time_warning_count*25).toString()+',1.0)';
            //console.log(ctx.fillStyle,time_warning_count);
            ctx.fillRect(640,30,(time*1000)*150/(end_time*fps),30);
        }
        else {
            ctx.globalAlpha=0.15;
            ctx.fillStyle = colors.WHITE;
            ctx.fillRect(640,30,(time*1000)*150/(end_time*fps),30);
        }
        
        ctx.globalAlpha=1.0;

        ctx.globalAlpha=0.75;
        ctx.font="16px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText("Time: " + (time/fps).toFixed(0) + ' s', 650, 50);
}
