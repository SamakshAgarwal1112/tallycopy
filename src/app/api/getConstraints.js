import { supabase } from "@/utils/supabase";

async function getConstraints(question_id) {
  try {
    const { data, error } = await supabase
      .from("Questions")
      .select("time_constraint, memory_constraint")
      .eq("id", question_id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching constraints:", error);
  }
}

export default getConstraints;
