/**
 * This class holds all methods of psrsda page.
 *
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends com.amat.crm.opportunity.controller.BaseController
 * @name com.amat.crm.opportunity.controller.psrsda
 *
 *  * -------------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 * Ver.No    Date        Author    PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * V00    20/02/2018    Abhishek   PCR017480         Initial version              *
 *                      Pant                                                      *
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
 * 15/11/2019      Abhishek        PCR026469         INC05215579: Carbon Copy Opp *
 *                 Pant                              Search Issue                 *
 * 29/04/2020      Arun            PCR028711         Q2C Enhancements for Q2-20   *
 *                 Jacob                                                          *
 * 13/01/2019      Abhishek        PCR033317         CBC MEA questionnaire        *
 *                 Pant                              alignment as part of RAR     *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 * 14/04/2021      Arun Jacob      PCR034716         Q2C ESA,PSR Enhancements     *
 ***********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController",
	"com/amat/crm/opportunity/controller/CommonController", "sap/m/MessageBox"
], function(Controller, CommonController, MessageBox) {
	"use strict";
	var thisCntrlr,
		that_general,
		that_pdcsda,
		that_views2,
		that_cbc, oCommonController;
	return Controller.extend("com.amat.crm.opportunity.controller.psrsda", {
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
		onInit: function() {
			thisCntrlr = this;
			thisCntrlr.bundle = this.getResourceBundle();
			that_views2 = this.getOwnerComponent().s2;
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
		 * This method Used for call after Rendering done.
		 * 
		 * @name onAfterRendering
		 * @param 
		 * @returns 
		 */
		onAfterRendering: function() {
			this._initiateControllerObjects();
		},
		/**
		 * This method Used for Initiate Other Controller Variable.
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
			if (that_pdcsda === undefined) {
				that_pdcsda = this.getOwnerComponent().pdcsda;
			}
			if (that_cbc === undefined) {
				that_cbc = this.getOwnerComponent().cbc;
			}
		},
		/**
		 * This method Used to Validate PSR-SDA Initiate Event.
		 * 
		 * @name validateInitiate
		 * @param 
		 * @returns initiateFlag - Binary Flag
		 */
		validateInitiate: function() {
			var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			var initiateFlag = false;
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle.getText("S2ICONTABCARMKEY")) {
				var romInitiateFlag = this.checkContact(GenInfoData.NAV_ROM_INFO.results);
				var POMInitiateFlag = this.checkContact(GenInfoData.NAV_POM_INFO.results);
				var BMOInitiateFlag = this.checkContact(GenInfoData.NAV_BMO_INFO.results);
				var salesInitiateFlag = this.checkContact(GenInfoData.NAV_SALES_INFO.results);
				(romInitiateFlag === true || POMInitiateFlag === true || BMOInitiateFlag === true ||
					salesInitiateFlag === true) ? (initiateFlag = true) : (initiateFlag = false);
			} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle.getText(
					"S2ICONTABPSRSDAKEY")) {
				var romUserList = GenInfoData.NAV_ROM_INFO.results;
				var salesUserList = GenInfoData.NAV_SALES_INFO.results;
				var romInitiateFlag = this.checkContact(romUserList);
				var salesInitiateFlag = this.checkContact(salesUserList);
				(romInitiateFlag === true || salesInitiateFlag === true) ? (initiateFlag = true) : (initiateFlag =
					false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).setSelectedIndex(-1);
			} else {
				var gmoUserList = GenInfoData.NAV_BMO_INFO.results;
				var initiateFlag = this.checkContact(gmoUserList);
			}
			return initiateFlag;
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
		 * This method Handles PSR-SDA Radio Buttons Event.
		 * 
		 * @name onSelectRBPSRSDA
		 * @param evt - Event Handlers
		 * @returns 
		 */
		onSelectRBPSRSDA: function(evt) {
			this._initiateControllerObjects();
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var initiateFlag = this.validateInitiate();
			if (initiateFlag === false) {
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
					.getText("S2ICONTABPSRSDAKEY")) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCROMSALEVALDFAILMSG"));
				} else {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PDCSDABMOFAILMSG"));
				}
			} else {
				var SecCheckFlag = false;
				var SecurityData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBSECURITYMODEL")).getData();
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
					.getText("S2ICONTABPSRSDAKEY")) {
					if (SecurityData.InitPsr !== thisCntrlr.bundle.getText("S2ODATAPOSVAL")) {
						SecCheckFlag = true;
					}
				} else if (SecurityData.InitPdc !== thisCntrlr.bundle.getText("S2ODATAPOSVAL")) {
					SecCheckFlag = true;
				}
				if (SecCheckFlag === true) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCAUTHCHECKFAILMSG"));
				} else {
					var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
						"GLBOPPGENINFOMODEL"));
					var oView = thisCntrlr.getView();
					var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
					if (evt.mParameters.selectedIndex === 1) {
						var obj = {};
						obj.Guid = OppGenInfoModel.getData().Guid;
						obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
						obj.PsrRequired = thisCntrlr.bundle.getText("S2POSMANDATANS");
						obj.PsrType = "";
						if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
							.getText("S2ICONTABPSRSDAKEY")) {
							obj.PsrStatus = "5";
							//***************Justification: PCR018375++ Phase2 - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
//							obj.PsrStatDesc = "";                                                     //PCR018375--
						} else {
							obj.PsrStatus = "605";
//							obj.PsrStatDesc = OppGenInfoModel.getData().ProductLine;                  //PCR018375--
						}
						obj.PsrStatDesc = OppGenInfoModel.getData().ProductLine;                      //PCR018375++
						obj.Bsdl = "";
						obj.ConComments = PSRData.ConComments;                                        //PCR019492++
						obj.Ssdl = "";
						obj.Bd = "";
						obj.Sd = "";
						obj.AprvComments = "";
						obj.ActionType = "";
						obj.TaskId = "";
						obj.WiId = "";
						obj.InitiatedBy = "";
						//obj.InitiatedDt = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                      //PCR035760-- Defect#131 TechUpgrade changes
						obj.Time = thisCntrlr.bundle.getText("S2OPPAPPPAYLODTMEKEY");
						this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat.crm
							.opportunity.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText(
								"S2PSRSDAINITSUCSSTXT"));
						this.fnSetVisibility(thisCntrlr.bundle.getText("S2POSMANDATANS"));
						this.getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
						that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor
							.Critical);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).setText("");
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(
							true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
							.getText("S2PSRSDAEDITBTNTXT"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
							.getText("S2PSRSDAEDITICON"));
						thisCntrlr.onEditPSRSDA();
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle
							.getText("S2PSRSDASFCANINITXT"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(thisCntrlr.bundle
							.getText("S2CANCELBTNICON"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL).setExpanded(false);                                 //PCR018375++
//					} else if (evt.mParameters.selectedIndex === 2) {                                                                                  //PCR019492--
					} else if (evt.mParameters.selectedIndex >= 2) {                                                                                   //PCR019492++
						var obj = {};
						obj.Guid = OppGenInfoModel.getData().Guid;
						obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
						//obj.PsrRequired = thisCntrlr.bundle.getText("S2NEGMANDATANS");                                                                 //PCR019492--
						obj.PsrRequired = evt.mParameters.selectedIndex === 2 ? thisCntrlr.bundle.getText("S2PSRDCNASHPODKEY") :                         //PCR019492++
							              evt.mParameters.selectedIndex === 3 ? thisCntrlr.bundle.getText("S2PSRDCNADEFERKEY") : (                       //PCR021481++
							              (evt.mParameters.selectedIndex > 3 && evt.getSource().getButtons()[evt.mParameters.selectedIndex].getText()    //PCR021481++
											 === thisCntrlr.bundle.getText("S2PSRDCNEWEVALTXT") ? thisCntrlr.bundle.getText("S2PSRDCEVALKEY") :          //PCR021481++, PCR033317++; S2PSRDCEVALTXT replaced with S2PSRDCNEWEVALTXT
											      thisCntrlr.bundle.getText("S2PSRCBCAPPROVEKEY")));                                                     //PCR021481++
//							thisCntrlr.bundle.getText("S2PSRDCEVALKEY");                                                                                 //PCR019492++; PCR021481--
						obj.PsrType = "";
						if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
							.getText("S2ICONTABPSRSDAKEY")) {
							obj.PsrStatus = "85";
						} else {
							obj.PsrStatus = "685";
						}
						obj.Bsdl = "";
						obj.ConComments = PSRData.ConComments;                                                                   //PCR019492++  
						obj.Ssdl = "";
						obj.Bd = "";
						obj.Sd = "";
						obj.AprvComments = "";
						obj.ActionType = "";
						obj.TaskId = "";
						obj.WiId = "";
						obj.PsrStatDesc = "";
						obj.InitiatedBy = "";
						//obj.InitiatedDt = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                   //PCR035760-- Defect#131 TechUpgrade changes
						obj.Time = thisCntrlr.bundle.getText("S2OPPAPPPAYLODTMEKEY");
						this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat.crm
							.opportunity.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText(
								"S2PSRSDANOTAPPLESUCCSSTXT"));
						this.fnSetVisibility(thisCntrlr.bundle.getText("S2NEGMANDATANS"));
						that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor
							.Positive);
						this.getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
						this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).setText(thisCntrlr.bundle
							.getText("S2PSRBARSTATUSHEADER") + " " + thisCntrlr.getModelFromCore(thisCntrlr.bundle
								.getText("GLBPSRMODEL")).getData().PsrStatDesc);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FORM_DISPLAY_482).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox).setVisible(false);
						//***************Justification: PCR018375++ Phase2 - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISION_CONTENT).setVisible(false);             //PCR018375--
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISION_CONTENT).setVisible(true);              //PCR018375++
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LOOKUP_LISTBtn).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle
							.getText("S2PSRSDASFCANINITXT"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(thisCntrlr.bundle
							.getText("S2CANCELBTNICON"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_CNGHISPNL).setVisible(false);                             //PCR019492++
						//*************** Start Of PCR018375++ Phase2 - X - PSR/PDC/CBC Main Comment Section in NA ****************//
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CONTACTINFO_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_B_APPROVALS_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(false);
                        oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL).setExpanded(true);
                        //*************** End Of PCR018375++ Phase2 - X - PSR/PDC/CBC Main Comment Section in NA ****************//
					}
				}
			}
			if(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp) !== undefined){
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).setSelectedIndex(-1);}
			if(that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp) !== undefined){
			that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp).setSelectedIndex(-1);}
			myBusyDialog.close();
		},
		/**
		 * This method Handles Confirmation on Initiate Radio Button On PSR-SDA.
		 * 
		 * @name onPressInitiatePSRSDA
		 * @param 
		 * @returns 
		 */
		onPressInitiatePSRSDA: function() {
			this._initiateControllerObjects();
			sap.m.MessageBox.confirm(thisCntrlr.bundle.getText("S2PSRREQIREDVALIDATIONTXT"), thisCntrlr.confirmationBack,
				thisCntrlr.bundle.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
		},
		/**
		 * This method Handles Confirmation Dialog value.
		 * 
		 * @name confirmationBackSkip
		 * @param
		 * @returns 
		 */
		confirmationBackSkip: function() {
			this._initiateControllerObjects();
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(true);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(true);
			var oview = thisCntrlr.getView();
			var Bar = oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_BAR);
			var PSRDecisionBox = oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox);
			var PSRDecisionContent = oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISION_CONTENT);
			var LookUpBtn = oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LOOKUP_LISTBtn);
			var EditBtn = oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn);
			var SaveBtn = oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn);
			var SFAPRBtn = oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn);
			var iconTabBtn = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB);
			Bar.setVisible(true);
			PSRDecisionBox.setVisible(false);
			PSRDecisionContent.setVisible(false);
			Bar.addStyleClass(thisCntrlr.bundle.getText("S2PSRSDABARSKIPCLS"));
			that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Positive);
			oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).setText(thisCntrlr.bundle
				.getText("S2PCBCNTREQSTATTXT"));
			LookUpBtn.setVisible(false);
			EditBtn.setVisible(false);
			SaveBtn.setVisible(false);
			SFAPRBtn.setVisible(false);
			oview.byId(com.amat.crm.opportunity.Ids.S2GENARAL_INFO_DATA).setVisible(false);
			oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).setValueState(thisCntrlr.bundle
				.getText("S2DELNAGVIZTEXT"));
			oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).setSelectedIndex(-1);
		},
		/**
		 * This method Handles PSR-SDA Skip Buttons Event.
		 * 
		 * @name onPressSkipPSRSDA
		 * @param 
		 * @returns 
		 */
		onPressSkipPSRSDA: function() {
			thisCntrlr.confirmationBackSkip();
		},
		/**
		 * This method is used to Check User Authorization For The Task.
		 * 
		 * @name checkUsersfromlist
		 * @param 
		 * @returns checkFlag - Binary Value
		 */
		checkUsersfromlist: function() {
			var checkFlag = false;
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
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
		 * This method is used to Handle PSR-SDA Edit Button Event.
		 * 
		 * @name onEditPSRSDA
		 * @param 
		 * @returns 
		 */
		onEditPSRSDA: function() {
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var oView = this.getView();
			var ValidCon = false;
			if (parseInt(PSRData.PsrStatus) === 5 || parseInt(PSRData.PsrStatus) === 4 || parseInt(PSRData.PsrStatus) === 15 || parseInt(
					PSRData.PsrStatus) ===
				17 || parseInt(PSRData.PsrStatus) === 65) {
				ValidCon = thisCntrlr.checkUsersfromlist();
			} else if (parseInt(PSRData.TaskId) !== 0) {
				ValidCon = true;
			}
			if (ValidCon === false) {
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2USERALLAUTHFALTTXT"));
			} else {
				(parseInt(PSRData.PsrStatus) === 65) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle
					.getText("S2PSRSDASUBFORAPP"))) : ("");
				var ASCType = PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? true : false;                                 //PCR019492++
				var SecurityData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBSECURITYMODEL")).getData();
				var SafQaVis = "",
					SpecTypQaVis = "",
					SdaQaVis = "",
					UpldFnlSpecVis = "",
					UpldCustSpecVis = "";
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAF_RADIOBtn).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setEnabled(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setEnabled(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(false);
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false);
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false);
				var EBSDAPSRData = PSRData.NAV_BSDA_EVDOC.results;
				var ESSDAPSRData = PSRData.NAV_SSDA_EVDOC.results;
				var CustSpecRev1Data = PSRData.NAV_CUST_REVSPEC.results;
				(SecurityData.UpldCustSpec === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (UpldCustSpecVis =
					true) : (UpldCustSpecVis = false);
				var FPSRDocData = PSRData.NAV_FNL_DOCS.results;
				(SecurityData.UpldFnlSpec === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (UpldFnlSpecVis =
					true) : (UpldFnlSpecVis = false);
				var FinalQuesItems;
				var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();                               //PCR019492++
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(false);                                       //PCR021481++
				if (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle
					.getText("S2PSRSDAEDITBTNTXT")) {
					that_views2.getController().setGenInfoVisibility();
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setEnabled(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.bundle
						.getText("S2CANCELBTNICON"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.bundle
						.getText("S2PSRSDACANBTNTXT"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_CARBON_COPY).setEnabled(false);
					//oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                               //PCR025717--
					//	false);                                                                                                                            //PCR025717--
					if (parseInt(PSRData.PsrStatus) === 5 || parseInt(PSRData.PsrStatus) === 4) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(
							false);
						FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle.getText(
							"S2PSRDETERMINDFTPARAM"), true, false, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType);                                //PCR019492++   
						(SecurityData.SafQa === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (SafQaVis = true) :
						(SafQaVis = false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAF_RADIOBtn).setEnabled(SafQaVis);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_CARBON_COPY).setEnabled(true);
						//oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                            //PCR025717--
						//	false);                                                                                                                         //PCR025717--
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_CARBON_COPY).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAF_RADIOBtn).setEnabled(SafQaVis);
						if (PSRData.RevOppId !== "" && PSRData.RevOpitmId !== "") {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(
								true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_UnLINKBtn).setEnabled(
								true);
						} else if (PSRData.RevOppId !== "" && PSRData.RevOpitmId === "") {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(
								false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setEnabled(
								false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(true);                               //PCR021481++
						} else if (PSRData.RevOppId === "" && PSRData.RevOpitmId === "") {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(
								true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setEnabled(
								true);
						}
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_CARBON_COPY).setEnabled(true);
						//oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                           //PCR025717--
						//	false);                                                                                                                        //PCR025717--
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_CARBON_COPY).setEnabled(true);
						/****************Start Of PCR025717 Q2C Q4 2019 Enhancements ***********************************
						if (PSRData.NAV_PSR_CC.results.length > 0) {                
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(
								false);
						}
						****************End Of PCR025717 Q2C Q4 2019 Enhancements **************************************/
						(PSRData.CcOppId === "" && PSRData.CcOpitmId === "") ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(
							false)) : ("");
						var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, UpldCustSpecVis, true);
						var oCustSpecRev1JModel = new sap.ui.model.json.JSONModel({
							"ItemSet": CustSpecRev1
						});
						var oCustSpecRev1DocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_TABLE);
						oCustSpecRev1DocTable.setModel(oCustSpecRev1JModel);
						this.setTableNoteEnable(oCustSpecRev1DocTable);
						this.setTableSecurity(oCustSpecRev1DocTable);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
						(SecurityData.SpecTypQa === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (SpecTypQaVis =
							true) : (SpecTypQaVis = false);
						(SpecTypQaVis === true) ? (FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle
							.getText("S2PSRDETERMINDFTPARAM"), true, false, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType)) : (FinalQuesItems = thisCntrlr.fnDeterminePSRTY(               //PCR019492++
							thisCntrlr.MandateData, thisCntrlr.bundle.getText("S2PSRDETERMINDFTPARAM"), false, false, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType));                     //PCR019492++
						var cModel1 = this.getJSONModel(FinalQuesItems[0]);
						var oTableItems1 = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE);
						var oItemTemplate1 = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DETERMINE_Sys_SpecTYPE_TEMPLATE);
						oTableItems1.setModel(cModel1);
						var RPSRDocData = PSRData.NAV_REV_DOCS.results;
						var RPSRDoc = thisCntrlr.loadFPSRevDocData(RPSRDocData, true, true);
						var oRPSRDocJModel = new sap.ui.model.json.JSONModel({
							"ItemSet": RPSRDoc
						});
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE).setModel(
							oRPSRDocJModel);
						this.setTableNoteEnable(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE));
						this.setTableSecurity(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE));
					} else if (parseInt(PSRData.PsrStatus) === 15) {
						(SecurityData.SpecTypQa === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (SpecTypQaVis =
							true) : (SpecTypQaVis = false);
						(SpecTypQaVis === true) ? (FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle
							.getText("S2PSRDETERMINDFTPARAM"), false, true, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType)) : (FinalQuesItems = thisCntrlr.fnDeterminePSRTY(            //PCR019492++
							thisCntrlr.MandateData, thisCntrlr.bundle.getText("S2PSRDETERMINDFTPARAM"), false, false, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType));                  //PCR019492++
						var FPSRDoc = this.loadFPSRevDocData(FPSRDocData, UpldFnlSpecVis, true);
						var oFPSRDocJModel = this.getJSONModel({
							"ItemSet": FPSRDoc
						});
						var oFPSRDocTable = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_TABLE);
						oFPSRDocTable.setModel(oFPSRDocJModel);
						this.setTableNoteEnable(oFPSRDocTable);
						this.setTableSecurity(oFPSRDocTable);
						var oSDATableItems = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_TABLE);
						var oSDAItemTemplate = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_TEMPLATE);
						(SecurityData.SdaQa === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (SdaQaVis = true) :
						(SdaQaVis = false);
						var FinalSDAQus = [{
							"items": []
						}];
						FinalSDAQus.items = this.validatSDAQues(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
							"GLBSDAQESMODEL")).getData());
						var FinalSDAQuesItems = (SdaQaVis === true) ? (thisCntrlr.fnConTableModel(FinalSDAQus.items.items,
							true)) : (thisCntrlr.fnConTableModel(FinalSDAQus.items.items, false));
						var cModel = this.getJSONModel(FinalSDAQuesItems);
						oSDATableItems.setModel(cModel);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_CARBON_COPY).setEnabled(false);
						//oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                        //PCR025717--
						//	false);                                                                                                                     //PCR025717--
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(true);                                     //PCR019492--
						if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                                                     //PCR019492++
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);                                //PCR019492++
						} else {                                                                                                                        //PCR019492++
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(true);                                 //PCR019492++
						}                                                                                                                               //PCR019492++
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAF_RADIOBtn).setEnabled(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(
							true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(true);                                     //PCR019492--
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(
							true);
						//************************Start Of PCR019492: ASC606 UI Changes**************
						if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
							var RRAQuesData = thisCntrlr.getRRAQusData(PSRData.PsrStatus, PSRData.NAV_RRA_QA_PSR, GenInfoData.Region, true);
							this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
							(parseInt(PSRData.PsrStatus) >= 15&& PSRData.PsrType === this.getResourceBundle().getText("S2PSRSDASTATREPEAT")) ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true))
									:(this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(false));
							var EBSDAPSRDoc = this.loadFPSRevDocData(EBSDAPSRData, true, true, UpldFnlSpecVis);
							var oEBSDAPSRDocJModel = this.getJSONModel({
								"ItemSet": EBSDAPSRDoc
							});
							var oEBSDAPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EVDANCE_DOC_TABLE);
							oEBSDAPSRDocTable.setModel(oEBSDAPSRDocJModel);
							this.setTableNoteEnable(oEBSDAPSRDocTable);
							this.setTableSecurity(oEBSDAPSRDocTable);
						}
						//************************End Of PCR019492: ASC606 UI Changes**************
					} else if (parseInt(PSRData.PsrStatus) === 17) {
						if (PSRData.PsrType === thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT") && thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
								"GLBOPPGENINFOMODEL")).getData().Region !== thisCntrlr.bundle.getText("S2OPPREGION")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);
						} else {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(true);
						}
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(
							true);
						var EBSDAPSRDoc = this.loadFPSRevDocData(EBSDAPSRData, true, true, UpldFnlSpecVis);
						var oEBSDAPSRDocJModel = this.getJSONModel({
							"ItemSet": EBSDAPSRDoc
						});
						var oEBSDAPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EVDANCE_DOC_TABLE);
						oEBSDAPSRDocTable.setModel(oEBSDAPSRDocJModel);
						this.setTableNoteEnable(oEBSDAPSRDocTable);
						this.setTableSecurity(oEBSDAPSRDocTable);
						var FPSRDoc = this.loadFPSRevDocData(FPSRDocData, UpldFnlSpecVis, true);
						var oFPSRDocJModel = this.getJSONModel({
							"ItemSet": FPSRDoc
						});
						var oFPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_TABLE);
						oFPSRDocTable.setModel(oFPSRDocJModel);
						this.setTableNoteEnable(oFPSRDocTable);
						this.setTableSecurity(oFPSRDocTable);
						//************************Start Of PCR019492: ASC606 UI Changes**************
						if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
							var RRAQuesData = thisCntrlr.getRRAQusData(PSRData.PsrStatus, PSRData.NAV_RRA_QA_PSR, GenInfoData.Region, true);
							this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);
						}
						//************************End Of PCR019492: ASC606 UI Changes**************
					} else if (parseInt(PSRData.PsrStatus) > 15 && parseInt(PSRData.PsrStatus) < 55) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(
							false);
						(parseInt(PSRData.PsrStatus) === 25) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setEnabled(
							true)) : (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setEnabled(
							false));
						//************************Start Of PCR019492: ASC606 UI Changes**************
						if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") && parseInt(PSRData.PsrStatus) === 25){
							var RRAQuesData = thisCntrlr.getRRAQusData(PSRData.PsrStatus, PSRData.NAV_RRA_QA_PSR, GenInfoData.Region, true);
							this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setEnabled(true);
						}
						//************************End Of PCR019492: ASC606 UI Changes**************
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
						FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle.getText(
							"S2PSRDETERMINDFTPARAM"), false, false, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType);                                            //PCR019492++
					} else if (parseInt(PSRData.PsrStatus) === 55) {
						var SAFBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn);                                                                    //PCR019492++
						SAFBtn.setVisible(true);
						SAFBtn.setIcon(thisCntrlr.bundle.getText("S2PSRSDADUPLICATEBTN"));						
//						SAFBtn.setText(thisCntrlr.bundle.getText("S2PSRSDASFSSDAINITTXT"));                                                                             //PCR019492--
						var SAFBtnText = PSRData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")? SAFBtn.setText(                                            //PCR019492++
								thisCntrlr.bundle.getText("S2PSRDCINITRRABTNTXTASC606")) : SAFBtn.setText(this.getResourceBundle().getText("S2PSRSDASFSSDAINITTXT"));   //PCR019492++ 
						SAFBtn.setText(SAFBtnText); 
						SAFBtn.setType(thisCntrlr.bundle.getText("S2CBCPSRCARMBTNTPYACCEPT"));
						(PSRData.InitSsda === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (SAFBtn.setEnabled(true)) : (SAFBtn.setEnabled(false));
						SAFBtn.setEnabled(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(true);
						FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle.getText(
							"S2PSRDETERMINDFTPARAM"), false, false, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType);                                            //PCR019492++
					} else if (parseInt(PSRData.PsrStatus) >= 65) {
						(parseInt(PSRData.PsrStatus) === 65) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(
							false)) : ("");
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);                                                       //PCR019492++
						if (PSRData.PsrType === thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT") && thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
								"GLBOPPGENINFOMODEL")).getData().Region !== thisCntrlr.bundle.getText("S2OPPREGION") &&  PSRData.Asc606_SsdaFlag === "") {              //PCR019492++
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(thisCntrlr.bundle.getText(
								"S2BSDASSMENTLVL1"));
//						} else {                                                                                                                                        //PCR019492--
						} else if (parseInt(PSRData.PsrStatus) === 65){                                                                                                 //PCR019492++    
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(true);
						}
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
							true);
						if (parseInt(PSRData.PsrStatus) >= 70) {
//							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false);                                                //PCR019492--									
							if(PSRData.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") && parseInt(PSRData.PsrStatus) === 70){                           //PCR019492++
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(true);                                             //PCR019492++
							} else {                                                                                                                                    //PCR019492++
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false);                                            //PCR019492++
							}							                                                                                                                //PCR019492++
							if (parseInt(PSRData.PsrStatus) === 70) {
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setEnabled(
									true);
							} else {
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setEnabled(
									false);
							}
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_TEXT_AREA).setEnabled(
								false);
							var ESSDAPSRDoc = this.loadFPSRevDocData(ESSDAPSRData, false, false, UpldFnlSpecVis);
							var oESSDAPSRDocJModel = this.getJSONModel({
								"ItemSet": ESSDAPSRDoc
							});
							var oESSDAPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EVDANCE_SSDA_DOC_TABLE);
							oESSDAPSRDocTable.setModel(oESSDAPSRDocJModel);
							this.setTableNoteEnable(oESSDAPSRDocTable);
							this.setTableSecurity(oESSDAPSRDocTable);
						} else {
							if (PSRData.PsrType === thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT") && thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
									"GLBOPPGENINFOMODEL")).getData().Region !== thisCntrlr.bundle.getText("S2OPPREGION")  &&  PSRData.Asc606_SsdaFlag === "") {          //PCR019492++ 
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false);
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(thisCntrlr.bundle.getText(
									"S2BSDASSMENTLVL1"));
//							} else {                                                                                                                                     //PCR019492--
							} else if (parseInt(PSRData.PsrStatus) === 65){                                                                                              //PCR019492++ 
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(true);
							}
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setEnabled(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_TEXT_AREA).setEnabled(
								true);
							var ESSDAPSRDoc = this.loadFPSRevDocData(ESSDAPSRData, true, true, UpldFnlSpecVis);
							var oESSDAPSRDocJModel = this.getJSONModel({
								"ItemSet": ESSDAPSRDoc
							});
							var oESSDAPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EVDANCE_SSDA_DOC_TABLE);
							oESSDAPSRDocTable.setModel(oESSDAPSRDocJModel);
							this.setTableNoteEnable(oESSDAPSRDocTable);
							this.setTableSecurity(oESSDAPSRDocTable);
						}
					} else if (parseInt(PSRData.PsrStatus) === 60) {
						if (PSRData.SsdaReq === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
								false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(
								true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setEnabled(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_TEXT_AREA).setEnabled(
								true);
						}
						FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle.getText(
							"S2PSRDETERMINDFTPARAM"), false, false, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType);                                    //PCR019492++
					} else if (parseInt(PSRData.PsrStatus) === 70) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setEnabled(true);
					}
					if (FinalQuesItems !== undefined) {
						var cModel1 = this.getJSONModel(FinalQuesItems[0]);
						var oTableItems1 = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE);
						var oItemTemplate1 = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DETERMINE_Sys_SpecTYPE_TEMPLATE);
						oTableItems1.setModel(cModel1);
					}
				} else {
					//************************Start Of PCR019492 : ASC606 UI Changes**************
					if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
						var RRAQuesData = thisCntrlr.getRRAQusData(PSRData.PsrStatus, PSRData.NAV_RRA_QA_PSR, GenInfoData.Region, false);
						this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
						var EBSDAPSRDoc = this.loadFPSRevDocData(EBSDAPSRData, false, false, UpldFnlSpecVis);
						var oEBSDAPSRDocJModel = this.getJSONModel({
							"ItemSet": EBSDAPSRDoc
						});
						var oEBSDAPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EVDANCE_DOC_TABLE);
						oEBSDAPSRDocTable.setModel(oEBSDAPSRDocJModel);
						this.setTableNoteEnable(oEBSDAPSRDocTable);
						this.setTableSecurity(oEBSDAPSRDocTable);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setEnabled(false);
					}
					//************************End Of PCR019492 : ASC606 UI Changes**************
					var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, false, false);
					var oCustSpecRev1JModel = this.getJSONModel({
						"ItemSet": CustSpecRev1
					});
					var oCustSpecRev1DocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_TABLE);
					oCustSpecRev1DocTable.setModel(oCustSpecRev1JModel);
					this.setTableNoteEnable(oCustSpecRev1DocTable);
					this.setTableSecurity(oCustSpecRev1DocTable);
					var RPSRDocData = PSRData.NAV_REV_DOCS.results;
					var RPSRDoc = thisCntrlr.loadFPSRevDocData(RPSRDocData, false, false);
					var oRPSRDocJModel = this.getJSONModel({
						"ItemSet": RPSRDoc
					});
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE).setModel(
						oRPSRDocJModel);
					this.setTableNoteEnable(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE));
					this.setTableSecurity(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE));
					var FPSRDoc = this.loadFPSRevDocData(FPSRDocData, false, false);
					var oFPSRDocJModel = this.getJSONModel({
						"ItemSet": FPSRDoc
					});
					var oFPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_TABLE);
					oFPSRDocTable.setModel(oFPSRDocJModel);
					this.setTableNoteEnable(oFPSRDocTable);
					this.setTableSecurity(oFPSRDocTable);
					var EBSDAPSRDoc = this.loadFPSRevDocData(EBSDAPSRData, false, false, UpldFnlSpecVis);
					var oEBSDAPSRDocJModel = this.getJSONModel({
						"ItemSet": EBSDAPSRDoc
					});
					var oEBSDAPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EVDANCE_DOC_TABLE);
					oEBSDAPSRDocTable.setModel(oEBSDAPSRDocJModel);
					this.setTableNoteEnable(oEBSDAPSRDocTable);
					this.setTableSecurity(oEBSDAPSRDocTable);
					var ESSDAPSRDoc = this.loadFPSRevDocData(ESSDAPSRData, false, false, UpldFnlSpecVis);
					var oESSDAPSRDocJModel = this.getJSONModel({
						"ItemSet": ESSDAPSRDoc
					});
					var oESSDAPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EVDANCE_SSDA_DOC_TABLE);
					oESSDAPSRDocTable.setModel(oESSDAPSRDocJModel);
					this.setTableNoteEnable(oESSDAPSRDocTable);
					this.setTableSecurity(oESSDAPSRDocTable);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_CARBON_COPY).setEnabled(false);
					//oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                                         //PCR025717--
					//	false);                                                                                                                                      //PCR025717--
					this.fnSetVisibility(thisCntrlr.bundle.getText("S2POSMANDATANS"));
					if (parseInt(PSRData.PsrStatus) >= 4) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
					}
					if (parseInt(PSRData.PsrStatus) === 55) {
						var SAFBtn = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn);
						SAFBtn.setVisible(true);
						SAFBtn.setIcon(thisCntrlr.bundl.getText("S2PSRSDADUPLICATEBTN"));
