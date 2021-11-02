/**
 * This class holds all methods of common page.
 *
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends com.amat.crm.opportunity.controller.BaseController
 * @name com.amat.crm.opportunity.controller.common
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
 * 19/07/2018      Abhishek        PCR018375         PSR/CBC Workflow Rejection   *
 *                 Pant                              (restart) Capability         *
 * 20/08/2018      Abhishek        PCR019492         ASC606 UI Changes            *
 *                 Pant                                                           *
 * 25/02/2019      Abhishek        PCR022669         Q2C Q2 UI Changes            *
 *                 Pant                                                           *
 * 17/06/2019      Abhishek        PCR023905         Migrate ESA/IDS db from Lotus*
 *                 Pant                              Notes to SAP Fiori Q2C       *
 *                                                   Application                  *
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 * 06/04/2021      Arun Jacob      PCR034716         Q2C ESA,PSR Enhancements     *
 ***********************************************************************************
 */
sap.ui.define(["com/amat/crm/opportunity/controller/BaseController"], function(Controller) {
	"use strict";
	var that_views2,
		that_general,
		that_pdcsda,
		that_psrsda,
		that_carm,
		that_attachment,
		that_cbc;
	return Controller.extend("com.amat.crm.opportunity.controller.CommonController", {
		/**
		 * This method used Initialize Global controller variables.
		 * 
		 * @name _initiateControllerObjects
		 * @param 
		 * @returns 
		 */
		_initiateControllerObjects: function(thisCntrlr) {
			this.oMyOppModel = new com.amat.crm.opportunity.model.models(thisCntrlr);
			var oComp = thisCntrlr.getOwnerComponent();
			if (that_views2 === undefined) {
				that_views2 = oComp.s2;
			}
			if (that_general === undefined) {
				that_general = oComp.general;
			}
			if (that_pdcsda === undefined) {
				that_pdcsda = oComp.pdcsda;
			}
			if (that_psrsda === undefined) {
				that_psrsda = oComp.psrsda;
			}
			if (that_carm === undefined) {
				that_carm = oComp.carm;
			}
			if (that_attachment === undefined) {
				that_attachment = oComp.attachment;
			}
			if (that_cbc === undefined) {
				that_cbc = oComp.cbc;
			}
		},
		/**
		 * This method used for OK button press on contact fragment on PSR and PDC process.
		 * 
		 * @name commonContactOkPressed
		 * @param evt - Holds the current event, thisCntrlr - Current Controller
		 * @returns 
		 */
		commonContactOkPressed: function(evt, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var GenInfoData = sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData();
			var validContact = false, addedUser;
			for (var i = 0; i < evt.getSource().getParent().getContent()[0].mAggregations.items.length; i++) {
				if (evt.getSource().getParent().getContent()[0].mAggregations.items[i].getCells()[0].getSelected() ===
					true) {
					addedUser = evt.getSource().getParent().getContent()[0].mAggregations.items[i].getCells()[3].getText();
					validContact = true;
				}
			}
			if (validContact === false) {
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2GENCONTCTSLECFAILMSG"));
			} else {
				sap.ui.core.BusyIndicator.show();
				var contactSet = [],
				oResource = thisCntrlr.getResourceBundle();                                                                                                                          //PCR034716++
				for (var i = 0; i < evt.getSource().getParent().getContent()[0].mAggregations.items.length; i++) {
					if (evt.getSource().getParent().getContent()[0].mAggregations.items[i].getCells()[0].getSelected() ===
						true) {
						var oEntry = {
							Guid: GenInfoData.Guid,
							ItemGuid: GenInfoData.ItemGuid,
							ContactType: thisCntrlr.contactType,
							ContactVal: evt.getSource().getParent().getContent()[0].mAggregations.items[i].getCells()[3].getText(),
							OppId: thisCntrlr.that_views2.getController().OppId,
							ItemNo: thisCntrlr.that_views2.getController().ItemNo,
							DelFlag: ""
						};
						//***********Start Of PCR034716++: Q2C ESA,PSR Enhancements**************
						if(thisCntrlr.contactType === oResource.getText("S2GINFOPANLCONINFOROMTIT") || oResource.getText("S2SLSKEY") || oResource.getText("S2PSRWFAPPPANLBMOINFOCONTIT")){
							var esaEntry = JSON.parse(JSON.stringify(oEntry));
							esaEntry.ContactType = oResource.getText("S1ESAIDSPROSTYPTXT")+thisCntrlr.contactType;
							contactSet.push(this.oMyOppModel._oDataModel.createBatchOperation(thisCntrlr.getResourceBundle().getText(
							"S2CBCPSRCARMCONTACTCREATENTYSET"), "POST", esaEntry, null));
						}
						//***********End Of PCR034716++: Q2C ESA,PSR Enhancements****************
						contactSet.push(this.oMyOppModel._oDataModel.createBatchOperation(thisCntrlr.getResourceBundle().getText(
							"S2CBCPSRCARMCONTACTCREATENTYSET"), "POST", oEntry, null));
					}
				}
				this.oMyOppModel._oDataModel.addBatchChangeOperations(contactSet);
				this.oMyOppModel._oDataModel.submitBatch(jQuery.proxy(function(oResponses) {
					thisCntrlr.contactSucess(thisCntrlr.getResourceBundle().getText("S2CONTCTSCCESSMSGTXT"));
					sap.ui.core.BusyIndicator.hide();
				}, this), jQuery.proxy(function(oError) {
					sap.ui.core.BusyIndicator.hide();
				}, this));
			}
		},
		/**
		 * This method used for Add Contact button press event.
		 * 
		 * @name commonPressAddContact
		 * @param evt - Holds the current event, thisCntrlr - Current Controller
		 * @returns 
		 */
		commonPressAddContact: function(evt, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var oResource = thisCntrlr.getResourceBundle();
			if (sap.ui.getCore().getModel(oResource.getText("GLBSECURITYMODEL")).getData().AddContact !==
				oResource.getText("S1TABLESALESTAGECOL")) {
				thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCAUTHCHECKFAILMSG"));
			} else {
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() == oResource.getText(
						"S2CBCTABTXT")) {
					switch (evt.getSource().getParent().getContent()[0].getText()) {
						case oResource.getText("S2GINFOPANLCONINFOROMTIT"):
								thisCntrlr.contactType = oResource.getText("S2CBCROMKEY");
								break;
						case oResource.getText("S2GINFOPANLCONINFOPOMTIT"):
								thisCntrlr.contactType = oResource.getText("S2CBCPOMKEY");
								break;
						case oResource.getText("S2GINFOPANLCONINFOBMOTIT"):
								thisCntrlr.contactType = oResource.getText("S2CBCBOMKEY");
								break;
						case oResource.getText("S2CBCWFAPPPANLATHSALEINFOCONTIT"):
								thisCntrlr.contactType = oResource.getText("S2CBCASAKEY");
								break;
					}
				//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.getResourceBundle().getText("S1ESAIDSPROSTYPTXT")){
					switch (evt.getSource().getParent().getContent()[0].getText()) {
					case oResource.getText("S2GINFOPANLCONINFOROMTIT"):
							thisCntrlr.contactType = "ESAROM";
							break;
					case oResource.getText("S2GINFOPANLCONINFOPOMTIT"):
							thisCntrlr.contactType = "ESAPOM";
							break;
					case oResource.getText("S2GINFOPANLCONINFOBMOTIT"):
							thisCntrlr.contactType = "ESABMO";
							break;
					case oResource.getText("S2GINFOPANLCONINFOBMHEADTIT"):
							thisCntrlr.contactType = "ESABM";
							break;
					case oResource.getText("S2GINFOPANLCONINFOCONTIT"):
						    thisCntrlr.contactType = "ESACON";
						    break;
					case oResource.getText("S2ESAIDSACCGMTITTXT"):
						    thisCntrlr.contactType = "ESAAGM";
						    break;
					case oResource.getText("S2PSRSDASALESPERSON"):
						    thisCntrlr.contactType = "ESASLS";
						    break;
					case oResource.getText("S2ESAIDSCONINFOSCFOTIT"):
						    thisCntrlr.contactType = "ESASCFO";
						    break;
					case oResource.getText("S2ESAIDSCONINFOGCCTIT"):
						    thisCntrlr.contactType = "ESAGC";
						    break;
					case oResource.getText("S2ESAIDSCONINFORSKMGTTIT"):
					        thisCntrlr.contactType = "ESARM";
					        break;
					case oResource.getText("S2ESAIDSCONINFOORCATIT"):
					        thisCntrlr.contactType = "ESAORCA";
					        break;
					case oResource.getText("S2ESAIDSCONINFOBUGMTIT"):
						    thisCntrlr.contactType = "ESABUGM";
				            break;
				}
			   //***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App*****************
				} else {
					switch (evt.getSource().getParent().getContent()[0].getText()) {
						case oResource.getText("S2GINFOPANLCONINFOROMTIT"):
								thisCntrlr.contactType = oResource.getText("S2GINFOPANLCONINFOROMTIT");
								break;
						case oResource.getText("S2CBCAUTHSALE"):
								thisCntrlr.contactType = oResource.getText("S2CBCASA");
								break;
						case oResource.getText("S2GINFOPANLCONINFOPOMTIT"):
								thisCntrlr.contactType = oResource.getText("S2GINFOPANLCONINFOPOMTIT");
								break;
						case oResource.getText("S2PSRWFAPPPANLBMHDINFOCONTIT"):
								thisCntrlr.contactType = oResource.getText("S2BMKEY");
								break;
						case oResource.getText("S2GINFOPANLCONINFOSALTIT"):
								thisCntrlr.contactType = oResource.getText("S2SLSKEY");
								break;
						case oResource.getText("S2PSRSDASALESPERSON"):
								thisCntrlr.contactType = oResource.getText("S2SLSKEY");
								break;
						case oResource.getText("S2GINFOPANLCONINFOBMOTIT"):
								thisCntrlr.contactType = oResource.getText("S2PSRWFAPPPANLBMOINFOCONTIT");
								break;
						case oResource.getText("S2GINFOPANLCONINFOBLHEADTIT"):
								thisCntrlr.contactType = oResource.getText("S2PLKEY");
								break;
						case oResource.getText("S2GINFOPANLCONINFOACCSMETIT"):
								thisCntrlr.contactType = oResource.getText("S2ASMKEY");
								break;
						case oResource.getText("S2GINFOPANLCONINFOPMTIT"):
								thisCntrlr.contactType = oResource.getText("S2GINFOPANLCONINFOPMTIT");
								break;
						case oResource.getText("S2PSRWFAPPPANLGPMINFOCONTIT"):
								thisCntrlr.contactType = oResource.getText("S2PSRWFAPPPANLGPMINFOCONTIT");
								break;
						case oResource.getText("S2PSRWFAPPPANLTPSINFOCONTIT"):
								thisCntrlr.contactType = oResource.getText("S2TPSKEY");
								break;
						case oResource.getText("S2PSRSDABUSME"):
								thisCntrlr.contactType = oResource.getText("S2BSMKEY");
								break;
						case oResource.getText("S2GINFOPANLCONINFOCONTIT"):
								thisCntrlr.contactType = oResource.getText("S2CONKEY");
								break;
						case oResource.getText("S2PDCCONINFOGSM"):
								thisCntrlr.contactType = oResource.getText("S2PDCCONINFOGSM");
								break;
						case oResource.getText("S2PDCCONINFORBM"):
								thisCntrlr.contactType = oResource.getText("S2PDCCONINFORBM");
								break;
					}
				}
				thisCntrlr.contactF4Fragment = sap.ui.xmlfragment(oResource.getText("PSRSDACBCADDCONTCTDIALOG"), thisCntrlr);
				thisCntrlr.getView().addDependent(thisCntrlr.contactF4Fragment);
				var sContact = "Search_contactSet?$filter=NameLast eq '" + thisCntrlr.contactType + "'";
				thisCntrlr.serviceCall(sContact, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				thisCntrlr.contactData = sap.ui.getCore().getModel(oResource.getText("GLBCONTACTMODEL")).getData().results;
				thisCntrlr.contactF4Fragment.setModel(new sap.ui.model.json.JSONModel(), oResource.getText(
					"S2PSRCBCATTDFTJSONMDLTXT"));
				thisCntrlr.contactF4Fragment.getModel(oResource.getText("S2PSRCBCATTDFTJSONMDLTXT")).setData({
					"ItemSet": thisCntrlr.contactData
				});
				thisCntrlr.contactF4Fragment.open();
			}
		},
		/**
		 * This method used for Add Contact button press event.
		 * 
		 * @name commonContactSuccess
		 * @param Msg - Message, thisCntrlr - Current Controller
		 * @returns 
		 */
		commonContactSuccess: function(Msg, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var data;
			var OppGenInfoModel = sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
			var Guid = OppGenInfoModel.getData().Guid;
			var ItemGuid = OppGenInfoModel.getData()
				.ItemGuid;
			var sValidate = "ContactInfoSet?$filter=Guid eq guid'" + sap.ui.getCore().getModel(thisCntrlr.getResourceBundle()
					.getText("GLBOPPGENINFOMODEL")).getData().Guid + "' and ItemGuid eq guid'" + sap.ui.getCore().getModel(
					thisCntrlr.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData().ItemGuid +
				"' and ContactType eq '" + thisCntrlr.contactType + "' and ContName eq '" +
				OppGenInfoModel.getData().ProductLine.replace('&', '-') + "'";
			this.oMyOppModel._oDataModel.read(sValidate, null, null, true, function(oData, oResponse) {
				data = oData;
				switch (thisCntrlr.contactType) {
					case thisCntrlr.getResourceBundle().getText("S2GINFOPANLCONINFOROMTIT"):
						{
							that_general.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_ROMLST, com.amat
								.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_ROMLSTEMP, data);
							that_psrsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_9,
								com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_TEMPLATE_9, data);
							that_cbc.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_ROM_LIST,
								com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_ROM_LIST_TEMPLATE, data);
							that_pdcsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ROM,
								com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_9, data);
							thisCntrlr.refreshModel();
							if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr
								.getResourceBundle().getText("S2ICONTABPDCSDAKEY")) {
								that_pdcsda.getController().checkPDCInitiate();
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_pdcsda.getController().onEditPDCSDA();
								thisCntrlr.showToastMessage(Msg);
							} else {
								that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_psrsda.getController().onEditPSRSDA();
								thisCntrlr.showToastMessage(Msg);
							}
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2GINFOPANLCONINFOPOMTIT"):
						{
							that_general.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_POMLST, com.amat
								.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_POMLSTEMP, data);
							that_pdcsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_POM_LIST,
								com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_15, data);
							that_psrsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_POMLIST,
								com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_POMLIST_TEMPLATE, data);
							thisCntrlr.refreshModel();
							if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr
								.getResourceBundle().getText("S2ICONTABPDCSDAKEY")) {
								that_pdcsda.getController().checkPDCInitiate();
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_pdcsda.getController().onEditPDCSDA();
								thisCntrlr.showToastMessage(Msg);
							} else {
								that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_psrsda.getController().onEditPSRSDA();
								thisCntrlr.showToastMessage(Msg);
							}
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2CBCASA"):
						{
							that_cbc.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_LIST,
								com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_LIST_TEMPLATE, data);
							thisCntrlr.refreshModel();
							that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITBTNTXT"));
							that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITICON"));
							that_cbc.getController().onEditCBC();
							thisCntrlr.showToastMessage(Msg);
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2BMKEY"):
						{
							that_general.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLST,
								com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLSTEMP, data);
							that_psrsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_12,
								com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_TEMPLATE_12, data);
							thisCntrlr.refreshModel();
							if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr
								.getResourceBundle().getText("S2ICONTABPDCSDAKEY")) {
								that_pdcsda.getController().checkPDCInitiate();
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_pdcsda.getController().onEditPDCSDA();
								thisCntrlr.showToastMessage(Msg);
							} else {
								that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_psrsda.getController().onEditPSRSDA();
								thisCntrlr.showToastMessage(Msg);
							}
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2SLSKEY"):
						{
							that_psrsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_10,
								com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_TEMPLATE_10, data);
							that_general.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_SALSLST, com
								.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_SALSLSTEMP, data);
							that_pdcsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SALES_LIST,
								com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_10, data);
							thisCntrlr.refreshModel();
							if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr
								.getResourceBundle().getText("S2ICONTABPDCSDAKEY")) {
								that_pdcsda.getController().checkPDCInitiate();
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_pdcsda.getController().onEditPDCSDA();
								thisCntrlr.showToastMessage(Msg);
							} else {
								that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_psrsda.getController().onEditPSRSDA();
								thisCntrlr.showToastMessage(Msg);
							}
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2PSRWFAPPPANLBMOINFOCONTIT"):
						{
							that_general.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMOLST, com.amat
								.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMOLSTEMP, data);
							that_psrsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_15,
								com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_TEMPLATE_15, data);
							that_pdcsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BMO_LIST,
								com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_16, data);
							thisCntrlr.refreshModel();
							if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr
								.getResourceBundle().getText("S2ICONTABPDCSDAKEY")) {
								that_pdcsda.getController().checkPDCInitiate();
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_pdcsda.getController().onEditPDCSDA();
								thisCntrlr.showToastMessage(Msg);
							} else {
								that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_psrsda.getController().onEditPSRSDA();
								thisCntrlr.showToastMessage(Msg);
							}
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2PLKEY"):
						{
							that_general.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_PLHEADLST,
								com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_PLHEADLSTEMP, data);
							that_psrsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_14,
								com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_TEMPLATE_14, data);
							that_pdcsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_PLHEAD_LIST,
								com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_13, data);
							thisCntrlr.refreshModel();
							if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr
								.getResourceBundle().getText("S2ICONTABPDCSDAKEY")) {
								that_pdcsda.getController().checkPDCInitiate();
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_pdcsda.getController().onEditPDCSDA();
								thisCntrlr.showToastMessage(Msg);
							} else {
								that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_psrsda.getController().onEditPSRSDA();
								thisCntrlr.showToastMessage(Msg);
							}
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2ASMKEY"):
						{
							that_general.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_ASMEHEADLST,
								com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_ASMEHEADLSTEMP, data);
							that_psrsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_11,
								com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_TEMPLATE_11, data);
							that_pdcsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_ASME_LIST,
								com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_11, data);
							thisCntrlr.refreshModel();
							if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr
								.getResourceBundle().getText("S2ICONTABPDCSDAKEY")) {
								that_pdcsda.getController().checkPDCInitiate();
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_pdcsda.getController().onEditPDCSDA();
								thisCntrlr.showToastMessage(Msg);
							} else {
								that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_psrsda.getController().onEditPSRSDA();
								thisCntrlr.showToastMessage(Msg);
							}
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2GINFOPANLCONINFOPMTIT"):
						{
							thisCntrlr.refreshModel();
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2PSRWFAPPPANLGPMINFOCONTIT"):
						{
							that_psrsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_16,
								com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_TEMPLATE_16, data);
							that_general.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_GPMLST, com.amat
								.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_GPMLSTEMP, data);
							thisCntrlr.refreshModel();
							if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr
								.getResourceBundle().getText("S2ICONTABPDCSDAKEY")) {
								that_pdcsda.getController().checkPDCInitiate();
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_pdcsda.getController().onEditPDCSDA();
								thisCntrlr.showToastMessage(Msg);
							} else {
								that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_psrsda.getController().onEditPSRSDA();
								thisCntrlr.showToastMessage(Msg);
							}
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2TPSKEY"):
						{
							that_psrsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_17,
								com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_TEMPLATE_17, data);
							that_general.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_TPSLST, com.amat
								.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_TPSLSTEMP, data);
							thisCntrlr.refreshModel();
							that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITBTNTXT"));
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITICON"));
							that_psrsda.getController().onEditPSRSDA();
							thisCntrlr.showToastMessage(Msg);
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2BSMKEY"):
						{
							that_psrsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_18,
								com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_TEMPLATE_18, data);
							that_general.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BUSMELST,
								com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BUSMELSTEMP, data);
							that_pdcsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_BUSME_LIST,
								com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_17, data);
							thisCntrlr.refreshModel();
							that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITBTNTXT"));
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITICON"));
							that_psrsda.getController().onEditPSRSDA();
							thisCntrlr.showToastMessage(Msg);
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2CONKEY"):
						{
							that_general.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_CONLST, com.amat
								.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_CONLSTEMP, data);
							that_psrsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_13,
								com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_LIST_TEMPLATE_13, data);
							that_pdcsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CON_LIST,
								com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_14, data);
							thisCntrlr.refreshModel();
							if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr
								.getResourceBundle().getText("S2ICONTABPDCSDAKEY")) {
								that_pdcsda.getController().checkPDCInitiate();
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_pdcsda.getController().onEditPDCSDA();
								thisCntrlr.showToastMessage(Msg);
							} else {
								that_psrsda.getController().getRefreshPSRData(Guid, ItemGuid);
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITBTNTXT"));
								that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
									.getText("S2PSRSDAEDITICON"));
								that_psrsda.getController().onEditPSRSDA();
								thisCntrlr.showToastMessage(Msg);
							}
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RESET).setVisible(false);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2CBCROMKEY"):
						{
							that_cbc.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POM_LIST,
								com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POM_LIST_TEMPLATE, data);
							thisCntrlr.getRefreshCBCData(sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText(
								"GLBOPPGENINFOMODEL")).getData().Guid, sap.ui.getCore().getModel(thisCntrlr.getResourceBundle()
								.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid);
							thisCntrlr.refreshModel();
							that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITBTNTXT"));
							that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITICON"));
							that_cbc.getController().onEditCBC();
							thisCntrlr.showToastMessage(Msg);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							var romInitiateFlag = thisCntrlr.checkCBCUsersfromlist();
							(romInitiateFlag === true) ? (that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn)
								.setText(thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT")), that_cbc.getController()
								.onEditCBC(), that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setEnabled(
									true)) : (that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(
								thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT")), that_cbc.byId(com.amat
								.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setEnable(false));
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2CBCPOMKEY"):
						{
							that_cbc.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POM_LIST,
								com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_POM_LIST_TEMPLATE, data);
							thisCntrlr.getRefreshCBCData(sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText(
								"GLBOPPGENINFOMODEL")).getData().Guid, sap.ui.getCore().getModel(thisCntrlr.getResourceBundle()
								.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid);
							thisCntrlr.refreshModel();
							that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITBTNTXT"));
							that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITICON"));
							that_cbc.getController().onEditCBC();
							thisCntrlr.showToastMessage(Msg);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							var romInitiateFlag = thisCntrlr.checkCBCUsersfromlist();
							(romInitiateFlag === true) ? (that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn)
								.setText(thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT")), that_cbc.getController()
								.onEditCBC(), that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setEnable(
									true)) : (that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(
								thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT")), that_cbc.byId(com.amat
								.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setEnable(false));
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2CBCASAKEY"):
						{
							that_cbc.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_LIST,
								com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_AUTH_SALEApr_LIST_TEMPLATE, data);
							thisCntrlr.getRefreshCBCData(sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText(
								"GLBOPPGENINFOMODEL")).getData().Guid, sap.ui.getCore().getModel(thisCntrlr.getResourceBundle()
								.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid);
							thisCntrlr.refreshModel();
							that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITBTNTXT"));
							that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITICON"));
							that_cbc.getController().onEditCBC();
							thisCntrlr.showToastMessage(Msg);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							var romInitiateFlag = thisCntrlr.checkCBCUsersfromlist();
							(romInitiateFlag === true) ? (that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn)
								.setText(thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT")), that_cbc.getController()
								.onEditCBC(), that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setEnable(
									true)) : (that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(
								thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT")), that_cbc.byId(com.amat
								.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setEnable(false));
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2CBCBOMKEY"):
						{
							that_cbc.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_BOM_LIST,
								com.amat.crm.opportunity.Ids.S2CBC_PANL_CONTACTINFO_BOM_LIST_TEMPLATE, data);
							thisCntrlr.getRefreshCBCData(sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText(
								"GLBOPPGENINFOMODEL")).getData().Guid, sap.ui.getCore().getModel(thisCntrlr.getResourceBundle()
								.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid);
							thisCntrlr.refreshModel();
							that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITBTNTXT"));
							that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITICON"));
							that_cbc.getController().onEditCBC();
							thisCntrlr.showToastMessage(Msg);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							var romInitiateFlag = thisCntrlr.checkCBCUsersfromlist();
							(romInitiateFlag === true) ? (that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn)
								.setText(thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT")), that_cbc.getController()
								.onEditCBC(), that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setEnable(
									true)) : (that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setText(
								thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT")), that_cbc.byId(com.amat
								.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setEnable(false));
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2PDCCONINFOGSM"):
						{
							that_pdcsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_GSM_LIST,
								com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_18, data);
							that_general.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_GPMLST, com.amat.crm.opportunity
								.Ids.S2GINFO_PANL_CONTACTINFO_GPMLSTEMP, data);
							thisCntrlr.refreshModel();
							that_pdcsda.getController().checkPDCInitiate();
							that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITBTNTXT"));
							that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITICON"));
							that_pdcsda.getController().onEditPDCSDA();
							if (thisCntrlr.that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.getResourceBundle()
								.getText("S2ICONTABDEFAULTKEY")) {
								thisCntrlr.that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false);
								thisCntrlr.that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false);
							}
							thisCntrlr.showToastMessage(Msg);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					case thisCntrlr.getResourceBundle().getText("S2PDCCONINFORBM"):
						{
							that_pdcsda.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_RBM_LIST,
								com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_LIST_TEMPLATE_12, data);
							that_general.getController().fnContactInfo(com.amat.crm.opportunity.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLST, com.amat.crm.opportunity
								.Ids.S2GINFO_PANL_CONTACTINFO_BMHEADLSTEMP, data);
							thisCntrlr.refreshModel();
							that_pdcsda.getController().checkPDCInitiate();
							that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITBTNTXT"));
							that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(thisCntrlr.getResourceBundle()
								.getText("S2PSRSDAEDITICON"));
							that_pdcsda.getController().onEditPDCSDA();
							if (thisCntrlr.that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.getResourceBundle()
								.getText("S2ICONTABDEFAULTKEY")) {
								thisCntrlr.that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setVisible(false);
								thisCntrlr.that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false);
							}
							thisCntrlr.showToastMessage(Msg);
							if (thisCntrlr.contactF4Fragment !== undefined) {
								thisCntrlr.contactF4Fragment.close();
								thisCntrlr.contactF4Fragment.destroy(true);
							}
							break;
						}
					//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
					case "ESAAGM": case "ESABM": case "ESABMO": case "ESABUGM": case "ESACON": case"ESAGC": case "ESAORCA": case "ESAPOM": case "ESARM": case "ESAROM": 
					case "ESASCFO": case "ESASLS":
						{
						      var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBESADATAMODEL")).getData();
					          thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, parseInt(EsaData.VersionNo));
					          var oModel = thisCntrlr.getDataModels(), RPflag = false;
					          var esaDisModel = com.amat.crm.opportunity.model.esaDisModel;
					          var UserAuth = thisCntrlr.checkUsersfromlist();
					          var romInitiateFlag = thisCntrlr.checkContact(oModel[4].NAV_ROM.results);
					  		  var pomInitiateFlag = thisCntrlr.checkContact(oModel[4].NAV_POM.results);
					  		  RPflag = romInitiateFlag || pomInitiateFlag;
					          var EsaModel = esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.getResourceBundle().getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3], oModel[4], oModel[4].Status, UserAuth, false, RPflag);
					          thisCntrlr.setViewData(EsaModel);
					          thisCntrlr.showToastMessage(Msg);
						}
					//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App*****************
				}
				if (thisCntrlr.contactF4Fragment !== undefined) {
					thisCntrlr.contactF4Fragment.close();
					thisCntrlr.contactF4Fragment.destroy(true);
				}
			}, function(value) {});
		},
		/**
		 * This method used for delete button press event.
		 * 
		 * @name commonDelete
		 * @param evt - Holds the current event, thisCntrlr - Current Controller
		 * @returns 
		 */
		commonDelete: function(evt, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var index = evt.getParameters().listItem.getBindingContextPath().split(thisCntrlr.getResourceBundle().getText(
				"S2CBCPSRCARMSEPRATOR"))[evt.getParameters().listItem.getBindingContextPath().split(thisCntrlr.getResourceBundle()
				.getText("S2CBCPSRCARMSEPRATOR")).length - 1];
			//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
			//thisCntrlr.contactType = evt.getSource().getModel().getData().results[index].ContactType;
			var conRecord = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.getResourceBundle().getText("S1ESAIDSPROSTYPTXT") ? 
					evt.getParameters().listItem.getBindingContext().getObject() : evt.getSource().getModel().getData().results[index];
			thisCntrlr.contactType = conRecord.ContactType;
			//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
			var DelValid = true,
				DelCBCContion = "",
				DelESAContion = "",                                                                                                                                     //PCR023905++
				DelPSRContion = "";
			var GenInfoData = sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText("GLBOPPGENINFOMODEL")).getData();
			//var PSRData = sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText("GLBPSRMODEL")).getData();                                                 //PCR022669--
			//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
			//var ProcessTyp = (GenInfoData.Division === thisCntrlr.getResourceBundle().getText("S2ICONTABPDCTEXT") || GenInfoData.Division === thisCntrlr.getResourceBundle().getText("S2D3TEXT")) ? thisCntrlr.getResourceBundle().getText(   //PCR023905--
			var ProcessTyp = that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.getResourceBundle().getText(
				"S1ESAIDSPROSTYPTXT") ? thisCntrlr.getResourceBundle().getText("S1ESAIDSPROSTYPTXT") : ((GenInfoData.Division === 
				thisCntrlr.getResourceBundle().getText("S2ICONTABPDCTEXT") || GenInfoData.Division === thisCntrlr.getResourceBundle().getText("S2D3TEXT")) ? 
						thisCntrlr.getResourceBundle().getText(  
				     //"S2ICONTABPDCTEXT") : "";                                                                                                                        //PCR018375--
				     //"S2ICONTABPDCTEXT") : thisCntrlr.getResourceBundle().getText("S2ICONTABPSRTEXT") ;                                                               //PCR018375++ Condition Modified; //PCR023905--
			         "S2ICONTABPDCTEXT") : thisCntrlr.getResourceBundle().getText("S2ICONTABPSRTEXT"));                                                                 //PCR023905++ Condition Modified to support ESA
			//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
			    var PSRDelFlag = (ProcessTyp === thisCntrlr.getResourceBundle().getText("S2ICONTABPSRTEXT") && (thisCntrlr.contactType !== thisCntrlr.getResourceBundle().getText("S2GINFOPANLCONINFOROMTIT")     //PCR018375++
	                           && thisCntrlr.contactType !== thisCntrlr.getResourceBundle().getText("S2SLSKEY")                                                         //PCR018375++
	                           && thisCntrlr.contactType !== thisCntrlr.getResourceBundle().getText("S2GINFOPANLCONINFOPOMTIT")                                         //PCR018375++
	                           && thisCntrlr.contactType !== thisCntrlr.getResourceBundle().getText("S2PSRWFAPPPANLBMOINFOCONTIT")                                      //PCR018375++
	                           && thisCntrlr.contactType !== thisCntrlr.getResourceBundle().getText("S2ASMKEY")                                                         //PCR018375++
	                           && thisCntrlr.contactType !== thisCntrlr.getResourceBundle().getText("S2BSMKEY")));                                                      //PCR018375++
		    (GenInfoData.Division !== thisCntrlr.getResourceBundle().getText("S2ICONTABPDCTEXT") || GenInfoData.Division !== thisCntrlr.getResourceBundle().getText("S2D3TEXT")) ? (DelPSRContion =
			//	parseInt(PSRData.PsrStatus) >= 15) : (DelPSRContion = parseInt(PSRData.PsrStatus) >= 605);                                                              //PCR022669--
				parseInt(GenInfoData.PsrStatus) >= 15) : (DelPSRContion = parseInt(GenInfoData.PsrStatus) >= 605);                                                      //PCR022669++; PSRData replaced with GenInfoData
			(sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText("GLBCBCMODEL")) !== undefined) ? (
//				DelCBCContion = parseInt(sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText("GLBCBCMODEL")).getData().CbcStatus) >= 500) : (DelCBCContion = ""); //PCR018375--
			//	DelCBCContion = parseInt(sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText("GLBCBCMODEL")).getData().CbcStatus) >= 500  && parseInt(PSRData.CbcStatus) !== 501) : (DelCBCContion = ""); //PCR018375++ Condition Modified; PCR022669--
				DelCBCContion = parseInt(GenInfoData.CbcStatus) >= 500  && parseInt(GenInfoData.CbcStatus) !== 501) : (DelCBCContion = "");                             //PCR022669++; PSRData replaced with GenInfoData
			//if (DelPSRContion || DelCBCContion) {                                                                                                                     //PCR023905--
			if ((DelPSRContion || DelCBCContion) && ProcessTyp !== thisCntrlr.getResourceBundle().getText("S1ESAIDSPROSTYPTXT")) {                                      //PCR023905++ Condition Modified to support ESA
				if (evt.getSource().getModel().getData().results.length === 1) {
					thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCCONTACTDELNEGMSG"));
					DelValid = false;
				}
			}
			if (DelValid === true) {
				//if (evt.getSource().getModel().getData().results[index].ContFrom === "L" && ProcessTyp !== thisCntrlr.getResourceBundle().getText(                 //PCR023905--
				if ((conRecord.ContFrom === "L" && (ProcessTyp !== thisCntrlr.getResourceBundle().getText(                                                            //PCR023905++
//					"S2ICONTABPDCTEXT")) {                                                                                                                           //PCR018375--
				    //"S2ICONTABPDCTEXT")  && PSRDelFlag) {                                                                                                          //PCR018375++ Condition Modified
				    "S2ICONTABPDCTEXT")  && PSRDelFlag)) ||(conRecord.ContFrom === "L" && ProcessTyp === thisCntrlr.getResourceBundle().getText("S1ESAIDSPROSTYPTXT"))) { //PCR023905++ Condition Modified to support ESA
					thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCCONTACTDELNEGLOOKUPMSG"));
				} else {
					if (sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText("GLBSECURITYMODEL")).getData().DelContact !==
						thisCntrlr.getResourceBundle().getText("S1TABLESALESTAGECOL")) {
						thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCAUTHCHECKFAILMSG"));
					} else {
						sap.ui.core.BusyIndicator.show();
						var Guid = GenInfoData.Guid;
						var ItemGuid = GenInfoData.ItemGuid;
						var sDelete = this.oMyOppModel._oDataModel.sServiceUrl + "/Create_ContactSet(Guid=guid'" + Guid + "',ItemGuid=guid'" + ItemGuid +
						    //***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
							//"',ContactType='" + evt.getSource().getModel().getData().results[index].ContactType +
							//"',ContactVal='" + evt.getSource().getModel().getData().results[index].ContactVal +
						    "',ContactType='" + conRecord.ContactType +
						    "',ContactVal='" + conRecord.ContactVal +
							//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
							"',DelFlag='X')";
						var f = {
							headers: {
								"X-Requested-With": "XMLHttpRequest",
								"Content-Type": "application/atom+xml",
								DataServiceVersion: "2.0",
								"X-CSRF-Token": "Fetch"
							},
							requestUri: this.oMyOppModel._oDataModel.sServiceUrl + com.amat.crm.opportunity.util.ServiceConfigConstants.AttachmentSet,
							method: "GET"
						};
						OData.request(f, function(data, oSuccess) {
							thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
							var oHeaders = {
								"X-CSRF-Token": thisCntrlr.oToken,
							};
							/**
							 * *****************To Delete
							 * File***********************
							 */
							jQuery.ajax({
								type: 'DELETE',
								url: sDelete,
								headers: oHeaders,
								cache: false,
								processData: false,
								success: function(data) {
									thisCntrlr.contactSucess(thisCntrlr.getResourceBundle().getText(
										"S2PSRSDACBCCONCTDELSUCSSMSG"));
									sap.ui.core.BusyIndicator.hide();
								},
								error: function(data) {
									sap.ui.core.BusyIndicator.hide();
									thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText(
										"S2PSRSDACBCCONCTDELFAILMSG"));
								}
							});
						}, function(err) {});
					}
				}
			}
		},
		/**
		 * This method used for Edit press event.
		 * 
		 * @name commonEditPress
		 * @param evt - Holds the current event, thisCntrlr - Current Controller
		 * @returns 
		 */
		commonEditPress: function(evt, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			Date.prototype.yyyymmdd = function() {
				var mm = this.getMonth() + 1;
				var dd = this.getDate();
				return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
			};
			var rowIndex = evt.getSource().getParent().getParent().getParent().getId().split("-")[evt.getSource().getParent()
				.getParent().getParent().getId().split("-").length - 1];
			var oTable = evt.getSource().getParent().getParent().getParent().getParent();
			var row = evt.getSource().getParent().getParent().getParent().getCells()[2];
			var GenInfoData = sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText("GLBOPPGENINFOMODEL"));
			var Guid = GenInfoData.getData().Guid;
			var ItemGuid = GenInfoData.getData().ItemGuid;
			var DocId = oTable.getModel().getData().ItemSet[rowIndex].DocId;
			var doctype = oTable.getModel().getData().ItemSet[rowIndex].doctype;
			var docsubtype = oTable.getModel().getData().ItemSet[rowIndex].docsubtype;
			var dateData = "";
			thisCntrlr.evt = evt;
			if (evt.getSource().getParent().getParent().getParent().getCells().length > 4) {
				dateData = evt.getSource().getParent().getParent().getParent().getCells()[3].getDateValue();
				dateData = dateData === null ? "" : dateData.yyyymmdd();
			} else {
				dateData = "";
			}
			if (evt.getSource().getIcon().indexOf(thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT").toLowerCase()) >=
				0) {
				oTable.getModel().getData().ItemSet[rowIndex].editable = true;
				oTable.getModel().getData().ItemSet[rowIndex].uBvisible = false;
				oTable.mAggregations.items[rowIndex].mAggregations.cells[2].setEnabled(true);
				thisCntrlr.tempHold = "";
				thisCntrlr.tempHold = oTable.getModel().getData().ItemSet[rowIndex].note;
				evt.getSource().setIcon(thisCntrlr.getResourceBundle().getText("S2PSRSDASAVEICON"));
				evt.getSource().getParent().mAggregations.items[1].setVisible(true);
				evt.getSource().getParent().mAggregations.items[1].setIcon(thisCntrlr.getResourceBundle().getText(
					"S2PSRSDAATTCANICON"));
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
				//***********Start Of PCR026243: DL:1803 Display Migration to Q2C**************
				var customerNo = "";
				if(thisCntrlr.getOwnerComponent().OppType === thisCntrlr.getResourceBundle().getText("S4DISOPPTYPTXT")){
					customerNo = sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText("GLBATTMODEL")).getData().Custno;
				}else {
					if (sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText("GLBPSRMODEL")) !== undefined) {
						customerNo = sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText("GLBPSRMODEL")).getData()
							.Custno;
					} else {
						customerNo = sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText("GLBPDCSDAMODEL")).getData()
							.Custno;
					}
				}
				//***********End Of PCR026243: DL:1803 Display Migration to Q2C**************
				var sEdit = this.oMyOppModel._oDataModel.sServiceUrl + "/AttachmentSet(Guid=guid'" + Guid + "',ItemGuid=guid'" + ItemGuid + "',DocType='" +
					doctype + "',DocSubtype='" + docsubtype + "',DocId=guid'" + DocId + "')";
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
					MimeType: "application/msword",
					OppId: thisCntrlr.OppId,
					ItemNo: thisCntrlr.ItemNo,
					Customer: customerNo,
					Code: "",
					ExpireDate: dateData,
					UploadedBy: ""
					//UploadedDate: "0000-00-00T00:00:00"                                                                                                 //PCR035760 Defect#131 TechUpgrade changes
				};
				var that = this;
				/**
				 * **************To Fetch CSRF
				 * Token******************
				 */
				var f = {
					headers: {
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/atom+xml",
						DataServiceVersion: "2.0",
						"X-CSRF-Token": "Fetch"
					},
					requestUri: this.oMyOppModel._oDataModel.sServiceUrl + com.amat.crm.opportunity.util.ServiceConfigConstants.AttachmentSet,
					method: "GET"
				};
				var oHeaders;
				thisCntrlr.editB = evt.getSource();
				thisCntrlr.deleteB = evt.getSource().getParent().mAggregations.items[1];
				OData.request(f, function(data, oSuccess) {
					thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
					oHeaders = {
						"X-CSRF-Token": thisCntrlr.oToken,
					};
					/**
					 * *****************To
					 * Upload
					 * File***********************
					 */
					OData.request({
						requestUri: sEdit,
						method: 'PUT',
						headers: oHeaders,
						data: Data
					}, function(data, response) {
						oTable.getModel().getData().ItemSet[rowIndex].editable = true;
						oTable.mAggregations.items[rowIndex].mAggregations.cells[2].setEnabled(false);
						thisCntrlr.editB.setIcon(thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
						thisCntrlr.deleteB.setIcon(thisCntrlr.getResourceBundle().getText("S2PSRSDADELETEICON"));
						oTable.getModel().refresh(true);
						var oResource = thisCntrlr.getResourceBundle();                                                                                            //PCR026243++
						if(thisCntrlr.getOwnerComponent().OppType !== oResource.getText("S4DISOPPTYPTXT")){                                                        //PCR026243++
							if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
								thisCntrlr.getResourceBundle().getText("S2ICONTABPSRSDAKEY")) {
								var OppGenInfoModel = sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText(
									"GLBOPPGENINFOMODEL"))
								thisCntrlr.getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(
									thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(
									thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
								thisCntrlr.onEditPSRSDA();
							} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
								thisCntrlr.getResourceBundle().getText("S2ICONTABPDCSDAKEY")) {
								var OppGenInfoModel = sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText(
									"GLBOPPGENINFOMODEL"))
								thisCntrlr.getPDCData();
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(
									thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(
									thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
								thisCntrlr.onEditPDCSDA();
							} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
								thisCntrlr.getResourceBundle().getText("S2ICONTABATTCHKEY")) {
								that_attachment.getController().onExpBookDoc();
							} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
								thisCntrlr.getResourceBundle().getText("S2ICONTABCARMKEY")) {
								that_carm.getController().checkCarmInitiate();
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(
									thisCntrlr.carmDate);
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(
									false);
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(
									true);
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(
									true);
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(
									true);
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(
									true);
								var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
								for (var i = 0; i < thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE)
									.getModel().getData().ItemSet.length; i++) {
									carmTable.getModel().getData().ItemSet[i].editable = true;
									carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
								}
								carmTable.getModel().refresh(true);
							//***************Justification: PCR018375++ Phase2 - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
							} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===                                                //PCR018375++
								thisCntrlr.getResourceBundle().getText("S2CBCTABTXT")){                                                                            //PCR018375++
								that_cbc.getController().checkCBCInitiate();                                                                                       //PCR018375++
								that_cbc.getController().onExpMEADoc();                                                                                            //PCR018375++
								var CBCData = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBCBCMODEL")).getData();                        //PCR018375++
								parseInt(CBCData.CbcStatus) !== 530 && parseInt(CBCData.CbcStatus) !== 540 ? that_cbc.getController().onEditCBC(): "";             //PCR018375++
							}
						//***********Start Of PCR026243: DL:1803 Display Migration to Q2C**************
						} else {									
						    switch(thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).getSelectedKey()){
						    case oResource.getText("S2ICONTABATTCHKEY"):
						    	that_attachment.getController().onExpBookDoc();
						        break;
						    case oResource.getText("S2ICONTABCARMKEY"):
						    	that_carm.getController().checkCarmInitiate();
							    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(thisCntrlr.carmDate);
							    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(false);
							    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(true);
							    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(true);
							    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(true);
							    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
							    var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
							    for (var i = 0; i < carmTable.getModel().getData().ItemSet.length; i++) {
								   carmTable.getModel().getData().ItemSet[i].editable = true;
								   carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
							    }
							    carmTable.getModel().refresh(true);
							    thisCntrlr.onEditCarm();
						    }
						}
						//***********End Of PCR026243: DL:1803 Display Migration to Q2C**************
						
						thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText(
							"S2PSRSDACBCATTNOTESUCSSMSG"));
					}, function(data) {
						thisCntrlr.showToastMessage(JSON.parse(data.response.body).error.message.value);
						var oResource = thisCntrlr.getResourceBundle();                                                                                            //PCR026243++
						if(thisCntrlr.getOwnerComponent().OppType !== oResource.getText("S4DISOPPTYPTXT")){                                                        //PCR026243++
							if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
								thisCntrlr.getResourceBundle().getText("S2ICONTABATTCHKEY")) {
								that_attachment.getController().onExpBookDoc();
							} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
								thisCntrlr.getResourceBundle().getText("S2ICONTABCARMKEY")) {
								that_carm.getController().checkCarmInitiate();
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(
									thisCntrlr.carmDate);
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(
									false);
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(
									true);
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(
									true);
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(
									true);
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(
									true);
								var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
								for (var i = 0; i < thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE)
									.getModel().getData().ItemSet.length; i++) {
									carmTable.getModel().getData().ItemSet[i].editable = true;
									carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
								}
								carmTable.getModel().refresh(true);
							} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
								thisCntrlr.getResourceBundle().getText("S2ICONTABPDCSDAKEY")) {
								var OppGenInfoModel = sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText(
									"GLBOPPGENINFOMODEL"))
								thisCntrlr.getPDCData();
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(
									thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(
									thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
								thisCntrlr.onEditPDCSDA();
							} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
								thisCntrlr.getResourceBundle().getText("S2ICONTABPSRSDAKEY")) {
								var OppGenInfoModel = sap.ui.getCore().getModel(thisCntrlr.getResourceBundle().getText(
									"GLBOPPGENINFOMODEL"))
								thisCntrlr.getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(
									thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITBTNTXT"));
								thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(
									thisCntrlr.getResourceBundle().getText("S2PSRSDAEDITICON"));
								thisCntrlr.onEditPSRSDA();
							}
							//***********Start Of PCR026243: DL:1803 Display Migration to Q2C**************
						} else {									
						    switch(thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).getSelectedKey()){
						    case oResource.getText("S2ICONTABATTCHKEY"):
						    	that_attachment.getController().onExpBookDoc();
						        break;
						    case oResource.getText("S2ICONTABCARMKEY"):
						    	that_carm.getController().checkCarmInitiate();
							    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(thisCntrlr.carmDate);
							    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(false);
							    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(true);
							    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(true);
							    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(true);
							    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
							    var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
							    for (var i = 0; i < carmTable.getModel().getData().ItemSet.length; i++) {
								   carmTable.getModel().getData().ItemSet[i].editable = true;
								   carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
							    }
							    carmTable.getModel().refresh(true);
							    thisCntrlr.onEditCarm();
						    }
						}
						//***********End Of PCR026243: DL:1803 Display Migration to Q2C**************
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
		},
		/**
		 * This method used for Add press event.
		 * 
		 * @name commonAddPress
		 * @param evt - Holds the current event, thisCntrlr - Current Controller
		 * @returns 
		 */
		commonAddPress: function(evt, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var rowIndex = evt.getSource().getParent().getParent().getParent().getId().split("-")[evt.getSource().getParent()
				.getParent().getParent().getId().split("-").length - 1];
			var oTable = evt.getSource().getParent().getParent().getParent().getParent();
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
			var TableBContext = evt.getSource().getParent().getParent().getParent().getBindingContext()
			var ItemData = TableBContext.getModel().getData().ItemSet[TableBContext.getPath().split("/")[TableBContext.getPath().split("/").length -
				1]]
			if ((ItemData.DocDesc === thisCntrlr.getResourceBundle().getText("S2OTHDOCDES") || ItemData.DocDesc === thisCntrlr.getResourceBundle()
					.getText("S2OTHPOSTBOOKDOCDES") || ItemData.DocDesc === thisCntrlr.getResourceBundle().getText("S2AOTHERBTNTEXT")) && (ItemData.docsubtype ===
					thisCntrlr.getResourceBundle().getText("S3BDT") ||
					ItemData.docsubtype === thisCntrlr.getResourceBundle().getText("S3PBCDT") || ItemData.docsubtype === thisCntrlr.getResourceBundle()
					.getText("S3PBDT"))) {
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setEnabled(true);
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setPlaceholder(thisCntrlr.getResourceBundle().getText("S3NOTETEXT"));
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setValueState(sap.ui.core.ValueState.Warning);
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setValueStateText(thisCntrlr.getResourceBundle().getText("S3NOTEVALUETEXT"));
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[3].getItems()[1].getItems()[0].setEnabled(false);
				oTable.getItems()[parseInt(rowIndex)].getCells()[3].getItems()[0].getItems()[2].setEnabled(false);
			} else {
				var lastItem = oTable.getModel().getData().ItemSet[oTable.getModel().getData().ItemSet.length - 1];
				var CurrentLineData = "",
					totalOthRecods, temp = "";
				for (var i = 0; i <= oTable.getModel().getData().ItemSet.length - 1; i++) {
					CurrentLineData = oTable.getModel().getData().ItemSet[i];
					if (CurrentLineData.docsubtype === thisCntrlr.getResourceBundle().getText("S3BDT") || CurrentLineData.docsubtype === thisCntrlr.getResourceBundle()
						.getText("S3PBCDT") ||
						CurrentLineData.docsubtype === thisCntrlr.getResourceBundle().getText("S3PBDT")) {
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
					oTable.getItems()[oTable.getItems().length - (oTable.getItems().length - temp)].getCells()[2].setPlaceholder(thisCntrlr.getResourceBundle()
						.getText("S2ANOTEPLACEHOLDER"));
				} else {
					oTable.getItems()[oTable.getItems().length - 2].getCells()[2].setEnabled(true);
					oTable.getItems()[oTable.getItems().length - 2].getCells()[2].setValueState(sap.ui.core.ValueState.None);
					oTable.getItems()[oTable.getItems().length - 2].getCells()[2].setPlaceholder(thisCntrlr.getResourceBundle().getText(
						"S2ANOTEPLACEHOLDER"));
				}

				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[3].getItems()[1].getItems()[0].setEnabled(true);
				oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setEnabled(true);

			}
			if(thisCntrlr.getOwnerComponent().OppType !== thisCntrlr.getResourceBundle().getText("S4DISOPPTYPTXT")){                                                         //PCR026243++
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() !== thisCntrlr.getResourceBundle()
						.getText("S2ICONTABATTCHKEY")) {
					that_psrsda.getController().setTableNoteEnable(oTable);
				} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() !== thisCntrlr.getResourceBundle()
						.getText("S2ICONTABPSRTEXT")) {
					that_psrsda.getController().setTableSecurity(oTable);
				}
			}	                                                                                                                                                             //PCR026243++		
		},
		/**
		 * This method used for Delete press event.
		 * 
		 * @name commonDeletePress
		 * @param evt - Holds the current event, thisCntrlr - Current Controller
		 * @returns 
		 */
		commonDeletePress: function(event, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			if(thisCntrlr.getOwnerComponent().OppType !== thisCntrlr.getResourceBundle().getText("S4DISOPPTYPTXT")){                                                         //PCR026243++
				if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.getResourceBundle()
						.getText("S2ICONTABCARMKEY")) {
					thisCntrlr.carmDate = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).getDateValue();
				}
			//***********Start Of PCR026243: DL:1803 Display Migration to Q2C**************
			} else {
				if (thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).getSelectedKey() === thisCntrlr.getResourceBundle()
						.getText("S2ICONTABCARMKEY")) {
					thisCntrlr.carmDate = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).getDateValue();	
			    }
			}
			//***********End Of PCR026243: DL:1803 Display Migration to Q2C**************
			var rowIndex = thisCntrlr.source.getParent().getParent().getParent().getId().split("-")[thisCntrlr.source
				.getParent().getParent().getParent().getId().split("-").length - 1];
			var oTable = thisCntrlr.source.getParent().getParent().getParent().getParent();
			var tableModel = oTable.getModel().getData().ItemSet;
			thisCntrlr.tableModel = tableModel;
			var flag = 0;
			$.each(tableModel, function(key, value) {
				if (value.docsubtype === tableModel[rowIndex].docsubtype) flag++;
			});
			if (thisCntrlr.source.getIcon().indexOf(thisCntrlr.getResourceBundle().getText("S2ATTCHDOCDELVALDDELTXT").toLowerCase()) >=
				0) {
				if (flag === 1) {
					if (oTable.getModel().getData().ItemSet[rowIndex].doctype !== thisCntrlr.getResourceBundle().getText("S2ICONTABCARMKEY") &&
						oTable.getModel().getData()
						.ItemSet[rowIndex].docsubtype !== thisCntrlr.getResourceBundle().getText("S2ATTOTHTYPETEXT")) {
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
					if (!window.location.origin) {
						window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location
							.port ? ':' + window.location.port : '');
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
					var sDelete = sServiceUrl + "/AttachmentSet(Guid= guid'" + tableModel[rowIndex].Guid +
						"', ItemGuid = guid'" + tableModel[rowIndex].itemguid + "', DocType='" + tableModel[rowIndex].doctype +
						"',DocSubtype='" + tableModel[rowIndex].docsubtype + "',DocId=guid'" + tableModel[rowIndex].DocId +
						"')";
					/**
					 * **************To Fetch CSRF
					 * Token******************
					 */
					OData.request(f, function(data, oSuccess) {
						thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
						var oHeaders = {
							"X-CSRF-Token": thisCntrlr.oToken,
						};
						/**
						 * *****************To
						 * Delete
						 * File***********************
						 */
						var sDelete = sServiceUrl + "/AttachmentSet(Guid=guid'" + tableModel[rowIndex].Guid +
							"',ItemGuid=guid'" + tableModel[rowIndex].itemguid + "',DocType='" + tableModel[rowIndex].doctype +
							"',DocSubtype='" + tableModel[rowIndex].docsubtype + "',DocId=guid'" + tableModel[rowIndex]
							.DocId + "')";
						jQuery.ajax({
							type: 'DELETE',
							url: sDelete,
							headers: oHeaders,
							cache: false,
							processData: false,
							success: function(data) {
								thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText(
									"S2ATTCHDOCDELSUCSSMSG"));
								var oResource = thisCntrlr.getResourceBundle();                                                                                            //PCR026243++
								if(thisCntrlr.getOwnerComponent().OppType !== oResource.getText("S4DISOPPTYPTXT")){                                                        //PCR026243++
									if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
										thisCntrlr.getResourceBundle().getText("S2ICONTABATTCHKEY")) {
										that_attachment.getController().onExpBookDoc();
									//***************Justification: PCR018375++ Phase2 - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
									} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===                                                //PCR018375++
										thisCntrlr.getResourceBundle().getText("S2CBCTABTXT")){                                                                            //PCR018375++
										that_cbc.getController().checkCBCInitiate();                                                                                       //PCR018375++
										that_cbc.getController().onExpMEADoc();                                                                                            //PCR018375++
										var CBCData = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBCBCMODEL")).getData();                        //PCR018375++
										parseInt(CBCData.CbcStatus) !== 530 && parseInt(CBCData.CbcStatus) !== 540 ? that_cbc.getController().onEditCBC(): "";             //PCR018375++
								    //***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
									//}                                                                                                                                    //PCR018375++
									} else if(that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.getResourceBundle()
											.getText("S1ESAIDSPROSTYPTXT")){
										var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBESADATAMODEL")).getData();
									    thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, parseInt(EsaData.VersionNo));
									    var oModel = thisCntrlr.getDataModels();
									    var esaDisModel = com.amat.crm.opportunity.model.esaDisModel;
									    esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.getResourceBundle().getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3], oModel[4], oModel[4].Status, true, false, false);
									    thisCntrlr.setViewData(EsaModel);
									}
									//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
									if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
										thisCntrlr.getResourceBundle().getText("S2ICONTABCARMKEY")) {
										that_carm.getController().checkCarmInitiate();
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(
											thisCntrlr.carmDate);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(
											false);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(
											true);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(
											true);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(
											true);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn)
											.setEnabled(true);
										var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
										for (var i = 0; i < thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE)
											.getModel().getData().ItemSet.length; i++) {
											carmTable.getModel().getData().ItemSet[i].editable = true;
											carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
										}
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE)
											.getModel().refresh(true);
										thisCntrlr.onEditCarm();
									}
								//***********Start Of PCR026243: DL:1803 Display Migration to Q2C**************
								} else {									
								    switch(thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).getSelectedKey()){
								    case oResource.getText("S2ICONTABATTCHKEY"):
								    	that_attachment.getController().onExpBookDoc();
								        break;
								    case oResource.getText("S2ICONTABCARMKEY"):
								    	that_carm.getController().checkCarmInitiate();
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(thisCntrlr.carmDate);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(false);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(true);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(true);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(true);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
									    var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
									    for (var i = 0; i < carmTable.getModel().getData().ItemSet.length; i++) {
										   carmTable.getModel().getData().ItemSet[i].editable = true;
										   carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
									    }
									    carmTable.getModel().refresh(true);
									    thisCntrlr.onEditCarm();
								    }
								}
								//***********End Of PCR026243: DL:1803 Display Migration to Q2C**************
							},
							error: function(data) {
								thisCntrlr.showToastMessage($(data.responseText).find(thisCntrlr.getResourceBundle()
									.getText("S2CBCPSRCARMTYPEMESG"))[0].innerText);
								var oResource = thisCntrlr.getResourceBundle();                                                                                            //PCR026243++
								if(thisCntrlr.getOwnerComponent().OppType !== oResource.getText("S4DISOPPTYPTXT")){                                                        //PCR026243++
									that_attachment.getController().onExpBookDoc();
									if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
										thisCntrlr.getResourceBundle().getText("S2ICONTABCARMKEY")) {
										that_carm.getController().checkCarmInitiate();
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(
											thisCntrlr.carmDate);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(
											false);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(
											true);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(
											true);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(
											true);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn)
											.setEnabled(true);
										var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
										for (var i = 0; i < thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE)
											.getModel().getData().ItemSet.length; i++) {
											carmTable.getModel().getData().ItemSet[i].editable = true;
											carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
										}
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE)
											.getModel().refresh(true);
										thisCntrlr.onEditCarm();
									}
								//***********Start Of PCR026243: DL:1803 Display Migration to Q2C**************
								} else {
									that_attachment.getController().onExpBookDoc();
								    switch(thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).getSelectedKey()){
								    case oResource.getText("S2ICONTABCARMKEY"):
								    	that_carm.getController().checkCarmInitiate();
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(thisCntrlr.carmDate);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(false);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(true);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(true);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(true);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
									    var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
									    for (var i = 0; i < carmTable.getModel().getData().ItemSet.length; i++) {
										   carmTable.getModel().getData().ItemSet[i].editable = true;
										   carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
									    }
									    carmTable.getModel().refresh(true);
									    thisCntrlr.onEditCarm();
								    }
								}
								//***********End Of PCR026243: DL:1803 Display Migration to Q2C**************
								
							}
						});
					}, function(err) {});
				} else {
					if (!window.location.origin) {
						window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location
							.port ? ':' + window.location.port : '');
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
					var sDelete = sServiceUrl + "/AttachmentSet(Guid= guid'" + tableModel[rowIndex].Guid +
						"', ItemGuid = guid'" + tableModel[rowIndex].itemguid + "', DocType='" + tableModel[rowIndex].doctype +
						"',DocSubtype='" + tableModel[rowIndex].docsubtype + "',DocId=guid'" + tableModel[rowIndex].DocId +
						"')";
					/**
					 * **************To Fetch CSRF
					 * Token******************
					 */
					OData.request(f, function(data, oSuccess) {
						thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
						var oHeaders = {
							"X-CSRF-Token": thisCntrlr.oToken,
						};
						/**
						 * *****************To
						 * Delete
						 * File***********************
						 */
						var sDelete = sServiceUrl + "/AttachmentSet(Guid=guid'" + tableModel[rowIndex].Guid +
							"',ItemGuid=guid'" + tableModel[rowIndex].itemguid + "',DocType='" + tableModel[rowIndex].doctype +
							"',DocSubtype='" + tableModel[rowIndex].docsubtype + "',DocId=guid'" + tableModel[rowIndex]
							.DocId + "')";
						jQuery.ajax({
							type: 'DELETE',
							url: sDelete,
							headers: oHeaders,
							cache: false,
							processData: false,
							success: function(data) {
								thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText(
									"S2ATTCHDOCDELSUCSSMSG"));
								var oResource = thisCntrlr.getResourceBundle();                                                                                            //PCR026243++
								if(thisCntrlr.getOwnerComponent().OppType !== oResource.getText("S4DISOPPTYPTXT")){                                                        //PCR026243++
									that_attachment.getController().onExpBookDoc();
									if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
										thisCntrlr.getResourceBundle().getText("S2ICONTABCARMKEY")) {
										that_carm.getController().checkCarmInitiate();
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(
											thisCntrlr.carmDate);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(
											false);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(
											true);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(
											true);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(
											true);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn)
											.setEnabled(true);
										var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
										for (var i = 0; i < thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE)
											.getModel().getData().ItemSet.length; i++) {
											carmTable.getModel().getData().ItemSet[i].editable = true;
											carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
										}
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE)
											.getModel().refresh(true);
										thisCntrlr.onEditCarm();
									//***************Justification: PCR018375++ Phase2 - 3509 - PSR/CBC Workflow Rejection (restart) Capability ****************//
									}else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===                                      //PCR018375++
										thisCntrlr.getResourceBundle().getText("S2CBCTABTXT")){                                                                 //PCR018375++
										thisCntrlr.checkCBCInitiate();                                                                                          //PCR018375++
										thisCntrlr.onExpMEADoc();                                                                                               //PCR018375++
										var CBCData = thisCntrlr.getModelFromCore(thisCntrlr.getResourceBundle().getText("GLBCBCMODEL")).getData();             //PCR018375++
										parseInt(CBCData.CbcStatus) !== 530 && parseInt(CBCData.CbcStatus) !== 540 ? that_cbc.getController().onEditCBC(): "";  //PCR018375++
									//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
									} else if(that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.getResourceBundle().getText("S1ESAIDSPROSTYPTXT")){
										var EsaData = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBESADATAMODEL")).getData();
									    thisCntrlr.getRefreshEsaData(EsaData.Guid, EsaData.ItemGuid, parseInt(EsaData.VersionNo));
									    var oModel = thisCntrlr.getDataModels();
									    var esaDisModel = com.amat.crm.opportunity.model.esaDisModel;
									    esaDisModel.esaDisMode(thisCntrlr, oModel[0], thisCntrlr.getResourceBundle().getText("S1PERDLOG_CURRTXT"), oModel[2], oModel[3], oModel[4], oModel[4].Status, true, false, false);
									    thisCntrlr.setViewData(EsaModel);
									 //***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
									}
								//***********Start Of PCR026243: DL:1803 Display Migration to Q2C**************
								} else {
									that_attachment.getController().onExpBookDoc();
								    switch(thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).getSelectedKey()){								    	
								    case oResource.getText("S2ICONTABCARMKEY"):
								    	that_carm.getController().checkCarmInitiate();
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(thisCntrlr.carmDate);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(false);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(true);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(true);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(true);
									    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
									    var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
									    for (var i = 0; i < carmTable.getModel().getData().ItemSet.length; i++) {
										   carmTable.getModel().getData().ItemSet[i].editable = true;
										   carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
									    }
									    carmTable.getModel().refresh(true);
									    thisCntrlr.onEditCarm();
								    }
								}
								//***********End Of PCR026243: DL:1803 Display Migration to Q2C**************
								
							},
							error: function(data) {
								thisCntrlr.showToastMessage($(data.responseText).find(thisCntrlr.getResourceBundle()
									.getText("S2CBCPSRCARMTYPEMESG"))[0].innerText);
								var oResource = thisCntrlr.getResourceBundle();                                                                                            //PCR026243++
								if(thisCntrlr.getOwnerComponent().OppType !== oResource.getText("S4DISOPPTYPTXT")){                                                        //PCR026243++
									that_attachment.getController().onExpBookDoc();
									if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() ===
										thisCntrlr.getResourceBundle().getText("S2ICONTABCARMKEY")) {
										that_carm.getController().checkCarmInitiate();
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(
											thisCntrlr.carmDate);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(
											false);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(
											true);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(
											true);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(
											true);
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn)
											.setEnabled(true);
										var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
										for (var i = 0; i < thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE)
											.getModel().getData().ItemSet.length; i++) {
											carmTable.getModel().getData().ItemSet[i].editable = true;
											carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
										}
										thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE)
											.getModel().refresh(true);
										thisCntrlr.onEditCarm();
									}
							//***********Start Of PCR026243: DL:1803 Display Migration to Q2C**************
							} else {
								that_attachment.getController().onExpBookDoc();
							    switch(thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).getSelectedKey()){
							    case oResource.getText("S2ICONTABCARMKEY"):
							    	that_carm.getController().checkCarmInitiate();
								    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(thisCntrlr.carmDate);
								    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(false);
								    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(true);
								    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(true);
								    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(true);
								    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
								    var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
								    for (var i = 0; i < carmTable.getModel().getData().ItemSet.length; i++) {
									   carmTable.getModel().getData().ItemSet[i].editable = true;
									   carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
								    }
								    carmTable.getModel().refresh(true);
								    thisCntrlr.onEditCarm();
							    }
							}
							//***********End Of PCR026243: DL:1803 Display Migration to Q2C**************
							}
						});
					}, function(err) {});
					oTable.getModel().refresh(true);
				}
			} else {
				oTable.getModel().getData().ItemSet[rowIndex].editable = true;
				oTable.mAggregations.items[rowIndex].mAggregations.cells[2].setEnabled(false);
				oTable.getModel().getData().ItemSet[rowIndex].note = thisCntrlr.tempHold;
				thisCntrlr.source.setIcon(thisCntrlr.getResourceBundle().getText("S2PSRSDADELETEICON"));
				thisCntrlr.source.getParent().mAggregations.items[0].setIcon(thisCntrlr.getResourceBundle().getText(
					"S2PSRSDAEDITICON"));
				if (thisCntrlr.source.getParent().mAggregations.items[2] !== undefined) {
					thisCntrlr.source.getParent().mAggregations.items[2].setVisible(true);
				}
				var oResource = thisCntrlr.getResourceBundle();                                                                                            //PCR026243++
				if(thisCntrlr.getOwnerComponent().OppType !== oResource.getText("S4DISOPPTYPTXT")){                                                        //PCR026243++
					for (var i = 0; i < oTable.getModel().getData().ItemSet.length; i++) {
						if (i !== parseInt(rowIndex)) {
							oTable.getModel().getData().ItemSet[i].bgVisible = true;
							//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
							//oTable.getModel().getData().ItemSet[i].uBvisible = true;
							if(that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.getResourceBundle().getText("S1ESAIDSPROSTYPTXT")){
								oTable.getModel().getData().ItemSet[i].uBvisible = false;
							}else {
								oTable.getModel().getData().ItemSet[i].uBvisible = true;  
							}
							//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
						}
					}
					oTable.getModel().refresh(true);
					that_attachment.getController().onExpBookDoc();
					if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === thisCntrlr.getResourceBundle()
						.getText("S2ICONTABCARMKEY")) {
						that_carm.getController().checkCarmInitiate();
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(
							thisCntrlr.carmDate);
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(false);
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(true);
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(true);
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(true);
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
						var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
						for (var i = 0; i < thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE)
							.getModel().getData().ItemSet.length; i++) {
							carmTable.getModel().getData().ItemSet[i].editable = true;
							carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
						}
						carmTable.getModel().refresh(true);
						thisCntrlr.onEditCarm();
					}
					//***********Start Of PCR026243: DL:1803 Display Migration to Q2C**************
				} else {
					that_attachment.getController().onExpBookDoc();
				    switch(thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISICNTAB).getSelectedKey()){
				    case oResource.getText("S2ICONTABCARMKEY"):
				    	that_carm.getController().checkCarmInitiate();
					    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setDateValue(thisCntrlr.carmDate);
					    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_EDIT_Btn).setVisible(false);
					    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setVisible(true);
					    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_SAVE_Btn).setEnabled(true);
					    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_DATEPICKER).setEnabled(true);
					    thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_CARM_OTHERBtn).setEnabled(true);
					    var carmTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CaRM_PANL_ATTACHMENT_TABLE);
					    for (var i = 0; i < carmTable.getModel().getData().ItemSet.length; i++) {
						   carmTable.getModel().getData().ItemSet[i].editable = true;
						   carmTable.mAggregations.items[i].mAggregations.cells[2].setEnabled(false);
					    }
					    carmTable.getModel().refresh(true);
					    thisCntrlr.onEditCarm();
				    }
				}
				//***********End Of PCR026243: DL:1803 Display Migration to Q2C**************				
			}
			myBusyDialog.close();
		},
		/**
		 * This method Handles BSDA Work-flow Process .
		 * 
		 * @name commonWFPress
		 * @param evt - Holds the current event, thisCntrlr - Current Controller
		 * @returns 
		 */
		commonWFPress: function(evt, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var myBusyDialog = thisCntrlr.getBusyDialog();
			myBusyDialog.open();
			var oResource = thisCntrlr.getResourceBundle();
			if (thisCntrlr.detActionType === oResource.getText("S2CBCSUBMITCONFIRMVALKEY")) {
				thisCntrlr.detActionType = thisCntrlr.dialog.getContent()[0].getContent()[1].getValue();
				thisCntrlr.onCBCPayload(oResource.getText("S2PSRSSDACBCSUBMITPOSMSG"), oResource
					.getText("S2PSRCBCAPPROVEKEY"));
				thisCntrlr.onCancelWFPress();
				var CBCData = sap.ui.getCore().getModel(oResource.getText("GLBCBCMODEL")).getData();
				if (parseInt(CBCData.CbcStatus) !== 530 && parseInt(CBCData.CbcStatus) !== 540) {
					(parseInt(CBCData.TaskId) !== 0) ? (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setEnabled(true)) : (
						that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setEnabled(false));
					that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Critical);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setEnabled(true);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(false);
				} else {
					that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_CBC).setIconColor(sap.ui.core.IconColor.Positive);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_EDITBtn).setVisible(false);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SAVEBtn).setVisible(false);
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_SFAppBtn).setVisible(false);
					that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_SUBMIT).setVisible(false);
				}
				thisCntrlr.detActionType = "";

			} else if (that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TAB).getSelectedKey() === oResource.getText("S2ICONTABPSRSDAKEY")) {
				if ((thisCntrlr.dialog.getContent()[0].getContent()[1].getValue() === "" || thisCntrlr.dialog.getContent()[0].getContent()[1].getValue().trim() === "")
						&& thisCntrlr.detActionType === oResource.getText("S2PSRCBCREJECTKEY")) {
					thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCSFACOMMFAILMSG"));
				} else {
					var PSRData = sap.ui.getCore().getModel(oResource.getText("GLBPSRMODEL")).getData();
					var Msg = (thisCntrlr.detActionType === oResource.getText("S2PSRCBCAPPROVEKEY")) ? ((
						parseInt(PSRData.PsrStatus) === 25) ? (oResource.getText("S2PSRSDACBCBSDACOMTTXT")) : ((
						parseInt(PSRData.PsrStatus) === 70) ? (oResource.getText("S2PSRSDACBCPROCESSCOMTTXT")) : (
						oResource.getText("S2PSRSDACBCAPPNNXTLVLTXT")))) : (oResource.getText("S2PDCSDAREJWFMSAG"));
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setText(thisCntrlr.bundle.getText("S2PSRSDAEDITBTNTXT"));                     //PCR019492++
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setIcon(thisCntrlr.bundle.getText("S2PSRSDAEDITICON"));                       //PCR019492++
					if (parseInt(PSRData.PsrStatus) < 60) {
						var OppGenInfoModel = sap.ui.getCore().getModel(oResource.getText("GLBOPPGENINFOMODEL"));
						var StrachedStr = "";
						var obj = {};
						obj.NAV_SAF_QA = {};
						obj.NAV_PSR_QA = [];
						obj.NAV_SDA_QA = [];
						obj.Guid = OppGenInfoModel.getData().Guid;
						obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
						obj.PsrRequired = oResource.getText("S2POSMANDATANS");
						obj.PsrType = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_STATUS_TEXT).getText();
						obj.PsrStatus = "20";
						obj.Ssdl = PSRData.Ssdl;
						obj.Bd = PSRData.Bd;
						obj.Sd = PSRData.Sd;
						obj.Bsdl = PSRData.Bsdl;
						obj.ConComments = PSRData.ConComments;                                                                                      //PCR019492++  
						obj.SsdaReq = "";
						obj.BsdaJustfication = PSRData.BsdaJustfication;
						obj.SsdaJustfication = PSRData.SsdaJustfication;
						obj.StreachedSpec = PSRData.StreachedSpec;
						obj.RevOpitmId = PSRData.RevOpitmId;
						obj.RevOppId = PSRData.RevOppId;
						obj.Custno = PSRData.Custno;
						obj.ActionType = thisCntrlr.detActionType;
						if (parseInt(PSRData.PsrStatus) === 40 || (parseInt(PSRData.PsrStatus) === 17 &&
								PSRData.PsrType === oResource.getText("S2PSRSDASTATREPEAT"))) {
							(PSRData.StreachedSpec === oResource.getText("S2ODATAPOSVAL")) ?
							(StrachedStr = oResource.getText("S2PSRSDASTCHDSPECTXT")) : (StrachedStr = "");
						}
						obj.AprvComments = StrachedStr + thisCntrlr.dialog.getContent()[0].getContent()[1].getValue();
						obj.TaskId = PSRData.TaskId;
						if (thisCntrlr.detActionType === oResource.getText("S2PSRCBCAPPROVEKEY")) {
							obj.WiId = "";
						} else if (thisCntrlr.detActionType === oResource.getText("S2PSRCBCREJECTKEY")) {
							obj.WiId = PSRData.WiId;
						}
						obj.PsrStatDesc = "";
						obj.InitiatedBy = "";
						//obj.InitiatedDt = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                                 //PCR035760 Defect#131 TechUpgrade changes
						obj.Time = oResource.getText("S2OPPAPPPAYLODTMEKEY");
						obj.NAV_SAF_QA.Guid = OppGenInfoModel.getData().Guid;
						obj.NAV_SAF_QA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
						obj.NAV_SAF_QA.Qtype = oResource.getText("S2PSRSAFQUSKEY");
						obj.NAV_SAF_QA.Qid = oResource.getText("S2PSRSAFQUSTXT");
						obj.NAV_SAF_QA.Qdesc = "";
						obj.NAV_SAF_QA.QaVer = PSRData.NAV_SAF_QA.QaVer;                                                                                //PCR019492++
						obj.NAV_SAF_QA.OppId = sap.ui.getCore().getModel(oResource.getText("GLBOPPPSRINFOMODEL")).getData().OppId;
						obj.NAV_SAF_QA.ItemNo = sap.ui.getCore().getModel(oResource.getText("GLBOPPPSRINFOMODEL")).getData().ItemNo;
						obj.NAV_SAF_QA.SalesFlg = PSRData.NAV_SAF_QA.SalesFlg;
						obj.NAV_SAF_QA.BmoFlg = "";
						obj.NAV_SAF_QA.ChangedBy = "";
						//obj.NAV_SAF_QA.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                      //PCR035760 Defect#131 TechUpgrade changes
						if (parseInt(PSRData.PsrStatus) === 15) {
							var SalesQusData = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_Sys_SpecDETERMINE_TABLE)
								.getModel().getData();
							var QaVer = SalesQusData.items[0].QaVer, QusLen = "";
//							var QusId = ["1001", "1002", "1003", "1004", "1005", "1006"];                                                                //PCR019492--
							if(PSRData.Asc606_BsdaFlag === ""){                                                                                          //PCR019492++
							    var QusId = ["1001", "1002", "1003", "1004", "1005", "1006"];                                                            //PCR019492++
							    QusLen = 2;                                                                                                              //PCR019492++
							} else if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL")){                                     //PCR019492++
								 var QusId = ["1001", "1002", "1003", "1004", "1005", "1006", "1007"];                                                   //PCR019492++
								 QusLen = 3;                                                                                                             //PCR019492++
							}                                                                                                                            //PCR019492++
							for (var i = 0; i < SalesQusData.items.length; i++) {
								var PSR = {},
									SaleAns, BmoAns;
								PSR.Guid = OppGenInfoModel.getData().Guid;
								PSR.Qdesc = "";
								PSR.ItemGuid = OppGenInfoModel.getData().ItemGuid;
								PSR.Qtype = oResource.getText("S2ICONTABPSRTEXT");
								PSR.Qid = QusId[i];
								PSR.QaVer = QaVer;                                                                                                       //PCR019492++
								PSR.OppId = sap.ui.getCore().getModel(oResource.getText("GLBOPPPSRINFOMODEL")).getData().OppId;
								PSR.ItemNo = sap.ui.getCore().getModel(oResource.getText("GLBOPPPSRINFOMODEL")).getData().ItemNo;
								if (SalesQusData.items[i].SelectionIndex === 1) {
									SaleAns = oResource.getText("S2POSMANDATANS");
								} else if (SalesQusData.items[i].SelectionIndex === 2) {
									SaleAns = oResource.getText("S2NEGMANDATANS");
								} else {
									SaleAns = ""
								}
								PSR.SalesFlg = SaleAns;
								if (SalesQusData.items[i].BMOSelectionIndex === 1) {
									BmoAns = oResource.getText("S2POSMANDATANS");
								} else if (SalesQusData.items[i].BMOSelectionIndex === 2) {
									BmoAns = oResource.getText("S2NEGMANDATANS");
								} else {
									BmoAns = ""
								};
								PSR.BmoFlg = BmoAns;
								PSR.ChangedBy = "";
								//PSR.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                         //PCR035760 Defect#131 TechUpgrade changes
								obj.NAV_PSR_QA.push(PSR);
							}
						}
						//************************Start Of PCR019492: ASC606 UI Changes******************
						if(PSRData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") && ((parseInt(PSRData.PsrStatus) === 15 &&PSRData.PsrType === thisCntrlr.bundle.getText("S2PSRSDASTATREPEAT")) ||
								parseInt(PSRData.PsrStatus) >= 17)){
							obj.NAV_RRA_QA_PSR = [];
							var QusId = ["4001", "4002", "4003", "4004", "4005", "4006", "4007"], QusFlag = false;
							var SalesQusData = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_RRAREQTab).getModel().getData();
							var QaVer = SalesQusData.results[0].QaVer, count = -1;
							for (var i = 0; i < QusId.length; i++) {
								QusFlag = false
								for(var j = 0; j < SalesQusData.results.length; j++){
									if(QusId[i] === SalesQusData.results[j].Qid){
										QusFlag = true;
										count++;
									}
								}
							var RRA = {};
							if(QusFlag === true){
								RRA.Guid = OppGenInfoModel.getData().Guid;
								RRA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
								RRA.Comments = SalesQusData.results[count].Comments;
								RRA.BmoFlg = SalesQusData.results[count].BmoFlg;
								RRA.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().ItemNo
								RRA.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().OppId
								RRA.QaVer = SalesQusData.results[count].QaVer;
								RRA.Qdesc = SalesQusData.results[count].Qdesc;
								RRA.Qid = SalesQusData.results[count].Qid;
								RRA.Qtype = thisCntrlr.bundle.getText("S2PSRDCRRATXTASC606"); 
								RRA.SalesFlg = SalesQusData.results[count].SalesFlg;
								RRA.ChangedBy = "";
								//RRA.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                                                 //PCR035760 Defect#131 TechUpgrade changes
							} else {
								RRA.Guid = OppGenInfoModel.getData().Guid;
								RRA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
								RRA.Comments = "";
								RRA.BmoFlg = "";
								RRA.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().ItemNo
								RRA.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().OppId
								RRA.QaVer = QaVer;
								RRA.Qdesc = "";
								RRA.Qid = QusId[i];
								RRA.Qtype = "RRA" 
								RRA.SalesFlg = "";
								RRA.ChangedBy = "";
								//RRA.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                                                 //PCR035760 Defect#131 TechUpgrade changes
							}
							obj.NAV_RRA_QA_PSR.push(RRA);
					      }
						}
						//************************End Of PCR019492: ASC606 UI Changes******************
						if (parseInt(PSRData.PsrStatus) === 15 && PSRData.Asc606_BsdaFlag === "") {                                                  //PCR019492++
							var SalesQusData = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SDAReq_TABLE)
								.getModel().getData();
							var QusId = ["2001", "2002", "2003", "2004"];
							for (var i = 0; i < SalesQusData.items.length; i++) {
								var SDA = {},
									BmoAns;
								SDA.Guid = OppGenInfoModel.getData().Guid;
								SDA.Qdesc = "";
								SDA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
								SDA.Qtype = oResource.getText("S2PSRSDAQUSTXT");
								SDA.Qid = QusId[i];
								SDA.OppId = sap.ui.getCore().getModel(oResource.getText("GLBOPPPSRINFOMODEL"))
									.getData().OppId;
								SDA.ItemNo = sap.ui.getCore().getModel(oResource.getText("GLBOPPPSRINFOMODEL"))
									.getData().ItemNo;
								SDA.SalesFlg = "";
								if (SalesQusData.items[i].SelectionIndex !== undefined) {
									if (SalesQusData.items[i].SelectionIndex === 1) {
										BmoAns = oResource.getText("S2POSMANDATANS");
									} else if (SalesQusData.items[i].SelectionIndex === 2) {
										BmoAns = oResource.getText("S2NEGMANDATANS");
									} else {
										BmoAns = "";
									}
								} else {
									BmoAns = "";
								}
								SDA.BmoFlg = BmoAns;
								SDA.ChangedBy = "";
								//SDA.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                         //PCR035760 Defect#131 TechUpgrade changes
								obj.NAV_SDA_QA.push(SDA);
							}
						}
						thisCntrlr.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat.crm
							.opportunity.util.ServiceConfigConstants.write, obj, Msg);
						thisCntrlr.dialog.close();
						thisCntrlr.dialog.destroy();
						(this.detActionType === oResource.getText("S2PSRCBCREJECTKEY")) ? ((PSRData.PsrType === oResource.getText("S2PSRSDASTATREPEAT") ?
							(that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(false), that_psrsda.byId(com.amat
								.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL).setVisible(true)) : (that_psrsda.byId(com.amat.crm.opportunity.Ids
									.S2PSR_SDA_PANL_CUST_SpecREV1_PANEL).setVisible(true), that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_REL_PERSpec_REW_PANEL)
								.setVisible(false)))) : ("");
						thisCntrlr.detActionType = "";
						that_psrsda.getController().getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
						PSRData = sap.ui.getCore().getModel(oResource.getText("GLBPSRMODEL")).getData();
						that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor
							.Critical);
						(parseInt(PSRData.TaskId) !== 0) ? (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(true), that_views2
							.byId(
								com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(true)) : (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR)
							.setEnabled(
								false), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false));
						(parseInt(sap.ui.getCore().getModel("PSRModel").getData().PsrStatus) === 55 || parseInt(sap.ui.getCore().getModel("PSRModel").getData()
							.PsrStatus) === 58) ? (that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true)) : ("");
					} else {
						var OppGenInfoModel = sap.ui.getCore().getModel(oResource.getText(
							"GLBOPPGENINFOMODEL"));
						var obj = {};
						obj.Guid = OppGenInfoModel.getData().Guid;
						obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
						obj.PsrRequired = PSRData.PsrRequired;
						obj.PsrType = PSRData.PsrType;
						obj.PsrStatus = "65";
						obj.Ssdl = PSRData.Ssdl;
						obj.Bd = PSRData.Bd;
						obj.Bsdl = PSRData.Bsdl;
						obj.ConComments = PSRData.ConComments;                                                                                            //PCR019492++
						obj.Sd = PSRData.Sd;
						obj.BsdaJustfication = PSRData.BsdaJustfication;
						obj.SsdaJustfication = PSRData.SsdaJustfication;
						obj.SsdaReq = PSRData.SsdaReq;
						obj.RevOpitmId = PSRData.RevOpitmId;
						obj.RevOppId = PSRData.RevOppId;
						obj.Custno = PSRData.Custno;
						obj.ActionType = thisCntrlr.detActionType;
						obj.AprvComments = thisCntrlr.dialog.getContent()[0].getContent()[1].getValue();
						obj.TaskId = PSRData.TaskId;
						obj.WiId = PSRData.WiId;
						obj.PsrStatDesc = "";
						obj.InitiatedBy = "";
						//obj.InitiatedDt = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                                 //PCR035760 Defect#131 TechUpgrade changes
						obj.Time = oResource.getText("S2OPPAPPPAYLODTMEKEY");
						obj.NAV_SAF_QA = {};
						obj.NAV_SAF_QA.Guid = OppGenInfoModel.getData().Guid;
						obj.NAV_SAF_QA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
						obj.NAV_SAF_QA.Qtype = oResource.getText("S2PSRSAFQUSKEY");
						obj.NAV_SAF_QA.Qid = oResource.getText("S2PSRSAFQUSTXT");
						obj.NAV_SAF_QA.Qdesc = "";
						obj.NAV_SAF_QA.QaVer = PSRData.NAV_SAF_QA.QaVer;                                                                                   //PCR019492++
						obj.NAV_SAF_QA.OppId = sap.ui.getCore().getModel(oResource.getText("GLBOPPPSRINFOMODEL")).getData().OppId;
						obj.NAV_SAF_QA.ItemNo = sap.ui.getCore().getModel(oResource.getText("GLBOPPPSRINFOMODEL")).getData().ItemNo;
						obj.NAV_SAF_QA.SalesFlg = PSRData.NAV_SAF_QA.SalesFlg;
						obj.NAV_SAF_QA.BmoFlg = "";
						obj.NAV_SAF_QA.ChangedBy = "";
						//obj.NAV_SAF_QA.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                      //PCR035760 Defect#131 TechUpgrade changes
						thisCntrlr.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PsrSdaDataSet, com.amat.crm
							.opportunity.util.ServiceConfigConstants.write, obj, Msg);
						thisCntrlr.dialog.close();
						thisCntrlr.dialog.destroy();
						thisCntrlr.detActionType = "";
						that_psrsda.getController().getRefreshPSRData(OppGenInfoModel.getData().Guid, OppGenInfoModel.getData().ItemGuid);
						PSRData = sap.ui.getCore().getModel(oResource.getText("GLBPSRMODEL")).getData();
						if (parseInt(PSRData.PsrStatus) === 60) {
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
								true);
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSSDAAsses_PANEL).setVisible(
								true);
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SAPPROVALS_PANEL).setVisible(
								true);
						}
						that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor
							.Critical);
						(parseInt(PSRData.TaskId) !==
							0) ? (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(true), that_views2.byId(
							com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(true)) : (that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR)
							.setEnabled(
								false), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false));
					}
					if (parseInt(PSRData.PsrStatus) === 60 || parseInt(PSRData.PsrStatus) === 58) {
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setVisible(false);
						that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor
							.Positive);
						(sap.ui.getCore().getModel(oResource.getText("GLBOPPGENINFOMODEL")).getData().Region === oResource.getText("S2OPPREGION")) ? (
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false), that_views2.byId(com.amat.crm.opportunity
								.Ids.S2FTER_BTN_APPR).setVisible(false), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false)) : (
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true));
						if (PSRData.SsdaReq === oResource.getText("S2POSMANDATANS")) {
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SIMPLE_FORM_DISPLAY_435).setVisible(
								true);
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_BSDAAsses_PANEL).setVisible(
								true);
						}
						parseInt(PSRData.PsrStatus) === 60 ? that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false) : "";
					} else if (parseInt(PSRData.PsrStatus) === 55) {
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true);
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setIcon(oResource
							.getText("S2PSRSDADUPLICATEBTN"));
