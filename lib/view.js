function View()
{
	this.app = null;
	
	this.view = null;
	
	this.header = null;
	
	this.content = null;
	
	this.footer = null;
}

View.prototype.setApp = function( elementId )
{
	this.app = document.getElementById(elementId);	
};

/**
 * VIEW
 * @param seite: middle left right
 */
View.prototype.buildView = function( swipe )
{
	var view = document.createElement("div");
	view.setAttribute("class","view "+ swipe);
	this.app.appendChild( view );
	
	view.addEventListener("transitionend", this.onTransitionEnd.bind(this), false);
	view.addEventListener("webkitTransitionEnd", this.onTransitionEnd.bind(this), false);
	view.addEventListener("mozTransitionEnd", this.onTransitionEnd.bind(this), false);
	view.addEventListener("msTransitionEnd", this.onTransitionEnd.bind(this), false);
	view.addEventListener("okitTransitionEnd", this.onTransitionEnd.bind(this), false);

	this.view = view;
};

View.prototype.showView = function()
{	
	this.view.className = this.view.className.replace("left", "middle");
	this.view.className = this.view.className.replace("right", "middle");
};

View.prototype.hideView = function( swipe )
{
	this.view.className = this.view.className.replace("middle", swipe); 
};

View.prototype.onTransitionEnd = function(event)
{
	// Wird Sichtbar
	if(event.target.className.indexOf("middle") > 0)
	{
		this.content.style["visibility"] = "visible";
	}
	else
	{
		this.content.style["visibility"] = "hidden";
	}
};


/**
 * Header
 * @param title
 */
View.prototype.buildHeader = function( title )
{
	var header = document.createElement("header");

		var h2 = document.createElement("h2");
		h2.style["margin"] = "0px";
		h2.innerHTML = title;
	
	header.appendChild(h2);	

	this.view.appendChild(header);
	
	this.header = header;
};

View.prototype.removeView = function( back )
{
	var header = this.header;
	
		var left = document.createElement("button");
		left.setAttribute("id", "goHome");
		left.setAttribute("class", "back");
		left.style["position"] = "absolute";
		left.style["left"] = "0px";
		left.style["top"] = "0px";
		left.innerHTML = "Back";
		
		left.addEventListener("click", function(event)
		{
			this.hideView("right"); 

			back.showView();
		}
		.bind(this), false);
	
	header.appendChild(left);
};

/**
 * Content
 * @param show
 */
View.prototype.buildContent = function(show)
{
	var content = document.createElement("div");
	//content.setAttribute("class", "content");
	content.style["visibility"] = (show) ? "visible" : "hidden";
	
	this.view.appendChild(content);	
	
	this.content = content;
};
View.prototype.hideContent = function()
{
	
};
View.prototype.showContent = function()
{
	
};

/**
 * Footer
 * 
 */
View.prototype.buildFooter = function()
{
	
};


