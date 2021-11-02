/**
 * This file consists of all service configuration data used in My Opportunity application.
 *
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends
 * @name com.amat.crm.opportunity.util.ServiceConfigConstants                     *
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
 * 26/09/2019      Abhishek        PCR025717         Q2C Q4 2019 Enhancements     *
 *                 Pant                                                           *
 * 18/05/2020      Arun            PCR028711         Q2C Enhancements for Q2-20   *
 *                 Jacob                                                          *
 * 25/11/2019      Abhishek        PCR026243         DL:1803 Display Migration to *
 *                 Pant                              Q2C                          *
 * 25/01/2021      Abhishek Pant   PCR033306         Q2C Display Enhancements     *
 * 06/04/2021      Arun Jacob      PCR034716         Q2C ESA,PSR Enhancements     *
 ***********************************************************************************
 */
/**
 *@file:
 */

jQuery.sap.declare("com.amat.crm.opportunity.util.ServiceConfigConstants");

com.amat.crm.opportunity.util.ServiceConfigConstants = {

		getMyOpportunityInfoURL : "/sap/opu/odata/sap/ZGWVG_CRM_Q2C_SRV",
		OpportunityDataSet : "OpportunitySet",
		OpportunityDataAllSet : "OpportunitySet?$filter=Low eq 'A'",                                                                             //PCR022669++
		OpportunityDataPerSet : "OpportunitySet?$filter=Low eq 'P'",                                                                             //PCR022669++
		PersonalizeDataSet : "PersonalizeSet",
		SecurityDataSet: "Security_AccSet(KeyVal=' ')",
		PerlzeFilterHdSet : "Filter_headSet",
		PsrSdaDataSet:  "PSRSDA_InfoSet",
		PdcSdaDataSet:  "PDCSDA_InfoSet",
		CustDocDataSet: "/CustDoclinkSet",
		CBCInfoSet: "CBC_InfoSet",
		CustDoclinkSet: "CustDoclinkSet",
		CARMInfoSet: "/CARM_InfoSet",
		CommentsSet : "/CommentsSet",
		QuotelistSet : "/QuotelistSet",
		AprvHistrySet : "AprvHistrySet",
		RevQuoteSet : "/RevQuoteSet",
		ResetSet : "ResetSet",
		AttachmentSet : "/AttachmentSet",
		ResetChildListSet : "ResetChildListSet",
		read : "read",
		post : "POST",
		write : "write",
		remove : "remove",
		ESAInfoSet : "ESA_InfoSet",                                                                                                             //PCR023905++
		ESAChecklist : "ESAChecklist_HeaderSet",                                                                                                //PCR023905++
		ESAPayTrmConSet : "ESAPayTermsSet",                                                                                                     //PCR023905++
		CCopyDLinkSet : "CC_RemoveSet",                                                                                                         //PCR025717++
		//*************************Start Of PCR028711 Q2C Enhancements for Q2-20********************
		OpportunityFilterSet : "/OppSearchSet?$filter=",
		CUSTSET : "CustF4Set",
		BUSet : "BUSet",
		LODERSET : "LowSet",
		BQUTRSET : "QuarterSet"	,
		custNameEq : "Custname eq'",
		oppIdEq : "' and OppId eq'",
		slotNoEq : "' and SlotNo eq'",
		amatQuoteIdEq : "' and AmatQuoteId eq'",
		poNumberEq : "' and PoNumber eq'",
		soNumberEq : "' and SoNumber eq'",
		lowEqEq : "' and Low eq'",
		buEq : "' and Bu eq'",
		bookQutValEq : "' and BookQutVal eq'",
		EsaPrintSet : "/ESA_PrintSet(ItemGuid=guid'",
		EsaPrintTypeVer : "',ProcessType='ESA',VersionNo='",
		EsaPrintValue : "')/$value",
		CustDocLinkSet : "CustDoclinkSet?$filter=ItemGuid eq guid'",
		CustDocEsa : "and OppId eq 'ESA'",
		CheckListSet : "ESAChecklist_HeaderSet(Guid=guid'",
		CheckListGuid : "',ItemGuid=guid'",
		CheckListVer : "',VersionNo='",
		CheckListExp : "')?$expand=NAV_CHECKLIST,NAV_CHCKCOMMNTS",                                                                              //PCR034716++; NAV_CHCKCOMMNTS added
		PreshipSet : "PreShip_InfoSet",
		PreshipSetGuid : "PreShip_InfoSet(Guid=guid'",
		PreshipSetItem : "',ItemGuid=guid'",
		PreshipSetExp : "')?$expand=NAV_PRESHP_CHNG_HIST,NAV_PRESHP_CC,NAV_PRESHP_QAHEAD/NAV_CBC_QAINFO,NAV_PRESHP_COMM",
		CommentSetPspFilterGuid : "CommentsSet?$filter=ItemGuid eq guid'",
		CommentSetPspFilterType : "'and CommType eq '",
		ResetPspChildSetOppId : "ResetChildListSet?$filter=OppId eq '",
		ResetPspChildItemNo : "' and ItemNo eq '",
		ResetPspChildType : "' and Ptype eq '" + "SHP'",
		CustDocLinkPspSetGuid : "CustDoclinkSet?$filter=ItemGuid eq guid'",
		CustDocLinkPspSetItem : "and OppId eq 'SHP'",
		//*************************End Of PCR028711 Q2C Enhancements for Q2-20**********************
		DftQutValEq :"' and DftNo eq'",                                                                                                         //PCR033306++
		DisBuSet:"Display_BUSet",                                                                                                               //PCR026243++
		DisRRAInfoSet:"RRA_InfoSet",                                                                                                            //PCR026243++
		get:"GET",                                                                                                                              //PCR026243++
		getDisplayURL:"/sap/opu/odata/SAP/ZCVG_CRM_Q2C_DIGFP_SRV",                                                                              //PCR026243++
		EsaChkListPrintSet : "/ESAChecklist_PrintSet(ItemGuid=guid'"																			//PCR034716++
};
