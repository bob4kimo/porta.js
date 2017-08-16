

function getObj(name) {
     return document.getElementById(name);
}

function log(msg) {
    console.log(msg);
}

function isInputValid(v) {
    return (v!==undefined && v!==null);
}
/**----------------------------------------------------------------
 * Check function's input valid or not, bring input into local-var or use default-value
 * ----------------------------------------------------------------
 * Ex:var xx = useFuncInputOrDefault(v,'x',100);
 * A) v is function's input, json-format, ex:func(v){...},func({x:10,y:10});
 * B) 'x' means v's child-node's name, string-format
 * C) 100 means this var's default-value, when input invalid or undefined, will bring
 * default-value into this var
 * ----------------------------------------------------------------*/
function useFuncInputOrDefault(input,inputChildName,def) {
    /**----------------------------------------------------------------
     * A) First we must check is "input" a valid object, input may undefined
     * B) If "input" is not a valid object, than we return back default-value
     * C) We want to check is our child-node exist or not, but we can not use
     * child-node as a parameter in this func, ex:useFuncInputOrDefault(v,v.x,def),
     * it will cause error when "v.x" do not exist
     * D) So we need convert "input" into json-string, ex:JSON.stringify(input)
     * E) Then we check is child-node "x" exist in json-string
     * F) jsonStr.indexOf(inputChildName+'":')>-1 == true means child-node "x" exist
     * G) Then we convert json-string back to json-object and access to child-node
     * without error, ex:(new Function('return' + jsonStr+'.'+inputChildName))()
     * ----------------------------------------------------------------*/
    var jsonStr = JSON.stringify(input);
    return isInputValid(input)&&jsonStr.indexOf('"'+inputChildName+'":')>-1?(new Function('return' + jsonStr+'.'+inputChildName))():def;
}

function isInputBoolean(v) {
    return (v!==undefined && v!==null && typeof v==='boolean');
}

function isInputObject(v) {
    return ( v!==undefined && v!==null && typeof v==='object' );
}

function isInputString(v) {
    return ( v!==undefined && v!==null && typeof v==='string' && v.length!==0 );
}

function isInputFuncType(v) {
    var getType = {};
    return ( v && getType.toString.call(v) === '[object Function]' );
}

function isInputArray(v) {
    var getType = {};
    return ( v && getType.toString.call(v) === '[object Array]' );
}


//------------- SPRITE CLASS ----------------//
function Sprite() {
}

Sprite.prototype.initDiv = function(idName) {
    this.obj = document.createElement('div');
    this.obj.id = idName;
    this.obj.style.cssText += 'position:absolute;background-color:transparent;';
    this.maskOverflow(true);
    this.makeCursorNormal();
    document.body.appendChild(this.obj);
    return this.obj;
};
Sprite.prototype.cssText = function(cssStr) {
    this.obj.style.cssText += cssStr;
};
Sprite.prototype.applyZIndex = function(zIndex) {
    //----- according to safari v3.0, z-index range:min:-16777271,max:16777271 -----//
    this.obj.style.cssText += "z-index:"+zIndex+";";
};
Sprite.prototype.initText = function (idName,textString) {
    this.obj = document.createElement('div');
    this.obj.id = idName;
    this.obj.style.cssText += 'position:absolute;background-color:transparent;white-space:nowrap;';
    this.maskOverflow(true);
    this.makeCursorNormal();
    document.body.appendChild(this.obj);
    this.obj.innerHTML = textString;
    return this.obj;
};
Sprite.prototype.initBtn = function (btnTitleStr) {
    this.obj = document.createElement('button');
    if( isInputString(btnTitleStr) )
        this.obj.innerHTML = btnTitleStr;
    this.obj.style.cssText += "position:absolute;border:none;outline:none;overflow:hidden;background-color:transparent;";
    this.makeCursorNormal();
    document.body.appendChild(this.obj);
    return this.obj;
};
Sprite.prototype.initTextArea = function (idName) {
    this.obj = document.createElement('textarea');
    this.obj.id = idName;
    this.obj.spellcheck = false;
    this.obj.style.cssText += 'position:absolute;background-color:transparent;resize:none;border:none;box-sizing:border-box;';
    document.body.appendChild(this.obj);
    return this.obj;
};
Sprite.prototype.textAreaFocus = function() {
    this.obj.focus();
};
Sprite.prototype.notFocus = function() {
    this.obj.blur();
};
Sprite.prototype.getTextAreaText = function () {
    return this.obj.value;
};
Sprite.prototype.textAreaEmpty = function () {
    this.obj.value = '';
};
Sprite.prototype.setTextAreaText = function (v) {
    if(isInputString(v))
        this.obj.value = v;
};
Sprite.prototype.textAreaPadding = function (paddingPxStr) {
    this.obj.style.cssText += "padding:"+paddingPxStr+"px;";
};
Sprite.prototype.hidden = function (isHidden) {
    if( isHidden ) {
        this.obj.style.cssText += "visibility:hidden;";
    } else {
        this.obj.style.cssText += "visibility:visible;";
    }
    if( isHidden===undefined || isHidden===null ) {
        return this.obj.style.visibility;
    }
};
//----- mask all child which over this div area -----//
Sprite.prototype.maskOverflow = function(isMask) {
    if ( isMask ) {
        this.obj.style.cssText += "overflow:hidden;";
    } else {
        this.obj.style.cssText += "overflow:visible;";
    }
};
//----- let this div appear scroll-bar when content extends div's height -----//
Sprite.prototype.scrollVertical = function(v) {
    if(!isInputBoolean(v)||v===true) {
        this.obj.style.cssText += "overflow-y:auto;";
    } else {
        this.obj.style.cssText += "overflow-y:hidden;";
    }
};
Sprite.prototype.scrollHorizontal = function(v) {
    if(!isInputBoolean(v)||v===true) {
        this.obj.style.cssText += "overflow-x:auto;";
    } else {
        this.obj.style.cssText += "overflow-x:hidden;";
    }
};
Sprite.prototype.id = function(idName) {
    if (idName!==undefined) {
        this.obj.id = idName;
    } else {
        return this.obj.id;
    }
};
Sprite.prototype.frame = function(left,top,width,height,right,bottom) {

    this.left(left);
    this.top(top);
    this.width(width);
    this.height(height);
    this.right(right);
    this.bottom(bottom);
};

Sprite.prototype.left = function(left) {
    if( left!==undefined ) {
        this.obj.style.cssText += (typeof left === "string")?'left:'+left+';':'left:'+left+'px;';
    } else {
        if(typeof left === "string")
            return parseInt(this.obj.style.left.replace('%',''));
        else
            return parseInt(this.obj.style.left.replace('px',''));
    }
};
Sprite.prototype.top = function(top) {
    if( top!==undefined ) {
        this.obj.style.cssText += (typeof top === "string")?'top:'+top+';':'top:'+top+'px;';
    } else {
        if(typeof top === "string")
            return parseInt(this.obj.style.top.replace('%',''));
        else
            return parseInt(this.obj.style.top.replace('px',''));
    }
};
Sprite.prototype.contentTop = function() {
    return this.obj.offsetTop;
};
Sprite.prototype.width = function(width) {
    if( width!==undefined ) {
        this.obj.style.cssText += (typeof width === "string")?'width:'+width+';':'width:'+width+'px;';
    } else {
        if(typeof width === "string")
            return parseInt(this.obj.style.width.replace('%',''));
        else
            return parseInt(this.obj.style.width.replace('px',''));
    }
};
Sprite.prototype.contentWidth = function() {
    return this.obj.offsetWidth;
};
Sprite.prototype.contentHeight = function() {
    return this.obj.offsetHeight;
};
Sprite.prototype.minWidth = function(width) {
    if( width!==undefined ) {
        this.obj.style.cssText += (typeof width === "string")?'min-width:'+width+';':'min-width:'+width+'px;';
    } else {
        return this.obj.offsetWidth;
    }
};
Sprite.prototype.height = function(height) {
    if( height!==undefined ) {
        this.obj.style.cssText += (typeof height === "string")?'height:'+height+';':'height:'+height+'px;';
    } else {
        if(typeof height === "string")
            return parseInt(this.obj.style.height.replace('%',''));
        else
            return parseInt(this.obj.style.height.replace('px',''));
    }
};
Sprite.prototype.right = function(right) {
    if( right!==undefined ) {
        this.obj.style.cssText += (typeof right === "string")?'right:'+right+';':'right:'+right+'px;';
    } else {
        if(typeof right === "string")
            return parseInt(this.obj.style.right.replace('%',''));
        else
            return parseInt(this.obj.style.right.replace('px',''));
    }
};
Sprite.prototype.bottom = function(bottom) {
    if( bottom!==undefined ) {
        this.obj.style.cssText += (typeof bottom === "string")?'bottom:'+bottom+';':'bottom:'+bottom+'px;';
    } else {
        if(typeof bottom === "string")
            return parseInt(this.obj.style.bottom.replace('%',''));
        else
            return parseInt(this.obj.style.bottom.replace('px',''));
    }
};

