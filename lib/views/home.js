function Home() 
{

}

Home.prototype = new View();

// Define View
Home.prototype.init = function()
{
	this.buildView("middle"); 
	
	this.buildHeader("Consilium");		
	
	this.buildContent(true);
};


// Customize
Home.prototype.addSymptome = function(next)
{
	var chart = new Chart();
	chart.setViewPart( this.content );
	chart.draw();
	
	var wie = document.createElement("p");
	wie.innerHTML = "<br/>Wie fühle ich mich heutee?";
	this.content.appendChild( wie );	
	
	this.content.innerHTML += "<hr>";

	var self = this;	
	
	var buttonSymptome = new Button();
	buttonSymptome.setLabel("Symptome eingeben");
	buttonSymptome.setBlue();
	buttonSymptome.onTouch(function(event)
	{
		self.hideView("left"); 	
		next.showView();
	});
	buttonSymptome.setContainer(this.content);
	
};
