
function ontouch( elementId, onTouchHandler )
{
	var element = document.getElementById( elementId );
	
	if("ontouchstart" in window)
	{
		element.addEventListener("touchstart", onTouchHandler, false);		
	}
	else
	{
		element.addEventListener("click", onTouchHandler, false);			
	}	
};

function hideContent( elementId )
{
	var element = document.getElementById( elementId );
	element.style["display"] = "none";
};

function showContent( elementId )
{
	var element = document.getElementById( elementId );
	element.style["display"] = "block";
};

function hideView( module, swipe )
{
	var view = module.getDomElement();
	
	view.className = view.className.replace("middle", swipe); 
};

function showView( module )
{	
	var view = module.getDomElement();
	
	view.className = view.className.replace("left", "middle");
	view.className = view.className.replace("right", "middle");
};

function setClass(elementId, className)
{
	var element = document.getElementById(elementId);
	element.setAttribute( "class" , className );
};

Element.prototype.removeClass = function(elementId, className)
{
	var element = document.getElementById(elementId);
	element.style["className"].split(className).join("");
};

function onTransitionEnd( module )
{
	var view = module.getDomElement();
	
	var onTransitionHandler = function(event)
	{
		// Wird Sichtbar
		if(event.target.className.indexOf("middle") != -1)
		{
			module.showContent();
		}
		else
		{
			module.hideContent();
		}
	};
	
	view.addEventListener("transitionend", onTransitionHandler, false);
	view.addEventListener("webkitTransitionEnd",onTransitionHandler, false);
	view.addEventListener("mozTransitionEnd", onTransitionHandler, false);
	view.addEventListener("msTransitionEnd", onTransitionHandler, false);
	view.addEventListener("oTransitionEnd", onTransitionHandler, false);
};