Sprite.prototype.marginFrame = function(left,right,top,bottom) {

    var temp;

    if( left!==undefined ) {
        temp = (typeof left === "string")?'margin-left:'+left+';':'margin-left:'+left+'px;';
        this.obj.style.cssText += temp;
    }
    if( top!==undefined ) {
        temp = (typeof top === "string")?'margin-top:'+top+';':'margin-top:'+top+'px;';
        this.obj.style.cssText += temp;
    }
    if( right!==undefined ) {
        temp = (typeof right === "string")?'margin-right:'+right+';':'margin-right:'+right+'px;';
        this.obj.style.cssText += temp;
    }
    if( bottom!==undefined ) {
        temp = (typeof bottom === "string")?'margin-bottom:'+bottom+';':'margin-bottom:'+bottom+'px;';
        this.obj.style.cssText += temp;
    }
};
//----- div rotate,ex:ss.rotate(90); -----//
Sprite.prototype.rotate = function(v) {
    if( isInputValid(v) ) {
        this.obj.style.cssText += 'transform:rotate('+v+'deg);';
    }
};
Sprite.prototype.color = function(r,g,b) {
    var c = 'rgb('+r+','+g+','+b+');';
    this.obj.style.cssText += 'background:' + c + ';';
    return this.obj.style.background;
};
Sprite.prototype.colorHex = function(hexString) {
    var c = '#'+hexString;
    this.obj.style.cssText += 'background:' + c + ';';
    return this.obj.style.background;
};
Sprite.prototype.backgroundAlpha = function(v) {
    var regEx = /[0-9]+/g;
    var arr = (this.obj.style.background).match(regEx);
    if( !isInputValid(v) )
        v = '1';
    this.obj.style.cssText += 'background:rgba('+arr[0]+','+arr[1]+','+arr[2]+','+v+');';
};
Sprite.prototype.border = function(widthPx,colorHexStr,isInner) {
    var c = widthPx+"px"+" "+"solid"+" "+"#"+colorHexStr;
    if( isInputBoolean(isInner)&&isInner )
        c += ';box-sizing:border-box';
    this.obj.style.cssText += 'border:' + c + ';';
};
Sprite.prototype.borderColor = function(colorHexStr) {
    var c = "#"+colorHexStr;
    this.obj.style.cssText += 'border-color:' + c + ';';
};
Sprite.prototype.borderWidth = function(widthPx) {
    var c = widthPx+"px";
    this.obj.style.cssText += 'border-width:' + c + ';';
};
Sprite.prototype.cornerRadius = function(radiusPx) {
    var c = radiusPx+"px";
    this.obj.style.cssText += "border-radius:" + c + ";";
};
Sprite.prototype.shadow = function(horizontalPx,verticalPx,blurPx,alpha) {
    var c = "rgba(0,0,0,"+alpha+")";
    var c1 = horizontalPx+"px"+" "+verticalPx+"px"+" "+blurPx+"px"+" "+c;
    this.obj.style.cssText += "box-shadow:"+c1+";";
};
Sprite.prototype.alpha = function(alpha) {
    if( isInputValid(alpha) )
        this.obj.style.cssText += 'opacity:' + alpha + ';';
    else
        return this.obj.style.opacity;
};
Sprite.prototype.addChild = function(ttt) {
    this.obj.appendChild(ttt.obj);
};
Sprite.prototype.removeAllChild = function() {
    while( this.obj.hasChildNodes() ) {
        this.obj.removeChild(this.obj.lastChild);
    }
};
Sprite.prototype.removeFromParent = function() {

    if( this.obj.parentElement ) {
        (this.obj.parentElement).removeChild(this.obj);
    }
};
Sprite.prototype.userInteractionEnabled = function(isEnabled) {
    if( isEnabled ) {
        this.obj.style.pointerEvents = "auto";
    } else {
        this.obj.style.pointerEvents = "none";
    }
};
Sprite.prototype.addMouseOver = function(func) {
    this.obj.addEventListener("mouseover",func,false);
};
Sprite.prototype.addMouseOut = function(func) {
    this.obj.addEventListener("mouseout",func,false);
};
Sprite.prototype.addMouseDown = function(func) {
    this.obj.addEventListener('mousedown', func, false);
};
Sprite.prototype.addMouseUp = function(func) {
    this.obj.addEventListener('mouseup', func, false);
};
Sprite.prototype.addMouseMove = function(func) {
    this.obj.addEventListener('mousemove', func, true);
};
Sprite.prototype.addMouseClick = function(func) {
    this.obj.addEventListener('click',func,false);
};
Sprite.prototype.addMouseDoubleClick = function(func) {
    this.obj.addEventListener('dblclick',func,false);
};
/**----------------------------------------------------------------
 * Quick add mouse-event for changing color and fade-ani, just like button
 * Ex: v1.addMouseColorEvent({colorNormal:'990000',colorOver:'FF0000',colorDown:'FFF000',fadeOutSpeed:.3});
 * colorNormal: is must have var, defined color in normal-state
 * colorOver:   when this var exist, means we have mouse-over and mouse-out state
 * colorDown:   when exist, means we have mouse-down and mouse-up state
 * fadeOutSpeed:when exist, means we have fade-out animation
 * ----------------------------------------------------------------
 * P.S. mouse-down and mouse-up may have delay in browser's developer-mode
 ----------------------------------------------------------------*/
