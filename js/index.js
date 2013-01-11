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
        document.getElementById("swiper").addEventListener("click", this.addView, false);
        document.getElementById("returned").addEventListener("click", this.removeView, false);
    },
    onDeviceready: function() 
    {
        app.report('deviceready');
    },
    onOffline: function() {
    	app.report('offline');
    },
    onOnline: function() {
    	app.report('online');
    },
    report: function(id) 
    {	
        console.log("Report: " + id);
    },
    addView: function() 
    {    
        var old = document.querySelector('#consilium');
        old.className = old.className.replace('middle','left'); 
        
        var current = document.querySelector('#symptome');        
        current.className = current.className.replace('right','middle'); 
    },
    removeView: function() 
    {    
        var old = document.querySelector('#symptome');
        old.className = old.className.replace('middle','right'); 
        
        var current = document.querySelector('#consilium');        
        current.className = current.className.replace("left","middle");
    },
    scan: function() {

        console.log('scanning');
        try {
            window.plugins.barcodeScanner.scan(function(args) {
                console.log("Scanner result: \n" +
                    "text: " + args.text + "\n" +
                    "format: " + args.format + "\n" +
                    "cancelled: " + args.cancelled + "\n");
                /*
                if (args.format == "QR_CODE") {
                    window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
                }
                */
                document.getElementById("info").innerHTML = args.text;
                console.log(args);
            });
        } catch (ex) {
        	alert(ex.message);
            console.log(ex.message);
        }
    },
    nachricht: function() {
    	
    	function alertDismissed() {
    	    app.report("dismissed");
    	}
   	
    	navigator.notification.alert(
    		    'You are the winner!',  // message
    		    alertDismissed,         // callback
    		    'Game Over',            // title
    		    'Done'                  // buttonName
    		);

    }

};
