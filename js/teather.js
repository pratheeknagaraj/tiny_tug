Teather.prototype.constructor=Teather; 
function Teather(team,id,player1,player2){
    this.teather_id = id;
    this.team = team;
    this.size = 0;
    this.base_max_size = 100;
    this.max_size = this.base_max_size;
    this.player1 = player1;
    this.player2 = player2;
    this.max_tension = 5;

    this.get_ends = function(){
        return [this.player1, this.player2];
    }

    this.get_team = function(){
        return this.team;
    }

    this.get_teather_id = function(){
        return this.teather_id;
    }

    this.get_max_size = function(){
        return this.max_size;
    }

    this.get_size_ratio = function(){
        var ratio = this.size/this.max_size;
        return ratio;
    }

    this.get_tension = function(){
        return this.max_tension*Math.pow(this.get_size_ratio(),2.5);
    }

    this.set_size = function(distance){
        this.size = distance;
    }

    this.set_max_size_multiplier = function(multiplier){
        this.max_size = this.base_max_size*multiplier;
    }
}

function create_teather(team,id,p1,p2){
    return new Teather(team,id,p1,p2);
}

function create_teathers(){
    var teather_count = 0;
    for ( var i in players ){
        var player = players[i];
        for ( var j in players ){
            if ( i == j ){
                continue;
            }
            var other_player = players[j];
            if ( player.get_team() == other_player.get_team() ){
                if (!( player.get_player_id() in teathers )){
                    teathers[player.get_player_id()] = {};
                }
                var new_teather;
                if ( other_player.get_player_id() in teathers &&
                     player.get_player_id() in teathers[other_player.get_player_id()] ) {
                    new_teather = teathers[other_player.get_player_id()][player.get_player_id()];
                }
                else {
                    new_teather = create_teather(player.get_team(), teather_count, player.get_player_id(), other_player.get_player_id() );
                    teather_count += 1;
                }
                teathers[player.get_player_id()][other_player.get_player_id()] = new_teather;
            }
        }
    }
}

function modify_teathers(player,max_size_multiplier){
    for ( var other_player_id in teathers[player.get_player_id()] ){
        var teather = teathers[player.get_player_id()][other_player_id];
        teather.set_max_size_multiplier(max_size_multiplier);
    }
}
