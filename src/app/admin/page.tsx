import { getArticles } from "@/lib/articles";
import Link from "next/link";

export default async function AdminDashboard(){
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">

    {/* Header */}

    <div className="flex items-center justify-between mb-8">

        <div>
            <h1 className="text-3xl font-bold">
                Admin Dashboard
            </h1>

            <p className="text-gray-500">
                Welcome Admin
            </p>
        </div>

    </div>

</div>
  );
}