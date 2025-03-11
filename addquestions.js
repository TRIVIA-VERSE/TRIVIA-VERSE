document.addEventListener("DOMContentLoaded", function () {
    const subjectSelect = document.getElementById("subject");
    const questionInput = document.getElementById("question-input");
    const optionAInput = document.getElementById("option-a");
    const optionBInput = document.getElementById("option-b");
    const optionCInput = document.getElementById("option-c");
    const optionDInput = document.getElementById("option-d");
    const correctAnswerInput = document.getElementById("correct-answer");
    const addQuestionBtn = document.getElementById("add-question");
    const questionList = document.getElementById("question-list");

    let savedQuestions = JSON.parse(localStorage.getItem("questions")) || [];

    function addQuestionToDOM(questionData) {
        const li = document.createElement("li");
        li.innerHTML = `<strong>[${questionData.subject}] ${questionData.question}</strong>
                        <ul>
                            <li>A: ${questionData.options[0]}</li>
                            <li>B: ${questionData.options[1]}</li>
                            <li>C: ${questionData.options[2]}</li>
                            <li>D: ${questionData.options[3]}</li>
                        </ul>
                        <p>Correct Answer: <strong>${String.fromCharCode(65 + questionData.correct)}</strong></p>`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", function () {
            savedQuestions = savedQuestions.filter(q => q.question !== questionData.question);
            localStorage.setItem("questions", JSON.stringify(savedQuestions));
            li.remove();
        });

        li.appendChild(deleteBtn);
        questionList.appendChild(li);
    }

    savedQuestions.forEach(addQuestionToDOM);

    addQuestionBtn.addEventListener("click", function () {
        const subject = subjectSelect.value;
        const questionText = questionInput.value.trim();
        const options = [
            optionAInput.value.trim(),
            optionBInput.value.trim(),
            optionCInput.value.trim(),
            optionDInput.value.trim()
        ];
        const correctIndex = parseInt(correctAnswerInput.value, 10);

        if (!questionText || options.some(opt => opt === "") || isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
            alert("Please fill in all fields and enter a valid correct answer (A, B, C, or D).");
            return;
        }

        const questionData = { subject, question: questionText, options, correct: correctIndex };
        savedQuestions.push(questionData);
        localStorage.setItem("questions", JSON.stringify(savedQuestions));

        addQuestionToDOM(questionData);

        questionInput.value = "";
        optionAInput.value = "";
        optionBInput.value = "";
        optionCInput.value = "";
        optionDInput.value = "";
        correctAnswerInput.value = "0"; // Reset correct answer to A
    });
});
