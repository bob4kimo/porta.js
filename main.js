




/**--------------------------------------------------------------------------------------
 * Entry Point - main execution start from here
---------------------------------------------------------------------------------------*/
var textBcoreJs = getBcoreJsText();
textBcoreJs = deleteAllCommentForStr(textBcoreJs);
textBcoreJs = deleteAllEmptyLineForStr(textBcoreJs);
log( getCoreProtoNameArr(textBcoreJs) );
// showResultOnScreen( textBcoreJs );

// NEXT: randomArr may use base64 encode char
// NEXT: first do encode within func's var







/**--------------------------------------------------------------------------------------
 * Remove all empty-line in target string
 ---------------------------------------------------------------------------------------*/
function deleteAllEmptyLineForStr(str) {
    // separate string into array by diff-line(\n), so each line will be single item
    var arrStr = str.split('\n');
    // remove item from array if it is an empty-line
    for( var i=0; i<arrStr.length; i++ ) {
        if( arrStr[i].length < 1 ) {
            arrStr.splice(i,1);
            // re-check same index item again, otherwise some item may miss
            i--;
        }
    }
    // re-combine array into single string
    return arrStr.join('\n');
}
/**--------------------------------------------------------------------------------------
 * Remove all line-comment in target string
 ---------------------------------------------------------------------------------------*/
function deleteAllCommentForStr(str) {

    while(str.indexOf('//')!==-1){
        str = deleteStrBtwKeywords(str,'//','\n');
    }

    while(str.indexOf('/*')!==-1){
        str = deleteStrBtwKeywords(str,'/*','*/');
    }

    return str;
}
/**--------------------------------------------------------------------------------------
 * Delete chars between key_start and key_end, all string-area will deleted without space
 ---------------------------------------------------------------------------------------*/
function deleteStrBtwKeywords(str,key_start,key_end) {
    var keyword     = key_start;
    var keyword_end = key_end;
    // get keyword and keyword_end's char index
    var indexFrom = str.indexOf(keyword);
    var indexTo = 0;
    var searchRange = 2500;
    // if keyword_end's string length more than 1 search-way will diff, so we need record here
    var keyword_end_length = keyword_end.length>1?keyword_end.length:0;
    // find keyword_end's char-index starts from indexFrom's index
    for( var i = indexFrom; i<indexFrom+searchRange; i++ ) {
        var searchStr = '';
        // when search-target's str-length more than 1, then we need to combine chars in loop
        if( keyword_end_length>1 ) {
            // when we need to find '*/' in looping chars, str[i] will appear '*' only,
            // based on keyword_end's str-length, searchStr=str[i]+str[i+1]+str[i+2]...
            for( var j=0; j<keyword_end_length; j++ ) {
                searchStr += str[i+j];
            }
        } else {
            // when our search-target in loop has only 1 char, then str[i] will be fine
            searchStr = str[i];
        }
        // char matches keyword_end, save with char-index it is
        if( searchStr === keyword_end ) {
            // +1 means all line will be delete, not just left single empty-line
            // +keyword_end_length means when keyword's str-length more than 1,
            // then we need to include them into count also, otherwise some ending-chars
            // will not be deleted in result
            indexTo = i+1+keyword_end_length;
            break;
        }
    }
    return deleteCharFromIndex(str,indexFrom,indexTo);
}
/**--------------------------------------------------------------------------------------
 * Chars between fromIndex and toIndex will be deleted from originalStr
 ---------------------------------------------------------------------------------------*/
function deleteCharFromIndex(originalStr,fromIndex,toIndex) {
    return originalStr.replace(originalStr.substring(fromIndex, toIndex), "");
}





/**--------------------------------------------------------------------------------------
 * Get all keyword's index from target string return array format, target must perfect
 * match to keyword.
 * -------------------------------------------------------------------------------------
 * var str = 'apple.wds;applef;sapple;napplek;apple';
 * log( getKeywordIndexArrFromStr(str,'apple') );     // [0,32]
 ---------------------------------------------------------------------------------------*/
function getKeywordIndexArrFromStr(originalStr, keyword) {
    //----- DEPRECATED -------
    // for (var pos = str.indexOf(keyword); pos !== -1; pos = str.indexOf(keyword, pos + 1)) {
    //     arrKeywordIndex.push(pos);
    //----- DEPRECATED -------

    // array for recording index, return answer
    var arrKeywordIndex = [];
    // copy original string to temp, temp-str will do some modify, content will change
    var tempStr = originalStr;
    // regular expression for perfect match keyword
    var regex = new RegExp('\\b' + keyword + '\\b');
    // for blocking the keyword we already in count
    var keywordMask = '';
    // generate keyword-mask, for blocking the keyword in string
    for( var i=0; i<keyword.length; i++ ) {
        keywordMask += 'x';
    }

    // for recording current keyword-index
    var keywordIndex = -1;
    // search whole string to find keyword-index, if exist save index to var and return true
    function isKeywordInsideStr(str) {
        keywordIndex = str.search(regex);
        return keywordIndex>-1;
    }

    // when there is still keyword inside tempStr, keep searching
    while( isKeywordInsideStr(tempStr) ) {
        // keyword-index exist, save into array
        arrKeywordIndex.push(keywordIndex);
        // overwrite keyword to "keywordMask", so searching will not find repeated index,
        // this index we have saved it, break-down this keyword and looping will find next new index
        tempStr = replaceStrAt(tempStr,keywordIndex,keyword,keywordMask);
    }

    return arrKeywordIndex;
}





/**--------------------------------------------------------------------------------------
 * Replace keyword to new one in string
 * -------------------------------------------------------------------------------------
 * originalStr: ur main string
 * startIndex:  replace-target's char index
 * targetStr:   replace-target's string
 * replaceStr:  new string we are going to replaced
 * -------------------------------------------------------------------------------------
 * var mainStr = 'This is an apple.';
 * log( replaceStrAt(mainStr,11,'apple','orange') );      // This is an orange.
 ---------------------------------------------------------------------------------------*/
function replaceStrAt(originStr, startIndex, targetStr, replaceStr) {
    var charSpace = targetStr.length;
    return originStr.substring(0, startIndex) + replaceStr + originStr.substring(startIndex + charSpace, originStr.length);
}





/**--------------------------------------------------------------------------------------
 * Make random-name array for replacing function or variable, return name array
 * --------------------------------------------------------------------------------------
 * nameLength: each name's length, ex:nameLength=2 name=xx, nameLength=3 name=xxx
 * arrCount: how many name in this arr u are going to make
---------------------------------------------------------------------------------------*/
function getRandomNameArr(nameLength, arrCount) {
    //----- we have 52 chars in arr, random-name's char will based on those chars -----//
    var arrAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    //----- make sure target-string do not exist in this arr -----//
    function isStrInsideArr(arr, targetStr) {
        var isFound = false;
        for (var i = 0; i < arr.length && !isFound; i++) {
            if (arr[i] === targetStr) {
                isFound = true;
            }
        }
        return isFound;
    }
    //----- get a random int from a range, ex:0~51 for arrAlphabet ------//
    function getRandomIntBetween(start, end) {
        return Math.floor(Math.random() * end) + start;
    }
    //----- get a random alphabet-char from arrAlphabet ------//
    function getRandomAlphabet() {
        return arrAlphabet[getRandomIntBetween(0, 51)];
    }
    //----- get a random string by str-length, if length=2, ans=as,jy,wp... ------//
    function getRandomNameByLength(length) {
        var ans = '';
        for (var i = 0; i < length; i++) {
            ans = ans.concat(getRandomAlphabet());
        }
        return ans;
    }
    
    var arr = [];
    for (var i = 0; i < arrCount; i++) {
        var name = getRandomNameByLength(nameLength);
        //----- make sure new-name always new not repeated -----//
        if (!isStrInsideArr(arr, name)) {
            arr.push(name);
        } else {
            //----- if name repeated, get a new random again -----//
            i--;
        }
    }
    return arr;
}



/**--------------------------------------------------------------------------------------
 * Get all prototype's name from core-js, save all names into array
 ---------------------------------------------------------------------------------------*/
function getCoreProtoNameArr(originalStr) {
    var arrTemp1 = [];
    var arrTemp2 = [];
    arrTemp1 = originalStr.split('\n');
    arrTemp1.forEach(function (v) {
        if (v.indexOf('Sprite.prototype.') === 0) {
            arrTemp2.push(v);
        }

    });
    arrTemp1 = [];
    arrTemp2.forEach(function (v) {
        arrTemp1.push(v.split('Sprite.prototype.')[1]);
    });
    arrTemp2 = [];
    arrTemp1.forEach(function (v) {
        arrTemp2.push(v.split(' =')[0]);
    });
    return arrTemp2;
}
/**--------------------------------------------------------------------------------------
 * Get all function's name from core-js, save all names into array
 ---------------------------------------------------------------------------------------*/
function getCoreFuncNameArr(originalStr) {
    var arrTemp1 = [];
    var arrTemp2 = [];
    var tempVar1 = '';
    var tempVar2 = '';
    //----- extra all function name without prototype-name -----//
    arrTemp1 = originalStr.split('\n');
    arrTemp1.forEach(function (v) {
        //----- extract which 'function' on the head of string -----//
        if (v.indexOf('function') === 0) {
            arrTemp2.push(v);
        }
    });
    arrTemp1 = [];
    arrTemp2.forEach(function (v) {
        tempVar1 = v.split('(')[0];
        tempVar2 = tempVar1.split(' ')[1];
        arrTemp1.push(tempVar2);
    });
    return arrTemp1;
}











function getKeywordNextChar(allString, keyword, keywordIndex) {
    //        return allString.substring(keywordIndex+keyword.length,keywordIndex+keyword.length+1);
    var ans = '';
    var scanCharDis = 10;
    var keywordLength = keyword.length;
    var arr = [];
    for (var i = 0; i < scanCharDis; i++) {
        arr.push(allString.substring(keywordIndex + keywordLength, keywordIndex + keywordLength + 1 + i))
    }
    for (i = 0; i < arr.length; i++) {
        var v = arr[i];
        //----- when char not 'space' and 'changeLine' -----//
        if (!(v.indexOf(' ') > -1) && !(v.indexOf('\n') > -1) && !(v.indexOf('-') > -1)) {
            ans = v;
            break;
        }
    }
    //        log(ans);
    return ans;
}

function getKeywordPreviousChar(allString, keywordIndex) {
    //        return allString.substring(keywordIndex - 1, keywordIndex);
    var ans = '';
    var scanCharDis = 50;
    var arr = [];
    for (var i = 0; i < scanCharDis; i++) {
        if (i > 0)
            arr.push(allString.substring(keywordIndex - (i), keywordIndex));
    }
    for (i = 0; i < arr.length; i++) {
        var v = arr[i];
        //----- when char not 'space' and 'changeLine' -----//
        if (!(v.indexOf(' ') > -1) && !(v.indexOf('\n') > -1) && !(v.indexOf('-') > -1) && v.length > 0) {
            ans = v;
            break;
        }
    }
    return ans;
}

function encryptBcoreJs(localFile, func) {

    //----- core's all keyword -----//
    var arr1 = getCoreFuncNameArr();
    var arr2 = getCoreProtoNameArr();
    arr1.push.apply(arr1, arr2);

    func(arr1);














}

function encryptTargetJs(localFile, arrBcoreKeyWords) {

    var arrTemp1 = getNoRepeatVarNameArr2();
    var arrNewName = getRandomNameArr(3, arrTemp1.length);
    var countIndex = 0;
    arrTemp1.forEach(function (v) {
        while (getNextValidKeywordIndex(v) > 0) {
            var targetIndex = getNextValidKeywordIndex(v);
            localFile = replaceStrAt(localFile, targetIndex, v, arrNewName[countIndex]);
        }
        countIndex++;
    });
    log(localFile);



    //----- sometime indexOf() finds keyword is not valid -----//
    function isKeywordValid(allStr, keywordIndex, keyword) {
        var ans = true;

        var charL = getKeywordPreviousChar(allStr, keywordIndex);
        var charR = getKeywordNextChar(allStr, keyword, keywordIndex);

        function isCharLAlphabet() {
            return isCharAlphabet(charL);
        }

        function isCharRAlphabet() {
            return isCharAlphabet(charR);
        }

        function isCharLQMark() {
            return (charL === '"');
        }

        function isCharRQMark() {
            return (charR === '"');
        }

        if (isCharLAlphabet() || isCharRAlphabet() || isCharLQMark() || isCharRQMark())
            ans = false;

        return ans;
    }



    function getNextValidKeywordIndex(keyword) {
        //----- if we can not find any valid keyword, return -1 -----//
        var ansIndex = -1;

        var targetIndex = localFile.indexOf(keyword);

        if (isKeywordValid(localFile, targetIndex, keyword)) {
            ansIndex = targetIndex;
        }

        return ansIndex;
    }




    //----- get var-name and not-repeat with bcore's keywords -----//
    function getNoRepeatVarNameArr2() {
        var arrTemp1 = getNoRepeatVarNameArr();
        var arrTemp2 = [];
        arrTemp1.forEach(function (v) {
            if (!isStrInsideArr(arrBcoreKeyWords, v)) {
                arrTemp2.push(v);
            }
        });
        return arrTemp2;
    }



    //----- FINAL: best way to get var-name array without lost -----//
    function getNoRepeatVarNameArr() {
        var arrTemp1 = [];
        var arrTemp2 = [];
        var arrTemp3 = [];
        var arrTemp4 = [];
        var countIndex = 0;
        var tempVar = '';
        arrTemp1 = localFile.split('var ');
        arrTemp1.forEach(function (v) {
            //----- if each string contains '=', means this could be var -----//
            if (v.indexOf('=') > -1) {
                arrTemp2.push(v);
            }
        });
        arrTemp2.forEach(function (v) {
            //----- when first 3 of index contain alphabet char, means could be var -----//
            if (isCharAlphabet(v[0]) && isCharAlphabet(v[1]) && isCharAlphabet(v[2])) {
                arrTemp3.push(v);
            }
        });
        arrTemp3.forEach(function (v) {
            //----- get string before '=' -----//
            arrTemp4.push(v.split(' =')[0]);
        });
        arrTemp4.forEach(function (v) {
            //----- remove ';' and after string -----//
            if (v.indexOf(';') > -1) {
                tempVar = v.split(';')[0];
                delete arrTemp4[countIndex];
                arrTemp4[countIndex] = tempVar;
            }
            countIndex++;
        });
        arrTemp3 = [];
        arrTemp4.forEach(function (v) {
            if (!isStrInsideArr(arrTemp3, v)) {
                arrTemp3.push(v);
            }
        });

        return arrTemp3;
    }
}






