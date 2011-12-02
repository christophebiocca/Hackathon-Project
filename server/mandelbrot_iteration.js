<script type = "text/javascript">
	val colorVal = function(x,y){
		
		var i = 0;
		var xnew = x;
		var ynew = y;
		var xold = x;
		var yold = x;
		var value;
		for(i = 0; i<1000000; ++i){

			xnew = (xold^2) + (yold^2);
			ynew = 2*xold*yold;

			value = sqrt(xnew^2 + ynew^2);

			if(value>2){
				return i;
			}


			yold = ynew;
			xold = xnew;
		}
		return 1000000;

	}
</script>
