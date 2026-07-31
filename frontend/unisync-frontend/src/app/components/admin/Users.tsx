"use client";

import { useState } from "react";


interface User {

  id:number;
  name:string;
  email:string;
  department:string;
  role:"Student" | "Researcher" | "Admin";
  status:"Active" | "Inactive";

}



export default function UsersPage() {



const [users,setUsers]=useState<User[]>([


{
id:1,
name:"Aarav Sharma",
email:"aarav@gmail.com",
department:"Computer Engineering",
role:"Student",
status:"Active"
},


{
id:2,
name:"Sita KC",
email:"sita@gmail.com",
department:"IT",
role:"Researcher",
status:"Active"
}



]);





const [search,setSearch]=useState("");

const [department,setDepartment]=useState("");

const [role,setRole]=useState("");

const [status,setStatus]=useState("");







// Add User

const handleAddUser=()=>{


const newUser:User={

id:users.length+1,

name:"New User",

email:"newuser@gmail.com",

department:"Computer Engineering",

role:"Student",

status:"Active"

};



setUsers([
...users,
newUser
]);


};









// Edit User

const handleEdit=(id:number)=>{


const updatedName=prompt(
"Enter new user name"
);


if(updatedName){


setUsers(prev=>

prev.map(user=>

user.id===id

?

{
...user,
name:updatedName
}

:

user

)

);


}


};









// Delete User

const handleDelete=(id:number)=>{


const confirmDelete=confirm(
"Delete this user?"
);



if(confirmDelete){


setUsers(prev=>

prev.filter(
user=>user.id!==id
)

);


}



};









const filteredUsers=users.filter(user=>{


return (


user.name
.toLowerCase()
.includes(search.toLowerCase())



&&



(department==="" || user.department===department)



&&



(role==="" || user.role===role)



&&



(status==="" || user.status===status)



);


});










return (

<div>



<div className="flex justify-between items-center mb-6">


<div>

<h2 className="text-3xl font-bold text-slate-800">
User Management
</h2>


<p className="text-slate-500 mt-1">
Manage all registered users
</p>


</div>





<button

onClick={handleAddUser}

className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"

>

+ Add User

</button>



</div>








<div className="bg-white rounded-xl border shadow-sm p-5 mb-6">


<div className="grid md:grid-cols-4 gap-4">



<input

type="text"

placeholder="Search user..."

value={search}

onChange={
e=>setSearch(e.target.value)
}

className="border rounded-lg px-4 py-2"

/>








<select

value={department}

onChange={
e=>setDepartment(e.target.value)
}

className="border rounded-lg px-4 py-2"

>


<option value="">
All Departments
</option>

<option>
Computer Engineering
</option>

<option>
IT
</option>

<option>
Software Engineering
</option>


</select>








<select

value={role}

onChange={
e=>setRole(e.target.value)
}

className="border rounded-lg px-4 py-2"

>


<option value="">
All Roles
</option>

<option>
Student
</option>

<option>
Researcher
</option>

<option>
Admin
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
Active
</option>


<option>
Inactive
</option>



</select>






</div>


</div>









<div className="bg-white rounded-xl border shadow-sm overflow-hidden">


<table className="w-full">


<thead className="bg-slate-100">


<tr>


<th className="p-4 text-left">
Name
</th>


<th>
Email
</th>


<th>
Department
</th>


<th>
Role
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
filteredUsers.length===0

?


<tr>

<td
colSpan={6}
className="p-5 text-center"
>

No users found

</td>

</tr>


:



filteredUsers.map(user=>(


<tr

key={user.id}

className="border-t"

>


<td className="p-4">
{user.name}
</td>



<td>
{user.email}
</td>



<td>
{user.department}
</td>



<td>
{user.role}
</td>




<td>


<span

className={
user.status==="Active"

?

"text-green-600 font-semibold"

:

"text-red-600 font-semibold"

}

>

{user.status}

</span>


</td>







<td>


<button

onClick={()=>handleEdit(user.id)}

className="text-blue-600 mr-3"

>

Edit

</button>





<button

onClick={()=>handleDelete(user.id)}

className="text-red-600"

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