/*グローバル変数*/
var chosenLine = null;
var mouseUp = true;

var imgMaxNumber = -1
var imgNumber = -1;
var imgNames = new Array();
var imgURLs = new Array();

var imgLines = new Array();

var lineNumbers = new Array();

var baseFontSize = 16;

var folderName = "";


/*画像読み込み時*/
var pictureLoad = function( inputFile ){
	/*画像を読み込んで表示*/
	var fileList = inputFile.files;							/*inputに選択されているファイル*/
	if(("" + fileList[0]) === "undefined"){ return 0; }		//ファイル未選択時に強制終了
	var blobUrl = window.URL.createObjectURL( fileList[0] );/*URLを生成*/
	document.getElementById("dream_image").src = blobUrl;	/*画像を表示*/
	imgURLs.push(blobUrl);									/*URLを保持*/
	/*変数の設定*/
	imgMaxNumber++;											/*イメージ番号（何枚目か）を更新*/
	imgNumber = imgMaxNumber;
	lineNumbers.push(-1);									/*セリフ番号（個数）を更新*/
	var fileName = inputFile.value;
	var splitFileName = fileName.split(/[\\\/\.]/);			/*ファイルパスを分割*/
	var lastFileName = splitFileName[ splitFileName.length - 2 ];	/*純粋なファイル名を取得*/
	imgNames.push(lastFileName);							/*ファイル名を保持*/
	imgLines.push(new Array());
	/*選択肢を追加*/
	deleteAllLineView();/*セリフ消去*/
	var newOption = document.createElement("option");						/*optionタグを作る*/
	newOption.innerHTML = lastFileName;										/*テキストを反映*/
	newOption.value = imgNumber;
	document.getElementById("picture_select").appendChild(newOption);		/*要素を追加*/
	document.getElementById("picture_select").selectedIndex = imgNumber;
	/*htmlテキストを追加*/
	var htmlText =  "<div id=\"dream_comic_" + imgNames[imgNumber] + "\" class=\"dream_comic noDrag\">\n<img src=\"" + folderName + imgNames[imgNumber] + "\." + splitFileName[splitFileName.length - 1] + "\" alt=\"漫画\">\n</div>\n";
	document.getElementById("html_body_text").innerText += htmlText;
}
/*フォルダ名取得時*/
var changeFolderName = function(obj){
	folderName = obj.value + "/";
	obj.disabled = true;
}

/*画像URL選択時*/
var choiceImageUrl = function(){
	deleteAllLineView();/*セリフ消去*/
	imgNumber = document.getElementById("picture_select").selectedIndex;/*選択されている数字を取得*/
	document.getElementById("dream_image").src = imgURLs[imgNumber];	/*画像を表示*/
	/*セリフ再表示*/
	var length = imgLines[imgNumber].length;
	for(var i=0; i < length; i++){
		if(imgLines[imgNumber][i] !== null){
			document.getElementById("dream_comic_01").appendChild(imgLines[imgNumber][i]);		/*要素を追加*/
		}
	}
}

/*表示されているセリフを全部消去(セリフ自体は消さない)*/
var deleteAllLineView = function(){
	var lineObjects = document.getElementsByClassName( "line" );	/*セリフ要素全てを取得*/
	var length = lineObjects.length;								
	for(var i = (length-1); i >= 0 ; i--){									/*全ての台詞からボーダーを消して自分も消す*/
		lineObjects[i].style.borderColor = "rgba(0,0,0,0)";
		lineObjects[i].parentNode.removeChild(lineObjects[i]);
	}
}

/*ドラッグ不可選択時*/
var choiceDrag = function(){
	if(document.getElementById("drug_check").checked === true){//チェックされていたら
		/*ドラッグ禁止の文章を追加*/
		var replaceText = ".noDrag{\n user-select:none;\n -webkit-user-select:none;\n -moz-user-select:none;\n -khtml-user-select:none;\n -webkit-user-drag:none;\n -khtml-user-drag:none;\n}\n";
		document.getElementById("css_text").innerText =  document.getElementById("css_text").innerText.replace(/.noDrag\{[\s\S]*?\}\n/,replaceText);
	}
	else{
		/*ドラッグ禁止に関する記述を削除*/
		document.getElementById("css_text").innerText = document.getElementById("css_text").innerText.replace(/.noDrag\{[\s\S]*?\}\n/,".noDrag{}\n");
	}
}

