"use client";

import { Camera, LogOut } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AdminProfileData {
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  image: string;
}

export default function AdminProfile() {

  const [profile, setProfile] = useState<AdminProfileData>({
  name: "",
  email: "",
  role: "",
  lastLogin: "",
  image: "/unisync-logo.png",
});


useEffect(() => {

  const adminData = localStorage.getItem("adminProfile");

  if(adminData){

    setProfile(JSON.parse(adminData));

  }

}, []);

  const [password, setPassword] = useState({
    current:"",
    newPassword:"",
    confirm:""
  });



  const [message,setMessage] = useState("");



  const handleChange = (
    e:React.ChangeEvent<HTMLInputElement>
  )=>{

    setProfile({
      ...profile,
      [e.target.name]:e.target.value
    });

  };



  const handleImageChange = (
    e:React.ChangeEvent<HTMLInputElement>
  )=>{

    const file=e.target.files?.[0];

    if(file){

      setProfile({
        ...profile,
        image:URL.createObjectURL(file)
      });

    }

  };



  const saveProfile = ()=>{

    setMessage("Profile updated successfully");

  };



  const updatePassword = ()=>{


    if(password.newPassword !== password.confirm){

      setMessage("Password does not match");
      return;

    }


    setMessage("Password changed successfully");


    setPassword({
      current:"",
      newPassword:"",
      confirm:""
    });


  };





return (

<div className="space-y-6">


{/* Header */}

<div className="flex justify-between items-center">


<div>

<h1 className="text-3xl font-bold text-slate-800">
Admin Profile
</h1>


<p className="text-slate-500">
Manage administrator account information
</p>

</div>



<button

onClick={saveProfile}

className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"

>
Save Changes
</button>


</div>





{message &&

<div className="bg-blue-100 text-blue-700 p-3 rounded-lg">

{message}

</div>

}







<div className="grid lg:grid-cols-3 gap-6">





{/* Profile Card */}

<div className="bg-white rounded-xl shadow border p-6">


<div className="flex flex-col items-center">


<div className="relative">


<Image

src={profile.image}

alt="Admin"

width={140}

height={140}

className="w-36 h-36 rounded-full object-cover border-4 border-blue-500"

/>




<label

htmlFor="imageUpload"

className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer"

>

<Camera size={18}/>

</label>



<input

id="imageUpload"

type="file"

accept="image/*"

className="hidden"

onChange={handleImageChange}

/>



</div>





<h2 className="text-2xl font-bold mt-4">

{profile.name}

</h2>


<p className="text-slate-500">

{profile.email}

</p>



<span className="mt-4 bg-green-100 text-green-700 px-4 py-1 rounded-full">

Active

</span>


</div>


</div>









{/* Details */}

<div className="lg:col-span-2 bg-white rounded-xl shadow border p-6">


<div className="grid md:grid-cols-2 gap-5">



<Input

label="Full Name"

name="name"

value={profile.name}

onChange={handleChange}

/>




<Input

label="Email"

name="email"

value={profile.email}

onChange={handleChange}

/>




<Input

label="Role"

name="role"

value={profile.role}

onChange={handleChange}

/>




<Input

label="Last Login"

name="lastLogin"

value={profile.lastLogin}

onChange={handleChange}

/>


</div>






<hr className="my-8"/>





<h2 className="text-xl font-semibold mb-4">

Change Password

</h2>





<div className="space-y-4">


<input

type="password"

placeholder="Current Password"

className="w-full border rounded-lg px-4 py-2"

value={password.current}

onChange={(e)=>

setPassword({

...password,

current:e.target.value

})

}

/>




<input

type="password"

placeholder="New Password"

className="w-full border rounded-lg px-4 py-2"

value={password.newPassword}

onChange={(e)=>

setPassword({

...password,

newPassword:e.target.value

})

}

/>




<input

type="password"

placeholder="Confirm Password"

className="w-full border rounded-lg px-4 py-2"

value={password.confirm}

onChange={(e)=>

setPassword({

...password,

confirm:e.target.value

})

}

/>



</div>







<div className="flex gap-4 mt-6">


<button

onClick={updatePassword}

className="bg-blue-600 text-white px-5 py-2 rounded-lg"

>

Update Password

</button>





<button

className="bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"

>

<LogOut size={18}/>

Logout

</button>



</div>




</div>





</div>


</div>


);


}







function Input({

label,

name,

value,

onChange

}:any){


return (

<div>

<label className="block font-medium mb-2">

{label}

</label>


<input

name={name}

value={value}

onChange={onChange}

className="w-full border rounded-lg px-4 py-2"

/>


</div>

)

}

