(function(window,  document, undefined){
				
	var selector = function(id){
		
		var element = document.getElementById(id);
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

Controller.prototype.commands = {};

Controller.prototype.addCommand = function( nameCommand, callback )
{
	var command = new Command(callback);
	
	this.commands[nameCommand] = command;    		
};

Controller.prototype.dispatchCommand = function(eventName, data)
{
	(this.commands[eventName]) ?  this.commands[eventName].execute(data) : console.log("Command "+eventName+" not registered");	
};

function Command( callback )
{
	this.callback = callback;
	
	this.model = new Model();
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
	DOM( data.toId ).attrib("className").replace(/(top|left|right)/, "middle");	
	DOM( data.hideId ).hide();
	DOM( data.fromId ).attrib("className").replace("middle", data.direction );	
};
function showContentCommand( data )
{
	DOM( data.id ).show();
};

function initHomeCommand( data )
{	
	if( this.model.data.punkte.length > 0 )
	{		
		dispatchCommand("refreshChart", { id: "chart"} );
		
		DOM( data.intro ).hide();
		DOM( data.verlauf ).show();
	}
	else
	{
		DOM( data.intro).show();
		DOM( data.verlauf ).hide();
	}
	
	DOM( data.id ).show();
};
function initOptionenCommand( data )
{
	DOM( data.id ).show();
};
function initSymptomeCommand( data )
{
	DOM( data.id ).show();
};
function initEingabeCommand( data )
{
	DOM( data.id ).show();
};

function refreshChartCommand( data )
{
	this.model.sortPunkteByTime("10025482");
	
	DOM("chartSVG").verlauf();
};

function scanCommand( data )
{	
        try {
            window.plugins.barcodeScanner.scan(function(args) 
            {
                console.log("Scanner result text: " + args.text + "format: " + args.format + "cancelled: " + args.cancelled + "\n");
                /*
                if (args.format == "QR_CODE") {
                    window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
                }
                */
                alert(args);
            });
        } catch (ex) {
            console.log(ex.message);
        }
};

