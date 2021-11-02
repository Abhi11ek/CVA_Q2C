/**
 * This class holds all methods of pdcsda page.
 * 
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends com.amat.crm.opportunity.controller.BaseController
 * @name com.amat.crm.opportunity.controller.pdcsda                               *
 *  * ----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 * Ver.No    Date        Author    PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * V00    20/02/2018    Abhishek   PCR017480         Initial version              *
 *                      Pant       
 *                      (X089025)                                                 * 
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 19/07/2018      Abhishek        PCR018375         PSR/CBC Workflow Rejection   *
 *                 Pant                              (restart) Capability         *    
 * 29/08/2018      Abhishek        PCR019903         Reset email notifications &  *
 *                 Pant                              Lookup determination         *  
 * 20/08/2018      Abhishek        PCR019492         ASC606 UI Changes            *
 *                 Pant                                                           *
 * 09/11/2018      Abhishek        PCR020999         INC04123615: Replaced SDA    *
 *                 Pant                              with RRA                     *
 * 18/12/2018      Abhishek        PCR021481         Q2C Q1/Q2 enhancements       *
 *                 Pant                                                           *
 * 25/02/2019      Abhishek        PCR022669         Q2C Q2 UI Changes            *
 *                 Pant                                                           *
 * 26/09/2019      Abhishek        PCR025717         Q2C Q4 2019 Enhancements     *
 *                 Pant                                                           *
 * 29/04/2020      Arun            PCR028711         Q2C Enhancements for Q2-20   *
 *                 Jacob                                                          *
 * 13/01/2019      Abhishek        PCR033317         CBC MEA questionnaire        *
 *                 Pant                              alignment as part of RAR     *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 ***********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController",
	"com/amat/crm/opportunity/controller/CommonController", "sap/m/MessageBox"
], function(Controller, CommonController, MessageBox) {
	"use strict";
	var thisCntrlr, that_general,
		that_psrsda,
		that_views2,
		that_cbc, oCommonController;
	return Controller.extend("com.amat.crm.opportunity.controller.pdcsda", {
		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */
		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 * 
		 * @memberOf view.pdcsda
		 */
		onInit: function() {
			thisCntrlr = this;
			thisCntrlr.bundle = thisCntrlr.getResourceBundle();
			that_views2 = this.getOwnerComponent().s2;
			that_psrsda = this.getOwnerComponent().psrsda;
			thisCntrlr.colFlag = [false, false, false, false, false, false, false, false, false, false, false, false,
				false, false
			];
			thisCntrlr.flagAtt = 0;
			thisCntrlr.MandateData;
			thisCntrlr.oMessagePopover;
			this.detActionType;
			this.SelectedRecord = {
				"results": []
			};
			this.UnselectedRecord = {
				"results": []
			};
			this.oMyOppModel = new com.amat.crm.opportunity.model.models(this);
			oCommonController = new CommonController();
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
			if (that_general === undefined) {
				that_general = this.getOwnerComponent().general;
			}
			if (that_psrsda === undefined) {
				that_psrsda = this.getOwnerComponent().psrsda;
			}
			if (that_cbc === undefined) {
				that_cbc = this.getOwnerComponent().cbc;
			}
		},
		/** Keep
		 * This method is used to handles Main Comment Text Area Live Change Event.
		 * 
		 * @name OnMainCommLvchng
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		OnMainCommLvchng: function(oEvent) {
			var SaveBtn = "";
			(oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
					.id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
				.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA) ? (SaveBtn = that_psrsda.byId(com.amat.crm.opportunity.Ids
				.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN)) : ((oEvent.getParameters().id.split(thisCntrlr.bundle.getText(
					"S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(thisCntrlr.bundle.getText(
					"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_TEXT_AREA) ?
				(SaveBtn = that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN)) : (
					SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_SAVEBtn))
			);
			if (oEvent.getParameters().value.length > 0 && oEvent.getParameters().value.length < 255) {
				SaveBtn.setEnabled(true);
			} else if (oEvent.getParameters().value.length === 255) {
				SaveBtn.setEnabled(false);
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCMCOMMVALTXT"));
			} else {
				SaveBtn.setEnabled(false);
			}
		},
		/** Keep
		 * This method is used to handles Main comment Panel Expand Event.
		 * 
		 * @name onExpandMainCom
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onExpandMainCom: function(oEvent) {
			if (oEvent.getParameters().expand === true) {
				var MCommType = "",
					oTable = "",
					MComModel = "";
				if (oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
						.id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
					.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL) {
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setValue("");
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN).setEnabled(
						false);
					MCommType = thisCntrlr.bundle.getText("S2PSRMCOMMDATATYP");
					oTable = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__COMMTABLE);
				} else if (oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT"))[
						oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT")).length -
						1] === com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_PANEL) {
					that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_TEXT_AREA).setValue("");
					that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN).setEnabled(
						false);
					MCommType = thisCntrlr.bundle.getText("S2CBCMCOMMDATATYP");
					oTable = that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__COMMTABLE);
				} else if (oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT"))[
						oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT")).length -
						1] === com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL) {
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setValue(
						"");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_SAVEBtn).setEnabled(
						false);
					MCommType = thisCntrlr.bundle.getText("S2PDCMCOMMDATATYP");
					oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_TABLE);
				}
				var ItemGuid = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData()
					.ItemGuid;
				var sValidate = "CommentsSet?$filter=ItemGuid eq guid'" + ItemGuid + "'and CommType eq '" + MCommType +
					"'";
				this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				(oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
						.id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
					.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL) ? (MComModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle
					.getText("GLBPSRCOMMMODEL"))) : (
					(oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
							.id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm
						.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_PANEL) ? (MComModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle
						.getText("GLBCBCCOMMMODEL"))) : (MComModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
						"GLBPDCCOMMMODEL"))));
				if (oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
						.id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
					.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL) {
					MComModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCCOMMMODEL"));
				}
				oTable.setModel(MComModel);
			}
		},
		/** Keep
		 * This method is used to handles Save Comment Event.
		 * 
		 * @name onSaveMainCom
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onSaveMainCom: function(oEvent) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var MCommType = "",
				MType = "",
				MComModel = "",
				oTable = "",
				SaveBtn = "",
				MTxtAra = "";
			(oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
					.id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
				.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN) ? (MCommType = thisCntrlr.bundle.getText(
					"S2PSRMCOMMDATATYP"), MType = thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), oTable =
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__COMMTABLE), MTxtAra =
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA), SaveBtn =
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN)) : (
				(oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
						.id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
					.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN) ? (MCommType = thisCntrlr.bundle.getText(
						"S2CBCMCOMMDATATYP"), MType = thisCntrlr.bundle.getText("S2ICONTABCBCTXT"), oTable =
					that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__COMMTABLE), MTxtAra =
					that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_TEXT_AREA), SaveBtn =
					that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN)) : (MCommType =
					thisCntrlr.bundle.getText("S2PDCMCOMMDATATYP"), MType = thisCntrlr.bundle.getText(
						"S2ICONTABPDCTEXT"), oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__COMMTABLE),
					MTxtAra = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA),
					SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__SAVEBTN)
				));
			var obj = this.MainComPayload(oEvent.getSource().getParent().getFields()[0].getValue(), MType);
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CommentsSet, com.amat.crm.opportunity
				.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText(
					"S2PSRCBCMCOMMSAVSUCSSTXT"));
			var ItemGuid = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData()
				.ItemGuid;
			var sValidate = "CommentsSet?$filter=ItemGuid eq guid'" + ItemGuid + "'and CommType eq '" + MCommType +
				"'";
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			(oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
					.id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
				.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN) ? (MComModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle
				.getText("GLBPSRCOMMMODEL"))) : (
				(oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
						.id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
					.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN) ? (MComModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle
					.getText("GLBCBCCOMMMODEL"))) : (MComModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
					"GLBPDCCOMMMODEL"))));
			oTable.setModel(MComModel);
			MTxtAra.setValue("");
			SaveBtn.setEnabled(false);
			myBusyDialog.close();
		},
		/**
		 * This method is used to handles Main Comment Payload.
		 * 
		 * @name MainComPayload
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		MainComPayload: function(Comment, CommType) {
			var obj = {};
			obj.ItemGuid = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData()
				.ItemGuid;
			obj.CommentId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData()
				.ItemGuid;
			obj.CommType = CommType;
			obj.Comment = Comment;
			obj.CreatedName = "";
			obj.CreatedDate = "";
			return obj;
		},
		/** Keep
		 * This method is used to handles SAF Question answer Event.
		 * 
		 * @name onSelectRBMandat
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onSelectRBMandat: function(oEvent) {
			var oResource = thisCntrlr.bundle;
			var ValueState = oEvent.getParameters().selectedIndex > 0 ? oResource.getText(
				"S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
			oEvent.oSource.setValueState(ValueState);
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource.getText("S2ICONTABPSRSDAKEY")) {
				thisCntrlr.getModelFromCore(oResource.getText("GLBPSRMODEL")).getData().NAV_SAF_QA.SalesFlg =
					oEvent.getParameters().selectedIndex > 0 ? (oEvent.getParameters().selectedIndex === 1 ? oResource
						.getText("S2POSMANDATANS") : oResource.getText("S2NEGMANDATANS")) : "";
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MANDAT_FID).removeStyleClass(oResource.getText("S2PSRSDAMANDATCLS"));
			} else {
				thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData().NAV_PDC_QA_SAF
					.SalesFlg = oEvent.getParameters().selectedIndex > 0 ? (oEvent.getParameters().selectedIndex === 1 ?
						oResource.getText("S2POSMANDATANS") : oResource.getText("S2NEGMANDATANS")) : "";
			}
		},
		/** Keep
		 * This method is used to handles BSDA Assessment level selection event.
		 * 
		 * @name onComboSelectionChange
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onComboSelectionChange: function(oEvent) {
			var oResource = thisCntrlr.bundle;
			if (oEvent.getParameters().selectedItem.getText() === oResource.getText("S2PSRSDAPDCSSDALVLDEFAULTTXT")) {
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRPDCBSSDAOPMSG"));
			} else {
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource
					.getText("S2ICONTABPSRSDAKEY")) {
					thisCntrlr.getModelFromCore(oResource.getText("GLBPSRMODEL")).getData().Bsdl = oEvent.getParameters()
						.selectedItem.getText();
				} else {
					var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData();                                            //PCR019492++
					thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData().Bsdl =
						oEvent.getParameters().selectedItem.getText();
					if(PSRData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                                                                      //PCR019492++
						var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();                                //PCR019492++
						var RRAQuesData = thisCntrlr.getRRAQusData(PSRData.PsrStatus, PSRData.NAV_RRA_QA_PDC, GenInfoData.Region, false);                        //PCR019492++
						RRAQuesData.results[RRAQuesData.results.length-1].SalesFlg !== "" ? ( PSRData.BmoRraValBsda !== PSRData.Bsdl ? (                         //PCR019492++
							this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setVisible(true), this.getView().byId(com.amat.crm.opportunity   //PCR019492++
							.Ids.S2PDC_RRADEFFNOTE).setValue(PSRData.ConComments), this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE)           //PCR019492++
							.setTooltip(PSRData.ConComments)) : this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setVisible(false)):"";       //PCR019492++
					}                                                                                                                                            //PCR019492++
					if (oEvent.getParameters().selectedItem.getText() === oResource.getText("S2BSDASSMENTLVL1") ||
						oEvent.getParameters().selectedItem.getText() === oResource.getText("S2BSDASSMENTLVL2")) {
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
							true);
					} else {
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
							false);
					}
				}
			}
		},
		/** Keep
		 * This method is used to handles SSDA Assessment level selection event.
		 * 
		 * @name onComboSSelectionChange
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onComboSSelectionChange: function(oEvent) {
			var oResource = thisCntrlr.bundle;
			if (oEvent.getParameters().selectedItem.getText() === oResource.getText("S2PSRSDAPDCSSDALVLDEFAULTTXT")) {
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRPDCBSSDAOPMSG"));
			} else {
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource
					.getText("S2ICONTABPSRSDAKEY")) {
					thisCntrlr.getModelFromCore(oResource.getText("GLBPSRMODEL")).getData().Ssdl = oEvent.getParameters()
						.selectedItem.getText();
				} else {
					thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData().Ssdl =
						oEvent.getParameters().selectedItem.getText();
				}
			}
		},
		/** Keep
		 * This method is used to handles SSDA Justification Value Live Change event.
		 * 
		 * @name onSSDATextChange
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onSSDATextChange: function(oEvent) {
			var oResource = thisCntrlr.bundle;
			//***************Start Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
			//if (oEvent.getParameters().value.length >= 255) {
			//	var JustificationTxt = oEvent.getParameters().value.substr(0, 254);
			//	if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource.getText("S2ICONTABPSRSDAKEY")) {
			//		that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_TEXT_AREA).setValue(JustificationTxt);
			//	} else {
			//		thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).setValue(JustificationTxt);
			//	}
			//	thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCMCOMMVALTXT"));
			//} else {
			//***************End Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource.getText("S2ICONTABPSRSDAKEY")) {
					thisCntrlr.getModelFromCore(oResource.getText("GLBPSRMODEL")).getData().SsdaJustfication = oEvent.getParameters().value;
				} else {
					thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData().SsdaJustfication = oEvent.getParameters().value;
				}
			//}                                                                                                                                                //PCR021481--
		},
		/** Keep
		 * This method is used to handles BSDA Justification Value Live Change event.
		 * 
		 * @name onBSDATextChange
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onBSDATextChange: function(oEvent) {
			var oResource = thisCntrlr.bundle;
			//***************Start Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
			//if (oEvent.getParameters().value.length >= 255) {
			//	var JustificationTxt = oEvent.getParameters().value.substr(0, 254);
			//	if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource.getText("S2ICONTABPSRSDAKEY")) {
			//		that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setValue(JustificationTxt);
			//	} else {
			//		thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setValue(JustificationTxt);
			//	}
			//	thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCMCOMMVALTXT"));
			//} else {
			//***************End Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource.getText("S2ICONTABPSRSDAKEY")) {
					thisCntrlr.getModelFromCore(oResource.getText("GLBPSRMODEL")).getData().BsdaJustfication = oEvent.getParameters().value;
				} else {
					thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData().BsdaJustfication = oEvent.getParameters().value;
				}
			//}                                                                                                                                              //PCR021481--
		},

		/**
		 * This method Used to Validate PSR-SDA Initiate Event.
		 * 
		 * @name validateInitiate
		 * @param 
		 * @returns initiateFlag - Binary Flag
		 */
		validateInitiate: function() {
			var oResource = thisCntrlr.bundle;
			var GenInfoData = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();
			var initiateFlag = false;
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource
				.getText("S2ICONTABCARMKEY")) {
				var romInitiateFlag = this.checkContact(GenInfoData.NAV_ROM_INFO.results);
				var POMInitiateFlag = this.checkContact(GenInfoData.NAV_POM_INFO.results);
				var BMOInitiateFlag = this.checkContact(GenInfoData.NAV_BMO_INFO.results);
				var salesInitiateFlag = this.checkContact(GenInfoData.NAV_SALES_INFO.results);
				(romInitiateFlag === true || POMInitiateFlag === true || BMOInitiateFlag === true ||
					salesInitiateFlag === true) ? (initiateFlag = true) : (initiateFlag = false);
			} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource
				.getText("S2ICONTABPSRSDAKEY")) {
				var romUserList = GenInfoData.NAV_ROM_INFO.results;
				var salesUserList = GenInfoData.NAV_SALES_INFO.results;
				var romInitiateFlag = this.checkContact(romUserList);
				var salesInitiateFlag = this.checkContact(salesUserList);
				(romInitiateFlag === true || salesInitiateFlag === true) ? (initiateFlag = true) : (initiateFlag =
					false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).setSelectedIndex(-1);
			} else {
				var gmoUserList = GenInfoData.NAV_BMO_INFO.results;
				initiateFlag = this.checkContact(gmoUserList);
			}
			return initiateFlag;
		},
		/**
		 * This method Handles PSR-SDA Radio Buttons Event.
		 * 
		 * @name onSelectRBPSRSDA
		 * @param evt - Event Handlers
		 * @returns 
		 */
		onSelectRBPSRSDA: function(evt) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var initiateFlag = this.validateInitiate();
			var oView = thisCntrlr.getView();
			var oResource = thisCntrlr.bundle;
			if (initiateFlag === false) {
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource.getText(
						"S2ICONTABPSRSDAKEY")) {
					thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCROMSALEVALDFAILMSG"));
				} else {
					thisCntrlr.showToastMessage(oResource.getText("S2PDCSDABMOFAILMSG"));
				}
			} else {
				if (thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData().InitPsr !== oResource
					.getText("S2ODATAPOSVAL") || thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData().InitPdc !==
					oResource.getText("S2ODATAPOSVAL")) {
					thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCAUTHCHECKFAILMSG"));
				} else {
					var OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));
					var PDCModel = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
					if (evt.mParameters.selectedIndex === 1) {

						var obj = {};
						obj.Guid = OppGenInfoModel.getData().Guid;
						obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
						obj.PsrRequired = oResource.getText("S2POSMANDATANS");
						obj.PsrType = "";
						if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource.getText(
								"S2ICONTABPSRSDAKEY")) {
							obj.PsrStatus = "5";
							obj.PsrStatDesc = "";
						} else {
							obj.PsrStatus = "605";
							obj.PsrStatDesc = OppGenInfoModel.getData().ProductLine;
						}

						obj.Bsdl = "";
						obj.ConComments = PDCModel.ConComments;                                                                                                 //PCR019492++
						obj.Ssdl = "";
						obj.Bd = "";
						obj.Sd = "";
						obj.AprvComments = "";
						obj.ActionType = "";
						obj.TaskId = "";
						obj.WiId = "";

						obj.InitiatedBy = "";
						//obj.InitiatedDt = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                         //PCR035760-- Defect#131 TechUpgrade changes
						obj.Time = oResource.getText("S2OPPAPPPAYLODTMEKEY");
						this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm.opportunity.util.ServiceConfigConstants
							.write, obj, oResource.getText("S2PDCSDAINITSUCSSTXT"));
						that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setIconColor(sap.ui.core.IconColor.Critical);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(true);
						this.getPDCData();
						this.setPDCVisibility(oResource.getText("S2POSMANDATANS"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(oResource.getText(
							"S2PSRSDAEDITBTNTXT"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(oResource.getText(
							"S2PSRSDAEDITICON"));
						thisCntrlr.onEditPDCSDA();
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_STATUS_BAR).setVisible(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(oResource.getText(
							"S2PSRSDASFCANINITXT"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setIcon(oResource.getText(
							"S2CANCELBTNICON"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL).setExpanded(false);                                 //PCR018375++
//					} else if (evt.mParameters.selectedIndex === 2) {                                                                                  //PCR019492--
					} else if (evt.mParameters.selectedIndex >= 2) {                                                                                   //PCR019492++
						var obj = {};
						obj.Guid = OppGenInfoModel.getData().Guid;
						obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
//						obj.PsrRequired = oResource.getText("S2NEGMANDATANS");                                                                         //PCR019492--
						obj.PsrRequired = evt.mParameters.selectedIndex === 2 ? thisCntrlr.bundle.getText("S2PSRDCNASHPODKEY") :                       //PCR019492++
							              evt.mParameters.selectedIndex === 3 ? thisCntrlr.bundle.getText("S2PSRDCNADEFERKEY") : (                     //PCR021481++
							              (evt.mParameters.selectedIndex > 3 && evt.getSource().getButtons()[evt.mParameters.selectedIndex].getText()  //PCR019492++; PCR021481 modified selected Index value from 2 to 3
							                === thisCntrlr.bundle.getText("S2PSRDCNEWEVALTXT") ? thisCntrlr.bundle.getText("S2PSRDCEVALKEY") :         //PCR019492++, PCR033317++; S2PSRDCEVALTXT replaced with S2PSRDCNEWEVALTXT
							                	thisCntrlr.bundle.getText("S2PSRCBCAPPROVEKEY")));                                                     //PCR019492++; PCR021481++ added closing parentheses ')'
						obj.PsrType = "";
						if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource.getText(
								"S2ICONTABPSRSDAKEY")) {
							obj.PsrStatus = "85";
						} else {
							obj.PsrStatus = "685";
						}

						obj.Bsdl = "";
						obj.ConComments = PDCModel.ConComments;                                                                                        //PCR019492++
						obj.Ssdl = "";
						obj.Bd = "";
						obj.Sd = "";
						obj.AprvComments = "";
						obj.ActionType = "";
						obj.TaskId = "";
						obj.WiId = "";
						obj.PsrStatDesc = "";
						obj.InitiatedBy = "";
						//obj.InitiatedDt = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                //PCR035760-- Defect#131 TechUpgrade changes
						obj.Time = oResource.getText("S2OPPAPPPAYLODTMEKEY");
						this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm.opportunity.util.ServiceConfigConstants
							.write, obj, oResource.getText("S2PDCSDANOTAPPLESUCCSSTXT"));

						that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setIconColor(sap.ui.core.IconColor.Positive);
						this.getPDCData();
						this.setPDCVisibility(oResource.getText("S2NEGMANDATANS"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
						//***************Justification: PCR018375++ Phase2 - X - PSR/PDC/CBC Main Comment Section in NA ****************//
//						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(false);       //PCR018375--
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(true);        //PCR018375++
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LOOKUP_LISTBtn).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(oResource.getText(
							"S2PSRSDASFCANINITXT"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setIcon(oResource.getText(
							"S2CANCELBTNICON"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(false);
						//*************** Start Of PCR018375++ Phase2 - X - PSR/PDC/CBC Main Comment Section in NA ****************//
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CONTACTINFO_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_360).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPPROVALS_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BAPPROVAL_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL).setVisible(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL).setExpanded(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_CNGHISPNL).setVisible(false);                        //PCR019492++
						//*************** End Of PCR018375++ Phase2 - X - PSR/PDC/CBC Main Comment Section in NA ****************//
					}
				}
			}
			that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).setSelectedIndex(-1);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp).setSelectedIndex(-1);
			myBusyDialog.close();
		},
		/** Keep
		 * This method is used to handles BSDA Assessment Level Change event.
		 * 
		 * @name onCBSelect
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onCBSelect: function(oEvent) {
			var value = "";
			(oEvent.getParameters().selected === true) ? (value = thisCntrlr.bundle.getText(
				"S2BSDAASSESSDVAL")) : (value = "");
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
				.getText("S2ICONTABPSRSDAKEY")) {
				thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().Bd = value;
			} else {
				thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().Bd = value;
			}
		},
		/** Keep
		 * This method is used to handles SSDA Assessment Level Change event.
		 * 
		 * @name onCBSSelect
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onCBSSelect: function(oEvent) {
			var value;
			(oEvent.getParameters().selected === true) ? (value = thisCntrlr.bundle.getText(
				"S2BSDAASSESSDVAL")) : (value = "");
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
				.getText("S2ICONTABPSRSDAKEY")) {
				thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().Sd = value;
			} else {
				thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().Sd = value;
			}
		},
		/**
		 * This method is used to apply security on table in PSR/PDC.
		 * 
		 * @name setTableSecurity
		 * @param oTable - table object
		 * @returns 
		 *  
		 */
		setTableSecurity: function(oTable) {
			if (oTable.getModel().getData().ItemSet !== undefined) {
				var SecurityData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBSECURITYMODEL")).getData();
				for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {
					if (oTable.getId().split("-")[oTable.getId().split("-").length - 1] === com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_CUST_SpecREV1_TABLE || oTable.getId().split("-")[oTable.getId().split("-").length -
							1] === com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE) {
						if (SecurityData.UpldCustSpec !== thisCntrlr.bundle.getText("S1TABLESALESTAGECOL")) {
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[
								2].setVisible(false);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[1].mAggregations.items[
								0].setVisible(false);
							oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
						} else {
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[
								2].setVisible(true);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[1].mAggregations.items[
								0].setVisible(true);
							oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(oTable.getModel().getData().ItemSet[
								i].Enableflag);
						}
					} else if (oTable.getId().split("-")[oTable.getId().split("-").length - 1] === com.amat.crm.opportunity
						.Ids.S2PSR_SDA_PANL_FPSR_DOC_TABLE) {
						if (SecurityData.UpldFnlSpec !== thisCntrlr.bundle.getText("S1TABLESALESTAGECOL")) {
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[
								2].setVisible(false);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[1].mAggregations.items[
								0].setVisible(false);
							oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
						} else {
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[
								2].setVisible(true);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[1].mAggregations.items[
								0].setVisible(true);
							oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(oTable.getModel().getData().ItemSet[
								i].Enableflag);
						}
					}
				}
			}
		},
		/**
		 * This method is used to SDA Questions Hide Logic.
		 * 
		 * @name validatSDAQues
		 * @param SDAQuesData - SDA Question Data
		 * @returns FinalSDAQusData: SDA Question Data with Hidden Logic.
		 */
		validatSDAQues: function(SDAQuesData) {
			var FinalSDAQusData = {
				"items": {
					"0": []
				}
			};
			var SDAFlag = false;
			for (var i = 0; i < SDAQuesData.items[0].length; i++) {
				if (i === 0 || i === 1) {
					if (SDAQuesData.items[0][i].BmoFlg === thisCntrlr.bundle.getText("S2POSMANDATANS") ||
						SDAQuesData.items[0][i].Selected === true) SDAFlag = true;
				}
				if (SDAFlag === false && i !== 3) {
					FinalSDAQusData.items[0].push(SDAQuesData.items[0][i]);
				} else if (SDAFlag === true) {
					FinalSDAQusData.items[0].push(SDAQuesData.items[0][i]);
				}
			}
			return FinalSDAQusData;
		},
		/**
		 * This method is used to Bind Table with Table Data.
		 * 
		 * @name setDataToTable
		 * @param TabTemplate - Table Column Template, Data- Table Binding Data
		 * @returns 
		 */
		setDataToTable: function(TabTemplate, Data) {
			var cModel1 = this.getJSONModel(Data);
			TabTemplate.setModel(cModel1);
		},
		/**
		 * This method is used to Check User Authorization For The Task.
		 * 
		 * @name checkUsersfromlist
		 * @param 
		 * @returns checkFlag - Binary Value
		 */
		checkUsersfromlist: function() {
			var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var checkFlag = false;
			if (parseInt(PSRData.PsrStatus) === 5 || parseInt(PSRData.PsrStatus) === 4) {
				var romUserList = GenInfoData.NAV_ROM_INFO.results;
				var salesUserList = GenInfoData.NAV_SALES_INFO.results;
				var romInitiateFlag = this.checkContact(romUserList);
				var salesInitiateFlag = this.checkContact(salesUserList);
				(romInitiateFlag === true || salesInitiateFlag === true) ? (checkFlag = true) : (checkFlag = false);
			} else if ((parseInt(PSRData.PsrStatus) >= 15 && parseInt(PSRData.PsrStatus) <= 17) || parseInt(PSRData.PsrStatus) === 55 ||
				parseInt(PSRData.PsrStatus) === 65) {
				var bomUserList = GenInfoData.NAV_BMO_INFO.results;
				var bomInitiateFlag = this.checkContact(bomUserList);
				(bomInitiateFlag === true) ? (checkFlag = true) : (checkFlag = false);
			} else if (parseInt(PSRData.PsrStatus) === 40 || parseInt(PSRData.PsrStatus) === 75) {
				var gpmUserList = GenInfoData.NAV_GPM_INFO.results;
				var bmHeadUserList = GenInfoData.NAV_BMHEAD_INFO.results;
				var bmHeadInitiateFlag = this.checkContact(bmHeadUserList);
				var gpmInitiateFlag = this.checkContact(gpmUserList);
				(gpmInitiateFlag === true || bmHeadInitiateFlag === true) ? (checkFlag = true) : (checkFlag = false);
			} else if (parseInt(PSRData.PsrStatus) === 25 || parseInt(PSRData.PsrStatus) === 70) {
				var conUserList = GenInfoData.NAV_CON_INFO.results;
				var conInitiateFlag = this.checkContact(conUserList);
				(conInitiateFlag === true) ? (checkFlag = true) : (checkFlag = false);
			}
			return checkFlag;
		},
		/**
		 * This method is used to handles CC check Box selection event.
		 * 
		 * @name onSelectCB
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onSelectCB: function(oEvent) {
			var oResource = thisCntrlr.bundle;
			var SelectedDes = oEvent.getParameters().selected;
			var Selectedline = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
				"S2CBCPSRCARMSEPRATOR"))[oEvent.getSource().getBindingContext().sPath.split(oResource
				.getText("S2CBCPSRCARMSEPRATOR")).length - 1];
			//if (this.CbnType === oResource.getText("S2ICONTABPSRTEXT")) {                                                                              //PCR025717--
			switch (this.CbnType){                                                                                                                       //PCR025717++
			case oResource.getText("S2ICONTABPSRTEXT"):                                                                                                  //PCR025717++
				var oCbnCpyModel = thisCntrlr.getModelFromCore(oResource.getText("GLBPSRSDACBCCCPYMODEL"));
				for (var i = 0; i < oCbnCpyModel.getData().results.length; i++) {
					if (i === parseInt(Selectedline)) {
						if (SelectedDes === true) {
							this.SelectedRecord.results.push(oCbnCpyModel.getData().results[i]);
						} else {
							this.UnselectedRecord.results.push(oCbnCpyModel.getData().results[i]);
						}
					}
				}
				break;                                                                                                                                   //PCR025717++
			//} else if (this.CbnType === oResource.getText("S2ICONTABCBCTXT")) {                                                                        //PCR025717--
			case oResource.getText("S2ICONTABCBCTXT"):                                                                                                   //PCR025717++
			    var oCBCCbnCpyModel = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCCCPYMODEL"));
				for (var i = 0; i < oCBCCbnCpyModel.getData().results.length; i++) {
					if (i === parseInt(Selectedline)) {
						if (SelectedDes === true) {
							this.SelectedRecord.results.push(oCBCCbnCpyModel.getData().results[i]);
						} else {
							this.UnselectedRecord.results.push(oCBCCbnCpyModel.getData().results[i]);
						}
					}
				}
				break;                                                                                                                                   //PCR025717++
			//} else if (this.CbnType === oResource.getText("S2ICONTABPDCTEXT")) {                                                                       //PCR025717--
			case oResource.getText("S2ICONTABPDCTEXT"):                                                                                                  //PCR025717++			
				var oPDCCbnCpyModel = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCCCPYMODEL"));
				for (var i = 0; i < oPDCCbnCpyModel.getData().results.length; i++) {
					if (i === parseInt(Selectedline)) {
						if (SelectedDes === true) {
							this.SelectedRecord.results.push(oPDCCbnCpyModel.getData().results[i]);
						} else {
							this.UnselectedRecord.results.push(oPDCCbnCpyModel.getData().results[i]);
						}
					}
				}
				break;                                                                                                                                   //PCR025717++
			//*******************Start Of PCR025717 Q2C Q4 2019 Enhancements************************
			case thisCntrlr.bundle.getText("S2PDCDLINKTYPTXT"):
				var oPDCDlnkCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().NAV_PDC_CC;
				for (var i = 0; i < oPDCDlnkCData.results.length; i++) {
					if (i === parseInt(Selectedline)) {
						if (SelectedDes === true) {
							oPDCDlnkCData.results[i].Selected = true;
						} else {
							oPDCDlnkCData.results[i].Selected = false;
						}
					}
				}
			    break;
			case thisCntrlr.bundle.getText("S2PSRDLINKTYPTXT"):
				var oPSRDlnkCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().NAV_PSR_CC;
				for (var i = 0; i < oPSRDlnkCData.results.length; i++) {
					if (i === parseInt(Selectedline)) {
						if (SelectedDes === true) {
							oPSRDlnkCData.results[i].Selected = true;
						} else {
							oPSRDlnkCData.results[i].Selected = false;
						}
					}
				}
			    break;
			//*******************End Of PCR025717 Q2C Q4 2019 Enhancements**************************
			
			}
		},
		/**
		 * This method is used to handles CC Checkbox selection duplicate value removal.
		 * 
		 * @name remove_duplicates
		 * @param SelectedRecord - Selected CC Record, UnselectedRecord - Unselected CC Record
		 * @returns 
		 */
		remove_duplicates: function(SelectedRecord, UnselectedRecord) {
			var onlyInA = SelectedRecord.filter(function(current) {
				return UnselectedRecord.filter(function(curren_unselected) {
					return curren_unselected.OppId === current.OppId && curren_unselected.ItemNo === current.ItemNo
				}).length === 0;
			});
			return onlyInA;
		},
		/**
		 * This method is used to handles ok button event.
		 * 
		 * @name onRelPerSpecRewOkPress
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onRelPerSpecRewOkPress: function(oEvent) {
			if (oEvent.getSource().getParent().getContent()[2].getColumns()[0].getVisible() === false) {                                               //PCR025717++; getContent()[0] replaced with getContent()[2]
				var items = oEvent.getSource().getParent().getContent()[0].mAggregations.items;
				if (items.length === 0) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCPREOUSOPPMSG"));
				} else {
					var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL"));
					var oEntry = {
						Guid: OppGenInfoModel.getData().Guid,
						ItemGuid: OppGenInfoModel.getData().ItemGuid,
						OppId: thisCntrlr.OppId,
						ItemNo: thisCntrlr.ItemNo,
						Repflag: thisCntrlr.bundle.getText("S2ODATAPOSVAL"),
						NAV_CUSTDOCLINK: []
					};
					for (var i = 0; i < items.length; i++) {
						if (items[i].getCells()[0].getSelected()) {
							var tableData = oEvent.getSource().getParent().getContent()[0].getModel().getData().results[i];
							var doc = {
								Guid: tableData.Guid,
								ItemGuid: tableData.ItemGuid,
								DocType: tableData.DocType,
								DocSubtype: tableData.DocSubtype,
								DocDesc: tableData.DocDesc,
								DocId: tableData.DocId,
								Notes: tableData.Notes,
								MimeType: tableData.MimeType,
								FileName: tableData.FileName,
								OriginalFname: tableData.OriginalFname,
								OppId: tableData.OppId,
								ItemNo: tableData.ItemNo,
								Customer: tableData.Customer,
								Code: tableData.Code,
								ExpireDate: tableData.ExpireDate,
								UploadedBy: tableData.UploadedBy,
								UploadedDate: tableData.UploadedDate
							};
							oEntry.NAV_CUSTDOCLINK.push(doc);
						}
					}
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CustDocDataSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, oEntry, thisCntrlr.bundle.getText("S2PSRSDASUCSSLINK"));
					this.closeDialog();
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(true);
					this.refreshRelPerSpecRewData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).getModel().getData()
						.length === 0 ? that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX).setVisible(
							true) : that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX).setVisible(
							false);
				}
			//} else if (this.CbnType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")) {                                                               //PCR025717--
			} else {                                                                                                                                     //PCR025717++
				switch (this.CbnType){                                                                                                                   //PCR025717++
				case thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"):                                                                                      //PCR025717++
					this.SelectedRecord.results = this.RemoveDuplicateWdKey(this.SelectedRecord.results);
			     this.UnselectedRecord.results = this.RemoveDuplicateWdKey(this.UnselectedRecord.results);
			     this.SelectedRecord.results = this.remove_duplicates(this.SelectedRecord.results, this.UnselectedRecord
				     .results);
			     this.UnselectedRecord.results = this.remove_duplicates(this.UnselectedRecord.results, this.SelectedRecord
				     .results);
			     var oTable1 = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_TABLE);
			     var TabData = oTable1.getModel().getData().results;
			     var FinalRecord = {
				     "results": []
			         };
			     FinalRecord.results = this.remove_duplicates(TabData, this.SelectedRecord.results);
			     FinalRecord.results = this.remove_duplicates(TabData, this.UnselectedRecord.results);
			     FinalRecord.results = FinalRecord.results.concat(this.SelectedRecord.results);
			     this.closeDialog();
			     var cModel = this.getJSONModel(FinalRecord);
			     oTable1.setModel(cModel);
			     this.SelectedRecord.results.length = 0;
			     this.UnselectedRecord.results.length = 0;
				 break;                                                                                                                                 //PCR025717++
		//} else if (this.CbnType === thisCntrlr.bundle.getText("S2ICONTABCBCTXT")) {                                                                   //PCR025717--
			case thisCntrlr.bundle.getText("S2ICONTABCBCTXT"):                                                                                          //PCR025717++
			     this.SelectedRecord.results = this.RemoveDuplicateWdKey(this.SelectedRecord.results);
			     this.UnselectedRecord.results = this.RemoveDuplicateWdKey(this.UnselectedRecord.results);
			     this.SelectedRecord.results = this.remove_duplicates(this.SelectedRecord.results, this.UnselectedRecord
				     .results);
			     this.UnselectedRecord.results = this.remove_duplicates(this.UnselectedRecord.results, this.SelectedRecord
				     .results);
			     var oTable1 = that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_TABLE);
			     var TabData = oTable1.getModel().getData().results;
			     var FinalRecord = {
				     "results": []
			         };
			     FinalRecord.results = this.remove_duplicates(TabData, this.SelectedRecord.results);
			     FinalRecord.results = this.remove_duplicates(TabData, this.UnselectedRecord.results);
			     FinalRecord.results = FinalRecord.results.concat(this.SelectedRecord.results);
			     this.closeDialog();
			     var cModel = this.getJSONModel(FinalRecord);
			     oTable1.setModel(cModel);
			     this.SelectedRecord.results.length = 0;
			     this.UnselectedRecord.results.length = 0;
				 break;                                                                                                                                //PCR025717++
		//} else if (this.CbnType === thisCntrlr.bundle.getText("S2ICONTABPDCTEXT")) {                                                                 //PCR025717--
			case thisCntrlr.bundle.getText("S2ICONTABPDCTEXT"):                                                                                        //PCR025717++
			     var oTable1 = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_TABLE);
			     var FinalRecord = {
				     "results": []
			         };
			     var PDCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCCCPYMODEL")).getData().results;
			     for (var i = 0, n = 0; i < PDCData.length; i++) {
				     if (PDCData[i].Selected === true) {
					     FinalRecord.results[n] = PDCData[i];
					     n++;
				     }
			     }
			     this._initiateControllerObjects();
			     FinalRecord.results = FinalRecord.results.concat(this.PDCCCData.results);
			     this.closeDialog();
			     var cModel = this.getJSONModel(FinalRecord);
			     oTable1.setModel(cModel);
			     this.SelectedRecord.results.length = 0;
			     this.UnselectedRecord.results.length = 0;
				 break;                                                                                                                                //PCR025717++
			//***************************Start Of PCR025717 Q2C Q4 2019 Enhancements********************
			case thisCntrlr.bundle.getText("S2PDCDLINKTYPTXT"):
				 var Msg = this.dialog.getContent()[1].getValue();
				 if(Msg.trim() !== ""){
					 var oResource = thisCntrlr.bundle;
					 var PDCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData().NAV_PDC_CC.results;
					 var delValidFlag = thisCntrlr.getDlnkcheck(PDCData);
					 if(delValidFlag === false){
						 thisCntrlr.showToastMessage(oResource.getText("S2ALLDLINKOPPSELFAILMGS"));
				     } else {
				    	 var edtBtnTxt = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText();
						 var payload = thisCntrlr.getDLinkPayLoad(oResource.getText("S2ICONTABPDCTEXT"), Msg, PDCData);				 
						 thisCntrlr.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CCopyDLinkSet, com.amat.crm.opportunity
									.util.ServiceConfigConstants.write, payload, oResource.getText("S2CCDLNKSUSSMSG"));
						 thisCntrlr.checkPDCInitiate();
						 thisCntrlr.PDCDisMode();
						 that_views2.getController().getMainCommModel(thisCntrlr.bundle.getText("S2PDCMCOMMDATATYP"));
						 var MCommDAta = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBPDCCOMMMODEL"));
						 var oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_TABLE);
						 oTable.setModel(MCommDAta);
						 if(edtBtnTxt === oResource.getText("S2PSRSDACANBTNTXT")){
							 thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(oResource.getText("S2PSRSDAEDITBTNTXT"));
							 thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(oResource.getText("S2PSRSDAEDITICON"));
							 thisCntrlr.onEditPDCSDA();
						 }
						 thisCntrlr.closeDialog(); 
				     }					 
				 } else {
					 thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ALLDLINKMANDATCOMM"));
				 }
				 break;
			case thisCntrlr.bundle.getText("S2PSRDLINKTYPTXT"):
				 var Msg = this.dialog.getContent()[1].getValue();
				 if(Msg.trim() !== ""){
					 var oResource = thisCntrlr.bundle;
					 var PSRData = thisCntrlr.getModelFromCore(oResource.getText("GLBPSRMODEL")).getData().NAV_PSR_CC.results;
					 var delValidFlag = thisCntrlr.getDlnkcheck(PSRData);
					 if(delValidFlag === false){
						 thisCntrlr.showToastMessage(oResource.getText("S2ALLDLINKOPPSELFAILMGS"));
				     } else {
				    	 var edtBtnTxt = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText();
						 var payload = thisCntrlr.getDLinkPayLoad(oResource.getText("S2ICONTABPSRTEXT"), Msg, PSRData);					 
						 thisCntrlr.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CCopyDLinkSet, com.amat.crm.opportunity
									.util.ServiceConfigConstants.write, payload, oResource.getText("S2CCDLNKSUSSMSG"));
						 var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL"));
						 var Guid = OppGenInfoModel.getData().Guid;                                                                                                                                                     //PCR022669++
						 var ItemGuid = OppGenInfoModel.getData().ItemGuid;                                                                                                                                             //PCR022669++
						 that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);
						 that_views2.getController().getMainCommModel(thisCntrlr.bundle.getText("S2PSRMCOMMDATATYP"));
						 var MCommDAta = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBPSRCOMMMODEL"));
						 var oTable = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__COMMTABLE);
						 oTable.setModel(MCommDAta);
						 if(edtBtnTxt === oResource.getText("S2PSRSDACANBTNTXT")){
							 that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(oResource.getText("S2PSRSDAEDITBTNTXT"));
							 that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(oResource.getText("S2PSRSDAEDITICON"));
							 that_psrsda.getController().onEditPSRSDA();
						 }
						 thisCntrlr.closeDialog(); 
				     }					 
				 } else {
					 thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ALLDLINKMANDATCOMM"));
				 }
				 break;
				//***************************End Of PCR025717 Q2C Q4 2019 Enhancements******************** 
			  }
		   }
		},
		//***************************Start Of PCR025717 Q2C Q4 2019 Enhancements******************** 
		/**
		 * This method is used to Check Delink Data.
		 * 
		 * @name getDlnkcheck
		 * @param DelData - Process Delink Data
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
		 * This method is used to get Delink Payload.
		 * 
		 * @name getDLinkPayLoad
		 * @param cType - Process Type, comment - Delink Comment, prosData - Process Data
		 * @returns payload - Delink Payload
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
			 for (var i = 0, n = 0; i < prosData.length; i++) {
				 if (prosData[i].Selected === true) {
					   var obj = {};
					   obj.Guid = prosData[i].Guid;
					   obj.OppDesc = "";
					   obj.ItemGuid = prosData[i].ItemGuid;
					   obj.OppId = prosData[i].OppId;
					   obj.ItemNo = "";
					   obj.RepFlag = "";
					   payload.NAV_CC_REMOVE.push(obj);
				 }
			 }
			 return payload;
		},
		/**
		 * This method is handling Delink Mandatory Comment Live Change Event.
		 * 
		 * @name OnDlinkCommLvchng
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		OnDlinkCommLvchng: function(oEvent){
			if (oEvent.getParameters().value.length >= 255) {
				var DlinkCommTxt = oEvent.getParameters().value.substr(0, 254);				
				this.dialog.getContent()[1].setValue(DlinkCommTxt);
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCMCOMMVALTXT"));
			} else {
				this.dialog.getContent()[1].setValue(oEvent.getParameters().value);
				if(oEvent.getParameters().value.trim().length <= 0){
					this.dialog.getContent()[1].setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT"));
					this.dialog.getButtons()[0].setEnabled(false);
				} else {
					this.dialog.getContent()[1].setValueState(thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"));
					this.dialog.getButtons()[0].setEnabled(true);
				}
			}     
		},
		//***************************End Of PCR025717 Q2C Q4 2019 Enhancements**********************
		/**
		 * This method is used to Remove duplicate on Single Array.
		 * 
		 * @name RemoveDuplicateWdKey
		 * @param arr - Array
		 * @returns 
		 */
		RemoveDuplicateWdKey: function(arr) {
			var results = [];
			for (var i = 0, n = 0; i < arr.length; i++) {
				for (var j = 0; j < arr.length; j++) {
					if (arr[i].OppId === arr[j].OppId) {
						results[n] = arr[i];
						n++;
					}
				}
			}
			return results;
		},
		/**
		 * This method is used to Remove Duplicate value on Selected and unselected Array.
		 * 
		 * @name duplicatesRemove
		 * @param Selected - Selected Items, TabData- All Table Items
		 * @returns 
		 */
		duplicatesRemove: function(Selected, TabData) {
			var onlyInA = Selected.filter(function(current) {
				return TabData.filter(function(current_TabData) {
					return current_TabData.OppId === current.OppId && current_TabData.ItemId === current.ItemId
				}).length === 0;
			});
			var onlyInB = TabData.filter(function(current) {
				return Selected.filter(function(current_Selected) {
					return current_Selected.OppId === current.OppId && current_Selected.ItemId === current.ItemId
				}).length === 0;
			});
			var result = onlyInA.concat(onlyInB);
			return result;
		},
		/**
		 * This method Validating Approve and Reject Button User Authorization.
		 * 
		 * @name ValidatePDC
		 * @param 
		 * @returns ErrorFlag - Binary Flag
		 */
		ValidatePDC: function() {
			var PDCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData();
			var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			switch (parseInt(PDCData.PsrStatus)) {
				case 605:
				case 655:
				case 604:
					var bmoUserList = GenInfoData.NAV_BMO_INFO.results;
					var bmoInitiateFlag = this.checkContact(bmoUserList);
					return bmoInitiateFlag;
				case 640:
					var gsmUserList = GenInfoData.NAV_GSM_INFO.results;
					var gsmInitiateFlag = this.checkContact(gsmUserList);
					return gsmInitiateFlag;
				case 645:
					var kpuUserList = GenInfoData.NAV_KPU_INFO.results;
					var kpuInitiateFlag = this.checkContact(kpuUserList);
					return kpuInitiateFlag;
				case 646:
					var rbmUserList = GenInfoData.NAV_RBM_INFO.results;
					var rbmInitiateFlag = this.checkContact(rbmUserList);
					return rbmInitiateFlag;
				case 650:
					var comUserList = GenInfoData.NAV_CON_INFO.results;
					var comInitiateFlag = this.checkContact(comUserList);
					return comInitiateFlag;
				case 670:
					var gsmUserList = GenInfoData.NAV_GSM_INFO.results;
					var gsmInitiateFlag = this.checkContact(gsmUserList);
					return gsmInitiateFlag;
				case 675:
					var kpuUserList = GenInfoData.NAV_KPU_INFO.results;
					var kpuInitiateFlag = this.checkContact(kpuUserList);
					return kpuInitiateFlag;
				case 680:
					var rbmUserList = GenInfoData.NAV_RBM_INFO.results;
					var rbmInitiateFlag = this.checkContact(rbmUserList);
					return rbmInitiateFlag;
				case 682:
					var comUserList = GenInfoData.NAV_CON_INFO.results;
					var comInitiateFlag = this.checkContact(comUserList);
					return comInitiateFlag;
			}
		},
		/**
		 * This Method Handles Look-Up Button Press Event.
		 * 
		 * @name onLookUp
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onLookUp: function(oEvent) {
			var oResource = thisCntrlr.bundle;
			var GenInfoData = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();
			var kpu = GenInfoData.Kpu;
			var pbg = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPPSRINFOMODEL")).getData().Bu;
			var ProductLine = GenInfoData.ProductLine;
			var contactTyp = GenInfoData.GlobalAccount;                                                                                                                            //PCR018375++
			this.lookUpList = sap.ui.xmlfragment(oResource.getText("PSRLOOKUPLISTDIALOG"), this);
			thisCntrlr.getCurrentView().addDependent(this.lookUpList);
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource
				.getText("S2ICONTABPSRSDAKEY")) {
				this.oMyOppModel._oDataModel.read("/LookUpSet?$filter=Pbg eq '" + pbg + "' and Kpu eq '" + kpu + "'", null, null, false,
					function(oData, oResponse) {
						thisCntrlr.lookupData = thisCntrlr.groupBy(oData.results, oResource.getText("S2CONCTTYPEPROPTEXT"));
					},
					function(err) {});
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGTPSICONTAB).setVisible(true);
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGBMICONTAB).setVisible(true);
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGTPSTABLE).setModel(this.getJSONModel({
					"ItemSet": thisCntrlr.lookupData.TPS
				}));
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGBMTABLE).setModel(this.getJSONModel({
					"ItemSet": thisCntrlr.lookupData.BM
				}));
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGSMICONTAB).setVisible(false);
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGRBMICONTAB).setVisible(false);
			} else {
//				this.oMyOppModel._oDataModel.read("/LookUpSet?$filter=Pbg eq '" + pbg + "' and Kpu eq '" + ProductLine + "'", null, null,                                         //PCR018375--
				this.oMyOppModel._oDataModel.read("/LookUpSet?$filter=Pbg eq '" + pbg + "' and Kpu eq '" + ProductLine + "'and ContactType eq '" + contactTyp + "'", null, null,  //PCR018375++
					false,
					function(oData, oResponse) {
						thisCntrlr.lookupData = thisCntrlr.groupBy(oData.results, oResource.getText("S2CONCTTYPEPROPTEXT"));
					},
					function(err) {});
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGSMICONTAB).setVisible(true);
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGRBMICONTAB).setVisible(true);
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGGSMTABLE).setModel(this.getJSONModel({
					"ItemSet": thisCntrlr.lookupData.GSM
				}));
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGTPSICONTAB).setVisible(false);
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGBMICONTAB).setVisible(false);
			}
			sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGPLTABLE).setModel(this.getJSONModel({
				"ItemSet": thisCntrlr.lookupData.PL
			}));
			sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGCONTABLE).setModel(this.getJSONModel({
				"ItemSet": thisCntrlr.lookupData.CON
			}));
			sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGCOMTABLE).setModel(this.getJSONModel({
				"ItemSet": thisCntrlr.lookupData.NOT
			}));
			this.lookUpList.setModel(new sap.ui.model.json.JSONModel(), oResource.getText(
				"S2PSRCBCATTDFTJSONMDLTXT"));
			this.lookUpList.open();
		},
		/** Keep
		 * This method Handles Message Pop-over Event.
		 * 
		 * @name handleMessagePopoverPress
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		handleMessagePopoverPress: function(oEvent) {
			var oMessagePopover = that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MESSAGE_POPOVER);
			thisCntrlr.oMessagePopover.openBy(oEvent.getSource());
		},
		onWFPress: function(evt) {
			oCommonController.commonWFPress(evt, thisCntrlr);
		},
		/**
		 * This method Handles Cancel Button Of Confirmation Dialog.
		 * 
		 * @name onCancelWFPress
		 * @param 
		 * @returns 
		 */
		onCancelWFPress: function() {
			this.dialog.close();
			this.dialog.destroy();
			this.detActionType = "";
		},
		/**
		 * This method Used to bind List Data with List.
		 * 
		 * @name fnContactInfo
		 * @param id - List Id, template -List Template, listItem -List Data.
		 * @returns 
		 */
		fnContactInfo: function(id, template, listItem) {
			var cModel = this.getJSONModel(listItem);
			var oTableItems = thisCntrlr.getView().byId(id);
			var oItemTemplate = thisCntrlr.getView().byId(template);
			oTableItems.setModel(cModel);
			oTableItems.bindAggregation("items", {
				path: "/results",
				template: oItemTemplate
			});
		},
		/** Keep
		 * This method Handles Unlink Button Event.
		 * 
		 * @name onPressUnLinkDoc
		 * @param 
		 * @returns 
		 */
		onPressUnLinkDoc: function() {
			var myBusyDialog = thisCntrlr.getBusyDialog();                                                                                            //PCR021481++
			myBusyDialog.open();                                                                                                                      //PCR021481++
			var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			var sValidate = "CustDoclinkSet(Guid=guid'" + GenInfoData.Guid + "',ItemGuid=guid'" + thisCntrlr.getModelFromCore(thisCntrlr.bundle
				.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid + "')";
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.remove, "", thisCntrlr.bundle
				.getText("S2PSRSDACBCCCSUCSSMSG"));
			that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(true);
			that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(false);
			that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(false);
			//this.refreshRelPerSpecRewData(GenInfoData.Guid, GenInfoData.ItemGuid);
			this.checkPDCInitiate();                                                                                                                 //PCR021481++
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.bundle.getText("S2PSRSDAEDITBTNTXT"));       //PCR021481++
			this.onEditPDCSDA();                                                                                                                     //PCR021481++
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_PANEL).setExpanded(true);                                //PCR021481++
			myBusyDialog.close();                                                                                                                    //PCR021481++
		},
		/**
		 * This method Used to current User with Contact List.
		 * 
		 * @name checkContact
		 * @param UserList - User Contact List
		 * @returns checkFlag - Binary Flag
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
		/** Keep
		 * This method Handles Customer Spec Rev1 Panel Expended Event.
		 * 
		 * @name handleCustSpecRev1Exp
		 * @param
		 * @returns 
		 */
		handleCustSpecRev1Exp: function() {
			var oResource = thisCntrlr.bundle;
			var SecurityData = thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();
			var PSRData = thisCntrlr.getModelFromCore(oResource.getText("GLBPSRMODEL")).getData();
			var PDCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
			var GenInfoData = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();
			var CustSpecRev1 = [],
				UpldCustSpecVis, Enableflag = false,
				Enabledelflag = false;
			(SecurityData.UpldCustSpec === oResource.getText("S2ODATAPOSVAL")) ? (UpldCustSpecVis =
				true) : (UpldCustSpecVis = false);
			var iconTabBtn = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB);
			if (iconTabBtn.getSelectedKey() === oResource.getText("S2ICONTABPDCSDAKEY")) {
				var CustSpecRev1Data = PDCData.NAV_PDCCUST_REVSPEC.results;
				thisCntrlr.oBookingDocTable = this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE);
				var gsmUserList = GenInfoData.NAV_GSM_INFO.results;
				var gsmUserFlag = thisCntrlr.checkPDCUsersfromlist(gsmUserList);
				(parseInt(PDCData.PsrStatus) === 604 || parseInt(PDCData.PsrStatus) === 605 || (parseInt(PDCData.PsrStatus) === 640 && gsmUserFlag ===
					true)) ? ((this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() === oResource.getText(
					"S2PSRSDAEDITBTNTXT")) ? (Enableflag = false, Enabledelflag = false) : (Enableflag = true, Enabledelflag = true)) : ("");
				var Editbtn = thisCntrlr.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn);
			} else {
				var CustSpecRev1Data = PSRData.NAV_CUST_REVSPEC.results;
				(parseInt(PSRData.PsrStatus) === 5 || parseInt(PSRData.PsrStatus) === 4) ? ((that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn)
					.getText() === oResource
					.getText("S2PSRSDAEDITBTNTXT")) ? (Enableflag = false, Enabledelflag = false) : (Enableflag =
					true, Enabledelflag = true)) : ("");
				(parseInt(PSRData.PsrStatus) ===
					15) ? ((that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() === oResource.getText(
						"S2PSRSDAEDITBTNTXT")) ?
					(Enableflag = false, Enabledelflag = false) : (Enableflag = false, Enabledelflag = false)) : ("");
				thisCntrlr.oBookingDocTable = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_TABLE);
				var Editbtn = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn);
			}
			CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, Enableflag, Enabledelflag);
			var oCustSpecRev1JModel = this.getJSONModel({
				"ItemSet": CustSpecRev1
			});
			thisCntrlr.oBookingDocTable.setModel(oCustSpecRev1JModel);
			this.setTableNoteEnable(thisCntrlr.oBookingDocTable);
			this.setTableSecurity(thisCntrlr.oBookingDocTable);
		},
		/** Keep
		 * This method Handles File Name Press Event.
		 * 
		 * @name handleEvidenceLinkPress
		 * @param evt - Event handler
		 * @returns 
		 */
		handleLinkPress: function(evt) {
			var rowIndex = evt.getSource().getParent().getId().split("-")[evt.getSource().getParent().getId().split(
				"-").length - 1];
			var oData = evt.getSource().getParent().getParent().getModel().getData().ItemSet[rowIndex];
			var url = this.oMyOppModel._oDataModel.sServiceUrl + "/AttachmentSet(Guid=guid'" + oData.Guid + "',ItemGuid=guid'" + oData.itemguid +
				"',DocType='" + oData.doctype + "',DocSubtype='" + oData.docsubtype + "',DocId=guid'" + oData.DocId +
				"')/$value";
			window.open(url);
		},
		/**
		 * This method Handles Add Button Press Event.
		 * 
		 * @name createColumnListItem
		 * @param data - table Selected Line
		 * @returns 
		 */
		createColumnListItem: function(data) {
			var objColumnListItem = new sap.m.ColumnListItem().data({
				objData: data.Guid
			});
			return objColumnListItem;
		},
		/**
		 * This method Validates Delete Button Press Event.
		 * 
		 * @name CheckDelete
		 * @param evt - Event Handler
		 * @returns 
		 */
		CheckDelete: function(evt) {
			thisCntrlr.rowIndex = evt.getSource().getParent().getParent().getParent().getId().split("-")[evt.getSource()
				.getParent().getParent().getParent().getId().split("-").length - 1];
			thisCntrlr.oEvent = evt;
			thisCntrlr.source = evt.getSource();
			thisCntrlr.oTable = evt.getSource().getParent().getParent().getParent().getParent();
			if (thisCntrlr.source.getIcon().indexOf(thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDDELTXT").toLowerCase()) >=
				0) {
				var text = thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDMSG") + " " + thisCntrlr.oTable.getModel()
					.getData().ItemSet[thisCntrlr.rowIndex].DocDesc + "?";
				var box = new sap.m.VBox({
					items: [
						new sap.m.Text({
							text: text
						})
					]
				});
				MessageBox.show(box, {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDCONTXT"),
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function(oAction) {
						if (oAction === sap.m.MessageBox.Action.YES) {
							thisCntrlr.handleDeletePress();
						} else return;
					}
				});
			} else {
				thisCntrlr.handleDeletePress();
			}
		},
		/**
		 * This method Handles Delete Button Press Event.
		 * 
		 * @name handleDeletePress
		 * @param event - Event Handler
		 * @returns 
		 */
		handleDeletePress: function(event) {
			oCommonController.commonDeletePress(event, thisCntrlr);
		},

		/** Keep
		 * This method Handles Edit Button Press Event.
		 * 
		 * @name handleEditPress
		 * @param evt - Event Handler
		 * @returns 
		 */
		handleEditPress: function(evt) {
			oCommonController.commonEditPress(evt, thisCntrlr);
		},
		/** Keep
		 * This method Handles Add Button Press Event.
		 * 
		 * @name handleAddPress
		 * @param evt - Event Handler
		 * @returns 
		 */
		handleAddPress: function(evt) {
			var rowIndex = evt.getSource().getParent().getParent().getParent().getId().split("-")[evt.getSource().getParent()
				.getParent().getParent().getId().split("-").length - 1];
			var oTable = evt.getSource().getParent().getParent().getParent().getParent();
			var tObject = {
				"DocDesc": "",
				"Guid": "",
				"DocId": "",
				"Enableflag": true,
				"itemguid": "",
				"doctype": "",
				"docsubtype": "",
				"filename": "",
				"OriginalFname": "",
				"note": "",
				"uBvisible": true,
				"bgVisible": false,
				"editable": true,
				"Code": ""
			};
			tObject.Code = oTable.getModel().getData().ItemSet[rowIndex].Code;
			tObject.Guid = oTable.getModel().getData().ItemSet[rowIndex].Guid;
			tObject.DocId = oTable.getModel().getData().ItemSet[rowIndex].DocId;
			tObject.doctype = oTable.getModel().getData().ItemSet[rowIndex].doctype;
			tObject.docsubtype = oTable.getModel().getData().ItemSet[rowIndex].docsubtype;
			tObject.DocDesc = oTable.getModel().getData().ItemSet[rowIndex].DocDesc;
			tObject.itemguid = oTable.getModel().getData().ItemSet[rowIndex].itemguid;
			oTable.getModel().getData().ItemSet.splice(parseInt(rowIndex) + 1, 0, tObject);
			oTable.getModel().refresh();
			oTable.getItems()[parseInt(rowIndex) + 1].getCells()[3].getItems()[1].getItems()[0].setEnabled(true);
			oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setEnabled(true);
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() !== thisCntrlr.bundle
				.getText("S2ICONTABATTCHKEY")) {
				this.setTableNoteEnable(oTable);
			} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() !== thisCntrlr.bundle
				.getText("S2ICONTABPSRTEXT")) {
				this.setTableSecurity(oTable);
			}
		},
		/**
		 * This method Handles Browse Button Upload Complete Event.
		 * 
		 * @name handleFileUploadComplete
		 * @param evt - Event Handler
		 * @returns 
		 */
		handleFileUploadComplete: function(evt) {
			thisCntrlr.Custno = null;
			this.oFileUploader = null;
			thisCntrlr.carmDate = null;
			thisCntrlr.carmMainCom = "";
			sap.ui.core.BusyIndicator.show();
			var uploadButton = evt.getSource().getParent().getParent().mAggregations.items[1];
			var rowIndex = uploadButton.getId().split("-")[uploadButton.getId().split("-").length - 1];
			var oTable = evt.getSource().getParent().getParent().getParent().getParent();
			oTable.getModel().getData().ItemSet[rowIndex].filename = evt.mParameters.newValue;
			thisCntrlr.oTable = oTable;
			thisCntrlr.tableModel = oTable.getModel().getData();
			if (evt.getParameters().id.toLowerCase().indexOf(thisCntrlr.bundle.getText("S2ICONTABCARMKEY").toLowerCase()) >=
				0) {
				thisCntrlr.Custno = thisCntrlr.carmValidate.Customer;
			} else {
				thisCntrlr.Custno = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBATTMODEL")).getData()
					.Custno;
			}
			oTable.getModel().getData().ItemSet[rowIndex].uBvisible = true;
			oTable.getModel().getData().ItemSet[rowIndex].bgVisible = !oTable.getModel().getData().ItemSet[rowIndex]
				.uBvisible;
			oTable.getModel().getData().ItemSet[rowIndex].editable = false;
			if (evt.getSource().getParent().getParent().getParent().mAggregations.cells[2].mAggregations.items !==
				undefined) {
				oTable.getModel().getData().ItemSet[rowIndex].note = evt.getSource().getParent().getParent().getParent()
					.mAggregations.cells[2].getValue();
			}
			if (oTable.getModel().getData().ItemSet[rowIndex].doctype === thisCntrlr.bundle.getText("S2ICONTABCARMKEY") && oTable.getModel().getData()
				.ItemSet[
					rowIndex].docsubtype === thisCntrlr.bundle.getText("S2ATTOTHTYPETEXT") || oTable.getModel().getData().ItemSet[rowIndex].Code ===
				thisCntrlr.bundle.getText("S2OTHDOCCODETEXT")) {
				var type = thisCntrlr.bundle.getText("S2OTHDOCCODETEXT");
			} else {
				var type = "";
			}
			var SLUG = oTable.getModel().getData().ItemSet[rowIndex].itemguid.replace(/-/g, "").toUpperCase() + "$$" + oTable.getModel()                        //PCR035760++ Defect#131 TechUpgrade changes
				.getData().ItemSet[rowIndex].doctype + "$$" + oTable.getModel().getData().ItemSet[rowIndex].docsubtype +
				"$$" + type + "$$" + " " + "$$" + thisCntrlr.Custno + "$$" + oTable.getModel().getData().ItemSet[
					rowIndex].filename + "$$" + (oTable.getModel().getData().ItemSet[rowIndex].note === " " ? " " :
					oTable.getModel().getData().ItemSet[rowIndex].note);
			if (!window.location.origin) {
				window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location
					.port ? ':' + window.location.port : '');
			}
			var sBaseUrl = window.location.origin;
			var file = evt.oSource.oFileUpload.files[0];
			this.oFileUploader = evt.getSource();
			this.oFileUploader.setSendXHR(true);
			this.oFileUploader.removeAllHeaderParameters();
			var model = new sap.ui.model.odata.ODataModel(sBaseUrl +
				com.amat.crm.opportunity.util.ServiceConfigConstants.getMyOpportunityInfoURL + 
				com.amat.crm.opportunity.util.ServiceConfigConstants.AttachmentSet, true);
			var sToken = model.getHeaders()['x-csrf-token'];
			model.refreshSecurityToken(function(e, o) {
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
			uploadButton.setVisible(false);
			var buttonGroup = evt.getSource().getParent().getParent().mAggregations.items[0];
			buttonGroup.setVisible(true);
		},
		/**
		 * This Method Handles sort Att Data Press Event.
		 * 
		 * @name groupBy
		 * @param xs - Att Data, Key -Contact Type
		 * @returns 
		 */
		groupBy: function(xs, key) {
			return xs.reduce(function(rv, x) {
				(rv[x[key]] = rv[x[key]] || []).push(x);
				return rv;
			}, {});
		},
		/**
		 * This method Handles upload Complete Event.
		 * 
		 * @name onComplete
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onComplete: function(oEvent) {
			if (oEvent.getParameters().status === 201) {
				thisCntrlr.onExpBookDoc();
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCATTDOCUPLDSUCSSMSG"));
				thisCntrlr.dialog.close();
				thisCntrlr.dialog.destroy();
			} else if (oEvent.getParameters().status === 400) {
				thisCntrlr.showToastMessage($(oEvent.mParameters.responseRaw).find(thisCntrlr.getResourceBundle().getText(
					"S2CBCPSRCARMTYPEMESG"))[0].innerText);
				thisCntrlr.onExpBookDoc();
				thisCntrlr.dialog.close();
				thisCntrlr.dialog.destroy();
			}
		},
		/** Keep
		 * This method Handles Customer Spec Rev1 File upload Complete Event.
		 * 
		 * @name handleRevFileUploadComplete
		 * @param evt - Event Handler
		 * @returns 
		 */
		handleRevFileUploadComplete: function(evt) {
			sap.ui.core.BusyIndicator.show();
			var uploadButton = evt.getSource().getParent().getParent().mAggregations.items[1];
			var rowIndex = uploadButton.getId().split("-")[uploadButton.getId().split("-").length - 1];
			var oTable = evt.getSource().getParent().getParent().getParent().getParent();
			oTable.getModel().getData().ItemSet[rowIndex].filename = evt.mParameters.newValue;
			thisCntrlr.oTable = oTable;
			thisCntrlr.tableModel = oTable.getModel().getData();
			oTable.getModel().getData().ItemSet[rowIndex].uBvisible = true;
			oTable.getModel().getData().ItemSet[rowIndex].bgVisible = !oTable.getModel().getData().ItemSet[rowIndex]
				.uBvisible;
			oTable.getModel().getData().ItemSet[rowIndex].editable = false;
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
				.getText("S2ICONTABPSRSDAKEY")) {
				thisCntrlr.Custno = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData()
					.Custno;
			} else {
				thisCntrlr.Custno = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData()
					.Custno;
			}
			if (evt.getSource().getParent().getParent().getParent().mAggregations.cells[2].mAggregations.items ===
				undefined) {
				oTable.getModel().getData().ItemSet[rowIndex].note = evt.getSource().getParent().getParent().getParent()
					.mAggregations.cells[2].getValue();
			} else oTable.getModel().getData().ItemSet[rowIndex].note = "";
			var SLUG = oTable.getModel().getData().ItemSet[rowIndex].itemguid.replace(/-/g, "").toUpperCase() + "$$" + oTable.getModel()                        //PCR035760++ Defect#131 TechUpgrade changes
				.getData().ItemSet[rowIndex].doctype + "$$" + oTable.getModel().getData().ItemSet[rowIndex].docsubtype +
				"$$ $$" + " " + "$$" + (thisCntrlr.Custno === " " ? " " : thisCntrlr.Custno) + "$$" + oTable.getModel().getData()
				.ItemSet[rowIndex].filename + "$$" + (oTable.getModel().getData().ItemSet[rowIndex].note === " " ?
					" " : oTable.getModel().getData().ItemSet[rowIndex].note);
			if (!window.location.origin) {
				window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location
					.port ? ':' + window.location.port : '');
			}
			var file = evt.oSource.oFileUpload.files[0];
			this.oFileUploader = evt.getSource();
			this.oFileUploader.setSendXHR(true);
			this.oFileUploader.removeAllHeaderParameters();
			if (!window.location.origin) {
				window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location
					.port ? ':' + window.location.port : '');
			}
			var sBaseUrl = window.location.origin;
			var model = new sap.ui.model.odata.ODataModel(sBaseUrl +
				com.amat.crm.opportunity.util.ServiceConfigConstants.getMyOpportunityInfoURL + 
				com.amat.crm.opportunity.util.ServiceConfigConstants.AttachmentSet, true);
			var sToken = model.getHeaders()['x-csrf-token'];
			model.refreshSecurityToken(function(e, o) {
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
		},
		/** Keep
		 * This method Handles Customer Spec Rev1 Delete Button Complete Event.
		 * 
		 * @name CheckRev1Delete
		 * @param evt - Event Handler
		 * @returns 
		 */
		CheckRev1Delete: function(evt) {
			var SpecFlag = true, count = 0;
			if(evt.getParameters().id.split("-")[3] === com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE){
				var CustTableData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE).getModel().getData().ItemSet;
				SpecFlag = false;
				for(var i = 0; i < CustTableData.length; i++){
					if(CustTableData[i].filename !== ""){
						SpecFlag = true;
						count++;
					}
				}	
			}
			if(SpecFlag === false || count === 1){
				this.showToastMessage(thisCntrlr.bundle.getText("S2PDCCUSTSPECREQMSG"));
			} else {
				thisCntrlr.rowIndex = evt.getSource().getParent().getParent().getParent().getId().split("-")[evt.getSource()
				                                                                                             .getParent().getParent().getParent().getId().split("-").length - 1];
				thisCntrlr.oEvent = evt;
				thisCntrlr.source = evt.getSource();
				thisCntrlr.oTable = evt.getSource().getParent().getParent().getParent().getParent();
				if (thisCntrlr.source.getIcon().indexOf(thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDDELTXT").toLowerCase()) >=
					0) {
					var text = thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDMSG") + " " + thisCntrlr.oTable.getModel()
					.getData().ItemSet[thisCntrlr.rowIndex].DocDesc + " " + thisCntrlr.bundle.getText(
					"S2ATTCHDOCDELVALDMSG2NDPRT");
					var box = new sap.m.VBox({
						items: [
						        new sap.m.Text({
						        	text: text
						        })
						        ]
					});
					MessageBox.show(box, {
						icon: sap.m.MessageBox.Icon.INFORMATION,
						title: thisCntrlr.getResourceBundle().getText("S2ATTCHDOCDELVALDCONTXT"),
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function(oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								thisCntrlr.handleRev1DeletePress();
							} else return;
						}
					});
				} else {
					thisCntrlr.handleRev1DeletePress();
				}
			}
			
		},
		/**
		 * This method Handles Customer Spec Rev1 Delete Button Complete Event.
		 * 
		 * @name handleRev1DeletePress
		 * @param
		 * @returns 
		 */
		handleRev1DeletePress: function() {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var rowIndex = thisCntrlr.source.getParent().getParent().getParent().getId().split("-")[thisCntrlr.source.getParent()
				.getParent().getParent().getId().split("-").length - 1];
			var oTable = thisCntrlr.source.getParent().getParent().getParent().getParent();
			var tableModel = oTable.getModel().getData().ItemSet;
			thisCntrlr.tableModel = tableModel;
			var flag = 0;
			$.each(tableModel, function(key, value) {
				if (value.docsubtype === tableModel[rowIndex].docsubtype) flag++;
			});
			if (thisCntrlr.source.getIcon().indexOf(thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDDELTXT").toLowerCase()) >=
				0) {
				if (flag === 1) {
					var tObject = {
						"Guid": "",
						"DocId": "",
						"itemguid": "",
						"doctype": "",
						"docsubtype": "",
						"DocDesc": "",
						"filename": "",
						"note": "",
						"uBvisible": true,
						"bgVisible": false,
						"editable": true
					};
					tObject.Guid = oTable.getModel().getData().ItemSet[rowIndex].Guid;
					tObject.DocId = oTable.getModel().getData().ItemSet[rowIndex].DocId;
					tObject.doctype = oTable.getModel().getData().ItemSet[rowIndex].doctype;
					tObject.docsubtype = oTable.getModel().getData().ItemSet[rowIndex].docsubtype;
					tObject.DocDesc = oTable.getModel().getData().ItemSet[rowIndex].DocDesc;
					tObject.itemguid = oTable.getModel().getData().ItemSet[rowIndex].itemguid;
					oTable.getModel().getData().ItemSet.splice(parseInt(rowIndex), 1);
					oTable.getModel().getData().ItemSet.splice(parseInt(rowIndex), 0, tObject);
					oTable.getModel().refresh(true);
					if (!window.location.origin) {
						window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location
							.port ? ':' + window.location.port : '');
					}
					var sBaseUrl = window.location.origin;
					var sServiceUrl = sBaseUrl + com.amat.crm.opportunity.util.ServiceConfigConstants.getMyOpportunityInfoURL;
					var model = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
					var a = sBaseUrl + com.amat.crm.opportunity.util.ServiceConfigConstants.getMyOpportunityInfoURL + com.amat.crm.opportunity.util.ServiceConfigConstants.AttachmentSet;
					var f = {
						headers: {
							"X-Requested-With": "XMLHttpRequest",
							"Content-Type": "application/atom+xml",
							DataServiceVersion: "2.0",
							"X-CSRF-Token": "Fetch"
						},
						requestUri: a,
						method: "GET"
					};
					var sDelete = sServiceUrl + "/AttachmentSet(Guid= guid'" + tableModel[rowIndex].Guid +
						"', ItemGuid = guid'" + tableModel[rowIndex].itemguid + "', DocType='" + tableModel[rowIndex].doctype +
						"',DocSubtype='" + tableModel[rowIndex].docsubtype + "',DocId=guid'" + tableModel[rowIndex].DocId +
						"')";
					OData.request(f, function(data, oSuccess) {
						thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
						var oHeaders = {
							"X-CSRF-Token": thisCntrlr.oToken,
						};
						/**
						 * *****************To
						 * Delete
						 * File***********************
						 */
						var sDelete = sServiceUrl + "/AttachmentSet(Guid=guid'" + tableModel[rowIndex].Guid +
							"',ItemGuid=guid'" + tableModel[rowIndex].itemguid + "',DocType='" + tableModel[rowIndex].doctype +
							"',DocSubtype='" + tableModel[rowIndex].docsubtype + "',DocId=guid'" + tableModel[rowIndex]
							.DocId + "')";
						jQuery.ajax({
							type: 'DELETE',
							url: sDelete,
							headers: oHeaders,
							cache: false,
							processData: false,
							success: function(data) {
								thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText(
									"S2ATTCHDOCDELSUCSSMSG"));
								var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText(
									"GLBOPPGENINFOMODEL"));
								if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
									thisCntrlr.getResourceBundle().getText("S2ICONTABPSRSDAKEY")) {
									thisCntrlr.getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData()
										.ItemGuid);
									that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
									that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
									thisCntrlr.onEditPSRSDA();
								} else {
									thisCntrlr.getPDCData();
									thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
									thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
									thisCntrlr.onEditPDCSDA();
								}
							},
							error: function(data) {
								thisCntrlr.showToastMessage($(data.responseText).find(thisCntrlr.getResourceBundle()
										.getText("S2CBCPSRCARMTYPEMESG"))[0].innerText);
								if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
									thisCntrlr.getResourceBundle().getText("S2ICONTABPSRSDAKEY")) {
									thisCntrlr.getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData()
											.ItemGuid);
							    }  else {
									thisCntrlr.getPDCData();
							    }
							}
						});
					}, function(err) {});
				} else {
					if (!window.location.origin) {
						window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location
							.port ? ':' + window.location.port : '');
					}
					var sBaseUrl = window.location.origin;
					var sServiceUrl = sBaseUrl + com.amat.crm.opportunity.util.ServiceConfigConstants.getMyOpportunityInfoURL;
					var model = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
					var a = sBaseUrl + com.amat.crm.opportunity.util.ServiceConfigConstants.getMyOpportunityInfoURL + com.amat.crm.opportunity.util.ServiceConfigConstants.AttachmentSet;
					var f = {
						headers: {
							"X-Requested-With": "XMLHttpRequest",
							"Content-Type": "application/atom+xml",
							DataServiceVersion: "2.0",
							"X-CSRF-Token": "Fetch"
						},
						requestUri: a,
						method: "GET"
					};
					var sDelete = sServiceUrl + "/AttachmentSet(Guid= guid'" + tableModel[rowIndex].Guid +
						"', ItemGuid = guid'" + tableModel[rowIndex].itemguid + "', DocType='" + tableModel[rowIndex].doctype +
						"',DocSubtype='" + tableModel[rowIndex].docsubtype + "',DocId=guid'" + tableModel[rowIndex].DocId +
						"')";
					OData.request(f, function(data, oSuccess) {
						thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
						var oHeaders = {
							"X-CSRF-Token": thisCntrlr.oToken,
						};
						/**
						 * *****************To
						 * Delete
						 * File***********************
						 */
						var sDelete = sServiceUrl + "/AttachmentSet(Guid=guid'" + tableModel[rowIndex].Guid +
							"',ItemGuid=guid'" + tableModel[rowIndex].itemguid + "',DocType='" + tableModel[rowIndex].doctype +
							"',DocSubtype='" + tableModel[rowIndex].docsubtype + "',DocId=guid'" + tableModel[rowIndex]
							.DocId + "')";
						jQuery.ajax({
							type: 'DELETE',
							url: sDelete,
							headers: oHeaders,
							cache: false,
							processData: false,
							success: function(data) {
								thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText(
									"S2ATTCHDOCDELSUCSSMSG"));
								var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText(
									"GLBOPPGENINFOMODEL"));
								if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
									thisCntrlr.getResourceBundle().getText("S2ICONTABPSRSDAKEY")) {
									thisCntrlr.getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData()
										.ItemGuid);
									that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
									that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
									thisCntrlr.onEditPSRSDA();
								} else {
									thisCntrlr.getPDCData();
									thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
									thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
									thisCntrlr.onEditPDCSDA();
									thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
									thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
									thisCntrlr.onEditPDCSDA();
								}
							},
							error: function(data) {
								thisCntrlr.showToastMessage($(data.responseText).find(thisCntrlr.getResourceBundle()
										.getText("S2CBCPSRCARMTYPEMESG"))[0].innerText);
								if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
									thisCntrlr.getResourceBundle().getText("S2ICONTABPSRSDAKEY")) {
									thisCntrlr.getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData()
											.ItemGuid);
							    }  else {
									thisCntrlr.getPDCData();
							    }
							}
						});
					}, function(err) {});
				}
				/** **************To Fetch CSRF Token****************** */
			} else {
				oTable.getModel().refresh(true);
				oTable.getModel().getData().ItemSet[rowIndex].editable = true;
				oTable.mAggregations.items[rowIndex].mAggregations.cells[2].setEnabled(false);
				oTable.getModel().getData().ItemSet[rowIndex].note = thisCntrlr.tempHold;
				thisCntrlr.source.setIcon(thisCntrlr.bundle.getText("S2PSRSDADELETEICON"));
				thisCntrlr.source.getParent().mAggregations.items[0].setIcon(thisCntrlr.bundle.getText(
					"S2PSRSDAEDITICON"));
				if (thisCntrlr.source.getParent().mAggregations.items[2] !== undefined) {
					thisCntrlr.source.getParent().mAggregations.items[2].setVisible(true);
				}
				for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {
					if (i !== parseInt(rowIndex)) {
						oTable.getModel().getData().ItemSet[i].bgVisible = true;
						oTable.getModel().getData().ItemSet[i].uBvisible = true;
					}
				}
				oTable.getModel().refresh(true);
				var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText(
					"GLBOPPGENINFOMODEL"));
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.getResourceBundle()
					.getText("S2ICONTABPSRSDAKEY")) {
					thisCntrlr.getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITBTNTXT"));
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITICON"));
					thisCntrlr.onEditPSRSDA();
				} else {
					thisCntrlr.getPDCData();
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITBTNTXT"));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITICON"));
					thisCntrlr.onEditPDCSDA();
				}
			}
			myBusyDialog.close();
		},
		/**
		 * This method Used to get Valid Xsrf token.
		 * 
		 * @name getXsrfToken
		 * @param 
		 * @returns 
		 */
		getXsrfToken: function() {
			if (!window.location.origin) {
				window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location
					.port ? ':' + window.location.port : '');
			}
			var sBaseUrl = window.location.origin;
			var model = new sap.ui.model.odata.ODataModel(sBaseUrl +
				com.amat.crm.opportunity.util.ServiceConfigConstants.getMyOpportunityInfoURL + 
				com.amat.crm.opportunity.util.ServiceConfigConstants.AttachmentSet, true);
			var sToken = model.getHeaders()['x-csrf-token'];
			if (!sToken) {
				model.refreshSecurityToken(function(e, o) {
					sToken = o.headers['x-csrf-token'];
				}, function() {}, false);
			}
			return sToken;
		},
		/**
		 * This method Handles Table Column Press Event.
		 * 
		 * @name onColumnPress
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onColumnPress: function(oEvent) {
			thisCntrlr.setFilters(oEvent, oEvent.getParameter(thisCntrlr.bundle.getText("S1COLMNINDEXTEXT")));
		},
		/**
		 * This method Handles Table Data Filter Event.
		 * 
		 * @name setFilters
		 * @param evt - Event Handler, colIndex - Column Index
		 * @returns 
		 */
		setFilters: function(evt, colIndex) {
			var colIndex = evt.getParameter(thisCntrlr.bundle.getText("S1COLMNINDEXTEXT"));
			var SortParam = this.getColShorterContact(colIndex, thisCntrlr.colFlag);
			var aProjSorters = [];
			aProjSorters.push(new sap.ui.model.Sorter(SortParam[0], SortParam[1]));
			var objprojectTab = sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.S2_F_ADDCONTACT_CONTACT_TABLE);
			var objprojectTamplate = sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.S2_F_ADDCONTACT_CONTACT_TABLE_TEMPLATE);
			objprojectTab.bindAggregation("items", {
				path: "json>/ItemSet",
				template: objprojectTamplate,
				sorter: aProjSorters
			});
			(SortParam[1] === false && SortParam[2] !== null) ? (thisCntrlr.showToastMessage(SortParam[2] + " " +
				thisCntrlr.bundle.getText("S1TABLESORTAEC"))) : ((SortParam[2] !== null) ? (thisCntrlr.showToastMessage(SortParam[2] + " " +
				thisCntrlr.bundle.getText("S1TABLESORTDES"))) : "");
		},
		/** Keep
		 * This method Handles Add Contact Button Event.
		 * 
		 * @name onPressAddContact
		 * @param evt - Event Handler
		 * @returns 
		 */
		onPressAddContact: function(evt) {
			oCommonController.commonPressAddContact(evt, thisCntrlr);
		},
		/**
		 * This method Handles Search Contact Button Event.
		 * 
		 * @name searchContact
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		searchContact: function(oEvent) {
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
			var model = this.oMyOppModel._oDataModel;
			if (searchText.length != 0) {
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
		 * This method Handles Contact Dialog Ok Button Event.
		 * 
		 * @name onContactOkPress
		 * @param evt - Event Handler
		 * @returns 
		 */
		onContactOkPress: function(evt) {
			oCommonController.commonContactOkPressed(evt, thisCntrlr);
		},
		/**
		 * This method Handles Contact Dialog On Selection Event.
		 * 
		 * @name contactSucess
		 * @param 
		 * @returns 
		 */
		contactSucess: function(Msg) {
			oCommonController.commonContactSuccess(Msg, thisCntrlr);
		},
		/**
		 * This method Used to Validate CBC Process User Permissions.
		 * 
		 * @name checkCBCUsersfromlist
		 * @param 
		 * @returns checkFlag - Binary Flag
		 */
		checkCBCUsersfromlist: function() {
			var CBCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBCBCMODEL")).getData();
			var checkFlag = false;
			if (parseInt(CBCData.CbcStatus) === 500 || parseInt(CBCData.CbcStatus) === 510) {
				var romUserList = CBCData.NAV_CBCROM.results;
				var romInitiateFlag = this.checkContact(romUserList);
				(romInitiateFlag === true) ? (checkFlag = true) : (checkFlag = false);
			} else if (parseInt(CBCData.CbcStatus) === 505) {
				var romUserList = CBCData.NAV_CBCROM.results;
				var romInitiateFlag = this.checkContact(romUserList);
				var bomUserList = CBCData.NAV_CBCBMO.results;
				var bomInitiateFlag = this.checkContact(bomUserList);
				(bomInitiateFlag === true || romInitiateFlag === true) ? (checkFlag = true) : (checkFlag = false);
			} else if (parseInt(CBCData.CbcStatus) === 520) {
				var AuthSalUserList = CBCData.NAV_CBCASA.results;
				var AuthSalInitiateFlag = this.checkContact(AuthSalUserList);
				(AuthSalInitiateFlag === true) ? (checkFlag = true) : (checkFlag = false);
			}
			return checkFlag;
		},
		/**
		 * This method Used to refresh GenInfo Model.
		 * 
		 * @name refreshModel
		 * @param 
		 * @returns 
		 */
		refreshModel: function() {
			var sValidatePath = "GenralInfoSet(Guid=guid'" + thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
					"GLBOPPGENINFOMODEL")).getData().Guid + "',ItemGuid=guid'" + thisCntrlr.getModelFromCore(thisCntrlr.bundle
					.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid +
				"')?$expand=NAV_ASM_INFO,NAV_BMHEAD_INFO,NAV_BMO_INFO,NAV_BSM_INFO,NAV_CON_INFO,NAV_GPM_INFO,NAV_GSM_INFO,NAV_KPU_INFO,NAV_PM_INFO,NAV_POM_INFO,NAV_RBM_INFO,NAV_ROM_INFO,NAV_SALES_INFO,NAV_TPS_INFO,NAV_TRANS_HISTORY";
			this.getView().getController().serviceCall(sValidatePath, com.amat.crm.opportunity.util.ServiceConfigConstants
				.read, "", "");
			that_general.getController().setQuoteRevisionNumber();
		},

		/**
		 * This method Handles Delete Button Event.
		 * 
		 * @name onContactCancelPress
		 * @param 
		 * @returns 
		 */
		onContactCancelPress: function() {
			this.contactF4Fragment.close();
			this.contactF4Fragment.destroy(true);
		},
		/**
		 * This method Handles Other Button Event.
		 * 
		 * @name handleOtherPress
		 * @param evt - Event Handlers
		 * @returns 
		 */
		handleOtherPress: function(evt) {
			var oResource = thisCntrlr.bundle;
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource
				.getText("S2ICONTABCARMKEY")) {
				thisCntrlr.carmDate = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).getDateValue();
				thisCntrlr.carmMainCom = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_MAINCOMMENT_TEXTAREA)
					.getValue();
			}
			var DocumentType = [{
				"DocumentType": DocumentType
			}];
			switch (evt.getSource().data("mySuperExtraData")) {
				case "1":
						DocumentType.DocumentType = oResource.getText("S2ATTACHBOOKINGDOCTYPE");
						break;
				case "2":
						DocumentType.DocumentType = oResource.getText("S2ATTACHPOSTBOOKINGCHANGEORDERDOCTYPE");
						break;
				case "3":
						DocumentType.DocumentType = oResource.getText("S2ATTACHPOSTBOOKINGDOCTYPE");
						break;
				case "4":
						DocumentType.DocumentType = oResource.getText("S2ICONTABCARMKEY");
						break;
			}
			sap.ui.getCore().setModel(this.getJSONModel(DocumentType));
			this.getRouter().navTo(oResource.getText("S2DISOPPROUT"), {});
			var oControllerS3 = sap.ui.getCore().byId(oResource.getText("S1VWToS3")).getController();
			oControllerS3.loadData(DocumentType);
		},
		/**
		 * This method Handles Upload dialog Ok Button Event.
		 * 
		 * @name onFragmentUpload
		 * @param evt - Event Handler
		 * @returns 
		 */
		onFragmentUpload: function(evt) {
			sap.ui.core.BusyIndicator.show();
			Date.prototype.yyyymmdd = function() {
				var mm = this.getMonth() + 1;
				var dd = this.getDate();
				return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
			};
			thisCntrlr.Custno = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().Custno;
			var docsubtype = evt.getSource().getParent().getParent().mAggregations.formElements[0].mAggregations.fields[
				0].getSelectedKey();
			var note = evt.getSource().getParent().getParent().mAggregations.formElements[1].mAggregations.fields[0]
				.getValue();
			var date = evt.getSource().getParent().getParent().mAggregations.formElements[2].mAggregations.fields[0]
				.getDateValue();
			if (date === null) {
				date = thisCntrlr.bundle.getText("S2ATTACHPSRCBDATESTRNGTEXT");
			} else {
				date = date.yyyymmdd();
			}
			var SLUG = thisCntrlr.itemguid.replace(/-/g, "").toUpperCase() + "$$" + thisCntrlr.DocType + "$$" + docsubtype + "$$ $$" +                                    //PCR035760++ Defect#131 TechUpgrade changes
				date + "$$" + thisCntrlr.Custno + "$$" + evt.mParameters.newValue + "$$" + (note === " " ? " " : note);
			var file = evt.oSource.oFileUpload.files[0];
			if (!window.location.origin) {
				window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location
					.port ? ':' + window.location.port : '');
			}
			this.oFileUploader = evt.getSource();
			this.oFileUploader.setSendXHR(true);
			this.oFileUploader.removeAllHeaderParameters();
			var sBaseUrl = window.location.origin;
			var model = new sap.ui.model.odata.ODataModel(sBaseUrl +
				com.amat.crm.opportunity.util.ServiceConfigConstants.getMyOpportunityInfoURL + 
				com.amat.crm.opportunity.util.ServiceConfigConstants.AttachmentSet, true);
			var sToken = model.getHeaders()['x-csrf-token'];
			model.refreshSecurityToken(function(e, o) {
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
			this.dialog.close();
			this.destroyDialog();
		},
		/**
		 * This method Handles Evidence File Upload Event.
		 * 
		 * @name handleEvidenceUploadComplete
		 * @param evt - Event Handler
		 * @returns 
		 */
		handleEvidenceUploadComplete: function(evt) {
			sap.ui.core.BusyIndicator.show();
			var docType = evt.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT"))[
				evt.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT")).length - 1];
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
				.getText("S2ICONTABPSRSDAKEY")) {
				var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
				thisCntrlr.Custno = PSRData.Custno;
				if (docType === com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EVIDENCE_Btn) {
					docType = PSRData.NAV_BSDA_EVDOC.DocType;
					var docsubtype = PSRData.NAV_BSDA_EVDOC.DocSubtype;
				} else {
					docType = PSRData.NAV_SSDA_EVDOC.DocType;
					var docsubtype = PSRData.NAV_SSDA_EVDOC.DocSubtype;
				}
				var guid = PSRData.ItemGuid.replace(/-/g, "");
			} else {
				var PDCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData();
				thisCntrlr.Custno = PDCData.Custno;
				if (docType === com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EVIDENCE_Btn) {
					docType = PDCData.NAV_PDCBSDA_EVDOC.DocType;
					var docsubtype = PDCData.NAV_PDCBSDA_EVDOC.DocSubtype;
				} else {
					docType = PDCData.NAV_PDCSSDA_EVDOC.DocType;
					var docsubtype = PDCData.NAV_PDCSSDA_EVDOC.DocSubtype;
				}
				var guid = PDCData.ItemGuid.replace(/-/g, "");
			}
			var uploadButton = evt.getSource();
			var date = " ";
			var note = " ";
			var SLUG = guid.toUpperCase() + "$$" + docType + "$$" + docsubtype + "$$ $$" + date + "$$" + thisCntrlr.Custno + "$$" +                                     //PCR035760++ Defect#131 TechUpgrade changes
				evt.mParameters.newValue + "$$" + (note === " " ? " " : note);
			var file = evt.oSource.oFileUpload.files[0];
			this.oFileUploader = evt.getSource();
			this.oFileUploader.setSendXHR(true);
			this.oFileUploader.removeAllHeaderParameters();
			var sToken = this.oMyOppModel._oDataModel.getHeaders()['x-csrf-token'];
			this.oMyOppModel._oDataModel.refreshSecurityToken(function(e, o) {
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
		},
		/**
		 * This method is used to Handle PSR-SDA Save Button Event.
		 * 
		 * @name onPSRSDADataSave
		 * @param 
		 * @returns 
		 */
		onPSRSDADataSave: function() {
			var oResource = thisCntrlr.bundle;
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource
				.getText("S2ICONTABPSRSDAKEY")) {
				var obj = this.PSRSDAPayload(thisCntrlr.getModelFromCore(oResource.getText("GLBPSRMODEL"))
					.getData().PsrStatus, oResource.getText("S2PSRSDASAVETXT"), oResource
					.getText("S2PSRSDASUBFORAPP"));
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, oResource.getText("S2PSRSDADATASAVETXT"));
			} else {
				var obj = this.PDCSDAPayload(thisCntrlr.getModelFromCore(oResource.getText(
					"GLBPDCSDAMODEL")).getData().PsrStatus, oResource.getText("S2PSRSDASAVETXT"), "");
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, "");
			}
			var OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));
			that_psrsda.getController().getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
		},
		/** Keep
		 * This method Handles On Upload Complete Event.
		 * 
		 * @name onEvidenceUploadComplete
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onEvidenceUploadComplete: function(oEvent) {
			if (oEvent.getParameters().status === 201) {
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
					.getText("S2ICONTABPSRSDAKEY")) {
					thisCntrlr.onPSRSDADataSave();
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITICON"));
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITBTNTXT"));
					thisCntrlr.onEditPSRSDA();
				} else {
					var obj = this.PDCSDAPayload(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
							"GLBPDCSDAMODEL")).getData().PsrStatus, thisCntrlr.bundle.getText("S2PSRSDASAVETXT"),
						"");
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText(
							"S2PSRSSDACBCVALIDSAVEMSG"));
					thisCntrlr.getPDCData();
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITICON"));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITBTNTXT"));
					thisCntrlr.onEditPDCSDA();
				}
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCATTDOCUPLDSUCSSMSG"));
			} else if (oEvent.getParameters().status === 400) {
				thisCntrlr.onPSRSDADataSave();
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
					.getText("S2ICONTABPSRSDAKEY")) {
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITICON"));
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITBTNTXT"));
					thisCntrlr.onEditPSRSDA();
				} else {
					thisCntrlr.getPDCData();
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITICON"));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITBTNTXT"));
					thisCntrlr.onEditPDCSDA();
				}
				thisCntrlr.showToastMessage($(oEvent.mParameters.responseRaw).find(thisCntrlr.getResourceBundle().getText(
					"S2CBCPSRCARMTYPEMESG")).text());
			}
			sap.ui.core.BusyIndicator.hide();
		},
		/** Keep
		 * This method Handles On Upload Complete Event.
		 * 
		 * @name onPDCEvidenceUploadComplete
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onPDCEvidenceUploadComplete: function(oEvent) {
			thisCntrlr.onPSRSDADataSave();
			if (oEvent.getParameters().status === 201) {
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCATTDOCUPLDSUCSSMSG"));
				thisCntrlr.getPDCData();
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
					.getText("S2PSRSDAEDITICON"));
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
					.getText("S2PSRSDAEDITBTNTXT"));
				thisCntrlr.onEditPDCSDA();
			} else if (oEvent.getParameters().status === 400) {
				thisCntrlr.showToastMessage($(oEvent.mParameters.responseRaw).find(thisCntrlr.getResourceBundle().getText(
					"S2CBCPSRCARMTYPEMESG")).text());
				thisCntrlr.getPDCData();
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
					.getText("S2PSRSDAEDITICON"));
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
					.getText("S2PSRSDAEDITBTNTXT"));
				thisCntrlr.onEditPDCSDA();
			}
			sap.ui.core.BusyIndicator.hide();
		},
		/** Keep
		 * This method Handles On Delete Contact Event.
		 * 
		 * @name onDelete
		 * @param evt - Event Handler
		 * @returns 
		 */
		onDelete: function(evt) {
			oCommonController.commonDelete(evt, thisCntrlr);
		},
		/**
		 * This Method Handles RBM tab Press Event in LookUp List fragment.
		 * 
		 * @name onRBMPress
		 * @param 
		 * @returns 
		 */
		onRBMPress: function() {
			if (sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGICONTAB).getSelectedKey() === thisCntrlr.bundle
				.getText("FRAGRBMKEY")) {
				var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
//				var kpu = GenInfoData.Kpu;                                                                                    //PCR018375--
				var kpu = GenInfoData.ProductLine;                                                                            //PCR018375++
				var pbg = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData()
					.Bu;
				var GA = GenInfoData.GlobalAccount;
				this.oMyOppModel._oDataModel.read("/LookUpSet?$filter=Pbg eq '" + pbg + "' and Kpu eq '" + kpu + "'and ContactType eq '" +
					GA + "'", null, null, false,
					function(oData, oResponse) {
						thisCntrlr.rbmData = thisCntrlr.groupBy(oData.results, thisCntrlr.bundle.getText("S2CONCTTYPEPROPTEXT"));
					},
					function(err) {});
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGRBMTABLE).setModel(this.getJSONModel({
					"ItemSet": thisCntrlr.rbmData.RBM
				}));
			}
		},
		/**                    
		 * This Method Handles Look-Up Dialog Ok Button Press Event.
		 * 
		 * @name onOkPress
		 * @param 
		 * @returns 
		 */
		onOkPress: function() {
			this.lookUpList.close();
			this.lookUpList.destroy(true);
		},
		/**
		 * This Method Handles Look-Up Dialog Cancel Button Press Event.
		 * 
		 * @name onCancelPress
		 * @param 
		 * @returns 
		 */
		onCancelPress: function() {
			this.lookUpList.close();
			this.lookUpList.destroy(true);
		},
		/**
		 * This Method Handles Reference Opportunity Dialog Text Area Live Change Event.
		 * 
		 * @name onRefOppChange
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onRefOppChange: function(oEvent) {
			oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getButtons()[0].setEnabled(
				false);
			if (oEvent.getParameters().value.length <= 10) {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
				oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getButtons()[0].setEnabled(
					true);
			} else {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			}
		},
		/**
		 * This Method Handles Reference Opportunity Dialog Ok Button Press Event.
		 * 
		 * @name onRefOkPress
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onRefOkPress: function(oEvent) {
			var SelectedOppId = oEvent.getSource().getParent().getContent()[0].getContent()[1].getValue();
			var PDCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData();
			var oView = thisCntrlr.getView();
			this.closeDialog();
			if (SelectedOppId !== "") {
				PDCData.RevOppId = SelectedOppId;
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setValue(SelectedOppId);
				PDCData.RevOppId = SelectedOppId;
				(oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle
					.getText("S2PSRSDAEDITBTNTXT")) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST)
					.setEnabled(true)) : ((oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() ===
					thisCntrlr.bundle.getText("S2PSRSDACANBTNTXT")) ? (oView.byId(com.amat.crm.opportunity
					.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(false)) : (""));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLIST_BOX).setVisible(false);
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2REFOPPSLCTSUCSSMSG"));
				var FPSRDocData = PDCData.NAV_REV_DOCS.results;
				var FPSRDoc = thisCntrlr.loadFPSRevDocData(FPSRDocData, true, true);
				var oFPSRDocJModel = this.getJSONModel({
					"ItemSet": FPSRDoc
				});
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE).setModel(
					oFPSRDocJModel);
				thisCntrlr.setTableNoteEnable(oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
					false);
			}
		},
		/**
		 * This method Handles Final Spec Data Load Method.
		 * 
		 * @name loadFPSRevDocData
		 * @param FPSRevDocData: Final Spec Table Data, Enableflag- Browse Button Flag, Enabledelflag- Delete Button Flag
		 * @returns 
		 */
		loadFPSRevDocData: function(FPSRevDocData, Enableflag, Enabledelflag, addupVisible) {
			var FPSRDoc = [];
			for (var i = 0; i < FPSRevDocData.length; i++) {
				var doc = {
					"Guid": "",
					"DocId": "",
					"itemguid": "",
					"doctype": "",
					"docsubtype": "",
					"DocDesc": "",
					"filename": "",
					"OriginalFname": "",
					"note": "",
					"uBvisible": false,
					"bgVisible": false,
					"editable": true,
					"addupVisible": ""
				};
				doc.Guid = FPSRevDocData[i].Guid;
				doc.DocId = FPSRevDocData[i].DocId;
				doc.docsubtype = FPSRevDocData[i].DocSubtype;
				doc.itemguid = FPSRevDocData[i].ItemGuid;
				doc.DocDesc = FPSRevDocData[i].DocDesc;
				doc.doctype = FPSRevDocData[i].DocType;
				doc.filename = FPSRevDocData[i].FileName;
				doc.OriginalFname = FPSRevDocData[i].OriginalFname;
				doc.note = FPSRevDocData[i].Notes;
				doc.Enableflag = Enableflag;
				doc.addupVisible = addupVisible;
				doc.Enabledelflag = Enabledelflag;
				doc.uBvisible = FPSRevDocData[i].FileName === "" ? true : false;
				doc.bgVisible = !doc.uBvisible;
				doc.editable = FPSRevDocData[i].FileName === "" ? true : false;
				FPSRDoc.push(doc);
			}
			return FPSRDoc;
		},
		/**
		 * This method is used to SDA Questions Hide Logic.
		 * 
		 * @name setTableNoteEnable
		 * @param oTable - table object
		 * @returns 
		 *  
		 */
		setTableNoteEnable: function(oTable) {
			if (oTable.getModel().getData().ItemSet !== undefined) {
				for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {
					if (oTable.getModel().getData().ItemSet[i].Enableflag === true) {
						if (oTable.getModel().getData().ItemSet[i].uBvisible === true) {
							oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(true);
						} else {
							oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
						}
					} else {
						oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
					}
					oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[0].setIcon(
						thisCntrlr.bundle.getText("S2PSRSDAEDITICON"));
					oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[1].setIcon(
						thisCntrlr.bundle.getText("S2PSRSDADELETEICON"));
					oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[2].setVisible(
						true);
				}
			}
		},
		/** Keep
		 * This Method Handles Reference Opportunity Not in the List Button Press Event.
		 * 
		 * @name onPressNotInList
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onPressNotInList: function(oEvent) {
			var oView = thisCntrlr.getView();
			var oResource = thisCntrlr.bundle;
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource
				.getText("S2ICONTABPSRSDAKEY")) {
				if (oEvent.getSource().getText() === oResource.getText("S2PSRSDANTINLISTBTN")) {
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setText(oResource
						.getText("S2PSRSDACANBTNTXT"));
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setIcon(oResource
						.getText("S2CANCELBTNICON"));
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType
						.Reject);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE).setVisible(false);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
						false);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(
						false);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(true);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
						true);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
						false);
					this.dialog = sap.ui.xmlfragment(oResource.getText("PSRREFERENCEOPPSELCTDIALOG"),
						this);
					thisCntrlr.getCurrentView().addDependent(this.dialog);
					this.dialog.open();
					this.dialog.getContent()[0].getContent()[1].setValueState(sap.ui.core.ValueState.Error);
				} else {
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setText(oResource
						.getText("S2PSRSDANTINLISTBTN"));
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setIcon(oResource
						.getText("S2SUBMTFORAPPBTN"));
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType
						.Emphasized);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(
						false);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
						false);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(true);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
						true);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
				}
			} else {
				if (oEvent.getSource().getText() === oResource.getText("S2PSRSDANTINLISTBTN")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setText(oResource
						.getText("S2PSRSDACANBTNTXT"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setIcon(oResource
						.getText("S2CANCELBTNICON"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType
						.Reject);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setEnabled(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
						false);
					this.dialog = sap.ui.xmlfragment(oResource.getText("PSRREFERENCEOPPSELCTDIALOG"),
						this);
					thisCntrlr.getCurrentView().addDependent(this.dialog);
					this.dialog.open();
					this.dialog.getContent()[0].getContent()[1].setValueState(sap.ui.core.ValueState.Error);
				} else {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setText(oResource
						.getText("S2PSRSDANTINLISTBTN"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setIcon(oResource
						.getText("S2SUBMTFORAPPBTN"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType
						.Emphasized);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(false);
				}
			}
		},
		/**
		 * This method Handles Close and Destroy Dialog.
		 * 
		 * @name closeDialog
		 * @param 
		 * @returns 
		 */
		closeDialog: function() {
			this.dialog.close();
			this.dialog.destroy();
		},
		/**
		 * This Method Handles Reference Opprtunity Dialog Close Event.
		 * 
		 * @name onRefcloseDialog
		 * @param 
		 * @returns 
		 */
		onRefcloseDialog: function() {
			this.dialog.close();
			this.dialog.destroy();
			var oView = thisCntrlr.getView();
			var oResource = thisCntrlr.bundle;
			if (oView.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource.getText(
					"S2ICONTABPSRSDAKEY")) {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setText(oResource
					.getText("S2PSRSDANTINLISTBTN"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setIcon(oResource
					.getText("S2SUBMTFORAPPBTN"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType.Emphasized);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
			} else {
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setText(oResource
					.getText("S2PSRSDANTINLISTBTN"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setIcon(oResource
					.getText("S2SUBMTFORAPPBTN"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType.Emphasized);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(false);
			}
		},
		/**
		 * This Method is use to check  PDC initiation  .
		 * 
		 * @name checkPDCInitiate
		 * @param 
		 * @returns 
		 */
		checkPDCInitiate: function() {
			this.getPDCData();
			var oView = thisCntrlr.getView();
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp).setSelectedIndex(-1);
			var LookUpBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LOOKUP_LISTBtn);
			var EditBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn);
			var SaveBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn);
			var SFAPRBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn);
			thisCntrlr.PDCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData();
			this.setPDCVisibility(thisCntrlr.PDCData.PsrRequired);
			if (parseInt(thisCntrlr.PDCData.PsrStatus) >= 640 && parseInt(thisCntrlr.PDCData.PsrStatus) <= 650) {
				EditBtn.setVisible(true);
				LookUpBtn.setVisible(true);
				SaveBtn.setVisible(false);
				SFAPRBtn.setVisible(false);
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(true);
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(true);
			} else if (parseInt(thisCntrlr.PDCData.PsrStatus) === 655 || parseInt(thisCntrlr.PDCData.PsrStatus) === 605) {
				SFAPRBtn.setVisible(true);
				SFAPRBtn.setEnabled(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setEnabled(
					true);
				if (parseInt(thisCntrlr.PDCData.PsrStatus) === 605) {
					SFAPRBtn.setText(thisCntrlr.bundle.getText("S2PSRSDASFCANINITXT"));
				} else {
//					SFAPRBtn.setText(thisCntrlr.bundle.getText("S2PSRSDASFSSDAINITTXT"));                                                                               //PCR019492--
					var initSSDATxt = thisCntrlr.PDCData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? thisCntrlr.getResourceBundle().getText(           //PCR019492++
							"S2PSRDCINITRRABTNTXTASC606"):thisCntrlr.getResourceBundle().getText("S2PSRSDASFSSDAINITTXT");                                              //PCR019492++
					SFAPRBtn.setText(initSSDATxt);                                                                                                                      //PCR019492++
				} 
			}
			(parseInt(thisCntrlr.PDCData.PsrStatus) === 650 || parseInt(thisCntrlr.PDCData.PsrStatus) === 682 || parseInt(thisCntrlr.PDCData.PsrStatus) ===
				665) ? (EditBtn.setVisible(true), SaveBtn.setVisible(true), SaveBtn.setEnabled(false)) : ("");
			(parseInt(thisCntrlr.PDCData.PsrStatus) === 670 || parseInt(thisCntrlr.PDCData.PsrStatus) === 675 || parseInt(thisCntrlr.PDCData.PsrStatus) ===
				680) ? (EditBtn.setVisible(true), EditBtn.setEnabled(true), EditBtn.setText(thisCntrlr.getResourceBundle().getText(
				"S2PSRSDAEDITBTNTXT")), EditBtn.setIcon(thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"))) : ("");
			that_views2.getController().setIconTabFilterColor();
			//************************Start Of PCR019492: ASC606 UI Changes**************			
			var GenInfoData = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData();
			if(thisCntrlr.PDCData.Asc606_BsdaFlag === ""){
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setHeaderText(thisCntrlr.bundle.getText("S2PSRSDABOOKINGSDAASSE"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_BSDAMTLVL).setText(thisCntrlr.bundle.getText("S2PSRSDASDAASSES"));
			} else if(thisCntrlr.PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				var OppGenInfoModel = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setHeaderText(thisCntrlr.bundle.getText("S2PSRSDABOOKINGSDAASSEASC606"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_BSDAMTLVL).setText(thisCntrlr.bundle.getText("S2PSRSDASDAASSES606"));
				var RRAQuesData = thisCntrlr.getRRAQusData(thisCntrlr.PDCData.PsrStatus, thisCntrlr.PDCData.NAV_RRA_QA_PDC, GenInfoData.Region, false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
				thisCntrlr.PDCData.ConAnsFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELLBLTXT)
						.setVisible(true), oView.byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELRRAVAL).setVisible(true), oView.byId(com.amat.crm
						.opportunity.Ids.S2PDC_BMOSELRRAVAL).setText(thisCntrlr.PDCData.BmoRraValBsda)) : (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELLBLTXT)
						.setVisible(false), oView.byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELRRAVAL).setVisible(false));
				if (parseInt(thisCntrlr.PDCData.PsrStatus) >= 650){
					RRAQuesData.results[RRAQuesData.results.length-1].SelectionIndex > 0 ? (thisCntrlr.PDCData.BmoRraValBsda !== thisCntrlr.PDCData.Bsdl && thisCntrlr.PDCData.Bsdl !== "" ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE)
					  .setVisible(true), this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setValue(thisCntrlr.PDCData.ConComments), this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE)
					  .setTooltip(thisCntrlr.PDCData.ConComments), this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setEnabled(false)) : this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setVisible(false)):"";
				}
			}
			if(thisCntrlr.PDCData.Asc606_SsdaFlag  === ""){
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setHeaderText(thisCntrlr.bundle.getText("S2PSRSDASHIPPINGSDAASSES"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SSDAMTLVL).setText(thisCntrlr.bundle.getText("S2PSRSDASDAASSES"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setVisible(true);
			} else if(thisCntrlr.PDCData.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setHeaderText(thisCntrlr.bundle.getText("S2PSRSDASHIPPINGSDAASSESASC606"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SSDAMTLVL).setText(thisCntrlr.bundle.getText(thisCntrlr.bundle.getText("S2PSRSDASDAASSES606")));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setVisible(false);
			}
			thisCntrlr.PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") || thisCntrlr.PDCData.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ?
					(oView.byId(com.amat.crm.opportunity.Ids.S2PDC_CNGHISPNL).setVisible(true),oView.byId(com.amat.crm.opportunity.Ids.S2PDC_CNGHISTAB).setModel(
							this.getJSONModel(thisCntrlr.PDCData.NAV_CHANGE_HISTORY_PDC))) : oView.byId(com.amat.crm.opportunity.Ids.S2PDC_CNGHISPNL).setVisible(false);
			(parseInt(thisCntrlr.PDCData.PsrStatus) === 682 && thisCntrlr.PDCData.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? oView.byId(com.amat.crm.opportunity   //PCR019492++
					.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(true): oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false);                 //PCR019492++
			//************************Start Of PCR019492: 10257 : ASC606 UI Changes**************
		    if(thisCntrlr.PDCData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") && thisCntrlr.PDCData.PsrRequired === ""){
		    	 oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp).getButtons()[2].setText(thisCntrlr.bundle.getText("S2PSRDCSDANTAPPTXTASC606")); 
		    	 oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp).getParent().getItems()[0].getItems()[0].setText(thisCntrlr.bundle.getText("S2PDCRRAMADATDETRTXTASC606"));
				 that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setText(thisCntrlr.bundle.getText("S2PDCSDAICONTABFTEXTASC606"));
			}
		   //************************End Of PCR019492: 10257 : ASC606 UI Changes**************
		},
		/**
		 * This method is used to set RRA QusData.
		 * 
		 * @name getRRAQusData
		 * @param PsrStatus - current PSR Status, Qusdataset - RRA Qus Data, Region - Opp Region, enabled - enabled property
		 * @returns
		 */
		getRRAQusData: function(PsrStatus, Qusdataset, Region, enabled){
			var QusStatus = "Default", FinalQusSet = {"results":[]};
			for(var i=0; i < Qusdataset.results.length; i++){
				if(Qusdataset.results[i].SalesFlg !== ""){
					QusStatus = "Dependent";
					break;
				}
			}
			if(QusStatus === "Default"){ 
				for(var i=0; i < Qusdataset.results.length; i++){
					Qusdataset.results[i].SelectionIndex = 0;
					Qusdataset.results[i].valueState = "Error";
					Qusdataset.results[i].enabled = enabled;
					if(Region === thisCntrlr.bundle.getText("S2OPPREGION")){
					   switch(i){
						 case 0:
						 case 1:
							 FinalQusSet.results.push(Qusdataset.results[i]);						
						}						
					} else {
						switch(i){
						case 0:
						case 1:
						case 4:
							FinalQusSet.results.push(Qusdataset.results[i]);						
						}
					}
				} 
			} else {
				for(var i=0; i < Qusdataset.results.length; i++){
					if(Qusdataset.results[i].SalesFlg === "Y"){Qusdataset.results[i].SelectionIndex = 1;Qusdataset.results[i].valueState = "None";
					}else if(Qusdataset.results[i].SalesFlg === "N"){Qusdataset.results[i].SelectionIndex = 2;Qusdataset.results[i].valueState = "None";
					}else if(Qusdataset.results[i].SalesFlg === ""){Qusdataset.results[i].SelectionIndex = 0;Qusdataset.results[i].valueState = "Error";}
					PsrStatus !== "650" ? Qusdataset.results[i].enabled = enabled : Qusdataset.results[i].enabled = false;
					if(Region !== thisCntrlr.bundle.getText("S2OPPREGION")){
						switch(i){
						case 0: 
						case 1:
							FinalQusSet.results.push(Qusdataset.results[i]);break;
						case 2: Qusdataset.results[1].SalesFlg === "N" ? FinalQusSet.results.push(Qusdataset.results[i]) : "";break;
						case 3: Qusdataset.results[1].SalesFlg === "N" && Qusdataset.results[2].SalesFlg === "Y" ? FinalQusSet.results.push(Qusdataset.results[i]) : "";break;
						case 4:
							FinalQusSet.results.push(Qusdataset.results[i]);break;
						case 5: parseInt(PsrStatus) >= 650 ? (Qusdataset.results[i].enabled = (enabled === true ? true : false), FinalQusSet.results.push(Qusdataset.results[i])) : "";break;
						}			
					} else {
						switch(i){
						case 0:
						case 1:
							FinalQusSet.results.push(Qusdataset.results[i]);break;
						case 2: Qusdataset.results[1].SalesFlg === "N" ? FinalQusSet.results.push(Qusdataset.results[i]) : "";break;
						case 3: Qusdataset.results[1].SalesFlg === "N" && Qusdataset.results[2].SalesFlg === "N" ? FinalQusSet.results.push(Qusdataset.results[i]) : "";break;
						case 4: Qusdataset.results[1].SalesFlg === "N" && Qusdataset.results[2].SalesFlg === "N" && Qusdataset.results[3].SalesFlg === "Y" ? FinalQusSet.results.push(Qusdataset.results[i]) : "";break;
						case 5:
							Qusdataset.results[1].SalesFlg === "N" ? FinalQusSet.results.push(Qusdataset.results[i]) : "";break;
						case 6: parseInt(PsrStatus) >= 650 ? (Qusdataset.results[i].enabled = (enabled === true ? true : false), FinalQusSet.results.push(Qusdataset.results[i])) : "";break;
						}
					}
				}
			}
			return FinalQusSet;
		},
		/**
		 * This method is used to handles RRA Question Answer.
		 * 
		 * @name onRRAQuesSelection
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onRRAQuesSelection: function(oEvent) {
			var oppQuesdata = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData();
			var changeLine = oEvent.getSource().getParent().getBindingContext().getPath().slice(-1);
			var QuesNo = oEvent.getSource().getParent().getBindingContext().getModel().getData().results[parseInt(changeLine)];
			var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			var RRALevelVal = "", SDAAssesItem, rraDeterFlag = false, Region = GenInfoData.Region, Qusdataset = oppQuesdata.NAV_RRA_QA_PDC;
			if(QuesNo.SelectionIndex === 1){QuesNo.SalesFlg = "Y"}
			else if(QuesNo.SelectionIndex === 2){QuesNo.SalesFlg = "N"}
			else{QuesNo.SalesFlg = ""}
			var RRAQuesData = thisCntrlr.getRRAQusData(oppQuesdata.PsrStatus, Qusdataset, Region, true);			
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
			for(var p = 0; p < RRAQuesData.results.length; p++){
				if(RRAQuesData.results[p].valueState === "Error"){
					rraDeterFlag = true;
				}
			}
			if(rraDeterFlag === false){
				if(Region === thisCntrlr.bundle.getText("S2OPPREGION") && Qusdataset.results[1].SalesFlg === "Y"){
					RRALevelVal = "AMJD";
					var SDAAssesItem = {
							"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" }, 
							                       {"ProductId": "SHPOD", "Name": "SHPOD"}, 
							                       {"ProductId": "CAR", "Name": "CAR"},
							                       {"ProductId": "DEFER", "Name": "DEFER"},
							                       {"ProductId": "AMJD", "Name": "AMJD"}]};
				} else {
					if(Region !== thisCntrlr.bundle.getText("S2OPPREGION")){
						if(Qusdataset.results[0].SalesFlg === "Y" && Qusdataset.results[1].SalesFlg === "N" && Qusdataset.results[2].SalesFlg === "N"
							&& Qusdataset.results[4].SalesFlg === "N"){
							RRALevelVal = "SHPOD";
						} else if((Qusdataset.results[0].SalesFlg === "Y" && Qusdataset.results[1].SalesFlg === "N" && Qusdataset.results[2].SalesFlg === "Y" && 
								Qusdataset.results[3].SalesFlg === "Y" && Qusdataset.results[4].SalesFlg === "N") || (Qusdataset.results[0].SalesFlg === "Y" && 
								Qusdataset.results[1].SalesFlg === "Y" && Qusdataset.results[4].SalesFlg === "N")){
							RRALevelVal = "CAR";
						} else {
							RRALevelVal = "DEFER";
						}
						var SDAAssesItem = {"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level"},
						                                           {"ProductId": "SHPOD", "Name": "SHPOD"}, 
						                                           {"ProductId": "CAR","Name": "CAR"},
						                                           {"ProductId": "DEFER", "Name": "DEFER"}]};
					}else {
						if(Qusdataset.results[1].SalesFlg === "N"){
							if(Qusdataset.results[0].SalesFlg === "Y" && Qusdataset.results[2].SalesFlg === "N" && Qusdataset.results[3].SalesFlg === "N"
								&& Qusdataset.results[5].SalesFlg === "N"){
								RRALevelVal = "SHPOD";
							} else if((Qusdataset.results[0].SalesFlg === "Y" && Qusdataset.results[2].SalesFlg === "N" && Qusdataset.results[3].SalesFlg === "Y" && 
									Qusdataset.results[4].SalesFlg === "Y" && Qusdataset.results[5].SalesFlg === "N") || (Qusdataset.results[0].SalesFlg === "Y" && 
									Qusdataset.results[2].SalesFlg === "Y" && Qusdataset.results[5].SalesFlg === "N")){
								RRALevelVal = "CAR";
							} else {
								RRALevelVal = "DEFER";
							}
							var SDAAssesItem = {
									"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" }, 
									                       {"ProductId": "SHPOD", "Name": "SHPOD"}, 
									                       {"ProductId": "CAR", "Name": "CAR"},
									                       {"ProductId": "DEFER", "Name": "DEFER"},
									                       {"ProductId": "AMJD", "Name": "AMJD"}]};
						}					
					}
				}
				var oModel1 = this.getJSONModel(SDAAssesItem);
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setModel(oModel1);
			}
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(RRALevelVal);
			if(parseInt(oppQuesdata.PsrStatus) === 650){
				RRAQuesData.results[RRAQuesData.results.length-1].SelectionIndex > 0 ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELLBLTXT)
				  .setVisible(true), this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELRRAVAL).setVisible(true), this.getView().byId(com.amat.crm
				  .opportunity.Ids.S2PDC_BMOSELRRAVAL).setText(oppQuesdata.BmoRraValBsda)) : (this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELLBLTXT)
				  .setVisible(false), this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELRRAVAL).setVisible(false));	
				RRAQuesData.results[RRAQuesData.results.length-1].SelectionIndex > 0 ? (oppQuesdata.BmoRraValBsda !== RRALevelVal  && oppQuesdata.Bsdl !== ""? (this.getView()
				  .byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setVisible(true), this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setValue(oppQuesdata
				  .ConComments), this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setTooltip(oppQuesdata.ConComments)) : this.getView().byId(com.amat.crm
				  .opportunity.Ids.S2PDC_RRADEFFNOTE).setVisible(false)) : "";
			}
		},
		/**
		 * This method is used to handles RRA question comment length.
		 * 
		 * @name handlePDCRRANoteLiveChange
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		handlePDCRRANoteLiveChange: function(oEvent){
			if (oEvent.getParameters().value.length >= 255) {
				var RRAComTxt = oEvent.getParameters().value.substr(0, 254);
				oEvent.getSource().setValue(RRAComTxt);
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCMCOMMVALTXT"));
			}
		},
		//************************End Of PCR019492: ASC606 UI Changes****************
		/**
		 * This method is Validating BSDA Work-flow Approval Permission.
		 * 
		 * @name ValidatePSRAPr
		 * @param 
		 * @returns AprlFlag - Binary
		 */
		ValidatePSRAPr: function() {
			var AprlFlag = false;
			if (this.that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
				.getText("S2ICONTABPSRSDAKEY")) {
				if (parseInt(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().TaskId) !==
					0) {
					AprlFlag = true;
				}
			} else {
				if (parseInt(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().TaskId) !==
					0) {
					AprlFlag = true;
				}
			}
			return AprlFlag;
		},
		/** Keep
		 * This Method is use to check  PDC initiation.
		 * 
		 * @name onEditPDCSDA
		 * @param 
		 * @returns 
		 */
		onEditPDCSDA: function() {
			var ContactBtnArr = [com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ROM_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SALES_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_AcSME_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BMO_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GPM_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BUSME_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GSM_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RBM_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_PLHEAD_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CON_ADDBtn
			];

			var ContactLstArr = [com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ROM,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SALES_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ASME_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_POM_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BMO_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BUSME_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GSM_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RBM_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_PLHEAD_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CON_LIST,
			];
			var oResource = thisCntrlr.bundle;
			var SecurityData = thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();
			var GenInfoData = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();
			var PDCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
			var oView = thisCntrlr.getView();
			var addButtonVis = "",
				onDelAuth = "";
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setEnabled(false);
			var bmoUserList = GenInfoData.NAV_BMO_INFO.results;
			var bmoUserFlag = this.checkContact(bmoUserList);
			(SecurityData.AddContact === oResource.getText("S2ODATAPOSVAL")) ? (addButtonVis = true) : (addButtonVis = false);
			(SecurityData.DelContact === oResource.getText("S2ODATAPOSVAL")) ? (onDelAuth = true) : (onDelAuth = false);
			(onDelAuth = true) ? (delMode = oResource.getText("S2DELPOSVIZTEXT")) : (delMode = oResource.getText("S2DELNAGVIZTEXT"));
			for (var i = 0; i < ContactBtnArr.length; i++) {
				if (bmoUserFlag === true) {
					oView.byId(ContactBtnArr[i]).setEnabled(addButtonVis);
					oView.byId(ContactLstArr[i]).setMode(delMode);
				}
			}
			var ValidatePDC = this.ValidatePDC();
			if (ValidatePDC === false) {
				var EditBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn);
				(bmoUserFlag === false) ? (thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT")), this.PDCDisMode()) : ("");
				(EditBtn.getText() === oResource.getText("S2PSRSDAEDITBTNTXT") && bmoUserFlag === true) ? (EditBtn.setText(oResource.getText(
					"S2PSRSDACANBTNTXT")), EditBtn.setIcon(oResource.getText("S2CANCELBTNICON"))) : (EditBtn.setIcon(oResource.getText(
					"S2PSRSDAEDITICON")), EditBtn.setText(oResource.getText("S2CARMBTNEDIT")));
				if (EditBtn.getText() === oResource.getText("S2PSRSDAEDITBTNTXT")) {
					for (var i = 0; i < ContactBtnArr.length; i++) {
						oView.byId(ContactBtnArr[i]).setEnabled(false);
						oView.byId(ContactLstArr[i]).setMode(oResource.getText("S2DELNAGVIZTEXT"));
					}
				}
				var CustSpecRev1Data = PDCData.NAV_PDCCUST_REVSPEC.results;
				var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, false, false);
				var oCustSpecRev1JModel = this.getJSONModel({
					"ItemSet": CustSpecRev1
				});
				var oCustSpecRev1DocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE);
				oCustSpecRev1DocTable.setModel(oCustSpecRev1JModel);
				this.setTableNoteEnable(oCustSpecRev1DocTable);
				this.setTableSecurity(oCustSpecRev1DocTable);
				var EBSDAPDCData = thisCntrlr.PDCData.NAV_PDCBSDA_EVDOC.results;
				var EBSDAPDCDoc = this.loadFPSRevDocData(EBSDAPDCData, false, false, UpldFnlSpecVis);
				var oEBSDAPDCDocJModel = this.getJSONModel({
					"ItemSet": EBSDAPDCDoc
				});
				var oEBSDAPDCDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EVPDC_DOC_TABLE);
				oEBSDAPDCDocTable.setModel(oEBSDAPDCDocJModel);
				this.setTableNoteEnable(oEBSDAPDCDocTable);
				this.setTableSecurity(oEBSDAPDCDocTable);
				var ESSDAPDCData = thisCntrlr.PDCData.NAV_PDCSSDA_EVDOC.results;

				var EBSDAPDCDoc = this.loadFPSRevDocData(EBSDAPDCData, false, false, UpldFnlSpecVis);
				var oEBSDAPDCDocJModel = this.getJSONModel({
					"ItemSet": EBSDAPDCDoc
				});
				var oEBSDAPDCDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EVPDC_DOC_TABLE);
				oEBSDAPDCDocTable.setModel(oEBSDAPDCDocJModel);
				this.setTableNoteEnable(oEBSDAPDCDocTable);
				this.setTableSecurity(oEBSDAPDCDocTable);
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false);
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(false);
			} else {
				var ContCheck = this.checkPDCUsersfromlist();
				if (ContCheck === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCAUTHCHECKFAILMSG"));
				} else {
					var AprFlag = this.ValidatePSRAPr();
					if (AprFlag = false) {
						thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"))
					} else {
						var SafQaVis = "",
							SpecTypQaVis = "",
							SdaQaVis = "",
							UpldFnlSpecVis = "",
							UpldCustSpecVis = "",
							addButtonVis = "",
							onDelAuth = "",
							ssdaAuth = "",
							delMode = "";
						(SecurityData.UpldCustSpec === oResource.getText("S2ODATAPOSVAL")) ? (
							UpldCustSpecVis = true) : (UpldCustSpecVis = false);
						(SecurityData.UpldFnlSpec === oResource.getText("S2ODATAPOSVAL")) ? (
							UpldFnlSpecVis = true) : (UpldFnlSpecVis = false);
						(SecurityData.SafQa === oResource.getText("S2ODATAPOSVAL")) ? (SafQaVis = true) :
						(SafQaVis = false);
						(SecurityData.SpecTypQa === oResource.getText("S2ODATAPOSVAL")) ? (SpecTypQaVis =
							true) : (SpecTypQaVis = false);
						(SecurityData.SdaQa === oResource.getText("S2ODATAPOSVAL")) ? (SdaQaVis = true) :
						(SdaQaVis = false);
						(SecurityData.AddContact === oResource.getText("S2ODATAPOSVAL")) ? (addButtonVis =
							true) : (addButtonVis = false);
						(SecurityData.DelContact === oResource.getText("S2ODATAPOSVAL")) ? (onDelAuth =
							true) : (onDelAuth = false);
						(SecurityData.InitSsda === oResource.getText("S2ODATAPOSVAL")) ? (ssdaAuth = true) :
						(ssdaAuth = false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAF_RADIOBtn).setEnabled(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(false);
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false);
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setEnabled(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setEnabled(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).setEnabled(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setEnabled(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(
							false);
						//oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY).setEnabled(                                                       //PCR025717--
						//	false);                                                                                                                                //PCR025717--
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(
							false);
						var CustSpecRev1Data = PDCData.NAV_PDCCUST_REVSPEC.results;
						var FPSRDocData = PDCData.NAV_PDC_FNL_DOCS.results;
						var FinalQuesItems;
						var EBSDAPDCData = PDCData.NAV_PDCBSDA_EVDOC.results;
						var ESSDAPDCData = PDCData.NAV_PDCSSDA_EVDOC.results;
						var EBSDAPDCDoc = this.loadFPSRevDocData(EBSDAPDCData, false, false, UpldFnlSpecVis);
						var oEBSDAPDCDocJModel = this.getJSONModel({
							"ItemSet": EBSDAPDCDoc
						});
						var oEBSDAPDCDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EVPDC_DOC_TABLE);
						oEBSDAPDCDocTable.setModel(oEBSDAPDCDocJModel);
						this.setTableNoteEnable(oEBSDAPDCDocTable);
						this.setTableSecurity(oEBSDAPDCDocTable);
						var ESSDAPDCDoc = this.loadFPSRevDocData(ESSDAPDCData, false, false, UpldFnlSpecVis);
						var oESSDAPDCDocJModel = this.getJSONModel({
							"ItemSet": ESSDAPDCDoc
						});
						var oESSDAPDCDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SEVPDC_DOC_TABLE);
						oESSDAPDCDocTable.setModel(oESSDAPDCDocJModel);
						this.setTableNoteEnable(oESSDAPDCDocTable);
						this.setTableSecurity(oESSDAPDCDocTable);
						var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, false, false);
						var oCustSpecRev1JModel = this.getJSONModel({
							"ItemSet": CustSpecRev1
						});
						var oCustSpecRev1DocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE);
						oCustSpecRev1DocTable.setModel(oCustSpecRev1JModel);
						this.setTableNoteEnable(oCustSpecRev1DocTable);
						this.setTableSecurity(oCustSpecRev1DocTable);
						var RPSRDocData = PDCData.NAV_REV_DOCS.results;
						var RefSpecRev1 = this.loadFPSRevDocData(RPSRDocData, false, false);
						var oRPSRDocJModel = this.getJSONModel({
							"ItemSet": RefSpecRev1
						});
						var oRPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE);
						oRPSRDocTable.setModel(oRPSRDocJModel);
						this.setTableNoteEnable(oRPSRDocTable);
						//************************Start Of PCR019492: ASC606 UI Changes**************
					    if(PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
							var RRAQuesData = thisCntrlr.getRRAQusData(PDCData.PsrStatus, PDCData.NAV_RRA_QA_PDC, GenInfoData.Region, false);
							this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setEnabled(false);
						}
						//************************End Of PCR019492: ASC606 UI Changes**************
					    oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(false);                               //PCR021481++
						if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() === oResource
							.getText("S2PSRSDAEDITBTNTXT")) {
							that_views2.getController().setGenInfoVisibility();
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setEnabled(
								true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setEnabled(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(oResource
								.getText("S2CANCELBTNICON"));
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(oResource
								.getText("S2PSRSDACANBTNTXT"));
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(true);
							(onDelAuth = true) ? (delMode = oResource.getText("S2DELPOSVIZTEXT")) : (delMode =
								oResource.getText("S2DELNAGVIZTEXT"));
							for (var i = 0; i < ContactBtnArr.length; i++) {
								oView.byId(ContactBtnArr[i]).setEnabled(addButtonVis);
								oView.byId(ContactLstArr[i]).setMode(delMode);
							}
							if (parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) === 604) {
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAF_RADIOBtn).setEnabled(
									SafQaVis);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(
									true);
								RefSpecRev1 = this.loadFPSRevDocData(RPSRDocData, UpldCustSpecVis, true);
								var oRPSRDocJModel = this.getJSONModel({
									"ItemSet": RefSpecRev1
								});
								var oRPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE);
								oRPSRDocTable.setModel(oRPSRDocJModel);
								this.setTableNoteEnable(oRPSRDocTable);
								var EBSDAPDCDoc = this.loadFPSRevDocData(EBSDAPDCData, true, true, UpldFnlSpecVis);
								var oEBSDAPDCDocJModel = this.getJSONModel({
									"ItemSet": EBSDAPDCDoc
								});
								var oEBSDAPDCDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EVPDC_DOC_TABLE);
								oEBSDAPDCDocTable.setModel(oEBSDAPDCDocJModel);
								this.setTableNoteEnable(oEBSDAPDCDocTable);
								this.setTableSecurity(oEBSDAPDCDocTable);
								var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, UpldCustSpecVis, true);
								var oCustSpecRev1JModel = this.getJSONModel({
									"ItemSet": CustSpecRev1
								});
								var oCustSpecRev1DocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE);
								oCustSpecRev1DocTable.setModel(oCustSpecRev1JModel);
								this.setTableNoteEnable(oCustSpecRev1DocTable);
								this.setTableSecurity(oCustSpecRev1DocTable);
								if (PDCData.NAV_PDC_CC.results.length > 0) {
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_BOX).setVisible(
										false);
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(
										true);
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_BOX).setVisible(
										false);
									//oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                                    //PCR025717--
									//	false);                                                                                                                                 //PCR025717--
									//oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY).setEnabled(                                                        //PCR025717--
									//	true);                                                                                                                                  //PCR025717--
								} else {
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_BOX).setVisible(
										false);
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(
										true);
									//oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                                    //PCR025717--
									//	false);                                                                                                                                 //PCR025717--
								}
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(
									true);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(
									true);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setEnabled(
									true);
								if (PDCData.RevOppId !== "" && PDCData.RevOpitmId !== "") {
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(
										true);
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_UnLINKBtn).setEnabled(
										true);
								} else if (PDCData.RevOppId !== "" && PDCData.RevOpitmId === "") {
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST)
										.setEnabled(false);
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setEnabled(
										true);
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(true);                               //PCR021481++
								} else if (PDCData.RevOppId === "" && PDCData.RevOpitmId === "") {
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(
										true);
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setEnabled(
										true);
								}
								//************************Start Of PCR019492 : 10257 : ASC606 UI Changes**************
