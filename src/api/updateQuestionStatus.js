import { supabase } from "../supabaseClient";
import useAuthStore from "@/store/AuthStore";

async function updateQuestionStatus(question_id, status) {
  const { userId } = useAuthStore((state) => state.user.id);

  const { data, error } = await supabase
    .from("Submissions")
    .update({ status })
    .eq("user_id", userId)
    .eq("question_id", question_id);

  if (error) {
    console.error("Error updating question status:", error);
  } else {
    console.log("Question status updated successfully:", data);
  }
}

export default updateQuestionStatus;