//						SAFBtn.setText(thisCntrlr.bundle.getText("S2PSRSDASFSSDAINITTXT"));                                                                           //PCR019492--
						var SAFBtnText = PSRData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")? SAFBtn.setText(                                          //PCR019492++
							thisCntrlr.bundle.getText("S2PSRDCINITRRABTNTXTASC606")) : SAFBtn.setText(this.getResourceBundle().getText("S2PSRSDASFSSDAINITTXT"));     //PCR019492++
						SAFBtn.setText(SAFBtnText);                                                                                                                   //PCR019492++
						SAFBtn.setType(thisCntrlr.bundle.getText("S2CBCPSRCARMBTNTPYACCEPT"));
						SAFBtn.setEnabled(true);
						this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(false);
						FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle.getText(
							"S2PSRDETERMINDFTPARAM"), false, false, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType);                                          //PCR019492++
					} else if (parseInt(PSRData.PsrStatus) === 60) {
						this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
						if (PSRData.SsdaReq === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
								true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setEnabled(
								true);
						} else {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
								false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setEnabled(
								false);
						}
					}
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.bundle
						.getText("S2PSRSDAEDITICON"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.bundle
						.getText("S2PSRSDAEDITBTNTXT"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAF_RADIOBtn).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(false);
					var FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle.getText(
						"S2PSRDETERMINDFTPARAM"), false, false, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType);                                         //PCR019492++
					var cModel1 = this.getJSONModel(FinalQuesItems[0]);
					var oTableItems1 = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE);
					var oItemTemplate1 = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DETERMINE_Sys_SpecTYPE_TEMPLATE);
					oTableItems1.setModel(cModel1);
					var oSDATableItems = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_TABLE);
					var oSDAItemTemplate = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_TEMPLATE);
					var FinalSDAQus = [{
						"items": []
					}];
					FinalSDAQus.items = this.validatSDAQues(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
						"GLBSDAQESMODEL")).getData());
					var FinalSDAQuesItems = thisCntrlr.fnConTableModel(FinalSDAQus.items.items, false);
					var cModel = this.getJSONModel(FinalSDAQuesItems);
					oSDATableItems.setModel(cModel);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(false);
					if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
                        this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setVisible(false);
					} else {
						this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setVisible(true);
					}
					(parseInt(PSRData.PsrStatus) === 15 && PSRData.PsrType === this.getResourceBundle().getText("S2PSRSDASTATREPEAT") && PSRData.Asc606_BsdaFlag ===             //PCR019492++
						thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true)):("");  //PCR019492++
				}
			}
		},
		/**
		 * This method Used for Default PSR View.
		 * 
		 * @name defaultView
		 * @param 
		 * @returns 
		 */
		defaultView: function() {
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var oView = this.getView();
			var EBSDAPSRData = PSRData.NAV_BSDA_EVDOC.results;
			var ESSDAPSRData = PSRData.NAV_SSDA_EVDOC.results;
			var CustSpecRev1Data = PSRData.NAV_CUST_REVSPEC.results;
			var FPSRDocData = PSRData.NAV_FNL_DOCS.results;
			var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, false, false);
			var oCustSpecRev1JModel = this.getJSONModel({
				"ItemSet": CustSpecRev1
			});
			var oCustSpecRev1DocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_TABLE);
			oCustSpecRev1DocTable.setModel(oCustSpecRev1JModel);
			this.setTableNoteEnable(oCustSpecRev1DocTable);
			this.setTableSecurity(oCustSpecRev1DocTable);
			var RPSRDocData = PSRData.NAV_REV_DOCS.results;
			var RPSRDoc = thisCntrlr.loadFPSRevDocData(RPSRDocData, false, false);
			var oRPSRDocJModel = this.getJSONModel({
				"ItemSet": RPSRDoc
			});
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE).setModel(
				oRPSRDocJModel);
			this.setTableNoteEnable(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE));
			this.setTableSecurity(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE));
			var FPSRDoc = this.loadFPSRevDocData(FPSRDocData, false, false);
			var oFPSRDocJModel = this.getJSONModel({
				"ItemSet": FPSRDoc
			});
			var oFPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_TABLE);
			oFPSRDocTable.setModel(oFPSRDocJModel);
			this.setTableNoteEnable(oFPSRDocTable);
			this.setTableSecurity(oFPSRDocTable);
			var EBSDAPSRDoc = this.loadFPSRevDocData(EBSDAPSRData, false, false, false);
			var oEBSDAPSRDocJModel = this.getJSONModel({
				"ItemSet": EBSDAPSRDoc
			});
			var oEBSDAPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EVDANCE_DOC_TABLE);
			oEBSDAPSRDocTable.setModel(oEBSDAPSRDocJModel);
			this.setTableNoteEnable(oEBSDAPSRDocTable);
			this.setTableSecurity(oEBSDAPSRDocTable);
			var ESSDAPSRDoc = this.loadFPSRevDocData(ESSDAPSRData, false, false, false);
			var oESSDAPSRDocJModel = this.getJSONModel({
				"ItemSet": ESSDAPSRDoc
			});
			var oESSDAPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EVDANCE_SSDA_DOC_TABLE);
			oESSDAPSRDocTable.setModel(oESSDAPSRDocJModel);
			this.setTableNoteEnable(oESSDAPSRDocTable);
			this.setTableSecurity(oESSDAPSRDocTable);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_CARBON_COPY).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setEnabled(false);
			//oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(                                                     //PCR025717--
			//	false);                                                                                                                                  //PCR025717--
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.bundle
				.getText("S2PSRSDAEDITICON"));
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.bundle
				.getText("S2PSRSDAEDITBTNTXT"));
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAF_RADIOBtn).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(false);
			//************************start Of PCR019492: ASC606 UI Changes**************
			var ContactBtnArr = [com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_ROM_ADDBtn, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SALES_ADDBtn,
			     				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_AcSME_ADDBtn, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_POM_ADDBtn,
			     				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BMO_ADDBtn, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GPM_ADDBtn,
			     				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_TPSKAT_ADDBtn, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BUSME_ADDBtn, 
			     				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BMHead_ADDBtn, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CNTROLLER_ADDBtn, 
			     				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_PLHead_ADDBtn
			     			];
		    var ContactLstArr = [com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_9, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_10,
			     				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_11, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_POMLIST,
			     				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_15, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_16,
			     				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_17, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_18, 
			     				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_12, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_13,
			     				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_14
			     			];
		    for (var i = 0; i < ContactBtnArr.length; i++) {
				oView.byId(ContactBtnArr[i]).setEnabled(false);
				oView.byId(ContactLstArr[i]).setMode("None");
			}
		  //************************End Of PCR019492: ASC606 UI Changes**************
		},
		/**
		 * This method Used for Determine PSR Type.
		 * 
		 * @name fnDeterminePSRTY
		 * @param QuesItems: PSR Question Data, param- Visibility, salesEnable-Sales Enable Flag ,BMEnable- BMO Enable Flag
		 * @returns 
		 */
		fnDeterminePSRTY: function(QuesItems, param, salesEnable, BMEnable, QusType, ASCType) {
			var FinalQuesItems = {
				"items": []
			}, tempQuesItems = "", OrgQuesItems = [];                                                                                                                  //PCR019492++
			//***************Start Of PCR019492: ASC606 UI Changes********
			var tempObj = {};
			if(ASCType === true && QusType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")){
				OrgQuesItems[0] = QuesItems.items[0][0];
				tempQuesItems = {"items": {"0": []}};
				for (var i = 0, m = 0; i < QuesItems.items[0].length; i++) {
					if(i=== 0){
						if (QuesItems.items[0][i].BmoFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
							tempObj.BMOValueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							tempObj.BMOSelected = true;
							tempObj.BMOSelectionIndex = 1;
						} else if (QuesItems.items[0][i].BmoFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
							tempObj.BMOValueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							tempObj.BMOSelected = false;
							tempObj.BMOSelectionIndex = 2;
						} else if (QuesItems.items[0][i].BMOValueState === thisCntrlr.bundle.getText("S2DELNAGVIZTEXT")) {
							tempObj.BMOSelected = QuesItems.items[0][i].BMOSelected;
							tempObj.BMOSelectionIndex = QuesItems.items[0][i].BMOSelectionIndex;
							tempObj.BMOValueState = QuesItems.items[0][i].BMOValueState;
						} else {
							tempObj.BMOSelected = "";
							tempObj.BMOSelectionIndex = 0;
							tempObj.BMOValueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						}
						tempObj.BMOEnabled = BMEnable;
						tempObj.QaVer = QuesItems.items[0][i].QaVer;
						tempObj.enabled = salesEnable;
						tempObj.Ques = QuesItems.items[0][i].Qdesc;
						if (QuesItems.items[0][i].Selected !== undefined) {
							if (QuesItems.items[0][i].Selected === true) {
								tempObj.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
								tempObj.Selected = true;
								tempObj.SelectionIndex = 1;
							} else if (QuesItems.items[0][i].Selected === false) {
								tempObj.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
								tempObj.Selected = false;
								tempObj.SelectionIndex = 2;
							} else {
								tempObj.Selected = "";
								tempObj.SelectionIndex = 0;
								tempObj.valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
							}
						} else {
							if (QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
								tempObj.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
								tempObj.Selected = true;
								tempObj.SelectionIndex = 1;
							} else if (QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
								tempObj.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
								tempObj.Selected = false;
								tempObj.SelectionIndex = 2;
							} else {
								tempObj.Selected = "";
								tempObj.SelectionIndex = 0;
								tempObj.valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
							}
						}
					} else if(i >0){
						tempQuesItems.items[0][m] = QuesItems.items[0][i];
						m++;
					}
				}
				QuesItems.items[0].length = 0;
				QuesItems.items[0] = tempQuesItems.items[0];
			}
			//***************End Of PCR019492: ASC606 UI Changes********
			var CurrentStatus = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText().split(": ")[this.getView()
				.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText().split(": ").length - 1];
			var flagNew = false,
				flagRepeat = false,
				flagRevised = false;
			for (var i = 0, m = 0; i < QuesItems.items[0].length; i++) {
				var temp = {};
				if (QuesItems.items[0][i].BmoFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
					temp.BMOValueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
					temp.BMOSelected = true;
					temp.BMOSelectionIndex = 1;
				} else if (QuesItems.items[0][i].BmoFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
					temp.BMOValueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
					temp.BMOSelected = false;
					temp.BMOSelectionIndex = 2;
				} else if (QuesItems.items[0][i].BMOValueState === thisCntrlr.bundle.getText("S2DELNAGVIZTEXT")) {
					temp.BMOSelected = QuesItems.items[0][i].BMOSelected;
					temp.BMOSelectionIndex = QuesItems.items[0][i].BMOSelectionIndex;
					temp.BMOValueState = QuesItems.items[0][i].BMOValueState;
				} else {
					temp.BMOSelected = "";
					temp.BMOSelectionIndex = 0;
					temp.BMOValueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
				}
				temp.BMOEnabled = BMEnable;
				temp.QaVer = QuesItems.items[0][i].QaVer;
				if (i === 0) {
					flagNew = true;
					temp.Ques = QuesItems.items[0][i].Qdesc;
					if (QuesItems.items[0][i].Selected !== undefined) {
						if (QuesItems.items[0][i].Selected === true) {
							temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							temp.Selected = true;
							temp.SelectionIndex = 1;
						} else if (QuesItems.items[0][i].Selected === false) {
							temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							temp.Selected = false;
							temp.SelectionIndex = 2;
						} else {
							temp.Selected = "";
							temp.SelectionIndex = 0;
							temp.valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						}
					} else {
						if (QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
							temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							temp.Selected = true;
							temp.SelectionIndex = 1;
						} else if (QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
							temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							temp.Selected = false;
							temp.SelectionIndex = 2;
						} else {
							temp.Selected = "";
							temp.SelectionIndex = 0;
							temp.valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						}
					}
					temp.enabled = salesEnable;
					FinalQuesItems.items[m] = temp;
					m++;
				}
				if (i === 1 && QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
					flagNew = true;
					temp.Ques = QuesItems.items[0][i].Qdesc;
					if (QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
						temp.Selected = true;
					} else if (QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
						temp.Selected = false;
					} else {
						temp.Selected = "";
					}
					temp.SelectionIndex = 1;
					temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
					temp.enabled = salesEnable;
					FinalQuesItems.items[m] = temp;
					if (thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().PsrType === thisCntrlr.bundle.getText(
							"S2PSRSDASTATNEW") || thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().PsrType === undefined) {
						if(ASCType === true && QusType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")){                                         //PCR019492++
							FinalQuesItems = this.setASCPSRQusModel(tempObj, FinalQuesItems);                                                      //PCR019492++
							this.resetQusData(OrgQuesItems, QuesItems);                                                                            //PCR019492++
						} 
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
							temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							flagNew = false;
							temp.Selected = false;
							temp.SelectionIndex = 2;
						} else if (QuesItems.items[0][i].Selected === true) {
							temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							flagNew = true;
							temp.Selected = true;
							temp.SelectionIndex = 1;
						} else {
							flagNew = false;
							temp.Selected = "";
							temp.SelectionIndex = 0;
							temp.valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						}
						temp.enabled = salesEnable;
						FinalQuesItems.items[m] = temp;
						if (temp.Selected === true) {
							if(ASCType === true && QusType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")){                                         //PCR019492++
								FinalQuesItems = this.setASCPSRQusModel(tempObj, FinalQuesItems);                                                      //PCR019492++
								this.resetQusData(OrgQuesItems, QuesItems);                                                                            //PCR019492++
							} 
							var TempArr = [FinalQuesItems, flagNew, flagRepeat, flagRevised];
							return TempArr;
						}
						m++;
					} else {
						temp.Ques = QuesItems.items[0][i].Qdesc;
						if (QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
							temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							temp.Selected = false;
							temp.SelectionIndex = 2;
						} else if (QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
							temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							temp.Selected = true;
							temp.SelectionIndex = 1;
						} else {
							temp.Selected = "";
							temp.SelectionIndex = 0;
							temp.valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						}
						temp.enabled = salesEnable;
						FinalQuesItems.items[m] = temp;
						if ((QuesItems.items[0][i - 1].Selected === true || QuesItems.items[0][i - 1].Selected === false) && QuesItems.items[0][i].Selected ===
							undefined) {
							flagNew = false;
							if(ASCType === true && QusType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")){                                         //PCR019492++
								FinalQuesItems = this.setASCPSRQusModel(tempObj, FinalQuesItems);                                                      //PCR019492++
								this.resetQusData(OrgQuesItems, QuesItems);                                                                            //PCR019492++
							} 
							var TempArr = [FinalQuesItems, flagNew, flagRepeat, flagRevised];
							return TempArr;
						} else if (param === thisCntrlr.bundle.getText("S2PSRDETERMINDFTPARAM")) {
							flagNew = true;
							if(ASCType === true && QusType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")){                                         //PCR019492++
								FinalQuesItems = this.setASCPSRQusModel(tempObj, FinalQuesItems);                                                      //PCR019492++
								this.resetQusData(OrgQuesItems, QuesItems);                                                                            //PCR019492++
							}                                                                                                                          //PCR019492++
							var TempArr = [FinalQuesItems, flagNew, flagRepeat, flagRevised];
							return TempArr;
						} else if((ASCType === true && QusType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")) && param === "0"){                   //PCR019492++
						    flagNew = false;                                                                                                           //PCR019492++
							FinalQuesItems = this.setASCPSRQusModel(tempObj, FinalQuesItems);                                                          //PCR019492++
							this.resetQusData(OrgQuesItems, QuesItems);                                                                                //PCR019492++
							var TempArr = [FinalQuesItems, flagNew, flagRepeat, flagRevised];                                                          //PCR019492++
						    return TempArr;                                                                                                            //PCR019492++        
					   }else flagNew = false;
						  m++;
					}
				} else {
					if (i === 1 && QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
						flagNew = false;
						temp.SelectionIndex = 2;
						temp.Ques = QuesItems.items[0][i].Qdesc;
						if (QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
							temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							temp.Selected = true;
						} else if (QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
							temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							temp.Selected = false;
						} else {
							temp.Selected = "";
							temp.valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						}
						temp.enabled = salesEnable;
						FinalQuesItems.items[m] = temp;
						m++;
					}
					if (flagNew === false) {
						if (i === 2 || i === 3 || i === 4 || i === 5) {
							if (QuesItems.items[0][i].Selected !== undefined) {
								if (QuesItems.items[0][i].Selected === true) {
									temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
									temp.Selected = true;
									flagRepeat = true;
									temp.SelectionIndex = 1;
								} else if (QuesItems.items[0][i].Selected === false) {
									temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
									temp.Selected = false;
									flagRevised = true;
									flagRepeat = false;
									temp.SelectionIndex = 2;
								} else {
									temp.valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
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
								if (QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
									temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
									temp.Selected = true;
									flagRepeat = true;
									temp.SelectionIndex = 1;
								} else if (QuesItems.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
									temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
									temp.Selected = false;
									flagRevised = true;
									flagRepeat = false;
									temp.SelectionIndex = 2;
								} else {
									temp.valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
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
			if(ASCType === true && QusType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")){                                                     //PCR019492++
				FinalQuesItems = this.setASCPSRQusModel(tempObj, FinalQuesItems);                                                                  //PCR019492++
				this.resetQusData(OrgQuesItems, QuesItems);                                                                                        //PCR019492++
			}                                                                                                                                      //PCR019492++ 
			var TempArr = [FinalQuesItems, flagNew, flagRepeat, flagRevised];
			return TempArr;
		},
		//***************Start Of PCR019492: ASC606 UI Changes********
		/**
		 * This method Used for Add new ASC606 Question.
		 * 
		 * @name setASCPSRQusModel
		 * @param tempObj: ASC606 additional Question, FinalQuesItems- Final Question Set
		 * @returns 
		 */
		setASCPSRQusModel: function(tempObj, FinalQuesItems){
			var tempQuesItems = {"items": {"0": []}};
			tempQuesItems.items[0][0] = tempObj;
			for(var j = 1, k = 0; k < FinalQuesItems.items.length; k++){
				tempQuesItems.items[0][j] = FinalQuesItems.items[k];
				j++;
			}
			FinalQuesItems.items.length = 0;
			FinalQuesItems.items = tempQuesItems.items[0];
			return FinalQuesItems;
		},
		/**
		 * This method Used for Reset PSR Question Model.
		 * 
		 * @name resetQusData
		 * @param OrgQuesItems: ASC606 additional Question, QuesItems- Rest Question Data
		 * @returns 
		 */
		resetQusData: function(OrgQuesItems, QuesItems){
			var newTempArr = {"items": {"0": []}};
			newTempArr.items[0][0] = OrgQuesItems[0];
			for(var p = 0; p < QuesItems.items[0].length; p++){
			    newTempArr.items[0][p + 1] = QuesItems.items[0][p];}
			QuesItems.items[0].length = 0;
			QuesItems = newTempArr;
			thisCntrlr.MandateData = QuesItems;
		},
		//***************End Of PCR019492: ASC606 UI Changes********
		/**
		 * This method Used for SDA Questions Hide-Show Logic.
		 * 
		 * @name fnConTableModel
		 * @param SDAQuesItems: SDA Question Data, Enabled- Visibility
		 * @returns 
		 */
		fnConTableModel: function(SDAQuesItems, Enabled) {
			var FinalQuesItems = {
				"items": []
			};
			var CurrentStatus = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText()
				.split(": ")[this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText().split(
					": ").length - 1];
			for (var i = 0, m = 0; i < SDAQuesItems[0].length; i++) {
				var temp = {};
				temp.Ques = SDAQuesItems[0][i].Qdesc;
				if (SDAQuesItems[0][i].Selected !== undefined) {
					if (SDAQuesItems[0][i].Selected === true) {
						temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
						temp.Selected = true;
						temp.SelectionIndex = 1;
					} else if (SDAQuesItems[0][i].Selected === false) {
						temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
						temp.Selected = false;
						temp.SelectionIndex = 2;
					} else {
						temp.Selected = "";
						temp.SelectionIndex = 0;
						temp.valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
					}
				} else {
					if (SDAQuesItems[0][i].BmoFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
						temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
						temp.Selected = true;
						temp.SelectionIndex = 1;
					} else if (SDAQuesItems[0][i].BmoFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
						temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
						temp.Selected = false;
						temp.SelectionIndex = 2;
					} else {
						temp.Selected = "";
						temp.SelectionIndex = 0;
						temp.valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
					}
				}
				temp.enabled = Enabled;
				FinalQuesItems.items[m] = temp;
				m++;
			}
			return FinalQuesItems;
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
		/**
		 * This method is used to Handle PSR-SDA Sales and BMO Answers Difference.
		 * 
		 * @name qusDiffCheck
		 * @param ASCType - ASC606 type flag
		 * @returns difference.length - Length Of Different Question Answer's Length.
		 */
		qusDiffCheck: function(ASCType) {                                                                                                      //PCR019492++ added ASCType Param
			var SalesData = [],
				BMOData = [],
				difference = [];
			var TabData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE).getModel()
				.getData().items;
			for (var j = 0; j < TabData.length; j++) {
				var byPassCond = ASCType === true ? (j === 0 || j === 1):(j === 0);                                                              //PCR019492++
//				if (j === 0) {                                                                                                                   //PCR019492--
				if (byPassCond) {                                                                                                                //PCR019492++
					continue;
				}
				var salesObj = {};
				var BmoObj = {};
				salesObj.Selected = TabData[j].Selected;
				BmoObj.Selected = TabData[j].BMOSelected;
				SalesData.push(salesObj);
				BMOData.push(BmoObj);
			}
			BMOData.forEach(function(a, i) {
				Object.keys(a).forEach(function(k) {
					if (a[k] !== SalesData[i][k]) {
						difference.push({
							Selected: SalesData[i].Selected,
							key: k,
							value: SalesData[i][k],
							index: i
						});
					}
				});
			});
			return difference.length;
		},
		/**
		 * This method is used to Handle PSR-SDA Save Button Event.
		 * 
		 * @name onPSRSDADataSave
		 * @param 
		 * @returns 
		 */
		onPSRSDADataSave: function() {
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
				.getText("S2ICONTABPSRSDAKEY")) {
				var obj = this.PSRSDAPayload(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL"))
					.getData().PsrStatus, thisCntrlr.bundle.getText("S2PSRSDASAVETXT"), thisCntrlr.bundle
					.getText("S2PSRSDASUBFORAPP"));
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText("S2PSRSDADATASAVETXT"));
			} else {
				var obj = this.PDCSDAPayload(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
					"GLBPDCSDAMODEL")).getData().PsrStatus, thisCntrlr.bundle.getText("S2PSRSDASAVETXT"), "");
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, "");
			}
			var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL"));
			this.getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
		},
		/**
		 * This method is used For Generating Payload for BSDA Process.
		 * 
		 * @name PDCSDAPayload
		 * @param PsrStatus - Current PSR Status, ActionType - Save or Submit, Message - Submit For Approval Button Text.
		 * @returns obj - Payload Object
		 */
		PDCSDAPayload: function(PsrStatus, ActionType, Message) {
			var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL"));
			var PDCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData();
			var obj = {};
			obj.Guid = OppGenInfoModel.getData().Guid;
			obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
			obj.PsrRequired = PDCData.PsrRequired;
			obj.PsrType = PDCData.PsrType;
			obj.PsrStatus = PsrStatus;
			if (PDCData.Bsdl === thisCntrlr.bundle.getText("S2PSRSDAPDCSSDALVLDEFAULTTXT")) {
				PDCData.Bsdl = "";
			} else if (PDCData.Ssdl === thisCntrlr.bundle.getText("S2PSRSDAPDCSSDALVLDEFAULTTXT")) {
				PDCData.Ssdl = "";
			}
			obj.Ssdl = PDCData.Ssdl;
			obj.Bd = PDCData.Bd;
			obj.Bsdl = PDCData.Bsdl;
			obj.ConComments = PDCData.ConComments;                                                                                                           //PCR019492++ 
			obj.Sd = PDCData.Sd;
			obj.BsdaJustfication = PDCData.BsdaJustfication;
			obj.SsdaJustfication = PDCData.SsdaJustfication;
			obj.SsdaReq = PDCData.SsdaReq;
			obj.RevOpitmId = PDCData.RevOpitmId;
			obj.RevOppId = PDCData.RevOppId;
			obj.CcOppId = thisCntrlr.that_views2.getController().OppId;
			obj.CcOpitmId = thisCntrlr.that_views2.getController().ItemNo;
			obj.Custno = PDCData.Custno;
			(ActionType === thisCntrlr.bundle.getText("S2PSRSDASAVETXT")) ? (obj.ActionType = "") : (obj.ActionType =
				thisCntrlr.bundle.getText("S2CBCSALESUCSSANS"));
			obj.AprvComments = "";
			obj.TaskId = PDCData.TaskId;
			obj.WiId = "";
			obj.PsrStatDesc = "";
			obj.InitiatedBy = "";
			//obj.InitiatedDt = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                                           //PCR035760-- Defect#131 TechUpgrade changes
			obj.Time = thisCntrlr.bundle.getText("S2OPPAPPPAYLODTMEKEY");
			obj.NAV_PDC_QA_SAF = {};
			obj.NAV_PDC_QA_SAF.BmoFlg = PDCData.NAV_PDC_QA_SAF.BmoFlg;
			obj.NAV_PDC_QA_SAF.ChangedBy = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
				"GLBPDCSDAMODEL")).getData().NAV_PDC_QA_SAF.ChangedBy;
			//obj.NAV_PDC_QA_SAF.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                            //PCR035760-- Defect#131 TechUpgrade changes
			obj.NAV_PDC_QA_SAF.Guid = OppGenInfoModel.getData().Guid;
			obj.NAV_PDC_QA_SAF.ItemGuid = OppGenInfoModel.getData().ItemGuid;
			obj.NAV_PDC_QA_SAF.ItemNo = PDCData.NAV_PDC_QA_SAF.ItemNo;
			obj.NAV_PDC_QA_SAF.OppId = PDCData.NAV_PDC_QA_SAF.OppId;
			obj.NAV_PDC_QA_SAF.Qdesc = PDCData.NAV_PDC_QA_SAF.Qdesc;
			obj.NAV_PDC_QA_SAF.Qid = PDCData
				.NAV_PDC_QA_SAF.Qid;
			obj.NAV_PDC_QA_SAF.Qtype = PDCData.NAV_PDC_QA_SAF.Qtype;
			obj.NAV_PDC_QA_SAF.SalesFlg = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
				"GLBPDCSDAMODEL")).getData().NAV_PDC_QA_SAF.SalesFlg;
			obj.NAV_PDC_CC = [];
			if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_TABLE).getModel() !==
				undefined && parseInt(PDCData.PsrStatus) === 605) {
				var PDCCcTabData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_TABLE)
					.getModel().getData().results;
				if (PDCCcTabData.length > 0) {
					for (var i = 0; i < PDCCcTabData.length; i++) {
						var data = {};
						data.Guid = PDCCcTabData[i].Guid;
						data.ItemGuid = PDCCcTabData[i].ItemGuid;
						data.OppId = PDCCcTabData[i].OppId;
						data.ItemNo = PDCCcTabData[i].ItemNo;
						obj.NAV_PDC_CC.push(data)
					}
				}
			}
			return obj;
		},
		/**
		 * This method is used to handles PSR-SDA save Button event.
		 * 
		 * @name onSavePSRSDA
		 * @param
		 * @returns
		 */
		onSavePSRSDA: function() {
			var PsrCheckFlag = true;
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var oView = this.getView();
			if (parseInt(PSRData.PsrStatus) === 5 || parseInt(PSRData.PsrStatus) === 4) {
				var QuesData = {
						"items": []
					},
					PSRTypeTxt = "";
				QuesData.items = [PSRData.NAV_PSR_QA.results];
//				var FinalQuesItems = thisCntrlr.fnDeterminePSRTY(QuesData, thisCntrlr.bundle.getText("S2PSRDETERMINDFTPARAM"), true, false);     //PCR019492--
				var ASCType = PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? true : false;                       //PCR019492++
				if(ASCType === true){                                                                                                            //PCR019492++
					var FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle.getText(                          //PCR019492++
					"S2PSRDETERMINDFTPARAM"), true, false, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType);                              //PCR019492++
				} else {                                                                                                                         //PCR019492++
					var FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle.getText(                          //PCR019492++
					"S2PSRDETERMINDFTPARAM"), true, false);                                                                                      //PCR019492++
				}                                                                                                                                //PCR019492++
				(FinalQuesItems[1] === true) ? (PSRTypeTxt = thisCntrlr.bundle.getText("S2PSRSDASTATNEW")) : ((FinalQuesItems[1] === false && (
					FinalQuesItems[2] === false && FinalQuesItems[3] === false)) ? (PSRTypeTxt = "") : ((FinalQuesItems[3] === true) ? (PSRTypeTxt =
					thisCntrlr.bundle.getText("S2PSRSDASTATREVISED")) : ((FinalQuesItems[2] === true) ? (PSRTypeTxt = thisCntrlr.bundle.getText(
					"S2PSRSDASTATREPEAT")) : (PSRTypeTxt = ""))));
				(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText() === PSRTypeTxt) ? (PsrCheckFlag =
					true) : (PsrCheckFlag = false);
				if(ASCType === false){
					(QuesData.items[0][1].SalesFlg === thisCntrlr.bundle.getText("S2POSMANDATANS") && oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT)
							.getText() !== thisCntrlr.bundle.getText("S2PSRSDASTATNEW")) ? (PsrCheckFlag = false) : ("");
				}				
			}
			if (PsrCheckFlag === false) {
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDAWNGQUSANSFAILMSG"));
			} else if (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText() === "") {
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDASPECDETNFAILMSG"));
			} else {
				(parseInt(PSRData.PsrStatus) === 4 || parseInt(PSRData.PsrStatus) === 5 || parseInt(PSRData.PsrStatus) === 15 || parseInt(PSRData.PsrStatus) >= 17 
					|| parseInt(PSRData.PsrStatus) >= 65) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle                   //PCR019492++
					.getText("S2PSRSDASUBFORAPP"))) : ("");
				var RRAReqFlag = false;                                                                                                                                 //PCR019492++
				if(PSRData.Asc606_BsdaFlag === this.getResourceBundle().getText("S2ODATAPOSVAL") &&((parseInt(PSRData.PsrStatus) === 15 && thisCntrlr.getView()         //PCR019492++
					.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText() ===  thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT"))||                    //PCR019492++
					parseInt(PSRData.PsrStatus) === 17 || parseInt(PSRData.PsrStatus) === 25)){                                                                         //PCR019492++
					var RRAQuesData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).getModel().getData();                                           //PCR019492++
					for(var p = 0; p < RRAQuesData.results.length ; p++){                                                                                               //PCR019492++
						if(RRAQuesData.results[p].valueState === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")){                                                      //PCR019492++
							RRAReqFlag = true;                                                                                                                          //PCR019492++
							break;                                                                                                                                      //PCR019492++
						}                                                                                                                                               //PCR019492++
					}                                                                                                                                                   //PCR019492++
			    }                                                                                                                                                       //PCR019492++
				if(RRAReqFlag === true){                                                                                                                                //PCR019492++
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRPDCSDABSSDARRAQUSMSGASC606"));                                                          //PCR019492++
				} else {                                                                                                                                                //PCR019492++
					var myBusyDialog = this.getBusyDialog();
					if (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).getText() === thisCntrlr.bundle
						.getText("S2PSRSDASUBFORAPP")) {
						var ContCheck = this.validatePSRContact();
						var ASCType = PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? true : false;                                            //PCR019492++
//						var quschek = this.qusDiffCheck();                                                                                                              //PCR019492--
						var quschek = this.qusDiffCheck(ASCType);                                                                                                       //PCR019492++
						this.fnSetVisibility(thisCntrlr.bundle.getText("S2POSMANDATANS"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.bundle
							.getText("S2PSRSDAEDITICON"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.bundle
							.getText("S2PSRSDAEDITBTNTXT"));
						var ErrorFlag = this.ValidateData();
						(ErrorFlag === true) ? (myBusyDialog.open(), this.onPSRSDADataSave(), myBusyDialog.close(), oView
							.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false), that_views2.byId(com.amat
								.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setVisible(true), thisCntrlr.showToastMessage(thisCntrlr.bundle
								.getText("S2PSRSDACBCSFAFAILWDSAVEMSG"))) : (
							myBusyDialog.open(), this.onPSRSDADataSave(), myBusyDialog.close(),
							(parseInt(PSRData.PsrStatus) === 5 || parseInt(PSRData.PsrStatus) === 4 ||
								parseInt(PSRData.PsrStatus) === 65) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(
									true), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true),
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setEnabled(false), oView
								.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setEnabled(false), (parseInt(PSRData.PsrStatus) === 4 ||
									parseInt(
										PSRData.PsrStatus) === 5) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(thisCntrlr.bundle
										.getText("S2PSRSDAWFICON")), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn)
									.setText(thisCntrlr.bundle.getText("S2PSRSDASUBFORAPP"))) : ("")) : (that_views2.byId(
									com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(true), that_views2.byId(com.amat.crm.opportunity
									.Ids.S2FTER_BTN_RJCT).setVisible(true), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn)
								.setVisible(false), (parseInt(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
									"GLBPSRMODEL")).getData().PsrStatus) === 15) ? ((ContCheck[0] === true && quschek !== 0) ? (
									that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false), that_views2
									.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(true)) : ((ContCheck[0] ===
									true) ? ((PSRData.Asc606_BsdaFlag === "" || (PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") &&     //PCR019492++
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText() !== thisCntrlr.bundle     //PCR019492++
										.getText("S2PSRSDASTATREPEAT")))?(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(           //PCR019492++
										true), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(
										true), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(
										thisCntrlr.bundle.getText("S2PSRSDAWFICON")), oView.byId(com.amat.crm.opportunity
										.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle.getText(
										"S2PSRSDASFCONSPECTPEANDREWTXT")), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR)
									.setEnabled(false), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(
										false)):((PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") && thisCntrlr.getView().byId(com       //PCR019492++
										 .amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText() === thisCntrlr.bundle.getText(                         //PCR019492++
										"S2PSRSDASTATREPEAT"))?(that_views2.byId( com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(true),               //PCR019492++
										 that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(true), oView.byId(com.amat.crm               //PCR019492++
										 .opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false)):(""))) : /*(thisCntrlr.showToastMessage(thisCntrlr.bundle.getText(  //PCR019492++
									"S2PSRSDACBCSFACONVLIDMSG") + " " + ContCheck[1]))))*/ 
											 (thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRCONTACTS")))))                                        //PCR028711++; modify contacts message
											: ((parseInt(thisCntrlr.getModelFromCore(
									thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().PsrStatus) >= 17) ? (that_views2.byId(
									com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(true), that_views2.byId(com.amat.crm
									.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(true)) : (""))))
						var ASCType = PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? true : false;                                    //PCR019492++
						var FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle.getText(
							"S2PSRDETERMINDFTPARAM"), false, false, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType);                                    //PCR019492++
						var cModel1 = this.getJSONModel(FinalQuesItems[0]);
						var oTableItems1 = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE);
						var oItemTemplate1 = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DETERMINE_Sys_SpecTYPE_TEMPLATE);
						oTableItems1.setModel(cModel1);
						var FinalSDAQus = [{
							"items": []
						}];
						FinalSDAQus.items = this.validatSDAQues(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
							"GLBSDAQESMODEL")).getData());
						var oSDATableItems = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_TABLE);
						var oSDAItemTemplate = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_TEMPLATE);
						var FinalSDAQuesItems = thisCntrlr.fnConTableModel(FinalSDAQus.items.items, false);
						var cModel = this.getJSONModel(FinalSDAQuesItems);
						oSDATableItems.setModel(cModel);
						var FPSRDocData = PSRData.NAV_FNL_DOCS.results;
						var FPSRDoc = this.loadFPSRevDocData(FPSRDocData, false, false);
						var oFPSRDocJModel = this.getJSONModel({
							"ItemSet": FPSRDoc
						});
						var oFPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_TABLE);
						oFPSRDocTable.setModel(oFPSRDocJModel);
						(parseInt(PSRData.PsrStatus) === 65) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle
							.getText("S2PSRSDASUBFORAPP"), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn)
							.setIcon(thisCntrlr.bundle.getText("S2PSRSDAWFICON")))) : ("");
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);
					} else if (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).getText() === thisCntrlr.bundle
						.getText("S2PSRSDASFCONSPECTPEANDREWTXT")) {
						if (parseInt(PSRData.PsrStatus) === 15) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setEnabled(false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.bundle
								.getText("S2PSRSDAEDITICON"));
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.bundle
								.getText("S2PSRSDAEDITBTNTXT"));
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);						
						}
					} else {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.bundle
							.getText("S2PSRSDAEDITICON"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.bundle
							.getText("S2PSRSDAEDITBTNTXT"));
						if (parseInt(PSRData.PsrStatus) === 60) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
								false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setExpanded(false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox).setVisible(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CONTACTINFO_PANEL).setVisible(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLEFORM_DISPLAY_360).setVisible(
								true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecTYPE_PANEL).setVisible(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLEFORM_DISPLAY_370).setVisible(
								true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
								true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setVisible(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_B_APPROVALS_PANEL).setVisible(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL).setVisible(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FORM_DISPLAY_300).setVisible(false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_BAR).setText(thisCntrlr.bundle
								.getText("S2PSRBARSTATUSHEADER") + " Completed");
							that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).removeStyleClass(thisCntrlr.bundle.getText(
								"S2PSRSDAINITCLS"));
							that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).removeStyleClass(thisCntrlr.bundle.getText(
								"S2PSRSDADFTCLS"));
							that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Positive);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(false);
						} else if (parseInt(PSRData.PsrStatus) >= 65) {
							this.onPSRSDADataSave();
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(thisCntrlr.bundle
									.getText("S2PSRSDAWFICON"));
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle
								.getText("S2PSRSDASUBFORAPP"));
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setEnabled(false);
						}
					}
				}				
			}                                                                                                                                                  //PCR019492++
			(parseInt(PSRData.PsrStatus) === 5 || parseInt(PSRData.PsrStatus) === 4) && (PSRData.RevOppId !== "" && PSRData.RevOpitmId === "") ?               //PCR021481++
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(true) : oView.byId(com.amat.crm.opportunity.     //PCR021481++
							Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(false);                                                                      //PCR021481++
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(false);
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
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var ConFlag = [];
			if (this.that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
				.getText("S2ICONTABPSRSDAKEY")) {
				if (parseInt(PSRData.PsrStatus) === 4 || parseInt(PSRData.PsrStatus) === 5) {
					if (GenInfoModel.NAV_ROM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2GINFOPANLCONINFOROMTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_SALES_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2PSRWFAPPPANLSALESINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_ASM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2GINFOPANLCONINFOACCSMETIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_BMO_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2PSRWFAPPPANLBMOINFOCONTIT")];
						return ConFlag;
					}
				} else {
					if (GenInfoModel.NAV_GPM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2PSRWFAPPPANLGPMINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_TPS_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2PSRWFAPPPANLTPSINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_BMHEAD_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2PSRWFAPPPANLBMHDINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_CON_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2GINFOPANLCONINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_KPU_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2GINFOPANLCONINFOBLHEADTIT")];
						return ConFlag;
					}
				}
			} else {
				if (parseInt(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().PsrStatus) >=
					605) {
					if (GenInfoModel.NAV_ROM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2GINFOPANLCONINFOROMTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_SALES_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2PSRWFAPPPANLSALESINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_BMO_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2PSRWFAPPPANLBMOINFOCONTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_POM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2GINFOPANLCONINFOPOMTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_GSM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2GSMKEY")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_RBM_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2RBMKEY")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_KPU_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2GINFOPANLCONINFOBLHEADTIT")];
						return ConFlag;
					}
					if (GenInfoModel.NAV_CON_INFO.results.length > 0) ConFlag = [true, ""];
					else {
						ConFlag = [false, thisCntrlr.bundle.getText("S2GINFOPANLCONINFOCONTIT")];
						return ConFlag;
					}
				}
			}
			return ConFlag;
		},
		/**
		 * This method is used to Validate Contact list in Different Level of PSR-SDA.
		 * 
		 * @name validatePSRSBFA
		 * @param
		 * @returns validateRes - Array with Security Object Permission and Message.
		 */
		validatePSRSBFA: function() {
			var SecurityData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBSECURITYMODEL")).getData();
			var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var validateRes = [],
				SendApprRight = false,
				Msg = "",
				RomFlag = "",
				salesFlag = "",
				ContactFlag = "";
			(SecurityData.SendApproval === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (SendApprRight =
				true, Msg = "") : (SendApprRight = false, Msg = thisCntrlr.bundle.getText(
				"S2USERALLAUTHFALTTXT"));
			var romUserList = GenInfoData.NAV_ROM_INFO.results;
			var salesUserList = GenInfoData.NAV_SALES_INFO.results;
			if (parseInt(PSRData.PsrStatus) === 5 || parseInt(PSRData.PsrStatus) === 4) {
				RomFlag = this.checkContact(romUserList);
				salesFlag = this.checkContact(salesUserList);
			}
			ContactFlag = this.validatePSRContact();
			if (SendApprRight === false) {
				validateRes = [SendApprRight, Msg];
				return validateRes;
			}
			if (RomFlag === false && salesFlag === false) {
				Msg = thisCntrlr.bundle.getText("S2PSRSDACBCROMSALEVALDFAILMSG");
				validateRes = [RomFlag, Msg];
				return validateRes;
			}
			if (ContactFlag[0] === false) {
				//Msg = thisCntrlr.bundle.getText("S2PSRSDACBCSFACONVLIDMSG") + " " + ContactFlag[1];                                                          //PCR028711--; modify contacts message
				Msg = thisCntrlr.bundle.getText("S2PSRCONTACTS");                                                                                              //PCR028711++; modify contacts message
				validateRes = [ContactFlag[0], Msg];
				return validateRes;
			}
			(SendApprRight === true && RomFlag === true && ContactFlag[0] === true) ? (validateRes = [true, thisCntrlr.bundle
				.getText("S2PSRSDACBCSFACONFLAGMSG")
			]) : ("");
			return validateRes;
		},
		/**
		 * This method Validating Submit and Approve Button Requirements.
		 * 
		 * @name ValidateData
		 * @param 
		 * @returns ErrorFlag - Binary Flag
		 */
		ValidateData: function() {
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setVisible(true);
			var PSRQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE)
				.getModel().getData();
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var SDAQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_TABLE).getModel()
				.getData();
			var SAFQusData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().NAV_SAF_QA
				.SalesFlg;
			var CustSpecData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_TABLE)
				.getModel().getData();
			var RefSpecData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE).getModel()
				.getData();
			var FnlSpecData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_TABLE).getModel()
				.getData();
			var counter = 1,
				ErrorFlag = false;
			var oMessageTemplate = new sap.m.MessagePopoverItem({
				type: '{type}',
				title: '{title}',
				description: '{description}',
				subtitle: '{subtitle}',
				counter: '{counter}'
			});
			if (!(this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MESSAGE_POPOVER))) {
				thisCntrlr.oMessagePopover = new sap.m.MessagePopover({
					id: this.createId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MESSAGE_POPOVER),
					items: {
						path: '/',
						template: oMessageTemplate
					}
				});
			}
			var aMockMessages = [];
			if (parseInt(PSRData.PsrStatus) === 4 || parseInt(PSRData.PsrStatus) === 5) {
				if (PSRData.NAV_SAF_QA.SalesFlg === "" && SAFQusData === "") {
					var temp = {};
					temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
					temp.title = thisCntrlr.bundle.getText("S2PSRSDASAFQUESFAILMSG");
					temp.description = thisCntrlr.bundle.getText("S2PSRSDASAFQUESFAILMSGDIS");
					temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = thisCntrlr.bundle.getText("S2PSRSDASAFCHECKSUCSSMSG");
					temp.description = thisCntrlr.bundle.getText("S2PSRSDASAFCHECKSUCSSMSGDIS");
					temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
				if (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText() ===
					thisCntrlr.bundle.getText("S2PSRSDASTATNEW") || thisCntrlr.getView().byId(com.amat.crm.opportunity
						.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText() === thisCntrlr.bundle.getText(
						"S2PSRSDASTATREVISED")) {
					var Rev1SpecFlag = false;
					for (var i = 0; i < CustSpecData.ItemSet.length; i++) {
						if (CustSpecData.ItemSet[i].filename !== "") {
							Rev1SpecFlag = true;
						}
					}
					if (Rev1SpecFlag === false) {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDACUSTINFOFAILMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDACUSTINFOFAILMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDACUSTINFOPOSMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDACUSTINFOFAILMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
					}
				} else if (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText() ===
					thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT")) {
					var RefSpecFlag = false;
					for (var i = 0; i < RefSpecData.ItemSet.length; i++) {
						if (RefSpecData.ItemSet[i].filename !== "") {
							RefSpecFlag = true;
						}
					}
					if (RefSpecFlag === false) {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDAREFSPECFAILMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDAREFSPECFAILMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDAREFSPECPOSMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDAREFSPECFAILMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
					}
				}
				for (var i = 0; i < PSRQusData.items.length; i++) {
					var temp = {};
					if (PSRQusData.items[i].valueState === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
						temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDASLESNEGANSMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSG") + " " + (i + 1) +
							" " + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else if (PSRQusData.items[i].valueState === thisCntrlr.bundle.getText("S2DELNAGVIZTEXT")) {
						temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGDIS");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDABMOSUCSSANSMSGDIS") + " " + (i + 1) +
							' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
					}
				}
			} else if (parseInt(PSRData.PsrStatus) === 15) {
				var temp = {};
				var PSRQusLen;
				if (thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().PsrType ===
					thisCntrlr.bundle.getText("S2PSRSDASTATNEW") || thisCntrlr.getView().byId("idPSRStatusTxt").getText() === thisCntrlr.bundle.getText(
						"S2PSRSDASTATNEW")) {
					PSRQusLen = 2;
				} else {
					if(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
						PSRQusLen = 7;
					} else {
						PSRQusLen = 6;
					}
				}
				for (var i = 0; i < PSRQusLen; i++) {
					var temp = {};
					if (PSRQusData.items[i].BMOValueState === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
						temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDABMOERRORANSMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSG") + ' ' + (i + 1) +
							' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else if (PSRQusData.items[i].BMOValueState === thisCntrlr.bundle.getText("S2DELNAGVIZTEXT")) {
						temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGDIS");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDABMOSUCSSANSMSGDIS") + ' ' + (i + 1) +
							' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
					}
				}
				if(PSRData.Asc606_BsdaFlag !== thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                                                                          //PCR019492++
				 for (var i = 0; i < SDAQusData.items.length; i++) {
					var temp = {};
					if (SDAQusData.items[i].valueState === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")) {
						temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDABMOFAILANSMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDABMOFAILANSMSGDIS") + ' ' + (i + 1) +
							' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else if (SDAQusData.items[i].valueState === thisCntrlr.bundle.getText("S2DELNAGVIZTEXT")) {
						temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDABMOPOSIANSMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDABMOPOSIANSMSGDIS") + ' ' + ' ' + (i +
							1) + ' ' + thisCntrlr.bundle.getText("S2PSRSDASLESSUCSSANSMSGPART2");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
					}
				 }
			  //**************Start Of PCR019492: ASC606 UI Changes************************
			  } else if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") && PSRData.PsrType ===
					thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT")){
				  var RRAQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).getModel().getData();
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
							if(RRAQusData.results[i].Comments === ""  || RRAQusData.results[i].Comments.trim() === ""){
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
							if(RRAQusData.results[i].Comments === ""  || RRAQusData.results[i].Comments.trim() === ""){
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
				  if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() ===
						thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP")) {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELNEGMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELNEGMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELPOSMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELPOSMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
					}
				  if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).getValue() ===
					"") {
					var temp = {};
					temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
					temp.title = thisCntrlr.bundle.getText("S2PSRSDASSJUSTFAILMSG");
					temp.description = thisCntrlr.bundle.getText("S2PSRSDASSJUSTFAILMSGDIS");
					temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = thisCntrlr.bundle.getText("S2PSRSDASSJUSTSUCSSMSG");
					temp.description = thisCntrlr.bundle.getText("S2PSRSDASSJUSTFAILMSGDIS");
					temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
			  }  
			 //**************End Of PCR019492: ASC606 UI Changes************************
			} else if (parseInt(PSRData.PsrStatus) === 17) {
				//**************Start Of PCR019492: ASC606 UI Changes************************
				if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
					var RRAQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).getModel().getData();
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
								if(RRAQusData.results[i].Comments === ""  || RRAQusData.results[i].Comments.trim() === ""){
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
				//**************End Of PCR019492: ASC606 UI Changes************************
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() ===
					thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP")) {
					var temp = {};
					temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
					temp.title = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELNEGMSG");
					temp.description = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELNEGMSGDIS");
					temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELPOSMSG");
					temp.description = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELPOSMSGDIS");
					temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
				if ((this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() ===
					thisCntrlr.bundle.getText("S2BSDASSMENTLVL1") || this.getView().byId(com.amat.crm.opportunity
						.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() === thisCntrlr.bundle.getText(
						"S2BSDASSMENTLVL2")) && PSRData.Asc606_BsdaFlag !== thisCntrlr.bundle.getText("S2ODATAPOSVAL")) {            //PCR019492++             
					var BSDAEFlag = false;
					var EBSDAPSRData = PSRData.NAV_BSDA_EVDOC.results;
					for (var i = 0; i < EBSDAPSRData.length; i++) {
						if (EBSDAPSRData[i].FileName !== "") {
							BSDAEFlag = true;
						}
					}
					if (BSDAEFlag === false) {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDASSeVIDANCERRORMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDASSEVIDANCERRORMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDASSEVIDANCSUCSSMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDASSEVIDANCERRORMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
					}
				}
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).getValue() ===
					"") {
					var temp = {};
					temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
					temp.title = thisCntrlr.bundle.getText("S2PSRSDASSJUSTFAILMSG");
					temp.description = thisCntrlr.bundle.getText("S2PSRSDASSJUSTFAILMSGDIS");
					temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = thisCntrlr.bundle.getText("S2PSRSDASSJUSTSUCSSMSG");
					temp.description = thisCntrlr.bundle.getText("S2PSRSDASSJUSTFAILMSGDIS");
					temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
				if (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText() !==
					thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT")) {
					var FnlSpecFlag = false;
					for (var i = 0; i < FnlSpecData.ItemSet.length; i++) {
						if (FnlSpecData.ItemSet[i].filename !== "") {
							FnlSpecFlag = true;
						}
					}
					if (FnlSpecFlag === false) {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDAFNALSPECFAILMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDACUSTINFOFAILMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDAFNALSPECSUCSSMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDACUSTINFOFAILMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
					}
				}
			//**************Start Of PCR019492: ASC606 UI Changes************************
			} else if (parseInt(PSRData.PsrStatus) === 25) {
				var RRAQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).getModel().getData(), rraOldDeffFlag = false;
				RRAQusData.results[RRAQusData.results.length-1].SelectionIndex > 0 ? (PSRData.BmoRraValBsda !== this.getView().byId(com.amat.crm.opportunity.Ids
					.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() && PSRData.Bsdl !== "" ? ( this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE)
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
				if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){					
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
				    if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() ===
						thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP")) {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELNEGMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELNEGMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELPOSMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELPOSMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
					}
				//**************End Of PCR019492: ASC606 UI Changes************************
			}else if (parseInt(PSRData.PsrStatus) === 65) {
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() ===
					thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP")) {
					var temp = {};
					temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
					temp.title = thisCntrlr.bundle.getText("S2PSRSSDASSMTNEGMSG");
					temp.description = thisCntrlr.bundle.getText("S2PSRSSDASSMTNEGMSGDIS");
					temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				}
				if ((this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() ===
					thisCntrlr.bundle.getText("S2BSDASSMENTLVL1") || this.getView().byId(com.amat.crm.opportunity
						.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() === thisCntrlr.bundle.getText(
						"S2BSDASSMENTLVL2")) && PSRData.Asc606_SsdaFlag !== thisCntrlr.bundle.getText("S2ODATAPOSVAL")) {              //PCR019492++      
					var SSDAEFlag = false;
					var ESSDAPSRData = PSRData.NAV_SSDA_EVDOC.results;
					for (var i = 0; i < ESSDAPSRData.length; i++) {
						if (ESSDAPSRData[i].FileName !== "") {
							SSDAEFlag = true;
						}
					}
					if (SSDAEFlag === false) {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDASSeVIDANCERRORMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDASSEVIDANCERRORMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else {
						var temp = {};
						temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
						temp.title = thisCntrlr.bundle.getText("S2PSRSDASSEVIDANCSUCSSMSG");
						temp.description = thisCntrlr.bundle.getText("S2PSRSDASSEVIDANCERRORMSGDIS");
						temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
						temp.counter = counter;
						aMockMessages.push(temp);
						counter++;
					}
				}
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_TEXT_AREA).getValue() ===
					"") {
					var temp = {};
					temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
					temp.title = thisCntrlr.bundle.getText("S2PSRSDASSJUSTFAILMSG");
					temp.description = thisCntrlr.bundle.getText("S2PSRSDASSJUSTFAILMSGDIS");
					temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = thisCntrlr.bundle.getText("S2PSRSDASSJUSTSUCSSMSG");
					temp.description = thisCntrlr.bundle.getText("S2PSRSDASSJUSTFAILMSGDIS");
					temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
				//**************Start Of PCR019492: ASC606 UI Changes************************
			} else if (parseInt(PSRData.PsrStatus) === 70) {
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() ===
					thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP")) {
					var temp = {};
					temp.type = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
					temp.title = thisCntrlr.bundle.getText("S2PSRSSDASSMTNEGMSG");
					temp.description = thisCntrlr.bundle.getText("S2PSRSSDASSMTNEGMSGDIS");
					temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESFAILMSGDIS");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
					ErrorFlag = true;
				} else {
					var temp = {};
					temp.type = thisCntrlr.bundle.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
					temp.title = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELPOSMSG");
					temp.description = thisCntrlr.bundle.getText("S2PSRSDASSESSLEVELPOSMSGDIS");
					temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
					temp.counter = counter;
					aMockMessages.push(temp);
					counter++;
				}
			}
			//**************End Of PCR019492: ASC606 UI Changes************************
			if (ErrorFlag === false) {
				var temp = {};
				temp.type = thisCntrlr.bundle.getText("S2PSRSDAMSGTYPINFO");
				temp.title = thisCntrlr.bundle.getText("S2PSRSDATYPINFOMSGDIS");
				temp.description = thisCntrlr.bundle.getText("S2PSRSDATYPINFOMSGDIS");
				temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDAMSGTYPINFORMATION");
				temp.counter = counter;
				aMockMessages.push(temp);
				counter++;
			} else {
				var temp = {};
				temp.type = thisCntrlr.bundle.getText("S2PSRSDAMSGTYPINFO");
				temp.title = thisCntrlr.bundle.getText("S2PSRSDACBCSFAFAILMSG");
				temp.description = thisCntrlr.bundle.getText("S2PSRSDACBCSFAFAILMSG");
				temp.subtitle = thisCntrlr.bundle.getText("S2PSRSDAMSGTYPINFORMATION");
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
		 * This method is used For Submit For Approval Button Event.
		 * 
		 * @name onSubmitPSRSDA
		 * @param 
		 * @returns 
		 */
		onSubmitPSRSDA: function() {
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			var PSRInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData();
			var oView = this.getView();
			if (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).getText() === thisCntrlr.bundle
				.getText("S2PSRSDASUBFORAPP")) {
				var validate = this.validatePSRSBFA();
				if (validate[0] === false) {
					thisCntrlr.showToastMessage(validate[1]);
				} else {
					if (parseInt(PSRData.PsrStatus) < 60) {
						var ErrorFlag = this.ValidateData();
						if (ErrorFlag === true) {
							thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCSFAFAILMSG"));
						} else {
							var SendFAppAuth = (thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
								"GLBSECURITYMODEL")).getData().SendApproval === thisCntrlr.bundle.getText(
								"S2ODATAPOSVAL")) ? (true) : (false);
							if (SendFAppAuth === false) {
								thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2CBCAUTHNEGATXT"));
							} else {
								var myBusyDialog = thisCntrlr.getBusyDialog();
								myBusyDialog.open();
								var obj = this.PSRSDAPayload(PSRData.PsrStatus, thisCntrlr.bundle.getText(
									"S2PSRSDACBCSFASUBTYPEMSG"), thisCntrlr.bundle.getText("S2PSRSDASUBFORAPP"));
								this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat
									.crm.opportunity.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText(
										"S2PSRSDACBCSFASUBMITSUCSSMSG"));
								this.getRefreshPSRData(OppGenInfoModel.Guid, OppGenInfoModel.ItemGuid);
								myBusyDialog.close();
								that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor
									.Critical);
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setEnabled(true);
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
								that_views2.getController().onNavBack();                                                                              //PCR019492++
							}
						}
					} else if (parseInt(PSRData.PsrStatus) >= 65) {
						var SendFAppAuth = (thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBSECURITYMODEL"))
							.getData().SendApproval === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (true) : (
							false);
						if (SendFAppAuth === false) {
							thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2CBCAUTHNEGATXT"));
						} else {
							var ErrorFlag = this.ValidateData();
							if (ErrorFlag === true) {
								thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCSFAFAILMSG"));
							} else {
								if (PSRData.Bsdl.concat(PSRData.Bd) === PSRData.Ssdl.concat(PSRData.Sd)) {
//									thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRPDCSDABSSDAROUTFAILMSG"));                            //PCR019492--
									if(PSRData.Asc606_SsdaFlag === ""){                                                                               //PCR019492++
										thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRPDCSDABSSDAROUTFAILMSG"));                        //PCR019492++
									}else if(PSRData.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                                 //PCR019492++
										thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRPDCSDABSSDAROUTFAILMSGASC606"));                  //PCR019492++
									}									                                                                              //PCR019492++
								} else {
									var myBusyDialog = thisCntrlr.getBusyDialog();
									myBusyDialog.open();
									var obj = {};
									obj.NAV_SAF_QA = {};
									obj.NAV_SAF_QA.Guid = OppGenInfoModel.Guid;
									obj.NAV_SAF_QA.ItemGuid = OppGenInfoModel.ItemGuid;
									obj.NAV_SAF_QA.Qtype = thisCntrlr.bundle.getText("S2PSRSAFQUSKEY");
									obj.NAV_SAF_QA.Qid = thisCntrlr.bundle.getText("S2PSRSAFQUSTXT");
									obj.NAV_SAF_QA.Qdesc = "";
									obj.NAV_SAF_QA.QaVer = PSRData.NAV_SAF_QA.QaVer;                                                                    //PCR019492++
									obj.NAV_SAF_QA.OppId = PSRInfoData.OppId;
									obj.NAV_SAF_QA.ItemNo = PSRInfoData.ItemNo;
									obj.NAV_SAF_QA.SalesFlg = PSRData.NAV_SAF_QA.SalesFlg;
									obj.NAV_SAF_QA.BmoFlg = "";
									obj.NAV_SAF_QA.ChangedBy = "";
									//obj.NAV_SAF_QA.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                  //PCR035760-- Defect#131 TechUpgrade changes
									obj.Guid = OppGenInfoModel.Guid;
									obj.ItemGuid = OppGenInfoModel.ItemGuid;
									obj.PsrRequired = PSRData.PsrRequired;
									obj.PsrType = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText();
									obj.PsrStatus = "65";
									obj.ConComments = PSRData.ConComments;                                                                             //PCR019492++  
									obj.Bsdl = PSRData.Bsdl;
									obj.Ssdl = PSRData.Ssdl;
									obj.Bd = PSRData.Bd;
									obj.Sd = PSRData.Sd;
									obj.SsdaJustfication = PSRData.SsdaJustfication;
									obj.BsdaJustfication = PSRData.BsdaJustfication;
									obj.SsdaReq = PSRData.SsdaReq;
									obj.RevOpitmId = PSRData.RevOpitmId;
									obj.RevOppId = PSRData.RevOppId;
									obj.Custno = PSRData.Custno;
									obj.ActionType = thisCntrlr.bundle.getText("S2CBCSALESUCSSANS");
									obj.TaskId = "";
									obj.AprvComments = "";
									obj.WiId = "";
									obj.PsrStatDesc = "";
									obj.InitiatedBy = "";
									//obj.InitiatedDt = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                           //PCR035760-- Defect#131 TechUpgrade changes
									obj.Time = thisCntrlr.bundle.getText("S2OPPAPPPAYLODTMEKEY");
									this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat
										.crm.opportunity.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText(
											"S2PSRSDACBCSFASUBMITSUCSSMSG"));
									this.getRefreshPSRData(OppGenInfoModel.Guid, OppGenInfoModel.ItemGuid);
									myBusyDialog.close();
									that_views2.getController().onNavBack();                                                                         //PCR019492++
								}
							}
							that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor
								.Critical);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setEnabled(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
						}
					}
				}
			} else if (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).getText() === thisCntrlr.bundle
				.getText("S2PSRSDASFCANINITXT")) {
				var romUserList = OppGenInfoModel.NAV_ROM_INFO.results;
				var romInitiateFlag = this.checkContact(romUserList);
				if (romInitiateFlag === false) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCAUTHCHECKFAILMSG"));
				} else {
					//***************Start Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
					var Mesg = thisCntrlr.bundle.getText("S2CANINITMSG1") + thisCntrlr.bundle.getText("S2PSRRRACANINITMSG2");
					sap.m.MessageBox.confirm(Mesg, this.confirmationPSRCanInit, thisCntrlr.bundle.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
					//var myBusyDialog = thisCntrlr.getBusyDialog();
					//myBusyDialog.open();
					//var obj = {};
					//obj.Guid = OppGenInfoModel.Guid;
					//obj.ItemGuid = OppGenInfoModel.ItemGuid;
					//obj.PsrRequired = "";
					//obj.PsrType = "";
					//obj.PsrStatus = "";
					//obj.Bsdl = "";
					//obj.ConComments = PSRData.ConComments;                                                                                                        //PCR019492++  
					//obj.Ssdl = "";
					//obj.SsdaJustfication = PSRData.SsdaJustfication;
					//obj.BsdaJustfication = PSRData.BsdaJustfication;
					//obj.Bd = "";
					//obj.Sd = "";
					//obj.AprvComments = "";
					//obj.ActionType = "";
					//obj.TaskId = "";
					//obj.WiId = "";
					//obj.PsrStatDesc = "";
					//obj.InitiatedBy = "";
					//obj.InitiatedDt = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");
					//obj.Time = thisCntrlr.bundle.getText("S2OPPAPPPAYLODTMEKEY");
					//this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat.crm.opportunity
					//	.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText("S2PSRSDACONINITSUCSSTXT"));
					//this.fnSetVisibility("");
					//this.getRefreshPSRData(OppGenInfoModel.Guid, OppGenInfoModel.ItemGuid);
					//myBusyDialog.close();
					//that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Default);
					//that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setText(thisCntrlr.bundle.getText("S2PSRSDAICONTABFTEXTASC606"));            //PCR020999++
					//oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).setText("");
					//oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(
					//	false);
					//***************End Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
				}
			} else if (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).getText() === thisCntrlr.bundle
				.getText("S2PSRSDASFCONSPECTPEANDREWTXT")) {
				var bomUserList = OppGenInfoModel.NAV_BMO_INFO.results;
				var bomInitiateFlag = this.checkContact(bomUserList);
				if (bomInitiateFlag === false) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACONCHECKFAILMSG"));
				} else {
					var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
					var obj = this.getCSTAnRPaylod();
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText("S2PSRSDACONFSPECNREVEWSUCSSTXT"));
					this.getRefreshPSRData(OppGenInfoModel.Guid, OppGenInfoModel.ItemGuid);
					myBusyDialog.close();
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(thisCntrlr.bundle
						.getText("S2PSRSDAWFICON"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle
						.getText("S2PSRSDASUBFORAPP"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
					if (PSRData.PsrType !==
						thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT")) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(true);
					} else {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
					}
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);
				}
			} else if (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).getText() === thisCntrlr.bundle.getText("S2PSRSDASFCONSSDAINITTXT")
					|| oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).getText() === thisCntrlr.bundle.getText("S2PSRSDASFCONSSDAINITTXTASC606")) {   //PCR019492++
				var bomUserList = OppGenInfoModel.NAV_BMO_INFO.results;
				var bomInitiateFlag = this.checkContact(bomUserList);
				if (bomInitiateFlag === false) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACONCHECKFAILMSG"));
				} else {
					var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
					var obj = {};
					obj.Guid = OppGenInfoModel.Guid;
					obj.ItemGuid = OppGenInfoModel.ItemGuid;
					obj.PsrRequired = "";
					obj.PsrType = "";
					obj.PsrStatus = "55";
					obj.SsdaReq = "";
					obj.Bsdl = "";
					obj.ConComments = PSRData.ConComments;                                                                                                       //PCR019492++ 
					obj.Ssdl = "";
					obj.Bd = "";
					obj.Sd = "";
					obj.SsdaJustfication = PSRData.SsdaJustfication;
					obj.BsdaJustfication = PSRData.BsdaJustfication;
					obj.AprvComments = "";
					obj.ActionType = "";
					obj.TaskId = "";
					obj.WiId = "";
					obj.PsrStatDesc = "";
					obj.InitiatedBy = "";
					//obj.InitiatedDt = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                                       //PCR035760-- Defect#131 TechUpgrade changes
					obj.Time = thisCntrlr.bundle.getText("S2OPPAPPPAYLODTMEKEY");
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText("S2PSRSDASSDAINITSUCSSTXT"));
					this.fnSetVisibility("")
					this.getRefreshPSRData(OppGenInfoModel.Guid, OppGenInfoModel.ItemGuid);
					myBusyDialog.close();
					var SAFBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn);                                                                  //PCR019492++
					SAFBtn.setVisible(true);
					SAFBtn.setEnabled(true);
