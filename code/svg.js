/**
  Copyright (C) 2013
              _                 _     
             | |               | |    
    ___ _ __ | |__   __ _   ___| |__  
   / _ \ '_ \| '_ \ / _` | / __| '_ \ 
  |  __/ |_) | | | | (_| || (__| | | |
   \___| .__/|_| |_|\__,_(_)___|_| |_|
       | |                            
       |_|        
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of this 
  software and associated documentation files (the "Software"), to deal in the Software 
  without restriction, including without limitation the rights to use, copy, modify, merge, 
  publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
  to whom the Software is furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all copies or 
  substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
  FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
  ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.          
 */

var Chart = 
{
	xInMs: 1000000,
	stepInMs: 86400000,
	minInMs: 0,
	maxInMs: 0,
	
	yInValue:0.5,
	stepInValue:20,
	minInValue:0,
	maxInValue:40,
	
	top:30,
	right:0,
	left:0,
	bottom:20,
	

	x: function( ms )
	{
		return this.left + ( ms - this.minInMs ) / this.xInMs;		
	},
	
	y: function( value )
	{	
		return this.top + ( value - this.minInValue ) / this.yInValue;
	},
	
	drawLine: function( x1, y1, x2, y2, color)
	{
		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute("fill", color );
		line.setAttribute("stroke", color );
		line.setAttribute("stroke-width", "1");
		line.setAttribute("x1", x1);
		line.setAttribute("y1", y1);
		line.setAttribute("x2", x2);
		line.setAttribute("y2", y2);
		
		return line;
	},
	/**
	 * LABEL ABSZISSE
	 * @param x
	 * @param y
	 */
	drawLabel: function( x, y, legend )
	{
		var labelX = document.createElementNS("http://www.w3.org/2000/svg", "text");
		labelX.setAttribute("width", 50);
		labelX.setAttribute("height", 20);
		labelX.setAttribute("x", x - 50 / 2);
		labelX.setAttribute("y", y - 20 / 2);
		labelX.setAttribute("fill", "rgba(255,255,255,1)");
		labelX.setAttribute("font-size", "1em");
		
		labelX.textContent = legend; 
		
		return labelX;
	},
	drawRectangel: function (x, y, width, height, data, fill, stroke)
	{
		fill = fill || "";
		stroke = stroke || "";
		
		var area = document.createElementNS("http://www.w3.org/2000/svg", "rect");

		area.setAttribute("class","movePoint");
		area.setAttribute("x", x);
		area.setAttribute("y", y);
		area.setAttribute("width", width);
		area.setAttribute("height", height);
		area.setAttribute("data", data);
		area.setAttribute("fill", fill);
		area.setAttribute("stroke", stroke);
	    area.setAttribute("stroke-width", "2");

    	return area;
	}
};

DOModule.chart = function()
{
	// this.removeChilds();
	
	Chart.minInMs = util.zeit("dawn") - 5 * Chart.stepInMs;
	Chart.maxInMs = Chart.minInMs + ( 30 * Chart.stepInMs );
	Chart.realInMs = util.zeit();

	this.element.setAttribute( "width", Chart.x(Chart.maxInMs) + Chart.right );
	this.element.setAttribute( "height", Chart.y(Chart.maxInValue) + Chart.bottom );
};

DOModule.chartSchema = function( schemaArray, produkt )
{
	
	var nodes = this.element.getElementsByTagName("rect");

	for( var n = nodes.length; n > 0 ; n--)
	{
		var data = JSON.parse( nodes[ n - 1 ].getAttribute("data") );
	
		if( !data || !produkt ) continue;
		
		if( data.EAN13 == produkt.EAN13) this.element.removeChild( nodes[ n - 1 ] );
	}
	
	var menge = parseInt( produkt.Menge );
	var verwendet = 0;
	
	for( var i = 0; i < menge && verwendet <= menge; i++ )
	{
		var x = (5 * Chart.stepInMs  / Chart.xInMs ) + ( i * Chart.stepInMs / Chart.xInMs );
		var y = 60;
		var width = 10;

		for( var j = 0; j < schemaArray.length && verwendet <= menge; j++)
		{
			var xSchema = x + ( schemaArray[j].zeit / 30 * Chart.stepInMs / Chart.xInMs );
			
			var height = ( parseInt( schemaArray[j].value ) * 0.25 ) * 30;
			
			verwendet += parseInt( schemaArray[j].value );
		

			if( verwendet <= menge )
			this.add( Chart.drawRectangel(xSchema, y - height, width, height, JSON.stringify( produkt ), "#cc5" ) );		
		}	
	}
};