//								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(true);                                        //PCR019492--
								if(PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);
								} else {
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(true);
								}
								//************************End Of PCR019492 : 10257 : ASC606 UI Changes**************
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setEnabled(true);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(
									true);
								//************************Start Of PCR019492 : ASC606 UI Changes**************
								if(PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
									var RRAQuesData = thisCntrlr.getRRAQusData(PDCData.PsrStatus, PDCData.NAV_RRA_QA_PDC, GenInfoData.Region, true);
									this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setEnabled(false);
								}
								//************************End Of PCR019492 : ASC606 UI Changes**************
							} else if (parseInt(PDCData.PsrStatus) >= 640 && parseInt(PDCData.PsrStatus) < 655) {
								that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(true);
								that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(true);
								(parseInt(PDCData.TaskId) !== 0) ? (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(true),
									that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(true)) :
								(that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false), that_views2.byId(com.amat.crm.opportunity.Ids
									.S2FTER_BTN_RJCT).setEnabled(false));
								if (parseInt(PDCData.PsrStatus) === 640) {
									var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, UpldCustSpecVis, true);
									var oCustSpecRev1JModel = this.getJSONModel({
										"ItemSet": CustSpecRev1
									});
									var oCustSpecRev1DocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE);
									oCustSpecRev1DocTable.setModel(oCustSpecRev1JModel);
									this.setTableNoteEnable(oCustSpecRev1DocTable);
									this.setTableSecurity(oCustSpecRev1DocTable);
								}
								(parseInt(PDCData.PsrStatus) === 650 && PDCData.Asc606_BsdaFlag === "") ? (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX)               //PCR019492++
										.setEnabled(true)) :(oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setEnabled(false));
