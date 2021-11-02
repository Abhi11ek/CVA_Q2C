/**------------------------------------------------------------------------------ *
 * This class return display Display ESA form model.                              *
 * ------------------------------------------------------------------------------ *
 * @class                                                                         *
 * @public                                                                        *
 * @author Abhishek Pant                                                          *
 * @since 25 November 2019                                                        *
 * @extends                                                                       *
 * @name com.amat.crm.opportunity.model.disEsaModel                               *
 *  * ----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 25/01/2021      Abhishek Pant   PCR033306         Q2C Display Enhancements     *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 ***********************************************************************************
 */

sap.ui.define(function () {
	"use strict";
	var model = {
		/**
		 * This method use to convert String Date to Object.
		 * @name esaDisMode
		 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller, {sap.ui.model.Model} GeneralInfodata - GenInfoModel, {String} VerType- ESA Version,
		 * @param {sap.ui.model.Model} PSRModel-PSRModel, {sap.ui.model.Model} SecurityData- SecurityModel, {sap.ui.model.Model} EsaData-ESAModel,
		 * @param {String} Status- ESA Status, {Boolean} editMode- Mode of view requested, {Boolean} SAFAction- SFA Flag, {Boolean} RPflag- ROM/POM Authorization Flag
		 * @returns {Object} EsaModel - ESA Model For View Binding
		 */
		esaDisMode: function (thisCntrlr, GeneralInfodata, VerType, PSRModel, SecurityData, EsaData, Status, editMode, SAFAction, RPflag) {
			var contactPer = false,
				chkLstPer = false,
				OmInitiateFlag = false,
				SlsInitiateFlag = false,
				GpmInitiateFlag = false;                                                                                                                                                   //PCR033306++
			var oResource = thisCntrlr.bundle;
			OmInitiateFlag = thisCntrlr.checkContact(EsaData.NAV_OM.results);
			SlsInitiateFlag = thisCntrlr.checkContact(EsaData.NAV_SLS.results);
			GpmInitiateFlag = thisCntrlr.checkContact(EsaData.NAV_GPM.results);                                                                                                                //PCR033306++
			if (parseInt(Status) > 4 && parseInt(Status) <= 50) {
				contactPer = OmInitiateFlag || SlsInitiateFlag ? true : false;
			}
			if (parseInt(Status) === 30) {
				chkLstPer = OmInitiateFlag || SlsInitiateFlag ? true : false;
			}
			var NotifyFlag = parseInt(Status) === 10 && (OmInitiateFlag || SlsInitiateFlag);
			var CcFlag = EsaData.CcOppId !== "" && EsaData.CcOpitmId !== "";                                                                                                                   //PCR033306++
			var EsaModel = {
				"EsaDisBoxVis": parseInt(Status) === 0 ? true : false,
				"EsaDecnBoxSelIndex": parseInt(Status) === 0 ? -1 : -1,
				"EsaStatBarVis": parseInt(Status) === 0 ? false : true,
				"EsaSclrContrVis": parseInt(Status) === 0 ? false : true,
				"EsaGenInfoDtaVis": parseInt(Status) === 0 || parseInt(Status) === 95 ? false : true,
				"EsaRDDisEnable": parseInt(Status) === 0 && SecurityData.InitEsa === oResource.getText("S1TABLESALESTAGECOL") ? true : false,
				"EsaStat": "Status:" + EsaData.StatusDesc,
				"ExtTxtVis": EsaData.Extended === oResource.getText("S2ODATAPOSVAL") ? true : false,
				"ChckListBtnTxt": EsaData.CheklistFlag === oResource.getText("S1TABLESALESTAGECOL") || EsaData.Extended === oResource
					.getText("S2ODATAPOSVAL") ? oResource.getText("S2ESAIDSCHEKLISTBTNTXTN30") : oResource.getText("S2ESAIDSCHEKLISTBTNTXT30"),
				"ChckListBtnIcon": oResource.getText("S2ESAIDSCHEKLISTBTNICON"),
				"ChckListBtnVis": (!CcFlag && (((parseInt(Status) === 30 || (parseInt(Status) === 50) && EsaData.CheklistFlag === oResource.getText(                                       //PCR033306++;Condition Updated
					"S2ODATAPOSVAL")) && VerType !== oResource.getText("S2ESAOLDVERKEY"))) || (VerType === oResource.getText("S2ESAOLDVERKEY") &&
					EsaData.CheklistFlag === oResource.getText( "S1TABLESALESTAGECOL")) || (EsaData.Extended === oResource.getText("S2ODATAPOSVAL") &&
					EsaData.CheklistFlag === oResource.getText("S2ODATAPOSVAL") && parseInt(Status) !== 40)) || (CcFlag && EsaData.CheklistFlag ===                                    //PCR033306++;Condition Updated
					oResource.getText("S1TABLESALESTAGECOL")) ? true : false,                                                                                                          //PCR033306++;Condition Updated
				"ChckListBtnEnbl": ((parseInt(Status) === 30 && chkLstPer === true) || parseInt(Status) === 50) || ((VerType === oResource
					.getText("S2ESAOLDVERKEY") ||
					EsaData.Extended === oResource.getText("S2ODATAPOSVAL")) && EsaData.CheklistFlag === oResource.getText(
					"S1TABLESALESTAGECOL")) ? true : false,
				"ReqExtBtnTxt": oResource.getText("S2ESAIDSREQEXETXTN30"),
				"ReqExtBtnIcon": oResource.getText("S2ESAIDSREQEXETBTNICON"),
				"ReqExtBtnVis": (parseInt(Status) === 30 || parseInt(Status) === 50) && parseInt(Status) !== 35 && parseInt(Status) !== 95 &&
				     VerType !== oResource.getText("S2ESAOLDVERKEY") && !(CcFlag) ? true : false,                                                                                          //PCR033306++;Condition Updated
				"ReqExtBtnEnbl": (parseInt(Status) === 30 || parseInt(Status) === 50) && contactPer === true ? true : false,
				"EditBtnTxt": editMode === true || RPflag === true ? oResource.getText("S2PSRSDACANBTNTXT") : oResource.getText(
					"S2CARMBTNEDIT"),
				"EditBtnIcon": editMode === true || RPflag === true ? oResource.getText("S2CANCELBTNICON") : oResource.getText(
					"S2PSRSDAEDITICON"),
				"EditBtnVis": (parseInt(Status) !== 95 && parseInt(Status) !== 40 && parseInt(Status) !== 20) && VerType !== oResource.getText(
					"S2ESAOLDVERKEY") && parseInt(Status) !== 40 && !(CcFlag) ? true : false,                                                                                         //PCR033306++;Condition Updated
				"EditBtnEnbl": true,
				"SaveBtnTxt": oResource.getText("S1PERDLOG_SAVE"),
				"SaveBtnIcon": oResource.getText("S2PSRSDASAVEICON"),
				"SaveBtnVis": parseInt(Status) !== 95 && VerType !== oResource.getText("S2ESAOLDVERKEY") && (parseInt(Status) === 4 ||
					parseInt(Status) === 5 || parseInt(Status) === 35) && !(CcFlag) ? true : false,                                                                                   //PCR033306++;Condition Updated
				"SaveBtnEnbl": editMode === true ? true : false,
				"SFAppBtnTxt": (parseInt(Status) === 5 || parseInt(Status) === 35) && SAFAction === true ? oResource.getText(
					"S2PSRSDASUBFORAPP") : (parseInt(Status) === 95 ? oResource.getText("S2PSRSDASFBTNCANNATXT") : (parseInt(Status) === 5 ?
					oResource.getText("S2PSRSDASFCANINITXT") : "")),
				"SFAppBtnIcon": (parseInt(Status) === 5 || parseInt(Status) === 35) && SAFAction === true ? oResource.getText(
					"S2PSRSDAWFICON") : (parseInt(Status) === 95 || parseInt(Status) === 5 ? oResource.getText("S2CANCELBTNICON") : ""),
				"SFAppBtnVis": (parseInt(Status) === 5 || parseInt(Status) === 95 || (parseInt(Status) === 35 && SAFAction === true)) && VerType !==
					oResource.getText("S2ESAOLDVERKEY") && !(CcFlag) ? true : false,                                                                                                  //PCR033306++;Condition Updated
				"SFAppBtnEnbl": parseInt(Status) === 5 || parseInt(Status) === 95 || parseInt(Status) === 35 ? true : false,
				"EsaAddBtnEnbl": SecurityData.AddContact === oResource.getText("S1TABLESALESTAGECOL") && (editMode === true || RPflag ===
					true) && contactPer === true ? true : false,
				"EsaConDelMod": SecurityData.DelContact === oResource.getText("S1TABLESALESTAGECOL") && (editMode === true || RPflag ===
					true) && contactPer === true ? oResource.getText("S2DELPOSVIZTEXT") : oResource.getText("S2DELNAGVIZTEXT"),
				"AttLblTxt": oResource.getText("S2GINFOPANLHEADERTXT"),
				"AttTxt": "0",
				"VerNoTxtVis": false,
				"VerNoSelectVis": true,
				"Esa_VerText": parseInt(EsaData.VersionNo),
				"EsaInfoCusTxt": GeneralInfodata.CustName,
				"EsaInfoBUNameTxt": GeneralInfodata.Bu,
				"EsaInfoRgnTxt": GeneralInfodata.ShipToRegion,
				"EsaInfoAppTxt": GeneralInfodata.Application,
				"EsaInfoDivTxt": GeneralInfodata.Division,                                                                                                                              //PCR033306++
				"EsaInfoPrcTxt": GeneralInfodata.NetValueMan,                                                                                                                           //PCR033306++
				"EsaInfoPrdTxt": GeneralInfodata.ProdFamily,                                                                                                                            //PCR033306++
				"EsaInfoAQtDTxt": GeneralInfodata.AmatQuoteId,                                                                                                                          //PCR033306++
				"EsaInfoDQtDTxt": GeneralInfodata.DftNo,                                                                                                                                //PCR033306++
				"EsaInfoOrdTypTxt": GeneralInfodata.OrderType,                                                                                                                          //PCR033306++
				"EsaInfoSltDTxt": GeneralInfodata.SlotId,                                                                                                                               //PCR033306++
				"EsaInfoCurrTxt": GeneralInfodata.Waers,
				"EsaInfoNodeTxt": "",
				"EsaInfoDTypTxt": EsaData.DeviceType,
				"EsaInfoTAMBATxt": EsaData.Tamba,
				"EsaInfoTAMBATxtVis": editMode === true && parseInt(Status) === 5 ? false : true,
				"EsaInfoTAMBAIPVis": editMode === true && parseInt(Status) === 5 ? true : false,
				"EsaInfoOppNoTxt": GeneralInfodata.OppId,
				"EsaInfoFabNameTxt": GeneralInfodata.FabName,
				"EsaInfoFabLocTxt": GeneralInfodata.FabAdd,
				"EsaInfoComterTxt": GeneralInfodata.Comptitor,
				"EsaInfoOdrAmtTxtVis": editMode === true && parseInt(Status) === 5 ? false : true,
				"EsaInfoOdrAmtTxtRDVis": editMode === true && parseInt(Status) === 5 ? true : false,
				"EsaInfoMstrAgrTxt": EsaData.MasterAgrmnt === "" ? "" : (EsaData.MasterAgrmnt === oResource.getText("S2POSMANDATANS") ?
					oResource.getText("S2PSRSDAYES") : oResource.getText("S2PSRSDANO")),
				"EsaInfoMstrAgrIndex": EsaData.MasterAgrmnt === "" ? 0 : (EsaData.MasterAgrmnt === oResource.getText("S2POSMANDATANS") ? 1 :
					2),
				"EsaInfoMstrAgrVS": EsaData.MasterAgrmnt === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EsaInfoMstrAgrTxtVis": editMode === true && parseInt(Status) === 5 ? false : true,
				"EsaInfoMstrAgrTxtRDVis": editMode === true && parseInt(Status) === 5 ? true : false,
				"EsaInfoCTAVPAVS": EsaData.CtaVpaValid === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EsaInfoCTAVPATxt": EsaData.CtaVpaValid === "" ? "" : (EsaData.CtaVpaValid === oResource.getText("S2POSMANDATANS") ?
					oResource.getText("S2PSRSDAYES") : oResource.getText("S2PSRSDANO")),
				"EsaInfoCTAVPAIndex": EsaData.CtaVpaValid === "" ? 0 : (EsaData.CtaVpaValid === oResource.getText("S2POSMANDATANS") ? 1 :
					2),
				"EsaInfoCTAVPATxtVis": editMode === true && parseInt(Status) === 5 && EsaData.MasterAgrmnt === oResource.getText(
					"S2POSMANDATANS") ? false : true,
				"EsaInfoCTAVPARDVis": editMode === true && parseInt(Status) === 5 && EsaData.MasterAgrmnt === oResource.getText(
					"S2POSMANDATANS") ? true : false,
				"EsaInfoCTAVPAVis": EsaData.MasterAgrmnt === oResource.getText("S2POSMANDATANS") ? true : false,
				"EsaInfoOdrNoTxt": GeneralInfodata.SoNumber,
				"EsaInfoEqipTypTxt": EsaData.EquipType,
				"EsaInfoBURevAssessQtrTxt": "",
				"EsaInfoFcstshipDtTxt": GeneralInfodata.CurrcustReqDt,
				"EsaInfoCustCoDtPri": GeneralInfodata.CustCoDtPri,
				"EsaInfoShipAddTxt": GeneralInfodata.ShipToAdd,
				"EsaWFConPnlVis": parseInt(Status) !== 95 ? true : false,
				"EsaWFConPnlExpd": parseInt(Status) === 5 || parseInt(Status) === 10 ? true : false,
				"EsaDiscriptPnlVis": parseInt(Status) !== 95 ? true : false,
				"EsaDiscriptPnlExpd": parseInt(Status) === 5 || parseInt(Status) === 35 ? true : false,
				"EsaExmptPnlVis": parseInt(Status) !== 95 ? true : false,
				"EsaExmptPnlExpd": false,
				"EsaAttachPnlVis": parseInt(Status) !== 95 ? true : false,
				"EsaAttachPnlExpd": parseInt(Status) === 5 || (EsaData.NAV_DOC.results[0].FileName !== "") ? true : false,
				"EsaAppvalPnlVis": parseInt(Status) !== 95 ? true : false,
				"EsaAppvalPnlExpd": parseInt(Status) > 5 && parseInt(Status) !== 35 ? true : false,
				"EsaMCommentPnlVis": true,
				"EsaMCommentPnlExpd": parseInt(Status) === 95 || EsaData.NAV_COMMENTS.results.length > 0 ? true : false,
				"EsaEvalcheckListPnlVis": parseInt(Status) !== 95 ? true : false,
				"Esa_Chng_HistExpd": true,
				"EsaMainComtTxtenabled": VerType !== oResource.getText("S2ESAOLDVERKEY") ? true : false,
				"EsaMainComSavBtnenabled": false,
				//*************************Start Of PCR033306: Q2C Display Enhancements********************
				"EsaCbnCpyPnlVis": parseInt(Status) !== 95 ? true : false,
				"EsaCbnCpyPnlExpd": (parseInt(Status) === 5 || parseInt(Status) === 4) || EsaData.NAV_ESA_CC.results.length > 0 ? true : false,
				"EsaCCLbTxt": CcFlag ? thisCntrlr.bundle.getText("S2PSRSDACCFRMTXT") + " " + EsaData.CcOppId + "_" + EsaData.CcOpitmId: "",
				"EsaCCIPEbl": editMode && parseInt(Status) === 5 ? true : false,
				"EsaDLnkVis": ((editMode && (parseInt(Status) === 5 || parseInt(Status) === 4)) || (GpmInitiateFlag && parseInt(Status) !== 5)) &&
				      EsaData.NAV_ESA_CC.results.length > 0 ? true : false,
				"EsaCbnCpyTblVis": EsaData.NAV_ESA_CC.results.length > 0 ? true : false,
				"EsaStdPayTermCTAIPVis": parseInt(EsaData.NAV_EXCEPINFO.StandardPayTeam) === 2 ? true : false,
				"EsaStdPayTermCTAIPVal": EsaData.NAV_EXCEPINFO.StandardPayteamNote,
				"EsaStdPayTermCTAIPVS": EsaData.NAV_EXCEPINFO.StandardPayteamNote === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource
					.getText("S2DELNAGVIZTEXT"),
				//*************************End Of PCR033306: Q2C Display Enhancements************************
				"PrevAgrementChk": EsaData.NAV_QAINFO.PrevAgrementChk === oResource.getText("S1TABLESALESTAGECOL") ? true : false,                                                             //PCR035760++ Defect#131 TechUpgrade changes
				"PrevAgrementTxt": oResource.getText("S2ESAIDSPROAGRTXT"),
				"PrevAgrementChkno": EsaData.NAV_QAINFO.PrevAgrementChkno,
				"PrevAgrementChkEbl": editMode === true && parseInt(Status) === 5 ? true : false,
				"PrevAgrementChknoEbl": editMode === true && parseInt(Status) === 5 ? true : false,
				"ReasonForEvalSelIndex": EsaData.NAV_QAINFO.ReasonForEval !== "" ? parseInt(EsaData.NAV_QAINFO.ReasonForEval) : 0,
				"ReasonForEvalSelVS": EsaData.NAV_QAINFO.ReasonForEval === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource
					.getText("S2DELNAGVIZTEXT"),
				"ReasonForEvalNote": EsaData.NAV_QAINFO.ReasonForEvalNote,
				"ReasonForEvalNoteVis": parseInt(EsaData.NAV_QAINFO.ReasonForEval) === 3 ? true : false,
				"ReasonForEvalNoteVS": EsaData.NAV_QAINFO.ReasonForEvalNote === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource
					.getText("S2DELNAGVIZTEXT"),
				"EqupDescTxt": oResource.getText("S2ESAIDSEQUIPAGRTXT"),
				"EqupDescTxtVal": EsaData.NAV_QAINFO.EqupDescEvalNote,
				"EqupOthnSwtrTxt": oResource.getText("S2ESAIDSEQUIPSFTOTHCOMMTXT"),
				"EqupLonTypeSelIndex": EsaData.NAV_QAINFO.EquipLoanType !== "" ? parseInt(EsaData.NAV_QAINFO.EquipLoanType) : 0,
				"EqupLonTypeSelVS": EsaData.NAV_QAINFO.EquipLoanType === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EqupOthnSwtrVis": parseInt(EsaData.NAV_QAINFO.EquipLoanType) >= 3 ? true : false,
				"EqupOthnSwtrVS": EsaData.NAV_QAINFO.EquipNote === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EqupOthnSwtrTxtVal": EsaData.NAV_QAINFO.EquipNote,
				"EqupSelOneSelIndex": EsaData.NAV_QAINFO.EquipProcessSelect !== "" ? parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) : 0,
				"EqupSelOneSelVS": EsaData.NAV_QAINFO.EquipProcessSelect === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource
					.getText("S2DELNAGVIZTEXT"),
				"EqupSelOnePRIPVis": parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) === 2 ? true : false,
				//*****************************Start Of PCR033306: Q2C Display Enhancements*****************************
				//"EqupSelOnePRVS": EsaData.NAV_QAINFO.EquipSelectNote === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
				//  "S2DELNAGVIZTEXT"),
				//"EqupSelOnePRIPVal": EsaData.NAV_QAINFO.EquipSelectNote,
				"EqupSelOnePRVS": parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) === 2 && EsaData.NAV_QAINFO.EquipSelectNote !== "" ?
						oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT"),
				"EqupSelOnePRIPVal": parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) === 2 ? EsaData.NAV_QAINFO.EquipSelectNote : "",
				"EqupSelOneOthIPVis": parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) === 3 ? true : false,
				"EqupSelOneOthVS": parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) === 3 && EsaData.NAV_QAINFO.EquipSelectNote !== "" ?
						oResource.getText("S2DELNAGVIZTEXT") : oResource.getText("S2ERRORVALSATETEXT"),
				"EqupSelOneOthIPVal": parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) === 3 ? (EsaData.NAV_QAINFO.EquipSelectOthNote =
					    EsaData.NAV_QAINFO.EquipSelectNote, EsaData.NAV_QAINFO.EquipSelectNote) : "",
				//*****************************End Of PCR033306: Q2C Display Enhancements********************************
				"EquipDevArrCkbSel": EsaData.NAV_QAINFO.DevArrngeChk === oResource.getText("S1TABLESALESTAGECOL") ? true : false,
				"EvalShipDateLbTxt": oResource.getText("S2ESAIDSESTSHPDATTXT"),
				"EvalShipDate": EsaData.NAV_QAINFO.EvalShipDate === "" ? null : (typeof (EsaData.NAV_QAINFO.EvalShipDate) === oResource.getText(
					"S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.EvalShipDate.slice(0, 4),
					EsaData.NAV_QAINFO.EvalShipDate.slice(4, 6) - 1, EsaData.NAV_QAINFO.EvalShipDate.slice(6, 8)) : EsaData.NAV_QAINFO.EvalShipDate),
				"EsaPreShipDateTxtVis": EsaData.Extended === oResource.getText("S1TABLESALESTAGECOL") ? true : false,
				"EsaPreETSEble": false,
				"EvalPreShipDate": EsaData.NAV_QAINFO.EvalShipDatePre === "" ? null : (typeof (EsaData.NAV_QAINFO.EvalShipDatePre) === oResource
					.getText("S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.EvalShipDatePre.slice(0, 4),
						EsaData.NAV_QAINFO.EvalShipDatePre.slice(4, 6) - 1, EsaData.NAV_QAINFO.EvalShipDatePre.slice(6, 8)) : EsaData.NAV_QAINFO.EvalShipDatePre
				),
				"EvalPreStartDate": EsaData.NAV_QAINFO.EvalStartDatePre === "" ? null : (typeof (EsaData.NAV_QAINFO.EvalStartDatePre) ===
					oResource.getText("S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.EvalStartDatePre.slice(0, 4),
						EsaData.NAV_QAINFO.EvalStartDatePre.slice(4, 6) - 1, EsaData.NAV_QAINFO.EvalStartDatePre.slice(6, 8)) : EsaData.NAV_QAINFO.EvalStartDatePre
				),
				"EvalPreEndDate": EsaData.NAV_QAINFO.EvalEndDatePre === "" ? null : (typeof (EsaData.NAV_QAINFO.EvalEndDatePre) === oResource
					.getText("S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.EvalEndDatePre.slice(0, 4),
						EsaData.NAV_QAINFO.EvalEndDatePre.slice(4, 6) - 1, EsaData.NAV_QAINFO.EvalEndDatePre.slice(6, 8)) : EsaData.NAV_QAINFO.EvalEndDatePre
				),
				"EsaPreASpecSelIndex": EsaData.NAV_QAINFO.AcepSpecAgreePre === "" ? 0 : (EsaData.NAV_QAINFO.AcepSpecAgreePre === oResource
					.getText("S2NEGMANDATANS") ? 1 : 2),
				"EsaPreACPosDPVis": EsaData.NAV_QAINFO.AcepSpecAgreePre === oResource.getText("S2POSMANDATANS") ? true : false,
				"EsaPreACPosIPVis": EsaData.NAV_QAINFO.AcepSpecAgreePre !== "" ? true : false,
				"PreAcepSpecnoNote": EsaData.NAV_QAINFO.AcepSpecnoNotePre,
				"PreAcepSpecnoNotePlcHoldr": EsaData.NAV_QAINFO.AcepSpecAgreePre === "" ? "" : (EsaData.NAV_QAINFO.AcepSpecAgreePre === thisCntrlr
					.bundle.getText("S2NEGMANDATANS") ? oResource.getText("S2ESAIDSDESSPETSNDSPECNOPLCHDRIPTXT") : oResource.getText(
						"S2ESAIDSDESSPETSNDSPECYOPLCHDRIPTXT")),
				"PreAcepSpecDate": EsaData.NAV_QAINFO.AcepSpecDatePre === "" ? null : (typeof (EsaData.NAV_QAINFO.AcepSpecDatePre) === oResource
					.getText("S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.AcepSpecDatePre.slice(0, 4),
						EsaData.NAV_QAINFO.AcepSpecDatePre.slice(4, 6) - 1, EsaData.NAV_QAINFO.AcepSpecDatePre.slice(6, 8)) : EsaData.NAV_QAINFO.AcepSpecDatePre
				),
				"PreDataSpecProvNote": EsaData.NAV_QAINFO.DataSpecProvNotePre,
				"EsaShipDateTxtVis": ((parseInt(Status) === 5 || parseInt(Status) === 35) && editMode === false) || (parseInt(Status) > 5 &&
					parseInt(Status) !== 35) ? true : false,
				"EsaShipDateDPVis": editMode === true && (parseInt(Status) === 5 || parseInt(Status) === 35) ? true : false,
				"EsaShipDateDPVS": EsaData.NAV_QAINFO.EvalShipDate === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EvalActShipDateLbTxt": oResource.getText("S2ESAIDSACTSHPDATTXT"),
				"EsaActShipDate": GeneralInfodata.ActShipDate === "" ? null : (typeof (GeneralInfodata.ActShipDate) === oResource.getText(
					"S2ESAIDSSTRCHKTXT") ? new Date(GeneralInfodata.ActShipDate.slice(0, 4),
					GeneralInfodata.ActShipDate.slice(4, 6) - 1, GeneralInfodata.ActShipDate.slice(6, 8)) : GeneralInfodata.ActShipDate),
				"EvalStartDateLbTxt": oResource.getText("S2ESAIDSEVALSTRTDATTXT"),
				"EvalStartDate": EsaData.NAV_QAINFO.EvalStartDate === "" ? null : (typeof (EsaData.NAV_QAINFO.EvalStartDate) === oResource
					.getText("S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.EvalStartDate.slice(0, 4),
						EsaData.NAV_QAINFO.EvalStartDate.slice(4, 6) - 1, EsaData.NAV_QAINFO.EvalStartDate.slice(6, 8)) : EsaData.NAV_QAINFO.EvalStartDate
				),
				"EsaShipSDateTxtVis": ((parseInt(Status) === 5 || parseInt(Status) === 35) && editMode === false) || (parseInt(Status) > 5 &&
					parseInt(Status) !== 35) ? true : false,
				"EsaShipSDateVS": EsaData.NAV_QAINFO.EvalStartDate === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EsaShipSDateDPVis": editMode === true && (parseInt(Status) === 5 || parseInt(Status) === 35) ? true : false,
				"EvalEndDateLbTxt": oResource.getText("S2ESAIDSEVALENDDATTXT"),
				"EvalEndDate": EsaData.NAV_QAINFO.EvalEndDate === "" ? null : (typeof (EsaData.NAV_QAINFO.EvalEndDate) === oResource.getText(
					"S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.EvalEndDate.slice(0, 4),
					EsaData.NAV_QAINFO.EvalEndDate.slice(4, 6) - 1, EsaData.NAV_QAINFO.EvalEndDate.slice(6, 8)) : EsaData.NAV_QAINFO.EvalEndDate),
				"EsaShipEDateTxtVis": ((parseInt(Status) === 5 || parseInt(Status) === 35) && editMode === false) || (parseInt(Status) > 5 &&
					parseInt(Status) !== 35) ? true : false,
				"EsaShipEDateDPVS": EsaData.NAV_QAINFO.EvalEndDate === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EsaShipEDateDPVis": editMode === true && (parseInt(Status) === 5 || parseInt(Status) === 35) ? true : false,
				"EsaASpecSelIndex": EsaData.NAV_QAINFO.AcepSpecAgree === "" ? 0 : (EsaData.NAV_QAINFO.AcepSpecAgree === oResource.getText(
					"S2NEGMANDATANS") ? 1 : 2),
				"EsaASpecSelVS": EsaData.NAV_QAINFO.AcepSpecAgree === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EsaACPosDPVis": EsaData.NAV_QAINFO.AcepSpecAgree === oResource.getText("S2POSMANDATANS") && editMode === true ? true : false,
				"EsaACPosIPVis": EsaData.NAV_QAINFO.AcepSpecAgree !== "" ? true : false,
				"EsaShipNDACAgreeTxtVis": EsaData.NAV_QAINFO.AcepSpecAgree === oResource.getText("S2POSMANDATANS") && editMode === false ?
					true : false,
				"AcepSpecnoNote": EsaData.NAV_QAINFO.AcepSpecnoNote,
				"AcepSpecnoNoteVS": EsaData.NAV_QAINFO.AcepSpecnoNote === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource
					.getText("S2DELNAGVIZTEXT"),
				"AcepSpecnoNotePlcHoldr": EsaData.NAV_QAINFO.AcepSpecAgree === "" ? "" : (EsaData.NAV_QAINFO.AcepSpecAgree === oResource.getText(
						"S2NEGMANDATANS") ? oResource.getText("S2ESAIDSDESSPETSNDSPECNOPLCHDRIPTXT") : oResource.getText("S2ESAIDSDESSPETSNDSPECYOPLCHDRIPTXT")),
				"AcepSpecDate": EsaData.NAV_QAINFO.AcepSpecDate === "" ? null : (typeof (EsaData.NAV_QAINFO.AcepSpecDate) === oResource.getText(
					"S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.AcepSpecDate.slice(0, 4),
					EsaData.NAV_QAINFO.AcepSpecDate.slice(4, 6) - 1, EsaData.NAV_QAINFO.AcepSpecDate.slice(6, 8)) : EsaData.NAV_QAINFO.AcepSpecDate),
				"AcepSpecDateVS": EsaData.NAV_QAINFO.AcepSpecDate === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"DataSpecProvNote": EsaData.NAV_QAINFO.DataSpecProvNote,
				"DataSpecProvNoteVS": EsaData.NAV_QAINFO.DataSpecProvNote === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource
					.getText("S2DELNAGVIZTEXT"),
				"EsaSucEvalLblTxt": oResource.getText("S2ESAIDSSUCSSEVALTXT"),
				"EsaSuccEvalCustIndex": EsaData.NAV_QAINFO.SuccEvalCust === "" ? 0 : parseInt(EsaData.NAV_QAINFO.SuccEvalCust),
				"EsaSuccEvalCustVS": EsaData.NAV_QAINFO.SuccEvalCust === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EsaCustBuyPriceIndex": EsaData.NAV_QAINFO.CustBuyPrice === "" ? 0 : parseInt(EsaData.NAV_QAINFO.CustBuyPrice),
				"EsaCustBuyPriceVS": EsaData.NAV_QAINFO.CustBuyPrice === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EsaSucEvalCustVis": EsaData.NAV_QAINFO.SuccEvalCust === "" ? false : (parseInt(EsaData.NAV_QAINFO.SuccEvalCust) === 2 ? true :
					false),
				"EsaPriceCurrIndex": EsaData.NAV_QAINFO.PriceCurr === "" ? (GeneralInfodata.Waers === "JPY" ? 2 : 1) : (EsaData.NAV_QAINFO.PriceCurr ===
					oResource.getText("S2ESAIDSPRUSDRDKYE") ? 1 : (EsaData.NAV_QAINFO.PriceCurr === oResource.getText("S2POSMANDATANS") ? 2 :
						parseInt(EsaData.NAV_QAINFO.PriceCurr))),
				"EvaNetDiffVal": EsaData.NAV_QAINFO.EvaNetDiffVal,
				"VpsNetPerTarget": EsaData.NAV_QAINFO.VpsNetPerTarget,
				"TargetSalesPrice": EsaData.NAV_QAINFO.TargetSalesPrice,
				"BottomSalesPrice": EsaData.NAV_QAINFO.BottomSalesPrice,
				"BottomCommNote": EsaData.NAV_QAINFO.BottomCommNote,
				"MarginPerTarget": EsaData.NAV_QAINFO.MarginPerTarget,
				"MarginPerBottom": EsaData.NAV_QAINFO.MarginPerBottom,
				"PriceJustiNote": EsaData.NAV_QAINFO.PriceJustiNote,
				"ExpSlsPriceHvm": EsaData.NAV_QAINFO.ExpSlsPriceHvm,
				"HvmEvalValIndex": EsaData.NAV_QAINFO.HvmEvalVal === "" ? 0 : (EsaData.NAV_QAINFO.HvmEvalVal === oResource.getText("S2NEGMANDATANS") ? 1 : 2) ,
				"PriceJustiNoteVS": EsaData.NAV_QAINFO.PriceJustiNote === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource
					.getText("S2DELNAGVIZTEXT"),
				"EsaAble2UpgrdeSelVal": EsaData.NAV_QAINFO.AbilityUpgradeChk === oResource.getText("S1TABLESALESTAGECOL") ? true : false,
				"EsaShipSTermIndex": EsaData.NAV_EXCEPINFO.ShipTerms === "" ? 0 : (EsaData.NAV_EXCEPINFO.ShipTerms === oResource.getText(
					"S2CBCSALESUCSSANS") ? 1 : 2),
				"EsaShipSTermVS": EsaData.NAV_EXCEPINFO.ShipTerms === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EsaShipSTermFormVis": EsaData.NAV_EXCEPINFO.ShipTerms === oResource.getText("S2ESAIDSPROSSEXDEDKYE") ? true : false,
				"EsaShipSTermProTermVal": EsaData.NAV_EXCEPINFO.ShipPropTermNote,
				"EsaShipSTermDesVal": EsaData.NAV_EXCEPINFO.ShipDescNote,
				"EsaShipSTermJustVal": EsaData.NAV_EXCEPINFO.ShipJustiNote,
				"EsaShipSTermJustVS": EsaData.NAV_EXCEPINFO.ShipJustiNote === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource
					.getText("S2DELNAGVIZTEXT"),
				"EsaShipSTermCommVal": EsaData.NAV_EXCEPINFO.ShipCommNote,
				"EsaShipSShipIndex": EsaData.NAV_EXCEPINFO.SplitShip === "" ? 0 : (EsaData.NAV_EXCEPINFO.SplitShip === oResource.getText(
					"S2CBCSALESUCSSANS") ? 1 : 2),
				"EsaShipSShipVS": EsaData.NAV_EXCEPINFO.SplitShip === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EsaShipSShipFormVis": EsaData.NAV_EXCEPINFO.SplitShip === oResource.getText("S2ESAIDSPROSSEXDEDKYE") ? true : false,
				"EsaShipSShipLocVal": EsaData.NAV_EXCEPINFO.ShipLoc,
				"EsaShipSShipLocVS": EsaData.NAV_EXCEPINFO.ShipLoc === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EsaShipSShipJustVal": EsaData.NAV_EXCEPINFO.SplitJustiNote,
				"EsaShipSShipJustVS": EsaData.NAV_EXCEPINFO.SplitJustiNote === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource
					.getText("S2DELNAGVIZTEXT"),
				"EsaShipSShipCommVal": EsaData.NAV_EXCEPINFO.SplitCommNote,
				"EsaShipOutShipCostIndex": EsaData.NAV_QAINFO.OutboundShipCost === "" ? 0 : parseInt(EsaData.NAV_QAINFO.OutboundShipCost),
				"EsaShipOutShipCostVS": EsaData.NAV_QAINFO.OutboundShipCost === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource
					.getText("S2DELNAGVIZTEXT"),
				"EsaEqipRetnIndex": EsaData.NAV_QAINFO.EquipReturnSelect === "" ? 0 : parseInt(EsaData.NAV_QAINFO.EquipReturnSelect),
				"EsaEqipRetnVS": EsaData.NAV_QAINFO.EquipReturnSelect === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource
					.getText("S2DELNAGVIZTEXT"),
				"EsaEqipRetnIPVal": EsaData.NAV_QAINFO.EquipReturnOtherNote,
				"EsaEqipRetnIPVS": EsaData.NAV_QAINFO.EquipReturnOtherNote === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource
					.getText("S2DELNAGVIZTEXT"),
				"EsaEqipRetnOthValVis": EsaData.NAV_QAINFO.EquipReturnSelect.toString() === "4" ? true : false,
				"EsaSupportCKSelVal": EsaData.NAV_QAINFO.SupportChk === oResource.getText("S1TABLESALESTAGECOL") ? true : false,
				"EsaSuppSupportRemMonths": parseInt(EsaData.NAV_QAINFO.SupportRemMonths),
				"EsaSuppSupportExeMonths": parseInt(EsaData.NAV_QAINFO.SupportExeMonths),
				"SupportMthEbl": EsaData.NAV_QAINFO.SupportChk === oResource.getText("S1TABLESALESTAGECOL") && editMode === true &&
					parseInt(Status) === 5 ? true : false,
				"EsaPayTermStdTermIndex": EsaData.NAV_EXCEPINFO.StandardPayTeam === "" ? 0 : parseInt(EsaData.NAV_EXCEPINFO.StandardPayTeam),
				"EsaPayTermStdTermVS": EsaData.NAV_EXCEPINFO.StandardPayTeam === "" && EsaData.NAV_EXCEPINFO.ExcepPayterm === "" ? oResource
					.getText("S2ERRORVALSATETEXT") : oResource.getText("S2DELNAGVIZTEXT"),
				"EsaPayTermExptIndex": EsaData.NAV_EXCEPINFO.ExcepPayterm === "" ? 0 : parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm),
				"EsaPayTermExptVS": EsaData.NAV_EXCEPINFO.StandardPayTeam === "" && EsaData.NAV_EXCEPINFO.ExcepPayterm === "" ? oResource.getText(
					"S2ERRORVALSATETEXT") : oResource.getText("S2DELNAGVIZTEXT"),
				"EsaPayTermExptOthIPVis": parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) === 3 ? true : false,
				"EsaPayTermExptOthIPVal": EsaData.NAV_EXCEPINFO.ExcepPaytermNote,
				"EsaPayTermExptOthIPVS": EsaData.NAV_EXCEPINFO.ExcepPaytermNote === "" ? oResource.getText("S2ERRORVALSATETEXT") : thisCntrlr
					.bundle.getText("S2DELNAGVIZTEXT"),
				"EsaPayTermSelPayTermBtnVis": parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) < 3 && parseInt(Status) === 5 && editMode === true ?
					true : false,
				"EsaPayTermPayTrmCode": EsaData.NAV_EXCEPINFO.PaytermCode,
				"EsaPayTermPayTrmCodeVS": (parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) === 1 || parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) ===
					2) && EsaData.NAV_EXCEPINFO.PaytermCode === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EsaPayTermPaytermDescNote": EsaData.NAV_EXCEPINFO.PaytermDescNote,
				"EsaPayTermPaytermJustiNote": EsaData.NAV_EXCEPINFO.PaytermJustiNote,
				"EsaPayTermPaytermJustiNoteIPVS": (parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) === 1 || parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) ===
					2) && EsaData.NAV_EXCEPINFO.PaytermJustiNote === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"EsaPayTermPaytermCommNote": EsaData.NAV_EXCEPINFO.PaytermCommNote,
				"EsaChinaCondEvalIndex": EsaData.NAV_EXCEPINFO.ChinaCondEval === "" ? 0 : (EsaData.NAV_EXCEPINFO.ChinaCondEval === oResource
					.getText("S2POSMANDATANS") ? 1 : 2),
				"EsaChinaCondEvalVS": EsaData.NAV_EXCEPINFO.ChinaCondEval === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource
					.getText("S2DELNAGVIZTEXT"),
				"EsaCustRiskIndex": EsaData.NAV_EXCEPINFO.CustRisk === "" ? 0 : (EsaData.NAV_EXCEPINFO.CustRisk === oResource.getText(
					"S2POSMANDATANS") ? 1 : 2),
				"EsaCustRiskVS": EsaData.NAV_EXCEPINFO.CustRisk === "" ? oResource.getText("S2ERRORVALSATETEXT") : oResource.getText(
					"S2DELNAGVIZTEXT"),
				"ReqName": EsaData.ReqName,
				"AprBtnVis": parseInt(Status) > 5 && parseInt(Status) < 20 && VerType !== oResource.getText("S2ESAOLDVERKEY") ? true : false,
				"AprBtnEbl": parseInt(Status) > 5 && parseInt(Status) < 20 && editMode === true && VerType !== oResource.getText(
					"S2ESAOLDVERKEY") && SecurityData.SendApproval === oResource.getText("S2ODATAPOSVAL")? true : false,
				"CancelBtnVis": parseInt(Status) > 5 && parseInt(Status) < 20 && VerType !== oResource.getText("S2ESAOLDVERKEY") &&
				     contactPer === true ? true : false,
				"RecreatBtnVis": parseInt(Status) >= 20 && parseInt(Status) !== 35 && parseInt(Status) !== 95 && VerType !== oResource.getText(
					"S2ESAOLDVERKEY") && contactPer === true && !(CcFlag) ? true : false,                                                                                           //PCR033306++;Condition Updated
				"EsaRDEbl": parseInt(Status) === 5 && editMode === true ? true : false,
				"EsaPreEvalTNDEbl": (parseInt(Status) === 5 || parseInt(Status) === 35) && editMode === true ? true : false,
				"ESAPrintPdfTxt": oResource.getText("S2CBCPRINTBTNTXT"),
				"ESAPrintPdfEbl": true,
				"ESAPrintPdfIcon": oResource.getText("S4DISPDFDISBTNICON"),
				"ESAPrintPdfVis": parseInt(Status) !== 95 ? true : false
			};
			var FooterBtn = thisCntrlr.that_views4.getContent()[0].getFooter().getContent(),
			    oView = thisCntrlr.getView(),
			    IDH = com.amat.crm.opportunity.Ids;
			if (editMode === false) {
				oView.byId(IDH.S4DISESASUPRTLBL1).removeStyleClass("sapMSuppLblYclass");
				oView.byId(IDH.S4DISESASUPRTLBL2).removeStyleClass("sapMSuppLblYclass");
				oView.byId(IDH.S4DISESAPAYTRMPTCODEIP).removeStyleClass("sapMPaytrmCodeEWidth");
				oView.byId(IDH.S4DISESASUPRTLBL1).addStyleClass("sapMSuppLblNclass");
				oView.byId(IDH.S4DISESASUPRTLBL2).addStyleClass("sapMSuppLblNclass");
				oView.byId(IDH.S4DISESAPAYTRMPTCODEIP).addStyleClass("sapMPaytrmCodeDWidth");
			} else if (editMode === true && parseInt(Status) === 5) {
				oView.byId(IDH.S4DISESASUPRTLBL1).removeStyleClass("sapMSuppLblNclass");
				oView.byId(IDH.S4DISESASUPRTLBL2).removeStyleClass("sapMSuppLblNclass");
				oView.byId(IDH.S4DISESASUPRTLBL1).addStyleClass("sapMSuppLblYclass");
				oView.byId(IDH.S4DISESASUPRTLBL2).addStyleClass("sapMSuppLblYclass");
				if(EsaModel.EsaPayTermStdTermVS === oResource.getText("S2ERRORVALSATETEXT") && EsaModel.EsaPayTermExptVS ===
					oResource.getText("S2ERRORVALSATETEXT")){
					oView.byId(IDH.S4DISESAPAYTRMPTCODEIP).removeStyleClass("sapMPaytrmCodeEWidth");
					oView.byId(IDH.S4DISESAPAYTRMPTCODEIP).addStyleClass("sapMPaytrmCodeDWidth");
				} else {
					oView.byId(IDH.S4DISESAPAYTRMPTCODEIP).removeStyleClass("sapMPaytrmCodeDWidth");
					oView.byId(IDH.S4DISESAPAYTRMPTCODEIP).addStyleClass("sapMPaytrmCodeEWidth");
				}
			}
			FooterBtn[2].setVisible(EsaModel.AprBtnVis);
			FooterBtn[3].setVisible(EsaModel.AprBtnVis);
			FooterBtn[6].setVisible(EsaModel.CancelBtnVis);
			FooterBtn[2].setEnabled(EsaModel.AprBtnEbl);
			FooterBtn[3].setEnabled(EsaModel.AprBtnEbl);
			FooterBtn[6].setEnabled(EsaModel.CancelBtnVis);
			FooterBtn[7].setVisible(EsaModel.RecreatBtnVis);
			FooterBtn[7].setEnabled(EsaModel.RecreatBtnVis);
			FooterBtn[8].setVisible(NotifyFlag);
			oView.byId(com.amat.crm.opportunity.Ids.S4DISESAVERCOMBOX).setVisible(EsaModel.VerNoSelectVis);
			EsaModel.EsaVerCollection = [{
				"ProductId": oResource.getText("S2BSDASSMENTLVLOP"),
				"Name": oResource.getText("S2ESAVERBYDEFKEY")
			}];
			var CurrVer = 0;
			for (var i = 0; i < EsaData.NAV_VER_INFO.results.length; i++) {
				var obj = {};
				obj.ProductId = parseInt(EsaData.NAV_VER_INFO.results[i].VersionNo);
				obj.Name = parseInt(EsaData.NAV_VER_INFO.results[i].VersionNo);
				EsaModel.EsaVerCollection.push(obj);
				CurrVer = parseInt(EsaData.NAV_VER_INFO.results[i].VersionNo);
			}
			EsaModel.SelectedVerNo = VerType !== oResource.getText("S2ESAOLDVERKEY") ? CurrVer : PSRModel;
			EsaModel.NAV_OM = EsaData.NAV_OM;
			EsaModel.NAV_LGL = EsaData.NAV_LGL;
			EsaModel.NAV_GPM = EsaData.NAV_GPM;
			EsaModel.NAV_BUGM = EsaData.NAV_BUGM;
			EsaModel.NAV_BMHEAD = EsaData.NAV_BMHEAD;
			EsaModel.NAV_SLS = EsaData.NAV_SLS;
			EsaModel.NAV_SCFO = EsaData.NAV_SCFO;
			EsaModel.NAV_AGM = EsaData.NAV_AGM;
			EsaModel.NAV_GC = EsaData.NAV_GC;
			EsaModel.NAV_RM = EsaData.NAV_RM;
			EsaModel.NAV_CON = EsaData.NAV_CON;
			EsaModel.NAV_ORCA = EsaData.NAV_ORCA;
			var FinalDoc = [];
			for (var i = 0; i < EsaData.NAV_DOC.results.length; i++) {
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
					"addupVisible": ""
				};
				doc.Guid = EsaData.NAV_DOC.results[i].Guid;
				doc.DocId = EsaData.NAV_DOC.results[i].DocId;
				doc.docsubtype = EsaData.NAV_DOC.results[i].DocSubtype;
				doc.itemguid = EsaData.NAV_DOC.results[i].ItemGuid;
				doc.DocDesc = EsaData.NAV_DOC.results[i].DocDesc;
				doc.doctype = EsaData.NAV_DOC.results[i].DocType;
				doc.filename = EsaData.NAV_DOC.results[i].FileName;
				doc.OriginalFname = EsaData.NAV_DOC.results[i].OriginalFname;
				doc.note = EsaData.NAV_DOC.results[i].Notes;
				doc.Enableflag = editMode === true && contactPer === true ? true : false;
				doc.addupVisible = SecurityData.UpldEsaDoc === oResource.getText("S1TABLESALESTAGECOL") ? true : false;
				doc.Enabledelflag = SecurityData.DelEsaDoc === oResource.getText("S1TABLESALESTAGECOL") && editMode === true && contactPer ===
					true ? true : false;
				doc.EnableDisflag = SecurityData.ViewEsaDoc === oResource.getText("S1TABLESALESTAGECOL") ? true : false;
				doc.uBvisible = EsaData.NAV_DOC.results[i].FileName === "" ? true : false;
				doc.bgVisible = !doc.uBvisible;
				doc.editable = EsaData.NAV_DOC.results[i].FileName === "" && editMode === true ? true : false;
				FinalDoc.push(doc);
			}
			var oRPSRDocJModel = new sap.ui.model.json.JSONModel({
				"ItemSet": FinalDoc
			});
			oView.byId(com.amat.crm.opportunity.Ids.S4DISESARESATCHTAB).setModel(oRPSRDocJModel);
			EsaModel.NAV_ESA_CC = EsaData.NAV_ESA_CC;                                                                                                                                      //PCR033306++
			EsaModel.oEsaAprvHis = EsaData.NAV_ESAAPRV_HIST;
			EsaModel.oEsaChngHis = EsaData.NAV_ESACHNG_HIST;
			EsaModel.NAV_COMMENTS = EsaData.NAV_COMMENTS;
			return EsaModel;
		},
		/**
		 * This method used to return payLoad for initiate/CancelInitiation/NA.
		 * @name esaInitpayload
		 * @param {String} Guid - Opportunity GUID, {String} ItemGuid - Opportunity ItemGuid, {String} ActionType - type of action,
		 * {String} CurrVersion - ESA current Version, {String} ProductLine - ProductLine
		 * @returns {Object} payLoad - PayLoad for Service call
		 */
		esaInitpayload: function (Guid, ItemGuid, ActionType, CurrVersion, ProductLine) {
			var payload = {};
			payload.Guid = Guid;
			payload.ItemGuid = ItemGuid;
			payload.ActionType = ActionType;
			payload.VersionNo = CurrVersion.toString();
			payload.StatusDesc = ProductLine;
			return payload;
		},
		/**
		 * This method used to return payLoad for Save/Submit actions.
		 * @name esaSavSubPayload
		 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller, {sap.ui.model.Model} EsaData - ESA Data, {String} ActionType - type of action
		 * @returns {Object} payLoad - PayLoad for Service call
		 */
		esaSavSubPayload: function (thisCntrlr, EsaData, ActionType) {
			var oResource = thisCntrlr.bundle;
			var payload = {};
			payload.NAV_QAINFO = {};
			payload.NAV_EXCEPINFO = {};
			payload.NAV_ESA_CC = [];                                                                                                                                                      //PCR033306++
			payload.Guid = EsaData.Guid;
			payload.ItemGuid = EsaData.ItemGuid;
			payload.VersionNo = EsaData.VersionNo.toString();
			payload.ActionType = ActionType;
			payload.Status = EsaData.Status.toString();
			payload.MasterAgrmnt = EsaData.MasterAgrmnt === "" ? "" : (EsaData.MasterAgrmnt.toString() === "1" || EsaData.MasterAgrmnt.toString() ===
				oResource.getText("S2POSMANDATANS") ? oResource.getText("S2POSMANDATANS") : oResource.getText(
					"S2NEGMANDATANS"));
			payload.Tamba = EsaData.Tamba;
			payload.CtaVpaValid = EsaData.CtaVpaValid === "" ? "" : (EsaData.CtaVpaValid.toString() === "1" || EsaData.CtaVpaValid.toString() ===
				oResource.getText("S2POSMANDATANS") ? oResource.getText("S2POSMANDATANS") : oResource.getText(
					"S2NEGMANDATANS"));
			payload.TaskId = EsaData.TaskId;
			payload.WiId = EsaData.WiId;
			payload.AprvComments = EsaData.AprvComments;
			payload.NAV_QAINFO.EvalShipDatePre = this.EsaDateconvert(thisCntrlr, EsaData.NAV_QAINFO.EvalShipDatePre);
			payload.NAV_QAINFO.Guid = EsaData.Guid;
			payload.NAV_QAINFO.ItemGuid = EsaData.ItemGuid;
			payload.NAV_QAINFO.VersionNo = EsaData.VersionNo;
			payload.NAV_QAINFO.EvalStartDatePre = this.EsaDateconvert(thisCntrlr, EsaData.NAV_QAINFO.EvalStartDatePre);
			payload.NAV_QAINFO.PrevAgrementChk = EsaData.NAV_QAINFO.PrevAgrementChk;
			payload.NAV_QAINFO.EvalEndDatePre = this.EsaDateconvert(thisCntrlr, EsaData.NAV_QAINFO.EvalEndDatePre);
			payload.NAV_QAINFO.AcepSpecAgreePre = EsaData.NAV_QAINFO.AcepSpecAgreePre;
			payload.NAV_QAINFO.PrevAgrementChkno = EsaData.NAV_QAINFO.PrevAgrementChkno;
			payload.NAV_QAINFO.AcepSpecnoNotePre = EsaData.NAV_QAINFO.AcepSpecnoNotePre;
			payload.NAV_QAINFO.ReasonForEval = EsaData.NAV_QAINFO.ReasonForEval.toString();
			payload.NAV_QAINFO.AcepSpecDatePre = this.EsaDateconvert(thisCntrlr, EsaData.NAV_QAINFO.AcepSpecDatePre);
			payload.NAV_QAINFO.DataSpecProvNotePre = EsaData.NAV_QAINFO.DataSpecProvNotePre;
			payload.NAV_QAINFO.ReasonForEvalNote = EsaData.NAV_QAINFO.ReasonForEval.toString() === "3" ? EsaData.NAV_QAINFO.ReasonForEvalNote :
				"";
			payload.NAV_QAINFO.EqupDescEvalNote = EsaData.NAV_QAINFO.EqupDescEvalNote;
			payload.NAV_QAINFO.EquipLoanType = EsaData.NAV_QAINFO.EquipLoanType.toString();
			payload.NAV_QAINFO.EquipNote = parseInt(EsaData.NAV_QAINFO.EquipLoanType) > 2 ? EsaData.NAV_QAINFO.EquipNote : "";
			payload.NAV_QAINFO.EquipProcessSelect = EsaData.NAV_QAINFO.EquipProcessSelect.toString();
			payload.NAV_QAINFO.EquipSelectNote = EsaData.NAV_QAINFO.EquipProcessSelect.toString() === "2" ? EsaData.NAV_QAINFO.EquipSelectNote :
		    //*************************Start Of PCR033306: Q2C Display Enhancements********************
			//	"";
				(EsaData.NAV_QAINFO.EquipProcessSelect.toString() === "3" ? EsaData.NAV_QAINFO.EquipSelectOthNote : "");
			//*************************End Of PCR033306: Q2C Display Enhancements********************
			payload.NAV_QAINFO.DevArrngeChk = EsaData.NAV_QAINFO.DevArrngeChk;
			payload.NAV_QAINFO.EvalShipDate = this.EsaDateconvert(thisCntrlr, EsaData.NAV_QAINFO.EvalShipDate);
			payload.NAV_QAINFO.EvalStartDate = this.EsaDateconvert(thisCntrlr, EsaData.NAV_QAINFO.EvalStartDate);
			payload.NAV_QAINFO.EvalEndDate = this.EsaDateconvert(thisCntrlr, EsaData.NAV_QAINFO.EvalEndDate);
			payload.NAV_QAINFO.AcepSpecAgree = EsaData.NAV_QAINFO.AcepSpecAgree.toString() === "0" ? "" : EsaData.NAV_QAINFO.AcepSpecAgree;
			payload.NAV_QAINFO.AcepSpecnoNote = EsaData.NAV_QAINFO.AcepSpecAgree !== "" ? EsaData.NAV_QAINFO.AcepSpecnoNote : "";
			payload.NAV_QAINFO.AcepSpecDate = EsaData.NAV_QAINFO.AcepSpecAgree.toString() === oResource.getText("S2POSMANDATANS") ? this
				.EsaDateconvert(thisCntrlr, EsaData.NAV_QAINFO.AcepSpecDate) : "";
			payload.NAV_QAINFO.DataSpecProvNote = EsaData.NAV_QAINFO.DataSpecProvNote;
			payload.NAV_QAINFO.SuccEvalCust = EsaData.NAV_QAINFO.SuccEvalCust.toString();
			payload.NAV_QAINFO.CustBuyPrice = EsaData.NAV_QAINFO.CustBuyPrice.toString();
			payload.NAV_QAINFO.PriceCurr = EsaData.NAV_QAINFO.PriceCurr === oResource.getText("S2ESAIDSPRUSDRDKYE") ? "1" : (EsaData.NAV_QAINFO.PriceCurr ===
				oResource.getText("S2POSMANDATANS") ? 2 : EsaData.NAV_QAINFO.PriceCurr.toString());
			payload.NAV_QAINFO.EvaNetDiffVal = EsaData.NAV_QAINFO.EvaNetDiffVal;
			payload.NAV_QAINFO.VpsNetPerTarget = EsaData.NAV_QAINFO.VpsNetPerTarget;
			payload.NAV_QAINFO.ExpSlsPriceHvm = EsaData.NAV_QAINFO.ExpSlsPriceHvm;
			payload.NAV_QAINFO.HvmEvalVal = EsaData.NAV_QAINFO.HvmEvalVal === 0 || EsaData.NAV_QAINFO.HvmEvalVal === "" ? "" : EsaData.NAV_QAINFO.HvmEvalVal;
			payload.NAV_QAINFO.TargetSalesPrice = EsaData.NAV_QAINFO.TargetSalesPrice;
			payload.NAV_QAINFO.BottomSalesPrice = EsaData.NAV_QAINFO.BottomSalesPrice;
			payload.NAV_QAINFO.BottomCommNote = EsaData.NAV_QAINFO.BottomCommNote;
			payload.NAV_QAINFO.MarginPerTarget = EsaData.NAV_QAINFO.MarginPerTarget;
			payload.NAV_QAINFO.MarginPerBottom = EsaData.NAV_QAINFO.MarginPerBottom;
			payload.NAV_QAINFO.PriceJustiNote = EsaData.NAV_QAINFO.PriceJustiNote;
			payload.NAV_QAINFO.AbilityUpgradeChk = EsaData.NAV_QAINFO.AbilityUpgradeChk;
			payload.NAV_QAINFO.OutboundShipCost = EsaData.NAV_QAINFO.OutboundShipCost.toString();
			payload.NAV_QAINFO.EquipReturnSelect = EsaData.NAV_QAINFO.EquipReturnSelect.toString();
			payload.NAV_QAINFO.EquipReturnOtherNote = EsaData.NAV_QAINFO.EquipReturnSelect.toString() === "4" ? EsaData.NAV_QAINFO.EquipReturnOtherNote :
				"";
			payload.NAV_QAINFO.SupportChk = EsaData.NAV_QAINFO.SupportChk;
			payload.NAV_QAINFO.SupportRemMonths = EsaData.NAV_QAINFO.SupportChk === oResource.getText("S1TABLESALESTAGECOL") ? EsaData.NAV_QAINFO
				.SupportRemMonths : "";
			payload.NAV_QAINFO.SupportExeMonths = EsaData.NAV_QAINFO.SupportChk === oResource.getText("S1TABLESALESTAGECOL") ? EsaData.NAV_QAINFO
				.SupportExeMonths : "";
			payload.NAV_EXCEPINFO.Guid = EsaData.Guid;
			payload.NAV_EXCEPINFO.ItemGuid = EsaData.ItemGuid;
			payload.NAV_EXCEPINFO.VersionNo = EsaData.VersionNo;
			payload.NAV_EXCEPINFO.ShipTerms = EsaData.NAV_EXCEPINFO.ShipTerms.toString();
			payload.NAV_EXCEPINFO.ShipPropTermNote = EsaData.NAV_EXCEPINFO.ShipTerms.toString() === oResource.getText(
				"S2ESAIDSPROSSEXDEDKYE") ? EsaData.NAV_EXCEPINFO.ShipPropTermNote : "";
			payload.NAV_EXCEPINFO.ShipDescNote = EsaData.NAV_EXCEPINFO.ShipTerms.toString() === oResource.getText(
				"S2ESAIDSPROSSEXDEDKYE") ? EsaData.NAV_EXCEPINFO.ShipDescNote : "";
			payload.NAV_EXCEPINFO.ShipJustiNote = EsaData.NAV_EXCEPINFO.ShipTerms.toString() === oResource.getText(
				"S2ESAIDSPROSSEXDEDKYE") ? EsaData.NAV_EXCEPINFO.ShipJustiNote : "";
			payload.NAV_EXCEPINFO.ShipCommNote = EsaData.NAV_EXCEPINFO.ShipTerms.toString() === oResource.getText(
				"S2ESAIDSPROSSEXDEDKYE") ? EsaData.NAV_EXCEPINFO.ShipCommNote : "";
			payload.NAV_EXCEPINFO.SplitShip = EsaData.NAV_EXCEPINFO.SplitShip.toString();
			payload.NAV_EXCEPINFO.ShipLoc = EsaData.NAV_EXCEPINFO.SplitShip.toString() === oResource.getText("S2ESAIDSPROSSEXDEDKYE") ?
				EsaData.NAV_EXCEPINFO.ShipLoc : "";
			payload.NAV_EXCEPINFO.SplitJustiNote = EsaData.NAV_EXCEPINFO.SplitShip.toString() === oResource.getText(
				"S2ESAIDSPROSSEXDEDKYE") ? EsaData.NAV_EXCEPINFO.SplitJustiNote : "";
			payload.NAV_EXCEPINFO.SplitCommNote = EsaData.NAV_EXCEPINFO.SplitShip.toString() === oResource.getText(
				"S2ESAIDSPROSSEXDEDKYE") ? EsaData.NAV_EXCEPINFO.SplitCommNote : "";
			payload.NAV_EXCEPINFO.StandardPayTeam = EsaData.NAV_EXCEPINFO.ExcepPayterm === "" || EsaData.NAV_EXCEPINFO.ExcepPayterm.toString() ===
				"0" ? (EsaData.NAV_EXCEPINFO.StandardPayTeam.toString() === "0" ?
					EsaData.NAV_EXCEPINFO.StandardPayTeam = "" : EsaData.NAV_EXCEPINFO.StandardPayTeam.toString()) : "";
			payload.NAV_EXCEPINFO.ExcepPayterm = EsaData.NAV_EXCEPINFO.StandardPayTeam === "" || EsaData.NAV_EXCEPINFO.StandardPayTeam.toString() ===
				"0" ? (EsaData.NAV_EXCEPINFO.ExcepPayterm.toString() === "0" ?
					EsaData.NAV_EXCEPINFO.ExcepPayterm = "" : EsaData.NAV_EXCEPINFO.ExcepPayterm.toString()) : "";
			payload.NAV_EXCEPINFO.ExcepPaytermNote = EsaData.NAV_EXCEPINFO.ExcepPayterm.toString() === "3" ? EsaData.NAV_EXCEPINFO.ExcepPaytermNote :
				"";
			payload.NAV_EXCEPINFO.PaytermCode = EsaData.NAV_EXCEPINFO.PaytermCode;
			payload.NAV_EXCEPINFO.PaytermDescNote = EsaData.NAV_EXCEPINFO.PaytermDescNote;
			payload.NAV_EXCEPINFO.PaytermJustiNote = EsaData.NAV_EXCEPINFO.PaytermJustiNote;
			payload.NAV_EXCEPINFO.PaytermCommNote = EsaData.NAV_EXCEPINFO.PaytermCommNote;
			payload.NAV_EXCEPINFO.ChinaCondEval = EsaData.NAV_EXCEPINFO.ChinaCondEval.toString();
			payload.NAV_EXCEPINFO.CustRisk = EsaData.NAV_EXCEPINFO.CustRisk.toString();
			//*************************Start Of PCR033306 Q2C Display Enhancements********************
			payload.NAV_EXCEPINFO.StandardPayteamNote = payload.NAV_EXCEPINFO.StandardPayTeam === "2" ? thisCntrlr.getModel().getProperty("/EsaStdPayTermCTAIPVal") :
				EsaData.NAV_EXCEPINFO.StandardPayteamNote;
			payload.CcOppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData().OppId;
			payload.CcOpitmId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPGENINFOMODEL")).getData().ItemNo.toString();
			if (thisCntrlr.getModel().getProperty("/NAV_ESA_CC").results.length > 0) {
				var EsaCcTabData = thisCntrlr.getModel().getProperty("/NAV_ESA_CC").results;
				if (EsaCcTabData.length > 0) {
					for (var i = 0; i < EsaCcTabData.length; i++) {
						var data = {};
						data.Guid = EsaCcTabData[i].Guid;
						data.ItemGuid = EsaCcTabData[i].ItemGuid;
						data.OppId = EsaCcTabData[i].OppId;
						data.ItemNo = EsaCcTabData[i].ItemNo;
						payload.NAV_ESA_CC.push(data);
					}
				}
			}
			//*************************End Of PCR033306 Q2C Display Enhancements**********************
			return payload;
		},
		/**
		 * This method used to Convert Date Object to String.
		 * @name EsaDateconvert
		 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller, {Date} selDate - Date Object
		 * @returns {Date} selDate - Date String
		 */
		EsaDateconvert: function (thisCntrlr, selDate) {
			return selDate !== null ? (typeof (selDate) !== thisCntrlr.bundle.getText("S2ESAIDSSTRCHKTXT") ? (selDate.getFullYear().toString() +
				(selDate.getMonth() + 1 < 10 ? "0" + (selDate.getMonth() + 1).toString() :
					(selDate.getMonth() + 1).toString()) + (selDate.getDate() < 10 ? "0" + selDate.getDate().toString() : selDate.getDate().toString())
			) : selDate) : "";
		},
		/**
		 * This method used to return ESA Check List PayLoad.
		 * @name esaChkListPayload
		 * @param {sap.ui.core.mvc.Controller} thisCntr - Current Controller, {Object} ChkListData - Check List Data
		 * @returns {Object} PayLoad - PayLoad For Service Call.
		 */
		//esaChkListPayload: function (thisCntrlr, ChkListData) {                                                                                            //PCR033306--
		esaChkListPayload: function (thisCntrlr, ChkListData, chkListFlag) {                                                                                 //PCR033306++
			var Payload = {};
			Payload.NAV_CHECKLIST = [];
			Payload.Guid = ChkListData[0].Guid;
			Payload.ItemGuid = ChkListData[0].ItemGuid;
			Payload.VersionNo = ChkListData[0].VersionNo;
			Payload.Submit = chkListFlag == thisCntrlr.bundle.getText("S2PSRSDACBCSFASUBTYPEMSG") ?
					thisCntrlr.bundle.getText("S1TABLESALESTAGECOL"): thisCntrlr.bundle.getText("S2PSRDCNASHPODKEY");                                         //PCR033306++
			for (var i = 0; i <= ChkListData.length - 1; i++) {
				var obj = {};
				obj.Guid = ChkListData[i].Guid;
				obj.ItemGuid = ChkListData[i].ItemGuid;
				obj.VersionNo = ChkListData[i].VersionNo;
				obj.Qid = ChkListData[i].Qid;
				obj.Qdesc = "";
				obj.Comments = ChkListData[i].Comments;
				//obj.AnsCheck = ChkListData[i].AnsCheck === true ? thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") : "";                                    //PCR033306--
				obj.AnsCheck = ((ChkListData[i].AnsCheck === true)||(ChkListData[i].AnsCheck === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL"))) ? 
						thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") : "";                                                                                //PCR033306++; modify Condition
				obj.QaVerNo = ChkListData[i].QaVerNo;
				Payload.NAV_CHECKLIST.push(obj);
			}
			return Payload;
		}
	};
	return model;
}, true);