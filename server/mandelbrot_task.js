var Job = require('./models').Job;
var mandelbrot = function(res){

    var job = new Job();

    job.mapper = String(function(k,v,output){
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
		var color = colorVal(k.x,k.y)/3921.5;
		color = parseInt(color);
		output(k,color);
	});

    job.reducer = String(
        function(k,v,out){out(k,v)}
    );

    var xmin = -2, xmax = 1, ymin = -1, ymax = 1;

    job.mapInput = [];
    for(var i = 0; i < res; ++i){
        var data = [];
        for(var j = 0; j < res; ++j){
            data.push({key: JSON.stringify({x: xmin + i*(xmax - xmin)/res, 
                y:ymin + j*(ymax - ymin)/res}), value:null});
        }
        job.mapInput.push({data: data});
    }
    
    job.data = data;
    job.save(function(err){
        if(err){
            console.error(err);
        } else {
            console.info("Added a mandelbrot task");
        };
    });
};

exports.mandelbrot = mandelbrot;
