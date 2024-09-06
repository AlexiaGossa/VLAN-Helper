/*
 * 	VLAN-Helper project
 *	Copyright (c) 2024 Alexia Gossa <contact@nemelit.com>
 *
 * 	This file is released under GPL-3.0 license
 *
 *
 * 	Alexia Gossa
 * 	nemelit.com
 * 	FRANCE
 */

window.onload = init;


function init ( )
{
	var sPort1 = $(".port1").html();
	$(".port2").html(sPort1);
	$(".port2 .title").text("Port 2");
}

function getIntValue ( sText )
{
	var iValue, sValue;
	
	iValue = parseInt(sText);
	sValue = iValue.toString();
	
	if (sValue==sText)
		return iValue;
	else
		return null;
}

function selectPort ( obj )
{
	var sPort = $(obj).parents(".ports").attr("id");
	var sValue = $("."+sPort+" .port_mode").val();
	
	$("."+sPort+" .port_type").css("display","none");
	$("."+sPort+" ."+sValue).css("display","");
	
	//$(".port_type")
	//console.log ( sValue );
	//console.log ( sDataValue );
	//console.log ( "select = " + obj );
	// $(".port1 .port_mode").val() => value
	
	//$(".test_ids_list").removeClass("blockdisabled");
	//$(".test_ids_list").addClass("blockdisabled");
	
	ids_checkalldone();
}


function ids_clear()
{
	$("#id_list").val("");
}

function switchFieldsToInitialize ( )
{
	var sPortMode1 = $(".port1 .port_mode").val();
	var sPortMode2 = $(".port2 .port_mode").val();
	
	var objData1 = getAndCheckDataFromPort ( "port1", sPortMode1 );
	var objData2 = getAndCheckDataFromPort ( "port2", sPortMode2 );
	
	switch_Initialize ( );
	
	switch (objData1.mode)
	{
		case "access":
			switch_AccessPort ( 1, parseInt(objData1.native) );
			break;
		case "trunk":
			switch_TrunkPort ( 1, parseInt(objData1.native), objData1.allowed );
			break;
		case "uplink":
			switch_UplinkPort ( 1, parseInt(objData1.native), objData1.allowed );
			break;
		case "hybrid":
			switch_HybridPort ( 1, parseInt(objData1.native), objData1.allowed, objData1.untag_allowed );
			break;
	}

	switch (objData2.mode)
	{
		case "access":
			switch_AccessPort ( 2, parseInt(objData2.native) );
			break;
		case "trunk":
			switch_TrunkPort ( 2, parseInt(objData2.native), objData2.allowed );
			break;
		case "uplink":
			switch_UplinkPort ( 2, parseInt(objData2.native), objData2.allowed );
			break;
		case "hybrid":
			switch_HybridPort ( 2, parseInt(objData2.native), objData2.allowed, objData2.untag_allowed );
			break;
	}
	
}

