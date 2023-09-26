/*
**************************
Image Player 1.0.0
regDate 2023.09.26
Copyright (c) 2023 nixpluvia

Contact whbear12@gmail.com

Released under the MIT License
**************************
*/

/*-------------------------------------------------------------------
    @Image Player
-------------------------------------------------------------------*/
function ImgPlayer(param) {
    //element
    this.el = {};
    this.el.player;
    this.el.playerBox;
    this.el.playerItems;
    this.el.timeline;
    this.el.timelineWrap;
    this.el.timelineItems;
    this.el.controls;
    this.el.navigation;
    this.el.btnNav;
    this.el.btnPlay;
    this.el.btnStop;
    this.el.progress;
    this.el.progressWrap;
    this.el.progressBox;
    this.el.progressBar;
    this.el.progressHandle;

    //classname
    this.class = {};
    this.class.player = 'imgPlayer';
    this.class.playerBox = 'imp-player';
    this.class.playerItems = 'imp-item';
    this.class.timeline = 'imp-timeline';
    this.class.timelineWrap = 'imp-tl-wrap';
    this.class.timelineItems = 'imp-tl-item';
    this.class.controls = 'imp-controls';
    this.class.navigation = 'navigation';
    this.class.btnNav = 'btn-nav';
    this.class.btnPlay = 'btn-play';
    this.class.btnStop = 'btn-stop';
    this.class.progress = 'progressbar';
    this.class.progressWrap = 'con-wrap';
    this.class.progressBox = 'bar-box';
    this.class.progressBar = 'bar';
    this.class.progressHandle = 'handle';
    this.class.active = 'active';
    this.class.fade = 'fade';

    //attribute
    this.attr = {};
    this.attr.itemIdx = 'data-imp-item-index';

    //player variable
    this.player = {};
    this.player.images = [];
    this.player.now;
    this.player.next;
    this.player.total;
    this.player.playTimer;
    this.player.timer;
    this.player.state = 'stop';
    this.player.fadeNow;
    this.player.fadePercent;

    //timeline variable
    this.timeline = {};
    this.timeline.with;
    this.timeline.padding = {};
    this.timeline.items = [];
    this.timeline.itemsWidth;
    this.timeline.gutter = 10;
    this.timeline.gap;
    this.timeline.overflow;
    this.timeline.now = 0;
    this.timeline.distance = 0;
    this.timeline.prevX;
    this.timeline.timer;
    this.timeline.dragTimer;
    this.timeline.isDrag;

    //progress variable
    this.progress = {};
    this.progress.width;
    this.progress.now;
    this.progress.handle;
    this.progress.frameRange;
    this.progress.timer;
    this.progress.isPress;

    //time variable 단위 ms
    this.time = {};
    this.time.now = 0;
    this.time.total;
    this.time.frameTime = 3000;
    this.time.fade = 400;
    this.time.fadeStart;
    this.time.fadeEnd;
    this.time.changeTime = 0;

    //options variable
    this.options = {};
    this.options.resizeTimer;
    this.options.useTimeline = true;

    //event variable
    this.e = {};
    this.e.timelineLeave;
    this.e.timelineDown;
    this.e.timelineMove;
    this.e.timelineUp;
    this.e.navPlayClick;
    this.e.navStopClick;

    //start
    this.setParameter(param);
    this.init();
}


/*-------------------------------------------------------------------
    @공통
-------------------------------------------------------------------*/
ImgPlayer.prototype.getNumberVld = function(p, def) {
    if (p == undefined) return def;
    if (typeof p == "string") {
        return isNaN(Number(p)) ? def : Number(p);
    }
    if (typeof p == "number") return p;
    return def;
}
ImgPlayer.prototype.getStringVld = function(p, def) {
    if (p == undefined) return def;
    if (typeof p == "string") return p;
    return def;
}
ImgPlayer.prototype.getBooleanVld = function(p, def) {
    if (p == undefined) return def;
    if (typeof p == "string") return p.toLowerCase() == "true" ? true : false;
    if (typeof p == "boolean") return p;
    return def;
}
ImgPlayer.prototype.find = function(element, selector){
    return element.querySelector(selector);
}
ImgPlayer.prototype.findAll = function(element, selector){
    return Array.from(element.querySelectorAll(selector));
}


