var Util = {
		
		truncate : function( text )
		{
			
			if(text.length > 20)
			text = text.substring(0,18) + "..";
			
			return text;
		}
};

