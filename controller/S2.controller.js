/**
 * This class holds all methods of S2 page.
 * 
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends com.amat.crm.opportunity.controller.BaseController
 * @name com.amat.crm.opportunity.controller.S2                                   *
 *  * ----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 * Ver.No    Date        Author    PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * V00    20/02/2018    Abhishek   PCR017480         Initial version              *
 *                      Pant                                                      *
 *                      (X089025)                                                 *
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 16/07/2018      Abhishek        PCR019078         Chamber code display in PSR  *
 *                 Pant                                                           *
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
 * 17/06/2019      Abhishek        PCR023905         Migrate ESA/IDS db from Lotus*
 *                 Pant                              Notes to SAP Fiori Q2C       *
 *                                                   Application                  *
 * 26/09/2019      Abhishek        PCR025717         Q2C Q4 2019 Enhancements     *
 *                 Pant                                                           *
 * 26/10/2019      Abhishek        PCR026110         INC05150622 other attachment *
 *                 Pant                              incorrect customer           *
 * 20/11/2018      Arun            PCR026551         Pre-shipment development     *
 *                 Jacob                                                          *
 * 30/04/2020      Arun            PCR028711         Q2C Enhancements for Q2-20   *
 *                 Jacob                                                          *
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 14/04/2021      Arun Jacob      PCR034716         Q2C ESA,PSR Enhancements     *
 ***********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController"],
	function(Controller) {
		"use strict";
		var that_S2,
			that_general,
			that_pdcsda,
			that_pdcsdaCntrlr,
			that_psrsda,
			that_cbc,
			that_carm,
			that_attachment,
			that_esa,                                                                                                                                       //PCR023905++
			that_psp,                                                                                                                                       //PCR026551++
			that_mli;
		return Controller.extend("com.amat.crm.opportunity.controller.S2", {
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
				that_S2 = this;
				that_S2.colFlag = [false, false, false, false, false, false, false, false, false, false, false, false,
					false, false
				];
				that_S2.flagAtt = 0;
				that_S2.MandateData;
				that_S2.oMessagePopover;
				this.detActionType;
				this.SelectedRecord = {
					"results": []
				};
				this.UnselectedRecord = {
					"results": []
				};
				this.getOwnerComponent().s2 = that_S2.getView();
				that_general = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_GINFO).getContent()[0];
				this.getOwnerComponent().general = that_general;
				that_cbc = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).getContent()[0];
				this.getOwnerComponent().cbc = that_cbc;
				that_carm = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).getContent()[0];
				this.getOwnerComponent().carm = that_carm;
				that_attachment = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_ATTACH).getContent()[0];
				this.getOwnerComponent().attachment = that_attachment;
				that_psrsda = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).getContent()[0];
				this.getOwnerComponent().psrsda = that_psrsda;
				that_pdcsda = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).getContent()[0];
				this.getOwnerComponent().pdcsda = that_pdcsda;
				that_mli = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_MLINFO).getContent()[0];
				this.getOwnerComponent().mli = that_mli;
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				that_esa = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_ESA).getContent()[0];
				this.getOwnerComponent().esa = that_esa;
				if (that_esa.getController().that_views2 === undefined) {
					that_esa.getController().that_views2 = this.getView();
				}
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				//***********Start Of PCR026551: Pre-Shipment  to SAP Fiori Q2C App**************
				that_psp = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSP).getContent()[0];
				this.getOwnerComponent().psp = that_psp;
				if (that_psp.getController().that_views2 === undefined) {
					that_psp.getController().that_views2 = this.getView();
				}
				//***********End Of PCR026551: Pre-Shipment to SAP Fiori Q2C App****************
				if (that_psrsda.getController().that_views2 === undefined) {
					that_psrsda.getController().that_views2 = this.getView();
				}
				if (that_pdcsda.getController().that_views2 === undefined) {
					that_pdcsda.getController().that_views2 = this.getView();
				}
				if (that_attachment.getController().that_views2 === undefined) {
					that_attachment.getController().that_views2 = this.getView();
				}
				if (that_carm.getController().that_views2 === undefined) {
					that_carm.getController().that_views2 = this.getView();
				}
				if (that_cbc.getController().that_views2 === undefined) {
					that_cbc.getController().that_views2 = this.getView();
				}
				if (that_general.getController().that_views2 === undefined) {
					that_general.getController().that_views2 = this.getView();
				}
				if (that_mli.getController().that_views2 === undefined) {
					that_mli.getController().that_views2 = this.getView();
				}
				that_pdcsdaCntrlr = that_pdcsda.getController();
				this.oMyOppModel = new com.amat.crm.opportunity.model.models(this);
				if (this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")) !== undefined) {
					var Bar = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_BAR);
					var PSRDecisionBox = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox);
					var PSRDecisionContent = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISION_CONTENT);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(false);
					Bar.setVisible(false);
					PSRDecisionBox.setVisible(true);
					PSRDecisionContent.setVisible(false);
					that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false);
					that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(true);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(false);
					var oDatePicker = that_carm.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER);
					oDatePicker.addEventDelegate({
						onAfterRendering: function() {
							var oDateInner = this.$().find('.sapMInputBaseInner');
							var oID = oDateInner[0].id;
							$('#' + oID).attr("disabled", "disabled");
						}
					}, oDatePicker);
				} else {
					var oRouter = this.getRouter();
					oRouter.getRoute(this.getResourceBundle().getText("S2DISOPPDETROUT")).attachMatched(this._onRouteMatched,
						this);
					oRouter.getRoute(this.getResourceBundle().getText("S2ESADISOPPDETROUT")).attachMatched(this._onRouteMatched,this);          //PCR023905++
				}
				var idModel = this.getModelFromComponent("globalids");
				idModel.setProperty("/s2", this.getView().getId());
			},
			/**
			 * This method is used to handles Root Matched for URL.
			 * 
			 * @name _onRouteMatched
			 * @param
			 * @returns
			 */
			_onRouteMatched: function(oEvent) {
				that_S2.oArgs = oEvent.getParameter(this.getResourceBundle().getText("S2PARARGUMENT"));				
				if (that_S2.oArgs.Guid != undefined && that_S2.oArgs.ItemGuid !== undefined) {
					this.fromURL();
				}
			},
			/**
			 * This method is used to handles load S2 data on accessing through mail.
			 * 
			 * @name fromURL
			 * @param preValue - flag to differentiate from mail link or app
			 * @returns
			 */
			fromURL: function(preValue) {
				this.getOwnerComponent().OppType = "";                                                                                           //PCR026243++
				//************************Start Of PCR022669: Q2C Q2 UI Changes**************
				if (preValue === this.getResourceBundle().getText("S2PSRDETERMINDFTPARAM")) {
					that_S2.oArgs = {};
					if(that_S2.oArgs.Guid === undefined || that_S2.oArgs.ItemGuid === undefined){										
					   that_S2.oArgs.Guid = this.getOwnerComponent().Guid;
					   that_S2.oArgs.ItemGuid = this.getOwnerComponent().ItemGuid;
					   if(that_S2.oArgs.VerNo === undefined){                                                                                    //PCR023905++
						   that_S2.oArgs.VerNo = this.getOwnerComponent().VerNo;                                                                 //PCR023905++
					   }                                                                                                                         //PCR023905++
				   }
				}
				//************************End Of PCR022669: Q2C Q2 UI Changes**************
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.SecurityDataSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.read, "", "");
				var sValidate = "GenralInfoSet(Guid=guid'" + that_S2.oArgs.Guid + "',ItemGuid=guid'" + that_S2.oArgs.ItemGuid +
					"')?$expand=NAV_ASM_INFO,NAV_BMHEAD_INFO,NAV_BMO_INFO,NAV_BSM_INFO,NAV_CON_INFO,NAV_GPM_INFO,NAV_GSM_INFO,NAV_KPU_INFO,NAV_PM_INFO,NAV_POM_INFO,NAV_RBM_INFO,NAV_ROM_INFO,NAV_SALES_INFO,NAV_TPS_INFO,NAV_TRANS_HISTORY";
				this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				var sHeader = "PSRSDA_InfoSet(Guid=guid'" + that_S2.oArgs.Guid + "',ItemGuid=guid'" + that_S2.oArgs.ItemGuid +
				       "')?$expand=NAV_SSDA_FINL,NAV_RRA_QA_PSR,NAV_SSDA_FINN,NAV_SSDA_PARL,NAV_SSDA_EVDOC,NAV_BSDA_EVDOC,NAV_CHANGE_HISTORY,NAV_SAF_QA,NAV_CUST_REVSPEC,NAV_SDA_QA,NAV_PSR_QA,NAV_PSR_CC,NAV_FNL_DOCS,NAV_FINN_APRV_HIST,NAV_FINL_APRV_HIST,NAV_PARL_APRV_HIST,NAV_REV_DOCS";   //PCR019903++
				this.serviceCall(sHeader, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				var GeneralInfodata = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData();
				this.getOwnerComponent().Custno = GeneralInfodata.Custno;                                                                                                                             //PCR026243++
				var headerData = this.getOwnerComponent().context;                                                                                                                                    //PCR022669++
				var oppDetails = new sap.ui.model.json.JSONModel();
				var oppDetailsData = {};
				oppDetailsData.CustName = GeneralInfodata.CustName;
				oppDetailsData.FabName = GeneralInfodata.FabName;
				oppDetailsData.OppId = GeneralInfodata.OppId;
				oppDetailsData.ItemNo = GeneralInfodata.ItemNo;
				oppDetailsData.SlotNo = GeneralInfodata.SlotId;
				oppDetailsData.VcPrdid = GeneralInfodata.VcPrdid;
				oppDetailsData.Pbg = GeneralInfodata.Bu;
				oppDetailsData.Kpu = GeneralInfodata.Kpu;
				oppDetails.setData(oppDetailsData);
				this.loadData(oppDetails, headerData);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setVisible(false);                                                                                        //PCR022669++
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false);                                                                                               //PCR022669++
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false);                                                                                               //PCR022669++
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);                                                                                              //PCR022669++
			},
			/**
			 * This method is used to handles Security Role permission to view.
			 * 
			 * @name setGenInfoVisibility
			 * @param
			 * @returns
			 */
			setGenInfoVisibility: function() {
				var SecurityData = this.getModelFromCore(this.getResourceBundle().getText("GLBSECURITYMODEL")).getData();
				var AddBtnVble = "",
					DelBtnVble = "",
					InitPSR = "",
					InitCBC = "",
					InitPDC = "",
					InitSsda = "",
					SdaQaVis = "",
					SpecTypQaVis = "",
					SendApprovalVis = "";
				var ContactLstArr = [com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BUSMELST, com.amat.crm.opportunity
					.Ids.S2GINFO_PANL_CONTACTINFO_TPSLST,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_GPMLST, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_ROMLST,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_POMLST, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLST,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_SALSLST, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMOLST,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_PLHEADLST, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_ASMEHEADLST,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_CONLST, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_9,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_10, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_11,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_POMLIST, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_15,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_16,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_17, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_18,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_12, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_13,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_14,
					com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_ROM_LIST, com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POM_LIST,
					com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_LIST, com.amat.crm.opportunity.Ids
					.S2CBC_PANL_CONTACTINFO_BOMLST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ROM,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SALES_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ASME_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_POM_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BMO_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BUSME_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GSM_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RBM_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_PLHEAD_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CON_LIST
				];
				var ContactLstArrGEN = [com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BUSMELST, com.amat.crm.opportunity
					.Ids.S2GINFO_PANL_CONTACTINFO_TPSLST,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_GPMLST, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_ROMLST,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_POMLST, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLST,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_SALSLST, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMOLST,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_PLHEADLST, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_ASMEHEADLST,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_CONLST
				];
				var ContactLstArrPSR = [com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_9,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_10, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_11,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_POMLIST, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_15,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_16,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_17, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_18,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_12, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_13,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_14
				];
				var ContactLstArrCBC = [
					com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_ROM_LIST, com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POM_LIST,
					com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_LIST, com.amat.crm.opportunity.Ids
					.S2CBC_PANL_CONTACTINFO_BOMLST
				];
				var ContactLstArrPDC = [
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ROM,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SALES_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ASME_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_POM_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BMO_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BUSME_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GSM_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RBM_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_PLHEAD_LIST,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CON_LIST
				];
				var ContactBtnArrGen = [com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BUSMEAddBtn, com.amat.crm
					.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_TPSKATAddBtn,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_ROMAddBtn, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_GPMAddBtn,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_POMAddBtn, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMHeadAddBtn,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_SALSAddBtn, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMOAddBtn,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_PLHEADAddBtn, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_ASMEHEADAddBtn,
					com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_CONddBtn
				];
				var ContactBtnArrPSR = [com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_ROM_ADDBtn,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SALES_ADDBtn, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_AcSME_ADDBtn,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_POM_ADDBtn, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BMO_ADDBtn,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GPM_ADDBtn,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_TPSKAT_ADDBtn, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BUSME_ADDBtn,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BMHead_ADDBtn, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CNTROLLER_ADDBtn,
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_PLHead_ADDBtn
				];
				var ContactBtnArrPDC = [
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ROM_ADDBtn, com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SALES_ADDBtn,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_AcSME_ADDBtn, com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BMO_ADDBtn,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GPM_ADDBtn,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BUSME_ADDBtn, com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GSM_ADDBtn,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RBM_ADDBtn, com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_PLHEAD_ADDBtn,
					com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CON_ADDBtn
				];
				var ContactBtnArrCBC = [
					com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_ROMAddBtn, com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POMAddBtn,
					com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_AddBtn, com.amat.crm.opportunity.Ids
					.S2CBC_PANL_CONTACTINFO_BOM_AddBtn
				];
				(SecurityData.AddContact === this.getResourceBundle().getText("S2ODATAPOSVAL")) ? (AddBtnVble = true) :
				(AddBtnVble = false);
				(SecurityData.DelContact === this.getResourceBundle().getText("S2ODATAPOSVAL")) ? (DelBtnVble = this.getResourceBundle()
					.getText("S2DELPOSVIZTEXT")) : (DelBtnVble = this.getResourceBundle().getText("S2DELNAGVIZTEXT"));
				for (var h = 0; h < ContactBtnArrPSR.length; h++) {
					that_psrsda.byId(ContactBtnArrPSR[h]).setEnabled(AddBtnVble);
					that_psrsda.byId(ContactLstArrPSR[h]).setMode(DelBtnVble);
				}
				for (var i = 0; i < ContactBtnArrCBC.length; i++) {
					that_cbc.byId(ContactBtnArrCBC[i]).setEnabled(AddBtnVble);
					that_cbc.byId(ContactLstArrCBC[i]).setMode(DelBtnVble);
				}
				for (var j = 0; j < ContactBtnArrPDC.length; j++) {
					that_pdcsda.byId(ContactBtnArrPDC[j]).setEnabled(AddBtnVble);
					that_pdcsda.byId(ContactLstArrPDC[j]).setMode(DelBtnVble);
				}
				for (var k = 0; k < ContactBtnArrGen.length; k++) {
					that_general.byId(ContactBtnArrGen[k]).setEnabled(AddBtnVble);
					that_general.byId(ContactLstArrGEN[k]).setMode(DelBtnVble);
				}
				(SecurityData.InitPsr === this.getResourceBundle().getText("S2ODATAPOSVAL")) ? (InitPSR = true) : (
					InitPSR = false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).setEnabled(InitPSR);
				(SecurityData.InitSsda === this.getResourceBundle().getText("S2ODATAPOSVAL")) ? (InitSsda = true) : (
					InitSsda = false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
					InitSsda);
				(SecurityData.InitCbc === this.getResourceBundle().getText("S2ODATAPOSVAL")) ? (InitCBC = true) : (
					InitCBC = false);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_RADIOBtn).setEnabled(InitCBC);
				(SecurityData.InitPdc === this.getResourceBundle().getText("S2ODATAPOSVAL")) ? (InitPDC = true) : (
					InitPDC = false);
				(SecurityData.SdaQa === this.getResourceBundle().getText("S2ODATAPOSVAL")) ? (SdaQaVis = true) : (
					SdaQaVis = false);
				(SecurityData.SpecTypQa === this.getResourceBundle().getText("S2ODATAPOSVAL")) ? (SpecTypQaVis = true) :
				(SpecTypQaVis = false);
				(SecurityData.SendApproval === this.getResourceBundle().getText("S2ODATAPOSVAL")) ? (SendApprovalVis =
					true) : (SendApprovalVis = false);
			},
			/**
			 * This method is used to handles loading view Data.
			 * 
			 * @name loadData
			 * @param oppDetails:GeninfoData ,headerData:S2 page Title Data
			 * @returns
			 */
			loadData: function(oppDetails, headerData) {
				var OppGenInfoModel = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
				that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_GINFO).setIconColor(sap.ui.core.IconColor.Default);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox).setVisible(false);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISIONBox).setVisible(false);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_BOX).setVisible(false);
				//that_carm.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DECISION_HBOX).setVisible(false);                                     PCR021481--
				var Guid = OppGenInfoModel.getData().Guid;
				var ItemGuid = OppGenInfoModel.getData().ItemGuid;
