
	var colorVal = function(x,y){
		
		//var i = 0;
		var xnew = 0;
		var ynew = 0;
		var xold = 0;
		var yold = 0;
		var value;
		for(i = 0; i<256; i++){

			xnew = (xold^2) - (yold^2) + x;
			ynew = (2*xold*yold) + y;

			value = Math.sqrt((xnew^2) + (ynew^2));
		
			if(value>2){
				return i;
			}


			yold = ynew;
			xold = xnew;
		}
		return 255;

	}


	var control_experiment = function(x,y){
		var color = colorVal(x,y);
		//console.log("out of "+color);
		color = color;
		color = parseInt(color);
		//console.log("after div  "+color);
		return color;
	}
	
	function create_canvas(){
		var Canvas = require('canvas');
		canvas = new Canvas(1600, 900);
		ctx = canvas.getContext("2d");
		var fs = require('fs');
		imageData = ctx.createImageData(1600, 900);
		var i=0;
		for(y=-4.5; y<4.5; y+=0.01){
			for(x=-8; x<8; x+=0.01){
				color = control_experiment(x,y)
				imageData.data[i+0] = color;
				imageData.data[i+1] = color;
				imageData.data[i+2] = color;
				imageData.data[i+3] = 255;
				i += 4;
			//	console.log(x+"  "+y+"  "+color);
			}
		}
		ctx.putImageData(imageData, 0, 0);
	/*	ctx.fillStyle = "rgb(200,0,0)";
ctx.fillRect(10,10,55,50);

ctx.fillStyle = "rgba(0,0,200, 0.5";
ctx.fillRect (30, 30, 55, 50);
	*/	
		var out = fs.createWriteStream('state.png');
		var stream = canvas.createPNGStream();

		stream.on('data', function(chunk){
			out.write(chunk);
		});
		

	}
	
	create_canvas();
		
		

