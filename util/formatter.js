/**
 * This class hold methods of formatter.
 * 
 * @class
 * @public
 * @author Abhishek Pant
 * @since 27 July 2017
 * @extends
 * @name com.amat.crm.opportunity.util.formatter                                  *
 *  * ----------------------------------------------------------------------------*
 * Modifications.                                                                 *
 * -------------                                                                  *
 * Ver.No    Date        Author    PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * V00    20/02/2018    Abhishek   PCR017480         Initial version              *
 *                      Pant       
 *                      (X089025)                                                 * 
 *  Date           Author          PCR No.           Description of change        *
 * ------ ---------- ------------ ----------  ------------------------------------*
 * 18/12/2018      Abhishek        PCR021481         Q2C Q1/Q2 enhancements       *
 *                 Pant                                                           *
 * 25/02/2019      Abhishek        PCR022669         Q2C Q2 UI Changes            *
 *                 Pant                                                           *
 * 26/09/2019      Abhishek        PCR025717         Q2C Q4 2019 Enhancements     *
 *                 Pant                                                           *
 * 13/06/2021      Abhishek Pant   PCR035760         Tech Upgrade issues solution *
 ***********************************************************************************
 */
sap.ui.define(function(){
	"use strict";
	var formatter = {
			//************Start Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements **************
			/**
		     * This method is to set format for CBC Questionnaires heading class assignment 
		     * @name QusHderCssType
		     * @param aValue - Questionnaires description
		     * @returns formatted aValue
		     */
			QusHderCssType : function(aValue){
				if(aValue !== null && aValue !== undefined){
				  if(aValue.substring(0,5).indexOf(":") >= 0)
				  {
					  this.removeStyleClass('classQuesItems');
					  this.addStyleClass('classQuesTitle');				   
				  } else {
					  this.removeStyleClass('classQuesTitle');
					  this.addStyleClass('classQuesItems');
				  }
				}
				 return aValue;		
			},
			//************End Of PCR021481++: 4190 : Q2C Q1/Q2 enhancements **************
			/**
		     * This method is to set format for Date to display
		     * @name Date
		     * @param date - Holds the date value
		     * @returns formatted dateObject
		     */
			Date:function(date)
			{
				if(date!==null)
				{
					var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
					                  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];		  
					var date = new Date(date);                                                                         //PCR025717++; semicolon included
					date.setDate(date.getDate());                                                                      //PCR025717++; semicolon included
					date = date.getDate()+"-"+monthNames[date.getMonth()]+"-"+date.getFullYear();
					return date;
				}
				else{return "";}				                 
			},
			
			/**
		     * This method is to set format for Date with timestamp to display
		     * @name DateWdTimeStamp
		     * @param date - Holds the date value
		     * @returns formatted dateObject
		     */
			DateWdTimeStamp:function(date)
			{
				if(date!== "" && date !== undefined && date !== null){                                                                                   //PCR035760++; Condition Modified
					var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
				                  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
					var temp=date.substring(4,14).match(/.{1,2}/g);
					temp.push(date.substring(0,4));
					var tempDate=temp[5]+"-"+temp[0]+"-"+temp[1]+"T"+temp[2]+":"+temp[3]+":"+temp[4];
				    date = new Date(tempDate);
				    date.setDate(date.getDate());
				    date = temp[1]+"-"+monthNames[date.getMonth()]+"-"+date.getFullYear()+"  "+temp[2]+":"+temp[3]+":"+temp[4];
				    return date;
				    }
			},
			/**
		     * This method is to set format net value in thousand separator without decimal points ;
		     * @name amountWDCommaSeprator
		     * @param amount - Holds the net value
		     * @returns values in thousand separator
		     */
			DateWdMonth:function(date)
			{
				if(date!==null && date!=="" && date!== undefined){                                                                                         //PCR022669++; added undefined condition                                      
					var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
				                  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
					var match = date.match(/(\d{4})(\d{2})(\d{2})/);
					var Date = "";
					(parseInt(date) !== 0)?(Date = match[3] + '-'+ monthNames[parseInt(match[2])-1] + '-' + match[1]):(Date = "");
				    return Date;
				}else{
					return "";
				}
			},
			/**
		     * This method is to set format net value in thousand separator without decimal points ;
		     * @name amountWDCommaSeprator
		     * @param amount - Holds the net value
		     * @returns values in thousand separator
		     */
			amountWDCommaSeprator:function(amount)
			{
				return parseInt(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			},
			
			/**
		     * This method is to set format for status;
		     * @name state
		     * @param sStatus - Holds the value of Status field
		     * @returns objectState based on status values
		     */
			state:function(sStatus)
			{
				switch(sStatus)
				{
				case "Approved":
					return "Success";
				case "Pending":
					return "Warning";
				case "Rejected":
					return "Error";
				}
			}
	};
	return formatter;
}, true); 