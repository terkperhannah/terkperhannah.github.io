const unit1Questions = [
  {
    id: 1,
    type: 'mc',
    question: 'What are the prime factors of 28?',
    options: ['2 × 14', '2² × 7', '4 × 7', '2 × 7'],
    answer: '2² × 7'
  },
  {
    id: 2,
    type: 'mc',
    question: 'Is √2 a rational or irrational number?',
    options: ['Rational', 'Irrational'],
    answer: 'Irrational'
  },
  {
    id: 3,
    type: 'sa',
    question: 'Simplify √50',
    answer: '5√2'
  }
];

function renderUnit1Quiz(container) {
  unit1Questions.forEach((q, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'quiz-question';

    const prompt = document.createElement('p');
    prompt.textContent = `${index + 1}. ${q.question}`;
    wrapper.appendChild(prompt);

    if (q.type === 'mc') {
      q.options.forEach(opt => {
        const optionId = `q${index}_${opt}`;
        const div = document.createElement('div');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `q${index}`;
        input.value = opt;
        input.id = optionId;

        const label = document.createElement('label');
        label.setAttribute('for', optionId);
        label.textContent = opt;

        div.appendChild(input);
        div.appendChild(label);
        wrapper.appendChild(div);
      });
    } else {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = `q${index}`;
      wrapper.appendChild(input);
    }

    container.appendChild(wrapper);
  });
}

function gradeUnit1Quiz() {
  let score = 0;
  unit1Questions.forEach((q, index) => {
    let userAnswer = '';
    if (q.type === 'mc') {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      if (selected) userAnswer = selected.value.trim();
    } else {
      const input = document.querySelector(`input[name="q${index}"]`);
      if (input) userAnswer = input.value.trim();
    }
    if (userAnswer.toLowerCase() === q.answer.toLowerCase()) {
      score++;
    }
  });

  const progress = JSON.parse(localStorage.getItem('m10cProgress') || '{}');
  progress.unit1 = progress.unit1 || { attempts: 0, score: 0 };
  progress.unit1.attempts += 1;
  if (score > progress.unit1.score) {
    progress.unit1.score = score;
  }
  localStorage.setItem('m10cProgress', JSON.stringify(progress));

  const percent = (score / unit1Questions.length) * 100;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = `${percent}%`;

  const result = document.getElementById('result');
  if (result) {
    result.textContent = `Score: ${score}/${unit1Questions.length}`;
  }

  return score;
}

function initUnit1Progress() {
  const progress = JSON.parse(localStorage.getItem('m10cProgress') || '{}');
  if (progress.unit1) {
    const percent = (progress.unit1.score / unit1Questions.length) * 100;
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = `${percent}%`;
    const result = document.getElementById('result');
    if (result) {
      result.textContent = `Best Score: ${progress.unit1.score}/${unit1Questions.length} (Attempts: ${progress.unit1.attempts})`;
    }
  }
}

function exportProgress() {
  const data = localStorage.getItem('m10cProgress') || '{}';
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'm10c_progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

window.unit1Questions = unit1Questions;
window.renderUnit1Quiz = renderUnit1Quiz;
window.gradeUnit1Quiz = gradeUnit1Quiz;
window.initUnit1Progress = initUnit1Progress;
window.exportProgress = exportProgress;
