/*リロード禁止*/
window.document.onkeydown=function(){
  if (event.keyCode == 116||event.keyCode == 17) {//F5キーとCtrlキーを禁止
      event.keyCode = 0;
      event.returnValue = false;
  }
}
/*リロード時の注意*/
window.addEventListener('beforeunload', function(e) {
    e.returnValue = "ページを離れる,または更新すると，データが失われます";
}, false);
