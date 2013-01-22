function Svg()
{
	this.domElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");	
	this.domElement.setAttribute("version", "1.1");
	
	this.model = new Model();
	
	this.links = 0;
	this.unten = 0;
	this.rechts = 0;
	this.oben = 0;
	
	// Nächster Eintrag
	this.next = 80;
}

/**
 * Element
 */
Svg.prototype = new Element();


Svg.prototype.drawCoordinates = function(left, top, right, bottom)
{
	
	var maxX = this.model.getDauer() + this.next;
	var maxY = 200;

	document.getElementById( this.getId() ).setAttribute("width", parseFloat( maxX + left + right ));
	document.getElementById( this.getId() ).setAttribute("height", parseFloat( maxY + top + bottom ));
		
	var hLineStep = 40;
	var vLineStep = 80;
	
	this.links = maxX - ( Math.floor( maxX / vLineStep ) * vLineStep );
	this.unten = top + ( Math.floor( maxY / hLineStep) * hLineStep );
	this.rechts = maxX;
	this.oben = top;
	
	// hLine
	for(var y = this.oben; y <= this.unten; y += hLineStep)
	{
		this.drawLine(this.links, y, this.rechts, y);		
	}

	// vLine
	for(var x = this.links; x <= this.rechts; x += vLineStep)
	{
		this.drawLine( x, this.oben, x, this.unten );		
	}	

	if( document.getElementById( this.getId() ).parentNode.scrollLeft == 0)
	{
		document.getElementById( this.getId() ).parentNode.scrollLeft = maxX;				
	}
	else
	{
		document.getElementById( this.getId() ).parentNode.scrollLeft += this.next;		
	}
};

Svg.prototype.getMaxY = function()
{
	return parseFloat(this.unten - this.oben);
};

Svg.prototype.drawLine = function(x1, y1, x2, y2)
{
	var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	line.setAttribute("fill", "rgba(255,55,55,0.6)" );
	line.setAttribute("stroke", "#FFFFFF" );
	line.setAttribute("stroke-width", "2");
	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);
	
	document.getElementById( this.getId() ).appendChild(line);
};

Svg.prototype.drawPunkte = function()
{
	var size = this.model.data.punkte.length;
	
	this.drawPunkt( this.rechts, 0, true);
	
	while(size--)
	{		
		this.drawPunkt( this.model.data.punkte[size].x, this.model.data.punkte[size].y, false);	
	}
	
};

Svg.prototype.drawPunkt = function(x,y, movable)
{		
	var kreis = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	kreis.setAttribute("transform","translate(0 0)");
	
	var cy = y + this.oben;
	var cx = x;
	
	if(movable)
	{
		kreis.setAttribute("class","movePoint");

		if("ontouchstart" in window)
		{	
			kreis.setAttributeNS(null, "ontouchstart", "ChartPoint.selectElement(event)");		
			kreis.setAttributeNS(null, "ontouchend", "ChartPoint.deselectElement(event)");
		}
		else
		{
			kreis.setAttributeNS(null, "onmousedown", "ChartPoint.selectElement(event)");
			kreis.setAttributeNS(null, "onmouseout", "ChartPoint.deselectElement(event)");
			kreis.setAttributeNS(null, "onmouseup", "ChartPoint.deselectElement(event)");
		}		
		kreis.setAttribute("r","18");
	}
	else
	{
		kreis.setAttribute("r","12");		
	}
	
	kreis.setAttribute("fill", "rgba(255,55,55,0.6)" );
	kreis.setAttribute("stroke", "#FFFFFF" );
	kreis.setAttribute("stroke-width", "2");
	kreis.setAttribute("cx", cx);
	kreis.setAttribute("cy", cy);
	
	document.getElementById( this.getId() ).appendChild(kreis);
};