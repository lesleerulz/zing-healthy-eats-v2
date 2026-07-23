"use client";

import { useState } from "react";
import { FolderTree, Plus, Edit, Trash2, X, Save } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "./actions";

type Category = {
  id: number;
  name: string;
  _count: { products: number };
};

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F5F5] flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-[#D4A373]" />
            Categories
          </h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Manage your product categories.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-[#D4A373] text-[#0F0F12] hover:bg-[#D4A373]/90 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Category
        </button>
      </div>

      <div className="bg-[#1A1A23] rounded-xl border border-[#2A2A35] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#0F0F12] border-b border-[#2A2A35]">
            <tr>
              <th className="px-6 py-4 font-medium text-[#9CA3AF] uppercase text-xs tracking-wider">Name</th>
              <th className="px-6 py-4 font-medium text-[#9CA3AF] uppercase text-xs tracking-wider">Products Count</th>
              <th className="px-6 py-4 font-medium text-[#9CA3AF] uppercase text-xs tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A35]">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-[#9CA3AF]">
                  No categories found. Create one to get started.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#2A2A35]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#F5F5F5]">{cat.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D4A373]/10 text-[#D4A373]">
                      {cat._count.products} products
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => openEditModal(cat)}
                        className="text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors" 
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <form action={deleteCategory.bind(null, cat.id)} onSubmit={(e) => {
                        if (!confirm("Are you sure you want to delete this category?")) e.preventDefault();
                      }}>
                        <button type="submit" className="text-[#9CA3AF] hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1A1A23] border border-[#2A2A35] rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#2A2A35]">
              <h2 className="text-lg font-bold text-[#F5F5F5]">
                {editingCategory ? "Edit Category" : "New Category"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form 
              action={editingCategory ? updateCategory.bind(null, editingCategory.id) : createCategory} 
              onSubmit={() => setIsModalOpen(false)}
              className="p-4 space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#9CA3AF]">Category Name</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={editingCategory?.name || ""}
                  required 
                  className="w-full bg-[#0F0F12] border border-[#2A2A35] rounded-lg px-4 py-2 text-[#F5F5F5] focus:outline-none focus:border-[#D4A373] transition-colors"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#2A2A35] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[#D4A373] text-[#0F0F12] px-4 py-2 rounded-lg font-medium hover:bg-[#D4A373]/90 transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
