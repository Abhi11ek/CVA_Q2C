/**
 * This class return esa form model.
 * 
 * @class
 * @public
 * @author Abhishek Pant
 * @since 17 June 2019
 * @extends
 * @name com.amat.crm.opportunity.model.esaDisModel                               *
 *  * ----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 17/06/2019      Abhishek        PCR023905         Migrate ESA/IDS db from Lotus*
 *                 Pant                              Notes to SAP Fiori Q2C       *
 *                                                   Application                  *
 * 26/09/2019      Abhishek        PCR025717         Q2C Q4 2019 Enhancements     *
 *                 Pant                                                           *
 * 26/02/2020      Arun            PCR026551         Pre-shipment development     *
 *                 Jacob                                                          *
 * 26/04/2020      Abhishek        PCR028870         INC05691207: code            *
 *                 Pant                              Modification                 *
 * 19/05/2020      Abhishek        PCR029343         INC05691947: Field Mapping   *
 *                 Pant                              Modification                 *
 * 08/06/2020      Arun            PCR028711         Q2C Enhancements for Q2-20   *
 *                 Jacob                                                          *
 * 25/01/2021      Abhishek Pant   PCR033306         Q2C Display Enhancements     *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 * 06/04/2021      Arun Jacob      PCR034716         Q2C ESA,PSR Enhancements     *
 ***********************************************************************************
 */