Sprite.prototype.addMouseColorEvent = function(v) {
    var tween = null;
    v.sp = this;
    if(isInputValid(v)) {
        if(isInputString(v.colorOver)) {
            this.addMouseOver(function() {
                if(tween)
                    tween.kill();
                v.sp.colorHex(v.colorOver);
            });
            this.addMouseOut(function() {
                if(isInputValid(v.fadeOutSpeed)) {
                    tween = v.sp.aniByColor(v.fadeOutSpeed,v.colorNormal,false);
                } else {
                    v.sp.colorHex(v.colorNormal);
                }
            });
        }
        if(isInputString(v.colorDown)) {
            this.addMouseDown(function() {
                if(tween)
                    tween.kill();
                v.sp.colorHex(v.colorDown);
            });
            this.addMouseUp(function() {
                if(v.colorOver)
                    v.sp.colorHex(v.colorOver);
                else
                    v.sp.colorHex(v.colorNormal);
            });
        }
    }
};
Sprite.prototype.ani_x = function(duration,dis,isBounce,funcUpdate,funcDone) {
    var aaa = dis + 'px';
    var bbb = isBounce ? Bounce.easeOut : null;
    return TweenLite.to(this.obj,duration,{left:aaa,ease:bbb,onUpdate:funcUpdate,onComplete:funcDone});
};
Sprite.prototype.ani_y = function(duration,dis,isBounce,funcUpdate,funcDone) {
    var aaa = dis + 'px';
    var bbb = isBounce ? Bounce.easeOut : null;
    return TweenLite.to(this.obj,duration,{top:aaa,ease:bbb,onUpdate:funcUpdate,onComplete:funcDone});
};
Sprite.prototype.aniByColor = function (duration,hexString,isBounce) {
    var bbb = isBounce ? Bounce.easeOut : null;
    var ccc = "#"+hexString;
    return TweenLite.to(this.obj,duration,{css:{backgroundColor:ccc},ease:bbb});
};
//----- cssBlock example: {left:0,top:0,width:30,height:30} -----//
Sprite.prototype.aniByCSS = function (duration,cssBlock,isBounce,onDoneFunc) {
    var bbb = isBounce ? Bounce.easeOut : null;
    return TweenLite.to(this.obj,duration,{css:cssBlock,ease:bbb,onComplete:onDoneFunc});
};
Sprite.prototype.aniByAlpha = function (duration,alphaVar,onCompleteFunc) {
    return TweenLite.to(this.obj,duration,{alpha:alphaVar, onComplete:onCompleteFunc});
};



//------------- SPRITE TEXT ----------------//
Sprite.prototype.applyText = function (textString) {
    this.obj.innerHTML = textString;
    return this.obj.innerHTML;
};
Sprite.prototype.textColor = function (hexString) {
    this.obj.style.cssText += "color:#"+hexString+";";
    return this.obj.style.color;
};
Sprite.prototype.textFont = function (v) {
    this.obj.style.cssText += 'font-family:'+"'"+v+"'"+';';
};
Sprite.prototype.textSize = function (pxString) {
    if(isInputValid(pxString))
        this.obj.style.cssText += "font-size:"+pxString+"px"+";";
    return this.obj.style.fontSize;
};
Sprite.prototype.textWeight = function (level1to9) {
    level1to9 *= 100;
    this.obj.style.cssText += "font-weight:"+level1to9+";";
};
Sprite.prototype.alignCenter = function () {
    this.obj.style.cssText += "left:50%;top:50%;transform:translateX(-50.5%)translateY(-50.5%);";
};
Sprite.prototype.alignCenterVertical = function () {
    this.obj.style.cssText += "top:50%;transform:translateY(-50.5%);";
};
Sprite.prototype.alignCenterHorizontal = function () {
    this.obj.style.cssText += "left:50%;transform:translateX(-50.5%);";
};
Sprite.prototype.textAlignCenter = function () {
    this.obj.style.cssText += "text-align:center;vertical-align:middle;"+'line-height:'+this.obj.offsetHeight+'px;';
};
Sprite.prototype.textAlignCenterVertical = function () {
    this.obj.style.cssText += "vertical-align:middle;"+'line-height:'+this.obj.offsetHeight+'px;';
};
Sprite.prototype.textAlignVerticalByLineHeight = function(intHeight) {
    this.obj.style.cssText += 'line-height:'+intHeight+'px;';
};
Sprite.prototype.textAlignCenterHorizontal = function() {
    this.obj.style.cssText += 'text-align:center;';
};
//----- make target un-selected, un-selectable -----//
Sprite.prototype.makeCursorNormal = function(v) {
    if( !isInputValid(v) || isInputBoolean(v)&&v===true ) {
        this.obj.style.cssText += "cursor:default;user-select:none;-ms-user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;";
    } else {
        this.obj.style.cssText += "cursor:default;user-select:text;-ms-user-select:text;-moz-user-select:text;-khtml-user-select:text;-webkit-user-select:text;-webkit-touch-callout:text;";
    }
};


//------------- SPRITE IMAGE ----------------//
Sprite.prototype.initImage = function (idName,imgUrlString) {

    this.obj = document.createElement('img');
    if( isInputString(idName) ) {
        this.obj.id = idName;
    }
    if( isInputString(imgUrlString) ) {
        this.obj.src = imgUrlString;
        this.obj.style.cssText += 'position:absolute;background-color:transparent;';
        this.maskOverflow(true);
        this.makeCursorNormal();
        document.body.appendChild(this.obj);
    }

    return this.obj;
};
Sprite.prototype.initImageBySVG = function( idName,svgBase64String ) {

    this.obj = document.createElement('img');
    if( isInputValid(idName) ) {
        this.obj.id = idName;
    }
    if( isInputString(svgBase64String) ) {
        this.obj.src = 'data:image/svg+xml;base64,'+svgBase64String;
        this.obj.style.cssText += 'position:absolute;background-color:transparent;';
        this.maskOverflow(true);
        this.makeCursorNormal();
        document.body.appendChild(this.obj);
    }
};
Sprite.prototype.svgColorByHex = function( hexStr ) {

    var arr = (this.obj.src).split(',');

    var indexStart = (atob(arr[1])).indexOf('fill="#');
    this.obj.src = arr[0]+','+btoa((atob(arr[1])).replace( (atob(arr[1])).substring(indexStart,indexStart+13),'fill="#'+hexStr));

};
Sprite.prototype.getImageWidth = function () {
    return this.obj.naturalWidth;
};
Sprite.prototype.getImageHeight = function () {
    return this.obj.naturalHeight;
};
Sprite.prototype.fitImageOriginSize = function () {
    var w = this.getImageWidth();
    var h = this.getImageHeight();
    this.width(w);
    this.height(h);
};
Sprite.prototype.updateImage = function (imgUrlString) {
    var img = this.obj;
    img.src = imgUrlString;
};






//------------- SPRITE INPUT TEXT ----------------//
Sprite.prototype.initInputText = function (idName) {

    this.obj = document.createElement('input');
    if( isInputString(idName) ) {
        this.obj.id = idName;
    }
    this.obj.style.cssText += 'position:absolute;background-color:transparent;border:none;outline:none;';
    this.makeCursorNormal();
    document.body.appendChild(this.obj);

    return this.obj;
};
//----- (press enter)   e.keycode==13 -----//
Sprite.prototype.addKeyboardUp = function(func) {
    this.obj.addEventListener('keyup', func, false);
};
Sprite.prototype.getInputText = function() {
    return this.obj.value;
};
Sprite.prototype.setInputText = function(v) {
    this.obj.value = v;
};


//------------- SPRITE TRIANGLE SHAPE ----------------//
Sprite.prototype.initTriangle = function(id,w,h,hex){

    this.obj = document.createElement('div');
    if( isInputString(id) )
        this.obj.id = id;
    var v1 = 'border-width:0 '+w/2+'px '+h+'px '+w/2+'px;';
    var v2 = 'border-color:transparent transparent '+'#'+hex+' transparent';
    this.obj.style.cssText += 'position:absolute;width:0;height:0;border-style:solid;'+v1+v2;
    this.maskOverflow(true);
    this.makeCursorNormal();
    document.body.appendChild(this.obj);

    return this.obj;
};

Sprite.prototype.triangleColor = function(hex) {
    if( isInputString(hex) ) {
        this.obj.style.cssText += 'border-color:transparent transparent '+'#'+hex+' transparent';
    }
};


//------------- SPRITE HTTP GET ----------------//
// v1:request url,ex:login.php v2:parameters follows,ex:login.php?name=xx&pass=yy
// ex: httpGet('ss.php',['?type=33','&name=uu'],func...
Sprite.prototype.httpGet = function(url,arr,func) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            func(this.responseText);
        }
    };
    var param  = '';
    if(isInputArray(arr)) {
        arr.forEach(function(item) {
            param += item;
        });
    }
    xmlhttp.open("GET", url+param, true);
    xmlhttp.send();

    //----- you can stop this request if necessary, ex:xmlhttp.abort()
    return xmlhttp;
};


