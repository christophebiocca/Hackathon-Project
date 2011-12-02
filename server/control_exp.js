
	var colorVal = function(x,y){
		
		//var i = 0;
		var xnew = 0;
		var ynew = 0;
		var xold = 0;
		var yold = 0;
		var value;
		for(i = 0; i<10; i++){

			xnew = (xold^2) - (yold^2) + x;
			ynew = (2*xold*yold) + y;

			value = Math.sqrt((xnew^2) + (ynew^2));
		
			if(value>2){
				return i;
			}


			yold = ynew;
			xold = xnew;
		}
		return 1000000;

	}


	var control_experiment = function(x,y){
		var color = colorVal(x,y);
		//console.log("out of "+color);
		color = color/3921.5;
		color = parseInt(color);
		//console.log("after div  "+color);
		return color;
	}
	
	function create_canvas(){
		var Canvas = require('canvas');
		canvas = new Canvas(1600, 900);
		ctx = canvas.getContext("2d");
		var fs = require('fs');
		/*imageData = c.createImageData(1600, 900);
		var i=0;
		for(y=-1; y<1; y+=0.01){
			for(x=-2.0; x<1; x+=0.01){
				color = control_experiment(x,y)
				imageData.data[i+0] = 100;
				imageData.data[i+1] = 100;
				imageData.data[i+2] = 100;
				imageData.data[i+3] = 1;
				i += 4;
				//console.log(x+"  "+y+"  "+color);
			}
		}
		*/
		ctx.fillStyle = "rgb(200,0,0)";
ctx.fillRect(10,10,55,50);

ctx.fillStyle = "rgba(0,0,200, 0.5";
ctx.fillRect (30, 30, 55, 50);
		
		var out = fs.createWriteStream('state.png');
		var stream = canvas.createPNGStream();

		stream.on('data', function(chunk){
			out.write(chunk);
		});
		

	}
	
	create_canvas();
		
		

