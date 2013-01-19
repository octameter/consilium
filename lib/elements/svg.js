function Svg()
{
	this.htmlElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");	
	this.htmlElement.setAttribute("version", "1.1");
	
	this.data = new Model();
	
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
	
	var maxX = this.data.getDauer() + this.next;
	var maxY = 200;
	
	console.log("Zeitdauer ", maxX);

	this.htmlElement.setAttribute("width", parseFloat( maxX + left + right ));
	this.htmlElement.setAttribute("height", parseFloat( maxY + top + bottom ));
	
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
	this.getHtmlElement().appendChild(line);
};

Svg.prototype.drawPunkte = function()
{
	var size = this.data.punkte.length;
	
	console.log("Punkte ",this.data.punkte.length);
	
	this.drawPunkt( this.rechts, 0, true);
	
	while(size--)
	{		
		this.drawPunkt( this.data.punkte[size].x, this.data.punkte[size].y, false);	
	}
	
};

Svg.prototype.drawPunkt = function(x,y, movable)
{	
	console.log("Punkt",x,y);
	
	var kreis = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	kreis.setAttribute("transform","translate(0 0)");
	
	var cy = y + this.oben;
	var cx = x;
	
	if(movable || true)
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
	}
	
	kreis.setAttribute("fill", "rgba(255,55,55,0.6)" );
	kreis.setAttribute("stroke", "#FFFFFF" );
	kreis.setAttribute("stroke-width", "2");
	kreis.setAttribute("cx", cx);
	kreis.setAttribute("cy", cy);
	kreis.setAttribute("r","18");
	
	this.getHtmlElement().appendChild(kreis);
};