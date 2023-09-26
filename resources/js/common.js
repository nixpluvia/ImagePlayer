/*-------------------------------------------------------------------
    @window option 및 스크롤 이벤트
-------------------------------------------------------------------*/
// window 유틸 사용시 사용
// util.init({
//     size: 1024,
//     scrollClass: 'scroll',
//     loopClass: 'scroll-loop',
//     active: 'active',
//     scroll: false,
//     scrollLoop : false,
//     debounce: false,
//     throttle: false,
// });


/*-------------------------------------------------------------------
    @익스플로러 전환 엣지로 전환
-------------------------------------------------------------------*/
if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
    window.location = 'microsoft-edge:' + window.location;

    setTimeout(function() {
        window.location = 'https://go.microsoft.com/fwlink/?linkid=2135547';
    }, 1);
}


$(document).ready(function(){
    //util.info.win.width
    //util.info.win.height
    //util.info.win.top
    //util.info.win.bottom
});