/**
 * BUTTON
 */

function Button()
{
	this.element = document.createElement("button");
}

Button.prototype = new Element();

Button.prototype.setLabel = function( label )
{
	this.element.innerHTML = label;
};


Button.prototype.onTouch = function( onTouchHandler )
{
	if("ontouchstart" in window)
	{
		this.element.addEventListener("touchstart", onTouchHandler, false);		
	}
	else
	{
		this.element.addEventListener("mousedown", onTouchHandler, false);			
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