//					SAFBtn.setText(thisCntrlr.bundle.getText("S2PSRSDASFSSDAINITTXT"));                                                                           //PCR019492--
					var SAFBtnText = PSRData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")? SAFBtn.setText(                                          //PCR019492++
				       thisCntrlr.bundle.getText("S2PSRDCINITRRABTNTXTASC606")) : SAFBtn.setText(this.getResourceBundle().getText("S2PSRSDASFSSDAINITTXT"));      //PCR019492++
					SAFBtn.setIcon(thisCntrlr.bundle.getText("S2PSRSDAWFICON"));
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BSSDAAsses_PANEL).setVisible(false);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
						false);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SAPPROVALS_PANEL).setVisible(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Positive);
				}
			} else {
				var bmoUserList = OppGenInfoModel.NAV_BMO_INFO.results;
				var bmoInitiateFlag = this.checkContact(bmoUserList);
				if (bmoInitiateFlag === false) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACONCHECKFAILMSG"));
				} else {
					var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setExpanded(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setSelectedIndex(0);                                                //PCR019492++
					if(PSRData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                                                                            //PCR019492++
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SMANDAT_FID).setText(thisCntrlr.bundle.getText("S2PSRSDASHIPPINGLEVQUESTIONASC606"));   //PCR019492++
					} else if(PSRData.Asc606_Flag === ""){                                                                                                             //PCR019492++
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SMANDAT_FID).setText(thisCntrlr.bundle.getText("S2PSRSDASHIPPINGLEVQUESTION"));         //PCR019492++
					}                                                                                                                                                  //PCR019492++
					if (parseInt(PSRData.PsrStatus) === 65) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle
							.getText("S2PSRSDASFCONSSDAINITTXT"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(thisCntrlr.bundle
							.getText("S2CANCELBTNICON"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true);
					} else if (parseInt(PSRData.PsrStatus) > 65) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
					}
					if (parseInt(PSRData.PsrStatus) >= 65) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setExpanded(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setExpanded(
							false);
					} else {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(
							false);
					}
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CONTACTINFO_PANEL).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLEFORM_DISPLAY_360).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecTYPE_PANEL).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLEFORM_DISPLAY_370).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_B_APPROVALS_PANEL).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL).setVisible(
						false);
					myBusyDialog.close();
				}
			}
		},
		//***************Start Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
		/**
		 * This Method is use on PSR Cancel Initiation dialog box Ok Button press event.
		 * 
		 * @name confirmationPSRCanInit
		 * @param Event - Holds the current event
		 * @returns
		 */
		confirmationPSRCanInit: function(oEvent) {
			if(oEvent === thisCntrlr.getResourceBundle().getText("S2CONFFRGOKBTN")){
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
				var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
				var oView = thisCntrlr.getView();
				var obj = {};
				obj.Guid = OppGenInfoModel.Guid;
				obj.ItemGuid = OppGenInfoModel.ItemGuid;
				obj.PsrRequired = "";
				obj.PsrType = "";
				obj.PsrStatus = "";
				obj.Bsdl = "";
				obj.ConComments = PSRData.ConComments; 
				obj.Ssdl = "";
				obj.SsdaJustfication = PSRData.SsdaJustfication;
				obj.BsdaJustfication = PSRData.BsdaJustfication;
				obj.Bd = "";
				obj.Sd = "";
				obj.AprvComments = "";
				obj.ActionType = "";
				obj.TaskId = "";
				obj.WiId = "";
				obj.PsrStatDesc = "";
				obj.InitiatedBy = "";
				//obj.InitiatedDt = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                                      //PCR035760-- Defect#131 TechUpgrade changes
				obj.Time = thisCntrlr.bundle.getText("S2OPPAPPPAYLODTMEKEY");
				thisCntrlr.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText("S2PSRSDACONINITSUCSSTXT"));
				thisCntrlr.fnSetVisibility("");
				thisCntrlr.getRefreshPSRData(OppGenInfoModel.Guid, OppGenInfoModel.ItemGuid);
				myBusyDialog.close();
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Default);
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setText(thisCntrlr.bundle.getText("S2PSRSDAICONTABFTEXTASC606"));            //PCR020999++
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).setText("");
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(
					false);
				myBusyDialog.close();
			}			
		},
		//***************End Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
		/**
		 * This method is used For Review Spec Type Button Event.
		 * 
		 * @name getCSTAnRPaylod
		 * @param 
		 * @returns obj - Payload Object
		 */
		getCSTAnRPaylod: function() {
			var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL"));
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var obj = {};
			obj.NAV_PSR_QA = [];
			obj.NAV_SDA_QA = [];
			obj.Guid = OppGenInfoModel.getData().Guid;
			obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
			obj.PsrRequired = thisCntrlr.bundle.getText("S2POSMANDATANS");
			obj.PsrType = PSRData.PsrType;
			obj.PsrStatus = "17";
			obj.ConComments = PSRData.ConComments;                                                                                    //PCR019492++ 
			obj.Bsdl = PSRData.Bsdl;
			obj.Ssdl = PSRData.Ssdl;
			obj.Bd = PSRData.Bd;
			obj.Sd = PSRData.Sd;
			obj.BsdaJustfication = PSRData.BsdaJustfication;
			obj.SsdaJustfication = PSRData.SsdaJustfication;
			obj.SsdaReq = PSRData.SsdaReq;
			obj.CcOppId = thisCntrlr.that_views2.getController().OppId;
			obj.CcOpitmId = thisCntrlr.that_views2.getController().ItemNo;
			obj.RevOpitmId = PSRData.RevOpitmId;
			obj.RevOppId = PSRData.RevOppId;;
			obj.StreachedSpec = PSRData.StreachedSpec;
			obj.Custno = PSRData.Custno;
			obj.ActionType = thisCntrlr.bundle.getText("S2CBCSALESUCSSANS");
			obj.TaskId = "";
			obj.AprvComments = "";
			obj.WiId = "";
			obj.PsrStatDesc = "";
			obj.InitiatedBy = "";
			//obj.InitiatedDt = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                       //PCR035760-- Defect#131 TechUpgrade changes
			obj.Time = thisCntrlr.bundle.getText("S2OPPAPPPAYLODTMEKEY");
			var SalesQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE)
			   .getModel().getData();
		    var QaVer = SalesQusData.items[0].QaVer, QusLen = "";                                                                        //PCR019492++
//		    var QusId = ["1001", "1002", "1003", "1004", "1005", "1006"];                                                                //PCR019492--
		    if(PSRData.Asc606_BsdaFlag === ""){                                                                                          //PCR019492++
		        var QusId = ["1001", "1002", "1003", "1004", "1005", "1006"];                                                            //PCR019492++
		        QusLen = 2;                                                                                                              //PCR019492++
		    } else if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL")){                                     //PCR019492++
			    var QusId = ["1001", "1002", "1003", "1004", "1005", "1006", "1007"];                                                    //PCR019492++
			    QusLen = 3;                                                                                                              //PCR019492++
		    }                                                                                                                            //PCR019492++
		    for (var i = 0; i < SalesQusData.items.length; i++) {
			    var PSR = {},SaleAns, BmoAns;
			    PSR.Guid = OppGenInfoModel.getData().Guid;
			    PSR.Qdesc = "";
			    PSR.ItemGuid = OppGenInfoModel.getData().ItemGuid;
			    PSR.Qtype = thisCntrlr.bundle.getText("S2ICONTABPSRTEXT");
			    PSR.Qid = QusId[i];
			    PSR.QaVer = QaVer;                                                                                                       //PCR019492++ 
			    PSR.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().OppId;
			    PSR.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().ItemNo;
			    if (SalesQusData.items[i].SelectionIndex !== undefined) {
				   if (SalesQusData.items[i].SelectionIndex === 1) {
					   SaleAns = thisCntrlr.bundle.getText("S2POSMANDATANS");
				   } else if (SalesQusData.items[i].SelectionIndex === 2) {
					   SaleAns = thisCntrlr.bundle.getText("S2NEGMANDATANS");
				   }
			    } else {
				   SaleAns = ""
			    };
			    PSR.SalesFlg = SaleAns;
			    if (SalesQusData.items[i].BMOSelectionIndex !== undefined) {
				   if (SalesQusData.items[i].BMOSelectionIndex === 1) {
					   BmoAns = thisCntrlr.bundle.getText("S2POSMANDATANS");
				   } else if (SalesQusData.items[i].BMOSelectionIndex === 2) {
					   BmoAns = thisCntrlr.bundle.getText("S2NEGMANDATANS");
				   }
			    } else {
				   BmoAns = ""
			    };
			    PSR.BmoFlg = BmoAns;
			    PSR.ChangedBy = "";
			    //PSR.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                               //PCR035760-- Defect#131 TechUpgrade changes
			    obj.NAV_PSR_QA.push(PSR);
		    }	
			if (parseInt(PSRData.PsrStatus) === 15 && PSRData.Asc606_BsdaFlag === "") {                                                              //PCR019492++
			  var SalesQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_TABLE).getModel()
				.getData();
			  var QusId = ["2001", "2002", "2003", "2004"];
			  for (var i = 0; i < SalesQusData.items.length; i++) {
				var SDA = {},
					BmoAns;
				SDA.Guid = OppGenInfoModel.getData().Guid;
				SDA.Qdesc = "";
				SDA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
				SDA.Qtype = thisCntrlr.bundle.getText("S2PSRSDAQUSTXT");
				SDA.Qid = QusId[i];
				SDA.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData()
					.OppId;
				SDA.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData()
					.ItemNo;
				SDA.SalesFlg = "";
				if (SalesQusData.items[i].SelectionIndex !== undefined) {
					if (SalesQusData.items[i].SelectionIndex === 1) {
						BmoAns = thisCntrlr.bundle.getText("S2POSMANDATANS");
					} else if (SalesQusData.items[i].SelectionIndex === 2) {
						BmoAns = thisCntrlr.bundle.getText("S2NEGMANDATANS");
					} else {
						BmoAns = "";
					}
				} else {
					BmoAns = "";
				}
				SDA.BmoFlg = BmoAns;
				SDA.ChangedBy = "";
				//SDA.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                              //PCR035760-- Defect#131 TechUpgrade changes               
				obj.NAV_SDA_QA.push(SDA);
			  }
			}                                                                                                                                       //PCR019492++
			return obj;
		},
		/**
		 * This method is used For Generating Payload for BSDA Process.
		 * 
		 * @name PSRSDAPayload
		 * @param PsrStatus - Current PSR Status, ActionType - Save or Submit ,Message - Submit For Approval Button Text.
		 * @returns obj - Payload Object
		 */
		PSRSDAPayload: function(PsrStatus, ActionType, Message) {
			var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL"));
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var obj = {};
			if (parseInt(PSRData.PsrStatus) < 60) {
				obj.NAV_SAF_QA = {};
				obj.NAV_PSR_QA = [];
				obj.NAV_PSR_CC = [];
				if (parseInt(PSRData.PsrStatus) === 15 && PSRData.Asc606_BsdaFlag === "") {                                                     //PCR019492++
					obj.NAV_SDA_QA = [];
				}
				obj.Guid = OppGenInfoModel.getData().Guid;
				obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
				obj.PsrRequired = thisCntrlr.bundle.getText("S2POSMANDATANS");
				obj.PsrType = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText();
				(ActionType === thisCntrlr.bundle.getText("S2PSRSDASAVETXT")) ? (obj.PsrStatus = sap.ui.getCore()
					.getModel(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().PsrStatus) : ((Message ===
					thisCntrlr.bundle.getText("S2PSRSDASUBFORAPP")) ? (obj.PsrStatus = "15") : ((Message ===
					thisCntrlr.bundle.getText("S2PSRSDASFCONSPECTPEANDREWTXT")) ? (obj.PsrStatus = "17") : (
					"")));
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() === thisCntrlr.bundle.getText(
				"S2BSDASSMENTLVLOP")) {
					PSRData.Bsdl = "";
				} else if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() !== thisCntrlr.bundle.getText(
				"S2BSDASSMENTLVLOP")) {
					PSRData.Bsdl = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey();
				}					
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() === thisCntrlr.bundle
			   .getText("S2BSDASSMENTLVLOP")) {
			        PSRData.Ssdl = "";
		        } else if(this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() !== thisCntrlr.bundle
			   .getText("S2BSDASSMENTLVLOP")){
		        	PSRData.Ssdl = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey();
		        }
				if(PSRData.Asc606_BsdaFlag === ""){                                                                                                                                          //PCR019492++
					obj.ConComments = PSRData.ConComments;                                                                                                                                   //PCR019492++
					(parseInt(PSRData.PsrStatus) >= 17) ? ((PSRData.PsrType === thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT") && thisCntrlr.getModelFromCore(
						thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData().Region === thisCntrlr.bundle.getText("S2OPPREGION")) ? ((thisCntrlr.getView()
							.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() === thisCntrlr.bundle.getText(
								"S2BSDASSMENTLVL1")) ? (PSRData.Bsdl = thisCntrlr.bundle.getText("S2BSDASSMENTLVL1")) : (PSRData.Bsdl = thisCntrlr.bundle.getText(
							      "S2BSDASSMENTLVLAMJD"))) : ("")) : ("");				
					(parseInt(PSRData.PsrStatus) >= 17 && thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData().Region === 
							thisCntrlr.bundle.getText("S2OPPREGION") && PSRData.PsrType === thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT")) ? ((this.getView()
								.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() === thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"))
									?(PSRData.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL1")):(PSRData.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"))):
										((parseInt(PSRData.PsrStatus) >= 17 && PSRData.PsrType === thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT"))?(PSRData.Bsdl === 
											thisCntrlr.bundle.getText("S2BSDASSMENTLVL1")):(""));
					(parseInt(PSRData.PsrStatus) >= 17) ? ((PSRData.PsrType === thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT") && thisCntrlr.getModelFromCore(thisCntrlr
								.bundle.getText("GLBOPPGENINFOMODEL")).getData().Region !== thisCntrlr.bundle.getText("S2OPPREGION") && (PSRData.Bsdl === "" || PSRData.Bsdl !==
									thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"))) ? (PSRData.Bsdl = thisCntrlr.bundle.getText("S2BSDASSMENTLVL1")) : ("")) : ("");
				}else if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                                                                                           //PCR019492++
					if(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() !== thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP")){       //PCR019492++
						PSRData.Bsdl = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey();                                           //PCR019492++
					} if(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() !== thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP")){     //PCR019492++
						PSRData.Ssdl = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey();                                           //PCR019492++
					} if(parseInt(PSRData.PsrStatus) === 25 && PSRData.BmoRraValBsda !== PSRData.Bsdl && PSRData.Bsdl !== "" ){                                                                                                         //PCR019492++
						obj.ConComments = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).getValue();                                                             //PCR019492++
					} else {                                                                                                                                                                //PCR019492++
						obj.ConComments = PSRData.ConComments;                                                                                                                              //PCR019492++
					} 					                                                                                                                                                    //PCR019492++
				}                                                                                                                                                                           //PCR019492++				
				obj.Bd = PSRData.Bd;
				obj.Sd = PSRData.Sd;
				obj.Bsdl = PSRData.Bsdl;
				obj.Ssdl = PSRData.Ssdl;
				obj.BsdaJustfication = PSRData.BsdaJustfication;
				obj.SsdaJustfication = PSRData.SsdaJustfication;
				obj.SsdaReq = "";
				obj.StreachedSpec = PSRData.StreachedSpec;
				obj.CcOppId = thisCntrlr.that_views2.getController().OppId;
				obj.CcOpitmId = thisCntrlr.that_views2.getController().ItemNo;
				if (PSRData.RevOppId === "" && (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).getItems()[
							0].getText().split("-")[1] !== "" || this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX)
						.getItems()[0].getText().split("-")[1] !== undefined)) {
					obj.RevOppId = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).getItems()[
						0].getText().split("-")[0];
					obj.RevOpitmId = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX)
						.getItems()[0].getText().split("-")[1];
				} else {
					obj.RevOppId = PSRData.RevOppId;
					obj.RevOpitmId = PSRData.RevOpitmId;
				}
				if (PSRData.RevOppId === "" && (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).getItems()[
							0].getText().split("-")[1] !== "" || this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX)
						.getItems()[0].getText().split("-")[1] !== undefined)) {
					obj.RevOppId = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).getItems()[
						0].getText().split("-")[0];
					obj.RevOpitmId = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX)
						.getItems()[0].getText().split("-")[1];
				} else {
					obj.RevOpitmId = PSRData.RevOpitmId;
					obj.RevOppId = PSRData.RevOppId;
				}
				obj.Custno = PSRData.Custno;
				(ActionType === thisCntrlr.bundle.getText("S2PSRSDASAVETXT")) ? (obj.ActionType = "") : (obj.ActionType =
					thisCntrlr.bundle.getText("S2CBCSALESUCSSANS"));
				obj.TaskId = "";
				obj.AprvComments = "";
				obj.WiId = "";
				obj.PsrStatDesc = "";
				obj.InitiatedBy = "";
				//obj.InitiatedDt = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                                   //PCR035760-- Defect#131 TechUpgrade changes
				obj.Time = thisCntrlr.bundle.getText("S2OPPAPPPAYLODTMEKEY");
				obj.NAV_SAF_QA.Guid = OppGenInfoModel.getData().Guid;
				obj.NAV_SAF_QA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
				obj.NAV_SAF_QA.Qtype = thisCntrlr.bundle.getText("S2PSRSAFQUSKEY");
				obj.NAV_SAF_QA.Qid = thisCntrlr.bundle.getText("S2PSRSAFQUSTXT");
				obj.NAV_SAF_QA.Qdesc = "";
				obj.NAV_SAF_QA.QaVer = PSRData.NAV_SAF_QA.QaVer;                                                                                         //PCR019492++
				obj.NAV_SAF_QA.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
					"GLBOPPPSRINFOMODEL")).getData().OppId;
				obj.NAV_SAF_QA.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
					"GLBOPPPSRINFOMODEL")).getData().ItemNo;
				obj.NAV_SAF_QA.SalesFlg = PSRData.NAV_SAF_QA.SalesFlg;
				obj.NAV_SAF_QA.BmoFlg = "";
				obj.NAV_SAF_QA.ChangedBy = "";
				//obj.NAV_SAF_QA.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                       //PCR035760-- Defect#131 TechUpgrade changes
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_TABLE).getModel() !==
					undefined && (parseInt(PSRData.PsrStatus) === 5 || parseInt(PSRData.PsrStatus) === 4)) {
					var PSRCcTabData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_TABLE)
						.getModel().getData().results;
					if (PSRCcTabData.length > 0) {
						for (var i = 0; i < PSRCcTabData.length; i++) {
							var data = {};
							data.Guid = PSRCcTabData[i].Guid;
							data.ItemGuid = PSRCcTabData[i].ItemGuid;
							data.OppId = PSRCcTabData[i].OppId;
							data.ItemNo = PSRCcTabData[i].ItemNo;
							obj.NAV_PSR_CC.push(data)
						}
					}
				}
				if (parseInt(PSRData.PsrStatus) === 4 || parseInt(PSRData.PsrStatus) === 5) {
					var SalesQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE)
						.getModel().getData();
					var QaVer = SalesQusData.items[0].QaVer, QusLen = ""; 
