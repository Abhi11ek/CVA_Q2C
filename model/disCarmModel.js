/**------------------------------------------------------------------------------ *
 * This class return display Display CARM form model.                              *
 * ------------------------------------------------------------------------------ *
 * @class                                                                         *
 * @public                                                                        *
 * @author Abhishek Pant                                                          *
 * @since 25 November 2019                                                        *
 * @extends                                                                       *
 * @name com.amat.crm.opportunity.model.disCarmModel                               *
 *  * ----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 ***********************************************************************************
 */

sap.ui.define(function () {
	"use strict";
	var model = {
		/**
		 * This method use to convert String Date to Object.
		 * @name carmDisMode
		 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller, {sap.ui.model.Model} GeneralInfodata - GenInfoModel,
		 * @param {sap.ui.model.Model} SecurityData- SecurityModel, {sap.ui.model.Model} CarmData-CARM Model, {String} Status- CARM Status,
		 * @param {sap.ui.model.Model} CarmMComData - CARM Main Comment Data, {Boolean} editMode- Mode of view requested
		 * @returns {Object} CarmModel - CARM Model For View Binding
		 */
		carmDisMode: function (thisCntrlr, GeneralInfodata, SecurityData, CarmData, Status, CarmMComData, editMode) {
			var oResource = thisCntrlr.getResourceBundle();
			var initiateFlag = thisCntrlr.validateConTact(GeneralInfodata);
			var carmDocData = [], carmAttFlag = false;
			for (var i = 0; i < CarmData.NAV_CARM_DOCS.results.length; i++) {
				var doc = {
					"Guid": CarmData.NAV_CARM_DOCS.results[i].Guid,
					"DocId": CarmData.NAV_CARM_DOCS.results[i].DocId,
					"itemguid": CarmData.NAV_CARM_DOCS.results[i].ItemGuid,
					"doctype": CarmData.NAV_CARM_DOCS.results[i].DocType,
					"docsubtype": CarmData.NAV_CARM_DOCS.results[i].DocSubtype,
					"DocDesc": CarmData.NAV_CARM_DOCS.results[i].DocDesc,
					"filename": CarmData.NAV_CARM_DOCS.results[i].FileName,
					"OriginalFname": CarmData.NAV_CARM_DOCS.results[i].OriginalFname,
					"note": CarmData.NAV_CARM_DOCS.results[i].Notes,
					"DocSortno": CarmData.NAV_CARM_DOCS.results[i].DocSortno,
					"uBvisible": CarmData.NAV_CARM_DOCS.results[i].FileName === "" ? true : false,
					"editable": true,
					"noteEbl": CarmData.NAV_CARM_DOCS.results[0].FileName === "" && i === 0 ? true : false
				};
				doc.bgVisible = !doc.uBvisible;
				carmAttFlag === false && CarmData.NAV_CARM_DOCS.results[i].FileName !== "" ? carmAttFlag = true : "";
				carmDocData.push(doc);
			}
			var oCarmDocJModel = new sap.ui.model.json.JSONModel({
				"ItemSet": carmDocData
			});
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISCARMATTAB).setModel(oCarmDocJModel);
			var CarmModel = {
					"BarVis": true,
					"StatusText": CarmData.StatDesc === "" ? oResource.getText("S2CARMAWTMPPDTSTATUSTXT") : oResource.getText("S2PSRBARSTATUSHEADER") +
							CarmData.StatDesc,
					"CancelBtnVis": parseInt(Status) === 97 ? true : false,
					"SaveVis": false,
					"CarmDecisionContentVis": true,
					"MPPNDateTxt": oResource.getText("S2CARMAWTMPPTXT"),
					"MPPNDateVis": CarmData.MeetDate !== "" && CarmData.MeetDate !== oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT") ? false : true,
					"DatPicEnabled": initiateFlag,
					"DatPicVal": CarmData.MeetDate !== "" && CarmData.MeetDate !== oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT") ? new Date(CarmData.
							MeetDate.slice(0, 4),CarmData.MeetDate.slice(4, 6) - 1, CarmData.MeetDate.slice(6, 8)) : null,
					"DatPicVluStat": oResource.getText("S2DELNAGVIZTEXT"),
					"NRBtnSelect": false,
					"NRBtnEbl": initiateFlag,
					"NRBtnVluStat": oResource.getText("S2ERRORVALSATETEXT"),
					"NRBtnSelectVis": CarmData.MeetDate !== "" && CarmData.MeetDate !== oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT") ? false : true,
					"DisplayVis": parseInt(Status) !== 97 ? true : false,
					"AttachPnlVis": parseInt(Status) !== 97 ? true : false,
					"AttachPnlExp": carmAttFlag,
					"OtherBtnEbl": true,
					"MainCommExp": parseInt(Status) === 97 || CarmMComData.results.length > 0 ? true : false,
					"MComSavBtnEbl": false,
					"MComTAVal": "",
					"ChngHisExp": CarmData.NAV_CARM_CHNG_HIST.results.length > 0 ? true : false,
					"ChngHisVis": parseInt(Status) !== 97 ? true : false,
					"oCarmChngHis": CarmData.NAV_CARM_CHNG_HIST,
					"NAV_COMMENTS": CarmMComData
			};
			return CarmModel;
		},
		/**
		 * This method used to get Main Comment PayLoad.
		 * @name MainComPayload
		 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller, {String} Comment - Main Comment Value, {String} CommType - Main Comment Type
		 * @returns obj(Object)
		 */
		MainComPayload: function(thisCntrlr, Comment, CommType) {
			var obj = {};
			obj.ItemGuid = thisCntrlr.getOwnerComponent().ItemGuid;
			obj.CommentId = thisCntrlr.getOwnerComponent().ItemGuid;
			obj.CommType = CommType;
			obj.Comment = Comment;
			obj.CreatedName = "";
			obj.CreatedDate = "";
			return obj;
		},
		/**
		 * This method used for Edit press oEvent.
		 * @name EditPress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		EditPress: function(oEvent, thisCntrlr) {
			Date.prototype.yyyymmdd = function() {
				var mm = this.getMonth() + 1;
				var dd = this.getDate();
				return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
			};
			var oResource = thisCntrlr.getResourceBundle(),
			    rowIndex = oEvent.getSource().getParent().getParent().getParent().getId().split("-")[oEvent.getSource().getParent()
				    .getParent().getParent().getId().split("-").length - 1],
				oTable = oEvent.getSource().getParent().getParent().getParent().getParent(),
				row = oEvent.getSource().getParent().getParent().getParent().getCells()[2],
				Guid = thisCntrlr.getOwnerComponent().Guid,
				ItemGuid = thisCntrlr.getOwnerComponent().ItemGuid,
				DocId = oTable.getModel().getData().ItemSet[rowIndex].DocId,
				doctype = oTable.getModel().getData().ItemSet[rowIndex].doctype,
				docsubtype = oTable.getModel().getData().ItemSet[rowIndex].docsubtype,
				dateData = "";
			thisCntrlr.oEvent = oEvent;
			if (oEvent.getSource().getParent().getParent().getParent().getCells().length > 4) {
				dateData = oEvent.getSource().getParent().getParent().getParent().getCells()[3].getDateValue();
				dateData = dateData === null ? "" : dateData.yyyymmdd();
			} else {
				dateData = "";
			}
			if (oEvent.getSource().getIcon().indexOf(oResource.getText("S2PSRSDAEDITBTNTXT").toLowerCase()) >=
				0) {
				oTable.getModel().getData().ItemSet[rowIndex].editable = true;
				oTable.getModel().getData().ItemSet[rowIndex].uBvisible = false;
				oTable.getItems()[rowIndex].getCells()[2].setEnabled(true);
				thisCntrlr.tempHold = "";
				thisCntrlr.tempHold = oTable.getModel().getData().ItemSet[rowIndex].note;
				oEvent.getSource().setIcon(oResource.getText("S2PSRSDASAVEICON"));
				oEvent.getSource().getParent().getItems()[1].setVisible(true);
				oEvent.getSource().getParent().getItems()[1].setIcon(oResource.getText("S2PSRSDAATTCANICON"));
				if (oEvent.getSource().getParent().getItems()[2] !== undefined) {
					oEvent.getSource().getParent().getItems()[2].setVisible(false);
				}
				for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {
					if (i !== parseInt(rowIndex)) {
						oTable.getModel().getData().ItemSet[i].bgVisible = false;
						oTable.getModel().getData().ItemSet[i].uBvisible = false;
						oTable.getItems()[i].getCells()[2].setEnabled(false);
					}
				}
				oTable.getModel().refresh(true);
			} else {
				var customerNo = thisCntrlr.getOwnerComponent().Custno;
				var sEdit = thisCntrlr.oMyOppModel._oDataModel.sServiceUrl + oResource.getText("S4DISRRATCHPTH1") + Guid +
				    oResource.getText("S4DISRRATCHPTH2") + ItemGuid + oResource.getText("S4DISRRATCHPTH3") + doctype +
				    oResource.getText("S4DISRRATCHPTH4") + docsubtype + oResource.getText("S4DISRRATCHPTH5") + DocId +
				    oResource.getText("S4DISRRATCHPTH6");
				var Data = {
					DocDesc: "",
					FileName: "",
					OriginalFname: "",
					Guid: Guid,
					ItemGuid: ItemGuid,
					DocType: doctype,
					DocSubtype: docsubtype,
					DocId: DocId,
					Notes: row.getValue(),
					MimeType: oResource.getText("S4DISDOCMINETYP"),
					OppId: thisCntrlr.OppId,
					ItemNo: thisCntrlr.ItemNo,
					Customer: customerNo,
					Code: "",
					ExpireDate: dateData,
					UploadedBy: "",
					//UploadedDate: oResource.getText("S2OPPAPPPAYLODDATKEY")                                                                                                                 //PCR035760-- Defect#131 TechUpgrade changes
				};
				var that = this;
				/****************To Fetch CSRF Token*******************/
				var f = this.getXcrfHeader(thisCntrlr);
				thisCntrlr.editB = oEvent.getSource();
				thisCntrlr.deleteB = oEvent.getSource().getParent().getItems()[1];
				OData.request(f, function(data, oSuccess) {
					thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
					var oHeaders = {
						"X-CSRF-Token": thisCntrlr.oToken,
					};
					/*******************To Upload File************************/
					OData.request({
						requestUri: sEdit,
						method: 'PUT',
						headers: oHeaders,
						data: Data
					}, function(data, response) {
						oTable.getModel().getData().ItemSet[rowIndex].editable = true;
						oTable.getItems()[rowIndex].getCells()[2].setEnabled(false);
						thisCntrlr.editB.setIcon(thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
						thisCntrlr.deleteB.setIcon(thisCntrlr.getResourceBundle().getText("S2PSRSDADELETEICON"));
						oTable.getModel().refresh(true);
						thisCntrlr.resetAttTab();				
						thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCATTNOTESUCSSMSG"));
					}, function(data) {
						thisCntrlr.showToastMessage(JSON.parse(data.response.body).error.message.value);
						thisCntrlr.resetAttTab();
					});
				}, function(err) {});
				if (oEvent.getSource().getParent().getItems()[2] !== undefined) {
					oEvent.getSource().getParent().getItems()[2].setVisible(true);
				}
				for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {
					if (i !== parseInt(rowIndex)) {
						oTable.getModel().getData().ItemSet[i].bgVisible = true;
					}
				}
			}
		},
		/**
		 * This method Handles Note live Change Event.
		 * @name NoteLiveChange
		 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		NoteLiveChange: function(oEvent, thisCntrlr) {
			var saveBtn = oEvent.getSource().getParent().getCells()[3].getItems()[0].getItems()[0];
			var oResource = thisCntrlr.getResourceBundle();
			var index = oEvent.getSource().getId().split(oResource.getText("S3SEPARATORTEXT"))[oEvent.getSource().getId().split(
					oResource.getText("S3SEPARATORTEXT")).length - 1];
			var docSubType = oEvent.getSource().getParent().getParent().getModel().getData().ItemSet[index].docsubtype;

			if (oEvent.getParameters().value.length >= 255) {
				saveBtn.setEnabled(false);
				oEvent.getSource().getParent().getCells()[3].getItems()[1].getItems()[0].setEnabled(false);
				oEvent.getSource().setValue(oEvent.getParameters().value.substr(0, 254));
				thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCMCOMMVALTXT"));
			} else if (oEvent.getParameters().value.length === 0) {
				if (docSubType === oResource.getText("S3PBCDT") || docSubType === oResource.getText("S3PBDT") ||
						docSubType === oResource.getText("S3BDT")) {
					oEvent.getSource().getParent().getCells()[2].setValueState(sap.ui.core.ValueState.Warning);
					oEvent.getSource().getParent().getCells()[3].getItems()[1].getItems()[0].setEnabled(false);
				}
			} else {
				saveBtn.setEnabled(true);
				oEvent.getSource().getParent().getCells()[2].setValueState(sap.ui.core.ValueState.None);
				oEvent.getSource().getParent().getCells()[3].getItems()[1].getItems()[0].setEnabled(true);
			}
		},
		/**
		 * This method used for Add press oEvent.
		 * @name AddPress
		 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		AddPress: function(oEvent, thisCntrlr) {
			var oResource = thisCntrlr.getResourceBundle();
			var rowIndex = oEvent.getSource().getParent().getParent().getParent().getId().split("-")[oEvent.getSource().getParent()
				.getParent().getParent().getId().split("-").length - 1];
			var oTable = oEvent.getSource().getParent().getParent().getParent().getParent();
			var tObject = {
				"DocDesc": oTable.getModel().getData().ItemSet[rowIndex].DocDesc,
				"Guid": oTable.getModel().getData().ItemSet[rowIndex].Guid,
				"DocId": oTable.getModel().getData().ItemSet[rowIndex].DocId,
				"Enableflag": true,
				"itemguid": oTable.getModel().getData().ItemSet[rowIndex].itemguid,
				"doctype": oTable.getModel().getData().ItemSet[rowIndex].doctype,
				"docsubtype": oTable.getModel().getData().ItemSet[rowIndex].docsubtype,
				"filename": "",
				"OriginalFname": "",
				"note": "",
				"uBvisible": true,
				"bgVisible": false,
				"editable": true,
				"Code": oTable.getModel().getData().ItemSet[rowIndex].Code,
				"noteEbl": false
			};
			oTable.getModel().getData().ItemSet.splice(parseInt(rowIndex) + 1, 0, tObject);
			oTable.getModel().refresh();
			var TableBContext = oEvent.getSource().getParent().getParent().getParent().getBindingContext();
			var ItemData = TableBContext.getModel().getData().ItemSet[TableBContext.getPath().split("/")[TableBContext.getPath().split("/").length -
				1]];
			if ((ItemData.DocDesc === oResource.getText("S2OTHDOCDES") || ItemData.DocDesc === oResource.getText("S2OTHPOSTBOOKDOCDES") ||
					ItemData.DocDesc === oResource.getText("S2AOTHERBTNTEXT")) && (ItemData.docsubtype === oResource.getText("S3BDT") ||
					ItemData.docsubtype === oResource.getText("S3PBCDT") || ItemData.docsubtype === oResource.getText("S3PBDT"))) {
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setEnabled(true);
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setPlaceholder(oResource.getText("S3NOTETEXT"));
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setValueState(sap.ui.core.ValueState.Warning);
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setValueStateText(oResource.getText("S3NOTEVALUETEXT"));
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[3].getItems()[1].getItems()[0].setEnabled(false);
				oTable.getItems()[parseInt(rowIndex)].getCells()[3].getItems()[0].getItems()[2].setEnabled(false);
			} else {
				var lastItem = oTable.getModel().getData().ItemSet[oTable.getModel().getData().ItemSet.length - 1];
				var CurrentLineData = "",
					totalOthRecods, temp = "";
				for (var i = 0; i <= oTable.getModel().getData().ItemSet.length - 1; i++) {
					CurrentLineData = oTable.getModel().getData().ItemSet[i];
					if (CurrentLineData.docsubtype === oResource.getText("S3BDT") || CurrentLineData.docsubtype === oResource.getText("S3PBCDT") ||
						CurrentLineData.docsubtype === oResource.getText("S3PBDT")) {
						(temp === "") ? (temp = i) : ("");
						if (i < oTable.getModel().getData().ItemSet.length - 1) {
							if (CurrentLineData.filename === "") {
								for (var k = i; k < oTable.getModel().getData().ItemSet.length - 1; k++) {
									oTable.getModel().getData().ItemSet[k] = oTable.getModel().getData().ItemSet[k + 1];
								}
								oTable.getModel().getData().ItemSet.length = oTable.getModel().getData().ItemSet.length - 1;
							}
						} else {
							if (CurrentLineData.filename === "") {
								oTable.getModel().getData().ItemSet.length = oTable.getModel().getData().ItemSet.length - 1;
								oTable.getItems()[oTable.getModel().getData().ItemSet.length].getCells()[3].getItems()[0].getItems()[2].setEnabled(true);
							}
						}
					}
				}
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[3].getItems()[1].getItems()[0].setEnabled(true);
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setEnabled(true);
			}
		},
		/**
		 * This method used to get XCRF Requesting Header.
		 * @name getXcrfHeader
		 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns {Object} xcrfHeader - XCRF Requesting Header
		 */
		getXcrfHeader: function(thisCntrlr){
			var oResource = thisCntrlr.getResourceBundle();
			var xcrfHeader= {
				headers: {
					"X-Requested-With": "XMLHttpRequest",
					"Content-Type": "application/atom+xml",
					DataServiceVersion: "2.0",
					"X-CSRF-Token": "Fetch"
				},				
				requestUri: thisCntrlr.oMyOppModel._oDataModel.sServiceUrl + com.amat.crm.opportunity.util.ServiceConfigConstants.AttachmentSet,
				method: com.amat.crm.opportunity.util.ServiceConfigConstants.get
			};
			return xcrfHeader;
		},
		/**
		 * This method used for Delete press oEvent.
		 * @name DeletePress
		 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		DeletePress: function(oEvent, thisCntrlr) {
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var rowIndex = thisCntrlr.source.getParent().getParent().getParent().getId().split("-")[thisCntrlr.source
				    .getParent().getParent().getParent().getId().split("-").length - 1],
			    oTable = thisCntrlr.source.getParent().getParent().getParent().getParent(),
			    oResource = thisCntrlr.getResourceBundle(),
			    tableModel = oTable.getModel().getData().ItemSet,
			    sServiceUrl = thisCntrlr.oMyOppModel._oDataModel.sServiceUrl;
			thisCntrlr.tableModel = tableModel;
			var flag = 0;
			$.each(tableModel, function(key, value) {
				if (value.docsubtype === tableModel[rowIndex].docsubtype) flag++;
			});
			if (thisCntrlr.source.getIcon().indexOf(oResource.getText("S2ATTCHDOCDELVALDDELTXT").toLowerCase()) >= 0) {
				if (flag === 1) {
					if (oTable.getModel().getData().ItemSet[rowIndex].doctype !== oResource.getText("S2ICONTABCARMKEY") &&
						oTable.getModel().getData()
						.ItemSet[rowIndex].docsubtype !== oResource.getText("S2ATTOTHTYPETEXT")) {
						var tObject = {
							"Guid": oTable.getModel().getData().ItemSet[rowIndex].Guid,
							"DocId": oTable.getModel().getData().ItemSet[rowIndex].DocId,
							"itemguid": oTable.getModel().getData().ItemSet[rowIndex].itemguid,
							"doctype": oTable.getModel().getData().ItemSet[rowIndex].doctype,
							"docsubtype": oTable.getModel().getData().ItemSet[rowIndex].docsubtype,
							"DocDesc": oTable.getModel().getData().ItemSet[rowIndex].DocDesc,
							"filename": "",
							"OriginalFname": "",
							"note": "",
							"uBvisible": true,
							"bgVisible": false,
							"editable": true,
							"noteEbl": CarmData.NAV_CARM_DOCS.results[0].filename === "" && i === 0 ? true : false
						};
						oTable.getModel().getData().ItemSet.splice(parseInt(rowIndex), 1);
						oTable.getModel().getData().ItemSet.splice(parseInt(rowIndex), 0, tObject);
						oTable.getModel().refresh(true);
					}
					var f = this.getXcrfHeader(thisCntrlr);
					/****************To Fetch CSRF Token*******************/
					OData.request(f, function(data, oSuccess) {
						thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
						var oHeaders = {
							"X-CSRF-Token": thisCntrlr.oToken,
						};
						/*******************To Delete File*********************** */
						var sDelete = sServiceUrl + oResource.getText("S4DISRRATCHPTH1") + tableModel[rowIndex].Guid +
							oResource.getText("S4DISRRATCHPTH2") + tableModel[rowIndex].itemguid + oResource.getText("S4DISRRATCHPTH3") +
							tableModel[rowIndex].doctype + oResource.getText("S4DISRRATCHPTH4") + tableModel[rowIndex].docsubtype +
							oResource.getText("S4DISRRATCHPTH5") + tableModel[rowIndex].DocId + oResource.getText("S4DISRRATCHPTH6");
						jQuery.ajax({
							type: 'DELETE',
							url: sDelete,
							headers: oHeaders,
							cache: false,
							processData: false,
							success: function(data) {
								thisCntrlr.showToastMessage(oResource.getText("S2ATTCHDOCDELSUCSSMSG"));
								thisCntrlr.resetAttTab();
							},
							error: function(data) {
								thisCntrlr.showToastMessage($(data.responseText).find(oResource.getText("S2CBCPSRCARMTYPEMESG"))[0].innerText);
								thisCntrlr.resetAttTab();								
							}
						});
					}, function(err) {});
				} else {
					var f = this.getXcrfHeader(thisCntrlr);
					/** **************To Fetch CSRF Token*******************/
					OData.request(f, function(data, oSuccess) {
						thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
						var oHeaders = {
							"X-CSRF-Token": thisCntrlr.oToken,
						};
						/*******************To Delete File************************/
						var sDelete = sServiceUrl + oResource.getText("S4DISRRATCHPTH1") + tableModel[rowIndex].Guid +
							oResource.getText("S4DISRRATCHPTH2") + tableModel[rowIndex].itemguid + oResource.getText("S4DISRRATCHPTH3") +
							tableModel[rowIndex].doctype + oResource.getText("S4DISRRATCHPTH4") + tableModel[rowIndex].docsubtype +
							oResource.getText("S4DISRRATCHPTH5") + tableModel[rowIndex].DocId + oResource.getText("S4DISRRATCHPTH6");
						jQuery.ajax({
							type: 'DELETE',
							url: sDelete,
							headers: oHeaders,
							cache: false,
							processData: false,
							success: function(data) {
								thisCntrlr.showToastMessage(oResource.getText("S2ATTCHDOCDELSUCSSMSG"));
								thisCntrlr.resetAttTab();
							},
							error: function(data) {
								thisCntrlr.showToastMessage($(data.responseText).find(oResource.getText("S2CBCPSRCARMTYPEMESG"))[0].innerText);
								thisCntrlr.resetAttTab();
							}
						});
					}, function(err) {});
					oTable.getModel().refresh(true);
				}
			} else {
				oTable.getModel().getData().ItemSet[rowIndex].editable = true;
				oTable.getItems()[rowIndex].getCells()[2].setEnabled(false);
				oTable.getModel().getData().ItemSet[rowIndex].note = thisCntrlr.tempHold;
				thisCntrlr.source.setIcon(oResource.getText("S2PSRSDADELETEICON"));
				thisCntrlr.source.getParent().getItems()[0].setIcon(oResource.getText("S2PSRSDAEDITICON"));
				if (thisCntrlr.source.getParent().getItems()[2] !== undefined) {
					thisCntrlr.source.getParent().getItems()[2].setVisible(true);
				}
				thisCntrlr.resetAttTab();				
			}
			myBusyDialog.close();
		},
	};
	return model;
}, true);