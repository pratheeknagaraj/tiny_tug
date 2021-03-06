var colors = new Object();
colors.GOLD_YELLOW = 'rgba(255, 200, 0, 1.0)';
colors.GOLD_RED_YELLOW = 'rgba(255, 150, 0, 1.0)';
colors.RED = 'rgba(255, 0, 0, 1.0)';
colors.ORANGE = 'rgba(255, 200, 0, 1.0)';
colors.MAGENTA = 'rgba(255, 0, 255, 1.0)';
colors.GREEN = 'rgba(0, 255, 0, 1.0)';
colors.BLUE = 'rgba(0, 0, 255, 1.0)';
colors.LIGHT_BLUE = 'rgba(0, 25, 50, 1.0)';
colors.LIGHT_BLUE_2 = 'rgba(0, 150, 200, 1.0)';
colors.WHITE = 'rgba(255, 255, 255, 1.0)';
colors.BLACK = 'rgba(0, 0, 0, 1.0)';
colors.GREY_1 = 'rgba(200, 200, 200, 1.0)';
colors.ICE = 'rgba(150,150,255,1.0)';
colors.GRASS = 'rgba(0,125,0,1.0)';
colors.GRASS2 = 'rgba(0,175,0,1.0)';
colors.GEL = 'rgba(100,0,100,1.0)';
colors.FIRE = 'rgba(255,150,0,1.0)';
colors.LIGHTNING = 'rgba(200,255,0,1.0)';

function get_team_color(team_id){
    if ( team_id == 0 ){
        return colors.RED;
    }    
    else if ( team_id == 1 ){
        return colors.GREEN;
    }    
    else if ( team_id == 2 ){
        return colors.BLUE;
    }
    else if ( team_id == 3 ){
        return colors.ORANGE;
    }
    else if ( team_id == 4 ){
        return colors.MAGENTA;
    }
    else {
        return undefined;
    }
}
