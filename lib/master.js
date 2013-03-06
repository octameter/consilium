
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

function createTag(tag, attributes, text)
{
    var element = document.createElement(tag);
    
    for (var attribute in attributes) 
    {
            element.setAttribute( attribute, attributes[attribute] );
    }
    
    if(text)
    {
        element.innerHTML = text;   
    }
    
    return element;
}

function dispatch(type, data)
{
    var event = new CustomEvent(type, { detail : data, bubbles: true, cancelable: false } );
    document.dispatchEvent(event);
}

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

function removeClass( elementId, className)
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

function getInputDate()
{      
	var currentDate = new Date();
	
	var day = currentDate.getDate() < 10 ? "0"+currentDate.getDate() : currentDate.getDate();
	var month = currentDate.getMonth() < 9 ? "0"+(currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
	var year = currentDate.getFullYear();
	
	return year + "-" + month+ "-"+day;
}

function getZeitpunkt( milliSekunden )
{      
	var currentDate = new Date( milliSekunden );
	
	var minute = currentDate.getMinutes() < 10 ? "0"+currentDate.getMinutes() : currentDate.getMinutes();
	var stunde = currentDate.getHours() < 10 ? "0"+currentDate.getHours() : currentDate.getHours();
	
	var day = currentDate.getDate() < 10 ? "0"+currentDate.getDate() : currentDate.getDate();
	var month = currentDate.getMonth() < 9 ? "0"+(currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
	var year = currentDate.getFullYear();
	
	return year + "-" + month+ "-"+day+" "+stunde+":"+minute;
}
/**
 * PATTERN
 */
function Controller() {};

Controller.prototype.commands = 
{		
};

Controller.prototype.addCommand = function( nameCommand, callback)
{
	var command = new Command(callback);
	
	this.commands[nameCommand] = command;    		
};

Controller.prototype.dispatchCommand = function(eventName, data)
{	
	this.commands[eventName].execute(data);
};

function Command( callback )
{
	this.callback = callback;
}

Command.prototype.execute = function(data)
{
	this.callback( data );
};

/**
 * MODEL VIEW CONTROLLER
 */
var controller = new Controller();

function dispatchCommand(nameEvent, data)
{
	controller.dispatchCommand(nameEvent, data);
}

function addCommand(nameEvent, command)
{
	controller.addCommand(nameEvent, command);
}

/**
 * COMMANDS
 * @param data
 */
function changeViewCommand( data )
{
	showView( data.target );
	hideView( data.source, data.direction );	
};