//					var QusId = ["1001", "1002", "1003", "1004", "1005", "1006"];                                                                //PCR019492--
					if(PSRData.Asc606_BsdaFlag === ""){                                                                                          //PCR019492++
					    var QusId = ["1001", "1002", "1003", "1004", "1005", "1006"];                                                            //PCR019492++
					    QusLen = 2;                                                                                                              //PCR019492++
					} else if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL")){                                     //PCR019492++
						 var QusId = ["1001", "1002", "1003", "1004", "1005", "1006", "1007"];                                                   //PCR019492++
						 QusLen = 3;                                                                                                             //PCR019492++
					}                                                                                                                            //PCR019492++
					for (var i = 0; i < SalesQusData.items.length; i++) {
						var PSR = {},
							SaleAns, BmoAns;
						PSR.Guid = OppGenInfoModel.getData().Guid;
						PSR.Qdesc = "";
						PSR.ItemGuid = OppGenInfoModel.getData().ItemGuid;
						PSR.Qtype = thisCntrlr.bundle.getText("S2ICONTABPSRTEXT");
						PSR.Qid = QusId[i];
						PSR.QaVer = QaVer;                                                                                                       //PCR019492++
						PSR.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData()
							.OppId;
						PSR.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData()
							.ItemNo;
						(SalesQusData.items[i].SelectionIndex === 1) ? (PSR.SalesFlg = thisCntrlr.bundle.getText(
							"S2POSMANDATANS")) : ((SalesQusData.items[i].SelectionIndex === 2) ? (PSR.SalesFlg = thisCntrlr.bundle
							.getText("S2NEGMANDATANS")) : (PSR.SalesFlg = ""));
						PSR.BmoFlg = "";
						PSR.ChangedBy = "";
						//PSR.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                   //PCR035760-- Defect#131 TechUpgrade changes
						obj.NAV_PSR_QA.push(PSR);
					}
					if (SalesQusData.items.length === QusLen) {                                                                                  //PCR019492++
						for (var i = 0; i < 4; i++) {
							var PSR = {};
							PSR.Guid = OppGenInfoModel.getData().Guid;
							PSR.Qdesc = "";
							PSR.ItemGuid = OppGenInfoModel.getData().ItemGuid;
							PSR.Qtype = thisCntrlr.bundle.getText("S2ICONTABPSRTEXT");
							PSR.Qid = QusId[i + QusLen];
							PSR.QaVer = QaVer;                                                                                                   //PCR019492++
							PSR.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData()
								.OppId;
							PSR.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData()
								.ItemNo;
							PSR.SalesFlg = "";
							PSR.BmoFlg = "";
							PSR.ChangedBy = "";
							//PSR.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                               //PCR035760-- Defect#131 TechUpgrade changes
							obj.NAV_PSR_QA.push(PSR);
						}
					}
				} else if (parseInt(PSRData.PsrStatus) === 15) {
					var SalesQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE)
						.getModel().getData();
					var QaVer = SalesQusData.items[0].QaVer, QusLen = "";                                                                        //PCR019492++
//					var QusId = ["1001", "1002", "1003", "1004", "1005", "1006"];                                                                //PCR019492--
					if(PSRData.Asc606_BsdaFlag === ""){                                                                                          //PCR019492++
					    var QusId = ["1001", "1002", "1003", "1004", "1005", "1006"];                                                            //PCR019492++
					    QusLen = 2;                                                                                                              //PCR019492++
					} else if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL")){                                     //PCR019492++
						 var QusId = ["1001", "1002", "1003", "1004", "1005", "1006", "1007"];                                                   //PCR019492++
						 QusLen = 3;                                                                                                             //PCR019492++
					}                                                                                                                            //PCR019492++
					for (var i = 0; i < SalesQusData.items.length; i++) {
						var PSR = {},
							SaleAns, BmoAns;
						PSR.Guid = OppGenInfoModel.getData().Guid;
						PSR.Qdesc = "";
						PSR.ItemGuid = OppGenInfoModel.getData().ItemGuid;
						PSR.Qtype = thisCntrlr.bundle.getText("S2ICONTABPSRTEXT");
						PSR.Qid = QusId[i];
						PSR.QaVer = QaVer;                                                                                                       //PCR019492++ 
						PSR.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData()
							.OppId;
						PSR.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData()
							.ItemNo;
						if (SalesQusData.items[i].SelectionIndex !== undefined) {
							if (SalesQusData.items[i].SelectionIndex === 1) {
								SaleAns = thisCntrlr.bundle.getText("S2POSMANDATANS");
							} else if (SalesQusData.items[i].SelectionIndex === 2) {
								SaleAns = thisCntrlr.bundle.getText("S2NEGMANDATANS");
							}
						} else {
							SaleAns = ""
						};
						PSR.SalesFlg = SaleAns;
						if (SalesQusData.items[i].BMOSelectionIndex !== undefined) {
							if (SalesQusData.items[i].BMOSelectionIndex === 1) {
								BmoAns = thisCntrlr.bundle.getText("S2POSMANDATANS");
							} else if (SalesQusData.items[i].BMOSelectionIndex === 2) {
								BmoAns = thisCntrlr.bundle.getText("S2NEGMANDATANS");
							}
						} else {
							BmoAns = ""
						};
						PSR.BmoFlg = BmoAns;
						PSR.ChangedBy = "";
						//PSR.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                  //PCR035760-- Defect#131 TechUpgrade changes
						obj.NAV_PSR_QA.push(PSR);
					}
				}
				if (parseInt(PSRData.PsrStatus) === 15 && PSRData.Asc606_BsdaFlag === "") {                                                     //PCR019492++
					var SalesQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_TABLE).getModel()
						.getData();
					var QusId = ["2001", "2002", "2003", "2004"];
					for (var i = 0; i < SalesQusData.items.length; i++) {
						var SDA = {},
							BmoAns;
						SDA.Guid = OppGenInfoModel.getData().Guid;
						SDA.Qdesc = "";
						SDA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
						SDA.Qtype = thisCntrlr.bundle.getText("S2PSRSDAQUSTXT");
						SDA.Qid = QusId[i];
						SDA.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData()
							.OppId;
						SDA.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData()
							.ItemNo;
						SDA.SalesFlg = "";
						(SalesQusData.items[i].SelectionIndex !== undefined) ? ((SalesQusData.items[i].SelectionIndex ===
							1) ? (SDA.BmoFlg = thisCntrlr.bundle.getText("S2POSMANDATANS")) : ((SalesQusData.items[i].SelectionIndex === 2) ? (SDA.BmoFlg =
								thisCntrlr.bundle.getText("S2NEGMANDATANS")) :
							(SDA.BmoFlg = ""))) : (SDA.BmoFlg = "");
						SDA.ChangedBy = "";
						//SDA.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                                                      //PCR035760-- Defect#131 TechUpgrade changes
						obj.NAV_SDA_QA.push(SDA);
					}
				}
				//************************Start Of PCR019492: ASC606 UI Changes******************
				if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") && ((parseInt(PSRData.PsrStatus) === 15 &&PSRData.PsrType === thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT")) ||
						parseInt(PSRData.PsrStatus) >= 17)){
					obj.NAV_RRA_QA_PSR = [];
					var QusId = ["4001", "4002", "4003", "4004", "4005", "4006", "4007"], QusFlag = false;
					var SalesQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).getModel().getData();
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
						//RRA.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                            //PCR035760-- Defect#131 TechUpgrade changes
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
						//RRA.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                            //PCR035760-- Defect#131 TechUpgrade changes
					}
					obj.NAV_RRA_QA_PSR.push(RRA);
			      }
				}
				//************************End Of PCR019492: ASC606 UI Changes******************
			} else {
				obj.Guid = OppGenInfoModel.getData().Guid;
				obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
				obj.PsrRequired = PSRData.PsrRequired;
				obj.PsrType = PSRData.PsrType;
				obj.PsrStatus = PSRData.PsrStatus;
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).getSelectedKey() === thisCntrlr.bundle.getText(
						"S2BSDASSMENTLVLOP")) {
					PSRData.Bsdl = "";
				} else if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).getSelectedKey() === thisCntrlr.bundle
					.getText("S2BSDASSMENTLVLOP")) {
					PSRData.Ssdl = "";
				}
				(parseInt(PSRData.PsrStatus) >= 65) ? ((PSRData.PsrType === thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT") && PSRData.Ssdl === "") ?
					(PSRData.Ssdl = thisCntrlr.bundle.getText("S2BSDASSMENTLVL1")) : ("")) : ("");
				obj.Ssdl = PSRData.Ssdl;
				obj.Bd = PSRData.Bd;
				obj.Bsdl = PSRData.Bsdl;
				obj.Sd = PSRData.Sd;
				obj.ConComments = PSRData.ConComments;                                                                                                       //PCR019492++
				obj.BsdaJustfication = PSRData.BsdaJustfication;
				obj.SsdaJustfication = PSRData.SsdaJustfication;
				obj.SsdaReq = PSRData.SsdaReq;
				obj.RevOpitmId = PSRData.RevOpitmId;
				obj.RevOppId = PSRData.RevOppId;
				obj.Custno = PSRData.Custno;
				(ActionType === thisCntrlr.bundle.getText("S2PSRSDASAVETXT")) ? (obj.ActionType = "") : (obj.ActionType =
					thisCntrlr.bundle.getText("S2CBCSALESUCSSANS"));
				obj.AprvComments = "";
				obj.TaskId = PSRData.TaskId;
				obj.WiId = "";
				obj.PsrStatDesc = "";
				obj.InitiatedBy = "";
				//obj.InitiatedDt = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                                       //PCR035760-- Defect#131 TechUpgrade changes
				obj.Time = thisCntrlr.bundle.getText("S2OPPAPPPAYLODTMEKEY");
				obj.NAV_SAF_QA = {};
				obj.NAV_SAF_QA.Guid = OppGenInfoModel.getData().Guid;
				obj.NAV_SAF_QA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
				obj.NAV_SAF_QA.Qtype = thisCntrlr.bundle.getText("S2PSRSAFQUSKEY");
				obj.NAV_SAF_QA.Qid = thisCntrlr.bundle.getText("S2PSRSAFQUSTXT");
				obj.NAV_SAF_QA.Qdesc = "";
				obj.NAV_SAF_QA.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
					"GLBOPPPSRINFOMODEL")).getData().OppId;
				obj.NAV_SAF_QA.QaVer = PSRData.NAV_SAF_QA.QaVer;                                                                                             //PCR019492++
				obj.NAV_SAF_QA.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
					"GLBOPPPSRINFOMODEL")).getData().ItemNo;
				obj.NAV_SAF_QA.SalesFlg = PSRData.NAV_SAF_QA.SalesFlg;
				obj.NAV_SAF_QA.BmoFlg = "";
				obj.NAV_SAF_QA.ChangedBy = "";
				//obj.NAV_SAF_QA.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                            //PCR035760-- Defect#131 TechUpgrade changes
			}
			return obj;
		},
		/**
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
			var checkFlag = false;
			var CBCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBCBCMODEL")).getData();
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
		 * @param evt - Event Handlers
		 * @returns 
		 */
		onContactCancelPress: function(evt) {
			this.contactF4Fragment.close();
			this.contactF4Fragment.destroy(true);
		},
		/**
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
		 * This method is used to handles SAF Question answer Event.
		 * 
		 * @name onSelectRBMandat
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onSelectRBMandat: function(oEvent) {
			var ValueState = oEvent.getParameters().selectedIndex > 0 ? thisCntrlr.bundle.getText(
				"S2DELNAGVIZTEXT") : thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
			oEvent.oSource.setValueState(ValueState);
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
				.getText("S2ICONTABPSRSDAKEY")) {
				thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().NAV_SAF_QA.SalesFlg =
					oEvent.getParameters().selectedIndex > 0 ? (oEvent.getParameters().selectedIndex === 1 ? thisCntrlr.bundle
						.getText("S2POSMANDATANS") : thisCntrlr.bundle.getText("S2NEGMANDATANS")) : "";
			} else {
				thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().NAV_PDC_QA_SAF
					.SalesFlg = oEvent.getParameters().selectedIndex > 0 ? (oEvent.getParameters().selectedIndex === 1 ?
						thisCntrlr.bundle.getText("S2POSMANDATANS") : thisCntrlr.bundle.getText(
							"S2NEGMANDATANS")) : "";
			}
		},
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
			var CCTableData = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_TABLE)
				.getModel().getData().results;
			var PSRCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRSDACBCCCPYMODEL")).getData();
			for (var i = 0; i < PSRCData.results.length; i++) {
				for (var j = 0; j < CCTableData.length; j++) {
					if (PSRCData.results[i].OppId === CCTableData[j].OppId && PSRCData.results[i].ItemNo ===
						CCTableData[j].ItemNo) {
						PSRCData.results[i].Selected = true;
					}
				}
				PSRCData.results[i].Selected === undefined ? PSRCData.results[i].Selected = false : "";
			}
			this.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRCBCCCF4helpOppLink"), this);
			this.dialog.getContent()[2].getColumns()[0].setVisible(true);                                                                            //PCR025717++; getContent()[0] replaced with getContent()[2]
			this.dialog.getContent()[2].getColumns()[2].setVisible(true);                                                                            //PCR025717++
			this.dialog.getSubHeader().setVisible(true);
			this.getCurrentView().addDependent(this.dialog);
			var CbnCpyFragData = this.getJSONModel(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRSDACBCCCPYMODEL")).getData());
			this.dialog.setModel(CbnCpyFragData);
			this.dialog.open();
		},
		/**
		 * This method is used to handles Hazardous Languages Link event.
		 * 
		 * @name handleHazBtnLinkPress
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		handleHazBtnLinkPress: function(oEvent) {
			var path = jQuery.sap.getModulePath(thisCntrlr.bundle.getText("S2PSRSDAHAZUSDOCPATH"));
			var url = path + thisCntrlr.bundle.getText("S2PSRHAZRPDFLINK");
			oEvent.getSource().setHref(url);
			oEvent.getSource().setTarget(thisCntrlr.bundle.getText("S2PSRSDALINKTARGET"));
		},
		/**
		 * This method Used for Determine PSR Type with BMO Answer.
		 * 
		 * @name OnDetmineSST
		 * @param oEvent: Event Handler
		 * @returns 
		 */
		OnDetmineSST: function(oEvent) {
			var changeLine = oEvent.getSource().getParent().getBindingContext().getPath().slice(-1);
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var ASCType = PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? true : false;                                      //PCR019492++
			var QusNo = ASCType === true ? 2 : 1;                                                                                                     //PCR019492++
			var MainData;
			for (var i = 0; i < thisCntrlr.MandateData.items[0].length; i++) {
				if (parseInt(changeLine) === i) {
					if (parseInt(PSRData.PsrStatus) === 4 || parseInt(PSRData.PsrStatus) === 5) {
						var Select = true;
						if (oEvent.getParameters().selectedIndex === 1) {
							Select = true;
							thisCntrlr.MandateData.items[0][i].SalesFlg = thisCntrlr.bundle.getText("S2POSMANDATANS");
						} else if (oEvent.getParameters().selectedIndex === 2) {
							Select = false;
							thisCntrlr.MandateData.items[0][i].SalesFlg = thisCntrlr.bundle.getText("S2NEGMANDATANS");
						}
						thisCntrlr.MandateData.items[0][i].Selected = Select;
//						if (parseInt(changeLine) === 1 && Select === true) {                                                                           //PCR019492--
						if (parseInt(changeLine) === QusNo && Select === true) {                                                                       //PCR019492++
							PSRData.PsrType = thisCntrlr.bundle.getText("S2PSRSDASTATNEW");
//						} else if (parseInt(changeLine) === 1 && Select === false) {                                                                   //PCR019492--
						} else if (parseInt(changeLine) === QusNo && Select === false) {                                                               //PCR019492++
							PSRData.PsrType = ""
						}
					} else {
						thisCntrlr.MandateData.items[0][i].BMOValueState = thisCntrlr.bundle.getText(
							"S2DELNAGVIZTEXT");
						if (oEvent.getParameters().selectedIndex === 1) {
							thisCntrlr.MandateData.items[0][i].BMOSelected = true;
							thisCntrlr.MandateData.items[0][i].BMOSelectionIndex = 1;
						} else if (oEvent.getParameters().selectedIndex === 2) {
							thisCntrlr.MandateData.items[0][i].BMOSelected = false;
							thisCntrlr.MandateData.items[0][i].BMOSelectionIndex = 2;
						}
					}
				}
			}
			if (parseInt(PSRData.PsrStatus) === 4 || parseInt(PSRData.PsrStatus) === 5) {
				MainData = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, changeLine, true, false, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType);  //PCR019492++
				var PSRTypeTxt;
				var ansData = {
					"items": []
				};
				if (MainData[1] === false && (MainData[2] === false && MainData[3] === false)) {
					PSRTypeTxt = "";
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(false);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(false);
					if (MainData[0].items.length === 2) {
						ansData.items = [MainData[0].items[0], MainData[0].items[1]];
					} else if(MainData[0].items.length === 3){                                                                                          //PCR019492++
						ansData.items = [MainData[0].items[0], MainData[0].items[1], MainData[0].items[2]];                                             //PCR019492++
					}  else if(ASCType === false) {                                                                                                     //PCR019492++
						ansData.items = [MainData[0].items[0], MainData[0].items[1], MainData[0].items[2], MainData[0].items[3],
						MainData[0].items[4], MainData[0].items[5]];
					} else if(ASCType === true) {                                                                                                       //PCR019492++
					    ansData.items = [MainData[0].items[0], MainData[0].items[1], MainData[0].items[2], MainData[0].items[3],                        //PCR019492++
						MainData[0].items[4], MainData[0].items[5], MainData[0].items[6]];                                                              //PCR019492++
					}                                                                                                                                   //PCR019492++
				} else if (MainData[1] === true) {
					PSRTypeTxt = thisCntrlr.bundle.getText("S2PSRSDASTATNEW");
//					ansData.items = [MainData[0].items[0], MainData[0].items[1]];                                                                       //PCR019492--
					if(ASCType === true){                                                                                                               //PCR019492++
						ansData.items = [MainData[0].items[0], MainData[0].items[1], MainData[0].items[2]];                                             //PCR019492++
					}else {                                                                                                                             //PCR019492++
					    ansData.items = [MainData[0].items[0], MainData[0].items[1]];                                                                   //PCR019492++
					}                                                                                                                                   //PCR019492++
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(true);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(false);
				} else {
					if (MainData[3] === true) {
						PSRTypeTxt = thisCntrlr.bundle.getText("S2PSRSDASTATREVISED");
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(true);
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(false);
					} else {
						PSRTypeTxt = thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT");
						if (PSRData.RevOppId === "" && PSRData.RevOpitmId === ""){                                                                  //PCR019492++
							thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setVisible(true);                 //PCR019492++	
							thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX).setVisible(true);               //PCR019492++							
						}                                                                                                                           //PCR019492++
						if (thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData().Region ===
							thisCntrlr.bundle.getText("S2OPPREGION")) {
							if(ASCType === false){                                                                                                   //PCR019492++
								if(PSRData.OldBsdaVal !== "" && PSRData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                 //PCR019492++
									var SDAAssesItem = {                                                                                             //PCR019492++
											"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level"},                                      //PCR019492++
											                       {"ProductId": "L1", "Name": "L1"},                                                //PCR019492++
											                       {"ProductId": "SHPOD", "Name": "SHPOD" },                                         //PCR019492++
											                       {"ProductId": "CAR", "Name": "CAR" },                                             //PCR019492++
											                       {"ProductId": "DEFER", "Name": "DEFER" },                                         //PCR019492++
											                       {"ProductId": "AMJD", "Name": "AMJD"}]};                                          //PCR019492++
								} else {
									var SDAAssesItem = {
											"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level"},
											                       {"ProductId": "L1", "Name": "L1"},
											                       {"ProductId": "AMJD", "Name": "AMJD"}]};
								}								
							} else if(ASCType === true){                                                                                             //PCR019492++
								var SDAAssesItem = {                                                                                                 //PCR019492++
										"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },                                         //PCR019492++
										                       {"ProductId": "SHPOD", "Name": "SHPOD" },                                             //PCR019492++
										                       {"ProductId": "CAR", "Name": "CAR" },                                                 //PCR019492++
										                       {"ProductId": "DEFER", "Name": "DEFER" },                                             //PCR019492++ 
										                       {"ProductId": "AMJD", "Name": "AMJD" }]};                                             //PCR019492++
							}                                                                                                                        //PCR019492++							                                                    
							var oModel1 = this.getJSONModel(SDAAssesItem);
							thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setModel(oModel1);
							thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setModel(oModel1);
						} else {
							if(ASCType === false){                                                                                                   //PCR019492++
								if(PSRData.OldBsdaVal !== "" && PSRData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                 //PCR019492++
									var SDAAssesItem = {                                                                                             //PCR019492++
											"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level"},                                      //PCR019492++
											                       {"ProductId": "L1", "Name": "L1"},                                                //PCR019492++
											                       {"ProductId": "SHPOD", "Name": "SHPOD" },                                         //PCR019492++
											                       {"ProductId": "CAR", "Name": "CAR" },                                             //PCR019492++
											                       {"ProductId": "DEFER", "Name": "DEFER" }]};                                       //PCR019492++
									var oModel1 = this.getJSONModel(SDAAssesItem);                                                                   //PCR019492++
									thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setModel(oModel1);      //PCR019492++
								} else {
									thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(thisCntrlr.bundle.getText(
									"S2BSDASSMENTLVL1"));
								}								
							}else if(ASCType === true){                                                                                             //PCR019492++
								var SDAAssesItem = {                                                                                                //PCR019492++
										"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },                                        //PCR019492++
										                       {"ProductId": "SHPOD", "Name": "SHPOD" },                                            //PCR019492++
										                       {"ProductId": "CAR", "Name": "CAR" },                                                //PCR019492++
										                       {"ProductId": "DEFER", "Name": "DEFER" }]};                                          //PCR019492++
								var oModel1 = this.getJSONModel(SDAAssesItem);                                                                      //PCR019492++
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setModel(oModel1);         //PCR019492++
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setModel(oModel1);         //PCR019492++
							}	
						}
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(false);
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(true);
					}
					if(ASCType === false){
						ansData.items = [MainData[0].items[0], MainData[0].items[1], MainData[0].items[2], MainData[0].items[3],
					    MainData[0].items[4], MainData[0].items[5]];
					}else if(ASCType === true){ 
						ansData.items = [MainData[0].items[0], MainData[0].items[1], MainData[0].items[2], MainData[0].items[3],                        //PCR019492++
											MainData[0].items[4], MainData[0].items[5], MainData[0].items[6]];
					}
				}
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).setText(PSRTypeTxt);
				var cModel1 = this.getJSONModel(ansData);
				var oTableItems1 = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE);
				var oItemTemplate1 = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DETERMINE_Sys_SpecTYPE_TEMPLATE);
				oTableItems1.setModel(cModel1);
			} else {
				MainData = thisCntrlr.fnDetermineBMOAns(thisCntrlr.MandateData, changeLine, false, true, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType);   //PCR019492++
				this.specTypeDeter(MainData, changeLine, ASCType);                                                                                     //PCR019492++
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText() === thisCntrlr.bundle.getText(
						"S2PSRSDASTATNEW")) {
					if(ASCType === false){
						MainData.items.length = 2;
					}else {
						MainData.items.length = 3;
					}
				}
				var cModel1 = this.getJSONModel(MainData);
				var oTableItems1 = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE);
				var oItemTemplate1 = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DETERMINE_Sys_SpecTYPE_TEMPLATE);
				oTableItems1.setModel(cModel1);
				//*************** Justification: Start Of PCR018375++ Phase2 - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
				var rejCond = PSRData.Asc606_BsdaFlag === this.getResourceBundle().getText("S2ODATAPOSVAL") ? (MainData.items[0].BMOSelectionIndex>0 && MainData.items[1].BMOSelectionIndex>0                   //PCR019492++
						&& MainData.items[2].BMOSelectionIndex>0) :(MainData.items[0].BMOSelectionIndex>0 && MainData.items[1].BMOSelectionIndex>0);                                                            //PCR019492++
//				if(MainData.items[0].BMOSelectionIndex>0 && MainData.items[1].BMOSelectionIndex>0){                                                                                                             //PCR019492--
				if(rejCond){	                                                                                                                                                                                //PCR019492++
					var quschek = this.qusDiffCheck(ASCType);
					(quschek !== 0)?(that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(true),
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(true), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(true),
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setEnabled(false)): (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false),    //PCR019492++
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false), thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setEnabled(true));  //PCR019492++
				}
				//*************** Justification: End Of PCR018375++ Phase2 - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
			}
		},
		/**
		 * This method Used for Determine BMO Answers.
		 * 
		 * @name fnDetermineBMOAns
		 * @param Data: PSR Data, changeLine- Change Selected Line#, SalesEnable-Sales Enable Flag, BMOEnable - BMO Enable Flag, QusType - Question Type, ASCType -ASC606 Type
		 * @returns FinalQuesItems - Question Item Json
		 */
		fnDetermineBMOAns: function(Data, changeLine, SalesEnable, BMOEnable, QusType, ASCType) {
			var FinalQuesItems = {
				"items": []
			}, tempQuesItems = "", OrgQuesItems = []; 
			//***************Start Of PCR019492: ASC606 UI Changes********
			var tempObj = {};
			if(ASCType === true && QusType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")){
				OrgQuesItems[0] = Data.items[0][0];
				tempQuesItems = {"items": {"0": []}};
				for (var i = 0, m = 0; i < Data.items[0].length; i++) {
					if(i=== 0){
						if (Data.items[0][i].BMOSelectionIndex === 1) {
							tempObj.BMOValueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							tempObj.BMOSelected = true;
							tempObj.BMOSelectionIndex = 1;
							tempObj.BmoFlg = thisCntrlr.bundle.getText("S2POSMANDATANS");
						} else if (Data.items[0][i].BMOSelectionIndex === 2) {
							tempObj.BMOValueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
							tempObj.BMOSelected = false;
							tempObj.BMOSelectionIndex = 2;
							tempObj.BmoFlg = thisCntrlr.bundle.getText("S2NEGMANDATANS");
						} else if (Data.items[0][i].BMOValueState === thisCntrlr.bundle.getText("S2DELNAGVIZTEXT")) {
							tempObj.BMOSelected = Data.items[0][i].BMOSelected;
							tempObj.BMOSelectionIndex = Data.items[0][i].BMOSelectionIndex;
							tempObj.BMOValueState = Data.items[0][i].BMOValueState;
							tempObj.BmoFlg = Data.items[0][i].BmoFlg;
						} else {
							tempObj.BMOSelected = "";
							tempObj.BMOSelectionIndex = 0;
							tempObj.BMOValueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
							tempObj.BmoFlg = Data.items[0][i].BmoFlg;
						}
					   if(tempObj.BMOSelectionIndex > 0){
						   var oppQuesdata = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
						   var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();  
						   tempObj.BMOSelectionIndex === 1 ? oppQuesdata.NAV_RRA_QA_PSR.results[i].SalesFlg = "Y" : oppQuesdata.NAV_RRA_QA_PSR.results[i].SalesFlg = "N";
						   var RRAQuesData = thisCntrlr.getRRAQusData(oppQuesdata.PsrStatus, oppQuesdata.NAV_RRA_QA_PSR, GenInfoData.Region, true);
						   this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
					   }
					   tempObj.BMOEnabled = BMOEnable;
					   tempObj.QaVer = Data.items[0][i].QaVer;
					   tempObj.enabled = SalesEnable;
					   tempObj.Ques = Data.items[0][i].Qdesc;
					   if (Data.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
						  tempObj.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
						  tempObj.Selected = true;
						  tempObj.SelectionIndex = 1;
					   } else if (Data.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
						  tempObj.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
						  tempObj.Selected = false;
						  tempObj.SelectionIndex = 2;
					   } else {
						  tempObj.Selected = "";
						  tempObj.SelectionIndex = 0;
						  tempObj.valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
					  }
				   } else if(i >0){
					  tempQuesItems.items[0][m] = Data.items[0][i];
					  m++;
				   }
			    }	
				Data.items[0].length = 0;
				Data.items[0] = tempQuesItems.items[0];
			 }
			//***************End Of PCR019492: ASC606 UI Changes********
			for (var i = 0, m = 0; i < Data.items[0].length; i++) {
				var temp = {};
				temp.Ques = Data.items[0][i].Qdesc;
				temp.QaVer = Data.items[0][i].QaVer;
				if (Data.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
					temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
					temp.Selected = true;
					temp.SelectionIndex = 1;
				} else if (Data.items[0][i].SalesFlg === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
					temp.valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
					temp.Selected = false;
					temp.SelectionIndex = 2;
				} else {
					temp.Selected = "";
					temp.SelectionIndex = 0;
					temp.valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
				}
				temp.BMOEnabled = BMOEnable;
				temp.enabled = SalesEnable;
				if (i === 1) {
					if ((Data.items[0][i].BMOSelected === undefined && this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT)
						.getText() === thisCntrlr.bundle.getText("S2PSRSDASTATNEW")) || (ASCType === true && Data.items[0][i].BMOSelected === undefined)) {
						temp.BMOValueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						temp.BMOSelected = false;
						temp.BMOSelectionIndex = 0;
						FinalQuesItems.items[m] = temp;
						m++;
						if(ASCType === true && QusType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")){                                         //PCR019492++
							FinalQuesItems = this.setASCPSRQusModel(tempObj, FinalQuesItems);                                                      //PCR019492++
							this.resetQusData(OrgQuesItems, Data);                                                                                 //PCR019492++
						}
						var TempArr = [FinalQuesItems];
						return FinalQuesItems;
					} else {
						temp.BMOValueState = Data.items[0][i].BMOValueState;
						temp.BMOSelected = Data.items[0][i].BMOSelected;
						temp.BMOSelectionIndex = Data.items[0][i].BMOSelectionIndex;
					}
					if (Data.items[0][i].BMOSelected === true && this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT)
						.getText() === thisCntrlr.bundle.getText("S2PSRSDASTATNEW")) {
						FinalQuesItems.items[m] = temp;
						m++;
						if(ASCType === true && QusType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")){                                         //PCR019492++
							FinalQuesItems = this.setASCPSRQusModel(tempObj, FinalQuesItems);                                                      //PCR019492++
							this.resetQusData(OrgQuesItems, Data);                                                                                 //PCR019492++
						}
						var TempArr = [FinalQuesItems];
						return FinalQuesItems;
					}
				} else {
					if (Data.items[0][i].BMOSelected === undefined) {
						temp.BMOValueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
						temp.BMOSelected = false;
						temp.BMOSelectionIndex = 0;
					} else {
						temp.BMOValueState = Data.items[0][i].BMOValueState;
						temp.BMOSelected = Data.items[0][i].BMOSelected;
						temp.BMOSelectionIndex = Data.items[0][i].BMOSelectionIndex;
					}
				}
				FinalQuesItems.items[m] = temp;
				m++;
			}
			if(ASCType === true && QusType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")){                                                     //PCR019492++
				FinalQuesItems = this.setASCPSRQusModel(tempObj, FinalQuesItems);                                                                  //PCR019492++
				this.resetQusData(OrgQuesItems, Data);                                                                                             //PCR019492++
			}
			var TempArr = [FinalQuesItems];
			return FinalQuesItems;
		},
		/**
		 * This method Used for Determine Spec Type.
		 * 
		 * @name specTypeDeter
		 * @param Data: PSR Data, changeLine- Change Slected Line#, ASCType - ASC606 Type
		 * @returns 
		 */
		specTypeDeter: function(Data, changeLine, ASCType) {
			var PSrTextArr = [], fstCon = "", secCon = "", thrdCon = "", totLen = "", RRQusMark = "", errorFlag = "";                                //PCR019492++
			var oResource = thisCntrlr.bundle;
			//***************Start Of PCR019492: ASC606 UI Changes********
			var oView = thisCntrlr.getView();			
			if(ASCType === true){
				secCon = 2;
				thrdCon = 6;
				totLen = 7;
			} else if (ASCType === false){
				secCon = 1;
				thrdCon = 5;
				totLen = 6;
			}
			for (var j = 0; j < Data.items.length; j++) {
				if(ASCType === true && (j === 0 || j === 1)){
					fstCon = (j === 0 || j === 1);
					RRQusMark = 3;
				}else if (ASCType === false){
					fstCon = (j === 0);
					RRQusMark = 2;
				}else{
					fstCon = false;
				}
				//***************End Of PCR019492: ASC606 UI Changes********
				if (fstCon) {                                                                                                                         //PCR019492++
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).setText("");
					PSrTextArr[0] = true;
					continue;
				} else if (j === secCon) {                                                                                                            //PCR019492++
					if (Data.items[j].BMOSelectionIndex === 1) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).setText(oResource.getText("S2PSRSDASTATNEW"));
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(false);                                    //PCR019492++
						return PSrTextArr[1] = true;
					} else {
						PSrTextArr[1] = false;
					}
				} else if (j > secCon) {                                                                                                              //PCR019492++
					if(secCon === 2){PSrTextArr[2] = true;};                                                                                          //PCR019492++
					for (var z = RRQusMark; z < totLen; z++) {                                                                                        //PCR019492++
						if (Data.items[z].BMOSelectionIndex !== undefined) {
							if (Data.items[z].BMOSelectionIndex === 1) {
								PSrTextArr[z] = true;
								if (z === thrdCon) {                                                                                                  //PCR019492++
									break;
								}
							} else {
								PSrTextArr[z] = false;
							}
							if (z === thrdCon) break;                                                                                                 //PCR019492++
						} else {
							PSrTextArr[z] = "";
						}
						if (z === thrdCon) break;                                                                                                     //PCR019492++
					}
					if (z === thrdCon) break;                                                                                                         //PCR019492++
				}
			}
			var PSrText;
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(true);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(false);
			for(var l = 0; l < Data.items.length; l++){
				if(Data.items[l].BMOValueState === oResource.getText("S2ERRORVALSATETEXT")){
					errorFlag = true;
					break;
				}
			}
