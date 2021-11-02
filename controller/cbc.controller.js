/**
 * This class holds all methods of cbc page.
 *
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends opportunity.controller.BaseController
 * @name opportunity.controller.cbc
 *
 *  * -------------------------------------------------------------------------------*
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
 * 18/12/2018      Abhishek        PCR021481         Q2C Q1/Q2 enhancements       *
 *                 Pant                                                           *
 * 25/02/2019      Abhishek        PCR022669         Q2C Q2 UI Changes            *
 *                 Pant                                                           *
 * 26/09/2019      Abhishek        PCR025717         Q2C Q4 2019 Enhancements     *
 *                 Pant                                                           *
 * 15/11/2019      Abhishek        PCR026469         INC05215579: Carbon Copy Opp *
 *                 Pant                              Search Issue                 *
 * 13/01/2019      Abhishek        PCR033317         CBC MEA questionnaire        *
 *                 Pant                              alignment as part of RAR     *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 ************************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController",
	"com/amat/crm/opportunity/controller/CommonController"
], function(Controller, CommonController) {
	"use strict";
//	var thisCntrlr, that_psrsda,                                                                                  //PCR018375--  
	var thisCntrlr, that_psrsda, that_attachment,                                                                 //PCR018375++
		that_views2, oCommonController;
	return Controller.extend("com.amat.crm.opportunity.controller.cbc", {
		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */
		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 * 
		 * @memberOf view.cbc
		 */
		onInit: function() {
			this.bundle = this.getResourceBundle();
			thisCntrlr = this;
			that_views2 = this.getOwnerComponent().s2;
			thisCntrlr.colFlag = [false, false, false, false, false, false,
				false, false, false, false, false, false, false, false
			];
			thisCntrlr.flagAtt = 0;
			thisCntrlr.MandateData = "";
			thisCntrlr.oMessagePopover = "";
			this.detActionType = "";
			this.SelectedRecord = {
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

			if (that_psrsda === undefined) {
				that_psrsda = this.getOwnerComponent().psrsda;
			}
			//*************** Start Of PCR018375++ - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
			if (that_attachment === undefined) {
				that_attachment = this.getOwnerComponent().attachment;
			}
			//*************** End Of PCR018375++ - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
		},
		/**
		 * This method Handles CBC Type Event.
		 * 
		 * @name InitiateCBC
		 * @param CbcType - Current CBC Type
		 * @returns 
		 */
		InitiateCBC: function(CbcType) {
			var OppGenInfoModel = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
			var Msg = "";
			var obj = {};
			obj.Guid = OppGenInfoModel.getData().Guid;
			obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
			if (CbcType === "") {
				obj.CbcType = "";
				obj.CbcStatus = "";
				Msg = this.getResourceBundle().getText("S2CBCCANINITSUCSSTXT");
			} else {
				(CbcType === 1) ? (obj.CbcType = this.getResourceBundle().getText("S2CBCTYPECSKEY"), obj.CbcStatus =
					"500") : ((CbcType === 2) ? (obj.CbcType = this.getResourceBundle().getText("S2CBCTYPECLKEY"), obj.CbcStatus =
					"500") : (obj.CbcType = this.getResourceBundle().getText("S2PSRDCBCNATEXT"), obj.CbcStatus = "560"));
				(obj.CbcStatus === "500") ? (Msg = this.getResourceBundle().getText("S2PCBCINITSTATTXT")) : (Msg =
					this.getResourceBundle().getText("S2PCBCNTAPPLICABLESTATTXT"));
			}
			obj.WiId = "";
			obj.TaskId = "";
			obj.ActionType = "";
//			obj.CbcStatDesc = "";                                                                                                              //PCR019903--
			obj.CbcStatDesc = OppGenInfoModel.getData().ProductLine;                                                                           //PCR019903++ adding ProductLine
			obj.AprvComments = "";
			obj.CbcComm = "";
			obj.Partner = "";
			obj.CcOppId = "";
			obj.CcOpitmId = "";
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CBCInfoSet, com.amat.crm.opportunity
				.util.ServiceConfigConstants.write, obj, Msg);
			this.getRefreshCBCData(thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"))
				.getData().Guid, thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData()
				.ItemGuid);
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
		 * This method Handles CBC Standard Radio Button Event.
		 * 
		 * @name onPressInitiateStdCBC
		 * @param evt - Event Handler
		 * @returns 
		 */
		onPressInitiateStdCBC: function(evt) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var romUserList = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("OppGenInfoModel")).getData()
				.NAV_ROM_INFO.results;
			var oView = thisCntrlr.getView();
			var romInitiateFlag = this.checkContact(romUserList);
			if (romInitiateFlag === false) {
				sap.ui.core.BusyIndicator.hide();
				thisCntrlr.showToastMessage(this.getResourceBundle().getText("S2USERROMAUTHFALTTXT"));
				this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_RADIOBtn).setSelectedIndex(-1);
			} else {
				if (thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBSECURITYMODEL")).getData().InitCbc !==
					this.getResourceBundle().getText("S2ODATAPOSVAL")) {
					thisCntrlr.showToastMessage(this.getResourceBundle().getText("S2PSRSDACBCAUTHCHECKFAILMSG"));
				} else {
					this.InitiateCBC(evt.mParameters.selectedIndex);
					if (evt.mParameters.selectedIndex !== 3) {
						this.onEditCBC();
						//*************** Start Of PCR018375++ - 3509 - PSR/PDC/CBC Main Comment Section in NA ****************//
						oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_PANEL).setVisible(true);
				        oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_PANEL).setVisible(true);
				        oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_PANEL).setVisible(true);
				        oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MEA_DOC_PANEL).setVisible(true);
				        oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_APR_PANEL).setVisible(true);
				        that_views2 === undefined ? that_views2 = this.getOwnerComponent().s2 : "";
				        that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_CBCRESET).setVisible(true);
				        //*************** End Of PCR018375++ - 3509 - PSR/PDC/CBC Main Comment Section in NA ****************//
					} else {
						this.setCBCVisibility();
					}
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setEnabled(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setText(this.getResourceBundle()
						.getText("S2PSRSDASFCANINITXT"));
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setIcon(this.getResourceBundle()
						.getText("S2CANCELBTNICON"));
				}
			}
			myBusyDialog.close()
		},
		/**
		 * This method Used to Convert Data to Tree Model Data.
		 * 
		 * @name getQuesierData
		 * @param SEditable- Sales Editable Value, BEditable- BMO Editable Value
		 * @returns 
		 */
		getQuesierData: function(SEditable, BEditable) {
			var CBCQusData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData().NAV_CBC_HEAD
				.results;
			var HeaderCount = 0,
				ItemCount = 0;
			var oData = {
				"root": {}
			};
			oData.root.Node_Type = this.getResourceBundle().getText("S2CBCQUSTABROOTTXT");
			oData.root.Status = this.getResourceBundle().getText("S2CBCQUSTABROOTDISTXT");
			oData.root.checked = "false";
			oData.root.visible = false;
			oData.root.SalEditable = false;
			oData.root.BMOEditable = false;
			for (var i = 0, n = 0; i < CBCQusData.length; i++) {
				var itemData = [];
				var obj = {};
				var nil = {};
				HeaderCount = HeaderCount + 1;
				nil.Node_Type = CBCQusData[i].SectionTyp + ": " + CBCQusData[i].SelDesc;
				nil.Status = "";
				nil.SalVisible = false;
				nil.BmoVisible = false;
				nil.ComVisible = false;
				nil.SalEditable = false;
				nil.BmoEditable = false;
				nil.QuesClass = this.getResourceBundle().getText("S2PSRSDAQUESTITLECLS");
				for (var j = 0; j < CBCQusData[i].NAV_CBC_QAINFO.results.length; j++) {
					ItemCount = ItemCount + 1;
					nil[j] = {};
					nil[j].Node_Type = CBCQusData[i].NAV_CBC_QAINFO.results[j].Qdesc;
					nil[j].Status = "";
					(CBCQusData[i].NAV_CBC_QAINFO.results[j].AnsFlag === this.getResourceBundle().getText(
						"S2CBCSALESUCSSANS")) ? (nil[j].SalVisible = true, nil[j].QuesClass = this.getResourceBundle().getText(
						"S2PSRSDAQUESITEMCLS")) : (nil[j].SalVisible = false, nil[j].QuesClass = this.getResourceBundle()
						.getText("S2PSRSDAQUESTITLECLS"));
					(CBCQusData[i].NAV_CBC_QAINFO.results[j].AnsFlag === this.getResourceBundle().getText(
						"S2CBCBMOUCSSANS")) ? (nil[j].BmoVisible = true, nil[j].QuesClass = this.getResourceBundle().getText(
						"S2PSRSDAQUESITEMCLS")) : (nil[j].BmoVisible = false, nil[j].QuesClass = this.getResourceBundle()
						.getText("S2PSRSDAQUESTITLECLS"));
					nil[j].ComVisible = true;
					(CBCQusData[i].NAV_CBC_QAINFO.results[j].AnsValue === this.getResourceBundle().getText(
						"S2POSMANDATANS")) ? (nil[j].SelectionIndex = 1, nil[j].ValueState = this.getResourceBundle().getText(
						"S2DELNAGVIZTEXT")) : ((CBCQusData[i].NAV_CBC_QAINFO.results[j].AnsValue === this.getResourceBundle()
						.getText("S2NEGMANDATANS")) ? (nil[j].SelectionIndex = 2, nil[j].ValueState = this.getResourceBundle()
						.getText("S2DELNAGVIZTEXT")) : (nil[j].SelectionIndex = 0, nil[j].ValueState = this.getResourceBundle()
						.getText("S2ERRORVALSATETEXT")));
					nil[j].ComValue = CBCQusData[i].NAV_CBC_QAINFO.results[j].Comments;
					nil[j].SalEditable = SEditable;
					nil[j].BmoEditable = BEditable;
					if(i === 7 && (j > 4 && j < 9)){                                                                                                                                                      //PCR033317++;Condition Updated
                        nil[j].OkText = this.getResourceBundle().getText("S2PSRSDAYES");
                        nil[j].NAText = this.getResourceBundle().getText("S2PSRSDANO");
					} else {
						nil[j].OkText = this.getResourceBundle().getText("S2CONFFRGOKBTN");
                        nil[j].NAText = this.getResourceBundle().getText("S2CBCNA");
					}
					(SEditable === true || BEditable === true) ? ((SEditable === true && CBCQusData[i].NAV_CBC_QAINFO.results[j].AnsFlag ===
						this.getResourceBundle().getText("S2CBCSALESUCSSANS")) ? ((parseInt(thisCntrlr.getModelFromCore(this.getResourceBundle().getText(
							"GLBCBCMODEL")).getData().CbcStatus) <=
						510)) ? (nil[j].ComEnabled = true) : (nil[j].ComEnabled = false) : ((BEditable === true && CBCQusData[i].NAV_CBC_QAINFO.results[
							j].AnsFlag ===
						this.getResourceBundle().getText("S2CBCBMOUCSSANS")) ? ((parseInt(thisCntrlr.getModelFromCore(this.getResourceBundle().getText(
							"GLBCBCMODEL")).getData().CbcStatus) ===
						505) ? (nil[j].ComEnabled = true) : (nil[j].ComEnabled = false)) : (nil[j].ComEnabled = false))) : (nil[j].ComEnabled = false);
					(SEditable === true || BEditable === true) ? (nil[j].Enabled = true) : (nil[j].Enabled = false);
					((i === 7 && j === 9) && CBCQusData[i].NAV_CBC_QAINFO.results[j].AnsFlag === "T")?((nil[j].ComValue !== ""  && SEditable === true ) ?                                                //PCR033317++;Condition Updated
							(nil[j].ComEnabled = true, nil[j].ComValueState = this.getResourceBundle().getText("S2DELNAGVIZTEXT"))                                                                       //PCR033317++;shifted down
							:((nil[j].ComValue === ""  && SEditable === true)?(nil[j].ComEnabled = true, nil[j].ComValueState = this.getResourceBundle().getText("S2ERRORVALSATETEXT")):
								((nil[j].ComValue === ""  && SEditable === false)?(nil[j].ComEnabled = false, nil[j].ComValueState = this.getResourceBundle().getText("S2ERRORVALSATETEXT")):
									(nil[j].ComEnabled = false, nil[j].ComValueState = this.getResourceBundle().getText("S2DELNAGVIZTEXT"))))):("");
					nil[j].QuesClass = this.getResourceBundle()	.getText("S2PSRSDAQUESITEMCLS");
				}
				oData.root[i] = nil;
			}
			oData.root.headerCount = HeaderCount;
			oData.root.itemCount = ItemCount;
			var oTable = this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_TABLE);
			oTable.setVisibleRowCount(HeaderCount + ItemCount);
			var oModel = this.getJSONModel(oData);
			oTable.setModel(oModel);
			oTable.bindRows(this.getResourceBundle().getText("S2CBCQUSTABROOTPATH"));
			oTable.expandToLevel(1);
		},
		/**
		 * This method Handles CBC Collapse All Button Event.
		 * 
		 * @name onQuesCollapseAll
		 * @param 
		 * @returns 
		 */
		onQuesCollapseAll: function() {
			var oTable = this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_TABLE);
			oTable.setVisibleRowCount(oTable.getModel().getData().root.headerCount);
			oTable.collapseAll();
		},
		/**
		 * This method Handles CBC Expend All Button Event.
		 * 
		 * @name onQuesExpandAll
		 * @param 
		 * @returns 
		 */
		onQuesExpandAll: function() {
			var oTable = this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_TABLE);
			oTable.setVisibleRowCount(oTable.getModel().getData().root.itemCount);
			oTable.expandToLevel(1);
		},
		/**
		 * This method Used to Validate CBC Process User Permissions.
		 * 
		 * @name checkCBCUsersfromlist
		 * @param 
		 * @returns checkFlag - Binary Flag
		 */
		checkCBCUsersfromlist: function() {
			var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
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
		 * This method Handles Edit Button Event.
		 * 
		 * @name onEditCBC
		 * @param 
		 * @returns 
		 */
		onEditCBC: function() {
			var ValidCon = this.checkCBCUsersfromlist();
			var oResource = this.getResourceBundle();
			var CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
			var romUserList = CBCData.NAV_CBCROM.results;
			var romInitiateFlag = this.checkContact(romUserList);
			if (ValidCon === false && romInitiateFlag === false) {
				thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
			} else {
				this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setVisible(false);
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).getText() === oResource
					.getText("S2PSRSDAEDITBTNTXT")) {
					var ContactLstArr = [com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_ROM_LIST,
							com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POM_LIST,
							com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_LIST,
							com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_BOM_LIST
						],
						DelBtnVble = oResource.getText("S2DELNAGVIZTEXT"),
						AddBtnVble = false;
					var ContactAddArr = [com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_ROMAddBtn,
						com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POMAddBtn,
						com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_AddBtn,
						com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_BOM_AddBtn
					];
					var SecurityData = thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();
					(SecurityData.AddContact === oResource.getText("S2ODATAPOSVAL")) ? (AddBtnVble =
						true) : (AddBtnVble = false);
					(SecurityData.DelContact === oResource.getText("S2ODATAPOSVAL")) ? (DelBtnVble = oResource.getText("S2DELPOSVIZTEXT")) :
					(DelBtnVble = oResource.getText("S2DELNAGVIZTEXT"));
					for (var i = 0; i < ContactLstArr.length; i++) {
						this.getView().byId(ContactLstArr[i]).setMode(DelBtnVble);
						this.getView().byId(ContactAddArr[i]).setEnabled(AddBtnVble);
					}
					this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(oResource
						.getText("S2PSRSDACANBTNTXT"));
					this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setIcon(oResource
						.getText("S2CANCELBTNICON"));
					this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SAVEBtn).setEnabled(true);
					that_views2.getController().setGenInfoVisibility();
					if (parseInt(CBCData.CbcStatus) === 500 || parseInt(CBCData.CbcStatus) === 510) {
						this.getQuesierData(true, false);
						if (parseInt(CBCData.CbcStatus) === 500) {
							this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_IP_CC).setEnabled(true);
						}
					} else if (parseInt(CBCData.CbcStatus) === 505) {
						var romUserList = CBCData.NAV_CBCROM.results;
						var romInitiateFlag = this.checkContact(romUserList);
						var bomUserList = CBCData.NAV_CBCBMO.results;
						var bomInitiateFlag = this.checkContact(bomUserList);
						this.getQuesierData(romInitiateFlag, bomInitiateFlag);
						this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_IP_CC).setEnabled(false);
					} else if (parseInt(CBCData.CbcStatus) === 520) {
						this.getQuesierData(false, false);
						this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_IP_CC).setEnabled(false);
						this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setVisible(true);
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(true);
						parseInt(CBCData.TaskId) !== 0 ? that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setEnabled(true) : that_views2
							.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setEnabled(false);
						var AuthSalUserList = CBCData.NAV_CBCASA.results;
						var AuthSalInitiateFlag = this.checkContact(AuthSalUserList);
						(AuthSalInitiateFlag === true) ? (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setEnabled(true)) : (
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setEnabled(false));
					}
				} else {
					var ContactLstArr = [com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_ROM_LIST,
						com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POM_LIST,
						com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_LIST,
						com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_BOM_LIST
					];
					for (var i = 0; i < ContactLstArr.length; i++) {
						this.getView().byId(ContactLstArr[i]).setMode(oResource.getText("S2DELNAGVIZTEXT"));
					}
					this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_BOM_AddBtn).setEnabled(
						false);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_AddBtn).setEnabled(
						false);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POMAddBtn).setEnabled(false);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_ROMAddBtn).setEnabled(false);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(oResource
						.getText("S2PSRSDAEDITBTNTXT"));
					this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setIcon(oResource
						.getText("S2PSRSDAEDITICON"));
					this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SAVEBtn).setEnabled(false);
					this.getQuesierData(false, false);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_IP_CC).setEnabled(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setEnabled(false);
				}
			}
			thisCntrlr.onExpMEADoc();                                                                                  //PCR018375++
		},
		//***************Start Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
		/**
		 * This Method is use on CBC Cancel Initiation dialog box Ok Button press event.
		 *  
		 * @name confirmationCBCCanInit
		 * @param Event - Holds the current event
		 * @returns 
		 */
		confirmationCBCCanInit: function(oEvent) {
			if(oEvent === thisCntrlr.getResourceBundle().getText("S2CONFFRGOKBTN")){
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oResource = thisCntrlr.getResourceBundle();
				thisCntrlr.InitiateCBC("");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setText(oResource
					.getText("S2PCBCNOTBMOTXT"));
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setIcon(oResource
					.getText("S2PSRSDAWFICON"));
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setVisible(false);
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Default);
				myBusyDialog.close();
			}			
		},
		//***************End Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
		/**
		 * This method Handles Submit Button Event.
		 * 
		 * @name onSubmitCBC
		 * @param 
		 * @returns 
		 */
		onSubmitCBC: function() {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oResource = this.getResourceBundle();
			var CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
			if (this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).getText() === oResource
				.getText("S2PSRSDASFCANINITXT") || this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn)
				.getText() === oResource.getText("S2PSRSDASFBTNCANNATXT")) {
				var romUserList = CBCData.NAV_CBCROM.results;
				var romInitiateFlag = this.checkContact(romUserList);
				if (romInitiateFlag === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2USERROMAUTHFALTTXT"));
				} else {
					//***************Start Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
					var Mesg = thisCntrlr.bundle.getText("S2CANINITMSG1") + thisCntrlr.bundle.getText("S2CBCCANINITMSG2");
					sap.m.MessageBox.confirm(Mesg, this.confirmationCBCCanInit, thisCntrlr.bundle.getText("S2PSRSDACBCCONDIALOGTYPTXT"));	
					//this.InitiateCBC("");
					//this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setText(oResource
					//	.getText("S2PCBCNOTBMOTXT"));
					//this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setIcon(oResource
					//	.getText("S2PSRSDAWFICON"));
					//this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setVisible(false);
					//that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Default);
					//***************End Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
				}
				myBusyDialog.close();
			} else if (this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).getText() === oResource
				.getText("S2PCBCNOTBMOTXT")) {
				var romUserList = CBCData.NAV_CBCROM.results;
				var bomUserList = CBCData.NAV_CBCBMO.results;
				var romInitiateFlag = this.checkContact(romUserList);
				if (romInitiateFlag === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2USERROMAUTHFALTTXT"));
				} else {
					var ErrorFlag = this.ValidateCBCData();
					if (ErrorFlag[1] === false) {
						//***************Justification: PCR018375++ - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
//						thisCntrlr.showToastMessage(oResource.getText("S2CBCNAQUSANSERRORTXT"));                                                              //PCR018375--
						(CBCData.CbcType === "CS")?((ErrorFlag[2] === oResource.getText("S2POSMANDATANS"))?(thisCntrlr.showToastMessage(                      //PCR018375++
							oResource.getText("S2CBCCLNAQUSANSERRORTXT"))):(thisCntrlr.showToastMessage(oResource.getText("S2CBCCLMANDATCOMMERRORMSG")))):    //PCR018375++
							   (thisCntrlr.showToastMessage(oResource.getText("S2CBCCLNAQUSANSERRORTXT")));                                                   //PCR018375++
					} else {
						var validateCBCTask = this.validateCBCWF();
						if (validateCBCTask[0] === false && validateCBCTask[1] === oResource.getText(
								"S2CBCCONTACTLENTH0MSG")) {
							thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCCONCT0FAILMSG"));
						} else {
							this.detActionType = "";
							this.onCBCPayload(oResource.getText("S2PSRSDACBCSFASUBMITSUCSSMSG"), oResource
								.getText("S2CBCSALESUCSSANS"));
						}
					}
					that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Critical);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setEnabled(true);
					this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setVisible(false);
				}
				myBusyDialog.close();
			}
		},
		/**
		 * This method Handles On Delete Contact Event.
		 * 
		 * @name onDelete
		 * @param evt - Event Handler
		 * @returns 
		 */
		onDelete: function(evt) {
			var oResource = this.getResourceBundle();
			oCommonController.commonDelete(evt, thisCntrlr);
			var CBCdata = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
			parseInt(CBCdata.TaskId) !== 0 ? that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(true) : that_views2.byId(
				com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(false);
		},
		/**
		 * This method Handles Add Contact Button Event.
		 * 
		 * @name onPressAddContact
		 * @param evt - Event Handler
		 * @returns 
		 */
		onPressAddContact: function(evt) {
			var oResource = this.getResourceBundle();
			oCommonController.commonPressAddContact(evt, thisCntrlr);
			var CBCdata = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
			parseInt(CBCdata.TaskId) !== 0 ? that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(true) : that_views2.byId(
				com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(false);
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
			var oResource = this.getResourceBundle();
			var searchText, contactData;
			var contactType = oEvent.getSource().getParent().getParent().getParent().getController().contactType;
			if (oEventParameters.hasOwnProperty(oResource.getText("S2TYPECONTCTPROPTXT"))) {
				searchText = oEventParameters.newValue;
				if (searchText.length < 3) return;
			} else searchText = oEventParameters.query;
			this.contactF4Fragment.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
				"ItemSet": []
			});
			var sContact = "Search_contactSet?$filter=NameFirst eq '" + searchText + "'and NameLast eq '" + contactType + "'";
			if (searchText.length != 0) {
				this.serviceCall(sContact, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				contactData = thisCntrlr.getModelFromCore(oResource.getText("GLBCONTACTMODEL")).getData().results;
				this.contactF4Fragment.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
					"ItemSet": contactData
				});
			} else {
				this.contactF4Fragment.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
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
		 * This method Used to Setting CBC View Visibility.
		 * 
		 * @name setCBCVisibility
		 * @param 
		 * @returns 
		 */
		setCBCVisibility: function() {
			if (that_views2 === undefined) {
				that_views2 = this.getOwnerComponent().s2;
			}
			var oResource = this.getResourceBundle();
			var oView = this.getView();
			var CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
			var OppGenInfoModel = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));                                      //PCR021481++
			var CbcType = "";
			var ContactLstArr = [com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_ROM_LIST,
				com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POM_LIST,
				com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_LIST,
				com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_BOM_LIST
			];
			for (var i = 0; i < ContactLstArr.length; i++) {
				oView.byId(ContactLstArr[i]).setMode(oResource.getText("S2DELNAGVIZTEXT"));
			}
			(CBCData.CbcRequired === "") ? (oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_BOX).setVisible(true)) : (oView.byId(
				com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_BOX).setVisible(false));
			(parseInt(CBCData.CbcStatus) === 520) ? (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setText(oResource.getText(
				"S2FOOTER_APR"))) : (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setText(oResource.getText(
				"S2PSRSDACBCSFASUBTYPEMSG")));
			oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_BOM_AddBtn).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_AddBtn).setEnabled(
				false);
			oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POMAddBtn).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_ROMAddBtn).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_BT_CC_BOX).setVisible(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_IP_CC).setEnabled(false);
			oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(oResource.getText("S2PSRSDAEDITBTNTXT"));
			oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setIcon(oResource.getText("S2PSRSDAEDITICON"));
			oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR)._getInternalHeader().getContentRight()[0].getContentLeft()[0]
				.setText(oResource.getText("S2CBCTYPECSTEXTHDR"));
			(CBCData.NAV_CBC_CC.results.length > 0) ? (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_PANEL).setExpanded(
				true)) : (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_PANEL).setExpanded(false));
