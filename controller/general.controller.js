/**
 * This class holds all methods of general page.
 *
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends com.amat.crm.opportunity.controller.BaseController
 * @name com.amat.crm.opportunity.controller.general
 *
 *  * -------------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 * Ver.No    Date        Author    PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * V00    20/02/2018    Abhishek   PCR017480         Initial version              *
 *                      Pant       
 *                      (X089025)                                                 *
 ***********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController",
	"com/amat/crm/opportunity/controller/CommonController"
], function(Controller, CommonController) {
	"use strict";
	var thisCntrlr, oCommonController, that_views2;
	return Controller.extend("com.amat.crm.opportunity.controller.general", {
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
			this.bundle = this.getResourceBundle();
			thisCntrlr = this;
			thisCntrlr.colFlag = [false, false, false, false, false, false, false, false, false, false, false,
				false, false, false
			];
			that_views2 = this.getOwnerComponent().s2;
			thisCntrlr.flagAtt = 0;
			thisCntrlr.MandateData;
			thisCntrlr.oMessagePopover;
			this.detActionType;
			this.SelectedRecord = {
				"results": []
			};
			this.oMyOppModel = new com.amat.crm.opportunity.model.models(this);
			oCommonController = new CommonController();

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
			if (oEventParameters.hasOwnProperty(this.getResourceBundle().getText("S2TYPECONTCTPROPTXT"))) {
				searchText = oEventParameters.newValue;
				if (searchText.length < 3) return;
			} else searchText = oEventParameters.query;
			this.contactF4Fragment.getModel(this.getResourceBundle().getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
				"ItemSet": []
			});
			var sContact = "Search_contactSet?$filter=NameFirst eq '" + searchText + "'and NameLast eq '" + contactType + "'";
			if (searchText.length != 0) {
				this.serviceCall(sContact, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				contactData = this.getModelFromCore(this.getResourceBundle().getText("GLBCONTACTMODEL")).getData().results;
				this.contactF4Fragment.getModel(this.getResourceBundle().getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
					"ItemSet": contactData
				});
			} else {
				this.contactF4Fragment.getModel(this.getResourceBundle().getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
					"ItemSet": thisCntrlr.contactData
				});
			}
		},
		/**
		 * This method Handles Table Column Press Event.
		 * 
		 * @name onColumnPress
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onColumnPress: function(oEvent) {
			thisCntrlr.setFilters(oEvent, oEvent.getParameter(this.getResourceBundle().getText("S1COLMNINDEXTEXT")));
		},
		/**
		 * This method Handles Table Data Filter Event.
		 * 
		 * @name setFilters
		 * @param evt - Event Handler, colIndex - Column Index
		 * @returns 
		 */
		setFilters: function(evt, colIndex) {
			colIndex = evt.getParameter(this.getResourceBundle().getText("S1COLMNINDEXTEXT"));
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
		 * This method Used to refresh GenInfo Model.
		 * 
		 * @name refreshModel
		 * @param 
		 * @returns 
		 */
		refreshModel: function() {
			var sValidatePath = "GenralInfoSet(Guid=guid'" + this.getModelFromCore(this.getResourceBundle().getText(
					"GLBOPPGENINFOMODEL")).getData().Guid + "',ItemGuid=guid'" + this.getModelFromCore(this.getResourceBundle()
					.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid +
				"')?$expand=NAV_ASM_INFO,NAV_BMHEAD_INFO,NAV_BMO_INFO,NAV_BSM_INFO,NAV_CON_INFO,NAV_GPM_INFO,NAV_GSM_INFO,NAV_KPU_INFO,NAV_PM_INFO,NAV_POM_INFO,NAV_RBM_INFO,NAV_ROM_INFO,NAV_SALES_INFO,NAV_TPS_INFO,NAV_TRANS_HISTORY";
			this.getView().getController().serviceCall(sValidatePath, com.amat.crm.opportunity.util.ServiceConfigConstants
				.read, "", "");
			thisCntrlr.setQuoteRevisionNumber();
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
			var oTableItems = thisCntrlr.byId(id);
			var oItemTemplate = thisCntrlr.byId(template);
			oTableItems.setModel(cModel);
			oTableItems.bindAggregation("items", {
				path: "/results",
				template: oItemTemplate
			});
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
		 * This method is used to handles change of Quote number selection .
		 * 
		 * @name setQuoteRevisionNumber
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		setQuoteRevisionNumber: function() {
			var OppGenInfoModel = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
			var ItemGuid = OppGenInfoModel.getData().ItemGuid;
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.QuotelistSet, com.amat.crm.opportunity.util.ServiceConfigConstants
				.read, "", "");
			var sQuoteTableUrl = "RevQuoteSet?$filter=ItemGuid eq guid'" + ItemGuid + "'";
			this.serviceCall(sQuoteTableUrl, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var QuotelistSet = this.getModelFromCore(this.getResourceBundle().getText("GLBQUOTELISTSET")).getData().results;
			var a = {
				Quote: "Select Quote"
			};
			QuotelistSet.unshift(a);
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2GINFO_QUOTEREVNUMCOMBOX).setModel(this.getJSONModel({
				"ItemSet": QuotelistSet
			}));
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2GINFO_QUOTEREVNUMCOMBOX).setSelectedKey(OppGenInfoModel.getData().RevQuoteno ===
				"" ? QuotelistSet[0] : OppGenInfoModel.getData().RevQuoteno);
			var oRevQuoteData = this.getModelFromCore(this.getResourceBundle().getText("GLBREVQUOTEMODEL")).getData().results;
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2GINFO_QUOTEREVNUMTABLE).setModel(this.getJSONModel({
				"ItemSet": oRevQuoteData
			}));;
			thisCntrlr.that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2GINFO_QUOTEREVNUMBTN).setVisible(false);
			var romUserList = OppGenInfoModel.getData().NAV_ROM_INFO.results;
			var pomUserList = OppGenInfoModel.getData().NAV_POM_INFO.results;
			var bmoUserList = OppGenInfoModel.getData().NAV_BMO_INFO.results;
			var romUserFlag = this.checkContact(romUserList);
			var pomUserFlag = this.checkContact(pomUserList);
			var bmoUserFlag = this.checkContact(bmoUserList);
			if (romUserFlag === true || pomUserFlag === true || bmoUserFlag === true) {
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2GINFO_QUOTEREVNUMCOMBOX).setEnabled(true);
			} else {
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2GINFO_QUOTEREVNUMCOMBOX).setEnabled(false);
			}
		},
		/**
		 * This method is used to handles change of Quote number selection .
		 * 
		 * @name onQuoteComboSelectionChange
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onQuoteComboSelectionChange: function(oEvt) {
			if (oEvt.mParameters.selectedItem.getKey() !== this.getResourceBundle().getText("SELQUOTE")) {
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2GINFO_QUOTEREVNUMBTN).setVisible(true);
			} else {
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2GINFO_QUOTEREVNUMBTN).setVisible(false);
			}
		},
		/**
		 * This method is used to save the Quote number.
		 * 
		 * @name onQuoteSave
		 * @param 
		 * @returns
		 */
		onQuoteSave: function() {

			var obj = {
				"ItemGuid": this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().ItemGuid,
				"QuoteGuid": this.getResourceBundle().getText("BLANKITEMGUID"),
				"Quote": thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2GINFO_QUOTEREVNUMCOMBOX).getSelectedKey(),
				"CreatedName": "",
				"CreatedDate": ""

			};
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.RevQuoteSet, com.amat.crm.opportunity.util.ServiceConfigConstants
				.write, obj, "Successfully Saved");
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2GINFO_QUOTEREVNUMBTN).setVisible(false);
			var sQuoteTableUrl = "RevQuoteSet?$filter=ItemGuid eq guid'" + this.getModelFromCore(this.getResourceBundle().getText(
				"GLBOPPGENINFOMODEL")).getData().ItemGuid + "'";
			this.serviceCall(sQuoteTableUrl, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var oRevQuoteData = this.getModelFromCore(this.getResourceBundle().getText("GLBREVQUOTEMODEL")).getData().results;
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2GINFO_QUOTEREVNUMTABLE).setModel(this.getJSONModel({
				"ItemSet": oRevQuoteData
			}));
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2GINFO_QUOTEREVNUMTABLE).getModel().refresh(true);
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
		 * This method Handles Main Comment Note Live Change Event.
		 * 
		 * @name OnMainCommLvchng
		 * @param oEvt - Event Handlers
		 * @returns 
		 */
		OnMainCommLvchng: function(oEvt) {
			oCommonController.commonMainCommLvchng(oEvt, thisCntrlr);
		},
		/**
		 * This method Handles Main Comment Panel Expand Event.
		 * 
		 * @name OnExpandMainCom
		 * @param oEvt - Event Handlers
		 * @returns 
		 */
		OnExpandMainCom: function(oEvt) {
			oCommonController.commonExpandMainCom(oEvt, thisCntrlr);
		},
		/**
		 * This method Handles Main Comment Save Event.
		 * 
		 * @name onSaveMainCom
		 * @param oEvt - Event Handlers
		 * @returns 
		 */
		onSaveMainCom: function(oEvt) {
			oCommonController.commonSaveMainCom(oEvt, thisCntrlr);
		}
	});
});