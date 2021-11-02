/** ------------------------------------------------------------------------------*
 * This class holds all methods of Display ESA page.                              *
 * -------------------------------------------------------------------------------*
 * @class                                                                         *
 * @public                                                                        *
 * @author Abhishek Pant                                                          *
 * @since 25 November 2019                                                        *
 * @extends com.amat.crm.opportunity.controller.BaseController                    *
 * @name com.amat.crm.opportunity.controller.disp_ESA                             *
 *  * ----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 25/01/2021      Abhishek        PCR033306         Q2C Display Enhancements     *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 **********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController",
		"com/amat/crm/opportunity/controller/disp_CommController",
		"com/amat/crm/opportunity/model/disEsaModel"
	],
	function (Controller, CommonController, disEsaModel) {
		"use strict";
		var thisCntrlr, oCommonController, that_dis_general;
	return Controller.extend("com.amat.crm.opportunity.controller.disp_esa", {
		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */
		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 *
		 * @memberOf view.esa
		 */
		onInit: function () {
			thisCntrlr = this;
			thisCntrlr.bundle = this.getResourceBundle();
			thisCntrlr.detActionType = "";
			this.disModel = new sap.ui.model.odata.ODataModel(this.bundle.getText("S4DISSERVEURL"),true);
			thisCntrlr.that_views4 = this.getOwnerComponent().s4;
			oCommonController = new CommonController();
		},
		/**
		 * This method Used for call after Rendering done.
		 * @name onAfterRendering
		 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		onAfterRendering: function (thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
		},
		/**
		 * This method Used for Initiate Other Controller Variable.
		 * @name _initiateControllerObjects
		 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		_initiateControllerObjects: function (thisCntrlr) {
			if (thisCntrlr.that_views4 === undefined) {
				thisCntrlr.that_views4 = this.getOwnerComponent().s4;
			}
			if (that_dis_general === undefined) {
				that_dis_general = this.getOwnerComponent().dis_general;
			}
		},
		/**
		 * This method use to load ESA/IDS view.
		 * @name onLoadEsa
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onLoadEsa: function (oEvent) {
			this._initiateControllerObjects(thisCntrlr);
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oResource = thisCntrlr.getResourceBundle(),
			    OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")),
				VerType = "",
				VerNo = "",
				oModel = "";
			var Guid = OppGenInfoModel.getData().Guid;
			var ItemGuid = OppGenInfoModel.getData().ItemGuid;
			if ((oEvent !== undefined || parseInt(oEvent) === 0) && oEvent.Type === oResource.getText("S1ESAIDSPROSTYPTXT")) {
				thisCntrlr.getRefreshEsaData(oEvent.Guid, oEvent.ItemGuid, oEvent.VerNo);
				oModel = thisCntrlr.getDataModels();
				VerType = parseInt(oEvent.VerNo) === oModel[4].NAV_VER_INFO.results.length ? oResource.getText("S1PERDLOG_CURRTXT") :
					oResource.getText("S2ESAOLDVERKEY");
				VerNo = parseInt(oEvent.VerNo);
			} else {
				thisCntrlr.getRefreshEsaData(Guid, ItemGuid, "");
				oModel = thisCntrlr.getDataModels();
				VerType = oResource.getText("S1PERDLOG_CURRTXT");
				VerNo = "";
			}
			var EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], VerType, VerNo, oModel[3], oModel[4], oModel[4].Status, false, false,
				false);
			thisCntrlr.setViewData(EsaModel);
			//thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESATAMBALBL).removeStyleClass("sapMEsaEditModeMargin");                                                    //PCR033306--
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAMASAGRLBL).removeStyleClass("sapMEsaEditModeMargin");
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESACTAVPALBL).removeStyleClass("sapMEsaEditModeMargin");
			thisCntrlr.EsaTabColorInit();
			myBusyDialog.close();
		},
		/**
		 * This method use to collect all models data.
		 * @name getDataModels
		 * @param
		 * @returns
		 */
		getDataModels: function () {
			var oResource = thisCntrlr.getResourceBundle(),
			    GeneralInfodata = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData(),
			    PSRInfoData = "", PSRModel = "",
			    SecurityData = this.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData(),
			    EsaData = this.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
			return [GeneralInfodata, PSRInfoData, PSRModel, SecurityData, EsaData];
		},
		/**
		 * This method Handles to set ESA view model.
		 * @name setViewData
		 * @param {sap.ui.model.Model} EsaModel - EsaModel
		 * @returns
		 */
		setViewData: function (EsaModel) {
			var oEsaModel = thisCntrlr.getJSONModel(EsaModel);
			thisCntrlr.getView().setModel(oEsaModel);
		},
		/**
		 * This method use to get refresh ESA model from back-end.
		 * @name getRefreshEsaData
		 * @param {String} mGuid - Opportunity GUID, {String} mItemGuid - Opportunity ItemGuid, {String} mVersion - requested ESA version
		 * @returns
		 */
		getRefreshEsaData: function (mGuid, mItemGuid, mVersion) {
			var oResource = thisCntrlr.getResourceBundle(),
			    sValidate = oResource.getText("S4DISESAINFOPTH") + mGuid + oResource.getText("S4DISRRATCHPTH2") + mItemGuid +
			    oResource.getText("S4DISESAINFOPTH1") + mVersion + oResource.getText("S4DISESAINFOPTH2") + oResource.getText("S4DISESAINFOPTH3");
			this.serviceDisCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
		},
		/**
		 * This method use to press on initiate/NA decision radio button.
		 * @name onPressInitiateStdEsa
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onPressInitiateStdEsa: function (oEvent) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oResource = thisCntrlr.getResourceBundle(),
			    UserAuth = thisCntrlr.checkUsersfromlist();
			if (UserAuth === false) {
				thisCntrlr.showToastMessage(oResource.getText("S4DISESAINITAUTHERRORMSG"));
				thisCntrlr.getView().getModel().setProperty("/EsaDecnBoxSelIndex", -1);
			} else {
				var oModel = thisCntrlr.getDataModels(),
				    actionType = oEvent.getSource().getSelectedIndex() === 1 ? oResource.getText("S2ESAINITKEY") : oResource.getText("S2NEGMANDATANS");
				var msg = oEvent.getSource().getSelectedIndex() === 1 ? oResource.getText("S2ESAINITPMSG") : oResource.getText("S2ESAINITNMSG");
				var payload = disEsaModel.esaInitpayload(oModel[0].Guid, oModel[0].ItemGuid, actionType, parseInt(oModel[4].VersionNo, oModel[0].ProductLine));
				this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, payload, msg);
				thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, "");
				var EsaData = this.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData(), EsaModel = "";
				if (oEvent.getSource().getSelectedIndex() === 1) {
					EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
						EsaData, EsaData.Status, true, false, false);
					//thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESATAMBALBL).addStyleClass("sapMEsaEditModeMargin");                                               //PCR033306--
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAMASAGRLBL).addStyleClass("sapMEsaEditModeMargin");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESACTAVPALBL).addStyleClass("sapMEsaEditModeMargin");
				} else if (oEvent.getSource().getSelectedIndex() === 2) {
					EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
						EsaData, EsaData.Status, false, false, false);
				}
				thisCntrlr.setViewData(EsaModel);
				thisCntrlr.that_views4.getController().getRefereshGenInfoData();
				thisCntrlr.EsaTabColorInit();
			}
			myBusyDialog.close();
		},
		/**
		 * This method Handles Post action on CA or CNA.
		 * @name onEsaInit
		 * @param {String} Msg - on success message
		 * @returns
		 */
		onEsaInit: function (Msg) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oResource = thisCntrlr.getResourceBundle(),
			    oModel = thisCntrlr.getDataModels();
			var payload = disEsaModel.esaInitpayload(oModel[0].Guid, oModel[0].ItemGuid, oResource.getText("S1TABLESALESTAGECOL"),
				parseInt(oModel[4].VersionNo, oModel[0].ProductLine));
			this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity.util.ServiceConfigConstants
				.write, payload, Msg);
			thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, "");
			var EsaData = this.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
			myBusyDialog.close();
			return disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3], EsaData,
				EsaData.Status, false, false, false);
		},
		/**
		 * This method Handles Main Comment Note Live Change Event.
		 * @name OnEsaMainCommLvchng
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		confirmationEsaCanInit: function (oEvent) {
			if (oEvent === thisCntrlr.bundle.getText("S2F4HELPOPPOKBTN")) {
				var msg = thisCntrlr.bundle.getText("S2ESACANINITPMSG");
				var EsaModel = thisCntrlr.onEsaInit(msg);
				thisCntrlr.setViewData(EsaModel);
				thisCntrlr.EsaTabColorInit();
			}
		},
		/**
		 * This method Handles Main Comment Note Live Change Event.
		 * @name OnEsaMainCommLvchng
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		confirmationEsaNAInit: function (oEvent) {
			if (oEvent === thisCntrlr.bundle.getText("S2F4HELPOPPOKBTN")) {
				var msg = thisCntrlr.bundle.getText("S2ESACANNAINITPMSG");
				var EsaModel = thisCntrlr.onEsaInit(msg);
				thisCntrlr.setViewData(EsaModel);
				thisCntrlr.that_views4.getController().getRefereshGenInfoData();
				thisCntrlr.EsaTabColorInit();
			}
		},
		/**
		 * This method Handles Submit button event.
		 * @name onSubmitEsa
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onSubmitEsa: function (oEvent) {
			var oResource = thisCntrlr.getResourceBundle(),
			    UserAuth = thisCntrlr.checkUsersfromlist();
			if (UserAuth === false) {
				thisCntrlr.showToastMessage(oResource.getText("S4DISESA5AUTHERRORMSG"));
			} else {
				var Mesg = "";
				switch (oEvent.getSource().getText()) {
				case oResource.getText("S2PSRSDASFBTNCANNATXT"):
					Mesg = oResource.getText("S2ESACANNAINITVERMSG");
					sap.m.MessageBox.confirm(Mesg, this.confirmationEsaNAInit, oResource.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
					break;
				case oResource.getText("S2PSRSDASFCANINITXT"):
					Mesg = oResource.getText("S2ESACANNAINITVERMSG");
					sap.m.MessageBox.confirm(Mesg, this.confirmationEsaCanInit, oResource.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
					break;
				case oResource.getText("S2PSRSDASUBFORAPP"):
					var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
					this.onSaveESAIDS(oResource.getText("S1TABLESALESTAGECOL"), oResource.getText("S2ATTCHSUBMTSUCSSMSG"), false);
					thisCntrlr.EsaTabColorInit();
					thisCntrlr.that_views4.getController().onNavBack();
					myBusyDialog.close();
					break;
				}
			}
		},
		/**
		 * This method Handles Save Button Event.
		 * @name onSaveEsa
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onSaveEsa: function (oEvent) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oResource = thisCntrlr.getResourceBundle(),
			    UserAuth = thisCntrlr.checkUsersfromlist();
			if (UserAuth === false) {
				thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
			} else {
				this.onSaveESAIDS(oResource.getText("S2PSRDCNASHPODKEY"), oResource.getText("S2ESASAVPOSMSG"), false);
				var attTab = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESARESATCHTAB);
				if (attTab.getModel().getData().ItemSet.length > 0) {
					for (var i = 0; i < attTab.getModel().getData().ItemSet.length; i++) {
						if (attTab.getItems()[i].getCells()[3].getItems()[0].getItems()[0].getIcon() === oResource.getText("S2PSRSDASAVEICON")) {
							attTab.getItems()[i].getCells()[3].getItems()[0].getItems()[0].setIcon(oResource.getText("S2PSRSDAEDITICON"));
							attTab.getItems()[i].getCells()[3].getItems()[0].getItems()[1].setIcon(oResource.getText("S2PSRSDADELETEICON"));
						}
					}
				}
			}
			myBusyDialog.close();
		},
		/**
		 * This method Handles Edit Button Event.
		 * @name onEditESAIDS
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onEditESAIDS: function () {
			var UserAuth = thisCntrlr.checkUsersfromlist(),
			    oResource = thisCntrlr.getResourceBundle(),
			    EsaoData = this.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData(),
			    OmInitiateFlag = this.checkContact(EsaoData.NAV_OM.results),
			    SlsInitiateFlag = this.checkContact(EsaoData.NAV_SLS.results),
			    oModel = thisCntrlr.getDataModels(),
				EsaModel = "";
			if (UserAuth === false && (OmInitiateFlag || SlsInitiateFlag)) {
				var RPFlag = true;
				RPFlag = thisCntrlr.getView().getModel().getProperty("/EditBtnTxt") === oResource.getText("S2CARMBTNEDIT") ? true : false;
				EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
					oModel[4], oModel[4].Status, false, false, RPFlag);
				thisCntrlr.setViewData(EsaModel);
			} else {
				if (UserAuth === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
				} else {
					if (thisCntrlr.getView().getModel().getProperty("/EditBtnTxt") === oResource.getText("S2CARMBTNEDIT")) {
						EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
							oModel[4], oModel[4].Status, true, false, false);
						if (parseInt(oModel[4].Status) === 5) {
							//thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESATAMBALBL).addStyleClass("sapMEsaEditModeMargin");                                       //PCR033306--
							thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAMASAGRLBL).addStyleClass("sapMEsaEditModeMargin");
							thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESACTAVPALBL).addStyleClass("sapMEsaEditModeMargin");
						}
					} else {
						EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
							oModel[4], oModel[4].Status, false, false, false);
						//thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESATAMBALBL).removeStyleClass("sapMEsaEditModeMargin");                                        //PCR033306--
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAMASAGRLBL).removeStyleClass("sapMEsaEditModeMargin");
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESACTAVPALBL).removeStyleClass("sapMEsaEditModeMargin");
					}
					thisCntrlr.setViewData(EsaModel);
				}
			}
		},
		/**
		 * This method Handles to check owner user access.
		 * @name checkUsersfromlist
		 * @param
		 * @returns {Boolean} checkFlag - Access boolean value
		 */
		checkUsersfromlist: function () {
			var oResource = thisCntrlr.getResourceBundle(),
			    checkFlag = false,
				OmInitiateFlag = false,
				SlsInitiateFlag = false,
				EsaData = this.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData(),
				GenInfoData = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();
			switch (parseInt(EsaData.Status)) {
			case 0:
			case 95:
				OmInitiateFlag = this.checkContact(GenInfoData.NAV_OM_INFO.results);
				SlsInitiateFlag = this.checkContact(GenInfoData.NAV_SLS_INFO.results);
				checkFlag = OmInitiateFlag === true || SlsInitiateFlag === true ? true : false;
				break;
			case 35:
			case 5:
				OmInitiateFlag = this.checkContact(EsaData.NAV_OM.results);
				SlsInitiateFlag = this.checkContact(EsaData.NAV_SLS.results);
				checkFlag = OmInitiateFlag === true || SlsInitiateFlag === true ? true : false;
				break;
			case 10:
				checkFlag = parseInt(EsaData.TaskId) !== 0 ? true : false;
				break;
			}
			return checkFlag;
		},
		/**
		 * This method Used to Check Login User With Contact List.
		 * @name checkContact
		 * @param {Object Array} UserList - checking contact User List
		 * @returns {Boolean} checkFlag - Boolean value
		 */
		checkContact: function (UserList) {
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
		 * This method Handles on version selection change Event.
		 * @name onEsaVerSelectionChange
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onEsaVerSelectionChange: function (oEvent) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oModel = thisCntrlr.getDataModels(),
			    oResource = thisCntrlr.getResourceBundle(),
			    CrntVer = oModel[4].NAV_VER_INFO.results[oModel[4].NAV_VER_INFO.results.length - 1].VersionNo,
			    ReqVer = oEvent.getParameters().selectedItem.getText();
			if (ReqVer === oResource.getText("S2ESAVERBYDEFKEY")) {
				thisCntrlr.showToastMessage(oResource.getText("S2ESAVERBYDEFNEGKEY"));
			} else {
				var EsaData = "",
					EsaModel = "";
				if (parseInt(ReqVer) === parseInt(CrntVer)) {
					thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, parseInt(CrntVer));
					EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
					EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), parseInt(ReqVer), oModel[
						3], EsaData, EsaData.Status, false, false, false);
				} else if (parseInt(ReqVer) < parseInt(CrntVer)) {
					thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, parseInt(oEvent.getSource().getSelectedItem().getText()));
					EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
					EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S2ESAOLDVERKEY"), parseInt(ReqVer), oModel[3],
						EsaData, EsaData.Status, false, false, false);
				}
				thisCntrlr.setViewData(EsaModel);
				thisCntrlr.EsaTabColorInit();
			}
			myBusyDialog.close();
		},
		/**
		 * This method Handles Main Comment Note Live Change Event.
		 * @name OnEsaMainCommLvchng
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		OnEsaMainCommLvchng: function (oEvent) {
			oCommonController.commMainCommLvchng(oEvent, thisCntrlr.getResourceBundle(), thisCntrlr, thisCntrlr.getView().byId("idDispS2EsaMainComSaveBtn"));
		},
		/**
		 * This method Handles Main Comment Save Event.
		 * @name onSaveEsaMainCom
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onSaveEsaMainCom: function (oEvent) {
			var oResouceBundle = thisCntrlr.getResourceBundle(),
			    oView = thisCntrlr.getView(),
			    MTxtAra = oView.byId(com.amat.crm.opportunity.Ids.S4DISESAMINCOMTXTAREA);
			if (!(oEvent.getSource().getParent().getFields()[0].getValue().match(/\S/))) {
				thisCntrlr.showToastMessage(oResouceBundle.getText("S2MAINCOMMBLANKMSG"));
				MTxtAra.setValue("");
			} else {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				oCommonController.commSaveMainCom(oEvent, oResouceBundle.getText("S1ESAIDSPROSTYPTXT"), oResouceBundle, MTxtAra,
						oView.byId(com.amat.crm.opportunity.Ids.S4DISESAMINCOMTTAB), oView.byId(com.amat.crm.opportunity.Ids.
								S4DISESAMINCOMMSAVBTN), thisCntrlr);
				myBusyDialog.close();
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
				thisCntrlr.onSaveFormData();
				oCommonController.commonContactOkPressed(oEvent, thisCntrlr);
			}
		},
		/**
		 * This method Handles Add Contact Button Event.
		 * @name onPressAddContact
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onPressAddContact: function (oEvent) {
			oCommonController.commonPressAddContact(oEvent, thisCntrlr, thisCntrlr.bundle.getText("S1ESAIDSPROSTYPTXT"));
		},
		/**
		 * This method Handles Contact Dialog On Selection Event.
		 * @name contactSucess
		 * @param {String} Msg - Success Message
		 * @returns
		 */
		contactSucess: function (Msg) {
			oCommonController.commonContactSuccess(Msg, thisCntrlr);
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
			var delFlag = thisCntrlr.checkMContact(oEvent.getParameters().listItem.getBindingContext().getPath().split("/")[1].substring(4),
				thisCntrlr.bundle.getText("S2PSRDCNADEFERKEY"));
			if (delFlag[0] === true) {
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCCONTACTDELNEGMSG"));
			} else {
				thisCntrlr.onSaveFormData();
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
			var oResource = thisCntrlr.getResourceBundle(),
			    EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData(),
				minDFlag = false,
				minSFlag = false;
			if (mCheckTyp === oResource.getText("S2PSRDCNADEFERKEY")) {
				switch (mConType) {
				case oResource.getText("S4DISCONOMTXT"):
					minDFlag = EsaData.NAV_OM.results.length === 1 ? true : false;
					break;
				case oResource.getText("S4DISESALGLCONCTKEY"):
					minDFlag = EsaData.NAV_LGL.results.length === 1 ? true : false;
					break;
				case oResource.getText("S2PSRWFAPPPANLGPMINFOCONTIT"):                                                                                                               //PCR033306++; corrected text
					minDFlag = EsaData.NAV_GPM.results.length === 1 ? true : false;
					break;
				case oResource.getText("S4DISCONBMTXT"):
					minDFlag = EsaData.NAV_BMHEAD.results.length === 1 ? true : false;
					break;
				case oResource.getText("S2CONKEY"):
					minDFlag = EsaData.NAV_CON.results.length === 1 ? true : false;
					break;
				case oResource.getText("S2ESAIDSACCGMKEY"):
					minDFlag = EsaData.NAV_AGM.results.length === 1 ? true : false;
					break;
				case oResource.getText("S2SLSKEY"):
					minDFlag = EsaData.NAV_SLS.results.length === 1 ? true : false;
					break;
				case oResource.getText("S2ESAIDSCONINFOSCFOTIT"):
					minDFlag = EsaData.NAV_SCFO.results.length === 1 ? true : false;
					break;
				case oResource.getText("S2ESAIDSCONINFORGCNCKEY"):
					minDFlag = EsaData.NAV_GC.results.length === 1 ? true : false;
					break;
				case oResource.getText("S2ESAIDSCONINFORRSKMANKEY"):
					minDFlag = EsaData.NAV_RM.results.length === 1 ? true : false;
					break;
				case oResource.getText("S2ESAIDSCONINFOORCATIT"):
					minDFlag = EsaData.NAV_ORCA.results.length === 1 ? true : false;
					break;
				case oResource.getText("S2ESAIDSCONINFOBUGMKEY"):
					minDFlag = EsaData.NAV_BUGM.results.length === 1 ? true : false;
					break;
				}
			} else if (mCheckTyp === oResource.getText("S2CBCANSSUCCESSKEY")) {
				if (EsaData.NAV_OM.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResource.getText("S4DISCONOMTXT")];
					return minSFlag;
				}
				if (EsaData.NAV_LGL.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResource.getText("S4DISESALGLCONCTTXT")];
					return minSFlag;
				}
				if (EsaData.NAV_GPM.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResource.getText("S2PSRWFAPPPANLGPMINFOCONTIT")];                                                                                            //PCR033306++;text corrected
					return minSFlag;
				}
				if (EsaData.NAV_BMHEAD.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResource.getText("S4DISCONBMTXT")];
					return minSFlag;
				}
				if (EsaData.NAV_CON.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResource.getText("FRAGLLCONTR")];
					return minSFlag;
				}
				if (EsaData.NAV_AGM.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResource.getText("S2ESAIDSACCGMTITTXT")];
					return minSFlag;
				}
				if (EsaData.NAV_SLS.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResource.getText("S2ESAIDSSALEPERTIT")];
					return minSFlag;
				}
				if (EsaData.NAV_SCFO.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResource.getText("S2ESAIDSCONINFOSCFOTIT")];
					return minSFlag;
				}
				if (EsaData.NAV_GC.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResource.getText("S2ESAIDSGCCTXTKYE")];
					return minSFlag;
				}
				if (EsaData.NAV_RM.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResource.getText("S2ESAIDSCONINFORSKMGTTIT")];
					return minSFlag;
				}
				if (EsaData.NAV_ORCA.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResource.getText("S2ESAIDSCONINFOORCATIT")];
					return minSFlag;
				}
				if (EsaData.NAV_BUGM.results.length > 0) minSFlag = [true, ""];
				else {
					minSFlag = [false, oResource.getText("S2ESAIDSCONINFOBUGMTIT")];
					return minSFlag;
				}
			}
			if (mConType === "" && minSFlag[0] === true) {
				return minSFlag;
			}
			return [minDFlag, minSFlag];
		},
		/**
		 * This method Handles Edit Button Press Event.
		 * @name handleEditPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		handleEditPress: function (oEvent) {
			thisCntrlr.onSaveFormData();
			oCommonController.commonEditPress(oEvent, thisCntrlr);
		},
		/**
		 * This method Handles Add Button Press Event.
		 * @name handleAddPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		handleAddPress: function (oEvent) {
			thisCntrlr.onSaveFormData();
			oCommonController.commonAddPress(oEvent, thisCntrlr);
		},
		/**
		 * This method is used to handles Note Live Change Event.
		 * @name handleNoteLiveChange
		 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		handleNoteLiveChange: function (oEvent) {
			oCommonController.commonNoteLiveChange(oEvent, thisCntrlr);
		},
		/**
		 * This method Handles File Name Press Event.
		 * @name handleLinkPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		handleLinkPress: function (oEvent) {
			var oResource = thisCntrlr.getResourceBundle();
			var rowIndex = oEvent.getSource().getParent().getId().split("-")[oEvent.getSource().getParent().getId().split(
				"-").length - 1];
			var oData = oEvent.getSource().getParent().getParent().getModel().getData().ItemSet[rowIndex];
			var url = this.disModel.sServiceUrl + oResource.getText("S4DISRRATCHPTH1") + oData.Guid + oResource.getText("S4DISRRATCHPTH2") + oData.itemguid +
			     oResource.getText("S4DISRRATCHPTH3") + oData.doctype + oResource.getText("S4DISRRATCHPTH4") + oData.docsubtype + oResource.getText(
			    	"S4DISRRATCHPTH5") + oData.DocId + "')/$value";
			window.open(url);
		},
		/**
		 * This method Validates Delete Button Press Event.
		 * @name CheckEsaDelete
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		CheckEsaDelete: function (oEvent) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			thisCntrlr.onSaveFormData();
			thisCntrlr.rowIndex = oEvent.getSource().getParent().getParent().getParent().getId().split("-")[oEvent.getSource()
				.getParent().getParent().getParent().getId().split("-").length - 1];
			thisCntrlr.oEvent = oEvent;
			thisCntrlr.source = oEvent.getSource();
			thisCntrlr.oTable = oEvent.getSource().getParent().getParent().getParent().getParent();
			var oResource = thisCntrlr.getResourceBundle();
			if (thisCntrlr.source.getIcon().indexOf(oResource.getText("S2ATTCHDOCDELVALDDELTXT").toLowerCase()) >=
				0) {
				var text = oResource.getText("S2ATTCHDOCDELVALDMSG") + " " + thisCntrlr.oTable.getModel()
					.getData().ItemSet[thisCntrlr.rowIndex].DocDesc + oResource.getText("S2ATTCHDOCDELVALDMSG2NDPRT");
				var box = new sap.m.VBox({
					items: [
						new sap.m.Text({
							text: text
						})
					]
				});
				sap.m.MessageBox.show(box, {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: oResource.getText("S2ATTCHDOCDELVALDCONTXT"),
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
			thisCntrlr.onSaveFormData();
			oCommonController.commonDeletePress(event, thisCntrlr);
		},
		/**
		 * This method Handles Search Contact Button Event.
		 * @name searchContact
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		searchContact: function (oEvent) {			
			var oEventParameters = oEvent.getParameters(),
			    searchText = "", contactData = "",
			    oResource = thisCntrlr.getResourceBundle(),
			    contactType = oEvent.getSource().getParent().getParent().getParent().getController().contactType;
			if (oEventParameters.hasOwnProperty(oResource.getText("S2TYPECONTCTPROPTXT"))) {
				searchText = oEventParameters.newValue;
				if (searchText.length < 3) return;
			} else searchText = oEventParameters.query;
			this.contactF4Fragment.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
				"ItemSet": []});
			var sContact = oResource.getText("S4DISRRACONSRHPTH") + searchText + oResource.getText("S4DISRRACONSRHPTH2") + contactType + "'";
			if (searchText.length !== 0) {
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
		 * This method Handles attachments upload functionality.
		 * @name onEsaUploadComplete
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onEsaUploadComplete: function (oEvent) {
			thisCntrlr.onSaveFormData();
			thisCntrlr.Custno = null;
			this.oFileUploader = null;
			var uploadButton = oEvent.getSource().getParent().getParent().getItems()[1],
			    oResource = thisCntrlr.getResourceBundle(),
				type = "",
				rowIndex = uploadButton.getId().split("-")[uploadButton.getId().split("-").length - 1],
				oTable = oEvent.getSource().getParent().getParent().getParent().getParent();
			oTable.getModel().getData().ItemSet[rowIndex].filename = oEvent.getSource().getValue();
			thisCntrlr.oTable = oTable;
			thisCntrlr.tableModel = oTable.getModel().getData();
			thisCntrlr.Custno = this.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData().Custno;
			oTable.getModel().getData().ItemSet[rowIndex].uBvisible = true;
			oTable.getModel().getData().ItemSet[rowIndex].bgVisible = !oTable.getModel().getData().ItemSet[rowIndex]
				.uBvisible;
			oTable.getModel().getData().ItemSet[rowIndex].editable = false;
			if (oTable.getModel().getData().ItemSet[rowIndex].doctype === oResource.getText("S2MLIMCOMMDATATYP") && oTable.getModel().getData()
				.ItemSet[rowIndex].docsubtype === oResource.getText("S2ATTOTHTYPETEXT") || oTable.getModel().getData().ItemSet[rowIndex]
				.Code === oResource.getText("S2OTHDOCCODETEXT")) {
				type = oResource.getText("S2OTHDOCCODETEXT");
			} else {
				type = "";
			}
			var SLUG = oTable.getModel().getData().ItemSet[rowIndex].itemguid.replace(/-/g, "").toUpperCase() + "$$" + oTable.getModel()                       //PCR035760 Defect#131 TechUpgrade changes
				.getData().ItemSet[rowIndex].doctype + "$$" + oTable.getModel().getData().ItemSet[rowIndex].docsubtype +
				"$$" + type + "$$" + " " + "$$" + thisCntrlr.Custno + "$$" + oTable.getModel().getData().ItemSet[
					rowIndex].filename + "$$" + (oTable.getModel().getData().ItemSet[rowIndex].note === " " ? " " :
					oTable.getModel().getData().ItemSet[rowIndex].note);
			var file = oEvent.getSource().oFileUpload.files[0];
			this.oFileUploader = oEvent.getSource();
			this.oFileUploader.setSendXHR(true);
			this.oFileUploader.removeAllHeaderParameters();
			var sToken = this.disModel.getHeaders()['x-csrf-token'];
			this.disModel.refreshSecurityToken(function (e, o) {
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
			}, function () {}, false);
			uploadButton.setVisible(false);
			var buttonGroup = oEvent.getSource().getParent().getParent().getItems()[0];
			buttonGroup.setVisible(true);
		},
		/**
		 * This method Handles upload Complete Event.
		 * @name onComplete
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onEsaComplete: function (oEvent) {
		    var oResource = thisCntrlr.getResourceBundle();
			if (oEvent.getParameters().status === 201) {
				thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCATTDOCUPLDSUCSSMSG"));

			} else if (oEvent.getParameters().status === 400) {
				sap.m.MessageToast.show($(oEvent.getParameters().responseRaw).find(oResource.getText("S2CBCPSRCARMTYPEMESG"))[0].innerText, {
					duration: 5000
				});
			}
			var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
			thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, parseInt(EsaData.VersionNo));
			var oModel = thisCntrlr.getDataModels();
			var EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
				oModel[4], oModel[4].Status, true, false, false);
			thisCntrlr.setViewData(EsaModel);
		},
		/**
		 * This method used to set view binding model Property.
		 * @name setProperty
		 * @param {String} Prop - Property Name, {String} Value - Property Value
		 * @returns
		 */
		setProperty: function(Prop, Value){
			thisCntrlr.getView().getModel().setProperty(Prop, Value);
		},
		/**
		 * This method used to set view elements Visibility.
		 * @name setPropArray
		 * @param {Array} PropArr - View property Array
		 * @returns
		 */
		setPropArray: function(PropArr){
			for(var i=0; i < PropArr.length; i++){
				this.setProperty(PropArr[i].prp, PropArr[i].val);
            }
		},
		/**
		 * This method Handles ESA Radio Button Select Event.
		 * @name onPressRdEsa
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onPressRdEsa: function (oEvent) {
			var oResource = this.getResourceBundle(),
			    EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData(),
			    sourceId = oEvent.getSource().getId().split("--")[oEvent.getSource().getId().split("--").length - 1],
			    SelIndex = oEvent.getParameters().selectedIndex, SelVal = "", PropArr = "";
			switch (sourceId) {
			case com.amat.crm.opportunity.Ids.S4DISESAMASAGRRD:
				SelVal = SelIndex === 1 ? oResource.getText("S2POSMANDATANS") : oResource.getText("S2NEGMANDATANS");
				EsaData.MasterAgrmnt = SelVal;
				if(SelIndex === 1){
					PropArr = [{prp: "/EsaInfoCTAVPAVis", val: true}, {prp: "/EsaInfoCTAVPATxtVis", val: true}, {prp: "/EsaInfoCTAVPARDVis", val: true}];
				} else {
					PropArr = [{prp: "/EsaInfoCTAVPAVis", val: false}, {prp: "/EsaInfoCTAVPATxtVis", val: false}, {prp: "/EsaInfoCTAVPARDVis", val: false}];
				}
				thisCntrlr.setPropArray(PropArr);
				SelIndex === 2 ? EsaData.CtaVpaValid = "" : "";
				break;
			case com.amat.crm.opportunity.Ids.S4DISESACTAVPARD:
				SelVal = SelIndex === 1 ? oResource.getText("S2POSMANDATANS") : oResource.getText("S2NEGMANDATANS");
				EsaData.CtaVpaValid = SelVal;
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAPRHVMRD:
				SelVal = SelIndex === 2 ? oResource.getText("S2POSMANDATANS") : oResource.getText("S2NEGMANDATANS");
				EsaData.NAV_QAINFO.HvmEvalVal = SelVal;
				break;
			case com.amat.crm.opportunity.Ids.S4DISESARFERD:
				EsaData.NAV_QAINFO.ReasonForEval = SelIndex;
				SelIndex === 3 ? this.setProperty("/ReasonForEvalNoteVis", true) : this.setProperty("/ReasonForEvalNoteVis", false);
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAEQUIPTYPRD:
				EsaData.NAV_QAINFO.EquipLoanType = SelIndex;
				SelIndex === 3 || SelIndex === 4 ? this.setProperty("/EqupOthnSwtrVis", true) : this.setProperty("/EqupOthnSwtrVis", false);
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAEQUIPSAL1RD:
				EsaData.NAV_QAINFO.EquipProcessSelect = SelIndex;
				//****Start Of PCR033306: Q2C Display Enhancements*********
				//SelIndex === 2 ? this.setProperty("/EqupSelOnePRIPVis", true) : this.setProperty("/EqupSelOnePRIPVis", false);
				if(SelIndex === 2){
					PropArr = [{prp: "/EqupSelOnePRIPVis", val: true}, {prp: "/EqupSelOneOthIPVis", val: false}];
					EsaData.NAV_QAINFO.EquipSelectNote = thisCntrlr.getView().getModel().getProperty("/EqupSelOnePRIPVal");
				} else if(SelIndex === 3){
					PropArr = [{prp: "/EqupSelOnePRIPVis", val: false}, {prp: "/EqupSelOneOthIPVis", val: true}];
					EsaData.NAV_QAINFO.EquipSelectOthNote = thisCntrlr.getView().getModel().getProperty("/EqupSelOneOthIPVal");
				} else {
					PropArr = [{prp: "/EqupSelOnePRIPVis", val: false}, {prp: "/EqupSelOneOthIPVis", val: false}];
				}
				thisCntrlr.setPropArray(PropArr);
				//****End Of PCR033306: Q2C Display Enhancements***********
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAASPECRD:
				var AccepSpecAgree = SelIndex === 1 ? oResource.getText("S2NEGMANDATANS") : oResource.getText("S2POSMANDATANS");
				EsaData.NAV_QAINFO.AcepSpecAgree = AccepSpecAgree;
				PropArr = [{prp: "/EsaACPosIPVis", val: true}, {prp: "/AcepSpecnoNoteVS", val: oResource.getText("S2ERRORVALSATETEXT")},
				           {prp: "/AcepSpecnoNote", val: ""}];
				if(SelIndex === 2){
					PropArr.push({prp: "/EsaACPosDPVis", val: true}, {prp: "/AcepSpecnoNotePlcHoldr", val: oResource.getText(
							"S2ESAIDSDESSPETSNDSPECYOPLCHDRIPTXT")});
				} else {
					PropArr.push({prp: "/EsaACPosDPVis", val: false}, {prp: "/AcepSpecnoNotePlcHoldr", val: oResource.getText(
							"S2ESAIDSDESSPETSNDSPECNOPLCHDRIPTXT")});
				}
				thisCntrlr.setPropArray(PropArr);				
				EsaData.NAV_QAINFO.AcepSpecnoNote = "";
				break;
			case com.amat.crm.opportunity.Ids.S4DISESASEVALRD:
				EsaData.NAV_QAINFO.SuccEvalCust = SelIndex;
				SelIndex === 2 ? this.setProperty("/EsaSucEvalCustVis", true) : this.setProperty("/EsaSucEvalCustVis", false);
				SelIndex === 1 ? EsaData.NAV_QAINFO.CustBuyPrice = "" : "";
				break;
			case com.amat.crm.opportunity.Ids.S4DISESASEVAL2RD:
				EsaData.NAV_QAINFO.CustBuyPrice = SelIndex;
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAPRCURRRD:
				EsaData.NAV_QAINFO.PriceCurr = SelIndex;
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAOUTBNDSHPCSTRD:
				EsaData.NAV_QAINFO.OutboundShipCost = SelIndex;
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAEQUIPRTNRD:
				EsaData.NAV_QAINFO.EquipReturnSelect = SelIndex;
				SelIndex === 4 ? this.setProperty("/EsaEqipRetnOthValVis", true) : this.setProperty("/EsaEqipRetnOthValVis", false);
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAPYSTNDTRMRD:
				EsaData.NAV_EXCEPINFO.StandardPayTeam = SelIndex;
				EsaData.NAV_EXCEPINFO.ExcepPayterm = "";
				PropArr = [{prp: "/EsaPayTermExptIndex", val: 0}, {prp: "/EsaPayTermSelPayTermBtnVis", val: false}, {prp: "/EsaPayTermExptOthIPVis", val: false},
				           {prp: "/EsaPayTermPayTrmCode", val: ""}, {prp: "/EsaPayTermPaytermDescNote", val: ""}, {prp: "/EsaPayTermExptOthIPVal", val: ""},
				           {prp: "/EsaPayTermPayTrmCodeVS", val: oResource.getText("S2DELNAGVIZTEXT")}, {prp: "/EsaPayTermPayTrmCodeVS", val: oResource.getText(
				        	"S2DELNAGVIZTEXT")}, {prp: "/EsaPayTermPaytermJustiNoteIPVS", val: oResource.getText("S2DELNAGVIZTEXT")}];
				thisCntrlr.setPropArray(PropArr);
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAPAYTRMPTCODEIP).removeStyleClass("sapMPaytrmCodeEWidth");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAPAYTRMPTCODEIP).addStyleClass("sapMPaytrmCodeDWidth");
				EsaData.NAV_EXCEPINFO.ExcepPaytermNote = "";
				EsaData.NAV_EXCEPINFO.PaytermDescNote = "";
				EsaData.NAV_EXCEPINFO.PaytermCode = "";
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAPYSTNDTRMRD).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAPTEXPTRD).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
				//*************************Start Of PCR033306: Q2C Display Enhancements********************
				if(SelIndex === 1){
					EsaData.NAV_EXCEPINFO.StandardPayteamNote = "";
					thisCntrlr.getModel().setProperty("/EsaStdPayTermCTAIPVis", false);
				} else {
					var CtaVS = thisCntrlr.getModel().getProperty("/EsaStdPayTermCTAIPVal") === "" ? oResource.getText("S2ERRORVALSATETEXT") :
						oResource.getText("S2DELNAGVIZTEXT");
					thisCntrlr.getModel().setProperty("/EsaStdPayTermCTAIPVis", true);
					thisCntrlr.getModel().setProperty("/EsaStdPayTermCTAIPVS", CtaVS);
				}
				thisCntrlr.getModel().refresh(true);
				//*************************End Of PCR033306: Q2C Display Enhancements**********************
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAPTEXPTRD:
				EsaData.NAV_EXCEPINFO.ExcepPayterm = SelIndex;
				EsaData.NAV_EXCEPINFO.StandardPayTeam = "";
				var payTrmCodeIP = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAPAYTRMPTCODEIP), PropArr = "";
				var PayTrmJustIP = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAPAYTRMJUSTIP);
				if(SelIndex === 1 || SelIndex === 2){
					PropArr = [{prp: "/EsaPayTermSelPayTermBtnVis", val: true}, {prp: "/EsaPayTermExptOthIPVal", val: ""}, {prp: "/EsaPayTermExptOthIPVis", val: false}];
					if(thisCntrlr.getView().getModel().getProperty("/EsaPayTermPayTrmCode") === ""){
						PropArr.push({prp: "/EsaPayTermPayTrmCodeVS", val: oResource.getText("S2ERRORVALSATETEXT")},
								{prp: "/EsaPayTermPayTrmCodeVS", val: oResource.getText("S2ERRORVALSATETEXT")});
						}
					if(thisCntrlr.getView().getModel().getProperty("/EsaPayTermPaytermJustiNote") === ""){
						PropArr.push({prp: "/EsaPayTermPaytermJustiNoteIPVS", val: oResource.getText("S2ERRORVALSATETEXT")});
					}
					payTrmCodeIP.removeStyleClass("sapMPaytrmCodeDWidth");
					payTrmCodeIP.addStyleClass("sapMPaytrmCodeEWidth");
					EsaData.NAV_EXCEPINFO.ExcepPaytermNote = "";
			    } else if (SelIndex === 3){
			    	PropArr = [{prp: "/EsaPayTermSelPayTermBtnVis", val: false}, {prp: "/EsaPayTermExptOthIPVal", val: ""},{prp: "/EsaPayTermExptOthIPVS", val:
			    		       oResource.getText("S2ERRORVALSATETEXT")},{prp: "/EsaPayTermPayTrmCode", val: ""}, {prp: "/EsaPayTermPaytermDescNote", val: ""},
			    		       {prp: "/EsaPayTermExptOthIPVis", val: true},{prp: "/EsaPayTermSelPayTermBtnVis", val: false}, {prp: "/EsaPayTermPayTrmCodeVS", val:
			    		       oResource .getText("S2DELNAGVIZTEXT")},{prp: "/EsaPayTermPaytermJustiNoteIPVS", val: oResource.getText("S2DELNAGVIZTEXT")}];
					payTrmCodeIP.removeStyleClass("sapMPaytrmCodeEWidth");
					payTrmCodeIP.addStyleClass("sapMPaytrmCodeDWidth");
					EsaData.NAV_EXCEPINFO.PaytermCode = "";
					EsaData.NAV_EXCEPINFO.PaytermDescNote = "";
			    } else {
			    	PropArr = [{prp: "/EsaPayTermSelPayTermBtnVis", val: false}, {prp: "/EsaPayTermExptOthIPVis", val: false}, {prp: "/EsaPayTermSelPayTermBtnVis",
						val: oResource.getText("S2DELNAGVIZTEXT")}, {prp: "/EsaPayTermPayTrmCodeVS",  val: oResource .getText("S2DELNAGVIZTEXT")}];
				    payTrmCodeIP.removeStyleClass("sapMPaytrmCodeDWidth");
					payTrmCodeIP.addStyleClass("sapMPaytrmCodeEWidth");
			    }
			    PropArr.push({prp: "/EsaPayTermStdTermIndex", val: 0}, {prp: "/EsaPayTermStdTermVS", val: oResource.getText("S2DELNAGVIZTEXT")},
					         {prp: "/EsaPayTermExptVS", val: oResource.getText("S2DELNAGVIZTEXT")}, {prp: "/EsaStdPayTermCTAIPVis", val: false});                                    //PCR033306++;Condition Modified
			    thisCntrlr.setPropArray(PropArr);
				SelIndex !== 3 && PayTrmJustIP.getValue() === "" ? PayTrmJustIP.setValueState(oResource.getText("S2ERRORVALSATETEXT")) : "";
				EsaData.NAV_EXCEPINFO.StandardPayteamNote = "";                                                                                                                      //PCR033306++
				break;
			case com.amat.crm.opportunity.Ids.S4DISESACHINCONRD:
				EsaData.NAV_EXCEPINFO.ChinaCondEval = SelIndex === 1 ? oResource.getText("S2POSMANDATANS") : (SelIndex === 2 ? oResource
					.getText("S2NEGMANDATANS") : "");;
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAROLRD:
				EsaData.NAV_EXCEPINFO.CustRisk = SelIndex === 1 ? oResource.getText("S2POSMANDATANS") : (SelIndex === 2 ? oResource
					.getText("S2NEGMANDATANS") : "");
				break;
			case com.amat.crm.opportunity.Ids.S4DISESASHPTRMRD:
				var ExepType = SelIndex === 1 ? oResource.getText("S2PSRDCNASHPODKEY") : oResource.getText("S2PSRDCEVALKEY");
				EsaData.NAV_EXCEPINFO.ShipTerms = ExepType;
				SelIndex === 2 ? this.setProperty("/EsaShipSTermFormVis", true) : this.setProperty("/EsaShipSTermFormVis", false);
				break;
			case com.amat.crm.opportunity.Ids.S4DISESASPSHIPCONRD:
				var ShipVal = SelIndex === 1 ? oResource.getText("S2PSRDCNASHPODKEY") : oResource.getText("S2PSRDCEVALKEY");
				EsaData.NAV_EXCEPINFO.SplitShip = ShipVal;
				SelIndex === 2 ? this.setProperty("/EsaShipSShipFormVis", true) : this.setProperty("/EsaShipSShipFormVis", false);
				break;
			}
			thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
		},
		/**
		 * This method Handles ESA InPut Control Live Change Event.
		 * @name checkPrice
		 * @param {String} sorIpVal - Field Value
		 * @returns {String} sorIpVal - Valid Field Value
		 */
		checkPrice: function (sorIpVal) {
			if (sorIpVal.indexOf(".") > 0) {
				sorIpVal.length >= 23 ? this.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSPRCVALWODECMSG")) : "";
				sorIpVal = sorIpVal.length >= 23 ? sorIpVal.substr(0, 23) : sorIpVal;
			} else {
				sorIpVal.length >= 20 ? this.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSPRCVALWDECMSG")) : "";
				sorIpVal = sorIpVal.length >= 20 ? sorIpVal.substr(0, 20) : sorIpVal;
			}
			return sorIpVal;
		},
		/**
		 * This method Handles ESA InPut Control Live Change Event.
		 * @name onHandleEsaInpLivChange
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onHandleEsaInpLivChange: function (oEvent) {
			var oResource = this.getResourceBundle(),
			    sourceId = oEvent.getSource().getId().split("--")[oEvent.getSource().getId().split("--").length - 1];
			if (oEvent.getSource().getValue().trim() === "" && oEvent.getSource().getValue().length !== 0) {
				thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSFBLNKCHAREORMSG"));
				thisCntrlr.getView().byId(sourceId).setValue("");
			} else {
				var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
				var sorIpVal = oEvent.getSource().getValue().length >= 255 ? (oEvent.getParameters().value.substr(0, 254)) : oEvent.getSource().getValue();
				oEvent.getSource().getValue().length >= 255 ? this.showToastMessage(oResource.getText("S2PSRSDACBCMCOMMVALTXT")) : "";
				switch (sourceId) {
				case com.amat.crm.opportunity.Ids.S4DISESAPREAGREEIP:
					sorIpVal = oEvent.getSource().getValue().length >= 30 ? (oEvent.getParameters().value.substr(0, 30)) : oEvent.getSource().getValue();
					oEvent.getSource().getValue().length >= 30 ? this.showToastMessage(oResource.getText(oResource.getText("S2ESAIDSPREAGREEEORMSG"))) : "";
					EsaData.NAV_QAINFO.PrevAgrementChkno = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESATAMBAIP:
					sorIpVal = oEvent.getSource().getValue().length >= 40 ? (oEvent.getParameters().value.substr(0, 40)) : oEvent.getSource().getValue();
					oEvent.getSource().getValue().length >= 40 ? this.showToastMessage(oResource.getText(oResource.getText("S2ESAIDSTAMBAEORMSG"))) : "";
					EsaData.Tamba = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESARES4EVALOTHIP:
					EsaData.NAV_QAINFO.ReasonForEvalNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
						.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAEQUIPAGREEIP:
					EsaData.NAV_QAINFO.EqupDescEvalNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAEQUIPSOFTOTHSELIP:
					EsaData.NAV_QAINFO.EquipNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
						.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAEQUIPSEL1PRIP:
					EsaData.NAV_QAINFO.EquipSelectNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
						.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAEVALTSNDACAGRIP:
					EsaData.NAV_QAINFO.AcepSpecnoNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
						.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAEVALTSNDDATIP:
					EsaData.NAV_QAINFO.DataSpecProvNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
						.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAPCRTSALPRCIP:
					sorIpVal = thisCntrlr.checkPrice(sorIpVal);
					sorIpVal === "" ? (thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
						sourceId).setValue(0)) : "";
					EsaData.NAV_QAINFO.TargetSalesPrice = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAPRCBSALPRCIP:
					sorIpVal = thisCntrlr.checkPrice(sorIpVal);
					sorIpVal === "" ? (thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
						sourceId).setValue(0)) : "";
					EsaData.NAV_QAINFO.BottomSalesPrice = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAPRCCOMBSALPRCIP:
					EsaData.NAV_QAINFO.BottomCommNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAPRCEPSIP:
					sorIpVal = thisCntrlr.checkPrice(sorIpVal);
					sorIpVal === "" ? (thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
						sourceId).setValue(0)) : "";
					EsaData.NAV_QAINFO.EvaNetDiffVal = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAPRCVPSIP:
					oEvent.getSource().getValue().length >= 11 ? this.showToastMessage(oResource.getText("S2ESAIDSGROTHEORMSG")) : "";
					sorIpVal = oEvent.getSource().getValue().length >= 11 ? (oEvent.getParameters().value.substr(0, 10)) : oEvent.getSource().getValue();
					sorIpVal === "" ? (thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
						sourceId).setValue(0)) : "";
					EsaData.NAV_QAINFO.VpsNetPerTarget = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAPRCEXSALPRCHVMIP:
					sorIpVal = thisCntrlr.checkPrice(sorIpVal);
					sorIpVal === "" ? (thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
						sourceId).setValue(0)) : "";
					EsaData.NAV_QAINFO.ExpSlsPriceHvm = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAPRCGRSMARTARIP:
					oEvent.getSource().getValue().length >= 11 ? this.showToastMessage(oResource.getText("S2ESAIDSGROTHEORMSG")) : "";
					sorIpVal = oEvent.getSource().getValue().length >= 11 ? (oEvent.getParameters().value.substr(0, 10)) : oEvent.getSource().getValue();
					sorIpVal === "" ? (thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
						sourceId).setValue(0)) : "";
					EsaData.NAV_QAINFO.MarginPerTarget = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAPRCGRSMARBOTIP:
					oEvent.getSource().getValue().length >= 11 ? this.showToastMessage(oResource.getText("S2ESAIDSGROTHEORMSG")) : "";
					sorIpVal = oEvent.getSource().getValue().length >= 11 ? (oEvent.getParameters().value.substr(0, 10)) : oEvent.getSource().getValue();
					sorIpVal === "" ? (thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
						sourceId).setValue(0)) : "";
					EsaData.NAV_QAINFO.MarginPerBottom = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAPRCJUSTIP:
					EsaData.NAV_QAINFO.PriceJustiNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
						.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				case com.amat.crm.opportunity.Ids.S4DISESASHPSTPROTRMIP:
					EsaData.NAV_EXCEPINFO.ShipPropTermNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESASHPSTDESIP:
					EsaData.NAV_EXCEPINFO.ShipDescNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESASHPSTJUSTIP:
					EsaData.NAV_EXCEPINFO.ShipJustiNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
						.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				case com.amat.crm.opportunity.Ids.S4DISESASHPSTCOMIP:
					EsaData.NAV_EXCEPINFO.ShipCommNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESASHPSSRCLOCIP:
					sorIpVal = oEvent.getSource().getValue().length >= 30 ? (oEvent.getParameters().value.substr(0, 30)) : oEvent.getSource().getValue();
					oEvent.getSource().getValue().length >= 30 ? this.showToastMessage(oResource.getText(oResource.getText("S2ESAIDSPREAGREEEORMSG"))) : "";
					EsaData.NAV_EXCEPINFO.ShipLoc = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
						.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				case com.amat.crm.opportunity.Ids.S4DISESASHPSSRCJUSTIP:
					EsaData.NAV_EXCEPINFO.SplitJustiNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
						.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				case com.amat.crm.opportunity.Ids.S4DISESASHPSSRCCOMMIP:
					EsaData.NAV_EXCEPINFO.SplitCommNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAEQUIPRETNOTHIP:
					EsaData.NAV_QAINFO.EquipReturnOtherNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
						.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				case com.amat.crm.opportunity.Ids.S4DISESASUPMONTHVALIP:
					sorIpVal = sorIpVal.indexOf(".") > 0 ? sorIpVal.substring(0, sorIpVal.indexOf(".")) : sorIpVal;
					sorIpVal.length > 3 ? thisCntrlr.showToastMessage(oResource.getText(oResource.getText("S2ESAIDSMONTHEORMSG"))) :
						"";
					sorIpVal = sorIpVal.length > 3 ? sorIpVal.substring(0, 3).trim() : sorIpVal.trim();
					if (parseInt(sorIpVal) < 0 || sorIpVal === "") {
						thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSENTRMONTHVALIDNMSG"));
						sorIpVal === "" ? (thisCntrlr.getView().byId(sourceId).setValue(0)) : "";
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					} else {
						EsaData.NAV_QAINFO.SupportRemMonths = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					}
					break;
				case com.amat.crm.opportunity.Ids.S4DISESASUPEXMONTHVALIP:
					sorIpVal = sorIpVal.indexOf(".") > 0 ? sorIpVal.substring(0, sorIpVal.indexOf(".")) : sorIpVal;
					sorIpVal.length > 3 ? thisCntrlr.showToastMessage(oResource.getText(oResource.getText("S2ESAIDSMONTHEORMSG"))) :
						"";
					sorIpVal = sorIpVal.length > 3 ? sorIpVal.substring(0, 3).trim() : sorIpVal.trim();
					if (parseInt(sorIpVal) < 0 || sorIpVal === "") {
						thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSENTRMONTHVALIDNMSG"));
						sorIpVal === "" ? (thisCntrlr.getView().byId(sourceId).setValue(0)) : "";
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					} else {
						EsaData.NAV_QAINFO.SupportExeMonths = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					}
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAPAYTRMEXOTHIP:
					EsaData.NAV_EXCEPINFO.ExcepPaytermNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
						.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAPAYTRMPTCODEIP:
					thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSENTRPAYTRMVALIDNMSG"));
					thisCntrlr.getView().byId(sourceId).setValue("");
					thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT"));
					var PropArr = [{prp: "/EsaPayTermPaytermDescNote", val: ""}, {prp: "/EsaPayTermPayTrmCodeVS", val: oResource.getText("S2ERRORVALSATETEXT")}];
					thisCntrlr.setPropArray(PropArr);
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAPAYTRMJUSTIP:
					EsaData.NAV_EXCEPINFO.PaytermJustiNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					(parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) === 1 || parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) === 2 ) && sorIpVal === "" ?
						thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
						 .getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				case com.amat.crm.opportunity.Ids.S4DISESAPAYTRMCOMIP:
					EsaData.NAV_EXCEPINFO.PaytermCommNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					break;
				//****Start Of PCR033306: Q2C Display Enhancements*********
				case com.amat.crm.opportunity.Ids.S4DISESA_EQIPSEL1OTHIP:
					EsaData.NAV_QAINFO.EquipSelectOthNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				case com.amat.crm.opportunity.Ids.S4DISESA_PTSTNDTRMIP:
					EsaData.NAV_EXCEPINFO.StandardPayteamNote = sorIpVal;
					thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
					sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							.getView().byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					break;
				//****End Of PCR033306: Q2C Display Enhancements***********
				}
			}
		},
		/**
		 * This method Handles ESA Check Box Select Event.
		 * @name onEsaCkbSelect
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onEsaCkbSelect: function (oEvent) {
			var oResource = thisCntrlr.getResourceBundle(),
			    EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData(),
			    sourceId = oEvent.getSource().getId().split("--")[oEvent.getSource().getId().split("--").length - 1],
			    ckbSelVal = oEvent.getSource().getSelected() === true ? oResource.getText("S1TABLESALESTAGECOL") : "";
			switch (sourceId) {
			case com.amat.crm.opportunity.Ids.S4DISESAPREAGREECKB:
				EsaData.NAV_QAINFO.PrevAgrementChk = ckbSelVal;
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAEQUIPCKB:
				EsaData.NAV_QAINFO.DevArrngeChk = ckbSelVal;
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAABTUPGRDCKB:
				EsaData.NAV_QAINFO.AbilityUpgradeChk = ckbSelVal;
				break;
			case com.amat.crm.opportunity.Ids.S4DISESASUPRTCKB:
				EsaData.NAV_QAINFO.SupportChk = ckbSelVal;
				var eblVal = ckbSelVal === oResource.getText("S1TABLESALESTAGECOL") ? true : false;
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESASUPMONTHVALIP).setEnabled(eblVal);
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESASUPEXMONTHVALIP).setEnabled(eblVal);
				eblVal === false ? (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESASUPMONTHVALIP).setValue(""),
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESASUPEXMONTHVALIP).setValue("")) : "";
				break;
			}
		},
		/**
		 * This method Handles ESA Date picker Select Event.
		 * @name onHandleDatChange
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onHandleDatChange: function (oEvent) {
			var oResource = thisCntrlr.getResourceBundle(),
			    EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData(),
			    sourceId = oEvent.getSource().getId().split("--")[oEvent.getSource().getId().split("--").length - 1],
			    selDate = oEvent.getSource().getDateValue();
			switch (sourceId) {
			case com.amat.crm.opportunity.Ids.S4DISESAEVALTSNDACAGREEDP:
				EsaData.NAV_QAINFO.AcepSpecDate = selDate;
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAECALTSNDENDDTDP:
				EsaData.NAV_QAINFO.EvalEndDate = typeof (EsaData.NAV_QAINFO.EvalEndDate) === oResource.getText("S2ESAIDSSTRCHKTXT") ?
					thisCntrlr.checkDate(EsaData.NAV_QAINFO.EvalEndDate) : EsaData.NAV_QAINFO.EvalEndDate;
				EsaData.NAV_QAINFO.EvalStartDate = typeof (EsaData.NAV_QAINFO.EvalStartDate) === oResource.getText("S2ESAIDSSTRCHKTXT") ?
					thisCntrlr.checkDate(EsaData.NAV_QAINFO.EvalStartDate) : EsaData.NAV_QAINFO.EvalStartDate;
				EsaData.NAV_QAINFO.EvalStartDate !== "" ? (selDate - EsaData.NAV_QAINFO.EvalStartDate < 0 ? (thisCntrlr.showToastMessage(
						oResource.getText("S2ESAIDSENTRSTRTENDDTVALIDNMSG")), thisCntrlr.byId(sourceId).setValue(null), EsaData.NAV_QAINFO
					.EvalEndDate = null) : EsaData.NAV_QAINFO.EvalEndDate = selDate) : EsaData.NAV_QAINFO.EvalEndDate = selDate;
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAEVALTSNDSTARTDTDP:
				EsaData.NAV_QAINFO.EvalEndDate = typeof (EsaData.NAV_QAINFO.EvalEndDate) === oResource.getText("S2ESAIDSSTRCHKTXT") ?
					thisCntrlr.checkDate(EsaData.NAV_QAINFO.EvalEndDate) : EsaData.NAV_QAINFO.EvalEndDate;
				EsaData.NAV_QAINFO.EvalStartDate = typeof (EsaData.NAV_QAINFO.EvalStartDate) === oResource.getText("S2ESAIDSSTRCHKTXT") ?
					thisCntrlr.checkDate(EsaData.NAV_QAINFO.EvalStartDate) : EsaData.NAV_QAINFO.EvalStartDate;
				EsaData.NAV_QAINFO.EvalEndDate !== "" ? (selDate - EsaData.NAV_QAINFO.EvalEndDate > 0 ? (thisCntrlr.showToastMessage(oResource
						.getText("S2ESAIDSENTRSTRTENDDTVALIDNMSG")), thisCntrlr.byId(sourceId).setValue(null), EsaData.NAV_QAINFO.EvalStartDate = null) :
					EsaData.NAV_QAINFO.EvalStartDate = selDate) : EsaData.NAV_QAINFO.EvalStartDate = selDate;
				break;
			case com.amat.crm.opportunity.Ids.S4DISESAEVALNDESTSHIPDTDP:
				EsaData.NAV_QAINFO.EvalShipDate = selDate;
				break;
			}
			thisCntrlr.byId(sourceId).getDateValue() !== null ? thisCntrlr.byId(sourceId).setValueState(oResource.getText("S2DELNAGVIZTEXT")) :
				thisCntrlr.byId(sourceId).setValueState(oResource.getText("S2ERRORVALSATETEXT"));
		},
		/**
		 * This method use to convert String Date to Object.
		 * @name checkDate
		 * @param {Date} reqDate - String Date
		 * @returns {Date} reqDate - Date Object
		 */
		checkDate: function (reqDate) {
			return reqDate !== "" ? (reqDate = (typeof (reqDate) === thisCntrlr.bundle.getText("S2ESAIDSSTRCHKTXT") ? new Date(reqDate.substring(
				0, 4) + "-" + reqDate.substring(4, 6) + "-" + reqDate.substring(6, 8)) : "")) : "";
		},
		/**
		 * This method Handles ESA Save Button Press Event.
		 * @name onSaveESAIDS
		 * @param {String} ActionType - Save Action Type, {String} Msg- Display Message
		 * @returns
		 */
		onSaveESAIDS: function (ActionType, Msg, EditFlag) {
			var oResource = thisCntrlr.getResourceBundle(),
			    EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData(),
				MinContact = false;
			var obj = disEsaModel.esaSavSubPayload(thisCntrlr, EsaData, ActionType);
			this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity
				.util.ServiceConfigConstants.write, obj, Msg);
			if (ActionType !== oResource.getText("S1TABLESALESTAGECOL")) {
				thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, "");
				var oModel = thisCntrlr.getDataModels();
				MinContact = ActionType === oResource.getText("S2CBCANSSUCCESSKEY") ? thisCntrlr.checkMContact("", oResource.getText(
					"S2CBCANSSUCCESSKEY")) : "";
				var SFCheck = ActionType === oResource.getText("S2CBCANSSUCCESSKEY") ? MinContact[0] : false;
				var errorFlag = parseInt(oModel[4].Status) === 5 || parseInt(oModel[4].Status) === 35 ? thisCntrlr.checkValidation() : true;
				if (SFCheck === false && MinContact !== "") {
					thisCntrlr.showToastMessage(Msg + " " + oResource.getText("S2ESAIDSSUMITCHKFAILMSG1") + " " + MinContact[1] + " " +
						oResource.getText("S2ESAIDSSUMITCHKFAILMSG2"));
					EditFlag = true;
				} else if (errorFlag === false) {
					thisCntrlr.showToastMessage(Msg + " " + oResource.getText("S2ESAIDSPAYTRMMANDTEORMSG"));
					SFCheck = false;
					EditFlag = true;
				}
				var EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
					oModel[4], oModel[4].Status, EditFlag, SFCheck, false);
				thisCntrlr.setViewData(EsaModel);
				if (EditFlag === true) {
					//thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESATAMBALBL).addStyleClass("sapMEsaEditModeMargin");                                               //PCR033306--
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAMASAGRLBL).addStyleClass("sapMEsaEditModeMargin");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESACTAVPALBL).addStyleClass("sapMEsaEditModeMargin");
				} else {
					//thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESATAMBALBL).removeStyleClass("sapMEsaEditModeMargin");                                            //PCR033306--
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAMASAGRLBL).removeStyleClass("sapMEsaEditModeMargin");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESACTAVPALBL).removeStyleClass("sapMEsaEditModeMargin");
				}
			}
		},
		/**
		 * This method Handles ESA Cancel Button Confirmation Press Event.
		 * @name checkValidation
		 * @param
		 * @returns {Boolean} errorFlag - Binary value for validation
		 */
		checkValidation: function () {
			var errorFlag = true,
			    oResource = thisCntrlr.getResourceBundle(),
			    oModel = thisCntrlr.getView().getModel().getData();
			if (oModel.EsaInfoMstrAgrVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			else if (oModel.EsaInfoMstrAgrIndex === 1) {if (oModel.EsaInfoCTAVPAVS === oResource.getText("S2ERRORVALSATETEXT")) {
				errorFlag = false;return errorFlag;}}
			if (oModel.ReasonForEvalSelVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			else if (oModel.ReasonForEvalSelIndex === 3) {if (oModel.ReasonForEvalNoteVS === oResource.getText("S2ERRORVALSATETEXT")) {
				errorFlag = false; return errorFlag;}}
			if (oModel.EqupLonTypeSelVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			else if (oModel.EqupLonTypeSelIndex >= 3) {if (oModel.EqupOthnSwtrVS === oResource.getText("S2ERRORVALSATETEXT")) {
				errorFlag = false;return errorFlag;}}
			if (oModel.EqupSelOneSelVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			else if (oModel.EqupSelOneSelIndex === 2) {if (oModel.EqupSelOnePRVS === oResource.getText("S2ERRORVALSATETEXT")) {
				errorFlag = false;return errorFlag;}}
			//****Start Of PCR033306: Q2C Display Enhancements*********
			else if (oModel.EqupSelOneSelIndex === 3) {if (oModel.EqupSelOneOthVS === oResource.getText("S2ERRORVALSATETEXT")) {
				errorFlag = false;return errorFlag;}}
			if (oModel.EsaPayTermStdTermIndex === 2 && oModel.EsaStdPayTermCTAIPVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")){
				errorFlag = false;return errorFlag;}
			//****End Of PCR033306: Q2C Display Enhancements***********
			if (oModel.EsaShipDateDPVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			if (oModel.EsaShipSDateVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			if (oModel.EsaShipEDateDPVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			if (oModel.EsaASpecSelIndex !== 0) {if (oModel.AcepSpecnoNoteVS === oResource.getText("S2ERRORVALSATETEXT")) {
				errorFlag = false;return errorFlag;}}
			if (oModel.EsaASpecSelVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			else if (oModel.EsaASpecSelIndex === 2) {if (oModel.AcepSpecDateVS === oResource.getText("S2ERRORVALSATETEXT")) {
				errorFlag = false;return errorFlag;}}
			if (oModel.DataSpecProvNoteVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			if (oModel.EsaSuccEvalCustVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			if (oModel.EsaSuccEvalCustIndex > 1) {if (oModel.EsaCustBuyPriceVS === oResource.getText("S2ERRORVALSATETEXT")) {
				errorFlag = false;return errorFlag;}}
			if (oModel.PriceJustiNoteVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			if (oModel.EsaShipSTermVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			else if (oModel.EsaShipSTermIndex === 2) {if (oModel.EsaShipSTermJustVS === oResource.getText("S2ERRORVALSATETEXT")) {
				errorFlag = false;return errorFlag;}}
			if (oModel.EsaShipSShipVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			else if (oModel.EsaShipSShipIndex === 2) {if (oModel.EsaShipSShipLocVS === oResource.getText("S2ERRORVALSATETEXT") ||
					oModel.EsaShipSShipJustVS === oResource.getText("S2ERRORVALSATETEXT")) {
				errorFlag = false;return errorFlag;}}
			if (oModel.EsaShipOutShipCostVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			if (oModel.EsaEqipRetnVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			else if (oModel.EsaEqipRetnIndex === 4) {if (oModel.EsaEqipRetnIPVS === oResource.getText("S2ERRORVALSATETEXT")) {
				errorFlag = false;return errorFlag;}}
			if (oModel.EsaPayTermStdTermVS === oResource.getText("S2ERRORVALSATETEXT") || oModel.EsaPayTermExptVS === oResource
				.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			if ((oModel.EsaPayTermExptIndex === 1 || oModel.EsaPayTermExptIndex === 2) && oModel.EsaPayTermPayTrmCodeVS === oResource.getText(
					"S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			else if (oModel.EsaPayTermExptIndex === 3) {if (oModel.EsaPayTermExptOthIPVS === oResource.getText("S2ERRORVALSATETEXT")) {
				errorFlag = false;return errorFlag;}}
			if (oModel.EsaPayTermExptIndex === 1 || oModel.EsaPayTermExptIndex === 2){if (oModel.EsaPayTermPaytermJustiNoteIPVS === thisCntrlr
					.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}}			
			if (oModel.EsaChinaCondEvalVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			if (oModel.EsaCustRiskVS === oResource.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
			return errorFlag;
		},
		/**
		 * This method Handles ESA Cancel Button Confirmation Press Event.
		 * @name confirmationESACancel
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		confirmationESACancel: function (oEvent) {
			var oResource = thisCntrlr.getResourceBundle();
			if (oEvent === oResource.getText("S2F4HELPOPPOKBTN")) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oModel = thisCntrlr.getDataModels();
				var payload = disEsaModel.esaInitpayload(oModel[0].Guid, oModel[0].ItemGuid, oResource.getText("S2ESAIDSPROSSCANCLKYE"),
					parseInt(oModel[4].VersionNo, oModel[0].ProductLine));
				thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, payload, oResource.getText("S2ESAIDSONCANCLSUCCMSG"));
				thisCntrlr.that_views4.getController().onNavBack();
				myBusyDialog.close();
			}
		},
		/**
		 * This method Handles ESA Cancel Button Press Event.
		 * @name onESACancelProcess
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onESACancelProcess: function (oEvent) {
			var oResource = thisCntrlr.getResourceBundle(),
			    EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData(),
			    OmInitiateFlag = this.checkContact(EsaData.NAV_OM.results),
			    SlsInitiateFlag = this.checkContact(EsaData.NAV_SLS.results);
			if (OmInitiateFlag === false && SlsInitiateFlag === false) {
				thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSONCANCLUSERFAILMSG"));
			} else {
				var Mesg = oResource.getText("S2ESAIDSONCANCLCONFRMMSG");
				sap.m.MessageBox.confirm(Mesg, this.confirmationESACancel, oResource.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
			}
		},
		/**
		 * This method Handles ESA Recreate Button Confirmation Press Event.
		 * @name onESAResetProcess
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onESAResetProcess: function (oEvent) {
			var oResource = thisCntrlr.getResourceBundle(),
			    EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData(),
			    OmInitiateFlag = this.checkContact(EsaData.NAV_OM.results),
			    SlsInitiateFlag = this.checkContact(EsaData.NAV_SLS.results);
			if (OmInitiateFlag === false && SlsInitiateFlag === false) {
				thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSONRESETUSERFAILMSG"));
			} else {
				var Mesg = oResource.getText("S2ESAIDSONRESETCONFRMMSG");
				//sap.m.MessageBox.confirm(Mesg, this.confirmationESAReset, oResource.getText("S2PSRSDACBCCONDIALOGTYPTXT"));                                                        //PCR033306--;
				sap.m.MessageBox.confirm(Mesg, this.checkResetEsaCC, oResource.getText("S2PSRSDACBCCONDIALOGTYPTXT"));                                                               //PCR033306++; modified Parameter
			}
		},
		/**
		 * This method Handles ESA Recreate Button Press Event.
		 * @name confirmationESAReset
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		confirmationESAReset: function (oEvent) {
			var oResource = thisCntrlr.getResourceBundle();
			if (oEvent === oResource.getText("S2F4HELPOPPOKBTN")) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oModel = thisCntrlr.getDataModels(),
				    actionType = oResource.getText("S2PSRCBCREJECTKEY");
				var payload = disEsaModel.esaInitpayload(oModel[0].Guid, oModel[0].ItemGuid, actionType, parseInt(oModel[4].VersionNo), oModel[0].ProductLine);
				thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, payload, oResource.getText("S2ESAIDSONRESETSUCCMSG"));
				thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, "");
				var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
				var EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
					EsaData, EsaData.Status, false, false, false);
				thisCntrlr.setViewData(EsaModel);
				thisCntrlr.EsaTabColorInit();
				myBusyDialog.close();
			}
		},
		/**
		 * This method use to save ESA Form data.
		 * @name onSaveFormData
		 * @param
		 * @returns
		 */
		onSaveFormData: function () {
			var oResource = thisCntrlr.getResourceBundle(),
			    EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
			var obj = disEsaModel.esaSavSubPayload(thisCntrlr, EsaData, oResource.getText("S2CBCANSSUCCESSKEY"));
			this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity
				.util.ServiceConfigConstants.write, obj, "");
		},
		/**
		 * This method handles Check List press event.
		 * @name onChkListPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onChkListPress: function (oEvent) {
			var oResource = thisCntrlr.getResourceBundle(),
			    SecurityData = this.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();
			if (SecurityData.UpdtChckList !== oResource.getText("S1TABLESALESTAGECOL")) {
				thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
			} else {
				var oModel = thisCntrlr.getDataModels();
				var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
				var EsaCLAuth = false,
					ESACLEdit = false;
				if (EsaData.ActiveVersion === oResource.getText("S1TABLESALESTAGECOL") && parseInt(EsaData.Status) === 30) {
					var OmInitiateFlag = this.checkContact(EsaData.NAV_OM.results),
					    SlsInitiateFlag = this.checkContact(EsaData.NAV_SLS.results);
					EsaCLAuth = OmInitiateFlag === true || SlsInitiateFlag === true ? true : false;
					ESACLEdit = EsaCLAuth;
				} else {
					EsaCLAuth = true;
					ESACLEdit = false;
				}
				if (EsaCLAuth === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSONCHKLSTUSERFAILMSG"));
				} else {
					var ChkLstModel = thisCntrlr.getChekLstModel(oModel[4], ESACLEdit);					
					this.dialog = sap.ui.xmlfragment(oResource.getText("S4DISESACHCKLISTFRAG"), this);
					this.dialog.getContent()[0].setModel(ChkLstModel);
					this.dialog.getButtons()[0].setEnabled(ESACLEdit);
					this.getCurrentView().addDependent(this.dialog);
					//*************************Start Of PCR033306 Q2C Display Enhancements********************
					var qaList = ChkLstModel.getData().ItemSet;
					var qaSubmitFlag = this.checkSubmission(qaList);
					if (qaSubmitFlag === false) {
						this.dialog.getButtons()[0].setText(oResource.getText("S2PSRSDASAVEBTNTEXT"));
					}
					else{
						this.dialog.getButtons()[0].setText(oResource.getText("S2PSRSDACBCSFASUBTYPEMSG"));
					}
					//*************************End Of PCR033306 Q2C Display Enhancements**********************
					this.dialog.setContentWidth("1000px");
					this.dialog.open();
				}
			}
		},
		/**
		 * This method handles Check List press event.
		 * @name getChekLstModel
		 * @param {sap.ui.model.Model} Model - EsaModel, ESACLEdit - Edit Flag
		 * @returns {sap.ui.model.Model} ChkLst - CheckList Dialog Model
		 */
		getChekLstModel: function (Model, ESACLEdit) {
			var oResource = thisCntrlr.getResourceBundle();
			var sValidate = oResource.getText("S4DISESACHKLSTPTH") + Model.Guid + oResource.getText("S4DISRRATCHPTH2") + Model.ItemGuid +
			    oResource.getText("S4DISESAINFOPTH1") + Model.VersionNo + oResource.getText("S4DISESACHKLSTPTH1");
			thisCntrlr.serviceDisCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var ChkLstData = thisCntrlr.getModelFromCore(oResource.getText("S2ESATDSCHKLSTMODEL")).getData().NAV_CHECKLIST,
				ChkLst = [];
			for (var i = 0; i <= ChkLstData.results.length - 1; i++) {
				var obj = {};
				obj.Guid = ChkLstData.results[i].Guid;
				obj.ItemGuid = ChkLstData.results[i].ItemGuid;
				obj.VersionNo = ChkLstData.results[i].VersionNo;
				obj.Qid = ChkLstData.results[i].Qid;
				obj.Qdesc = ChkLstData.results[i].Qdesc;
				obj.Comments = ChkLstData.results[i].Comments;
				//obj.AnsCheck = ChkLstData.results[i].AnsCheck;                                                                                                                     //PCR035760--
				obj.AnsCheck = ChkLstData.results[i].AnsCheck === oResource.getText("S1TABLESALESTAGECOL") ? true : false;                                                           //PCR035760++
				obj.QaVerNo = ChkLstData.results[i].QaVerNo;
				obj.CustQid = i + 1;
				obj.ChkLstEnabled = ESACLEdit;
				ChkLst.push(obj);
			}
			return new sap.ui.model.json.JSONModel({
				"ItemSet": ChkLst});
		},
		/**
		 * This method handles Check List press event.
		 * @name onEsaChkLstSubmit
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onEsaChkLstSubmit: function (oEvent) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oResource = thisCntrlr.getResourceBundle(),
			    ChkListTabData = oEvent.getSource().getParent().getContent()[0].getModel().getData().ItemSet,
			//*************************Start Of PCR033306 Q2C Display Enhancements********************
			    chkListFlag = this.dialog.getButtons()[0].getText(),
			    chkListMsg = "";
			//var obj = disEsaModel.esaChkListPayload(thisCntrlr, ChkListTabData);
			var obj = disEsaModel.esaChkListPayload(thisCntrlr, ChkListTabData, chkListFlag);
			chkListMsg = chkListFlag == thisCntrlr.bundle.getText("S2PSRSDACBCSFASUBTYPEMSG") ?
					thisCntrlr.bundle.getText("S2ESAIDSONCHKLSTSUCCMSG"): thisCntrlr.bundle.getText("S2ESAIDSONCHKLSTSAVEMSG");
			//this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAChecklist, com.amat.crm.opportunity
			//	.util.ServiceConfigConstants.write, obj, oResource.getText("S2ESAIDSONCHKLSTSUCCMSG"));
			this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAChecklist, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, chkListMsg);
			//*************************End Of PCR033306 Q2C Display Enhancements********************
			thisCntrlr.getRefreshEsaData(ChkListTabData[0].Guid, ChkListTabData[0].ItemGuid, "");
			var oModel = thisCntrlr.getDataModels();
			var EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
				oModel[4], oModel[4].Status, false, false, false);
			thisCntrlr.setViewData(EsaModel);
			thisCntrlr.onCancelWFPress();
			thisCntrlr.EsaTabColorInit();
			myBusyDialog.close();
		},
		/**
		 * This method handles PayTerm Code F4 help event.
		 * @name handleSelPayTermCode
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		handleSelPayTermCode: function (oEvent) {
			var PayTrmModel = thisCntrlr.getPayTrmModel();
			this.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("S4DISESAPAYTRMFRAG"), this);
			this.dialog.setModel(PayTrmModel);
			this.getCurrentView().addDependent(this.dialog);
			this.dialog.open();
		},
		/**
		 * This method handles PayTerm Code get model.
		 * @name getPayTrmModel
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns {Array} PayTrmArr - PayTerm Code Model
		 */
		getPayTrmModel: function (oEvent) {
			thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAPayTrmConSet,
				com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var PayTrmData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("S2ESATDSPAYTRMMODEL")).getData(),
				PayTrmArr = [];
			for (var i = 0; i < PayTrmData.results.length; i++) {
				var obj = {};
				obj.Pid = i + 1;
				obj.Code = PayTrmData.results[i].Code;
				obj.Desc = PayTrmData.results[i].Desc;
				PayTrmArr.push(obj);
			}
			return new sap.ui.model.json.JSONModel({
				"ItemSet": PayTrmArr});
		},
		/**
		 * This method handles PayTerm Code selection dialog live change event.
		 * @name handleSearch
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		handleSearch: function (oEvent) {
			var oFilter, aFilters = [],
			    oResource = thisCntrlr.getResourceBundle(),
			    sQuery = oEvent.getParameters().value;
			if (sQuery && sQuery.length > 0) {
				aFilters = [
					new sap.ui.model.Filter(oResource.getText("S2ESATDSPAYTRMCODECOLTIT"), sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter(oResource.getText("S1LGRDESPROP"), sap.ui.model.FilterOperator.Contains, sQuery)

				];
				oFilter = new sap.ui.model.Filter(aFilters, false);
			}
			var binding = oEvent.getSource().getItems()[0].getParent().getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
			binding.filter(oFilter);
		},
		/**
		 * This method is Validating BSDA Work-flow Approval Permission.
		 * @name ValidatePSRAPr
		 * @param RraData - ESA Data
		 * @returns AprlFlag - Binary
		 */
		ValidatePSRAPr: function(RraData) {
			var AprlFlag = false;
				if (parseInt(RraData.TaskId) !== 0) {
					AprlFlag = true;
				}
			return AprlFlag;
		},
		/**
		 * This method Handles ESA Approve/Reject Button Press Event.
		 * @name onESAApprove
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onESAApprove: function (oEvent) {
			var oResource = thisCntrlr.getResourceBundle(),
			    oModel = thisCntrlr.getDataModels();
			if (parseInt(oModel[4].TaskId) === 0) {
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
			var oResource = thisCntrlr.getResourceBundle();
			if ((thisCntrlr.dialog.getContent()[0].getContent()[1].getValue() === "" || thisCntrlr.dialog.getContent()[0].getContent()[1].getValue()
					.trim() === "") && thisCntrlr.detActionType === oResource.getText("S2PSRCBCREJECTKEY")) {
				thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCSFACOMMFAILMSG"));
			} else {
				var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
				EsaData.AprvComments = thisCntrlr.dialog.getContent()[0].getContent()[1].getValue();
				var obj = disEsaModel.esaSavSubPayload(thisCntrlr, EsaData, this.detActionType);
				var Msg = this.detActionType === oResource.getText("S2PSRCBCAPPROVEKEY") ? oResource.getText("S2ESAIDSWFARSUCCMSG") :
					oResource.getText("S2PSRSDACBCRJTNNXTLVLTXT");
				thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, Msg);
				thisCntrlr.onCancelWFPress();
				thisCntrlr.that_views4.getController().onNavBack();
			}
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
		 * This method handles PayTerm Code selection dialog Selection event.
		 * @name onSelectPT
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onSelectPT: function (oEvent) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var path = oEvent.getParameters().selectedContexts[0].getPath(),
			    SelRecord = oEvent.getParameters().selectedContexts[0].getModel().getProperty(path),
			    oResource = thisCntrlr.getResourceBundle(),
			    EsaData = this.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
			EsaData.NAV_EXCEPINFO.PaytermCode = SelRecord.Code;
			EsaData.NAV_EXCEPINFO.PaytermDescNote = SelRecord.Desc;
			thisCntrlr.getView().getModel().setProperty("/EsaPayTermPayTrmCode", SelRecord.Code);
			thisCntrlr.getView().getModel().setProperty("/EsaPayTermPaytermDescNote", SelRecord.Desc);
			thisCntrlr.getView().getModel().setProperty("/EsaPayTermPayTrmCodeVS", oResource.getText("S2DELNAGVIZTEXT"));
			thisCntrlr.getView().getModel().setProperty("/EsaPayTermPayTrmCodeVS", oResource.getText("S2DELNAGVIZTEXT"));
			myBusyDialog.close();
		},
		/**
		 * This method handles Request Extension press event.
		 * @name onReqExtPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onReqExtPress: function (oEvent) {
			var oResource = thisCntrlr.getResourceBundle(),
			    EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData(),
			    OmInitiateFlag = this.checkContact(EsaData.NAV_OM.results),
			    SlsInitiateFlag = this.checkContact(EsaData.NAV_SLS.results),
			//*************************Start Of PCR033306: Q2C Display Enhancements********************
			    GpmInitiateFlag = this.checkContact(EsaData.NAV_GPM.results);
			//if (OmInitiateFlag === false && SlsInitiateFlag === false) {
			if (!(OmInitiateFlag || SlsInitiateFlag || GpmInitiateFlag)) {
			//*************************End Of PCR033306: Q2C Display Enhancements**********************
				thisCntrlr.showToastMessage(oResource.getText("S4ESAGPMAUTHCKNMSG"));
			} else {
				var Mesg = oResource.getText("S2ESAIDSONEXTDEDCONFRMMSG");
				//*************************Start Of PCR033306: Q2C Display Enhancements********************
				//sap.m.MessageBox.confirm(Mesg, this.confirmationESAExtReq, oResource.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
				if(EsaData.NAV_ESA_CC.results.length > 0){
					sap.m.MessageBox.confirm(Mesg, this.confirmationESAExtReqCC, oResource.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
				}
				else{
					sap.m.MessageBox.confirm(Mesg, this.confirmationESAExtReq, oResource.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
				}
				//*************************End Of PCR033306: Q2C Display Enhancements**********************
			}
		},
		/**
		 * This method handles Request Extension Confirmation dialog event.
		 * @name confirmationESAExtReq
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		confirmationESAExtReq: function (oEvent) {
			var oResource = thisCntrlr.getResourceBundle();
			if (oEvent === oResource.getText("S2F4HELPOPPOKBTN")) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
				var obj = disEsaModel.esaSavSubPayload(thisCntrlr, EsaData, oResource.getText("S2ESAIDSPROSSEXDEDKYE"));
				thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, oResource.getText("S2ESAIDSONEXTDEDSUCCMSG"));
				thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, "");
				var oModel = thisCntrlr.getDataModels();
				var EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
					oModel[4], oModel[4].Status, true, false, false);
				thisCntrlr.setViewData(EsaModel);
				thisCntrlr.EsaTabColorInit();
				myBusyDialog.close();
			}
		},
		/**
		 * This method uses to reset ESA tab button Color.
		 * @name EsaTabColorInit
		 * @param
		 * @returns
		 */
		EsaTabColorInit: function () {
			var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
			var EsaTab = thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISESA);
			switch (parseInt(EsaData.Status)) {
			case 5:
			case 4:
			case 10:
			case 35:
				EsaTab.setIconColor(sap.ui.core.IconColor.Critical);
				break;
			case 20:
			case 40:
				EsaTab.setIconColor(sap.ui.core.IconColor.Negative);
				break;
			case 30:
			case 50:
			case 95:
				EsaTab.setIconColor(sap.ui.core.IconColor.Positive);
				break;
			default:
				EsaTab.setIconColor(sap.ui.core.IconColor.Default);
			}
		},
		/**
		 * This method Handles ESA form print functionality.
		 * @name onPressPrintESA
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onPressPrintESA: function(){
			var oResource = thisCntrlr.getResourceBundle();
			sap.m.MessageBox.confirm(oResource.getText("S4DISESAPRNTPDFCONMSG"), this.confirmationESAPrint, oResource.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
		},
		/**
		 * This method Handles ESA Print validation OK button press event.
		 * @name confirmationCBCPrint
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		confirmationESAPrint : function(oEvent){
			var oResource = thisCntrlr.getResourceBundle();
			if(oEvent === oResource.getText("S2CONFFRGOKBTN")){
				var oModel = thisCntrlr.getDataModels();
				var url = thisCntrlr.disModel.sServiceUrl + oResource.getText("S4DISPRINTFRMPTH") + thisCntrlr.getOwnerComponent().ItemGuid +
				oResource.getText("S4DISPRINTFRMPTH1") + oResource.getText("S4DISPRINTFRMPTH2") + oModel[4].VersionNo.slice(-3) + "')/$value";
			    window.open(url);
			}
		},
		//*************** Start Of PCR033306: Q2C Display Enhancements ****************
		/**
		 * This method is used to handles ESA Carbon Copy F4 Help.
		 * @name handleValueHelpEsaCbnCpyRew
		 * @param
		 * @returns
		 */
		handleValueHelpEsaCbnCpyRew: function() {
			var oResource = thisCntrlr.getResourceBundle(),
			    configConsts = com.amat.crm.opportunity.util.ServiceConfigConstants,
			    ItemGuid = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid,
			    sGenaralChoos = configConsts.CustDocLinkSet + ItemGuid + "'" + configConsts.CustDocEsa,
			    CCTableData = this.getModel().getProperty("/NAV_ESA_CC").results;
			this.CbnType = oResource.getText("S1ESAIDSPROSTYPTXT");
			this.serviceDisCall(sGenaralChoos, configConsts.read, "", "");
			var CBCCData = thisCntrlr.getModelFromCore(oResource.getText("GLBESAMCOMMMODEL")).getData();
			for (var i = 0; i < CBCCData.oEsaManComm.results.length; i++) {
				for (var j = 0; j < CCTableData.length; j++) {
					if (CBCCData.oEsaManComm.results[i].OppId === CCTableData[j].OppId && CBCCData.oEsaManComm.results[i].ItemNo ===
						CCTableData[j].ItemNo) {
						CBCCData.oEsaManComm.results[i].Selected = true;
					}
				}
				CBCCData.oEsaManComm.results[i].Selected === undefined ? CBCCData.oEsaManComm.results[i].Selected = false : "";
			}
			this.dialog = sap.ui.xmlfragment(oResource.getText("PSRCBCCCF4helpOppLink"), this);
			this.dialog.getContent()[2].getColumns().map(function(item){item.setVisible(true);});
			this.dialog.getSubHeader().setVisible(true);
			this.getCurrentView().addDependent(this.dialog);
			var oCBCCbnCpyModel = this.getJSONModel(thisCntrlr.getModelFromCore(oResource.getText("GLBESAMCOMMMODEL")).getData().oEsaManComm);
			this.dialog.setModel(oCBCCbnCpyModel);
			this.dialog.open();
		},
		/**
		 * This method is used remove duplicate values.
		 * @name removeDuplicate
		 * @param filtered - Carbon Copy Data
		 * @returns filtered
		 */
		removeDuplicate: function(filtered){
			filtered = function (array) {
				var o = {};
				return array.filter(function (a) {
					var k = a.Guid && a.ItemGuid;
					if (!o[k]) {
						o[k] = true;
						return true;
					}
				});
		   }(filtered);
		   return filtered;
		},
		/**
		 * This method is used to handles OK button event.
		 * @name onRelPerSpecRewOkPress
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onRelPerSpecRewOkPress: function(oEvent) {
			this._initiateControllerObjects(thisCntrlr);
			var oResource = thisCntrlr.getResourceBundle();
			switch (this.CbnType){
			case oResource.getText("S1ESAIDSPROSTYPTXT"):
				var CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBESAMCOMMMODEL")).getData().oEsaManComm,
				    EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")),
				    FinalRecord = {
					    "NAV_ESA_CC": {"results": []}
					};
				for (var i = 0, n = 0; i < CBCData.results.length; i++) {
					if (CBCData.results[i].Selected === true) {
						FinalRecord.NAV_ESA_CC.results[n] = CBCData.results[i];
						n++;
					}
				}
				FinalRecord.NAV_ESA_CC.results = FinalRecord.NAV_ESA_CC.results.concat(EsaData.getProperty("/NAV_ESA_CC").results);
				FinalRecord.NAV_ESA_CC.results = this.removeDuplicate(FinalRecord.NAV_ESA_CC.results);
				this.closeDialog();
				this.getModel().setProperty("/EsaCbnCpyTblVis", true);
				this.getModel().setProperty("/NAV_ESA_CC", FinalRecord.NAV_ESA_CC);
				this.getModel().refresh(true);
				this.SelectedRecord.results.length = 0;
				this.UnselectedRecord.results.length = 0;
				break;
			case oResource.getText("S2ESADLINKTYPTXT"):
				 var Msg = this.dialog.getContent()[1].getValue();
				 if(Msg.trim() !== ""){
					 var oModel = thisCntrlr.getDataModels(),
					     ESAData = oModel[4].NAV_ESA_CC.results,
					     delValidFlag = thisCntrlr.getDlnkcheck(ESAData);
					 if(delValidFlag === false){
						 thisCntrlr.showToastMessage(oResource.getText("S2ALLDLINKOPPSELFAILMGS"));
				     } else {
				    	 var edtBtnTxt = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESADTBTN).getText(),
				    	     edtFlag = edtBtnTxt === oResource.getText("S2PSRSDACANBTNTXT") ? true : false,
				    	     payload = thisCntrlr.getDLinkPayLoad(oResource.getText("S1ESAIDSPROSTYPTXT"), Msg, ESAData);
						 thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CCopyDLinkSet, com.amat.crm.opportunity
									.util.ServiceConfigConstants.write, payload, oResource.getText("S2CCDLNKSUSSMSG"));
						 thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, "");
						 oModel = thisCntrlr.getDataModels();
						 var EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
		 							oModel[4], oModel[4].Status, edtFlag, false, false);
						 thisCntrlr.setViewData(EsaModel);
						 var oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAMINCOMTTAB);
						 oTable.getModel().setProperty("/NAV_COMMENTS", EsaModel.NAV_COMMENTS);
						 thisCntrlr.closeDialog();
				     }
				 } else {
					 thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ALLDLINKMANDATCOMM"));
				 }						
				break;
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
		 * This method is used to handles CC check Box selection event.
		 * @name onSelectCB
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onSelectCB: function(oEvent) {
			var oResource = thisCntrlr.getResourceBundle(),
		        SelectedDes = oEvent.getParameters().selected,
		        Selectedline = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
				      "S2CBCPSRCARMSEPRATOR"))[oEvent.getSource().getBindingContext().sPath.split(oResource
				      .getText("S2CBCPSRCARMSEPRATOR")).length - 1];
			switch (this.CbnType){
			case oResource.getText("S1ESAIDSPROSTYPTXT"): 
				this.UnselectedRecord = {
					"results": []
				};
			    this.SelectedRecord = {
					"results": []
				};
				var oCBCCbnCpyModel = thisCntrlr.getModelFromCore(oResource.getText("GLBESAMCOMMMODEL"));
				for (var i = 0; i < oCBCCbnCpyModel.getData().oEsaManComm.results.length; i++) {
					if (i === parseInt(Selectedline)) {
						if (SelectedDes === true) {
							this.SelectedRecord.results.push(oCBCCbnCpyModel.getData().oEsaManComm.results[i]);
						} else {
							this.UnselectedRecord.results.push(oCBCCbnCpyModel.getData().oEsaManComm.results[i]);
						}
					}
				}
				break;
			case oResource.getText("S2ESADLINKTYPTXT"): 
				var oESADlnkCData = thisCntrlr.getDataModels()[4].NAV_ESA_CC;
				for (var i = 0; i < oESADlnkCData.results.length; i++) {
					if (i === parseInt(Selectedline)) {
						if (SelectedDes === true) {
							oESADlnkCData.results[i].Selected = true;
						} else {
							oESADlnkCData.results[i].Selected = false;
						}
					}
				}
				break;
			}
		},
		/**
		 * This method is used to handles EVAL Checklist check Box event.
		 * @name onSelectedChkLstCkb
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onSelectedChkLstCkb: function(oEvent){
			var oResource = thisCntrlr.getResourceBundle(),
				qaList = oEvent.getSource().getParent().getModel().getData().ItemSet,
				qaSubmitFlag = this.checkSubmission(qaList);
			if (qaSubmitFlag === false) {
				this.dialog.getButtons()[0].setText(oResource.getText("S2PSRSDASAVEBTNTEXT"));
			}
			else{
				this.dialog.getButtons()[0].setText(oResource.getText("S2PSRSDACBCSFASUBTYPEMSG"));
			}
		},
		/**
		 * This method Used to check List submit.
		 * @name checkSubmission
		 * @param QAList - QA List
		 * @returns checkFlag - Binary Flag
		 */
		checkSubmission: function(QaList) {
			var checkFlag = true;
			if (QaList.length > 0) {
				for (var i = 0; i < QaList.length; i++) {
					if (!QaList[i].AnsCheck) {
						checkFlag = false;
						return checkFlag;
					}
				}
			}
			return checkFlag;
		},
		/**
		 * This method Used to Check CC of ESA Reset.
		 * @name checkResetEsaCC
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		checkResetEsaCC: function(oEvent){
			var oResource = thisCntrlr.getResourceBundle();
			if (oEvent === oResource.getText("S2F4HELPOPPOKBTN")) {
				thisCntrlr.EsaCcActType = oResource.getText("S2PSRCBCREJECTKEY");
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var ccTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESA_CRBNCPY_TBL),
				    ResetData = ccTable.getModel().getData().NAV_ESA_CC.results;
				for(var i=0;i<ResetData.length;i++){
				   ResetData[i].Selectflag = true;
				}
				thisCntrlr.dialog = sap.ui.xmlfragment(oResource.getText("PSRPDCONRESETConfirmation"), thisCntrlr);
				(ResetData.length > 0)?(thisCntrlr.dialog.getContent()[1].setVisible(true)):(thisCntrlr.dialog.getContent()[1].setVisible(false));
				thisCntrlr.dialog.getContent()[1].setModel(thisCntrlr.getJSONModel({
					 "ItemSet": ResetData
				}));
				thisCntrlr.getCurrentView().addDependent(thisCntrlr.dialog);
				thisCntrlr.dialog.getCustomHeader().getContentMiddle()[1].setText(oResource.getText("S2CBCREQIREDVALIDATIONTXT"));
				thisCntrlr.dialog.open();
				myBusyDialog.close();
			}
		},
		/**
		 * This method Handles Cancel Button Event of Reset Fragment.
		 * @name onCancelreset
		 * @param
		 * @returns
		 */
		onCancelreset: function() {
			this.closeDialog();
		},
		/**
		 * This Method is use For Reset OK Button Press Event.
		 * @name resetConfirmationOK
		 * @param oEvent - Holds the current event
		 * @returns
		 */
	    resetConfirmationOK: function(oEvent) {
	    	var oModel = thisCntrlr.getDataModels(),
    	        oResource = thisCntrlr.getResourceBundle(),
    	        configConsts = com.amat.crm.opportunity.util.ServiceConfigConstants,
    	        EditFlag = false,
    	        DependFlag = false;
		    if(thisCntrlr.EsaCcActType === oResource.getText("S2PSRCBCREJECTKEY")){
		    	var myBusyDialog = thisCntrlr.getBusyDialog();
		    	myBusyDialog.open();
		    	if(!(this.dialog.getContent()[1].getModel().getData().ItemSet.length > 0)){
					var actionType = oResource.getText("S2PSRCBCREJECTKEY"),
					    payload = disEsaModel.esaInitpayload(oModel[0].Guid, oModel[0].ItemGuid, actionType, parseInt(oModel[4].VersionNo, oModel[0].ProductLine));
					thisCntrlr.serviceDisCall(configConsts.ESAInfoSet, configConsts.write, payload, oResource.getText("S2ESAIDSONRESETSUCCMSG"));
					myBusyDialog.close();
		    	}	
		    	else{
				   var actionType = oResource.getText("S2ESAIDSRECRTKEY"),
				       payload = disEsaModel.esaInitpayload(oModel[0].Guid, oModel[0].ItemGuid, actionType, parseInt(oModel[4].VersionNo, oModel[0].ProductLine)),
				       CBCCcTabData = this.dialog.getContent()[1].getModel().getData().ItemSet;
				   for(var i=0;i<this.dialog.getContent()[1].getModel().getData().ItemSet.length;i++){
					   if(this.dialog.getContent()[1].getModel().getData().ItemSet[i].Selectflag){
						   CBCCcTabData[i].RepFlag = oResource.getText("S1TABLESALESTAGECOL");
					   }
					   else{
						   CBCCcTabData[i].RepFlag="";
					   }
					   delete CBCCcTabData[i].Selectflag;
					   delete CBCCcTabData[i].Selected;
				   }
				   payload.NAV_ESA_CC = CBCCcTabData;
				   payload.AprvComments = thisCntrlr.dialog.getContent()[0].getContent()[1].getValue();
				   thisCntrlr.serviceDisCall(configConsts.ESAInfoSet, configConsts.write, payload, oResource.getText("S2ESAIDSONRESETSUCCMSG"));
				   myBusyDialog.close();
				   DependFlag = true;
		    	}
		    }
		    else if(thisCntrlr.EsaCcActType === oResource.getText("S1TABLESALESTAGECOL")){
		    	var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
		    	if(!(this.dialog.getContent()[1].getModel().getData().ItemSet.length > 0)){
					var obj = disEsaModel.esaSavSubPayload(thisCntrlr, oModel[4], oResource.getText("S2ESAIDSPROSSEXDEDKYE"));
					thisCntrlr.serviceDisCall(configConsts.ESAInfoSet, configConsts.write, obj, oResource.getText("S2ESAIDSONEXTDEDSUCCMSG"));
					myBusyDialog.close();
					EditFlag = true;
		    	}
		    	else{
		    		oModel[4].AprvComments = thisCntrlr.dialog.getContent()[0].getContent()[1].getValue();
					var obj = disEsaModel.esaSavSubPayload(thisCntrlr, oModel[4], oResource.getText("S2ESAIDSPROSSEXDEDKYE")),
					    actionType = oResource.getText("S2ESAIDSPROSSEXDEDKYE");
					obj.ActionType = actionType;
				    var CBCCcTabData = this.dialog.getContent()[1].getModel().getData().ItemSet;
				    for(var i=0;i<this.dialog.getContent()[1].getModel().getData().ItemSet.length;i++){
					   if(this.dialog.getContent()[1].getModel().getData().ItemSet[i].Selectflag){
						   CBCCcTabData[i].RepFlag = oResource.getText("S1TABLESALESTAGECOL");
					   }
					   else{
						   CBCCcTabData[i].RepFlag="";
					   }
					   delete CBCCcTabData[i].Selectflag;
					   delete CBCCcTabData[i].Selected;
				    }
				    obj.NAV_ESA_CC = CBCCcTabData;
					thisCntrlr.serviceDisCall(configConsts.ESAInfoSet, configConsts.write, obj, oResource.getText("S2ESAIDSONEXTDEDSUCCMSG"));
					myBusyDialog.close();
					EditFlag = true;
					DependFlag = true;
		    	}
		    }
		    EditFlag = DependFlag ? false : EditFlag;
		    thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, "");
		    var oModel = thisCntrlr.getDataModels();
		    var EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
				oModel[4], oModel[4].Status, EditFlag, false, false);
			thisCntrlr.setViewData(EsaModel);
			var oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAMINCOMTTAB);
			oTable.getModel().setProperty("/NAV_COMMENTS", EsaModel.NAV_COMMENTS);
			thisCntrlr.EsaTabColorInit();
			this.closeDialog();
	    },
		/**
		 * This method Used to Check CC of ESA Extension.
		 * @name confirmationESAExtReqCC
		 * @param oEvent - Holds the current event
		 * @returns
		 */
	    confirmationESAExtReqCC: function(oEvent){
	    	var oResource = thisCntrlr.getResourceBundle();
	    	if (oEvent === oResource.getText("S2F4HELPOPPOKBTN")) {
		    	thisCntrlr.EsaCcActType = oResource.getText("S1TABLESALESTAGECOL");
		    	var myBusyDialog = thisCntrlr.getBusyDialog();
		    	myBusyDialog.open();
		    	var ccTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESA_CRBNCPY_TBL),
				    ResetData = ccTable .getModel().getData().NAV_ESA_CC.results;
		    	for(var i=0;i<ResetData.length;i++){
				   ResetData[i].Selectflag = true;
				}
				thisCntrlr.dialog = sap.ui.xmlfragment(oResource.getText("PSRPDCONRESETConfirmation"), thisCntrlr);
				(ResetData.length > 0)?(thisCntrlr.dialog.getContent()[1].setVisible(true)):(thisCntrlr.dialog.getContent()[1].setVisible(false));
				   thisCntrlr.dialog.getContent()[1].setModel(thisCntrlr.getJSONModel({
					 "ItemSet": ResetData
				}));
				thisCntrlr.getCurrentView().addDependent(thisCntrlr.dialog);
				thisCntrlr.dialog.getCustomHeader().getContentMiddle()[1].setText(oResource.getText("S2ESAEXTNDCCCNFRMHDR"));
				thisCntrlr.dialog.open();
				myBusyDialog.close();
			}
	    },
		/**
		 * This method is used to DELINK carbon copy child opportunity.
		 * @name onPressEsaDeLink
		 * @param oEvent - Holds the current event
		 * @returns
		 */
	    onPressEsaDeLink: function(oEvent){
	    	this.CbnType = "";
			var oResource = thisCntrlr.getResourceBundle();
			thisCntrlr.that_views4 === undefined ? thisCntrlr._initiateControllerObjects(thisCntrlr) : "";
			var iconTabBtn = thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISICNTAB), DlnkCData = "";
			if (iconTabBtn.getSelectedKey() === oResource.getText("S1ESAIDSPROSTYPTXT")) {
				this.CbnType = oResource.getText("S2ESADLINKTYPTXT");
				DlnkCData = thisCntrlr.getDataModels()[4].NAV_ESA_CC;
			}
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
		 * This method is used to handles Search functionality.
		 * @name searchOpportunity
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		searchOpportunity: function(oEvent) {
			var oResource = thisCntrlr.getResourceBundle(),
			    sQuery = oEvent.getSource().getValue(),
			    oFilter = "";
			if (sQuery && sQuery.length > 0) {
				var aFilters = [new sap.ui.model.Filter(oResource.getText("S2OPPAPPOPPIDKEY"), sap.ui.model
					.FilterOperator.Contains, sQuery)]
				oFilter = new sap.ui.model.Filter(aFilters, false);
			}
			var binding = this.dialog.getContent()[2].getBinding(oResource.getText("S1TABLELISTITM"));
			binding.filter(oFilter);
		},
		/**
		 * This method is handling DELINK Mandatory Comment Live Change Event.
		 * @name OnDlinkCommLvchng
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		OnDlinkCommLvchng: function(oEvent){
			var oResource = thisCntrlr.getResourceBundle();
			if (oEvent.getParameters().value.length >= 255) {
				var DlinkCommTxt = oEvent.getParameters().value.substr(0, 254);
				this.dialog.getContent()[1].setValue(DlinkCommTxt);
				thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCMCOMMVALTXT"));
			} else {
				this.dialog.getContent()[1].setValue(oEvent.getParameters().value);
				if(oEvent.getParameters().value.trim().length <= 0){
					this.dialog.getContent()[1].setValueState(oResource.getText("S2ERRORVALSATETEXT"));
					this.dialog.getButtons()[0].setEnabled(false);
				} else {
					this.dialog.getContent()[1].setValueState(oResource.getText("S2DELNAGVIZTEXT"));
					this.dialog.getButtons()[0].setEnabled(true);
				}
			}
		},
		/**
		 * This method is used to Check DELINK Data.
		 * @name getDlnkcheck
		 * @param DelData - Process DELINK Data
		 * @returns chkSel - Boolean Flag
		 */
		getDlnkcheck: function(DelData){
			var chkSel = false;
			for(var i = 0; i < DelData.length ; i++){
			 	if(DelData[i].Selected === true){
			 		chkSel = true;
			 		break;
			 	}
			 }
			return chkSel;
		},
		/**
		 * This method is used to get DELINK Object.
		 * @name getDLinkPayLoad
		 * @param cType - Process Type, comment - DELINK Comment, prosData - Process Data
		 * @returns payload - DELINK Object
		 */
		getDLinkPayLoad: function(cType, comment, prosData){
			var oResource = thisCntrlr.getResourceBundle();
			var oModel = thisCntrlr.getDataModels();
			var OppGenInfoModel = oModel[0];
			var payload = {};
			 payload.Guid = OppGenInfoModel.Guid;
			 payload.OppDesc = comment;
			 payload.ItemGuid = OppGenInfoModel.ItemGuid;
			 payload.OppId = OppGenInfoModel.OppId;
			 payload.ItemNo = cType;
			 payload.RepFlag = "";
			 payload.NAV_CC_REMOVE = [];
			 for (var i = 0, n = 0; i < prosData.length; i++) {
				 if (prosData[i].Selected === true) {
					   var obj = {};
					   obj.Guid = prosData[i].Guid;
					   obj.OppDesc = "";
					   obj.ItemGuid = prosData[i].ItemGuid;
					   obj.OppId = prosData[i].OppId;
					   obj.ItemNo = oResource.getText("S1ESAIDSPROSTYPTXT");
					   obj.RepFlag = "";
					   payload.NAV_CC_REMOVE.push(obj);
				 }
			 }
			 return payload;
		},
		/**
		 * This method Handles Live Change Event for Carbon Copy F4 Text Change.
		 * @name onEsaCbnCpyChange
		 * @param oEvent - Event Handlers
		 * @returns
		 */
		onEsaCbnCpyChange: function(oEvent) {
			thisCntrlr.byId(oEvent.getParameters().id).setValue("");
			thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCF4TESTNEGMSG"));
		},
		//*************** End Of PCR033306: Q2C Display Enhancements ******************
	});
});