/*レスポンシブ選択時*/
var choiceResponsive = function(){
	if(imgNumber === -1){document.getElementById("res_check").checked = false;return 0;}//画像が読み込まれていなければなし
	if(document.getElementById("res_check").checked === true){//チェックされていたら
		/*レスポンシブの文章を追加*/
		var imageWidth = document.getElementById("dream_comic_01").clientWidth;//横幅
		var resFontSize = ( baseFontSize / imageWidth)*95;
		document.getElementById("css_text").innerText += "@media(max-width:" + imageWidth +  "px){\n.dream_comic{\nwidth: 100%;\nfont-size:" + resFontSize + "vw;\ndisplay: block;\n}\n.dream_comic img{\nwidth: 100%;\n}\n}\n";
	}
	else{
		/*レスポンシブに関する記述を削除*/
		document.getElementById("css_text").innerText = document.getElementById("css_text").innerText.replace(/\n@media[\s\S]*?}\n\.dream\_comic[\s\S]*?}\n}\n/,"");
	}
}

/*ボーダー選択時*/
var choiceBorder = function(){
	if(document.getElementById("border_check").checked === true){//チェックされていたら
		/*表示*/
		document.getElementById("dream_comic_01").style.border = "1px solid black";
		/*出力*/
		document.getElementById("css_text").innerText = document.getElementById("css_text").innerText.replace(/border:[\s\S]*?\;/,"border:1px solid black;");
	}
	else{
		document.getElementById("dream_comic_01").style.border = "none";
		document.getElementById("css_text").innerText = document.getElementById("css_text").innerText.replace(/border:[\s\S]*?\;/,"border:none;");
	}
}

/*中央ぞろえ選択時*/
var choiceCenter = function(){
	if(document.getElementById("center_check").checked === true){//チェックされていたら
		/*出力*/
		document.getElementById("css_text").innerText = document.getElementById("css_text").innerText.replace(/margin:[\s\S]*?\;/,"margin:0.5em auto;");
	}
	else{
		document.getElementById("css_text").innerText = document.getElementById("css_text").innerText.replace(/margin:[\s\S]*?\;/,"margin:0.5em;");
	}
}

/*基準のフォントサイズ変更時*/
var changeBaseFontSize = function(spin){
	var trueOrFalse = document.getElementById("res_check").checked;
	document.getElementById("res_check").checked = false;
	choiceResponsive();
	document.getElementById("css_text").innerText = document.getElementById("css_text").innerText.replace(/font\-size\:[\s\S]*?px/,"font-size: " + spin.value + "px");
	document.getElementById("dream_comic_01").style.fontSize = spin.value + "px";
	baseFontSize = spin.value;//
	document.getElementById("res_check").checked = true;
	choiceResponsive();
	document.getElementById("res_check").checked = trueOrFalse;
}

/*台詞選択時*/
var choiceLine = function( lineObject ){
	var lineObjects = document.getElementsByClassName( "line" );	/*セリフ要素全てを取得*/
	var length = lineObjects.length;								
	for(var i=0; i < length ; i++){									/*全ての台詞からボーダーを消す*/
		lineObjects[i].style.borderColor = "rgba(0,0,0,0)";
	}

	if(choiceLine !== lineObject){									/*選んだオブジェクトにボーダーをつける*/
		lineObject.style.borderColor = "red";
		chosenLine = lineObject;
		document.getElementById("line_font_size").value = chosenLine.style.fontSize.replace(/%/,"");

		/*現在地を表示*/
		document.getElementById("line_y_view").value = (chosenLine.style.top.replace(/%/g,"")-0);
		document.getElementById("line_x_view").value = (chosenLine.style.left.replace(/%/g,"")-0);
		var newDeg = chosenLine.style.transform.replace(/rotate\(/,"");
		newDeg = newDeg.replace(/\)/,"");
		document.getElementById("line_deg_view").value = newDeg;
	}
}