DOModule.chartCoordinates = function() 
{ 	
	var yStep = Chart.stepInValue / Chart.yInValue;
	var yMin = Chart.y( Chart.minInValue );
	var yMax = Chart.y( Chart.maxInValue );
	
	var xStep = Chart.stepInMs / Chart.xInMs;
	var xMin = Chart.x( Chart.minInMs );
	var xMax = Chart.x( Chart.maxInMs );
	
	for(var x = xMin; x <= xMax; x += xStep )
	{
		// Vertical Line
		this.add( Chart.drawLine( x, yMin - 5, x, yMax,"rgba(255,255,255,1)") );

		// Horizontal Label
		this.add( Chart.drawLabel( x + xStep / 2, Chart.top, util.zeit( "dd.MM", Chart.minInMs + x * Chart.xInMs)) );
	
		// Weekends
		if( util.zeit("weekend", Chart.minInMs + x * Chart.xInMs ) )
		{
			this.add( Chart.drawRectangel( x, yMin, xStep, yMax - yMin, null, "rgba(255,255,255,0.3)" ) );			
		}
	}	
	
	for(var y = yMin; y <= yMax; y+= yStep)
	{
		// Horizontal Line
		this.add( Chart.drawLine( xMin, y, xMax, y, "rgba(255,255,255,1)") );
	}	
}; 


var Symbols =
{    
    busy : function(detail) 
    {
      var spinners = document.createElement("div");     
      
      for(var i = 0; i < 12; i++)
      {
        var spinner =  document.createElement("div");
        spinner.className = "spinner";

        this.setStylePrefix( spinner, "transform", "rotate("+(i*30)+"deg) translate(0, -120%)");
        this.setStylePrefix( spinner, "animationDelay", (i / 12)+"s");

        spinners.appendChild(spinner);
      }
        
      return spinners;
    },
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
      svg.setAttribute("version", "1.1");
      
          var grenze = document.createElementNS("http://www.w3.org/2000/svg", "path");
          grenze.setAttribute("fill", "rgba(255,255,255,1)" );
          grenze.setAttribute("stroke", "rgba(204,204,204,0.8)" );
          grenze.setAttribute("stroke-width", "1");
        grenze.setAttribute("d","M 15 30 L 15 15 C 15 5, 20 6, 25 10 L 45 25 C 50 28, 50 32, 45 35 L 25 50 C 20 55, 15 54, 15 45 L 15 30 Z");
      svg.appendChild(grenze);
      
      return svg;
    },
    caret : function() 
    {   
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

      svg.setAttribute("viewBox","0 0 60 60");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.setAttribute("version", "1.1");
              
        var _caret = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        _caret.setAttribute("stroke", "rgba(150,150,150,1)" );
        _caret.setAttribute("stroke-width", "10");
          _caret.setAttribute("fill", "none" );
          _caret.setAttribute("points","15,5 45,30 15,55");
      svg.appendChild(_caret);
        
        return svg;
    },
    antiCaret : function() 
    {   
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      
      svg.setAttribute("viewBox","0 0 60 60");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.setAttribute("version", "1.1");
      
      var _caret = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      _caret.setAttribute("stroke", "rgba(150,150,150,1)" );
      _caret.setAttribute("stroke-width", "10");
      _caret.setAttribute("fill", "none" );
      _caret.setAttribute("points","45,5 15,30 45,55");
      svg.appendChild(_caret);
      
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
        
        var linie1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        linie1.setAttribute("fill", "rgba(100,100,100,0.8)" );
        linie1.setAttribute("stroke", "#FFFFFF"  );
        linie1.setAttribute("stroke-width", "8");
        linie1.setAttribute("x1","15");
        linie1.setAttribute("y1","15");
        linie1.setAttribute("x2","45");
        linie1.setAttribute("y2","45");
        svg.appendChild(linie1);
        var linie1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        linie1.setAttribute("fill", "rgba(100,100,100,0.8)" );
        linie1.setAttribute("stroke", "#FFFFFF"  );
        linie1.setAttribute("stroke-width", "8");
        linie1.setAttribute("x1","45");
        linie1.setAttribute("y1","15");
        linie1.setAttribute("x2","15");
        linie1.setAttribute("y2","45");
        svg.appendChild(linie1);

        
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
    setStylePrefix: function(element, property, value){
      
      var prefix = ["Webkit","Moz","Ms","O"];
      
      prefix.forEach(function(item)
      {
        element.style[ item + property[0].toUpperCase() + property.slice(1) ] = value;        
      });
      
      element.style[ property ] = value;
          
    }

};

DOModule.addSymbol = function( type )
{
  switch(type)
  {    
    case "error": this.add( Symbols.error() ); break;
    case "busy": this.add( Symbols.busy() ); break;
    case "play": this.add( Symbols.play() ); break;
    case "close": this.add( Symbols.close(11) );
  }
 
  return this;
};


