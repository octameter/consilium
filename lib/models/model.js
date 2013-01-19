function Model() {}

Model.prototype.start = 0;

Model.prototype.end = 1500;

Model.prototype.punkte = [];

Model.prototype.addPunkt = function( punkt )
{
	this.punkte.push( punkt );
	
	this.end = Math.max( punkt.x, this.end);
	
	console.log("Add Model Max End", this.end);
};

Model.prototype.getDauer = function()
{
	return parseFloat( this.end - this.start );
};
