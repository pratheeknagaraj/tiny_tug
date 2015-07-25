Team.prototype = new Team();
Team.prototype.constructor=Team; 
function Team(team_name,team_id,players,team_color){
    this.team_name = team_name;
    this.team_id = team_id;
    this.players = players;
    this.team_color = team_color;

    for ( var i in players ){
        var player = players[i];
        player.set_team(this);
    }

    this.get_total_coins = function(){
        var total_coins = 0;
        for ( var i in players ){
            var player = players[i];
            total_coins += player.get_coins();
        }
        return total_coins;
    }

    this.get_team_name = function(){
        return this.team_name;
    }

    this.get_color = function(){
        return team_color;
    }
}

function create_team(team_name,team_id,players,team_color){
    return new Team(team_name,team_id,players,team_color);
}
