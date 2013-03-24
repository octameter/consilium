

(function(window,  document, undefined){
				
	var plugins = {};
	
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
					var event = data || {}; 
					
					if("ontouchstart" in window )
					{
						element.addEventListener("touchstart", function(e)
						{
							//e.preventDefault();
							event.touches = e.touches[0];
							event.tag = e.target.tagName;
							dispatchCommand(commandName, event);
						}
						, false);		
					}
					else
					{
						element.addEventListener("mousedown", function(e)
						{
							//e.preventDefault();
							event.offsetX = e.offsetX || e.layerX;
							event.offsetY = e.offsetY || e.layerY;
							event.tag = e.target.tagName;
							dispatchCommand(commandName, event);
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
					element.addEventListener( "keyup", function(event)
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
					}
                    , false);
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
				onTap: function(commandName, data)
				{
					var event = data || {};
					
					if("ontouchstart" in window )
					{
						element.addEventListener("touchstart", function(e)
						{						
							event.type = "start";
					        event.startX = e.touches[0].clientX;
					        event.startY = e.touches[0].clientY;
					        
					        var element = e.touches[0].target;

					        var property = data.watch.split(":"); 
					        
					        if(element[property[0]] !== property[1] ) 
					        { 
					            element = element.parentNode;
					            
						        if(element[property[0]] !== property[1] ) element = element.parentNode;
					        }
					        
					        if(element[property[0]] === property[1] ) event.element = element;
	
					        dispatchCommand(commandName, event);
						});
				    }else
				    {
						element.addEventListener("mousedown", function(e)
						{
							event.type = "start";
							event.offsetX = e.offsetX || e.layerX;
							event.offsetY = e.offsetY || e.layerY;
					        event.startX = e.clientX;
					        event.startY = e.clientY;

					        var element = e.target;

					        var property = data.watch.split(":"); 
					        
					        if(element[property[0]] !== property[1] ) 
					        { 
					            element = element.parentNode;
					            
						        if(element[property[0]] !== property[1] ) element = element.parentNode;
					        }
					        
					        if(element[property[0]] === property[1] ) event.element = element;
							
							dispatchCommand(commandName, event);
						});
				    }
				    
					if("ontouchmove" in window)
					{
						element.addEventListener("touchmove", function(e)
						{
					    	event.type = "move";
					    	event.clientX = e.touches[0].clientX;
					    	event.clientY = e.touches[0].clientY;
					    	
					        dispatchCommand(commandName, event);
						});
					}
					else
					{
						element.addEventListener("mousemove", function(e)
						{
					    	event.type = "move";
					    	event.clientX = e.clientX;
					    	event.clientY = e.clientY;
					    	
					        dispatchCommand(commandName, event);
						});
					}

					if("ontouchend" in window)
					{
						element.addEventListener("touchend", function(e)
						{
					        e.preventDefault();

					        event.type = "end";

					        dispatchCommand(commandName, event);
						});
					}
					else
					{
						element.addEventListener("mouseup", function(e)
						{
					        e.preventDefault();

					        event.type = "end";

					        dispatchCommand(commandName, event);
						});
					}


				},
				html: function( value )
				{
					element.innerHTML = value;
				},
				text: function( value )
				{
					element.innerHTML = "";
					element.appendChild( document.createTextNode( value ) ); 
					
					return DOM( element );
				},
				createChild: function( tag )
				{						
					return document.createElement(tag);
				},
				addOptions: function( min, max, value, array)
				{
					var options = document.createDocumentFragment();
					
					if(!array)
					{
						for( var i = min; i <= max; i++)
						{
							var option = document.createElement("option");
							option.textContent = (i < 10) ? "0"+i : i;
							option.value = i;
							if( value == i) option.selected = "selected";
							options.appendChild( option );
						}						
					}
					
					element.appendChild( options );
					
					return( DOM(element) );
				},
				appendChild: function(tag, attributes, text)
				{
					    var childTag = (typeof tag === "string") ? this.createChild( tag ) : tag;
					    
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
                addChild: function(tag, attributes, text)
				{
					    var childTag = (typeof tag === "string") ? this.createChild( tag ): tag;
					    
					    for (var attribute in attributes) 
					    {
					    	childTag.setAttribute( attribute, attributes[attribute] );
					    }
					    
					    if(text)
					    {
					    	if(tag == "textarea")
					    	{
					    		childTag.value = text;   					    							    		
					    	}
					    	else
					    	{
					    		childTag.innerHTML = text;   					    		
					    	}
					    }
					    
					    element.appendChild( childTag );
					    
					    return DOM( childTag );
				},
				attrib: function( attribute )
				{					
					function _replace( oldValue, newValue )
					{
						element[attribute] = element[attribute].replace( oldValue, newValue);						
					};
					
					function _add( value )
					{
						element[attribute] += " " + value;						
					};
					
					function _remove( value )
					{
						element[attribute] = element[attribute].split( value ).join("");
					};
					
					return { replace:_replace, add:_add, remove:_remove };
				},
				translate: function( data )
				{
					function iterate( node )
					{
						for(var i = 0; i < node.childNodes.length; i++)
						{
							var childNode = node.childNodes[i];						
							
							if( childNode.tagName == "LI")
							{
								console.log("TODO LISTE");
							}
							
							if( childNode.tagName == "P")
							{
								var key = childNode.innerHTML.trim();
								
								if(data[key]) childNode.innerHTML = data[key];
							}
							
							if( childNode.childNodes.length > 0 )
							{
								iterate(childNode);								
							}

						}
					}
					
					iterate( element );
					//while( element.hasChildNodes() )
					//{
						//console.log( element.nodeValue() );
					//}
					return element;
	
				},
				width: function()
				{
					return parseInt( element.clientWidth );
				},
				style: function( property, value)
				{
					element.style[property] = value;
				},
				show: function()
				{
					element.style["display"] = "block";
                    
                    return DOM( element );
				},
				hide: function()
				{
					element.style["display"] = "none";
                    
                    return DOM( element );
				},
				removeElements: function()
				{						
					while(element.hasChildNodes())
					{
						element.removeChild(element.lastChild);
					}
                    
                    return DOM( element );
				},
				plugins: function( type )
				{
					switch( type )
					{
						case("svg"): 
						{
							function create()
							{
								plugins.svg = new Svg();
								plugins.svg.setModel( new Model() );
								element.appendChild( plugins.svg.exportTag() );
							}
							
							function refresh()
							{
								plugins.svg.removeElements();
								plugins.svg.drawCoordinates();
								plugins.svg.drawPunkte();
							}
							
							return { create: create, refresh:refresh };
						};
						case("agent"):
						{
							// LAZY LOADING
							if(!plugins.agent) plugins.agent = new Agent();
							
							function isDevice( device )
							{
								return plugins.agent.isDevice( device );
							}
							
							// Mobile, Tablet, Desktop
							return { isDevice: isDevice };
						};
					}

				},
                element: function()
                {
                    return element;
                }
                
		};
		
		return modules;
	};
	
	window.DOM = selector;
	
	window.DO = selector();
	
})(this, document, undefined);


/**
 * FRONT CONTROLLER
 */
function Controller() {};

Controller.prototype.commands = {};

Controller.prototype.addCommand = function( nameCommand, callback, custom )
{
	if(!this.commands[nameCommand])
	{
		var command = new Command(callback, custom);
		
		this.commands[nameCommand] = command;    				
	}
};

Controller.prototype.removeCommand = function( nameCommand, callback )
{
	delete this.commands[nameCommand];    		
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
	this.callback( data || {} );
};

var controller = new Controller();

/**
 * UTILITY FUNCTION
 */
function dispatchCommand(nameEvent, data)
{
	controller.dispatchCommand(nameEvent, data);
};
function removeCommand(nameEvent, data)
{
	controller.removeCommand(nameEvent, data);
};

function addCommand(nameEvent, command, properties)
{
	controller.addCommand(nameEvent, command, properties);

};

function zeit( pattern, milliSekunden  )
{
		var currentDate = (milliSekunden) ? new Date( milliSekunden ) : new Date();

		var milli = currentDate.getMilliseconds() < 10 ? "0"+currentDate.getMilliseconds() : currentDate.getMilliseconds();
		var sekunde = currentDate.getSeconds() < 10 ? "0"+currentDate.getSeconds() : currentDate.getSeconds();
		var minute = currentDate.getMinutes() < 10 ? "0"+currentDate.getMinutes() : currentDate.getMinutes();
		var stunde = currentDate.getHours() < 10 ? "0"+currentDate.getHours() : currentDate.getHours();
		
		var day = currentDate.getDate() < 10 ? "0"+currentDate.getDate() : currentDate.getDate();
		var month = currentDate.getMonth() < 9 ? "0"+(currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
		var year = currentDate.getFullYear();
			
		switch( pattern )
		{
			case("yyyy-MM-ddThh:mm.ss.ms"): return year + "-" + month+ "-"+day+"T"+stunde+":"+minute+":"+sekunde+"."+milli;
			case("yyyy-MM-dd"): return year + "-" + month+ "-"+day;
			case("dd.mm.yyyy hh:mm"): return day + "." + month+ "."+year+" "+stunde+":"+minute;
			case("dd.mm.yyyy"): return day + "." + month+ "."+year;
			case("hh:mm"): return +stunde+":"+minute;
			case("dd"): return day;
			case("ddInMonth"): return new Date(year, month, 0).getDate();
			case("MM"): return month;
			case("yyyy"): return year;
			case("hh"): return stunde;
			case("mm"): return minute;
			case("dawn"):
			{
				currentDate.setHours(0,0,0,0); return currentDate.getTime(); 
			}
			default: return currentDate.getTime();
		};
};

/** 
* EXTEND STANDARD ELEMENTS
**/
Array.prototype.sortABC = function( property )
{
    this.sort( function( a,b) 
	{
		var links = a[property].replace(/Ö/, "Oe").replace(/Ä/, "Ae").replace(/Ü/,"Ue");
		var rechts = b[property].replace(/Ö/, "Oe").replace(/Ä/, "Ae").replace(/Ü/,"Ue");
		
		if( links < rechts) return -1;
		if( links > rechts) return 1;
		return 0;
	});
};

Array.prototype.sort123 = function( key )
{
    this.sort( function( a,b)
    {
        return ( b[key] - a[key] );
    });
};

Array.prototype.notIn = function( key, array )
{
    return this.filter( function(element) 
    {
        var flag = true;
        
        for(var i = 0; i < array.length; i++)
        {
            if( element[key] == array[i][key]) flag = false;
        }
        
        return flag;
    });
};

Array.prototype.getId = function( key )
{	
	for(var i = 0; i < this.length; i++)
	{
		if( this[i]["id"] == key) return this[i];
	}
	
	return null;
};

Array.prototype.changeItem = function( key, property, value )
{
	var done = false;
	
    for(var i = 0; i < this.length; i++)
    {
        if( this[i]["id"] == key)
        {
        	this[i][property] = value ; done = true;
        }
    }
    
    return done;
};

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
