/**
 * This class holds all methods of Component.
 * 
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends
 * @name opportunity.Component                                                    *
 *  * ----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 * Ver.No    Date        Author    PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * V00    20/02/2018    Abhishek   PCR017480         Initial version              *
 *                      Pant                                                      *
 *                      (X089025)                                                 *
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 25/02/2019      Abhishek        PCR022669         Q2C Q2 UI Changes            *
 *                 Pant                                                           *
 * 17/06/2019      Abhishek        PCR023905         Migrate ESA/IDS db from Lotus*
 *                 Pant                              Notes to SAP Fiori Q2C       *
 *                                                   Application                  *
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 ***********************************************************************************
 */
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/amat/crm/opportunity/model/models",
	"com/amat/crm/opportunity/util/formatter",
	"com/amat/crm/opportunity/util/ServiceConfigConstants",
	"com/amat/crm/opportunity/util/IdHelper"
], function(UIComponent, Device, model, formatter) {
	"use strict";

	return UIComponent.extend("com.amat.crm.opportunity.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			UIComponent.prototype.init.apply(this, arguments);
			jQuery.sap.require("sap.ui.core.routing.History");
			jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
			var deviceModel = new sap.ui.model.json.JSONModel({
				isTouch: sap.ui.Device.support.touch,
				isNoTouch: !sap.ui.Device.support.touch,
				isPhone: jQuery.device.is.phone ? true : false,
				isNoPhone: !jQuery.device.is.phone,
				listMode: (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
				listItemType: (jQuery.device.is.phone) ? "Navigation" : "Active",

			});
			var ids = new sap.ui.model.json.JSONModel({
				s1: "",
				s2: "",

			});
			this.setModel(ids, "globalids");

			deviceModel.setDefaultBindingMode("OneWay");
			this.setModel(deviceModel, "device");
			var router = this.getRouter();
			this.routerHandler = new sap.m.routing.RouteMatchedHandler(router);
			router.initialize();
			this.s2 = undefined;
			this.general = undefined;
			this.pdcsda = undefined;
			this.psrsda = undefined;
			this.cbc = undefined;
			this.carm = undefined;
			this.attachment = undefined;
			this.mli = undefined;
			this.Guid = undefined;                                                                                                        //PCR022669++
			this.ItemGuid = undefined;                                                                                                    //PCR022669++
			this.context = undefined;                                                                                                     //PCR022669++
			this.VerNo = undefined;                                                                                                       //PCR023905++
			this.esa = undefined;                                                                                                         //PCR023905++
			//*****************Start Of PCR026243 DL:1803 Display Migration to Q2C*****************
			this.s4 = undefined;
			this.disp_general = undefined;
			this.disp_psrra = undefined;
			this.disp_cbc = undefined;
			this.disp_esa = undefined;
			this.OppType = undefined;
			this.s3 = undefined;
			this.Custno = undefined;
			//*****************End Of PCR026243 DL:1803 Display Migration to Q2C*****************
		}
	});
});