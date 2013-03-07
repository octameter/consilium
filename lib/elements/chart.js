

/**
 * Eventhandler für Punkte im Chart
 */
var ChartPoint = {
		currentX : 0,
		currentY : 0,
		selectedElement : null,
		currentMatrix : 0,

		selectElement : function(event) 
		{		
			if(event.touches)
			event = event.targetTouches[0];

			this.selectedElement = event.target;			
			this.selectedElement.setAttribute("r","36");
			
			this.currentX = event.clientX || event.pageX;
			this.currentY = event.clientY || event.pageY;
		
			this.currentMatrix = this.selectedElement.getAttributeNS(null, "transform").slice(10,-1).split(" ");
			
			for(var i=0; i< this.currentMatrix.length; i++) 
			{
			    this.currentMatrix[i] = parseFloat(this.currentMatrix[i]);
			}
		},
		selectOldElement : function( event)
		{
			if(event.touches)
			event = event.targetTouches[0];
			
			var data = JSON.parse( event.target.getAttribute("data") );
			var type = chart.model.getType(data.id);
			
			 // alert dialog dismissed
		    function alertDismissed() {
		        // do something
		    }
		    
		    var message = "";
		    message += type.title + "\n\n";
		    message += "Eintrag: "+data.y + "\n";
		    message += "Zeit: "+ new Date(data.x).toLocaleDateString() + "\n";
			
			if(navigator.notification)
			{
				navigator.notification.alert(
					message,
					alertDismissed,
					type.kategorie,
					"Schliessen"
				);
			}
			else
			{
				alert(message);
			}
			
		},
		deselectElement : function( event )
		{
			
			if(this.selectedElement)
			{
				if("ontouchmove" in window)
				{	
					this.selectedElement.ontouchmove = null;
					//this.selectedElement.removeAttributeNS(null, "ontouchmove");			
				}
				else
				{
					this.selectedElement.removeAttributeNS(null, "onmousemove");			
				}
				    
			    this.selectedElement.setAttribute("r","18");
			    
			    var punkt = JSON.parse( this.selectedElement.getAttribute("data") );
			    
			    var cy  = parseFloat( this.selectedElement.getAttributeNS(null, "transform").slice(10,-1).split(" ")[1]);
			    punkt.y = chart.svg.getYForPixel( cy, false );
			    
			    chart.model.addPunkt( punkt );
			    
			    chart.model.atomuhr.addStunden += chart.model.atomuhr.stundenSprung;

			    chart.refresh( punkt.id );
			    
			    this.selectedElement = null;
			}
	
		}
};