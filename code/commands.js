/**
 * Created by Marco Egbring on March 2013
 * Copyright 2013 EPha.ch. All rights reserved.
 */

var app =
{
	
	setup: function()
	{
		var buildPhonegap = (document.URL.indexOf("http://") == -1);
		
		this.model = new Model();
		
		// DEVICE PHONEGAP BUILD
		if (buildPhonegap)
		{
			this.node = new Node("https://node.epha.ch");
			this.live = true;
			this.client = "DEVICE";
			this.debug = false;
		}

		// WEBAPP LIVE
		if (!buildPhonegap && document.domain == "consilium.epha.ch")
		{
			document.domain = "epha.ch";
			
			this.node = new Node("https://node.epha.ch");
			this.konto = "http://konto.epha.ch";
			this.live = true;
			this.client = "DESKTOP";
			this.debug = true;
		}
		
		// DEVELOPMENT 
		if (!buildPhonegap && (document.domain == "10.129.144.18" || document.domain == "localhost"))
		{
			var domain = document.domain;
			
			var device_browser = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
				
			// BROWSER
			if (!device_browser)
			{
				document.domain = domain;
				this.konto = "http://" + domain + ":8888/konto";
				this.client = "DESKTOP";
			}
			// DEVICE 
			// 
			else
			{
				this.client = "DEVICE";
			}

			this.node = new Node("http://" + domain + ":8080");
			this.live = false;
			this.debug = true;
		}

		// PLUGINS
		//var svg = this.svg = DOM("svgZeit");
		//svg.chart();
		this.svg = new Svg("svgZeit");
		
		this.agent = new Agent();
			
		this.context = "CONSILIUM ->";

	},
	
	bind: function()
	{

		// HOME
		DOM("homeId").on("stage", Commands.START); 
		DOM("addOptionen").on("touch", Commands.HOME_TO_OPTIONEN);
		DOM("addEingabe").on("touch", Commands.HOME_TO_FAVORITES);
		
		// OPTIONEN
		DOM("optionenId").on("stage", Commands.OPTIONEN_INIT); 
		DOM("optionenBackButton").on("touch", Commands.OPTIONEN_TO_HOME);
		
		// FAVORITES
		DOM("favoritesId").on("stage", Commands.FAVORITES_INIT);
		DOM("favoritesBackButton").on("touch", Commands.FAVORITES_TO_HOME); 
		DOM("favoritesEditButton").on("touch", Commands.FAVORITES_CHANGE); 						
		
		// FAVORITE
		DOM("favoriteId").on("stage", Commands.FAVORITE_INIT); 
		DOM("favoriteBackId").on("touch", Commands.FAVORITE_BACK);
		DOM("favoriteEditId").on("touch", Commands.FAVORITE_CHANGE);

		// SYMPTOME
		DOM("symptomeId").on("stage", Commands.SYMPTOME_INIT); 
		DOM("symptomeBackButton").on("touch", Commands.SYMPTOME_TO_FAVORITES);
		
		// TIPP
		DOM("tippId").on("stage", Commands.TIPP_INIT); 
		DOM("tippBackButton").on("touch", Commands.TIPP_EXIT);
		
		// PHONEGAP APP
		if (this.client == "DEVICE" && this.live)
		{
			DOM().on("device", Commands.START);
			
			if (localStorage.getItem("device_version") == null) 
			{
				localStorage.clear();
				localStorage.setItem("device_version", "1.0");
			}
		}
		else 
		{
			DOM().on("ready", Commands.START);
		}
		
	},
	
	initialize: function(domain)
	{
		this.domain = domain;
		this.setup();
		this.bind();
	}

};

/** 
 * FRONTCONTROLLER PATTERN
 */
// TODO LOGGING console.log(app.domain, "->", this.callback.name, "<- properties:", this.properties, "data:", data); 
//
function createCommand( command, properties)
{
  function Command(callback, properties)
  {
    this.callback = callback;
    this.properties = properties;
    
    this.execute = function(data, log)
    {
      this.callback(data || {});
    };
  }
  
  return new Command( command, properties);
}

function addCommand( commandName, command, properties )
{  
  Commands[commandName] = createCommand( command, properties );
}

function dispatchCommand( command, data )
{
  command.execute(data);
}

function removeCommand( commandName )
{
  delete Commands[ commandName ];
}




var Commands = 
{
	// HOME
	START: createCommand(startCommand, {body: "app"}),
	HOME_TO_OPTIONEN: createCommand(changeViewCommand, {from: "homeId", to: "optionenId", direction: "right"}),
	HOME_TO_FAVORITES: createCommand(changeViewCommand, {from: "homeId", to: "favoritesId", direction: "left"}),

	HOME_INIT: createCommand(homeInitCommand, {
		id: "homeContentId", sync: "addOptionen", start: "addEingabe", intro: "rahmen", verlauf: "homeVerlauf"
	}),
	HOME_INTRO: createCommand(homeIntroCommand, {id: "homeContentId"}),
	HOME_VERLAUF: createCommand(homeVerlaufCommand, {id: "homeContentId", scroller: "homeScrollerId"}),
	HOME_VERLAUF_SELECTED: createCommand(homeVerlaufSelectedCommand, {legend: "homeAuswahlLegend", info: "homeAuswahlInfo"}),
	HOME_EXIT: createCommand(homeExitCommand),

	// OPTIONEN
	OPTIONEN_INIT: createCommand(optionenInitCommand, {id: "optionenContentId"}),
	OPTIONEN_TO_HOME: createCommand(changeViewCommand, {from: "optionenId", to: "homeId", direction: "left"}),

	// FAVORITES
	FAVORITES_INIT: createCommand(favoritesInitCommand, {id: "favoritesContentId"}),
	FAVORITES_TO_HOME: createCommand(changeViewCommand, {from: "favoritesId", to: "homeId", direction: "right"}),
	FAVORITES_CHANGE: createCommand(favoritesChangeCommand, {
		editButton: "favoritesEditButton",
		backButton: "favoritesBackButton"
	}),
	
	FAVORITES_TO_FAVORITE: createCommand(changeViewCommand, {from: "favoritesId", to: "favoriteId", direction: "left"}), 	
	FAVORITES_TO_SYMPTOME: createCommand(changeViewCommand, {from: "favoritesId", to: "symptomeId", direction: "left"}), 	
	FAVORITES_ROW: createCommand(favoritesRowCommand), 	
	FAVORITES_EDIT: createCommand(favoritesEditCommand), 	
	FAVORITES_DELETE: createCommand(favoritesDeleteCommand),
	
			
	// FAVORITE
	FAVORITE_INIT: createCommand(favoriteInitCommand, {id: "favoriteContentId", edit: "favoriteEditId"}),
	FAVORITE_BACK: createCommand(favoriteExitCommand, {type: "back"}),
	FAVORITE_CHANGE: createCommand(favoriteChangeCommand, {id: "favoriteEditId"}),
	
	HOME_TO_FAVORITE: createCommand(changeViewCommand, {from: "homeId", to: "favoriteId", direction: "left"}),
	FAVORITE_TEXT_CHANGE: createCommand(favoriteTextChangeCommand),
	FAVORITE_SAVE: createCommand(favoriteExitCommand, {type: "save"}),
	FAVORITE_DELETE: createCommand(favoriteExitCommand, {type: "delete"}),
	FAVORITE_TO_FAVORITES: createCommand(changeViewCommand, {from: "favoriteId", to: "favoritesId", direction: "right"}),
	FAVORITE_TO_HOME: createCommand(changeViewCommand, {from: "favoriteId", to: "homeId", direction: "right"}),
	FAVORITE_TO_TIPP: createCommand(changeViewCommand, {from: "favoriteId", to: "tippId", direction: "left"}),

	// SYMPTOME
	SYMPTOME_INIT: createCommand(symptomeInitCommand, {id: "symptomeContentId"}),
	SYMPTOME_TO_FAVORITES: createCommand(changeViewCommand, {from: "symptomeId", to: "favoritesId", direction: "right"}),
	
	SYMPTOME_EXIT: createCommand(symptomeExitCommand),

	// TIPP
	TIPP_INIT: createCommand(tippInitCommand, {id: "tippContentId"}),
	TIPP_EXIT: createCommand(tippExitCommand),
	
	TIPPS_SHOW: createCommand(tippsShowCommand),
	TIPP_SHOW: createCommand(tippShowCommand),
	TIPPS_SELECTED: createCommand(tippsSelectedCommand),
	TIPP_LIKED: createCommand(tippLikedCommand),
	TIPP_TO_FAVORITE: createCommand(changeViewCommand, {from: "tippId", to: "favoriteId", direction: "right"}),

	// UNCATEGORIZED
	CHANGE_VIEW: createCommand(changeViewCommand),
	REQUEST: createCommand(requestCommand),
	RESPONSE: createCommand(responseCommand),
	TAP_HANDLER: createCommand(tapHandlerCommand),
	HIDDEN: createCommand(hiddenCommand),
	SYNC: createCommand(syncCommand),
	SYNC_RESULT: createCommand(syncResultCommand),
	ROW: createCommand(rowCommand),
	INFO_START: createCommand(infoStartCommand),
	CHART_OVERLAY: createCommand(chartOverlayCommand, {id: "homeVerlauf"}),
	SCAN: createCommand(scanCommand),
	SCAN_RESULT: createCommand(scanResultCommand)
};

