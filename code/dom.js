

(function(window,  document, undefined){
				
	var selector = function(id){
		
		var element = null;
		
		if(typeof id === "string") 
		{
			element = document.getElementById(id);
		}		
		else if(typeof id === "object")
		{
			element = id;
		}
		
		//console.log("Element with ID "+id);
		
		// Konstruktor-Funktion
		var modules = {
				
				onTouch: function(commandName, data)
				{				
					var daten = data || {}; 
					
					if("ontouchstart" in window )
					{
						element.addEventListener("touchstart", function(event)
						{
							event.preventDefault();
							daten.event = event.touches[0];
							dispatchCommand(commandName, daten);
						}
						, false);		
					}
					else
					{
						element.addEventListener("mousedown", function(event)
						{
							event.preventDefault();
							dispatchCommand(commandName, daten);
						}
						, false);			
					}	
				},
				onTouchMove: function(commandName, data)
				{
					if("ontouchmove" in window)
					{	
						element.addEventListener( "touchmove", function(event)
						{
							event.preventDefault();
							event = event.touches[0];
							dispatchCommand(commandName, data);
						}
						, false);		
					}
					else
					{
						element.addEventListener( "mousemove", function(event)
						{
							event.preventDefault();
							dispatchCommand(commandName, data);
						}
						, false);
					}
				},
				onTouchEnd: function(commandName, data)
				{				
					if("ontouchend" in window)
					{	
						element.addEventListener( "touchend", function(event)
						{
							event = event.changedTouches[0];
							dispatchCommand(commandName, data);
						}
						, false);		
					}
					else
					{
						element.addEventListener( "mouseup", function(event)
						{
							data.event = event;
							dispatchCommand(commandName, data);
						}
						, false);
					}
				},
				onTouchOut: function(commandName, data)
				{				
					if("ontouchleave" in window)
					{	
						element.addEventListener( "touchleave", function(event)
						{
							data.event = event.changedTouches[0];
							dispatchCommand(commandName, data);
						}
						, false);		
					}
					else
					{
						element.addEventListener( "mouseout", function(event)
						{
							data.event = event;
							dispatchCommand(commandName, data);
						}
						, false);
					}
				},
				onChange: function(commandName, data)
				{
					
					element.addEventListener( "change", function(event)
					{
						data["value"] = event.target.value;
						data["target"] = event.target;
						dispatchCommand(commandName, data);
					}
					, false);
				},
				onDOM: function(commandName, data)
				{
					document.addEventListener("DOMContentLoaded", function(event)
					{
						event.preventDefault();
						dispatchCommand( commandName, data);
					}, false);
				},
				onDevice: function(commandName, data)
				{
		   			document.addEventListener("deviceready", function(event)
		   		   	{
		   				event.preventDefault();
		   				dispatchCommand( commandName, data);
		   		   	}
		   		   	, false);
				},
				onResume: function(commandName, data)
				{
		   			document.addEventListener("resume", function(event)
		   		   	{
		   				event.preventDefault();
		   				dispatchCommand( commandName, data);
		   		   	}
		   		   	, false);
				},
				onStage: function(commandName, data)
				{				
					var onTransitionHandler = function(event)
					{
						if(event.target.className.indexOf("middle") > -1)
						{
							event.preventDefault();
							dispatchCommand(commandName, data);														
						}
					};
					
					element.addEventListener("webkitTransitionEnd",onTransitionHandler, false);
					element.addEventListener("mozTransitionEnd", onTransitionHandler, false);
					element.addEventListener("msTransitionEnd", onTransitionHandler, false);
					element.addEventListener("oTransitionEnd", onTransitionHandler, false);
					element.addEventListener("transitionend", onTransitionHandler, false);
				},
				text: function( value )
				{
					element.innerHTML = value; 
				},
				createChild: function( tag )
				{
					if(tag == "slider")
					{
						var temp = document.createElement("input");
						temp.type = "range";
						return temp;	
					}
						
					return document.createElement(tag);
				},
				appendChild: function(tag, attributes, text)
				{
					    var childTag = (typeof tag === "string") ? this.createChild( tag ): tag;
					    
					    for (var attribute in attributes) 
					    {
					    	childTag.setAttribute( attribute, attributes[attribute] );
					    }
					    
					    if(text)
					    {
					    	childTag.innerHTML = text;   
					    }
					    
					    element.appendChild( childTag );
					    
					    return childTag;
				},
				attrib: function( attribute )
				{					
					function replace( oldValue, newValue )
					{
						element[attribute] = element[attribute].replace( oldValue, newValue);						
					};
					
					function add( value )
					{
						element[attribute] += " " + value;						
					};
					
					function remove( value )
					{
						element[attribute] = element[attribute].split( value ).join("");
					};
					
					return { replace:replace, add:add, remove:remove };
				},
				show: function()
				{
					element.style["display"] = "block";
				},
				hide: function()
				{
					element.style["display"] = "none";
				},
				removeElements: function()
				{						
					while(element.hasChildNodes())
					{
						element.removeChild(element.lastChild);
					}
				},
				verlauf: function()
				{
					this.removeElements();
					
					var svg = new Svg( id );
					svg.drawCoordinates();
					svg.drawPunkte(id);
					return svg;
				}
		};

		
		return modules;
	};
	
	window.DOM = selector;
	
})(this, document, undefined);


/**
 * FRONT CONTROLLER
 */
function Controller() {};

Controller.prototype.commands = {};

Controller.prototype.addCommand = function( nameCommand, callback, custom )
{
	var command = new Command(callback, custom);
	
	this.commands[nameCommand] = command;    		
};

Controller.prototype.dispatchCommand = function(eventName, data)
{
	(this.commands[eventName]) ?  this.commands[eventName].execute(data) : console.log("Command "+eventName+" not registered");	
};

function Command( callback, properties )
{
	this.callback = callback;
	
	this.model = new Model();
	
	this.properties = properties;
}

Command.prototype.execute = function(data)
{	
	this.callback( data );
};

/**
 * UTILITY FUNCTION
 */
var controller = new Controller();

function dispatchCommand(nameEvent, data)
{
	controller.dispatchCommand(nameEvent, data);
};

function addCommand(nameEvent, command, properties)
{
	controller.addCommand(nameEvent, command, properties);
};
