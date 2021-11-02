/**-------------------------------------------------------------------------------*
 * This class holds all methods of Display general page.                          *
 * -------------------------------------------------------------------------------*
 * @class                                                                         *
 * @public                                                                        *
 * @author Abhishek Pant                                                          *
 * @since 25th November 2019                                                      *
 * @extends com.amat.crm.opportunity.controller.BaseController                    *
 * @name com.amat.crm.opportunity.controller.disp_general                         *
 *  * ----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 *  Date           Author          PCR No.           Description of change        *
 * ********************************************************************************
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
***********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController",
	"com/amat/crm/opportunity/controller/disp_CommController"
], function(Controller, CommonController) {
	"use strict";
	var thisCntrlr, oCommonController, that_views4, that_disp_psrra;
	return Controller.extend("com.amat.crm.opportunity.controller.disp_general", {
		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */
		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 *
		 * @memberOf view.general
		 */
		onInit: function() {
			thisCntrlr = this;
			thisCntrlr._initiateControllerObjects();
			oCommonController = new CommonController();
			thisCntrlr.disModel = new sap.ui.model.odata.ODataModel(thisCntrlr.getResourceBundle().getText("S4DISSERVEURL"),true);
		},
		/**
		 * This method Used for Initiate Other Controller Variable.
		 * @name _initiateControllerObjects
		 * @param
		 * @returns
		 */
		_initiateControllerObjects: function() {
			if (that_views4 === undefined) {
				that_views4 = this.getOwnerComponent().s4;
			}
			if (that_disp_psrra === undefined) {
				that_disp_psrra = this.getOwnerComponent().dis_psrra;
			}			
		},
		/**
		 * This method is used to handles change of Quote number selection.
		 * @name onQuoteComboSelectionChange
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onQuoteComboSelectionChange: function(oEvent) {
			if (oEvent.getSource().getSelectedKey() !== this.getResourceBundle().getText("SELQUOTE")) {
				thisCntrlr.getView().getModel().setProperty("/genQotRevBtnVis", true);
			} else {
				thisCntrlr.getView().getModel().setProperty("/genQotRevBtnVis", false);
			}
		},
		/**
		 * This method is used to save the Quote number.
		 * @name onQuoteSave
		 * @param
		 * @returns
		 */
		onQuoteSave: function() {
			var oResource = this.getResourceBundle();
			var obj = {
				"ItemGuid": this.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid,
				"QuoteGuid": oResource.getText("BLANKITEMGUID"),
				"Quote": thisCntrlr.getView().getModel().getProperty("/RevQuoteno"),
				"CreatedName": "",
				"CreatedDate": ""
				};
			this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.RevQuoteSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, obj, oResource.getText("S2PSRSDADATASAVETXT"));
			thisCntrlr.getView().getModel().setProperty("/genQotRevBtnVis", false);
			var sQuoteTableUrl = oResource.getText("S4DISRRAREVQOTPTH") + this.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid + "'";
			this.serviceDisCall(sQuoteTableUrl, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var oRevQuoteData = this.getModelFromCore(oResource.getText("GLBREVQUOTEMODEL")).getData().results;
			thisCntrlr._initiateControllerObjects();
			that_views4.getController().SetGenInfoModel(thisCntrlr.getResourceBundle());
		},
		/**
		 * This method Handles Main Comment Note Live Change Event.
		 * @name OnMainCommLvchng
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		OnMainCommLvchng: function(oEvent) {
			oCommonController.commMainCommLvchng(oEvent, thisCntrlr.getResourceBundle(), thisCntrlr, thisCntrlr.getView().
					byId(com.amat.crm.opportunity.Ids.S4DISGENINFOMINCOMMSAVBTN));			
		},
		/**
		 * This method is used to handles Save Comment Event.
		 * @name onSaveMainCom
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onSaveMainCom: function(oEvent) {
			var oResouceBundle = thisCntrlr.getResourceBundle();
			var oView = thisCntrlr.getView();
			var MTxtAra = oView.byId(com.amat.crm.opportunity.Ids.S4DISGENINFOMINCOMTXTAREA);
			if (!(oEvent.getSource().getParent().getFields()[0].getValue().match(/\S/))) {
				thisCntrlr.showToastMessage(oResouceBundle.getText("S2MAINCOMMBLANKMSG"));
				MTxtAra.setValue("");
			} else {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				oCommonController.commSaveMainCom(oEvent, oResouceBundle.getText("S2GENINFOMCOMMDATATYP"), oResouceBundle, MTxtAra,
						oView.byId(com.amat.crm.opportunity.Ids.S4DISGENINFOMINCOMTTAB), oView.byId(com.amat.crm.opportunity.Ids.S4DISGENINFOMINCOMMSAVBTN),
						thisCntrlr);
				myBusyDialog.close();
			}
		},
		/**
		 * This method Handles Search Contact Button Event.
		 * @name searchContact
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		searchContact: function(oEvent) {
			var oEventParameters = oEvent.getParameters(), oResource = this.getResourceBundle();
			var searchText,
			    contactData;
			var contactType = oEvent.getSource().getParent().getParent().getParent().getController().contactType;
			if (oEventParameters.hasOwnProperty(oResource.getText("S2TYPECONTCTPROPTXT"))) {
				searchText = oEventParameters.newValue;
				if (searchText.length < 3) return;
			} else searchText = oEventParameters.query;
			thisCntrlr.contactF4Fragment.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
				"ItemSet": []});
			var sContact = oResource.getText("S4DISRRACONSRHPTH") + searchText + oResource.getText("S4DISRRACONSRHPTH2") + contactType + "'";
			if (searchText.length != 0) {
				this.serviceDisCall(sContact, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				contactData = this.getModelFromCore(oResource.getText("GLBCONTACTMODEL")).getData().results;
				this.contactF4Fragment.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
					"ItemSet": contactData});
			} else {
				thisCntrlr.contactF4Fragment.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
					"ItemSet": thisCntrlr.contactData});
			}
		},
		/**
		 * This method Handles Add Contact Button Event.
		 * @name onPressAddContact
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onPressAddContact: function(oEvent) {
			oCommonController.commonPressAddContact(oEvent, thisCntrlr, thisCntrlr.getResourceBundle().getText("S2GENINFOMCOMMDATATYP"));
		},
		/**
		 * This method Handles Delete Button Event.
		 * @name onContactCancelPress
		 * @param
		 * @returns
		 */
		onContactCancelPress: function() {
			this.contactF4Fragment.close();
			this.contactF4Fragment.destroy(true);
		},
		/**
		 * This method Handles Contact Dialog OK Button Event.
		 * @name onContactOkPress
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		onContactOkPress: function(evt) {
			oCommonController.commonContactOkPressed(evt, thisCntrlr);
		},
		/**
		 * This method Handles On Delete Contact Event.
		 * @name onDelete
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		onDelete: function(evt) {
			thisCntrlr._initiateControllerObjects();
			var oResource = thisCntrlr.getResourceBundle();
			var RRAModel = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel"));
			if(RRAModel === undefined){
				that_disp_psrra.getController().getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
				RRAModel = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel"));
			}
			var delFlag = that_disp_psrra.getController().checkMContact(evt.getParameters().listItem.getBindingContext().getPath().split("/")[1].split("_")[1],
					oResource.getText("S2PSRDCNADEFERKEY"));
			if (delFlag[0] === true && RRAModel.getData().PsrRequired !== "") {
				thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCCONTACTDELNEGMSG"));
			} else {
				oCommonController.commonDelete(evt, thisCntrlr);	
			}
		},
		/**
		 * This method Handles Contact Dialog On Selection Event.
		 * @name contactSucess
		 * @param
		 * @returns
		 */
		contactSucess: function(Msg) {
			oCommonController.commonContactSuccess(Msg, thisCntrlr);
		},
	});
});