/** 
 * CHANGE VIEW 
 * NO EVENT DATA
 */
function changeViewCommand(event)
{
	var cmd = this.properties;
	
	// TODO API ok?
	// DOM(cmd.to).attrib("className").replace(/(top|left|right)/, "middle");
	DOM(cmd.to).replaceClass(/(top|left|right)/, "middle");
	console.log(cmd.from.split("Id").join("ContentId"));
	//DOM(cmd.from.split("Id").join("ContentId")).hide();
	DOM(cmd.from).replaceClass("middle", cmd.direction);
	
};

function hiddenCommand(data)
{
	if (!data.hidden) location.reload();
}

function startCommand(event)
{
	// CLIENTWIDTH AVAILABLE
	DOM(this.properties.body).show();

	// LOCAL STORAGE
	if (app.client == "DEVICE") dispatchCommand(Commands.REQUEST, {"request": "ACTOR_GET"});
	
	// REMOTE STORAGE
	if (app.client == "DESKTOP")
	{
		// HANDLER FOR STROAGE RESULTS
		DOM(window).on("msg", Commands.RESPONSE);

		DOM().on("window", Commands.HIDDEN, {});
		
		DOM("app").style("top", "40px");

	   // SETUP IFRAME
	  app.remote = DOM( "xauth" )
	    .konto( app.konto )
	    .on( "load", Commands.REQUEST, {"request": "ACTOR_GET"} )
	    .get("contentWindow");

	}
}

function requestCommand(data)
{
  
	if (app.client == "DEVICE")
	{
		if (data.request == "ACTOR_GET") 
		{		
			data.actor = JSON.parse(localStorage.getItem("device_actor"));
		}

		 // ACTOR RECEIVED FROM NODE VIA QR-CODE		
		if (data.request == "ACTOR_UPDATE")
		{
			var lokal = JSON.parse(localStorage.getItem("device_actor"));
			
			// TODO
			if (lokal.upToDate > data.actor.upToDate && false)
			{
				data.actor.favoritesObject = lokal.favoritesObject;			
				data.actor.customerObject = lokal.customerObject;			
				data.actor.upToDate = lokal.upToDate;
			}
		}

		if (data.request == "ACT_SAVE")
		{
			app.model.addPunkt(data.act);
						
			localStorage.setItem("device_acts", JSON.stringify(app.model.getActs()));	
		}
		
		if (data.request == "ACT_DELETE")
		{
			app.model.removePunkt(data.act);
			
			localStorage.setItem("device_acts", JSON.stringify(app.model.getActs()));	
		}
		
		
		// NO PATIENT_GET
		if (data.request == "ACTS_GET")
		{
			if (localStorage.getItem("device_acts")) 
			app.model._data["acts"] = JSON.parse(localStorage.getItem("device_acts"));		
		}
		
		if (data.request == "FAVORITES_SAVE")
		{
			localStorage.setItem("device_actor", JSON.stringify(app.model.getProtagonist()));	
		}
		// ENTITIY EVALUATION

		dispatchCommand(Commands.RESPONSE, data);
	}
	
	if (app.client == "DESKTOP")
	{

		if (data.request == "ACTOR_GET") app.remote.postMessage({request: "ACTOR_GET"}, "*");	

		if (data.request == "PATIENT_GET") app.remote.postMessage({request: "PATIENT_GET"}, "*");		
		
		if (data.request == "ACTS_GET")	app.remote.postMessage({request: "ACTS_GET", antagonistId: data.antagonistId}, "*");	
		
		if (data.request == "REDIRECT")	app.remote.postMessage({request: "REDIRECT", target: data.target}, "*");	
		
		if (data.request == "ACT_SAVE") 
		{
			app.model.addPunkt(data.act);
			
			app.remote.postMessage({request: "ACT_SAVE", 
				act: {
					protagonistId: app.model.getProtagonist().id, 		
					antagonistId: app.model.getAntagonist().id,
					entitiesId: data.act.id,
					zeit: data.act.x,
					wert: data.act.y
				}
			}, "*");
		}
		
		if (data.request == "ACT_DELETE") 
		{
			app.model.removePunkt(data.act);
						
			app.remote.postMessage({request: "ACT_DELETE", act: data.act}, "*");
		}
		
		if (data.request == "FAVORITES_SAVE")
		{
			var payload = {
				id: app.model.getProtagonist().id,
				favoritesObject: app.model.getProtagonist().favoritesObject
			};
			
			app.remote.postMessage({request: "FAVORITES_SAVE", protagonist: payload}, "*");				
		}
		
		if (data.request == "ENTITY_EVALUATION")
		{
			app.remote.postMessage({request: "ENTITY_EVALUATION", tipp: data.tipp}, "*");
		}
	}
}

