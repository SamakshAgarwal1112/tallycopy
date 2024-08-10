import { supabase } from "@/utils/supabase";

async function getUserQuestions(userId) {
  try {
    const { data, error } = await supabase
      .from("Submissions")
      .select("*")
      .eq("user_id", userId)

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching user id:", error);
  }
}

export default getUserQuestions;
