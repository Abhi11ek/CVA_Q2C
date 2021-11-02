/**********************************************************************************
 * This class holds all methods of S4 page for Display BU's.                      *
 **********************************************************************************
 * @class                                                                         *
 * @public                                                                        *
 * @author Abhishek Pant                                                          *
 * @since 25 November 2019                                                        *
 * @extends com.amat.crm.opportunity.controller.BaseController                    *
 * @name com.amat.crm.opportunity.controller.S4                                   *
 *  * ----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 25/01/2021      Abhishek        PCR033306         Q2C Display Enhancements     *
 ***********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController"],
	function(Controller) {
		"use strict";
		var that_S4,
			that_dis_general,
			that_disp_psrra,
			that_dis_cbc,
			that_attachment,
			that_carm,
			that_mli,
			that_dis_esa;
		return Controller.extend("com.amat.crm.opportunity.controller.S4", {
			/* =========================================================== */
			/* lifecycle methods */
			/* =========================================================== */
			/**
			 * Called when a controller is instantiated and its View controls (if
			 * available) are already created. Can be used to modify the View before
			 * it is displayed, to bind event handlers and do other one-time
			 * initialization.
			 *
			 * @memberOf view.S2
			 */
			onInit: function() {
				that_S4 = this;
				this.getOwnerComponent().s4 = that_S4.getView();
				this.oMyOppModel = new com.amat.crm.opportunity.model.models(this);
				that_dis_general = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISGENINFO).getContent()[0];
				this.getOwnerComponent().dis_general = that_dis_general;
				that_dis_cbc = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISCBC).getContent()[0];
				this.getOwnerComponent().dis_cbc = that_dis_cbc;
				that_carm = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISCARM).getContent()[0];
				this.getOwnerComponent().carm = that_carm;
				that_attachment = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISATTACH).getContent()[0];
				this.getOwnerComponent().attachment = that_attachment;
				that_disp_psrra = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISRRA).getContent()[0];
				this.getOwnerComponent().dis_psrra = that_disp_psrra;
				that_mli = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISMLI).getContent()[0];
				this.getOwnerComponent().mli = that_mli;
				that_dis_esa = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISESA).getContent()[0];
				this.getOwnerComponent().dis_esa = that_dis_esa;
				if (that_dis_esa.getController().that_views4 === undefined) {
					that_dis_esa.getController().that_views4 = this.getView();
				}
				if (that_disp_psrra.getController().that_views4 === undefined) {
					that_disp_psrra.getController().that_views4 = this.getView();
				}
				if (that_attachment.getController().that_views4 === undefined) {
					that_attachment.getController().that_views4 = this.getView();
				}
				if (that_carm.getController().that_views4 === undefined) {
					that_carm.getController().that_views4 = this.getView();
				}
				if (that_dis_cbc.getController().that_views4 === undefined) {
					that_dis_cbc.getController().that_views4 = this.getView();
				}
				if (that_dis_general.getController().that_views4 === undefined) {
					that_dis_general.getController().that_views4 = this.getView();
				}
				if (that_mli.getController().that_views4 === undefined) {
					that_mli.getController().that_views4 = this.getView();
				}
				if (this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")) === undefined) {
					var oRouter = this.getRouter();
					oRouter.getRoute(this.getResourceBundle().getText("S1DISROUTOPPDTLTXT")).attachMatched(this._onRouteMatched,this);
				}
			},
			/**
			 * This method is used to handles Root Matched for URL.
			 * @name _onRouteMatched
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			_onRouteMatched: function(oEvent) {
				that_S4.oArgs = oEvent.getParameter(this.getResourceBundle().getText("S2PARARGUMENT"));				
				if (that_S4.oArgs.Guid != undefined && that_S4.oArgs.ItemGuid !== undefined) {
					this.getOwnerComponent().Guid = that_S4.oArgs.Guid;
					this.getOwnerComponent().ItemGuid = that_S4.oArgs.ItemGuid;
				    this.fromURL();
				}
			},
			/**
			 * This method is used to handles load S4 data on accessing through mail.
			 * @name fromURL
			 * @param {String} preValue - flag to differentiate from mail link or app
			 * @returns
			 */
			fromURL: function(preValue) {
				var oResource = this.getResourceBundle();
				this.getOwnerComponent().OppType = oResource.getText("S4DISOPPTYPTXT");
				if (preValue === oResource.getText("S2PSRDETERMINDFTPARAM")) {
					that_S4.oArgs = {};
					if(that_S4.oArgs.Guid === undefined || that_S4.oArgs.ItemGuid === undefined){										
						that_S4.oArgs.Guid = this.getOwnerComponent().Guid;
						that_S4.oArgs.ItemGuid = this.getOwnerComponent().ItemGuid;
					   if(that_S4.oArgs.VerNo === undefined){
						   that_S4.oArgs.VerNo = this.getOwnerComponent().VerNo;
					   }
				   }
				}
				this.SetGenInfoModel(oResource);
			    that_S4.setHeaderData(oResource, "");
			    var context = this.getOwnerComponent().context;
				that_S4.OppId = context.OppId;
				that_S4.ItemNo = context.ItemNo;
				this.getOwnerComponent().Custno = this.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData().Custno;
				that_dis_cbc.byId(com.amat.crm.opportunity.Ids.S4DISCBCDISBOX).setVisible(false);
				that_dis_esa.byId(com.amat.crm.opportunity.Ids.S4DISESADISBOX).setVisible(false);
				that_disp_psrra.byId(com.amat.crm.opportunity.Ids.S4DISRRADISBOX).setVisible(false);
			},
			/**
			 * This method is used to Set S4 View Data.
			 * @name setHeaderData
			 * @param {sap.ui.model.resource.ResourceModel} oResource -  ResourceBundle, {String} Key - Icon Tab Selected Key
			 * @returns
			 */
			setHeaderData: function(oResource, Key){
				var aMockMessages = [];
				var viewModel = new sap.ui.model.json.JSONModel(),
				    SecurityData = this.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();                                                                            //PCR033306++
				viewModel.setData({
					messagesLength: aMockMessages.length + ''
				});
				this.getView().byId(com.amat.crm.opportunity.Ids.S4DISAPRMSGPOPOVERFTR).setModel(viewModel);
				this.getView().byId(com.amat.crm.opportunity.Ids.S4DISAPRMSGPOPOVERFTR).setVisible(false);
				var context = this.getOwnerComponent().context;
				if(context === undefined){ context = this.setContextVal(that_S4, oResource)}
				var S4TitleData = {};
				S4TitleData.S4TITLE = context.Custname + "-" + context.FabName + "-" + context.OppId + "_" + context.ItemNo + "-" + context.SlotNo +
						"-" +  context.VcPrdid + "-" + context.Pbg;
				S4TitleData.S4MsgPopOvrVis = false;
				S4TitleData.S4ApprVis = false;
				S4TitleData.S4RmidMailVis = false;
				S4TitleData.S4RjctVis = false;
				S4TitleData.S4ResetVis = false;
				S4TitleData.S4CbcResetVis = false;
				S4TitleData.S4EsaCancelVis = false;
				S4TitleData.S4EsaResetVis = false;
				//********* Start Of PCR033306++: Q2C Display Enhancements ****************
				var Itab = this.byId(com.amat.crm.opportunity.Ids.S4DISICNTAB);
				(SecurityData.AgsUser === oResource.getText("S2ODATAPOSVAL")) ? (Itab.removeStyleClass(oResource.getText("S4DISAGSDFTTXT")), Itab.addStyleClass(oResource.getText(
				    "S4DISAGSNEGTXT")), S4TitleData.S4CBCTabVis = false, S4TitleData.S4CARMTabVis = false, S4TitleData.S4ESATabVis = false) : (Itab.removeStyleClass(
				    oResource.getText("S4DISAGSNEGTXT")), Itab.addStyleClass(oResource.getText("S4DISAGSDFTTXT")), S4TitleData.S4CBCTabVis = true, S4TitleData.S4CARMTabVis =
				    true, S4TitleData.S4ESATabVis = true);
				//********* End Of PCR033306++: Q2C Display Enhancements ******************
				S4TitleData.S4IcntabselKey = Key === "" ? oResource.getText("S2ICONTABDEFAULTKEY") : Key;
				that_S4.setIconTabFilterColor(S4TitleData);				
				var S4TitleModel = this.getJSONModel(S4TitleData);
				this.getView().setModel(S4TitleModel);
			},
			/**
			 * This method is used to Set Context Value.
			 * @name setContextVal
			 * @param {sap.ui.core.mvc.Controller} that_S4 - Current Controller, {sap.ui.model.resource.ResourceModel} oResource -  ResourceBundle
			 * @returns
			 */
			setContextVal: function(that_S4, oResource){
				var GeneralInfodata = this.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")).getData();
				that_S4.getOwnerComponent().context = {};
				that_S4.getOwnerComponent().context.CustName = GeneralInfodata.CustName;
				that_S4.getOwnerComponent().context.FabName = GeneralInfodata.FabName;
				that_S4.getOwnerComponent().context.OppId = GeneralInfodata.OppId;
				that_S4.getOwnerComponent().context.ItemNo = GeneralInfodata.ItemNo;
				that_S4.getOwnerComponent().context.SlotNo = GeneralInfodata.SlotId;
				that_S4.getOwnerComponent().context.VcPrdid = GeneralInfodata.VcPrdid;
				that_S4.getOwnerComponent().context.Pbg = GeneralInfodata.Bu;
				that_S4.getOwnerComponent().context.Kpu = GeneralInfodata.Kpu;
			    return that_S4.getOwnerComponent().context;
			},
			/**
			 * This method is used to Set GeneralInfo Model.
			 * @name SetGenInfoModel
			 * @param {sap.ui.model.resource.ResourceModel} oResource -  ResourceBundle
			 * @returns
			 */
			SetGenInfoModel: function(oResource){
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.SecurityDataSet, com.amat.crm.opportunity
						.util.ServiceConfigConstants.read, "", "");
				that_S4.getRefereshGenInfoData();
				this.serviceDisCall(com.amat.crm.opportunity.util.ServiceConfigConstants.QuotelistSet, com.amat.crm.opportunity.util.ServiceConfigConstants
							.read, "", "");
				var QuotelistSet = this.getModelFromCore(oResource.getText("GLBQUOTELISTSET")).getData();
				var OppGenInfoModel = this.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL"));
				var SecurityData = this.getModelFromCore(oResource.getText("GLBSECURITYMODEL")).getData();
				QuotelistSet.results.unshift({Quote: oResource.getText("SELQUOTE")});
				OppGenInfoModel.getData().disp_GenMainexp = OppGenInfoModel.getData().NAV_GEN_COMMENTS.results.length > 0;
				OppGenInfoModel.getData().QuotelistSet = QuotelistSet;
				OppGenInfoModel.getData().genQotRevBtnVis = false;
				OppGenInfoModel.getData().AddContact = SecurityData.AddContact === oResource.getText("S1TABLESALESTAGECOL") ? true : false;
				OppGenInfoModel.getData().DelContact = SecurityData.DelContact === oResource.getText("S1TABLESALESTAGECOL") ?
				    		                           oResource.getText("S2DELPOSVIZTEXT") : oResource.getText("S2DELNAGVIZTEXT");
				that_dis_general.setModel(OppGenInfoModel);
			},
			/**
			 * This method used Initialize Global controller variables.
			 * @name _initiateControllerObjects
			 * @param
			 * @returns
			 */
			_initiateControllerObjects: function() {
				this.getOwnerComponent().s4 = that_S4.getView();
				that_dis_general = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISGENINFO).getContent()[0];
				this.getOwnerComponent().dis_general = that_dis_general;
				that_attachment = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISATTACH).getContent()[0];
				this.getOwnerComponent().attachment = that_attachment;
				that_disp_psrra = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISRRA).getContent()[0];
				this.getOwnerComponent().dis_psrra = that_disp_psrra;
				that_dis_cbc = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISCBC).getContent()[0];
				this.getOwnerComponent().dis_cbc = that_dis_cbc;
				that_carm = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISCARM).getContent()[0];
				this.getOwnerComponent().carm = that_carm;
				that_mli = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISMLI).getContent()[0];
				this.getOwnerComponent().mli = that_mli;
				that_dis_esa = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISESA).getContent()[0];
				this.getOwnerComponent().dis_esa = that_dis_esa;
			},
			/**
			 * This method Used to Back Button Press Event.
			 * @name onNavBack
			 * @param
			 * @returns
			 */
			onNavBack: function() {
				this.getOwnerComponent().getRouter().navTo(this.getResourceBundle().getText("S2DASHBOARDROUT"), {});
				this.getOwnerComponent().Custno = "";
				this.getOwnerComponent().OppType === "";
			},
			/**
			 * This method is used to set the Icon tab color for tab Filters.
			 * @name setIconTabFilterColor
			 * @param
			 * @returns
			 */
			setIconTabFilterColor: function(S2Data) {
				var OppGenInfoModel = this.getModelFromCore(this.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData();
				switch (parseInt(OppGenInfoModel.PsrStatus)) {
				   case 55:
				   case 58:
				   case 60:
				   case 85:
				   case 90:
				   case 95:
					   S2Data.PsrIconColor = sap.ui.core.IconColor.Positive;
					   break;
				   case 5:
				   case 4:
				   case 15:
				   case 17:
				   case 20:
				   case 25:
				   case 35:
				   case 45:
				   case 50:
				   case 65:
				   case 70:
				   case 75:
				   case 80:
					   S2Data.PsrIconColor = sap.ui.core.IconColor.Critical;
					   break;
				   default:
					   S2Data.PsrIconColor = sap.ui.core.IconColor.Default;
				       break;
				}
				switch (parseInt(OppGenInfoModel.CbcStatus)) {
					case 530:
					case 540:
					case 560:
						S2Data.CbcIconColor = sap.ui.core.IconColor.Positive;
						break;
					case 500:
					case 505:
					case 510:
					case 520:
					case 525:
					case 527:
						S2Data.CbcIconColor = sap.ui.core.IconColor.Critical;
						break;
					default:
						S2Data.CbcIconColor = sap.ui.core.IconColor.Default;
					    break;
				}
				switch (parseInt(OppGenInfoModel.CarmStatus)) {
				     case 96:
				     case 97:
				    	 S2Data.CarmIconColor = sap.ui.core.IconColor.Positive;
				    	 break;
					 case 95:
						 S2Data.CarmIconColor = sap.ui.core.IconColor.Critical;
						 break;
					 default:
						 S2Data.CarmIconColor = sap.ui.core.IconColor.Default;
					     break;
				}
				switch (parseInt(OppGenInfoModel.EsaStatus)) {
				     case 5:
				     case 10:
				     case 35:
				    	 S2Data.EsaIconColor = sap.ui.core.IconColor.Critical;
				    	 break;
				     case 20:
				     case 40:
				    	 S2Data.EsaIconColor = sap.ui.core.IconColor.Negative;
				    	 break;
				     case 30:
				     case 50:
				     case 95:
				    	 S2Data.EsaIconColor = sap.ui.core.IconColor.Positive;
				    	 break;
				     default: S2Data.EsaIconColor = sap.ui.core.IconColor.Default;
				         break;
			 }
			},
			/**
			 * This method Handles Recreate Button Press Event.
			 * @name onResetProcess
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onResetProcess: function(oEvent) {
				that_disp_psrra.getController().onResetProcess(oEvent);
			},
			/**
			 * This method Handles Message Pop-over Event.
			 * @name handleMessagePopoverPress
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			handleMessagePopoverPress: function(oEvent) {
				if (this.getView().getModel().getProperty("/S4IcntabselKey") === this.getResourceBundle().getText("S2PSRSDAICONTABFTEXT")) {
					that_disp_psrra.getController().oMessagePopover.openBy(oEvent.getSource());
				}
			},
			/**
			 * This method Handles Approver Confirmation Fragment OK button Event.
			 * @name onWFPress
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onWFPress: function(oEvent){
				var oResource = this.getResourceBundle();
				switch (this.getView().getModel().getProperty("/S4IcntabselKey")){
				   case oResource.getText("S2ICONTABCBCTXT"):
					   that_dis_cbc.getController().onWFPress(oEvent);
				       break;
				   case oResource.getText("S2ICONTABPSRSDAKEY"):
					   that_disp_psrra.getController().onWFPress(oEvent);
			           break;
				}
				
			},
			/**
			 * This method Handles Approver Confirmation Fragment Cancel button Event.
			 * @name onCancelWFPress
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onCancelWFPress: function(oEvent){
				var oResource = this.getResourceBundle();
				switch (this.getView().getModel().getProperty("/S4IcntabselKey")){
				   case oResource.getText("S2ICONTABCBCTXT"):
					   that_dis_cbc.getController().onCancelWFPress(oEvent);
				       break;
				   case oResource.getText("S2ICONTABPSRSDAKEY"):
					   that_disp_psrra.getController().onCancelWFPress(oEvent);
			           break;
				}
			},
			/**
			 * This method Handles Approve Button Event.
			 * @name onApprovePSRSDA
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onApprovePSRSDA: function(oEvent) {
				var oResource = this.getResourceBundle();
				switch (this.getView().getModel().getProperty("/S4IcntabselKey")){
				case oResource.getText("S1ESAIDSPROSTYPTXT"):
					that_dis_esa.getController().onESAApprove(oEvent);
				    break;
				case oResource.getText("S2ICONTABCBCTXT"):
					that_dis_cbc.getController().onCBCApprove(oEvent);
				    break;
				case oResource.getText("S2ICONTABPSRSDAKEY"):
					that_disp_psrra.getController().onRraApprove(oEvent);
			        break;
				}
			},
			/**
			 * This method Handles Cancel ESA Button Press Event.
			 * @name onESACancelProcess
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onESACancelProcess: function(oEvent){
				that_dis_esa.getController().onESACancelProcess(oEvent);
			},
			/**
			 * This method Handles ESA Recreate Button Press Event.
			 * @name onESAResetProcess
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onESAResetProcess: function(oEvent){
				that_dis_esa.getController().onESAResetProcess(oEvent);
			},
			/**
			 * This method Handles CBC Recreate Button Press Event.
			 * @name onCBCResetProcess
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			onCBCResetProcess: function(oEvent){
				that_dis_cbc.getController().onCBCResetProcess(oEvent);
			},
			/**
			 * This method Handles Icon Tab Bar Button Press Event.
			 * @name ondisSelectedTab
			 * @param {sap.ui.base.Event} oEvent - Holds the current event
			 * @returns
			 */
			ondisSelectedTab:function(oEvent){
				var oResource = this.getResourceBundle();
				that_S4.setHeaderData(oResource, oEvent.getSource().getSelectedKey());
				switch (oEvent.getSource().getSelectedKey()){
				case oResource.getText("S2ICONTABATTCHKEY"):
					that_attachment.getController().onExpBookDoc();
				    break;
				case oResource.getText("S2ICONTABCARMKEY"):
				    that_carm.getController().checkCarmInitiate();
				    break;
				case oResource.getText("S2ICONTABPSRSDAKEY"):
					that_disp_psrra.getController().onLoadPrraData();
				    break;
				case oResource.getText("S1ESAIDSPROSTYPTXT"):
					that_dis_esa.getController().onLoadEsa();
				    break;
				case oResource.getText("S2ICONTABCBCTXT"):
					that_dis_cbc.getController().onLoadCBC();
				    break;
				case oResource.getText("S2ICONTABMLITEXT"):
					that_mli.getController().getMliData();
				    break;
				}				
			},
			/**
			 * This is Life-cycle method Calls After View have Rendered.
			 * @name onAfterRendering
			 * @param
			 * @returns
			 */
			onAfterRendering: function() {
				sap.ui.core.BusyIndicator.hide();
				this._initiateControllerObjects();
				var oResource = this.getResourceBundle();
				if (this.oArgs !== undefined) {
					this.getOwnerComponent().Guid = this.oArgs.Guid;
					this.getOwnerComponent().ItemGuid = this.oArgs.ItemGuid;
					switch (this.oArgs.Type) {
						case oResource.getText("S2PSRDCRRATXTASC606"):
						case oResource.getText("S2ICONTABPSRTEXT"):
							 this.getView().byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).setSelectedKey(oResource.getText("S2ICONTABPSRSDAKEY"));
						     that_disp_psrra.getController().onLoadPrraData();
							break;
						case oResource.getText("S2ICONTABCBCTXT"):
							this.getView().byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).setSelectedKey(oResource.getText("S2ICONTABCBCTXT"));
						    that_dis_cbc.getController().onLoadCBC(this.oArgs.VerNo);
							break;
						case oResource.getText("S2MLIMCOMMDATATYP"):
							this.getView().byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).setSelectedKey(oResource.getText("S2ICONTABCARMKEY"));
						    this.getOwnerComponent().OppType = this.getOwnerComponent().OppType === undefined ? oResource.getText("S4DISOPPTYPTXT") : "";
					        that_carm.getController().checkCarmInitiate();
							break;
						case oResource.getText("S1ESAIDSPROSTYPTXT"):
							this.getView().byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).setSelectedKey(oResource.getText("S1ESAIDSPROSTYPTXT"));
						    that_dis_esa.getController().onLoadEsa(this.oArgs.VerNo);
							break;
					}
				}
			},
			/**
			 * This is method Handles Notify Approvers Button Press Event.
			 * @name onRemindMailProcess
			 * @param
			 * @returns
			 */
			onRemindMailProcess: function(){
				var oResource = this.getResourceBundle(),
				    procType = this.getView().byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).getSelectedKey() === oResource.getText("S2ICONTABPSRSDAKEY") ?
						   oResource.getText("S2PSRDCRRATXTASC606") :  this.getView().byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).getSelectedKey(),
					sValidate = oResource.getText("S4DISRRANOTPTH") + this.getOwnerComponent().ItemGuid + oResource.getText("S4DISRRANOTPTH1") +
				           procType + oResource.getText("S4DISRRATCHPTH6");
                this.serviceDisCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", oResource.getText("S4DISNOTIFYMSG"));
			},
			/**
			 * This is method used to refresh General Info Model.
			 * @name getRefereshGenInfoData
			 * @param
			 * @returns
			 */
			getRefereshGenInfoData: function(){
				var oResource = this.getResourceBundle(),
				    sValidate = oResource.getText("S4DISRRGENIFOPTH") + this.getOwnerComponent().Guid + oResource.getText("S4DISRRATCHPTH2") +
				           this.getOwnerComponent().ItemGuid + oResource.getText("S4DISRRGENIFOPTH1");
                this.serviceDisCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
			}
		});
});