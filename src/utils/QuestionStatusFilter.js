const statusPriority = {
    "Solved": 3,
    "Attempted": 2,
    "Unattempted": 1,
};

export const QuestionStatusFilter = (questions) => {
    const filteredQuestions = {};

    questions && questions.map((question) => {
        const { question_id, status } = question;

        if (!filteredQuestions[question_id] || statusPriority[status] > statusPriority[filteredQuestions[question_id].status]) {
            filteredQuestions[question_id] = question;
        }
    });
    return Object.values(filteredQuestions);
};