//				that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);                                                                  //PCR022669--
				var OppTitle = oppDetails.getData();
				var oppPSRData = {};
				oppPSRData.OppId = OppTitle.OppId;
				that_S2.OppId = OppTitle.OppId;
				oppPSRData.ItemNo = OppTitle.ItemNo;
				that_S2.ItemNo = OppTitle.ItemNo;
				oppPSRData.AmatQuoteId = OppGenInfoModel.getData().AmatQuoteId;
				oppPSRData.QuoteItemNo = OppGenInfoModel.getData().QuoteItemNo;
				oppPSRData.SlotNo = OppGenInfoModel.getData().SlotId;
				oppPSRData.CustName = OppGenInfoModel.getData().CustName;
				that_S2.CustName = OppGenInfoModel.getData().CustName;
				oppPSRData.Bu = OppGenInfoModel.getData().Bu;
				oppPSRData.FabName = OppGenInfoModel.getData().FabName;
				oppPSRData.Division = OppGenInfoModel.getData().Division;
				oppPSRData.Kpu = OppGenInfoModel.getData().ProductLine;
				oppPSRData.OppStatus = OppGenInfoModel.getData().S5FcastBSt;
				oppPSRData.ActBookDate = OppGenInfoModel.getData().ActBookDate;
				oppPSRData.CurrcustReqDt = OppGenInfoModel.getData().CurrcustReqDt;
				oppPSRData.FcstRevDate = OppGenInfoModel.getData().FcstRevDate;
				oppPSRData.AppName = OppGenInfoModel.getData().Application;
				oppPSRData.Platform = OppGenInfoModel.getData().Platform;
				oppPSRData.FcstBookDate = OppGenInfoModel.getData().FcstBookDate;
				oppPSRData.PoNumber = OppGenInfoModel.getData().PoNumber;
				oppPSRData.NetValueMan = OppGenInfoModel.getData().NetValueMan;
				oppPSRData.OrderType = OppGenInfoModel.getData().OrderType;
				oppPSRData.WeferSize = OppGenInfoModel.getData().Wafersize;
				oppPSRData.SoNumber = OppGenInfoModel.getData().SoNumber;
				oppPSRData.ProdFamily = OppGenInfoModel.getData().ProdFamily;
				//*** Justification: PCR019078 Chamber code display in PSR  ***
				oppPSRData.ChamberCode = OppGenInfoModel.getData().ChamberCode;                                          //PCR019078++	
				oppPSRData.CustSortName = OppGenInfoModel.getData().CustSortName;                                        //PCR021481++
				oppPSRData.OrderType = OppGenInfoModel.getData().OrderType;                                              //PCR021481++
				oppPSRData.OppDesc = OppGenInfoModel.getData().OppDesc;                                                  //PCR021481++
				oppPSRData.EccRraLevel = OppGenInfoModel.getData().EccRraLevel;                                          //PCR021481++
				oppPSRData.ActShipDate = OppGenInfoModel.getData().ActShipDate;                                          //PCR022669++
				oppPSRData.MeaValueDesc = OppGenInfoModel.getData().MeaValueDesc;                                        //PCR022669++
				oppPSRData.Pod = OppGenInfoModel.getData().Pod;                                                          //PCR022669++
				var OppPSRInfoModel = this.getJSONModel(oppPSRData);
				this.setGenInfoVisibility();
				this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_ROMLST, com.amat.crm.opportunity
					.Ids.S2GINFO_PANL_CONTACTINFO_ROMLSTEMP, OppGenInfoModel.getData().NAV_ROM_INFO);
				this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_POMLST, com.amat.crm.opportunity
					.Ids.S2GINFO_PANL_CONTACTINFO_POMLSTEMP, OppGenInfoModel.getData().NAV_POM_INFO);
				this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLST, com.amat.crm.opportunity
					.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLSTEMP, OppGenInfoModel.getData().NAV_BMHEAD_INFO);
				this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_SALSLST, com.amat.crm.opportunity
					.Ids.S2GINFO_PANL_CONTACTINFO_SALSLSTEMP, OppGenInfoModel.getData().NAV_SALES_INFO);
				this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMOLST, com.amat.crm.opportunity
					.Ids.S2GINFO_PANL_CONTACTINFO_BMOLSTEMP, OppGenInfoModel.getData().NAV_BMO_INFO);
				this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_PLHEADLST, com.amat.crm.opportunity
					.Ids.S2GINFO_PANL_CONTACTINFO_PLHEADLSTEMP, OppGenInfoModel.getData().NAV_KPU_INFO);
				this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_ASMEHEADLST, com.amat.crm.opportunity
					.Ids.S2GINFO_PANL_CONTACTINFO_ASMEHEADLSTEMP, OppGenInfoModel.getData().NAV_ASM_INFO);
				this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_CONLST, com.amat.crm.opportunity
					.Ids.S2GINFO_PANL_CONTACTINFO_CONLSTEMP, OppGenInfoModel.getData().NAV_CON_INFO);
				this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_GPMLST, com.amat.crm.opportunity
					.Ids.S2GINFO_PANL_CONTACTINFO_GPMLSTEMP, OppGenInfoModel.getData().NAV_GPM_INFO);
				this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_TPSLST, com.amat.crm.opportunity
					.Ids.S2GINFO_PANL_CONTACTINFO_TPSLSTEMP, OppGenInfoModel.getData().NAV_TPS_INFO);
				this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BUSMELST, com.amat.crm.opportunity
					.Ids.S2GINFO_PANL_CONTACTINFO_BUSMELSTEMP, OppGenInfoModel.getData().NAV_BSM_INFO);
				if (OppGenInfoModel.getData().Division === this.getResourceBundle().getText("S2ICONTABPDCTEXT") ||
						OppGenInfoModel.getData().Division === this.getResourceBundle().getText("S2D3TEXT")) {
					that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_GPMLST).getHeaderToolbar().mAggregations.content[0].setText(
						this.getResourceBundle().getText("S2PDCCONINFOGSM"));
					that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLST).getHeaderToolbar().mAggregations.content[0].setText(
						this.getResourceBundle().getText("S2PDCCONINFORBM"));
					this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_GPMLST, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_GPMLSTEMP,
						OppGenInfoModel.getData().NAV_GSM_INFO);
					this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLST, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLSTEMP,
						OppGenInfoModel.getData().NAV_RBM_INFO);
				} else {
					that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_GPMLST).getHeaderToolbar().mAggregations.content[0].setText(
						this.getResourceBundle().getText("S2PSRWFAPPPANLGPMINFOCONTIT"));
					that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLST).getHeaderToolbar().mAggregations.content[0].setText(
						this.getResourceBundle().getText("S2GINFOPANLCONINFOBMHEADTIT"));
					this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_GPMLST, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_GPMLSTEMP,
						OppGenInfoModel.getData().NAV_GPM_INFO);
					this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLST, com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLSTEMP,
						OppGenInfoModel.getData().NAV_BMHEAD_INFO);
				}
				if (OppGenInfoModel.getData().Division === this.getResourceBundle().getText("S2ICONTABPDCTEXT") ||
						OppGenInfoModel.getData().Division === this.getResourceBundle().getText("S2D3TEXT")) {
					that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setVisible(false);
					that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setVisible(true);
					sap.ui.getCore().setModel(OppPSRInfoModel, this.getResourceBundle().getText("GLBOPPPSRINFOMODEL"));
					this.getView().getContent()[0].setTitle(OppTitle.CustName + "-" + OppTitle.FabName + "-" + OppTitle.OppId +
						"_" + OppTitle.ItemNo + "-" + OppTitle.SlotNo + "-" + OppTitle.VcPrdid + "-" + OppTitle.Pbg);
					var GenInfoModel = this.getJSONModel(OppGenInfoModel.getData());
					that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_SFRM).setModel(GenInfoModel);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_DISPLAY_482).setModel(
						OppPSRInfoModel);
					this.fnContactInfoPDC(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ROM, com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_9,
						OppGenInfoModel.getData().NAV_ROM_INFO);
					this.fnContactInfoPDC(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SALES_LIST, com.amat.crm.opportunity
						.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_10, OppGenInfoModel.getData().NAV_SALES_INFO);
					this.fnContactInfoPDC(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ASME_LIST, com.amat.crm.opportunity
						.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_11, OppGenInfoModel.getData().NAV_ASM_INFO);
					this.fnContactInfoPDC(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_POM_LIST, com.amat.crm.opportunity.Ids
						.S2PDC_SDA_PANL_LIST_TEMPLATE_15, OppGenInfoModel.getData().NAV_POM_INFO);
					this.fnContactInfoPDC(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BMO_LIST, com.amat.crm.opportunity.Ids
						.S2PDC_SDA_PANL_LIST_TEMPLATE_16, OppGenInfoModel.getData().NAV_BMO_INFO);
					this.fnContactInfoPDC(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BUSME_LIST, com.amat.crm.opportunity
						.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_17, OppGenInfoModel.getData().NAV_BSM_INFO);
					this.fnContactInfoPDC(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GSM_LIST, com.amat.crm.opportunity.Ids
						.S2PDC_SDA_PANL_LIST_TEMPLATE_18, OppGenInfoModel.getData().NAV_GSM_INFO);
					this.fnContactInfoPDC(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RBM_LIST, com.amat.crm.opportunity.Ids
						.S2PDC_SDA_PANL_LIST_TEMPLATE_12, OppGenInfoModel.getData().NAV_RBM_INFO);
					this.fnContactInfoPDC(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_PLHEAD_LIST, com.amat.crm.opportunity
						.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_13, OppGenInfoModel.getData().NAV_KPU_INFO);
					this.fnContactInfoPDC(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CON_LIST, com.amat.crm.opportunity.Ids
						.S2PDC_SDA_PANL_LIST_TEMPLATE_14, OppGenInfoModel.getData().NAV_CON_INFO);
					//************************Start Of PCR022669: Q2C Q2 UI Changes**************
					//var Guid = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData()
					//	.Guid;
					//var ItemGuid = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData()
					//	.ItemGuid;
					//var sValidate = "PDCSDA_InfoSet(Guid=guid'" + Guid + "',ItemGuid=guid'" + ItemGuid +
					//	"')?$expand=NAV_CHANGE_HISTORY_PDC,NAV_RRA_QA_PDC,NAV_PDC_BSDA_FINL,NAV_PDC_BSDA_FINN,NAV_PDC_BSDA_PARL,NAV_PDC_CC,NAV_PDC_FNL_DOCS,NAV_PDC_QA_SAF,NAV_PDC_SSDA_FINL,NAV_PDC_SSDA_FINN,NAV_PDC_SSDA_PARL,NAV_PDCBSDA_EVDOC,NAV_PDCCUST_REVSPEC,NAV_REV_DOCS,NAV_PDCSSDA_EVDOC";
					//this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
					//this.PDCCData = this.getModelFromCore(this.getResourceBundle().getText("GLBPDCSDAMODEL")).getData().NAV_PDC_CC;
					//************************End Of PCR022669: Q2C Q2 UI Changes**************
				} else {					
					that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setVisible(true);
					that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setVisible(false);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FORM_DISPLAY_482).setModel(
						OppPSRInfoModel);
					sap.ui.getCore().setModel(OppPSRInfoModel, this.getResourceBundle().getText("GLBOPPPSRINFOMODEL"));
					this.getView().getContent()[0].setTitle(OppTitle.CustName + "-" + OppTitle.FabName + "-" + OppTitle.OppId +
						"_" + OppTitle.ItemNo + "-" + OppTitle.SlotNo + "-" + OppTitle.VcPrdid + "-" + OppTitle.Pbg);
					var GenInfoModel = this.getJSONModel(OppGenInfoModel.getData());
					that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_SFRM).setModel(GenInfoModel);
					this.fnContactInfoPSR(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_POMLIST, com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_POMLIST_TEMPLATE, OppGenInfoModel.getData().NAV_POM_INFO);
					this.fnContactInfoPSR(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_9, com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_LIST_TEMPLATE_9, OppGenInfoModel.getData().NAV_ROM_INFO);
					this.fnContactInfoPSR(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_10, com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_LIST_TEMPLATE_10, OppGenInfoModel.getData().NAV_SALES_INFO);
					this.fnContactInfoPSR(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_11, com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_LIST_TEMPLATE_11, OppGenInfoModel.getData().NAV_ASM_INFO);
					this.fnContactInfoPSR(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_12, com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_LIST_TEMPLATE_12, OppGenInfoModel.getData().NAV_BMHEAD_INFO);
					this.fnContactInfoPSR(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_14, com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_LIST_TEMPLATE_14, OppGenInfoModel.getData().NAV_KPU_INFO);
					this.fnContactInfoPSR(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_13, com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_LIST_TEMPLATE_13, OppGenInfoModel.getData().NAV_CON_INFO);
					this.fnContactInfoPSR(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_15, com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_LIST_TEMPLATE_15, OppGenInfoModel.getData().NAV_BMO_INFO);
					this.fnContactInfoPSR(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_16, com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_LIST_TEMPLATE_16, OppGenInfoModel.getData().NAV_GPM_INFO);
					this.fnContactInfoPSR(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_17, com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_LIST_TEMPLATE_17, OppGenInfoModel.getData().NAV_TPS_INFO);
					this.fnContactInfoPSR(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_18, com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_LIST_TEMPLATE_18, OppGenInfoModel.getData().NAV_BSM_INFO);
					//this.fnContactInfoGen(com.amat.crm.opportunity.Ids.S2GINFO_PANL_TRANSHIS_TRANHIS_TABLE, com.amat.crm.opportunity                                     //PCR021481--
					//	.Ids.S2GINFO_PANL_TRANSHIS_TRANHIS_LISTTAMP, OppGenInfoModel.getData().NAV_TRANS_HISTORY);                                                         //PCR021481--
				}
				//***************Start Of PCR020999: Replaced SDA with RRA********
				var oppQuesdata = that_S2.getModelFromCore(this.getResourceBundle().getText("GLBPSRMODEL")).getData();                                                             //PCR022669--; PCR026110++
				//if(oppQuesdata.Asc606_Flag === that_S2.getResourceBundle().getText("S2ODATAPOSVAL") && (oppQuesdata.PsrRequired ==="" || oppQuesdata.Asc606_BsdaFlag ===         //PCR022669--
				//	that_S2.getResourceBundle().getText("S2ODATAPOSVAL") || oppQuesdata.Asc606_SsdaFlag === that_S2.getResourceBundle().getText("S2ODATAPOSVAL"))){                //PCR022669--
				if(OppGenInfoModel.getData().Asc606Flag === that_S2.getResourceBundle().getText("S2ODATAPOSVAL") && (OppGenInfoModel.getData().PsrStatus ==="" ||                  //PCR025717++; Asc606_Flag replaced with Asc606Flag; PsrRequired replaced with PsrStatus
						OppGenInfoModel.getData().Asc606BsdaFlag === that_S2.getResourceBundle().getText("S2ODATAPOSVAL") || OppGenInfoModel.getData().Asc606SsdaFlag ===          //PCR025717++; Asc606_SsdaFlag replaced with Asc606SsdaFlag; Asc606_BsdaFlag replaced with Asc606BsdaFlag
							that_S2.getResourceBundle().getText("S2ODATAPOSVAL")|| oppQuesdata.OldBsdaVal !== "")){                                                                //PCR026110++; added OldBsdaVal condition
					that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setText(that_S2.getResourceBundle().getText("S2PSRSDAICONTABFTEXTASC606"));
					that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setText(that_S2.getResourceBundle().getText("S2PDCSDAICONTABFTEXTASC606"));
				}else{
					that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setText(that_S2.getResourceBundle().getText("S2PSRSDAICONTABFTEXT"));
					that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setText(that_S2.getResourceBundle().getText("S2PDCSDAICONTABFTEXT"));
			    }
				//***************End Of PCR020999: Replaced SDA with RRA********
				//this.setIconTabFilterColor();                                                                                                                                    //PCR022669--
				this.setIconTabFilterColor(this.getResourceBundle().getText("S2PSRDETERMINDFTPARAM"));                                                                             //PCR022669++
				that_general.getController().setQuoteRevisionNumber();
				//***************Start Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
				this.getMainCommModel(this.getResourceBundle().getText("S2GENINFOMCOMMDATATYP"));
				var GenInfoCommModelLength = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBGENCOMMMODEL")).getData().results.length;
				GenInfoCommModelLength > 0 ? that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_PANEL).setExpanded(true) : "";
			},
			/**
			 * This method is used to get Main Comment Model.
			 * 
			 * @name getMainCommModel
			 * @param id: MainCommTyp - Main Comment Type
			 * @returns
			 */
			getMainCommModel: function(MainCommTyp) {
				var ItemGuid = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
				var sValidate = "CommentsSet?$filter=ItemGuid eq guid'" + ItemGuid + "'and CommType eq '" + MainCommTyp + "'";
				this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			},
			//***************End Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
			/**
			 * This method is used to set contact Info data for General Info tab.
			 * 
			 * @name fnContactInfoGen
			 * @param id: TableId, template: Table template Id, listItem: List Data
			 * @returns
			 */
			fnContactInfoGen: function(id, template, listItem) {
				var cModel = this.getJSONModel(listItem);
				var oTableItems = that_general.byId(id);
				var oItemTemplate = that_general.byId(template);
				oTableItems.setModel(cModel);
				oTableItems.bindAggregation("items", {
					path: "/results",
					template: oItemTemplate
				});
			},
			/**
			 * This method is used to set contact Info data for PDC-SDA Info tab.
			 * 
			 * @name fnContactInfoPDC
			 * @param id: TableId, template: Table template Id, listItem: List Data
			 * @returns
			 */
			fnContactInfoPDC: function(id, template, listItem) {
				var cModel = this.getJSONModel(listItem);
				var oTableItems = that_pdcsda.byId(id);
				var oItemTemplate = that_pdcsda.byId(template);
				oTableItems.setModel(cModel);
				oTableItems.bindAggregation("items", {
					path: "/results",
					template: oItemTemplate
				});
			},
			/**
			 * This method is used to set contact Info data for PSR-SDA Info tab.
			 * 
			 * @name fnContactInfoPSR
			 * @param id: TableId, template: Table template Id, listItem: List Data
			 * @returns
			 */
			fnContactInfoPSR: function(id, template, listItem) {
				var cModel = this.getJSONModel(listItem);
				var oTableItems = that_psrsda.byId(id);
				var oItemTemplate = that_psrsda.byId(template);
				oTableItems.setModel(cModel);
				oTableItems.bindAggregation("items", {
					path: "/results",
					template: oItemTemplate
				});
			},
			/**
			 * This method is used to set the Icon tab color for PSR-SDA,CBC,CaRM tabs.
			 * 
			 * @name setIconTabFilterColor
			 * @param 
			 * @returns oEvent parameter decides for GenInfo Model needs to refresh or not 
			 */
			//************************Start Of PCR022669: Q2C Q2 UI Changes**************
			//setIconTabFilterColor: function() {
			setIconTabFilterColor: function(oEvent) {
				if(oEvent === undefined){
					var sValidate = "GenralInfoSet(Guid=guid'" + that_S2.oArgs.Guid + "',ItemGuid=guid'" + that_S2.oArgs.ItemGuid +
					"')?$expand=NAV_ASM_INFO,NAV_BMHEAD_INFO,NAV_BMO_INFO,NAV_BSM_INFO,NAV_CON_INFO,NAV_GPM_INFO,NAV_GSM_INFO,NAV_KPU_INFO,NAV_PM_INFO,NAV_POM_INFO,NAV_RBM_INFO,NAV_ROM_INFO,NAV_SALES_INFO,NAV_TPS_INFO,NAV_TRANS_HISTORY";
				    this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				}
				//************************End Of PCR022669: Q2C Q2 UI Changes**************
				var OppGenInfoModel = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
				that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Default);
				that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Default);
				that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Default);
				that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setIconColor(sap.ui.core.IconColor.Default);
				var modelData = OppGenInfoModel.getData();                                                                                      //PCR022669++
				if (OppGenInfoModel.getData().Division === this.getResourceBundle().getText("S2ICONTABPDCTEXT") ||
						OppGenInfoModel.getData().Division === this.getResourceBundle().getText("S2D3TEXT")){
					//var modelData = this.getModelFromCore(this.getResourceBundle().getText("GLBPDCSDAMODEL")).getData();                      //PCR022669--
					switch (parseInt(modelData.PsrStatus)) {
						case 660:
						case 685:
						case 655:
						case 690:                                                                                                               //PCR019492++  
						case 695:                                                                                                               //PCR021481++  
							that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setIconColor(sap.ui.core.IconColor.Positive);
							break;
						case 605:
						case 604:
						case 640:
						case 645:
						case 646:
						case 650:
						case 665:
						case 670:
						case 675:
						case 680:
						case 682:
							that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setIconColor(sap.ui.core.IconColor.Critical);
							break;
						default:
							that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setIconColor(sap.ui.core.IconColor.Default);
					}				
				} else {
					//var modelData = this.getModelFromCore(this.getResourceBundle().getText("GLBPSRMODEL")).getData();                         //PCR022669--
					switch (parseInt(modelData.PsrStatus)) {
						case 55:
						case 58:
						case 60:
						case 85:
						case 90:                                                                                                                //PCR019492++  
						case 95:                                                                                                                //PCR021481++ added new 95 condition
							that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Positive);
							break;
						case 5:
						case 4:
						case 15:
						case 17:
						case 20:
						case 25:
						case 40:
						case 45:
						case 50:
						case 65:
						case 70:
						case 75:
						case 80:
							that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Critical);
							break;
						default:
							that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Default);
					}
				}
				switch (parseInt(modelData.CbcStatus)) {
					case 530:
					case 540:
					case 560:
						that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Positive);
						break;
					case 500:
					case 505:
					case 510:
					case 520:
						that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Critical);
						break;
					default:
						that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Default);
				}
				if (modelData.CarmReq === "" && modelData.CarmStatus === "") {
					that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Default);
					if (this.getModelFromCore(this.getResourceBundle().getText("GLBOPPPSRINFOMODEL")).getData().OppStatus ===
						"Booked") {
						that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Negative);
					}
				} else {
					switch (parseInt(modelData.CarmStatus)) {
						case 96:
						case 97:
							that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Positive);
							break;
						case 95:
							that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Critical);
							break;
					}
				}
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				switch (parseInt(OppGenInfoModel.getData().EsaStatus)) {
					case 5:
					case 10:
					case 35:
						that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_ESA).setIconColor(sap.ui.core.IconColor.Critical);
						break;
					case 20:
					case 40:
						that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_ESA).setIconColor(sap.ui.core.IconColor.Negative);
						break;
					case 30:
					case 50:
					case 95:
						that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_ESA).setIconColor(sap.ui.core.IconColor.Positive);
						break;
					default: that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_ESA).setIconColor(sap.ui.core.IconColor.Default);
				 }
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				//***********Start Of PCR026551: Preshipment Checklist Development**************				 
				var pspValidate = "PSP_StatusSet(ItemGuid=guid'" + that_S2.oArgs.ItemGuid +	"')";
			    this.serviceCall(pspValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			    var pspStatusModel = this.getModelFromCore("PspStatusModel");
			    var statusModelData = pspStatusModel.getData();
			    switch (parseInt(statusModelData.Status)) {
			       case 5:                                                                                                                						
			    	   that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSP).setIconColor(sap.ui.core.IconColor.Critical);
			          break;
			       case 20:                                                                                                                						
			          that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSP).setIconColor(sap.ui.core.IconColor.Positive);
			          break;
			       case 10:                                                                                                                						
			    	   that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSP).setIconColor(sap.ui.core.IconColor.Positive);
			          break;
			       default: that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSP).setIconColor(sap.ui.core.IconColor.Default);
				 }
				//***********End Of PCR026551: Preshipment Checklist Development****************
			},
			/**
			 * This method Used to Back Button Press Event.
			 * 
			 * @name onNavBack
			 * @param 
			 * @returns 
			 */
			onNavBack: function() {
				this.getOwnerComponent().Custno = "";                                                                                                //PCR026243++
				this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).getContent()[0].getController().carmDate = null;
				this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).getContent()[0].getController().carmMainCom = "";
				that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_PANEL).setExpanded(false);
				that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_PANEL).setExpanded(false);
				that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_BOOKING_PANEL).setExpanded(true);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_CBCRESET).setVisible(false);                                          //PCR018375++
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(false);  										 //PCR026551++
				that_carm.byId(com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RESET_LIST_PANEL).setExpanded(false);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RESET_LIST_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RESET_LIST_PANEL).setVisible(false);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RESET_LIST_PANEL).setVisible(false);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_RESET_LIST_PANEL).setVisible(false);                                           //PCR018375++
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_RESET_LIST_PANEL).setExpanded(false);                                          //PCR018375++
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MEA_DOC_PANEL).setExpanded(false);                                             //PCR018375++
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_RELSPECINSTLDAYS).setVisible(false);                                             //PCR019492++
				//that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).getButtons().length > 3 ?                                //PCR019492++; PCR021481-- 
				//		that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).getButtons()[3].destroy(): "";                     //PCR019492++; PCR021481--
				if(that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).getButtons().length > 4){                               //PCR021481++
					for(var i = 4; i < that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).getButtons().length; i++){          //PCR021481++
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).getButtons()[i].destroy();                         //PCR021481++
						i--;                                                                                                                         //PCR021481++
					}                                                                                                                                //PCR021481++
				}                                                                                                                                    //PCR021481++
				if(that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp).getButtons().length > 4){                               //PCR019492++;	PCR021481++ modified length comparison value from 3 to 4	
					for(var i = 4; i < that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp).getButtons().length; i++){          //PCR019492++; PCR021481++ modified condition i value from 3 to 4
						that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp).getButtons()[i].destroy();                         //PCR019492++
						i--;                                                                                                                         //PCR019492++
					}                                                                                                                                //PCR019492++
				}                                                                                                                                    //PCR019492++
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setVisible(false);                                                  //PCR019492++
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setVisible(false);                                                  //PCR019492++
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_ESACANCEL).setVisible(false);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_ESARESET).setVisible(false);
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSR_RRA_RESET).setVisible(false);									 //PCR034716++
				that_esa.byId(com.amat.crm.opportunity.Ids.S2ESAIDEINITDESBX).setVisible(false);                                                     //PCR025717++
				that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Default);
				that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Default);
				that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Default);
				that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setIconColor(sap.ui.core.IconColor.Default);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setSelectedIndex(-
					1);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(false);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).removeStyleClass(this.getResourceBundle()
					.getText("S2PSRSDAINITCLS"));
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).removeStyleClass(this.getResourceBundle()
					.getText("S2PSRSDANTREQCLS"));
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).removeStyleClass(this.getResourceBundle()
					.getText("S2PSRSDANTINTCLS"));
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).removeStyleClass(this.getResourceBundle()
					.getText("S2PSRSDADFTCLS"));
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(this.getResourceBundle().getText(
					"S2PSRSDAEDITICON"));
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(this.getResourceBundle().getText(
					"S2PSRSDAEDITBTNTXT"));
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(this.getResourceBundle().getText(
					"S2PSRSDAWFICON"));
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(this.getResourceBundle().getText(
					"S2PSRSDASUBFORAPP"));
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).setText("");
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey("");
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setSelected(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setValue("");
				//that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_TRANSHIS).setExpanded(false);                                                                                             //PCR021481--
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(false);
				that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_PANEL).setExpanded(
					false);
				that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_POSTBOOKINGCHANGE_PANEL).setExpanded(
					false);
				that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_POSTBOOKING_PANEL).setExpanded(
					false);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(
					false);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DEP_CHECKBOX).setEnabled(false);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(
					false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CONTACTINFO_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecTYPE_PANEL).setExpanded(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_B_APPROVALS_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_BAR).setVisible(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox).setVisible(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISION_CONTENT).setVisible(false);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_PANEL).setExpanded(true);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_PANEL).setExpanded(false);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_PANEL).setExpanded(false);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_APR_PANEL).setExpanded(false);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).setSelectedIndex(-1);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).addStyleClass(this.getResourceBundle()
					.getText("S2PSRSDAMANDATCLS"));
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).setText("");
				this.SelectedRecord.results.length = 0
				var aMockMessages = [];
				var viewModel = new sap.ui.model.json.JSONModel();
				viewModel.setData({
					messagesLength: aMockMessages.length + ''
				});
				this.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setModel(viewModel);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setVisible(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setEnabled(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(true);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).setSelectedKey(this.getResourceBundle().getText(
					"S2ICONTABDEFAULTKEY"));
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).addStyleClass(this.getResourceBundle().getText(
					"S2PSRSDADFTCLS"));
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LOOKUP_LISTBtn).setVisible(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setVisible(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setVisible(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox).setVisible(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CONTACTINFO_PANEL).setVisible(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLEFORM_DISPLAY_360).setVisible(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecTYPE_PANEL).setVisible(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLEFORM_DISPLAY_370).setVisible(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setVisible(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_B_APPROVALS_PANEL).setVisible(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL).setVisible(true);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false);
				this.getOwnerComponent().getRouter().navTo(this.getResourceBundle().getText("S2DASHBOARDROUT"), {});
			},
			/**
			 * This method Handles all Panels Expanded Reset.
			 * 
			 * @name resetPannels
			 * @param evt - Event Handler
			 * @returns 
			 */
			resetPannels : function(){
				that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_PANEL).setExpanded(false);
				that_carm.byId(com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RESET_LIST_PANEL).setExpanded(false);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RESET_LIST_PANEL).setExpanded(false);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL).setExpanded(false);
				//that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_TRANSHIS).setExpanded(false);                                                                                //PCR021481--
				that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setExpanded(false);
				that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_PANEL).setExpanded(
						false);
				that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_POSTBOOKINGCHANGE_PANEL).setExpanded(
						false);
				that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_POSTBOOKING_PANEL).setExpanded(
						false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CONTACTINFO_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecTYPE_PANEL).setExpanded(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setExpanded(true);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_B_APPROVALS_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL).setExpanded(false);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_PANEL).setExpanded(true);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_PANEL).setExpanded(false);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_PANEL).setExpanded(false);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_APR_PANEL).setExpanded(false);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_PANEL).setExpanded(false);
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setExpanded(true);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL).setExpanded(true);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setExpanded(true);
			},
			//************************Start Of PCR019492: 3536 : ASC606 UI Changes**************
			/**
			 * This method create radio button in radio button group.
			 * 
			 * @name createRdBtn
			 * @param btnText - Radio Button Text, rdBtnGrp - PSR/PDC radio Button Group Element
			 * @returns 
			 */
			createRdBtn: function(btnText, rdBtnGrp){
				rdBtnGrp.addButton(new sap.m.RadioButton({text: btnText, valueState: "Error", enabled: true, editable: true}));
			},
			//************************End Of PCR019492: 3536 : ASC606 UI Changes**************
			/**
			 * This method Handles Icon Tab Bar Event.
			 * 
			 * @name onSelectedTab
			 * @param evt - Event Handler
			 * @returns 
			 */
			onSelectedTab: function(evt) {
				this.SelectedRecord.results.length = 0;
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).removeStyleClass(this.getResourceBundle()
					.getText("S2PSRSDAINITCLS"));
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).removeStyleClass(this.getResourceBundle()
					.getText("S2PSRSDANTREQCLS"));
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).removeStyleClass(this.getResourceBundle()
					.getText("S2PSRSDANTINTCLS"));
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).removeStyleClass(this.getResourceBundle()
					.getText("S2PSRSDADFTCLS"));
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).removeStyleClass(this.getResourceBundle()
					.getText("S2PSRSDACARMCOMPLETEDCLS"));
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_ESACANCEL).setVisible(false);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_ESARESET).setVisible(false);
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSR_RRA_RESET).setVisible(false);					   //PCR034716++
				//*************** Start Of PCR018375++ - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_CBCRESET).setVisible(false);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MEA_DOC_PANEL).setExpanded(false);
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_RESET_LIST_PANEL).setExpanded(false);
				//*************** End Of PCR018375++ - 3509 - PSR/CBC Workflow Rejection (restart) Capability ******************//
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(false);							   //PCR026551++
				that_esa.byId(com.amat.crm.opportunity.Ids.S2ESAIDEINITDESBX).setVisible(false);                                       //PCR025717++
				that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CNGHISPNL).setExpanded(false);                                   //PCR022669++
				var OppGenInfoModel = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));                   //PCR019492++
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_RELSPECINSTLDAYS).setVisible(false);                               //PCR019492++
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELLBLTXT).setVisible(false);                                 //PCR019492++
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELRRAVAL).setVisible(false);                                 //PCR019492++
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELLBLTXT).setVisible(false);                                   //PCR019492++
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_BMOSELRRAVAL).setVisible(false);                                   //PCR019492++
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setVisible(false);                                    //PCR019492++
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_RRADEFFNOTE).setVisible(false);                                    //PCR019492++
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(false);
				that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setVisible(false);
				that_S2.resetPannels();
				var MCommTyp = "", MModel = "", MPanel = "", view = "";
				if (evt.getParameters().key === this.getResourceBundle().getText("S2ICONTABCBCTXT")) {
					sap.ui.core.BusyIndicator.show();
					that_cbc.getController().checkCBCInitiate();
					MCommTyp = this.getResourceBundle().getText("S2CBCMCOMMDATATYP");                                                                                                                            //PCR021481++
					MModel =  this.getResourceBundle().getText("GLBCBCCOMMMODEL");                                                                                                                               //PCR021481++
					view = that_cbc;                                                                                                                                                                             //PCR021481++
					MPanel =  com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_PANEL;                                                                                                                        //PCR021481++
					sap.ui.core.BusyIndicator.hide();
				} else if (evt.getParameters().key === this.getResourceBundle().getText("S2ICONTABATTCHKEY")) {
					that_attachment.getController().onExpBookDoc();	
					MCommTyp = this.getResourceBundle().getText("S2ATTCHMCOMMDATATYP");                                                                                                                          //PCR021481++
					MModel =  this.getResourceBundle().getText("GLBATHCOMMMODEL");                                                                                                                               //PCR021481++
					MPanel =  com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_PANEL;                                                                                                                 //PCR021481++
					view = that_attachment;                                                                                                                                                                      //PCR021481++
				} else if (evt.getParameters().key === this.getResourceBundle().getText("S2ICONTABCARMKEY")) {
					sap.ui.core.BusyIndicator.show();
					that_carm.byId(com.amat.crm.opportunity.Ids.S2CARM_RESET_LIST_PANEL).setExpanded(false);                                                                                                     //PCR021481++
					that_carm.getController().checkCarmInitiate();
					MCommTyp = this.getResourceBundle().getText("S2MLIMCOMMDATATYP");                                                                                                                            //PCR021481++
					MModel =  this.getResourceBundle().getText("GLBCARMCOMMMODEL");                                                                                                                              //PCR021481++
					MPanel =  com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_PANEL;                                                                                                                       //PCR021481++
					view = that_carm;                                                                                                                                                                            //PCR021481++
					sap.ui.core.BusyIndicator.hide();
				} else if (evt.getParameters().key === this.getResourceBundle().getText("S2ICONTABPDCSDAKEY")) {
					sap.ui.core.BusyIndicator.show();
					MCommTyp = this.getResourceBundle().getText("S2PDCMCOMMDATATYP");                                                                                                                            //PCR021481++
					MModel =  this.getResourceBundle().getText("GLBPDCCOMMMODEL");                                                                                                                               //PCR021481++
					MPanel =  com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL;                                                                                                                    //PCR021481++
					view = that_pdcsda;                                                                                                                                                                          //PCR021481++
					//************************Start Of PCR019492: 3536 : ASC606 UI Changes**************
					var GenInfoData = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData();
					var rdBtnGrp = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp);
					if(rdBtnGrp.getButtons().length > 4){                                                                                                                                                        //PCR021481++ Modified length comparison value 3 to 4
						for(var i = 4; i < rdBtnGrp.getButtons().length; i++){                                                                                                                                   //PCR021481++ Modified i value 3 to 4
							rdBtnGrp.getButtons()[i].destroy();
							i--;
						}
					}
					//************************End Of PCR019492: 3536 : ASC606 UI Changes**************
					that_pdcsda.getController().checkPDCInitiate();
					sap.ui.core.BusyIndicator.hide();
					that_pdcsda.getController().PDCDisMode();
					that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false);
					that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false);
					var SFAPRBtn = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn);
					var SSDAMandatTxt = that_pdcsdaCntrlr.PDCData.Asc606_SsdaFlag === this.getResourceBundle().getText("S2ODATAPOSVAL") ? this.getResourceBundle().getText("S2PSRSDASHIPPINGLEVQUESTIONASC606"):  //PCR019492++
						this.getResourceBundle().getText("S2PSRSDASHIPPINGLEVQUESTION");                                                                                                                          //PCR019492++
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SMANDAT_FID).setText(SSDAMandatTxt);                                                                                             //PCR019492++
					that_pdcsdaCntrlr.PDCData.Asc606_Flag === this.getResourceBundle().getText("S2ODATAPOSVAL") && parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 655 ?                                        //PCR019492++    
						SFAPRBtn.setText(this.getResourceBundle().getText("S2PSRDCINITRRABTNTXTASC606")): SFAPRBtn.setText(this.getResourceBundle().getText("S2PSRSDASFSSDAINITTXT"));                            //PCR019492++
					(parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 655) ? (
//							SFAPRBtn.setText(this.getResourceBundle().getText("S2PSRSDASFSSDAINITTXT")),                                                                                                          //PCR019492--
						SFAPRBtn.setIcon(this.getResourceBundle().getText("S2PSRSDAWFICON")), SFAPRBtn.setEnabled(true), SFAPRBtn.setVisible(true)) : ("");
					(parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 605 || parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) ===
						685 || parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 690 || parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 695) ?                                                                  //PCR019492++
						(SFAPRBtn.setText(this.getResourceBundle().getText("S2PSRSDASFCANINITXT")), SFAPRBtn.setIcon(this.getResourceBundle().getText(
						"S2CANCELBTNICON")), SFAPRBtn.setEnabled(true), SFAPRBtn.setVisible(true)) : ("");
					(parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 605 && that_pdcsdaCntrlr.PDCData.CcOppId === "" && that_pdcsdaCntrlr.PDCData.CcOpitmId === ""                                              //PCR019492++
						&& that_pdcsdaCntrlr.PDCData.BsdaResetFlag !== this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? SFAPRBtn.setVisible(true): "";                                                  //PCR019492++
					(parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 604 || (parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 605 && that_pdcsdaCntrlr.PDCData.BsdaResetFlag ===                               //PCR019492++
						this.getResourceBundle().getText("S1TABLESALESTAGECOL"))) ? SFAPRBtn.setVisible(false) : "" ;                                                                                             //PCR019492++
					var canInitBtnTxt = that_pdcsdaCntrlr.PDCData.Asc606_SsdaFlag === this.getResourceBundle().getText("S2ODATAPOSVAL")? this.getResourceBundle().getText("S2PSRSDASFCONSSDAINITTXTASC606")       //PCR019492++
						: this.getResourceBundle().getText("S2PSRSDASFCONSSDAINITTXT");                                                                                                                           //PCR019492++
					(parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 665) ? (SFAPRBtn.setText(this.getResourceBundle().getText(canInitBtnTxt)),                                                                 //PCR019492++
							SFAPRBtn.setIcon(this.getResourceBundle().getText("S2CANCELBTNICON")), SFAPRBtn.setEnabled(true), SFAPRBtn.setVisible(true)) : ("");                                                  //PCR019492++
					(parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 660 || parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 655 || parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) ===                          //PCR019492++
						685 || parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 690 || parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 695) ? (that_S2.byId(com.amat.crm.opportunity.Ids                       //PCR019492++
						.ICON_TABF_PDCSDA).setIconColor(sap.ui.core.IconColor.Positive, that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false),
						that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false))) : ("");
					(that_pdcsdaCntrlr.PDCData.CcOppId !== "" && that_pdcsdaCntrlr.PDCData.CcOpitmId !== "") ? (SFAPRBtn.setVisible(false)) : ("");
					(parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 655 && (that_pdcsdaCntrlr.PDCData.CcOppId !== "" &&
						that_pdcsdaCntrlr.PDCData.CcOpitmId !== "")) ? (SFAPRBtn.setVisible(true)) : ("");
					(parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) >= 665 && (that_pdcsdaCntrlr.PDCData.CcOppId !== "" && that_pdcsdaCntrlr.PDCData.CcOpitmId !== "")) ? 
						(that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setVisible(true), that_S2.getView().byId(com.amat.crm.opportunity.Ids
						.S2PDC_SDA_PANL_EDITBtn).setEnabled(true), that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setVisible(true), 
						that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAVEBtn).setEnabled(false)) : ("");
					var bmoUserList = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().NAV_BMO_INFO.results;
					var bmoUserFlag = that_psrsda.getController().checkContact(bmoUserList);
					var romUserFlag = that_psrsda.getController().checkContact(this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().NAV_ROM_INFO.results);                      //PCR028711++
					var asmUserFlag = that_psrsda.getController().checkContact(this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().NAV_ASM_INFO.results);                      //PCR028711++
					var RcreatBsdaBtnTxt = that_pdcsdaCntrlr.PDCData.Asc606_BsdaFlag === this.getResourceBundle().getText("S2ODATAPOSVAL")? this.getResourceBundle().getText("S2PDCBRRARESETBTNTXTASC606") :       //PCR019492++
						this.getResourceBundle().getText("S2PDCRETESTBTNTXT");				
					//(((parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 655 && OppGenInfoModel.getData().ActBookDate === "") && (bmoUserFlag === true && that_pdcsdaCntrlr.PDCData.CcOppId === "" &&            //PCR019492++, ActBookDate condition++; PCR022669--
					(((parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 655) && ((bmoUserFlag === true || romUserFlag === true || asmUserFlag === true) && that_pdcsdaCntrlr.PDCData.CcOppId === "" &&            //PCR022669++, ActBookDate condition--; //PCR028711++, modify reset
						that_pdcsdaCntrlr.PDCData.CcOpitmId === "" && that_pdcsdaCntrlr.PDCData.SsdaResetFlag !== this.getResourceBundle().getText(
							"S1TABLESALESTAGECOL"))) ? (that_S2.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(true), that_S2.getView() 
						.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setText(RcreatBsdaBtnTxt)) : (that_S2.getView().byId(com.amat.crm.opportunity.Ids                                                     //PCR019492++ 
						.S2FTER_BTN_RESET).setVisible(false)));
					var RcreatSsdaBtnTxt = that_pdcsdaCntrlr.PDCData.Asc606_SsdaFlag === this.getResourceBundle().getText("S2ODATAPOSVAL")? this.getResourceBundle().getText("S2PDCSRRARESETBTNTXTASC606") :       //PCR019492++
						this.getResourceBundle().getText("S2PDCRETESTSSDABTNTXT");					
					(parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 660 && (bmoUserFlag === true) && OppGenInfoModel.getData().ActShipDate === "") ? (this.getView().byId(com.amat.crm.opportunity.Ids          //PCR019492++, ActBookDate condition++;PCR022669++:ActBookDate replaced with ActShipDate
						.S2FTER_BTN_RESET).setVisible(true), this.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setText(RcreatSsdaBtnTxt)) : ("");                                                 //PCR019492++
					that_pdcsdaCntrlr.PDCData.PsrRequired === "" ? that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_DISPLAY_300).setVisible(true) :                                               //PCR019492++
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_DISPLAY_300).setVisible(false);                                                                                              //PCR019492++
					parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 655 && that_pdcsdaCntrlr.PDCData.Bsdl === this.getResourceBundle().getText("S2BSDASSMENTLVLAMJD") ? SFAPRBtn.setVisible(false) : "";         //PCR019492++
					//*************** Start Of PCR018375++ - 3509 - PSR/PDC/CBC Main Comment Section in NA ****************//
					(parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 685 || parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 690 || parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 695)?(that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_DECISION_CONTENT).setVisible(true),  //PCR019492++
							that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CONTACTINFO_PANEL).setVisible(false), that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_PANEL)
							.setVisible(false), that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_FORM_360).setVisible(false), that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_PANEL)
							.setVisible(false), that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(false), that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSDAAsses_PANEL)
							.setVisible(false), that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setVisible(false), that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPPROVALS_PANEL)
							.setVisible(false), that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BAPPROVAL_PANEL).setVisible(false), that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL)
							.setVisible(true), that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL).setExpanded(true), that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_CNGHISPNL).setVisible(false)):("");    //PCR019492++
					//*************** End Of PCR018375++ - 3509 - PSR/PDC/CBC Main Comment Section in NA ****************//
				} else if (evt.getParameters().key === this.getResourceBundle().getText("S2ICONTABPSRSDAKEY")) {
					sap.ui.core.BusyIndicator.show();
					var Guid = OppGenInfoModel.getData().Guid;                                                                                                                                                     //PCR022669++
					var ItemGuid = OppGenInfoModel.getData().ItemGuid;                                                                                                                                             //PCR022669++
					that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);                                                                                                                                 //PCR022669++					
					MCommTyp = this.getResourceBundle().getText("S2PSRMCOMMDATATYP");                                                                                                                              //PCR021481++
					MModel =  this.getResourceBundle().getText("PSRMComModel");                                                                                                                                    //PCR021481++
					MPanel =  com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL;                                                                                                                      //PCR021481++
					view = that_psrsda;                                                                                                                                                                            //PCR021481++
					var PSRData = this.getModelFromCore(this.getResourceBundle().getText("GLBPSRMODEL")).getData();
					var GenInfoData = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData();
					if(that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() === this.bundle.getText("S2PSRSDACANBTNTXT")){
						that_psrsda.getController().onEditPSRSDA();
					}
					//************************Start Of PCR019492: 3536 : ASC606 UI Changes**************
					var rdBtnGrp = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp);
					//************Start Of PCR021481--: 4190 : Q2C Q1/Q2 enhancements ***********************
					//rdBtnGrp.getButtons().length > 3 ? rdBtnGrp.getButtons()[3].destroy() : "";
					//if(PSRData.PsrRequired === "" && GenInfoData.ItmDesc.substring(0,4) === this.bundle.getText("S2PSRDCEVALPROPTXT") 
					//		&& PSRData.Asc606_Flag === this.getResourceBundle().getText("S2ODATAPOSVAL")){
					//	rdBtnGrp.getButtons().length === 3 ? this.createRdBtn(this.bundle.getText("S2PSRDCEVALTXT"), rdBtnGrp): "";
					//} else {
					//	rdBtnGrp.getButtons().length > 3 ? rdBtnGrp.getButtons()[3].destroy() : "";
					//}
					//************End Of PCR021481--: 4190 : Q2C Q1/Q2 enhancements ***********************
					if(rdBtnGrp.getButtons().length > 4){                                                                                                                                                        //PCR021481++ Modified length comparison value 3 to 4
						for(var i = 4; i < rdBtnGrp.getButtons().length; i++){                                                                                                                                   //PCR021481++ Modified i value 3 to 4
							rdBtnGrp.getButtons()[i].destroy();
							i--;
						}
					}
					if (PSRData.RevOppId !== "" && PSRData.RevOpitmId !== "") {
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_RELSPECINSTLDAYS).setVisible(true);
					}
					//************************End Of PCR019492: 3536 : ASC606 UI Changes**************
					that_psrsda.getController().refreshRelPerSpecRewData(GenInfoData.Guid, GenInfoData.ItemGuid, false);                                                                                         //PCR022669++; added new parameter false
					that_psrsda.getController().defaultView();
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAF_RADIOBtn).setSelectedIndex(-1);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setEnabled(true);
					var statusVal = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText();
					if (parseInt(PSRData.PsrStatus) >=
						5 && parseInt(PSRData.PsrStatus) <
						60) {
						that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Critical);
						if (parseInt(PSRData.PsrStatus) ===
							55) {
							var SAFBtn = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn);
							SAFBtn.setVisible(true);
							SAFBtn.setIcon(this.getResourceBundle().getText("S2PSRSDADUPLICATEBTN"));
							//************************Start Of PCR019492: 3536 : ASC606 UI Changes**************