//			if (Data.items[0].BMOValueState === oResource.getText("S2ERRORVALSATETEXT") || Data.items[1].BMOValueState === oResource.getText(         //PCR019492--
//					"S2ERRORVALSATETEXT") ||                                                                                                          //PCR019492--
//				Data.items[2].BMOValueState === oResource.getText("S2ERRORVALSATETEXT") || Data.items[3].BMOValueState === oResource.getText(         //PCR019492--
//					"S2ERRORVALSATETEXT") ||                                                                                                          //PCR019492--
//				Data.items[4].BMOValueState === oResource.getText("S2ERRORVALSATETEXT") || Data.items[5].BMOValueState === oResource.getText(         //PCR019492--
//					"S2ERRORVALSATETEXT")) {                                                                                                          //PCR019492--
			var noType = "", nwType = "", rptType ="", rvsType = "";
			if(ASCType === true){
				noType = PSrTextArr[3] === false && PSrTextArr[4] === false && PSrTextArr[5] === false && PSrTextArr[6] === false;
				nwType = PSrTextArr[1] === true;
				rptType = PSrTextArr[3] === true && PSrTextArr[4] === true && PSrTextArr[5] === true && PSrTextArr[6] === true;
				rvsType =  PSrTextArr[3] === false || PSrTextArr[4] === false || PSrTextArr[5] === false || PSrTextArr[6] === false;
			} else if (ASCType === false){
				noType = PSrTextArr[2] === false && PSrTextArr[3] === false && PSrTextArr[4] === false && PSrTextArr[5] === false;
				nwType = PSrTextArr[1] === true;
				rptType = PSrTextArr[2] === true && PSrTextArr[3] === true && PSrTextArr[4] === true && PSrTextArr[5] === true;
				rvsType =  PSrTextArr[2] === false || PSrTextArr[3] === false || PSrTextArr[4] === false || PSrTextArr[5] === false;
			}
			if (errorFlag){
				PSrText = "";
			} else {
				if (noType) {
//					PSrText = "";                                                                                                                    //PCR019492--, Defect 10280  correction
					PSrText = oResource.getText("S2PSRSDASTATREVISED");                                                                              //PCR019492++, Defect 10280  correction
				} else {
					if (nwType) {
						PSrText = oResource.getText("S2PSRSDASTATNEW");
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(false);                                   //PCR019492++
					} else if (rptType) {
						PSrText = oResource.getText("S2PSRSDASTATREPEAT");
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(true);
						//****************** Start Of PCR019492: ASC606 UI Changes ****************************
						var PSRSDAdata = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
						var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
						var SecurityData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBSECURITYMODEL")).getData(), UpldFnlSpecVis = "";
						 if(ASCType === true){
							    oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(true);
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);                         //PCR019492++, Modified to false
								(SecurityData.UpldFnlSpec === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (UpldFnlSpecVis =
									true) : (UpldFnlSpecVis = false);
								var EBSDAPSRData = PSRSDAdata.NAV_BSDA_EVDOC.results;
								var EBSDAPSRDoc = this.loadFPSRevDocData(EBSDAPSRData, true, true, UpldFnlSpecVis);	
								var oEBSDAPSRDocJModel = this.getJSONModel({
									"ItemSet": EBSDAPSRDoc
								});
								var oEBSDAPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EVDANCE_DOC_TABLE);
								oEBSDAPSRDocTable.setModel(oEBSDAPSRDocJModel);
								this.setTableNoteEnable(oEBSDAPSRDocTable);
								this.setTableSecurity(oEBSDAPSRDocTable);
						 }						
						if(GenInfoData.Region === this.bundle.getText("S2OPPREGION")){
							if(PSRSDAdata.Asc606_BsdaFlag === ""){
								if(PSRSDAdata.OldBsdaVal !== "" && PSRSDAdata.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
									var BSDAAssesItem = {
											"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
											                       {"ProductId": "L1", "Name": "L1" }, 
											                       {"ProductId": "AMJD", "Name": "AMJD"},
											                       {"ProductId": "SHPOD", "Name": "SHPOD" },
											                       {"ProductId": "CAR", "Name": "CAR" }, 
											                       {"ProductId": "DEFER", "Name": "DEFER" }]};
								} else {
									var BSDAAssesItem = {
											"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
											                       {"ProductId": "L1", "Name": "L1" }, 
											                       {"ProductId": "AMJD", "Name": "AMJD"}]};
								}								
							} else if(PSRSDAdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
								var BSDAAssesItem = {
										"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
										                       {"ProductId": "SHPOD", "Name": "SHPOD" },
										                       {"ProductId": "CAR", "Name": "CAR" }, 
										                       {"ProductId": "DEFER", "Name": "DEFER" }, 
										                       {"ProductId": "AMJD", "Name": "AMJD" }]};
							}
						} else {
							if(PSRSDAdata.Asc606_BsdaFlag === ""){
								if(PSRSDAdata.OldBsdaVal !== "" && PSRSDAdata.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
									var BSDAAssesItem = {
											"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
											                       {"ProductId": "L1", "Name": "L1"},
											                       {"ProductId": "SHPOD", "Name": "SHPOD" },
											                       {"ProductId": "CAR", "Name": "CAR" }, 
											                       {"ProductId": "DEFER", "Name": "DEFER" }]};
								} else {
									var BSDAAssesItem = {
											"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
											                       {"ProductId": "L1", "Name": "L1"}]};
								}								
							} else if(PSRSDAdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
								var BSDAAssesItem = {
										"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
										                       {"ProductId": "SHPOD", "Name": "SHPOD" },
										                       {"ProductId": "CAR", "Name": "CAR" }, 
										                       {"ProductId": "DEFER", "Name": "DEFER" }]};
							}
						}
						//****************** start Of PCR019492--: 10280 : ASC606 UI Changes ****************************
//						var SDAAssesItem = {
//								"SDAAssesCollection": [{
//									"ProductId": "OP",
//									"Name": "Select Level"
//								}, {
//									"ProductId": "L1",
//									"Name": "L1"
//								}, {
//									"ProductId": "AMJD",
//									"Name": "AMJD"
//								}]
//						};
						//****************** End Of PCR019492--: 10280 : ASC606 UI Changes ****************************
						var oModel1 = this.getJSONModel(BSDAAssesItem);						
						parseInt(PSRSDAdata.PsrStatus)=== 15 && GenInfoData.Region === thisCntrlr.bundle.getText("S2OPPREGION") && PSRSDAdata.Asc606_BsdaFlag === "" ?
							(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false), 
							 oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setModel(oModel1),
							 oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"))): "";
