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


Svg.prototype.drawCoordinates = function()
{
	var current= new Date();
	
	var milliProTag = (24 * 60 * 60 * 1000);
	
	this.maxXms = current.getTime();
	this.maxX = Math.floor( current.getTime() / milliProTag) * milliProTag;
	
	this.minX = this.maxX - ( 14 * 24 * 60 * 60 * 1000 );
	
	document.getElementById( this.getId() ).setAttribute("width", this.getPixelForX( this.maxXms, true ) + this.paddingRight);
	document.getElementById( this.getId() ).setAttribute("height", this.getPixelForY( this.minY, true ) + this.paddingBottom);
	
	// hLine
	for(var y = 0; y <= this.maxY; y += 20)
	{
		this.drawLine( this.minX, y, this.maxXms, y );		
	}

	// vLine
	for(var x = this.minX; x <= this.maxX; x += (24 * 60 * 60 * 1000) )
	{
		this.drawLine( x, this.minY, x, this.maxY );		
		
		this.drawLabelX( x, this.minY );
	}	

	if( document.getElementById( this.getId() ).parentNode.scrollLeft == 0)
	{
		//
		document.getElementById( this.getId() ).parentNode.scrollLeft = this.getPixelForX(this.maxXms, false);		
		
		//document.getElementById( this.getId() ).parentNode.style["webkitTransform"] = "translateX(-1000px)";				
	}

};

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

Svg.prototype.drawLine = function(x1, y1, x2, y2)
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

Svg.prototype.drawPunkte = function()
{
	var size = this.model.data.punkte.length;
	
	var active = true;

	this.drawPunkt( { x:this.maxXms, y:this.maxY, id:1}, true, active);
	
	while(size--)
	{		
		var punkt = this.model.data.punkte[size];
		
//		if( size > 0)
//		this.linePunkte( this.model.data.punkte[size],  this.model.data.punkte[size-1], active);
		
		this.drawPunkt( punkt, false, active);	
	}
	
};

Svg.prototype.drawPunkt = function(punkt, movable, active)
{			
	var kreis = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	kreis.setAttribute("transform","translate(0 0)");
	
	var cy = this.getPixelForY( punkt.y, true );
	var cx = this.getPixelForX( punkt.x, true );
	var farbe = this.getFarbwertForXY( punkt.id );
	
	if(movable)
	{
		kreis.setAttribute("class","movePoint");

		if("ontouchstart" in window)
		{	
			kreis.ontouchstart = function(event) { ChartPoint.selectElement(event); };
			kreis.ontouchend = function(event) { ChartPoint.deselectElement(event); };
			
			// Events not triggered in Android
			//kreis.setAttributeNS(null, "ontouchstart", "ChartPoint.selectElement(event)");		
			//kreis.setAttributeNS(null, "ontouchend", "ChartPoint.deselectElement(event)");
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
	
	kreis.setAttribute("fill", farbe ); 
	kreis.setAttribute("stroke", farbe);		
	kreis.setAttribute("stroke-width", "2");

	if(active)
	{
		kreis.setAttribute("stroke", "rgba(255,255,255,0.9)" );		
		kreis.setAttribute("stroke-width", "4");
	}

	kreis.setAttribute("cx", cx);
	kreis.setAttribute("cy", cy);
	kreis.setAttribute("data-id", punkt.id);
	
	document.getElementById( this.getId() ).appendChild(kreis);
};

Svg.prototype.linePunkte = function( current, previous, active )
{
	var verbindung = document.createElementNS("http://www.w3.org/2000/svg", "line");
	verbindung.setAttribute("transform","translate(0 0)");

	verbindung.setAttribute("stroke", "rgba(255,55,55,0.7)" );
	verbindung.setAttribute("stroke-width", "2");
	
	if(active)
	{
		verbindung.setAttribute("stroke", "rgba(255,255,255,0.9)" );	
		verbindung.setAttribute("stroke-width", "4");
	}
	
	verbindung.setAttribute("x1", previous.x);
	verbindung.setAttribute("y1", previous.y + this.oben);
	verbindung.setAttribute("x2", current.x);
	verbindung.setAttribute("y2", current.y + this.oben);
	
	document.getElementById( this.getId() ).appendChild( verbindung );
};


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

Svg.prototype.getFarbwertForXY = function(id)
{
	return this.model.getTypeFarbwert( id );
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
	return box;
		
	var legend = document.createElementNS("http://www.w3.org/2000/svg", "text");
	legend.setAttribute("visibility","hidden");
	legend.setAttribute("color", "white" );
	legend.setAttribute("fill", "white");
	legend.setAttribute("font-size", "1.2em");
	svg.appendChild(legend);
};



//
//	svg.onmouseover = function(event) {     	 		
//
//		if(event.target.id == "punkt"){
//
//			var daten = event.target.getAttributeNS("http://epha.ch/pharmacovigilance", "data");
//			var json = JSON.parse( daten );		
//			
//			var x = event.layerX; 
//			var y = event.layerY - 10;
//			
//			var xy0 = (x)+","+(y);
//			var xy1 = (x + 10)+","+(y - 10);
//			var xy2 = (x + 80)+","+(y - 10);
//			var xy3 = (x + 80)+","+(y - 50);
//			var xy4 = (x - 80)+","+(y - 50);
//			var xy5 = (x - 80)+","+(y - 10);
//			var xy6 = (x - 10)+","+(y - 10);
//
//			box.setAttribute("visibility", "visible");
//			box.setAttribute("points", xy0+" "+xy1+" "+xy2+" "+xy3+" "+xy4+" "+xy5+" "+xy6);
//			
//			legend.setAttribute("visibility", "visible");
//			legend.setAttribute("x", x - 60);
//			legend.setAttribute("y", y - 25);
//			legend.textContent = "C("+json.t.toFixed(0)+") "+json.c.toFixed(0)+"mg/L";
//		}else{
//			box.setAttribute("visibility", "hidden");
//			legend.setAttribute("visibility", "hidden");
//		}
//	};