function getDataIDs()
{
	var sPortMode1 = $(".port1 .port_mode").val();
	var sPortMode2 = $(".port2 .port_mode").val();
	
	var objData1 = getAndCheckDataFromPort ( "port1", sPortMode1 );
	var objData2 = getAndCheckDataFromPort ( "port2", sPortMode2 );
	
	//console.log ( objData1 );
	//console.log ( objData2 );
	
	var iIndex;
	var arrayID = new Array ( );
	
	arrayID.push ( parseInt(objData1.native) );
	arrayID.push ( parseInt(objData2.native) );
	
	if (objData1.allowed!="" && objData1.allowed!=null)
	{
		for (iIndex=0;iIndex<objData1.allowed.length;iIndex++)
		{
			arrayID.push ( objData1.allowed[iIndex].iStart );
			if (objData1.allowed[iIndex].iEnd!="")
				arrayID.push ( objData1.allowed[iIndex].iEnd );
		}
	}
	
	if (objData2.allowed!="" && objData2.allowed!=null)
	{
		for (iIndex=0;iIndex<objData2.allowed.length;iIndex++)
		{
			arrayID.push ( objData2.allowed[iIndex].iStart );
			if (objData2.allowed[iIndex].iEnd!="")
				arrayID.push ( objData2.allowed[iIndex].iEnd );
		}
	}
	
	if (objData1.untag_allowed!="" && objData1.untag_allowed!=null)
	{
		for (iIndex=0;iIndex<objData1.untag_allowed.length;iIndex++)
		{
			arrayID.push ( objData1.untag_allowed[iIndex].iStart );
			if (objData1.untag_allowed[iIndex].iEnd!="")
				arrayID.push ( objData1.untag_allowed[iIndex].iEnd );
		}
	}
	
	if (objData2.untag_allowed!="" && objData2.untag_allowed!=null)
	{
		for (iIndex=0;iIndex<objData2.untag_allowed.length;iIndex++)
		{
			arrayID.push ( objData2.untag_allowed[iIndex].iStart );
			if (objData2.untag_allowed[iIndex].iEnd!="")
				arrayID.push ( objData2.untag_allowed[iIndex].iEnd );
		}
	}
	
	//Naive duplicate remove...
	var arrayCheckID = new Array ( );
	for (iIndex=0;iIndex<arrayID.length;iIndex++)
	{
		if (arrayCheckID.indexOf(arrayID[iIndex])==-1)
			arrayCheckID.push ( arrayID[iIndex] );
	}
	arrayCheckID.sort();
	
	var sOutput = "0";
	for (iIndex=0;iIndex<arrayCheckID.length;iIndex++)
	{
		sOutput = sOutput.concat ( ",", arrayCheckID[iIndex] );
	}
	
	$("#id_list").val(sOutput);
	
	
	//console.log ( arrayCheckID );
	
	
	//var arrayValueTag = checkVLANIDS ( sValueTagAllowed );
	//var arrayValueUNTag = checkVLANIDS ( sValueUNTagAllowed );

	
}

function getAndCheckDataFromPort ( sPortName, sPortMode )
{
	var sMode 			= "";
	var sNative 		= "";
	var sAllowed		= "";
	var sUNTagAllowed	= "";
	var sObject			= "."+sPortName+" ."+sPortMode;
	
	switch (sPortMode)
	{
		case "port_access":
			sMode 			= "access";
			sNative 		= $(sObject+" .native").val().trim();
			break;
			
		case "port_trunk":
			sMode 			= "trunk";
			sNative 		= $(sObject+" .native").val().trim();
			sAllowed 		= $(sObject+" .allowed").val().trim();
			
			sAllowed		= checkVLANIDS ( sAllowed );
			break;
			
		case "port_uplink":
			sMode 			= "uplink";
			sNative 		= $(sObject+" .native").val().trim();
			sAllowed 		= $(sObject+" .allowed").val().trim();
			
			sAllowed		= checkVLANIDS ( sAllowed );
			break;
			
		case "port_hybrid":
			sMode 			= "hybrid";
			sNative 		= $(sObject+" .native").val().trim();
			sAllowed 		= $(sObject+" .tag_allowed").val().trim();
			sUNTagAllowed 	= $(sObject+" .untag_allowed").val().trim();
			
			sAllowed		= checkVLANIDS ( sAllowed );
			sUNTagAllowed	= checkVLANIDS ( sUNTagAllowed );
			break;
	}
	
	//Check native
	sNative = getIntValue ( sNative );
	
	
	return {
		"mode" : sMode,
		"native" : sNative,
		"allowed" : sAllowed,
		"untag_allowed" : sUNTagAllowed
	};
}

