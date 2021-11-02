sap.ui.define([

	"sap/m/Table",
	"sap/m/TableRenderer",    
	"sap/m/Column"
], function (Table,TableRenderer, Column) {
	"use strict";
	return Table.extend("com.amat.crm.opportunity.extensions.TableEXT", {
	metadata: {
       
	   aggregations : {
		    headerToolbar : {type : "sap.m.headerToolbar", multiple: false, visibility : "hidden", icon:"sap-icon://add"},
			columns : {type : "sap.m.column", multiple: true, visibility : "hidden", icon:"sap-icon://add"},
			container: {type : "sap.m.ScrollContainer", multiple: true},
			items :  {type : "sap.m.items", multiple: true, visibility : "hidden"}
		},
		 events : {
            change : {}
        }
    },
    renderer: function(oRm, oControl) {
        TableRenderer.render(oRm, oControl);
    },
  
    onAfterRendering: function() {
        var that = this;
       
        function colClick(idx, col) {
            col.css('cursor', 'pointer');
            col.children().each(function() {
                $(this).css('cursor', 'pointer');
            });

            col.click(function(evt) { 
              
                 that.fireChange({'columnIndex': idx});
                
            });
        }

        sap.m.Table.prototype.onAfterRendering.apply(this, arguments);
        var count = 0;
        this.$().find('th.sapMListTblCell').each(function() {
            colClick(count++, $(this));
        });
    }
	});
});