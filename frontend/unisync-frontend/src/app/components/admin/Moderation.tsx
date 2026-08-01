"use client";

import { useState } from "react";


interface Report {
  id:number;
  reportedBy:string;
  reason:string;
  status:"Pending" | "Approved";
}



export default function Moderation() {


  const [reports,setReports] = useState<Report[]>([
    {
      id:1,
      reportedBy:"Aarav",
      reason:"Spam",
      status:"Pending"
    }
  ]);






  // Approve Report

  const handleApprove=(id:number)=>{


    setReports((prev)=>

      prev.map((report)=>

        report.id===id

        ?

        {
          ...report,
          status:"Approved"
        }

        :

        report

      )

    );


  };







  // Remove Report

  const handleRemove=(id:number)=>{


    const confirmRemove = window.confirm(
      "Remove this reported content?"
    );


    if(confirmRemove){


      setReports((prev)=>

        prev.filter(
          report=>report.id!==id
        )

      );


    }


  };







  return (
    <div>


      <h2 className="text-2xl font-bold mb-6">
        Content Moderation
      </h2>





      <table className="w-full bg-white rounded-xl border">


        <thead className="bg-slate-100">


          <tr>

            <th className="p-3 text-left">
              Reported By
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
          reports.length===0 ? (

            <tr>

              <td
              colSpan={4}
              className="p-5 text-center text-gray-500"
              >

                No reports available

              </td>

            </tr>


          )

          :

          (

          reports.map((report)=>(


            <tr
            key={report.id}
            className="border-t"
            >


              <td className="p-3">
                {report.reportedBy}
              </td>



              <td>
                {report.reason}
              </td>




              <td>


                <span

                className={

                  report.status==="Approved"

                  ?

                  "text-green-600 font-semibold"

                  :

                  "text-orange-600 font-semibold"

                }

                >

                  {report.status}

                </span>


              </td>






              <td>


                {
                  report.status==="Pending" && (

                  <button

                  onClick={()=>
                    handleApprove(report.id)
                  }

                  className="text-green-600 mr-3"

                  >

                    Approve

                  </button>

                  )
                }






                <button

                onClick={()=>
                  handleRemove(report.id)
                }

                className="text-red-600"

                >

                  Remove

                </button>




              </td>



            </tr>


          ))

          )

        }



        </tbody>



      </table>



    </div>
  );
}