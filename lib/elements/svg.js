function Svg()
{
	this.domElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");	
	this.domElement.setAttribute("version", "1.1");
	
	this.model = new Model();
			
	// Padding
	this.paddingLeft = 20;
	this.paddingRight = 40;
	this.paddingTop = 40;
	this.paddingBottom = 20;

	this.minX = 0;
	this.maxX = 0;
	this.maxXRealtime = 0;
	
	this.minY = 0;
	this.maxY = 100;
}

Svg.prototype = new Element();

/**
 * COORDINATES
 */
Svg.prototype.drawCoordinates = function()
{
	var milliProTag = (24 * 60 * 60 * 1000);
	
	this.minX = this.model.getMinX();

	this.maxXRealtime = Number( this.model.atomuhr.zeit() );
	this.maxX = Math.floor( this.model.atomuhr.zeit() / milliProTag) * milliProTag;
	
	var chartWidth = this.getPixelForX( this.maxXRealtime, true ) + this.paddingRight;
	
	document.getElementById( this.getId() ).setAttribute("width", chartWidth);
	document.getElementById( this.getId() ).setAttribute("height", this.getPixelForY( this.minY, true ) + this.paddingBottom);
	
	// hLine
	for(var y = 0; y <= this.maxY; y += 20)
	{
		this.drawKoordLine( this.minX, y, this.maxXRealtime, y );		
	}

	// vLine
	for(var x = this.minX; x <= this.maxX; x += (24 * 60 * 60 * 1000) )
	{
		this.drawKoordLine( x, this.minY, x, this.maxY );		
		
		this.drawLabelX( x, this.minY );
	}	

	var scrollerWidth = document.getElementById( this.getId() ).parentNode.offsetWidth;

	if(chartWidth - scrollerWidth > 0)
	document.getElementById( this.getId() ).parentNode.scrollLeft = chartWidth - scrollerWidth;		
};

/**
 * LABEL ABSZISSE
 * @param x
 * @param y
 */
Svg.prototype.drawLabelX = function( x, y )
{
	var pixelX = this.getPixelForX(x, true) + 20;
	var pixelY = this.getPixelForY(y, true) - 10;
	
	var labelX = document.createElementNS("http://www.w3.org/2000/svg", "text");
	labelX.setAttribute("x", pixelX);
	labelX.setAttribute("y", pixelY);
	labelX.setAttribute("fill", "rgba(255,255,255,0.7)");
	//labelX.setAttribute("font-size", "1em");
	
	var date = new Date(x);
	labelX.textContent = date.getDate() + "." + (date.getMonth() + 1);
	
	document.getElementById( this.getId() ).appendChild( labelX );
};

/**
 * DATAPOINTS
 * @param id
 */
Svg.prototype.drawPunkte = function(id)
{	
	var punkteById = this.model.data.punkte.slice(0);	

	var dots = punkteById.length;

	var punkt2 = null;
	
	while(dots--)
	{				
		var punkt1 = punkteById[dots];
		
		var active = ( punkt1.id == id );
		
		// Only last days not current
		if(punkt1.x < this.maxX)
		{
			this.drawLine( punkt1, punkt2, active, 11);

			this.drawPunkt( punkt1, false, active);									
		}
		
		punkt2 = punkt1;
	}
	
	// Active movable point
	var punktMov = { x: this.maxXRealtime, id : id };
	// Check if special default value
	var y = this.model.getType( id, "zero" ) || 0;
	
	punktMov.y = (punkt2 && punkt2.id == id) ? punkt2.y : y;

	this.drawPunkt( punktMov, true, true);	
	
	delete punkteById;
};

Svg.prototype.drawLine = function( current, previous, active, padding )
{	
	var msProTag = this.model.msProTag;
	
	// No second point in same category available
	if(!previous || previous.id !== current.id)
	{
		return;
	}
	
	// Distance is more than three days
	if(current.x > ( previous.x + msProTag * 3) )
	{
		return;
	}
	
	var x1 = Number( this.getPixelForX(previous.x, true) );
	var y1 = Number( this.getPixelForY(previous.y, true) );
	var x2 = Number( this.getPixelForX(current.x, true) );
	var y2 = Number( this.getPixelForY(current.y, true) );
	
	var farbe = this.getFarbwert(current.id);
	
	var pad = this.getPaddingFromPoint(x1,y1,x2,y2, padding);
	x1 += pad.x;
	x2 -= pad.x;		
	y1 += pad.y;
	y2 -= pad.y;			

	
	var verbindung = document.createElementNS("http://www.w3.org/2000/svg", "line");
	verbindung.setAttribute("transform","translate(0 0)");
	verbindung.setAttribute("fill", farbe );
	verbindung.setAttribute("stroke", farbe );
	verbindung.setAttribute("stroke-width", "4");		
	
	if(!active)
	{			
		verbindung.setAttribute("opacity", "0.5");			
	}
	
	verbindung.setAttribute("x1", x1);
	verbindung.setAttribute("y1", y1 );
	verbindung.setAttribute("x2", x2 );
	verbindung.setAttribute("y2", y2 );
		
	document.getElementById( this.getId() ).appendChild( verbindung );
};

Svg.prototype.getPaddingFromPoint = function( x1, y1, x2, y2, padding)
{
	var x = (x2 - x1);
	var y = ((y2 - y1) >= 0) ? (y2 - y1) : (y1 - y2);
			
	var atan2 = Math.atan2(y, x);

	var xPad = ( Math.cos(atan2) * padding );
	var yPad = ( Math.sin(atan2) * padding );
	
	if( y2 < y1)
	{
		yPad = -1 * yPad;			
	}
	
	return {x:xPad, y:yPad};
};

