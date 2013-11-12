var Symptom = 
{  
  "data":
  [                 
    { id: "Symptom", title: "Auswählen und eingeben", kategorie:"Symptom" }
    ,
    { id: "10016256", title: "Müdigkeit", kategorie:"Symptom", sub: "Allgemeinsymptome", zero:0, unit:"Pkte", farbwert :"rgba(0,139,139,0.9)",
        grad:[    
                  { info:"Sehr starke Müdigkeit, auch in Ruhe, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Starke Müdigkeit, auch in Ruhe, Selbstversorgung (z.B. Ankleiden und Waschen) stark eingeschränkt möglich, Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Müdigkeit, besteht auch bei Ruhe, deutliche Einschränkung im Alltag, Arbeitsfähigkeit stark eingeschränkt.", max:60, min:41, tipps:"iBeweg"},
                  { info:"Leichte Müdigkeit, bessert sich nach Ruhe, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iBeweg"},
                  { info:"Sehr milde Müdigkeit, ohne Einschränkung im Alltag und bei der täglichen Arbeit.", max:20, min:0, tipps:"iBeweg"}
            ]  
    }
    ,
    { id: "10013963", title: "Atemnot", kategorie:"Symptom", sub: "Atemwege", zero:0,unit:"Pkte", farbwert:"rgba(40,210,230,0.9)",
      grad:[      
                  { info:"Sehr starke Atemnot, auch in Ruhe, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld1"},
                  { info:"Starke Atemnot auch in Ruhe, Selbstversorgung (z.B. Ankleiden und Waschen) stark eingeschränkt möglich, Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld1"},
                  { info:"Mässige Atemnot bei leichter Belastung mit deutlicher Einschränkung im Alltag und bei der Arbeit.", max:60, min:41, tipps:"iMeld1"},
                  { info:"Leichte Atemnot bei leichter Belastung aber ohne Einschränkung im Alltag und bei der Arbeit.", max:40, min:21, tipps:"iMeld2"},
                  { info:"Sehr leichte Atemnot bei normaler Belastung.", max:20, min:0}
            ]  
    }
    , 
    { id: "10013950", title: "Schluckstörung", kategorie:"Symptom", sub: "Hals, Nase, Ohren", zero:0,unit:"Pkte",  farbwert:"rgba(160,200,200,0.9)",
    grad:[ 
            { info:"Sehr starke Schluckbeschwerden, normale Nahrungs- oder Flüssigkeitsaufnahme ist nicht mehr möglich.", max:100, min:81, tipps:"iMeld2"},
            { info:"Starke Schluckbeschwerden, normale Nahrungs- und Flüssigkeitsaufnahme ist kaum mehr möglich." ,max:80, min:61, tipps:"iMeld2"},
            { info:"Mässige Schluckbeschwerden, erschwerte und eingeschränkte Nahrungsaufnahme (z.B. Verwendung weicher oder flüssiger  Nahrungsmittel).", max:60, min:41, tipps:"iMeld2"},
            { info:"Milde aber deutliche Schluckbeschwerden ohne relevante Einschränkung der Nahrungsaufnahme.", max:40, min:21, tipps:"iMeld1"},
            { info:"Sehr milde Symptome, unveränderte Nahrungsaufnahme.", max:20, min:0}
      ]  
    }
    , 
    { id: "10012727", title: "Durchfall", kategorie:"Symptom", sub: "Magen- und Darmsystem", zero:0,unit:"Pkte", farbwert:"rgba(0,206,209,0.9)",
        grad:[    
                  { info:"Sehr starke Symptome, Selbstversorgung aufgrund Häufigkeit des Symptoms nicht mehr möglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Starke Symptome, wässrige Stuhlgänge mehr als 7 Mal pro Tag, starke Einschränkung im Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Symptome, wässrige Stuhlgänge 4-6 Mal pro Tag, leichte Einschränkung im Alltag.", max:60, min:41, tipps:"iMeld2,iStuhlkonsis"},
                  { info:"Leichte Symptome, wässriger Stuhlgang unter 4 Mal pro Tag.", max:40, min:21, tipps:"iStuhlkonsis, iFlüssig, iReserve"},
                  { info:"Sehr milde gelegentliche Symptome, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iStuhlkonsis, iFlüssig, iReserve"}
            ]  
      }, 
   { id: "10050068", title: "Ödeme an Gliedmassen", kategorie:"Symptom", sub: "Ödeme",zero:0,unit:"Pkte", farbwert:"rgba(64,224,208,0.9)",
        grad:[    
                  { info:"Sehr starke Schwellung, starke Bewegungseinschränkung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Starke Schwellung mit Bewegungseinschränkung, starkes Spannungsgefühl und deutliche Veränderung der Körperkontur, starke Einschränkung im Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige sichtbare Schwellung, Auslöschung von Hautfalten, veränderte Körperkontur, leichte Einschränkung im Alltag.", max:60, min:41, tipps:"iBeweg,iMeld1"},
                  { info:"Leichte sichtbare Schwellung mit erhöhtem Spannungsgefühl, leichte Hautstrukturveränderung.", max:40, min:21, tipps:"iBeweg"},
                  { info:"Sehr leichte Schwellung, leichtes Spannungsgefühl aber keine Veränderung der Hautstruktur.", max:20, min:0, tipps:"iBeweg"}
            ]  
      }, 
      { id: "10013774", title: "Trockene Augen", kategorie:"Symptom", sub: "Augen",zero:0,unit:"Pkte",  farbwert:"rgba(175,238,238,0.9)",
        grad:[    
                  { info:"Sehr starke Symptome, Selbstversorgung stark eingeschränkt durch Seheinschränkung.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Starke Symptome, deutliche Einschränkung im Alltag (z.B. Lesen, Autofahren) und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Symptome, regelmässige Verwendung von Augentropfen notwendig, leichte Einschränkung im Alltag.", max:60, min:41, tipps:"iMeld1"},
                  { info:"Leichte Symptome, keine Einschränkung im Alltag, Augentropfen zur Befeuchtung sind ausreichend.", max:40, min:21},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag.", max:20, min:0}
            ]  
      }, 
    { id: "10037868", title: "Hautausschlag", kategorie:"Symptom", sub: "Haut und Haare",zero:0, unit:"Pkte",farbwert:"rgba(70,130,180,0.9)",
        grad:[    
                  { info:"Sehr starke Symptome (Juckreiz, Hautspannen, Rötung, Hautbrennen), lokal oder verteilt, Selbstversorgung unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Starke Symptome (Juckreiz, Hautspannen, Rötung, Hautbrennen), lokal oder verteilt, starke Einschränkung im Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Symptome, deutlicher Juckreiz, Hautspannen und Hautbrennen, lokal oder verteilt. Leichte Einschränkung im Alltag.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Symptome, lokal eingeschränkt, leichte Rötung, leichter Juckreiz, Hautspannen oder Hautbrennen.", max:40, min:21, tipps:"iMeld2"},
                  { info:"Sehr milde Symptome, lokal eingeschränkt, keine Einschränkung im Alltag.", max:20, min:0}
            ]  
      }, 
    { id: "10020772", title: "Bluthochdruck", kategorie:"Symptom", sub: "Herz- und Kreislaufsystem",zero:0, unit:"Pkte", farbwert:"rgba(95,158,160,0.9)",
        grad:[    
                  { info:"Sehr schwerer Bluthochdruck über 190 mmHg (1. Wert).", max:100, min:81},
                  { info:"Schwerer Bluthochdruck mit Werten über 160 mmHg (1. Wert) oder über 100 mmHg (2. Wert)." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Bluthochdruck mit 140-150 mmHg (1 Wert) oder 90-99 mmHg (2. Wert) oder plötzlicher Anstieg von mehr als 20 mmHg zum normalen Vorwert.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Milder Bluthochdruck 130-139 mmHg (1. Wert) oder 80-89 mmHg (2. Wert).", max:40, min:21},
                  { info:"Sehr milde Symptome.", max:20, min:0}
                    ]  
              }, 
  
            { id: "10016791", title: "Erkältungssymptome", kategorie:"Symptom", sub: "Infekt",zero:0,unit:"Pkte",  farbwert:"rgba(30,144,255,0.9)" ,
        grad:[    
                  { info:"Sehr starke Symptome mit Einschränkung der Selbstversorgung (z.B. selbst Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Starke Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) stark eingeschränkt und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Symptome, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Symptome, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iMeld1"},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
            ]  
      }, 
    { id: "10046593", title: "Harndrang", kategorie:"Symptom", sub: "Niere und Harnblase",zero:0,unit:"Pkte", farbwert:"rgba(0,0,205,0.9)",
        grad:[    
                  { info:"Sehr starke Symptome mit Einschränkung der Selbstversorgung (z.B. selbst Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Starke Symptome, hohe Toilettenfrequenz, Verlassen der Wohnung kaum möglich, Einschränkung des Alltags und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Symptome, vermehrtes Wasserlassen, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Symptome, häufigeres Wasserlassen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
            ]  
      }, 
    { id: "10038743", title: "Unruhe", kategorie:"Symptom", sub: "Psyche",zero:0,unit:"Pkte",  farbwert:"rgba(65,105,225,0.9)",
        grad:[    
                  { info:"Sehr starke Symptome, Selbstversorgung im Alltag ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Starke Symptome, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Symptome, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Symptome, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
            ]  
      }, 
    { id: "10017999", title: "Bauchschmerzen", kategorie:"Symptom", sub: "Schmerzen",zero:0,unit:"Pkte",  farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Sehr starke nicht auszuhaltende Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Stark anhaltende kaum auszuhaltende Schmerzen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige und anhaltende Symptome, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld1, iReserve"},
                  { info:"Milde Symptome, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iReserve"},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
            ]  
      }, 
    { id: "10047700", title: "Erbrechen", kategorie:"Symptom", sub: "Magen- und Darmsystem",zero:0,unit:"Pkte",  farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Sehr starkes und anhaltendes Erbrechen, Nahrungs- und Flüssigkeitsaufnahme unmöglich.", max:100, min:81, tipps:"iMeld2,iReserve"},
                  { info:"Starkes Erbrechen über 6 Mal während 24 Stunden, Nahrungs- und Flüssigkeitsaufnahme stark eingeschränkt." ,max:80, min:61, tipps:"iMeld2,iReserve"},
                  { info:"Mässiges Erbrechen, 3-5 Mal während 24 Stunden, eingeschränkte Nahrungsaufnahme.", max:60, min:41, tipps:"iMeld2,iReserve"},
                  { info:"Leichtes Erbrechen, bis maximal 2 Mal während 24h, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iIngwertee,iIngwerkapsel,iIngwerhonig,iFlüssig,iAkupressP6,iKleinesmahl,iReserve"},
                  { info:"Einmaliges Erbrechen, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0, tipps:"iIngwertee,iIngwerkapsel,iIngwerhonig,iFlüssig,iAkupressP6,iKleinesmahl,iReserve"}
            ]  
      }, 
    { id: "10054524", title: "Hand-Fuss-Syndrom", kategorie:"Symptom", sub: "Haut und Haare",zero:0,unit:"Pkte",  farbwert:"rgba(135,206,235,0.9)",
              grad:[    
                        { info:"Sehr schwere schmerzhafte Hautveränderung an Händen und Füssen, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                        { info:"Schwere schmerzhafte Hautveränderung an Händen und Füssen mit Hautschälung, Blasen, Blutungen, Schwellung und Schuppung." ,max:80, min:61, tipps:"iMeld2"},
                        { info:"Mässige schmerzhafte Hautveränderungen mit Hautschälung, Blasenbildung und Schwellung.", max:60, min:41, tipps:"iMeld2"},
                        { info:"Leichte Hautveränderung an Händen oder Füssen mit Rötung, Schuppung und Schwellung, aber schmerzfrei.", max:40, min:21, tipps:"iMeld2"},
                        { info:"Sehr milde Hautveränderung, leichte Schuppung und Rötung an Händen oder Füssen, schmerzfrei.", max:20, min:0}
                  ]  
            },
      { id: "10028813", title: "Übelkeit", kategorie:"Symptom", sub: "Allgemeinsymptome",zero:0,unit:"Pkte",  farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Sehr starke Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Stark anhaltende Symptome, ungenügende Nahrungs- und Flüssigkeitsaufnahme, deutlicher Gewichtsverlust." ,max:80, min:61, tipps:"iMeld2,iReserve"},
                  { info:"Mässige und anhaltende Symptome, Einschränkung in Nahrungsaufnahme und beginnender Gewichtverlust.", max:60, min:41, tipps:"iMeld1,iReserve"},
                  { info:"Leichte Symptome, Appetitverlust aber unveränderte Nahrungsaufnahme.", max:40, min:21, tipps:"iIngwertee,iIngwerkapsel,iIngwerhonig,iAkupressP6,iKleinesmahl,iReserve"},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0, tipps:"iIngwertee,iIngwerkapsel,iIngwerhonig,iAkupressP6,iKleinesmahl,iReserve"}
            ]  
      },          
      { id: "10016558", title: "Fieber", kategorie:"Symptom", sub: "Allgemeinsymptome",zero:0,unit:"Pkte",  farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Schweres anhaltendes Fieber, über 40°C über 24 Stunden Dauer.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Schweres Fieber über 40°C während 24Stunden." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Fieber von 39-40°C.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Fieber von 38-39°C.", max:40, min:21, tipps:"iMeld2"},
                  { info:"Leicht erhöhte Temperatur von 37-38°C.", max:20, min:0}
            ]  
      },                
    { id: "10047340", title: "Schwindel", kategorie:"Symptom", sub: "Allgemeinsymptome", zero:0, unit:"Pkte",farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Sehr starke nicht auszuhaltende Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Stark anhaltende Symptome, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige und anhaltende Symptome, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld1"},
                  { info:"Leichte Symptome, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
                    ]  
              },          
  
            { id: "10033371", title: "Schmerzen", kategorie:"Symptom", sub: "Schmerzen",zero:0, unit:"Pkte", farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Sehr starke nicht auszuhaltende Schmerzen, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Stark anhaltende Schmerzen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iReserve,iMeld2"},
                  { info:"Mässige und anhaltende Schmerzen, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iReserve,iMeld1"},
                  { info:"Leichte Schmerzen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iReserve"},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit", max:20, min:0}
                    ]  
              },          
  
            { id: "10011224", title: "Trockener Reizhusten", kategorie:"Symptom", sub: "Atemwege",zero:0,unit:"Pkte",  farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Sehr starker nicht auszuhaltender Reizhusten, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Stark anhaltender Reizhusten, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige und anhaltender Reizhusten, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld1"},
                  { info:"Leichter Reizhusten, keine Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
                  { info:"Sehr milde gelegentliche Symptome, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
                    ]  
              },          
  
            { id: "10036790", title: "Husten mit Auswurf", kategorie:"Symptom", sub: "Atemwege", zero:0,unit:"Pkte",  farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Sehr starker nicht auszuhaltender Husten mit massiven Auswurf, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Stark anhaltender Husten mit Auswurf, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige und anhaltender Husten mit deutlichem Auswurf, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichter Husten mit Auswurf, leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iMeld1"},
                  { info:"Sehr milde gelegentliche Symptome, minimer Auswurf beim Husten, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
                    ]  
              },    
  
           { id: "10015090", title: "Nasenbluten", kategorie:"Symptom", sub: "Blutungen", zero:0,unit:"Pkte",  farbwert:"rgba(70,130,180,0.9)",
        grad:[    
                  { info:"Massiver Blutverlust durch Nasenbluten.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Anhaltendes und nicht stillendes Nasenbluten." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Länger anhaltendes und wiederholtes Nasenbluten.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Kurzes wiederholtes Nasenbluten, leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21},
                  { info:"Kurzes und einmaliges Nasenbluten, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
            ]  
      },
   { id: "10002646", title: "Appetitverlust", kategorie:"Symptom", sub: "Allgemeinsymptome",zero:0,unit:"Pkte",  farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Sehr starke Symptome, deutlicher Gewichtsverlust, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Stark anhaltende Symptome, ungenügende Nahrungs- und Flüssigkeitsaufnahme, deutlicher Gewichtsverlust." ,max:80, min:61, tipps:"iMeld1"},
                  { info:"Mässige und anhaltende Symptome, Einschränkung in Nahrungsaufnahme und beginnender Gewichtverlust.", max:60, min:41, tipps:"iBerat"},
                  { info:"Leichte Symptome, Appetitverlust aber kaum veränderte Nahrungsaufnahme und ohne Gewichtsverlust.", max:40, min:21, tipps:"iBerat"},
                  { info:"Geringradiger Appetitverlust ohne Einschränkung in der Nahrungsaufnahme.", max:20, min:0}
            ]  
      },  
   { id: "10005329", title: "Blutungen", kategorie:"Symptom", sub: "Blutungen",zero:0,unit:"Pkte",  farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Massiver Blutverlust durch nicht stillende Blutung.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Anhaltende und nicht stillende Blutung." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Längere anhaltende und wiederholte Blutung.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Kurze wiederholte Blutung, leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iMeld1"},
                  { info:"Kurze und einmalige Blutung, keine Einschränkung im Alltag und bei der Arbeit.", max:20, min:0}
            ]  
      },  
   { id: "10062225", title: "Brennen beim Wasserlassen", kategorie:"Symptom", sub: "Nieren und Harnwege",zero:0, unit:"Pkte", farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Sehr starke nicht auszuhaltende Schmerzen, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Stark anhaltende Schmerzen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige und anhaltende Schmerzen, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Schmerzen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iMeld1"},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit", max:20, min:0}
            ]  
      },   
   { id: "10012378", title: "Depression", kategorie:"Symptom", sub: "Psychische Beschwerden",zero:0, unit:"Pkte", farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Sehr starke und nicht auszuhaltende Depression, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iBerat, iMeld2"},
                  { info:"Stark anhaltende Depression, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iBerat, iMeld2" },
                  { info:"Mässige und anhaltende Depression, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iBeweg, iBerat"},
                  { info:"Leichte Depression, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iBeweg, iBerat"},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit", max:20, min:0, tipps:"iBeweg"}
            ]  
      },  
    { id: "10013911", title: "Geschmacksstörung", kategorie:"Symptom", sub: "Allgemeinsymptome",zero:0, unit:"Pkte", farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Sehr starke Symptome, deutlicher Gewichtsverlust, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Stark anhaltende Symptome, ungenügende Nahrungs- und Flüssigkeitsaufnahme, deutlicher Gewichtsverlust." ,max:80, min:61, tipps:"iHalten,iAnreich, iMe1d2"},
                  { info:"Mässige und anhaltende Geschmacksveränderung, Einschränkung in Nahrungsaufnahme und beginnender Gewichtverlust.", max:60, min:41, tipps:"iNelke,iEntdeck,iHalten,iAnreich"},
                  { info:"Leicht veränderte Geschmackwahrnehmung, aber kaum veränderte Nahrungsaufnahme und ohne Gewichtsverlust.", max:40, min:21, tipps:"iNelke,iEntdeck"},
                  { info:"Gering veränderte Geschmackwahrnehmung aber keine Veränderung der Nahrungsaufnahme", max:20, min:0, tipps:"iNelke,iEntdeck"}
            ]  
      },  
        { id: "10047900", title: "Gewichtsverlust", kategorie:"Symptom", sub: "Allgemeinsymptome",zero:0, unit:"Pkte", farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Abnahme von mehr als 20% des Ausgangsgewichtes.", max:100, min:81, tipps:"iMeld1"},
                  { info:"Abnahme von 15-20% des Ausgangsgewichtes." ,max:80, min:61, tipps:"iAnreich,iHalten,iBerat,iMeld1"},
                  { info:"Abnahme von 10-15% des Ausgangsgewichtes.", max:60, min:41, tipps:"iAnreich,iHalten,iBerat,iMeld1"},
                  { info:"Abnahme von 5-10% des Ausgangsgewichtes.", max:40, min:21, tipps:"iAnreich,iHalten,iBerat"},
                  { info:"Abnahme von weniger als 5% des Ausgangsgewichtes.", max:20, min:0}
            ]  
      },  
        { id: "10047896", title: "Gewichtszunahme", kategorie:"Symptom", sub: "Allgemeinsymptome",zero:0, unit:"Pkte", farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Gewichtszunahme von mehr als 20% des Ausgangsgewichtes.", max:100, min:81, tipps:"iMeld2,iBerat"},
                  { info:"Gewichtszunahme von 15-20% des Ausgangsgewichtes." ,max:80, min:61, tipps:"iMeld2,iBerat"},
                  { info:"Gewichtszunahme von 10-15% des Ausgangsgewichtes.", max:60, min:41, tipps:"iMeld2,iBerat"},
                  { info:"Gewichtszunahme von 5-10% des Ausgangsgewichtes.", max:40, min:21, tipps:"iMeld1,iBerat,iGewkontrolle"},
                  { info:"Gewichtszunahme von weniger als 5% des Ausgangsgewichtes.", max:20, min:0}
            ]  
      },  
        { id: "10001760", title: "Haarausfall", kategorie:"Symptom", sub: "Haut und Haare",zero:0, unit:"Pkte",farbwert:"rgba(70,130,180,0.9)",
        grad:[    
                  { info:"Haarausfall mehr als 50% als üblich, deutlich sichtbarer Haarverlust, Haarersatz notwendig, psychosoziale Belastung.", max:100, min:41, tipps:"iShampoo,iKopfmass,iKopfpflege,iHaarspezi,iKopfdecke,"},
                  { info:"Haarverlust unter 50% als üblich und nur sichtbar bei genauer Inspektion, Frisurveränderung evt. erforderlich aber Haarersatz nicht notwendig.", max:40, min:21, tipps:"iShampoo,iKopfmass,iHaarspezi"},
                  { info:"Verstärker Haarverlust als üblich, aber nicht erkennbar.", max:20, min:0, tipps:"iShampoo,iKopfmass"}
            ]  
      }, 
        { id: "10020407", title: "Hitzewallungen", kategorie:"Symptom", sub: "Allgemeinsymptome",zero:0,unit:"Pkte", farbwert:"rgba(70,130,180,0.9)",
        grad:[    
                  { info:"Sehr starke Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Starke Symptome, starke Einschränkung im Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Symptome, deutliche Einschränkung im Alltag und eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iZwiebel,iGenuss,iCimici,iMeld1"},
                  { info:"Leichte Symptome, nur leichte kurzfristige Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iZwiebel,iGenuss,iCimici"},
                  { info:"Sehr milde kurze Symptome, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iZwiebel,iGenuss"}
            ]  
      }, 
       { id: "10028130", title: "Mundschleimhaut", kategorie:"Symptom", sub: "Magen- und Darmsystem", zero:0,unit:"Pkte",  farbwert:"rgba(160,200,200,0.9)",
    grad:[ 
            { info:"Sehr starke Beschwerden, normale Nahrungs- oder Flüssigkeitsaufnahme ist nicht mehr möglich.", max:100, min:81, tipps:"iMeld2"},
            { info:"Starke Beschwerden, normale Nahrungs- und Flüssigkeitsaufnahme ist kaum mehr möglich." ,max:80, min:61, tipps:"iMeld2"},
            { info:"Mässige Beschwerden, erschwerte und eingeschränkte Nahrungsaufnahme (z.B. Verwendung weicher oder flüssiger  Nahrungsmittel).", max:60, min:41, tipps:"iMeld1,iSprüh,iSpeichel,iMundpfleg,iGenuss,iAnanas,iTeespül,iCalendula1,iCalendula2,iMalve,iPropolis,iTeebaum,iMyrrhe"},
            { info:"Milde aber deutliche Beschwerden ohne relevante Einschränkung der Nahrungsaufnahme.", max:40, min:21, tipps:"iSprüh,iSpeichel,iMundpfleg,iGenuss,iAnanas,iTeespül,iCalendula1,iCalendula2,iMalve,iPropolis,iTeebaum,iMyrrhe,iMeld1"},
            { info:"Sehr milde Symptome, unveränderte Nahrungsaufnahme.", max:20, min:0, tipps:"iSprüh,iSpeichel,iMundpfleg,iGenuss,iAnanas,iTeespül,iPovidon,iLippen"}
      ]  
  }, 
        { id: "10013781", title: "Mundtrockenheit", kategorie:"Symptom", sub: "Magen- und Darmsystem", zero:0,unit:"Pkte",  farbwert:"rgba(160,200,200,0.9)",
    grad:[ 
            { info:"Sehr starke Beschwerden, normale Nahrungsaufnahme ist nicht mehr möglich.", max:100, min:81, tipps:"iMeld2"},
            { info:"Starke Beschwerden, normale Nahrungsaufnahme ist kaum mehr möglich." ,max:80, min:61, tipps:"iMeld2"},
            { info:"Mässige Beschwerden, erschwerte und eingeschränkte Nahrungsaufnahme (z.B. Verwendung weicher oder flüssiger  Nahrungsmittel).", max:60, min:41, tipps:"iMeld2,iSprüh,iTeenein,iSpeichel,iMundpfleg,iGenuss,iAnanas,iTeespül"},
            { info:"Milde aber deutliche Beschwerden ohne relevante Einschränkung der Nahrungsaufnahme.", max:40, min:21, tipps:"iSprüh,iTeenein,iSpeichel,iMundpfleg,iGenuss,iAnanas,iTeespül"},
            { info:"Sehr milde Symptome, unveränderte Nahrungsaufnahme.", max:20, min:0, tipps:"iSprüh,iTeenein,iSpeichel,iMundpfleg,iGenuss,iAnanas,iTeespül"}
      ]  
  }, 
        { id: "10043882", title: "Ohrensausen", kategorie:"Symptom", sub: "Hals, Nase, Ohren",zero:0,unit:"Pkte", farbwert:"rgba(70,130,180,0.9)",
        grad:[    
                  { info:"Sehr starke Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Starke Symptome, starke Einschränkung im Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Symptome, deutliche Einschränkung im Alltag und eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Symptome, nur leichte kurzfristige Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iMeld1"},
                  { info:"Sehr milde kurze Symptome, keine Einschränkung im Alltag.", max:20, min:0}
            ]  
      }, 
        { id: "10007810", title: "Katheterbeschwerden", kategorie:"Symptom", sub: "Therapiefolgen",zero:0,unit:"Pkte", farbwert:"rgba(70,130,180,0.9)",
        grad:[    
                  { info:"Schwere Symptome, massive Rötung oder Schwellung oder Schmerzen.", max:100, min:61, tipps:"iMeld2"},
                  { info:"Mässige Symptome, deutliche Rötung oder Schwellung oder Schmerzen.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Symptome, nur leichte kurzfristige Rötung oder Schwellung.", max:40, min:21, tipps:"iMeld2"},
                  { info:"Sehr milde kurze Symptome, keine Einschränkung im Alltag.", max:20, min:0}
            ]  
      }, 
        { id: "10022437", title: "Schlafstörung", kategorie:"Symptom", sub: "Psychische Beschwerden",zero:0,unit:"Pkte",  farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Schwere Einschlafstörung, Durchschlafstörung oder zu frühes Aufwachen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:100, min:61, tipps:"iMeld1" },
                  { info:"Mässige Einschlafstörung, Durchschlafstörung oder zu frühes Aufwachenund, deutliche Einschränkung im Alltag und stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iBeweg,iMeld1"},
                  { info:"Leichte Einschlafstörung, Durchschlafstörung oder zu frühes Aufwachen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iBeweg,iBerat"},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit", max:20, min:0, tipps:"iBeweg"}
            ]  
      },
        { id: "10008531", title: "Schüttelfrost", kategorie:"Symptom", sub: "Allgemeinsymptome",zero:0,unit:"Pkte",  farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Schweres und anhaltenes Zittern des ganzen Körpers, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:100, min:61, tipps:"iMeld2"},
                  { info:"Mässiges Zittern des gesamten Körpers, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichtes Gefühl von Unterkühlung, Zittern, Zähleklappern.", max:40, min:21, tipps:"iMeld1"},
                  { info:"Sehr milde Symptome, kaum Beschwerden", max:20, min:0}
            ]  
      }, 
        { id: "10022117", title: "OP-Wunde", kategorie:"Symptom", sub: "Therapiefolgen", zero:0,unit:"Pkte", farbwert:"rgba(70,130,180,0.9)",
        grad:[    
                  { info:"Schwere Symptome, massive Rötung oder Schwellung oder Schmerzen.", max:100, min:61, tipps:"iMeld2"},
                  { info:"Mässige Symptome, deutliche Rötung oder Schwellung oder Schmerzen.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Symptome, nur kurz anhaltende Rötung oder Schwellung.", max:40, min:21},
                  { info:"Sehr milde kurzfristige Symptome, keine Einschränkung im Alltag.", max:20, min:0}
            ]  
      }, 
        { id: "10040102", title: "Serom, Wundwasser", kategorie:"Symptom", sub: "Therapiefolgen", zero:0,unit:"Pkte", farbwert:"rgba(70,130,180,0.9)",
        grad:[    
                  { info:"Schwere Symptome, massive Rötung oder Schwellung oder Schmerzen.", max:100, min:61, tipps:"iMeld2"},
                  { info:"Mässige Symptome, deutliche Rötung oder Schwellung oder Schmerzen.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Symptome, nur kurz anhaltende Rötung oder Schwellung.", max:40, min:21, tipps:"iMeld2"},
                  { info:"Sehr milde kurzfristige Symptome, keine Einschränkung im Alltag.", max:20, min:0}
            ]  
      }, 
        { id: "10008481", title: "Brustschmerz", kategorie:"Symptom", sub: "Allgemeinsymptome",zero:0,unit:"Pkte", farbwert:"rgba(70,130,180,0.9)",
        grad:[    
                  { info:"Sehr starke nicht auszuhaltende Schmerzen, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Stark anhaltende Schmerzen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iReserve,iMeld2"},
                  { info:"Mässige anhaltende Schmerzen, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:100, min:41, tipps:"iMeld2"},
                  { info:"Leichte kurzfristige Schmerzen, Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iMeld2"},
                  { info:"Sehr milde kurze Schmerzen, keine Einschränkung im Alltag.", max:20, min:0}
            ]  
      },
        { id: "10046904", title: "Vaginale Trockenheit", kategorie:"Symptom", sub: "Haut und Haare",zero:0,unit:"Pkte", farbwert:"rgba(70,130,180,0.9)",
        grad:[    
                  { info:"Schwere Trockenheit und Schmerzen beim Sexualakt und einschränkende Reizung, starke Einschränkung im Alltag und Arbeitsunfähigkeit." ,max:100, min:61, tipps:"iVagina,iBerat,iMeld1"},
                  { info:"Mässige Trockenheit, mittelschwere Trockenheit mit Einschränkung der Sexualfunktion und störende Reizung, Rötung, Brennen.", max:60, min:41, tipps:"iVagina,iBerat"},
                  { info:"Leichte Trockenheit, keine Einschränkung der Sexualfunktion, leichte Rötung, leichter Juckreiz, Brennen.", max:40, min:21, tipps:"iVagina,iBerat"},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iVagina"}
            ]  
      }, 
        { id: "10010774", title: "Verstopfung", kategorie:"Symptom", sub: "Magen- und Darmsystem", zero:0,unit:"Pkte", farbwert:"rgba(0,206,209,0.9)",
        grad:[    
                  { info:"Sehr schwerer Stuhlverhalt  Symptome, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Schwerer Stuhlverhalt, eigenständige Stuhlentleerung nicht mehr möglich, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2" },
                  { info:"Mässiger anhaltender Stuhlverhalt, mehr als 3 Tage trotz Abführmitteln, deutliche Einschränkung im Alltag, stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichter Stuhlverhalt, bis zu 3 Tage, leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iFaserreich, iFlüssig"},
                  { info:"Sehr milde gelegentliche Symptome, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iFaserreich, iFlüssig"}
            ]  
      },                
        { id: "10025233", title: "Lymphödem", kategorie:"Symptom", sub: "Ödeme",zero:0,unit:"Pkte", farbwert:"rgba(64,224,208,0.9)",
        grad:[    
                  { info:"Sehr starke Schwellung, starke Bewegungseinschränkung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Starke Schwellung mit Bewegungseinschränkung, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige sichtbare Schwellung, markierte Verfärbung, ledrige Hauttextur, veränderte Körperkontur, im Alltag und bei der täglichen Arbeit.", max:60, min:41, tipps:"iMeld1"},
                  { info:"Leichte sichtbare Schwellung, mit schwacher Verfärbung, leichte Hautstrukturveränderung.", max:40, min:21, tipps:"iBeweg,iSport,iSchonen,iPunp,iKleidung,iSonne"},
                  { info:"Sehr leichte Schwellung, leichtes Spannungsgefühl aber keine Veränderung der Hautstruktur.", max:20, min:0, tipps:"iBeweg,iSport,iSchonen,iPunp,iKleidung,iSonne"}
            ]  
      }, 
        { id: "10010250", title: "Konzentration eingeschränkt", kategorie:"Symptom", sub: "Nervensystem",zero:0,unit:"Pkte", farbwert:"rgba(64,224,208,0.9)",
        grad:[    
                  { info:"Sehr starke Konzentrations- und Aufmerksamkeitsstörung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Schwere Konzentrations- und Aufmerksamkeitsstörung, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Konzentrationsstörung und verminderte Aufmerksamkeit, deutliche Einschränkung im Alltag, eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld1"},
                  { info:"Leichte Konzentrations- und Aufmerksamkeitsstörung,leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iBeweg,iBerat"},
                  { info:"Sehr leichte Konzentrationsstörung, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iBeweg"}
            ]  
      }, 
        { id: "10013573", title: "Benommenheit", kategorie:"Symptom", sub: "Nervensystem",zero:0, unit:"Pkte",farbwert:"rgba(64,224,208,0.9)",
        grad:[    
                  { info:"Sehr starke Benommenheit und Eintrübung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Schwere Benommenheit, starke Eintrübung, eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Benommenheit, deutliche Einschränkung im Alltag und eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Benommenheit,leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iBeweg,iMeld1"},
                  { info:"Sehr leichte Benommenheit, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iBeweg"}
            ]  
      }, 
        { id: "10019211", title: "Kopfschmerzen", kategorie:"Symptom", sub: "Schmerzen",zero:0, unit:"Pkte", farbwert:"rgba(105,105,135,0.9)",
        grad:[    
                  { info:"Sehr starke nicht auszuhaltende Schmerzen, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Stark anhaltende Schmerzen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iReserve,iMeld2"},
                  { info:"Mässige und anhaltende Schmerzen, deutliche Einschränkung im Alltag und stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iReserve,iMeld1"},
                  { info:"Leichte Schmerzen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iReserve"},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit", max:20, min:0}
            ]  
      },
        { id: "10003239", title: "Gelenkschmerzen", kategorie:"Symptom", sub: "Schmerzen",zero:0, unit:"Pkte", farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                  { info:"Sehr starke nicht auszuhaltende Schmerzen, Selbstversorgung (z.B. Ankleiden und Waschen) unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Stark anhaltende Schmerzen, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iReserve,iMeld2"},
                  { info:"Mässige und anhaltende Schmerzen, deutliche Einschränkung im Alltag und stark eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iReserve,iMeld1"},
                  { info:"Leichte Schmerzen, nur leichte Einschränkung des Alltags und bei der täglichen Arbeit.", max:40, min:21, tipps:"iReserve"},
                  { info:"Sehr milde Symptome, keine Einschränkung im Alltag und bei der Arbeit", max:20, min:0}
            ]  
      },  
        { id: "10062572", title: "Muskelschwäche", kategorie:"Symptom", sub: "Nervensystem",zero:0, unit:"Pkte",farbwert:"rgba(64,224,208,0.9)",
        grad:[    
                  { info:"Sehr starke Muskelschwäche, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Schwere Muskelschwäche, eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Muskelschwäche, Bewegung eingeschränkt, deutliche Einschränkung im Alltag und eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Muskelschwäche,leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iBeweg,iMeld1"},
                  { info:"Sehr leichte Schwäche, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iBeweg"}
            ]  
      }, 
         { id: "10005886", title: "Sehstörung", kategorie:"Symptom", sub: "Augen",zero:0,unit:"Pkte", farbwert:"rgba(64,224,208,0.9)",
        grad:[    
                  { info:"Sehr starke Sehstörung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Schwere Sehstörung, eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Sehstörung, Mobilität eingeschränkt, deutliche Einschränkung im Alltag und eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Sehstörung,leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iBerat,iMeld1"},
                  { info:"Sehr leichte Sehstörung, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0}
            ]  
      }, 
        { id: "10062872", title: "Empfindungsstörung", kategorie:"Symptom", sub: "Nervensystem",zero:0,unit:"Pkte", farbwert:"rgba(64,224,208,0.9)",
        grad:[    
                  { info:"Sehr starke Empfindungsstörung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Schwere Empfindungsstörung, eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Empfindungsstörung, deutliche Einschränkung im Alltag und eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Empfindungsstörung,leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iBeweg,iMeld1"},
                  { info:"Sehr leichte Störung, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iBeweg"}
            ]  
      }, 
        { id: "10003591", title: "Gangstörung", kategorie:"Symptom", sub: "Nervensystem",zero:0,unit:"Pkte", farbwert:"rgba(64,224,208,0.9)",
        grad:[    
                  { info:"Sehr starke Gangstörung,Gehunfähigkeit, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                  { info:"Schwere Gangstörung, fast gehunfähig, eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                  { info:"Mässige Gangstörung, deutliche Einschränkung im Alltag und eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Gangstörung,leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iBeweg,iMeld1"},
                  { info:"Sehr leichte Störung, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0, tipps:"iBeweg"}
            ]  
      }, 
         { id: "10047065", title: "Entzündung der Venen", kategorie:"Symptom", sub: "Blutgefässe",zero:0,unit:"Pkte", farbwert:"rgba(64,224,208,0.9)",
        grad:[    
                  { info:"Schwere Symptome mit starken Schmerzen, eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:100, min:61, tipps:"iMeld2"},
                  { info:"Mässige Symptome, deutliche Rötung oder Schwellung oder Schmerzen, deutliche Einschränkung im Alltag und eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld2"},
                  { info:"Leichte Symptome, nur kurzfristige Rötung oder Schwellung, leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iMeld1"},
                  { info:"Sehr milde Symptome, kurz anhaltend, keine Einschränkung im Alltag.", max:20, min:0}                        
            ]  
      }, 
        { id: "10034016", title: "Nagelbettentzündung", kategorie:"Symptom", sub: "Haut und Haare",zero:0,unit:"Pkte",  farbwert:"rgba(135,206,235,0.9)",
        grad:[    
                    { info:"Sehr schwere schmerzhafte Nagelveränderung, Selbstversorgung (z.B. Ankleiden und Waschen) ist unmöglich.", max:100, min:81, tipps:"iMeld2"},
                    { info:"Schwere schmerzhafte Nagelveränderung, stark eingeschränkter Alltag und Arbeitsunfähigkeit." ,max:80, min:61, tipps:"iMeld2"},
                    { info:"Mässige schmerzhafte Nagelveränderungen, Rötung und Schwellung, deutliche Einschränkung im Alltag, eingeschränkte Arbeitsfähigkeit.", max:60, min:41, tipps:"iMeld1"},
                    { info:"Leichte Beschwerden, Schwellung und Rötung, leichte Einschränkung im Alltag.", max:40, min:21, tipps:"iNagelpflege"},
                    { info:"Sehr milde Beschwerden, leichte Rötung, schmerzfrei.", max:20, min:0, tipps:"iNagelpflege"}
            ]  
      }
     ]
  ,
  "_searchterms": ["id", "kategorie"]
  ,
  "version":1383148425557
}