var end_player_winners = [];
var end_team_winners = [];

function create_team_stats(teams){
    for ( var i in players ){
        var player = players[i];
        var team = player.get_team();

        if ( team.team_id in team_stats == false ){
            team_stats[team.team_id] = {'team': team, 'name': team.team_name, 'coins': 0, 'players': [], 'powerups': 0};            
        }
        team_stats[team.team_id]['players'].push(player);
    }
}

function get_team_stats(){
    for ( var key in team_stats ){
        var team = team_stats[key];
        team['coins'] = 0;
        team['powerups'] = 0;
        for ( var i in team['players'] ){
            var player = team['players'][i];
            team['coins'] += player.get_coins();
            team['powerups'] += player.get_powerups_collected_count();
        }
    }
}

function update_special_player_stats(){
    var pairs = [];
    for ( var i = 0; i < players.length; i++ ){

        var new_pair = [];
        var player = players[i];
        var team = player.get_team();

        var press_count = player.get_total_press_count();
        var powerups_count = player.get_powerups_collected_count();
        var aggressive_count = player.get_aggressive_count();
        var distance_traveled = player.get_distance_traveled();
        var coins_count = player.get_coins_collected_count();
        var sprint_count = player.get_sprint_count();

        var accuracy_value = 0;
        if ( press_count >= 100 ){//500 ){
            var accuracy_value = (powerups_count*500.0 + coins_count*1000.0)/press_count;
        }

        new_pair.push(player, team, press_count, powerups_count, aggressive_count, distance_traveled, coins_count, sprint_count, accuracy_value );
        pairs.push(new_pair);    
    }

    for ( var i = 2; i < 9; i++ ){
        end_player_winners.push( find_max_pair(pairs,i) );
    }

}

function get_end_player_winners(){
    return end_player_winners;
}

function update_team_stats(){
    var pairs = [];
    for ( var team_id in team_stats ){
        var team_map = team_stats[team_id];
        var new_pair = [team_map['team'],team_map['coins']];
        pairs.push(new_pair);
    }

    end_team_winners = find_max_pairs(pairs,1);
}

function get_end_team_winners(){
    return end_team_winners;
}

function run_game_over_stats(){
    update_special_player_stats();
    update_team_stats();
}

// Find the Max Value of Given in Index in List of Lists
function find_max_pair(pairs,index){
    var max_pair = undefined;
    var max_value = undefined;
    for ( var i = 0; i < pairs.length; i++ ){
        var pair = pairs[i];
        if ( max_pair == undefined || pair[index] > max_value ){
            max_pair = pair;
            max_value = pair[index];
        }
    }
    return max_pair;
}

// Find all the Max Value of Given in Index in List of Lists
function find_max_pairs(pairs,index){
    var max_pairs = [];
    var max_value = undefined;
    for ( var i = 0; i < pairs.length; i++ ){
        var pair = pairs[i];
        if ( max_value == undefined || pair[index] > max_value ){
            max_pairs = [pair];
            max_value = pair[index];
        }
        else if ( pair[index] == max_value ){
            max_pairs.push(pair);
        }
    }
    return max_pairs;
}
