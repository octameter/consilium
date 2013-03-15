/**
 * USER AGENT
 * 
 * Version: 1.0
 * Author: Marco Egbring
 */
function Agent() 
{
	// Mobile, Tablet, Desktop, Bot
	this.device = "Unknown";
	// Linux, Mac OS, Windows, RIM, iOS
	this.os = "Unknown";
	// Chrome, Safari, Firefox, Internet Explorer, Opera
	this.browser = "Unknown";
	this.version = 0;
	this.can = [];
	
	this.parse();
	
//	console.log("Agent: " + navigator.userAgent );	
//	console.log("Device: " + this.device );	
//	console.log("OS: " + this.os );
//	console.log("Browser: " + this.browser );	
//	console.log("Version: " + this.version );	
};

Agent.prototype.parse = function()
{
	/**
	 * DEVICE
	 */
	
	// iPhone: Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5
	// iPod: Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5
	if(/iPhone/i.test(navigator.userAgent))
	{
		this.device = "Mobile";
	}
	// iPad: Mozilla/5.0 (iPad; U; CPU OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5
	if(/iPad/i.test(navigator.userAgent))
	{
		this.device = "Tablet";
	}	
	 // Android: Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; Nexus One Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
	if(/Android/i.test(navigator.userAgent))
	{
		this.device = (/Android.*Mobile/i.test(navigator.userAgent)) ? "Mobile" : "Tablet";
	}
	 // Blackberry: Mozilla/5.0 (BlackBerry; U; BlackBerry AAAA; en-US) AppleWebKit/534.11+ (KHTML, like Gecko) Version/X.X.X.X Mobile Safari/534.11+
	if(/BlackBerry/i.test(navigator.userAgent))
	{
		this.device = "Mobile";
		this.os = "RIM";
	}	
	// Playbook: Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.0; en-US) AppleWebKit/534.8+ (KHTML, like Gecko) Version/0.0.1 Safari/534.8+
	if(/PlayBook/i.test(navigator.userAgent))
	{
		this.device = "Tablet";
		this.os = "RIM";
	}
	// Kindle: Mozilla/5.0 (Linux; U; en-US) AppleWebKit/528.5+ (KHTML, like Gecko, Safari/528.5+) Version/4.0 Kindle/3.0 (screen 600×800; rotate)
	// Kindle Fire: Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Kindle Fire Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
	if(/Kindle|Kindle Fire/i.test(navigator.userAgent))
	{
		this.device = "Tablet";
	}
	 // Opera Mobile: Opera/9.80 ($OS; Opera Mobi/$BUILD_NUMBER; U; $LANGUAGE) Presto/$PRESTO_VERSION Version/$VERSION
	if(/Opera Mobi/i.test(navigator.userAgent))
	{
		this.device = "Mobile";
	}
	// Windows Phone: Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; <manufacturer>; <model> [;<operator])
	if(/Windows Phone/i.test(navigator.userAgent))
	{
		this.device = "Mobile";
		this.os = "Windows";
	}
	// IEMobile/10.0; <Manufacturer>; <Device> [;<Operator>])
	if(/IEMobile/i.test(navigator.userAgent))
	{
		this.device = "Mobile";
		this.os = "Windows";
	}
	// Nokia: Mozilla/5.0 (MeeGo; N9) AppleWebKit/533.3 (KHTML, like Gecko) NokiaBrowser/8.5 Mobile Safari/533.3
	if(/MeeGo/i.test(navigator.userAgent))
	{
		this.device = "Mobile";
	}
	// Bot
	if(/(nuhk)|(GoogleBot)|(YammyBot)|(OpenBot)|(Slurp)|(MSNBot)|(Ask Jeeves\/Teoma)|(ia_archiver)/i.test(navigator.userAgent))
	{
		this.device = "Bot";
	}
	
	/**
	 * BROWSER
	 */
	// Gecko
	if(/Firefox[\/\s](\d+)(\.\d+)+/.test(navigator.userAgent)){ 
		this.browser = "Firefox";
		this.version = new Number(RegExp.$1);
	}	
	// Trident
	if(/MSIE (\d+)(\.\d+)+;/.test(navigator.userAgent)){
		this.browser = "Internet Explorer";
		this.version = new Number(RegExp.$1);
	}
	// Presto 7+
	if (/Opera[\/\s](\d+)(\.\d+)+/.test(navigator.userAgent)){
		this.browser = "Opera";
		this.version = new Number(RegExp.$1);
	}
	// Webkit
	if (/Safari/.test(navigator.userAgent)){
		this.browser = "Safari";

		if(/Version\/(\d+)(\.\d+)+/.test(navigator.userAgent))
		this.version = new Number(RegExp.$1);
	}
	// Webkit
	if(/Chrome[\/\s](\d+)(\.\d+)+/.test(navigator.userAgent)){
		this.browser = "Chrome";
		this.version = new Number(RegExp.$1);
	}
	
	/**
	 * OS
	 */
	if(this.device == "Unknown")
	{
		if(/Windows NT (\d\.)/i.test(navigator.userAgent)){
			this.os = "Windows";
			this.device = "Desktop";
			
			//RegExp.$1 
			// 5.1->XP 
			// 5.2->Server 2003
			// 6.0->Vista
			// 6.1->Windows 7
			// 7.0->Windows 8
		}
		if (/(Linux)|(X11)/.test(navigator.userAgent)){
			this.os = "Linux";
			this.device = "Desktop";
		}
		if (/(Mac_PowerPC)|(Macintosh)|(Mac OS)/i.test(navigator.userAgent)){
			this.os = "Mac OS";
			
			this.device = "Desktop";
		}		
	}
	
	/**
	 * Capabilites
	 */
	if(navigator.mimeTypes && navigator.mimeTypes.length)
	{
		var m = navigator.mimeTypes['application/x-shockwave-flash'];
		
		if(m && m.enabledPlugin){ this.can.push("Flash"); } 
	}
	
	if(!!document.createElement("video").canPlayType)
	{	
		this.can.push("HTML5");
	}

};
/**
 * 
 * @param feature "Flash","HTML5"
 * @returns {Boolean}
 */
Agent.prototype.capable = function(feature)
{
	    var i = this.can.length;
	    
	    while (i--) {
	       if (this.can[i] === feature) {
	           return true;
	       }
	    }
	    return false;
};

/**
 * 
 * @param device "Desktop","Mobile","Tablet"
 * @returns {Boolean}
 */
Agent.prototype.isDevice = function(device)
{
	return this.device === device;
};

Agent.prototype.isLandscape = function()
{
	return this.isDevice("Mobile") && (document.documentElement.clientWidth > document.documentElement.clientHeight);	
};

