import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser(req.headers.authorization);

    // Verify the user is an admin
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("is_organization_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_organization_admin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      throw error;
    }

    return res.status(200).json({ users: data.users });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
