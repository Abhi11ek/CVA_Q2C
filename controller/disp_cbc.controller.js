/**-------------------------------------------------------------------------------*
 * This class holds all methods of Display CBC page.                              *
 * -------------------------------------------------------------------------------*
 * @class                                                                         *
 * @public                                                                        *
 * @author Abhishek Pant                                                          *
 * @since 25 November 2019                                                        *
 * @extends com.amat.crm.opportunity.controller.BaseController                    *
 * @name com.amat.crm.opportunity.controller.disp_cbc                             *
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
		"com/amat/crm/opportunity/controller/disp_CommController"
	],
	function (Controller, CommonController) {
		"use strict";
		var thisCntrlr, oCommonController;
	return Controller.extend("com.amat.crm.opportunity.controller.disp_cbc", {
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
		onInit: function () {
			thisCntrlr = this;
			thisCntrlr.bundle = this.getResourceBundle();
			thisCntrlr.detActionType = "";
			thisCntrlr.that_views4 = this.getOwnerComponent().s4;
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
			this.disModel = new sap.ui.model.odata.ODataModel(thisCntrlr.bundle.getText("S4DISSERVEURL"),true);
			oCommonController = new CommonController();
		},
		/**
		 * This method Used to load CBC Data
		 * @name onLoadCBC
		 * @param {String} version - Requested Version
		 * @returns
		 */
		onLoadCBC: function(version){
			thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid,
					version === undefined || parseInt(version) === 0 ? "" : version);
			thisCntrlr.CbcTabColorInit();
		},
		/**
		 * This method Used to Refresh CBC Data
		 * @name getRefreshCBCdata
		 * @param {String} Guid - Opportunity GUID, {String} ItemGuid - Opportunity ItemGuid, {String} Version - CBC Version
		 * @returns
		 */
		getRefreshCBCdata: function(Guid, ItemGuid, Version){
			var oResource = thisCntrlr.getResourceBundle();
			var sValidate = oResource.getText("S4DISCBCINFOPTH") + Guid + oResource.getText("S4DISCBCINFOPTH1") + Version +
			         oResource.getText("S4DISRRATCHPTH2") + ItemGuid + oResource.getText("S4DISCBCINFOPTH2") + oResource.getText("S4DISCBCINFOPTH3");
	        this.serviceDisCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
	        var oModel = thisCntrlr.getDataModels();
	        var CrntVer = oModel[2].NAV_CBC_VERSIONS.results.length !== 0 ? parseInt(oModel[2].NAV_CBC_VERSIONS.results[oModel[2].
	                 NAV_CBC_VERSIONS.results.length - 1].VersionNo) : "";
	        Version = Version === "" ? CrntVer : Version;
	        var ProcType = (oModel[2].CcOppId !== "" && oModel[2].CcOpitmId !== "") || (CrntVer !== parseInt(Version)) ?
	        		oResource.getText("S2ESAOLDVERKEY") : oResource.getText("S1PERDLOG_CURRTXT");
	        var CbcModel = thisCntrlr.cbcDisMode(thisCntrlr, oModel[0], oModel[2], oModel[2].CbcStatus, ProcType, parseInt(Version) , oModel[1],
	    		       false, false, false);
	        thisCntrlr.setViewData(CbcModel);
		},
		/**
		 * This method Handles to set CBC view model.
		 * @name setViewData
		 * @param {sap.ui.model.Model} CbcModel - CBC Model
		 * @returns
		 */
		setViewData: function (CbcModel) {
			var oCbcModel = thisCntrlr.getJSONModel(CbcModel);
			thisCntrlr.getView().setModel(oCbcModel);
		},
		/**
		 * This method use to collect all models data.
		 * @name getDataModels
		 * @param
		 * @returns {Array Of sap.ui.model.Model} GeneralInfodata -  GenInfo Model, SecurityData - Security Model, CBCdata - CbcModel
		 */
		getDataModels: function () {
			var oResource = thisCntrlr.getResourceBundle(),
			    GeneralInfodata = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData(),
			    SecurityData = this.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData(),
			    CBCdata = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
			return [GeneralInfodata, SecurityData, CBCdata];
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
		 * This method Used to Bind CBC View.
		 * @name cbcDisMode
		 * @param {sap.ui.core.mvc.Controller} thisCntrlr - Current Controller, {sap.ui.model.Model} GeneralInfodata - GenInfo Model, CBCdata - CBC Model, {String} Status - CBC Status, VerType - Version Type,
		 * @param {String} VerNo - CBC Version, SecurityData - Security Model, {Boolean} editMode - Edit Model, {Boolean} SAFAction - SF Flag, {Boolean} RPflag - RF Flag, {Boolean} AprFlag - APR Flag
		 * @returns CbcModel
		 */
		cbcDisMode: function(thisCntrlr, GeneralInfodata, CBCdata, Status, VerType, VerNo, SecurityData, editMode, SAFAction, RPflag, AprFlag){
			var contactPer = false,
			chkLstPer = false,
			OmGenInitiateFlag = false,
			OmCbcInitiateFlag = false,
			GpmCbcInitiateFlag = false,
			oResource = thisCntrlr.bundle,
			CcFlag = false;
			CcFlag = CBCdata.CcOppId !== "" && CBCdata.CcOpitmId !== "";
			Status = Status === "" ? "0" : Status;
			OmGenInitiateFlag = thisCntrlr.checkContact(GeneralInfodata.NAV_OM_INFO.results);
			OmCbcInitiateFlag = thisCntrlr.checkContact(CBCdata.NAV_CBCOM.results);
			GpmCbcInitiateFlag = thisCntrlr.checkContact(CBCdata.NAV_CBCGPM.results);
			AprFlag = parseInt(Status) === 527 ? true : AprFlag;
			var NotifyFlag = parseInt(Status) === 525;
			var CbcModel = {
					"CBCDisBoxVis": parseInt(Status) === 0 || parseInt(Status) === 501 ? true : false,
					"CBCDisBoxSelIndex": parseInt(Status) === 0 || parseInt(Status) === 501 ? -1 : -1,
					"CBCStatBarVis": parseInt(Status) === 0 || parseInt(Status) === 501 ? false : true,
					"CBCSclrContrVis": parseInt(Status) === 0 || parseInt(Status) === 501 ? false : true,					
					"CbcRDDisEnable": parseInt(Status) === 0 || parseInt(Status) === 501 && SecurityData.InitCbc === oResource.getText("S1TABLESALESTAGECOL") ? true : false,
					"CbcStat": "Status:" + CBCdata.CbcStatDesc,
					"CBCPrintPdfTxt": oResource.getText("S2CBCPRINTBTNTXT"),
					"CBCPrintPdfIcon": oResource.getText("S4DISPDFDISBTNICON"),
				    "CBCPrintPdfVis": parseInt(Status) !== 560 ? true : false,
					"CBCPrintPdfEbl": true,
					"CBCEditBtnTxt": editMode === true || RPflag === true ? oResource.getText("S2PSRSDACANBTNTXT") : oResource.getText("S2CARMBTNEDIT"),
					"CBCEditBtnIcon": editMode === true || RPflag === true ? oResource.getText("S2CANCELBTNICON") : oResource.getText("S2PSRSDAEDITICON"),
					"CBCEditBtnVis": (parseInt(Status) !== 560 && parseInt(Status) !== 530) && VerType !== oResource.getText("S2ESAOLDVERKEY") && !CcFlag ? true : false,
					"CBCEditBtnEbl": true,
					"CBCSaveBtnTxt": oResource.getText("S1PERDLOG_SAVE"),
					"CBCSaveBtnIcon": oResource.getText("S2PSRSDASAVEICON"),
				    "CBCSaveBtnVis": parseInt(Status) !== 560 && VerType !== oResource.getText("S2ESAOLDVERKEY") && (parseInt(Status) === 525 || parseInt(Status) === 500 ||
				    		        parseInt(Status) === 527) && !CcFlag ? true : false,
					"CBCSaveBtnEbl": editMode === true ? true : false,
					"CBCSubFApprBtnTxt": (parseInt(Status) === 500) && SAFAction === true ? oResource.getText("S2PSRSDASUBFORAPP") : (parseInt(Status) === 560 ?
							            oResource.getText("S2PSRSDASFBTNCANNATXT") : (parseInt(Status) === 500 ?oResource.getText("S2PSRSDASFCANINITXT") : "")),
					"CBCSubFApprBtnIcon": (parseInt(Status) === 500 || parseInt(Status) === 501) && SAFAction === true ? oResource.getText("S2PSRSDAWFICON") : (parseInt(Status) === 560 ||
							              parseInt(Status) === 500 ? oResource.getText("S2CANCELBTNICON") : ""),
					"CBCSubFApprBtnVis": (parseInt(Status) === 500 || parseInt(Status) === 560 || SAFAction === true || (SAFAction === true && parseInt(Status) === 501)) && VerType !== oResource.getText(
							             "S2ESAOLDVERKEY") && !CcFlag && parseInt(Status) !== 527 ? true : false,
					"CBCSubFApprBtnEbl": parseInt(Status) === 500 || parseInt(Status) === 560 ? true : false,
					"CBCWFCAddBtnIcon": oResource.getText("S4DISADDCONBTNICON"),
					"CBCWFCAddBtnEbl": SecurityData.AddContact === oResource.getText("S1TABLESALESTAGECOL") && (editMode === true || RPflag ===
										true) && OmCbcInitiateFlag === true ? true : false,
					"CbcConDelMod": SecurityData.DelContact === oResource.getText("S1TABLESALESTAGECOL") && (editMode === true || RPflag ===
										true) && OmCbcInitiateFlag === true ? oResource.getText("S2DELPOSVIZTEXT") : oResource.getText("S2DELNAGVIZTEXT"),
					"SelectedVerNo": parseInt(CBCdata.VersionNo),
					"CbcCustName": GeneralInfodata.CustName,
					"CbcOppId": GeneralInfodata.OppId + "_" + GeneralInfodata.ItemNo,
					"CbcFabName": GeneralInfodata.FabName,
					"CbcBu": GeneralInfodata.Bu,
					"CbcVcProdId": GeneralInfodata.VcPrdid,
					"CbcOppStat": GeneralInfodata.S5FcastBSt,
					"CbcSlotId": GeneralInfodata.SlotId,
					"CbcAmatQuoteId": GeneralInfodata.AmatQuoteId,
					"CbcDftNo": GeneralInfodata.DftNo,
					"CbcSaleNo": GeneralInfodata.SoNumber,
					"CbcContractNo": GeneralInfodata.ContractNo,
					"CbcPoNumber": GeneralInfodata.PoNumber,
					"CbcItmCat": GeneralInfodata.ItmDesc,
					"CbcRegn": GeneralInfodata.Region,
					"CbcBokQutr": GeneralInfodata.BookQtr,
					"CbcRevQutr": GeneralInfodata.RevQtr,
					"CbcActShipDat": GeneralInfodata.ActShipDate,
					"CBCCustCoDtPri": GeneralInfodata.CustCoDtPri,
					"CbcPODat": GeneralInfodata.PoDate,
					//"CbcPrice": GeneralInfodata.NetValueMan,                                                                                                                       //PCR033306--
					"CbcPrice": CBCdata.Price,                                                                                                                                       //PCR033306++
					"CBCGenInfoVis": parseInt(Status) === 0 || parseInt(Status) === 501 || parseInt(Status) === 560 ? false : true,
					"CBCGenInfoVisExpd": true,
					"CBCPnlConVis": parseInt(Status) !== 560 ? true : false,
					"CBCPnlConVisExpd": true,
					"CBCPnlCcVis": parseInt(Status) !== 560 ? true : false,
					"CBCPnlCcVisExpd": parseInt(Status) === 500 || CBCdata.NAV_CBC_CC.results.length > 0 ? true : false,
					"CBCPnlQesVis": parseInt(Status) !== 560 ? true : false,
					"CBCPnlQesVisExpd": true,
					"CBCPnlMeaDocVis": parseInt(Status) !== 560 ? true : false,
					"CBCPnlMeaDocVisExpd": CBCdata.NAV_CBC_DOCS.results.length >= 1 &&  CBCdata.NAV_CBC_DOCS.results[0].FileName !== "" ? true : false,
					"CBCPnlAprVis": parseInt(Status) !== 560 ? true : false,
					"CBCPnlAprVisExpd": parseInt(Status) > 501 ? true : false,
					"CBCPnlMnComVis": true,
					"CBCPnlMnComVisExpd": parseInt(Status) === 560 || CBCdata.NAV_CBC_COMMENTS.results.length > 0 ? true : false,
					"CBCMainComTxtEbl": (parseInt(Status) < 530 && editMode === true) || (parseInt(Status) === 527 || parseInt(Status) === 530 || parseInt(Status) === 560)
					           && VerType !== oResource.getText("S2ESAOLDVERKEY")? true : false,
					"CBCPnlChngHisVis": parseInt(Status) !== 560 ? true : false,
					"CBCPnlChngHisVisExpd": true,
					"CBCCCLbTxt": CBCdata.CcOppId !== "" && CBCdata.CcOpitmId !== "" ? oResource.getText("S2PSRSDACCFRMTXT") + " " +
							CBCdata.CcOppId + "_" + CBCdata.CcOpitmId : "",
					"CBCCcIpVis": parseInt(Status) !== 560 ? true : false,
					"CBCChosbtnEbl": editMode === true || parseInt(Status) === 530 ? true : false,
					"CBCCcIpEbl": editMode === true && (parseInt(Status) === 500 || parseInt(Status) === 527) ? true : false,
					"CBCCcDLinkBtVis": CBCdata.NAV_CBC_CC.results.length > 0 && parseInt(Status) <= 530 ? true : false,
					"CBCCcDLinkBtEbl": CBCdata.NAV_CBC_CC.results.length > 0 && OmCbcInitiateFlag && parseInt(Status) <= 530  && (editMode || parseInt(Status) === 530) ? true :
						         (parseInt(Status) === 527 && OmCbcInitiateFlag ? true : false),
					"CBCCcDLinkBtIcon": oResource.getText("S4DISUNLINKBTNICON"),
					"AprBtnVis": ((parseInt(Status) > 500 && parseInt(Status) < 530) || parseInt(Status) === 527) &&  parseInt(Status) !== 501 && VerType !== oResource.getText(
							      "S2ESAOLDVERKEY") && AprFlag ? true : false,
					"AprBtnEbl": parseInt(Status) > 500 && parseInt(Status) < 530 && (editMode === true || RPflag === true) && VerType !== oResource.getText(
								"S2ESAOLDVERKEY")&& parseInt(CBCdata.TaskId) !== 0 && SecurityData.SendApproval === oResource.getText("S2ODATAPOSVAL") ? true : (
								parseInt(Status) === 527 && (VerType !== oResource.getText("S2ESAOLDVERKEY")&& parseInt(CBCdata.TaskId) !== 0 && SecurityData.SendApproval ===
								oResource.getText("S2ODATAPOSVAL")) ? true : false),
					"RecreatBtnVis": parseInt(Status) > 500 && parseInt(Status) !== 560 &&  parseInt(Status) !== 501 && VerType !== oResource.getText("S2ESAOLDVERKEY") &&
					             OmCbcInitiateFlag === true && !CcFlag ? true : false,
					"RecreatBtnEbl": parseInt(Status) > 500 && parseInt(Status) !== 560 &&  parseInt(Status) !== 501 && VerType !== oResource.getText(
								"S2ESAOLDVERKEY") && (OmCbcInitiateFlag === true || GpmCbcInitiateFlag) ? true : false,
			      };
			  var FooterBtn = thisCntrlr.that_views4.getContent()[0].getFooter().getContent();
			  FooterBtn[2].setVisible(CbcModel.AprBtnVis);
			  FooterBtn[3].setVisible(CbcModel.AprBtnVis);
			  FooterBtn[2].setEnabled(CbcModel.AprBtnEbl);
			  FooterBtn[3].setEnabled(CbcModel.AprBtnEbl);
			  FooterBtn[5].setVisible(CbcModel.RecreatBtnVis);
			  FooterBtn[5].setEnabled(CbcModel.RecreatBtnEbl);
			  FooterBtn[8].setVisible(NotifyFlag && OmCbcInitiateFlag);
			  CbcModel.NAV_CBCOM = CBCdata.NAV_CBCOM;
			  CbcModel.NAV_CBCSLS = CBCdata.NAV_CBCSLS;
			  CbcModel.NAV_CBCGPM = CBCdata.NAV_CBCGPM;
			  CbcModel.NAV_CBCFINN = CBCdata.NAV_CBCFINN;
			  CbcModel.NAV_CBCORCA = CBCdata.NAV_CBCORCA;
			  CbcModel.NAV_CBC_APRV_HIST = CBCdata.NAV_CBC_APRV_HIST;
			  CbcModel.NAV_CBC_CC = CBCdata.NAV_CBC_CC;
			  thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISCBCCCTAB).setModel(this.getJSONModel(CbcModel));
			  CbcModel.NAV_CBC_CHNG_HIST = CBCdata.NAV_CBC_CHNG_HIST;
			  CbcModel.NAV_CBC_COMMENTS = CBCdata.NAV_CBC_COMMENTS;
			  CbcModel.CBCVerCollection = [{
					"ProductId": oResource.getText("S2BSDASSMENTLVLOP"),
					"Name": oResource.getText("S2ESAVERBYDEFKEY")
			  }];
			  var CurrVer = 0;
			  for (var i = 0; i < CBCdata.NAV_CBC_VERSIONS.results.length; i++) {
					var obj = {};
					obj.ProductId = parseInt(CBCdata.NAV_CBC_VERSIONS.results[i].VersionNo);
					obj.Name = parseInt(CBCdata.NAV_CBC_VERSIONS.results[i].VersionNo);
					CbcModel.CBCVerCollection.push(obj);
					CurrVer = parseInt(CBCdata.NAV_CBC_VERSIONS.results[i].VersionNo);
				}
			  CbcModel.SelectedVerNo = VerType !== oResource.getText("S2ESAOLDVERKEY") ? CurrVer : VerNo;
			  var FinalDoc = [];
			  thisCntrlr.DocType = CBCdata.NAV_CBC_DOCS.results[0].DocType;
			  for (var i = 0; i < CBCdata.NAV_CBC_DOCS.results.length; i++) {
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
					if (CBCdata.NAV_CBC_DOCS.results[i].FileName !== "") {
						doc.Guid = CBCdata.NAV_CBC_DOCS.results[i].Guid;
						doc.DocId = CBCdata.NAV_CBC_DOCS.results[i].DocId;
						doc.docsubtype = CBCdata.NAV_CBC_DOCS.results[i].DocSubtype;
						doc.itemguid = CBCdata.NAV_CBC_DOCS.results[i].ItemGuid;
						doc.doctype = CBCdata.NAV_CBC_DOCS.results[i].DocType;
						doc.DocDesc = CBCdata.NAV_CBC_DOCS.results[i].DocDesc;
						doc.filename = CBCdata.NAV_CBC_DOCS.results[i].FileName;
						doc.OriginalFname = CBCdata.NAV_CBC_DOCS.results[i].OriginalFname;
						doc.note = CBCdata.NAV_CBC_DOCS.results[i].Notes;
						var expDate = (CBCdata.NAV_CBC_DOCS.results[i].ExpireDate === oResource.getText(
							"S2ATTACHPSRCBDATESTRNGTEXT") || CBCdata.NAV_CBC_DOCS.results[i].ExpireDate === "") ? null : new Date(
							CBCdata.NAV_CBC_DOCS.results[i].ExpireDate.slice(0, 4), CBCdata.NAV_CBC_DOCS.results[i].ExpireDate
							.slice(4, 6) - 1, CBCdata.NAV_CBC_DOCS.results[i].ExpireDate.slice(6, 8));
						doc.ExpireDate = expDate;
						doc.EnableDisflag = (SecurityData.ViewGenDoc === oResource.getText("S2ODATAPOSVAL") ? true : false);
						doc.Code = CBCdata.NAV_CBC_DOCS.results[i].Code;
						doc.uBvisible = CBCdata.NAV_CBC_DOCS.results[i].FileName === "" ? true : false;
						doc.bgVisible = !doc.uBvisible;
						doc.editable = false;
						doc.enableEditflag = parseInt(Status) < 530 && editMode === true ? true :(parseInt(Status) >= 530? true : false);
						doc.enableDelflag =  parseInt(Status) < 530 && editMode === true ? true :(parseInt(Status) >= 530? true : false);
						FinalDoc.push(doc);
						thisCntrlr.DocType = CBCdata.NAV_CBC_DOCS.results[i].DocType;
						thisCntrlr.docsubtype = CBCdata.NAV_CBC_DOCS.results[i].DocSubtype;
						doc.delVisible = (SecurityData.DelGenDoc === oResource.getText("S2ODATAPOSVAL") ? true : false);
					}
				}
				var oRPSRDocJModel = new sap.ui.model.json.JSONModel({
					"ItemSet": FinalDoc
				});
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISCBCMEADOCTAB).setModel(oRPSRDocJModel);
				var SEditable = (parseInt(Status) === 500 || parseInt(Status) === 525 || parseInt(Status) === 527) &&
				    OmCbcInitiateFlag === true && editMode === true ? true : false;
				var BEditable = parseInt(Status) === 525 && GpmCbcInitiateFlag === true && editMode === true ? true : false;
				thisCntrlr.getQuesierData(SEditable, BEditable, parseInt(Status));			
				return CbcModel;
			},
			/**
			 * This method Used to Convert Data to Tree Model Data.
			 * @name getQuesierData
			 * @param {Boolean} SEditable- Sales Editable Value, {Boolean} BEditable- BMO Editable Value, {String} Status
			 * @returns
			 */
			getQuesierData: function(SEditable, BEditable, Status) {
				var oResource = thisCntrlr.bundle,
				    CBCQusData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData().NAV_CBC_HEAD
					.results,
					HeaderCount = 0,
					ItemCount = 0;
				var oData = {
					"root": {}
				};
				oData.root.Node_Type = oResource.getText("S2CBCQUSTABROOTTXT");
				oData.root.Status = oResource.getText("S2CBCQUSTABROOTDISTXT");
				oData.root.checked = "false";
				oData.root.visible = false;
				oData.root.OmEditable = false;
				oData.root.BMOEditable = false;
				for (var i = 0, n = 0; i < CBCQusData.length; i++) {
					var itemData = [];
					var obj = {};
					var nil = {};
					HeaderCount = HeaderCount + 1;
					nil.Node_Type = CBCQusData[i].SectionTyp + ": " + CBCQusData[i].SelDesc;
					nil.Status = "";
					nil.OmVisible = false;
					nil.GpmVisible = false;
					nil.ComVisible = false;
					nil.OmEditable = false;
					nil.GpmEditable = false;
					nil.QuesClass = oResource.getText("S2PSRSDAQUESTITLECLS");
					for (var j = 0; j < CBCQusData[i].NAV_CBC_QAINFO.results.length; j++) {
						ItemCount = ItemCount + 1;
						nil[j] = {};
						nil[j].Node_Type = CBCQusData[i].NAV_CBC_QAINFO.results[j].Qdesc;
						nil[j].Status = "";
						nil[j].OmVisible = true;
						nil[j].GpmVisible = true;
						nil[j].ComVisible = true;
						var OmAns = CBCQusData[i].NAV_CBC_QAINFO.results[j].OmAns === oResource.getText("S2POSMANDATANS") ? 1 : (CBCQusData[i].NAV_CBC_QAINFO.results[j].
								OmAns === oResource.getText("S2NEGMANDATANS") ? 2 : (CBCQusData[i].NAV_CBC_QAINFO.results[j].OmAns === oResource.getText("S4DISCBCQUSNAANSKEY") ?
										3 : 0));
						var GpmAns = CBCQusData[i].NAV_CBC_QAINFO.results[j].GpmAns === oResource.getText("S2POSMANDATANS") ? 1 : (CBCQusData[i].NAV_CBC_QAINFO.results[j]
						       .GpmAns === oResource.getText("S2NEGMANDATANS") ? 2 : (CBCQusData[i].NAV_CBC_QAINFO.results[j].GpmAns === oResource.getText("S4DISCBCQUSNAANSKEY") ?
						    		   3 : 0));
						nil[j].OmSelectionIndex = OmAns;
						nil[j].GpmSelectionIndex = GpmAns;
						nil[j].OmValueState = OmAns === 0 ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText("S2DELNAGVIZTEXT");
						nil[j].GpmValueState = GpmAns === 0 ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText("S2DELNAGVIZTEXT");
						nil[j].OmEditable = SEditable;
						nil[j].GpmEditable = BEditable;
						nil[j].OmComments = CBCQusData[i].NAV_CBC_QAINFO.results[j].OmComments;
						nil[j].GpmComments = CBCQusData[i].NAV_CBC_QAINFO.results[j].GpmComments;
						nil[j].ComOmEnabled = SEditable;
						nil[j].ComGpmEnabled = BEditable;
						nil[j].ComEnabled = SEditable === true || BEditable === true ? true : false;
						nil[j].QuesClass = oResource.getText("S2PSRSDAQUESITEMCLS");
					}
					oData.root[i] = nil;
				}
				oData.root.headerCount = HeaderCount;
				oData.root.itemCount = ItemCount;
				var oTable = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISCBCQUESTAB);
				oTable.setVisibleRowCount(HeaderCount + ItemCount);
				oTable.setModel(this.getJSONModel(oData));
				oTable.bindRows(oResource.getText("S2CBCQUSTABROOTPATH"));
				oTable.expandToLevel(1);
			},
			/**
			 * This method Used to Validate CBC Process User Permissions.
			 * @name checkCBCUsersfromlist
			 * @param
			 * @returns {Boolean} checkFlag - Binary Flag
			 */
			checkCBCUsersfromlist: function() {
				var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData(),
				    checkFlag = false;
				switch (parseInt(CBCData.CbcStatus)){
				case 500:
				case 501:
				case 527:
					var omUserList = CBCData.NAV_CBCOM.results;
					var omInitiateFlag = this.checkContact(omUserList);
					(omInitiateFlag === true) ? (checkFlag = true) : (checkFlag = false);
					break;
				case 525:
					var gpmUserList = CBCData.NAV_CBCGPM.results;
					var gpmInitiateFlag = this.checkContact(gpmUserList);
					gpmInitiateFlag === true ? (checkFlag = true) : (checkFlag = false);
				}
				return checkFlag;
			},
			/**
			 * This method Handles Edit Button Event.
			 * @name onEditCBC
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onEditCBC: function(oEvent) {
				var ValidCon = this.checkCBCUsersfromlist(), CbcModel = "",
				    oResource = thisCntrlr.getResourceBundle(),
				    CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData(),
				    omUserList = CBCData.NAV_CBCOM.results,
				    omInitiateFlag = this.checkContact(omUserList);
				if (ValidCon === false && omInitiateFlag === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2USERALLAUTHFALTTXT"));
				} else {
					if(ValidCon === true && oEvent.getSource().getText() === oResource.getText("S2CARMBTNEDIT")){
						thisCntrlr.refereshData(true, false, false);
					} else if (oEvent.getSource().getText() === oResource.getText("S2CARMBTNCANCEL")){
						thisCntrlr.refereshData(false, false, false);
					} else if (omInitiateFlag === true && oEvent.getSource().getText() === oResource.getText("S2CARMBTNEDIT")){
						thisCntrlr.refereshData(false, false, true);
					} else if (omInitiateFlag === true && oEvent.getSource().getText() === oResource.getText("S2CARMBTNCANCEL")){
						thisCntrlr.refereshData(false, false, false);
					}
				}
			},
			/**
			 * This Method is use on CBC Cancel Initiation dialog box OK Button press event.
			 * @name confirmationCBCCanInit
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			confirmationCBCCanInit: function(oEvent) {
				var oResource = thisCntrlr.getResourceBundle();
				if(oEvent === oResource.getText("S2CONFFRGOKBTN")){
					var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
					thisCntrlr.InitiateCBC("", oResource.getText("S2ODATAPOSVAL"));
					thisCntrlr.refereshData(false, false, false);
					thisCntrlr.that_views4.getController().getRefereshGenInfoData();
					thisCntrlr.CbcTabColorInit();
					myBusyDialog.close();
				}			
			},
			/**
			 * This method Handles Submit Button Event.
			 * @name onSubmitCBC
			 * @param
			 * @returns
			 */
			onSubmitCBC: function() {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oResource = thisCntrlr.getResourceBundle(),
				    CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData(),
				    omUserList = CBCData.NAV_CBCOM.results,
				    omInitiateFlag = this.checkContact(omUserList);
			    if (omInitiateFlag === false) {
			    	thisCntrlr.showToastMessage(oResource.getText("S2USERROMAUTHFALTTXT"));
			    	myBusyDialog.close();
			    } else {
				  switch (thisCntrlr.getView().getModel().getProperty("/CBCSubFApprBtnTxt")){
					  case oResource.getText("S2PSRSDASFCANINITXT"):
					  case oResource.getText("S2PSRSDASFBTNCANNATXT"):
					        var Mesg = thisCntrlr.bundle.getText("S2CANINITMSG1") + thisCntrlr.bundle.getText("S2CBCCANINITMSG2");
						    sap.m.MessageBox.confirm(Mesg, this.confirmationCBCCanInit, thisCntrlr.bundle.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
						    thisCntrlr.refereshData(false, false, false);
						    myBusyDialog.close();
					        break;
					   case oResource.getText("S2PSRSDASUBFORAPP"):
							   var validateCBCTask = thisCntrlr.validateCBCWF();
					           var MinCon = thisCntrlr.checkMContact("", oResource.getText("S2CBCSALESUCSSANS"));
							   if (validateCBCTask[0] === false && validateCBCTask[1] === oResource.getText("S2CBCCONTACTLENTH0MSG")) {
								   thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCCONCT0FAILMSG"));
							    } else if(MinCon[0] === false){
							    	thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSSUMITCHKFAILMSG1") + MinCon[1] + oResource.getText("S2ESAIDSSUMITCHKFAILMSG2"));
							    	thisCntrlr.refereshData(false, false, false);
							    } else {
								   this.detActionType = "";
								   this.onCBCPayload(oResource.getText("S2PSRSDACBCSFASUBMITSUCSSMSG"), oResource.getText("S2ODATAPOSVAL"));
								   thisCntrlr.that_views4.getController().onNavBack();
						}
					}
					myBusyDialog.close();
				}
			},
			/**
			 * This method used to refresh CBC Data.
			 * @name refereshData
			 * @param {Boolean} editMode - Edit Mode, {Boolean} SfFlag -  SF Flag, {Boolean} RpFlag - RP Flag, {Boolean} AprFlag - APR Flag
			 * @returns
			 */
			refereshData: function(editMode, SfFlag, RpFlag, AprFlag){
				var oModel = thisCntrlr.getDataModels();
				var CbcModel = thisCntrlr.cbcDisMode(thisCntrlr, oModel[0], oModel[2], oModel[2].CbcStatus,
						thisCntrlr.bundle.getText("S1PERDLOG_CURRTXT"), parseInt(oModel[2].Version), oModel[1],
						editMode, SfFlag, RpFlag, AprFlag);
				thisCntrlr.setViewData(CbcModel);
				thisCntrlr.CbcTabColorInit();
			},
			/**
			 * This method used to Save CBC Data.
			 * @name onSaveCBC
			 * @param {sap.ui.base.Event} oEvt - Holds the current event, {String} Message - Display Message
			 * @returns
			 */
			onSaveCBC: function(oEvt, Message) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oResource = thisCntrlr.getResourceBundle(),
				    CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData(),
				    oView = this.getView();
				Message = Message !== "" ? oResource.getText("S2PSRSSDACBCVALIDSAVEMSG") :"";
				var validateCBCTask = this.validateCBCWF();
				if (validateCBCTask[0] === false) {
						thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCCONCT0FAILMSG"));
				} else {
					this.detActionType = "";
					this.onCBCPayload(Message, oResource.getText("S2CBCSALESUCSSANS"));
					var CbcModel = "";
					var validQuesAns = thisCntrlr.qusAnsValidate(CBCData);
					if(validQuesAns === false){						
						thisCntrlr.showToastMessage(oResource.getText("S4DISCBCMANDATFAILSAVSUCCMSG"));
					} else if(validQuesAns === true){
						switch(parseInt(CBCData.CbcStatus)){
						case 500:
						case 501:
							thisCntrlr.refereshData(false, true, false);
							break;
						case 525:
							var RPflag = parseInt(CBCData.TaskId) !== 0;
							thisCntrlr.refereshData(false, false, RPflag, true);
						}
						thisCntrlr.showToastMessage(Message);
					}
				}		
				myBusyDialog.close();
			},
			/**
			 * This method Handles Save Button Event.
			 * @name qusAnsValidate
			 * @param {sap.ui.model.Model} CBCData - CBC Model
			 * @returns {Boolean} ErrorFlag
			 */
			qusAnsValidate: function(CBCData){
				var ErrorFlag = false;
				for (var i = 0; i < CBCData.NAV_CBC_HEAD.results.length; i++) {
					for (var j = 0; j < CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results.length; j++) {
						if (parseInt(CBCData.CbcStatus) === 500) {
							if(CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].OmAns === ""){
								ErrorFlag = false;
								return ErrorFlag;
		                     }
						}else if(parseInt(CBCData.CbcStatus) === 525){
							if(CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].GpmAns === ""){
								ErrorFlag = false;
								return ErrorFlag;
		                     }
						}					
					}
					ErrorFlag = true;
				}				
				return ErrorFlag;
			},
			/**
			 * This method Handles Save Button Event.
			 * @name onCBCPayload
			 * @param {String} Message- Submit for Approval Message, {String} ActionType - Save Or Submit
			 * @returns {Object} obj- PayLoad Object
			 */
			onCBCPayload: function(Message, ActionType) {
				var OppGenInfoModel = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
				var CBCData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBCBCMODEL")).getData();
				var obj = {};
				obj.NAV_CBC_CC = [];
				obj.NAV_CBC_QA = [];
				obj.Guid = OppGenInfoModel.getData().Guid;
				obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
				obj.CbcType = CBCData.CbcType;
				obj.CbcStatus = CBCData.CbcStatus;				
				obj.ActionType = ActionType;
				obj.CbcStatDesc = OppGenInfoModel.getData().ProductLine;
				obj.AprvComments = CBCData.AprvComments;
				obj.CbcComm = "";
				obj.Partner = "";
				obj.WiId = "";
				obj.TaskId = CBCData.TaskId;
				obj.Version = CBCData.Version;
				if (parseInt(CBCData.CbcStatus) === 500 || parseInt(CBCData.CbcStatus) === 527) {
					if (this.getView().byId(com.amat.crm.opportunity.Ids.S4DISCBCCCTAB).getModel().getData().NAV_CBC_CC.results
						.length !== 0) {
						obj.CcOpitmId = OppGenInfoModel.getData().ItemNo;
						obj.CcOppId = OppGenInfoModel.getData().OppId;
					}
				} else {
					obj.CcOpitmId = CBCData.CcOpitmId;
					obj.CcOppId = CBCData.CcOppId;
				}
				if (this.getView().byId(com.amat.crm.opportunity.Ids.S4DISCBCCCTAB).getModel() !== undefined &&
					(parseInt(CBCData.CbcStatus) === 500|| parseInt(CBCData.CbcStatus) === 527)) {
					var CBCCcTabData = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISCBCCCTAB).getModel().getData().NAV_CBC_CC.results;
					if (CBCCcTabData.length > 0) {
						for (var i = 0; i < CBCCcTabData.length; i++) {
							var data = {};
							data.Guid = CBCCcTabData[i].Guid;
							data.ItemGuid = CBCCcTabData[i].ItemGuid;
							data.OppId = CBCCcTabData[i].OppId;
							data.ItemNo = CBCCcTabData[i].ItemNo;
							obj.NAV_CBC_CC.push(data);
						}
					}
				}
				for (var i = 0; i < CBCData.NAV_CBC_HEAD.results.length; i++) {
					for (var j = 0; j < CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results.length; j++) {
						var qus = {};
						qus.Guid = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Guid;
						qus.ItemGuid = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].ItemGuid;
						qus.ItemNo = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].ItemNo;
						qus.OppId = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].OppId;
						qus.QaVersion = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].QaVersion;
						qus.SectionTyp = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].SectionTyp;
						qus.Version = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Version;
						qus.Qid = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Qid;
						qus.Qdesc = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].Qdesc;						
						qus.OmAns = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].OmAns;
						qus.GpmAns = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].GpmAns;
						qus.OmComments = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].OmComments;						
						qus.GpmComments = CBCData.NAV_CBC_HEAD.results[i].NAV_CBC_QAINFO.results[j].GpmComments;
						obj.NAV_CBC_QA.push(qus);
					}
				}
				this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CBCInfoSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, Message);
				this.getRefreshCBCdata(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid, "");
			},
			/**
			 * This method Handles on version selection change Event.
			 * @name onCBCVerSelectionChange
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onCBCVerSelectionChange: function (oEvent) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oModel = thisCntrlr.getDataModels(),
				    CrntVer = oModel[2].NAV_CBC_VERSIONS.results[oModel[2].NAV_CBC_VERSIONS.results.length - 1].VersionNo,
				    ReqVer = oEvent.getParameters().selectedItem.getText();
				if (ReqVer === thisCntrlr.bundle.getText("S2ESAVERBYDEFKEY")) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ESAVERBYDEFNEGKEY"));
				} else {
					var EsaData = "",
						EsaModel = "";
					if (parseInt(ReqVer) === parseInt(CrntVer)) {
						thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid, parseInt(CrntVer));
					} else if (parseInt(ReqVer) < parseInt(CrntVer)) {
						thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid,
								    parseInt(oEvent.getSource().getSelectedItem().getText()));
					}
					thisCntrlr.CbcTabColorInit();
				}
				myBusyDialog.close();
			},
			/**
			 * This method Validates CBC Work Flow Permission.
			 * @name validateCBCWF
			 * @param
			 * @returns {Boolean} ValidateFlag - Binary User Validation Flag
			 */
			validateCBCWF: function() {
				var ValidateFlag = [],
				    oResource = thisCntrlr.getResourceBundle(),
				    CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
				if (CBCData.NAV_CBCGPM.results.length === 0 || CBCData.NAV_CBCOM.results.length === 0) {
					return ValidateFlag = [false, oResource.getText("S2CBCCONTACTLENTH0MSG")];
				}
				switch (parseInt(CBCData.CbcStatus)) {
				 case 500:
					var omUserList = CBCData.NAV_CBCOM.results;
					var omInitiateFlag = this.checkContact(omUserList);
					(omInitiateFlag === true) ? (ValidateFlag = [true, oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP")]) :
						(ValidateFlag = [false, oResource.getText("S4DISCONOMTXT")]);
					break;
				 case 525:
					var gpmUserList = CBCData.NAV_CBCGPM.results;
					var gpmInitiateFlag = this.checkContact(gpmUserList);
					(gpmInitiateFlag === true) ? (ValidateFlag = [true, oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP")]) :
						(ValidateFlag = [false, oResource.getText("S2PSRWFAPPPANLGPMINFOCONTIT")]);
				}
				return ValidateFlag;
			},
			/**
			 * This method Handles Main Comment Live Change Event.
			 * @name OnCbcMainCommLvchng
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			OnCbcMainCommLvchng: function(oEvent){
				oCommonController.commMainCommLvchng(oEvent, thisCntrlr.getResourceBundle(), thisCntrlr,
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISCBCMAINCOMSAVEBTN));
			},
			/**
			 * This method Handles Main Comment Save Event.
			 * @name onCbcSaveMainCom
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onCbcSaveMainCom: function (oEvent) {
				var oResouceBundle = thisCntrlr.getResourceBundle(),
				    oView = thisCntrlr.getView(),
				    MTxtAra = oView.byId(com.amat.crm.opportunity.Ids.S4DISCBCMAINCOMTXTAREA);
				if (!(oEvent.getSource().getParent().getFields()[0].getValue().match(/\S/))) {
					thisCntrlr.showToastMessage(oResouceBundle.getText("S2MAINCOMMBLANKMSG"));
					MTxtAra.setValue("");
				} else {
					var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
					oCommonController.commSaveMainCom(oEvent, oResouceBundle.getText("S2CBCTABTXT"), oResouceBundle, MTxtAra,
							oView.byId(com.amat.crm.opportunity.Ids.S4DISCBCMAINCOMTAB), oView.byId(com.amat.crm.opportunity.Ids.S4DISCBCMAINCOMSAVEBTN), thisCntrlr);
					myBusyDialog.close();
				}
			},
			/**
			 * This method Handles CBC Standard Radio Button Event.
			 * @name onPressInitiateStdCBC
			 * @param {sap.ui.base.Event} evt - Holds the current event
			 * @returns
			 */
			onPressInitiateStdCBC: function(evt) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oResource = thisCntrlr.getResourceBundle(),
				    omUserList = thisCntrlr.getModelFromCore(oResource.getText("OppGenInfoModel")).getData()
					.NAV_OM_INFO.results,
					oView = thisCntrlr.getView(),
					omInitiateFlag = this.checkContact(omUserList);
				if (omInitiateFlag === false) {
					sap.ui.core.BusyIndicator.hide();
					thisCntrlr.showToastMessage(oResource.getText("S4DISCBCINITAUTHFAILMSG"));
					thisCntrlr.getView().getModel().setProperty("/CBCDisBoxSelIndex", -1);
				} else {
					if (thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData().InitCbc !==
						oResource.getText("S2ODATAPOSVAL")) {
						thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCAUTHCHECKFAILMSG"));
					} else {
						var ActionType = evt.getSource().getSelectedIndex() === 3 ? oResource.getText("S2NEGMANDATANS") :
							oResource.getText("S2ESAINITKEY");
						if(evt.getSource().getSelectedIndex() !== 2){
							this.InitiateCBC(evt.getSource().getSelectedIndex(), ActionType);
							thisCntrlr.refereshData(true, false, false);
							thisCntrlr.that_views4.getController().getRefereshGenInfoData();
							thisCntrlr.CbcTabColorInit();
						} else {
							sap.m.MessageBox.confirm(
									oResource.getText("S4DISCBCLITCONMSG1") + oResource.getText("S4DISCBCLITCONMSG2") +
									oResource.getText("S4DISCBCLITCONMSG3"),
					               {
						              title: thisCntrlr.bundle.getText("S2PSRSDACBCCONDIALOGTYPTXT"),
						              onClose: this.confirmationCBCLitInit,
						              styleClass: "sapMCBCLitTxt"
					               });						
							thisCntrlr.getView().getModel().setProperty("/CBCDisBoxSelIndex", -1);
						}
						
					}
				}
				myBusyDialog.close();
			},
			/**
			 * This method Handles CBC Lite Type Event.
			 * @name confirmationCBCLitInit
			 * @param {String} oAction - Action Type
			 * @returns
			 */
			confirmationCBCLitInit: function(oAction){
				var oResorce = thisCntrlr.getResourceBundle();
				if(oAction === oResorce.getText("S2F4HELPOPPOKBTN")){
					var ActionType = oResorce.getText("S2ESAINITKEY");
					thisCntrlr.InitiateCBC(2, ActionType);
					thisCntrlr.refereshData(true, false, false);
					thisCntrlr.that_views4.getController().getRefereshGenInfoData();
					thisCntrlr.CbcTabColorInit();
				}
			},
			/**
			 * This method Handles CBC Type Event.
			 * @name InitiateCBC
			 * @param {String} CbcType - Current CBC Type, {String} ActionType - Type of Approval, {String} Msge - Display Message
			 * @returns
			 */
			InitiateCBC: function(CbcType, ActionType, Msge) {
				var oResource = thisCntrlr.getResourceBundle(),
				    OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")),
				    CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData(),
				    Msg = "", obj = {};
				obj.Guid = OppGenInfoModel.getData().Guid;
				obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
				if (CbcType === "") {
					obj.CbcType = "";
					obj.CbcStatus = "";
					Msg = oResource.getText("S2CBCCANINITSUCSSTXT");
				} else {
					(CbcType === 1) ? (obj.CbcType = oResource.getText("S2CBCTYPECSKEY")) : ((CbcType === 2) ?
						(obj.CbcType = oResource.getText("S2CBCTYPECLKEY")) : (obj.CbcType = oResource.getText("S2PSRDCBCNATEXT")));
					if(Msg === ""){
						(CbcType === 1 || CbcType === 2) ? (Msg = oResource.getText("S2PCBCINITSTATTXT")) :
							(Msg = oResource.getText("S2PCBCNTAPPLICABLESTATTXT"));
					} else {
						Msg = Msge;
					}
				}
				obj.CbcStatus = "";
				obj.WiId = "";
				obj.TaskId = "";
				obj.ActionType = ActionType;
				obj.CbcStatDesc = OppGenInfoModel.getData().ProductLine;
				obj.AprvComments = "";
				obj.CbcComm = "";
				obj.Partner = "";
				obj.CcOppId = "";
				obj.CcOpitmId = "";
				obj.Version = CBCData.Version;
				this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CBCInfoSet, com.amat.crm.opportunity
					.util.ServiceConfigConstants.write, obj, Msg);
				thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid, "");
			},
			/**
			 * This Method is use MEA Doc Panel Choose button press Event.
			 * @name onCBCChoosePress
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onCBCChoosePress: function(oEvent){
		        var oResouce = thisCntrlr.getResourceBundle(),
		            CBCData = thisCntrlr.getModelFromCore(oResouce.getText("GLBCBCMODEL")).getData(),
		            MEADoc = "",
		            Guid = CBCData.Guid,
		            ItemGuid = CBCData.ItemGuid,
		            MEADocFrag = [],
		            Custno = this.getOwnerComponent().Custno,
		            sGenaralChoos = oResouce.getText("S4DISCBCCSTDOCPTH") + Guid + oResouce.getText("S4DISCBCCSTDOCPTH1") + ItemGuid +
		                   oResouce.getText("S4DISCBCCSTDOCPTH2") + Custno + oResouce.getText("S4DISCBCCSTDOCPTH3");
		        this.disModel.read(sGenaralChoos, null, null, false, function(oData, oResponse) {
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
					doc.ExpireDate = MEADoc.results[i].ExpireDate !== oResouce.getText("S2ATTACHPSRCBDATESTRNGTEXT") ?new Date(MEADoc.results[i].ExpireDate.slice(0, 4),
							MEADoc.results[i].ExpireDate.slice(4, 6) - 1, MEADoc.results[i].ExpireDate.slice(6, 8)) : null;					
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
			 * @name onUploadFromPress
			 * @param {sap.ui.base.Event} evt - Holds the current event
			 * @returns
			 */
			onUploadFromPress: function(evt) {
				this.dialog.close();
				this.destroyDialog();
				var oResource = thisCntrlr.getResourceBundle();
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
				var sDocSubtype = oResource.getText("S4DISCBCOTHDOCPTH");
				this.serviceDisCall(sDocSubtype, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				thisCntrlr.genaralDoctype = thisCntrlr.getModelFromCore(oResource.getText("GLBOTHERDOCMODEL")).getData();
				this.dialog.setModel(new sap.ui.model.json.JSONModel(), oResource.getText("S2PSRCBCATTDFTJSONMDLTXT"));
				var a = {
					DocDesc: oResource.getText("S2ATTCHDOCTYPVALDMSG")};
				thisCntrlr.genaralDoctype.results.unshift(a);
				this.dialog.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
					docType: thisCntrlr.genaralDoctype.results});
				this.dialog.open();
			},
			/**
			 * This method Handles General Doc Fragment Data selection Event.
			 * @name onFragmentSelection
			 * @param {sap.ui.base.Event} evt - Holds the current event
			 * @returns
			 */
			onFragmentSelection: function(evt) {
				if (evt.getParameters().selectedItem.getText() === thisCntrlr.bundle.getText(
						"S2ATTCHDOCTYPVALDMSG")) {
					thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ATTCGENMESG"));
					evt.getSource().getParent().getParent().getFormElements()[2].getFields()[0].setEnabled(false);
					evt.getSource().getParent().getParent().getFormElements()[2].getFields()[1].setEnabled(false);
				} else {
					evt.getSource().getParent().getParent().getFormElements()[2].getFields()[0].setEnabled(true);
					evt.getSource().getParent().getParent().getFormElements()[2].getFields()[1].setEnabled(true);
				}
			},
			/**
			 * This method Handles General Doc Fragment Data selection Event.
			 * @name onFragmentSelection
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			handleEditPress: function(oEvent){
				if(oEvent.getSource().getIcon() === thisCntrlr.bundle.getText("S2PSRSDASAVEICON")){
					var NewValue = oEvent.getSource().getParent().getParent().getParent().getCells()[2].getValue();
					this.onCBCPayload("", thisCntrlr.bundle.getText("S2CBCSALESUCSSANS"));
				    thisCntrlr.refereshData(true, false, false);
				    oEvent.getSource().getParent().getParent().getParent().getCells()[2].setValue(NewValue);
				}
				oCommonController.commonEditPress(oEvent, thisCntrlr);
			},
			/**
			 * This method Handles Note Live Change Event.
			 * @name handleNoteLiveChange
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			handleNoteLiveChange: function(oEvent) {
				oCommonController.commonNoteLiveChange(oEvent, thisCntrlr);
			},
			/**
			 * This method Validates Delete Button Press Event.
			 * @name CheckDelete
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			CheckDelete: function (oEvent) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oResource = thisCntrlr.bundle;
				thisCntrlr.rowIndex = oEvent.getSource().getParent().getParent().getParent().getId().split("-")[oEvent.getSource()
					.getParent().getParent().getParent().getId().split("-").length - 1];
				thisCntrlr.oEvent = oEvent;
				thisCntrlr.source = oEvent.getSource();
				thisCntrlr.oTable = oEvent.getSource().getParent().getParent().getParent().getParent();
				thisCntrlr.tabBindingModel = oEvent.getSource().getModel().getData()[oEvent.getSource().getBindingContext().getPath().split("/")[1]];
				if (thisCntrlr.source.getIcon().indexOf(oResource.getText("S2ATTCHDOCDELVALDDELTXT").toLowerCase()) >= 0) {
					var text = oResource.getText("S2ATTCHDOCDELVALDMSG") + " " + thisCntrlr.tabBindingModel[thisCntrlr.rowIndex].DocDesc + oResource.getText(
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
						title: oResource.getText("S2ATTCHDOCDELVALDCONTXT"),
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								thisCntrlr.handleDeletePress(oEvent, oResource.getText("S2F4HELPOPPOKBTN"));
							} else return;
						}
					});
				} else {
					thisCntrlr.handleDeletePress(oEvent, "");
				}
				myBusyDialog.close();
			},
			/**
			 * This method Handles Delete Button Press Event.
			 * @name handleDeletePress
			 * @param {sap.ui.base.Event} oEvent - Holds the current event, {String} Action - Action Type
			 * @returns
			 */
			handleDeletePress: function (event, Action) {
				if(Action === thisCntrlr.bundle.getText("S2F4HELPOPPOKBTN")){
					this.onCBCPayload("", thisCntrlr.bundle.getText("S2CBCSALESUCSSANS"));
				    thisCntrlr.refereshData(true, false, false);
				}
				oCommonController.commonDeletePress(event, thisCntrlr);	
			},
			/**
			 * This method Handles File Name Press Event.
			 * @name handleEvidenceLinkPress
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			handleLinkPress: function (oEvent) {
				var oData = "", rowIndex = "",
				    oResource = thisCntrlr.getResourceBundle();
				if(oEvent.getSource().getParent().getParent().getId().split("--")[1] == com.amat.crm.opportunity.Ids.S4DISCBCMEADOCTAB){
					var rowIndex = oEvent.getSource().getParent().getId().split("-")[oEvent.getSource().getParent().getId().split(
					"-").length - 1];
				    var oData = oEvent.getSource().getParent().getParent().getModel().getData().ItemSet[rowIndex];
				} else {
					rowIndex = oEvent.getSource().getParent().getBindingContextPath();
					oData = oEvent.getSource().getParent().oBindingContexts.json.getModel().getProperty(rowIndex);;
				}
				var url = this.disModel.sServiceUrl + oResource.getText("S4DISRRATCHPTH1") + oData.Guid + oResource.getText("S4DISRRATCHPTH2") +
				oData.itemguid + oResource.getText("S4DISRRATCHPTH3") + oData.doctype + oResource.getText("S4DISRRATCHPTH4") + oData.docsubtype +
				oResource.getText("S4DISRRATCHPTH5") + oData.DocId + "')/$value";
				window.open(url);
			},
			/**
			 * This method Handles CBC Recreate Button Press Event.
			 * @name onCBCResetProcess
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onCBCResetProcess: function(oEvent){
				var oResource = thisCntrlr.getResourceBundle(),
				    CBCdata = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData(),
				    OmCbcInitiateFlag = thisCntrlr.checkContact(CBCdata.NAV_CBCOM.results),
				    GpmCbcInitiateFlag = thisCntrlr.checkContact(CBCdata.NAV_CBCGPM.results);
				if (OmCbcInitiateFlag === false && GpmCbcInitiateFlag === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSONRESETUSERFAILMSG"));
				} else {
					var Model = thisCntrlr.getDataModels();
					var sValidate = oResource.getText("S4DISRRARSTCLDPTH") + Model[0].OppId + oResource.getText("S4DISRRARSTCLDPTH1") +
					         Model[0].ItemNo.toString() + oResource.getText("S4DISCBCRSTCLDPTH2") + oResource.getText("S4DISCBCRSTCLDPTH3");
				    this.serviceDisCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				    var ResetData = thisCntrlr.getModelFromCore(oResource.getText("S4DISCBCCCHILDLISTMODEL")).getData().results;
				    thisCntrlr.ResetType = ResetData.length > 0 ? oResource.getText("S2RECRATEDEPTYPTEXT") : oResource.getText("S2RECRATEINDEPTYPTEXT");
				    var ProcessType = oResource.getText("S2CBCTABTXT");
				    var CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
				    this.dialog = sap.ui.xmlfragment(oResource.getText("PSRPDCONRESETConfirmation"), this);
				    if (thisCntrlr.ResetType === oResource.getText("S2RECRATEDEPTYPTEXT"))
					 {
					    (parseInt(CBCData.CbcStatus) >= 530)?(this.dialog.getContent()[1].setVisible(true)):(this.dialog.getContent()[1].setVisible(false));
					    for(var i = 0; i < ResetData.length; i++){                                                                                                                           //PCR035760++
							 ResetData[i].Selectflag = ResetData[i].Selectflag === oResource.getText("S2ODATAPOSVAL") ? true : false;                                                        //PCR035760++
						}                                                                                                                                                                    //PCR035760++
					    this.dialog.getContent()[1].setModel(this.getJSONModel({
						   "ItemSet": ResetData
					  }));
				    }
				    this.dialog.getContent()[1].getColumns()[0].getHeader().getBindingInfo("title").parts[0].path = "S2SELTODLINKTIT";
				    this.getCurrentView().addDependent(this.dialog);
				    this.dialog.getCustomHeader().getContentMiddle()[1].setText(oResource.getText("S2CBCREQIREDVALIDATIONTXT"));
				    this.dialog.open();
				}
			},
			/**
			 * This method Handles Cancel Button Event of Reset Fragment.
			 * @name onCancelreset
			 * @param
			 * @returns
			 */
			onCancelreset: function() {
				this.dialog.close();
				this.dialog.destroy();
			},
			/**
			 * This method is used to handles Live Change Event From Reset Functionality.
			 * @name OnRsetCommLvchng
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
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
			 * @name resetConfirmationOK
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			resetConfirmationOK: function(oEvent) {
				var recreateMsg = this.dialog.getContent()[0].getContent()[1].getValue();
				var ResetData = "",
					SuccessMsg = "",
					oResource = thisCntrlr.getResourceBundle();
				if (thisCntrlr.ResetType === oResource.getText("S2RECRATEDEPTYPTEXT")) {
					ResetData = this.dialog.getContent()[1].getModel() !== undefined ?
							this.dialog.getContent()[1].getModel().getData() : "";
				}
				this.dialog.close();
				this.dialog.destroy();
				var payload = {};
				var oModel = thisCntrlr.getDataModels();
				sap.ui.core.BusyIndicator.show();
				if (thisCntrlr.ResetType === oResource.getText("S2RECRATEINDEPTYPTEXT")){
					payload.Guid = oModel[0].Guid;
					payload.ItemGuid = oModel[0].ItemGuid;
					payload.Ptype = '';
					payload.step = oResource.getText("S2CBCTABTXT");
					payload.Comments = recreateMsg;
					SuccessMsg = oResource.getText("S2CBCTABTXT") + " " + oResource.getText("S2RECRATEPOSMSG");
					this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ResetSet,
							com.amat.crm.opportunity.util.ServiceConfigConstants.write, payload, SuccessMsg);
				} else {
					payload.Guid = oModel[0].Guid;
					payload.ItemGuid = oModel[0].ItemGuid;
					payload.OppId = oModel[0].OppId;
					payload.ItemNo = oModel[0].ItemNo;
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
					this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.ResetChildListSet, com.amat.crm.opportunity.util.ServiceConfigConstants
						.write, payload, SuccessMsg);
				}
				thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid, "");
				thisCntrlr.CbcTabColorInit();
				sap.ui.core.BusyIndicator.hide();
			},
			/**
			 * This method Handles Approve or Reject Button Of Confirmation Dialog.
			 * @name onCBCApprove
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onCBCApprove: function(oEvent){
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oResource = thisCntrlr.getResourceBundle();
				var CBCdata = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
				if (parseInt(CBCdata.TaskId) === 0) {
					thisCntrlr.showToastMessage(oResource.getText("S2USERROMAUTHFALTTXT"));
				} else {
					var validQuesAns = thisCntrlr.qusAnsValidate(CBCdata);
					validQuesAns = oEvent.getSource().getText() === oResource.getText("S2FOOTER_RJT") ? true : validQuesAns;
					if(validQuesAns === false){
						var Msg = oResource.getText("S4DISCBCMANDATFAILSAVSUCCMSG");
						thisCntrlr.onCBCPayload(Msg, oResource.getText("S2CBCSALESUCSSANS"));
						thisCntrlr.refereshData(true, false, false);
					} else if(validQuesAns === true){
						    thisCntrlr.onCBCPayload("", oResource.getText("S2CBCSALESUCSSANS"));
						    this.detActionType = (oEvent.getSource().getText() === oResource.getText("S2PSRCBCAPPROVETEXT") ?
						    	oResource.getText("S2PSRCBCAPPROVEKEY") : oResource.getText("S2PSRCBCREJECTKEY"));
							this.dialog = new sap.ui.xmlfragment(oResource.getText("PSRCBCONAPPORREJConfirmation"), this);
							this.getCurrentView().addDependent(this.dialog);
							this.dialog.open();
					}					
				}
				myBusyDialog.close();
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
			 * This method is used to handles Save Comment Event.
			 * @name OnApRctCommLvchng
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			OnApRctCommLvchng: function (oEvent) {
				var oResource = thisCntrlr.getResourceBundle();
				oEvent.getSource().getValue().length >= 255 ? this.showToastMessage(oResource.getText("S2PSRSDACBCMCOMMVALTXT")) : "";
				var ARComm = oEvent.getSource().getValue().length >= 255 ? (oEvent.getParameters().value.substr(0, 254).trim()) :
					 oEvent.getSource().getValue();
				if (oEvent.getSource().getValue().trim() === "" && oEvent.getSource().getValue().length !== 0) {
					this.dialog.getContent()[0].getContent()[1].setValue("");
					thisCntrlr.showToastMessage(oResource.getText("S2ESAIDSFBLNKCHAREORMSG"));
				} else {
					this.dialog.getContent()[0].getContent()[1].setValue(ARComm);
					var CBCdata = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
					CBCdata.AprvComments = ARComm;
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
					var CBCdata = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
					CBCdata.AprvComments = thisCntrlr.dialog.getContent()[0].getContent()[1].getValue();
					var Msg = this.detActionType === oResource.getText("S2PSRCBCAPPROVEKEY") ? oResource.getText("S2ESAIDSWFARSUCCMSG") :
						oResource.getText("S2PSRSDACBCRJTNNXTLVLTXT");
					thisCntrlr.onCBCPayload(Msg, this.detActionType);
					thisCntrlr.onCancelWFPress();
					thisCntrlr.that_views4.getController().onNavBack();
				}
			},
			/**
			 * This method Handles General Document Fragment Check box event.
			 * @name onGenDocCheck
			 * @param {sap.ui.base.Event} oEvt - Holds the current event
			 * @returns
			 */
			onGenDocCheck : function(oEvt){
				if(oEvt.getParameters().selected === true){
					this.dialog.getButtons()[1].setEnabled(true);
				}
			},
			/**
			 * This method Handles Submit Dialog Button Event.
			 * @name onSubmitFragment
			 * @param
			 * @returns
			 */
			onSubmitFragment: function() {
				var oResource = thisCntrlr.getResourceBundle();
				this.onCBCPayload("", oResource.getText("S2CBCSALESUCSSANS"));
				thisCntrlr.refereshData(false, true, false);
				Date.prototype.yyyymmdd = function() {
					var mm = this.getMonth() + 1;
					var dd = this.getDate();
					return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
				};
				var oModel = thisCntrlr.getDataModels();
				var oEntry = {
					Guid: oModel[0].Guid,
					ItemGuid: oModel[0].ItemGuid,
					OppId: thisCntrlr.getOwnerComponent().s4.getController().OppId,
					ItemNo: thisCntrlr.getOwnerComponent().s4.getController().ItemNo.toString(),
					RepFlag: "",
					OppDesc: "",
					NAV_CUSTDOCLINK: []
				};
				var items = this.dialog.getContent()[0].getItems();
				if (items.length !== 0) {
					for (var i = 0; i < items.length; i++) {
						if (items[i].getCells()[3].getSelected()) {
							var tableData = this.dialog.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT"))
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
								UploadedDate: tableData.UploadedDate,
								Timestamp: "",
								VersionNo: oModel[2].NAV_CBC_DOCS.results[0].VersionNo,
								OriginalFname: "",
								DocSortno: ""
							};
							oEntry.NAV_CUSTDOCLINK.push(doc);
						}
					}
					this.disModel.create(com.amat.crm.opportunity.util.ServiceConfigConstants.CustDoclinkSet, oEntry, null,
							jQuery.proxy(this._SavedSuccessCallback, this), jQuery.proxy(this._SavedFailCallback, this));
					this.closeDialog();
				} else {
					thisCntrlr.showToastMessage(oResource.getText("S2ATTACHSELECTMSG"));
				}
			},
			/**
			 * This method Handles on Service Success call Back function.
			 * @name _SavedSuccessCallback
			 * @param
			 * @returns
			 */
			_SavedSuccessCallback: function() {
				thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid, "");
				thisCntrlr.refereshData(true, false, false);
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2ATTCHSUBMTSUCSSMSG"));
			},
			/**
			 * This method Handles on Service Fail call Back function.
			 * @name _SavedFailCallback
			 * @param
			 * @returns
			 */
			_SavedFailCallback: function() {
				thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid, "");
				thisCntrlr.refereshData(true, false, false);
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2CONTCTSAVEERRORMSG"));
			},
			/**
			 * This method Handles Fragment Note Live Change Event.
			 * @name handleFragLiveChange
			 * @param {sap.ui.base.Event} oEvt - Holds the current event
			 * @returns
			 */
			handleFragLiveChange: function(oEvt) {
				if (oEvt.getParameters().value.length >= 255) {
					oEvt.getSource().setValue(oEvt.getParameters().value.substr(0, 254));
					thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCMCOMMVALTXT"));
				}
			},
			/**
			 * This method Handles General Document date change event.
			 * @name handleFragmentDateChange
			 * @param {sap.ui.base.Event} evvt - Holds the current event
			 * @returns
			 */
			handleFragmentDateChange: function(evt) {
				var tempDate = evt.getParameters().newValue;
				if (new Date(tempDate.split(".")[1] + "-" + tempDate.split(".")[0] + "-" + tempDate.split(".")[2]) <
					new Date()) {
					thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S1CARMDATELESS"));
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
			 * This method Handles Upload dialog OK Button Event.
			 * @name onFragmentUpload
			 * @param {sap.ui.base.Event} evt - Holds the current event
			 * @returns
			 */
			onFragmentUpload: function(evt) {
				var oResource = thisCntrlr.getResourceBundle();
				this.onCBCPayload("", oResource.getText("S2CBCSALESUCSSANS"));
				thisCntrlr.refereshData(false, true, false);
				sap.ui.core.BusyIndicator.show();
				Date.prototype.yyyymmdd = function() {
					var mm = this.getMonth() + 1;
					var dd = this.getDate();
					return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
				};
				thisCntrlr.Custno = thisCntrlr.getOwnerComponent().Custno;
				var docsubtype = evt.getSource().getParent().getParent().getFormElements()[0].getFields()[0].getSelectedKey();
				var note = evt.getSource().getParent().getParent().getFormElements()[1].getFields()[0].getValue();
				var date = evt.getSource().getParent().getParent().getFormElements()[2].getFields()[0].getDateValue();
				if (date === null) {
					date = oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT");
				} else {
					date = date.yyyymmdd();
				}
				var SLUG = thisCntrlr.getOwnerComponent().ItemGuid.replace(/-/g, "").toUpperCase() + "$$" + thisCntrlr.DocType + "$$" + docsubtype +          //PCR035760 Defect#131 TechUpgrade changes
					"$$ $$" + date + "$$" + thisCntrlr.Custno + "$$" + evt.getSource().getValue() + "$$" + (note === " " ?
						" " : note);
				var file = evt.oSource.oFileUpload.files[0];
				this.oFileUploader = evt.getSource();
				this.oFileUploader.setUploadUrl(oResource.getText("DisUPLOADURL"));
				this.oFileUploader.setSendXHR(true);
				this.oFileUploader.removeAllHeaderParameters();
				var sToken = this.disModel.getHeaders()['x-csrf-token'];
				this.disModel.refreshSecurityToken(function(e, o) {
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
			 * This Method is use MEA Doc Panel Expand Event.
			 * @name onExpMEADoc
			 * @param
			 * @returns
			 */
			onExpMEADoc: function(){
				var genaralDocData = [],
				    oResource = thisCntrlr.getResourceBundle(),
				    oView = thisCntrlr.getView(),
				    oModel = thisCntrlr.getDataModels();
				(oModel[1].UpldGenDoc === oResource.getText("S2ODATAPOSVAL") && parseInt(oModel[2].CbcStatus) < 530 &&
					oView.getModel().getProperty("/CBCEditBtnTxt") === oResource.getText("S2PSRSDACANBTNTXT")) ?
					(oView.getModel().setProperty("/CBCChosbtnEbl", true)) : ((parseInt(oModel[2].CbcStatus) >= 530)?
					(oView.getModel().setProperty("/CBCChosbtnEbl", true)):(oView.getModel().setProperty("/CBCChosbtnEbl", false)));
				thisCntrlr.genaralDocFrag = [];
				thisCntrlr.Guid = oModel[2].Guid;
				thisCntrlr.itemguid = oModel[2].ItemGuid;
				thisCntrlr.DocType = oModel[2].NAV_CBC_DOCS.results[0].DocType;
				for (var i = 0; i < oModel[2].NAV_CBC_DOCS.results.length; i++) {
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
					if (oModel[2].NAV_CBC_DOCS.results[i].FileName !== "") {
						doc.Guid = oModel[2].NAV_CBC_DOCS.results[i].Guid;
						doc.DocId = oModel[2].NAV_CBC_DOCS.results[i].DocId;
						doc.docsubtype = oModel[2].NAV_CBC_DOCS.results[i].DocSubtype;
						doc.itemguid = oModel[2].NAV_CBC_DOCS.results[i].ItemGuid;
						doc.doctype = oModel[2].NAV_CBC_DOCS.results[i].DocType;
						doc.DocDesc = oModel[2].NAV_CBC_DOCS.results[i].DocDesc;
						doc.filename = oModel[2].NAV_CBC_DOCS.results[i].FileName;
						doc.OriginalFname = oModel[2].NAV_CBC_DOCS.results[i].OriginalFname;
						doc.note = oModel[2].NAV_CBC_DOCS.results[i].Notes;
						var expDate = (oModel[2].NAV_CBC_DOCS.results[i].ExpireDate === oResource.getText(
							"S2ATTACHPSRCBDATESTRNGTEXT") || oModel[2].NAV_CBC_DOCS.results[i].ExpireDate === "") ? null : new Date(
							oModel[2].NAV_CBC_DOCS.results[i].ExpireDate.slice(0, 4), oModel[2].NAV_CBC_DOCS.results[i].ExpireDate
							.slice(4, 6) - 1, oModel[2].NAV_CBC_DOCS.results[i].ExpireDate.slice(6, 8));
						doc.ExpireDate = expDate;
						doc.EnableDisflag = (oModel[1].ViewGenDoc === oResource.getText("S2ODATAPOSVAL") ?
							true : false);
						doc.Code = oModel[2].NAV_CBC_DOCS.results[i].Code;
						doc.uBvisible = oModel[2].NAV_CBC_DOCS.results[i].FileName === "" ? true : false;
						doc.bgVisible = !doc.uBvisible;
						doc.editable = false;
						doc.enableEditflag = parseInt(oModel[2].CbcStatus) < 530 && oView.getModel().getProperty("/CBCEditBtnTxt") ===
							oResource.getText("S2PSRSDACANBTNTXT") ? true :(parseInt(oModel[2].CbcStatus) >= 530? true : false);
						doc.enableDelflag =  parseInt(oModel[2].CbcStatus) < 530 && oView.getModel().getProperty("/CBCEditBtnTxt") ===
							oResource.getText("S2PSRSDACANBTNTXT") ? true :(parseInt(oModel[2].CbcStatus) >= 530? true : false);
						genaralDocData.push(doc);
						thisCntrlr.DocType = oModel[2].NAV_CBC_DOCS.results[i].DocType;
						thisCntrlr.docsubtype = oModel[2].NAV_CBC_DOCS.results[i].DocSubtype;
						doc.delVisible = (oModel[1].DelGenDoc === oResource.getText("S2ODATAPOSVAL") ?
							true : false);
					}
				}
				var oMEADocModel = this.getJSONModel({
					"ItemSet": genaralDocData
				});
				thisCntrlr.oMEADocTable = oView.byId(com.amat.crm.opportunity.Ids.S4DISCBCMEADOCTAB);
				thisCntrlr.oMEADocTable.setModel(oMEADocModel);
				var table = thisCntrlr.oMEADocTable;
				for (var i = 0; i < table.getModel().getData().ItemSet.length; i++) {
					if (table.getModel().getData().ItemSet[i].uBvisible === true) {
						table.getItems()[i].getCells()[2].setEnabled(true);
					} else {
						table.getItems()[i].getCells()[2].setEnabled(false);
					}
					table.getItems()[i].getCells()[4].getItems()[0].getItems()[0].setIcon(oResource.getText("S2PSRSDAEDITICON"));
					table.getItems()[i].getCells()[4].getItems()[0].getItems()[1].setIcon(oResource.getText("S2PSRSDADELETEICON"));
					if (table.getItems()[i].getCells()[4].getItems()[0].getItems()[3] !== undefined) {
						table.getItems()[i].getCells()[4].getItems()[0].getItems()[3].setVisible(true);
					}
				}
			},
			/**
			 * This method Handles upload Complete Event.
			 * @name onComplete
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onComplete: function(oEvent) {
				var oResource = thisCntrlr.getResourceBundle();
				if (oEvent.getParameters().status === 201) {					
					thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCATTDOCUPLDSUCSSMSG"));
					thisCntrlr.dialog.close();
					thisCntrlr.dialog.destroy();
				} else if (oEvent.getParameters().status === 400) {
					thisCntrlr.showToastMessage($(oEvent.mParameters.responseRaw).find(oResource.getText(
						"S2CBCPSRCARMTYPEMESG"))[0].innerText);
					thisCntrlr.dialog.close();
					thisCntrlr.dialog.destroy();
				}
				thisCntrlr.getRefreshCBCdata(thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"))
						   .getData().Guid, thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid, "");
				thisCntrlr.onExpMEADoc();
				sap.ui.core.BusyIndicator.hide();
				var CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
				parseInt(CBCData.CbcStatus) !== 530 && parseInt(CBCData.CbcStatus) !== 540 ? thisCntrlr.refereshData(true, false, false): "";				
			},
			/**
			 * This method Handles CBC Questions Answer Event.
			 * @name onPressOMQues
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onPressOMQues: function(oEvent) {
				var AnsValue,
				    oResource = thisCntrlr.getResourceBundle(),
				    CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData(),
				    QuestionHead = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
					    "S2CBCPSRCARMSEPRATOR"))[2],
					QuestionItem = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
					    "S2CBCPSRCARMSEPRATOR"))[3];
				AnsValue = oEvent.getParameters().selectedIndex === 1 ?  oResource.getText("S2POSMANDATANS") :
					(oEvent.getParameters().selectedIndex === 2 ? oResource.getText("S2NEGMANDATANS") :
						(oEvent.getParameters().selectedIndex === 3 ? oResource.getText("S4DISCBCQUSNAANSKEY") : ""));
				CBCData.NAV_CBC_HEAD.results[QuestionHead].NAV_CBC_QAINFO.results[QuestionItem].OmAns = AnsValue;
			},
			/**
			 * This method Handles CBC Questions Answer Event.
			 * @name onPressOMQues
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onPressGpmQues: function(oEvent) {
				var AnsValue,
				    oResource = thisCntrlr.getResourceBundle(),
				    CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData(),
				    QuestionHead = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
					    "S2CBCPSRCARMSEPRATOR"))[2],
					QuestionItem = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
					    "S2CBCPSRCARMSEPRATOR"))[3];
				AnsValue = oEvent.getParameters().selectedIndex === 1 ?  oResource.getText("S2POSMANDATANS") :
					(oEvent.getParameters().selectedIndex === 2 ? oResource.getText("S2NEGMANDATANS") :
						(oEvent.getParameters().selectedIndex === 3 ? oResource.getText("S4DISCBCQUSNAANSKEY") : ""));
				CBCData.NAV_CBC_HEAD.results[QuestionHead].NAV_CBC_QAINFO.results[QuestionItem].GpmAns = AnsValue;
			},
			/**
			 * This method is used to handles CC check Box selection event.
			 * @name onSelectCB
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onSelectCB: function(oEvent) {
				var oResource = thisCntrlr.getResourceBundle(),
				    SelectedDes = oEvent.getParameters().selected,
				    Selectedline = oEvent.getSource().getBindingContext().sPath.split(oResource.getText("S2CBCPSRCARMSEPRATOR"))
				       [oEvent.getSource().getBindingContext().sPath.split(oResource.getText("S2CBCPSRCARMSEPRATOR")).length - 1];				
				switch (this.CbnType){
				case oResource.getText("S2ICONTABCBCTXT"):
					this.UnselectedRecord = {"results": []};
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
					break;
				case oResource.getText("S4DISCBCDLNKKEY"):
					var oCBCDlnkCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData().NAV_CBC_CC;
					for (var i = 0; i < oCBCDlnkCData.results.length; i++) {
						if (i === parseInt(Selectedline)) {
							if (SelectedDes === true) {
								oCBCDlnkCData.results[i].Selected = true;
							} else {
								oCBCDlnkCData.results[i].Selected = false;
							}
						}
					}
				    break;
				}
			},			
			/**
			 * This method is used to handles ok button event.
			 * @name onRelPerSpecRewOkPress
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onRelPerSpecRewOkPress: function(oEvent) {
				var oResource = thisCntrlr.getResourceBundle();
				switch (this.CbnType){
				case oResource.getText("S2ICONTABCBCTXT"):
				   var oTable1 = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISCBCCCTAB),
				       FinalRecord = {};
		           FinalRecord["NAV_CBC_CC"] = {"results": []};
		           var CBCCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCCCPYMODEL")).getData().results;
		           var CBCdata = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData();
		           for (var i = 0, n = 0; i < CBCCData.length; i++) {
			          if (CBCCData[i].Selected === true) {
				          FinalRecord.NAV_CBC_CC.results[n] = CBCCData[i];
				          n++;
			           }
		            }
		            FinalRecord.NAV_CBC_CC.results = FinalRecord.NAV_CBC_CC.results.concat(CBCdata.NAV_CBC_CC.results);
		            FinalRecord.NAV_CBC_CC.results = oCommonController.removeDuplicate(FinalRecord.NAV_CBC_CC.results);
		            this.closeDialog();
		            oTable1.setModel(this.getJSONModel(FinalRecord));
				   this.SelectedRecord.results.length = 0;
				   this.UnselectedRecord.results.length = 0;
				   break;
				case oResource.getText("S4DISCBCDLNKKEY"):
					var Msg = this.dialog.getContent()[1].getValue();
				    if(Msg.trim() !== ""){
					   var CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData().NAV_CBC_CC;;
					   var delValidFlag = thisCntrlr.getDlnkcheck(CBCData);
					   if(delValidFlag === false){
						   thisCntrlr.showToastMessage(oResource.getText("S2ALLDLINKOPPSELFAILMGS"));
				       } else {
				    	   var payload = thisCntrlr.getDLinkPayLoad(oResource.getText("S2ICONTABCBCTXT"), Msg, CBCData);
						   thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CCopyDLinkSet, com.amat.crm.opportunity
									.util.ServiceConfigConstants.write, payload, oResource.getText("S2CCDLNKSUSSMSG"));
						   thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid, "");
						   thisCntrlr.refereshData(true, false, false);
						   thisCntrlr.closeDialog();
				       }
				     } else {
					   thisCntrlr.showToastMessage(oResource.getText("S2ALLDLINKMANDATCOMM"));
				     }
				}
			},
			/**
			 * This method is used to Check DeLink Data.
			 * @name getDlnkcheck
			 * @param {Object} DelData - Process DeLink Data
			 * @returns {Boolean} chkSel - Boolean Flag
			 */
			getDlnkcheck: function(DelData){
				var chkSel = false;
				for(var i = 0; i < DelData.results.length ; i++){
				 	if(DelData.results[i].Selected === true){
				 		chkSel = true;
				 		break;
				 	}
				 }
				return chkSel;
			},
			/**
			 * This method is used to get DeLink PayLoad.
			 * @name getDLinkPayLoad
			 * @param {String} cType - Process Type, {String} comment - DeLink Comment, {String} prosData - Process Data
			 * @returns {Object} payLoad - DeLink PayLoad
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
				 for (var i = 0, n = 0; i < prosData.results.length; i++) {
					 if (prosData.results[i].Selected === true) {
						   var obj = {};
						   obj.Guid = prosData.results[i].Guid;
						   obj.OppDesc = "";
						   obj.ItemGuid = prosData.results[i].ItemGuid;
						   obj.OppId = prosData.results[i].OppId;
						   obj.ItemNo = "";
						   obj.RepFlag = "";
						   payload.NAV_CC_REMOVE.push(obj);
					 }
				 }
				 return payload;
			},
			/**
			 * This method Handles CBC Questions Comment Text On Live Change Event.
			 * @name onCBCTxtAreaLivChg
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onCBCOmTxtAreaLivChg: function(oEvent) {
				var oResource = thisCntrlr.getResourceBundle(),
				    OmCommentsVal  = thisCntrlr.checkComm(oEvent.getSource().getValue()),
				    CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData(),
				    QuestionHead = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
				    		"S2CBCPSRCARMSEPRATOR"))[2],
					QuestionItem = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
							"S2CBCPSRCARMSEPRATOR"))[3];
				CBCData.NAV_CBC_HEAD.results[QuestionHead].NAV_CBC_QAINFO.results[QuestionItem].OmComments = OmCommentsVal;
			},
			/**
			 * This method Handles CBC Questions Comment Text On Live Change Event.
			 * @name onCBCTxtAreaLivChg
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onCBCGpmTxtAreaLivChg: function(oEvent) {
				var oResource = thisCntrlr.getResourceBundle(),
				    GpmCommentsVal = thisCntrlr.checkComm(oEvent.getSource().getValue()),
				    CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData(),
				    QuestionHead = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
				    		"S2CBCPSRCARMSEPRATOR"))[2],
					QuestionItem = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
							"S2CBCPSRCARMSEPRATOR"))[3];
				CBCData.NAV_CBC_HEAD.results[QuestionHead].NAV_CBC_QAINFO.results[QuestionItem].GpmComments = GpmCommentsVal;
			},
			/**
			 * This method Handles CBC Questions Comment Text On Live Change Event.
			 * @name checkComm
			 * @param CommVal - Comment Value
			 * @returns CommVal(String)
			 */
			checkComm: function(CommVal){
				if(CommVal.trim() === ""){CommVal = "";}
				if(CommVal.length >= 255){
					var CommentsVal = CommVal.substr(0, 254).trim();
				    thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCMCOMMVALTXT"));}
				return CommVal;
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
					thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2GENCONTCTSLECFAILMSG"));
				} else {
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
				oCommonController.commonPressAddContact(oEvent, thisCntrlr, thisCntrlr.getResourceBundle().getText("S2CBCTABTXT"));
			},
			/**
			 * This method Handles Contact Dialog On Selection Event.
			 * @name contactSucess
			 * @param {String} Msg
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
				var oResource = thisCntrlr.getResourceBundle();
				var delFlag = thisCntrlr.checkMContact(oEvent.getParameters().listItem.getBindingContext().getPath().split("/")[1].
						split("_")[1], oResource.getText("S2PSRDCNADEFERKEY"));
				if (delFlag[0] === true) {
					thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCCONTACTDELNEGMSG"));
				} else {
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
				    CBCdata = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData(),
					minDFlag = false,
					minSFlag = false;
				if (mCheckTyp === oResource.getText("S2PSRDCNADEFERKEY")) {
					switch (mConType) {
					case oResource.getText("S4DISCBCOMKEY"):
						minDFlag = CBCdata.NAV_CBCOM.results.length === 1 ? true : false;
						break;
					case oResource.getText("S4DISCBCGPMKEY"):
						minDFlag = CBCdata.NAV_CBCGPM.results.length === 1 ? true : false;
						break;
					}
				} else if (mCheckTyp === oResource.getText("S2CBCANSSUCCESSKEY")) {
					if (CBCdata.NAV_CBCOM.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, oResource.getText("S4DISCBCOMKEY")];
						return minSFlag;
					}
					if (CBCdata.NAV_CBCGPM.results.length > 0) minSFlag = [true, ""];
					else {
						minSFlag = [false, oResource.getText("S4DISCBCGPMKEY")];
						return minSFlag;
					}
				}
				if (mConType === "" && minSFlag[0] === true) {
					return minSFlag;
				}
				return [minDFlag, minSFlag];
			},
			/**
			 * This method is used to handles CBC Carbon Copy F4 Help.
			 * @name handleValueHelpCBCCbnCpyRew
			 * @param
			 * @returns
			 */
			handleValueHelpCBCCbnCpyRew: function() {
				var oResource = thisCntrlr.getResourceBundle(),
				    ItemGuid = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid,
				    sGenaralChoos = oResource.getText("S4DISRRACUTDOCLINKPTH") + ItemGuid + oResource.getText("S4DISCBCCUTDOCLINKPTH1");
				this.CbnType = this.getResourceBundle().getText("S2ICONTABCBCTXT");
				this.serviceDisCall(sGenaralChoos, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				var CCTableData = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISCBCCCTAB).getModel().getData().NAV_CBC_CC.results;
				var CBCCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCCCPYMODEL")).getData();
				for (var i = 0; i < CBCCData.results.length; i++) {
					for (var j = 0; j < CCTableData.length; j++) {
						if (CBCCData.results[i].OppId === CCTableData[j].OppId && CBCCData.results[i].ItemNo ===
							CCTableData[j].ItemNo) {
							CBCCData.results[i].Selected = true;
						}
					}
					CBCCData.results[i].Selected === undefined ? CBCCData.results[i].Selected = false : "";
				}
				this.dialog = sap.ui.xmlfragment(oResource.getText("PSRCBCCCF4helpOppLink"), this);
				this.dialog.getContent()[2].getColumns()[0].setVisible(true);
				this.dialog.getContent()[2].getColumns()[2].setVisible(true);
				this.dialog.getSubHeader().setVisible(true);
				this.getCurrentView().addDependent(this.dialog);
				var oCBCCbnCpyModel = this.getJSONModel(thisCntrlr.getModelFromCore(oResource.getText("GLBCBCCCPYMODEL")).getData());
				this.dialog.setModel(oCBCCbnCpyModel);
				this.dialog.open();
			},
			/**
			 * This method is used to handles Search functionality.
			 * @name searchOpportunity
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			searchOpportunity: function(oEvent) {
				oCommonController.commonsearchOpportunity(oEvent, thisCntrlr);
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
			 * This method Handles Search Contact Button Event.
			 * @name searchContact
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			searchContact: function(oEvent) {
				var oEventParameters = oEvent.getParameters(),
				    oResource = thisCntrlr.getResourceBundle(),
				    searchText, contactData,
				    contactType = oEvent.getSource().getParent().getParent().getParent().getController().contactType;
				if (oEventParameters.hasOwnProperty(oResource.getText("S2TYPECONTCTPROPTXT"))) {
					searchText = oEventParameters.newValue;
					if (searchText.length < 3) return;
				} else searchText = oEventParameters.query;
				this.contactF4Fragment.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
					"ItemSet": []});
				var sContact = oResource.getText("S4DISRRACONSRHPTH") + searchText + oResource.getText("S4DISRRACONSRHPTH2") + contactType + "'";
				if (searchText.length != 0) {
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
			 * This method uses to reset CBC tab button Color.
			 * @name CbcTabColorInit
			 * @param
			 * @returns
			 */
			CbcTabColorInit: function () {
				var CbcData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBCBCMODEL")).getData();
				var CbcTab = thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISCBC);
				switch (parseInt(CbcData.CbcStatus)) {
				case 500:
				case 525:
				case 527:
					CbcTab.setIconColor(sap.ui.core.IconColor.Critical);
					break;
				case 530:
				case 560:
					CbcTab.setIconColor(sap.ui.core.IconColor.Positive);
					break;
				default:
					CbcTab.setIconColor(sap.ui.core.IconColor.Default);
				}
			},
			/**
			 * This method Handles Unlink Button Event.
			 * @name onPressUnLinkDoc
			 * @param
			 * @returns
			 */
			onPressCBCUnLinkDoc: function() {
				this.CbnType = "";				
				var oResource = thisCntrlr.getResourceBundle(),
				    DlnkCData = thisCntrlr.getModelFromCore(oResource.getText("GLBCBCMODEL")).getData().NAV_CBC_CC;
				this.CbnType = oResource.getText("S4DISCBCDLNKKEY");
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
			 * This method is handling DeLink Mandatory Comment Live Change Event.
			 * @name OnDlinkCommLvchng
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			OnDlinkCommLvchng: function(oEvent){
				var oResource = thisCntrlr.getResourceBundle();
				if (oEvent.getSource().getValue().length >= 255) {
					var DlinkCommTxt = oEvent.getSource().getValue().substr(0, 254);				
					this.dialog.getContent()[1].setValue(DlinkCommTxt);
					thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCMCOMMVALTXT"));
				} else {
					this.dialog.getContent()[1].setValue(oEvent.getSource().getValue());
					if(oEvent.getSource().getValue().trim().length <= 0){
						this.dialog.getContent()[1].setValueState(oResource.getText("S2ERRORVALSATETEXT"));
						this.dialog.getButtons()[0].setEnabled(false);
					} else {
						this.dialog.getContent()[1].setValueState(oResource.getText("S2DELNAGVIZTEXT"));
						this.dialog.getButtons()[0].setEnabled(true);
					}
				}
			},
			/**
			 * This method Handles CBC form print functionality.
			 * @name onPressPrintCBC
			 * @param
			 * @returns
			 */
			onPressPrintCBC: function(){
				sap.m.MessageBox.confirm(thisCntrlr.bundle.getText("S2CBCPRINTREQIREDVALIDATIONTXT"),
						this.confirmationCBCPrint, thisCntrlr.bundle.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
			},
			/**
			 * This method Handles CBC Print validation OK button press event.
			 * @name confirmationCBCPrint
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			confirmationCBCPrint : function(oEvent){
				var oResource = thisCntrlr.getResourceBundle();
				if(oEvent === oResource.getText("S2CONFFRGOKBTN")){
					var oModel = thisCntrlr.getDataModels();
					var url = thisCntrlr.disModel.sServiceUrl + oResource.getText("S4DISPRINTFRMPTH") +
					   thisCntrlr.getOwnerComponent().ItemGuid + oResource.getText("S4DISCBCPRINTFRMPTH1") +
					   oResource.getText("S4DISPRINTFRMPTH2") + oModel[2].Version.slice(-3) + "')/$value";
				    window.open(url);
				}
			}
	});
});