document.addEventListener('DOMContentLoaded', () => {
    const questionsContainer = document.getElementById('question');
    const choicesContainer = document.getElementById('choices');
    const resultsContainer = document.getElementById('results');
    const timerContainer = document.getElementById('timer');
    const questionNumberContainer = document.getElementById('question-number');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    let currentQuestionIndex = 0;
    let timeLeft = 30;
    const answers = [];
    let timerInterval;
  
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((data) => {
        const questions = data.slice(0, 10);
        showQuestion(questions[currentQuestionIndex]);
  
        nextBtn.addEventListener('click', () => {
          moveToNextQuestion();
        });
  
        function showQuestion(question) {
          questionNumberContainer.innerText = `${currentQuestionIndex + 1}/${questions.length}`;
          questionsContainer.innerText = question.title;
          setTimeout(() => enableButtons(), 10000); 
  
          choicesContainer.innerHTML = ''; 
          const bodyParts = question.body.split('\n').slice(0, 4); 
          ['A', 'B', 'C', 'D'].forEach((label, index) => {
            let button = document.createElement('button');
            button.className = 'btn btn-outline-primary btn-lg btn-block';
            button.innerHTML = bodyParts[index] || 'N/A'; 
            let prefix = document.createElement('span');
            prefix.className = 'choice-prefix';
            prefix.innerText = `${label}-) `;
            button.insertBefore(prefix, button.firstChild); 
            button.disabled = true;
            button.onclick = () => selectAnswer(button, label);
            choicesContainer.appendChild(button);
          });
  
          resetTimer();
        }
  
        function resetTimer() {
          timeLeft = 30;
          updateTimer();
          clearInterval(timerInterval);
          timerInterval = setInterval(() => {
            timeLeft--;
            updateTimer();
          }, 1000);
        }
  
        function updateTimer() {
          timerContainer.innerHTML = `Time left: ${timeLeft} seconds`;
          if (timeLeft <= 0) {
            timerContainer.innerHTML = "Time's up!";
            disableButtons();
            if (currentQuestionIndex < questions.length - 1) {
              nextBtn.click();
            } else {
              showResults();
            }
          }
        }
  
        function enableButtons() {
          let buttons = choicesContainer.getElementsByTagName('button');
          for (let button of buttons) {
            button.disabled = false;
          }
        }
  
        function disableButtons() {
          let buttons = choicesContainer.getElementsByTagName('button');
          for (let button of buttons) {
            button.disabled = true;
          }
        }
  
        function selectAnswer(selectedButton, selectedLabel) {
          clearInterval(timerInterval);
          disableButtons();
          answers[currentQuestionIndex] = selectedLabel;
          selectedButton.classList.remove('btn-outline-primary');
          selectedButton.classList.add('btn-primary');
        }
  
        function moveToNextQuestion() {
          if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(questions[currentQuestionIndex]);
          } else {
            showResults();
          }
        }
  
        function showResults() {
          clearInterval(timerInterval);
          questionsContainer.classList.add('hidden');
          choicesContainer.classList.add('hidden');
          timerContainer.classList.add('hidden');
          nextBtn.classList.add('hidden');
          prevBtn.classList.add('hidden');
          resultsContainer.classList.remove('hidden');
          let resultsHtml = '<table class="table"><thead><tr><th>Question</th><th>Your Answer</th></tr></thead><tbody>';
          answers.forEach((answer, index) => {
            resultsHtml += `<tr><td>${questions[index].title}</td><td>${answer || 'No Answer'}</td></tr>`;
          });
          resultsHtml += '</tbody></table>';
          resultsContainer.innerHTML = resultsHtml;
        }
      });
  });
  