//						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(oResource                                             //PCR019492--
//								.getText("S2PSRSDASFSSDAINITTXT"));                                                                                        //PCR019492--
						if (PSRData.Asc606_Flag === "") {                                                                                                  //PCR019492++
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(oResource                                         //PCR019492++
									.getText("S2PSRSDASFSSDAINITTXT"));                                                                                    //PCR019492++
						} else if (PSRData.Asc606_Flag === oResource.getText("S1TABLESALESTAGECOL")) {                                                     //PCR019492++
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setText(oResource                                         //PCR019492++
									.getText("S2PSRDCINITRRABTNTXTASC606"));                                                                               //PCR019492++
						}						                                                                                                           //PCR019492++
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setType(oResource
							.getText("S2CBCPSRCARMBTNTPYACCEPT"));
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setEnabled(true);
						(sap.ui.getCore().getModel(oResource.getText("GLBOPPGENINFOMODEL")).getData().Region === oResource.getText("S2OPPREGION")) ? (
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(false), that_views2.byId(com.amat.crm.opportunity
								.Ids.S2FTER_BTN_APPR).setVisible(false), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(false)) : (
							that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_SFABtn).setVisible(true));
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_EDITBtn).setVisible(false);
						that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor
							.Positive);
					}
					that_views2.getController().onNavBack();                                                                                               //PCR019492++
				}
			} else {
				var PDCData = sap.ui.getCore().getModel(oResource.getText("GLBPDCSDAMODEL")).getData();
				if (PDCData.PsrStatus) {
					var OppGenInfoModel = sap.ui.getCore().getModel(oResource.getText("GLBOPPGENINFOMODEL"));
					if (thisCntrlr.detActionType === oResource.getText("S2PSRCBCAPPROVEKEY") || thisCntrlr.detActionType ===
						oResource.getText("S2PSRCBCREJECTKEY")) {
						if (thisCntrlr.detActionType === oResource.getText("S2PSRCBCREJECTKEY") && (thisCntrlr.dialog.getContent()[
								0].getContent()[1].getValue() === "" || thisCntrlr.dialog.getContent()[0].getContent()[1].getValue().trim() === "")) {
							thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCSFACOMMFAILMSG"));
						} else {
							var obj = {};
							obj.Guid = OppGenInfoModel.getData().Guid;
							obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
							obj.PsrRequired = PDCData.PsrRequired;
							obj.PsrType = PDCData.PsrType;
							obj.Ssdl = PDCData.Ssdl;
							obj.Bsdl = PDCData.Bsdl;
							obj.ConComments = PDCData.ConComments;                                                                                         //PCR019492++ 
							obj.Bd = PDCData.Bd;
							obj.CcOppId = PDCData.CcOppId;
							obj.CcOpitmId = PDCData.CcOpitmId;
							obj.BsdaJustfication = PDCData.BsdaJustfication;
							obj.SsdaJustfication = PDCData.SsdaJustfication;
							obj.Sd = PDCData.Sd;
							obj.SsdaReq = PDCData.SsdaReq;
							var StrachValue = "";
							(parseInt(PDCData.PsrStatus) === 640 && thisCntrlr.dialog.getContent()[0].getContent()[2].getItems()[0].getSelected() ===
								true) ? (StrachValue = oResource.getText("S2PSRSDASTCHDSPECTXT")) : (
								StrachValue = "");
							obj.StreachedSpec = PDCData.StreachedSpec;
							obj.RevOpitmId = PDCData.RevOpitmId;
							obj.RevOppId = PDCData.RevOppId;
							obj.Custno = PDCData.Custno;
							obj.ActionType = thisCntrlr.detActionType;
							obj.AprvComments = StrachValue + thisCntrlr.dialog.getContent()[0].getContent()[1].getValue();
							obj.TaskId = PDCData.TaskId;
							obj.WiId = PDCData.WiId;
							obj.PsrStatDesc = "";
							obj.InitiatedBy = "";
							//obj.InitiatedDt = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                             //PCR035760 Defect#131 TechUpgrade changes
							obj.Time = oResource.getText("S2OPPAPPPAYLODTMEKEY");
							obj.NAV_PDC_QA_SAF = {};
							obj.NAV_PDC_QA_SAF.BmoFlg = PDCData.NAV_PDC_QA_SAF.BmoFlg;
							obj.NAV_PDC_QA_SAF.ChangedBy = PDCData.NAV_PDC_QA_SAF.ChangedBy;
							//obj.NAV_PDC_QA_SAF.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                              //PCR035760 Defect#131 TechUpgrade changes
							obj.NAV_PDC_QA_SAF.Guid = OppGenInfoModel.getData().Guid;
							obj.NAV_PDC_QA_SAF.ItemGuid = OppGenInfoModel.getData().ItemGuid;
							obj.NAV_PDC_QA_SAF.ItemNo = PDCData.NAV_PDC_QA_SAF.ItemNo;
							obj.NAV_PDC_QA_SAF.OppId = PDCData.NAV_PDC_QA_SAF.OppId;
							obj.NAV_PDC_QA_SAF.QaVer = PDCData.NAV_PDC_QA_SAF.QaVer;                                                   //PCR019492++
							obj.NAV_PDC_QA_SAF.Qdesc = PDCData.NAV_PDC_QA_SAF.Qdesc;
							obj.NAV_PDC_QA_SAF.Qid = PDCData.NAV_PDC_QA_SAF.Qid;
							obj.NAV_PDC_QA_SAF.Qtype = PDCData.NAV_PDC_QA_SAF.Qtype;
							obj.NAV_PDC_QA_SAF.SalesFlg = PDCData.NAV_PDC_QA_SAF.SalesFlg;
							if (that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_TABLE).getModel() !==
								undefined) {
								obj.NAV_PDC_CC = [];
								var PDCCcTabData = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_CARBON_COPY_TABLE)
									.getModel().getData().results;
								if (PDCCcTabData.length > 0) {
									for (var i = 0; i < PDCCcTabData.length; i++) {
										var data = {};
										data.Guid = PDCCcTabData[i].Guid;
										data.ItemGuid = PDCCcTabData[i].ItemGuid;
										data.OppId = PDCCcTabData[i].OppId;
										data.ItemNo = PDCCcTabData[i].ItemNo;
										obj.NAV_PDC_CC.push(data);
									}
								}
							}
							//************************Start Of PCR019492: ASC606 UI Changes******************
							if(PDCData.Asc606_BsdaFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL")){
								obj.NAV_RRA_QA_PDC = [];
								var QusId = ["4001", "4002", "4003", "4004", "4005", "4006", "4007"], QusFlag = false;
								var SalesQusData = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_RRAREQTab).getModel().getData();
								var QaVer = SalesQusData.results[0].QaVer, count = -1;
								for (var i = 0; i < QusId.length; i++) {
									QusFlag = false
									for(var j = 0; j < SalesQusData.results.length; j++){
										if(QusId[i] === SalesQusData.results[j].Qid){
											QusFlag = true;
											count++;
										}
									}
								var RRA = {};
								if(QusFlag === true){
									RRA.Guid = OppGenInfoModel.getData().Guid;
									RRA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
									RRA.Comments = SalesQusData.results[count].Comments;
									RRA.BmoFlg = SalesQusData.results[count].BmoFlg;
									RRA.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().ItemNo
									RRA.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().OppId
									RRA.QaVer = SalesQusData.results[count].QaVer;
									RRA.Qdesc = SalesQusData.results[count].Qdesc;
									RRA.Qid = SalesQusData.results[count].Qid;
									RRA.Qtype = thisCntrlr.bundle.getText("S2PSRDCRRATXTASC606"); 
									RRA.SalesFlg = SalesQusData.results[count].SalesFlg;
									RRA.ChangedBy = "";
									//RRA.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                                             //PCR035760 Defect#131 TechUpgrade changes
								} else {
									RRA.Guid = OppGenInfoModel.getData().Guid;
									RRA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
									RRA.Comments = "";
									RRA.BmoFlg = "";
									RRA.ItemNo = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().ItemNo
									RRA.OppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().OppId
									RRA.QaVer = QaVer;
									RRA.Qdesc = "";
									RRA.Qid = QusId[i];
									RRA.Qtype = "RRA" 
									RRA.SalesFlg = "";
									RRA.ChangedBy = "";
									//RRA.ChangedDate = thisCntrlr.bundle.getText("S2OPPAPPPAYLODDATKEY");                                                                             //PCR035760 Defect#131 TechUpgrade changes
								}
								obj.NAV_RRA_QA_PDC.push(RRA);
						      }
							}
						   //************************End Of PCR019492: ASC606 UI Changes******************
							if (thisCntrlr.detActionType === oResource.getText("S2PSRCBCAPPROVEKEY")) {
								switch (parseInt(PDCData.PsrStatus)) {
									case 640:
										obj.PsrStatus = "645";
										break;
									case 645:
										obj.PsrStatus = "646";
										break;
									case 646:
										obj.PsrStatus = "650";
										break;
									case 650:
										obj.PsrStatus = "655";
										break;
									case 655:
										obj.PsrStatus = "665";
										break;
									case 665:
										obj.PsrStatus = "670";
										break;
									case 670:
										obj.PsrStatus = "675";
										break;
									case 675:
										obj.PsrStatus = "680";
										break;
									case 680:
										obj.PsrStatus = "682";
										break;
									case 682:
										obj.PsrStatus = "665";
										break;
								}
							} else {
								if (parseInt(PDCData.PsrStatus) < 655) {
									obj.PsrStatus = "655";
								} else {
									obj.PsrStatus = "682";
								}
							}
							var MSG = (thisCntrlr.detActionType === oResource.getText("S2PSRCBCAPPROVEKEY")) ? ((
								parseInt(PDCData.PsrStatus) === 650) ? (oResource.getText("S2PSRSDACBCBSDACOMTTXT")) : (
								(parseInt(PDCData.PsrStatus) === 682) ? (oResource.getText("S2PSRSDACBCPDCPROCESSCOMTTXT")) :
								(oResource.getText("S2PSRSDACBCAPPNNXTLVLTXT")))) : (oResource.getText("S2PDCSDAREJWFMSAG"));
							thisCntrlr.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.PdcSdaDataSet, com.amat.crm
								.opportunity.util.ServiceConfigConstants.write, obj, MSG);
							thisCntrlr.dialog.close();
							thisCntrlr.dialog.destroy();
							thisCntrlr.detActionType = "";
							PDCData = sap.ui.getCore().getModel(oResource.getText("GLBPDCSDAMODEL")).getData();
							this._initiateControllerObjects(thisCntrlr);
							that_pdcsda.getController().checkPDCInitiate();
							that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setText(oResource
								.getText("S2PSRSDAEDITBTNTXT"));
							that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_EDITBtn).setIcon(oResource
								.getText("S2PSRSDAEDITICON"));
							that_pdcsda.getController().PDCDisMode();
							that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PSRSDA).setIconColor(sap.ui.core.IconColor
								.Critical);
							var SFAPRBtn = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_SFABtn);
							var initSSDATxt = PDCData.Asc606_Flag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? oResource.getText("S2PSRDCINITRRABTNTXTASC606"):     //PCR019492++
								oResource.getText("S2PSRSDASFSSDAINITTXT");
							(PDCData.PsrStatus === 655) ? (SFAPRBtn.setVisible(true), SFAPRBtn.setEnabled(true), SFAPRBtn.setText(initSSDATxt)) : ("");                 //PCR019492++
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR).setEnabled(false);
							that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setEnabled(false);
							(parseInt(that_pdcsda.getController().PDCData.PsrStatus) === 660 || parseInt(that_pdcsda.getController().PDCData.PsrStatus) ===
								655) ? (that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA)
								.setEnabled(true), that_views2.byId(com.amat.crm.opportunity.Ids.ICON_TABF_PDCSDA).setIconColor(
									sap.ui.core.IconColor.Positive, that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_APPR)
									.setVisible(false), that_views2.byId(com.amat.crm.opportunity.Ids.S2FTER_BTN_RJCT).setVisible(
										false))) : ("");
							(parseInt(that_pdcsda.getController().PDCData.PsrStatus) === 605 && that_pdcsda.getController().PDCData.BsdaResetFlag ===                   //PCR019492++
								oResource.getText("S1TABLESALESTAGECOL")) ? SFAPRBtn.setVisible(false) : "" ;                                                           //PCR019492++
							that_views2.getController().onNavBack();                                                                                                    //PCR019492++
						}
					}
				}
			}
			myBusyDialog.close();
		},
		/**
		 * This method Handles Note live Change Event.
		 * 
		 * @name commonNoteLiveChange
		 * @param oEvt - Holds the current event, thisCntrlr - Current Controller
		 * @returns 
		 */
		commonNoteLiveChange: function(oEvt, thisCntrlr) {
			var saveBtn;
//			if (oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_TABLE) >= 0) {                         //PCR018375--
			if (oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_TABLE) >= 0 ||                         //PCR018375++
				     oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S2CBC_PANL_MEA_DOC_LIST_TABLE) >= 0) {                             //PCR018375++
				saveBtn = oEvt.getSource().getParent().getCells()[4].getItems()[0].getItems()[0];
			} else {
				saveBtn = oEvt.getSource().getParent().getCells()[3].getItems()[0].getItems()[0];
			}
			var index = oEvt.getParameters().id.split(thisCntrlr.getResourceBundle().getText("S3SEPARATORTEXT"))[oEvt.getParameters().id.split(
				thisCntrlr.getResourceBundle().getText("S3SEPARATORTEXT")).length - 1];
			var docSubType = oEvt.getSource().getParent().getParent().getModel().getData().ItemSet[index].docsubtype;

			if (oEvt.getParameters().value.length >= 255) {
				saveBtn.setEnabled(false);
				oEvt.getSource().getParent().getCells()[3].getItems()[1].getItems()[0].setEnabled(false);
				oEvt.getSource().setValue(oEvt.getParameters().value.substr(0, 254));
				thisCntrlr.showToastMessage(thisCntrlr.getResourceBundle().getText("S2PSRSDACBCMCOMMVALTXT"));
			} else if (oEvt.getParameters().value.length === 0) {
				if (docSubType === thisCntrlr.getResourceBundle().getText("S3PBCDT") || docSubType === thisCntrlr.getResourceBundle().getText(
						"S3PBDT") || docSubType === thisCntrlr.getResourceBundle().getText("S3BDT")) {
					oEvt.getSource().getParent().getCells()[2].setValueState(sap.ui.core.ValueState.Warning);
					oEvt.getSource().getParent().getCells()[3].getItems()[1].getItems()[0].setEnabled(false);
				}
			} else {
				saveBtn.setEnabled(true);
				oEvt.getSource().getParent().getCells()[2].setValueState(sap.ui.core.ValueState.None);
//				if (oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_TABLE) >= 0) {                       //PCR018375--
				if (oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_TABLE) >= 0||                        //PCR018375++
					     oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S2CBC_PANL_MEA_DOC_LIST_TABLE) >= 0) {                           //PCR018375++
					oEvt.getSource().getParent().getCells()[4].getItems()[0].getItems()[0].setEnabled(true);
				} else {
					oEvt.getSource().getParent().getCells()[3].getItems()[1].getItems()[0].setEnabled(true);
				}
			}
		},
		/**
		 * This method is used to handles Main Comment Text Area Live Change Event.
		 * 
		 * @name OnMainCommLvchng
		 * @param oEvent - Holds the current event, thisCntrlr - Current Controller
		 * @returns
		 */
		commonMainCommLvchng: function(oEvent, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var SaveBtn = "";
			var oResouceBundle = thisCntrlr.getResourceBundle();
			(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText(
				"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA) ? (SaveBtn =
				that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN)) :
			((oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText(
					"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_TEXT_AREA) ? (SaveBtn = that_cbc.byId(
					com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN)) :
				((oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText(
						"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA) ? (SaveBtn =
						that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_SAVEBtn)) :
					((oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText(
							"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_TEXT_AREA) ? (SaveBtn =
							that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_SAVEBTN)) :
						((oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle
							.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_TEXT_AREA) ? (SaveBtn =
							//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
							//that_carm.byId(com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_SAVEBTN)) : (SaveBtn = that_attachment.byId(com.amat.crm.opportunity							
							//.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_SAVEBTN))))));
							that_carm.byId(com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_SAVEBTN)) :
							   (oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle
								  .getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_TEXT_AREA) ?
									(SaveBtn = that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_SAVEBTN)) :
										//***********Start Of PCR034716++: Q2C ESA,PSR Enhancements**************
										(oEvent.getParameters().id === com.amat.crm.opportunity.Ids.S2ESA_PANL_CHKLST_COMMENT_TEXT_AREA) ?
												(SaveBtn = sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.S2ESA_PANL_CHKLST_COMMENT_SAVEBTN)) :
										//***********End Of PCR034716++: Q2C ESA,PSR Enhancements***************
				                                  (SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESA_PANL_MAIN_COMMENT_SAVEBTN))))));
				           //***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App***************
			if (oEvent.getParameters().value.length > 0 && oEvent.getParameters().value.length < 255) {
				SaveBtn.setEnabled(true);
			} else if (oEvent.getParameters().value.length === 255) {
				SaveBtn.setEnabled(false);
				thisCntrlr.showToastMessage(oResouceBundle.getText("S2PSRSDACBCMCOMMVALTXT"));
			} else {
				SaveBtn.setEnabled(false);
			}
		},
		/**
		 * This method is used to handles Main comment Panel Expand Event.
		 * 
		 * @name OnExpandMainCom
		 * @param oEvent - Holds the current event, thisCntrlr - Current Controller
		 * @returns
		 */
		commonExpandMainCom: function(oEvent, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			if (oEvent.getParameters().expand === true) {
				var MCommType = "",
					oTable = "",
					MComModel = "";
				var oResouceBundle = thisCntrlr.getResourceBundle();
				switch (oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(
					oResouceBundle.getText("S2PSRCBCSEPARATORTXT")).length - 1]) {
					case com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL:
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setValue("");
						that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN).setEnabled(false);
						MCommType = oResouceBundle.getText("S2PSRMCOMMDATATYP");
						oTable = that_psrsda.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__COMMTABLE);
						break;
					case com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_PANEL:
						that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_TEXT_AREA).setValue("");
						that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN).setEnabled(false);
						MCommType = oResouceBundle.getText("S2CBCMCOMMDATATYP");
						oTable = that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__COMMTABLE);
						break;
					case com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL:
						that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA).setValue("");
						that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_SAVEBtn).setEnabled(false);
						MCommType = oResouceBundle.getText("S2PDCMCOMMDATATYP");
						oTable = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_TABLE);
						break;
					case com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_PANEL:
						that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_TEXT_AREA).setValue("");
						that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_SAVEBTN).setEnabled(false);
						MCommType = oResouceBundle.getText("S2GENINFOMCOMMDATATYP");
						oTable = that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_COMMTABLE);
						break;
					case com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_PANEL:
						that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_TEXT_AREA).setValue("");
						that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_SAVEBTN).setEnabled(false);
						MCommType = oResouceBundle.getText("S2ATTCHMCOMMDATATYP");
						oTable = that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_COMMTABLE);
						break;
					case com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_PANEL:
						that_carm.byId(com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_TEXT_AREA).setValue("");
						that_carm.byId(com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_SAVEBTN).setEnabled(false);
						MCommType = oResouceBundle.getText("S2MLIMCOMMDATATYP");
						oTable = that_carm.byId(com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_COMMTABLE);
						break;
					//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
					case com.amat.crm.opportunity.Ids.S2ESA_PANL_MAIN_COMMENT_PANEL:
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESA_PANL_MAIN_COMMENT_TEXT_AREA).setValue("");
						thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESA_PANL_MAIN_COMMENT_SAVEBTN).setEnabled(false);
						MCommType = oResouceBundle.getText("S1ESAIDSPROSTYPTXT");
						oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESA_PANL_MAIN_COMMENT_COMMTABLE);
						break;	
					//***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				}
				var ItemGuid = sap.ui.getCore().getModel(oResouceBundle.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
				var sValidate = "CommentsSet?$filter=ItemGuid eq guid'" + ItemGuid + "'and CommType eq '" + MCommType + "'";
				this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText(
					"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT_PANEL) ? (MComModel = sap.ui.getCore()
					.getModel(oResouceBundle.getText("GLBPSRCOMMMODEL"))) : (
					(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText(
						"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_PANEL) ? (MComModel = sap.ui.getCore()
						.getModel(oResouceBundle.getText("GLBCBCCOMMMODEL"))) : (
						(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText(
							"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL) ? (MComModel = sap.ui.getCore()
							.getModel(oResouceBundle.getText("GLBPDCCOMMMODEL"))) : (
							(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle
								.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_PANEL) ? (MComModel =
								sap.ui.getCore().getModel(oResouceBundle.getText("GLBGENCOMMMODEL"))) :
							((oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(
									oResouceBundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_PANEL) ?
								//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
								//(MComModel = sap.ui.getCore().getModel(oResouceBundle.getText("GLBCARMCOMMMODEL"))) : (MComModel = sap.ui.getCore().getModel(
								//oResouceBundle.getText("GLBATHCOMMMODEL")))))));
								(MComModel = sap.ui.getCore().getModel(oResouceBundle.getText("GLBCARMCOMMMODEL"))) :
									(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(
										oResouceBundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_PANEL) ?
											(MComModel = sap.ui.getCore().getModel(oResouceBundle.getText("GLBATHCOMMMODEL"))): 
												(MComModel = sap.ui.getCore().getModel(oResouceBundle.getText("GLBESAMCOMMMODEL")))))));
					           //***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App****************
				if (oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle
						.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT_PANEL) {
					MComModel = sap.ui.getCore().getModel(oResouceBundle.getText("GLBPDCCOMMMODEL"));
				}
				oTable.setModel(MComModel);
			}
		},
		/**
		 * This method is used to handles Save Comment Event.
		 * 
		 * @name onSaveMainCom
		 * @param oEvent - Holds the current event, thisCntrlr - Current Controller
		 * @returns
		 */
		commonSaveMainCom: function(oEvent, thisCntrlr) {
			this._initiateControllerObjects(thisCntrlr);
			var oResouceBundle = thisCntrlr.getResourceBundle();
			if (!(oEvent.getSource().getParent().getFields()[0].getValue().match(/\S/))) {
				thisCntrlr.showToastMessage(oResouceBundle.getText("S2MAINCOMMBLANKMSG"));
			} else {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var MCommType = "",
					MType = "",
					MComModel = "",
					oTable = "",
					SaveBtn = "",
					MTxtAra = "";
				(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText(
					"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN) ? (MCommType =
					oResouceBundle.getText("S2PSRMCOMMDATATYP"), MType = oResouceBundle.getText("S2ICONTABPSRTEXT"), oTable = that_psrsda.byId(com.amat
						.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__COMMTABLE), MTxtAra = that_general.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__TEXT_AREA),
					SaveBtn = that_general.byId(com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN)) : (
					(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText(
						"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN) ? (MCommType =
						oResouceBundle.getText("S2CBCMCOMMDATATYP"), MType = oResouceBundle.getText("S2ICONTABCBCTXT"), oTable = that_cbc.byId(com.amat.crm
							.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__COMMTABLE), MTxtAra = that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT_TEXT_AREA),
						SaveBtn = that_cbc.byId(com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN)) : (
						(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText(
							"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__SAVEBTN) ? (MCommType =
							oResouceBundle.getText("S2PDCMCOMMDATATYP"), MType = oResouceBundle.getText("S2ICONTABPDCTEXT"), oTable = that_pdcsda.byId(com.amat
								.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__COMMTABLE), MTxtAra = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__TEXT_AREA),
							SaveBtn = that_pdcsda.byId(com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__SAVEBTN)) : (
							(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle
								.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_SAVEBTN) ? (MCommType =
								oResouceBundle.getText("S2GENINFOMCOMMDATATYP"), MType = oResouceBundle.getText("S2GENINFOMCOMMDATATYP"), oTable =
								that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_COMMTABLE), MTxtAra = that_general.byId(com.amat.crm.opportunity
									.Ids.S2GINFO_PANL_MAIN_COMMENT_TEXT_AREA), SaveBtn = that_general.byId(com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_SAVEBTN)
							) : (
								(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(
									oResouceBundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_SAVEBTN) ?
								(MCommType = oResouceBundle.getText("S2MLIMCOMMDATATYP"), MType = oResouceBundle.getText("S2MLIMCOMMDATATYP"), oTable =
									that_carm.byId(com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_COMMTABLE), MTxtAra = that_carm.byId(com.amat.crm.opportunity
										.Ids.S2CARM_PANL_MAIN_COMMENT_TEXT_AREA), SaveBtn = that_carm.byId(com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_SAVEBTN)
								        //***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
										//) : (MCommType = oResouceBundle.getText("S2ATTCHMCOMMDATATYP"), MType = oResouceBundle.getText("S2ATTCHMCOMMDATATYP"), oTable =
										//	that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_COMMTABLE), MTxtAra = that_attachment.byId(
										//		com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_TEXT_AREA), SaveBtn = that_attachment.byId(com.amat.crm.opportunity
										//		.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_SAVEBTN))))));		
										) : ((oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(
											oResouceBundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_SAVEBTN) ? 
											   (MCommType = oResouceBundle.getText("S2ATTCHMCOMMDATATYP"), MType = oResouceBundle.getText("S2ATTCHMCOMMDATATYP"), oTable =
											      that_attachment.byId(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_COMMTABLE), MTxtAra = that_attachment.byId(
												   com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_TEXT_AREA), SaveBtn = that_attachment.byId(com.amat.crm.opportunity
												    .Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_SAVEBTN)) : 
												    	//***********Start Of PCR034716++: Q2C ESA,PSR Enhancements**************
												    	(oEvent.getParameters().id === com.amat.crm.opportunity.Ids.S2ESA_PANL_CHKLST_COMMENT_SAVEBTN) ?
												    			(MCommType = oResouceBundle.getText("S1ESACHKLSTTYPTXT"), MType = oResouceBundle.getText("S1ESACHKLSTTYPTXT"), SaveBtn = sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.
												    			 S2ESA_PANL_CHKLST_COMMENT_SAVEBTN), oTable = sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.
												    			  S2ESA_PANL_CHKLST_COMMENT_COMMTABLE), MTxtAra = sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.
												    				S2ESA_PANL_CHKLST_COMMENT_TEXT_AREA))	:
												    	//***********End Of PCR034716++: Q2C ESA,PSR Enhancements***************
												    			(MCommType = oResouceBundle.getText("S1ESAIDSPROSTYPTXT"), MType = 
												    	oResouceBundle.getText("S1ESAIDSPROSTYPTXT"), oTable = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids
												    	 .S2ESA_PANL_MAIN_COMMENT_COMMTABLE), MTxtAra = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESA_PANL_MAIN_COMMENT_TEXT_AREA),
												    	  SaveBtn = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESA_PANL_MAIN_COMMENT_SAVEBTN)))))));
					                    //***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App***************
				var obj = this.MainComPayload(oEvent.getSource().getParent().getFields()[0].getValue(), MType, oResouceBundle);
				this.serviceCall(com.amat.crm.opportunity.util.ServiceConfigConstants.CommentsSet, com.amat.crm.opportunity.util.ServiceConfigConstants
					.write, obj, oResouceBundle.getText("S2PSRCBCMCOMMSAVSUCSSTXT"));
				var ItemGuid = sap.ui.getCore().getModel(oResouceBundle.getText("GLBOPPGENINFOMODEL")).getData().ItemGuid;
				var sValidate = "CommentsSet?$filter=ItemGuid eq guid'" + ItemGuid + "'and CommType eq '" + MCommType + "'";
				this.serviceCall(sValidate, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText(
					"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2PSR_SDA_PANL_MAIN_COMMENT__SAVEBTN) ? (MComModel = sap.ui
					.getCore().getModel(oResouceBundle.getText("GLBPSRCOMMMODEL"))) : (
					(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText(
						"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2CBC_PANL_MAIN_COMMENT__SAVEBTN) ? (MComModel = sap.ui.getCore()
						.getModel(oResouceBundle.getText("GLBCBCCOMMMODEL"))) : (
						(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText(
							"S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2PDC_SDA_PANL_MAIN_COMMENT__SAVEBTN) ? (MComModel = sap.ui
							.getCore().getModel(oResouceBundle.getText("GLBPDCCOMMMODEL"))) : (
							(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle
								.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2GINFO_PANL_MAIN_COMMENT_SAVEBTN) ? (MComModel =
								sap.ui.getCore().getModel(oResouceBundle.getText("GLBGENCOMMMODEL"))) : (
								(oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(
									oResouceBundle.getText("S2PSRCBCSEPARATORTXT")).length - 1] === com.amat.crm.opportunity.Ids.S2CARM_PANL_MAIN_COMMENT_SAVEBTN) ?
								//***********Start Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
								//(MComModel = sap.ui.getCore().getModel(oResouceBundle.getText("GLBCARMCOMMMODEL"))) : (MComModel = sap.ui.getCore().getModel(
								//	oResouceBundle.getText("GLBATHCOMMMODEL")))))));
								(MComModel = sap.ui.getCore().getModel(oResouceBundle.getText("GLBCARMCOMMMODEL"))) : (oEvent.getParameters().id.split(
									oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))
									  .length - 1] === com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_MAIN_COMMENT_SAVEBTN) ? MComModel = sap.ui.getCore().getModel(
										oResouceBundle.getText("GLBATHCOMMMODEL")) :
											//***********Start Of PCR034716++: Q2C ESA,PSR Enhancements*************
											(oEvent.getParameters().id.split(
													oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))[oEvent.getParameters().id.split(oResouceBundle.getText("S2PSRCBCSEPARATORTXT"))
													  .length - 1] === com.amat.crm.opportunity.Ids.S2ESA_PANL_CHKLST_COMMENT_SAVEBTN) ? MComModel = sap.ui.getCore().getModel(
														oResouceBundle.getText("ESACHKLSTComModel")) : 
											//***********End Of PCR034716++: Q2C ESA,PSR Enhancements***************
											MComModel = sap.ui.getCore().getModel(oResouceBundle.getText("GLBESAMCOMMMODEL"))))));
					            //***********End Of PCR023905: Migrate ESA/IDS db from Lotus Notes to SAP Fiori Q2C App**************
				oTable.setModel(MComModel);
				MTxtAra.setValue("");
				SaveBtn.setEnabled(false);
				myBusyDialog.close();
			}
		},
		/**
		 * This method is used to handles Main Comment Payload.
		 * 
		 * @name MainComPayload
		 * @param oEvent - Holds the current event, CommType - Main Comment Type, oResouceBundle - Resource bundle 
		 * @returns
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
	});
});