import prisma from "@/lib/prisma";
import { FolderTree, Plus, Edit, Trash2 } from "lucide-react";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-[#D4A373]" />
            Categories
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage your product categories.</p>
        </div>
        <button className="bg-[#D4A373] text-black hover:bg-[#D4A373]/90 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" />
          Create Category
        </button>
      </div>

      <div className="bg-[#1A1A23] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-300">Name</th>
              <th className="px-6 py-4 font-medium text-gray-300">Products Count</th>
              <th className="px-6 py-4 font-medium text-gray-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No categories found. Create one to get started.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{cat.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D4A373]/10 text-[#D4A373]">
                      {cat._count.products} products
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-gray-400 hover:text-white transition-colors" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
