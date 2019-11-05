(function($, root) {
    //play pause getAudio
    function AudioManger() {
        // 创建音频对象
        this.audio = new Audio();
        // this.src = src;
        // 音频默认状态
        this.status = 'pause';
    };

    AudioManger.prototype = {
        play: function() {
            this.audio.play();
            this.status = 'play';
        },
        pause: function() {
            this.audio.pause();
            this.status = 'pause';
        },
        getAudio: function(src) {
            this.audio.src = src;
            // 加载当前音频
            this.audio.load();
        },
        playTo: function(time) {
            // 当设置该属性时，播放会跳跃到指定位置
            this.audio.currentTime = time;
        }
    }
    root.audioManager = new AudioManger();
})(window.Zepto, window.player || (window.player = {}))