/*台詞削除*/
var deleteLine = function(){
	if(chosenLine !== null){//セリフが選択されている場合のみ
		/*アウトプットの変更*/
		/*htmlの中からセリフ情報を消去*/
		var splitText = document.getElementById("html_body_text").innerText.split("dream_comic_" + imgNames[imgNumber]);
		var replaceText = new RegExp("<p class=\"line" + chosenLine.dataset.linenum + "\">[\\s\\S]*?</p>\n");
		splitText[1] = splitText[1].replace(replaceText, "");
		document.getElementById("html_body_text").innerText = splitText[0] + "dream_comic_" + imgNames[imgNumber] + splitText[1];
		
		//CSSの消去(できた)
		var replaceText2 = new RegExp("#dream_comic_" + imgNames[imgNumber] + " \\.line" + chosenLine.dataset.linenum + "\\{[\\s\\S]*?\\}\n");
		document.getElementById("css_text").innerText = document.getElementById("css_text").innerText.replace(replaceText2, "");

		//ちゃんとなしにする
		var length = imgLines[imgNumber].length;
		for(var i=0; i < length; i++){
			if(imgLines[imgNumber][i] === chosenLine){
				imgLines[imgNumber][i] = null;
				break;
			}
		}

		/*画面上の変更*/
		chosenLine.parentNode.removeChild(chosenLine);
		chosenLine = null;
	}
}

/*台詞追加*/
var addNewLine = function(){
	if(imgNumber === -1){return 0;}//画像が読み込まれていなければなし

	var n2BrText = document.getElementById("new_line_text").value.replace(/[\r\n]+\n*?/g,"<br>");						/*改行をbrに変換*/

	/*画面上への追加*/
	lineNumbers[imgNumber]++;											/*セリフの個数を更新*/
	var newP = document.createElement("p");								/*pタグを作る*/
	newP.innerHTML = n2BrText;											/*テキストを反映*/
	newP.className = "line";											/*lineクラスを適用させる*/
	newP.style.fontSize = "100%";										/*スタイルを設定しておく*/
	newP.dataset.linenum = lineNumbers[imgNumber];						/*ユーザ拡張属性*/
	newP.onmousedown = function (){choiceLine(this)};					/*クリック関数を適用*/
	document.getElementById("dream_comic_01").appendChild(newP);		/*要素を追加*/
	imgLines[imgNumber].push(newP);

	/*アウトプットへの追加(html css)*/
	var splitText = document.getElementById("html_body_text").innerText.split("dream_comic_" + imgNames[imgNumber]);	/*現在操作中の画像で分割*/
	var replaceText = "<p class=\"line" + lineNumbers[imgNumber] + "\">\n" + n2BrText + "\n</p>\n</div>";				/*置換するテキストを生成*/
	splitText[1] = splitText[1].replace("<\/div>", replaceText);														/*文字列を置換*/
	document.getElementById("html_body_text").innerText = (splitText[0] + "dream_comic_" + imgNames[imgNumber] + splitText[1]);	/*元に戻す*/

	document.getElementById("css_text").innerText += "#dream_comic_" + imgNames[imgNumber] + " .line" + lineNumbers[imgNumber] + "{\ntop:0\%\;\nleft:0\%\;\nfont-size:100%;\ntransform:rotate(0deg);\n}\n";
}


