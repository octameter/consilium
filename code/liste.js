var Liste = {
    
};

DOModule.legend = function( text ) {
  
  this.find("legend").html( text );
};

DOModule.addRow = function( params ) {
  
  return this.add("li").addClass("row")
      .add("span").addClass("row_title")
      .addNext("br")
      .addNext("span").addClass("row_zeit")
      .addNext("a").addClass("row_value")
      .addNext("div").addClass("row_caret")
      .addNext("p").addClass("row_detail")
      .parent()
      .fillRow( params );
};

// @params legend title, zeit, value, farbe, detail, caret ( true | false) 
DOModule.fillRow = function( params ) {

    this.find(".row_title").html(params.title || "");
    this.find(".row_zeit").html(params.zeit || "&nbsp;");
    this.find(".row_value").html( params.value || "").style("background", params.farbe || ""); 
    this.find(".row_detail").html(params.detail || "");     
    
    this.find(".row_caret").removeChilds();     
    
    // PROCEED TO 
    if( params.event ) {
      this.find(".row_caret").addSymbol("caretR");     
    }
    
    return this;
} ;