

export function dateFormat(date : Date, format : string) : string {
  const offset_GMT = date.getTimezoneOffset();
  date = new Date(date.getTime() + offset_GMT * 60 * 1000 + 8 * 60 * 60 * 1000) //转换为东八区时间
  const o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "h+": date.getHours(), //hour
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    "S+": date.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (const k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1,
        RegExp.$1.length == 3 ? (("" + o[k]).length < 3 ? ("00" + o[k]).substr(("00" + o[k]).length - 3, ("00" + o[k]).length) : o[k]) :
          ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}


export function clientTimeZone() : string {
  const munites : number = new Date().getTimezoneOffset();
  let hour : any = munites / 60
  let munite : any = munites % 60;

  let prefix = "-";
  
  if (hour <= 0 || munite < 0) {
    prefix = "+";
    hour = -hour;
    if (munite < 0) {
      munite = -munite;
    }
  }
  hour = hour + ""
  munite = munite + ""

  if (hour.length == 1) {
    hour = "0" + hour;
  }

  if (munite.length == 1) {
    munite = "0" + munite;
  }

  return prefix + hour + ':' + munite;
}