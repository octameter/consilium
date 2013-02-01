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
	
	this.model = new Model();
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
		
		this.home.addViewSymptome( this.symptome );
		this.symptome.setReturnView( this.home );

		this.home.addViewOptionen( this.optionen );
		this.optionen.setReturnView( this.home );
	};
	
	Consilium.prototype.show = function()
	{	
		this.home.showView();
		
		this.speedUp();
	};

	// Timer oder Resume
	Consilium.prototype.refresh = function()
	{
		this.home.showViewExt();
	};
	
	/**
	 * TESTING MIT TIME ACCELARATOR
	 */
	Consilium.prototype.speedUp = function()
	{
		var that = this;
		
		setInterval(function() 
		{ 
			if(!ChartPoint.selectedElement) {
				
				that.model.atomuhr.addStunden += 12; 
				that.refresh(); 
			}
		
		}, 3000);
	};
	
	

	

	