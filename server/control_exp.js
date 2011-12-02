
	var colorVal = function(x,y){
		
		var i = 0;
		var xnew = x;
		var ynew = y;
		var xold = x;
		var yold = x;
		var value;
		for(i = 0; i<1000000; ++i){

			xnew = (xold^2) + (yold^2);
			ynew = 2*xold*yold;

			value = Math.sqrt(xnew^2 + ynew^2);

			if(value>2){
				return i;
			}


			yold = ynew;
			xold = xnew;
		}
		return 1000000;

	}


	var control_experiment = function(x,y){
		var color = colorVal(x,y)/3921.5;
		color = parseInt(color);
		return color;
	}
	
	function create_canvas(){
		var Canvas = require('canvas');
		canvas = new Canvas(1600, 900);
		c = canvas.getContext("2d");
		var fs = require('fs');
		imageData = c.createImageData(1600, 900);
		var i=0;
		for(y=-2; y<2; y+=0.0025){
			for(x=-3.55; x<3.5; x+=0.0025){
				color = control_experiment(x,y)
				imageData.data[i+0] = color;
				imageData.data[i+1] = color;
				imageData.data[i+2] = color;
				imageData.data[i+3] = color/255;
				i += 4;
			}
		}
		
		var out = fs.createWriteStream('state.png');
		var stream = canvas.createPNGStream();

		stream.on('data', function(chunk){
			out.write(chunk);
		});
		

	}
	
	create_canvas();
		
		

