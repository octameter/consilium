function Symptom()
{
	this.x = 1;
}

Symptom.prototype = new View();

Symptom.prototype.report2 = function()
{
	alert("Yipii OOP "+this.x+" "+this.y);
};