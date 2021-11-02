/**
 * This class holds all methods of cbc page.
 *
 * @class
 * @public
 * @author Arun Jacob
 * @since 20 November 2019
 * @extends opportunity.controller.BaseController
 * @name opportunity.controller.psp
 *
 **********************************************************************************
 * Modifications.                                                                 *
 * ***************                                                                *
 * Ver.No    Date        Author    PCR No.           Description of change        *
 * ********************************************************************************
 * 20/11/2018     Arun            PCR026551          Pre-shipment development     *
 *                Jacob                                                           *
 * 20/04/2020     Arun            PCR028711         Q2C Enhancements for Q2-20    *
 *                Jacob                                                           *
 * 13/06/2021     Abhishek Pant   PCR035760         Tech Upgrade issues solution  *
***********************************************************************************
 */
 sap.ui.define(["com/amat/crm/opportunity/controller/BaseController",
		"com/amat/crm/opportunity/controller/CommonController"
], function(Controller,CommonController) {
	"use strict"; 
	var thisCntrlr, that_psrsda, that_attachment,
	that_views2, oCommonController;
	return Controller.extend("com.amat.crm.opportunity.controller.psp", {
		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */
		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 * 
		 * @memberOf view.psp
		 */
		onInit: function() {
			thisCntrlr = this;
			thisCntrlr.bundle = this.getResourceBundle();
			thisCntrlr.detActionType = "";
			this.oMyOppModel = new com.amat.crm.opportunity.model.models(this);
			thisCntrlr.that_views2 = this.getOwnerComponent().s2;
			oCommonController = new CommonController();	
			this.SelectedRecord = {
					"results": []
			};
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
		 * This method use to load PSP view.
		 * 
		 * @name onLoadPsp
		 * @param oEvent- Event Handlers
		 * @returns 
		 */
		onLoadPsp: function (oEvent) {
			this.getData();
			var oView = thisCntrlr.getView();	
			var oResource = this.getResourceBundle();                                                                                             //PCR028711++; include resource bundle
			var PspData = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMODEL")).getData();                                                 //PCR028711++; modify model Text,variable name, resource bundle method
			var oCBCAprTableItems = oView.byId(com.amat.crm.opportunity.Ids.S2PSP_CHG_HISTORY);
			var cModel2 = thisCntrlr.getJSONModel(PspData.NAV_PRESHP_CHNG_HIST);                                                                  //PCR028711++; modify variable name
			oCBCAprTableItems.setModel(cModel2);
			var oCBCCCpyTableItems = oView.byId(com.amat.crm.opportunity.Ids.S2PSP_CRBNCPY_TBL);
			var cModel3 = this.getJSONModel(PspData.NAV_PRESHP_CC);                                                                               //PCR028711++; modify variable name
			oCBCCCpyTableItems.setModel(cModel3);
			//var oResource = this.getResourceBundle();                                                                                           //PCR028711--;
			oView.byId(com.amat.crm.opportunity.Ids.S2PSP_RDBTN_GROUP).setSelectedIndex(-1);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSP_CRBNCPY_INPUT).setEnabled(true);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_CRBNCPYPNL).setExpanded(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSP_QN_PANEL).setExpanded(true);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_CNGHISPNL).setExpanded(false);
			var pspStatus = parseInt(PspData.Status);                                                                                             //PCR028711++; modify variable name
			(PspData.CcOppId !== "" && PspData.CcOpitmId !== "") ? (oView.byId(com.amat.crm.opportunity.Ids
					.S2PSP_PANL_LB_CC_TEXT).setText(oResource.getText("S2PSRSDACCFRMTXT") + " " +
							PspData.CcOppId + "_" + PspData.CcOpitmId)) : (oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_LB_CC_TEXT)
					.setText(""));                                                                                                                //PCR028711++; modify variable name, resource bundle method
			if(pspStatus == 5){
				var OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));                                       //PCR028711++; modify resource bundle method
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_GEN_PANL_FORM_DISPLAY).setModel(OppGenInfoModel);
				that_views2 === undefined ? that_views2 = this.getOwnerComponent().s2 : "";
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSP).setIconColor(sap.ui.core.IconColor.Critical);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setEnabled(false);
				if(PspData.CcOppId !== "" && PspData.CcOpitmId !== ""){                                                                           //PCR028711++; modify variable name
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setVisible(false);					
				}
				else{
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setEnabled(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setVisible(true);					
				}
				var pomUserList = thisCntrlr.getModelFromCore(oResource.getText("OppGenInfoModel")).getData().NAV_POM_INFO.results;               //PCR028711++; modify resource bundle method
				var pomInitiateFlag = this.checkContact(pomUserList);
				if (pomInitiateFlag === false) {
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(false);
				}
				else{
					(PspData.CcOppId !== "" && PspData.CcOpitmId !== "") ? that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(false):
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(true);                                      //PCR028711++; modify variable name
				}				
				this.setPspVisibility(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_DECISION_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_STATUS_TEXT).setText(oResource.getText("S2PSPNFOSFFTIT"));
				var qaList = PspData.NAV_PRESHP_QAHEAD.results;                                                                                    //PCR028711++; modify variable name
				var qaSubmitFlag = this.checkSubmission(qaList);
				if (qaSubmitFlag === false) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setVisible(false);
					var qaAnySubmitFlag = this.checkAnySubmission(qaList);
					if (qaAnySubmitFlag === false) {
					   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setVisible(false);
					   var pomUserList = thisCntrlr.getModelFromCore(oResource.getText("OppGenInfoModel")).getData().NAV_POM_INFO.results;         //PCR028711++; modify resource bundle method
					   var pomInitiateFlag = this.checkContact(pomUserList);
					   if (pomInitiateFlag === false) {
						   this.getQuesierData(false, false);
						   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_MAIN_COMMENT_TEXT).setEnabled(true);
						   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(false);
						   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setVisible(false);
						   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setEnabled(false);
					   }
					   else{
						   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_MAIN_COMMENT_TEXT).setEnabled(true);
						   if(PspData.CcOppId !== "" && PspData.CcOpitmId !== ""){                                                                  //PCR028711++; modify variable name
							   this.getQuesierData(false, false);
							   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(false);
							   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setVisible(false);
							   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setEnabled(false);
						   }
						   else{
							   this.getQuesierData(true, false);
							   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(true);
							   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setVisible(true);
							   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setEnabled(true);
						   }
					   }
					}
					else{
						   var pomUserList = thisCntrlr.getModelFromCore(oResource.getText("OppGenInfoModel")).getData().NAV_POM_INFO.results;       //PCR028711++; modify resource bundle method
						   var pomInitiateFlag = this.checkContact(pomUserList);
						   if (pomInitiateFlag === false) {
							   this.getQuesierData(false, false);
							   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_MAIN_COMMENT_TEXT).setEnabled(true);
							   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(false);
							   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setVisible(false);
							   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setEnabled(false);
							   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setVisible(false);
							   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setEnabled(false);
						   }
						   else{
							   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_MAIN_COMMENT_TEXT).setEnabled(true);
							   if(PspData.CcOppId !== "" && PspData.CcOpitmId !== ""){                                                                //PCR028711++; modify variable name
								   this.getQuesierData(false, false);
								   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(false);
								   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setVisible(false);
								   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setEnabled(false);
								   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setVisible(false);
								   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setEnabled(false);
							   }
							   else{
								   this.getQuesierData(true, false);
								   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(false);
								   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setVisible(true);
								   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setEnabled(true);
								   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setVisible(true);
								   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setEnabled(false);
							   }
						   }
						}
				}
				else{
					this.getQuesierData(false, false);
					var pomUserList = thisCntrlr.getModelFromCore(oResource.getText("OppGenInfoModel")).getData().NAV_POM_INFO.results;              //PCR028711++; modify resource bundle method
					var pomInitiateFlag = this.checkContact(pomUserList);
					if (pomInitiateFlag === false) {
					   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setVisible(false);
					   oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setEnabled(false);
					}
					else{
						if(PspData.CcOppId !== "" && PspData.CcOpitmId !== ""){                                                                      //PCR028711++; modify variable name
							oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setVisible(false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setEnabled(false);
						}else{
							oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setVisible(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setEnabled(true);
						}
					}
				}
			}
			else if(pspStatus == 10){
				var pomUserList = thisCntrlr.getModelFromCore(oResource.getText("OppGenInfoModel")).getData().NAV_POM_INFO.results;                  //PCR028711++; modify resource bundle method
				var pomInitiateFlag = this.checkContact(pomUserList);
				if (pomInitiateFlag === false) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(false);
				}
				else{
					(PspData.CcOppId !== "" && PspData.CcOpitmId !== "") ? oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(false):
						oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(true);                                                  //PCR028711++; modify variable name
				}
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_DECISION_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_MAIN_COMMENT_PANEL).setExpanded(true);
				that_views2 === undefined ? that_views2 = this.getOwnerComponent().s2 : "";
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_CRBNCPYPNL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_QN_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_CNGHISPNL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_MAIN_COMMENT_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_TAB_GEN_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_STATUS_TEXT).setText(oResource.getText("S2PCBCNTREQSTATTXT"));
			}
			else if(pspStatus == 20){
				var OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));                                           //PCR028711++; modify resource bundle method
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_GEN_PANL_FORM_DISPLAY).setModel(OppGenInfoModel);
				this.getData();
				this.getQuesierData(false, false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setVisible(false);			
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setVisible(false);
				this.setPspVisibility(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_DECISION_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(false);
				that_views2 === undefined ? that_views2 = this.getOwnerComponent().s2 : "";
				var pomUserList = thisCntrlr.getModelFromCore(oResource.getText("OppGenInfoModel")).getData().NAV_POM_INFO.results;                   //PCR028711++; modify resource bundle method
				var pomInitiateFlag = this.checkContact(pomUserList);
				if (pomInitiateFlag === false) {
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(false);
				}
				else{
					(PspData.CcOppId !== "" && PspData.CcOpitmId !== "") ? that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(false):
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(true);                                          //PCR028711++; modify variable name			
				}					
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_STATUS_TEXT).setText(oResource.getText("S2PSPFINAL"));
			}
			else{
				this.setPspVisibility(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSP_DECISION_BOX).setVisible(true);
				that_views2 === undefined ? that_views2 = this.getOwnerComponent().s2 : "";
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(false);
			}			
		},
		/**
		 * This method Handles Edit Button Event.
		 * 
		 * @name onEditPsp
		 * @param 
		 * @returns 
		 */
		onEditPsp: function() {
			var bEdit = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).getEnabled(),
		        bSave = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).getEnabled(),
		        oResource = thisCntrlr.getResourceBundle();                                                                                           //PCR028711++; include resource bundle method
			if(bEdit){
				var pomUserList = thisCntrlr.getModelFromCore(oResource.getText("OppGenInfoModel")).getData().NAV_POM_INFO.results                    //PCR028711++; modify resource bundle method
				var pomInitiateFlag = this.checkContact(pomUserList);
				if (pomInitiateFlag === false) {
				   this.getQuesierData(false, false);
				   thisCntrlr.showToastMessage(oResource.getText("S2USERPOMAUTHFALTTXT"));                                                            //PCR028711++; modify resource bundle method
				   this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setEnabled(false);
				}
				else{
				   this.getQuesierData(true, false);
				   if(!bSave){
						this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setEnabled(true);
					}
				}	
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setEnabled(false);				
			}
		},
		/**
		 * This method Handles Edit Button Event.
		 * 
		 * @name onCancelPsp
		 * @param 
		 * @returns 
		 */
		onCancelPsp: function() {
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_DECISION_BOX).setVisible(true);
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_RDBTN_GROUP).setSelectedIndex(-1);
			this.setPspVisibility(false);
			var oResource = this.getResourceBundle();
			var Message = Message !== "" ? oResource.getText("S2PSRSSDACBCVALIDSAVEMSG") :""; 
			this.onPspPayload(Message, oResource.getText("S2ESAIDSPROSSCANCLKYE"));                                                                    //PCR028711++; modify with resource bundle text
			that_views2 === undefined ? that_views2 = this.getOwnerComponent().s2 : "";
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSP).setIconColor(sap.ui.core.IconColor.Default);
		},		
		/**
		 * This method Used to Convert Data to Tree Model Data.
		 * 
		 * @name getQuesierData
		 * @param SEditable- Sales Editable Value, BEditable- BMO Editable Value
		 * @returns 
		 */
		getQuesierData: function(SEditable, BEditable) {	
			var oResource = thisCntrlr.getResourceBundle();                                                                                           //PCR028711++; include resource bundle
			var PspQusData = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMODEL")).getData().NAV_PRESHP_QAHEAD.results;                        //PCR028711++; modify model Text, resource bundle method, variable name
			var HeaderCount = 0,
				ItemCount = 0;
			var oData = {
					"root": {}
			};
			oData.root.Node_Type = oResource.getText("S2CBCQUSTABROOTTXT");                                                                           //PCR028711++; modify resource bundle method
			oData.root.Status = oResource.getText("S2CBCQUSTABROOTDISTXT");                                                                           //PCR028711++; modify resource bundle method
			oData.root.checked = "false";
			oData.root.visible = false;
			oData.root.SalEditable = false;
			oData.root.BMOEditable = false;
			for (var i = 0, n = 0; i < PspQusData.length; i++) {                                                                                      //PCR028711++; modify variable name
				var itemData = [];
				var obj = {};
				var nil = {};
				HeaderCount = HeaderCount + 1;
				nil.Node_Type = PspQusData[i].SectionTyp + ": " + PspQusData[i].SelDesc;                                                              //PCR028711++; modify variable name
				nil.Status = "";
				nil.SalVisible = false;
				nil.BmoVisible = false;
				nil.ComVisible = false;
				nil.SalEditable = true;
				nil.BmoEditable = false;
				//*************** Start Of PCR028711: Q2C Enhancements for Q2-20 **************
				nil.HeadVisible = true;
				nil.QuesClass = oResource.getText("S2PSRSDAQUESTITLECLS");
				for (var j = 0; j < PspQusData[i].NAV_CBC_QAINFO.results.length; j++) {
				//*************** End Of PCR028711: Q2C Enhancements for Q2-20 ****************
					ItemCount = ItemCount + 1;
					nil[j] = {};
					nil[j].Node_Type = PspQusData[i].NAV_CBC_QAINFO.results[j].Qdesc;                                                                 //PCR028711++; modify variable name
					nil[j].Status = "";
					nil[j].SalVisible = true;
					nil[j].QuesClass = oResource.getText("S2PSRSDAQUESITEMCLS");                                                                      //PCR028711++; modify resource bundle method		
					nil[j].ComVisible = true;
					(PspQusData[i].NAV_CBC_QAINFO.results[j].AnsValue === oResource.getText(
						"S2POSMANDATANS")) ? (nil[j].SelectionIndex = 1, nil[j].ValueState = oResource.getText(
						"S2DELNAGVIZTEXT")) : ((PspQusData[i].NAV_CBC_QAINFO.results[j].AnsValue === oResource
						.getText("S2NEGMANDATANS")) ? (nil[j].SelectionIndex = 2, nil[j].ValueState = oResource
						.getText("S2DELNAGVIZTEXT")) : (nil[j].SelectionIndex = 0, nil[j].ValueState = oResource
						.getText("S2ERRORVALSATETEXT")));                                                                                             //PCR028711++; modify resource bundle method, variable name	
					nil[j].ComValue = PspQusData[i].NAV_CBC_QAINFO.results[j].Comments;                                                               //PCR028711++; modify variable name
					nil[j].SalEditable = SEditable;
					nil[j].BmoEditable = BEditable;					
					nil[j].QuesClass = oResource.getText("S2PSRSDAQUESITEMCLS");                                                                      //PCR028711++; modify resource bundle method	
				}
				oData.root[i] = nil;
			}
			oData.root.headerCount = HeaderCount;
			oData.root.itemCount = ItemCount;
			var oTable = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_QN_TABLE);
			oTable.setVisibleRowCount(HeaderCount + ItemCount);
			var oModel = this.getJSONModel(oData);
			oTable.setModel(oModel);
			oTable.bindRows(oResource.getText("S2CBCQUSTABROOTPATH"));                                                                                //PCR028711++; modify resource bundle method
			oTable.expandToLevel(1);
		},
		/**
		 * This method Used to Get Data from OData.
		 * 
		 * @name getData
		 * @returns 
		 */
		getData: function() {
			//*************** Start Of PCR028711: Q2C Enhancements for Q2-20 **************
			var configConsts = com.amat.crm.opportunity.util.ServiceConfigConstants,
			    oResource = thisCntrlr.getResourceBundle(),
			    OppGenInfoModel = this.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));
			//*************** End Of PCR028711: Q2C Enhancements for Q2-20 ****************
			var Guid = OppGenInfoModel.getData().Guid;
			var ItemGuid = OppGenInfoModel.getData().ItemGuid;
			var sValidate = configConsts.PreshipSetGuid + Guid + configConsts.PreshipSetItem + ItemGuid + configConsts.PreshipSetExp;                 //PCR028711++; replace URL with configuration parameters
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");	
			//var PspData = thisCntrlr.getModelFromCore(oResource.getText(oResource.getText("S2PSPMODEL"))).getData();                                //PCR028711++; modify model Text, resource bundle method, variable name; PCR035760--
			var PspData = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMODEL")).getData();                                                     //PCR035760++;
		    this.PSPCCData = PspData.NAV_PRESHP_CC;                                                                                                   //PCR028711++; modify variable name
		},
		/**
		 * This method Handles Save Button Event.
		 * 
		 * @name onSavePsp
		 * @param oEvt- Event Handlers , Message - Custom Message on Save button press event
		 * @returns
		 */
		onSavePsp: function(oEvt, Message) {
			var bEdit = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).getEnabled(),
		    bSave = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).getEnabled();
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(false);
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_RDBTN_GROUP).setSelectedIndex(-1);
			if(bSave){	
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setEnabled(false);
				if(!bEdit){
					this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setEnabled(true);
				}
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setVisible(true);
			}
			var myBusyDialog = thisCntrlr.getBusyDialog();
			var oResource = this.getResourceBundle();
			myBusyDialog.open();			
			Message = Message !== "" ? oResource.getText("S2PSRSSDACBCVALIDSAVEMSG") :"";
			this.detActionType = "";
			this.onPspPayload(Message, oResource.getText("S2PSRDCNASHPODKEY"));                                                                         //PCR028711++; modify text with resource bundle text
			this.getData();
			var oView = thisCntrlr.getView();
			var PspData = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMODEL")).getData();                                                       //PCR028711++; modify model Text, resource bundle method
			var oCBCAprTableItems = oView.byId(com.amat.crm.opportunity.Ids.S2PSP_CHG_HISTORY);
			var cModel2 = thisCntrlr.getJSONModel(PspData.NAV_PRESHP_CHNG_HIST);                                                                        //PCR028711++; modify variable name
			oCBCAprTableItems.setModel(cModel2);
			this.getQuesierData(false, false);
			myBusyDialog.close();
		},
		/**
		 * This method Handles Save Button Event.
		 * 
		 * @name onPspPayload
		 * @param Message- Submit for Approval Button Text, ActionType - Save Or Submit
		 * @returns obj- Paylod Object
		 */
		onPspPayload: function(Message, ActionType) {
			var oResource = thisCntrlr.getResourceBundle();                                                                                              //PCR028711++; include resource bundle
			var OppGenInfoModel = this.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));                                                        //PCR028711++; modify resource bundle method
			var Guid = OppGenInfoModel.getData().Guid;
			var ItemGuid = OppGenInfoModel.getData().ItemGuid;
			var PspData = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMODEL")).getData();                                                        //PCR028711++; modify model Text,variable name,resource bundle method
			var obj = {};
			obj.NAV_PRESHP_CC = [];
			obj.NAV_PRESHP_QA = [];
			obj.Guid = Guid;
			obj.ItemGuid = ItemGuid;
			obj.StatDesc = "";
			obj.Status="";
			obj.ActionType = ActionType;
			obj.CcOppId = thisCntrlr.getModelFromCore("OppPSRInfoModel").getData().OppId;
			obj.CcOpitmId = thisCntrlr.getModelFromCore("OppPSRInfoModel").getData().ItemNo;
			if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_CRBNCPY_TBL).getModel() !== undefined) {
					var CBCCcTabData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_CRBNCPY_TBL).getModel().getData()
						.results;
					if (CBCCcTabData.length > 0) {
						for (var i = 0; i < CBCCcTabData.length; i++) {
							var data = {};
							data.Guid = CBCCcTabData[i].Guid;
							data.ItemGuid = CBCCcTabData[i].ItemGuid;
							data.OppId = CBCCcTabData[i].OppId;
							data.ItemNo = CBCCcTabData[i].ItemNo;
							obj.NAV_PRESHP_CC.push(data);
						}
					}
				}
			//*************** Start Of PCR028711: Q2C Enhancements for Q2-20 **************
			for (var i = 0; i < PspData.NAV_PRESHP_QAHEAD.results.length; i++) {
				for (var j = 0; j < PspData.NAV_PRESHP_QAHEAD.results[i].NAV_CBC_QAINFO.results.length; j++) {
					var qus = {};
					qus.AnsFlag = PspData.NAV_PRESHP_QAHEAD.results[i].NAV_CBC_QAINFO.results[j].AnsFlag;
					qus.AnsValue = PspData.NAV_PRESHP_QAHEAD.results[i].NAV_CBC_QAINFO.results[j].AnsValue;
					qus.Comments = PspData.NAV_PRESHP_QAHEAD.results[i].NAV_CBC_QAINFO.results[j].Comments;
					qus.Guid = PspData.NAV_PRESHP_QAHEAD.results[i].NAV_CBC_QAINFO.results[j].Guid;
					qus.ItemGuid = PspData.NAV_PRESHP_QAHEAD.results[i].NAV_CBC_QAINFO.results[j].ItemGuid;
					qus.ItemNo = PspData.NAV_PRESHP_QAHEAD.results[i].NAV_CBC_QAINFO.results[j].ItemNo;
					qus.OppId = PspData.NAV_PRESHP_QAHEAD.results[i].NAV_CBC_QAINFO.results[j].OppId;
					qus.Qdesc = PspData.NAV_PRESHP_QAHEAD.results[i].NAV_CBC_QAINFO.results[j].Qdesc;
					qus.Qid = PspData.NAV_PRESHP_QAHEAD.results[i].NAV_CBC_QAINFO.results[j].Qid;
					qus.SectionTyp = PspData.NAV_PRESHP_QAHEAD.results[i].NAV_CBC_QAINFO.results[j].SectionTyp;
					qus.Version = PspData.NAV_PRESHP_QAHEAD.results[i].NAV_CBC_QAINFO.results[j].Version;
					//*************** End Of PCR028711: Q2C Enhancements for Q2-20 ****************
					obj.NAV_PRESHP_QA.push(qus);
				}
			}
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PreshipSet, com.amat.crm.opportunity
				.util.ServiceConfigConstants.write, obj, Message);                                                                                          //PCR028711++; replace entity set name with configuration parameter
		},
		/**
		 * This method Handles PSP Questions Comment Text On Live Change Event.
		 * 
		 * @name onPspTxtAreaLivChg
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onPspTxtAreaLivChg: function(oEvent) {
			//*************** Start Of PCR028711: Q2C Enhancements for Q2-20 **************
			var oResource = thisCntrlr.getResourceBundle();
			var PspData = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMODEL")).getData();
			var QuestionHead = oEvent.getSource().getBindingContext().sPath.split(oResource.getText("S2CBCPSRCARMSEPRATOR"))[2];
			var QuestionItem = oEvent.getSource().getBindingContext().sPath.split(oResource.getText("S2CBCPSRCARMSEPRATOR"))[3];
			PspData.NAV_PRESHP_QAHEAD.results[QuestionHead].NAV_CBC_QAINFO.results[QuestionItem].Comments = oEvent.getParameters().value;
			//*************** End Of PCR028711: Q2C Enhancements for Q2-20 ****************
		},
		/**
		 * This method Handles Psp Questions Answer Event.
		 * 
		 * @name onPressPspQues
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onPressPspQues: function(oEvent) {
			var AnsValue;
			//*************** Start Of PCR028711: Q2C Enhancements for Q2-20 **************
			var oResource = thisCntrlr.getResourceBundle(),
			    PspData = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMODEL")).getData(),
			    QuestionHead = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
				      "S2CBCPSRCARMSEPRATOR"))[2],
				QuestionItem = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
				       "S2CBCPSRCARMSEPRATOR"))[3];
			PspData.NAV_PRESHP_QAHEAD.results[QuestionHead].NAV_CBC_QAINFO.results[QuestionItem].AnsValue;
			(oEvent.getParameters().selectedIndex === 1) ? (AnsValue = oResource.getText(
				"S2POSMANDATANS")) : ((oEvent.getParameters().selectedIndex === 2) ? (AnsValue = oResource
				.getText("S2NEGMANDATANS")) : (AnsValue = ""));
			PspData.NAV_PRESHP_QAHEAD.results[QuestionHead].NAV_CBC_QAINFO.results[QuestionItem].AnsValue = AnsValue;
			var qaList = PspData.NAV_PRESHP_QAHEAD.results;
			//*************** End Of PCR028711: Q2C Enhancements for Q2-20 ****************
			var qaSubmitFlag = this.checkSubmission(qaList);
			if (qaSubmitFlag === false) {
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setVisible(false);
			}
			else{
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setVisible(true);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setEnabled(true);
			}
		},
		/**
		 * This method is used to handles Main Comment Text Area Live Change Event.
		 * 
		 * @name OnMainCommLvchng
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		OnMainCommLvchng: function(oEvent) {
			var SaveBtn = "";
			//*************** Start Of PCR028711: Q2C Enhancements for Q2-20 **************
			var oResource = thisCntrlr.getResourceBundle();	
			(oEvent.getParameters().id.split(oResource.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
					.id.split(oResource.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2PSP_BTN_MAINCOMM_SAVE) ?
					(SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_MAINCOMM_SAVE)) : ((oEvent.getParameters().id.split(oResource
					.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResource.getText(
					"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2PSP_BTN_MAINCOMM_SAVE) ?
				(SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_MAINCOMM_SAVE)) : (
					SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_MAINCOMM_SAVE))
			);
			//*************** End Of PCR028711: Q2C Enhancements for Q2-20 ****************
			if (oEvent.getParameters().value.length > 0 && oEvent.getParameters().value.length < 255) {
				SaveBtn.setEnabled(true);
			} else if (oEvent.getParameters().value.length === 255) {
				SaveBtn.setEnabled(false);
				thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCMCOMMVALTXT"));                                                                    //PCR028711++; modify resource bundle method
			} else {
				SaveBtn.setEnabled(false);
			}
		},
		/**
		 * This method is used to handles Save Comment Event.
		 * 
		 * @name onSaveMainCom
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onSaveMainCom: function(oEvent) {
			var oResource = thisCntrlr.getResourceBundle();                                                                                                  //PCR028711++; include resource bundle method
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var MCommType = "",
				MType = "",
				MComModel = "",
				oTable = "",
				SaveBtn = "",
				MTxtAra = "";			
			oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_TAB_MAINCOMMENT);
			MCommType = oResource.getText("S2PSPTABTXT");                                                                                                    //PCR028711++; modify resource bundle method
			MType = oResource.getText("S2PSPTABTXT");                                                                                                        //PCR028711++; modify resource bundle method
			SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_MAINCOMM_SAVE);
			MTxtAra = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_MAIN_COMM_TEXT);
			var obj = this.MainComPayload(oEvent.getSource().getParent().getFields()[0].getValue(), MType);
			//*************** Start Of PCR028711: Q2C Enhancements for Q2-20 **************
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CommentsSet, com.amat.crm.opportunity
				.util.ServiceConfigConstants.write, obj, oResource.getText("S2PSRCBCMCOMMSAVSUCSSTXT"));
			var ItemGuid = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData()
				.ItemGuid;
			var sValidate = com.amat.crm.opportunity.util.ServiceConfigConstants.CommentSetPspFilterGuid + ItemGuid +
			    com.amat.crm.opportunity.util.ServiceConfigConstants.CommentSetPspFilterType + MCommType + "'";
			//*************** End Of PCR028711: Q2C Enhancements for Q2-20 ****************
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");			
			MComModel = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMCOMMODEL"));                                                                      //PCR028711++; include resource bundle method
			oTable.setModel(MComModel);
			MTxtAra.setValue("");
			SaveBtn.setEnabled(false);
			myBusyDialog.close();
		},
		/**
		 * This method is used to handles Main Comment Payload.
		 * 
		 * @name MainComPayload
		 * @param Comment - Main Comment, CommType - Main Comment Process Type
		 * @returns
		 */
		MainComPayload: function(Comment, CommType) {
			var oResource = thisCntrlr.getResourceBundle();                                                                                                    //PCR028711++; include resource bundle method
			var obj = {};
			obj.ItemGuid = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;                                            //PCR028711++; include resource bundle method
			obj.CommentId = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;                                           //PCR028711++; include resource bundle method
			obj.CommType = CommType;
			obj.Comment = Comment;
			obj.CreatedName = "";
			obj.CreatedDate = "";
			return obj;
		},
		/**
		 * This Method is use For Reset Process Button Press Event. 
		 * 
		 * @name onPspResetProcess
		 * @param oEvent - Event Handlers
		 * @returns 
		 */
		onPspResetProcess: function(oEvent) {
			this._initiateControllerObjects(thisCntrlr);
			var ServiceConfig = com.amat.crm.opportunity.util.ServiceConfigConstants,
			    sValidate = ServiceConfig.ResetPspChildSetOppId + that_views2.getController().OppId + ServiceConfig.ResetPspChildItemNo +
			           that_views2.getController().ItemNo + ServiceConfig.ResetPspChildType;                                                                    //PCR028711++; replace URL properties with configuration parameters
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var ResetData = thisCntrlr.getModelFromCore("ResetChildListModel").getData().results;
			thisCntrlr.ResetType = ResetData.length > 0 ? thisCntrlr.bundle.getText("S2RECRATEDEPTYPTEXT") : thisCntrlr.bundle.getText(
				"S2RECRATEINDEPTYPTEXT");
			var ProcessType = thisCntrlr.bundle.getText("S2PSPTABTXT");                                                                                         //PCR028711++; modify text with resource bundle text
			var PspData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("S2PSPMODEL")).getData();                                                //PCR028711++; modify model Text, variable name
			this.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRPDCONRESETConfirmation"), this);
			if (thisCntrlr.ResetType === thisCntrlr.bundle.getText("S2RECRATEDEPTYPTEXT"))
				{
				  (ResetData.length > 0)?(this.dialog.getContent()[1].setVisible(true)):(this.dialog.getContent()[1].setVisible(false));
				  for(var i = 0; i < ResetData.length; i++){                                                                                                     //PCR035760++
					  ResetData[i].Selectflag = ResetData[i].Selectflag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? true : false;                           //PCR035760++
				  }                                                                                                                                              //PCR035760++
				  this.dialog.getContent()[1].setModel(this.getJSONModel({
					 "ItemSet": ResetData
				}));
			}
			this.getCurrentView().addDependent(this.dialog);
			this.dialog.getCustomHeader().getContentMiddle()[1].setText(thisCntrlr.bundle.getText("S2CBCREQIREDVALIDATIONTXT"));
			this.dialog.open();
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
		 * This Method is use For Reset OK Button Press Event.
		 *  
		 * @name resetConfirmationOK
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
	    resetConfirmationOK: function(oEvent) {
	       var oResource = thisCntrlr.getResourceBundle();                                                                                                          //PCR028711++; include resource bundle
		   var recreateMsg = this.dialog.getContent()[0].getContent()[1].getValue();
		   if(!recreateMsg){
			   thisCntrlr.showToastMessage(oResource.getText("S2PSPRSRCONFIRMOK"));                                                                                 //PCR028711++; modify resource bundle method
		   }
	       else{
	       var ResetData = "",
				SuccessMsg = "";
		    //var oResource = thisCntrlr.bundle;                                                                                                                    //PCR028711--;
			if (thisCntrlr.ResetType === oResource.getText("S2RECRATEDEPTYPTEXT")) {
				ResetData = this.dialog.getContent()[1].getModel() !== undefined ? this.dialog.getContent()[1].getModel().getData() : "";
			}
			this.dialog.close();
			this.dialog.destroy();
			var payload = {};
			var GenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();                                                      //PCR028711++; modify resource bundle method
			sap.ui.core.BusyIndicator.show();
			if (thisCntrlr.ResetType === oResource.getText("S2RECRATEINDEPTYPTEXT")){
				payload.Guid = GenInfoModel.Guid;
				payload.ItemGuid = GenInfoModel.ItemGuid;
				payload.Ptype = "";                                                                                                                                 //PCR028711++; replace ' with "
				payload.step = oResource.getText("S2PSPTABTXT");
				payload.Comments = recreateMsg;
				SuccessMsg = oResource.getText("S2PSPTABTXT") + " " + oResource.getText("S2RECRATEPOSMSG");
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ResetSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, payload, SuccessMsg);
			} else {
				payload.Guid = GenInfoModel.Guid;
				payload.ItemGuid = GenInfoModel.ItemGuid;
				payload.OppId = that_views2.getController().OppId;
				payload.ItemNo = that_views2.getController().ItemNo;
				payload.Ptype = oResource.getText("S2PSPTABTXT");
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
						obj.Ptype = oResource.getText("S2PSPTABTXT");
						obj.Selectflag = ResetData.ItemSet[k].Selectflag === false ? "" : oResource.getText("S2ODATAPOSVAL");
						payload.nav_reset_child.push(obj);
					}
				}
				SuccessMsg = oResource.getText("S2PSPTABTXT") + " " + oResource.getText("S2RECRATEPOSMSG");
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ResetChildListSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, payload, SuccessMsg);
			}
			sap.ui.core.BusyIndicator.hide();
			this._initiateControllerObjects(thisCntrlr);			
			that_views2 === undefined ? that_views2 = this.getOwnerComponent().s2 : "";
			that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSP).setIconColor(sap.ui.core.IconColor.Default);
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_DECISION_BOX).setVisible(true);
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_RDBTN_GROUP).setSelectedIndex(-1);
			this.setPspVisibility(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(false);
		 }
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

			if (that_psrsda === undefined) {
				that_psrsda = this.getOwnerComponent().psrsda;
			}
			if (that_attachment === undefined) {
				that_attachment = this.getOwnerComponent().attachment;
			}
		},
		/**
		 * This method is used to handles PSP Carbon Copy F4 Help.
		 * 
		 * @name handleValueHelpPspCbnCpyRew
		 * @param
		 * @returns
		 */
		handleValueHelpPspCbnCpyRew: function() {
			//*************** Start Of PCR028711: Q2C Enhancements for Q2-20 **************
			var oResource = thisCntrlr.getResourceBundle();
			var ItemGuid = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
			this.CbnType = oResource.getText("S2ICONTABCBCTXT");
			var sGenaralChoos = com.amat.crm.opportunity.util.ServiceConfigConstants.CustDocLinkPspSetGuid + ItemGuid + "'"
				+ com.amat.crm.opportunity.util.ServiceConfigConstants.CustDocLinkPspSetItem;													  									
			//*************** End Of PCR028711: Q2C Enhancements for Q2-20 ****************
			this.serviceCall(sGenaralChoos, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var CCTableData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_CRBNCPY_TBL).getModel().getData().results;
			var CBCCData = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMCOMMODEL")).getData();                                                              //PCR028711++; include resource bundle method
			for (var i = 0; i < CBCCData.results.length; i++) {
				for (var j = 0; j < CCTableData.length; j++) {
					if (CBCCData.results[i].OppId === CCTableData[j].OppId && CBCCData.results[i].ItemNo ===
						CCTableData[j].ItemNo) {
						CBCCData.results[i].Selected = true;
					}
				}
				CBCCData.results[i].Selected === undefined ? CBCCData.results[i].Selected = false : "";
			}
			this.dialog = sap.ui.xmlfragment(oResource.getText("PSRCBCCCF4helpOppLink"), this);                                                                     //PCR028711++; modify resource bundle method
			this.dialog.getContent()[2].getColumns().map(function(item){item.setVisible(true);});
			this.dialog.getSubHeader().setVisible(true);
			this.getCurrentView().addDependent(this.dialog);
			var oCBCCbnCpyModel = this.getJSONModel(thisCntrlr.getModelFromCore(oResource.getText("S2PSPMCOMMODEL")).getData());                                    //PCR028711++; modify resource bundle method
			this.dialog.setModel(oCBCCbnCpyModel);
			this.dialog.open();
		},
		/**
		 * This method is used to handles OK button event.
		 * 
		 * @name onRelPerSpecRewOkPress
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onRelPerSpecRewOkPress: function(oEvent) {
			this._initiateControllerObjects();
			var oResource = thisCntrlr.getResourceBundle();                                                                                                         //PCR028711++; include resource bundle
			if (oEvent.getSource().getParent().getContent()[2].getColumns()[0].getVisible() === false) {
				var items = oEvent.getSource().getParent().getContent()[0].mAggregations.items;
				if (items.length === 0) {
					thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCPREOUSOPPMSG"));                                                                      //PCR028711++; modify resource bundle method
				} else {
					var OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));                                                     //PCR028711++; modify resource bundle method
					var oEntry = {
						Guid: OppGenInfoModel.getData().Guid,
						ItemGuid: OppGenInfoModel.getData().ItemGuid,
						OppId: thisCntrlr.OppId,
						ItemNo: thisCntrlr.ItemNo,
						Repflag: oResource.getText("S2ODATAPOSVAL"),                                                                                                //PCR028711++; modify resource bundle method
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
						.util.ServiceConfigConstants.write, oEntry, oResource.getText("S2PSRSDASUCSSLINK"));                                                        //PCR028711++; modify resource bundle method
					this.closeDialog();
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(true);
					this.refreshRelPerSpecRewData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).getModel().getData()
						.length === 0 ? that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX).setVisible(
							true) : thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX).setVisible(
							false);
				}
			} else if (this.CbnType === oResource.getText("S2ICONTABCBCTXT")) {                                                                                     //PCR028711++; modify resource bundle method
				var oTable1 = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_CRBNCPY_TBL);
				var FinalRecord = {
					"results": []
				};
				//*************** Start Of PCR028711: Q2C Enhancements for Q2-20 **************
				var PspData = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMCOMMODEL")).getData().results;
				for (var i = 0, n = 0; i < PspData.length; i++) {
					if (PspData[i].Selected === true) {
						FinalRecord.results[n] = PspData[i];
				//*************** End Of PCR028711: Q2C Enhancements for Q2-20 ****************
						n++;
					}
				}
				this._initiateControllerObjects();
				FinalRecord.results = FinalRecord.results.concat(this.PSPCCData.results);
				this.closeDialog();
				var cModel = this.getJSONModel(FinalRecord);
				oTable1.setModel(cModel);
				this.SelectedRecord.results.length = 0;
				this.UnselectedRecord.results.length = 0;
			}
			this.setPspVisibility(true);
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
		 * This method is used to handles CC check Box selection event.
		 * 
		 * @name onSelectCB
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onSelectCB: function(oEvent) {
			var oResource = thisCntrlr.getResourceBundle();                                                                                                         //PCR028711++; include resource bundle
			var SelectedDes = oEvent.getParameters().selected;
			var Selectedline = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
				"S2CBCPSRCARMSEPRATOR"))[oEvent.getSource().getBindingContext().sPath.split(oResource
				.getText("S2CBCPSRCARMSEPRATOR")).length - 1];                                                                                                      //PCR028711++; modify resource bundle method
			this.UnselectedRecord = {
				"results": []
			};

			var oCBCCbnCpyModel = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMCOMMODEL"));                                                                 //PCR028711++; modify resource bundle method
			for (var i = 0; i < oCBCCbnCpyModel.getData().results.length; i++) {
				if (i === parseInt(Selectedline)) {
					if (SelectedDes === true) {
						this.SelectedRecord.results.push(oCBCCbnCpyModel.getData().results[i]);
					} else {
						this.UnselectedRecord.results.push(oCBCCbnCpyModel.getData().results[i]);
					}
				}
			}

		},
		/**
		 * This method Handles PSP Standard Radio Button Event.
		 * 
		 * @name onPressInitiateStdPsp
		 * @param evt - Event Handler
		 * @returns 
		 */
		onPressInitiateStdPsp: function(evt) {
			var oResource = thisCntrlr.getResourceBundle();                                                                                                        //PCR028711++; include resource bundle
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var pomUserList = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().NAV_POM_INFO.results;                                    //PCR028711++; modify resource bundle method; PCR035760++; OppGenInfoModel to GLBOPPGENINFOMODEL
			var oView = thisCntrlr.getView();
			oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(true);
			var pomInitiateFlag = this.checkContact(pomUserList);
			if (pomInitiateFlag === false) {
				sap.ui.core.BusyIndicator.hide();
				thisCntrlr.showToastMessage(oResource.getText("S2USERPOMAUTHFALTTXT"));                                                                            //PCR028711++; modify resource bundle method
			} else {
				this.getData();
				that_views2 === undefined ? that_views2 = this.getOwnerComponent().s2 : "";
				this.setPspVisibility(true);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_DECISION_BOX).setVisible(false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setVisible(false);
				//var oResource = this.getResourceBundle();                                                                                                        //PCR028711--;
				var Message = Message !== "" ? oResource.getText("S2PSRSSDACBCVALIDSAVEMSG") :"";
				if(evt.mParameters.selectedIndex === 1){
					var OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));                                                    //PCR028711++; modify resource bundle method
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_GEN_PANL_FORM_DISPLAY).setModel(OppGenInfoModel);
					this.getQuesierData(true, false);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(true);
					var PspData = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMODEL")).getData();                                                          //PCR028711++; modify model Text, variable name, resource bundle method
					var oCBCAprTableItems = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_CHG_HISTORY);
					var cModel2 = thisCntrlr.getJSONModel(PspData.NAV_PRESHP_CHNG_HIST);                                                                           //PCR028711++; modify variable name
					oCBCAprTableItems.setModel(cModel2);
					var oCBCCCpyTableItems = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_CRBNCPY_TBL);
					var cModel3 = this.getJSONModel(PspData.NAV_PRESHP_CC);                                                                                        //PCR028711++; modify variable name
					oCBCCCpyTableItems.setModel(cModel3);
					this.onPspPayload(Message, oResource.getText("S2ESAINITKEY"));                                                                                 //PCR028711++; modify text with resource bundle text
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setEnabled(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_STATUS_TEXT).setText(oResource.getText("S2PSPNFOSFFTIT"));
					that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSP).setIconColor(sap.ui.core.IconColor.Critical);
				}
				else if(evt.mParameters.selectedIndex === 2){
					this.onPspPayload(Message, oResource.getText("S2NEGMANDATANS"));                                                                               //PCR028711++; modify text with resource bundle text
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_PSPRESET).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_CRBNCPYPNL).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_QN_PANEL).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_MAIN_COMMENT_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_TAB_GEN_PANEL).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_STATUS_TEXT).setText(oResource.getText("S2PCBCNTREQSTATTXT"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_MAIN_COMMENT_PANEL).setExpanded(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_CNGHISPNL).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setVisible(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSP).setIconColor(sap.ui.core.IconColor.Positive);
				}
			}
			myBusyDialog.close();
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
		/**
		 * This method Used to Setting PSP View Visibility.
		 * 
		 * @name setPspVisibility
		 * @param 
		 * @returns 
		 */
		setPspVisibility: function(sVisible){
			var oView = thisCntrlr.getView();
			oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_MAIN_COMMENT_PANEL).setVisible(sVisible);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSP_TAB_GEN_PANEL).setVisible(sVisible);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_CRBNCPYPNL).setVisible(sVisible);			
			oView.byId(com.amat.crm.opportunity.Ids.S2PSP_QN_PANEL).setVisible(sVisible);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSP_PANL_CNGHISPNL).setVisible(sVisible);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSP_STATUS_BAR).setVisible(sVisible);
		},
		/**
		 * This method is used to handles Main comment Panel Expand Event.
		 * 
		 * @name OnExpandMainCom
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		OnExpandMainCom: function(oEvent) {
			var oResource = thisCntrlr.getResourceBundle(),                                                                                                        //PCR028711++; include resource bundle
			    configConsts = com.amat.crm.opportunity.util.ServiceConfigConstants;                                                                               //PCR028711++; include configuration class
			if (oEvent.getParameters().expand === true) {
				var MCommType = "",
					oTable = "",
					MComModel = "";
				oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_TAB_MAINCOMMENT);
				//*************** Start Of PCR028711: Q2C Enhancements for Q2-20 **************
				MCommType = oResource.getText("S2PSPTABTXT");
				var ItemGuid = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
				var sValidate = configConsts.CommentSetPspFilterGuid + ItemGuid + configConsts.CommentSetPspFilterType + MCommType + "'";
				this.serviceCall(sValidate, configConsts.read, "", "");
				MComModel = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMCOMMODEL"));
				//*************** End Of PCR028711: Q2C Enhancements for Q2-20 ****************				
				oTable.setModel(MComModel);
			}
		},
		/**
		 * This method Used to current User with Contact List.
		 * 
		 * @name checkSubmission
		 * @param QAList - QA List
		 * @returns checkFlag - Binary Flag
		 */
		checkSubmission: function(QaList) {
			var checkFlag = true;
			if (QaList.length > 0) {
				for (var i = 0; i < QaList.length; i++) {
					for (var j = 0; j < QaList[i].NAV_CBC_QAINFO.results.length; j++) {
						if (!QaList[i].NAV_CBC_QAINFO.results[j].AnsValue.length>0) {
							checkFlag = false;
							return checkFlag;
						}
					}
				}
			}
			return checkFlag;
		},
		/**
		 * This method Used to Submit PSP.
		 * 
		 * @name onSubmitPsp
		 * @param oEvent -Event Handlers , Message - Custom Message on Save button press event
		 * @returns nil
		 */
		onSubmitPsp: function(oEvt, Message) { 
			var oResource = this.getResourceBundle();
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_EDIT).setVisible(false);
		    this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SAVE).setVisible(false);
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_CANCEL).setVisible(false);	
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_BTN_SUBMIT).setVisible(false);
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_STATUS_TEXT).setText(oResource.getText("S2PSPFINAL"));
			var myBusyDialog = thisCntrlr.getBusyDialog();
			//var oResource = this.getResourceBundle();                                                                                                              //PCR028711--;
			myBusyDialog.open();			
			Message = Message !== "" ? oResource.getText("S2PSRSSDACBCVALIDSAVEMSG") :"";
			this.detActionType = "";
			this.onPspPayload(Message, oResource.getText("S1TABLESALESTAGECOL"));                                                                                    //PCR028711++; replace value with resource bundle text
			this.getData();
			this.getQuesierData(false, false);	
			that_views2 === undefined ? that_views2 = this.getOwnerComponent().s2 : "";
			that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSP).setIconColor(sap.ui.core.IconColor.Positive);
			myBusyDialog.close();
		},
		/**
		 * This method Used to check questions answer in PSP.
		 * 
		 * @name checkAnySubmission
		 * @param QAList - QA List
		 * @returns checkFlag - Binary Flag
		 */
		checkAnySubmission: function(QaList) {
			var checkFlag = false;
			if (QaList.length > 0) {
				for (var i = 0; i < QaList.length; i++) {
					for (var j = 0; j < QaList[i].NAV_CBC_QAINFO.results.length; j++) {
						if (QaList[i].NAV_CBC_QAINFO.results[j].AnsValue.length>0) {
							checkFlag = true;
							return checkFlag;
						}
					}
				}
			}
			return checkFlag;
		},
		/**
		 * This method Handles Live Change Event for Carbon Copy F4 Text Change. 
		 * 
		 * @name onPspCbnCpyChange
		 * @param oEvent - Event Handlers
		 * @returns 
		 */
		onPspCbnCpyChange: function(oEvent) {
			that_psrsda === undefined ? this._initiateControllerObjects() : "";
			that_psrsda.getController().onCbnCpyChange(oEvent, thisCntrlr);
		},
		//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
		/**
		 * This method Handles PSP Questions Header Section Event.
		 * @name onPressPspQuesHead
		 * @param oEvent - Event Handler
		 * @returns
		 */
		onPressPspQuesHead: function(oEvent) {
			var AnsValue;
			var oResource = thisCntrlr.getResourceBundle();
			var PspData = thisCntrlr.getModelFromCore(oResource.getText("S2PSPMODEL")).getData();
			var QuestionHead = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
				"S2CBCPSRCARMSEPRATOR"))[2];
			var oModel = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSP_QN_TABLE).getModel();
			var itemData = oModel.getProperty("/root/"+QuestionHead);
			for(var i=0;i<PspData.NAV_PRESHP_QAHEAD.results[QuestionHead].NAV_CBC_QAINFO.results.length;i++){
		       itemData[i].SelectionIndex = 2;
		       PspData.NAV_PRESHP_QAHEAD.results[QuestionHead].NAV_CBC_QAINFO.results[i].AnsValue = oResource.getText("S2NEGMANDATANS");
			}
			oModel.refresh();
		//*************************End Of PCR028711 Q2C Enhancements for Q2-20********************
		}		
	});
});