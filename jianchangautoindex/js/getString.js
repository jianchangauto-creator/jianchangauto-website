var s1=0;
var s2=0;
var outer_diameter=0;
var length=0;
var turning_tool_width=0;
var angle=0;
var G98G99="G99";
var s3=0;
window.onload=function(){
	on_click();
        document.getElementById('file').onchange = function(){

		  var file = this.files[0];
		  var reader = new FileReader();
		  reader.onload = function(progressEvent){ 
		    var fileContentArray = this.result.split(/\r\n|\n/);
		    read_program(fileContentArray);
		  };
		  reader.readAsText(file);
	};
}

function read_program(fileContentArray){
		    var timecount=0;
		    var G_code="";
		    var x=100;
		    var y=0;
		    var z=0;
		    var line_time=0;
		    if(check9100()==false){
		    	return;
		    }
		    s1=document.getElementById('A').value;
		    outer_diameter=document.getElementById('B').value;
		    length=document.getElementById('C').value; 
		    turning_tool_width=document.getElementById('E').value; 
		    angle=document.getElementById('F').value; 
		    
		    for(var line = 0; line < fileContentArray.length-1; line++){
		      haveG98G99(fileContentArray[line]);
		      temp_line="";
		      getRotating_speed(fileContentArray[line]);
		      fileContentArray[line]=checkOther(fileContentArray[line])//取代 G50
		      fileContentArray[line]=fileContentArray[line].replace(";","");
		      console.log("S1="+s1);//取得轉數
		      if(getThreeWord(fileContentArray[line])!=""){//換刀
		      	if(getThreeWord(fileContentArray[line])=="5"){
		      		x=100;
		      		y=0;
		      		timecount=timecount+0.5;
			      	console.log("換刀");
			      	console.log("nowX"+x);
			        console.log("nowY"+y);
			        console.log("nowZ"+z);
			        console.log("------------");
			        document.getElementById("code_area").innerText=document.getElementById("code_area").innerText+fileContentArray[line]+" \n ";
			      	continue;
		      	}else if(getThreeWord(fileContentArray[line])=="6"){ //鑽孔
		      		x=0;
		      		y=0;
		      		timecount=timecount+0.5;
			      	console.log("換鑽孔座");
			      	console.log("nowX"+x);
			        console.log("nowY"+y);
			        console.log("nowZ"+z);
			        console.log("------------");
			        document.getElementById("code_area").innerText=document.getElementById("code_area").innerText+fileContentArray[line]+" \n ";
			      	continue;
		      	}
		      	
		      }else if(otherProgram(fileContentArray[line])!=0){ //其他刀法

		      	 temp_line=fileContentArray[line];
		      	 timecount=timecount+otherProgram(fileContentArray[line]);
		      	 console.log(fileContentArray[line]);
				 console.log("nowX:"+x);
				 console.log("nowY:"+y);
				 console.log("nowZ:"+z);
				 console.log("執行時間:"+otherProgram(fileContentArray[line]));
				 console.log("累計時間:"+timecount);
				 console.log("------------");
				 document.getElementById("code_area").innerText=document.getElementById("code_area").innerText+fileContentArray[line]+"________"
				      +"執行時間:"+otherProgram(fileContentArray[line])+" \n "
				 continue;
		      }else if(getTwoWord(fileContentArray[line])!=""){//使用G碼
		      	   G_code=getTwoWord(fileContentArray[line]);
		      	   temp_line=fileContentArray[line];
		      	   temp_line=temp_line.replace(G_code, ''); //將Gcode 取代為空的	   
		      }else if(getFirstWord(fileContentArray[line])){//省略G碼
		      	   temp_line=fileContentArray[line].trim();
		      }else{
		      	continue;
		      }
		      
		      let comput_map = compute(G_code,temp_line.trim(),x,y,z);
		      line_time=comput_map.get("line_time");
		      if(G_code!="G0"){
		      	//draw(x,z,comput_map.get("nowX"),comput_map.get("nowZ"));
		      	draw_by_time(x,z,comput_map.get("nowX"),comput_map.get("nowZ"),line_time,G_code);
		      }
		      //timecount=comput_map['time']+timecount;
		      x=comput_map.get("nowX");
		      y=comput_map.get("nowY");
		      z=comput_map.get("nowZ");
		      f=comput_map.get("F");
		      
		      
		      timecount=timecount+comput_map.get("line_time");
		      console.log(fileContentArray[line]);
		      console.log(G_code);
		      console.log("nowX:"+x);
		      console.log("nowY:"+y);
		      console.log("nowZ:"+z);
		      console.log("F:"+f);
		      console.log("執行時間:"+line_time);
		      console.log("累計時間:"+timecount);
		      console.log("------------");
		      if(line_time>0){
			      document.getElementById("code_area").innerText=document.getElementById("code_area").innerText+fileContentArray[line]+"________"
			      +"執行時間:"+line_time+" \n "
		      }else{
		      	      document.getElementById("code_area").innerText=document.getElementById("code_area").innerText+fileContentArray[line]+"  "
			      +" \n "
		      }
		    }
		    timecount=timecount+3;//程式終了3秒
		    timecount=timecount*1.2;//常數1.2
		    document.getElementById("time_area").innerText="單顆時間 : "+round(timecount)+"秒";	
}
function readLine(line){
	for(var word = 0 ; word < line.length ; word++){
		//console.log(line[word]);
	}
}

