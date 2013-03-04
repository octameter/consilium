function Optionen( elementId ) 
{
	this.elementId = elementId;
	
	this.model = new Model();
	
	hideContent( "optionenContentId" );
	
	onTransitionEnd(this);
}

Optionen.prototype.getDomElement = function()
{
	return document.getElementById( this.elementId );
};

Optionen.prototype.showContent = function()
{
	if(this.model.hasArzt())
	{
		
	}
	else
	{
		showContent( "connectId" );
	}
	
	showContent( "optionenContentId" );	
};


Optionen.prototype.hideContent = function()
{
	hideContent( "optionenContentId" );
};

Optionen.prototype.scan = function()
{
	
        try {
            window.plugins.barcodeScanner.scan(function(args) 
            {
                console.log("Scanner result: \n" +
                    "text: " + args.text + "\n" +
                    "format: " + args.format + "\n" +
                    "cancelled: " + args.cancelled + "\n");
                /*
                if (args.format == "QR_CODE") {
                    window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
                }
                */

                alert(args);
            });
        } catch (ex) {
            console.log(ex.message);
        }
};