//			*** Justification: PCR018375++ - 3509 - PSR/CBC Workflow Rejection (restart) Capability ******
			this.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_TABLEHDR).setText(CBCData.CbcVersion);                                               //PCR018375++
			if (parseInt(CBCData.CbcStatus) === 500) {
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_TEXT).setText(oResource
					.getText("S2PSRBARSTATUSHEADER") + " " + thisCntrlr.getModelFromCore(oResource.getText(
						"GLBCBCMODEL")).getData().CbcStatDesc);
//				(CBCData.CbcType === oResource.getText("S2CBCTYPECSKEY")) ? (CbcType = oResource.getText("S2CBCTYPECSTEXT")),                        //PCR018375--
				(CBCData.CbcType === oResource.getText("S2CBCTYPECSKEY")) ? (CbcType = oResource.getText("S2CBCTYPECSTEXT")) :                       // removed , and added :
//					this.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_TABLEHDR).setText(oResource.getText("S2CBCTOOLBARSTDTITLE"))) :              //PCR018375--
//					((CBCData.CbcType === oResource.getText("S2CBCTYPECLKEY")) ? (CbcType = oResource.getText("S2CBCTYPECLTEXT")),                   //PCR018375--
				((CBCData.CbcType === oResource.getText("S2CBCTYPECLKEY")) ? (CbcType = oResource.getText("S2CBCTYPECLTEXT")) :                      //removed , and added :
//						this.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_TABLEHDR).setText(oResource.getText("S2CBCTOOLBARLITTITLE"))) :          //PCR018375--
					(CbcType = ""));
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR)._getInternalHeader().getContentRight()[0].getContentLeft()[0].setText(
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR)
					._getInternalHeader().getContentRight()[0].getContentLeft()[0].getText() + "- " + CbcType);
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Critical);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_GENERAL_DATA_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_CONTENT).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SAVEBtn).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SAVEBtn).setEnabled(false);
				var romInitiateFlag = thisCntrlr.checkContact(CBCData.NAV_CBCROM.results);
				(romInitiateFlag === true) ? (oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setEnabled(
					true)) : (oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setEnabled(false));
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setEnabled(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setText(oResource.getText("S2PSRSDASFCANINITXT"));
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setIcon(oResource.getText("S2CANCELBTNICON"));
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Critical);
				if (CBCData.CcOpitmId !== "" && CBCData.CcOppId !== "") {
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SAVEBtn).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setVisible(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(false);
				}
			}
			if (parseInt(CBCData.CbcStatus) >= 505 && parseInt(CBCData.CbcStatus) < 530) {
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_TEXT).setText(oResource
					.getText("S2PSRBARSTATUSHEADER") + " " + thisCntrlr.getModelFromCore(oResource.getText(
						"GLBCBCMODEL")).getData().CbcStatDesc);
				(CBCData.CbcType === oResource.getText("S2CBCTYPECSKEY")) ? (CbcType = oResource.getText("S2CBCTYPECSTEXT")) :
				((thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData().CbcType === oResource.getText("S2CBCTYPECLKEY")) ?
					(CbcType = oResource.getText("S2CBCTYPECLTEXT")) : (CbcType = ""));
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR)._getInternalHeader().getContentRight()[0].getContentLeft()[0].setText(
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR)
					._getInternalHeader().getContentRight()[0].getContentLeft()[0].getText() + "- " + CbcType);
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Critical);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_GENERAL_DATA_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_CONTENT).setVisible(true);
				if (parseInt(CBCData.CbcStatus) === 520) {
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SAVEBtn).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setVisible(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(true);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setEnabled(false);
				} else {
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setEnabled(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SAVEBtn).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SAVEBtn).setEnabled(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setEnabled(false);
				}
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Critical);
			} else if (parseInt(CBCData.CbcStatus) === 530 || parseInt(CBCData.CbcStatus) === 540) {
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_TEXT).setText(oResource.getText("S2PSRBARSTATUSHEADER") +
					" " + CBCData.CbcStatDesc);
				(CBCData.CbcType === oResource.getText("S2CBCTYPECSKEY")) ? (CbcType = oResource.getText("S2CBCTYPECSTEXT")) :
				((thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData().CbcType === oResource.getText("S2CBCTYPECLKEY")) ?
					(CbcType = oResource.getText("S2CBCTYPECLTEXT")) : (CbcType = ""));
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR)._getInternalHeader().getContentRight()[0].getContentLeft()[0].setText(
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR)
					._getInternalHeader().getContentRight()[0].getContentLeft()[0].getText() + "- " + CbcType);
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Critical);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_GENERAL_DATA_PANEL).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_CONTENT).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SAVEBtn).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setVisible(false);
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(false);
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Positive);
			} else if (parseInt(CBCData.CbcStatus) === 560) {
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_BOX).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_TEXT).setText(oResource
					.getText("S2PSRBARSTATUSHEADER") + " " + CBCData.CbcStatDesc);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR)._getInternalHeader().getContentRight()[0]
					.getContentLeft()[0].setText(oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR)
						._getInternalHeader().getContentRight()[0].getContentLeft()[0].getText() + "- " + CbcType);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_GENERAL_DATA_PANEL).setVisible(false);
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).addStyleClass(oResource.getText(
					"S2PSRSDANTREQCLS"));
				that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Positive);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SAVEBtn).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setEnabled(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setText(oResource
					.getText("S2PSRSDASFCANINITXT"));
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setIcon(oResource
					.getText("S2CANCELBTNICON"));
//			} else if (CBCData.CbcStatus === "") {                                                                         //PCR018375--    
			} else if (CBCData.CbcStatus === "" || CBCData.CbcStatus === "501") {                                          //PCR018375++ condition modified
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_BOX).setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_STATUS_BAR).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_GENERAL_DATA_PANEL).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_CONTENT).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_RADIOBtn).setSelectedIndex(-1);
				var SecurityData = thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();
				var InitCBC = false;
				(SecurityData.InitCbc === oResource.getText("S2ODATAPOSVAL")) ? (InitCBC = true) : (
					InitCBC = false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_RADIOBtn).setEnabled(InitCBC);
			}
			//*************** Start Of PCR018375++  - 3509 - PSR/PDC/CBC Main Comment Section in NA ****************//	
			(CBCData.CbcStatus !== "" && CBCData.CbcStatus !== "501")?((parseInt(CBCData.CbcStatus) === 560 && parseInt(CBCData.CbcStatus) !== "")?(oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_CONTENT).setVisible(true),
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_GENERAL_DATA_PANEL).setVisible(false),oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_PANEL).setVisible(false),
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_PANEL).setVisible(false),oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_PANEL).setVisible(false),
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_APR_PANEL).setVisible(false),oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_PANEL).setVisible(true),
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_PANEL).setExpanded(true),oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MEA_DOC_PANEL).setVisible(false)):(
							oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_DECISION_CONTENT).setVisible(true),oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_GENERAL_DATA_PANEL).setVisible(true),
							oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_PANEL).setVisible(true),oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_PANEL).setVisible(true),
							oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_PANEL).setVisible(true),oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_APR_PANEL).setVisible(true),
							oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_PANEL).setVisible(true),oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_PANEL).setExpanded(false),
							oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MEA_DOC_PANEL).setVisible(true))):("");
			//*************** End Of PCR018375++ - 3509 - PSR/PDC/CBC Main Comment Section in NA ****************//
		},
		/**
		 * This method Handles CBC Data Refresh.
		 * 
		 * @name getRefreshCBCData
		 * @param Guid - Opportunity Guid, ItemGuid - Opportunity Item Guid
		 * @returns 
		 */
		getRefreshCBCData: function(Guid, ItemGuid) {
			var OppGenInfoModel = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
			var Guid = OppGenInfoModel.getData().Guid;
			var ItemGuid = OppGenInfoModel.getData().ItemGuid;
			var sValidate = "CBC_InfoSet(Guid=guid'" + Guid + "',ItemGuid=guid'" + ItemGuid +
				"')?$expand=NAV_CBC_APRV_HIST,NAV_CBC_CC,NAV_CBC_CHNG_HIST,NAV_CBC_HEAD/NAV_CBC_QAINFO,NAV_CBC_DOCS,NAV_CBCASA,NAV_CBCBMO,NAV_CBCPOM,NAV_CBCROM";     //PCR018375++ added 'NAV_CBC_DOCS'; PCR022669++ added 'NAV_CBC_CHNG_HIST' navigation in query 
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var CBCdata = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
		    this.CBCCCData = CBCdata.NAV_CBC_CC;
			var OppPSRInfoModel = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPPSRINFOMODEL"));
			(CBCdata.CcOppId !== "" && CBCdata.CcOpitmId !== "") ? (this.getView().byId(com.amat.crm.opportunity.Ids
				.S2CBC_PANL_LB_CC_TEXT).setText(this.getResourceBundle().getText("S2PSRSDACCFRMTXT") + " " +
				CBCdata.CcOppId + "_" + CBCdata.CcOpitmId)) : (this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_LB_CC_TEXT)
				.setText(""));
			//*************** Start Of PCR018375++ - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
			that_views2 === undefined ? that_views2 = this.getOwnerComponent().s2 : "";
			var romUserList = CBCdata.NAV_CBCROM.results;
			var romInitiateFlag = this.checkContact(romUserList);
			romInitiateFlag === true && (parseInt(CBCdata.CbcStatus) >= 500 && parseInt(CBCdata.CbcStatus) !== 501 && parseInt(CBCdata.CbcStatus) !== 560) && (CBCdata.CcOppId === "" && CBCdata.CcOpitmId === "")? 
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_CBCRESET).setVisible(true) : that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_CBCRESET).setVisible(false);
			(CBCdata.ResetFlag === "X")?(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_RESET_LIST_PANEL).setVisible(true), thisCntrlr.getView().byId(com.amat.crm.opportunity
					.Ids.S2CBC_PANL_RESET_LIST_PANEL).setExpanded(false)):(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_RESET_LIST_PANEL).setVisible(false));
			//*************** Start Of PCR018375++ - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
			this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SIMPLE_FORM_582).setModel(OppPSRInfoModel);
			this.setCBCVisibility();
			this.getQuesierData(false, false);
			var oCBCAprTableItems = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_APPROVERS);
			var cModel2 = this.getJSONModel(CBCdata.NAV_CBC_APRV_HIST);
			oCBCAprTableItems.setModel(cModel2);
			var oCBCCCpyTableItems = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_TABLE);
			var cModel3 = this.getJSONModel(CBCdata.NAV_CBC_CC);
			oCBCCCpyTableItems.setModel(cModel3);
			//************************Start Of PCR022669: Q2C Q2 UI Changes**************
			if(CBCdata.ChngHistFlag === this.getResourceBundle().getText("S1TABLESALESTAGECOL")){
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CNGHISPNL).setVisible(true);
				var oCBCCngHisTableItems = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CNGHISTAB);
				var cModel4 = this.getJSONModel(CBCdata.NAV_CBC_CHNG_HIST);
				oCBCCngHisTableItems.setModel(cModel4);
			}else {
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CNGHISPNL).setVisible(false);
			}			
			//************************End Of PCR022669: Q2C Q2 UI Changes**************
			this.fnContactInfo(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_ROM_LIST, com.amat.crm.opportunity
				.Ids.S2CBC_PANL_CONTACTINFO_ROM_LIST_TEMPLATE, CBCdata.NAV_CBCROM);
			this.fnContactInfo(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POM_LIST, com.amat.crm.opportunity
				.Ids.S2CBC_PANL_CONTACTINFO_POM_LIST_TEMPLATE, CBCdata.NAV_CBCPOM);
			this.fnContactInfo(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_LIST, com.amat.crm.opportunity
				.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_LIST_TEMPLATE, CBCdata.NAV_CBCASA);
			this.fnContactInfo(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_BOMLST, com.amat.crm.opportunity
				.Ids.S2CBC_PANL_CONTACTINFO_BOM_LIST_TEMPLATE, CBCdata.NAV_CBCBMO);
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
		 * This method Used to refresh GenInfo Model.
		 * 
		 * @name refreshModel
		 * @param 
		 * @returns 
		 */
		refreshModel: function() {
			var sValidatePath = "GenralInfoSet(Guid=guid'" + thisCntrlr.getModelFromCore(this.getResourceBundle().getText(
					"GLBOPPGENINFOMODEL")).getData().Guid + "',ItemGuid=guid'" + thisCntrlr.getModelFromCore(this.getResourceBundle()
					.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid +
				"')?$expand=NAV_ASM_INFO,NAV_BMHEAD_INFO,NAV_BMO_INFO,NAV_BSM_INFO,NAV_CON_INFO,NAV_GPM_INFO,NAV_GSM_INFO,NAV_KPU_INFO,NAV_PM_INFO,NAV_POM_INFO,NAV_RBM_INFO,NAV_ROM_INFO,NAV_SALES_INFO,NAV_TPS_INFO,NAV_TRANS_HISTORY";
			this.getView().getController().serviceCall(sValidatePath, com.amat.crm.opportunity.util.ServiceConfigConstants
				.read, "", "");
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
		 * This method is used to handles CBC Carbon Copy F4 Help.
		 * 
		 * @name handleValueHelpCBCCbnCpyRew
		 * @param
		 * @returns
		 */
		handleValueHelpCBCCbnCpyRew: function() {
			var ItemGuid = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
			this.CbnType = this.getResourceBundle().getText("S2ICONTABCBCTXT");
			var sGenaralChoos = "CustDoclinkSet?$filter=ItemGuid eq guid'" + ItemGuid + "'" + "and OppId eq 'CBC'";
			this.serviceCall(sGenaralChoos, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var CCTableData = this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_TABLE).getModel().getData().results;
			var CBCCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBCBCCCPYMODEL")).getData();
			for (var i = 0; i < CBCCData.results.length; i++) {
				for (var j = 0; j < CCTableData.length; j++) {
					if (CBCCData.results[i].OppId === CCTableData[j].OppId && CBCCData.results[i].ItemNo ===
						CCTableData[j].ItemNo) {
						CBCCData.results[i].Selected = true;
					}
				}
				CBCCData.results[i].Selected === undefined ? CBCCData.results[i].Selected = false : "";
			}
			this.dialog = sap.ui.xmlfragment(this.getResourceBundle().getText("PSRCBCCCF4helpOppLink"), this);
			this.dialog.getContent()[2].getColumns()[0].setVisible(true);                                                                         //PCR025717++; getContent()[0] replaced with getContent()[2]
			this.dialog.getSubHeader().setVisible(true);
			this.getCurrentView().addDependent(this.dialog);
			var oCBCCbnCpyModel = this.getJSONModel(thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBCBCCCPYMODEL")).getData());
			this.dialog.setModel(oCBCCbnCpyModel);
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
				var aFilters = [new sap.ui.model.Filter(this.getResourceBundle().getText("S2OPPAPPOPPIDKEY"), sap.ui.model
					.FilterOperator.Contains, sQuery)];                                                                                                //PCR026469++; added ;
				oFilter = new sap.ui.model.Filter(aFilters, false);
			}
			//var binding = this.dialog.getContent()[2].getBinding("items");                                                                           //PCR026469--
			var binding = oEvent.getSource().getParent().getParent().getContent()[2].getBinding("items");                                              //PCR026469++
			binding.filter(oFilter);
		},
		/**
		 * This method Handles CBC Questions Panel Event.
		 * 
		 * @name OnExpandCBCQus
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		OnExpandCBCQus: function(oEvent) {
			if (oEvent.getParameters().expand === true) {                                                                                               //PCR021481++
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).getText() === this.getResourceBundle()
						.getText("S2PSRSDAEDITBTNTXT")) {
						this.getQuesierData(false, false);
					} else {
						var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
						if (parseInt(CBCData.CbcStatus) === 500 || parseInt(CBCData.CbcStatus) === 510) {
							this.getQuesierData(true, false);
						} else if (parseInt(CBCData.CbcStatus) === 505) {
							var UserAccess = [];
							UserAccess = this.checkCBCCurrentUsers();
							this.getQuesierData(UserAccess[0], UserAccess[1]);
						}
					}
			}		                                                                                                                                    //PCR021481++	
		},
		/**
		 * This method Handles CBC Questions Answer Event.
		 * 
		 * @name onPressCBCQues
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onPressCBCQues: function(oEvent) {
			var AnsValue;
			var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
			var QuestionHead = oEvent.getSource().getBindingContext().sPath.split(this.getResourceBundle().getText(
				"S2CBCPSRCARMSEPRATOR"))[2];
			var QuestionItem = oEvent.getSource().getBindingContext().sPath.split(this.getResourceBundle().getText(
				"S2CBCPSRCARMSEPRATOR"))[3];
			CBCData.NAV_CBC_HEAD.results[QuestionHead].NAV_CBC_QAINFO.results[QuestionItem].AnsValue;
			(oEvent.getParameters().selectedIndex === 1) ? (AnsValue = this.getResourceBundle().getText(
				"S2POSMANDATANS")) : ((oEvent.getParameters().selectedIndex === 2) ? (AnsValue = this.getResourceBundle()
				.getText("S2NEGMANDATANS")) : (AnsValue = ""));
			CBCData.NAV_CBC_HEAD.results[QuestionHead].NAV_CBC_QAINFO.results[QuestionItem].AnsValue = AnsValue;
		},
		/**
		 * This method Handles CBC Questions Comment Text On Live Change Event.
		 * 
		 * @name onCBCTxtAreaLivChg
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onCBCTxtAreaLivChg: function(oEvent) {
			var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
			var QuestionHead = oEvent.getSource().getBindingContext().sPath.split(this.getResourceBundle().getText(
				"S2CBCPSRCARMSEPRATOR"))[2];
			var QuestionItem = oEvent.getSource().getBindingContext().sPath.split(this.getResourceBundle().getText(
				"S2CBCPSRCARMSEPRATOR"))[3];
			CBCData.NAV_CBC_HEAD.results[QuestionHead].NAV_CBC_QAINFO.results[QuestionItem].Comments = oEvent.getParameters().value;
			if((parseInt(QuestionHead) === 7 && parseInt(QuestionItem) === 9)){
				if(oEvent.getParameters().value === ""){
					oEvent.getSource().setValueState(this.getResourceBundle().getText("S2ERRORVALSATETEXT"));
				} else if(oEvent.getParameters().value !== ""){
					oEvent.getSource().setValueState(this.getResourceBundle().getText("S2DELNAGVIZTEXT"));
				}
			}
		},
		/**
		 * This method used To Validate Permission.
		 * 
		 * @name validate
		 * @param CBCStatus - CBC Current Status
		 * @returns validaFlag - Returns Status Wise current user validation
		 */
		validate: function(CBCStatus) {
			var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
			var romUserList = CBCData.NAV_CBCROM.results;
			var romInitiateFlag = this.checkContact(romUserList);
			var bomUserList = CBCData.NAV_CBCBMO.results;
			var bomInitiateFlag = this.checkContact(bomUserList);
			var qusValidate = true,
				quesComment = true,
				validaFlag = [],
				msg = "";
			for (var i = 0, n = 0; i < CBCData.NAV_CBC_HEAD.results.length; i++) {
				for (var j = 0; j < CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results.length; j++) {
					if (CBCStatus === "505" && bomInitiateFlag === true) {
						if (CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsFlag === this.getResourceBundle().getText(
								"S2CBCBMOUCSSANS") && CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsValue === "") {
							qusValidate = false;
							quesComment = true;
							break;
						} else if (CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsFlag === this.getResourceBundle().getText(
								"S2CBCBMOUCSSANS") && CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsValue === this
							.getResourceBundle().getText("S2NEGMANDATANS")) {
							if (CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Comments === "") {
								qusValidate = true;
								quesComment = false;
								break;
							} else {
								qusValidate = true;
								quesComment = true;
								break;
							}
						}
					} else if ((parseInt(CBCData.CbcStatus) !== 510 || CBCStatus === "500" || CBCStatus === "505") && romInitiateFlag === true) {
						if (CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsFlag === this.getResourceBundle().getText(
								"S2CBCSALESUCSSANS") && CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsValue === "") {
							qusValidate = false;
							quesComment = true;
							break;
						} else if (CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsFlag === this.getResourceBundle().getText(
								"S2CBCSALESUCSSANS") && CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsValue === this
							.getResourceBundle().getText("S2NEGMANDATANS")) {
							if (CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Comments === "") {
								qusValidate = true;
								quesComment = false;
								break;
							} else {
								qusValidate = true;
								quesComment = true;
								break;
							}
						}
					}
				}
			}
			(CBCStatus === "500") ? (qusValidate = true) : ("");
			if (qusValidate === false || quesComment === false) {
				(qusValidate === false) ? (msg = this.getResourceBundle().getText("S2CBCMANDATANSERRORMSG")) : ((
					quesComment === false) ? (msg = this.getResourceBundle().getText("S2CBCMANDATCOMMERRORMSG")) : (""));
			}
			return validaFlag = [qusValidate, quesComment, msg];
		},
		/**
		 * This method Handles Save Button Event.
		 * 
		 * @name onSaveCBC
		 * @param oEvt- Event Handlers , Message - Custom Message on Save button press event
		 * @returns 
		 */
//		onSaveCBC: function() {                                                                                                                             //PCR018375--
		onSaveCBC: function(oEvt, Message) {                                                                                                                //PCR018375++ Method parameters modified.
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
			var oResource = this.getResourceBundle();
			var oView = this.getView();
			Message = Message !== "" ? oResource.getText("S2PSRSSDACBCVALIDSAVEMSG") :"";                                                                    //PCR018375++
			if(CBCData.NAV_CBC_HEAD.results[7] !== undefined && ((CBCData.NAV_CBC_HEAD.results[7].NAV_CBC_QAINFO.results[9].Comments === "" || 
					CBCData.NAV_CBC_HEAD.results[7].NAV_CBC_QAINFO.results[9].Comments.trim() === "") && CBCData.NAV_CBC_HEAD.results[7].NAV_CBC_QAINFO.results[9].AnsFlag === "T")){ //PCR033317++; Condition Updated
				thisCntrlr.showToastMessage(this.getResourceBundle().getText("S2CBCSAVECHECKH5DCOMMFAILMSG"));
			}else {
				this.detActionType = "";
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false);
				that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(oResource.getText(
				"S2PSRSDACBCEDITBTNTEXTMSG"));
				this.onEditCBC();
				if (parseInt(CBCData.CbcStatus) === 500) {
//					this.onCBCPayload(oResource.getText("S2PSRSSDACBCVALIDSAVEMSG"), "");                                                                  //PCR018375--                          
					this.onCBCPayload(Message, "");                                                                                                        //PCR018375++
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setEnabled(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setText(oResource
							.getText("S2PCBCNOTBMOTXT"));
					oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setIcon(oResource
							.getText("S2PSRSDAWFICON"));
					myBusyDialog.close();
				} else {
					if (parseInt(CBCData.CbcStatus) >= 505 && parseInt(CBCData.CbcStatus) < 530) {
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(true);
						var validateCBCTask = this.validateCBCWF();
						if (validateCBCTask[0] === false && validateCBCTask[1] === oResource.getText(
						"S2CBCCONTACTLENTH0MSG")) {
							thisCntrlr.showToastMessage(oResource.getText("S2CBCCONTACTLENTH0MSGDIS"));
						} else {
							if (validateCBCTask[0] === true) {
//								this.onCBCPayload(oResource.getText("S2PSRSSDACBCVALIDSAVEMSG"), "");                                                                  //PCR018375--                          
								this.onCBCPayload(Message, "");                                                                                                        //PCR018375++
								that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setEnabled(true);
								that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false);
								that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false);
							} else {
								if (parseInt(CBCData.CbcStatus) === 505) {
									var bomUserList = CBCData.NAV_CBCBMO.results;
									var romUserList = CBCData.NAV_CBCROM.results;
									var CheckRom = this.checkContact(romUserList);
									var CheckBmo = this.checkContact(bomUserList);
									if (CheckBmo === true) {
										var ErrorFlag = this.validQusAnsCheck(parseInt(CBCData.CbcStatus));
										if (ErrorFlag[0] === false || ErrorFlag[1] === false) {
											(ErrorFlag[0] === false) ? (thisCntrlr.showToastMessage(oResource.getText(
//											"S2CBCMANDATANSERRORMSG"))):((ErrorFlag[1] === false) ? (thisCntrlr.showToastMessage(                                         //PCR018375--
//													oResource.getText("S2CBCMANDATCOMMERRORMSG"))) : (""));                                                               //PCR018375--
											"S2CBCMANDATANSERRORMSG"))):((ErrorFlag[1] === false && CBCdata.CbcType === "CS")?((ErrorFlag[2] ===                          //PCR018375++
												oResource.getText("S2POSMANDATANS"))?(thisCntrlr.showToastMessage(oResource.getText("S2CBCCLNAQUSANSERRORTXT"))):         //PCR018375++
													(thisCntrlr.showToastMessage(oResource.getText("S2CBCCLMANDATCOMMERRORMSG")))):((ErrorFlag[1] === false               //PCR018375++												                                  
													 && CBCdata.CbcType === "CL")?(thisCntrlr.showToastMessage(oResource.getText("S2CBCCLNAQUSANSERRORTXT"))):("")));     //PCR018375++											
										} else {
//											this.onCBCPayload(oResource.getText("S2PSRSSDACBCVALIDSAVEMSG"), "");                                                         //PCR018375--                          
											this.onCBCPayload(Message, "");                                                                                               //PCR018375++
										}
									} else if (CheckRom === true) {
//										this.onCBCPayload(oResource.getText("S2PSRSSDACBCVALIDSAVEMSG"), "");                                                             //PCR018375--                          
										this.onCBCPayload(Message, "");                                                                                                   //PCR018375++
									}
								} else if (parseInt(CBCData.CbcStatus) === 510) {
									var ErrorFlag = this.validQusAnsCheck(parseInt(CBCData.CbcStatus));
									if (ErrorFlag[0] === false || ErrorFlag[1] === false) {
										(ErrorFlag[0] === false) ? (thisCntrlr.showToastMessage(oResource.getText(
//										"S2CBCMANDATANSERRORMSG"))) :((ErrorFlag[1] === false) ? (thisCntrlr.showToastMessage(oResource                                   //PCR018375--
//														.getText("S2CBCMANDATCOMMERRORMSG"))) : (""));                                                                    //PCR018375--
										"S2CBCMANDATANSERRORMSG"))) : ((ErrorFlag[1] === false && CBCdata.CbcType === "CS")?((ErrorFlag[2] ===                            //PCR018375++
											oResource.getText("S2POSMANDATANS"))?(thisCntrlr.showToastMessage(oResource.getText("S2CBCCLNAQUSANSERRORTXT"))):             //PCR018375++
												(thisCntrlr.showToastMessage(oResource.getText("S2CBCCLMANDATCOMMERRORMSG")))):((ErrorFlag[1] === false                   //PCR018375++												                                  
												 && CBCdata.CbcType === "CL")?(thisCntrlr.showToastMessage(oResource.getText("S2CBCCLNAQUSANSERRORTXT"))):("")));         //PCR018375++											
									} else {
//										this.onCBCPayload(oResource.getText("S2PSRSSDACBCVALIDSAVEMSG"), "");                                                             //PCR018375--                          
										this.onCBCPayload(Message, "");                                                                                                   //PCR018375++
									}
								}
								that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setEnabled(false);
							}
						}
					}
				}
			}			
			myBusyDialog.close();
		},
		/**
		 * This method Handles Save Button Event.
		 * 
		 * @name onCBCPayload
		 * @param Message- Submit for Approval Button Text, ActionType - Save Or Submit
		 * @returns obj- Paylod Object
		 */
		onCBCPayload: function(Message, ActionType) {
			var OppGenInfoModel = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
			var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
			var obj = {};
			obj.NAV_CBC_CC = [];
			obj.NAV_CBC_QA = [];
			obj.Guid = OppGenInfoModel.getData().Guid;
			obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
			obj.CbcComm = this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_TEXT_AREA).getValue();
			obj.CbcStatDesc = "";
			(ActionType !== "" && parseInt(CBCData.CbcStatus) === 500) ? (obj.CbcStatus = "505") : ((ActionType !== "" && parseInt(CBCData.CbcStatus) >
					500) ?
				(obj.CbcStatus = "510") : (obj.CbcStatus = CBCData.CbcStatus));
			obj.CbcType = CBCData.CbcType;
			if (parseInt(CBCData.CbcStatus) === 500) {
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_TABLE).getModel().getData().results
					.length !== 0) {
					obj.CcOpitmId = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPPSRINFOMODEL")).getData()
						.ItemNo;
					obj.CcOppId = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPPSRINFOMODEL")).getData()
						.OppId;
				}
			} else {
				obj.CcOpitmId = CBCData.CcOpitmId;
				obj.CcOppId = CBCData.CcOppId;
			}
			obj.Partner = CBCData.Partner;
			obj.ActionType = ActionType;
			obj.TaskId = "";
			obj.AprvComments = this.detActionType;
			obj.WiId = "";
			if (this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_TABLE).getModel() !== undefined &&
				parseInt(CBCData.CbcStatus) === 500) {
				var CBCCcTabData = this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_TABLE).getModel().getData()
					.results;
				if (CBCCcTabData.length > 0) {
					for (var i = 0; i < CBCCcTabData.length; i++) {
						var data = {};
						data.Guid = CBCCcTabData[i].Guid;
						data.ItemGuid = CBCCcTabData[i].ItemGuid;
						data.OppId = CBCCcTabData[i].OppId;
						data.ItemNo = CBCCcTabData[i].ItemNo;
						obj.NAV_CBC_CC.push(data)
					}
				}
			}
			for (var i = 0; i < CBCData.NAV_CBC_HEAD.results.length; i++) {
				for (var j = 0; j < CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results.length; j++) {
					var qus = {};
					qus.AnsFlag = CBCData.NAV_CBC_HEAD
						.results[i].NAV_CBC_QAINFO.results[j].AnsFlag;
					qus.AnsValue = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsValue;
					qus.Comments = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Comments;
					qus.Guid = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Guid;
					qus.ItemGuid = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].ItemGuid;
					qus.ItemNo = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].ItemNo;
					qus.OppId = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].OppId;
					qus.Qdesc = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Qdesc;
					qus.Qid = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Qid;
					qus.SectionTyp = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].SectionTyp;
					qus.Version = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Version;
					obj.NAV_CBC_QA.push(qus);
				}
			}
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CBCInfoSet, com.amat.crm.opportunity
				.util.ServiceConfigConstants.write, obj, Message);
			this.getRefreshCBCData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
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
		 * This method Validates CBC Work Flow Permission.
		 * 
		 * @name validateCBCWF
		 * @param 
		 * @returns ValidateFlag - Binary User Validation Flag
		 */
		validateCBCWF: function() {
			var ValidateFlag = [];
			var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
			if (thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData().NAV_CBCBMO.results
				.length === 0 || CBCData.NAV_CBCASA.results.length === 0 || CBCData.NAV_CBCPOM.results.length === 0 ||
				CBCData.NAV_CBCROM.results.length === 0) {
				return ValidateFlag = [false, this.getResourceBundle().getText("S2CBCCONTACTLENTH0MSG")];
			}
			if (parseInt(CBCData.CbcStatus) === 505) {
				var bomUserList = CBCData.NAV_CBCBMO.results;
				var bomInitiateFlag = this.checkContact(bomUserList);
				(bomInitiateFlag === true) ? (ValidateFlag = [true, this.getResourceBundle().getText(
					"S2PSRSDACBCCHECKsUCSSMSGTYP")]) : (ValidateFlag = [false, this.getResourceBundle().getText(
					"S2PSRWFAPPPANLBMOINFOCONTIT")]);
			} else if (parseInt(CBCData.CbcStatus) === 510 || parseInt(CBCData.CbcStatus) === 500) {
				var romUserList = CBCData
					.NAV_CBCROM.results;
				var romInitiateFlag = this.checkContact(romUserList);
				(romInitiateFlag === true) ? (ValidateFlag = [true, this.getResourceBundle().getText(
					"S2PSRSDACBCCHECKsUCSSMSGTYP")]) : (ValidateFlag = [false, this.getResourceBundle().getText(
					"S2GINFOPANLCONINFOROMTIT")]);
			} else if (parseInt(CBCData.CbcStatus) === 520) {
				var AppSaleUserList = CBCData.NAV_CBCASA.results;
				var AppSaleInitiateFlag = this.checkContact(AppSaleUserList);
				(AppSaleInitiateFlag === true) ? (ValidateFlag = [true, this.getResourceBundle().getText(
					"S2PSRSDACBCCHECKsUCSSMSGTYP")]) : (ValidateFlag = [false, this.getResourceBundle().getText(
					"S2CBCWFAPPPANLATHSALEAPPINFOCONTIT")]);
			}
			return ValidateFlag;
		},
		/**
		 * This method Validates CBC Mandatory Fields.
		 * 
		 * @name validQusAnsCheck
		 * @param CbcStatus- CBC Current Status
		 * @returns ErrorFlag - CBC Questionnaire Binary Check Flag   
		 */
		validQusAnsCheck: function(CbcStatus) {
			var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
			var qusValidate = "",
				quesComment = "",
				quesSet = "Y",                                                                                             //PCR018375++
				ErrorFlag = [];
			var CBCQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_TABLE).getModel();
			if (CbcStatus === 500 || CbcStatus === 510) {
				if (CbcStatus === 500) {
					qusValidate = true;
				} else {
					CBCQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_TABLE).getModel().getData()
						.root;
					for (var i = 0, n = 0; i < CBCData.NAV_CBC_HEAD.results.length; i++) {
						for (var j = 0; j < CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results.length; j++) {
							if (CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsFlag === this.getResourceBundle().getText(
									"S2CBCSALESUCSSANS") && CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsValue === "") {
								qusValidate = false;
								break;
							} else {
								qusValidate = true;
							}
						}
						if (qusValidate === false) break;
					}
				}
				for (var i = 0, n = 0; i < CBCData.NAV_CBC_HEAD.results.length; i++) {
					for (var j = 0; j < CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results.length; j++) {
						if(i === 7 && (j > 4 && j <= 9)){                                                                  //PCR033317++;Condition Updated
							if(j === 9){                                                                                   //PCR033317++;Condition Updated
								if(CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Comments === ""){
									if(CBCData.NAV_CBC_HEAD.results[7].NAV_CBC_QAINFO.results[9].AnsFlag === "T"){         //PCR033317++;Condition Updated
									    quesComment = false;                                                               //PCR018375++
									    quesSet = "H";                                                                     //PCR018375++
									    break;
									} else {
										quesComment = true;	
									}
								}else {
									quesComment = true;
								}
							} else {
								quesComment = true;
							}														
						} else {
							if (CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsFlag === this.getResourceBundle().getText(
							"S2CBCSALESUCSSANS") && CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsValue === this
							.getResourceBundle().getText("S2NEGMANDATANS")) {
								if (CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Comments === "") {
									quesComment = false;
									quesSet = "Y";                                                                        //PCR018375++
									break;
								} else {
									quesComment = true;
								}
							}
						}
					 }
					 if (quesComment === false) break;
				}
			} else if (CbcStatus === 505) {
				var CurrUser = this.checkCBCCurrentUsers();
				var AnsFlag = "",
					AnsValue = this.getResourceBundle().getText("S2NEGMANDATANS");
				(CurrUser[0] === true && CurrUser[1] === true) ? (AnsFlag = this.getResourceBundle().getText("S2CBCBMOUCSSANS")) : (CurrUser[0] ===
					true) ? (AnsFlag = this.getResourceBundle().getText("S2CBCSALESUCSSANS")) : ((CurrUser[1] === true) ? (AnsFlag = this.getResourceBundle()
					.getText("S2CBCBMOUCSSANS")) : (""));
				CBCQusData = this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_Q_TABLE).getModel().getData().root;
				for (var i = 0, n = 0; i < CBCData.NAV_CBC_HEAD.results.length; i++) {
					for (var j = 0; j < CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results.length; j++) {
						if (CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsFlag === AnsFlag && CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO
							.results[j].AnsValue === "") {
							qusValidate = false;
							break;
						} else {
							qusValidate = true;
						}
					}
					if (qusValidate === false) break;
				}
				var accessFlag = [];
				(CurrUser[0] === true && CurrUser[1] === true) ? (accessFlag = [this.getResourceBundle().getText("S2CBCANSSUCCESSKEY"), 
				      this.getResourceBundle().getText("S2CBCANSBLANKKEY")]) : ((CurrUser[0] === true) ? (accessFlag = ["S"]) :
				    	  ((CurrUser[1] === true) ? (accessFlag = [this.getResourceBundle().getText("S2CBCANSBLANKKEY")]) : ("")));
				for (var k = 0; k <= accessFlag.length - 1; k++) {
					for (var i = 0, n = 0; i < CBCData.NAV_CBC_HEAD.results.length; i++) {
						for (var j = 0; j < CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results.length; j++) {
							if((i === 7 && j === 9) && CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Comments === ""){  //PCR033317++;Condition Updated
								if(CBCData.NAV_CBC_HEAD.results[7].NAV_CBC_QAINFO.results[9].AnsFlag === "T"){               //PCR033317++;Condition Updated
								    quesComment = false;                                                                     //PCR018375++
								    quesSet = "H";                                                                           //PCR018375++
								    break;
								} else {
									quesComment = true;	
								}
							}else if(i === 7 && (j > 4 && j < 9)){                                                           //PCR033317++;Condition Updated
								quesComment = true;
							}else if (CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].AnsFlag === accessFlag[k] && CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO
									.results[j].AnsValue === AnsValue) {
								if (CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Comments === "") {
									quesComment = false;                                                                    //PCR018375++
									quesSet = "Y";                                                                          //PCR018375++
									break;
								} else {
									quesComment = true;
								}

							}
						}
						if (quesComment === false) break;
					}
					if (quesComment === false) break;
				}
			}
