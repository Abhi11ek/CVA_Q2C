/**-------------------------------------------------------------------------------*
 * This class holds all methods of Display CARM page.                              *
 * -------------------------------------------------------------------------------*
 * @class                                                                         *
 * @public                                                                        *
 * @author Abhishek Pant                                                          *
 * @since 25 November 2019                                                        *
 * @extends com.amat.crm.opportunity.controller.BaseController                    *
 * @name com.amat.crm.opportunity.controller.disp_carm                             *
 *  * ----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 **********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController",
		"com/amat/crm/opportunity/controller/disp_CommController",
		"com/amat/crm/opportunity/model/disCarmModel",
		"sap/m/MessageBox", 'sap/ui/model/json/JSONModel'
	],
	function (Controller, CommonController, disCarmModel, MessageBox, JSONModel) {
		"use strict";
		var thisCntrlr, oCommonController;
	 return Controller.extend("com.amat.crm.opportunity.controller.disp_carm", {
		 /* =========================================================== */
			/* lifecycle methods */
			/* =========================================================== */
			/**
			 * Called when a controller is instantiated and its View controls (if
			 * available) are already created. Can be used to modify the View before
			 * it is displayed, to bind event handlers and do other one-time
			 * initialization.
			 *
			 * @memberOf view.disp_carm
			 */
			onInit: function() {
				thisCntrlr = this;
				thisCntrlr.bundle = this.getResourceBundle();
				thisCntrlr.that_views4 = this.getOwnerComponent().s4;
				thisCntrlr.oMyOppModel = new com.amat.crm.opportunity.model.models(this);
				oCommonController = new CommonController();
			},
			/**
			 * This Method used to check CARM Initiate Status.
			 * @name checkCarmInitiate
			 * @param
			 * @returns
			 */
			checkCarmInitiate: function() {
				thisCntrlr.getRefreshCarmdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid, thisCntrlr.bundle
						.getText("S2MLIMCOMMDATATYP"));
				var oModel = thisCntrlr.getDataModels();
				var EsaModel = disCarmModel.carmDisMode(thisCntrlr, oModel[0], oModel[1], oModel[2], oModel[2].Status, oModel[3], false);
				thisCntrlr.setViewData(EsaModel);
				thisCntrlr.CarmTabColorInit(oModel[2].Status);
			},
			/**
			 * This method use to collect all models data.
			 * @name getDataModels
			 * @param
			 * @returns
			 */
			getDataModels: function () {
				var oResource = thisCntrlr.getResourceBundle(),
				    GeneralInfodata = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData(),
				    SecurityData = this.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData(),
				    CarmData = this.getModelFromCore(oResource.getText("GLBCARMMODEL")).getData(),
				    CarmMComData = this.getModelFromCore(oResource.getText("GLBCARMCOMMMODEL")).getData();
				return [GeneralInfodata, SecurityData, CarmData, CarmMComData];
			},
			/**
			 * This Method used to refresh CARM Data.
			 * @name getRefreshCarmdata
			 * @param {String} Guid - Opportunity GUID, {String} ItemGuid - Opportunity ItemGuid, {String} MCommType - Main Comment Type
			 * @returns
			 */
			getRefreshCarmdata: function(Guid, ItemGuid, MCommType){
				var oResource = thisCntrlr.getResourceBundle();
				var sValidate = oResource.getText("S4DISCARMINFOPTH") + Guid + oResource.getText("S4DISRRATCHPTH2") + ItemGuid +
				      oResource.getText("S4DISCARMINFOPTH1");
		        this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
		        thisCntrlr.getComModel(ItemGuid, MCommType);
			},
			/**
			 * This Method used to refresh CARM Main Comment Data.
			 * @name getRefreshCarmdata
			 * @param {String} ItemGuid - Opportunity ItemGuid, {String} MCommType - Main Comment Type
			 * @returns
			 */
			getComModel: function(ItemGuid, MCommType){
				var oResource = thisCntrlr.getResourceBundle();
				var sValidate = oResource.getText("S4DISCARMCOMMPTH") + ItemGuid + oResource.getText("S4DISCARMCOMMPTH1") + MCommType +"'";
	            this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			},
			/**
			 * This method Handles to set ESA view model.
			 * @name setViewData
			 * @param {sap.ui.model.Model} CarmModel - CarmModel
			 * @returns
			 */
			setViewData: function (CarmModel) {
				var oCarmModel = thisCntrlr.getJSONModel(CarmModel);
				thisCntrlr.getView().setModel(oCarmModel);
			},
			/**
			 * This Method Handles CARM Cancel Button Event.
			 * @name onCancelCarm
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onCancelCarm: function(oEvent) {
				var oResource = thisCntrlr.getResourceBundle(),
				    Mesg = oResource.getText("S2CANINITMSG1") + oResource.getText("S2CARMCANINITMSG2");
				sap.m.MessageBox.confirm(Mesg, this.confirmationCARMCanInit, oResource.getText("S2PSRSDACBCCONDIALOGTYPTXT"));
			},
			/**
			 * This Method is use on CARM Cancel Initiation dialog box OK Button press event.
			 * @name confirmationCARMCanInit
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			confirmationCARMCanInit: function(oEvent) {
				var oResource = thisCntrlr.getResourceBundle();
				if(oEvent === oResource.getText("S2CONFFRGOKBTN")){
					var sDelete = oResource.getText("S4DISCARMINFOINITPTH") + thisCntrlr.getOwnerComponent().Guid + oResource.getText("S4DISRRATCHPTH2") +
					     thisCntrlr.getOwnerComponent().ItemGuid + "')";
					thisCntrlr.serviceCall(sDelete, com.amat.crm.opportunity.util.ServiceConfigConstants.remove, "", oResource
						.getText("S2PCBCCANCELSTATTXT"));
					thisCntrlr.checkCarmInitiate();
				}
			},
			/**
			 * This Method Handles CARM Meeting Date Selection Event.
			 * @name onCarmDateChange
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onCarmDateChange: function(oEvent) {
				thisCntrlr.getView().getModel();
				var oView = thisCntrlr.getView(),
				    oResource = thisCntrlr.getResourceBundle();
				thisCntrlr.tempDate = oEvent.getParameters().newValue;
				if (new Date(thisCntrlr.tempDate.split(".")[1] + "-" + thisCntrlr.tempDate.split(".")[0] + "-" + thisCntrlr.tempDate
						.split(".")[2]) > new Date()) {
					thisCntrlr.showToastMessage(this.getResourceBundle().getText("S1CARMDATEGREATER"));
					oView.getModel().setProperty("/DatPicVluStat", oResource.getText("S2ERRORVALSATETEXT"));
					oView.getModel().setProperty("/DatPicVal", null);
					oView.getModel().setProperty("/SaveVis", false);
				} else {
					oView.getModel().setProperty("/SaveVis", true);
					oView.getModel().setProperty("/DatPicVluStat", oResource.getText("S2DELNAGVIZTEXT"));
				}
				oView.getModel().refresh(true);
			},
			/**
			 * This Method Handles CARM Save Button Event.
			 * @name onSaveCarm
			 * @param
			 * @returns
			 */
			onSaveCarm: function() {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oResource = thisCntrlr.getResourceBundle(),
				    GenInfoData = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData(),
				    initiateFlag = this.validateConTact(GenInfoData),
				    oView = thisCntrlr.getView();				
				if (initiateFlag === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2CARMCHECKFAILMSG"));
				} else {
					if (oView.getModel().getProperty("/DatPicVal") === null) {
						thisCntrlr.showToastMessage(oResource.getText("S1CARMDATECHECK"));
						oView.getModel().setProperty("/SaveVis", false);
						oView.getModel().setProperty("/DatPicVluStat", oResource.getText("S2ERRORVALSATETEXT"));
						oView.getModel().refresh(true);
						myBusyDialog.close();
						return;
					} else {
						Date.prototype.yyyymmdd = function() {
							var mm = this.getMonth() + 1;
							var dd = this.getDate();
							return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
						};
						var date = oView.getModel().getProperty("/DatPicVal");
						var oEntry = {
							Guid: GenInfoData.Guid,
							StatDesc: "",
							ItemGuid: GenInfoData.ItemGuid,
							OppId: GenInfoData.OppId,
							ItemNo: GenInfoData.ItemNo,
							Required: "",
							Status: "96",
							MeetDate: date.yyyymmdd(),
							Commetns: ""
						};
						this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CARMInfoSet, com.amat.crm.opportunity
							.util.ServiceConfigConstants.write, oEntry, oResource.getText("S2CARMSAVEWFMSAG")
						);
						thisCntrlr.checkCarmInitiate();
						var sValidate = oResource.getText("S4DISRRGENIFOPTH") + thisCntrlr.getOwnerComponent().Guid + oResource.getText("S4DISRRATCHPTH2") +
						          thisCntrlr.getOwnerComponent().ItemGuid + oResource.getText("S4DISRRGENIFOPTH1");
                        this.serviceDisCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
					}
				}
				myBusyDialog.close();
			},
			/**
			 * This method Handles Browse Button Upload Complete Event.
			 * @name handleFileUploadComplete
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			handleFileUploadComplete: function(oEvent) {
				thisCntrlr.Custno = null;
				this.oFileUploader = null;
				var oResource = thisCntrlr.bundle, type = "";
				sap.ui.core.BusyIndicator.show();
				var uploadButton = oEvent.getSource().getParent().getParent().getItems()[1],
				    rowIndex = uploadButton.getId().split("-")[uploadButton.getId().split("-").length - 1],
				    oTable = oEvent.getSource().getParent().getParent().getParent().getParent();
				oTable.getModel().getData().ItemSet[rowIndex].filename = oEvent.mParameters.newValue;
				thisCntrlr.oTable = oTable;
				thisCntrlr.tableModel = oTable.getModel().getData();
				thisCntrlr.Custno = thisCntrlr.getOwnerComponent().Custno;
				oTable.getModel().getData().ItemSet[rowIndex].uBvisible = true;
				oTable.getModel().getData().ItemSet[rowIndex].bgVisible = !oTable.getModel().getData().ItemSet[rowIndex]
					.uBvisible;
				oTable.getModel().getData().ItemSet[rowIndex].editable = false;
				if (oTable.getModel().getData().ItemSet[rowIndex].doctype === oResource.getText("S2MLIMCOMMDATATYP") && oTable.getModel().getData()
					.ItemSet[rowIndex].docsubtype === oResource.getText("S2ATTOTHTYPETEXT") || oTable.getModel().getData().ItemSet[rowIndex].Code ===
						oResource.getText("S2OTHDOCCODETEXT")) {
					type = oResource.getText("S2OTHDOCCODETEXT");
				} else {
					type = "";
				}
				var SLUG = oTable.getModel().getData().ItemSet[rowIndex].itemguid.replace(/-/g, "").toUpperCase() + "$$" + oTable.getModel()                        //PCR035760 Defect#131 TechUpgrade changes
					.getData().ItemSet[rowIndex].doctype + "$$" + oTable.getModel().getData().ItemSet[rowIndex].docsubtype +
					"$$" + type + "$$" + " " + "$$" + thisCntrlr.Custno + "$$" + oTable.getModel().getData().ItemSet[
						rowIndex].filename + "$$" + (oTable.getModel().getData().ItemSet[rowIndex].note === " " ? " " :
						oTable.getModel().getData().ItemSet[rowIndex].note);
				if (!window.location.origin) {
					window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location
						.port ? ':' + window.location.port : '');
				}
				var sBaseUrl = window.location.origin;
				var file = oEvent.oSource.oFileUpload.files[0];
				this.oFileUploader = oEvent.getSource();
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
				var buttonGroup = oEvent.getSource().getParent().getParent().getItems()[0];
				buttonGroup.setVisible(true);
			},
			/**
			 * This Handles Complete File upload Event CARM Process.
			 * @name onCarmFileUploadComplete
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onCarmFileUploadComplete: function(oEvent) {
				var oView = thisCntrlr.getView(),
				    oResource = thisCntrlr.getResourceBundle();
				if (oEvent.getParameters().status === 201) {
					thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCATTDOCUPLDSUCSSMSG"));
				} else if (oEvent.getParameters().status === 400) {
					thisCntrlr.showToastMessage($(oEvent.mParameters.responseRaw).find(oResource.getText("S2CBCPSRCARMTYPEMESG")).text());					
				}
				thisCntrlr.checkCarmInitiate();
				sap.ui.core.BusyIndicator.hide();
			},
			/**
			 * This method Handles File Name Press Event.
			 * @name handleEvidenceLinkPress
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			handleLinkPress: function(oEvent) {
				var rowIndex = oEvent.getSource().getParent().getId().split("-")[oEvent.getSource().getParent().getId().split(
					         "-").length - 1],
					oData = oEvent.getSource().getParent().getParent().getModel().getData().ItemSet[rowIndex],
					oResource = thisCntrlr.getResourceBundle(),
					oLink = oEvent.getSource(),
					url = this.oMyOppModel._oDataModel.sServiceUrl + oResource.getText("S4DISRRATCHPTH1") + oData.Guid + oResource.getText("S4DISRRATCHPTH2") +
				    oData.itemguid + oResource.getText("S4DISRRATCHPTH3") + oData.doctype + oResource.getText("S4DISRRATCHPTH4") + oData.docsubtype +
				    oResource.getText("S4DISRRATCHPTH5") + oData.DocId + "')/$value";
				window.open(url);
			},
			/**
			 * This method Handles Note Live Change Event.
			 * @name handleNoteLiveChange
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			handleNoteLiveChange: function(oEvent) {
				disCarmModel.NoteLiveChange(oEvent, thisCntrlr);
			},
			/**
			 * This method Handles Edit Button Press Event.
			 * @name handleEditPress
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			handleEditPress: function(oEvent) {
				disCarmModel.EditPress(oEvent, thisCntrlr);
			},
			/**
			 * This method Handles Add Button Press Event.
			 * @name handleAddPress
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			handleAddPress: function(oEvent) {
				disCarmModel.AddPress(oEvent, thisCntrlr);
			},
			/**
			 * This Method Handles Radio Button Group Event.
			 * @name setCarmEditOnNavBack
			 * @param
			 * @returns
			 */
			setCarmEditOnNavBack: function() {
				var oView = thisCntrlr.getView();
			},
			/**
			 * This method Validates Delete Button Press Event.
			 * @name CheckDelete
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			CheckDelete: function(oEvent) {
				var oResource = thisCntrlr.getResourceBundle();
				thisCntrlr.rowIndex = oEvent.getSource().getParent().getParent().getParent().getId().split("-")[oEvent.getSource()
					.getParent().getParent().getParent().getId().split("-").length - 1];
				thisCntrlr.source = oEvent.getSource();
				var oTable = oEvent.getSource().getParent().getParent().getParent().getParent();
				if (thisCntrlr.source.getIcon().indexOf(oResource.getText("S2ATTCHDOCDELVALDDELTXT").toLowerCase()) >= 0) {
					var text = oResource.getText("S2ATTCHDOCDELVALDMSG") + " " + oTable.getModel().getData().ItemSet[thisCntrlr.rowIndex]
					      .DocDesc + "?";
					var box = new sap.m.VBox({
						items: [
							new sap.m.Text({
								text: text
							})
						]
					});
					MessageBox.show(box, {
						icon: sap.m.MessageBox.Icon.INFORMATION,
						title: oResource.getText("S2ATTCHDOCDELVALDCONTXT"),
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
			 * @name handleDeletePress
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			handleDeletePress: function(oEvent) {
				disCarmModel.DeletePress(oEvent, thisCntrlr);
			},
			/**
			 * This Method Handles Radio Button Group Event.
			 * @name onCarmSelect
			 * @param {sap.ui.base.Event} evt - Holds the current event
			 * @returns
			 */
			onCarmSelect: function(evt) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oResource = thisCntrlr.getResourceBundle();
				var GenInfoData = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();
				var initiateFlag = this.validateConTact(GenInfoData);			
				if (initiateFlag === false) {
					thisCntrlr.showToastMessage(oResource.getText("S2CARMCHECKFAILMSG"));
				} else {
					var oEntry = {
							Guid: GenInfoData.Guid,
							StatDesc: "",
							ItemGuid: GenInfoData.ItemGuid,
							OppId: GenInfoData.OppId,
							ItemNo: GenInfoData.ItemNo,
							Required: oResource.getText("S2NEGMANDATANS"),
							Status: "97",
							MeetDate: oResource.getText("S2ATTACHPSRCBDATESTRNGTEXT"),
							Commetns: ""
					};
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CARMInfoSet, com.amat.crm.opportunity
							.util.ServiceConfigConstants.write, oEntry, oResource.getText("S2CARMNTAPPBLESUCSSTXT"));
					this.checkCarmInitiate();
				}
				myBusyDialog.close();
			},
			/**
			 * This method Handles Other Button Event.
			 * @name handleOtherPress
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			handleOtherPress: function(oEvent) {
				var oResource = thisCntrlr.getResourceBundle();
				var DocumentType = [{
					"DocumentType": DocumentType
				}];
				switch (oEvent.getSource().data(oResource.getText("S2CARMDOCSPREXTRADTTEXT"))) {
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
			 * This method Used to current User with Contact List.
			 * @name checkContact
			 * @param {Object Array} UserList - User Contact List
			 * @returns {Boolean} checkFlag - Binary Flag
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
			 * This method Used to Validate CARM Contact.
			 * @name validateConTact
			 * @param {sap.ui.model.Model} GeneralInfodata - General Info Data
			 * @returns {Boolean} initiateFlag - Binary Flag
			 */
			validateConTact: function(GeneralInfodata) {
				var initiateFlag = false,
				    omInitiateFlag = this.checkContact(GeneralInfodata.NAV_OM_INFO.results),
				    GpmInitiateFlag = this.checkContact(GeneralInfodata.NAV_GPM_INFO.results),
				    salesInitiateFlag = this.checkContact(GeneralInfodata.NAV_SLS_INFO.results);
				initiateFlag = (omInitiateFlag === true ||  GpmInitiateFlag === true || salesInitiateFlag === true) ? true : false;
				return initiateFlag;
			},
			/**
			 * This method Handles Main Comment Note Live Change Event.
			 * @name OnEsaMainCommLvchng
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			OnMainCommLvchng: function (oEvent) {
				oCommonController.commMainCommLvchng(oEvent, thisCntrlr.getResourceBundle(), thisCntrlr, thisCntrlr.getView().byId(com.amat
						.crm.opportunity.Ids.S4DISCARMMAINCOMSAVEBTN));
			},
			/**
			 * This method Handles Main Comment Save Event.
			 * @name onSaveEsaMainCom
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onSaveMainCom: function (oEvent) {
				var oResouceBundle = thisCntrlr.getResourceBundle(),
				    oView = thisCntrlr.getView();
				if (!(oEvent.getSource().getParent().getFields()[0].getValue().match(/\S/))) {
					thisCntrlr.showToastMessage(oResouceBundle.getText("S2MAINCOMMBLANKMSG"));
					oView.getModel().setProperty("/MComTAVal", "");					
				} else {
					var myBusyDialog = thisCntrlr.getBusyDialog();
					myBusyDialog.open();
					var obj = disCarmModel.MainComPayload(thisCntrlr, oEvent.getSource().getParent().getFields()[0].getValue(), oResouceBundle
							.getText("S2MLIMCOMMDATATYP"));
					this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CommentsSet, com.amat.crm.opportunity.util.ServiceConfigConstants
						.write, obj, oResouceBundle.getText("S2PSRCBCMCOMMSAVSUCSSTXT"));
					thisCntrlr.getComModel(thisCntrlr.getOwnerComponent().ItemGuid, oResouceBundle.getText("S2MLIMCOMMDATATYP"));
					var oModel = thisCntrlr.getDataModels();
					oView.getModel().getData()[oResouceBundle.getText("S4DISESAMAININFONAV")].results === undefined ?
							oView.getModel().getData()[oResouceBundle.getText("S4DISESAMAININFONAV")].results.length === 0 : "";
					thisCntrlr.getView().getModel().getData()[oResouceBundle.getText("S4DISESAMAININFONAV")].results = oModel[3].results;
					oView.getModel().setProperty("/MComSavBtnEbl", false);
					oView.getModel().setProperty("/MComTAVal", "");	
					myBusyDialog.close();
				}
				thisCntrlr.getView().getModel().refresh(true);
			},
			/**
			 * This method uses to reset CBC Attachment table.
			 * @name resetAttTab
			 * @param
			 * @returns
			 */
			resetAttTab: function(){
				var oResource = thisCntrlr.getResourceBundle();
				switch(thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).getSelectedKey()){
				case oResource.getText("S2ICONTABCARMKEY"):
				     thisCntrlr.checkCarmInitiate();
					 var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISCARMATTAB);
					 for (var i = 0; i < carmTable.getModel().getData().ItemSet.length; i++) {
						 carmTable.getModel().getData().ItemSet[i].editable = true;
						 carmTable.getItems()[i].getCells()[2].setEnabled(false);
					 }
					 carmTable.getModel().refresh(true);
				}
			},
			/**
			 * This method uses to reset CBC tab button Color.
			 * @name CarmTabColorInit
			 * @param {String} CarmData - CARM Status
			 * @returns
			 */
			CarmTabColorInit: function (CarmStatus) {
				var CarmTab = thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISCARM);
				switch (parseInt(CarmStatus)) {
				case 95:
					CarmTab.setIconColor(sap.ui.core.IconColor.Critical);
					break;
				case 96:
				case 97:
					CarmTab.setIconColor(sap.ui.core.IconColor.Positive);
					break;
				default:
					CarmTab.setIconColor(sap.ui.core.IconColor.Default);
				}
			}
	 });
});