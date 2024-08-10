import { supabase } from "@/utils/supabase";

async function getQuestions(question_id = null) {
  try {
    let query = supabase.from("Questions").select("*");
    
    if (question_id) {
      query = query.eq("id", question_id).single();
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

export default getQuestions;