//					  ****************** End Of PCR019492: ASC606 UI Changes ****************************
					} else if (rvsType) {
						PSrText = oResource.getText("S2PSRSDASTATREVISED");
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(false);                         //PCR019492++ 
					} else {
						PSrText = "";
					}
				}
			}
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).setText(PSrText);
		},
		/**
		 * This method is used to handle Related performance spec Review F4
		 * Help.
		 * 
		 * @name handleValueHelpRelPerSpecRew
		 * @param
		 * @returns
		 */
		handleValueHelpRelPerSpecRew: function() {
			var Guid = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData().Guid;
			var ItemGuid = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData()
				.ItemGuid;
			var Custno = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().Custno;
			var sGenaralChoos = "Cust_DocSet?$filter=Guid eq guid'" + Guid + "' and ItemGuid eq guid'" + ItemGuid +
				"' and Customer eq '" + Custno + "'and DocType eq 'MDT'";
			this.serviceCall(sGenaralChoos, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var oRelPerSpecRewModel = this.getJSONModel(thisCntrlr.getModelFromCore("RelPerSpecRewModel").getData());
			this.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRCBCCCF4helpOppLink"), this);
			this.getCurrentView().addDependent(this.dialog);
			this.dialog.setModel(oRelPerSpecRewModel);
			this.dialog.open();
		},
		/**
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
			var sValidate = "CustDoclinkSet(Guid=guid'" + GenInfoData.Guid + "',ItemGuid=guid'" + GenInfoData.ItemGuid + "')";
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.remove, "", thisCntrlr.bundle
				.getText("S2PSRSDACBCCCSUCSSMSG"));
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(true);
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(false);
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(
				false);
			//this.refreshRelPerSpecRewData(GenInfoData.Guid, GenInfoData.ItemGuid);                                                                 //PCR021481--
			this.getRefreshPSRData(GenInfoData.Guid, GenInfoData.ItemGuid);                                                                          //PCR021481++
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.bundle.getText("S2PSRSDAEDITBTNTXT"));       //PCR021481++
			this.onEditPSRSDA();                                                                                                                     //PCR021481++
			myBusyDialog.close();                                                                                                                    //PCR021481++
		},
		/**
		 * This method is used to handles Related performance spec Review
		 * data.
		 * 
		 * @name refreshRelPerSpecRewData
		 * @param Guid-Opportunity Guid , ItemGuid-Opportunity ItemGuid, refReq refresh required flag
		 * @returns 
		 */
		refreshRelPerSpecRewData: function(Guid, ItemGuid, refReq) {                                                                                //PCR022669++; added new parameter refReq
			if(refReq){                                                                                                                             //PCR022669++
				var sValidate = "PSRSDA_InfoSet(Guid=guid'" + Guid + "',ItemGuid=guid'" + ItemGuid +
				"')?$expand=NAV_BSDA_EVDOC,NAV_RRA_QA_PSR,NAV_CHANGE_HISTORY,NAV_CUST_REVSPEC,NAV_FINN_APRV_HIST,NAV_FINL_APRV_HIST,NAV_FNL_DOCS,NAV_PARL_APRV_HIST,NAV_REV_DOCS,NAV_PSR_CC,NAV_PSR_QA,NAV_SAF_QA,NAV_SDA_QA,NAV_SSDA_EVDOC,NAV_SSDA_FINN,NAV_SSDA_PARL,NAV_SSDA_FINL";  //PCR019903++
				this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			}			                                                                                                                            //PCR022669++
			var oppQuesdata = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			if (oppQuesdata.RevOppId === "" && oppQuesdata.RevOpitmId === "") {
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
					true);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(
					false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
					false);
			} else {
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
					false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(false);
				(oppQuesdata.RevOppId !== "" && oppQuesdata.RevOpitmId !== "") ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE)
					.setVisible(true)) : (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(false));
				if (parseInt(oppQuesdata.PsrStatus) === 4 || parseInt(oppQuesdata.PsrStatus) === 5) {
					this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(
						false);
				}
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).getItems()[0].setText(
					oppQuesdata.RevOppId + "-" + oppQuesdata.RevOpitmId)
			}
			if (oppQuesdata.NAV_FNL_DOCS.results[0].FileName !== "") {
				var cModel5 = this.getJSONModel([oppQuesdata.NAV_FNL_DOCS.results[0]]);
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setModel(
					cModel5);
			} else {
				var cModel5 = this.getJSONModel([]);
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setModel(
					cModel5);
			}
			if (oppQuesdata.SsdaReq === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
					true);
			} else if (oppQuesdata.SsdaReq === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
					true);
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
			}
			if (oppQuesdata.NAV_BSDA_EVDOC.FileName !== "") {
				oppQuesdata.NAV_BSDA_EVDOC.LinkViz = true;
				oppQuesdata.NAV_BSDA_EVDOC.UpdViz = false;
				var cModel9 = this.getJSONModel(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
					"GLBPSRMODEL")).getData().NAV_BSDA_EVDOC);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_FORM).setModel(cModel9);
			} else {
				oppQuesdata.NAV_BSDA_EVDOC.LinkViz = false;
				oppQuesdata.NAV_BSDA_EVDOC.UpdViz = true;
				var cModel9 = this.getJSONModel(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
					"GLBPSRMODEL")).getData().NAV_BSDA_EVDOC);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_FORM).setModel(cModel9);
			}
			if (oppQuesdata.NAV_SSDA_EVDOC.FileName !== "") {
				oppQuesdata.NAV_SSDA_EVDOC.LinkViz = true;
				oppQuesdata.NAV_SSDA_EVDOC.UpdViz = false;
				var cMode20 = this.getJSONModel(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
					"GLBPSRMODEL")).getData().NAV_SSDA_EVDOC);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDA_EVS_FORM).setModel(cMode20);
			} else {
				oppQuesdata.NAV_SSDA_EVDOC.LinkViz = false;
				oppQuesdata.NAV_SSDA_EVDOC.UpdViz = true;
				var cMode20 = this.getJSONModel(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
					"GLBPSRMODEL")).getData().NAV_SSDA_EVDOC);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDA_EVS_FORM).setModel(cMode20);
			}
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(false);
			if (parseInt(oppQuesdata.PsrStatus) >= 60) {
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(true);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(true);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(true);
			} else {
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(false);
			}
			//************************Start Of PCR019492: ASC606 UI Changes**************
			if(oppQuesdata.Asc606_BsdaFlag === ""){
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setVisible(true);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).setVisible(false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setVisible(true);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setHeaderText(thisCntrlr.bundle.getText("S2PSRSDABOOKINGSDAASSE"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_BSDAMTLVL).setText(thisCntrlr.bundle.getText("S2PSRSDASDAASSES"));
			} else if(oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				var OppGenInfoModel = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setVisible(false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).setVisible(true);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setVisible(false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setHeaderText(thisCntrlr.bundle.getText("S2PSRSDABOOKINGSDAASSEASC606"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_BSDAMTLVL).setText(thisCntrlr.bundle.getText("S2PSRSDASDAASSES606"));
				var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
				var RRAQuesData = thisCntrlr.getRRAQusData(oppQuesdata.PsrStatus, oppQuesdata.NAV_RRA_QA_PSR, GenInfoData.Region, false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
				oppQuesdata.ConAnsFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELLBLTXT)
					.setVisible(true), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELRRAVAL).setVisible(true), this.getView().byId(com.amat.crm
					.opportunity.Ids.S2PSRDC_BMOSELRRAVAL).setText(oppQuesdata.BmoRraValBsda)) : (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELLBLTXT)
					.setVisible(false), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELRRAVAL).setVisible(false));
				if(parseInt(oppQuesdata.PsrStatus) === 15 && thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText() === 
					thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT")){
					var BMOPosFlag = false;
					var TabData = this.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE).getModel().getData().items;
					for(var k = 0; k< TabData.length; k++){
						if (TabData[k].BMOValueState === "Error"){
							BMOPosFlag = true;
						}
					}
					BMOPosFlag === true ? this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(false) : this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
				}else if (parseInt(oppQuesdata.PsrStatus) >= 25 && parseInt(oppQuesdata.PsrStatus) !== 40){
							RRAQuesData.results[RRAQuesData.results.length-1].SelectionIndex > 0 ? ( oppQuesdata.BmoRraValBsda !== oppQuesdata.Bsdl && oppQuesdata.Bsdl !== "" ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE)
								.setVisible(true), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setValue(oppQuesdata.ConComments), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setTooltip(oppQuesdata
										.ConComments), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setEnabled(false)) : this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setVisible(false)):"";
						}
			}
			if(oppQuesdata.Asc606_SsdaFlag  === ""){				
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SMANDAT_FID).setText(thisCntrlr.bundle.getText("S2PSRSDASHIPPINGLEVQUESTION"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setHeaderText(thisCntrlr.bundle.getText("S2PSRSDASHIPPINGSDAASSES"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SSDAMTLVL).setText(thisCntrlr.bundle.getText("S2PSRSDASDAASSES"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setVisible(true);
			} else if(oppQuesdata.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SMANDAT_FID).setText(thisCntrlr.bundle.getText("S2PSRSDASHIPPINGLEVQUESTIONASC606"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setHeaderText(thisCntrlr.bundle.getText("S2PSRSDASHIPPINGSDAASSESASC606"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SSDAMTLVL).setText(thisCntrlr.bundle.getText(thisCntrlr.bundle.getText("S2PSRSDASDAASSES606")));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setVisible(false);
			}
			oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") || oppQuesdata.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ?
					(this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_CNGHISPNL).setVisible(true),this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_CNGHISTAB).setModel(
							this.getJSONModel(oppQuesdata.NAV_CHANGE_HISTORY))) : this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_CNGHISPNL).setVisible(false);			
			//************************End Of PCR019492: ASC606 UI Changes**************
			//************************Start Of PCR019492: 10257 : ASC606 UI Changes**************
		    if(oppQuesdata.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") && oppQuesdata.PsrRequired === ""){
		    	this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).getButtons()[2].setText(thisCntrlr.bundle.getText("S2PSRDCSDANTAPPTXTASC606")); 
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).getParent().getItems()[0].getItems()[0].setText(thisCntrlr.bundle.getText("S2PSRRRAMADATDETRTXTASC606"));
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setText(thisCntrlr.bundle.getText("S2PSRSDAICONTABFTEXTASC606"));
			}
		  //************************End Of PCR019492: 10257 : ASC606 UI Changes**************
		  //************************Start of PCR021481++ : 4190: Q2C Q1/Q2 enhancements **************
		    var rdBtnGrp = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp);
			if(oppQuesdata.PsrRequired === "" && oppQuesdata.Asc606_Flag === this.bundle.getText("S2ODATAPOSVAL")){
				var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			    if(GenInfoData.Region === this.bundle.getText("FRAGLLAMJ")){
				     rdBtnGrp.getButtons().length >= 4 ? that_views2.getController().createRdBtn(this.bundle.getText("S2PSRRRANTAPPTXTAMJD"), rdBtnGrp): "";
			    //}if(GenInfoData.ItmDesc.substring(0,4) === this.bundle.getText("S2PSRDCEVALPROPTXT")){                                                       PCR022669-- 
			    }if(GenInfoData.EvalFlag === this.bundle.getText("S1TABLESALESTAGECOL")){                                                                    //PCR022669++
				rdBtnGrp.getButtons().length >= 4 ? that_views2.getController().createRdBtn(this.bundle.getText("S2PSRDCNEWEVALTXT"), rdBtnGrp): "";         //PCR033317++; S2PSRDCEVALTXT replaced with S2PSRDCNEWEVALTXT
			    }						
		    } else {
		    	if(rdBtnGrp.getButtons().length > 4){
					for(var i = 4; i < rdBtnGrp.getButtons().length; i++){
						rdBtnGrp.getButtons()[i].destroy();
						i--;
					}
				}
		    }
			//************************End of PCR021481++ : 4190: Q2C Q1/Q2 enhancements **************
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
					.FilterOperator.Contains, sQuery)];                                                                                                       //PCR026469++; added ;
				oFilter = new sap.ui.model.Filter(aFilters, false);
			}
			//var binding = this.dialog.getContent()[2].getBinding("items");                                                                                  //PCR026469--
			var binding = oEvent.getSource().getParent().getParent().getContent()[2].getBinding("items");                                                     //PCR026469++
			binding.filter(oFilter);
		},
		/**
		 * This Method Handles Reference Opportunity Not in the List Button Press Event.
		 * 
		 * @name onPressNotInList
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onPressNotInList: function(oEvent) {
			var oview = thisCntrlr.getView();
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
				.getText("S2ICONTABPSRSDAKEY")) {
				if (oEvent.getSource().getText() === thisCntrlr.bundle.getText("S2PSRSDANTINLISTBTN")) {
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setText(thisCntrlr.bundle
						.getText("S2PSRSDACANBTNTXT"));
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setIcon(thisCntrlr.bundle
						.getText("S2CANCELBTNICON"));
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType
						.Reject);
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE).setVisible(false);
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
						false);
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(
						false);
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(
						true);
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
						true);
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
						false);
					this.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRREFERENCEOPPSELCTDIALOG"),
						this);
					thisCntrlr.getCurrentView().addDependent(this.dialog);
					this.dialog.open();
					this.dialog.getContent()[0].getContent()[1].setValueState(sap.ui.core.ValueState.Error);
				} else {
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setText(thisCntrlr.bundle
						.getText("S2PSRSDANTINLISTBTN"));
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setIcon(thisCntrlr.bundle
						.getText("S2SUBMTFORAPPBTN"));
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType
						.Emphasized);
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(
						false);
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
						false);
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(
						true);
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
						true);
					oview.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
				}
			} else {
				if (oEvent.getSource().getText() === thisCntrlr.bundle.getText("S2PSRSDANTINLISTBTN")) {
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setText(thisCntrlr.bundle
						.getText("S2PSRSDACANBTNTXT"));
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setIcon(thisCntrlr.bundle
						.getText("S2CANCELBTNICON"));
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType
						.Reject);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setEnabled(true);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE).setVisible(false);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
						false);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(
						false);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(true);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
						true);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
						false);
					this.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRREFERENCEOPPSELCTDIALOG"),
						this);
					thisCntrlr.getCurrentView().addDependent(this.dialog);
					this.dialog.open();
					this.dialog.getContent()[0].getContent()[1].setValueState(sap.ui.core.ValueState.Error);
				} else {
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setText(thisCntrlr.bundle
						.getText("S2PSRSDANTINLISTBTN"));
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setIcon(thisCntrlr.bundle
						.getText("S2SUBMTFORAPPBTN"));
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType
						.Emphasized);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(
						false);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
						false);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(true);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
						true);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(true);
				}
			}
		},
		/**
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
		 * This Method Handles Look-Up Button Press Event.
		 * 
		 * @name onLookUp
		 * @param 
		 * @returns 
		 */
		onLookUp: function() {
			if (!window.location.origin) {
				window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location
					.port ? ':' + window.location.port : '');
			}
			var sBaseUrl = window.location.origin;
			var sServiceUrl = sBaseUrl + com.amat.crm.opportunity.util.ServiceConfigConstants.getMyOpportunityInfoURL;
			var model = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
			var kpu = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData().Kpu;
			var pbg = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().Bu;
			var ProductLine = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData()
				.ProductLine;
			ProductLine.indexOf("&") !==0 ? ProductLine = ProductLine.replace("&","-") : "";                                                                       //PCR018375++
			var contactTyp = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData().GlobalAccount;                                 //PCR018375++
			this.lookUpList = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRLOOKUPLISTDIALOG"), this);
			thisCntrlr.getCurrentView().addDependent(this.lookUpList);
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
				.getText("S2ICONTABPSRSDAKEY")) {
				//***************Justification: PCR018375++ Phase2 - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
//				model.read("/LookUpSet?$filter=Pbg eq '" + pbg + "' and Kpu eq '" + kpu + "'", null, null, false,                                                  //PCR018375--
//				model.read("/LookUpSet?$filter=Pbg eq '" + pbg + "' and Kpu eq '" + ProductLine + "'and ContactType eq '" + contactTyp + "'", null, null, false,   //PCR018375++ - Kpu target value changed and Contact Type added
				model.read("/LookUpSet?$filter=Pbg eq '" + pbg + "' and Kpu eq '" + ProductLine + "' and Amc eq '" + kpu + "'", null, null, false,                 //PCR019492++ - Kpu target value changed & kpu value mapped with new Amc property
					function(oData, oResponse) {
						thisCntrlr.lookupData = thisCntrlr.groupBy(oData.results, thisCntrlr.getResourceBundle().getText("S2CONCTTYPEPROPTEXT"));
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
				model.read("/LookUpSet?$filter=Pbg eq '" + pbg + "' and Kpu eq '" + ProductLine + "'", null, null,
					false,
					function(oData, oResponse) {
						thisCntrlr.lookupData = thisCntrlr.groupBy(oData.results, thisCntrlr.getResourceBundle().getText("S2CONCTTYPEPROPTEXT"));
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
			this.lookUpList.setModel(new sap.ui.model.json.JSONModel(), thisCntrlr.getResourceBundle().getText(
				"S2PSRCBCATTDFTJSONMDLTXT"));
			this.lookUpList.open();
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
				var kpu = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData()
					.Kpu;
				var pbg = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData()
					.Bu;
				var GA = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData().GlobalAccount;
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
			this.closeDialog();
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle.getText("S2ICONTABPSRSDAKEY")) {
				if (SelectedOppId !== "") {
					thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().RevOppId = SelectedOppId;
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setValue(SelectedOppId);
					(this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle.getText(
						"S2PSRSDAEDITBTNTXT")) ?
					(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(true)) :
					((this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle.getText(
						"S2PSRSDACANBTNTXT")) ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(
						false)) : (""));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX).setVisible(false);
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2REFOPPSLCTSUCSSMSG"));
					var FPSRDocData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().NAV_REV_DOCS.results;
					var FPSRDoc = thisCntrlr.loadFPSRevDocData(FPSRDocData, true, true);
					var oFPSRDocJModel = this.getJSONModel({
						"ItemSet": FPSRDoc
					});
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE).setModel(oFPSRDocJModel);
					thisCntrlr.setTableNoteEnable(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE).setVisible(true);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(false);
				}
			} else {
				if (SelectedOppId !== "") {
					thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().RevOppId = SelectedOppId;
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setValue(SelectedOppId);
					thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().RevOppId = SelectedOppId;
					(that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle.getText(
						"S2PSRSDAEDITBTNTXT")) ?
					(that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(true)) :
					((that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle.getText(
							"S2PSRSDACANBTNTXT")) ? (that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(false)) :
						(""));
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLIST_BOX).setVisible(false);
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2REFOPPSLCTSUCSSMSG"));
					var FPSRDocData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().NAV_REV_DOCS.results;
					var FPSRDoc = thisCntrlr.loadFPSRevDocData(FPSRDocData, true, true);
					var oFPSRDocJModel = this.getJSONModel({
						"ItemSet": FPSRDoc
					});
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE).setModel(oFPSRDocJModel);
					thisCntrlr.setTableNoteEnable(that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE));
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RPDC_DOC_TABLE).setVisible(true);
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(false);
				}
			}
		},
		/**
		 * This Method Handles Reference PSR Panel Expanded Event.
		 * 
		 * @name onRPSRExpand
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onRPSRExpand: function(oEvent) {
			var oView = thisCntrlr.getView();
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			if (oEvent.getParameters().expand === true) {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setValue(
					"");
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE).setVisible(false);
				if (PSRData.RevOppId !== "" && PSRData.RevOpitmId === "") {
					var SecurityData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBSECURITYMODEL")).getData();
					var RefSpecRev1 = [],
						UpldCustSpecVis, Enableflag = false,
						Enabledelflag = false;
					(SecurityData.UpldCustSpec === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (
						UpldCustSpecVis = true) : (UpldCustSpecVis = false);
					var RPSRDocData = PSRData.NAV_REV_DOCS.results;
					(parseInt(PSRData.PsrStatus) === 4 || parseInt(PSRData.PsrStatus) ===
						5) ? ((oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() ===
						thisCntrlr.bundle.getText("S2PSRSDAEDITBTNTXT")) ? (Enableflag = false, Enabledelflag =
						false) : (Enableflag = true, Enabledelflag = true)) : ("");
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setValue(
						PSRData.RevOppId);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(
						false);
					if (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle
						.getText("S2PSRSDAEDITBTNTXT")) {
						RefSpecRev1 = this.loadFPSRevDocData(RPSRDocData, false, false);
					} else {
						RefSpecRev1 = this.loadFPSRevDocData(RPSRDocData, Enableflag, Enabledelflag);
						Enableflag === true ? oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(true) :
							 oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(false);                                    //PCR021481++
					}
					var oRPSRDocJModel = this.getJSONModel({
						"ItemSet": RefSpecRev1
					});
					var oRPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE);
					oRPSRDocTable.setModel(oRPSRDocJModel);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE).setVisible(true);
				} else if (PSRData.RevOppId !== "" && PSRData.RevOpitmId !== "") {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(
						true);
					if (parseInt(oppQuesdata.PsrStatus) === 4 || parseInt(oppQuesdata.PsrStatus) === 5) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(
							false);
					}
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).getItems()[0].setText(
						oppQuesdata.RevOppId + "-" + oppQuesdata.RevOpitmId);
					if (oppQuesdata.NAV_FNL_DOCS.results[0].FileName !== "") {
						var cModel5 = this.getJSONModel([PSRData.NAV_FNL_DOCS.results[0]]);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setModel(
							cModel5);
					} else {
						var cModel5 = this.getJSONModel([]);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setModel(
							cModel5);
					}
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
						true);
				} else if (PSRData.RevOppId === "" && PSRData.RevOpitmId === "") {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).getModel().getData()
						.length === 0 ? oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX)
						.setVisible(true) : oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX)
						.setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setText(thisCntrlr.bundle
						.getText("S2PSRSDANTINLISTBTN"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setIcon(thisCntrlr.bundle
						.getText("S2SUBMTFORAPPBTN"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType
						.Emphasized);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
					(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle
						.getText("S2PSRSDAEDITBTNTXT")) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn)
						.setEnabled(false)) : ((oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() ===
						thisCntrlr.bundle.getText("S2PSRSDACANBTNTXT")) ? (oView.byId(com.amat.crm.opportunity
						.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setEnabled(true)) : (""));
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
						false);
				}
			}
			(parseInt(PSRData.PsrStatus) >= 15) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setEnabled(false)) :
			((oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle.getText("S2PSRSDAEDITBTNTXT")) ?
				(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setEnabled(false)) : (oView.byId(com.amat.crm.opportunity.Ids
					.S2PSR_SDA_PANL_BT_NOTINLISTtn).setEnabled(true)));
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
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle.getText(
					"S2ICONTABPSRSDAKEY")) {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setText(thisCntrlr.bundle
					.getText("S2PSRSDANTINLISTBTN"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setIcon(thisCntrlr.bundle
					.getText("S2SUBMTFORAPPBTN"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType.Emphasized);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
			} else {
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setText(thisCntrlr.bundle
					.getText("S2PSRSDANTINLISTBTN"));
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setIcon(thisCntrlr.bundle
					.getText("S2SUBMTFORAPPBTN"));
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType.Emphasized);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(false);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(false);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(true);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(true);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
				that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(true);
			}
		},
		/**
		 * This method Handles Edit Button Press Event.
		 * 
		 * @name handleEditPress
		 * @param evt - Event Handler
		 * @returns 
		 */
		handleEditPress: function(evt) {
			oCommonController.commonEditPress(evt, thisCntrlr);
		},
		/**
		 * This method Handles Add Button Press Event.
		 * 
		 * @name handleAddPress
		 * @param evt - Event Handler
		 * @returns 
		 */
		handleAddPress: function(evt) {
			oCommonController.commonAddPress(evt, thisCntrlr);
		},
		/* This method is used to apply security on table in PSR/PDC.
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
		 * This method Handles Customer Spec Rev1 Delete Button Complete Event.
		 * 
		 * @name CheckRev1Delete
		 * @param evt - Event Handler
		 * @returns 
		 */
		CheckRev1Delete: function(evt) {
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
		},
		/**
		 * This method Handles Customer Spec Rev1 Delete Button Complete Event.
		 * 
		 * @name handleRev1DeletePress
		 * @param evt - Event Handler
		 * @returns 
		 */
		handleRev1DeletePress: function(evt) {
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
									thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
									thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
									thisCntrlr.onEditPSRSDA();
								} else {
									that_pdcsda.getController().getPDCData();
									that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
									that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
									thisCntrlr.onEditPDCSDA();
								}
							},
							error: function(data) {
								thisCntrlr.onSpecDelError();
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
									thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
									thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
									thisCntrlr.onEditPSRSDA();
								} else {
									that_pdcsda.getController().getPDCData();
									that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
									that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
									thisCntrlr.onEditPDCSDA();
									that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
									that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(
										thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
									thisCntrlr.onEditPDCSDA();
								}
							},
							error: function(data) {
								thisCntrlr.showToastMessage(data.responseText.split("<message xml:lang=")[1].split(">")[1].split("<")[0]);
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
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITBTNTXT"));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITICON"));
					thisCntrlr.onEditPSRSDA();
				} else {
					that_pdcsda.getController().getPDCData();
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITBTNTXT"));
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITICON"));
					thisCntrlr.onEditPDCSDA();
				}
			}
			myBusyDialog.close();
		},
		/**
		 * This method Handles on Delete Error Msg Handling.
		 * 
		 * @name onSpecDelError
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onSpecDelError: function() {
			thisCntrlr.showToastMessage(data.responseText.split("<message xml:lang=")[1].split(">")[1].split("<")[0]);
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
				thisCntrlr.getResourceBundle().getText("S2ICONTABPSRSDAKEY")) {
				var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBPSRMODEL")).getData();
				var CustSpecRev1Data = PSRData.NAV_CUST_REVSPEC.results;
				var CustTable = thisCntrlr.oBookingDocTable;
			} else {
				that_pdcsda.getController().getPDCData();
				var PDCData = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBPDCSDAMODEL")).getData();
				var CustSpecRev1Data = PDCData.NAV_CUST_REVSPEC.results;
				var CustTable = that_pdcsda.getController().oBookingDocTable;
			}
			var CustSpecRev1 = thisCntrlr.loadFPSRevDocData(CustSpecRev1Data, true, true, true);
			var oCustSpecRev1JModel = this.getJSONModel({
				"ItemSet": CustSpecRev1
			});
			CustTable.setModel(oCustSpecRev1JModel);
			thisCntrlr.setTableNoteEnable(thisCntrlr.oBookingDocTable);
			thisCntrlr.setTableSecurity(thisCntrlr.oBookingDocTable);
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
		/**
		 * This method Handles Customer Spec Rev1 File upload Complete Event.
		 * 
		 * @name handleRevFileUploadComplete
		 * @param evt - Event Handler
		 * @returns 
		 */
		handleRevFileUploadComplete: function(evt) {
//			sap.ui.core.BusyIndicator.show();                                                                                                        //PCR019492--
			var myBusyDialog = thisCntrlr.getBusyDialog();                                                                                           //PCR019492++
			myBusyDialog.open();                                                                                                                     //PCR019492++
			var uploadButton = evt.getSource().getParent().getParent().mAggregations.items[1];
			var rowIndex = uploadButton.getId().split("-")[uploadButton.getId().split("-").length - 1];
			var r = evt.getSource().getParent().getParent().getParent().mAggregations.cells[1];
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
			var SLUG = oTable.getModel().getData().ItemSet[rowIndex].itemguid.replace(/-/g, "").toUpperCase() + "$$" + oTable.getModel()                 //PCR035760++ Defect#131 TechUpgrade changes
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
			myBusyDialog.close();                                                                                                                     //PCR019492++
		},
		/**
		 * This method Handles On Upload Complete Event.
		 * 
		 * @name onEvidenceUploadComplete
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onEvidenceUploadComplete: function(oEvent) {
			var myBusyDialog = thisCntrlr.getBusyDialog();                                                                                           //PCR019492++
			myBusyDialog.open();                                                                                                                     //PCR019492++
			if (oEvent.getParameters().status === 201) {
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
					.getText("S2ICONTABPSRSDAKEY")) {
					thisCntrlr.onPSRSDADataSave();
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITICON"));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITBTNTXT"));
					thisCntrlr.onEditPSRSDA();
				} else {
					var obj = this.PDCSDAPayload(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
							"GLBPDCSDAMODEL")).getData().PsrStatus, thisCntrlr.bundle.getText("S2PSRSDASAVETXT"),
						"");
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText(
							"S2PSRSSDACBCVALIDSAVEMSG"));
					that_pdcsda.getController().getPDCData();
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITICON"));
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITBTNTXT"));
					thisCntrlr.onEditPDCSDA();
				}
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCATTDOCUPLDSUCSSMSG"));
			} else if (oEvent.getParameters().status === 400) {
				thisCntrlr.onPSRSDADataSave();
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
					.getText("S2ICONTABPSRSDAKEY")) {
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITICON"));
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITBTNTXT"));
					thisCntrlr.onEditPSRSDA();
				} else {
					that_pdcsda.getController().getPDCData();
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITICON"));
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
						.getText("S2PSRSDAEDITBTNTXT"));
					thisCntrlr.onEditPDCSDA();
				}
				thisCntrlr.showToastMessage($(oEvent.mParameters.responseRaw).find(thisCntrlr.getResourceBundle().getText(
					"S2CBCPSRCARMTYPEMESG")).text());
			}
//			sap.ui.core.BusyIndicator.hide();                                                                                                         //PCR019492--
			myBusyDialog.close();                                                                                                                     //PCR019492++
		},
		/**
		 * This method Handles Customer Spec Rev1 Panel Expended Event.
		 * 
		 * @name handleCustSpecRev1Exp
		 * @param oEvt: Event Handler
		 * @returns 
		 */
		handleCustSpecRev1Exp: function(oEvt) {
			var SecurityData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBSECURITYMODEL")).getData();
			var CustSpecRev1 = [],
				UpldCustSpecVis, Enableflag = false,
				Enabledelflag = false;
			(SecurityData.UpldCustSpec === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (UpldCustSpecVis =
				true) : (UpldCustSpecVis = false);
			var iconTabBtn = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB);
			if (iconTabBtn.getSelectedKey() === thisCntrlr.bundle.getText("S2ICONTABPDCSDAKEY")) {
				var PDCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData();
				var CustSpecRev1Data = PDCData.NAV_PDCCUST_REVSPEC.results;
				thisCntrlr.oBookingDocTable = this.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE);
				var gsmUserList = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData().NAV_GSM_INFO.results;
				var gsmUserFlag = that_pdcsda.getController().checkPDCUsersfromlist(gsmUserList);
				(parseInt(PDCData.PsrStatus) === 605 || (parseInt(PDCData.PsrStatus) === 640 && gsmUserFlag === true)) ? ((this.getView().byId(com
					.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle.getText("S2PSRSDAEDITBTNTXT")) ? (Enableflag =
					false, Enabledelflag = false) : (Enableflag = true, Enabledelflag = true)) : ("");
				var Editbtn = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn);
			} else {
				var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
				var CustSpecRev1Data = PSRData.NAV_CUST_REVSPEC.results;
				(parseInt(PSRData.PsrStatus) === 4 || parseInt(PSRData.PsrStatus) ===
					5) ? ((this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle
					.getText("S2PSRSDAEDITBTNTXT")) ? (Enableflag = false, Enabledelflag = false) : (Enableflag =
					true, Enabledelflag = true)) : ("");
				(parseInt(PSRData.PsrStatus) ===
					15) ? ((this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() === this
						.getResourceBundle().getText("S2PSRSDAEDITBTNTXT")) ? (Enableflag = false, Enabledelflag = false) :
					(Enableflag = false, Enabledelflag = false)) : ("");
				thisCntrlr.oBookingDocTable = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_TABLE);
				var Editbtn = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn);
			}
			CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, Enableflag, Enabledelflag);
			var oCustSpecRev1JModel = this.getJSONModel({
				"ItemSet": CustSpecRev1
			});
			thisCntrlr.oBookingDocTable.setModel(oCustSpecRev1JModel);
			this.setTableNoteEnable(thisCntrlr.oBookingDocTable);
			this.setTableSecurity(thisCntrlr.oBookingDocTable);
		},
		/**
		 * This method Handles SDA Questions Selection Radio Button Event.
		 * 
		 * @name onSDAQuesSelection
		 * @param oEvt: Event Handler
		 * @returns 
		 */
		onSDAQuesSelection: function(oEvt) {
			var changeLine = oEvt.getSource().getParent().getBindingContext().getPath().slice(-1);
			var Model = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBSDAQESMODEL")).getData();
			for (var i = 0; i < Model.items[0].length; i++) {
				if (parseInt(changeLine) === i) {
					if (parseInt(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().PsrStatus) ===
						15) {
						if (oEvt.getParameters().selectedIndex === 1) {
							Model.items[0][i].Selected = true;
							thisCntrlr.MandateData.items[0][i].SelectionIndex = 1;
						} else if (oEvt.getParameters().selectedIndex === 2) {
							Model.items[0][i].Selected = false;
							thisCntrlr.MandateData.items[0][i].SelectionIndex = 2;
						}
					}
				}
			}
			var FinalSDAQus = {
				"items": []
			};
			FinalSDAQus.items = this.validatSDAQues(Model);
			var FinalSDAQuesItems = this.fnConTableModel(FinalSDAQus.items.items, true);
			var cModel1 = this.getJSONModel(FinalSDAQuesItems);
			var oSDATableItems = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_TABLE);
			var oSDAItemTemplate = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_TEMPLATE);
			oSDATableItems.setModel(cModel1);
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
		 * This method Handles Final Spec Panel Expended Event.
		 * 
		 * @name handleFPSRDocPnlExp
		 * @param evt: Event Handler
		 * @returns 
		 */
		handleFPSRDocPnlExp: function(evt) {
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var SecurityData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBSECURITYMODEL")).getData();
			var FPSRDoc = [],
				UpldFnlSpecVis, Enableflag = false,
				Enabledelflag = false;
			(SecurityData.UpldFnlSpec === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (UpldFnlSpecVis =
				true) : (UpldFnlSpecVis = false);
			var FPSRDocData = PSRData.NAV_FNL_DOCS.results;
			(parseInt(PSRData.PsrStatus) ===
				17) ? ((this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle
				.getText("S2PSRSDAEDITBTNTXT")) ? (Enableflag = false, Enabledelflag = false) : (Enableflag = true,
				Enabledelflag = true)) : ("");
			FPSRDoc = this.loadFPSRevDocData(FPSRDocData, Enableflag, Enabledelflag);
			var oFPSRDocJModel = this.getJSONModel({
				"ItemSet": FPSRDoc
			});
			thisCntrlr.oFPSRDocTable = this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_TABLE);
			thisCntrlr.oFPSRDocTable.setModel(oFPSRDocJModel);
			this.setTableNoteEnable(thisCntrlr.oFPSRDocTable);
			this.setTableSecurity(thisCntrlr.oFPSRDocTable);
		},
		/**
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
		/**
		 * This method is used to handles BSDA Assessment level selection event.
		 * 
		 * @name onComboSelectionChange
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onComboSelectionChange: function(oEvent) {
			if (oEvent.getParameters().selectedItem.getText() === thisCntrlr.bundle.getText(
					"S2PSRSDAPDCSSDALVLDEFAULTTXT")) {
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRPDCBSSDAOPMSG"));
			} else {
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
					.getText("S2ICONTABPSRSDAKEY")) {
					var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();                                               //PCR019492++
					thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().Bsdl = oEvent.getParameters()
					.selectedItem.getText();
					if(PSRData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                                                                      //PCR019492++
						var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();                                //PCR019492++
						var RRAQuesData = thisCntrlr.getRRAQusData(PSRData.PsrStatus, PSRData.NAV_RRA_QA_PSR, GenInfoData.Region, false);                        //PCR019492++
						RRAQuesData.results[RRAQuesData.results.length-1].SalesFlg !== "" ? ( PSRData.BmoRraValBsda !== PSRData.Bsdl ? (                         //PCR019492++
							this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setVisible(true), this.getView().byId(com.amat.crm.opportunity   //PCR019492++
							.Ids.S2PSR_RRADEFFNOTE).setValue(PSRData.ConComments), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE)           //PCR019492++
							.setTooltip(PSRData.ConComments)) : this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setVisible(false)):"";       //PCR019492++
					}                                                                                                                                            //PCR019492++					
				} else {
					thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().Bsdl =
						oEvent.getParameters().selectedItem.getText();
					if (oEvent.getParameters().selectedItem.getText() === thisCntrlr.bundle.getText(
							"S2BSDASSMENTLVL1") || oEvent.getParameters().selectedItem.getText() === thisCntrlr.bundle
						.getText("S2BSDASSMENTLVL2")) {
						that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
							true);
					} else {
						that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
							false);
					}
				}
			}
		},
		/**
		 * This method is used to handles BSDA Justification Value Live Change event.
		 * 
		 * @name onBSDATextChange
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onBSDATextChange: function(oEvent) {
			//***************Start Of PCR021481--: 4190 : Q2C Q1/Q2 enhancements ********
			//if (oEvent.getParameters().value.length >= 255) {
			//	var JustificationTxt = oEvent.getParameters().value.substr(0, 254);
			//	if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle.getText("S2ICONTABPSRSDAKEY")) {
			//		thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setValue(JustificationTxt);
			//	} else {
			//		that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SDASSES_TEXT_AREA).setValue(JustificationTxt);
			//	}
			//	thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCMCOMMVALTXT"));
			//} else {
			//***************End Of PCR021481--: 4190 : Q2C Q1/Q2 enhancements ********
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle.getText("S2ICONTABPSRSDAKEY")) {
					thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().BsdaJustfication = oEvent.getParameters().value;
				} else {
					thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().BsdaJustfication = oEvent.getParameters().value;
				}
			//}                                                                                                                                                 //PCR021481--
		},
		/**
		 * This method is used For Validating SSDA Process Current User Permission.
		 * 
		 * @name ValidateSSDAUser
		 * @param 
		 * @returns 
		 */
		ValidateSSDAUser: function() {
			var ValidateSFlag = false;
			var bomUserList = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData()
				.NAV_BMO_INFO.results;
			var bomInitiateFlag = this.checkContact(bomUserList);
			(bomInitiateFlag === true) ? (ValidateSFlag = true) : (ValidateSFlag = false);
			return bomInitiateFlag;
		},
		/**
		 * This method is used For Initiating SSDA Process Radio Button Event.
		 * 
		 * @name onSelectSRBMandat
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onSelectSRBMandat: function(oEvent) {
			var oView = this.getView();
			var ValidateSSDA = this.ValidateSSDAUser();
			if (ValidateSSDA === false) {
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2USERALLAUTHFALTTXT"));
			} else {
				if (oEvent.getParameters().selectedIndex === 1) {
					var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setSelectedIndex(-
						1);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_TEXT_AREA).setEnabled(
						false);
					this.InitiateSSDA();
					myBusyDialog.close();
				} else {
					var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setSelectedIndex(-
						1);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false);
					this.SSDANotReq();
					myBusyDialog.close();
				}
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
			}
		},
		/**
		 * This method Handles SSDA Initiation Process.
		 * 
		 * @name InitiateSSDA
		 * @param 
		 * @returns 
		 */
		InitiateSSDA: function() {
			var oppQuesdata = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL"));
			var obj = {};
			obj.ActionType = "";
			obj.AprvComments = oppQuesdata.AprvComments;
			obj.Bd = oppQuesdata.Bd;
			obj.Bsdl = oppQuesdata.Bsdl;
			obj.ConComments = oppQuesdata.ConComments;                                                                                    //PCR019492++
			obj.Custno = oppQuesdata.Custno;
			obj.Guid = OppGenInfoModel.getData().Guid;
			obj.InitiatedBy = "";
			//obj.InitiatedDt = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                        //PCR035760-- Defect#131 TechUpgrade changes
			obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
			obj.PsrRequired = oppQuesdata.PsrRequired;
			//***************Justification: PCR018375++ Phase2 - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
//			obj.PsrStatDesc = "";                                                                                                         //PCR018375--
			obj.PsrStatDesc = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData().ProductLine;         //PCR018375++ - PsrStatDesc property mapped with Product Line
			obj.PsrStatus = "65";
			obj.PsrType = oppQuesdata.PsrType;
			obj.RevOpitmId = oppQuesdata.RevOpitmId;
			obj.RevOppId = oppQuesdata.RevOppId;
			obj.Sd = oppQuesdata.Sd;
			obj.SsdaReq = thisCntrlr.bundle.getText("S2POSMANDATANS");
			obj.Ssdl = oppQuesdata.Ssdl;
			obj.TaskId = oppQuesdata.TaskId;
			obj.Time = thisCntrlr.bundle.getText("S2OPPAPPPAYLODTMEKEY");
			obj.WiId = oppQuesdata.WiId;
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat.crm.opportunity
				.util.ServiceConfigConstants.write, obj, thisCntrlr.bundle.getText("S2PSRSDASSDAINITPOSTXT"));
			this.fnSetVisibility(thisCntrlr.bundle.getText("S2POSMANDATANS"));
			this.getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
			that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Critical);
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.bundle
				.getText("S2PSRSDAEDITICON"));
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.bundle
				.getText("S2PSRSDAEDITBTNTXT"));
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setVisible(true);
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setEnabled(true);
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setEnabled(false);
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true);
		},
		/**
		 * This method is used to Handle PSR-SDA Tab Content Visibility.
		 * 
		 * @name fnSetVisibility
		 * @param PsrRequired: Yes or No
		 * @returns 
		 */
		fnSetVisibility: function(PsrRequired) {
			this._initiateControllerObjects();
			var oView = thisCntrlr.getView();
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var SecurityData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBSECURITYMODEL")).getData();
			var InitPSR = "";
			var Bar = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_BAR);
			var PSRDecisionBox = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox);
			var PSRDecisionContent = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISION_CONTENT);
			var LookUpBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LOOKUP_LISTBtn);
			var EditBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn);
			var SaveBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn);
			var SFAPRBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn);
			var iconTabBtn = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB);
			SFAPRBtn.setIcon(thisCntrlr.bundle.getText("S2PSRSDAWFICON"));
			SFAPRBtn.setText(thisCntrlr.bundle.getText("S2PSRSDASUBFORAPP"));
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
			Bar.addStyleClass(thisCntrlr.bundle.getText("S2PSRSDABARINITCLS"));
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_CARBON_COPY).setEnabled(true);
			//oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(false);                                                //PCR025717--
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_CARBON_COPY).setEnabled(false);
			//oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(false);                                                //PCR025717--
			(PSRData.NAV_PSR_CC.results.length > 0) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_PANEL)
				.setExpanded(true)) : (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_PANEL)
				.setExpanded(false));
			if (PsrRequired === "") {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(
					false);
				Bar.setVisible(false);
				PSRDecisionBox.setVisible(true);
				PSRDecisionContent.setVisible(false);
				if (iconTabBtn.getSelectedKey() === thisCntrlr.bundle.getText("S2ICONTABPSRSDAKEY")) {
					that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Default);
				}
				LookUpBtn.setVisible(false);
				EditBtn.setVisible(false);
				SaveBtn.setVisible(false);
				SFAPRBtn.setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(
					false);
			} else if (PsrRequired === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
				//************************Start Of PCR019492: ASC606 UI Changes**************
				if(PSRData.OldBsdaVal !== ""){
					this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_OLDSDAVAL).setVisible(true);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_OLDSDAVAL).setText(PSRData.OldBsdaVal);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_OLDSDALBL).setVisible(true);
				} else {
					this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_OLDSDAVAL).setVisible(false);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_OLDSDALBL).setVisible(false);
				}
				//************************End Of PCR019492: ASC606 UI Changes**************
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FORM_DISPLAY_482).setVisible(true);
				Bar.setVisible(true);
				PSRDecisionBox.setVisible(false);
				PSRDecisionContent.setVisible(true);
				if (iconTabBtn.getSelectedKey() === thisCntrlr.bundle.getText("S2ICONTABPSRSDAKEY")) {
					that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Critical);
				}
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CONTACTINFO_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLEFORM_DISPLAY_360).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecTYPE_PANEL).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLEFORM_DISPLAY_370).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_B_APPROVALS_PANEL).setVisible(true);
				(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX.getVisible ===
					false)) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(
					false)) : (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(
					true));
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(false);
				if (PSRData.RevOppId !== "" && PSRData.RevOpitmId !== "") {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
						false);
					if (parseInt(PSRData.PsrStatus) === 4 || parseInt(PSRData.PsrStatus) === 5) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(
							false);
					}
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(
						false);
				} else if (PSRData.RevOppId !== "" && PSRData.RevOpitmId === "") {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(false);                                           //PCR021481++
				} else if (PSRData.RevOppId === "" && PSRData.RevOpitmId === "") {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW).setVisible(
						true);
				}
				LookUpBtn.setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(false);
				(PSRData.SendApproval === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (SFAPRBtn.setVisible(true), SFAPRBtn.setEnabled(
					true)) : (SFAPRBtn.setVisible(false), SFAPRBtn.setEnabled(false));
				(PSRData.CcOppId === "" && PSRData.CcOpitmId === "") ? (EditBtn.setVisible(true), SaveBtn.setVisible(true), SFAPRBtn.setVisible(
					true)) : (EditBtn.setVisible(
					false), SFAPRBtn.setVisible(false), SaveBtn.setVisible(false));
			} else {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(
					false);
				Bar.setVisible(true);
				PSRDecisionBox.setVisible(false);
				PSRDecisionContent.setVisible(false);
				if (iconTabBtn.getSelectedKey() === thisCntrlr.bundle.getText("S2ICONTABPSRSDAKEY")) {
					that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Positive);
				}
				LookUpBtn.setVisible(false);
				EditBtn.setVisible(false);
				SaveBtn.setVisible(false);
				SFAPRBtn.setVisible(true);
				SFAPRBtn.setEnabled(true);
				SFAPRBtn.setText(thisCntrlr.bundle.getText("S2PSRSDASFCANINITXT"));
				SFAPRBtn.setIcon(thisCntrlr.bundle.getText("S2CANCELBTNICON"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISION_CONTENT).setVisible(false);
			}
			if (parseInt(PSRData.PsrStatus) > 15 || parseInt(PSRData.PsrStatus) > 55) {
				SFAPRBtn.setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(false);
				if (parseInt(PSRData.PsrStatus) >= 15) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
					if (PSRData.PsrType !== thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT")) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(true);
					} else {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
					}
				}
			}
			if (PSRData.SsdaReq === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CONTACTINFO_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(true);
			} else if (PSRData.SsdaReq === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(false);
			}
			if (parseInt(PSRData.PsrStatus) ===
				55 || parseInt(PSRData.PsrStatus) ===
				58 || parseInt(PSRData.PsrStatus) ===
				60) {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LOOKUP_LISTBtn).setEnabled(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
			}
			(SecurityData.InitPsr === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (InitPSR = true) : (
				InitPSR = false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).setEnabled(InitPSR);
			if (parseInt(PSRData.PsrStatus) >= 65) {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(true);
				if (parseInt(PSRData.PsrStatus) === 65) {
//					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle                                                       //PCR019492--
//						.getText("S2PSRSDASFCONSSDAINITTXT"));                                                                                                     //PCR019492--
					if(PSRData.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){                                                                    //PCR019492++
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle.getText("S2PSRSDASFCONSSDAINITTXTASC606"));       //PCR019492++
					} else if(PSRData.Asc606_SsdaFlag === ""){                                                                                                     //PCR019492++
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle.getText("S2PSRSDASFCONSSDAINITTXT"));             //PCR019492++
					}                                                                                                                                              //PCR019492++
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(thisCntrlr.bundle
						.getText("S2CANCELBTNICON"));
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true);
				} else if (parseInt(PSRData.PsrStatus) > 65) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(true);
				}
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_TEXT_AREA).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setExpanded(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setExpanded(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CONTACTINFO_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLEFORM_DISPLAY_360).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecTYPE_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLEFORM_DISPLAY_370).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_B_APPROVALS_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_B_APPROVALS_PANEL).setExpanded(false);
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL).setVisible(true);
			}
			if (parseInt(PSRData.PsrStatus) === 60) {
				if (PSRData.SsdaReq === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_TEXT_AREA).setEnabled(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_PANEL).setVisible(true);
				} else {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
						true);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
					if (parseInt(PSRData.PsrStatus) < 60) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(
							false);
					}
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(false);
				}
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CONTACTINFO_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLEFORM_DISPLAY_360).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecTYPE_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecTYPE_PANEL).setExpanded(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLEFORM_DISPLAY_370).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_B_APPROVALS_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL).setVisible(true);
			}
			var ContactBtnArr = [com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_ROM_ADDBtn, com.amat.crm.opportunity.Ids
				.S2PSR_SDA_PANL_SALES_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_AcSME_ADDBtn, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_POM_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BMO_ADDBtn, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GPM_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_TPSKAT_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BUSME_ADDBtn, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BMHead_ADDBtn,
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CNTROLLER_ADDBtn, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_PLHead_ADDBtn
			];
			var ContactLstArr = [com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_9, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_10,
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_11, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_POMLIST,
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_15,
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_16, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_17,
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_18, com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_12,
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_13,
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_14
			];
			for (var i = 0; i < ContactBtnArr.length; i++) {
				oView.byId(ContactBtnArr[i]).setEnabled(false);
				oView.byId(ContactLstArr[i]).setMode("None");
			}
			if (parseInt(PSRData.PsrStatus) >= 60) {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(true);
			} else {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(false);
			}
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAF_RADIOBtn).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setEnabled(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setVisible(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setEnabled(true);
			(PSRData.PsrType !== thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT")) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL)
				.setVisible(true)) : (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(false));
		},
		/**
		 * This method Handles SSDA Not Available Process.
		 * 
		 * @name SSDANotReq
		 * @param 
		 * @returns 
		 */
		SSDANotReq: function() {
			var oppQuesdata = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL"));
			var obj = {};
			obj.ActionType = "";
			obj.AprvComments = oppQuesdata.AprvComments;
			obj.Bd = oppQuesdata.Bd;
			obj.Bsdl = oppQuesdata.Bsdl;
			obj.ConComments = oppQuesdata.ConComments;                                                                                                          //PCR019492++
			obj.Custno = oppQuesdata.Custno;
			obj.Guid = OppGenInfoModel.getData().Guid;
			obj.InitiatedBy = "";
			//obj.InitiatedDt = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                                              //PCR035760-- Defect#131 TechUpgrade changes
			obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
			obj.PsrRequired = oppQuesdata.PsrRequired;
			obj.PsrStatDesc = "";
			obj.PsrStatus = "60";
			obj.PsrType = oppQuesdata.PsrType;
			obj.RevOpitmId = oppQuesdata.RevOpitmId;
			obj.RevOppId = oppQuesdata.RevOppId;
			obj.Sd = oppQuesdata.Sd;
			obj.SsdaReq = thisCntrlr.bundle.getText("S2NEGMANDATANS");
			obj.Ssdl = oppQuesdata.Ssdl;
			obj.TaskId = oppQuesdata.TaskId;
			obj.Time = thisCntrlr.bundle.getText("S2OPPAPPPAYLODTMEKEY");
			obj.WiId = oppQuesdata.WiId;
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat.crm.opportunity
				.util.ServiceConfigConstants.write, obj, "PSR-SDA Completed");
			this.fnSetVisibility(thisCntrlr.bundle.getText("S2POSMANDATANS"));
			this.getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
			var oView = thisCntrlr.getView();
			that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor.Positive);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.bundle
				.getText("S2PSRSDAEDITICON"));
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.bundle
				.getText("S2PSRSDAEDITBTNTXT"));
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(true);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISIONBox).setVisible(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DECISION_CONTENT).setVisible(true);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LOOKUP_LISTBtn).setVisible(true);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LOOKUP_LISTBtn).setEnabled(true);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setVisible(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setVisible(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false);
		},
		/**
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
		 * This method is used to handles SSDA Assessment level selection event.
		 * 
		 * @name onComboSSelectionChange
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onComboSSelectionChange: function(oEvent) {
			if (oEvent.getParameters().selectedItem.getText() === thisCntrlr.bundle.getText(
					"S2PSRSDAPDCSSDALVLDEFAULTTXT")) {
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRPDCBSSDAOPMSG"));
			} else {
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
					.getText("S2ICONTABPSRSDAKEY")) {
					thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().Ssdl = oEvent.getParameters()
						.selectedItem.getText();
				} else {
					thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().Ssdl =
						oEvent.getParameters().selectedItem.getText();
				}
			}
		},
		/**
		 * This method is used to handles SSDA Justification Value Live Change event.
		 * 
		 * @name onSSDATextChange
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onSSDATextChange: function(oEvent) {
			//***************Start Of PCR021481--: 4190 : Q2C Q1/Q2 enhancements ********
			//if (oEvent.getParameters().value.length >= 255) {
			//	var JustificationTxt = oEvent.getParameters().value.substr(0, 254);
			//	if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle.getText("S2ICONTABPSRSDAKEY")) {
			//		thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_TEXT_AREA).setValue(JustificationTxt);
			//	} else {
			//		that_pdcsda.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SSDASSESTXTAREA).setValue(JustificationTxt);
			//	}
			//	thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCMCOMMVALTXT"));
			//} else {
				//***************End Of PCR021481--: 4190 : Q2C Q1/Q2 enhancements ********
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle.getText("S2ICONTABPSRSDAKEY")) {
					thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().SsdaJustfication = oEvent.getParameters().value;
				} else {
					thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().SsdaJustfication = oEvent.getParameters().value;
				}
			//}                                                                                                                                             //PCR021481--
		},
		/**
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
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setValue(
						"");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN).setEnabled(
						false);
					MCommType = thisCntrlr.bundle.getText("S2PSRMCOMMDATATYP");
					oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__COMMTABLE);
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
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setValue("");
					that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_SAVEBtn).setEnabled(false);
					MCommType = thisCntrlr.bundle.getText("S2PDCMCOMMDATATYP");
					oTable = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_TABLE);
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
				.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA) ? (SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity
				.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN)) : ((oEvent.getParameters().id.split(thisCntrlr.bundle
					.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(thisCntrlr.bundle.getText(
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
		/**
		 * This method is used to Refresh PSR-SDA Data.
		 * 
		 * @name getRefreshPSRData
		 * @param Guid - Opportunity Guid, ItemGuid: Opportunity Item Guid
		 * @returns
		 */
		getRefreshPSRData: function(Guid, ItemGuid) {
			var oComponent = this.getOwnerComponent();
			var oView = thisCntrlr.getView();
			that_general = oComponent.general;
			var sValidate = "PSRSDA_InfoSet(Guid=guid'" + Guid + "',ItemGuid=guid'" + ItemGuid +
			"')?$expand=NAV_SSDA_FINL,NAV_RRA_QA_PSR,NAV_SSDA_FINN,NAV_SSDA_PARL,NAV_SSDA_EVDOC,NAV_BSDA_EVDOC,NAV_CHANGE_HISTORY,NAV_SAF_QA,NAV_CUST_REVSPEC,NAV_SDA_QA,NAV_PSR_QA,NAV_PSR_CC,NAV_FNL_DOCS,NAV_FINN_APRV_HIST,NAV_FINL_APRV_HIST,NAV_PARL_APRV_HIST,NAV_REV_DOCS";      //PCR019903++
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var oppQuesdata = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			this.PSRCCData = oppQuesdata.NAV_PSR_CC;
			(oppQuesdata.CcOppId !== "" && oppQuesdata.CcOpitmId !== "") ? (oView.byId(com.amat.crm.opportunity
				.Ids.S2PSR_SDA_PANL_LB_CARBON_COPY_TEXT).setText(thisCntrlr.bundle.getText(
				"S2PSRSDACCFRMTXT") + " " + oppQuesdata.CcOppId + "_" + oppQuesdata.CcOpitmId)) : (oView.byId(
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_CARBON_COPY_TEXT).setText(""));
			thisCntrlr.Custno = oppQuesdata.Custno;
			(oppQuesdata.BsdaResetFlag === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") || oppQuesdata.SsdaResetFlag === thisCntrlr.bundle.getText(
				"S1TABLESALESTAGECOL")) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RESET_LIST_PANEL).setVisible(true)) : (oView.byId(
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RESET_LIST_PANEL).setVisible(false));
			var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setValue("");
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE).setVisible(false);
			if (oppQuesdata.RevOppId !== "" && oppQuesdata.RevOpitmId === "") {
				var SecurityData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBSECURITYMODEL")).getData();
				var RefSpecRev1 = [],
					UpldCustSpecVis, Enableflag = false,
					Enabledelflag = false,
					UpldFnlSpecVis = false;
				(SecurityData.UpldCustSpec === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (UpldCustSpecVis =
					true) : (UpldCustSpecVis = false);
				(SecurityData.UpldFnlSpec === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (UpldFnlSpecVis =
					true) : (UpldFnlSpecVis = false);
				var RPSRDocData = oppQuesdata.NAV_REV_DOCS.results;
				(parseInt(oppQuesdata.PsrStatus) === 5 || parseInt(oppQuesdata.PsrStatus) === 4) ? ((oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn)
					.getText() === thisCntrlr.bundle
					.getText("S2PSRSDAEDITBTNTXT")) ? (Enableflag = false, Enabledelflag = false) : (Enableflag =
					true, Enabledelflag = true)) : ("");
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_NIL_LABEL).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_BOX).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setValue(
					oppQuesdata.RevOppId);
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_NIL_LIST).setEnabled(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setVisible(false);
				if (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle
					.getText("S2PSRSDAEDITBTNTXT")) {
					RefSpecRev1 = this.loadFPSRevDocData(RPSRDocData, false, false);
				} else {
					RefSpecRev1 = this.loadFPSRevDocData(RPSRDocData, Enableflag, Enabledelflag);
				}
				var oRPSRDocJModel = this.getJSONModel({
					"ItemSet": RefSpecRev1
				});
				var oRPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE);
				oRPSRDocTable.setModel(oRPSRDocJModel);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE).setVisible(true);
			} else if (oppQuesdata.RevOppId !== "" && oppQuesdata.RevOpitmId !== "") {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_RELSPECINSTLDAYSHB).setVisible(true);                                             //PCR019492++
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_RELSPECINSTLDAYS).setText(oppQuesdata.DaysInInstal + " " +                        //PCR019492++
						thisCntrlr.bundle.getText("S2PSRRELSPECINSTLDAYSTXTASC606"));                                                           //PCR019492++
				if (parseInt(oppQuesdata.PsrStatus) === 5 || parseInt(oppQuesdata.PsrStatus) === 4) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(
						false);
				}
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).getItems()[0].setText(
					oppQuesdata.RevOppId + "-" + oppQuesdata.RevOpitmId)
				if (oppQuesdata.NAV_FNL_DOCS.results[0].FileName !== "") {
					var cModel5 = this.getJSONModel([thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
						"GLBPSRMODEL")).getData().NAV_FNL_DOCS.results[0]]);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setModel(
						cModel5);
				} else {
					var cModel5 = this.getJSONModel([]);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setModel(
						cModel5);
				}
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setEnabled(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
					true);
			} else if (oppQuesdata.RevOppId === "" && oppQuesdata.RevOpitmId === "") {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_LABEL).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW_BOX).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setText(thisCntrlr.bundle
					.getText("S2PSRSDANTINLISTBTN"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setIcon(thisCntrlr.bundle
					.getText("S2SUBMTFORAPPBTN"));
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setType(sap.m.ButtonType
					.Emphasized);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setVisible(true);
				(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() === thisCntrlr.bundle
					.getText("S2PSRSDAEDITBTNTXT")) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn)
					.setEnabled(false)) : ((oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).getText() ===
					thisCntrlr.bundle.getText("S2PSRSDACANBTNTXT")) ? (oView.byId(com.amat.crm.opportunity
					.Ids.S2PSR_SDA_PANL_BT_NOTINLISTtn).setEnabled(true)) : (""));
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LB_REL_PERSpec_BOX).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_REL_PERSpec_REW_BOX).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(
					false);
			}
			if (oppQuesdata.NAV_FNL_DOCS.results[0].FileName !== "") {
				var cModel5 = this.getJSONModel([oppQuesdata.NAV_FNL_DOCS.results[0]]);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setModel(
					cModel5);
			} else {
				var cModel5 = this.getJSONModel([]);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setModel(
					cModel5);
			}
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).getModel().getData()
				.length === 0 ? oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX).setVisible(
					true) : oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX).setVisible(
					false);
			this.fnSetVisibility(oppQuesdata.PsrRequired);
			//***************Start Of PCR019492: ASC606 UI Changes********
			if(oppQuesdata.Asc606_BsdaFlag === ""){
				if(oppQuesdata.OldBsdaVal !== "" && oppQuesdata.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
					var BSDAAssesItem = {
							"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
							                       {"ProductId": "L1", "Name": "L1" },
							                       {"ProductId": "L2", "Name": "L2" }, 
							                       {"ProductId": "L3", "Name": "L3" },
							                       {"ProductId": "SHPOD", "Name": "SHPOD" },
							                       {"ProductId": "DEFER", "Name": "DEFER" },
							                       {"ProductId": "CAR", "Name": "CAR" },							                       
							                       {"ProductId": "AMJD", "Name": "AMJD" }]};
					(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
							(BSDAAssesItem.SDAAssesCollection.length = 7) : (BSDAAssesItem.SDAAssesCollection.length = 8);
				} else {
					var BSDAAssesItem = {
							"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
							                       {"ProductId": "L1", "Name": "L1" },
							                       {"ProductId": "L2", "Name": "L2" }, 
							                       {"ProductId": "L3", "Name": "L3" }, 
							                       {"ProductId": "AMJD", "Name": "AMJD" }]};
					(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
							(BSDAAssesItem.SDAAssesCollection.length = 4) : (BSDAAssesItem.SDAAssesCollection.length = 5);
				}
				
			} else if(oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				var BSDAAssesItem = {
						"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
						                       {"ProductId": "SHPOD", "Name": "SHPOD" },
						                       {"ProductId": "CAR", "Name": "CAR" }, 
						                       {"ProductId": "DEFER", "Name": "DEFER" }, 
						                       {"ProductId": "AMJD", "Name": "AMJD" }]};
				(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
						(BSDAAssesItem.SDAAssesCollection.length = 4) : (BSDAAssesItem.SDAAssesCollection.length = 5);
			}
			var oBSDAModel = this.getJSONModel(BSDAAssesItem);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setModel(oBSDAModel);
			if(oppQuesdata.Asc606_SsdaFlag === ""){
				var SSDAAssesItem = {
						"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
						                       {"ProductId": "L1", "Name": "L1" },
						                       {"ProductId": "L2", "Name": "L2" }, 
						                       {"ProductId": "L3", "Name": "L3" }, 
						                       {"ProductId": "AMJD", "Name": "AMJD" }]};
			} else if(oppQuesdata.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				var SSDAAssesItem = {
						"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
						                       {"ProductId": "SHPOD", "Name": "SHPOD" },
						                       {"ProductId": "CAR", "Name": "CAR" }, 
						                       {"ProductId": "DEFER", "Name": "DEFER" }, 
						                       {"ProductId": "AMJD", "Name": "AMJD" }]};
			}
			(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
				(SSDAAssesItem.SDAAssesCollection.length = 4) : (SSDAAssesItem.SDAAssesCollection.length = 5);
			var oSSDAModel = this.getJSONModel(SSDAAssesItem);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setModel(oSSDAModel);
			//***************Start Of PCR019492--: ASC606 UI Changes********
//			var SDAAssesItem = {
//				"SDAAssesCollection": [{
//					"ProductId": "OP",
//					"Name": "Select Level"
//				}, {
//					"ProductId": "L1",
//					"Name": "L1"
//				}, {
//					"ProductId": "L2",
//					"Name": "L2"
//				}, {
//					"ProductId": "L3",
//					"Name": "L3"
//				}, {
//					"ProductId": "AMJD",
//					"Name": "AMJD"
//				}]
//			};
//			(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
//			(SDAAssesItem.SDAAssesCollection.length = 4) : (SDAAssesItem.SDAAssesCollection.length = 5);
//			var oModel1 = this.getJSONModel(SDAAssesItem);
//			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setModel(oModel1);
//			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setModel(oModel1);
			//***************Start Of PCR019492--: ASC606 UI Changes********
			if(oppQuesdata.Asc606_BsdaFlag === ""){
				if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL1")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"));
				} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL2")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVL2"));
				} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL3")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVL3"));
				} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
							thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606"));
				} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
							thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606"));
				} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
							thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606"));
				} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
							thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"));
				} else {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP"));
				}
			} else if(oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606"));
				} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606"));
				} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606"));
				} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"));
				} else {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP"));
				}
			}
			if(oppQuesdata.Asc606_SsdaFlag === ""){
				if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL1")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"));
				} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL2")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVL2"));
				} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL3")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVL3"));
				} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"));
				} else {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP"));
				}
			} else if(oppQuesdata.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606"));
				} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606"));
				} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606"));
				} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"));
				} else {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
						thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP"));
				}
			}			
			//***************End Of PCR019492: ASC606 UI Changes********
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setValue(
				oppQuesdata.BsdaJustfication);
			(oppQuesdata.Bd === thisCntrlr.bundle.getText("S2BSDAASSESSDVAL")) ? (oView.byId(com
				.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setSelected(true)) : (oView.byId(
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setSelected(false));
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BARSTATUS_TEXT).setText(thisCntrlr.bundle
				.getText("S2PSRBARSTATUSHEADER") + " " + oppQuesdata.PsrStatDesc);
			(oppQuesdata.Sd === thisCntrlr.bundle.getText("S2BSDAASSESSDVAL")) ? (oView.byId(com.amat
				.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setSelected(true)) : (oView.byId(com.amat
				.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setSelected(false));
			var QuesData = {
				"items": []
			};
			var SDAQuesData = {
				"items": []
			};
			var SFAQuesData = {
				"items": []
			};
			SFAQuesData.items[0] = [oppQuesdata.NAV_SAF_QA];
			var FinalQuesItems = thisCntrlr.fnDeterminePSRTY(SFAQuesData, thisCntrlr.bundle.getText(
				"S2PSRDETERMINDFTPARAM"), false, false);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAF_RADIOBtn).setModel(new sap.ui.model
				.json.JSONModel(FinalQuesItems[0].items));
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAF_RADIOBtn).setSelectedIndex(
				FinalQuesItems[0].items[0].SelectionIndex);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAF_RADIOBtn).setValueState(
				FinalQuesItems[0].items[0].valueState);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAF_RADIOBtn).setEnabled(false);
			var SSDAReData = {
				"items": [{
					"SelectionIndex": "0",
					"valueState": "Error",
					"enabled": "false"
				}]
			};
			if (oppQuesdata.SsdaReq === thisCntrlr.bundle.getText("S2POSMANDATANS")) {
				SSDAReData.items[0].SelectionIndex = 1;
				SSDAReData.items[0].valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
				SSDAReData.items[0].enabled = "false";
			} else if (oppQuesdata.SsdaReq === thisCntrlr.bundle.getText("S2NEGMANDATANS")) {
				SSDAReData.items[0].SelectionIndex = 2;
				SSDAReData.items[0].valueState = thisCntrlr.bundle.getText("S2DELNAGVIZTEXT");
				SSDAReData.items[0].enabled = "false";
			} else {
				SSDAReData.items[0].SelectionIndex = 0;
				SSDAReData.items[0].valueState = thisCntrlr.bundle.getText("S2ERRORVALSATETEXT");
				SSDAReData.items[0].enabled = "false";
			}
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setModel(new sap
				.ui.model.json.JSONModel(SSDAReData.items));
			(SSDAReData.items[0].SelectionIndex !== 0)?(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setSelectedIndex(                 //PCR018375++
				SSDAReData.items[0].SelectionIndex)):("");                                                                                                               //PCR018375++
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setValueState(
				SSDAReData.items[0].valueState);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EXPSSDA_RADIOBtn_GROUP).setEnabled(
				false);
			QuesData.items = [oppQuesdata.NAV_PSR_QA.results];
			SDAQuesData.items = [oppQuesdata.NAV_SDA_QA.results];
			var oQuestionireModel = this.getJSONModel(QuesData);
			sap.ui.getCore().setModel(oQuestionireModel, thisCntrlr.bundle.getText("GLBPSRQESMODEL"));
			var oSDAQuestionireModel = this.getJSONModel(SDAQuesData);
			sap.ui.getCore().setModel(oSDAQuestionireModel, thisCntrlr.bundle.getText("GLBSDAQESMODEL"));
			thisCntrlr.MandateData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRQESMODEL")).getData();
