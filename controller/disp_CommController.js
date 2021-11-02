/** ------------------------------------------------------------------------------*
 * This class holds all methods of Display Common Controller.                     *
 * -------------------------------------------------------------------------------*
 * @class                                                                         *
 * @public                                                                        *
 * @author Abhishek Pant                                                          *
 * @since 25 November 2019                                                        *
 * @extends com.amat.crm.opportunity.controller.BaseController                    *
 * @name com.amat.crm.opportunity.controller.disp_CommController                  *
 *  * ----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 **********************************************************************************/
 sap.ui.define(["com/amat/crm/opportunity/controller/BaseController"], function(Controller) {
	"use strict";
	var that_views4,
	that_disgeneral,
	that_disEsa,
	that_dispsrsda,
	that_discbc;
	return Controller.extend("com.amat.crm.opportunity.controller.disp_CommController", {
		/**
		 * This method used Initialize Global controller variables.
		 * @name _initiateControllerObjects
		 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		_initiateControllerObjects: function(thisCntrlr) {
			this.disModel = new sap.ui.model.odata.ODataModel(thisCntrlr.getResourceBundle().getText("S4DISSERVEURL"),true);
			var oComp = thisCntrlr.getOwnerComponent();
			if (that_views4 === undefined) {
				that_views4 = oComp.s4;
			}
			if (that_disgeneral === undefined) {
				that_disgeneral = oComp.dis_general;
			}
			if (that_dispsrsda === undefined) {
				that_dispsrsda = oComp.dis_psrra;
			}
			if (that_disEsa === undefined) {
				that_disEsa = oComp.dis_esa;
			}
			if (that_discbc === undefined) {
				that_discbc = oComp.dis_cbc;
			}
		},
		/**
		 * This method used for Add Contact button press event.
		 * @name commonPressAddContact
		 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller, {String} ProsType - Process Type
		 * @returns
		 */
		commonPressAddContact: function(evt, thisCntrlr, ProsType) {
			this._initiateControllerObjects(thisCntrlr);
			var oResource = thisCntrlr.getResourceBundle();
			if (sap.ui.getCore().getModel(oResource.getText("GLBSECURITYMODEL")).getData().AddContact !==
				oResource.getText("S1TABLESALESTAGECOL")) {
				thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCAUTHCHECKFAILMSG"));
			} else {
				switch(ProsType){
				case oResource.getText("S2GENINFOMCOMMDATATYP"):
					 switch (evt.getSource().getParent().getContent()[0].getText()) {
					   case oResource.getText("S4DISCONOMTXT"):
							thisCntrlr.contactType = oResource.getText("S4DISGENOMCONTYP");
							break;
					   case oResource.getText("S2GINFOPANLCONINFOSALTIT"):
					   case oResource.getText("S2PSRSDASALESPERSON"):
							thisCntrlr.contactType = oResource.getText("S4DISGENSLSCONTYP");
							break;
					   case oResource.getText("S2PSRWFAPPPANLGPMINFOCONTIT"):
							thisCntrlr.contactType = oResource.getText("S4DISGENGPMCONTYP");
							break;
					   case oResource.getText("S4DISCONSMETXT"):
							thisCntrlr.contactType = oResource.getText("S4DISGENSMECONTYP");
							break;
					   case oResource.getText("S4DISCONIWTXT"):
							thisCntrlr.contactType = oResource.getText("S4DISGENIWCONTYP");
							break;
					   case oResource.getText("S2GINFOPANLCONINFOCONTIT"):
					   case oResource.getText("S4DISBUCONBMTXT"):
							thisCntrlr.contactType = oResource.getText("S4DISGENCONCONTYP");
							break;
				    }
					break;
				case oResource.getText("S2CBCTABTXT"):
					switch (evt.getSource().getParent().getContent()[0].getText()) {
					   case oResource.getText("S4DISCONOMTXT"):
							thisCntrlr.contactType = oResource.getText("S4DISCBCOMCONTYP");
							break;
					   case oResource.getText("S2GINFOPANLCONINFOSALTIT"):
							thisCntrlr.contactType = oResource.getText("S4DISCBCSLSKEY");
							break;
					   case oResource.getText("S2PSRWFAPPPANLGPMINFOCONTIT"):
							thisCntrlr.contactType = oResource.getText("S4DISCBCGPMCONTYP");
							break;
					}
					break;
				case oResource.getText("S1ESAIDSPROSTYPTXT"):
					switch (evt.getSource().getParent().getContent()[0].getText()) {
					case oResource.getText("S4DISCONOMTXT"):
							thisCntrlr.contactType = oResource.getText("S4DISESAOMCONTYP");
							break;
					case oResource.getText("S4DISESALGLCONCTTXT"):
							thisCntrlr.contactType = oResource.getText("S4DISESALGLCONTYP");
							break;
					case oResource.getText("S2PSRWFAPPPANLGPMINFOCONTIT"):
							thisCntrlr.contactType = oResource.getText("S4DISESAGPMCONTYP");
							break;
					case oResource.getText("S2BMKEY"):
							thisCntrlr.contactType = oResource.getText("S4DISESABMCONTYP");
							break;
					case oResource.getText("S2GINFOPANLCONINFOCONTIT"):
						    thisCntrlr.contactType = oResource.getText("S4DISESACONCONTYP");
						    break;
					case oResource.getText("S2ESAIDSACCGMTITTXT"):
						    thisCntrlr.contactType = oResource.getText("S4DISESAAGMCONTYP");
						    break;
					case oResource.getText("S2PSRSDASALESPERSON"):
						    thisCntrlr.contactType = oResource.getText("S4DISESASLSCONTYP");
						    break;
					case oResource.getText("S2ESAIDSCONINFOSCFOTIT"):
						    thisCntrlr.contactType = oResource.getText("S4DISESASCFOCONTYP");
						    break;
					case oResource.getText("S2ESAIDSCONINFOGCCTIT"):
						    thisCntrlr.contactType = oResource.getText("S4DISESAGCCONTYP");
						    break;
					case oResource.getText("S2ESAIDSCONINFORSKMGTTIT"):
					        thisCntrlr.contactType = oResource.getText("S4DISESARMCONTYP");
					        break;
					case oResource.getText("S2ESAIDSCONINFOORCATIT"):
					        thisCntrlr.contactType = oResource.getText("S4DISESAORCACONTYP");
					        break;
					case oResource.getText("S2ESAIDSCONINFOBUGMTIT"):
						    thisCntrlr.contactType = oResource.getText("S4DISESABUGMCONTYP");
				            break;
				    }
					break;
				}
				thisCntrlr.contactF4Fragment = sap.ui.xmlfragment(oResource.getText("PSRSDACBCADDCONTCTDIALOG"), thisCntrlr);
				thisCntrlr.getView().addDependent(thisCntrlr.contactF4Fragment);
				thisCntrlr.contactF4Fragment.setModel(new sap.ui.model.json.JSONModel(), oResource.getText("S2PSRCBCATTDFTJSONMDLTXT"));
				thisCntrlr.contactF4Fragment.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({"ItemSet": []});
				thisCntrlr.contactF4Fragment.open();
			}
		},
		/**
		 * This method is used to remove duplicate objects.
		 * @name removeDuplicate
		 * @param {Object Array} filtered - Array of objects
		 * @returns {Object} filtered (Object)
		 */
		removeDuplicate: function(filtered){
			filtered = function (array) {
                var o = {};
                return array.filter(function (a) {
                      var k = a.Guid && a.ItemGuid;
                      if (!o[k]) {
                         o[k] = true;
                      return true;
                    }
               });
           }(filtered);
           return filtered;
		},
		/**
		 * This method used for OK button press on contact fragment.
		 * @name commonContactOkPressed
		 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		commonContactOkPressed: function(evt, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var oResource = thisCntrlr.getResourceBundle(),
			    GenInfoData = sap.ui.getCore().getModel(oResource.getText("GLBOPPGENINFOMODEL")).getData(),
			    validContact = false, addedUser;
			if(evt.getSource().getParent().getContent()[0].getItems() === undefined){
				thisCntrlr.showToastMessage(oResource.getText("S4DISCONCTFAILSERCHMSG"));
			} else {
				for (var i = 0; i < evt.getSource().getParent().getContent()[0].getItems().length; i++) {
					if (evt.getSource().getParent().getContent()[0].getItems()[i].getCells()[0].getSelected() ===
						true) {
						addedUser = evt.getSource().getParent().getContent()[0].getItems()[i].getCells()[3].getText();
						validContact = true;
					}
				}
				if (validContact === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2GENCONTCTSLECFAILMSG"));
				} else {
					sap.ui.core.BusyIndicator.show();
					var contactSet = [];
					for (var i = 0; i < evt.getSource().getParent().getContent()[0].getItems().length; i++) {
						if (evt.getSource().getParent().getContent()[0].getItems()[i].getCells()[0].getSelected() === true) {
							var oEntry = {
								Guid: GenInfoData.Guid,
								ItemGuid: GenInfoData.ItemGuid,
								ContactType: thisCntrlr.contactType,
								ContactVal: evt.getSource().getParent().getContent()[0].getItems()[i].getCells()[3].getText(),
								OppId: thisCntrlr.that_views4.getController().OppId,
								ItemNo: thisCntrlr.that_views4.getController().ItemNo.toString(),
								DelFlag: ""
							};
							contactSet.push(this.disModel.createBatchOperation(oResource.getText("S2CBCPSRCARMCONTACTCREATENTYSET"),
									com.amat.crm.opportunity.util.ServiceConfigConstants.post, oEntry, null));
						}
					}
					this.disModel.addBatchChangeOperations(contactSet);
					this.disModel.submitBatch(jQuery.proxy(function(oResponses) {
						thisCntrlr.contactSucess(oResource.getText("S2CONTCTSCCESSMSGTXT"));
						sap.ui.core.BusyIndicator.hide();
					}, this), jQuery.proxy(function(oError) {
						sap.ui.core.BusyIndicator.hide();
					}, this));
				}
			}
		},
		/**
		 * This method used to get XCRF Requesting Header.
		 * @name getXcrfHeader
		 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns {Object} xcrfHeader - XCRF Requesting Header
		 */
		getXcrfHeader: function(thisCntrlr){
			var xcrfHeader= {
				headers: {
					"X-Requested-With": "XMLHttpRequest",
					"Content-Type": "application/atom+xml",
					DataServiceVersion: "2.0",
					"X-CSRF-Token": "Fetch"
				},
				requestUri: thisCntrlr.disModel.sServiceUrl + com.amat.crm.opportunity.util.ServiceConfigConstants.AttachmentSet,
				method: com.amat.crm.opportunity.util.ServiceConfigConstants.get
			};
			return xcrfHeader;
		},
		/**
		 * This method used for delete button press event.
		 * @name commonDelete
		 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		commonDelete: function(evt, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var oResource = thisCntrlr.getResourceBundle(),
			    delRecord = evt.getParameters().listItem.getBindingContext().getObject();
			thisCntrlr.contactType = delRecord.ContactType;
			var GenInfoData = sap.ui.getCore().getModel(oResource.getText("GLBOPPGENINFOMODEL")).getData();
			if (sap.ui.getCore().getModel(oResource.getText("GLBSECURITYMODEL")).getData().DelContact !== oResource.getText("S1TABLESALESTAGECOL")) {
				thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCAUTHCHECKFAILMSG"));
			} else {
				sap.ui.core.BusyIndicator.show();
				var Guid = GenInfoData.Guid;
				var ItemGuid = GenInfoData.ItemGuid;
				var sDelete = thisCntrlr.disModel.sServiceUrl + oResource.getText("S4DISCRTCONPTH") + Guid + oResource.getText("S4DISRRATCHPTH2") +
				   ItemGuid + oResource.getText("S4DISCRTCONPTH1") + delRecord.ContactType + oResource.getText("S4DISCRTCONPTH2") + delRecord.ContactVal +
				   oResource.getText("S4DISCRTCONPTH3");
				var Header = this.getXcrfHeader(thisCntrlr);
				OData.request(Header, function(data, oSuccess) {
					thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
					var oHeaders = {
						"X-CSRF-Token": thisCntrlr.oToken,
					};
					/*******************To Delete File************************/
					jQuery.ajax({
						type: 'DELETE',
						url: sDelete,
						headers: oHeaders,
						cache: false,
						processData: false,
						success: function(data) {
							thisCntrlr.contactSucess(oResource.getText("S2PSRSDACBCCONCTDELSUCSSMSG"));
							sap.ui.core.BusyIndicator.hide();
						},
						error: function(data) {
							sap.ui.core.BusyIndicator.hide();
							thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCCONCTDELFAILMSG"));
						}
					});
				}, function(err) {});
			}
		},
		/**
		 * This method used for Add Contact button press event.
		 * @name commonContactSuccess
		 * @param {String} Msg - Message, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		commonContactSuccess: function(Msg, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var oResource = thisCntrlr.getResourceBundle(), data,
			    OppGenInfoModel = sap.ui.getCore().getModel(oResource.getText("GLBOPPGENINFOMODEL")),
			    Guid = OppGenInfoModel.getData().Guid,
			    ItemGuid = OppGenInfoModel.getData().ItemGuid;
			var sValidate = oResource.getText("S4DISCONINFOPTH") + OppGenInfoModel.getData().Guid + oResource.getText("S4DISCONINFOPTH1") +
			    OppGenInfoModel.getData().ItemGuid + oResource.getText("S4DISCONINFOPTH2") + thisCntrlr.contactType + oResource.getText("S4DISCONINFOPTH3") +
				OppGenInfoModel.getData().ProductLine.replace('&', '-') + "'";
			this.disModel.read(sValidate, null, null, true, function(oData, oResponse) {
				data = oData;				
				var obj = {};
			    obj.DelContact = oResource.getText("S2DELPOSVIZTEXT");
				switch (thisCntrlr.contactType) {
					case oResource.getText("S4DISGENOMCONTYP"): case oResource.getText("S4DISGENSLSCONTYP"): case oResource.getText("S4DISGENGPMCONTYP"):
					case oResource.getText("S4DISGENSMECONTYP"): case oResource.getText("S4DISGENIWCONTYP"): case oResource.getText("S4DISGENCONCONTYP"):
						{
						that_views4.getController().SetGenInfoModel(oResource);
						if (that_views4.getModel().getProperty("/S4IcntabselKey") === oResource.getText("S2ICONTABPSRSDAKEY")) {
					    	thisCntrlr.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
					    	var oModel = thisCntrlr.getDataModels();					    	
					    	var editMode = thisCntrlr.checkUsersfromlist(oModel), RfFlag = false;
					    	if(!editMode){
					    		var omAuth = that_dispsrsda.getController().checkContact(oModel[0].NAV_OM_INFO.results);
								var gpmAuth = that_dispsrsda.getController().checkContact(oModel[0].NAV_GPM_INFO.results);
								RfFlag === omAuth || gpmAuth;
					    	}
							thisCntrlr.refereshRraData(editMode, false, RfFlag);
							thisCntrlr.getView().getModel().setProperty("/RraWFConPnlExpd", true);
					    }
						break;
					 }
					case oResource.getText("S4DISCBCOMCONTYP"): case oResource.getText("S4DISCBCSLSKEY"): case oResource.getText("S4DISCBCGPMCONTYP"):
					{
				    thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid, "");
				    var editAuth = thisCntrlr.checkCBCUsersfromlist();
				    if(editAuth === true){
				    	thisCntrlr.refereshData(true, false, false);
				    } else {
				    	thisCntrlr.refereshData(false, false, false);
				    }
						break;
					}
					case oResource.getText("S4DISESAAGMCONTYP"): case oResource.getText("S4DISESABMCONTYP"): case oResource.getText("S4DISESAGPMCONTYP"):
					case oResource.getText("S4DISESABUGMCONTYP"): case oResource.getText("S4DISESACONCONTYP"): case oResource.getText("S4DISESAGCCONTYP"):
					case oResource.getText("S4DISESAORCACONTYP"): case oResource.getText("S4DISESALGLCONTYP"): case oResource.getText("S4DISESARMCONTYP"):
					case oResource.getText("S4DISESAOMCONTYP"): case oResource.getText("S4DISESASCFOCONTYP"): case oResource.getText("S4DISESASLSCONTYP"):
						{
						      var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
					          thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, parseInt(EsaData.VersionNo));
					          var oModel = thisCntrlr.getDataModels(), RPflag = false;
					          var esaDisModel = com.amat.crm.opportunity.model.disEsaModel;
					          var UserAuth = thisCntrlr.checkUsersfromlist();
					          var OmInitiateFlag = thisCntrlr.checkContact(oModel[4].NAV_OM.results);
							  var SlsInitiateFlag = thisCntrlr.checkContact(oModel[4].NAV_SLS.results);
					  		  RPflag = OmInitiateFlag || SlsInitiateFlag;
					          var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"),
					        		  oModel[2], oModel[3], oModel[4], oModel[4].Status, UserAuth, false, RPflag);
					          thisCntrlr.setViewData(EsaModel);
					          thisCntrlr.showToastMessage(Msg);
						}
				}
				thisCntrlr.showToastMessage(Msg);
				if (thisCntrlr.contactF4Fragment !== undefined) {
					thisCntrlr.contactF4Fragment.close();
					thisCntrlr.contactF4Fragment.destroy(true);
				}
			}, function(value) {});
		},
		/**
		 * This method Handles Note live Change Event.
		 * @name commonNoteLiveChange
		 * @param {sap.ui.base.Event} oEvt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		commonNoteLiveChange: function(oEvt, thisCntrlr) {
			var oResource = thisCntrlr.getResourceBundle(), saveBtn;
			if (oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_TABLE) >= 0 ||
				     oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S4DISCBCMEADOCTAB) >= 0) {
				saveBtn = oEvt.getSource().getParent().getCells()[4].getItems()[0].getItems()[0];
			} else {
				saveBtn = oEvt.getSource().getParent().getCells()[3].getItems()[0].getItems()[0];
			}
			var index = oEvt.getParameters().id.split(oResource.getText("S3SEPARATORTEXT"))[oEvt.getParameters().id.split(
					oResource.getText("S3SEPARATORTEXT")).length - 1];
			var docSubType = oEvt.getSource().getParent().getParent().getModel().getData().ItemSet[index].docsubtype;
            oEvt.getSource().setValue(oEvt.getSource().getValue());
			if (oEvt.getParameters().value.length >= 255) {
				saveBtn.setEnabled(false);
				oEvt.getSource().setValue(oEvt.getParameters().value.substr(0, 254));
				thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCMCOMMVALTXT"));
			} else if (oEvt.getParameters().value.length === 0) {
				if (docSubType === oResource.getText("S3PBCDT") || docSubType === oResource.getText("S3PBDT") || docSubType === oResource.getText("S3BDT")) {
					oEvt.getSource().getParent().getCells()[2].setValueState(sap.ui.core.ValueState.Warning);
					oEvt.getSource().getParent().getCells()[3].getItems()[1].getItems()[0].setEnabled(false);
				}
			} else {
				saveBtn.setEnabled(true);
				oEvt.getSource().getParent().getCells()[2].setValueState(sap.ui.core.ValueState.None);
				if (oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_TABLE) >= 0||
					     oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S4DISCBCMEADOCTAB) >= 0) {
					oEvt.getSource().getParent().getCells()[4].getItems()[0].getItems()[0].setEnabled(true);
				} else {
					oEvt.getSource().getParent().getCells()[3].getItems()[1].getItems()[0].setEnabled(true);
				}
			}
		},
		/**
		 * This method used for Delete press event.
		 * @name commonDeletePress
		 * @param {sap.ui.base.Event} oEvent - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		commonDeletePress: function(event, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oResource = thisCntrlr.getResourceBundle(),
			    rowIndex = thisCntrlr.source.getParent().getParent().getParent().getId().split("-")[thisCntrlr.source
				   .getParent().getParent().getParent().getId().split("-").length - 1],
				oTable = thisCntrlr.source.getParent().getParent().getParent().getParent(),
				tableModel = oTable.getModel().getData().ItemSet,
				sServiceUrl = thisCntrlr.disModel.sServiceUrl;
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
							"Guid": "",
							"DocId": "",
							"itemguid": "",
							"doctype": "",
							"docsubtype": "",
							"DocDesc": "",
							"filename": "",
							"OriginalFname": "",
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
					}
					var Header = this.getXcrfHeader(thisCntrlr);
					/****************To Fetch CSRF Token*******************/
					OData.request(Header, function(data, oSuccess) {
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
								switch(that_views4.getModel().getProperty("/S4IcntabselKey")){
								case oResource.getText("S2CBCTABTXT"):
									thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid, "");
								    thisCntrlr.refereshData(true, false, false);
								    break;
								case oResource.getText("S1ESAIDSPROSTYPTXT"):
									var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
							        thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, parseInt(EsaData.VersionNo));
							        var oModel = thisCntrlr.getDataModels();
							        var esaDisModel = com.amat.crm.opportunity.model.esaDisModel;
							        var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2],
							        		oModel[3], oModel[4], oModel[4].Status, true, false, false);
							        thisCntrlr.setViewData(EsaModel);
							        break;
								}
							},
							error: function(data) {
								thisCntrlr.showToastMessage($(data.responseText).find(oResource.getText("S2CBCPSRCARMTYPEMESG"))[0].innerText);
							}
						});
					}, function(err) {});
				} else {
					var Header = this.getXcrfHeader(thisCntrlr);
					/****************To Fetch CSRF Token*******************/
					OData.request(Header, function(data, oSuccess) {
						thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
						var oHeaders = {
							"X-CSRF-Token": thisCntrlr.oToken,
						};
						/*******************To Delete File************************/
						var sDelete = sServiceUrl + oResource.getText("S4DISRRATCHPTH1") + tableModel[rowIndex].Guid + oResource.getText("S4DISRRATCHPTH2") +
						    tableModel[rowIndex].itemguid + oResource.getText("S4DISRRATCHPTH3") + tableModel[rowIndex].doctype + oResource.getText("S4DISRRATCHPTH4") +
						    tableModel[rowIndex].docsubtype + oResource.getText("S4DISRRATCHPTH5") + tableModel[rowIndex].DocId + oResource.getText("S4DISRRATCHPTH6");
						jQuery.ajax({
							type: 'DELETE',
							url: sDelete,
							headers: oHeaders,
							cache: false,
							processData: false,
							success: function(data) {
								thisCntrlr.showToastMessage(oResource.getText("S2ATTCHDOCDELSUCSSMSG"));
								switch(that_views4.getModel().getProperty("/S4IcntabselKey")){
								case oResource.getText("S2CBCTABTXT"):
									thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid, "");
								    thisCntrlr.refereshData(true, false, false);
								    break;
								case oResource.getText("S1ESAIDSPROSTYPTXT"):
									var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
							        thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, parseInt(EsaData.VersionNo));
							        var oModel = thisCntrlr.getDataModels();
							        var esaDisModel = com.amat.crm.opportunity.model.disEsaModel;
							        var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2],
							        		oModel[3], oModel[4], oModel[4].Status, true, false, false);
							        thisCntrlr.setViewData(EsaModel);
							        break;
								}
							},
							error: function(data) {
								thisCntrlr.showToastMessage($(data.responseText).find(oResource.getText("S2CBCPSRCARMTYPEMESG"))[0].innerText);
								switch(that_views4.getModel().getProperty("/S4IcntabselKey")){
								case oResource.getText("S2CBCTABTXT"):
									thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid, "");
								    thisCntrlr.refereshData(true, false, false);
								    break;
								case oResource.getText("S1ESAIDSPROSTYPTXT"):
									var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
							        thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, parseInt(EsaData.VersionNo));
							        var oModel = thisCntrlr.getDataModels();
							        var esaDisModel = com.amat.crm.opportunity.model.disEsaModel;
							        var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2],
							        		oModel[3], oModel[4], oModel[4].Status, true, false, false);
							        thisCntrlr.setViewData(EsaModel);
							        break;
								}
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
				event.getSource().getParent().getItems()[0].setIcon(oResource.getText("S2PSRSDAEDITICON"));
				if (event.getSource().getParent().getItems()[2] !== undefined) {
					event.getSource().getParent().getItems()[2].setVisible(true);
				}
				for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {
					if (i !== parseInt(rowIndex)) {
						oTable.getModel().getData().ItemSet[i].bgVisible = true;
						if(that_views4.byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).getSelectedKey() === oResource.getText("S1ESAIDSPROSTYPTXT")){
							oTable.getModel().getData().ItemSet[i].uBvisible = false;
						}else {
							oTable.getModel().getData().ItemSet[i].uBvisible = true;
						}
					}
				}
				oTable.getModel().refresh(true);
			}
			myBusyDialog.close();
		},
		/**
		 * This method used for Add press event.
		 * @name commonAddPress
		 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		commonAddPress: function(evt, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var oResource = thisCntrlr.getResourceBundle(),
			    rowIndex = evt.getSource().getParent().getParent().getParent().getId().split("-")[evt.getSource().getParent()
				    .getParent().getParent().getId().split("-").length - 1],
				oTable = evt.getSource().getParent().getParent().getParent().getParent();
			var tObject = {
				"DocDesc": "",
				"Guid": "",
				"DocId": "",
				"Enableflag": true,
				"itemguid": "",
				"doctype": "",
				"docsubtype": "",
				"filename": "",
				"OriginalFname": "",
				"note": "",
				"uBvisible": true,
				"bgVisible": false,
				"editable": true,
				"Code": ""
			};
			tObject.Code = oTable.getModel().getData().ItemSet[rowIndex].Code;
			tObject.Guid = oTable.getModel().getData().ItemSet[rowIndex].Guid;
			tObject.DocId = oTable.getModel().getData().ItemSet[rowIndex].DocId;
			tObject.doctype = oTable.getModel().getData().ItemSet[rowIndex].doctype;
			tObject.docsubtype = oTable.getModel().getData().ItemSet[rowIndex].docsubtype;
			tObject.DocDesc = oTable.getModel().getData().ItemSet[rowIndex].DocDesc;
			tObject.itemguid = oTable.getModel().getData().ItemSet[rowIndex].itemguid;
			oTable.getModel().getData().ItemSet.splice(parseInt(rowIndex) + 1, 0, tObject);
			oTable.getModel().refresh();
			var TableBContext = evt.getSource().getParent().getParent().getParent().getBindingContext();
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
				if (temp !== oTable.getModel().getData().ItemSet.length - 1) {
					oTable.getItems()[oTable.getItems().length - (oTable.getItems().length - temp)].getCells()[2].setEnabled(true);
					oTable.getItems()[oTable.getItems().length - (oTable.getItems().length - temp)].getCells()[2].setValueState(sap.ui.core.ValueState
						.None);
					oTable.getItems()[oTable.getItems().length - (oTable.getItems().length - temp)].getCells()[2].setPlaceholder(oResource.getText("S2ANOTEPLACEHOLDER"));
				} else {
					oTable.getItems()[oTable.getItems().length - 2].getCells()[2].setEnabled(true);
					oTable.getItems()[oTable.getItems().length - 2].getCells()[2].setValueState(sap.ui.core.ValueState.None);
					oTable.getItems()[oTable.getItems().length - 2].getCells()[2].setPlaceholder(oResource.getText("S2ANOTEPLACEHOLDER"));
				}

				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[3].getItems()[1].getItems()[0].setEnabled(true);
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setEnabled(true);
			}
		},
		/**
		 * This method used for Edit press event.
		 * @name commonEditPress
		 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		commonEditPress: function(evt, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			Date.prototype.yyyymmdd = function() {
				var mm = this.getMonth() + 1;
				var dd = this.getDate();
				return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
			};
			var oResource = thisCntrlr.getResourceBundle(),
			    rowIndex = evt.getSource().getParent().getParent().getParent().getId().split("-")[evt.getSource().getParent()
				    .getParent().getParent().getId().split("-").length - 1],
				oTable = evt.getSource().getParent().getParent().getParent().getParent(),
				row = evt.getSource().getParent().getParent().getParent().getCells()[2],
				GenInfoData = sap.ui.getCore().getModel(oResource.getText("GLBOPPGENINFOMODEL")),
				Guid = GenInfoData.getData().Guid,
				ItemGuid = GenInfoData.getData().ItemGuid,
				DocId = oTable.getModel().getData().ItemSet[rowIndex].DocId,
				doctype = oTable.getModel().getData().ItemSet[rowIndex].doctype,
				docsubtype = oTable.getModel().getData().ItemSet[rowIndex].docsubtype,
				dateData = "";
			thisCntrlr.evt = evt;
			if (evt.getSource().getParent().getParent().getParent().getCells().length > 4) {
				dateData = evt.getSource().getParent().getParent().getParent().getCells()[3].getDateValue();
				dateData = dateData === null ? "" : dateData.yyyymmdd();
			} else {
				dateData = "";
			}
			if (evt.getSource().getIcon().indexOf(oResource.getText("S2PSRSDAEDITBTNTXT").toLowerCase()) >= 0) {
				oTable.getModel().getData().ItemSet[rowIndex].editable = true;
				oTable.getModel().getData().ItemSet[rowIndex].uBvisible = false;
				oTable.getItems()[rowIndex].getCells()[2].setEnabled(true);
				thisCntrlr.tempHold = "";
				thisCntrlr.tempHold = oTable.getModel().getData().ItemSet[rowIndex].note;
				evt.getSource().setIcon(oResource.getText("S2PSRSDASAVEICON"));
				evt.getSource().getParent().getItems()[1].setVisible(true);
				evt.getSource().getParent().getItems()[1].setIcon(oResource.getText("S2PSRSDAATTCANICON"));
				if (evt.getSource().getParent().mAggregations.items[2] !== undefined) {
					evt.getSource().getParent().getItems()[2].setVisible(false);
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
				var sEdit = this.disModel.sServiceUrl + oResource.getText("S4DISRRATCHPTH1") + Guid + oResource.getText("S4DISRRATCHPTH2") + ItemGuid +
				           oResource.getText("S4DISRRATCHPTH3") + doctype + oResource.getText("S4DISRRATCHPTH4") + docsubtype + oResource.getText(
				           "S4DISRRATCHPTH5") + DocId + oResource.getText("S4DISRRATCHPTH6");
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
					OppId: thisCntrlr.getOwnerComponent().OppId,
					ItemNo: thisCntrlr.getOwnerComponent().ItemNo,
					Customer: customerNo,
					Code: "",
					ExpireDate: dateData,
					UploadedBy: "",
					//UploadedDate: oResource.getText("S2OPPAPPPAYLODDATKEY")                                                                      //PCR035760 Defect#131 TechUpgrade changes
				};
				var that = this;
				/****************To Fetch CSRF Token*******************/
				var Header = this.getXcrfHeader(thisCntrlr);
				var oHeaders;
				thisCntrlr.editB = evt.getSource();
				thisCntrlr.deleteB = evt.getSource().getParent().getItems()[1];
				OData.request(Header, function(data, oSuccess) {
					thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
					oHeaders = {
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
						thisCntrlr.editB.setIcon(oResource.getText("S2PSRSDAEDITICON"));
						thisCntrlr.deleteB.setIcon(oResource.getText("S2PSRSDADELETEICON"));
						oTable.getModel().refresh(true);
						thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCATTNOTESUCSSMSG"));
						switch(that_views4.getModel().getProperty("/S4IcntabselKey")){
						case oResource.getText("S2CBCTABTXT"):
							thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid, "");
						    thisCntrlr.refereshData(true, false, false);
						    break;
						case oResource.getText("S1ESAIDSPROSTYPTXT"):
							var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
					        thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, parseInt(EsaData.VersionNo));
					        var oModel = thisCntrlr.getDataModels();
					        var esaDisModel = com.amat.crm.opportunity.model.disEsaModel;
					        var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2],
					        		oModel[3], oModel[4], oModel[4].Status, true, false, false);
					        thisCntrlr.setViewData(EsaModel);
					        break;
						}
					}, function(data) {
						thisCntrlr.showToastMessage(JSON.parse(data.response.body).error.message.value);
						switch(that_views4.getModel().getProperty("/S4IcntabselKey")){
						case oResource.getText("S2CBCTABTXT"):
							thisCntrlr.getRefreshCBCdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid, "");
						    thisCntrlr.refereshData(true, false, false);
						    break;
						case oResource.getText("S1ESAIDSPROSTYPTXT"):
							var EsaData = thisCntrlr.getModelFromCore(oResource.getText("GLBESADATAMODEL")).getData();
					        thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, parseInt(EsaData.VersionNo));
					        var oModel = thisCntrlr.getDataModels();
					        var esaDisModel = com.amat.crm.opportunity.model.disEsaModel;
					        var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], oResource.getText("S1PERDLOG_CURRTXT"), oModel[2],
					        		oModel[3], oModel[4], oModel[4].Status, true, false, false);
					        thisCntrlr.setViewData(EsaModel);
					        break;
						}
					});
				}, function(err) {});
				if (evt.getSource().getParent().mAggregations.items[2] !== undefined) {
					evt.getSource().getParent().getItems()[2].setVisible(true);
				}
				for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {
					if (i !== parseInt(rowIndex)) {
						oTable.getModel().getData().ItemSet[i].bgVisible = true;
					}
				}
			}
		},
		/**
		 * This method Handles Main Comment Text Area live change Event.
		 * @name commMainCommLvchng
		 * @param {sap.ui.base.Event} oEvent - Holds the current event, {sap.ui.model.resource.ResourceModel} the resourceModel of the component,
		 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller, {String} SaveBtn - Save Button Id
		 * @returns
		 */
		commMainCommLvchng: function(oEvent, oResouceBundle, thisCntrlr, SaveBtn) {
			if(oEvent.getSource().getValue().trim() === "" && oEvent.getSource().getValue().length !== 0){				
				SaveBtn.setEnabled(false);
				oEvent.getSource().setValue("");
				thisCntrlr.showToastMessage(oResouceBundle.getText("S2ESAIDSFBLNKCHAREORMSG"));							
			} else if (oEvent.getSource().getValue().length > 0 && oEvent.getParameters().value.length < 255) {
				SaveBtn.setEnabled(true);
			} else if (oEvent.getSource().getValue().length >= 255) {
				SaveBtn.setEnabled(false);
				oEvent.getSource().setValue(oEvent.getSource().getValue().substr(0, 254).trim());
				thisCntrlr.showToastMessage(oResouceBundle.getText("S2PSRSDACBCMCOMMVALTXT"));
			} else {
				SaveBtn.setEnabled(false);
			}
		},
		/**
		 * This method Handles Main Comment save button Event.
		 * @name commSaveMainCom
		 * @param {sap.ui.base.Event} oEvent - Holds the current event, {String} MCommType - Comment Type, {sap.ui.model.resource.ResourceModel} Resource Bundle,
		 * {String} MTxtAra - Main Comment, {String} MainCommTab - Main Comment Table Id, {String} SaveBtn - Save Button Id, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		commSaveMainCom: function(oEvent, MCommType, oResouceBundle, MTxtAra, MainCommTab, SaveBtn, thisCntrlr){
			this._initiateControllerObjects(thisCntrlr);
			var CommType = (MCommType === oResouceBundle.getText("S2CBCTABTXT"))? (oResouceBundle.getText("S2CBCMCOMMDATATYP")):
				((MCommType === oResouceBundle.getText("S2ICONTABPSRTEXT"))? oResouceBundle.getText("S2PSRDCRRATXTASC606") : MCommType);
			var obj = this.MainComPayload(oEvent.getSource().getParent().getFields()[0].getValue(), CommType, oResouceBundle);
			thisCntrlr.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CommentsSet, com.amat.crm.opportunity.util.ServiceConfigConstants
				.write, obj, oResouceBundle.getText("S2PSRCBCMCOMMSAVSUCSSTXT"));
			var ItemGuid = sap.ui.getCore().getModel(oResouceBundle.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
			var sValidate = "CommentsSet?$filter=ItemGuid eq guid'" + ItemGuid + "'and CommType eq '" + CommType + "'";
			thisCntrlr.serviceDisCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			var ComModel = this.getComModel(MCommType, oResouceBundle, thisCntrlr);
			ComModel[2][ComModel[1]].results === undefined ? ComModel[2][ComModel[1]].results.length === 0 : "";
			ComModel[2][ComModel[1]].results = ComModel[0].getData().results;
			thisCntrlr.getView().getModel().refresh(true);
			SaveBtn.setEnabled(false);
            MTxtAra.setValue("");
		},
		/**
		 * This method is used to get Main Comment Model.
		 * @name getMainCommModel
		 * @param {String} MainCommTyp - Main Comment Type
		 * @returns
		 */
		getMainCommModel: function(MainCommTyp) {
			var oResource = this.getResourceBundle(),
			    ItemGuid = sap.ui.getCore().getModel(oResource.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
			var sValidate = oResource.getText("S4DISCARMCOMMPTH") + ItemGuid + oResource.getText("S4DISCARMCOMMPTH1") + MainCommTyp + "'";
			this.serviceDisCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
		},
		/**
		 * This method Used to get Current Process Navigation and Comment Model.
		 * @name getComModel
		 * @param {String} MCommType - Comment Type, {sap.ui.model.resource.ResourceModel} - resource Bundle, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		getComModel: function(MCommType, oResouceBundle, thisCntrlr){
			var MComModel, Nav_Path;
			switch (MCommType) {
			case oResouceBundle.getText("S2GENINFOMCOMMDATATYP"):
				 MComModel = sap.ui.getCore().getModel(oResouceBundle.getText("GLBGENCOMMMODEL"));
				 Nav_Path = oResouceBundle.getText("S4DISGENMAININFONAV");
				 break;
			case oResouceBundle.getText("S2CBCTABTXT"):
				 MComModel = sap.ui.getCore().getModel(oResouceBundle.getText("GLBCBCCOMMMODEL"));
				 Nav_Path = oResouceBundle.getText("S4DISCBCMAININFONAV");
				break;
			case oResouceBundle.getText("S2ICONTABPSRTEXT"):
				 MComModel = sap.ui.getCore().getModel(oResouceBundle.getText("GLBPSRCOMMMODEL"));
				 Nav_Path = oResouceBundle.getText("S4DISRRAMAININFONAV");
				break;
			case oResouceBundle.getText("S1ESAIDSPROSTYPTXT"):
				 var obj = {"results": sap.ui.getCore().getModel(oResouceBundle.getText("GLBESAMCOMMMODEL")).getData().oEsaManComm.results};
				 MComModel = new sap.ui.model.json.JSONModel(obj);
				 Nav_Path = oResouceBundle.getText("S4DISESAMAININFONAV");
				break;
			}
			return [MComModel, Nav_Path, thisCntrlr.getView().getModel().getData()];
		},
		/**
		 * This method used to get Main Comment PayLoad.
		 * @name MainComPayload
		 * @param {sap.ui.base.Event} oEvent - Holds the current event, {String} CommType - Main Comment Type, {sap.ui.model.resource.ResourceModel} - Resource bundle
		 * @returns obj(Object)
		 */
		MainComPayload: function(Comment, CommType, oResouceBundle) {
			var obj = {};
			obj.ItemGuid = sap.ui.getCore().getModel(oResouceBundle.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
			obj.CommentId = sap.ui.getCore().getModel(oResouceBundle.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
			obj.CommType = CommType;
			obj.Comment = Comment;
			obj.CreatedName = "";
			obj.CreatedDate = "";
			return obj;
		},
		/**
		 * This method Used to handles Search Event.
		 * @name commonsearchOpportunity
		 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
		 * @returns
		 */
		commonsearchOpportunity: function(oEvent, thisCntrlr){
			var oFilter;
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var aFilters = [new sap.ui.model.Filter(thisCntrlr.getResourceBundle().getText("S2OPPAPPOPPIDKEY"), sap.ui.model
					.FilterOperator.Contains, sQuery)];
				oFilter = new sap.ui.model.Filter(aFilters, false);
			}
			var binding = thisCntrlr.dialog.getContent()[2].getBinding(thisCntrlr.getResourceBundle().getText("S1TABLELISTITM"));
			binding.filter(oFilter);
		}
	});
});