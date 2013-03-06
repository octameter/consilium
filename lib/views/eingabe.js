function Eingabe( elementId ) 
{
	this.elementId = elementId;
	
	this.model = new Model();
	
	hideContent( "eingabeContentId" );	
	
	onTransitionEnd(this);
}

Eingabe.prototype.getDomElement = function()
{
	return document.getElementById( this.elementId );
};

Eingabe.prototype.showContent = function()
{
	document.getElementById("datum").value = getInputDate();
    
	showContent( "eingabeContentId" );		
};

Eingabe.prototype.hideContent = function()
{
	hideContent( "eingabeContentId" );	
};


