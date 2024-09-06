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
 
 
var ports_input_allow_filter_LUT 	= new Array ( );
var ports_input_translation_LUT 	= new Array ( );

var ports_output_allow_filter_LUT 	= new Array ( );
var ports_output_translation_LUT = new Array ( );

/*

	Switch behavior
	
	
		Input processing pipeline
		
			1.Input port 
				\/
			2.Translation
				\/
			3.Brickwall "Allow filter"
				\/
			4.Internal switch bus
		
		
		Output processing pipeline
		
			1.Internal switch bus 
				\/
			2.Brickwall "Allow filter"
				\/
			3.Translation 
				\/
			4.Output port
*/

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
			ports_input_translation_LUT[0] 		= switch_CreatePortFilterTranslation ( );
			ports_output_translation_LUT[0] 	= switch_CreatePortFilterTranslation ( );
			ports_input_allow_filter_LUT[0] 	= switch_CreatePortFilterBrickwall ( );
			ports_output_allow_filter_LUT[0] 	= switch_CreatePortFilterBrickwall ( );
			break;
			
		case 2:
			ports_input_translation_LUT[1] 		= switch_CreatePortFilterTranslation ( );
			ports_output_translation_LUT[1] 	= switch_CreatePortFilterTranslation ( );
			ports_input_allow_filter_LUT[1] 	= switch_CreatePortFilterBrickwall ( );
			ports_output_allow_filter_LUT[1] 	= switch_CreatePortFilterBrickwall ( );
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
	
	//Input behavior
	ports_input_translation_LUT[iPortItem][0] 				= iNativeVLAN;
	ports_input_allow_filter_LUT[iPortItem][iNativeVLAN] 	= 1;
	
	//Output behavior
	ports_output_allow_filter_LUT[iPortItem][iNativeVLAN] 	= 1;
	ports_output_translation_LUT[iPortItem][iNativeVLAN] 	= 0;
}

/*
 *	Trunk port
 *	Set port 1 or port 2
 *
 *	iNative VLAN from 1 to 4094
 *	arrayValueTag could be null (eq 1-4094) or multiple values
 */
function switch_TrunkPort ( iPortNumber, iNativeVLAN, arrayValueTag )
{
	var iIndex;
	var iPortItem;
	var arrayStateID;
	
	switch_InitializePort ( iPortNumber );
	iPortItem = iPortNumber - 1;
	
	arrayStateID = ids_arrayIDStoTableState ( arrayValueTag );
	
	//Input behavior
	ports_input_translation_LUT[iPortItem][0] 				= iNativeVLAN;
	
	//Output behavior
	ports_output_translation_LUT[iPortItem][iNativeVLAN] 	= 0;
	
	
	//Allowed VLAN in Trunk mode
	if (arrayValueTag==null)
	{
		//Default behavior
		for (iIndex=1;iIndex<=4094;iIndex++)
		{
			ports_input_allow_filter_LUT[iPortItem][iIndex] = 1;
			ports_output_allow_filter_LUT[iPortItem][iIndex] = 1;
		}
	}
	else
	{
		for (iIndex=1;iIndex<=4094;iIndex++)
		{
			if (arrayStateID[iIndex]==1)
			{
				ports_input_allow_filter_LUT[iPortItem][iIndex] = 1;
				ports_output_allow_filter_LUT[iPortItem][iIndex] = 1;
			}
			else
			{
				ports_input_allow_filter_LUT[iPortItem][iIndex] = 0;
				ports_output_allow_filter_LUT[iPortItem][iIndex] = 0;
			}
		}
	}
}

/*
 *	Uplink port
 *	Set port 1 or port 2
 *
 *	iNative VLAN from 1 to 4094
 *	arrayValueTag could be null (eq 1-4094) or multiple values
 */
function switch_UplinkPort ( iPortNumber, iNativeVLAN, arrayValueTag )
{
	var iIndex;
	var iPortItem;
	var arrayStateID;
	
	switch_InitializePort ( iPortNumber );
	iPortItem = iPortNumber - 1;
	
	arrayStateID = ids_arrayIDStoTableState ( arrayValueTag );
	
	//Input behavior
	ports_input_translation_LUT[iPortItem][0] 				= iNativeVLAN;
	
	//Output behavior
	//...Nothing to do with translation
	
	
	//Allowed VLAN in Uplink mode
	if (arrayValueTag==null)
	{
		//Default behavior
		for (iIndex=1;iIndex<=4094;iIndex++)
		{
			ports_input_allow_filter_LUT[iPortItem][iIndex] = 1;
			ports_output_allow_filter_LUT[iPortItem][iIndex] = 1;
		}
	}
	else
	{
		for (iIndex=1;iIndex<=4094;iIndex++)
		{
			if (arrayStateID[iIndex]==1)
			{
				ports_input_allow_filter_LUT[iPortItem][iIndex] = 1;
				ports_output_allow_filter_LUT[iPortItem][iIndex] = 1;
			}
			else
			{
				ports_input_allow_filter_LUT[iPortItem][iIndex] = 0;
				ports_output_allow_filter_LUT[iPortItem][iIndex] = 0;
			}
		}
	}
}