/*矢印クリック時*/
var onMouseDownTriangle = function( top , left){
	if(chosenLine === null){ return null;}
	mouseUp = false;
	var speed = 0.01;

	var moveLinePosition = function(){
		var topOrLeft = 0;

		if(top!==0){
			topOrLeft = ((chosenLine.style.top.replace(/%/g,"")-0) + (top * speed) + 100)%100 + "%";
			chosenLine.style.top = topOrLeft;
			document.getElementById("line_y_view").value = topOrLeft.replace(/\%/,"");
			var splitText = document.getElementById("css_text").innerText.split("dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{");
			splitText[1] = splitText[1].replace(/top[\s\S]*?\%/,"top:" + topOrLeft);
			document.getElementById("css_text").innerText = (splitText[0] + "dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{" + splitText[1]);
		}
		if(left!==0){
			topOrLeft = ((chosenLine.style.left.replace(/%/g,"")-0) + (left * speed) + 100)%100 + "%";
			document.getElementById("line_x_view").value = topOrLeft.replace(/\%/,"");
			chosenLine.style.left = topOrLeft;
			var splitText = document.getElementById("css_text").innerText.split("dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{");
			splitText[1] = splitText[1].replace(/left[\s\S]*?\%/,"left:" + topOrLeft);
			document.getElementById("css_text").innerText = (splitText[0] + "dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{" + splitText[1]);
		}
		speed += 0.005;
	}
	var updateLinePosition = setInterval(function(){
			moveLinePosition();
			if(mouseUp){
				clearInterval(updateLinePosition);
			}
	},10);
}

/*矢印直接記入時*/
var changeLineXView = function( textBox ){
	if(chosenLine === null){ return null;}
	chosenLine.style.left = textBox.value + "%";//表示
	var splitText = document.getElementById("css_text").innerText.split("dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{");
	splitText[1] = splitText[1].replace(/left[\s\S]*?\%/,"left:" + textBox.value + "%");
	document.getElementById("css_text").innerText = (splitText[0] + "dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{" + splitText[1]);
}
var changeLineYView = function( textBox ){
	if(chosenLine === null){ return null;}
	chosenLine.style.top = textBox.value + "%";//表示
	var splitText = document.getElementById("css_text").innerText.split("dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{");
	splitText[1] = splitText[1].replace(/top[\s\S]*?\%/,"top:" + textBox.value + "%");
	document.getElementById("css_text").innerText = (splitText[0] + "dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{" + splitText[1]);
}

/*回転クリック時*/
var onMouseDownDirection = function( deg ){
	if(chosenLine === null){ return null;}
	console.log("Dおせてるよ");
	mouseUp = false;
	var speed = 0.1;
	var moveDeg = 0;
	var moveLineDegree = function(){
		var newDeg = chosenLine.style.transform.replace(/rotate\(/,"");
		newDeg = (newDeg.replace(/deg\)/,"") - 0) + (deg * speed);
		document.getElementById("line_deg_view").value = newDeg;
		chosenLine.style.transform = "rotate(" + newDeg + "deg)";
		var splitText = document.getElementById("css_text").innerText.split("dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{");
		splitText[1] = splitText[1].replace(/rotate\([\s\S]*?\)/,"rotate(" + newDeg + "deg)");
		document.getElementById("css_text").innerText = (splitText[0] + "dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{" + splitText[1]);
	}
	var updateLineDegree = setInterval(function(){
			moveLineDegree();
			if(mouseUp){
				clearInterval(updateLineDegree);
			}
	},10);
}

/*回転直接記入時*/
var changeLineDegView = function( textBox ){
	if(chosenLine === null){ return null;}
	chosenLine.style.transform = "rotate(" + textBox.value + "deg)";//表示
	var splitText = document.getElementById("css_text").innerText.split("dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{");
	splitText[1] = splitText[1].replace(/rotate\([\s\S]*?\)/,"rotate(" + textBox.value + "deg)");
	document.getElementById("css_text").innerText = (splitText[0] + "dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{" + splitText[1]);
}

/*セリフごとのフォントサイズ変更*/
var changeLineFontSize = function( spin ){
	if(chosenLine === null){ return null;}
	/*表示を変更*/
	chosenLine.style.fontSize = spin.value + "%";

	/*アウトプットを変更*/
	var splitText = document.getElementById("css_text").innerText.split("dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{");
	splitText[1] = splitText[1].replace(/font\-size[\s\S]*?\%/,"font-size:" + spin.value + "%");
	document.getElementById("css_text").innerText = (splitText[0] + "dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{" + splitText[1]);
}

