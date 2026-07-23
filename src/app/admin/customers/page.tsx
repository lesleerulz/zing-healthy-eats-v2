import prisma from "@/lib/prisma";
import CustomersPageClient from "./CustomersPageClient";

export default async function CustomersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      isAdmin: true,
      isVerified: true,
      profilePicture: true,
    },
    orderBy: { id: 'desc' }
  });

  return <CustomersPageClient initialUsers={users} />;
}