/*-------------------------------------------------------------------
    @초기화
-------------------------------------------------------------------*/
ImgPlayer.prototype.setParameter = function(p){
    if (p == undefined || Array.isArray(p) || typeof p != "object") return false;
    
    this.class.player = this.getStringVld(p.player ,'imgPlayer');
    this.class.playerBox = this.getStringVld(p.playerBox ,'imp-player');
    this.class.playerItems = this.getStringVld(p.playerItems ,'imp-item');
    this.class.timeline = this.getStringVld(p.timeline ,'imp-timeline');
    this.class.timelineWrap = this.getStringVld(p.timelineWrap ,'imp-tl-wrap');
    this.class.timelineItems = this.getStringVld(p.timelineItems ,'imp-tl-item');
    this.class.controls = this.getStringVld(p.controls ,'imp-controls');
    this.class.navigation = this.getStringVld(p.navigation ,'navigation');
    this.class.btnNav = this.getStringVld(p.btnNav ,'btn-nav');
    this.class.btnPlay = this.getStringVld(p.btnPlay ,'btn-play');
    this.class.btnStop = this.getStringVld(p.btnStop ,'btn-stop');
    this.class.progress = this.getStringVld(p.progress ,'progressbar');
    this.class.progressWrap = this.getStringVld(p.progressWrap ,'con-wrap');
    this.class.progressBox = this.getStringVld(p.progressBox ,'bar-box');
    this.class.progressBar = this.getStringVld(p.progressBar ,'bar');
    this.class.progressHandle = this.getStringVld(p.progressHandle ,'handle');
    this.class.active = this.getStringVld(p.active ,'active');
    
    if (p.time != undefined && !Array.isArray(p) && typeof p.time == "object"){
        this.time.frameTime = this.getNumberVld(p.time.frame ,3000);
        this.time.fade = this.getNumberVld(p.time.fade, 400);
    }

    if (p.options != undefined && !Array.isArray(p) && typeof p.options == "object"){
        this.options.useTimeline = this.getBooleanVld(p.options.useTimeline ,true);
    }
}

ImgPlayer.prototype.init = function(){
    var ins = this;
    document.addEventListener("DOMContentLoaded", function(){
        ins.el.player = document.querySelector('.'+ins.class.player);
        ins.el.playerBox = document.querySelector('.'+ins.class.playerBox);
        ins.el.playerItems = ins.findAll(ins.el.playerBox, '.'+ins.class.playerItems);      
        ins.setPlayerOption();
        
        //timeline
        if (ins.options.useTimeline) {
            ins.renderTimeline();
            //set timeline
            ins.el.timeline = document.querySelector('.'+ins.class.timeline);
            ins.el.timelineWrap = document.querySelector('.'+ins.class.timelineWrap);
            ins.el.timelineItems = ins.findAll(ins.el.timelineWrap, '.'+ins.class.timelineItems);
            ins.setTimelineOption();
            ins.onEventTimeline();
        }

        //set controls
        ins.renderControls();
        ins.el.controls = document.querySelector('.'+ins.class.controls);

        //set navigation
        ins.el.navigation = ins.find(ins.el.controls, '.'+ins.class.navigation);
        ins.el.btnPlay = ins.find(ins.el.navigation, '.'+ins.class.btnPlay);
        ins.el.btnStop = ins.find(ins.el.navigation, '.'+ins.class.btnStop);
        ins.onEventNavigation();

        //set progress
        ins.el.progress = ins.find(ins.el.controls, '.'+ins.class.progress);
        ins.el.progressWrap = ins.find(ins.el.progress, '.'+ins.class.progressWrap);
        ins.el.progressBox = ins.find(ins.el.progressWrap, '.'+ins.class.progressBox);
        ins.el.progressBar = ins.find(ins.el.progressBox, '.'+ins.class.progressBar);
        ins.el.progressHandle = ins.find(ins.el.progressWrap, '.'+ins.class.progressHandle);
        ins.onEventProgress();
    });

    window.addEventListener("resize", function(){
        //플레이어 사이즈 재정의
        clearTimeout(ins.options.resizeTimer);
        ins.options.resizeTimer = setTimeout(ins.setTimelineOption.bind(ins), 300);
    })
}