/**----------------------------------------------------------------
 * PROBLEMS(2017Jan):
 * 1) font-face only support ie10 and above, ie9 not supported
 * 2) font for cht size is large, 1.2mb is a normal size, slow down web-page loading speed
 * 3) font may store on server, diff server may cause slow loading speed
 * 4) best font server for now is google, best loading speed
 * 5) final font-face css Ex:
 * @font-face {
        font-family: 'Noto Sans TC';
        font-style: normal;
        font-weight: 900;
        src: url(//fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Light.woff2) format('woff2'),
        url(//fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Light.woff) format('woff'),
        url(//fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Light.otf) format('opentype');
    }
 * 6) this func need to be edit in future, make css format just like above
 * 7) each font need to convert 3 diff types(woff,woff2,opentype), for diff platform
 * 7) Result:best way is using local-computer's font, no extra font-loading time
 * 8) @import url(http://fonts.googleapis.com/earlyaccess/notosanstc.css); will load all version
 * 9) all version css-font has big loading size, but u can set 5 diff font-weight on page
 * ----------------------------------------------------
 *  Pre-load global-font from server's relative path
 *  then any obj and use the fontName for font-family
 *  Ex: v: {fontPath:'_com/font_light.ttf',fontType:'truetype'}
 ----------------------------------------------------------------*/
function LoadGlobalFont(v) {
    var newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode("\
@font-face {\
    font-family: '" + v.fontName + "';\
    src: url('" + v.fontPath + "') format('" + v.fontType + "');\
}\
"));
    document.head.appendChild(newStyle);

    //----- apply font-family to whole body -----//
    document.body.style.cssText += 'font-family:'+"'Microsoft JhengHei',"+"'"+v.fontName+"'"+';';
}
function LoadFontAndSetGlobal() {
    //----- before font loaded, use user's local font for display -----//
    SetUserLocalFontForGlobal();
    //----- start loading font from server -----//
    var newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode("\
@font-face {\
    font-family: 'Noto Sans TC';\
    src: url(//fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Light.woff2) format('woff2'),\
    url(//fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Light.woff) format('woff'),\
    url(//fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Light.otf) format('opentype');\
}\
    \
"));
    document.head.appendChild(newStyle);


    //----- let load-font begin, we need to use this font once -----//
    var ss = document.createElement('div');
    ss.innerHTML = 'giItT1WQy@!-/#';
    ss.style.cssText += "visibility:hidden;";
    document.body.appendChild(ss);
    //----- check if new font loaded, will change div's content height -----//
    var oldH = ss.offsetHeight;
    ss.style.cssText += 'font-family:'+"'"+'Noto Sans TC'+"'"+';';
    var tt = setInterval(function() {
        if( oldH !== ss.offsetHeight ) {
            log(ss.offsetHeight);
            clearInterval(tt);

            newStyle.appendChild(document.createTextNode("\
                *{\
                    font-family: 'Noto Sans TC';\
                }\
                "
            ));
        }
    },500);
}
/**----------------------------------------------------------------
 * PROBLEMS(2017Jan):
 * 1) NotoSansTC is not as good as we though in browser's font display
 * 2) This font let small text display well, will test in future
 * ----------------------------------------------------
 * 1) Before NotoSansTC loaded, using user's local font for default
 * 2) When NotoSansTC load done, make NotoSansTC for default font automatically
 ----------------------------------------------------------------*/
function SetNotoSansForGlobalFont(doneFunc) {

    var feedbackOnce = false;

    var fontList = '"STHeiti Light","Microsoft JhengHei Light","Microsoft JhengHei UI Light","Helvetica Neue","Helvetica,Arial","メイリオ","맑은 고딕","sans-serif","WenQuanYi Zen Hei";';
    var newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode("\
    *{\
        font-weight:200;\
        font-family:"+fontList+"\
     }\
     "
    ));
    document.head.appendChild(newStyle);

    newStyle.appendChild(document.createTextNode("\
@font-face {\
    font-family: 'Noto Sans TC';\
    src: url(//fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Thin.woff2) format('woff2'),\
    url(//fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Thin.woff) format('woff'),\
    url(//fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Thin.otf) format('opentype');\
}\
    \
"));

    FontFaceOnload( "Noto Sans TC", {
        success: function() {
            if( !feedbackOnce ) {
                feedbackOnce = true;
                newStyle.appendChild(document.createTextNode("\
                *{\
                    font-weight:100;\
                    font-family:" + 'Noto Sans TC' + "\
                 }\
                 "
                ));
                if (isInputFuncType(doneFunc)) {
                    doneFunc();
                }
            }
        }
    });

}

/**----------------------------------------------------------------
 *  Set web-page's default-font from local computer's font-list
 ----------------------------------------------------------------*/
function SetUserLocalFontForGlobal() {
    var fontList = '"STHeiti Light","Microsoft JhengHei Light","Microsoft JhengHei UI Light","Helvetica Neue","Helvetica,Arial","sans-serif","WenQuanYi Zen Hei";';

    var newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode("\
    *{\
        font-weight:300;\
        font-family:"+fontList+"\
     }\
     "
    ));
    document.head.appendChild(newStyle);
}



/*====================================================================================
    EXTENDED LARGE FUNCTION FROM HERE
 * ====================================================================================*/
Sprite.prototype.initLoading = function(v) {

    var scaleVal = .4;
    if( isInputValid(v)&&isInputValid(v.scale) ) {
        scaleVal = v.scale;
    }

    this.obj = document.createElement('div');
    this.obj.style.cssText += 'position:absolute;background-color:transparent;';
    this.makeCursorNormal();
    document.body.appendChild(this.obj);

    var opts = {
        lines: 12 // The number of lines to draw
        , length: 30 // The length of each line
        , width: 5 // The line thickness
        , radius: 55 // The radius of the inner circle
        , scale:scaleVal // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#ffffff' // #rgb or #rrggbb or array of colors
        , opacity: 0.3 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 2.0 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 25 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '50%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: false // Whether to render a shadow
        , hwaccel: true // Whether to use hardware acceleration
        , position: 'relative' // Element positioning
    };
    var spinner = new Spinner(opts).spin(this.obj);

    return this.obj;
};



/**----------------------------------------------------------------
 ListBoxCell (only For ListBox usage(may treat as button))
 ----------------------------------------------------------------
 Ex:var cc = new ListBoxCell({x:0,y:0});
 cc.whenClick(function() {
        log('hello');
 });
 ----------------------------------------------------------------*/
