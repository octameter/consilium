/**
 * STATIC SVG
 * Version 1.1
**/
var Assets = {
		/**
		 * BUSY
		 * @param detail
		 * @returns svgElement
		 */
		
		busy : function(detail) 
		{
			var spinners = document.createElement("div");			
			
			for(var i = 0; i < 12; i++)
			{
				var spinner =  document.createElement("div");
				spinner.className = "spinner";

				this.setStylePrefix( spinner, "transform", "rotate("+(i*30)+"deg) translate(0, -120%)");
				
				if(i == 0)
				{
					this.setStylePrefix( spinner, "animationDelay", "0s");										
				}
				else
				{
					this.setStylePrefix( spinner, "animationDelay", (i / 12)+"s");					
				}

				spinners.appendChild(spinner);
			}
				
			return spinners;
		},
		busyDiv : function(id)
		{
			var busyDiv = document.createElement("div");
			busyDiv.setAttribute("id",id);
			busyDiv.style["display"] = "none";
			busyDiv.style["position"] = "absolute";
			busyDiv.style["left"] = "50%";
			busyDiv.style["top"] = "50%";
			busyDiv.style["width"] = "100px";
			busyDiv.style["height"] = "100px";
			busyDiv.style["margin-left"] = "-50px";
			busyDiv.style["margin-top"] = "-50px";
			busyDiv.appendChild( this.busy() );

			return busyDiv;
		},
		error : function() 
		{		
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

			svg.setAttribute("viewBox","0 0 60 60");
			svg.setAttribute("width", "100%");
			svg.setAttribute("height", "100%");
			svg.setAttribute("version", "1.1");
			
				var kreis = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				kreis.setAttribute("fill", "rgba(255,55,55,0.6)" );
				kreis.setAttribute("stroke", "#FFFFFF" );
				kreis.setAttribute("stroke-width", "0");
				kreis.setAttribute("cx","30");
				kreis.setAttribute("cy","30");
				kreis.setAttribute("r","27");
			svg.appendChild(kreis);
				
			 	var kreuz = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		 	    kreuz.setAttribute("fill", "rgba(255,255,255,0.8)" );
		 	    kreuz.setAttribute("points","15,15 20,15 30,25 40,15 45,15 45,20 35,30 45,40 45,45 40,45 30,35 20,45 15,45 15,40 25,30 15,20 15,15");
		 	svg.appendChild(kreuz);
	 	  	
	 	  	return svg;
		},
		play : function() 
		{		
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

			svg.setAttribute("viewBox","0 0 60 60");
			svg.setAttribute("width","100%");
			svg.setAttribute("height","100%");
			
		 	    var grenze = document.createElementNS("http://www.w3.org/2000/svg", "path");
		 	    grenze.setAttribute("fill", "rgba(255,255,255,1)" );
		 	    grenze.setAttribute("stroke", "rgba(204,204,204,0.8)" );
		 	  	grenze.setAttribute("stroke-width", "1");
		 	 	grenze.setAttribute("d","M 15 30 L 15 15 C 15 5, 20 6, 25 10 L 45 25 C 50 28, 50 32, 45 35 L 25 50 C 20 55, 15 54, 15 45 L 15 30 Z");
	 	 	svg.appendChild(grenze);
	 	 	
	 	 	return svg;
		},
		/**
		 * CLOSE BUTTON
		 * @param percentSize
		 * @returns svgElement
		 */
		close : function(percentSize)
		{
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

			svg.setAttribute("viewBox","0 0 60 60");
			svg.setAttribute("width", percentSize + "%");
			svg.setAttribute("height", percentSize + "%");
			
			svg.style["position"] = "absolute";
			svg.style["right"] = (-0.4 * percentSize ) + "%";
			svg.style["top"] = (-0.4 * percentSize ) + "%";
			
				var kreis = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				kreis.setAttribute("fill", "rgba(105,105,105,0.8)" );
				kreis.setAttribute("stroke", "#FFFFFF" );
				kreis.setAttribute("stroke-width", "6");
				kreis.setAttribute("cx","30");
				kreis.setAttribute("cy","30");
				kreis.setAttribute("r","27");
			svg.appendChild(kreis);
				
			 	var kreuz = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		 	    kreuz.setAttribute("fill", "rgba(100,100,100,0.8)" );
		 	    kreuz.setAttribute("stroke", "#FFFFFF"  );
		 	    kreuz.setAttribute("stroke-width", "8");
		 	    kreuz.setAttribute("points","15,45 30,30 15,15 30,30 45,15 30,30 45,45 30,30");
		 	svg.appendChild(kreuz);
	 	  	
	 	  	return svg;
		},
		/**
		 * FULLSCREEN
		 * @returns
		 */
		fullScreen : function() 
		{
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.setAttribute("viewBox","0 0 60 60");
			svg.setAttribute("width","100%");
			svg.setAttribute("height","100%");
			
				var first = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		 	    first.setAttribute("fill", "rgba(100,100,100,0.8)");
		 	    first.setAttribute("stroke", "#CCCCCC" );
		 	  	first.setAttribute("stroke-width", "2");  	
		 	  	first.setAttribute("x","15");
		 	  	first.setAttribute("y","15");
		 	  	first.setAttribute("width","30");
		 	  	first.setAttribute("height","30");	 	  		
		
			    function bigger(evt) 
			    {
			    	evt.target.setAttributeNS(null,"x","10");
			    	evt.target.setAttributeNS(null,"y","10");
			    	evt.target.setAttributeNS(null,"width","40");
			    	evt.target.setAttributeNS(null,"height","40");	 	  		
			    }
		
			    function smaller(evt) 
			    {
			    	evt.target.setAttributeNS(null,"x","15");
			    	evt.target.setAttributeNS(null,"y","15");
			    	evt.target.setAttributeNS(null,"width","30");
			    	evt.target.setAttributeNS(null,"height","30");	 	  		
			    }
		
		 		first.addEventListener("mouseover", bigger, false);
		 		first.addEventListener("mouseout", smaller, false);

			svg.appendChild(first);
			
			return svg;
		},
		
		/**
		 * PAUSE
		 * @returns
		 */
		pause : function() 
		{
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.setAttribute("viewBox","0 0 60 60");
			svg.setAttribute("width","100%");
			svg.setAttribute("height","100%");
			
		 	    var first = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		 	    first.setAttribute("fill", "rgba(100,100,100,0.8)");
		 	    first.setAttribute("stroke", "#CCCCCC" );
		 	  	first.setAttribute("stroke-width", "2"); 	
		 	  	first.setAttribute("x","5");
		 	  	first.setAttribute("y","10");
		 	  	first.setAttribute("width","20");
		 	  	first.setAttribute("height","40");
	 	  	svg.appendChild(first);
	 	  	
		 	  	var second = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		 	  	second.setAttribute("fill", "rgba(100,100,100,0.8)");
		 	  	second.setAttribute("stroke", "#CCCCCC" );
		 	  	second.setAttribute("stroke-width", "2");
		 	  	second.setAttribute("x","35");
		 	  	second.setAttribute("y","10");
		 	  	second.setAttribute("width","20");
		 	  	second.setAttribute("height","40");
	 	  	svg.appendChild(second);
	 	  	
		 	return svg;
		},
		/**
		 * THUMBS UP
		 * @param votes
		 * @returns
		 */
		likes : function(votes) 
		{		
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			
			svg.setAttribute("viewBox","0 0 70 50");
			svg.setAttribute("width","100%");
			svg.setAttribute("height","100%");
			
			var grenze = document.createElementNS("http://www.w3.org/2000/svg", "path");
			grenze.setAttribute("fill", "rgba(255,255,255,0.9)" );
			grenze.setAttribute("stroke", "rgba(204,204,204,0.8)" );
			grenze.setAttribute("stroke-width", "2");
			grenze.setAttribute("d","M23,8 L23,12 28,24 34,24 36,31 34,38 30,38 24,42 18,43" +
									"C18,43 12,41 15,38 " +  // 5.Finger
									"C15,38 10,36 14,32 " +  // 4.Finger
									"C14,32  8,30 13,26 " +  // 3.Finger
									"C13,26  6,19 20,21" +   // 2.Finger
									"C20,21 14,6  21,8z");   // 1.Finger
			svg.appendChild(grenze);
			
			if(votes > 0)
			{
				var like = document.createElementNS("http://www.w3.org/2000/svg", "text");
				like.setAttribute("id","like");
				like.setAttribute("x","28");
				like.setAttribute("y","20");
				like.setAttribute("font-family", "Verdana");
				like.setAttribute("font-size", "12");
				like.setAttribute("fill", "rgba(204,204,204,0.8)" );
				like.textContent ="+"+votes;
				svg.appendChild(like);
			}
			
			return svg;
		},
		getIcon : function( type, size )
		{
			var image = document.createElement("img");
			image.src = "img/icon/"+type+".png";
			image.width = size;
			image.height = size;
			return image;
		},
		setStylePrefix: function(element, property, value){
			
			var prefix = ["Webkit","Moz","Ms","O"];
			
			prefix.forEach(function(item)
			{
				element.style[ item + property[0].toUpperCase() + property.slice(1) ] = value;				
			});
			
			element.style[ property ] = value;
					
		}

};