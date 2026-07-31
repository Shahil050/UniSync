"use client";

import { useState } from "react";

interface Group {
  name: string;
  leader: string;
  members: number;
  area: string;
  status: "Active" | "Completed";
}


export default function Groups() {


  const [groups,setGroups] = useState<Group[]>([
    {
      name:"AI Innovators",
      leader:"Aarav Sharma",
      members:5,
      area:"Artificial Intelligence",
      status:"Active"
    },
    {
      name:"Cloud Masters",
      leader:"Sita KC",
      members:4,
      area:"Cloud Computing",
      status:"Active"
    }
  ]);



  const [showForm,setShowForm] = useState(false);


  const [editIndex,setEditIndex] = useState<number | null>(null);



  const [search,setSearch] = useState("");

  const [areaFilter,setAreaFilter] = useState("");

  const [statusFilter,setStatusFilter] = useState("");



  const [group,setGroup] = useState<Group>({
    name:"",
    leader:"",
    members:0,
    area:"Artificial Intelligence",
    status:"Active"
  });





  // Create / Update

  const handleSave = ()=>{


    if(!group.name || !group.leader){

      alert("Fill all fields");
      return;

    }



    if(editIndex !== null){


      const updated=[...groups];

      updated[editIndex]=group;

      setGroups(updated);


    }
    else{


      setGroups([
        ...groups,
        group
      ]);


    }



    setGroup({
      name:"",
      leader:"",
      members:0,
      area:"Artificial Intelligence",
      status:"Active"
    });


    setEditIndex(null);

    setShowForm(false);


  };






  // Edit

  const handleEdit=(item:Group,index:number)=>{


    setGroup(item);

    setEditIndex(index);

    setShowForm(true);


  };





  // Delete

  const handleDelete=(index:number)=>{


    const confirmDelete=window.confirm(
      "Delete this group?"
    );


    if(confirmDelete){

      setGroups(
        groups.filter(
          (_,i)=>i!==index
        )
      );

    }


  };





  const filteredGroups=groups.filter((item)=>{


    return (

      item.name
      .toLowerCase()
      .includes(search.toLowerCase())

      &&

      (areaFilter==="" || item.area===areaFilter)

      &&

      (statusFilter==="" || item.status===statusFilter)

    );


  });






  return (
    <div>


      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Research Groups
          </h2>

          <p className="text-slate-500 mt-1">
            Manage research collaboration groups.
          </p>
        </div>


        <button
          onClick={()=>setShowForm(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Group
        </button>

      </div>





      {
        showForm && (

        <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">

          <div className="grid md:grid-cols-5 gap-3">


          <input
          className="border rounded-lg px-4 py-2"
          placeholder="Group Name"
          value={group.name}
          onChange={
            e=>setGroup({
              ...group,
              name:e.target.value
            })
          }
          />


          <input
          className="border rounded-lg px-4 py-2"
          placeholder="Leader"
          value={group.leader}
          onChange={
            e=>setGroup({
              ...group,
              leader:e.target.value
            })
          }
          />


          <input
          type="number"
          className="border rounded-lg px-4 py-2"
          placeholder="Members"
          value={group.members}
          onChange={
            e=>setGroup({
              ...group,
              members:Number(e.target.value)
            })
          }
          />



          <button
          onClick={handleSave}
          className="bg-green-600 text-white rounded-lg"
          >
            Save
          </button>



          <button
          onClick={()=>setShowForm(false)}
          className="bg-gray-300 rounded-lg"
          >
            Cancel
          </button>


          </div>


        </div>

        )
      }







      <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">

        <div className="grid md:grid-cols-3 gap-4">


          <input
            type="text"
            placeholder="Search Group..."
            value={search}
            onChange={
              e=>setSearch(e.target.value)
            }
            className="border rounded-lg px-4 py-2"
          />



          <select
          value={areaFilter}
          onChange={
            e=>setAreaFilter(e.target.value)
          }
          className="border rounded-lg px-4 py-2">

            <option value="">
              Research Area
            </option>

            <option>
              Artificial Intelligence
            </option>

            <option>
              Machine Learning
            </option>

            <option>
              Cyber Security
            </option>

            <option>
              Cloud Computing
            </option>

          </select>




          <select
          value={statusFilter}
          onChange={
            e=>setStatusFilter(e.target.value)
          }
          className="border rounded-lg px-4 py-2">


            <option value="">
              Status
            </option>

            <option>
              Active
            </option>

            <option>
              Completed
            </option>


          </select>


        </div>

      </div>







      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">


        <table className="w-full">


          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                Group Name
              </th>

              <th>
                Leader
              </th>

              <th>
                Members
              </th>

              <th>
                Research Area
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
            filteredGroups.map((item,index)=>(


            <tr key={index} className="border-t">


              <td className="p-4">
                {item.name}
              </td>


              <td>
                {item.leader}
              </td>


              <td>
                {item.members}
              </td>


              <td>
                {item.area}
              </td>


              <td>

                <span className="text-green-600 font-semibold">
                  {item.status}
                </span>

              </td>


              <td>


                <button
                onClick={()=>
                  handleEdit(item,index)
                }
                className="text-blue-600 mr-3"
                >
                  Edit
                </button>



                <button
                onClick={()=>
                  handleDelete(index)
                }
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