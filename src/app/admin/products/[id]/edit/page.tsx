import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Save, Edit as EditIcon } from "lucide-react";
import PageWrapper from "../../../PageWrapper";
import { updateProduct } from "../../actions";
import { notFound } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ]);

  if (!product) notFound();

  // Bind the id to the server action
  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <PageWrapper>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-[#2A2A35] rounded-lg transition-colors text-[#9CA3AF] hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#F5F5F5] flex items-center gap-2">
              <EditIcon className="h-6 w-6 text-[#D4A373]" />
              Edit Product
            </h1>
          </div>
        </div>

        <form action={updateProductWithId} className="space-y-6">
          <div className="bg-[#1A1A23] rounded-xl border border-[#2A2A35] overflow-hidden p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#9CA3AF]">Product Title</label>
                <input 
                  type="text" 
                  name="title"
                  defaultValue={product.title}
                  className="w-full bg-[#0F0F12] border border-[#2A2A35] rounded-lg px-4 py-2 text-[#F5F5F5] focus:outline-none focus:border-[#D4A373] transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#9CA3AF]">Category</label>
                <select 
                  name="categoryId"
                  defaultValue={product.categoryId || ""}
                  className="w-full bg-[#0F0F12] border border-[#2A2A35] rounded-lg px-4 py-2 text-[#F5F5F5] focus:outline-none focus:border-[#D4A373] transition-colors appearance-none"
                  required
                >
                  <option value="" disabled>Select a category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#9CA3AF]">Description</label>
              <textarea 
                name="description"
                defaultValue={product.description}
                rows={4}
                className="w-full bg-[#0F0F12] border border-[#2A2A35] rounded-lg px-4 py-2 text-[#F5F5F5] focus:outline-none focus:border-[#D4A373] transition-colors resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#9CA3AF]">Price (Ksh)</label>
                <input 
                  type="number" 
                  name="price"
                  step="0.01"
                  defaultValue={product.price}
                  className="w-full bg-[#0F0F12] border border-[#2A2A35] rounded-lg px-4 py-2 text-[#F5F5F5] focus:outline-none focus:border-[#D4A373] transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#9CA3AF]">Stock Quantity</label>
                <input 
                  type="number" 
                  name="quantity"
                  defaultValue={product.quantity}
                  className="w-full bg-[#0F0F12] border border-[#2A2A35] rounded-lg px-4 py-2 text-[#F5F5F5] focus:outline-none focus:border-[#D4A373] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#9CA3AF]">Upload Image</label>
              <ImageUploader defaultValue={product.image} />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#2A2A35]">
              <input 
                type="checkbox" 
                id="isActive" 
                name="isActive" 
                defaultChecked={product.isActive}
                className="w-4 h-4 rounded border-[#2A2A35] bg-[#0F0F12] text-[#D4A373] focus:ring-[#D4A373]"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-[#F5F5F5]">Active (visible in store)</label>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#2A2A35]">
              <button 
                type="submit"
                className="bg-[#D4A373] text-[#0F0F12] hover:bg-[#D4A373]/90 px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
