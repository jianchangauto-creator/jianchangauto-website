//個別車削時間計算
var cutting; //切削量
var s; //轉數
var f; //進刀量

function getTime(cutting, s , f ) {
  
	var time=cutting*100*60/s/(f*100);
  
  return time;
}

console.log(getTime(29.5,1800,0.03));

//--------------------------------------------

//換刀時間

function toolChange(time) {
  
	time=time+0.5;
  
  return time;
}
console.log(toolChange(5));

//---------------------------------------------

//程式終了時間

function programEnded(time) {
  
	time=time+3;
  
  return time;
}
console.log(programEnded(5));

//---------------------------------------------

//G2切削量計算
//G2 X6.0 R6.0 W3.0 F0.02
var radius; //半徑
var w ;// W走的距離

function G2cutting(radius,w){
	var circumference=Math.PI*2*radius;//圓周長
	//console.log(circumference);
	var angle;//角度
	var arc; //圓弧長
		if (radius==w){
		  angle=90;
		  //console.log(angle);
		  arc=circumference*angle/360;
		  //console.log(arc);
		  
		}else if(radius>w){
		  var opposite=Math.sqrt((radius * radius) - (w * w))  //對邊長
		  //console.log(opposite);
		  var sinOfAngleX = opposite / radius; 
		  //你可以用這個公式知道任何直角邊的角度：
		   angle= Math.asin(sinOfAngleX) * 180/Math.PI
		  //console.log(angle);
		  arc=circumference*angle/360
		  //console.log(arc);
		}else {//R<W
		  w=w-radius;//計算另一個三角形
		  var opposite=Math.sqrt((radius * radius) - (w * w))  //對邊長
		  //console.log(opposite);
		  var sinOfAngleX = opposite / radius; 
		  angle= 180-Math.asin(sinOfAngleX) * 180/Math.PI
		  //console.log(angle);
		  arc=circumference*angle/360
		};
	return arc;
};
console.log(G2cutting(6,3));

//---------------------------------------------


//G79 時間計算
var w;
var r;
var i;
var k;
var a;
var q;
var j;
var f;
var s;

var cutting;

function G79Time(w,r,i,k,a,q,j,f,s){
	
	var frequency=Math.ceil((w-i)/k)+1; //次數
	console.log(frequency);
	
	cutting=w+frequency*a;//切削量=w+次數*安全距離
	console.log(cutting);
	
	var time=getTime(cutting, s , f )+frequency*q/1000;//切削時間+暫停時間
	return time;
};
console.log(G79Time(36.5,0.5,12.0,4.0,0.3,200,200,0.04,1800));

//---------------------------------------------

//G65 P9876 時間計算
var w;
var s;
var h;
function G65Time(w,h,f,s){
	var time=getTime(w,s,f)*h*1.3;//係數待定
	
	return time;
};
console.log(G65Time(10,7,0.8,400));

//---------------------------------------------

//G98 側銑加工時間計算


function(w,){
	
	
	var time=
	return time;
};