function getFirstWord(line){
	//console.log("line"+line);
	for(var word = 0 ; word < 1 ; word++){
		if(line[word]=="X" || line[word]=="Y" || line[word]=="Z"
		      	|| line[word]=="W" || line[word]=="U" || line[word]=="V"){
			//console.log(line[word]);
                         return true;
		}
	}
}

function getTwoWord(line){

	var two_word="";
	var return_word="";
	for(var word = 0 ; word < 2 ; word++){
		two_word=two_word+line[word]
		//console.log(line[word]);
	}

	if(two_word=="G0" || two_word=="G1" || two_word=="G2"
           || two_word=="G3" || two_word=="G4" || two_word=="G65"
           || two_word=="G92" || two_word=="G84"
		      	){
             return two_word;

	}else{
	     return "";
	}
	
}

function getThreeWord(line){
	if(line.indexOf('Y#5')>=0){ 
             return "5";
	}else if(line.indexOf('X#6')>=0 || line.indexOf('X#5')>=0){ //鑽孔
	     return "6";
	}else{
	     return "";
	}
}

function getG2G3MoveDist(radius,w){
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

function compute(G_code,line,old_x,old_y,old_z){
	let comput = new Map();
	let nowXYZ = new Map();
	var line_time=0;
	var lineX=0;
	var lineY=0;
	var lineZ=0;
	var lineW=0;
	var lineU=0;
	var lineV=0;

	comput=getNumberOfcode(line);
	if(G_code=="G0"){
		//計算移動到的位置
                comput=getG0G1Target(old_x,old_y,old_z,comput);
		//移動距離

		//getMoveDist(old_x,old_y,old_z,comput);
		//不計算秒速,秒速設個大概0.5

		line_time=0;
	}else if(G_code=="G1"){
		//計算移動到的位置
		comput=getG0G1Target(old_x,old_y,old_z,comput);
		//移動距離
		if(typeof getMoveDist(comput,old_x,old_y,old_z)!== "undefined"){
			console.log("移動距離:"+getMoveDist(comput,old_x,old_y,old_z));
		}
		line_time=round(parseFloat(getTime(getMoveDist(comput,old_x,old_y,old_z), s1 , comput.get("F"))));
	}else if(G_code=="G2" || G_code=="G3"){
		//計算移動到的位置
		comput=getG2G3Target(old_x,old_y,old_z,comput);
		line_time=round(parseFloat(getTime(getG2G3MoveDist(comput.get("R"),comput.get("W")), s1 , comput.get("F") )));

	}else if(G_code=="G4"){
		comput=getG4Target(old_x,old_y,old_z,comput);
		line_time=round(parseFloat(comput.get("U")));
	}


	comput.set("line_time",Math.abs(line_time));
	return comput;

}

function getNumberOfcode(line){
    
    let numberOfcode = new Map();
    let code_list=['X','Y','Z','W','U','V','F','R','I','K','A','Q','J','M','S','C','H','D']
    for(var i = 0 ; i < code_list.length ; i++){
    	var number="";
    	var haveCode=false;
	for(var word = 0 ; word < line.length ; word++){
		if(haveCode==true){
		  in_code=false;
		  for(var j=0;j<code_list.length;j++){
		  	if(code_list[j]==line[word]){
		  		in_code=true;
		  	}
		  }
		  if(in_code==true){
		  	haveCode=false;
		  	
		  }else{
		  	number=number+line[word];
		  }

		  if(number.indexOf("[")>=0){
		  	number=number.replace("[","(");
		  }else if(number.indexOf("]")>=0){
		  	number=number.replace("]",")");
		  }
		  
		  
		  numberOfcode.set(code_list[i],number)
		}
		if(line[word]==code_list[i]){
			//console.log(line[word]);
			haveCode=true
			number="";

		}
	}
    }

    //EVAL CODE
    for (let [key, value] of numberOfcode) {
    	if(checkSpecial(value)){
    		numberOfcode.set(key,value);
    	}else{
    		numberOfcode.set(key,eval(checkZVariable(checkXVariable(checkS1Variable(value)))));
    	}
	//console.log(key + " = " + value);
    }
    
    return numberOfcode;
}

function checkSpecial(num){
	if(num.indexOf(',')>=0){ //G84 R1,
		return true;
	}else{
		false;
	}

}

function getTime(cutting, s , f ) {
	if(G98G99=="G99"){
	    /*var cutting; //切削量
	    var s; //轉數
	    var f; //進刀量*/
	    var time=cutting*100*60/s/(f*100);
	}else if(G98G99=="G98"){
	    var time=cutting/f*60;
		
	}
  return time;
}

function G98Time(w,f){
	
};

//換刀時間

function toolChange(time) {
  
	time=time+0.5;
  
  return time;
}

//程式終了
function programEnded(time) {
  
	time=time+3;
  
  return time;
}
//console.log(programEnded(5));


function G79Time(w,r,i,k,a,q,j,f,s){
	s=s1;
	var frequency=Math.ceil((parseFloat(w)-parseFloat(i))/parseFloat(k))+1; //次數
	//console.log(frequency);
	
	cutting=parseFloat(w)+parseFloat(frequency)*parseFloat(a);//切削量=w+次數*安全距離
	//console.log(cutting);
	
	var time=getTime(cutting, s , f )+parseFloat(frequency)*parseFloat(q)/1000;//切削時間+暫停時間
	return time;
};

function G65Time(w,h,f,s){ //車外牙
	var time=getTime(w,s,f)*h;
	
	return time;
};

function G84Time(w,f,s){ //剛性攻牙沒有F待確認 
	var time=getTime(w,s,f)*2;
	
	return time;
};

function getG0G1Target(old_x,old_y,old_z,comput){
     if(typeof comput.get('A') !== "undefined"){
     	if( typeof comput.get('X') !== "undefined"){
     		//鄰邊=對邊/tan()
     		old_z=old_z+round((Math.abs(old_x-(parseFloat(checkXVariable(comput.get('X')))))/2)/((Math.tan(parseFloat(comput.get('A')) * Math.PI / 180))));
	        old_x=round(parseFloat(checkXVariable(comput.get('X'))));
	}  
     }else{
     	     if( typeof comput.get('X') !== "undefined"){
	            old_x=round(parseFloat(checkXVariable(comput.get('X'))));
	     }

	     if( typeof comput.get('Y') !== "undefined"){
	            old_y=round(parseFloat(checkXVariable(comput.get('Y'))));
	     }

	     if( typeof comput.get('Z') !== "undefined"){
	            old_z=round(parseFloat(checkZVariable(comput.get('Z'))));
	     }

	     if( typeof comput.get('U') !== "undefined"){
	            old_x=round(old_x+parseFloat(comput.get('U')));
	     }

	     if( typeof comput.get('V') !== "undefined"){
	            old_y=round(old_y+parseFloat(comput.get('V')));
	     }

	     if( typeof comput.get('W') !== "undefined"){
	            old_z=round(old_z+parseFloat(comput.get('W')));
	     }
     }

     
     comput.set("nowX", old_x);
     comput.set("nowY", old_y);
     comput.set("nowZ", old_z);
     return comput;
}

function getG2G3Target(old_x,old_y,old_z,comput){
     
     if( typeof comput.get('X') !== "undefined"){
            old_x=round(parseFloat(checkXVariable(comput.get('X'))));
     }

     if( typeof comput.get('Z') !== "undefined"){
            old_z=round(parseFloat(checkZVariable(comput.get('Z'))));
     }

     if( typeof comput.get('U') !== "undefined"){
            old_x=round(old_x+parseFloat(comput.get('U')));
     }

     if( typeof comput.get('W') !== "undefined"){
            old_z=round(old_z+parseFloat(comput.get('W')));
     }

     
     comput.set("nowX", old_x);
     comput.set("nowY", old_y);
     comput.set("nowZ", old_z);
     return comput;
}

function checkXVariable(X){
	X=X.toString();
	if(X.indexOf("#102")>=0){
		X=X.replace("#102",parseFloat(outer_diameter)+0.4);
	}else if(X.indexOf("#108")>=0){
		X=X.replace("#108",parseFloat(outer_diameter)+0.4+4.0);
	}else if(X.indexOf("-#103")>=0){
		X=X.replace("-#103",-round((Math.tan(parseFloat(angle) * Math.PI / 180))/parseFloat(turning_tool_width)));
	}
	return X;
}

function checkZVariable(Z){
	if(Z=="#145"){
		Z=parseFloat(turning_tool_width)+parseFloat(length);
	}
	return Z;
}

function checkS1Variable(S){
	if(S.trim()=="1=#101"){
		S=parseFloat(document.getElementById('A').value);
		s1=parseInt(S);
	}else if(S.trim()=="2=#101"){
		S=parseFloat(document.getElementById('A').value);
		s=parseInt(S);
	}else if((S.trim()).indexOf('2=')>=0){
		S=S.split("=")[1];
		s=parseInt(S);
	}else if((S.trim()).indexOf('3=')>=0){
		S=S.split("=")[1];
	}else if((S.trim()).indexOf('4=')>=0){
		S=S.split("=")[1];
	}
	return S;
}
function getG4Target(old_x,old_y,old_z,comput){
     
     comput.set("nowX", old_x);
     comput.set("nowY", old_y);
     comput.set("nowZ", old_z);
     return comput;
}

function round(num) {
    var m = Number((Math.abs(num) * 1000).toPrecision(15));
    return Math.round(m) / 1000 * Math.sign(num);
}

function check9100(){
	if(document.getElementById('A').value=='' ||
		    document.getElementById('B').value=='' ||
		    	document.getElementById('C').value=='' ||
		    		document.getElementById('E').value=='' ||
		    			document.getElementById('F').value==''){
		alert('請輸入所有資訊');
	        return false;
	}else{
		return true;
	}
}

function getRotating_speed(line){ //取得轉數
    if(line.indexOf('S1=')>=0){
    	let code_list=['X','Y','Z','W','U','V','F','R','I','K','A','Q','J','M','S','C','H','D']
	
	var number="";
	var haveS1=false;
        for(var word = 0 ; word < line.length ; word++){
	    if(line[word]=="S" && (line[word+1]=="1" || line[word+1]=="2" || line[word+1]=="3" || line[word+1]=="4") && line[word+2]=="="){
		word=word+2;
		haveS1=true;
		continue;	
	    }
	    if(haveS1==true){
	    	var haveCode=false;
		for(var j=0;j<code_list.length;j++){
		    if(code_list[j]==line[word]){
		    	haveCode=true;
		    }
		}

		if(haveCode==true){
			break;
		}else{
			number=number+line[word];
		}
	    }
			
	}
	if(number!=""){
		if(number.trim()=="#101"){
			s1= document.getElementById('A').value;
		}else{
			s1= number;
		}
	}

        
    }
}


function getMoveDist(move_map,old_x,old_y,old_z) {
    var moveDist;//移動距離
	//先判斷是否用A走斜角
	if (move_map.has("A")==true){

		var angle=move_map.get("A");
		//X移動的斜角
		if(move_map.has("X")==true || move_map.has("U")==true ){
			var x_move;//單邊x移動量
			
			if(move_map.has("X")==true){
				//console.log("用X走A");
				x_move=Math.abs(checkXVariable(move_map.get("X"))-old_x)/2; 
			}else{
				//console.log("用U走A");
				x_move=Math.abs(move_map.get("U")/2);
			}
			
			var moveDist=(x_move)/Math.sin(angle* Math.PI/180); //斜邊長=單邊x移動量/sin(alpha)
			
			//console.log(moveDist);
			
		}else if(move_map.has("Z")==true || move_map.has("W")==true) {//Z移動的斜角
			var z_move;//Z移動量
			
			if(move_map.has("Z")==true){
				//console.log("用Z走A");
				z_move=Math.abs(checkZVariable(move_map.get("Z"))-old_z);
			}else{
				//console.log("用W走A");
				z_move=Math.abs(move_map.get("W"));
			}
			
			var moveDist=(z_move)/Math.cos(angle* Math.PI/180); //斜邊長=單邊z移動量/cos(alpha)
			//console.log(moveDist);		
		}else {
			alert("用A走斜角非Z軸或X軸!");
			throw new Error("用A走斜角非Z軸或X軸!")
		}
		
	}else{//非A斜角距離
		//先確認變動的座標有幾個
		var change_count=0;
		//取值之前先假設都沒移動，方便之後計算
		var new_x=old_x;
		var new_y=old_y;
		var new_z=old_z;
		var new_u=0;
		var new_v=0;
		var new_w=0;
		
		if(move_map.has("X")==true){
			change_count++;
			new_x=checkXVariable(move_map.get("X"));
		}
		if(move_map.has("Y")==true){
			change_count++;
			new_y=checkXVariable(move_map.get("Y"));
		}
		if(move_map.has("Z")==true){
			change_count++;
			new_z=checkZVariable(move_map.get("Z"));
		}
		if(move_map.has("U")==true){
			change_count++;
			new_u=Math.abs(move_map.get("U"));
		}
		if(move_map.has("V")==true){
			change_count++;
			new_v=Math.abs(move_map.get("V"));
		}
		if(move_map.has("W")==true){
			change_count++;
			new_w=Math.abs(move_map.get("W"));
		}
		//console.log("change_count="+change_count);
		var x_change=(Math.abs(new_x-old_x)+new_u)/2;
		//y的移動量是否會因為機型要以半徑或直徑計算
		var y_change=Math.abs(new_y-old_y)+new_v;
		var z_change=Math.abs(new_z-old_z)+new_w;
		//console.log("x_change="+x_change);
		//console.log("y_change="+y_change);
		//console.log("z_change="+z_change);
		//有兩個變動座標 通常是X軸+Z軸走斜角
		if(change_count==2){

			moveDist=Math.sqrt((x_change * x_change) + (z_change * z_change));
			//console.log("moveDist="+moveDist);
		}else if(change_count==1){//只有1個座標變動
		
			moveDist=x_change+y_change+z_change;
			//console.log("moveDist="+moveDist);
		}else{
			alert("有三個變動座標!請確認");
			throw new Error("有三個變動座標!請確認");
		}
	}
	
	return round(moveDist);
	
}

function checkOther(line){
	if(line.indexOf('G50')>=0){
		line=line.replace('G50', 'G0');
		//console.log("G50 :::"+line);
	}else if(line.indexOf('G28')>=0){
		line=line.replace('G28', 'G0');
	}
	
	return line;
}

function otherProgram(line){
	var time=0;
	let number=getNumberOfcode(line);
	if(line.indexOf('G65')>=0){ //車牙
		time=G65Time(number.get("W"),number.get("H"),number.get("F"),s1);
		//車牙完會回到原本位置
	}else if(line.indexOf('G79')>=0){//循環鑽孔
		time=G79Time(number.get("W"),number.get("R"),number.get("I"),number.get("K"),number.get("A"),number.get("Q"),number.get("J"),number.get("F"),number.get("S"));
		//循環鑽孔完會回到原本位置
	}else if(line.indexOf('G84')>=0){//鋼性攻牙
		time=G84Time(number.get("W"),number.get("F"),s1);
		//鋼性攻牙會回到原本位置
	}
	return round(time);
}

function haveG98G99(line){
	if(line.indexOf('G98')>=0){
		G98G99="G98";
	}else if(line.indexOf('G99')>=0){
		G98G99="G99";
	}
}

function on_click(){
	document.getElementById('X108').addEventListener('click', function(){
	  InsertContent("\nG0 X#108");
	}, false);

	document.getElementById('X102').addEventListener('click', function(){
	  InsertContent("\nG1 X#102 F0.1 ");
	}, false);

	document.getElementById('G0').addEventListener('click', function(){
	  InsertContent("\nG0 X Z W");
	}, false);

	document.getElementById('G1').addEventListener('click', function(){
	  InsertContent("\nG1 X Z W F");
	}, false);

	document.getElementById('G1_A').addEventListener('click', function(){
	  InsertContent("\nG1 X A F");
	}, false);

	document.getElementById('G2').addEventListener('click', function(){
	  InsertContent("\nG2 X W R F");
	}, false);

	document.getElementById('G3').addEventListener('click', function(){
	  InsertContent("\nG3 X W R F");
	}, false);

	document.getElementById('G4').addEventListener('click', function(){
	  InsertContent("\nG4 U0.");
	}, false);

	document.getElementById('open').addEventListener('click', function(){
	  InsertContent(get_Open());
	}, false);

	$('.drill-toggle').on('click', function(e) {
	    e.preventDefault();
	    $('.drill').toggleClass('is-visible');
	});

	$('.change-toggle').on('click', function(e) {
	    e.preventDefault();
	    $('.change').toggleClass('is-visible');
	});

	$('.fix_surface-toggle').on('click', function(e) {
	    e.preventDefault();
	    $('.fix_surface').toggleClass('is-visible');
	});

    	$('.fix-toggle').on('click', function(e) {
      	    e.preventDefault();
            $('.fix').toggleClass('is-visible');
    	});

    	$('.G79-toggle').on('click', function(e) {
      	    e.preventDefault();
            $('.G79').toggleClass('is-visible');
    	});

    	$('.G65-toggle').on('click', function(e) {
      	    e.preventDefault();
            $('.G65').toggleClass('is-visible');
    	});

    	$('.G84-toggle').on('click', function(e) {
      	    e.preventDefault();
            $('.G84').toggleClass('is-visible');
    	});

    	$('.Cut-toggle').on('click', function(e) {
      	    e.preventDefault();
            $('.Cut').toggleClass('is-visible');
    	});

    	$('.Milling-toggle').on('click', function(e) {
      	    e.preventDefault();
            $('.Milling').toggleClass('is-visible');
    	});




    	document.getElementById('drill_sure').addEventListener('click', function(){
	  InsertContent("\n" +get_drill($('#drill_t_num').val(),$('#drill_deep').val(),$('#drill_M27_M28').val()));
	}, false);

    document.getElementById('change_sure').addEventListener('click', function(){
	  InsertContent("\n" +get_change($('#change_t_num').val()));
	}, false);

	document.getElementById('fix_surface_sure').addEventListener('click', function(){
	  InsertContent("\n" +get_fix_surface($('#fix_surface_t_num').val()));
	}, false);

	document.getElementById('fix_sure').addEventListener('click', function(){


	  InsertContent("\n"+get_fix_str($('#fix_t_num').val(),$('#fix_width').val(),$('#fix_deep').val(),$('#fix_drill_width').val(),$('#fix_M27_M28').val()));

	}, false);

	document.getElementById('G79_sure').addEventListener('click', function(){


	  InsertContent("\n"+get_G79($('#G79_t_num').val(),$('#G79_W').val(),$('#G79_R').val(),$('#G79_A').val(),$('#G79_I').val(),$('#G79_K').val(),$('#G79_Q').val(),$('#G79_J').val(),$('#G79_F').val(),$('#G79_M27_M28').val()));

	}, false);

	document.getElementById('G65_sure').addEventListener('click', function(){


	  InsertContent("\n"+get_G65($('#G65_t_num').val(),$('#G65_X').val(),$('#G65_Z').val(),$('#G65_W').val(),$('#G65_H').val(),$('#G65_K').val(),$('#G65_F').val(),$('#G65_C').val(),$('#G65_rotating_speed').val(),$('#G65_position').val(),$('#G65_Width').val(),$('#G').val()));

	}, false);
        
        document.getElementById('G65_F').addEventListener('change', (event) => {
  		$('#G65_K').val(parseFloat($('#G65_F').val())*0.76)
	});

	document.getElementById('G84_sure').addEventListener('click', function(){


	  InsertContent("\n"+get_G84($('#G84_t_num').val(),$('#G84_W').val(),$('#G84_F').val(),boringSpeed($('#G').val(),$('#G84_M').val()),$('#G84_M27_M28').val()));

	}, false);

	document.getElementById('Cut_sure').addEventListener('click', function(){

	  InsertContent("\n"+get_Cut($('#Cut_X1').val(),$('#Cut_F1').val(),$('#Cut_X2').val(),$('#Cut_F2').val(),$('#Cut_F3').val()));

	}, false);

	document.getElementById('Milling_t').addEventListener('click', function(){

	  InsertContent("\n"+get_milling_T($('#Milling_t_number').val(),$('#Milling_fixture').val(),$('#Milling_Z').val(),$('#S3').val()));

	}, false);

	document.getElementById('Milling_start').addEventListener('click', function(){

	  InsertContent("\n"+get_milling());

	}, false);

	document.getElementById('GO').addEventListener('click', function(){
	  var fileContentArray = document.getElementById("program_area").value.split(/\r\n|\n/);
	  read_program(fileContentArray)

	}, false);
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function get_fix_str(fix_t_num,fix_width,fix_deep,fix_drill_width,fix_M27_M28){//刀號,刀寬，深度，孔徑
   var fix_str="";
   fix_str=fix_str+"\nG0 X#6"+fix_t_num+" T"+fix_t_num;
   if(fix_M27_M28=="1"){
   	fix_str=fix_str+" M27";
   }
   fix_str=fix_str+"\nZ5.0 ";
   fix_str=fix_str+"\nG50 "+fix_width+"X ";
   fix_str=fix_str+"\nG1 X"+fix_drill_width+"+0.2 F0.02";
   fix_str=fix_str+"\nG1 W0.4 F0.2 ";
   fix_str=fix_str+"\nG1 X"+fix_drill_width+" A-45. F0.02 ";
   fix_str=fix_str+"\nG1 W"+fix_deep+"-0.2 F0.025 ";
   fix_str=fix_str+"\nG1 X"+fix_drill_width+"+0.2 A45 F0.01 ";
   fix_str=fix_str+"\nG1 X"+fix_width+"+0.01 F0.05 ";
   fix_str=fix_str+"\nG0 Z0 ";
   fix_str=fix_str+"\nX"+fix_width;
   fix_str=fix_str+"\nG50 X#6"+fix_t_num;
   if(fix_M27_M28=="2"){
   	fix_str=fix_str+"\nM28";
   }
   fix_str=fix_str+"\n";
   return fix_str;
}

function get_drill(drill_t_num,drill_deep,drill_M27_M28){
   var drill_str="";
   drill_str=drill_str+"\nG0 X#6"+drill_t_num+" T"+drill_t_num;
   if(drill_M27_M28=="1"){
   	drill_str=drill_str+" M27";
   }
   drill_str=drill_str+"\nZ5.0 ";
   drill_str=drill_str+"\nG1 W"+drill_deep+" F0.025 ";
   drill_str=drill_str+"\nG4 U0.2 ";
   drill_str=drill_str+"\nG0 Z0 ";
   if(drill_M27_M28=="2"){
   	drill_str=drill_str+"\nM28";
   }
   drill_str=drill_str+"\n";
   return drill_str;	
}

function get_change(change_t_num){
   var change_str="";
   change_str=change_str+"\n Y#5"+change_t_num+" T"+change_t_num;
   change_str=change_str+"\n";
   return change_str;	
}

function get_fix_surface(fix_surface_t_num){
   var fix_surface_str="";
   fix_surface_str=fix_surface_str+"\nY#5"+fix_surface_t_num+" T"+fix_surface_t_num;
   fix_surface_str=fix_surface_str+"\nX#102Z0.1 ";
   fix_surface_str=fix_surface_str+"\nG1X-0.1F0.04 ";
   fix_surface_str=fix_surface_str+"\nG1X"+document.getElementById('B').value+"-[0.1*2]F0.1 ";
   fix_surface_str=fix_surface_str+"\nG1X#102A45.F0.04 ";
   fix_surface_str=fix_surface_str+"\nG0X#108  ";
   return fix_surface_str;	
}



function get_G79(G79_t_num,G79_W,G79_R,G79_A,G79_I,G79_K,G79_Q,G79_J,G79_F,G79_M27_M28){
   var G79_str="";
   G79_str=G79_str+"\nG0 X#6"+G79_t_num+" T"+G79_t_num;
   if(G79_M27_M28=="1"){
   	G79_str=G79_str+" M27";
   }
   G79_str=G79_str+"\nZ5.0 ";
   G79_str=G79_str+"\nG79 W"+G79_W+" R"+G79_R+" A"+G79_A+" I"+G79_I+" K"+G79_K+" Q"+G79_Q+" J"+G79_J+" F"+G79_F;
   G79_str=G79_str+"\nG4 U0.2 ";
   G79_str=G79_str+"\nG0 Z0 ";
   if(G79_M27_M28=="2"){
   	G79_str=G79_str+"\nM28";
   }
   G79_str=G79_str+"\n";
   return G79_str;	
}

function get_G65(G65_t_num,G65_X,G65_Z,G65_W,G65_H,G65_K,G65_F,G65_C,G65_rotating_speed,G65_position,G65_Width,material){
   var G65_str="";
   G65_str=G65_str+"\nG0 Y#50"+G65_t_num+" T"+G65_t_num+" S1="+G65_rotating_speed;
   G65_str=G65_str+"\nG0 X#102 Z"+G65_Z;
   G65_str=G65_str+"\nG65 P9876 X"+G65_X+" Z"+G65_Z+" W"+(parseFloat(G65_W)+parseFloat(G65_position)-((parseFloat(G65_Width)/2)+0.25))+" H"+threadingFrequency(material,G65_F)+" K"+G65_K+" F"+G65_F+" C"+G65_C;
   G65_str=G65_str+"\nG0 X#108 ";
   G65_str=G65_str+"\nS1=#101 ";
   G65_str=G65_str+"\n";
   return G65_str;	
}


function get_G84(G84_t_num,G84_W,G84_F,G84_rotating_speed,G84_M27_M28){
   var G84_str="";
   G84_str=G84_str+"\nG0 X#6"+G84_t_num+" T"+G84_t_num+" S1="+G84_rotating_speed;
   if(G84_M27_M28=="1"){
   	G84_str=G84_str+" M27";
   }
   G84_str=G84_str+"\nZ5.0 ";
   G84_str=G84_str+"\nG84 W"+G84_W+" F"+G84_F+" D1,R1";
   G84_str=G84_str+"\nG4 U0.2 ";
   G84_str=G84_str+"\nG0 Z0 ";
   if(G84_M27_M28=="2"){
   	G84_str=G84_str+"\nM28";
   }
   G84_str=G84_str+"\nS1=#101 ";
   G84_str=G84_str+"\n";
   return G84_str;	
}

function get_Open(){
   var open_str="";
   open_str=open_str+"\nG50 Z0";
   open_str=open_str+"\nG0 Z-0.2";
   open_str=open_str+"\nG0 X#108";
   return open_str;	
}

function get_Cut(Cut_X1,Cut_F1,Cut_X2,Cut_F2,Cut_F3){
   var Cut_str="";
   Cut_str=Cut_str+"\nG0 Y#501 T01 S1=#101";
   Cut_str=Cut_str+"\nG0 X#102 Z#145";
   Cut_str=Cut_str+"\nG1 X"+Cut_X1+" F"+Cut_F1;
   Cut_str=Cut_str+"\nG1 X"+Cut_X2+" F"+Cut_F2;
   Cut_str=Cut_str+"\nG1 X-#103 F"+Cut_F3;
   Cut_str=Cut_str+"\nM99 ";
   return Cut_str;	
}

function get_milling(){
   var milling_str="";
   milling_str=milling_str+"\nG0 X30.0";
   milling_str=milling_str+"\nG98 M5";
   milling_str=milling_str+"\nM83 ";
   milling_str=milling_str+"\nM24";
   milling_str=milling_str+"\nG28 C0.";
   milling_str=milling_str+"\nG50 C0.";
   milling_str=milling_str+"\nG0 C0.";
   milling_str=milling_str+"\n(----start-----)";
   milling_str=milling_str+"\n";
   milling_str=milling_str+"\n(----end-----)";
   milling_str=milling_str+"\nM85 M25";
   milling_str=milling_str+"\nG99";
   milling_str=milling_str+"\nM3";
   milling_str=milling_str+"\nS1=#101";
   milling_str=milling_str+"\n";
   return milling_str;
}

function get_milling_T(milling_t_number,milling_fixture,milling_Z,S3){
   var milling_str="";
   milling_str=milling_str+"G0 Y#5"+milling_t_number+" T"+milling_t_number+" S3="+S3;
   if(milling_fixture=="0"){
   	milling_str=milling_str+"\nG0 X#102 Z10.0+"+milling_Z;
   }else if(milling_fixture=="1"){
   	milling_str=milling_str+"\nG0 X#102+14.0 Z10.0+"+milling_Z;
   }
   milling_str=milling_str+"\n(--Write--)";
   milling_str=milling_str+"\nG0 X30.0";
   return milling_str;
}


function InsertContent(Content)
{
    var myArea = document.getElementById("program_area");
 
    //IE
    if (document.selection) 
   {
      myArea.focus();
      var mySelection =document.selection.createRange();
      mySelection.text = Content;
   }
   //FireFox
   else  
  {
     var myPrefix = myArea.value.substring(0, myArea.selectionStart);
     var mySuffix = myArea.value.substring(myArea.selectionEnd);
     myArea.value = myPrefix + Content + mySuffix;
   }
   myArea.focus();
}


function threadingFrequency(material,P) {//材質,批取
  
  let threadingFrequencyArray = [
    				 [0.3  ,{BSBM:3  ,AL:4  ,SUM:4  ,SUS:5 }],  
                     [0.5  ,{BSBM:4  ,AL:5  ,SUM:5  ,SUS:6 }],
                     [0.7  ,{BSBM:5  ,AL:6  ,SUM:6  ,SUS:7 }],
					 [0.8  ,{BSBM:5  ,AL:7  ,SUM:7  ,SUS:8 }],
					 [1.0  ,{BSBM:6  ,AL:7  ,SUM:7  ,SUS:9 }],
					 [1.25 ,{BSBM:7  ,AL:8  ,SUM:8  ,SUS:12}],
					 [1.5  ,{BSBM:8  ,AL:10 ,SUM:10 ,SUS:14}],
					 [2.0  ,{BSBM:10 ,AL:13 ,SUM:13 ,SUS:18}]
                	 ];

  //console.log(material);
  //console.log(P);
  var threadingFrequency;
  for (var i=0; i<threadingFrequencyArray.length; ++i) {
    if(threadingFrequencyArray[i][0]==P){
	
      if(material=='2'){
        threadingFrequency=threadingFrequencyArray[i][1].BSBM
		//console.log(threadingFrequencyArray[i][1].BSBM);
	  }else if(material=='0'){
        threadingFrequency=threadingFrequencyArray[i][1].AL
		//console.log(threadingFrequencyArray[i][1].AL);
	  }else if(material=='3'){
        threadingFrequency=threadingFrequencyArray[i][1].SUM
	  }else{
        threadingFrequency=threadingFrequencyArray[i][1].SUS
		//console.log(threadingFrequencyArray[i][1].SUS); 
	  }
    }
  }
  return threadingFrequency;
}


function boringSpeed(material, M) {//材質,螺絲M
  debugger
  let boringSpeedArray = [
    				 ['2',{_M3:600,M3_M5:400,M5_:350}], 
                 	 ['0'  ,{_M3:500,M3_M5:400,M5_:300}], 
                     ['3' ,{_M3:500,M3_M5:400,M5_:300}], 
                     ['1' ,{_M3:400,M3_M5:300,M5_:250}]
                	 ];
var s;
  for (var i=0; i<boringSpeedArray.length; ++i) {
    if(boringSpeedArray[i][0]==material){
       
      if(M<3){
        s=boringSpeedArray[i][1]._M3;
        console.log(boringSpeedArray[i][1]._M3);
      }else if(M>5){
        s=boringSpeedArray[i][1].M5_;
        console.log(boringSpeedArray[i][1].M5_);
      }else{
      	s=boringSpeedArray[i][1].M3_M5;
        console.log(boringSpeedArray[i][1].M3_M5);
        
      }
    }
  }

  return s;
  

}