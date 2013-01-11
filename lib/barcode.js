var Barcode = {
		scan : function()
		{
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
		}
};