/*横書き選択時*/
var choiceHorizontal = function(){
	if(chosenLine === null){ return null;}
	if(document.getElementById("horizontal_check").checked === true){//チェックされていたら
		/*表示を変更*/
		chosenLine.style.writingMode = "initial";
		/*アウトプットを変更*/
		var splitText = document.getElementById("css_text").innerText.split("dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{");
		splitText[1] = "\nwriting-mode: initial;" + splitText[1];
		document.getElementById("css_text").innerText = (splitText[0] + "dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{" + splitText[1]);
	}
	else{
		/*表示を変更*/
		chosenLine.style.writingMode = "";
		var splitText = document.getElementById("css_text").innerText.split("dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{");
		splitText[1] = splitText[1].replace(/\nwriting\-mode[\s\S]*?\;/,"");
		document.getElementById("css_text").innerText = (splitText[0] + "dream_comic_" + imgNames[imgNumber] + " .line" + chosenLine.dataset.linenum + "{" + splitText[1]);
	}
}


/*マウス離す*/
var onMouseUpTriangle = function(){
		mouseUp = true;
}


/*ダウンロード*/
/*普通の*/
/*html漫画部分のみダウンロード*/
var downloadPureHTML = function(){
	if(imgNumber === -1){return 0;}//画像が読み込まれていなければなし
	var content = "<!-- 以下を目的のページのhead内に設置してください(リンク先は適宜変更) -->\n<link rel=\"stylesheet\" type=\"text/css\" href=\"html_comic_style.css\">\n\n<!-- 以下を目的のページのbody内に設置してください -->\n" + document.getElementById("html_body_text").innerText;
	downloadSomething( content, "html_comic.txt");
}
/*htmlファイルをダウンロード*/
var downloadWebPage = function(){
	if(imgNumber === -1){return 0;}//画像が読み込まれていなければなし
	var content = '<!DOCTYPE html>\n<html lang="ja">\n<head>\n<meta charset="utf-8">\n<link rel="stylesheet" type="text/css" href="html_comic_style.css">\n<title>htmlマンガ</title>\n</head>\n<body>\n<main>\n\n' + document.getElementById("html_body_text").innerText + '\n</main>\n</body>\n</html>';
	downloadSomething( content, "html_comic.html");
}
/*CSSをダウンロード*/
var downloadCSS = function(){
	if(imgNumber === -1){return 0;}//画像が読み込まれていなければなし
	var content = "@charset \"utf-8\";\n" + document.getElementById("css_text").innerText;
	downloadSomething( content, "html_comic_style.css");
}
/*まとめてダウンロード*/
var downloadMix = function(){
	if(imgNumber === -1){return 0;}//画像が読み込まれていなければなし
	var CSSContent = "<style type=\"text/css\">@charset \"utf-8\";\n" + document.getElementById("css_text").innerText + "\n</style>\n";
	var content = '<!DOCTYPE html>\n<html lang="ja">\n<head>\n<meta charset="utf-8">\n<title>htmlマンガ</title>\n' + CSSContent +  '</head>\n<body>\n<main>\n\n' + document.getElementById("html_body_text").innerText + '\n</main>\n</body>\n</html>';
	downloadSomething( content, "html_comic.html");
}
/*あわ的サイト用ダウンロード*/
var downloadMySite = function(){
	if(imgNumber === -1){return 0;}//画像が読み込まれていなければなし
	var content = "<style scoped>" + document.getElementById("css_text").innerText + "</style>" + document.getElementById("html_body_text").innerText;
	content = content.replace(/\r?\n/g,"");
	downloadSomething( content, "html_comic.txt");
}


