"use client";

import { useState } from "react";


interface Recommendation {

  id:number;
  user:string;
  collaborator:string;
  paper:string;
  score:number;
  status:"Accepted" | "Pending" | "Rejected";

}



export default function Recommendations() {


const [loading,setLoading]=useState(false);



const [stats,setStats]=useState({

today:245,
score:92,
mrr:"0.667",
models:2

});





const [recommendations,setRecommendations]=useState<Recommendation[]>([

{
id:1,
user:"Aarav Sharma",
collaborator:"Sita KC",
paper:"Deep Learning in Healthcare",
score:95,
status:"Accepted"
},


{
id:2,
user:"Rohan Thapa",
collaborator:"Pratik Sharma",
paper:"Cloud Security Survey",
score:90,
status:"Pending"
}

]);







// Refresh AI Recommendations

const refreshRecommendations=()=>{


setLoading(true);



setTimeout(()=>{


setStats({

today:Math.floor(Math.random()*100)+200,

score:Math.floor(Math.random()*10)+90,

mrr:(Math.random()*0.3+0.6).toFixed(3),

models:2

});



setRecommendations(prev=>

prev.map(item=>

item.status==="Pending"

?

{
...item,
score:Math.floor(Math.random()*10)+90
}

:

item

)

);



setLoading(false);



},1000);



};









// Accept Recommendation

const handleAccept=(id:number)=>{


setRecommendations(prev=>

prev.map(item=>

item.id===id

?

{
...item,
status:"Accepted"
}

:

item

)

);


};








// Reject Recommendation

const handleReject=(id:number)=>{


setRecommendations(prev=>

prev.map(item=>

item.id===id

?

{
...item,
status:"Rejected"
}

:

item

)

);


};







return (
<div>




<div className="flex justify-between items-center mb-6">


<div>

<h2 className="text-3xl font-bold text-slate-800">
AI Recommendation Engine
</h2>


<p className="text-slate-500 mt-1">
Monitor AI-generated collaborator and research paper recommendations.
</p>


</div>




<button

onClick={refreshRecommendations}

className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"

>


{
loading
?
"Refreshing..."
:
"Refresh Recommendations"
}


</button>



</div>







<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">



<div className="bg-white border rounded-xl p-5 shadow-sm">

<h3 className="text-slate-500">
Recommendations Today
</h3>

<p className="text-3xl font-bold mt-2">
{stats.today}
</p>

</div>





<div className="bg-white border rounded-xl p-5 shadow-sm">

<h3 className="text-slate-500">
Average Match Score
</h3>

<p className="text-3xl font-bold mt-2">
{stats.score}%
</p>

</div>





<div className="bg-white border rounded-xl p-5 shadow-sm">

<h3 className="text-slate-500">
MRR Score
</h3>

<p className="text-3xl font-bold mt-2">
{stats.mrr}
</p>

</div>





<div className="bg-white border rounded-xl p-5 shadow-sm">

<h3 className="text-slate-500">
Active AI Models
</h3>

<p className="text-3xl font-bold mt-2">
{stats.models}
</p>

</div>



</div>









<div className="bg-white rounded-xl border shadow-sm overflow-hidden">


<table className="w-full">


<thead className="bg-slate-100">


<tr>


<th className="p-4 text-left">
User
</th>


<th>
Recommended Collaborator
</th>


<th>
Research Paper
</th>


<th>
Match Score
</th>


<th>
Status
</th>


<th>
Action
</th>


</tr>


</thead>






<tbody>


{
recommendations.map(item=>(


<tr
key={item.id}
className="border-t"
>



<td className="p-4">
{item.user}
</td>



<td>
{item.collaborator}
</td>




<td>
{item.paper}
</td>




<td className="font-semibold text-blue-600">

{item.score}%

</td>





<td>


<span

className={

item.status==="Accepted"

?

"bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"

:

item.status==="Pending"

?

"bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"

:

"bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"

}

>

{item.status}

</span>


</td>







<td>


{
item.status==="Pending" &&

<>

<button

onClick={()=>handleAccept(item.id)}

className="text-green-600 mr-3"

>

Accept

</button>



<button

onClick={()=>handleReject(item.id)}

className="text-red-600"

>

Reject

</button>

</>

}



</td>





</tr>


))

}




</tbody>



</table>


</div>




</div>
);

}