//			return ErrorFlag = [qusValidate, quesComment];                                                                 //PCR018375--
			return ErrorFlag = [qusValidate, quesComment, quesSet];                                                        //PCR018375++
		},
		/**
		 * This method Used to Validate Current User Permission.
		 * 
		 * @name checkCBCCurrentUsers
		 * @param 
		 * @returns checkFlag - Binary flag
		 */
		checkCBCCurrentUsers: function() {
			var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
			var checkFlag = [];
			var romUserList = CBCData.NAV_CBCROM.results;
			var romInitiateFlag = this.checkContact(romUserList);
			var bomUserList = CBCData.NAV_CBCBMO.results;
			var bomInitiateFlag = this.checkContact(bomUserList);
			checkFlag[0] = romInitiateFlag;
			checkFlag[1] = bomInitiateFlag;
			return checkFlag = [romInitiateFlag, bomInitiateFlag];
		},
		/**
		 * This method Validates CBC Questions Answer's Value.
		 * 
		 * @name ValidateCBCData
		 * @param 
		 * @returns ErrorFlag - Binary Flag
		 */
		ValidateCBCData: function() {
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setVisible(true);
			var counter = 1,
				ErrorFlag = [],
				qusValidate = false,
				quesComment = false;
			var oResource = this.getResourceBundle();
			var CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
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
			var quesCheck = [];
			quesCheck = this.validQusAnsCheck(parseInt(CBCData.CbcStatus));
			var aMockMessages = [];
			if (quesCheck[0] === false) {
				var temp = {};
				temp.type = oResource.getText("S2ERRORVALSATETEXT");
				temp.title = oResource.getText("S2CBCMANDATANSERRMSG");
				temp.description = oResource.getText("S2CBCMANDATANSERRMSG");
				temp.subtitle = oResource.getText("S2PSRSDACBCQUESFAILMSGDIS");
				temp.counter = counter;
				aMockMessages.push(temp);
				counter++;
			} else {
				var temp = {};
				temp.type = oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
				temp.title = oResource.getText("S2CBCMANDATANSPOSMSG");
				temp.description = oResource.getText("S2CBCMANDATANSPOSMSG");
				temp.subtitle = oResource.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
				temp.counter = counter;
				aMockMessages.push(temp);
				counter++;
				qusValidate = true;
			}
			if (quesCheck[1] === false) {
				var temp = {};
				temp.type = oResource.getText("S2ERRORVALSATETEXT");
				temp.title = oResource.getText("S2CBCMANDATCOMMFAILMSG");
				temp.description = oResource.getText("S2CBCMANDATCOMMFAILMSG");
				temp.subtitle = oResource.getText("S2PSRSDACBCQUESFAILMSGDIS");
				temp.counter = counter;
				aMockMessages.push(temp);
				counter++;
			} else {
				var temp = {};
				temp.type = oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP");
				temp.title = oResource.getText("S2CBCMANDATCOMMTLTMSG");
				temp.description = oResource.getText("S2CBCMANDATCOMMTLTMSG");
				temp.subtitle = oResource.getText("S2PSRSDACBCQUESSUCSSMSGTYP");
				temp.counter = counter;
				aMockMessages.push(temp);
				counter++;
				quesComment = true;
			}
			if (ErrorFlag === true) {
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
//			return ErrorFlag = [qusValidate, quesComment];                                                                   //PCR018375--
			return ErrorFlag = [qusValidate, quesComment, quesCheck[2]];                                                     //PCR018375++
		},
		/**
		 * This method Handles Work Flow Approve Button Event.
		 * 
		 * @name onSubmitCBCToNxtApr
		 * @param 
		 * @returns 
		 */
		onSubmitCBCToNxtApr: function() {
			var oResource = this.getResourceBundle();
			var CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
			var SendFAppAuth = (thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData()
				.SendApproval === oResource.getText("S2ODATAPOSVAL")) ? (true) : (false);
			if (SendFAppAuth === false) {
				thisCntrlr.showToastMessage(oResource.getText("S2CBCAUTHNEGATXT"));
			} else {
				var validateCBCTask = this.validateCBCWF();
				if (validateCBCTask[0] === false && validateCBCTask[1] === oResource.getText(
						"S2CBCCONTACTLENTH0MSG")) {
					thisCntrlr.showToastMessage(oResource.getText("S2CBCCONTACTLENTH0MSGDIS"));
				} else {
					if (validateCBCTask[0] === false) {
						thisCntrlr.showToastMessage(oResource.getText("S2CBCUSERAUTHFALTTXT") + ' ' +
							validateCBCTask[1] + ' ' + oResource.getText("S2CBCUSERAUTHFALTTXT2PART"));
					} else {
						var AprlFlag = false;
						(parseInt(CBCData.TaskId) !== 0) ? (AprlFlag = true) : (AprlFlag = false);
						if (AprlFlag === false) {
							thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCAUTHCHECKFAILMSG"));
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setEnabled(false);
						} else {
							var ErrorFlag = [];
							if (parseInt(CBCData.CbcStatus) >= 505 && parseInt(CBCData.CbcStatus) <= 510) {
								ErrorFlag = this.validQusAnsCheck(parseInt(CBCData.CbcStatus));
							} else if (parseInt(CBCData.CbcStatus) > 510) {
								ErrorFlag[0] = true;
								ErrorFlag[1] = true;
							}
							if (ErrorFlag[0] === false || ErrorFlag[1] === false) {
								(ErrorFlag[0] === false) ? (thisCntrlr.showToastMessage(oResource.getText(
//								"S2CBCMANDATANSERRORMSG"))) :((ErrorFlag[1] === false) ? (thisCntrlr.showToastMessage(oResource.getText("S2CBCMANDATCOMMERRORMSG"))) : (""));   //PCR018375--
								"S2CBCMANDATANSERRORMSG"))) : ((ErrorFlag[1] === false && CBCData.CbcType === "CS")?((ErrorFlag[2] ===                                          //PCR018375++
									oResource.getText("S2POSMANDATANS"))?(thisCntrlr.showToastMessage(oResource.getText("S2CBCCLNAQUSANSERRORTXT"))):                           //PCR018375++
										(thisCntrlr.showToastMessage(oResource.getText("S2CBCCLMANDATCOMMERRORMSG")))):((ErrorFlag[1] === false                                 //PCR018375++												                                  
										 && CBCData.CbcType === "CL")?(thisCntrlr.showToastMessage(oResource.getText("S2CBCCLNAQUSANSERRORTXT"))):("")));                       //PCR018375++
							} else {
								this.detActionType = oResource.getText("S2CBCSUBMITCONFIRMVALKEY");
								this.dialog = sap.ui.xmlfragment(oResource.getText("PSRCBCONAPPORREJConfirmation"), this);
								this.getCurrentView().addDependent(this.dialog);
								this.dialog.open();
							}
						}
					}
				}
			}
		},
		/**
		 * This method Handles CBC Data Refresh Data Call.
		 * 
		 * @name checkCBCInitiate
		 * @param 
		 * @returns 
		 */
		checkCBCInitiate: function() {
			this.getRefreshCBCData(thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"))
				.getData().Guid, thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData()
				.ItemGuid);
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
			(oEvent.getParameters().id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
					.id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
				.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA) ? (SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity
				.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN)) : ((oEvent.getParameters().id.split(this.getResourceBundle()
					.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(this.getResourceBundle().getText(
					"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_TEXT_AREA) ?
				(SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN)) : (
					SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_SAVEBtn))
			);
			if (oEvent.getParameters().value.length > 0 && oEvent.getParameters().value.length < 255) {
				SaveBtn.setEnabled(true);
			} else if (oEvent.getParameters().value.length === 255) {
				SaveBtn.setEnabled(false);
				thisCntrlr.showToastMessage(this.getResourceBundle().getText("S2PSRSDACBCMCOMMVALTXT"));
			} else {
				SaveBtn.setEnabled(false);
			}
		},
		/**
		 * This method is used to handles Main comment Panel Expand Event.
		 * 
		 * @name OnExpandMainCom
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		OnExpandMainCom: function(oEvent) {
			if (oEvent.getParameters().expand === true) {
				var MCommType = "",
					oTable = "",
					MComModel = "";
				if (oEvent.getParameters().id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
						.id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
					.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL) {
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setValue(
						"");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN).setEnabled(
						false);
					MCommType = this.getResourceBundle().getText("S2PSRMCOMMDATATYP");
					oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__COMMTABLE);
				} else if (oEvent.getParameters().id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT"))[
						oEvent.getParameters().id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT")).length -
						1] === com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_PANEL) {
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_TEXT_AREA).setValue("");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN).setEnabled(
						false);
					MCommType = this.getResourceBundle().getText("S2CBCMCOMMDATATYP");
					oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__COMMTABLE);
				} else if (oEvent.getParameters().id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT"))[
						oEvent.getParameters().id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT")).length -
						1] === com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL) {
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setValue(
						"");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_SAVEBtn).setEnabled(
						false);
					MCommType = this.getResourceBundle().getText("S2PDCMCOMMDATATYP");
					oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_TABLE);
				}
				var ItemGuid = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData()
					.ItemGuid;
				var sValidate = "CommentsSet?$filter=ItemGuid eq guid'" + ItemGuid + "'and CommType eq '" + MCommType +
					"'";
				this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				(oEvent.getParameters().id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
						.id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
					.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL) ? (MComModel = thisCntrlr.getModelFromCore(this.getResourceBundle()
					.getText("GLBPSRCOMMMODEL"))) : (
					(oEvent.getParameters().id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
							.id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm
						.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_PANEL) ? (MComModel = thisCntrlr.getModelFromCore(this.getResourceBundle()
						.getText("GLBCBCCOMMMODEL"))) : (MComModel = thisCntrlr.getModelFromCore(this.getResourceBundle().getText(
						"GLBPDCCOMMMODEL"))));
				if (oEvent.getParameters().id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
						.id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
					.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL) {
					MComModel = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBPDCCOMMMODEL"));
				}
				oTable.setModel(MComModel);
			}
		},
		/**
		 * This method is used to handles Main Comment Payload.
		 * 
		 * @name MainComPayload
		 * @param oEvent - Holds the current event, CommType - Main Comment Process Type
		 * @returns
		 */
		MainComPayload: function(Comment, CommType) {
			var obj = {};
			obj.ItemGuid = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData()
				.ItemGuid;
			obj.CommentId = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData()
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
			(oEvent.getParameters().id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
					.id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
				.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN) ? (MCommType = this.getResourceBundle().getText(
					"S2PSRMCOMMDATATYP"), MType = this.getResourceBundle().getText("S2ICONTABPSRTEXT"), oTable =
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__COMMTABLE), MTxtAra =
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA), SaveBtn =
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN)) : (
				(oEvent.getParameters().id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
						.id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
					.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN) ? (MCommType = this.getResourceBundle().getText(
						"S2CBCMCOMMDATATYP"), MType = this.getResourceBundle().getText("S2ICONTABCBCTXT"), oTable =
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__COMMTABLE), MTxtAra =
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_TEXT_AREA), SaveBtn =
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN)) : (MCommType =
					this.getResourceBundle().getText("S2PDCMCOMMDATATYP"), MType = this.getResourceBundle().getText(
						"S2ICONTABPDCTEXT"), oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__COMMTABLE),
					MTxtAra = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA),
					SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__SAVEBTN)
				));
			var obj = this.MainComPayload(oEvent.getSource().getParent().getFields()[0].getValue(), MType);
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CommentsSet, com.amat.crm.opportunity
				.util.ServiceConfigConstants.write, obj, this.getResourceBundle().getText(
					"S2PSRCBCMCOMMSAVSUCSSTXT"));
			var ItemGuid = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData()
				.ItemGuid;
			var sValidate = "CommentsSet?$filter=ItemGuid eq guid'" + ItemGuid + "'and CommType eq '" + MCommType +
				"'";
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			(oEvent.getParameters().id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
					.id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
				.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN) ? (MComModel = thisCntrlr.getModelFromCore(this.getResourceBundle()
				.getText("GLBPSRCOMMMODEL"))) : (
				(oEvent.getParameters().id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters()
						.id.split(this.getResourceBundle().getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
					.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN) ? (MComModel = thisCntrlr.getModelFromCore(this.getResourceBundle()
					.getText("GLBCBCCOMMMODEL"))) : (MComModel = thisCntrlr.getModelFromCore(this.getResourceBundle().getText(
					"GLBPDCCOMMMODEL"))));
			oTable.setModel(MComModel);
			MTxtAra.setValue("");
			SaveBtn.setEnabled(false);
			myBusyDialog.close();
		},
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
		 * This method is used to handles CC check Box selection event.
		 * 
		 * @name onSelectCB
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onSelectCB: function(oEvent) {
			var SelectedDes = oEvent.getParameters().selected;
			var Selectedline = oEvent.getSource().getBindingContext().sPath.split(this.getResourceBundle().getText(
				"S2CBCPSRCARMSEPRATOR"))[oEvent.getSource().getBindingContext().sPath.split(this.getResourceBundle()
				.getText("S2CBCPSRCARMSEPRATOR")).length - 1];
			this.UnselectedRecord = {
				"results": []
			};

			var oCBCCbnCpyModel = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCCCPYMODEL"));
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
		 * This method is used to handles ok button event.
		 * 
		 * @name onRelPerSpecRewOkPress
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onRelPerSpecRewOkPress: function(oEvent) {
			this._initiateControllerObjects();
			if (oEvent.getSource().getParent().getContent()[2].getColumns()[0].getVisible() === false) {                                         //PCR025717++; getContent()[0] replaced with getContent()[2]
				var items = oEvent.getSource().getParent().getContent()[0].mAggregations.items;
				if (items.length === 0) {
					thisCntrlr.showToastMessage(this.getResourceBundle().getText("S2PSRSDACBCPREOUSOPPMSG"));
				} else {
					var OppGenInfoModel = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
					var oEntry = {
						Guid: OppGenInfoModel.getData()
							.Guid,
						ItemGuid: OppGenInfoModel.getData()
							.ItemGuid,
						OppId: thisCntrlr.OppId,
						ItemNo: thisCntrlr.ItemNo,
						Repflag: this.getResourceBundle().getText("S2ODATAPOSVAL"),
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
						.util.ServiceConfigConstants.write, oEntry, this.getResourceBundle().getText("S2PSRSDASUCSSLINK"));
					this.closeDialog();
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).setVisible(true);
					this.refreshRelPerSpecRewData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
					that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_TABLE).getModel().getData()
						.length === 0 ? that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX).setVisible(
							true) : thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BT_NOTINLIST_BOX).setVisible(
							false);
				}
			} else if (this.CbnType === this.getResourceBundle().getText("S2ICONTABCBCTXT")) {
				var oTable1 = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_CC_TABLE);
				var FinalRecord = {
					"results": []
				};
				var CBCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBCBCCCPYMODEL")).getData().results;
				for (var i = 0, n = 0; i < CBCData.length; i++) {
					if (CBCData[i].Selected === true) {
						FinalRecord.results[n] = CBCData[i];
						n++;
					}
				}
				this._initiateControllerObjects();
				FinalRecord.results = FinalRecord.results.concat(this.CBCCCData.results);
				this.closeDialog();
				var cModel = this.getJSONModel(FinalRecord);
				oTable1.setModel(cModel);
				this.SelectedRecord.results.length = 0;
				this.UnselectedRecord.results.length = 0;
			}
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
		 * This method Handles OK Button Of Confirmation Dialog.
		 * 
		 * @name onWFPress
		 * @param oEvent - Holds the current event, thisCntrlr - Current Controller
		 * @returns 
		 */
		onWFPress: function(oEvent) {
			oCommonController.commonWFPress(oEvent, thisCntrlr);
		},
		/**
		 * This method Handles Live Change Event for Carbon Copy F4 Text Change. 
		 * 
		 * @name onCbnCpyChange
		 * @param oEvent - Event Handlers
		 * @returns 
		 */
		onCBCCbnCpyChange: function(oEvent) {
			that_psrsda === undefined ? this._initiateControllerObjects() : "";
			that_psrsda.getController().onCbnCpyChange(oEvent, thisCntrlr);
		},
		//*************** Start Of PCR018375++ - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
		/**
		 * This Method is use For Reset Process Button Press Event. 
		 * 
		 * @name onCBCResetProcess
		 * @param oEvent - Event Handlers
		 * @returns 
		 */
		onCBCResetProcess: function(oEvent) {
			this._initiateControllerObjects(thisCntrlr);
			var sValidate = "ResetChildListSet?$filter=OppId eq '" + that_views2.getController().OppId + "' and ItemNo eq '" + that_views2.getController()
				.ItemNo + "' and Ptype eq '" + "CBC'";
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var ResetData = thisCntrlr.getModelFromCore("ResetChildListModel").getData().results;
			thisCntrlr.ResetType = ResetData.length > 0 ? thisCntrlr.bundle.getText("S2RECRATEDEPTYPTEXT") : thisCntrlr.bundle.getText(
				"S2RECRATEINDEPTYPTEXT");
			var ProcessType = 'CBC';
			var CBCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBCBCMODEL")).getData();
			this.dialog = sap.ui.xmlfragment(thisCntrlr.bundle.getText("PSRPDCONRESETConfirmation"), this);
			if (thisCntrlr.ResetType === thisCntrlr.bundle.getText("S2RECRATEDEPTYPTEXT"))
				{
				  (parseInt(CBCData.CbcStatus) >= 530)?(this.dialog.getContent()[1].setVisible(true)):(this.dialog.getContent()[1].setVisible(false));
				  for(var i = 0; i < ResetData.length; i++){                                                                                                                      //PCR035760++
					  ResetData[i].Selectflag = ResetData[i].Selectflag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? true : false;                                            //PCR035760++
				  }                                                                                                                                                               //PCR035760++
				  this.dialog.getContent()[1].setModel(this.getJSONModel({
					 "ItemSet": ResetData
				}));
			}
			this.getCurrentView().addDependent(this.dialog);
			this.dialog.getCustomHeader().getContentMiddle()[1].setText(thisCntrlr.bundle.getText("S2CBCREQIREDVALIDATIONTXT"));
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
			sap.ui.core.BusyIndicator.show();
			if (thisCntrlr.ResetType === oResource.getText("S2RECRATEINDEPTYPTEXT")){
				payload.Guid = GenInfoModel.Guid;
				payload.ItemGuid = GenInfoModel.ItemGuid;
				payload.Ptype = '';
				payload.step = oResource.getText("S2CBCTABTXT");
				payload.Comments = recreateMsg;
				SuccessMsg = oResource.getText("S2CBCTABTXT") + " " + oResource.getText("S2RECRATEPOSMSG");
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ResetSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, payload, SuccessMsg);
			} else {
				payload.Guid = GenInfoModel.Guid;
				payload.ItemGuid = GenInfoModel.ItemGuid;
				payload.OppId = that_views2.getController().OppId;
				payload.ItemNo = that_views2.getController().ItemNo;
				payload.Ptype = oResource.getText("S2CBCTABTXT");
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
						obj.Ptype = oResource.getText("S2CBCTABTXT");
						obj.Selectflag = ResetData.ItemSet[k].Selectflag === false ? "" : oResource.getText("S2ODATAPOSVAL");
						payload.nav_reset_child.push(obj);
					}
				}
				SuccessMsg = oResource.getText("S2CBCTABTXT") + " " + oResource.getText("S2RECRATEPOSMSG");
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ResetChildListSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, payload, SuccessMsg);
			}
			sap.ui.core.BusyIndicator.hide();
			this._initiateControllerObjects(thisCntrlr);
			thisCntrlr.checkCBCInitiate();
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_CBCRESET).setVisible(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APR_MESSAGE).setVisible(false);
			that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Default);
		},
		/**
		 * This Method is use MEA Doc Panel Expand Event.
		 *  
		 * @name onExpMEADoc
		 * @param 
		 * @returns 
		 */
		onExpMEADoc: function(){
			var genaralDocData = [];
			var oResource = this.getResourceBundle();
			var oView = thisCntrlr.getView();
			var CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
			var SecurityData = thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();
			(SecurityData.UpldGenDoc === oResource.getText("S2ODATAPOSVAL") && parseInt(CBCData.CbcStatus) < 530 && 
				oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).getText() === oResource.getText("S2PSRSDACANBTNTXT")) ? (oView.byId(
				com.amat.crm.opportunity.Ids.S2CBC_PANL_MEA_DOC_CHOOSE_BTN).setEnabled(true)) : ((parseInt(CBCData.CbcStatus) >= 530)?(oView.byId(
				com.amat.crm.opportunity.Ids.S2CBC_PANL_MEA_DOC_CHOOSE_BTN).setEnabled(true)):(oView.byId(com.amat.crm.opportunity.Ids.
				S2CBC_PANL_MEA_DOC_CHOOSE_BTN).setEnabled(false)));
			thisCntrlr.genaralDocFrag = [];
			thisCntrlr.Guid = CBCData.Guid;
			thisCntrlr.itemguid = CBCData.ItemGuid;
			thisCntrlr.DocType = CBCData.NAV_CBC_DOCS.results[0].DocType;
			for (var i = 0; i < CBCData.NAV_CBC_DOCS.results.length; i++) {
				var doc = {
					"Guid": "",
					"DocId": "",
					"itemguid": "",
					"doctype": "",
					"DocDesc": "",
					"docsubtype": "",
					"filename": "",
					"OriginalFname": "",
					"ExpireDate": "",
					"note": "",
					"Code": "",
					"uBvisible": false,
					"bgVisible": false,
					"editable":  true,
					"delVisible": true,
					"enableEditflag": true,
					"enableDelflag": true,
				};
				if (CBCData.NAV_CBC_DOCS.results[i].FileName !== "") {
					doc.Guid = CBCData.NAV_CBC_DOCS.results[i].Guid;
					doc.DocId = CBCData.NAV_CBC_DOCS.results[i].DocId;
					doc.docsubtype = CBCData.NAV_CBC_DOCS.results[i].DocSubtype;
					doc.itemguid = CBCData.NAV_CBC_DOCS.results[i].ItemGuid;
					doc.doctype = CBCData.NAV_CBC_DOCS.results[i].DocType;
					doc.DocDesc = CBCData.NAV_CBC_DOCS.results[i].DocDesc;
					doc.filename = CBCData.NAV_CBC_DOCS.results[i].FileName;
					doc.OriginalFname = CBCData.NAV_CBC_DOCS.results[i].OriginalFname;
					doc.note = CBCData.NAV_CBC_DOCS.results[i].Notes;
					var expDate = (CBCData.NAV_CBC_DOCS.results[i].ExpireDate === oResource.getText(
						"S2ATTACHPSRCBDATESTRNGTEXT") || CBCData.NAV_CBC_DOCS.results[i].ExpireDate === "") ? null : new Date(
						CBCData.NAV_CBC_DOCS.results[i].ExpireDate.slice(0, 4), CBCData.NAV_CBC_DOCS.results[i].ExpireDate
						.slice(4, 6) - 1, CBCData.NAV_CBC_DOCS.results[i].ExpireDate.slice(6, 8));
					doc.ExpireDate = expDate;
					doc.EnableDisflag = (SecurityData.ViewGenDoc === oResource.getText("S2ODATAPOSVAL") ?
						true : false);
					doc.Code = CBCData.NAV_CBC_DOCS.results[i].Code;
					doc.uBvisible = CBCData.NAV_CBC_DOCS.results[i].FileName === "" ? true : false;
					doc.bgVisible = !doc.uBvisible;
					doc.editable = false;
					doc.enableEditflag = parseInt(CBCData.CbcStatus) < 530 && oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).getText() === 
						oResource.getText("S2PSRSDACANBTNTXT") ? true :(parseInt(CBCData.CbcStatus) >= 530? true : false);
					doc.enableDelflag =  parseInt(CBCData.CbcStatus) < 530 && oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).getText() === 
						oResource.getText("S2PSRSDACANBTNTXT") ? true :(parseInt(CBCData.CbcStatus) >= 530? true : false);
					genaralDocData.push(doc);
					thisCntrlr.DocType = CBCData.NAV_CBC_DOCS.results[i].DocType;
					thisCntrlr.docsubtype = CBCData.NAV_CBC_DOCS.results[i].DocSubtype;
					doc.delVisible = (SecurityData.DelGenDoc === oResource.getText("S2ODATAPOSVAL") ?
						true : false);
				}
			}
			var oMEADocModel = this.getJSONModel({
				"ItemSet": genaralDocData
			});
			thisCntrlr.oMEADocTable = oView.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MEA_DOC_LIST_TABLE);
			thisCntrlr.oMEADocTable.setModel(oMEADocModel);
			var table = thisCntrlr.oMEADocTable;
			for (var i = 0; i < table.getModel().getData().ItemSet.length; i++) {
				if (table.getModel().getData().ItemSet[i].uBvisible === true) {
					table.mAggregations.items[i].mAggregations.cells[2].setEnabled(true);
				} else {
					table.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
				}
				table.mAggregations.items[i].mAggregations.cells[4].mAggregations.items[0].mAggregations.items[0].setIcon(
					oResource.getText("S2PSRSDAEDITICON"));
				table.mAggregations.items[i].mAggregations.cells[4].mAggregations.items[0].mAggregations.items[1].setIcon(
					oResource.getText("S2PSRSDADELETEICON"));
				if (table.mAggregations.items[i].mAggregations.cells[4].mAggregations.items[0].mAggregations.items[3] !==
					undefined) {
					table.mAggregations.items[i].mAggregations.cells[4].mAggregations.items[0].mAggregations.items[3].setVisible(
						true);
				}
			}
		},
		/**
		 * This Method is use MEA Doc Panel Choose button press Event.
		 *  
		 * @name onCBCChoosePress
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onCBCChoosePress: function(oEvent){
			var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
			if(parseInt(CBCData.CbcStatus) !== 530 && parseInt(CBCData.CbcStatus) !== 540){
			       thisCntrlr.onSaveCBC("", ""); 
			       this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(this.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));     //PCR022669++
			       thisCntrlr.onEditCBC(); 
			}
			var MEADoc = "";
			var oResouce = thisCntrlr.bundle;
			var Guid = CBCData.Guid;
			var ItemGuid = CBCData.ItemGuid;
			var MEADocFrag = [];
			var Custno = thisCntrlr.getModelFromCore(oResouce.getText("GLBPSRMODEL")).getData().Custno;
			var sGenaralChoos = "Cust_DocSet?$filter=Guid eq guid'" + Guid + "' and ItemGuid eq guid'" + ItemGuid +
				"' and Customer eq '" + Custno + "'and DocType eq 'CBC'";
			this.oMyOppModel._oDataModel.read(sGenaralChoos, null, null, false, function(oData, oResponse) {
				MEADoc = oData;
			}, function(value) {});
			for (var i = 0; i < MEADoc.results.length; i++) {
				var doc = {
					"Guid": "",
					"DocId": "",
					"itemguid": "",
					"doctype": "",
					"docsubtype": "",
					"DocDesc": "",
					"filename": "",
					"OriginalFname": "",
					"ExpireDate": "",
					"note": "",
					"Code": "",
					"Customer": "",
					"MimeType": "",
					"ItemNo": "",
					"OppId": "",
					"UploadedBy": "",
					"UploadedDate": "",
					"uBvisible": false,
					"bgVisible": false,
					"editable": true
				};
				doc.Guid = MEADoc.results[i].Guid;
				doc.DocId = MEADoc.results[i].DocId;
				doc.docsubtype = MEADoc.results[i].DocSubtype;
				doc.DocDesc = MEADoc.results[i].DocDesc;
				doc.itemguid = MEADoc.results[i].ItemGuid;
				doc.doctype = MEADoc.results[i].DocType;
				doc.filename = MEADoc.results[i].FileName;
				doc.OriginalFname = MEADoc.results[i].OriginalFname;
				doc.note = MEADoc.results[i].Notes;
				doc.ExpireDate = MEADoc.results[i].ExpireDate !== oResouce.getText("S2ATTACHPSRCBDATESTRNGTEXT") ?new Date(MEADoc.results[i].ExpireDate.slice(0, 4), MEADoc.results[i].ExpireDate.slice(4, 6) -
						1, MEADoc.results[i].ExpireDate.slice(6, 8)) : null;					
				doc.Code = MEADoc.results[i].Code;
				doc.Customer = MEADoc.results[i].Customer;
				doc.MimeType = MEADoc.results[i].MimeType;
				doc.ItemNo = MEADoc.results[i].ItemNo;
				doc.OppId = MEADoc.results[i].OppId;
				doc.UploadedBy = MEADoc.results[i].UploadedBy;
				doc.UploadedDate = MEADoc.results[i].UploadedDate;
				doc.uBvisible = MEADoc.results[i].FileName === "" ? true : false;
				doc.bgVisible = !doc.uBvisible;
				doc.editable = false;
				MEADocFrag.push(doc);
			}
			this.dialog = sap.ui.xmlfragment(oResouce.getText("PSRCBCONAPPORREJCONFIRMATION"), this);
			thisCntrlr.getCurrentView().addDependent(this.dialog);
			this.dialog.setModel(new sap.ui.model.json.JSONModel(), oResouce.getText(
				"S2PSRCBCATTDFTJSONMDLTXT"));
			this.dialog.getModel(oResouce.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
				"ItemSet": MEADocFrag
			});
			this.dialog.getButtons()[1].setEnabled(false);
			this.dialog.getContent()[0].getColumns()[1].setWidth("22em");
			this.dialog.getContent()[0].getColumns()[2].setStyleClass(oResouce.getText("S2CBCMEAEXDATSTLCLS"));
			this.dialog.open();
		},
		/**
		 * This method Handles Cancel Dialog Button Event.
		 * 
		 * @name onCancelFragment
		 * @param 
		 * @returns 
		 */
		onCancelFragment: function() {
			this.closeDialog();
			this.destroyDialog();
		},
		/**
		 * This method Handles on Browse Button Event.
		 * 
		 * @name onUploadFromPress
		 * @param evt - Event Handler
		 * @returns 
		 */
		onUploadFromPress: function(evt) {
			this.dialog.close();
			this.destroyDialog();
			var oResource = thisCntrlr.bundle;
			this.dialog = sap.ui.xmlfragment(oResource.getText("ATTACHGENiNFODOCSELECT"), this);
			thisCntrlr.getCurrentView().addDependent(this.dialog);
			var oDatePicker = sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_DATEBtn);
			oDatePicker.addEventDelegate({
				onAfterRendering: function() {
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#' + oID).attr("disabled", "disabled");
				}
			}, oDatePicker);
			var sDocSubtype = "Other_DoclistSet?$filter=DocType eq 'CBC'";
			this.serviceCall(sDocSubtype, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			thisCntrlr.genaralDoctype = thisCntrlr.getModelFromCore("otherDocAttchmentModel").getData();
			this.dialog.setModel(new sap.ui.model.json.JSONModel(), oResource.getText(
				"S2PSRCBCATTDFTJSONMDLTXT"));
			var a = {
				DocDesc: oResource.getText("S2ATTCHDOCTYPVALDMSG")
			};
			thisCntrlr.genaralDoctype.results.unshift(a);
			this.dialog.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
				docType: thisCntrlr.genaralDoctype.results
			});
			this.dialog.open();
		},
		/**
		 * This method Handles General Doc Fragment Data selection Event.
		 * 
		 * @name onFragmentSelection
		 * @param evt - Holds the current event
		 * @returns 
		 */
		onFragmentSelection: function(evt) {
			if (evt.getParameters().selectedItem.getText() === thisCntrlr.bundle.getText(
					"S2ATTCHDOCTYPVALDMSG")) {
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ATTCGENMESG"));
				evt.getSource().getParent().getParent().mAggregations.formElements[2].mAggregations.fields[1].setEnabled(
					false);
			} else {
				evt.getSource().getParent().getParent().mAggregations.formElements[2].mAggregations.fields[0].setEnabled(
					true);
				evt.getSource().getParent().getParent().mAggregations.formElements[2].mAggregations.fields[1].setEnabled(
					true);
			}
		},
		/**
		 * This method Handles General Document date change event.
		 * 
		 * @name handleFragmentDateChange
		 * @param evt - Holds the current event
		 * @returns 
		 */
		handleFragmentDateChange: function(evt) {
			var tempDate = evt.getParameters().newValue;
			if (new Date(tempDate.split(".")[1] + "-" + tempDate.split(".")[0] + "-" + tempDate.split(".")[2]) <
				new Date()) {
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S1CARMDATELESS"));
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_DATEBtn).setValueState(
					sap.ui.core.ValueState.Error);
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_DATEBtn).setDateValue(
					null);
			} else {
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_DATEBtn).setValueState(
					sap.ui.core.ValueState.None);
			}
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
			thisCntrlr.Custno = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData()
				.Custno;
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
			var SLUG = thisCntrlr.itemguid.replace(/-/g, "").toUpperCase() + "$$" + thisCntrlr.DocType + "$$" + docsubtype +              //PCR035760 Defect#131 TechUpgrade changes
				"$$ $$" + date + "$$" + thisCntrlr.Custno + "$$" + evt.mParameters.newValue + "$$" + (note === " " ?
					" " : note);
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
			this.dialog.close();
			this.destroyDialog();
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
				thisCntrlr.getRefreshCBCData(thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"))
				   .getData().Guid, thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().ItemGuid);
				thisCntrlr.onExpMEADoc();
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCATTDOCUPLDSUCSSMSG"));
				thisCntrlr.dialog.close();
				thisCntrlr.dialog.destroy();
			} else if (oEvent.getParameters().status === 400) {
				thisCntrlr.showToastMessage($(oEvent.mParameters.responseRaw).find(thisCntrlr.getResourceBundle().getText(
					"S2CBCPSRCARMTYPEMESG"))[0].innerText);
				thisCntrlr.getRefreshCBCData(thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"))
				   .getData().Guid, thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().ItemGuid);
				thisCntrlr.onExpMEADoc();
				thisCntrlr.dialog.close();
				thisCntrlr.dialog.destroy();
			}
			var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
			parseInt(CBCData.CbcStatus) !== 530 && parseInt(CBCData.CbcStatus) !== 540 ? thisCntrlr.onEditCBC(): "";
			sap.ui.core.BusyIndicator.hide();
		},
		/**
		 * This method Handles Edit Button Press Event.
		 * 
		 * @name handleEditPress
		 * @param evt - Event Handler
		 * @returns 
		 */
		handleEditPress: function(evt) {
			var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
			if(evt.getSource().getIcon() === thisCntrlr.bundle.getText("S2PSRSDAEDITICON") && parseInt(CBCData.CbcStatus) !==      
				530 && parseInt(CBCData.CbcStatus) !== 540){
				thisCntrlr.onSaveCBC("", ""); 
			    thisCntrlr.onEditCBC();
			}
			oCommonController.commonEditPress(evt, thisCntrlr);			
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
				var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
				if(evt.getSource().getIcon() === thisCntrlr.bundle.getText("S2PSRSDAEDITICON") && parseInt(CBCData.CbcStatus) !==    
					530 && parseInt(CBCData.CbcStatus) !== 540){
					thisCntrlr.onSaveCBC("", "");
				    thisCntrlr.onEditCBC();                                                                                                  
				}	
				var text = thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDMSG") + " " + thisCntrlr.oTable.getModel()
					.getData().ItemSet[thisCntrlr.rowIndex].DocDesc + "?";
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
		/**
		 * This method Handles File Name Press Event.
		 * 
		 * @name handleEvidenceLinkPress
		 * @param evt - Event handler
		 * @returns 
		 */
		handleLinkPress: function(evt) {
			var oData = "", rowIndex = "";
			var oSource = evt.getSource();
			if(oSource.getModel() !== undefined){
				rowIndex = oSource.getBindingContext().getPath();
				oData = oSource.getModel().getProperty(rowIndex);
			} else {
				rowIndex = oSource.getParent().getBindingContextPath();
				oData = oSource.getParent().oBindingContexts.json.getModel().getProperty(rowIndex);;
			}
			var url = this.oMyOppModel._oDataModel.sServiceUrl + "/AttachmentSet(Guid=guid'" + oData.Guid + "',ItemGuid=guid'" + oData.itemguid +
				"',DocType='" + oData.doctype + "',DocSubtype='" + oData.docsubtype + "',DocId=guid'" + oData.DocId +
				"')/$value";
			window.open(url);
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
		 * This method Handles Submit Dialog Button Event.
		 * 
		 * @name onSubmitFragment
		 * @param 
		 * @returns 
		 */
		onSubmitFragment: function() {
			Date.prototype.yyyymmdd = function() {
				var mm = this.getMonth() + 1;
				var dd = this.getDate();
				return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
			};
			var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			var oEntry = {
				Guid: GenInfoData.Guid,
				ItemGuid: GenInfoData
					.ItemGuid,
				OppId: thisCntrlr.getOwnerComponent().s2.getController().OppId,
				ItemNo: thisCntrlr.getOwnerComponent().s2.getController().ItemNo,
				Repflag: "",
				NAV_CUSTDOCLINK: []
			};
			var items = this.dialog.getContent()[0].getItems();
			var SelectedItem = false;
			if (items.length !== 0) {
				for (var i = 0; i < items.length; i++) {
					if (items[i].getCells()[3].getSelected()) {
						SelectedItem = true;
						var tableData = this.dialog.getModel(thisCntrlr.bundle.getText("S2PSRCBCATTDFTJSONMDLTXT"))
							.getData().ItemSet[i];
						var doc = {
							Guid: tableData.Guid,
							ItemGuid: tableData.itemguid,
							DocType: tableData.doctype,
							DocSubtype: tableData.docsubtype,
							DocDesc: tableData.DocDesc,
							DocId: tableData.DocId,
							Notes: tableData.note,
							MimeType: tableData.MimeType,
							FileName: tableData.filename,
							OppId: tableData.OppId,
							ItemNo: tableData.ItemNo,
							Customer: tableData.Customer,
							Code: tableData.Code,
							ExpireDate: tableData.ExpireDate !== null ? tableData.ExpireDate.yyyymmdd() : tableData.ExpireDate,
							UploadedBy: tableData.UploadedBy,
							UploadedDate: tableData.UploadedDate
						};
						oEntry.NAV_CUSTDOCLINK.push(doc);
					}
				}
			if(SelectedItem === true){
				thisCntrlr.onSaveCBC("", ""); 
				thisCntrlr.onEditCBC(); 
				this.oMyOppModel._oDataModel.create('/CustDoclinkSet', oEntry, null, jQuery.proxy(this._SavedSuccessCallback, this), jQuery.proxy(
						this._SavedFailCallback, this));
				this.closeDialog();
			}else {
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ATTACHSELECTMSG"));
			}	
			} else {
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2CBCNONERCDAVAILMSG"));
			}
		 },
		 /**
		  * This method Handles MEA Document Fragment Check box event.
		  * 
		  * @name onGenDocCheck
		  * @param oEvt - Event Handlers
	      * @returns 
		  */
		onGenDocCheck : function(oEvt){
			if(oEvt.getParameters().selected === true){
				this.dialog.getButtons()[1].setEnabled(true);
			}
		},
		/**
		 * This method Handles on Service Success call Back function.
		 * 
		 * @name _SavedSuccessCallback
		 * @param 
		 * @returns 
		 */
		_SavedSuccessCallback: function() {
			thisCntrlr.checkCBCInitiate();
			thisCntrlr.onExpMEADoc();
			thisCntrlr.onEditCBC();
			thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ATTCHSUBMTSUCSSMSG"));
		},
		/**
		 * This method Handles on Service Fail call Back function.
		 * 
		 * @name _SavedFailCallback
		 * @param 
		 * @returns 
		 */
		_SavedFailCallback: function() {
			thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2CONTCTSAVEERRORMSG"));
		},
		/**
		 * This method Handles Reset log panel Expand Event.
		 * 
		 * @name OnExpandResetLog
		 * @param oEvent - Event Handlers
		 * @returns 
		 */
		OnExpandCBCResetLog: function(oEvent) {
			if (oEvent.getParameters().expand === true) {
				var sValidate = "ResetLog?$filter=ItemGuid eq guid'" + thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData()
					.ItemGuid + "' and CommType eq 'CBC'";
				this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				this.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_RESET_LIST_TABLE).setModel(thisCntrlr.getModelFromCore(thisCntrlr.bundle
					.getText("ResetLogModel")));
			}
		},
		//*************** End Of PCR018375++ - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
		//*************** Start Of PCR022669: Q2C Q2 UI Changes ****************//
		/**
		 * This method Handles CBC form print functionality.
		 * 
		 * @name onPressPrintCBC
		 * @param oEvent - Event Handlers
		 * @returns 
		 */
		onPressPrintCBC: function(oEvent){
			sap.m.MessageBox.confirm(thisCntrlr.bundle.getText("S2CBCPRINTREQIREDVALIDATIONTXT"), this.confirmationCBCPrint, thisCntrlr.bundle.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
		},
		/**
		 * This method Handles CBC Print validation OK button press event.
		 * 
		 * @name confirmationCBCPrint
		 * @param oEvent - Event Handlers
		 * @returns 
		 */
		confirmationCBCPrint : function(oEvent){
			if(oEvent === thisCntrlr.getResourceBundle().getText("S2CONFFRGOKBTN")){
				var ItemGuid = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
				var url = thisCntrlr.oMyOppModel._oDataModel.sServiceUrl + "/PrintFormSet(ItemGuid=guid'" + ItemGuid + "',ProcessType='CBC')/$value";
			    window.open(url);
			}
		}
		
		//*************** End Of PCR022669: Q2C Q2 UI Changes ****************//
	});
});