//			var FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle.getText(                              //PCR019492--
//			"S2PSRDETERMINDFTPARAM"), false, false);                                                                                         //PCR019492--
			var ASCType = oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? true : false;                         //PCR019492++
			if(ASCType === true){                                                                                                            //PCR019492++
				var FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle.getText(                          //PCR019492++
				"S2PSRDETERMINDFTPARAM"), false, false, thisCntrlr.bundle.getText("S2ICONTABPSRTEXT"), ASCType);                             //PCR019492++
			} else {                                                                                                                         //PCR019492++
				var FinalQuesItems = thisCntrlr.fnDeterminePSRTY(thisCntrlr.MandateData, thisCntrlr.bundle.getText(                          //PCR019492++
				"S2PSRDETERMINDFTPARAM"), false, false);                                                                                     //PCR019492++
			}
			var cModel1 = this.getJSONModel(FinalQuesItems[0]);
			var oTableItems1 = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE);
			var oItemTemplate1 = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DETERMINE_Sys_SpecTYPE_TEMPLATE);
			oTableItems1.setModel(cModel1);
			var FinalSDAQus = [{
				"items": []
			}];
			FinalSDAQus.items = this.validatSDAQues(SDAQuesData);
			var oSDATableItems = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_TABLE);
			var FinalSDAQuesItems = thisCntrlr.fnConTableModel(FinalSDAQus.items.items, false);
			var cModel1 = this.getJSONModel(FinalSDAQuesItems);
			oSDATableItems.setModel(cModel1);
			var oPrlTableItems = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BApr_PARALLEL);
			oPrlTableItems.invalidate();
			var cModel2 = this.getJSONModel(oppQuesdata.NAV_PARL_APRV_HIST);
			oPrlTableItems.setModel(cModel2);
			var oFnlTableItems = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BApr_FINAL);
			oFnlTableItems.invalidate();
			var cModel3 = this.getJSONModel(oppQuesdata.NAV_FINL_APRV_HIST);
			oFnlTableItems.setModel(cModel3);
			var oFinanceTableItems = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BAPR_FINAL);
			oFinanceTableItems.invalidate();
			var cModel4 = this.getJSONModel(oppQuesdata.NAV_FINN_APRV_HIST);
			oFinanceTableItems.setModel(cModel4);
			var oSPrlTableItems = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPRpARALLEL);
			var cModel5 = this.getJSONModel(oppQuesdata.NAV_SSDA_PARL);
			oSPrlTableItems.setModel(cModel5);
			var oSFinanceTableItems = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPR_FINANCIAL);
			var cModel6 = this.getJSONModel(oppQuesdata.NAV_SSDA_FINN);
			oSFinanceTableItems.setModel(cModel6);
			var oSFnlTableItems = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SBAPR_FINAL);
			var cModel7 = this.getJSONModel(oppQuesdata.NAV_SSDA_FINL);
			oSFnlTableItems.setModel(cModel7);
			var oCbnCpyTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_TABLE);
			var cModel8 = this.getJSONModel(oppQuesdata.NAV_PSR_CC);
			oCbnCpyTable.setModel(cModel8);
			var CustSpecRev1Data = oppQuesdata.NAV_CUST_REVSPEC.results;
			var FPSRDocData = oppQuesdata.NAV_FNL_DOCS.results;
			var RPSRDocData = oppQuesdata.NAV_REV_DOCS.results;
			var EBSDAPSRData = oppQuesdata.NAV_BSDA_EVDOC.results;
			var ESSDAPSRData = oppQuesdata.NAV_SSDA_EVDOC.results;
			var CustSpecRev1 = this.loadFPSRevDocData(CustSpecRev1Data, false, false, UpldCustSpecVis);
			var oCustSpecRev1JModel = this.getJSONModel({
				"ItemSet": CustSpecRev1
			});
			var oCustSpecRev1DocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_TABLE);
			oCustSpecRev1DocTable.setModel(oCustSpecRev1JModel);
			this.setTableNoteEnable(oCustSpecRev1DocTable);
			this.setTableSecurity(oCustSpecRev1DocTable);
			var FPSRDoc = this.loadFPSRevDocData(FPSRDocData, false, false, UpldFnlSpecVis);
			var oFPSRDocJModel = this.getJSONModel({
				"ItemSet": FPSRDoc
			});
			var oFPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_TABLE);
			oFPSRDocTable.setModel(oFPSRDocJModel);
			this.setTableNoteEnable(oFPSRDocTable);
			this.setTableSecurity(oFPSRDocTable);
			var RPSRDoc = this.loadFPSRevDocData(RPSRDocData, false, false);
			var oRPSRDocJModel = this.getJSONModel({
				"ItemSet": RPSRDoc
			});
			var oRPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RPSR_DOC_TABLE);
			oRPSRDocTable.setModel(oRPSRDocJModel);
			this.setTableNoteEnable(oRPSRDocTable);
			var EBSDAPSRDoc = this.loadFPSRevDocData(EBSDAPSRData, false, false, UpldFnlSpecVis);
			var oEBSDAPSRDocJModel = this.getJSONModel({
				"ItemSet": EBSDAPSRDoc
			});
			var oEBSDAPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EVDANCE_DOC_TABLE);
			oEBSDAPSRDocTable.setModel(oEBSDAPSRDocJModel);
			this.setTableNoteEnable(oEBSDAPSRDocTable);
			this.setTableSecurity(oEBSDAPSRDocTable);
			var ESSDAPSRDoc = this.loadFPSRevDocData(ESSDAPSRData, false, false, UpldFnlSpecVis);
			var oESSDAPSRDocJModel = this.getJSONModel({
				"ItemSet": ESSDAPSRDoc
			});
			var oESSDAPSRDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EVDANCE_SSDA_DOC_TABLE);
			oESSDAPSRDocTable.setModel(oESSDAPSRDocJModel);
			this.setTableNoteEnable(oESSDAPSRDocTable);
			this.setTableSecurity(oESSDAPSRDocTable);
			var filenameFlag = false;
			for (var i = 0; i < RPSRDoc.length; i++) {
				if (RPSRDoc[i].filename !== "") {
					filenameFlag = true
				}
			}
			if (filenameFlag) {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_IP_REL_PERSpec_REW).setEnabled(false);
			}
			if (oppQuesdata.NAV_BSDA_EVDOC.FileName !== "") {
				var cModel9 = this.getJSONModel(oppQuesdata.NAV_BSDA_EVDOC);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_FORM).setModel(cModel9);
			} else {
				var cModel9 = this.getJSONModel(oppQuesdata.NAV_BSDA_EVDOC);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_FORM).setModel(cModel9);
			}
			if (oppQuesdata.NAV_SSDA_EVDOC.FileName !== "") {
				var cMode20 = this.getJSONModel(oppQuesdata.NAV_SSDA_EVDOC);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDA_EVS_FORM).setModel(cMode20);
			} else {
				var cMode20 = this.getJSONModel(oppQuesdata.NAV_SSDA_EVDOC);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDA_EVS_FORM).setModel(cMode20);
			}
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDASSES_TEXT_AREA).setValue(oppQuesdata.BsdaJustfication);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_TEXT_AREA).setValue(oppQuesdata.SsdaJustfication);
			//this.setDataToTable(that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_TRANSHIS_TRANHIS_LISTTAMP),                                             //PCR021481--
			//	GenInfoData.NAV_TRANS_HISTORY);                                                                                                                       //PCR021481--
			if (oppQuesdata.PsrType !== "") {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).setText(oppQuesdata.PsrType);
				if (oppQuesdata.PsrType ===
					thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT")) {
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
					if (GenInfoData.Region === thisCntrlr.bundle.getText("S2OPPREGION")) {
						//***************Start Of PCR019492: ASC606 UI Changes********
						if(oppQuesdata.Asc606_BsdaFlag === ""){
							if(oppQuesdata.OldBsdaVal !== "" && oppQuesdata.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
								var BSDAAssesItem = {
										"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
										                       {"ProductId": "L1", "Name": "L1" },
										                       {"ProductId": "SHPOD", "Name": "SHPOD" },
										                       {"ProductId": "CAR", "Name": "CAR" }, 
										                       {"ProductId": "DEFER", "Name": "DEFER" }, 
										                       {"ProductId": "AMJD", "Name": "AMJD" }]};
								(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
										(BSDAAssesItem.SDAAssesCollection.length = 5) : (BSDAAssesItem.SDAAssesCollection.length = 6);
							} else {
								var BSDAAssesItem = {
										"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
										                       {"ProductId": "L1", "Name": "L1" }, 
										                       {"ProductId": "AMJD", "Name": "AMJD" }]};
								(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
										(BSDAAssesItem.SDAAssesCollection.length = 2) : (BSDAAssesItem.SDAAssesCollection.length = 3);
							}
						} else if(oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
							var BSDAAssesItem = {
									"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
									                       {"ProductId": "SHPOD", "Name": "SHPOD" },
									                       {"ProductId": "CAR", "Name": "CAR" }, 
									                       {"ProductId": "DEFER", "Name": "DEFER" }, 
									                       {"ProductId": "AMJD", "Name": "AMJD" }]};
							(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
									(BSDAAssesItem.SDAAssesCollection.length = 4) : (BSDAAssesItem.SDAAssesCollection.length = 5);
						}						
						var oBSDAModel = this.getJSONModel(BSDAAssesItem);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setModel(oBSDAModel);
						if(oppQuesdata.Asc606_SsdaFlag === ""){
							var SSDAAssesItem = {
									"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
									                       {"ProductId": "L1", "Name": "L1" }, 
									                       {"ProductId": "AMJD", "Name": "AMJD" }]};
							(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
									(SSDAAssesItem.SDAAssesCollection.length = 2) : (SSDAAssesItem.SDAAssesCollection.length = 3);
						} else if(oppQuesdata.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
							var SSDAAssesItem = {
									"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
									                       {"ProductId": "SHPOD", "Name": "SHPOD" },
									                       {"ProductId": "CAR", "Name": "CAR" }, 
									                       {"ProductId": "DEFER", "Name": "DEFER" }, 
									                       {"ProductId": "AMJD", "Name": "AMJD" }]};
							(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
									(SSDAAssesItem.SDAAssesCollection.length = 4) : (SSDAAssesItem.SDAAssesCollection.length = 5);
						}						
						var oSSDAModel = this.getJSONModel(SSDAAssesItem);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setModel(oSSDAModel);
//						var SDAAssesItem = {                                                                                      //PCR019492--
//							"SDAAssesCollection": [{                                                                              //PCR019492--
//								"ProductId": "OP",                                                                                //PCR019492--
//								"Name": "Select Level"                                                                            //PCR019492--
//							}, {                                                                                                  //PCR019492--
//								"ProductId": "L1",                                                                                //PCR019492--
//								"Name": "L1"                                                                                      //PCR019492--
//							}, {                                                                                                  //PCR019492--
//								"ProductId": "AMJD",                                                                              //PCR019492--
//								"Name": "AMJD"                                                                                    //PCR019492--
//							}]                                                                                                    //PCR019492--
//						};                                                                                                        //PCR019492--
//						var oModel1 = this.getJSONModel(SDAAssesItem);                                                            //PCR019492--
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setModel(                       //PCR019492--
//							oModel1);                                                                                             //PCR019492--
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setModel(                       //PCR019492--
//							oModel1);                                                                                             //PCR019492--
						//***************End Of PCR019492: ASC606 UI Changes********
						if (oppQuesdata.Bsdl !== "") {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
								oppQuesdata.Bsdl);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
								false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(
								false);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
								true);
						} else {
							if(oppQuesdata.Asc606_BsdaFlag === ""){                                                                 //PCR019492++
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
									thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"));
							}                                                                                                       //PCR019492++
						}
					}
				}
			} else {
				var PSRTypeTxt;
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
					true);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
					false);
				if (FinalQuesItems[1] === true && parseInt(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText(
						"GLBPSRMODEL")).getData().PsrStatus) > 5) {
					PSRTypeTxt = thisCntrlr.bundle.getText("S2PSRSDASTATNEW")
				} else if (FinalQuesItems[1] === false && (FinalQuesItems[2] === false && FinalQuesItems[3] === false)) {
					PSRTypeTxt = "";
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
						false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
						false);
				} else {
					if (FinalQuesItems[3] === true) {
						PSRTypeTxt = thisCntrlr.bundle.getText("S2PSRSDASTATREVISED");
					} else if (FinalQuesItems[2] === true) {
						PSRTypeTxt = thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT");
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
							true);
						if (GenInfoData.Region === thisCntrlr.bundle.getText("S2OPPREGION")) {
							//***************Start Of PCR019492: ASC606 UI Changes********
							if(oppQuesdata.Asc606_BsdaFlag === ""){
								if(oppQuesdata.OldBsdaVal !== "" && oppQuesdata.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
									var BSDAAssesItem = {
											"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
											                       {"ProductId": "L1", "Name": "L1" },											                       
											                       {"ProductId": "SHPOD", "Name": "SHPOD" },
											                       {"ProductId": "CAR", "Name": "CAR" }, 
											                       {"ProductId": "DEFER", "Name": "DEFER" },
											                       {"ProductId": "AMJD", "Name": "AMJD"}]};
									(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
											(BSDAAssesItem.SDAAssesCollection.length = 5) : (BSDAAssesItem.SDAAssesCollection.length = 6);
								} else {
									var BSDAAssesItem = {
											"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
											                       {"ProductId": "L1", "Name": "L1" }, 
											                       {"ProductId": "AMJD", "Name": "AMJD"}]};
									(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
											(BSDAAssesItem.SDAAssesCollection.length = 2) : (BSDAAssesItem.SDAAssesCollection.length = 3);
								}
							} else if(oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
								var BSDAAssesItem = {
										"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
										                       {"ProductId": "SHPOD", "Name": "SHPOD" },
										                       {"ProductId": "CAR", "Name": "CAR" }, 
										                       {"ProductId": "DEFER", "Name": "DEFER" }, 
										                       {"ProductId": "AMJD", "Name": "AMJD" }]};
								(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
										(BSDAAssesItem.SDAAssesCollection.length = 4) : (BSDAAssesItem.SDAAssesCollection.length = 5);
							}							
							var oBSDAModel = this.getJSONModel(BSDAAssesItem);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setModel(oBSDAModel);
							if(oppQuesdata.Asc606_SsdaFlag === ""){
								var SSDAAssesItem = {
										"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
										                       {"ProductId": "L1", "Name": "L1" },
										                       {"ProductId": "AMJD", "Name": "AMJD" }]};
								(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
										(SSDAAssesItem.SDAAssesCollection.length = 2) : (SSDAAssesItem.SDAAssesCollection.length = 3);
							} else if(oppQuesdata.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
								var SSDAAssesItem = {
										"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" },
										                       {"ProductId": "SHPOD", "Name": "SHPOD" },
										                       {"ProductId": "CAR", "Name": "CAR" }, 
										                       {"ProductId": "DEFER", "Name": "DEFER" }, 
										                       {"ProductId": "AMJD", "Name": "AMJD" }]};
								(GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
										(SSDAAssesItem.SDAAssesCollection.length = 4) : (SSDAAssesItem.SDAAssesCollection.length = 5);
							}							
							var oSSDAModel = this.getJSONModel(SSDAAssesItem);
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setModel(oSSDAModel);
//							var SDAAssesItem = {                                                                                     //PCR019492--
//								"SDAAssesCollection": [{                                                                             //PCR019492--
//									"ProductId": "OP",                                                                               //PCR019492--
//									"Name": "Select Level"                                                                           //PCR019492--
//								}, {                                                                                                 //PCR019492--
//									"ProductId": "L1",                                                                               //PCR019492--
//									"Name": "L1"                                                                                     //PCR019492--
//								}, {                                                                                                 //PCR019492--
//									"ProductId": "AMJD",                                                                             //PCR019492--
//									"Name": "AMJD"                                                                                   //PCR019492--
//								}]                                                                                                   //PCR019492--
//							};                                                                                                       //PCR019492--
//							var oModel1 = this.getJSONModel(SDAAssesItem);                                                           //PCR019492--
//							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setModel(                      //PCR019492--
//								oModel1);                                                                                            //PCR019492--
//							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setModel(                      //PCR019492--
//								oModel1);                                                                                            //PCR019492--
							if(oppQuesdata.Asc606_BsdaFlag === ""){   
							//***************End Of PCR019492: ASC606 UI Changes********	
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
										thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"));
							}			                                                                                             //PCR019492++				
						} else {
							if(oppQuesdata.Asc606_BsdaFlag === ""){                                                                  //PCR019492++ 
								oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
									thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"));
							}                                                                                                        //PCR019492++
						}
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(
							false);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
							true);
					}
				}
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).setText(PSRTypeTxt);
			}
			if (oppQuesdata.PsrType === thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT")) {
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(
					false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(
					true);
				if (GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) {
					if(oppQuesdata.Asc606_BsdaFlag === ""){                                                                             //PCR019492++   
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"));
					}		                                                                                                            //PCR019492++			
				} else {
					var oppQuesdata = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
					//***************Start Of PCR019492: ASC606 UI Changes********	
//					if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL1")) {                                           //PCR019492--
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(                       //PCR019492--
//							thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"));                                                             //PCR019492--
//					} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL2")) {                                    //PCR019492--
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(                       //PCR019492--
//							thisCntrlr.bundle.getText("S2BSDASSMENTLVL2"));                                                             //PCR019492--
//					} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL3")) {                                    //PCR019492--
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(                       //PCR019492--
//							thisCntrlr.bundle.getText("S2BSDASSMENTLVL3"));                                                             //PCR019492--
//					} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD")) {                                 //PCR019492--
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(                       //PCR019492--
//							thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"));                                                          //PCR019492--
//					} else {                                                                                                            //PCR019492--
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(                       //PCR019492--
//							thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP"));                                                            //PCR019492--
//					}                                                                                                                   //PCR019492--
//					if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL1")) {                                           //PCR019492--
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(                       //PCR019492--
//							thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"));                                                             //PCR019492--
//					} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL2")) {                                    //PCR019492--
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(                       //PCR019492--
//							thisCntrlr.bundle.getText("S2BSDASSMENTLVL2"));                                                             //PCR019492--
//					} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL3")) {                                    //PCR019492--
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(                       //PCR019492--
//							thisCntrlr.bundle.getText("S2BSDASSMENTLVL3"));                                                             //PCR019492--
//					} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD")) {                                 //PCR019492--
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(                       //PCR019492--
//							thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"));                                                          //PCR019492--
//					} else {                                                                                                            //PCR019492--
//						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(                       //PCR019492--
//							thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP"));                                                            //PCR019492--
//					}                                                                                                                   //PCR019492--
					if(oppQuesdata.Asc606_BsdaFlag === ""){
						if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL1")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"));
						} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL2")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVL2"));
						} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL3")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVL3"));
						} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
									thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606"));
						} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
									thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606"));
						} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
									thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606"));
						} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"));
						} else {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP"));
						}
					} else if(oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
						if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606"));
						} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606"));
						} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606"));
						} else if (oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"));
						} else {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP"));
						}
					}
					if(oppQuesdata.Asc606_SsdaFlag === ""){
						if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL1")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"));
						} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL2")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVL2"));
						} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL3")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVL3"));
						} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"));
						} else {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP"));
						}
					} else if(oppQuesdata.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
						if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2PSRDCRRASHPODTXTASC606"));
						} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2PSRDCRRACARTXTASC606"));
						} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2PSRDCRRADEFERTXTASC606"));
						} else if (oppQuesdata.Ssdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD")) {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"));
						} else {
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setSelectedKey(
								thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP"));
						}
					}			
					//***************End Of PCR019492: ASC606 UI Changes********
					if (parseInt(oppQuesdata.PsrStatus) === 17) {
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SSDAsses_COMBOBOX).setEnabled(true);
						oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setEnabled(true);
					}
				}
			}
			(parseInt(oppQuesdata.PsrStatus) === 5 || parseInt(oppQuesdata.PsrStatus) === 4) ? ((oppQuesdata.CcOppId !== "" && oppQuesdata.CcOpitmId !==
				"") ? (oView.byId(com.amat
				.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false)) : (oView.byId(com.amat.crm
					.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true), oView.byId(com.amat.crm.opportunity
					.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true), oView.byId(com.amat.crm.opportunity.Ids
					.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle.getText("S2PSRSDASFCANINITXT")), thisCntrlr
				.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(thisCntrlr.bundle
					.getText("S2CANCELBTNICON")))) : (
				(parseInt(oppQuesdata.PsrStatus) ===
					65) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true),
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true),
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setExpanded(
						true), thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true)
				) : (parseInt(oppQuesdata.PsrStatus) === 60 && oppQuesdata.PsrRequired ===
					thisCntrlr.bundle.getText("S2NEGMANDATANS")) ? (thisCntrlr.getView().byId(com.amat.crm.opportunity
						.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true), thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(false), thisCntrlr.getView().byId(com.amat.crm.opportunity
						.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true), oView.byId(com.amat.crm.opportunity.Ids
						.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle.getText("S2PSRSDASFCANINITXT")), thisCntrlr
					.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(thisCntrlr.bundle
						.getText("S2CANCELBTNICON"))) : (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn)
					.setVisible(false), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL)
					.setVisible(true), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(
						false), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(thisCntrlr.bundle
						.getText("S2PSRSDAWFICON")), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn)
					.setText(thisCntrlr.bundle.getText("S2PSRSDASUBFORAPP"))));
			(oppQuesdata.PsrStatus === "") ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(false)) :
			(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_GENARALDATA_PANEL).setVisible(true));
			(oppQuesdata.CcOppId !== "" && oppQuesdata.CcOpitmId !== "") ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(
				false)) : (
				"");
			(parseInt(oppQuesdata.PsrStatus) >	65) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false),
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setExpanded(false),
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setExpanded(true)) : 
					(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(false));
			var SAFBtn = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn);
			var SAFBtnText = oppQuesdata.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")? SAFBtn.setText(                                      //PCR019492++
			    thisCntrlr.bundle.getText("S2PSRDCINITRRABTNTXTASC606")) : SAFBtn.setText(this.getResourceBundle().getText("S2PSRSDASFSSDAINITTXT"));     //PCR019492++
			(parseInt(oppQuesdata.PsrStatus) ===
				58 && GenInfoData.Region !== thisCntrlr.bundle.getText("S2OPPREGION")) ?
			(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true),
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true), oView
//				.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle.getText("S2PSRSDASFSSDAINITTXT")), that_views2        //PCR019492--
				.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(SAFBtnText), that_views2                                                //PCR019492++  
				.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false), that_views2.byId(com.amat.crm.opportunity
					.Ids.S2FTER_BTN_RJCT).setVisible(false)) : (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn)
				    .setVisible(false), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false),
				    that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false));
			(parseInt(oppQuesdata.PsrStatus) === 85 || parseInt(oppQuesdata.PsrStatus) ===	5 || parseInt(oppQuesdata.PsrStatus) === 90) ? 
					(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true),
				    oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true), oView
				    .byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle.getText("S2PSRSDASFCANINITXT"))) : ("");
			(parseInt(oppQuesdata.PsrStatus) >= 65) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(
				true)) : ((parseInt(oppQuesdata.PsrStatus) === 60) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL)
				.setVisible(true)) : (""));
			(parseInt(oppQuesdata.PsrStatus) === 65) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true),
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true)) : ("");
			(parseInt(oppQuesdata.PsrStatus) >= 65 && (oppQuesdata.CcOppId !== "" && oppQuesdata.CcOpitmId !==
					"")) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setVisible(true),
				    oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setEnabled(true), thisCntrlr
				    .getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setVisible(true), oView
				    .byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAVEBtn).setEnabled(false)) : ("");
			((parseInt(oppQuesdata.PsrStatus) === 58 || parseInt(oppQuesdata.PsrStatus) === 55) && GenInfoData.Region === thisCntrlr.bundle.getText("S2OPPREGION")) ?
			(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false)) : ("");
			(parseInt(oppQuesdata.PsrStatus) === 5 && (oppQuesdata.CcOppId !== "" && oppQuesdata.CcOpitmId !== "" && oppQuesdata.BsdaResetFlag !== this.getResourceBundle()                                    //PCR019492++
					.getText("S1TABLESALESTAGECOL"))) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false)) : ("");                                                             //PCR019492++
			var bmoUserList = GenInfoData.NAV_BMO_INFO.results;
			var bmoUserFlag = thisCntrlr.checkContact(bmoUserList);
			var romUserFlag = thisCntrlr.checkContact(GenInfoData.NAV_ROM_INFO.results);                                                                                                                       //PCR028711++;
			var asmUserFlag = thisCntrlr.checkContact(GenInfoData.NAV_ASM_INFO.results);                                                                                                                       //PCR028711++;
			var RcreatBsdaBtnTxt = oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")? thisCntrlr.bundle.getText("S2PSRBRRARESETBTNTXTASC606") :                                       //PCR019492++
				thisCntrlr.bundle.getText("S2PSRRETESTBTNTXT");                                                                                                                                                //PCR019492++
			//((parseInt(oppQuesdata.PsrStatus) === 55 || parseInt(oppQuesdata.PsrStatus) === 58) && GenInfoData.ActBookDate === "" && (bmoUserFlag === true && oppQuesdata.CcOppId ===                        //PCR019492++ added ActBookDate condition++; PCR022669--
			((parseInt(oppQuesdata.PsrStatus) === 55 || parseInt(oppQuesdata.PsrStatus) === 58) && ((bmoUserFlag === true || romUserFlag === true || asmUserFlag === true) && oppQuesdata.CcOppId ===          //PCR022669++ added ActBookDate condition--; PCR028711++
				"" && oppQuesdata.CcOpitmId === "" && oppQuesdata.SsdaResetFlag !== thisCntrlr.bundle.getText("S1TABLESALESTAGECOL"))) ? (
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(true), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET)
//				.setText(thisCntrlr.bundle.getText("S2PSRRETESTBTNTXT"))) : (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(                                                       //PCR019492--
				.setText(RcreatBsdaBtnTxt)) : (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false));                                                                             //PCR019492++;
			(parseInt(oppQuesdata.PsrStatus) >= 17 && oppQuesdata.PsrType === thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT") && GenInfoData.Region === 
				thisCntrlr.bundle.getText("S2OPPREGION") && oppQuesdata.Bd === "" && oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL"))                                                //PCR019492++
				?(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"))):("");
			if(oppQuesdata.Asc606_BsdaFlag === ""){                                                                                                                                                             //PCR019492++
				if(oppQuesdata.OldBsdaVal !== "" && oppQuesdata.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
					 (oppQuesdata.Bsdl !== "") ? oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(oppQuesdata.Bsdl):                                                    //PCR019492++
							oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(this.getResourceBundle().getText("S2BSDASSMENTLVLOP"));                                    //PCR019492++
				} else {                                                                                                                                                                                        //PCR019492++
					(parseInt(oppQuesdata.PsrStatus) >= 15 && GenInfoData.Region === thisCntrlr.bundle.getText("S2OPPREGION") && oppQuesdata.PsrType ===
						thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT") && oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) ? (                                                      //PCR019492++
						(oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVL1")) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX)
							.setSelectedKey(thisCntrlr.bundle.getText("S2BSDASSMENTLVL1"))) : (
							(oppQuesdata.Bsdl === thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD")) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX)
								.setSelectedKey(thisCntrlr.bundle.getText("S2BSDASSMENTLVLAMJD"))) : (""))) : ("");
				}			 
			} else {                                                                                                                                                                                            //PCR019492++
				(oppQuesdata.Bsdl !== "") ? oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(oppQuesdata.Bsdl):                                                         //PCR019492++
					oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(this.getResourceBundle().getText("S2BSDASSMENTLVLOP"));                                            //PCR019492++
			}	                                                                                                                                                                                                //PCR019492++
			var compSAFTxt = oppQuesdata.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")? thisCntrlr.bundle.getText("S2PSRDCINITRRABTNTXTASC606")                                                    //PCR019492++
						: thisCntrlr.bundle.getText("S2PSRSDASFSSDAINITTXT");				                                                                                                                    //PCR019492++
			((parseInt(oppQuesdata.PsrStatus) === 55 || parseInt(oppQuesdata.PsrStatus) === 58) && GenInfoData.Region !== thisCntrlr.bundle.getText(
				"S2OPPREGION")) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true), oView.byId(com.amat.crm.opportunity
				.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(
//						thisCntrlr.bundle.getText("S2PSRSDASFSSDAINITTXT")), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false),                                                  //PCR019492--
						compSAFTxt), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false),                                                                                          //PCR019492++
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false)) : (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn)
				.setVisible(false), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false), that_views2.byId(com.amat.crm.opportunity
				.Ids.S2FTER_BTN_RJCT).setVisible(false));
			(parseInt(oppQuesdata.PsrStatus) === 5 && oppQuesdata.CcOppId === "" && oppQuesdata.CcOpitmId === "" && oppQuesdata.BsdaResetFlag !== this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ?    //PCR019492++
				(oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true),                              //PCR019492++
				oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(thisCntrlr.bundle.getText("S2PSRSDASFCANINITXT")), oView.byId(
				com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(thisCntrlr.bundle.getText("S2CANCELBTNICON"))) : ("");
			var canInitBtnTxt = oppQuesdata.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")? thisCntrlr.bundle.getText("S2PSRSDASFCONSSDAINITTXTASC606")                                          //PCR019492++
					: thisCntrlr.bundle.getText("S2PSRSDASFCONSSDAINITTXT");	                                                                                                                                 //PCR019492++
			(parseInt(oppQuesdata.PsrStatus) === 65) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true), oView.byId(
					com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn)
				.setText(canInitBtnTxt), oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(thisCntrlr.bundle.getText("S2CANCELBTNICON"))) : ("");                                           //PCR019492++
			(parseInt(oppQuesdata.PsrStatus) === 4) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false)) : ("");
			var RcreatSsdaBtnTxt = oppQuesdata.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")? thisCntrlr.bundle.getText("S2PSRSRRARESETBTNTXTASC606") :                                         //PCR019492++
				thisCntrlr.bundle.getText("S2PSRRETESTSSDABTNTXT");                                                                                                                                              //PCR019492++
			(parseInt(oppQuesdata.PsrStatus) === 60 && (bmoUserFlag === true) && GenInfoData.ActShipDate === "") ? (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET)                              //PCR019492++:ActBookDate condition++;PCR022669++:ActBookDate replaced with ActShipDate
