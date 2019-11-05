//实现关于进度条模块   渲染总时间  播放音乐  进度条运动 左侧更新时间 交互 拖拽进度条（位置时间更新，跳到当前歌曲位置）
// 4交互  拖拽进度条(位置时间更新，跳到当前歌曲位置)
(function($, root) {
    var frameId;
    var dur;
    var startTime;
    var lastPer = 0;
    //渲染总时间
    function renderAllTime(time) {
        dur = time;
        console.log(time)
        time = formatTime(time);
        $('.all-time').html(time);
    }
    // 换算时间
    function formatTime(t) {
        t = Math.round(t);
        var m = Math.floor(t / 60);
        var s = t - m * 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        return m + ':' + s;
    }

    function start(p) {
        lastPer = p == undefined ? lastPer : p;
        startTime = new Date().getTime();
        function frame() {
            var nowTime = new Date().getTime();
            // 1s = 1000ms
            var per = lastPer + (nowTime - startTime) / (dur * 1000);
            if(per < 1) {
                update(per);
            }else {
                cancelAnimationFrame(frameId);
            }
            frameId = requestAnimationFrame(frame);
            // 相当于
            // setTimeout(frame, 16.7)
        }
        frame();
    }
    // 根据传过来的百分比 进行渲染左侧时间和进度条位置
    function update(p) {
        var time = formatTime(p * dur);
        $('.cur-time').html(time);
        var perX = (p - 1) * 100 + '%';
        $('.pro-top').css({
            'transform': 'translateX('+ perX +')'
        })
    }
    function stop() {
        cancelAnimationFrame(frameId);
        var stopTime = new Date().getTime();
        lastPer = lastPer + (stopTime - startTime) / (dur * 1000);
    }
    root.pro = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        update: update
    }
})(window.Zepto, window.player || (window.player = {}));