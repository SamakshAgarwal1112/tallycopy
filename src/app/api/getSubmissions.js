import { supabase } from "@/utils/supabase";

async function getSubmissions(userId, questionId = null) {
  try {
    let query = supabase
      .from("Submissions")
      .select("*")
      .eq("user_id", userId);
    
    if (questionId) {
      query = query.eq("question_id", questionId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching submissions:", error);
  }
}

export default getSubmissions;