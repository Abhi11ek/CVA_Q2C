/**
 * This class class holds all methods of ESA page.
 * 
 * @class
 * @public
 * @author Abhishek Pant
 * @since 17 June 2019
 * @extends
 * @name com.amat.crm.opportunity.controller.ESA                                  *
 *  * ----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 17/06/2019      Abhishek        PCR023905         Migrate ESA/IDS db from Lotus*
 *                 Pant                              Notes to SAP Fiori Q2C       *
 *                                                   Application                  *
 * 26/09/2019      Abhishek        PCR025717         Q2C Q4 2019 Enhancements     *
 *                 Pant                                                           *
 * 28/04/2020      Arun            PCR028711         Q2C Enhancements for Q2-20   *
 *                 Jacob                                                          *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 * 06/04/2021      Arun Jacob      PCR034716         Q2C ESA,PSR Enhancements     *
 ***********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController",
		"com/amat/crm/opportunity/controller/CommonController",
		"com/amat/crm/opportunity/model/esaDisModel"
	],
	function (Controller, CommonController, esaDisModel) {
		"use strict";
		var thisCntrlr, oCommonController;
		return Controller.extend("com.amat.crm.opportunity.controller.ESA", {
			onInit: function () {
				thisCntrlr = this;
				thisCntrlr.bundle = this.getResourceBundle();
				thisCntrlr.detActionType = "";
				this.oMyOppModel = new com.amat.crm.opportunity.model.models(this);
				thisCntrlr.that_views2 = this.getOwnerComponent().s2;
				oCommonController = new CommonController();
				this.SelectedRecord = {
						"results": []
				};                                                                                                                              //PCR028711++;
				this.UnselectedRecord = {
						"results": []
				};                                                                                                                              //PCR028711++;
			},
			/**
			 * This method Used for call after Rendering done.
			 * 
			 * @name onAfterRendering
			 * @param 
			 * @returns 
			 */
			onAfterRendering: function (thisCntrlr) {
				this._initiateControllerObjects(thisCntrlr);
			},
			/**
			 * This method Used for Initiate Other Controller Variable.
			 * 
			 * @name _initiateControllerObjects
			 * @param 
			 * @returns 
			 */
			_initiateControllerObjects: function (thisCntrlr) {
				if (thisCntrlr.that_views2 === undefined) {
					thisCntrlr.that_views2 = this.getOwnerComponent().s2;
				}
			},
			/**
			 * This method use to load ESA/IDS view.
			 * 
			 * @name onLoadEsa
			 * @param
			 * @returns 
			 */
			onLoadEsa: function (oEvent) {
				this._initiateControllerObjects(thisCntrlr);
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var OppGenInfoModel = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")),
					VerType = "",
					VerNo = "",
					oModel = "";
				var Guid = OppGenInfoModel.getData().Guid;
				var ItemGuid = OppGenInfoModel.getData().ItemGuid;
				if (oEvent !== undefined && oEvent.Type === this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT")) {
					thisCntrlr.getRefreshEsaData(oEvent.Guid, oEvent.ItemGuid, oEvent.VerNo);
					oModel = thisCntrlr.getDataModels();
					VerType = parseInt(oEvent.VerNo) === oModel[4].NAV_VER_INFO.results.length ? thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT") :
						thisCntrlr.bundle.getText("S2ESAOLDVERKEY");
					VerNo = parseInt(oEvent.VerNo);
				} else {
					thisCntrlr.getRefreshEsaData(Guid, ItemGuid, "");
					oModel = thisCntrlr.getDataModels();
					VerType = thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT");
					VerNo = "";
				}
				var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], VerType, VerNo, oModel[3], oModel[4], oModel[4].Status, false, false,
					false);
				thisCntrlr.setViewData(EsaModel);
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOTABMALBL).removeStyleClass("sapMEsaEditModeMargin");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOMASAGRLBL).removeStyleClass("sapMEsaEditModeMargin");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOCTAVPALBL).removeStyleClass("sapMEsaEditModeMargin");
				myBusyDialog.close();
			},
			/**
			 * This method Handles to set Esa view model.
			 * 
			 * @name setViewData
			 * @param EsaModel - EsaModel
			 * @returns 
			 */
			setViewData: function (EsaModel) {
				var oEsaModel = thisCntrlr.getJSONModel(EsaModel);
				thisCntrlr.getView().setModel(oEsaModel);
			},
			/**
			 * This method use to get refresh Esa model from back-end.
			 * 
			 * @name getRefreshEsaData
			 * @param mGuid - Opportunity Guid, mItemGuid - Opportunity ItemGuid, mVersion - requested ESA version
			 * @returns 
			 */
			getRefreshEsaData: function (mGuid, mItemGuid, mVersion) {
				var sValidate = "ESA_InfoSet(Guid=guid'" + mGuid + "',ItemGuid=guid'" + mItemGuid + "',VersionNo='" + mVersion +
				    "')?$expand=NAV_AGM,NAV_BMHEAD,NAV_BMO,NAV_BUGM,NAV_COMMENTS,NAV_CON,NAV_DOC,NAV_ESA_CC,NAV_ESAAPRV_HIST,NAV_ESACHNG_HIST,NAV_EXCEPINFO," +
				    "NAV_GC,NAV_ORCA,NAV_POM,NAV_QAINFO,NAV_RM,NAV_ROM,NAV_SCFO,NAV_SLS,NAV_VER_INFO";                                       //PCR028711++; NAV_ESA_CC included
				this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			},
			/**
			 * This method use to collect all models data.
			 * 
			 * @name getDataModels
			 * @param
			 * @returns 
			 */
			getDataModels: function () {
				var GeneralInfodata = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData();
				var PSRInfoData = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPPSRINFOMODEL")).getData();
				var PSRModel = this.getModelFromCore(this.getResourceBundle().getText("PSRModel")).getData();
				var SecurityData = this.getModelFromCore(this.getResourceBundle().getText("GLBSECURITYMODEL")).getData();
				var EsaData = this.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				return [GeneralInfodata, PSRInfoData, PSRModel, SecurityData, EsaData];
			},
			/**
			 * This method use to press on initiate/NA decision radio button.
			 * 
			 * @name onPressInitiateStdEsa
			 * @param oEvent - Event Handlers
			 * @returns 
			 */
			onPressInitiateStdEsa: function (oEvent) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var UserAuth = thisCntrlr.checkUsersfromlist();
				if (UserAuth === false) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAINITBMONAUTHMSG"));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDEINITRD).setSelectedIndex(-1);
				} else {
					var oModel = thisCntrlr.getDataModels();
					var actionType = oEvent.getSource().getSelectedIndex() === 1 ? thisCntrlr.bundle.getText("S2ESAINITKEY") : thisCntrlr.bundle.getText(
						"S2NEGMANDATANS");
					var msg = oEvent.getSource().getSelectedIndex() === 1 ? thisCntrlr.bundle.getText("S2ESAINITPMSG") : thisCntrlr.bundle.getText(
						"S2ESAINITNMSG");
					var payload = esaDisModel.esaInitpayload(oModel[0].Guid, oModel[0].ItemGuid, actionType, parseInt(oModel[4].VersionNo, oModel[0].ProductLine));
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity.util.ServiceConfigConstants
						.write, payload, msg);
					thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, "");
					var EsaData = this.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData(),
						EsaModel = "";
					if (oEvent.getSource().getSelectedIndex() === 1) {
						EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
							EsaData, EsaData.Status, true, false, false);
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOTABMALBL).addStyleClass("sapMEsaEditModeMargin");
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOMASAGRLBL).addStyleClass("sapMEsaEditModeMargin");
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOCTAVPALBL).addStyleClass("sapMEsaEditModeMargin");
					} else if (oEvent.getSource().getSelectedIndex() === 2) {
						EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
							EsaData, EsaData.Status, false, false, false);
					}
					thisCntrlr.setViewData(EsaModel);
					thisCntrlr.EsaTabColorInit();
				}
				myBusyDialog.close();
			},
			/**
			 * This method Handles Post action on CA or CNA.
			 * 
			 * @name onEsaInit
			 * @param Msg - on success message
			 * @returns 
			 */
			onEsaInit: function (Msg) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oModel = thisCntrlr.getDataModels();
				var payload = esaDisModel.esaInitpayload(oModel[0].Guid, oModel[0].ItemGuid, thisCntrlr.bundle.getText("S1TABLESALESTAGECOL"),
					parseInt(oModel[4].VersionNo, oModel[0].ProductLine));
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, payload, Msg);
				thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, "");
				var EsaData = this.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				myBusyDialog.close();
				return esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3], EsaData,
					EsaData.Status, false, false, false);
			},
			/**
			 * This method Handles Main Comment Note Live Change Event.
			 * 
			 * @name OnEsaMainCommLvchng
			 * @param oEvent - Event Handlers
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
			 * 
			 * @name OnEsaMainCommLvchng
			 * @param oEvent - Event Handlers
			 * @returns 
			 */
			confirmationEsaNAInit: function (oEvent) {
				if (oEvent === thisCntrlr.bundle.getText("S2F4HELPOPPOKBTN")) {
					var msg = thisCntrlr.bundle.getText("S2ESACANNAINITPMSG");
					var EsaModel = thisCntrlr.onEsaInit(msg);
					thisCntrlr.setViewData(EsaModel);
					thisCntrlr.EsaTabColorInit();
				}
			},
			/**
			 * This method Handles Submit button event.
			 * 
			 * @name onSubmitEsa
			 * @param oEvent - Event Handlers
			 * @returns 
			 */
			onSubmitEsa: function (oEvent) {
				var UserAuth = thisCntrlr.checkUsersfromlist();
				if (UserAuth === false) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESABMOAUTHCKNMSG"));
				} else {
					var Mesg = "";
					switch (oEvent.getSource().getText()) {
					case thisCntrlr.bundle.getText("S2PSRSDASFBTNCANNATXT"):
						Mesg = thisCntrlr.bundle.getText("S2ESACANNAINITVERMSG");
						sap.m.MessageBox.confirm(Mesg, this.confirmationEsaNAInit, this.getResourceBundle().getText("S2PSRSDACBCCONDIALOGTYPTXT"));
						break;
					case thisCntrlr.bundle.getText("S2PSRSDASFCANINITXT"):
						Mesg = thisCntrlr.bundle.getText("S2ESACANNAINITVERMSG");
						sap.m.MessageBox.confirm(Mesg, this.confirmationEsaCanInit, this.getResourceBundle().getText("S2PSRSDACBCCONDIALOGTYPTXT"));
						break;
					case thisCntrlr.bundle.getText("S2PSRSDASUBFORAPP"):
						var myBusyDialog = thisCntrlr.getBusyDialog();
						myBusyDialog.open();
						this.onSaveESAIDS(thisCntrlr.bundle.getText("S1TABLESALESTAGECOL"), thisCntrlr.bundle.getText("S2ATTCHSUBMTSUCSSMSG"), false);
						thisCntrlr.EsaTabColorInit();
						thisCntrlr.that_views2.getController().onNavBack();
						myBusyDialog.close();
						break;
					}
				}
			},
			/**
			 * This method Handles Save Button Event.
			 * 
			 * @name onSaveEsa
			 * @param oEvent - Event Handlers
			 * @returns 
			 */
			onSaveEsa: function (oEvent) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var UserAuth = thisCntrlr.checkUsersfromlist();
				if (UserAuth === false) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESABMOAUTHCKNMSG"));
				} else {
					this.onSaveESAIDS(thisCntrlr.bundle.getText("S2PSRDCNASHPODKEY"), thisCntrlr.bundle.getText("S2ESASAVPOSMSG"), false);
					var attTab = thisCntrlr.getView().byId("idEsaAttachTable");
					if (attTab.getModel().getData().ItemSet.length > 0) {
						for (var i = 0; i < attTab.getModel().getData().ItemSet.length; i++) {
							if (attTab.getItems()[i].getCells()[3].getItems()[0].getItems()[0].getIcon() === thisCntrlr.bundle.getText("S2PSRSDASAVEICON")) {
								attTab.getItems()[i].getCells()[3].getItems()[0].getItems()[0].setIcon(thisCntrlr.bundle.getText("S2PSRSDAEDITICON"));
								attTab.getItems()[i].getCells()[3].getItems()[0].getItems()[1].setIcon(thisCntrlr.bundle.getText("S2PSRSDADELETEICON"));
							}
						}
					}
				}
				myBusyDialog.close();
			},
			/**
			 * This method Handles Edit Button Event.
			 * 
			 * @name onEditESAIDS
			 * @param oEvent - Event Handlers
			 * @returns 
			 */
			onEditESAIDS: function () {
				var UserAuth = thisCntrlr.checkUsersfromlist();
				var EsaoData = this.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				var romInitiateFlag = this.checkContact(EsaoData.NAV_ROM.results);
				var pomInitiateFlag = this.checkContact(EsaoData.NAV_POM.results);
				var bmoInitiateFlag = this.checkContact(EsaoData.NAV_BMO.results);
				var oModel = thisCntrlr.getDataModels(),
					EsaModel = "";
				if (UserAuth === false && (romInitiateFlag || pomInitiateFlag || bmoInitiateFlag)) {
					var RPFlag = true;
					RPFlag = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAESABTN).getText() === thisCntrlr.bundle.getText(
						"S2CARMBTNEDIT") ? true : false;
					EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
						oModel[4], oModel[4].Status, false, false, RPFlag);
					thisCntrlr.setViewData(EsaModel);
				} else {
					if (UserAuth === false) {
						thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2USERALLAUTHFALTTXT"));
					} else {
						if (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAESABTN).getText() === thisCntrlr.bundle.getText("S2CARMBTNEDIT")) {
							EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
								oModel[4], oModel[4].Status, true, false, false);
							if (parseInt(oModel[4].Status) === 5) {
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOTABMALBL).addStyleClass("sapMEsaEditModeMargin");
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOMASAGRLBL).addStyleClass("sapMEsaEditModeMargin");
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOCTAVPALBL).addStyleClass("sapMEsaEditModeMargin");
							}
						} else {
							EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
								oModel[4], oModel[4].Status, false, false, false);
							thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOTABMALBL).removeStyleClass("sapMEsaEditModeMargin");
							thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOMASAGRLBL).removeStyleClass("sapMEsaEditModeMargin");
							thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOCTAVPALBL).removeStyleClass("sapMEsaEditModeMargin");
						}
						thisCntrlr.setViewData(EsaModel);
					}
				}
			},
			/**
			 * This method Handles to check owner user access.
			 * 
			 * @name checkUsersfromlist
			 * @param
			 * @returns checkFlag - Access boolean value
			 */
			checkUsersfromlist: function () {
				var checkFlag = false,
					bomInitiateFlag = false;
				var EsaData = this.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData();
				switch (parseInt(EsaData.Status)) {
				case 0:
				case 95:
					bomInitiateFlag = this.checkContact(GenInfoData.NAV_BMO_INFO.results);
					checkFlag = bomInitiateFlag === true ? true : false;
					break;
				case 35:
				case 5:
					bomInitiateFlag = this.checkContact(EsaData.NAV_BMO.results);
					checkFlag = bomInitiateFlag === true ? true : false;
					break;
				case 10:
					checkFlag = parseInt(EsaData.TaskId) !== 0 ? true : false;
					break;
				}
				return checkFlag;
			},
			/**
			 * This method Used to Check Login User With Contact List.
			 * 
			 * @name checkContact
			 * @param UserList - checking contact User List
			 * @returns checkFlag - Boolean value
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
			 * 
			 * @name onEsaVerSelectionChange
			 * @param oEvent - Event Handlers
			 * @returns
			 */
			onEsaVerSelectionChange: function (oEvent) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oModel = thisCntrlr.getDataModels();
				var CrntVer = oModel[4].NAV_VER_INFO.results[oModel[4].NAV_VER_INFO.results.length - 1].VersionNo;
				var ReqVer = oEvent.getParameters().selectedItem.getText();
				if (ReqVer === thisCntrlr.bundle.getText("S2ESAVERBYDEFKEY")) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAVERBYDEFNEGKEY"));
				} else {
					var EsaData = "",
						EsaModel = "";
					if (parseInt(ReqVer) === parseInt(CrntVer)) {
						thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, parseInt(CrntVer));
						EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
						EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT"), parseInt(ReqVer), oModel[
							3], EsaData, EsaData.Status, false, false, false);
					} else if (parseInt(ReqVer) < parseInt(CrntVer)) {
						thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, parseInt(oEvent.getSource().getSelectedItem().getText()));
						EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
						EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.bundle.getText("S2ESAOLDVERKEY"), parseInt(ReqVer), oModel[3],
							EsaData, EsaData.Status, false, false, false);
					}
					thisCntrlr.setViewData(EsaModel);
					thisCntrlr.EsaTabColorInit();
				}
				myBusyDialog.close();
			},
			/**
			 * This method Handles Main Comment Note Live Change Event.
			 * 
			 * @name OnEsaMainCommLvchng
			 * @param oEvent - Event Handlers
			 * @returns 
			 */
			OnEsaMainCommLvchng: function (oEvent) {
				if (oEvent.getSource().getValue().trim() === "" && oEvent.getSource().getValue().length !== 0) {
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESA_PANL_MAIN_COMMENT_SAVEBTN).setEnabled(false);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESA_PANL_MAIN_COMMENT_TEXT_AREA).setValue("");
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSFBLNKCHAREORMSG"));
				} else {
					oEvent.getSource().getValue().length >= 255 ? this.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCMCOMMVALTXT")) : "";
					oEvent.getSource().setValue(oEvent.getSource().getValue().length >= 255 ? (oEvent.getParameters().value.substr(0, 254).trim()) :
						oEvent.getSource().getValue());
					oCommonController.commonMainCommLvchng(oEvent, thisCntrlr);
				}
			},
			/**
			 * This method Handles Main Comment Panel Expand Event.
			 * 
			 * @name onExpandEsaMainCom
			 * @param oEvent - Event Handlers
			 * @returns 
			 */
			onExpandEsaMainCom: function (oEvent) {
				oCommonController.commonExpandMainCom(oEvent, thisCntrlr);
			},
			/**
			 * This method Handles Main Comment Save Event.
			 * 
			 * @name onSaveEsaMainCom
			 * @param oEvent - Event Handlers
			 * @returns 
			 */
			onSaveEsaMainCom: function (oEvent) {
				oCommonController.commonSaveMainCom(oEvent, thisCntrlr);
			},
			/**
			 * This method Handles Delete Button Event.
			 * 
			 * @name onContactCancelPress
			 * @param 
			 * @returns 
			 */
			onContactCancelPress: function () {
				this.contactF4Fragment.close();
				this.contactF4Fragment.destroy(true);
			},
			/**
			 * This method Handles Contact Dialog Ok Button Event.
			 * 
			 * @name onContactOkPress
			 * @param oEvent - Event Handler
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
			 * 
			 * @name onPressAddContact
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onPressAddContact: function (oEvent) {
				oCommonController.commonPressAddContact(oEvent, thisCntrlr);
			},
			/**
			 * This method Handles Contact Dialog On Selection Event.
			 * 
			 * @name contactSucess
			 * @param 
			 * @returns 
			 */
			contactSucess: function (Msg) {
				oCommonController.commonContactSuccess(Msg, thisCntrlr);
			},
			/**
			 * This method Handles On Delete Contact Event.
			 * 
			 * @name onDelete
			 * @param oEvent - Event Handler
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
			 * 
			 * @name checkMContact
			 * @param mConType - Contact Type, mCheckTyp - Action
			 * @returns Array of minDFlag - boolean, minSFlag - boolean
			 */
			checkMContact: function (mConType, mCheckTyp) {
				var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData(),
					minDFlag = false,
					minSFlag = false;
				if (mCheckTyp === thisCntrlr.bundle.getText("S2PSRDCNADEFERKEY")) {
					switch (mConType) {
					case thisCntrlr.bundle.getText("S2GINFOPANLCONINFOROMTIT"):
						minDFlag = EsaData.NAV_ROM.results.length === 1 ? true : false;
						break;
					case thisCntrlr.bundle.getText("S2GINFOPANLCONINFOPOMTIT"):
						minDFlag = EsaData.NAV_POM.results.length === 1 ? true : false;
						break;
					case thisCntrlr.bundle.getText("S2PSRWFAPPPANLBMOINFOCONTIT"):
						minDFlag = EsaData.NAV_BMO.results.length === 1 ? true : false;
						break;
					case thisCntrlr.bundle.getText("S2ESAIDSBMHADKEY"):
						minDFlag = EsaData.NAV_BMHEAD.results.length === 1 ? true : false;
						break;
					case thisCntrlr.bundle.getText("S2CONKEY"):
						minDFlag = EsaData.NAV_CON.results.length === 1 ? true : false;
						break;
					case thisCntrlr.bundle.getText("S2ESAIDSACCGMKEY"):
						minDFlag = EsaData.NAV_AGM.results.length === 1 ? true : false;
						break;
					case thisCntrlr.bundle.getText("S2SLSKEY"):
						minDFlag = EsaData.NAV_SLS.results.length === 1 ? true : false;
						break;
					case thisCntrlr.bundle.getText("S2ESAIDSCONINFOSCFOTIT"):
						minDFlag = EsaData.NAV_SCFO.results.length === 1 ? true : false;
						break;
					case thisCntrlr.bundle.getText("S2ESAIDSCONINFORGCNCKEY"):
						minDFlag = EsaData.NAV_GC.results.length === 1 ? true : false;
						break;
					case thisCntrlr.bundle.getText("S2ESAIDSCONINFORRSKMANKEY"):
						minDFlag = EsaData.NAV_RM.results.length === 1 ? true : false;
						break;
					case thisCntrlr.bundle.getText("S2ESAIDSCONINFOORCATIT"):
						minDFlag = EsaData.NAV_ORCA.results.length === 1 ? true : false;
						break;
					case thisCntrlr.bundle.getText("S2ESAIDSCONINFOBUGMKEY"):
						minDFlag = EsaData.NAV_BUGM.results.length === 1 ? true : false;
						break;
					}
				} else if (mCheckTyp === thisCntrlr.bundle.getText("S2CBCANSSUCCESSKEY")) {
					if (EsaData.NAV_ROM.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, thisCntrlr.bundle.getText("S2GINFOPANLCONINFOROMTIT")];
						return minSFlag;
					}
					if (EsaData.NAV_POM.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, thisCntrlr.bundle.getText("S2GINFOPANLCONINFOPOMTIT")];
						return minSFlag;
					}
					if (EsaData.NAV_BMO.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, thisCntrlr.bundle.getText("S2PSRWFAPPPANLBMOINFOCONTIT")];
						return minSFlag;
					}
					if (EsaData.NAV_BMHEAD.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, thisCntrlr.bundle.getText("S2PSRWFAPPPANLBMHDINFOCONTIT")];
						return minSFlag;
					}
					if (EsaData.NAV_CON.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, thisCntrlr.bundle.getText("FRAGLLCONTR")];
						return minSFlag;
					}
					if (EsaData.NAV_AGM.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, thisCntrlr.bundle.getText("S2ESAIDSACCGMTITTXT")];
						return minSFlag;
					}
					if (EsaData.NAV_SLS.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, thisCntrlr.bundle.getText("S2ESAIDSSALEPERTIT")];
						return minSFlag;
					}
					if (EsaData.NAV_SCFO.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, thisCntrlr.bundle.getText("S2ESAIDSCONINFOSCFOTIT")];
						return minSFlag;
					}
					if (EsaData.NAV_GC.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, thisCntrlr.bundle.getText("S2ESAIDSGCCTXTKYE")];
						return minSFlag;
					}
					if (EsaData.NAV_RM.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, thisCntrlr.bundle.getText("S2ESAIDSCONINFORSKMGTTIT")];
						return minSFlag;
					}
					if (EsaData.NAV_ORCA.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, thisCntrlr.bundle.getText("S2ESAIDSCONINFOORCATIT")];
						return minSFlag;
					}
					if (EsaData.NAV_BUGM.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, thisCntrlr.bundle.getText("S2ESAIDSCONINFOBUGMTIT")];
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
			 * 
			 * @name handleEditPress
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			handleEditPress: function (oEvent) {
				thisCntrlr.onSaveFormData();
				oCommonController.commonEditPress(oEvent, thisCntrlr);
			},
			/**
			 * This method Handles Add Button Press Event.
			 * 
			 * @name handleAddPress
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			handleAddPress: function (oEvent) {
				thisCntrlr.onSaveFormData();
				oCommonController.commonAddPress(oEvent, thisCntrlr);
			},
			/**
			 * This method is used to handles Note Live Change Event.
			 * 
			 * @name handleNoteLiveChange
			 * @param oEvent - Holds the current event, thisCntrlr - Current Controller
			 * @returns
			 */
			handleNoteLiveChange: function (oEvent) {
				oCommonController.commonNoteLiveChange(oEvent, thisCntrlr);
			},
			/**
			 * This method Handles File Name Press Event.
			 * 
			 * @name handleEvidenceLinkPress
			 * @param oEvent - Event handler
			 * @returns 
			 */
			handleLinkPress: function (oEvent) {
				var rowIndex = oEvent.getSource().getParent().getId().split("-")[oEvent.getSource().getParent().getId().split(
					"-").length - 1];
				var oData = oEvent.getSource().getParent().getParent().getModel().getData().ItemSet[rowIndex];
				var url = this.oMyOppModel._oDataModel.sServiceUrl + "/AttachmentSet(Guid=guid'" + oData.Guid + "',ItemGuid=guid'" + oData.itemguid +
					"',DocType='" + oData.doctype + "',DocSubtype='" + oData.docsubtype + "',DocId=guid'" + oData.DocId +
					"')/$value";
				window.open(url);
			},
			/**
			 * This method Validates Delete Button Press Event.
			 * 
			 * @name CheckEsaDelete
			 * @param oEvent - Event Handler
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
				if (thisCntrlr.source.getIcon().indexOf(thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDDELTXT").toLowerCase()) >=
					0) {
					var text = thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDMSG") + " " + thisCntrlr.oTable.getModel()
						.getData().ItemSet[thisCntrlr.rowIndex].DocDesc + thisCntrlr.bundle.getText(
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
			 * 
			 * @name handleDeletePress
			 * @param event - Event Handler
			 * @returns 
			 */
			handleDeletePress: function (event) {
				thisCntrlr.onSaveFormData();
				oCommonController.commonDeletePress(event, thisCntrlr);
			},
			/**
			 * This method Handles Search Contact Button Event.
			 * 
			 * @name searchContact
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			searchContact: function (oEvent) {
				var oEventParameters = oEvent.getParameters();
				var searchText;
				var contactData;
				var contactType = oEvent.getSource().getParent().getParent().getParent().getController().contactType;
				if (oEventParameters.hasOwnProperty(thisCntrlr.bundle.getText("S2TYPECONTCTPROPTXT"))) {
					searchText = oEventParameters.newValue;
					if (searchText.length < 3) return;
				} else searchText = oEventParameters.query;
				this.contactF4Fragment.getModel(thisCntrlr.bundle.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
					"ItemSet": []
				});
				var sContact = "Search_contactSet?$filter=NameFirst eq '" + searchText + "'and NameLast eq '" + contactType + "'";
				if (searchText.length !== 0) {
					this.serviceCall(sContact, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
					contactData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBCONTACTMODEL")).getData().results;
					this.contactF4Fragment.getModel(thisCntrlr.bundle.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
						"ItemSet": contactData
					});
				} else {
					this.contactF4Fragment.getModel(thisCntrlr.bundle.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
						"ItemSet": thisCntrlr.contactData
					});
				}
			},
			/**
			 * This method Handles attachments upload functionality.
			 * 
			 * @name onEsaUploadComplete
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onEsaUploadComplete: function (oEvent) {
				thisCntrlr.onSaveFormData();
				thisCntrlr.Custno = null;
				this.oFileUploader = null;
				var uploadButton = oEvent.getSource().getParent().getParent().getItems()[1],
					type = "";
				var rowIndex = uploadButton.getId().split("-")[uploadButton.getId().split("-").length - 1];
				var oTable = oEvent.getSource().getParent().getParent().getParent().getParent();
				oTable.getModel().getData().ItemSet[rowIndex].filename = oEvent.getSource().getValue();
				thisCntrlr.oTable = oTable;
				thisCntrlr.tableModel = oTable.getModel().getData();
				thisCntrlr.Custno = this.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData().Custno;
				oTable.getModel().getData().ItemSet[rowIndex].uBvisible = true;
				oTable.getModel().getData().ItemSet[rowIndex].bgVisible = !oTable.getModel().getData().ItemSet[rowIndex]
					.uBvisible;
				oTable.getModel().getData().ItemSet[rowIndex].editable = false;
				if (oEvent.getSource().getParent().getParent().getParent().getCells()[2].mAggregations.items !==
					undefined) {
					oTable.getModel().getData().ItemSet[rowIndex].note = oEvent.getSource().getParent().getParent().getParent()
						.getCells()[2].getValue();
				}
				if (oTable.getModel().getData().ItemSet[rowIndex].doctype === thisCntrlr.bundle.getText("S2MLIMCOMMDATATYP") && oTable.getModel().getData()
					.ItemSet[rowIndex].docsubtype === thisCntrlr.bundle.getText("S2ATTOTHTYPETEXT") || oTable.getModel().getData().ItemSet[rowIndex]
					.Code === thisCntrlr.bundle.getText("S2OTHDOCCODETEXT")) {
					type = thisCntrlr.bundle.getText("S2OTHDOCCODETEXT");
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
				var sToken = this.oMyOppModel._oDataModel.getHeaders()['x-csrf-token'];
				this.oMyOppModel._oDataModel.refreshSecurityToken(function (e, o) {
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
			 * 
			 * @name onComplete
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onEsaComplete: function (oEvent) {
				if (oEvent.getParameters().status === 201) {
					thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCATTDOCUPLDSUCSSMSG"));

				} else if (oEvent.getParameters().status === 400) {
					sap.m.MessageToast.show($(oEvent.getParameters().responseRaw).find(thisCntrlr.getResourceBundle().getText(
						"S2CBCPSRCARMTYPEMESG"))[0].innerText, {
						duration: 5000
					});
				}
				var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, parseInt(EsaData.VersionNo));
				var oModel = thisCntrlr.getDataModels();
				var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
					oModel[4], oModel[4].Status, true, false, false);
				thisCntrlr.setViewData(EsaModel);
				thisCntrlr.dialog.close();
				thisCntrlr.dialog.destroy();
			},
			/** 
			 * This method Handles ESA Radio Button Select Event.
			 * 
			 * @name onPressRdEsa
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onPressRdEsa: function (oEvent) {
				var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				var sourceId = oEvent.getSource().getId().split("--")[oEvent.getSource().getId().split("--").length - 1];
				var SelIndex = oEvent.getParameters().selectedIndex,
					SelVal = "";
				switch (sourceId) {
				case com.amat.crm.opportunity.Ids.S2ESAINFOMASAGRRD:
					SelVal = SelIndex === 1 ? thisCntrlr.bundle.getText("S2POSMANDATANS") : thisCntrlr.bundle.getText("S2NEGMANDATANS");
					EsaData.MasterAgrmnt = SelVal;
					SelIndex === 1 ? (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOCTAVPALBL).setVisible(true), thisCntrlr.getView()
						.byId(com.amat.crm.opportunity.Ids.S2ESAINFOCTAVPATXT).setVisible(true),
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOCTAVPARD).setVisible(true)) : (thisCntrlr.getView().byId(com.amat
							.crm.opportunity.Ids.S2ESAINFOCTAVPALBL).setVisible(false),
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOCTAVPATXT).setVisible(false), thisCntrlr.getView().byId(com.amat
							.crm.opportunity.Ids.S2ESAINFOCTAVPARD).setVisible(false));
					SelIndex === 2 ? EsaData.CtaVpaValid = "" : "";
					break;
				case com.amat.crm.opportunity.Ids.S2ESAINFOCTAVPARD:
					SelVal = SelIndex === 1 ? thisCntrlr.bundle.getText("S2POSMANDATANS") : thisCntrlr.bundle.getText("S2NEGMANDATANS");
					EsaData.CtaVpaValid = SelVal;
					break;
				//***************************Start Of PCR025717 Q2C Q4 2019 Enhancements********************
				case com.amat.crm.opportunity.Ids.S2ESAIDEHVMSALPRCRD:
					SelVal = SelIndex === 2 ? thisCntrlr.bundle.getText("S2POSMANDATANS") : thisCntrlr.bundle.getText("S2NEGMANDATANS");
					EsaData.NAV_QAINFO.HvmEvalVal = SelVal;
					break;
				//***************************End Of PCR025717 Q2C Q4 2019 Enhancements**********************
				case com.amat.crm.opportunity.Ids.S2ESARFTERD:
					EsaData.NAV_QAINFO.ReasonForEval = SelIndex;
					SelIndex === 3 ? thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESARFEOTHIP).setVisible(true) : thisCntrlr.getView().byId(
						com.amat.crm.opportunity.Ids.S2ESARFEOTHIP).setVisible(false);
					break;
				case com.amat.crm.opportunity.Ids.S2ESAEQUIPTYPDEFRD:
					//***************************Start Of PCR034716++ Q2C ESA,PSR Enhancements********************
					if(EsaData.InitFy21Q2 === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
						SelIndex = SelIndex === 4 ? 5 : (SelIndex === 5 ? 4 : SelIndex);
					}
					//***************************End Of PCR034716++ Q2C ESA,PSR Enhancements********************
					EsaData.NAV_QAINFO.EquipLoanType = SelIndex;					
					SelIndex === 3 || SelIndex === 4 ? thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAEQUIPTYPIPBX).setVisible(true) :
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAEQUIPTYPIPBX).setVisible(false);
					break;
				case com.amat.crm.opportunity.Ids.S2ESAEQUIPSELLRD:
					//***************************Start Of PCR034716++ Q2C ESA,PSR Enhancements********************
					/*EsaData.NAV_QAINFO.EquipProcessSelect = SelIndex;
					SelIndex === 2 ? thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAEQUIPSEL1PRIP).setVisible(true) : thisCntrlr.getView()
						.byId(com.amat.crm.opportunity.Ids.S2ESAEQUIPSEL1PRIP).setVisible(false);*/
					var esaEquipChkBx = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAEQUIPSMRTEVALCHKBOX),
					esaWquipInput = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAEQUIPSEL1PRIP);
					switch(SelIndex){
					case 1:
						esaEquipChkBx.setVisible(false);
						esaEquipChkBx.setSelected(false);
	                    EsaData.NAV_QAINFO.EquipUnrelChk = "";
						esaWquipInput.setVisible(false);
						EsaData.NAV_QAINFO.EquipProcessSelect = SelIndex;
						break;
					case 2:
						esaEquipChkBx.setVisible(true);
						esaWquipInput.setVisible(false);
						EsaData.NAV_QAINFO.EquipProcessSelect = SelIndex + 2;
						break;
					case 3:
						esaEquipChkBx.setVisible(false);
						esaEquipChkBx.setSelected(false);
	                    EsaData.NAV_QAINFO.EquipUnrelChk = "";
						esaWquipInput.setVisible(true);
						EsaData.NAV_QAINFO.EquipProcessSelect = SelIndex - 1;
						esaWquipInput.hasStyleClass("sapMPrIP") ? esaWquipInput.removeStyleClass("sapMPrIP") : "";
						esaWquipInput.hasStyleClass("classEasEquipOthersRelease") ? esaWquipInput.removeStyleClass("classEasEquipOthersRelease") : "";
						esaWquipInput.addStyleClass("classEasEquipPartialRelease");
						break;
					case 4:
						esaEquipChkBx.setVisible(false);
						esaEquipChkBx.setSelected(false);
	                    EsaData.NAV_QAINFO.EquipUnrelChk = "";
						esaWquipInput.setVisible(true);
						EsaData.NAV_QAINFO.EquipProcessSelect = SelIndex - 1;
						esaWquipInput.hasStyleClass("sapMPrIP") ? esaWquipInput.removeStyleClass("sapMPrIP") : "";
						esaWquipInput.hasStyleClass("classEasEquipPartialRelease") ? esaWquipInput.removeStyleClass("classEasEquipPartialRelease") : "";
						esaWquipInput.addStyleClass("classEasEquipOthersRelease");
						break;
					}
					//***************************End Of PCR034716++ Q2C ESA,PSR Enhancements**********************
					break;
				case com.amat.crm.opportunity.Ids.S2ESAASPECRD:
					var AccepSpecAgree = SelIndex === 1 ? thisCntrlr.bundle.getText("S2NEGMANDATANS") : thisCntrlr.bundle.getText("S2POSMANDATANS");
					EsaData.NAV_QAINFO.AcepSpecAgree = AccepSpecAgree;
					var AccepSpecIp = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAEVAL1TSNDACAGREIP);
					AccepSpecIp.setVisible(true);
					AccepSpecIp.setValue("");
					SelIndex === 2 ? (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAEVAL1TSNDACAGREDP).setVisible(true), AccepSpecIp.setPlaceholder(
						thisCntrlr.bundle.getText("S2ESAIDSDESSPETSNDSPECYOPLCHDRIPTXT"))) : (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAEVAL1TSNDACAGREDP)
						.setVisible(false), AccepSpecIp.setPlaceholder(thisCntrlr.bundle.getText("S2ESAIDSDESSPETSNDSPECNOPLCHDRIPTXT")));
					AccepSpecIp.setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT"));
					EsaData.NAV_QAINFO.AcepSpecnoNote = "";
					break;
				case com.amat.crm.opportunity.Ids.S2ESASEVALRD:
					EsaData.NAV_QAINFO.SuccEvalCust = SelIndex;
					SelIndex === 2 ? (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESASEVAL2RDBX).setVisible(true)) : (thisCntrlr.getView()
						.byId(com.amat.crm.opportunity.Ids.S2ESASEVAL2RDBX).setVisible(false));
					SelIndex === 1 ? EsaData.NAV_QAINFO.CustBuyPrice = "" : "";
					break;
				case com.amat.crm.opportunity.Ids.S2ESASEVAL2RD:
					EsaData.NAV_QAINFO.CustBuyPrice = SelIndex;
					//***************************Start Of PCR034716++ Q2C ESA,PSR Enhancements********************
					SelIndex === 3 ? (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAEVAL23RDDESIP).setVisible(true),
							thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAEVAL23RDDESIP).getValue() === "" ? 
									thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAEVAL23RDDESIP).setValueState(thisCntrlr.bundle.getText(
									"S2ERRORVALSATETEXT")) : thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAEVAL23RDDESIP).setValueState(thisCntrlr.bundle
											.getText("S2DELNAGVIZTEXT"))) : (thisCntrlr.getView()
							.byId(com.amat.crm.opportunity.Ids.S2ESAEVAL23RDDESIP).setVisible(false));	
					//***************************End Of PCR034716++ Q2C ESA,PSR Enhancements**********************
					break;
				case com.amat.crm.opportunity.Ids.S2ESAPRCURRRD:
					EsaData.NAV_QAINFO.PriceCurr = SelIndex;
					break;
				case com.amat.crm.opportunity.Ids.S2ESAOUTSHIPCSTRD:
					EsaData.NAV_QAINFO.OutboundShipCost = SelIndex;
					break;
				case com.amat.crm.opportunity.Ids.S2ESAEQUIPRTNRD:
					EsaData.NAV_QAINFO.EquipReturnSelect = SelIndex;
					SelIndex === 4 ? (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAEQUIPRETNOTHIP).setVisible(true)) : (thisCntrlr.getView()
						.byId(com.amat.crm.opportunity.Ids.S2ESAEQUIPRETNOTHIP).setVisible(false));
					break;
				case com.amat.crm.opportunity.Ids.S2ESAPTSTRMRD:
					EsaData.NAV_EXCEPINFO.StandardPayTeam = SelIndex;
					EsaData.NAV_EXCEPINFO.ExcepPayterm = "";
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPTEXPTRD).setSelectedIndex(0);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).setEnabled(false);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).removeStyleClass("sapMPaytrmCodeEWidth");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).addStyleClass("sapMPaytrmCodeDWidth");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMEXOTHIP).setVisible(false);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).setValue("");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTDESIP).setValue("");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMEXOTHIP).setValue("");
					EsaData.NAV_EXCEPINFO.ExcepPaytermNote = "";
					EsaData.NAV_EXCEPINFO.PaytermDescNote = "";
					EsaData.NAV_EXCEPINFO.PaytermCode = "";
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPTSTRMRD).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPTEXPTRD).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).setValueState(thisCntrlr.bundle.getText(
						"S2DELNAGVIZTEXT"));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTDESIP).setValueState(thisCntrlr.bundle.getText(
						"S2DELNAGVIZTEXT"));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMJUSTIP).setValueState(thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"));
					//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
					if(SelIndex === 1){
						EsaData.NAV_EXCEPINFO.StandardPayteamNote = "";
						thisCntrlr.getModel().setProperty("/EsaStdPayTermCTAIPVis", false);
					} else {
						var CtaVS = thisCntrlr.getModel().getProperty("/EsaStdPayTermCTAIPVal") === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") :
							thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
						thisCntrlr.getModel().setProperty("/EsaStdPayTermCTAIPVis", true);
						thisCntrlr.getModel().setProperty("/EsaStdPayTermCTAIPVS", CtaVS);
					}
					thisCntrlr.getModel().refresh(true);
					//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
					break;
				case com.amat.crm.opportunity.Ids.S2ESAPTEXPTRD:
					EsaData.NAV_EXCEPINFO.ExcepPayterm = SelIndex;
					EsaData.NAV_EXCEPINFO.StandardPayTeam = "";
					var payTrmCodeIP = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP);
					var PayTrmJustIP = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMJUSTIP);
					SelIndex === 1 || SelIndex === 2 ? (payTrmCodeIP.setEnabled(true), EsaData.NAV_EXCEPINFO.ExcepPaytermNote = "", thisCntrlr.getView()
						.byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMEXOTHIP).setValue("")) : (payTrmCodeIP.setEnabled(false));
					SelIndex === 3 ? (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMEXOTHIP).setVisible(true), PayTrmJustIP
						.setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"))) : thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids
						.S2ESAPAYTRMEXOTHIP).setVisible(false);
					SelIndex === 3 ? (payTrmCodeIP.setValue(""), payTrmCodeIP.removeStyleClass("sapMPaytrmCodeEWidth"), payTrmCodeIP.addStyleClass(
								"sapMPaytrmCodeDWidth"),
							thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTDESIP).setValue(""), EsaData.NAV_EXCEPINFO.PaytermCode = "",
							EsaData.NAV_EXCEPINFO.PaytermDescNote = "") :
						(payTrmCodeIP.removeStyleClass("sapMPaytrmCodeDWidth"), payTrmCodeIP.addStyleClass("sapMPaytrmCodeEWidth"));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPTSTRMRD).setSelectedIndex(0);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPTSTRMRD).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPTEXPTRD).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
					(SelIndex === 1 || SelIndex === 2) && thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).getValue() === "" ?
						(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).setValueState(thisCntrlr.bundle.getText(
							"S2ERRORVALSATETEXT")), thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTDESIP).setValueState(thisCntrlr.bundle
							.getText("S2ERRORVALSATETEXT"))) :
						(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).setValueState(thisCntrlr.bundle.getText(
							"S2DELNAGVIZTEXT")), thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTDESIP).setValueState(thisCntrlr.bundle
							.getText("S2DELNAGVIZTEXT")));
					SelIndex !== 3 && PayTrmJustIP.getValue() === "" ? PayTrmJustIP.setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : "";
					//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPTCTAMSTRAGMT_TEXT).setVisible(false);
					EsaData.NAV_EXCEPINFO.StandardPayteamNote = "";
					//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
					break;
				case com.amat.crm.opportunity.Ids.S2ESACHINCONRD:
					EsaData.NAV_EXCEPINFO.ChinaCondEval = SelIndex === 1 ? thisCntrlr.bundle.getText("S2POSMANDATANS") : (SelIndex === 2 ? thisCntrlr.bundle
						.getText("S2NEGMANDATANS") : "");;
					break;
				case com.amat.crm.opportunity.Ids.S2ESAROLRD:
					EsaData.NAV_EXCEPINFO.CustRisk = SelIndex === 1 ? thisCntrlr.bundle.getText("S2POSMANDATANS") : (SelIndex === 2 ? thisCntrlr.bundle
						.getText("S2NEGMANDATANS") : "");
					break;
				case com.amat.crm.opportunity.Ids.S2ESASHPTRMRD:
					var ExepType = SelIndex === 1 ? thisCntrlr.bundle.getText("S2PSRDCNASHPODKEY") : thisCntrlr.bundle.getText("S2PSRDCEVALKEY");
					EsaData.NAV_EXCEPINFO.ShipTerms = ExepType;
					//***************************Start Of PCR034716++ Q2C ESA,PSR Enhancements********************
					if(EsaData.InitFy21Q2 === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL")){
					   SelIndex === 1 ? (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAOUTSHIPCSTRD).setSelectedIndex(1), 
							thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAOUTSHIPCSTRD).setEditable(false), EsaData.NAV_QAINFO.OutboundShipCost = SelIndex) 
							: thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAOUTSHIPCSTRD).setEditable(true);		
					   if(SelIndex === 1){
	                      thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAOUTSHIPCSTRD).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
					   }
					   else{
                          if(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAOUTSHIPCSTRD).getSelectedIndex() > 0){
                             thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAOUTSHIPCSTRD).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
                          }
                          else{
                             thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAOUTSHIPCSTRD).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT"));
                          }
					   }														
					}
					//***************************End Of PCR034716++ Q2C ESA,PSR Enhancements**********************
					SelIndex === 2 ? thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESASHPTRMVBX).setVisible(true) : thisCntrlr.getView().byId(
						com.amat.crm.opportunity.Ids.S2ESASHPTRMVBX).setVisible(false);
					break;
				case com.amat.crm.opportunity.Ids.S2ESASPSHPCONRD:
					var ShipVal = SelIndex === 1 ? thisCntrlr.bundle.getText("S2PSRDCNASHPODKEY") : thisCntrlr.bundle.getText("S2PSRDCEVALKEY");
					EsaData.NAV_EXCEPINFO.SplitShip = ShipVal;
					SelIndex === 2 ? thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESASPSHPCONVBX).setVisible(true) : thisCntrlr.getView().byId(
						com.amat.crm.opportunity.Ids.S2ESASPSHPCONVBX).setVisible(false);
					break;
				}
				thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
			},
			/** 
			 * This method Handles ESA InPut Control Live Change Event.
			 * 
			 * @name checkPrice
			 * @param sorIpVal - Field Value
			 * @returns sorIpVal - Valid Field Value
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
			 * 
			 * @name onHandleEsaInpLivChange
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onHandleEsaInpLivChange: function (oEvent) {
				var sourceId = oEvent.getSource().getId().split("--")[oEvent.getSource().getId().split("--").length - 1];
				if (oEvent.getSource().getValue().trim() === "" && oEvent.getSource().getValue().length !== 0) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSFBLNKCHAREORMSG"));
					thisCntrlr.getView().byId(sourceId).setValue("");
				} else {
					var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
					var sorIpVal = oEvent.getSource().getValue().length >= 255 ? (oEvent.getParameters().value.substr(0, 254)) : oEvent.getSource().getValue();
					oEvent.getSource().getValue().length >= 255 ? this.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCMCOMMVALTXT")) : "";
					switch (sourceId) {
					case com.amat.crm.opportunity.Ids.S2ESAPREAGREEIP:
						sorIpVal = oEvent.getSource().getValue().length >= 30 ? (oEvent.getParameters().value.substr(0, 30)) : oEvent.getSource().getValue();
						oEvent.getSource().getValue().length >= 30 ? this.showToastMessage(thisCntrlr.bundle.getText(thisCntrlr.bundle.getText(
							"S2ESAIDSPREAGREEEORMSG"))) : "";
						EsaData.NAV_QAINFO.PrevAgrementChkno = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
					case com.amat.crm.opportunity.Ids.S2ESATABMAIP:
						sorIpVal = oEvent.getSource().getValue().length >= 40 ? (oEvent.getParameters().value.substr(0, 40)) : oEvent.getSource().getValue();
						oEvent.getSource().getValue().length >= 40 ? this.showToastMessage(thisCntrlr.bundle.getText(thisCntrlr.bundle.getText(
							"S2ESAIDSTAMBAEORMSG"))) : "";
						EsaData.Tamba = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
					case com.amat.crm.opportunity.Ids.S2ESARFEOTHIP:
						EsaData.NAV_QAINFO.ReasonForEvalNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
					case com.amat.crm.opportunity.Ids.S2ESAEQUIPAGREEIP:
						EsaData.NAV_QAINFO.EqupDescEvalNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
								.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));                                   //PCR028711++; modify value state
						break;
					case com.amat.crm.opportunity.Ids.S2ESAEQUIPSOFTOTHSELIP:
						EsaData.NAV_QAINFO.EquipNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
					case com.amat.crm.opportunity.Ids.S2ESAEQUIPSEL1PRIP:
						EsaData.NAV_QAINFO.EquipSelectNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
					case com.amat.crm.opportunity.Ids.S2ESAEVAL1TSNDACAGREIP:
						EsaData.NAV_QAINFO.AcepSpecnoNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
					case com.amat.crm.opportunity.Ids.S2ESAEVALTSNDDATIP:
						EsaData.NAV_QAINFO.DataSpecProvNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
					case com.amat.crm.opportunity.Ids.S2ESAPRCTSSALPRCIP:
						sorIpVal = thisCntrlr.checkPrice(sorIpVal);
						sorIpVal === "" ? (thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
							sourceId).setValue(0)) : "";
						EsaData.NAV_QAINFO.TargetSalesPrice = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
					case com.amat.crm.opportunity.Ids.S2ESAPRCTBSALPRCIP:
						sorIpVal = thisCntrlr.checkPrice(sorIpVal);
						sorIpVal === "" ? (thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
							sourceId).setValue(0)) : "";
						EsaData.NAV_QAINFO.BottomSalesPrice = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
					case com.amat.crm.opportunity.Ids.S2ESAPRCCOMTBSALPRCIP:
						EsaData.NAV_QAINFO.BottomCommNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
				    //***************************Start Of PCR025717 Q2C Q4 2019 Enhancements********************
					case com.amat.crm.opportunity.Ids.S2ESAIDEPRCEVAIP:
						sorIpVal = thisCntrlr.checkPrice(sorIpVal);
						sorIpVal === "" ? (thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
							sourceId).setValue(0)) : "";
						EsaData.NAV_QAINFO.EvaNetDiffVal = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
					case com.amat.crm.opportunity.Ids.S2ESAIDEPRCVPSIP:
						oEvent.getSource().getValue().length >= 11 ? this.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSGROTHEORMSG")) : "";
						sorIpVal = oEvent.getSource().getValue().length >= 11 ? (oEvent.getParameters().value.substr(0, 10)) : oEvent.getSource().getValue();
						sorIpVal === "" ? (thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
							sourceId).setValue(0)) : "";
						EsaData.NAV_QAINFO.VpsNetPerTarget = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
					case com.amat.crm.opportunity.Ids.S2ESAIDEPRCHVMIP:
						sorIpVal = thisCntrlr.checkPrice(sorIpVal);
						sorIpVal === "" ? (thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
							sourceId).setValue(0)) : "";
						EsaData.NAV_QAINFO.ExpSlsPriceHvm = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
				    //***************************End Of PCR025717 Q2C Q4 2019 Enhancements********************
					case com.amat.crm.opportunity.Ids.S2ESAPRCGRSMARTARIP:
						oEvent.getSource().getValue().length >= 11 ? this.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSGROTHEORMSG")) : "";
						sorIpVal = oEvent.getSource().getValue().length >= 11 ? (oEvent.getParameters().value.substr(0, 10)) : oEvent.getSource().getValue();
						sorIpVal === "" ? (thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
							sourceId).setValue(0)) : "";
						EsaData.NAV_QAINFO.MarginPerTarget = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
					case com.amat.crm.opportunity.Ids.S2ESAPRCGRSMARBOTIP:
						oEvent.getSource().getValue().length >= 11 ? this.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSGROTHEORMSG")) : "";
						sorIpVal = oEvent.getSource().getValue().length >= 11 ? (oEvent.getParameters().value.substr(0, 10)) : oEvent.getSource().getValue();
						sorIpVal === "" ? (thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSENTRVALIDNMSG")), thisCntrlr.getView().byId(
							sourceId).setValue(0)) : "";
						EsaData.NAV_QAINFO.MarginPerBottom = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
					case com.amat.crm.opportunity.Ids.S2ESAPRCJUSTIP:
						EsaData.NAV_QAINFO.PriceJustiNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
					case com.amat.crm.opportunity.Ids.S2ESASHPSTPROTRMIP:
						EsaData.NAV_EXCEPINFO.ShipPropTermNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
					case com.amat.crm.opportunity.Ids.S2ESASHPSTDESIP:
						EsaData.NAV_EXCEPINFO.ShipDescNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
					case com.amat.crm.opportunity.Ids.S2ESASHPSTJUSTIP:
						EsaData.NAV_EXCEPINFO.ShipJustiNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
					case com.amat.crm.opportunity.Ids.S2ESASHPSTCOMMIP:
						EsaData.NAV_EXCEPINFO.ShipCommNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
					case com.amat.crm.opportunity.Ids.S2ESASHPSSRCLOOCIP:
						EsaData.NAV_EXCEPINFO.ShipLoc = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
					case com.amat.crm.opportunity.Ids.S2ESASHPSSRCJUSTIP:
						EsaData.NAV_EXCEPINFO.SplitJustiNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
					case com.amat.crm.opportunity.Ids.S2ESASHPSSRCCOMMIP:
						EsaData.NAV_EXCEPINFO.SplitCommNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
					case com.amat.crm.opportunity.Ids.S2ESAEQUIPRETNOTHIP:
						EsaData.NAV_QAINFO.EquipReturnOtherNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
					case com.amat.crm.opportunity.Ids.S2ESASUPMONTHVALIP:
						sorIpVal = sorIpVal.indexOf(".") > 0 ? sorIpVal.substring(0, sorIpVal.indexOf(".")) : sorIpVal;
						sorIpVal.length > 3 ? thisCntrlr.showToastMessage(thisCntrlr.bundle.getText(thisCntrlr.bundle.getText("S2ESAIDSMONTHEORMSG"))) :
							"";
						sorIpVal = sorIpVal.length > 3 ? sorIpVal.substring(0, 3).trim() : sorIpVal.trim();
						if (parseInt(sorIpVal) < 0 || sorIpVal === "") {
							thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSENTRMONTHVALIDNMSG"));
							sorIpVal === "" ? (thisCntrlr.getView().byId(sourceId).setValue(0)) : "";
							thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						} else {
							EsaData.NAV_QAINFO.SupportRemMonths = sorIpVal;
							thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						}
						break;
					case com.amat.crm.opportunity.Ids.S2ESASUPEXMONTHVALIP:
						sorIpVal = sorIpVal.indexOf(".") > 0 ? sorIpVal.substring(0, sorIpVal.indexOf(".")) : sorIpVal;
						sorIpVal.length > 3 ? thisCntrlr.showToastMessage(thisCntrlr.bundle.getText(thisCntrlr.bundle.getText("S2ESAIDSMONTHEORMSG"))) :
							"";
						sorIpVal = sorIpVal.length > 3 ? sorIpVal.substring(0, 3).trim() : sorIpVal.trim();
						if (parseInt(sorIpVal) < 0 || sorIpVal === "") {
							thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSENTRMONTHVALIDNMSG"));
							sorIpVal === "" ? (thisCntrlr.getView().byId(sourceId).setValue(0)) : "";
							thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						} else {
							EsaData.NAV_QAINFO.SupportExeMonths = sorIpVal;
							thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						}
						break;
					case com.amat.crm.opportunity.Ids.S2ESAPAYTRMEXOTHIP:
						EsaData.NAV_EXCEPINFO.ExcepPaytermNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
					case com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP:
						thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSENTRPAYTRMVALIDNMSG"));
						thisCntrlr.getView().byId(sourceId).setValue("");
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTDESIP).setValue("");
						thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT"));
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTDESIP).setValueState(thisCntrlr.bundle.getText(
							"S2ERRORVALSATETEXT"));
						break;
					case com.amat.crm.opportunity.Ids.S2ESAPAYTRMJUSTIP:
						EsaData.NAV_EXCEPINFO.PaytermJustiNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						(parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) === 1 || parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) === 2 ) && sorIpVal === "" ? 
							thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
							 .getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
					case com.amat.crm.opportunity.Ids.S2ESAPAYTRMCOMMIP:
						EsaData.NAV_EXCEPINFO.PaytermCommNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						break;
						//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
					case com.amat.crm.opportunity.Ids.S2ESAPTCTAMSTRAGMT_TEXT:
						EsaData.NAV_EXCEPINFO.StandardPayteamNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
								.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
						//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
						//*************************Start Of PCR034716++ Q2C ESA,PSR Enhancements********************
					case com.amat.crm.opportunity.Ids.S2ESAEVAL23RDDESIP:
						EsaData.NAV_QAINFO.SuccEvalCommNote = sorIpVal;
						thisCntrlr.getView().byId(sourceId).setValue(sorIpVal);
						sorIpVal === "" ? thisCntrlr.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) : thisCntrlr
								.getView().byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
						break;
						//*************************End Of PCR034716++ Q2C ESA,PSR Enhancements**********************
					}
				}
			},
			/** 
			 * This method Handles ESA Check Box Select Event.
			 * 
			 * @name onEsaCkbSelect
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onEsaCkbSelect: function (oEvent) {
				var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				var sourceId = oEvent.getSource().getId().split("--")[oEvent.getSource().getId().split("--").length - 1];
				var ckbSelVal = oEvent.getSource().getSelected() === true ? thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") : "";
				switch (sourceId) {
				case com.amat.crm.opportunity.Ids.S2ESAPRETRMCOMCKB:
					EsaData.NAV_QAINFO.PrevAgrementChk = ckbSelVal;
					break;
				case com.amat.crm.opportunity.Ids.S2ESAEQUIPMCKB:
					EsaData.NAV_QAINFO.DevArrngeChk = ckbSelVal;
					break;
				case com.amat.crm.opportunity.Ids.S2ESAABTUPGDCKB:
					EsaData.NAV_QAINFO.AbilityUpgradeChk = ckbSelVal;
					break;
				case com.amat.crm.opportunity.Ids.S2ESASUPPORTCKB:
					EsaData.NAV_QAINFO.SupportChk = ckbSelVal;
					var eblVal = ckbSelVal === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? true : false;
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESASUPMONTHVALIP).setEnabled(eblVal);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESASUPEXMONTHVALIP).setEnabled(eblVal);
					eblVal === false ? (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESASUPMONTHVALIP).setValue(""),
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESASUPEXMONTHVALIP).setValue("")) : "";
					break;
					//*************************Start Of PCR034716++ Q2C ESA,PSR Enhancements********************
				case com.amat.crm.opportunity.Ids.S2ESAEQUIPSMRTEVALCHKBOX:
					EsaData.NAV_QAINFO.EquipUnrelChk = ckbSelVal;
					break;
					//*************************End Of PCR034716++ Q2C ESA,PSR Enhancements**********************
				}
			},
			/** 
			 * This method Handles ESA Date picker Select Event.
			 * 
			 * @name onHandleDatChange
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onHandleDatChange: function (oEvent) {
				var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				var sourceId = oEvent.getSource().getId().split("--")[oEvent.getSource().getId().split("--").length - 1];
				var selDate = oEvent.getSource().getDateValue();
				switch (sourceId) {
				case com.amat.crm.opportunity.Ids.S2ESAEVAL1TSNDACAGREDP:
					EsaData.NAV_QAINFO.AcepSpecDate = selDate;
					break;
				case com.amat.crm.opportunity.Ids.S2ESAEVALTSNDENDDTPKR:
					EsaData.NAV_QAINFO.EvalEndDate = typeof (EsaData.NAV_QAINFO.EvalEndDate) === thisCntrlr.bundle.getText("S2ESAIDSSTRCHKTXT") ?
						thisCntrlr.checkDate(EsaData.NAV_QAINFO.EvalEndDate) : EsaData.NAV_QAINFO.EvalEndDate;
					EsaData.NAV_QAINFO.EvalStartDate = typeof (EsaData.NAV_QAINFO.EvalStartDate) === thisCntrlr.bundle.getText("S2ESAIDSSTRCHKTXT") ?
						thisCntrlr.checkDate(EsaData.NAV_QAINFO.EvalStartDate) : EsaData.NAV_QAINFO.EvalStartDate;
					EsaData.NAV_QAINFO.EvalStartDate !== "" ? (selDate - EsaData.NAV_QAINFO.EvalStartDate < 0 ? (thisCntrlr.showToastMessage(
							thisCntrlr.bundle.getText("S2ESAIDSENTRSTRTENDDTVALIDNMSG")), thisCntrlr.byId(sourceId).setValue(null), EsaData.NAV_QAINFO
						.EvalEndDate = null) : EsaData.NAV_QAINFO.EvalEndDate = selDate) : EsaData.NAV_QAINFO.EvalEndDate = selDate;
					break;
				case com.amat.crm.opportunity.Ids.S2ESAEVALTSNDSTARTDTPKR:
					EsaData.NAV_QAINFO.EvalEndDate = typeof (EsaData.NAV_QAINFO.EvalEndDate) === thisCntrlr.bundle.getText("S2ESAIDSSTRCHKTXT") ?
						thisCntrlr.checkDate(EsaData.NAV_QAINFO.EvalEndDate) : EsaData.NAV_QAINFO.EvalEndDate;
					EsaData.NAV_QAINFO.EvalStartDate = typeof (EsaData.NAV_QAINFO.EvalStartDate) === thisCntrlr.bundle.getText("S2ESAIDSSTRCHKTXT") ?
						thisCntrlr.checkDate(EsaData.NAV_QAINFO.EvalStartDate) : EsaData.NAV_QAINFO.EvalStartDate;
					EsaData.NAV_QAINFO.EvalEndDate !== "" ? (selDate - EsaData.NAV_QAINFO.EvalEndDate > 0 ? (thisCntrlr.showToastMessage(thisCntrlr.bundle
							.getText("S2ESAIDSENTRSTRTENDDTVALIDNMSG")), thisCntrlr.byId(sourceId).setValue(null), EsaData.NAV_QAINFO.EvalStartDate = null) :
						EsaData.NAV_QAINFO.EvalStartDate = selDate) : EsaData.NAV_QAINFO.EvalStartDate = selDate;
					break;
				case com.amat.crm.opportunity.Ids.S2ESAEVALTSNDESTSHIPDTPKR:
					EsaData.NAV_QAINFO.EvalShipDate = selDate;
					break;
				}
				thisCntrlr.byId(sourceId).getDateValue() !== null ? thisCntrlr.byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT")) :
					thisCntrlr.byId(sourceId).setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT"));
			},
			/** 
			 * This method use to convert String Date to Object.
			 * 
			 * @name checkDate
			 * @param reqDate - String Date
			 * @returns reqDate - Date Object
			 */
			checkDate: function (reqDate) {
				return reqDate !== "" ? (reqDate = (typeof (reqDate) === thisCntrlr.bundle.getText("S2ESAIDSSTRCHKTXT") ? new Date(reqDate.substring(
					0, 4) + "-" + reqDate.substring(4, 6) + "-" + reqDate.substring(6, 8)) : "")) : "";
			},
			/** 
			 * This method Handles ESA Save Button Press Event.
			 * 
			 * @name onSaveESAIDS
			 * @param ActionType - Save Action Type, Msg- Display Message
			 * @returns 
			 */
			onSaveESAIDS: function (ActionType, Msg, EditFlag) {
				var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData(),
					MinContact = false;
				var obj = esaDisModel.esaSavSubPayload(thisCntrlr, EsaData, ActionType);
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, Msg);
				if (ActionType !== thisCntrlr.bundle.getText("S1TABLESALESTAGECOL")) {
					thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, "");
					var oModel = thisCntrlr.getDataModels();
					MinContact = ActionType === thisCntrlr.bundle.getText("S2CBCANSSUCCESSKEY") ? thisCntrlr.checkMContact("", thisCntrlr.bundle.getText(
						"S2CBCANSSUCCESSKEY")) : "";
					var SFCheck = ActionType === thisCntrlr.bundle.getText("S2CBCANSSUCCESSKEY") ? MinContact[0] : false;
					var errorFlag = parseInt(oModel[4].Status) === 5 || parseInt(oModel[4].Status) === 35 ? thisCntrlr.checkValidation() : true;
					if (SFCheck === false && MinContact !== "") {
						//thisCntrlr.showToastMessage(Msg + " " + thisCntrlr.bundle.getText("S2ESAIDSSUMITCHKFAILMSG1") + " " + MinContact[1] + " " +   //PCR028711--
						//		thisCntrlr.bundle.getText("S2ESAIDSSUMITCHKFAILMSG2"));                                                                 //PCR028711--
						thisCntrlr.showToastMessage(Msg + " " + thisCntrlr.bundle.getText("S2PSRCONTACTS"));                                            //PCR028711++
						EditFlag = true;
					} else if (errorFlag === false) {
						thisCntrlr.showToastMessage(Msg + " " + thisCntrlr.bundle.getText("S2ESAIDSPAYTRMMANDTEORMSG"));
						SFCheck = false;
						EditFlag = true;
					}
					var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
						oModel[4], oModel[4].Status, EditFlag, SFCheck, false);
					thisCntrlr.setViewData(EsaModel);
					if (EditFlag === true) {
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOTABMALBL).addStyleClass("sapMEsaEditModeMargin");
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOMASAGRLBL).addStyleClass("sapMEsaEditModeMargin");
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOCTAVPALBL).addStyleClass("sapMEsaEditModeMargin");
					} else {
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOTABMALBL).removeStyleClass("sapMEsaEditModeMargin");
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOMASAGRLBL).removeStyleClass("sapMEsaEditModeMargin");
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAINFOCTAVPALBL).removeStyleClass("sapMEsaEditModeMargin");
					}
				}
			},
			/** 
			 * This method Handles ESA Cancel Button Confirmation Press Event.
			 * 
			 * @name checkValidation
			 * @param
			 * @returns errorFlag - Binary value for validation
			 */
			checkValidation: function () {
				var errorFlag = true;
				var oModel = thisCntrlr.getView().getModel().getData();
				if (oModel.EsaInfoMstrAgrVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;} 
				else if (oModel.EsaInfoMstrAgrIndex === 1) {if (oModel.EsaInfoCTAVPAVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
					errorFlag = false;return errorFlag;}}
				if (oModel.ReasonForEvalSelVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;} 
				else if (oModel.ReasonForEvalSelIndex === 3) {if (oModel.ReasonForEvalNoteVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
					errorFlag = false; return errorFlag;}}
				if (oModel.EqupLonTypeSelVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;} 
				//else if (oModel.EqupLonTypeSelIndex >= 3) {if (oModel.EqupOthnSwtrVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {                      //PCR034716--
				else if (oModel.EqupLonTypeSelIndex >= 3 && oModel.EqupLonTypeSelIndex !== 4) {if (oModel.EqupOthnSwtrVS ===                                       //PCR034716++; Condition Modified
					thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}}                                                        //PCR034716++
				if (oModel.EqupSelOneSelVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				//else if (oModel.EqupSelOneSelIndex === 2) {if (oModel.EqupSelOnePRVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {                      //PCR034716--
				else if (oModel.EqupSelOneSelIndex === 2 && (!oModel.EsaQ2QFlag2021)) {if (oModel.EqupSelOnePRVS ===                                               //PCR034716++; Condition Modified
					thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}}                                                        //PCR034716++
				if (oModel.EsaShipDateDPVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				if (oModel.EsaShipSDateVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				if (oModel.EsaShipEDateDPVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				if (oModel.EsaASpecSelIndex !== 0) {if (oModel.AcepSpecnoNoteVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
					errorFlag = false;return errorFlag;}}
				if (oModel.EsaASpecSelVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				else if (oModel.EsaASpecSelIndex === 2) {if (oModel.AcepSpecDateVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
					errorFlag = false;return errorFlag;}}
				if (oModel.DataSpecProvNoteVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				if (oModel.EsaSuccEvalCustVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				if (oModel.EsaSuccEvalCustIndex > 1) {if (oModel.EsaCustBuyPriceVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
					errorFlag = false;return errorFlag;}}
				if (oModel.PriceJustiNoteVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				if (oModel.EsaShipSTermVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				else if (oModel.EsaShipSTermIndex === 2) {if (oModel.EsaShipSTermJustVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
					errorFlag = false;return errorFlag;}}
				if (oModel.EsaShipSShipVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				else if (oModel.EsaShipSShipIndex === 2) {if (oModel.EsaShipSShipLocVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") || 
						oModel.EsaShipSShipJustVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
					errorFlag = false;return errorFlag;}}
				if (oModel.EsaShipOutShipCostVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				if (oModel.EsaEqipRetnVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				else if (oModel.EsaEqipRetnIndex === 4) {if (oModel.EsaEqipRetnIPVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
					errorFlag = false;return errorFlag;}}
				if (oModel.EsaPayTermStdTermVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") || oModel.EsaPayTermExptVS === thisCntrlr.bundle
					.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				if ((oModel.EsaPayTermExptIndex === 1 || oModel.EsaPayTermExptIndex === 2) && oModel.EsaPayTermPayTrmCodeVS === thisCntrlr.bundle.getText(
						"S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				else if (oModel.EsaPayTermExptIndex === 3) {if (oModel.EsaPayTermExptOthIPVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
					errorFlag = false;return errorFlag;}}
				if (oModel.EsaPayTermExptIndex === 1 || oModel.EsaPayTermExptIndex === 2){if (oModel.EsaPayTermPaytermJustiNoteIPVS === thisCntrlr
						.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}}			
				if (oModel.EsaChinaCondEvalVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				if (oModel.EsaCustRiskVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {errorFlag = false;return errorFlag;}
				//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
				if (oModel.EsaPayTermStdTermIndex === 2 && oModel.EsaStdPayTermCTAIPVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")){
					errorFlag = false;return errorFlag;}
				if (oModel.EqupDescTxtValVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")){errorFlag = false;return errorFlag;}
				//*************************End Of PCR028711 Q2C Enhancements for Q2-20********************
				//*************************Start Of PCR034716++ Q2C ESA,PSR Enhancements********************
				if(oModel.EsaQ2QFlag2021){
				   if(oModel.EqupSelOneSelIndex === 3 || oModel.EqupSelOneSelIndex === 4) {
				      if (oModel.EqupSelOnePRVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
				         errorFlag = false;return errorFlag;}}
				   if(oModel.EsaCustBuyPriceIndex === 3) {
				      if (oModel.EsaSEval23RDDesValVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
				         errorFlag = false;return errorFlag;}}
				}
				//*************************End Of PCR034716++ Q2C ESA,PSR Enhancements********************
				return errorFlag;
			},
			/** 
			 * This method Handles ESA Cancel Button Confirmation Press Event.
			 * 
			 * @name confirmationESACancel
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			confirmationESACancel: function (oEvent) {
				if (oEvent === thisCntrlr.bundle.getText("S2F4HELPOPPOKBTN")) {
					var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
					var oModel = thisCntrlr.getDataModels();
					var payload = esaDisModel.esaInitpayload(oModel[0].Guid, oModel[0].ItemGuid, thisCntrlr.bundle.getText("S2ESAIDSPROSSCANCLKYE"),
						parseInt(oModel[4].VersionNo, oModel[0].ProductLine));
					thisCntrlr.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity.util.ServiceConfigConstants
						.write, payload, thisCntrlr.bundle.getText("S2ESAIDSONCANCLSUCCMSG"));
					thisCntrlr.that_views2.getController().onNavBack();
					myBusyDialog.close();
				}
			},
			/** 
			 * This method Handles ESA Cancel Button Press Event.
			 * 
			 * @name onESACancelProcess
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onESACancelProcess: function (oEvent) {
				var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				var BmoInitiateFlag = this.checkContact(EsaData.NAV_BMO.results);
				if (BmoInitiateFlag === false) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSONCANCLUSERFAILMSG"));
				} else {
					var Mesg = thisCntrlr.bundle.getText("S2ESAIDSONCANCLCONFRMMSG");
					sap.m.MessageBox.confirm(Mesg, this.confirmationESACancel, this.getResourceBundle().getText("S2PSRSDACBCCONDIALOGTYPTXT"));
				}
			},
			/** 
			 * This method Handles ESA Recreate Button Confirmation Press Event.
			 * 
			 * @name onESAResetProcess
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onESAResetProcess: function (oEvent) {
				var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				var BmoInitiateFlag = this.checkContact(EsaData.NAV_BMO.results);
				if (BmoInitiateFlag === false) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSONRESETUSERFAILMSG"));
				} else {
					var Mesg = thisCntrlr.bundle.getText("S2ESAIDSONRESETCONFRMMSG");
					//sap.m.MessageBox.confirm(Mesg, this.confirmationESAReset, this.getResourceBundle().getText("S2PSRSDACBCCONDIALOGTYPTXT"));	//PCR028711--;
					sap.m.MessageBox.confirm(Mesg, this.checkResetEsaCC, this.getResourceBundle().getText("S2PSRSDACBCCONDIALOGTYPTXT"));           //PCR028711++; modify Parameter
				}
			},
			/** 
			 * This method Handles ESA Recreate Button Press Event.
			 * 
			 * @name confirmationESAReset
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			confirmationESAReset: function (oEvent) {
				if (oEvent === thisCntrlr.bundle.getText("S2F4HELPOPPOKBTN")) {
					var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
					var oModel = thisCntrlr.getDataModels();
					var actionType = thisCntrlr.bundle.getText("S2PSRCBCREJECTKEY");
					var payload = esaDisModel.esaInitpayload(oModel[0].Guid, oModel[0].ItemGuid, actionType, parseInt(oModel[4].VersionNo, oModel[0].ProductLine));
					thisCntrlr.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity.util.ServiceConfigConstants
						.write, payload, thisCntrlr.bundle.getText("S2ESAIDSONRESETSUCCMSG"));
					thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, "");
					var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
					var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
						EsaData, EsaData.Status, false, false, false);
					thisCntrlr.setViewData(EsaModel);
					thisCntrlr.EsaTabColorInit();
					myBusyDialog.close();
				}
			},
			/** 
			 * This method Handles ESA Approve/Reject Button Press Event.
			 * 
			 * @name onESAApprove
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onESAApprove: function (oEvent) {
				var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				if (parseInt(EsaData.TaskId) === 0) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2USERROMAUTHFALTTXT"));
				} else {
					this.detActionType = (oEvent.getSource().getText() === thisCntrlr.bundle.getText("S2PSRCBCAPPROVETEXT") ? thisCntrlr.bundle
						.getText("S2PSRCBCAPPROVEKEY") : thisCntrlr.bundle.getText("S2PSRCBCREJECTKEY"));
					this.dialog = new sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRCBCONAPPORREJConfirmation"), this);
					this.getCurrentView().addDependent(this.dialog);
					this.dialog.open();
				}
			},
			/**
			 * This method is used to handles Save Comment Event.
			 * 
			 * @name OnApRctCommLvchng
			 * @param oEvent - Holds the current event
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
			 * 
			 * @name onWFPress
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onWFPress: function (oEvent) {
				if ((thisCntrlr.dialog.getContent()[0].getContent()[1].getValue() === "" || thisCntrlr.dialog.getContent()[0].getContent()[1].getValue()
						.trim() === "") && thisCntrlr.detActionType === thisCntrlr.bundle.getText("S2PSRCBCREJECTKEY")) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCSFACOMMFAILMSG"));
				} else {
					var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
					EsaData.AprvComments = thisCntrlr.dialog.getContent()[0].getContent()[1].getValue();
					var obj = esaDisModel.esaSavSubPayload(thisCntrlr, EsaData, this.detActionType);
					var Msg = this.detActionType === thisCntrlr.bundle.getText("S2PSRCBCAPPROVEKEY") ? thisCntrlr.bundle.getText("S2ESAIDSWFARSUCCMSG") :
						thisCntrlr.bundle.getText("S2PSRSDACBCRJTNNXTLVLTXT");
					thisCntrlr.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, obj, Msg);
					thisCntrlr.onCancelWFPress();
					thisCntrlr.that_views2.getController().onNavBack();
				}
			},
			/**
			 * This method Handles Cancel Button Of Confirmation Dialog.
			 * 
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
			 * This method use to save Esa Form data.
			 * 
			 * @name onSaveFormData
			 * @param 
			 * @returns 
			 */
			onSaveFormData: function () {
				var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				var obj = esaDisModel.esaSavSubPayload(thisCntrlr, EsaData, thisCntrlr.bundle.getText("S2CBCANSSUCCESSKEY"));
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, "");
			},
			/**
			 * This method handles Check List press event .
			 * 
			 * @name onChkListPress
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onChkListPress: function (oEvent) {
				//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
				var oResource = thisCntrlr.getResourceBundle(),
				    SecurityData = this.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();
				if (SecurityData.UpdtChckList !== oResource.getText("S1TABLESALESTAGECOL")) {
					thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
				//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
				} else {
					var oModel = thisCntrlr.getDataModels();
					var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();                                        //PCR028711++; replace thisCntrlr.bundle with oResource
					var EsaCLAuth = false,
						ESACLEdit = false;
					if (EsaData.ActiveVersion === oResource.getText("S1TABLESALESTAGECOL") && parseInt(EsaData.Status) === 30) {                      //PCR028711++; replace thisCntrlr.bundle with oResource
						var romInitiateFlag = this.checkContact(oModel[4].NAV_ROM.results);
						var pomInitiateFlag = this.checkContact(oModel[4].NAV_POM.results);
						EsaCLAuth = romInitiateFlag === true || pomInitiateFlag === true ? true : false;
						ESACLEdit = EsaCLAuth;
					} else {
						EsaCLAuth = true;
						ESACLEdit = false;
					}
					if (EsaCLAuth === false) {
						thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSONCHKLSTUSERFAILMSG"));                                                //PCR028711++; replace thisCntrlr.bundle with oResource
					} else {
						var ChkLstModel = thisCntrlr.getChekLstModel(oModel[4], ESACLEdit);
						for(var i = 0; i < ChkLstModel.getData().ItemSet.length; i++){                                                                //PCR035760++
							ChkLstModel.getData().ItemSet[i].AnsCheck = ChkLstModel.getData().ItemSet[i].AnsCheck ===
								oResource.getText("S2ODATAPOSVAL") ? true : false;                                                                    //PCR035760++
						  }                                                                                                                           //PCR035760++
						this.dialog = sap.ui.xmlfragment(oResource.getText("OppSearch_OppChkListFragment"), this);                                    //PCR028711++; replace text
						this.dialog.getContent()[0].setModel(ChkLstModel);
						this.dialog.getButtons()[0].setEnabled(ESACLEdit);
						this.dialog.getContent()[1].getContent()[1].setModel(thisCntrlr.getChekLstCommentsModel());									  //PCR034716++
						this.getCurrentView().addDependent(this.dialog);
						//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
						var qaList = ChkLstModel.getData().ItemSet;
						var qaSubmitFlag = this.checkSubmission(qaList);
						if (qaSubmitFlag === false) {
							this.dialog.getButtons()[0].setText(oResource.getText("S2PSRSDASAVEBTNTEXT"));
						}
						else{
							this.dialog.getButtons()[0].setText(oResource.getText("S2PSRSDACBCSFASUBTYPEMSG"));
						}
						//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
						this.dialog.setContentWidth("1000px");
						this.dialog.open();
					}
				}
			},
			/**
			 * This method handles Check List press event .
			 * 
			 * @name getChekLstModel
			 * @param Model - EsaModel, ESACLEdit - Edit Flag
			 * @returns ChkLst - CheckList Dialog Model
			 */
			getChekLstModel: function (Model, ESACLEdit) {
				//***********Start Of PCR028711 Q2C Enhancements for Q2-20************************
				var oResource = thisCntrlr.getResourceBundle(),
				    configConsts = com.amat.crm.opportunity.util.ServiceConfigConstants,
				    sValidate = configConsts.CheckListSet + Model.Guid + configConsts.CheckListGuid + Model.ItemGuid + configConsts.CheckListVer + Model.VersionNo +
					            configConsts.CheckListExp;
				thisCntrlr.serviceCall(sValidate, configConsts.read, "", "");
				var ChkLstData = thisCntrlr.getModelFromCore(oResource.getText("S2ESATDSCHKLSTMODEL")).getData().NAV_CHECKLIST,
				//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
					ChkLst = [];
				for (var i = 0; i <= ChkLstData.results.length - 1; i++) {
					var obj = {};
					obj.Guid = ChkLstData.results[i].Guid;
					obj.ItemGuid = ChkLstData.results[i].ItemGuid;
					obj.VersionNo = ChkLstData.results[i].VersionNo;
					obj.Qid = ChkLstData.results[i].Qid;
					obj.Qdesc = ChkLstData.results[i].Qdesc;
					obj.Comments = ChkLstData.results[i].Comments;
					obj.AnsCheck = ChkLstData.results[i].AnsCheck;
					obj.QaVerNo = ChkLstData.results[i].QaVerNo;
					obj.CustQid = i + 1;
					obj.ChkLstEnabled = ESACLEdit;
					ChkLst.push(obj);
				}
				return new sap.ui.model.json.JSONModel({
					"ItemSet": ChkLst
				});
			},
			/**
			 * This method handles Check List press event.
			 * 
			 * @name onEsaChkLstSubmit
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onEsaChkLstSubmit: function (oEvent) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var ChkListTabData = oEvent.getSource().getParent().getContent()[0].getModel().getData().ItemSet,
				//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
				    chkListFlag = this.dialog.getButtons()[0].getText(),
				    chkListMsg = "";
				//var obj = esaDisModel.esaChkListPayload(thisCntrlr, ChkListTabData);
				var obj = esaDisModel.esaChkListPayload(thisCntrlr, ChkListTabData, chkListFlag);
				chkListMsg = chkListFlag == thisCntrlr.bundle.getText("S2PSRSDACBCSFASUBTYPEMSG") ?
						thisCntrlr.bundle.getText("S2ESAIDSONCHKLSTSUCCMSG"): thisCntrlr.bundle.getText("S2ESAIDSONCHKLSTSAVEMSG");
				//this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAChecklist, com.amat.crm.opportunity
				//		.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText("S2ESAIDSONCHKLSTSUCCMSG"));
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAChecklist, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, obj, chkListMsg);
				//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
				thisCntrlr.getRefreshEsaData(ChkListTabData[0].Guid, ChkListTabData[0].ItemGuid, "");
				var oModel = thisCntrlr.getDataModels();
				var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
					oModel[4], oModel[4].Status, false, false, false);
				thisCntrlr.setViewData(EsaModel);
				thisCntrlr.onCancelWFPress();
				thisCntrlr.EsaTabColorInit();
				myBusyDialog.close();
			},
			/**
			 * This method handles PayTerm Code F4 help event.
			 * 
			 * @name handleSelPayTermCode
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			handleSelPayTermCode: function (oEvent) {
				var PayTrmModel = thisCntrlr.getPayTrmModel();
				this.dialog = sap.ui.xmlfragment("com.amat.crm.opportunity.view.fragments.PayTrmSel", this);
				this.dialog.setModel(PayTrmModel);
				this.getCurrentView().addDependent(this.dialog);
				this.dialog.open();
			},
			/**
			 * This method handles PayTerm Code get model.
			 * 
			 * @name getPayTrmModel
			 * @param oEvent - Event Handler
			 * @returns PayTrmArr - PayTerm Code Model
			 */
			getPayTrmModel: function (oEvent) {
				thisCntrlr.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAPayTrmConSet,
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
					"ItemSet": PayTrmArr
				});
			},
			/**
			 * This method handles PayTerm Code selection dialog live change event.
			 * 
			 * @name handleSearch
			 * @param oEvent - Event Handler
			 * @returns
			 */
			handleSearch: function (oEvent) {
				var oFilter, aFilters = [];
				var sQuery = oEvent.getParameters().value;
				if (sQuery && sQuery.length > 0) {
					aFilters = [
						new sap.ui.model.Filter("Code", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("Desc", sap.ui.model.FilterOperator.Contains, sQuery)

					];
					oFilter = new sap.ui.model.Filter(aFilters, false);
				}
				var binding = oEvent.getSource().getItems()[0].getParent().getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
				binding.filter(oFilter);
			},
			/**
			 * This method handles PayTerm Code selection dialog Selection event.
			 * 
			 * @name onSelectPT
			 * @param oEvent - Event Handler
			 * @returns
			 */
			onSelectPT: function (oEvent) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var path = oEvent.getParameters().selectedContexts[0].getPath();
				var SelRecord = oEvent.getParameters().selectedContexts[0].getModel().getProperty(path);
				var EsaData = this.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				EsaData.NAV_EXCEPINFO.PaytermCode = SelRecord.Code;
				EsaData.NAV_EXCEPINFO.PaytermDescNote = SelRecord.Desc;
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).setValue(SelRecord.Code);
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTDESIP).setValue(SelRecord.Desc);
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).setValueState(thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"));
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTDESIP).setValueState(thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"));
				myBusyDialog.close();
			},
			/**
			 * This method handles Request Extension press event.
			 * 
			 * @name onReqExtPress
			 * @param oEvent - Event Handler
			 * @returns
			 */
			onReqExtPress: function (oEvent) {
				var oResource = thisCntrlr.getResourceBundle();                                                                                     //PCR028711++;
				var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();                                          //PCR028711++; replace thisCntrlr.bundle with oResource
				var bomInitiateFlag = this.checkContact(EsaData.NAV_BMO.results);
				if (bomInitiateFlag === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2ESABMOAUTHCKNMSG"));                                                           //PCR028711++; replace thisCntrlr.bundle with oResource
				} 
				//*************************Start Of PCR034716++ Q2C ESA,PSR Enhancements********************
				else if(EsaData.CheklistFlag !== oResource.getText("S1TABLESALESTAGECOL") || !(parseInt(EsaData.Status) === 50)){
					sap.m.MessageBox.warning(oResource.getText("ESABMOCHEKLISTEVALEXT"));
				}
				//*************************End Of PCR034716++ Q2C ESA,PSR Enhancements**********************
				else {
					var Mesg = oResource.getText("S2ESAIDSONEXTDEDCONFRMMSG");                                                                      //PCR028711++; replace thisCntrlr.bundle with oResource
					//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
					//sap.m.MessageBox.confirm(Mesg, this.confirmationESAExtReq, this.getResourceBundle().getText("S2PSRSDACBCCONDIALOGTYPTXT"));
					if(EsaData.NAV_ESA_CC.results.length > 0){
						sap.m.MessageBox.confirm(Mesg, this.confirmationESAExtReqCC, oResource.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
					}
					else{
						sap.m.MessageBox.confirm(Mesg, this.confirmationESAExtReq, oResource.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
					}
					//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
				}
			},
			/**
			 * This method handles Request Extension Confirmation dialog event.
			 * 
			 * @name onReqExtPress
			 * @param oEvent - Event Handler
			 * @returns
			 */
			confirmationESAExtReq: function (oEvent) {
				if (oEvent === thisCntrlr.bundle.getText("S2F4HELPOPPOKBTN")) {
					var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
					var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
					var obj = esaDisModel.esaSavSubPayload(thisCntrlr, EsaData, thisCntrlr.bundle.getText("S2ESAIDSPROSSEXDEDKYE"));
					thisCntrlr.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ESAInfoSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText("S2ESAIDSONEXTDEDSUCCMSG"));
					thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, "");
					var oModel = thisCntrlr.getDataModels();
					var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
						oModel[4], oModel[4].Status, true, false, false);
					thisCntrlr.setViewData(EsaModel);
					thisCntrlr.EsaTabColorInit();
					myBusyDialog.close();
				}
			},
			/**
			 * This method uses to reset ESA tab button Color.
			 * 
			 * @name EsaTabColorInit
			 * @param 
			 * @returns
			 */
			EsaTabColorInit: function () {
				var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
				var EsaTab = thisCntrlr.that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_ESA);
				switch (parseInt(EsaData.Status)) {
				case 5:
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
			//*************** Start Of PCR028711: Q2C Enhancements for Q2-20 ****************
			/**
			 * This method Handles ESA form print functionality.
			 * @name onPressPrintESA
			 * @param oEvent - Event Handlers
			 * @returns
			 */
			onPressPrintESA: function(oEvent){
				sap.m.MessageBox.confirm(thisCntrlr.bundle.getText("S2ESAPRINTREQIREDVALIDATIONTXT"),
						this.confirmationESAPrint, thisCntrlr.bundle.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
			},
			/**
			 * This method Handles CBC Print validation OK button press event.
			 * @name confirmationCBCPrint
			 * @param oEvent - Event Handlers
			 * @returns
			 */
			confirmationESAPrint : function(oEvent){
				var oResource = thisCntrlr.getResourceBundle(),
				    configConsts = com.amat.crm.opportunity.util.ServiceConfigConstants;
				if(oEvent === oResource.getText("S2CONFFRGOKBTN")){
				var ItemGuid = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid,
				    verNo = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData().VersionNo,
				    url = thisCntrlr.oMyOppModel._oDataModel.sServiceUrl + configConsts.EsaPrintSet + ItemGuid + configConsts.EsaPrintTypeVer + verNo + configConsts.EsaPrintValue;
				window.open(url);
				}
			},
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
				this.serviceCall(sGenaralChoos, configConsts.read, "", "");
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
			 * @returns
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
					    	 var edtBtnTxt = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAESABTN).getText(),
					    	     edtFlag = edtBtnTxt === oResource.getText("S2PSRSDACANBTNTXT") ? true : false,
					    	     payload = thisCntrlr.getDLinkPayLoad(oResource.getText("S1ESAIDSPROSTYPTXT"), Msg, ESAData);
							 thisCntrlr.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CCopyDLinkSet, com.amat.crm.opportunity
										.util.ServiceConfigConstants.write, payload, oResource.getText("S2CCDLNKSUSSMSG"));							
							 thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, "");
							 oModel = thisCntrlr.getDataModels();
							 var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
			 							oModel[4], oModel[4].Status, edtFlag, false, false);
							 thisCntrlr.setViewData(EsaModel);
							 var oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESA_PANL_MAIN_COMMENT_COMMTABLE);
							 oTable.getModel().setProperty("/oEsaManComm", EsaModel.oEsaManComm);
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
					var ccTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PESA_CRBNCPY_TBL),
					    ResetData = ccTable.getModel().getData().NAV_ESA_CC.results;
					for(var i=0;i<ResetData.length;i++){
					   ResetData[i].Selectflag = true;
					}
					thisCntrlr.dialog = sap.ui.xmlfragment(oResource.getText("PSRPDCONRESETConfirmation"), thisCntrlr);
					(ResetData.length > 0)?(thisCntrlr.dialog.getContent()[1].setVisible(true)):(thisCntrlr.dialog.getContent()[1].setVisible(false));
					for(var i = 0; i < ResetData.length; i++){                                                                                                                      //PCR035760++
						 ResetData[i].Selectflag = ResetData[i].Selectflag === oResource.getText("S2ODATAPOSVAL") ? true : false;                                                   //PCR035760++
					 }                                                                                                                                                              //PCR035760++
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
						    payload = esaDisModel.esaInitpayload(oModel[0].Guid, oModel[0].ItemGuid, actionType, parseInt(oModel[4].VersionNo, oModel[0].ProductLine));
						thisCntrlr.serviceCall(configConsts.ESAInfoSet, configConsts.write, payload, oResource.getText("S2ESAIDSONRESETSUCCMSG"));
						myBusyDialog.close();
			    	}	
			    	else{
					   var actionType = oResource.getText("S2ESAIDSRECRTKEY"),
					       payload = esaDisModel.esaInitpayload(oModel[0].Guid, oModel[0].ItemGuid, actionType, parseInt(oModel[4].VersionNo, oModel[0].ProductLine)),
					       CBCCcTabData = this.dialog.getContent()[1].getModel().getData().ItemSet;
					   for(var i=0;i<this.dialog.getContent()[1].getModel().getData().ItemSet.length;i++){
						   if(this.dialog.getContent()[1].getModel().getData().ItemSet[i].Selectflag){
							   CBCCcTabData[i].Repflag = oResource.getText("S1TABLESALESTAGECOL");
						   }
						   else{
							   CBCCcTabData[i].Repflag="";
						   }
						   delete CBCCcTabData[i].Selectflag;
						   delete CBCCcTabData[i].Selected;
					   }
					   payload.NAV_ESA_CC = CBCCcTabData;
					   payload.AprvComments = thisCntrlr.dialog.getContent()[0].getContent()[1].getValue();
					   thisCntrlr.serviceCall(configConsts.ESAInfoSet, configConsts.write, payload, oResource.getText("S2ESAIDSONRESETSUCCMSG"));
					   myBusyDialog.close();
					   DependFlag = true;
			    	}
			    }
			    else if(thisCntrlr.EsaCcActType === oResource.getText("S1TABLESALESTAGECOL")){
			    	var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
			    	if(!(this.dialog.getContent()[1].getModel().getData().ItemSet.length > 0)){
						var obj = esaDisModel.esaSavSubPayload(thisCntrlr, oModel[4], oResource.getText("S2ESAIDSPROSSEXDEDKYE"));						
						thisCntrlr.serviceCall(configConsts.ESAInfoSet, configConsts.write, obj, oResource.getText("S2ESAIDSONEXTDEDSUCCMSG"));
						myBusyDialog.close();
						EditFlag = true;
			    	}
			    	else{
			    		oModel[4].AprvComments = thisCntrlr.dialog.getContent()[0].getContent()[1].getValue();
						var obj = esaDisModel.esaSavSubPayload(thisCntrlr, oModel[4], oResource.getText("S2ESAIDSPROSSEXDEDKYE")),
						    actionType = oResource.getText("S2ESAIDSPROSSEXDEDKYE");
						obj.ActionType = actionType;
					    var CBCCcTabData = this.dialog.getContent()[1].getModel().getData().ItemSet;
					    for(var i=0;i<this.dialog.getContent()[1].getModel().getData().ItemSet.length;i++){
						   if(this.dialog.getContent()[1].getModel().getData().ItemSet[i].Selectflag){
							   CBCCcTabData[i].Repflag = oResource.getText("S1TABLESALESTAGECOL");
						   }
						   else{
							   CBCCcTabData[i].Repflag="";
						   }
						   delete CBCCcTabData[i].Selectflag;
						   delete CBCCcTabData[i].Selected;
					    }
					    obj.NAV_ESA_CC = CBCCcTabData;
						thisCntrlr.serviceCall(configConsts.ESAInfoSet, configConsts.write, obj, oResource.getText("S2ESAIDSONEXTDEDSUCCMSG"));
						myBusyDialog.close();
						EditFlag = true;
						DependFlag = true;
			    	}
			    }
			    EditFlag = DependFlag ? false : EditFlag;
			    thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, "");
			    var oModel = thisCntrlr.getDataModels();
			    var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
					oModel[4], oModel[4].Status, EditFlag, false, false);
				thisCntrlr.setViewData(EsaModel);
				var oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESA_PANL_MAIN_COMMENT_COMMTABLE);
				oTable.getModel().setProperty("/oEsaManComm", EsaModel.oEsaManComm);
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
			    	var ccTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PESA_CRBNCPY_TBL),
					    ResetData = ccTable .getModel().getData().NAV_ESA_CC.results;
			    	for(var i=0;i<ResetData.length;i++){
					   ResetData[i].Selectflag = true;
					}
					thisCntrlr.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRPDCONRESETConfirmation"), thisCntrlr);
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
				thisCntrlr.that_views2 === undefined ? thisCntrlr._initiateControllerObjects() : "";
				var iconTabBtn = thisCntrlr.that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB), DlnkCData = "";
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
			//*************** End Of PCR028711: Q2C Enhancements for Q2-20 ****************
			//*************** Start Of PCR034716++: Q2C ESA,PSR Enhancements ****************
			/**
			 * This method Handles Check List Comment Note Live Change Event.
			 * @name onEsaChkLstCommLvchng
			 * @param oEvent - Event Handlers
			 * @returns
			 */
			onEsaChkLstCommLvchng: function (oEvent) {
				if (oEvent.getSource().getValue().trim() === "" && oEvent.getSource().getValue().length !== 0) {
					sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.S2ESA_PANL_CHKLST_COMMENT_SAVEBTN).setEnabled(false);
					sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.S2ESA_PANL_CHKLST_COMMENT_TEXT_AREA).setValue("");
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAIDSFBLNKCHAREORMSG"));
				} else {
					oEvent.getSource().getValue().length >= 255 ? this.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCMCOMMVALTXT")) : "";
					oEvent.getSource().setValue(oEvent.getSource().getValue().length >= 255 ? (oEvent.getParameters().value.substr(0, 254).trim()) :
						oEvent.getSource().getValue());
					oCommonController.commonMainCommLvchng(oEvent, thisCntrlr);
				}
			},
			/**
			 * This method Handles Checklist Comment Save Event.
			 * @name onSaveChkLstCom
			 * @param oEvent - Event Handlers
			 * @returns
			 */
			onSaveChkLstCom: function (oEvent) {
				oCommonController.commonSaveMainCom(oEvent, thisCntrlr);
			},
			/**
			 * This method Handles ESA Checklist print functionality.
			 * @name onPressPrintESAChekList
			 * @param oEvent - Event Handlers
			 * @returns
			 */
			onPressPrintESAChekList: function(oEvent){
				sap.m.MessageBox.confirm(thisCntrlr.bundle.getText("S2ESAPRINTREQIREDVALIDATIONTXT"),
						this.confirmationESAPrintCheckList, thisCntrlr.bundle.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
			},
			/**
			 * This method Handles ESA Checklist Print validation OK button press event.
			 * @name confirmationESAPrintCheckList
			 * @param oEvent - Event Handlers
			 * @returns
			 */
			confirmationESAPrintCheckList : function(oEvent){
				var oResource = thisCntrlr.getResourceBundle(),
				    configConsts = com.amat.crm.opportunity.util.ServiceConfigConstants;
				if(oEvent === oResource.getText("S2CONFFRGOKBTN")){
				var ItemGuid = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid,
				    verNo = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData().VersionNo,
				    url = thisCntrlr.oMyOppModel._oDataModel.sServiceUrl + configConsts.EsaChkListPrintSet + ItemGuid + configConsts.EsaPrintTypeVer + verNo + configConsts.EsaPrintValue;
				window.open(url);
				}
			},
			/**
			 * This method handles Check List Comments event.
			 * @name getChekLstCommentsModel
			 * @param 
			 * @returns ChkLstComments - CheckList Comments Model
			 */
			getChekLstCommentsModel: function () {
				var oResource = thisCntrlr.getResourceBundle(),
				    chkLstCommentsData = thisCntrlr.getModelFromCore(oResource.getText("S2ESATDSCHKLSTMODEL")).getData().NAV_CHCKCOMMNTS,
					chkLstComments = [];
				for (var i = 0; i <= chkLstCommentsData.results.length - 1; i++) {
					var obj = {};
					obj.Comment = chkLstCommentsData.results[i].Comment;
					obj.CreatedDate = chkLstCommentsData.results[i].CreatedDate;
					obj.CreatedName = chkLstCommentsData.results[i].CreatedName;
					chkLstComments.push(obj);
				}
				return new sap.ui.model.json.JSONModel({
					"ItemSet": chkLstComments
				});
			}
			//*************** End Of PCR034716++: Q2C ESA,PSR Enhancements ****************
		});
	});