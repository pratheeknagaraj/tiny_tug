
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
    }
}
