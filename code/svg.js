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
var Svg = {

	line: function( params )
	{
		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("fill", params.color || "white");
        line.setAttribute("stroke", params.color || "white");
        line.setAttribute("stroke-width", params.strokeWidth || "1");
        line.setAttribute("x1", params.x1);
        line.setAttribute("y1", params.y1);
        line.setAttribute("x2", params.x2);
        line.setAttribute("y2", params.y2);
		return line;
	},
	label: function( params )
  {
		var labelX = document.createElementNS("http://www.w3.org/2000/svg", "text");
    		labelX.setAttribute("x", params.x);
    		labelX.setAttribute("dx", - params.text.length * 3);
    		labelX.setAttribute("y", params.y - 10);
    		labelX.setAttribute("fill", "rgba(255,255,255,1)");
    		labelX.setAttribute("font-size", "11pt");		
    		labelX.setAttribute("style", "background:blue");		
    		labelX.textContent = params.text; 
    		return labelX;
	},
	rect: function ( params )
	{
		var area = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		area.setAttribute("class","movePoint");
		area.setAttribute("x", params.x);
		area.setAttribute("y", params.y);
		area.setAttribute("width", params.width);
		area.setAttribute("height", params.height);
		area.setAttribute("data", params.data);
		area.setAttribute("fill", params.fill || "");
		area.setAttribute("stroke", params.stroke || "");
	    area.setAttribute("stroke-width", "2");
    	return area;
	},
  circle:function( params )
  {
    var kreis = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    kreis.setAttribute("fill", params.fill);
    kreis.setAttribute("stroke", params.stroke || "#FFFFFF" );
    kreis.setAttribute("stroke-width", params.strokeWidth || "0");
    kreis.setAttribute("cx", params.x);
    kreis.setAttribute("cy", params.y);
    kreis.setAttribute("r", params.r);
    return kreis;
  },
  polygon:function( params )
  {
    var poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    poly.setAttribute("fill", params.fill);
    poly.setAttribute("points", params.points);
    return poly;
  },
  polyline:function( params )
  {
    var caret = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    caret.setAttribute("stroke",params.stroke);
    caret.setAttribute("stroke-width", params.strokeWidth);
    caret.setAttribute("fill", params.fill);
    caret.setAttribute("points", params.points);
    return caret;
  },
  path:function( params )
  {
    var grenze = document.createElementNS("http://www.w3.org/2000/svg", "path");
    grenze.setAttribute("fill",params.fill);
    grenze.setAttribute("stroke", params.stroke);
    grenze.setAttribute("stroke-width", params.strokeWidth);
    grenze.setAttribute("d",params.d);
    return grenze;
  },
  symbol:function() 
  {
    var sym = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    sym.setAttribute("viewBox","0 0 60 60");
    sym.setAttribute("width","100%");
    sym.setAttribute("height","100%");
    return sym;
  },
  play : function() 
  {   
    var params = { "fill":"rgba(255,255,255,1)", "stroke":"rgba(204,204,204,0.8)","strokeWidth":"1" };
    params.d = "M 15 30 L 15 15 C 15 5, 20 6, 25 10 L 45 25 C 50 28, 50 32, 45 35 L 25 50 C 20 55, 15 54, 15 45 L 15 30 Z";
    
    return this.symbol().appendChild( this.path( params ) );
  },
  pause : function() 
  {
    var pauseIcon = this.symbol();
  
    var params = { "fill":"rgba(100,100,100,0.8)", "stroke":"#CCCCCC", "stroke-width":"2", "width":"20", "height":"40","y":"10" };
    params.x = "5";
    pauseIcon.appendChild( this.rect( params ) );
    params.x = "35";
    pauseIcon.appendChild( this.rect( params ) );
      
    return pauseIcon;
  },
  error : function() 
  {   
    var params = {
      fill:"rgba(255,255,255,0.8)",
      points:"15,15 20,15 30,25 40,15 45,15 45,20 35,30 45,40 45,45 40,45 30,35 20,45 15,45 15,40 25,30 15,20 15,15"
    };
    
    var svg = this.symbol(); 
    svg.appendChild( this.circle( {x:"30",y:"30",r:"27", fill:"rgba(255,55,55,0.6)", stroke:"#FFFFFF", "strokeWidth":0 } ) );
    svg.appendChild( this.polygon( params ) );                        
    return svg;
  },    
  caretL : function() 
  {   
    var params = { "stroke":"rgba(150,150,150,1)", "strokeWidth":"10","fill":"none" ,"points":"45,5 15,30 45,55" };
    
    var symbol = this.symbol();
    symbol.appendChild( this.polyline( params ) );
    return symbol;
  },
  caretR : function() 
  {   
    var params = { "stroke":"rgba(150,150,150,1)", "strokeWidth":"10","fill":"none" ,"points":"15,5 45,30 15,55" };
    
    var symbol = this.symbol();
    symbol.appendChild( this.polyline( params ) );
    return symbol;
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
    }
};

DOModule.timeLegend = function( xMin, xMax, xStep, y, minInMs, xInMs ) {

  for(var x = xMin; x <= xMax; x += xStep )
  {
    var params = {
        x: x + xStep / 2,
        y: y,
        text: util.zeit( "dd.MM", minInMs + x * xInMs) 
    };
    
    this.add( Svg.label( params) );    
  }
};

DOModule.timeGrid = function( xMin, xMax, xStep, yMin, yMax, yStep, minInMs, xInMs) {

  for(var x = xMin; x <= xMax; x += xStep )
  {
      // Vertical Line
      this.add( Svg.line( { x1:x, y1:yMin, x2:x, y2:yMax, color: "rgba(255,255,255,1)"} ) ); 
      
      // Weekends
      if( util.zeit("weekend", minInMs + x * xInMs ) )
      {
          this.add( Svg.rect( { x:x, y:yMin, width: xStep, height:yMax - yMin,fill:"rgba(255,255,255,0.3)" } ) );     
      }
  }       
  // Horizontal Line      
  for(var y = yMin; y <= yMax; y+= yStep) this.add( Svg.line( { x1:xMin, y1:y, x2:xMax,y2:y, color:"rgba(255,255,255,1)" } ) );

};


DOModule.addSymbol = function( type )
{
  switch(type)
  {    
    case "error": this.add( Svg.error() );    break;
    case "busy":  this.add( Svg.busy() );     break;
    case "play":  this.add( Svg.play() );     break;
    case "close":   this.add( Svg.close(11) );  break;
    case "caretL": this.add( Svg.caretL() );  break;
    case "caretR": this.add( Svg.caretR() );  break;
  }
 
  return this;
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


var Symbols =
{    


};




