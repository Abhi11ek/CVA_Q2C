/**
 * @file: This file consists of all service configuration data used in My Opportunity application.
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends
 * @name opportunity.model.models
 * -------------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 * Ver.No    Date        Author    PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * V00    20/02/2018    Abhishek   PCR017480         Initial version              *
 *                      Pant       
 *                      (X089025)                                                 *
***********************************************************************************
 */

jQuery.sap.declare("com.amat.crm.opportunity.model.models");
jQuery.sap.require("com.amat.crm.opportunity.util.ServiceConfigConstants");
jQuery.sap.require("sap.m.MessageBox");
sap.ui.model.odata.ODataModel.extend("com.amat.crm.opportunity.model.models", {

constructor : function(oController) {
	    this.initGlobalModel();
	},

	  /**
     * This method is the base constructor for the model class.
     * @name initGlobalModel
     * @param 
     * @returns 
     */
	
	initGlobalModel : function() {
		
		this._oDataModel = new sap.ui.model.odata.ODataModel(com.amat.crm.opportunity.util.ServiceConfigConstants.getMyOpportunityInfoURL,true);		
	}
	
	
});
