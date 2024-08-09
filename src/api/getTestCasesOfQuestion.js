import { supabase } from "@/utils/supabase";

async function getTestCasesOfQuestion(question_id) {
  try {
    const { data, error } = await supabase
      .from("Testcases")
      .select("*")
      .eq("question_id", question_id);

    if (error) {
      throw error;
    }

    console.log("Test cases:", data);
    return data;
  } catch (error) {
    console.error("Error fetching test cases:", error);
  }
}

export default getTestCasesOfQuestion;
