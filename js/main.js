// Select Elements
let countSpan = document.querySelector('.count span');

let bullets = document.querySelector('.bullets');

let bulletsSpanContainer = document.querySelector('.bullets .spans');

let questionArea = document.querySelector('.question_area');

let answersArea = document.querySelector('.answers_area');

let submitButton = document.querySelector('.submit_button');

let resultContainer = document.querySelector('.results');

let countDownElement = document.querySelector('.count_down');

// set options
let currentQuestion = 0,
    rightAnswers = 0,
    countDownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            
            // number of questions
            let questionsCount = questionsObject.length;

            // create bullets + questions count
            createBullets(questionsCount);

            // add question data
            addQuestionData(questionsObject[currentQuestion], questionsCount);


            // Start countDown
            countDown(5, questionsCount);

            // click on submit button
            submitButton.onclick = () => {
                
                // get right answer
                let rightAnswer = questionsObject[currentQuestion].right_answer;

                // increase index (get next question)
                currentQuestion++;

                // check answer
                checkAnswer(rightAnswer, questionsCount);

                // remove last question and answers
                questionArea.innerHTML = '';
                answersArea.innerHTML = '';
                
                // get next question
                addQuestionData(questionsObject[currentQuestion], questionsCount);

                // handle bullets class
                handleBulletsclass();

                // Start countDown again after clicked on submit button
                clearInterval(countDownInterval);
                countDown(5, questionsCount);

                showResults(questionsCount);
            }
        };
    };


    myRequest.open('GET', 'html_questions.json', true);
    myRequest.send();
};

getQuestions();

// create bullets + questions count
function createBullets(num){

    // add questions count according number of questions
    countSpan.innerHTML = num;

    // loop to create bullets according number of questions
    for(let i = 0; i < num; i++) {
        // create bullet
        let theBullet = document.createElement('span');

        if (i === 0) {
            theBullet.className = 'on';
        };

        // append bullet to bullets container
        bulletsSpanContainer.appendChild(theBullet);
    };
};

function addQuestionData(obj, count){

    if(currentQuestion < count) {
        // create h2 question title
        let questionTitle = document.createElement('h2');

        // create question text
        let questionText = document.createTextNode(obj['question']);

        // append questionText to questionTitle
        questionTitle.appendChild(questionText);

        // append questionTitle to questionArea
        questionArea.appendChild(questionTitle);

        // loop to create all answers
        for(let i = 1; i <= 4; i++){
            // create answer div
            let mainDiv = document.createElement('div');

            // add class to main div
            mainDiv.className = 'answer';

            // create radio input
            radioInput = document.createElement('input');

            // add type + id + name + data-attr
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.name = 'answer';
            radioInput.dataset.answer = obj[`answer_${i}`];
            if(i === 1) {
                radioInput.checked = true;
            };

            // append radioInput to mainDiv
            mainDiv.appendChild(radioInput);

            // create label
            let theLabel = document.createElement('label');

            // add for attr
            theLabel.htmlFor = `answer_${i}`;

            // append answerText to label
            theLabelText = document.createTextNode(obj[`answer_${i}`]);

            // append theLabelText to theLabel
            theLabel.appendChild(theLabelText);

            // append theLabel to mainDiv
            mainDiv.appendChild(theLabel);

            // append mainDiv to answersArea
            answersArea.appendChild(mainDiv);
        };
    };

};

// create check answer
function checkAnswer(rAnswer, count){
    let answers = document.getElementsByName('answer'),
        chosenAnswer;

    for(let i = 0; i < answers.length; i++){
        if(answers[i].checked){
            chosenAnswer = answers[i].dataset.answer;
        };
    };
    if(rAnswer === chosenAnswer) {
        rightAnswers++;
    };
};

// create function to handle background-color of bullet by add on class
function handleBulletsclass(){
    let bulletsSpans = document.querySelectorAll('.bullets .spans span'),
        arrayOfSpans = Array.from(bulletsSpans);

    arrayOfSpans.forEach((span, index) => {
        if(currentQuestion === index){
            span.className = 'on';
        };
    });
};

function showResults(count){
    if(currentQuestion === count) {
        questionArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        
        let theResult;
        
        if(rightAnswers === count){
            theResult = `<span class="perfect">Perfect</span> You Answered all questions`;
        } else if(rightAnswers > (count / 2) && rightAnswers < count){
            theResult = `<span class="good">Good</span> You Answered ${rightAnswers} from ${count}`;
        } else {
            theResult = `<span class="bad">Bad</span> You Answered ${rightAnswers} from ${count}`;
        };

        resultContainer.innerHTML = theResult;
        resultContainer.style.backgroundColor = 'white';
        resultContainer.style.padding = '10px';
        resultContainer.style.marginTop = '10px';
    };
};

function countDown(duration, count){
    if(currentQuestion < count){
        let minutes, seconds;
        countDownInterval = setInterval(function (){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            
            minutes = (minutes < 10) ? `0${minutes}` : minutes;
            seconds = (seconds < 10) ? `0${seconds}` : seconds;

            countDownElement.innerHTML = `${minutes}:${seconds}`;

            if(--duration < 0){
                clearInterval(countDownInterval);
                submitButton.click();
            };

        }, 1000);
    };
};
