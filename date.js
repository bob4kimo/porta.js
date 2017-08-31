

/**--------------------------------------------------------------------------------------
 * Entry Point
 ---------------------------------------------------------------------------------------*/
new BobDatePicker({
//    isHeadSunday:true
});

//    var days = new Date(2017,12,0);
//    console.log(days.getDate());//28
//    console.log(days.getMonth());//1
//    console.log(days);//today


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
    var today = new Date(2016,9,19);
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


