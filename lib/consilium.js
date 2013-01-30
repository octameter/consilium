function Consilium() 
{
	/**
	 * MODULES
	 */
	
	/**
	 * VIEWS
	 */
	this.home = new Home();
	
	this.symptome = new Symptome();
} 

	/**
	 * GLOBAL VARIABLES
	 */

	/**
	 * Set Module & Views
	 */	
	Consilium.prototype.setApp = function(elementId)
	{	
		this.home.setApp( elementId );	
		
		this.symptome.setApp( elementId );		
	};
	
	Consilium.prototype.init = function()
	{	
		this.home.init();
		
		this.symptome.init();
	};
	
	Consilium.prototype.show = function()
	{	
		this.home.addNextView( this.symptome );
		
		this.home.addNext12();
		
		this.symptome.setReturnView( this.home );
	};

	/**
	 * Modul Symptome
	 */
	
	/**
	 * VIEW HOME
	 */
	Consilium.prototype.texto = function(){
		
	};
	
	
	

	

	