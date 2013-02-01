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
	
	this.optionen = new Optionen();
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
		
		this.optionen.setApp( elementId );
	};
	
	Consilium.prototype.init = function()
	{	
		this.home.init();
		
		this.symptome.init();
		
		this.optionen.init();
	};
	
	Consilium.prototype.show = function()
	{	
		this.home.addViewSymptome( this.symptome );
		this.symptome.setReturnView( this.home );

		this.home.addViewOptionen( this.optionen );
		this.optionen.setReturnView( this.home );
	};

	/**
	 * Modul Symptome
	 */
	
	/**
	 * VIEW HOME
	 */
	Consilium.prototype.texto = function(){
		
	};
	
	
	

	

	