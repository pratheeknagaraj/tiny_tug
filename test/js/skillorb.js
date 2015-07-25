skill_orbs = [];

SkillOrb.prototype.constructor=SkillOrb; 
function SkillOrb(){
    this.x = 0;
    this.y = 0;
    this.size = 15;
    this.mass = 15;

    this.self_timer = 0;
    this.smoothness = 10;
    this.speed = 0.5;
    this.spin_angle = 0;
    this.vx = Math.cos(this.spin_angle)*this.speed;
    this.vy = Math.sin(this.spin_angle)*this.speed;

    this.vx2 = 0;
    this.vy2 = 0;

    this.xmin = -1;
    this.ymin = -1;
    this.xrange = -1;
    this.yrange = -1;


    this.get_position = function(){
        return [this.x, this.y];
    }

    this.get_size = function(){
        return this.size;
    }

    this.set_random_position = function(xrange,yrange,xmin,ymin){ 
        this.x = (xrange-this.size*2)*Math.random() + xmin + this.size;
        this.y = (yrange-this.size*2)*Math.random() + ymin + this.size;

        this.xmin = xmin;
        this.ymin = ymin;
        this.xrange = xrange;
        this.yrange = yrange;
    }   

    this.get_self_timer = function(){
        return this.self_timer;
    }

    this.set_position = function(x,y){ 
        this.x = x;
        this.y = y;
    } 

    this.move = function(player,multiplier){ 
        /*     
        var force = 3 * multiplier * player.get_mass() * this.mass / Math.pow(get_sprite_distance(this,player),2.0);
        var angle = get_sprite_angle(player,this);
        this.x += force*Math.cos(angle);
        this.y += force*Math.sin(angle);
        */
    }

    this.drift = function(){

        this.x += this.vx;
        this.y += this.vy;
        
        this.spin_angle = this.self_timer/this.smoothness;
        this.vx = Math.cos(this.spin_angle)*this.speed + this.vx2;
        this.vy = Math.sin(this.spin_angle)*this.speed + this.vy2;
        this.self_timer += 1;

        this.vx2 = this.vx2/1.1;
        this.vy2 = this.vy2/1.1;

        this.check_position();
    }

    this.collision_velocity_update = function(momentum,angle) {
        var add_velocity = [momentum[0]/this.mass, momentum[1]/this.mass];
        this.vx2 = add_velocity[0];
        this.vy2 = add_velocity[1];
    }

    this.check_position = function(){
        if ( this.x < this.xmin + this.size ){
            this.x = this.xmin + this.size;
        }
        if ( this.y < this.ymin + this.size ){
            this.y = this.ymin + this.size;
        }
        if ( this.x > this.xrange - this.size + this.xmin ){
            this.x = this.xrange - this.size + this.xmin;
        }
        if ( this.y > this.yrange - this.size + this.ymin ){
            this.y = this.yrange - this.size + this.ymin;
        }
    }
}

function create_skill_orb(){
    return new SkillOrb();
}
