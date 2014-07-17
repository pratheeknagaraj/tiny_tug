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
