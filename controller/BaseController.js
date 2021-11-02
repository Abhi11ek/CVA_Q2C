/**
 * This class is base controller for defining other controllers.
 *
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends sap.ui.core.mvc.Controller
 * @name com.amat.crm.opportunity.controller.BaseController
 *
 * -------------------------------------------------------------------------------*
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
 * 20/08/2018      Abhishek        PCR019492         ASC606 UI Changes            *
 *                 Pant                                                           *
 * 18/12/2018      Abhishek        PCR021481         Q2C Q1/Q2 enhancements       *
 *                 Pant                                                           *
 * 25/02/2019      Abhishek        PCR022669         Q2C Q2 UI Changes            *
 *                 Pant                                                           *
 * 17/06/2019      Abhishek        PCR023905         Migrate ESA/IDS db from Lotus*
 *                 Pant                              Notes to SAP Fiori Q2C       *
 *                                                   Application                  *
 * 26/09/2019      Abhishek        PCR025717         Q2C Q4 2019 Enhancements     *
 *                 Pant                                                           *
 * 21/11/2019      Arun            PCR026551         Pre-Shipment Checklist       *
 *                 Jacob                                                          *
 * 27/04/2020      Arun            PCR028711         Q2C Enhancements for Q2-20   *
 *                 Jacob                                                          *
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 25/01/2021      Abhishek Pant   PCR033306         Q2C Display Enhancements     *
 * 06/04/2021	   Arun Jacob	   PCR034716		 Q2C ESA,PSR Enhancements     *
 * 10/08/2021      Abhishek Pant   PCR036308         DiGFP Phase 2 Enhancements   *
 ***********************************************************************************
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	'sap/m/MessageToast'
], function(Controller, MessageBox, MessageToast) {
	"use strict";
	var that;
	return Controller.extend("com.amat.crm.opportunity.controller.BaseController", {

		getComponent: function() {

			return this.getOwnerComponent();
		},
		getBusyDialog: function() {

			return new sap.m.BusyDialog({
				showCancelButton: false,
			}).addStyleClass("busy_indicator");
		},
		getCurrentView: function() {

			return this.getView();
		},
		getModelFromComponent: function(sModelName) {

			return this.getOwnerComponent().getModel(sModelName);
		},
		getModelFromCore: function(sModelName) {

			return sap.ui.getCore().getModel(sModelName);
		},
		serviceCall: function(Path, Call, payload, Msg) {
			var ServiceResult = {};
			var Response = "";
			if (Call === "read") {
				this.oMyOppModel._oDataModel.read(Path, null, null, false,
					function(oData, oResponse) {
						ServiceResult = oData;
						Response = oResponse;
					},
					function(oData, oResponse) {
						ServiceResult = oData;
						Response = oData.response;
					}
				);
			} else if (Call === "write") {
				this.oMyOppModel._oDataModel.create(Path, payload, null,
					function(oData, oResponse) {
						ServiceResult = oData;
						Response = oResponse;
					},
					function(oData, oResponse) {
						ServiceResult = oData;
						Response = oData.response;
					}
				);
			} else if (Call === "remove") {
				this.oMyOppModel._oDataModel.remove(Path, null, null, false,
					function(oData, oResponse) {
						ServiceResult = oData;
						Response = oResponse;
					},
					function(oData, oResponse) {
						ServiceResult = oData;
						Response = oData.response;
					}
				);
			}
			this.SavedSuccessCallback(ServiceResult, Response, Msg);
		},
		SavedSuccessCallback: function(oEvent, response, Msg) {
			if (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 204) {
				var Path = response.requestUri.split("/")[response.requestUri.split("/").length - 1];
				this.setModelToCore(oEvent, Path, Msg);
			} else if (response.statusCode >= 400 && response.statusCode <= 500) {
				sap.ui.core.BusyIndicator.hide();
				var oErrorBody = JSON.parse(response.body);
				var sErrorMessageValue = oErrorBody.error.message.value;
				var sErrorMessage = oEvent.message + "\n" + sErrorMessageValue + "\n" + "Please contact Administrator";
				sap.m.MessageBox.show(sErrorMessage, sap.m.MessageBox.Icon.ERROR, "Error");
			}
		},
		setModelToCore: function(Data, Path, Msg) {
			switch (Path) {
				case "OpportunitySet":
					var oOpportunityDataModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oOpportunityDataModel, "OpportunityDataModel");
					break;
				//************************Start Of PCR022669: Q2C Q2 UI Changes**************
				case "OpportunitySet?$filter=Low eq 'A'":
					var oOpportunityAllDataModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oOpportunityAllDataModel, "OpportunityAllDataModel");
					break;
				case "OpportunitySet?$filter=Low eq 'P'":
					var oOpportunityPerDataModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oOpportunityPerDataModel, "OpportunityPerDataModel");
					break;
				//************************End Of PCR022669: Q2C Q2 UI Changes**************
				case "PersonalizeSet":
					var oPersonalizeModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oPersonalizeModel, "PersonalizeModel");
					break;
				case "Security_AccSet(KeyVal=' ')":
					var oSecurityModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oSecurityModel, "SecurityModel");
					break;
				case "Filter_headSet":
					sap.m.MessageToast.show(Msg);
					break;
				case "PSRSDA_InfoSet":
					sap.m.MessageToast.show(Msg);
					break;
				case "/CustDoclinkSet":
					sap.m.MessageToast.show(Msg);
					break;
				case "/CARM_InfoSet":
					sap.m.MessageToast.show(Msg);
					break;
				case "CommentsSet":
					sap.m.MessageToast.show(Msg);
					break;
				case "PDCSDA_InfoSet":
					sap.m.MessageToast.show(Msg);
					break;
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************************
				case "ESA_InfoSet":
				case "ESAChecklist_HeaderSet":
					Msg !== "" ? sap.m.MessageToast.show(Msg,{
						duration: 7500
					}) : "";                                                                                //PCR028711++; modify display time
					break;
				case "ESAPayTermsSet":
					var oPayTrmModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oPayTrmModel, "PayTrmModel");
					break;
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************************
				case "CBC_InfoSet":
					//***************Justification: PCR018375++ - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
					//sap.m.MessageToast.show(Msg);                                                         //PCR018375--
					Msg !== "" ? sap.m.MessageToast.show(Msg) : "";                                         //PCR018375++ Condition Modified
					break;
				case "/ResetSet":
					sap.m.MessageToast.show(Msg);
					break;
				case "QuotelistSet":
					sap.ui.getCore().setModel(this.getJSONModel(Data), "QuotelistSet");
					break;
				case "/RevQuoteSet":
					sap.m.MessageToast.show(Msg);
					break;
				case "ResetChildListSet":
					sap.m.MessageToast.show(Msg);
					break;
				case "CC_RemoveSet":                                                                         //PCR025717++
					sap.m.MessageToast.show(Msg);                                                            //PCR025717++
					break;                                                                                   //PCR025717++
				//***********Start Of PCR028711: Q2C Enhancements for Q2-20************************
				case "CustF4Set":
					sap.ui.getCore().setModel(this.getJSONModel(Data), "F4CustlistSet");
					break;
				case "LowSet":
					sap.ui.getCore().setModel(this.getJSONModel(Data), "F4listSet");
					break;
				case "BUSet":
					sap.ui.getCore().setModel(this.getJSONModel(Data), "F4listSet");
					break;
				case "QuarterSet":
					sap.ui.getCore().setModel(this.getJSONModel(Data), "F4listSet");
					break;
				//***********End Of PCR028711: Q2C Enhancements for Q2-20**************************
			}
			//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************************
			if (Path.split("(")[0] === "ESAChecklist_HeaderSet") {
				var oEsaChkLstModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oEsaChkLstModel, "EsaChkLstModel");
			}
			//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************************
			//***********Start Of PCR028711: Q2C Enhancements for Q2-20************************
			if (Path.split("=")[0] === "OppSearchSet?$filter") {
				var oOppSearchModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oOppSearchModel, "OppSearchModel");
			}
			//***********End Of PCR028711: Q2C Enhancements for Q2-20**************************
			if (Path.split("(")[0] === "Install_InfoSet") {
				var oInstallinfoModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oInstallinfoModel, "InstallinfoModel");
			}
			if (Path.split("?")[0] === "ResetLog") {
				var oResetLogModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oResetLogModel, "ResetLogModel");
			}
			if (Path.split("?")[0] === "ResetChildListSet") {
				var oResetChildListModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oResetChildListModel, "ResetChildListModel");
			}
			switch (Path.split(",")[Path.split(",").length - 1]) {
				case "NAV_TRANS_HISTORY":
					var oOppGenInfoModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oOppGenInfoModel, "OppGenInfoModel");
					break;
				case "NAV_REV_DOCS":
					var oPSRModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oPSRModel, "PSRModel");
					break;
				case "NAV_CBCROM":
					var oCBCModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oCBCModel, "CBCModel");
					break;
				case "NAV_POSTBOOK_DOC":
					var oAttchmentModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oAttchmentModel, "attchmentModel");
					break;
				case "NAV_PDCSSDA_EVDOC":
					var oPdcsdaModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oPdcsdaModel, "PdcsdaModel");
					break;
				//**** Start of PCR021481++ : 4190: Q2C Q1/Q2 enhancements ***********
				case "NAV_CARM_CHNG_HIST":
					var oCarmModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oCarmModel, "oCarmModel");
					break;
			    //**** End of PCR021481++ : 4190: Q2C Q1/Q2 enhancements ***********
			    //***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				case "NAV_VER_INFO":
					var oEsasdaModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oEsasdaModel, "EsaModel");
					break;	
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
			    //***********Start Of PCR026551: Preshipment Checklist Development**************
				case "NAV_PRESHP_COMM":
					var oPspModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oPspModel, "PspModel"); 
					break;	
				//***********End Of PCR026551: Preshipment Checklist Development****************
			}
			if (Path.indexOf("Other_DoclistSet") >= 0) {
				var oS3AttchmentModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oS3AttchmentModel, "otherDocAttchmentModel");
			}
			if (Path.indexOf("Search_contactSet") >= 0) {
				var contactModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(contactModel, "contactModel");
			}
			if (Path.indexOf("RevQuoteSet") >= 0) {
				var oRevQuoteModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oRevQuoteModel, "oRevQuoteModel");
			}
			//***********Start Of PCR026551: Preshipment Checklist Development**************
			if (Path.indexOf("PSP_StatusSet") >= 0) {
				var oPspStatusModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oPspStatusModel, "PspStatusModel");
			}
			//***********End Of PCR026551: Preshipment Checklist Development****************
			//**** Start of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
			//if (Path.split("=")[Path.split("=").length - 1] === "NAV_CARM_DOCS") {
			//	var oCarmModel = this.getJSONModel(Data);
			//	sap.ui.getCore().setModel(oCarmModel, "oCarmModel");
			//}
			//**** End of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
			switch (Path.split("eq '")[Path.split("eq '").length - 1]) {
				case "PSR'":
					var oCbnCpyModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oCbnCpyModel, "CbnCpyModel");
					break;
				case "CBC'":
					var oCBCCbnCpyModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oCBCCbnCpyModel, "CBCCbnCpyModel");
					break;
				case "PDC'":
					var oPDCCbnCpyModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oPDCCbnCpyModel, "PDCCbnCpyModel");
					break;
				case "CPSR'":
					var oPSRMComModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oPSRMComModel, "PSRMComModel");
					break;
				case "CCBC'":
					var oCBCMComModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oCBCMComModel, "CBCMComModel");
					break;
				case "CPDC'":
					var oPDCMComModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oPDCMComModel, "PDCMComModel");
					break;
				case "MDT'":
					var oRelPerSpecRewModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oRelPerSpecRewModel, "RelPerSpecRewModel");
					break;
				case "GEN'":
					var oPDCMComModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oPDCMComModel, "GENMComModel");
					break;
				case "ATH'":
					var oPDCMComModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oPDCMComModel, "ATHMComModel");
					break;
				case "CARM'":
					var oPDCMComModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oPDCMComModel, "CARMMComModel");
					break;
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				case "ESA'":
					var oEsaMComModel = this.getJSONModel();
					oEsaMComModel.getData().oEsaManComm = Data;
					sap.ui.getCore().setModel(oEsaMComModel, "ESAMComModel");
					break;
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				//***********Start Of PCR026551: PSP SAP Fiori Q2C App**************
				case "SHP'":
					var oPSPMComModel = this.getJSONModel(Data);
					sap.ui.getCore().setModel(oPSPMComModel, "PSPMComModel");
					break;
				//***********End Of PCR026551: PSP SAP Fiori Q2C App****************
				//***********Start Of PCR034716++: Q2C ESA,PSR Enhancements**************
				case "ESACHKLST'":
					var oEsaChkLstComModel = this.getJSONModel();
					oEsaChkLstComModel.getData().ItemSet = Data.results;
					sap.ui.getCore().setModel(oEsaChkLstComModel, "ESACHKLSTComModel");
					break;
				//***********End Of PCR034716++: Q2C ESA,PSR Enhancements****************
			}
		},
		resetFilter: function(View, ViewType) {
			//***********Start Of PCR028711: Q2C Enhancements for Q2-20************************
			var viewTypes = ViewType.split(this.getResourceBundle().getText("S1SEPCHAR"));
			ViewType = viewTypes[0];
			var oppSearchFlag = viewTypes[1];
			//***********End Of PCR028711: Q2C Enhancements for Q2-20**************************
			var ColTVis, colFVis;
			switch (ViewType) {
				case this.getResourceBundle().getText("S1DFTBTNTYP_TXT"):
					ColTVis = [com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_FAB_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_OPPLNE_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_RGN_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_STAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_FAB_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_OPPLNE_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_RGN_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_STAT_COLUMN
					];
					colFVis = [com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PDCSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRCURRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PDCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRTYP_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCTYP_COLUMN, com.amat
						.crm.opportunity.Ids.OPPORTUNITY_LIST_REVQ_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRCURRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRTYP_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCTYP_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_REVQ_COLUMN, 
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_ESASTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_ESACURRSTAT_COLUMN,          //PCR023905++
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESASTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESACURRSTAT_COLUMN,  //PCR023905++
					];
					break;
				case this.getResourceBundle().getText("S2ICONTABPSRTEXT"):
					ColTVis = [com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRTYP_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_REVQ_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRTYP_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_REVQ_COLUMN
					];
					colFVis = [com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PDCSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PDCCURRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCTYP_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCCURRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCTYP_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_FAB_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_OPPLNE_COLUMN, com.amat
						.crm.opportunity.Ids.OPPORTUNITY_LIST_RGN_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_STAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_FAB_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_OPPLNE_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_RGN_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_STAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_ESASTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_ESACURRSTAT_COLUMN,         //PCR023905++
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESASTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESACURRSTAT_COLUMN, //PCR023905++
					];
					break;
				case this.getResourceBundle().getText("S2ICONTABPDCTEXT"):
					ColTVis = [com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PDCSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PDCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_REVQ_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_REVQ_COLUMN
					];
					colFVis = [com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRCURRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRTYP_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCTYP_COLUMN, com.amat
						.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRCURRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRTYP_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCTYP_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_FAB_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_OPPLNE_COLUMN, com.amat
						.crm.opportunity.Ids.OPPORTUNITY_LIST_RGN_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_STAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_FAB_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_OPPLNE_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_RGN_COLUMN,                
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_STAT_COLUMN, 
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESASTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESACURRSTAT_COLUMN,   //PCR023905++
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_ESASTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_ESACURRSTAT_COLUMN,           //PCR023905++
					];
					break;
				case this.getResourceBundle().getText("S2ICONTABCBCTXT"):
					ColTVis = [com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCTYP_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_REVQ_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCTYP_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_REVQ_COLUMN
					];
					colFVis = [com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PDCSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRCURRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PDCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRTYP_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCCURRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRTYP_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_FAB_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_OPPLNE_COLUMN, com.amat
						.crm.opportunity.Ids.OPPORTUNITY_LIST_RGN_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_STAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_FAB_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_OPPLNE_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_RGN_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_STAT_COLUMN, 
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESASTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESACURRSTAT_COLUMN,      //PCR023905++
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_ESASTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_ESACURRSTAT_COLUMN,              //PCR023905++
					];
					break;
					//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				case this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT"):
				     ColTVis = [com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_REVQ_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESASTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESACURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_ESASTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_ESACURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_REVQ_COLUMN
					];
					colFVis = [com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRCURRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PSRTYP_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_CBCTYP_COLUMN, com.amat
						.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRCURRSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRTYP_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCTYP_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_FAB_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_OPPLNE_COLUMN, com.amat
						.crm.opportunity.Ids.OPPORTUNITY_LIST_RGN_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_STAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_FAB_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_OPPLNE_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_RGN_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PDCSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_STAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_PDCCURRSTAT_COLUMN,
						com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCSTAT_COLUMN, com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCCURRSTAT_COLUMN,
					];
					break;
					//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App******************
			}
			for (var i = 0; i < ColTVis.length; i++) {
				View.byId(ColTVis[i]).setVisible(true);
			}
			for (var i = 0; i < colFVis.length; i++) {
				View.byId(colFVis[i]).setVisible(false);
			}
			var SearchArr = [com.amat.crm.opportunity.Ids.OPPORTUNITY_SEARCH, com.amat.crm.opportunity.Ids.CUSTOMER_SEARCH, com.amat.crm.opportunity
			 	.Ids.AMAT_QUOTE_NO_SEARCH, com.amat.crm.opportunity.Ids.SALES_ORDER_NO_SEARCH,
			 	com.amat.crm.opportunity.Ids.VC_PRDDIS_SEARCH, com.amat.crm.opportunity.Ids.PSR_STAT_SEARCH, com.amat.crm.opportunity.Ids.PDC_STAT_SEARCH,
			 	com.amat.crm.opportunity.Ids.CBC_STAT_SEARCH, com.amat.crm.opportunity.Ids.ESA_STAT_SEARCH,                                                           //PCR023905++
			 	com.amat.crm.opportunity.Ids.PSR_TYPE_SEARCH, com.amat.crm.opportunity.Ids.CBC_VERSION_SEARCH, com.amat.crm.opportunity.Ids.SLOT_ID_SEARCH,
			 	//com.amat.crm.opportunity.Ids.LARGE_ORDER_SEARCH, com.amat.crm.opportunity.Ids.CUSTOMER_PO_SEARCH, com.amat.crm.opportunity.Ids.RRASDA_LVL_SEARCH,   //PCR019492++; PCR028711--, remove RRA value
			 	com.amat.crm.opportunity.Ids.BU_SEARCH, com.amat.crm.opportunity.Ids.BOOK_QTR_SEARCH, com.amat.crm.opportunity.Ids.S1_DFTNO_SEARCH                    //PCR019492++; PCR033306++, S1_DFTNO_SEARCH added
			 ];
			if(!oppSearchFlag){                                                                                                                                       //PCR028711++; modify search value reset
				for (var i = 0; i < SearchArr.length; i++) {
					View.byId(SearchArr[i]).setValue("");
					View.byId(SearchArr[i]).setTooltip("");
				}
			}                                                                                                                                                          //PCR028711++
		},
		bindTabAgation: function(oTable1, oItemTemplate, aProjSorters, totalFilter) {
			oTable1.bindAggregation(this.getResourceBundle().getText("S1TABLELISTITM"), {
				path: "/results",
				template: oItemTemplate,
				sorter: aProjSorters,
				filters: totalFilter
			});
		},
		getBunchFilter: function(sQuery, fieldValArr) {
			var TempArr = [];
			for (var i = 0; i < fieldValArr.length; i++) {
				TempArr[i] = new sap.ui.model.Filter(fieldValArr[i], sap.ui.model.FilterOperator.Contains, sQuery);
			}
			return TempArr;
		},
		getJSONModel: function(Data) {
			return new sap.ui.model.json.JSONModel(Data);
		},
		destroyModel: function(oController, aModels) {
			for (var sModel in aModels) {
				if (this.getModelFromCore(aModels[sModel]))
					sap.ui.getCore().setModel(null, aModels[sModel]);
			}
		},
		getResourceBundle: function() {
			return this.getComponent().getModel("i18n").getResourceBundle();
		},
		getModel: function(sModelName) {
			return this.getView().getModel(sModelName);
		},
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		showToastMessage: function(sMsg) {
			return sap.m.MessageToast.show(sMsg,{
				duration: 7500                                                                                                                                     //PCR028711++; modify display time
			});
		},
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},
		sagregateModel: function(oResourceBundle, oModel, Key) {
			var keyCollection = {},
				property = "";
			var arr = oModel.getData().results;
			arr.forEach(function(item) {
				switch (Key) {
					case oResourceBundle.getText("OppSearch_OppKey"):
						property = item.OppId;
						break;
					case oResourceBundle.getText("OppSearch_CustKey"):
						property = item.CustName;
						break;
					case oResourceBundle.getText("OppSearch_AMATQTENOKey"):
						property = item.AmatQuoteId;
						break;
					case oResourceBundle.getText("OppSearch_SALEODRKey"):
						property = item.SoNumber;
						break;
					case oResourceBundle.getText("OppSearch_STIDLOKey"):
						property = item.SlotNo;
						break;
					case oResourceBundle.getText("OppSearch_LOWKey"):
						property = item.LowDesc;
						break;
					case oResourceBundle.getText("OppSearch_CUSTPOKey"):
						property = item.PoNumber;
						break;
					case oResourceBundle.getText("OppSearch_VCPRDDISKey"):
						property = item.VcPrdid;
						break;
					case oResourceBundle.getText("OppSearch_PSRSTATKey"):
						property = item.PsrStatDesc;
						break;
					case oResourceBundle.getText("OppSearch_PDCSTATKey"):
						property = item.PdcStatDesc;
						break;
					//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
					case oResourceBundle.getText("OppSearch_ESASTATKey"):
						property = item.EsaStatDesc;
						break;	
					//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App******************
					case oResourceBundle.getText("OppSearch_CBCSTATKey"):
						property = item.CbcStatDesc;
						break;
					case oResourceBundle.getText("OppSearch_PSRTYPKey"):
						property = item.PsrType;
						break;
					case oResourceBundle.getText("OppSearch_CBCVERKey"):
						property = item.CbcVerType;
						break;
					//****************** Start Of PCR019492: ASC606 UI Changes ****************************
					case oResourceBundle.getText("OppSearch_RRALVLKey"):
						property = item.SdaLevel;
						break;
					case oResourceBundle.getText("OppSearch_BUKey"):
						property = item.Bu;
						break;
					case oResourceBundle.getText("OppSearch_BookQKey"):
						property = item.BookQutVal;
						break;
				    //****************** End Of PCR019492: ASC606 UI Changes *************************
				}
				var grade = keyCollection[property] = keyCollection[property] || {};
				grade[property] = true;
			});
			var results = [];
			for (var value in keyCollection) {
				for (var value in keyCollection[value]) {
					if (value !== "") {
						results.push({
							OppId: value
						});
					}
				}
			}

			return results;
		},
		setTitle: function(oResourceBundle, oEvent, oDialog) {
			var Key = oEvent.getParameters().id.split("_")[oEvent.getParameters().id.split("_").length - 1];
			switch (Key) {
				case oResourceBundle.getText("OppSearch_OppKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_OppDialogTitle"));
					break;
				case oResourceBundle.getText("OppSearch_CustKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_CustDialogTitle"));
					break;
				case oResourceBundle.getText("OppSearch_AMATQTENOKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_AMATQTENODialogTitle"));
					break;
				case oResourceBundle.getText("OppSearch_SALEODRKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_SALEODRDialogTitle"));
					break;
				case oResourceBundle.getText("OppSearch_STIDLOKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_STIDLODialogTitle"));
					break;
				case oResourceBundle.getText("OppSearch_LOWKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_LOWDialogTitle"));
					break;
				case oResourceBundle.getText("OppSearch_CUSTPOKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_CUSTPODialogTitle"));
					break;
				case oResourceBundle.getText("OppSearch_VCPRDDISKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_VCPRDDISDialogTitle"));
					break;
				case oResourceBundle.getText("OppSearch_PSRSTATKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_PSRSTATDialogTitle"));
					break;
				case oResourceBundle.getText("OppSearch_PDCSTATKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_PDCSTATDialogTitle"));
					break;
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App******************
				case oResourceBundle.getText("OppSearch_ESASTATKey"):
					oDialog.setTitle(oResourceBundle.getText("S1SRHTABESAIDSSTATCOLTXT"));
					break;
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App********************
				case oResourceBundle.getText("OppSearch_CBCSTATKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_CBCSTATDialogTitle"));
					break;
				case oResourceBundle.getText("OppSearch_PSRTYPKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_PSRTYPDialogTitle"));
					break;
				case oResourceBundle.getText("OppSearch_CBCVERKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_CBCVERDialogTitle"));
					break;
				//****************** Start Of PCR019492: ASC606 UI Changes ****************************
				case oResourceBundle.getText("OppSearch_RRALVLKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_RRALVLDialogTitle"));
					break;
				case oResourceBundle.getText("OppSearch_BUKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_BUDialogTitle"));
					break;
				case oResourceBundle.getText("OppSearch_BookQKey"):
					oDialog.setTitle(oResourceBundle.getText("OppSearch_BookQDialogTitle"));
					break;
			    //****************** End Of PCR019492: ASC606 UI Changes ****************************
			}
			return Key;
		},
		getColShorter: function(colIndex, colFlag, ViewType) {
			var sPath, bDescending, temp;
			var Resource = this.getResourceBundle();
			var ColName = [],
				ColSPath = [];
			switch (ViewType) {
				case "Default":
					ColName = [Resource.getText("S1TABLECUSTCOL"), Resource.getText("S1TABLEFABNAMEBUCOL"), Resource.getText("S1TABLEOPPCOL"),
						Resource.getText("S1TABLEOPPlINENOCOL"),
						Resource.getText("S1TABLEQUTENOCOL"), Resource.getText("S1TABLESALESORDERNOCOL"), Resource.getText("S1TABLEBUCOL"), Resource.getText(
							"S1TABLEPRODUCTLINECOL"),
						Resource.getText("S1TABLEPVCRODUCTIDCOL"), Resource.getText("S1TABLEITMCATCOL"), Resource.getText("S1TABLESDALELCOL"), Resource
						.getText("S1TABLEREGCOL"),
						Resource.getText("S1TABLEBOKQTRCOL"), Resource.getText("S1TABLEOppStatusCOL")
					];
					ColSPath = ["CustName", "FabName", "OppId", "ItemNo", "AmatQuoteId", "SoNumber", "Pbg", "ProductLine", "VcPrdid", "ItmDesc",
						"SdaLevel", "Region", "BookQutVal", "OppStatus"
					];
					break;
				case "PSR":
					ColName = [Resource.getText("S1TABLECUSTCOL"), Resource.getText("S1TABLEOPPCOL"), Resource.getText("S1TABLEQUTENOCOL"), Resource.getText(
							"S1TABLESALESORDERNOCOL"),
						Resource.getText("S1TABLEBUCOL"), Resource.getText("S1TABLEPRODUCTLINECOL"), Resource.getText("S1PDCSDASTATLB_TXT"), Resource.getText(
							"S1INCURRSTATLB_TXT"), Resource.getText("S1PSRTYPLB_TXT"),
						Resource.getText("S1TABLEPVCRODUCTIDCOL"), Resource.getText("S1TABLEITMCATCOL"), Resource.getText("S1TABLESDALELCOL"),
						Resource.getText("S1TABLEBOKQTRCOL"), Resource.getText("S1TABLEREVQTRCOL")
					];
					ColSPath = ["CustName", "OppId", "AmatQuoteId", "SoNumber", "Pbg", "ProductLine", "PsrStatDesc", "PsrStatDt", "PsrType",
						"VcPrdid", "ItmDesc", "SdaLevel", "BookQutVal", "RevQuote"
					];
					break;
				case "PDC":
					ColName = [Resource.getText("S1TABLECUSTCOL"), Resource.getText("S1TABLEOPPCOL"), Resource.getText("S1TABLEQUTENOCOL"), Resource.getText(
							"S1TABLESALESORDERNOCOL"),
						Resource.getText("S1TABLEBUCOL"), Resource.getText("S1TABLEPRODUCTLINECOL"), Resource.getText("S1PSRSTATLB_TXT"), Resource.getText(
							"S1INCURRSTATLB_TXT"),
						Resource.getText("S1TABLEPVCRODUCTIDCOL"), Resource.getText("S1TABLEITMCATCOL"), Resource.getText("S1TABLESDALELCOL"),
						Resource.getText("S1TABLEBOKQTRCOL"), Resource.getText("S1TABLEREVQTRCOL")
					];
					ColSPath = ["CustName", "OppId", "AmatQuoteId", "SoNumber", "Pbg", "ProductLine", "PdcStatDesc", "PsrStatDt", "VcPrdid",
						"ItmDesc", "SdaLevel", "BookQutVal", "RevQuote"
					];
					break;
				case "CBC":
					ColName = [Resource.getText("S1TABLECUSTCOL"), Resource.getText("S1TABLEOPPCOL"), Resource.getText("S1TABLEQUTENOCOL"), Resource.getText(
							"S1TABLESALESORDERNOCOL"),
						Resource.getText("S1TABLEBUCOL"), Resource.getText("S1TABLEPRODUCTLINECOL"), Resource.getText("S1CBCSTATLB_TXT"), Resource.getText(
							"S1INCURRSTATLB_TXT"), Resource.getText("S1CBCTYPLB_TXT"),
						Resource.getText("S1TABLEPVCRODUCTIDCOL"), Resource.getText("S1TABLEITMCATCOL"), Resource.getText("S1TABLESDALELCOL"),
						Resource.getText("S1TABLEBOKQTRCOL"), Resource.getText("S1TABLEREVQTRCOL")
					];
					ColSPath = ["CustName", "OppId", "AmatQuoteId", "SoNumber", "Pbg", "ProductLine", "CbcStatDesc", "CbcStatDt", "CbcVerType",
						"VcPrdid", "ItmDesc", "SdaLevel", "BookQutVal", "RevQuote"
					];
					break;
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				case this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT"):
					ColName = [Resource.getText("S1TABLECUSTCOL"), Resource.getText("S1TABLEOPPCOL"), Resource.getText("S1TABLEQUTENOCOL"), Resource.getText(
							"S1TABLESALESORDERNOCOL"),
						Resource.getText("S1TABLEBUCOL"), Resource.getText("S1TABLEPRODUCTLINECOL"), Resource.getText("S1SRHTABESAIDSSTATCOLTXT"), Resource.getText(
							"S1INCURRSTATLB_TXT"),
						Resource.getText("S1TABLEPVCRODUCTIDCOL"), Resource.getText("S1TABLEITMCATCOL"), Resource.getText("S1TABLESDALELCOL"),
						Resource.getText("S1TABLEBOKQTRCOL"), Resource.getText("S1TABLEREVQTRCOL")
					];
					ColSPath = ["CustName", "OppId", "AmatQuoteId", "SoNumber", "Pbg", "ProductLine", "EsaStatDesc", "EsaStatDt", "VcPrdid",
						"ItmDesc", "SdaLevel", "BookQutVal", "RevQuote"
					];
					break;
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App******************
			}
			if (colFlag[colIndex] === false) {
				sPath = ColSPath[colIndex];
				bDescending = false;
				colFlag[colIndex] = true;
				temp = ColName[colIndex];
			} else if (colFlag[colIndex] === true) {
				sPath = ColSPath[colIndex];
				bDescending = true;
				colFlag[colIndex] = false;
				temp = ColName[colIndex];
			}
			return [sPath, colFlag[colIndex], temp];
		},
		getColShorterContact: function(colIndex, colFlag) {
			var sPath, bDescending, temp;
			var Resource = this.getResourceBundle();
			var ColName = ["Select", "First Name", "Last Name", "User's ID", "Email"];
			var ColSPath = ["Select", "NameFirst", "NameLast", "Xubname", "SmtpAddr"];
			if (colFlag[colIndex] === false) {
				sPath = ColSPath[colIndex];
				bDescending = false;
				colFlag[colIndex] = true;
				temp = ColName[colIndex];
			} else if (colFlag[colIndex] === true) {
				sPath = ColSPath[colIndex];
				bDescending = true;
				colFlag[colIndex] = false;
				temp = ColName[colIndex];
			}
			return [sPath, colFlag[colIndex], temp];
		},
		RemoveDublicates: function(arr) {
			var keyCollection = {};
			arr.forEach(function(item) {
				var grade = keyCollection[item.FilterField] = keyCollection[item.FilterField] || {};
				grade = keyCollection[item.FilterField] = keyCollection[item.FilterField] || {};
				grade[item.FilterField] = true;
			});
			var Result = [];
			for (var value in keyCollection) {
				for (var value in keyCollection[value]) {
					if (value !== "") {
						Result.push({
							FildName: value
						});
					}
				}
			}
			return Result;
		},
		RemoveDuplicateWdKey: function(arr, key) {
			var grades = {};
			if (key === "Opp") {
				arr.forEach(function(item) {
					var grade = grades[item.OppId] = grades[item.OppId] || {};
					grade[item.OppId] = true;
				});
				var results = [];
				for (var OppId in grades) {
					for (var OppId in grades[OppId]) {
						if (OppId !== "") {
							results.push({
								OppId: OppId
							});
						}
					}
				}
			}
			return results;
		},
		fnGetCount: function(oppPerFltdata) {
			var oppCount = {};
			var SalesCount = 0,
				BUCount = 0,
				BookQtrCount = 0,
				RegionCount = 0;
			for (var i = 0; i < oppPerFltdata.results.length; i++) {
				switch (oppPerFltdata.results[i].FilterField) {
					case this.getResourceBundle().getText("S1PERDLOGSSTGODTITLE"):
						SalesCount++;
						break;
					case this.getResourceBundle().getText("S1PERDLOGBUVWTITLE"):
						BUCount++;
						break;
					case this.getResourceBundle().getText("S1PERDLOGBQTRODTITLE"):
						BookQtrCount++;
						break;
					case this.getResourceBundle().getText("S1PERDLOGRGNODTITLE"):
						RegionCount++;
						break;
				}
			}
			if (SalesCount % 4 !== 0) {
				for (var i = 0; i < 4 - (SalesCount % 4); i++) {
					this.addModelData(oppPerFltdata, this.getResourceBundle().getText("S1PERDLOGSSTGODTITLE"));
				}
			}
			if (BUCount % 4 !== 0) {
				for (var i = 0; i < 4 - (BUCount % 4); i++) {
					this.addModelData(oppPerFltdata, this.getResourceBundle().getText("S1PERDLOGBUVWTITLE"));
				}
			}
			if (BookQtrCount % 4 !== 0) {
				for (var i = 0; i < 4 - (BookQtrCount % 4); i++) {
					this.addModelData(oppPerFltdata, this.getResourceBundle().getText("S1PERDLOGBQTRODTITLE"));
				}
			}
			if (RegionCount % 4 !== 0) {
				for (var i = 0; i < 4 - (RegionCount % 4); i++) {
					this.addModelData(oppPerFltdata, this.getResourceBundle().getText("S1PERDLOGRGNODTITLE"));
				}
			}
			return oppPerFltdata;
		},
		addModelData: function(oppPerFltdata, key) {
			var oContext = {};
			oContext.DefaultChk = "";
			oContext.FilterField = key;
			oContext.FilterVal = "";
			oppPerFltdata.results[oppPerFltdata.results.length] = oContext;
		},
		CheckCount: function() {
			var checkCnt = 0;
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.AMAT_QUOTE_NO_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.CUSTOMER_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.SALES_ORDER_NO_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.SLOT_ID_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.LARGE_ORDER_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.CUSTOMER_PO_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.VC_PRDDIS_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.PSR_STAT_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.PDC_STAT_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.ESA_STAT_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.CBC_STAT_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.PSR_TYPE_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			if (this.getCurrentView().byId(com.amat.crm.opportunity.Ids.CBC_VERSION_SEARCH).getValue() !== "") {
				checkCnt = checkCnt + 1;
			}
			return checkCnt;

		},
		_createIndependentDialog: function(oController, oFragment) {
			oController._oDialog = sap.ui.xmlfragment(oFragment, oController);
			oController.getView().addDependent(oController._oDialog);
			return oController._oDialog;
		},
		destroyDialog: function() {
			if (this._oDialog) {
				this.getView() && this.getView().removeDependent(this._oDialog);
				this._oDialog.destroy(true);
			}
			this._oDialog = null;
		},
		//************************Start Of PCR022669: Q2C Q2 UI Changes**************
		getFilterModel: function(tabData, SelIndex, oViewS1){      
			var PSRType = oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).getType(), viewType = "";
			var PDCType = oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).getType();
			var CBCType = oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).getType();
			var ESAType = oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).getType();                                                                //PCR023905++
			PSRType === this.getResourceBundle().getText("S1DFTBTNTYP_TXT") && PDCType === this.getResourceBundle().getText("S1DFTBTNTYP_TXT") &&
			  //CBCType === this.getResourceBundle().getText("S1DFTBTNTYP_TXT")? (viewType = this.getResourceBundle().getText("S1DFTBTNTYP_TXT")):               //PCR023905--
			 CBCType === this.getResourceBundle().getText("S1DFTBTNTYP_TXT") && ESAType === this.getResourceBundle().getText("S1DFTBTNTYP_TXT")?                 //PCR023905++
			  (viewType = this.getResourceBundle().getText("S1DFTBTNTYP_TXT")):                                                                                  //PCR023905++
			   (PSRType === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")? (viewType = this.getResourceBundle().getText("S2ICONTABPSRTEXT")) :
			    (PDCType === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")? viewType = this.getResourceBundle().getText("S2ICONTABPDCTEXT"):
				  (CBCType === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")? viewType = this.getResourceBundle().getText("S2ICONTABCBCTXT"): 
				   (ESAType === this.getResourceBundle().getText("S1EMPBTNTYP_TXT"))?(viewType = this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT")):("")))); //PCR023905++
			var obj = {}, ftrModel = [];
			for (var i = 0; i < SelIndex.length; i++) {	
				switch (viewType) {
				case this.getResourceBundle().getText("S1DFTBTNTYP_TXT"):
					obj = {
						Custname : tabData[SelIndex[i]].Custname,                                                                                                 //PCR028711++; modify CustName to Custname
						FabName : tabData[SelIndex[i]].FabName,
						OppId : " "+tabData[SelIndex[i]].OppId,
						ItemNo : tabData[SelIndex[i]].ItemNo,
						AmatQuoteId : tabData[SelIndex[i]].AmatQuoteId,
						SoNumber : tabData[SelIndex[i]].SoNumber,
						Pbg : tabData[SelIndex[i]].Pbg,
						ProductLine : tabData[SelIndex[i]].ProductLine,
						VcPrdid : tabData[SelIndex[i]].VcPrdid,
						ItmDesc : 	tabData[SelIndex[i]].ItmDesc,
						SdaLevel : tabData[SelIndex[i]].SdaLevel,
						Region : tabData[SelIndex[i]].Region,
						BookQutVal : tabData[SelIndex[i]].BookQutVal,
						OppStatus : tabData[SelIndex[i]].OppStatus
				    };
					break;
				case this.getResourceBundle().getText("S2ICONTABPSRTEXT"):
					obj = {
						Custname : tabData[SelIndex[i]].Custname,                                                                                                //PCR028711++; modify CustName to Custname
						OppId : " "+tabData[SelIndex[i]].OppId,
						AmatQuoteId : tabData[SelIndex[i]].AmatQuoteId,
						SoNumber : tabData[SelIndex[i]].SoNumber,
						Pbg : tabData[SelIndex[i]].Pbg,
						ProductLine : tabData[SelIndex[i]].ProductLine,
						PsrStatDesc : tabData[SelIndex[i]].PsrStatDesc,
						PsrStatDt : com.amat.crm.opportunity.util.formatter.DateWdMonth(tabData[SelIndex[i]].PsrStatDt),
						PsrType : tabData[SelIndex[i]].PsrType,
						VcPrdid : tabData[SelIndex[i]].VcPrdid,
						ItmDesc : 	tabData[SelIndex[i]].ItmDesc,
						SdaLevel : tabData[SelIndex[i]].SdaLevel,
						BookQutVal : tabData[SelIndex[i]].BookQutVal,
						RevQuote : tabData[SelIndex[i]].RevQuote
				    };
					break;
				case this.getResourceBundle().getText("S2ICONTABPDCTEXT"):
					obj = {
						Custname : tabData[SelIndex[i]].Custname,                                                                                                //PCR028711++; modify CustName to Custname
						OppId : " "+tabData[SelIndex[i]].OppId,
						AmatQuoteId : tabData[SelIndex[i]].AmatQuoteId,
						SoNumber : tabData[SelIndex[i]].SoNumber,
						Pbg : tabData[SelIndex[i]].Pbg,
						ProductLine : tabData[SelIndex[i]].ProductLine,
						PdcStatDesc : tabData[SelIndex[i]].PdcStatDesc,
						PsrStatDt : com.amat.crm.opportunity.util.formatter.DateWdMonth(tabData[SelIndex[i]].PsrStatDt),
						PsrType : tabData[SelIndex[i]].PsrType,
						VcPrdid : tabData[SelIndex[i]].VcPrdid,
						ItmDesc : 	tabData[SelIndex[i]].ItmDesc,
						SdaLevel : tabData[SelIndex[i]].SdaLevel,
						BookQutVal : tabData[SelIndex[i]].BookQutVal,
						RevQuote : tabData[SelIndex[i]].RevQuote
				    };
					break;
				case this.getResourceBundle().getText("S2ICONTABCBCTXT"):
					obj = {
						Custname : tabData[SelIndex[i]].Custname,                                                                                                //PCR028711++; modify CustName to Custname
						OppId : " "+tabData[SelIndex[i]].OppId,
						AmatQuoteId : tabData[SelIndex[i]].AmatQuoteId,
						SoNumber : tabData[SelIndex[i]].SoNumber,
						Pbg : tabData[SelIndex[i]].Pbg,
						ProductLine : tabData[SelIndex[i]].ProductLine,
						CbcStatDesc : tabData[SelIndex[i]].CbcStatDesc,
						CbcStatDt : com.amat.crm.opportunity.util.formatter.DateWdMonth(tabData[SelIndex[i]].CbcStatDt),
						CbcVerType : tabData[SelIndex[i]].CbcVerType,
						VcPrdid : tabData[SelIndex[i]].VcPrdid,
						ItmDesc : 	tabData[SelIndex[i]].ItmDesc,
						SdaLevel : tabData[SelIndex[i]].SdaLevel,
						BookQutVal : tabData[SelIndex[i]].BookQutVal,
						RevQuote : tabData[SelIndex[i]].RevQuote
				    };
					break;
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				case this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT"):
					obj = {
						Custname : tabData[SelIndex[i]].Custname,                                                                                                //PCR028711++; modify CustName to Custname
						OppId : " "+tabData[SelIndex[i]].OppId,
						AmatQuoteId : tabData[SelIndex[i]].AmatQuoteId,
						SoNumber : tabData[SelIndex[i]].SoNumber,
						Pbg : tabData[SelIndex[i]].Pbg,
						ProductLine : tabData[SelIndex[i]].ProductLine,
						EsaStatDesc : tabData[SelIndex[i]].EsaStatDesc,
						EsaStatDt : com.amat.crm.opportunity.util.formatter.DateWdMonth(tabData[SelIndex[i]].EsaStatDt),
						PsrType : tabData[SelIndex[i]].PsrType,
						VcPrdid : tabData[SelIndex[i]].VcPrdid,
						ItmDesc : 	tabData[SelIndex[i]].ItmDesc,
						SdaLevel : tabData[SelIndex[i]].SdaLevel,
						BookQutVal : tabData[SelIndex[i]].BookQutVal,
						RevQuote : tabData[SelIndex[i]].RevQuote
				    };
					break;
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App******************
				}
				ftrModel[i] = obj;
			}	
			return ftrModel;
		},
		/**
		 * This method is used to set Read All Button default style.
		 * @name RAllBtnDftStyle
		 * @param
		 * @returns 
		 */
		RAllBtnDftStyle: function(){
			var RAllBtn = this.getView().byId(com.amat.crm.opportunity.Ids.FILTER_HDR_RALL_BTN);
			if(RAllBtn.hasStyleClass("sapMRPBtnClass")){
				RAllBtn.removeStyleClass("sapMRPBtnClass");
				RAllBtn.addStyleClass("sapMRABtnClass"); 
			}
		},		
		//************************End Of PCR022669: Q2C Q2 UI Changes**************
		//************************Start Of PCR026243: DL:1803 Display Migration to Q2C**************
		/*
		 * Convenience method Used to Service Call.
		 * @name serviceCall
		 * @param {String} Path - Service Set Path, {String} Call - Type of call, {Object} payLoad
		 * @Param {String} Msg - Message, {String} ProType
		 * @returns
		 * @public
		 */
		serviceDisCall: function(Path, Call, payload, Msg, ProType) {
			var ServiceResult = {};
			var Response = "";
			var disModel = new sap.ui.model.odata.ODataModel(com.amat.crm.opportunity.util.
					ServiceConfigConstants.getDisplayURL,true);
			if (Call === "read") {
				disModel.read(Path, null, null, false, function(oData, oResponse) {
						ServiceResult = oData;
						Response = oResponse;
					},function(oData, oResponse) {
						ServiceResult = oData;
						Response = oData.response;
				});
			} else if (Call === "write") {
				disModel.create(Path, payload, null, function(oData, oResponse) {
						ServiceResult = oData;
						Response = oResponse;
					},function(oData, oResponse) {
						ServiceResult = oData;
						Response = oData.response;
				});
			} else if (Call === "remove") {
				disModel.remove(Path, null, null, false, function(oData, oResponse) {
						ServiceResult = oData;
						Response = oResponse;
					},function(oData, oResponse) {
						ServiceResult = oData;
						Response = oData.response;
				});
			}
			this.SavedDisSuccessCallback(ServiceResult, Response, Msg, ProType);
		},
		/*
		 * Convenience method Used to Collect Service Response.
		 * @name SavedSuccessCallback
		 * @param {Object} data, {Object} response, {String} Msg - Message, {String} ProType
		 * @returns
		 * @public
		 */
		SavedDisSuccessCallback: function(data, response, Msg, ProType) {
			var oResource = this.getResourceBundle();
			if (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 204) {
				var Path = response.requestUri.split("/")[response.requestUri.split("/").length - 1];
				this.setDisModelToCore(data, Path, Msg);
			} else if(response.statusCode >= 409 && ProType === oResource.getText("S2PSRDCRRATXTASC606")){
				var sErrorMessage = oResource.getText("S4DISLOKMSGPART1") + "\n" + oResource.getText("S4DISLOKMSGPART2");
				sap.m.MessageBox.show(sErrorMessage, sap.m.MessageBox.Icon.WARNING, oResource.getText("S2WANGVSTEXT"));
			}else if (response.statusCode >= 400 && response.statusCode <= 500) {
				sap.ui.core.BusyIndicator.hide();
				var oErrorBody = JSON.parse(response.body);
				var sErrorMessageValue = oErrorBody.error.message.value;
				var sErrorMessage = data.message + "\n" + sErrorMessageValue + "\n" + oResource.getText("S4DISEORMSGADMMN");
				sap.m.MessageBox.show(sErrorMessage, sap.m.MessageBox.Icon.ERROR, oResource.getText("S2ERRORVALSATETEXT"));
			}
		},
		/*
		 * Convenience method Used to Save Server Response Data.
		 * @name setModelToCore
		 * @param {Object} Data, {String} Path, {String} Msg - Message
		 * @returns
		 * @public
		 */
		setDisModelToCore: function(Data, Path, Msg) {
			switch (Path) {
			case "GenralInfoSet":
				 var oOpportunityDataModel = this.getJSONModel(Data);
				 sap.ui.getCore().setModel(oOpportunityDataModel, "OpportunityDataModel");
				 break;
			case "RRA_InfoSet":
				var oPRRAModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oPRRAModel, "PRRAModel");
				Msg !== "" ? sap.m.MessageToast.show(Msg) : "";
				break;
			case "Display_BUSet":
				 sap.ui.getCore().setModel(this.getJSONModel(Data), "DisBuSet");
				 break;	 
			case "QuotelistSet":
				sap.ui.getCore().setModel(this.getJSONModel(Data), "QuotelistSet");
				break;
			case "RevQuoteSet":
			case "CommentsSet":
			case "/ResetSet":
			case "/CustDoclinkSet":
			case "PSRSDA_InfoSet":
			case "CC_RemoveSet":
			case "ResetChildListSet":
			case "DocumentsSet":                                                                                                                                                     //PCR036308++
				sap.m.MessageToast.show(Msg);
				break;
			case "CBC_InfoSet":;
			case "ESA_InfoSet":	
			case "ESAChecklist_HeaderSet":
				Msg !== "" ? sap.m.MessageToast.show(Msg) : "";
				break;
			case "ESAPayTermsSet":
				var oPayTrmModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oPayTrmModel, "PayTrmModel");
				break;
			}
			switch (Path.split(",")[Path.split(",").length - 1]) {
			case "NAV_GEN_COMMENTS":
				var oOppGenInfoModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oOppGenInfoModel, "OppGenInfoModel");
				break;
			case "NAV_SRRA_PARL":
				var oPRRAModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oPRRAModel, "PRRAModel");
				break;
			case "NAV_VER_INFO":
				var oEsasdaModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oEsasdaModel, "EsaModel");
				break;
			case "NAV_CBCSLS":
				var oCBCModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oCBCModel, "CBCModel");
				break;
			}
			//**** Start Of PCR036308++; DiGFP Phase 2 Enhancements ****
			if (Path.split("?$")[0] === "CustDoclinkSet") {
				var oLnkModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oLnkModel, "oLnkModel");
			}
			//***** End Of PCR036308++; DiGFP Phase 2 Enhancements *****
			if (Path.split("?$")[0] === "LookUpSet") {
				var oRraLookUpModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oRraLookUpModel, "oRraLookUpModel");
			}
			if (Path.split("(")[0] === "ESAChecklist_HeaderSet") {
				var oEsaChkLstModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oEsaChkLstModel, "EsaChkLstModel");
			}
			if (Path.indexOf("Other_DoclistSet") >= 0) {
				var oS3AttchmentModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oS3AttchmentModel, "otherDocAttchmentModel");
			}
			if(Path.indexOf("NotifySet") >= 0){
				Msg !== "" ? sap.m.MessageToast.show(Msg) : "";
			}
			if (Path.indexOf("RevQuoteSet") >= 0) {
				var oRevQuoteModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oRevQuoteModel, "oRevQuoteModel");
			}
			if (Path.indexOf("Search_contactSet") >= 0) {
				var contactModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(contactModel, "contactModel");
			}
			if (Path.split("?")[0] === "ResetLog") {
				var oResetLogModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oResetLogModel, "ResetLogModel");
			}
			if (Path.split("?")[0] === "ResetChildListSet") {
				var oResetChildListModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oResetChildListModel, "ResetChildListModel");
			}
			switch (Path.split("eq '")[Path.split("eq '").length - 1]) {
			case "GEN'":
				var oPDCMComModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oPDCMComModel, "GENMComModel");
				break;
			case "RRA'":
				var oPSRMComModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oPSRMComModel, "PSRMComModel");
				break;
			case "PSR'":
				var oCbnCpyModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oCbnCpyModel, "CbnCpyModel");
				break;
			case "CCBC'":
				var oCBCMComModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oCBCMComModel, "CBCMComModel");
				break;
			case "CBC'":
				var oCBCCbnCpyModel = this.getJSONModel(Data);
				sap.ui.getCore().setModel(oCBCCbnCpyModel, "CBCCbnCpyModel");
				break;
			case "ESA'":
				var oEsaMComModel = this.getJSONModel();
				oEsaMComModel.getData().oEsaManComm = Data;
				sap.ui.getCore().setModel(oEsaMComModel, "ESAMComModel");
				break;
			}
		}
		//************************End Of PCR026243: DL:1803 Display Migration to Q2C**************
	});
});