function ListBoxCell(v) {

    var def={
        x:200,
        y:200,
        width:250,
        height:60,
        colorNormal:'4e886f',
        colorOver:'f5b333',
        colorDown:'f55904',
        colorEven:'43755f',
        title:'BUTTON',
        titleSize:'20',
        titleColor:'ffffff',
        tag:'0',
        iconTitleDis:10
    };

    var icon,title,titleSize,titleColor,colorNormal,colorOver,colorDown,xx,yy,ww,hh,tag,iconTitleDis,isTitleCenter;
    var colorEven,shapeTriangle,funcOnClick;
    var bgRoot = null;
    var bgTitle = null;



    function initVar() {
        tag = isInputValid(v)&&isInputValid(v.tag)?v.tag:def.tag;
        isTitleCenter = !(isInputValid(v)&&isInputObject(v.icon));
        icon = isTitleCenter?null:v.icon;
        iconTitleDis = isInputValid(v)&&isInputValid(v.iconTitleDis)?v.iconTitleDis:def.iconTitleDis;
        xx = isInputValid(v)&&isInputValid(v.x)?v.x:def.x;
        yy = isInputValid(v)&&isInputValid(v.y)?v.y:def.y;
        ww = isInputValid(v)&&isInputValid(v.width)?v.width:def.width;
        hh = isInputValid(v)&&isInputValid(v.height)?v.height:def.height;
        colorNormal = isInputValid(v)&&isInputString(v.colorNormal)?v.colorNormal:def.colorNormal;
        colorDown = isInputValid(v)&&isInputString(v.colorDown)?v.colorDown:def.colorDown;
        colorOver = isInputValid(v)&&isInputString(v.colorOver)?v.colorOver:def.colorOver;
        colorEven = isInputValid(v)&&isInputString(v.colorEven)?v.colorEven:def.colorEven;
        title = isInputValid(v)&&isInputString(v.title)?v.title:def.title;
        titleSize = isInputValid(v)&&isInputString(v.titleSize)?v.titleSize:def.titleSize;
        titleColor = isInputValid(v)&&isInputString(v.titleColor)?v.titleColor:def.titleColor;

        //----- when cell's index is even, make bg color little darker -----//
        if( tag%2!==0 ) {
            colorNormal = colorEven;
        }
    }

    function initBgRoot() {
        bgRoot = new Sprite();
        bgRoot.initDiv();
        bgRoot.top(yy);
        bgRoot.left(xx);
        bgRoot.width(ww);
        bgRoot.height(hh);
        bgRoot.colorHex(colorNormal);
        bgRoot.tag = tag;
        bgRoot.addMouseOver(function() {
            bgRoot.colorHex(colorOver);
            if(isInputObject(shapeTriangle))
                shapeTriangle.triangleColor(colorOver);
        });
        bgRoot.addMouseOut(function() {
            bgRoot.colorHex(colorNormal);
            if(isInputObject(shapeTriangle))
                shapeTriangle.triangleColor(colorNormal);
        });
        bgRoot.addMouseDown(function() {
            bgRoot.colorHex(colorDown);
            if(isInputObject(shapeTriangle))
                shapeTriangle.triangleColor(colorDown);
        });
        bgRoot.addMouseUp(function() {
            bgRoot.colorHex(colorOver);
            if(isInputObject(shapeTriangle))
                shapeTriangle.triangleColor(colorOver);
        });
        bgRoot.addMouseClick(function() {
            if(isInputValid(funcOnClick))
                funcOnClick(bgRoot.tag);
        });
    }


    function initIconTitle() {
        if( isTitleCenter ) {
            bgTitle = new Sprite();
            bgTitle.initDiv();
            bgTitle.width(bgRoot.width()-20);
            bgTitle.height(bgRoot.height()-10);
            bgTitle.applyText(title);
            bgTitle.textSize(titleSize);
            bgTitle.textColor(titleColor);
            bgTitle.alignCenter();
            bgTitle.textAlignCenter();
            bgTitle.makeCursorNormal();
            bgRoot.addChild(bgTitle);
        }
    }




    initVar();
    initBgRoot();
    initIconTitle();



    this.tag = tag = 0;
    this.getCellHeight = function() {
        return bgRoot.height();
    };
    this.setShapeTriangle = function(v) {
        if( isInputObject(v) )
            shapeTriangle = v;
    };
    this.whenClick = function(func) {
        funcOnClick = func;
    };
    this.getText = function() {
        return title;
    };
    this.bg = bgRoot;

}


/**----------------------------------------------------------------
 * ListBox (shows as check-box, return which index & string u choose)
 * ----------------------------------------------------------------
 var arrName = ["Hello","Sunday","Woods"];
 var ll = new ListBox({x:310,y:110,arrCell:arrName,cellH:50,w:230,textSize:'27'});
 ll.whenUserSelected(function(v) {
    log(v); // ex:[1, "Sunday"]
 });
 * ----------------------------------------------------------------
 A) ListBox's x,y will become center-top of the shape-triangle
 B) memory test-->memory release ok
 C) function's parameter pls refer to def inside func
 D) add listener:whenUserSelected when list been selected
 * ----------------------------------------------------------------*/
function ListBox(v) {

    var isCellExist = isInputValid(v)&&isInputArray(v.arrCell);
    var x = useFuncInputOrDefault(v,'x',200);
    var y = useFuncInputOrDefault(v,'y',200);
    var w = useFuncInputOrDefault(v,'w',270);
    var h = useFuncInputOrDefault(v,'h',60);
    var cornerR = useFuncInputOrDefault(v,'cornerR',10);
    var tShapeW = useFuncInputOrDefault(v,'tShapeW',20);
    var tShapeH = useFuncInputOrDefault(v,'tShapeH',10);
    var cellH = useFuncInputOrDefault(v,'cellH',30);
    var colorNormal = useFuncInputOrDefault(v,'colorNormal','4e886f');
    var colorDown = useFuncInputOrDefault(v,'colorDown','f55904');
    var colorOver = useFuncInputOrDefault(v,'colorOver','f5b333');
    var colorEven = useFuncInputOrDefault(v,'colorEven','43755f');
    var colorText = useFuncInputOrDefault(v,'colorText','ffffff');
    var textSize = useFuncInputOrDefault(v,'textSize','20');


    var cellTotalHeight,bgRoot,bgRound,bgTShape = null;
    //----- more space for bgRound's shadow -----//
    var borderDis = 20;
    //----- final string selected by user from list -----//
    var ans = null;
    //----- arr for store cells -----//
    var arr = {};
    //----- full-screen of bg -----//
    var bgMother = null;
    //----- full-screen touch area for mouse-down and exit -----//
    var bgExit = null;
    //----- assign from outside for when cell-click -----//
    var clientFunc = null;


    function exit() {
        bgMother.removeFromParent();
        bgMother = null;
    }

    function initBgMother() {
        bgMother = new Sprite();
        bgMother.initDiv();
        bgMother.frame(0,0,'100%','100%');
    }

    function initBgExit() {
        bgExit = new Sprite();
        bgExit.initDiv();
        bgExit.frame(0,0,'100%','100%');
        bgExit.addMouseDown(function() {
            exit();
        });
        bgMother.addChild(bgExit);
    }

    function initBgRoot() {
        bgRoot = new Sprite();
        bgRoot.initDiv();
        bgRoot.top(y);
        bgRoot.left(x-(w+borderDis)/2);//(x-borderDis/2);
        bgRoot.width(w+borderDis);
        bgRoot.height(h);               // bgRoot's height may change later in initCell()
//        bgRoot.colorHex('000099');      // debug-usage
        bgMother.addChild(bgRoot);
    }

    function initTShape() {
        bgTShape = new Sprite();
        bgTShape.initTriangle(null,tShapeW,tShapeH,colorNormal);
        bgTShape.alignCenterHorizontal();
        bgRoot.addChild(bgTShape);
    }


    function initRoundBg() {
        bgRound = new Sprite();
        bgRound.initDiv();
        bgRound.top(tShapeH-1);
        bgRound.left(borderDis/2);
        bgRound.width(w);bgRound.height(h-tShapeH);
        bgRound.colorHex(colorNormal);
        bgRound.cornerRadius(cornerR);
        bgRoot.addChild(bgRound);
    }

    function initShadow() {
        //----- when user define isShadow=false will not run this func -----//
        if( !(isInputValid(v)&&isInputBoolean(v.isShadow)&&!v.isShadow) )
            bgRound.shadow(0,0,15,.7);
    }

    function initCell() {

        //----- user define cell's name or not -----//
        if( isCellExist ) {
            for( var i=0; i<v.arrCell.length;i++) {
                var posy = (i*cellH);
                var cc = new ListBoxCell({
                    x:0,y:posy,title:v.arrCell[i],tag:i,width:w,height:cellH,
                    colorNormal:colorNormal,colorOver:colorOver,colorDown:colorDown,titleColor:colorText,
                    titleSize:textSize,colorEven:colorEven
                });
                cc.whenClick(whenCellClick);
                bgRound.addChild(cc.bg);
                arr[i] = cc;
            }
            //----- update bg and bg-rounded's height by cell -----//
            var ccc = arr[0];
            cellTotalHeight = ccc.getCellHeight()*(v.arrCell.length);
            bgRoot.height(cellTotalHeight+tShapeH+borderDis);
            bgRound.height(cellTotalHeight);
        } else {
            var dd = new ListBoxCell({
                title:'empty',width:w,height:cellH,x:0,y:0,tag:0,
                colorNormal:colorNormal,colorOver:colorOver,colorDown:colorDown,titleColor:colorText,
                titleSize:textSize,colorEven:colorEven
            });
            dd.whenClick(whenCellClick);
            bgRoot.height(dd.getCellHeight()+tShapeH+borderDis);
            bgRound.height(dd.getCellHeight());
            bgRound.addChild(dd.bg);
            arr[0] = dd;
        }

        //----- make shape-triangle's mouse-event-color same with first cell -----//
        var cccc = arr[0];
        cccc.setShapeTriangle(bgTShape);
    }


    //----- mouse-click by user -----//
    function whenCellClick(v) {
        // return back which index and it's string content, array format
        ans = [v,arr[v].getText()];
        if(isInputFuncType(clientFunc)) {
            clientFunc(ans);
        }
        exit();
    }


    initBgMother();
    initBgExit();
    initBgRoot();
    initRoundBg();
    initTShape();
    initCell();
    initShadow();


    this.whenUserSelected = function(func){
        clientFunc = func;
    };
    this.bg = bgMother;

}


