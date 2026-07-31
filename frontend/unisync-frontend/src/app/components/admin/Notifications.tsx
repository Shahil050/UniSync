"use client";

import { useState } from "react";


interface Notification {

  id:number;
  title:string;
  recipient:string;
  date:string;
  status:"Sent" | "Scheduled";

}



export default function Notifications() {


  const [notifications,setNotifications] = useState<Notification[]>([
    {
      id:1,
      title:"Research Submission Deadline",
      recipient:"All Users",
      date:"01 Aug 2026",
      status:"Sent"
    },
    {
      id:2,
      title:"New AI Recommendation Available",
      recipient:"Researchers",
      date:"30 Jul 2026",
      status:"Scheduled"
    }
  ]);





  const [showForm,setShowForm]=useState(false);


  const [editId,setEditId]=useState<number | null>(null);




  const [notification,setNotification]=useState({

    title:"",
    recipient:"All Users"

  });







  // Send / Update Notification

  const handleSend=()=>{


    if(notification.title===""){

      alert("Enter notification title");

      return;

    }




    if(editId!==null){


      setNotifications((prev)=>

        prev.map(item=>

          item.id===editId

          ?

          {
            ...item,
            title:notification.title,
            recipient:notification.recipient
          }

          :

          item

        )

      );


    }


    else{


      const newNotification:Notification={

        id:Date.now(),

        title:notification.title,

        recipient:notification.recipient,

        date:new Date()
        .toLocaleDateString(),

        status:"Sent"

      };



      setNotifications((prev)=>[
        ...prev,
        newNotification
      ]);

    }




    setNotification({

      title:"",

      recipient:"All Users"

    });


    setEditId(null);

    setShowForm(false);


  };







  // View Notification

  const handleView=(item:Notification)=>{


    alert(
`Title: ${item.title}

Recipient: ${item.recipient}

Date: ${item.date}

Status: ${item.status}`
    );


  };








  // Edit Notification

  const handleEdit=(item:Notification)=>{


    setNotification({

      title:item.title,

      recipient:item.recipient

    });


    setEditId(item.id);

    setShowForm(true);


  };







  // Delete Notification

  const handleDelete=(id:number)=>{


    const confirmDelete=window.confirm(
      "Delete notification?"
    );


    if(confirmDelete){


      setNotifications((prev)=>

        prev.filter(
          item=>item.id!==id
        )

      );


    }


  };







  return (
    <div>



      <div className="flex justify-between items-center mb-6">


        <div>

          <h2 className="text-3xl font-bold text-slate-800">
            Notifications
          </h2>


          <p className="text-slate-500 mt-1">
            Send and manage system notifications.
          </p>


        </div>




        <button

        onClick={()=>setShowForm(true)}

        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >

          + New Notification

        </button>



      </div>







      {
        showForm && (


        <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">


          <div className="grid md:grid-cols-3 gap-4">



            <input

            type="text"

            placeholder="Notification Title..."

            value={notification.title}

            onChange={
              e=>setNotification({
                ...notification,
                title:e.target.value
              })
            }

            className="border rounded-lg px-4 py-2"

            />





            <select

            value={notification.recipient}

            onChange={
              e=>setNotification({
                ...notification,
                recipient:e.target.value
              })
            }

            className="border rounded-lg px-4 py-2">


              <option>
                All Users
              </option>

              <option>
                Students
              </option>

              <option>
                Researchers
              </option>


            </select>






            <button

            onClick={handleSend}

            className="bg-green-600 text-white rounded-lg"

            >

              Send Notification

            </button>



          </div>



        </div>


        )
      }








      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">


        <table className="w-full">


          <thead className="bg-slate-100">


            <tr>


              <th className="p-4 text-left">
                Title
              </th>


              <th>
                Recipient
              </th>


              <th>
                Date
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
            notifications.map((item)=>(


            <tr
            key={item.id}
            className="border-t"
            >



              <td className="p-4">
                {item.title}
              </td>



              <td>
                {item.recipient}
              </td>




              <td>
                {item.date}
              </td>




              <td>


                <span

                className={

                  item.status==="Sent"

                  ?

                  "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"

                  :

                  "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"

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
                  item.status==="Scheduled" && (

                  <button

                  onClick={()=>
                    handleEdit(item)
                  }

                  className="text-blue-600 mr-3"

                  >

                    Edit

                  </button>

                  )

                }







                <button

                onClick={()=>
                  handleDelete(item.id)
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