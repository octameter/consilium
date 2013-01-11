/*
 * https://build.phonegap.com/blog/barcodescanner-plugin
*/
var app = {
	// Application Constructor
    initialize: function() {
        this.bind();
    },
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bind: function() {
        document.addEventListener("deviceready", this.onDeviceready, false);
        document.addEventListener("offline", this.onOffline, false);
        document.addEventListener("online", this.onOnline, false);
        
        document.getElementById("scan").addEventListener("click", this.scan, false);
        document.getElementById("popup").addEventListener("click", this.nachricht, false);
        document.getElementById("goSymptome").addEventListener("click", this.addView, false);
        document.getElementById("returned").addEventListener("click", this.removeView, false);
        

        
    },
    onDeviceready: function() 
    {
        app.report('deviceready');
        
        document.getElementById("test").appendChild(  Assets.busy() );
    },
    onOffline: function() {
    	app.report('offline');
    },
    onOnline: function() {
    	app.report('online');
    },
    onEnd: function(event) {
    	
    	if(event.target.className.indexOf("middle") > 0 )
    	{
    		app.report('anfang');    		
    	}
    	else
    	{
    		app.report('ende');    		    		
    	}
    },
    report: function(id) 
    {	
        console.log("Report: " + id);
    },



};
