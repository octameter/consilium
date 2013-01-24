/**
 * CHART
 */
function Chart()
{
	this.model = new Model();
	
	chart = this;
	
	this.svg = null;
}

Chart.prototype.init = function( view )
{
	// Chart
	this.svg = new Svg();
	this.svg.setId( "chartSVG" );

	// Scroller
	this.scroller = new Scroller();
	this.scroller.setId( "scroller" );
	this.scroller.setClass( "scrollableX" );
	this.scroller.addElement( this.svg );
		
	// Container
	this.container = new Element();
	this.container.setId( "chart" );	
	this.container.setClass( "chart" );
	this.container.addElement( this.scroller );
	
	view.appendChild( this.container.getDOMElement() );
};


Chart.prototype.draw = function()
{		
	this.svg.removeDOMElements();
	
	this.svg.drawCoordinates();
	
	this.svg.drawPunkte();
};

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
			
			//event : event.targetTouches[0].clientX;
			this.selectedElement = event.target;
			
			this.selectedElement.setAttribute("r","36");
			
			this.currentX = event.clientX || event.pageX;
			this.currentY = event.clientY || event.pageY;
		
			this.currentMatrix = this.selectedElement.getAttributeNS(null, "transform").slice(10,-1).split(" ");
			
			for(var i=0; i< this.currentMatrix.length; i++) 
			{
			    this.currentMatrix[i] = parseFloat(this.currentMatrix[i]);
			}
			
			if("ontouchmove" in window)
			{	
				// Event not triggered in Android
				//this.selectedElement.setAttributeNS(null, "ontouchmove", "ChartPoint.moveElement(event)");				

				this.selectedElement.ontouchmove = function(event) { ChartPoint.moveElement(event); };
			}
			else
			{
				this.selectedElement.setAttributeNS(null, "onmousemove", "ChartPoint.moveElement(event)");				
			}

		},
		moveElement : function( event )
		{
			
			if(this.selectedElement)
			{
				event.preventDefault();
				event.stopPropagation();
				
				if(event.touches)
				event = event.targetTouches[0];
						
				// Browser fix
				event.clientY = event.clientY || event.pageY;
				
				var dy = event.clientY - this.currentY;
				
				this.currentMatrix[1] += dy;							
				this.currentMatrix[1] = Math.max( this.currentMatrix[1], 0 );
				this.currentMatrix[1] = Math.min( this.currentMatrix[1], 200 );
				
				var newMatrix = "translate("+ this.currentMatrix.join(" ") + ")";
				
				this.selectedElement.setAttributeNS(null, "transform", newMatrix);
				this.currentX = event.clientX;
				this.currentY = event.clientY;
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
			    
			    var cx = parseFloat( this.selectedElement.getAttribute("cx") );
			    var cy = parseFloat( this.selectedElement.getAttributeNS(null, "transform").slice(10,-1).split(" ")[1]);
			    var id =  this.selectedElement.getAttribute("data-id");

			    cx = chart.svg.getXForPixel( cx, true );
			    cy = chart.svg.getYForPixel( cy, false );
			    
			    chart.model.addPunkt( {y:cy, x:cx, id:id} );
			    
			    chart.draw();
			    
			    this.selectedElement = null;
			}
	
		}
};