function checkVLANIDS ( sValues, iMinValue = 1 )
{
	var iIndex;
	var iLength;
	var s, i;
	var sAccumulator;
	var arrayValues = new Array ();
	var bError;
	var bMinusSymbol;
	var iIndexArray = 0;
	var iValue;
	
	sValues = sValues.trim();
	
	
	bMinusSymbol 	= false;
	bError 			= false;
	sAccumulator 	= "";
	iLength 		= sValues.length;
	for (iIndex=0;iIndex<iLength;iIndex++)
	{
		s = sValues[iIndex];
		i = getIntValue ( s );
		
		if (i==null)
		{
			if ( (s=="-") || (s==",") )
			{
				if (sAccumulator.length==0)
				{
					return null;
				}
				else
				{
					if ( (s=="-") && (bMinusSymbol==true) )
						return null;
					
					iValue = getIntValue(sAccumulator);
					if (iValue==null) return null;
					
					if ((iValue<iMinValue) || (iValue>4094))
						return null;
					
					if (bMinusSymbol==true)
					{
						arrayValues[iIndexArray-1].iEnd = iValue;
						
						if ( arrayValues[iIndexArray-1].iEnd <= arrayValues[iIndexArray-1].iStart )
							return null;
						
						bMinusSymbol = false;
					}
					else
					{
						arrayValues.push (
							{
								"iStart" : iValue,
								"iEnd" : ""
							} );
						iIndexArray++;
					}		
					sAccumulator = "";
					
					if (s=="-")
						bMinusSymbol = true;
						
				}
			}
			else
			{
				return null;
			}
		}
		else
		{
			sAccumulator = sAccumulator.concat ( s );
		}
	}
	
	if (sAccumulator.length)
	{
		iValue = getIntValue(sAccumulator);
		if (iValue==null) return null;
		
		if ((iValue<iMinValue) || (iValue>4094))
			return null;
		
		
		if (bMinusSymbol==true)
		{
			arrayValues[iIndexArray-1].iEnd = iValue;
			
			if ( arrayValues[iIndexArray-1].iEnd <= arrayValues[iIndexArray-1].iStart )
				return null;
		}
		else
		{
			arrayValues.push (
				{
					"iStart" : iValue,
					"iEnd" : ""
				} );
			iIndexArray++;
		}		
	}
	else
	{
		return null;
	}
	
	//console.log ( arrayValues );
		
	return arrayValues;
}

function ids_inputTextState ( obj, bError )
{
	$(obj).removeClass("inputError");
	$(obj).removeClass("inputValid");
	
	if (bError==true)
		$(obj).addClass("inputError");
	else
		$(obj).addClass("inputValid");
}

function ids_checkSingleValue ( obj )
{
	var sValue = $(obj).val();
	var iValue = getIntValue(sValue);
	
	if (iValue!=null)
	{
		if ( (iValue<1) || (iValue>4094) )
			iValue = null;
	}
	
	ids_inputTextState ( obj, (iValue==null) );
}

function ids_checkMultipleValueAndEmpty ( obj )
{
	var sValue = $(obj).val();
	var bError;
	
	bError = true;
	sValue = sValue.trim();
	
	if (sValue.length==0)
	{
		bError = false;
		
		$(obj).removeClass("inputError");
		$(obj).removeClass("inputValid");
		$(obj).addClass("inputValid");
	}
	else
	{
		if (checkVLANIDS ( sValue )!=null)
			bError = false;
		
		ids_inputTextState ( obj, bError );
	}
}

function ids_checkSingleValueSimple ( obj )
{
	ids_checkSingleValue ( obj );
	ids_checkalldone ( );
}

function ids_checkSingleValueHybrid ( obj )
{
	ids_checkSingleValue ( obj );
	ids_checkConflict ( obj );
	ids_checkalldone ( );
}

function ids_checkMultipleValueAndEmptySimple ( obj )
{
	ids_checkMultipleValueAndEmpty ( obj );
	ids_checkalldone ( );
}

function ids_checkMultipleValueAndEmptyHybrid ( obj )
{
	ids_checkMultipleValueAndEmpty ( obj );
	ids_checkConflict ( obj );
	ids_checkalldone ( );
}