//							SAFBtn.setText(this.getResourceBundle().getText("S2PSRSDASFSSDAINITTXT"));                                                                                                      //PCR019492--
							PSRData.Asc606_Flag === this.getResourceBundle().getText("S2ODATAPOSVAL")? SAFBtn.setText(this.getResourceBundle().getText("S2PSRDCINITRRABTNTXTASC606")) 
									: SAFBtn.setText(this.getResourceBundle().getText("S2PSRSDASFSSDAINITTXT"));
							//************************End Of PCR019492: 3536 : ASC606 UI Changes****************
							SAFBtn.setType(this.getResourceBundle().getText("S2CBCPSRCARMBTNTPYACCEPT"));
							(PSRData.InitSsda === this.getResourceBundle().getText("S2ODATAPOSVAL")) ? (SAFBtn.setEnabled(true)) : (SAFBtn.setEnabled(false));
							SAFBtn.setEnabled(true);
							that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Positive);
						}
					} else if (parseInt(PSRData.PsrStatus) === 60 || parseInt(PSRData.PsrStatus) === 58 || parseInt(PSRData.PsrStatus) === 85 || parseInt(PSRData.PsrStatus) === 90 || parseInt(PSRData.PsrStatus) === 95) { //PCR019492++; PCR021481++ added new 95 condition
						that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Positive);
					} else if (parseInt(PSRData.PsrStatus) >= 65) {
						that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Critical);
						(parseInt(PSRData.PsrStatus) === 65) ? (that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true)) :
						("");
					} else if (statusVal === this.getResourceBundle().getText("S2PCBCNTREQSTATTXT")) {
						that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Positive);
					} else if (PSRData.PsrStatus === "") {
						that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Default);
					}
					(parseInt(PSRData.TaskId) !== 0) ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(true), this.getView()
						.byId(
							com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(true)) : (this.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR)
						.setEnabled(
							false), this.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false));
					((parseInt(PSRData.PsrStatus) === 58 || parseInt(PSRData.PsrStatus) === 55) && GenInfoData.Region === this.getResourceBundle().getText(
						"S2OPPREGION")) ? (that_psrsda.byId(com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_SFABtn).setVisible(false)) : ("");
					sap.ui.core.BusyIndicator.hide();
					((parseInt(PSRData.PsrStatus) === 58)) ? (that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor
						.Positive)) : ("");
					var bmoUserList = GenInfoData.NAV_BMO_INFO.results;
					var bmoUserFlag = that_psrsda.getController().checkContact(bmoUserList);
					var romUserFlag = that_psrsda.getController().checkContact(GenInfoData.NAV_ROM_INFO.results);                                                                                                         //PCR028711++
					var asmUserFlag = that_psrsda.getController().checkContact(GenInfoData.NAV_ASM_INFO.results);                                                                                                         //PCR028711++
					var slsUserFlag = that_psrsda.getController().checkContact(GenInfoData.NAV_SALES_INFO.results);																										  //PCR034716++
					var RcreatBsdaBtnTxt = PSRData.Asc606_BsdaFlag === this.getResourceBundle().getText("S2ODATAPOSVAL")? this.getResourceBundle().getText("S2PSRBRRARESETBTNTXTASC606") :                                //PCR019492++
						this.getResourceBundle().getText("S2PSRRETESTBTNTXT");                                                                                                                                            //PCR019492++
					//((parseInt(PSRData.PsrStatus) === 55 || parseInt(PSRData.PsrStatus) === 58) && OppGenInfoModel.getData().ActBookDate === "" && (bmoUserFlag === true && PSRData.CcOppId === "" &&                   //PCR019492++, added ActBookDate condition++; PCR022669--; 
					((parseInt(PSRData.PsrStatus) === 55 || parseInt(PSRData.PsrStatus) === 58) && ((bmoUserFlag === true || romUserFlag === true || asmUserFlag === true) && PSRData.CcOppId === "" &&                   //PCR022669++, added ActBookDate condition--; PCR028711++, modify reset
						PSRData.CcOpitmId === "" && PSRData.SsdaResetFlag !== this.getResourceBundle().getText("S1TABLESALESTAGECOL"))) ? (this.getView()
						.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(true), this.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET)