/*DreamMaker1*/
/*html漫画部分のみダウンロード*/
var downloadPureHTMLDream1 = function(){
	if(imgNumber === -1){return 0;}//画像が読み込まれていなければなし
	var content = "<!-- 以下を目的のページのhead内に設置してください(リンク先は適宜変更) -->\n<link rel=\"stylesheet\" type=\"text/css\" href=\"html_comic_style.css\">\n\n<!-- 以下を目的のページのbody内に設置してください -->\n" + getDreamBodyTopText1() + changeDreamNameHTML1();
	downloadSomething( content, "html_comic.txt");
}
/*htmlファイルをダウンロード*/
var downloadWebPageDream1 = function(){
	if(imgNumber === -1){return 0;}//画像が読み込まれていなければなし
	var content = '<!DOCTYPE html>\n<html lang="ja">\n<head>\n<meta charset="utf-8">\n<link rel="stylesheet" type="text/css" href="html_comic_style.css">\n<title>htmlマンガ</title>\n</head>\n<body>\n<main>\n\n' + getDreamBodyTopText1() + changeDreamNameHTML1() + '\n</main>\n</body>\n</html>';
	downloadSomething( content, "html_comic.html");
}

/*まとめてダウンロード*/
var downloadMixDream1 = function(){
	if(imgNumber === -1){return 0;}//画像が読み込まれていなければなし
	var CSSContent = "<style type=\"text/css\">@charset \"utf-8\";\n" + document.getElementById("css_text").innerText + "\n</style>\n";
	var content = '<!DOCTYPE html>\n<html lang="ja">\n<head>\n<meta charset="utf-8">\n<title>htmlマンガ</title>\n' + CSSContent +  '</head>\n<body>\n<main>\n\n' + getDreamBodyTopText1() + changeDreamNameHTML1() + '\n</main>\n</body>\n</html>';
	downloadSomething( content, "html_comic.html");
}

/*夢の名前一覧を取得1→プロンプト用の表記を作成*/
var getDreamBodyTopText1 = function(){
	var names = document.getElementById("name_list_1").getElementsByTagName("input");
	var length = names.length;
	var bodyTopText = '<!-- DreamMaker by Season(URL:http://homepage1.nifty.com/mystaff/) --->\n<script language="JavaScript">\n<!--\n';

	for(var i=0; i < (length/2); i++){
		if((names[i*2].value !== "") && (names[(i*2) + 1].value !== "")){
			bodyTopText += "var name" + i + " = prompt(\"" + names[i*2].value + "\",\"\");\n";
			bodyTopText += "if( name" + i + " == null || name" + i + " ==\"\"){ name" + i + " =\"" + names[(i*2) + 1].value + "\";}\n";
		}
	}

	bodyTopText += "// -->\n</script>\n";
	
	return bodyTopText;
}

/*名前を変換1*/
var changeDreamNameHTML1 = function(){
	var names = document.getElementById("name_list_1").getElementsByTagName("input");
	var length = names.length;
	var dreamLines = document.getElementById("html_body_text").innerText

	for(var i=0; i < (length/2); i++){
		if((names[i*2].value !== "") && (names[(i*2) + 1].value !== "")){
			var replaceText = new RegExp(names[(i*2) + 1].value,"g");
			dreamLines = dreamLines.replace(replaceText, '<script language="JavaScript">document.write( name' + i + ' );</script>');
		}
	}
	return dreamLines;
}


/*DreamMaker2*/

var headInsideText2 = '<script language="JavaScript">\n<!----Cookie使用\nvar CookieID = "Dream2";\nfunction getCookie(key) {\n  if (document.cookie){\nindex = document.cookie.indexOf(key, 0);\nif (index != -1) {\nval_start = (document.cookie.indexOf("=", index) + 1);\nval_end = document.cookie.indexOf(";", index);\nif (val_end == -1){\nval_end = document.cookie.length;\n}\nreturn(unescape(document.cookie.substring(val_start, val_end)));\n}\n}\nreturn(null);\n}\n// -->\n</script>\n';

