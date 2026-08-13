'use client';

import { useRouter } from "next/navigation";
import { SetStateAction } from "react";

type Props ={
  slug:string,
  loading:boolean,
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}
export default function DeletePannel({slug, loading, setLoading}:Props){
  const router = useRouter();
  async function handleDelete(){
    const res = await fetch(`/api/articles/${slug}`,{
      method: "DELETE",});
    if(!res.ok){
      const data = await res.json();
      alert(data.message || "Failed to delete article");
      setLoading(false);
      return;
    }

    router.refresh();
    
  }
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <h1 className="text-xl font-bold">
          Delete Article?
        </h1>

        <p className="mt-3 text-gray-600">
          Are you sure you want to delete:
        </p>

        <p className="mt-2 font-semibold">
          {slug}
        </p>
        <div className="mt-10 flex gap-4 justify-center ">
        <button className="bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-400 text-white px-4 py-2 rounded" onClick={() => setLoading(false)}>Cancel</button>
        <button className="bg-red-400 hover:bg-red-500 active:bg-red-400 text-white px-4 py-2 rounded" onClick={handleDelete}>Confirm</button>
        </div>
      </div>
    </div>
  );
}