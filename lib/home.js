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
	var box = document.createElement("div");
	box.setAttribute("class","content");
	this.content.appendChild( box );

	
	var wie = document.createElement("p");
	wie.innerHTML = "Wie fühle ich mich heute?";
	this.content.appendChild( wie );

	var form = document.createElement("form");
	form.style["width","100%"];
	
	var range = document.createElement("input");
	form.appendChild(range);
	range.setAttribute("type","range");
	this.content.appendChild( form );
	
	var button = document.createElement("button");
	button.setAttribute("id", "goSymptome");
//	button.style["position"] =  "relative";
//	button.style["margin-top"] =  "10%";
//	button.style["left"] =  "50%";
//	button.style["margin-left"] = "-100px";
	button.innerHTML = "Symptome eingeben";
	button.addEventListener("click", function(event)
	{
		this.hideView("left"); 
		
		next.showView();
	}
	.bind(this), false);
	
	this.content.innerHTML += "<hr>";
	
	this.content.appendChild( button );

};