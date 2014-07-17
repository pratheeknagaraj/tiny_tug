// Galaxy 
function Galaxy(){ 
    this.internal_name;
    this.readable_name;
    this.player;
    this.distribution;
} 

Galaxy.prototype.getInfluence=function(){ 
    return this.distribution.getInfluence();
} 

// Block Galaxy
BlockGalaxy.prototype = new Galaxy();
BlockGalaxy.prototype.constructor=BlockGalaxy; 
function BlockGalaxy(range,power,player){
    this.internal_name = "block_galaxy";
    this.readable_name = "Block Galaxy";
    this.player = player;
    this.metric = 'manhattan_max';
    this.hotkey = 'b';
    this.hotnumber = '1';
    this.abbreviation = 'B';
    this.distribution = new LinearDistribution(range,power);
}

// Spiral Galaxy
SpiralGalaxy.prototype = new Galaxy();
SpiralGalaxy.prototype.constructor=SpiralGalaxy; 
function SpiralGalaxy(range,power,player){
    this.internal_name = "spiral_galaxy";
    this.readable_name = "Spiral Galaxy";
    this.player = player;
    this.metric = 'manhattan'
    this.hotkey = 's';
    this.hotnumber = '2';
    this.abbreviation = 'S';
    this.distribution = new LinearDistribution(range,power);
}

// Ring Galaxy
RingGalaxy.prototype = new Galaxy();
RingGalaxy.prototype.constructor=RingGalaxy; 
function RingGalaxy(range,power,player){
    this.internal_name = "ring_galaxy";
    this.readable_name = "Ring Galaxy";
    this.player = player;
    this.metric = 'manhattan'
    this.hotkey = 'r';
    this.hotnumber = '3';
    this.abbreviation = 'R';
    this.distribution = new UniformDistribution(range,power);
}

// Line Galaxy
LineGalaxy.prototype = new Galaxy();
LineGalaxy.prototype.constructor=LineGalaxy; 
function LineGalaxy(range,power,player){
    this.internal_name = "line_galaxy";
    this.readable_name = "Line Galaxy";
    this.player = player;
    this.metric = 'lines';
    this.hotkey = 'l';
    this.hotnumber = '4';
    this.abbreviation = 'L';
    this.distribution = new QuadraticDistribution(range,power);
}

function get_galaxy( type ){
   var galaxy; 
   if ( type == 'block_galaxy' ){
        galaxy = new BlockGalaxy([0,1,2],1.0,currentPlayer);
    }
    else if ( type == 'spiral_galaxy' ){
        galaxy = new SpiralGalaxy([0,1,2],2.0,currentPlayer);
    }
    else if ( type == 'ring_galaxy' ){
        galaxy = new RingGalaxy([0,3,4],1.5,currentPlayer);
    }
    else if ( type == 'line_galaxy' ){
        galaxy = new LineGalaxy([0,1,2,3,4,5],1.5,currentPlayer);
    }
    return galaxy;
}
