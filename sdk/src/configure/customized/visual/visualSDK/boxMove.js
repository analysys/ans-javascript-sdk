 import Util from '../../../../lib/common/index.js'

 function moveBox() {
     var _this = this
     this.ele = null
     this.parent = null
     this.parentOption = {
         x: 0,
         y: 0
     }
     this.touchOption = {
         x: 0,
         y: 0
     }

     function down(event) {
         event.preventDefault()
         var touch;
         if (event.touches) {
             touch = event.touches[0];
         } else {
             touch = event;
         }

         _this.touchOption = {
             x: touch.clientX,
             y: touch.clientY
         }
         _this.parentOption = {
             x: _this.parent.offsetLeft,
             y: _this.parent.offsetTop
         }
         Util.addEvent(document, "touchmove", function() {
             event.preventDefault();
         }, false);
         Util.addEvent(document, "mousemove", move, false)
         Util.addEvent(document, "mouseup", end, false)

         Util.addEvent(document, "touchmove", move, false)
         Util.addEvent(document, "touchend", end, false)
     };

     function move(event) {
         var touch;
         if (event.touches) {
             touch = event.touches[0];
         } else {
             touch = event;
         }
         var x = _this.parentOption.x + touch.clientX - _this.touchOption.x;
         var y = _this.parentOption.y + touch.clientY - _this.touchOption.y;

         _this.parent.style.left = x + "px";
         _this.parent.style.top = y + "px";
         // _this.parentOption = {
         //     x: x,
         //     y: y
         // }
     };

     function end(event) {
         Util.removeEvent(document, "touchmove", function() {
             event.preventDefault();
         }, false)

         Util.removeEvent(document, "touchmove", move, false)
         Util.removeEvent(document, "touchend", end, false)

         Util.removeEvent(document, "mousemove", move, false)
         Util.removeEvent(document, "mouseup", end, false)
     };
     this.init = function(ele) {
         this.ele = ele
         this.parent = this.ele.parentNode


         Util.addEvent(_this.ele, "mousedown", down, false)
         Util.addEvent(_this.ele, "touchstart", down, false)
     }

     this.remove = function(event) {
         if (!this.ele) return;
         Util.removeEvent(document, "mousedown", down, false)
         Util.removeEvent(document, "touchstart", down, false)

     };

 }
 export default new moveBox()