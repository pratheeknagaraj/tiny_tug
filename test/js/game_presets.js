Game_Presets.prototype = new Game_Presets();
Game_Presets.prototype.constructor=Game_Presets; 
function Game_Presets(){

    this.get_game_preset = function(number){
        if (number == 0){
            var player1 = {'name': 'a', 'ai': false};
            var player2 = {'name': 'b', 'ai': false};
            var player3 = {'name': 'c', 'ai': false};
            var player4 = {'name': 'd', 'ai': true};
            var player5 = {'name': 'e', 'ai': true};

            var players1_list = [player1,player2,player3];
            var players2_list = [player4,player5];

            var team1 = {'players': players1_list};
            var team2 = {'players': players2_list};

            var teams = {'Pratheek': team1, 'Nagaraj': team2};

            var game = {'teams': teams};

            return game;
        }

        if (number == 1){
            var player1 = {'name': 'Player1', 'ai': false};
            var player2 = {'name': 'Player2', 'ai': false};
            var player3 = {'name': 'Player3', 'ai': false};
            var player4 = {'name': 'Player4', 'ai': false};

            var players1_list = [player1,player2];
            var players2_list = [player3,player4];

            var team1 = {'players': players1_list}; 
            var team2 = {'players': players2_list};

            var teams = {'Team 1': team1, 'Team 2': team2};

            var game = {'teams': teams};

            return game;
        }

        if (number == 2){
            var player1 = {'name': 'Koko', 'ai': false, 'skill': 'nuclear'};
            var player2 = {'name': 'Jintastic', 'ai': false, 'skill': 'plunder'};
            var player3 = {'name': 'Bultcocuk', 'ai': false, 'skill': 'plunder'};
            var player4 = {'name': 'Jessica', 'ai': false, 'skill': 'plunder'};
            var player5 = {'name': 'Pratnag', 'ai': false, 'skill': 'invisible'};

            var players1_list = [player1];
            var players2_list = [player2];
            var players3_list = [player3];
            var players4_list = [player4];
            var players5_list = [player5];

            var team1 = {'players': players1_list};
            var team2 = {'players': players2_list};
            var team3 = {'players': players3_list};
            var team4 = {'players': players4_list};
            var team5 = {'players': players5_list};

            var teams = {'Kaustav': team1, 'Jin': team2, 'Deniz': team3, 'Jessica': team4, 'Pratheek': team5};

            var game = {'teams': teams};

            return game;
        }

        if (number == 3){
            var player1 = {'name': 'pratnag', 'ai': false, 'skill': 'invisible'};
            var player2 = {'name': 'koko', 'ai': false, 'skill': 'nuclear'};

            var players1_list = [player1];
            var players2_list = [player2];
            var team1 = {'players': players1_list};
            var team2 = {'players': players2_list};

            var teams = {'Pratheek': team1, 'Kaustav': team2};

            var game = {'teams': teams};

            return game;
        }
        if (number == 4){
            var player1 = {'name': 'pratnag', 'ai': false};
            var player2 = {'name': 'sergei', 'ai': false};
            var player3 = {'name': 'coke', 'ai': true};
            var player4 = {'name': 'koko', 'ai': false};
            var player5 = {'name': 'k', 'ai': false};
            var player6 = {'name': 'mass', 'ai': true};

            var players1_list = [player1,player2,player3];
            var players2_list = [player4,player5,player6];
            var team1 = {'players': players1_list};
            var team2 = {'players': players2_list};

            var teams = {'Pratheek': team1, 'Kaustav': team2};

            var game = {'teams': teams};

            return game;
        }

        if (number == 5){
            var player1 = {'name': 'pratnag', 'ai': false};
            var player2 = {'name': 'sergei', 'ai': false};
            var player3 = {'name': 'koko', 'ai': true};
            var player4 = {'name': 'arch', 'ai': false};
            var player5 = {'name': 'koko', 'ai': true};
            var player6 = {'name': 'arch', 'ai': true};

            var players1_list = [player1,player2];
            var players2_list = [player3,player4,player5,player6];
            var team1 = {'players': players1_list};
            var team2 = {'players': players2_list};

            var teams = {'The Nemisis': team1, 'Calvin Hobbes': team2};

            var game = {'teams': teams};

            return game;
        }

        if (number == 6){
            var player1 = {'name': 'jaragan', 'ai': false};
            var player2 = {'name': 'sergei', 'ai': false};

            var players1_list = [player1,player2];

            var team1 = {'players': players1_list};

            var teams = {'KP': team1};

            var game = {'teams': teams};

            return game;
        }

        if (number == 7){
            var player1 = {'name': 'p1', 'ai': false};
            var player2 = {'name': 'p2', 'ai': true};
            var player3 = {'name': 'p3', 'ai': false};
            var player4 = {'name': 'p4', 'ai': true};
            var player5 = {'name': 'p5', 'ai': false};
            var player6 = {'name': 'p6', 'ai': true};
            var player7 = {'name': 'p7', 'ai': false};
            var player8 = {'name': 'p8', 'ai': true};

            var players1_list = [player1,player2];
            var players2_list = [player3,player4];
            var players3_list = [player5,player6];
            var players4_list = [player7,player8];

            var team1 = {'players': players1_list};
            var team2 = {'players': players2_list};
            var team3 = {'players': players3_list};
            var team4 = {'players': players4_list};

            var teams = {'team1': team1, 'team2': team2, 'team3': team3, 'team4': team4};

            var game = {'teams': teams};

            return game;
        }

        if (number == 8){
            var player1 = {'name': 'p1', 'ai': false};
            var player2 = {'name': 'p2', 'ai': true};
            var player3 = {'name': 'p3', 'ai': true};
            var player4 = {'name': 'p4', 'ai': false};
            var player5 = {'name': 'p5', 'ai': true};
            var player6 = {'name': 'p6', 'ai': true};
            var player7 = {'name': 'p7', 'ai': false};
            var player8 = {'name': 'p8', 'ai': true};
            var player9 = {'name': 'p9', 'ai': true};
            var player10 = {'name': 'p10', 'ai': false};
            var player11 = {'name': 'p11', 'ai': true};
            var player12 = {'name': 'p12', 'ai': true};

            var players1_list = [player1,player2,player3];
            var players2_list = [player4,player5,player6];
            var players3_list = [player7,player8,player9];
            var players4_list = [player10,player11,player12];

            var team1 = {'players': players1_list};
            var team2 = {'players': players2_list};
            var team3 = {'players': players3_list};
            var team4 = {'players': players4_list};

            var teams = {'team1': team1, 'team2': team2, 'team3': team3, 'team4': team4};

            var game = {'teams': teams};

            return game;
        }
    }
}
