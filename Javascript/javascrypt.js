//
// lib/lib.js
//
var Question = function (questionObj) {
    this.value = {
      text: "Question",
      answers: []
    };
  
    this.selectedAnswer = null;
    this.html = null;
    this.questionText = null;
    this.questionAnswers = null;
    this.questionFeedback = null;
  
    this.value = Object.assign(this.value, questionObj);
  
    this.onQuestionAnswered = ({ detail }) => {
      this.selectedAnswer = {
        value: detail.answer,
        html: detail.answerHtml
      };
      this.update();
  
      document.dispatchEvent(
        new CustomEvent("question-answered", {
          detail: {
            question: this,
            answer: detail.answer
          }
        })
      );
    };
  
    this.create = function () {
      this.html = document.createElement("div");
      this.html.classList.add("question");
  
      this.questionText = document.createElement("h2");
      this.questionText.textContent = this.value.text;
  
      this.questionAnswers = document.createElement("div");
      this.questionAnswers.classList.add("answers");
  
      for (let i = 0; i < this.value.answers.length; i++) {
        const ansObj = this.value.answers[i];
        let answer = createAnswer(ansObj);
  
        answer.onclick = (ev) => {
          if (this.selectedAnswer !== null) {
            this.selectedAnswer.html.classList.remove("selected");
          }
  
          answer.classList.add("selected");
  
          this.html.dispatchEvent(
            new CustomEvent("question-answered", {
              detail: {
                answer: ansObj,
                answerHtml: answer
              }
            })
          );
        };
  
        this.questionAnswers.appendChild(answer);
      }
  
      this.questionFeedback = document.createElement("div");
      this.questionFeedback.classList.add("question-feedback");
  
      this.html.appendChild(this.questionText);
      this.html.appendChild(this.questionAnswers);
      this.html.appendChild(this.questionFeedback);
  
      this.html.addEventListener("question-answered", this.onQuestionAnswered);
  
      return this.html;
    };
  
    this.disable = function () {
      this.html.classList.add("disabled");
      this.html.onclick = (ev) => {
        ev.stopPropagation();
      };
  
      this.html.removeEventListener("question-answered", this.onQuestionAnswered);
  
      let answers = this.html.querySelectorAll(".answer");
      for (let i = 0; i < answers.length; i++) {
        let answer = answers[i];
        answer.onclick = null;
      }
    };
  
    this.remove = function () {
      let children = this.html.querySelectorAll("*");
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        this.html.removeChild(child);
      }
  
      this.html.removeEventListener("question-answered", this.onQuestionAnswered);
  
      this.html.parentNode.removeChild(this.html);
      this.html = null;
    };
  
    this.update = function () {
      let correctFeedback, incorrectFeedback;
      this.html = this.html || document.createElement("div");
  
      correctFeedback = "Bonne réponse!";
      incorrectFeedback = "Mauvaise réponse!";
  
      if (this.selectedAnswer !== null) {
        if (this.selectedAnswer.value.isCorrect) {
          this.html.classList.add("correct");
          this.html.classList.remove("incorrect");
          this.questionFeedback.innerHTML = correctFeedback;
        } else {
          this.html.classList.add("incorrect");
          this.html.classList.remove("correct");
          this.questionFeedback.innerHTML = incorrectFeedback;
        }
      }
    };
  
    function createAnswer(obj) {
      this.value = {
        text: "Answer",
        isCorrect: false
      };
  
      this.value = Object.assign(this.value, obj);
  
      this.html = document.createElement("button");
      this.html.classList.add("answer");
  
      this.html.textContent = this.value.text;
  
      return this.html;
    }
  };
  
  //
  // main.js
  //
  
  let questionsData = [
    {
      text: "Qu'est-ce que le VIH ?",
      answers: [
        {
          text: "Le Virus Immuno Humain",
          isCorrect: false
        },
        {
          text: "Le Virus de l'Immunodéficience Humaine",
          isCorrect: true
        },
        {
          text: "Le Virus Infantile Humain",
          isCorrect: false
        }
      ]
    },
    {
      text: "Comment contracte-t-on le VIH ?",
      answers: [
        {
          text: "En ayant des rapports sexuels non protégés avec une personne atteinte ?",
          isCorrect: true
        },
        {
          text: "En serrant la main d'une personne déjà atteinte du VIH",
          isCorrect: false
        },
        {
          text: "En jouant avec une personne malade",
          isCorrect: false
        }
      ]
    },
    {
      text: "Peut-on guérir du VIH ?",
      answers: [
        {
          text: "Oui",
          isCorrect: false
        },
        {
          text: 'Je ne sais pas',
          isCorrect: false
        },
        {
          text: "Non",
          isCorrect: true
        }
      ]
    },
    {
      text: "Peut-on avoir des enfants en ayant le Sida ?",
      answers: [
        {
          text: "Oui",
          isCorrect: true
        },
        {
          text: "Non",
          isCorrect: false
        },
        {
          text: "Je ne sais pas",
          isCorrect: false
        }
      ]
    },
    {
      text: "Est-il possible d'être un porteur sain ?",
      answers: [
        {
          text: "Oui",
          isCorrect: true
        },
        {
          text: "Non",
          isCorrect: false
        },
        {   
          text: "Je ne sais pas",
          isCorrect: false
        }
      ]
    },
    {
        text: "Si nous sommes atteints du VIH, quelle est la manière la plus simple de protéger les autres ?",
        answers: [
          {
            text: "En n'ayant plus aucun rapport",
            isCorrect: false
          },
          {
            text: "En évitant que mon sang rentre en contact avec les autres",
            isCorrect: true
          },
          {
            text: "En ne touchant personne",
            isCorrect: false
          }
        ]
      },
      {
        text: "Comment savoir si nous sommes porteurs du VIH ?",
        answers: [
          {
            text: "En allant faire une IRM",
            isCorrect: false
          },
          {
            text: "En faisant un test",
            isCorrect: true
          },
          {
            text: "En consultant son médecin",
            isCorrect: false
          }
        ]
      }
  ];
  

  // variables initialization
  let questions = [];
  let score = 0,
    answeredQuestions = 0;
  let appContainer = document.getElementById("questions-container");
  let scoreContainer = document.getElementById("score-container");
  scoreContainer.innerHTML = `Score: ${score}/${questionsData.length}`;
  
  /**
   * Shuffles array in place. ES6 version
   * @param {Array} arr items An array containing the items.
   */
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  shuffle(questionsData);
  
  // creating questions
  for (var i = 0; i < questionsData.length; i++) {
    let question = new Question({
      text: questionsData[i].text,
      answers: questionsData[i].answers
    });
  
    appContainer.appendChild(question.create());
    questions.push(question);
  }
  
  document.addEventListener("question-answered", ({ detail }) => {
    if (detail.answer.isCorrect) {
      score++;
    }
  
    answeredQuestions++;
    scoreContainer.innerHTML = `Score: ${score}/${questions.length}`;
    detail.question.disable();
  
    if (answeredQuestions == questions.length) {
      setTimeout(function () {
        alert(`Quiz terminé! \nScore finale: ${score}/${questions.length}`);
      }, 100);
    }
  });
  
  console.log(questions, questionsData);
  
var timeLeft = 60;
var elem = document.getElementById('some_div');
var timerId = setInterval(countdown, 1000);

function countdown() {
    if (timeLeft == -1) {
        clearTimeout(timerId);
        verspage();
    } else {
        elem.innerHTML = timeLeft + ' s';
        timeLeft--;
    }
}

function verspage() {
    alert(`Temps écoulé`);
}