Svg.prototype.drawKoordLine = function(x1, y1, x2, y2)
{	
	x1 = this.getPixelForX(x1, true);
	x2 = this.getPixelForX(x2, true);
	y1 = this.getPixelForY(y1, true);
	y2 = this.getPixelForY(y2, true);

	var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	line.setAttribute("fill", "rgba(255,55,55,0.6)" );
	line.setAttribute("stroke", "rgba(255,255,255,0.6)" );
	line.setAttribute("stroke-width", "2");
	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);
	
	document.getElementById( this.getId() ).appendChild( line );
};

Svg.prototype.drawPunkt = function(punkt, movable, active)
{				
	var kreis = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	
	var cx = this.getPixelForX( punkt.x, true );
	var cy = this.getPixelForY( this.maxY, true );
	var y = this.getPixelForY( punkt.y, false);
	kreis.setAttribute("transform","translate(0 " + y + ")");

	var farbe = this.getFarbwert(punkt.id);
	
	if(active)
	{
		if(movable)
		{
			kreis.setAttribute("class","movePoint");
			kreis.setAttribute("stroke","rgba(255,255,255,0.9)");		
			kreis.setAttribute("r","18");
			
			if("ontouchstart" in window)
			{	
				kreis.ontouchstart = function(event) { ChartPoint.selectElement(event); };
				kreis.ontouchend = function(event) { ChartPoint.deselectElement(event); };
			}
			else
			{
				kreis.setAttributeNS(null, "onmousedown", "ChartPoint.selectElement(event)");
				kreis.setAttributeNS(null, "onmouseout", "ChartPoint.deselectElement(event)");
				kreis.setAttributeNS(null, "onmouseup", "ChartPoint.deselectElement(event)");
			}						
		}
		else
		{
			kreis.setAttribute("class","popupPoint");
			kreis.setAttribute("opacity", "1");
			kreis.setAttribute("stroke","rgba(255,255,255,0.9)");		
			kreis.setAttribute("r","10");		
			
			if("ontouchstart" in window)
			{	
				kreis.ontouchstart = function(event) { ChartPoint.selectOldElement(event); };
				kreis.ontouchend = function(event) { ChartPoint.deselectOldElement(event); };
			}
			else
			{
				kreis.setAttributeNS(null, "onmousedown", "ChartPoint.selectOldElement(event)");
			}	
		}
	}
	else
	{
		kreis.setAttribute("r","10");		
		kreis.setAttribute("opacity", "0.7");
		kreis.setAttribute("stroke", farbe);			
	}
	
	kreis.setAttribute("data", JSON.stringify( punkt ) );
	kreis.setAttribute("fill", farbe ); 
	kreis.setAttribute("stroke-width", "2");
	kreis.setAttribute("cx", cx);
	kreis.setAttribute("cy", cy);
	
	document.getElementById( this.getId() ).appendChild(kreis);
};

/**
 * Calculation x,y <-> pixelX, pixelY in graph
 * @param with padding (true | false) 
 * @returns
 */
Svg.prototype.getPixelForX = function( x, padding )
{
	var paddingLeft = this.paddingLeft;
	
	if(!padding) paddingLeft = 0;
	
	var pixelForX = parseInt( 0.000001 * ( x - this.minX ) );
	
	return Math.floor( paddingLeft + pixelForX);
};

Svg.prototype.getXForPixel = function( pixelX, padding )
{
	var paddingLeft = this.paddingLeft;
	
	if(!padding) paddingLeft = 0;
	
	var xForPixel = pixelX - paddingLeft;
		
	return parseInt( xForPixel / 0.000001 ) + this.minX;
};

Svg.prototype.getPixelForY = function(y, padding)
{
	var paddingTop = this.paddingTop;
	
	if(!padding) paddingTop = 0;
	
	var pixelForY = parseInt( 2 * ( this.maxY - y ) );
	
	return Math.floor( paddingTop + pixelForY );
};

Svg.prototype.getYForPixel = function(pixelY, padding)
{
	var paddingTop = this.paddingTop;
	
	if(!padding) paddingTop = 0;
	
	var yForPixel = pixelY - paddingTop;  
	
	return this.maxY - parseInt( yForPixel / 2 );
};

Svg.prototype.getFarbwert = function(id)
{
	return this.model.getType(id, "farbwert");
};

/**
 * LEGENDE
 */
Svg.prototype.getLegende = function(x, y)
{
	x = x - 20;
	
	var box = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	box.id = "box";
	box.setAttribute("visibility","hidden");
	box.setAttribute("zIndex","10");
	box.setAttribute("fill", "rgba(100,100,100,0.8)" );
	box.setAttribute("stroke", "rgba(204,204,204,0.8)" );
	
	var xy0 = (x)+","+(y);
	var xy1 = (x - 15)+","+(y - 15);
	var xy2 = (x - 15)+","+(y - 30);
	var xy3 = (x - 200)+","+(y - 30);
	var xy4 = (x - 200)+","+(y + 100);
	var xy5 = (x - 15)+","+(y + 100);
	var xy6 = (x - 15)+","+(y + 15);

	box.setAttribute("visibility", "visible");
	box.setAttribute("points", xy0+" "+xy1+" "+xy2+" "+xy3+" "+xy4+" "+xy5+" "+xy6);
		
	var legend = document.createElementNS("http://www.w3.org/2000/svg", "text");
	legend.setAttribute("visibility","hidden");
	legend.setAttribute("color", "white" );
	legend.setAttribute("fill", "white");
	legend.setAttribute("font-size", "1.2em");
	svg.appendChild(legend);
};
