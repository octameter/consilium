var Device = 
{  
  "data":
  [
   { id: "bp", title:"Blutdruck", sub:"Logo", kategorie:"Device", min:50, max:240, zero:0,unit:"mmHg", farbwert:"rgba(255,100,100,0.9)",
        grad:[ 	
              { info:"Blutdruckmessung (systolisch/diastolisch) und Puls mit Device" },
          ]	
   },
   { id: "weight", title:"Gewicht", sub:"Logo", kategorie:"Device", min:1, max:200, unit:"Kg", zero:0,farbwert:"rgba(255,204,0,0.9)",
        grad:[ 	
              { info:"Gewichtsmessung mit Device" },
          ]		 
   },
   { id: "stepcounter", title:"Schrittzähler", sub:"Logo", kategorie:"Device", min:0, max:20000, zero:0,unit:"Schritt", farbwert:"rgba(200,100,200,0.9)",
       grad:[ 	
             { info:"Schrittzähler (Step, km, kcal, ex, g, sportTime) mit Device" },
             ]
   },
   { id: "temperatur", title:"Körpertemperatur", sub:"Logo", kategorie:"Device", min:35.0, max:42.0, zero:0,unit:"°C",  farbwert:"rgba(200,100,200,0.9)",
        grad:[ 	
              { info:"Körpertemperaturmessung mit Device" },
          ]	
   },
   { id: "oximeter", title:"Sauerstoffsättigung", sub:"Logo", kategorie:"Device", min:90.0, max:100, zero:0,unit:"Pkte", farbwert:"rgba(200,100,200,0.9)",
        grad:[ 	
              { info:"Sauerstoffsättigung mit Device" },
          ]	
       },
   { id: "bloodglucose", title:"Blutzucker", sub:"Logo", kategorie:"Device", min:90.0, max:100, zero:0,unit:"Pkte", farbwert:"rgba(200,100,200,0.9)",
       grad:[ 	
              { info:"Blutzuckermessung mit Device" },
          ]}
  ]
  ,
  "_searchterms": ["id", "kategorie"]
  ,
  "version":1383148425557
}