//						.setText(this.getResourceBundle().getText("S2PSRRETESTBTNTXT"))) : (this.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET)                                                            //PCR019492--
						.setText(RcreatBsdaBtnTxt)) : (this.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET)
						.setVisible(false));
					(parseInt(PSRData.PsrStatus) === 85 && parseInt(PSRData.PsrStatus) === 90 && parseInt(PSRData.PsrStatus) === 95) ? (that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(false), //PCR021481++ added new 95 condition
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn)
							.setIcon(this.getResourceBundle().getText("S2CANCELBTNICON"))) : ("");
					if(PSRData.Asc606_BsdaFlag === ""){                                                                                                                                                                   //PCR019492++
						if(PSRData.OldBsdaVal !== "" && PSRData.Asc606_Flag === this.getResourceBundle().getText("S2ODATAPOSVAL")){                                                                                       //PCR019492++
							(PSRData.Bsdl !== "") ? that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(PSRData.Bsdl):                                                         //PCR019492++
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(this.getResourceBundle().getText("S2BSDASSMENTLVLOP"));                                    //PCR019492++
						} else {                                                                                                                                                                                          //PCR019492++
							(parseInt(PSRData.PsrStatus) >= 15 && GenInfoData.Region === this.getResourceBundle().getText("S2OPPREGION") && PSRData.PsrType ===
								this.getResourceBundle().getText("S2PSRSDASTATREPEAT")) ? (
								(PSRData.Bsdl === this.getResourceBundle().getText("S2BSDASSMENTLVL1")) ? (that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX)
									.setSelectedKey(this.getResourceBundle().getText("S2BSDASSMENTLVL1"))) : (
									(PSRData.Bsdl === this.getResourceBundle().getText("S2BSDASSMENTLVLAMJD")) ? (that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX)
										.setSelectedKey(this.getResourceBundle().getText("S2BSDASSMENTLVLAMJD"))) : (""))) : ("");
						}						
					} else {                                                                                                                                                                                              //PCR019492++
						(PSRData.Bsdl !== "") ? that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(PSRData.Bsdl):                                                             //PCR019492++
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(this.getResourceBundle().getText("S2BSDASSMENTLVLOP"));                                        //PCR019492++
					}			                                                                                                                                                                                          //PCR019492++		
					(parseInt(PSRData.PsrStatus) === 5 && PSRData.CcOppId === "" && PSRData.CcOpitmId === "" && PSRData.BsdaResetFlag !== this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ?                      //PCR019492++	
						(that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(                          //PCR019492++	
						true), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(this.getResourceBundle().getText(
						"S2PSRSDASFCANINITXT")), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(this.getResourceBundle().getText(
						"S2CANCELBTNICON"))) : ("");
					var canInitBtnTxt = PSRData.Asc606_SsdaFlag === this.getResourceBundle().getText("S2ODATAPOSVAL")? this.getResourceBundle().getText("S2PSRSDASFCONSSDAINITTXTASC606")                                 //PCR019492++
							: this.getResourceBundle().getText("S2PSRSDASFCONSSDAINITTXT");                                                                                                                               //PCR019492++
					(parseInt(PSRData.PsrStatus) === 65) ? (that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true),
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true), that_psrsda.byId(com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_SFABtn).setText(canInitBtnTxt), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(this.getResourceBundle().getText("S2CANCELBTNICON"))) : ("");        //PCR019492++
					(parseInt(PSRData.PsrStatus) === 4) ?
					(that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false)) : ("");
					var RcreatSsdaBtnTxt = PSRData.Asc606_SsdaFlag === this.getResourceBundle().getText("S2ODATAPOSVAL")? this.getResourceBundle().getText("S2PSRSRRARESETBTNTXTASC606") :                                //PCR019492++
						this.getResourceBundle().getText("S2PSRRETESTSSDABTNTXT");                                                                                                                                        //PCR019492++
					(parseInt(PSRData.PsrStatus) === 60 && (bmoUserFlag === true) && OppGenInfoModel.getData().ActShipDate === "") ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET)                  //PCR019492++, ActBookDate condition++;PCR022669++:ActBookDate replaced with ActShipDate
