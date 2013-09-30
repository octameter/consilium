var util={fill:function(a){return a<10?"0"+a:a},zeit:function(a,b){var c=b?new Date(b):new Date,d=this.fill(c.getMilliseconds()),e=this.fill(c.getSeconds()),f=this.fill(c.getMinutes()),g=this.fill(c.getHours()),h=this.fill(c.getDate()),i=this.fill(c.getMonth()),j=this.fill(c.getFullYear());switch(a){case"yyyy-MM-ddThh:mm.ss.ms":return j+"-"+i+"-"+h+"T"+g+":"+f+":"+e+"."+d;case"yyyy-MM-dd hh:mm.ss":return j+"-"+i+"-"+h+" "+g+":"+f+":"+e;case"yyyy-MM-dd":return j+"-"+i+"-"+h;case"dd.mm.yyyy hh:mm":return h+"."+i+"."+j+" "+g+":"+f;case"dd.MM.yyyy hh:mm":return h+"."+i+"."+j+" "+g+":"+f;case"dd.mm.yyyy":return h+"."+i+"."+j;case"dd.MM":return h+"."+i;case"hh:mm":return g+":"+f;case"dd":return h;case"ddInMonth":return(new Date(j,i,0)).getDate();case"MM":return i;case"yyyy":return j;case"hh":return g;case"mm":return f;case"midnight":return c.setHours(0,0,0,0),c.getTime();case"weekend":return c.getDay()==0||c.getDay()==6;default:return c.getTime()}},toQuery:function(a){var b=[];for(var c in a)b.push(encodeURIComponent(c)+"="+encodeURIComponent(a[c]));return b.join("&")},ajax:function(a,b,c,d,e,f){var g=new XMLHttpRequest||ActiveXObject("MSXML2.XMLHTTP.3.0");a=="GET"&&typeof e=="object"&&(b+="?"+this.toQuery(e)),g.open(a,b,!0),e&&g.setRequestHeader("Content-Type","application/json"),f&&g.setRequestHeader("Authorization",f),g.onreadystatechange=function(){g.readyState==4&&(g.status==200&&g.responseText?c(JSON.parse(g.responseText)):d({status:g.status,message:g.statusText}))},g.send(JSON.stringify(e))},form:function(a,b,c){var d=DOM().fragment("form");d.attrib("method",a),d.attrib("action",b);for(var e in c)c.hasOwnProperty(e)&&d.add("input").attrib("type","hidden").attrib("name",e).attrib("value",c[e]);d.element.submit()}};
function Node(a){this.server=a}Node.prototype.readActorsByCredential=function(a,b,c){this.query("GET","/authenticate?"+a,b,c)},Node.prototype.readActorByRequestToken=function(a,b,c){this.query("GET","/authorize?requestToken="+a,b,c)},Node.prototype.findActorsForRoleId=function(){},Node.prototype.findActorsForScopeId=function(a,b,c,d){var e="/actors/scopeId/"+a;this.query("GET",e,c,d,null,b)},Node.prototype.findActorForId=function(){},Node.prototype.updateActorById=function(a,b,c,d){var e="/actors/"+a;this.query("PUT",e,c,d,b)},Node.prototype.listActsForAntagonistId=function(a,b,c,d){var e="/acts/antagonistId/"+a;e+=b?"?since="+b:"",this.query("GET",e,c,d)},Node.prototype.createAct=function(a,b,c){var d="/acts";this.query("POST",d,b,c,a)},Node.prototype.readAct=function(){},Node.prototype.updateAct=function(){},Node.prototype.deleteAct=function(a,b,c){var d="/acts/"+a.id;this.query("DELETE",d,b,c)},Node.prototype.actLikeEntity=function(a,b,c,d){var e="/acts/"+a+"/like/"+b;this.query("GET",e,c,d)},Node.prototype.actDislikeEntity=function(a,b,c,d){var e="/acts/"+a+"/dislike/"+b;this.query("GET",e,c,d)},Node.prototype.actClickEntity=function(a,b,c,d){var e="/acts/"+a+"/click/"+b;this.query("GET",e,c,d)},Node.prototype.findEntities=function(){},Node.prototype.findEntitiesById=function(){},Node.prototype.findEvaluationForEntity=function(a,b,c,d){var e="/entities/"+a+"/evaluation/"+b;this.query("GET",e,c,d)},Node.prototype.getDevice=function(a,b,c,d,e,f,g){var h="/logo/"+a+"/"+b;if(c||d||e)h+="?";c&&(h+="since="+c),d&&(h+="&protagonistId="+d),e&&(h+="&antagonistId="+e),this.query("GET",h,f,g)},Node.prototype.list=function(a,b){var c="/master/list";this.query("GET",c,a,b)},Node.prototype.listAtc=function(a,b,c){a=encodeURIComponent(a);var d="/master/"+a;this.query("GET",d,b,c)},Node.prototype.listForm=function(a,b,c){a=encodeURIComponent(a);var d="/master/"+a+"/form";this.query("GET",d,b,c)},Node.prototype.listName=function(a,b,c,d){a=encodeURIComponent(a),b=encodeURIComponent(b);var e="/master/"+a+"/"+b+"/name";this.query("GET",e,c,d)},Node.prototype.listMenge=function(a,b,c,d,e){a=encodeURIComponent(a),b=encodeURIComponent(b),c=encodeURIComponent(c);var f="/master/"+a+"/"+b+"/"+c+"/menge";this.query("GET",f,d,e)},Node.prototype.query=function(a,b,c,d,e,f){util.ajax(a,this.server+b,c,d,e,f)};
(function(a,b,c){function d(c){if(!(this instanceof d))return new d(c);if(typeof c=="string")this.element=b.getElementById(c);else if(c instanceof HTMLElement)this.element=c;else if(c instanceof NodeList)this.element=c;else if(c===a)this.element=a;else{if(c instanceof d)return c;this.element=b}}d.prototype={find:function(a){return DOM(this.element.querySelector(a))},off:function(b){this.element&&(this.element.eventHandlers=this.element.eventHandlers||{});switch(b){case"touch":return b="ontouchstart"in a?"touchstart":"mousedown",this.off(b),this;case"touched":return b="ontouchend"in a?"touchend":"mouseup",this.off(b),b="ontouchcancel"in a?"touchcancel":"mousecancel",this.off(b),b="ontouchleave"in a?"touchleave":"mouseout",this.off(b),this;default:return this.element.eventHandlers[b]&&this.element.removeEventListener(b,this.element.eventHandlers[b],!1),this}},on:function(c,d,e,f){var g=e||{},h=function(a){a.preventDefault(),d(g)},i=function(a){a.preventDefault(),a.currentTarget.hasAttribute("href")&&(g.href=a.currentTarget.getAttribute("href")),g.tagName=a.target.tagName,g.startX=a.clientX,g.startY=a.clientY,g.offsetX=a.offsetX||a.layerX,g.offsetY=a.offsetY||a.layerY,delete g.element;if(g.hasOwnProperty("watch")){var b=g.watch.toUpperCase(),c=a.target;c.tagName!==b&&(c=c.parentNode,c.tagName!==b&&(c=c.parentNode)),c.tagName==b&&(g.element=c)}d(g)},j=function(a){a.preventDefault(),g.tag=a.touches[0].target.tagName,g.startX=a.touches[0].clientX,g.startY=a.touches[0].clientY,delete g.element;if(g.hasOwnProperty("watch")){var b=g.watch.split(":"),c=a.touches[0].target;c[b[0]]!==b[1]&&(c=c.parentNode,c[b[0]]!==b[1]&&(c=c.parentNode)),c[b[0]]===b[1]&&(g.element=c)}d(g)};this.element&&(this.element.eventHandlers=this.element.eventHandlers||{});switch(c){case"touch":return c="ontouchstart"in a?"touchstart":"mousedown",this.on(c,d,g),this;case"touched":return c="ontouchend"in a?"touchend":"mouseup",this.on(c,d,g),c="ontouchcancel"in a?"touchcancel":"mousecancel",this.on(c,d,g),c="ontouchleave"in a?"touchleave":"mouseout",this.on(c,d,g),this;case"touchstart":g.type="start",h=j;break;case"touchmove":g.type="move",h=j;break;case"touchend":g.type="end",h=j;break;case"touchleave":g.type="leave",h=j;break;case"touchcancel":g.type="leave",h=j;break;case"mousedown":g.type="start",h=i;break;case"mousemove":g.type="move",h=i;break;case"mouseup":g.type="end",h=i;break;case"mouseout":g.type="leave",h=i;break;case"mousecancel":g.type="leave",h=i;break;case"done":h=function(a){g.value=a.target.value,g.target=a.target,d(g)},c="blur";break;case"msg":h=function(a){a.preventDefault(),g=a.data,g.origin=a.origin,g.source=a.source,d(g)},c="message";break;case"window":var k=this.prefix("hidden"),l=this.prefix("visibilitychange");for(var m=0;m<k.length;m++)b.addEventListener(l[m],function(){g.hidden=b[k[m]],d(g)});return this;case"return":h=function(a){a.keyCode==13&&(a.stopPropagation(),a.preventDefault(),g.id=a.target.id,g.value=a.target.value,d(g))},c="keydown";break;case"change":case"keyup":case"focus":case"input":h=function(a){a.preventDefault(),g.id=a.target.id,g.value=a.target.value,d(g)};break;case"stage":h=function(a){a.target.className.indexOf("middle")>-1&&(a.preventDefault(),d(g))},c="transitionend";break;case"ready":c="DOMContentLoaded";break;case"device":c="deviceready";break;case"load":break;case"resume":break;case"submit":break;case"resize":break;default:console.log("No definition for "+c)}return this.element.eventHandlers[c]=h,this.element.addEventListener(c,h,!1),this},parent:function(){return DOM(this.element.parentNode)},inherit:function(a){return this.prototype=new a,this},prefix:function(a){var b=["webkit","moz","ms","o",""],c=[];for(var d=0;d<b.length;d++)c.push(b[d]+a.charAt(0).toUpperCase()+a.slice(1));return c},hash:function(){return a.location.hash.replace("#","")},device:function(){var a=navigator.userAgent;return a.match(/GoogleTV|SmartTV|Internet.TV|NetCast|NETTV|AppleTV|boxee|Kylo|Roku|DLNADOC|CE\-HTML/i)?"tv":a.match(/Xbox|PLAYSTATION.3|Wii/i)?"tv":a.match(/iPad/i)||a.match(/tablet/i)&&!a.match(/RX-34/i)||a.match(/FOLIO/i)?"tablet":a.match(/Linux/i)&&a.match(/Android/i)&&!a.match(/Fennec|mobi|HTC.Magic|HTCX06HT|Nexus.One|SC-02B|fone.945/i)?"tablet":a.match(/Kindle/i)||a.match(/Mac.OS/i)&&a.match(/Silk/i)?"tablet":a.match(/GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC(.Flyer|\_Flyer)|Sprint.ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos.S7|Dell.Streak.7|Advent.Vega|A101IT|A70BHT|MID7015|Next2|nook/i)||a.match(/MB511/i)&&a.match(/RUTEM/i)?"tablet":a.match(/BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google.Wireless.Transcoder/i)?"mobile":a.match(/Opera/i)&&a.match(/Windows.NT.5/i)&&a.match(/HTC|Xda|Mini|Vario|SAMSUNG\-GT\-i8000|SAMSUNG\-SGH\-i9/i)?"mobile":a.match(/Windows.(NT|XP|ME|9)/)&&!a.match(/Phone/i)||a.match(/Win(9|.9|NT)/i)?"desktop":a.match(/Macintosh|PowerPC/i)&&!a.match(/Silk/i)?"desktop":a.match(/Linux/i)&&a.match(/X11/i)?"desktop":a.match(/Solaris|SunOS|BSD/i)?"desktop":a.match(/Bot|Crawler|Spider|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|TinEye/i)&&!a.match(/Mobile/i)?"desktop":"mobile"},style:function(a,b){var d=this.element.getAttribute("style");return b!=c?(this.element.setAttribute("style",d+";"+a+":"+b),this):this.element.getAttribute("style",a)},setStylePrefix:function(a,b){var c=["-webkit","-moz","-ms","-o"];for(var d=0;d<c.length;d++)this.style(c[d]+"-"+a,b)},show:function(){return this.element.style.display="block",this.element.style.visibility="visible",this},invisible:function(){this.element.style.visibility="hidden"},hide:function(a){return this.element.style.display="none",this},swipe:function(a){return this.replaceClass(/(right|left|top|bottom|middle)/,a),this},html:function(a){return a!=null?(this.element.innerHTML=a,this):this.element.innerHTML},text:function(a,b){return a!=null?(this.element.textContent=a,this):(this.element.textContent=a.length<=b?a:a.substr(0,b-2)+"..",this)},add:function(a,b,c){var d=typeof a=="string"?this.create(a):a;for(var e in b)d.setAttribute(e,b[e]);return a=="textarea"&&c&&(d.value=c),a!="textarea"&&c&&(d.innerHTML=c),this.element.appendChild(d),DOM(d)},addNext:function(a,b,c){return this.parent().add(a,b,c)},remove:function(){this.element.parentNode.removeChild(this.element)},removeChilds:function(){while(this.element.hasChildNodes())this.element.removeChild(this.element.lastChild);return this},addClass:function(a){var b=a.split(" ");for(var c=0;c<b.length;c++)this.element.classList.add(b[c]);return this},removeClass:function(a){if(this.element.length)for(var b=0;b<this.element.length;b++)this.element[b].classList.remove(a);else this.element.classList.remove(a);return this},replaceClass:function(a,b){return this.element.className=this.element.className.replace(a,b),this},create:function(a){return b.createElement(a)},fragment:function(a){return this.element=b.createElement(a),this},addOptions:function(a,c,d,e){var f=b.createDocumentFragment();if(!e)for(var g=a;g<=c;g++){var h=this.create("option");h.textContent=g<10?"0"+g:g,h.value=g,d==g&&(h.selected="selected"),f.appendChild(h)}return this.element.appendChild(f),this},konto:function(a){return this.add("iframe",{src:a,style:"position:fixed; top:0px; width:100%; height:42px; border:none;"})},attrib:function(a,b){return a&&b!=null?(this.element.setAttribute(a,b),this):this.element.getAttribute(a)},get:function(a){return this.element[a]},set:function(a,b){return this.element[a]=b,this},toggle:function(a,b){this.attrib(a,this.attrib(a)==b[0]?b[1]:b[0])},removeAttrib:function(a){return this.element.removeAttribute(a),this},width:function(a){return a&&this.attrib("width",a),Math.floor(this.element.offsetWidth)},height:function(a){return a&&this.attrib("height",a),Math.floor(this.element.offsetHeight)},child:function(a){return DOM(this.element.childNodes[a])},childs:function(){return this.element.childNodes},scrollToIndex:function(a){var b=this.height(),c=this.child(a).height(),d=Math.floor(a*c)-b/2+c/2+a%2;this.scrollTo("scrollTop",d,500)},scrollTo:function(a,b,c){function i(a,b,c,d){return a/=d/2,a<1?c/2*a*a+b:(a--,-c/2*(a*(a-2)-1)+b)}var d=this.element[a],e=b-d,f=0,g=20,h=this.element,j=null;j=function(){f+=g;var b=i(f,d,e,c);h[a]=b,f<c&&setTimeout(j,g)},j()},tracking:function(c){var d=[];d.push(["_setAccount","UA-9955206-2"]),d.push(["_setDomainName",c]),d.push(["_trackPageview"]),a._gaq=d,function(){var a=b.createElement("script");a.type="text/javascript",a.async=!0,a.src=("https:"==b.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var c=b.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)}()},track:function(a){_gaq.push(["_trackPageview",a])},log:function(a){return console.log(this.element).bind(a),this},info:function(b){this.addClass("blur"),a.confirm(b),this.removeClass("blur")},busy:function(){var a=this.add("div");for(var b=0;b<12;b++){var c=a.add("div").addClass("spinner");c.setStylePrefix("transform","rotate("+b*30+"deg) translate(0, -120%)"),c.setStylePrefix("animation-delay",b/12+"s")}return a},notBusy:function(){return this.find(".spinner").parent().remove()}},a.DOModule=d.prototype,a.DOM=d})(this,document,undefined);
var Assets={busy:function(a){var b=document.createElement("div");for(var c=0;c<12;c++){var d=document.createElement("div");d.className="spinner",this.setStylePrefix(d,"transform","rotate("+c*30+"deg) translate(0, -120%)"),c==0?this.setStylePrefix(d,"animationDelay","0s"):this.setStylePrefix(d,"animationDelay",c/12+"s"),b.appendChild(d)}return b},busyDiv:function(a){var b=document.createElement("div");return b.setAttribute("id",a),b.style.display="none",b.style.position="absolute",b.style.left="50%",b.style.top="50%",b.style.width="100px",b.style.height="100px",b.style["margin-left"]="-50px",b.style["margin-top"]="-50px",b.appendChild(this.busy()),b},error:function(){var a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("viewBox","0 0 60 60"),a.setAttribute("width","100%"),a.setAttribute("height","100%"),a.setAttribute("version","1.1");var b=document.createElementNS("http://www.w3.org/2000/svg","circle");b.setAttribute("fill","rgba(255,55,55,0.6)"),b.setAttribute("stroke","#FFFFFF"),b.setAttribute("stroke-width","0"),b.setAttribute("cx","30"),b.setAttribute("cy","30"),b.setAttribute("r","27"),a.appendChild(b);var c=document.createElementNS("http://www.w3.org/2000/svg","polygon");return c.setAttribute("fill","rgba(255,255,255,0.8)"),c.setAttribute("points","15,15 20,15 30,25 40,15 45,15 45,20 35,30 45,40 45,45 40,45 30,35 20,45 15,45 15,40 25,30 15,20 15,15"),a.appendChild(c),a},caret:function(){var a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("viewBox","0 0 60 60"),a.setAttribute("width","100%"),a.setAttribute("height","100%"),a.setAttribute("version","1.1");var b=document.createElementNS("http://www.w3.org/2000/svg","polyline");return b.setAttribute("stroke","rgba(150,150,150,1)"),b.setAttribute("stroke-width","10"),b.setAttribute("fill","none"),b.setAttribute("points","15,5 45,30 15,55"),a.appendChild(b),a},antiCaret:function(){var a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("viewBox","0 0 60 60"),a.setAttribute("width","100%"),a.setAttribute("height","100%"),a.setAttribute("version","1.1");var b=document.createElementNS("http://www.w3.org/2000/svg","polyline");return b.setAttribute("stroke","rgba(150,150,150,1)"),b.setAttribute("stroke-width","10"),b.setAttribute("fill","none"),b.setAttribute("points","45,5 15,30 45,55"),a.appendChild(b),a},play:function(){var a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("viewBox","0 0 60 60"),a.setAttribute("width","100%"),a.setAttribute("height","100%");var b=document.createElementNS("http://www.w3.org/2000/svg","path");return b.setAttribute("fill","rgba(255,255,255,1)"),b.setAttribute("stroke","rgba(204,204,204,0.8)"),b.setAttribute("stroke-width","1"),b.setAttribute("d","M 15 30 L 15 15 C 15 5, 20 6, 25 10 L 45 25 C 50 28, 50 32, 45 35 L 25 50 C 20 55, 15 54, 15 45 L 15 30 Z"),a.appendChild(b),a},close:function(a){var b=document.createElementNS("http://www.w3.org/2000/svg","svg");b.setAttribute("viewBox","0 0 60 60"),b.setAttribute("width",a+"%"),b.setAttribute("height",a+"%"),b.style.position="absolute",b.style.right=-0.4*a+"%",b.style.top=-0.4*a+"%";var c=document.createElementNS("http://www.w3.org/2000/svg","circle");c.setAttribute("fill","rgba(105,105,105,0.8)"),c.setAttribute("stroke","#FFFFFF"),c.setAttribute("stroke-width","6"),c.setAttribute("cx","30"),c.setAttribute("cy","30"),c.setAttribute("r","27"),b.appendChild(c);var d=document.createElementNS("http://www.w3.org/2000/svg","polygon");return d.setAttribute("fill","rgba(100,100,100,0.8)"),d.setAttribute("stroke","#FFFFFF"),d.setAttribute("stroke-width","8"),d.setAttribute("points","15,45 30,30 15,15 30,30 45,15 30,30 45,45 30,30"),b.appendChild(d),b},fullScreen:function(){function c(a){a.target.setAttributeNS(null,"x","10"),a.target.setAttributeNS(null,"y","10"),a.target.setAttributeNS(null,"width","40"),a.target.setAttributeNS(null,"height","40")}function d(a){a.target.setAttributeNS(null,"x","15"),a.target.setAttributeNS(null,"y","15"),a.target.setAttributeNS(null,"width","30"),a.target.setAttributeNS(null,"height","30")}var a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("viewBox","0 0 60 60"),a.setAttribute("width","100%"),a.setAttribute("height","100%");var b=document.createElementNS("http://www.w3.org/2000/svg","rect");return b.setAttribute("fill","rgba(100,100,100,0.8)"),b.setAttribute("stroke","#CCCCCC"),b.setAttribute("stroke-width","2"),b.setAttribute("x","15"),b.setAttribute("y","15"),b.setAttribute("width","30"),b.setAttribute("height","30"),b.addEventListener("mouseover",c,!1),b.addEventListener("mouseout",d,!1),a.appendChild(b),a},pause:function(){var a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("viewBox","0 0 60 60"),a.setAttribute("width","100%"),a.setAttribute("height","100%");var b=document.createElementNS("http://www.w3.org/2000/svg","rect");b.setAttribute("fill","rgba(100,100,100,0.8)"),b.setAttribute("stroke","#CCCCCC"),b.setAttribute("stroke-width","2"),b.setAttribute("x","5"),b.setAttribute("y","10"),b.setAttribute("width","20"),b.setAttribute("height","40"),a.appendChild(b);var c=document.createElementNS("http://www.w3.org/2000/svg","rect");return c.setAttribute("fill","rgba(100,100,100,0.8)"),c.setAttribute("stroke","#CCCCCC"),c.setAttribute("stroke-width","2"),c.setAttribute("x","35"),c.setAttribute("y","10"),c.setAttribute("width","20"),c.setAttribute("height","40"),a.appendChild(c),a},likes:function(a){var b=document.createElementNS("http://www.w3.org/2000/svg","svg");b.setAttribute("viewBox","0 0 70 50"),b.setAttribute("width","100%"),b.setAttribute("height","100%");var c=document.createElementNS("http://www.w3.org/2000/svg","path");c.setAttribute("fill","rgba(255,255,255,0.9)"),c.setAttribute("stroke","rgba(204,204,204,0.8)"),c.setAttribute("stroke-width","2"),c.setAttribute("d","M23,8 L23,12 28,24 34,24 36,31 34,38 30,38 24,42 18,43C18,43 12,41 15,38 C15,38 10,36 14,32 C14,32  8,30 13,26 C13,26  6,19 20,21C20,21 14,6  21,8z"),b.appendChild(c);if(a>0){var d=document.createElementNS("http://www.w3.org/2000/svg","text");d.setAttribute("id","like"),d.setAttribute("x","28"),d.setAttribute("y","20"),d.setAttribute("font-family","Verdana"),d.setAttribute("font-size","12"),d.setAttribute("fill","rgba(204,204,204,0.8)"),d.textContent="+"+a,b.appendChild(d)}return b},getIcon:function(a,b){var c=document.createElement("img");return c.src="img/icon/"+a+".png",c.width=b,c.height=b,c},setStylePrefix:function(a,b,c){var d=["Webkit","Moz","Ms","O"];d.forEach(function(d){a.style[d+b[0].toUpperCase()+b.slice(1)]=c}),a.style[b]=c}};