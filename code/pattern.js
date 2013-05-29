
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

	if( app.debug ) console.log( app.context, this.commands[eventName].callback.name, data);
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