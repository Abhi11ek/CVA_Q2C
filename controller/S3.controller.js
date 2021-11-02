/**
 * This class holds all methods of S1 page.
 *
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends com.amat.crm.opportunity.controller.BaseController
 * @name com.amat.crm.opportunity.controller.S3
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
 * 26/10/2019      Abhishek        PCR026110         INC05150622 other attachment *
 *                 Pant                              incorrect customer           *
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 ***********************************************************************************
 */
sap.ui.define([
	"com/amat/crm/opportunity/controller/BaseController",
	"sap/m/MessageBox"
], function(Controller, MessageBox) {
	"use strict";
	var that_S3;
	return Controller.extend("com.amat.crm.opportunity.controller.S3", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf view.S3
		 */
		onInit: function() {
			that_S3 = this;			
			this.oMyOppModel = new com.amat.crm.opportunity.model.models(this);
			that_S3.oOtherDocTable = this.byId(com.amat.crm.opportunity.Ids.S3_TABLE_OTHERDOC);
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C**************
			this.getOwnerComponent().s3 = that_S3.getView();;
			//if (sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBPSRMODEL")) !== undefined) {
			//	that_S3.Custno = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBPSRMODEL")).getData().Custno;
			//} else {
			//	if (sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBPDCSDAMODEL")) === undefined) {
			//		var Guid = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().Guid;
			//		var ItemGuid = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
			//		var sValidate = "PDCSDA_InfoSet(Guid=guid'" + Guid + "',ItemGuid=guid'" + ItemGuid +
			//			"')?$expand=NAV_PDC_BSDA_FINL,NAV_PDC_BSDA_FINN,NAV_PDC_BSDA_PARL,NAV_PDC_CC,NAV_PDC_FNL_DOCS,NAV_PDC_QA_SAF,NAV_PDC_SSDA_FINL,NAV_PDC_SSDA_FINN,NAV_PDC_SSDA_PARL,NAV_PDCBSDA_EVDOC,NAV_PDCCUST_REVSPEC,NAV_REV_DOCS,NAV_PDCSSDA_EVDOC";
			//		this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			//	}
			//	that_S3.Custno = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBPDCSDAMODEL")).getData().Custno;
			//}
			that_S3.Custno = this.getOwnerComponent().Custno;
			//************************End Of PCR026243: DL:1803 Display Migration to Q2C**************
			this.bundle = this.getResourceBundle();
		},
		/**
		 * This method is used to handles navigation back press button.
		 *	 
		 * @name onNavBack
		 * @param
		 * @returns
		 */
		onNavBack: function() {
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C**************
			var oControllerS2;
			if(this.getOwnerComponent().OppType === this.getResourceBundle().getText("S4DISOPPTYPTXT")){
				this.getOwnerComponent().getRouter().navTo(this.getResourceBundle().getText("S1DISROUTGTTXT"), {});
				oControllerS2 = this.getOwnerComponent().s4.getController();
			} else {
				this.getOwnerComponent().getRouter().navTo(this.getResourceBundle().getText("S2DISOPPDETROUT"), {});
				oControllerS2 = this.getOwnerComponent().s2.getController();
			}
			that_S3.Custno = "";
			//this.getOwnerComponent().getRouter().navTo(this.getResourceBundle().getText("S2DISOPPDETROUT"), {});
			//************************End Of PCR026243: DL:1803 Display Migration to Q2C****************
			//var oControllerS2 = sap.ui.getCore().byId(this.getResourceBundle().getText("S1VWToS2")).getController();
			oControllerS2._initiateControllerObjects();
			if (sap.ui.getCore().getModel().getData().DocumentType === this.getResourceBundle().getText("S2ICONTABCARMKEY")) {
				this.getOwnerComponent().carm.getController().checkCarmInitiate();
				this.getOwnerComponent().carm.getController().setCarmEditOnNavBack();
			} else {
				this.getOwnerComponent().attachment.getController().onExpBookDoc();
			}
			this.getOwnerComponent().attachment.getController().onExpBookDoc();
		},
		/**
		 * This method is used to load the data in the table .
		 *	 
		 * @name loadData
		 * @param
		 * @returns
		 */
		loadData: function() {
			var Guid = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().Guid;
			var ItemGuid = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
			var DocumentType = sap.ui.getCore().getModel().getData().DocumentType;
			var sDocSubtype = "Other_DoclistSet?$filter=DocType eq '" + DocumentType + "'";
			var att;
			this.serviceCall(sDocSubtype, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			att = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBOTHERDOCMODEL")).getData();
			var otherDocData = [];
			this.UpldDocVis = false, this.ViewDocVis = false, this.DelDoc = false;
			var SecurityData = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBSECURITYMODEL")).getData();

			switch (DocumentType) {
				case this.getResourceBundle().getText("S2ATTACHBOOKINGDOCTYPE"):
					(SecurityData.UpldBokDoc === this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? (this.UpldDocVis = true) : (this.UpldDocVis =
						false);
					(SecurityData.ViewBokDoc === this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? (this.ViewDocVis = true) : (this.ViewDocVis =
						false);
					(SecurityData.DelBokDoc === this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? (this.DelDoc = true) : (this.DelDoc =
						false);
					this.DelDoc = true;
					break;
				case this.getResourceBundle().getText("S2ATTACHPOSTBOOKINGCHANGEORDERDOCTYPE"):
					(SecurityData.UpldPbcoDoc === this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? (this.UpldDocVis = true) : (this.UpldDocVis =
						false);
					(SecurityData.ViewPbcoDoc === this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? (this.ViewDocVis = true) : (this.ViewDocVis =
						false);
					(SecurityData.DelPbcoDoc === this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? (this.DelDoc = true) : (this.DelDoc =
						false);
					this.DelDoc = true;
					break;
				case this.getResourceBundle().getText("S2ATTACHPOSTBOOKINGDOCTYPE"):
					(SecurityData.UpldPbDoc === this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? (this.UpldDocVis = true) : (this.UpldDocVis =
						false);
					(SecurityData.ViewPbDoc === this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? (this.ViewDocVis = true) : (this.ViewDocVis =
						false);
					(SecurityData.DelPbDoc === this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? (this.DelDoc = true) : (this.DelDoc = false);
					this.DelDoc = true;
					break;
				case this.getResourceBundle().getText("S2ICONTABCARMKEY"):
					(SecurityData.UpldCarmDoc === this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? (this.UpldDocVis = true) : (this.UpldDocVis =
						false);
					(SecurityData.ViewCarmDoc === this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? (this.ViewDocVis = true) : (this.ViewDocVis =
						false);
					(SecurityData.DelCarmDoc === this.getResourceBundle().getText("S1TABLESALESTAGECOL")) ? (this.DelDoc = true) : (this.DelDoc =
						false);
					break;
			}
			for (var i = 0; i < att.results.length; i++) {
				var doc = {
					"Guid": "",
					"DocId": "",
					"itemguid": "",
					"doctype": "",
					"docsubtype": "",
					"filename": "",
					"OriginalFname": "",
					"ExpireDate": "",
					"note": "",
					"uBvisible": true,
					"bgVisible": false,
					"editable": true,
					"DocDesc": "",
					"delVisible": this.DelDoc,
					"addupVisible": this.UpldDocVis

				};
				doc.Guid = att.results[i].Guid;
				doc.DocId = att.results[i].DocId;
				doc.docsubtype = att.results[i].DocSubtype;
				doc.itemguid = att.results[i].ItemGuid;
				doc.doctype = att.results[i].DocType;
				doc.filename = att.results[i].FileName;
				doc.OriginalFname = att.results[i].OriginalFname;
				doc.note = att.results[i].Notes;
				doc.ExpireDate = att.results[i].ExpireDate;

				doc.DocDesc = att.results[i].DocDesc;
				(this.UpldDocVis === false) ? (doc.Enableflag = false) : (doc.Enableflag = true);
				(this.ViewDocVis === false) ? (doc.EnableDisflag = false) : (doc.EnableDisflag = true);
				doc.editable = att.results[i].Notes === "" ? true : false;
				if (att.results[i].DocSubtype === this.getResourceBundle().getText("S3PBCDT") || att.results[i].DocSubtype === this.getResourceBundle()
					.getText("S3PBDT") || att.results[i].DocSubtype === this.getResourceBundle().getText("S3BDT")) {
					doc.Enableflag = false;
				} else {
					doc.Enableflag = true;
				}

				otherDocData.push(doc);
			}
			var oOtherDocTableData = new sap.ui.model.json.JSONModel({
				"ItemSet": otherDocData
			});
			that_S3.oOtherDocTable.setModel(oOtherDocTableData);
			for (var i = 0; i < att.results.length; i++) {
				if (att.results[i].DocSubtype === this.getResourceBundle().getText("S3PBCDT") || att.results[i].DocSubtype === this.getResourceBundle()
					.getText("S3PBDT") || att.results[i].DocSubtype === this.getResourceBundle().getText("S3BDT")) {
					that_S3.oOtherDocTable.getItems()[i].getCells()[2].setEnabled(true);
					that_S3.oOtherDocTable.getItems()[i].getCells()[2].setValueState(sap.ui.core.ValueState.Warning);
					that_S3.oOtherDocTable.getItems()[i].getCells()[2].setValueStateText(this.getResourceBundle().getText("S3NOTEVALUETEXT"));

				} else {
					that_S3.oOtherDocTable.getItems()[i].getCells()[2].setPlaceholder(this.getResourceBundle().getText("S2CONFFRGTXTAREAPLCHLDER"));
					that_S3.oOtherDocTable.getItems()[i].getCells()[2].setValueState(sap.ui.core.ValueState.None);

				}
			}
		},
		/**
		 * This method is used to handle the change in note input for Other sub .
		 * 
		 * @name handleLinkPress
		 * @param
		 * @returns
		 */
		otherAction: function(evt) {

			var index = evt.getParameters().id.split(this.getResourceBundle().getText("S3SEPARATORTEXT"))[evt.getParameters().id.split(this.getResourceBundle()
				.getText("S3SEPARATORTEXT")).length - 1];
			var docSubType = evt.getSource().getParent().getParent().getModel().getData().ItemSet[index].docsubtype;
			if (docSubType === this.getResourceBundle().getText("S3PBCDT") || docSubType === this.getResourceBundle().getText("S3PBDT") ||
				docSubType === this.getResourceBundle().getText("S3BDT")) {

				if (evt.getParameters().newValue.length !== 0) {
					evt.getSource().getParent().getCells()[3].getItems()[1].getItems()[0].setEnabled(true);
					evt.getSource().getParent().getCells()[2].setValueState(sap.ui.core.ValueState.None);
				} else {
					evt.getSource().getParent().getCells()[3].getItems()[1].getItems()[0].setEnabled(false);
					evt.getSource().getParent().getCells()[2].setValueState(sap.ui.core.ValueState.Warning);
				}
			}

			if (evt.getParameters().value.length >= 255) {

				evt.getSource().setValue(evt.getParameters().value.substr(0, 254));
				that_S3.showToastMessage(that_S3.getResourceBundle().getText("S2PSRSDACBCMCOMMVALTXT"));
			}
		},
		/**
		 * This method is used to handle the link press event in table .
		 * 
		 * @name handleLinkPress
		 * @param
		 * @returns
		 */
		handleLinkPress: function(evt) {
			var rowIndex = evt.getSource().getParent().getId().split("-")[evt.getSource().getParent().getId().split("-").length - 1];
			var oData = evt.getSource().getParent().getParent().getModel().getData().ItemSet[rowIndex];
			var oLink = evt.getSource();
			var url = this.oMyOppModel._oDataModel.sServiceUrl + "/AttachmentSet(Guid=guid'" + oData.Guid + "',ItemGuid=guid'" + oData.itemguid + "',DocType='" + oData.doctype +
				"',DocSubtype='" + oData.docsubtype + "',DocId=guid'" + oData.DocId + "')/$value";
			oLink.setHref(url);
			oLink.setTarget("_blank");
		},
		/**
		 * This method is used to display the delete confirmation popup box .
		 * 
		 * @name CheckDelete
		 * @param evt - Event Handler for button
		 * @returns
		 */
		CheckDelete: function(evt) {
			that_S3.source = evt.getSource();
			var rowIndex = that_S3.source.getParent().getParent().getParent().getId().split("-")[that_S3.source.getParent().getParent().getParent()
				.getId().split("-").length - 1];
			var oTable = that_S3.source.getParent().getParent().getParent().getParent();
			if (that_S3.source.getIcon().indexOf(this.bundle.getText("S3DELETETXT").toLowerCase()) >= 0) {
				var text = this.bundle.getText("S3DELETECON") + oTable.getModel().getData().ItemSet[rowIndex].DocDesc + "?";
				var box = new sap.m.VBox({
					items: [
						new sap.m.Text({
							text: text
						})
					]
				});
				MessageBox.show(box, {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: this.bundle.getText("S3DELETECONFIRMATION"),
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function(oAction) {
						if (oAction === sap.m.MessageBox.Action.YES) {
							that_S3.handleDeletePress();
						}
					}
				});
			} else {
				that_S3.handleDeletePress();
			}
		},
		/**
		 * This method is used to delete data from table .
		 * 
		 * @name handleDeletePress
		 * @param 
		 * @returns
		 */
		handleDeletePress: function() {
			var myBusyDialog = that_S3.getBusyDialog();
			myBusyDialog.open();
			var rowIndex = that_S3.source.getParent().getParent().getParent().getId().split("-")[that_S3.source.getParent().getParent().getParent()
				.getId().split("-").length - 1];
			var oTable = that_S3.source.getParent().getParent().getParent().getParent();
			var model = oTable.getModel().getData().ItemSet;
			var flag = 0;
			$.each(model, function(key, value) {
				if (value.docsubtype === that_S3.source.getParent().getParent().getParent().mAggregations.cells[0].getText())
					flag++;
			});
			if (that_S3.source.getIcon().indexOf(this.bundle.getText("S3DELETETXT").toLowerCase()) >= 0) {
				if (flag === 1) {
					var tObject = {
						"Guid": "",
						"DocId": "",
						"itemguid": "",
						"doctype": "",
						"docsubtype": "",
						"filename": "",
						"note": "",
						"uBvisible": true,
						"bgVisible": false,
						"editable": true,
						"DocDesc": ""
					};
					tObject.Guid = oTable.getModel().getData().ItemSet[rowIndex].Guid;
					tObject.DocId = oTable.getModel().getData().ItemSet[rowIndex].DocId;
					tObject.doctype = oTable.getModel().getData().ItemSet[rowIndex].doctype;
					tObject.docsubtype = oTable.getModel().getData().ItemSet[rowIndex].docsubtype;
					tObject.itemguid = oTable.getModel().getData().ItemSet[rowIndex].itemguid;
					tObject.DocDesc = oTable.getModel().getData().ItemSet[rowIndex].DocDesc;
					oTable.getModel().getData().ItemSet.splice(parseInt(rowIndex), 1);
					oTable.getModel().getData().ItemSet.splice(parseInt(rowIndex), 0, tObject);
					oTable.getModel().refresh(true);
				} else {
					oTable.getModel().refresh(true);
				}
				if (!window.location.origin) {
					window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location
						.port : '');
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
				var sDelete = sServiceUrl + "/AttachmentSet(Guid= guid'" + oTable.getModel().getData().ItemSet[rowIndex].Guid +
					"', ItemGuid = guid'" + oTable.getModel().getData().ItemSet[rowIndex].itemguid + "', DocType='" + oTable.getModel().getData().ItemSet[
						rowIndex].doctype + "',DocSubtype='" + oTable.getModel().getData().ItemSet[rowIndex].docsubtype + "',DocId=guid'" + oTable.getModel()
					.getData().ItemSet[rowIndex].DocId + "')";
				OData.request(f, function(data, oSuccess) {
					that_S3.oToken = oSuccess.headers['x-csrf-token'];
					var oHeaders = {
						"X-CSRF-Token": that_S3.oToken,
					};
					/****************To Fetch CSRF Token*******************/
					/*******************To Delete File************************/
					var sDelete = sServiceUrl + "/AttachmentSet(Guid=guid'" + sap.ui.getCore().getModel(that_S3.getResourceBundle().getText(
							"GLBOPPGENINFOMODEL")).getData().Guid + "',ItemGuid=guid'" + sap.ui.getCore().getModel(that_S3.getResourceBundle().getText(
							"GLBOPPGENINFOMODEL")).getData().ItemGuid + "',DocType='" + oTable.getModel().getData().ItemSet[rowIndex].doctype +
						"',DocSubtype='" + oTable.getModel().getData().ItemSet[rowIndex].docsubtype + "',DocId=guid'" + oTable.getModel().getData().ItemSet[
							rowIndex].DocId + "')";
					jQuery.ajax({
						type: 'DELETE',
						url: sDelete,
						headers: oHeaders,
						cache: false,
						processData: false,
						success: function(data) {

							var rowIndex = that_S3.source.getParent().getParent().getParent().getId().split("-")[that_S3.source.getParent().getParent()
								.getParent().getId().split("-").length - 1];
							var oTable = that_S3.source.getParent().getParent().getParent().getParent();

							var tObject = {
								"Guid": "",
								"DocId": "",
								"itemguid": "",
								"doctype": "",
								"docsubtype": "",
								"filename": "",
								"note": "",
								"uBvisible": true,
								"bgVisible": false,
								"editable": true,
								"DocDesc": ""
							};
							tObject.Guid = oTable.getModel().getData().ItemSet[rowIndex].Guid;
							tObject.DocId = oTable.getModel().getData().ItemSet[rowIndex].DocId;
							tObject.doctype = oTable.getModel().getData().ItemSet[rowIndex].doctype;
							tObject.docsubtype = oTable.getModel().getData().ItemSet[rowIndex].docsubtype;
							tObject.itemguid = oTable.getModel().getData().ItemSet[rowIndex].itemguid;
							tObject.DocDesc = oTable.getModel().getData().ItemSet[rowIndex].DocDesc;
							oTable.getModel().getData().ItemSet.splice(parseInt(rowIndex), 1);
							oTable.getModel().getData().ItemSet.splice(parseInt(rowIndex), 0, tObject);
							oTable.getModel().refresh(true);
							oTable.mAggregations.items[2].setEnabled(true);
							thisCntrlr.showToastMessage(that_S3.bundle.getText("S3DELETESUCESSTXT"));
						},
						error: function(data) {
							thisCntrlr.showToastMessage($(data.responseText).find(that_S3.getResourceBundle().getText("S2CBCPSRCARMTYPEMESG"))[0].innerText);

						}
					});
				}, function(err) {});
			} else {
				oTable.getModel().getData().ItemSet[rowIndex].editable = true;
				oTable.mAggregations.items[rowIndex].mAggregations.cells[2].setEnabled(false);
				oTable.getModel().getData().ItemSet[rowIndex].note = that_S3.tempHold;
				that_S3.source.setIcon(this.getResourceBundle().getText("S2PSRSDADELETEICON"));
				that_S3.source.getParent().mAggregations.items[0].setIcon(this.getResourceBundle().getText("S2PSRSDAEDITICON"));
				that_S3.source.getParent().mAggregations.items[2].setVisible(true);

				that_S3.source.getParent().mAggregations.items[2].setVisible(oTable.getModel().getData().ItemSet[rowIndex].addupVisible);

				for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {
					if (oTable.getModel().getData().ItemSet[i].filename === "") {
						oTable.getModel().getData().ItemSet[i].bgVisible = false;
						oTable.getModel().getData().ItemSet[i].uBvisible = true;
						oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(true);
					} else {
						oTable.getModel().getData().ItemSet[i].bgVisible = true;

						oTable.getModel().getData().ItemSet[i].uBvisible = false;
						oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
					}
				}
				oTable.getModel().refresh(true);
			}
			myBusyDialog.close();
		},
		/**
		 * This method is used to handle edit button press event.
		 * 
		 * @name handleEditPress
		 * @param evt - Event Handler of button
		 * @returns
		 */
		handleEditPress: function(evt) {
			var myBusyDialog = that_S3.getBusyDialog();
			myBusyDialog.open();
			var rowIndex = evt.getSource().getParent().getParent().getParent().getId().split("-")[evt.getSource().getParent().getParent().getParent()
				.getId().split("-").length - 1];
			var oTable = evt.getSource().getParent().getParent().getParent().getParent();
			var row = evt.getSource().getParent().getParent().getParent().getCells()[2];
			if (!window.location.origin) {
				window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location
					.port : '');
			}
			var sBaseUrl = window.location.origin;
			var sServiceUrl = sBaseUrl + com.amat.crm.opportunity.util.ServiceConfigConstants.getMyOpportunityInfoURL;
			var Guid = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().Guid;
			var ItemGuid = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
			var DocId = oTable.getModel().getData().ItemSet[rowIndex].DocId;
			var doctype = oTable.getModel().getData().ItemSet[rowIndex].doctype;
			var docsubtype = oTable.getModel().getData().ItemSet[rowIndex].docsubtype;
			var Date = "";
			that_S3.evt = evt;
			if (evt.getSource().getIcon().indexOf(this.bundle.getText("S3EDITTXT").toLowerCase()) >= 0) {
				oTable.getModel().getData().ItemSet[rowIndex].editable = true;
				oTable.getModel().getData().ItemSet[rowIndex].uBvisible = false;
				oTable.mAggregations.items[rowIndex].mAggregations.cells[2].setEnabled(true);
				that_S3.tempHold = oTable.getModel().getData().ItemSet[rowIndex].note;
				evt.getSource().setIcon(this.getResourceBundle().getText("S2PSRSDASAVEICON"));
				evt.getSource().getParent().mAggregations.items[1].setIcon(this.getResourceBundle().getText("S2PSRSDAATTCANICON"));
				if (evt.getSource().getParent().mAggregations.items[2] !== undefined) {
					evt.getSource().getParent().mAggregations.items[2].setVisible(false);
				}
				for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {
					if (i !== parseInt(rowIndex)) {
						oTable.getModel().getData().ItemSet[i].bgVisible = false;
						oTable.getModel().getData().ItemSet[i].uBvisible = false;
						oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
					}
				}
				oTable.getModel().refresh(true);
			} else {
				var sEdit = sServiceUrl + "/AttachmentSet(Guid=guid'" + Guid + "',ItemGuid=guid'" + ItemGuid + "',DocType='" + doctype + "',DocSubtype='" +
					docsubtype + "',DocId=guid'" + DocId + "')";
				var Data = {
					DocDesc: "",
					FileName: "",
					Guid: Guid,
					ItemGuid: ItemGuid,
					DocType: doctype,
					DocSubtype: docsubtype,
					DocId: DocId,
					Notes: row.getValue(),
					MimeType: "image/jpeg",
					OppId: "",
					ItemNo: "",
					Customer: "",
					Code: "",
					ExpireDate: Date,
					UploadedBy: "",
					UploadedDate: "0000-00-00T00:00:00"
				};
				var that = this;
				/****************To Fetch CSRF Token*******************/
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
				that_S3.editB = evt.getSource();
				that_S3.deleteB = evt.getSource().getParent().mAggregations.items[1];
				OData.request(f, function(data, oSuccess) {
					that_S3.oToken = oSuccess.headers['x-csrf-token'];
					var oHeaders = {
						"X-CSRF-Token": that_S3.oToken
					};
					/****************To Fetch CSRF Token*******************/
					/*******************To Upload Note************************/
					OData.request({
							requestUri: sEdit,
							method: 'PUT',
							headers: oHeaders,
							data: Data
						},
						function(data, response) {
							oTable.getModel().getData().ItemSet[rowIndex].editable = false;
							that_S3.editB.setIcon(that_S3.getResourceBundle().getText("S2PSRSDAEDITICON"));
							that_S3.deleteB.setIcon(that_S3.getResourceBundle().getText("S2PSRSDADELETEICON"));
							for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {

								if (oTable.getModel().getData().ItemSet[i].filename === "") {
									oTable.getModel().getData().ItemSet[i].bgVisible = false;
									oTable.getModel().getData().ItemSet[i].uBvisible = true;
									oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(true);
								} else {
									oTable.getModel().getData().ItemSet[i].bgVisible = true;

									oTable.getModel().getData().ItemSet[i].uBvisible = false;
									oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
								}

							}
							oTable.getModel().refresh(true);
							thisCntrlr.showToastMessage(that_S2.getResourceBundle().getText("S2PSRSDACBCATTNOTESUCSSMSG"));
						},
						function(err) {
							oTable.getModel().getData().ItemSet[rowIndex].editable = false;
							that_S3.editB.setIcon(that_S3.getResourceBundle().getText("S2PSRSDAEDITICON"));
							that_S3.deleteB.setIcon(that_S3.getResourceBundle().getText("S2PSRSDADELETEICON"));
							for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {
								if (oTable.getModel().getData().ItemSet[i].filename === "") {
									oTable.getModel().getData().ItemSet[i].bgVisible = false;
									oTable.getModel().getData().ItemSet[i].uBvisible = true;
									oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(true);
								} else {
									oTable.getModel().getData().ItemSet[i].bgVisible = true;

									oTable.getModel().getData().ItemSet[i].uBvisible = false;
									oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
								}
								thisCntrlr.showToastMessage(JSON.parse(data.response.body).error.message.value);
							}
						});
				}, function(err) {});

				if (evt.getSource().getParent().mAggregations.items[2] !== undefined) {
					evt.getSource().getParent().mAggregations.items[2].setVisible(true);
				}
				for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {
					if (i !== parseInt(rowIndex)) {
						oTable.getModel().getData().ItemSet[i].bgVisible = true;
					}
				}
			}
			myBusyDialog.close();
		},
		/**
		 * This method is used to handle add button press event .
		 * 
		 * @name handleAddPress
		 * @param evt - Event Handler of button
		 * @returns
		 */
		handleAddPress: function(evt) {
			var rowIndex = evt.getSource().getParent().getParent().getParent().getId().split("-")[evt.getSource().getParent().getParent().getParent()
				.getId().split("-").length - 1];
			var oTable = evt.getSource().getParent().getParent().getParent().getParent();
			var tObject = {
				"Guid": "",
				"DocId": "",
				"itemguid": "",
				"doctype": "",
				"docsubtype": "",
				"filename": "",
				"OriginalFname": "",
				"ExpireDate": "",
				"note": "",
				"uBvisible": true,
				"bgVisible": false,
				"editable": true,
				"DocDesc": "",
				"delVisible": this.DelDoc,
				"addupVisible": this.UpldDocVis
			};
			tObject.Guid = oTable.getModel().getData().ItemSet[rowIndex].Guid;
			tObject.DocId = oTable.getModel().getData().ItemSet[rowIndex].DocId;
			tObject.doctype = oTable.getModel().getData().ItemSet[rowIndex].doctype;
			tObject.docsubtype = oTable.getModel().getData().ItemSet[rowIndex].docsubtype;

			tObject.itemguid = oTable.getModel().getData().ItemSet[rowIndex].itemguid;
			tObject.DocDesc = oTable.getModel().getData().ItemSet[rowIndex].DocDesc;
			(this.UpldDocVis === false) ? (tObject.Enableflag = false) : (tObject.Enableflag = true);
			(this.ViewDocVis === false) ? (tObject.EnableDisflag = false) : (tObject.EnableDisflag = true);

			oTable.getModel().getData().ItemSet.splice(parseInt(rowIndex) + 1, 0, tObject);
			oTable.getModel().refresh(true);
			oTable.getItems()[parseInt(rowIndex) + 1].getCells()[3].getItems()[1].getItems()[0].setEnabled(true);
			for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {

				if (oTable.getModel().getData().ItemSet[i].docsubtype === this.getResourceBundle().getText("S3PBCDT") || oTable.getModel().getData()
					.ItemSet[i].docsubtype === this.getResourceBundle().getText("S3PBDT") || oTable.getModel().getData().ItemSet[i].docsubtype ===
					this.getResourceBundle().getText("S3BDT")) {

					oTable.getModel().getData().ItemSet[i].Enableflag = oTable.getModel().getData().ItemSet[i].note === "" ? false : true;
					oTable.getItems()[i].getCells()[2].setPlaceholder(this.getResourceBundle().getText("S3NOTETEXT"));
					oTable.getItems()[i].getCells()[2].setValueState(sap.ui.core.ValueState.Warning);
					oTable.getItems()[i].getCells()[2].setValueStateText(this.getResourceBundle().getText("S3NOTEVALUETEXT"));
				} else {
					oTable.getModel().getData().ItemSet[i].Enableflag = true;
				}
			}
			oTable.getModel().refresh(true);
		},
		/**
		 * This method is used to handle browes button press event .
		 * 
		 * @name handleFileUploadComplete
		 * @param evt - Event Handler
		 * @returns
		 */
		handleFileUploadComplete: function(evt) {
			var myBusyDialog = that_S3.getBusyDialog();
			myBusyDialog.open();
			var uploadButton = evt.getSource().getParent().getParent().mAggregations.items[1];
			var rowIndex = uploadButton.getId().split("-")[uploadButton.getId().split("-").length - 1];
			var r = evt.getSource().getParent().getParent().getParent().mAggregations.cells[1];
			var oTable = evt.getSource().getParent().getParent().getParent().getParent();
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C**************
			//that_S3.Custno = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBPSRMODEL")).getData().Custno;                                    //PCR026110++
			that_S3.Custno = this.getOwnerComponent().Custno;
			//************************End Of PCR026243: DL:1803 Display Migration to Q2C****************
			that_S3.oTable = oTable;
			that_S3.tableModel = oTable.getModel().getData();
			oTable.getModel().getData().ItemSet[rowIndex].delVisible = this.DelDoc;
			oTable.getModel().getData().ItemSet[rowIndex].addupVisible = this.UpldDocVis;
			oTable.getModel().getData().ItemSet[rowIndex].filename = evt.mParameters.newValue;
			oTable.getModel().getData().ItemSet[rowIndex].uBvisible = true;
			oTable.getModel().getData().ItemSet[rowIndex].bgVisible = !oTable.getModel().getData().ItemSet[rowIndex].uBvisible;
			oTable.getModel().getData().ItemSet[rowIndex].editable = false;
			oTable.getModel().getData().ItemSet[rowIndex].note = evt.getSource().getParent().getParent().getParent().mAggregations.cells[2].getValue();
			oTable.getModel().getData().ItemSet[rowIndex].note = evt.getSource().getParent().getParent().getParent().mAggregations.cells[2].getValue();

			var SLUG = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().ItemGuid.replace(/-/g, "").toUpperCase() +                                 //PCR035760++ Defect#131 TechUpgrade changes
				"$$" + oTable.getModel().getData().ItemSet[rowIndex].doctype + "$$" + oTable.getModel().getData().ItemSet[rowIndex].docsubtype +
				"$$O$$" + " " + "$$" + (that_S3.Custno === " " ? " " : that_S3.Custno) + "$$" + oTable.getModel().getData().ItemSet[rowIndex].filename +
				"$$" + (oTable.getModel().getData().ItemSet[rowIndex].note === " " ? " " : oTable.getModel().getData().ItemSet[rowIndex].note);
			
			var file = evt.oSource.oFileUpload.files[0];
			this.oFileUploader = evt.getSource();
			this.oFileUploader.setSendXHR(true);
			this.oFileUploader.removeAllHeaderParameters();

			var sToken = this.oMyOppModel._oDataModel.getHeaders()['x-csrf-token'];
			this.oMyOppModel._oDataModel.refreshSecurityToken(function(e, o) {
				sToken = o.headers['x-csrf-token'];
				that_S3.oFileUploader.addHeaderParameter(
					new sap.ui.unified.FileUploaderParameter({
						name: "X-CSRF-Token",
						value: sToken
					}));
				that_S3.oFileUploader.addHeaderParameter(
					new sap.ui.unified.FileUploaderParameter({
						name: "slug",
						value: SLUG
					}));
				that_S3.oFileUploader.addHeaderParameter(
					new sap.ui.unified.FileUploaderParameter({
						name: "content-type",
						value: file.type
					}));
				that_S3.oFileUploader.upload();
				sap.m.MessageToast.show(that_S3.getResourceBundle().getText("S2PSRSDACBCATTDOCUPLDSUCSSMSG"));
			}, function() {}, false);
			uploadButton.setVisible(true);
			oTable.getModel().refresh(true);
			that_S3.loadData();
			myBusyDialog.close();
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C****************
			//var oControllerS2 = sap.ui.getCore().byId(this.getResourceBundle().getText("S1VWToS2")).getController();
			this.onNavBack();
			//************************End Of PCR026243: DL:1803 Display Migration to Q2C******************
		},
		/**
		 * This method is used to handle upload complete event.
		 * 
		 * @name onComplete
		 * @param evt - Event Handler
		 * @returns
		 */
		onComplete: function(evt) {
			if (evt.getParameters().status === 201) {
				thisCntrlr.showToastMessage(this.bundle.getText("S3ATTCHUPLOADED"));
				if (sap.ui.getCore().getModel().getData().DocumentType === this.getResourceBundle().getText("S2ICONTABCARMKEY")) {
					that_S3.onNavBack();
				}

			} else if (oEvent.getParameters().status === 400) {
				thisCntrlr.showToastMessage($(oEvent.mParameters.responseRaw).find(this.getResourceBundle().getText("S2CBCPSRCARMTYPEMESG"))[0].innerText);
				that_S3.loadData();
			}
		},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf view.S3
		 */
		onAfterRendering: function() {
			that_S3.oOtherDocTable = this.byId(com.amat.crm.opportunity.Ids.S3_TABLE_OTHERDOC);
			//************************Start Of PCR026243: DL:1803 Display Migration to Q2C**************
			//if (sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBPSRMODEL")) !== undefined) {
			//	that_S3.Custno = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBPSRMODEL")).getData().Custno;
			//} else {
			//	if (sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBPDCSDAMODEL")) === undefined) {
			//		var Guid = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().Guid;
			//		var ItemGuid = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
			//		var sValidate = "PDCSDA_InfoSet(Guid=guid'" + Guid + "',ItemGuid=guid'" + ItemGuid +
			//			"')?$expand=NAV_PDC_BSDA_FINL,NAV_PDC_BSDA_FINN,NAV_PDC_BSDA_PARL,NAV_PDC_CC,NAV_PDC_FNL_DOCS,NAV_PDC_QA_SAF,NAV_PDC_SSDA_FINL,NAV_PDC_SSDA_FINN,NAV_PDC_SSDA_PARL,NAV_PDCBSDA_EVDOC,NAV_PDCCUST_REVSPEC,NAV_REV_DOCS,NAV_PDCSSDA_EVDOC";
			//		this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			//	}
			//	that_S3.Custno = sap.ui.getCore().getModel(this.getResourceBundle().getText("GLBPDCSDAMODEL")).getData().Custno;
			//}
			that_S3.Custno = this.getOwnerComponent().Custno;
			//************************End Of PCR026243: DL:1803 Display Migration to Q2C**************
		},

	});
});