/*********************************************************************
 * ScrollView (many sprite-cell can place in it and scroll vertically)
 * -------------------------------------------------------------------
 * function getCell(i) {
        var ccc = new Sprite();
        ccc.initDiv();
        ccc.applyText(i);
        ccc.textFont('font-normal');
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        ccc.color(r,g,b);
        ccc.frame(0,50*i,400,50);
        ccc.addMouseOver(function () {
            ccc.alpha(.3);
        });
        ccc.addMouseOut(function () {
            ccc.alpha(1);
        });
        return ccc;
    }
    function getArrCell() {
        var arr = [];
        for( var i=0;i<15;i++ ) {
            arr.push(getCell(i));
        }
        return arr;
    }
    var view = new ScrollView({x:0,y:0,w:300,h:500,isBarWhite:true,
    isBarAutoHide:true,barAutoHideTime:3000,isBarAppearWhenOver:true,
    bgColor:'009900'});
    view.addCellArr(getArrCell());
 * -------------------------------------------------------------------
 * isBarWhite:      scroll-bar has 2 diff kinds of color-style, black or white
 * isBarAutoHide:   when false, scroll-bar will always be there
 * barAutoHideTime: after 3 sec scroll-bar will auto hide, in millisecond
 * isBarAppearWhenOver:
 *                  when false, scroll-bar will appear only when mouse-scrolling
 * bgColor:         scrollView's background color, transparent by default
 *********************************************************************/
function ScrollView(v) {

    //----- clean all cell and reset scroll-bar -----//
    this.cleanAllCell = function() {
        resetScrollView();
    };
    //----- add one cell each time -----//
    this.addCell = function(c) {
        addCell2ScrollView(c);
    };
    //----- update content by array of cell -----//
    this.addCellArr = function(a) {
        resetScrollView();
        a.forEach(function(c) {
            addCell2ScrollView(c);
        });
    };

    var xx = useFuncInputOrDefault(v,'x',0);
    var yy = useFuncInputOrDefault(v,'y',0);
    var ww = useFuncInputOrDefault(v,'w',300);
    var hh = useFuncInputOrDefault(v,'h',500);
    // color-style white or black for scroll-bar
    var isBarColorWhite = useFuncInputOrDefault(v,'isBarWhite',false);
    // scroll-bar will auto disappear by default
    var isBarAutoHide = useFuncInputOrDefault(v,'isBarAutoHide',true);
    // scroll-bar will auto disappear after 3 sec
    var barAutoHideTime = useFuncInputOrDefault(v,'barAutoHideTime',3000);
    // scroll-bar appeared when mouse-over
    var isBarAppearWhenOver = useFuncInputOrDefault(v,'isBarAppearWhenOver',true);

    var contentH = 0;               // make scroll-bar appear only when contentH>hh
    var barWidthMin = 10;           // scroll-bar's width when normal
    var barWidthMax = 18;           // scroll-bar's width when mouse-over

    var barAlpha = .4;
    var barAniSpeed = .15;



    //----- if cell exist, remove all cell and reset scroll-bar -----//
    function resetScrollView() {
        if( bgScrollBase.obj.hasChildNodes() ) {
            bgScrollBase.removeAllChild();
            contentH = 0;
            updateScrollState();
            scrollbar.top(0);
        }
    }

    //----- update scroll-dis and scroll-bar's height by cell-content -----//
    function updateScrollState() {
        if( contentH > hh ) {
            scrollbar.hidden(false);
        } else {
            scrollbar.hidden(true);
        }
        content.height(contentH);
        scrollbar.height( getBarH() );
        scrollDisMax = bgRoot.height()-scrollbar.height();
    }

    //----- add cell and update content's height -----//
    function addCell2ScrollView(c) {
        bgScrollBase.addChild(c);
        //----- update scroll dis -----//
        contentH += c.height();
        updateScrollState();
    }




    var bgRoot = new Sprite();
    bgRoot.initDiv();
    if( isInputValid(v)&&isInputValid(v.bgColor) ) {
        bgRoot.colorHex(v.bgColor);
    }
    bgRoot.frame(xx,yy,ww,hh);


    var content = new Sprite();
    content.initDiv();
    content.frame(0,0,2,contentH);

    var bgScrollBase = new Sprite();
    bgScrollBase.initDiv();
    bgScrollBase.frame(0,0,bgRoot.width()+20,bgRoot.height());
    bgScrollBase.scrollVertical();
    bgScrollBase.addChild(content);
    bgRoot.addChild(bgScrollBase);

    //----- get scroll-bar's height based on bg and cell-content's height -----//
    function getBarH() {
        return bgRoot.height()*(bgRoot.height()/content.height());
    }
    //----- make scroll-bar bigger when user wants to drag on it -----//
    function makeBarBigger(v) {
        if( isInputBoolean(v) ) {
            if( v===true ) {
                scrollbar.aniByCSS(barAniSpeed,{width:barWidthMax,borderRadius:barWidthMax/2},false,null);
                //----- when ready dragging bar, disable bar's auto hide -----//
                scrollbarAniHide(false);
                startBarAutoHideTimer(false);
            } else {
                scrollbar.aniByCSS(barAniSpeed,{width:barWidthMin,borderRadius:barWidthMin/2},false,null);
                //----- when not dragging -----//
                if(!isAllowDrag)
                    startBarAutoHideTimer();
            }
        }
    }

    var isAllowDrag = false;
    var dragPosYStart = 0;
    var dragPosYEnd = 0;
    var lastBarPosY = 0;
    var dragDis = 0;
    var scrollbar = new Sprite();
    scrollbar.initDiv();
    scrollbar.frame(null,0,barWidthMin,50,3,null);
    if( isBarColorWhite ) {
        scrollbar.colorHex('ffffff');
    } else {
        scrollbar.colorHex('000000');
    }
    scrollbar.border(.1,'909090',true);
    scrollbar.alpha(barAlpha);
    scrollbar.cornerRadius(scrollbar.width()/2);
    scrollbar.makeCursorNormal();
    scrollbar.height( getBarH() );
    bgRoot.addChild(scrollbar);
    var scrollDisMax = bgRoot.height()-scrollbar.height();
    var scrollDisMin = 0;



    //----- let scroll-bar auto hide -----//
    var timerBarAutoHide = null;
    function scrollbarAniHide(v) {
        if( !isInputValid(v) || isInputBoolean(v)&&v===true ) {
            scrollbar.aniByAlpha(barAniSpeed, 0, function () {
                scrollbar.hidden(true);
            });
        } else {
            if (scrollbar.alpha().toString()==='0') {
                scrollbar.hidden(false);
                scrollbar.aniByCSS(barAniSpeed, {alpha: barAlpha}, false, null);
            }
        }
    }
    function startBarAutoHideTimer(v) {
        if( isBarAutoHide ) {
            if (!isInputValid(v) || isInputBoolean(v) && v === true) {
                clearInterval(timerBarAutoHide);
                timerBarAutoHide = setInterval(function () {
                    scrollbarAniHide();
                    startBarAutoHideTimer(false);
                }, barAutoHideTime);
            } else {
                clearInterval(timerBarAutoHide);
            }
        }
    }
    bgRoot.addMouseOver(function() {
        if( isBarAppearWhenOver ) {
            scrollbarAniHide(false);
            startBarAutoHideTimer();
        }
    });
    //----- let scroll-bar auto hide -----//


    //----- when dragging scroll-bar -----//
    scrollbar.addMouseDown(function(e) {
        //----- save mouse-pos and ready for drag -----//
        lastBarPosY = scrollbar.top();
        dragPosYStart = scrollbar.top()+e.offsetY+yy;
        isAllowDrag = true;
    });
    window.addEventListener('mouseup', function() {
        //----- not allow drag -----//
        isAllowDrag = false;
        //----- do not start auto hide timer when cursor still on scroll-bar -----//
        if(scrollbar.width()!==barWidthMax)
            startBarAutoHideTimer();
    }, false);
    scrollbar.addMouseOver(function() {
        //----- let bar size bigger for user easy to drag -----//
        makeBarBigger(true);
    });
    scrollbar.addMouseOut(function() {
        //----- let bar return to normal-size -----//
        makeBarBigger(false);
    });
    window.addEventListener('mousemove', function(e) {
        if( isAllowDrag ) {

            dragPosYEnd = e.clientY;
            dragDis = (dragPosYEnd-dragPosYStart);
            scrollbar.top( lastBarPosY+dragDis );

            //----- restrict bar's move area -----//
            if( scrollbar.top()>scrollDisMax ) {
                scrollbar.top( scrollDisMax );
            }
            if( scrollbar.top()<scrollDisMin ) {
                scrollbar.top( scrollDisMin );
            }

            //----- apply bar's drag-dis to scrollBase -----//
            bgScrollBase.obj.scrollTop = scrollbar.top()*(content.height()/bgScrollBase.height());
        }
    }, false);
    //----- when dragging scroll-bar -----//

    //----- detect mouse-wheel and move scroll-bar -----//
    bgScrollBase.obj.addEventListener("scroll", function() {
        var posy = bgScrollBase.height()*(bgScrollBase.obj.scrollTop/content.height());
        scrollbar.top(posy);

        //----- show bar when scroll-wheel -----//
        scrollbarAniHide(false);
        //----- do not start auto hide timer when dragging -----//
        if( !isAllowDrag )
            startBarAutoHideTimer();
    });





    updateScrollState();
    startBarAutoHideTimer();

}


