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

// --------------- DRAW END SCREEN ----------------- //

var load_count = 0;

function draw_end_screen(){
    ctx.globalAlpha=0.15;
    ctx.fillStyle = colors.WHITE;
    ctx.fillRect(x_min,y_min,x_range,y_range);
    ctx.globalAlpha=1.0;

    ctx.globalAlpha=0.5;
    ctx.fillStyle = colors.LIGHT_BLUE;
    ctx.fillRect(x_min + 200,y_min + 20,x_range-400,40);
    ctx.globalAlpha=1.0;

    ctx.textAlign = "center";

    ctx.globalAlpha=1.0;
    ctx.font="28px Ubuntu";
    ctx.fillStyle = colors.WHITE;
    ctx.fillText("Game Over", x_min + x_range/2.0, y_min + 50);

    var end_team_stats = get_end_team_winners();
    var team_names = [];
    for ( var i = 0; i < end_team_stats.length; i++ ){
        team_names.push( end_team_stats[i][0].team_name );
    }
    var team_winners_string = team_names.join();

    ctx.globalAlpha=0.5;
    ctx.fillStyle = colors.LIGHT_BLUE;
    ctx.fillRect(x_min + 100,y_min + 70,x_range-200,40);
    ctx.globalAlpha=1.0;


    ctx.textAlign = "start";

    if ( team_names.length > 1 ){
        ctx.globalAlpha=0.5;
        ctx.fillStyle = colors.LIGHT_BLUE;
        ctx.fillRect(x_min + 125,y_min + 75,x_range-250,30);
        ctx.globalAlpha=1.0;

        ctx.globalAlpha=1.0;
        ctx.font="20px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText("Tie Game: " + team_winners_string, x_min + 150, y_min + 100);
    }
    else {
        ctx.globalAlpha=0.5;
        ctx.fillStyle = end_team_stats[0][0].get_color();
        ctx.fillRect(x_min + 125,y_min + 75,x_range-250,30);
        ctx.globalAlpha=1.0;

        ctx.globalAlpha=1.0;
        ctx.font="20px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText("Winner: " + team_winners_string, x_min + 150, y_min + 100);
    }

    var end_stats = get_end_player_winners();
    //var end_stats_names = ["Most Active: ", "Most Powerups: ", "Most Aggressive: ", "Most Traveled: ", "Most Coins: ", "Most Sprints: ", "Most Accurate: "];
    var end_stats_names = ["Button Smasher", "Powerup Fanatic", "Lead Attacker", "Travel Connossier", "Coin Hearder", "Sprint Champion", "Precision Master"];


    ctx.globalAlpha=0.5;
    ctx.fillStyle = colors.LIGHT_BLUE;
    ctx.fillRect(x_min + 100,y_min + 120,x_range-200,70+7*(end_stats.length)*load_count);
    ctx.globalAlpha=1.0;

    for ( var i = 0; i < end_stats.length; i++ ){
        
        if ( load_count < i ){
            load_count += 0.05;
            break;
        }

        var winner = end_stats[i][0];
        var color = winner.get_color();

        ctx.globalAlpha=0.3;
        ctx.fillStyle = color;
        ctx.fillRect(x_min + 125, y_min + 130 + 45*i,x_range/2.0-125,30);

        ctx.globalAlpha=0.75;
        ctx.font="16px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText(end_stats_names[i], x_min + 140, y_min + 150 + 45*i);
        ctx.globalAlpha=1.0;
    
        ctx.textAlign = "end";

        ctx.globalAlpha=0.45;
        ctx.fillStyle = color;
        ctx.fillRect(x_min + x_range/2.0, y_min + 130 + 45*i,x_range/2.0-125,30);

        ctx.globalAlpha=0.75;
        ctx.font="16px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText(winner.player_name, x_min + x_range - 140, y_min + 150 + 45*i);
        ctx.globalAlpha=1.0;

        ctx.textAlign = "start";
    }

    if ( load_count > end_stats_names.length - 1 ){
        ctx.globalAlpha=0.15;
        ctx.fillStyle = colors.WHITE;
        ctx.fillRect(x_min + 250,y_min + 440,100,30);

        ctx.globalAlpha=0.75;
        ctx.lineWidth=1.5;
        ctx.beginPath(); 
        ctx.strokeStyle=colors.WHITE;
        ctx.rect(x_min + 250,y_min + 440,100,30);
        ctx.closePath();  
        ctx.stroke();    

        ctx.globalAlpha=0.75;
        ctx.font="16px Ubuntu";
        ctx.fillStyle = colors.WHITE;
        ctx.fillText("Replay?",x_min + 273, y_min + 460);
        ctx.globalAlpha=1.0;

        new_game_ready = true;

    }

/*
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
*/
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

// --------------- DRAW PLUNDERS ----------------- //

function draw_plunders(owner,loser){

    if ( loser == undefined ){
        var owner_pos = owner.get_position();
        var owner_size = owner.get_size();
        var owner_color = owner.get_color();
        var angle = 2*Math.PI * (get_time()%16 )/ 16;

        ctx.beginPath();
        ctx.moveTo(owner_pos[0],owner_pos[1]);
        ctx.lineTo(owner_pos[0] + Math.cos(angle)*owner_size/2.0,owner_pos[1]+ Math.sin(angle)*owner_size/2.0);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = owner_color;
        ctx.stroke();

        ctx.globalAlpha = 1.0;
    } 
    else {
        var owner_pos = owner.get_position();
        var loser_pos = loser.get_position();

        ctx.globalAlpha = 0.5;

        var grad= ctx.createLinearGradient(owner_pos[0], owner_pos[1], loser_pos[0], loser_pos[1]);
        grad.addColorStop(0.5, owner.get_color());
        grad.addColorStop(1, loser.get_color());

        ctx.strokeStyle = grad;

        ctx.beginPath();
        ctx.moveTo(owner_pos[0],owner_pos[1]);
        ctx.lineTo(loser_pos[0],loser_pos[1]);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.globalAlpha = 1.0;
    }
}

// --------------- DRAW LIGHTNING ----------------- //

function draw_lightning(players_hit,angle){
    for ( var i in players_hit ){
        var player = players_hit[i];
        var player_pos = player.get_position();
        var player_size = player.get_size();

        //var angle = Math.random()*Math.PI*2;

        ctx.globalAlpha = 0.5;
        
        ctx.beginPath();
        ctx.moveTo(player_pos[0]+Math.cos(angle)*(player_size/2.0+5),       player_pos[1]+Math.sin(angle)*(player_size/2.0+5));
        ctx.lineTo(player_pos[0]+Math.cos(angle+0.5)*(player_size/2.0+10),  player_pos[1]+Math.sin(angle+0.5)*(player_size/2.0+10));
        ctx.lineTo(player_pos[0]+Math.cos(angle)*(player_size/2.0+9),       player_pos[1]+Math.sin(angle)*(player_size/2.0+9));
        ctx.lineTo(player_pos[0]+Math.cos(angle+0.5)*(player_size/2.0+15),  player_pos[1]+Math.sin(angle+0.5)*(player_size/2.0+15));
        ctx.closePath();

        ctx.strokeStyle = colors.LIGHTNING;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(player_pos[0]-Math.cos(angle)*(player_size/2.0+5),       player_pos[1]-Math.sin(angle)*(player_size/2.0+5));
        ctx.lineTo(player_pos[0]-Math.cos(angle+0.5)*(player_size/2.0+10),  player_pos[1]-Math.sin(angle+0.5)*(player_size/2.0+10));
        ctx.lineTo(player_pos[0]-Math.cos(angle)*(player_size/2.0+9),       player_pos[1]-Math.sin(angle)*(player_size/2.0+9));
        ctx.lineTo(player_pos[0]-Math.cos(angle+0.5)*(player_size/2.0+15), player_pos[1]-Math.sin(angle+0.5)*(player_size/2.0+15));      
        ctx.closePath()

        ctx.strokeStyle = colors.LIGHTNING;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.globalAlpha = 1.0;
    }
}

// ------------- DRAW SKILL ORB --------------- //

function draw_skill_orbs(){
    for ( var i in skill_orbs ){
        var skill_orb = skill_orbs[i];
        var position = skill_orb.get_position();
        var size = skill_orb.get_size();
        var self_timer = skill_orb.get_self_timer()/10;

        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(position[0], position[1], skill_orb.get_size()/2, 0, Math.PI*2); 
        ctx.fillStyle = colors.LIGHT_BLUE_2;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = colors.LIGHT_BLUE_2;
        ctx.stroke();

        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(position[0]+skill_orb.get_size()*Math.cos(-1*self_timer)/2, position[1]+skill_orb.get_size()*Math.sin(-1*self_timer)/2);
        ctx.lineTo(position[0]-skill_orb.get_size()*Math.sin(-1*self_timer)/2, position[1]+skill_orb.get_size()*Math.cos(-1*self_timer)/2);
        ctx.lineTo(position[0]-skill_orb.get_size()*Math.cos(-1*self_timer)/2, position[1]-skill_orb.get_size()*Math.sin(-1*self_timer)/2);
        ctx.lineTo(position[0]+skill_orb.get_size()*Math.sin(-1*self_timer)/2, position[1]-skill_orb.get_size()*Math.cos(-1*self_timer)/2);
        ctx.lineTo(position[0]+skill_orb.get_size()*Math.cos(-1*self_timer)/2, position[1]+skill_orb.get_size()*Math.sin(-1*self_timer)/2);
        ctx.closePath();

        ctx.strokeStyle = colors.LIGHT_BLUE_2;
        ctx.stroke();

        ctx.beginPath();
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 1.5;
        ctx.arc(position[0], position[1], skill_orb.get_size()/2+Math.abs(3-self_timer%6)+2, self_timer, Math.PI/2+self_timer);
        ctx.strokeStyle = colors.LIGHT_BLUE_2;
        ctx.stroke();

        ctx.beginPath();
        ctx.globalAlpha = 0.6;
        ctx.arc(position[0], position[1], skill_orb.get_size()/2+Math.abs(3-self_timer%6)+2, self_timer+Math.PI, 3*Math.PI/2+self_timer);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = colors.LIGHT_BLUE_2;
        ctx.stroke();

        /*
        for ( var i = 0; i < 10; i++ ){
            console.log("HERE#"); 
            ctx.globalAlpha = 0.5;
            var angle = Math.random()*Math.PI*2;
            ctx.beginPath();
            ctx.moveTo(position[0]+size*Math.cos(angle),position[1]+size*Math.sin(angle));
            ctx.lineTo(position[0]+(size+2)*Math.cos(angle),position[1]+(size+2)*Math.sin(angle));
            ctx.closePath();
            ctx.stroke();
        }
        */

        ctx.globalAlpha = 1.0;

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
        ctx.moveTo(cen[0]+size*Math.cos(angle),cen[1]+size*Math.sin(angle));
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
        var color = player.get_color(player.get_team());
        var skill_hit_count = player.get_skill_hit_percent();
        
        var position = player.get_position();
        var size = player.get_size();
            

        if ( player.invisible == false ){
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(position[0], position[1], size/2, 0, Math.PI*2); 
            ctx.fillStyle = color;
            ctx.fill();
            ctx.globalAlpha = 1.0;
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;
            ctx.stroke();
        }
        else {
            ctx.globalAlpha = 0.05;
            ctx.beginPath();
            ctx.arc(position[0], position[1], size/2, 0, Math.PI*2); 
            ctx.fillStyle = color;
            ctx.fill();
            ctx.globalAlpha = 1.0;
            ctx.lineWidth = 0.5;
            //ctx.arc(position[0], position[1], size/2, 0 + sector_angle*2*i, 0 + sector_angle*(2*i+1));                 
            ctx.strokeStyle = color;
            ctx.stroke();
        }


        if ( player.is_nuclear ){
            var nuclear_x = player.nuclear_x;
            var nuclear_y = player.nuclear_y;
            var nuclear_size = player.nuclear_size;
            var nuclear_number = player.nuclear_number;
            var nuclear_timer = player.nuclear_timer*Math.PI*2/60;

            ctx.globalAlpha = 0.1 + nuclear_size/2000.0;
            ctx.beginPath();
            ctx.arc(nuclear_x, nuclear_y, nuclear_size/2, 0, Math.PI*2); 
            ctx.fillStyle = color;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(nuclear_x, nuclear_y);
            ctx.lineTo(nuclear_x + Math.cos(nuclear_timer)*nuclear_size/2.0, nuclear_y + Math.sin(nuclear_timer)*nuclear_size/2.0);
            ctx.closePath();

            ctx.lineWidth = 5;
            ctx.strokeStyle = color;
            ctx.stroke();

            ctx.globalAlpha=0.5;
            ctx.font="24px Ubuntu";
            ctx.fillStyle = color;
            ctx.fillText(nuclear_number.toString(), nuclear_x-7, nuclear_y+5);
        }

        /*
        ctx.beginPath();
        ctx.arc(position[0], position[1], size/2, 0, Math.PI*2); 
        ctx.fillStyle = color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.stroke();
        */

        // Skill Orb Value
        ctx.beginPath();
        ctx.arc(position[0], position[1], size/2, 0, Math.PI*2*skill_hit_count); 
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 4;
        ctx.strokeStyle = colors.LIGHT_BLUE_2;
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
        ctx.fillRect(685,65*team_count+115,total_coins*0.25 ,10);
        ctx.globalAlpha=1.0;

        ctx.font="12px Ubuntu";
        ctx.fillStyle = colors.GOLD_YELLOW;
        ctx.fillText(total_coins, 685+total_coins*0.25 + 5, 65*team_count+125);

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