//								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(                                                                         //PCR019492--
//									false);                                                                                                                                                   //PCR019492--
								(parseInt(PDCData.PsrStatus) === 650 && PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? oView.byId(com.amat.crm.opportunity         //PCR019492++
										.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(true): oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false); //PCR019492++
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(
									false);
								//************************Start Of PCR019492: ASC606 UI Changes**************
								if(PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") && parseInt(PDCData.PsrStatus) === 650){
									var RRAQuesData = thisCntrlr.getRRAQusData(PDCData.PsrStatus, PDCData.NAV_RRA_QA_PDC, GenInfoData.Region, true);
									this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
									oView.byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setEnabled(true);
								}
								//************************End Of PCR019492: ASC606 UI Changes**************
							} else if (parseInt(PDCData.PsrStatus) > 665 && parseInt(PDCData.PsrStatus) <= 682) {
								that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(true);
								that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(true);
								(parseInt(PDCData.TaskId) !== 0) ? (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(true),
									that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(true)) :
								(that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false), that_views2.byId(com.amat.crm.opportunity.Ids
									.S2FTER_BTN_RJCT).setEnabled(false));
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
									false);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(
									false);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setEnabled(
									false);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(
									false);
//								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(                                                                                  //PCR019492--
//									false);                                                                                                                                                            //PCR019492++
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).setEnabled(
									false);
								(parseInt(PDCData.PsrStatus) === 682 && PDCData.Asc606_BsdaFlag === "") ? (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setEnabled(true)) :   //PCR019492++
								(oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setEnabled(false));
								(parseInt(PDCData.PsrStatus) === 682 && PDCData.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? oView.byId(com.amat.crm.opportunity                  //PCR019492++
										.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(true): oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false);          //PCR019492++
							} else if (parseInt(PDCData.PsrStatus) === 665) {
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(
									false);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
									false);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setEnabled(
									false);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).setEnabled(
									false);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(
									true);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setEnabled(
									true);
								var ESSDAPDCDoc = this.loadFPSRevDocData(ESSDAPDCData, true, true, UpldFnlSpecVis);
								var oESSDAPDCDocJModel = this.getJSONModel({
									"ItemSet": ESSDAPDCDoc
								});
								var oESSDAPDCDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SEVPDC_DOC_TABLE);
								oESSDAPDCDocTable.setModel(oESSDAPDCDocJModel);
								this.setTableNoteEnable(oESSDAPDCDocTable);
								this.setTableSecurity(oESSDAPDCDocTable);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).setEnabled(
									true);
							} else if (parseInt(PDCData.PsrStatus) === 660) {
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setEnabled(
									true);
							} else if (parseInt(PDCData.PsrStatus) === 655) {
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
									true);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setEnabled(
									true);
							}
						} else {
							//************************Start Of PCR019492: ASC606 UI Changes**************
							if(PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
								var RRAQuesData = thisCntrlr.getRRAQusData(PDCData.PsrStatus, PDCData.NAV_RRA_QA_PDC, GenInfoData.Region, false);
								this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setEnabled(false);
							}
							//************************End Of PCR019492: ASC606 UI Changes**************
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setEnabled(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(oResource
								.getText("S2PSRSDAEDITICON"));
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(oResource
								.getText("S2CARMBTNEDIT"));
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(false);
							for (var i = 0; i < ContactBtnArr.length; i++) {
								oView.byId(ContactBtnArr[i]).setEnabled(false);
								oView.byId(ContactLstArr[i]).setMode(oResource.getText("S2DELNAGVIZTEXT"));
							}
							var EBSDAPDCDoc = this.loadFPSRevDocData(EBSDAPDCData, false, false, UpldFnlSpecVis);
							var oEBSDAPDCDocJModel = this.getJSONModel({
								"ItemSet": EBSDAPDCDoc
							});
							var oEBSDAPDCDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EVPDC_DOC_TABLE);
							oEBSDAPDCDocTable.setModel(oEBSDAPDCDocJModel);
							this.setTableNoteEnable(oEBSDAPDCDocTable);
							this.setTableSecurity(oEBSDAPDCDocTable);
							var ESSDAPDCDoc = this.loadFPSRevDocData(ESSDAPDCData, false, false, UpldFnlSpecVis);
							var oESSDAPDCDocJModel = this.getJSONModel({
								"ItemSet": ESSDAPDCDoc
							});
							var oESSDAPDCDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SEVPDC_DOC_TABLE);
							oESSDAPDCDocTable.setModel(oESSDAPDCDocJModel);
							this.setTableNoteEnable(oESSDAPDCDocTable);
							this.setTableSecurity(oESSDAPDCDocTable);
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(
								false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setEnabled(false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).setEnabled(
								false);
							var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, false, false);
							if (PDCData.NAV_PDC_CC.results.length > 0) {
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_BOX).setVisible(
									false);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(
									false);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_BOX).setVisible(
									false);
								//oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                                        //PCR025717--
								//	false);                                                                                                                                     //PCR025717--
								//oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY).setEnabled(                                                            //PCR025717--
								//	false);                                                                                                                                     //PCR025717--
							} else {
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_BOX).setVisible(
									false);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(
									false);
								//oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                                        //PCR025717--
								//	false);                                                                                                                                     //PCR025717--
							}
							var oCustSpecRev1JModel = this.getJSONModel({
								"ItemSet": CustSpecRev1
							});
							var oCustSpecRev1DocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE);
							oCustSpecRev1DocTable.setModel(oCustSpecRev1JModel);
							(parseInt(PDCData.PsrStatus) ===
								655 || parseInt(PDCData.PsrStatus) === 660) ? (oView.byId(com.amat.crm.opportunity
								.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setEnabled(true)) : ("");
							var RefSpecRev1 = this.loadFPSRevDocData(RPSRDocData, false, false);
							var oRPSRDocJModel = this.getJSONModel({
								"ItemSet": RefSpecRev1
							});
							var oRPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE);
							oRPSRDocTable.setModel(oRPSRDocJModel);
						}
					}
				}
			}
		},
		/**
		 * This Method is use to convert PDC in Cancel mode.
		 * 
		 * @name PDCDisMode
		 * @param 
		 * @returns 
		 */
		PDCDisMode: function() {
			var ContactBtnArr = [com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ROM_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SALES_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_AcSME_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BMO_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GPM_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BUSME_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GSM_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RBM_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_PLHEAD_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CON_ADDBtn
			];
			var ContactLstArr = [com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ROM,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SALES_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ASME_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_POM_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BMO_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BUSME_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GSM_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RBM_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_PLHEAD_LIST,
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CON_LIST,
			];
			var oResource = thisCntrlr.bundle;
			var PDCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
			var oView = thisCntrlr.getView();
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setEnabled(true);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(oResource
				.getText("S2PSRSDAEDITICON"));
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(oResource
				.getText("S2CARMBTNEDIT"));
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(false);
			for (var i = 0; i < ContactBtnArr.length; i++) {
				oView.byId(ContactBtnArr[i]).setEnabled(false);
				oView.byId(ContactLstArr[i]).setMode(oResource.getText("S2DELNAGVIZTEXT"));
			}
			var EBSDAPDCData = PDCData.NAV_PDCBSDA_EVDOC.results;
			var ESSDAPDCData = PDCData.NAV_PDCSSDA_EVDOC.results;
			var EBSDAPDCDoc = this.loadFPSRevDocData(EBSDAPDCData, false, false, false);
			var oEBSDAPDCDocJModel = this.getJSONModel({
				"ItemSet": EBSDAPDCDoc
			});
			var oEBSDAPDCDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EVPDC_DOC_TABLE);
			oEBSDAPDCDocTable.setModel(oEBSDAPDCDocJModel);
			this.setTableNoteEnable(oEBSDAPDCDocTable);
			this.setTableSecurity(oEBSDAPDCDocTable);
			var ESSDAPDCDoc = this.loadFPSRevDocData(ESSDAPDCData, false, false, false);
			var oESSDAPDCDocJModel = this.getJSONModel({
				"ItemSet": ESSDAPDCDoc
			});
			var oESSDAPDCDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SEVPDC_DOC_TABLE);
			oESSDAPDCDocTable.setModel(oESSDAPDCDocJModel);
			this.setTableNoteEnable(oESSDAPDCDocTable);
			this.setTableSecurity(oESSDAPDCDocTable);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAF_RADIOBtn).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(false);
			//oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY).setEnabled(false);                                                             //PCR025717--
			if (PDCData.NAV_PDC_CC.results.length > 0) {
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_BOX).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_BOX).setVisible(
					false);
				//oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                                            //PCR025717--
				//	false);                                                                                                                                         //PCR025717--
				//oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY).setEnabled(false);                                                         //PCR025717--
			} else {
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_BOX).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(false);
				//oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                                            //PCR025717--
				//	false);                                                                                                                                         //PCR025717--
			}
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).setEnabled(false);
			var CustSpecRev1Data = PDCData.NAV_PDCCUST_REVSPEC.results;
			var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, false, false);
			var oCustSpecRev1JModel = this.getJSONModel({
				"ItemSet": CustSpecRev1
			});
			var oCustSpecRev1DocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE);
			oCustSpecRev1DocTable.setModel(oCustSpecRev1JModel);
			(parseInt(PDCData.PsrStatus) ===
				655 || parseInt(PDCData.PsrStatus) ===
				660) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA)
				.setEnabled(true)) : ("");
			var RPSRDocData = PDCData.NAV_REV_DOCS.results;
			var RefSpecRev1 = this.loadFPSRevDocData(RPSRDocData, false, false);
			var oRPSRDocJModel = this.getJSONModel({
				"ItemSet": RefSpecRev1
			});
			var oRPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE);
			oRPSRDocTable.setModel(oRPSRDocJModel);			
			var CustSpecRev1Data = PDCData.NAV_PDCCUST_REVSPEC.results;                                                                                     //PCR019492++
			var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, false, false);                                                                      //PCR019492++
			var oCustSpecRev1JModel = this.getJSONModel({                                                                                                   //PCR019492++
				"ItemSet": CustSpecRev1                                                                                                                     //PCR019492++
			});                                                                                                                                             //PCR019492++
			var oCustSpecRev1DocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE);                                        //PCR019492++
			oCustSpecRev1DocTable.setModel(oCustSpecRev1JModel);                                                                                            //PCR019492++
			this.setTableNoteEnable(oCustSpecRev1DocTable);                                                                                                 //PCR019492++
			this.setTableSecurity(oCustSpecRev1DocTable);                                                                                                   //PCR019492++
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setEnabled(false);                                                                   //PCR019492++
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).setEnabled(false);

			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false);
		},
		/**
		 * This Method is use to check  PDC initiation  .
		 * 
		 * @name checkPDCUsersfromlist
		 * @param 
		 * @returns 
		 */
		checkPDCUsersfromlist: function() {
			var checkFlag = false;
			var PDCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData();
			var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			if (parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) ===
				604 || parseInt(PDCData.PsrStatus) === 665 || parseInt(PDCData.PsrStatus) === 655) {
				var gmoUserList = GenInfoData.NAV_BMO_INFO.results;
				checkFlag = this.checkContact(gmoUserList);
			} else if (parseInt(PDCData.PsrStatus) === 640 || parseInt(PDCData.PsrStatus) === 670) {
				var gsmUserList = GenInfoData.NAV_GSM_INFO.results;
				checkFlag = this.checkContact(gsmUserList);
			} else if (parseInt(PDCData.PsrStatus) === 645 || parseInt(PDCData.PsrStatus) === 675) {
				var plheadUserList = GenInfoData.NAV_KPU_INFO.results;
				checkFlag = this.checkContact(plheadUserList);
			} else if (parseInt(PDCData.PsrStatus) === 646 || parseInt(PDCData.PsrStatus) === 680) {
				var rbmUserList = GenInfoData.NAV_RBM_INFO.results;
				checkFlag = this.checkContact(rbmUserList);
			} else if (parseInt(PDCData.PsrStatus) === 650 || parseInt(PDCData.PsrStatus) === 682) {
				var conUserList = GenInfoData.NAV_CON_INFO.results;
				checkFlag = this.checkContact(conUserList);
			}
			return checkFlag;
		},
		/**
		 * This Method is use to check  PDC initiation.
		 * 
		 * @name setPDCVisibility
		 * @param PDCRequired - PDCRequired value
		 * @returns 
		 */
		setPDCVisibility: function(PDCRequired) {
			var oResource = thisCntrlr.bundle;
			var PDCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
			var oView = thisCntrlr.getView();
			var LookUpBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LOOKUP_LISTBtn);
			var EditBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn);
			var SaveBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn);
			var SFAPRBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn);
			var iconTabBtn = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(true);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_PANEL).setExpanded(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_PANEL).setExpanded(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_STATUS_BAR).addStyleClass(oResource
				.getText("S2PSRSDABARINITCLS"));
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
				false);
			var RPSRDocData = PDCData.NAV_REV_DOCS.results;
			var RefSpecRev1 = this.loadFPSRevDocData(RPSRDocData, false, false);
			var oRPSRDocJModel = this.getJSONModel({
				"ItemSet": RefSpecRev1
			});
			var oRPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE);
			oRPSRDocTable.setModel(oRPSRDocJModel);
			this.setTableNoteEnable(oRPSRDocTable);
			(PDCData.NAV_PDC_CC.results
				.length > 0) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_PANEL)
				.setExpanded(true)) : (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_PANEL)
				.setExpanded(false));
			var genaralInfoData = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();
			if (PDCRequired === "") {
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_STATUS_BAR).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp).setSelectedIndex(-1);
				if (iconTabBtn.getSelectedKey() === oResource.getText("S2ICONTABPDCSDAKEY")) {
					that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setIconColor(sap.ui.core.IconColor.Default);
				}
				LookUpBtn.setVisible(false);
				EditBtn.setVisible(false);
				SaveBtn.setVisible(false);
				SFAPRBtn.setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(
					false);
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false);
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false);
			} else if (PDCRequired === oResource.getText("S2POSMANDATANS")) {
				//************************Start Of PCR019492: ASC606 UI Changes**************
				if(PDCData.OldBsdaVal !== ""){
					this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_OLDSDAVAL).setVisible(true);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_OLDSDAVAL).setText(PDCData.OldBsdaVal);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_OLDSDALBL).setVisible(true);
				} else {
					this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_OLDSDAVAL).setVisible(false);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_OLDSDALBL).setVisible(false);
				}
				//************************End Of PCR019492: ASC606 UI Changes**************
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setIconColor(sap.ui.core.IconColor.Critical);
				/************************Start Of PCR025717 Q2C Q4 2019 Enhancements**************
				if (PDCData.NAV_PDC_CC.results.length > 0) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(true);
				}
				************************End Of PCR025717 Q2C Q4 2019 Enhancements**************/
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(
					false);
				((oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLIST_BOX).getVisible ===
					false)) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(
					false)) : (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(
					true));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPPROVALS_PANEL).setVisible(false);
				LookUpBtn.setVisible(true);
				(PDCData.SendApproval ===
					oResource.getText("S2ODATAPOSVAL")) ? (SFAPRBtn.setVisible(true), SFAPRBtn.setEnabled(
					true)) : (SFAPRBtn.setVisible(false), SFAPRBtn.setEnabled(false));
				(PDCData.CcOppId === "" && PDCData.CcOpitmId ===
					"") ? (EditBtn.setVisible(true), SaveBtn.setVisible(true), SFAPRBtn.setVisible(true)) : (EditBtn.setVisible(
					false), SFAPRBtn.setVisible(false), SaveBtn.setVisible(false));
				if (PDCData.NAV_PDC_CC.results.length > 0) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_BOX).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_BOX).setVisible(
						false);
					//oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                                             //PCR025717--
					//	false);                                                                                                                                          //PCR025717--
				} else {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_BOX).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(false);
					//oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                                             //PCR025717--
					//	false);                                                                                                                                          //PCR025717--
				}
				if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAF_RADIOBtn).getSelectedIndex() <
					0) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAF_RADIOBtn).setValueState(sap.ui.core
						.ValueState.Error);
				}
				if (parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) === 604) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setExpanded(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_STATUS_BAR).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CONTACTINFO_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_360).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAF_RADIOBtn).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BAPPROVAL_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_PANEL).setExpanded(true);                                           //PCR019492++
					SFAPRBtn.setText(oResource.getText("S2PSRSDASFCANINITXT"));
					SFAPRBtn.setIcon(oResource.getText("S2CANCELBTNICON"));
					SFAPRBtn.setEnabled(false);
					SFAPRBtn.setVisible(true);
					SaveBtn.setEnabled(false);
				} else if (parseInt(PDCData.PsrStatus) >= 640 && parseInt(PDCData.PsrStatus) <= 650) {
					EditBtn.setVisible(false);
					LookUpBtn.setVisible(true);
					SaveBtn.setVisible(false);
					(parseInt(PDCData.PsrStatus) === 650) ? (EditBtn.setVisible(true), SaveBtn.setVisible(true)) : (EditBtn.setVisible(false),
						SaveBtn.setVisible(false));
					SFAPRBtn.setVisible(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setVisible(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(true);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setExpanded(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_STATUS_BAR).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CONTACTINFO_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_360).setVisible(true);
				} else if (parseInt(PDCData.PsrStatus) >= 665 && parseInt(PDCData.PsrStatus) <= 682) {
					EditBtn.setVisible(true);
					LookUpBtn.setVisible(true);
					SaveBtn.setVisible(false);
					SaveBtn.setEnabled(false);
					SFAPRBtn.setText(oResource.getText("S2PSRSDASUBFORAPP"));
					SFAPRBtn.setVisible(false);
					(parseInt(PDCData.PsrStatus) === 682) ?
					(EditBtn.setVisible(true), SaveBtn.setVisible(true)) : (EditBtn.setVisible(false), SaveBtn.setVisible(false));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_STATUS_BAR).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(
						true);
					(parseInt(PDCData.PsrStatus) === 665) ? (SaveBtn.setVisible(true)) : (SaveBtn.setVisible(false));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_360).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_DISPLAY_300).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_PANEL).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CONTACTINFO_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setExpanded(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setExpanded(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPPROVALS_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPPROVALS_PANEL).setExpanded(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BAPPROVAL_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BAPPROVAL_PANEL).setExpanded(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL).setVisible(
						true);
					if (parseInt(PDCData.PsrStatus) === 665) {
						SFAPRBtn.setText(oResource.getText("S2PSRSDASUBFORAPP"));
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false);
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setEnabled(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false)
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setEnabled(false)
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).setEnabled(false)
						SFAPRBtn.setText(oResource.getText("S2PSRSDASUBFORAPP"));
						SFAPRBtn.setVisible(false);
					} else {
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(true);
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(true);
						(parseInt(PDCData.TaskId) !==
							0) ? (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(true),
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(true)) : (that_views2
							.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false), that_views2.byId(
								com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false));
					}
				} else if (parseInt(PDCData.PsrStatus) === 660) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
					EditBtn.setVisible(false);
					SaveBtn.setVisible(false);
					SFAPRBtn.setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAF_RADIOBtn).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_STATUS_BAR).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_360).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CONTACTINFO_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setExpanded(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setExpanded(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPPROVALS_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BAPPROVAL_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setEnabled(
						true);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(true);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(true);
					that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setIconColor(sap.ui.core.IconColor.Positive);
				} else if (parseInt(PDCData.PsrStatus) === 685 || parseInt(PDCData.PsrStatus) === 690 || parseInt(PDCData.PsrStatus) === 695) {                    //PCR019492++
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_STATUS_BAR).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_STATUS_BAR).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(
						true);
					EditBtn.setVisible(false);
					SaveBtn.setVisible(false);
					SFAPRBtn.setVisible(true);
				} else if (parseInt(PDCData.PsrStatus) === 655) {
					SFAPRBtn.setVisible(false);
					SFAPRBtn.setEnabled(false);
					SFAPRBtn.setIcon(oResource.getText("S2PSRSDAWFICON"));
					EditBtn.setIcon(oResource.getText("S2PSRSDAEDITICON"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_STATUS_BAR).setVisible(true);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false);
					LookUpBtn.setVisible(true);
					EditBtn.setVisible(false);
					SaveBtn.setVisible(false);
					SFAPRBtn.setVisible(true);
					SFAPRBtn.setEnabled(false);
//					SFAPRBtn.setText(oResource.getText("S2PSRSDASFSSDAINITTXT"));                                                                              //PCR019492--
					var initSSDATxt = PDCData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? oResource.getText("S2PSRDCINITRRABTNTXTASC606"):    //PCR019492++
						oResource.getText("S2PSRSDASFSSDAINITTXT");                                                                                            //PCR019492++
					SFAPRBtn.setText(initSSDATxt);                                                                                                             //PCR019492++
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_STATUS_BAR).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_360).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CONTACTINFO_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setExpanded(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setExpanded(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPPROVALS_PANEL).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BAPPROVAL_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setEnabled(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setEnabled(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setVisible(
						true);
				}
			} else {
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_STATUS_BAR).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(false);
				if (iconTabBtn.getSelectedKey() === oResource.getText("S2ICONTABPDCSDAKEY")) {
					that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Positive);
				}
				LookUpBtn.setVisible(false);
				EditBtn.setVisible(false);
				SaveBtn.setVisible(false);
				SFAPRBtn.setVisible(true);
				SFAPRBtn.setEnabled(true);
				SFAPRBtn.setText(oResource.getText("S2PSRSDASFCANINITXT"));
				SFAPRBtn.setIcon(oResource.getText("S2CANCELBTNICON"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(false);
			}
			var initSSDATxt = PDCData.Asc606_Flag === oResource.getText("S2ODATAPOSVAL") ? oResource.getText("S2PSRDCINITRRABTNTXTASC606"):                         //PCR019492++
				oResource.getText("S2PSRSDASFSSDAINITTXT");                                                                                                         //PCR019492++
			var canSSDATxt = PDCData.Asc606_SsdaFlag === oResource.getText("S2ODATAPOSVAL") ? oResource.getText("S2PSRSDASFCONSSDAINITTXTASC606"):                  //PCR019492++
				oResource.getText("S2PSRSDASFCONSSDAINITTXT");                                                                                                      //PCR019492++
			(parseInt(PDCData.PsrStatus) === 655) ? (SFAPRBtn.setVisible(true), SFAPRBtn.setEnabled(true), SFAPRBtn.setText(initSSDATxt)) :                         //PCR019492++
			  (((parseInt(PDCData.PsrStatus) === 665)) ? (SFAPRBtn.setVisible(true), SFAPRBtn.setEnabled(true), SFAPRBtn.setText(canSSDATxt)) :                     //PCR019492++
				((parseInt(PDCData.PsrStatus) === 685 || parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) === 690 ||                              //PCR019492++
					parseInt(PDCData.PsrStatus) === 695) ? (SFAPRBtn.setVisible(true), SFAPRBtn.setEnabled(true), SFAPRBtn.setText(oResource                        //PCR019492++
							.getText("S2PSRSDASFCANINITXT"))) : (SFAPRBtn.setVisible(false))));
			(PDCData.PsrStatus === "") ? (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(
				true), oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(
				false), oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_STATUS_BAR).setVisible(
				false)) : ("");
			(parseInt(PDCData.PsrStatus) === 655) ?
			(oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setEnabled(
				true)) : ("");
			(parseInt(PDCData.PsrStatus) === 655 || parseInt(PDCData.PsrStatus) === 660) ?
			(oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setEnabled(true)) : ("");
			((parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) === 604) && (thisCntrlr.PDCData.CcOppId !== "" && thisCntrlr.PDCData
				.CcOpitmId !== "")) ? (SFAPRBtn.setVisible(false)) : ("");
			(parseInt(PDCData.PsrStatus) === 650 || parseInt(PDCData.PsrStatus) === 682 || parseInt(PDCData.PsrStatus) === 665) ? (EditBtn.setVisible(
				true), SaveBtn.setVisible(true), SaveBtn.setEnabled(false)) : ("");
			(parseInt(PDCData.PsrStatus) === 670 || parseInt(PDCData.PsrStatus) === 675 || parseInt(PDCData.PsrStatus) === 680) ? (EditBtn.setVisible(
				true), EditBtn.setEnabled(true), EditBtn.setText(thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT")), EditBtn.setIcon(
				thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"))) : ("");
			(parseInt(PDCData.PsrStatus) === 604) ? (SFAPRBtn.setVisible(false)) : ("");
			(parseInt(PDCData.PsrStatus) === 605 && PDCData.CcOppId === "" && PDCData.CcOpitmId === "" && PDCData.BsdaResetFlag !== this.getResourceBundle()        //PCR019492++
					.getText("S1TABLESALESTAGECOL")) ? SFAPRBtn.setVisible(true): "";                                                                               //PCR019492++
		},
		/**
		 * This method Used for Determine PSR Type.
		 * 
		 * @name fnDeterminePSRTY
		 * @param QuesItems: PSR Question Data, param- Visibility,salesEnable-Sales Enable Flag ,BMEnable- BMO Enable Flag
		 * @returns 
		 */
		fnDeterminePSRTY: function(QuesItems, param, salesEnable, BMEnable) {
			if (that_psrsda === undefined) {
				that_psrsda = this.getOwnerComponent().psrsda;
			}
			var FinalQuesItems = {
				"items": []
			};
			var oResorce = thisCntrlr.bundle;
			var CurrentStatus = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText()
				.split(": ")[that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText().split(
					": ").length - 1];
			var flagNew = false,
				flagRepeat = false,
				flagRevised = false;
			for (var i = 0, m = 0; i < QuesItems.items[0].length; i++) {
				var temp = {};
				if (QuesItems.items[0][i].BmoFlg === oResorce.getText("S2POSMANDATANS")) {
					temp.BMOValueState = oResorce.getText("S2DELNAGVIZTEXT");
					temp.BMOSelected = true;
					temp.BMOSelectionIndex = 1;
				} else if (QuesItems.items[0][i].BmoFlg === oResorce.getText("S2NEGMANDATANS")) {
					temp.BMOValueState = oResorce.getText("S2DELNAGVIZTEXT");
					temp.BMOSelected = false;
					temp.BMOSelectionIndex = 2;
				} else if (QuesItems.items[0][i].BMOValueState === oResorce.getText("S2DELNAGVIZTEXT")) {
					temp.BMOSelected = QuesItems.items[0][i].BMOSelected;
					temp.BMOSelectionIndex = QuesItems.items[0][i].BMOSelectionIndex;
					temp.BMOValueState = QuesItems.items[0][i].BMOValueState;
				} else {
					temp.BMOSelected = "";
					temp.BMOSelectionIndex = 0;
					temp.BMOValueState = oResorce.getText("S2ERRORVALSATETEXT");
				}
				temp.BMOEnabled = BMEnable;
				if (i === 0) {
					flagNew = true;
					temp.Ques = QuesItems.items[0][i].Qdesc;
					if (QuesItems.items[0][i].Selected !== undefined) {
						if (QuesItems.items[0][i].Selected === true) {
							temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
							temp.Selected = true;
							temp.SelectionIndex = 1;
						} else if (QuesItems.items[0][i].Selected === false) {
							temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
							temp.Selected = false;
							temp.SelectionIndex = 2;
						} else {
							temp.Selected = "";
							temp.SelectionIndex = 0;
							temp.valueState = oResorce.getText("S2ERRORVALSATETEXT");
						}
					} else {
						if (QuesItems.items[0][i].SalesFlg === oResorce.getText("S2POSMANDATANS")) {
							temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
							temp.Selected = true;
							temp.SelectionIndex = 1;
						} else if (QuesItems.items[0][i].SalesFlg === oResorce.getText("S2NEGMANDATANS")) {
							temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
							temp.Selected = false;
							temp.SelectionIndex = 2;
						} else {
							temp.Selected = "";
							temp.SelectionIndex = 0;
							temp.valueState = oResorce.getText("S2ERRORVALSATETEXT");
						}
					}
					temp.enabled = salesEnable;
					FinalQuesItems.items[m] = temp;
					m++;
				}
				if (i === 1 && QuesItems.items[0][i].SalesFlg === oResorce.getText("S2POSMANDATANS")) {
					flagNew = true;
					temp.Ques = QuesItems.items[0][i].Qdesc;
					if (QuesItems.items[0][i].SalesFlg === oResorce.getText("S2POSMANDATANS")) {
						temp.Selected = true;
					} else if (QuesItems.items[0][i].SalesFlg === oResorce.getText("S2NEGMANDATANS")) {
						temp.Selected = false;
					} else {
						temp.Selected = "";
					}
					temp.SelectionIndex = 1;
					temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
					temp.enabled = salesEnable;
					FinalQuesItems.items[m] = temp;
					if (thisCntrlr.getModelFromCore(oResorce.getText("GLBPSRMODEL")).getData().PsrType ===
						oResorce.getText("S2PSRSDASTATNEW") || thisCntrlr.getModelFromCore(oResorce
							.getText("GLBPSRMODEL")).getData().PsrType === undefined) {
						var TempArr = [FinalQuesItems, flagNew, flagRepeat, flagRevised];
						return TempArr;
					} else {
						flagNew = false;
						m++;
					}
				} else if (i === 1 && QuesItems.items[0][i].SalesFlg === "") {
					if (QuesItems.items[0][i].Selected !== undefined) {
						temp.Ques = QuesItems.items[0][i].Qdesc;
						if (QuesItems.items[0][i].Selected === false) {
							temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
							flagNew = false;
							temp.Selected = false;
							temp.SelectionIndex = 2;
						} else if (QuesItems.items[0][i].Selected === true) {
							temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
							flagNew = true;
							temp.Selected = true;
							temp.SelectionIndex = 1;
						} else {
							flagNew = false;
							temp.Selected = "";
							temp.SelectionIndex = 0;
							temp.valueState = oResorce.getText("S2ERRORVALSATETEXT");
						}
						temp.enabled = salesEnable;
						FinalQuesItems.items[m] = temp;
						if (temp.Selected === true) {
							var TempArr = [FinalQuesItems, flagNew, flagRepeat, flagRevised];
							return TempArr;
						}
						m++;
					} else {
						temp.Ques = QuesItems.items[0][i].Qdesc;
						if (QuesItems.items[0][i].SalesFlg === oResorce.getText("S2NEGMANDATANS")) {
							temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
							temp.Selected = false;
							temp.SelectionIndex = 2;
						} else if (QuesItems.items[0][i].SalesFlg === oResorce.getText("S2POSMANDATANS")) {
							temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
							temp.Selected = true;
							temp.SelectionIndex = 1;
						} else {
							temp.Selected = "";
							temp.SelectionIndex = 0;
							temp.valueState = oResorce.getText("S2ERRORVALSATETEXT");
						}
						temp.enabled = salesEnable;
						FinalQuesItems.items[m] = temp;
						if ((QuesItems.items[0][i - 1].Selected === true || QuesItems.items[0][i - 1].Selected === false) &&
							QuesItems.items[0][i].Selected === undefined) {
							flagNew = false;
							var TempArr = [FinalQuesItems, flagNew, flagRepeat, flagRevised];
							return TempArr;
						} else if (param === oResorce.getText("S2PSRDETERMINDFTPARAM")) {
							flagNew = true;
							var TempArr = [FinalQuesItems, flagNew, flagRepeat, flagRevised];
							return TempArr;
						} else flagNew = false;
						m++;
					}
				} else {
					if (i === 1 && QuesItems.items[0][i].SalesFlg === oResorce.getText("S2NEGMANDATANS")) {
						flagNew = false;
						temp.SelectionIndex = 2;
						temp.Ques = QuesItems.items[0][i].Qdesc;
						if (QuesItems.items[0][i].SalesFlg === oResorce.getText("S2POSMANDATANS")) {
							temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
							temp.Selected = true;
						} else if (QuesItems.items[0][i].SalesFlg === oResorce.getText("S2NEGMANDATANS")) {
							temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
							temp.Selected = false;
						} else {
							temp.Selected = "";
							temp.valueState = oResorce.getText("S2ERRORVALSATETEXT");
						}
						temp.enabled = salesEnable;
						FinalQuesItems.items[m] = temp;
						m++;
					}
					if (flagNew === false) {
						if (i === 2 || i === 3 || i === 4 || i === 5) {
							if (QuesItems.items[0][i].Selected !== undefined) {
								if (QuesItems.items[0][i].Selected === true) {
									temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
									temp.Selected = true;
									flagRepeat = true;
									temp.SelectionIndex = 1;
								} else if (QuesItems.items[0][i].Selected === false) {
									temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
									temp.Selected = false;
									flagRevised = true;
									flagRepeat = false;
									temp.SelectionIndex = 2;
								} else {
									temp.valueState = oResorce.getText("S2ERRORVALSATETEXT");
									temp.Selected = "";
									flagRepeat = false;
									flagRevised = false;
									temp.SelectionIndex = 0;
								}
								temp.Ques = QuesItems.items[0][i].Qdesc;
								temp.enabled = salesEnable;
								FinalQuesItems.items[m] = temp;
								m++;
							} else {
								if (QuesItems.items[0][i].SalesFlg === oResorce.getText("S2POSMANDATANS")) {
									temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
									temp.Selected = true;
									flagRepeat = true;
									temp.SelectionIndex = 1;
								} else if (QuesItems.items[0][i].SalesFlg === oResorce.getText(
										"S2NEGMANDATANS")) {
									temp.valueState = oResorce.getText("S2DELNAGVIZTEXT");
									temp.Selected = false;
									flagRevised = true;
									flagRepeat = false;
									temp.SelectionIndex = 2;
								} else {
									temp.valueState = oResorce.getText("S2ERRORVALSATETEXT");
									temp.Selected = "";
									flagRepeat = false;
									flagRevised = false;
									temp.SelectionIndex = 0;
								}
								temp.Ques = QuesItems.items[0][i].Qdesc;
								temp.enabled = salesEnable;
								FinalQuesItems.items[m] = temp;
								m++;
							}
						}
					}
				}
			}
			var TempArr = [FinalQuesItems, flagNew, flagRepeat, flagRevised];
			return TempArr;
		},
		/**
		 * This Method is use to load data in PDC tab Controls.
		 * 
		 * @name getPDCData
		 * @param 
		 * @returns 
		 */
		getPDCData: function() {
			this._initiateControllerObjects();
			var oResource = thisCntrlr.bundle;
			var GenInfoData = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();
			var oView = thisCntrlr.getView();
			var Guid = GenInfoData.Guid;
			var ItemGuid = GenInfoData.ItemGuid;
			var iconTabBtn = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB);
			var LookUpBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LOOKUP_LISTBtn);
			var EditBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn);
			var SaveBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn);
			var SFAPRBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn);
			var sValidate = "PDCSDA_InfoSet(Guid=guid'" + Guid + "',ItemGuid=guid'" + ItemGuid +
			"')?$expand=NAV_CHANGE_HISTORY_PDC,NAV_RRA_QA_PDC,NAV_PDC_BSDA_FINL,NAV_PDC_BSDA_FINN,NAV_PDC_BSDA_PARL,NAV_PDC_CC,NAV_PDC_FNL_DOCS,NAV_PDC_QA_SAF,NAV_PDC_SSDA_FINL,NAV_PDC_SSDA_FINN,NAV_PDC_SSDA_PARL,NAV_PDCBSDA_EVDOC,NAV_PDCCUST_REVSPEC,NAV_REV_DOCS,NAV_PDCSSDA_EVDOC";  //PCR019903++
		    this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			thisCntrlr.PDCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
			this.PDCCCData = thisCntrlr.PDCData.NAV_PDC_CC;
			(thisCntrlr.PDCData.BsdaResetFlag === oResource.getText("S1TABLESALESTAGECOL") || thisCntrlr.PDCData.SsdaResetFlag === oResource.getText(
				"S1TABLESALESTAGECOL")) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RESET_LIST_PANEL).setVisible(true)) : (oView.byId(
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RESET_LIST_PANEL).setVisible(false));
			(thisCntrlr.PDCData.CcOppId !== "" && thisCntrlr.PDCData.CcOpitmId !== "") ? (oView.byId(com.amat.crm
				.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_TEXT).setText(oResource.getText(
				"S2PSRSDACCFRMTXT") + " " + thisCntrlr.PDCData.CcOppId + "_" + thisCntrlr.PDCData.CcOpitmId)) : (oView
				.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_CARBON_COPY_TEXT).setText(""));
			var oCbnCpyTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_TABLE);
			var cModel8 = this.getJSONModel(thisCntrlr.PDCData.NAV_PDC_CC);
			oCbnCpyTable.setModel(cModel8);
			this.setTableNoteEnable(oCbnCpyTable);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setValue("");
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE).setVisible(false);
			if (thisCntrlr.PDCData.RevOppId !== "" && thisCntrlr.PDCData.RevOpitmId === "") {
				var SecurityData = thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();
				var RefSpecRev1 = [],
					UpldCustSpecVis, Enableflag = false,
					Enabledelflag = false,
					UpldFnlSpecVis = false;
				var RPSRDocData = thisCntrlr.PDCData.NAV_REV_DOCS.results;
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setValue(
					thisCntrlr.PDCData.RevOppId);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(false);                                                 //PCR021481++                           
			} else if (thisCntrlr.PDCData.RevOppId !== "" && thisCntrlr.PDCData.RevOpitmId !== "") {
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(
					true);
				if (parseInt(thisCntrlr.PDCData.PsrStatus) === 605 || parseInt(thisCntrlr.PDCData.PsrStatus) === 604) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(
						false);
				}
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_REL_PERSpec_BOX).getItems()[0].setText(
					thisCntrlr.PDCData.RevOppId + "-" + thisCntrlr.PDCData.RevOpitmId
				);
				if (thisCntrlr.PDCData.NAV_PDC_FNL_DOCS.results[0].FileName !== "") {
					var cModel5 = this.getJSONModel([thisCntrlr.PDCData.NAV_PDC_FNL_DOCS.results[0]]);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setModel(
						cModel5);
				} else {
					var cModel5 = this.getJSONModel([]);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setModel(
						cModel5);
				}
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
					true);
			} else if (thisCntrlr.PDCData.RevOppId === "" && thisCntrlr.PDCData.RevOpitmId === "") {
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setText(oResource
					.getText("S2PSRSDANTINLISTBTN"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setIcon(oResource
					.getText("S2SUBMTFORAPPBTN"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType
					.Emphasized);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
				(oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() === oResource
					.getText("S2PSRSDAEDITBTNTXT")) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn)
					.setEnabled(false)) : ((oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() ===
					oResource.getText("S2PSRSDACANBTNTXT")) ? (oView.byId(com.amat.crm.opportunity
					.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setEnabled(true)) : (""));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(true);
			}
			if (thisCntrlr.PDCData.NAV_PDC_FNL_DOCS.results[0].FileName !== "") {
				var cModel5 = this.getJSONModel([thisCntrlr.PDCData.NAV_PDC_FNL_DOCS.results[0]]);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setModel(
					cModel5);
			} else {
				var cModel5 = this.getJSONModel([]);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setModel(
					cModel5);
			}
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).getModel().getData()
				.length === 0 ? oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLIST_BOX).setVisible(
					true) : oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLIST_BOX).setVisible(
					false);
			var CustSpecRev1Data = thisCntrlr.PDCData.NAV_PDCCUST_REVSPEC.results;
			if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() === oResource
					.getText("S2CARMBTNEDIT")) {
				var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, false, false);
			} else {
				if(parseInt(thisCntrlr.PDCData.PsrStatus) === 605 || parseInt(thisCntrlr.PDCData.PsrStatus) === 604){
					var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, true, true);
				} else {
					var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, false, false);
				}
			}
			var oCustSpecRev1JModel = this.getJSONModel({
				"ItemSet": CustSpecRev1
			});
			var oCustSpecRev1DocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE);
			oCustSpecRev1DocTable.setModel(oCustSpecRev1JModel);
			this.setTableNoteEnable(oCustSpecRev1DocTable);
			this.setTableSecurity(oCustSpecRev1DocTable);
			var RefrenceRev1Data = thisCntrlr.PDCData.NAV_REV_DOCS.results;
			if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() === oResource
				.getText("S2CARMBTNEDIT")) {
				var RefrenceData = this.loadFPSRevDocData(RefrenceRev1Data, false, false);
			} else {
				if(parseInt(thisCntrlr.PDCData.PsrStatus) === 605 || parseInt(thisCntrlr.PDCData.PsrStatus) === 604){
					this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setVisible(false);                                                        //PCR019492++
					var RefrenceData = this.loadFPSRevDocData(RefrenceRev1Data, true, true);
					if(thisCntrlr.PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                                                        //PCR019492++
						var RRAQuesData = thisCntrlr.getRRAQusData(thisCntrlr.PDCData.PsrStatus, thisCntrlr.PDCData.NAV_RRA_QA_PDC, GenInfoData.Region, true);    //PCR019492++
						this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));                               //PCR019492++
					}
				} else {
					var RefrenceData = this.loadFPSRevDocData(RefrenceRev1Data, false, false);
					if(thisCntrlr.PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                                                        //PCR019492++
						var RRAQuesData = thisCntrlr.getRRAQusData(thisCntrlr.PDCData.PsrStatus, thisCntrlr.PDCData.NAV_RRA_QA_PDC, GenInfoData.Region, false);   //PCR019492++
						this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));                               //PCR019492++
					}
				}
			}
			var oRefrenceJModel = this.getJSONModel({
				"ItemSet": RefrenceData
			});
			var oRefrenceDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE);
			oRefrenceDocTable.setModel(oRefrenceJModel);
			this.setTableNoteEnable(oRefrenceDocTable);
			this.setTableSecurity(oRefrenceDocTable);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BApr_PARALLEL).setModel(new sap.ui.model
				.json.JSONModel(thisCntrlr.PDCData.NAV_PDC_BSDA_PARL));
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BApr_FINAL).setModel(new sap.ui.model
				.json.JSONModel(thisCntrlr.PDCData.NAV_PDC_BSDA_FINL));
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BApr_FINANCIAL).setModel(new sap.ui.model
				.json.JSONModel(thisCntrlr.PDCData.NAV_PDC_BSDA_FINN));
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPRpARALLEL).setModel(new sap.ui.model
				.json.JSONModel(thisCntrlr.PDCData.NAV_PDC_SSDA_PARL));
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SBAPR_FINAL).setModel(new sap.ui.model
				.json.JSONModel(thisCntrlr.PDCData.NAV_PDC_SSDA_FINL));
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPR_FINANCIAL).setModel(new sap.ui.model
				.json.JSONModel(thisCntrlr.PDCData.NAV_PDC_SSDA_FINN));
			//***************Start Of PCR019492: ASC606 UI Changes********