function Alert(title,onBtnOK,onBtnCancel,onMaskClick) {
    var maskAlpha = .7;
    function removeAlert() {
        t1.removeFromParent();
        t1 = null;
        v1.removeFromParent();
        v1 = null;
        bg.removeFromParent();
        bg = null;
    }
    function fadeOutAndRemove() {
        bg.aniByAlpha(.1,0,function () {
            removeAlert();
        });
    }
    var bg = new Sprite();
    bg.initDiv();
    bg.top(0);
    bg.left(0);
    bg.width("100%");
    bg.height("100%");
    bg.applyZIndex(99);
    var mask = new Sprite();
    mask.initDiv();
    mask.top(0);
    mask.left(0);
    mask.width("100%");
    mask.height("100%");
    mask.color(0,0,0);
    mask.alpha(0);
    mask.addMouseClick(function () {
        if( isInputValid(onMaskClick)&&isInputFuncType(onMaskClick) ) {
            onMaskClick();
        }
        fadeOutAndRemove();
    });
    var v1 = new Sprite();
    v1.initDiv();
    v1.width(400);
    v1.height(230);
    v1.colorHex("f6f6f6");
    v1.cornerRadius(12);
    v1.alignCenter();
    v1.top(v1.contentTop()-50);
    v1.shadow(0,0,15,.6);
    v1.alpha(0);


    //----- alert's content here -----//
    var borderDis = 18;
    var btnBorderDis = 6;
    var btnHeight = 60;
    var t1 = new Sprite();
    t1.initDiv();
    var safeHeight = v1.height()-borderDis*2-6-60;
    t1.frame(borderDis,borderDis,v1.width()-borderDis*2,null);
    t1.applyText(title);
    t1.textSize(26);
    t1.textColor("5c5c5c");
    t1.obj.style.lineHeight = '28px';
    //----- check content's height exceed dialogue default height -----//
    if( t1.contentHeight()<safeHeight ) {
        t1.top(borderDis+(safeHeight/2)-t1.contentHeight()/2);
        var howManyLines = t1.contentHeight()/parseInt(t1.obj.style.lineHeight.replace('px',''));
        //----- if content only 1 line, make text align center -----//
        if( howManyLines <= 1 ) {
            t1.textAlignCenter();
        }
    } else {
        //----- content's height exceed dialogue height, make dialogue bigger -----//
        v1.height(t1.contentHeight()+borderDis*2+btnBorderDis*2+btnHeight);
    }

    bg.addChild(mask);
    bg.addChild(v1);
    v1.addChild(t1);

    mask.aniByAlpha(.1,maskAlpha,null);
    v1.aniByAlpha(.2,1,null);
    v1.ani_y(.2,v1.top()-50,false,null,null);

    function addBtnByCount(v) {
        var dis = 6;
        var colorGreen = "23b574";
        var colorBlue = "23b5b3";
        var colorOver = "009653";
        var colorDown = "ffa800";
        var btnTextSize = 26;
        var btnCornerR = 6;
        switch(v) {
            case 1:
                var b1 = new Sprite();
                b1.initBtn("確 定");
                b1.bottom(dis);
                b1.left(dis);
                b1.width(v1.width()-dis*2);
                b1.height(btnHeight);
                b1.colorHex(colorGreen);
                b1.cornerRadius(btnCornerR);
                b1.textColor("ffffff");
                b1.textSize(btnTextSize);
                b1.addMouseOver(function () {
                    b1.colorHex(colorOver);
                });
                b1.addMouseOut(function () {
                    b1.colorHex(colorGreen);
                });
                b1.addMouseDown(function () {
                    b1.colorHex(colorDown);
                });
                b1.addMouseUp(function () {
                    b1.colorHex(colorGreen);
                });
                b1.addMouseClick(function () {
                    if( isInputFuncType(onBtnOK) ) {
                        onBtnOK();
                    }
                    fadeOutAndRemove();
                });
                v1.addChild(b1);
                break;
            case 2:
                var b2 = new Sprite();
                b2.initBtn("確 定");
                b2.bottom(dis);
                b2.right(dis);
                b2.width(v1.width()/2-dis*1.5);
                b2.height(btnHeight);
                b2.colorHex(colorGreen);
                b2.cornerRadius(btnCornerR);
                b2.textColor("ffffff");
                b2.textSize(btnTextSize);
                b2.addMouseOver(function () {
                    b2.colorHex(colorOver);
                });
                b2.addMouseOut(function () {
                    b2.colorHex(colorGreen);
                });
                b2.addMouseDown(function () {
                    b2.colorHex(colorDown);
                });
                b2.addMouseUp(function () {
                    b2.colorHex(colorGreen);
                });
                b2.addMouseClick(function () {
                    if( isInputFuncType(onBtnOK) ) {
                        onBtnOK();
                    }
                    fadeOutAndRemove();
                });
                v1.addChild(b2);
                var b3 = new Sprite();
                b3.initBtn("取 消");
                b3.bottom(dis);
                b3.left(dis);
                b3.width(v1.width()/2-dis*1.5);
                b3.height(btnHeight);
                b3.colorHex(colorBlue);
                b3.cornerRadius(btnCornerR);
                b3.textColor("ffffff");
                b3.textSize(btnTextSize);
                b3.addMouseOver(function () {
                    b3.colorHex("1a878b");
                });
                b3.addMouseOut(function () {
                    b3.colorHex(colorBlue);
                });
                b3.addMouseDown(function () {
                    b3.colorHex(colorDown);
                });
                b3.addMouseUp(function () {
                    b3.colorHex(colorBlue);
                });
                b3.addMouseClick(function () {
                    if( isInputFuncType(onBtnCancel) ) {
                        onBtnCancel();
                    }
                    fadeOutAndRemove();
                });
                v1.addChild(b3);
                break;
        }
    }
    if( isInputValid(onBtnOK) && isInputValid(onBtnCancel)&&isInputFuncType(onBtnCancel) ) {
        addBtnByCount(2);
    } else {
        addBtnByCount(1);
    }

}