/**--------------------------------------------------------------------------------------
 * According to load text file from local having security problems, static js from here
---------------------------------------------------------------------------------------*/
function getBcoreJsText() {
    var ss = 'CgpmdW5jdGlvbiBnZXRPYmoobmFtZSkgewogICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lKTsKfQoKZnVuY3Rpb24gbG9nKG1zZykgewogICAgY29uc29sZS5sb2cobXNnKTsKfQoKZnVuY3Rpb24gaXNJbnB1dFZhbGlkKHYpIHsKICAgIHJldHVybiAodiE9PXVuZGVmaW5lZCAmJiB2IT09bnVsbCk7Cn0KLyoqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQogKiBDaGVjayBmdW5jdGlvbidzIGlucHV0IHZhbGlkIG9yIG5vdCwgYnJpbmcgaW5wdXQgaW50byBsb2NhbC12YXIgb3IgdXNlIGRlZmF1bHQtdmFsdWUKICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQogKiBFeDp2YXIgeHggPSB1c2VGdW5jSW5wdXRPckRlZmF1bHQodiwneCcsMTAwKTsKICogQSkgdiBpcyBmdW5jdGlvbidzIGlucHV0LCBqc29uLWZvcm1hdCwgZXg6ZnVuYyh2KXsuLi59LGZ1bmMoe3g6MTAseToxMH0pOwogKiBCKSAneCcgbWVhbnMgdidzIGNoaWxkLW5vZGUncyBuYW1lLCBzdHJpbmctZm9ybWF0CiAqIEMpIDEwMCBtZWFucyB0aGlzIHZhcidzIGRlZmF1bHQtdmFsdWUsIHdoZW4gaW5wdXQgaW52YWxpZCBvciB1bmRlZmluZWQsIHdpbGwgYnJpbmcKICogZGVmYXVsdC12YWx1ZSBpbnRvIHRoaXMgdmFyCiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qLwpmdW5jdGlvbiB1c2VGdW5jSW5wdXRPckRlZmF1bHQoaW5wdXQsaW5wdXRDaGlsZE5hbWUsZGVmKSB7CiAgICAvKiotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCiAgICAgKiBBKSBGaXJzdCB3ZSBtdXN0IGNoZWNrIGlzICJpbnB1dCIgYSB2YWxpZCBvYmplY3QsIGlucHV0IG1heSB1bmRlZmluZWQKICAgICAqIEIpIElmICJpbnB1dCIgaXMgbm90IGEgdmFsaWQgb2JqZWN0LCB0aGFuIHdlIHJldHVybiBiYWNrIGRlZmF1bHQtdmFsdWUKICAgICAqIEMpIFdlIHdhbnQgdG8gY2hlY2sgaXMgb3VyIGNoaWxkLW5vZGUgZXhpc3Qgb3Igbm90LCBidXQgd2UgY2FuIG5vdCB1c2UKICAgICAqIGNoaWxkLW5vZGUgYXMgYSBwYXJhbWV0ZXIgaW4gdGhpcyBmdW5jLCBleDp1c2VGdW5jSW5wdXRPckRlZmF1bHQodix2LngsZGVmKSwKICAgICAqIGl0IHdpbGwgY2F1c2UgZXJyb3Igd2hlbiAidi54IiBkbyBub3QgZXhpc3QKICAgICAqIEQpIFNvIHdlIG5lZWQgY29udmVydCAiaW5wdXQiIGludG8ganNvbi1zdHJpbmcsIGV4OkpTT04uc3RyaW5naWZ5KGlucHV0KQogICAgICogRSkgVGhlbiB3ZSBjaGVjayBpcyBjaGlsZC1ub2RlICJ4IiBleGlzdCBpbiBqc29uLXN0cmluZwogICAgICogRikganNvblN0ci5pbmRleE9mKGlucHV0Q2hpbGROYW1lKyciOicpPi0xID09IHRydWUgbWVhbnMgY2hpbGQtbm9kZSAieCIgZXhpc3QKICAgICAqIEcpIFRoZW4gd2UgY29udmVydCBqc29uLXN0cmluZyBiYWNrIHRvIGpzb24tb2JqZWN0IGFuZCBhY2Nlc3MgdG8gY2hpbGQtbm9kZQogICAgICogd2l0aG91dCBlcnJvciwgZXg6KG5ldyBGdW5jdGlvbigncmV0dXJuJyArIGpzb25TdHIrJy4nK2lucHV0Q2hpbGROYW1lKSkoKQogICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovCiAgICB2YXIganNvblN0ciA9IEpTT04uc3RyaW5naWZ5KGlucHV0KTsKICAgIHJldHVybiBpc0lucHV0VmFsaWQoaW5wdXQpJiZqc29uU3RyLmluZGV4T2YoJyInK2lucHV0Q2hpbGROYW1lKyciOicpPi0xPyhuZXcgRnVuY3Rpb24oJ3JldHVybicgKyBqc29uU3RyKycuJytpbnB1dENoaWxkTmFtZSkpKCk6ZGVmOwp9CgpmdW5jdGlvbiBpc0lucHV0Qm9vbGVhbih2KSB7CiAgICByZXR1cm4gKHYhPT11bmRlZmluZWQgJiYgdiE9PW51bGwgJiYgdHlwZW9mIHY9PT0nYm9vbGVhbicpOwp9CgpmdW5jdGlvbiBpc0lucHV0T2JqZWN0KHYpIHsKICAgIHJldHVybiAoIHYhPT11bmRlZmluZWQgJiYgdiE9PW51bGwgJiYgdHlwZW9mIHY9PT0nb2JqZWN0JyApOwp9CgpmdW5jdGlvbiBpc0lucHV0U3RyaW5nKHYpIHsKICAgIHJldHVybiAoIHYhPT11bmRlZmluZWQgJiYgdiE9PW51bGwgJiYgdHlwZW9mIHY9PT0nc3RyaW5nJyAmJiB2Lmxlbmd0aCE9PTAgKTsKfQoKZnVuY3Rpb24gaXNJbnB1dEZ1bmNUeXBlKHYpIHsKICAgIHZhciBnZXRUeXBlID0ge307CiAgICByZXR1cm4gKCB2ICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbCh2KSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJyApOwp9CgpmdW5jdGlvbiBpc0lucHV0QXJyYXkodikgewogICAgdmFyIGdldFR5cGUgPSB7fTsKICAgIHJldHVybiAoIHYgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKHYpID09PSAnW29iamVjdCBBcnJheV0nICk7Cn0KCgovLy0tLS0tLS0tLS0tLS0gU1BSSVRFIENMQVNTIC0tLS0tLS0tLS0tLS0tLS0vLwpmdW5jdGlvbiBTcHJpdGUoKSB7Cn0KClNwcml0ZS5wcm90b3R5cGUuaW5pdERpdiA9IGZ1bmN0aW9uKGlkTmFtZSkgewogICAgdGhpcy5vYmogPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsKICAgIHRoaXMub2JqLmlkID0gaWROYW1lOwogICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAncG9zaXRpb246YWJzb2x1dGU7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDsnOwogICAgdGhpcy5tYXNrT3ZlcmZsb3codHJ1ZSk7CiAgICB0aGlzLm1ha2VDdXJzb3JOb3JtYWwoKTsKICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5vYmopOwogICAgcmV0dXJuIHRoaXMub2JqOwp9OwpTcHJpdGUucHJvdG90eXBlLmNzc1RleHQgPSBmdW5jdGlvbihjc3NTdHIpIHsKICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gY3NzU3RyOwp9OwpTcHJpdGUucHJvdG90eXBlLmFwcGx5WkluZGV4ID0gZnVuY3Rpb24oekluZGV4KSB7CiAgICAvLy0tLS0tIGFjY29yZGluZyB0byBzYWZhcmkgdjMuMCwgei1pbmRleCByYW5nZTptaW46LTE2Nzc3MjcxLG1heDoxNjc3NzI3MSAtLS0tLS8vCiAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICJ6LWluZGV4OiIrekluZGV4KyI7IjsKfTsKU3ByaXRlLnByb3RvdHlwZS5pbml0VGV4dCA9IGZ1bmN0aW9uIChpZE5hbWUsdGV4dFN0cmluZykgewogICAgdGhpcy5vYmogPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsKICAgIHRoaXMub2JqLmlkID0gaWROYW1lOwogICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAncG9zaXRpb246YWJzb2x1dGU7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDt3aGl0ZS1zcGFjZTpub3dyYXA7JzsKICAgIHRoaXMubWFza092ZXJmbG93KHRydWUpOwogICAgdGhpcy5tYWtlQ3Vyc29yTm9ybWFsKCk7CiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMub2JqKTsKICAgIHRoaXMub2JqLmlubmVySFRNTCA9IHRleHRTdHJpbmc7CiAgICByZXR1cm4gdGhpcy5vYmo7Cn07ClNwcml0ZS5wcm90b3R5cGUuaW5pdEJ0biA9IGZ1bmN0aW9uIChidG5UaXRsZVN0cikgewogICAgdGhpcy5vYmogPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTsKICAgIGlmKCBpc0lucHV0U3RyaW5nKGJ0blRpdGxlU3RyKSApCiAgICAgICAgdGhpcy5vYmouaW5uZXJIVE1MID0gYnRuVGl0bGVTdHI7CiAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICJwb3NpdGlvbjphYnNvbHV0ZTtib3JkZXI6bm9uZTtvdXRsaW5lOm5vbmU7b3ZlcmZsb3c6aGlkZGVuO2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7IjsKICAgIHRoaXMubWFrZUN1cnNvck5vcm1hbCgpOwogICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm9iaik7CiAgICByZXR1cm4gdGhpcy5vYmo7Cn07ClNwcml0ZS5wcm90b3R5cGUuaW5pdFRleHRBcmVhID0gZnVuY3Rpb24gKGlkTmFtZSkgewogICAgdGhpcy5vYmogPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpOwogICAgdGhpcy5vYmouaWQgPSBpZE5hbWU7CiAgICB0aGlzLm9iai5zcGVsbGNoZWNrID0gZmFsc2U7CiAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICdwb3NpdGlvbjphYnNvbHV0ZTtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50O3Jlc2l6ZTpub25lO2JvcmRlcjpub25lO2JveC1zaXppbmc6Ym9yZGVyLWJveDsnOwogICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm9iaik7CiAgICByZXR1cm4gdGhpcy5vYmo7Cn07ClNwcml0ZS5wcm90b3R5cGUudGV4dEFyZWFGb2N1cyA9IGZ1bmN0aW9uKCkgewogICAgdGhpcy5vYmouZm9jdXMoKTsKfTsKU3ByaXRlLnByb3RvdHlwZS5ub3RGb2N1cyA9IGZ1bmN0aW9uKCkgewogICAgdGhpcy5vYmouYmx1cigpOwp9OwpTcHJpdGUucHJvdG90eXBlLmdldFRleHRBcmVhVGV4dCA9IGZ1bmN0aW9uICgpIHsKICAgIHJldHVybiB0aGlzLm9iai52YWx1ZTsKfTsKU3ByaXRlLnByb3RvdHlwZS50ZXh0QXJlYUVtcHR5ID0gZnVuY3Rpb24gKCkgewogICAgdGhpcy5vYmoudmFsdWUgPSAnJzsKfTsKU3ByaXRlLnByb3RvdHlwZS5zZXRUZXh0QXJlYVRleHQgPSBmdW5jdGlvbiAodikgewogICAgaWYoaXNJbnB1dFN0cmluZyh2KSkKICAgICAgICB0aGlzLm9iai52YWx1ZSA9IHY7Cn07ClNwcml0ZS5wcm90b3R5cGUudGV4dEFyZWFQYWRkaW5nID0gZnVuY3Rpb24gKHBhZGRpbmdQeFN0cikgewogICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAicGFkZGluZzoiK3BhZGRpbmdQeFN0cisicHg7IjsKfTsKU3ByaXRlLnByb3RvdHlwZS5oaWRkZW4gPSBmdW5jdGlvbiAoaXNIaWRkZW4pIHsKICAgIGlmKCBpc0hpZGRlbiApIHsKICAgICAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICJ2aXNpYmlsaXR5OmhpZGRlbjsiOwogICAgfSBlbHNlIHsKICAgICAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICJ2aXNpYmlsaXR5OnZpc2libGU7IjsKICAgIH0KICAgIGlmKCBpc0hpZGRlbj09PXVuZGVmaW5lZCB8fCBpc0hpZGRlbj09PW51bGwgKSB7CiAgICAgICAgcmV0dXJuIHRoaXMub2JqLnN0eWxlLnZpc2liaWxpdHk7CiAgICB9Cn07Ci8vLS0tLS0gbWFzayBhbGwgY2hpbGQgd2hpY2ggb3ZlciB0aGlzIGRpdiBhcmVhIC0tLS0tLy8KU3ByaXRlLnByb3RvdHlwZS5tYXNrT3ZlcmZsb3cgPSBmdW5jdGlvbihpc01hc2spIHsKICAgIGlmICggaXNNYXNrICkgewogICAgICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gIm92ZXJmbG93OmhpZGRlbjsiOwogICAgfSBlbHNlIHsKICAgICAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICJvdmVyZmxvdzp2aXNpYmxlOyI7CiAgICB9Cn07Ci8vLS0tLS0gbGV0IHRoaXMgZGl2IGFwcGVhciBzY3JvbGwtYmFyIHdoZW4gY29udGVudCBleHRlbmRzIGRpdidzIGhlaWdodCAtLS0tLS8vClNwcml0ZS5wcm90b3R5cGUuc2Nyb2xsVmVydGljYWwgPSBmdW5jdGlvbih2KSB7CiAgICBpZighaXNJbnB1dEJvb2xlYW4odil8fHY9PT10cnVlKSB7CiAgICAgICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAib3ZlcmZsb3cteTphdXRvOyI7CiAgICB9IGVsc2UgewogICAgICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gIm92ZXJmbG93LXk6aGlkZGVuOyI7CiAgICB9Cn07ClNwcml0ZS5wcm90b3R5cGUuc2Nyb2xsSG9yaXpvbnRhbCA9IGZ1bmN0aW9uKHYpIHsKICAgIGlmKCFpc0lucHV0Qm9vbGVhbih2KXx8dj09PXRydWUpIHsKICAgICAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICJvdmVyZmxvdy14OmF1dG87IjsKICAgIH0gZWxzZSB7CiAgICAgICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAib3ZlcmZsb3cteDpoaWRkZW47IjsKICAgIH0KfTsKU3ByaXRlLnByb3RvdHlwZS5pZCA9IGZ1bmN0aW9uKGlkTmFtZSkgewogICAgaWYgKGlkTmFtZSE9PXVuZGVmaW5lZCkgewogICAgICAgIHRoaXMub2JqLmlkID0gaWROYW1lOwogICAgfSBlbHNlIHsKICAgICAgICByZXR1cm4gdGhpcy5vYmouaWQ7CiAgICB9Cn07ClNwcml0ZS5wcm90b3R5cGUuZnJhbWUgPSBmdW5jdGlvbihsZWZ0LHRvcCx3aWR0aCxoZWlnaHQscmlnaHQsYm90dG9tKSB7CgogICAgdGhpcy5sZWZ0KGxlZnQpOwogICAgdGhpcy50b3AodG9wKTsKICAgIHRoaXMud2lkdGgod2lkdGgpOwogICAgdGhpcy5oZWlnaHQoaGVpZ2h0KTsKICAgIHRoaXMucmlnaHQocmlnaHQpOwogICAgdGhpcy5ib3R0b20oYm90dG9tKTsKfTsKClNwcml0ZS5wcm90b3R5cGUubGVmdCA9IGZ1bmN0aW9uKGxlZnQpIHsKICAgIGlmKCBsZWZ0IT09dW5kZWZpbmVkICkgewogICAgICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gKHR5cGVvZiBsZWZ0ID09PSAic3RyaW5nIik/J2xlZnQ6JytsZWZ0Kyc7JzonbGVmdDonK2xlZnQrJ3B4Oyc7CiAgICB9IGVsc2UgewogICAgICAgIGlmKHR5cGVvZiBsZWZ0ID09PSAic3RyaW5nIikKICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMub2JqLnN0eWxlLmxlZnQucmVwbGFjZSgnJScsJycpKTsKICAgICAgICBlbHNlCiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLm9iai5zdHlsZS5sZWZ0LnJlcGxhY2UoJ3B4JywnJykpOwogICAgfQp9OwpTcHJpdGUucHJvdG90eXBlLnRvcCA9IGZ1bmN0aW9uKHRvcCkgewogICAgaWYoIHRvcCE9PXVuZGVmaW5lZCApIHsKICAgICAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICh0eXBlb2YgdG9wID09PSAic3RyaW5nIik/J3RvcDonK3RvcCsnOyc6J3RvcDonK3RvcCsncHg7JzsKICAgIH0gZWxzZSB7CiAgICAgICAgaWYodHlwZW9mIHRvcCA9PT0gInN0cmluZyIpCiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLm9iai5zdHlsZS50b3AucmVwbGFjZSgnJScsJycpKTsKICAgICAgICBlbHNlCiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLm9iai5zdHlsZS50b3AucmVwbGFjZSgncHgnLCcnKSk7CiAgICB9Cn07ClNwcml0ZS5wcm90b3R5cGUuY29udGVudFRvcCA9IGZ1bmN0aW9uKCkgewogICAgcmV0dXJuIHRoaXMub2JqLm9mZnNldFRvcDsKfTsKU3ByaXRlLnByb3RvdHlwZS53aWR0aCA9IGZ1bmN0aW9uKHdpZHRoKSB7CiAgICBpZiggd2lkdGghPT11bmRlZmluZWQgKSB7CiAgICAgICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAodHlwZW9mIHdpZHRoID09PSAic3RyaW5nIik/J3dpZHRoOicrd2lkdGgrJzsnOid3aWR0aDonK3dpZHRoKydweDsnOwogICAgfSBlbHNlIHsKICAgICAgICBpZih0eXBlb2Ygd2lkdGggPT09ICJzdHJpbmciKQogICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5vYmouc3R5bGUud2lkdGgucmVwbGFjZSgnJScsJycpKTsKICAgICAgICBlbHNlCiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLm9iai5zdHlsZS53aWR0aC5yZXBsYWNlKCdweCcsJycpKTsKICAgIH0KfTsKU3ByaXRlLnByb3RvdHlwZS5jb250ZW50V2lkdGggPSBmdW5jdGlvbigpIHsKICAgIHJldHVybiB0aGlzLm9iai5vZmZzZXRXaWR0aDsKfTsKU3ByaXRlLnByb3RvdHlwZS5jb250ZW50SGVpZ2h0ID0gZnVuY3Rpb24oKSB7CiAgICByZXR1cm4gdGhpcy5vYmoub2Zmc2V0SGVpZ2h0Owp9OwpTcHJpdGUucHJvdG90eXBlLm1pbldpZHRoID0gZnVuY3Rpb24od2lkdGgpIHsKICAgIGlmKCB3aWR0aCE9PXVuZGVmaW5lZCApIHsKICAgICAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICh0eXBlb2Ygd2lkdGggPT09ICJzdHJpbmciKT8nbWluLXdpZHRoOicrd2lkdGgrJzsnOidtaW4td2lkdGg6Jyt3aWR0aCsncHg7JzsKICAgIH0gZWxzZSB7CiAgICAgICAgcmV0dXJuIHRoaXMub2JqLm9mZnNldFdpZHRoOwogICAgfQp9OwpTcHJpdGUucHJvdG90eXBlLmhlaWdodCA9IGZ1bmN0aW9uKGhlaWdodCkgewogICAgaWYoIGhlaWdodCE9PXVuZGVmaW5lZCApIHsKICAgICAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICh0eXBlb2YgaGVpZ2h0ID09PSAic3RyaW5nIik/J2hlaWdodDonK2hlaWdodCsnOyc6J2hlaWdodDonK2hlaWdodCsncHg7JzsKICAgIH0gZWxzZSB7CiAgICAgICAgaWYodHlwZW9mIGhlaWdodCA9PT0gInN0cmluZyIpCiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLm9iai5zdHlsZS5oZWlnaHQucmVwbGFjZSgnJScsJycpKTsKICAgICAgICBlbHNlCiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLm9iai5zdHlsZS5oZWlnaHQucmVwbGFjZSgncHgnLCcnKSk7CiAgICB9Cn07ClNwcml0ZS5wcm90b3R5cGUucmlnaHQgPSBmdW5jdGlvbihyaWdodCkgewogICAgaWYoIHJpZ2h0IT09dW5kZWZpbmVkICkgewogICAgICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gKHR5cGVvZiByaWdodCA9PT0gInN0cmluZyIpPydyaWdodDonK3JpZ2h0Kyc7JzoncmlnaHQ6JytyaWdodCsncHg7JzsKICAgIH0gZWxzZSB7CiAgICAgICAgaWYodHlwZW9mIHJpZ2h0ID09PSAic3RyaW5nIikKICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMub2JqLnN0eWxlLnJpZ2h0LnJlcGxhY2UoJyUnLCcnKSk7CiAgICAgICAgZWxzZQogICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5vYmouc3R5bGUucmlnaHQucmVwbGFjZSgncHgnLCcnKSk7CiAgICB9Cn07ClNwcml0ZS5wcm90b3R5cGUuYm90dG9tID0gZnVuY3Rpb24oYm90dG9tKSB7CiAgICBpZiggYm90dG9tIT09dW5kZWZpbmVkICkgewogICAgICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gKHR5cGVvZiBib3R0b20gPT09ICJzdHJpbmciKT8nYm90dG9tOicrYm90dG9tKyc7JzonYm90dG9tOicrYm90dG9tKydweDsnOwogICAgfSBlbHNlIHsKICAgICAgICBpZih0eXBlb2YgYm90dG9tID09PSAic3RyaW5nIikKICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMub2JqLnN0eWxlLmJvdHRvbS5yZXBsYWNlKCclJywnJykpOwogICAgICAgIGVsc2UKICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMub2JqLnN0eWxlLmJvdHRvbS5yZXBsYWNlKCdweCcsJycpKTsKICAgIH0KfTsKClNwcml0ZS5wcm90b3R5cGUubWFyZ2luRnJhbWUgPSBmdW5jdGlvbihsZWZ0LHJpZ2h0LHRvcCxib3R0b20pIHsKCiAgICB2YXIgdGVtcDsKCiAgICBpZiggbGVmdCE9PXVuZGVmaW5lZCApIHsKICAgICAgICB0ZW1wID0gKHR5cGVvZiBsZWZ0ID09PSAic3RyaW5nIik/J21hcmdpbi1sZWZ0OicrbGVmdCsnOyc6J21hcmdpbi1sZWZ0OicrbGVmdCsncHg7JzsKICAgICAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9IHRlbXA7CiAgICB9CiAgICBpZiggdG9wIT09dW5kZWZpbmVkICkgewogICAgICAgIHRlbXAgPSAodHlwZW9mIHRvcCA9PT0gInN0cmluZyIpPydtYXJnaW4tdG9wOicrdG9wKyc7JzonbWFyZ2luLXRvcDonK3RvcCsncHg7JzsKICAgICAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9IHRlbXA7CiAgICB9CiAgICBpZiggcmlnaHQhPT11bmRlZmluZWQgKSB7CiAgICAgICAgdGVtcCA9ICh0eXBlb2YgcmlnaHQgPT09ICJzdHJpbmciKT8nbWFyZ2luLXJpZ2h0OicrcmlnaHQrJzsnOidtYXJnaW4tcmlnaHQ6JytyaWdodCsncHg7JzsKICAgICAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9IHRlbXA7CiAgICB9CiAgICBpZiggYm90dG9tIT09dW5kZWZpbmVkICkgewogICAgICAgIHRlbXAgPSAodHlwZW9mIGJvdHRvbSA9PT0gInN0cmluZyIpPydtYXJnaW4tYm90dG9tOicrYm90dG9tKyc7JzonbWFyZ2luLWJvdHRvbTonK2JvdHRvbSsncHg7JzsKICAgICAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9IHRlbXA7CiAgICB9Cn07Ci8vLS0tLS0gZGl2IHJvdGF0ZSxleDpzcy5yb3RhdGUoOTApOyAtLS0tLS8vClNwcml0ZS5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24odikgewogICAgaWYoIGlzSW5wdXRWYWxpZCh2KSApIHsKICAgICAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICd0cmFuc2Zvcm06cm90YXRlKCcrdisnZGVnKTsnOwogICAgfQp9OwpTcHJpdGUucHJvdG90eXBlLmNvbG9yID0gZnVuY3Rpb24ocixnLGIpIHsKICAgIHZhciBjID0gJ3JnYignK3IrJywnK2crJywnK2IrJyk7JzsKICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gJ2JhY2tncm91bmQ6JyArIGMgKyAnOyc7CiAgICByZXR1cm4gdGhpcy5vYmouc3R5bGUuYmFja2dyb3VuZDsKfTsKU3ByaXRlLnByb3RvdHlwZS5jb2xvckhleCA9IGZ1bmN0aW9uKGhleFN0cmluZykgewogICAgdmFyIGMgPSAnIycraGV4U3RyaW5nOwogICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDonICsgYyArICc7JzsKICAgIHJldHVybiB0aGlzLm9iai5zdHlsZS5iYWNrZ3JvdW5kOwp9OwpTcHJpdGUucHJvdG90eXBlLmJhY2tncm91bmRBbHBoYSA9IGZ1bmN0aW9uKHYpIHsKICAgIHZhciByZWdFeCA9IC9bMC05XSsvZzsKICAgIHZhciBhcnIgPSAodGhpcy5vYmouc3R5bGUuYmFja2dyb3VuZCkubWF0Y2gocmVnRXgpOwogICAgaWYoICFpc0lucHV0VmFsaWQodikgKQogICAgICAgIHYgPSAnMSc7CiAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICdiYWNrZ3JvdW5kOnJnYmEoJythcnJbMF0rJywnK2FyclsxXSsnLCcrYXJyWzJdKycsJyt2KycpOyc7Cn07ClNwcml0ZS5wcm90b3R5cGUuYm9yZGVyID0gZnVuY3Rpb24od2lkdGhQeCxjb2xvckhleFN0cixpc0lubmVyKSB7CiAgICB2YXIgYyA9IHdpZHRoUHgrInB4IisiICIrInNvbGlkIisiICIrIiMiK2NvbG9ySGV4U3RyOwogICAgaWYoIGlzSW5wdXRCb29sZWFuKGlzSW5uZXIpJiZpc0lubmVyICkKICAgICAgICBjICs9ICc7Ym94LXNpemluZzpib3JkZXItYm94JzsKICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gJ2JvcmRlcjonICsgYyArICc7JzsKfTsKU3ByaXRlLnByb3RvdHlwZS5ib3JkZXJDb2xvciA9IGZ1bmN0aW9uKGNvbG9ySGV4U3RyKSB7CiAgICB2YXIgYyA9ICIjIitjb2xvckhleFN0cjsKICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gJ2JvcmRlci1jb2xvcjonICsgYyArICc7JzsKfTsKU3ByaXRlLnByb3RvdHlwZS5ib3JkZXJXaWR0aCA9IGZ1bmN0aW9uKHdpZHRoUHgpIHsKICAgIHZhciBjID0gd2lkdGhQeCsicHgiOwogICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAnYm9yZGVyLXdpZHRoOicgKyBjICsgJzsnOwp9OwpTcHJpdGUucHJvdG90eXBlLmNvcm5lclJhZGl1cyA9IGZ1bmN0aW9uKHJhZGl1c1B4KSB7CiAgICB2YXIgYyA9IHJhZGl1c1B4KyJweCI7CiAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICJib3JkZXItcmFkaXVzOiIgKyBjICsgIjsiOwp9OwpTcHJpdGUucHJvdG90eXBlLnNoYWRvdyA9IGZ1bmN0aW9uKGhvcml6b250YWxQeCx2ZXJ0aWNhbFB4LGJsdXJQeCxhbHBoYSkgewogICAgdmFyIGMgPSAicmdiYSgwLDAsMCwiK2FscGhhKyIpIjsKICAgIHZhciBjMSA9IGhvcml6b250YWxQeCsicHgiKyIgIit2ZXJ0aWNhbFB4KyJweCIrIiAiK2JsdXJQeCsicHgiKyIgIitjOwogICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAiYm94LXNoYWRvdzoiK2MxKyI7IjsKfTsKU3ByaXRlLnByb3RvdHlwZS5hbHBoYSA9IGZ1bmN0aW9uKGFscGhhKSB7CiAgICBpZiggaXNJbnB1dFZhbGlkKGFscGhhKSApCiAgICAgICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAnb3BhY2l0eTonICsgYWxwaGEgKyAnOyc7CiAgICBlbHNlCiAgICAgICAgcmV0dXJuIHRoaXMub2JqLnN0eWxlLm9wYWNpdHk7Cn07ClNwcml0ZS5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbih0dHQpIHsKICAgIHRoaXMub2JqLmFwcGVuZENoaWxkKHR0dC5vYmopOwp9OwpTcHJpdGUucHJvdG90eXBlLnJlbW92ZUFsbENoaWxkID0gZnVuY3Rpb24oKSB7CiAgICB3aGlsZSggdGhpcy5vYmouaGFzQ2hpbGROb2RlcygpICkgewogICAgICAgIHRoaXMub2JqLnJlbW92ZUNoaWxkKHRoaXMub2JqLmxhc3RDaGlsZCk7CiAgICB9Cn07ClNwcml0ZS5wcm90b3R5cGUucmVtb3ZlRnJvbVBhcmVudCA9IGZ1bmN0aW9uKCkgewoKICAgIGlmKCB0aGlzLm9iai5wYXJlbnRFbGVtZW50ICkgewogICAgICAgICh0aGlzLm9iai5wYXJlbnRFbGVtZW50KS5yZW1vdmVDaGlsZCh0aGlzLm9iaik7CiAgICB9Cn07ClNwcml0ZS5wcm90b3R5cGUudXNlckludGVyYWN0aW9uRW5hYmxlZCA9IGZ1bmN0aW9uKGlzRW5hYmxlZCkgewogICAgaWYoIGlzRW5hYmxlZCApIHsKICAgICAgICB0aGlzLm9iai5zdHlsZS5wb2ludGVyRXZlbnRzID0gImF1dG8iOwogICAgfSBlbHNlIHsKICAgICAgICB0aGlzLm9iai5zdHlsZS5wb2ludGVyRXZlbnRzID0gIm5vbmUiOwogICAgfQp9OwpTcHJpdGUucHJvdG90eXBlLmFkZE1vdXNlT3ZlciA9IGZ1bmN0aW9uKGZ1bmMpIHsKICAgIHRoaXMub2JqLmFkZEV2ZW50TGlzdGVuZXIoIm1vdXNlb3ZlciIsZnVuYyxmYWxzZSk7Cn07ClNwcml0ZS5wcm90b3R5cGUuYWRkTW91c2VPdXQgPSBmdW5jdGlvbihmdW5jKSB7CiAgICB0aGlzLm9iai5hZGRFdmVudExpc3RlbmVyKCJtb3VzZW91dCIsZnVuYyxmYWxzZSk7Cn07ClNwcml0ZS5wcm90b3R5cGUuYWRkTW91c2VEb3duID0gZnVuY3Rpb24oZnVuYykgewogICAgdGhpcy5vYmouYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuYywgZmFsc2UpOwp9OwpTcHJpdGUucHJvdG90eXBlLmFkZE1vdXNlVXAgPSBmdW5jdGlvbihmdW5jKSB7CiAgICB0aGlzLm9iai5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuYywgZmFsc2UpOwp9OwpTcHJpdGUucHJvdG90eXBlLmFkZE1vdXNlTW92ZSA9IGZ1bmN0aW9uKGZ1bmMpIHsKICAgIHRoaXMub2JqLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmMsIHRydWUpOwp9OwpTcHJpdGUucHJvdG90eXBlLmFkZE1vdXNlQ2xpY2sgPSBmdW5jdGlvbihmdW5jKSB7CiAgICB0aGlzLm9iai5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuYyxmYWxzZSk7Cn07ClNwcml0ZS5wcm90b3R5cGUuYWRkTW91c2VEb3VibGVDbGljayA9IGZ1bmN0aW9uKGZ1bmMpIHsKICAgIHRoaXMub2JqLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJyxmdW5jLGZhbHNlKTsKfTsKLyoqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCiAqIFF1aWNrIGFkZCBtb3VzZS1ldmVudCBmb3IgY2hhbmdpbmcgY29sb3IgYW5kIGZhZGUtYW5pLCBqdXN0IGxpa2UgYnV0dG9uCiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQogKiB2YXIgc3MgPSBuZXcgU3ByaXRlKCk7CiAgIHNzLmluaXREaXYoKTsKICAgc3MuZnJhbWUoMCwwLDEwMCwxMDApOwogICBzcy5jb2xvckhleCgnMDA5OTAwJyk7CiAgIHNzLmFkZE1vdXNlRXZlbnQoe2NvbG9yTm9ybWFsOic5OTAwMDAnLGNvbG9yT3ZlcjonMDA5OTAwJyxjb2xvckRvd246JzAwMDA5OScsZmFkZU91dFNwZWVkOi4zLAogICBvbk92ZXI6ZnVuY3Rpb24oKXtsb2coJ292ZXInKTt9LAogICBvbk91dDpmdW5jdGlvbigpe2xvZygnb3V0Jyk7fSxvbkRvd246ZnVuY3Rpb24oKXtsb2coJ2Rvd24nKTt9LAogICBvbkNsaWNrOmZ1bmN0aW9uKCl7bG9nKCdjbGljaycpO30KICAgfSk7CiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQogKiBjb2xvck5vcm1hbDogaXMgbXVzdCBoYXZlIHZhciwgZGVmaW5lZCBjb2xvciBpbiBub3JtYWwtc3RhdGUKICogY29sb3JPdmVyOiAgIHdoZW4gdGhpcyB2YXIgZXhpc3QsIG1lYW5zIHdlIGhhdmUgbW91c2Utb3ZlciBhbmQgbW91c2Utb3V0IHN0YXRlCiAqIGNvbG9yRG93bjogICB3aGVuIGV4aXN0LCBtZWFucyB3ZSBoYXZlIG1vdXNlLWRvd24gYW5kIG1vdXNlLXVwIHN0YXRlCiAqIGZhZGVPdXRTcGVlZDp3aGVuIGV4aXN0LCBtZWFucyB3ZSBoYXZlIGZhZGUtb3V0IGFuaW1hdGlvbgogKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KICogUC5TLiBtb3VzZS1kb3duIGFuZCBtb3VzZS11cCBtYXkgaGF2ZSBkZWxheSBpbiBicm93c2VyJ3MgZGV2ZWxvcGVyLW1vZGUKIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovClNwcml0ZS5wcm90b3R5cGUuYWRkTW91c2VFdmVudCA9IGZ1bmN0aW9uKHYpIHsKICAgIHZhciB0d2VlbiA9IG51bGw7CiAgICB2LnNwID0gdGhpczsKICAgIGlmKGlzSW5wdXRWYWxpZCh2KSkgewogICAgICAgIGlmKGlzSW5wdXRTdHJpbmcodi5jb2xvck92ZXIpKSB7CiAgICAgICAgICAgIHRoaXMuYWRkTW91c2VPdmVyKGZ1bmN0aW9uKCkgewogICAgICAgICAgICAgICAgaWYodHdlZW4pCiAgICAgICAgICAgICAgICAgICAgdHdlZW4ua2lsbCgpOwogICAgICAgICAgICAgICAgdi5zcC5jb2xvckhleCh2LmNvbG9yT3Zlcik7CiAgICAgICAgICAgIH0pOwogICAgICAgICAgICB0aGlzLmFkZE1vdXNlT3V0KGZ1bmN0aW9uKCkgewogICAgICAgICAgICAgICAgdHdlZW4gPSB2LnNwLmFuaUJ5Q29sb3IodXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ2ZhZGVPdXRTcGVlZCcsMCksdi5jb2xvck5vcm1hbCxmYWxzZSk7CiAgICAgICAgICAgIH0pOwogICAgICAgIH0KICAgICAgICBpZihpc0lucHV0U3RyaW5nKHYuY29sb3JEb3duKSkgewogICAgICAgICAgICB0aGlzLmFkZE1vdXNlRG93bihmdW5jdGlvbigpIHsKICAgICAgICAgICAgICAgIGlmKHR3ZWVuKQogICAgICAgICAgICAgICAgICAgIHR3ZWVuLmtpbGwoKTsKICAgICAgICAgICAgICAgIHYuc3AuY29sb3JIZXgodi5jb2xvckRvd24pOwogICAgICAgICAgICB9KTsKICAgICAgICAgICAgdGhpcy5hZGRNb3VzZVVwKGZ1bmN0aW9uKCkgewogICAgICAgICAgICAgICAgaWYodi5jb2xvck92ZXIpCiAgICAgICAgICAgICAgICAgICAgdi5zcC5jb2xvckhleCh2LmNvbG9yT3Zlcik7CiAgICAgICAgICAgICAgICBlbHNlCiAgICAgICAgICAgICAgICAgICAgdi5zcC5jb2xvckhleCh2LmNvbG9yTm9ybWFsKTsKICAgICAgICAgICAgfSk7CiAgICAgICAgfQogICAgICAgIGlmKGlzSW5wdXRGdW5jVHlwZSh2Lm9uT3ZlcikpIHsKICAgICAgICAgICAgdGhpcy5hZGRNb3VzZU92ZXIoZnVuY3Rpb24oKSB7CiAgICAgICAgICAgICAgICB2Lm9uT3ZlcigpOwogICAgICAgICAgICB9KTsKICAgICAgICB9CiAgICAgICAgaWYoaXNJbnB1dEZ1bmNUeXBlKHYub25PdXQpKSB7CiAgICAgICAgICAgIHRoaXMuYWRkTW91c2VPdXQoZnVuY3Rpb24oKSB7CiAgICAgICAgICAgICAgICB2Lm9uT3V0KCk7CiAgICAgICAgICAgIH0pOwogICAgICAgIH0KICAgICAgICBpZihpc0lucHV0RnVuY1R5cGUodi5vbkRvd24pKSB7CiAgICAgICAgICAgIHRoaXMuYWRkTW91c2VEb3duKGZ1bmN0aW9uKCkgewogICAgICAgICAgICAgICAgdi5vbkRvd24oKTsKICAgICAgICAgICAgfSk7CiAgICAgICAgfQogICAgICAgIGlmKGlzSW5wdXRGdW5jVHlwZSh2Lm9uQ2xpY2spKSB7CiAgICAgICAgICAgIHRoaXMuYWRkTW91c2VDbGljayhmdW5jdGlvbigpIHsKICAgICAgICAgICAgICAgIHYub25DbGljaygpOwogICAgICAgICAgICB9KTsKICAgICAgICB9CiAgICB9Cn07ClNwcml0ZS5wcm90b3R5cGUuYW5pX3ggPSBmdW5jdGlvbihkdXJhdGlvbixkaXMsaXNCb3VuY2UsZnVuY1VwZGF0ZSxmdW5jRG9uZSkgewogICAgdmFyIGFhYSA9IGRpcyArICdweCc7CiAgICB2YXIgYmJiID0gaXNCb3VuY2UgPyBCb3VuY2UuZWFzZU91dCA6IG51bGw7CiAgICByZXR1cm4gVHdlZW5MaXRlLnRvKHRoaXMub2JqLGR1cmF0aW9uLHtsZWZ0OmFhYSxlYXNlOmJiYixvblVwZGF0ZTpmdW5jVXBkYXRlLG9uQ29tcGxldGU6ZnVuY0RvbmV9KTsKfTsKU3ByaXRlLnByb3RvdHlwZS5hbmlfeSA9IGZ1bmN0aW9uKGR1cmF0aW9uLGRpcyxpc0JvdW5jZSxmdW5jVXBkYXRlLGZ1bmNEb25lKSB7CiAgICB2YXIgYWFhID0gZGlzICsgJ3B4JzsKICAgIHZhciBiYmIgPSBpc0JvdW5jZSA/IEJvdW5jZS5lYXNlT3V0IDogbnVsbDsKICAgIHJldHVybiBUd2VlbkxpdGUudG8odGhpcy5vYmosZHVyYXRpb24se3RvcDphYWEsZWFzZTpiYmIsb25VcGRhdGU6ZnVuY1VwZGF0ZSxvbkNvbXBsZXRlOmZ1bmNEb25lfSk7Cn07ClNwcml0ZS5wcm90b3R5cGUuYW5pQnlDb2xvciA9IGZ1bmN0aW9uIChkdXJhdGlvbixoZXhTdHJpbmcsaXNCb3VuY2UpIHsKICAgIHZhciBiYmIgPSBpc0JvdW5jZSA/IEJvdW5jZS5lYXNlT3V0IDogbnVsbDsKICAgIHZhciBjY2MgPSAiIyIraGV4U3RyaW5nOwogICAgcmV0dXJuIFR3ZWVuTGl0ZS50byh0aGlzLm9iaixkdXJhdGlvbix7Y3NzOntiYWNrZ3JvdW5kQ29sb3I6Y2NjfSxlYXNlOmJiYn0pOwp9OwovLy0tLS0tIGNzc0Jsb2NrIGV4YW1wbGU6IHtsZWZ0OjAsdG9wOjAsd2lkdGg6MzAsaGVpZ2h0OjMwfSAtLS0tLS8vClNwcml0ZS5wcm90b3R5cGUuYW5pQnlDU1MgPSBmdW5jdGlvbiAoZHVyYXRpb24sY3NzQmxvY2ssaXNCb3VuY2Usb25Eb25lRnVuYykgewogICAgdmFyIGJiYiA9IGlzQm91bmNlID8gQm91bmNlLmVhc2VPdXQgOiBudWxsOwogICAgcmV0dXJuIFR3ZWVuTGl0ZS50byh0aGlzLm9iaixkdXJhdGlvbix7Y3NzOmNzc0Jsb2NrLGVhc2U6YmJiLG9uQ29tcGxldGU6b25Eb25lRnVuY30pOwp9OwpTcHJpdGUucHJvdG90eXBlLmFuaUJ5QWxwaGEgPSBmdW5jdGlvbiAoZHVyYXRpb24sYWxwaGFWYXIsb25Db21wbGV0ZUZ1bmMpIHsKICAgIHJldHVybiBUd2VlbkxpdGUudG8odGhpcy5vYmosZHVyYXRpb24se2FscGhhOmFscGhhVmFyLCBvbkNvbXBsZXRlOm9uQ29tcGxldGVGdW5jfSk7Cn07CgoKCi8vLS0tLS0tLS0tLS0tLSBTUFJJVEUgVEVYVCAtLS0tLS0tLS0tLS0tLS0tLy8KU3ByaXRlLnByb3RvdHlwZS5hcHBseVRleHQgPSBmdW5jdGlvbiAodGV4dFN0cmluZykgewogICAgdGhpcy5vYmouaW5uZXJIVE1MID0gdGV4dFN0cmluZzsKICAgIHJldHVybiB0aGlzLm9iai5pbm5lckhUTUw7Cn07ClNwcml0ZS5wcm90b3R5cGUudGV4dENvbG9yID0gZnVuY3Rpb24gKGhleFN0cmluZykgewogICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAiY29sb3I6IyIraGV4U3RyaW5nKyI7IjsKICAgIHJldHVybiB0aGlzLm9iai5zdHlsZS5jb2xvcjsKfTsKU3ByaXRlLnByb3RvdHlwZS50ZXh0Rm9udCA9IGZ1bmN0aW9uICh2KSB7CiAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICdmb250LWZhbWlseTonKyInIit2KyInIisnOyc7Cn07ClNwcml0ZS5wcm90b3R5cGUudGV4dFNpemUgPSBmdW5jdGlvbiAocHhTdHJpbmcpIHsKICAgIGlmKGlzSW5wdXRWYWxpZChweFN0cmluZykpCiAgICAgICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAiZm9udC1zaXplOiIrcHhTdHJpbmcrInB4IisiOyI7CiAgICByZXR1cm4gdGhpcy5vYmouc3R5bGUuZm9udFNpemU7Cn07ClNwcml0ZS5wcm90b3R5cGUudGV4dFdlaWdodCA9IGZ1bmN0aW9uIChsZXZlbDF0bzkpIHsKICAgIGxldmVsMXRvOSAqPSAxMDA7CiAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICJmb250LXdlaWdodDoiK2xldmVsMXRvOSsiOyI7Cn07ClNwcml0ZS5wcm90b3R5cGUuYWxpZ25DZW50ZXIgPSBmdW5jdGlvbiAoKSB7CiAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICJsZWZ0OjUwJTt0b3A6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC01MC41JSl0cmFuc2xhdGVZKC01MC41JSk7IjsKfTsKU3ByaXRlLnByb3RvdHlwZS5hbGlnbkNlbnRlclZlcnRpY2FsID0gZnVuY3Rpb24gKCkgewogICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAidG9wOjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAuNSUpOyI7Cn07ClNwcml0ZS5wcm90b3R5cGUuYWxpZ25DZW50ZXJIb3Jpem9udGFsID0gZnVuY3Rpb24gKCkgewogICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAibGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTUwLjUlKTsiOwp9OwpTcHJpdGUucHJvdG90eXBlLnRleHRBbGlnbkNlbnRlciA9IGZ1bmN0aW9uICgpIHsKICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gInRleHQtYWxpZ246Y2VudGVyO3ZlcnRpY2FsLWFsaWduOm1pZGRsZTsiKydsaW5lLWhlaWdodDonK3RoaXMub2JqLm9mZnNldEhlaWdodCsncHg7JzsKfTsKU3ByaXRlLnByb3RvdHlwZS50ZXh0QWxpZ25DZW50ZXJWZXJ0aWNhbCA9IGZ1bmN0aW9uICgpIHsKICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gInZlcnRpY2FsLWFsaWduOm1pZGRsZTsiKydsaW5lLWhlaWdodDonK3RoaXMub2JqLm9mZnNldEhlaWdodCsncHg7JzsKfTsKU3ByaXRlLnByb3RvdHlwZS50ZXh0QWxpZ25WZXJ0aWNhbEJ5TGluZUhlaWdodCA9IGZ1bmN0aW9uKGludEhlaWdodCkgewogICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAnbGluZS1oZWlnaHQ6JytpbnRIZWlnaHQrJ3B4Oyc7Cn07ClNwcml0ZS5wcm90b3R5cGUudGV4dEFsaWduQ2VudGVySG9yaXpvbnRhbCA9IGZ1bmN0aW9uKCkgewogICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAndGV4dC1hbGlnbjpjZW50ZXI7JzsKfTsKLy8tLS0tLSBtYWtlIHRhcmdldCB1bi1zZWxlY3RlZCwgdW4tc2VsZWN0YWJsZSAtLS0tLS8vClNwcml0ZS5wcm90b3R5cGUubWFrZUN1cnNvck5vcm1hbCA9IGZ1bmN0aW9uKHYpIHsKICAgIGlmKCAhaXNJbnB1dFZhbGlkKHYpIHx8IGlzSW5wdXRCb29sZWFuKHYpJiZ2PT09dHJ1ZSApIHsKICAgICAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICJjdXJzb3I6ZGVmYXVsdDt1c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTsta2h0bWwtdXNlci1zZWxlY3Q6bm9uZTstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC10b3VjaC1jYWxsb3V0Om5vbmU7IjsKICAgIH0gZWxzZSB7CiAgICAgICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAiY3Vyc29yOmRlZmF1bHQ7dXNlci1zZWxlY3Q6dGV4dDstbXMtdXNlci1zZWxlY3Q6dGV4dDstbW96LXVzZXItc2VsZWN0OnRleHQ7LWtodG1sLXVzZXItc2VsZWN0OnRleHQ7LXdlYmtpdC11c2VyLXNlbGVjdDp0ZXh0Oy13ZWJraXQtdG91Y2gtY2FsbG91dDp0ZXh0OyI7CiAgICB9Cn07CgoKLy8tLS0tLS0tLS0tLS0tIFNQUklURSBJTUFHRSAtLS0tLS0tLS0tLS0tLS0tLy8KU3ByaXRlLnByb3RvdHlwZS5pbml0SW1hZ2UgPSBmdW5jdGlvbiAoaWROYW1lLGltZ1VybFN0cmluZykgewoKICAgIHRoaXMub2JqID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7CiAgICBpZiggaXNJbnB1dFN0cmluZyhpZE5hbWUpICkgewogICAgICAgIHRoaXMub2JqLmlkID0gaWROYW1lOwogICAgfQogICAgaWYoIGlzSW5wdXRTdHJpbmcoaW1nVXJsU3RyaW5nKSApIHsKICAgICAgICB0aGlzLm9iai5zcmMgPSBpbWdVcmxTdHJpbmc7CiAgICAgICAgdGhpcy5vYmouc3R5bGUuY3NzVGV4dCArPSAncG9zaXRpb246YWJzb2x1dGU7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDsnOwogICAgICAgIHRoaXMubWFza092ZXJmbG93KHRydWUpOwogICAgICAgIHRoaXMubWFrZUN1cnNvck5vcm1hbCgpOwogICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5vYmopOwogICAgfQoKICAgIHJldHVybiB0aGlzLm9iajsKfTsKU3ByaXRlLnByb3RvdHlwZS5pbml0SW1hZ2VCeVNWRyA9IGZ1bmN0aW9uKCBpZE5hbWUsc3ZnQmFzZTY0U3RyaW5nICkgewoKICAgIHRoaXMub2JqID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7CiAgICBpZiggaXNJbnB1dFZhbGlkKGlkTmFtZSkgKSB7CiAgICAgICAgdGhpcy5vYmouaWQgPSBpZE5hbWU7CiAgICB9CiAgICBpZiggaXNJbnB1dFN0cmluZyhzdmdCYXNlNjRTdHJpbmcpICkgewogICAgICAgIHRoaXMub2JqLnNyYyA9ICdkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LCcrc3ZnQmFzZTY0U3RyaW5nOwogICAgICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gJ3Bvc2l0aW9uOmFic29sdXRlO2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7JzsKICAgICAgICB0aGlzLm1hc2tPdmVyZmxvdyh0cnVlKTsKICAgICAgICB0aGlzLm1ha2VDdXJzb3JOb3JtYWwoKTsKICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMub2JqKTsKICAgIH0KfTsKU3ByaXRlLnByb3RvdHlwZS5zdmdDb2xvckJ5SGV4ID0gZnVuY3Rpb24oIGhleFN0ciApIHsKCiAgICB2YXIgYXJyID0gKHRoaXMub2JqLnNyYykuc3BsaXQoJywnKTsKCiAgICB2YXIgaW5kZXhTdGFydCA9IChhdG9iKGFyclsxXSkpLmluZGV4T2YoJ2ZpbGw9IiMnKTsKICAgIHRoaXMub2JqLnNyYyA9IGFyclswXSsnLCcrYnRvYSgoYXRvYihhcnJbMV0pKS5yZXBsYWNlKCAoYXRvYihhcnJbMV0pKS5zdWJzdHJpbmcoaW5kZXhTdGFydCxpbmRleFN0YXJ0KzEzKSwnZmlsbD0iIycraGV4U3RyKSk7Cgp9OwpTcHJpdGUucHJvdG90eXBlLmdldEltYWdlV2lkdGggPSBmdW5jdGlvbiAoKSB7CiAgICByZXR1cm4gdGhpcy5vYmoubmF0dXJhbFdpZHRoOwp9OwpTcHJpdGUucHJvdG90eXBlLmdldEltYWdlSGVpZ2h0ID0gZnVuY3Rpb24gKCkgewogICAgcmV0dXJuIHRoaXMub2JqLm5hdHVyYWxIZWlnaHQ7Cn07ClNwcml0ZS5wcm90b3R5cGUuZml0SW1hZ2VPcmlnaW5TaXplID0gZnVuY3Rpb24gKCkgewogICAgdmFyIHcgPSB0aGlzLmdldEltYWdlV2lkdGgoKTsKICAgIHZhciBoID0gdGhpcy5nZXRJbWFnZUhlaWdodCgpOwogICAgdGhpcy53aWR0aCh3KTsKICAgIHRoaXMuaGVpZ2h0KGgpOwp9OwpTcHJpdGUucHJvdG90eXBlLnVwZGF0ZUltYWdlID0gZnVuY3Rpb24gKGltZ1VybFN0cmluZykgewogICAgdmFyIGltZyA9IHRoaXMub2JqOwogICAgaW1nLnNyYyA9IGltZ1VybFN0cmluZzsKfTsKCgoKCgoKLy8tLS0tLS0tLS0tLS0tIFNQUklURSBJTlBVVCBURVhUIC0tLS0tLS0tLS0tLS0tLS0vLwpTcHJpdGUucHJvdG90eXBlLmluaXRJbnB1dFRleHQgPSBmdW5jdGlvbiAoaWROYW1lKSB7CgogICAgdGhpcy5vYmogPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpOwogICAgaWYoIGlzSW5wdXRTdHJpbmcoaWROYW1lKSApIHsKICAgICAgICB0aGlzLm9iai5pZCA9IGlkTmFtZTsKICAgIH0KICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gJ3Bvc2l0aW9uOmFic29sdXRlO2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7Ym9yZGVyOm5vbmU7b3V0bGluZTpub25lOyc7CiAgICB0aGlzLm1ha2VDdXJzb3JOb3JtYWwoKTsKICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5vYmopOwoKICAgIHJldHVybiB0aGlzLm9iajsKfTsKLy8tLS0tLSAocHJlc3MgZW50ZXIpICAgZS5rZXljb2RlPT0xMyAtLS0tLS8vClNwcml0ZS5wcm90b3R5cGUuYWRkS2V5Ym9hcmRVcCA9IGZ1bmN0aW9uKGZ1bmMpIHsKICAgIHRoaXMub2JqLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuYywgZmFsc2UpOwp9OwpTcHJpdGUucHJvdG90eXBlLmdldElucHV0VGV4dCA9IGZ1bmN0aW9uKCkgewogICAgcmV0dXJuIHRoaXMub2JqLnZhbHVlOwp9OwpTcHJpdGUucHJvdG90eXBlLnNldElucHV0VGV4dCA9IGZ1bmN0aW9uKHYpIHsKICAgIHRoaXMub2JqLnZhbHVlID0gdjsKfTsKCgovLy0tLS0tLS0tLS0tLS0gU1BSSVRFIFRSSUFOR0xFIFNIQVBFIC0tLS0tLS0tLS0tLS0tLS0vLwpTcHJpdGUucHJvdG90eXBlLmluaXRUcmlhbmdsZSA9IGZ1bmN0aW9uKGlkLHcsaCxoZXgpewoKICAgIHRoaXMub2JqID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7CiAgICBpZiggaXNJbnB1dFN0cmluZyhpZCkgKQogICAgICAgIHRoaXMub2JqLmlkID0gaWQ7CiAgICB2YXIgdjEgPSAnYm9yZGVyLXdpZHRoOjAgJyt3LzIrJ3B4ICcraCsncHggJyt3LzIrJ3B4Oyc7CiAgICB2YXIgdjIgPSAnYm9yZGVyLWNvbG9yOnRyYW5zcGFyZW50IHRyYW5zcGFyZW50ICcrJyMnK2hleCsnIHRyYW5zcGFyZW50JzsKICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gJ3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjA7aGVpZ2h0OjA7Ym9yZGVyLXN0eWxlOnNvbGlkOycrdjErdjI7CiAgICB0aGlzLm1hc2tPdmVyZmxvdyh0cnVlKTsKICAgIHRoaXMubWFrZUN1cnNvck5vcm1hbCgpOwogICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm9iaik7CgogICAgcmV0dXJuIHRoaXMub2JqOwp9OwoKU3ByaXRlLnByb3RvdHlwZS50cmlhbmdsZUNvbG9yID0gZnVuY3Rpb24oaGV4KSB7CiAgICBpZiggaXNJbnB1dFN0cmluZyhoZXgpICkgewogICAgICAgIHRoaXMub2JqLnN0eWxlLmNzc1RleHQgKz0gJ2JvcmRlci1jb2xvcjp0cmFuc3BhcmVudCB0cmFuc3BhcmVudCAnKycjJytoZXgrJyB0cmFuc3BhcmVudCc7CiAgICB9Cn07CgoKLy8tLS0tLS0tLS0tLS0tIFNQUklURSBIVFRQIEdFVCAtLS0tLS0tLS0tLS0tLS0tLy8KLy8gdjE6cmVxdWVzdCB1cmwsZXg6bG9naW4ucGhwIHYyOnBhcmFtZXRlcnMgZm9sbG93cyxleDpsb2dpbi5waHA/bmFtZT14eCZwYXNzPXl5Ci8vIGV4OiBodHRwR2V0KCdzcy5waHAnLFsnP3R5cGU9MzMnLCcmbmFtZT11dSddLGZ1bmMuLi4KU3ByaXRlLnByb3RvdHlwZS5odHRwR2V0ID0gZnVuY3Rpb24odXJsLGFycixmdW5jKSB7CiAgICB2YXIgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpOwogICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHsKICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0ICYmIHRoaXMuc3RhdHVzID09PSAyMDApIHsKICAgICAgICAgICAgZnVuYyh0aGlzLnJlc3BvbnNlVGV4dCk7CiAgICAgICAgfQogICAgfTsKICAgIHZhciBwYXJhbSAgPSAnJzsKICAgIGlmKGlzSW5wdXRBcnJheShhcnIpKSB7CiAgICAgICAgYXJyLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgewogICAgICAgICAgICBwYXJhbSArPSBpdGVtOwogICAgICAgIH0pOwogICAgfQogICAgeG1saHR0cC5vcGVuKCJHRVQiLCB1cmwrcGFyYW0sIHRydWUpOwogICAgeG1saHR0cC5zZW5kKCk7CgogICAgLy8tLS0tLSB5b3UgY2FuIHN0b3AgdGhpcyByZXF1ZXN0IGlmIG5lY2Vzc2FyeSwgZXg6eG1saHR0cC5hYm9ydCgpCiAgICByZXR1cm4geG1saHR0cDsKfTsKCgovKiotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCiAqIFBST0JMRU1TKDIwMTdKYW4pOgogKiAxKSBmb250LWZhY2Ugb25seSBzdXBwb3J0IGllMTAgYW5kIGFib3ZlLCBpZTkgbm90IHN1cHBvcnRlZAogKiAyKSBmb250IGZvciBjaHQgc2l6ZSBpcyBsYXJnZSwgMS4ybWIgaXMgYSBub3JtYWwgc2l6ZSwgc2xvdyBkb3duIHdlYi1wYWdlIGxvYWRpbmcgc3BlZWQKICogMykgZm9udCBtYXkgc3RvcmUgb24gc2VydmVyLCBkaWZmIHNlcnZlciBtYXkgY2F1c2Ugc2xvdyBsb2FkaW5nIHNwZWVkCiAqIDQpIGJlc3QgZm9udCBzZXJ2ZXIgZm9yIG5vdyBpcyBnb29nbGUsIGJlc3QgbG9hZGluZyBzcGVlZAogKiA1KSBmaW5hbCBmb250LWZhY2UgY3NzIEV4OgogKiBAZm9udC1mYWNlIHsKICAgICAgICBmb250LWZhbWlseTogJ05vdG8gU2FucyBUQyc7CiAgICAgICAgZm9udC1zdHlsZTogbm9ybWFsOwogICAgICAgIGZvbnQtd2VpZ2h0OiA5MDA7CiAgICAgICAgc3JjOiB1cmwoLy9mb250cy5nc3RhdGljLmNvbS9lYS9ub3Rvc2Fuc3RjL3YxL05vdG9TYW5zVEMtTGlnaHQud29mZjIpIGZvcm1hdCgnd29mZjInKSwKICAgICAgICB1cmwoLy9mb250cy5nc3RhdGljLmNvbS9lYS9ub3Rvc2Fuc3RjL3YxL05vdG9TYW5zVEMtTGlnaHQud29mZikgZm9ybWF0KCd3b2ZmJyksCiAgICAgICAgdXJsKC8vZm9udHMuZ3N0YXRpYy5jb20vZWEvbm90b3NhbnN0Yy92MS9Ob3RvU2Fuc1RDLUxpZ2h0Lm90ZikgZm9ybWF0KCdvcGVudHlwZScpOwogICAgfQogKiA2KSB0aGlzIGZ1bmMgbmVlZCB0byBiZSBlZGl0IGluIGZ1dHVyZSwgbWFrZSBjc3MgZm9ybWF0IGp1c3QgbGlrZSBhYm92ZQogKiA3KSBlYWNoIGZvbnQgbmVlZCB0byBjb252ZXJ0IDMgZGlmZiB0eXBlcyh3b2ZmLHdvZmYyLG9wZW50eXBlKSwgZm9yIGRpZmYgcGxhdGZvcm0KICogNykgUmVzdWx0OmJlc3Qgd2F5IGlzIHVzaW5nIGxvY2FsLWNvbXB1dGVyJ3MgZm9udCwgbm8gZXh0cmEgZm9udC1sb2FkaW5nIHRpbWUKICogOCkgQGltcG9ydCB1cmwoaHR0cDovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Vhcmx5YWNjZXNzL25vdG9zYW5zdGMuY3NzKTsgd2lsbCBsb2FkIGFsbCB2ZXJzaW9uCiAqIDkpIGFsbCB2ZXJzaW9uIGNzcy1mb250IGhhcyBiaWcgbG9hZGluZyBzaXplLCBidXQgdSBjYW4gc2V0IDUgZGlmZiBmb250LXdlaWdodCBvbiBwYWdlCiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KICogIFByZS1sb2FkIGdsb2JhbC1mb250IGZyb20gc2VydmVyJ3MgcmVsYXRpdmUgcGF0aAogKiAgdGhlbiBhbnkgb2JqIGFuZCB1c2UgdGhlIGZvbnROYW1lIGZvciBmb250LWZhbWlseQogKiAgRXg6IHY6IHtmb250UGF0aDonX2NvbS9mb250X2xpZ2h0LnR0ZicsZm9udFR5cGU6J3RydWV0eXBlJ30KIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qLwpmdW5jdGlvbiBMb2FkR2xvYmFsRm9udCh2KSB7CiAgICB2YXIgbmV3U3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpOwogICAgbmV3U3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIlwKQGZvbnQtZmFjZSB7XAogICAgZm9udC1mYW1pbHk6ICciICsgdi5mb250TmFtZSArICInO1wKICAgIHNyYzogdXJsKCciICsgdi5mb250UGF0aCArICInKSBmb3JtYXQoJyIgKyB2LmZvbnRUeXBlICsgIicpO1wKfVwKIikpOwogICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChuZXdTdHlsZSk7CgogICAgLy8tLS0tLSBhcHBseSBmb250LWZhbWlseSB0byB3aG9sZSBib2R5IC0tLS0tLy8KICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3NzVGV4dCArPSAnZm9udC1mYW1pbHk6JysiJ01pY3Jvc29mdCBKaGVuZ0hlaScsIisiJyIrdi5mb250TmFtZSsiJyIrJzsnOwp9CmZ1bmN0aW9uIExvYWRGb250QW5kU2V0R2xvYmFsKCkgewogICAgLy8tLS0tLSBiZWZvcmUgZm9udCBsb2FkZWQsIHVzZSB1c2VyJ3MgbG9jYWwgZm9udCBmb3IgZGlzcGxheSAtLS0tLS8vCiAgICBTZXRVc2VyTG9jYWxGb250Rm9yR2xvYmFsKCk7CiAgICAvLy0tLS0tIHN0YXJ0IGxvYWRpbmcgZm9udCBmcm9tIHNlcnZlciAtLS0tLS8vCiAgICB2YXIgbmV3U3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpOwogICAgbmV3U3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIlwKQGZvbnQtZmFjZSB7XAogICAgZm9udC1mYW1pbHk6ICdOb3RvIFNhbnMgVEMnO1wKICAgIHNyYzogdXJsKC8vZm9udHMuZ3N0YXRpYy5jb20vZWEvbm90b3NhbnN0Yy92MS9Ob3RvU2Fuc1RDLUxpZ2h0LndvZmYyKSBmb3JtYXQoJ3dvZmYyJyksXAogICAgdXJsKC8vZm9udHMuZ3N0YXRpYy5jb20vZWEvbm90b3NhbnN0Yy92MS9Ob3RvU2Fuc1RDLUxpZ2h0LndvZmYpIGZvcm1hdCgnd29mZicpLFwKICAgIHVybCgvL2ZvbnRzLmdzdGF0aWMuY29tL2VhL25vdG9zYW5zdGMvdjEvTm90b1NhbnNUQy1MaWdodC5vdGYpIGZvcm1hdCgnb3BlbnR5cGUnKTtcCn1cCiAgICBcCiIpKTsKICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobmV3U3R5bGUpOwoKCiAgICAvLy0tLS0tIGxldCBsb2FkLWZvbnQgYmVnaW4sIHdlIG5lZWQgdG8gdXNlIHRoaXMgZm9udCBvbmNlIC0tLS0tLy8KICAgIHZhciBzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOwogICAgc3MuaW5uZXJIVE1MID0gJ2dpSXRUMVdReUAhLS8jJzsKICAgIHNzLnN0eWxlLmNzc1RleHQgKz0gInZpc2liaWxpdHk6aGlkZGVuOyI7CiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNzKTsKICAgIC8vLS0tLS0gY2hlY2sgaWYgbmV3IGZvbnQgbG9hZGVkLCB3aWxsIGNoYW5nZSBkaXYncyBjb250ZW50IGhlaWdodCAtLS0tLS8vCiAgICB2YXIgb2xkSCA9IHNzLm9mZnNldEhlaWdodDsKICAgIHNzLnN0eWxlLmNzc1RleHQgKz0gJ2ZvbnQtZmFtaWx5OicrIiciKydOb3RvIFNhbnMgVEMnKyInIisnOyc7CiAgICB2YXIgdHQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHsKICAgICAgICBpZiggb2xkSCAhPT0gc3Mub2Zmc2V0SGVpZ2h0ICkgewogICAgICAgICAgICBsb2coc3Mub2Zmc2V0SGVpZ2h0KTsKICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0dCk7CgogICAgICAgICAgICBuZXdTdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgiXAogICAgICAgICAgICAgICAgKntcCiAgICAgICAgICAgICAgICAgICAgZm9udC1mYW1pbHk6ICdOb3RvIFNhbnMgVEMnO1wKICAgICAgICAgICAgICAgIH1cCiAgICAgICAgICAgICAgICAiCiAgICAgICAgICAgICkpOwogICAgICAgIH0KICAgIH0sNTAwKTsKfQovKiotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCiAqIFBST0JMRU1TKDIwMTdKYW4pOgogKiAxKSBOb3RvU2Fuc1RDIGlzIG5vdCBhcyBnb29kIGFzIHdlIHRob3VnaCBpbiBicm93c2VyJ3MgZm9udCBkaXNwbGF5CiAqIDIpIFRoaXMgZm9udCBsZXQgc21hbGwgdGV4dCBkaXNwbGF5IHdlbGwsIHdpbGwgdGVzdCBpbiBmdXR1cmUKICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQogKiAxKSBCZWZvcmUgTm90b1NhbnNUQyBsb2FkZWQsIHVzaW5nIHVzZXIncyBsb2NhbCBmb250IGZvciBkZWZhdWx0CiAqIDIpIFdoZW4gTm90b1NhbnNUQyBsb2FkIGRvbmUsIG1ha2UgTm90b1NhbnNUQyBmb3IgZGVmYXVsdCBmb250IGF1dG9tYXRpY2FsbHkKIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qLwpmdW5jdGlvbiBTZXROb3RvU2Fuc0Zvckdsb2JhbEZvbnQoZG9uZUZ1bmMpIHsKCiAgICB2YXIgZmVlZGJhY2tPbmNlID0gZmFsc2U7CgogICAgdmFyIGZvbnRMaXN0ID0gJyJTVEhlaXRpIExpZ2h0IiwiTWljcm9zb2Z0IEpoZW5nSGVpIExpZ2h0IiwiTWljcm9zb2Z0IEpoZW5nSGVpIFVJIExpZ2h0IiwiSGVsdmV0aWNhIE5ldWUiLCJIZWx2ZXRpY2EsQXJpYWwiLCLjg6HjgqTjg6rjgqoiLCLrp5HsnYAg6rOg65SVIiwic2Fucy1zZXJpZiIsIldlblF1YW5ZaSBaZW4gSGVpIjsnOwogICAgdmFyIG5ld1N0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTsKICAgIG5ld1N0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCJcCiAgICAqe1wKICAgICAgICBmb250LXdlaWdodDoyMDA7XAogICAgICAgIGZvbnQtZmFtaWx5OiIrZm9udExpc3QrIlwKICAgICB9XAogICAgICIKICAgICkpOwogICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChuZXdTdHlsZSk7CgogICAgbmV3U3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIlwKQGZvbnQtZmFjZSB7XAogICAgZm9udC1mYW1pbHk6ICdOb3RvIFNhbnMgVEMnO1wKICAgIHNyYzogdXJsKC8vZm9udHMuZ3N0YXRpYy5jb20vZWEvbm90b3NhbnN0Yy92MS9Ob3RvU2Fuc1RDLVRoaW4ud29mZjIpIGZvcm1hdCgnd29mZjInKSxcCiAgICB1cmwoLy9mb250cy5nc3RhdGljLmNvbS9lYS9ub3Rvc2Fuc3RjL3YxL05vdG9TYW5zVEMtVGhpbi53b2ZmKSBmb3JtYXQoJ3dvZmYnKSxcCiAgICB1cmwoLy9mb250cy5nc3RhdGljLmNvbS9lYS9ub3Rvc2Fuc3RjL3YxL05vdG9TYW5zVEMtVGhpbi5vdGYpIGZvcm1hdCgnb3BlbnR5cGUnKTtcCn1cCiAgICBcCiIpKTsKCiAgICBGb250RmFjZU9ubG9hZCggIk5vdG8gU2FucyBUQyIsIHsKICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbigpIHsKICAgICAgICAgICAgaWYoICFmZWVkYmFja09uY2UgKSB7CiAgICAgICAgICAgICAgICBmZWVkYmFja09uY2UgPSB0cnVlOwogICAgICAgICAgICAgICAgbmV3U3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIlwKICAgICAgICAgICAgICAgICp7XAogICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OjEwMDtcCiAgICAgICAgICAgICAgICAgICAgZm9udC1mYW1pbHk6IiArICdOb3RvIFNhbnMgVEMnICsgIlwKICAgICAgICAgICAgICAgICB9XAogICAgICAgICAgICAgICAgICIKICAgICAgICAgICAgICAgICkpOwogICAgICAgICAgICAgICAgaWYgKGlzSW5wdXRGdW5jVHlwZShkb25lRnVuYykpIHsKICAgICAgICAgICAgICAgICAgICBkb25lRnVuYygpOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfSk7Cgp9CgovKiotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCiAqICBTZXQgd2ViLXBhZ2UncyBkZWZhdWx0LWZvbnQgZnJvbSBsb2NhbCBjb21wdXRlcidzIGZvbnQtbGlzdAogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovCmZ1bmN0aW9uIFNldFVzZXJMb2NhbEZvbnRGb3JHbG9iYWwoKSB7CiAgICB2YXIgZm9udExpc3QgPSAnIlNUSGVpdGkgTGlnaHQiLCJNaWNyb3NvZnQgSmhlbmdIZWkgTGlnaHQiLCJNaWNyb3NvZnQgSmhlbmdIZWkgVUkgTGlnaHQiLCJIZWx2ZXRpY2EgTmV1ZSIsIkhlbHZldGljYSxBcmlhbCIsInNhbnMtc2VyaWYiLCJXZW5RdWFuWWkgWmVuIEhlaSI7JzsKCiAgICB2YXIgbmV3U3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpOwogICAgbmV3U3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIlwKICAgICp7XAogICAgICAgIGZvbnQtd2VpZ2h0OjMwMDtcCiAgICAgICAgZm9udC1mYW1pbHk6Iitmb250TGlzdCsiXAogICAgIH1cCiAgICAgIgogICAgKSk7CiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG5ld1N0eWxlKTsKfQoKCgovKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQogICAgRVhURU5ERUQgTEFSR0UgRlVOQ1RJT04gRlJPTSBIRVJFCiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovClNwcml0ZS5wcm90b3R5cGUuaW5pdExvYWRpbmcgPSBmdW5jdGlvbih2KSB7CgogICAgdmFyIHNjYWxlVmFsID0gLjQ7CiAgICBpZiggaXNJbnB1dFZhbGlkKHYpJiZpc0lucHV0VmFsaWQodi5zY2FsZSkgKSB7CiAgICAgICAgc2NhbGVWYWwgPSB2LnNjYWxlOwogICAgfQoKICAgIHRoaXMub2JqID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7CiAgICB0aGlzLm9iai5zdHlsZS5jc3NUZXh0ICs9ICdwb3NpdGlvbjphYnNvbHV0ZTtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50Oyc7CiAgICB0aGlzLm1ha2VDdXJzb3JOb3JtYWwoKTsKICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5vYmopOwoKICAgIHZhciBvcHRzID0gewogICAgICAgIGxpbmVzOiAxMiAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzIHRvIGRyYXcKICAgICAgICAsIGxlbmd0aDogMzAgLy8gVGhlIGxlbmd0aCBvZiBlYWNoIGxpbmUKICAgICAgICAsIHdpZHRoOiA1IC8vIFRoZSBsaW5lIHRoaWNrbmVzcwogICAgICAgICwgcmFkaXVzOiA1NSAvLyBUaGUgcmFkaXVzIG9mIHRoZSBpbm5lciBjaXJjbGUKICAgICAgICAsIHNjYWxlOnNjYWxlVmFsIC8vIFNjYWxlcyBvdmVyYWxsIHNpemUgb2YgdGhlIHNwaW5uZXIKICAgICAgICAsIGNvcm5lcnM6IDEgLy8gQ29ybmVyIHJvdW5kbmVzcyAoMC4uMSkKICAgICAgICAsIGNvbG9yOiAnI2ZmZmZmZicgLy8gI3JnYiBvciAjcnJnZ2JiIG9yIGFycmF5IG9mIGNvbG9ycwogICAgICAgICwgb3BhY2l0eTogMC4zIC8vIE9wYWNpdHkgb2YgdGhlIGxpbmVzCiAgICAgICAgLCByb3RhdGU6IDAgLy8gVGhlIHJvdGF0aW9uIG9mZnNldAogICAgICAgICwgZGlyZWN0aW9uOiAxIC8vIDE6IGNsb2Nrd2lzZSwgLTE6IGNvdW50ZXJjbG9ja3dpc2UKICAgICAgICAsIHNwZWVkOiAyLjAgLy8gUm91bmRzIHBlciBzZWNvbmQKICAgICAgICAsIHRyYWlsOiA2MCAvLyBBZnRlcmdsb3cgcGVyY2VudGFnZQogICAgICAgICwgZnBzOiAyNSAvLyBGcmFtZXMgcGVyIHNlY29uZCB3aGVuIHVzaW5nIHNldFRpbWVvdXQoKSBhcyBhIGZhbGxiYWNrIGZvciBDU1MKICAgICAgICAsIHpJbmRleDogMmU5IC8vIFRoZSB6LWluZGV4IChkZWZhdWx0cyB0byAyMDAwMDAwMDAwKQogICAgICAgICwgY2xhc3NOYW1lOiAnc3Bpbm5lcicgLy8gVGhlIENTUyBjbGFzcyB0byBhc3NpZ24gdG8gdGhlIHNwaW5uZXIKICAgICAgICAsIHRvcDogJzUwJScgLy8gVG9wIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHBhcmVudAogICAgICAgICwgbGVmdDogJzUwJScgLy8gTGVmdCBwb3NpdGlvbiByZWxhdGl2ZSB0byBwYXJlbnQKICAgICAgICAsIHNoYWRvdzogZmFsc2UgLy8gV2hldGhlciB0byByZW5kZXIgYSBzaGFkb3cKICAgICAgICAsIGh3YWNjZWw6IHRydWUgLy8gV2hldGhlciB0byB1c2UgaGFyZHdhcmUgYWNjZWxlcmF0aW9uCiAgICAgICAgLCBwb3NpdGlvbjogJ3JlbGF0aXZlJyAvLyBFbGVtZW50IHBvc2l0aW9uaW5nCiAgICB9OwogICAgdmFyIHNwaW5uZXIgPSBuZXcgU3Bpbm5lcihvcHRzKS5zcGluKHRoaXMub2JqKTsKCiAgICByZXR1cm4gdGhpcy5vYmo7Cn07CgoKCi8qKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KIExpc3RCb3hDZWxsIChvbmx5IEZvciBMaXN0Qm94IHVzYWdlKG1heSB0cmVhdCBhcyBidXR0b24pKQogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQogdmFyIGNjID0gbmV3IExpc3RCb3hDZWxsKHsKIHg6MCx5OnBvc3ksdGl0bGU6J3VyIG5hbWUnLHRhZzppLHdpZHRoOncsaGVpZ2h0OmNlbGxILAogY29sb3JOb3JtYWw6Y29sb3JOb3JtYWwsY29sb3JPdmVyOmNvbG9yT3Zlcixjb2xvckRvd246Y29sb3JEb3duLHRpdGxlQ29sb3I6Y29sb3JUZXh0LAogdGl0bGVTaXplOnRleHRTaXplLGNvbG9yRXZlbjpjb2xvckV2ZW4KIH0pOwogY2Mud2hlbkNsaWNrKGZ1bmN0aW9uKCkgewogICAgICAgIGxvZygnaGVsbG8nKTsKIH0pOwogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovCmZ1bmN0aW9uIExpc3RCb3hDZWxsKHYpIHsKCiAgICB2YXIgc2hhcGVUcmlhbmdsZSxmdW5jT25DbGljazsKICAgIHZhciBiZ1Jvb3QgPSBudWxsOwogICAgdmFyIGJnVGl0bGUgPSBudWxsOwoKICAgIHZhciB4eCA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCd4JywwKTsKICAgIHZhciB5eSA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCd5JywwKTsKICAgIHZhciB3dyA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCd3JywyNTApOwogICAgdmFyIGhoID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ2gnLDUwKTsKICAgIHZhciBjb2xvck5vcm1hbCA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCdjb2xvck5vcm1hbCcsJzRlODg2ZicpOwogICAgdmFyIGNvbG9yRXZlbiA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCdjb2xvckV2ZW4nLCc0Mzc1NWYnKTsKICAgIHZhciBjb2xvck92ZXIgPSB1c2VGdW5jSW5wdXRPckRlZmF1bHQodiwnY29sb3JPdmVyJywnZjViMzMzJyk7CiAgICB2YXIgY29sb3JEb3duID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ2NvbG9yRG93bicsJ2Y1NTkwNCcpOwogICAgdmFyIHRpdGxlID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ3RpdGxlJywnQlVUVE9OJyk7CiAgICB2YXIgdGl0bGVTaXplID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ3RpdGxlU2l6ZScsJzIwJyk7CiAgICB2YXIgdGl0bGVDb2xvciA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCd0aXRsZUNvbG9yJywnZmZmZmZmJyk7CiAgICB2YXIgdGFnID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ3RhZycsMCk7CgogICAgLy8tLS0tLSB3aGVuIGNlbGwncyBpbmRleCBpcyBldmVuLCBtYWtlIGJnIGNvbG9yIGxpdHRsZSBkYXJrZXIgLS0tLS0vLwogICAgaWYoIHRhZyUyIT09MCApIHsKICAgICAgICBjb2xvck5vcm1hbCA9IGNvbG9yRXZlbjsKICAgIH0KCgogICAgZnVuY3Rpb24gaW5pdEJnUm9vdCgpIHsKICAgICAgICBiZ1Jvb3QgPSBuZXcgU3ByaXRlKCk7CiAgICAgICAgYmdSb290LmluaXREaXYoKTsKICAgICAgICBiZ1Jvb3QudG9wKHl5KTsKICAgICAgICBiZ1Jvb3QubGVmdCh4eCk7CiAgICAgICAgYmdSb290LndpZHRoKHd3KTsKICAgICAgICBiZ1Jvb3QuaGVpZ2h0KGhoKTsKICAgICAgICBiZ1Jvb3QuY29sb3JIZXgoY29sb3JOb3JtYWwpOwogICAgICAgIGJnUm9vdC50YWcgPSB0YWc7CiAgICAgICAgYmdSb290LmFkZE1vdXNlT3ZlcihmdW5jdGlvbigpIHsKICAgICAgICAgICAgYmdSb290LmNvbG9ySGV4KGNvbG9yT3Zlcik7CiAgICAgICAgICAgIGlmKGlzSW5wdXRPYmplY3Qoc2hhcGVUcmlhbmdsZSkpCiAgICAgICAgICAgICAgICBzaGFwZVRyaWFuZ2xlLnRyaWFuZ2xlQ29sb3IoY29sb3JPdmVyKTsKICAgICAgICB9KTsKICAgICAgICBiZ1Jvb3QuYWRkTW91c2VPdXQoZnVuY3Rpb24oKSB7CiAgICAgICAgICAgIGJnUm9vdC5jb2xvckhleChjb2xvck5vcm1hbCk7CiAgICAgICAgICAgIGlmKGlzSW5wdXRPYmplY3Qoc2hhcGVUcmlhbmdsZSkpCiAgICAgICAgICAgICAgICBzaGFwZVRyaWFuZ2xlLnRyaWFuZ2xlQ29sb3IoY29sb3JOb3JtYWwpOwogICAgICAgIH0pOwogICAgICAgIGJnUm9vdC5hZGRNb3VzZURvd24oZnVuY3Rpb24oKSB7CiAgICAgICAgICAgIGJnUm9vdC5jb2xvckhleChjb2xvckRvd24pOwogICAgICAgICAgICBpZihpc0lucHV0T2JqZWN0KHNoYXBlVHJpYW5nbGUpKQogICAgICAgICAgICAgICAgc2hhcGVUcmlhbmdsZS50cmlhbmdsZUNvbG9yKGNvbG9yRG93bik7CiAgICAgICAgfSk7CiAgICAgICAgYmdSb290LmFkZE1vdXNlVXAoZnVuY3Rpb24oKSB7CiAgICAgICAgICAgIGJnUm9vdC5jb2xvckhleChjb2xvck92ZXIpOwogICAgICAgICAgICBpZihpc0lucHV0T2JqZWN0KHNoYXBlVHJpYW5nbGUpKQogICAgICAgICAgICAgICAgc2hhcGVUcmlhbmdsZS50cmlhbmdsZUNvbG9yKGNvbG9yT3Zlcik7CiAgICAgICAgfSk7CiAgICAgICAgYmdSb290LmFkZE1vdXNlQ2xpY2soZnVuY3Rpb24oKSB7CiAgICAgICAgICAgIGlmKGlzSW5wdXRWYWxpZChmdW5jT25DbGljaykpCiAgICAgICAgICAgICAgICBmdW5jT25DbGljayhiZ1Jvb3QudGFnKTsKICAgICAgICB9KTsKICAgIH0KCgogICAgZnVuY3Rpb24gaW5pdEljb25UaXRsZSgpIHsKICAgICAgICB2YXIgc2lkZURpcyA9IDU7CiAgICAgICAgYmdUaXRsZSA9IG5ldyBTcHJpdGUoKTsKICAgICAgICBiZ1RpdGxlLmluaXREaXYoKTsKICAgICAgICAvLyBiZ1RpdGxlLmNvbG9ySGV4KCc5OTAwMDAnKTsgIC8vIGRlYnVnIHVzYWdlCiAgICAgICAgYmdUaXRsZS5sZWZ0KHNpZGVEaXMpOwogICAgICAgIGJnVGl0bGUudG9wKHNpZGVEaXMpOwogICAgICAgIGJnVGl0bGUud2lkdGgoYmdSb290LndpZHRoKCktc2lkZURpcyo2KTsKICAgICAgICBiZ1RpdGxlLmhlaWdodChiZ1Jvb3QuaGVpZ2h0KCktc2lkZURpcyoyKTsKICAgICAgICBiZ1RpdGxlLmFwcGx5VGV4dCh0aXRsZSk7CiAgICAgICAgYmdUaXRsZS50ZXh0U2l6ZSh0aXRsZVNpemUpOwogICAgICAgIGJnVGl0bGUudGV4dENvbG9yKHRpdGxlQ29sb3IpOwogICAgICAgIGJnVGl0bGUudGV4dEFsaWduQ2VudGVyKCk7CiAgICAgICAgYmdUaXRsZS5tYWtlQ3Vyc29yTm9ybWFsKCk7CgogICAgICAgIGJnUm9vdC5hZGRDaGlsZChiZ1RpdGxlKTsKICAgIH0KCgoKICAgIGluaXRCZ1Jvb3QoKTsKICAgIGluaXRJY29uVGl0bGUoKTsKCgoKICAgIHRoaXMudGFnID0gdGFnID0gMDsKICAgIHRoaXMuZ2V0Q2VsbEhlaWdodCA9IGZ1bmN0aW9uKCkgewogICAgICAgIHJldHVybiBiZ1Jvb3QuaGVpZ2h0KCk7CiAgICB9OwogICAgdGhpcy5zZXRTaGFwZVRyaWFuZ2xlID0gZnVuY3Rpb24odikgewogICAgICAgIGlmKCBpc0lucHV0T2JqZWN0KHYpICkKICAgICAgICAgICAgc2hhcGVUcmlhbmdsZSA9IHY7CiAgICB9OwogICAgdGhpcy53aGVuQ2xpY2sgPSBmdW5jdGlvbihmdW5jKSB7CiAgICAgICAgZnVuY09uQ2xpY2sgPSBmdW5jOwogICAgfTsKICAgIHRoaXMuZ2V0VGV4dCA9IGZ1bmN0aW9uKCkgewogICAgICAgIHJldHVybiB0aXRsZTsKICAgIH07CiAgICB0aGlzLmJnID0gYmdSb290OwoKfQoKCi8qKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KICogTGlzdEJveCAoc2hvd3MgYXMgY2hlY2stYm94LCByZXR1cm4gd2hpY2ggaW5kZXggJiBzdHJpbmcgdSBjaG9vc2UpCiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KIHZhciBhcnJOYW1lID0gWyJIZWxsbyIsIlN1bmRheSIsIldvb2RzIl07CiB2YXIgbGwgPSBuZXcgTGlzdEJveCh7eDozMTAseToxMTAsYXJyQ2VsbE5hbWU6YXJyTmFtZSxjZWxsSDo1MCx3OjIzMCx0ZXh0U2l6ZTonMjcnLAogY29ybmVyUjoxMCx0U2hhcGVXOjIwLHRTaGFwZUg6MTAsY29sb3JOb3JtYWw6JzRlODg2ZicsY29sb3JFdmVuOic0Mzc1NWYnLAogY29sb3JPdmVyOidmNWIzMzMnLGNvbG9yRG93bjonZjU1OTA0Jyxjb2xvclRleHQ6J2ZmZmZmZid9KTsKIGxsLndoZW5Vc2VyU2VsZWN0ZWQoZnVuY3Rpb24odikgewogICAgbG9nKHYpOyAvLyBleDpbMSwgIlN1bmRheSJdCiB9KTsKICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQogQSkgTGlzdEJveCdzIHgseSB3aWxsIGJlY29tZSBjZW50ZXItdG9wIG9mIHRoZSBzaGFwZS10cmlhbmdsZQogQikgbWVtb3J5IHRlc3QtLT5tZW1vcnkgcmVsZWFzZSBvawogQykgZnVuY3Rpb24ncyBwYXJhbWV0ZXIgcGxzIHJlZmVyIHRvIGRlZiBpbnNpZGUgZnVuYwogRCkgYWRkIGxpc3RlbmVyOndoZW5Vc2VyU2VsZWN0ZWQgd2hlbiBsaXN0IGJlZW4gc2VsZWN0ZWQKICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovCmZ1bmN0aW9uIExpc3RCb3godikgewoKICAgIHZhciBpc0NlbGxFeGlzdCA9IGlzSW5wdXRWYWxpZCh2KSYmaXNJbnB1dEFycmF5KHYuYXJyQ2VsbE5hbWUpOwoKICAgIHZhciB4ID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ3gnLDIwMCk7CiAgICB2YXIgeSA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCd5JywyMDApOwogICAgdmFyIHcgPSB1c2VGdW5jSW5wdXRPckRlZmF1bHQodiwndycsMjcwKTsKICAgIHZhciBoID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ2gnLDYwKTsKICAgIHZhciBjb3JuZXJSID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ2Nvcm5lclInLDEwKTsKICAgIHZhciB0U2hhcGVXID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ3RTaGFwZVcnLDIwKTsKICAgIHZhciB0U2hhcGVIID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ3RTaGFwZUgnLDEwKTsKICAgIHZhciBjZWxsSCA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCdjZWxsSCcsMzApOwogICAgdmFyIGNvbG9yTm9ybWFsID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ2NvbG9yTm9ybWFsJywnNGU4ODZmJyk7CiAgICB2YXIgY29sb3JEb3duID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ2NvbG9yRG93bicsJ2Y1NTkwNCcpOwogICAgdmFyIGNvbG9yT3ZlciA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCdjb2xvck92ZXInLCdmNWIzMzMnKTsKICAgIHZhciBjb2xvckV2ZW4gPSB1c2VGdW5jSW5wdXRPckRlZmF1bHQodiwnY29sb3JFdmVuJywnNDM3NTVmJyk7CiAgICB2YXIgY29sb3JUZXh0ID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ2NvbG9yVGV4dCcsJ2ZmZmZmZicpOwogICAgdmFyIHRleHRTaXplID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ3RleHRTaXplJywnMjAnKTsKCgogICAgdmFyIGNlbGxUb3RhbEhlaWdodCxiZ1Jvb3QsYmdSb3VuZCxiZ1RTaGFwZSA9IG51bGw7CiAgICAvLy0tLS0tIG1vcmUgc3BhY2UgZm9yIGJnUm91bmQncyBzaGFkb3cgLS0tLS0vLwogICAgdmFyIGJvcmRlckRpcyA9IDIwOwogICAgLy8tLS0tLSBmaW5hbCBzdHJpbmcgc2VsZWN0ZWQgYnkgdXNlciBmcm9tIGxpc3QgLS0tLS0vLwogICAgdmFyIGFucyA9IG51bGw7CiAgICAvLy0tLS0tIGFyciBmb3Igc3RvcmUgY2VsbHMgLS0tLS0vLwogICAgdmFyIGFyciA9IHt9OwogICAgLy8tLS0tLSBmdWxsLXNjcmVlbiBvZiBiZyAtLS0tLS8vCiAgICB2YXIgYmdNb3RoZXIgPSBudWxsOwogICAgLy8tLS0tLSBmdWxsLXNjcmVlbiB0b3VjaCBhcmVhIGZvciBtb3VzZS1kb3duIGFuZCBleGl0IC0tLS0tLy8KICAgIHZhciBiZ0V4aXQgPSBudWxsOwogICAgLy8tLS0tLSBhc3NpZ24gZnJvbSBvdXRzaWRlIGZvciB3aGVuIGNlbGwtY2xpY2sgLS0tLS0vLwogICAgdmFyIGNsaWVudEZ1bmMgPSBudWxsOwoKCiAgICBmdW5jdGlvbiBleGl0KCkgewogICAgICAgIGJnTW90aGVyLnJlbW92ZUZyb21QYXJlbnQoKTsKICAgICAgICBiZ01vdGhlciA9IG51bGw7CiAgICB9CgogICAgZnVuY3Rpb24gaW5pdEJnTW90aGVyKCkgewogICAgICAgIGJnTW90aGVyID0gbmV3IFNwcml0ZSgpOwogICAgICAgIGJnTW90aGVyLmluaXREaXYoKTsKICAgICAgICBiZ01vdGhlci5mcmFtZSgwLDAsJzEwMCUnLCcxMDAlJyk7CiAgICB9CgogICAgZnVuY3Rpb24gaW5pdEJnRXhpdCgpIHsKICAgICAgICBiZ0V4aXQgPSBuZXcgU3ByaXRlKCk7CiAgICAgICAgYmdFeGl0LmluaXREaXYoKTsKICAgICAgICBiZ0V4aXQuZnJhbWUoMCwwLCcxMDAlJywnMTAwJScpOwogICAgICAgIGJnRXhpdC5hZGRNb3VzZURvd24oZnVuY3Rpb24oKSB7CiAgICAgICAgICAgIGV4aXQoKTsKICAgICAgICB9KTsKICAgICAgICBiZ01vdGhlci5hZGRDaGlsZChiZ0V4aXQpOwogICAgfQoKICAgIGZ1bmN0aW9uIGluaXRCZ1Jvb3QoKSB7CiAgICAgICAgYmdSb290ID0gbmV3IFNwcml0ZSgpOwogICAgICAgIGJnUm9vdC5pbml0RGl2KCk7CiAgICAgICAgYmdSb290LnRvcCh5KTsKICAgICAgICBiZ1Jvb3QubGVmdCh4LSh3K2JvcmRlckRpcykvMik7Ly8oeC1ib3JkZXJEaXMvMik7CiAgICAgICAgYmdSb290LndpZHRoKHcrYm9yZGVyRGlzKTsKICAgICAgICBiZ1Jvb3QuaGVpZ2h0KGgpOyAgICAgICAgICAgICAgIC8vIGJnUm9vdCdzIGhlaWdodCBtYXkgY2hhbmdlIGxhdGVyIGluIGluaXRDZWxsKCkKICAgICAgICAvLyBiZ1Jvb3QuY29sb3JIZXgoJzAwMDA5OScpOyAgICAgIC8vIGRlYnVnLXVzYWdlCiAgICAgICAgYmdNb3RoZXIuYWRkQ2hpbGQoYmdSb290KTsKICAgIH0KCiAgICBmdW5jdGlvbiBpbml0VFNoYXBlKCkgewogICAgICAgIGJnVFNoYXBlID0gbmV3IFNwcml0ZSgpOwogICAgICAgIGJnVFNoYXBlLmluaXRUcmlhbmdsZShudWxsLHRTaGFwZVcsdFNoYXBlSCxjb2xvck5vcm1hbCk7CiAgICAgICAgYmdUU2hhcGUuYWxpZ25DZW50ZXJIb3Jpem9udGFsKCk7CiAgICAgICAgYmdSb290LmFkZENoaWxkKGJnVFNoYXBlKTsKICAgIH0KCgogICAgZnVuY3Rpb24gaW5pdFJvdW5kQmcoKSB7CiAgICAgICAgYmdSb3VuZCA9IG5ldyBTcHJpdGUoKTsKICAgICAgICBiZ1JvdW5kLmluaXREaXYoKTsKICAgICAgICBiZ1JvdW5kLnRvcCh0U2hhcGVILTEpOwogICAgICAgIGJnUm91bmQubGVmdChib3JkZXJEaXMvMik7CiAgICAgICAgYmdSb3VuZC53aWR0aCh3KTtiZ1JvdW5kLmhlaWdodChoLXRTaGFwZUgpOwogICAgICAgIGJnUm91bmQuY29sb3JIZXgoY29sb3JOb3JtYWwpOwogICAgICAgIGJnUm91bmQuY29ybmVyUmFkaXVzKGNvcm5lclIpOwogICAgICAgIGJnUm9vdC5hZGRDaGlsZChiZ1JvdW5kKTsKICAgIH0KCiAgICBmdW5jdGlvbiBpbml0U2hhZG93KCkgewogICAgICAgIC8vLS0tLS0gd2hlbiB1c2VyIGRlZmluZSBpc1NoYWRvdz1mYWxzZSB3aWxsIG5vdCBydW4gdGhpcyBmdW5jIC0tLS0tLy8KICAgICAgICBpZiggIShpc0lucHV0VmFsaWQodikmJmlzSW5wdXRCb29sZWFuKHYuaXNTaGFkb3cpJiYhdi5pc1NoYWRvdykgKQogICAgICAgICAgICBiZ1JvdW5kLnNoYWRvdygwLDAsOCwuNyk7CiAgICB9CgogICAgZnVuY3Rpb24gaW5pdENlbGwoKSB7CgogICAgICAgIC8vLS0tLS0gdXNlciBkZWZpbmUgY2VsbCdzIG5hbWUgb3Igbm90IC0tLS0tLy8KICAgICAgICBpZiggaXNDZWxsRXhpc3QgKSB7CiAgICAgICAgICAgIGZvciggdmFyIGk9MDsgaTx2LmFyckNlbGxOYW1lLmxlbmd0aDtpKyspIHsKICAgICAgICAgICAgICAgIHZhciBwb3N5ID0gKGkqY2VsbEgpOwogICAgICAgICAgICAgICAgdmFyIGNjID0gbmV3IExpc3RCb3hDZWxsKHsKICAgICAgICAgICAgICAgICAgICB4OjAseTpwb3N5LHRpdGxlOnYuYXJyQ2VsbE5hbWVbaV0sdGFnOmksd2lkdGg6dyxoZWlnaHQ6Y2VsbEgsCiAgICAgICAgICAgICAgICAgICAgY29sb3JOb3JtYWw6Y29sb3JOb3JtYWwsY29sb3JPdmVyOmNvbG9yT3Zlcixjb2xvckRvd246Y29sb3JEb3duLHRpdGxlQ29sb3I6Y29sb3JUZXh0LAogICAgICAgICAgICAgICAgICAgIHRpdGxlU2l6ZTp0ZXh0U2l6ZSxjb2xvckV2ZW46Y29sb3JFdmVuCiAgICAgICAgICAgICAgICB9KTsKICAgICAgICAgICAgICAgIGNjLndoZW5DbGljayh3aGVuQ2VsbENsaWNrKTsKICAgICAgICAgICAgICAgIGJnUm91bmQuYWRkQ2hpbGQoY2MuYmcpOwogICAgICAgICAgICAgICAgYXJyW2ldID0gY2M7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgLy8tLS0tLSB1cGRhdGUgYmcgYW5kIGJnLXJvdW5kZWQncyBoZWlnaHQgYnkgY2VsbCAtLS0tLS8vCiAgICAgICAgICAgIHZhciBjY2MgPSBhcnJbMF07CiAgICAgICAgICAgIGNlbGxUb3RhbEhlaWdodCA9IGNjYy5nZXRDZWxsSGVpZ2h0KCkqKHYuYXJyQ2VsbE5hbWUubGVuZ3RoKTsKICAgICAgICAgICAgYmdSb290LmhlaWdodChjZWxsVG90YWxIZWlnaHQrdFNoYXBlSCtib3JkZXJEaXMpOwogICAgICAgICAgICBiZ1JvdW5kLmhlaWdodChjZWxsVG90YWxIZWlnaHQpOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIHZhciBkZCA9IG5ldyBMaXN0Qm94Q2VsbCh7CiAgICAgICAgICAgICAgICB0aXRsZTonZW1wdHknLHdpZHRoOncsaGVpZ2h0OmNlbGxILHg6MCx5OjAsdGFnOjAsCiAgICAgICAgICAgICAgICBjb2xvck5vcm1hbDpjb2xvck5vcm1hbCxjb2xvck92ZXI6Y29sb3JPdmVyLGNvbG9yRG93bjpjb2xvckRvd24sdGl0bGVDb2xvcjpjb2xvclRleHQsCiAgICAgICAgICAgICAgICB0aXRsZVNpemU6dGV4dFNpemUsY29sb3JFdmVuOmNvbG9yRXZlbgogICAgICAgICAgICB9KTsKICAgICAgICAgICAgZGQud2hlbkNsaWNrKHdoZW5DZWxsQ2xpY2spOwogICAgICAgICAgICBiZ1Jvb3QuaGVpZ2h0KGRkLmdldENlbGxIZWlnaHQoKSt0U2hhcGVIK2JvcmRlckRpcyk7CiAgICAgICAgICAgIGJnUm91bmQuaGVpZ2h0KGRkLmdldENlbGxIZWlnaHQoKSk7CiAgICAgICAgICAgIGJnUm91bmQuYWRkQ2hpbGQoZGQuYmcpOwogICAgICAgICAgICBhcnJbMF0gPSBkZDsKICAgICAgICB9CgogICAgICAgIC8vLS0tLS0gbWFrZSBzaGFwZS10cmlhbmdsZSdzIG1vdXNlLWV2ZW50LWNvbG9yIHNhbWUgd2l0aCBmaXJzdCBjZWxsIC0tLS0tLy8KICAgICAgICB2YXIgY2NjYyA9IGFyclswXTsKICAgICAgICBjY2NjLnNldFNoYXBlVHJpYW5nbGUoYmdUU2hhcGUpOwogICAgfQoKCiAgICAvLy0tLS0tIG1vdXNlLWNsaWNrIGJ5IHVzZXIgLS0tLS0vLwogICAgZnVuY3Rpb24gd2hlbkNlbGxDbGljayh2KSB7CiAgICAgICAgLy8gcmV0dXJuIGJhY2sgd2hpY2ggaW5kZXggYW5kIGl0J3Mgc3RyaW5nIGNvbnRlbnQsIGFycmF5IGZvcm1hdAogICAgICAgIGFucyA9IFt2LGFyclt2XS5nZXRUZXh0KCldOwogICAgICAgIGlmKGlzSW5wdXRGdW5jVHlwZShjbGllbnRGdW5jKSkgewogICAgICAgICAgICBjbGllbnRGdW5jKGFucyk7CiAgICAgICAgfQogICAgICAgIGV4aXQoKTsKICAgIH0KCgogICAgaW5pdEJnTW90aGVyKCk7CiAgICBpbml0QmdFeGl0KCk7CiAgICBpbml0QmdSb290KCk7CiAgICBpbml0Um91bmRCZygpOwogICAgaW5pdFRTaGFwZSgpOwogICAgaW5pdENlbGwoKTsKICAgIGluaXRTaGFkb3coKTsKCgogICAgdGhpcy53aGVuVXNlclNlbGVjdGVkID0gZnVuY3Rpb24oZnVuYyl7CiAgICAgICAgY2xpZW50RnVuYyA9IGZ1bmM7CiAgICB9OwogICAgdGhpcy5iZyA9IGJnTW90aGVyOwoKfQoKCi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioKICogU2Nyb2xsVmlldyAobWFueSBzcHJpdGUtY2VsbCBjYW4gcGxhY2UgaW4gaXQgYW5kIHNjcm9sbCB2ZXJ0aWNhbGx5KQogKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCiAqIGZ1bmN0aW9uIGdldENlbGwoaSkgewogICAgICAgIHZhciBjY2MgPSBuZXcgU3ByaXRlKCk7CiAgICAgICAgY2NjLmluaXREaXYoKTsKICAgICAgICBjY2MuYXBwbHlUZXh0KGkpOwogICAgICAgIGNjYy50ZXh0Rm9udCgnZm9udC1ub3JtYWwnKTsKICAgICAgICB2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NSk7CiAgICAgICAgdmFyIGcgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTUpOwogICAgICAgIHZhciBiID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU1KTsKICAgICAgICBjY2MuY29sb3IocixnLGIpOwogICAgICAgIGNjYy5mcmFtZSgwLDUwKmksNDAwLDUwKTsKICAgICAgICBjY2MuYWRkTW91c2VPdmVyKGZ1bmN0aW9uICgpIHsKICAgICAgICAgICAgY2NjLmFscGhhKC4zKTsKICAgICAgICB9KTsKICAgICAgICBjY2MuYWRkTW91c2VPdXQoZnVuY3Rpb24gKCkgewogICAgICAgICAgICBjY2MuYWxwaGEoMSk7CiAgICAgICAgfSk7CiAgICAgICAgcmV0dXJuIGNjYzsKICAgIH0KICAgIGZ1bmN0aW9uIGdldEFyckNlbGwoKSB7CiAgICAgICAgdmFyIGFyciA9IFtdOwogICAgICAgIGZvciggdmFyIGk9MDtpPDE1O2krKyApIHsKICAgICAgICAgICAgYXJyLnB1c2goZ2V0Q2VsbChpKSk7CiAgICAgICAgfQogICAgICAgIHJldHVybiBhcnI7CiAgICB9CiAgICB2YXIgdmlldyA9IG5ldyBTY3JvbGxWaWV3KHt4OjAseTowLHc6MzAwLGg6NTAwLGlzQmFyV2hpdGU6dHJ1ZSwKICAgIGlzQmFyQXV0b0hpZGU6dHJ1ZSxiYXJBdXRvSGlkZVRpbWU6MzAwMCxpc0JhckFwcGVhcldoZW5PdmVyOnRydWUsCiAgICBiZ0NvbG9yOicwMDk5MDAnfSk7CiAgICB2aWV3LmFkZENlbGxBcnIoZ2V0QXJyQ2VsbCgpKTsKICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQogKiBpc0JhcldoaXRlOiAgICAgIHNjcm9sbC1iYXIgaGFzIDIgZGlmZiBraW5kcyBvZiBjb2xvci1zdHlsZSwgYmxhY2sgb3Igd2hpdGUKICogaXNCYXJBdXRvSGlkZTogICB3aGVuIGZhbHNlLCBzY3JvbGwtYmFyIHdpbGwgYWx3YXlzIGJlIHRoZXJlCiAqIGJhckF1dG9IaWRlVGltZTogYWZ0ZXIgMyBzZWMgc2Nyb2xsLWJhciB3aWxsIGF1dG8gaGlkZSwgaW4gbWlsbGlzZWNvbmQKICogaXNCYXJBcHBlYXJXaGVuT3ZlcjoKICogICAgICAgICAgICAgICAgICB3aGVuIGZhbHNlLCBzY3JvbGwtYmFyIHdpbGwgYXBwZWFyIG9ubHkgd2hlbiBtb3VzZS1zY3JvbGxpbmcKICogYmdDb2xvcjogICAgICAgICBzY3JvbGxWaWV3J3MgYmFja2dyb3VuZCBjb2xvciwgdHJhbnNwYXJlbnQgYnkgZGVmYXVsdAogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqLwpmdW5jdGlvbiBTY3JvbGxWaWV3KHYpIHsKCiAgICAvLy0tLS0tIGNsZWFuIGFsbCBjZWxsIGFuZCByZXNldCBzY3JvbGwtYmFyIC0tLS0tLy8KICAgIHRoaXMuY2xlYW5BbGxDZWxsID0gZnVuY3Rpb24oKSB7CiAgICAgICAgcmVzZXRTY3JvbGxWaWV3KCk7CiAgICB9OwogICAgLy8tLS0tLSBhZGQgb25lIGNlbGwgZWFjaCB0aW1lIC0tLS0tLy8KICAgIHRoaXMuYWRkQ2VsbCA9IGZ1bmN0aW9uKGMpIHsKICAgICAgICBhZGRDZWxsMlNjcm9sbFZpZXcoYyk7CiAgICB9OwogICAgLy8tLS0tLSB1cGRhdGUgY29udGVudCBieSBhcnJheSBvZiBjZWxsIC0tLS0tLy8KICAgIHRoaXMuYWRkQ2VsbEFyciA9IGZ1bmN0aW9uKGEpIHsKICAgICAgICByZXNldFNjcm9sbFZpZXcoKTsKICAgICAgICBhLmZvckVhY2goZnVuY3Rpb24oYykgewogICAgICAgICAgICBhZGRDZWxsMlNjcm9sbFZpZXcoYyk7CiAgICAgICAgfSk7CiAgICB9OwoKICAgIHZhciB4eCA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCd4JywwKTsKICAgIHZhciB5eSA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCd5JywwKTsKICAgIHZhciB3dyA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCd3JywzMDApOwogICAgdmFyIGhoID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ2gnLDUwMCk7CiAgICAvLyBjb2xvci1zdHlsZSB3aGl0ZSBvciBibGFjayBmb3Igc2Nyb2xsLWJhcgogICAgdmFyIGlzQmFyQ29sb3JXaGl0ZSA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCdpc0JhcldoaXRlJyxmYWxzZSk7CiAgICAvLyBzY3JvbGwtYmFyIHdpbGwgYXV0byBkaXNhcHBlYXIgYnkgZGVmYXVsdAogICAgdmFyIGlzQmFyQXV0b0hpZGUgPSB1c2VGdW5jSW5wdXRPckRlZmF1bHQodiwnaXNCYXJBdXRvSGlkZScsdHJ1ZSk7CiAgICAvLyBzY3JvbGwtYmFyIHdpbGwgYXV0byBkaXNhcHBlYXIgYWZ0ZXIgMyBzZWMKICAgIHZhciBiYXJBdXRvSGlkZVRpbWUgPSB1c2VGdW5jSW5wdXRPckRlZmF1bHQodiwnYmFyQXV0b0hpZGVUaW1lJywzMDAwKTsKICAgIC8vIHNjcm9sbC1iYXIgYXBwZWFyZWQgd2hlbiBtb3VzZS1vdmVyCiAgICB2YXIgaXNCYXJBcHBlYXJXaGVuT3ZlciA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCdpc0JhckFwcGVhcldoZW5PdmVyJyx0cnVlKTsKCiAgICB2YXIgY29udGVudEggPSAwOyAgICAgICAgICAgICAgIC8vIG1ha2Ugc2Nyb2xsLWJhciBhcHBlYXIgb25seSB3aGVuIGNvbnRlbnRIPmhoCiAgICB2YXIgYmFyV2lkdGhNaW4gPSAxMDsgICAgICAgICAgIC8vIHNjcm9sbC1iYXIncyB3aWR0aCB3aGVuIG5vcm1hbAogICAgdmFyIGJhcldpZHRoTWF4ID0gMTg7ICAgICAgICAgICAvLyBzY3JvbGwtYmFyJ3Mgd2lkdGggd2hlbiBtb3VzZS1vdmVyCgogICAgdmFyIGJhckFscGhhID0gLjQ7CiAgICB2YXIgYmFyQW5pU3BlZWQgPSAuMTU7CgoKCiAgICAvLy0tLS0tIGlmIGNlbGwgZXhpc3QsIHJlbW92ZSBhbGwgY2VsbCBhbmQgcmVzZXQgc2Nyb2xsLWJhciAtLS0tLS8vCiAgICBmdW5jdGlvbiByZXNldFNjcm9sbFZpZXcoKSB7CiAgICAgICAgaWYoIGJnU2Nyb2xsQmFzZS5vYmouaGFzQ2hpbGROb2RlcygpICkgewogICAgICAgICAgICBiZ1Njcm9sbEJhc2UucmVtb3ZlQWxsQ2hpbGQoKTsKICAgICAgICAgICAgY29udGVudEggPSAwOwogICAgICAgICAgICB1cGRhdGVTY3JvbGxTdGF0ZSgpOwogICAgICAgICAgICBzY3JvbGxiYXIudG9wKDApOwogICAgICAgIH0KICAgIH0KCiAgICAvLy0tLS0tIHVwZGF0ZSBzY3JvbGwtZGlzIGFuZCBzY3JvbGwtYmFyJ3MgaGVpZ2h0IGJ5IGNlbGwtY29udGVudCAtLS0tLS8vCiAgICBmdW5jdGlvbiB1cGRhdGVTY3JvbGxTdGF0ZSgpIHsKICAgICAgICBpZiggY29udGVudEggPiBoaCApIHsKICAgICAgICAgICAgc2Nyb2xsYmFyLmhpZGRlbihmYWxzZSk7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgc2Nyb2xsYmFyLmhpZGRlbih0cnVlKTsKICAgICAgICB9CiAgICAgICAgY29udGVudC5oZWlnaHQoY29udGVudEgpOwogICAgICAgIHNjcm9sbGJhci5oZWlnaHQoIGdldEJhckgoKSApOwogICAgICAgIHNjcm9sbERpc01heCA9IGJnUm9vdC5oZWlnaHQoKS1zY3JvbGxiYXIuaGVpZ2h0KCk7CiAgICB9CgogICAgLy8tLS0tLSBhZGQgY2VsbCBhbmQgdXBkYXRlIGNvbnRlbnQncyBoZWlnaHQgLS0tLS0vLwogICAgZnVuY3Rpb24gYWRkQ2VsbDJTY3JvbGxWaWV3KGMpIHsKICAgICAgICBiZ1Njcm9sbEJhc2UuYWRkQ2hpbGQoYyk7CiAgICAgICAgLy8tLS0tLSB1cGRhdGUgc2Nyb2xsIGRpcyAtLS0tLS8vCiAgICAgICAgY29udGVudEggKz0gYy5oZWlnaHQoKTsKICAgICAgICB1cGRhdGVTY3JvbGxTdGF0ZSgpOwogICAgfQoKCgoKICAgIHZhciBiZ1Jvb3QgPSBuZXcgU3ByaXRlKCk7CiAgICBiZ1Jvb3QuaW5pdERpdigpOwogICAgaWYoIGlzSW5wdXRWYWxpZCh2KSYmaXNJbnB1dFZhbGlkKHYuYmdDb2xvcikgKSB7CiAgICAgICAgYmdSb290LmNvbG9ySGV4KHYuYmdDb2xvcik7CiAgICB9CiAgICBiZ1Jvb3QuZnJhbWUoeHgseXksd3csaGgpOwoKCiAgICB2YXIgY29udGVudCA9IG5ldyBTcHJpdGUoKTsKICAgIGNvbnRlbnQuaW5pdERpdigpOwogICAgY29udGVudC5mcmFtZSgwLDAsMixjb250ZW50SCk7CgogICAgdmFyIGJnU2Nyb2xsQmFzZSA9IG5ldyBTcHJpdGUoKTsKICAgIGJnU2Nyb2xsQmFzZS5pbml0RGl2KCk7CiAgICBiZ1Njcm9sbEJhc2UuZnJhbWUoMCwwLGJnUm9vdC53aWR0aCgpKzIwLGJnUm9vdC5oZWlnaHQoKSk7CiAgICBiZ1Njcm9sbEJhc2Uuc2Nyb2xsVmVydGljYWwoKTsKICAgIGJnU2Nyb2xsQmFzZS5hZGRDaGlsZChjb250ZW50KTsKICAgIGJnUm9vdC5hZGRDaGlsZChiZ1Njcm9sbEJhc2UpOwoKICAgIC8vLS0tLS0gZ2V0IHNjcm9sbC1iYXIncyBoZWlnaHQgYmFzZWQgb24gYmcgYW5kIGNlbGwtY29udGVudCdzIGhlaWdodCAtLS0tLS8vCiAgICBmdW5jdGlvbiBnZXRCYXJIKCkgewogICAgICAgIHJldHVybiBiZ1Jvb3QuaGVpZ2h0KCkqKGJnUm9vdC5oZWlnaHQoKS9jb250ZW50LmhlaWdodCgpKTsKICAgIH0KICAgIC8vLS0tLS0gbWFrZSBzY3JvbGwtYmFyIGJpZ2dlciB3aGVuIHVzZXIgd2FudHMgdG8gZHJhZyBvbiBpdCAtLS0tLS8vCiAgICBmdW5jdGlvbiBtYWtlQmFyQmlnZ2VyKHYpIHsKICAgICAgICBpZiggaXNJbnB1dEJvb2xlYW4odikgKSB7CiAgICAgICAgICAgIGlmKCB2PT09dHJ1ZSApIHsKICAgICAgICAgICAgICAgIHNjcm9sbGJhci5hbmlCeUNTUyhiYXJBbmlTcGVlZCx7d2lkdGg6YmFyV2lkdGhNYXgsYm9yZGVyUmFkaXVzOmJhcldpZHRoTWF4LzJ9LGZhbHNlLG51bGwpOwogICAgICAgICAgICAgICAgLy8tLS0tLSB3aGVuIHJlYWR5IGRyYWdnaW5nIGJhciwgZGlzYWJsZSBiYXIncyBhdXRvIGhpZGUgLS0tLS0vLwogICAgICAgICAgICAgICAgc2Nyb2xsYmFyQW5pSGlkZShmYWxzZSk7CiAgICAgICAgICAgICAgICBzdGFydEJhckF1dG9IaWRlVGltZXIoZmFsc2UpOwogICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgc2Nyb2xsYmFyLmFuaUJ5Q1NTKGJhckFuaVNwZWVkLHt3aWR0aDpiYXJXaWR0aE1pbixib3JkZXJSYWRpdXM6YmFyV2lkdGhNaW4vMn0sZmFsc2UsbnVsbCk7CiAgICAgICAgICAgICAgICAvLy0tLS0tIHdoZW4gbm90IGRyYWdnaW5nIC0tLS0tLy8KICAgICAgICAgICAgICAgIGlmKCFpc0FsbG93RHJhZykKICAgICAgICAgICAgICAgICAgICBzdGFydEJhckF1dG9IaWRlVGltZXIoKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KCiAgICB2YXIgaXNBbGxvd0RyYWcgPSBmYWxzZTsKICAgIHZhciBkcmFnUG9zWVN0YXJ0ID0gMDsKICAgIHZhciBkcmFnUG9zWUVuZCA9IDA7CiAgICB2YXIgbGFzdEJhclBvc1kgPSAwOwogICAgdmFyIGRyYWdEaXMgPSAwOwogICAgdmFyIHNjcm9sbGJhciA9IG5ldyBTcHJpdGUoKTsKICAgIHNjcm9sbGJhci5pbml0RGl2KCk7CiAgICBzY3JvbGxiYXIuZnJhbWUobnVsbCwwLGJhcldpZHRoTWluLDUwLDMsbnVsbCk7CiAgICBpZiggaXNCYXJDb2xvcldoaXRlICkgewogICAgICAgIHNjcm9sbGJhci5jb2xvckhleCgnZmZmZmZmJyk7CiAgICB9IGVsc2UgewogICAgICAgIHNjcm9sbGJhci5jb2xvckhleCgnMDAwMDAwJyk7CiAgICB9CiAgICBzY3JvbGxiYXIuYm9yZGVyKC4xLCc5MDkwOTAnLHRydWUpOwogICAgc2Nyb2xsYmFyLmFscGhhKGJhckFscGhhKTsKICAgIHNjcm9sbGJhci5jb3JuZXJSYWRpdXMoc2Nyb2xsYmFyLndpZHRoKCkvMik7CiAgICBzY3JvbGxiYXIubWFrZUN1cnNvck5vcm1hbCgpOwogICAgc2Nyb2xsYmFyLmhlaWdodCggZ2V0QmFySCgpICk7CiAgICBiZ1Jvb3QuYWRkQ2hpbGQoc2Nyb2xsYmFyKTsKICAgIHZhciBzY3JvbGxEaXNNYXggPSBiZ1Jvb3QuaGVpZ2h0KCktc2Nyb2xsYmFyLmhlaWdodCgpOwogICAgdmFyIHNjcm9sbERpc01pbiA9IDA7CgoKCiAgICAvLy0tLS0tIGxldCBzY3JvbGwtYmFyIGF1dG8gaGlkZSAtLS0tLS8vCiAgICB2YXIgdGltZXJCYXJBdXRvSGlkZSA9IG51bGw7CiAgICBmdW5jdGlvbiBzY3JvbGxiYXJBbmlIaWRlKHYpIHsKICAgICAgICBpZiggIWlzSW5wdXRWYWxpZCh2KSB8fCBpc0lucHV0Qm9vbGVhbih2KSYmdj09PXRydWUgKSB7CiAgICAgICAgICAgIHNjcm9sbGJhci5hbmlCeUFscGhhKGJhckFuaVNwZWVkLCAwLCBmdW5jdGlvbiAoKSB7CiAgICAgICAgICAgICAgICBzY3JvbGxiYXIuaGlkZGVuKHRydWUpOwogICAgICAgICAgICB9KTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgICBpZiAoc2Nyb2xsYmFyLmFscGhhKCkudG9TdHJpbmcoKT09PScwJykgewogICAgICAgICAgICAgICAgc2Nyb2xsYmFyLmhpZGRlbihmYWxzZSk7CiAgICAgICAgICAgICAgICBzY3JvbGxiYXIuYW5pQnlDU1MoYmFyQW5pU3BlZWQsIHthbHBoYTogYmFyQWxwaGF9LCBmYWxzZSwgbnVsbCk7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CiAgICBmdW5jdGlvbiBzdGFydEJhckF1dG9IaWRlVGltZXIodikgewogICAgICAgIGlmKCBpc0JhckF1dG9IaWRlICkgewogICAgICAgICAgICBpZiAoIWlzSW5wdXRWYWxpZCh2KSB8fCBpc0lucHV0Qm9vbGVhbih2KSAmJiB2ID09PSB0cnVlKSB7CiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyQmFyQXV0b0hpZGUpOwogICAgICAgICAgICAgICAgdGltZXJCYXJBdXRvSGlkZSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHsKICAgICAgICAgICAgICAgICAgICBzY3JvbGxiYXJBbmlIaWRlKCk7CiAgICAgICAgICAgICAgICAgICAgc3RhcnRCYXJBdXRvSGlkZVRpbWVyKGZhbHNlKTsKICAgICAgICAgICAgICAgIH0sIGJhckF1dG9IaWRlVGltZSk7CiAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyQmFyQXV0b0hpZGUpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQogICAgYmdSb290LmFkZE1vdXNlT3ZlcihmdW5jdGlvbigpIHsKICAgICAgICBpZiggaXNCYXJBcHBlYXJXaGVuT3ZlciApIHsKICAgICAgICAgICAgc2Nyb2xsYmFyQW5pSGlkZShmYWxzZSk7CiAgICAgICAgICAgIHN0YXJ0QmFyQXV0b0hpZGVUaW1lcigpOwogICAgICAgIH0KICAgIH0pOwogICAgLy8tLS0tLSBsZXQgc2Nyb2xsLWJhciBhdXRvIGhpZGUgLS0tLS0vLwoKCiAgICAvLy0tLS0tIHdoZW4gZHJhZ2dpbmcgc2Nyb2xsLWJhciAtLS0tLS8vCiAgICBzY3JvbGxiYXIuYWRkTW91c2VEb3duKGZ1bmN0aW9uKGUpIHsKICAgICAgICAvLy0tLS0tIHNhdmUgbW91c2UtcG9zIGFuZCByZWFkeSBmb3IgZHJhZyAtLS0tLS8vCiAgICAgICAgbGFzdEJhclBvc1kgPSBzY3JvbGxiYXIudG9wKCk7CiAgICAgICAgZHJhZ1Bvc1lTdGFydCA9IHNjcm9sbGJhci50b3AoKStlLm9mZnNldFkreXk7CiAgICAgICAgaXNBbGxvd0RyYWcgPSB0cnVlOwogICAgfSk7CiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uKCkgewogICAgICAgIC8vLS0tLS0gbm90IGFsbG93IGRyYWcgLS0tLS0vLwogICAgICAgIGlzQWxsb3dEcmFnID0gZmFsc2U7CiAgICAgICAgLy8tLS0tLSBkbyBub3Qgc3RhcnQgYXV0byBoaWRlIHRpbWVyIHdoZW4gY3Vyc29yIHN0aWxsIG9uIHNjcm9sbC1iYXIgLS0tLS0vLwogICAgICAgIGlmKHNjcm9sbGJhci53aWR0aCgpIT09YmFyV2lkdGhNYXgpCiAgICAgICAgICAgIHN0YXJ0QmFyQXV0b0hpZGVUaW1lcigpOwogICAgfSwgZmFsc2UpOwogICAgc2Nyb2xsYmFyLmFkZE1vdXNlT3ZlcihmdW5jdGlvbigpIHsKICAgICAgICAvLy0tLS0tIGxldCBiYXIgc2l6ZSBiaWdnZXIgZm9yIHVzZXIgZWFzeSB0byBkcmFnIC0tLS0tLy8KICAgICAgICBtYWtlQmFyQmlnZ2VyKHRydWUpOwogICAgfSk7CiAgICBzY3JvbGxiYXIuYWRkTW91c2VPdXQoZnVuY3Rpb24oKSB7CiAgICAgICAgLy8tLS0tLSBsZXQgYmFyIHJldHVybiB0byBub3JtYWwtc2l6ZSAtLS0tLS8vCiAgICAgICAgbWFrZUJhckJpZ2dlcihmYWxzZSk7CiAgICB9KTsKICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihlKSB7CiAgICAgICAgaWYoIGlzQWxsb3dEcmFnICkgewoKICAgICAgICAgICAgZHJhZ1Bvc1lFbmQgPSBlLmNsaWVudFk7CiAgICAgICAgICAgIGRyYWdEaXMgPSAoZHJhZ1Bvc1lFbmQtZHJhZ1Bvc1lTdGFydCk7CiAgICAgICAgICAgIHNjcm9sbGJhci50b3AoIGxhc3RCYXJQb3NZK2RyYWdEaXMgKTsKCiAgICAgICAgICAgIC8vLS0tLS0gcmVzdHJpY3QgYmFyJ3MgbW92ZSBhcmVhIC0tLS0tLy8KICAgICAgICAgICAgaWYoIHNjcm9sbGJhci50b3AoKT5zY3JvbGxEaXNNYXggKSB7CiAgICAgICAgICAgICAgICBzY3JvbGxiYXIudG9wKCBzY3JvbGxEaXNNYXggKTsKICAgICAgICAgICAgfQogICAgICAgICAgICBpZiggc2Nyb2xsYmFyLnRvcCgpPHNjcm9sbERpc01pbiApIHsKICAgICAgICAgICAgICAgIHNjcm9sbGJhci50b3AoIHNjcm9sbERpc01pbiApOwogICAgICAgICAgICB9CgogICAgICAgICAgICAvLy0tLS0tIGFwcGx5IGJhcidzIGRyYWctZGlzIHRvIHNjcm9sbEJhc2UgLS0tLS0vLwogICAgICAgICAgICBiZ1Njcm9sbEJhc2Uub2JqLnNjcm9sbFRvcCA9IHNjcm9sbGJhci50b3AoKSooY29udGVudC5oZWlnaHQoKS9iZ1Njcm9sbEJhc2UuaGVpZ2h0KCkpOwogICAgICAgIH0KICAgIH0sIGZhbHNlKTsKICAgIC8vLS0tLS0gd2hlbiBkcmFnZ2luZyBzY3JvbGwtYmFyIC0tLS0tLy8KCiAgICAvLy0tLS0tIGRldGVjdCBtb3VzZS13aGVlbCBhbmQgbW92ZSBzY3JvbGwtYmFyIC0tLS0tLy8KICAgIGJnU2Nyb2xsQmFzZS5vYmouYWRkRXZlbnRMaXN0ZW5lcigic2Nyb2xsIiwgZnVuY3Rpb24oKSB7CiAgICAgICAgdmFyIHBvc3kgPSBiZ1Njcm9sbEJhc2UuaGVpZ2h0KCkqKGJnU2Nyb2xsQmFzZS5vYmouc2Nyb2xsVG9wL2NvbnRlbnQuaGVpZ2h0KCkpOwogICAgICAgIHNjcm9sbGJhci50b3AocG9zeSk7CgogICAgICAgIC8vLS0tLS0gc2hvdyBiYXIgd2hlbiBzY3JvbGwtd2hlZWwgLS0tLS0vLwogICAgICAgIHNjcm9sbGJhckFuaUhpZGUoZmFsc2UpOwogICAgICAgIC8vLS0tLS0gZG8gbm90IHN0YXJ0IGF1dG8gaGlkZSB0aW1lciB3aGVuIGRyYWdnaW5nIC0tLS0tLy8KICAgICAgICBpZiggIWlzQWxsb3dEcmFnICkKICAgICAgICAgICAgc3RhcnRCYXJBdXRvSGlkZVRpbWVyKCk7CiAgICB9KTsKCgoKCgogICAgdXBkYXRlU2Nyb2xsU3RhdGUoKTsKICAgIHN0YXJ0QmFyQXV0b0hpZGVUaW1lcigpOwoKfQoKCmZ1bmN0aW9uIEFsZXJ0KHRpdGxlLG9uQnRuT0ssb25CdG5DYW5jZWwsb25NYXNrQ2xpY2spIHsKICAgIHZhciBtYXNrQWxwaGEgPSAuNzsKICAgIGZ1bmN0aW9uIHJlbW92ZUFsZXJ0KCkgewogICAgICAgIHQxLnJlbW92ZUZyb21QYXJlbnQoKTsKICAgICAgICB0MSA9IG51bGw7CiAgICAgICAgdjEucmVtb3ZlRnJvbVBhcmVudCgpOwogICAgICAgIHYxID0gbnVsbDsKICAgICAgICBiZy5yZW1vdmVGcm9tUGFyZW50KCk7CiAgICAgICAgYmcgPSBudWxsOwogICAgfQogICAgZnVuY3Rpb24gZmFkZU91dEFuZFJlbW92ZSgpIHsKICAgICAgICBiZy5hbmlCeUFscGhhKC4xLDAsZnVuY3Rpb24gKCkgewogICAgICAgICAgICByZW1vdmVBbGVydCgpOwogICAgICAgIH0pOwogICAgfQogICAgdmFyIGJnID0gbmV3IFNwcml0ZSgpOwogICAgYmcuaW5pdERpdigpOwogICAgYmcudG9wKDApOwogICAgYmcubGVmdCgwKTsKICAgIGJnLndpZHRoKCIxMDAlIik7CiAgICBiZy5oZWlnaHQoIjEwMCUiKTsKICAgIGJnLmFwcGx5WkluZGV4KDk5KTsKICAgIHZhciBtYXNrID0gbmV3IFNwcml0ZSgpOwogICAgbWFzay5pbml0RGl2KCk7CiAgICBtYXNrLnRvcCgwKTsKICAgIG1hc2subGVmdCgwKTsKICAgIG1hc2sud2lkdGgoIjEwMCUiKTsKICAgIG1hc2suaGVpZ2h0KCIxMDAlIik7CiAgICBtYXNrLmNvbG9yKDAsMCwwKTsKICAgIG1hc2suYWxwaGEoMCk7CiAgICBtYXNrLmFkZE1vdXNlQ2xpY2soZnVuY3Rpb24gKCkgewogICAgICAgIGlmKCBpc0lucHV0VmFsaWQob25NYXNrQ2xpY2spJiZpc0lucHV0RnVuY1R5cGUob25NYXNrQ2xpY2spICkgewogICAgICAgICAgICBvbk1hc2tDbGljaygpOwogICAgICAgIH0KICAgICAgICBmYWRlT3V0QW5kUmVtb3ZlKCk7CiAgICB9KTsKICAgIHZhciB2MSA9IG5ldyBTcHJpdGUoKTsKICAgIHYxLmluaXREaXYoKTsKICAgIHYxLndpZHRoKDQwMCk7CiAgICB2MS5oZWlnaHQoMjMwKTsKICAgIHYxLmNvbG9ySGV4KCJmNmY2ZjYiKTsKICAgIHYxLmNvcm5lclJhZGl1cygxMik7CiAgICB2MS5hbGlnbkNlbnRlcigpOwogICAgdjEudG9wKHYxLmNvbnRlbnRUb3AoKS01MCk7CiAgICB2MS5zaGFkb3coMCwwLDE1LC42KTsKICAgIHYxLmFscGhhKDApOwoKCiAgICAvLy0tLS0tIGFsZXJ0J3MgY29udGVudCBoZXJlIC0tLS0tLy8KICAgIHZhciBib3JkZXJEaXMgPSAxODsKICAgIHZhciBidG5Cb3JkZXJEaXMgPSA2OwogICAgdmFyIGJ0bkhlaWdodCA9IDYwOwogICAgdmFyIHQxID0gbmV3IFNwcml0ZSgpOwogICAgdDEuaW5pdERpdigpOwogICAgdmFyIHNhZmVIZWlnaHQgPSB2MS5oZWlnaHQoKS1ib3JkZXJEaXMqMi02LTYwOwogICAgdDEuZnJhbWUoYm9yZGVyRGlzLGJvcmRlckRpcyx2MS53aWR0aCgpLWJvcmRlckRpcyoyLG51bGwpOwogICAgdDEuYXBwbHlUZXh0KHRpdGxlKTsKICAgIHQxLnRleHRTaXplKDI2KTsKICAgIHQxLnRleHRDb2xvcigiNWM1YzVjIik7CiAgICB0MS5vYmouc3R5bGUubGluZUhlaWdodCA9ICcyOHB4JzsKICAgIC8vLS0tLS0gY2hlY2sgY29udGVudCdzIGhlaWdodCBleGNlZWQgZGlhbG9ndWUgZGVmYXVsdCBoZWlnaHQgLS0tLS0vLwogICAgaWYoIHQxLmNvbnRlbnRIZWlnaHQoKTxzYWZlSGVpZ2h0ICkgewogICAgICAgIHQxLnRvcChib3JkZXJEaXMrKHNhZmVIZWlnaHQvMiktdDEuY29udGVudEhlaWdodCgpLzIpOwogICAgICAgIHZhciBob3dNYW55TGluZXMgPSB0MS5jb250ZW50SGVpZ2h0KCkvcGFyc2VJbnQodDEub2JqLnN0eWxlLmxpbmVIZWlnaHQucmVwbGFjZSgncHgnLCcnKSk7CiAgICAgICAgLy8tLS0tLSBpZiBjb250ZW50IG9ubHkgMSBsaW5lLCBtYWtlIHRleHQgYWxpZ24gY2VudGVyIC0tLS0tLy8KICAgICAgICBpZiggaG93TWFueUxpbmVzIDw9IDEgKSB7CiAgICAgICAgICAgIHQxLnRleHRBbGlnbkNlbnRlcigpOwogICAgICAgIH0KICAgIH0gZWxzZSB7CiAgICAgICAgLy8tLS0tLSBjb250ZW50J3MgaGVpZ2h0IGV4Y2VlZCBkaWFsb2d1ZSBoZWlnaHQsIG1ha2UgZGlhbG9ndWUgYmlnZ2VyIC0tLS0tLy8KICAgICAgICB2MS5oZWlnaHQodDEuY29udGVudEhlaWdodCgpK2JvcmRlckRpcyoyK2J0bkJvcmRlckRpcyoyK2J0bkhlaWdodCk7CiAgICB9CgogICAgYmcuYWRkQ2hpbGQobWFzayk7CiAgICBiZy5hZGRDaGlsZCh2MSk7CiAgICB2MS5hZGRDaGlsZCh0MSk7CgogICAgbWFzay5hbmlCeUFscGhhKC4xLG1hc2tBbHBoYSxudWxsKTsKICAgIHYxLmFuaUJ5QWxwaGEoLjIsMSxudWxsKTsKICAgIHYxLmFuaV95KC4yLHYxLnRvcCgpLTUwLGZhbHNlLG51bGwsbnVsbCk7CgogICAgZnVuY3Rpb24gYWRkQnRuQnlDb3VudCh2KSB7CiAgICAgICAgdmFyIGRpcyA9IDY7CiAgICAgICAgdmFyIGNvbG9yR3JlZW4gPSAiMjNiNTc0IjsKICAgICAgICB2YXIgY29sb3JCbHVlID0gIjIzYjViMyI7CiAgICAgICAgdmFyIGNvbG9yT3ZlciA9ICIwMDk2NTMiOwogICAgICAgIHZhciBjb2xvckRvd24gPSAiZmZhODAwIjsKICAgICAgICB2YXIgYnRuVGV4dFNpemUgPSAyNjsKICAgICAgICB2YXIgYnRuQ29ybmVyUiA9IDY7CiAgICAgICAgc3dpdGNoKHYpIHsKICAgICAgICAgICAgY2FzZSAxOgogICAgICAgICAgICAgICAgdmFyIGIxID0gbmV3IFNwcml0ZSgpOwogICAgICAgICAgICAgICAgYjEuaW5pdEJ0bigi56K6IOWumiIpOwogICAgICAgICAgICAgICAgYjEuYm90dG9tKGRpcyk7CiAgICAgICAgICAgICAgICBiMS5sZWZ0KGRpcyk7CiAgICAgICAgICAgICAgICBiMS53aWR0aCh2MS53aWR0aCgpLWRpcyoyKTsKICAgICAgICAgICAgICAgIGIxLmhlaWdodChidG5IZWlnaHQpOwogICAgICAgICAgICAgICAgYjEuY29sb3JIZXgoY29sb3JHcmVlbik7CiAgICAgICAgICAgICAgICBiMS5jb3JuZXJSYWRpdXMoYnRuQ29ybmVyUik7CiAgICAgICAgICAgICAgICBiMS50ZXh0Q29sb3IoImZmZmZmZiIpOwogICAgICAgICAgICAgICAgYjEudGV4dFNpemUoYnRuVGV4dFNpemUpOwogICAgICAgICAgICAgICAgYjEuYWRkTW91c2VPdmVyKGZ1bmN0aW9uICgpIHsKICAgICAgICAgICAgICAgICAgICBiMS5jb2xvckhleChjb2xvck92ZXIpOwogICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgICAgICBiMS5hZGRNb3VzZU91dChmdW5jdGlvbiAoKSB7CiAgICAgICAgICAgICAgICAgICAgYjEuY29sb3JIZXgoY29sb3JHcmVlbik7CiAgICAgICAgICAgICAgICB9KTsKICAgICAgICAgICAgICAgIGIxLmFkZE1vdXNlRG93bihmdW5jdGlvbiAoKSB7CiAgICAgICAgICAgICAgICAgICAgYjEuY29sb3JIZXgoY29sb3JEb3duKTsKICAgICAgICAgICAgICAgIH0pOwogICAgICAgICAgICAgICAgYjEuYWRkTW91c2VVcChmdW5jdGlvbiAoKSB7CiAgICAgICAgICAgICAgICAgICAgYjEuY29sb3JIZXgoY29sb3JHcmVlbik7CiAgICAgICAgICAgICAgICB9KTsKICAgICAgICAgICAgICAgIGIxLmFkZE1vdXNlQ2xpY2soZnVuY3Rpb24gKCkgewogICAgICAgICAgICAgICAgICAgIGlmKCBpc0lucHV0RnVuY1R5cGUob25CdG5PSykgKSB7CiAgICAgICAgICAgICAgICAgICAgICAgIG9uQnRuT0soKTsKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgZmFkZU91dEFuZFJlbW92ZSgpOwogICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgICAgICB2MS5hZGRDaGlsZChiMSk7CiAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgY2FzZSAyOgogICAgICAgICAgICAgICAgdmFyIGIyID0gbmV3IFNwcml0ZSgpOwogICAgICAgICAgICAgICAgYjIuaW5pdEJ0bigi56K6IOWumiIpOwogICAgICAgICAgICAgICAgYjIuYm90dG9tKGRpcyk7CiAgICAgICAgICAgICAgICBiMi5yaWdodChkaXMpOwogICAgICAgICAgICAgICAgYjIud2lkdGgodjEud2lkdGgoKS8yLWRpcyoxLjUpOwogICAgICAgICAgICAgICAgYjIuaGVpZ2h0KGJ0bkhlaWdodCk7CiAgICAgICAgICAgICAgICBiMi5jb2xvckhleChjb2xvckdyZWVuKTsKICAgICAgICAgICAgICAgIGIyLmNvcm5lclJhZGl1cyhidG5Db3JuZXJSKTsKICAgICAgICAgICAgICAgIGIyLnRleHRDb2xvcigiZmZmZmZmIik7CiAgICAgICAgICAgICAgICBiMi50ZXh0U2l6ZShidG5UZXh0U2l6ZSk7CiAgICAgICAgICAgICAgICBiMi5hZGRNb3VzZU92ZXIoZnVuY3Rpb24gKCkgewogICAgICAgICAgICAgICAgICAgIGIyLmNvbG9ySGV4KGNvbG9yT3Zlcik7CiAgICAgICAgICAgICAgICB9KTsKICAgICAgICAgICAgICAgIGIyLmFkZE1vdXNlT3V0KGZ1bmN0aW9uICgpIHsKICAgICAgICAgICAgICAgICAgICBiMi5jb2xvckhleChjb2xvckdyZWVuKTsKICAgICAgICAgICAgICAgIH0pOwogICAgICAgICAgICAgICAgYjIuYWRkTW91c2VEb3duKGZ1bmN0aW9uICgpIHsKICAgICAgICAgICAgICAgICAgICBiMi5jb2xvckhleChjb2xvckRvd24pOwogICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgICAgICBiMi5hZGRNb3VzZVVwKGZ1bmN0aW9uICgpIHsKICAgICAgICAgICAgICAgICAgICBiMi5jb2xvckhleChjb2xvckdyZWVuKTsKICAgICAgICAgICAgICAgIH0pOwogICAgICAgICAgICAgICAgYjIuYWRkTW91c2VDbGljayhmdW5jdGlvbiAoKSB7CiAgICAgICAgICAgICAgICAgICAgaWYoIGlzSW5wdXRGdW5jVHlwZShvbkJ0bk9LKSApIHsKICAgICAgICAgICAgICAgICAgICAgICAgb25CdG5PSygpOwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICBmYWRlT3V0QW5kUmVtb3ZlKCk7CiAgICAgICAgICAgICAgICB9KTsKICAgICAgICAgICAgICAgIHYxLmFkZENoaWxkKGIyKTsKICAgICAgICAgICAgICAgIHZhciBiMyA9IG5ldyBTcHJpdGUoKTsKICAgICAgICAgICAgICAgIGIzLmluaXRCdG4oIuWPliDmtogiKTsKICAgICAgICAgICAgICAgIGIzLmJvdHRvbShkaXMpOwogICAgICAgICAgICAgICAgYjMubGVmdChkaXMpOwogICAgICAgICAgICAgICAgYjMud2lkdGgodjEud2lkdGgoKS8yLWRpcyoxLjUpOwogICAgICAgICAgICAgICAgYjMuaGVpZ2h0KGJ0bkhlaWdodCk7CiAgICAgICAgICAgICAgICBiMy5jb2xvckhleChjb2xvckJsdWUpOwogICAgICAgICAgICAgICAgYjMuY29ybmVyUmFkaXVzKGJ0bkNvcm5lclIpOwogICAgICAgICAgICAgICAgYjMudGV4dENvbG9yKCJmZmZmZmYiKTsKICAgICAgICAgICAgICAgIGIzLnRleHRTaXplKGJ0blRleHRTaXplKTsKICAgICAgICAgICAgICAgIGIzLmFkZE1vdXNlT3ZlcihmdW5jdGlvbiAoKSB7CiAgICAgICAgICAgICAgICAgICAgYjMuY29sb3JIZXgoIjFhODc4YiIpOwogICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgICAgICBiMy5hZGRNb3VzZU91dChmdW5jdGlvbiAoKSB7CiAgICAgICAgICAgICAgICAgICAgYjMuY29sb3JIZXgoY29sb3JCbHVlKTsKICAgICAgICAgICAgICAgIH0pOwogICAgICAgICAgICAgICAgYjMuYWRkTW91c2VEb3duKGZ1bmN0aW9uICgpIHsKICAgICAgICAgICAgICAgICAgICBiMy5jb2xvckhleChjb2xvckRvd24pOwogICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgICAgICBiMy5hZGRNb3VzZVVwKGZ1bmN0aW9uICgpIHsKICAgICAgICAgICAgICAgICAgICBiMy5jb2xvckhleChjb2xvckJsdWUpOwogICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgICAgICBiMy5hZGRNb3VzZUNsaWNrKGZ1bmN0aW9uICgpIHsKICAgICAgICAgICAgICAgICAgICBpZiggaXNJbnB1dEZ1bmNUeXBlKG9uQnRuQ2FuY2VsKSApIHsKICAgICAgICAgICAgICAgICAgICAgICAgb25CdG5DYW5jZWwoKTsKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgZmFkZU91dEFuZFJlbW92ZSgpOwogICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgICAgICB2MS5hZGRDaGlsZChiMyk7CiAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICB9CiAgICBpZiggaXNJbnB1dFZhbGlkKG9uQnRuT0spICYmIGlzSW5wdXRWYWxpZChvbkJ0bkNhbmNlbCkmJmlzSW5wdXRGdW5jVHlwZShvbkJ0bkNhbmNlbCkgKSB7CiAgICAgICAgYWRkQnRuQnlDb3VudCgyKTsKICAgIH0gZWxzZSB7CiAgICAgICAgYWRkQnRuQnlDb3VudCgxKTsKICAgIH0KCn0KCi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioKICogVGlwQm94CiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCiAqIEVYOiBuZXcgVGlwQm94KHt0cmlEaXJlY3Rpb246MCx4OjEwMCx5OjEwMCx3OjQwMCxoOjEwMCx0cmlhbmdsZVc6MzAsdHJpYW5nbGVIOjIwLAogICAgYmdDb2xvcjonMDA5OTAwJyxjb3JuZXJSOjEwLHRpcDonRUFSVEggU1BPVD1sb3Zl5oSb5Zyw55CDJyx0ZXh0Q29sb3I6J2ZmZmZmZicsdGV4dFNpemU6JzI1JywKICAgIGlzVHJpVG9wUG9zOnRydWUsaXNTaGFkb3c6dHJ1ZSxzaGFkb3dEaXM6MjIsc2hhZG93QWxwaGE6Ljd9KTsKICoKICogVHJpYW5nbGUtRGlyZWN0aW9uOiAwLU5vcnRoLDEtRWFzdCwyLVNvdXRoLDMtV2VzdAogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqLwpmdW5jdGlvbiBUaXBCb3godikgewoKICAgIHZhciB4eCA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCd4JywxMDApOwogICAgdmFyIHl5ID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ3knLDEwMCk7CiAgICB2YXIgd3cgPSB1c2VGdW5jSW5wdXRPckRlZmF1bHQodiwndycsMjAwKTsKICAgIHZhciBoaCA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCdoJyw1MCk7CiAgICAvLy0tLS0tIHRyaWFuZ2xlJ3MgZGlyZWN0aW9uOm5vcnRoLGVhc3Qsc291dGgsd2VzdCAvIDAsMSwyLDMgLS0tLS0vLwogICAgdmFyIHRyaURpcmVjdGlvbiA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCd0cmlEaXJlY3Rpb24nLDApOwogICAgLy8tLS0tLSBzaGFwZSB0cmlhbmdsZSAtLS0tLS8vCiAgICB2YXIgdHJpYW5nbGVXID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ3RyaWFuZ2xlVycsMjApOwogICAgdmFyIHRyaWFuZ2xlSCA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCd0cmlhbmdsZUgnLDEwKTsKICAgIHZhciBiZ0NvbG9yID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ2JnQ29sb3InLCc0ZTg4NmYnKTsKICAgIHZhciBjb3JuZXJSID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ2Nvcm5lclInLDcpOwogICAgdmFyIHRpcCA9IHVzZUZ1bmNJbnB1dE9yRGVmYXVsdCh2LCd0aXAnLCdNRVNTQUdFIEhFUkUnKTsKICAgIHZhciB0ZXh0Q29sb3IgPSB1c2VGdW5jSW5wdXRPckRlZmF1bHQodiwndGV4dENvbG9yJywnZmZmZmZmJyk7CiAgICB2YXIgdGV4dFNpemUgPSB1c2VGdW5jSW5wdXRPckRlZmF1bHQodiwndGV4dFNpemUnLCcyMCcpOwogICAgLy8tLS0tLSBsZXQgeCx5IHBvcyBiZWNvbWUgdGlwLWJveCdzIHRyaWFuZ2xlIHRvcCBwb3NpdGlvbiAtLS0tLS8vCiAgICB2YXIgaXNUcmlUb3BQb3MgPSB1c2VGdW5jSW5wdXRPckRlZmF1bHQodiwnaXNUcmlUb3BQb3MnLHRydWUpOwogICAgLy8tLS0tLSBhZGQgc2hhZG93IGhlcmUgLS0tLS0vLwogICAgdmFyIGlzU2hhZG93ID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ2lzU2hhZG93JyxmYWxzZSk7CiAgICB2YXIgc2hhZG93RGlzID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ3NoYWRvd0RpcycsMTUpOwogICAgdmFyIHNoYWRvd0FscGhhID0gdXNlRnVuY0lucHV0T3JEZWZhdWx0KHYsJ3NoYWRvd0FscGhhJywuOCk7CiAgICAvLy0tLS0tIHJvb20gc3BhY2UgZm9yIGFkZGluZyBzaGFkb3cgb24gYmdDb3JuZXIgLS0tLS0vLwogICAgdmFyIHNoYWRvd1NwYWNlID0gaXNJbnB1dFZhbGlkKHYpJiZpc0lucHV0VmFsaWQodi5zaGFkb3dEaXMpP3Yuc2hhZG93RGlzKjI6MjA7CgoKICAgIHZhciBiZ1Jvb3QgPSBuZXcgU3ByaXRlKCk7CiAgICBiZ1Jvb3QuaW5pdERpdigpOwogICAgYmdSb290LmZyYW1lKHh4LHl5LHd3K3NoYWRvd1NwYWNlLGhoK3NoYWRvd1NwYWNlKTsKICAgIC8vLS0tLS0gREVCVUcgVVNBR0UgLS0tLS0vLwovLyAgICAgICAgYmdSb290LmNvbG9ySGV4KCcwMDAwMDAnKTtiZ1Jvb3QuYWxwaGEoLjUpOwogICAgLy8tLS0tLSBERUJVRyBVU0FHRSAtLS0tLS8vCgogICAgdmFyIGJnQ29ybmVyID0gbmV3IFNwcml0ZSgpOwogICAgYmdDb3JuZXIuaW5pdERpdigpOwogICAgYmdDb3JuZXIuZnJhbWUoMCwwLHd3LGhoKTsKICAgIGJnQ29ybmVyLmNvbG9ySGV4KGJnQ29sb3IpOwogICAgYmdDb3JuZXIuY29ybmVyUmFkaXVzKGNvcm5lclIpOwogICAgYmdSb290LmFkZENoaWxkKGJnQ29ybmVyKTsKCiAgICB2YXIgc2hhcGVUcmkgPSBuZXcgU3ByaXRlKCk7CiAgICBzaGFwZVRyaS5pbml0VHJpYW5nbGUobnVsbCx0cmlhbmdsZVcsdHJpYW5nbGVILGJnQ29sb3IpOwogICAgLy8tLS0tLSBERUJVRyBVU0FHRSAtLS0tLS8vCi8vICAgICAgICBzaGFwZVRyaS5jb2xvckhleCgnMDAwMDk5Jyk7CiAgICAvLy0tLS0tIERFQlVHIFVTQUdFIC0tLS0tLy8KICAgIC8vLS0tLS0gc2V0IHJvdGF0ZSdzIG9yaWdpbiB0byBsZWZ0LXRvcCBjb3JuZXIgLS0tLS0vLwogICAgc2hhcGVUcmkub2JqLnN0eWxlLmNzc1RleHQgKz0gJ3RyYW5zZm9ybS1vcmlnaW46MCUgMCU7JzsKICAgIGJnUm9vdC5hZGRDaGlsZChzaGFwZVRyaSk7CiAgICBzd2l0Y2goIHRyaURpcmVjdGlvbiApIHsKICAgICAgICBjYXNlIDA6ICAgICAvLyBOCiAgICAgICAgICAgIGJnUm9vdC5oZWlnaHQodHJpYW5nbGVIK2hoK3NoYWRvd1NwYWNlKTsKICAgICAgICAgICAgc2hhcGVUcmkucm90YXRlKDApOwogICAgICAgICAgICBzaGFwZVRyaS50b3Aoc2hhZG93U3BhY2UvMik7CiAgICAgICAgICAgIHNoYXBlVHJpLmxlZnQoYmdSb290LndpZHRoKCkvMi10cmlhbmdsZVcvMik7CiAgICAgICAgICAgIGJnQ29ybmVyLnRvcChzaGFwZVRyaS50b3AoKSt0cmlhbmdsZUgpOwogICAgICAgICAgICBiZ0Nvcm5lci5sZWZ0KHNoYWRvd1NwYWNlLzIpOwogICAgICAgICAgICBsZXRUcmlhbmdsZVRvcEJlY29tZVhZUG9zKDApOwogICAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIDE6ICAgICAvLyBFCiAgICAgICAgICAgIGJnUm9vdC53aWR0aChzaGFkb3dTcGFjZSt3dyt0cmlhbmdsZUgpOwogICAgICAgICAgICBzaGFwZVRyaS5yb3RhdGUoOTApOwogICAgICAgICAgICBzaGFwZVRyaS5sZWZ0KGJnUm9vdC53aWR0aCgpLXNoYWRvd1NwYWNlLzIpO3NoYXBlVHJpLnRvcChiZ1Jvb3QuaGVpZ2h0KCkvMi10cmlhbmdsZVcvMik7CiAgICAgICAgICAgIGJnQ29ybmVyLmxlZnQoc2hhZG93U3BhY2UvMik7YmdDb3JuZXIudG9wKHNoYWRvd1NwYWNlLzIpOwogICAgICAgICAgICBsZXRUcmlhbmdsZVRvcEJlY29tZVhZUG9zKDEpOwogICAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIDI6ICAgICAvLyBTCiAgICAgICAgICAgIGJnUm9vdC5oZWlnaHQoc2hhZG93U3BhY2UraGgrdHJpYW5nbGVIKTsKICAgICAgICAgICAgYmdDb3JuZXIubGVmdChzaGFkb3dTcGFjZS8yKTtiZ0Nvcm5lci50b3Aoc2hhZG93U3BhY2UvMik7CiAgICAgICAgICAgIHNoYXBlVHJpLnJvdGF0ZSgxODApOwogICAgICAgICAgICBzaGFwZVRyaS50b3AoYmdSb290LmhlaWdodCgpLXNoYWRvd1NwYWNlLzIpOwogICAgICAgICAgICBzaGFwZVRyaS5sZWZ0KGJnUm9vdC53aWR0aCgpLzIrdHJpYW5nbGVXLzIpOwogICAgICAgICAgICBsZXRUcmlhbmdsZVRvcEJlY29tZVhZUG9zKDIpOwogICAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIDM6ICAgICAvLyBXCiAgICAgICAgICAgIGJnUm9vdC53aWR0aChzaGFkb3dTcGFjZSt3dyt0cmlhbmdsZUgpOwogICAgICAgICAgICBzaGFwZVRyaS5yb3RhdGUoLTkwKTsKICAgICAgICAgICAgc2hhcGVUcmkubGVmdChzaGFkb3dTcGFjZS8yKTsKICAgICAgICAgICAgc2hhcGVUcmkudG9wKGJnUm9vdC5oZWlnaHQoKS8yK3RyaWFuZ2xlVy8yKTsKICAgICAgICAgICAgYmdDb3JuZXIubGVmdCh0cmlhbmdsZUgrc2hhZG93U3BhY2UvMik7CiAgICAgICAgICAgIGJnQ29ybmVyLmFsaWduQ2VudGVyVmVydGljYWwoKTsKICAgICAgICAgICAgbGV0VHJpYW5nbGVUb3BCZWNvbWVYWVBvcygzKTsKICAgICAgICAgICAgYnJlYWs7CiAgICB9CgogICAgdmFyIHRleHQgPSBuZXcgU3ByaXRlKCk7CiAgICB0ZXh0LmluaXREaXYoKTsKICAgIHRleHQuZnJhbWUoMCwwLGJnQ29ybmVyLndpZHRoKCksYmdDb3JuZXIuaGVpZ2h0KCkpOwogICAgdGV4dC5hcHBseVRleHQodGlwKTsKICAgIHRleHQubWFrZUN1cnNvck5vcm1hbChmYWxzZSk7CiAgICB0ZXh0LnRleHRDb2xvcih0ZXh0Q29sb3IpOwogICAgdGV4dC50ZXh0U2l6ZSh0ZXh0U2l6ZSk7CiAgICB0ZXh0LnRleHRBbGlnbkNlbnRlcigpOwogICAgYmdDb3JuZXIuYWRkQ2hpbGQodGV4dCk7CgoKICAgIGZ1bmN0aW9uIGxldFRyaWFuZ2xlVG9wQmVjb21lWFlQb3ModikgewogICAgICAgIGlmKCBpc1RyaVRvcFBvcyApIHsKICAgICAgICAgICAgc3dpdGNoICh2KSB7CiAgICAgICAgICAgICAgICBjYXNlIDA6CiAgICAgICAgICAgICAgICAgICAgYmdSb290LmxlZnQoeHgtYmdSb290LndpZHRoKCkvMik7CiAgICAgICAgICAgICAgICAgICAgYmdSb290LnRvcChiZ1Jvb3QudG9wKCktc2hhZG93U3BhY2UvMik7CiAgICAgICAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgICAgICBjYXNlIDE6CiAgICAgICAgICAgICAgICAgICAgYmdSb290LnRvcChiZ1Jvb3QudG9wKCktYmdSb290LmhlaWdodCgpLzIpOwogICAgICAgICAgICAgICAgICAgIGJnUm9vdC5sZWZ0KGJnUm9vdC5sZWZ0KCktKHNoYWRvd1NwYWNlLzIrYmdDb3JuZXIud2lkdGgoKSt0cmlhbmdsZUgpKTsKICAgICAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgICAgIGNhc2UgMjoKICAgICAgICAgICAgICAgICAgICBiZ1Jvb3QudG9wKGJnUm9vdC50b3AoKS0oc2hhZG93U3BhY2UvMitiZ0Nvcm5lci5oZWlnaHQoKSt0cmlhbmdsZUgpKTsKICAgICAgICAgICAgICAgICAgICBiZ1Jvb3QubGVmdChiZ1Jvb3QubGVmdCgpLWJnUm9vdC53aWR0aCgpLzIpOwogICAgICAgICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICAgICAgY2FzZSAzOgogICAgICAgICAgICAgICAgICAgIGJnUm9vdC50b3AoYmdSb290LnRvcCgpLWJnUm9vdC5oZWlnaHQoKS8yKTsKICAgICAgICAgICAgICAgICAgICBiZ1Jvb3QubGVmdChiZ1Jvb3QubGVmdCgpLXNoYWRvd1NwYWNlLzIpOwogICAgICAgICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQoKICAgIC8vLS0tLS0gYWRkIHNoYWRvdyBoZXJlIC0tLS0tLy8KICAgIGlmKCBpc1NoYWRvdyApIHsKICAgICAgICBiZ0Nvcm5lci5zaGFkb3coMCwwLHNoYWRvd0RpcyxzaGFkb3dBbHBoYSk7CiAgICB9CgogICAgdGhpcy5iZyA9IGJnUm9vdDsKICAgIC8vLS0tLS0gRU5EIE9GIFRJUCAtLS0tLS8vCn0=';
    // var ss = 'Ly8tLS0tLS0tLS0tLS0tIFNQUklURSBDTEFTUyAtLS0tLS0tLS0tLS0tLS0tLy8KZnVuY3Rpb24gYXBwbGUoKXsKLy8gaGVsbG8gd29ybGQKfQovKiotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQogKiBBY2NvcmRpbmcgdG8gbG9hZCB0ZXh0IGZpbGUgZnJvbSBsb2NhbCBoYXZpbmcgc2VjdXJpdHkgcHJvYmxlbXMsIHN0YXRpYyBqcyBmcm9tIGhlcmUKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi8KZnVuY3Rpb24gc3VuKCl7Ci8vY29tbWVudCBsaW5lIGhlcmUKdmFyIGFhID0gJyc7CnZhciBiYiA9ICcnOwp9Ci8qKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KICogUFJPQkxFTVMoMjAxN0phbik6CiAqIDEpIE5vdG9TYW5zVEMgaXMgbm90IGFzIGdvb2QgYXMgd2UgdGhvdWdoIGluIGJyb3dzZXIncyBmb250IGRpc3BsYXkKICogMikgVGhpcyBmb250IGxldCBzbWFsbCB0ZXh0IGRpc3BsYXkgd2VsbCwgd2lsbCB0ZXN0IGluIGZ1dHVyZQogKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCiAqIDEpIEJlZm9yZSBOb3RvU2Fuc1RDIGxvYWRlZCwgdXNpbmcgdXNlcidzIGxvY2FsIGZvbnQgZm9yIGRlZmF1bHQKICogMikgV2hlbiBOb3RvU2Fuc1RDIGxvYWQgZG9uZSwgbWFrZSBOb3RvU2Fuc1RDIGZvciBkZWZhdWx0IGZvbnQgYXV0b21hdGljYWxseQogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSov';
    //----- return base64 decoded -----//
    return atob(ss);
}




