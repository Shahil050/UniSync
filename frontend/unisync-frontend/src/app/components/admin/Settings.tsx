"use client";

import { useState } from "react";


export default function SettingsPage() {


const [saved,setSaved]=useState(false);



const [settings,setSettings]=useState({

platformName:"UniSync",
university:"Pokhara University",
email:"support@unisync.com",
version:"Version 1.0",

threshold:"0.75",
recommendationLimit:"10",
enableAI:true,

uploadSize:"20 MB",
fileTypes:".pdf",
autoApprove:true,

reportThreshold:"5",
aiModeration:true,

emailNotification:true,
pushNotification:true,
systemAlerts:true,

sessionTimeout:"30 Minutes",
twoFactor:true

});








const updateField=(key:string,value:any)=>{


setSettings(prev=>({

...prev,

[key]:value

}));


};







const handleSave=()=>{


console.log("Settings Saved:",settings);


setSaved(true);


setTimeout(()=>{

setSaved(false);

},3000);


};









return (
<div>



<div className="mb-8">

<h1 className="text-3xl font-bold text-slate-800">
System Settings
</h1>


<p className="text-slate-500 mt-2">
Configure UniSync platform settings.
</p>


</div>








<div className="space-y-6">







<div className="bg-white rounded-xl border shadow-sm p-6">


<h2 className="text-xl font-semibold mb-5">
General Settings
</h2>




<div className="grid md:grid-cols-2 gap-5">



{
[
["Platform Name","platformName"],
["University","university"],
["Support Email","email"],
["Version","version"]

].map(([label,key])=>(


<div key={key}>


<label className="block mb-2 font-medium">
{label}
</label>



<input

className="w-full border rounded-lg px-4 py-2"

value={(settings as any)[key]}

onChange={
e=>updateField(
key,
e.target.value
)
}

/>


</div>


))

}



</div>



</div>









<div className="bg-white rounded-xl border shadow-sm p-6">


<h2 className="text-xl font-semibold mb-5">
AI Recommendation
</h2>



<div className="grid md:grid-cols-2 gap-5">



<div>

<label className="block mb-2 font-medium">
Similarity Threshold
</label>


<input

type="number"

value={settings.threshold}

onChange={
e=>updateField(
"threshold",
e.target.value
)
}

className="w-full border rounded-lg px-4 py-2"

/>


</div>





<div>

<label className="block mb-2 font-medium">
Recommendation Limit
</label>


<input

type="number"

value={settings.recommendationLimit}

onChange={
e=>updateField(
"recommendationLimit",
e.target.value
)
}

className="w-full border rounded-lg px-4 py-2"

/>


</div>






<div className="flex items-center gap-3">


<input

type="checkbox"

checked={settings.enableAI}

onChange={
e=>updateField(
"enableAI",
e.target.checked
)
}

/>


<label>
Enable AI Recommendation
</label>


</div>



</div>


</div>









<div className="bg-white rounded-xl border shadow-sm p-6">


<h2 className="text-xl font-semibold mb-5">
Research Paper Settings
</h2>



<div className="grid md:grid-cols-2 gap-5">



<div>

<label className="block mb-2 font-medium">
Maximum Upload Size
</label>


<input

value={settings.uploadSize}

onChange={
e=>updateField(
"uploadSize",
e.target.value
)
}

className="w-full border rounded-lg px-4 py-2"

/>


</div>





<div>

<label className="block mb-2 font-medium">
Allowed File Types
</label>


<input

value={settings.fileTypes}

onChange={
e=>updateField(
"fileTypes",
e.target.value
)
}

className="w-full border rounded-lg px-4 py-2"

/>


</div>





<div className="flex items-center gap-3">


<input

type="checkbox"

checked={settings.autoApprove}

onChange={
e=>updateField(
"autoApprove",
e.target.checked
)
}

/>


<label>
Auto Approve Papers
</label>


</div>



</div>


</div>









<div className="bg-white rounded-xl border shadow-sm p-6">


<h2 className="text-xl font-semibold mb-5">
Content Moderation
</h2>



<div className="grid md:grid-cols-2 gap-5">



<div>

<label className="block mb-2 font-medium">
Report Threshold
</label>


<input

type="number"

value={settings.reportThreshold}

onChange={
e=>updateField(
"reportThreshold",
e.target.value
)
}

className="w-full border rounded-lg px-4 py-2"

/>


</div>





<div className="flex items-center gap-3">


<input

type="checkbox"

checked={settings.aiModeration}

onChange={
e=>updateField(
"aiModeration",
e.target.checked
)
}

/>


<label>
Enable AI Moderation
</label>


</div>


</div>


</div>









<div className="bg-white rounded-xl border shadow-sm p-6">


<h2 className="text-xl font-semibold mb-5">
Notification Settings
</h2>



<div className="space-y-4">



{
[
["Email Notifications","emailNotification"],
["Push Notifications","pushNotification"],
["System Alerts","systemAlerts"]

].map(([label,key])=>(


<div
key={key}
className="flex items-center gap-3"
>


<input

type="checkbox"

checked={(settings as any)[key]}

onChange={
e=>updateField(
key,
e.target.checked
)
}

/>


<label>
{label}
</label>


</div>


))

}



</div>


</div>









<div className="bg-white rounded-xl border shadow-sm p-6">


<h2 className="text-xl font-semibold mb-5">
Security
</h2>



<div className="grid md:grid-cols-2 gap-5">



<div>

<label className="block mb-2 font-medium">
Session Timeout
</label>


<input

value={settings.sessionTimeout}

onChange={
e=>updateField(
"sessionTimeout",
e.target.value
)
}

className="w-full border rounded-lg px-4 py-2"

/>


</div>





<div className="flex items-center gap-3">


<input

type="checkbox"

checked={settings.twoFactor}

onChange={
e=>updateField(
"twoFactor",
e.target.checked
)
}

/>


<label>
Enable Two Factor Authentication
</label>


</div>


</div>


</div>









<div className="flex justify-end items-center gap-5">


{
saved &&

<span className="text-green-600 font-semibold">
Settings Saved Successfully
</span>

}



<button

onClick={handleSave}

className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"

>

Save Changes

</button>



</div>






</div>


</div>
);

}