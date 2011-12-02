<canvas id="canvas1" width="1600", height="900"></canvas>

<script type = "text/javascript">
	function create_canvas(){
		
		element = document.getElementById("canvas1");
		c = element.getContext("2d");
		imageData = c.createImageData(1600, 900);
		int i=0;
		for(y=-2; y<2; y+=0.0025){
			for(x=-3.55; x<3.5; x+=0.0025){
				color = getColor(x,y)
				imageData.data[i+0] = color;
				imageData.data[i+1] = color;
				imageData.data[i+2] = color;
				imageData.data[i+3] = color/255;
				i += 4;
			}
		}
	}		



</script>