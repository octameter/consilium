var Notification = {
		
		show:function ()
		{
			function alertDismissed() 
			{
				console.log("dismissed");
			}
   	
			navigator.notification.alert(
    		    'You are the winner!',  // message
    		    alertDismissed,         // callback
    		    'Game Over',            // title
    		    'Done'                  // buttonName
			);
		}
};
    	
    	