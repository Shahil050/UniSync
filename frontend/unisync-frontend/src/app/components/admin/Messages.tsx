"use client";

import { useState } from "react";

interface Message {
  sender: string;
  receiver: string;
  message: string;
  date: string;
  status: "Delivered" | "Read" | "Reported";
}


export default function Messages() {


  const [messages,setMessages] = useState<Message[]>([
    {
      sender:"Aarav Sharma",
      receiver:"Sita KC",
      message:"Let's work together on AI project.",
      date:"2026-08-01",
      status:"Delivered"
    },
    {
      sender:"Rohan Thapa",
      receiver:"Pratik Sharma",
      message:"Can you join our research group?",
      date:"2026-07-31",
      status:"Read"
    }
  ]);



  const [search,setSearch] = useState("");

  const [date,setDate] = useState("");

  const [status,setStatus] = useState("");






  // View Message

  const handleView=(item:Message)=>{

    alert(
`Sender: ${item.sender}

Receiver: ${item.receiver}

Message: ${item.message}

Date: ${item.date}

Status: ${item.status}`
    );

  };






  // Delete Message

  const handleDelete=(index:number)=>{


    const confirmDelete=window.confirm(
      "Delete this message?"
    );


    if(confirmDelete){

      setMessages(
        messages.filter(
          (_,i)=>i!==index
        )
      );

    }


  };







  // Export CSV

  const handleExport=()=>{


    const csvData = [
      [
        "Sender",
        "Receiver",
        "Message",
        "Date",
        "Status"
      ],

      ...messages.map(item=>[
        item.sender,
        item.receiver,
        item.message,
        item.date,
        item.status
      ])

    ];



    const csv = csvData
    .map(row=>row.join(","))
    .join("\n");



    const blob = new Blob(
      [csv],
      {
        type:"text/csv"
      }
    );



    const url = URL.createObjectURL(blob);



    const link=document.createElement("a");

    link.href=url;

    link.download="messages.csv";

    link.click();



  };







  const filteredMessages = messages.filter((item)=>{


    return (

      item.sender
      .toLowerCase()
      .includes(search.toLowerCase())

      &&

      (date==="" || item.date===date)

      &&

      (status==="" || item.status===status)

    );


  });







  return (
    <div>



      <div className="flex justify-between items-center mb-6">


        <div>

          <h2 className="text-3xl font-bold text-slate-800">
            Messages Management
          </h2>


          <p className="text-slate-500 mt-1">
            Monitor conversations between users.
          </p>


        </div>



        <button

        onClick={handleExport}

        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >

          Export Messages

        </button>


      </div>







      <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">


        <div className="grid md:grid-cols-3 gap-4">


          <input

            type="text"

            placeholder="Search User..."

            value={search}

            onChange={
              e=>setSearch(e.target.value)
            }

            className="border rounded-lg px-4 py-2"

          />




          <input

            type="date"

            value={date}

            onChange={
              e=>setDate(e.target.value)
            }

            className="border rounded-lg px-4 py-2"

          />




          <select

          value={status}

          onChange={
            e=>setStatus(e.target.value)
          }

          className="border rounded-lg px-4 py-2">


            <option value="">
              All Status
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Read">
              Read
            </option>

            <option value="Reported">
              Reported
            </option>


          </select>


        </div>


      </div>







      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">


        <table className="w-full">


          <thead className="bg-slate-100">


            <tr>

              <th className="p-4 text-left">
                Sender
              </th>

              <th>
                Receiver
              </th>

              <th>
                Message
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
            filteredMessages.map((item,index)=>(


            <tr
            key={index}
            className="border-t"
            >



              <td className="p-4">
                {item.sender}
              </td>



              <td>
                {item.receiver}
              </td>




              <td>
                {item.message}
              </td>




              <td>
                {item.date}
              </td>




              <td>


                <span

                className={
                  
                  item.status==="Delivered"

                  ?

                  "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"

                  :

                  item.status==="Read"

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


                <button

                onClick={()=>
                  handleView(item)
                }

                className="text-blue-600 mr-3"

                >

                  View

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