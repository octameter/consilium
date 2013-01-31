/**
 * BUTTON
 */

function Button()
{
	this.domElement = document.createElement("button");
}

Button.prototype = new Element();

Button.prototype.setLabel = function( label )
{
	this.domElement.innerHTML = label;
};

Button.prototype.onTouch = function( onTouchHandler )
{
	
	if("ontouchstart" in window)
	{
		this.domElement.addEventListener("touchstart", onTouchHandler, false);		
	}
	else
	{
		this.domElement.addEventListener("click", onTouchHandler, false);			
	}
	
};

Button.prototype.setAction = function()
{
	this.domElement.setAttribute("class", "button button-blue");
};
Button.prototype.setNavigation = function()
{
	this.domElement.setAttribute("class", "button button-colorless");
};

Button.prototype.setBeveled = function()
{
	this.domElement.className += " button-beveled";
};

Button.prototype.setTopLeft = function()
{	
	this.domElement.style["position"] = "absolute";
	this.domElement.style["top"] = "4px";
	this.domElement.style["left"] = "4px";
}; 

Button.prototype.setBottom = function()
{	
	this.domElement.style["position"] = "absolute";
	this.domElement.style["bottom"] = "40px";
}; 

Button.prototype.setTopRight = function()
{	
	this.domElement.style["position"] = "absolute";
	this.domElement.style["top"] = "4px";
	this.domElement.style["right"] = "4px";
}; 
