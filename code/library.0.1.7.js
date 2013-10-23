var util={fill:function(a){return a<10?"0"+a:a},zeit:function(a,b){var c=b?new Date(b):new Date,d=this.fill(c.getMilliseconds()),e=this.fill(c.getSeconds()),f=this.fill(c.getMinutes()),g=this.fill(c.getHours()),h=this.fill(c.getDate()),i=this.fill(c.getMonth()+1),j=this.fill(c.getFullYear());switch(a){case"yyyy-MM-ddThh:mm.ss.ms":return j+"-"+i+"-"+h+"T"+g+":"+f+":"+e+"."+d;case"yyyy-MM-dd hh:mm.ss":return j+"-"+i+"-"+h+" "+g+":"+f+":"+e;case"yyyy-MM-dd":return j+"-"+i+"-"+h;case"dd.mm.yyyy hh:mm":return h+"."+i+"."+j+" "+g+":"+f;case"dd.MM.yyyy hh:mm":return h+"."+i+"."+j+" "+g+":"+f;case"dd.mm.yyyy":return h+"."+i+"."+j;case"dd.MM":return h+"."+i;case"hh:mm":return g+":"+f;case"dd":return h;case"ddInMonth":return(new Date(j,i,0)).getDate();case"MM":return i;case"yyyy":return j;case"hh":return g;case"mm":return f;case"midnight":return c.setHours(0,0,0,0),c.getTime();case"weekend":return c.getDay()==0||c.getDay()==6;default:return c.getTime()}},ajax:function(a,b,c,d,e){a=="GET"&&typeof d=="object"&&(b+="?"+this.toQuery(d));var f=new XMLHttpRequest||ActiveXObject("MSXML2.XMLHTTP.3.0");f.open(a,b,!0),d&&f.setRequestHeader("Content-Type","application/json"),e&&f.setRequestHeader("Authorization",e),f.onreadystatechange=function(){f.readyState==4&&(f.status==200&&f.responseText?c({status:f.status,message:JSON.parse(f.responseText)}):c({status:f.status,message:f.statusText}))},f.send(JSON.stringify(d))}};
var Node={init:function(a){return document.domain==a||window.device?(this.domain=document.domain="epha.ch",this.server="https://node.epha.ch",this.live=!0):(document.domain=document.domain,this.server="http://"+document.domain+":8080",this.live=!1),this.live},navigation:function(){window.device?(window.device.phonegap=="3.0.0"&&window.device.platform=="iPhone"&&parseFloat(window.device.version)===7&&DOM(document).find("body").style("margin-top","20px"),this.getActor()):this.createNavigation()},createNavigation:function(){var a=DOM(document.body).find("article"),b=a.addPrevious("header").addClass("konto").add("iframe",{src:this.server,style:"position:fixed; top:0px; width:100%; height:42px; border:none;"});b.on("load",function(){Node.sso=b.element.contentWindow,DOM(document).find("body").style("margin-top","42px"),DOM(window).on("msg",function(a){a.transfer.request=="REDIRECT"&&location.replace(a.transfer.target)})})},getActor:function(a){if(window.device){var b=JSON.parse(localStorage.getItem("device_actor"));a(b)}else Node.sso.postMessage({request:"ACTOR_GET"},"*"),DOM(window).on("msg",function(b){a(b)})},getActs:function(a){if(window.device){var b=localStorage.getItem("device_acts");a(b)}else this.listActsForAntagonistId(antagonistId,since,function(b){b.status==200?a(b.message):a()})},setActor:function(a,b){this.query("GET","/authenticate?"+urlVariables,b)},readActorsByCredential:function(a,b){this.query("GET","/authenticate?"+this.toQuery(a),b)},readActorByRequestToken:function(a,b,c){this.query("GET","/authorize?requestToken="+a,b,c)},findActorsForRoleId:function(){},findActorsForScopeId:function(a,b,c,d){var e="/actors/scopeId/"+a;this.query("GET",e,c,d,null,b)},findActorForId:function(){},updateActorById:function(a,b,c,d){var e="/actors/"+a;this.query("PUT",e,c,d,b)},listActsForAntagonistId:function(a,b,c){var d="/acts/antagonistId/"+a;d+=b?"?since="+b:"",this.query("GET",d,c)},createAct:function(a,b,c){var d="/acts";this.query("POST",d,b,c,a)},readAct:function(){},updateAct:function(){},deleteAct:function(a,b,c){var d="/acts/"+a.id;this.query("DELETE",d,b,c)},actLikeEntity:function(a,b,c,d){var e="/acts/"+a+"/like/"+b;this.query("GET",e,c,d)},actDislikeEntity:function(a,b,c,d){var e="/acts/"+a+"/dislike/"+b;this.query("GET",e,c,d)},actClickEntity:function(a,b,c,d){var e="/acts/"+a+"/click/"+b;this.query("GET",e,c,d)},findEntities:function(){},findEntitiesById:function(){},findEvaluationForEntity:function(a,b,c,d){var e="/entities/"+a+"/evaluation/"+b;this.query("GET",e,c,d)},getDevice:function(a,b,c,d,e,f,g){var h="/logo/"+a+"/"+b;if(c||d||e)h+="?";c&&(h+="since="+c),d&&(h+="&protagonistId="+d),e&&(h+="&antagonistId="+e),this.query("GET",h,f,g)},list:function(a,b){var c="/master/list";this.query("GET",c,a,b)},listAtc:function(a,b,c){a=encodeURIComponent(a);var d="/master/"+a;this.query("GET",d,b,c)},listForm:function(a,b,c){a=encodeURIComponent(a);var d="/master/"+a+"/form";this.query("GET",d,b,c)},listName:function(a,b,c,d){a=encodeURIComponent(a),b=encodeURIComponent(b);var e="/master/"+a+"/"+b+"/name";this.query("GET",e,c,d)},listMenge:function(a,b,c,d,e){a=encodeURIComponent(a),b=encodeURIComponent(b),c=encodeURIComponent(c);var f="/master/"+a+"/"+b+"/"+c+"/menge";this.query("GET",f,d,e)},query:function(a,b,c,d,e){this.ajax(a,this.server+b,c,d,e)},ajax:function(a,b,c,d,e){a=="GET"&&typeof d=="object"&&(b+="?"+this.toQuery(d));var f=new XMLHttpRequest||ActiveXObject("MSXML2.XMLHTTP.3.0");f.open(a,b,!0),d&&f.setRequestHeader("Content-Type","application/json"),e&&f.setRequestHeader("Authorization",e),f.onreadystatechange=function(){f.readyState==4&&(f.status==200&&f.responseText?c({status:f.status,message:JSON.parse(f.responseText)}):c({status:f.status,message:f.statusText}))},f.send(JSON.stringify(d))},toQuery:function(a){var b=[];for(var c in a)b.push(encodeURIComponent(c)+"="+encodeURIComponent(a[c]));return b.join("&")},form:function(a,b,c){var d=DOM().fragment("form");d.attrib("method",a),d.attrib("action",b);for(var e in c)c.hasOwnProperty(e)&&d.add("input").attrib("type","hidden").attrib("name",e).attrib("value",c[e]);d.element.submit()}};
function control(a){var b={};a.on=function(a,c){a in b?b[a].indexOf(c)!=-1?console.log("Function exists"):b[a].push(c):b[a]=[c]},a.off=function(a,c){b[a].splice(b[a].indexOf(c),1)},a.dispatch=function(a,c){for(var d=0;d<b[a].length;d++)b[a][d](c)}};
(function(a,b,c){function d(c){if(!(this instanceof d))return new d(c);if(typeof c=="string")this.element=b.getElementById(c);else if(c instanceof HTMLElement)this.element=c;else if(c instanceof NodeList)this.element=c;else if(c===a)this.element=a;else{if(c instanceof d)return c;this.element=b}}d.prototype={find:function(a){return DOM(this.element.querySelector(a))},findAll:function(a){return DOM(this.element.querySelectorAll(a))},off:function(b){this.element&&(this.element.eventHandlers=this.element.eventHandlers||{});switch(b){case"touch":return b="ontouchstart"in a?"touchstart":"mousedown",this.off(b),this;case"move":return b="ontouchmove"in a?"touchmove":"mousemove",this.off(b),this;case"touched":return b="ontouchend"in a?"touchend":"mouseup",this.off(b),b="ontouchcancel"in a?"touchcancel":"mousecancel",this.off(b),b="ontouchleave"in a?"touchleave":"mouseleave",this.off(b),this;default:return this.element.eventHandlers[b]&&this.element.removeEventListener(b,this.element.eventHandlers[b],!1),this}},on:function(b,c,d,e){var f=d||{},g=function(a){a.preventDefault(),a.stopPropagation(),a.touches&&(a=a.touches[0]),f.target=a.target||a.srcElement;if(f.watch){var b=3;while(b--){if(f.target.nodeName==f.watch.toUpperCase())break;f.target=f.target.parentNode}}f.target.hasAttribute&&(f.target.hasAttribute("data")&&(f.transfer=JSON.parse(f.target.getAttribute("data"))),f.target.hasAttribute("href")&&(f.href=f.target.getAttribute("href"))),f.target.value&&(f.value=f.target.value),a.data&&a.origin&&(f.transfer=a.data,f.origin=a.origin,f.timeStamp=a.timeStamp,f.type=a.type),a.keyCode&&(f.keyCode=a.keyCode);if(a.clientX>0||a.offsetX>0||a.layerX>0)f.koord={clientX:a.clientX,clientY:a.clientY,offsetX:a.offsetX||a.layerX,offsetY:a.offsetY||a.layerY};c(f)};this.element&&(this.element.eventHandlers=this.element.eventHandlers||{});switch(b){case"touch":return b="ontouchstart"in a?"touchstart":"mousedown",this.on(b,c,f),this;case"move":return b="ontouchmove"in a?"touchmove":"mousemove",this.on(b,c,f),this;case"touched":return b="ontouchend"in a?"touchend":"mouseup",this.on(b,c,f),b="ontouchcancel"in a?"touchcancel":"mousecancel",this.on(b,c,f),b="ontouchleave"in a?"touchleave":"mouseleave",this.on(b,c,f),this;case"touchstart":f.type="start";break;case"touchmove":f.type="move";break;case"touchend":f.type="end";break;case"touchleave":f.type="leave";break;case"touchcancel":f.type="leave";break;case"mousedown":f.type="start";break;case"mousemove":f.type="move";break;case"mouseup":f.type="end";break;case"mouseout":f.type="leave";break;case"mouseleave":f.type="leave";break;case"mousecancel":f.type="leave";break;case"modal":b="blur";break;case"msg":b="message";break;case"tab":b="visibilitychange";break;case"return":b="keydown";break;case"change":break;case"keyup":break;case"focus":break;case"input":break;case"stage":b="transitionend";case"transitionend":break;case"ready":b=a.device?"deviceready":"DOMContentLoaded";break;case"load":break;case"resume":break;case"submit":break;case"resize":break;default:console.log("No definition for "+b)}return this.element.eventHandlers[b]=g,this.element.addEventListener(b,g,!1),this},parent:function(){return DOM(this.element.parentNode)},inherit:function(a){return this.prototype=new a,this},prefix:function(a){var b=["webkit","moz","ms","o",""],c=[];for(var d=0;d<b.length;d++)c.push(b[d]+a.charAt(0).toUpperCase()+a.slice(1));return c},hash:function(){return a.location.hash.replace("#","")},removeHash:function(){history.pushState("",b.title,a.location.pathname)},device:function(){var a=navigator.userAgent;return a.match(/GoogleTV|SmartTV|Internet.TV|NetCast|NETTV|AppleTV|boxee|Kylo|Roku|DLNADOC|CE\-HTML/i)?"tv":a.match(/Xbox|PLAYSTATION.3|Wii/i)?"tv":a.match(/iPad/i)||a.match(/tablet/i)&&!a.match(/RX-34/i)||a.match(/FOLIO/i)?"tablet":a.match(/Linux/i)&&a.match(/Android/i)&&!a.match(/Fennec|mobi|HTC.Magic|HTCX06HT|Nexus.One|SC-02B|fone.945/i)?"tablet":a.match(/Kindle/i)||a.match(/Mac.OS/i)&&a.match(/Silk/i)?"tablet":a.match(/GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC(.Flyer|\_Flyer)|Sprint.ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos.S7|Dell.Streak.7|Advent.Vega|A101IT|A70BHT|MID7015|Next2|nook/i)||a.match(/MB511/i)&&a.match(/RUTEM/i)?"tablet":a.match(/BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google.Wireless.Transcoder/i)?"mobile":a.match(/Opera/i)&&a.match(/Windows.NT.5/i)&&a.match(/HTC|Xda|Mini|Vario|SAMSUNG\-GT\-i8000|SAMSUNG\-SGH\-i9/i)?"mobile":a.match(/Windows.(NT|XP|ME|9)/)&&!a.match(/Phone/i)||a.match(/Win(9|.9|NT)/i)?"desktop":a.match(/Macintosh|PowerPC/i)&&!a.match(/Silk/i)?"desktop":a.match(/Linux/i)&&a.match(/X11/i)?"desktop":a.match(/Solaris|SunOS|BSD/i)?"desktop":a.match(/Bot|Crawler|Spider|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|TinEye/i)&&!a.match(/Mobile/i)?"desktop":"mobile"},style:function(a,b){if(b!=c)return this.element.style.setProperty(a,b),this;this.element.style.getAttribute(a)},setStylePrefix:function(a,b){var c=["-webkit","-moz","-ms","-o"];for(var d=0;d<c.length;d++)this.style(c[d]+"-"+a,b)},show:function(){if(this.element instanceof NodeList){var a=this.element.length;while(a--)this.element[a].style.display="block",this.element[a].style.visibility="visible"}else this.element.style.display="block",this.element.style.visibility="visible";return this},invisible:function(){this.element.style.visibility="hidden"},hide:function(a){if(this.element instanceof NodeList){var b=this.element.length;while(b--)this.element[b].style.display="none"}else this.element.style.display="none";return this},swipe:function(a){return this.replaceClass(/(right|left|top|bottom|middle)/,a),this},html:function(a){return a!=null?(this.element.innerHTML=a,this):this.element.innerHTML},text:function(a,b){return a?(b?this.element.textContent=a.length<=b?a:a.substr(0,b-2)+"..":this.element.textContent=a,this):this.element.textContent},add:function(a,b,c){var d=typeof a=="string"?this.create(a):a;for(var e in b)d.setAttribute(e,b[e]);return a=="textarea"&&c&&(d.value=c),a!="textarea"&&c&&(d.innerHTML=c),this.element.appendChild(d),DOM(d)},addPrevious:function(a,b,c){var d=this.create(a,b,c);return this.parent().element.insertBefore(d,this.element),DOM(d)},addNext:function(a,b,c){return this.parent().add(a,b,c)},remove:function(){if(this.element instanceof NodeList){var a=this.element.length;while(a--)this.element[a].parentNode.removeChild(this.element[a])}else this.element.parentNode.removeChild(this.element);return this},removeChilds:function(){while(this.element.hasChildNodes())this.element.removeChild(this.element.lastChild);return this},hasChilds:function(){return this.element.hasChildNodes()},addClass:function(a){var b=a.split(" ");for(var c=0;c<b.length;c++)this.element.classList.add(b[c]);return this},removeClass:function(a){if(this.element instanceof NodeList){var b=this.element.length;while(b--)this.element[b].classList.remove(a)}else this.element.classList.remove(a);return this},replaceClass:function(a,b){return this.element.className=this.element.className.replace(a,b),this},hasClass:function(a){return b.body.classList.contains(a)},create:function(a){return b.createElement(a)},fragments:function(a){var c=b.createDocumentFragment();for(var d=0;d<a.length;d++)c.appendChild(a[d]);return this.add(c),this},attrib:function(a,b){return a&&b?(this.element.setAttribute(a,b),this):this.element.getAttribute(a)},get:function(a){return this.element[a]},set:function(a,b){return this.element[a]=b,this},toggle:function(a,b){this.attrib(a,this.attrib(a)==b[0]?b[1]:b[0])},removeAttrib:function(a){return this.element.removeAttribute(a),this},width:function(a){return a&&this.attrib("width",a),Math.floor(this.element.offsetWidth)},height:function(a){return a&&this.attrib("height",a),Math.floor(this.element.offsetHeight)},child:function(a){return DOM(this.element.childNodes[a])},childs:function(){return this.element.childNodes},scrollToIndex:function(a){var b=this.height(),c=this.child(a).height(),d=Math.floor(a*c)-b/2+c/2+a%2;this.scrollTo("scrollTop",d,500)},scrollTo:function(a,b,c){function i(a,b,c,d){return a/=d/2,a<1?c/2*a*a+b:(a--,-c/2*(a*(a-2)-1)+b)}var d=this.element[a],e=b-d,f=0,g=20,h=this.element,j=null;j=function(){f+=g;var b=i(f,d,e,c);h[a]=b,f<c&&setTimeout(j,g)},j()},tracking:function(c){var d=[];d.push(["_setAccount","UA-9955206-2"]),d.push(["_setDomainName",c]),d.push(["_trackPageview"]),a._gaq=d,function(){var a=b.createElement("script");a.type="text/javascript",a.async=!0,a.src=("https:"==b.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var c=b.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)}()},track:function(a){_gaq.push(["_trackPageview",a])},log:function(a){return console.log(this.element).bind(a),this},info:function(b){this.addClass("blur"),a.confirm(b),this.removeClass("blur")},busy:function(){var a=this.add("div");for(var b=0;b<12;b++){var c=a.add("div").addClass("spinner");c.setStylePrefix("transform","rotate("+b*30+"deg) translate(0, -120%)"),c.setStylePrefix("animation-delay",b/12+"s")}return a},notBusy:function(){return this.find(".spinner").parent().remove()},error:function(a){this.removeChilds();var b,c,d;switch(a){case"oldbrowser":b="Aktuellen Browser verwenden",c="Ihr Browser ist zu alt. Die verwendeten Darstellungen k&ouml;nnen nur von den aktuellen Versionen der Browser <a href='http://chrome.google.com'>Chrome</a>, <a href='http://mozilla.org/firefox/'>Firefox</a>, <a href='http://windows.microsoft.com/de-ch/internet-explorer/download-ie'>Internet Explorer</a>, <a href='http://www.opera.com/de/''>Opera</a> oder <a href='www.apple.com/de/safari'>Safari</a> korrekt dargestellt werden.";break;default:b="Uups... Anfrage war fehlerhaft",c="Der Service ist aktuell nicht verfügbar. Bitte versuchen Sie es später noch einmal."}d="Email: support@epha.ch";var e=this.add("div").addClass("error");e.add("h2").text(b),e.add("p").html(c),e.add("p").text(d)}},a.DOModule=d.prototype,a.DOM=d})(this,document,undefined);
DOModule.setSlider=function(a){a=parseInt(a);if(window.device)this.find("input").set("value",a);else{var b=this.find(".slider"),c=b.find("a"),d=b.width()-c.width();c.style("left",parseInt(d*a/100)+"px")}},DOModule.addSlider=function(a){if(window.device){var b=this.add("input",{type:"range",min:0,max:100});b.on("change",function(a){console.log("slider changed",a.value)})}else{var b=this.add("div").addClass("slider"),c=b.add("a"),d=b.width()-c.width()/2;function e(b){if(b.tagName=="DIV"){c.addClass("smooth");var e=parseInt((b.offsetX-c.width()/2)/d*100);c.style("left",parseInt(d*e/100)+"px"),a(e),c.on("transitionend",function(){c.removeClass("smooth")})}}function f(e){e.type=="start"&&(b.on("move",f,{watch:"DIV"}),b.on("touched",f));if(e.type=="move"&&e.tagName=="DIV"){var g=parseInt((e.offsetX-c.width()/2)/d*100);a(g),c.style("left",parseInt(d*g/100)+"px")}if(e.type=="end"||e.type=="leave")b.off("move"),b.off("touched")}c.on("touch",f),b.on("touch",e,{watch:"DIV"})}return this};
var DateTime={createOptions:function(a){DOM(a.id).removeChilds();for(var b=a.min;b<=a.max;b++)DOM(a.id).add("option").set("value",b).text(b<10?"0"+b:b),a.zeit==b&&DOM(a.id).child(b-1).set("selected","selected")}};DOModule.setDatetime=function(a){a=parseInt(a),window.device?(this.find("input[type=date]").set("value",util.zeit("yyyy-MM-dd",zeitInMs)),this.find("input[type=time]").set("value",util.zeit("hh:mm",zeitInMs))):(DateTime.createOptions({id:"dd",min:1,max:util.zeit("ddInMonth",a),zeit:util.zeit("dd",a)}),DateTime.createOptions({id:"MM",min:1,max:12,zeit:util.zeit("MM",a)}),DateTime.createOptions({id:"yyyy",min:2013,max:util.zeit("yyyy",a),zeit:util.zeit("yyyy",a)}),DateTime.createOptions({id:"hh",min:1,max:24,zeit:util.zeit("hh",a)}),DateTime.createOptions({id:"mm",min:1,max:60,zeit:util.zeit("mm",a)}))},DOModule.addDatetime=function(a){if(window.device)this.add("input",{type:"date"}).addClass("optionen"),this.add("input",{type:"time"}).addClass("optionen");else{function b(){return(new Date(DOM("yyyy").find("option:checked").get("value"),DOM("MM").find("option:checked").get("value")-1,DOM("dd").find("option:checked").get("value"),DOM("hh").find("option:checked").get("value"),DOM("mm").find("option:checked").get("value"))).getTime()}this.add("span").style("margin-right","5px").html("<b>Datum</b>"),this.add("select",{id:"dd"}).addClass("optionen").on("change",function(){a(b())}),this.add("select",{id:"MM"}).addClass("optionen").on("change",function(c){var d=b();DateTime.createOptions({id:"dd",min:1,max:util.zeit("ddInMonth",d),zeit:util.zeit("dd",d)}),a(d)}),this.add("select",{id:"yyyy"}).addClass("optionen").on("change",function(c){a(b())}),this.add("span").style("margin-right","5px").style("margin-left","10px").html("<b>Zeit</b>"),this.add("select",{id:"hh"}).addClass("optionen").on("change",function(c){a(b())}),this.add("select",{id:"mm"}).addClass("optionen").on("change",function(c){a(b())})}};
var Liste={};DOModule.legend=function(a){this.find("legend").html(a)},DOModule.addListe=function(){return this.add("ul").addClass("listeNext")},DOModule.addRow=function(a){var b=this.add("li");return a.data&&b.attrib("data",JSON.stringify(a.data)),b.add("div").addClass("row").add("div").addClass("row_caretLeft").addNext("div").addClass("row_title").addNext("div").addClass("row_value").addNext("div").addClass("row_caretRight").parent().addNext("p").addClass("row_detail").parent().fillRow(a)},DOModule.addRemovableRow=function(a){var b=this.add("li"),c=b.add("div").addClass("row").add("div").addClass("row_caretLeft").addNext("div").addClass("row_title");return a.callback&&c.addNext("div").addClass("row_delete").addClass("button-action").addClass("grey").text("Löschen").on("touch",function(c){DOM(c.target).text("Wirklich Löschen?").removeClass("grey").addClass("red").off("touch").on("touch",function(){b.remove(),a.callback()})}),b.fillRow(a),b},DOModule.fillRow=function(a){return this.find(".row_title").add("span",{style:"font-size:100%;font-weight:bold;"}).html(a.title||""),a.zeit&&this.find(".row_title").add("br").addNext("span",{style:"font-size:90%;"}).html(a.zeit),a.farbe&&this.find(".row_value").style("background",a.farbe).html(a.value||""),this.find(".row_detail").html(a.detail||""),a.caretRight&&this.find(".row_caretRight").addSymbol("caretR"),a.caretLeft&&this.find(".row_caretLeft").addSymbol("caretL"),this};
var Svg={line:function(a){var b=document.createElementNS("http://www.w3.org/2000/svg","line");return b.setAttribute("fill",a.color||"white"),b.setAttribute("stroke",a.color||"white"),b.setAttribute("stroke-width",a.strokeWidth||"1"),b.setAttribute("x1",a.x1),b.setAttribute("y1",a.y1),b.setAttribute("x2",a.x2),b.setAttribute("y2",a.y2),a.className&&b.setAttribute("class",a.className),a.data&&b.setAttribute("data",JSON.stringify(a.data)),b},label:function(a){var b=document.createElementNS("http://www.w3.org/2000/svg","text");return b.setAttribute("x",a.x),b.setAttribute("dx",-a.text.length*3),b.setAttribute("y",a.y-10),b.setAttribute("fill","rgba(255,255,255,1)"),b.setAttribute("font-size","11pt"),b.setAttribute("style","background:blue"),b.textContent=a.text,b},rect:function(a){var b=document.createElementNS("http://www.w3.org/2000/svg","rect");return b.setAttribute("x",a.x),b.setAttribute("y",a.y),b.setAttribute("width",a.width),b.setAttribute("height",a.height),b.setAttribute("fill",a.fill||""),b.setAttribute("stroke",a.stroke||""),b.setAttribute("stroke-width","2"),a.className&&b.setAttribute("class",a.className),a.data&&b.setAttribute("data",JSON.stringify(a.data)),b},circle:function(a){var b=document.createElementNS("http://www.w3.org/2000/svg","circle");return b.setAttribute("fill",a.fill),b.setAttribute("stroke",a.stroke||"#FFFFFF"),b.setAttribute("stroke-width",a.strokeWidth||"0"),b.setAttribute("data",a.data||{}),b.setAttribute("cx",a.x),b.setAttribute("cy",a.y),b.setAttribute("r",a.r),a.className&&b.setAttribute("class",a.className),a.data&&b.setAttribute("data",JSON.stringify(a.data)),b},polygon:function(a){var b=document.createElementNS("http://www.w3.org/2000/svg","polygon");return b.setAttribute("fill",a.fill),b.setAttribute("points",a.points),b},polyline:function(a){var b=document.createElementNS("http://www.w3.org/2000/svg","polyline");return b.setAttribute("stroke",a.stroke),b.setAttribute("stroke-width",a.strokeWidth),b.setAttribute("fill",a.fill),b.setAttribute("points",a.points),b},path:function(a){var b=document.createElementNS("http://www.w3.org/2000/svg","path");return b.setAttribute("fill",a.fill),b.setAttribute("stroke",a.stroke),b.setAttribute("stroke-width",a.strokeWidth),b.setAttribute("d",a.d),b},symbol:function(){var a=document.createElementNS("http://www.w3.org/2000/svg","svg");return a.setAttribute("viewBox","0 0 60 60"),a.setAttribute("width","100%"),a.setAttribute("height","100%"),a},play:function(){var a={fill:"rgba(255,255,255,1)",stroke:"rgba(204,204,204,0.8)",strokeWidth:"1"};return a.d="M 15 30 L 15 15 C 15 5, 20 6, 25 10 L 45 25 C 50 28, 50 32, 45 35 L 25 50 C 20 55, 15 54, 15 45 L 15 30 Z",this.symbol().appendChild(this.path(a))},pause:function(){var a=this.symbol(),b={fill:"rgba(100,100,100,0.8)",stroke:"#CCCCCC","stroke-width":"2",width:"20",height:"40",y:"10"};return b.x="5",a.appendChild(this.rect(b)),b.x="35",a.appendChild(this.rect(b)),a},error:function(){var a={fill:"rgba(255,255,255,0.8)",points:"15,15 20,15 30,25 40,15 45,15 45,20 35,30 45,40 45,45 40,45 30,35 20,45 15,45 15,40 25,30 15,20 15,15"},b=this.symbol();return b.appendChild(this.circle({x:"30",y:"30",r:"27",fill:"rgba(255,55,55,0.6)",stroke:"#FFFFFF",strokeWidth:0})),b.appendChild(this.polygon(a)),b},caretL:function(){var a={stroke:"rgba(150,150,150,1)",strokeWidth:"10",fill:"none",points:"45,5 15,30 45,55"},b=this.symbol();return b.appendChild(this.polyline(a)),b},caretR:function(){var a={stroke:"rgba(150,150,150,1)",strokeWidth:"10",fill:"none",points:"15,5 45,30 15,55"},b=this.symbol();return b.appendChild(this.polyline(a)),b},close:function(a){var b=document.createElementNS("http://www.w3.org/2000/svg","svg");b.setAttribute("viewBox","0 0 60 60"),b.setAttribute("width",a+"%"),b.setAttribute("height",a+"%"),b.style.position="absolute",b.style.right=-0.4*a+"%",b.style.top=-0.4*a+"%";var c=document.createElementNS("http://www.w3.org/2000/svg","circle");c.setAttribute("fill","rgba(105,105,105,0.8)"),c.setAttribute("stroke","#FFFFFF"),c.setAttribute("stroke-width","6"),c.setAttribute("cx","30"),c.setAttribute("cy","30"),c.setAttribute("r","27"),b.appendChild(c);var d=document.createElementNS("http://www.w3.org/2000/svg","line");d.setAttribute("fill","rgba(100,100,100,0.8)"),d.setAttribute("stroke","#FFFFFF"),d.setAttribute("stroke-width","8"),d.setAttribute("x1","15"),d.setAttribute("y1","15"),d.setAttribute("x2","45"),d.setAttribute("y2","45"),b.appendChild(d);var d=document.createElementNS("http://www.w3.org/2000/svg","line");return d.setAttribute("fill","rgba(100,100,100,0.8)"),d.setAttribute("stroke","#FFFFFF"),d.setAttribute("stroke-width","8"),d.setAttribute("x1","45"),d.setAttribute("y1","15"),d.setAttribute("x2","15"),d.setAttribute("y2","45"),b.appendChild(d),b},fullScreen:function(){function c(a){a.target.setAttributeNS(null,"x","10"),a.target.setAttributeNS(null,"y","10"),a.target.setAttributeNS(null,"width","40"),a.target.setAttributeNS(null,"height","40")}function d(a){a.target.setAttributeNS(null,"x","15"),a.target.setAttributeNS(null,"y","15"),a.target.setAttributeNS(null,"width","30"),a.target.setAttributeNS(null,"height","30")}var a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("viewBox","0 0 60 60"),a.setAttribute("width","100%"),a.setAttribute("height","100%");var b=document.createElementNS("http://www.w3.org/2000/svg","rect");return b.setAttribute("fill","rgba(100,100,100,0.8)"),b.setAttribute("stroke","#CCCCCC"),b.setAttribute("stroke-width","2"),b.setAttribute("x","15"),b.setAttribute("y","15"),b.setAttribute("width","30"),b.setAttribute("height","30"),b.addEventListener("mouseover",c,!1),b.addEventListener("mouseout",d,!1),a.appendChild(b),a},likes:function(a){var b=document.createElementNS("http://www.w3.org/2000/svg","svg");b.setAttribute("viewBox","0 0 70 50"),b.setAttribute("width","100%"),b.setAttribute("height","100%");var c=document.createElementNS("http://www.w3.org/2000/svg","path");c.setAttribute("fill","rgba(255,255,255,0.9)"),c.setAttribute("stroke","rgba(204,204,204,0.8)"),c.setAttribute("stroke-width","2"),c.setAttribute("d","M23,8 L23,12 28,24 34,24 36,31 34,38 30,38 24,42 18,43C18,43 12,41 15,38 C15,38 10,36 14,32 C14,32  8,30 13,26 C13,26  6,19 20,21C20,21 14,6  21,8z"),b.appendChild(c);if(a>0){var d=document.createElementNS("http://www.w3.org/2000/svg","text");d.setAttribute("id","like"),d.setAttribute("x","28"),d.setAttribute("y","20"),d.setAttribute("font-family","Verdana"),d.setAttribute("font-size","12"),d.setAttribute("fill","rgba(204,204,204,0.8)"),d.textContent="+"+a,b.appendChild(d)}return b}};DOModule.timeLegend=function(a,b,c,d,e,f){for(var g=a;g<=b;g+=c){var h={x:g+c/2,y:d,text:util.zeit("dd.MM",e+g*f)};this.add(Svg.label(h))}},DOModule.timeGrid=function(a,b,c,d,e,f,g,h){var i=(new Date).getTime();for(var j=a;j<=b;j+=c)this.add(Svg.line({x1:j,y1:d,x2:j,y2:e,color:"rgba(255,255,255,1)"})),util.zeit("weekend",g+j*h)&&this.add(Svg.rect({x:j,y:d,width:c,height:e-d,fill:"rgba(255,255,255,0.3)"})),i>g+j*h&&i<g+j*h+864e5&&this.add(Svg.rect({x:j,y:d,width:c,height:e-d,fill:"rgba(100,255,100,0.3)"}));for(var k=d;k<=e;k+=f)this.add(Svg.line({x1:a,y1:k,x2:b,y2:k,color:"rgba(255,255,255,1)"}))},DOModule.drawSymptom=function(a,b,c,d,e){var f=Svg.circle({x:a,y:b,r:c,fill:d,strokeWidth:2,data:e,className:"movePoint"});return this.add(f)},DOModule.drawNotizen=function(a,b,c,d,e,f){return this.add(Svg.rect({x:a,y:b,width:c,height:d,fill:e,stroke:"white",data:f,className:"movePoint"}))},DOModule.drawConnect=function(a,b,c,d,e,f){var g=c-a,h=d-b>=0?d-b:b-d,i=Math.atan2(h,g),j=Math.cos(i)*e,k=Math.sin(i)*e;d<b&&(k=-1*k),this.add(Svg.line({x1:a+j,y1:b+k,x2:c-j,y2:d-k,strokeWidth:4,color:f,className:"movePoint"}))},DOModule.addSymbol=function(a){switch(a){case"error":this.add(Svg.error());break;case"busy":this.add(Svg.busy());break;case"play":this.add(Svg.play());break;case"close":this.add(Svg.close(11));break;case"caretL":this.add(Svg.caretL());break;case"caretR":this.add(Svg.caretR())}return this},DOModule.chartSchema=function(a,b){var c=this.element.getElementsByTagName("rect");for(var d=c.length;d>0;d--){var e=JSON.parse(c[d-1].getAttribute("data"));if(!e||!b)continue;e.EAN13==b.EAN13&&this.element.removeChild(c[d-1])}var f=parseInt(b.Menge),g=0;for(var h=0;h<f&&g<=f;h++){var i=5*Chart.stepInMs/Chart.xInMs+h*Chart.stepInMs/Chart.xInMs,j=60,k=10;for(var l=0;l<a.length&&g<=f;l++){var m=i+a[l].zeit/30*Chart.stepInMs/Chart.xInMs,n=parseInt(a[l].value)*.25*30;g+=parseInt(a[l].value),g<=f&&this.add(Chart.drawRectangel(m,j-n,k,n,JSON.stringify(b),"#cc5"))}}};
