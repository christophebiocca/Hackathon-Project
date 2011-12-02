<script type = "text/javascript">
	var key_computer = function(k,v,output){

		var color = colorVal(k.x,k.y)/3921.5;
		color = parseInt(color);
		output(k,color);
	}
	
	var control_experiment = function(x,y){
		var color = colorVal(x,y)/3921.5;
		color = parseInt(color);
		return color;
	}
	
</script>
lol