//				.setVisible(true), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setText(thisCntrlr.bundle.getText("S2PSRRETESTSSDABTNTXT"))) : ("");                                          //PCR019492--
				.setVisible(true), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setText(RcreatSsdaBtnTxt)) : ("");                                                                            //PCR019492++
			((parseInt(oppQuesdata.PsrStatus) === 55 || parseInt(oppQuesdata.PsrStatus) === 58) && GenInfoData.Region === thisCntrlr.bundle.getText(
				"S2OPPREGION")) ? (oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false)) : (parseInt(oppQuesdata.PsrStatus) === 
					60 ? oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false) : "" );
			//************************Start Of PCR019492: ASC606 UI Changes**************
			var rdBtnGrp = oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp);
			//************Start Of PCR021481: 4190 : Q2C Q1/Q2 enhancements ***********************
			//if(oppQuesdata.PsrRequired === "" && GenInfoData.ItmDesc.substring(0,4) === this.bundle.getText("S2PSRDCEVALPROPTXT") 
			//   && oppQuesdata.Asc606_Flag === this.getResourceBundle().getText("S2ODATAPOSVAL")){
			//	  rdBtnGrp.getButtons().length === 3 ? that_views2.getController().createRdBtn(this.bundle.getText("S2PSRDCEVALTXT"), rdBtnGrp): "";
			//} else {
			//	  rdBtnGrp.getButtons().length > 3 ? rdBtnGrp.getButtons()[3].destroy() : "";
			//}
			if(oppQuesdata.PsrRequired === "" && oppQuesdata.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				if(GenInfoData.Region === thisCntrlr.bundle.getText("FRAGLLAMJ")){
					rdBtnGrp.getButtons().length >= 4 ? that_views2.getController().createRdBtn(thisCntrlr.bundle.getText("S2PSRRRANTAPPTXTAMJD"), rdBtnGrp): "";
				//}if(GenInfoData.ItmDesc.substring(0,4) === thisCntrlr.bundle.getText("S2PSRDCEVALPROPTXT")){                                                 PCR022669-- 
			    }if(GenInfoData.EvalFlag === this.bundle.getText("S1TABLESALESTAGECOL")){                                                                    //PCR022669++
					rdBtnGrp.getButtons().length >= 4 ? that_views2.getController().createRdBtn(thisCntrlr.bundle.getText("S2PSRDCNEWEVALTXT"), rdBtnGrp): "";                                                     //PCR033317++; S2PSRDCEVALTXT replaced with S2PSRDCNEWEVALTXT
				}						
			} else {
				if(rdBtnGrp.getButtons().length > 4){
					for(var i = 4; i < rdBtnGrp.getButtons().length; i++){
						rdBtnGrp.getButtons()[i].destroy();
						i--;
					}
				}
			}
			//************End Of PCR021481: 4190 : Q2C Q1/Q2 enhancements ***********************
			if(oppQuesdata.Asc606_BsdaFlag === ""){
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setVisible(true);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).setVisible(false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setVisible(true);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setHeaderText(thisCntrlr.bundle.getText("S2PSRSDABOOKINGSDAASSE"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_BSDAMTLVL).setText(thisCntrlr.bundle.getText("S2PSRSDASDAASSES"));
			} else if(oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				var OppGenInfoModel = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_PANEL).setVisible(false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).setVisible(true);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_DEP_CHECKBOX).setVisible(false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setHeaderText(thisCntrlr.bundle.getText("S2PSRSDABOOKINGSDAASSEASC606"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_BSDAMTLVL).setText(thisCntrlr.bundle.getText("S2PSRSDASDAASSES606"));
				var RRAQuesData = thisCntrlr.getRRAQusData(oppQuesdata.PsrStatus, oppQuesdata.NAV_RRA_QA_PSR, GenInfoData.Region, false);
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
				oppQuesdata.ConAnsFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELLBLTXT)
						.setVisible(true), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELRRAVAL).setVisible(true), this.getView().byId(com.amat.crm
						.opportunity.Ids.S2PSRDC_BMOSELRRAVAL).setText(oppQuesdata.BmoRraValBsda)) : (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELLBLTXT)
						.setVisible(false), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELRRAVAL).setVisible(false));
				if(parseInt(oppQuesdata.PsrStatus) === 15 && thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText() === 
					thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT")){
					var BMOPosFlag = false;
					var TabData = this.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE).getModel().getData().items;
					for(var k = 0; k< TabData.length; k++){
						if (TabData[k].BMOValueState === "Error"){
							BMOPosFlag = true;
						}
					}
					BMOPosFlag === true ? this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(false) : this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(true);
				} else if (parseInt(oppQuesdata.PsrStatus) >= 25 && parseInt(oppQuesdata.PsrStatus) !== 40){
					RRAQuesData.results[RRAQuesData.results.length-1].SelectionIndex > 0 ? (oppQuesdata.BmoRraValBsda !== oppQuesdata.Bsdl && oppQuesdata.Bsdl !== "" ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE)
							.setVisible(true), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setValue(oppQuesdata.ConComments), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE)
							.setTooltip(oppQuesdata.ConComments), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setEnabled(false)) : this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setVisible(false)):"";
						}
			}
			if(oppQuesdata.Asc606_SsdaFlag  === ""){				
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SMANDAT_FID).setText(thisCntrlr.bundle.getText("S2PSRSDASHIPPINGLEVQUESTION"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setHeaderText(thisCntrlr.bundle.getText("S2PSRSDASHIPPINGSDAASSES"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SSDAMTLVL).setText(thisCntrlr.bundle.getText("S2PSRSDASDAASSES"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setVisible(true);
			} else if(oppQuesdata.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SMANDAT_FID).setText(thisCntrlr.bundle.getText("S2PSRSDASHIPPINGLEVQUESTIONASC606"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setHeaderText(thisCntrlr.bundle.getText("S2PSRSDASHIPPINGSDAASSESASC606"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SSDAMTLVL).setText(thisCntrlr.bundle.getText(thisCntrlr.bundle.getText("S2PSRSDASDAASSES606")));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDEP_CHECKBOX).setVisible(false);
			}
			oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") || oppQuesdata.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ?
				(this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_CNGHISPNL).setVisible(true),this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_CNGHISTAB).setModel(
						this.getJSONModel(oppQuesdata.NAV_CHANGE_HISTORY))) : this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_CNGHISPNL).setVisible(false);
			var iconTabTxt = "", manHdrTxt = "";
			(oppQuesdata.Asc606_Flag === this.getResourceBundle().getText("S2ODATAPOSVAL") && (oppQuesdata.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ||
				 oppQuesdata.Asc606_SsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") || oppQuesdata.OldBsdaVal !== "" || oppQuesdata.PsrRequired === "")) ? ((GenInfoData.Division === this.getResourceBundle()          //PCR025717++
				.getText("S2ICONTABPDCTEXT") || GenInfoData.Division === this.getResourceBundle().getText("S2D3TEXT")) ? (iconTabTxt = this.getResourceBundle().getText(
				"S2PDCSDAICONTABFTEXTASC606"), manHdrTxt = this.getResourceBundle().getText("S2PDCRRATABSTATUSBARTITASC606")): (iconTabTxt = this.getResourceBundle().getText(
				"S2PSRSDAICONTABFTEXTASC606"), manHdrTxt = this.getResourceBundle().getText("S2PSRRRASTATBARLFTTITASC606"))) : ((GenInfoData.Division === this.getResourceBundle()
				.getText("S2ICONTABPDCTEXT") || GenInfoData.Division === this.getResourceBundle().getText("S2D3TEXT")) ? (iconTabTxt = this.getResourceBundle().getText(
				"S2PDCSDAICONTABFTEXT"), manHdrTxt = this.getResourceBundle().getText("S2PDCTABSTATUSBARTIT")) : (iconTabTxt = this.getResourceBundle().getText("S2PSRSDAICONTABFTEXT"),
				manHdrTxt = this.getResourceBundle().getText("S2PSRSDASTATBARLFTTIT")));
			GenInfoData.Division === this.getResourceBundle().getText("S2ICONTABPDCTEXT") || GenInfoData.Division === this.getResourceBundle().getText("S2D3TEXT") ?
				(that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setText(iconTabTxt), this.getOwnerComponent().pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_HDRMAINTXT).setText(manHdrTxt)) :                 //PCR020999++
				(that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setText(iconTabTxt), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_HDRMAINTXT).setText(manHdrTxt));
			thisCntrlr.onExpendSections(parseInt(oppQuesdata.PsrStatus), oppQuesdata);
			//************************Start Of PCR019492: 10257 : ASC606 UI Changes**************
			if(oppQuesdata.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") && oppQuesdata.PsrRequired === ""){
				this.getOwnerComponent().pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp).getButtons()[2].setText(thisCntrlr.bundle.getText("S2PSRDCSDANTAPPTXTASC606"));                                   //PCR020999++
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).getButtons()[2].setText(thisCntrlr.bundle.getText("S2PSRDCSDANTAPPTXTASC606"));
			} else {
				this.getOwnerComponent().pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RADIOBtnGrp).getButtons()[2].setText(thisCntrlr.bundle.getText("S2CBCSELNAPP"));                                               //PCR020999++
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).getButtons()[2].setText(thisCntrlr.bundle.getText("S2CBCSELNAPP"));
			}
			//************************End Of PCR019492: 10257 : ASC606 UI Changes**************
			//************************Start Of PCR025717 Q2C Q4 2019 Enhancements**************
		    if (oppQuesdata.NAV_PSR_CC.results.length > 0) {
				var romInitiateFlag = thisCntrlr.checkContact(GenInfoData.NAV_ROM_INFO.results);
				var BMOInitiateFlag = thisCntrlr.checkContact(GenInfoData.NAV_BMO_INFO.results);
				romInitiateFlag === true || BMOInitiateFlag === true ? this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_CARBON_COPY_BOX)
					.setVisible(true) : this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(false);				
			} else {
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_CARBON_COPY_BOX).setVisible(false);
			}
		  //************************End Of PCR025717 Q2C Q4 2019 Enhancements**************
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
					PsrStatus !== "25" ? Qusdataset.results[i].enabled = enabled : Qusdataset.results[i].enabled = false;
					if(Region !== thisCntrlr.bundle.getText("S2OPPREGION")){
						switch(i){
						case 0: 
						case 1:
							FinalQusSet.results.push(Qusdataset.results[i]);break;
						case 2: Qusdataset.results[1].SalesFlg === "N" ? FinalQusSet.results.push(Qusdataset.results[i]) : "";break;
						case 3: Qusdataset.results[1].SalesFlg === "N" && Qusdataset.results[2].SalesFlg === "Y" ? FinalQusSet.results.push(Qusdataset.results[i]) : "";break;
						case 4:
							FinalQusSet.results.push(Qusdataset.results[i]);break;
						case 5: PsrStatus === "25" || parseInt(PsrStatus) >= 55 ? (Qusdataset.results[i].enabled = (enabled === true ? true : false), FinalQusSet.results.push(Qusdataset.results[i])) : "";break;
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
						case 6: PsrStatus === "25" || parseInt(PsrStatus) >= 55 ? (Qusdataset.results[i].enabled = (enabled === true ? true : false), FinalQusSet.results.push(Qusdataset.results[i])) : "";break;
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
			var oppQuesdata = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var changeLine = oEvent.getSource().getParent().getBindingContext().getPath().slice(-1);
			var QuesNo = oEvent.getSource().getParent().getBindingContext().getModel().getData().results[parseInt(changeLine)];
			var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			var RRALevelVal = "", SDAAssesItem, rraDeterFlag = false, Region = GenInfoData.Region, Qusdataset = oppQuesdata.NAV_RRA_QA_PSR;
			if(QuesNo.SelectionIndex === 1){QuesNo.SalesFlg = "Y"}
			else if(QuesNo.SelectionIndex === 2){QuesNo.SalesFlg = "N"}
			else{QuesNo.SalesFlg = ""}
			var RRAQuesData = thisCntrlr.getRRAQusData(oppQuesdata.PsrStatus, Qusdataset, Region, true);			
			this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).setModel(this.getJSONModel(RRAQuesData));
			for(var p = 0; p < RRAQuesData.results.length; p++){
				if(RRAQuesData.results[p].valueState === "Error"){
					rraDeterFlag = true;
				}
			}
			if(rraDeterFlag === false){
				if(Region === thisCntrlr.bundle.getText("S2OPPREGION") && Qusdataset.results[1].SalesFlg === "Y"){
					RRALevelVal = "AMJD";
					SDAAssesItem = {
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
						} else if((Qusdataset.results[0].SalesFlg === "Y" && Qusdataset.results[1].SalesFlg === "N" && Qusdataset.results[2].SalesFlg === "Y" && Qusdataset.results[3].SalesFlg === "Y" 
							&& Qusdataset.results[4].SalesFlg === "N") || (Qusdataset.results[0].SalesFlg === "Y" && Qusdataset.results[1].SalesFlg === "Y" && Qusdataset.results[4].SalesFlg === "N")){
							RRALevelVal = "CAR";
						} else {
							RRALevelVal = "DEFER";
						}
						SDAAssesItem = {"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level"},
						                                           {"ProductId": "SHPOD", "Name": "SHPOD"}, 
						                                           {"ProductId": "CAR","Name": "CAR"},
						                                           {"ProductId": "DEFER", "Name": "DEFER"}]};
					} else {
						if(Qusdataset.results[1].SalesFlg === "N"){
							if(Qusdataset.results[0].SalesFlg === "Y" && Qusdataset.results[2].SalesFlg === "N" && Qusdataset.results[3].SalesFlg === "N"
								&& Qusdataset.results[5].SalesFlg === "N"){
								RRALevelVal = "SHPOD";
							} else if((Qusdataset.results[0].SalesFlg === "Y" && Qusdataset.results[2].SalesFlg === "N" && Qusdataset.results[3].SalesFlg === "Y" && Qusdataset.results[4].SalesFlg === "Y" 
								&& Qusdataset.results[5].SalesFlg === "N") || (Qusdataset.results[0].SalesFlg === "Y" && Qusdataset.results[2].SalesFlg === "Y"
									&& Qusdataset.results[5].SalesFlg === "N")){
								RRALevelVal = "CAR";
							} else {
								RRALevelVal = "DEFER";
							}
							SDAAssesItem = {
									"SDAAssesCollection": [{"ProductId": "OP", "Name": "Select Level" }, 
									                       {"ProductId": "SHPOD", "Name": "SHPOD"}, 
									                       {"ProductId": "CAR", "Name": "CAR"},
									                       {"ProductId": "DEFER", "Name": "DEFER"},
									                       {"ProductId": "AMJD", "Name": "AMJD"}]};
						}					
					}				
				}
				var oModel1 = this.getJSONModel(SDAAssesItem);
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setModel(oModel1);
			}
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAsses_COMBO_BOX).setSelectedKey(RRALevelVal);
			if(parseInt(oppQuesdata.PsrStatus) === 25){
				RRAQuesData.results[RRAQuesData.results.length-1].SelectionIndex > 0 ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELLBLTXT)
				  .setVisible(true), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELRRAVAL).setVisible(true), this.getView().byId(com.amat.crm
				  .opportunity.Ids.S2PSRDC_BMOSELRRAVAL).setText(oppQuesdata.BmoRraValBsda)) : (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELLBLTXT)
				  .setVisible(false), this.getView().byId(com.amat.crm.opportunity.Ids.S2PSRDC_BMOSELRRAVAL).setVisible(false));				  
				RRAQuesData.results[RRAQuesData.results.length-1].SelectionIndex > 0 ? (oppQuesdata.BmoRraValBsda !== RRALevelVal && oppQuesdata.Bsdl !== "" ? (this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setVisible(true), this.getView()
				   .byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setValue(oppQuesdata.ConComments), this.getView().byId(com.amat.crm.opportunity.Ids
				   .S2PSR_RRADEFFNOTE).setTooltip(oppQuesdata.ConComments)) : this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_RRADEFFNOTE).setVisible(false)) : "";
			}
		},
		/**
		 * This method is used to handles RRA question comment length.
		 * 
		 * @name handleRRANoteLiveChange
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		handleRRANoteLiveChange: function(oEvent){
			if (oEvent.getParameters().value.length >= 255) {
				var RRAComTxt = oEvent.getParameters().value.substr(0, 254);
				oEvent.getSource().setValue(RRAComTxt);
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCMCOMMVALTXT"));
			}
		},
		/**
		 * This method is used to handles PSR process panels Expand mode.
		 * 
		 * @name setExpVal
		 * @param expValArr - Panels Expend Array
		 * @returns
		 */
		setExpVal: function(expValArr){
			var oView  = thisCntrlr.getView();
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CONTACTINFO_PANEL).setExpanded(expValArr[0]);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_PANEL).setExpanded(expValArr[1]);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setExpanded(expValArr[2]);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setExpanded(expValArr[3]);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_PANEL).setExpanded(expValArr[4]);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setExpanded(expValArr[5]);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setExpanded(expValArr[6]);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_B_APPROVALS_PANEL).setExpanded(expValArr[7]);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setExpanded(expValArr[8]);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RESET_LIST_PANEL).setExpanded(expValArr[9]);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL).setExpanded(expValArr[10]);
			oView.byId(com.amat.crm.opportunity.Ids.S2PSR_CNGHISPNL).setExpanded(expValArr[11]);
		},
		/**
		 * This method is used to handles PSR status wise panels Expand mode.
		 * 
		 * @name onExpendSections
		 * @param PsrStatus - PSR Status, PsrData - PSR updated Data
		 * @returns
		 */
		onExpendSections: function(PsrStatus, PsrData){
			var expValArr = [];
			var MainComExpVal = thisCntrlr.getMainComExpVal() ? true : false;;
			var ccExpVal = PsrData.NAV_PSR_CC.results.length > 0 ? true : false;
			var custSpecExpVal = PsrData.NAV_CUST_REVSPEC.results.length > 0 ? true : false;
			var RelPerSpecExpVal = PsrData.NAV_REV_DOCS.results.length > 0 ? true : false;
			var FinalSpecExpVal = PsrData.NAV_FNL_DOCS.results.length > 0 ? true : false;
			switch (PsrStatus) {
			case 4:
			case 5:
				//expValArr = [true, false, true, true, false, false, false, false, false, false, MainComExpVal, false];                                 PCR025717--
				expValArr = [true, ccExpVal, true, true, false, false, false, false, false, false, MainComExpVal, false];                              //PCR025717++; 2nd array element chnage with ccExpVal
				thisCntrlr.setExpVal(expValArr);				
				break;
			case 15:
				//expValArr = [true, false, true, true, false, true, false, false, false, false, MainComExpVal, false];                                  PCR025717-- 
				expValArr = [true, ccExpVal, true, true, false, true, false, false, false, false, MainComExpVal, false];                               //PCR025717++; 2nd array element chnage with ccExpVal
				thisCntrlr.setExpVal(expValArr);
				break;
            case 17:
            	//expValArr = [false, false, false, false, true, true, false, true, false, false, MainComExpVal, false];                                 PCR025717--
            	expValArr = [false, ccExpVal, false, false, true, true, false, true, false, false, MainComExpVal, false];                              //PCR025717++; 2nd array element chnage with ccExpVal
            	thisCntrlr.setExpVal(expValArr);
				break;
            case 40:
            	//expValArr = [false, false, false, false, true, true, false, true, false, false, MainComExpVal, false];                                 PCR025717--
            	expValArr = [false, ccExpVal, false, false, true, true, false, true, false, false, MainComExpVal, false];                              //PCR025717++; 2nd array element chnage with ccExpVal
            	thisCntrlr.setExpVal(expValArr);
				break;
            case 25:
            	//expValArr = [false, false, false, false, true, true, false, true, false, false, MainComExpVal, false];                                 PCR025717--
            	expValArr = [false, ccExpVal, false, false, true, true, false, true, false, false, MainComExpVal, false];                              //PCR025717++; 2nd array element chnage with ccExpVal
            	thisCntrlr.setExpVal(expValArr);
				break;
            case 55:
            case 58:	
            	expValArr = [false, ccExpVal, false, false, false, true, false, false, false, false, MainComExpVal, false]; 
				thisCntrlr.setExpVal(expValArr);
				break;
            case 60:	
            	//expValArr = [false, false, false, false, false, false, true, false, false, false, MainComExpVal, false];                                PCR025717--
            	expValArr = [false, ccExpVal, false, false, false, false, true, false, false, false, MainComExpVal, false];                             //PCR025717++; 2nd array element chnage with ccExpVal
            	thisCntrlr.setExpVal(expValArr);
				break;
            case 65:	
            	//expValArr = [true, false, false, false, false, true, true, false, false, false, MainComExpVal, false];                                  PCR025717--
            	expValArr = [true, ccExpVal, false, false, false, true, true, false, false, false, MainComExpVal, false];                               //PCR025717++; 2nd array element chnage with ccExpVal
            	thisCntrlr.setExpVal(expValArr);
				break;
            case 70:	
            	//expValArr = [true, false, false, false, false, false, true, false, true, false, MainComExpVal, false];                                  PCR025717--
            	expValArr = [true, ccExpVal, false, false, false, false, true, false, true, false, MainComExpVal, false];                               //PCR025717++; 2nd array element chnage with ccExpVal
            	thisCntrlr.setExpVal(expValArr);
				break;
            case 75:	
            	//expValArr = [true, false, false, false, false, false, true, false, true, false, MainComExpVal, false];                                  PCR025717--
            	expValArr = [true, ccExpVal, false, false, false, false, true, false, true, false, MainComExpVal, false];                               //PCR025717++; 2nd array element chnage with ccExpVal
            	thisCntrlr.setExpVal(expValArr);
				break;
            case 85:
            case 90:
            	//expValArr = [false, false, false, false, false, false, false, false, false, false, true, false];                                        PCR025717--
            	expValArr = [false, ccExpVal, false, false, false, false, false, false, false, false, true, false];                                     //PCR025717++; 2nd array element chnage with ccExpVal
            	thisCntrlr.setExpVal(expValArr);
				break;
			}
		},
		/**
		 * This method is used to return main comment length flag.
		 * 
		 * @name getMainComExpVal
		 * @param 
		 * @returns Main Comments model length flag
		 */
		getMainComExpVal: function(){
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setValue("");
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN).setEnabled(false);
			var MCommType = thisCntrlr.bundle.getText("S2PSRMCOMMDATATYP");
			var oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__COMMTABLE);
			var ItemGuid = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
		    var sValidate = "CommentsSet?$filter=ItemGuid eq guid'" + ItemGuid + "'and CommType eq '" + MCommType +"'";
		    this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
		    var MComModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRCOMMMODEL"));
		    oTable.setModel(MComModel);
		    return MComModel.getData().results.length >0;
		},
		//************************End Of PCR019492: ASC606 UI Changes**************
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
		/**
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
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__COMMTABLE), MTxtAra =
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA), SaveBtn =
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN)) : (
				(oEvent.getParameters().id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
						.id.split(thisCntrlr.bundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
					.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN) ? (MCommType = thisCntrlr.bundle.getText(
						"S2CBCMCOMMDATATYP"), MType = thisCntrlr.bundle.getText("S2ICONTABCBCTXT"), oTable =
					that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__COMMTABLE), MTxtAra =
					that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_TEXT_AREA), SaveBtn =
					that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN)) : (MCommType =
					thisCntrlr.bundle.getText("S2PDCMCOMMDATATYP"), MType = thisCntrlr.bundle.getText(
						"S2ICONTABPDCTEXT"), oTable = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__COMMTABLE),
					MTxtAra = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA),
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
		 * This method is used to handles ok button event.
		 * 
		 * @name onRelPerSpecRewOkPress
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onRelPerSpecRewOkPress: function(oEvent) {
			if (oEvent.getSource().getParent().getContent()[2].getColumns()[0].getVisible() === false) {                                              //PCR025717++; getContent()[0] replaced with getContent()[2]
				var items = oEvent.getSource().getParent().getContent()[0].mAggregations.items;
				if (items.length === 0) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCPREOUSOPPMSG"));
				} else {
					var OppGenInfoModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL"));
					var oEntry = {
						Guid: OppGenInfoModel.getData().Guid,
						ItemGuid: OppGenInfoModel.getData().ItemGuid,
						OppId: thisCntrlr.that_views2.getController().OppId,
						ItemNo: thisCntrlr.that_views2.getController().ItemNo,
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
					};
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CustDocDataSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, oEntry, thisCntrlr.bundle.getText("S2PSRSDASUCSSLINK"));
					this.closeDialog();
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(true);
					this.refreshRelPerSpecRewData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid, true);                                                                           //PCR022669++; added new parameter true
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).getModel().getData()
						.length === 0 ? thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX).setVisible(
							true) : thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX).setVisible(
							false);
				}
			} else if (this.CbnType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")) {
				var oTable1 = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CARBON_COPY_TABLE);
				var FinalRecord = {
					"results": []
				};
				var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRSDACBCCCPYMODEL")).getData().results;
				for (var i = 0, n = 0; i < PSRData.length; i++) {
					if (PSRData[i].Selected === true) {
						FinalRecord.results[n] = PSRData[i];
						n++;
					}
				}
				this._initiateControllerObjects();
				FinalRecord.results = FinalRecord.results.concat(this.PSRCCData.results);
				this.closeDialog();
				var cModel = this.getJSONModel(FinalRecord);
				oTable1.setModel(cModel);
				this.SelectedRecord.results.length = 0;
				this.UnselectedRecord.results.length = 0;
			}
		},
		/**
		 * This method is used to Remove duplicate on Single Array.
		 * 
		 * @name RemoveDuplicateWdKey
		 * @param arr - Array, key- key Property to check duplicate
		 * @returns 
		 */
		RemoveDuplicateWdKey: function(arr, key) {
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
				}).length === 0
			});
			var onlyInB = TabData.filter(function(current) {
				return Selected.filter(function(current_Selected) {
					return current_Selected.OppId === current.OppId && current_Selected.ItemId === current.ItemId
				}).length === 0
			});
			var result = onlyInA.concat(onlyInB);
			return result;
		},
		/**
		 * This method is used to handles CC check Box selection event.
		 * 
		 * @name onSelectCB
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onSelectCB: function(oEvent) {
			var SelectedDes = oEvent.getParameters().selected;
			var Selectedline = oEvent.getSource().getBindingContext().sPath.split(thisCntrlr.bundle.getText(
				"S2CBCPSRCARMSEPRATOR"))[oEvent.getSource().getBindingContext().sPath.split(thisCntrlr.bundle
				.getText("S2CBCPSRCARMSEPRATOR")).length - 1];
			if (this.CbnType === thisCntrlr.bundle.getText("S2ICONTABPSRTEXT")) {
				var oCbnCpyModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRSDACBCCCPYMODEL"));
				for (var i = 0; i < oCbnCpyModel.getData().results.length; i++) {
					if (i === parseInt(Selectedline)) {
						if (SelectedDes === true) {
							this.SelectedRecord.results.push(oCbnCpyModel.getData().results[i]);
						} else {
							this.UnselectedRecord.results.push(oCbnCpyModel.getData().results[i]);
						}
					}
				}
			} else if (this.CbnType === thisCntrlr.bundle.getText("S2ICONTABCBCTXT")) {
				var oCBCCbnCpyModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBCBCCCPYMODEL"));
				for (var i = 0; i < oCBCCbnCpyModel.getData().results.length; i++) {
					if (i === parseInt(Selectedline)) {
						if (SelectedDes === true) {
							this.SelectedRecord.results.push(oCBCCbnCpyModel.getData().results[i]);
						} else {
							this.UnselectedRecord.results.push(oCBCCbnCpyModel.getData().results[i]);
						}
					}
				}
			} else if (this.CbnType === thisCntrlr.bundle.getText("S2ICONTABPDCTEXT")) {
				var oPDCCbnCpyModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCCCPYMODEL"));
				for (var i = 0; i < oPDCCbnCpyModel.getData().results.length; i++) {
					if (i === parseInt(Selectedline)) {
						if (SelectedDes === true) {
							this.SelectedRecord.results.push(oPDCCbnCpyModel.getData().results[i]);
						} else {
							this.UnselectedRecord.results.push(oPDCCbnCpyModel.getData().results[i]);
						}
					}
				}
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
				}).length === 0
			});
			return onlyInA;
		},
		/**
		 * This method Handles Approve Button Event.
		 * 
		 * @name onApprovePSRSDA
		 * @param evt - Handles Event Handler
		 * @returns 
		 */
		onApprovePSRSDA: function(evt) {
			this._initiateControllerObjects(thisCntrlr);
			var PSRData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData();
			var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL"));
			var AprFlag = this.ValidatePSRAPr();
			if (AprFlag === false) {
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2USERALLAUTHFALTTXT"))
			} else {
				var ContCheck = this.validatePSRContact();
				if (ContCheck[0] === false) {
					//thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCSFACONVLIDMSG") + " " + ContCheck[1]);												 //PCR028711--; modify contacts message
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRCONTACTS"));                                                                                 //PCR028711++; modify contacts message
				} else {
					this.detActionType = (evt.getSource().getText() === thisCntrlr.bundle.getText("S2PSRCBCAPPROVETEXT") ? thisCntrlr.bundle
						.getText("S2PSRCBCAPPROVEKEY") : thisCntrlr.bundle.getText("S2PSRCBCREJECTKEY"));
					if (this.that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle.getText(
							"S2ICONTABPSRSDAKEY")) {
						var ContCheck = this.validatePSRContact();
						if (ContCheck[0] === false) {
							//thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCSFACONVLIDMSG") + " " + ContCheck[1]);										 //PCR028711--; modify contacts message
							thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRCONTACTS"));                                                                         //PCR028711++; modify contacts message
						} else {
							var BMHEDUserList = GenInfoData.getData().NAV_BMHEAD_INFO
								.results;
							var BMHEDInitiateFlag = this.checkContact(BMHEDUserList);
							var ConUserList = GenInfoData.getData().NAV_CON_INFO.results;
							var ConInitiateFlag = this.checkContact(ConUserList);
							var GPMUserList = GenInfoData.getData().NAV_GPM_INFO.results;
							var GPMInitiateFlag = this.checkContact(GPMUserList);
							var BmoUserList = GenInfoData.getData().NAV_BMO_INFO.results;
							var BmoInitiateFlag = this.checkContact(BmoUserList);
							var UserCheck = false;
							if (parseInt(PSRData.PsrStatus) === 40 || parseInt(PSRData.PsrStatus) === 75) {
								(BMHEDInitiateFlag === true || GPMInitiateFlag === true) ? (UserCheck = true) : (UserCheck = false);
							} else if (parseInt(PSRData.PsrStatus) === 25 || parseInt(PSRData.PsrStatus) === 70) {
								(ConInitiateFlag === true) ? (UserCheck = true) : (UserCheck = false);
							} else if (parseInt(PSRData.PsrStatus) === 17 || parseInt(PSRData.PsrStatus) === 15) {
								(BmoInitiateFlag === true) ? (UserCheck = true) : (UserCheck = false);
							}
							if (UserCheck === false) {
								thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2CBCAUTHNEGATXT"));
							} else {
								var ErrorFlag = this.ValidateData();
								//*************** Justification: PCR018375++ Phase2 - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
//								(ErrorFlag === true) ? (                                                                                                                     //PCR018375--
								(ErrorFlag === true && (!(parseInt(PSRData.PsrStatus) ===15 && this.detActionType === thisCntrlr.bundle.getText("S2PSRCBCREJECTKEY")))) ? (  //PCR018375++ modified condition
									thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCSFAFAILMSG"))
								) : (
									this.that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setVisible(false),
									this.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRCBCONAPPORREJConfirmation"), this),
									this.getCurrentView().addDependent(this.dialog),
									(parseInt(PSRData.PsrStatus) === 40) ?
									((GPMInitiateFlag === true) ? (this.dialog.getContent()[0].getContent()[2].setVisible(true)) : (this.dialog.getContent()[0].getContent()[
										2].setVisible(false))) : ((parseInt(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().PsrStatus) ===
										17 && thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().PsrType === thisCntrlr.bundle
										.getText("S2PSRSDASTATREPEAT")) ? (this.dialog.getContent()[0].getContent()[2].setVisible(true)) : (this.dialog.getContent()[
										0].getContent()[2].setVisible(false))),
									this.dialog.open()
								)
							}
						}
					} else {
						this._initiateControllerObjects();
						var ValidatePDC = that_pdcsda.getController().ValidatePDC();
						if (ValidatePDC === false) {
							thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2USERALLAUTHFALTTXT"));
						} else {
							var PDCModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData(), ErrorFlag = false;                      //PCR019492++	
							if((parseInt(PDCModel.PsrStatus) === 650 || parseInt(PDCModel.PsrStatus) === 682) &&                                                       //PCR019492++
									this.detActionType !== thisCntrlr.bundle.getText("S2PSRCBCREJECTKEY")){		                                                       //PCR019492++						
							    ErrorFlag = that_pdcsda.getController().ValidatePDCData();                                                                             //PCR019492++	
							    if(ErrorFlag){thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCSFAFAILMSG"));}                                        //PCR019492++	
							}if(ErrorFlag === false){                                                                                                                  //PCR019492++                     
								this.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRCBCONAPPORREJConfirmation"), this);
								this.getCurrentView().addDependent(this.dialog);
								(parseInt(PDCModel.PsrStatus) === 640) ? (this.dialog.getContent()[0].getContent()[2].setVisible(true)) : (this.dialog.getContent()[
									0].getContent()[2].setVisible(false));
								this.dialog.open();								
							}                                                                                                                                          //PCR019492++
						}
					}
				}
			}
		},
		/**
		 * This method Handles Work-Flow action.
		 * 
		 * @name onWFPress
		 * @param evt - Holds the current event, thisCntrlr - Current Controller
		 * @returns 
		 */
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
		/**
		 * This method is used to handles SSDA on Select Spec event.
		 * 
		 * @name onSelectSSpec
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onSelectSSpec: function(oEvent) {
			var value = "",
				DecNote = this.dialog.getContent()[0].getContent()[1],
				Maxlength = 254,
				decNoteTxt = "";
			(oEvent.getParameters().selected === true) ? (value = thisCntrlr.bundle.getText("S2ODATAPOSVAL")) :
			(value = "")
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
				.getText("S2ICONTABPSRSDAKEY")) {
				thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().StreachedSpec =
					value;
			} else {
				thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().StreachedSpec =
					value;
			}
			if (value === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) {
				decNoteTxt = DecNote.getValue().substr(0, Maxlength);
				DecNote.setValue(decNoteTxt);
			}
		},
		/**
		 * This method is used to handles Save Comment Event.
		 * 
		 * @name OnApRctCommLvchng
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		OnApRctCommLvchng: function(oEvent) {
			var DecNote = this.dialog.getContent()[0].getContent()[1],
				Maxlength = 255;
			var selectStrachedSpec = this.dialog.getContent()[0].getContent()[2].getItems()[0].getSelected();
			(selectStrachedSpec === true) ? (Maxlength = 240) : (Maxlength = 255);
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
		 * This method is used to handles Note Live Change Event.
		 * 
		 * @name handleNoteLiveChange
		 * @param oEvt - Holds the current event, thisCntrlr - Current Controller
		 * @returns
		 */
		handleNoteLiveChange: function(oEvt) {
			oCommonController.commonNoteLiveChange(oEvt, thisCntrlr);
		},
		/**
		 * This method Handles Reset Process Button Event.
		 * 
		 * @name onResetProcess
		 * @param oEvent - Event Handlers
		 * @returns 
		 */
		onResetProcess: function(oEvent) {
			that_pdcsda.getController().onResetProcess(oEvent);
		},
		/**
		 * This method Handles Reset log panel Expand Event.
		 * 
		 * @name OnExpandResetLog
		 * @param oEvent - Event Handlers
		 * @returns 
		 */
		OnExpandResetLog: function(oEvent) {
			if (oEvent.getParameters().expand === true) {
				var sValidate = "ResetLog?$filter=ItemGuid eq guid'" + thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData()
					.ItemGuid + "'";
				this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RESET_LIST_TABLE).setModel(thisCntrlr.getModelFromCore(thisCntrlr.bundle
					.getText("ResetLogModel")));
			}
		},
		/**
		 * This method Handles Reset Process Button Event.
		 * 
		 * @name onResetProcess
		 * @param oEvent - Event Handlers
		 * @returns 
		 */
		OnRsetCommLvchng: function(oEvent) {
			that_pdcsda.getController().OnRsetCommLvchng(oEvent);
		},
		/**
		 * This method Handles Live Change Event for Carbon Copy F4 Text Change. 
		 * 
		 * @name onCbnCpyChange
		 * @param oEvent - Event Handlers, thisCntrlr - Current Controller
		 * @returns 
		 */
		onCbnCpyChange: function(oEvent, Controller) {
			Controller === undefined ? Controller = thisCntrlr : "";
			Controller.byId(oEvent.getParameters().id).setValue("");
			Controller.showToastMessage(thisCntrlr.bundle.getText("S2PSRSDACBCF4TESTNEGMSG"));
			//*****************Start Of PCR025717 Q2C Q4 2019 Enhancements************************************
			//}
			},
			/**
			 * This method is used to Delink carbon copy child opportunity.
			 * 
			 * @name onPressPSRDeLink
			 * @param oEvent - Holds the current event
			 * @returns
			 */
			onPressPSRDeLink: function(oEvent){
				that_pdcsda.getController().onPressDeLink(oEvent);
			},
			/**
			 * This method is used to Delink carbon copy child opportunity.
			 * 
			 * @name OnDlinkCommLvchng
			 * @param oEvent - Holds the current event
			 * @returns
			 */
			OnDlinkCommLvchng: function(oEvent){
				that_pdcsda.getController().OnDlinkCommLvchng(oEvent);
			},
			//*****************End Of PCR025717 Q2C Q4 2019 Enhancements************************************
			//*************** Start Of PCR034716++ Q2C ESA,PSR Enhancements ****************
			/**
			 * This method Handles PSR-RRA Reset Confirmation Press Event.
			 * @name onPsrRraResetProcess
			 * @param oEvent - Event Handler
			 * @returns
			 */
			onPsrRraResetProcess: function (oEvent) {
				this._initiateControllerObjects(thisCntrlr);
				var sValidate = "ResetChildListSet?$filter=OppId eq '" + that_views2.getController().OppId + "' and ItemNo eq '" + that_views2.getController()
					.ItemNo + "'";
				this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				var ResetData = thisCntrlr.getModelFromCore("ResetChildListModel").getData().results;
				thisCntrlr.ResetType = ResetData.length > 0 ? thisCntrlr.bundle.getText("S2RECRATEDEPTYPTEXT") : thisCntrlr.bundle.getText(
					"S2RECRATEINDEPTYPTEXT");
				var ProcessType = thisCntrlr.bundle.getText("S2PSRSDAICONTABFTEXTASC606");
				ResetData.forEach(function(obj){obj.Selectflag = obj.Selectflag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? true : false;});
				this.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRPDCONRESETConfirmation"), this);
				if (thisCntrlr.ResetType === thisCntrlr.bundle.getText("S2RECRATEDEPTYPTEXT")) {
					this.dialog.getContent()[1].setVisible(true);
					this.dialog.getContent()[1].setModel(this.getJSONModel({
						"ItemSet": ResetData
					}));
				}
				this.getCurrentView().addDependent(this.dialog);
				var psrTitleArr = this.dialog.getCustomHeader().getContentMiddle()[1].getText().trim().split(" ");
				psrTitleArr[5] = thisCntrlr.bundle.getText("S2FOOTER_PSR_RRA_RESET") + thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDMSG2NDPRT");
				this.dialog.getCustomHeader().getContentMiddle()[1].setText(psrTitleArr.join(" "));
				this.dialog.open();
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
				var resetMsg = this.dialog.getContent()[0].getContent()[1].getValue();
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
				var psrData = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBPSRMODEL")).getData();
				var sdaType = oResource.getText("S2ICONTABPSRTEXT");
				var processType = oResource.getText("S2PSRSDAICONTABFTEXTASC606");
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
					payload.Comments = resetMsg;
					payload.PSR_Reset = oResource.getText("S1TABLESALESTAGECOL");
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
					payload.Comments = resetMsg;
					payload.PSR_Reset = oResource.getText("S1TABLESALESTAGECOL");
					if (ResetData !== "") {
						payload.nav_reset_child = [];
						for (var k = 0; k < ResetData.ItemSet.length; k++) {
							var obj = {};
							obj.Guid = ResetData.ItemSet[k].Guid;
							obj.ItemGuid = ResetData.ItemSet[k].ItemGuid;
							obj.ItemNo = ResetData.ItemSet[k].ItemNo;
							obj.OppId = ResetData.ItemSet[k].OppId;
							obj.Ptype = ResetData.ItemSet[k].Ptype;
							obj.Selectflag = (ResetData.ItemSet[k].Selectflag === true || ResetData.ItemSet[k].Selectflag ===
								oResource.getText("S1TABLESALESTAGECOL")) ? oResource.getText("S1TABLESALESTAGECOL") : "";
							payload.nav_reset_child.push(obj);
						}
					}
					SuccessMsg = processType + " " + processSubType + " " + oResource.getText("S2RECRATEPOSMSG");
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ResetChildListSet, com.amat.crm.opportunity.util.ServiceConfigConstants
						.write, payload, SuccessMsg);
				}
				sap.ui.core.BusyIndicator.hide();
				var evt = {
	               getParameters: function(){
	                  return {key:thisCntrlr.bundle.getText("S2ICONTABPSRSDAKEY")};
	               }
	            };
	            that_views2.getContent()[0].getContent()[0].getItems()[0].setSelectedKey(thisCntrlr.bundle.getText("S2ICONTABPSRSDAKEY"));
				that_views2.getController().onSelectedTab(evt);
				that_views2.getController().setIconTabFilterColor();
			}
			//*************** End Of PCR034716++ Q2C ESA,PSR Enhancements ****************
	});
});