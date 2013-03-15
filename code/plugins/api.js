function Api()
{
		/* APPLIKATIONSERVER */
		this.server = null;
};

Api.prototype.saveToken = function(data, success, error) 
{	
	var uri = this.server + "/play";

	var request = this.createRequest();
	
	request.open("POST", uri, true);
	request.setRequestHeader("Content-Type", "application/json");
	request.onreadystatechange = function()
	{		
		Api.onComplete(request, success, error);
	};
	request.send( JSON.stringify( data ) );
};

Api.prototype.like = function(film, grouper, plattform)
{
	console.log("Like: " + film ); 
	
	var uri = this.server + "/play/like";
	
	var request = this.createRequest();			
	request.open("POST", uri, true);
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	//request.onreadystatechange = function() {};
	request.send( "film="+film+"&grouper="+grouper+"&plattform="+plattform );	
};

Api.prototype.getToken = function(token, success, error) 
{	
	console.log("Get Token: " + token);
		
	var uri = this.server + "/play";
	
	var request = this.createRequest();
	request.open("GET", uri + "?token="+token+"&domain="+window.parent.document.domain, true);		
	request.onreadystatechange = function()
	{
		Api.onComplete(request, success, error);
	};
	request.send();
};



/** 
 * Error
 * 601 Out of time
 * 602 Limit exceeded		
 * 401 You are not authorized 
 * **/
Api.onComplete = function(request, success, error)
{	
	if(request.readyState == 4)
	{							
		if( request.status == 200)
		{

			var result = null;
			
			try{
				// Content-Type application/json oder responseText = null
				result = JSON.parse( request.responseText || {} );				
			}catch(exception){
				// Content-Type plain/text
				result = request.responseText;
			}
			 
			success( result );
		}
		else
		{						
			error( request.status );
		}
	}
}; 

/**
 * XMLHttpRequest for different Browsers
 */
Api.prototype.createRequest = function()
{    
    //return (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    return new XMLHttpRequest();
};