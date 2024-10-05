<h4>Translated from French with chatGPT 4o</h4>
<h1>Access Port</h1>

<h3>Parameter</h3>
<p>"Access VLAN": An integer ranging from 1 to 4094.</p>

<h3>In Input Mode</h3>
<p>- Untagged frames are tagged with the "Access VLAN" value and pass through.</p>
<p>- Frames already tagged with the "Access VLAN" value pass through.</p>

<h3>In Output Mode</h3>
<p>- Frames tagged with the "Access VLAN" value are untagged.</p>

<hr>

<h1>Trunk Port</h1>

<h3>Parameters</h3>
<p>"Native VLAN": An integer ranging from 1 to 4094.</p>
<p>"Allowed VLAN": A combination of values such as "15,40-100,120-150,501,505" to indicate ranges and/or individual values.</p>
<br/>
<p>Note: If "Allowed VLAN" is absent, its value is automatically set to "1-4094".</p>

<h3>In Input Mode</h3>
<p>The Native VLAN allows tagging of untagged frames upon input. The frame is tagged and passes through only if it is allowed.</p>
<p>Only frames allowed by "Allowed VLAN" pass through.</p>
<p>The Trunk and Uplink modes share the exact same treatment for incoming frames.</p>

<h3>In Output Mode</h3>
<p>The Native VLAN allows untagging of tagged frames. Note that a frame passes and is untagged only if it is allowed by "Allowed VLAN".</p>
<p>Only frames allowed in "Allowed VLAN" pass through.</p>

<hr>

<h1>Uplink Port</h1>

<h3>Parameters</h3>
<p>"Native VLAN": An integer ranging from 1 to 4094.</p>
<p>"Allowed VLAN": A combination of values such as "15,40-100,120-150,501,505" to indicate ranges and/or individual values.</p>
<br/>
<p>Note: If "Allowed VLAN" is absent, its value is automatically set to "1-4094".</p>

<h3>In Input Mode</h3>
<p>The Native VLAN allows tagging of untagged frames upon input. The frame is tagged and passes through only if it is allowed.</p>
<p>Only frames allowed by "Allowed VLAN" pass through.</p>
<p>The Trunk and Uplink modes share the exact same treatment for incoming frames.</p>

<h3>In Output Mode</h3>
<p>The Native VLAN is never used in output mode. The Uplink mode NEVER un-tags any frame.</p>
<p>Only frames allowed in "Allowed VLAN" pass through.</p>

<hr>

<h1>Hybrid Port</h1>

<h3>Parameters</h3>
<p>"Native VLAN": An integer ranging from 1 to 4094.</p>
<p>"Tag Allowed VLAN": A combination of values such as "15,40-100,120-150,501,505" to indicate ranges and/or individual values.</p>
<p>"UNTag Allowed VLAN": A combination of values such as "15,40-100,120-150,501,505" to indicate ranges and/or individual values.</p>
<br/>
<p>By default, if "Tag Allowed VLAN" is empty, it corresponds to all VLANs except those in "Native VLAN" and "UNTag Allowed VLAN".</p>
<p>By default, if "UNTag Allowed VLAN" is empty, it corresponds to "Native VLAN".</p>

<h3>In Input Mode</h3>
<p>The value of the "Native VLAN" allows tagging of incoming untagged frames, but only if the value is present in "UNTag Allowed VLAN".</p>
<p>The values in "Tag Allowed VLAN" and "UNTag Allowed VLAN" combined allow tagged frames to pass through on input.</p>
<p>It is not possible to include the Native VLAN value in "Tag Allowed VLAN".</p>
<br/>

<h3>In Output Mode</h3>
<p>The combined values of "Tag Allowed VLAN" and "UNTag Allowed VLAN" allow tagged frames to pass through.</p>
<p>Frames tagged with values combined from "Native VLAN" and "UNTag Allowed VLAN" are untagged on output.</p>
<p>Note: The "Native VLAN" value must be present in "UNTag Allowed VLAN" for frames to be untagged.</p>
