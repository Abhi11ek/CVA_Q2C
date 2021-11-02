/**-------------------------------------------------------------------------------*
 * This class return display Display RRA form model.                              *
 * ------------------------------------------------------------------------------ *
 * @class                                                                         *
 * @public                                                                        *
 * @author Abhishek Pant                                                          *
 * @since 25 November 2019                                                        *
 * @extends                                                                       *
 * @name com.amat.crm.opportunity.model.disRRAModel                               *
 * *------------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 25/01/2021      Abhishek        PCR033306         Q2C Display Enhancements     *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 ***********************************************************************************
 */

sap.ui.define(function () {
	"use strict";
	var model = {
			/**
			 * This method use to convert String Date to Object.
			 *
			 * @name esaDisMode
			 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller, {sap.ui.model.Model} GeneralInfodata - GenInfoModel,
			 * @param {sap.ui.model.Model} PSRModel-PSRModel, {sap.ui.model.Model} SecurityData- SecurityModel, CbcData-ESAModel,
			 * @param {String} Status- RRA Status, {Boolean} editMode- Mode of view requested, {Boolean} SAFAction- SFA Flag,
			 * @param {Boolean} RPflag- ROM/POM Authorization Flag
			 * @returns {Object} RraModel - ESA Model For View Binding
			 */
			rraDisMode: function (thisCntrlr, GeneralInfodata, SecurityData, RraData, Status, editMode, SAFAction, RPflag) {
				var contactPer = false,
					chkLstPer = false,
					omAuth = false,
					pomAuth = false,
					gpmAuth = false,
					slsAuth = false,
					CcFlag = false;
				Status = Status === "" ? "0" : Status;
				omAuth = thisCntrlr.checkContact(GeneralInfodata.NAV_OM_INFO.results);
				slsAuth = thisCntrlr.checkContact(GeneralInfodata.NAV_SLS_INFO.results);
				gpmAuth = thisCntrlr.checkContact(GeneralInfodata.NAV_GPM_INFO.results);
				CcFlag = RraData.CcOppId !== "" && RraData.CcOpitmId !== "";
				var NotifyArr = [15, 17, 25, 35, 70, 75];
				var NotifyFlag = NotifyArr.indexOf(parseInt(Status)) >= 0;
				var oResource = thisCntrlr.bundle;
				var rdBtnGrp = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISPRRADISMADATRD);
	            if(rdBtnGrp.getButtons().length > 4){
					for(var i = 4; i < rdBtnGrp.getButtons().length; i++){
						rdBtnGrp.getButtons()[i].destroy();
						i--;
					}
				}
				if(RraData.PsrRequired === ""){
					if(GeneralInfodata.Region === oResource.getText("FRAGLLAMJ")){
						rdBtnGrp.getButtons().length >= 4 ? this.createRdBtn(oResource.getText("S2PSRRRANTAPPTXTAMJD"), rdBtnGrp, thisCntrlr): "";
				    }if(GeneralInfodata.EvalFlag === oResource.getText("S1TABLESALESTAGECOL")){
						rdBtnGrp.getButtons().length >= 4 ? this.createRdBtn(oResource.getText("S2PSRDCEVALTXT"), rdBtnGrp, thisCntrlr): "";
					}						
				} else {
					if(rdBtnGrp.getButtons().length > 4){
						for(var i = 4; i < rdBtnGrp.getButtons().length; i++){
							rdBtnGrp.getButtons()[i].destroy();
							i--;
						}
					}
				}
				var RraModel = {
					"RraDisBoxVis": parseInt(Status) === 0 ? true : false,
					"RraDecnBoxSelIndex": parseInt(Status) === 0 ? -1 : -1,
					"RraRDDisEnable": parseInt(Status) === 0 && SecurityData.InitPsr === oResource.getText("S1TABLESALESTAGECOL") ? true : false,
					"RraStatBarVis": parseInt(Status) === 0 ? false : true,
					"RraSclrContrVis": parseInt(Status) === 0 ? false : true,
					"RraGenInfoDtaVis": parseInt(Status) === 0 || parseInt(Status) >= 85 ? false : true,
					"RraStat": "Status:" + RraData.PsrStatDesc,
					"RraLokUpBtnTxt": oResource.getText("FRAGLOUPLIST"),
					"RraLokUpBtnIcon": oResource.getText("S2PSRSDASEARCHBTN"),
					"RraLokUpBtnVis": (parseInt(Status) !== 0 && !CcFlag) || parseInt(Status) >= 55 ? true : false,
					"RraLokUpBtnEbl": (parseInt(Status) !== 0 && !CcFlag) || parseInt(Status) >= 55 ? true : false,							
					"RraEditBtnTxt": editMode === true || RPflag === true ? oResource.getText("S2PSRSDACANBTNTXT") : oResource.getText(
						"S2CARMBTNEDIT"),
					"RraEditBtnIcon": editMode === true || RPflag === true ? oResource.getText("S2CANCELBTNICON") : oResource.getText(
						"S2PSRSDAEDITICON"),
					"RraEditBtnVis": parseInt(Status) < 60 ? ((parseInt(Status) !== 55 && parseInt(Status) !== 58) && !CcFlag ? true :
						 (parseInt(Status) === 17 && RraData.PsrType === oResource.getText("S2PSRSDASTATREPEAT") && !CcFlag ? true :
			             (parseInt(Status) === 55 || parseInt(Status) === 58  ? false : (CcFlag ? false :true)))) : (parseInt(Status) > 65 &&
			               parseInt(Status) <= 95) || parseInt(Status) === 60 ? false : true,
					"RraEditBtnEnbl": true,
					"RraSaveBtnTxt": oResource.getText("S1PERDLOG_SAVE"),
					"RraSaveBtnIcon": oResource.getText("S2PSRSDASAVEICON"),
					"RraSaveBtnVis": parseInt(Status) < 60 ? ((parseInt(Status) !== 55 && parseInt(Status) !== 58) && !CcFlag ? true :
						(parseInt(Status) === 17 && RraData.PsrType === oResource.getText("S2PSRSDASTATREPEAT") && !CcFlag ? true :
			             (parseInt(Status) === 55 || parseInt(Status) === 58  ? false : (CcFlag ? false :true)))) : (parseInt(Status) > 65 &&
			            	parseInt(Status) <= 95) || parseInt(Status) === 60 ? false : true,
					"RraSaveBtnEnbl": editMode === true ? true : false,
					"RraSFAppBtnTxt": (parseInt(Status) === 5 || parseInt(Status) === 4 || parseInt(Status) === 65) && SAFAction === true ? oResource.getText(
						"S2PSRSDASUBFORAPP") : (parseInt(Status) >= 85 ? oResource.getText("S2PSRSDASFBTNCANNATXT") : (parseInt(Status) === 5 ?
						oResource.getText("S2PSRSDASFCANINITXT") : (parseInt(Status) === 15 ? oResource.getText("S2PSRSDASFCONSPECTPEANDREWTXT") : (
							parseInt(Status) === 55 ? oResource.getText("S2PSRDCINITRRABTNTXTASC606") : (parseInt(Status) === 65 ?  oResource.getText(
								"S2PSRSDASFCONSSDAINITTXTASC606") : ""))))),
					"RraSFAppBtnIcon": (parseInt(Status) === 4 || parseInt(Status) === 5 || parseInt(Status) === 65 || parseInt(Status) === 17) && SAFAction === true ?
							oResource.getText("S2PSRSDAWFICON") : (parseInt(Status) >= 85 || parseInt(Status) === 5 ? oResource.getText("S2CANCELBTNICON") : ""),
					"RraSFAppBtnVis": parseInt(Status) < 55 && CcFlag ? false : ((parseInt(Status) === 5 || parseInt(Status) === 65 || (parseInt(Status) === 4 ||
							(parseInt(Status) === 15 && RraData.PsrType !== oResource.getText("S2PSRSDASTATREPEAT"))) && SAFAction === true)) || (parseInt(Status) ===
								55 && GeneralInfodata.Region !== oResource.getText("FRAGLLAMJ")) || (parseInt(Status) === 5 || parseInt(Status) >= 85) &&
								!CcFlag ? true : false,
					"RraSFAppBtnEnbl": parseInt(Status) === 5 || parseInt(Status) === 4 || parseInt(Status) >= 85 || parseInt(Status) === 65 || parseInt(Status) === 15 ||
					            parseInt(Status) === 55 ? true : false,
					"RraAddBtnEnbl": SecurityData.AddContact === oResource.getText("S1TABLESALESTAGECOL") && (editMode === true || RPflag ===
						true) || contactPer === true ? true : false,
					"RraConDelMod": SecurityData.DelContact === oResource.getText("S1TABLESALESTAGECOL") && (editMode === true || RPflag ===
						true) || contactPer === true ? oResource.getText("S2DELPOSVIZTEXT") : oResource.getText("S2DELNAGVIZTEXT"),
								
					"RraWFConPnlVis": parseInt(Status) >= 85 ? false : true,
					"RraWFConPnlExpd": parseInt(Status) === 5 || parseInt(Status) === 65 ? true : false,
					"RraSafPnlVis": parseInt(Status) > 60 ? false : true,
					"RraCbnCpyPnlVis": parseInt(Status) > 60 ? false : true,
					"RraCbnCpyPnlExpd": parseInt(Status) === 5 || RraData.NAV_RRA_CC.results.length > 0 ? true : false,
					"RraDetSpecTypPnlVis": parseInt(Status) > 60 ? false : true,
					"RraDetSpecTypPnlExpd": parseInt(Status) > 60 ? false : true,
					"RraSpecTypSFVis": parseInt(Status) > 60 ? false : true,
					"RraRelPerSpecPnlVis": parseInt(Status) <= 60 && RraData.PsrType === oResource.getText("S2PSRSDASTATREPEAT") ? true : false,
					"RraRelPerSpecPnlExpd": parseInt(Status) < 15 || RraData.NAV_REV_DOCS.results.length > 0 ? true : false,
					"RraCustSpecPnlVis": parseInt(Status) <= 60 && RraData.PsrType !== oResource.getText("S2PSRSDASTATREPEAT") ? true : false,
					"RraCustSpecPnlExpd": parseInt(Status) < 15 || RraData.NAV_CUST_REVSPEC.results.length > 0 ? true : false,
					"RraFnlSpecPnlVis": parseInt(Status) >= 17 && parseInt(Status) <= 60 && RraData.PsrType !== oResource.getText("S2PSRSDASTATREPEAT") ? true : false,
					"RraFnlSpecPnlExpd": (parseInt(Status) >= 17 && parseInt(Status) < 60) || RraData.NAV_FNL_DOCS.results.length > 0 ? true : false,							
					"RraBokRraPnlVis": parseInt(Status) > 5 && parseInt(Status) <= 65 ? true : false,
					"RraBokRraPnlExpd": parseInt(Status) >= 15 && parseInt(Status) < 60 || parseInt(Status) === 65 ? true : false,
					"RraSipMadatSFPnlVis": parseInt(Status) >= 60 && parseInt(Status) < 85 ? true : false,
					"RraSipRraPnlVis": parseInt(Status) >= 60 && parseInt(Status) < 85 ? true : false,
					"RraSipRraPnlExpd": parseInt(Status) >= 65 && parseInt(Status) < 85 ? true : false,
					"RraBRraAprPnlVis": parseInt(Status) >= 5 && parseInt(Status) <= 75 ? true : false,
					"RraBRraAprPnlExpd": parseInt(Status) >= 15 && parseInt(Status) < 55 ? true : false,
					"RraSRraAprPnlVis": parseInt(Status) >= 60 && parseInt(Status) < 85 ? true : false,
					"RraSRraAprPnlExpd": parseInt(Status) >= 65 && parseInt(Status) < 85 ? true : false,
					"RraResetLogPnlVis": RraData.NAV_RRA_RESET.results.length > 0  && parseInt(Status) <= 75 ? true : false,
					"RraResetLogPnlExpd": RraData.NAV_RRA_RESET.results.length > 0 ? true : false,
					"RraMainCommPnlVis": parseInt(Status) !== 0 ? true : false,
					"RraMainCommPnlExpd": parseInt(Status) >= 85 || RraData.NAV_RRA_COMMENTS.results.length > 0 ? true : false,
					"RraChngHisPnlVis": parseInt(Status) < 85 ? true : false,
					"RraChngHisPnlExpd": true,
					"RraInfoOppId": GeneralInfodata.OppId,
					"RraInfoItemNo": GeneralInfodata.ItemNo,
					"RraInfoAmatQuoteId": GeneralInfodata.AmatQuoteId,
					"RraInfoQuoteItemNo": GeneralInfodata.QuoteItemNo,
					"RraInfoSoNumber": GeneralInfodata.SoNumber,
					"RraInfoSlotNo": GeneralInfodata.SlotId,                                                                                                                         //PCR033306++; SlotNo replaced with SlotId
					"RraInfoOrderType": GeneralInfodata.OrderType,
					"RraInfoCustName": GeneralInfodata.CustName,
					"RraInfoFabName": GeneralInfodata.FabName,
					"RraInfoBu": GeneralInfodata.Bu,
					"RraInfoDivision": GeneralInfodata.Division,
					"RraInfoKpu": GeneralInfodata.Kpu,
					"RraInfoProdFamily": GeneralInfodata.ProdFamily,
					"RraInfoOppStatus": GeneralInfodata.S5FcastBSt,                                                                                                                  //PCR033306++; OppStatus replaced with S5FcastBSt
					"RraInfoFcstBookDate": GeneralInfodata.FcstBookDate,
					"RraInfoCurrcustReqDt": GeneralInfodata.CurrcustReqDt,
					"RraInfoFcstRevDate": GeneralInfodata.FcstRevDate,
					"RraInfoCustCoDtPri": GeneralInfodata.CustCoDtPri,
					"RraInfoAppName": GeneralInfodata.AppName,
					"RraInfoWeferSize": GeneralInfodata.WeferSize,
					"RraInfoChamberCode": GeneralInfodata.ChamberCode,
					"RraMainComtTxtenabled": ((parseInt(Status) > 1 || parseInt(Status) < 55) && editMode === true) || ((parseInt(Status) > 60 ||
							parseInt(Status)) <= 75 && editMode === true) || (parseInt(Status) === 60 || parseInt(Status) === 85 || parseInt(Status) === 95
							|| parseInt(Status) === 90 || parseInt(Status) === 55) ? true : false,
					"RraMainComSavBtnenabled": false,
					"RraCCLbTxt": CcFlag ? oResource.getText("S2PSRSDACCFRMTXT") + " " + RraData.CcOppId + "_" + RraData.CcOpitmId : "",
					"RraCcIpVis": parseInt(Status) !== 85 ? true : false,
					"RraCcIpEbl": editMode === true && (parseInt(Status) === 5 || parseInt(Status) === 4) ? true : false,
					"RraCcDLinkBtVis": RraData.NAV_RRA_CC.results.length > 0 && ((omAuth || gpmAuth) || RPflag) && parseInt(Status) < 55 && !CcFlag ? true : false,
					"RraCcDLinkBtEbl": ((omAuth ||gpmAuth || RPflag) && (editMode || parseInt(Status) === 55 || parseInt(Status) === 58 ||
							         parseInt(Status) === 60)) ? true : false,
					"RraCcDLinkBtIcon": oResource.getText("S4DISUNLINKBTNICON"),
					"RraSpecTypVal": RraData.PsrType,
					"RraRPSNATXT": oResource.getText("S2PSRSDANTINLISTBTN"),
					"RraRPSNAICON": oResource.getText("S2SUBMTFORAPPBTN"),
					"RraRPSNATyp": oResource.getText("S1EMPBTNTYP_TXT"),
					"RraRefUnLnk": RraData.RevOppId !== "" ? true : false,
					"RraPreNABtnVis": RraData.RevOppId === "" ? true : false,
					"RraPreOppVis": (RraData.RevOpitmId === "" && RraData.RevOppId === "") || (RraData.RevOpitmId !== "" && RraData.RevOppId !== "") ?
							true : false,
					"RraRefIPEbl": false,
					"RraPreIPEbl": editMode === true && (parseInt(Status) === 5 || parseInt(Status) === 4) ? true : false,
					"RraRefOppId": RraData.RevOppId,
					"RraRefOppVis": (RraData.RevOpitmId === "" && RraData.RevOppId !== "") && RraData.PsrType === oResource.getText("S2PSRSDASTATREPEAT") ? true : false,
					"RraRpsNAtabVis": (RraData.RevOpitmId === "" && RraData.RevOppId !== "") && RraData.PsrType === oResource.getText("S2PSRSDASTATREPEAT") ? true : false,
					"RraBJustVis": true,
					"RraBJustEnbl": parseInt(Status) === 15 && editMode,
					"RraBJustVal": RraData.BsdaJustfication,
					"RraSJustEnbl": parseInt(Status) === 65 && editMode,
					"RraSJustVal": RraData.SsdaJustfication,
					"RraSsdaSelEbl": parseInt(Status) === 65 && editMode === true ? true : false,
					"RraSDetRBEbl": parseInt(Status) === 65 ? false : false,
					"RraSDetSelIndex": RraData.SsdaReq === oResource.getText("S2POSMANDATANS") ? 1 : 0,
					"RraSDetValueState": RraData.SsdaReq === oResource.getText("S2POSMANDATANS") ? oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT"),
					"AprBtnVis": parseInt(Status) === 15 && RraData.PsrType !== oResource.getText("S2PSRSDASTATREPEAT") ? false : (parseInt(Status) > 5 &&
						       parseInt(Status) < 40 || (parseInt(Status) === 15 && SAFAction) ? true : (parseInt(Status) > 65 && parseInt(Status) < 85 ? true : false)),
					"AprBtnEbl": (parseInt(Status) > 5 && parseInt(Status) < 40 && parseInt(RraData.TaskId) !== 0 && SAFAction) || (parseInt(Status) > 65 &&
                               parseInt(Status) < 85 && parseInt(RraData.TaskId) !== 0) && SecurityData.SendApproval === oResource.getText("S2ODATAPOSVAL") ? true : false,
					"RecreatBtnTxt": parseInt(Status) === 55 ? oResource.getText("S4DISRRAREATBRRABTNTXT") : (parseInt(Status) === 60 ? oResource.getText("S4DISRRAREATSRRABTNTXT") : ""),
					"RecreatBtnVis": ((parseInt(Status) === 55 && RraData.SsdaResetFlag === "" && !CcFlag) || (parseInt(Status) === 60) && GeneralInfodata.ActShipDate === "") &&
					           parseInt(Status) < 85 && gpmAuth === true ? true : false,
				};
				var FooterBtn = thisCntrlr.that_views4.getContent()[0].getFooter().getContent();
				FooterBtn[2].setVisible(RraModel.AprBtnVis);
				FooterBtn[3].setVisible(RraModel.AprBtnVis);
				FooterBtn[2].setEnabled(RraModel.AprBtnEbl);
				FooterBtn[3].setEnabled(RraModel.AprBtnEbl);
				FooterBtn[4].setVisible(RraModel.RecreatBtnVis);
				FooterBtn[4].setText(RraModel.RecreatBtnTxt);
				FooterBtn[4].setEnabled(RraModel.RecreatBtnVis);
				FooterBtn[8].setVisible(NotifyFlag && (slsAuth || omAuth));
				RraModel.NAV_OM_INFO = GeneralInfodata.NAV_OM_INFO;
				RraModel.NAV_SLS_INFO = GeneralInfodata.NAV_SLS_INFO;
				RraModel.NAV_GPM_INFO = GeneralInfodata.NAV_GPM_INFO;
				RraModel.NAV_SME_INFO = GeneralInfodata.NAV_SME_INFO;
				RraModel.NAV_CON_INFO = GeneralInfodata.NAV_CON_INFO;
				RraModel.NAV_IW_INFO = GeneralInfodata.NAV_IW_INFO;				
				RraModel.NAV_SAF_QA = RraData.NAV_SAF_QA;
				RraModel.NAV_SAF_QA.SelectionIndex = RraData.NAV_SAF_QA.SalesFlg === oResource.getText("S2POSMANDATANS") ? 1 : RraData.NAV_SAF_QA.SalesFlg ===
					oResource.getText("S2NEGMANDATANS") ? 2 : 0;
				RraModel.NAV_SAF_QA.valueState = RraData.NAV_SAF_QA.SalesFlg === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText("S2DELNAGVIZTEXT");
				RraModel.NAV_SAF_QA.enabled = SecurityData.SafQa === oResource.getText("S2ODATAPOSVAL") && editMode === true && (parseInt(Status) === 5 ||
						parseInt(Status) === 4) ? true : false;				
				thisCntrlr.MandateData = {};
				thisCntrlr.MandateData.items = [RraData.NAV_SPEC_QA.results];
				var FinalQuesItems = this.fnDeterminePSRTY(thisCntrlr.MandateData, oResource.getText("S2PSRDETERMINDFTPARAM"), (parseInt(Status) === 5 ||
						parseInt(Status) === 4) && editMode === true && SecurityData.SpecTypQa === oResource.getText("S2ODATAPOSVAL"), parseInt(Status) === 15 &&
						editMode === true && SecurityData.SpecTypQa === oResource.getText("S2ODATAPOSVAL"), oResource.getText("S2ICONTABPSRTEXT"), true, thisCntrlr);
				RraModel.NAV_SPEC_QA= {"results": FinalQuesItems[0].items};				
				var UpldCustSpecVis = SecurityData.UpldCustSpec === oResource.getText("S2ODATAPOSVAL") ?  true : false;
				var UpldFnlSpecVis = SecurityData.UpldFnlSpec === oResource.getText("S2ODATAPOSVAL") ? true : false;
				RraModel.NAV_RRACHNG_HISTORY = RraData.NAV_RRACHNG_HISTORY;
				RraModel.NAV_BRRA_PARL = RraData.NAV_BRRA_PARL;
				RraModel.NAV_SRRA_PARL = RraData.NAV_SRRA_PARL;
				RraModel.NAV_BRRA_FINN = RraData.NAV_BRRA_FINN;
				RraModel.NAV_SRRA_FINN = RraData.NAV_SRRA_FINN;				
				RraModel.NAV_RRA_CC = RraData.NAV_RRA_CC;
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISRRACCTAB).setModel(thisCntrlr.getJSONModel(RraModel));
				parseInt(Status) >= 15 ? RraModel.NAV_RRA_QA = {"results": this.loadRraQa(RraData.NAV_RRA_QA.results.map(this.myFunction), parseInt(Status), "",
						editMode, thisCntrlr, oResource.getText("S4DISRRABRRATXT"))} : "";
				RraData.NAV_REV_DOCS.results = this.loadFPSRevDocData(RraData.NAV_REV_DOCS.results, editMode && (parseInt(Status) === 5 || parseInt(Status) === 4),
						editMode && (parseInt(Status) === 5 || parseInt(Status) === 4), UpldCustSpecVis, thisCntrlr);
				RraModel.NAV_REV_DOCS = RraData.NAV_REV_DOCS;
				RraData.NAV_FNL_DOCS.results = this.loadFPSRevDocData(RraData.NAV_FNL_DOCS.results, editMode && parseInt(Status) === 17, editMode && parseInt(Status) === 17,
						UpldFnlSpecVis, thisCntrlr);
				RraModel.NAV_FNL_DOCS = RraData.NAV_FNL_DOCS;
				RraData.NAV_CUST_REVSPEC.results = this.loadFPSRevDocData(RraData.NAV_CUST_REVSPEC.results, editMode && (parseInt(Status) === 5 || parseInt(Status) === 4),
						editMode && (parseInt(Status) === 5 || parseInt(Status) === 4), UpldCustSpecVis, thisCntrlr);
				RraModel.NAV_CUST_REVSPEC = RraData.NAV_CUST_REVSPEC;
				RraData.NAV_BRRA_EVDOC.results = this.loadFPSRevDocData(RraData.NAV_BRRA_EVDOC.results, editMode && parseInt(Status) === 15, editMode && parseInt(Status) === 15,
						UpldFnlSpecVis, thisCntrlr);
				RraModel.NAV_BRRA_EVDOC = RraData.NAV_BRRA_EVDOC;
				RraData.NAV_SRRA_EVDOC.results = this.loadFPSRevDocData(RraData.NAV_SRRA_EVDOC.results, editMode && parseInt(Status) === 65, editMode && parseInt(Status) === 65,
						UpldFnlSpecVis, thisCntrlr);
				RraModel.NAV_SRRA_EVDOC = RraData.NAV_SRRA_EVDOC;
				RraModel.NAV_RRA_COMMENTS = RraData.NAV_RRA_COMMENTS;
				RraModel.NAV_RRA_RESET = RraData.NAV_RRA_RESET;
				RraModel.SDAAssesCollection = {
						"results": [{"ProductId": oResource.getText("S2BSDASSMENTLVLOP"), "Name": oResource.getText("S2PSRSDAPDCSSDALVLDEFAULTTXT")},
						           {"ProductId": oResource.getText("S2PSRDCRRASHPODTXTASC606"), "Name": oResource.getText("S2PSRDCRRASHPODTXTASC606")},
						           {"ProductId": oResource.getText("S2PSRDCRRACARTXTASC606"), "Name": oResource.getText("S2PSRDCRRACARTXTASC606")},
						           {"ProductId": oResource.getText("S2PSRDCRRADEFERTXTASC606"), "Name": oResource.getText("S2PSRDCRRADEFERTXTASC606")},
						           {"ProductId": oResource.getText("S2BSDASSMENTLVLAMJD"), "Name": oResource.getText("S2BSDASSMENTLVLAMJD")}]};
				var BsdlkeyData = RraModel.SDAAssesCollection.results;
				RraModel.SDAAssesCollection.results.length = GeneralInfodata.Region !== oResource.getText("FRAGLLAMJ") && parseInt(Status) > 60 ?
						RraModel.SDAAssesCollection.results.length-1 : RraModel.SDAAssesCollection.results.length;
				var RraLvlArr = [oResource.getText("S4DISRRABRAPROP"), oResource.getText("S4DISRRASRAPROP")];
				for(var i = 0; i < RraLvlArr.length; i++){
					var Prop = RraLvlArr[i] === oResource.getText("S4DISRRABRAPROP") ? oResource.getText("S4DISRRABRRAPROP") : oResource.getText("S4DISRRASRRAPROP");
					switch(RraData[RraLvlArr[i]]){
					case "":
						//*****************Start Of PCR033306: Q2C Display Enhancements ***************************
						//RraModel[Prop] = BsdlkeyData[0].ProductId;
						if(parseInt(Status) === 15 && thisCntrlr.getView().getModel().getProperty("/SelectedBsdlVl") === oResource.getText("S2PSRDCRRASHPODTXTASC606")){
							RraModel[Prop] = BsdlkeyData[1].ProductId;
						} else {
							RraModel[Prop] = BsdlkeyData[0].ProductId;
						}
						//*****************End Of PCR033306: Q2C Display Enhancements *****************************
						break;
					case oResource.getText("S2PSRDCRRASHPODTXTASC606"):
						RraModel[Prop] = BsdlkeyData[1].ProductId;
						break;
					case oResource.getText("S2PSRDCRRACARTXTASC606"):
						RraModel[Prop] = BsdlkeyData[2].ProductId;
						break;
					case oResource.getText("S2PSRDCRRADEFERTXTASC606"):
						RraModel[Prop] = BsdlkeyData[3].ProductId;
						break;
					case oResource.getText("S2BSDASSMENTLVLAMJD"):
						RraModel[Prop] = BsdlkeyData[4].ProductId;
						break;	
					
					}
				}
				return RraModel;
			},			
			/**
			 * This method Handles filter Array.
			 * @name arrayRemove
			 * @param {Array} oneSelArr - AMJD Qid Array, {String} Qid - RRA Question Id
			 * @returns {Object} RRA Question Id Specific Object(Object)
			 */
			arrayRemove: function(oneSelArr, Qid){
				return oneSelArr.filter(function(ele){ return ele != Qid; });
			},
			/**
			 * This method is used to get selected Question Id.
			 * @name getAmjdArrayVS
			 * @param {Array} oneSelArr - AMJD Qid Array, {Object} RraQaData - RRA Question Data, {String} QusTyp - Question Type,
			 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller, {String} Prop - RRA Property,
			 * @param {String} Qid2Val - Selected RRA AMJD Question value
			 * @returns {Array} Selected Question Id and Other Skip Question Id Array (Array)
			 */
			getAmjdArrayVS: function(oneSelArr, RraQaData, QusTyp, thisCntrlr, Prop, Qid2Val){
				var oResource = thisCntrlr.getResourceBundle(), restArr = [], resultArr = [];
				for(var i = 0; i < oneSelArr.length-1; i++){
					restArr[i] = this.getCommObj(RraQaData, oResource.getText("S4DISRRAQUSIDTXT"), oneSelArr[i], QusTyp, thisCntrlr);
					if(restArr[i][0][Prop] !== ""){
						Qid2Val = restArr[i][0].Qid;
						resultArr = this.arrayRemove(oneSelArr, Qid2Val);
						break;}							
				}
				return [resultArr, Qid2Val];
			},
			/**
			 * This method used to validate Question value.
			 * @name validateQusMandat
			 * @param {Object Array} RraQaData - RRA Question Data, {String} Prop - RRA Property
			 * @returns {Boolean} flag(Binary)
			 */
			validateQusMandat: function(RraQaData, Prop){
				var flag = false;
				for (var i = 0; i < RraQaData.length; i++) {
					if(RraQaData[i][Prop] === "")flag = true;
					else{flag = false; break;}
				}
				return flag;
			},
			/**
			 * This method use to load RRA Question.
			 * @name loadRraQa
			 * @param {Object Array} RraQaData - Customer Specification Questions, {String} Status - RRA Status, {String} selQid - Selected Question Id,
			 * @param {Boolean} editMode - RRA Form Edit Flag, {sap.ui.core.mvc.Controller} thisCntr - Current Controller, {String} QusTyp - Type of Questions
			 * @returns fnlQaData - Final RRA Question
			 */
			loadRraQa: function(RraQaData, Status, selQid, editMode, thisCntrlr, QusTyp){
				var fnlQaData = [],skipFlag = false, gpmStatus = "", bmStatus = "", conStatus = "";
				var oResource = thisCntrlr.bundle;
				var ntRdArr = [1, 3, 11], comTxtArr = ["3005", "3055"], Prop = "", skipArr = [];
				var oneSelArr = ["3020", "3025", "3030"], restArr = [], Qid2GPMVal = "", Qid2IWVal = "", Qid2ConVal = "";
				if(oneSelArr.indexOf(selQid) >= 0)restArr = this.arrayRemove(oneSelArr, selQid);
				else {
					Qid2GPMVal = this.getAmjdArrayVS(oneSelArr, RraQaData, QusTyp, thisCntrlr, oResource.getText("S4DISRRAQUSGPMPROP"), Qid2GPMVal);
					Qid2IWVal = this.getAmjdArrayVS(oneSelArr, RraQaData, QusTyp, thisCntrlr, oResource.getText("S4DISRRAQUSBMPROP"), Qid2IWVal);
					Qid2ConVal = this.getAmjdArrayVS(oneSelArr, RraQaData, QusTyp, thisCntrlr, oResource.getText("S4DISRRAQUSCONPROP"), Qid2ConVal);
				}
				gpmStatus = 15;
				bmStatus = 25;
				conStatus = 35;
				if(selQid === ""){
					var GPMQusFlag = this.validateQusMandat(RraQaData, oResource.getText("S4DISRRAQUSGPMPROP"));
					var IWQusFlag = this.validateQusMandat(RraQaData, oResource.getText("S4DISRRAQUSBMPROP"));
					var ConQusFlag = this.validateQusMandat(RraQaData, oResource.getText("S4DISRRAQUSCONPROP"));
					Prop = Status === gpmStatus || Status === 17 ? oResource.getText("S4DISRRAQUSGPMPROP") : (Status === bmStatus && IWQusFlag ?
						oResource.getText("S4DISRRAQUSGPMPROP"): (Status === bmStatus && !IWQusFlag ? oResource.getText("S4DISRRAQUSBMPROP") :
						(Status === conStatus && ConQusFlag ? oResource.getText("S4DISRRAQUSBMPROP") : (Status === conStatus && !ConQusFlag ?
						   oResource.getText("S4DISRRAQUSCONPROP") : oResource.getText("S4DISRRAQUSCONPROP")))));
				} else {
					Prop = Status === gpmStatus ? oResource.getText("S4DISRRAQUSGPMPROP"): (Status === bmStatus ? oResource.getText("S4DISRRAQUSBMPROP") :
						oResource.getText("S4DISRRAQUSCONPROP"));
				}
				var GPMVsFlag = RraQaData[2][oResource.getText("S4DISRRAQUSGPMPROP")] === oResource.getText("S2POSMANDATANS") && (RraQaData[4][oResource.getText(
						"S4DISRRAQUSGPMPROP")] !== "" || RraQaData[5][oResource.getText("S4DISRRAQUSGPMPROP")] !== "" || RraQaData[6][oResource.getText(
						"S4DISRRAQUSGPMPROP")] !== "");
		        var IWVsFlag = RraQaData[2][oResource.getText("S4DISRRAQUSBMPROP")] === oResource.getText("S2POSMANDATANS") && (RraQaData[4][oResource.getText(
		        		"S4DISRRAQUSBMPROP")] !== "" || RraQaData[5][oResource.getText("S4DISRRAQUSBMPROP")] !== "" || RraQaData[6][oResource.getText(
		        		"S4DISRRAQUSBMPROP")] !== "");
			    var CONVsFlag = RraQaData[2][oResource.getText("S4DISRRAQUSCONPROP")] === oResource.getText("S2POSMANDATANS") && (RraQaData[4][oResource.getText(
			    		"S4DISRRAQUSCONPROP")] !== "" || RraQaData[5][oResource.getText("S4DISRRAQUSCONPROP")] !== "" || RraQaData[6][oResource.getText(
			    		"S4DISRRAQUSCONPROP")] !== "");
				for (var i = 0; i < RraQaData.length; i++) {
					if(skipFlag === true && skipArr.length === 0){
						if(RraQaData[0][Prop] === oResource.getText("S2POSMANDATANS") || RraQaData[0][Prop] === ""){skipArr.push(1);}
						if(RraQaData[2][Prop] === oResource.getText("S2NEGMANDATANS") || RraQaData[2][Prop] === ""){skipArr.push(3, 4, 5, 6);}
						if(RraQaData[8][Prop] === oResource.getText("S2NEGMANDATANS") || RraQaData[8][Prop] === ""){skipArr.push(9);}
						if(RraQaData[10][Prop] === oResource.getText("S2NEGMANDATANS") || RraQaData[10][Prop] === ""){skipArr.push(11);}
						if(RraQaData[13][Prop] === oResource.getText("S2NEGMANDATANS") || RraQaData[13][Prop] === ""){skipArr.push(14);}						
					}
					if(skipArr.indexOf(i)>=0){continue;}
					var obj = {};
					obj.Guid = RraQaData[i].Guid;
					obj.ItemGuid = RraQaData[i].ItemGuid;
					obj.Qtype = RraQaData[i].Qtype;
					obj.QaVer = RraQaData[i].QaVer;
					obj.Qid = RraQaData[i].Qid;
					obj.Qdesc = RraQaData[i].Qdesc;
					obj.OppId = RraQaData[i].OppId;
					obj.ItemNo = RraQaData[i].ItemNo;
					obj.enabled = Status === gpmStatus && editMode ? true : false;
					obj.BMenabled = Status === bmStatus && editMode ? true : false;
					obj.Conenabled = Status === conStatus && editMode ? true : false;
					obj.RraQuesRdVis = comTxtArr.indexOf(RraQaData[i].Qid)>=0 || RraQaData[i].Qid === "3015"? false : true;
					obj.RraQuesGPMIPVis = comTxtArr.indexOf(RraQaData[i].Qid)>=0 && Status >= 15 ? true : false;
					obj.RraQuesSalesIPVis = comTxtArr.indexOf(RraQaData[i].Qid)>=0 && Status >= 25 || RraQaData[i].SalesComm !== "" ? true : false;
					obj.RraQuesconIPVis = comTxtArr.indexOf(RraQaData[i].Qid)>=0 && Status >= 35 || RraQaData[i].ConComm !== "" ? true : false;
					obj.SalesComm = RraQaData[i].SalesComm;
					obj.GPMComm = RraQaData[i].GPMComm;
					obj.ConComm = RraQaData[i].ConComm;
					obj.GPMCommVS = comTxtArr.indexOf(RraQaData[i].Qid)>=0 && RraQaData[i].GPMComm === "" ? oResource.getText("S2ERRORVALSATETEXT") :
						            oResource.getText("S2DELNAGVIZTEXT");
					obj.SalesCommVS = comTxtArr.indexOf(RraQaData[i].Qid)>=0 && RraQaData[i].SalesComm === "" ? oResource.getText("S2ERRORVALSATETEXT") :
						            oResource.getText("S2DELNAGVIZTEXT");
					obj.conCommVS = comTxtArr.indexOf(RraQaData[i].Qid)>=0 && RraQaData[i].ConComm === "" ? oResource.getText("S2ERRORVALSATETEXT") :
						            oResource.getText("S2DELNAGVIZTEXT");
					if(selQid === ""){
						if(Qid2GPMVal[0].indexOf(RraQaData[i].Qid)>= 0 && Status >= 15){
							obj.SelectionIndex = 0;
							obj.valueState = oResource.getText("S2DELNAGVIZTEXT");
							obj.GPMFlg = "";
						} else if(Status >= 15){
							obj.SelectionIndex = RraQaData[i].GPMFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].GPMFlg ===
				                 oResource.getText("S2NEGMANDATANS") ? 2 : 0);
				            obj.valueState = RraQaData[i].GPMFlg !== "" || GPMVsFlag && oneSelArr.indexOf(RraQaData[i].Qid) >= 0 ? oResource.getText("S2DELNAGVIZTEXT") :
				            	   oResource.getText("S2ERRORVALSATETEXT");
				            obj.GPMFlg = RraQaData[i].GPMFlg;
						}
						if(Qid2IWVal[0].indexOf(RraQaData[i].Qid)>= 0 && Status >= 25){
							obj.BMSelectionIndex = 0;
							obj.BMvalueState = oResource.getText("S2DELNAGVIZTEXT");
							obj.SalesFlg = "";
						} else if(Status >= 25){
							obj.BMSelectionIndex = RraQaData[i].SalesFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].SalesFlg ===
				                   oResource.getText("S2NEGMANDATANS") ? 2 : 0);
			                obj.BMvalueState = RraQaData[i].SalesFlg !== "" || IWVsFlag && oneSelArr.indexOf(RraQaData[i].Qid) >= 0 ? oResource.getText("S2DELNAGVIZTEXT") :
			                	   oResource.getText("S2ERRORVALSATETEXT");
				            obj.SalesFlg = RraQaData[i].SalesFlg;
						}
						if(Qid2ConVal[0].indexOf(RraQaData[i].Qid)>= 0 && Status >= 35){
							obj.ConSelectionIndex = 0;
							obj.ConvalueState = oResource.getText("S2DELNAGVIZTEXT");
							obj.ConFlg = "";
						} else if(Status >= 35){
							obj.ConSelectionIndex = RraQaData[i].ConFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].ConFlg ===
				                 oResource.getText("S2NEGMANDATANS") ? 2 : 0);
			                obj.ConvalueState = RraQaData[i].ConFlg !== "" || CONVsFlag && oneSelArr.indexOf(RraQaData[i].Qid) >= 0 ? oResource.getText("S2DELNAGVIZTEXT") :
			                	 oResource.getText("S2ERRORVALSATETEXT");
				            obj.ConFlg = RraQaData[i].ConFlg;
						}
					} else {						
						if(RraQaData[i].Qid === selQid){
							var Prop = this.getProperty(parseInt(Status), oResource.getText("S4DISRRABRRATXT"), thisCntrlr);
							if(restArr.indexOf(RraQaData[i].Qid) >= 0){
								switch(selQid){
									case "3020":
									    obj.SelectionIndex = RraQaData[i].GPMFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].GPMFlg ===
				                              oResource.getText("S2NEGMANDATANS") ? 2 : 0);
									    obj.valueState = RraQaData[i].GPMFlg !== "" ? oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
									    obj.GPMFlg = RraQaData[i].GPMFlg;
									    obj.BMSelectionIndex = 0;
							            obj.BMvalueState = oResource.getText("S2DELNAGVIZTEXT");
							            obj.SalesFlg = "";
							            obj.ConSelectionIndex = 0;
							            obj.ConvalueState = oResource.getText("S2DELNAGVIZTEXT");
							            obj.ConFlg = "";
							            break;
									case "3025":
									    obj.SelectionIndex = 0;
							            obj.valueState = oResource.getText("S2DELNAGVIZTEXT");
							            obj.GPMFlg = "";
							            obj.BMSelectionIndex = RraQaData[i].SalesFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].SalesFlg ===
				                              oResource.getText("S2NEGMANDATANS") ? 2 : 0);
							            obj.BMvalueState = RraQaData[i].SalesFlg !== "" ? oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
							            obj.SalesFlg = RraQaData[i].SalesFlg;
							            obj.ConSelectionIndex = 0;
							            obj.ConvalueState = oResource.getText("S2DELNAGVIZTEXT");
							            obj.ConFlg = "";
							            break;
									case "3030":
									    obj.SelectionIndex = 0;
							            obj.valueState = oResource.getText("S2DELNAGVIZTEXT");
							            obj.GPMFlg = "";
							            obj.BMSelectionIndex = 0;
							            obj.BMvalueState = oResource.getText("S2DELNAGVIZTEXT");
							            obj.SalesFlg = "";
							            obj.ConSelectionIndex = RraQaData[i].ConFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].ConFlg ===
				                               oResource.getText("S2NEGMANDATANS") ? 2 : 0);
							            obj.ConvalueState = RraQaData[i].ConFlg !== "" ? oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
							            obj.ConFlg = RraQaData[i].ConFlg;
				                        break;
								}
							} else {
								switch(Prop){
									case oResource.getText("S4DISRRAQUSCONPROP"):
									    obj.SelectionIndex = RraQaData[i].GPMFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].GPMFlg ===
				                              oResource.getText("S2NEGMANDATANS") ? 2 : 0);
				                        obj.valueState = RraQaData[i].GPMFlg !== "" ? oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
				                        obj.GPMFlg = RraQaData[i].GPMFlg;
				                        obj.BMSelectionIndex = RraQaData[i].SalesFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].SalesFlg ===
				                              oResource.getText("S2NEGMANDATANS") ? 2 : 0);
				                        obj.BMvalueState = RraQaData[i].SalesFlg !== "" ? oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
				                        obj.SalesFlg = RraQaData[i].SalesFlg;
				                        obj.ConSelectionIndex = RraQaData[i].ConFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].ConFlg ===
				                               oResource.getText("S2NEGMANDATANS") ? 2 : 0);
				                        obj.ConvalueState = RraQaData[i].ConFlg !== "" ? oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
				                        obj.ConFlg = RraQaData[i].ConFlg;
				                        break;
				                    case oResource.getText("S4DISRRAQUSBMPROP"):
				                        obj.SelectionIndex = RraQaData[i].GPMFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].GPMFlg ===
				                              oResource.getText("S2NEGMANDATANS") ? 2 : 0);
				                        obj.valueState = RraQaData[i].GPMFlg !== "" ? oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
				                        obj.GPMFlg = RraQaData[i].GPMFlg;
				                        obj.BMSelectionIndex = RraQaData[i].SalesFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].SalesFlg ===
				                              oResource.getText("S2NEGMANDATANS") ? 2 : 0);
				                        obj.BMvalueState = RraQaData[i].SalesFlg !== "" ? oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
				                        obj.SalesFlg = RraQaData[i].SalesFlg;
				                        obj.ConSelectionIndex = 0;
							            obj.ConvalueState = oResource.getText("S2ERRORVALSATETEXT");
							            obj.ConFlg = "";
				                        break;
									case oResource.getText("S4DISRRAQUSGPMPROP"):
										obj.SelectionIndex = RraQaData[i].GPMFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].GPMFlg ===
				                              oResource.getText("S2NEGMANDATANS") ? 2 : 0);
									    obj.valueState = RraQaData[i].GPMFlg !== "" ? oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
									    obj.GPMFlg = RraQaData[i].GPMFlg;
									    obj.BMSelectionIndex = 0;
									    obj.BMvalueState = oResource.getText("S2ERRORVALSATETEXT");
									    obj.SalesFlg = "";
									    obj.ConSelectionIndex = 0;
							            obj.ConvalueState = oResource.getText("S2ERRORVALSATETEXT");
							            obj.ConFlg = "";
				                        break;
								}
							}
						} else {
							obj.SelectionIndex = RraQaData[i].GPMFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].GPMFlg ===
				                 oResource.getText("S2NEGMANDATANS") ? 2 : 0);
				            obj.valueState = RraQaData[i].GPMFlg !== "" ? oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
				            obj.GPMFlg = RraQaData[i].GPMFlg;
				            obj.BMSelectionIndex = RraQaData[i].SalesFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].SalesFlg ===
				                   oResource.getText("S2NEGMANDATANS") ? 2 : 0);
			                obj.BMvalueState = RraQaData[i].SalesFlg !== "" ? oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
				            obj.SalesFlg = RraQaData[i].SalesFlg;
				            obj.ConSelectionIndex = RraQaData[i].ConFlg === oResource.getText("S2POSMANDATANS") ? 1 : (RraQaData[i].ConFlg ===
				                 oResource.getText("S2NEGMANDATANS") ? 2 : 0);
			                obj.ConvalueState = RraQaData[i].ConFlg !== "" ? oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
				            obj.ConFlg = RraQaData[i].ConFlg;
						}
						var checkFlag = (selQid !== "" && (RraQaData[2].GPMFlg === oResource.getText("S2POSMANDATANS") || RraQaData[2].SalesFlg ===
							    oResource.getText("S2POSMANDATANS") || RraQaData[2].ConFlg === oResource.getText("S2POSMANDATANS"))) && (RraQaData[i].Qid === "3020" ||
							    RraQaData[i].Qid === "3025" || RraQaData[i].Qid === "3030");
						if(checkFlag){
							switch(Status){
							    case 15:								
				                  obj.valueState = RraQaData[4].GPMFlg !== "" || RraQaData[5].GPMFlg !== "" || RraQaData[6].GPMFlg  !== "" ?
				                	  oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
				                case 25:
				                  obj.valueState = RraQaData[4].GPMFlg !== "" || RraQaData[5].GPMFlg !== "" || RraQaData[6].GPMFlg  !== "" ?
				                	  oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");                                                                //PCR033306++;oResource typo mistake resolution
				                  obj.BMvalueState = RraQaData[4].SalesFlg !== "" || RraQaData[5].SalesFlg !== "" || RraQaData[6].SalesFlg  !== "" ?
				                	  oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
				                case 35:
				                  obj.valueState = RraQaData[4].GPMFlg !== "" || RraQaData[5].GPMFlg !== "" || RraQaData[6].GPMFlg  !== "" ?
				                	  oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
				                  obj.BMvalueState = RraQaData[4].SalesFlg !== "" || RraQaData[5].SalesFlg !== "" || RraQaData[6].SalesFlg  !== "" ?
				                	  oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
				                  obj.ConvalueState = RraQaData[4].ConFlg !== "" || RraQaData[5].ConFlg !== "" || RraQaData[6].ConFlg  !== "" ?
				                	  oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT");
							}
						}
					}
					obj.Comments = RraQaData[i].Comments;
					obj.ChangedBy = RraQaData[i].ChangedBy;
					obj.ChangedDate = RraQaData[i].ChangedDate;
					fnlQaData.push(obj);
					if(Status >= 15){
						skipFlag = this.setSkipFlag(i, RraQaData, Status, QusTyp, thisCntrlr);
					}
				}
				this.seDterminRraLvl(fnlQaData, Status, thisCntrlr, QusTyp);
				if(Status <= 35){fnlQaData = this.checkAutoRRAFil(fnlQaData, Status, thisCntrlr)}                                                                                    //PCR033306++
				return fnlQaData;
			},
			//*****************Start Of PCR033306: Q2C Display Enhancements ***************************
			/*
			 * This method use to Fill RRA Question By Default.
			 * @name checkAutoRRAFil
			 * @param {Object Array} fnlQaData - RRA Questions, {String} Status - RRA Status, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns {Object Array} fnlQaData - Final RRA Question
			 */
			checkAutoRRAFil: function(fnlQaData, Status, thisCntrlr){
				var oResource = thisCntrlr.bundle,
				    Prop = this.getProperty(parseInt(Status), oResource.getText("S4DISRRABRRATXT"), thisCntrlr),
				    i = 0;
				for(i in fnlQaData){
					if(fnlQaData[i][Prop] !== ""){
						return fnlQaData;
					}
				}
				i = 0;
				switch(Status){
				case 15:
					for(i in fnlQaData){
						if(fnlQaData[i].Qid === oResource.getText("S2PSRSAFQUSTXT")){
							fnlQaData[i].SelectionIndex = 1;
							fnlQaData[i].GPMFlg = oResource.getText("S2POSMANDATANS");
						} else {
							fnlQaData[i].SelectionIndex = 2;
							fnlQaData[i].GPMFlg = oResource.getText("S2NEGMANDATANS");
						}
						fnlQaData[i].valueState = oResource.getText("S2DELNAGVIZTEXT");
					}
					this.setProperty("/SelectedBsdlVl", oResource.getText("S2PSRDCRRASHPODTXTASC606"), thisCntrlr);
					break;
				case 25:
					for(i in fnlQaData){
						fnlQaData[i].BMSelectionIndex = fnlQaData[i].SelectionIndex;
						fnlQaData[i].SalesFlg = fnlQaData[i].GPMFlg;
						fnlQaData[i].BMvalueState = fnlQaData[i].valueState;
						fnlQaData[i].SalesComm = fnlQaData[i].GPMComm;
						fnlQaData[i].SalesCommVS = fnlQaData[i].GPMComm !== "" ? oResource.getText("S2DELNAGVIZTEXT") :
							oResource.getText("S2ERRORVALSATETEXT");
					}
					break;
				case 35:
					for(i in fnlQaData){
						fnlQaData[i].ConSelectionIndex = fnlQaData[i].BMSelectionIndex;
						fnlQaData[i].ConFlg = fnlQaData[i].SalesFlg;
						fnlQaData[i].ConvalueState = fnlQaData[i].BMvalueState;
						fnlQaData[i].ConComm = fnlQaData[i].SalesComm;
						fnlQaData[i].conCommVS = fnlQaData[i].SalesComm !== "" ? oResource.getText("S2DELNAGVIZTEXT") :
							oResource.getText("S2ERRORVALSATETEXT");
					}
					break;
				}
				return fnlQaData;
			},
			//*****************End Of PCR033306: Q2C Display Enhancements ***************************
			/**
			 * This method use to Determine RRA Spec Type.
			 * @name seDterminRraLvl
			 * @param {Object Array} fnlQaData - RRA Questions, {String} Status - RRA Status, {sap.ui.core.mvc.Controller} thisCntr - Current Controller,
			 * @param {String} QusTyp - Type of Questions
			 * @returns
			 */
			seDterminRraLvl: function(fnlQaData, Status, thisCntrlr, QusTyp){
				var oResource = thisCntrlr.bundle;
				if(Status > 5 && Status < 60){
					var upProp = this.getProperty(Status, QusTyp, thisCntrlr), RraLvlVal = "", spodFlag = false, rraProp = "/SelectedBsdlVl",
					amjdFlag = false, carFlag = false;
					var oneSelArr = ["3020", "3025", "3030"], QAmjdFlag = false;
					var nilFilterObj = this.getObject(fnlQaData, upProp, "", QusTyp, thisCntrlr);
					if(nilFilterObj.length > 0){
						var counter = 0;
					    for(var i = 0; i < nilFilterObj.length; i++){
						    QAmjdFlag = oneSelArr.indexOf(nilFilterObj[0].Qid) >= 0 ? true : false;
						    if(oneSelArr.indexOf(nilFilterObj[0].Qid) >= 0)counter++;
						    if(counter > 2){QAmjdFlag = false; break;}
						    if(QAmjdFlag === false)break;
					   }
					} else {
						QAmjdFlag = true;
					}
					if(nilFilterObj.length !== 0 && !QAmjdFlag){
						RraLvlVal = "";
					} else {
						var commFlag = this.CheckComm(fnlQaData, upProp, QusTyp, thisCntrlr, Status);
						if(commFlag){
							spodFlag = this.getSpodFlag(fnlQaData, upProp, QusTyp, thisCntrlr, Status);
							if(spodFlag){
								RraLvlVal = oResource.getText("S2PSRDCRRASHPODTXTASC606");
							} else {
								amjdFlag = this.getAmjdFlag(fnlQaData, upProp, QusTyp, thisCntrlr);
								if(amjdFlag){
									RraLvlVal = oResource.getText("S2BSDASSMENTLVLAMJD");
								} else {
									carFlag = this.getcarFlag(fnlQaData, upProp, QusTyp, thisCntrlr);
									if(carFlag){
										RraLvlVal = oResource.getText("S2PSRDCRRACARTXTASC606");
									} else {
										RraLvlVal = oResource.getText("S2PSRDCRRADEFERTXTASC606");
									}
								}
							}
						} else {
							RraLvlVal = "";
						}
					}
					this.setProperty(rraProp, RraLvlVal, thisCntrlr);
				} else {
					var BsdlValue = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData().Bsdl;
					this.setProperty(rraProp, BsdlValue, thisCntrlr);
				}				
			},
			/**
			 * This method use to check mandatory Comments Validation.
			 * @name CheckComm
			 * @param {Object Array} fnlQaData - RRA Questions, {String} upProp - RRA Question type Navigation, {String} QusTyp - Type of Questions ,
			 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller, {String} Status - RRA Status
			 * @returns validation Flag (Binary)
			 */
			CheckComm: function(fnlQaData, upProp, QusTyp, thisCntrlr, Status){
				var oResource = thisCntrlr.bundle, comm1Flag = false, comm2Flag = false,  prop = "",
                comm1VsFlag = true, comm2VsFlag = true;
				var ComArr = ["3001", "3005", "3050", "3055"];
				switch(Status){
				case 15:
					prop = oResource.getText("S4DISRRAGPMCOMTXT");
					break;
				case 25:
					prop = oResource.getText("S4DISRRASLSCOMTXT");
					break;
				case 35:
					prop = oResource.getText("S4DISRRACONCOMTXT");
					break;
				}
				comm1Flag = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), ComArr[0], QusTyp, thisCntrlr);
				comm1Flag = comm1Flag[0][upProp] === oResource.getText("S2NEGMANDATANS") ? true : false;
				comm2Flag = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), ComArr[2], QusTyp, thisCntrlr);
				comm2Flag = comm2Flag[0][upProp] === oResource.getText("S2POSMANDATANS") ? true : false;
				if(!comm1Flag && !comm2Flag)return true;
				if(comm1Flag){
					comm1VsFlag = this.getCommObj(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), ComArr[1], QusTyp, thisCntrlr);
					if(comm1VsFlag[0] === undefined) return false;                                                                                                                   //PCR033306++
					comm1VsFlag = comm1VsFlag[0][prop] === oResource.getText("S2DELNAGVIZTEXT") ? true : false;
				}
				if(comm2Flag){
					comm2VsFlag = this.getCommObj(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), ComArr[3], QusTyp, thisCntrlr);
					if(comm2VsFlag[0] === undefined) return false;                                                                                                                   //PCR033306++
					comm2VsFlag = comm2VsFlag[0][prop] === oResource.getText("S2DELNAGVIZTEXT") ? true : false;
				}
				return comm1VsFlag && comm2VsFlag ? true : false;				
			},
			/**
			 * This method use to get Comment Object.
			 * @name getCommObj
			 * @param {Object Array} fnlQaData - RRA Questions, {String} upProp - RRA Question type Navigation, {String} QusTyp - Question Id ,
			 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns result (Object)
			 */
			getCommObj: function(fnlQaData, upProp, reqVal, QusTyp, thisCntrlr){
				var oResource = thisCntrlr.bundle;				
				var result = fnlQaData.filter(function(obj) {
					  return obj[upProp] === reqVal;
					});
				return result;
			},
			/**
			 * This method use to Determine CAR RRA Level.
			 * @name getcarFlag
			 * @param {Object Array}fnlQaData - RRA Questions, {String}upProp - RRA Question type Navigation, {String} QusTyp - Type of Questions ,
			 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns
			 */
			getcarFlag: function(fnlQaData, upProp, QusTyp, thisCntrlr){
				var oResource = thisCntrlr.bundle, CarFlag = false;
				var CarArr = ["3035", "3040", "3045", "3010", "3050", "3070", "3080"];
				for(var j = 3; j <= CarArr.length-1 ; j++){
					CarFlag = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), CarArr[j], QusTyp, thisCntrlr);
					if(j !== 6){
						CarFlag = CarFlag[0][upProp] === oResource.getText("S2NEGMANDATANS") ? true : false;
						if(!CarFlag)return CarFlag;
					} else {
						var Amjd8Flag = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), "3075", QusTyp, thisCntrlr);
						if(Amjd8Flag[0][upProp] === oResource.getText("S2POSMANDATANS")){
							CarFlag = CarFlag[0][upProp] !== oResource.getText("S2POSMANDATANS") ? true : false;
						    if(!CarFlag)return CarFlag;
						}						
						CarFlag = this.checkCarCon(fnlQaData, upProp, QusTyp, thisCntrlr, [CarArr[0], CarArr[1]]);
						if(!CarFlag)return CarFlag;
						CarFlag = this.CheckAmjCon(fnlQaData, [CarArr[1], CarArr[2]], upProp, QusTyp, thisCntrlr);
					}
				}
				return CarFlag;
			},
			/**
			 * This method use to check RRA Level CAR Q3 and Q4 Validation.
			 * @name checkCarCon
			 * @param {Object Array} fnlQaData - RRA Questions, {String} upProp - RRA Question type Navigation, {String} QusTyp - Type of Questions ,
			 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller, {Array} CarArr - Q3 and Q4 Qid Array
			 * @returns
			 */
			checkCarCon: function(fnlQaData, upProp, QusTyp, thisCntrlr, CarArr){
				var oResource = thisCntrlr.bundle;
				for(var j = 0; j <= CarArr.length-1 ; j++){
					var CarFlag = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), CarArr[j], QusTyp, thisCntrlr);
					CarFlag = CarFlag[0][upProp] === oResource.getText("S2NEGMANDATANS") ? true : false;
					if(j === 0 && CarFlag){
						continue;
					} else if(j === 0 && !CarFlag){
						return true;
					} else if(j === 1 && CarFlag){
						return false;
					} else{
						return true;
					}
				}
			},
			/**
			 * This method use to Determine AMJD RRA Level.
			 * @name getAmjdFlag
			 * @param {Object Array}fnlQaData - RRA Questions, {String} upProp - RRA Question type Navigation, {String} QusTyp - Type of Questions ,
			 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns
			 */
			getAmjdFlag: function(fnlQaData, upProp, QusTyp, thisCntrlr){
				var AmjdArr = ["3010", "3020", "3040", "3045", "3001", "3050", "3070", "3080"];
				var oResource = thisCntrlr.bundle;
				var AmjdFlag = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), AmjdArr[0], QusTyp, thisCntrlr);
				AmjdFlag = AmjdFlag[0][upProp] === oResource.getText("S2POSMANDATANS") ? true : false;
				if(AmjdFlag){
					AmjdFlag = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), AmjdArr[1], QusTyp, thisCntrlr);
					AmjdFlag = AmjdFlag[0][upProp] === oResource.getText("S2POSMANDATANS") ? true : false;
					if(AmjdFlag){
						for(var j = 4; j <= AmjdArr.length-1 ; j++){
							AmjdFlag = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), AmjdArr[j], QusTyp, thisCntrlr);
							if(j !== 7){								
								AmjdFlag = AmjdFlag[0][upProp] === oResource.getText("S2NEGMANDATANS") ? true : false;
								if(!AmjdFlag)return AmjdFlag;
							} else {
								var Amjd8Flag = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), "3075", QusTyp, thisCntrlr);
								if(Amjd8Flag[0][upProp] === oResource.getText("S2POSMANDATANS")){
									AmjdFlag = AmjdFlag[0][upProp] !== oResource.getText("S2POSMANDATANS") ? true : false;
								    if(!AmjdFlag)return AmjdFlag;
								    else AmjdFlag = this.CheckAmjCon(fnlQaData, [AmjdArr[2], AmjdArr[3]], upProp, QusTyp, thisCntrlr);
								} else {
									AmjdFlag = this.CheckAmjCon(fnlQaData, [AmjdArr[2], AmjdArr[3]], upProp, QusTyp, thisCntrlr);
								}								
							}							
						}
					} else {
						return AmjdFlag;
					}
				}
			    return AmjdFlag;
			},
			/**
			 * This method use to check RRA Level Q8 Validation.
			 * @name CheckAmjCon
			 * @param {Object Array} fnlQaData - RRA Questions, {Array} AmjdArr - Q8 id Array, {String} upProp - RRA Question type Navigation,
			 * @param {String} QusTyp - Type of Questions, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns
			 */
			CheckAmjCon: function(fnlQaData, AmjdArr, upProp, QusTyp, thisCntrlr){
				var oResource = thisCntrlr.bundle, AmjdFlag = "";
				for(var j = 0; j < AmjdArr.length ; j++){
					AmjdFlag = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), AmjdArr[j], QusTyp, thisCntrlr);					
					AmjdFlag = AmjdFlag[0][upProp] === oResource.getText("S2POSMANDATANS") ? true : false;									
					if(j === 0 && AmjdFlag){
						continue;
					} else if(j === 0 && !AmjdFlag){
						return true;
					} else if(j === 1 && AmjdFlag){
						return true;
					} else {
						return false;
					}				
				}
				return AmjdFlag;
			},
			/**
			 * This method use to Determine SPOD RRA Level.
			 * @name getSpodFlag
			 * @param {Object Array}fnlQaData - RRA Questions, {String}upProp - RRA Question type Navigation, {String} QusTyp - Type of Questions ,
			 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns {Boolean} spodFlag - Binary
			 */
			getSpodFlag: function(fnlQaData, upProp, QusTyp, thisCntrlr, Status){
				var spodArr = ["3001", "3010", "3035", "3040", "3050", "3070", "3075", "3080"];
				var oResource = thisCntrlr.bundle;
				var spodFlag = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), spodArr[0], QusTyp, thisCntrlr);
				spodFlag = spodFlag[0][upProp] === oResource.getText("S2POSMANDATANS") ? true : false;
				if(spodFlag){
					for(var j =1; j <= spodArr.length-1 ; j++){
						if(j !== 7){
							var spodObj = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), spodArr[j], QusTyp, thisCntrlr);
							if(j === 1 && spodObj[0][upProp] === oResource.getText("S2POSMANDATANS")){
						    	var spod2Arr = ["3020", "3025", "3030"];
						    	for(var x = 0; x <= spod2Arr.length-1 ; x++){
						    		var spod2Obj = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), spod2Arr[x], QusTyp, thisCntrlr);
						    		spodFlag = spod2Obj[0][upProp] === oResource.getText("S2NEGMANDATANS")  ? true : false;						    		
						    		if(spod2Obj[0][upProp] === "") continue;
						    		else if(!spodFlag)return spodFlag;
						    		else break;
						    	}
						    } else {
						    	spodFlag = spodObj[0][upProp] === oResource.getText("S2NEGMANDATANS") ? true : false;
						        if(!spodFlag && spodObj[0].Qid !== "3075")return spodFlag;
						    }
						} else {
							var spodObj = this.getObject(fnlQaData, oResource.getText("S4DISRRAQUSIDTXT"), spodArr[j], QusTyp, thisCntrlr);
							if(!spodFlag && spodObj[0].Qid === "3080"){
								spodFlag = spodObj[0][upProp] === oResource.getText("S2NEGMANDATANS") ? true : false;}
							return spodFlag;
						}						
					}
				} else {
					return spodFlag;
				}
				return spodFlag;
			},
			/**
			 * This method use to get Selected Object From Array Of Object on Having Particular Property.
			 * @name getObject
			 * @param {Object Array} fnlQaData - RRA Questions, {String} upProp - RRA Question type Navigation, {String} reqVal - Requested Property Value ,
			 * @param {String} QusTyp - RRA Question Type, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns {Object} result - Required Object
			 */
			getObject: function(fnlQaData, upProp, reqVal, QusTyp, thisCntrlr){
				var oResource = thisCntrlr.bundle, skiparr = "";
				if(QusTyp === oResource.getText("S4DISRRABRRATXT")){
					skiparr = ["3005", "3015", "3055"];
				} else {
					skiparr = ["4005", "4015", "4055", "4065"];
				}				
				var result = fnlQaData.filter(function(obj) {
					  return obj[upProp] === reqVal;
					});
				for(var k=0; k<skiparr.length; k++){
				   result = result.filter(function(obj) {
					    return obj[oResource.getText("S4DISRRAQUSIDTXT")] !== skiparr[k];
					  });
				}
				return result;
			},
			/**
			 * This method use to get Skip RRA Questionnaire Flag according selection.
			 * @name setSkipFlag
			 * @param {String} SelRow - Selected Row, {Object Array} RraQaData - RRA Question Data, {String} Status - RRA Status ,
			 * @param {String} QusTyp - RRA Question Type, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns {Boolean} skipFlag - Binary
			 */
			setSkipFlag: function(SelRow, RraQaData, Status, QusTyp, thisCntrlr){
				 var ansTyp = this.getProperty(Status, QusTyp, thisCntrlr), skipFlag = false;
				 var oResource = thisCntrlr.bundle;
					switch(SelRow){
					case 0:
						skipFlag = RraQaData[0][ansTyp] !== oResource.getText("S2NEGMANDATANS") ? true : false;
						return skipFlag;
					case 2:
					case 3:
					case 4:
					case 5:
						skipFlag = RraQaData[2][ansTyp] !== oResource.getText("S2POSMANDATANS") ? true : false;
						return skipFlag;
					case 8:
						skipFlag = RraQaData[8][ansTyp] !== oResource.getText("S2POSMANDATANS") ? true : false;
						return skipFlag;
					case 10:
						skipFlag = RraQaData[10][ansTyp] !== oResource.getText("S2POSMANDATANS") ? true : false;
						return skipFlag;
					case 13:
						skipFlag = RraQaData[13][ansTyp] !== oResource.getText("S2POSMANDATANS") ? true : false;
						return skipFlag;
					}
			},
			/**
			 * This method use to get RRA Questionnaire Flag.
			 * @name getProperty
			 * @param {String} Status - RRA Status , {String} QusTyp - RRA Question Type, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns {Boolean} ansTyp - Answer Flag(Binary)
			 */
			getProperty: function(Status, QusTyp, thisCntrlr){
				var oResource = thisCntrlr.bundle, ansTyp = "";
				switch(Status){
			    case 5:
				case 4:
			    case 15:
			    case 17:
			    	ansTyp = oResource.getText("S4DISRRAQUSGPMPROP");
			    	break;
			    case 25:
			    	ansTyp = oResource.getText("S4DISRRAQUSBMPROP");
			    	break;
			    case 35:
			    	ansTyp = oResource.getText("S4DISRRAQUSCONPROP");
			    	break;
			    default:
			        ansTyp = oResource.getText("S4DISRRAQUSCONPROP");
			    }
				return ansTyp;
			},
			/**
			 * This method use to get RRA Document Navigation.
			 * @name getDocNav
			 * @param {String} table - RRA Documents Table Id , {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns {String} navName - Navigation Name
			 */
			getDocNav: function(table, thisCntrlr){
				var oResource = thisCntrlr.bundle, navName = "";
				switch(table){
				case com.amat.crm.opportunity.Ids.S4DISRRAREVDOCTAB:
				case com.amat.crm.opportunity.Ids.S4DISRRAREVDOCLINKTAB:
				    navName = oResource.getText("S4DISRRAREVDOCNAV");
				    break;
				case com.amat.crm.opportunity.Ids.S4DISRRACUSTSPECDETERTAB:
					navName = oResource.getText("S4DISRRACUSTDOCNAV");
					break;
				case com.amat.crm.opportunity.Ids.S4DISRRAFNLSPECTAB:
					navName = oResource.getText("S4DISRRAFNLDOCNAV");
					break;
				case com.amat.crm.opportunity.Ids.S4DISBRRAEVDCETAB:
					navName = oResource.getText("S4DISRRABRRAEVDOCNAV");
					break;
				case com.amat.crm.opportunity.Ids.S4DISSRRAEVDCETAB:
					navName = oResource.getText("S4DISRRASRRAEVLDOCNAV");
					break;
			    }
				return navName;
			},
			/**
			 * This method use to Load All RRA Document Type.
			 * @name loadFPSRevDocData
			 * @param {Object Array} FPSRevDocData - Document Type Data , {Boolean} Enableflag - Enable Flag, {Boolean} Enabledelflag - Enabled Flag,
			 * @param {Boolean} addupVisible - Upload Button Vis, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns FPSRDoc - Document Data
			 */
			loadFPSRevDocData: function(FPSRevDocData, Enableflag, Enabledelflag, addupVisible, thisCntrlr) {
				var oResource = thisCntrlr.bundle, FPSRDoc = [];
				for (var i = 0; i < FPSRevDocData.length; i++) {
					var doc = {
						"Guid": "",
						"DocId": "",
						"ItemGuid": "",
						"DocType": "",
						"DocSubtype": "",
						"DocDesc": "",
						"FileName": "",
						"OriginalFname": "",
						"Notes": "",
						"uBvisible": false,
						"bgVisible": false,
						"editable": true,
						"addupVisible": ""
					};
					doc.Guid = FPSRevDocData[i].Guid;
					doc.DocId = FPSRevDocData[i].DocId;
					doc.DocSubtype = FPSRevDocData[i].DocSubtype;
					doc.ItemGuid = FPSRevDocData[i].ItemGuid;
					doc.DocDesc = FPSRevDocData[i].DocDesc;
					doc.DocType = FPSRevDocData[i].DocType;
					doc.FileName = FPSRevDocData[i].FileName;
					doc.OriginalFname = FPSRevDocData[i].OriginalFname;
					doc.Notes = FPSRevDocData[i].Notes;
					doc.Enableflag = Enableflag;
					doc.addupVisible = addupVisible;
					doc.Enabledelflag = Enabledelflag;
					doc.uBvisible = FPSRevDocData[i].FileName === "" || FPSRevDocData[i].FileName === undefined ? true : false;
					doc.DeleteIcon = oResource.getText("S2PSRSDADELETEICON");
					doc.EditIcon = oResource.getText("S2PSRSDAEDITICON");
					doc.bgVisible = !doc.uBvisible;
					doc.editable = Enableflag && (FPSRevDocData[i].FileName === "" || FPSRevDocData[i].FileName === undefined) ? true : false;
					FPSRDoc.push(doc);
				}
				return FPSRDoc;
			},
			/**
			 * This method use to get PayLoad Key.
			 * @name getRraKey
			 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns PsrStatus - RRA Status, RraReq - RRA Required Property Value, ActionType - Type Of Action(Array)
			 */
			getRraKey: function(oEvent, thisCntrlr){
				var SelRdTxt = oEvent.getSource().getButtons()[oEvent.getSource().getSelectedIndex()].getText().split("("),
				SelTyp = "", ActionType = "", PsrStatus = "", RraReq = "";
				var oResource = thisCntrlr.bundle;
				SelTyp = SelRdTxt.length === 1 ? (SelRdTxt[0] === oResource.getText("S2PSRDCEVALTXT") ? oResource.getText("S2PSRDCEVALTXT") :
					     oResource.getText("S2CARMINITIATETXT")) : (SelRdTxt.length > 1 ? SelRdTxt[1].split(")")[0] : "");
				switch(SelTyp){
					case oResource.getText("S2CARMINITIATETXT"):
						ActionType = oResource.getText("S2ESAINITKEY");
						PsrStatus = "5";
						RraReq = oResource.getText("S2POSMANDATANS");
						break;
					case oResource.getText("S2PSRDCRRASHPODTXTASC606"):
						ActionType = oResource.getText("S2NEGMANDATANS");
						PsrStatus = "85";
						RraReq = oResource.getText("S2CBCSALESUCSSANS");
						break;
					case oResource.getText("S2PSRDCRRADEFERTXTASC606"):
						ActionType = oResource.getText("S2NEGMANDATANS");
						PsrStatus = "85";
						RraReq = oResource.getText("S2PSRDCNADEFERKEY");
						break;
					case oResource.getText("S2PSRDCEVALTXT"):
						ActionType = oResource.getText("S2NEGMANDATANS");
						PsrStatus = "90";
						RraReq = oResource.getText("S2ESAIDSPROSSEXDEDKYE");
						break;
					case oResource.getText("S2PDCAMJDTXT"):
						ActionType = oResource.getText("S2NEGMANDATANS");
						PsrStatus = "95";
						RraReq = oResource.getText("S2PSRCBCAPPROVEKEY");
						break;
				}
		       return [PsrStatus, RraReq, ActionType];
			},
			/**
			 * This method create radio button in radio button group.
			 * @name createRdBtn
			 * @param {String} btnText - Radio Button Text, {Array} rdBtnGrp - PSR/PDC radio Button Group Element, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns
			 */
			createRdBtn: function(btnText, rdBtnGrp, thisCntrlr){
				rdBtnGrp.addButton(new sap.m.RadioButton({text: btnText, valueState: thisCntrlr.bundle.getText("S2ERRORVALSATETEXT"), enabled: true, editable: true}));
			},
			/**
			 * This method used to get SRRA Initiation PayLoad.
			 * @name ssdaInitPayload
			 * @param {sap.ui.model.Model} oModel - Models Data, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns {Object} obj
			 */
			ssdaInitPayload: function(oModel, thisCntrlr){
				var obj = {};
				obj.ActionType = thisCntrlr.bundle.getText("S4DISRRASRRAINITKEY");
				obj.AprvComments = oModel[2].AprvComments;
				obj.Bd = oModel[2].Bd;
				obj.Bsdl = oModel[2].Bsdl;
				obj.ConComments = oModel[2].ConComments;
				obj.Custno = oModel[2].Custno;
				obj.Guid = oModel[0].Guid;
				obj.ItemGuid = oModel[0].ItemGuid;
				obj.PsrRequired = oModel[2].PsrRequired;
				obj.PsrStatDesc = oModel[0].ProductLine;
				obj.PsrStatus = "65";
				obj.PsrType = oModel[2].PsrType;
				obj.RevOpitmId = oModel[2].RevOpitmId;
				obj.RevOppId = oModel[2].RevOppId;
				obj.Sd = oModel[2].Sd;
				obj.SsdaReq = thisCntrlr.bundle.getText("S2POSMANDATANS");
				obj.Ssdl = oModel[2].Ssdl;
				obj.TaskId = oModel[2].TaskId;
				obj.WiId = oModel[2].WiId;
				return obj;
			},
			/**
			 * This method used to get BRRA Initiation Payload.
			 * @name InitPayload
			 * @param {sap.ui.base.Event} oEvent - Holds the current event, {sap.ui.model.Model} PSRData - RRA Data,
			 * @param {sap.ui.model.Model} GeneralInfodata - General Info Model, {String} PsrStatus - RRA Status, {String} RraReq - RRA Required,
			 * @param {String} ActionType - Type of Action
			 * @returns {Object} obj
			 */
			InitPayload: function(oEvent, PSRData, GeneralInfodata, PsrStatus, RraReq, ActionType){
				var obj = {};
				obj.Guid = GeneralInfodata.Guid;
				obj.ItemGuid = GeneralInfodata.ItemGuid;
				obj.PsrRequired = RraReq;
				obj.PsrType = PSRData.PsrType;
				obj.PsrStatus = PsrStatus;
				obj.PsrStatDesc = GeneralInfodata.ProductLine;
				obj.SsdaJustfication = PSRData.SsdaJustfication;
				obj.BsdaJustfication = PSRData.BsdaJustfication;
				obj.Bsdl = "";
				obj.ConComments = "";
				obj.Ssdl = "";
				obj.AprvComments = "";
				obj.ActionType = ActionType;
				obj.TaskId = "";
				obj.WiId = "";
				return obj;
			},
			/**
			 * This method used to set view binding model Property.
			 * @name setProperty
			 * @param {String} Prop - Property Name, {String} Value - Property Value, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns
			 */
			setProperty: function(Prop, Value, thisCntrlr){
				thisCntrlr.getView().getModel().setProperty(Prop, Value);
			},
			/**
			 * This method used to set RRA Documents Type Panels Visibility.
			 * @name setCustFnlRelPnl
			 * @param {String} CustPnl - Customer Specification Panel, {String} FnlPnl - Final Spec Document Panel, {String} RelPnl - Relative Spec Document,
			 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns
			 */
			setCustFnlRelPnl: function(CustPnl, FnlPnl, RelPnl, thisCntrlr){
				var PropArr = [{prp: "/RraCustSpecPnlVis", val: CustPnl}, {prp: "/RraFnlSpecPnlVis", val: FnlPnl}, {prp: "/RraRelPerSpecPnlVis", val: RelPnl}];
				for(var i=0; i < PropArr.length; i++){
					this.setProperty(PropArr[i].prp, PropArr[i].val, thisCntrlr);
                }
			},
			/**
			 * This method used to create Copy Array.
			 * @name myFunction
			 * @param {Array} arr
			 * @returns {Array}  arr
			 */
			myFunction: function(arr){
				return arr;
			},
			/**
			 * This method used to Determine Customer Specification Type.
			 * @name OnDetmineSST
			 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns {Array} arr
			 */
			OnDetmineSST: function(oEvent, thisCntrlr){				
				var changeLine = oEvent.getSource().getParent().getBindingContext().getPath().slice(-1),
				    oResource = thisCntrlr.bundle,
				    RraData = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData();
				thisCntrlr.MandateData.items = [RraData.NAV_SPEC_QA.results.map(this.myFunction)];
				var ASCType = true,
				    QusNo = 2,
				    MainData;
				for (var i = 0; i < thisCntrlr.MandateData.items[0].length; i++) {
					if (parseInt(changeLine) === i) {
						if (parseInt(RraData.PsrStatus) === 4 || parseInt(RraData.PsrStatus) === 5) {
							var Select = true;
							if (oEvent.getSource().getSelectedIndex() === 1) {
								Select = true;
								thisCntrlr.MandateData.items[0][i].SalesFlg = oResource.getText("S2POSMANDATANS");
							} else if (oEvent.getSource().getSelectedIndex() === 2) {
								Select = false;
								thisCntrlr.MandateData.items[0][i].SalesFlg = oResource.getText("S2NEGMANDATANS");
							}
							thisCntrlr.MandateData.items[0][i].Selected = Select;
							if (parseInt(changeLine) === QusNo && Select === true) {
								RraData.PsrType = oResource.getText("S2PSRSDASTATNEW");
							} else if (parseInt(changeLine) === QusNo && Select === false) {
								RraData.PsrType = "";
							}
						} else {
							thisCntrlr.MandateData.items[0][i].GPMValueState = oResource.getText(
								"S2DELNAGVIZTEXT");
							if (oEvent.getSource().getSelectedIndex() === 1) {
								thisCntrlr.MandateData.items[0][i].GPMFlg = oResource.getText("S2POSMANDATANS");
								thisCntrlr.MandateData.items[0][i].GPMSelected = true;
								thisCntrlr.MandateData.items[0][i].GPMSelectionIndex = 1;
							} else if (oEvent.getSource().getSelectedIndex() === 2) {
								thisCntrlr.MandateData.items[0][i].GPMFlg = oResource.getText("S2NEGMANDATANS");
								thisCntrlr.MandateData.items[0][i].GPMSelected = false;
								thisCntrlr.MandateData.items[0][i].GPMSelectionIndex = 2;
							}
						}
					}
				}
				if (parseInt(RraData.PsrStatus) === 4 || parseInt(RraData.PsrStatus) === 5) {
					MainData = this.fnDeterminePSRTY(thisCntrlr.MandateData, changeLine, true, false, oResource.getText("S2ICONTABPSRTEXT"), ASCType, thisCntrlr);
					var PSRTypeTxt= "", valFlag = true;
					var ansData = {
						"results": []
					};
					if (MainData[1] === false && (MainData[2] === false && MainData[3] === false)) {
						PSRTypeTxt = "";
						this.setCustFnlRelPnl(false, false, false, thisCntrlr);
						if(MainData[0].items.length === 2){
							ansData.results = [MainData[0].items[0], MainData[0].items[1]];
						}
						else {
						    ansData.results = [MainData[0].items[0], MainData[0].items[1], MainData[0].items[2], MainData[0].items[3],
							MainData[0].items[4], MainData[0].items[5]];
						}
					} else if (MainData[1] === true) {
						PSRTypeTxt = oResource.getText("S2PSRSDASTATNEW");
							ansData.results = [MainData[0].items[0], MainData[0].items[1]];
						this.setCustFnlRelPnl(true, false, false, thisCntrlr);
					} else {
						if (MainData[3] === true) {
							PSRTypeTxt = oResource.getText("S2PSRSDASTATREVISED");
							this.setCustFnlRelPnl(true, false, false, thisCntrlr);
						} else {
							PSRTypeTxt = oResource.getText("S2PSRSDASTATREPEAT");
							if (RraData.RevOppId === "" && RraData.RevOpitmId === ""){
								this.setProperty("/RraPreNABtnVis", true, thisCntrlr);
							}
							this.setCustFnlRelPnl(false, false, true, thisCntrlr);
						}
							if(ASCType === true){
							ansData.results = [MainData[0].items[0], MainData[0].items[1], MainData[0].items[2], MainData[0].items[3],
												MainData[0].items[4], MainData[0].items[5]];
						}
					}
					for(var valueState in MainData[0].items) {
                        if(MainData[0].items[valueState].valueState === oResource.getText("S2ERRORVALSATETEXT")) {
                        	valFlag = false; break;}
                    }
					thisCntrlr.getView().getModel().getData().NAV_SPEC_QA = {"results":ansData.results};
					thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData().PsrType = valFlag === true ? PSRTypeTxt : "";
					thisCntrlr.getView().getModel().setProperty("/RraSpecTypVal", (valFlag === true ? PSRTypeTxt : ""));
					thisCntrlr.getView().getModel().refresh(true);
				} else {
					MainData = this.fnDetermineBMOAns(thisCntrlr.MandateData, changeLine, false, true, oResource.getText("S2ICONTABPSRTEXT"), false, thisCntrlr);
					this.specTypeDeter(MainData, changeLine, false, true, false, thisCntrlr);
					if (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISRRASTATTXT).getText() === oResource.getText("S2PSRSDASTATNEW")) {
							MainData.items.length = 2;
					}
					thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData().PsrType = PSRTypeTxt;
					thisCntrlr.getView().getModel().getData().NAV_SPEC_QA = {"results":MainData.items};
					thisCntrlr.getView().getModel().refresh(true);
					var rejCond = MainData.items[0].GPMSelectionIndex>0 && MainData.items[1].GPMSelectionIndex>0;
					if(rejCond){
						var quschek = this.qusDiffCheck(thisCntrlr);
						var RejBtn = thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISREJBTN);
						(quschek !== 0)?(RejBtn.setVisible(true), RejBtn.setEnabled(true)): (RejBtn.setVisible(true), RejBtn.setEnabled(false));
					}
				}
			},
			/**
			 * This method Used for Determine Customer Specification Type According to GPM Answers.
			 * @name fnDetermineBMOAns
			 * @param {Object} RRA Data, {String} changeLine- Change Selected Line#, {Boolean} SalesEnable-Sales Enable Flag, {Boolean} BMOEnable - GPM Enable Flag,
			 * @param {String} QusType - Question Type, {String} ASCType -ASC606 Type
			 * @returns FinalQuesItems - Final Questionnaire Data
			 */
			fnDetermineBMOAns: function(Data, changeLine, SalesEnable, BMOEnable, QusType, ASCType, thisCntrlr) {
				var FinalQuesItems = {
					"items": []},
					tempQuesItems = "",
					OrgQuesItems = [],
					oResource = thisCntrlr.bundle;
				for (var i = 0, m = 0; i < Data.items[0].length; i++) {
					var temp = {};
					temp.Qdesc = Data.items[0][i].Qdesc;
					temp.QaVer = Data.items[0][i].QaVer;
					if (Data.items[0][i].SalesFlg === oResource.getText("S2POSMANDATANS")) {
						temp.valueState = oResource.getText("S2DELNAGVIZTEXT");
						temp.Selected = true;
						temp.SelectionIndex = 1;
					} else if (Data.items[0][i].SalesFlg === oResource.getText("S2NEGMANDATANS")) {
						temp.valueState = oResource.getText("S2DELNAGVIZTEXT");
						temp.Selected = false;
						temp.SelectionIndex = 2;
					} else {
						temp.Selected = "";
						temp.SelectionIndex = 0;
						temp.valueState = oResource.getText("S2ERRORVALSATETEXT");
					}
					temp.GPMEnabled = BMOEnable;
					temp.enabled = SalesEnable;
					if (i === 1) {
						if ((Data.items[0][i].GPMSelected === undefined && thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISRRASTATTXT)
							.getText() === oResource.getText("S2PSRSDASTATNEW")) || (ASCType === true && Data.items[0][i].GPMSelected === undefined)) {
							temp.GPMValueState = oResource.getText("S2ERRORVALSATETEXT");
							temp.GPMSelected = false;
							temp.GPMSelectionIndex = 0;
							FinalQuesItems.items[m] = temp;
							m++;
							var TempArr = [FinalQuesItems];
							return FinalQuesItems;
						} else {
							temp.GPMValueState = Data.items[0][i].GPMValueState;
							temp.GPMSelected = Data.items[0][i].GPMSelected;
							temp.GPMSelectionIndex = Data.items[0][i].GPMSelectionIndex;
						}
						if (Data.items[0][i].GPMSelected === true && thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISRRASTATTXT)
							.getText() === oResource.getText("S2PSRSDASTATNEW")) {
							FinalQuesItems.items[m] = temp;
							m++;
							var TempArr = [FinalQuesItems];
							return FinalQuesItems;
						}
					} else {
						if (Data.items[0][i].GPMSelected === undefined) {
							temp.GPMValueState = oResource.getText("S2ERRORVALSATETEXT");
							temp.GPMSelected = false;
							temp.GPMSelectionIndex = 0;
						} else {
							temp.GPMValueState = Data.items[0][i].GPMValueState;
							temp.GPMSelected = Data.items[0][i].GPMSelected;
							temp.GPMSelectionIndex = Data.items[0][i].GPMSelectionIndex;
						}
					}
					FinalQuesItems.items[m] = temp;
					m++;
				}
				var TempArr = [FinalQuesItems];
				return FinalQuesItems;
			},
			/**
			 * This method Used for Determine Spec Type.
			 * @name getRraProty
			 * @param {String} Status - RRA Status
			 * @returns {Array} Property Array
			 */
			getRraProty: function(Status, oResource){
				var Prop = "", comProp = "";
				switch(Status){
				case 15:
					Prop = oResource.getText("S4DISRRAGPMPRPTXT");
					comProp = oResource.getText("S4DISRRAGPMCOMTXT");
					break;
				case 25:
					Prop = oResource.getText("S4DISRRASLSPRPTXT");
					comProp = oResource.getText("S4DISRRASLSCOMTXT");
					break;
				case 35:
					Prop = oResource.getText("S4DISRRACONPRPTXT");
					comProp = oResource.getText("S4DISRRACONCOMTXT");
					break;
				}
				return [Prop, comProp];
			},
			/**
			 * This method Used for Determine Spec Type.
			 * @name specTypeDeter
			 * @param {Object} RRA Data, {String} changeLine- Change Selected Line#, {Boolean} salEdit - OM Edit Flag, {Boolean} GpmEdit - GPM Edit Flag,
			 * @param {String} ASCType - ASC606 Type, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns
			 */
			specTypeDeter: function(Data, changeLine, salEdit, GpmEdit, ASCType, thisCntrlr) {
				var PSrTextArr = [], RepeatFlag = false, NewFlag = false, errorFlag = false,
				    oResource = thisCntrlr.bundle, PSrText = "",
				    oView = thisCntrlr.getView();
				for(var i = 0; i < Data.items.length; i++){
					if(Data.items[i].GPMSelected === undefined){
						errorFlag = true;
						break;
					} else {
						if(i === 1 && Data.items[i].GPMSelected === true){
							NewFlag = true;
							break;
						} else {
							if(Data.items[i].GPMSelected === false && i > 1){
								RepeatFlag = false;
								break;
							} else if (i > 1){
								RepeatFlag = true;
							}						
						}
					}
				}
				for(var t= 0; t < Data.items.length; t++){
					if(Data.items[t].GPMValueState === oResource.getText("S2ERRORVALSATETEXT")){
						errorFlag = true;
					}
				}
				if(errorFlag && NewFlag === false){
					PSrText = "";
				} else if(NewFlag){
					PSrText = oResource.getText("S2PSRSDASTATNEW");
				} else {
					if (!NewFlag && RepeatFlag){
						PSrText = oResource.getText("S2PSRSDASTATREPEAT");
					} else {
						PSrText = oResource.getText("S2PSRSDASTATREVISED");
					}
				}
				oView.byId(com.amat.crm.opportunity.Ids.S4DISRRASTATTXT).setText(PSrText);
			},
			/**
			 * This method is used to Handle RRA Question Answers Difference.
			 * @name RraQusDiffCheck
			 * @param {Object} TabData - RRA Table Data, {String} SelectionIndex - GPM Selection Index, {String} BMSelectionIndex - BM Selection Index,
			 * @param {String} ConSelectionIndex - Controller Selection Index, {String} Status - Rra Status
			 * @returns {integer} difference.length - Length Of Different Question Answer Length.
			 */
			RraQusDiffCheck: function(TabData, SelectionIndex, BMSelectionIndex, ConSelectionIndex, Status) {
				var GPMData = [],
					IWData = [],
					difference = [];
				for (var j = 0; j < TabData.length; j++) {
					var GpmObj = {},
					    IWObj = {};
					GpmObj.Selected = TabData[j].SelectionIndex;
					IWObj.Selected = Status === 25 ? TabData[j].BMSelectionIndex : TabData[j].ConSelectionIndex;
					GPMData.push(GpmObj);
					IWData.push(IWObj);
				}
				IWData.forEach(function(a, i) {
					Object.keys(a).forEach(function(k) {
						if (a[k] !== GPMData[i][k]) {
							difference.push({
								Selected: GPMData[i].Selected,
								key: k,
								value: GPMData[i][k],
								index: i
							});
						}
					});
				});
				return difference.length;
			},
			/**
			 * This method is used to Handle RRA OM and GPM Answers Difference.
			 * @name qusDiffCheck
			 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns {ineger} difference.length - Length Of Different Question Answer Length.
			 */
			qusDiffCheck: function(thisCntrlr) {
				var SalesData = [],
				    BMOData = [],
					difference = [],
					TabData = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4RRADETERMINSPECTAB).getModel().getData().NAV_SPEC_QA.results;
				for (var j = 0; j < TabData.length; j++) {
					var byPassCond = j === 0;
					if (byPassCond) {
						continue;
					}
					var salesObj = {};
					var BmoObj = {};
					salesObj.Selected = TabData[j].Selected;
					BmoObj.Selected = TabData[j].GPMSelected;
					SalesData.push(salesObj);
					BMOData.push(BmoObj);
				}
				BMOData.forEach(function(a, i) {
					Object.keys(a).forEach(function(k) {
						if (a[k] !== SalesData[i][k]) {
							difference.push({
								Selected: SalesData[i].Selected,
								key: k,
								value: SalesData[i][k],
								index: i
							});
						}
					});
				});
				return difference.length;
			},
			/**
			 * This method Used for Determine PSR Type.
			 * @name fnDeterminePSRTY
			 * @param {Object} RRA Question Data, {String} param- Visibility, {Boolean} salesEnable-OM Enable Flag ,{Boolean} BMEnable- GPM Enable Flag,
			 * @param {String} QusType - Type of Question, {String} ASCType, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns {Array} FinalQuesItems - Final RRA Question Data, flagNew - New Flag, flagRepeat - Repeat Flag, flagRevised - Revised Flag
			 */
			fnDeterminePSRTY: function(QuesItems, param, salesEnable, BMEnable, QusType, ASCType, thisCntrlr) {
				var FinalQuesItems = {
						"items": []},
						tempQuesItems = true, OrgQuesItems = [];
				var tempObj = {}, valFlag = true,
					oResource = thisCntrlr.bundle,
					CurrentStatus = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISRRASTATTXT).getText().split(": ")[thisCntrlr.getView()
						.byId(com.amat.crm.opportunity.Ids.S4DISRRASTATTXT).getText().split(": ").length - 1],
				    flagNew = false,
					flagRepeat = false,
					flagRevised = false;
				for (var i = 0, m = 0; i < QuesItems.items[0].length; i++) {					
					var temp = {};
					if (QuesItems.items[0][i].GPMFlg === oResource.getText("S2POSMANDATANS")) {
						temp.GPMValueState = oResource.getText("S2DELNAGVIZTEXT");
						temp.GPMSelected = true;
						temp.GPMSelectionIndex = 1;
					} else if (QuesItems.items[0][i].GPMFlg === oResource.getText("S2NEGMANDATANS")) {
						temp.GPMValueState = oResource.getText("S2DELNAGVIZTEXT");
						temp.GPMSelected = false;
						temp.GPMSelectionIndex = 2;
					} else if (QuesItems.items[0][i].GPMValueState === oResource.getText("S2DELNAGVIZTEXT")) {
						temp.GPMSelected = QuesItems.items[0][i].GPMSelected;
						temp.GPMSelectionIndex = QuesItems.items[0][i].GPMSelectionIndex;
						temp.GPMValueState = QuesItems.items[0][i].GPMValueState;
					} else {
						temp.GPMSelected = "";
						temp.GPMSelectionIndex = 0;
						temp.GPMValueState = oResource.getText("S2ERRORVALSATETEXT");
					}
					temp.GPMEnabled = BMEnable;
					temp.QaVer = QuesItems.items[0][i].QaVer;
					temp.Qdesc = QuesItems.items[0][i].Qdesc;
					if (QuesItems.items[0][i].Selected !== undefined) {
						if (QuesItems.items[0][i].Selected === true) {
							temp.valueState = oResource.getText("S2DELNAGVIZTEXT");
							temp.Selected = true;
							temp.SelectionIndex = 1;
						} else if (QuesItems.items[0][i].Selected === false) {
							temp.valueState = oResource.getText("S2DELNAGVIZTEXT");
							temp.Selected = false;
							temp.SelectionIndex = 2;
						} else {
							temp.Selected = "";
							temp.SelectionIndex = 0;
							temp.valueState = oResource.getText("S2ERRORVALSATETEXT");
						}
					} else {
						if (QuesItems.items[0][i].SalesFlg === oResource.getText("S2POSMANDATANS")) {
							temp.valueState = oResource.getText("S2DELNAGVIZTEXT");
							temp.Selected = true;
							temp.SelectionIndex = 1;
						} else if (QuesItems.items[0][i].SalesFlg === oResource.getText("S2NEGMANDATANS")) {
							temp.valueState = oResource.getText("S2DELNAGVIZTEXT");
							temp.Selected = false;
							temp.SelectionIndex = 2;
						} else {
							temp.Selected = "";
							temp.SelectionIndex = 0;
							temp.valueState = oResource.getText("S2ERRORVALSATETEXT");
						}
					}
					temp.enabled = salesEnable;
					FinalQuesItems.items[m] = temp;
					m++;
					var RraType = thisCntrlr.getView().getModel().getProperty("/RraSpecTypVal"),
					    Status  = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData().PsrStatus;
					RraType = parseInt(Status) === 5 &&  i === 1 && temp.Selected === false ? oResource.getText("S4DISRRASRRAINITKEY") : RraType;
					var selRraType = i === 1 && temp.Selected === true ? oResource.getText("S2PSRSDASTATNEW") : "";
					if( i === 1 && (selRraType === oResource.getText("S2PSRSDASTATNEW") || RraType === oResource.getText("S2PSRSDASTATNEW") ||
						 RraType === "") && (parseInt(Status) === 4 || parseInt(Status) === 5 || parseInt(Status) >= 17) && (temp.Selected === true ||
							QuesItems.items[0][1].SalesFlg === oResource.getText("S2POSMANDATANS"))){
						flagNew = true;
						flagRepeat = false;
						flagRevised = false;
						return [FinalQuesItems, flagNew, flagRepeat, flagRevised];
					} else if (i === 1 && temp.Selected === true && (RraType === oResource.getText("S2PSRSDASTATNEW") || RraType === "") && (parseInt(Status) === 4 ||
						 parseInt(Status) === 5 || parseInt(Status) >= 17) && (QuesItems.items[0][1].Selected === undefined || QuesItems.items[0][1].SalesFlg === "")){
                        flagNew = false;
						flagRepeat = false;
						flagRevised = false;
						return [FinalQuesItems, flagNew, flagRepeat, flagRevised];
					} else {
						flagNew = false;
						if(i=== 1 && temp.Selected === true && (((salesEnable && RraType === oResource.getText("S2PSRSDASTATNEW") && ((QuesItems.items[0][0].Selected === undefined ||
							QuesItems.items[0][0].SalesFlg === "") || (QuesItems.items[0][1].Selected === undefined ||  QuesItems.items[0][1].SalesFlg === ""))) || (((BMEnable ||
								parseInt(Status) === 15)) && RraType === oResource.getText("S2PSRSDASTATNEW"))))){
							flagNew = false;
						    flagRepeat = false;
						    flagRevised = false;
						    return [FinalQuesItems, flagNew, flagRepeat, flagRevised];
						} else {
							if (i === 2 || i === 3 || i === 4 || i === 5) {
								if (QuesItems.items[0][i].Selected !== undefined ||  QuesItems.items[0][i].SalesFlg !== "") {
									if (((salesEnable || parseInt(Status) === 5) && (QuesItems.items[0][i].Selected === false || QuesItems.items[0][i].SalesFlg === oResource.getText(
										"S2DELNAGVIZTEXT")) ||(BMEnable || parseInt(Status) === 15)) && tempQuesItems === true) {
										tempQuesItems = false;
									}
								}
							 }	
						}							
					}
				}
				for(var valueState in FinalQuesItems.items) {
                    if(FinalQuesItems.items[valueState].valueState === oResource.getText("S2ERRORVALSATETEXT")) {
                    	valFlag = false; break;
                    }
                }
				if(valFlag === true){
                    for(var t = 2; t < FinalQuesItems.items.length; t++){
                    	if(salesEnable){
                    		if(FinalQuesItems.items[t].Selected === true){
                    			flagRepeat = true;
                    		} else {
                    			flagRepeat = false;
                    			break;
                    		}
                    	}
                    }
                    if(flagRepeat){
					     flagRepeat = true; flagRevised = false;
					} else {
						flagRepeat = false;flagRevised = true;
					}
                } else {
                    flagRepeat = false; flagRevised = false;
                }
				return [FinalQuesItems, flagNew, flagRepeat, flagRevised];
			},
			/**
			 * This method Handles Note live Change Event.
			 * @name RraNoteLiveChange
			 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns
			 */
			RraNoteLiveChange: function(oEvt, thisCntrlr) {
				var saveBtn,
				    oResource = thisCntrlr.getResourceBundle(),
				    tabBindingModel = oEvt.getSource().getModel().getData()[oEvt.getSource().getBindingContext().getPath().split("/")[1]].results;
				if (oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_TABLE) >= 0 ||
					     oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S2CBC_PANL_MEA_DOC_LIST_TABLE) >= 0) {
					saveBtn = oEvt.getSource().getParent().getCells()[4].getItems()[0].getItems()[0];
				} else {
					saveBtn = oEvt.getSource().getParent().getCells()[3].getItems()[0].getItems()[0];
				}
				var index = oEvt.getParameters().id.split(oResource.getText("S3SEPARATORTEXT"))[oEvt.getParameters().id.split(
					     oResource.getText("S3SEPARATORTEXT")).length - 1],
					docSubType = tabBindingModel[index].DocSubtype;
				if (oEvt.getParameters().value.length >= 255) {
					saveBtn.setEnabled(false);
					oEvt.getSource().getParent().getCells()[3].getItems()[1].getItems()[0].setEnabled(false);
					oEvt.getSource().setValue(oEvt.getParameters().value.substr(0, 254));
					thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCMCOMMVALTXT"));
				} else if (oEvt.getParameters().value.length === 0) {
					if (docSubType === oResource.getText("S3PBCDT") || docSubType === oResource.getText(
							"S3PBDT") || docSubType === oResource.getText("S3BDT")) {
						oEvt.getSource().getParent().getCells()[2].setValueState(sap.ui.core.ValueState.Warning);
						oEvt.getSource().getParent().getCells()[3].getItems()[1].getItems()[0].setEnabled(false);
					}
				} else {
					saveBtn.setEnabled(true);
					oEvt.getSource().getParent().getCells()[2].setValueState(sap.ui.core.ValueState.None);
					if (oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S2ATTACHMENT_PANL_GENARALBOOKING_TABLE) >= 0||
						     oEvt.getParameters().id.indexOf(com.amat.crm.opportunity.Ids.S2CBC_PANL_MEA_DOC_LIST_TABLE) >= 0) {
						oEvt.getSource().getParent().getCells()[4].getItems()[0].getItems()[0].setEnabled(true);
					} else {
						oEvt.getSource().getParent().getCells()[3].getItems()[1].getItems()[0].setEnabled(true);
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
				var oResource = thisCntrlr.getResourceBundle();
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
			 * This method used for Delete press event.
			 * @name RraDeletePress
			 * @param {sap.ui.base.Event} event - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns
			 */
			RraDeletePress: function(event, thisCntrlr) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				var oResource = thisCntrlr.getResourceBundle();
				var rowIndex = thisCntrlr.source.getParent().getParent().getParent().getId().split("-")[thisCntrlr.source
					.getParent().getParent().getParent().getId().split("-").length - 1];
				var oTable = thisCntrlr.source.getParent().getParent().getParent().getParent();
				var flag = 0;
				$.each(thisCntrlr.tabBindingModel, function(key, value) {
					if (value.DocSubtype === thisCntrlr.tabBindingModel[rowIndex].DocSubtype) flag++;
				});
				if (thisCntrlr.source.getIcon().indexOf(oResource.getText("S2ATTCHDOCDELVALDDELTXT").toLowerCase()) >= 0) {
					if (flag === 1) {
						if (thisCntrlr.tabBindingModel[rowIndex].DocType !== oResource.getText("S2ICONTABCARMKEY") &&
								thisCntrlr.tabBindingModel[rowIndex].DocSubtype !== oResource.getText("S2ATTOTHTYPETEXT")) {
							var tObject = {
								"Guid": "",
								"DocId": "",
								"ItemGuid": "",
								"DocType": "",
								"DocSubtype": "",
								"DocDesc": "",
								"FileName": "",
								"OriginalFname": "",
								"Notes": "",
								"uBvisible": true,
								"bgVisible": false,
								"editable": true
							};
							tObject.Guid = thisCntrlr.tabBindingModel[rowIndex].Guid;
							tObject.DocId = thisCntrlr.tabBindingModel[rowIndex].DocId;
							tObject.DocType = thisCntrlr.tabBindingModel[rowIndex].DocType;
							tObject.DocSubtype = thisCntrlr.tabBindingModel[rowIndex].DocSubtype;
							tObject.DocDesc = thisCntrlr.tabBindingModel[rowIndex].DocDesc;
							tObject.ItemGuid = thisCntrlr.tabBindingModel[rowIndex].ItemGuid;
							thisCntrlr.tabBindingModel.splice(parseInt(rowIndex), 1);
							thisCntrlr.tabBindingModel.splice(parseInt(rowIndex), 0, tObject);
							oTable.getModel().refresh(true);
						}						
						var a = thisCntrlr.disModel.sServiceUrl + com.amat.crm.opportunity.util.ServiceConfigConstants.AttachmentSet;
						var f = this.getXcrfHeader(thisCntrlr);
						/*****************To Fetch CSRF Token*******************/
						OData.request(f, function(data, oSuccess) {
							thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
							var oHeaders = {
								"X-CSRF-Token": thisCntrlr.oToken,
							};
							/*******************To Delete File************************/
							var sDelete = thisCntrlr.disModel.sServiceUrl + oResource.getText("S4DISRRATCHPTH1") + thisCntrlr.tabBindingModel[rowIndex].Guid +
							oResource.getText("S4DISRRATCHPTH2") + thisCntrlr.tabBindingModel[rowIndex].ItemGuid + oResource.getText("S4DISRRATCHPTH3") +
							thisCntrlr.tabBindingModel[rowIndex].DocType + oResource.getText("S4DISRRATCHPTH4") + thisCntrlr.tabBindingModel[rowIndex].DocSubtype +
							oResource.getText("S4DISRRATCHPTH5") + thisCntrlr.tabBindingModel[rowIndex].DocId + oResource.getText("S4DISRRATCHPTH6");
							jQuery.ajax({
								type: 'DELETE',
								url: sDelete,
								headers: oHeaders,
								cache: false,
								processData: false,
								success: function(data) {
									thisCntrlr.showToastMessage(oResource.getText("S2ATTCHDOCDELSUCSSMSG"));
									thisCntrlr.onPSRRRADataSave(oResource.getText("S2PSRSDASAVETXT"));
									thisCntrlr.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
									thisCntrlr.refereshRraData(true, false, false);
									myBusyDialog.close();
								},
								error: function(data) {
									thisCntrlr.showToastMessage($(data.responseText).find(oResource
										.getText("S2CBCPSRCARMTYPEMESG"))[0].innerText);
									thisCntrlr.onPSRRRADataSave(oResource.getText("S2PSRSDASAVETXT"));
									thisCntrlr.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
									thisCntrlr.refereshRraData(true, false, false);
									myBusyDialog.close();
								}
							});
						}, function(err) {});
					} else {
						var f = this.getXcrfHeader(thisCntrlr);
						/*****************To Fetch CSRF Token*******************/
						OData.request(f, function(data, oSuccess) {
							thisCntrlr.oToken = oSuccess.headers['x-csrf-token'];
							var oHeaders = {
								"X-CSRF-Token": thisCntrlr.oToken,
							};
							/********************To Delete File************************/
							var sDelete = thisCntrlr.disModel.sServiceUrl + oResource.getText("S4DISRRATCHPTH1") + thisCntrlr.tabBindingModel[rowIndex].Guid +
							    oResource.getText("S4DISRRATCHPTH2") + thisCntrlr.tabBindingModel[rowIndex].ItemGuid + oResource.getText("S4DISRRATCHPTH3") +
							    thisCntrlr.tabBindingModel[rowIndex].DocType + oResource.getText("S4DISRRATCHPTH4") + thisCntrlr.tabBindingModel[rowIndex].DocSubtype +
							    oResource.getText("S4DISRRATCHPTH5") + thisCntrlr.tabBindingModel[rowIndex].DocId + oResource.getText("S4DISRRATCHPTH6");
							jQuery.ajax({
								type: 'DELETE',
								url: sDelete,
								headers: oHeaders,
								cache: false,
								processData: false,
								success: function(data) {
									thisCntrlr.showToastMessage(oResource.getText(
										"S2ATTCHDOCDELSUCSSMSG"));
									thisCntrlr.onPSRRRADataSave(oResource.getText("S2PSRSDASAVETXT"));
									thisCntrlr.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
									thisCntrlr.refereshRraData(true, false, false);
									myBusyDialog.close();
								},
								error: function(data) {
									thisCntrlr.showToastMessage($(data.responseText).find(oResource
										.getText("S2CBCPSRCARMTYPEMESG"))[0].innerText);
									thisCntrlr.onPSRRRADataSave(oResource.getText("S2PSRSDASAVETXT"));
									thisCntrlr.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
									thisCntrlr.refereshRraData(true, false, false);
									myBusyDialog.close();
								}
							});
						}, function(err) {});
						oTable.getModel().refresh(true);
					}
				} else {
					thisCntrlr.tabBindingModel[rowIndex].editable = true;
					oTable.getItems()[rowIndex].getCells()[2].setEnabled(false);
					thisCntrlr.tabBindingModel[rowIndex].Notes = thisCntrlr.tempHold;
					thisCntrlr.source.setIcon(oResource.getText("S2PSRSDADELETEICON"));
					thisCntrlr.source.getParent().getItems()[0].setIcon(oResource.getText("S2PSRSDAEDITICON"));
					if (thisCntrlr.source.getParent().getItems()[2] !== undefined) {
						thisCntrlr.source.getParent().getItems()[2].setVisible(true);
					}
					for (var i = 0; i < thisCntrlr.tabBindingModel.length; i++) {
						if(thisCntrlr.tabBindingModel[i].FileName === ""){
							thisCntrlr.tabBindingModel[i].uBvisible = true;
							thisCntrlr.tabBindingModel[i].bgVisible = false;
						} else {
							thisCntrlr.tabBindingModel[i].bgVisible = true;
							thisCntrlr.tabBindingModel[i].uBvisible = false;
						}
					}
					oTable.getModel().refresh(true);
					myBusyDialog.close();
				}
				
			},
			/**
			 * This method used for Add press event.
			 * @name RraAddPress
			 * @param {sap.ui.base.Event} evt - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns
			 */
			RraAddPress: function(evt, thisCntrlr) {
				var oResource = thisCntrlr.getResourceBundle(),
				    rowIndex = evt.getSource().getParent().getParent().getParent().getId().split("-")[evt.getSource().getParent()
					    .getParent().getParent().getId().split("-").length - 1],
					oTable = evt.getSource().getParent().getParent().getParent().getParent(),
					tabBindingModel = evt.getSource().getModel().getData()[evt.getSource().getBindingContext().getPath().split("/")[1]].results;
				var tObject = {
					"DocDesc": "",
					"Guid": "",
					"DocId": "",
					"Enableflag": true,
					"ItemGuid": "",
					"DocType": "",
					"DocSubtype": "",
					"FileName": "",
					"OriginalFname": "",
					"Notes": "",
					"uBvisible": true,
					"bgVisible": false,
					"editable": true,
					"Code": ""
				};
				tObject.Code = tabBindingModel[rowIndex].Code;
				tObject.Guid = tabBindingModel[rowIndex].Guid;
				tObject.DocId = tabBindingModel[rowIndex].DocId;
				tObject.DocType = tabBindingModel[rowIndex].DocType;
				tObject.DocSubtype = tabBindingModel[rowIndex].DocSubtype;
				tObject.DocDesc = tabBindingModel[rowIndex].DocDesc;
				tObject.ItemGuid = tabBindingModel[rowIndex].ItemGuid;
				tabBindingModel.splice(parseInt(rowIndex) + 1, 0, tObject);
				oTable.getModel().refresh();
				var TableBContext = evt.getSource().getParent().getParent().getParent().getBindingContext();
				var ItemData = tabBindingModel[TableBContext.getPath().split("/")[TableBContext.getPath().split("/").length - 1]];
				if ((ItemData.DocDesc === oResource.getText("S2OTHDOCDES") || ItemData.DocDesc === oResource.getText("S2OTHPOSTBOOKDOCDES") ||
						ItemData.DocDesc === oResource.getText("S2AOTHERBTNTEXT")) && (ItemData.DocSubtype === oResource.getText("S3BDT") ||
						ItemData.DocSubtype === oResource.getText("S3PBCDT") || ItemData.DocSubtype === oResource.getText("S3PBDT"))) {
					oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setEnabled(true);
					oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setPlaceholder(oResource.getText("S3NOTETEXT"));
					oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setValueState(sap.ui.core.ValueState.Warning);
					oTable.getItems()[parseInt(rowIndex) + 1].getCells()[2].setValueStateText(oResource.getText("S3NOTEVALUETEXT"));
					oTable.getItems()[parseInt(rowIndex) + 1].getCells()[3].getItems()[1].getItems()[0].setEnabled(false);
					oTable.getItems()[parseInt(rowIndex)].getCells()[3].getItems()[0].getItems()[2].setEnabled(false);
				} else {
					var lastItem = tabBindingModel[tabBindingModel.length - 1],
					    CurrentLineData = "",
						totalOthRecods, temp = "";
					for (var i = 0; i <= tabBindingModel.length - 1; i++) {
						CurrentLineData = tabBindingModel[i];
						if (CurrentLineData.DocSubtype === oResource.getText("S3BDT") || CurrentLineData.DocSubtype === oResource.getText("S3PBCDT") ||
							CurrentLineData.DocSubtype === oResource.getText("S3PBDT")) {
							(temp === "") ? (temp = i) : ("");
							if (i < tabBindingModel.length - 1) {
								if (CurrentLineData.FileName === "") {
									for (var k = i; k < tabBindingModel.length - 1; k++) {
										tabBindingModel[k] = tabBindingModel[k + 1];
									}
									tabBindingModel.length = tabBindingModel.length - 1;
								}
							} else {
								if (CurrentLineData.FileName === "") {
									tabBindingModel.length = tabBindingModel.length - 1;
									oTable.getItems()[tabBindingModel.length].getCells()[3].getItems()[0].getItems()[2].setEnabled(true);
								}
							}
						}
					}
					if (temp !== tabBindingModel.length - 1) {
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
			RraEditPress: function(evt, thisCntrlr) {
				var myBusyDialog = thisCntrlr.getBusyDialog();
				myBusyDialog.open();
				Date.prototype.yyyymmdd = function() {
					var mm = this.getMonth() + 1;
					var dd = this.getDate();
					return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
				};
				var oResource = thisCntrlr.getResourceBundle(),
				    rowIndex = evt.getSource().getParent().getParent().getParent().getId().split("-")[evt.getSource().getParent()
					    .getParent().getParent().getId().split("-").length - 1],
					oTable = evt.getSource().getParent().getParent().getParent().getParent(),
					tabBindingModel = evt.getSource().getModel().getData()[evt.getSource().getBindingContext().getPath().split("/")[1]].results,
					row = evt.getSource().getParent().getParent().getParent().getCells()[2],
					GenInfoData = sap.ui.getCore().getModel(oResource.getText("GLBOPPGENINFOMODEL")),
					Guid = GenInfoData.getData().Guid,
					ItemGuid = GenInfoData.getData().ItemGuid,
					DocId = tabBindingModel[rowIndex].DocId,
					DocType = tabBindingModel[rowIndex].DocType,
					DocSubtype = tabBindingModel[rowIndex].DocSubtype,
					dateData = "";
				thisCntrlr.evt = evt;
				if (evt.getSource().getParent().getParent().getParent().getCells().length > 4) {
					dateData = evt.getSource().getParent().getParent().getParent().getCells()[3].getDateValue();
					dateData = dateData === null ? "" : dateData.yyyymmdd();
				} else {
					dateData = "";
				}
				if (evt.getSource().getIcon().indexOf(oResource.getText("S2PSRSDAEDITBTNTXT").toLowerCase()) >= 0) {
					tabBindingModel[rowIndex].editable = true;
					tabBindingModel[rowIndex].uBvisible = false;
					oTable.getItems()[rowIndex].getCells()[2].setEnabled(true);
					thisCntrlr.tempHold = "";
					thisCntrlr.tempHold = tabBindingModel[rowIndex].Notes;
					evt.getSource().setIcon(oResource.getText("S2PSRSDASAVEICON"));
					evt.getSource().getParent().getItems()[1].setVisible(true);
					evt.getSource().getParent().getItems()[1].setIcon(oResource.getText("S2PSRSDAATTCANICON"));
					if (evt.getSource().getParent().getItems()[2] !== undefined) {
						evt.getSource().getParent().getItems()[2].setVisible(false);
					}
					for (var i = 0; i < tabBindingModel.length; i++) {
						if (i !== parseInt(rowIndex)) {
							tabBindingModel[i].bgVisible = false;
							tabBindingModel[i].uBvisible = false;
							oTable.getItems()[i].getCells()[2].setEnabled(false);
						}
					}
					oTable.getModel().refresh(true);
					myBusyDialog.close();
				} else {
					var customerNo = thisCntrlr.getOwnerComponent().Custno,
					    sEdit = thisCntrlr.disModel.sServiceUrl + oResource.getText("S4DISRRATCHPTH1") + Guid + oResource.getText("S4DISRRATCHPTH2") +
					        ItemGuid + oResource.getText("S4DISRRATCHPTH3") + DocType + oResource.getText("S4DISRRATCHPTH4") + DocSubtype +
					        oResource.getText("S4DISRRATCHPTH5") + DocId + oResource.getText("S4DISRRATCHPTH6");
					var Data = {
						DocDesc: "",
						FileName: "",
						OriginalFname: "",
						Guid: Guid,
						ItemGuid: ItemGuid,
						DocType: DocType,
						DocSubtype: DocSubtype,
						DocId: DocId,
						Notes: row.getValue(),
						MimeType: oResource.getText("S4DISDOCMINETYP"),
						OppId: GenInfoData.getData().OppId,
						ItemNo: GenInfoData.getData().ItemNo.toString(),
						Customer: customerNo,
						Code: "",
						ExpireDate: dateData,
						UploadedBy: "",
						//UploadedDate: oResource.getText("S2OPPAPPPAYLODDATKEY")                                                                                                    //PCR035760-- Defect#131 TechUpgrade changes
					};
					var that = this;
					/****************To Fetch CSRF Token*******************/
					var f = this.getXcrfHeader(thisCntrlr), oHeaders;
					thisCntrlr.editB = evt.getSource();
					thisCntrlr.deleteB = evt.getSource().getParent().getItems()[1];
					OData.request(f, function(data, oSuccess) {
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
							tabBindingModel[rowIndex].editable = true;
							oTable.getItems()[rowIndex].getCells()[2].setEnabled(false);
							thisCntrlr.editB.setIcon(oResource.getText("S2PSRSDAEDITICON"));
							thisCntrlr.deleteB.setIcon(oResource.getText("S2PSRSDADELETEICON"));
							oTable.getModel().refresh(true);							
							thisCntrlr.showToastMessage(oResource.getText("S2PSRSDACBCATTNOTESUCSSMSG"));
							thisCntrlr.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
							thisCntrlr.refereshRraData(true, false, false);
							myBusyDialog.close();
						}, function(data) {
							thisCntrlr.showToastMessage(JSON.parse(data.response.body).error.message.value);
							thisCntrlr.getRefreshRRAdata(thisCntrlr.getOwnerComponent().Guid, thisCntrlr.getOwnerComponent().ItemGuid);
							thisCntrlr.refereshRraData(true, false, false);
							myBusyDialog.close();
						});
					}, function(err) {});
					if (evt.getSource().getParent().mAggregations.items[2] !== undefined) {
						evt.getSource().getParent().getItems()[2].setVisible(true);
					}
					for (var i = 0; i < tabBindingModel.length; i++) {
						if(tabBindingModel[i].FileName === ""){
							tabBindingModel[i].uBvisible = true;
							tabBindingModel[i].bgVisible = false;
						}
					}
				}
			},
			/**
			 * This method is used For Generating PayLoad for BSDA Process.
			 * @name PSRSDAPayload
			 * @param {String} PsrStatus - Current PSR Status, {String} ActionType - Save or Submit ,{String} Message - Submit For Approval Button Text,
			 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns {Object} obj - PayLoad
			 */
			PSRSDAPayload: function(PsrStatus, ActionType, Message, thisCntrlr) {
				var oResource = thisCntrlr.getResourceBundle(),
				    OppGenInfoModel = thisCntrlr.getModelFromCore(oResource.getText("GLBOPPGENINFOMODEL")),
				    PSRData = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRAModel")).getData(),
				    obj = {};
				if (parseInt(PSRData.PsrStatus) < 60) {
					obj.NAV_SAF_QA = {};
					obj.NAV_SPEC_QA = [];
					obj.NAV_RRA_CC = [];
					if (parseInt(PSRData.PsrStatus) === 15) {
						obj.NAV_RRA_QA = [];
					}
					obj.Guid = OppGenInfoModel.getData().Guid;
					obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
					obj.PsrRequired = oResource.getText("S2POSMANDATANS");
					obj.PsrType = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISRRASTATTXT).getText();
					(ActionType === oResource.getText("S2PSRSDASAVETXT")) ? (obj.PsrStatus = PSRData.PsrStatus) : ((Message ===
						oResource.getText("S2PSRSDASUBFORAPP")) ? (parseInt(PSRData.PsrStatus) === 5  || parseInt(PSRData.PsrStatus) === 4 ?
						obj.PsrStatus = "15" : obj.PsrStatus = "65") : ((Message === oResource.getText("S2PSRSDASFCONSPECTPEANDREWTXT") &&
						PSRData.PsrType !== oResource.getText("S2PSRSDASTATREPEAT")) ? (obj.PsrStatus = "17") : (obj.PsrStatus = PSRData.PsrStatus)));
					if (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISPRRABRRALVLSELKEY).getSelectedKey() === oResource.
							getText("S2BSDASSMENTLVLOP")) {
						PSRData.Bsdl = "";
					} else if (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISPRRABRRALVLSELKEY).getSelectedKey() !== oResource.
							getText("S2BSDASSMENTLVLOP")) {
						PSRData.Bsdl = thisCntrlr.getView().getModel().getProperty("/SelectedBsdlVl");
					}					
					if (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISPRRASRRALVLSELKEY).getSelectedKey() === oResource.
							getText("S2BSDASSMENTLVLOP")) {
				        PSRData.Ssdl = "";
			        } else if(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISPRRASRRALVLSELKEY).getSelectedKey() !== oResource.
			        		getText("S2BSDASSMENTLVLOP")){
			        	PSRData.Ssdl = thisCntrlr.getView().getModel().getProperty("/SelectedSsdlVl");
			        }
					obj.ConComments = PSRData.ConComments;
					obj.Bsdl = PSRData.Bsdl;
					obj.Ssdl = PSRData.Ssdl;
					obj.BsdaJustfication = PSRData.BsdaJustfication;
					obj.SsdaJustfication = PSRData.SsdaJustfication;
					obj.SsdaReq = "";
					obj.StreachedSpec = PSRData.StreachedSpec;
					obj.CcOppId = thisCntrlr.that_views4.getController().OppId;
					obj.CcOpitmId = thisCntrlr.that_views4.getController().ItemNo.toString();
					obj.RevOppId = PSRData.RevOppId;
					obj.RevOpitmId = PSRData.RevOpitmId;
					obj.Custno = thisCntrlr.getOwnerComponent().Custno;
					obj.ActionType = (ActionType === oResource.getText("S2PSRSDASAVETXT")) ? oResource.getText("S2CBCSALESUCSSANS") :  ActionType;
					obj.TaskId = PSRData.TaskId;
					obj.AprvComments = PSRData.AprvComments;
					obj.WiId = "";
					obj.PsrStatDesc = "";
					obj.NAV_SAF_QA.Guid = OppGenInfoModel.getData().Guid;
					obj.NAV_SAF_QA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
					obj.NAV_SAF_QA.Qtype = oResource.getText("S2PSRSAFQUSKEY");
					obj.NAV_SAF_QA.Qid = PSRData.NAV_SAF_QA.Qid;
					obj.NAV_SAF_QA.Qdesc = PSRData.NAV_SAF_QA.Qdesc;
					obj.NAV_SAF_QA.QaVer = PSRData.NAV_SAF_QA.QaVer;
					obj.NAV_SAF_QA.OppId = OppGenInfoModel.getData().OppId;
					obj.NAV_SAF_QA.ItemNo = OppGenInfoModel.getData().ItemNo;
					obj.NAV_SAF_QA.SalesFlg = PSRData.NAV_SAF_QA.SalesFlg;
					obj.NAV_SAF_QA.GPMFlg = "";
					obj.NAV_SAF_QA.Comments = "";
					obj.NAV_SAF_QA.ChangedBy = "";
					//obj.NAV_SAF_QA.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                        //PCR035760-- Defect#131 TechUpgrade changes
					if (thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4RRACCTAB).getModel() !==
						undefined && (parseInt(PSRData.PsrStatus) === 5 || parseInt(PSRData.PsrStatus) === 4)) {
						var PSRCcTabData = thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4RRACCTAB)
							.getModel().getData().NAV_RRA_CC;
						if (PSRCcTabData.results.length > 0) {
							for (var i = 0; i < PSRCcTabData.results.length; i++) {
								var data = {};
								data.Guid = PSRCcTabData.results[i].Guid;
								data.ItemGuid = PSRCcTabData.results[i].ItemGuid;
								data.OppId = PSRCcTabData.results[i].OppId;
								data.ItemNo = PSRCcTabData.results[i].ItemNo;
								obj.NAV_RRA_CC.push(data);
							}
						}
					}
					if (parseInt(PSRData.PsrStatus) === 4 || parseInt(PSRData.PsrStatus) === 5) {
						var SalesQusData = PSRData.NAV_SPEC_QA.results;
						var QaVer = SalesQusData[0].QaVer, QusLen = "";
						    var QusId = ["1001", "1002", "1003", "1004", "1005", "1006"];
						    QusLen = 2;
						var quesLen = (PSRData.PsrType === oResource.getText("S2PSRSDANEW")) ? 2 : 6;
						for (var i = 0; i < quesLen ; i++) {
							var PSR = {};
							PSR.Guid = OppGenInfoModel.getData().Guid;
							PSR.Qdesc = "";
							PSR.ItemGuid = OppGenInfoModel.getData().ItemGuid;
							PSR.Qtype = oResource.getText("S4DISRRASPECTYPQUSTYPE");
							PSR.Qid = QusId[i];
							PSR.QaVer = QaVer;
							PSR.OppId = OppGenInfoModel.getData().OppId;
							PSR.ItemNo = OppGenInfoModel.getData().ItemNo;
							PSR.SalesFlg = SalesQusData[i].SalesFlg;
							PSR.GPMFlg = "";
							PSR.ConFlg = "";
							PSR.Comments = "";
							PSR.ChangedBy = "";
							//PSR.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                           //PCR035760-- Defect#131 TechUpgrade changes
							obj.NAV_SPEC_QA.push(PSR);
						}
						if (PSRData.PsrType === oResource.getText("S2PSRSDANEW")) {
							for (var i = 0; i < 4; i++) {
								var PSR = {};
								PSR.Guid = OppGenInfoModel.getData().Guid;
								PSR.Qdesc = "";
								PSR.ItemGuid = OppGenInfoModel.getData().ItemGuid;
								PSR.Qtype = oResource.getText("S4DISRRASPECTYPQUSTYPE");
								PSR.Qid = QusId[i + QusLen];
								PSR.QaVer = QaVer;
								PSR.OppId = OppGenInfoModel.getData()
									.OppId;
								PSR.ItemNo = OppGenInfoModel.getData()
									.ItemNo;
								PSR.SalesFlg = "";
								PSR.GPMFlg = "";
								PSR.ConFlg = "";
								PSR.Comments = "";
								PSR.ChangedBy = "";
								//PSR.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                       //PCR035760-- Defect#131 TechUpgrade changes
								obj.NAV_SPEC_QA.push(PSR);
							}
						}
					} else if (parseInt(PSRData.PsrStatus) === 15) {
						var SalesQusData = thisCntrlr.getView().getModel().getData().NAV_SPEC_QA.results;
						var QaVer = SalesQusData[0].QaVer, QusLen = "";
						var QusId = ["1001", "1002", "1003", "1004", "1005", "1006"];
						QusLen = thisCntrlr.getView().getModel().getProperty("/RraSpecTypVal") === oResource.getText("S2PSRSDASTATNEW") ?  2 : 6;
						for (var i = 0; i < SalesQusData.length; i++) {
							var PSR = {},
								SaleAns, BmoAns;
							PSR.Guid = OppGenInfoModel.getData().Guid;
							PSR.Qdesc = "";
							PSR.ItemGuid = OppGenInfoModel.getData().ItemGuid;
							PSR.Qtype = oResource.getText("S4DISRRASPECTYPQUSTYPE");
							PSR.Qid = QusId[i];
							PSR.QaVer = QaVer;
							PSR.OppId = OppGenInfoModel.getData()
								.OppId;
							PSR.ItemNo = OppGenInfoModel.getData()
								.ItemNo;
							if (SalesQusData[i].SelectionIndex !== undefined && SalesQusData[i].SelectionIndex !== 0) {
								if (SalesQusData[i].SelectionIndex === 1) {
									SaleAns = oResource.getText("S2POSMANDATANS");
								} else if (SalesQusData[i].SelectionIndex === 2) {
									SaleAns = oResource.getText("S2NEGMANDATANS");
								}
							} else {
								SaleAns = "";
							};
							PSR.SalesFlg = SaleAns;
							if (SalesQusData[i].GPMSelectionIndex !== undefined) {
								if (SalesQusData[i].GPMSelectionIndex === 1) {
									BmoAns = oResource.getText("S2POSMANDATANS");
								} else if (SalesQusData[i].GPMSelectionIndex === 2) {
									BmoAns = oResource.getText("S2NEGMANDATANS");
								} else {
									BmoAns = "";
								}
							} else {
								BmoAns = "";
							};
							PSR.GPMFlg = BmoAns;
							PSR.ChangedBy = "";
							//PSR.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                           //PCR035760-- Defect#131 TechUpgrade changes
							obj.NAV_SPEC_QA.push(PSR);
						}
						if (QusLen === 2) {
							for (var i = 0; i < 4; i++) {
								var PSR = {};
								PSR.Guid = OppGenInfoModel.getData().Guid;
								PSR.Qdesc = "";
								PSR.ItemGuid = OppGenInfoModel.getData().ItemGuid;
								PSR.Qtype = oResource.getText("S4DISRRASPECTYPQUSTYPE");
								PSR.Qid = QusId[i + QusLen];
								PSR.QaVer = QaVer;
								PSR.OppId = OppGenInfoModel.getData().OppId;
								PSR.ItemNo = OppGenInfoModel.getData().ItemNo;
								PSR.GPMFlg = "";
								PSR.ConFlg = "";
								PSR.Comments = "";
								PSR.ChangedBy = "";
								//PSR.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                       //PCR035760-- Defect#131 TechUpgrade changes 
								obj.NAV_SPEC_QA.push(PSR);
							}
						}
					}
					if(parseInt(PSRData.PsrStatus) === 15 || parseInt(PSRData.PsrStatus) === 25 ||
							parseInt(PSRData.PsrStatus) === 35){
						obj.NAV_RRA_QA = [];
						var QusId = ["3001", "3005", "3010", "3015", "3020", "3025", "3030", "3035", "3040",
						             "3045", "3050", "3055", "3070", "3075", "3080"], QusFlag = false;
						var SalesQusData = thisCntrlr.getView().getModel().getData().NAV_RRA_QA;
						var QaVer = SalesQusData.results[0].QaVer, count = -1;
						for (var i = 0; i < QusId.length; i++) {
							QusFlag = false;
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
							RRA.ItemNo = OppGenInfoModel.getData().ItemNo;
							RRA.OppId = OppGenInfoModel.getData().OppId;
							RRA.QaVer = SalesQusData.results[count].QaVer;
							RRA.Qdesc = SalesQusData.results[count].Qdesc;
							RRA.Qid = SalesQusData.results[count].Qid;
							RRA.Qtype = oResource.getText("S2PSRDCRRATXTASC606");
							RRA.SalesFlg = SalesQusData.results[count].SalesFlg;
							RRA.GPMFlg = SalesQusData.results[count].GPMFlg;
							RRA.ConFlg = SalesQusData.results[count].ConFlg;
							RRA.SalesComm = SalesQusData.results[count].SalesComm;
							RRA.GPMComm = SalesQusData.results[count].GPMComm;
							RRA.ConComm = SalesQusData.results[count].ConComm;
							RRA.ChangedBy = "";
							//RRA.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                           //PCR035760-- Defect#131 TechUpgrade changes
						} else {
							RRA.Guid = OppGenInfoModel.getData().Guid;
							RRA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
							RRA.Comments = "";
							RRA.ItemNo = OppGenInfoModel.getData().ItemNo;
							RRA.OppId = OppGenInfoModel.getData().OppId;
							RRA.QaVer = QaVer;
							RRA.Qdesc = "";
							RRA.Qid = QusId[i];
							RRA.Qtype = oResource.getText("S2PSRDCRRATXTASC606");
							RRA.SalesFlg = "";
							RRA.GPMFlg = "";
							RRA.ConFlg = "";
							RRA.SalesComm = "";
							RRA.GPMComm = "";
							RRA.ConComm = "";
							RRA.ChangedBy = "";
							//RRA.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                           //PCR035760-- Defect#131 TechUpgrade changes
						}
						obj.NAV_RRA_QA.push(RRA);
				      }
					}
				} else {
					obj.Guid = OppGenInfoModel.getData().Guid;
					obj.ItemGuid = OppGenInfoModel.getData().ItemGuid;
					obj.PsrRequired = PSRData.PsrRequired;
					obj.PsrType = PSRData.PsrType;
					obj.PsrStatus = PSRData.PsrStatus;
					if (thisCntrlr.getView().getModel().getProperty("/SelectedBsdlVl") === oResource.getText("S2BSDASSMENTLVLOP")) {
						PSRData.Bsdl = "";
					} else  if (thisCntrlr.getView().getModel().getProperty("/SelectedSsdlVl") === oResource.getText("S2BSDASSMENTLVLOP")) {
						PSRData.Ssdl = "";
					}
					obj.Ssdl = PSRData.Ssdl;
					obj.Bsdl = PSRData.Bsdl;
					obj.ConComments = PSRData.ConComments;
					obj.BsdaJustfication = PSRData.BsdaJustfication;
					obj.SsdaJustfication = PSRData.SsdaJustfication;
					obj.SsdaReq = PSRData.SsdaReq;
					obj.RevOpitmId = PSRData.RevOpitmId;
					obj.RevOppId = PSRData.RevOppId;
					obj.Custno = PSRData.Custno;
					obj.ActionType = (ActionType === oResource.getText("S2PSRSDASAVETXT")) ? (oResource.getText("S2CBCSALESUCSSANS")) : (ActionType);
					obj.AprvComments = PSRData.AprvComments;
					obj.TaskId = PSRData.TaskId;
					obj.WiId = PSRData.WiId;
					obj.PsrStatDesc = PSRData.PsrStatDesc;
					obj.NAV_SAF_QA = {};
					obj.NAV_SAF_QA.Guid = OppGenInfoModel.getData().Guid;
					obj.NAV_SAF_QA.ItemGuid = OppGenInfoModel.getData().ItemGuid;
					obj.NAV_SAF_QA.Qtype = oResource.getText("S2PSRSAFQUSKEY");
					obj.NAV_SAF_QA.Qid = PSRData.NAV_SAF_QA.Qid;
					obj.NAV_SAF_QA.Qdesc = PSRData.NAV_SAF_QA.Qdesc;
					obj.NAV_SAF_QA.QaVer = PSRData.NAV_SAF_QA.QaVer;
					obj.NAV_SAF_QA.OppId = OppGenInfoModel.getData().OppId;
					obj.NAV_SAF_QA.ItemNo = OppGenInfoModel.getData().ItemNo;
					obj.NAV_SAF_QA.SalesFlg = PSRData.NAV_SAF_QA.SalesFlg;
					obj.NAV_SAF_QA.GPMFlg = "";
					obj.NAV_SAF_QA.Comments = "";
					obj.NAV_SAF_QA.ChangedBy = "";
					//obj.NAV_SAF_QA.ChangedDate = oResource.getText("S2OPPAPPPAYLODDATKEY");                                                                                        //PCR035760-- Defect#131 TechUpgrade changes
				}
				return obj;
			},
			/**
			 * This Method Handles Look-Up Button Press Event.
			 * @name onPsrLookUp
			 * @param {sap.ui.base.Event} oEvent - Holds the current event, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns
			 */
			onPsrLookUp: function(oEvent, thisCntrlr) {
				var oModel = thisCntrlr.getDataModels(),
				    oResource = thisCntrlr.getResourceBundle(),
				    ProductLine = oModel[0].ProductLine;
				ProductLine.indexOf("&") !==0 ? ProductLine = ProductLine.replace("&","-") : "";
				thisCntrlr.lookUpList = sap.ui.xmlfragment(oResource.getText("PSRLOOKUPLISTDIALOG"), thisCntrlr);
				thisCntrlr.getCurrentView().addDependent(thisCntrlr.lookUpList);
				var slokUpLink = oResource.getText("S4DISRRALOKUPPTH1") + oModel[0].Bu + oResource.getText("S4DISRRALOKUPPTH2") +
				     oModel[0].Kpu + "'";
				thisCntrlr.serviceDisCall(slokUpLink, com.amat.crm.opportunity.util.ServiceConfigConstants.read, "", "");
				var lookUpData = thisCntrlr.getModelFromCore(oResource.getText("S4DISRRALOKUPMDL")).getData();
				thisCntrlr.lookupData = this.groupBy(lookUpData.results, oResource.getText("S2CONCTTYPEPROPTEXT"));
                sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGTPSICONTAB).setVisible(true);
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGBMICONTAB).setVisible(true);
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGTPSTABLE).setModel(thisCntrlr.getJSONModel({
					"ItemSet": thisCntrlr.lookupData.TPS
				}));
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGBMTABLE).setModel(thisCntrlr.getJSONModel({
					"ItemSet": thisCntrlr.lookupData.BM
				}));
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGSMICONTAB).setVisible(false);
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGRBMICONTAB).setVisible(false);
                sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGPLTABLE).setModel(thisCntrlr.getJSONModel({
					"ItemSet": thisCntrlr.lookupData.PL
				}));
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGCONTABLE).setModel(thisCntrlr.getJSONModel({
					"ItemSet": thisCntrlr.lookupData.DICON
				}));
				sap.ui.getCore().byId(com.amat.crm.opportunity.Ids.FRAGCOMTABLE).setModel(thisCntrlr.getJSONModel({
					"ItemSet": thisCntrlr.lookupData.NOT
				}));
				thisCntrlr.lookUpList.setModel(new sap.ui.model.json.JSONModel(), oResource.getText(
					"S2PSRCBCATTDFTJSONMDLTXT"));
				thisCntrlr.lookUpList.open();
			},
			/**
			 * This Method Handles to initiate Message Pop Over.
			 * @name getPopOver
			 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns
			 */
			getPopOver: function(thisCntrlr){
				var oMessageTemplate = new sap.m.MessagePopoverItem({
					type: '{type}',
					title: '{title}',
					description: '{description}',
					subtitle: '{subtitle}',
					counter: '{counter}'
				});
				if (!(thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S4DISMSGPOPOVERBTN))) {
					thisCntrlr.oMessagePopover = new sap.m.MessagePopover({
						id: thisCntrlr.createId(com.amat.crm.opportunity.Ids.S4DISMSGPOPOVERBTN),
						items: {
							path: '/',
							template: oMessageTemplate
						}
					});
				}
			},
			/**
			 * This Method Handles to Validate RRA Contacts Check.
			 * @name ValidateContact
			 * @param {sap.ui.model.Model} oModel - Data Models, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns ErrorFlag - Binary Flag
			 */
			ValidateContact: function(oModel, thisCntrlr){
				var counter = 1,
				ErrorFlag = false;
			    var oResource = thisCntrlr.getResourceBundle(),
			        aMockMessages = [];
			    switch(parseInt(oModel[2].PsrStatus)){
			       case 4:
			       case 5:
			    	   var contact = [oModel[0].NAV_OM_INFO, oModel[0].NAV_SLS_INFO, oModel[0].NAV_GPM_INFO,
			    	                  oModel[0].NAV_SME_INFO, oModel[0].NAV_CON_INFO, oModel[0].NAV_IW_INFO];
				       for(var j = 0; j < contact.length; j++){
				    	   if(contact[j].results <= 0){
				    		    var obj = this.getDes(j, oResource.getText("S2ERRORVALSATETEXT"), oResource);
				    		    var temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", obj[0], obj[1], "S2PSRSDACBCQUESFAILMSGDIS", counter);
								aMockMessages.push(temp);
								counter++;
								ErrorFlag = true;
							} else {
								var obj = this.getDes(j, oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP"), oResource);
								var temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", obj[0], obj[1], "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
								aMockMessages.push(temp);
								counter++;
							}
				       }
			     }
			    if(ErrorFlag){
			    	this.getPopOver(thisCntrlr);
				    var oModel = thisCntrlr.getJSONModel(aMockMessages);
					var viewModel = new sap.ui.model.json.JSONModel();
					viewModel.setData({
						messagesLength: aMockMessages.length + ''
					});
					thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISAPRMSGPOPOVERFTR).setModel(viewModel);
					thisCntrlr.oMessagePopover.setModel(oModel);
			    } else {
			    	var PopOverVis = thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISAPRMSGPOPOVERFTR).getVisible();
			    	if(PopOverVis){
			    		thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISAPRMSGPOPOVERFTR).setVisible(false);
			    	}
			    }
				return ErrorFlag;
			},
			/**
			 * This Method Handles to get Message.
			 * @name getDesMessage
			 * @param {String} MegType - Type of Message, {String} ErrorMsg - Error Message, {String} Errordes - Error Message Description
			 * @param {String} SuccessMsg - Success Message, {String} SuccessDes- Success Message Description,
			 * @param {sap.ui.model.resource.ResourceModel} oResource- Resource Bundle
			 * @returns {String} ErrorFlag - Binary Flag
			 */
			getDesMessage: function(MegType, ErrorMsg, Errordes, SuccessMsg, SuccessDes, oResource){
				var Msg = [];
				switch(MegType){
				case oResource.getText("S2ERRORVALSATETEXT"):
					Msg = [oResource.getText(ErrorMsg), oResource.getText(Errordes)];
				    break;
				case oResource.getText("S2PSRSDACBCCHECKsUCSSMSGTYP"):	
					Msg = [oResource.getText(SuccessMsg), oResource.getText(SuccessDes)];
				    break;
				}
				return Msg;
			},
			/**
			 * This Method Handles to Validate RRA Contacts Check.
			 * @name getDes
			 * @param {integer} count - Array Index, {String} MegType - Type of Message, {sap.ui.model.resource.ResourceModel} oResource- Resource Bundle
			 * @returns {Boolean} ErrorFlag - Binary Flag
			 */
			getDes: function(count, MegType, oResource){
				var Msg = [];
				switch(count){
				case 0:
					Msg = this.getDesMessage(MegType, "S4DISRRAOMCONERRORMSG", "S4DISRRAOMCONERRORDES", "S4DISRRAOMCONPOSMSG", "S4DISRRAOMCONPOSDES", oResource);
					break;
				case 1:
					Msg = this.getDesMessage(MegType, "S4DISRRASLSCONERRORMSG", "S4DISRRASLSCONERRORDES", "S4DISRRASLSCONPOSMSG", "S4DISRRASLSCONPOSDES", oResource);
					break;
				case 2:
					Msg = this.getDesMessage(MegType, "S4DISRRAGPMCONERRORMSG", "S4DISRRAGPMCONERRORDES", "S4DISRRAGPMCONPOSMSG", "S4DISRRAGPMCONPOSDES", oResource);
					break;
				case 3:
					Msg = this.getDesMessage(MegType, "S4DISRRASMECONERRORMSG", "S4DISRRASMECONERRORDES", "S4DISRRASMECONPOSMSG", "S4DISRRASMECONPOSDES", oResource);
					break;
				case 4:
					Msg = this.getDesMessage(MegType, "S4DISRRACONCONERRORMSG", "S4DISRRACONCONERRORDES", "S4DISRRACONCONPOSMSG", "S4DISRRACONCONPOSDES", oResource);
					break;
				case 5:
					Msg = this.getDesMessage(MegType, "S4DISRRAIWCONERRORMSG", "S4DISRRAIWCONERRORDES", "S4DISRRAIWCONPOSMSG", "S4DISRRAIWCONPOSDES", oResource);
					break;
				}
				return  Msg;
			},
			/**
			 * This method Validating Submit and Approve Button Requirements.
			 * @name ValidateData
			 * @param {sap.ui.model.Model} oModel - Data Models, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns {Boolean}  ErrorFlag - Binary Flag
			 */
			ValidateData: function(oModel, thisCntrlr) {
				var PSRQusData = oModel[2].NAV_SPEC_QA;
				var SAFQusData = oModel[2].NAV_SAF_QA;
				var CustSpecData = oModel[2].NAV_CUST_REVSPEC;
				var RefSpecData = oModel[2].NAV_REV_DOCS;
				var FnlSpecData = oModel[2].NAV_FNL_DOCS;
				var counter = 1,
					ErrorFlag = false;
				var oResource = thisCntrlr.getResourceBundle();
				this.getPopOver(thisCntrlr);
				var aMockMessages = [];
				switch(parseInt(oModel[2].PsrStatus)){
				case 4:
				case 5:
					if (oModel[2].NAV_SAF_QA.SalesFlg === "") {
						var temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S2PSRSDASAFQUESFAILMSG", "S2PSRSDASAFQUESFAILMSGDIS", "S2PSRSDACBCQUESFAILMSGDIS", counter);
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else {
						var temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S2PSRSDASAFCHECKSUCSSMSG", "S2PSRSDASAFCHECKSUCSSMSGDIS", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
						aMockMessages.push(temp);
						counter++;
					}
					if (oModel[2].PsrType === oResource.getText("S2PSRSDASTATNEW") || oModel[2].PsrType === oResource.getText("S2PSRSDASTATREVISED")) {
						var Rev1SpecFlag = false;
						for (var i = 0; i < CustSpecData.results.length; i++) {
							if (CustSpecData.results[i].FileName !== "") {
								Rev1SpecFlag = true;
							}
						}
						if (Rev1SpecFlag === false) {
							var temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S2PSRSDACUSTINFOFAILMSG", "S2PSRSDACUSTINFOFAILMSGDIS", "S2PSRSDACBCQUESFAILMSGDIS", counter);
							aMockMessages.push(temp);
							counter++;
							ErrorFlag = true;
						} else {
							var temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S2PSRSDACUSTINFOPOSMSG", "S2PSRSDACUSTINFOFAILMSGDIS", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
							aMockMessages.push(temp);
							counter++;
						}
					} else if (oModel[2].PsrType === oResource.getText("S2PSRSDASTATREPEAT")) {
						var RefSpecFlag = false;
						for (var i = 0; i < RefSpecData.results.length; i++) {
							if (RefSpecData.results[i].FileName !== "") {
								RefSpecFlag = true;
							}
						}
						if (RefSpecFlag === false) {
							var temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S2PSRSDAREFSPECFAILMSG", "S2PSRSDAREFSPECFAILMSGDIS", "S2PSRSDACBCQUESFAILMSGDIS", counter);
							aMockMessages.push(temp);
							counter++;
							ErrorFlag = true;
						} else {
							var temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S2PSRSDAREFSPECPOSMSG", "S2PSRSDAREFSPECFAILMSGDIS", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
							aMockMessages.push(temp);
							counter++;
						}
					}
					var QusLen = oModel[2].PsrType === oResource.getText("S2PSRSDASTATNEW") ? 2 : 6;
					for (var i = 0; i < QusLen;  i++) {
						var temp = {};
						if (PSRQusData.results[i].valueState === oResource.getText("S2ERRORVALSATETEXT")  || PSRQusData.results[i].SalesFlg === "") {
							temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S4DISRRASPECTYPQUSSALSERORMSGTIT", "S4DISRRASPECTYPQUSERORMSGDES", "S2PSRSDACBCQUESFAILMSGDIS", counter);
							temp.description = oResource.getText("S4DISRRASPECTYPQUSERORMSGDES") + " " + (i + 1) +
								" " + oResource.getText("S2PSRSDASLESSUCSSANSMSGPART2");
							aMockMessages.push(temp);
							counter++;
							ErrorFlag = true;
						} else if (PSRQusData.results[i].valueState === oResource.getText("S2DELNAGVIZTEXT")) {
							temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S4DISRRASPECTYPQUSSALSPOSMSGTIT", "S4DISRRASPECTYPQUSERORMSGDES", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
							temp.description = oResource.getText("S4DISRRASPECTYPQUSPOSMSGDES") + " " + (i + 1) +
								' ' + oResource.getText("S2PSRSDASLESSUCSSANSMSGPART2");
							aMockMessages.push(temp);
							counter++;
						}
					}
					break;
				case 15:
					var temp = {};
					var PSRQusLen;
					var quschek = this.qusDiffCheck(thisCntrlr);
					if (quschek !== 0) {
						    temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S4DISRRASPECTYPQUSERORMSGTIT", "S4DISRRASPECTYPQUSERORMSGDES", "S2PSRSDACBCQUESFAILMSGDIS", counter);
							aMockMessages.push(temp);
							counter++;
							ErrorFlag = true;
						} else {
							temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S4DISRRASPECTYPQUSPOSMSGTIT", "S4DISRRASPECTYPQUSPOSMSGDES", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
							aMockMessages.push(temp);
							counter++;
						}
					if (oModel[2].PsrType === oResource.getText("S2PSRSDASTATNEW") || thisCntrlr.getView().getModel().getProperty("/RraSpecTypVal") === oResource.getText("S2PSRSDASTATNEW")) {
						PSRQusLen = 2;
					} else {
						PSRQusLen = 6;
					}
					for (var i = 0; i < PSRQusLen; i++) {
						var temp = {};
						if (PSRQusData.results[i].GPMValueState === oResource.getText("S2ERRORVALSATETEXT")  || PSRQusData.results[i].GPMFlg === "") {
							temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S4DISRRASPECTYPQUSGPMERORMSGTIT", "S4DISRRASPECTYPQUSERORMSGDES", "S2PSRSDACBCQUESFAILMSGDIS", counter);
							temp.description = oResource.getText("S4DISRRASPECTYPQUSERORMSGDES") + ' ' + (i + 1) +
								' ' + oResource.getText("S2PSRSDASLESSUCSSANSMSGPART2");
							aMockMessages.push(temp);
							counter++;
							ErrorFlag = true;
						} else if (PSRQusData.results[i].GPMValueState === oResource.getText("S2DELNAGVIZTEXT")) {
							temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S4DISRRASPECTYPQUSGPMPOSMSGTIT", "S4DISRRASPECTYPQUSERORMSGDES", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
							temp.description = oResource.getText("S4DISRRASPECTYPQUSPOSMSGDES") + ' ' + (i + 1) +
								' ' + oResource.getText("S2PSRSDASLESSUCSSANSMSGPART2");
							aMockMessages.push(temp);
							counter++;
						}
					}
					var RRAQusData = thisCntrlr.getView().getModel().getData().NAV_RRA_QA;
					var skipArr = ["3005", "3015", "3055"];
					var oneSelArr = ["3020", "3025", "3030"], restArr = [], resultArr = [], Qid2Val = "";
					var Prop = this.getProperty(parseInt(oModel[2].PsrStatus), oResource.getText("S4DISRRABRRATXT"), thisCntrlr);
					var commFlag = this.CheckComm(RRAQusData.results, Prop, oResource.getText("S4DISRRABRRATXT"), thisCntrlr, parseInt(oModel[2].PsrStatus));
					if (commFlag === false) {
						 temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S2PSRSDARRACOMMFAILANSMSG", "S2PSRSDARRACOMMFAILANSMSGDIS", "S2PSRSDACBCQUESFAILMSGDIS", counter);
						 temp.description = oResource.getText("S2PSRSDARRACOMMFAILANSMSGDIS");
						 aMockMessages.push(temp);
						 counter++;
						 ErrorFlag = true;
					} else if (commFlag) {
						 temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S2PSRSDARRACOMMPOSIANSMSG", "S2PSRSDARRACOMMPOSIANSMSGDIS", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
						 temp.description = oResource.getText("S2PSRSDARRACOMMPOSIANSMSGDIS");
						 aMockMessages.push(temp);
						 counter++;
					}
					for(var i = 0; i < oneSelArr.length-1; i++){
						restArr[i] = this.getCommObj(RRAQusData.results, oResource.getText("S4DISRRAQUSIDTXT"), oneSelArr[i], oResource.getText("S4DISRRABRRATXT"), thisCntrlr);
						if(restArr[i].length > 0){
							if(restArr[i][0][Prop] !== ""){
							Qid2Val = restArr[i][0].Qid;
							resultArr = this.arrayRemove(oneSelArr, Qid2Val);
							break;}
						}														
				    }
					var RRA2Flag= this.getRRA2Flag(Prop, oneSelArr, RRAQusData, oResource, thisCntrlr);
				    if(resultArr.length > 0)skipArr.push(resultArr[0], resultArr[1]);
					for (var i = 0; i < RRAQusData.results.length; i++) {
						if(skipArr.indexOf(RRAQusData.results[i].Qid) >= 0){continue;}
						if(RRA2Flag && oneSelArr.indexOf(RRAQusData.results[i].Qid) >= 0){continue;}
							var temp = {};
							if (RRAQusData.results[i].valueState === oResource.getText("S2ERRORVALSATETEXT") || RRAQusData.results[i].GPMFlg === "") {
								temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S2PSRSDARRAFAILANSMSG", "S4DISRRASPECTYPQUSERORMSGDES", "S2PSRSDACBCQUESFAILMSGDIS", counter);
								temp.description = oResource.getText("S2PSRSDARRAFAILANSMSGDIS") + ' ' + (i + 1) +
									' ' + oResource.getText("S2PSRSDASLESSUCSSANSMSGPART2");
								aMockMessages.push(temp);
								counter++;
								ErrorFlag = true;
							} else if (RRAQusData.results[i].valueState === oResource.getText("S2DELNAGVIZTEXT")) {
								temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S2PSRSDARRAPOSIANSMSG", "S4DISRRASPECTYPQUSERORMSGDES", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
								temp.description = oResource.getText("S2PSRSDARRAPOSIANSMSGDIS") + ' ' + ' ' + (i +
									1) + ' ' + oResource.getText("S2PSRSDASLESSUCSSANSMSGPART2");
								aMockMessages.push(temp);
								counter++;
							}
					  }
					  if (thisCntrlr.getView().getModel().getProperty("/SelectedBsdlVl") === oResource.getText("S2BSDASSMENTLVLOP") ||
							  thisCntrlr.getView().getModel().getProperty("/SelectedBsdlVl") === "") {
						    var temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S4DISRRABSDLERORMSGTIT", "S4DISRRABSDLERORMSGDES", "S2PSRSDACBCQUESFAILMSGDIS", counter);
							aMockMessages.push(temp);
							counter++;
							ErrorFlag = true;
						} else {
							var temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S4DISRRARRALVLPOSMSGTIT", "S4DISRRALVLPOSMSGDES", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
							aMockMessages.push(temp);
							counter++;
						}
					  if (thisCntrlr.getView().getModel().getProperty("/RraBJustVal") === "") {
						var temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S2PSRSDASSJUSTFAILMSG", "S2PSRSDASSJUSTFAILMSGDIS", "S2PSRSDACBCQUESFAILMSGDIS", counter);
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else {
						var temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S2PSRSDASSJUSTSUCSSMSG", "S2PSRSDASSJUSTFAILMSGDIS", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
						aMockMessages.push(temp);
						counter++;
					}
				   break;
				case 17:
					var EBSDAPSRData = thisCntrlr.getView().getModel().getData().NAV_FNL_DOCS.results, BSDAEFlag = false, temp = {};
					for (var i = 0; i < EBSDAPSRData.length; i++) {
						if (EBSDAPSRData[i].FileName !== "") {
							BSDAEFlag = true;
						}
					}
					if (BSDAEFlag === false) {
						temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S4DISRRAFNLSPECERORMSGTIT", "S4DISRRABSDLERORMSGDES", "S2PSRSDACBCQUESFAILMSGDIS", counter);
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					} else {
						temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S4DISRRASPECTYPQUSPOSMSGTIT", "S4DISRRABSDLERORMSGDES", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
						aMockMessages.push(temp);
						counter++;
					}
					break;
				case 25:
					var RRAQusData = thisCntrlr.getView().getModel().getData().NAV_RRA_QA;
					var skipArr = ["3005", "3015", "3055"];
					var oneSelArr = ["3020", "3025", "3030"], restArr = [], resultArr = [], Qid2Val = "";
					var Prop = this.getProperty(parseInt(oModel[2].PsrStatus), oResource.getText("S4DISRRABRRATXT"), thisCntrlr);
					var commFlag = this.CheckComm(RRAQusData.results, Prop, oResource.getText("S4DISRRABRRATXT"), thisCntrlr, parseInt(oModel[2].PsrStatus));
					if (commFlag === false) {
						 temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S2PSRSDARRACOMMFAILANSMSG", "S2PSRSDARRACOMMFAILANSMSGDIS", "S2PSRSDACBCQUESFAILMSGDIS", counter);
						 temp.description = oResource.getText("S2PSRSDARRACOMMFAILANSMSGDIS");
						 aMockMessages.push(temp);
						 counter++;
						 ErrorFlag = true;
					} else if (commFlag) {
						 temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S2PSRSDARRACOMMPOSIANSMSG", "S2PSRSDARRACOMMPOSIANSMSGDIS", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
						 temp.description = oResource.getText("S2PSRSDARRACOMMPOSIANSMSGDIS");
						 aMockMessages.push(temp);
						 counter++;
					}
					for(var i = 0; i < oneSelArr.length-1; i++){
						restArr[i] = this.getCommObj(RRAQusData.results, oResource.getText("S4DISRRAQUSIDTXT"), oneSelArr[i], oResource.getText("S4DISRRABRRATXT"), thisCntrlr);
						if(restArr[i].length > 0){
							if(restArr[i][0][Prop] !== ""){
							Qid2Val = restArr[i][0].Qid;
							resultArr = this.arrayRemove(oneSelArr, Qid2Val);
							break;}
						}														
				    }
					var RRA2Flag= this.getRRA2Flag(Prop, oneSelArr, RRAQusData, oResource, thisCntrlr);
				    if(resultArr.length > 0)skipArr.push(resultArr[0], resultArr[1]);
					for (var i = 0; i < RRAQusData.results.length; i++) {
						if(skipArr.indexOf(RRAQusData.results[i].Qid) >= 0){continue;}
						if(RRA2Flag && oneSelArr.indexOf(RRAQusData.results[i].Qid) >= 0){continue;}
							var temp = {};
							if (RRAQusData.results[i].BMvalueState === oResource.getText("S2ERRORVALSATETEXT") || RRAQusData.results[i].SalesFlg === "") {
								temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S2PSRSDARRAFAILANSMSG", "S2PSRSDARRAFAILANSMSGDIS", "S2PSRSDACBCQUESFAILMSGDIS", counter);
								temp.description = oResource.getText("S2PSRSDARRAFAILANSMSGDIS") + ' ' + (i + 1) +
									' ' + oResource.getText("S2PSRSDASLESSUCSSANSMSGPART2");
								aMockMessages.push(temp);
								counter++;
								ErrorFlag = true;
							} else if (RRAQusData.results[i].BMvalueState === oResource.getText("S2DELNAGVIZTEXT")) {
								temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S2PSRSDARRAPOSIANSMSG", "S2PSRSDARRAFAILANSMSGDIS", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
								temp.description = oResource.getText("S2PSRSDARRAPOSIANSMSGDIS") + ' ' + ' ' + (i +
									1) + ' ' + oResource.getText("S2PSRSDASLESSUCSSANSMSGPART2");
								aMockMessages.push(temp);
								counter++;
							}
				    }
					break;
				case 35:
					var RRAQusData = thisCntrlr.getView().getModel().getData().NAV_RRA_QA;
					var skipArr = ["3005", "3015", "3055"];
					var oneSelArr = ["3020", "3025", "3030"], restArr = [], resultArr = [], Qid2Val = "";
					var Prop = this.getProperty(parseInt(oModel[2].PsrStatus), oResource.getText("S4DISRRABRRATXT"), thisCntrlr);
					var commFlag = this.CheckComm(RRAQusData.results, Prop, oResource.getText("S4DISRRABRRATXT"), thisCntrlr, parseInt(oModel[2].PsrStatus));
					if (commFlag === false) {
						 temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S2PSRSDARRACOMMFAILANSMSG", "S2PSRSDARRACOMMFAILANSMSGDIS", "S2PSRSDACBCQUESFAILMSGDIS", counter);
						 temp.description = oResource.getText("S2PSRSDARRACOMMFAILANSMSGDIS");
						 aMockMessages.push(temp);
						 counter++;
						 ErrorFlag = true;
					} else if (commFlag) {
						 temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S2PSRSDARRACOMMPOSIANSMSG", "S2PSRSDARRACOMMPOSIANSMSGDIS", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
						 temp.description = oResource.getText("S2PSRSDARRACOMMPOSIANSMSGDIS");
						 aMockMessages.push(temp);
						 counter++;
					}
					for(var i = 0; i < oneSelArr.length-1; i++){
						restArr[i] = this.getCommObj(RRAQusData.results, oResource.getText("S4DISRRAQUSIDTXT"), oneSelArr[i], oResource.getText("S4DISRRABRRATXT"), thisCntrlr);
						if(restArr[i].length > 0){
							if(restArr[i][0][Prop] !== ""){
							Qid2Val = restArr[i][0].Qid;
							resultArr = this.arrayRemove(oneSelArr, Qid2Val);
							break;}
						}														
				    }
					var RRA2Flag= this.getRRA2Flag(Prop, oneSelArr, RRAQusData, oResource, thisCntrlr);
				    if(resultArr.length > 0)skipArr.push(resultArr[0], resultArr[1]);
					for (var i = 0; i < RRAQusData.results.length; i++) {
						if(skipArr.indexOf(RRAQusData.results[i].Qid) >= 0){continue;}
						if(RRA2Flag && oneSelArr.indexOf(RRAQusData.results[i].Qid) >= 0){continue;}
							var temp = {};
							if (RRAQusData.results[i].ConvalueState === oResource.getText("S2ERRORVALSATETEXT") || RRAQusData.results[i].ConFlg === "") {
								temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S2PSRSDARRAFAILANSMSG", "S2PSRSDARRAFAILANSMSGDIS", "S2PSRSDACBCQUESFAILMSGDIS", counter);
								temp.description = oResource.getText("S2PSRSDARRAFAILANSMSGDIS") + ' ' + (i + 1) +
									' ' + oResource.getText("S2PSRSDASLESSUCSSANSMSGPART2");
								aMockMessages.push(temp);
								counter++;
								ErrorFlag = true;
							} else if (RRAQusData.results[i].ConvalueState === oResource.getText("S2DELNAGVIZTEXT")) {
								temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S2PSRSDARRAPOSIANSMSG", "S2PSRSSDASSMTNEGMSGDIS", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
								temp.description = oResource.getText("S2PSRSDARRAPOSIANSMSGDIS") + ' ' + ' ' + (i +
									1) + ' ' + oResource.getText("S2PSRSDASLESSUCSSANSMSGPART2");
								aMockMessages.push(temp);
								counter++;
							}
				    }
					break;
				case 65:
					if (thisCntrlr.getView().getModel().getProperty("/SelectedSsdlVl") === oResource.getText("S2BSDASSMENTLVLOP")) {
						var temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S2PSRSSDASSMTNEGMSG", "S2PSRSSDASSMTNEGMSGDIS", "S2PSRSDACBCQUESFAILMSGDIS", counter);
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					}
					if (thisCntrlr.getView().byId("idDispSRRAssesTxtArea").getValue() ==="") {
						var temp = this.setValidModel(oResource, "S2ERRORVALSATETEXT", "S2PSRSDASSJUSTFAILMSG", "S2PSRSDASSJUSTFAILMSGDIS", "S2PSRSDACBCQUESFAILMSGDIS", counter);
						aMockMessages.push(temp);
						counter++;
						ErrorFlag = true;
					    } else {
					    var temp = this.setValidModel(oResource, "S2PSRSDACBCCHECKsUCSSMSGTYP", "S2PSRSDASSJUSTSUCSSMSG", "S2PSRSDASSJUSTFAILMSGDIS", "S2PSRSDACBCQUESSUCSSMSGTYP", counter);
						aMockMessages.push(temp);
						counter++;
				    }
				   break;
				}
				if (ErrorFlag === false) {
					var temp = this.setValidModel(oResource, "S2PSRSDAMSGTYPINFO", "S2PSRSDATYPINFOMSGDIS", "S2PSRSDATYPINFOMSGDIS", "S2PSRSDAMSGTYPINFORMATION", counter);
					aMockMessages.push(temp);
					counter++;
				} else {
					var temp = this.setValidModel(oResource, "S2PSRSDAMSGTYPINFO", "S2PSRSDACBCSFAFAILMSG", "S2PSRSDACBCSFAFAILMSG", "S2PSRSDAMSGTYPINFORMATION", counter);
					aMockMessages.push(temp);
					counter++;
				}
				var oModel = thisCntrlr.getJSONModel(aMockMessages);
				var viewModel = new sap.ui.model.json.JSONModel();
				viewModel.setData({
					messagesLength: aMockMessages.length + ''
				});
				thisCntrlr.that_views4.byId(com.amat.crm.opportunity.Ids.S4DISAPRMSGPOPOVERFTR).setModel(viewModel);
				thisCntrlr.oMessagePopover.setModel(oModel);
				return ErrorFlag;
			},
			/**
			 * This Method Use to get AMJD Question Flag.
			 * @name getRRA2Flag
			 * @param {String} Prop - Property, {Object} oneSelArr - AMJD Question Id Item, {Object Array} RRAQusData - RRA Question Data,
			 * @Param {sap.ui.model.resource.ResourceModel} oResource- resource Bundle type, {sap.ui.core.mvc.Controller} thisCntr - Current Controller
			 * @returns RRA2Flag(Boolean)
			 */
			getRRA2Flag: function(Prop, oneSelArr, RRAQusData, oResource, thisCntrlr){
				var RRA2Obj = this.getObject(RRAQusData.results, oResource.getText("S4DISRRAQUSIDTXT"), "3010", oResource.getText("S4DISRRABRRATXT"), thisCntrlr),
		            RRA2Flag = "",
		            temp ="",
		            RRA2AObj = [];
		        if(RRA2Obj[0][Prop] === "Y"){
		    	   for(var i = 0; i <= oneSelArr.length-1; i++){
		    		  temp = this.getObject(RRAQusData.results, oResource.getText("S4DISRRAQUSIDTXT"), oneSelArr[i], oResource.getText("S4DISRRABRRATXT"), thisCntrlr);
		    		  RRA2AObj[i] = temp[0][Prop];
		    	   }
		    	   RRA2Flag = RRA2AObj[0][Prop] !== "" || RRA2AObj[1][Prop] !== "" || RRA2AObj[2][Prop] !== "";
		        }
		        return RRA2Flag;
			},
			/**
			 * This Method Use to get Pop Over Data Object.
			 * @name setValidModel
			 * @param {sap.ui.model.resource.ResourceModel} oResource- resource Bundle, {String} type - Message Type, {String} title - Message Title,
			 * @param {String} description - Message description, {String} subtitle - Message subtitle, {integer} counter - Counter
			 * @returns {Object} obj
			 */
			setValidModel: function(oResource, type, title, description, subtitle, counter){
				var obj = {};
				obj.type = oResource.getText(type);
				obj.title = oResource.getText(title);
				obj.description = oResource.getText(description);
				obj.subtitle = oResource.getText(subtitle);
				obj.counter = counter;
				return obj;
			},
			/**
			 * This Method Handles sort lockup Data Press Event.
			 *
			 * @name groupBy
			 * @param {String} xs - lockup Data, {String} Key -Contact Type
			 * @returns {String}
			 */
			groupBy: function(xs, key) {
				return xs.reduce(function(rv, x) {
					(rv[x[key]] = rv[x[key]] || []).push(x);
					return rv;
				}, {});
			},			
    };
	return model;
}, true);