function ids_arrayIDStoTableState ( arrayValues )
{
	var arrayStateVLAN = new Array ( );
	var iIndex,iIndexValue;
	for (iIndex=0;iIndex<4095;iIndex++)
	{
		arrayStateVLAN[iIndex] = 0;
	}
	
	if (arrayValues!=null)
	{	
		for (iIndexValue=0;iIndexValue<arrayValues.length;iIndexValue++)
		{
			if (arrayValues[iIndexValue].iEnd=="")
			{
				arrayStateVLAN[arrayValues[iIndexValue].iStart] = 1;
			}
			else
			{
				for (iIndex=arrayValues[iIndexValue].iStart;iIndex<=arrayValues[iIndexValue].iEnd;iIndex++)
				{
					arrayStateVLAN[iIndex] = 1;
				}
			}
		}
	}
	
	return arrayStateVLAN;
}


function ids_checkConflict ( obj )
{
	var sPort = $(obj).parents(".ports").attr("id");
	
	var sValueNative = $("."+sPort+" .port_hybrid .native").val();
	var sValueTagAllowed = $("."+sPort+" .tag_allowed").val();
	var sValueUNTagAllowed = $("."+sPort+" .untag_allowed").val();
	var objConflict = "."+sPort+" .conflict_allowed";



	sValueNative 		= sValueNative.trim();
	sValueTagAllowed 	= sValueTagAllowed.trim();
	sValueUNTagAllowed 	= sValueUNTagAllowed.trim();
	
	$(objConflict).removeClass("inputError");
	$(objConflict).removeClass("inputValid");
	$(objConflict).val("No conflict");
	
	if ( (sValueTagAllowed.length==null) || (sValueUNTagAllowed.length==null) )
	{
		$(objConflict).addClass("inputValid");
		return;
	}
	
	
	var arrayValueTag = checkVLANIDS ( sValueTagAllowed );
	var arrayValueUNTag = checkVLANIDS ( sValueUNTagAllowed );
	
	var iValueNative = getIntValue(sValueNative);
	if (iValueNative!=null)
	{
		if (arrayValueUNTag==null)
			arrayValueUNTag = new Array ( );
		
		arrayValueUNTag.push (
			{
				"iStart" : iValueNative,
				"iEnd" : ""
			} );
	}
	
	if ( (arrayValueTag==null) || (arrayValueUNTag==null) )
	{
		$(objConflict).addClass("inputValid");
		return;
	}
	
	var tableStateTag 	= ids_arrayIDStoTableState ( arrayValueTag );
	var tableStateUNTag = ids_arrayIDStoTableState ( arrayValueUNTag );
	
	var iIndex;
	var sConflictID = "";
	for (iIndex=1;iIndex<4095;iIndex++)
	{
		if ( (tableStateTag[iIndex]==1) && (tableStateUNTag[iIndex]==1) )
		{
			if (sConflictID=="")
				sConflictID = sConflictID.concat ( iIndex );
			else
				sConflictID = sConflictID.concat ( ",", iIndex );

			if (sConflictID.length>25)
			{
				sConflictID = sConflictID.concat ( "..." );
				iIndex = 4095;
			}
		}
		
		//console.log ( "tag "+iIndex+" : "+tableStateTag[iIndex]+" at "+tableStateUNTag[iIndex] );
	}
	
	if (sConflictID=="")
	{
		$(objConflict).addClass("inputValid");
		return;
	}
		
	
	$(objConflict).val("Conflict : " + sConflictID);
	$(objConflict).addClass("inputError");
}

function ids_checkalldone ( )
{
	var sPortMode1 = $(".port1 .port_mode").val();
	var sPortMode2 = $(".port2 .port_mode").val();
	var bError;
	
	bError = false;
	
	if ($(".port1 ."+sPortMode1+" input").hasClass("inputError"))
		bError = true;

	if ($(".port2 ."+sPortMode2+" input").hasClass("inputError"))
		bError = true;
	
	$(".test_ids_list").removeClass("blockdisabled");
	$(".result_matrix").removeClass("blockdisabled");
	$(".frame_simulator").removeClass("blockdisabled");
	
	if (bError)
	{
		$(".test_ids_list").addClass("blockdisabled");
		$(".result_matrix").addClass("blockdisabled");
		$(".frame_simulator").addClass("blockdisabled");
	}
	else
	{
		ids_doMatrix ( );
		switchDoSimulation ( );
	}
	
}

