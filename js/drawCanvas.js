const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
context.beginPath();
context.strokeStyle = 'red';
context.lineWidth = 1;

function draw(from_x,from_z,go_x,go_z){
	var x1=from_x*6;
	var z1=from_z*6;
	var move_y=-x1+100;
	var move_x=-z1+700;
	var x2=go_x*6;
	var z2=go_z*6;
	var to_y=-x2+100;
	var to_x=-z2+700;
    context.moveTo(move_x, move_y);
    context.lineTo(to_x,to_y);
	
	var move_y2=x1+100;
	var move_x2=-z1+700;
	var to_y2=x2+100;
	var to_x2=-z2+700; 
	
	context.moveTo(move_x2, move_y2);
    context.lineTo(to_x2,to_y2);
	
	
    context.stroke();
}

function draw_by_time(from_x,from_z,go_x,go_z,s,G_code){
	//debugger;
	var x_10ms=(go_x-from_x)/(s*1000/10);
	var z_10ms=(go_z-from_z)/(s*1000/10);

    var count=0;
	var refreshIntervalId=setInterval(function() {
		if(count<s*1000/10){
			draw(from_x+(x_10ms*count),from_z+(z_10ms*count),from_x+(x_10ms*(count+1)),from_z+(z_10ms*(count+1)));
			count++;
		}else{
			clearInterval(refreshIntervalId);
		}
	}, 10);

	
}

