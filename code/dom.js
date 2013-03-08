

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
		
		console.log("Element with ID "+id);
		// Konstruktor-Funktion
		var modules = {
				
				onTouch: function(commandName, data)
				{	
					if("ontouchstart" in window)
					{
						element.addEventListener("touchstart", function(event)
						{
							event.preventDefault();
							dispatchCommand(commandName, data);
						}
						, false);		
					}
					else
					{
						element.addEventListener("click", function(event)
						{
							event.preventDefault();
							dispatchCommand(commandName, data);
						}
						, false);			
					}	
				},
				onStage: function(commandName, data)
				{				
					var onTransitionHandler = function(event)
					{
						if(event.target.className.indexOf("middle") > -1)
						{
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
				appendChild: function(tag, attributes, text)
				{
					    var childTag = (typeof tag === "string") ? document.createElement(tag) : tag;
					    
					    for (var attribute in attributes) 
					    {
					    	childTag.setAttribute( attribute, attributes[attribute] );
					    }
					    
					    if(text)
					    {
					    	childTag.innerHTML = text;   
					    }
					    
					    element.appendChild( childTag );
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
 * PATTERN
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

function Command( callback, custom )
{
	this.callback = callback;
	
	this.model = new Model();
	
	this.custom = custom;
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
};

function addCommand(nameEvent, command, custom)
{
	controller.addCommand(nameEvent, command, custom);
};