//						.setVisible(true), this.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setText(thisCntrlr.bundle.getText("S2PSRRETESTSSDABTNTXT"))) : ("");                                        //PCR019492--
						.setVisible(true), this.getView().byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setText(RcreatSsdaBtnTxt)) : ("");                                                                          //PCR019492++
					((parseInt(PSRData.PsrStatus) === 55 || parseInt(PSRData.PsrStatus) === 58) && GenInfoData.Region === this.bundle.getText(
					"S2OPPREGION")) ? (that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false)) : (parseInt(PSRData.PsrStatus) === 
						60 ? that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false) : "" );
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setValue(PSRData.BsdaJustfication);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_TEXT_AREA).setValue(PSRData.SsdaJustfication);
					//*************** Start Of PCR018375++ - 3509 - PSR/PDC/CBC Main Comment Section in NA ****************//
					(parseInt(PSRData.PsrStatus) === 85 || parseInt(PSRData.PsrStatus) === 90 || parseInt(PSRData.PsrStatus) === 95)?(that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISION_CONTENT).setVisible(true),  //PCR019492++;PCR021481++ added new 95 condition
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CONTACTINFO_PANEL).setVisible(false), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_PANEL)
							.setVisible(false), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLEFORM_DISPLAY_360).setVisible(false), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL)
							.setVisible(false), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(false), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL)
							.setVisible(false), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(false), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL)
							.setVisible(false), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_B_APPROVALS_PANEL).setVisible(false), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL)
							.setVisible(true), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL).setExpanded(true), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435)
							.setVisible(false), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_CNGHISPNL).setVisible(false), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL)                   //PCR019492++
							.setVisible(false), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true),that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn)                     //PCR019492++
							.setIcon(this.getResourceBundle().getText("S2CANCELBTNICON")),that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(this.bundle.getText("S2PSRSDASFCANINITXT"))             //PCR019492++
							,that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(false),that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true)):("");    //PCR019492++;PCR021481++ added enable true condition
					//*************** End Of PCR018375++ - 3509 - PSR/PDC/CBC Main Comment Section in NA ****************//
					that_psrsda.getController().onExpendSections(parseInt(PSRData.PsrStatus), PSRData);
					//*************** Start Of PCR034716++ Q2C ESA,PSR Enhancements **************
					(parseInt(PSRData.PsrStatus) === 55 || parseInt(PSRData.PsrStatus) === 58) && (bmoUserFlag || romUserFlag || slsUserFlag)
				    	&& (!(PSRData.CcOppId !== "" && PSRData.CcOpitmId !== "")) ? that_S2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSR_RRA_RESET).setVisible(true) : 
				    		that_S2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSR_RRA_RESET).setVisible(false);
				    //*************** End Of PCR034716++ Q2C ESA,PSR Enhancements ****************
				} else if (evt.getParameters().key === this.getResourceBundle().getText("S2ICONTABMLITEXT")) {
					MCommTyp = "";
					sap.ui.core.BusyIndicator.show();
					that_mli.getController().getMliData();
					sap.ui.core.BusyIndicator.hide();
				}				
				//***************Start Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
				  else if (evt.getParameters().key === this.getResourceBundle().getText("S2ICONTABDEFAULTKEY")) {
					MCommTyp = this.getResourceBundle().getText("S2GENINFOMCOMMDATATYP");
					MModel =  this.getResourceBundle().getText("GENMComModel");
					MPanel =  com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_PANEL;
					view = that_general;
				}
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
			      else if (evt.getParameters().key === this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT")) {
			    	 MCommTyp = this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT");
					 MModel =  this.getResourceBundle().getText("GLBESAMCOMMMODEL");
					 MPanel =  com.amat.crm.opportunity.Ids.S2ESA_PANL_MAIN_COMMENT_PANEL;
					 view = that_esa;
				     sap.ui.core.BusyIndicator.show();
				     that_esa.getController().onLoadEsa();
				     sap.ui.core.BusyIndicator.hide();
			    }
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				//***********Start Of PCR026551: Pre-Shipment  to SAP Fiori Q2C App**************
			      else if (evt.getParameters().key === this.getResourceBundle().getText("S2PSPIDSPROSTYPTXT")) {
			    	    sap.ui.core.BusyIndicator.show();
			    	    that_psp.getController().onLoadPsp();
						MCommTyp = this.getResourceBundle().getText("S2CBCMCOMMDATATYP");                                                                                                                            //PCR021481++
						MModel =  this.getResourceBundle().getText("GLBCBCCOMMMODEL");                                                                                                                               //PCR021481++
						view = that_psp;                                                                                                                                                                           //PCR021481++
						MPanel =  com.amat.crm.opportunity.Ids.S2PSP_PANL_MAIN_COMMENT_PANEL;                                                                                                                       //PCR021481++
						sap.ui.core.BusyIndicator.hide();
				    }
				//***********End Of PCR026551: Pre-Shipment  to SAP Fiori Q2C App**************
				//if(MCommTyp !== ""){                                                                                                                                                                                            //PCR022669--
				if(MCommTyp !== "" && MCommTyp !== this.getResourceBundle().getText("S2PSRMCOMMDATATYP")){                                                                                                                      //PCR022669++
					this.getMainCommModel(MCommTyp);
					//var commModelLength = sap.ui.getCore().getModel(MModel).getData().results.length;
					var commModelLength = MCommTyp !== this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT") ? sap.ui.getCore().getModel(MModel).getData().results.length : 
						       sap.ui.getCore().getModel(MModel).getData().oEsaManComm.results.length;
					commModelLength > 0 ? view.byId(MPanel).setExpanded(true) : view.byId(MPanel).setExpanded(false);
				}				
				//***************End Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
			},
			/**
			 * This method Handles Get Dialog for General Booking Docs.
			 * 
			 * @name _getDialog
			 * @param 
			 * @returns 
			 */
			_getDialog: function() {
				if (!this.dialog) {
					this.dialog = sap.ui.xmlfragment(this.getResourceBundle().getText("PSRCBCONAPPORREJCONFIRMATION"),
						this);
				}
				return this.dialog;
			},
			/**
			 * This method Handles Add Button Press Event.
			 * 
			 * @name createColumnListItem
			 * @param data - table Seleted Line
			 * @returns 
			 */
			createColumnListItem: function(data) {
				var objColumnListItem = new sap.m.ColumnListItem().data({
					objData: data.Guid
				});
				return objColumnListItem;
			},
			/**
			 * This method Used to get Valid Xsrf token.
			 * 
			 * @name getXsrfToken
			 * @param 
			 * @returns 
			 */
			getXsrfToken: function() {
				var sToken = this.oMyOppModel._oDataModel.getHeaders()['x-csrf-token'];
				if (!sToken) {
					this.oMyOppModel._oDataModel.refreshSecurityToken(function(e, o) {
						sToken = o.headers['x-csrf-token'];
					}, function() {}, false);
				}
				return sToken;
			},
			/**
			 * This method Used to Convert Xml To Json Format.
			 * 
			 * @name xmlToJson
			 * @param xml - Xml Response
			 * @returns 
			 */
			xmlToJson: function(xml) {
				var obj = {};
				if (xml.nodeType === 1) {
					if (xml.attributes.length > 0) {
						obj["@attributes"] = {};
						for (var j = 0; j < xml.attributes.length; j++) {
							var attribute = xml.attributes.item(j);
							obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
						}
					}
				} else if (xml.nodeType === 3) {
					obj = xml.nodeValue;
				}
				if (xml.hasChildNodes()) {
					for (var i = 0; i < xml.childNodes.length; i++) {
						var item = xml.childNodes.item(i);
						var nodeName = item.nodeName;
						if (typeof(obj[nodeName]) === that_S2.getResourceBundle().getText("S2ATTACHPSRCBCUNFNDTEXT")) {
							obj[nodeName] = this.xmlToJson(item);
						} else {
							if (typeof(obj[nodeName].push) === that_S2.getResourceBundle().getText("S2ATTACHPSRCBCUNFNDTEXT")) {
								var old = obj[nodeName];
								obj[nodeName] = [];
								obj[nodeName].push(old);
							}
							obj[nodeName].push(that_S2.xmlToJson(item));
						}
					}
				}
				return obj;
			},
			/**
			 * This method used Initialize Global controller variables.
			 * 
			 * @name _initiateControllerObjects
			 * @param 
			 * @returns 
			 */
			_initiateControllerObjects: function() {
				this.getOwnerComponent().s2 = that_S2.getView();
				that_general = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_GINFO).getContent()[0];
				this.getOwnerComponent().general = that_general;
				that_cbc = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).getContent()[0];
				this.getOwnerComponent().cbc = that_cbc;
				that_carm = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).getContent()[0];
				this.getOwnerComponent().carm = that_carm;
				that_attachment = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_ATTACH).getContent()[0];
				this.getOwnerComponent().attachment = that_attachment;
				that_psrsda = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).getContent()[0];
				this.getOwnerComponent().psrsda = that_psrsda;
				that_pdcsda = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).getContent()[0];
				this.getOwnerComponent().pdcsda = that_pdcsda;
				that_mli = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_MLINFO).getContent()[0];
				this.getOwnerComponent().mli = that_mli;
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				that_esa = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_ESA).getContent()[0];
				this.getOwnerComponent().esa = that_esa;
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				//***********Start Of PCR026551: Pre-Shipment  to SAP Fiori Q2C App**************
				that_psp = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSP).getContent()[0];
				this.getOwnerComponent().psp = that_psp;
				//***********End Of PCR026551: Pre-Shipment  to SAP Fiori Q2C App**************
			},
			/**
			 * This is Lifecycle method Calls After View have Rendered.
			 * 
			 * @name onAfterRendering
			 * @param 
			 * @returns 
			 */
			onAfterRendering: function() {
				sap.ui.core.BusyIndicator.hide();
				this._initiateControllerObjects();
				if (this.oArgs !== undefined) {
					switch (this.oArgs.Type) {
						case this.getResourceBundle().getText("S2ICONTABPSRTEXT"):
							this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).setSelectedKey(this.getResourceBundle().getText(
								"S2ICONTABPSRSDAKEY"));
						    that_psrsda.getController().getRefreshPSRData(this.oArgs.Guid, this.oArgs.ItemGuid);                                          //PCR022669++
							break;
						case this.getResourceBundle().getText("S2ICONTABCBCTXT"):
							this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).setSelectedKey(this.getResourceBundle().getText(
								"S2ICONTABCBCTXT"));
							that_S2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Default);
							that_cbc.getController().checkCBCInitiate();
							break;
						case this.getResourceBundle().getText("S2ICONTABPDCTEXT"):
							this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).setSelectedKey(this.getResourceBundle().getText(
								"S2ICONTABPDCSDAKEY"));
							that_pdcsda.getController().checkPDCInitiate();
							that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(that_S2.getResourceBundle()
								.getText("S2PSRSDACANBTNTXT"));
							that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(that_S2.getResourceBundle()
								.getText("S2PSRSDAATTCANICON"));
							that_pdcsda.getController().onEditPDCSDA();
							var SFAPRBtn = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn);
							(parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 655) ? (SFAPRBtn.setText(this.getResourceBundle()
								.getText("S2PSRSDASFSSDAINITTXT")), SFAPRBtn.setIcon(that_S2.getResourceBundle().getText(
								"S2PSRSDAWFICON")), SFAPRBtn.setEnabled(true), SFAPRBtn.setVisible(true)) : ("");
							break;
						case this.getResourceBundle().getText("S2ICONTABIWNPSRTEXT"):
							this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).setSelectedKey(this.getResourceBundle().getText(
								"S2ICONTABPSRSDAKEY"));
						    that_psrsda.getController().getRefreshPSRData(this.oArgs.Guid, this.oArgs.ItemGuid);                                          //PCR022669++
							break;
						case this.getResourceBundle().getText("S2ICONTABIWNPDCTEXT"):
							this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).setSelectedKey(this.getResourceBundle().getText(
								"S2ICONTABPDCSDAKEY"));
							that_pdcsda.getController().checkPDCInitiate();
							var SFAPRBtn = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn);
							(parseInt(that_pdcsdaCntrlr.PDCData.PsrStatus) === 655) ? (SFAPRBtn.setText(this.getResourceBundle()
								.getText("S2PSRSDASFSSDAINITTXT")), SFAPRBtn.setIcon(that_S2.getResourceBundle().getText(
								"S2PSRSDAWFICON")), SFAPRBtn.setEnabled(true), SFAPRBtn.setVisible(true)) : ("");
							break;
						case this.getResourceBundle().getText("S2ICONTABIWNCARMTEXT"):
							this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).setSelectedKey(this.getResourceBundle().getText(
								"S2ICONTABCARMKEY"));
							that_carm.getController().checkCarmInitiate();
							break;
						//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
						case this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT"):
							this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).setSelectedKey(this.getResourceBundle().getText(
								"S1ESAIDSPROSTYPTXT"));
							that_esa.getController().onLoadEsa(this.oArgs);
							break;
						//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
						//***********Start Of PCR026551: Pre-Shipment  to SAP Fiori Q2C App**************
						case this.getResourceBundle().getText("S2PSPIDSPROSTYPTXT"):
							this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).setSelectedKey(this.getResourceBundle().getText(
									"S2PSPIDSPROSTYPTXT"));							
							break;	
						//***********End Of PCR026551: Pre-Shipment  to SAP Fiori Q2C App**************
					}
					//this.setIconTabFilterColor();                                                                                                       //PCR022669--
					this.oArgs.Type !== undefined ? this.setIconTabFilterColor() : "";                                                                    //PCR022669++
				}
			},
			/** Keep
			 * This method Handles Approve Button Event.
			 * 
			 * @name onApprovePSRSDA
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onApprovePSRSDA: function(oEvent) {
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				//that_psrsda.getController().onApprovePSRSDA(oEvent);
				if(this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() !== this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT")){
				     that_psrsda.getController().onApprovePSRSDA(oEvent);
				}else {
					that_esa.getController().onESAApprove(oEvent);
				}
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
			},
			/** Keep
			 * This method Handles Message Pop-over Event.
			 * 
			 * @name handleMessagePopoverPress
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			handleMessagePopoverPress: function(oEvent) {
				var oIconTab = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB);
				var key = oIconTab.getSelectedKey();
				if (key === this.getResourceBundle().getText("S2PSRSDAICONTABFTEXT")) {
					that_psrsda.getController().oMessagePopover.openBy(oEvent.getSource());
				} else if (key === this.getResourceBundle().getText("S2PDCSDAICONTABFTEXT")) {
					that_pdcsda.getController().oMessagePopover.openBy(oEvent.getSource());
				} else if (key === this.getResourceBundle().getText("S2CBCTABTXT")) {
					that_cbc.getController().oMessagePopover.openBy(oEvent.getSource());
				}
			},
			/** Keep
			 * This method Handles Submit Button Press Event.
			 * 
			 * @name onSubmitCBCToNxtApr
			 * @param 
			 * @returns 
			 */
			onSubmitCBCToNxtApr: function() {
				that_cbc.getController().onSubmitCBCToNxtApr();
			},
			/** Keep
			 * This method Handles Recreate Button Press Event.
			 * 
			 * @name onResetProcess
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onResetProcess: function(oEvent) {
				var oIconTab = this.getView().byId(com.amat.crm.opportunity.Ids.ICON_TAB);
				that_pdcsda.getController().onResetProcess(oEvent);
			},
			//*************** Start Of PCR018375++ - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
			/** 
			 * This method Handles CBC Recreate Button Press Event.
			 * 
			 * @name onCBCResetProcess
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onCBCResetProcess:function(oEvent) {
				that_cbc.getController().onCBCResetProcess(oEvent);
			},
			//*************** End Of PCR018375++ - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
			//*************** Start Of PCR026551++ - 3509 - PSP (restart) Capability ****************//
			/** 
			 * This method Handles PSP Recreate Button Press Event.
			 * 
			 * @name onPspResetProcess
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onPspResetProcess:function(oEvent) {
				that_psp.getController().onPspResetProcess(oEvent);
			},
			//*************** End Of PCR026551++ - PSP (restart) Capability ****************//
			//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
			/** 
			 * This method Handles CBC Recreate Button Press Event.
			 * 
			 * @name onESACancelProcess
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onESACancelProcess: function(oEvent){
				that_esa.getController().onESACancelProcess(oEvent);
			},
			/** 
			 * This method Handles CBC Recreate Button Press Event.
			 * 
			 * @name onESAResetProcess
			 * @param oEvent - Event Handler
			 * @returns 
			 */
			onESAResetProcess: function(oEvent){
				that_esa.getController().onESAResetProcess(oEvent);
			},
			//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
			//*************** Start Of PCR034716++ Q2C ESA,PSR Enhancements ****************
			/**
			 * This method Handles PSR-RRA Reset Button Press Event.
			 * @name onPsrRraResetProcess
			 * @param oEvent - Event Handler
			 * @returns
			 */
			onPsrRraResetProcess: function(oEvent){
				that_psrsda.getController().onPsrRraResetProcess(oEvent);
			}
			//*************** End Of PCR034716++ Q2C ESA,PSR Enhancements ****************
		});
	});