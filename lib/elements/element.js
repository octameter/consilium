function Element() 
{
	this.domElement = document.createElement("div");
}

Element.prototype.setId = function( id )
{
	this.domElement.setAttribute( "id" , id );
};

Element.prototype.getId = function()
{
	return this.domElement.getAttribute( "id" );
};

Element.prototype.setClass = function(className)
{
	this.domElement.setAttribute( "class" , className );
};

Element.prototype.removeClass = function(className)
{
	this.domElement.style["className"].split(className).join("");
};

Element.prototype.setDOMContainer = function( container )
{
	container.appendChild( this.getDOMElement() );
};

Element.prototype.addElement = function( element )
{		
	this.domElement.appendChild( element.getDOMElement() );
};

Element.prototype.getDOMElement = function()
{
	return this.domElement;		
};

Element.prototype.removeDOMElements = function()
{
	var id = this.getId();

	var nodes = document.getElementById( id ).childNodes;
	
	var i = nodes.length;

	while(i--)
	{
		document.getElementById( id ).removeChild(nodes[i]);
	}
	
};

Element.prototype.setSize = function( width, height)
{
	this.getDOMElement().style["width"] = width;
	this.getDOMElement().style["height"] = height;
};

Element.prototype.getOrCreate = function( id, parent )
{
	var domElement = document.getElementById( id );
	
	if(domElement)
	{
		this.domElement = domElement;
	}
	else
	{
		this.setId(id);
		
		parent.appendChild( this.domElement );
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
