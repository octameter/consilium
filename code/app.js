function App() {
// 
  // commandName:command
  this.commands = {};
  
  this.views = {};
}
/** 
 * FRONTCONTROLLER PATTERN
 */
// TODO LOGGING console.log(app.domain, "->", this.callback.name, "<- properties:", this.properties, "data:", data); 
//
App.prototype.addView = function( view ) {
  this.views = view.init();
};

App.prototype.addCommands = function( commands ) {
 
  for( commandName in commands ){
  // ITERATE
    if( commands.hasOwnProperty( commandName ) ) {
       this.addCommand( commands[commandName].func, commands[commandName].prop)
    }
  }
}

App.prototype.addCommand = function( command, properties ) {
//  
  function Command(callback, properties)
  {
    this.callback = callback;
    this.properties = properties;
    
    this.execute = function(data)
    {
      this.callback(data || {});
    };
    
    return this;
  }
  
  this.commands[command.name] = new Command( command, properties );
}

App.prototype.dispatch = function( command, data )
{
  console.log( this.commands, command );
  this.commands[ command.func.name ].execute(data);
}