/*
 *	Hybrid port
 *	Set port 1 or port 2
 *
 *	iNative VLAN from 1 to 4094
 *	arrayValueTag could be null (eq 1-4094) or multiple values
 *	arrayValueUNTag could be null (eq 1-4094) or multiple values
 */
function switch_HybridPort ( iPortNumber, iNativeVLAN, arrayValueTag, arrayValueUNTag )
{
	var iIndex;
	var iPortItem;
	var arrayStateTagID;
	var arrayStateUNTagID;
	
	switch_InitializePort ( iPortNumber );
	iPortItem = iPortNumber - 1;
	
	arrayStateTagID 	= ids_arrayIDStoTableState ( arrayValueTag );
	arrayStateUNTagID 	= ids_arrayIDStoTableState ( arrayValueUNTag );
	
	//Default values
	if (arrayValueUNTag==null)
	{
		for (iIndex=1;iIndex<=4094;iIndex++)
		{
			arrayStateUNTagID[iIndex] = 0;
		}
		arrayStateUNTagID[iNativeVLAN] = 1;
	}
	if (arrayValueTag==null)
	{
		for (iIndex=1;iIndex<=4094;iIndex++)
		{
			if (arrayStateUNTagID[iIndex]==0)
				arrayStateTagID[iIndex] = 1;
			else
				arrayStateTagID[iIndex] = 0;
		}
		
	}

	//Input behavior (translate)
	ports_input_translation_LUT[iPortItem][0] 				= iNativeVLAN;
	
	//Output behavior (translate)
	ports_output_translation_LUT[iPortItem][iNativeVLAN] 	= 0;
	for (iIndex=1;iIndex<=4094;iIndex++)
	{
		if (arrayStateUNTagID[iIndex]==1)
		{
			ports_output_translation_LUT[iPortItem][iIndex] = 0
		}
	}

	//Allowed VLAN
	for (iIndex=1;iIndex<=4094;iIndex++)
	{
		if ( (arrayStateTagID[iIndex]==1) || (arrayStateUNTagID[iIndex]==1) )
		{
			ports_input_allow_filter_LUT[iPortItem][iIndex] = 1;
			ports_output_allow_filter_LUT[iPortItem][iIndex] = 1;
		}
		else
		{
			ports_input_allow_filter_LUT[iPortItem][iIndex] = 0;
			ports_output_allow_filter_LUT[iPortItem][iIndex] = 0;
			
		}
	}
	
}



/*
 *
 *	ProceedFrameIO
 *
 */
function switch_ProceedFrameIO ( iPortNumberInput, iPortNumberOutput, iInputFrameVLANID )
{
	var iInputVLAN_ID;
	var iOutputVLAN_ID;
	var iFrameID;
	var iPortItemInput;
	var iPortItemOutput;
	
	/*
	 *	Prepare VLAN ID input to output
	 */
	iInputVLAN_ID 	= 0;		//Default : no VLAN ID
	iOutputVLAN_ID 	= null; 	//Default : No output
	if ( (iInputFrameVLANID>=1) && (iInputFrameVLANID<4095) )
		iInputVLAN_ID = iInputFrameVLANID;
	
	/*
	 *	Input and output ports
	 */
	iPortItemInput 	= iPortNumberInput - 1;
	iPortItemOutput = iPortNumberOutput - 1;
	
	/*
	 *
	 *	Input processing
	 *		Step 1 - Translation (from untagged to tagged)
	 *		Step 2 - Brickwall "allow filter"
	 */
	 
	//Step 1 - Translation
	iFrameID = ports_input_translation_LUT[iPortItemInput][iInputVLAN_ID];
	
	//Step 2 - Brickwall
	if (ports_input_allow_filter_LUT[iPortItemInput][iFrameID] == 0)
		return null;
	

	/*
	 *
	 *	internal switch processing
	 *
	 */
	 
	// Frame is now inside the switch and will be send to output...
	// Nothing to do...
	 

	
	/*
	 *
	 *	Output processing
	 *		Step 1 - Brickwall "allow filter"
	 *		Step 2 - Translation (from tagged to untagged)
	 *
	 */
	 
	//Step 1 - Brickwall
	if (ports_output_allow_filter_LUT[iPortItemOutput][iFrameID] == 0)
		return null;
	
	//Step 2 - Translation
	iOutputVLAN_ID = ports_output_translation_LUT[iPortItemOutput][iFrameID];
	
	return iOutputVLAN_ID;
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