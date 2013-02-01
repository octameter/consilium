var Util = {
		
		truncate : function( text )
		{
			
			if(text.length > 20)
			text = text.substring(0,18) + "..";
			
			return text;
		},
		icon : function( type, size )
		{
			var image = document.createElement("img");
			image.src = "img/icon/"+type+".png";
			image.style["opacity"] = "0.8";
			image.width = size;
			image.height = size;
			return image;
		}
};

