import { auth } from "@/lib/auth";
import { database } from "@/lib/mongodb";
import { isAccountBlocked } from "@/lib/admin/store";
import { ObjectId } from "mongodb";

type AdminUserRecord = {
  _id?: ObjectId | string;
  id?: string;
  role?: string;
  isAdmin?: boolean | string;
};

export async function isAdminUser(userId: string): Promise<boolean> {
  const user = await database.collection<AdminUserRecord>("user").findOne(
    {
      $or: [
        { id: userId },
        { _id: userId },
        ...(ObjectId.isValid(userId) ? [{ _id: new ObjectId(userId) }] : []),
      ],
    },
    { projection: { role: 1, isAdmin: 1 } },
  );

  return user?.role === "admin" || user?.isAdmin === true || user?.isAdmin === "true";
}

export async function getAdminSession(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user || await isAccountBlocked(session.user.id) || !(await isAdminUser(session.user.id))) {
    return null;
  }

  return session;
}
