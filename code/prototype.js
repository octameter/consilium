
/** 
* EXTEND STANDARD ELEMENTS
**/
Array.prototype.sortABC = function( property )
{
    this.sort( function( a,b) 
	{
		var links = a[property].replace(/Ö/, "Oe").replace(/Ä/, "Ae").replace(/Ü/,"Ue");
		var rechts = b[property].replace(/Ö/, "Oe").replace(/Ä/, "Ae").replace(/Ü/,"Ue");
		
		if( links < rechts) return -1;
		if( links > rechts) return 1;
		return 0;
	});
};

Array.prototype.sort123 = function( key )
{
    this.sort( function( a,b)
    {
        return ( b[key] - a[key] );
    });
};

Array.prototype.notIn = function( key, array )
{
    return this.filter( function(element) 
    {
        var flag = true;
        
        for(var i = 0; i < array.length; i++)
        {
            if( element[key] == array[i][key]) flag = false;
        }
        
        return flag;
    });
};

Array.prototype.getId = function( key )
{	
	for(var i = 0; i < this.length; i++)
	{
		if( this[i]["id"] == key) return this[i];
	}
	
	return null;
};

Array.prototype.changeItem = function( key, property, value )
{
	var done = false;
	
    for(var i = 0; i < this.length; i++)
    {
        if( this[i]["id"] == key)
        {
        	this[i][property] = value ; done = true;
        }
    }
    
    return done;
};