"use client";

import { useState } from "react";


interface Paper {

  id:number;
  title:string;
  author:string;
  category:string;
  year:string;

}



export default function Papers() {



  const [papers,setPapers] = useState<Paper[]>([
    {
      id:1,
      title:"Deep Learning for Healthcare",
      author:"John Smith",
      category:"AI",
      year:"2025"
    }
  ]);




  const [showForm,setShowForm] = useState(false);


  const [editId,setEditId] = useState<number | null>(null);




  const [paper,setPaper] = useState({

    title:"",
    author:"",
    category:"",
    year:""

  });







  // Add / Update Paper

  const handleSave=()=>{


    if(
      !paper.title ||
      !paper.author ||
      !paper.category ||
      !paper.year
    ){

      alert("Fill all fields");

      return;

    }




    if(editId!==null){


      setPapers((prev)=>

        prev.map(item=>

          item.id===editId

          ?

          {
            ...item,
            ...paper
          }

          :

          item

        )

      );


    }

    else{


      const newPaper:Paper={

        id:Date.now(),

        title:paper.title,

        author:paper.author,

        category:paper.category,

        year:paper.year

      };



      setPapers((prev)=>[
        ...prev,
        newPaper
      ]);


    }





    setPaper({

      title:"",

      author:"",

      category:"",

      year:""

    });


    setEditId(null);

    setShowForm(false);


  };








  // Edit Paper

  const handleEdit=(item:Paper)=>{


    setPaper({

      title:item.title,

      author:item.author,

      category:item.category,

      year:item.year

    });


    setEditId(item.id);

    setShowForm(true);


  };








  // Delete Paper

  const handleDelete=(id:number)=>{


    const confirmDelete = window.confirm(
      "Delete this paper?"
    );


    if(confirmDelete){


      setPapers((prev)=>

        prev.filter(
          item=>item.id!==id
        )

      );


    }


  };








  return (
    <div>



      <div className="flex justify-between items-center mb-6">


        <h2 className="text-2xl font-bold">
          Research Paper Management
        </h2>




        <button

        onClick={()=>setShowForm(true)}

        className="bg-blue-600 text-white px-4 py-2 rounded-lg"

        >

          + Add Paper

        </button>



      </div>








      {
        showForm && (

        <div className="
        bg-white
        border
        rounded-xl
        p-5
        mb-6
        ">


          <div className="grid md:grid-cols-5 gap-3">



            <input

            placeholder="Title"

            value={paper.title}

            onChange={
              e=>setPaper({
                ...paper,
                title:e.target.value
              })
            }

            className="border rounded-lg px-3 py-2"

            />





            <input

            placeholder="Author"

            value={paper.author}

            onChange={
              e=>setPaper({
                ...paper,
                author:e.target.value
              })
            }

            className="border rounded-lg px-3 py-2"

            />






            <input

            placeholder="Category"

            value={paper.category}

            onChange={
              e=>setPaper({
                ...paper,
                category:e.target.value
              })
            }

            className="border rounded-lg px-3 py-2"

            />







            <input

            placeholder="Year"

            value={paper.year}

            onChange={
              e=>setPaper({
                ...paper,
                year:e.target.value
              })
            }

            className="border rounded-lg px-3 py-2"

            />







            <button

            onClick={handleSave}

            className="bg-green-600 text-white rounded-lg"

            >

              Save

            </button>



          </div>



        </div>

        )
      }








      <table className="w-full bg-white rounded-xl border">


        <thead className="bg-slate-100">


          <tr>

            <th className="p-3 text-left">
              Title
            </th>

            <th>
              Author
            </th>

            <th>
              Category
            </th>

            <th>
              Year
            </th>

            <th>
              Action
            </th>


          </tr>


        </thead>







        <tbody>



        {
          papers.map((item)=>(


          <tr
          key={item.id}
          className="border-t"
          >



            <td className="p-3">
              {item.title}
            </td>



            <td>
              {item.author}
            </td>




            <td>
              {item.category}
            </td>




            <td>
              {item.year}
            </td>





            <td>


              <button

              onClick={()=>
                handleEdit(item)
              }

              className="text-blue-600 mr-3"

              >

                Edit

              </button>






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
  );
}