//			var SDAAssesItem = {                                                                                                                   //PCR019492--
//				"SDAAssesCollection": [{                                                                                                           //PCR019492--
//					"ProductId": "OP",                                                                                                             //PCR019492--
//					"Name": "Select Level"                                                                                                         //PCR019492--
//				}, {                                                                                                                               //PCR019492--
//					"ProductId": "L1",                                                                                                             //PCR019492--
//					"Name": "L1"                                                                                                                   //PCR019492--
//				}, {                                                                                                                               //PCR019492--
//					"ProductId": "L2",                                                                                                             //PCR019492--
//					"Name": "L2"                                                                                                                   //PCR019492--
//				}, {                                                                                                                               //PCR019492--
//					"ProductId": "L3",                                                                                                             //PCR019492--
//					"Name": "L3"                                                                                                                   //PCR019492--
//				}, {                                                                                                                               //PCR019492--
//					"ProductId": "AMJD",                                                                                                           //PCR019492--
//					"Name": "AMJD"                                                                                                                 //PCR019492--
//				}]                                                                                                                                 //PCR019492--
//			};                                                                                                                                     //PCR019492--
			if(thisCntrlr.PDCData.Asc606_BsdaFlag === ""){
				if(thisCntrlr.PDCData.OldBsdaVal !== "" && thisCntrlr.PDCData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
					var BSDAAssesItem = {
							"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
							                       {"ProductId": "L1", "Name": "L1" },
							                       {"ProductId": "L2", "Name": "L2" }, 
							                       {"ProductId": "L3", "Name": "L3" },
							                       {"ProductId": "SHPOD", "Name": "SHPOD" },
							                       {"ProductId": "CAR", "Name": "CAR" }, 
							                       {"ProductId": "DEFER", "Name": "DEFER" },
							                       {"ProductId": "AMJD", "Name": "AMJD" }]};
					(GenInfoData.Region !== oResource.getText("S2OPPREGION")) ?
							(BSDAAssesItem.SDAAssesCollection.length = 7) : (BSDAAssesItem.SDAAssesCollection.length = 8);
				} else {
					var BSDAAssesItem = {
							"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
							                       {"ProductId": "L1", "Name": "L1" },
							                       {"ProductId": "L2", "Name": "L2" }, 
							                       {"ProductId": "L3", "Name": "L3" }, 
							                       {"ProductId": "AMJD", "Name": "AMJD" }]};
					(GenInfoData.Region !== oResource.getText("S2OPPREGION")) ?
							(BSDAAssesItem.SDAAssesCollection.length = 4) : (BSDAAssesItem.SDAAssesCollection.length = 5);
				}
				
			} else if(thisCntrlr.PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				var BSDAAssesItem = {
						"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
						                       {"ProductId": "SHPOD", "Name": "SHPOD" },
						                       {"ProductId": "CAR", "Name": "CAR" }, 
						                       {"ProductId": "DEFER", "Name": "DEFER" }, 
						                       {"ProductId": "AMJD", "Name": "AMJD" }]};
				(GenInfoData.Region !== oResource.getText("S2OPPREGION")) ?
						(BSDAAssesItem.SDAAssesCollection.length = 4) : (BSDAAssesItem.SDAAssesCollection.length = 5);
			}
			var oBSDAModel = this.getJSONModel(BSDAAssesItem);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setModel(oBSDAModel);
			if(thisCntrlr.PDCData.Asc606_SsdaFlag === ""){
				var SSDAAssesItem = {
						"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
						                       {"ProductId": "L1", "Name": "L1" },
						                       {"ProductId": "L2", "Name": "L2" }, 
						                       {"ProductId": "L3", "Name": "L3" }, 
						                       {"ProductId": "AMJD", "Name": "AMJD" }]};
			} else if(thisCntrlr.PDCData.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				var SSDAAssesItem = {
						"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
						                       {"ProductId": "SHPOD", "Name": "SHPOD" },
						                       {"ProductId": "CAR", "Name": "CAR" }, 
						                       {"ProductId": "DEFER", "Name": "DEFER" }, 
						                       {"ProductId": "AMJD", "Name": "AMJD" }]};
			}
			(GenInfoData.Region !== oResource.getText("S2OPPREGION")) ?
			(SSDAAssesItem.SDAAssesCollection.length = 4) : (SSDAAssesItem.SDAAssesCollection.length = 5);
			var oSSDAModel = this.getJSONModel(SSDAAssesItem);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setModel(oSSDAModel);
			//***************End Of PCR019492: ASC606 UI Changes********
			var cModel9 = this.getJSONModel(thisCntrlr.PDCData.NAV_PDCBSDA_EVDOC);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_FORM).setModel(cModel9);
			var cModelssda = this.getJSONModel(thisCntrlr.PDCData.NAV_PDCSSDA_EVDOC);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDA_EVS_FORM).setModel(cModelssda);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setValue(thisCntrlr.PDCData.BsdaJustfication);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).setValue(thisCntrlr.PDCData.SsdaJustfication);
			var EBSDAPDCData = thisCntrlr.PDCData.NAV_PDCBSDA_EVDOC.results;
			var ESSDAPDCData = thisCntrlr.PDCData.NAV_PDCSSDA_EVDOC.results;
			if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() === oResource
					.getText("S2CARMBTNEDIT")) {
				var EBSDAPDCDoc = this.loadFPSRevDocData(EBSDAPDCData, false, false);
			} else {
				if(parseInt(thisCntrlr.PDCData.PsrStatus) === 605 || parseInt(thisCntrlr.PDCData.PsrStatus) === 604){
				var EBSDAPDCDoc = this.loadFPSRevDocData(EBSDAPDCData, true, true);
				} else {
					var EBSDAPDCDoc = this.loadFPSRevDocData(EBSDAPDCData, false, false);
				}
			}
			var oEBSDAPDCDocJModel = this.getJSONModel({
				"ItemSet": EBSDAPDCDoc
			});
			var oEBSDAPDCDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EVPDC_DOC_TABLE);
			oEBSDAPDCDocTable.setModel(oEBSDAPDCDocJModel);
			this.setTableNoteEnable(oEBSDAPDCDocTable);
			this.setTableSecurity(oEBSDAPDCDocTable);
			if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() === oResource
					.getText("S2CARMBTNEDIT")) {
				var ESSDAPDCDoc = this.loadFPSRevDocData(ESSDAPDCData, false, false);
			} else {
				if(parseInt(thisCntrlr.PDCData.PsrStatus) === 665){
				var ESSDAPDCDoc = this.loadFPSRevDocData(ESSDAPDCData, true, true);
				} else {
					var ESSDAPDCDoc = this.loadFPSRevDocData(ESSDAPDCData, false, false);
				}
			}
			var oESSDAPDCDocJModel = this.getJSONModel({
				"ItemSet": ESSDAPDCDoc
			});
			var oESSDAPDCDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SEVPDC_DOC_TABLE);
			oESSDAPDCDocTable.setModel(oESSDAPDCDocJModel);
			this.setTableNoteEnable(oESSDAPDCDocTable);
			this.setTableSecurity(oESSDAPDCDocTable);
			var FPSRDocData = thisCntrlr.PDCData.NAV_PDC_FNL_DOCS.results;
			var SAFQuesData = {
				"items": []
			};
			SAFQuesData.items[0] = [thisCntrlr.PDCData.NAV_PDC_QA_SAF];
			var FinalQuesItems = thisCntrlr.fnDeterminePSRTY(SAFQuesData, oResource.getText(
				"S2PSRDETERMINDFTPARAM"), false, false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAF_RADIOBtn).setModel(new sap.ui.model
				.json.JSONModel(FinalQuesItems[0].items));
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAF_RADIOBtn).setSelectedIndex(
				FinalQuesItems[0].items[0].SelectionIndex);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAF_RADIOBtn).setValueState(
				FinalQuesItems[0].items[0].valueState);
			//***************Start Of PCR019492: ASC606 UI Changes********
			if(thisCntrlr.PDCData.Asc606_BsdaFlag === ""){
				if (thisCntrlr.PDCData.Bsdl === oResource.getText("S2BSDASSMENTLVL1")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
							oResource.getText("S2BSDASSMENTLVL1"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(true);
				} else if (thisCntrlr.PDCData.Bsdl === oResource.getText("S2BSDASSMENTLVL2")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
							oResource.getText("S2BSDASSMENTLVL2"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(true);
				} else if (thisCntrlr.PDCData.Bsdl === oResource.getText("S2BSDASSMENTLVL3")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
							oResource.getText("S2BSDASSMENTLVL3"));
				} else if (thisCntrlr.PDCData.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
							thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606"));
				} else if (thisCntrlr.PDCData.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606"));
				} else if (thisCntrlr.PDCData.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606"));
				} else if (thisCntrlr.PDCData.Bsdl === oResource.getText("S2BSDASSMENTLVLAMJD")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
							oResource.getText("S2BSDASSMENTLVLAMJD"));
				} else {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
							oResource.getText("S2BSDASSMENTLVLOP"));
				}
			} else if(thisCntrlr.PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				if (thisCntrlr.PDCData.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606"));
				} else if (thisCntrlr.PDCData.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606"));
				} else if (thisCntrlr.PDCData.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606"));
				} else if (thisCntrlr.PDCData.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"));
				} else {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP"));
				}
			}
			if(thisCntrlr.PDCData.Asc606_SsdaFlag === ""){
				if (thisCntrlr.PDCData.Ssdl === oResource.getText("S2BSDASSMENTLVL1")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						oResource.getText("S2BSDASSMENTLVL1"));
				} else if (thisCntrlr.PDCData.Ssdl === oResource.getText("S2BSDASSMENTLVL2")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						oResource.getText("S2BSDASSMENTLVL2"));
				} else if (thisCntrlr.PDCData.Ssdl === oResource.getText("S2BSDASSMENTLVL3")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						oResource.getText("S2BSDASSMENTLVL3"));
				} else if (thisCntrlr.PDCData.Ssdl === oResource.getText("S2BSDASSMENTLVLAMJD")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						oResource.getText("S2BSDASSMENTLVLAMJD"));
				} else {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						oResource.getText("S2BSDASSMENTLVLOP"));
				}
			}else if(thisCntrlr.PDCData.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				if (thisCntrlr.PDCData.Ssdl === thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606"));
				} else if (thisCntrlr.PDCData.Ssdl === thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606"));
				} else if (thisCntrlr.PDCData.Ssdl === thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606"));
				} else if (thisCntrlr.PDCData.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"));
				} else {
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP"));
				}
			}
			//***************End Of PCR019492: ASC606 UI Changes********
			var SSDAReData = {
				"items": [{
					"SelectionIndex": "0",
					"valueState": "Error",
					"enabled": "false"
				}]
			};
			if (thisCntrlr.PDCData.SsdaReq === oResource.getText("S2POSMANDATANS")) {
				SSDAReData.items[0].SelectionIndex = 1;
				SSDAReData.items[0].valueState = oResource.getText("S2DELNAGVIZTEXT");
				SSDAReData.items[0].enabled = "false";
			} else if (thisCntrlr.PDCData.SsdaReq === oResource.getText("S2NEGMANDATANS")) {
				SSDAReData.items[0].SelectionIndex = 2;
				SSDAReData.items[0].valueState = oResource.getText("S2DELNAGVIZTEXT");
				SSDAReData.items[0].enabled = "false";
			} else {
				SSDAReData.items[0].SelectionIndex = 0;
				SSDAReData.items[0].valueState = oResource.getText("S2ERRORVALSATETEXT");
				SSDAReData.items[0].enabled = "false";
			}
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setModel(new sap
				.ui.model.json.JSONModel(SSDAReData.items));
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setSelectedIndex(
				SSDAReData.items[0].SelectionIndex);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setValueState(
				SSDAReData.items[0].valueState);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setValue(thisCntrlr.PDCData
				.NAV_PDCBSDA_EVDOC.Notes);
			(thisCntrlr.PDCData.Bd === oResource.getText("S2BSDAASSESSDVAL")) ? (oView.byId(
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setSelected(true)) : (oView.byId(
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setSelected(false));
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).setValue(thisCntrlr.PDCData
				.NAV_PDCSSDA_EVDOC.Notes);
			(thisCntrlr.PDCData.Sd === oResource.getText("S2BSDAASSESSDVAL")) ? (oView.byId(
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setSelected(true)) : (oView.byId(
				com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setSelected(false));
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BARSTATUS_TEXT).setText(oResource
				.getText("S2PSRBARSTATUSHEADER") + " " + thisCntrlr.PDCData.PsrStatDesc);
			var SFAPRBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn);
			(parseInt(thisCntrlr.PDCData.PsrStatus) === 665) ? (SFAPRBtn.setText(oResource.getText(
				"S2PSRSDASUBFORAPP")), SFAPRBtn.setEnabled(false)) : ((parseInt(thisCntrlr.PDCData.PsrStatus) === 605) ?
				(SFAPRBtn.setText(oResource.getText("S2PSRSDASFCANINITXT")), SFAPRBtn.setEnabled(true),
					SFAPRBtn.setVisible(true)) : (""));
			var initSSDATxt = thisCntrlr.PDCData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? oResource.getText("S2PSRDCINITRRABTNTXTASC606"):                                        //PCR019492++
							oResource.getText("S2PSRSDASFSSDAINITTXT");                                                                                                                               //PCR019492++
			(parseInt(thisCntrlr.PDCData.PsrStatus) === 655) ? (SFAPRBtn.setText(oResource.getText(initSSDATxt)), SFAPRBtn.setIcon(oResource.getText("S2PSRSDAWFICON")),                              //PCR019492++
				SFAPRBtn.setEnabled(true), SFAPRBtn.setVisible(true)) : ("");
			(parseInt(thisCntrlr.PDCData.PsrStatus) >= 655 && (thisCntrlr.PDCData.CcOppId !== "" && thisCntrlr.PDCData.CcOpitmId !==
				"")) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setVisible(true),
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setEnabled(true), thisCntrlr
				.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setVisible(true), oView
				.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(false)) : ("");
			var bmoUserList = GenInfoData.NAV_BMO_INFO.results;
			var bmoUserFlag = this.checkContact(bmoUserList);
			var romUserFlag = thisCntrlr.checkContact(GenInfoData.NAV_ROM_INFO.results);                                                                                                                //PCR028711++; check for rom users
			var asmUserFlag = thisCntrlr.checkContact(GenInfoData.NAV_ASM_INFO.results);                                                                                                                //PCR028711++; check for sales users
			var RcreatBsdaBtnTxt = thisCntrlr.PDCData.Asc606_BsdaFlag === this.getResourceBundle().getText("S2ODATAPOSVAL")? this.getResourceBundle().getText("S2PDCBRRARESETBTNTXTASC606") :           //PCR019492++
				this.getResourceBundle().getText("S2PDCRETESTBTNTXT");	                                                                                                                                //PCR019492++
			//(((parseInt(thisCntrlr.PDCData.PsrStatus) === 655 && GenInfoData.ActBookDate === "") && (bmoUserFlag === true && thisCntrlr.PDCData.CcOppId === "" && thisCntrlr.PDCData                  //PCR019492++, ActBookDate condition++; PCR022669--
			(((parseInt(thisCntrlr.PDCData.PsrStatus) === 655) && ((bmoUserFlag === true || romUserFlag === true || asmUserFlag === true) && thisCntrlr.PDCData.CcOppId === "" && thisCntrlr.PDCData    //PCR022669++, ActBookDate condition--; PCR028711++
				.CcOpitmId === "" && thisCntrlr.PDCData.SsdaResetFlag !== oResource.getText("S1TABLESALESTAGECOL"))) ? (that_views2.byId(com.amat
				.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(true), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setText(RcreatBsdaBtnTxt)) :                                   //PCR019492++
					(that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false)));
			(parseInt(thisCntrlr.PDCData.PsrStatus) === 640) ? ((oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() ===
					oResource.getText("S2PSRSDAEDITBTNTXT")) ?
				(that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(true), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT)
					.setVisible(true)) : (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(true), that_views2.byId(com.amat.crm
					.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(true), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(
					false), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false))) : ("");
			(parseInt(thisCntrlr.PDCData.PsrStatus) === 605 && thisCntrlr.PDCData.CcOppId === "" && thisCntrlr.PDCData.CcOpitmId === "" && thisCntrlr.PDCData                                           //PCR019492++                                        
				.BsdaResetFlag !== this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? SFAPRBtn.setVisible(true): "";                                                                            //PCR019492++
			(parseInt(thisCntrlr.PDCData.PsrStatus) === 604 || (parseInt(thisCntrlr.PDCData.PsrStatus) === 605 && thisCntrlr.PDCData.BsdaResetFlag ===                                                  //PCR019492++
				this.getResourceBundle().getText("S1TABLESALESTAGECOL"))) ? (SFAPRBtn.setVisible(false)) : ("");                                                                                        //PCR019492++
			var RcreatSsdaBtnTxt = thisCntrlr.PDCData.Asc606_SsdaFlag === this.getResourceBundle().getText("S2ODATAPOSVAL")? this.getResourceBundle().getText("S2PDCSRRARESETBTNTXTASC606") :           //PCR019492++
				this.getResourceBundle().getText("S2PDCRETESTSSDABTNTXT");                                                                                                                              //PCR019492++
			(parseInt(thisCntrlr.PDCData.PsrStatus) === 660 && (bmoUserFlag === true) && GenInfoData.ActShipDate === "") ? (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET)             //PCR019492++, ActBookDate condition++;PCR022669++:ActBookDate replaced with ActShipDate
				.setVisible(true), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setText(RcreatSsdaBtnTxt)) : ("");                                                                   //PCR019492++
			//************************Start Of PCR019492: ASC606 UI Changes**************
			var rdBtnGrp = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp);
			if(thisCntrlr.PDCData.PsrRequired === "" && thisCntrlr.PDCData.Asc606_Flag === oResource.getText("S2ODATAPOSVAL")){
				if(GenInfoData.Region === oResource.getText("FRAGLLAMJ")){
					rdBtnGrp.getButtons().length >= 4 ? that_views2.getController().createRdBtn(oResource.getText("S2PDCAMJDTXT"), rdBtnGrp): "";                                                       //PCR021481++ Modified length comparison value 3 to 4
				//}if(GenInfoData.ItmDesc.substring(0,4) === oResource.getText("S2PSRDCEVALPROPTXT")){                                                         PCR022669-- 
			    }if(GenInfoData.EvalFlag === this.bundle.getText("S1TABLESALESTAGECOL")){                                                                    //PCR022669++
					rdBtnGrp.getButtons().length >= 4 ? that_views2.getController().createRdBtn(oResource.getText("S2PSRDCNEWEVALTXT"), rdBtnGrp): "";                                                  //PCR021481++ Modified length comparison value 3 to 4, PCR033317++; S2PSRDCEVALTXT replaced with S2PSRDCNEWEVALTXT
				}						
			} else {
				if(rdBtnGrp.getButtons().length > 4){                                                                                                                                                   //PCR021481++ Modified length comparison value 3 to 4
					for(var i = 4; i < rdBtnGrp.getButtons().length; i++){                                                                                                                              //PCR021481++ Modified i value 3 to 4
						rdBtnGrp.getButtons()[i].destroy();
						i--;
					}
				}
			}
			if(thisCntrlr.PDCData.Asc606_BsdaFlag === ""){
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setHeaderText(oResource.getText("S2PSRSDABOOKINGSDAASSE"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_BSDAMTLVL).setText(oResource.getText("S2PSRSDASDAASSES"));
			} else if(thisCntrlr.PDCData.Asc606_BsdaFlag === oResource.getText("S2ODATAPOSVAL")){
				var OppGenInfoModel = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setHeaderText(oResource.getText("S2PSRSDABOOKINGSDAASSEASC606"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_BSDAMTLVL).setText(oResource.getText("S2PSRSDASDAASSES606"));
				var enableFlag = (thisCntrlr.PDCData.PsrStatus === "604" || thisCntrlr.PDCData.PsrStatus === "605" || thisCntrlr.PDCData.PsrStatus === "650") ? true : false;
				var RRAQuesData = thisCntrlr.getRRAQusData(thisCntrlr.PDCData.PsrStatus, thisCntrlr.PDCData.NAV_RRA_QA_PDC, OppGenInfoModel.getData().Region, enableFlag);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
				thisCntrlr.PDCData.ConAnsFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELLBLTXT)
						.setVisible(true), oView.byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELRRAVAL).setVisible(true), oView.byId(com.amat.crm
						.opportunity.Ids.S2PDC_BMOSELRRAVAL).setText(thisCntrlr.PDCData.BmoRraValBsda)) : (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELLBLTXT)
						.setVisible(false), oView.byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELRRAVAL).setVisible(false));
				//************************Start Of PCR019492: 10257 : ASC606 UI Changes**************
				if (parseInt(thisCntrlr.PDCData.PsrStatus) >= 650){
					RRAQuesData.results[RRAQuesData.results.length-1].SelectionIndex > 0 ? (thisCntrlr.PDCData.BmoRraValBsda !== thisCntrlr.PDCData.Bsdl && thisCntrlr.PDCData.Bsdl !== "" ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE)
					  .setVisible(true), this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setValue(thisCntrlr.PDCData.ConComments), this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE)
					  .setTooltip(thisCntrlr.PDCData.ConComments), this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setEnabled(enableFlag)) : this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setVisible(false)):"";
				}
				//************************End Of PCR019492: 10257 : ASC606 UI Changes**************
			}
			if(thisCntrlr.PDCData.Asc606_SsdaFlag  === ""){
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setHeaderText(oResource.getText("S2PSRSDASHIPPINGSDAASSES"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SSDAMTLVL).setText(oResource.getText("S2PSRSDASDAASSES"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setVisible(true);
			} else if(thisCntrlr.PDCData.Asc606_SsdaFlag === oResource.getText("S2ODATAPOSVAL")){
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setHeaderText(oResource.getText("S2PSRSDASHIPPINGSDAASSESASC606"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SSDAMTLVL).setText(oResource.getText(oResource.getText("S2PSRSDASDAASSES606")));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDEP_CHECKBOX).setVisible(false);
			}
			thisCntrlr.PDCData.Asc606_BsdaFlag === oResource.getText("S2ODATAPOSVAL") || thisCntrlr.PDCData.Asc606_SsdaFlag === oResource.getText("S2ODATAPOSVAL") ?
					(oView.byId(com.amat.crm.opportunity.Ids.S2PDC_CNGHISPNL).setVisible(true),oView.byId(com.amat.crm.opportunity.Ids.S2PDC_CNGHISTAB).setModel(
							this.getJSONModel(thisCntrlr.PDCData.NAV_CHANGE_HISTORY_PDC))) : oView.byId(com.amat.crm.opportunity.Ids.S2PDC_CNGHISPNL).setVisible(false);
			((parseInt(thisCntrlr.PDCData.PsrStatus) === 665 || parseInt(thisCntrlr.PDCData.PsrStatus) === 682) && thisCntrlr.PDCData.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ?                  //PCR019492++
			        oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(true): oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false);             //PCR019492++
		    var iconTabTxt = "", manHdrTxt = "";
			(thisCntrlr.PDCData.Asc606_Flag === oResource.getText("S2ODATAPOSVAL") && (thisCntrlr.PDCData.Asc606_BsdaFlag === oResource.getText("S2ODATAPOSVAL") || thisCntrlr.PDCData.Asc606_SsdaFlag === 
				    thisCntrlr.bundle.getText("S2ODATAPOSVAL") || thisCntrlr.PDCData.OldBsdaVal !== "")) ? (iconTabTxt = oResource.getText("S2PDCSDAICONTABFTEXTASC606"), manHdrTxt = oResource.getText(
				    "S2PDCRRATABSTATUSBARTITASC606")) : (iconTabTxt = oResource.getText("S2PDCSDAICONTABFTEXT"), manHdrTxt = oResource.getText("S2PDCTABSTATUSBARTIT"));
			that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setText(iconTabTxt);
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_HDRMAINTXT).setText(manHdrTxt);
			thisCntrlr.PDCData.PsrRequired === "" ? oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_DISPLAY_300).setVisible(true) : 
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_DISPLAY_300).setVisible(false);
			//************************End Of PCR019492: ASC606 UI Changes**************
			//************************Start Of PCR019492: 10257 : ASC606 UI Changes**************
		    if(thisCntrlr.PDCData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") && thisCntrlr.PDCData.PsrRequired === ""){
		    	 oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp).getButtons()[2].setText(thisCntrlr.bundle.getText("S2PSRDCSDANTAPPTXTASC606")); 
		    	 oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp).getParent().getItems()[0].getItems()[0].setText(thisCntrlr.bundle.getText("S2PDCRRAMADATDETRTXTASC606"));
				 that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setText(thisCntrlr.bundle.getText("S2PDCSDAICONTABFTEXTASC606"));
			}
		   //************************End Of PCR019492: 10257 : ASC606 UI Changes**************
		  //************************Start Of PCR025717 Q2C Q4 2019 Enhancements**************
		    if (thisCntrlr.PDCData.NAV_PDC_CC.results.length > 0) {
				var romInitiateFlag = thisCntrlr.checkContact(GenInfoData.NAV_ROM_INFO.results);
				var BMOInitiateFlag = thisCntrlr.checkContact(GenInfoData.NAV_BMO_INFO.results);
				romInitiateFlag === true || BMOInitiateFlag === true ? oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY_BOX)
					.setVisible(true) : oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(false);				
			} else {
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(false);
			}
		  //************************End Of PCR025717 Q2C Q4 2019 Enhancements**************
		},		
		/**
		 * This Method is use For change CheckBox Selection Event In Reset Fragment.
		 *  
		 * @name onSelectedResetCkb
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onSelectedResetCkb: function(oEvent) {
			var ResetData = oEvent.getSource().getModel().getData();
			var lineChange = oEvent.getSource().getBindingContext().getPath().split("/")[oEvent.getSource().getBindingContext().getPath().split(
				"/").length - 1];
			var selectionChange = oEvent.getParameters().selected;
			for (var j = 0; j < ResetData.ItemSet.length; j++) {
				if (j === parseInt(lineChange)) {
					ResetData.ItemSet[j].Selectflag = selectionChange === true ? thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") : "";
				}
			}
		},
		/**
		 * This Method is use For Reset Process Button Press Event.
		 *  
		 * @name onResetProcess
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onResetProcess: function(oEvent) {
			this._initiateControllerObjects(thisCntrlr);
			var sValidate = "ResetChildListSet?$filter=OppId eq '" + that_views2.getController().OppId + "' and ItemNo eq '" + that_views2.getController()
				.ItemNo + "'";
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var ResetData = thisCntrlr.getModelFromCore("ResetChildListModel").getData().results;
			thisCntrlr.ResetType = ResetData.length > 0 ? thisCntrlr.bundle.getText("S2RECRATEDEPTYPTEXT") : thisCntrlr.bundle.getText(
				"S2RECRATEINDEPTYPTEXT");
			var ProcessType = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle.getText(
				"S2ICONTABPSRSDAKEY") ? thisCntrlr.bundle.getText("S2ICONTABPSRTEXT") : thisCntrlr.bundle.getText("S2ICONTABPDCTEXT");
			var oModel = ProcessType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT") ? parseInt(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
				"GLBPSRMODEL")).getData().PsrStatus) < 60 : parseInt(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData()
				.PsrStatus) < 660;
			this.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRPDCONRESETConfirmation"), this);
			if (thisCntrlr.ResetType === thisCntrlr.bundle.getText("S2RECRATEDEPTYPTEXT") && oModel) {
				this.dialog.getContent()[1].setVisible(true);
				for(var i = 0; i < ResetData.length; i++){                                                                                                                      //PCR035760++
					ResetData[i].Selectflag = ResetData[i].Selectflag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? true : false;                                            //PCR035760++
				}                                                                                                                                                               //PCR035760++
				this.dialog.getContent()[1].setModel(this.getJSONModel({
					"ItemSet": ResetData
				}));
			}
			this.getCurrentView().addDependent(this.dialog);
			this.dialog.open();
		},
		/**
		 * This method is used to handles Live Change Event From Reset Functionality.
		 * 
		 * @name OnRsetCommLvchng
		 * @param oEvent - Holds the current event
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
		 *  
		 * @name resetConfirmationOK
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		resetConfirmationOK: function(oEvent) {
			var recreateMsg = this.dialog.getContent()[0].getContent()[1].getValue();
			var ResetData = "",
				SuccessMsg = "";
			var oResource = thisCntrlr.bundle;
			if (thisCntrlr.ResetType === oResource.getText("S2RECRATEDEPTYPTEXT")) {
				ResetData = this.dialog.getContent()[1].getModel() !== undefined ? this.dialog.getContent()[1].getModel().getData() : "";
			}
			this.dialog.close();
			this.dialog.destroy();
			var payload = {};
			var GenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData();
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource.getText("S2ICONTABPSRSDAKEY")) {
				var psrData = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBPSRMODEL")).getData();
			} else {
				var PDCData = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBPDCSDAMODEL")).getData();
			}
			var sdaType = (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource.getText("S2ICONTABPSRSDAKEY") ?
				oResource.getText("S2ICONTABPSRTEXT") : oResource.getText("S2ICONTABPDCTEXT"));
			var processType = (sdaType === oResource.getText("S2ICONTABPSRTEXT")) ? (oResource.getText("S2ICONTABPSRSDAKEY")) : (oResource.getText(
				"S2ICONTABPDCSDAKEY"));
			var processSubType = (sdaType === oResource.getText("S2ICONTABPSRTEXT")) ? (parseInt(psrData.PsrStatus) === 60 ? oResource.getText(
				"S2RECRATESSDATYPTEXT") : oResource.getText("S2RECRATEBSDATYPTEXT")) : (parseInt(PDCData.PsrStatus) === 660 ? oResource.getText(
				"S2RECRATESSDATYPTEXT") : oResource.getText("S2RECRATEBSDATYPTEXT"));
			sap.ui.core.BusyIndicator.show();
			if (thisCntrlr.ResetType === oResource.getText("S2RECRATEINDEPTYPTEXT") || processSubType === oResource.getText(
					"S2RECRATESSDATYPTEXT")) {
				payload.Guid = GenInfoModel.Guid;
				payload.ItemGuid = GenInfoModel.ItemGuid;
				payload.Ptype = sdaType;
				payload.step = (sdaType === oResource.getText("S2ICONTABPSRTEXT")) ? (parseInt(psrData.PsrStatus) === 60 ? oResource.getText(
					"S2RECRATESSDATYPTEXT") : oResource.getText("S2RECRATEBSDATYPTEXT")) : (parseInt(PDCData.PsrStatus) === 660 ? oResource.getText(
					"S2RECRATESSDATYPTEXT") : oResource.getText("S2RECRATEBSDATYPTEXT"));
				payload.Comments = recreateMsg;
				SuccessMsg = processType + " " + processSubType + " " + oResource.getText("S2RECRATEPOSMSG");
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ResetSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, payload, SuccessMsg);
			} else if (thisCntrlr.ResetType === oResource.getText("S2RECRATEDEPTYPTEXT")) {
				payload.Guid = GenInfoModel.Guid;
				payload.ItemGuid = GenInfoModel.ItemGuid;
				payload.OppId = that_views2.getController().OppId;
				payload.ItemNo = that_views2.getController().ItemNo;
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
						//obj.Selectflag = ResetData.ItemSet[k].Selectflag;                                                                                                          //PCR035760--
						obj.Selectflag = ResetData.ItemSet[k].Selectflag === true ? "X" : "";                                                                                        //PCR035760++
						payload.nav_reset_child.push(obj);
					}
				}
				SuccessMsg = processType + " " + processSubType + " " + oResource.getText("S2RECRATEPOSMSG");
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ResetChildListSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, payload, SuccessMsg);
			}
			sap.ui.core.BusyIndicator.hide();
			this._initiateControllerObjects(thisCntrlr);
			if (sdaType === oResource.getText("S2ICONTABPSRTEXT")) {
				that_psrsda.getController().getRefreshPSRData(GenInfoModel.Guid, GenInfoModel.ItemGuid);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RESET_LIST_PANEL).setExpanded(false);
			} else if (sdaType === oResource.getText("S2ICONTABPDCTEXT")) {
				thisCntrlr.checkPDCInitiate();
				thisCntrlr.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_CARBON_COPY).setEnabled(false);
				thisCntrlr.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RESET_LIST_PANEL).setExpanded(false);
			}
			thisCntrlr.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL).setExpanded(false);
			that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL).setExpanded(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setVisible(false);
			that_views2.getController().setIconTabFilterColor();
		},
		//*****************Start Of PCR025717 Q2C Q4 2019 Enhancements************************************
		/**
		 * This method is used to Delink carbon copy child opportunity.
		 * 
		 * @name onPressDeLink
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onPressDeLink: function(oEvent){
			this.CbnType = "";
			that_views2 === undefined ? thisCntrlr._initiateControllerObjects() : "";
			var iconTabBtn = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB), DlnkCData = "";
			if (iconTabBtn.getSelectedKey() === thisCntrlr.bundle.getText("S2ICONTABPDCSDAKEY")) {
				this.CbnType = thisCntrlr.bundle.getText("S2PDCDLINKTYPTXT");
				DlnkCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().NAV_PDC_CC;
			} else {
				this.CbnType = thisCntrlr.bundle.getText("S2PSRDLINKTYPTXT");
				DlnkCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().NAV_PSR_CC;
			}
			for (var i = 0; i < DlnkCData.results.length; i++) {
				DlnkCData.results[i].Selected === undefined ? DlnkCData.results[i].Selected = false : "";
			}
			this.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRCBCCCF4helpOppLink"), this);
			this.dialog.getContent()[2].getColumns()[0].setVisible(true);
			this.dialog.getContent()[2].getColumns()[2].setVisible(true);
			this.dialog.getContent()[0].setVisible(true);
			this.dialog.getContent()[1].setVisible(true);
			this.dialog.getContent()[1].setValueState(thisCntrlr.bundle.getText("S2ERRORVALSATETEXT"));
			this.dialog.getButtons()[0].setEnabled(false);
			this.dialog.getSubHeader().setVisible(true);
			this.getCurrentView().addDependent(this.dialog);
			var oDLinkCCFragData = this.getJSONModel(DlnkCData);
			this.dialog.setModel(oDLinkCCFragData);
			this.dialog.open();
		},
		/**
		 * This method is used to handles Search functionality.
		 * 
		 * @name searchOpportunity
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		searchOpportunity: function(oEvent) {
			var oFilter;
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var aFilters = [new sap.ui.model.Filter(thisCntrlr.bundle.getText("S2OPPAPPOPPIDKEY"), sap.ui.model
					.FilterOperator.Contains, sQuery)]
				oFilter = new sap.ui.model.Filter(aFilters, false);
			}
			var binding = this.dialog.getContent()[2].getBinding("items");
			binding.filter(oFilter);
		},
		//*****************End Of PCR025717 Q2C Q4 2019 Enhancements************************************
		/**
		 * This method is used to handles PSR-SDA Carbon Copy F4 Help.
		 * 
		 * @name handleValueHelpCbnCpyRew
		 * @param
		 * @returns
		 */
		handleValueHelpCbnCpyRew: function() {
			var ItemGuid = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData()
				.ItemGuid;
			this.CbnType = "";
			var iconTabBtn = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB);
			if (iconTabBtn.getSelectedKey() === thisCntrlr.bundle.getText("S2ICONTABPDCSDAKEY")) {
				var sGenaralChoos = "CustDoclinkSet?$filter=ItemGuid eq guid'" + ItemGuid + "'" +
					"and OppId eq 'PDC'";
				this.CbnType = thisCntrlr.bundle.getText("S2ICONTABPDCTEXT");
			} else {
				var sGenaralChoos = "CustDoclinkSet?$filter=ItemGuid eq guid'" + ItemGuid + "'" +
					"and OppId eq 'PSR'";
				this.CbnType = thisCntrlr.bundle.getText("S2ICONTABPSRTEXT");
			}
			this.serviceCall(sGenaralChoos, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var CCTableData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_TABLE)
				.getModel().getData().results;
			var PDCCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCCCPYMODEL")).getData();
			for (var i = 0; i < PDCCData.results.length; i++) {
				for (var j = 0; j < CCTableData.length; j++) {
					if (PDCCData.results[i].OppId === CCTableData[j].OppId && PDCCData.results[i].ItemNo ===
						CCTableData[j].ItemNo) {
						PDCCData.results[i].Selected = true;
					}
				}
				PDCCData.results[i].Selected === undefined ? PDCCData.results[i].Selected = false : "";
			}
			this.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRCBCCCF4helpOppLink"), this);
			this.dialog.getContent()[2].getColumns()[0].setVisible(true);                                                                                 //PCR025717++; getContent()[0] replaced with getContent()[2]
			this.dialog.getContent()[2].getColumns()[2].setVisible(true);                                                                                 //PCR025717++
			this.dialog.getSubHeader().setVisible(true);
			this.getCurrentView().addDependent(this.dialog);
			var CbnCpyFragData = this.getJSONModel(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCCCPYMODEL")).getData());
			this.dialog.setModel(CbnCpyFragData);
			this.dialog.open();
		},
		/**
		 * This method is used to Validate Contact list in Different Level of PSR-SDA.
		 * 
		 * @name validatePSRContact
		 * @param
		 * @returns ConFlag - Array with Contact Maintenance flag and Contact Type.
		 */
		validatePSRContact: function() {
			var GenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			var oResource = thisCntrlr.bundle;
			var ConFlag = [];
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource
				.getText("S2ICONTABPSRSDAKEY")) {
				var PSRData = thisCntrlr.getModelFromCore(oResource.getText("GLBPSRMODEL")).getData();
				if (parseInt(PSRData.PsrStatus) === 5 || parseInt(PSRData.PsrStatus) === 4) {
					if (GenInfoModel.NAV_ROM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2GINFOPANLCONINFOROMTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_SALES_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2PSRWFAPPPANLSALESINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_ASM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2GINFOPANLCONINFOACCSMETIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_BMO_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2PSRWFAPPPANLBMOINFOCONTIT")];
						return ConFlag;
					}
				} else {
					if (GenInfoModel.NAV_GPM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2PSRWFAPPPANLGPMINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_TPS_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2PSRWFAPPPANLTPSINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_BMHEAD_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2PSRWFAPPPANLBMHDINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_CON_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2GINFOPANLCONINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_KPU_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2GINFOPANLCONINFOBLHEADTIT")];
						return ConFlag;
					}
				}
			} else {
				var PDCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
				if (parseInt(PDCData.PsrStatus) >= 605 || parseInt(PDCData.PsrStatus) >= 604) {
					if (GenInfoModel.NAV_ROM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2GINFOPANLCONINFOROMTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_SALES_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2PSRWFAPPPANLSALESINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_BMO_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2PSRWFAPPPANLBMOINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_POM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2GINFOPANLCONINFOPOMTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_GSM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2GSMKEY")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_RBM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2RBMKEY")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_KPU_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2GINFOPANLCONINFOBLHEADTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_CON_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, oResource.getText("S2GINFOPANLCONINFOCONTIT")];
						return ConFlag;
					}
				}
			}
			return ConFlag;
		},
		/** Keep
		 * This Method is use on submit for approval event.
		 *  
		 * @name onSubmitPDCSDA
		 * @param Event - Holds the current event
		 * @returns 
		 */
		onSubmitPDCSDA: function(Event) {
			sap.ui.core.BusyIndicator.show();
			var oResource = thisCntrlr.bundle;
			var oView = thisCntrlr.getView();
			if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).getText() === oResource
				.getText("S2PSRSDASUBFORAPP")) {
				var validate = this.validatePDCBFA();
				if (validate[0] === false) {
					thisCntrlr.showToastMessage(validate[1]);
				} else {
					var ContCheck = this.validatePSRContact();
					if (ContCheck[0] === false) {
						/*thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCSFACONVLIDMSG") + " " +
						ContCheck[1]);*/                                                                                                          //PCR028711--; modify contacts message
						thisCntrlr.showToastMessage(oResource.getText("S2PSRCONTACTS"));                                                          //PCR028711++; modify contacts message
					} else {
						var ErrorFlag = this.ValidatePDCData();
						if (ErrorFlag === true) {
							thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCSFAFAILMSG"));
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(false);
						} else {
							var PSRModel = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
							var ValidAssesLevel = false;
							if (parseInt(PSRModel.PsrStatus) === 665) {
								(PSRModel.Bsdl.concat(PSRModel.Bd) === PSRModel.Ssdl.concat(PSRModel.Sd)) ? (ValidAssesLevel =
									true) : (ValidAssesLevel = false);
							}
							if (ValidAssesLevel === true) {
								//thisCntrlr.showToastMessage(oResource.getText("S2PSRPDCSDABSSDAROUTFAILMSG"));                                  //PCR020999--
								if(PSRModel.Asc606_SsdaFlag === ""){                                                                              //PCR020999++
									thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRPDCSDABSSDAROUTFAILMSG"));                        //PCR020999++
								}else if(PSRModel.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                                //PCR020999++
									thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRPDCSDABSSDAROUTFAILMSGASC606"));                  //PCR020999++
								}
							} else {
								that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setVisible(false);
								var OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));
								this.getPDCData();
								that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor
									.Critical);
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setVisible(false);
								oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setVisible(false);
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
								that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(true);
								that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(true);
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setVisible(true);
								var obj = {};
								if (parseInt(PSRModel.PsrStatus) < 660) {
									obj.NAV_PDC_QA_SAF = {};
									obj.NAV_PDC_QA_SAF.BmoFlg = PSRModel.NAV_PDC_QA_SAF.BmoFlg;
									obj.NAV_PDC_QA_SAF.ChangedBy = PSRModel.NAV_PDC_QA_SAF.ChangedBy;
									//obj.NAV_PDC_QA_SAF.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                           //PCR035760-- Defect#131 TechUpgrade changes
									obj.NAV_PDC_QA_SAF.Guid = OppGenInfoModel.getData().Guid;
									obj.NAV_PDC_QA_SAF.ItemGuid = OppGenInfoModel.getData().ItemGuid;
									obj.NAV_PDC_QA_SAF.ItemNo = PSRModel.NAV_PDC_QA_SAF.ItemNo;
									obj.NAV_PDC_QA_SAF.OppId = PSRModel.NAV_PDC_QA_SAF.OppId;
									obj.NAV_PDC_QA_SAF.QaVer = PSRModel.NAV_PDC_QA_SAF.QaVer;                                               //PCR019492++
									obj.NAV_PDC_QA_SAF.Qdesc = PSRModel.NAV_PDC_QA_SAF.Qdesc;
									obj.NAV_PDC_QA_SAF.Qid = PSRModel.NAV_PDC_QA_SAF.Qid;
									obj.NAV_PDC_QA_SAF.Qtype = PSRModel.NAV_PDC_QA_SAF.Qtype;
									obj.NAV_PDC_QA_SAF.SalesFlg = PSRModel.NAV_PDC_QA_SAF.SalesFlg;
								}
								obj.NAV_PDC_QA_SAF = {};
								obj.NAV_PDC_QA_SAF.BmoFlg = PSRModel.NAV_PDC_QA_SAF.BmoFlg;
								obj.NAV_PDC_QA_SAF.ChangedBy = PSRModel.NAV_PDC_QA_SAF.ChangedBy;
								//obj.NAV_PDC_QA_SAF.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                               //PCR035760-- Defect#131 TechUpgrade changes
								obj.NAV_PDC_QA_SAF.Guid = OppGenInfoModel.getData().Guid;
								obj.NAV_PDC_QA_SAF.ItemGuid = OppGenInfoModel.getData().ItemGuid;
								obj.NAV_PDC_QA_SAF.ItemNo = PSRModel.NAV_PDC_QA_SAF.ItemNo;
								obj.NAV_PDC_QA_SAF.OppId = PSRModel.NAV_PDC_QA_SAF.OppId;
								obj.NAV_PDC_QA_SAF.QaVer = PSRModel.NAV_PDC_QA_SAF.QaVer;                                                   //PCR019492++
								obj.NAV_PDC_QA_SAF.Qdesc = PSRModel.NAV_PDC_QA_SAF.Qdesc;
								obj.NAV_PDC_QA_SAF.Qid = PSRModel.NAV_PDC_QA_SAF.Qid;
								obj.NAV_PDC_QA_SAF.Qtype = PSRModel.NAV_PDC_QA_SAF.Qtype;
								obj.NAV_PDC_QA_SAF.SalesFlg = PSRModel.NAV_PDC_QA_SAF.SalesFlg;
								obj.CcOppId = thisCntrlr.that_views2.getController().OppId;
								obj.CcOpitmId = thisCntrlr.that_views2.getController().ItemNo;
								obj.Guid = OppGenInfoModel.getData().Guid;
								obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
								obj.PsrRequired = PSRModel.PsrRequired;
								obj.PsrType = PSRModel.PsrType;
								(parseInt(PSRModel.PsrStatus) < 655) ? (obj.PsrStatus = "640") : (obj.PsrStatus = "670");
								obj.Bsdl = PSRModel.Bsdl;
								obj.ConComments = PSRModel.ConComments;                                                                     //PCR019492++ 
								obj.Ssdl = PSRModel.Ssdl;
								obj.Bd = PSRModel.Bd;
								obj.Sd = PSRModel.Sd;
								obj.BsdaJustfication = PSRModel.BsdaJustfication;
								obj.SsdaJustfication = PSRModel.SsdaJustfication;
								obj.SsdaReq = PSRModel.SsdaReq;
								obj.RevOpitmId = PSRModel.RevOpitmId;
								obj.RevOppId = PSRModel.RevOppId;
								obj.Custno = PSRModel.Custno;
								obj.ActionType = oResource.getText("S2CBCSALESUCSSANS");
								obj.TaskId = "";
								obj.AprvComments = "";
								obj.WiId = "";
								obj.PsrStatDesc = "";
								obj.InitiatedBy = "";
								//obj.InitiatedDt = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                     //PCR035760-- Defect#131 TechUpgrade changes
								obj.Time = oResource.getText("S2OPPAPPPAYLODTMEKEY");
								this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat
									.crm.opportunity.util.ServiceConfigConstants.write, obj, oResource.getText(
										"S2PSRSDACBCSFASUBMITSUCSSMSG"));
								this.checkPDCInitiate();
								that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false);
								that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false);
								thisCntrlr.PDCDisMode();
								that_views2.getController().onNavBack();                                                                            //PCR019492++
							}
						}
					}
				}
			} else if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).getText() === oResource.getText("S2PSRSDASFSSDAINITTXT") ||
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).getText() === oResource.getText("S2PSRDCINITRRABTNTXTASC606")) {
				var bmoUserList = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData()
					.NAV_BMO_INFO.results;
				var bmoUserFlag = this.checkContact(bmoUserList)
				if (bmoUserFlag === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
				} else {
					if (thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData().InitSsda !==
						oResource.getText("S2ODATAPOSVAL")) {
						thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
					} else {
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(
							true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CONTACTINFO_PANEL).setVisible(
							true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CONTACTINFO_PANEL).setExpanded(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setVisible(
							true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setExpanded(
							true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
							true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setValueState(
							"Error");
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
							true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SMANDAT_FID).addStyleClass(
							"classMandatFld");
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setVisible(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPPROVALS_PANEL).setVisible(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL).setVisible(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BAPPROVAL_PANEL).setVisible(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
							true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_PANEL).setVisible(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_360).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setVisible(
							true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setVisible(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(oResource
							.getText("S2PSRSDACANBTNTXT"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(oResource.getText("S2CANCELBTNICON"));
//						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(oResource.getText("S2PSRSDASFCONSSDAINITTXT"));                        //PCR019492--
						var PSRModel = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();                                                    //PCR019492++
						var canSSDATxt = PSRModel.Asc606_SsdaFlag === oResource.getText("S2ODATAPOSVAL") ? oResource.getText("S2PSRSDASFCONSSDAINITTXTASC606"):       //PCR019492++
							oResource.getText("S2PSRSDASFCONSSDAINITTXT");                                                                                            //PCR019492++
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(canSSDATxt);                                                           //PCR019492++
						var SSDAMandatTxt = PSRModel.Asc606_Flag === oResource.getText("S2ODATAPOSVAL") ? oResource.getText("S2PSRSDASHIPPINGLEVQUESTIONASC606"):     //PCR019492++
							oResource.getText("S2PSRSDASHIPPINGLEVQUESTION");                                                                                         //PCR019492++
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SMANDAT_FID).setText(SSDAMandatTxt);                                                   //PCR019492++
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(false);
					}
				}
			} else if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).getText() === oResource.getText("S2PSRSDASFCONSSDAINITTXT") ||
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).getText() === oResource.getText("S2PSRSDASFCONSSDAINITTXTASC606")) {               //PCR019492++
				var bmoUserList = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData()
					.NAV_BMO_INFO.results;
				var bmoFlag = this.checkContact(bmoUserList);
				if (bmoFlag === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
				} else {
					var OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText(
						"GLBOPPGENINFOMODEL"));
					var PSRModel = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
					var obj = {};
					obj.Guid = OppGenInfoModel.getData().Guid;
					obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
					obj.PsrRequired = PSRModel.PsrRequired;
					obj.PsrType = PSRModel.PsrType;
					obj.PsrStatus = "655";
					obj.Bsdl = PSRModel.Bsdl;
					obj.ConComments = PSRModel.ConComments;                                                                                                          //PCR019492++
					obj.Ssdl = "";
					obj.Bd = PSRModel.Bd;
					obj.Sd = "";
					obj.BsdaJustfication = PSRModel.BsdaJustfication;
					obj.SsdaJustfication = PSRModel.SsdaJustfication;
					obj.AprvComments = "";
					obj.ActionType = "";
					obj.TaskId = "";
					obj.WiId = "";
					obj.PsrStatDesc = "";
					obj.InitiatedBy = "";
					obj.SsdaReq = "";
					//obj.InitiatedDt = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                  //PCR035760-- Defect#131 TechUpgrade changes
					obj.Time = oResource.getText("S2OPPAPPPAYLODTMEKEY");
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, obj, oResource.getText(
							"S2PDCSSDAINITREVRTSUCSSMSG"));
					this.setPDCVisibility("Y");
					this.getPDCData();
					thisCntrlr.PDCDisMode();
					that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setIconColor(sap.ui.core.IconColor.Positive);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setEnabled(true);
//					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(oResource.getText("S2PSRSDASFSSDAINITTXT"));                      //PCR019492--
					var initSSDATxt = PSRModel.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? oResource.getText("S2PSRDCINITRRABTNTXTASC606"): //PCR019492++
						oResource.getText("S2PSRSDASFSSDAINITTXT");                                                                                          //PCR019492++
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(initSSDATxt);                                                     //PCR019492++
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPPROVALS_PANEL).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LOOKUP_LISTBtn).setVisible(true);
					//************************Start Of PCR019492: ASC606 UI Changes**************
				    if(PSRModel.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
						var RRAQuesData = thisCntrlr.getRRAQusData(PSRModel.PsrStatus, PSRModel.NAV_RRA_QA_PDC, OppGenInfoModel.getData().Region, false);
						this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
					}
					//************************End Of PCR019492: ASC606 UI Changes**************
				}
			} else if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).getText() === oResource
				.getText("S2PSRSDASFCANINITXT")) {
				var bmoUserList = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData()
					.NAV_BMO_INFO.results;
				var bmoFlag = this.checkContact(bmoUserList);
				if (bmoFlag === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
				} else {
					sap.ui.core.BusyIndicator.hide();
					//***************Start Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
					var Mesg = thisCntrlr.bundle.getText("S2CANINITMSG1") + thisCntrlr.bundle.getText("S2PDCRRACANINITMSG2");
					sap.m.MessageBox.confirm(Mesg, this.confirmationCanInit, thisCntrlr.bundle.getText("S2PSRSDACBCCONDIALOGTYPTXT"));					
					//var OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText(
					//	"GLBOPPGENINFOMODEL"));
					//var PSRModel = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
					//var obj = {};
					//obj.Guid = OppGenInfoModel.getData().Guid;
					//obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
					//obj.PsrRequired = "";
					//obj.PsrType = PSRModel.PsrType;
					//obj.PsrStatus = "";
					//obj.Bsdl = PSRModel.Bsdl;
					//obj.ConComments = PSRModel.ConComments;                                                                                                     //PCR019492++
					//obj.Ssdl = PSRModel.Ssdl;
					//obj.Bd = PSRModel.Bd;
					//obj.Sd = PSRModel.Sd;
					//obj.BsdaJustfication = PSRModel.BsdaJustfication;
					//obj.SsdaJustfication = PSRModel.SsdaJustfication;
					//obj.AprvComments = "";
					//obj.ActionType = "";
					//obj.TaskId = "";
					//obj.WiId = "";
					//obj.PsrStatDesc = "";
					//obj.InitiatedBy = "";
					//obj.SsdaReq = "";
					//obj.InitiatedDt = oResource.getText("S2OPPAPPPAYLODDATKEY");
					//obj.Time = oResource.getText("S2OPPAPPPAYLODTMEKEY");
					//this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm.opportunity
					//	.util.ServiceConfigConstants.write, obj, oResource.getText(
					//		"S2PDCINITREVRTSUCSSMSG"));
					//this.setPDCVisibility("");
					//this.getPDCData();
					//thisCntrlr.PDCDisMode();
					//that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Default);
					//that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setText(oResource.getText("S2PDCSDAICONTABFTEXTASC606"));                 //PCR020999++
					//***************End Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
				}
			}
			that_views2.getController().setIconTabFilterColor();
			sap.ui.core.BusyIndicator.hide();
		},
		//***************Start Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
		/**
		 * This Method is use on PDC Cancel Initiation dialog box Ok Button press event.
		 *  
		 * @name confirmationCanInit
		 * @param Event - Holds the current event
		 * @returns 
		 */
		confirmationCanInit: function(oEvent) {
			if(oEvent === thisCntrlr.getResourceBundle().getText("S2CONFFRGOKBTN")){
				sap.ui.core.BusyIndicator.show();
				var oResource = thisCntrlr.bundle;
				var OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));
				var PSRModel = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
				var obj = {};
				obj.Guid = OppGenInfoModel.getData().Guid;
				obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
				obj.PsrRequired = "";
				obj.PsrType = PSRModel.PsrType;
				obj.PsrStatus = "";
				obj.Bsdl = PSRModel.Bsdl;
				obj.ConComments = PSRModel.ConComments;
				obj.Ssdl = PSRModel.Ssdl;
				obj.Bd = PSRModel.Bd;
				obj.Sd = PSRModel.Sd;
				obj.BsdaJustfication = PSRModel.BsdaJustfication;
				obj.SsdaJustfication = PSRModel.SsdaJustfication;
				obj.AprvComments = "";
				obj.ActionType = "";
				obj.TaskId = "";
				obj.WiId = "";
				obj.PsrStatDesc = "";
				obj.InitiatedBy = "";
				obj.SsdaReq = "";
				//obj.InitiatedDt = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                 //PCR035760-- Defect#131 TechUpgrade changes
				obj.Time = oResource.getText("S2OPPAPPPAYLODTMEKEY");
				thisCntrlr.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, oResource.getText(
						"S2PDCINITREVRTSUCSSMSG"));
				thisCntrlr.setPDCVisibility("");
				thisCntrlr.getPDCData();
				thisCntrlr.PDCDisMode();
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Default);
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setText(oResource.getText("S2PDCSDAICONTABFTEXTASC606"));
				that_views2.getController().setIconTabFilterColor();
				sap.ui.core.BusyIndicator.hide();
			}			
		},
		//***************End Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
		/** Keep
		 * This Method is use on PDC Initiate Radio Button event.
		 *  
		 * @name onSelectPDCMandat
		 * @param Event - Holds the current event
		 * @returns 
		 */
		onSelectPDCMandat: function(oEvent) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oView = thisCntrlr.getView();
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setValueState(thisCntrlr.bundle.getText(
				"S2DELNAGVIZTEXT"));
			oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SMANDAT_FID).addStyleClass("classMandatAftrAns");
			if (oEvent.getParameters().selectedIndex === 1) {
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setSelectedIndex(-1);
				this.onInitiatePDCSSDA();
				this.setPDCVisibility(thisCntrlr.bundle.getText("S2POSMANDATANS"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.bundle
					.getText("S2PSRSDAEDITICON"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.bundle
					.getText("S2PSRSDAEDITBTNTXT"));
				this.onEditPDCSDA();
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CONTACTINFO_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CONTACTINFO_PANEL).setExpanded(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setExpanded(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setExpanded(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPPROVALS_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPPROVALS_PANEL).setExpanded(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL).setExpanded(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BAPPROVAL_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_PANEL).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_360).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setEnabled(true);
//				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(thisCntrlr.bundle.getText("S2PSRSDASFCONSSDAINITTXT"));                          //PCR019492--
				var PSRModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData();                                                      //PCR019492++
				var canSSDATxt = PSRModel.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? thisCntrlr.bundle.getText("S2PSRSDASFCONSSDAINITTXTASC606"): //PCR019492++
					thisCntrlr.bundle.getText("S2PSRSDASFCONSSDAINITTXT");                                                                                              //PCR019492++
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(canSSDATxt);                                                                     //PCR019492++
			} else {
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setSelectedIndex(-1);
				this.onPDCSSDANotReq();
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GENARALDATA_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CONTACTINFO_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BAPPROVAL_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_360).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setVisible(false);
			}
			myBusyDialog.close();
		},
		/**
		 * This Method is use on PDC Initiate PDC Method.
		 *  
		 * @name onInitiatePDCSSDA
		 * @param 
		 * @returns 
		 */
		onInitiatePDCSSDA: function() {
			var oResource = thisCntrlr.bundle;
			var PDCModel = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
			var OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));
			var obj = {};
			obj.ActionType = "";
			obj.AprvComments = PDCModel.AprvComments;
			obj.Bd = PDCModel.Bd;
			obj.Bsdl = PDCModel.Bsdl;
			obj.ConComments = PDCModel.ConComments;                                                                                                              //PCR019492++
			obj.Custno = PDCModel.Custno;
			obj.Guid = OppGenInfoModel.getData().Guid;
			obj.InitiatedBy = "";
			//obj.InitiatedDt = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                      //PCR035760-- Defect#131 TechUpgrade changes
			obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
			obj.PsrRequired = PDCModel.PsrRequired;
			obj.PsrStatDesc = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().ProductLine;
			obj.PsrStatus = "665";
			obj.PsrType = PDCModel.PsrType;
			obj.RevOpitmId = PDCModel.RevOpitmId;
			obj.RevOppId = PDCModel.RevOppId;
			obj.Sd = PDCModel.Sd;
			obj.SsdaReq = oResource.getText("S2POSMANDATANS");
			obj.Ssdl = PDCModel.Ssdl;
			obj.TaskId = PDCModel.TaskId;
			obj.Time = oResource.getText("S2OPPAPPPAYLODTMEKEY");
			obj.WiId = PDCModel.WiId;
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm.opportunity
				.util.ServiceConfigConstants.write, obj, oResource.getText("S2PSRSDASSDAINITPOSTXT"));
			this.setPDCVisibility(oResource.getText("S2POSMANDATANS"));
			this.getPDCData();
