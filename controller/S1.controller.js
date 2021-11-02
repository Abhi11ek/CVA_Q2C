/**
 * This class holds all methods of S1 page.
 *
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends com.amat.crm.opportunity.controller.BaseController
 * @name com.amat.crm.opportunity.controller.S1
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
 * 20/08/2018      Abhishek        PCR019492         ASC606 UI Changes            *
 *                 Pant                                                           *
 * 05/02/2019      Abhishek        PCR022138         Enable new created SPG re-org*
 *                 Pant                              divisions DC & DD            *
 * 25/02/2019      Abhishek        PCR022669         Q2C Q2 UI Changes            *
 *                 Pant                                                           *
 * 17/06/2019      Abhishek        PCR023905         Migrate ESA/IDS db from Lotus*
 *                 Pant                              Notes to SAP Fiori Q2C       *
 *                                                   Application                  *
 * 26/09/2019      Abhishek        PCR025717         Q2C Q4 2019 Enhancements     *
 *                 Pant                                                           *
 * 20/04/2020      Arun            PCR028711         Q2C Enhancements for Q2-20   *
 *                 Jacob                                                          *
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 25/01/2021      Abhishek Pant   PCR033306         Q2C Display Enhancements     *
 ***********************************************************************************
 */

sap.ui.define([
	"com/amat/crm/opportunity/controller/BaseController",
	"com/amat/crm/opportunity/util/ServiceConfigConstants"
], function(Controller, ServiceConfig) {
	"use strict";
	var _that;
	return Controller.extend("com.amat.crm.opportunity.controller.S1", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf view.S1
		 */

		onInit: function() {
			_that = this;
			_that.cnt = 0;
			_that.opp = 0;
			_that.qot = 0;
			_that.cus = 0;
			_that.son = 0;
			_that.slt = 0;
			_that.low = 0;
			_that.cstpo = 0;
			_that.vcp = 0;
			_that.pstat = 0;
			_that.pdtat = 0;
			_that.cbtat = 0;
			_that.estat = 0;                                                                                                                                  //PCR023905++
			_that.pty = 0;
			_that.cvr = 0;
			_that.rra = 0;                                                                                                                                    //PCR019492++
			_that.bu = 0;                                                                                                                                     //PCR019492++
			_that.btr = 0;	                                                                                                                                  //PCR019492++
			_that.dft = 0;                                                                                                                                    //PCR033306++
			_that.typ = this.getResourceBundle().getText("S1DFTBTNTYP_TXT");
			this.oMyOppModel = new com.amat.crm.opportunity.model.models(this);
			_that.colFlag = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];
			_that.PSRcolFlag = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];
			_that.PDCcolFlag = [true, true, true, true, true, true, true, true, true, true, true, true, true];
			_that.CBCcolFlag = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];
			this.byId(com.amat.crm.opportunity.Ids.TAB_HDR_PERSONALIZE_BTN).addStyleClass(this.getResourceBundle().getText("S1PERDLOGDFTCLS"));
			//***********Start Of PCR028711: Q2C Enhancements for Q2-20**************
			/*this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.OpportunityDataSet, com.amat.crm.opportunity.util.ServiceConfigConstants
				.read, "", "");
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PersonalizeDataSet, com.amat.crm.opportunity.util.ServiceConfigConstants    //PCR022669++
					.read, "", "");                                                                                                                           //PCR022669++
			var oppPerFltdata = this.getModelFromCore(this.getResourceBundle().getText("GLBPERMODEL")).getData();                                             //PCR022669++
			for (var i = 0; i < this.getModelFromCore(this.getResourceBundle().getText("GLBOPPMODEL")).getData().results.length - 1; i++) {
				   this.getModelFromCore(this.getResourceBundle().getText("GLBOPPMODEL")).getData().results[i].ItemNo = parseInt(this.getModelFromCore(
					  this.getResourceBundle().getText("GLBOPPMODEL")).getData().results[i].ItemNo);				   
			    }
			for (var i = 0; i < this.getModelFromCore(this.getResourceBundle().getText("GLBPERMODEL")).getData().results.length - 1; i++) {                   //PCR022669++
				if (oppPerFltdata.results[i].FilterField === this.getResourceBundle().getText("S1PERDLOGBUVWTITLE")) {                                        //PCR022669++
					  this.byId(com.amat.crm.opportunity.Ids.TAB_HDR_PERSONALIZE_BTN).removeStyleClass(this.getResourceBundle().getText(                      //PCR022669++
						"S1PERDLOGDFTCLS"));                                                                                                                  //PCR022669++
					  this.byId(com.amat.crm.opportunity.Ids.TAB_HDR_PERSONALIZE_BTN).addStyleClass(this.getResourceBundle().getText("S1PERDLOGBUCLS"));      //PCR022669++
				   }                                                                                                                                          //PCR022669++
			}                                                                                                                                                 //PCR022669++
			_that.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).setModel(this.getModelFromCore(this.getResourceBundle().getText(
				"GLBOPPMODEL")));*/
			var oResource = this.getResourceBundle();
			var obj = {
					"q2cADLOdr": "",
					"q2cADBU": "",
					"q2cADBQotr": "",
					"q2cADCust": "",
					"q2cADOpp": "",
					"q2cADStId": "",
					"q2cADAQout": "",
					"q2cADCustPO": "",
					"q2cADSOdr": ""
			};
			var F4Model = this.getJSONModel(obj);
			sap.ui.getCore().setModel(F4Model, oResource.getText("S2Q2CADVSCHMODEL"));
			//***********End Of PCR028711: Q2C Enhancements for Q2-20****************
			//this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PersonalizeDataSet, com.amat.crm.opportunity.util.ServiceConfigConstants   //PCR022669--
			//	.read, "", "");                                                                                                                                //PCR022669--
			//this.handleUserPersonalizeData(this.getModelFromCore(this.getResourceBundle().getText("GLBPERMODEL")).getData());                                //PCR022669--
			//this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.SecurityDataSet, com.amat.crm.opportunity.util.ServiceConfigConstants      //PCR022669--
			//	.read, "", "");                                                                                                                                //PCR022669--
			_that.onResetPSRDCBC();
		},
		/**
		 * This method is to handle user personalize Setting.
		 * @name handleUserPersonalizeData
		 * @param oppPerFltdata - Personalize Data
		 * @returns
		 */
		handleUserPersonalizeData: function(oppPerFltdata) {
			var myBusyDialog = this.getBusyDialog();
			myBusyDialog.open();
			var oFilter = [];
			var n = 0;
			for (var i = 0; i < oppPerFltdata.results.length; i++) {
				if (oppPerFltdata.results[i].DefaultChk === this.getResourceBundle().getText("S1TABLESALESTAGECOL")) {
					if (oppPerFltdata.results[i].FilterField === this.getResourceBundle().getText("S1PERDLOGSSTGODTITLE")) {
						if (oppPerFltdata.results[i].FilterVal === this.getResourceBundle().getText("S1SALESTGCOMITTEXT")) {
							oFilter[n] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1PERDLOGSSTGVWPROPTITLE"), sap.ui.model.FilterOperator.EQ,
								oppPerFltdata.results[i].FilterVal);
						} else {
							oFilter[n] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1PERDLOGSSTGVWPROPTITLE"), sap.ui.model.FilterOperator.Contains,
								oppPerFltdata.results[i].FilterVal);
						}
						n++;
					} else if (oppPerFltdata.results[i].FilterField === this.getResourceBundle().getText("S1PERDLOGBUVWTITLE")) {
						oFilter[n] = new sap.ui.model.Filter("Bu", sap.ui.model.FilterOperator.Contains, oppPerFltdata.results[i].FilterVal);
						this.byId(com.amat.crm.opportunity.Ids.TAB_HDR_PERSONALIZE_BTN).removeStyleClass(this.getResourceBundle().getText(
							"S1PERDLOGDFTCLS"));
						this.byId(com.amat.crm.opportunity.Ids.TAB_HDR_PERSONALIZE_BTN).addStyleClass(this.getResourceBundle().getText("S1PERDLOGBUCLS"));
						n++;
					} else if (oppPerFltdata.results[i].FilterField === this.getResourceBundle().getText("S1PERDLOGBQTRODTITLE")) {
						oFilter[n] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1PERDLOGBQTRVWPROPTITLE"), sap.ui.model.FilterOperator.Contains,
							oppPerFltdata.results[i].FilterVal);
						n++;
					} else {
						oFilter[n] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1PERDLOGRGNVWTITLE"), sap.ui.model.FilterOperator.Contains,
							oppPerFltdata.results[i].FilterVal);
						n++;
					}
				}
			}
			var oTable1 = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
			var itemBinding = oTable1.getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
			itemBinding.filter(oFilter);
			myBusyDialog.close();
		},
		/**
		 * This method is to handles Opportunity Master Table data live Search.
		 * @name onLiveSearch
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onLiveSearch: function(oEvent) {
			var oViewS1 = _that.getView();
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));                                //PCR023905++
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_BTN).setText(this.getResourceBundle().getText("S1FILTERCOUNT"));
			//this.onResetPSRDCBC();                                                                                                                                  //PCR028711--
			this.onResetPSRDCBC(this.getResourceBundle().getText("OppSearch_OppKey"));                                                                                //PCR028711++; modified filter parameter
			var oFilter, aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				aFilters = [
					new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTCUSTPROP"), sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTFABNMEPROP"), sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTOPPIDPROP"), sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTAMATQUTIDPROP"), sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTSONOROP"), sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTOPPPRODLNPROP"), sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTVCPRODIDPROP"), sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTODRTYPEPROP"), sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTSDALVLPROP"), sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTREGNPROP"), sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTBOKQTERPROP"), sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTOPPSTATPROP"), sap.ui.model.FilterOperator.Contains, sQuery),
				];
				oFilter = new sap.ui.model.Filter(aFilters, false);
			}
			var list = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TEMPLATE);
			var binding = _that.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getBinding(this.getResourceBundle().getText(
				"S1TABLELISTITM"));
			binding.filter(oFilter);
			this._showHidetabOps();                                                                                                                                 //PCR028711++; show/hide table Buttons
			oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0 ? this._showHideFilterBtns(true) : this._showHideFilterBtns(false);   //PCR028711++; show/hide Filter Buttons	
		},
		/**
		 * This method is to handles Opportunity Master Table setting configurations.
		 * @name onOpenSettings
		 * @param
		 * @returns
		 */
		onOpenSettings: function() {
			this._oDialog = new sap.ui.xmlfragment(this.getResourceBundle().getText("OppSearchViewSetngFragment"), this);
			var columndata = {
				ColumnCollection: [{
					"text": this.getResourceBundle().getText("S1TABLECUSTCOL"),
					"path": this.getResourceBundle().getText("S1FLTCUSTPROP"),
					"visible": true
				}, {
					"text": this.getResourceBundle().getText("S1TABLEBUCOL"),
					"path": this.getResourceBundle().getText("S1FLTPBGPROP"),
					"visible": true
				}, {
					"text": this.getResourceBundle().getText("S1TABLEOPPCOL"),
					"path": this.getResourceBundle().getText("S1FLTOPPIDPROP")
				}, {
					"text": this.getResourceBundle().getText("S1TABLEOPPlINENOCOL"),
					"path": this.getResourceBundle().getText("S1FLTITEMNOPROP")
				}, {
					"text": this.getResourceBundle().getText("S1TABLEQUTENOCOL"),
					"path": this.getResourceBundle().getText("S1FLTAMATQUTIDPROP")
				}, {
					"text": this.getResourceBundle().getText("S1TABLESALESORDERNOCOL"),
					"path": this.getResourceBundle().getText("S1FLTSONOROP")
				}, {
					"text": this.getResourceBundle().getText("S1TABLEPRODUCTLINECOL"),
					"path": this.getResourceBundle().getText("S1FLTKPUPROP")
				}, {
					"text": this.getResourceBundle().getText("S1TABLEORTYPECOL"),
					"path": this.getResourceBundle().getText("S1FLTODRTYPEPROP")
				}, {
					"text": this.getResourceBundle().getText("S1TABLESLOTIDCOL"),
					"path": this.getResourceBundle().getText("S1FLTREGNPROP")
				}, {
					"text": this.getResourceBundle().getText("S1TABLEREVQTRCOL"),
					"path": this.getResourceBundle().getText("S1FLTBOKQTERPROP")
				}]
			};
			var ColData = this.getJSONModel(columndata);
			this._oDialog.setModel(ColData);
			this._oDialog.open();
		},
		/**
		 * This method is to handles press event of 'In Current Status' Field value link.
		 * @name handleStatusLinkPress
		 * @param oEvent- Holds the current event
		 * @returns
		 */
		handleStatusLinkPress: function(oEvent) {
			var AprvHistrySet, lineData, processType;
			(_that.getView().byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).getType() === this.getResourceBundle().getText(
				"S1EMPBTNTYP_TXT")) ? (processType = this.getResourceBundle().getText("S2ICONTABPSRTEXT")) : ((_that.getView().byId(com.amat.crm.opportunity
				.Ids.FILTER_HDR_PDCBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) ? (processType = this.getResourceBundle()
				.getText("S2ICONTABPDCTEXT")) : ((_that.getView().byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).getType() === this.getResourceBundle()
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				//.getText("S1EMPBTNTYP_TXT")) ? (processType = this.getResourceBundle().getText("S2ICONTABCBCTXT")) : ("")));
				.getText("S1EMPBTNTYP_TXT")) ? (processType = this.getResourceBundle().getText("S2ICONTABCBCTXT")) : ((_that.getView().byId(com.amat.crm.opportunity
				.Ids.FILTER_HDR_ESABTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT"))?(processType = this.getResourceBundle().getText(
				"S1ESAIDSPROSTYPTXT")):(""))));
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
			lineData = oEvent.getSource().getBindingContext().getModel().getData().results[oEvent.getSource().getBindingContext().sPath.split(
				"/")[oEvent.getSource().getBindingContext().sPath.split("/").length - 1]];
			var Guid = lineData.Guid;
			var ItemGuid = lineData.ItemGuid;
			var sBaseUrl = window.location.origin;
			var sServiceUrl = sBaseUrl + com.amat.crm.opportunity.util.ServiceConfigConstants.getMyOpportunityInfoURL;
			var model = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
			var path = "AprvHistrySet?$filter=Guid eq guid'" + Guid + "' and ItemGuid eq guid'" + ItemGuid + "' and AprType eq '" + processType +
				"'";
			model.read(path, null, null, false, function(oData, oResponse) {
				AprvHistrySet = oData;
			}, function(value) {
				_that.showToastMessage(JSON.parse(oResponce.response.body).error.message.value)
			});
			this._oDialog = new sap.ui.xmlfragment('com.amat.crm.opportunity.view.fragments.AprHistoryPopOver', this);
			var oModel1 = this.getJSONModel(AprvHistrySet);
			this._oDialog.setModel(oModel1);
			this.getCurrentView().addDependent(this._oDialog);
			var param = oEvent.getSource();
			this._oDialog.openBy(param);
		},
		/**
		 * This method is to handles PSR, PDC, CBC Multiple Select Dialog F4 help.
		 * @name handlePSRValueHelpOpp
		 * @param oEvent- Holds the current event
		 * @returns
		 */
		handlePSRValueHelpOpp: function(oEvent) {
			this._oDialog = this._createIndependentDialog(this, this.getResourceBundle().getText("OppSearch_OppF4Fragment"));
			var oModel = this.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getModel();
			var key = this.setTitle(this.getResourceBundle(), oEvent, this._oDialog);
			var DialogList = this.sagregateModel(this.getResourceBundle(), oModel, key);
			//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
			var results = [];
			for(var i=0;i<DialogList.length;i++){
			   var obj = {};
			   obj.keyVal = DialogList[i].OppId;
			   obj.keyDes = "";
			   results.push(obj);
			}
			DialogList.results = results;
			//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
			var oModel1 = this.getJSONModel(DialogList);
			this._oDialog.setModel(oModel1);
			var bMultiSelect = !!oEvent.getSource().data(this.getResourceBundle().getText("S1MULTITEXT"));
			this._oDialog.setMultiSelect(bMultiSelect);
			this._oDialog.open();
		},
		//************************Start Of PCR019492: ASC606 UI Changes**************
		/**
		 * This method is to handles Table columns functionality.
		 * @name onDynamicColStyle
		 * @param viewType - Type of View
		 * @returns
		 */
		onDynamicColStyle : function(viewType){
			var oViewS1 = _that.getView();
			var oResource = this.getResourceBundle();
			if(viewType !== oResource.getText("S1DFTBTNTYP_TXT")){
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_OPPBU_COLUMN).setStyleClass("customColumn0");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PRODLN_COLUMN).setStyleClass("customColumn1");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PRODUCT_COLUMN).setStyleClass("customColumn5");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ITEMCAT_COLUMN).setStyleClass("customColumn6");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_SDALBL_COLUMN).setStyleClass("customColumn7");
			    oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_RGN_COLUMN).setStyleClass("");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_BOOKQTR_COLUMN).setStyleClass("customColumn8");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_STAT_COLUMN).setStyleClass("");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_REVQ_COLUMN).setStyleClass("customColumn9");
				switch (viewType) {
				case oResource.getText("S2ICONTABPSRTEXT"):
					oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRSTAT_COLUMN).setStyleClass("customColumn2");
					oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRCURRSTAT_COLUMN).setStyleClass("customColumn10");
					oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRTYP_COLUMN).setStyleClass("customColumn4");
					break;
				case oResource.getText("S2ICONTABPDCTEXT"):
					oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCSTAT_COLUMN).setStyleClass("customColumn2");
					oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCCURRSTAT_COLUMN).setStyleClass("customColumn10");
					break;
				case oResource.getText("S2ICONTABCBCTXT"):
					oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCSTAT_COLUMN).setStyleClass("customColumn2");
					oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCCURRSTAT_COLUMN).setStyleClass("customColumn10");
					oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCTYP_COLUMN).setStyleClass("customColumn4");
					break;
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				case this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT"):
					oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESASTAT_COLUMN).setStyleClass("customColumn2");
					oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESACURRSTAT_COLUMN).setStyleClass("customColumn10");
					break;	
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				}
			} else {
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_OPPBU_COLUMN).setStyleClass("customColumn0Rev");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PRODLN_COLUMN).setStyleClass("customColumn1Rev");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PRODUCT_COLUMN).setStyleClass("customColumn5Rev");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ITEMCAT_COLUMN).setStyleClass("customColumn6Rev");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_SDALBL_COLUMN).setStyleClass("customColumn7Rev");
			    oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_RGN_COLUMN).setStyleClass("sapUiTabRPad");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_BOOKQTR_COLUMN).setStyleClass("sapUiTabPad");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_STAT_COLUMN).setStyleClass("sapUiTabPad");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_REVQ_COLUMN).setStyleClass("");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRSTAT_COLUMN).setStyleClass("customColumn2Rev");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRCURRSTAT_COLUMN).setStyleClass("customColumn10Rev");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PSRTYP_COLUMN).setStyleClass("customColumn4Rev");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCSTAT_COLUMN).setStyleClass("customColumn2Rev");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_PDCCURRSTAT_COLUMN).setStyleClass("customColumn10Rev");
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESASTAT_COLUMN).setStyleClass("customColumn2Rev");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_ESACURRSTAT_COLUMN).setStyleClass("customColumn10Rev");
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCSTAT_COLUMN).setStyleClass("customColumn2Rev");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCCURRSTAT_COLUMN).setStyleClass("customColumn10Rev");
				oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TMP_CBCTYP_COLUMN).setStyleClass("customColumn4Rev");
			}
		},
		//************************End Of PCR019492: ASC606 UI Changes**************
		//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
		/**
		 * This method is to handles ESA/IDE Button Event.
		 * @name onPressESAIDE
		 * @param 
		 * @returns
		 */
		onPressESAIDE: function() {
			var oViewS1 = _that.getView();
			_that.typ = this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT");
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).setType(this.getResourceBundle().getText("S1EMPBTNTYP_TXT"));
			this.handleLinkPress();
			var ESAView = {
				"LOWHBSearchVis": true,                                                                                                                             //PCR028711++; modified visibility false to true
				"VCProdDesHBSearchVis": false,                                                                                                                      //PCR028711++; modified visibility true to false
				"FilterStatHBSearchVis": true,
				"PSRStatHBSearchVis": false,
				"PDCStatHBSearchVis": false,
				"CBCStatHBSearchVis": false,
				"ESAStatHBSearchVis": true,
				"FilterTypHBSearchVis": false,
				"PSRTypHBSearchVis": false,
				"CBCTypHBSearchVis": false,
				"TabGLBSearchVis": false,
				"TabShowAllBtnVis": oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0 ? true : false,                               //PCR028711++; modified true to Condition
				"TabFilterBtnVis": true,
				//"LOW_LBSearchtxt": this.getResourceBundle().getText("OppSearch_VCPRDDISDialogTitle"),                                                             //PCR028711--
				"LOW_LBSearchtxt": this.getResourceBundle().getText("S1LOWLBL"),                                                                                    //PCR028711++; modified label Text
				"PSRStatSearchTxt": this.getResourceBundle().getText("S1ESAIDSSRCHTABCOLTIT"),
				"OppDownloadVis": oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0 ? true : false                                  //PCR028711++; inserted Download Button visibility
			};
			var ESAFilterData = this.getJSONModel(ESAView);
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_SFORM).setModel(ESAFilterData);
			oViewS1.byId(com.amat.crm.opportunity.Ids.OPPRTUNITY_TABLE).setModel(ESAFilterData);
			//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************				
			this._showHideFilterBtns(true);
			oViewS1.byId(com.amat.crm.opportunity.Ids.S1HDRREFRESHBTN).setVisible(true);
			this._searchFormEnabler(false);
			//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1SRHTABESAIDSSTATCOLPROPTXT"), sap.ui.model.FilterOperator.NE, "");
			var oTable1 = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
			var itemBinding = oTable1.getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
			itemBinding.filter(oFilter);
			this.onDynamicColStyle(this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT"));
			this._setParamSearch();                                                                                                                                 //PCR028711++; persist search criteria
			this._showHidetabOps();                                                                                                                                 //PCR028711++; show/hide table Buttons
		},
		//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
		/**
		 * This method is to handles PSR-SDA Button Event.
		 * @name onPressPSRSDA
		 * @param 
		 * @returns
		 */
		onPressPSRSDA: function() {
			var oViewS1 = _that.getView();
			_that.typ = this.getResourceBundle().getText("S2ICONTABPSRTEXT");
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).setType(this.getResourceBundle().getText("S1EMPBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));                              //PCR023905++
			this.handleLinkPress();
			var PSRSDAView = {
				"LOWHBSearchVis": true,                                                                                                                             //PCR028711++; modified visibility false to true
				"VCProdDesHBSearchVis": false,                                                                                                                      //PCR028711++; modified visibility true to false
				"FilterStatHBSearchVis": true,
				"PSRStatHBSearchVis": true,
				"PDCStatHBSearchVis": false,
				"CBCStatHBSearchVis": false,
				"ESAStatHBSearchVis": false,                                                                                                                        //PCR023905++
				"FilterTypHBSearchVis": true,
				"PSRTypHBSearchVis": true,
				"CBCTypHBSearchVis": false,
				"TabGLBSearchVis": false,
				"TabShowAllBtnVis": oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0 ? true : false,                               //PCR028711++; modified true to Condition
				"TabFilterBtnVis": true,
				//"LOW_LBSearchtxt": this.getResourceBundle().getText("OppSearch_VCPRDDISDialogTitle"),                                                             //PCR028711--
				"LOW_LBSearchtxt": this.getResourceBundle().getText("S1LOWLBL"),                                                                                    //PCR028711++; modified label
				"PSRStatSearchTxt": this.getResourceBundle().getText("S1PDCSDASTATLB_TXT"),                                                                         //PCR019492++
				"PSRTypSearchTxt": this.getResourceBundle().getText("S1PSRPDCCBCTYPLBL"),
				"OppDownloadVis": oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0 ? true : false                                  //PCR028711++; inserted Download Button visibility
			};
			var PSRFilterData = this.getJSONModel(PSRSDAView);
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_SFORM).setModel(PSRFilterData);
			oViewS1.byId(com.amat.crm.opportunity.Ids.OPPRTUNITY_TABLE).setModel(PSRFilterData);	
			//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************				
			this._showHideFilterBtns(true);
			oViewS1.byId(com.amat.crm.opportunity.Ids.S1HDRREFRESHBTN).setVisible(true);
			this._searchFormEnabler(false);
			//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.Contains, this.getResourceBundle()
				.getText("S1SBUBUPLB_TXT"));
			oFilter[1] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.Contains, this.getResourceBundle()
				.getText("S1VSEBUPLB_TXT"));
			oFilter[2] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.NE, this.getResourceBundle()
				.getText("S2ICONTABPDCTEXT"));
			oFilter[3] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPSRSTATPROP"), sap.ui.model.FilterOperator.NE, "");
			var oTable1 = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
			var itemBinding = oTable1.getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
			itemBinding.filter(oFilter);
			this.onDynamicColStyle(this.getResourceBundle().getText("S2ICONTABPSRTEXT"));                                                                           //PCR019492++
			this._setParamSearch();                                                                                                                                 //PCR028711++; persist search criteria
			this._showHidetabOps();                                                                                                                                 //PCR028711++; show/hide table Buttons
		},
		/**
		 * This method is to handles PDC-SDA Button Event.
		 * @name onPressPDCSDA
		 * @param 
		 * @returns
		 */
		onPressPDCSDA: function() {
			var oViewS1 = _that.getView();
			_that.typ = this.getResourceBundle().getText("S2ICONTABPDCTEXT");
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).setType(this.getResourceBundle().getText("S1EMPBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));                             //PCR023905++
			this.handleLinkPress();
			var PDCSDAView = {
				"LOWHBSearchVis": true,                                                                                                                             //PCR028711++; modified visibility false to true
				"VCProdDesHBSearchVis": false,                                                                                                                      //PCR028711++; modified visibility true to false
				"FilterStatHBSearchVis": true,
				"PSRStatHBSearchVis": false,
				"PDCStatHBSearchVis": true,
				"CBCStatHBSearchVis": false,
				"ESAStatHBSearchVis": false,                                                                                                                        //PCR023905++
				"FilterTypHBSearchVis": false,
				"PSRTypHBSearchVis": false,
				"CBCTypHBSearchVis": false,
				"TabGLBSearchVis": false,
				"TabShowAllBtnVis": oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0 ? true : false,                               //PCR028711++; modified true to Condition
				"TabFilterBtnVis": true,
				//"LOW_LBSearchtxt": this.getResourceBundle().getText("OppSearch_VCPRDDISDialogTitle"),                                                             //PCR028711--
				"LOW_LBSearchtxt": this.getResourceBundle().getText("S1LOWLBL"),                                                                                    //PCR028711++; modified label
				"PSRStatSearchTxt": this.getResourceBundle().getText("S1PSRSTATLB_TXT"),
				"OppDownloadVis": oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0 ? true : false                                  //PCR028711++; inserted Download Button visibility
			};
			var PSRFilterData = this.getJSONModel(PDCSDAView);
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_SFORM).setModel(PSRFilterData);
			oViewS1.byId(com.amat.crm.opportunity.Ids.OPPRTUNITY_TABLE).setModel(PSRFilterData);
			//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************				
			this._showHideFilterBtns(true);
			oViewS1.byId(com.amat.crm.opportunity.Ids.S1HDRREFRESHBTN).setVisible(true);
			this._searchFormEnabler(false);
			//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.Contains, this.getResourceBundle()
				.getText("S2ICONTABPDCTEXT"));
			oFilter[1] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPDCSTATPROP"), sap.ui.model.FilterOperator.NE, "");
			var oTable1 = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
			var itemBinding = oTable1.getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
			itemBinding.filter(oFilter);
			this.onDynamicColStyle(this.getResourceBundle().getText("S2ICONTABPDCTEXT"));                                                                          //PCR019492++
			this._setParamSearch();                                                                                                                                //PCR028711++; persist search criteria
			this._showHidetabOps();                                                                                                                                //PCR028711++; show/hide table Buttons
		},
		/**
		 * This method is to handles CBC Button Event.
		 * @name onPressCBC
		 * @param 
		 * @returns
		 */
		onPressCBC: function() {
			var oViewS1 = _that.getView();
			_that.typ = this.getResourceBundle().getText("S2ICONTABCBCTXT");
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).setType(this.getResourceBundle().getText("S1EMPBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));                              //PCR023905++
			this.handleLinkPress();
			var CBCSDAView = {
				"LOWHBSearchVis": true,                                                                                                                             //PCR028711++; modified visibility false to true
				"VCProdDesHBSearchVis": false,                                                                                                                      //PCR028711++; modified visibility true to false
				"FilterStatHBSearchVis": true,
				"PSRStatHBSearchVis": false,
				"PDCStatHBSearchVis": false,
				"CBCStatHBSearchVis": true,
				"ESAStatHBSearchVis": false,                                                                                                                        //PCR023905++
				"FilterTypHBSearchVis": true,
				"PSRTypHBSearchVis": false,
				"CBCTypHBSearchVis": true,
				"TabGLBSearchVis": false,
				"TabShowAllBtnVis": oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0 ? true : false,                               //PCR028711++; modified true to Condition
				"TabFilterBtnVis": true,
				//"LOW_LBSearchtxt": this.getResourceBundle().getText("OppSearch_VCPRDDISDialogTitle"),                                                             //PCR028711--
				"LOW_LBSearchtxt": this.getResourceBundle().getText("S1LOWLBL"),                                                                                    //PCR028711++; modified label
				"PSRStatSearchTxt": this.getResourceBundle().getText("OppSearch_CBCSTATDialogTitle"),
				"PSRTypSearchTxt": this.getResourceBundle().getText("OppSearch_CBCVERDialogTitle"),
				"OppDownloadVis": oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0 ? true : false                                  //PCR028711++; inserted Download Button visibility
			};
			var PSRFilterData = this.getJSONModel(CBCSDAView);
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_SFORM).setModel(PSRFilterData);
			oViewS1.byId(com.amat.crm.opportunity.Ids.OPPRTUNITY_TABLE).setModel(PSRFilterData);	
			//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************				
			this._showHideFilterBtns(true);
			oViewS1.byId(com.amat.crm.opportunity.Ids.S1HDRREFRESHBTN).setVisible(true);
			this._searchFormEnabler(false);
			//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTCBCSTATPROP"), sap.ui.model.FilterOperator.NE, "");
			var oTable1 = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
			var itemBinding = oTable1.getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
			itemBinding.filter(oFilter);
			this.onDynamicColStyle(this.getResourceBundle().getText("S2ICONTABCBCTXT"));                                                                            //PCR019492++
			this._setParamSearch();                                                                                                                                 //PCR028711++; persist search criteria
			this._showHidetabOps();                                                                                                                                 //PCR028711++; show/hide table Buttons
		},
		/**
		 * This method is to handles Opportunity Multiple Filter Dialog "Confirm" button event.
		 * @name handleConfirm
		 * @param 
		 * @returns
		 */
		handleConfirm: function(oEvent) {
			if (oEvent.getParameters().filterString) {
				sap.m.MessageToast.show(oEvent.getParameters().filterString);
			}
		},
		/**
		 * This method is to handles Opportunity Master Table setting configurations "Ok" button event.
		 * @name handleOK
		 * @param 
		 * @returns
		 */
		handleOK: function() {
			this.destroyDialog();
		},
		/**
		 * This method is to handles Personalize filter "Save" button event.
		 * @name handleSaveFilter
		 * @param 
		 * @returns
		 */
		handleSaveFilter: function() {
			var myBusyDialog = this.getBusyDialog();
			myBusyDialog.open();
			var DialogItems = this._oDialog.getContent()[0].getItems();
			var filterRecord = [];
			var filterAllRecord = [];
			var n = 0,
				m = 0;
			for (var i = 0; i < DialogItems.length; i++) {
				for (var j = 0; j <= DialogItems[i].getContent().length - 1; j++) {
					//if ((j === 0 && i === 0) || (j === 0 && i === 1) || (j === 0 && i === 5) || (j === 0 && i === 6)) {                                       //PCR022138--
					if ((j === 0 && i === 0) || (j === 0 && i === 1) || (j === 4 && i === 6) || (j === 4 && i === 7) ||                                         //PCR022138++
							(j === 2 && i === 5) || (j === 3 && i === 5) || (j === 4 && i === 5)) {                                                             //PCR022138++
						continue;
					} else if (DialogItems[i].getContent()[j].getSelected() === true) {
						var item = {};
						switch (i) {
							case 0:
								item.title = DialogItems[i].getContent()[0].getText();
								break;
							case 1:
								item.title = DialogItems[i].getContent()[0].getText();
								break;
							case 2:
								item.title = DialogItems[1].getContent()[0].getText();
								break;
							case 3:
								item.title = DialogItems[1].getContent()[0].getText();
								break;
							case 4:
								item.title = DialogItems[1].getContent()[0].getText();
								break;
							//*************Start Of PCR022138++: 4571: Q2C New SPG re-org divisions***************
							case 5:
							//	item.title = DialogItems[i].getContent()[0].getText();
								item.title = DialogItems[1].getContent()[0].getText();
								break;
							case 6:
							//	item.title = DialogItems[i].getContent()[0].getText();
								item.title = DialogItems[i-1].getContent()[i-2].getText();
								break;
							case 7:
							//	item.title = DialogItems[6].getContent()[0].getText();
								item.title = DialogItems[i-1].getContent()[i-3].getText();
								break;
							case 8:
								item.title = DialogItems[i-2].getContent()[i-4].getText();
								break;
							//*************End Of PCR022138++: 4571: Q2C New SPG re-org divisions***************
						}
						if (item.title === this.getResourceBundle().getText("S1PERDLOGBUVWTITLE")) {
							item.text = DialogItems[i].getContent()[j].getTooltip();
						} else {
							item.text = DialogItems[i].getContent()[j].getText()
						}
						item.selected = DialogItems[i].getContent()[j].getSelected()
						filterRecord[n] = item;
						filterAllRecord[m] = item;
						n++;
						m++;
					} else if (DialogItems[i].getContent()[j].getSelected() === false) {
						if (DialogItems[i].getContent()[j].getText() !== "") {
							var item = {};
							switch (i) {
								case 0:
									item.title = DialogItems[i].getContent()[0].getText();
									break;
								case 1:
									item.title = DialogItems[i].getContent()[0].getText();
									break;
								case 2:
									item.title = DialogItems[1].getContent()[0].getText();
									break;
								case 3:
									item.title = DialogItems[1].getContent()[0].getText();
									break;
								case 4:
									item.title = DialogItems[1].getContent()[0].getText();
									break;
								//*************Start Of PCR022138++: 4571: Q2C New SPG re-org divisions***************
								case 5:
								//	item.title = DialogItems[i].getContent()[0].getText();
									item.title = DialogItems[1].getContent()[0].getText();
									break;
								case 6:
								//	item.title = DialogItems[i].getContent()[0].getText();
									item.title = DialogItems[i-1].getContent()[i-2].getText();
									break;
								case 7:
								//	item.title = DialogItems[6].getContent()[0].getText();
									item.title = DialogItems[i-1].getContent()[i-3].getText();
									break;
								case 8:
									item.title =  DialogItems[i-2].getContent()[i-4].getText();
									break;
								//*************End Of PCR022138++: 4571: Q2C New SPG re-org divisions***************
							}
							if (item.title === this.getResourceBundle().getText("S1PERDLOGBUVWTITLE")) {
								item.text = DialogItems[i].getContent()[j].getTooltip();
							} else {
								item.text = DialogItems[i].getContent()[j].getText();
							}
							item.selected = DialogItems[i].getContent()[j].getSelected();
							filterAllRecord[m] = item;
							m++;
						}
					}
				}
			}
			_that.handleLinkPress(this.getResourceBundle().getText("S1RIGHTTEXT"));                                                                              //PCR022138++
			_that.setFilter(filterRecord, filterAllRecord);
			myBusyDialog.close();
		},
		/**
		 * This method is to handles Personalize filter "Cancel" button event.
		 * @name handleCancel
		 * @param 
		 * @returns
		 */

		handleCancel: function() {
			this.destroyDialog();
		},

		/**
		 * This method is used to handles Personalize filter settings save functionality.
		 * @name setFilter
		 * @param filterRecord - personalize filter properties, filterAllRecord - personalize all filter properties
		 * @returns
		 */
		setFilter: function(filterRecord, filterAllRecord) {
			var myBusyDialog = this.getBusyDialog();
			myBusyDialog.open();
			this.byId(com.amat.crm.opportunity.Ids.TAB_HDR_PERSONALIZE_BTN).removeStyleClass(this.getResourceBundle().getText("S1PERDLOGBUCLS"));
			this.byId(com.amat.crm.opportunity.Ids.TAB_HDR_PERSONALIZE_BTN).addStyleClass(this.getResourceBundle().getText("S1PERDLOGDFTCLS"));
			var oFilter = [];
			for (var i = 0, n = 0; i < filterRecord.length; i++) {
				var oFilterCollection = [];
				//if (filterRecord[i].title === this.getResourceBundle().getText("S1PERDLOGSSTGODTITLE")) {                                                        //PCR022138--
				if (filterRecord[i].title === this.getResourceBundle().getText("S1PERDLOGSSTGVWTITLE")) {                                                          //PCR022138++
					if (filterRecord[i].text === "Commit") {
						oFilter[n] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1PERDLOGSSTGVWPROPTITLE"), sap.ui.model.FilterOperator.EQ,
							filterRecord[i].text);
					} else {
						oFilter[n] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1PERDLOGSSTGVWPROPTITLE"), sap.ui.model.FilterOperator.Contains,
							filterRecord[i].text);
					}

				} else if (filterRecord[i].title === this.getResourceBundle().getText("S1PERDLOGBUVWTITLE")) {
					oFilter[i] = new sap.ui.model.Filter("Bu", sap.ui.model.FilterOperator.Contains, filterRecord[i].text);
					this.byId(com.amat.crm.opportunity.Ids.TAB_HDR_PERSONALIZE_BTN).removeStyleClass(this.getResourceBundle().getText(
						"S1PERDLOGDFTCLS"));
					this.byId(com.amat.crm.opportunity.Ids.TAB_HDR_PERSONALIZE_BTN).addStyleClass(this.getResourceBundle().getText("S1PERDLOGBUCLS"));
				//} else if (filterRecord[i].title === this.getResourceBundle().getText("S1PERDLOGBQTRODTITLE")) {                                                  //PCR022138--
				} else if (filterRecord[i].title === this.getResourceBundle().getText("S1PERDLOGBQTRVWTITLE")) {                                                    //PCR022138++	
					oFilter[i] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1PERDLOGBQTRVWPROPTITLE"), sap.ui.model.FilterOperator.Contains,
						filterRecord[i].text);
				} else {
					oFilter[i] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1PERDLOGRGNVWTITLE"), sap.ui.model.FilterOperator.Contains,
						filterRecord[i].text);
				}
				oFilterCollection[n] = oFilter[i];
				n++;
			}
			var changeSet = [];
			var payload = {};
			for (var i = 0; i < filterAllRecord.length; i++) {
				var entityValue = {};
				var SelectedText;
				if (filterAllRecord[i].title === this.getResourceBundle().getText("S1PERDLOGSSTGVWTITLE")) {
					filterAllRecord[i].title = this.getResourceBundle().getText("S1PERDLOGSSTGODTITLE");
				} else if (filterAllRecord[i].title === this.getResourceBundle().getText("S1PERDLOGRGNVWTITLE")) {
					filterAllRecord[i].title = this.getResourceBundle().getText("S1PERDLOGRGNODTITLE");
				} else if (filterAllRecord[i].title === this.getResourceBundle().getText("S1PERDLOGBQTRVWTITLE")) {
					filterAllRecord[i].title = this.getResourceBundle().getText("S1PERDLOGBQTRODTITLE");
				}
				entityValue.FilterField = filterAllRecord[i].title;
				entityValue.FilterVal = filterAllRecord[i].text;
				if (filterAllRecord[i].selected === true) {
					SelectedText = this.getResourceBundle().getText("S1TABLESALESTAGECOL");
				} else {
					SelectedText = "";
				}
				entityValue.DefaultChk = SelectedText;
				changeSet.push(entityValue);
			}
			payload.FilterField = this.getResourceBundle().getText("S1TABLESALESTAGECOL");
			payload.NAV_PERSONALIZE = changeSet;
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PerlzeFilterHdSet, com.amat.crm.opportunity.util.ServiceConfigConstants
				.write, payload, this.getResourceBundle().getText("S1PERZATIONPOSMSG"));
			//this.onPressAllRead();                                                                                                                          //PCR022669++;PCR025717--
			var oTable1 = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);                                                                 //PCR022669--;PCR025717++
			var itemBinding = oTable1.getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));                                                         //PCR022669--;PCR025717++
			itemBinding.filter(oFilter);                                                                                                                      //PCR022669--;PCR025717++
			this._oDialog.destroy();
			myBusyDialog.close();
		},
		/**
		 * This method is used to navigate to S2 view.
		 * @name onOppressed
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onOppressed: function(oEvent) {
			var myBusyDialog = this.getBusyDialog();
			myBusyDialog.open();
			var context = oEvent.getSource().getBindingContext().getObject();
			//************************Start Of PCR022669: Q2C Q2 UI Changes**************
			if(this.getOwnerComponent().Guid !== undefined ||	this.getOwnerComponent().ItemGuid !== undefined){
				this.getOwnerComponent().Guid = undefined;
				this.getOwnerComponent().ItemGuid = undefined;
			}
			this.getOwnerComponent().Guid = context.Guid;
			this.getOwnerComponent().ItemGuid = context.ItemGuid;
			this.getOwnerComponent().context = context;
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C**************
			var oResource = this.getResourceBundle(),
			    ServiceConfig = com.amat.crm.opportunity.util.ServiceConfigConstants;
			if(this.getModelFromCore(oResource.getText("S1DISBUSETMODEL")) === undefined){
				this.serviceDisCall(ServiceConfig.DisBuSet,  ServiceConfig.read, "", "");
			}
			var DisBuData = this.getModelFromCore(oResource.getText("S1DISBUSETMODEL")).getData().results;
			var result = DisBuData.filter(function(obj) {
				  return obj[oResource.getText("S1BUTEXT")] === context.Bu;
				});
			context.disFlag = result.length === 0 ? "" : oResource.getText("S1TABLESALESTAGECOL");
			this.getModelFromCore(oResource.getText("S1DISBUSETMODEL")).getData().disFlag = context.disFlag;                                                  //PCR033306++
			if(context.disFlag === oResource.getText("S1TABLESALESTAGECOL")){
				this.getRouter().navTo(oResource.getText("S1DISROUTGTTXT"), {});
				var oControllerS4 = this.getOwnerComponent().s4.getController();
				oControllerS4.fromURL(oResource.getText("S2PSRDETERMINDFTPARAM"));
			} else {							
			//************************End Of PCR026243: DL:1803 Display Migration to Q2C**************
			//var oppDetails = new sap.ui.model.json.JSONModel();
			//var oppDetailsData = {};
			//oppDetailsData.CustName = context.CustName;
			//oppDetailsData.FabName = context.FabName;
			//oppDetailsData.OppId = context.OppId;
			//oppDetailsData.ItemNo = context.ItemNo.toString();
			//oppDetailsData.SlotNo = context.SlotNo;
			//oppDetailsData.VcPrdid = context.VcPrdid;
			//oppDetailsData.Pbg = context.Pbg;
			//oppDetailsData.Kpu = context.Kpu;
			//oppDetails.setData(oppDetailsData);
			//var sValidate = "GenralInfoSet(Guid=guid'" + context.Guid + "',ItemGuid=guid'" + context.ItemGuid +
			//	"')?$expand=NAV_ASM_INFO,NAV_BMHEAD_INFO,NAV_BMO_INFO,NAV_BSM_INFO,NAV_CON_INFO,NAV_GPM_INFO,NAV_GSM_INFO,NAV_KPU_INFO,NAV_PM_INFO,NAV_POM_INFO,NAV_RBM_INFO,NAV_ROM_INFO,NAV_SALES_INFO,NAV_TPS_INFO,NAV_TRANS_HISTORY"
			//this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			this.getRouter().navTo(this.getResourceBundle().getText("S2DISOPPDETROUT"), {});
			//var oControllerS2 = sap.ui.getCore().byId(this.getResourceBundle().getText("S1VWToS2")).getController();
			var oControllerS2 = this.getOwnerComponent().s2.getController();
			oControllerS2.fromURL(this.getResourceBundle().getText("S2PSRDETERMINDFTPARAM"));
			//oControllerS2.loadData(oppDetails, context);
			//************************End Of PCR022669: Q2C Q2 UI Changes**************
			}                                                                                                                                                    //PCR026243++
			myBusyDialog.close();
		},
		/**
		 * This method is used to handle search F4 help.
		 * @name handleValueHelpOpp
		 * @param temp - Array of filters
		 * @returns
		 */
		_getCurrentFilters: function() {
			var conditionArr = [],
				oFilter = [],
				obj, t = 0,
				temp = [];
			var oViewS1 = this.getView();
			(oViewS1.byId(com.amat.crm.opportunity.Ids.CUSTOMER_SEARCH).getValue() !== "") ? (obj = {
				value: oViewS1.byId(com.amat.crm.opportunity.Ids.CUSTOMER_SEARCH).getValue(),
				id: this.getResourceBundle().getText("S1FLTCUSTPROP")
			}, conditionArr[conditionArr.length] = obj, oFilter[t] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTCUSTPROP"),
				sap.ui.model.FilterOperator.Contains, oViewS1.byId(com.amat.crm.opportunity.Ids.CUSTOMER_SEARCH).getValue(), t++)) : ("");
			(oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_SEARCH).getValue() !== "") ? (obj = {
				value: oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_SEARCH).getValue(),
				id: this.getResourceBundle().getText("S1FLTOPPIDPROP")
			}, conditionArr[conditionArr.length] = obj, oFilter[t] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTOPPIDPROP"),
				sap.ui.model.FilterOperator.Contains, oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_SEARCH).getValue(), t++)) : ("");
			(oViewS1.byId(com.amat.crm.opportunity.Ids.AMAT_QUOTE_NO_SEARCH).getValue() !== "") ? (obj = {
				value: oViewS1.byId(com.amat.crm.opportunity.Ids.AMAT_QUOTE_NO_SEARCH).getValue(),
				id: this.getResourceBundle().getText("S1FLTAMATQUTIDPROP")
			}, conditionArr[conditionArr.length] = obj, oFilter[t] = new sap.ui.model.Filter(this.getResourceBundle().getText(
					"S1FLTAMATQUTIDPROP"), sap.ui.model.FilterOperator.Contains, oViewS1.byId(com.amat.crm.opportunity.Ids.AMAT_QUOTE_NO_SEARCH).getValue(),
				t++)) : ("");
			(oViewS1.byId(com.amat.crm.opportunity.Ids.SALES_ORDER_NO_SEARCH).getValue() !== "") ? (obj = {
				value: oViewS1.byId(com.amat.crm.opportunity.Ids.SALES_ORDER_NO_SEARCH).getValue(),
				id: this.getResourceBundle().getText("S1FLTSONOROP")
			}, conditionArr[conditionArr.length] = obj, oFilter[t] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTSONOROP"),
				sap.ui.model.FilterOperator.Contains, oViewS1.byId(com.amat.crm.opportunity.Ids.SALES_ORDER_NO_SEARCH).getValue(), t++)) : ("");
			(oViewS1.byId(com.amat.crm.opportunity.Ids.SLOT_ID_SEARCH).getValue() !== "") ? (obj = {
				value: oViewS1.byId(com.amat.crm.opportunity.Ids.SLOT_ID_SEARCH).getValue(),
				id: this.getResourceBundle().getText("S1FLTSLTNOPROP")
			}, conditionArr[conditionArr.length] = obj, oFilter[t] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTSLTNOPROP"),
				sap.ui.model.FilterOperator.Contains, oViewS1.byId(com.amat.crm.opportunity.Ids.SLOT_ID_SEARCH).getValue(), t++)) : ("");
			(oViewS1.byId(com.amat.crm.opportunity.Ids.LARGE_ORDER_SEARCH).getValue() !== "") ? (obj = {
				value: oViewS1.byId(com.amat.crm.opportunity.Ids.LARGE_ORDER_SEARCH).getValue(),
				id: this.getResourceBundle().getText("S1FLTLOWDESPROP")
			}, conditionArr[conditionArr.length] = obj, oFilter[t] = new sap.ui.model.Filter(this.getResourceBundle().getText(
					"S1FLTLOWDESPROP"), sap.ui.model.FilterOperator.Contains, oViewS1.byId(com.amat.crm.opportunity.Ids.LARGE_ORDER_SEARCH).getValue(),
				t++)) : ("");
			if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.Contains,
					this.getResourceBundle().getText("S1SBUBUPLB_TXT"));
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.Contains,
					this.getResourceBundle().getText("S1VSEBUPLB_TXT"));
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.NE,
					this.getResourceBundle().getText("S2ICONTABPDCTEXT"));
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPSRSTATPROP"), sap.ui.model.FilterOperator
					.NE, "");
			}
			if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.Contains,
					this.getResourceBundle().getText("S2ICONTABPDCTEXT"));
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPDCSTATPROP"), sap.ui.model.FilterOperator
					.NE, "");
			}
			if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTCBCSTATPROP"), sap.ui.model.FilterOperator
					.NE, "");
			}
			//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
			if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1SRHTABESAIDSSTATCOLPROPTXT"), sap.ui.model.
					FilterOperator.NE, "");
			}
			//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
			temp = [oFilter, conditionArr];
			return temp;
		},
		/**
		 * This method is used to handle search F4 help.
		 * @name handleValueHelpOpp
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
		/*handleValueHelpOpp: function(oEvent) {
			var TotalFltr = this._getCurrentFilters();
			var conditionArr = TotalFltr[1];
			this._oDialog = this._createIndependentDialog(this, this.getResourceBundle().getText("OppSearch_OppF4Fragment"));
			var table = this.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
			var itemBinding = table.getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
			itemBinding.filter(TotalFltr[0]);
			TotalFltr[0].length = 0;
			var FilterItem = itemBinding.aIndices;
			var tempArr = [],
				temp = "",
				depCondition = "",
				initialCon;
			for (var i = 0, n = 0; i < table.getModel().getData().results.length; i++) {
				for (var j = 0; j < FilterItem.length; j++) {
					initialCon = (i === FilterItem[j]);
					if (initialCon !== false) {
						if (conditionArr.length > 0) {
							for (var k = 0; k < conditionArr.length; k++) {
								conditionArr[k].id === this.getResourceBundle().getText("S1FLTCUSTPROP") ? temp = table.getModel().getData().results[i].CustName :
									"";
								conditionArr[k].id === this.getResourceBundle().getText("S1FLTOPPIDPROP") ? temp = table.getModel().getData().results[i].OppId :
									"";
								conditionArr[k].id === this.getResourceBundle().getText("S1FLTAMATQUTIDPROP") ? temp = table.getModel().getData().results[i].AmatQuoteId :
									"";
								conditionArr[k].id === this.getResourceBundle().getText("S1FLTSONOROP") ? temp = table.getModel().getData().results[i].SoNumber :
									"";
								conditionArr[k].id === this.getResourceBundle().getText("S1FLTSLTNOPROP") ? temp = table.getModel().getData().results[i].SlotNo :
									"";
								conditionArr[k].id === this.getResourceBundle().getText("S1FLTLOWDESPROP") ? temp = table.getModel().getData().results[i].LowDesc :
									"";
								if (k === 0) {
									depCondition = (temp === conditionArr[k].value);
								} else {
									depCondition = depCondition + (temp === conditionArr[k].value);
								}
								if (depCondition === false) {
									break;
								} else {
									TotalFltr[0][TotalFltr[0].length] = new sap.ui.model.Filter(conditionArr[k].id, sap.ui.model.FilterOperator.Contains,
										conditionArr[k].value);
								}
							}
						}
						(depCondition !== false) ? depCondition = initialCon: depCondition = false;
						if (depCondition) {
							tempArr[n] = table.getModel().getData().results[i];
							depCondition = "";
							n++;
						}
					}
				}
			}
			var oModel = this.getJSONModel({
				"results": tempArr
			});
			itemBinding.filter(TotalFltr[0]);
			var key = this.setTitle(this.getResourceBundle(), oEvent, this._oDialog);
			var DialogList = this.sagregateModel(this.getResourceBundle(), oModel, key);
			var oModel1 = this.getJSONModel(DialogList);
			this._oDialog.setModel(oModel1);
			this._oDialog.open();
		},
		/**
		 * This method is used to handle F4 help search functionality.
		 * @name _handleValueHelpSearchOpp
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		/*_handleValueHelpSearchOpp: function(oEvent) {
			var sValue = oEvent.getParameter(this.getResourceBundle().getText("S1VALUETEXT"));
			if (!sValue === "") {
				var oFilter = new sap.ui.model.Filter(this.getResourceBundle().getText("S2OPPAPPOPPIDKEY"), sap.ui.model.FilterOperator.Contains,
					sValue);
				var oBinding = oEvent.getSource().getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
				oBinding.filter([oFilter]);
			} else {
				var oTable1 = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
				var finalArr = {};
				finalArr = this.RemoveDuplicateWdKey(this._oDialog.getModel().getData(), this.getResourceBundle().getText("S1OPPIDKEYTEXT"));
				var objOppFilter = new sap.ui.model.Filter(this.getResourceBundle().getText("S2OPPAPPOPPIDKEY"), sap.ui.model.FilterOperator.Contains,
					sValue);
				this._oDialog.getBinding(this.getResourceBundle().getText("S1TABLELISTITM")).filter([objOppFilter]);
			}
		},
		/**
		 * This method is used to handle F4 help confirm & "close" button functionality.
		 * @name _handleValueHelpCloseOpp
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		/*_handleValueHelpCloseOpp: function(oEvent) {
			if(oEvent.getId() !== "cancel"){
				if(oEvent.getId() === "confirm" && oEvent.getParameters().selectedItems.length !== 0){
					var dialogTitle = oEvent.getSource().getTitle();
					var oResouceBundle = this.getResourceBundle();
					var IPOpp, count;
					switch (dialogTitle) {
						case oResouceBundle.getText("OppSearch_OppDialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_SEARCH);
							count = this.opp;
							break;
						case oResouceBundle.getText("OppSearch_CustDialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.CUSTOMER_SEARCH);
							count = this.cus;
							break;
						case oResouceBundle.getText("OppSearch_AMATQTENODialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.AMAT_QUOTE_NO_SEARCH);
							count = this.qot;
							break;
						case oResouceBundle.getText("OppSearch_SALEODRDialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.SALES_ORDER_NO_SEARCH);
							count = this.son;
							break;
						case oResouceBundle.getText("OppSearch_STIDLODialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.SLOT_ID_SEARCH);
							count = this.slt;
							break;
						case oResouceBundle.getText("OppSearch_LOWDialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.LARGE_ORDER_SEARCH);
							count = this.low;
							break;
						case oResouceBundle.getText("OppSearch_CUSTPODialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.CUSTOMER_PO_SEARCH);
							count = this.cstpo;
							break;
						case oResouceBundle.getText("OppSearch_VCPRDDISDialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.VC_PRDDIS_SEARCH);
							count = this.vcp;
							break;
						case oResouceBundle.getText("OppSearch_PSRSTATDialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.PSR_STAT_SEARCH);
							count = this.pstat;
							break;
						case oResouceBundle.getText("OppSearch_PDCSTATDialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.PDC_STAT_SEARCH);
							count = this.pdtat;
							break;
						//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
						case oResouceBundle.getText("S1SRHTABESAIDSSTATCOLTXT"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.ESA_STAT_SEARCH);
							count = this.estat;
							break;	
						//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
						case oResouceBundle.getText("OppSearch_CBCSTATDialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.CBC_STAT_SEARCH);
							count = this.cbtat;
							break;
						case oResouceBundle.getText("OppSearch_PSRTYPDialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.PSR_TYPE_SEARCH);
							count = this.pty;
							break;
						case oResouceBundle.getText("OppSearch_CBCVERDialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.CBC_VERSION_SEARCH);
							count = this.cvr;
							break;
						//*****************Start Of PCR019492: ASC606 UI Changes*********************
						case oResouceBundle.getText("OppSearch_RRALVLDialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.RRASDA_LVL_SEARCH);
							count = this.rra;
							break;
						case oResouceBundle.getText("OppSearch_BUDialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.BU_SEARCH);
							count = this.bu;
							break;
						case oResouceBundle.getText("OppSearch_BookQDialogTitle"):
							IPOpp = this.getView().byId(com.amat.crm.opportunity.Ids.BOOK_QTR_SEARCH);
							count = this.btr;
							break;
						//*****************End Of PCR019492: ASC606 UI Changes*********************
					}
					if (dialogTitle === oResouceBundle.getText("OppSearch_CUSTPODialogTitle") || dialogTitle === oResouceBundle.getText(
					      "OppSearch_PSRSTATDialogTitle") || dialogTitle === oResouceBundle.getText("OppSearch_PDCSTATDialogTitle") || dialogTitle ===
				          oResouceBundle.getText("OppSearch_CBCSTATDialogTitle") || dialogTitle === oResouceBundle.getText("OppSearch_PSRTYPDialogTitle") ||
				          dialogTitle === oResouceBundle.getText("OppSearch_RRALVLDialogTitle") || dialogTitle === oResouceBundle.getText("OppSearch_BUDialogTitle")||		   //PCR019492++		
				          //dialogTitle === oResouceBundle.getText("OppSearch_CBCVERDialogTitle")) {                                                                           //PCR019492--
				          dialogTitle === oResouceBundle.getText("OppSearch_BookQDialogTitle")|| dialogTitle === oResouceBundle.getText("OppSearch_CBCVERDialogTitle")         //PCR019492++
						  || dialogTitle === oResouceBundle.getText("S1SRHTABESAIDSSTATCOLTXT")) {                                                                             //PCR023905++
						var text = [],
							IPText = [];
						var fieldValues = [];
						var fields = oEvent.getParameter(oResouceBundle.getText("S1SELCONTXTTEXT"));
						var aContexts = [];
						for (var i = 0, j = 0; i < fields.length; i++, j++) {
							aContexts.push(fields[i])
							if (aContexts[i] !== undefined) {
								aContexts.map(function(oContext) {
									text[j] = oContext.getObject().OppId;
								})
								if (text[j]) {
									fieldValues[j] = text[j];
								}
							}
							IPText += fieldValues[j] + ",";
						}
						IPText = IPText.substring(0, IPText.length - 1);
						var chkCnt = _that.CheckCount();
						if (IPText && chkCnt <= this.cnt) {
							if (IPOpp.getValue() === "" && count === 0) {
								this.cnt = this.cnt + 1;
								switch (IPOpp.getId().split("_")[IPOpp.getId().split("_").length - 1]) {
									case oResouceBundle.getText("OppSearch_VCPRDDISKey"):
										this.vcp = this.vcp + 1;
										break;
									case oResouceBundle.getText("OppSearch_CUSTPOKey"):
										this.cstpo = this.cstpo + 1;
										break;
									case oResouceBundle.getText("OppSearch_PSRSTATKey"):
										this.pstat = this.pstat + 1;
										break;
									case oResouceBundle.getText("OppSearch_PDCSTATKey"):
										this.pdtat = this.pdtat + 1;
										break;
									case oResouceBundle.getText("OppSearch_CBCSTATKey"):
										this.cbtat = this.cbtat + 1;
										break;
									//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
									case oResouceBundle.getText("OppSearch_ESASTATKey"):
										this.estat = this.estat + 1;
										break;
									//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
									case oResouceBundle.getText("OppSearch_PSRTYPKey"):
										this.pty = this.pty + 1;
										break;
									case oResouceBundle.getText("OppSearch_CBCVERKey"):
										this.cvr = this.cvr + 1;
										break;
								    //*****************Start Of PCR019492: ASC606 UI Changes*********************
									case oResouceBundle.getText("OppSearch_RRALVLKey"):
										this.cvr = this.rra + 1;
										break;
									case oResouceBundle.getText("OppSearch_BUKey"):
										this.cvr = this.bu + 1;
										break;
									case oResouceBundle.getText("OppSearch_BookQKey"):
										this.cvr = this.btr + 1;
										break;
									//*****************End Of PCR019492: ASC606 UI Changes*********************
								}
							}
							this.getCurrentView().byId(com.amat.crm.opportunity.Ids.FILTER_BTN).setText(oResouceBundle.getText("S1FILTERFTSTR") + this.cnt +
								oResouceBundle.getText("S1FILTERSNDSTR"));
						}
						IPOpp.setValue(IPText);
						IPOpp.setTooltip(IPText);
					} else {
						var text;
						var aContexts = oEvent.getParameter(oResouceBundle.getText("S1SELCONTXTTEXT"));
						if (aContexts !== undefined) {
							aContexts.map(function(oContext) {
								text = oContext.getObject().OppId;
							})
							var chkCnt = _that.CheckCount();
							if (text && chkCnt <= this.cnt) {
								if (IPOpp.getValue() === "" && count === 0) {
									this.cnt = this.cnt + 1;
									switch (IPOpp.getId().split("_")[IPOpp.getId().split("_").length - 1]) {
										case oResouceBundle.getText("OppSearch_OppKey"):
											this.opp = this.opp + 1;
											break;
										case oResouceBundle.getText("OppSearch_CustKey"):
											this.cus = this.cus + 1;
											break;
										case oResouceBundle.getText("OppSearch_AMATQTENOKey"):
											this.qot = this.qot + 1;
											break;
										case oResouceBundle.getText("OppSearch_SALEODRKey"):
											this.son = this.son + 1;
											break;
										case oResouceBundle.getText("OppSearch_STIDLOKey"):
											this.slt = this.slt + 1;
											break;
										case oResouceBundle.getText("OppSearch_LOWKey"):
											this.low = this.low + 1;
											break;
									}
								}
								this.getCurrentView().byId(com.amat.crm.opportunity.Ids.FILTER_BTN).setText(this.getResourceBundle().getText("S1FILTERFTSTR") +
									this.cnt + this.getResourceBundle().getText("S1FILTERSNDSTR"));
							}
							IPOpp.setValue(text);
						}
						var TotalFltr = this._getCurrentFilters();
						var table = this.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
						var itemBinding = table.getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
						itemBinding.filter(TotalFltr[0]);
						this.getView().byId(com.amat.crm.opportunity.Ids.TAB_HDR_GLB_SEARCH).setValue("");
						this._oDialog.destroy();
					}
				}
			}			
		},*/
		//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************

		/**
		 * This method is used to handle search value change & search criteria count.
		 * @name onOppChange
		 * @param 
		 * @returns 
		 */
		onOppChange: function(OEvent) {
			var chkCnt = _that.CheckCount();
			var sId = OEvent.getParameters().id.split("--")[OEvent.getParameters().id.split("--").length - 1];
			if (chkCnt < this.cnt) {
				this.cnt = this.cnt - 1;
				if (this.getView().byId(sId).getValue() === "") {
					switch (sId) {
						case com.amat.crm.opportunity.Ids.OPPORTUNITY_SEARCH:
							this.opp = 0;
							break;
						case com.amat.crm.opportunity.Ids.CUSTOMER_SEARCH:
							this.cus = 0;
							break;
						case com.amat.crm.opportunity.Ids.AMAT_QUOTE_NO_SEARCH:
							this.qot = 0;
							break;
						case com.amat.crm.opportunity.Ids.SALES_ORDER_NO_SEARCH:
							this.son = 0;
							break;
						case com.amat.crm.opportunity.Ids.SLOT_ID_SEARCH:
							this.slt = 0;
							break;
						case com.amat.crm.opportunity.Ids.LARGE_ORDER_SEARCH:
							this.low = 0;
							break;
						case com.amat.crm.opportunity.Ids.CUSTOMER_PO_SEARCH:
							this.cstpo = 0;
							break;
						case com.amat.crm.opportunity.Ids.VC_PRDDIS_SEARCH:
							this.vcp = 0;
							break;
						case com.amat.crm.opportunity.Ids.PSR_STAT_SEARCH:
							this.pstat = 0;
							break;
						case com.amat.crm.opportunity.Ids.PDC_STAT_SEARCH:
							this.pdtat = 0;
							break;
						//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
						case com.amat.crm.opportunity.Ids.ESA_STAT_SEARCH:
							this.estat = 0;
							break;
						//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
						case com.amat.crm.opportunity.Ids.CBC_STAT_SEARCH:
							this.cbtat = 0;
							break;
						case com.amat.crm.opportunity.Ids.PSR_TYPE_SEARCH:
							this.pty = 0;
							break;
						case com.amat.crm.opportunity.Ids.CBC_VERSION_SEARCH:
							this.cvr = 0;
							break;
						//**************Start Of PCR019492: ASC606 UI Changes*******************
						//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
						/*case com.amat.crm.opportunity.Ids.RRASDA_LVL_SEARCH:
							this.rra = 0;
							break;*/
						//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
						case com.amat.crm.opportunity.Ids.BU_SEARCH:
							this.bu = 0;
							break;
						case com.amat.crm.opportunity.Ids.BOOK_QTR_SEARCH:
							this.btr = 0;
							break;
						//**************End Of PCR019492: ASC606 UI Changes*******************
					    //*****************Start Of PCR033306: Q2C Display Enhancements ***************************
						case com.amat.crm.opportunity.Ids.S1_DFTNO_SEARCH:
							this.dft = 0;
							break;
						//*****************End Of PCR033306: Q2C Display Enhancements *****************************
					}
				} else {
					switch (sId) {
						case com.amat.crm.opportunity.Ids.OPPORTUNITY_SEARCH:
							this.opp = 1;
							break;
						case com.amat.crm.opportunity.Ids.CUSTOMER_SEARCH:
							this.cus = 1;
							break;
						case com.amat.crm.opportunity.Ids.AMAT_QUOTE_NO_SEARCH:
							this.qot = 1;
							break;
						case com.amat.crm.opportunity.Ids.SALES_ORDER_NO_SEARCH:
							this.son = 1;
							break;
						case com.amat.crm.opportunity.Ids.SLOT_ID_SEARCH:
							this.slt = 1;
							break;
						case com.amat.crm.opportunity.Ids.LARGE_ORDER_SEARCH:
							this.low = 1;
							break;
						case com.amat.crm.opportunity.Ids.CUSTOMER_PO_SEARCH:
							this.cstpo = 1;
							break;
						case com.amat.crm.opportunity.Ids.VC_PRDDIS_SEARCH:
							this.vcp = 1;
							break;
						case com.amat.crm.opportunity.Ids.PSR_STAT_SEARCH:
							this.pstat = 1;
							break;
						case com.amat.crm.opportunity.Ids.PDC_STAT_SEARCH:
							this.pdtat = 1;
							break;
						//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
						case com.amat.crm.opportunity.Ids.ESA_STAT_SEARCH:
							this.estat = 1;
							break;
						//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
						case com.amat.crm.opportunity.Ids.CBC_STAT_SEARCH:
							this.cbtat = 1;
							break;
						case com.amat.crm.opportunity.Ids.PSR_TYPE_SEARCH:
							this.pty = 1;
							break;
						case com.amat.crm.opportunity.Ids.CBC_VERSION_SEARCH:
							this.cvr = 1;
							break;
						//**************Start Of PCR019492: ASC606 UI Changes*******************
						//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
						/*case com.amat.crm.opportunity.Ids.RRASDA_LVL_SEARCH:
							this.rra = 1;
							break;*/
						//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
						case com.amat.crm.opportunity.Ids.BU_SEARCH:
							this.bu = 1;
							break;
						case com.amat.crm.opportunity.Ids.BOOK_QTR_SEARCH:
							this.btr = 1;
							break;
						//**************End Of PCR019492: ASC606 UI Changes*******************
						//*****************Start Of PCR033306: Q2C Display Enhancements ***************************
						case com.amat.crm.opportunity.Ids.S1_DFTNO_SEARCH:
							this.dft = 1;
							break;
						//*****************End Of PCR033306: Q2C Display Enhancements *****************************
					}
				}
			} else if (chkCnt > this.cnt) {
				var count;
				switch (sId) {
					case com.amat.crm.opportunity.Ids.OPPORTUNITY_SEARCH:
						count = this.opp;
						break;
					case com.amat.crm.opportunity.Ids.CUSTOMER_SEARCH:
						count = this.cus;
						break;
					case com.amat.crm.opportunity.Ids.AMAT_QUOTE_NO_SEARCH:
						count = this.qot;
						break;
					case com.amat.crm.opportunity.Ids.SALES_ORDER_NO_SEARCH:
						count = this.son;
						break;
					case com.amat.crm.opportunity.Ids.SLOT_ID_SEARCH:
						count = this.slt;
						break;
					case com.amat.crm.opportunity.Ids.LARGE_ORDER_SEARCH:
						count = this.low;
						break;
					case com.amat.crm.opportunity.Ids.CUSTOMER_PO_SEARCH:
						count = this.cstpo;
						break;
					case com.amat.crm.opportunity.Ids.VC_PRDDIS_SEARCH:
						count = this.vcp;
						break;
					case com.amat.crm.opportunity.Ids.PSR_STAT_SEARCH:
						count = this.pstat;
						break;
					case com.amat.crm.opportunity.Ids.PDC_STAT_SEARCH:
						count = this.pdtat;
						break;
					//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
					case com.amat.crm.opportunity.Ids.ESA_STAT_SEARCH:
						count = this.estat;
						break;
					//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
					case com.amat.crm.opportunity.Ids.CBC_STAT_SEARCH:
						count = this.cbtat;
						break;
					case com.amat.crm.opportunity.Ids.PSR_TYPE_SEARCH:
						count = this.pty;
						break;
					case com.amat.crm.opportunity.Ids.CBC_VERSION_SEARCH:
						count = this.cvr;
						break;
					//**************Start Of PCR019492: ASC606 UI Changes*******************
					//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
					/*case com.amat.crm.opportunity.Ids.RRASDA_LVL_SEARCH:
						count = this.rra;
						break;*/
					//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
					case com.amat.crm.opportunity.Ids.BU_SEARCH:
						count = this.bu;
						break;
					case com.amat.crm.opportunity.Ids.BOOK_QTR_SEARCH:
						count = this.btr;
						break;
					//**************End Of PCR019492: ASC606 UI Changes*******************
					//*****************Start Of PCR033306: Q2C Display Enhancements ***************************
					case com.amat.crm.opportunity.Ids.S1_DFTNO_SEARCH:
						count = this.dft;
						break;
					//*****************End Of PCR033306: Q2C Display Enhancements *****************************
				}
				if (count === 0) {
					switch (sId) {
						case com.amat.crm.opportunity.Ids.OPPORTUNITY_SEARCH:
							this.opp = 1;
							break;
						case com.amat.crm.opportunity.Ids.CUSTOMER_SEARCH:
							this.cus = 1;
							break;
						case com.amat.crm.opportunity.Ids.AMAT_QUOTE_NO_SEARCH:
							this.qot = 1;
							break;
						case com.amat.crm.opportunity.Ids.SALES_ORDER_NO_SEARCH:
							this.son = 1;
							break;
						case com.amat.crm.opportunity.Ids.SLOT_ID_SEARCH:
							this.slt = 1;
							break;
						case com.amat.crm.opportunity.Ids.LARGE_ORDER_SEARCH:
							this.low = 1;
							break;
						case com.amat.crm.opportunity.Ids.CUSTOMER_PO_SEARCH:
							this.cstpo = 1;
							break;
						case com.amat.crm.opportunity.Ids.VC_PRDDIS_SEARCH:
							this.vcp = 1;
							break;
						case com.amat.crm.opportunity.Ids.PSR_STAT_SEARCH:
							this.pstat = 1;
							break;
						case com.amat.crm.opportunity.Ids.PDC_STAT_SEARCH:
							this.pdtat = 1;
							break;
						//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
						case com.amat.crm.opportunity.Ids.ESA_STAT_SEARCH:
							this.estat = 1;
							break;
						//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
						case com.amat.crm.opportunity.Ids.CBC_STAT_SEARCH:
							this.cbtat = 1;
							break;
						case com.amat.crm.opportunity.Ids.PSR_TYPE_SEARCH:
							this.pty = 1;
							break;
						case com.amat.crm.opportunity.Ids.CBC_VERSION_SEARCH:
							this.cvr = 1;
							break;
						//**************Start Of PCR019492: ASC606 UI Changes*******************
						//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
						/*case com.amat.crm.opportunity.Ids.RRASDA_LVL_SEARCH:
							this.rra = 1;
							break;*/
						//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
						case com.amat.crm.opportunity.Ids.BU_SEARCH:
							this.bu = 1;
							break;
						case com.amat.crm.opportunity.Ids.BOOK_QTR_SEARCH:
							this.btr = 1;
							break;
						//**************End Of PCR019492: ASC606 UI Changes*******************
						//*****************Start Of PCR033306: Q2C Display Enhancements ***************************
						case com.amat.crm.opportunity.Ids.S1_DFTNO_SEARCH:
							this.dft = 1;
							break;
						//*****************End Of PCR033306: Q2C Display Enhancements *****************************
					}
					this.cnt = this.cnt + 1;
				}
			}
			var fil = this.getView().byId(com.amat.crm.opportunity.Ids.FILTER_BTN);
			fil.setText(this.getResourceBundle().getText("S1FILTERFTSTR") + this.cnt + this.getResourceBundle().getText("S1FILTERSNDSTR"));
		},
		/**
		 * This method is used to handle "Go" button press event.
		 * @name onPressGo
		 * @param 
		 * @returns 
		 */
		onPressGo: function() {
			var myBusyDialog = _that.getBusyDialog();                                                                                                    //PCR028711++
			myBusyDialog.open();                                                                                                                         //PCR028711++
			var oViewS1 = this.getView();
			oViewS1.byId(com.amat.crm.opportunity.Ids.TAB_HDR_GLB_SEARCH).setValue("");
			var IpOppVal = oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_SEARCH).getValue();
			var IpCustVal = oViewS1.byId(com.amat.crm.opportunity.Ids.CUSTOMER_SEARCH).getValue();
			var IpQteNoVal = oViewS1.byId(com.amat.crm.opportunity.Ids.AMAT_QUOTE_NO_SEARCH).getValue();
			var IpOdrNoVal = oViewS1.byId(com.amat.crm.opportunity.Ids.SALES_ORDER_NO_SEARCH).getValue();
			var IpSlIdVal = oViewS1.byId(com.amat.crm.opportunity.Ids.SLOT_ID_SEARCH).getValue();
			var IpLowVal = oViewS1.byId(com.amat.crm.opportunity.Ids.LARGE_ORDER_SEARCH).getValue();
			var IpCustPOVal = oViewS1.byId(com.amat.crm.opportunity.Ids.CUSTOMER_PO_SEARCH).getValue();
			var IpVCProdDesVal = oViewS1.byId(com.amat.crm.opportunity.Ids.VC_PRDDIS_SEARCH).getValue();
			var IpPSRStatVal = oViewS1.byId(com.amat.crm.opportunity.Ids.PSR_STAT_SEARCH).getValue();
			var IpPDCStatVal = oViewS1.byId(com.amat.crm.opportunity.Ids.PDC_STAT_SEARCH).getValue();
			var IpESAStatVal = oViewS1.byId(com.amat.crm.opportunity.Ids.ESA_STAT_SEARCH).getValue();                                                   //PCR023905++
			var IpCBCStatVal = oViewS1.byId(com.amat.crm.opportunity.Ids.CBC_STAT_SEARCH).getValue();
			var IpPSRTYPVal = oViewS1.byId(com.amat.crm.opportunity.Ids.PSR_TYPE_SEARCH).getValue();
			var IpCBCVERVal = oViewS1.byId(com.amat.crm.opportunity.Ids.CBC_VERSION_SEARCH).getValue();
			//var IpRRALVLVal = oViewS1.byId(com.amat.crm.opportunity.Ids.RRASDA_LVL_SEARCH).getValue();                                   				 //PCR019492++//PCR028711--; Remove RRA Value
			var IpBUVal = oViewS1.byId(com.amat.crm.opportunity.Ids.BU_SEARCH).getValue();                                                               //PCR019492++
			var IpBQTRVal = oViewS1.byId(com.amat.crm.opportunity.Ids.BOOK_QTR_SEARCH).getValue();                                                       //PCR019492++
			var IpDFTNVal = oViewS1.byId(com.amat.crm.opportunity.Ids.S1_DFTNO_SEARCH).getValue();                                                       //PCR033306++
			var oTable1 = oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
			var oItemTemplate = oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TEMPLATE);
			//***********Start Of PCR028711: Q2C Enhancements for Q2-20**************
			var oResource = this.getResourceBundle();
			var oModel = sap.ui.getCore().getModel(oResource.getText("S2Q2CADVSCHMODEL"));
			oModel.getData().q2cADLOdr = IpLowVal;
			oModel.getData().q2cADBU = IpBUVal;
			oModel.getData().q2cADBQotr = IpBQTRVal;
			oModel.getData().q2cADCust = IpCustVal;
			oModel.getData().q2cADOpp = IpOppVal;
			oModel.getData().q2cADStId = IpSlIdVal;
			oModel.getData().q2cADAQout = IpQteNoVal;
			oModel.getData().q2cADCustPO = IpCustPOVal;
			oModel.getData().q2cADSOdr = IpOdrNoVal;
			oModel.getData().q2cDftNo = IpDFTNVal;                                                                                                        //PCR033306++
			var Str = this.getParamString(oModel);
			var sValidate = com.amat.crm.opportunity.util.ServiceConfigConstants.OpportunityFilterSet + Str;
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "", this._oBusydialog);
			var oModel = this.getModelFromCore(oResource.getText("S1Q2CADVSCHOPPMODEL"));
			_that.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).setModel(oModel);
			this.LGRVal = "";
			this.BUVal = "";
			this.BQTRVal = "";
			this.CUSTVal = "";
			if(_that.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0){
				this._showHideFilterBtns(true);
				oViewS1.byId(com.amat.crm.opportunity.Ids.TAB_HDR_SHOWALL_BTN).setVisible(true);
				oViewS1.byId(com.amat.crm.opportunity.Ids.S1OPPDOWNLOADBTN).setVisible(true);
				oViewS1.byId(com.amat.crm.opportunity.Ids.TAB_HDR_GLB_SEARCH).setVisible(true);
			}
			else{
				this._showHideFilterBtns(false);
				oViewS1.byId(com.amat.crm.opportunity.Ids.TAB_HDR_SHOWALL_BTN).setVisible(false);
				oViewS1.byId(com.amat.crm.opportunity.Ids.S1OPPDOWNLOADBTN).setVisible(false);
				oViewS1.byId(com.amat.crm.opportunity.Ids.TAB_HDR_GLB_SEARCH).setVisible(false);
			}
			myBusyDialog.close();
			/*if (IpOppVal !== "" || IpCustVal !== "" || IpQteNoVal !== "" || IpOdrNoVal !== "" || IpSlIdVal !== "" || IpLowVal !== "" ||
				IpVCProdDesVal !== "" || IpPSRStatVal !== "" || IpPDCStatVal !== "" || IpCBCStatVal !== "" || IpPSRTYPVal !== "" || IpCBCVERVal !==
//				"" || IpCustPOVal !== "") {                                                                                                              //PCR019492--
				//"" || IpCustPOVal !== "" || IpRRALVLVal !== "" || IpBUVal !== "" || IpBQTRVal !== "" ) {                                               //PCR019492++; PCR023905--
				"" || IpCustPOVal !== "" || IpRRALVLVal !== "" || IpBUVal !== "" || IpBQTRVal !== "" || IpESAStatVal !== "") {                           //PCR023905++
				var objOppFilter = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTOPPIDPROP"), sap.ui.model.FilterOperator.Contains,
					IpOppVal);
				var objCustFilter = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTCUSTPROP"), sap.ui.model.FilterOperator.Contains,
					IpCustVal);
				var objQteNoFilter = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTAMATQUTIDPROP"), sap.ui.model.FilterOperator.Contains,
					IpQteNoVal);
				var objOdrNoFilter = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTSONOROP"), sap.ui.model.FilterOperator.Contains,
					IpOdrNoVal);
				var objSlIdFilter = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTSLTNOPROP"), sap.ui.model.FilterOperator.Contains,
					IpSlIdVal);
				var objLowFilter = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTLOWDESPROP"), sap.ui.model.FilterOperator.Contains,
					IpLowVal);
				var objVCProdDesFilter = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTVCPRODIDPROP"), sap.ui.model.FilterOperator
					.Contains, IpVCProdDesVal);
				var totalFilter = [objOppFilter, objCustFilter, objQteNoFilter, objOdrNoFilter, objSlIdFilter, objLowFilter, objVCProdDesFilter];
				var SearchFieldValue = [this.getResourceBundle().getText("S1FLTPSRSTATPROP"), this.getResourceBundle().getText("S1FLTPDCSTATPROP"),
				    this.getResourceBundle().getText("S1FLTCBCSTATPROP"), this.getResourceBundle().getText("S1FLTPSRTYPEPROP"), this.getResourceBundle()
				    .getText("S1FLTCBCVERPROP"), this.getResourceBundle().getText("S1FLTPONOPROP"), this.getResourceBundle().getText("S1FLTSDALVLPROP"),  //PCR019492++
				    this.getResourceBundle().getText("S1BUTEXT"), this.getResourceBundle().getText("S1FLTBOKQTERPROP"),                                   //PCR019492++
				    this.getResourceBundle().getText("S1SRHTABESAIDSSTATCOLPROPTXT")                                                                      //PCR023905++
				    ];  
				if (IpPSRStatVal !== "") {
					_that.getMultipleFilter(IpPSRStatVal, SearchFieldValue[0], totalFilter);
				}
				if (IpPDCStatVal !== "") {
					_that.getMultipleFilter(IpPDCStatVal, SearchFieldValue[1], totalFilter);
				}
				if (IpCBCStatVal !== "") {
					_that.getMultipleFilter(IpCBCStatVal, SearchFieldValue[2], totalFilter);
				}
				if (IpPSRTYPVal !== "") {
					_that.getMultipleFilter(IpPSRTYPVal, SearchFieldValue[3], totalFilter);
				}
				if (IpCBCVERVal !== "") {
					_that.getMultipleFilter(IpCBCVERVal, SearchFieldValue[4], totalFilter);
				}
				if (IpCustPOVal !== "") {
					_that.getMultipleFilter(IpCustPOVal, SearchFieldValue[5], totalFilter);
				}
				//**************Start Of PCR019492: ASC606 UI Changes*******************
				if (IpRRALVLVal !== "") {
					_that.getMultipleFilter(IpRRALVLVal, SearchFieldValue[6], totalFilter);
				}
				if (IpBUVal !== "") {
					_that.getMultipleFilter(IpBUVal, SearchFieldValue[7], totalFilter);
				}
				if (IpBQTRVal !== "") {
					_that.getMultipleFilter(IpBQTRVal, SearchFieldValue[8], totalFilter);
				}
				//**************End Of PCR019492: ASC606 UI Changes*******************
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				if (IpESAStatVal !== "") {
					_that.getMultipleFilter(IpESAStatVal, SearchFieldValue[9], totalFilter);
				}
				if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
					if (IpESAStatVal === "") {
						totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1SRHTABESAIDSSTATCOLPROPTXT"), 
						  sap.ui.model.FilterOperator.NE, "");
					}
				}
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
					totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator
						.Contains, this.getResourceBundle().getText("S1SBUBUPLB_TXT"));
					totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator
						.Contains, this.getResourceBundle().getText("S1VSEBUPLB_TXT"));
					totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator
						.NE, this.getResourceBundle().getText("S2ICONTABPDCTEXT"));
					if (IpPSRStatVal === "" && IpPSRTYPVal === "") {
						totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPSRSTATPROP"), sap.ui.model.FilterOperator
							.NE, "");
					}
				}
				if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
					totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator
						.Contains, this.getResourceBundle().getText("S2ICONTABPDCTEXT"));
					if (IpPDCStatVal === "") {
						totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPDCSTATPROP"), sap.ui.model.FilterOperator
							.NE, "");
					}
				}
				if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
					if (IpCBCStatVal === "" && IpCBCVERVal === "") {
						totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTCBCSTATPROP"), sap.ui.model.FilterOperator
							.NE, "");
					}
				}
				var itemBinding = oTable1.getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
				itemBinding.filter(totalFilter);
			} else {
				if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
					var oFilter = [];
					oFilter[0] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.Contains, this
						.getResourceBundle().getText("S1SBUBUPLB_TXT"));
					oFilter[1] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.Contains, this
						.getResourceBundle().getText("S1VSEBUPLB_TXT"));
					oFilter[2] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.NE, this.getResourceBundle()
						.getText("S2ICONTABPDCTEXT"));
					oFilter[3] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPSRSTATPROP"), sap.ui.model.FilterOperator.NE, "");
					var oTable1 = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
					var itemBinding = oTable1.getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
					itemBinding.filter(oFilter);
				} else if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).getType() === this.getResourceBundle().getText(
						"S1EMPBTNTYP_TXT")) {
					var oFilter = [];
					oFilter[0] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.Contains, this
						.getResourceBundle().getText("S2ICONTABPDCTEXT"));
					oFilter[1] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPDCSTATPROP"), sap.ui.model.FilterOperator.NE, "");
					var oTable1 = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
					var itemBinding = oTable1.getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
					itemBinding.filter(oFilter);
				} else if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).getType() === this.getResourceBundle().getText(
						"S1EMPBTNTYP_TXT")) {
					var oFilter = [];
					oFilter[0] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTCBCSTATPROP"), sap.ui.model.FilterOperator.NE, "");
					var oTable1 = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
					var itemBinding = oTable1.getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
					itemBinding.filter(oFilter);
			    //***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				} else if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
			        var oFilter = [];
			        oFilter[0] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1SRHTABESAIDSSTATCOLPROPTXT"), sap.ui.model.FilterOperator.NE, "");
			        var oTable1 = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
			        var itemBinding = oTable1.getBinding(this.getResourceBundle().getText("S1TABLELISTITM"));
			        itemBinding.filter(oFilter);	
				//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App******************
				} else {
					this.bindTabAgation(oTable1, oItemTemplate, [], []);
				}
			}*/
			//***********End Of PCR028711: Q2C Enhancements for Q2-20****************
			//_that.RAllBtnDftStyle();                                                                                                                      //PCR022669++;PCR025717--
		},
		/**
		 * This method is used to handle MultipleFilter functionality.
		 * @name getMultipleFilter
		 * @param FilterValueArr-Array of filter values, SearchFieldValue-Search Field Property, totalFilter- Rest Singular filter Array
		 * @returns 
		 */
		getMultipleFilter: function(FilterValueArr, SearchFieldValue, totalFilter) {
			var VCProdDesvalues = FilterValueArr.split(",");
			var TempArr = [];
			for (var i = 0; i < VCProdDesvalues.length; i++) {
				TempArr[i] = new sap.ui.model.Filter(SearchFieldValue, sap.ui.model.FilterOperator.EQ, VCProdDesvalues[i]);
				totalFilter[totalFilter.length] = TempArr[i];
			}
		},
		/**
		 * This method is used to handle "Reset Search Criteria" link press event.
		 * @name handleLinkPress
		 * @param oEvent- Holds the current event
		 * @returns 
		 */
		handleLinkPress: function(oEvent) {
			var oViewS1 = this.getView();
			oViewS1.byId(com.amat.crm.opportunity.Ids.TAB_HDR_GLB_SEARCH).setValue("");
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_BTN).setText(this.getResourceBundle().getText("S1FILTERCOUNT"));
			this.cnt = 0;
			this.opp = 0;
			this.qot = 0;
			this.cus = 0;
			this.son = 0;
			this.slt = 0;
			this.low = 0;
			this.cstpo = 0;
			this.vcp = 0;
			this.pstat = 0;
			this.pdtat = 0;
			this.estat = 0;                                                                                                                //PCR023905++
			this.cbtat = 0;
			this.pty = 0;
			this.cvr = 0;
			this.rra = 0;                                                                                                                   //PCR019492++
			this.bu = 0;                                                                                                                    //PCR019492++
			this.btr = 0;                                                                                                                   //PCR019492++
			(oEvent !== undefined) ? (this.onResetPSRDCBC(this.getResourceBundle().getText("S1RIGHTTEXT"))) : (this.onResetPSRDCBC());
			var fil = oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_BTN);
			fil.setText(this.getResourceBundle().getText("S1FILTERFTSTR") + this.cnt + this.getResourceBundle().getText("S1FILTERSNDSTR"));
			var oTable1 = oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
			var oItemTemplate = oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TEMPLATE);
			this.bindTabAgation(oTable1, oItemTemplate, [], []);
			//(oEvent === undefined  || oEvent !== this.getResourceBundle().getText("S1RIGHTTEXT")) ? _that.RAllBtnDftStyle() : "";         //PCR022669++;PCR025717--
			//***********Start Of PCR028711: Q2C Enhancements for Q2-20**************
			if(oEvent){
				if(oEvent.getSource().getText() == this.getResourceBundle().getText("S1FILTERHIDE")){
					oTable1.setModel(new sap.ui.model.json.JSONModel({results: []}));
					this._showHidetabOps();
				}
			}
			//***********End Of PCR028711: Q2C Enhancements for Q2-20****************
		},
		/**
		 * This method is used to reset PSR,PDC& CBC Search View.
		 * @name onResetPSRDCBC
		 * @param oEvent- Holds the current event
		 * @returns 
		 */
		onResetPSRDCBC: function(oEvent) {
			var oViewS1 = _that.getView();
			(oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) ?
			(_that.typ === this.getResourceBundle().getText("S2ICONTABPSRTEXT")) : (
				(oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) ?
				(_that.typ === this.getResourceBundle().getText("S2ICONTABPDCTEXT")) : (
					(oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) ?
					//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
					//(_that.typ === this.getResourceBundle().getText("S2ICONTABCBCTXT")) : (_that.typ === this.getResourceBundle().getText(
					//	"S1DFTBTNTYP_TXT"))));"
					 (_that.typ === this.getResourceBundle().getText("S2ICONTABCBCTXT")) : (
					   (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT"))?
					    (_that.typ === this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT")):(_that.typ === this.getResourceBundle().getText("S1DFTBTNTYP_TXT")))));
			        //***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App******************
			(oEvent !== undefined) ? (_that.typ = this.getResourceBundle().getText("S1DFTBTNTYP_TXT")) : ("");
			//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
			if(oEvent == this.getResourceBundle().getText("OppSearch_OppKey")){
				_that.typ = _that.typ + this.getResourceBundle().getText("S1SEPCHAR") + this.getResourceBundle().getText("OppSearch_OppKey");
			}
			//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
			this.resetFilter(oViewS1, _that.typ);
			var DefaultView = {
				"LOWHBSearchVis": true,
				"VCProdDesHBSearchVis": false,
				"FilterStatHBSearchVis": false,
				"PSRStatHBSearchVis": false,
				"PDCStatHBSearchVis": false,
				"CBCStatHBSearchVis": false,
				"ESAStatHBSearchVis": false,                                                                                                                        //PCR023905++
				"FilterTypHBSearchVis": false,
				"PSRTypHBSearchVis": false,
				"CBCTypHBSearchVis": false,
				"TabGLBSearchVis": true,
				"TabShowAllBtnVis": oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0 ? true : false,                               //PCR028711++; modified true to Condition
				"TabFilterBtnVis": true,
				"LOW_LBSearchtxt": this.getResourceBundle().getText("OppSearch_LOWDialogTitle"),
				"PSRStatSearchTxt": "",
				"PSRTypSearchTxt": "",
				"OppDownloadVis": oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0 ? true : false                                  //PCR028711++; inserted Download Button visibility
			};
			var PSRFilterData = this.getJSONModel(DefaultView);
			//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
			if(!(oEvent == this.getResourceBundle().getText("OppSearch_OppKey"))){
				_that.getView().byId(com.amat.crm.opportunity.Ids.FILTER_SFORM).setModel(PSRFilterData);
				_that._showHideFilterBtns(false);
			}
			else{
				_that._showHideFilterBtns(true);			
			}
			oViewS1.byId(com.amat.crm.opportunity.Ids.S1HDRREFRESHBTN).setVisible(false);
			this._searchFormEnabler(true);
			//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
			oViewS1.byId(com.amat.crm.opportunity.Ids.OPPRTUNITY_TABLE).setModel(PSRFilterData);
			if (_that.typ === this.getResourceBundle().getText("S1DFTBTNTYP_TXT")) {
				oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
				oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
				oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
				oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));                       //PCR023905++
			}
			this.onDynamicColStyle(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));                                                                         //PCR019492++
		},
		/**
		 * This method is used to handle "Show All" button press event.
		 * @name onPressShowAll
		 * @param 
		 * @returns 
		 */
		onPressShowAll: function() {
			if (_that.getCurrentView().byId(com.amat.crm.opportunity.Ids.TAB_HDR_SHOWALL_BTN).getText() === this.getResourceBundle().getText(
					"S1SHOWALLBUTTON")) {
				_that.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).setGrowing(true);
				_that.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).setGrowingThreshold(100);
				_that.getCurrentView().byId(com.amat.crm.opportunity.Ids.TAB_HDR_SHOWALL_BTN).setText(this.getResourceBundle().getText(
					"S1SHOWLESSBUTTON"));
			} else {
				_that.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).setGrowing(true);
				_that.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).setGrowingThreshold(20);
				_that.getCurrentView().byId(com.amat.crm.opportunity.Ids.TAB_HDR_SHOWALL_BTN).setText(this.getResourceBundle().getText(
					"S1SHOWALLBUTTON"));
			}
			var oViewS1 = _that.getView(),
				oFilter = [];
			oViewS1.byId(com.amat.crm.opportunity.Ids.TAB_HDR_GLB_SEARCH).setValue("");
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_BTN).setText(this.getResourceBundle().getText("S1FILTERCOUNT"));
			if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.Contains,
					this.getResourceBundle().getText("S1SBUBUPLB_TXT"));
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.Contains,
					this.getResourceBundle().getText("S1VSEBUPLB_TXT"));
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.NE,
					this.getResourceBundle().getText("S2ICONTABPDCTEXT"));
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPSRSTATPROP"), sap.ui.model.FilterOperator
					.NE, "");
			}
			if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator.Contains,
					this.getResourceBundle().getText("S2ICONTABPDCTEXT"));
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPDCSTATPROP"), sap.ui.model.FilterOperator
					.NE, "");
			}
			if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTCBCSTATPROP"), sap.ui.model.FilterOperator
					.NE, "");
			}
			//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
			if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
				oFilter[oFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1SRHTABESAIDSSTATCOLPROPTXT"), sap.ui.model
					.FilterOperator.NE, "");
			}
			//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App******************
			var oTable1 = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
			var oItemTemplate = this.getView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TEMPLATE);
			this.bindTabAgation(oTable1, oItemTemplate, [], oFilter);
		},
		/**
		 * This method is used to handle personalize filter dialog check box select event.
		 * @name onSelectedCkb
		 * @param selected - Holds check box selection value
		 * @returns 
		 */
		onSelectedCkb: function(type, selected) {
			if (type === this.getResourceBundle().getText("S1PERDLOG_ALLTXT") && selected === true) {
				this._oDialog.getContent()[0].getItems()[6].getContent()[1].setSelected(true);                                         //PCR022138++; Item value change 5 to 6
				this._oDialog.getContent()[0].getItems()[6].getContent()[2].setSelected(true);                                         //PCR022138++; Item value change 5 to 6
				this._oDialog.getContent()[0].getItems()[6].getContent()[3].setSelected(true);                                         //PCR022138++; Item value change 5 to 6
			} else if (type === this.getResourceBundle().getText("S1PERDLOG_ALLTXT") && selected === false) {
				this._oDialog.getContent()[0].getItems()[6].getContent()[1].setSelected(false);                                        //PCR022138++; Item value change 5 to 6
				this._oDialog.getContent()[0].getItems()[6].getContent()[2].setSelected(false);                                        //PCR022138++; Item value change 5 to 6
				this._oDialog.getContent()[0].getItems()[6].getContent()[3].setSelected(false);                                        //PCR022138++; Item value change 5 to 6
			} else if (this._oDialog.getContent()[0].getItems()[6].getContent()[1].getSelected() === true && this._oDialog.getContent()[0].getItems()[     //PCR022138++; Item value change 5 to 6
					6].getContent()[2].getSelected() === true && this._oDialog.getContent()[0].getItems()[6].getContent()[3].getSelected() === true) {
				this._oDialog.getContent()[0].getItems()[6].getContent()[0].setSelected(true);                                          //PCR022138++; Item value change 5 to 6
			} else {
				this._oDialog.getContent()[0].getItems()[6].getContent()[0].setSelected(false);                                         //PCR022138++; Item value change 5 to 6
			}
		},
		/**
		 * This method is used to handle personalize filter dialog open event.
		 * @name onOpenFilter
		 * @param 
		 * @returns 
		 */
		onOpenFilter: function() {
			var myBusyDialog = this.getBusyDialog();
			myBusyDialog.open();
			this._oDialog = new sap.ui.xmlfragment(this.getResourceBundle().getText("OppFilerOppPerlzeF4Fragment"), this);
			this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PersonalizeDataSet, com.amat.crm.opportunity.util.ServiceConfigConstants
				.read, "", "");
			var oppPerFltdata = this.getModelFromCore(this.getResourceBundle().getText("GLBPERMODEL")).getData();
			var Title = this.RemoveDublicates(oppPerFltdata.results);
			var FinalData = this.fnGetCount(oppPerFltdata);
			var Form = this._oDialog.getContent()[0].getItems()[0];
			for (var i = 0; i < Title.length; i++) {
				if (Title[i].FildName === this.getResourceBundle().getText("S1PERDLOGSSTGODTITLE")) {
					Title[i].FildName = this.getResourceBundle().getText("S1PERDLOGSSTGVWTITLE");
					var oTitle = new sap.ui.core.Title({
						text: Title[i].FildName
					});
					Form.addContent(oTitle);
				} else if (Title[i].FildName === this.getResourceBundle().getText("S1PERDLOGRGNODTITLE")) {
					Title[i].FildName = this.getResourceBundle().getText("S1PERDLOGRGNVWTITLE");
					var oTitle = new sap.ui.core.Title({
						text: Title[i].FildName
					});
					this._oDialog.getContent()[0].getItems()[6].addContent(oTitle);
				} else if (Title[i].FildName === this.getResourceBundle().getText("S1PERDLOGBQTRODTITLE")) {
					Title[i].FildName = this.getResourceBundle().getText("S1PERDLOGBQTRVWTITLE");
					var oTitle = new sap.ui.core.Title({
						text: Title[i].FildName
					});
					this._oDialog.getContent()[0].getItems()[5].addContent(oTitle);
				} else {
					var oTitle = new sap.ui.core.Title({
						text: Title[i].FildName
					});
					this._oDialog.getContent()[0].getItems()[1].addContent(oTitle);
				}
				var count = 0;
				for (var j = 0; j < FinalData.results.length; j++) {
					if (FinalData.results[j].FilterField === this.getResourceBundle().getText("S1PERDLOGSSTGODTITLE")) {
						FinalData.results[j].FilterField = this.getResourceBundle().getText("S1PERDLOGSSTGVWTITLE");
					} else if (FinalData.results[j].FilterField === this.getResourceBundle().getText("S1PERDLOGRGNODTITLE")) {
						FinalData.results[j].FilterField = this.getResourceBundle().getText("S1PERDLOGRGNVWTITLE");
					} else if (FinalData.results[j].FilterField === this.getResourceBundle().getText("S1PERDLOGBQTRODTITLE")) {
						FinalData.results[j].FilterField = this.getResourceBundle().getText("S1PERDLOGBQTRVWTITLE");
					}
					if (FinalData.results[j].FilterField === Title[i].FildName) {
						if (Title[i].FildName === this.getResourceBundle().getText("S2GINFOSFBULBTXT") && count < 18) {     //changes 13 to 18
							var oCKB = new sap.m.CheckBox({
								text: FinalData.results[j].Desc,
								selected: FinalData.results[j].DefaultChk,
								tooltip: FinalData.results[j].FilterVal
							});
						} else {
							var oCKB = new sap.m.CheckBox({
								text: FinalData.results[j].FilterVal,
								selected: FinalData.results[j].DefaultChk,
								tooltip: FinalData.results[j].Desc,
								select: function(oEvent) {
									if (oEvent.getSource().getText() === _that.getResourceBundle().getText("S1PERDLOG_ALLTXT") || oEvent.getSource().getText() ===
										_that.getResourceBundle().getText("S1PERDLOG_CURRTXT") ||
										oEvent.getSource().getText() === _that.getResourceBundle().getText("S1PERDLOG_NXTTXT") || oEvent.getSource().getText() ===
										_that.getResourceBundle().getText("S1PERDLOG_PRETXT")) {
										_that.onSelectedCkb(oEvent.getSource().getText(), oEvent.getParameters().selected);
									}
								}
							});
						}
						if (Title[i].FildName === this.getResourceBundle().getText("S2GINFOSFBULBTXT") && count <= 3) {
							this._oDialog.getContent()[0].getItems()[1].addContent(oCKB);
							count++;
						} else if (Title[i].FildName === this.getResourceBundle().getText("S2GINFOSFBULBTXT") && count <= 7) {
							if (FinalData.results[j].FilterVal === "") {
								oCKB.addStyleClass(this.getResourceBundle().getText("S1PERDLOGHDECLS"));
							}
							this._oDialog.getContent()[0].getItems()[2].addContent(oCKB);
							count++;
						} else if (Title[i].FildName === this.getResourceBundle().getText("S2GINFOSFBULBTXT") && count <= 11) {
							if (FinalData.results[j].FilterVal === "") {
								oCKB.addStyleClass(this.getResourceBundle().getText("S1PERDLOGHDECLS"));
							}
							this._oDialog.getContent()[0].getItems()[3].addContent(oCKB);
							count++;
						} else if (Title[i].FildName === this.getResourceBundle().getText("S2GINFOSFBULBTXT") && count <= 15) {
							if (FinalData.results[j].FilterVal === "") {
								oCKB.addStyleClass(this.getResourceBundle().getText("S1PERDLOGHDECLS"));
							}
							this._oDialog.getContent()[0].getItems()[4].addContent(oCKB);
							count++;
						//************Start Of PCR022138++: DL4571 : enable new created SPG re-org divisions DC & DD ******************
						} else if (Title[i].FildName === this.getResourceBundle().getText("S2GINFOSFBULBTXT") && count <= 19) {
							if (FinalData.results[j].FilterVal === "") {
								oCKB.addStyleClass(this.getResourceBundle().getText("S1PERDLOGHDECLS"));
							}
							this._oDialog.getContent()[0].getItems()[5].addContent(oCKB);
							count++;
						//************Start Of PCR022138++: DL4571 : enable new created SPG re-org divisions DC & DD ******************
						} else if (Title[i].FildName === this.getResourceBundle().getText("S1PERDLOGBQTRVWTITLE") && count <= 7) {
							if (FinalData.results[j].FilterVal === "") {
								oCKB.addStyleClass(this.getResourceBundle().getText("S1PERDLOGHDECLS"));
							}
							this._oDialog.getContent()[0].getItems()[6].addContent(oCKB);                                              //5 to 6
							count++;
						} else if (Title[i].FildName === this.getResourceBundle().getText("S1PERDLOGRGNVWTITLE") && count <= 3) {
							this._oDialog.getContent()[0].getItems()[7].addContent(oCKB);                                              //6 to 7
							count++;
						} else if (Title[i].FildName === this.getResourceBundle().getText("S1PERDLOGRGNVWTITLE") && count > 3) {
							if (FinalData.results[j].FilterVal === "") {
								oCKB.addStyleClass(this.getResourceBundle().getText("S1PERDLOGHDECLS"));
							}
							this._oDialog.getContent()[0].getItems()[8].addContent(oCKB);                                              //7 to 8
							count++;
						} else if (Title[i].FildName === this.getResourceBundle().getText("S1PERDLOGBUVWTITLE")) {
							if (FinalData.results[j].FilterVal === "") {
								oCKB.addStyleClass(this.getResourceBundle().getText("S1PERDLOGHDECLS"));
							}
							Form.addContent(oCKB);
						} else {
							Form.addContent(oCKB);
						}
					}
				}
			}
			var Filtdata = this.getJSONModel(FinalData);
			this._oDialog.getContent()[0].getItems()[0].setModel(Filtdata);
			this.getCurrentView().addDependent(this._oDialog);
			this._oDialog.open();
			this._oDialog.setContentWidth("800px");
			myBusyDialog.close();
		},
		/**
		 * This method is used to handles column press event.
		 * @name onColumnPress
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onColumnPress: function(oEvent) {
			this.setFilters(oEvent, oEvent.getParameter(this.getResourceBundle().getText("S1COLMNINDEXTEXT")));
		},
		/**
		 * This method is used to handles column press event.
		 * @name setFilters
		 * @param oEvent - Holds the column press event,  colIndex - column Index
		 * @returns 
		 */
		setFilters: function(oEvent, colIndex) {
			colIndex = oEvent.getParameter(this.getResourceBundle().getText("S1COLMNINDEXTEXT"));
			var SortParam = "",
				totalFilter = [];
			if (_that.getView().byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).getType() === this.getResourceBundle().getText(
					"S1EMPBTNTYP_TXT")) {
				SortParam = this.getColShorter(colIndex, _that.PSRcolFlag, this.getResourceBundle().getText("S2ICONTABPSRTEXT"));
			} else if (_that.getView().byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).getType() === this.getResourceBundle().getText(
					"S1EMPBTNTYP_TXT")) {
				SortParam = this.getColShorter(colIndex, _that.PDCcolFlag, this.getResourceBundle().getText("S2ICONTABPDCTEXT"));
			} else if (_that.getView().byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).getType() === this.getResourceBundle().getText(
					"S1EMPBTNTYP_TXT")) {
				SortParam = this.getColShorter(colIndex, _that.CBCcolFlag, this.getResourceBundle().getText("S2ICONTABCBCTXT"));
			//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
			} else if (_that.getView().byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).getType() === this.getResourceBundle().getText(
					"S1EMPBTNTYP_TXT")) {
				SortParam = this.getColShorter(colIndex, _that.PDCcolFlag, this.getResourceBundle().getText("S1ESAIDSPROSTYPTXT"));
			//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App******************
			} else {
				SortParam = this.getColShorter(colIndex, _that.colFlag, this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			}
			var aProjSorters = [];
			aProjSorters.push(new sap.ui.model.Sorter(SortParam[0], SortParam[1]));
			var objprojectTab = this.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
			var objprojectTamplate = this.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST_TEMPLATE);
			var oViewS1 = _that.getView();
			oViewS1.byId(com.amat.crm.opportunity.Ids.TAB_HDR_GLB_SEARCH).setValue("");
			if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
				totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator
					.Contains, this.getResourceBundle().getText("S1SBUBUPLB_TXT"));
				totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator
					.Contains, this.getResourceBundle().getText("S1VSEBUPLB_TXT"));
				totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator
					.NE, this.getResourceBundle().getText("S2ICONTABPDCTEXT"));
				totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPSRSTATPROP"), sap.ui.model.FilterOperator
					.NE, "");
			}
			if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
				totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPBGPROP"), sap.ui.model.FilterOperator
					.Contains, this.getResourceBundle().getText("S2ICONTABPDCTEXT"));
				totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTPDCSTATPROP"), sap.ui.model.FilterOperator
					.NE, "");
			}
			if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
				totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1FLTCBCSTATPROP"), sap.ui.model.FilterOperator
					.NE, "");
			}
			//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
			if (oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).getType() === this.getResourceBundle().getText("S1EMPBTNTYP_TXT")) {
				totalFilter[totalFilter.length] = new sap.ui.model.Filter(this.getResourceBundle().getText("S1SRHTABESAIDSSTATCOLPROPTXT"), sap.ui.model
				    .FilterOperator.NE, "");
			}
			//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App******************
			this.bindTabAgation(objprojectTab, objprojectTamplate, aProjSorters, totalFilter);
			(SortParam[1] === false && SortParam[2] !== null) ? (sap.m.MessageToast.show(SortParam[2] + " " + this.getResourceBundle().getText(
				"S1TABLESORTAEC"))) : ((SortParam[2] !== null) ? (sap.m.MessageToast.show(SortParam[2] + " " + this.getResourceBundle().getText(
				"S1TABLESORTDES"))) : "");
		},
		//************************Start Of PCR022669: Q2C Q2 UI Changes**************
		/**
		 * This method is used to handles excel export table data.
		 * @name onDataExport
		 * @param
		 * @returns 
		 */
		onDataExport: function(){
			var oViewS1 = _that.getView();
			var oResource = this.getResourceBundle();
			var oTable  = oViewS1.byId(com.amat.crm.opportunity.Ids.OPPRTUNITY_TABLE), aItems = [], viewType = "";
			var oTable1 = oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST);
			var aColumns = oTable.getColumns();
			var ItemIndices = oTable1.getBinding(oResource.getText("S1TABLELISTITM")).aIndices;
			aItems = _that.getFilterModel(oTable1.getModel().getData().results, ItemIndices, oViewS1);
			var Model = this.getJSONModel({"results": aItems});
			var aTemplate = [];
			for (var i = 0; i < aColumns.length; i++) {			  
				if(aColumns[i].getVisible()){
					var oColumn = {
							name: aColumns[i].getHeader().getTitle(),
							template: {content: {path: null}}
							};
					if (aItems.length > 0) {
							oColumn.template.content.path = oTable1.getItems()[0].getCells()[i].getBinding("text").getPath();
					}
				aTemplate.push(oColumn);
				}
			}
			sap.ui.core.util === undefined ? sap.ui.require([oResource.getText("S1SAPCOREUTILEXTAPIPATH"), oResource.getText("S1SAPCOREUTILEXPTYPCSVAPIPATH")]):"";  
			var oExport = new sap.ui.core.util.Export({
			exportType: new sap.ui.core.util.ExportTypeCSV({
			     separatorChar : ",",
				 charset : "utf-8"
			}),
            models: Model,
			rows: {
			path: "/results"
			},
			columns: aTemplate
			});
			oExport.saveFile(oResource.getText("S1SEARCHRESULTEXPFLENAME")).always(function() {
				this.destroy();
			});			
		},
		/**
		 * This method is used to handles to show all BU's data.
		 * @name onPressAllRead
		 * @param oEvent - Holds the column press event
		 * @returns 
		 */
		onPressAllRead: function(oEvent){
			var myBusyDialog = this.getBusyDialog();
			myBusyDialog.open();
			this.handleLinkPress(this.getResourceBundle().getText("S1RIGHTTEXT"));
			//if(oEvent !== undefined){                                                                                                         PCR025717--
			//	if(oEvent.getSource().hasStyleClass("sapMRABtnClass")){                                                                         PCR025717--
					oEvent.getSource().removeStyleClass("sapMRABtnClass");
					oEvent.getSource().addStyleClass("sapMRPBtnClass");
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.OpportunityDataAllSet, com.amat.crm.opportunity.util.ServiceConfigConstants
						.read, "", "");	
				    _that.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).setModel(this.getModelFromCore(this.getResourceBundle().getText(
				    "GLBOPPALLMODEL")));
			 /****************Start Of PCR025717 Q2C Q4 2019 Enhancements ***********************************
				    } else {
					oEvent.getSource().removeStyleClass("sapMRPBtnClass");
					oEvent.getSource().addStyleClass("sapMRABtnClass");
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.OpportunityDataPerSet, com.amat.crm.opportunity.util.ServiceConfigConstants
						.read, "", "");
				    _that.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).setModel(this.getModelFromCore(this.getResourceBundle().getText(
				    "GLBOPPPERMODEL")));
				}
			} else {
				_that.RAllBtnDftStyle();
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.OpportunityDataPerSet, com.amat.crm.opportunity.util.ServiceConfigConstants
						.read, "", "");
				_that.getCurrentView().byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).setModel(this.getModelFromCore(this.getResourceBundle().getText(
				"GLBOPPPERMODEL")));
			}
			****************End Of PCR025717 Q2C Q4 2019 Enhancements *************************************/			
			myBusyDialog.close();
		}		
		//************************End Of PCR022669: Q2C Q2 UI Changes**************
		,
		//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
		/**
		 * This method is used to handle search F4 help.
		 * @name handleValueHelpOpps
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		handleValueHelpOpps: function(oEvent){
			var oResource = this.getResourceBundle(), Title = "",
			    sourceId = oEvent.getSource().getId().split("--")[oEvent.getSource().getId().split("--").length - 1];		
			switch (sourceId) {
			case com.amat.crm.opportunity.Ids.LARGE_ORDER_SEARCH:
				this.F4Type = oResource.getText("S1LGRF4TYPE");
				Title = oResource.getText("S1LOWLBL");
			    break;
			case com.amat.crm.opportunity.Ids.BU_SEARCH:
				this.F4Type = oResource.getText("S1SAFBULBLTXT");
				Title = oResource.getText("S1Q2CBULBLTXT");
				break;
			case com.amat.crm.opportunity.Ids.BOOK_QTR_SEARCH:
				this.F4Type = oResource.getText("S1BQTRF4TYPE");
				Title = oResource.getText("S1BOKQUTERLBL");
				break;
			case com.amat.crm.opportunity.Ids.CUSTOMER_SEARCH:
				this.F4Type = oResource.getText("S1CUSRF4TYPE");
				Title = oResource.getText("S2Q2CCUSTTXT");
				break;
		    }
			this.dialog = this._createIndependentDialog(this, oResource.getText("OppSearch_OppF4Fragment"));
			this.dialog.setTitle(Title);
			this.getF4Data(Title);
			this.setF4Model(Title);
			this.dialog.open();
		},
		/**
		 * This handles fragment close event.
		 * @name onClose
		 * @param
		 * @returns
		 */
		onClose: function () {
			this.dialog.close();
			this.dialog.destroy(true);
		},
		/**
		 * This method used to get value help data.
		 * @name getF4Data
		 * @param Title - Title of the Dialog
		 * @returns
		 */
		getF4Data: function(Title){
			var oResource = this.getResourceBundle(),
			    configConsts = com.amat.crm.opportunity.util.ServiceConfigConstants;
			switch (Title) {
			case oResource.getText("S1LOWLBL"):
				this.serviceCall(configConsts.LODERSET, configConsts.read, "", "", this._oBusydialog);
			    break;
			case oResource.getText("S1Q2CBULBLTXT"):
				this.serviceCall(configConsts.BUSet, configConsts.read, "", "", this._oBusydialog);
				break;
			case oResource.getText("S1BOKQUTERLBL"):
				this.serviceCall(configConsts.BQUTRSET, configConsts.read, "", "", this._oBusydialog);
				break;
			case oResource.getText("S2Q2CCUSTTXT"):
				if(sap.ui.getCore().getModel("F4CustlistSet") === undefined){
					this.serviceCall(configConsts.CUSTSET, configConsts.read, "", "", this._oBusydialog);
				}				
				break;
		    }
		},
		/**
		 * This method used to set value help data.
		 * @name setF4Model
		 * @param Title - Title of the Dialog 
		 * @returns
		 */
		setF4Model: function(Title){
			var keyVal = "", keyDes = "", keyDesVis = "", oModel = "";
			var oResource = this.getResourceBundle();
			switch (Title) {
			case oResource.getText("S1LOWLBL"): 
				keyVal = oResource.getText("S1LGRPROP"); 
				keyDes = oResource.getText("S1LGRDESPROP");
				oModel = sap.ui.getCore().getModel(oResource.getText("S2Q2CLISTSETMODEL")).getData();
			    break;
			case oResource.getText("S1Q2CBULBLTXT"):
				keyVal = oResource.getText("S1BUPROP");
				keyDes = oResource.getText("S1LGRDESPROP");
				oModel = sap.ui.getCore().getModel(oResource.getText("S2Q2CLISTSETMODEL")).getData();
				break;
			case oResource.getText("S1BOKQUTERLBL"):
				keyVal = oResource.getText("S1BQTRPROP");
				oModel = sap.ui.getCore().getModel(oResource.getText("S2Q2CLISTSETMODEL")).getData();
				break;
			case oResource.getText("S2Q2CCUSTTXT"):
				keyVal = oResource.getText("S2Q2CCUSTTXT");
				oModel = sap.ui.getCore().getModel(oResource.getText("S2Q2CCUSTLISTSETMODEL")).getData();
				break;
		    }
			var Data = {};
			Data.results = [];
			for(var i = 0; i < oModel.results.length; i++){
				var obj = {};
				obj.keyVal = oModel.results[i][keyVal];
				obj.keyDes = oModel.results[i][keyDes];
				Data.results.push(obj);
			}
			var F4Model = this.getJSONModel(Data);
			this.dialog.setModel(F4Model);
		},
		/**
		 * This method is used to handle F4 help search functionality.
		 * @name _handleValueHelpSearchOpp
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		_handleValueHelpSearchOpp: function(oEvent) {
			var oResource = this.getResourceBundle(),
			    sValue = oEvent.getParameter(oResource.getText("S1VALUETEXT")),
			    oFilter = new sap.ui.model.Filter("keyVal", sap.ui.model.FilterOperator.Contains, sValue),
			    oBinding = oEvent.getSource().getBinding(oResource.getText("S1TABLELISTITM"));
			oBinding.filter([oFilter]);
		},
		/**
		 * This method is used to handle F4 help confirm or close button functionality.
		 * @name _handleValueHelpCloseOpp
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		_handleValueHelpCloseOpp: function(oEvent) {
			var oResource = this.getResourceBundle(), ReqData = "",
			    AdvSrchModel = sap.ui.getCore().getModel(oResource.getText("S2Q2CADVSCHMODEL")),
			    IDH = com.amat.crm.opportunity.Ids,
			    checkFlag = false,
			    aFilter = [];
			var oldModelData = {};
			var itemSel = false;
			if(oEvent.getId() !== oResource.getText("S1CANTXT")){
				oldModelData = JSON.parse(JSON.stringify(AdvSrchModel.getData()));
				var aContexts = oEvent.getParameter(oResource.getText("S1SELCONTXTTEXT")),
				    SelData = aContexts[0].getProperty(aContexts[0].getPath()).keyVal;
				itemSel = true;
			}
			if(itemSel){
				switch(oEvent.getSource().getTitle()){
				case oResource.getText("OppSearch_BUKey"):
				    this.getView().byId(IDH.BU_SEARCH).setValue(SelData);
				    AdvSrchModel.getData().q2cADBU = SelData;
					if(!(oldModelData.q2cADBU)){
						   this.cnt = this.cnt + 1;
					}
					break;
				case oResource.getText("S1OPPF4"):
					this.getView().byId(IDH.CUSTOMER_SEARCH).setValue(SelData);
					AdvSrchModel.getData().q2cADCust = SelData;
					if(!(oldModelData.q2cADCust)){
						   this.cnt = this.cnt + 1;
					    }
					break;
				case oResource.getText("S1LOWLBL"):
					this.getView().byId(IDH.LARGE_ORDER_SEARCH).setValue(SelData);
			        AdvSrchModel.getData().q2cADLOdr = SelData;
					if(!(oldModelData.q2cADLOdr)){
					   this.cnt = this.cnt + 1;
				    }
					break;
				case oResource.getText("S1PERDLOGBQTRVWTITLE"):
					this.getView().byId(IDH.BOOK_QTR_SEARCH).setValue(SelData);
				    AdvSrchModel.getData().q2cADBQotr = SelData;
					if(!(oldModelData.q2cADBQotr)){
					   this.cnt = this.cnt + 1;
				    }
					break;
				case oResource.getText("S1SRHTABESAIDSSTATCOLTXT"):
					this.getCurrentView().byId(IDH.ESA_STAT_SEARCH).setValue("");
					if (aContexts.length > 0) {
						for(var i=0;i<aContexts.length;i++){
							aFilter.push(new sap.ui.model.Filter(oResource.getText("S1SRHTABESAIDSSTATCOLPROPTXT"), sap.ui.model.FilterOperator.Contains,
							aContexts[i].getProperty(aContexts[i].getPath()).keyVal));
						}
						var esaStatDesc = "";
						for(var i=0;i<aFilter.length;i++){
							esaStatDesc = esaStatDesc + aFilter[i].oValue1;
							if(i<aFilter.length-1){
								esaStatDesc = esaStatDesc + oResource.getText("S1SRCHSTRDMTR"); 
							}
						}
						this.getCurrentView().byId(IDH.ESA_STAT_SEARCH).setValue(esaStatDesc);
					}
					checkFlag = true;
					break;
				case oResource.getText("OppSearch_PSRSTATDialogTitle"):
					this.getCurrentView().byId(IDH.PSR_STAT_SEARCH).setValue("");
					if (aContexts.length > 0) {
						for(var i=0;i<aContexts.length;i++){
							aFilter.push(new sap.ui.model.Filter(oResource.getText("S1FLTPSRSTATPROP"), sap.ui.model.FilterOperator.Contains,
							aContexts[i].getProperty(aContexts[i].getPath()).keyVal));
						}
						var psrStatDesc = "";
						for(var i=0;i<aFilter.length;i++){
							psrStatDesc = psrStatDesc + aFilter[i].oValue1;
							if(i<aFilter.length-1){
								psrStatDesc = psrStatDesc + oResource.getText("S1SRCHSTRDMTR"); 
							}
						}
						this.getCurrentView().byId(IDH.PSR_STAT_SEARCH).setValue(psrStatDesc);
						if(this.getCurrentView().byId(IDH.PSR_TYPE_SEARCH).getValue()){
							var res = this.getCurrentView().byId(IDH.PSR_TYPE_SEARCH).getValue().split(",");
							for(var i=0;i<res.length;i++){
							   aFilter.push(new sap.ui.model.Filter(oResource.getText("S1FLTPSRTYPEPROP"), sap.ui.model.FilterOperator.Contains,res[i]));
							}
						}
					}
					checkFlag = true;
					break;
				case oResource.getText("OppSearch_PDCSTATDialogTitle"):
					this.getCurrentView().byId(IDH.PDC_STAT_SEARCH).setValue("");
					if (aContexts.length > 0) {
						for(var i=0;i<aContexts.length;i++){
							aFilter.push(new sap.ui.model.Filter(oResource.getText("S1FLTPDCSTATPROP"), sap.ui.model.FilterOperator.Contains,
							aContexts[i].getProperty(aContexts[i].getPath()).keyVal));
						}
						var pdcStatDesc = "";
						for(var i=0;i<aFilter.length;i++){
							pdcStatDesc = pdcStatDesc + aFilter[i].oValue1;
							if(i<aFilter.length-1){
								pdcStatDesc = pdcStatDesc + oResource.getText("S1SRCHSTRDMTR"); 
							}
						}
						this.getCurrentView().byId(IDH.PDC_STAT_SEARCH).setValue(pdcStatDesc);
					}
					checkFlag = true;
					break;
				case oResource.getText("OppSearch_CBCSTATDialogTitle"):
					this.getCurrentView().byId(IDH.CBC_STAT_SEARCH).setValue("");
					if (aContexts.length > 0) {
						for(var i=0;i<aContexts.length;i++){
							aFilter.push(new sap.ui.model.Filter(oResource.getText("S1FLTCBCSTATPROP"), sap.ui.model.FilterOperator.Contains,
							aContexts[i].getProperty(aContexts[i].getPath()).keyVal));
						}
						var cbcStatDesc = "";
						for(var i=0;i<aFilter.length;i++){
							cbcStatDesc = cbcStatDesc + aFilter[i].oValue1;
							if(i<aFilter.length-1){
								cbcStatDesc = cbcStatDesc + oResource.getText("S1SRCHSTRDMTR"); 
							}
						}
						this.getCurrentView().byId(IDH.CBC_STAT_SEARCH).setValue(cbcStatDesc);
						if(this.getCurrentView().byId(IDH.CBC_VERSION_SEARCH).getValue()){
							var res = this.getCurrentView().byId(IDH.CBC_VERSION_SEARCH).getValue().split(",");
							for(var i=0;i<res.length;i++){
							   aFilter.push(new sap.ui.model.Filter(oResource.getText("S1FLTCBCVERPROP"), sap.ui.model.FilterOperator.Contains,res[i]));
							}
						}
					}
					checkFlag = true;
					break;
				case oResource.getText("OppSearch_PSRTYPDialogTitle"):
					this.getCurrentView().byId(IDH.PSR_TYPE_SEARCH).setValue("");
					if (aContexts.length > 0) {
						for(var i=0;i<aContexts.length;i++){
							aFilter.push(new sap.ui.model.Filter(oResource.getText("S1FLTPSRTYPEPROP"), sap.ui.model.FilterOperator.Contains,
							aContexts[i].getProperty(aContexts[i].getPath()).keyVal));
						}
						var psrType = "";
						for(var i=0;i<aFilter.length;i++){
							psrType = psrType + aFilter[i].oValue1;
							if(i<aFilter.length-1){
								psrType = psrType + oResource.getText("S1SRCHSTRDMTR"); 
							}
						}
						this.getCurrentView().byId(IDH.PSR_TYPE_SEARCH).setValue(psrType);
						if(this.getCurrentView().byId(IDH.PSR_STAT_SEARCH).getValue()){
							var res = this.getCurrentView().byId(IDH.PSR_STAT_SEARCH).getValue().split(",");
							for(var i=0;i<res.length;i++){
							   aFilter.push(new sap.ui.model.Filter(oResource.getText("S1FLTPSRSTATPROP"), sap.ui.model.FilterOperator.Contains,res[i]));
							}
						}
					}
					checkFlag = true;
					break;
				case oResource.getText("OppSearch_CBCVERDialogTitle"):
					this.getCurrentView().byId(IDH.CBC_VERSION_SEARCH).setValue("");
					if (aContexts.length > 0) {
						for(var i=0;i<aContexts.length;i++){
							aFilter.push(new sap.ui.model.Filter(oResource.getText("S1FLTCBCVERPROP"), sap.ui.model.FilterOperator.Contains,
							aContexts[i].getProperty(aContexts[i].getPath()).keyVal));
						}
						var cbcVerType = "";
						for(var i=0;i<aFilter.length;i++){
							cbcVerType = cbcVerType + aFilter[i].oValue1;
							if(i<aFilter.length-1){
								cbcVerType = cbcVerType + oResource.getText("S1SRCHSTRDMTR");
							}
						}
						this.getCurrentView().byId(IDH.CBC_VERSION_SEARCH).setValue(cbcVerType);
						if(this.getCurrentView().byId(IDH.CBC_STAT_SEARCH).getValue()){
							var res = this.getCurrentView().byId(IDH.CBC_STAT_SEARCH).getValue().split(",");
							for(var i=0;i<res.length;i++){
							   aFilter.push(new sap.ui.model.Filter(oResource.getText("S1FLTCBCSTATPROP"), sap.ui.model.FilterOperator.Contains,res[i]));
							}
						}
					}
					checkFlag = true;
					break;
				}
			}
			if(checkFlag){
				var oList = this.getCurrentView().byId(IDH.OPPORTUNITY_LIST);
				var oBinding = oList.getBinding(oResource.getText("S1TABLELISTITM"));
				oBinding.filter(aFilter);
			}
			var fil = this.getView().byId(IDH.FILTER_BTN);
			fil.setText(oResource.getText("S1FILTERFTSTR") + this.cnt + this.getResourceBundle().getText("S1FILTERSNDSTR"));
		},
		/**
		 * This method is used to set selected value to advance search Fragment.
		 * @name getF4Property
		 * @param ReqData - Dialog Selected Value
		 * @returns (Array)
		 */
		getF4Property: function(ReqData){
			var prop = [], oResource = this.getResourceBundle();
			switch(this.F4Type){
			case oResource.getText("S1LGRF4TYPE"):
				this.LGRVal = ReqData;
				break;
			case oResource.getText("S1SAFBULBLTXT"):
				this.BUVal = ReqData;
				break;
			case oResource.getText("S1BQTRF4TYPE"):
				this.BQTRVal = ReqData;
				break;
			case oResource.getText("S1CUSRF4TYPE"):
				this.CUSTVal = ReqData;
				break;
			}
			this.CUSTVal = this.CUSTVal === undefined ? "" : this.CUSTVal;
			return ["/q2cADLOdr", "/q2cADBU", "/q2cADBQotr", "/q2cADCust", this.LGRVal, this.BUVal, this.BQTRVal, this.CUSTVal];
		},
		/**
		 * This method used to get search string.
		 * @name getParamString
		 * @param oModel - Advance Search fragment binding Model
		 * @returns Str - string Object
		 */
		getParamString: function(oModel){
			var Str = "";
			var configConsts = com.amat.crm.opportunity.util.ServiceConfigConstants;
			if(oModel.getProperty("/q2cADCust") !== ""){
				Str += configConsts.custNameEq + oModel.getProperty("/q2cADCust").replace("&", "$$");
			} else {
				Str += configConsts.custNameEq + oModel.getProperty("/q2cADCust");
			}
			if(oModel.getProperty("/q2cADOpp") !== ""){
				Str += configConsts.oppIdEq + oModel.getProperty("/q2cADOpp");
			}
			if(oModel.getProperty("/q2cADStId") !== ""){
				Str += configConsts.slotNoEq + oModel.getProperty("/q2cADStId");
			}
			if(oModel.getProperty("/q2cADAQout") !== ""){
				Str += configConsts.amatQuoteIdEq + oModel.getProperty("/q2cADAQout");
			}
			if(oModel.getProperty("/q2cADCustPO") !== ""){
				Str += configConsts.poNumberEq + oModel.getProperty("/q2cADCustPO");
			}
			if(oModel.getProperty("/q2cADSOdr") !== ""){
				Str += configConsts.soNumberEq + oModel.getProperty("/q2cADSOdr");
			}
			if(oModel.getProperty("/q2cADLOdr") !== "" && oModel.getProperty("/q2cADLOdr") !== undefined){
				Str += configConsts.lowEqEq + oModel.getProperty("/q2cADLOdr");
			}
			if(oModel.getProperty("/q2cADBU") !== "" && oModel.getProperty("/q2cADBU") !== undefined){
				Str += configConsts.buEq + oModel.getProperty("/q2cADBU");
			}
			if(oModel.getProperty("/q2cADBQotr") !== "" && oModel.getProperty("/q2cADBQotr") !== undefined){
				Str += configConsts.bookQutValEq + oModel.getProperty("/q2cADBQotr");
			}
			//*****************Start Of PCR033306: Q2C Display Enhancements ***************************
			if(oModel.getProperty("/q2cDftNo") !== "" && oModel.getProperty("/q2cDftNo") !== undefined){
				Str += configConsts.DftQutValEq + oModel.getProperty("/q2cDftNo");
			}
			//*****************End Of PCR033306: Q2C Display Enhancements ***************************
			Str +=  "'";
			return Str;
		},
		/**
		 * This method used keep search criteria.
		 * @name _setParamSearch
		 * @param 
		 * @returns 
		 */
		_setParamSearch: function(){
			var oResource = this.getResourceBundle(),
				oModel = sap.ui.getCore().getModel(oResource.getText("S2Q2CADVSCHMODEL")),
				oViewS1 = _that.getView(),
				IDH = com.amat.crm.opportunity.Ids;
			oViewS1.byId(IDH.BU_SEARCH).setValue(oModel.getData().q2cADBU);
			oViewS1.byId(IDH.CUSTOMER_SEARCH).setValue(oModel.getData().q2cADCust);
			oViewS1.byId(IDH.LARGE_ORDER_SEARCH).setValue(oModel.getData().q2cADLOdr);
			oViewS1.byId(IDH.BOOK_QTR_SEARCH).setValue(oModel.getData().q2cADBQotr);
			oViewS1.byId(IDH.OPPORTUNITY_SEARCH).setValue(oModel.getData().q2cADOpp);
			oViewS1.byId(IDH.SLOT_ID_SEARCH).setValue(oModel.getData().q2cADStId);
			oViewS1.byId(IDH.AMAT_QUOTE_NO_SEARCH).setValue(oModel.getData().q2cADAQout);
			oViewS1.byId(IDH.CUSTOMER_PO_SEARCH).setValue(oModel.getData().q2cADCustPO);
			oViewS1.byId(IDH.SALES_ORDER_NO_SEARCH).setValue(oModel.getData().q2cADSOdr);			
		},
		/**
		 * This method used remove search filters.
		 * @name onPressRefresh
		 * @param oEvent - Holds the current event 
		 * @returns 
		 */
		onPressRefresh: function(oEvent){
			var oViewS1 = _that.getView();
			(oEvent !== undefined) ? (_that.typ = this.getResourceBundle().getText("S1DFTBTNTYP_TXT")) : ("");
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PSRBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_PDCBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_CBCBTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_HDR_ESABTN).setType(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			this.handleLinkPress();
			var RefreshView = {
					"LOWHBSearchVis": true,
					"VCProdDesHBSearchVis": false,
					"FilterStatHBSearchVis": false,
					"PSRStatHBSearchVis": false,
					"PDCStatHBSearchVis": false,
					"CBCStatHBSearchVis": false,
					"ESAStatHBSearchVis": false,                                                                                                                        
					"FilterTypHBSearchVis": false,
					"PSRTypHBSearchVis": false,
					"CBCTypHBSearchVis": false,																														
					"TabGLBSearchVis":  true,								
					"TabShowAllBtnVis": oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0 ? true : false,								
					"TabFilterBtnVis": true,
					"LOW_LBSearchtxt": this.getResourceBundle().getText("OppSearch_LOWDialogTitle"),
					"PSRStatSearchTxt": "",
					"PSRTypSearchTxt": "",
					"OppDownloadVis": oViewS1.byId(com.amat.crm.opportunity.Ids.OPPORTUNITY_LIST).getItems().length > 0 ? true : false								    
			};
			var RefreshFilterData = this.getJSONModel(RefreshView);
			oViewS1.byId(com.amat.crm.opportunity.Ids.FILTER_SFORM).setModel(RefreshFilterData);
			oViewS1.byId(com.amat.crm.opportunity.Ids.OPPRTUNITY_TABLE).setModel(RefreshFilterData);
			this._setParamSearch();
			this._showHideFilterBtns(true);
			oViewS1.byId(com.amat.crm.opportunity.Ids.S1HDRREFRESHBTN).setVisible(false);
			this._searchFormEnabler(true);
			this.onDynamicColStyle(this.getResourceBundle().getText("S1DFTBTNTYP_TXT"));
			this._showHidetabOps();
		},
		/**
		 * This method used to enable/disable search parameters.
		 * @name _searchFormEnabler
		 * @param enblFlg - boolean flag
		 * @returns 
		 */
		_searchFormEnabler: function(enblFlg){			
			var oViewS1 = _that.getView(),
			IDH = com.amat.crm.opportunity.Ids,
			eleArr = [oViewS1.byId(IDH.CUSTOMER_SEARCH),oViewS1.byId(IDH.BU_SEARCH),oViewS1.byId(IDH.LARGE_ORDER_SEARCH),
				oViewS1.byId(IDH.BOOK_QTR_SEARCH),oViewS1.byId(IDH.OPPORTUNITY_SEARCH),oViewS1.byId(IDH.SLOT_ID_SEARCH),
				oViewS1.byId(IDH.AMAT_QUOTE_NO_SEARCH),oViewS1.byId(IDH.CUSTOMER_PO_SEARCH),oViewS1.byId(IDH.SALES_ORDER_NO_SEARCH)
				,oViewS1.byId(IDH.S1HDRGOBTN)];
			for (var i=0;i<eleArr.length;i++){
				eleArr[i].setEnabled(enblFlg);
			}
		},
		/**
		 * This method used to search Opportunity Table
		 * @name onSearchOppTable
		 * @param oEvent - Holds the current event
		 * @returns 
		 */
		onSearchOppTable: function(oEvent){			
			if (oEvent.getParameters().clearButtonPressed) {
				this._showHidetabOps();
			}
		},
		/**
		 * This method used to show/hide table options.
		 * @name _showHidetabOps
		 * @param 
		 * @returns 
		 */
		_showHidetabOps: function(){
			var oViewS1 = _that.getView(),
				IDH = com.amat.crm.opportunity.Ids;
			if(oViewS1.byId(IDH.OPPORTUNITY_LIST).getItems().length	>0){
				oViewS1.byId(IDH.TAB_HDR_SHOWALL_BTN).setVisible(true);
				oViewS1.byId(IDH.S1OPPDOWNLOADBTN).setVisible(true);
			}
			else{
				oViewS1.byId(IDH.TAB_HDR_SHOWALL_BTN).setVisible(false);
				oViewS1.byId(IDH.S1OPPDOWNLOADBTN).setVisible(false);
			}		
		},
		/**
		 * This method used to show/hide Filter Buttons.
		 * @name _showHideFilterBtns
		 * @param  btnFlag - boolean flag
		 * @returns 
		 */
		_showHideFilterBtns: function(btnFlag){
			var oViewS1 = _that.getView(),
				IDH = com.amat.crm.opportunity.Ids;
			oViewS1.byId(IDH.FILTER_HDR_ESABTN).setVisible(btnFlag);
			oViewS1.byId(IDH.FILTER_HDR_PSRBTN).setVisible(btnFlag);
			oViewS1.byId(IDH.FILTER_HDR_PDCBTN).setVisible(btnFlag);
			oViewS1.byId(IDH.FILTER_HDR_CBCBTN).setVisible(btnFlag);
		}
		//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
	});

});