function responseCommand(data)
{
	if (app.client == "DEVICE")
	{
		if (data.request == "ACTOR_GET") 
		{
			// DEFAULT OR REAL ACTOR AVAILABLE
			app.model.setProtagonist(data.actor);			
			
			localStorage.setItem("device_actor", JSON.stringify(app.model.getProtagonist()));
			
			dispatchCommand(Commands.REQUEST, {request: "ACTS_GET", antagonistId: app.model.getProtagonist().id});
		}
		
		if (data.request == "ACTOR_UPDATE")
		{
			app.model.setProtagonist(data.actor);
			
			localStorage.setItem("device_actor", JSON.stringify(app.model.getProtagonist()));
			
			app.model.setIntro(data.actor.scope);
			
			dispatchCommand(Commands.OPTIONEN_INIT, {status: "Erfolgreich", initialize: true});
		}
		
		if (data.request == "ACTS_GET") 
		{			
			app.model.addActs(data.json);

			dispatchCommand(Commands.HOME_INIT);		
		}
		
		if (data.request == "ENTITY_EVALUATION")
		{
			dispatchCommand(Commands.TIPP_SHOW, data.tipp);
		}
	}

	if (app.client == "DESKTOP")
	{
		if (data.request == "ACTOR_GET") 
		{
			// DEFAULT OR REAL ACTOR AVAILABLE		
			app.model.setProtagonist(data.actor);
			
			if (app.model.isArzt())
			dispatchCommand(Commands.REQUEST, {request: "PATIENT_GET"});
			
			// DEFAULT PROTAGONIST IS PATIENT
			if (app.model.isPatient() && data.actor)
			{
				DOM("titleId").text(data.actor.scopeLabel);
				DOM("titleId").style("position", "absolute");
				DOM("titleId").style("left", "20px");

				dispatchCommand(Commands.REQUEST, {request: "ACTS_GET", antagonistId: data.actor.id});
			}

			if (!data.actor)
			{
				app.model.setIntro("INTRO");
				
				dispatchCommand(Commands.HOME_INIT);
			}			
		}
		
		if (data.request == "ACTS_GET"){
			// model
			app.model.addActs(data.json);

			dispatchCommand(Commands.HOME_INIT);
		}
		
		if (data.request == "PATIENT_GET") 
		{	
			app.model.setAntagonist(data.patient);
			
			if (app.model.hasAntagonist())
			{
				// Profiles displayName
				DOM("titleId").text(data.patient.roleLabel);
				DOM("titleId").style("position", "absolute");
				DOM("titleId").style("left", "20px");
				
				dispatchCommand(Commands.REQUEST, {request: "ACTS_GET", antagonistId: data.patient.id});
			}
			
			if (!app.model.hasAntagonist())
			dispatchCommand(Commands.REQUEST, {request: "REDIRECT", target: "Akte"})
		}

		if (data.request == "REDIRECT") location.replace(data.target);
		
		if (data.request == "REFRESH") location.reload(); // dispatchCommand(Commands.START); SONST IFRAME BLEIBT UND DATEN
	}

	// SAME FOR DEVICE AND DESKTOP
	if (data.request == "FAVORITES_SAVE") dispatchCommand(Commands.SYMPTOME_TO_FAVORITES);
}


function homeInitCommand(event)
{
	// LOAD DATA INTO MEMORY	
	if (event.introExit){

		app.model.setIntro(null);

		if (app.client == "DEVICE")
		localStorage.setItem("device_actor", JSON.stringify(app.model.getProtagonist())); 
		
		DOM(this.properties.id).removeChilds();
	}

	// CLIENTWIDTH
	DOM(this.properties.id).show();

	if (app.model.getIntro())
	{
		DOM(this.properties.sync).hide();
		DOM(this.properties.start).hide();
		
		dispatchCommand(Commands.HOME_INTRO);
	}
	else
	{
		// SYNC BUTTON
		(app.client == "DEVICE") ? DOM(this.properties.sync).show() : DOM(this.properties.sync).hide();
		
		// START BUTTON
		DOM(this.properties.start).show();
		
		dispatchCommand(Commands.HOME_VERLAUF); 
	}
	
	//TODO show hide addOptionen
}

function homeIntroCommand(event)
{	

  var div = DOM(this.properties.id).removeChilds().add("div", { "class": "intro" });

	var type = "";
	
	if (app.model.getIntro() == "INTRO" && app.model.isPatient() && app.client == "DESKTOP") type = "DESKTOP";
	
	if (app.model.getIntro() == "INTRO" && app.client == "DEVICE") type = "DEVICE";
	
	if (app.model.getIntro() == "GRUPPE B" && app.model.isPatient()) type = "Gruppe B"; 

	if (app.model.getIntro() == "GRUPPE C" && app.model.isPatient()) type = "Gruppe C"; 

	if (app.model.dict.Intro[type])
	{		
		div.add("p", {}, app.model.dict.Intro[type].title);
		
		for (var i = 0; i < app.model.dict.Intro[type].bausteine.length; i++)
		{
			div.add("p", {}, app.model.dict.Intro[type].bausteine[i]);		
		}
	
		div.add("a", {
			"id": "introCloseId",
			"class": "button-action blue",
			"style": "width:200px; height:40px"
			// TODO support events here? then we can remove the id and attach the event directly
		}, "Schliessen")
		.on("touch", Commands.HOME_INIT, {introExit: true});
		
	}
}

function homeVerlaufCommand(data)
{
	var scrollerId = this.properties.scroller;
	
	// TODO question DOM.element is public api?
	if (!DOM(scrollerId).element)
	{
		DOM(this.properties.id)
		  .add("div", {id: "homeVerlauf"})
		  .add("div", {id: "chart", "class": "chart"})
		  .add("div", {
		    id: scrollerId,
		    "class": "scrollableX"
		  }).on("touch", Commands.INFO_START, {id: scrollerId}); 
		
		app.svg.setContainer(scrollerId);
	}
	
	(!DOM("homeForm").element) ? DOM("homeVerlauf").add("form", {id: "homeForm"}) : DOM("homeForm").removeChilds();
	
	var fieldsetAuswahl = DOM("homeForm").add("fieldset", {id: "fieldsetAuswahl"});
	fieldsetAuswahl.add("legend", {id: "homeAuswahlLegend"});
	fieldsetAuswahl.add("div", {id: "homeAuswahlInfo"});
	fieldsetAuswahl.hide();

	app.model.sortPunkteByTime();
	
	app.svg.refresh();

	dispatchCommand(Commands.HOME_VERLAUF_SELECTED);
}

function homeVerlaufSelectedCommand(event)
{
	var cmd = this.properties;

	/* RESET */
	DOM(cmd.info).removeChilds().text("");

	/* FIGUR SELECTED */
	if (event.id)
	{		
		var type = app.model.getType(event.id);

		var value = event.y + "%";
		var detail = ""; 
		
		if (type.kategorie == "Notizen")
		{
			value = "&nbsp;";
			detail = event.y.replace(/\n\r?/g, "<br />");
		}
		
		if (type.kategorie == "Bewertung")
		{
			value = event.y + " " + type.unit;
			detail = "<b>Definition</b> " + app.model.getGrad(event.id, event.y).info;
		}
		
		if (type.kategorie == "Device")
		{
			var json = (typeof event.y == "string") ? JSON.parse(event.y) : event.y;
			
			if (event.id == "stepcounter")
			{
				value = json["step"] + " " + type.unit;			
				detail = "<b>Definition</b> Messung mittels Device";
				detail += "<br>Entfernung: " + json["km"] + "km";
				detail += "<br>Kalorien: " + json["kcal"] + "kcal";
				detail += "<br>Ex: " + json["ex"];
				detail += "<br>Zeitraum: " + json["sportTime"] + "min";
			}
			else if (event.id == "bp")
			{			
				value = json["systolic"] + " " + type.unit;			
				detail = "<b>Definition</b> Messung mittels Device";
				detail += "<br>Sys: " + json["systolic"] + "mmHg";
				detail += "<br>Dia: " + json["diastolic"] + "mmHg";
				detail += "<br>Pulse " + json["pulse"] + " Pulse";
			}
			else
			{
				// event.y {weight:50}
				value = json[event.id] + type.unit;				
				detail = "<b>Definition</b> Messung mittels Device";
			}
		}
		
		if (type.kategorie == "Symptom")
		{
			value = event.y + " " + type.unit;
			detail = "<b>Definition</b> " + app.model.getGrad(event.id, event.y).info;
		}
		
		/* LEGEND */
		DOM(cmd.legend).text(type.kategorie); 				

		/* CURRENT ITEM */
		var exportData = JSON.stringify({x: event.x, y: event.y, id: event.id, command: Commands.FAVORITE_TO_HOME});
		
		/* ROW */
		var row = DOM(cmd.info).add("div", {id: "homeRowDiv", style: "cursor:pointer;padding:5px;", data: exportData});
		
		/* MAY PROCEED TO EDIT IF */
		var caret = (type.kategorie == "Symptom" || type.kategorie == "Bewertung" || event.id == "privat");
		if (caret)
		{	// GOTO EDIT
			row.on("tap", Commands.TAP_HANDLER, {watch: "id:homeRowDiv", command: Commands.HOME_EXIT});			
		}
		dispatchCommand(Commands.ROW, {
			type: "legende", area: row, title: type.title, zeit: "am " + util.zeit("dd.mm.yyyy hh:mm", event.x),
			farbwert: type.farbwert, value: value, caret: caret
		});			
		
		/* DETAIL */
		DOM(cmd.info).addChild("p", {"class": "row_detail"}, detail);	
		
		// SMALL SCREEN HAS OVERLAY IN TIMELINE
		if (window.matchMedia("(orientation:landscape) and (max-device-width:768px)").matches) 
		{		
			dispatchCommand(Commands.CHART_OVERLAY, {
				type: "row", title: type.title, zeit: "am " + util.zeit("dd.mm.yyyy hh:mm", event.x),
				farbwert: type.farbwert, value: value
			});
		}
	}
	else
	{
		/* DEFAULT */
		DOM(cmd.legend).text("Legende"); 
		DOM(cmd.info).text("Berühren Sie die Datenpunkte in der Timeline für detaillierte Informationen.");
	}
	
	/* DISPLAY */
	DOM("fieldsetAuswahl").show();	
}