/*html漫画部分のみダウンロード*/
var downloadPureHTMLDream2 = function(){
	if(imgNumber === -1){return 0;}//画像が読み込まれていなければなし
	var content = "<!-- 以下を目的のページのhead内に設置してください(リンク先は適宜変更) -->\n<link rel=\"stylesheet\" type=\"text/css\" href=\"html_comic_style.css\">\n" + headInsideText2 + "\n\n<!-- 以下を目的のページのbody内に設置してください -->\n" + getDreamBodyTopText2() + changeDreamNameHTML2();
	downloadSomething( content, "html_comic.txt");
}
/*htmlファイルをダウンロード*///まだ
var downloadWebPageDream2 = function(){
	if(imgNumber === -1){return 0;}//画像が読み込まれていなければなし
	var content = '<!DOCTYPE html>\n<html lang="ja">\n<head>\n<meta charset="utf-8">\n<link rel="stylesheet" type="text/css" href="html_comic_style.css">\n<title>htmlマンガ</title>\n' + headInsideText2 + '\n</head>\n<body>\n<main>\n\n' + getDreamBodyTopText2() + changeDreamNameHTML2() + '\n</main>\n</body>\n</html>';
	downloadSomething( content, "html_comic.html");
}


/*まとめてダウンロード*///まだ
var downloadMixDream2 = function(){
	if(imgNumber === -1){return 0;}//画像が読み込まれていなければなし
	var CSSContent = "<style type=\"text/css\">@charset \"utf-8\";\n" + document.getElementById("css_text").innerText + "\n</style>\n";
	var content = '<!DOCTYPE html>\n<html lang="ja">\n<head>\n<meta charset="utf-8">\n<title>htmlマンガ</title>\n' + CSSContent + headInsideText2 +  '\n</head>\n<body>\n<main>\n\n' + getDreamBodyTopText2() + changeDreamNameHTML2() + '\n</main>\n</body>\n</html>';
	downloadSomething( content, "html_comic.html");
}

/*夢の名前一覧を取得2→ボディの最初の表記を作成*/
var getDreamBodyTopText2 = function(){
	var names = document.getElementById("name_list_2").getElementsByTagName("input");
	var length = names.length;
	var bodyTopText = '<SCRIPT LANGUAGE="JavaScript">\n<!---\nvar getname = getCookie(CookieID);\nif (getname == null || getname == "null") getname = "';

	for(var i=0; i < length; i++){
		if(names[i].value !== ""){
			bodyTopText += names[i].value + ",";
		}
	}
	bodyTopText += '";\nnames = getname.split(",");\n//END --->\n</SCRIPT>\n';
	
	return bodyTopText;
}

/*名前を変換2*/
var changeDreamNameHTML2 = function(){
	var names = document.getElementById("name_list_2").getElementsByTagName("input");
	var length = names.length;
	var dreamLines = document.getElementById("html_body_text").innerText

	for(var i=0; i < length; i++){
		if((names[i].value !== "")){
			var replaceText = new RegExp(names[i].value,"g");
			dreamLines = dreamLines.replace(replaceText, '<script language="JavaScript">document.write( names[' + i + '] );</script>');
		}
	}
	return dreamLines;
}


/*項目を増やすよ*/
var addDreamNameBox = function(num){
	if(num === 1){
		document.getElementById("name_list_" + num).innerHTML += ("<br>" + '<input type="text" placeholder="項目名(例:苗字)" value=""> <input type="text" placeholder="変換文字列(例:みょうじ)"  value="">');
	}
	if(num === 2){
		document.getElementById("name_list_" + num).innerHTML += ("<br>" + '<input type="text" placeholder="変換文字列(例:みょうじ)"  value="">');
	}
}


/*とにかくダウンロード*/
var downloadSomething = function( content, fileName){
	var blob = new Blob([content]);
    //var url = window.URL;
    //var blobURL = url.createObjectURL(blob);

    var a = document.createElement('a');
    a.download = fileName;
	a.target = "_blank";

	if (window.navigator.msSaveBlob) {
  		// for IE
		window.navigator.msSaveBlob(blob, name)
	}
	else if (window.URL && window.URL.createObjectURL) {
  	// for Firefox
		a.href = window.URL.createObjectURL(blob);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
	else if (window.webkitURL && window.webkitURL.createObject) {
		// for Chrome
		a.href = window.webkitURL.createObjectURL(blob);
		a.click();
	}
	else {
		// for Safari
		window.open(/*'data:' + mimeType + ';base64,' +*/ window.Base64.encode(content), '_blank');
	}

   // a.href = blobURL;
   // a.click();  
}