sap.ui.define(function () {
	"use strict";
	var model = {
		/** 
		 * This method use to convert String Date to Object.
		 * 
		 * @name esaDisMode
		 * @param thisCntrlr - Controller, GeneralInfodata - GenInfoModel, VerType- ESA Version, PSRModel-PSRModel, SecurityData- SecurityModel, EsaData-ESAModel, 
		 * Status- ESA Status, editMode- Mode of view requested, SAFAction- SFA Flag, RPflag- ROM/POM Authorization Flag
		 * @returns EsaModel - ESA Model For View Binding
		 */
		esaDisMode: function (thisCntrlr, GeneralInfodata, VerType, PSRModel, SecurityData, EsaData, Status, editMode, SAFAction, RPflag) {
			var contactPer = false,
				chkLstPer = false,
				romAuth = false,
				pomAuth = false,
				bomAuth = false,
				slsAuth = false;                                                                                                                               //PCR034716++
			if (parseInt(Status) > 4 && parseInt(Status) <= 50) {
				bomAuth = thisCntrlr.checkContact(EsaData.NAV_BMO.results);
				romAuth = thisCntrlr.checkContact(EsaData.NAV_ROM.results);
				pomAuth = thisCntrlr.checkContact(EsaData.NAV_POM.results);
				slsAuth = thisCntrlr.checkContact(EsaData.NAV_SLS.results);                                                                                    //PCR034716++
				contactPer = bomAuth || romAuth || pomAuth ? true : false;
			}
			if (parseInt(Status) === 30) {
				romAuth = thisCntrlr.checkContact(EsaData.NAV_ROM.results);
				pomAuth = thisCntrlr.checkContact(EsaData.NAV_POM.results);
				chkLstPer = romAuth || pomAuth ? true : false;
			}
			var CcFlag = EsaData.CcOppId !== "" && EsaData.CcOpitmId !== "";                                                                                   //PCR028711++
			var EsaModel = {
				"EsaDisBoxVis": parseInt(Status) === 0 ? true : false,
				"EsaDecnBoxSelIndex": parseInt(Status) === 0 ? -1 : -1,
				"EsaStatBarVis": parseInt(Status) === 0 ? false : true,
				"EsaSclrContrVis": parseInt(Status) === 0 ? false : true,
				"EsaGenInfoDtaVis": parseInt(Status) === 0 || parseInt(Status) === 95 ? false : true,
				"EsaRDDisEnable": parseInt(Status) === 0 && SecurityData.InitEsa === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? true : false,
				"EsaStat": "Status:" + EsaData.StatusDesc,
				"ExtTxtVis": EsaData.Extended === thisCntrlr.bundle.getText("S2ODATAPOSVAL") ? true : false,
				"ChckListBtnTxt": EsaData.CheklistFlag === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") || EsaData.Extended === thisCntrlr.bundle
					.getText(
						"S2ODATAPOSVAL") ? thisCntrlr.bundle.getText("S2ESAIDSCHEKLISTBTNTXTN30") : thisCntrlr.bundle.getText("S2ESAIDSCHEKLISTBTNTXT30"),
				"ChckListBtnIcon": thisCntrlr.bundle.getText("S2ESAIDSCHEKLISTBTNICON"),
				"ChckListBtnVis": ((((parseInt(Status) === 30 || (parseInt(Status) === 50) && EsaData.CheklistFlag === thisCntrlr.bundle.getText(
				        "S2ODATAPOSVAL")) && VerType !== thisCntrlr.bundle.getText("S2ESAOLDVERKEY"))) || (VerType === thisCntrlr.bundle.getText(
				        "S2ESAOLDVERKEY") && EsaData.CheklistFlag ===thisCntrlr.bundle.getText("S1TABLESALESTAGECOL")) || (EsaData.Extended ===
				        thisCntrlr.bundle.getText("S2ODATAPOSVAL") && EsaData.CheklistFlag === thisCntrlr.bundle.getText("S2ODATAPOSVAL") &&
				        parseInt(Status) !== 40)) || (CcFlag && EsaData.CheklistFlag ===thisCntrlr.bundle.getText("S1TABLESALESTAGECOL")) ? true : false,     //PCR028711++;Condition Updated PCR034716--;!CcFlag && removed
				"ChckListBtnEnbl": ((parseInt(Status) === 30 && chkLstPer === true) || parseInt(Status) === 50) || ((VerType === thisCntrlr.bundle
					.getText("S2ESAOLDVERKEY") ||
					EsaData.Extended === thisCntrlr.bundle.getText("S2ODATAPOSVAL")) && EsaData.CheklistFlag === thisCntrlr.bundle.getText(
					"S1TABLESALESTAGECOL")) ? true : false,
				"ReqExtBtnTxt": thisCntrlr.bundle.getText("S2ESAIDSREQEXETXTN30"),
				"ReqExtBtnIcon": thisCntrlr.bundle.getText("S2ESAIDSREQEXETBTNICON"),
				"ReqExtBtnVis": (parseInt(Status) === 30 || parseInt(Status) === 50) && parseInt(Status) !== 35 && parseInt(Status) !== 95 &&
					VerType !== thisCntrlr.bundle.getText("S2ESAOLDVERKEY") && !(CcFlag)? true : false,                                                        //PCR028711++;Condition Updated
				"ReqPrintBtnVis": parseInt(Status) !== 95 ? true : false,                                                                                      //PCR028711++
				"ReqExtBtnEnbl": (parseInt(Status) === 30 || parseInt(Status) === 50) && bomAuth === true ? true : false,
				"EditBtnTxt": editMode === true || RPflag === true ? thisCntrlr.bundle.getText("S2PSRSDACANBTNTXT") : thisCntrlr.bundle.getText(
					"S2CARMBTNEDIT"),
				"EditBtnIcon": editMode === true || RPflag === true ? thisCntrlr.bundle.getText("S2CANCELBTNICON") : thisCntrlr.bundle.getText(
					"S2PSRSDAEDITICON"),
				"EditBtnVis": (parseInt(Status) !== 95 && parseInt(Status) !== 40 && parseInt(Status) !== 20) && VerType !== thisCntrlr.bundle.getText(
					"S2ESAOLDVERKEY") && parseInt(Status) !== 40 && !(CcFlag) ? true : false,                                                                  //PCR028711++;Condition Updated
				"EditBtnEnbl": true,
				"SaveBtnTxt": thisCntrlr.bundle.getText("S1PERDLOG_SAVE"),
				"SaveBtnIcon": thisCntrlr.bundle.getText("S2PSRSDASAVEICON"),
				"SaveBtnVis": parseInt(Status) !== 95 && VerType !== thisCntrlr.bundle.getText("S2ESAOLDVERKEY") && (parseInt(Status) === 4 ||
					parseInt(Status) === 5 || parseInt(Status) === 35) && !(CcFlag) ? true : false,                                                            //PCR028711++;Condition Updated
				"SaveBtnEnbl": editMode === true ? true : false,
				"SFAppBtnTxt": (parseInt(Status) === 5 || parseInt(Status) === 35) && SAFAction === true ? thisCntrlr.bundle.getText(
					"S2PSRSDASUBFORAPP") : (parseInt(Status) === 95 ? thisCntrlr.bundle.getText("S2PSRSDASFBTNCANNATXT") : (parseInt(Status) === 5 ?
					thisCntrlr.bundle.getText("S2PSRSDASFCANINITXT") : "")),
				"SFAppBtnIcon": (parseInt(Status) === 5 || parseInt(Status) === 35) && SAFAction === true ? thisCntrlr.bundle.getText(
					"S2PSRSDAWFICON") : (parseInt(Status) === 95 || parseInt(Status) === 5 ? thisCntrlr.bundle.getText("S2CANCELBTNICON") : ""),
				"SFAppBtnVis": (parseInt(Status) === 5 || parseInt(Status) === 95 || (parseInt(Status) === 35 && SAFAction === true)) && VerType !==
					thisCntrlr.bundle.getText("S2ESAOLDVERKEY") && !(CcFlag) ? true : false,                                                                   //PCR028711++;Condition Updated
				"SFAppBtnEnbl": parseInt(Status) === 5 || parseInt(Status) === 95 || parseInt(Status) === 35 ? true : false,
				"EsaAddBtnEnbl": SecurityData.AddContact === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") && (editMode === true || RPflag ===
					true) && contactPer === true ? true : false,
				"EsaConDelMod": SecurityData.DelContact === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") && (editMode === true || RPflag ===
					true) && contactPer === true ? thisCntrlr.bundle.getText("S2DELPOSVIZTEXT") : thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"),
				"AttLblTxt": thisCntrlr.bundle.getText("S2GINFOPANLHEADERTXT"),
				"AttTxt": "0",
				"VerNoTxtVis": false,
				"VerNoSelectVis": true,
				"Esa_VerText": parseInt(EsaData.VersionNo),
				"EsaInfoCusTxt": GeneralInfodata.CustName,
				"EsaInfoBUNameTxt": GeneralInfodata.Bu,
				"EsaInfoRgnTxt": GeneralInfodata.ShipToRegion,
				"EsaInfoAppTxt": GeneralInfodata.Application,
				"EsaInfoCurrTxt": GeneralInfodata.Waers,
				"EsaInfoNodeTxt": GeneralInfodata.Node,                                                                                                       //PCR028870++; mapping modified
				"EsaInfoDTypTxt": GeneralInfodata.DeviceType,                                                                                                 //PCR029343++; mapping modified EsaData replaced with GeneralInfodata
				"EsaInfoTAMBATxt": EsaData.Tamba,
				"EsaInfoTAMBATxtVis": editMode === true && parseInt(Status) === 5 ? false : true,
				"EsaInfoTAMBAIPVis": editMode === true && parseInt(Status) === 5 ? true : false,
				"EsaInfoWeferSzeMmTxt": GeneralInfodata.Wafersize,
				"EsaInfoOppNoTxt": GeneralInfodata.OppId,
				"EsaInfoFabNameTxt": GeneralInfodata.FabName,
				"EsaInfoFabLocTxt": GeneralInfodata.FabAdd,
				"EsaInfoComterTxt": GeneralInfodata.Comptitor,
				"EsaInfoOdrAmtTxtVis": editMode === true && parseInt(Status) === 5 ? false : true,
				"EsaInfoOdrAmtTxtRDVis": editMode === true && parseInt(Status) === 5 ? true : false,
				"EsaInfoMstrAgrTxt": EsaData.MasterAgrmnt === "" ? "" : (EsaData.MasterAgrmnt === thisCntrlr.bundle.getText("S2POSMANDATANS") ?
					thisCntrlr.bundle.getText("S2PSRSDAYES") : thisCntrlr.bundle.getText("S2PSRSDANO")),
				"EsaInfoMstrAgrIndex": EsaData.MasterAgrmnt === "" ? 0 : (EsaData.MasterAgrmnt === thisCntrlr.bundle.getText("S2POSMANDATANS") ? 1 :
					2),
				"EsaInfoMstrAgrVS": EsaData.MasterAgrmnt === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EsaInfoMstrAgrTxtVis": editMode === true && parseInt(Status) === 5 ? false : true,
				"EsaInfoMstrAgrTxtRDVis": editMode === true && parseInt(Status) === 5 ? true : false,
				"EsaInfoCTAVPAVS": EsaData.CtaVpaValid === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EsaInfoCTAVPATxt": EsaData.CtaVpaValid === "" ? "" : (EsaData.CtaVpaValid === thisCntrlr.bundle.getText("S2POSMANDATANS") ?
					thisCntrlr.bundle.getText("S2PSRSDAYES") : thisCntrlr.bundle.getText("S2PSRSDANO")),
				"EsaInfoCTAVPAIndex": EsaData.CtaVpaValid === "" ? 0 : (EsaData.CtaVpaValid === thisCntrlr.bundle.getText("S2POSMANDATANS") ? 1 :
					2),
				"EsaInfoCTAVPATxtVis": editMode === true && parseInt(Status) === 5 && EsaData.MasterAgrmnt === thisCntrlr.bundle.getText(
					"S2POSMANDATANS") ? false : true,
				"EsaInfoCTAVPARDVis": editMode === true && parseInt(Status) === 5 && EsaData.MasterAgrmnt === thisCntrlr.bundle.getText(
					"S2POSMANDATANS") ? true : false,
				"EsaInfoCTAVPAVis": EsaData.MasterAgrmnt === thisCntrlr.bundle.getText("S2POSMANDATANS") ? true : false,
				"EsaInfoOdrNoTxt": GeneralInfodata.SoNumber,
				"EsaInfoEqipTypTxt": GeneralInfodata.EquipType,                                                                                               //PCR029343++; mapping modified EsaData replaced with GeneralInfodata
				"EsaInfoBURevAssessQtrTxt": "",
				//"EsaInfoFcstshipDtTxt": GeneralInfodata.FcstBookDate,                                                                                       //PCR028711--
				"EsaInfoFcstshipDtTxt": GeneralInfodata.CurrcustReqDt,                                                                                        //PCR028711++; mapping modified current ship date replaced with forecast ship date
				"EsaInfoShipAddTxt": GeneralInfodata.ShipToAdd,
				"EsaWFConPnlVis": parseInt(Status) !== 95 ? true : false,
				//"EsaWFConPnlExpd": parseInt(Status) === 5 || parseInt(Status) === 10 ? true : false,                                                         //PCR034716--
				"EsaWFConPnlExpd":parseInt(Status) >= 5 ? true : false,																						   //PCR034716++
				"EsaDiscriptPnlVis": parseInt(Status) !== 95 ? true : false,
				//"EsaDiscriptPnlExpd": parseInt(Status) === 5 || parseInt(Status) === 35 ? true : false,                                                      //PCR034716--
				"EsaDiscriptPnlExpd": parseInt(Status) >= 5  ? true : false,													   							   //PCR034716++
				"EsaExmptPnlVis": parseInt(Status) !== 95 ? true : false,
				"EsaExmptPnlExpd": false,
				"EsaAttachPnlVis": parseInt(Status) !== 95 ? true : false,
				"EsaAttachPnlExpd": parseInt(Status) === 5 || (EsaData.NAV_DOC.results[0].FileName !== "") ? true : false,
				"EsaAppvalPnlVis": parseInt(Status) !== 95 ? true : false,
				//"EsaAppvalPnlExpd": parseInt(Status) > 5 && parseInt(Status) !== 35 ? true : false,                                                          //PCR034716--
				"EsaAppvalPnlExpd": parseInt(Status) > 5 ? true : false,                                                                                       //PCR034716++
				"EsaMCommentPnlVis": true,
				"EsaMCommentPnlExpd": parseInt(Status) === 95 || EsaData.NAV_COMMENTS.results.length > 0 ? true : false,
				"EsaEvalcheckListPnlVis": parseInt(Status) !== 95 && parseInt(Status) !== 40 ? true : false,
				"id_Esa_Chng_HistExpd": true,
				"EsaMainComtTxtenabled": VerType !== thisCntrlr.bundle.getText("S2ESAOLDVERKEY") ? true : false,
				"EsaMainComSavBtnenabled": false,
				"PrevAgrementChk": EsaData.NAV_QAINFO.PrevAgrementChk === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? true : false,                      //PCR035760++ Defect#131 TechUpgrade changes
				"PrevAgrementTxt": thisCntrlr.bundle.getText("S2ESAIDSPROAGRTXT"),
				"PrevAgrementChkno": EsaData.NAV_QAINFO.PrevAgrementChkno,
				"PrevAgrementChkEbl": editMode === true && parseInt(Status) === 5 ? true : false,
				"PrevAgrementChknoEbl": editMode === true && parseInt(Status) === 5 ? true : false,
				"ReasonForEvalSelIndex": EsaData.NAV_QAINFO.ReasonForEval !== "" ? parseInt(EsaData.NAV_QAINFO.ReasonForEval) : 0,
				"ReasonForEvalSelVS": EsaData.NAV_QAINFO.ReasonForEval === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT"),
				"ReasonForEvalNote": EsaData.NAV_QAINFO.ReasonForEvalNote,
				"ReasonForEvalNoteVis": parseInt(EsaData.NAV_QAINFO.ReasonForEval) === 3 ? true : false,
				"ReasonForEvalNoteVS": EsaData.NAV_QAINFO.ReasonForEvalNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT"),
				"EqupDescTxt": thisCntrlr.bundle.getText("S2ESAIDSEQUIPAGRTXT"),
				"EqupDescTxtVal": parseInt(Status) === 35 && EsaData.NAV_QAINFO.EqupDescEvalNote === "" ? (EsaData.NAV_QAINFO.EqupDescEvalNote =
					thisCntrlr.bundle.getText("S2CBCNA"), thisCntrlr.bundle.getText("S2CBCNA")) : EsaData.NAV_QAINFO.EqupDescEvalNote,                         //PCR033306++; condition modified
				"EqupDescTxtValVS": EsaData.NAV_QAINFO.EqupDescEvalNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
						.getText("S2DELNAGVIZTEXT"),                                                                                                           //PCR028711++; modify value state
				"EqupOthnSwtrTxt": thisCntrlr.bundle.getText("S2ESAIDSEQUIPSFTOTHCOMMTXT"),
				"EqupLonTypeSelIndex": EsaData.NAV_QAINFO.EquipLoanType !== "" ? (parseInt(EsaData.NAV_QAINFO.EquipLoanType) === 4 ? 5 :
					(parseInt(EsaData.NAV_QAINFO.EquipLoanType) === 5 ? 4 : parseInt(EsaData.NAV_QAINFO.EquipLoanType))) : 0,                                  //PCR034716++; condition modified
				"EqupLonTypeSelVS": EsaData.NAV_QAINFO.EquipLoanType === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EqupOthnSwtrVis": parseInt(EsaData.NAV_QAINFO.EquipLoanType) >= 3 && parseInt(EsaData.NAV_QAINFO.EquipLoanType) !== 5 ? true : false,		   //PCR034716++; condition modified
				"EqupOthnSwtrVS": EsaData.NAV_QAINFO.EquipNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EqupOthnSwtrTxtVal": EsaData.NAV_QAINFO.EquipNote,
				//"EqupSelOneSelIndex": EsaData.NAV_QAINFO.EquipProcessSelect !== "" ? parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) : 0,                    //PCR034716--
				"EqupSelOneSelIndex": EsaData.NAV_QAINFO.EquipProcessSelect !== "" ? parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) === 1 ? 1 
						: parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) === 2 ? 3 : parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) === 3 ?	4 : 2 : 0,	   //PCR034716++; more select options added
				"EqupSelOneSelVS": EsaData.NAV_QAINFO.EquipProcessSelect === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT"),
				//"EqupSelOnePRIPVis": parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) === 2 ? true : false,                                                   //PCR034716--
				"EqupSelOnePRIPVis": parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) === 2 || parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) === 3 ? true :
					false,                                                                                                                                     //PCR034716++
				"EqupSelOnePRVS": EsaData.NAV_QAINFO.EquipSelectNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EqupSelOnePRIPVal": EsaData.NAV_QAINFO.EquipSelectNote,
				"EquipDevArrCkbSel": EsaData.NAV_QAINFO.DevArrngeChk === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? true : false,
				"EvalShipDateLbTxt": thisCntrlr.bundle.getText("S2ESAIDSESTSHPDATTXT"),
				"EvalShipDate": EsaData.NAV_QAINFO.EvalShipDate === "" ? null : (typeof (EsaData.NAV_QAINFO.EvalShipDate) === thisCntrlr.bundle.getText(
					"S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.EvalShipDate.slice(0, 4),
					EsaData.NAV_QAINFO.EvalShipDate.slice(4, 6) - 1, EsaData.NAV_QAINFO.EvalShipDate.slice(6, 8)) : EsaData.NAV_QAINFO.EvalShipDate),
				"EsaPreShipDateTxtVis": EsaData.Extended === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? true : false,
				"EsaPreETSEble": false,
				"EvalPreShipDate": EsaData.NAV_QAINFO.EvalShipDatePre === "" ? null : (typeof (EsaData.NAV_QAINFO.EvalShipDatePre) === thisCntrlr.bundle
					.getText("S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.EvalShipDatePre.slice(0, 4),
						EsaData.NAV_QAINFO.EvalShipDatePre.slice(4, 6) - 1, EsaData.NAV_QAINFO.EvalShipDatePre.slice(6, 8)) : EsaData.NAV_QAINFO.EvalShipDatePre
				),
				"EvalPreStartDate": EsaData.NAV_QAINFO.EvalStartDatePre === "" ? null : (typeof (EsaData.NAV_QAINFO.EvalStartDatePre) ===
					thisCntrlr.bundle.getText("S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.EvalStartDatePre.slice(0, 4),
						EsaData.NAV_QAINFO.EvalStartDatePre.slice(4, 6) - 1, EsaData.NAV_QAINFO.EvalStartDatePre.slice(6, 8)) : EsaData.NAV_QAINFO.EvalStartDatePre
				),
				"EvalPreEndDate": EsaData.NAV_QAINFO.EvalEndDatePre === "" ? null : (typeof (EsaData.NAV_QAINFO.EvalEndDatePre) === thisCntrlr.bundle
					.getText("S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.EvalEndDatePre.slice(0, 4),
						EsaData.NAV_QAINFO.EvalEndDatePre.slice(4, 6) - 1, EsaData.NAV_QAINFO.EvalEndDatePre.slice(6, 8)) : EsaData.NAV_QAINFO.EvalEndDatePre
				),
				"EsaPreASpecSelIndex": EsaData.NAV_QAINFO.AcepSpecAgreePre === "" ? 0 : (EsaData.NAV_QAINFO.AcepSpecAgreePre === thisCntrlr.bundle
					.getText("S2NEGMANDATANS") ? 1 : 2),
				"EsaPreACPosDPVis": EsaData.NAV_QAINFO.AcepSpecAgreePre === thisCntrlr.bundle.getText("S2POSMANDATANS") ? true : false,
				"EsaPreACPosIPVis": EsaData.NAV_QAINFO.AcepSpecAgreePre !== "" ? true : false,
				"PreAcepSpecnoNote": EsaData.NAV_QAINFO.AcepSpecnoNotePre,
				"PreAcepSpecnoNotePlcHoldr": EsaData.NAV_QAINFO.AcepSpecAgreePre === "" ? "" : (EsaData.NAV_QAINFO.AcepSpecAgreePre === thisCntrlr
					.bundle.getText("S2NEGMANDATANS") ? thisCntrlr.bundle.getText("S2ESAIDSDESSPETSNDSPECNOPLCHDRIPTXT") : thisCntrlr.bundle.getText(
						"S2ESAIDSDESSPETSNDSPECYOPLCHDRIPTXT")),
				"PreAcepSpecDate": EsaData.NAV_QAINFO.AcepSpecDatePre === "" ? null : (typeof (EsaData.NAV_QAINFO.AcepSpecDatePre) === thisCntrlr.bundle
					.getText("S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.AcepSpecDatePre.slice(0, 4),
						EsaData.NAV_QAINFO.AcepSpecDatePre.slice(4, 6) - 1, EsaData.NAV_QAINFO.AcepSpecDatePre.slice(6, 8)) : EsaData.NAV_QAINFO.AcepSpecDatePre
				),
				"PreDataSpecProvNote": EsaData.NAV_QAINFO.DataSpecProvNotePre,
				"EsaShipDateTxtVis": ((parseInt(Status) === 5 || parseInt(Status) === 35) && editMode === false) || (parseInt(Status) > 5 &&
					parseInt(Status) !== 35) ? true : false,
				"EsaShipDateDPVis": editMode === true && (parseInt(Status) === 5 || parseInt(Status) === 35) ? true : false,
				"EsaShipDateDPVS": EsaData.NAV_QAINFO.EvalShipDate === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EvalActShipDateLbTxt": thisCntrlr.bundle.getText("S2ESAIDSACTSHPDATTXT"),
				"EsaActShipDate": GeneralInfodata.ActShipDate === "" ? null : (typeof (GeneralInfodata.ActShipDate) === thisCntrlr.bundle.getText(
					"S2ESAIDSSTRCHKTXT") ? new Date(GeneralInfodata.ActShipDate.slice(0, 4),
					GeneralInfodata.ActShipDate.slice(4, 6) - 1, GeneralInfodata.ActShipDate.slice(6, 8)) : GeneralInfodata.ActShipDate),
				"EvalStartDateLbTxt": thisCntrlr.bundle.getText("S2ESAIDSEVALSTRTDATTXT"),
				"EvalStartDate": EsaData.NAV_QAINFO.EvalStartDate === "" ? null : (typeof (EsaData.NAV_QAINFO.EvalStartDate) === thisCntrlr.bundle
					.getText("S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.EvalStartDate.slice(0, 4),
						EsaData.NAV_QAINFO.EvalStartDate.slice(4, 6) - 1, EsaData.NAV_QAINFO.EvalStartDate.slice(6, 8)) : EsaData.NAV_QAINFO.EvalStartDate
				),
				"EsaShipSDateTxtVis": ((parseInt(Status) === 5 || parseInt(Status) === 35) && editMode === false) || (parseInt(Status) > 5 &&
					parseInt(Status) !== 35) ? true : false,
				"EsaShipSDateVS": EsaData.NAV_QAINFO.EvalStartDate === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EsaShipSDateDPVis": editMode === true && (parseInt(Status) === 5 || parseInt(Status) === 35) ? true : false,
				"EvalEndDateLbTxt": thisCntrlr.bundle.getText("S2ESAIDSEVALENDDATTXT"),
				"EvalEndDate": EsaData.NAV_QAINFO.EvalEndDate === "" ? null : (typeof (EsaData.NAV_QAINFO.EvalEndDate) === thisCntrlr.bundle.getText(
					"S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.EvalEndDate.slice(0, 4),
					EsaData.NAV_QAINFO.EvalEndDate.slice(4, 6) - 1, EsaData.NAV_QAINFO.EvalEndDate.slice(6, 8)) : EsaData.NAV_QAINFO.EvalEndDate),
				"EsaShipEDateTxtVis": ((parseInt(Status) === 5 || parseInt(Status) === 35) && editMode === false) || (parseInt(Status) > 5 &&
					parseInt(Status) !== 35) ? true : false,
				"EsaShipEDateDPVS": EsaData.NAV_QAINFO.EvalEndDate === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EsaShipEDateDPVis": editMode === true && (parseInt(Status) === 5 || parseInt(Status) === 35) ? true : false,
				"EsaASpecSelIndex": EsaData.NAV_QAINFO.AcepSpecAgree === "" ? 0 : (EsaData.NAV_QAINFO.AcepSpecAgree === thisCntrlr.bundle.getText(
					"S2NEGMANDATANS") ? 1 : 2),
				"EsaASpecSelVS": EsaData.NAV_QAINFO.AcepSpecAgree === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EsaACPosDPVis": EsaData.NAV_QAINFO.AcepSpecAgree === thisCntrlr.bundle.getText("S2POSMANDATANS") && editMode === true ? true : false,
				"EsaACPosIPVis": EsaData.NAV_QAINFO.AcepSpecAgree !== "" ? true : false,
				"EsaShipNDACAgreeTxtVis": EsaData.NAV_QAINFO.AcepSpecAgree === thisCntrlr.bundle.getText("S2POSMANDATANS") && editMode === false ?
					true : false,
				"AcepSpecnoNote": EsaData.NAV_QAINFO.AcepSpecnoNote,
				"AcepSpecnoNoteVS": EsaData.NAV_QAINFO.AcepSpecnoNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT"),
				"AcepSpecnoNotePlcHoldr": EsaData.NAV_QAINFO.AcepSpecAgree === "" ? "" : (EsaData.NAV_QAINFO.AcepSpecAgree === thisCntrlr.bundle.getText(
						"S2NEGMANDATANS") ?
					thisCntrlr.bundle.getText("S2ESAIDSDESSPETSNDSPECNOPLCHDRIPTXT") : thisCntrlr.bundle.getText(
						"S2ESAIDSDESSPETSNDSPECYOPLCHDRIPTXT")),
				"AcepSpecDate": EsaData.NAV_QAINFO.AcepSpecDate === "" ? null : (typeof (EsaData.NAV_QAINFO.AcepSpecDate) === thisCntrlr.bundle.getText(
					"S2ESAIDSSTRCHKTXT") ? new Date(EsaData.NAV_QAINFO.AcepSpecDate.slice(0, 4),
					EsaData.NAV_QAINFO.AcepSpecDate.slice(4, 6) - 1, EsaData.NAV_QAINFO.AcepSpecDate.slice(6, 8)) : EsaData.NAV_QAINFO.AcepSpecDate),
				"AcepSpecDateVS": EsaData.NAV_QAINFO.AcepSpecDate === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"DataSpecProvNote": EsaData.NAV_QAINFO.DataSpecProvNote,
				"DataSpecProvNoteVS": EsaData.NAV_QAINFO.DataSpecProvNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT"),
				"EsaSucEvalLblTxt": thisCntrlr.bundle.getText("S2ESAIDSSUCSSEVALTXT"),
				"EsaSuccEvalCustIndex": EsaData.NAV_QAINFO.SuccEvalCust === "" ? 0 : parseInt(EsaData.NAV_QAINFO.SuccEvalCust),
				"EsaSuccEvalCustVS": EsaData.NAV_QAINFO.SuccEvalCust === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EsaCustBuyPriceIndex": EsaData.NAV_QAINFO.CustBuyPrice === "" ? 0 : parseInt(EsaData.NAV_QAINFO.CustBuyPrice),
				"EsaCustBuyPriceVS": EsaData.NAV_QAINFO.CustBuyPrice === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EsaSucEvalCustVis": EsaData.NAV_QAINFO.SuccEvalCust === "" ? false : (parseInt(EsaData.NAV_QAINFO.SuccEvalCust) === 2 ? true :
					false),
				"EsaPriceCurrIndex": EsaData.NAV_QAINFO.PriceCurr === "" ? (GeneralInfodata.Waers === "JPY" ? 2 : 1) : (EsaData.NAV_QAINFO.PriceCurr === 
					thisCntrlr.bundle.getText("S2ESAIDSPRUSDRDKYE") ? 1 : (EsaData.NAV_QAINFO.PriceCurr === thisCntrlr.bundle.getText("S2POSMANDATANS") ? 2 : 
					parseInt(EsaData.NAV_QAINFO.PriceCurr))),                                                                                                 //PCR026551++,PCR028870++ parseInt added
				"EvaNetDiffVal": EsaData.NAV_QAINFO.EvaNetDiffVal,                                                                                            //PCR025717++
				"VpsNetPerTarget": EsaData.NAV_QAINFO.VpsNetPerTarget,                                                                                        //PCR025717++
				"TargetSalesPrice": EsaData.NAV_QAINFO.TargetSalesPrice,
				"BottomSalesPrice": EsaData.NAV_QAINFO.BottomSalesPrice,
				"BottomCommNote": EsaData.NAV_QAINFO.BottomCommNote,
				"MarginPerTarget": EsaData.NAV_QAINFO.MarginPerTarget,
				"MarginPerBottom": EsaData.NAV_QAINFO.MarginPerBottom,
				"PriceJustiNote": EsaData.NAV_QAINFO.PriceJustiNote,
				"ExpSlsPriceHvm": EsaData.NAV_QAINFO.ExpSlsPriceHvm,                                                                                          //PCR025717++
				"HvmEvalValIndex": EsaData.NAV_QAINFO.HvmEvalVal === "" ? 0 : (EsaData.NAV_QAINFO.HvmEvalVal === "N" ? 1 : 2) ,                               //PCR025717++
				"PriceJustiNoteVS": EsaData.NAV_QAINFO.PriceJustiNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT"),
				"EsaAble2UpgrdeSelVal": EsaData.NAV_QAINFO.AbilityUpgradeChk === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? true : false,
				"EsaShipSTermIndex": EsaData.NAV_EXCEPINFO.ShipTerms === "" ? 0 : (EsaData.NAV_EXCEPINFO.ShipTerms === thisCntrlr.bundle.getText(
					"S2CBCSALESUCSSANS") ? 1 : 2),
				"EsaShipSTermVS": EsaData.NAV_EXCEPINFO.ShipTerms === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EsaShipSTermFormVis": EsaData.NAV_EXCEPINFO.ShipTerms === thisCntrlr.bundle.getText("S2ESAIDSPROSSEXDEDKYE") ? true : false,
				"EsaShipSTermProTermVal": EsaData.NAV_EXCEPINFO.ShipPropTermNote,
				"EsaShipSTermDesVal": EsaData.NAV_EXCEPINFO.ShipDescNote,
				"EsaShipSTermJustVal": EsaData.NAV_EXCEPINFO.ShipJustiNote,
				"EsaShipSTermJustVS": EsaData.NAV_EXCEPINFO.ShipJustiNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT"),
				"EsaShipSTermCommVal": EsaData.NAV_EXCEPINFO.ShipCommNote,
				"EsaShipSShipIndex": EsaData.NAV_EXCEPINFO.SplitShip === "" ? 0 : (EsaData.NAV_EXCEPINFO.SplitShip === thisCntrlr.bundle.getText(
					"S2CBCSALESUCSSANS") ? 1 : 2),
				"EsaShipSShipVS": EsaData.NAV_EXCEPINFO.SplitShip === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EsaShipSShipFormVis": EsaData.NAV_EXCEPINFO.SplitShip === thisCntrlr.bundle.getText("S2ESAIDSPROSSEXDEDKYE") ? true : false,
				"EsaShipSShipLocVal": EsaData.NAV_EXCEPINFO.ShipLoc,
				"EsaShipSShipLocVS": EsaData.NAV_EXCEPINFO.ShipLoc === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EsaShipSShipJustVal": EsaData.NAV_EXCEPINFO.SplitJustiNote,
				"EsaShipSShipJustVS": EsaData.NAV_EXCEPINFO.SplitJustiNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT"),
				"EsaShipSShipCommVal": EsaData.NAV_EXCEPINFO.SplitCommNote,
				"EsaShipOutShipCostIndex": EsaData.NAV_QAINFO.OutboundShipCost === "" ? 0 : parseInt(EsaData.NAV_QAINFO.OutboundShipCost),
				"EsaShipOutShipCostVS": EsaData.NAV_QAINFO.OutboundShipCost === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT"),
				"EsaEqipRetnIndex": EsaData.NAV_QAINFO.EquipReturnSelect === "" ? 0 : parseInt(EsaData.NAV_QAINFO.EquipReturnSelect),
				"EsaEqipRetnVS": EsaData.NAV_QAINFO.EquipReturnSelect === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT"),
				"EsaEqipRetnIPVal": EsaData.NAV_QAINFO.EquipReturnOtherNote,
				"EsaEqipRetnIPVS": EsaData.NAV_QAINFO.EquipReturnOtherNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT"),
				"EsaEqipRetnOthValVis": EsaData.NAV_QAINFO.EquipReturnSelect.toString() === "4" ? true : false,
				"EsaSupportCKSelVal": EsaData.NAV_QAINFO.SupportChk === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? true : false,
				"EsaSuppSupportRemMonths": parseInt(EsaData.NAV_QAINFO.SupportRemMonths),
				"EsaSuppSupportExeMonths": parseInt(EsaData.NAV_QAINFO.SupportExeMonths),
				"SupportMthEbl": EsaData.NAV_QAINFO.SupportChk === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") && editMode === true &&
					parseInt(Status) === 5 ? true : false,
				"EsaPayTermStdTermIndex": EsaData.NAV_EXCEPINFO.StandardPayTeam === "" ? 0 : parseInt(EsaData.NAV_EXCEPINFO.StandardPayTeam),
				"EsaPayTermStdTermVS": EsaData.NAV_EXCEPINFO.StandardPayTeam === "" && EsaData.NAV_EXCEPINFO.ExcepPayterm === "" ? thisCntrlr.bundle
					.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"),
				//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
				"EsaCbnCpyPnlVis": parseInt(Status) !== 95 ? true : false,
				"EsaCbnCpyPnlExpd": (parseInt(Status) === 5 || parseInt(Status) === 4) || EsaData.NAV_ESA_CC.results.length > 0 ? true : false,
				"EsaCCLbTxt": CcFlag ? thisCntrlr.bundle.getText("S2PSRSDACCFRMTXT") + " " + EsaData.CcOppId + "_" + EsaData.CcOpitmId: "",
				"EsaCCIPEbl": editMode && parseInt(Status) === 5 ? true : false,
				"EsaDLnkVis": ((editMode && (parseInt(Status) === 5 || parseInt(Status) === 4)) || (bomAuth && parseInt(Status) !== 5)) &&
				      EsaData.NAV_ESA_CC.results.length > 0 ? true : false,
				"EsaCbnCpyTblVis": EsaData.NAV_ESA_CC.results.length > 0 ? true : false,
				"EsaStdPayTermCTAIPVis": parseInt(EsaData.NAV_EXCEPINFO.StandardPayTeam) === 2 ? true : false,
				"EsaStdPayTermCTAIPVal": EsaData.NAV_EXCEPINFO.StandardPayteamNote,
				"EsaStdPayTermCTAIPVS": EsaData.NAV_EXCEPINFO.StandardPayteamNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT"),
				//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
				"EsaPayTermExptIndex": EsaData.NAV_EXCEPINFO.ExcepPayterm === "" ? 0 : parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm),
				"EsaPayTermExptVS": EsaData.NAV_EXCEPINFO.StandardPayTeam === "" && EsaData.NAV_EXCEPINFO.ExcepPayterm === "" ? thisCntrlr.bundle.getText(
					"S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText("S2DELNAGVIZTEXT"),
				"EsaPayTermExptOthIPVis": parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) === 3 ? true : false,
				"EsaPayTermExptOthIPVal": EsaData.NAV_EXCEPINFO.ExcepPaytermNote,
				"EsaPayTermExptOthIPVS": EsaData.NAV_EXCEPINFO.ExcepPaytermNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr
					.bundle.getText("S2DELNAGVIZTEXT"),
				"EsaPayTermSelPayTermBtnVis": parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) < 3 && parseInt(Status) === 5 && editMode === true ?
					true : false,
				"EsaPayTermPayTrmCode": EsaData.NAV_EXCEPINFO.PaytermCode,
				"EsaPayTermPayTrmCodeVS": (parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) === 1 || parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) ===
					2) && EsaData.NAV_EXCEPINFO.PaytermCode === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EsaPayTermPaytermDescNote": EsaData.NAV_EXCEPINFO.PaytermDescNote,
				"EsaPayTermPaytermJustiNote": EsaData.NAV_EXCEPINFO.PaytermJustiNote,
				"EsaPayTermPaytermJustiNoteIPVS": (parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) === 1 || parseInt(EsaData.NAV_EXCEPINFO.ExcepPayterm) ===
					2) && EsaData.NAV_EXCEPINFO.PaytermJustiNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"EsaPayTermPaytermCommNote": EsaData.NAV_EXCEPINFO.PaytermCommNote,
				"EsaChinaCondEvalIndex": EsaData.NAV_EXCEPINFO.ChinaCondEval === "" ? 0 : (EsaData.NAV_EXCEPINFO.ChinaCondEval === thisCntrlr.bundle
					.getText("S2POSMANDATANS") ? 1 : 2),
				"EsaChinaCondEvalVS": EsaData.NAV_EXCEPINFO.ChinaCondEval === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT"),
				"EsaCustRiskIndex": EsaData.NAV_EXCEPINFO.CustRisk === "" ? 0 : (EsaData.NAV_EXCEPINFO.CustRisk === thisCntrlr.bundle.getText(
					"S2POSMANDATANS") ? 1 : 2),
				"EsaCustRiskVS": EsaData.NAV_EXCEPINFO.CustRisk === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle.getText(
					"S2DELNAGVIZTEXT"),
				"ReqName": EsaData.ReqName,
				"AprBtnVis": parseInt(Status) > 5 && parseInt(Status) < 20 && VerType !== thisCntrlr.bundle.getText("S2ESAOLDVERKEY") ? true : false,
				"AprBtnEbl": parseInt(Status) > 5 && parseInt(Status) < 20 && editMode === true && VerType !== thisCntrlr.bundle.getText(
					"S2ESAOLDVERKEY") ? true : false,
				"CancelBtnVis": parseInt(Status) > 5 && parseInt(Status) < 20 && VerType !== thisCntrlr.bundle.getText("S2ESAOLDVERKEY") &&
					bomAuth === true ? true : false,
				"RecreatBtnVis": parseInt(Status) >= 20 && parseInt(Status) !== 35 && parseInt(Status) !== 95 && VerType !== thisCntrlr.bundle.getText(
					"S2ESAOLDVERKEY") && bomAuth === true  && !(CcFlag) ? true : false,                                                                            //PCR028711++; modify visibility
				"EsaRDEbl": parseInt(Status) === 5 && editMode === true ? true : false,
				"EsaPreEvalTNDEbl": (parseInt(Status) === 5 || parseInt(Status) === 35) && editMode === true ? true : false,
				"EsaChkLstComtTxtenabled" : romAuth || slsAuth ? true : false,																					   //PCR034716++
				"EsaChkLstComSavBtnenabled": false,																												   //PCR034716++
				"EsaQ2QFlag2021": EsaData.InitFy21Q2 === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? true : false,								   		   //PCR034716++
				"EquipSel1RdUrsVis": EsaData.InitFy21Q2 === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? true : false,								   	   //PCR034716++
				"EquipSmartEvalCkbSel": EsaData.NAV_QAINFO.EquipUnrelChk === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? true : false,					   //PCR034716++
				"EquipSmartEvalCkbVis": parseInt(EsaData.NAV_QAINFO.EquipProcessSelect) === 4 ? true : false,												   	   //PCR034716++
				"EsaSEval23RDDesVal": EsaData.NAV_QAINFO.SuccEvalCommNote,																					       //PCR034716++
				"EsaSEval23RDDesVis": EsaData.NAV_QAINFO.CustBuyPrice === "" ? false : parseInt(EsaData.NAV_QAINFO.CustBuyPrice) === 3 ? true : false,			   //PCR034716++
				"EsaSEval23RDDesValVS": EsaData.NAV_QAINFO.SuccEvalCommNote === "" ? thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") : thisCntrlr.bundle
					.getText("S2DELNAGVIZTEXT")																											           //PCR034716++
			};
			var FooterBtn = thisCntrlr.that_views2.getContent()[0].getFooter().getContent();
			if (editMode === false) {
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL1).removeStyleClass("sapMSuppLblYclass");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL2).removeStyleClass("sapMSuppLblYclass");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).removeStyleClass("sapMPaytrmCodeEWidth");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL1).addStyleClass("sapMSuppLblNclass");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL2).addStyleClass("sapMSuppLblNclass");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).addStyleClass("sapMPaytrmCodeDWidth");
			} else if (editMode === true && parseInt(Status) === 5) {
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL1).removeStyleClass("sapMSuppLblNclass");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL2).removeStyleClass("sapMSuppLblNclass");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL1).addStyleClass("sapMSuppLblYclass");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL2).addStyleClass("sapMSuppLblYclass");
				if(EsaModel.EsaPayTermStdTermVS === thisCntrlr.bundle.getText("S2ERRORVALSATETEXT") && EsaModel.EsaPayTermExptVS === 
					thisCntrlr.bundle.getText("S2ERRORVALSATETEXT")){
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).removeStyleClass("sapMPaytrmCodeEWidth");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).addStyleClass("sapMPaytrmCodeDWidth");
				} else {
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).removeStyleClass("sapMPaytrmCodeDWidth");
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAPAYTRMPTCDEIP).addStyleClass("sapMPaytrmCodeEWidth");
				}
			}
			//***************************Start Of PCR034716++ Q2C ESA,PSR Enhancements********************
			if(EsaData.InitFy21Q2 === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL")){
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL1).hasStyleClass("sapMEsaSupLbl") ? 
					"" : thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL1).addStyleClass("sapMEsaSupLbl");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL2).hasStyleClass("sapMEsaLbl") ?
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL2).removeStyleClass("sapMEsaLbl") : "";
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL2).hasStyleClass("sapMEsaSupLbl2") ?
					"" : thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL2).addStyleClass("sapMEsaSupLbl2");
			}
			else{
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL1).hasStyleClass("sapMEsaSupLbl") ?
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL1).removeStyleClass("sapMEsaSupLbl") : "";
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL2).hasStyleClass("sapMEsaLbl") ?
					"" : thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL2).addStyleClass("sapMEsaLbl");
				thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL2).hasStyleClass("sapMEsaSupLbl2") ?
					thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDESUPRTLBL2).removeStyleClass("sapMEsaSupLbl2") : "";
			}
			//***************************End Of PCR034716++ Q2C ESA,PSR Enhancements**********************
			FooterBtn[2].setVisible(EsaModel.AprBtnVis);
			FooterBtn[3].setVisible(EsaModel.AprBtnVis);
			FooterBtn[7].setVisible(EsaModel.CancelBtnVis);
			FooterBtn[2].setEnabled(EsaModel.AprBtnEbl);
			FooterBtn[3].setEnabled(EsaModel.AprBtnEbl);
			FooterBtn[7].setEnabled(EsaModel.CancelBtnVis);
			FooterBtn[8].setVisible(EsaModel.RecreatBtnVis);
			FooterBtn[8].setEnabled(EsaModel.RecreatBtnVis);
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDEVERCOMBX).setVisible(EsaModel.VerNoSelectVis);
			EsaModel.EsaVerCollection = [{
				"ProductId": thisCntrlr.bundle.getText("S2BSDASSMENTLVLOP"),
				"Name": thisCntrlr.bundle.getText("S2ESAVERBYDEFKEY")
			}];
			var CurrVer = 0;
			for (var i = 0; i < EsaData.NAV_VER_INFO.results.length; i++) {
				var obj = {};
				obj.ProductId = parseInt(EsaData.NAV_VER_INFO.results[i].VersionNo);
				obj.Name = parseInt(EsaData.NAV_VER_INFO.results[i].VersionNo);
				EsaModel.EsaVerCollection.push(obj);
				CurrVer = parseInt(EsaData.NAV_VER_INFO.results[i].VersionNo);
			}
			EsaModel.SelectedVerNo = VerType !== thisCntrlr.bundle.getText("S2ESAOLDVERKEY") ? CurrVer : PSRModel;
			EsaModel.NAV_ROM = EsaData.NAV_ROM;
			EsaModel.NAV_POM = EsaData.NAV_POM;
			EsaModel.NAV_BMO = EsaData.NAV_BMO;
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
				doc.Enableflag = editMode === true && bomAuth === true ? true : false;
				doc.addupVisible = SecurityData.UpldEsaDoc === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? true : false;
				doc.Enabledelflag = SecurityData.DelEsaDoc === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") && editMode === true && bomAuth ===
					true ? true : false;
				doc.EnableDisflag = SecurityData.ViewEsaDoc === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? true : false;
				doc.uBvisible = EsaData.NAV_DOC.results[i].FileName === "" ? true : false;
				doc.bgVisible = !doc.uBvisible;
				doc.editable = EsaData.NAV_DOC.results[i].FileName === "" && editMode === true ? true : false;
				FinalDoc.push(doc);
			}
			var oRPSRDocJModel = new sap.ui.model.json.JSONModel({
				"ItemSet": FinalDoc
			});
			thisCntrlr.getView().byId(com.amat.crm.opportunity.Ids.S2ESAIDEATTCHMNTTABLE).setModel(oRPSRDocJModel);
			EsaModel.NAV_ESA_CC = EsaData.NAV_ESA_CC;                                                                                                              //PCR028711++
			EsaModel.oEsaAprvHis = EsaData.NAV_ESAAPRV_HIST;
			EsaModel.oEsaChngHis = EsaData.NAV_ESACHNG_HIST;
			EsaModel.oEsaManComm = EsaData.NAV_COMMENTS;
			return EsaModel;
		},
		/**
		 * This method used to return payload for initiate/CancelInitiation/NA.
		 * 
		 * @name esaInitpayload
		 * @param Guid - Opp Guid, ItemGuid - Opp ItemGuid, ActionType - type of action, CurrVersion - ESA current Version, ProductLine - Opp ProductLine
		 * @returns payload - Payload for Service call
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
		 * This method used to return payload for Save/Submit actions.
		 * 
		 * @name esaSavSubPayload
		 * @param thisCntrlr - ESA Controller, EsaData - ESA Data, ActionType - type of action
		 * @returns payload - Payload for Service call
		 */
		esaSavSubPayload: function (thisCntrlr, EsaData, ActionType) {
			var payload = {};
			payload.NAV_QAINFO = {};
			payload.NAV_EXCEPINFO = {};
			payload.NAV_ESA_CC = [];                                                                                                                                 //PCR028711++;
			payload.Guid = EsaData.Guid;
			payload.ItemGuid = EsaData.ItemGuid;
			payload.VersionNo = EsaData.VersionNo.toString();
			payload.ActionType = ActionType;
			payload.Status = EsaData.Status.toString();
			payload.MasterAgrmnt = EsaData.MasterAgrmnt === "" ? "" : (EsaData.MasterAgrmnt.toString() === "1" || EsaData.MasterAgrmnt.toString() ===
				thisCntrlr.bundle.getText("S2POSMANDATANS") ? thisCntrlr.bundle.getText("S2POSMANDATANS") : thisCntrlr.bundle.getText(
					"S2NEGMANDATANS"));
			payload.Tamba = EsaData.Tamba;
			payload.CtaVpaValid = EsaData.CtaVpaValid === "" ? "" : (EsaData.CtaVpaValid.toString() === "1" || EsaData.CtaVpaValid.toString() ===
				thisCntrlr.bundle.getText("S2POSMANDATANS") ? thisCntrlr.bundle.getText("S2POSMANDATANS") : thisCntrlr.bundle.getText(
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
			//payload.NAV_QAINFO.EquipNote = parseInt(EsaData.NAV_QAINFO.EquipLoanType) > 2 ? EsaData.NAV_QAINFO.EquipNote : "";                               //PCR034716--
			payload.NAV_QAINFO.EquipNote = parseInt(EsaData.NAV_QAINFO.EquipLoanType) > 2 && parseInt(EsaData.NAV_QAINFO.EquipLoanType) !== 5 ?
				EsaData.NAV_QAINFO.EquipNote : "";                                                                                                             //PCR034716++
			payload.NAV_QAINFO.EquipProcessSelect = EsaData.NAV_QAINFO.EquipProcessSelect.toString();
			//payload.NAV_QAINFO.EquipSelectNote = EsaData.NAV_QAINFO.EquipProcessSelect.toString() === "2" ? EsaData.NAV_QAINFO.EquipSelectNote :
			//	"";                                                                                                                                            //PCR034716--
			payload.NAV_QAINFO.EquipSelectNote = EsaData.NAV_QAINFO.EquipProcessSelect.toString() === "2" || EsaData.NAV_QAINFO.EquipProcessSelect.toString()
			    === "3" ? EsaData.NAV_QAINFO.EquipSelectNote : "";                                                                                             //PCR034716++
			payload.NAV_QAINFO.DevArrngeChk = EsaData.NAV_QAINFO.DevArrngeChk;
			payload.NAV_QAINFO.EvalShipDate = this.EsaDateconvert(thisCntrlr, EsaData.NAV_QAINFO.EvalShipDate);
			payload.NAV_QAINFO.EvalStartDate = this.EsaDateconvert(thisCntrlr, EsaData.NAV_QAINFO.EvalStartDate);
			payload.NAV_QAINFO.EvalEndDate = this.EsaDateconvert(thisCntrlr, EsaData.NAV_QAINFO.EvalEndDate);
			payload.NAV_QAINFO.AcepSpecAgree = EsaData.NAV_QAINFO.AcepSpecAgree.toString() === "0" ? "" : EsaData.NAV_QAINFO.AcepSpecAgree;
			payload.NAV_QAINFO.AcepSpecnoNote = EsaData.NAV_QAINFO.AcepSpecAgree !== "" ? EsaData.NAV_QAINFO.AcepSpecnoNote : "";
			payload.NAV_QAINFO.AcepSpecDate = EsaData.NAV_QAINFO.AcepSpecAgree.toString() === thisCntrlr.bundle.getText("S2POSMANDATANS") ? this
				.EsaDateconvert(thisCntrlr, EsaData.NAV_QAINFO.AcepSpecDate) : "";
			payload.NAV_QAINFO.DataSpecProvNote = EsaData.NAV_QAINFO.DataSpecProvNote;
			payload.NAV_QAINFO.SuccEvalCust = EsaData.NAV_QAINFO.SuccEvalCust.toString();
			payload.NAV_QAINFO.CustBuyPrice = EsaData.NAV_QAINFO.CustBuyPrice.toString();
			payload.NAV_QAINFO.PriceCurr = EsaData.NAV_QAINFO.PriceCurr === "" ?  thisCntrlr.getView().getModel().getProperty("/EsaPriceCurrIndex").toString() :
				EsaData.NAV_QAINFO.PriceCurr.toString();                                                                                                     //PCR028711++; modify currency value
			payload.NAV_QAINFO.EvaNetDiffVal = EsaData.NAV_QAINFO.EvaNetDiffVal;                                                                             //PCR025717++
			payload.NAV_QAINFO.VpsNetPerTarget = EsaData.NAV_QAINFO.VpsNetPerTarget;                                                                         //PCR025717++
			payload.NAV_QAINFO.ExpSlsPriceHvm = EsaData.NAV_QAINFO.ExpSlsPriceHvm;                                                                           //PCR025717++
			payload.NAV_QAINFO.HvmEvalVal = EsaData.NAV_QAINFO.HvmEvalVal === 0 || EsaData.NAV_QAINFO.HvmEvalVal === "" ? "" : EsaData.NAV_QAINFO.HvmEvalVal;//PCR025717++
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
			payload.NAV_QAINFO.SupportRemMonths = EsaData.NAV_QAINFO.SupportChk === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? EsaData.NAV_QAINFO
				.SupportRemMonths : "";
			payload.NAV_QAINFO.SupportExeMonths = EsaData.NAV_QAINFO.SupportChk === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") ? EsaData.NAV_QAINFO
				.SupportExeMonths : "";
			payload.NAV_EXCEPINFO.Guid = EsaData.Guid;
			payload.NAV_EXCEPINFO.ItemGuid = EsaData.ItemGuid;
			payload.NAV_EXCEPINFO.VersionNo = EsaData.VersionNo;
			payload.NAV_EXCEPINFO.ShipTerms = EsaData.NAV_EXCEPINFO.ShipTerms.toString();
			payload.NAV_EXCEPINFO.ShipPropTermNote = EsaData.NAV_EXCEPINFO.ShipTerms.toString() === thisCntrlr.bundle.getText(
				"S2ESAIDSPROSSEXDEDKYE") ? EsaData.NAV_EXCEPINFO.ShipPropTermNote : "";
			payload.NAV_EXCEPINFO.ShipDescNote = EsaData.NAV_EXCEPINFO.ShipTerms.toString() === thisCntrlr.bundle.getText(
				"S2ESAIDSPROSSEXDEDKYE") ? EsaData.NAV_EXCEPINFO.ShipDescNote : "";
			payload.NAV_EXCEPINFO.ShipJustiNote = EsaData.NAV_EXCEPINFO.ShipTerms.toString() === thisCntrlr.bundle.getText(
				"S2ESAIDSPROSSEXDEDKYE") ? EsaData.NAV_EXCEPINFO.ShipJustiNote : "";
			payload.NAV_EXCEPINFO.ShipCommNote = EsaData.NAV_EXCEPINFO.ShipTerms.toString() === thisCntrlr.bundle.getText(
				"S2ESAIDSPROSSEXDEDKYE") ? EsaData.NAV_EXCEPINFO.ShipCommNote : "";
			payload.NAV_EXCEPINFO.SplitShip = EsaData.NAV_EXCEPINFO.SplitShip.toString();
			payload.NAV_EXCEPINFO.ShipLoc = EsaData.NAV_EXCEPINFO.SplitShip.toString() === thisCntrlr.bundle.getText("S2ESAIDSPROSSEXDEDKYE") ?
				EsaData.NAV_EXCEPINFO.ShipLoc : "";
			payload.NAV_EXCEPINFO.SplitJustiNote = EsaData.NAV_EXCEPINFO.SplitShip.toString() === thisCntrlr.bundle.getText(
				"S2ESAIDSPROSSEXDEDKYE") ? EsaData.NAV_EXCEPINFO.SplitJustiNote : "";
			payload.NAV_EXCEPINFO.SplitCommNote = EsaData.NAV_EXCEPINFO.SplitShip.toString() === thisCntrlr.bundle.getText(
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
			//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
			payload.NAV_EXCEPINFO.StandardPayteamNote = payload.NAV_EXCEPINFO.StandardPayTeam === "2" ? thisCntrlr.getModel().getProperty("/EsaStdPayTermCTAIPVal") :
				EsaData.NAV_EXCEPINFO.StandardPayteamNote;
			payload.CcOppId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().OppId;
			payload.CcOpitmId = thisCntrlr.getModelFromCore(thisCntrlr.bundle.getText("GLBOPPPSRINFOMODEL")).getData().ItemNo.toString();
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
			//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
			payload.NAV_QAINFO.SuccEvalCommNote = EsaData.NAV_QAINFO.CustBuyPrice.toString() === "3" ? EsaData.NAV_QAINFO.SuccEvalCommNote : "";			   //PCR034716++
			payload.NAV_QAINFO.EquipUnrelChk = EsaData.NAV_QAINFO.EquipUnrelChk;																			   //PCR034716++
			return payload;
		},
		/**
		 * This method used to Convert Date Object to String.
		 * 
		 * @name EsaDateconvert
		 * @param thisCntrlr - ESA Controller, selDate - Date Object
		 * @returns selDate - Date String
		 */
		EsaDateconvert: function (thisCntrlr, selDate) {
			return selDate !== null ? (typeof (selDate) !== thisCntrlr.bundle.getText("S2ESAIDSSTRCHKTXT") ? (selDate.getFullYear().toString() +
				(selDate.getMonth() + 1 < 10 ? "0" + (selDate.getMonth() + 1).toString() :
					(selDate.getMonth() + 1).toString()) + (selDate.getDate() < 10 ? "0" + selDate.getDate().toString() : selDate.getDate().toString())
			) : selDate) : "";
		},
		/**
		 * This method used to return ESA Check List Payload.
		 * 
		 * @name esaChkListPayload
		 * @param thisCntrlr - ESA Controller, ChkListData - Check List Data, chkListFlag - type Of Action
		 * @returns Payload - Payload For Service Call.
		 */
		//esaChkListPayload: function (thisCntrlr, ChkListData,) {                                                                                             //PCR028711--
		esaChkListPayload: function (thisCntrlr, ChkListData, chkListFlag) {                                                                                   //PCR028711++;chkListFlag Parameter Added
			var Payload = {};
			Payload.NAV_CHECKLIST = [];
			Payload.Guid = ChkListData[0].Guid;
			Payload.ItemGuid = ChkListData[0].ItemGuid;
			Payload.VersionNo = ChkListData[0].VersionNo;
			Payload.Submit = chkListFlag == thisCntrlr.bundle.getText("S2PSRSDACBCSFASUBTYPEMSG") ?
					thisCntrlr.bundle.getText("S1TABLESALESTAGECOL"): thisCntrlr.bundle.getText("S2PSRDCNASHPODKEY");                                         //PCR028711++
			for (var i = 0; i <= ChkListData.length - 1; i++) {
				var obj = {};
				obj.Guid = ChkListData[i].Guid;
				obj.ItemGuid = ChkListData[i].ItemGuid;
				obj.VersionNo = ChkListData[i].VersionNo;
				obj.Qid = ChkListData[i].Qid;
				obj.Qdesc = "";
				obj.Comments = ChkListData[i].Comments;
				//obj.AnsCheck = ChkListData[i].AnsCheck === true ? thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") : "";                                    //PCR028711--
				obj.AnsCheck = ((ChkListData[i].AnsCheck === true)||(ChkListData[i].AnsCheck === thisCntrlr.bundle.getText("S1TABLESALESTAGECOL"))) ? 
						thisCntrlr.bundle.getText("S1TABLESALESTAGECOL") : "";                                                                                //PCR028711++; modify Condition	
				obj.QaVerNo = ChkListData[i].QaVerNo;
				Payload.NAV_CHECKLIST.push(obj);
			}
			return Payload;
		}
	};
	return model;
}, true);