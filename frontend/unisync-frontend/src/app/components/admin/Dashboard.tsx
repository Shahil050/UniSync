"use client";

import {
  Users,
  FolderKanban,
  FileText,
  MessageCircle,
  FileSignature,
  RefreshCcw,
} from "lucide-react";

import { useState } from "react";
import StatCard from "./StatCard";


interface DashboardData {
  totalUsers:number;
  projects:number;
  researchPapers:number;
  messages:number;
  agreements:number;
}



export default function Dashboard() {


  const [loading,setLoading] = useState(false);



  const [data,setData] = useState<DashboardData>({
    totalUsers:128,
    projects:35,
    researchPapers:82,
    messages:247,
    agreements:21,
  });



  const [activities,setActivities] = useState([
    "New user registered",
    "AI paper recommendation generated",
    "New collaboration agreement signed",
    "Research project created",
    "One post reported for moderation"
  ]);



  const [systemStatus,setSystemStatus] = useState([
    {
      name:"Server Status",
      value:"Online"
    },
    {
      name:"Database",
      value:"Connected"
    },
    {
      name:"AI Recommendation",
      value:"Running"
    },
    {
      name:"Content Moderation",
      value:"Active"
    }
  ]);





  // simulate dashboard refresh
  const refreshDashboard = ()=>{


    setLoading(true);


    setTimeout(()=>{


      setData({

        totalUsers:
        Math.floor(Math.random()*100)+100,

        projects:
        Math.floor(Math.random()*50)+20,

        researchPapers:
        Math.floor(Math.random()*100)+50,

        messages:
        Math.floor(Math.random()*300)+100,

        agreements:
        Math.floor(Math.random()*40)+10,

      });



      setActivities([
        "New student joined UniSync",
        "Research paper uploaded",
        "New project collaboration created",
        "Agreement request approved",
        "Post moderation completed"
      ]);



      setLoading(false);


    },1000);


  };




  return (

    <div>



      <div className="mb-8 flex justify-between items-center">


        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Admin Dashboard
          </h1>


          <p className="text-slate-500 mt-2">
            Welcome to UniSync Administration Panel
          </p>


        </div>



        <button

        onClick={refreshDashboard}

        className="
        flex
        items-center
        gap-2
        bg-blue-600
        text-white
        px-4
        py-2
        rounded-lg
        hover:bg-blue-700
        "

        >

          <RefreshCcw size={18}/>

          {
            loading
            ?
            "Loading..."
            :
            "Refresh"
          }


        </button>



      </div>







      <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-4
      gap-6
      ">


        <StatCard
          title="Total Users"
          value={data.totalUsers}
          icon={<Users size={28}/>}
          color="bg-blue-100 text-blue-700"
        />


        <StatCard
          title="Projects"
          value={data.projects}
          icon={<FolderKanban size={28}/>}
          color="bg-green-100 text-green-700"
        />


        <StatCard
          title="Research Papers"
          value={data.researchPapers}
          icon={<FileText size={28}/>}
          color="bg-purple-100 text-purple-700"
        />


        <StatCard
          title="Messages"
          value={data.messages}
          icon={<MessageCircle size={28}/>}
          color="bg-cyan-100 text-cyan-700"
        />

        <StatCard
          title="Agreements"
          value={data.agreements}
          icon={<FileSignature size={28}/>}
          color="bg-indigo-100 text-indigo-700"
        />


      </div>








      <div className="
      grid
      lg:grid-cols-2
      gap-6
      mt-8
      ">



        {/* Activities */}


        <div className="
        bg-white
        rounded-2xl
        border
        shadow-sm
        p-6
        ">


          <h2 className="text-xl font-semibold mb-5">
            Recent Activities
          </h2>



          <div className="space-y-4">


          {
            activities.map((activity,index)=>(

              <div
              key={index}
              className="
              border-b
              pb-3
              "
              >

                {activity}

              </div>


            ))
          }


          </div>


        </div>






        {/* System Status */}


        <div className="
        bg-white
        rounded-2xl
        border
        shadow-sm
        p-6
        ">


          <h2 className="text-xl font-semibold mb-5">
            System Status
          </h2>



          <div className="space-y-5">


          {
            systemStatus.map((item,index)=>(

              <div
              key={index}
              className="
              flex
              justify-between
              "
              >

                <span>
                  {item.name}
                </span>


                <span
                className="
                text-green-600
                font-semibold
                "
                >

                  {item.value}

                </span>


              </div>

            ))
          }



          </div>


        </div>





      </div>




    </div>

  );
}