function ids_clear ( )
{
	$("#id_list").val("");
	ids_doMatrix ( );
}

function ids_autoGenerate ( )
{
	getDataIDs ( );
	ids_doMatrix ( );
}







function ids_doMatrix ( )
{
	var sValuesIDS = $("#id_list").val();
	var arrayValues = checkVLANIDS ( sValuesIDS, 0 );
	var arrayStateVLAN = new Array ( );
	var arrayCheckVLAN = new Array ( );
	var iIndex,iIndexValue;
	var iPortA, iPortB;
	var iLength;
	
	if (arrayValues==null)
	{
		$("#vlan_matrix").html("");
		return;
	}
	
	for (iIndex=0;iIndex<=4094;iIndex++)
	{
		arrayStateVLAN[iIndex] = 0;
	}
	
	for (iIndexValue=0;iIndexValue<arrayValues.length;iIndexValue++)
	{
		if (arrayValues[iIndexValue].iEnd=="")
		{
			arrayStateVLAN[arrayValues[iIndexValue].iStart] = 1;
		}
		else
		{
			arrayStateVLAN[arrayValues[iIndexValue].iStart] = 1;
			arrayStateVLAN[arrayValues[iIndexValue].iEnd] = 1;
		}
	}
	
	for (iIndex=0;iIndex<=4094;iIndex++)
	{
		if (arrayStateVLAN[iIndex]==1)
			arrayCheckVLAN.push ( iIndex );
	}
	
	//Initialize switch
	switchFieldsToInitialize ( );
	
	var sOutput;
	var sTable, sLine, sCell;
	var iPortVLANA, iPortVLANB;
	var sResult;
	var iResult;
	var iDirection;
	var sDirectionA, sDirectionB;
	var iDirectionA, iDirectionB;
	var sClassAdd;
	
	sOutput = "";
	iLength = arrayCheckVLAN.length;
	
	
	
	for (iDirection=0;iDirection<2;iDirection++)
	{
		sTable = "";
		sClassAdd = "";
		
		switch (iDirection)
		{
			case 0:
				sDirectionA = "p1";
				sDirectionB = "p2";
				iDirectionA = 1;
				iDirectionB = 2;
				sClassAdd = "matrix-title-p1p2";
				break;
				
			case 1:
				sDirectionA = "p2";
				sDirectionB = "p1";
				iDirectionA = 2;
				iDirectionB = 1;
				sClassAdd = "matrix-title-p2p1";
				break;
		}
		
		
		sLine = "<div class='matrix-cell matrix-title "+sClassAdd+"'>"+sDirectionB+" to "+sDirectionA+"</div>";
		for (iPortB=0;iPortB<iLength;iPortB++)
		{
			sCell = "<div class='matrix-cell'>"+sDirectionB+".id="+arrayCheckVLAN[iPortB]+"</div>";
			sLine = sLine.concat ( sCell );
		}
		
		sTable = sTable.concat ( '<div class="matrix-line">'+sLine+'</div>\n' );
		
		for (iPortA=0;iPortA<iLength;iPortA++)
		{
			sLine = "<div class='matrix-cell'>"+sDirectionA+".id="+arrayCheckVLAN[iPortA]+"</div>";
			for (iPortB=0;iPortB<iLength;iPortB++)
			{
				//Get VLAN A and VLAN B
				iPortVLANA = arrayCheckVLAN[iPortA];
				iPortVLANB = arrayCheckVLAN[iPortB];
				
				//Do check
				iResult = switch_ProceedFrameIO ( iDirectionB, iDirectionA, iPortVLANB );
				if (iResult==iPortVLANA)
					sResult = "<b>YES</b>";
				else
					sResult = "no";
				
				sCell = "<div class='matrix-cell'>"+sResult+"</div>";
				sLine = sLine.concat ( sCell );
			}
			sTable = sTable.concat ( '<div class="matrix-line">'+sLine+'</div>\n' );
		}
		
		sOutput = sOutput.concat ( "<div class='matrix-table'>"+sTable+"</div>" );
	}
	
	
	for (iDirection=0;iDirection<2;iDirection++)
	{
		switch (iDirection)
		{
			case 0:
				sDirectionA = "Port 1";
				sDirectionB = "Port 2";
				iDirectionA = 1;
				iDirectionB = 2;
				sClassAddA = "colorport1";
				sClassAddB = "colorport2";
				break;
				
			case 1:
				sDirectionA = "Port 2";
				sDirectionB = "Port 1";
				iDirectionA = 2;
				iDirectionB = 1;
				sClassAddA = "colorport2";
				sClassAddB = "colorport1";
				break;
		}
		
		sTable = "";
		for (iPortA=0;iPortA<iLength;iPortA++)
		{
			iPortVLANA = arrayCheckVLAN[iPortA];
			iResult = switch_ProceedFrameIO ( iDirectionA, iDirectionB, iPortVLANA );
			sClassResult = "";
			
			switch (iPortVLANA)
			{
				case 0:
				case null:
					sInput = "Frame is not tagged (or ID=0)";
					break;
				default:
					sInput = "Frame is tagged with ID "+iPortVLANA;
					break;
			}
			
			switch (iResult)
			{
				case null:
					sResult = "No output";
					sClassResult = " matrix-noframe";
					break;
				case 0:
					sResult = "Frame is not tagged (or ID=0)";
					break;
				default:
					sResult = "Frame is tagged with ID "+iResult;
					break;
			}
			
			sLine = "<div class='matrix-input "+sClassAddA+"'>"+sInput+"</div><div class='matrix-connector'></div><div class='matrix-output "+sClassAddB+sClassResult+"'>"+sResult+"</div>";
			sTable = sTable.concat ( '<div class="matrix-frame">'+sLine+'</div>\n' );
		}
		sTable = "<div class='matrix-frames'>"+sTable+"</div>";
		
		sOutput = sOutput + "<div class='matrix-frames-behavior'><div class='matrix-frame-direction'><div class='matrix-tag-direction "+sClassAddA+"'>"+sDirectionA+"</div> <span>&#8594</span> <div class='matrix-tag-direction "+sClassAddB+"'>"+sDirectionB+"</div></div>"+sTable+"</div>";
	}
		
	$("#vlan_matrix").html(sOutput);
	
	//console.log ( arrayCheckVLAN );
}

