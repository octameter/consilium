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
	Consilium.prototype.init = function(elementId)
	{	
		this.home.init(elementId);		
		
		this.symptome.init(elementId);
	};
	
	Consilium.prototype.addViewSymptome = function(){
		
		this.home.setViewSymptome( this.symptome );

		this.symptome.buildContent( this.home );
	};

	/**
	 * Modul Symptome
	 */
	
	/**
	 * VIEW HOME
	 */
	Consilium.prototype.texto = function(){
		
	};
	
	