//			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(oResource.getText("S2PSRSDASFCONSSDAINITTXT"));                 //PCR019492--
			var canSSDATxt = PDCModel.Asc606_SsdaFlag === oResource.getText("S2ODATAPOSVAL") ? oResource.getText("S2PSRSDASFCONSSDAINITTXTASC606"):               //PCR019492++
				oResource.getText("S2PSRSDASFCONSSDAINITTXT");                                                                                                    //PCR019492++
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(canSSDATxt);                                                    //PCR019492++
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setIcon(this.getResourceBundle().getText("S2CANCELBTNICON"));           //PCR019492++
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
				false);
		},
		/**
		 * This Method is use on PDC Not Applicable Method.
		 *  
		 * @name onPDCSSDANotReq
		 * @param 
		 * @returns 
		 */
		onPDCSSDANotReq: function() {
			var oResource = thisCntrlr.bundle;
			var PDCModel = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
			var OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));
			var obj = {};
			obj.ActionType = "";
			obj.AprvComments = PDCModel.AprvComments;
			obj.Bd = PDCModel.Bd;
			obj.Bsdl = PDCModel.Bsdl;
			obj.ConComments = PDCModel.ConComments;                                                                                                          //PCR019492++
			obj.Custno = PDCModel.Custno;
			obj.Guid = OppGenInfoModel.getData().Guid;
			obj.InitiatedBy = "";
			//obj.InitiatedDt = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                   //PCR035760-- Defect#131 TechUpgrade changes
			obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
			obj.PsrRequired = PDCModel.PsrRequired;
			obj.PsrStatDesc = "";
			obj.PsrStatus = "685";
			obj.PsrType = PDCModel.PsrType;
			obj.RevOpitmId = PDCModel.RevOpitmId;
			obj.RevOppId = PDCModel.RevOppId;
			obj.Sd = PDCModel.Sd;
			obj.SsdaReq = oResource.getText("S2NEGMANDATANS");
			obj.Ssdl = PDCModel.Ssdl;
			obj.TaskId = PDCModel.TaskId;
			obj.Time = oResource.getText("S2OPPAPPPAYLODTMEKEY");
			obj.WiId = PDCModel.WiId;
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm.opportunity
				.util.ServiceConfigConstants.write, obj, oResource.getText(
					"S2PSRSDAPDCSSDANTREQSAVMSG"));
			this.setPDCVisibility(oResource.getText("S2POSMANDATANS"));
			this.getPDCData();
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(true);
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setEnabled(true);
//			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(oResource.getText("S2PSRSDASFCONSSDAINITTXT"));           //PCR019492--
			var canSSDATxt = PDCModel.Asc606_SsdaFlag === oResource.getText("S2ODATAPOSVAL") ? oResource.getText("S2PSRSDASFCONSSDAINITTXTASC606"):         //PCR019492++
				oResource.getText("S2PSRSDASFCONSSDAINITTXT");                                                                                              //PCR019492++
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(canSSDATxt);                                              //PCR019492++
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setVisible(false);
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setVisible(false);
		},
		/** Keep
		 * This method is used to handles PDC submit For Approval Button event.
		 * 
		 * @name onSavePDCSDA
		 * @param
		 * @returns
		 */
		onSavePDCSDA: function() {
			sap.ui.core.BusyIndicator.show();
			var oResource = thisCntrlr.bundle;
			var PDCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
			var oView = thisCntrlr.getView();
			(parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) === 604 || parseInt(PDCData.PsrStatus) >=
				655) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(
				oResource.getText("S2PSRSDASUBFORAPP"))) : ("");
			var ErrorFlag = this.ValidatePDCData();
			if (ErrorFlag === true) {
				var RRAReqFlag = false, notInitial = false;                                                                                                         //PCR019492++
				var RRAQuesData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).getModel().getData();                                           //PCR019492++
				for(var p = 0; p < RRAQuesData.results.length ; p++){                                                                                               //PCR019492++
					if(RRAQuesData.results[p].SalesFlg !== ""){                                                                                                     //PCR019492++
						notInitial = true;                                                                                                                          //PCR019492++
						break;                                                                                                                                      //PCR019492++
					}                                                                                                                                               //PCR019492++
				}                                                                                                                                                   //PCR019492++
				if(PDCData.Asc606_BsdaFlag === oResource.getText("S2ODATAPOSVAL") && notInitial === true && (parseInt(PDCData.PsrStatus) === 605 || parseInt(       //PCR019492++
						PDCData.PsrStatus) === 604 || parseInt(PDCData.PsrStatus) === 650)){                                                                        //PCR019492++
					for(var p = 0; p < RRAQuesData.results.length ; p++){                                                                                           //PCR019492++
						if(RRAQuesData.results[p].valueState === oResource.getText("S2ERRORVALSATETEXT")){                                                          //PCR019492++
							RRAReqFlag = true;                                                                                                                      //PCR019492++
							break;                                                                                                                                  //PCR019492++
						}                                                                                                                                           //PCR019492++
					}                                                                                                                                               //PCR019492++
				}				                                                                                                                                    //PCR019492++
				if (RRAReqFlag === true) {                                                                                                                          //PCR019492++
					thisCntrlr.showToastMessage(oResource.getText("S2PSRPDCSDABSSDARRAQUSMSGASC606"));                                                              //PCR019492++
				} else {
					var obj = this.PDCSDAPayload(PDCData.PsrStatus, oResource.getText("S2PSRSDASAVETXT"),
							oResource.getText("S2PSRSDASUBFORAPP"));
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, obj, oResource.getText(
								"S2PSRSDACBCSFAFAILWDSAVEMSG"));
					this.getPDCData();
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setEnabled(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(false);
				}                                                                                                                                                   //PCR019492++
				(parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) === 604) && (PDCData.RevOppId !== "" && PDCData.RevOpitmId === "") ?            //PCR021481++
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(true) : oView.byId(com.amat.crm.opportunity.      //PCR021481++
								Ids.S2PDC_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(false);                                                                       //PCR021481++
			} else {
				if (parseInt(PDCData.PsrStatus) === 650 || parseInt(PDCData.PsrStatus) === 682) {
					var obj = this.PDCSDAPayload(PDCData.PsrStatus, oResource.getText(
						"S2PSRSDASAVETXT"), oResource.getText("S2PSRSDASUBFORAPP"));
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm
						.opportunity.util.ServiceConfigConstants.write, obj, oResource.getText(
							"S2PSRSDADATASAVETXT"));
					this.getPDCData();
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(oResource
						.getText("S2PSRSDACANBTNTXT"));
					thisCntrlr.onEditPDCSDA();
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(oResource
						.getText("S2PSRSDAEDITBTNTXT"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(oResource
						.getText("S2PSRSDAEDITICON"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(true);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(true);
				} else if (parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) === 604 || parseInt(PDCData
						.PsrStatus) === 665) {
					var PSRModel = PDCData;
					var ValidAssesLevel = false;
					if (parseInt(PSRModel.PsrStatus) === 665) {
						(PSRModel.Bsdl.concat(PSRModel.Bd) === PSRModel.Ssdl.concat(PSRModel.Sd)) ? (ValidAssesLevel =
							true) : (ValidAssesLevel = false);
					}
					if (ValidAssesLevel === true) {
						//thisCntrlr.showToastMessage(oResource.getText("S2PSRPDCSDABSSDAROUTFAILMSG"));                                  //PCR020999--
						if(PSRModel.Asc606_SsdaFlag === ""){                                                                              //PCR020999++
							thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRPDCSDABSSDAROUTFAILMSG"));                        //PCR020999++
						}else if(PSRModel.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                                //PCR020999++
							thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRPDCSDABSSDAROUTFAILMSGASC606"));                  //PCR020999++
						}
					} else {
						if ((parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) === 604) &&
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX)
							.getSelectedKey() === oResource.getText("S2BSDASSMENTLVLOP")) {
							var obj = this.PDCSDAPayload(PDCData.PsrStatus, oResource.getText(
								"S2PSRSDASAVETXT"), oResource.getText("S2PSRSDASUBFORAPP"));
							this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm
								.opportunity.util.ServiceConfigConstants.write, obj, oResource.getText(
									"S2PSRSDACBCSFAFAILWDSAVEMSG"));
						} else if (parseInt(PDCData.PsrStatus) === 665 && oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX)
							.getSelectedKey() === oResource.getText("S2BSDASSMENTLVLOP")) {
							var obj = this.PDCSDAPayload(PDCData.PsrStatus, oResource.getText(
								"S2PSRSDASAVETXT"), oResource.getText("S2PSRSDASUBFORAPP"));
							this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm
								.opportunity.util.ServiceConfigConstants.write, obj, oResource.getText(
									"S2PSRSDACBCSFAFAILWDSAVEMSG"));
						} else {
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setVisible(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(true);
							var obj = this.PDCSDAPayload(PDCData.PsrStatus, oResource.getText(
								"S2PSRSDASAVETXT"), oResource.getText("S2PSRSDASUBFORAPP"));
							this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm
								.opportunity.util.ServiceConfigConstants.write, obj, oResource.getText(
									"S2PSRSDADATASAVETXT"));
						}
						this.getPDCData();
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(oResource
							.getText("S2PSRSDACANBTNTXT"));
						thisCntrlr.onEditPDCSDA();
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(oResource
							.getText("S2PSRSDAEDITBTNTXT"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(oResource
							.getText("S2PSRSDAEDITICON"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setVisible(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setIcon(oResource
							.getText("S2PSRSDADUPLICATEBTN"));
						(parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) === 604 ||
							parseInt(PDCData.PsrStatus) === 655) ? (oView.byId(com.amat.crm.opportunity
							.Ids.S2PDC_SDA_PANL_SFABtn).setText(oResource.getText("S2PSRSDASUBFORAPP"))) : ("");
					}
				} else if (parseInt(PDCData.PsrStatus) >= 655) {
					var obj = this.PDCSDAPayload(PDCData.PsrStatus, oResource.getText("S2PSRSDASAVETXT"),
						oResource.getText("S2PSRSDASUBFORAPP"));
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, obj, oResource.getText("S2PSRSDADATASAVETXT")
					);
					this.getPDCData();
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(oResource
						.getText("S2PSRSDACANBTNTXT"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(oResource
						.getText("S2CANCELBTNICON"));
					thisCntrlr.onEditPDCSDA();
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(oResource
						.getText("S2PSRSDAEDITBTNTXT"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(oResource
						.getText("S2PSRSDAEDITICON"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(false);
					if (parseInt(PDCData.PsrStatus) >= 665) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setIcon(oResource
							.getText("S2PSRSDAWFICON"));
//						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(oResource                                                          //PCR019492--
//							.getText("S2PSRSDASFSSDAINITTXT"));                                                                                                   //PCR019492--
						var initSSDATxt = PDCData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? oResource.getText("S2PSRDCINITRRABTNTXTASC606"):   //PCR019492++  
							oResource.getText("S2PSRSDASFSSDAINITTXT");                                                                                           //PCR019492++
						oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn).setText(initSSDATxt);
					} else {
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false);
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false);
					}
				}
				oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setEnabled(true);
			}			
			sap.ui.core.BusyIndicator.hide();
		},
		/**
		 * This method is used to Validate Contact list in Different Level of PDC-SDA.
		 * 
		 * @name validatePDCBFA
		 * @param
		 * @returns 
		 */
		validatePDCBFA: function() {
			var oResource = thisCntrlr.bundle;
			var SecurityData = thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();
			var GenInfoData = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();
			var PDCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
			var validationflag = false,
				validateRes = [],
				SendApprRight = false,
				Msg = "",
				gmoFlag = "",
				gsmFlag = "",
				ContactFlag = "";
			(SecurityData.SendApproval === oResource.getText("S2ODATAPOSVAL")) ? (SendApprRight =
				true, Msg = "") : (SendApprRight = false, Msg = oResource.getText("S2USERALLAUTHFALTTXT"));
			var bmoUserList = GenInfoData.NAV_BMO_INFO.results;
			var gsmUserList = GenInfoData.NAV_GSM_INFO.results;
			if (parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) === 604) {
				gmoFlag = this.checkContact(bmoUserList)
			} else {
				gmoFlag = this.checkContact(gsmUserList)
			}
			ContactFlag = this.validatePDCContact();
			if (SendApprRight === false) {
				validateRes = [SendApprRight, Msg];
				return validateRes;
			}
			if (gmoFlag === false && gsmFlag === false) {
				Msg = oResource.getText("S2PDCSDABMOFAILMSG");
				validateRes = [gmoFlag, Msg];
				return validateRes;
			}
			if (ContactFlag[0] === false) {
				//Msg = oResource.getText("S2PSRSDACBCSFACONVLIDMSG") + " " + ContactFlag[1];                                                                     //PCR028711--; modify contacts message
				Msg = oResource.getText("S2PSRCONTACTS");                                                                                                         //PCR028711++; modify contacts message
				validateRes = [ContactFlag[0], Msg];
				return validateRes;
			}
			(SendApprRight === true && gmoFlag === true && ContactFlag[0] === true) ? (validateRes = [true, oResource.getText(
				"S2PSRSDACBCSFACONFLAGMSG")]) : ("");
			return validateRes;
		},
		/**
		 * This method is used to handles PDC Contact validation.
		 * 
		 * @name validatePDCContact
		 * @param
		 * @returns
		 */
		validatePDCContact: function() {
			var oResource = thisCntrlr.bundle;
			var PDCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
			var GenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();
			var ConFlag = [];
			if (parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) === 604) {
				if (GenInfoModel.NAV_BMO_INFO.results.length > 0) ConFlag = [true, ""];
				else {
					ConFlag = [false, oResource.getText("S2PSRWFAPPPANLBMOINFOCONTIT")];
					return ConFlag;
				}
			}
			return ConFlag;
		},
		/**
		 * This method Validating Submit and Approve Button Requirements.
		 * 
		 * @name ValidatePDCData
		 * @param 
		 * @returns ErrorFlag - Binary Flag
		 */
		ValidatePDCData: function() {
			var oResource = thisCntrlr.bundle;
			var PDCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
			var oView = thisCntrlr.getView();
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setVisible(true);
			var SAFQusData = PDCData.NAV_PDC_QA_SAF.SalesFlg;
			var CustSpecData = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE).getModel().getData();
			var counter = 1,
				ErrorFlag = false;
			var oMessageTemplate = new sap.m.MessagePopoverItem({
				type: '{type}',
				title: '{title}',
				description: '{description}',
				subtitle: '{subtitle}',
				counter: '{counter}'
			});
			if (!thisCntrlr.oMessagePopover) {
				thisCntrlr.oMessagePopover = new sap.m.MessagePopover({
					id: this.createId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MESSAGE_POPOVER),
					items: {
						path: '/',
						template: oMessageTemplate
					}
				});
			}
			var aMockMessages = [];
			if (parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) === 604) {
				if (PDCData.NAV_PDC_QA_SAF.SalesFlg === "" && SAFQusData === "") {
					var temp = {};
					temp.type = oResource.getText("S2ERRORVALSATETEXT");
					temp.title = oResource.getText("S2PSRSDASAFQUESFAILMSG");
					temp.description = oResource.getText("S2PSRSDASAFQUESFAILMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = oResource.getText("S2PSRSDASAFCHECKSUCSSMSG");
					temp.description = oResource.getText("S2PSRSDASAFCHECKSUCSSMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
				var Rev1SpecFlag = false;
				for (var i = 0; i < CustSpecData.ItemSet.length; i++) {
					if (CustSpecData.ItemSet[i].filename !== "") {
						Rev1SpecFlag = true;
					}
				}
				if (Rev1SpecFlag === false) {
					var temp = {};
					temp.type = oResource.getText("S2ERRORVALSATETEXT");
					temp.title = oResource.getText("S2PSRSDACUSTINFOFAILMSG");
					temp.description = oResource.getText("S2PSRSDACUSTINFOFAILMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = oResource.getText("S2PSRSDACUSTINFOPOSMSG");
					temp.description = oResource.getText("S2PSRSDACUSTINFOFAILMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
				//************************Start Of PCR019492: ASC606 UI Changes******************
				if(PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
					var RRAQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).getModel().getData();
					  for (var i = 0; i < RRAQusData.results.length; i++) {
							var temp = {};
							if (RRAQusData.results[i].valueState === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
								temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
								temp.title = thisCntrlr.bundle.getText("S2PSRSDARRAFAILANSMSG");
								temp.description = thisCntrlr.bundle.getText("S2PSRSDARRAFAILANSMSGDIS") + ' ' + (i + 1) +
									' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
								temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
								temp.counter = counter;
								aMockMessages.push(temp);
								counter++;
								ErrorFlag = true;
							} else if (RRAQusData.results[i].valueState === thisCntrlr.bundle.getText("S2DELNAGVIZTEXT")) {
								temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
								temp.title = thisCntrlr.bundle.getText("S2PSRSDARRAPOSIANSMSG");
								temp.description = thisCntrlr.bundle.getText("S2PSRSDARRAPOSIANSMSGDIS") + ' ' + ' ' + (i +
									1) + ' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
								temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
								temp.counter = counter;
								aMockMessages.push(temp);
								counter++;
							}
							var Qus = {};
							if(i === 0 && RRAQusData.results[i].SalesFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")){
								if(RRAQusData.results[i].Comments === "" || RRAQusData.results[i].Comments.trim() === ""){
									Qus.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
									Qus.title = thisCntrlr.bundle.getText("S2PSRSDARRACOMMFAILANSMSG");
									Qus.description = thisCntrlr.bundle.getText("S2PSRSDARRACOMMFAILANSMSGDIS") + ' ' + (i + 1) +
										' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
									Qus.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
									Qus.counter = counter;
									aMockMessages.push(Qus);
									counter++;
									ErrorFlag = true;
								} else {
									Qus.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
									Qus.title = thisCntrlr.bundle.getText("S2PSRSDARRACOMMPOSIANSMSG");
									Qus.description = thisCntrlr.bundle.getText("S2PSRSDARRACOMMPOSIANSMSGDIS") + ' ' + ' ' + (i +
										1) + ' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
									Qus.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
									Qus.counter = counter;
									aMockMessages.push(Qus);
									counter++;
								}
							}						
							if(RRAQusData.results[i].Qid === "4002"){continue;}
							if(i >= 1 && i < 5 && RRAQusData.results[i].SalesFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")){
								if(RRAQusData.results[i].Comments === "" || RRAQusData.results[i].Comments.trim() === ""){
									Qus.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
									Qus.title = thisCntrlr.bundle.getText("S2PSRSDARRACOMMFAILANSMSG");
									Qus.description = thisCntrlr.bundle.getText("S2PSRSDARRACOMMFAILANSMSGDIS") + ' ' + (i + 1) +
										' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
									Qus.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
									Qus.counter = counter;
									aMockMessages.push(Qus);
									counter++;
									ErrorFlag = true;
								} else {
									Qus.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
									Qus.title = thisCntrlr.bundle.getText("S2PSRSDARRACOMMPOSIANSMSG");
									Qus.description = thisCntrlr.bundle.getText("S2PSRSDARRACOMMPOSIANSMSGDIS") + ' ' + ' ' + (i +
										1) + ' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
									Qus.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
									Qus.counter = counter;
									aMockMessages.push(Qus);
									counter++;
								}
						 }
					 }
				}
				//************************End Of PCR019492: ASC606 UI Changes******************
				if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() ===
					oResource.getText("S2BSDASSMENTLVLOP") || oView.byId(com.amat.crm.opportunity
						.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() === "") {
					var temp = {};
					temp.type = oResource.getText("S2ERRORVALSATETEXT");
					temp.title = oResource.getText("S2PSRSDASSESSLEVELNEGMSG");
					temp.description = oResource.getText("S2PSRSDASSESSLEVELNEGMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = oResource.getText("S2PSRSDASSESSLEVELPOSMSG");
					temp.description = oResource.getText("S2PSRSDASSESSLEVELPOSMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
				if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).getValue() === "") {
					var temp = {};
					temp.type = oResource.getText("S2ERRORVALSATETEXT");
					temp.title = oResource.getText("S2PSRSDASSJUSTFAILMSG");
					temp.description = oResource.getText("S2PSRSDASSJUSTFAILMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = oResource.getText("S2PSRSDASSJUSTSUCSSMSG");
					temp.description = oResource.getText("S2PSRSDASSJUSTFAILMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
			//************************Start Of PCR019492: ASC606 UI Changes******************
			} else if (parseInt(PDCData.PsrStatus) === 650) {
				if(PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
					var RRAQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).getModel().getData(), rraOldDeffFlag = false;
					RRAQusData.results[RRAQusData.results.length-1].SelectionIndex > 0 ? (PDCData.BmoRraValBsda !== this.getView().byId(com.amat.crm.opportunity.Ids
						.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() && PDCData.Bsdl !== "" ? ( this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE)
								.getValue()!== "" ? rraOldDeffFlag = true : rraOldDeffFlag = false) : rraOldDeffFlag = ""):rraOldDeffFlag = "";
					if(rraOldDeffFlag === false){
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDAOLDNEWVALFAILMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDAOLDNEWVALFAILMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else if(rraOldDeffFlag === true){
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDAOLDNEWVALSUCSSMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDAOLDNEWVALFAILMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
					}
					for (var i = 0; i < RRAQusData.results.length; i++) {
							var temp = {};
							if (RRAQusData.results[i].valueState === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
								temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
								temp.title = thisCntrlr.bundle.getText("S2PSRSDARRAFAILANSMSG");
								temp.description = thisCntrlr.bundle.getText("S2PSRSDARRAFAILANSMSGDIS") + ' ' + (i + 1) +
									' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
								temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
								temp.counter = counter;
								aMockMessages.push(temp);
								counter++;
								ErrorFlag = true;
							} else if (RRAQusData.results[i].valueState === thisCntrlr.bundle.getText("S2DELNAGVIZTEXT")) {
								temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
								temp.title = thisCntrlr.bundle.getText("S2PSRSDARRAPOSIANSMSG");
								temp.description = thisCntrlr.bundle.getText("S2PSRSDARRAPOSIANSMSGDIS") + ' ' + ' ' + (i +
									1) + ' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
								temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
								temp.counter = counter;
								aMockMessages.push(temp);
								counter++;
							}
							var Qus = {};
							if(i === 0 && RRAQusData.results[i].SalesFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")){
								if(RRAQusData.results[i].Comments === ""){
									Qus.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
									Qus.title = thisCntrlr.bundle.getText("S2PSRSDARRACOMMFAILANSMSG");
									Qus.description = thisCntrlr.bundle.getText("S2PSRSDARRACOMMFAILANSMSGDIS") + ' ' + (i + 1) +
										' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
									Qus.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
									Qus.counter = counter;
									aMockMessages.push(Qus);
									counter++;
									ErrorFlag = true;
								} else {
									Qus.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
									Qus.title = thisCntrlr.bundle.getText("S2PSRSDARRACOMMPOSIANSMSG");
									Qus.description = thisCntrlr.bundle.getText("S2PSRSDARRACOMMPOSIANSMSGDIS") + ' ' + ' ' + (i +
										1) + ' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
									Qus.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
									Qus.counter = counter;
									aMockMessages.push(Qus);
									counter++;
								}
							}
							if(RRAQusData.results[i].Qid === "4002"){continue;}
							if(i >= 1 && RRAQusData.results[i].SalesFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")){
								if(RRAQusData.results[i].Comments === ""){
									Qus.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
									Qus.title = thisCntrlr.bundle.getText("S2PSRSDARRACOMMFAILANSMSG");
									Qus.description = thisCntrlr.bundle.getText("S2PSRSDARRACOMMFAILANSMSGDIS") + ' ' + (i + 1) +
										' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
									Qus.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
									Qus.counter = counter;
									aMockMessages.push(Qus);
									counter++;
									ErrorFlag = true;
								} else {
									Qus.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
									Qus.title = thisCntrlr.bundle.getText("S2PSRSDARRACOMMPOSIANSMSG");
									Qus.description = thisCntrlr.bundle.getText("S2PSRSDARRACOMMPOSIANSMSGDIS") + ' ' + ' ' + (i +
										1) + ' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
									Qus.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
									Qus.counter = counter;
									aMockMessages.push(Qus);
									counter++;
								}
							}
					}
				}
				if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() ===
					oResource.getText("S2BSDASSMENTLVLOP") || oView.byId(com.amat.crm.opportunity
						.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() === "") {
					var temp = {};
					temp.type = oResource.getText("S2ERRORVALSATETEXT");
					temp.title = oResource.getText("S2PSRSDASSESSLEVELNEGMSG");
					temp.description = oResource.getText("S2PSRSDASSESSLEVELNEGMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = oResource.getText("S2PSRSDASSESSLEVELPOSMSG");
					temp.description = oResource.getText("S2PSRSDASSESSLEVELPOSMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
				if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).getValue() === "") {
					var temp = {};
					temp.type = oResource.getText("S2ERRORVALSATETEXT");
					temp.title = oResource.getText("S2PSRSDASSJUSTFAILMSG");
					temp.description = oResource.getText("S2PSRSDASSJUSTFAILMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = oResource.getText("S2PSRSDASSJUSTSUCSSMSG");
					temp.description = oResource.getText("S2PSRSDASSJUSTFAILMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
			//************************End Of PCR019492: ASC606 UI Changes******************
			} else if (parseInt(PDCData.PsrStatus) === 665) {
				if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() ===
					oResource.getText("S2BSDASSMENTLVLOP") || oView.byId(com.amat.crm.opportunity
						.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() === "") {
					var temp = {};
					temp.type = oResource.getText("S2ERRORVALSATETEXT");
					temp.title = oResource.getText("S2PSRSDASSESSLEVELNEGMSG");
					temp.description = oResource.getText("S2PSRSDASSESSLEVELNEGMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = oResource.getText("S2PSRSDASSESSLEVELPOSMSG");
					temp.description = oResource.getText("S2PSRSDASSESSLEVELPOSMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
				if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).getValue() === "") {
					var temp = {};
					temp.type = oResource.getText("S2ERRORVALSATETEXT");
					temp.title = oResource.getText("S2PSRSDASSJUSTFAILMSG");
					temp.description = oResource.getText("S2PSRSDASSJUSTFAILMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = oResource.getText("S2PSRSDASSJUSTSUCSSMSG");
					temp.description = oResource.getText("S2PSRSDASSJUSTFAILMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
				//**************Start Of PCR019492: ASC606 UI Changes************************
			} else if (parseInt(PDCData.PsrStatus) === 682) {
				if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() ===
					oResource.getText("S2BSDASSMENTLVLOP") || oView.byId(com.amat.crm.opportunity
						.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() === "") {
					var temp = {};
					temp.type = oResource.getText("S2ERRORVALSATETEXT");
					temp.title = oResource.getText("S2PSRSDASSESSLEVELNEGMSG");
					temp.description = oResource.getText("S2PSRSDASSESSLEVELNEGMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = oResource.getText("S2PSRSDASSESSLEVELPOSMSG");
					temp.description = oResource.getText("S2PSRSDASSESSLEVELPOSMSGDIS");
					temp.subtitle = oResource.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
			}
			//**************End Of PCR019492: ASC606 UI Changes************************
			if (ErrorFlag === false) {
				var temp = {};
				temp.type = oResource.getText("S2PSRSDAMSGTYPINFO");
				temp.title = oResource.getText("S2PSRSDATYPINFOMSGDIS");
				temp.description = oResource.getText("S2PSRSDATYPINFOMSGDIS");
				temp.subtitle = oResource.getText("S2PSRSDAMSGTYPINFORMATION");
				temp.counter = counter;
				aMockMessages.push(temp);
				counter++;
			} else {
				var temp = {};
				temp.type = oResource.getText("S2PSRSDAMSGTYPINFO");
				temp.title = oResource.getText("S2PSRSDACBCSFAFAILMSG");
				temp.description = oResource.getText("S2PSRSDACBCSFAFAILMSG");
				temp.subtitle = oResource.getText("S2PSRSDAMSGTYPINFORMATION");
				temp.counter = counter;
				aMockMessages.push(temp);
				counter++;
			}
			var oModel = this.getJSONModel(aMockMessages);
			var viewModel = new sap.ui.model.json.JSONModel();
			viewModel.setData({
				messagesLength: aMockMessages.length + ''
			});
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setModel(viewModel);
			thisCntrlr.oMessagePopover.setModel(oModel);
			return ErrorFlag;
		},
		/**
		 * This method is used For Generating Payload for BSDA Process.
		 * 
		 * @name PDCSDAPayload
		 * @param PsrStatus - Current PSR Status, ActionType - Save or Submit, Message - Submit For Approval Button Text.
		 * @returns obj - Payload Object
		 */
		PDCSDAPayload: function(PsrStatus, ActionType, Message) {
			var oResource = thisCntrlr.bundle;
			var OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));
			var PDCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
			var oView = thisCntrlr.getView();
			var obj = {};
			obj.Guid = OppGenInfoModel.getData().Guid;
			obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
			obj.PsrRequired = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData()
				.PsrRequired;
			obj.PsrType = PDCData.PsrType;
			obj.PsrStatus = PsrStatus;
			if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() === oResource.getText(
					"S2BSDASSMENTLVLOP")) {
				PDCData.Bsdl = "";
			} else if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() !== oResource.getText(
					"S2BSDASSMENTLVLOP")) {
				PDCData.Bsdl = this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey();
			}
			if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() === oResource.getText(
					"S2BSDASSMENTLVLOP")) {
				PDCData.Ssdl = "";
			} else if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() !== oResource.getText(
					"S2BSDASSMENTLVLOP")) {
				PDCData.Ssdl = this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey();
			}
			//************************Start Of PCR019492: 10257 : ASC606 UI Changes**************
			if(PDCData.Asc606_BsdaFlag === ""){ 
				obj.ConComments = PDCData.ConComments;    
			}else if(PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") && parseInt(PDCData.PsrStatus) === 650){     
				if(parseInt(PDCData.PsrStatus) === 650 && PDCData.BmoRraValBsda !== PDCData.Bsdl && PDCData.Bsdl !== ""){                                                                                                      //PCR019492++
					obj.ConComments = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).getValue();                                                             //PCR019492++
				} else {                                                                                                                                                                //PCR019492++
					obj.ConComments = PDCData.ConComments;                                                                                                                              //PCR019492++
				} 
			}
			//************************End Of PCR019492: 10257 : ASC606 UI Changes**************
			obj.Ssdl = PDCData.Ssdl;
			obj.Bd = PDCData.Bd;
			obj.Bsdl = PDCData.Bsdl;
			obj.Sd = PDCData.Sd;
			obj.BsdaJustfication = PDCData.BsdaJustfication;
			obj.SsdaJustfication = PDCData.SsdaJustfication;
			obj.SsdaReq = PDCData.SsdaReq;
			obj.RevOpitmId = PDCData.RevOpitmId;
			obj.RevOppId = PDCData.RevOppId;
			obj.CcOppId = thisCntrlr.that_views2.getController().OppId;
			obj.CcOpitmId = thisCntrlr.that_views2.getController().ItemNo;
			obj.Custno = PDCData.Custno;
			(ActionType === oResource.getText("S2PSRSDASAVETXT")) ? (obj.ActionType = "") : (obj.ActionType =
				oResource.getText("S2CBCSALESUCSSANS"));
			obj.AprvComments = "";
			obj.TaskId = PDCData.TaskId;
			obj.WiId = "";
			obj.PsrStatDesc = "";
			obj.InitiatedBy = "";
			//obj.InitiatedDt = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                     //PCR035760-- Defect#131 TechUpgrade changes
			obj.Time = oResource.getText("S2OPPAPPPAYLODTMEKEY");
			obj.NAV_PDC_QA_SAF = {};
			obj.NAV_PDC_QA_SAF.BmoFlg = PDCData.NAV_PDC_QA_SAF.BmoFlg;
			obj.NAV_PDC_QA_SAF.ChangedBy = PDCData.NAV_PDC_QA_SAF.ChangedBy;
			//obj.NAV_PDC_QA_SAF.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                      //PCR035760-- Defect#131 TechUpgrade changes
			obj.NAV_PDC_QA_SAF.Guid = OppGenInfoModel.getData().Guid;
			obj.NAV_PDC_QA_SAF.ItemGuid = OppGenInfoModel.getData().ItemGuid;
			obj.NAV_PDC_QA_SAF.ItemNo = PDCData.NAV_PDC_QA_SAF.ItemNo;
			obj.NAV_PDC_QA_SAF.OppId = PDCData.NAV_PDC_QA_SAF.OppId;
			obj.NAV_PDC_QA_SAF.QaVer = PDCData.NAV_PDC_QA_SAF.QaVer;                                                                           //PCR019492++
			obj.NAV_PDC_QA_SAF.Qdesc = PDCData.NAV_PDC_QA_SAF.Qdesc;
			obj.NAV_PDC_QA_SAF.Qid = PDCData.NAV_PDC_QA_SAF.Qid;
			obj.NAV_PDC_QA_SAF.Qtype = PDCData.NAV_PDC_QA_SAF.Qtype;
			obj.NAV_PDC_QA_SAF.SalesFlg = PDCData.NAV_PDC_QA_SAF.SalesFlg;
			obj.NAV_PDC_CC = [];
			if (oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_TABLE).getModel() !==
				undefined && (parseInt(PDCData.PsrStatus) === 605 || parseInt(PDCData.PsrStatus) === 604) ||
				(parseInt(PDCData.PsrStatus) === 650 && PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL"))) {             //PCR019492++
				var PDCCcTabData = oView.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_TABLE)
					.getModel().getData().results;
				if (PDCCcTabData.length > 0) {
					for (var i = 0; i < PDCCcTabData.length; i++) {
						var data = {};
						data.Guid = PDCCcTabData[i].Guid;
						data.ItemGuid = PDCCcTabData[i].ItemGuid;
						data.OppId = PDCCcTabData[i].OppId;
						data.ItemNo = PDCCcTabData[i].ItemNo;
						obj.NAV_PDC_CC.push(data);
					}
				}
				//************************Start Of PCR019492: ASC606 UI Changes******************
				if(PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
					obj.NAV_RRA_QA_PDC = [];
					var QusId = ["4001", "4002", "4003", "4004", "4005", "4006", "4007"], QusFlag = false;
					var SalesQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).getModel().getData();
					var QaVer = SalesQusData.results[0].QaVer, count = -1;
					for (var i = 0; i < QusId.length; i++) {
						QusFlag = false
						for(var j = 0; j < SalesQusData.results.length; j++){
							if(QusId[i] === SalesQusData.results[j].Qid){
								QusFlag = true;
								count++;
							}
						}
					var RRA = {};
					if(QusFlag === true){
						RRA.Guid = OppGenInfoModel.getData().Guid;
						RRA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
						RRA.Comments = SalesQusData.results[count].Comments;
						RRA.BmoFlg = SalesQusData.results[count].BmoFlg;
						RRA.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().ItemNo
						RRA.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().OppId
						RRA.QaVer = SalesQusData.results[count].QaVer;
						RRA.Qdesc = SalesQusData.results[count].Qdesc;
						RRA.Qid = SalesQusData.results[count].Qid;
						RRA.Qtype = thisCntrlr.bundle.getText("S2PSRDCRRATXTASC606"); 
						RRA.SalesFlg = SalesQusData.results[count].SalesFlg;
						RRA.ChangedBy = "";
						//RRA.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                                 //PCR035760-- Defect#131 TechUpgrade changes
					} else {
						RRA.Guid = OppGenInfoModel.getData().Guid;
						RRA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
						RRA.Comments = "";
						RRA.BmoFlg = "";
						RRA.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().ItemNo
						RRA.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().OppId
						RRA.QaVer = QaVer;
						RRA.Qdesc = "";
						RRA.Qid = QusId[i];
						RRA.Qtype = "RRA" 
						RRA.SalesFlg = "";
						RRA.ChangedBy = "";
						//RRA.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                                 //PCR035760-- Defect#131 TechUpgrade changes
					}
					obj.NAV_RRA_QA_PDC.push(RRA);
			      }
				}				
			//************************End Of PCR019492: ASC606 UI Changes******************
			}
			return obj;
		},
		/**
		 * This method Handles Note Live Change Event.
		 * 
		 * @name handleNoteLiveChange
		 * @param oEvt - Event Handlers
		 * @returns 
		 */
		handleNoteLiveChange: function(oEvt) {
			oCommonController.commonNoteLiveChange(oEvt, thisCntrlr);
		},
		/**
		 * This method Handles Reset Log Expand Event.
		 * 
		 * @name OnPDCExpandResetLog
		 * @param oEvent - Event Handlers
		 * @returns 
		 */
		OnPDCExpandResetLog: function(oEvent) {
			if (oEvent.getParameters().expand === true) {
				var sValidate = "ResetLog?$filter=ItemGuid eq guid'" + thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData()
					.ItemGuid + "'";
				this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RESET_LIST_TABLE).setModel(thisCntrlr.getModelFromCore(thisCntrlr.bundle
					.getText("ResetLogModel")));
			}
		},
		/**
		 * This method Handles Cancel Button Event of Reset Fragment.
		 * 
		 * @name onCancelreset
		 * @param 
		 * @returns 
		 */
		onCancelreset: function() {
			this.dialog.close();
			this.dialog.destroy();
		},
		/**
		 * This method Handles Live Change Event for Carbon Copy F4 Text Change. 
		 * 
		 * @name onCbnCpyChange
		 * @param oEvent - Event Handlers
		 * @returns 
		 */
		onCbnCpyChange: function(oEvent) {
			that_psrsda === undefined ? this._initiateControllerObjects() : "";
			that_psrsda.getController().onCbnCpyChange(oEvent, thisCntrlr);
		},
		/**
		 * This method is used to handle Related performance spec Review F4
		 * Help.
		 * 
		 * @name handleValueHelpRelPerSpecRew
		 * @param
		 * @returns
		 */
		handleValueHelpRelPerSpecRew : function(){
			that_psrsda === undefined ? this._initiateControllerObjects() : "";
			that_psrsda.getController().handleValueHelpRelPerSpecRew();
		}
	});
});