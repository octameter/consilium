function Model() {}

Model.prototype.start = 500;

Model.prototype.end = 2000;

Model.prototype.punkte = [];

Model.prototype.addPunkt = function( punkt )
{
	this.punkte.push( punkt );
};

Model.prototype.getDauer = function()
{
	return parseFloat( this.end - this.start );
};
