
function play_sfx(type){
    if ( sfx_on == true ){
        if (type == 'beep'){
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', 'assets/sfx/beep.wav');
            audioElement.play();
        }
        else if (type == 'bump'){
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', 'assets/sfx/bump.wav');
            audioElement.play();
        }
        else if (type == 'bump2'){
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', 'assets/sfx/bump2.wav');
            audioElement.play();
        }
        else if (type == 'pre_end_beep'){
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', 'assets/sfx/pre_end_beep.wav');
            audioElement.play();
        }
        else if (type == 'end_beep'){
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', 'assets/sfx/end_beep.wav');
            audioElement.play();
        }
        else if (type == 'electric_spark'){
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', 'assets/sfx/electric_spark.wav');
            audioElement.play();
        }
        else if (type == 'plunder_pop'){
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', 'assets/sfx/plunder_pop.wav');
            audioElement.play();
        }
        else if (type == 'nuclear'){
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', 'assets/sfx/nuclear.wav');
            audioElement.play();
        }
        else if (type == 'missile_blip'){
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', 'assets/sfx/missile_blip.wav');
            audioElement.play();
        }
        else if (type == 'invisible'){
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', 'assets/sfx/invisible.wav');
            audioElement.play();
        }
        else if (type == 'twing'){
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', 'assets/sfx/twing.wav');
            audioElement.play();
        }
    }
}