/**--------------------------------------------------------------------------------------
 * DEBUG-USAGE: Show any result on sprite-text-view
---------------------------------------------------------------------------------------*/
function showResultOnScreen(v) {
    var textView = new Sprite();
    textView.initTextArea();
    textView.frame(0,0,700,500);
    textView.colorHex('009900');
    textView.textColor('FFFFFF');
    textView.textSize('12');
    textView.applyText(v);
}





///**--------------------------------------------------------------------------------------
// * DEPRECATED - Try to load text file from local, but having security problems
//---------------------------------------------------------------------------------------*/
////----- input btn on screen for open local file -----//
//document.getElementById('fileInput').addEventListener('change', readSingleFile, false);
//
////----- loaded local-file -----//
//var localFileBcore = '';
//var localFile = '';
//
//
////----- for increase test speed, we load local js directly, testonly -----//
////----- localFile should init by input and readSingleFile -----//
//readLocalFileByPath('../_com/bcore.js', function (v) {
//    //        localFileBcore = v;
//    encryptBcoreJs(v, function (v) {
//        localFileBcore = v;
//        readLocalFileByPath('./PushTarget.js', function (v) {
//            encryptTargetJs(v, localFileBcore);
//        });
//    });
//});
///**----------------------------------------------------------------
// * Read file from local path
//-----------------------------------------------------------------*/
//function readLocalFileByPath(path, func) {
//    var client = new XMLHttpRequest();
//    client.open('GET', path, true);
//    client.onreadystatechange = function () {
//        if (this.readyState == 4 && this.status == 200) {
//            func(client.responseText);
//        }
//    };
//    client.send();
//}
//function autoStartDownload(data, filename, type) {
//    var a = document.createElement("a"),
//        file = new Blob([data], {
//            type: type
//        });
//    if (window.navigator.msSaveOrOpenBlob) // IE10+
//        window.navigator.msSaveOrOpenBlob(file, filename);
//    else { // Others
//        var url = URL.createObjectURL(file);
//        a.href = url;
//        a.download = filename;
//        document.body.appendChild(a);
//        a.click();
//        setTimeout(function () {
//            document.body.removeChild(a);
//            window.URL.revokeObjectURL(url);
//        }, 0);
//    }
//}
//function readSingleFile(e) {
//
//    var file = e.target.files[0];
//    if (!file) {
//        return;
//    }
//    var reader = new FileReader();
//    reader.onload = function (e) {
//        localFile = e.target.result;
//        analysisLoadedFile();
//    };
//    reader.readAsText(file);
//}