function infoStartCommand(event)
{
	if (app.model.getActs().length == 0)
	{
		dispatchCommand(Commands.CHART_OVERLAY, {
		  type: "paragraph",
		  title: "Die Eingabe beginnen Sie über den rechten oberen 'Start' Button."
		});
	}
}

/**
 * 
 * @param event 
 * @returns
 */
function chartOverlayCommand(e)
{
	if (!DOM("chartOverlayId").element)
	{
		var centeredId = DOM(this.properties.id)
  		.add("div", {id: "chartOverlayId", "class": "overlay"})
  		.add("div", {"class": "block"})
  		.add("div", {id: "centeredId", "class": "centered"});
		
		if (e.type == "row") centeredId.add("div", {id: "overlayRowId", style: "text-align:left"});

	  if (e.type == "paragraph") centeredId.add("div", {id: "overlayRowId", style: "text-align:center"});

		dispatchCommand(Commands.ROW, {
			type: "legende", area: "overlayRowId", title: e.title, zeit: e.zeit, farbwert: e.farbwert, value: e.value
		});
		
		if (e.type == "paragraph") centeredId.html("<p>" + e.title + "</p>");	
		
		var show = setTimeout(function(){centeredId.addClass("zoomIn");}, 0);		
		var hide = setTimeout(function(){DOM("chartOverlayId").removeChilds();}, 3000);
	}
}

function homeExitCommand(event)
{
	app.model.setStateSymptom(event);
	
	dispatchCommand(Commands.HOME_TO_FAVORITE);
}

function tapHandlerCommand(event)
{
	this.properties = this.properties || {};
	// HANDLE INCOMING TAP EVENTS
	switch(event.type)
	{
		case("start"):
		{
			var element = event.element; 
			this.properties.startX = event.startX;	
			this.properties.startY = event.startY;	
			
			if (element) 
	        {
	        	element.className = "selected"; this.properties.element = element; 
	        }
			break;
		}
		case("move"):
		{		
	        if (Math.abs(event.clientX - this.properties.startX) > 6 || Math.abs(event.clientY - this.properties.startY) > 6) 
	        {
	        	if (this.properties.element){this.properties.element.className = ""; this.properties.element = null;}
		    }
			this.properties.startX = event.clientX;	
			this.properties.startY = event.clientY;	
			break;
		}
		case("end"):
		{
	        if (this.properties.element) 
	        {
            	dispatchCommand(event.command, JSON.parse(this.properties.element.getAttribute("data")));
	        } 
	        this.properties = null; 
	        break;
		}
		case("cancel"): {this.properties = null; break;}
	}
}

function tippsShowCommand(event)
{				
	// CLEAN IF NECESSARY
	var fieldsetTipp = (DOM("fieldsetTipp").element) ? DOM("fieldsetTipp").removeChilds() : DOM("favitFormId").add("fieldset", {id: "fieldsetTipp"});		

	// BASIC SETUP
	fieldsetTipp.add("legend", {}, "Empfehlungen");
	fieldsetTipp.add("ul", {"class": "listeNext", id: "homeTipps"})
	  .on("tap", Commands.TAP_HANDLER, {watch: "tagName:LI", command: Commands.TIPPS_SELECTED});
	
	fieldsetTipp.hide();	

	var temp = app.model.getStateTemp();
	
	var tipps = app.model.getEmpfehlungen({type: temp.id, value: temp.y, key: temp.x});

	//OLD Array bausteine:Array, dislikes, id, kategorie, likes, title
	
	for (var i = 0; i < tipps.length; i++)
	{
		dispatchCommand(Commands.REQUEST, {"request": "ENTITY_EVALUATION", "tipp": tipps[i]});
	}
}

function tippShowCommand(tipp)
{
	var item1 = DOM("homeTipps").add("li", {style: "padding-top:5px;padding-bottom:5px;", data: JSON.stringify(tipp)});
	
	item1.add("span", {style: "padding-top:10px; padding-right:30px;"}, "<b>" + tipp.title + "</b>");	
	item1.add("br");	
	item1.add("span", {style: "font-size:90%;margin:1px;float:left;"}, "<i>" + tipp.kategorie + "</i>");				
	item1.add("div", {"class": "row_caret", style: "top:16px;"}).add(Assets.caret());
	
	// Community Bewertung
	if ((tipp.likes + tipp.dislikes) > 0)
	{
		item1.add("span", {style: "position:absolute; top:6px; right:18px; font-size:90%"}, "<i>Empfohlen</i>");				
		item1.add("span", {style: "position:absolute; top:23px; right:18px; font-size:90%"}, "<i>" + likes + " von " + (likes + dislikes) + "<i>");		
	}
	
	DOM("fieldsetTipp").show();
}

function tippsSelectedCommand(event)
{
	app.model.setStateTipp(event);
	dispatchCommand(Commands.FAVORITE_TO_TIPP);
}



function tippInitCommand(data)
{
	DOM(this.properties.id).removeChilds();
	
	//"data":{"type":"10015090","value":"90","key":1363265891430},
	//"tipp":{"id":"info1","title":"Nelkenwasser","kategorie":"Selbsthilfe","likes":1,"dislikes":0,"displayed":0,"clicked":0,"bausteine":[{"Häufigkeit":"Mundspülung mit Nelkenwasser 2-3 mal pro Tag"},{"Zubereitung":"Kochen Sie hierfür ein paar Gewürznelken in Wasser auf und lassen Sie das Wasser abkühlen."}]}} 
	var tipp = app.model.getStateTipp();

	var tippFieldset = DOM(this.properties.id)
	  .show()
	  .add("form")
	  .add("fieldset", {id: "tippFieldsetId"});
	
	tippFieldset.add("legend", {}, tipp.kategorie);
	var tipArea = tippFieldset.add("div");
	
	tipArea.add("p", {style: "width:100%;"}, "<b>" + tipp.title + "</b>");

	var bausteine = tipp.bausteine;
	// Bausteine
	for (var i = 0; i< bausteine.length; i++)
	{		
		var baustein = bausteine[i];
		
		for (var typus in baustein)
		{
		  tipArea.add("p", {style: "width:100%;padding-top:10px"}, "<i>" + typus + ":</i> " + baustein[typus]);	
		}
	}
	
	if (!app.model.trackPunktLikedOrNotExists())
	{
	  tipArea.add("a", {id: "tipAreaSuccess", style: "float:left;", "class": "button-action green"}, "Erfolgreich")
	    .on("touch", Commands.TIPP_LIKED, {liked: true});
	  
		tipArea.add("a", {id: "tipAreaNoSuccess", style: "float:right;", "class": "button-action grey"}, "Nicht erfolgreich")
		  .on("touch", Commands.TIPP_LIKED, {liked: false});
	}
	
	app.model.trackPunktTipp("clicked");
}

