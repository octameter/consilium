/**
 * BUTTON
 */

function Button()
{
	this.element = document.createElement("button");
}

Button.prototype.setLabel = function( label )
{
	this.element.innerHTML = label;
};

Button.prototype.setContainer = function( parent )
{
	parent.appendChild( this.element );
};

Button.prototype.onTouch = function( onTouchHandler )
{
	if("ontouchstart" in window)
	{
		this.element.addEventListener("touchstart", onTouchHandler, false);		
	}
	else
	{
		this.element.addEventListener("click", onTouchHandler, false);			
	}
};

Button.prototype.setBlue = function()
{
	this.element.setAttribute("class", "button-blue");
};

Button.prototype.setBeveled = function()
{
	this.element.className += " button-beveled";
};

Button.prototype.setTopLeft = function()
{	
	this.element.style["position"] = "absolute";
	this.element.style["top"] = "0px";
	this.element.style["left"] = "0px";
}; 

/**
 * CHART
 */
function Chart()
{
	this.element = document.createElement("div");
	this.element.setAttribute("class","chart");
	
	this.scroller = document.createElement("div");	
	this.scroller.setAttribute("class","scrollableX");
	this.element.appendChild(this.scroller);
	
	this.data = {
			start : 0,
			punkte : [],
			end : 1500,
			kategorie : 40
	};
	
	this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");	
	this.svg.setAttribute("id","chartSVG");
	this.svg.setAttribute("version", "1.1");
	this.scroller.appendChild(this.svg);

	chart = this;
}

Chart.prototype.setBackground = function()
{
	this.element.style["background"] = "silver";
};

Chart.prototype.draw = function()
{
	var nodes = document.getElementById("chartSVG").childNodes;
	
	var i = nodes.length;
	
	while(i--)
	{
		document.getElementById("chartSVG").removeChild(nodes[i]);
	}
	
	var abszisse = parseFloat( this.data.end - this.data.start );
	var ordinate = parseFloat( this.data.kategorie * 4 );
	
		
	//this.svg.setAttribute("viewBox","20 20 2000 200");
	document.getElementById("chartSVG").setAttribute("width", abszisse);
	document.getElementById("chartSVG").setAttribute("height", ordinate);
	
	this.drawCoordinates(abszisse, ordinate);
	this.drawPunkte(abszisse);

	console.log("Zeit "+abszisse);
};



Chart.prototype.drawCoordinates = function(abszisse, ordinate)
{
	var hLineStep = 40;
	var vLineStep = 80;
	
	console.log(ordinate);
	// hLine
	for(var y = 30; y <= ordinate; y += hLineStep)
	{
		this.drawLine(30, y, abszisse, y);		
	}

	// vLine
	for(var w = 30; w <= abszisse; w += vLineStep)
	{
		this.drawLine(w, 40, w, ordinate);		
	}
	
};

Chart.prototype.drawPunkte = function(abszisse)
{					
	var self = this;
	
	self.drawPunkt(abszisse, 40, true);
	
	this.data.punkte.forEach(function(element)
	{	
		self.drawPunkt(element.x - 80, element.y, false);
	});
	
};

Chart.prototype.drawPunkt = function(x,y, movable){
	
	console.log("punkt "+x+" "+y);
	
	var kreis = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	kreis.setAttribute("class","movePoint");
	kreis.setAttribute("transform","translate(0 0)");
	
	if(movable)
	{
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
	kreis.setAttribute("cx", x);
	kreis.setAttribute("cy", y);
	kreis.setAttribute("r","20");
	
	document.getElementById("chartSVG").appendChild(kreis);
};

Chart.prototype.drawLine = function(x1, y1, x2, y2)
{
	var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	line.setAttribute("fill", "rgba(255,55,55,0.6)" );
	line.setAttribute("stroke", "#FFFFFF" );
	line.setAttribute("stroke-width", "2");
	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);
	document.getElementById("chartSVG").appendChild(line);
};

Chart.prototype.setContainer = function( parent )
{
	parent.appendChild( this.element );
};


var ChartPoint = {
		currentX :0,
		currentY :0,
		selectedElement : null,
		currentMatrix : 0,
		selectElement : function(event) 
		{
			
			this.selectedElement = event.target;
			
			this.selectedElement.setAttribute("r","40");
			
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
			event.stopPropagation();
			event.clientY = event.pageY;
			
			var dy = 0;
			
			if(event.clientY - this.currentY)
			{
				dy = event.clientY - this.currentY;
			}
		
			this.currentMatrix[1] += dy;
			
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
				    
			    this.selectedElement.setAttribute("r","20");

			    chart.data.end += 80;
			    
			    var cy = 60 + parseFloat( this.selectedElement.getAttributeNS(null, "transform").slice(10,-1).split(" ")[1]);
			    
			    chart.data.punkte.push({y:cy, x:chart.data.end});
			    
			    chart.draw();
			    
			    this.selectedElement = null;
			}
			
			
		}
};


//var form = document.createElement("form");
//form.style["width","100%"];
//
////var range = document.createElement("input");
////form.appendChild(range);
////range.setAttribute("type","range");
////this.content.appendChild( form );
//
//var scrubbing = document.createElement("div");
//scrubbing.setAttribute( "id", "scrubbing" );
//scrubbing.style["position"] = "relative";	
//scrubbing.style["left"] = "10px";
//scrubbing.style["height"] = "100px";
//scrubbing.style["width"] = "20px";
//
//var dauer = document.createElement("div");
//dauer.setAttribute( "id", "dauer" );
//dauer.style["position"] = "absolute";
////dauer.style["top"] = "30%";
//dauer.style["left"] = "5%";
//dauer.style["background"] = "rgba(204,204,204,1)";
//dauer.style["margin"] = "-2px";
//dauer.style["border"] = "2px solid #CCC";
//dauer.style["width"] = "90%";
//dauer.style["height"] = "100%";
//scrubbing.appendChild(dauer);
//
////var zeiger = document.createElement("div");
////zeiger.setAttribute( "id", "zeiger" );	
////zeiger.style["position"] = "absolute";
////zeiger.style["top"] = "30%";
////zeiger.style["left"] = "5%";
////zeiger.style["background"] = "rgba(0,100,0, 1)";
////zeiger.style["width"] = "90%";
////zeiger.style["height"] = "50%";
////scrubbing.appendChild(zeiger);		
//
//var pointer = document.createElement("div");
//pointer.setAttribute( "id", "pointer" );	
//pointer.style["position"] = "absolute";
//pointer.style["background"] = "rgba(100,0,0, 1)";
////pointer.style["top"] = "30%";
//pointer.style["left"] = "5%";
//pointer.style["width"] = "90%";
//pointer.style["height"] = "50%";
////pointer.style["margin"] = "20px";
//pointer.addEventListener("click", function(event)
//{	
//	console.log("pointer");
//	
////	var x = event.offsetX == undefined ? event.layerX : event.offsetX;
//	
//	//var newValue = x / event.target.clientWidth * player.duration;
//	
//	//position.innerHTML = Util.getVideoTime( newValue );		
//	//player.currentTime = newValue;	
//	
////	document.getElementById("zeiger").style.width = x + "px";						
//}
//, false);
//scrubbing.appendChild(pointer);		