/*-------------------------------------------------------------------
    @플레이어 설정
-------------------------------------------------------------------*/
ImgPlayer.prototype.setPlayerOption = function(){
    var ins = this;
    this.player.total = this.el.playerItems.length;
    if (this.player.total <= 0) return false;
    this.player.fadeNow = 1;
    this.player.fadePercent = 1 / (this.time.fade / 100);
    this.time.total = this.time.frameTime * this.player.total;
    this.time.fadeEnd = (this.time.changeTime+1) * this.time.frameTime;
    this.time.fadeStart = this.time.fadeEnd - this.time.fade;
    
    //시작 위치 지정
    this.player.now = 0;
    this.player.next = 1;
    this.el.playerItems[0].classList.add(this.class.active);

    //진행바 초기화
    this.progress.now = 100;
    this.progress.handle = 0;
    this.progress.frameRange = Math.ceil(1000 / this.player.total) / 10;

    //이미지 리스트 초기화
    this.el.playerItems.forEach(function(el, idx){
        el.style.transition = 'opacity 0.1s 0s linear';
        ins.player.images.push(el.querySelector('img').getAttribute('src'));
    });
}


/*-------------------------------------------------------------------
    @타임라인
-------------------------------------------------------------------*/
/*-------------------------------------------------------------------
    @타임라인 > HTML 렌더링
-------------------------------------------------------------------*/
ImgPlayer.prototype.renderTimeline = function(){
    var ins = this;
    var fragment = document.createDocumentFragment();
    var timeline = document.createElement('div');
    timeline.classList.add(this.class.timeline);
    fragment.appendChild(timeline);
    //wrapper
    var timelineWrap = document.createElement('div');
    timelineWrap.classList.add(this.class.timelineWrap);
    timeline.appendChild(timelineWrap);
    //items
    this.player.images.forEach(function(val, idx){
        var timelineItems = document.createElement('button');
        timelineItems.classList.add(ins.class.timelineItems);
        if (idx == 0) timelineItems.classList.add(ins.class.active);
        timelineItems.setAttribute('type', 'button');
        timelineItems.style.backgroundImage = 'url('+ val +')';
        timelineWrap.appendChild(timelineItems);
    });

    this.el.player.appendChild(fragment);
}
/*-------------------------------------------------------------------
    @타임라인 > 설정
-------------------------------------------------------------------*/
ImgPlayer.prototype.setTimelineOption = function(){
    //영역 padding
    var computedStyle = getComputedStyle(this.el.timeline);
    this.timeline.padding.top = parseFloat(computedStyle.paddingTop);
    this.timeline.padding.bottom = parseFloat(computedStyle.paddingBottom);
    this.timeline.padding.left = parseFloat(computedStyle.paddingLeft);
    this.timeline.padding.right = parseFloat(computedStyle.paddingRight);
    //영역 width
    this.timeline.width = this.el.timeline.offsetWidth - this.timeline.padding.left - this.timeline.padding.right;
    //아이템 사이즈
    this.timeline.itemsWidth = 0;
    this.el.timelineItems.forEach(function(val, idx){
        this.timeline.items.push(val.offsetWidth + this.timeline.gutter);
        this.timeline.itemsWidth += val.offsetWidth + this.timeline.gutter;
        val.setAttribute(this.attr.itemIdx, idx);
        val.style.marginRight = this.timeline.gutter + 'px';
    }.bind(this));
    //드래그 가능 영역 및 가능여부
    this.timeline.gap = this.timeline.itemsWidth - this.timeline.width - this.timeline.gutter;
    this.timeline.overflow = this.timeline.gap < 0 ? false : true;
    this.timeline.gap = Math.abs(this.timeline.gap);
    //드래그 거리 초기화
    this.timeline.now = 0;
    this.timeline.distance = 0;
    this.el.timelineWrap.style.transform = 'translate3D(0, 0, 0)';
}
/*-------------------------------------------------------------------
    @타임라인 > 이벤트 등록
-------------------------------------------------------------------*/
ImgPlayer.prototype.onEventTimeline = function(){
    var ins = this;
    this.timeline.isDrag = false;
    this.e.timelineLeave = this.timelineLeave.bind(this);
    this.e.timelineDown = this.timelineDown.bind(this);
    this.e.timelineUp = this.timelineUp.bind(this);
    
    this.el.timeline.addEventListener('mouseleave', this.e.timelineLeave);
    this.el.timeline.addEventListener('mousedown', this.e.timelineDown);
    this.el.timeline.addEventListener('touchstart', this.e.timelineDown);
    this.el.timeline.addEventListener('mouseup', this.e.timelineUp);
    this.el.timeline.addEventListener('touchend', this.e.timelineUp);

    //아이템 클릭이벤트
    this.el.timelineItems.forEach(function(val){
        // val.addEventListener('click', function(){
        //     if (ins.timeline.isDrag) return false;
        //     var idx = this.getAttribute(ins.attr.itemIdx);
        //     //시간 변경
        //     ins.time.now = ins.time.frameTime * idx;
        //     ins.time.changeTime = idx;
        //     //진행도 변경
        //     ins.progress.now = 100 - (ins.progress.frameRange * idx);
        //     ins.progress.handle = ins.progress.frameRange * idx;
        //     if (ins.progress.now <= 0) ins.progress.now = 0;
        //     if (ins.progress.handle >= 100) ins.progress.handle = 100;
        //     //bar & handle 이동
        //     ins.el.progressBar.style.transform = 'translate3D(-'+ ins.progress.now +'%, 0, 0)';
        //     ins.el.progressHandle.style.left = ins.progress.handle + '%';
        //     //player 변경
        //     ins.el.playerItems[ins.player.now].classList.remove(ins.class.active);
        //     ins.el.timelineItems[ins.player.now].classList.remove(ins.class.active);
        //     ins.el.playerItems[idx].classList.add(ins.class.active);
        //     ins.el.timelineItems[idx].classList.add(ins.class.active);
        //     //카운트 증가
        //     ins.player.now = idx;
        //     ins.player.next = ++idx;
        // });
        val.addEventListener('mouseup', function(){
            clearTimeout(ins.timeline.dragTimer);
            if (ins.timeline.isDrag) return false;
            var idx = this.getAttribute(ins.attr.itemIdx);
            //시간 변경
            ins.time.now = ins.time.frameTime * idx;
            ins.time.changeTime = idx;
            //진행도 변경
            ins.progress.now = 100 - (ins.progress.frameRange * idx);
            ins.progress.handle = ins.progress.frameRange * idx;
            if (ins.progress.now <= 0) ins.progress.now = 0;
            if (ins.progress.handle >= 100) ins.progress.handle = 100;
            //bar & handle 이동
            ins.el.progressBar.style.transform = 'translate3D(-'+ ins.progress.now +'%, 0, 0)';
            ins.el.progressHandle.style.left = ins.progress.handle + '%';
            //player 변경
            ins.el.playerItems[ins.player.now].classList.remove(ins.class.active);
            ins.el.timelineItems[ins.player.now].classList.remove(ins.class.active);
            ins.el.playerItems[idx].classList.add(ins.class.active);
            ins.el.timelineItems[idx].classList.add(ins.class.active);
            //카운트 증가
            ins.player.now = idx;
            ins.player.next = ++idx;
        })
    });
}
/*-------------------------------------------------------------------
    @타임라인 > 클릭
-------------------------------------------------------------------*/
ImgPlayer.prototype.timelineDown = function(event){
    event.preventDefault();
    var ins = this;
    var e = event.type == 'touchstart' ? event.touches[0] : event;
    // var targetElements = document.elementsFromPoint(e.clientX, e.clientY);
    // var isFound = false;
    // for (var i = 0; i < targetElements.length; i++) {
    //     if (targetElements[i].classList.contains(this.class.timeline)) {
    //         isFound = true;
    //     }
    // }

    if (this.timeline.overflow) {
        //드래그 시작
        this.el.timelineWrap.style.transition = 'transform 0.05s 0s ease';
        this.timeline.dragTimer = setTimeout(function(){
            if (ins.timeline.isDrag) {
                clearTimeout(ins.timeline.dragTimer);
                return false;
            }
            ins.timeline.isDrag = true;
            ins.timeline.prevX = e.clientX;
            ins.e.timelineMove = ins.timelineMove.bind(ins);
            if (event.type == 'touchstart') {
                ins.el.timeline.addEventListener('touchmove', ins.e.timelineMove);
            } else {
                ins.el.timeline.addEventListener('mousemove', ins.e.timelineMove);
            }
        }, 150);
    }
}
/*-------------------------------------------------------------------
    @타임라인 > 드래그
-------------------------------------------------------------------*/
ImgPlayer.prototype.timelineMove = function(event){
    var ins = this;
    if (!this.timeline.timer) {
        this.timeline.timer = setTimeout(function(){
            ins.timeline.timer = null;//throttle
            //이동거리
            var e = event.type == 'touchmove' ? event.touches[0] : event;
            var distance = ins.timeline.prevX - e.clientX;
            distance = ins.timeline.now - distance;
            //최소 최대 거리 설정
            if(distance <= -ins.timeline.gap) distance = -ins.timeline.gap;
            if(distance > 0) distance = 0;
            ins.timeline.distance = distance;
            ins.el.timelineWrap.style.transform = 'translate3D('+ distance +'px, 0, 0)';
        }, 50);
    }
}
/*-------------------------------------------------------------------
    @타임라인 > 클릭 종료
-------------------------------------------------------------------*/
ImgPlayer.prototype.timelineLeave = function(event){
    this.timeline.isDrag = false;
    this.timeline.now = this.timeline.distance;
    this.el.timelineWrap.style.transition = 'transform 0.4s 0s ease';
    this.el.timelineWrap.style.transform = 'translate3D('+ this.timeline.distance +'px, 0, 0)';
    clearTimeout(this.timeline.dragTimer);

    this.el.timeline.removeEventListener('mousemove', this.e.timelineMove);
    this.el.timeline.removeEventListener('touchmove', this.e.timelineMove);
}
ImgPlayer.prototype.timelineUp = function(event){
    event.preventDefault();
    this.timeline.isDrag = false;
    this.timeline.now = this.timeline.distance;
    this.el.timelineWrap.style.transition = 'transform 0.4s 0s ease';
    this.el.timelineWrap.style.transform = 'translate3D('+ this.timeline.distance +'px, 0, 0)';
    clearTimeout(this.timeline.dragTimer);

    this.el.timeline.removeEventListener('mousemove', this.e.timelineMove);
    this.el.timeline.removeEventListener('touchmove', this.e.timelineMove);
}