function tippLikedCommand(data)
{
	app.model.setTipp(data);
	
	dispatchCommand(Commands.TIPP_EXIT);
}

function tippExitCommand(data)
{
	app.model.setStateTipp(null);
	
	dispatchCommand(Commands.TIPP_TO_FAVORITE);
}

function optionenInitCommand(data)
{
	var optionen = DOM(this.properties.id).removeChilds();
	
	/* VERBINDUNG */
	var optionenForm = optionen.add("form"),
	    fieldsetVerbindung = optionenForm.add("fieldset", {style: "text-align:left;"});
	
	fieldsetVerbindung.add("legend", {}, "Verbindung");
	var optStatus = fieldsetVerbindung.add("div");
	
	optStatus.add("span", {}, "<b>Mit Brustzentrum</b>");
	optStatus.add("br");
	
	if (app.model.getProtagonist().id > 0)
	{
	  optStatus.add("span", {style: "color:green; font-size:90%"}, (data.status) ? "<i>" + data.status + "</i>" : "&nbsp;");
	  optStatus.add("a", {style: "position:absolute;top:6px;right:2px;color:darkblue"}, "Verbunden");

		// SYNC
		var fieldsetSync = optionenForm.add("fieldset", {style: "text-align:left;"});
		fieldsetSync.add("legend", {}, "Synchronisation")
		var optSync = fieldsetSync.add("div");
		
		if (localStorage.getItem("device_upToDate")	)
		{
		  optSync.add("span", {}, "<b>Zuletzt</b>");
			optSync.add("br");
			optSync.add("span", {style: "font-size:90%"}, "<i>" + util.zeit("dd.MM.yyyy hh:mm", parseInt(localStorage.getItem("device_upToDate"))) + "</i>"); 					
		}
		else
		{
		  optSync.add("span", {}, "<b>Initialisierung</b>");
			optSync.add("br");
			optSync.add("span", {style: "font-size:90%"}, "<i>&nbsp;</i>");
		}
		// TODO support CSS selectors
		var actionBlue = optSync.add("a", {"class": "button-action blue", style: "position:absolute;top:6px;right:2px;"}, "Sync")
		  .on("touch", Commands.SYNC, {status: "START"});
	}
	else
	{
	  optStatus.add("span", {style: "color:red; font-size:90%"}, (data.status) ? "<i>" + data.status + "</i>" : "&nbsp;");
	  optStatus.add("a", {"class": "button-action blue", style: "position:absolute;top:6px;right:2px;"}, "Verbinden")
		  .on("touch", Commands.SCAN, {});
	}

	optionen.show();	
}

function scanCommand(data)
{
	if (app.debug)
	{
		dispatchCommand(Commands.SCAN_RESULT, {text: "VAXX2", format: "QR_CODE", cancelled: false});
	}
	else
	{		
		var scanner = cordova.require("cordova/plugin/BarcodeScanner");
	
		scanner.scan(
		      function(result) 
		      { 
		    	  dispatchCommand(Commands.SCAN_RESULT, {text: result.text, format: result.format, cancelled: result.cancelled});
		      }, 
		      function(error) 
		      { 
		    	  dispatchCommand(Commands.SCAN_RESULT, {error: ex.message});
		      }
		);
	}

}

/**
 * event {result: "", format: "QR_CODE", error: "message"}
 * @param event
 */
function scanResultCommand(data)
{		
	
	if (data.format == "QR_CODE")
	{			
		function success(payload) 
		{
			dispatchCommand(Commands.REQUEST, {request: "ACTOR_UPDATE", actor: payload});
		}
		
		function error(message)
		{			
			dispatchCommand(Commands.OPTIONEN_INIT, {status: "Autorisierung unbekannt"});
		}
		
		app.node.readActorByRequestToken(data.text, success, error);
	}
	else
	{
		dispatchCommand(Commands.OPTIONEN_INIT, {status: "Autorisierung fehlgeschlagen"});
	}
}


// ONLY DEVICE AND PATIENT CAN CALL
// TODO SERVER NOT AVAIABLE
function syncCommand(event)
{
	// UPDATE ACTS FROM REMOTE SINCE LAST UPDATE
	if (event.status == "START")
	{		
		var antagonistId = app.model.getProtagonist().id;
		
		app.node.listActsForAntagonistId(antagonistId, localStorage.getItem("device_upToDate"), 
				
			function(payload)
			{
				dispatchCommand(Commands.SYNC_RESULT, {status: "START", json: payload});
			}, 
			function(error) 
			{
				dispatchCommand(Commands.OPTIONEN_INIT, {status: "Synchronisierung fehlgeschlagen"});
			}
		);
	}
	
	if (event.status == "ACTS")
	{
		var acts = app.model.getActs();
			
		var counter = 0;
		
		for (var i = 0; i < acts.length; i++)
		{		
			if (!acts[i].id)
			{		
				counter++;		

				var act = {};
				
				act.protagonistId = app.model.getProtagonist().id ;
				act.antagonistId = app.model.getProtagonist().id;
				act.entitiesId = acts[i].entitiesId;
				act.zeit = acts[i].zeit;
				act.wert = acts[i].wert;
				
				app.node.createAct(act, 
					function(payload)
					{
						dispatchCommand(Commands.SYNC_RESULT, {status: "ACTS", act: act, json: payload});
						
						counter--;
						
						if (counter == 0) dispatchCommand(Commands.SYNC_RESULT, {status: "ACTS"});
					}, 
					function(message)
					{
						console.log(message);
					}
				);
			}
		}			
		if (counter == 0) dispatchCommand(Commands.SYNC_RESULT, {status: "ACTS"});
	}
}

function syncResultCommand(data)
{
	if (data.status == "START")
	{
		app.model._data.acts = app.model._data.acts.concat(data.json);
		
		localStorage.setItem("device_acts", JSON.stringify(app.model._data.acts));
				
		dispatchCommand(Commands.SYNC, {status: "ACTS"});
	}
	
	if (data.status == "ACTS")
	{				
		localStorage.setItem("device_upToDate", util.zeit());			

		if (data.act && data.json)
		{
			app.model.updateActWithId(data.act, data.json.insertId);
			
			if (app.model.getActs().length > 0)
			localStorage.setItem("device_acts", JSON.stringify(app.model._data.acts));
			
		}
		// ENDE BATCH QUERY
		else dispatchCommand(Commands.OPTIONEN_INIT);
	}
	
}


/**
 * SYMPTOME INIT
 * @param data.id -> ContentId
 * @param data.liste -> ListeId
 */
function symptomeInitCommand(data)
{
	  var symptome = DOM(this.properties.id),
	      symFormId = symptome.removeChilds().add("form");
	
	  var symFieldset = symFormId.add("fieldset");
	  symFieldset.add("legend", {}, "Symptome");
	  var symptomeListe = symFieldset.add("ul", {"class": "listeNext"});
	
  	var items = app.model.getSymptome();
  	
  	for (var i = 0; i < items.length; i++)
  	{
  	  // TODO: html5 data attrib needs to be data-<something>
  		var item = symptomeListe.add("li", { data: items[i].id, style: "padding-top:10px;padding-bottom:10px;"});
  		
  		item.add("span", {"class": "row_antiCaret", style: "top:13px; left:-3px;"}).add(Assets.antiCaret());
          
  		item.add("span", {"class": "row_title", style: "display:block;padding-left:10px;padding-right:25px;"}, "<b>" + items[i].title + "</b>");
  		item.add("span", {"class": "row_value", style: "top:10px;padding-top:3px;padding-bottom:3px;background:" + items[i].farbwert}, "&nbsp;");
  		//item.add("span", {style: "position:absolute; white-space:nowrap; top:25px; left:60px;"}, "<i>" + items[i].sub + "</i>");		
  	}	
  	symptomeListe.on("tap", Commands.TAP_HANDLER, {watch: "tagName:LI", command: Commands.SYMPTOME_EXIT});
  	symptome.show();
}

