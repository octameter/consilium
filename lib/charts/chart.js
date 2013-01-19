/**
 * CHART
 */
function Chart()
{
	// Chart
	this.svg = new Svg();

	// Scroller
	this.scroller = new Scroller();
	this.scroller.setId( "scroller" );
	this.scroller.setClass("scrollableX");
	this.scroller.addElement( this.svg );
			
	// Container
	this.container = new Element();
	this.container.setId( "chartSVG" );	
	this.container.setClass( "chart" );
	this.container.addElement( this.scroller );
	
	this.data = new Model();
	
	chart = this;
}

Chart.prototype.setViewPart = function( viewPart )
{
	viewPart.appendChild( this.container.getHtmlElement() );
};


Chart.prototype.draw = function()
{	
	//this.svg.removeHtmlElements();
	
	this.svg.drawCoordinates( 20, 40, 20, 40);
	
	// Vertikal Spanne
	ChartPoint.maxY = this.svg.getMaxY(); 
	
	this.svg.drawPunkte();
};


var ChartPoint = {
		currentX : 0,
		currentY : 0,
		selectedElement : null,
		currentMatrix : 0,
		maxY : 0,
		selectElement : function(event) 
		{
			
			this.selectedElement = event.target;
			
			this.selectedElement.setAttribute("r","36");
			
			this.currentX = event.clientX | event.pageX;
			this.currentY = event.clientY | event.pageY;
		
			this.currentMatrix = this.selectedElement.getAttributeNS(null, "transform").slice(10,-1).split(" ");
			
			for(var i=0; i< this.currentMatrix.length; i++) 
			{
			    this.currentMatrix[i] = parseFloat(this.currentMatrix[i]);
			}
			
			if("ontouchmove" in window)
			{	
				this.selectedElement.setAttributeNS(null, "ontouchmove", "ChartPoint.moveElement(event)");				
			}
			else
			{
				this.selectedElement.setAttributeNS(null, "onmousemove", "ChartPoint.moveElement(event)");				
			}

		},
		moveElement : function( event )
		{
			event.preventDefault();
			
			event.clientY = event.pageY;

			var dy = event.clientY - this.currentY;
				
			this.currentMatrix[1] += dy;							
			this.currentMatrix[1] = Math.max( this.currentMatrix[1], 0);
			this.currentMatrix[1] = Math.min( this.currentMatrix[1], this.maxY );
			
			var newMatrix = "translate("+ this.currentMatrix.join(" ") + ")";
			
			this.selectedElement.setAttributeNS(null, "transform", newMatrix);
			this.currentX = event.clientX;
			this.currentY = event.clientY;
		},
		deselectElement : function( event )
		{
			
			if(this.selectedElement)
			{
				if("ontouchmove" in window)
				{	
					this.selectedElement.removeAttributeNS(null, "ontouchmove");			
				}
				else
				{
					this.selectedElement.removeAttributeNS(null, "onmousemove");			
				}
				    
			    this.selectedElement.setAttribute("r","18");
			    
			    var cx = chart.svg.rechts;
			    var cy = parseFloat( this.selectedElement.getAttributeNS(null, "transform").slice(10,-1).split(" ")[1]);

			    console.log( "Add to model ", cx, cy );

			    chart.data.addPunkt( {y:cy, x:cx} );
			    
			    chart.draw();
			    
			    this.selectedElement = null;
			}
	
		}
};