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
	var button = document.createElement("button");
	button.setAttribute("id", "goSymptome");
	button.innerHTML = "Symptome eingeben";
	button.addEventListener("click", function(event)
	{
		this.hideView("left"); 
		
		next.showView();
	}
	.bind(this), false);
	
	this.content.appendChild( button );

};