/*-------------------------------------------------------------------
    @플레이어 컨트롤러 HTML 렌더링
-------------------------------------------------------------------*/
ImgPlayer.prototype.renderControls = function(){
    var fragment = document.createDocumentFragment();
    var controls = document.createElement('div');
    controls.classList.add(this.class.controls);
    fragment.appendChild(controls);

    //navigation
    var navigation = document.createElement('div');
    navigation.classList.add(this.class.navigation);
    controls.appendChild(navigation);
    //navigation > btnPlay
    var text = document.createElement('span');
    var btnPlay = document.createElement('button');
    btnPlay.classList.add(this.class.btnNav);
    btnPlay.classList.add(this.class.btnPlay);
    btnPlay.setAttribute('type', 'button');
    navigation.appendChild(btnPlay);
    text.textContent = '재생';
    btnPlay.appendChild(text);
    //navigation > btnStop
    var btnStop = document.createElement('button');
    btnStop.classList.add(this.class.btnNav);
    btnStop.classList.add(this.class.btnStop);
    btnStop.setAttribute('type', 'button');
    navigation.appendChild(btnStop);
    text.textContent = '정지';
    btnStop.appendChild(text);
    
    //progressbar
    var progress = document.createElement('div');
    progress.classList.add(this.class.progress);
    controls.appendChild(progress);
    //wrapper
    var progressWrap = document.createElement('div');
    progressWrap.classList.add(this.class.progressWrap);
    progress.appendChild(progressWrap);
    //bar
    var progressBox = document.createElement('div');
    progressBox.classList.add(this.class.progressBox);
    progressWrap.appendChild(progressBox);
    var progressBar = document.createElement('span');
    progressBar.classList.add(this.class.progressBar);
    progressBox.appendChild(progressBar);
    //handle
    var progressHandle = document.createElement('span');
    progressHandle.classList.add(this.class.progressHandle);
    progressWrap.appendChild(progressHandle);

    this.el.player.appendChild(fragment);
}


