"use client";

import { useState } from "react";
import DeletePannel from "./DeletePannel";

type Props ={
  slug: string,
}
export default  function DeleteArticleButton({slug}:Props){
  const [loading, setLoading] = useState(false);
  return(
  <>
    {!loading && (<button className="bg-red-400 hover:bg-red-500 active:bg-red-400 text-white px-4 py-2 rounded" onClick={() => setLoading(true)}>Delete</button>)}
    {loading && (<DeletePannel slug={slug} loading={loading} setLoading={setLoading} />)}
  </>
  )
}