function symptomeExitCommand(event){
		
	app.model.addFavorite("Symptome", event); 
	
	dispatchCommand(Commands.REQUEST, {request: "FAVORITES_SAVE"});
}

function favoritesChangeCommand(data)
{	
  var edit = !app.model.getStateFavEdit();
	
	if (edit)
	{
		DOM(this.properties.editButton).text("Fertig").replaceClass("colorless", "grey");
		DOM(this.properties.backButton).hide();
		app.model.setStateFavEdit(true);
	}
	else
	{
		DOM(this.properties.editButton).text("Ändern").replaceClass("grey", "colorless");		
		DOM(this.properties.backButton).show();
		app.model.setStateFavEdit(false);
	}
	
	dispatchCommand(Commands.FAVORITES_INIT);		
}

/**
 * FAVORITES BUILD FORM
 * @param data {id: "viewContentId", edit: true}
 */
function favoritesInitCommand(data)
{
  var liste, fieldset;
  
	var favForm = DOM(this.properties.id).removeChilds().add("form");
    
	for (var favorite in app.model.getFavorites())
	{
		fieldset = favForm.add("fieldset");
		fieldset.add("legend").text(favorite);

		liste = fieldset.add("ul", {"class": "listeNext"});

		if (!app.model.getStateFavEdit())
		{
			liste.on("tap", Commands.TAP_HANDLER, {
			  watch: "tagName:LI",
			  command: Commands.FAVORITES_EDIT
			});
		}
    // console.log(favorite, app.model.getFavorites(favorite));
		
    if ((app.model.getStateFavEdit() && app.model.hasFavoriteEdit(favorite) || app.model.getFavorites(favorite).length == 0))
    {	
        dispatchCommand(Commands.FAVORITES_ROW, {row: {}, display: liste});
    }
		
		for (var i = 0; i < app.model.getFavorites(favorite).length; i++)
		{
			dispatchCommand(Commands.FAVORITES_ROW, {row: app.model.getFavorites(favorite)[i], display: liste });		
		}
	}

	favForm.show();	
}

/**
 * FAVORITES CREATE LIST ITEM
 * @param data {id: "typeId", display: "listElement"}
 */
function favoritesRowCommand(data)
{	
	// TODO Sync with homeVerlaufCommand
	var infoData = app.model.getPunkt(data.row.entitiesId);
	var infoType = app.model.getType(data.row.entitiesId);
	var zeitpunkt = (infoData && !data.edit) ? "Zuletzt: " + util.zeit("dd.mm.yyyy hh:mm", infoData.zeit) : "&nbsp;";
	
	var title = (infoData) ? infoData.wert + "%" : "&nbsp;";
	
	if (infoType && infoType.kategorie == "Notizen") 
	{
		title = "&nbsp;";
	}
	
	if (infoType && infoType.kategorie == "Device" && infoData)
	{
		if (typeof infoData.wert == "string") infoData.wert = JSON.parse(infoData.wert);

		if (data.row.entitiesId == "weight")		  title = infoData.wert["weight"] + infoType.unit;
		if (data.row.entitiesId == "stepcounter") title = infoData.wert["step"] + infoType.unit;
		if (data.row.entitiesId == "bp"	) 			  title = infoData.wert["systolic"] + infoType.unit;	
	}
	
	if (infoType && infoType.kategorie == "Bewertung" && infoData)
	{
		title = infoData.wert + infoType.unit;
	}

	// TODO: data is not valid html5 use data-<foo>
	// DOM maybe not needed here as it might already be an instance of DOM
  var item = DOM(data.display).add("li", {
	  data: JSON.stringify({punkt: infoData, type: infoType}), // TODO: infoType is undefined sometimes (model bug)?
	  style: "padding-top:10px;padding-bottom:10px;"
	});
	
	// KEIN EDIT-MODE
	if (!app.model.getStateFavEdit())
	{		
		if (data.row.entitiesId)
		{			
			// Bewertung, Symptom, Notiz
			dispatchCommand(Commands.ROW, {type: "legende", area: item, title: infoType.title, zeit: zeitpunkt, farbwert: infoType.farbwert, value: title, caret: true})			
		}
		else
		{	// Neues Symptom mit Caret
			dispatchCommand(Commands.ROW, {type: "legende", area: item, title: "Neues Symptom", zeit: "Zur Liste hinzufügen", caret: true})			
		}
	}
	// EDIT-MODE
    else
	{
    	if (!data.row.entitiesId)
    	{	// Neues Symptom ohne Caret und Button
    		dispatchCommand(Commands.ROW, {type: "legende", area: item, title: "Neues Symptom", zeit: "Zur Liste hinzufügen", caret: false});		

    		item.add("a", {"class": "button blue", style: "position:absolute; right:2px; top:10px; font-size:100%"})
    		  .text("Plus")
    			.on("touch", Commands.FAVORITES_TO_SYMPTOME);
    	}
    	else if (data.row.edit)
    	{	// Bestehendes Symptom aus Favoritenliste
    		dispatchCommand(Commands.ROW, {type: "legende", area: item, title: infoType.title, zeit: "Von Liste entfernen", caret: false});  		
    		
    	  item.add("a", {"class": "button red", style: "position:absolute; right:2px; top:10px; font-size:100%"})
    	    .text("Minus")
    	    .on("touch", Commands.FAVORITES_DELETE, {type: "Symptome", item: {id: data.row.id}}); 		
    	}
	}
	
}

/**
 * Generate Row Parts
 * @param data {type, area, title, zeit, farbwert, value}
 */
function rowCommand(data)
{
  var area = DOM(data.area);
	if (data.type == "legende")
	{
	  area.add("span", {"class": "row_title"}).html("<b>" + data.title + "</b>");
	  area.add("br");	
		
		if (data.zeit)      area.add("span", {"class": "row_zeit"}).html("<i>" + data.zeit + "</i>");	
		if (data.farbwert)  area.add("a", {"class": "row_value", style: "background:" + data.farbwert}).html(data.value);			
		if (data.caret)     area.add("div", {"class": "row_caret"}).add(Assets.caret());	
	
	}
}

function favoritesDeleteCommand(data)
{   
	app.model.removeFavorite(data.type, data.item);
	
	dispatchCommand(Commands.FAVORITES_INIT);
}

/**
 * FAVORITES LIST ITEM UP 
 * @param data {TODO}
 */
 
function favoritesEditCommand(data)
{		

	if (data.type.kategorie == "Device")
	{
		
		var type = data.type.id;
		var bis = (data.punkt) ? data.punkt.zeit : null;
		
		var model = app.model;
		
		// TODO ECHTE ID AUS FAVORITEN AUSLESEN
		app.node.getDevice(36, type, bis, model.getProtagonist().id, model.getAntagonist().id,
			function(payload) 
			{
				model.addActs(payload);
				
				dispatchCommand(Commands.FAVORITES_INIT);
			}, 
			function(msg){ console.log(msg); } 
		);
		
		return;
	}
	
	var value = {};
	
	if (!data.type)
	{
		dispatchCommand(Commands.FAVORITES_TO_SYMPTOME);
		return;
	}
	
	value.id = data.type.id;
	
	if (data.punkt)
	{
		value.y = data.punkt.wert;
		value.x = data.punkt.zeit;
	}
	else
	{
		value.y = data.type.zero;
	}

	value.command = Commands.FAVORITE_TO_FAVORITES;
	
	app.model.setStateSymptom(value);
	
	dispatchCommand(Commands.FAVORITES_TO_FAVORITE);		
}

