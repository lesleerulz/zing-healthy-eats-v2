import prisma from "@/lib/prisma";
import { PackagePlus, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PackagePlus className="h-6 w-6 text-[#D4A373]" />
            Add New Product
          </h1>
          <p className="text-gray-400 text-sm mt-1">Create a new product listing for your store.</p>
        </div>
      </div>

      <form className="space-y-6">
        <div className="bg-[#1A1A23] rounded-xl border border-white/5 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Basic Information</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Product Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Grilled Chicken Salad"
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A373] transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea 
                  rows={4}
                  placeholder="Describe the product..."
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A373] transition-colors resize-none"
                  required
                />
              </div>
            </div>

            {/* Pricing and Stock */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h2 className="text-lg font-semibold text-white">Pricing & Inventory</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A373] transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Original Price ($) <span className="text-gray-500 font-normal">(Optional)</span></label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A373] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Stock Quantity</label>
                  <input 
                    type="number" 
                    defaultValue="0"
                    className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A373] transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category and Options */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h2 className="text-lg font-semibold text-white">Organization</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Category</label>
                  <select 
                    className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors appearance-none"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>Select a category...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <select 
                    className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors appearance-none"
                    defaultValue="true"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload Placeholder */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h2 className="text-lg font-semibold text-white">Product Image</h2>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 hover:border-white/20 transition-colors cursor-pointer">
                <ImageIcon className="h-10 w-10 text-gray-500 mx-auto mb-3" />
                <p className="text-sm text-gray-300 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or WEBP (max. 5MB)</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end gap-3">
            <Link 
              href="/admin/products"
              className="px-6 py-2.5 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="button"
              className="bg-[#D4A373] text-black hover:bg-[#D4A373]/90 px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
