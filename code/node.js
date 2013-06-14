function Node( server )
{
	this.server = server;	
}

Node.prototype.authorize = function( token, success, error )
{
	this.query( "GET", "/authorize?requestToken=" + token, null, success, error);
};

Node.prototype.listActsForAntagonistId = function( antagonistId, since, success, error)
{
	var uri = "/acts/antagonistId/" + antagonistId;
	
	uri += ( since ) ? "?since="+since : "";
	
	this.query( "GET", uri, null, success, error);
};

Node.prototype.createAct = function( act, success, error )
{
	var uri = "/acts";
	
	this.query( "POST", uri, act, success, error);
};

Node.prototype.query = function( method, uri, data, success, error)
{
    var request = new XMLHttpRequest();
    
    request.open( method, this.server + uri, true);
    
    request.setRequestHeader("Content-Type", "application/json");
    
	request.onreadystatechange = function()
	{		
		if( request.readyState == 4)
		{									
			if( request.status == 200 && request.responseText) success( JSON.parse( request.responseText ) );

			else error(  "Fehler bei der Abfrage..." ); 
		}
	};
    
    request.send( JSON.stringify( data ) );
 };




