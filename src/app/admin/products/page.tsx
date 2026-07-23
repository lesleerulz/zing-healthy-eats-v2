import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import Image from "next/image";
import PageWrapper from "../PageWrapper";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { dateAdded: "desc" }
  });

  return (
    <PageWrapper>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#F5F5F5]">Products</h1>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 bg-[#D4A373] text-[#0F0F12] px-4 py-2 rounded-lg font-medium hover:bg-[#D4A373]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="bg-[#1A1A23] border border-[#2A2A35] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F0F12] text-xs uppercase tracking-wider text-[#9CA3AF]">
                <th className="px-6 py-3 font-medium">Image</th>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A35]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#2A2A35]/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#0F0F12] relative">
                      <Image 
                        src={product.image.startsWith('http') || product.image.startsWith('/') ? product.image : `/${product.image}`}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#F5F5F5]">
                    {product.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                    {product.category?.name || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F5F5]">
                    Ksh {product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        href={`/admin/products/${product.id}/edit`}
                        className="text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors" 
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                      </Link>
                      <form action={async () => {
                        "use server";
                        await prisma.product.delete({ where: { id: product.id } });
                        const { revalidatePath } = await import("next/cache");
                        revalidatePath("/admin/products");
                        revalidatePath("/catalog");
                      }}>
                        <button type="submit" className="text-[#9CA3AF] hover:text-red-400 transition-colors" title="Delete">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#9CA3AF]">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </PageWrapper>
  );
}
