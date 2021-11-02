/**
 * This class holds all methods of carm page.
 *
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends com.amat.crm.opportunity.controller.BaseController
 * @name com.amat.crm.opportunity.controller.attachment
 *
 *  * -------------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 * Ver.No    Date        Author    PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * V00    20/02/2018    Abhishek   PCR017480         Initial version              *
 *                      Pant
 *                     (X089025)                                                  *
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 12/07/2018      Abhishek        PCR019036         On General documents link    *
 *                 Pant                              Expiry Date is not mandatory *
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 25/01/2021      Abhishek        PCR033306         Q2C Display Enhancements     *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 * 06/04/2021      Arun Jacob      PCR034716         Q2C ESA,PSR Enhancements     *
 * 10/08/2021      Abhishek Pant   PCR036308         DiGFP Phase 2 Enhancements   *
 **********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController",
	"com/amat/crm/opportunity/controller/CommonController", "sap/m/MessageBox"
], function(Controller, CommonController, MessageBox) {
	"use strict";
	var thisCntrlr,
		that_views2,
		that_carm,
		that_pdcsda, oCommonController;
	return Controller.extend("com.amat.crm.opportunity.controller.attachment", {
		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */
		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 * 
		 * @memberOf view.attachment
		 */
		onInit: function() {
			thisCntrlr = this;
			this.bundle = thisCntrlr.getResourceBundle();
			that_views2 = this.getOwnerComponent().s2;
			thisCntrlr.colFlag = [false, false, false, false, false, false, false, false, false, false, false,
				false, false, false
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
			if (that_carm === undefined) {
				that_carm = this.getOwnerComponent().carm;
			}
			if (that_pdcsda === undefined) {
				that_pdcsda = this.getOwnerComponent().pdcsda;
			}
		},
		/**
		 * This method Handles Choose Button Event.
		 * 
		 * @name onChoosePress
		 * @param 
		 * @returns 
		 */
		onChoosePress: function() {
			var att;
			var oResouce = thisCntrlr.bundle;
			var Guid = thisCntrlr.getModelFromCore(oResouce.getText("GLBOPPGENINFOMODEL")).getData().Guid;
			var ItemGuid = thisCntrlr.getModelFromCore(oResouce.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
			var genaralDocFrag = [];
			//thisCntrlr.Custno = thisCntrlr.getModelFromCore(oResouce.getText("GLBPSRMODEL")).getData().Custno;                                //PCR026243--
			thisCntrlr.Custno = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBATTMODEL")).getData().Custno;                         //PCR026243++
			var sGenaralChoos = "Cust_DocSet?$filter=Guid eq guid'" + Guid + "' and ItemGuid eq guid'" + ItemGuid +
				"' and Customer eq '" + thisCntrlr.Custno + "'and DocType eq 'GDT'";
			this.oMyOppModel._oDataModel.read(sGenaralChoos, null, null, false, function(oData, oResponse) {
				att = oData;
			}, function(value) {});
			for (var i = 0; i < att.results.length; i++) {
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
				doc.Guid = att.results[i].Guid;
				doc.DocId = att.results[i].DocId;
				doc.docsubtype = att.results[i].DocSubtype;
				doc.DocDesc = att.results[i].DocDesc;
				doc.itemguid = att.results[i].ItemGuid;
				doc.doctype = att.results[i].DocType;
				doc.filename = att.results[i].FileName;
				doc.OriginalFname = att.results[i].OriginalFname;
				doc.note = att.results[i].Notes;
				doc.ExpireDate = att.results[i].ExpireDate !== oResouce.getText("S2ATTACHPSRCBDATESTRNGTEXT") ?new Date(att.results[i].ExpireDate.slice(0, 4), att.results[i].ExpireDate.slice(4, 6) -
						1, att.results[i].ExpireDate.slice(6, 8)) : null;					
				doc.Code = att.results[i].Code;
				doc.Customer = att.results[i].Customer;
				doc.MimeType = att.results[i].MimeType;
				doc.ItemNo = att.results[i].ItemNo;
				doc.OppId = att.results[i].OppId;
				doc.UploadedBy = att.results[i].UploadedBy;
				doc.UploadedDate = att.results[i].UploadedDate;
				doc.uBvisible = att.results[i].FileName === "" ? true : false;
				doc.bgVisible = !doc.uBvisible;
				doc.editable = false;
				genaralDocFrag.push(doc);
			}
			this.dialog = sap.ui.xmlfragment(oResouce.getText("PSRCBCONAPPORREJCONFIRMATION"), this);
			thisCntrlr.getCurrentView().addDependent(this.dialog);
			this.dialog.setModel(new sap.ui.model.json.JSONModel(), oResouce.getText(
				"S2PSRCBCATTDFTJSONMDLTXT"));
			this.dialog.getModel(oResouce.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
				"ItemSet": genaralDocFrag
			});
			this.dialog.open();
		},
		/**
		 * This method is used to handles SSDA on Select Spec event.
		 * 
		 * @name onSelectSSpec
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onSelectSSpec: function(oEvent) {
			var value = "";
			(oEvent.getParameters().selected === true) ? (value = thisCntrlr.bundle.getText("S2ODATAPOSVAL")) :
			(value = "");
			if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.bundle
				.getText("S2ICONTABPSRSDAKEY")) {
				thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData().StreachedSpec =
					value;
			} else {
				thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPDCSDAMODEL")).getData().StreachedSpec =
					value;
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
		 * This method Handles BSDA Work-flow Process .
		 * 
		 * @name onWFPress
		 * @param 
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
		 * This method is used to apply security on table in PSR/PDC.
		 * 
		 * @name setTableSecurity
		 * @param oTable - table object
		 * @returns 
		 *  
		 */
		setTableSecurity: function(oTable) {
			if (oTable.getModel().getData().ItemSet !== undefined) {
				var SecurityData = thisCntrlr.getModelFromCore(this.getResourceBundle().getText("GLBSECURITYMODEL")).getData();
				for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {
					if (oTable.getId().split("-")[oTable.getId().split("-").length - 1] === com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_TABLE ||
						oTable.getId().split("-")[oTable.getId().split("-").length - 1] === com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CUST_SpecREV1_TABLE
					) {
						if (SecurityData.UpldCustSpec !== this.getResourceBundle().getText("S1TABLESALESTAGECOL")) {
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[0].setVisible(false);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[1].setVisible(false);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[2].setVisible(false);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[1].mAggregations.items[0].setVisible(false);
							oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
						} else {
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[0].setVisible(true);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[1].setVisible(true);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[2].setVisible(true);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[1].mAggregations.items[0].setVisible(true);
							oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(oTable.getModel().getData().ItemSet[i].Enableflag);
						}
					} else if (oTable.getId().split("-")[oTable.getId().split("-").length - 1] === com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_FPSR_DOC_TABLE) {

						if (SecurityData.UpldFnlSpec !== this.getResourceBundle().getText("S1TABLESALESTAGECOL")) {
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[0].setVisible(false);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[1].setVisible(false);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[2].setVisible(false);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[1].mAggregations.items[0].setVisible(false);
							oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
						} else {
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[0].setVisible(true);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[1].setVisible(true);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[2].setVisible(true);
							oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[1].mAggregations.items[0].setVisible(true);
							oTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(oTable.getModel().getData().ItemSet[i].Enableflag);
						}
					}
				}
			}
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
						thisCntrlr.bundle.getText("S2PSRSDAEDITICON"));
					oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[1].setIcon(
						thisCntrlr.bundle.getText("S2PSRSDADELETEICON"));
					oTable.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[2].setVisible(
						true);
				}
			}
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
			sap.ui.core.BusyIndicator.show();
			var uploadButton = evt.getSource().getParent().getParent().mAggregations.items[1];
			var rowIndex = uploadButton.getId().split("-")[uploadButton.getId().split("-").length - 1];
			var oTable = evt.getSource().getParent().getParent().getParent().getParent();
			oTable.getModel().getData().ItemSet[rowIndex].filename = evt.mParameters.newValue;
			thisCntrlr.oTable = oTable;
			thisCntrlr.tableModel = oTable.getModel().getData();
			if (evt.getParameters().id.toLowerCase().indexOf(thisCntrlr.bundle.getText("S2ICONTABCARMKEY").toLowerCase()) >=
				0) {
				thisCntrlr.Custno = thisCntrlr.carmValidate.Customer;
			} else {
				thisCntrlr.Custno = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBATTMODEL")).getData()
					.Custno;
			}
			oTable.getModel().getData().ItemSet[rowIndex].uBvisible = true;
			oTable.getModel().getData().ItemSet[rowIndex].bgVisible = !oTable.getModel().getData().ItemSet[rowIndex]
				.uBvisible;
			oTable.getModel().getData().ItemSet[rowIndex].editable = false;
			if (evt.getSource().getParent().getParent().getParent().mAggregations.cells[2].mAggregations.items !==
				undefined) {
				oTable.getModel().getData().ItemSet[rowIndex].note = evt.getSource().getParent().getParent().getParent()
					.mAggregations.cells[2].getValue();
			}
			if (oTable.getModel().getData().ItemSet[rowIndex].doctype === thisCntrlr.bundle.getText("S2MLIMCOMMDATATYP") && oTable.getModel().getData()
				.ItemSet[rowIndex]
				.docsubtype === thisCntrlr.bundle.getText("S2ATTOTHTYPETEXT") || oTable.getModel().getData().ItemSet[rowIndex].Code === thisCntrlr
				.bundle.getText("S2OTHDOCCODETEXT")) {
				var type = thisCntrlr.bundle.getText("S2OTHDOCCODETEXT");
			} else {
				var type = "";
			}
			var SLUG = oTable.getModel().getData().ItemSet[rowIndex].itemguid.replace(/-/g, "").toUpperCase() + "$$" + oTable.getModel()                                             //PCR035760++ Defect#131 TechUpgrade changes
				.getData().ItemSet[rowIndex].doctype + "$$" + oTable.getModel().getData().ItemSet[rowIndex].docsubtype +
				"$$" + type + "$$" + " " + "$$" + thisCntrlr.Custno + "$$" + oTable.getModel().getData().ItemSet[
					rowIndex].filename + "$$" + (oTable.getModel().getData().ItemSet[rowIndex].note === " " ? " " :
					oTable.getModel().getData().ItemSet[rowIndex].note);
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
			uploadButton.setVisible(false);
			var buttonGroup = evt.getSource().getParent().getParent().mAggregations.items[0];
			buttonGroup.setVisible(true);
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
				thisCntrlr.onExpBookDoc();
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCATTDOCUPLDSUCSSMSG"));
				thisCntrlr.dialog.close();
				thisCntrlr.dialog.destroy();
			} else if (oEvent.getParameters().status === 400) {
				thisCntrlr.showToastMessage($(oEvent.mParameters.responseRaw).find(thisCntrlr.getResourceBundle().getText(
					"S2CBCPSRCARMTYPEMESG"))[0].innerText);
				thisCntrlr.onExpBookDoc();
				thisCntrlr.dialog.close();
				thisCntrlr.dialog.destroy();
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
			if (thisCntrlr.source.getIcon().indexOf(thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDDELTXT").toLowerCase()) >=
				0) {
				var text = thisCntrlr.bundle.getText("S2ATTCHDOCDELVALDMSG") + " " + thisCntrlr.oTable.getModel()
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
		 * This method Handles Cancel Dialog Button Event.
		 * 
		 * @name onCancelFragment
		 * @param 
		 * @returns 
		 */
		onCancelFragment: function() {
			this.closeDialog();
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
			//***********Start Of PCR026243: DL:1803 Display Migration to Q2C**************
			var DisView = "";
			if(thisCntrlr.getOwnerComponent().OppType === thisCntrlr.getResourceBundle().getText("S4DISOPPTYPTXT")){
				DisView = thisCntrlr.getOwnerComponent().s4;
			} else {
				DisView = thisCntrlr.getOwnerComponent().s2;
			}
			//***********End Of PCR026243: DL:1803 Display Migration to Q2C**************
			var oEntry = {
				Guid: GenInfoData.Guid,
				ItemGuid: GenInfoData
					.ItemGuid,
//			    *** Justification: Passing the OppID and ItemId values in payload  ***
				//OppId: thisCntrlr.getOwnerComponent().s2.getController().OppId,                                                          //PCR019036++;PCR026243--
				//ItemNo: thisCntrlr.getOwnerComponent().s2.getController().ItemNo.toString(),                                             //PCR019036++;PCR026243--
				OppId: DisView.getController().OppId,                                                                                      //PCR026243++
				ItemNo: DisView.getController().ItemNo.toString(),                                                                         //PCR026243++
				Repflag: "",
				NAV_CUSTDOCLINK: []
			};
			var items = this.dialog.getContent()[0].getItems();
			if (items.length !== 0) {
				for (var i = 0; i < items.length; i++) {
					if (items[i].getCells()[3].getSelected()) {
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
//							*** Justification: On General documents link Expiry Date is not mandatory - condition changed ***
//							ExpireDate: tableData.ExpireDate.yyyymmdd(),                                                         //PCR019036--
							ExpireDate: tableData.ExpireDate !== null ? tableData.ExpireDate.yyyymmdd() : tableData.ExpireDate,  //PCR019036++
							UploadedBy: tableData.UploadedBy,
							UploadedDate: tableData.UploadedDate
						};
						oEntry.NAV_CUSTDOCLINK.push(doc);
					}
				}
				this.oMyOppModel._oDataModel.create('/CustDoclinkSet', oEntry, null, jQuery.proxy(this._SavedSuccessCallback, this), jQuery.proxy(
					this._SavedFailCallback, this));
				this.closeDialog();
			} else {
				thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ATTACHSELECTMSG"));
			}
		},
		/**
		 * This method Handles on Service Success call Back fuction.
		 * 
		 * @name _SavedSuccessCallback
		 * @param 
		 * @returns 
		 */
		_SavedSuccessCallback: function() {
			this.onExpBookDoc();
			thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ATTCHSUBMTSUCSSMSG"));
		},
		/**
		 * This method Handles on Service Fail call Back fuction.
		 * 
		 * @name _SavedFailCallback
		 * @param 
		 * @returns 
		 */
		_SavedFailCallback: function() {
			thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2CONTCTSAVEERRORMSG"));
		},
		/**
		 * This method Handles on Save Button Event.
		 * 
		 * @name onSave
		 * @param 
		 * @returns 
		 */
		onSave: function() {
			this.closeDialog();
			this.destroyDialog();
		},
		/**
		 * This method Handles Booking Document Panel Expended Event.
		 * 
		 * @name onExpBookDoc
		 * @param oEvt: Event Handler
		 * @returns 
		 */
		onExpBookDoc: function(oEvt) {
			sap.ui.core.BusyIndicator.show();
			var att;
			var oView = thisCntrlr.getView();
			var oResource = thisCntrlr.bundle;
			thisCntrlr.genaralDoctype;
			var Guid = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().Guid;
			var ItemGuid = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData()
				.ItemGuid;
			var sBookingDoc = "Doc_HeadInfoSet(Guid=guid'" + Guid + "',ItemGuid=guid'" + ItemGuid +
				"')?$expand=NAV_GENRAL_DOCS,NAV_BOOKING_DOCS,NAV_PBCO_DOCS,NAV_POSTBOOK_DOC";
			thisCntrlr.sBookingDoc = sBookingDoc;
			this.serviceCall(sBookingDoc, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			att = thisCntrlr.getModelFromCore(oResource.getText("GLBATTMODEL")).getData();
			var genaralDocData = [];
			var SecurityData = thisCntrlr.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();
			(SecurityData.UpldGenDoc === oResource.getText("S2ODATAPOSVAL")) ? (oView.byId(
				com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_PANEL_CHOOSEBtn).setVisible(true)) : (
				oView.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_PANEL_CHOOSEBtn).setVisible(
					false));
			(SecurityData.ViewGenDoc === oResource.getText("S2ODATAPOSVAL")) ? (oView.byId(
				com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_PANEL).setVisible(true)) : (oView
				.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_PANEL).setVisible(false));
			(SecurityData.ViewBokDoc === oResource.getText("S2ODATAPOSVAL")) ? (oView.byId(
				com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_BOOKING_PANEL).setVisible(true)) : (oView.byId(
				com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_BOOKING_PANEL).setVisible(false));
			(SecurityData.ViewPbcoDoc === oResource.getText("S2ODATAPOSVAL")) ? (oView.byId(
				com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_POSTBOOKINGCHANGE_PANEL).setVisible(true)) : (oView
				.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_POSTBOOKINGCHANGE_PANEL).setVisible(false));
			(SecurityData.ViewPbDoc === oResource.getText("S2ODATAPOSVAL")) ? (oView.byId(
				com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_POSTBOOKING_PANEL).setVisible(true)) : (oView
				.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_POSTBOOKING_PANEL).setVisible(false));
			oView.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_BOOKING_OTHERBtn).setEnabled((
				SecurityData.UpldBokDoc === oResource.getText("S2ODATAPOSVAL")));
			oView.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_POSTBOOKINGCHANGE_OTHERBtn).setEnabled(
				(SecurityData.UpldPbcoDoc === oResource.getText("S2ODATAPOSVAL")));
			oView.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_POSTBOOKING_OTHERBtn).setEnabled((
				SecurityData.UpldPbDoc === oResource.getText("S2ODATAPOSVAL")));
			thisCntrlr.genaralDocFrag = [];
			thisCntrlr.Guid = att.Guid;
			thisCntrlr.itemguid = att.ItemGuid;
			//*************************Start Of PCR034716++ Q2C ESA,PSR Enhancements********************
			var ServiceConfig = com.amat.crm.opportunity.util.ServiceConfigConstants;
			if(this.getModelFromCore(oResource.getText("S1DISBUSETMODEL")) === undefined){
				this.serviceDisCall(ServiceConfig.DisBuSet,  ServiceConfig.read, "", "");
			}
			//*************************End Of PCR034716++ Q2C ESA,PSR Enhancements********************
			//*************************Start Of PCR033306 Q2C Display Enhancements********************
			var disFlag = this.getModelFromCore(oResource.getText("S1DISBUSETMODEL")).getData().disFlag;
			if(SecurityData.AgsUser === oResource.getText("S2ODATAPOSVAL") && disFlag === oResource.getText("S2ODATAPOSVAL")){
				var AGSVal = {
						"attChsBtnVis": SecurityData.AgsUser === oResource.getText("S2ODATAPOSVAL") ? false : true
				};
				var AGSData = this.getJSONModel(AGSVal);
				oView.setModel(AGSData);
			}
			if(att.NAV_GENRAL_DOCS.results[0] !== undefined){
		    //*************************End Of PCR033306 Q2C Display Enhancements**********************
				thisCntrlr.DocType = att.NAV_GENRAL_DOCS.results[0].DocType;
			}                                                                                                                                                          //PCR033306++
			//*************************Start Of PCR036308 Q2C Display Enhancements********************
			if(oView.getModel("oLUkValModel") === undefined){
				var oLUkValModel = new sap.ui.model.json.JSONModel({          
			          bLUkColumn: true
			    });
				oView.setModel(oLUkValModel, "oLUkValModel");
			}			
			var oLUkValModel = oView.getModel("oLUkValModel");
			disFlag === oResource.getText("S2ODATAPOSVAL") ? (oLUkValModel.setProperty("/bLUkColumn", true)) : (oLUkValModel.setProperty("/bLUkColumn", false));
			oView.getModel("oLUkValModel").refresh();
			//**************************End Of PCR036308 Q2C Display Enhancements*********************
			for (var i = 0; i < att.NAV_GENRAL_DOCS.results.length; i++) {
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
					"editable": true,
					"delVisible": true,
				};
				if (att.NAV_GENRAL_DOCS.results[i].FileName !== "") {
					doc.Guid = att.NAV_GENRAL_DOCS.results[i].Guid;
					doc.DocId = att.NAV_GENRAL_DOCS.results[i].DocId;
					doc.docsubtype = att.NAV_GENRAL_DOCS.results[i].DocSubtype;
					doc.itemguid = att.NAV_GENRAL_DOCS.results[i].ItemGuid;
					doc.doctype = att.NAV_GENRAL_DOCS.results[i].DocType;
					doc.DocDesc = att.NAV_GENRAL_DOCS.results[i].DocDesc;
					doc.filename = att.NAV_GENRAL_DOCS.results[i].FileName;
					doc.OriginalFname = att.NAV_GENRAL_DOCS.results[i].OriginalFname;
					doc.note = att.NAV_GENRAL_DOCS.results[i].Notes;
					var expDate = (att.NAV_GENRAL_DOCS.results[i].ExpireDate === oResource.getText(
						"S2ATTACHPSRCBDATESTRNGTEXT") || att.NAV_GENRAL_DOCS.results[i].ExpireDate === "") ? null : new Date(
						att.NAV_GENRAL_DOCS.results[i].ExpireDate.slice(0, 4), att.NAV_GENRAL_DOCS.results[i].ExpireDate
						.slice(4, 6) - 1, att.NAV_GENRAL_DOCS.results[i].ExpireDate.slice(6, 8));
					doc.ExpireDate = expDate;
					doc.EnableDisflag = (SecurityData.ViewGenDoc === oResource.getText("S2ODATAPOSVAL") ?
						true : false);
					doc.Code = att.NAV_GENRAL_DOCS.results[i].Code;
					doc.uBvisible = att.NAV_GENRAL_DOCS.results[i].FileName === "" ? true : false;
					doc.bgVisible = !doc.uBvisible;
					doc.editable = false;
					genaralDocData.push(doc);
					thisCntrlr.DocType = att.NAV_GENRAL_DOCS.results[i].DocType;
					thisCntrlr.docsubtype = att.NAV_GENRAL_DOCS.results[i].DocSubtype;
					doc.delVisible = (SecurityData.DelGenDoc === oResource.getText("S2ODATAPOSVAL") ?
						true : false);
				}
			}
			var oBookingDocJModel = this.getJSONModel({
				"ItemSet": genaralDocData
			});
			thisCntrlr.oGeneralDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_TABLE);
			thisCntrlr.oGeneralDocTable.setModel(oBookingDocJModel);
			var table = thisCntrlr.oGeneralDocTable;
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
			var BookingDocData = [];
			for (var i = 0; i < att.NAV_BOOKING_DOCS.results.length; i++) {
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
					"delVisible": true,
					"addupVisible": true
				};
				doc.Code = att.NAV_BOOKING_DOCS.results[i].Code;
				doc.Guid = att.NAV_BOOKING_DOCS.results[i].Guid;
				doc.DocId = att.NAV_BOOKING_DOCS.results[i].DocId;
				doc.docsubtype = att.NAV_BOOKING_DOCS.results[i].DocSubtype;
				doc.itemguid = att.NAV_BOOKING_DOCS.results[i].ItemGuid;
				doc.DocDesc = att.NAV_BOOKING_DOCS.results[i].DocDesc;
				doc.doctype = att.NAV_BOOKING_DOCS.results[i].DocType;
				doc.filename = att.NAV_BOOKING_DOCS.results[i].FileName;
				doc.OriginalFname = att.NAV_BOOKING_DOCS.results[i].OriginalFname;
				doc.note = att.NAV_BOOKING_DOCS.results[i].Notes;
				doc.EnableDisflag = (SecurityData.ViewBokDoc === oResource.getText("S2ODATAPOSVAL") ?
					true : false);
				doc.uBvisible = att.NAV_BOOKING_DOCS.results[i].FileName === "" ? true : false;
				doc.bgVisible = !doc.uBvisible;
				doc.editable = att.NAV_BOOKING_DOCS.results[i].FileName === "" ? true : false;
				doc.delVisible = (SecurityData.DelBokDoc === oResource.getText("S2ODATAPOSVAL") ? true :
					false);
				doc.addupVisible = (SecurityData.UpldBokDoc === oResource.getText("S2ODATAPOSVAL") ?
					true : false);
				BookingDocData.push(doc);
			}
			//BookingDocData.LUkVis = disFlag === oResource.getText("S2ODATAPOSVAL") ? true : false;                                                                                   //PCR036308++
			var oBookingDocJModel = this.getJSONModel({
				"ItemSet": BookingDocData
			});
			thisCntrlr.oBookingDocTable = oView.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_BOOKING_TABLE);
			thisCntrlr.oBookingDocTable.setModel(oBookingDocJModel);
			this.resetTable(thisCntrlr.oBookingDocTable);
			var PostBookChgPnlData = [];
			for (var i = 0; i < att.NAV_PBCO_DOCS.results.length; i++) {
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
					"delVisible": true,
					"addupVisible": true
				};
				doc.Code = att.NAV_PBCO_DOCS.results[i].Code;
				doc.Guid = att.NAV_PBCO_DOCS.results[i].Guid;
				doc.DocId = att.NAV_PBCO_DOCS.results[i].DocId;
				doc.docsubtype = att.NAV_PBCO_DOCS.results[i].DocSubtype;
				doc.itemguid = att.NAV_PBCO_DOCS.results[i].ItemGuid;
				doc.DocDesc = att.NAV_PBCO_DOCS.results[i].DocDesc;
				doc.doctype = att.NAV_PBCO_DOCS.results[i].DocType;
				doc.filename = att.NAV_PBCO_DOCS.results[i].FileName;
				doc.OriginalFname = att.NAV_PBCO_DOCS.results[i].OriginalFname;
				doc.note = att.NAV_PBCO_DOCS.results[i].Notes;
				doc.EnableDisflag = (SecurityData.ViewPbcoDoc === oResource.getText("S2ODATAPOSVAL") ?
					true : false);
				doc.uBvisible = att.NAV_PBCO_DOCS.results[i].FileName === "" ? true : false;
				doc.bgVisible = !doc.uBvisible;
				doc.editable = att.NAV_PBCO_DOCS.results[i].FileName === "" ? true : false;
				doc.delVisible = (SecurityData.DelPbcoDoc === oResource.getText("S2ODATAPOSVAL") ?
					true : false);
				doc.addupVisible = (SecurityData.UpldPbcoDoc === oResource.getText("S2ODATAPOSVAL") ?
					true : false);
				PostBookChgPnlData.push(doc);
			}
			var oPostBookChgPnlJModel = this.getJSONModel({
				"ItemSet": PostBookChgPnlData
			});
			thisCntrlr.oPostBookChgPnlTable = oView.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_POSTBOOKINGCHANGE_TABLE);
			thisCntrlr.oPostBookChgPnlTable.setModel(oPostBookChgPnlJModel);
			this.resetTable(thisCntrlr.oPostBookChgPnlTable);
			var PostBookDocPnlData = [];
			for (var i = 0; i < att.NAV_POSTBOOK_DOC.results.length; i++) {
				var doc = {
					"Guid": "",
					"DocId": "",
					"itemguid": "",
					"doctype": "",
					"DocDesc": "",
					"docsubtype": "",
					"filename": "",
					"OriginalFname": "",
					"note": "",
					"uBvisible": false,
					"bgVisible": false,
					"editable": true,
					"delVisible": true,
					"addupVisible": true
				};
				doc.Code = att.NAV_POSTBOOK_DOC.results[i].Code;
				doc.Guid = att.NAV_POSTBOOK_DOC.results[i].Guid;
				doc.DocId = att.NAV_POSTBOOK_DOC.results[i].DocId;
				doc.docsubtype = att.NAV_POSTBOOK_DOC.results[i].DocSubtype;
				doc.itemguid = att.NAV_POSTBOOK_DOC.results[i].ItemGuid;
				doc.DocDesc = att.NAV_POSTBOOK_DOC.results[i].DocDesc;
				doc.doctype = att.NAV_POSTBOOK_DOC.results[i].DocType;
				doc.filename = att.NAV_POSTBOOK_DOC.results[i].FileName;
				doc.OriginalFname = att.NAV_POSTBOOK_DOC.results[i].OriginalFname;
				doc.note = att.NAV_POSTBOOK_DOC.results[i].Notes;
				//doc.EnableDisflag = (SecurityData.ViewPbDoc === oResource.getText("S2ODATAPOSVAL") ?                                                                           //PCR033306--
				//	true : false);                                                                                                                                               //PCR033306--
				doc.EnableDisflag = (SecurityData.ViewPbDoc === oResource.getText("S2ODATAPOSVAL") || (SecurityData.AgsUser ===                                                  //PCR033306++
				    oResource.getText("S2ODATAPOSVAL") && disFlag === oResource.getText("S2ODATAPOSVAL")) ? true : false);                                                       //PCR033306++
				doc.uBvisible = att.NAV_POSTBOOK_DOC.results[i].FileName === "" ? true : false;
				doc.bgVisible = !doc.uBvisible;
				doc.editable = att.NAV_POSTBOOK_DOC.results[i].FileName === "" ? true : false;
				//doc.delVisible = (SecurityData.DelPbDoc === oResource.getText("S2ODATAPOSVAL") ? true :                                                                        //PCR033306--
				//	false);                                                                                                                                                      //PCR033306--
				//doc.addupVisible = (SecurityData.UpldPbDoc === oResource.getText("S2ODATAPOSVAL") ?                                                                            //PCR033306--
				//	true : false);                                                                                                                                               //PCR033306--
				doc.delVisible = (SecurityData.DelPbDoc === oResource.getText("S2ODATAPOSVAL") || (SecurityData.AgsUser ===                                                      //PCR033306++
				    oResource.getText("S2ODATAPOSVAL") && disFlag === oResource.getText("S2ODATAPOSVAL")) ? true : false);                                                       //PCR033306++
				doc.addupVisible = (SecurityData.UpldPbDoc === oResource.getText("S2ODATAPOSVAL") || (SecurityData.AgsUser ===                                                   //PCR033306++
				    oResource.getText("S2ODATAPOSVAL") && disFlag === oResource.getText("S2ODATAPOSVAL")) ? true : false);                                                       //PCR033306++
				PostBookDocPnlData.push(doc);
			}
			var oPostBookChgPnlJModel = this.getJSONModel({
				"ItemSet": PostBookDocPnlData
			});
			thisCntrlr.oPostBookDocPnlTable = oView.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_POSTBOOKING_TABLE);
			thisCntrlr.oPostBookDocPnlTable.setModel(oPostBookChgPnlJModel);
			this.resetTable(thisCntrlr.oPostBookDocPnlTable);			
			sap.ui.core.BusyIndicator.hide();
		},
		/**
		 * This method Handles Get Dialog for General Booking Docs.
		 * 
		 * @name resetTable
		 * @param table -- object of table
		 * @returns 
		 */
		resetTable: function(table) {
			for (var i = 0; i < table.getModel().getData().ItemSet.length; i++) {
				if (table.getModel().getData().ItemSet[i].addupVisible === true) {
					table.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[0].setVisible(true);
					table.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[1].setVisible(true);
					if (table.getModel().getData().ItemSet[i].uBvisible === true) {
						table.mAggregations.items[i].mAggregations.cells[2].setEnabled(true);
					} else {
						table.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
					}
				} else {
					table.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[0].setVisible(false);
					table.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[1].setVisible(false);
					table.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
				}
				table.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[0].setIcon(this.getResourceBundle()
					.getText("S2PSRSDAEDITICON"));
				table.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[1].setIcon(this.getResourceBundle()
					.getText("S2PSRSDADELETEICON"));
				if (table.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[3] !== undefined) {
					table.mAggregations.items[i].mAggregations.cells[3].mAggregations.items[0].mAggregations.items[3].setVisible(true);
				}
				if (table.getModel().getData().ItemSet[i].DocDesc === this.getResourceBundle().getText("S2OTHDOCDES") &&
					table.getModel().getData().ItemSet[i].FileName !== "") {
					table.mAggregations.items[i].mAggregations.cells[2].setValueState(sap.ui.core.ValueState.None);
				}
			}
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
			var sDocSubtype = "Other_DoclistSet?$filter=DocType eq 'GDT'";
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
		 * This method Handles Other Button Event.
		 * 
		 * @name handleOtherPress
		 * @param evt - Event Handlers
		 * @returns 
		 */
		handleOtherPress: function(evt) {
			var DocumentType = [{
				"DocumentType": DocumentType
			}];
			var oResource = thisCntrlr.bundle;
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
			//var oControllerS3 = sap.ui.getCore().byId(thisCntrlr.bundle.getText("S1VWToS3")).getController();
			var oControllerS3 = this.getOwnerComponent().s3.getController();
			oControllerS3.loadData(DocumentType);
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
			colIndex = evt.getParameter(thisCntrlr.bundle.getText("S1COLMNINDEXTEXT"));
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
			var searchText, contactData;
			if (oEventParameters.hasOwnProperty(thisCntrlr.bundle.getText("S2TYPECONTCTPROPTXT"))) {
				searchText = oEventParameters.newValue;
				if (searchText.length < 3) return;
			} else searchText = oEventParameters.query;
			this.contactF4Fragment.getModel(thisCntrlr.bundle.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
				"ItemSet": []
			});
			var sContact = "Search_contactSet?$filter=NameFirst eq '" + searchText + "'";
			var model = this.oMyOppModel._oDataModel;
			if (searchText.length !== 0) {
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
			var CBCData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBCBCMODEL")).getData();
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
		 * This method Used to refresh GenInfo Model.
		 * 
		 * @name refreshModel
		 * @param 
		 * @returns 
		 */
		refreshModel: function() {
			var GenInfoData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData();
			var sValidatePath = "GenralInfoSet(Guid=guid'" + GenInfoData.Guid + "',ItemGuid=guid'" + GenInfoData.ItemGuid +
				"')?$expand=NAV_ASM_INFO,NAV_BMHEAD_INFO,NAV_BMO_INFO,NAV_BSM_INFO,NAV_CON_INFO,NAV_GPM_INFO,NAV_GSM_INFO,NAV_KPU_INFO,NAV_PM_INFO,NAV_POM_INFO,NAV_RBM_INFO,NAV_ROM_INFO,NAV_SALES_INFO,NAV_TPS_INFO,NAV_TRANS_HISTORY";
			this.getView().getController().serviceCall(sValidatePath, com.amat.crm.opportunity.util.ServiceConfigConstants
				.read, "", "");
			that_general.getController().setQuoteRevisionNumber();
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
			//thisCntrlr.Custno = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBPSRMODEL")).getData()                               //PCR026243--
			//	.Custno;                                                                                                                        //PCR026243--
			thisCntrlr.Custno = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBATTMODEL")).getData().Custno;                         //PCR026243++
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
			var SLUG = thisCntrlr.itemguid.replace(/-/g, "").toUpperCase() + "$$" + thisCntrlr.DocType + "$$" + docsubtype +                                                         //PCR035760++ Defect#131 TechUpgrade Solution
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
		 * This method Handles Fragment Note Live Change Event.
		 * 
		 * @name handleFragLiveChange
		 * @param oEvt - Event Handlers
		 * @returns 
		 */
		handleFragLiveChange: function(oEvt) {
			if (oEvt.getParameters().value.length >= 255) {
				oEvt.getSource().setValue(oEvt.getParameters().value.substr(0, 254));
				that_S2.showToastMessage(that_S2.getResourceBundle().getText("S2PSRSDACBCMCOMMVALTXT"));
			}
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
		},
		/**
		 * This method Handles General Document Fragment Check box event.
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
		//*************** Start Of PCR036308++; DiGFP Phase 2 Enhancements ****************
		/**
		 * This method is used to handles Link/De-link Button Press.
		 * @name handleLLinkPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		handleLLinkPress: function(oEvent) {
			var oResource = thisCntrlr.getResourceBundle(),
			    configConsts = com.amat.crm.opportunity.util.ServiceConfigConstants,
			    object = oEvent.getSource().getBindingContext().getObject(),
			    ItemGuid = object.itemguid.toUpperCase(),
			    docId = object.DocId.toUpperCase(),
			    type = oEvent.getSource().getIcon() === "sap-icon://chain-link" ? "L" : "U",
			    sGenaralChoos = "CustDoclinkSet?$filter=ItemGuid eq guid'" + ItemGuid + "' and OppId eq 'ATTACH' and Guid eq guid'" + docId + "' and RepFlag eq '"+ type + "'";
			this.LUObject = object;
			this.type = type;
			this.serviceDisCall(sGenaralChoos, configConsts.read, "", "");
			var LnkData = thisCntrlr.getModelFromCore("oLnkModel").getData();
			for (var i = 0; i < LnkData.results.length; i++) {
				LnkData.results[i].Selected = false;
			}
			this.dialog = sap.ui.xmlfragment(oResource.getText("PSRCBCCCF4helpOppLink"), this);
			this.dialog.getContent()[2].getColumns().map(function(item){item.setVisible(true);});
			this.dialog.getSubHeader().setVisible(true);
			this.getCurrentView().addDependent(this.dialog);
			this.dialog.setModel(this.getJSONModel(LnkData));
			this.dialog.setContentWidth("40%");
			this.dialog.open();
		},
		/**
		 * This method is used to handles Search functionality. 
		 * @name searchOpportunity
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns 
		 */
		searchOpportunity: function(oEvent) {
			var oFilter;
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var aFilters = [new sap.ui.model.Filter(thisCntrlr.bundle.getText("S2OPPAPPOPPIDKEY"), sap.ui.model
					.FilterOperator.Contains, sQuery)]
				oFilter = new sap.ui.model.Filter(aFilters, false);
			}
			var binding = this.dialog.getContent()[2].getBinding("items");
			binding.filter(oFilter);
		},
//		/**
//		 * This method is used remove duplicate values.
//		 * @name removeDuplicate
//		 * @param filtered - Carbon Copy Data
//		 * @returns filtered
//		 */
//		removeDuplicate: function(filtered){
//			filtered = function (array) {
//				var o = {};
//				return array.filter(function (a) {
//					var k = a.Guid && a.ItemGuid;
//					if (!o[k]) {
//						o[k] = true;
//						return true;
//					}
//				});
//		   }(filtered);
//		   return filtered;
//		},
		/**
		 * This method is used to handles OK button event.
		 * @name onRelPerSpecRewOkPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event
		 * @returns
		 */
		onRelPerSpecRewOkPress: function(oEvent) {
			this._initiateControllerObjects(thisCntrlr);
			var oResource = thisCntrlr.getResourceBundle(),
			    diaModel = this.dialog.getModel().getData(),
			    obj = {};
			this.closeDialog();
			obj.NAV_DOC_LINK = [];
			obj.Guid = this.LUObject.Guid;
			obj.LinkType = this.type;
			obj.ItemGuid = this.LUObject.itemguid;
			obj.DocType = this.LUObject.doctype;
			obj.DocSubtype = this.LUObject.docsubtype;
			obj.DocId = this.LUObject.DocId;		
			obj.Customer = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBATTMODEL")).getData().Custno;
//			obj.DocDesc = "";
//			obj.Notes = "";
//			obj.MimeType = "";
//			obj.FileName = "";
//			obj.OriginalFname = "";
//			obj.OppId = "";
//			obj.ItemNo = "";
//			obj.Code = "";
//			obj.ExpireDate = "";
//			obj.DocSortno = "";
//			obj.UploadedBy = "";
//			obj.UploadedDate = "";
//			obj.Timestamp = "";
//			obj.VersionNo = "";
			for (var i = 0; i < diaModel.results.length; i++) {
				if(diaModel.results[i].Selected === true){
					var temp = {};
					temp.Guid = diaModel.results[i].Guid;
					temp.LinkType = this.type;
					temp.ItemGuid = diaModel.results[i].ItemGuid;
//					temp.DocType = "";
//					temp.DocSubtype = "";
					temp.DocId = this.LUObject.DocId;
					temp.OppId = diaModel.results[i].OppId;
					temp.ItemNo = diaModel.results[i].ItemNo;
//					temp.DocDesc = "";
//					temp.Notes = "";
//					temp.MimeType = "";
//					temp.FileName = "";
//					temp.OriginalFname = "";
//					temp.Customer = "";
//					temp.Code = "";
//					temp.ExpireDate = "";
//					temp.DocSortno = "";
//					temp.UploadedBy = "";
//					temp.UploadedDate = "";
//					temp.Timestamp = "";
//					temp.VersionNo = "";
					obj.NAV_DOC_LINK.push(temp);
				}				
			}
			var SuccessMsg = this.type === "L" ? "Selected Opportunities Linked Successfully!" : "Selected Opportunities De-Linked Successfully!"
			this.serviceDisCall("DocumentsSet", com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, obj, SuccessMsg);
//			switch (this.CbnType){
//			case oResource.getText("S1ESAIDSPROSTYPTXT"):
//				var CBCData = thisCntrlr.getModelFromCore(oResource.getText("GLBESAMCOMMMODEL")).getData().oEsaManComm,
//				    EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")),
//				    FinalRecord = {
//					    "NAV_ESA_CC": {"results": []}
//					};
//				for (var i = 0, n = 0; i < CBCData.results.length; i++) {
//					if (CBCData.results[i].Selected === true) {
//						FinalRecord.NAV_ESA_CC.results[n] = CBCData.results[i];
//						n++;
//					}
//				}
//				FinalRecord.NAV_ESA_CC.results = FinalRecord.NAV_ESA_CC.results.concat(EsaData.getProperty("/NAV_ESA_CC").results);
//				FinalRecord.NAV_ESA_CC.results = this.removeDuplicate(FinalRecord.NAV_ESA_CC.results);
//				this.closeDialog();
//				this.getModel().setProperty("/EsaCbnCpyTblVis", true);
//				this.getModel().setProperty("/NAV_ESA_CC", FinalRecord.NAV_ESA_CC);
//				this.getModel().refresh(true);
//				this.SelectedRecord.results.length = 0;
//				this.UnselectedRecord.results.length = 0;
//				break;
//			case oResource.getText("S2ESADLINKTYPTXT"):
//				 var Msg = this.dialog.getContent()[1].getValue();
//				 if(Msg.trim() !== ""){
//					 var oModel = thisCntrlr.getDataModels(),
//					     ESAData = oModel[4].NAV_ESA_CC.results,
//					     delValidFlag = thisCntrlr.getDlnkcheck(ESAData);
//					 if(delValidFlag === false){
//						 thisCntrlr.showToastMessage(oResource.getText("S2ALLDLINKOPPSELFAILMGS"));
//				     } else {
//				    	 var edtBtnTxt = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESADTBTN).getText(),
//				    	     edtFlag = edtBtnTxt === oResource.getText("S2PSRSDACANBTNTXT") ? true : false,
//				    	     payload = thisCntrlr.getDLinkPayLoad(oResource.getText("S1ESAIDSPROSTYPTXT"), Msg, ESAData);
//						 thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CCopyDLinkSet, com.amat.crm.opportunity
//									.util.ServiceConfigConstants.write, payload, oResource.getText("S2CCDLNKSUSSMSG"));
//						 thisCntrlr.getRefreshEsaData(oModel[0].Guid, oModel[0].ItemGuid, "");
//						 oModel = thisCntrlr.getDataModels();
//						 var EsaModel = disEsaModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3],
//		 							oModel[4], oModel[4].Status, edtFlag, false, false);
//						 thisCntrlr.setViewData(EsaModel);
//						 var oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISESAMINCOMTTAB);
//						 oTable.getModel().setProperty("/NAV_COMMENTS", EsaModel.NAV_COMMENTS);
//						 thisCntrlr.closeDialog();
//				     }
//				 } else {
//					 thisCntrlr.showToastMessage(thisCntrlr.bundle.getText("S2ALLDLINKMANDATCOMM"));
//				 }						
//				break;
//			}
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
		 * This method is used to handles CC check Box selection event.
		 * @name onSelectCB
		 * @param oEvent - Holds the current event
		 * @returns
		 */
		onSelectCB: function(oEvent) {
//			var oResource = thisCntrlr.getResourceBundle(),
//		        SelectedDes = oEvent.getParameters().selected,
//		        Selectedline = oEvent.getSource().getBindingContext().sPath.split(oResource.getText(
//				      "S2CBCPSRCARMSEPRATOR"))[oEvent.getSource().getBindingContext().sPath.split(oResource
//				      .getText("S2CBCPSRCARMSEPRATOR")).length - 1];
//			switch (this.CbnType){
//			case oResource.getText("S1ESAIDSPROSTYPTXT"): 
//				this.UnselectedRecord = {
//					"results": []
//				};
//			    this.SelectedRecord = {
//					"results": []
//				};
//				var oCBCCbnCpyModel = thisCntrlr.getModelFromCore(oResource.getText("GLBESAMCOMMMODEL"));
//				for (var i = 0; i < oCBCCbnCpyModel.getData().oEsaManComm.results.length; i++) {
//					if (i === parseInt(Selectedline)) {
//						if (SelectedDes === true) {
//							this.SelectedRecord.results.push(oCBCCbnCpyModel.getData().oEsaManComm.results[i]);
//						} else {
//							this.UnselectedRecord.results.push(oCBCCbnCpyModel.getData().oEsaManComm.results[i]);
//						}
//					}
//				}
//				break;
//			case oResource.getText("S2ESADLINKTYPTXT"): 
//				var oESADlnkCData = thisCntrlr.getDataModels()[4].NAV_ESA_CC;
//				for (var i = 0; i < oESADlnkCData.results.length; i++) {
//					if (i === parseInt(Selectedline)) {
//						if (SelectedDes === true) {
//							oESADlnkCData.results[i].Selected = true;
//						} else {
//							oESADlnkCData.results[i].Selected = false;
//						}
//					}
//				}
//				break;
//			}
		},
		//**************** End Of PCR036308++; DiGFP Phase 2 Enhancements *****************
	});
});