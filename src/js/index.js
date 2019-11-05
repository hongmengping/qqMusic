var root = window.player;
var dataList;
var len;
var audio = root.audioManager;
var control;
var timer;

function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function(data) {
            dataList = data;
            len = data.length;
            control = new root.controlIndex(len);
            root.render(data[0]);
            audio.getAudio(data[0].audio);
            bindEvent();
            bindTouch();
            $('body').trigger('play:change', 0);
        },
        error: function() {
            console.log("error");
        }
    })
}

function bindEvent() {
    $('body').on('play:change', function(e, index) {
        audio.getAudio(dataList[index].audio);
        root.render(dataList[index]);
        root.pro.renderAllTime(dataList[index].duration);        
        if(audio.status == 'play') {
            rotated();
            audio.play();
        }
        $('.img-box').attr('data-deg', 0);
        $('.img-box').css({
            'transform': 'rotateZ('+ 0 + 'deg)',
            'transition': 'none'
        })
    });
    $('.prev').on('click', function() {
        var i = control.prev();
        $('body').trigger('play:change', i);
        // 切歌清零
        root.pro.start(0);
        if(audio.status == 'pause') {
            audio.pause();
            root.pro.stop();
        }
    });
    $('.next').on('click', function() {
        var i = control.next();
        $('body').trigger('play:change', i);
         // 切歌清零
         root.pro.start(0);
         if(audio.status == 'pause') {
            audio.pause();
            root.pro.stop();
        }
    });
    $('.play').on('click', function() {
        if(audio.status == 'pause') {
            audio.play();
            root.pro.start();
            var deg = $('.img-box').attr('data-deg');
            rotated(deg)
        }else {
            audio.pause();
            root.pro.stop();
            clearInterval(timer);
        }
        $('.play').toggleClass('playing');
    })
}

function rotated(deg) {
    clearInterval(timer);
    // 类型转换
    deg = +deg;
    timer = setInterval(function() {
        deg += 0.1;
        $('.img-box').attr('data-deg', deg);
        $('.img-box').css({
            'transform': 'rotateZ('+ deg + 'deg)',
            'transition': 'all 1s ease-out'
        })
    }, 2);
}

//拖拽事件   touchstart touchmove touchend
function bindTouch() {
    var offset = $('.pro-wrap').offset()
    var left = offset.left;
    var width = offset.width;
    $('.spot').on('touchstart', function() {
        root.pro.stop();
    }).on('touchmove', function(e) {
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per > 0 && per < 1 ){
            root.pro.update(per);
        }

    }).on('touchend', function(e) {
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per > 0 && per < 1 ){
            var time = dataList[control.index].duration;
            var curTime = per * time;
            $('.play').addClass('playing');
            audio.playTo(curTime);
            audio.play();
            audio.status = 'play';
            root.pro.start(per);
        }
    });
}


getData("../mock/data.json");

// 信息+图片渲染到页面上  render
// 点击按钮
// 音频的播放与暂停  切歌
// 进度条运动与拖拽
// 图片旋转
// 列表切歌