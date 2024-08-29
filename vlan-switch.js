/*
 * Copyright (c) 2020-2024 Alexia Gossa
 *
 * This file is a part of SDM3055XM.
 * This source code is closed.
 *
 * It is totaly forbidden to disclose any information from
 * the source code.
 *
 * By accessing this file (read, modify or write), you
 * accept the non-disclosure agreement (NDA) without any
 * limitation.
 *
 *     contact@nemelit.com
 *
 * Alexia Gossa
 * nemelit.com
 * FRANCE
 */
 
 
var ports_brickwall_prefilter_LUT 	= new Array ( );
var ports_translation_filter_LUT   	= new Array ( );
var ports_detranslation_filter_LUT  = new Array ( );
var ports_brickwall_postfilter_LUT 	= new Array ( );



/*
 *
 *	Initialize the switch rules
 *
 */
function switch_Initialize ( )
{
	switch_InitializePort ( 1 );
	switch_InitializePort ( 2 );
}

function switch_InitializePort ( iPortNumber )
{
	switch ( iPortNumber)
	{
		case 1:
			ports_translation_filter_LUT[0] 	= switch_CreatePortFilterTranslation ( );
			ports_detranslation_filter_LUT[0] 	= switch_CreatePortFilterTranslation ( );
			ports_brickwall_prefilter_LUT[0] 	= switch_CreatePortFilterBrickwall ( );
			ports_brickwall_postfilter_LUT[0] 	= switch_CreatePortFilterBrickwall ( );
			break;
			
		case 2:
			ports_translation_filter_LUT[1] 	= switch_CreatePortFilterTranslation ( );
			ports_detranslation_filter_LUT[1] 	= switch_CreatePortFilterTranslation ( );
			ports_brickwall_prefilter_LUT[1] 	= switch_CreatePortFilterBrickwall ( );
			ports_brickwall_postfilter_LUT[1] 	= switch_CreatePortFilterBrickwall ( );
			break;
	}
}

/*
 *
 *	Access Port
 *  Set port 1 or port 2
 *
 */
function switch_AccessPort ( iPortNumber, iNativeVLAN )
{
	var iPortItem;
	
	switch_InitializePort ( iPortNumber );
	iPortItem = iPortNumber - 1;
	
	/*
	 *	Brickwall pre-filter
	 */
	
	//Enable pre-filter not-tagged frames
	ports_brickwall_prefilter_LUT[iPortItem][0] = 1;
	
	//Enable pre-filter tagged frames
	ports_brickwall_prefilter_LUT[iPortItem][iNativeVLAN] = 1;
	
	/*
	 *	Translation filter
	 */
	
	//Translate non-tagged frames to iNativeVLAN
	ports_translation_filter_LUT[iPortItem][0] = iNativeVLAN;
	
	//De-translate
	ports_detranslation_filter_LUT[iPortItem][iNativeVLAN] = 0;
	
	/*
	 *	Brickwall post-filter
	 */
	
	//Enable post-filter tagged frames
	ports_brickwall_postfilter_LUT[iPortItem][iNativeVLAN] = 1;
}

function switch_TrunkPort ( iPortNumber, iNativeVLAN, arrayValueTag )
{
	var iPortItem;
	var arrayStateID;
	
	switch_InitializePort ( iPortNumber );
	iPortItem = iPortNumber - 1;
	
	arrayStateID = ids_arrayIDStoTableState ( arrayValueTag );
	
	/*
	 *	Brickwall pre-filter
	 */
	
	//Enable pre-filter not-tagged frames
	ports_brickwall_prefilter_LUT[iPortItem][0] = 1;
	
	//Enable pre-filter tagged frames
	for (iIndex=0;iIndex<=4094;iIndex++)
	{
		if (arrayStateID[iIndex]==1)
			ports_brickwall_prefilter_LUT[iPortItem][iIndex] = 1;
	}
	
	/*
	 *	Translation filter
	 */
	 
	//Translate non-tagged frames to iNativeVLAN
	ports_translation_filter_LUT[iPortItem][0] = iNativeVLAN;
	
	//De-translate
	ports_detranslation_filter_LUT[iPortItem][iNativeVLAN] = 0;
	
	/*
	 *	Brickwall post-filter
	 */
	
	//Enable post-filter tagged frames
	for (iIndex=0;iIndex<=4094;iIndex++)
	{
		if (arrayStateID[iIndex]==1)
			ports_brickwall_postfilter_LUT[iPortItem][iIndex] = 1;
	}
}

function switch_UplinkPort ( iPortNumber, iNativeVLAN, arrayValueTag )
{
	var iPortItem;
	var arrayStateID;
	
	switch_InitializePort ( iPortNumber );
	iPortItem = iPortNumber - 1;
	
	arrayStateID = ids_arrayIDStoTableState ( arrayValueTag );
	
	/*
	 *	Brickwall pre-filter
	 */
	
	//Enable pre-filter not-tagged frames
	ports_brickwall_prefilter_LUT[iPortItem][0] = 1;
	
	ports_brickwall_prefilter_LUT[iPortItem][iNativeVLAN] = 1;
	
	//Enable pre-filter tagged frames
	for (iIndex=0;iIndex<=4094;iIndex++)
	{
		if (arrayStateID[iIndex]==1)
			ports_brickwall_prefilter_LUT[iPortItem][iIndex] = 1;
	}
	
	/*
	 *	Translation filter
	 */
	 
	//Translate non-tagged frames to iNativeVLAN
	ports_translation_filter_LUT[iPortItem][0] = iNativeVLAN;
	
	//De-translate
	ports_detranslation_filter_LUT[iPortItem][iNativeVLAN] = 0;
	
	/*
	 *	Brickwall post-filter
	 */
	
	//Enable post-filter tagged frames
	for (iIndex=0;iIndex<=4094;iIndex++)
	{
		if (arrayStateID[iIndex]==1)
			ports_brickwall_postfilter_LUT[iPortItem][iIndex] = 1;
	}
}


