import { supabase } from "@/utils/supabase";

async function updateQuestionStatus(question_id, status, error = null, userId) {
  console.log(question_id, status, error, userId);
  const { data, err } = await supabase
    .from("Submissions")
    .insert([
      {
        question_id: question_id,
        user_id: userId,
        status: status,
        error: error,
      },
    ])

  if (err) {
    console.error("Error inserting submission:", err);
  } else {
    console.log("Submission inserted successfully", data);
  }
}

export default updateQuestionStatus;
