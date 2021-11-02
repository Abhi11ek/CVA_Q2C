/**
 * This class holds all methods of S2 page MLI Tab.
 *
 * @class
 * @public
 * @author Abhishek Pant
 * @since 22 February 2018
 * @extends com.amat.crm.opportunity.controller.BaseController
 * @name com.amat.crm.opportunity.controller.mli
 *
 *  * -------------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 * Ver.No    Date        Author    PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * V00    22/02/2018    Abhishek   PCR017480         Initial version              *
 *                      Pant                                                      *
 *                      (X089025)                                                 * 
 ***********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController",
	"com/amat/crm/opportunity/controller/CommonController"
], function(Controller, CommonController) {
	"use strict";
	var thisCntrlr, that_views2;
	return Controller.extend("com.amat.crm.opportunity.controller.mli", {
		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */
		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 * 
		 * @memberOf view.S2
		 */
		onInit: function() {
			this.bundle = this.getResourceBundle();
			thisCntrlr = this;
			that_views2 = this.getOwnerComponent().s2;
			this.oMyOppModel = new com.amat.crm.opportunity.model.models(this);
		},
		/**
		 * This is Lifecycle method Calls After View have Renderd.
		 * 
		 * @name onAfterRendering
		 * @param 
		 * @returns 
		 */
		onAfterRendering: function() {
			this._initiateControllerObjects();
		},
		/**
		 * This method used Initialize Global controller variables.
		 * 
		 * @name _initiateControllerObjects
		 * @param 
		 * @returns 
		 */
		_initiateControllerObjects: function() {
			if (that_views2 === undefined) {
				that_views2 = this.getOwnerComponent().s2;
			}
		},
		/**
		 * This method used to load the Installation Info data.
		 * 
		 * @name getMliData
		 * @param 
		 * @returns 
		 */
		getMliData: function() {
			var ItemGuid = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
			var Guid = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().Guid;
			var sValidate = "Install_InfoSet(Guid=guid'" + Guid + "',ItemGuid=guid'" + ItemGuid + "')";
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			thisCntrlr.getView().setModel(this.getModelFromCore(this.getResourceBundle().getText("GLBINSTINFOMODEL")));
		}
	});
});