"use client";

import { useState } from "react";


interface Report {

  id:string;
  reportedBy:string;
  type:string;
  reason:string;
  status:"Pending" | "Resolved";
  date:string;

}



export default function Reports() {



const [reports,setReports]=useState<Report[]>([

{
id:"REP-001",
reportedBy:"Aarav Sharma",
type:"Message",
reason:"Spam Content",
status:"Pending",
date:"2026-08-01"
},


{
id:"REP-002",
reportedBy:"Sita KC",
type:"Research Paper",
reason:"Duplicate Upload",
status:"Resolved",
date:"2026-07-30"
}

]);





const [search,setSearch]=useState("");

const [type,setType]=useState("");

const [status,setStatus]=useState("");

const [date,setDate]=useState("");







// Resolve Single Report

const handleResolve=(id:string)=>{


setReports(prev=>

prev.map(item=>

item.id===id

?

{
...item,
status:"Resolved"
}

:

item

)

);


};








// Resolve All

const handleResolveAll=()=>{


setReports(prev=>

prev.map(item=>

({
...item,
status:"Resolved"
})

)

);


};









// View Report

const handleView=(item:Report)=>{


alert(
`Report ID: ${item.id}

Reported By: ${item.reportedBy}

Type: ${item.type}

Reason: ${item.reason}

Status: ${item.status}`
);


};







const filteredReports=reports.filter(item=>{


return (

item.id
.toLowerCase()
.includes(search.toLowerCase())

||

item.reportedBy
.toLowerCase()
.includes(search.toLowerCase())



&&



(type==="" || item.type===type)



&&



(status==="" || item.status===status)



&&



(date==="" || item.date===date)

);


});








return (
<div>



<div className="flex justify-between items-center mb-6">


<div>

<h2 className="text-3xl font-bold text-slate-800">
Reports Management
</h2>


<p className="text-slate-500 mt-1">
Review reported users, posts and messages.
</p>


</div>




<button

onClick={handleResolveAll}

className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"

>

Resolve All

</button>



</div>







<div className="bg-white rounded-xl border shadow-sm p-5 mb-6">


<div className="grid md:grid-cols-4 gap-4">



<input

type="text"

placeholder="Search Report..."

value={search}

onChange={
e=>setSearch(e.target.value)
}

className="border rounded-lg px-4 py-2"

/>







<select

value={type}

onChange={
e=>setType(e.target.value)
}

className="border rounded-lg px-4 py-2"

>


<option value="">
Report Type
</option>

<option>
User
</option>

<option>
Post
</option>

<option>
Message
</option>

<option>
Research Paper
</option>


</select>








<select

value={status}

onChange={
e=>setStatus(e.target.value)
}

className="border rounded-lg px-4 py-2"

>


<option value="">
Status
</option>


<option>
Pending
</option>


<option>
Resolved
</option>



</select>







<input

type="date"

value={date}

onChange={
e=>setDate(e.target.value)
}

className="border rounded-lg px-4 py-2"

/>





</div>


</div>









<div className="bg-white rounded-xl border shadow-sm overflow-hidden">


<table className="w-full">


<thead className="bg-slate-100">


<tr>


<th className="p-4 text-left">
Report ID
</th>


<th>
Reported By
</th>


<th>
Type
</th>


<th>
Reason
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

filteredReports.length===0

?

<tr>

<td
colSpan={6}
className="p-5 text-center text-gray-500"
>

No Reports Found

</td>

</tr>



:


filteredReports.map(item=>(


<tr

key={item.id}

className="border-t"

>


<td className="p-4">
{item.id}
</td>



<td>
{item.reportedBy}
</td>



<td>
{item.type}
</td>



<td>
{item.reason}
</td>




<td>


<span

className={

item.status==="Pending"

?

"bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"

:

"bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"

}

>

{item.status}

</span>


</td>







<td>


<button

onClick={()=>
handleView(item)
}

className="text-blue-600 mr-3"

>

View

</button>





{
item.status==="Pending" &&

<button

onClick={()=>
handleResolve(item.id)
}

className="text-green-600"

>

Resolve

</button>

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