/**
 * 
 * @param data, forceNoEdit (onExit)
 * @param forceNoEdit
 */
function favoriteChangeCommand(event)
{	

	if (app.model.getStateFavitEdit() || event.exit)
	{
		DOM(this.properties.id).text("Löschen").replaceClass("grey", "colorless");
	}
	else
	{
		DOM(this.properties.id).text("Fertig").replaceClass("colorless", "grey");					
	}
	
	(event.exit) ? app.model.setStateFavitEdit(false) : app.model.setStateFavitEdit(!app.model.getStateFavitEdit());	
	
	if (!event.exit) dispatchCommand(Commands.FAVORITE_INIT);
}

/**
 * FAVORITE INIT
 * @param data 
 * this.properties {id: "ContentId"}
 */
function favoriteInitCommand(data)
{
  var favorite = DOM(this.properties.id);
  // , {id: "favoriteContentId", edit: "favoriteEditId"}
  
	// ITEM TO MODIFY
	var item = app.model.getStateSymptom(); 
	
	// LEGENDE LABEL
	var kategorie = app.model.getType(item.id).kategorie;
		
	// PERSIST NEW ITEM TO MODEL
	app.model._state.tempItem = {y: item.y, id: item.id};

	// ITEM NOT SPECIFIED THAN GET LAST
	var last = "&nbsp;";
	
	if (app.model.getPunkt(item.id))
	{
		last = (!item.x) ? "<i>Zuletzt: " + util.zeit("dd.mm.yyyy hh:mm", app.model.getPunkt(item.id).x) + "</i>" : "<i>am " + util.zeit("dd.mm.yyyy hh:mm", item.x) + "</i>";
	}
	
	// EDITABLE EVENT
	if (item.x)	DOM(this.properties.edit).show();
	else		    DOM(this.properties.edit).hide();
	
	// NOW CLIENTWIDTH AVAILABLE
	favorite.removeChilds().show(); 
	
	removeCommand(Commands.SLIDER, sliderCommand);
	removeCommand(Commands.DATE, dateCommand);
    	
	// FORM
	var favitForm = favorite.add("form", {id: "favitFormId"}),
	    favitZeit = favitForm.add("fieldset"),
	    favitZeitLegend = favitZeit.add("legend");
	
	// ZEITPUNKT EDITING
	if (app.model.getStateFavitEdit()) 
	{
		favitZeit.set('disabled', true);
		favitZeitLegend.text("Zeitpunkt");
	}
	// ZEITPUNKT EDITING NO
	if (!app.model.getStateFavitEdit())
	{
		if (kategorie == "Device")    favitZeitLegend.text("Zeitraum");
		if (kategorie == "Bewertung") favitZeitLegend.text("Neuer Zeitpunkt");
		if (kategorie == "Symptom")   favitZeitLegend.text("Neuer Zeitpunkt");
		if (kategorie == "Notizen")   favitZeitLegend.text("Neuer Zeitpunkt");
	}	
	favitZeit.add("div", {id: "zeitArea"});		
	
	// SYMPTOM
	var favoriteFieldset = favitForm.add("fieldset");
	favoriteFieldset.add("legend", {}, kategorie); // TODO replace with .text(kategorie) or .html(kategorie)
	var favArea = favoriteFieldset.add("div");
	favArea.add("span", {
	  style: "width:100%; padding-right:80px;"
	}).html("<strong>" + app.model.getType(item.id).title + "</strong>");

	// EINTRAG AM ODER ZULETZT
	favArea.add("p", {id: "favitZeitLabel", style: "width:100%;font-size:90%;margin:1px"}, last);		

	// TEXTAREA IF NOTIZ
	if (kategorie == "Notizen")
	{
	  favArea.add("textarea", {id: "favTextareaId", style: "font-size:100%;width:100%; height:200px;padding:3px;-webkit-user-select: text;", name: "notizEintrag", placeholder: "Text eingeben"}, item.y);
	  favArea.add("div", {id: "favitReseter"});
		DOM("favitReseter").add("a", {id: "favitReseterLink", "class": "button-action grey", style: "float:left;"}, "Neuer Text");
		DOM("favitReseterLink").on("touch", Commands.FAVORITE_TEXT_CHANGE, {action: "favitActions", type: "reset", reseter: "favitReseter"});
		DOM("favTextareaId").on("change", Commands.FAVORITE_TEXT_CHANGE, {action: "favitActions", reseter: "favitReseter"});
	}
	
	if (kategorie == "Symptom" || kategorie == "Bewertung" || kategorie == "Device")
	{
	  favArea.add("span", {id: "favOutputId", style: "position:absolute; top:10px; right:2px; font-size:110%"}, item.y + app.model.getType(item.id).unit);				
	}


	// SLIDER 
	favArea.add("div", {id: "sliderArea"});	
	
	// DEFINITION DER KATEGORIE
	if (!app.model.getStateFavitEdit() && kategorie != "Notizen")
	{
		var grad = app.model.getGrad(item.id, item.y);
		
		if (grad) favArea.add("p", {id: "favGradId", style: "width:100%;padding-top:5px;"}, "<b>Definition: </b>" + grad.info);
	}
	
	// SAVE AND CANCEL
	favArea.add("div", {id: "favitActions"});		
	DOM("favitActions").add("a", {id: "favitSaveId", "class": "button-action blue", style: "float:left;"}, "Erstellen");
	DOM("favitSaveId").on("touch", Commands.FAVORITE_SAVE);
	DOM("favitActions").add("a", {id: "favitCancelId", "class": "button-action grey", style: "float:right;"}, "Abbrechen");
	DOM("favitCancelId").on("touch", Commands.FAVORITE_INIT);
	DOM("favitActions").hide();


	addCommand("DATE", dateCommand, {parent: "zeitArea", actions: "favitActions", zeit: "favitZeitLabel", edit: this.properties.edit});

	dispatchCommand(Commands.DATE);	
	
	if (app.model.getStateFavitEdit())
	{
		DOM("sliderArea").add("a", {id: "sliderAreaLink", "class": "button red", style: "float:right;margin-bottom:20px;"}, "Löschen");
		DOM("sliderAreaLink").on("touch", Commands.FAVORITE_DELETE);
	}
	
	if (!app.model.getStateFavitEdit() && kategorie != "Notizen")
	{
		// REGISTER COMMANDS
		addCommand("SLIDER", sliderCommand, {parent: "sliderArea", actions: "favitActions", zeit: "favitZeitLabel", output: "favOutputId", grad: "favGradId", edit: this.properties.edit});
		
		// DISPATCH COMMANDS
		dispatchCommand(Commands.SLIDER);
		dispatchCommand(Commands.TIPPS_SHOW);				
	}
}

