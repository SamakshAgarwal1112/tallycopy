import { supabase } from "@/utils/supabase";

async function getUserName(userId) {
  try {
    const { data, error } = await supabase
      .from("Users")
      .select("user_handle")
      .eq("uid", userId).single();

    if (error) {
      throw error;
    }

    return data.user_handle;
  } catch (error) {
    console.error("Error fetching username:", error);
  }
}
export default getUserName;