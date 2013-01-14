function Symptome() {
	
	this.placeholder = null;
	
	this.view = null;
}

Symptome.prototype.init = function(elementId)
{	
	this.placeholder = document.getElementById(elementId);

	this.buildView();	
};

Symptome.prototype.buildView = function()
{	
	var view = document.createElement("div");
	view.addEventListener("transitionend", this.onTransitionEnd, false);
	view.addEventListener("webkitTransitionEnd", this.onTransitionEnd, false);
	view.addEventListener("mozTransitionEnd", this.onTransitionEnd, false);
	view.addEventListener("msTransitionEnd", this.onTransitionEnd, false);
	view.addEventListener("okitTransitionEnd", this.onTransitionEnd, false);
	view.setAttribute("class","view right");
	this.placeholder.appendChild( view );	

	// Globale Reference
	this.view = view;		

	this.buildBusy();
	
	this.buildHeader();
	
	this.buildContent();
};

Symptome.prototype.showView = function()
{
	this.showBusy();
	
	this.view.className = this.view.className.replace("right", "middle");
};

Symptome.prototype.buildBusy = function()
{	
	this.view.appendChild( Assets.busyDiv("busySymptome") );	
};

Symptome.prototype.showBusy = function()
{
	this.hideContent();
	
	document.getElementById("busySymptome").style["display"] = "block";
};

Symptome.prototype.hideBusy = function()
{
	document.getElementById("busySymptome").style["display"] = "none";
};


Symptome.prototype.buildHeader = function()
{
	var header = document.createElement("header");
	header.setAttribute("id","headerSymptome");

		var h1 = document.createElement("h1");
		h1.setAttribute("id","titleSymptome");
		h1.style["margin"] = "0px";
		h1.innerHTML = "Symptome";
	
	header.appendChild(h1);	
	
	this.view.appendChild( header );
};

Symptome.prototype.removeView = function( home )
{
	var header = document.getElementById("headerSymptome");
	
		var left = document.createElement("button");
		left.setAttribute("id", "goHome");
		left.style["position"] = "absolute";
		left.style["left"] = "0px";
		left.style["top"] = "0px";
		left.innerHTML = "Back";
		
		left.addEventListener("click", function(event)
		{
			this.view.className = this.view.className.replace("middle","right"); 

			home.showView();
		}
		.bind(this), false);
	
	header.appendChild(left);
};

Symptome.prototype.setHeader = function(title)
{
	document.getElementById("headerSymptome").innerHTML = title;
};

Symptome.prototype.buildContent = function()
{
	var body = document.createElement("div");
	body.setAttribute("id","contentSymptome");
	body.style["display"] = "none";
	this.view.appendChild(body);		
};

Symptome.prototype.showContent = function()
{
	this.hideBusy();
	
	document.getElementById("contentSymptome").style["display"] = "block";
};

Symptome.prototype.hideContent = function()
{
	document.getElementById("contentSymptome").style["display"] = "none";
};

Symptome.prototype.onTransitionEnd = function(event) 
{	
	if(event.target.className.indexOf("middle") > 0)
	{
		document.getElementById("contentSymptome").style["display"] = "block";
		
		document.getElementById("busySymptome").style["display"] = "none";
	}
	else
	{
		document.getElementById("contentSymptome").style["display"] = "none";
		
		document.getElementById("busySymptome").style["display"] = "none";
	}
	
	console.log(this);
	
}
.bind(this);



