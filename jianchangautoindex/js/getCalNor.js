
window.onload=function(){
	on_click();
}

function cal_A(){
	var A_safe=document.getElementById('A_safe').value;
	var A_width=document.getElementById('A_width').value;
	var A_length=document.getElementById('A_length').value;
	var A_fix=document.getElementById('A_fix').value;
	var A_min=document.getElementById('A_min').value;
	var A_cal=parseFloat(A_safe)+parseFloat(A_width)+parseFloat(A_length)+parseFloat(A_fix)-parseFloat(A_min)
	document.getElementById('A_cal').innerHTML="Z軸可加工最小值 : "+A_cal;
}

function cal_B(){
	var B_outer_diameter=document.getElementById('B_outer_diameter').value;
	var B_cal=round(parseFloat(B_outer_diameter)*2/Math.sqrt(3));
	document.getElementById('B_cal').innerHTML="最大外徑 : "+B_cal;
}

function cal_C(){
	var C_amount=parseFloat(document.getElementById('C_amount').value);
	var C_width=parseFloat(document.getElementById('C_width').value);
	var C_length=parseFloat(document.getElementById('C_length').value);
	var C_material_head=parseFloat(document.getElementById('C_material_head').value);
	var C_cal=round(C_amount/parseInt((2500-C_material_head)/(C_width+C_length)))
	document.getElementById('C_cal').innerHTML="總共要 : "+C_cal+" 支料";
}

function cal_D(){
	var D_amount=parseFloat(document.getElementById('D_amount').value);
	var D_second=parseFloat(document.getElementById('D_second').value);
	var D_cal=round((D_amount*D_second)/3600/24);
	var D_cal_hr=round((D_amount*D_second)/3600);
	let d = new Date();
    d.setHours(d.getHours() + D_cal_hr);
	document.getElementById('D_cal').innerHTML="總共要 : "+D_cal+" 天";
	document.getElementById('D_cal_h').innerHTML="完成日期 : "+d;

}

function cal_E(){
	var E_material_amount=parseFloat(document.getElementById('E_material_amount').value);
	var E_second=parseFloat(document.getElementById('E_second').value);
	var E_material_head=parseFloat(document.getElementById('E_material_head').value);
	var E_width=parseFloat(document.getElementById('E_width').value);
	var E_length=parseFloat(document.getElementById('E_length').value);

	var E_cal=round(parseFloat(parseInt((2500-E_material_head)/(E_width+E_length))*E_material_amount*E_second)/3600/24);
	var E_cal_hr=round(parseFloat(parseInt((2500-E_material_head)/(E_width+E_length))*E_material_amount*E_second)/3600);
	let d = new Date();
    d.setHours(d.getHours() + E_cal_hr);
	document.getElementById('E_cal').innerHTML="總共要 : "+E_cal+" 天";
	document.getElementById('E_cal_h').innerHTML="完成日期 : "+d;

}


function cal_F(){
	
	var F_amount=document.getElementById('F_amount').value;
	var F_material=document.getElementById('F_material').value;
	var F_shape=document.getElementById('F_shape').value;
	var F_outer=parseFloat(document.getElementById('F_outer').value);
	var F_dollar=parseFloat(document.getElementById('F_dollar').value);
	var F_material_head=parseFloat(document.getElementById('F_material_head').value);
	var F_width=parseFloat(document.getElementById('F_width').value);
	var F_length=parseFloat(document.getElementById('F_length').value);
    
    var product_in_one = round((2500-F_material_head)/(F_length+F_width));
    var one_pices_material= round(2500/product_in_one)
	var F_cal_1=round(F_outer*F_outer*get_volume_factor(F_shape)*get_proportion(F_material)*one_pices_material/1000);
	var F_cal_2=round((F_cal_1/1000)*F_dollar);
	var F_cal_3=round(F_cal_1*F_amount/1000);

	document.getElementById('F_cal_1').innerHTML="公克數/顆 : "+F_cal_1;
	document.getElementById('F_cal_2').innerHTML="材料價格/顆 : "+F_cal_2;
	document.getElementById('F_cal_3').innerHTML="總重量(公斤) : "+F_cal_3;

}




function on_click(){
	document.getElementById('cal_A_button').addEventListener('click', function(){
	  	cal_A();
	}, false);

	document.getElementById('B_outer_diameter').addEventListener('change', function(){
	  	cal_B();
	}, false);

	document.getElementById('cal_C_button').addEventListener('click', function(){
	  	cal_C();
	}, false);

	document.getElementById('cal_D_button').addEventListener('click', function(){
	  	cal_D();
	}, false);

	document.getElementById('cal_E_button').addEventListener('click', function(){
	  	cal_E();
	}, false);

	document.getElementById('cal_F_button').addEventListener('click', function(){
	  	cal_F();
	}, false);
}

function round(num) {
    var m = Number((Math.abs(num) * 1000).toPrecision(15));
    return Math.round(m) / 1000 * Math.sign(num);
}


