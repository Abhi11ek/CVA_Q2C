/**-------------------------------------------------------------------------------*
 * This class holds all methods of Display RRA View.                              *
 * -------------------------------------------------------------------------------*
 * @class                                                                         *
 * @public                                                                        *
 * @author Abhishek Pant                                                          *
 * @since 25 November 2019                                                        *
 * @extends com.amat.crm.opportunity.controller.BaseController                    *
 * @name com.amat.crm.opportunity.controller.disp_psrra                           *
 * * -----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 17/12/2020      Abhishek        PCR026243         INC06371473 DiGFP RRA Q2C    *
 *                 Pant                              Sales should have privileges *
 *                                                   similar to OM                *
 * 25/01/2021      Abhishek        PCR033306         Q2C Display Enhancements     *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 **********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController",
        "com/amat/crm/opportunity/controller/disp_CommController",
		"com/amat/crm/opportunity/model/DisRraModel"
	],
	function (Controller, CommonController, RraModel) {
		"use strict";
		var thisCntrlr, oCommonController, that_views4;
	return Controller.extend("com.amat.crm.opportunity.controller.disp_psrra", {
		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */
		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 *
		 * @memberOf view.psrsda
		 */
		onInit: function () {
			thisCntrlr = this;
			thisCntrlr.bundle = this.getResourceBundle();
			that_views4 = this.getOwnerComponent().s4;
			thisCntrlr.colFlag = [false, false, false, false, false, false, false, false, false, false, false, false,
				false, false];
			thisCntrlr.flagAtt = 0;
			thisCntrlr.MandateData;
			thisCntrlr.oMessagePopover;
			this.detActionType;
			this.SelectedRecord = {"results": []};
			this.UnselectedRecord = {"results": []};
			this.disModel = new sap.ui.model.odata.ODataModel(thisCntrlr.bundle.getText("S4DISSERVEURL"),true);
			oCommonController = new CommonController();
		},
		/**
		 * This method Used To Load This View Data.
		 * @name onLoadPrraData
		 * @param
		 * @returns
		 */	
		onLoadPrraData: function(){
			thisCntrlr.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
			var oModel = thisCntrlr.getDataModels();
			oModel[2].PsrStatus = oModel[2].PsrStatus === "" ? "0" : oModel[2].PsrStatus;
	        var PrraModel = RraModel.rraDisMode(thisCntrlr, oModel[0], oModel[1], oModel[2], oModel[2].PsrStatus,
	    		       false, false, false);
	        thisCntrlr.setViewData(PrraModel);
	        thisCntrlr.RraTabColorInit(oModel[2]);
		},
		/**
		 * This method used to refresh RRA Data.
		 * @name getRefreshRRAdata
		 * @param {String} mGuid - Opportunity GUID, {String} mItemGuid - Opportunity ItemGuid
		 * @returns
		 */
		getRefreshRRAdata: function(mGuid, mItemGuid){
			var oResource = thisCntrlr.getResourceBundle();
			var sValidate = oResource.getText("S4DISRRAINFOPTH") + mGuid + oResource.getText("S4DISRRATCHPTH2") + mItemGuid +
			oResource.getText("S4DISRRAINFOPTH1") + oResource.getText("S4DISRRAINFOPTH2");
		    this.serviceDisCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
		},
		/**
		 * This method Handles to set RRA view model.
		 * @name setViewData
		 * @param {sap.ui.model.Model} PrraModel -RRA Model
		 * @returns
		 */
		setViewData: function (PrraModel) {
			var oRraModel = thisCntrlr.getJSONModel(PrraModel);
			thisCntrlr.getView().setModel(oRraModel);
		},
		/**
		 * This method use to collect all models data.
		 * @name getDataModels
		 * @param
		 * @returns {Array}
		 */
		getDataModels: function () {
			var oResource = thisCntrlr.getResourceBundle(),
			    GeneralInfodata = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData(),
			    SecurityData = this.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData(),
			    Rradata = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData();
			return [GeneralInfodata, SecurityData, Rradata];
		},
		/**
		 * This method is used to Check User Authorization For The Task.
		 * @name checkUsersfromlist
		 * @param {sap.ui.model.Model} oModel - All Models (Array)
		 * @returns {Boolean} checkFlag - Binary Value
		 */
		checkUsersfromlist: function(oModel) {
			var checkFlag = false;
			switch(parseInt(oModel[2].PsrStatus)){
			case 0:
				var omUserList = oModel[0].NAV_OM_INFO.results,
				    salesUserList = oModel[0].NAV_SLS_INFO.results,
				    romInitiateFlag = this.checkContact(omUserList),
				    salesInitiateFlag = this.checkContact(salesUserList);
				checkFlag = (romInitiateFlag === true || salesInitiateFlag === true) ? true : false;
			case 4:
			case 5:
			case 85:
			case 90:
			case 95:
				var omUserList = oModel[0].NAV_OM_INFO.results,
				    omInitiateFlag = this.checkContact(omUserList),
				    salesUserList = oModel[0].NAV_SLS_INFO.results,
				    salesInitiateFlag = this.checkContact(salesUserList);
				checkFlag = (omInitiateFlag === true || salesInitiateFlag === true) ? true : false;
				break;
			case 15:
			case 55:
			case 65:
				var gpmUserList = oModel[0].NAV_GPM_INFO.results,
				    gpmInitiateFlag = this.checkContact(gpmUserList);
				checkFlag = (gpmInitiateFlag === true) ? true : false;
				break;
			case 70:
			case 25:
				var bmUserList = oModel[0].NAV_IW_INFO.results,
				    bmInitiateFlag = this.checkContact(bmUserList);
				checkFlag = (bmInitiateFlag === true) ? true : false;
				break;
			case 35:
			case 75:
				var conUserList = oModel[0].NAV_CON_INFO.results,
				    conInitiateFlag = this.checkContact(conUserList);
				checkFlag = (conInitiateFlag === true) ? true : false;
				break;
			case 17:
				var gpmUserList = oModel[0].NAV_GPM_INFO.results,
				    gpmInitiateFlag = this.checkContact(gpmUserList),
				    smeUserList = oModel[0].NAV_SME_INFO.results,
				    smeInitiateFlag = this.checkContact(gpmUserList);
				checkFlag = (gpmInitiateFlag === true && smeInitiateFlag === true) ? true : false;
			}
			return checkFlag;
		},
		/**
		 * This method Handles Edit Button Press Event.
		 * @name onEditRRA
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onEditRRA: function(oEvent){
			var oModel = thisCntrlr.getDataModels(),
			    ValidCon = this.checkUsersfromlist(oModel), RraModel = "",
			    oResource = this.getResourceBundle(),
			    omUserList = oModel[0].NAV_OM_INFO.results,
			    gpmUserList = oModel[0].NAV_GPM_INFO.results,
			    omInitiateFlag = this.checkContact(omUserList),
			    gpmInitiateFlag = this.checkContact(gpmUserList);
			if (ValidCon === false && (omInitiateFlag === false && gpmInitiateFlag === false)) {
				thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
			} else {
				if(ValidCon === true && oEvent.getSource().getText() === oResource.getText("S2CARMBTNEDIT")){
					thisCntrlr.refereshRraData(true, false, false);
				} else if (oEvent.getSource().getText() === oResource.getText("S2CARMBTNCANCEL")){
					thisCntrlr.refereshRraData(false, false, false);
				} else if ((omInitiateFlag === true || gpmInitiateFlag === true) && oEvent.getSource().getText() === oResource.getText("S2CARMBTNEDIT")){
					thisCntrlr.refereshRraData(false, false, true);
				} else if ((omInitiateFlag === true || gpmInitiateFlag === true) && oEvent.getSource().getText() === oResource.getText("S2CARMBTNCANCEL")){
					thisCntrlr.refereshRraData(false, false, false);
				}
			}
		},
		/**
		 * This method Used to refresh RRA View Data.
		 * @name refereshRraData
		 * @param {Boolean} editMode - Edit Mode, {Boolean} sfFlag - SF Type, {Boolean} rpFlag - RP Type
		 * @returns
		 */
		refereshRraData: function(editMode, sfFlag, rpFlag){
			var oModel = thisCntrlr.getDataModels(),
			    oRraModel = RraModel.rraDisMode(thisCntrlr, oModel[0], oModel[1], oModel[2], oModel[2].PsrStatus,
					editMode, sfFlag, rpFlag);
			thisCntrlr.setViewData(oRraModel);
			thisCntrlr.RraTabColorInit(oModel[2]);
		},
		/**
		 * This method is used to handles Hazardous Languages Link event.
		 * @name handleHazBtnLinkPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		handleHazBtnLinkPress: function(oEvent) {
			var oResource = this.getResourceBundle(),
			    path = jQuery.sap.getModulePath(oResource.getText("S2PSRSDAHAZUSDOCPATH")),
			    url = path + oResource.getText("S2PSRHAZRPDFLINK");
			oEvent.getSource().setHref(url);
			oEvent.getSource().setTarget(oResource.getText("S2PSRSDALINKTARGET"));
		},
		/**
		 * This method is used to determine RRA Tab Icon Color.
		 * @name RraTabColorInit
		 * @param {sap.ui.model.Model} RraData - RRA Model
		 * @returns
		 */
		RraTabColorInit: function(RraData){
			var RraTab = thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISRRA);
			switch (parseInt(RraData.PsrStatus)) {
			case 1:
			case 4:
			case 5:
			case 15:
			case 17:
			case 25:
			case 35:
			case 65:
			case 70:
			case 75:
			case 80:
				RraTab.setIconColor(sap.ui.core.IconColor.Critical);
				break;
			case 55:
			case 58:
			case 60:
			case 85:
			case 90:
			case 95:
				RraTab.setIconColor(sap.ui.core.IconColor.Positive);
				break;
			default:
				RraTab.setIconColor(sap.ui.core.IconColor.Default);
			}
		},
		/**
		 * This method Used to current User with Contact List.
		 * @name checkContact
		 * @param {Object Array} UserList - User Contact List
		 * @returns {Boolean} checkFlag - Binary Flag
		 */
		checkContact: function(UserList) {
			var checkFlag = false;
			if (UserList.length > 0) {
				for (var i = 0; i < UserList.length; i++) {
					if (UserList[i].ContactVal === sap.ushell.Container.getUser().getId()) {
						checkFlag = true;
					}
				}
			}
			return checkFlag;
		},
		/**
		 * This method Handles RRA Radio Buttons Event.
		 * @name onDispSelectRBPSRRRA
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onDispSelectRBPSRRRA: function(oEvent) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oResource = thisCntrlr.bundle,
			    oModel = thisCntrlr.getDataModels(),
			    omUserList = oModel[0].NAV_OM_INFO.results,
			    salesUserList = oModel[0].NAV_SLS_INFO.results,
			    romInitiateFlag = this.checkContact(omUserList),
			    salesInitiateFlag = this.checkContact(salesUserList);
			if (!(romInitiateFlag || salesInitiateFlag)) {
					thisCntrlr.showToastMessage(oResource.getText("S4DISRRAINITNEGMSG"));
					RraModel.setProperty("/RraDecnBoxSelIndex", -1, thisCntrlr);
			} else {
				var SecCheckFlag = oModel[1].InitPsr !== oResource.getText("S2ODATAPOSVAL")? true : false;
				if (SecCheckFlag === true) {
					thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCAUTHCHECKFAILMSG"));
				} else {
					    var Key = RraModel.getRraKey(oEvent, thisCntrlr),
					        obj = RraModel.InitPayload(oEvent, oModel[2], oModel[0], Key[0], Key[1], Key[2]);
						this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.DisRRAInfoSet, com.amat.crm
							.opportunity.util.ServiceConfigConstants.write, obj, oResource.getText("S4DISRRAINITPOSMSG"),
							oResource.getText("S2PSRDCRRATXTASC606"));
						thisCntrlr.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
						thisCntrlr.refereshRraData(true, false, false);
						thisCntrlr.that_views4.getController().getRefereshGenInfoData();
						thisCntrlr.setIconTabRRAFilterColor();
				}
			}
			myBusyDialog.close();
		},
		/**
		 * This method Handles RRA Cancel Initiation Event.
		 * @name confirmationRRACanInit
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		confirmationRRACanInit: function(oEvent){
			var oResource = thisCntrlr.bundle;
			if(oEvent === oResource.getText("S2CONFFRGOKBTN")){
			   var oModel = thisCntrlr.getDataModels(),
			       obj = RraModel.InitPayload(oEvent, oModel[2], oModel[0], "", "", oResource.getText("S2ESAIDSPROSSCANCLKYE"));
			   thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.DisRRAInfoSet, com.amat.crm
				   .opportunity.util.ServiceConfigConstants.write, obj, oResource.getText("S4DISRRACANINITPOSMSG"), oResource.getText("S2ESAIDSPROSSCANCLKYE"));
			    thisCntrlr.onLoadPrraData();
			    thisCntrlr.that_views4.getController().getRefereshGenInfoData();
			    thisCntrlr.setIconTabRRAFilterColor();
			}
		},
		/**
		 * This method is used to determine RRA Tab Icon Color.
		 * @name setIconTabRRAFilterColor
		 * @param
		 * @returns
		 */
		setIconTabRRAFilterColor: function(){
			var oModel = thisCntrlr.getDataModels();
			var RRATab = thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISRRA);
			switch (parseInt(oModel[2].PsrStatus)) {
			case 55:
			case 58:
			case 60:
			case 85:
			case 90:
			case 95:
				RRATab.setIconColor(sap.ui.core.IconColor.Positive);
				break;
			case 5:
			case 4:
			case 15:
			case 17:
			case 20:
			case 25:
			case 35:
			case 45:
			case 50:
			case 65:
			case 70:
			case 75:
			case 80:
				RRATab.setIconColor(sap.ui.core.IconColor.Critical);
				break;
			default:
				RRATab.setIconColor(sap.ui.core.IconColor.Default);
			break;
		}
		},
		/**
		 * This method is used to Save RRA Data.
		 * @name onSaveRRA
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onSaveRRA: function(oEvent){
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oResource = this.getResourceBundle(),
			    oModel = thisCntrlr.getDataModels(),
			    ValidCon = this.checkUsersfromlist(oModel);
			if(ValidCon === false){
				thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
			} else{
				if(thisCntrlr.getView().getModel().getProperty("/RraSpecTypVal") === ""){	
					thisCntrlr.showToastMessage(oResource.getText("S2PSRSDAWNGQUSANSFAILMSG"));
				} else {
					var ConCheck = RraModel.ValidateContact(oModel, thisCntrlr);
					if(ConCheck){
						thisCntrlr.onPSRRRADataSave(oResource.getText("S2PSRSDASAVETXT"));
					    thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCSFAFAILWDSAVEMSG"));
					} else{
					   var ErrorFlag = RraModel.ValidateData(oModel, thisCntrlr);
					   if(ErrorFlag === true){
						    thisCntrlr.onPSRRRADataSave(oResource.getText("S2PSRSDASAVETXT"));
						    thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCSFAFAILWDSAVEMSG"));
						    var quschek = RraModel.qusDiffCheck(thisCntrlr);
						    if(oModel[2].PsrStatus === "15" && quschek !== 0){
							    thisCntrlr.that_views4.getModel().setProperty("/S4RjctVis", true);
			       	            thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISREJBTN).setEnabled(true);
						    }
					   } else {
						    var Msg = (oModel[2].PsrStatus === "5" || oModel[2].PsrStatus === "65") ? oResource.getText("S2PSRSDASUBFORAPP") :
						    	      (oModel[2].PsrStatus === "15" && oModel[2].PsrType !== oResource.getText("S2PSRSDASTATREPEAT") ?
						    	      oResource.getText("S2PSRSDASFCONSPECTPEANDREWTXT") : ""),
								ActionType = oResource.getText("S2CBCANSSUCCESSKEY");
						    thisCntrlr.onPSRRRADataSave(ActionType, Msg);
					   }
				   }
			   }
			}
			myBusyDialog.close();
		},
		/**
		 * This method is used to handles BRRA Justification Value Live Change event.
		 * @name onBRRATextChange
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onBRRATextChange: function(oEvent) {
			var oModel = thisCntrlr.getDataModels();
			oModel[2].BsdaJustfication = oEvent.getParameters().value;
		},
		/**
		 * This method is used to handles SRRA Justification Value Live Change event.
		 * @name onSRRATextChange
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onSRRATextChange: function(oEvent) {
			var oModel = thisCntrlr.getDataModels();
			oModel[2].SsdaJustfication = oEvent.getParameters().value;
		},
		/**
		 * This method Handles Cancel Button Of Confirmation Dialog.
		 * @name onCancelWFPress
		 * @param
		 * @returns
		 */
		onCancelWFPress: function () {
			this.dialog.close();
			this.dialog.destroy();
			this.detActionType = "";
		},
		/**
		 * This method is used to handles Save Comment Event.
		 * @name OnApRctCommLvchng
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		OnApRctCommLvchng: function (oEvent) {
			oEvent.getParameters().value.length >= 255 ? this.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCMCOMMVALTXT")) : "";
			var ARComm = oEvent.getSource().getValue().length >= 255 ? (oEvent.getParameters().value.substr(0, 254).trim()) : oEvent.getSource()
				.getValue();
			if (oEvent.getSource().getValue().trim() === "" && oEvent.getSource().getValue().length !== 0) {
				this.dialog.getContent()[0].getContent()[1].setValue("");
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSFBLNKCHAREORMSG"));
			} else {
				this.dialog.getContent()[0].getContent()[1].setValue(ARComm);
			}
		},
		/**
		 * This method Handles Work-Flow action.
		 * @name onWFPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onWFPress: function (oEvent) {
			var oResource = this.getResourceBundle();
			if ((thisCntrlr.dialog.getContent()[0].getContent()[1].getValue() === "" || thisCntrlr.dialog.getContent()[0].getContent()[1].getValue()
					.trim() === "") && thisCntrlr.detActionType === oResource.getText("S2PSRCBCREJECTKEY")) {
				thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCSFACOMMFAILMSG"));
			} else {
				var oModel = thisCntrlr.getDataModels();
				oModel[2].AprvComments = thisCntrlr.dialog.getContent()[0].getContent()[1].getValue();
				var Msg = this.detActionType === oResource.getText("S2PSRCBCAPPROVEKEY") ? oResource.getText("S2ESAIDSWFARSUCCMSG") :
					oResource.getText("S2PSRSDACBCRJTNNXTLVLTXT");
				var obj = RraModel.PSRSDAPayload(oModel[2].PsrStatus, this.detActionType, Msg, thisCntrlr);				
				thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.DisRRAInfoSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, Msg);
				thisCntrlr.onCancelWFPress();
				thisCntrlr.that_views4.getController().onNavBack();
			}
		},
		/**
		 * This method Handles RRA Approve/Reject Button Press Event.
		 * @name onRraApprove
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onRraApprove: function (oEvent) {
			var oModel = thisCntrlr.getDataModels(),
			    oResource = this.getResourceBundle();
			if (parseInt(oModel[2].TaskId) === 0) {
				thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
			} else {
				this.detActionType = (oEvent.getSource().getText() === oResource.getText("S2PSRCBCAPPROVETEXT") ? oResource.getText("S2PSRCBCAPPROVEKEY") :
					oResource.getText("S2PSRCBCREJECTKEY"));
				this.dialog = new sap.ui.xmlfragment(oResource.getText("PSRCBCONAPPORREJConfirmation"), this);
				this.getCurrentView().addDependent(this.dialog);
				this.dialog.open();
			}
		},
		/**
		 * This method is used to Handle PSR-RRA Save Button Event.
		 * @name onPSRRRADataSave
		 * @param {String} ActionType - Type Of Action, {String} Message - Display Message
		 * @returns
		 */
		onPSRRRADataSave: function(ActionType, Message) {
		    var oResource = this.getResourceBundle(),
			    obj = RraModel.PSRSDAPayload(thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData().PsrStatus,
					  ActionType, Message, thisCntrlr);
			var Msg = Message === undefined ? "" : oResource.getText("S2PSRSDADATASAVETXT");
			this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.DisRRAInfoSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, Msg);
			var SfFlag = ActionType === oResource.getText("S1PERDLOG_SAVE") ? false : true;
			if(ActionType !== oResource.getText("S2ODATAPOSVAL") || Message !== oResource.getText("S2PSRSDASFCONSPECTPEANDREWTXT") ||
					Message !== oResource.getText("S2PSRSDASUBFORAPP")){
				this.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
				thisCntrlr.refereshRraData(!SfFlag, SfFlag, false);
			}
		},
		/**
		 * This method is used to Handle PSR-RRA Submit Button Event.
		 * @name onSubmitRRA
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onSubmitRRA: function(oEvent){
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oResource = this.getResourceBundle(),
			    oModel = thisCntrlr.getDataModels(),
			    omInitiateFlag = this.checkUsersfromlist(oModel);
		    if (omInitiateFlag === false) {
		    	thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
		    	myBusyDialog.close();
		    } else {
			  switch (this.getView().byId(com.amat.crm.opportunity.Ids.S4DISRRASUBFORAPPBTN).getText()){
				  case oResource.getText("S2PSRSDASFCANINITXT"):
				  case oResource.getText("S2PSRSDASFBTNCANNATXT"):
				        var Mesg = oResource.getText("S2CANINITMSG1") + oResource.getText("S4DISRRACANINITIMIN2MSG");
					    sap.m.MessageBox.confirm(Mesg, this.confirmationRRACanInit, oResource.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
				        break;
				   case oResource.getText("S2PSRSDASUBFORAPP"):
					   if(parseInt(oModel[2].PsrStatus) === 65 && oModel[2].Bsdl === oModel[2].Ssdl){
						   thisCntrlr.showToastMessage(oResource.getText("S2PSRPDCSDABSSDAROUTFAILMSGASC606"));
					   } else {
						   thisCntrlr.onPSRRRADataSave(oResource.getText("S1TABLESALESTAGECOL"), oResource.getText("S2PSRSDASUBFORAPP"));
						   thisCntrlr.that_views4.getController().onNavBack();
					   }
					   break;
				   case oResource.getText("S2PSRSDASFCONSPECTPEANDREWTXT"):
					   var quschek = RraModel.qusDiffCheck(thisCntrlr);
			           if(quschek !== 0){
			       	       thisCntrlr.showToastMessage(oResource.getText("S4DISRRASPECDETQUSDIFERORMSG"));
			       	       thisCntrlr.that_views4.getModel().setProperty("/S4RjctVis", true);
			       	       thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISREJBTN).setEnabled(true);
			           } else {
			       	       thisCntrlr.onPSRRRADataSave(oResource.getText("S4DISRRACONSPECNREVKEY"), oResource.getText("S2PSRSDASFCONSPECTPEANDREWTXT"));
			               thisCntrlr.that_views4.getController().onNavBack();
			           }
				   case oResource.getText("S2PSRDCINITRRABTNTXTASC606"):
					    if(oModel[1].InitSsda !== oResource.getText("S2ODATAPOSVAL")){
					    	thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
					    } else {
					    	thisCntrlr.InitiateSRRAEvent();
					    }
					    break;
				   case oResource.getText("S2PSRSDASFCONSSDAINITTXTASC606"):
					   var obj = RraModel.InitPayload(oEvent, oModel[2], oModel[0], "55", oResource.getText("S2POSMANDATANS"), oResource.getText("S4DISRRACANSRRAINITKEY"));
				       thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.DisRRAInfoSet, com.amat.crm.opportunity
							.util.ServiceConfigConstants.write, obj, oResource.getText("S2CBCCANINITSUCSSTXT"));
				       thisCntrlr.onLoadPrraData();
				       thisCntrlr.that_views4.getController().getRefereshGenInfoData();
				       thisCntrlr.setIconTabRRAFilterColor();
				}
				myBusyDialog.close();
			}
		},
		/**
		 * This method is used to Handle Main Comment Text Live Change Event.
		 * @name OnRraMainCommLvchng
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		OnRraMainCommLvchng: function(oEvent){
			oCommonController.commMainCommLvchng(oEvent, thisCntrlr.getResourceBundle(), thisCntrlr, thisCntrlr.getView().byId("idS4DispPSRRRaMainComSaveBtn"));
		},
		/**
		 * This method is used to Handle Main Comment Text Live Change Event.
		 * @name onRRAQuesSelection
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onRRAQuesSelection: function(oEvent){
			var oResource = thisCntrlr.getResourceBundle(),
			    oRraQesData = this.getView().getModel().getData().NAV_RRA_QA.results,
			    changeLine = oEvent.getSource().getParent().getBindingContext().getPath().split("/")[3],
			    selIndx = oEvent.getSource().getSelectedIndex(),
			    RraData = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData(),
			    selQid = oRraQesData[changeLine].Qid,
			    oneSelArr = ["3020", "3025", "3030"], restArr = [];
			if(oneSelArr.indexOf(selQid) >= 0)restArr = RraModel.arrayRemove(oneSelArr, selQid);
			var Prop = RraModel.getProperty(parseInt(RraData.PsrStatus), oResource.getText("S4DISRRABRRATXT"), thisCntrlr);
			for(var i =0; i < RraData.NAV_RRA_QA.results.length; i++){
			   if(restArr.indexOf(RraData.NAV_RRA_QA.results[i].Qid) >= 0 && RraData.NAV_RRA_QA.results[i].Qid !== selQid){
				   RraData.NAV_RRA_QA.results[i][Prop] = "";
			   } else if(RraData.NAV_RRA_QA.results[i].Qid === selQid){
				   RraData.NAV_RRA_QA.results[i][Prop] = selIndx === 1 ? oResource.getText("S2POSMANDATANS") : oResource.getText("S2NEGMANDATANS");
			   }
			}
			this.getView().getModel().getData().NAV_RRA_QA = {"results":RraModel.loadRraQa(RraData.NAV_RRA_QA.results.map(RraModel.myFunction),
					parseInt(RraData.PsrStatus), selQid, true, this, oResource.getText("S4DISRRABRRATXT"))};
			thisCntrlr.getView().getModel().refresh(true);
		},		
		/**
		 * This method Handles Main Comment Save Event.
		 * @name onRraSaveMainCom
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onRraSaveMainCom: function (oEvent) {
			var oResouceBundle = thisCntrlr.getResourceBundle(),
			    oView = thisCntrlr.getView(),
			    MTxtAra = oView.byId(com.amat.crm.opportunity.Ids.S4DISRRAMAINCOMMTEXTAREA);
			if (!(oEvent.getSource().getParent().getFields()[0].getValue().match(/\S/))) {
				thisCntrlr.showToastMessage(oResouceBundle.getText("S2MAINCOMMBLANKMSG"));
				MTxtAra.setValue("");
			} else {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				oCommonController.commSaveMainCom(oEvent, oResouceBundle.getText("S2ICONTABPSRTEXT"), oResouceBundle, MTxtAra, oView.byId(
					com.amat.crm.opportunity.Ids.S4DISRRAMAINCOMMTAB), oView.byId(com.amat.crm.opportunity.Ids.S4DISRRAMAINCOMMSAVEBTN), thisCntrlr);
				myBusyDialog.close();
			}
		},
		/**
		 * This method Handles On Delete Contact Event.
		 * @name onDelete
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onDelete: function (oEvent) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var delFlag = thisCntrlr.checkMContact(oEvent.getParameters().listItem.getBindingContext().getPath().split("/")[1].split("_")[1],
				thisCntrlr.bundle.getText("S2PSRDCNADEFERKEY"));
			if (delFlag[0] === true) {
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCCONTACTDELNEGMSG"));
			} else {
				oCommonController.commonDelete(oEvent, thisCntrlr);
			}
			myBusyDialog.close();
		},
		/**
		 * This method use to validate contact type minimum contact value.
		 * @name checkMContact
		 * @param {String} mConType - Contact Type, {String} mCheckTyp - Action
		 * @returns Array of minDFlag - boolean, minSFlag - boolean
		 */
		checkMContact: function (mConType, mCheckTyp) {
			var oModel = thisCntrlr.getDataModels(),
			    oResouceBundle = thisCntrlr.getResourceBundle(),
				minDFlag = false,
				minSFlag = false;
			if (mCheckTyp === oResouceBundle.getText("S2PSRDCNADEFERKEY")) {
				switch (mConType) {
				case oResouceBundle.getText("S4DISCONOMTXT"):
					minDFlag = oModel[0].NAV_OM_INFO.results.length === 1 ? true : false;
					break;
				case oResouceBundle.getText("S2SLSKEY"):
					minDFlag = oModel[0].NAV_SLS_INFO.results.length === 1 ? true : false;
					break;
				case oResouceBundle.getText("S2PSRWFAPPPANLGPMINFOCONTIT"):
					minDFlag = oModel[0].NAV_GPM_INFO.results.length === 1 ? true : false;
					break;
				case oResouceBundle.getText("S4DISCONSMETXT"):
					minDFlag = oModel[0].NAV_SME_INFO.results.length === 1 ? true : false;
					break;
				case oResouceBundle.getText("S2CONKEY"):
					minDFlag = oModel[0].NAV_CON_INFO.results.length === 1 ? true : false;
					break;
				case oResouceBundle.getText("S4DISRRAIWCONCTKEY"):
					minDFlag = oModel[0].NAV_IW_INFO.results.length === 1 ? true : false;
					break;
				
				}
			} else if (mCheckTyp === oResouceBundle.getText("S2CBCANSSUCCESSKEY")) {
				if (oModel[0].NAV_OM_INFO.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResouceBundle.getText("S4DISCONOMTXT")];
					return minSFlag;
				}
				if (oModel[0].NAV_SLS_INFO.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResouceBundle.getText("S2SLSKEY")];
					return minSFlag;
				}
				if (oModel[0].NAV_GPM_INFO.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResouceBundle.getText("S2PSRWFAPPPANLGPMINFOCONTIT")];
					return minSFlag;
				}
				if (oModel[0].NAV_IW_INFO.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResouceBundle.getText("S4DISRRAIWCONCTKEY")];
					return minSFlag;
				}				
				if (oModel[0].NAV_CON_INFO.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResouceBundle.getText("S2CONKEY")];
					return minSFlag;
				}
				if (oModel[0].NAV_SME_INFO.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResouceBundle.getText("S4DISCONSMETXT")];
					return minSFlag;
				}
			}
			if (mConType === "" && minSFlag[0] === true) {
				return minSFlag;
			}
			return [minDFlag, minSFlag];
		},
		/**
		 * This method Handles Add Contact Button Event.
		 * @name onPressAddContact
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onPressAddContact: function (oEvent) {
			oCommonController.commonPressAddContact(oEvent, thisCntrlr, thisCntrlr.bundle.getText("S2GENINFOMCOMMDATATYP"));
		},
		/**
		 * This method Handles Contact Dialog On Selection Event.
		 * @name contactSucess
		 * @param {String} Msg - Display Message
		 * @returns
		 */
		contactSucess: function (Msg) {
			oCommonController.commonContactSuccess(Msg, thisCntrlr);
		},
		/**
		 * This method is used to handles SAF Question answer Event.
		 * @name onSelectSafRBMandat
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onSelectSafRBMandat: function(oEvent) {
			var SelIndex = oEvent.getSource().getSelectedIndex();
			var ValueState = SelIndex > 0 ? thisCntrlr.bundle.getText("S2DELNAGVIZTEXT") : thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
			oEvent.getSource().setValueState(ValueState);
			var oModel = thisCntrlr.getDataModels();
			oModel[2].NAV_SAF_QA.SalesFlg = SelIndex > 0 ? (SelIndex === 1 ? thisCntrlr.bundle.getText("S2POSMANDATANS") :
					thisCntrlr.bundle.getText("S2NEGMANDATANS")) : "";
		},
		/**
		 * This method is used to handles CBC Carbon Copy F4 Help.
		 * @name handleValueHelpCBCCbnCpyRew
		 * @param
		 * @returns
		 */
		handleValueHelpRRACbnCpyRew: function() {
			var oResouceBundle = thisCntrlr.getResourceBundle(),
			    ItemGuid = thisCntrlr.getModelFromCore(oResouceBundle.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
			this.CbnType = oResouceBundle.getText("S2PSRDCRRATXTASC606");
			var sGenaralChoos = oResouceBundle.getText("S4DISRRACUTDOCLINKPTH") + ItemGuid + oResouceBundle.getText("S4DISRRACUTDOCLINKPTH1");
			this.serviceDisCall(sGenaralChoos, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var CCTableData = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISRRACCTAB).getModel().getData().NAV_RRA_CC.results,
			    RRCCData = thisCntrlr.getModelFromCore(oResouceBundle.getText("GLBPSRSDACBCCCPYMODEL")).getData();
			for (var i = 0; i < RRCCData.results.length; i++) {
				for (var j = 0; j < CCTableData.length; j++) {
					if (RRCCData.results[i].OppId === CCTableData[j].OppId && RRCCData.results[i].ItemNo ===
						CCTableData[j].ItemNo) {
						RRCCData.results[i].Selected = true;
					}
				}
				RRCCData.results[i].Selected === undefined ? RRCCData.results[i].Selected = false : "";
			}
			this.dialog = sap.ui.xmlfragment(oResouceBundle.getText("PSRCBCCCF4helpOppLink"), this);
			this.dialog.getContent()[2].getColumns()[0].setVisible(true);
			this.dialog.getContent()[2].getColumns()[2].setVisible(true);
			this.dialog.getSubHeader().setVisible(true);
			this.getCurrentView().addDependent(this.dialog);
			var oCBCCbnCpyModel = this.getJSONModel(thisCntrlr.getModelFromCore(oResouceBundle.getText("GLBPSRSDACBCCCPYMODEL")).getData());
			this.dialog.setModel(oCBCCbnCpyModel);
			this.dialog.open();
		},
		/**
		 * This method is used to handles Search functionality.
		 * @name searchOpportunity
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		searchOpportunity: function(oEvent) {
			oCommonController.commonsearchOpportunity(oEvent, thisCntrlr);
		},
		/**
		 * This method is used to handles SSDA Assessment level selection event.
		 * @name onComboSSelectionChange
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onComboSSelectionChange: function(oEvent) {
			var oResouceBundle = thisCntrlr.getResourceBundle();
			if (oEvent.getParameters().selectedItem.getText() === oResouceBundle.getText("S2PSRSDAPDCSSDALVLDEFAULTTXT")) {
				thisCntrlr.showToastMessage(oResouceBundle.getText("S2PSRPDCBSSDAOPMSG"));
			} else {
				 var Model = thisCntrlr.getDataModels();
				 Model[2].Ssdl = oEvent.getParameters().selectedItem.getText();
			}
		},
		/**
		 * This method Handles Close and Destroy Dialog.
		 * @name closeDialog
		 * @param
		 * @returns
		 */
		closeDialog: function() {
			this.dialog.close();
			this.dialog.destroy();
		},
		/**
		 * This method Handles Search Contact Button Event.
		 * @name searchContact
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		searchContact: function(oEvent) {
			var oEventParameters = oEvent.getParameters(),
			    oResource = this.getResourceBundle(),
			    searchText, contactData,
			    contactType = oEvent.getSource().getParent().getParent().getParent().getController().contactType;
			if (oEventParameters.hasOwnProperty(oResource.getText("S2TYPECONTCTPROPTXT"))) {
				searchText = oEventParameters.newValue;
				if (searchText.length < 3) return;
			} else searchText = oEventParameters.query;
			this.contactF4Fragment.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
				"ItemSet": []});
			var sContact = oResource.getText("S4DISRRACONSRHPTH") + searchText + oResource.getText("S4DISRRACONSRHPTH2") + contactType + "'";
			if (searchText.length != 0) {
				this.serviceDisCall(sContact, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				contactData = thisCntrlr.getModelFromCore(oResource.getText("GLBCONTACTMODEL")).getData().results;
				this.contactF4Fragment.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
					"ItemSet": contactData});
			} else {
				this.contactF4Fragment.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
					"ItemSet": thisCntrlr.contactData});
			}
		},
		/**
		 * This method Handles Delete Button Event.
		 * @name onContactCancelPress
		 * @param
		 * @returns
		 */
		onContactCancelPress: function () {
			this.contactF4Fragment.close();
			this.contactF4Fragment.destroy(true);
		},
		/**
		 * This method Handles Contact Dialog OK Button Event.
		 * @name onContactOkPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onContactOkPress: function (oEvent) {
			if (oEvent.getSource().getParent().getContent()[0].getItems().length === 0) {
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2GENCONTCTSLECFAILMSG"));
			} else {
				oCommonController.commonContactOkPressed(oEvent, thisCntrlr);
			}
		},
		/**
		 * This method Handles Edit Button Press Event.
		 * @name handleEditPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		handleEditPress: function (oEvent) {
			var Note = oEvent.getSource().getParent().getParent().getParent().getCells()[2].getValue();
			if(oEvent.getSource().getIcon() === thisCntrlr.bundle.getText("S2PSRSDASAVEICON")){				
				thisCntrlr.onPSRRRADataSave(thisCntrlr.getResourceBundle().getText("S2PSRSDASAVETXT"));
				oEvent.getSource().setIcon(thisCntrlr.bundle.getText("S2PSRSDASAVEICON"));
				oEvent.getSource().getParent().getParent().getParent().getCells()[2].setValue(Note);
			}
			RraModel.RraEditPress(oEvent, thisCntrlr);
		},
		/**
		 * This method Handles Add Button Press Event.
		 * @name handleAddPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		handleAddPress: function (oEvent) {
			RraModel.RraAddPress(oEvent, thisCntrlr);
		},
		/**
		 * This method is used to handles Note Live Change Event.
		 * @name handleNoteLiveChange
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		handleNoteLiveChange: function (oEvent) {
			RraModel.RraNoteLiveChange(oEvent, thisCntrlr);
		},
		/**
		 * This method Handles File Name Press Event.
		 * @name handleEvidenceLinkPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		handleLinkPress: function (oEvent) {
			var navName = RraModel.getDocNav(oEvent.getSource().getParent().getParent().getId().split("--")[1], thisCntrlr),
			    rowIndex = oEvent.getSource().getParent().getId().split("-")[oEvent.getSource().getParent().getId().split(
				       "-").length - 1],
				oData = oEvent.getSource().getParent().getParent().getModel().getData()[navName].results[rowIndex],
				oResource = this.getResourceBundle();
			var url = this.disModel.sServiceUrl + oResource.getText("S4DISRRATCHPTH1") + oData.Guid + oResource.getText("S4DISRRATCHPTH2") + oData.ItemGuid +
			          oResource.getText("S4DISRRATCHPTH3") + oData.DocType + oResource.getText("S4DISRRATCHPTH4") + oData.DocSubtype + oResource.
			          getText("S4DISRRATCHPTH5") + oData.DocId +"')/$value";
			window.open(url);
		},
		/**
		 * This method Validates Delete Button Press Event.
		 * @name CheckEsaDelete
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		CheckRRADelete: function (oEvent) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			thisCntrlr.rowIndex = oEvent.getSource().getParent().getParent().getParent().getId().split("-")[oEvent.getSource()
				.getParent().getParent().getParent().getId().split("-").length - 1];
			thisCntrlr.oEvent = oEvent;
			thisCntrlr.source = oEvent.getSource();
			thisCntrlr.oTable = oEvent.getSource().getParent().getParent().getParent().getParent();
			thisCntrlr.tabBindingModel = oEvent.getSource().getModel().getData()[oEvent.getSource().getBindingContext().getPath().split("/")[1]].results;
			if (thisCntrlr.source.getIcon().indexOf(thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDDELTXT").toLowerCase()) >= 0) {
				var text = thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDMSG") + " " + thisCntrlr.tabBindingModel[thisCntrlr.rowIndex].DocDesc + thisCntrlr.bundle.getText(
						"S2ATTCHDOCDELVALDMSG2NDPRT");
				var box = new sap.m.VBox({
					items: [
						new sap.m.Text({
							text: text
						})
					]
				});
				sap.m.MessageBox.show(box, {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDCONTXT"),
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.YES) {
							thisCntrlr.handleDeletePress(oEvent);
						} else return;
					}
				});
			} else {
				thisCntrlr.handleDeletePress(oEvent);
			}
			myBusyDialog.close();
		},
		/**
		 * This method Handles Delete Button Press Event.
		 * @name handleDeletePress
		 * @param {sap.ui.base.Event} event - Holds the current event
		 * @returns
		 */
		handleDeletePress: function (event) {
			RraModel.RraDeletePress(event, thisCntrlr);
		},
		/**
		 * This method Handles Unlink Button Event.
		 * @name onPressRRAUnLinkDoc
		 * @param
		 * @returns
		 */
		onPressRRAUnLinkDoc: function() {
			var oResource = this.getResourceBundle();
			this.CbnType = "";
			this.CbnType = oResource.getText("S4DISRRADLNKKEY");
			var DlnkCData = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData().NAV_RRA_CC;
			for (var i = 0; i < DlnkCData.results.length; i++) {
				DlnkCData.results[i].Selected === undefined ? DlnkCData.results[i].Selected = false : "";
			}
			this.dialog = sap.ui.xmlfragment(oResource.getText("PSRCBCCCF4helpOppLink"), this);
			this.dialog.getContent()[2].getColumns()[0].setVisible(true);
			this.dialog.getContent()[2].getColumns()[2].setVisible(true);
			this.dialog.getContent()[0].setVisible(true);
			this.dialog.getContent()[1].setVisible(true);
			this.dialog.getContent()[1].setValueState(oResource.getText("S2ERRORVALSATETEXT"));
			this.dialog.getButtons()[0].setEnabled(false);
			this.dialog.getSubHeader().setVisible(true);
			this.getCurrentView().addDependent(this.dialog);
			var oDLinkCCFragData = this.getJSONModel(DlnkCData);
			this.dialog.setModel(oDLinkCCFragData);
			this.dialog.open();
		},			
		/**
		 * This method is handling DeLink Mandatory Comment Live Change Event.
		 * @name OnDlinkCommLvchng
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		OnDlinkCommLvchng: function(oEvent){
			var oResource = this.getResourceBundle();
			if (oEvent.getSource().getValue().length >= 255) {
				var DlinkCommTxt = oEvent.getSource().getValue().substr(0, 254);				
				this.dialog.getContent()[1].setValue(DlinkCommTxt);
				thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCMCOMMVALTXT"));
			} else {
				this.dialog.getContent()[1].setValue(oEvent.getSource().getValue());
				if(oEvent.getSource().getValue().trim().length <= 0){
					this.dialog.getContent()[1].setValueState(oResource.getText("S2ERRORVALSATETEXT"));
					this.dialog.getButtons()[0].setEnabled(false);
				} else {
					this.dialog.getContent()[1].setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					this.dialog.getButtons()[0].setEnabled(true);
				}
			}
		},
		/**
		 * This method is used to handles CC check Box selection event.
		 * @name onSelectCB
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onSelectCB: function(oEvent) {
			var oResource = this.getResourceBundle(),
			    SelectedDes = oEvent.getParameters().selected,
			    Selectedline = oEvent.getSource().getBindingContext().sPath.split(oResource.getText("S2CBCPSRCARMSEPRATOR")
					)[oEvent.getSource().getBindingContext().sPath.split(oResource.getText("S2CBCPSRCARMSEPRATOR")).length - 1];				
			switch (this.CbnType){
			case oResource.getText("S2PSRDCRRATXTASC606"):
				this.UnselectedRecord = {"results": []};
			    var oRraCbnCpyModel = thisCntrlr.getModelFromCore(oResource.getText("GLBPSRSDACBCCCPYMODEL"));
				for (var i = 0; i < oRraCbnCpyModel.getData().results.length; i++) {
					if (i === parseInt(Selectedline)) {
						if (SelectedDes === true) {
							this.SelectedRecord.results.push(oRraCbnCpyModel.getData().results[i]);
						} else {
							this.UnselectedRecord.results.push(oRraCbnCpyModel.getData().results[i]);
						}
					}
				}
				break;
			case oResource.getText("S4DISRRADLNKKEY"):
				var oCBCDlnkCData = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData().NAV_RRA_CC;
				for (var i = 0; i < oCBCDlnkCData.results.length; i++) {
					if (i === parseInt(Selectedline)) {
						if (SelectedDes === true) {
							oCBCDlnkCData.results[i].Selected = true;
						} else {
							oCBCDlnkCData.results[i].Selected = false;
						}
					}
				}
			    break;
			}
		},		
		/**
		 * This method is used to handles OK button event.
		 * @name onRelPerSpecRewOkPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onRelPerSpecRewOkPress: function(oEvent) {
			var oResource = this.getResourceBundle();
			switch (this.CbnType){
			case oResource.getText("S2PSRDCRRATXTASC606"):
				var oTable1 = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISRRACCTAB),
				    FinalRecord = {};
		        FinalRecord["NAV_RRA_CC"] = {"results": []};
		        var RraCCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPSRSDACBCCCPYMODEL")).getData().results,
		            Rradata = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData();
		        for (var i = 0, n = 0; i < RraCCData.length; i++) {
			        if (RraCCData[i].Selected === true) {
				       FinalRecord.NAV_RRA_CC.results[n] = RraCCData[i];
				       n++;
			        }
		       }
		       FinalRecord.NAV_RRA_CC.results = FinalRecord.NAV_RRA_CC.results.concat(Rradata.NAV_RRA_CC.results);
		       FinalRecord.NAV_RRA_CC.results = oCommonController.removeDuplicate(FinalRecord.NAV_RRA_CC.results);
		       this.closeDialog();
		       oTable1.setModel(this.getJSONModel(FinalRecord));
			   this.SelectedRecord.results.length = 0;
			   this.UnselectedRecord.results.length = 0;
			   break;
			case oResource.getText("S4DISRRADLNKKEY"):
				var Msg = this.dialog.getContent()[1].getValue();
			    if(Msg.trim() !== ""){
				   var Rradata = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData().NAV_RRA_CC;;
				   var delValidFlag = thisCntrlr.getDlnkcheck(Rradata);
				   if(delValidFlag === false){
					   thisCntrlr.showToastMessage(oResource.getText("S2ALLDLINKOPPSELFAILMGS"));
			       } else {
			    	   var payload = thisCntrlr.getDLinkPayLoad(thisCntrlr.bundle.getText("S2PSRDCRRATXTASC606"), Msg, Rradata);
					   thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CCopyDLinkSet, com.amat.crm.opportunity
								.util.ServiceConfigConstants.write, payload, oResource.getText("S2CCDLNKSUSSMSG"));
					   thisCntrlr.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
				       thisCntrlr.refereshRraData(true, false, false);
					   thisCntrlr.closeDialog();
			       }
			     } else {
				   thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ALLDLINKMANDATCOMM"));
			     }
			}
		},
		/**
		 * This method is used to Check DeLink Data.
		 * @name getDlnkcheck
		 * @param {Object} DelData - Process DeLink Data
		 * @returns {Boolean} chkSel - Boolean Flag
		 */
		getDlnkcheck: function(DelData){
			var chkSel = false;
			for(var i = 0; i < DelData.results.length ; i++){
			 	if(DelData.results[i].Selected === true){
			 		chkSel = true;
			 		break;
			 	}
			 }
			return chkSel;
		},
		/**
		 * This method is used to get DeLink PayLoad.
		 * @name getDLinkPayLoad
		 * @param {String} cType - Process Type, {String} comment - DeLink Comment, {sap.ui.model.Model} prosData - Process Data
		 * @returns {Object} PayLoad(object)
		 */
		getDLinkPayLoad: function(cType, comment, prosData){
			var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			 var payload = {};
			 payload.Guid = OppGenInfoModel.Guid;
			 payload.OppDesc = comment;
			 payload.ItemGuid = OppGenInfoModel.ItemGuid;
			 payload.OppId = OppGenInfoModel.OppId;
			 payload.ItemNo = cType;
			 payload.RepFlag = "";
			 payload.NAV_CC_REMOVE = [];
			 for (var i = 0, n = 0; i < prosData.results.length; i++) {
				if (prosData.results[i].Selected === true) {
				    var obj = {};
				    obj.Guid = prosData.results[i].Guid;
					obj.OppDesc = "";
					obj.ItemGuid = prosData.results[i].ItemGuid;
					obj.OppId = prosData.results[i].OppId;
					obj.ItemNo = "";
					obj.RepFlag = "";
					payload.NAV_CC_REMOVE.push(obj);
				}
			 }
			 return payload;
		},
		/**
		 * This method Handles Customer Spec Rev1 File upload Complete Event.
		 * @name handleRevFileUploadComplete
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		handleRevFileUploadComplete: function(evt) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var uploadButton = evt.getSource().getParent().getParent().getItems()[1],
			    rowIndex = uploadButton.getId().split("-")[uploadButton.getId().split("-").length - 1],
			    r = evt.getSource().getParent().getParent().getParent().getCells()[1],
			    oTable = evt.getSource().getParent().getParent().getParent().getParent(),
			    tabBindingModel = evt.getSource().getModel().getData()[evt.getSource().getBindingContext().getPath().split("/")[1]].results;
			tabBindingModel[rowIndex].FileName = evt.getSource().getValue();
			thisCntrlr.oTable = oTable;
			thisCntrlr.tableModel = oTable.getModel().getData();
			tabBindingModel[rowIndex].uBvisible = true;
			tabBindingModel[rowIndex].bgVisible = !tabBindingModel[rowIndex].uBvisible;
			tabBindingModel[rowIndex].editable = false;
			thisCntrlr.Custno = this.getOwnerComponent().Custno;
			var SLUG = tabBindingModel[rowIndex].ItemGuid.replace(/-/g, "").toUpperCase() + "$$" + tabBindingModel[rowIndex].DocType + "$$" +            //PCR035760 Defect#131 TechUpgrade changes
			           tabBindingModel[rowIndex].DocSubtype + "$$ $$" + " " + "$$" + (thisCntrlr.Custno === " " ? " " : thisCntrlr.Custno) +
			            "$$" + tabBindingModel[rowIndex].FileName + "$$" + (tabBindingModel[rowIndex].Notes === " " ? " " :
			            tabBindingModel[rowIndex].Notes);
			if (!window.location.origin) {
				window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location
					.port ? ':' + window.location.port : '');
			}
			var file = evt.oSource.oFileUpload.files[0];
			this.oFileUploader = evt.getSource();
			this.oFileUploader.setSendXHR(true);
			this.oFileUploader.removeAllHeaderParameters();
			var sToken = this.disModel.getHeaders()['x-csrf-token'];
			this.disModel.refreshSecurityToken(function(e, o) {
				sToken = o.headers['x-csrf-token'];
				thisCntrlr.oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
					name: "X-CSRF-Token",
					value: sToken
				}));
				thisCntrlr.oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
					name: "slug",
					value: SLUG
				}));
				thisCntrlr.oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
					name: "content-type",
					value: file.type
				}));
				thisCntrlr.oFileUploader.upload();
			}, function() {}, false);
			myBusyDialog.close();
		},
		/**
		 * This Method Handles Reference Opportunity Not in the List Button Press Event.
		 * @name onPressNotInList
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		onPressNotInList: function(oEvent) {
			var oResource = this.getResourceBundle(),
			    oview = thisCntrlr.getView();
			if (oEvent.getSource().getText() === oResource.getText("S2PSRSDANTINLISTBTN")) {
				var PropArr = [{prp: "/RraRPSNATXT", val: oResource.getText("S2PSRSDACANBTNTXT")}, {prp: "/RraRPSNAICON",
						       val: oResource.getText("S2CANCELBTNICON")}, {prp: "/RraRPSNATyp", val: sap.m.ButtonType.Reject},
						       {prp: "/RraRpsNAtabVis", val: false},{prp: "/RraPreOppVis", val: false}, {prp: "/RraRefOppVis", val: true}];
				for(var i=0; i < PropArr.length; i++){
				    RraModel.setProperty(PropArr[i].prp, PropArr[i].val, thisCntrlr);
				}
			    this.dialog = sap.ui.xmlfragment(oResource.getText("PSRREFERENCEOPPSELCTDIALOG"), this);
				thisCntrlr.getCurrentView().addDependent(this.dialog);
				this.dialog.open();
				this.dialog.getContent()[0].getContent()[1].setValueState(sap.ui.core.ValueState.Error);
				this.dialog.getContent()[0].getContent()[1].setType(oResource.getText("S4DISRRATXTREFTXT"));                                                                         //PCR033306++
				this.dialog.getButtons()[0].setEnabled(false);
			}
		},
		/**
		 * This Method Handles Reference Opportunity Dialog Text Area Live Change Event.
		 * @name onRefOppChange
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		onRefOppChange: function(oEvent) {
			if (oEvent.getParameters().value.length <= 20 && oEvent.getParameters().value.length !== 0) {                                                                            //PCR033306++; modified length 10 to 20
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
				oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getButtons()[0].setEnabled(
					true);
			} else {
				oEvent.getSource().setValue(oEvent.getParameters().value.substring(0,21));                                                                                           //PCR033306++
				thisCntrlr.showToastMessage(this.getResourceBundle().getText("S4DISRRATXTREFNEGMSG"));                                                                               //PCR033306++
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getButtons()[0].setEnabled(
						false);
			}
		},
		/**
		 * This Method Handles Reference Opportunity Dialog Ok Button Press Event.
		 * @name onRefOkPress
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		onRefOkPress: function(oEvent) {
			var oResource = this.getResourceBundle(),
			    SelectedOppId = oEvent.getSource().getParent().getContent()[0].getContent()[1].getValue();
			if(SelectedOppId.trim() === ""){
				thisCntrlr.showToastMessage(oResource.getText("S4DISRRAOPPENAERRORMSG"));
			} else {
				 this.closeDialog();
				 if (SelectedOppId !== "") {
					 thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData().RevOppId = SelectedOppId;
					 var PropArr = [{prp: "/RraRefOppId", val: SelectedOppId}, {prp: "/RraRPSNATXT", val: oResource.getText(
							       "S2PSRSDANTINLISTBTN")},{prp: "/RraRPSNAICON", val: oResource.getText("S2SUBMTFORAPPBTN")},
							       {prp: "/RraRPSNATyp", val: sap.m.ButtonType.Emphasized}, {prp: "/RraRefIPEbl", val: false},
							       {prp: "/RraPreNABtnVis", val: false}, {prp: "/RraRpsNAtabVis", val: true}];
		             for(var i=0; i < PropArr.length; i++){
		            	 RraModel.setProperty(PropArr[i].prp, PropArr[i].val, thisCntrlr);
		             }
					 thisCntrlr.showToastMessage(oResource.getText("S2REFOPPSLCTSUCSSMSG"));
				}
			}
		},
		/**
		 * This Method is use For Reset Process Button Press Event.
		 * @name onResetProcess
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		onResetProcess: function(oEvent) {
			var oResource = this.getResourceBundle(),
			    Model = thisCntrlr.getDataModels(),
			    sValidate = oResource.getText("S4DISRRARSTCLDPTH") + Model[0].OppId + oResource.getText("S4DISRRARSTCLDPTH1") + Model[0].ItemNo.toString() + "'";
			this.serviceDisCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var ResetData = thisCntrlr.getModelFromCore(oResource.getText("S4DISCBCCCHILDLISTMODEL")).getData().results;
			thisCntrlr.ResetType = ResetData.length > 0 ? oResource.getText("S2RECRATEDEPTYPTEXT") : oResource.getText("S2RECRATEINDEPTYPTEXT");
			var ProcessType = oResource.getText("S2PSRDCRRATXTASC606"),
			    oModel = parseInt(Model[2].PsrStatus) < 60 ;
			this.dialog = sap.ui.xmlfragment(oResource.getText("PSRPDCONRESETConfirmation"), this);
			if (thisCntrlr.ResetType === oResource.getText("S2RECRATEDEPTYPTEXT") && oModel) {
				this.dialog.getContent()[1].setVisible(true);
				for(var i = 0; i < ResetData.length; i++){                                                                                                                           //PCR035760++
					 ResetData[i].Selectflag = ResetData[i].Selectflag === oResource.getText("S2ODATAPOSVAL") ? true : false;                                                        //PCR035760++
				}                                                                                                                                                                    //PCR035760++
				this.dialog.getContent()[1].setModel(this.getJSONModel({
					"ItemSet": ResetData
				}));
			}
			this.dialog.getContent()[1].getColumns()[0].getHeader().getBindingInfo("title").parts[0].path = "S2SELTODLINKTIT";
			this.getCurrentView().addDependent(this.dialog);
			this.dialog.open();
		},
		/**
		 * This method is used to handles Live Change Event From Reset Functionality.
		 * @name OnRsetCommLvchng
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		OnRsetCommLvchng: function(oEvent) {
			var DecNote = this.dialog.getContent()[0].getContent()[1],
				Maxlength = 255;
			if (DecNote.getValue().length >= Maxlength) {
				var decNoteTxt = DecNote.getValue().substr(0, Maxlength);
				DecNote.setValue(decNoteTxt);
				this.dialog.getButtons()[0].setEnabled(false);
				this.dialog.getButtons()[1].setEnabled(true);
				this.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCMCOMMVALTXT"));
			} else {
				this.dialog.getButtons()[0].setEnabled(true);
				this.dialog.getButtons()[1].setEnabled(true);
			}
		},
		/**
		 * This Method is use For Reset OK Button Press Event.
		 * @name resetConfirmationOK
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		resetConfirmationOK: function(oEvent) {
			var recreateMsg = this.dialog.getContent()[0].getContent()[1].getValue(),
			    ResetData = "",
				SuccessMsg = "",
				oResource = thisCntrlr.bundle;
			if (thisCntrlr.ResetType === oResource.getText("S2RECRATEDEPTYPTEXT")) {
				ResetData = this.dialog.getContent()[1].getModel() !== undefined ? this.dialog.getContent()[1].getModel().getData() : "";
			}
			this.dialog.close();
			this.dialog.destroy();
			var payload = {};
			var oModel = thisCntrlr.getDataModels(),
			    sdaType =  oResource.getText("S2PSRDCRRATXTASC606"),
			    processSubType = parseInt(oModel[2].PsrStatus) === 60 ? oResource.getText("S4DISRRASRRATXT") : oResource.getText("S4DISRRABRRATXT");
			sap.ui.core.BusyIndicator.show();
			if (thisCntrlr.ResetType === oResource.getText("S2RECRATEINDEPTYPTEXT") || processSubType === oResource.getText("S4DISRRASRRATXT")) {
				payload.Guid = oModel[0].Guid;
				payload.ItemGuid = oModel[0].ItemGuid;
				payload.Ptype = sdaType;
				payload.step = parseInt(oModel[2].PsrStatus) === 60 ? oResource.getText("S4DISRRASRRATXT") : oResource.getText("S4DISRRABRRATXT");
				payload.Comments = recreateMsg;
				SuccessMsg = sdaType + " " + processSubType + " " + oResource.getText("S2RECRATEPOSMSG");
				thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ResetSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, payload, SuccessMsg);
			} else if (thisCntrlr.ResetType === oResource.getText("S2RECRATEDEPTYPTEXT")) {
				payload.Guid = oModel[0].Guid;
				payload.ItemGuid = oModel[0].ItemGuid;
				payload.OppId = oModel[0].OppId;
				payload.ItemNo = oModel[0].ItemNo;
				payload.Ptype = sdaType;
				payload.Selectflag = "";
				payload.Comments = recreateMsg;
				if (ResetData !== "") {
					payload.nav_reset_child = [];
					for (var k = 0; k < ResetData.ItemSet.length; k++) {
						var obj = {};
						obj.Guid = ResetData.ItemSet[k].Guid;
						obj.ItemGuid = ResetData.ItemSet[k].ItemGuid;
						obj.ItemNo = ResetData.ItemSet[k].ItemNo;
						obj.OppId = ResetData.ItemSet[k].OppId;
						obj.Ptype = ResetData.ItemSet[k].Ptype;
						obj.Selectflag = ResetData.ItemSet[k].Selectflag !== oResource.getText("S2ODATAPOSVAL") ? "" : oResource.getText("S2ODATAPOSVAL");
						payload.nav_reset_child.push(obj);
					}
				}
				SuccessMsg = sdaType + " " + processSubType + " " + oResource.getText("S2RECRATEPOSMSG");
				thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ResetChildListSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, payload, SuccessMsg);
			}
			sap.ui.core.BusyIndicator.hide();			
			thisCntrlr.onLoadPrraData();
			var oModel = thisCntrlr.getDataModels();
			thisCntrlr.RraTabColorInit(oModel[2]);
		},
		/**
		 * This method Handles OK Button Event of lookUp Fragment.
		 * @name onOkPress
		 * @param
		 * @returns
		 */
		onOkPress: function(){
			this.lookUpList.close();
			this.lookUpList.destroy();
		},
		/**
		 * This method Handles Cancel Button Event of Reset Fragment.
		 * @name onCancelreset
		 * @param
		 * @returns
		 */
		onCancelreset: function() {
			this.dialog.close();
			this.dialog.destroy();
		},
		/**
		 * This method Handles SRRA Initiate Button Event.
		 * @name InitiateSRRAEvent
		 * @param
		 * @returns
		 */
		InitiateSRRAEvent: function(){
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var PropArr = [{prp: "/RraSFAppBtnVis", val: false},{prp: "/RraSipMadatSFPnlVis",  val: true}, {prp: "/RraBokRraPnlVis", val: true},
			               {prp: "/RraBokRraPnlExpd", val: true},{prp: "/RraSDetRBEbl",  val: true}, {prp: "/RraSDetSelIndex", val: 0},
			               {prp: "/RraResetLogPnlVis", val: false},{prp: "/RraChngHisPnlVis",  val: false}, {prp: "/RraDisBoxVis", val: false},
			               {prp: "/RraSpecTypSFVis", val: false},{prp: "/RraGenInfoDtaVis",  val: false}, {prp: "/RraWFConPnlVis", val: false},
			               {prp: "/RraSafPnlVis", val: false},{prp: "/RraDetSpecTypPnlVis",  val: false}, {prp: "/RraSpecTypSFVis", val: false},
			               {prp: "/RraCustSpecPnlVis", val: false},{prp: "/RraSpecTypSFVis",  val: false}, {prp: "/RraFnlSpecPnlVis", val: false},
			               {prp: "/RraSRraAprPnlVis", val: false},{prp: "/RraBRraAprPnlVis",  val: false}, {prp: "/RraMainCommPnlVis", val: false}];
			for(var i=0; i < PropArr.length; i++){
				RraModel.setProperty(PropArr[i].prp, PropArr[i].val, thisCntrlr);
			}
			myBusyDialog.close();
		},
		/**
		 * This method is used For Initiating SRRA Process Radio Button Event.
		 * @name onSelectSRBMandat
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		onSelectSRBMandat: function(oEvent) {
			var oView = this.getView();
			var oModel = thisCntrlr.getDataModels();
			var ValidateSSDA = this.checkUsersfromlist(oModel);
			if (ValidateSSDA === false) {
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2USERALLAUTHFALTTXT"));
			} else {
				if (oEvent.getParameters().selectedIndex === 1) {
					var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
					RraModel.setProperty("/RraSDetSelIndex", -1, thisCntrlr);
					this.InitiateSRRA();
					myBusyDialog.close();
				}
			}
		},
		/**
		 * This method is used For Initiating SRRA.
		 * @name InitiateSRRA
		 * @param
		 * @returns
		 */
		InitiateSRRA: function(){
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oModel = thisCntrlr.getDataModels(),
			    obj = RraModel.ssdaInitPayload(oModel, thisCntrlr);
			this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.DisRRAInfoSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText("S4DISRRASRRAPOSMSG"));
			thisCntrlr.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
			thisCntrlr.refereshRraData(true, false, false);
			thisCntrlr.that_views4.getController().getRefereshGenInfoData();
			thisCntrlr.setIconTabRRAFilterColor();
			myBusyDialog.close();
		},
		/**
		 * This method Handles Unlink Button Event.
		 * @name onPressUnLinkDoc
		 * @param
		 * @returns
		 */
		onPressUnLinkDoc: function() {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oResource = thisCntrlr.bundle,
			    sValidate = oResource.getText("S4DISRRACUTDOCLINKPTH2") + thisCntrlr.getOwnerComponent().Guid + oResource.getText("S4DISRRATCHPTH2") +
			        thisCntrlr.getOwnerComponent().ItemGuid + "')";
			this.serviceDisCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.remove, "", oResource.getText("S2PSRSDACBCCCSUCSSMSG"));
			thisCntrlr.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
			thisCntrlr.refereshRraData(true, false, false);
			myBusyDialog.close();
		},
		/**
		 * This Method Handles Reference Opportunity Dialog Close Event.
		 * @name onRefcloseDialog
		 * @param
		 * @returns
		 */
		onRefcloseDialog: function() {
			this.dialog.close();
			this.dialog.destroy();
			var oView = thisCntrlr.getView();
			var PropArr = [{prp: "/RraRPSNATXT", val: thisCntrlr.bundle.getText("S2PSRSDANTINLISTBTN")},{prp: "/RraRPSNAICON",
				           val: thisCntrlr.bundle.getText("S2SUBMTFORAPPBTN")}, {prp: "/RraRPSNATyp", val: sap.m.ButtonType.Emphasized},
				           {prp: "/RraRefOppVis", val: false}, {prp: "/RraPreOppVis", val: true}];
			for(var i=0; i < PropArr.length; i++){
				RraModel.setProperty(PropArr[i].prp, PropArr[i].val, thisCntrlr);
			}
		},
		/**
		 * This method Handles On Upload Complete Event.
		 * @name onEvidenceUploadComplete
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		onEvidenceUploadComplete: function(oEvent) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oResource = thisCntrlr.getResourceBundle();
			if (oEvent.getParameters().status === 201) {
				thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCATTDOCUPLDSUCSSMSG"));
			} else if (oEvent.getParameters().status === 400) {				
				thisCntrlr.showToastMessage($(oEvent.mParameters.responseRaw).find(oResource.getText("S2CBCPSRCARMTYPEMESG")).text());
			}
			thisCntrlr.onPSRRRADataSave(oResource.getText("S2PSRSDASAVETXT"));
			thisCntrlr.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
			thisCntrlr.refereshRraData(true, false, false);
			myBusyDialog.close();
		},
		/**
		 * This method Handles RRA Questions Note live change Event.
		 * @name handleRRANoteCommLiveChange
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		handleRRANoteCommLiveChange: function(oEvent){
			var oResource = thisCntrlr.getResourceBundle(),
		        selVal = oEvent.getSource().getValue();
			if (selVal.length >= 255) {
				selVal = selVal.substr(0, 254);
				this.showToastMessage(oResource.getText("S2PSRSDACBCMCOMMVALTXT"));
			}
			var oRraQesData = this.getView().getModel().getData().NAV_RRA_QA.results,
			    changeLine = oEvent.getSource().getParent().getBindingContext().getPath().split("/")[3],
			    RraData = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData(),
			    selQid = oRraQesData[changeLine].Qid,
			    RraProp = RraModel.getRraProty(parseInt(RraData.PsrStatus), oResource);			
			for(var i =0; i < RraData.NAV_RRA_QA.results.length; i++){
				if(RraData.NAV_RRA_QA.results[i].Qid === selQid){
					RraData.NAV_RRA_QA.results[i][RraProp[0]] = selVal;
				}
			}
			oRraQesData[changeLine][RraProp[0]] = selVal;
			oRraQesData[changeLine][RraProp[1]] = selVal === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText("S2DELNAGVIZTEXT");
			this.getView().getModel().getData().NAV_RRA_QA = {"results":RraModel.loadRraQa(RraData.NAV_RRA_QA.results.map(RraModel.myFunction),
					parseInt(RraData.PsrStatus), selQid, true, this, oResource.getText("S4DISRRABRRATXT"))};
			thisCntrlr.getView().getModel().refresh(true);
		},
		/**
		 * This method Handles On Determine Specification Question Selection Event.
		 * @name OnDetmineSST
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		OnDetmineSST: function(oEvent){
			thisCntrlr.MandateData = {};
			RraModel.OnDetmineSST(oEvent, thisCntrlr);
		},
		/**
		 * This method Handles On LookUp Button Event.
		 * @name onLookUp
		 * @param {sap.ui.base.Event} evt - Holds the current event
		 * @returns
		 */
		onLookUp: function(oEvent){
			RraModel.onPsrLookUp(oEvent, thisCntrlr);
		}
	});
});