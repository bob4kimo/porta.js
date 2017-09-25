

/**--------------------------------------------------------------------------------------
 * Entry Point
 * --------------------------------------------------------------------------------------
 * 1. year and month in date-picker should be selected by user
 * http://fengyuanchen.github.io/datepicker/
 * https://dhtmlx.com/docs/products/dhtmlxCalendar/
 * http://demos.telerik.com/kendo-ui/datepicker/index
 * --------------------------------------------------------------------------------------
 * 1. for precise layout, maybe svg-text will be good
 * 2. already find out smallest svg format in JsTest_24.1
 * 3. NEXT: but exported svg has fixed size only, can not change size by canvas's size
 * --------------------------------------------------------------------------------------
 * 1. svg can be resize in JsTest_24, main point is inside the svg-format
 * 2. svg could be polygon or path, both can be resize-able in other practices
 ---------------------------------------------------------------------------------------*/







// mouth=0=Jan,mouth=1=Feb,Date(2017,0,1)=2017/Jan/1,Date(2017,9,1)=2017/Oct/1
var dd = new Date(2017,9,1);    // 2017-10-01
log(dd);
log('date='+dd.getDate());
log('day='+getWeekIndex(dd,true));
log('FullYear='+dd.getFullYear());
log('month='+ (dd.getMonth()+1)); // for human read month must add 1



// getMonthGridHorCount() fixed, now we can render the grid of current month,
// or previous days of last month in the first week of current month
log('total grid-day count='+getMonthGridHorCount(dd,false));


/**--------------------------------------------------------------------------------------
 * Get which day-index it is, Mon,Tue,Wed..., 0 means Mon, 1=Tue...
 * --------------------------------------------------------------------------------------
 * date: Date() object in js
 * isSundayHead: true means first day of week is sunday, false means first day is Monday
 ---------------------------------------------------------------------------------------*/
function getWeekIndex(date,isSundayHead) {
    if(isSundayHead) {
        return date.getDay();
    } else {
        if( date.getDay()===0 ) {
            return 6;
        } else {
            return date.getDay()-1;
        }
    }
}


/**--------------------------------------------------------------------------------------
 * According to ur Date() object, feed back Date()'s total days of current month
 ---------------------------------------------------------------------------------------*/
function getMonthTotalDays(date) {
    // current month +1, date=0 means previous month last date
    return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
}


/**--------------------------------------------------------------------------------------
 * Get month-grid's horizontal count, how many horizontal-line in this month-grid
 * --------------------------------------------------------------------------------------
 * Ex: 2017-Aug has 5 hor-line, 2017-Oct has 6 hor-lines
 * --------------------------------------------------------------------------------------
 * date: Date() object in js
 * isSundayHead: true means first day of week is sunday, false means first day is Monday
 ---------------------------------------------------------------------------------------*/
function getMonthGridHorCount(date,isSundayHead) {
    var monthTotalDays = getMonthTotalDays(date);
    var oneWeekDays = 7;
    // how many days we have in first week of this month
    var firstWeekDayCount = oneWeekDays-getWeekIndex(date,isSundayHead);

    //----- Round a number upward to its nearest integer -----//
    //----- ex:Math.ceil(1.4)==2 -----//
    // month's total days remove days in first week, result will arrange in following grid
    // then result divided by 7(7days a week), and we will know how many hor-grid we need to draw
    // +1 means first week we have and need to be added in
    return Math.ceil((monthTotalDays-firstWeekDayCount)/7)+1;
}



function BobDatePicker(v) {

    //----- default value for this class -----//
    var def={
        input : null,
        minDate:new Date(2016,0,1),     //2016-01-01
        maxDate:new Date(2020,11,31),   //2020-12-31
        isCht:false,
        isHeadSunday:false
    };


    //----- init all var here, if user not assign value, use default -----//
    this.input = (typeof v==='object') ? v.input : def.input;
    this.minDate = (typeof v==='object') ? v.minDate : def.minDate;
    this.maxDate = (typeof v==='object') ? v.maxDate : def.maxDate;
    this.isCht = isInputValid(v)&&isInputBoolean(v.isCht) ? v.isCht:def.isCht;
    this.isHeadSunday = isInputValid(v)&&isInputBoolean(v.isHeadSunday) ? v.isHeadSunday:def.isHeadSunday;
    //----- cht-name or en-name -----//
    var arrNameWeek = this.isCht?['一','二','三','四','五','六','日']:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    var arrNameMonth = this.isCht?['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']:['January','February','March','April','May','June','July','August','September','October','November','December'];
    //----- let sunday be the first day of week -----//
    if( this.isHeadSunday ) {
        //----- copy last obj to the first index -----//
        arrNameWeek.splice(0, 0, arrNameWeek[arrNameWeek.length-1]);
        //----- then remove the last obj we have at first index -----//
        arrNameWeek.splice(arrNameWeek.length-1, 1);
    }



    //----- all code init and runs here -----//
    var today = new Date(2017,8,31);
//    log("today is "+today);
    renderDate(today,this.isHeadSunday);


    //----- functions here -----//
    function renderDate(date,isSundayHead) {

        log('gridCount='+getDayGridCount(date,isSundayHead));
    }


    function getDayGridCount(date,isSundayHead) {
        var monthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        log('firstDay='+monthFirstDay);

        log('year='+date.getFullYear()+' month='+date.getMonth());
        var monthTotalDays = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
        log('monthTotalDays='+monthTotalDays);
        var oneWeekDays = 7;
        var firstWeekDayCount = oneWeekDays-getWeekIndex(monthFirstDay,isSundayHead);
        log('firstWeekLeft='+firstWeekDayCount);

        //----- Round a number upward to its nearest integer -----//
        //----- ex:Math.ceil(1.4)==2 -----//
        return Math.ceil((monthTotalDays-firstWeekDayCount)/7)+1;
    }


    //----- isHeadSunday will make arrWeek index difference -----//
    function getWeekIndex(date,isSundayHead) {
        if(isSundayHead) {
            return date.getDay();
        } else {
            if( date.getDay()===0 ) {
                return 6;
            } else {
                return date.getDay()-1;
            }
        }
    }



}