function dateCommand(event)
{	
	// HANDLE CHANGE OF SELECT (NEW DATE)
	if (event.value && event.type)
	{
		var update = new Date(event.zeitInMs);
		var limit = new Date().getTime();

		if (event.type == "dd") update.setDate(event.value);
		if (event.type == "MM") 
		{
			update.setDate(1);
			update.setMonth(Number(event.value) - 1);
		}
		if (event.type == "yyyy") update.setYear(Number(event.value) - 1);
		if (event.type == "hh") update.setHours(Number(event.value) - 1);
		if (event.type == "mm") update.setMinutes(Number(event.value) - 1);
		
		if (event.type == "yyyy-MM-dd")
		{
			update.setYear(Number(event.value.substr(0,4)));
			
			update.setMonth(Number(event.value.substr(5,2)) - 1);
			
			update.setDate(Number(event.value.substr(8,2)));
		}
		
		if (event.type == "hh:mm")
		{
			update.setHours(Number(event.value.substr(0, 2)));
			update.setMinutes(Number(event.value.substr(3, 2)));
		}
		
		// UPDATE TEMP ITEM
		if (update.getTime() > limit)
		{
			app.model._state.tempItem.x = limit;
			//alert("Das Datum liegt in der Zukunft und wurde auf Heute zurückgesetzt!"); 
		}
		else
		{
			app.model._state.tempItem.x = update.getTime();
		}
		
		// ZEITPUNKT DELETE
		DOM(this.properties.zeit).html("&nbsp;");
		// NO EDIT FUNCTION AVAILABLE
		DOM(this.properties.edit).hide();
		
		// SHOW SAVE AND CANCEL
		DOM(this.properties.actions).show();
	}

	// GET CURRENT X 
	var zeitInMs = app.model._state.tempItem.x = (app.model._state.tempItem.x) ? app.model._state.tempItem.x : new Date().getTime();

	DOM(this.properties.parent).removeChilds();

	// CREATE ELEMENT DESKTOP ODER MOBILE
	if (app.agent.isDevice("Desktop") || (/Android/i.test(navigator.userAgent)))
	{		
		DOM(this.properties.parent).add("span",{style: "margin-right:5px;"}, "<b>Datum</b>"); 
		DOM(this.properties.parent).add("select", {id: "dd", "class": "optionen"});
		
		DOM("dd").addOptions(1, util.zeit("ddInMonth", zeitInMs), util.zeit("dd", zeitInMs))
			.on("change", Commands.DATE, {type: "dd", zeitInMs: zeitInMs, parent: "zeitArea"});
		
		DOM(this.properties.parent).add("select", {id: "mm", "class": "optionen"});
		DOM("mm").addOptions(1, 12, util.zeit("MM", zeitInMs))
			.on("change", Commands.DATE, {type: "MM", zeitInMs: zeitInMs, parent: "zeitArea"});
		
		DOM(this.properties.parent).add("select", {id: "yyyy", "class": "optionen"});
		DOM("yyyy").addOptions(2013, 2022, util.zeit("yyyy", zeitInMs))
			.on("change", Commands.DATE, {type: "yyyy", zeitInMs: zeitInMs, parent: "zeitArea"});
	
		DOM(this.properties.parent).add("span", {style: "margin-left:10px;margin-right:5px;"}, "<b>Zeit</b>"); 
		DOM(this.properties.parent).add("select", {id: "hh", "class": "optionen"});
		DOM("hh").addOptions(1, 24, util.zeit("hh", zeitInMs))
			.on("change", Commands.DATE, {type: "hh", zeitInMs: zeitInMs, parent: "zeitArea"});
		
		DOM(this.properties.parent).add("select", {id: "mms", "class": "optionen"})
		DOM("mms").addOptions(1, 60, util.zeit("mm", zeitInMs))
			.on("change", Commands.DATE, {type: "mm", zeitInMs: zeitInMs, parent: "zeitArea"});
	}
	else
	{		
		DOM(this.properties.parent).add("input", {id: "yyyymmdd", type: "date", value: util.zeit("yyyy-MM-dd", zeitInMs), style: "font-size:95%; width:105px;"});
		DOM("yyyymmdd").on("done", Commands.DATE, {type: "yyyy-MM-dd", zeitInMs: zeitInMs, parent: "zeitArea"});
		DOM(this.properties.parent).add("input", {id: "hhmm", type: "time", value: util.zeit("hh:mm", zeitInMs), style: "font-size:95%;margin-left:10px;width:65px"});
		DOM("hhmm").on("done", Commands.DATE, {type: "hh:mm", zeitInMs: zeitInMs, parent: "zeitArea"});
	}
}

function sliderCommand(event)
{	
	// TRANSFORM CUSTOM RESULT IF CLICKED ON SLIDER NOT THUMB
	if (event.custom && event.tag == "DIV")
	{	
		var hundert = DOM("favSliderId").width() - DOM("thumbId").width();
		var calibrate = DOM("thumbId").width() / 2;	 
		var value = parseInt((event.offsetX - calibrate)/ hundert * 100);
		 
		if (value < 0) value = 0; if (value > 100) value = 100;
		 
		DOM("thumbId").style("left", parseInt(hundert * value / 100) + "px");
		 
		event.value = value;
	}
	
	// HANDLE RESULT
	if (event.value) 
	{	
		app.model._state.tempItem.y = event.value;

		var item = app.model._state.tempItem;
		
		// Update Displays
		DOM(this.properties.output).removeChilds().text(event.value + app.model.getType(item.id).unit);
		
		var grad = app.model.getGrad(item.id, item.y);
		
		if (grad)
		DOM(this.properties.grad).element.innerHTML = "<b>Definition: </b>" + grad.info;	
		
		// SAVE AND CANCEL
		DOM(this.properties.actions).show();

		// ZEITPUNKT DELETE
		DOM(this.properties.zeit).html("&nbsp;");
		
		// NO EDIT FUNCTION AVAILABLE
		DOM(this.properties.edit).hide();
		
		dispatchCommand(Commands.TIPPS_SHOW, {type: item.id, value: item.y, x: item.x});	
	}
	
	var temp = app.model._state.tempItem;
	
	// CREATE LEMENT DESKTOP ODER MOBILE IF NO EVENT VALUE
	if (!event.value && event.tag != "A")
	{
		
		if (app.agent.isDevice("Desktop"))
		{				
			DOM(this.properties.parent).add("div", {id: "favSliderId", "class": "slider"});
			DOM("favSliderId").add("a", {id: "thumbId", "class": "grey"});		 
			
			var hundert = DOM("favSliderId").width() - DOM("thumbId").width();
			
			DOM("thumbId").style("left", parseInt(hundert * temp.y / 100) + "px");
			
			DOM("favSliderId").on("touch", Commands.SLIDER, {custom:true});
		}
		else
		{//, , style:"margin-bottom:20px"
			DOM(this.properties.parent).add("input", {id: "favRangeId", type: "range", min: 0, max: 100, value: temp.y});
			DOM("favRangeId").on("change", Commands.SLIDER, {});
		}	
	}
}

function favoriteTextChangeCommand(data)
{
	DOM(data.reseter).hide();
	DOM(data.action).show();

	if (data.type == "reset")
	{
		data.value = "";
		DOM("favTextareaId").element.value = "";
	}
	
	// Persist to TEMP Model
	if (app.model._state.tempItem)
	app.model._state.tempItem.y = data.value;
}

function favoriteExitCommand(data)
{
	var command = app.model.getStateSymptom().command;
	
    // PERSIT TO MODEL IF SAVE EVENT
	if (this.properties.type == "save"){
		
		var toSave = app.model._state.tempItem;
		
		dispatchCommand(Commands.REQUEST, {
			request: "ACT_SAVE",
			act: {
				id: toSave.id, x: toSave.x, y: toSave.y, tipps: toSave.tipps
			}
		});
	}
	// DELETE EVENT
	if (this.properties.type == "delete"){
		
		var toDelete = app.model.getStateSymptom();

		var actToDelete = app.model.getActForPunkt(toDelete);
		
		dispatchCommand(Commands.REQUEST, {request: "ACT_DELETE", act: actToDelete});
	}
	
	// Cleaning
	app.model._state.tempItem = null;		
	app.model.setStateSymptom(null);	
	
	// CLEANING EDIT BUTTN STATUS
	dispatchCommand(Commands.FAVORITE_CHANGE, {exit: true});
	
	dispatchCommand(command);
}