/*-------------------------------------------------------------------
    @네비게이션
-------------------------------------------------------------------*/
ImgPlayer.prototype.onEventNavigation = function(){
    this.e.navPlayClick = this.navPlayClick.bind(this);
    this.e.navStopClick = this.navStopClick.bind(this);
    this.el.btnPlay.addEventListener('click', this.e.navPlayClick);
    this.el.btnStop.addEventListener('click', this.e.navStopClick);
}
/*-------------------------------------------------------------------
    @네비게이션 > 재생 / 일시정지
-------------------------------------------------------------------*/
ImgPlayer.prototype.navPlayClick = function(){
    var ins = this;
    if (this.player.playTimer == null) { //Play
        this.player.state = 'play';//플레이어 상태
        //애니메이션
        this.el.progressBar.style.transition = 'transform 0.1s linear';
        this.el.progressHandle.style.transition = 'left 0.1s linear';
        //일시정지 취소
        this.el.btnPlay.classList.add(this.class.active);
        //Play throttle
        this.player.playTimer = setInterval(function(){
            //Playtime End
            if (ins.time.now >= ins.time.total) {
                ins.time.now = ins.time.total;
                clearInterval(ins.player.playTimer);
                ins.player.playTimer = null;
                return false;
            }
            //Progressbar Moving
            var percent = (ins.progress.frameRange / 10) / (ins.time.frameTime / 1000);
            ins.time.now += 100;
            ins.progress.now -= percent;
            ins.progress.handle += percent;
            if (ins.progress.now <= 0) ins.progress.now = 0;
            if (ins.progress.handle >= 100) ins.progress.handle = 100;
            ins.el.progressBar.style.transform = 'translate3D(-'+ ins.progress.now +'%, 0, 0)';
            ins.el.progressHandle.style.left = ins.progress.handle + '%';

            
            //fade
            var t = Math.floor(ins.time.now / ins.time.frameTime);
            if (ins.time.now >= ins.time.fadeStart && ins.time.now <= ins.time.fadeEnd) {
                ins.el.playerItems[ins.player.now].classList.add(ins.class.fade);
                ins.el.playerItems[ins.player.next].classList.add(ins.class.fade);
                //opacity calc
                ins.player.fadeNow -= ins.player.fadePercent;
                ins.el.playerItems[ins.player.now].style.opacity = ins.player.fadeNow;
            }
            //Player Play
            if (ins.time.changeTime != t && t < ins.player.total) {
                ins.time.changeTime = t;

                //fade set
                ins.time.fadeEnd = (t+1) * ins.time.frameTime;
                ins.time.fadeStart = ins.time.fadeEnd - ins.time.fade;
                //fade active
                ins.el.playerItems[ins.player.now].classList.remove(ins.class.fade);
                ins.el.playerItems[ins.player.next].classList.remove(ins.class.fade);
                ins.el.playerItems[ins.player.next].classList.add(ins.class.active);
                ins.el.playerItems[ins.player.now].classList.remove(ins.class.active);
                //fade 초기화
                ins.player.fadeNow = 1;
                ins.el.playerItems[ins.player.now].style.opacity = '';
                
                //timeline use
                if (ins.options.useTimeline) {
                    ins.el.timelineItems[ins.player.next].classList.add(ins.class.active);
                    ins.el.timelineItems[ins.player.now].classList.remove(ins.class.active);
                }
                
                //player number set
                ++ins.player.now;
                ++ins.player.next;
            }
        }, 100);
    } else { //Pause
        this.player.state = 'pause';
        clearInterval(this.player.playTimer);
        this.player.playTimer = null;
        this.el.btnPlay.classList.remove(this.class.active);
    }
}
/*-------------------------------------------------------------------
    @네비게이션 > 정지
-------------------------------------------------------------------*/
ImgPlayer.prototype.navStopClick = function(){
    //상태 초기화
    this.player.state = 'stop';
    //시간 초기화
    this.time.now = 0;
    this.time.changeTime = 0;
    //progress bar 초기화
    this.progress.now = 100;
    this.el.progressBar.style.transition = '';
    this.el.progressBar.style.transform = 'translate3D(-100%, 0, 0)';
    this.progress.handle = 0;
    this.el.progressHandle.style.transition = '';
    this.el.progressHandle.style.left = '0';
    //플레이어 중지
    clearInterval(this.player.playTimer);
    this.player.playTimer = null;
    //fade 초기화
    this.player.fadeNow = 1;
    
    //버튼 초기화
    this.el.btnPlay.classList.remove(this.class.active);
    //컨텐츠 초기화
    this.el.playerItems[this.player.now].classList.remove(this.class.fade);
    this.el.playerItems[this.player.now].classList.remove(this.class.active);
    this.el.playerItems[this.player.now].style.opacity = '';
    this.el.playerItems[this.player.next].classList.remove(this.class.fade);
    if (this.options.useTimeline) this.el.timelineItems[this.player.now].classList.remove(this.class.active);
    this.player.now = 0;
    this.player.next = 1;
    this.el.playerItems[this.player.now].classList.add(this.class.active);
    if (this.options.useTimeline) this.el.timelineItems[this.player.now].classList.add(this.class.active);
}