/*********************************************************************
 * TipBox
 * --------------------------
 * EX: new TipBox({triDirection:0,x:100,y:100,w:400,h:100,triangleW:30,triangleH:20,
    bgColor:'009900',cornerR:10,tip:'EARTH SPOT=love愛地球',textColor:'ffffff',textSize:'25',
    isTriTopPos:true,isShadow:true,shadowDis:22,shadowAlpha:.7});
 *
 * Triangle-Direction: 0-North,1-East,2-South,3-West
 *********************************************************************/
function TipBox(v) {

    var xx = useFuncInputOrDefault(v,'x',100);
    var yy = useFuncInputOrDefault(v,'y',100);
    var ww = useFuncInputOrDefault(v,'w',200);
    var hh = useFuncInputOrDefault(v,'h',50);
    //----- triangle's direction:north,east,south,west / 0,1,2,3 -----//
    var triDirection = useFuncInputOrDefault(v,'triDirection',0);
    //----- shape triangle -----//
    var triangleW = useFuncInputOrDefault(v,'triangleW',20);
    var triangleH = useFuncInputOrDefault(v,'triangleH',10);
    var bgColor = useFuncInputOrDefault(v,'bgColor','4e886f');
    var cornerR = useFuncInputOrDefault(v,'cornerR',7);
    var tip = useFuncInputOrDefault(v,'tip','MESSAGE HERE');
    var textColor = useFuncInputOrDefault(v,'textColor','ffffff');
    var textSize = useFuncInputOrDefault(v,'textSize','20');
    //----- let x,y pos become tip-box's triangle top position -----//
    var isTriTopPos = useFuncInputOrDefault(v,'isTriTopPos',true);
    //----- add shadow here -----//
    var isShadow = useFuncInputOrDefault(v,'isShadow',false);
    var shadowDis = useFuncInputOrDefault(v,'shadowDis',15);
    var shadowAlpha = useFuncInputOrDefault(v,'shadowAlpha',.8);
    //----- room space for adding shadow on bgCorner -----//
    var shadowSpace = isInputValid(v)&&isInputValid(v.shadowDis)?v.shadowDis*2:20;


    var bgRoot = new Sprite();
    bgRoot.initDiv();
    bgRoot.frame(xx,yy,ww+shadowSpace,hh+shadowSpace);
    //----- DEBUG USAGE -----//
//        bgRoot.colorHex('000000');bgRoot.alpha(.5);
    //----- DEBUG USAGE -----//

    var bgCorner = new Sprite();
    bgCorner.initDiv();
    bgCorner.frame(0,0,ww,hh);
    bgCorner.colorHex(bgColor);
    bgCorner.cornerRadius(cornerR);
    bgRoot.addChild(bgCorner);

    var shapeTri = new Sprite();
    shapeTri.initTriangle(null,triangleW,triangleH,bgColor);
    //----- DEBUG USAGE -----//
//        shapeTri.colorHex('000099');
    //----- DEBUG USAGE -----//
    //----- set rotate's origin to left-top corner -----//
    shapeTri.obj.style.cssText += 'transform-origin:0% 0%;';
    bgRoot.addChild(shapeTri);
    switch( triDirection ) {
        case 0:     // N
            bgRoot.height(triangleH+hh+shadowSpace);
            shapeTri.rotate(0);
            shapeTri.top(shadowSpace/2);
            shapeTri.left(bgRoot.width()/2-triangleW/2);
            bgCorner.top(shapeTri.top()+triangleH);
            bgCorner.left(shadowSpace/2);
            letTriangleTopBecomeXYPos(0);
            break;
        case 1:     // E
            bgRoot.width(shadowSpace+ww+triangleH);
            shapeTri.rotate(90);
            shapeTri.left(bgRoot.width()-shadowSpace/2);shapeTri.top(bgRoot.height()/2-triangleW/2);
            bgCorner.left(shadowSpace/2);bgCorner.top(shadowSpace/2);
            letTriangleTopBecomeXYPos(1);
            break;
        case 2:     // S
            bgRoot.height(shadowSpace+hh+triangleH);
            bgCorner.left(shadowSpace/2);bgCorner.top(shadowSpace/2);
            shapeTri.rotate(180);
            shapeTri.top(bgRoot.height()-shadowSpace/2);
            shapeTri.left(bgRoot.width()/2+triangleW/2);
            letTriangleTopBecomeXYPos(2);
            break;
        case 3:     // W
            bgRoot.width(shadowSpace+ww+triangleH);
            shapeTri.rotate(-90);
            shapeTri.left(shadowSpace/2);
            shapeTri.top(bgRoot.height()/2+triangleW/2);
            bgCorner.left(triangleH+shadowSpace/2);
            bgCorner.alignCenterVertical();
            letTriangleTopBecomeXYPos(3);
            break;
    }

    var text = new Sprite();
    text.initDiv();
    text.frame(0,0,bgCorner.width(),bgCorner.height());
    text.applyText(tip);
    text.makeCursorNormal(false);
    text.textColor(textColor);
    text.textSize(textSize);
    text.textAlignCenter();
    bgCorner.addChild(text);


    function letTriangleTopBecomeXYPos(v) {
        if( isTriTopPos ) {
            switch (v) {
                case 0:
                    bgRoot.left(xx-bgRoot.width()/2);
                    bgRoot.top(bgRoot.top()-shadowSpace/2);
                    break;
                case 1:
                    bgRoot.top(bgRoot.top()-bgRoot.height()/2);
                    bgRoot.left(bgRoot.left()-(shadowSpace/2+bgCorner.width()+triangleH));
                    break;
                case 2:
                    bgRoot.top(bgRoot.top()-(shadowSpace/2+bgCorner.height()+triangleH));
                    bgRoot.left(bgRoot.left()-bgRoot.width()/2);
                    break;
                case 3:
                    bgRoot.top(bgRoot.top()-bgRoot.height()/2);
                    bgRoot.left(bgRoot.left()-shadowSpace/2);
                    break;
            }
        }
    }

    //----- add shadow here -----//
    if( isShadow ) {
        bgCorner.shadow(0,0,shadowDis,shadowAlpha);
    }

    this.bg = bgRoot;
    //----- END OF TIP -----//
}