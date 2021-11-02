/**
 * This class holds all methods of carm page.
 *
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends com.amat.crm.opportunity.controller.BaseController
 * @name com.amat.crm.opportunity.controller.carm
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
 * 18/12/2018      Abhishek        PCR021481         Q2C Q1/Q2 enhancements       *
 *                 Pant                                                           *
 * 26/09/2019      Abhishek        PCR025717         Q2C Q4 2019 Enhancements     *
 *                 Pant                                                           *
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 ***********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController",
	"com/amat/crm/opportunity/controller/CommonController", "sap/m/MessageBox", 'sap/ui/model/json/JSONModel'
], function(Controller, CommonController, MessageBox, JSONModel) {
	"use strict";
	var thisCntrlr,
		that_views2, oCommonController, That_ITBar, That_ITBar_CARM;
	return Controller.extend("com.amat.crm.opportunity.controller.carm", {
		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */
		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 * 
		 * @memberOf view.carm
		 */
		onInit: function() {
			thisCntrlr = this;
			thisCntrlr.bundle = this.getResourceBundle();
			//that_views2 = this.getOwnerComponent().s2;                                                                                 //PCR026243--
			thisCntrlr.colFlag = [false, false, false, false, false, false,
				false, false, false, false, false, false, false, false
			];
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
		 * This Method used to check CARM Initiate Status.
		 * 
		 * @name checkCarmInitiate
		 * @param 
		 * @returns 
		 */
		checkCarmInitiate: function() {
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C****************
			//if (that_views2 === undefined) {
			//	that_views2 = this.getOwnerComponent().s2;
			//}
			if(this.getOwnerComponent().OppType === thisCntrlr.bundle.getText("S4DISOPPTYPTXT")){
				that_views2 = this.getOwnerComponent().s4;
				That_ITBar_CARM = that_views2.byId(com.amat.crm.opportunity.Ids.S4DISCARM);
				That_ITBar = that_views2.byId(com.amat.crm.opportunity.Ids.S4DISICNTAB);
			} else {
				that_views2 = this.getOwnerComponent().s2;
				That_ITBar_CARM = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM);
				That_ITBar = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB);
			}
			//************************End Of PCR026243: DL:1803 Display Migration to Q2C******************
			var oResource = thisCntrlr.bundle;
			var oView = thisCntrlr.getView();
			//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_RADIOBtn).setSelectedIndex(0);                                            //PCR021481--
			var sValidate = "CARM_InfoSet(Guid=guid'" + thisCntrlr.getModelFromCore(oResource.getText(
				"GLBOPPGENINFOMODEL")).getData().Guid + "',ItemGuid=guid'" + thisCntrlr.getModelFromCore(oResource
				.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid + "')?$expand=NAV_CARM_DOCS,NAV_CARM_CHNG_HIST";                         //PCR021481++; Navigation NAV_CARM_CHNG_HIST added for Change history
			this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			thisCntrlr.carmValidate = {};
			thisCntrlr.carmValidate = thisCntrlr.getModelFromCore(oResource.getText("GLBCARMMODEL")).getData();
			//************Start Of PCR021481: Q2C Q1/Q2 enhancements ******************
			var MCommType = thisCntrlr.bundle.getText("S2MLIMCOMMDATATYP");
			var oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_COMMTABLE);
			var ItemGuid = thisCntrlr.carmValidate.ItemGuid;
		    var sValidate = "CommentsSet?$filter=ItemGuid eq guid'" + ItemGuid + "'and CommType eq '" + MCommType +"'";
		    this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
		    var MComModel = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBCARMCOMMMODEL"));
		    oTable.setModel(MComModel);	
		    this.getView().byId(com.amat.crm.opportunity.Ids.S2CARM_PANL_ChangeHisTab).setModel(this.getJSONModel(thisCntrlr.carmValidate.NAV_CARM_CHNG_HIST));
		    //************End Of PCR021481: Q2C Q1/Q2 enhancements ******************
			var Bar = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_STATUSBAR);
			var statusText = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_STATUS_TEXT);
			//var carmDecisionBox = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DECISION_HBOX);                                     //PCR021481--
			var carmDecisionContent = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DECISION_VBOX);
			//var EditBtn = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn);                                                  //PCR021481--
			//var SaveBtn = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn);                                                  //PCR021481--
			var cancelBtn = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CANCEL_Btn);
			thisCntrlr.oCarmAttTable = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
			Bar.setVisible(false);
			var SecurityData = thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();
			oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
			//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_RADIOBtn).setEnabled(true);                                               //PCR021481--
			var datePicker = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER);
			datePicker.setDateValue(null);
			datePicker.setValueState(sap.ui.core.ValueState.None);
			var carmDocData = [], carmAttFlag = false;                                                                                      //PCR025717++; carmAttFlag variable added
			for (var i = 0; i < thisCntrlr.carmValidate.NAV_CARM_DOCS.results.length; i++) {
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
					"editable": false
				};
				doc.Guid = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].Guid;
				doc.DocId = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].DocId;
				doc.docsubtype = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].DocSubtype;
				doc.itemguid = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].ItemGuid;
				doc.DocDesc = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].DocDesc;
				doc.doctype = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].DocType;
				doc.filename = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].FileName;
				doc.OriginalFname = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].OriginalFname;
				doc.note = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].Notes;
				doc.DocSortno = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].DocSortno;
				doc.uBvisible = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].FileName === "" ? true : false;
				doc.bgVisible = !doc.uBvisible;
				carmAttFlag === false && thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].FileName !== "" ? carmAttFlag = true : "";             //PCR025717++
				carmDocData.push(doc);
			}
			var oCarmAttJModel = this.getJSONModel({
				"ItemSet": carmDocData
			});
			thisCntrlr.oCarmAttTable.setModel(oCarmAttJModel);
			for (var i = 0; i < thisCntrlr.oCarmAttTable.getModel().getData().ItemSet.length; i++) {
				thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
				thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
					.items[0].setIcon(oResource.getText("S2PSRSDAEDITICON"));
				thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
					.items[1].setIcon(oResource.getText("S2PSRSDADELETEICON"));
				thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
					.items[2].setVisible(true);
			}
			if (thisCntrlr.carmValidate.Required === "" && thisCntrlr.carmValidate.Status === "") {
				var oViewModel = new JSONModel({
					busy: true,
					delay: 0,
					BarVis: true,
					CancelBtnVis: false,
					DatPicEnabled: true,
					NRBtnSelect: false,
					NRBtnVluStat: oResource.getText("S2ERRORVALSATETEXT"),
					NRBtnSelectVis: thisCntrlr.carmValidate.MeetDate !== "" && thisCntrlr.carmValidate.MeetDate !== 
						oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT") ? false : true,
					MPPNDateVis: thisCntrlr.carmValidate.MeetDate !== "" && thisCntrlr.carmValidate.MeetDate !== 
						oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT") ? false : true,
					MPPNDateTxt: oResource.getText("S2CARMAWTMPPTXT"),
					StatusText: oResource.getText("S2CARMAWTMPPDTSTATUSTXT"),
					CarmDecisionContentVis: true,
					DisplayVis: true,
					AttachPnlVis: true,
					AttachPnlExp: carmAttFlag,                                                                                                      //PCR025717++
					OtherBtnEbl: true,
					MainCommExp: MComModel.getData().results.length > 0 ? true : false,
					ChngHisVis: true,
					ChngHisExp: false
				});
				oView.setModel(oViewModel, "appView");
				//that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Default);                           //PCR026243--
				That_ITBar_CARM.setIconColor(sap.ui.core.IconColor.Default);                                                                           //PCR026243++
				//**** Start of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
				//Bar.setVisible(false);
				//carmDecisionContent.setVisible(false);
				//carmDecisionBox.setVisible(true);
				//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DECISION_HBOX).setVisible(true);
				//if (thisCntrlr.getModelFromCore(oResource.getText("GLBOPPPSRINFOMODEL")).getData().OppStatus ===
				//	oResource.getText("S2TYPEOFOPPBOOKEDTXT") && thisCntrlr.carmValidate.Required === "") {
				//	that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Negative);
				//    carmDecisionBox.setVisible(true);                                                                                    
			    //    carmDecisionContent.setVisible(false);                                                                               
				//}
				//if (SecurityData.InitCarm !== oResource.getText("S1TABLESALESTAGECOL")) {
				//    oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_RADIOBtn).setEnabled(false);                                     
				//    oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_RADIOBtn).setTooltip(oResource                                   
				//	      .getText("GLBOPPPSRINFOMODEL"))                                                                                    
				//}
				//**** End of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
			} else {
				if (parseInt(thisCntrlr.carmValidate.Status) === 97) {
					//that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Positive);                       //PCR026243--
					That_ITBar_CARM.setIconColor(sap.ui.core.IconColor.Positive);                                                                       //PCR026243++
					Bar.addStyleClass(oResource.getText("S2PSRSDABARINITCLS"));
					var oViewModel = new JSONModel({
						busy: true,
						delay: 0,
						BarVis: true,
						CancelBtnVis: true,
						DatPicEnabled: true,
						NRBtnSelect: false,
						NRBtnVluStat: oResource.getText("S2ERRORVALSATETEXT"),
						NRBtnSelectVis: thisCntrlr.carmValidate.MeetDate !== "" && thisCntrlr.carmValidate.MeetDate !== 
							oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT") ? false : true,
						MPPNDateVis: thisCntrlr.carmValidate.MeetDate !== "" && thisCntrlr.carmValidate.MeetDate !== 
							oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT") ? false : true,
						MPPNDateTxt: oResource.getText("S2CARMAWTMPPTXT"),
						StatusText: oResource.getText("S2PCBCNTREQSTATTXT"),
						CarmDecisionContentVis: true,
						DisplayVis: false,
						AttachPnlVis: false,
						AttachPnlExp: carmAttFlag,                                                                                                       //PCR025717++
						OtherBtnEbl: true,
						MainCommExp: MComModel.getData().results.length > 0 ? true : false,
						ChngHisVis: false
					});
					oView.setModel(oViewModel, "appView");
					cancelBtn.setText(oResource.getText("S2CARMNACANINITBTNTXT"));
					//**** Start of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
					//statusText.setText(oResource.getText("S2PCBCNTREQSTATTXT"));
					//Bar.setVisible(true);
					//EditBtn.setVisible(false);
					//cancelBtn.setVisible(true);
					//cancelBtn.setText(oResource.getText("S2PSRSDASFCANINITXT"));
					//SaveBtn.setVisible(false);
					//carmDecisionBox.setVisible(false);
					//carmDecisionContent.setVisible(true);
					//carmDecisionContent.setVisible(false);
					//for (var i = 0; i < thisCntrlr.oCarmAttTable.getModel().getData().ItemSet.length; i++) {
					//	//thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
					//	if (SecurityData.DelCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
					//		thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
					//			.items[1].setVisible(false);
					//	} else {
					//		thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
					//			.items[1].setVisible(true);
					//		thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
					//			.items[1].setEnabled(true);
					//	}
					//	if (SecurityData.ViewCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
					//		thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[1].setEnabled(false);
					//	} else {
					//		thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[1].setEnabled(true);
					//	}
					//	if (SecurityData.UpldCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
					//		thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[0].setVisible(false);
					//		thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[1].setVisible(false);
					//		thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[2].setVisible(false);
					//		oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setVisible(false);
					//	} else {
					//		thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[0].setVisible(true);
					//		thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[1].setVisible(true);
					//		thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[2].setVisible(true);
					//		oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setVisible(true);
					//	}
					//}
					//**** End of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
				} else if (parseInt(thisCntrlr.carmValidate.Status) === 95) {
					//that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Critical);                        //PCR026243--
					That_ITBar_CARM.setIconColor(sap.ui.core.IconColor.Critical);                                                                        //PCR026243++
					var oViewModel = new JSONModel({
						busy: true,
						delay: 0,
						BarVis: true,
						CancelBtnVis: false,
						DatPicEnabled: true,
						NRBtnSelect: false,
						NRBtnVluStat: oResource.getText("S2ERRORVALSATETEXT"),
						NRBtnSelectVis: thisCntrlr.carmValidate.MeetDate !== "" && thisCntrlr.carmValidate.MeetDate !== 
							oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT") ? false : true,
						MPPNDateVis: thisCntrlr.carmValidate.MeetDate !== "" && thisCntrlr.carmValidate.MeetDate !== 
							oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT") ? false : true,
						MPPNDateTxt: oResource.getText("S2CARMAWTMPPTXT"),
						StatusText: oResource.getText("S2PCARMINITSTATTXT"),
						CarmDecisionContentVis: true,
						DisplayVis: true,
						AttachPnlVis: true,
						AttachPnlExp: carmAttFlag,                                                                                                        //PCR025717++
						OtherBtnEbl: true,
						MainCommExp: MComModel.getData().results.length > 0 ? true : false,
						ChngHisVis: true
					});
					oView.setModel(oViewModel, "appView");
					//**** Start of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
					//statusText.setText(oResource.getText("S2PCARMINITSTATTXT"));
					//Bar.setVisible(true);
					//EditBtn.setVisible(true);
					//EditBtn.setEnabled(true);
					//cancelBtn.setVisible(true);
					//SaveBtn.setVisible(false);
					//carmDecisionBox.setVisible(false);
					//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(false);
					//for (var i = 0; i < thisCntrlr.oCarmAttTable.getModel().getData().ItemSet.length; i++) {
					//	thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
					//	if (SecurityData.DelCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
					//		thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
					//			.items[1].setVisible(false);
					//	} else {
					//		thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
					//			.items[1].setVisible(true);
					//		thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
					//			.items[1].setEnabled(true);
					//	}
					//	if (SecurityData.ViewCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
					//		thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[1].setEnabled(false);
					//	} else {
					//		thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[1].setEnabled(true);
					//	}
					//	if (SecurityData.UpldCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
					//		thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[0].setVisible(false);
					//		thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[1].setVisible(false);
					//		thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[2].setVisible(false);
					//		oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setVisible(false);
					//	} else {
					//		thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[0].setVisible(true);
					//		thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[1].setVisible(true);
					//		thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[2].setVisible(true);
					//		oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setVisible(true);
					//	}
					//}
					//**** End of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
				} else if (parseInt(thisCntrlr.carmValidate.Status) === 96) {
					//that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Positive);                   //PCR026243--
					That_ITBar_CARM.setIconColor(sap.ui.core.IconColor.Positive);                                                                   //PCR026243++
					var oViewModel = new JSONModel({
						busy: true,
						delay: 0,
						BarVis: true,
						CancelBtnVis: false,
						DatPicEnabled: true,
						NRBtnSelect: false,
						NRBtnVluStat: oResource.getText("S2ERRORVALSATETEXT"),
						NRBtnSelectVis: thisCntrlr.carmValidate.MeetDate !== "" && thisCntrlr.carmValidate.MeetDate !== 
							oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT") ? false : true,
						MPPNDateVis: thisCntrlr.carmValidate.MeetDate !== "" && thisCntrlr.carmValidate.MeetDate !== 
							oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT") ? false : true,
						MPPNDateTxt: oResource.getText("S2CARMAWTMPPTXT"),
						StatusText: oResource.getText("S2PCARMFCOMPTESTATTXT"),
						CarmDecisionContentVis: true,
						DisplayVis: true,
						AttachPnlVis: true,
						AttachPnlExp: carmAttFlag,                                                                                                      //PCR025717++
						OtherBtnEbl: true,
						MainCommExp: MComModel.getData().results.length > 0 ? true : false,
						ChngHisVis: true
					});
					oView.setModel(oViewModel, "appView");
					//**** Start of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
					//Bar.setVisible(true);
					//EditBtn.setVisible(false);
					//cancelBtn.setVisible(false);
					//SaveBtn.setVisible(false);
					//carmDecisionBox.setVisible(false);
					//carmDecisionContent.setVisible(true);
					//datePicker.setEnabled(true);
					//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(false);
					//if (oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel() !==
					//	undefined) {
					//	for (var i = 0; i < oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE)
					//		.getModel().getData().ItemSet.length; i++) {
					//		oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel().getData()
					//			.ItemSet[i].editable = true;
					//	}
					//	oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel().refresh(
					//		true);
					//}
					//**** End of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
					for (var i = 0; i < thisCntrlr.oCarmAttTable.getModel().getData().ItemSet.length; i++) {
						//thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);                               //PCR021481--
						thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(true);                                  //PCR021481++
						if (SecurityData.DelCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
							thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
								.items[1].setVisible(false);
						} else {
							thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
								.items[1].setVisible(true);
							thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
								.items[1].setEnabled(true);
						}
						if (SecurityData.ViewCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
							thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[1].setEnabled(false);
						} else {
							thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[1].setEnabled(true);
						}
						if (SecurityData.UpldCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
							thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[1].mAggregations
								.items[0].setVisible(false);
							thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
								.items[2].setVisible(false);
							oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setVisible(false);
						} else {
							thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[1].mAggregations
								.items[0].setVisible(true);
							thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
								.items[2].setVisible(true);
							oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setVisible(true);
						}
					}
				}
				//**** Start of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
				//datePicker.setEnabled(false);
				//if (thisCntrlr.carmValidate.MeetDate === oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT")) {
				//	if (thisCntrlr.tempDate != null) {
				//		oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(new Date(
				//			thisCntrlr.tempDate));
				//	} else {
				//		oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(null);
				//	}
				//} else {
				//	oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(new Date(
				//		thisCntrlr.carmValidate.MeetDate.slice(0, 4), thisCntrlr.carmValidate.MeetDate.slice(4, 6) - 1,
				//		thisCntrlr.carmValidate.MeetDate.slice(6, 8)));
				//}
				//**** End of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
			}
			if (thisCntrlr.carmValidate.Commetns === "" && thisCntrlr.carmValidate.MeetDate === oResource.getText(
					"S2ATTACHPSRCBDATESTRNGTEXT")) {
				oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(thisCntrlr.carmDate);
			}
			//**** Start of PCR021481++ : 4190: Q2C Q1/Q2 enhancements ***********
			//datePicker.setEnabled(true);                                                                                                       //PCR021481--
			if (thisCntrlr.carmValidate.MeetDate === oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT")) {
				if (thisCntrlr.tempDate != null) {
					datePicker.setDateValue(new Date(thisCntrlr.tempDate));
				} else {
					datePicker.setDateValue(null);
				}
			} else {
				if(thisCntrlr.carmValidate.MeetDate !== ""){
					datePicker.setDateValue(new Date(thisCntrlr.carmValidate.MeetDate.slice(0, 4),
							thisCntrlr.carmValidate.MeetDate.slice(4, 6) - 1, thisCntrlr.carmValidate.MeetDate.slice(6, 8)));
				    }
			}
			oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
			for (var i = 0; i < oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel()
			.getData().ItemSet.length; i++) {
			oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel().getData()
				.ItemSet[i].editable = true;
		     }
		    oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel().refresh(true);
		    for (var i = 0; i < thisCntrlr.oCarmAttTable.getModel().getData().ItemSet.length; i++) {
				thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(true);
				if (SecurityData.DelCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
					thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
						.items[1].setVisible(false);
				} else {
					thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
						.items[1].setVisible(true);
					thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
						.items[1].setEnabled(true);
				}
				if (SecurityData.ViewCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
					thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[1].setEnabled(false);
				} else {
					thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[1].setEnabled(true);
				}
				if (SecurityData.UpldCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
					thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[0].setVisible(false);
					thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[1].setVisible(false);
					thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[2].setVisible(false);
					oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setVisible(false);
				} else {
					thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[0].setVisible(true);
					thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[1].setVisible(true);
					thisCntrlr.oCarmAttTable.getItems()[i].getCells()[3].getItems()[0].getItems()[2].setVisible(true);
					oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setVisible(true);
				}
			}
		  //**** End of PCR021481++ : 4190: Q2C Q1/Q2 enhancements ***********
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
		//***************Start Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
		/**
		 * This Method is use on PDC Cancel Initiation dialog box Ok Button press event.
		 *  
		 * @name confirmationCanInit
		 * @param Event - Holds the current event
		 * @returns 
		 */
		confirmationCARMCanInit: function(oEvent) {
			if(oEvent === thisCntrlr.getResourceBundle().getText("S2CONFFRGOKBTN")){
				thisCntrlr.carmDate = null;
				thisCntrlr.carmMainCom = "";
				var sDelete = "/CARM_InfoSet(Guid=guid'" + thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText(
					"GLBOPPGENINFOMODEL")).getData().Guid + "',ItemGuid=guid'" + thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle()
					.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid + "')";
				thisCntrlr.serviceCall(sDelete, com.amat.crm.opportunity.util.ServiceConfigConstants.remove, "", thisCntrlr.getResourceBundle()
					.getText("S2PCBCCANCELSTATTXT"));
				thisCntrlr.checkCarmInitiate();
			}
		},
		/**
		 * This Method Handles CARM Cancel Button Event.
		 * 
		 * @name onCancelCarm
		 * @param evt - Event Handler
		 * @returns 
		 */
		onCancelCarm: function(evt) {
			var Mesg = thisCntrlr.bundle.getText("S2CANINITMSG1") + thisCntrlr.bundle.getText("S2CARMCANINITMSG2");
			sap.m.MessageBox.confirm(Mesg, this.confirmationCARMCanInit, thisCntrlr.bundle.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
			//thisCntrlr.carmDate = null;
			//thisCntrlr.carmMainCom = "";
			//var sDelete = "/CARM_InfoSet(Guid=guid'" + thisCntrlr.getModelFromCore(this.getResourceBundle().getText(
			//	"GLBOPPGENINFOMODEL")).getData().Guid + "',ItemGuid=guid'" + thisCntrlr.getModelFromCore(this.getResourceBundle()
			//	.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid + "')";
			//this.serviceCall(sDelete, com.amat.crm.opportunity.util.ServiceConfigConstants.remove, "", this.getResourceBundle()
			//	.getText("S2PCBCCANCELSTATTXT"));
			//thisCntrlr.checkCarmInitiate();
			//***************End Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements ********
		},
		/**
		 * This method Used to Validate PSR-SDA Initiate Event.
		 * 
		 * @name validateInitiate
		 * @param 
		 * @returns initiateFlag - Binary Flag
		 */
		validateInitiate: function() {
			var GenInfoData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData();
			var initiateFlag = false;
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C****************
			//if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === this.getResourceBundle()
			//	.getText("S2ICONTABCARMKEY")) {
//			if (That_ITBar.getSelectedKey() === this.getResourceBundle().getText("S2ICONTABCARMKEY")) {
			if(this.getOwnerComponent().context.disFlag === this.getResourceBundle().getText("S1TABLESALESTAGECOL")){
				var omInitiateFlag = this.checkContact(GenInfoData.NAV_OM_INFO.results);
				var GpmInitiateFlag = this.checkContact(GenInfoData.NAV_GPM_INFO.results);
				var salesInitiateFlag = this.checkContact(GenInfoData.NAV_SLS_INFO.results);
				(omInitiateFlag === true ||  GpmInitiateFlag === true ||
						salesInitiateFlag === true) ? (initiateFlag = true) : (initiateFlag = false);
			} else {
			//************************End Of PCR026243: DL:1803 Display Migration to Q2C******************
				var romInitiateFlag = this.checkContact(GenInfoData.NAV_ROM_INFO.results);
				var POMInitiateFlag = this.checkContact(GenInfoData.NAV_POM_INFO.results);
				var BMOInitiateFlag = this.checkContact(GenInfoData.NAV_BMO_INFO.results);
				var salesInitiateFlag = this.checkContact(GenInfoData.NAV_SALES_INFO.results);
				(romInitiateFlag === true || POMInitiateFlag === true || BMOInitiateFlag === true ||
					salesInitiateFlag === true) ? (initiateFlag = true) : (initiateFlag = false);
			}
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C****************
			//} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === this.getResourceBundle()
			//	.getText("S2ICONTABPSRSDAKEY")) {
//			} 
//			else if (That_ITBar.getSelectedKey() === this.getResourceBundle().getText("S2ICONTABPSRSDAKEY")) {
//			//************************End Of PCR026243: DL:1803 Display Migration to Q2C******************
//				var romUserList = GenInfoData.NAV_ROM_INFO.results;
//				var salesUserList = GenInfoData.NAV_SALES_INFO.results;
//				var romInitiateFlag = this.checkContact(romUserList);
//				var salesInitiateFlag = this.checkContact(salesUserList);
//				(romInitiateFlag === true || salesInitiateFlag === true) ? (initiateFlag = true) : (initiateFlag =
//					false);
//				this.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_RADIOBtnGrp).setSelectedIndex(-1);
//			} else {
//				var gmoUserList = GenInfoData.NAV_BMO_INFO.results;
//				var initiateFlag = this.checkContact(gmoUserList);
//			}
			return initiateFlag;
		},
		/**
		 * This Method Handles CARM Edit Button Event.
		 * 
		 * @name onEditCarm
		 * @param 
		 * @returns 
		 */
		onEditCarm: function() {
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C****************
			//var initiateFlag = this.validateInitiate();
			var oView = thisCntrlr.getView();
			//if (initiateFlag === false) {
			//	thisCntrlr.showToastMessage(this.getResourceBundle().getText("S2CARMCHECKFAILMSG"));
			//} else {
			//************************End Of PCR026243: DL:1803 Display Migration to Q2C****************
				var date = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER);
				date.setEnabled(true);
				var SaveBtn = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn);
				SaveBtn.setEnabled(true);
				SaveBtn.setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(false);
				oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
				for (var i = 0; i < oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel()
					.getData().ItemSet.length; i++) {
					oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel().getData()
						.ItemSet[i].editable = true;
				}
				oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel().refresh(
					true);
				for (var i = 0; i < oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel()
					.getData().ItemSet.length; i++) {
					if (oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel().getData()
						.ItemSet[i].uBvisible === true) {
						oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).mAggregations.items[
							i].mAggregations.cells[2].setEnabled(true);
					} else {
						oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).mAggregations.items[
							i].mAggregations.cells[2].setEnabled(false);
					}
				}
			//}                                                                                                                   //PCR026243--
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
		 * This Method Handles CARM Save Button Event.
		 * 
		 * @name onSaveCarm
		 * @param 
		 * @returns 
		 */
		onSaveCarm: function() {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var initiateFlag = this.validateInitiate();
			var oResource = thisCntrlr.bundle;
			var oView = thisCntrlr.getView();
			var GenInfoData = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();
			if (initiateFlag === false) {
				thisCntrlr.showToastMessage(oResource.getText("S2CARMCHECKFAILMSG"));
			} else {
				if (oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).getDateValue() ===
					null) {
					thisCntrlr.showToastMessage(oResource.getText("S1CARMDATECHECK"));
					//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(false);                                            //PCR021481--
					oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(false);                                              //PCR021481++
					oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setValueState(sap.ui.core
						.ValueState.Error);
					myBusyDialog.close();
					return;
				} else {
					Date.prototype.yyyymmdd = function() {
						var mm = this.getMonth() + 1;
						var dd = this.getDate();
						return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
					};
					var Bar = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_STATUSBAR);
					var statusText = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_STATUS_TEXT);
					//var carmDecisionBox = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DECISION_HBOX);                                   //PCR021481--
					var carmDecisionContent = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DECISION_VBOX);
					//var EditBtn = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn);                                                //PCR021481--
					var SaveBtn = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn);
					//var CancelBtn = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CANCEL_Btn);                                            //PCR021481--
					//that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Positive);                 //PCR026243--
					That_ITBar_CARM.setIconColor(sap.ui.core.IconColor.Positive);                                                                 //PCR026243++
					if (oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).getDateValue() ===
						null || oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).getDateValue() ===
						"") {
						thisCntrlr.showToastMessage(oResource.getText("S2CARMMETINGHELDDATMSG"));
						//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(false);                                        //PCR021481--						
						oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setValueState(sap.ui.core
							.ValueState.Error);
						myBusyDialog.close();
						return;
					}
					var date = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER);
					var oEntry = {
						Guid: GenInfoData.Guid,
						StatDesc: "",
						ItemGuid: GenInfoData.ItemGuid,
						OppId: thisCntrlr.OppId,
						ItemNo: thisCntrlr.ItemNo,
						Required: "",
						Status: "96",
						MeetDate: date.getDateValue().yyyymmdd(),
						Commetns: ""
					};
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CARMInfoSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, oEntry, oResource.getText("S2CARMSAVEWFMSAG")
					);
					thisCntrlr.checkCarmInitiate();
					SaveBtn.setVisible(false);                                                                                                     //PCR021481++
				}
			}
			myBusyDialog.close();
		},
		/**
		 * This Method Handles Radio Button Group Event.
		 * 
		 * @name onCarmSelect
		 * @param evt - Event Handler
		 * @returns 
		 */
		onCarmSelect: function(evt) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var initiateFlag = this.validateInitiate();
			var oResource = thisCntrlr.bundle;
			var oView = thisCntrlr.getView();
			var GenInfoData = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();
			if (initiateFlag === false) {
				thisCntrlr.showToastMessage(oResource.getText("S2CARMCHECKFAILMSG"));
				//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_RADIOBtn).setSelectedIndex(-1);                                             //PCR021481--
			} else {
				var Bar = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_STATUSBAR);
				var statusText = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_STATUS_TEXT);
				//var carmDecisionBox = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DECISION_HBOX);                                        //PCR021481--
				var carmDecisionContent = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DECISION_VBOX);
				//var EditBtn = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn);                                                     //PCR021481--
				//var SaveBtn = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn);                                                     //PCR021481--
				var CancelBtn = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CANCEL_Btn);
				//carmDecisionBox.setVisible(true);                                                                                                //PCR021481--
				carmDecisionContent.setVisible(true);
				Bar.setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setValueState(sap.ui.core
					.ValueState.None);
				var SecurityData = thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();
				//var iconTabBtn = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB);                                                        //PCR026243--
				var iconTabBtn = That_ITBar;                                                                                                       //PCR026243++
				//**** Start of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
				//if (evt.mParameters.selectedIndex === 1) {
				//	Bar.setVisible(true);
				//	Bar.addStyleClass(oResource.getText("S2PSRSDABARINITCLS"));
				//	that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Critical);
				//	carmDecisionContent.setVisible(true);
				//  carmDecisionBox.setVisible(false);
				//  CancelBtn.setVisible(true);
				//  EditBtn.setVisible(false);
				//  SaveBtn.setVisible(true);
				//  SaveBtn.setEnabled(false);
				//	statusText.setText(oResource.getText("S2PCARMINITSTATTXT"));
				//	if (oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel() !==
				//		undefined) {
				//		for (var i = 0; i < oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE)
				//			.getModel().getData().ItemSet.length; i++) {
				//			oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel().getData()
				//				.ItemSet[i].editable = true;
				//		}
				//		oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel().refresh(
				//			true);
				//	}
				//	var oEntry = {
				//		Guid: GenInfoData.Guid,
				//		StatDesc: oResource.getText("S2CARMINITSUCCSSTXT"),
				//		ItemGuid: GenInfoData.ItemGuid,
				//		OppId: thisCntrlr.OppId,
				//		ItemNo: thisCntrlr.ItemNo,
				//		Required: oResource.getText("S2POSMANDATANS"),
				//		Status: "95",
				//		MeetDate: "00000000",
				//		Commetns: ""
				//	};
				//	this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CARMInfoSet, com.amat.crm.opportunity
				//		.util.ServiceConfigConstants.write, oEntry, oResource.getText(
				//			"S2CARMINITSUCCSSTXT"));
				//	var sValidate = "CARM_InfoSet(Guid=guid'" + GenInfoData.Guid + "',ItemGuid=guid'" + GenInfoData
				//		.ItemGuid + "')?$expand=NAV_CARM_DOCS";
				//	this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				//	thisCntrlr.carmValidate = {};
				//	thisCntrlr.carmValidate = thisCntrlr.getModelFromCore(oResource.getText("GLBCARMMODEL")).getData();
				//	var carmDocData = [];
				//	for (var i = 0; i < thisCntrlr.carmValidate.NAV_CARM_DOCS.results.length; i++) {
				//		var doc = {
				//			"Guid": "",
				//			"DocId": "",
				//			"itemguid": "",
				//			"doctype": "",
				//			"docsubtype": "",
				//			"DocDesc": "",
				//			"filename": "",
				//			"OriginalFname": "",
				//			"note": "",
				//			"uBvisible": false,
				//			"bgVisible": false,
				//			"editable": true
				//		};
				//		doc.Guid = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].Guid;
				//		doc.DocId = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].DocId;
				//		doc.docsubtype = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].DocSubtype;
				//		doc.itemguid = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].ItemGuid;
				//		doc.DocDesc = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].DocDesc;
				//		doc.doctype = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].DocType;
				//		doc.filename = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].FileName;
				//		doc.OriginalFname = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].OriginalFname;
				//		doc.note = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].Notes;
				//		doc.DocSortno = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].DocSortno;
				//		doc.uBvisible = thisCntrlr.carmValidate.NAV_CARM_DOCS.results[i].FileName === "" ? true : false;
				//		doc.bgVisible = !doc.uBvisible;
				//		carmDocData.push(doc);
				//	}
				//	var oCarmAttJModel = this.getJSONModel({
				//		"ItemSet": carmDocData
				//	});
				//	thisCntrlr.oCarmAttTable = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
				//	thisCntrlr.oCarmAttTable.setModel(oCarmAttJModel);
				//	var date = thisCntrlr.carmValidate.MeetDate === oResource.getText(
				//		"S2ATTACHPSRCBDATESTRNGTEXT") ? null : new Date(thisCntrlr.carmValidate.MeetDate.slice(0, 4),
				//		thisCntrlr.carmValidate.MeetDate.slice(4, 6) - 1, thisCntrlr.carmValidate.MeetDate.slice(6, 8));
				//	oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(date);
				//	oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(false);
				//	oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(true);
				//	that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Critical);
				//	for (var i = 0; i < thisCntrlr.oCarmAttTable.getModel().getData().ItemSet.length; i++) {
				//		thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(true);
				//		if (SecurityData.DelCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
				//			thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
				//				.items[1].setVisible(false);
				//		} else {
				//			thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
				//				.items[1].setVisible(true);
				//			thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
				//				.items[1].setEnabled(true);
				//		}
				//		if (SecurityData.ViewCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
				//			thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[1].setEnabled(false);
				//		} else {
				//			thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[1].setEnabled(true);
				//		}
				//		if (SecurityData.UpldCarmDoc !== oResource.getText("S1TABLESALESTAGECOL")) {
				//			thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[1].mAggregations
				//				.items[0].setVisible(false);
				//			thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
				//				.items[2].setVisible(false);
				//		} else {
				//			thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[1].mAggregations
				//				.items[0].setVisible(true);
				//			thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations
				//				.items[2].setVisible(true);
				//		}
				//	}
				//	oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
				//	CancelBtn.setText(oResource.getText("S2PSRSDASFCANINITXT"))
				//} else {
				//**** End of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
					Bar.setVisible(true);
					//carmDecisionBox.setVisible(false);                                                                                        //PCR021481--
					carmDecisionContent.setVisible(false);
					Bar.addStyleClass(oResource.getText("S2PSRSDASTATBARSKIPCLS"));
					statusText.setText(oResource.getText("S2PCBCNTREQSTATTXT"));
					//that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CARM).setIconColor(sap.ui.core.IconColor.Positive);               //PCR026243--
					That_ITBar_CARM.setIconColor(sap.ui.core.IconColor.Positive);                                                               //PCR026243++
					//EditBtn.setVisible(false);                                                                                                //PCR021481--
					//SaveBtn.setVisible(false);                                                                                                //PCR021481--
					CancelBtn.setVisible(true);
					//CancelBtn.setText(oResource.getText("S2PSRSDASFCANINITXT"))                                                               //PCR021481--
					CancelBtn.setText(oResource.getText("S2CARMNACANINITBTNTXT"));                                                              //PCR021481++
					var oEntry = {
						Guid: GenInfoData.Guid,
						StatDesc: "",
						ItemGuid: GenInfoData.ItemGuid,
						OppId: thisCntrlr.OppId,
						ItemNo: thisCntrlr.ItemNo,
						Required: oResource.getText("S2NEGMANDATANS"),
						Status: "97",
						MeetDate: "00000000",
						Commetns: ""
					};
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CARMInfoSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.write, oEntry, oResource.getText(
							"S2CARMNTAPPBLESUCSSTXT"));
					this.checkCarmInitiate();
				}
			//}                                                                                                                                  //PCR021481--
			myBusyDialog.close();
		},
		/**
		 * This Method Handles CARM Meeting Date Selection Event.
		 * 
		 * @name onCarmDateChange
		 * @param evt - Event Handler
		 * @returns 
		 */
		onCarmDateChange: function(evt) {
			var oView = thisCntrlr.getView();
			var SaveBtn = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn);
			thisCntrlr.tempDate = evt.getParameters().newValue;
			if (new Date(thisCntrlr.tempDate.split(".")[1] + "-" + thisCntrlr.tempDate.split(".")[0] + "-" + thisCntrlr.tempDate
					.split(".")[2]) > new Date()) {
				thisCntrlr.showToastMessage(this.getResourceBundle().getText("S1CARMDATEGREATER"));
				oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setValueState(sap.ui.core.ValueState
					.Error);
				oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(null);
				thisCntrlr.carmDate = oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).getDateValue();
				SaveBtn.setVisible(false);
			} else {
				SaveBtn.setEnabled(true);
				SaveBtn.setVisible(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setValueState(sap.ui.core.ValueState
					.None);
				thisCntrlr.carmDate = this.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).getDateValue();
			}
		},
		/**
		 * This method Handles Evidence File Name Press Event.
		 * 
		 * @name handleEvidenceLinkPress
		 * @param 
		 * @returns 
		 */
		handleEvidenceLinkPress: function() {
			var oLink = evt.getSource();
			var oResource = thisCntrlr.bundle;
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C****************
			//if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource
			//	.getText("S2ICONTABPSRSDAKEY")) {
			if (That_ITBar.getSelectedKey() === oResource.getText("S2ICONTABPSRSDAKEY")) {
			//************************End Of PCR026243: DL:1803 Display Migration to Q2C******************
				var PSRData = thisCntrlr.getModelFromCore(oResource.getText("GLBPSRMODEL")).getData();
				if (evt.getParameters().id.split(oResource.getText("S2PSRCBCSEPARATORTXT"))[evt.getParameters()
						.id.split(oResource.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
					.Ids.S2PSR_SDA_PANL_BSDA_EVIDENCE_LINK) {
					var docType = PSRData.NAV_BSDA_EVDOC.DocType;
					var docsubtype = PSRData.NAV_BSDA_EVDOC.DocSubtype;
					var DocId = PSRData.NAV_BSDA_EVDOC.DocId;
				} else {
					var docType = PSRData.NAV_SSDA_EVDOC.DocType;
					var docsubtype = PSRData.NAV_SSDA_EVDOC.DocSubtype;
					var DocId = PSRData.NAV_SSDA_EVDOC.DocId;
				}
				var url = this.oMyOppModel._oDataModel.sServiceUrl + "AttachmentSet(Guid=guid'" + PSRData.Guid + "',ItemGuid=guid'" + PSRData
					.ItemGuid + "',DocType='" + docType + "',DocSubtype='" +
					docsubtype + "',DocId=guid'" + DocId + "')/$value";
			} else {
				var PDCData = thisCntrlr.getModelFromCore(oResource.getText("GLBPDCSDAMODEL")).getData();
				if (evt.getParameters().id.split(oResource.getText("S2PSRCBCSEPARATORTXT"))[evt.getParameters()
						.id.split(oResource.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity
					.Ids.S2PDC_SDA_PANL_BSDA_EVIDENCE_LINK) {
					var docType = PDCData.NAV_PDCBSDA_EVDOC.DocType;
					var docsubtype = PDCData.NAV_PDCBSDA_EVDOC.DocSubtype;
					var DocId = PDCData.NAV_PDCBSDA_EVDOC.DocId;
				} else {
					var docType = PDCData.NAV_PDCSSDA_EVDOC.DocType;
					var docsubtype = PDCData.NAV_PDCSSDA_EVDOC.DocSubtype;
					var DocId = PDCData.NAV_PDCSSDA_EVDOC.DocId;
				}
				var url = sServiceUrl + "AttachmentSet(Guid=guid'" + PDCData.Guid + "',ItemGuid=guid'" + PDCData
					.ItemGuid + "',DocType='" + docType + "',DocSubtype='" +
					docsubtype + "',DocId=guid'" + DocId + "')/$value";
			}
			window.open(url);
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
			var oLink = evt.getSource();
			var url = this.oMyOppModel._oDataModel.sServiceUrl + "/AttachmentSet(Guid=guid'" + oData.Guid + "',ItemGuid=guid'" + oData.itemguid +
				"',DocType='" + oData.doctype + "',DocSubtype='" + oData.docsubtype + "',DocId=guid'" + oData.DocId +
				"')/$value";
			window.open(url);
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
						this.getResourceBundle().getText("S2PSRSDAEDITICON"));
					oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[1].setIcon(
						this.getResourceBundle().getText("S2PSRSDADELETEICON"));
					oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[2].setVisible(
						true);
				}
			}
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
			if (thisCntrlr.source.getIcon().indexOf(this.getResourceBundle().getText("S2ATTCHDOCDELVALDDELTXT").toLowerCase()) >=
				0) {
				var text = this.getResourceBundle().getText("S2ATTCHDOCDELVALDMSG") + " " + thisCntrlr.oTable.getModel()
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
					title: this.getResourceBundle().getText("S2ATTCHDOCDELVALDCONTXT"),
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
			var oResource = thisCntrlr.bundle;
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C****************
			//if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource
			//	.getText("S2ICONTABCARMKEY")) {
		    if (That_ITBar.getSelectedKey() === oResource.getText("S2ICONTABCARMKEY")) {
		    //************************End Of PCR026243: DL:1803 Display Migration to Q2C******************
				thisCntrlr.carmDate = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).getDateValue();
			}
			sap.ui.core.BusyIndicator.show();
			var uploadButton = evt.getSource().getParent().getParent().mAggregations.items[1];
			var rowIndex = uploadButton.getId().split("-")[uploadButton.getId().split("-").length - 1];
			var oTable = evt.getSource().getParent().getParent().getParent().getParent();
			oTable.getModel().getData().ItemSet[rowIndex].filename = evt.mParameters.newValue;
			thisCntrlr.oTable = oTable;
			thisCntrlr.tableModel = oTable.getModel().getData();
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C**************
			//if (evt.getParameters().id.toLowerCase().indexOf(oResource.getText("S2ICONTABCARMKEY").toLowerCase()) >=
			//	0) {
			//	thisCntrlr.Custno = thisCntrlr.carmValidate.Customer;
			//} else {
			//	thisCntrlr.Custno = thisCntrlr.getModelFromCore(oResource.getText("GLBATTMODEL")).getData()
			//		.Custno;
			//}
			thisCntrlr.Custno = thisCntrlr.getOwnerComponent().Custno;
			//************************End Of PCR026243: DL:1803 Display Migration to Q2C****************
			oTable.getModel().getData().ItemSet[rowIndex].uBvisible = true;
			oTable.getModel().getData().ItemSet[rowIndex].bgVisible = !oTable.getModel().getData().ItemSet[rowIndex]
				.uBvisible;
			oTable.getModel().getData().ItemSet[rowIndex].editable = false;
			if (evt.getSource().getParent().getParent().getParent().mAggregations.cells[2].mAggregations.items !==
				undefined) {
				oTable.getModel().getData().ItemSet[rowIndex].note = evt.getSource().getParent().getParent().getParent()
					.mAggregations.cells[2].getValue();
			}
			if (oTable.getModel().getData().ItemSet[rowIndex].doctype === oResource.getText("S2MLIMCOMMDATATYP") && oTable.getModel().getData()
				.ItemSet[rowIndex].docsubtype ===
				oResource.getText("S2ATTOTHTYPETEXT") || oTable.getModel().getData().ItemSet[rowIndex].Code === oResource.getText(
					"S2OTHDOCCODETEXT")) {
				var type = oResource.getText("S2OTHDOCCODETEXT");
			} else {
				var type = "";
			}
			var SLUG = oTable.getModel().getData().ItemSet[rowIndex].itemguid.replace(/-/g, "").toUpperCase() + "$$" + oTable.getModel()                                             //PCR035760++ Defect#131 TechUpgrade changes
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
		 * This Handles Complete File upload Event CARM Process.
		 * 
		 * @name onCarmFileUploadComplete
		 * @param oEvent - Event Handler
		 * @returns 
		 */
		onCarmFileUploadComplete: function(oEvent) {
			var oView = thisCntrlr.getView();
			if (oEvent.getParameters().status === 201) {
				thisCntrlr.showToastMessage(this.getResourceBundle().getText("S2PSRSDACBCATTDOCUPLDSUCSSMSG"));
				thisCntrlr.checkCarmInitiate();
				oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(thisCntrlr.carmDate);
				//**** Start of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
				//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(false);
				//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(true);
				//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(true);
				//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(true);
				//**** End of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
				for (var i = 0; i < this.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel()
					.getData().ItemSet.length; i++) {
					oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel().getData()
						.ItemSet[i].editable = true;
					thisCntrlr.oCarmAttTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
				}
				oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
				oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel().refresh(
					true);
			} else if (oEvent.getParameters().status === 400) {
				thisCntrlr.showToastMessage($(oEvent.mParameters.responseRaw).find(this.getResourceBundle().getText(
					"S2CBCPSRCARMTYPEMESG")).text());
				thisCntrlr.checkCarmInitiate();
			}
			sap.ui.core.BusyIndicator.hide();
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
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C****************
			//if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource
			//	.getText("S2ICONTABCARMKEY")) {
			if (That_ITBar.getSelectedKey() === oResource.getText("S2ICONTABCARMKEY")) {
			//************************End Of PCR026243: DL:1803 Display Migration to Q2C******************
				thisCntrlr.carmDate = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).getDateValue();
			}
			var DocumentType = [{
				"DocumentType": DocumentType
			}];
			switch (evt.getSource().data(oResource.getText("S2CARMDOCSPREXTRADTTEXT"))) {
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
		 * This Method Handles Radio Button Group Event.
		 * 
		 * @name carmMainCommChange
		 * @param 
		 * @returns 
		 */
		carmMainCommChange: function() {
			var SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn);
			thisCntrlr.carmMainCom = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_MAINCOMMENT_TEXTAREA).getValue();
			SaveBtn.setEnabled(true);
			SaveBtn.setVisible(true);
		},
		/**
		 * This Method Handles Radio Button Group Event. S3
		 * 
		 * @name setCarmEditOnNavBack
		 * @param 
		 * @returns 
		 */
		setCarmEditOnNavBack: function() {
			var oView = thisCntrlr.getView();
			oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(thisCntrlr.carmDate);
			//**** Start of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
			//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(false);
			//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(true);
			//oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(true);
			//**** End of PCR021481-- : 4190: Q2C Q1/Q2 enhancements ***********
			oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(true);
			for (var i = 0; i < oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel()
				.getData().ItemSet.length; i++) {
				oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel().getData()
					.ItemSet[i].editable = true;
				oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).mAggregations.items[i]
					.mAggregations.cells[2].setEnabled(false);
			}
			oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
			oView.byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE).getModel().refresh(
				true);
		},
		/**
		 * This Method Handles Main Comment live Change event
		 * 
		 * @name OnMainCommLvchng
		 * @param oEvt - Holds the current event
		 * @returns 
		 */
		OnMainCommLvchng: function(oEvt) {
			oCommonController.commonMainCommLvchng(oEvt, thisCntrlr);
		},
		/**
		 * This Method Handles Main Comment Panel Expend Event
		 * 
		 * @name OnExpandMainCom
		 * @param oEvt - Holds the current event
		 * @returns 
		 */
		OnExpandMainCom: function(oEvt) {
			oCommonController.commonExpandMainCom(oEvt, thisCntrlr);
		},
		/**
		 * This Method Handles Main Comment Save Button Event.
		 * 
		 * @name onSaveMainCom
		 * @param oEvt - Holds the current event
		 * @returns 
		 */
		onSaveMainCom: function(oEvt) {
			oCommonController.commonSaveMainCom(oEvt, thisCntrlr);
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
		}
	});
});