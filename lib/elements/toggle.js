function Toggle()
{
	this.domElement = document.createElement("div");
	this.domElement.setAttribute("class","iphone-toggle-buttons");	
	this.id = null;
	this.selected = false;
}

Toggle.prototype = new Element();

Toggle.prototype.setLabel = function( text )
{
	var label = document.createElement("span");
	label.innerHTML = text;
	label.style["float"] = "left";
	
	this.domElement.insertBefore( label, this.domElement.getElementsByTagName("label")[0] );

};

Toggle.prototype.setId = function(id)
{
	this.id = id;
	
	var label = document.createElement("label");
	label.setAttribute("for", id);	
	this.domElement.appendChild(label);
	
	var input = document.createElement("input");
	input.setAttribute("type", "checkbox");
	input.setAttribute("id", id);
	label.appendChild(input);
	
	var span = document.createElement("span");
	span.innerHTML = "&nbsp;";
	label.appendChild(span);
};

Toggle.prototype.getId = function(id)
{
	return this.id;
};

Toggle.prototype.setChecked = function( flag)
{
	document.getElementById(this.id).setAttribute("checked", flag);
};

Toggle.prototype.onTouch = function( onTouchHandler )
{
	
	if("ontouchstart" in window)
	{
		this.domElement.addEventListener("touchstart", onTouchHandler, false);		
	}
	else
	{
		this.domElement.addEventListener("mousedown", onTouchHandler, false);			
	}
	
};
