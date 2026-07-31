"use client";

import { useState } from "react";

interface Agreement {
  id: string;
  project: string;
  members: string;
  status: "Signed" | "Pending";
  created: string;
}

export default function Agreements() {

  const [agreements, setAgreements] = useState<Agreement[]>([
    {
      id: "AGR-001",
      project: "AI Study Partner",
      members: "5 Members",
      status: "Signed",
      created: "01 Aug 2026",
    },
    {
      id: "AGR-002",
      project: "Cloud Storage",
      members: "4 Members",
      status: "Pending",
      created: "30 Jul 2026",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [newAgreement, setNewAgreement] = useState({
    project: "",
    members: "",
  });


  // Create Agreement
  const handleCreate = () => {

    if (!newAgreement.project || !newAgreement.members) {
      alert("Please fill all fields");
      return;
    }

    const agreement: Agreement = {
      id: `AGR-00${agreements.length + 1}`,
      project: newAgreement.project,
      members: newAgreement.members,
      status: "Pending",
      created: new Date().toLocaleDateString(),
    };


    setAgreements([
      ...agreements,
      agreement
    ]);

    setNewAgreement({
      project: "",
      members: "",
    });

    setShowForm(false);
  };


  // Delete Agreement
  const handleDelete = (id: string) => {

    const confirmDelete = confirm(
      "Are you sure you want to delete this agreement?"
    );

    if(confirmDelete){
      setAgreements(
        agreements.filter(
          (agreement)=> agreement.id !== id
        )
      );
    }

  };


  // View Agreement
  const handleView = (agreement: Agreement) => {

    alert(
      `
Agreement ID: ${agreement.id}
Project: ${agreement.project}
Members: ${agreement.members}
Status: ${agreement.status}
Created: ${agreement.created}
      `
    );

  };


  return (
    <div>


      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Digital Agreements
          </h2>

          <p className="text-slate-500 mt-1">
            Manage research collaboration agreements.
          </p>
        </div>


        <button
          onClick={()=>setShowForm(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Agreement
        </button>

      </div>



      {
        showForm && (

          <div className="bg-white border rounded-xl p-5 mb-6 shadow">

            <input
              className="border p-2 rounded mr-3"
              placeholder="Project name"
              value={newAgreement.project}
              onChange={
                e=>setNewAgreement({
                  ...newAgreement,
                  project:e.target.value
                })
              }
            />


            <input
              className="border p-2 rounded mr-3"
              placeholder="Members"
              value={newAgreement.members}
              onChange={
                e=>setNewAgreement({
                  ...newAgreement,
                  members:e.target.value
                })
              }
            />


            <button
              onClick={handleCreate}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>


          </div>

        )
      }




      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">


        <table className="w-full">


          <thead className="bg-slate-100">

            <tr>
              <th className="p-4 text-left">
                Agreement ID
              </th>

              <th>
                Project
              </th>

              <th>
                Members
              </th>

              <th>
                Status
              </th>

              <th>
                Created
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>



          <tbody>


          {
            agreements.map((agreement)=>(

              <tr 
                key={agreement.id}
                className="border-t"
              >

                <td className="p-4">
                  {agreement.id}
                </td>


                <td>
                  {agreement.project}
                </td>


                <td>
                  {agreement.members}
                </td>


                <td>

                  <span
                    className={
                      agreement.status==="Signed"
                      ?
                      "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                      :
                      "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
                    }
                  >
                    {agreement.status}
                  </span>

                </td>


                <td>
                  {agreement.created}
                </td>


                <td>

                  <button
                    onClick={()=>handleView(agreement)}
                    className="text-blue-600 mr-3"
                  >
                    View
                  </button>


                  <button
                    onClick={()=>handleDelete(agreement.id)}
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