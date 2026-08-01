"use client";

import { FolderKanban } from "lucide-react";
import { useState } from "react";


interface Project {

  id:string;
  name:string;
  leader:string;
  members:number;
  category:string;
  status:"Open"|"Ongoing"|"Completed";
  deadline:string;

}




export default function Projects() {


const [projects,setProjects]=useState<Project[]>([

{
id:"PROJ-001",
name:"AI Study Partner Recommendation",
leader:"Aarav Sharma",
members:5,
category:"Artificial Intelligence",
status:"Ongoing",
deadline:"2026-08-15"
},


{
id:"PROJ-002",
name:"Smart Attendance System",
leader:"Sita KC",
members:4,
category:"Machine Learning",
status:"Completed",
deadline:"2026-07-10"
},


{
id:"PROJ-003",
name:"Secure Cloud Storage",
leader:"Rohan Thapa",
members:6,
category:"Cloud Computing",
status:"Open",
deadline:"2026-08-30"
}

]);



const [showForm,setShowForm]=useState(false);

const [editId,setEditId]=useState<string|null>(null);



const [search,setSearch]=useState("");

const [category,setCategory]=useState("");

const [status,setStatus]=useState("");

const [date,setDate]=useState("");





const [project,setProject]=useState({

name:"",
leader:"",
members:0,
category:"Artificial Intelligence",
status:"Open",
deadline:""

});








// Save Project

const handleSave=()=>{


if(!project.name || !project.leader){

alert("Fill all fields");

return;

}



if(editId){


setProjects(prev=>

prev.map(item=>

item.id===editId

?

{
...item,
...project,
members:Number(project.members)
}

:

item

)

);



}

else{


setProjects(prev=>[

...prev,

{

id:`PROJ-00${prev.length+1}`,

...project,

members:Number(project.members)

}

]);


}



setProject({

name:"",
leader:"",
members:0,
category:"Artificial Intelligence",
status:"Open",
deadline:""

});


setEditId(null);

setShowForm(false);


};







// Edit

const handleEdit=(item:Project)=>{


setProject({

name:item.name,

leader:item.leader,

members:item.members,

category:item.category,

status:item.status,

deadline:item.deadline

});


setEditId(item.id);

setShowForm(true);


};








// Delete

const handleDelete=(id:string)=>{


const confirmDelete=window.confirm(
"Delete this project?"
);


if(confirmDelete){

setProjects(prev=>

prev.filter(
item=>item.id!==id
)

);

}


};









const filteredProjects=projects.filter(item=>{


return (

item.name
.toLowerCase()
.includes(search.toLowerCase())

&&

(category==="" || item.category===category)

&&

(status==="" || item.status===status)

&&

(date==="" || item.deadline===date)

);


});







return (
<div>



<div className="flex justify-between items-center mb-6">


<div>

<h2 className="text-3xl font-bold text-slate-800">
Project Management
</h2>


<p className="text-slate-500 mt-1">
Manage all research and collaboration projects.
</p>


</div>



<button

onClick={()=>setShowForm(true)}

className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"

>

+ Add Project

</button>


</div>







{
showForm &&

<div className="bg-white rounded-xl border shadow-sm p-5 mb-6">


<div className="grid md:grid-cols-6 gap-3">


<input

placeholder="Project Name"

className="border rounded-lg px-3 py-2"

value={project.name}

onChange={e=>setProject({
...project,
name:e.target.value
})}

/>



<input

placeholder="Leader"

className="border rounded-lg px-3 py-2"

value={project.leader}

onChange={e=>setProject({
...project,
leader:e.target.value
})}

/>



<input

type="number"

placeholder="Members"

className="border rounded-lg px-3 py-2"

value={project.members}

onChange={e=>setProject({
...project,
members:Number(e.target.value)
})}

/>




<select

className="border rounded-lg px-3 py-2"

value={project.category}

onChange={e=>setProject({
...project,
category:e.target.value
})}

>


<option>Artificial Intelligence</option>

<option>Machine Learning</option>

<option>Cyber Security</option>

<option>Web Development</option>

<option>Cloud Computing</option>


</select>






<select

className="border rounded-lg px-3 py-2"

value={project.status}

onChange={e=>setProject({
...project,
status:e.target.value as any
})}

>


<option>Open</option>

<option>Ongoing</option>

<option>Completed</option>


</select>






<input

type="date"

className="border rounded-lg px-3 py-2"

value={project.deadline}

onChange={e=>setProject({
...project,
deadline:e.target.value
})}

/>



<button

onClick={handleSave}

className="bg-green-600 text-white rounded-lg"

>

Save

</button>



</div>


</div>

}








<div className="bg-white rounded-xl border shadow-sm p-5 mb-6">


<div className="grid md:grid-cols-4 gap-4">


<input

placeholder="Search Project..."

className="border rounded-lg px-4 py-2"

value={search}

onChange={e=>setSearch(e.target.value)}

/>



<select

className="border rounded-lg px-4 py-2"

onChange={e=>setCategory(e.target.value)}

>

<option value="">
All Categories
</option>

<option>Artificial Intelligence</option>

<option>Machine Learning</option>

<option>Cyber Security</option>

<option>Web Development</option>

<option>Cloud Computing</option>

</select>





<select

className="border rounded-lg px-4 py-2"

onChange={e=>setStatus(e.target.value)}

>

<option value="">
All Status
</option>

<option>Open</option>

<option>Ongoing</option>

<option>Completed</option>


</select>





<input

type="date"

className="border rounded-lg px-4 py-2"

onChange={e=>setDate(e.target.value)}

/>


</div>

</div>









<div className="bg-white rounded-xl border shadow-sm overflow-hidden">


<table className="w-full">


<thead className="bg-slate-100">


<tr>

<th className="p-4 text-left">
Project
</th>

<th>
Leader
</th>

<th>
Members
</th>

<th>
Category
</th>

<th>
Status
</th>

<th>
Deadline
</th>

<th>
Action
</th>


</tr>

</thead>







<tbody>


{
filteredProjects.map(item=>(


<tr key={item.id}
className="border-t hover:bg-slate-50">


<td className="p-4">


<div className="flex items-center gap-3">


<div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center">


<FolderKanban
className="text-blue-600"
size={22}
/>


</div>



<div>

<p className="font-semibold">
{item.name}
</p>

<p className="text-sm text-slate-500">
Project ID : {item.id}
</p>


</div>


</div>


</td>



<td>{item.leader}</td>

<td>{item.members}</td>

<td>{item.category}</td>


<td>

<span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">

{item.status}

</span>

</td>


<td>{item.deadline}</td>


<td>


<button

onClick={()=>handleEdit(item)}

className="text-blue-600 mr-3 hover:underline"

>

Edit

</button>




<button

onClick={()=>handleDelete(item.id)}

className="text-red-600 hover:underline"

>

Delete

</button>


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