function switch_HybridPort ( iPortNumber, iNativeVLAN, arrayValueTag, arrayValueUNTag )
{
	var iPortItem;
	var arrayStateTagID;
	var arrayStateUNTagID;
	
	switch_InitializePort ( iPortNumber );
	iPortItem = iPortNumber - 1;
	
	arrayStateTagID 	= ids_arrayIDStoTableState ( arrayValueTag );
	arrayStateUNTagID 	= ids_arrayIDStoTableState ( arrayValueUNTag );
	
	/*
	 *	Brickwall pre-filter
	 */
	
	//Enable pre-filter not-tagged frames
	ports_brickwall_prefilter_LUT[iPortItem][0] = 1;
	
	ports_brickwall_prefilter_LUT[iPortItem][iNativeVLAN] = 1;
	
	//Enable pre-filter tagged frames
	for (iIndex=0;iIndex<=4094;iIndex++)
	{
		if (arrayStateTagID[iIndex]==1)
			ports_brickwall_prefilter_LUT[iPortItem][iIndex] = 1;
	}
	
	/*
	 *	Translation filter
	 */
	 
	//Translate non-tagged frames to iNativeVLAN
	ports_translation_filter_LUT[iPortItem][0] = iNativeVLAN;
	
	//De-translate
	ports_detranslation_filter_LUT[iPortItem][iNativeVLAN] = 0;
	
	/*
	 *	Brickwall post-filter
	 */
	
	//Enable post-filter tagged frames
	for (iIndex=0;iIndex<=4094;iIndex++)
	{
		if (arrayStateTagID[iIndex]==1)
			ports_brickwall_postfilter_LUT[iPortItem][iIndex] = 1;
	}
	
	
}



/*
 *
 *	ProceedFrameIO
 *
 */
function switch_ProceedFrameIO ( iPortNumberInput, iPortNumberOutput, iInputFrameVLANID )
{
	var iInputID;
	var iOutputID;
	var iFrameID;
	var iPortItemInput;
	var iPortItemOutput;
	
	iInputID 	= 0;		//Default : no VLAN ID
	iOutputID 	= null; 	//Default : No output
	if ( (iInputFrameVLANID>=1) && (iInputFrameVLANID<4095) )
		iInputID = iInputFrameVLANID;
	
	iPortItemInput 	= iPortNumberInput - 1;
	iPortItemOutput = iPortNumberOutput - 1;
	
	/*
	 *
	 *	Port input...
	 *
	 */
	
	//Input Brickwall pre-filter
	if (ports_brickwall_prefilter_LUT[iPortItemInput][iInputID] == 0)
		return null;
	
	//Input translation filter
	iFrameID = ports_translation_filter_LUT[iPortItemInput][iInputID];
	
	//Input Brickwall post-filter
	if (ports_brickwall_postfilter_LUT[iPortItemInput][iFrameID] == 0)
		return null;
	
	/*
	 *
	 *	internal switch routing
	 *
	 */
	 
	iOutputID = iFrameID;
	
	
	/*
	 *
	 *	Port output...
	 *
	 */
	
	//Output Brickwall post-filter
	if (ports_brickwall_postfilter_LUT[iPortItemOutput][iOutputID] == 0)
		return null;
	
	//Output translation filter, do de-translation
	iOutputID = ports_detranslation_filter_LUT[iPortItemOutput][iOutputID];
	
	//Output Brickwall post-filter
	if (ports_brickwall_prefilter_LUT[iPortItemOutput][iOutputID] == 0)
		return null;
	
	return iOutputID;
}

 
/*
 *
 *	Create the translation filter LUT
 *	Output an array : [0;4094] => Value 0 to 4094
 *
 */
function switch_CreatePortFilterTranslation ( )
{
	var port_translation_prefilter_LUT 	= new Array ( ); //[0;4094] => Value 0 to 4094
	var iIndex;
	
	for (iIndex=0;iIndex<=4094;iIndex++)
	{
		port_translation_prefilter_LUT[iIndex] = iIndex;
	}
	
	return port_translation_prefilter_LUT;
}

/*
 *
 *	Create the brickwall filter LUT
 *	Output an array : [0;4094] => Value 0 = block (default), value 1 = pass
 *
 */
function switch_CreatePortFilterBrickwall ( )
{
	var port_brickwall_prefilter_LUT 	= new Array ( ); //[0;4094] => Value 0 = block or 1 = pass
	var iIndex;
	
	for (iIndex=0;iIndex<=4094;iIndex++)
	{
		port_brickwall_prefilter_LUT[iIndex] = 0;
	}
	
	return port_brickwall_prefilter_LUT;
}