function switchDoSimulation ( )
{
	var sDirection;
	var iPortA, iPortB;
	var sVLANInput;
	var iVLANInput;
	var iResult;
	var sResult;
	
	
	//Initialize switch
	switchFieldsToInitialize ( );

	//Get direction
	sDirection = $(".direction").val();
	switch (sDirection)
	{
		case "p1p2":
			iPortA = 1;
			iPortB = 2;
			break;
			
		case "p2p1":
			iPortA = 2;
			iPortB = 1;
			break;
	}
	
	//Get Tag input
	sVLANInput = $(".vlan_input").val().trim();
	
	if (sVLANInput=="")
		iVLANInput = 0;
	else
		iVLANInput = parseInt(sVLANInput);
	
	if ( (iVLANInput>=0) && (iVLANInput<=4094) )
	{	
		iResult = switch_ProceedFrameIO ( iPortA, iPortB, iVLANInput );
	
		switch (iResult)
		{
			case null:
				sResult = "No output";
				break;
				
			case 0:
				sResult = "Frame has no 802.1Q TAG or VLAN ID = 0";
				break;
			
			default:
				sResult = "Frame is tagged with VLAN ID = " + iResult;
				break;
		}
	}
	else
	{
		sResult = "Error in input frame VLAN ID !";
	}
	
	$(".vlan_output").val(sResult)
	
}

function notesChangeState(obj)
{
	var objNext;
	
	objNext = $(obj).next();
	
	if ($(objNext).hasClass("notes-disabled"))
		$(objNext).removeClass ( "notes-disabled" );
	else
		$(objNext).addClass ( "notes-disabled" );
		
		
}