/*-------------------------------------------------------------------
    @진행바 이벤트
-------------------------------------------------------------------*/
ImgPlayer.prototype.onEventProgress = function(){
    this.e.progressLeave = this.progressLeave.bind(this);
    this.e.progressDown = this.progressDown.bind(this);
    this.e.progressUp = this.progressUp.bind(this);

    this.el.progress.addEventListener('mouseleave', this.e.progressLeave);
    this.el.progress.addEventListener('mousedown', this.e.progressDown);
    this.el.progress.addEventListener('touchstart', this.e.progressDown);
    this.el.progress.addEventListener('mouseup', this.e.progressUp);
    this.el.progress.addEventListener('touchend', this.e.progressUp);
}
/*-------------------------------------------------------------------
    @진행바 이벤트 > 클릭
-------------------------------------------------------------------*/
ImgPlayer.prototype.progressDown = function(event){
    event.preventDefault();
    var e = event.type == 'touchstart' ? event.touches[0] : event;

    //재생중 일 경우 일시정지
    if (this.player.state == 'play') {
        this.el.btnPlay.classList.remove(this.class.active);
        this.player.state = 'pause';
        clearInterval(this.player.playTimer);
        this.player.playTimer = null;
    }

    //transition 중단
    this.el.playerItems.forEach(function(el, idx){
        el.style.transition = '';
    });

    //드래그 시작
    this.progress.width = this.el.progress.offsetWidth; //영역 width
    this.e.progressMove = this.progressMove.bind(this);
    if (event.type == 'touchstart') {
        this.el.progress.addEventListener('touchmove', this.e.progressMove);
    } else {
        this.el.progress.addEventListener('mousemove', this.e.progressMove);
    }
}
/*-------------------------------------------------------------------
    @진행바 이벤트 > 드래그
-------------------------------------------------------------------*/
ImgPlayer.prototype.progressMove = function(event){
    var ins = this;
    if (!this.progress.timer) {
        this.progress.timer = setTimeout(function(){
            ins.progress.timer = null;
            var e = event.type == 'touchmove' ? event.touches[0] : event;
            //이동된 거리 퍼센트
            var percent = ((e.clientX - ins.el.progress.offsetLeft) / ins.progress.width) * 100;
            if (percent < 0) percent = 0;
            if (percent > 100) percent = 100;
            
            //0.1초 단위의 퍼센트로 변경
            var time = Math.ceil(ins.time.total * percent / 100);
            time = time - (time % 100);
            percent = time / ins.time.total * 100;

            //시간 설정
            ins.time.now = time;
            ins.progress.now = 100 - percent;
            ins.progress.handle = percent;
            ins.el.progressBar.style.transform = 'translate3D(-'+ ins.progress.now +'%, 0, 0)';
            ins.el.progressHandle.style.left = percent + '%';
            
            //Player
            var t = Math.floor(ins.time.now / ins.time.frameTime);
            var next = ins.player.now;
            if (ins.time.changeTime != t && t < ins.player.total) {
                ins.time.changeTime = t;
                
                //fade set
                ins.time.fadeEnd = (t+1) * ins.time.frameTime;
                ins.time.fadeStart = ins.time.fadeEnd - ins.time.fade;
                //fade reset
                ins.el.playerItems[ins.player.now].classList.remove(ins.class.fade);
                if (ins.player.next != ins.player.total) {
                    ins.el.playerItems[ins.player.next].classList.remove(ins.class.fade);
                }
                ins.el.playerItems[ins.player.now].style.opacity = '';
                
                //player next change
                ins.el.playerItems[ins.player.now].classList.remove(ins.class.active);
                ins.el.playerItems[t].classList.add(ins.class.active);
                if (ins.options.useTimeline) {
                    ins.el.timelineItems[ins.player.now].classList.remove(ins.class.active);
                    ins.el.timelineItems[t].classList.add(ins.class.active);
                }
                
                //player number set
                ins.player.now = t;
                ins.player.next = t+1;
            }

            //fade
            if (ins.time.now >= ins.time.fadeStart && ins.time.now <= ins.time.fadeEnd && t+1 < ins.player.total) {
                ins.el.playerItems[ins.player.now].classList.add(ins.class.fade);
                ins.el.playerItems[ins.player.next].classList.add(ins.class.fade);
                //opacity calc
                ins.player.fadeNow =  1 - ins.player.fadePercent * ((ins.time.now - ins.time.fadeStart) / 100);
                ins.el.playerItems[ins.player.now].style.opacity = ins.player.fadeNow;
            } else if (ins.time.now <= ins.time.fadeStart){
                ins.el.playerItems[ins.player.now].style.opacity = '';
            }

        }, 50);
    }
}
/*-------------------------------------------------------------------
    @진행바 이벤트 > 클릭 종료
-------------------------------------------------------------------*/
ImgPlayer.prototype.progressLeave = function(event){
    //transition 복구
    this.el.playerItems.forEach(function(el, idx){
        el.style.transition = 'opacity 0.1s 0s linear';
    });
    //이벤트 제거
    this.el.progress.removeEventListener('mousemove', this.e.progressMove);
    this.el.progress.removeEventListener('touchmove', this.e.progressMove);
}
ImgPlayer.prototype.progressUp = function(event){
    //transition 복구
    this.el.playerItems.forEach(function(el, idx){
        el.style.transition = 'opacity 0.1s 0s linear';
    });
    //이벤트 제거
    this.el.progress.removeEventListener('mousemove', this.e.progressMove);
    this.el.progress.removeEventListener('touchmove', this.e.progressMove);
}





var imgP = new ImgPlayer({
    // options : {
    //     useTimeline : false
    // }
    time :{
        // frame : 1000,
        fade : 700
    }
});