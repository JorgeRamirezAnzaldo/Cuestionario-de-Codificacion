//Access to elements using Id
var section = document.getElementById("Mainsection");
var HighScores = document.getElementById("high");
var timerEl = document.getElementById("Text2");
//Create necessary elements and assign them to variables
var InitialHeading = document.createElement("h1");
var InitialParagraph = document.createElement("p");
var InitialSubmitBtn = document.createElement("button");
var Question = document.createElement("p");
var List = document.createElement("ul");
var validationEl = document.createElement("p");
var resultsHeading = document.createElement("h1");
var resultsText = document.createElement("p");
var resultsInitials = document.createElement ("p");
var resultsInput = document.createElement ("input");
var resultsSubmit = document.createElement ("button");
var ScoresList = document.createElement("ul");
var ScoresHeading = document.createElement("h1");
var BackBtn = document.createElement("button");
var ClearBtn = document.createElement("button");
//Define some global variables with values
var i = 0;
var li;
var stop = false;
var showhigh = false;
var timer = 75000;
var valtext = "";
var original;
var original1;
var original2;
var timeLeft = 75;
var todos = [];
var storedTodos;
//Define array with questions texts
var QuestionsText = ["Los arreglos en Javascript pueden contener:",
                     "Los tipos de datos más comunes NO incluyen",
                     "La condición en un enunciado if/else va encerrada entre:",
                     "Una herramienta poderosa para imprimir contenido en el debugger mientras se desarrolla o debuggea es:",
                     "Cuando se asigna un string a una variable, el string debe ir encerrado entre:",
                     "Para evitar la propagación de eventos o el efecto bubbling, se usa:",
                     "¿Cuál sería la línea correcta para crear un heading <h1> en javascript y guardarlo en una variable?"];
//Define array with choices texts
var Choices = ["1. Números y strings%2. Otros arreglos%3. Booleanos%4. Todas las anteriores",
               "1. Strings%2. Booleanos%3. Alertas%4. Números",
               "1. Paréntesis ()%2. Comillas \"\"%3. Corchetes []%4. Llaves {}",
               "1. Javascript%2. console.log%3. terminal/bash%4. For loops",
               "1. Comillas \"\"%2. Comas ,,%3. Corchetes []%4. Llaves {}",
               "1. event.stopPropagation()%2. event.stopBubbling()%3. event.dontPropagate()%4. event.preventDefault()",
               "1. var h = document.createh1%2. var h = document.createHeading(h1)%3. var h = document.createElement(\"h1\")%4. var h = document.create(\"h1\")"];
//Define array with correct answers positions
var Answers = [3, 2, 0, 1, 0, 0, 2];
//Determine the length of the questions array and save it to a variable
var QTLength = QuestionsText.length;

//Set initial screen as first step
setInitialscreen();

//Function to create and render initial screen
function setInitialscreen(){
    //Clean variables to avoid using incorrect values
    i = 0;
    stop = false;
    showhigh = false;
    timer = 75000;
    valtext = "";
    timeLeft = 75;
    todos = [];
    //Get Item Scores from localStorage for the high scores
    storedTodos = JSON.parse(localStorage.getItem("Scores"));
    if (storedTodos !== null) {
        todos = storedTodos;
    }
    //Render screen with all the necessary elements
    section.setAttribute("style", "text-align:center;")
    original = timerEl.textContent;
    original1 = timerEl.textContent.slice(0,6);
    original2 = timerEl.textContent.slice(8);
    InitialHeading.textContent = "Cuestionario de Codificación";
    InitialHeading.setAttribute("class", "InitialHeading");
    section.appendChild(InitialHeading);
    InitialParagraph.textContent = "Intenta responder las siguientes preguntas relacionadas con codificación en el límite de tiempo. Toma en cuenta que las respuestas incorrectas te quitarán 10 segundos de tiempo. Tu puntaje será el tiempo restante que te haya quedado.";
    InitialParagraph.setAttribute("class", "InitialParagraph");
    InitialSubmitBtn.setAttribute("type", "submit");
    InitialSubmitBtn.setAttribute("class", "Initial");
    InitialSubmitBtn.textContent = "Iniciar cuestionario";
    section.appendChild(InitialParagraph); 
    section.appendChild(InitialSubmitBtn);
}

//Function to start the timer
function StartTimer() {
    var timeInterval = setInterval(function () {
      //Get the time left in seconds
      timeLeft = timer / 1000;  
      //If time is not over and there are still questions
      if ((timeLeft >= 0) && (stop === false)){
        timerEl.textContent = original1 + timeLeft + original2; //Create text to display the time left
        timer = timer - 1000; //reduce time by 1 second
      } else if ((timeLeft >= 0) && (showhigh === true)){ //If time is not over, but the user presses the HIGH SCORES text
        clearInterval(timeInterval); //Restart timer
        return;
      } else if ((timeLeft < 0) || (stop === true)){ //If time is over or there aren't any questions left
        clearInterval(timeInterval); //Restart timer
        timerEl.textContent = ""; //Clear text for the time left
        showFinalResults(); //Display Final Results
      }
    }, 1000);
}

//Function to render screen for each question
function RenderScreen(event){
    var element = event.target;
    //Verify that the button with class Initial was pressed
    if (element.matches(".Initial") === true) {
        StartTimer(); //Start Timer
        //Remove elements of the Initial screen
        section.removeChild(InitialHeading);
        section.removeChild(InitialParagraph);
        section.removeChild(InitialSubmitBtn);
        //Render initial question with its options
        renderQuestion();
    } else if (!stop && element.matches(".OptionBtn") === true) { //Verify if the button with class OptionBtn was pressed
        validateAnswer(event); //Validate the answer introduced in the previous question
        section.removeChild(Question); //Remove the text of the previous question
        List.innerHTML = ""; //Remove all elements of the list that contains the options
        section.removeChild(List); //Remove the list
        renderQuestion(); //Render next question with its options
    }

}

//Function to render the questions and their options
function renderQuestion(){
    //If all the questions have been displayed
    if (i === QTLength){ 
        section.removeChild(validationEl); //Remove validation text
        stop = true; //stop timer and rendering of the questions
        return;
    }
    //If we are rendering a question other than the initial
    if(i > 0){ 
        section.removeChild(validationEl); //Remove validation text
        validationEl.setAttribute("style", "border-top-style: solid; border-width: 5px; padding-top:15px; text-align:left;")
        validationEl.setAttribute("class", "QResult");
        validationEl.textContent = (valtext); //Set validation text with result
    }
    section.appendChild(Question); //Add question element
    Question.setAttribute("class", "Question");
    section.appendChild(List); //Add list element
    List.setAttribute("style", "text-align:center;");
    Question.textContent = QuestionsText[i]; //Set text for the question using the questions texts array
    //Loop to render the answers options as buttons using the answers options array
    for (var j = 0; j < 4; j++){
        let choicesarray = Choices[i].split("%"); //Split answers options using % as a separator
        li = document.createElement("button"); //Create a button 
        li.setAttribute("class", "OptionBtn");
        li.setAttribute("data-index", j); //Define an index for each button element
        List.appendChild(li); //Add button to the list
        li.textContent =  choicesarray[j]; //Define text for the answer option
    }
    section.appendChild(validationEl); //Add validation text at the end
    i++; //Increase index for the questions
}

//Function to validate each answer
function validateAnswer(event){
    //Define the number of question
    var m = i;
    m = m - 1; //Substract 1 to align questions and answers
    var index = event.target.dataset.index; //Get the index of the option pressed
    var correct = Answers[m]; //Get the correct answer from the answers array
    //Validate if the index of the pressed button and the correct answer match
    if (index == correct){ //If yes
        valtext = "Correct!"; //Set successful text
    }else{ //If no
        valtext = "Wrong!"; //Set failure text
        timer = timer - 10000; //Reduce timer by 10 seconds
    }
}

//Function to display the high scores
function showFinalResults(){
    section.innerHTML =""; //Clean the section
    resultsHeading.textContent = "Quiz terminado" //Set text for results heading
    resultsHeading.setAttribute("style", "font-family:Arial; font-size:30px;");
    if (timeLeft < 0){ //If time was over
        timeLeft = 0; //Set time left to zero
    }
    resultsText.textContent = "Tu resultado final es: " + timeLeft; //Create the text for the final result
    resultsText.setAttribute("style", "font-size:20px; font-weight:bold;");
    resultsInitials.textContent = "Introduce tus iniciales";
    resultsInitials.setAttribute("style", "display: inline-block; font-size:20px; font-family:Verdana;");
    section.appendChild(resultsHeading); //Add results heading
    section.appendChild(resultsText); //Add final result
    section.appendChild(resultsInitials); //Add text that indicates to introduce initials
    //Set attributes for the input field and submit button to store score
    resultsInput.setAttribute("type", "text");
    resultsInput.setAttribute("style", "margin-left:30px;");
    resultsSubmit.setAttribute("type", "submit");
    resultsSubmit.setAttribute("class", "Store");
    resultsSubmit.textContent = "Submit";
    section.appendChild(resultsInput); //Add input for the initials
    section.appendChild(resultsSubmit); //Add submit button
    validationEl.setAttribute("style", "border-top-style: solid; border-width: 5px; padding-top:15px; text-align:left; font-size: 30px;"); 
    validationEl.textContent = (valtext); //Set text for the validation of the last question
    section.appendChild(validationEl); //Add validation text of the last question
}

//Function to store the score
function StoreScore(event){
    var element2 = event.target;
    //Validate if the button with class Store was pressed
    if (element2.matches(".Store") === true) {
        var input = resultsInput.value.trim(); //Get rid of white spaces
        if (input !== ""){ //Validate that the user introduced something
            var score = { //Create object for the score
                initials : input, //Include initials
                result : timeLeft //Include score
            };
            todos.push(score); //Add the object to the array that contains all scores
            var almacenar = JSON.stringify(todos); //Convert the array of objects to string
            localStorage.setItem("Scores", almacenar); //Save the obtained string to the localStorage
            displayHighScores(); //Display high scores 
        }else{
            alert("Introduce tus iniciales por favor"); //Send an alert to the user to introduce the initials
            return;
        }
    }

}

//Function to display the scores
function displayHighScores(){
    showhigh = true; //Activate flag to set that the user went to scores display
    section.innerHTML = ""; //Clean the section
    ScoresList.innerHTML = ""; //Clean the list for the scores
    ScoresList.setAttribute("class", "Slist"); 
    section.appendChild(ScoresHeading); //Add the heading for the scores
    ScoresHeading.textContent = "HIGH SCORES"; //Set text for the heading
    section.appendChild(ScoresList); //Add the list of scores
    storedTodos = JSON.parse(localStorage.getItem("Scores")); //Convert the stringified array of objects stored in item "Scores" into an array
    if (storedTodos !== null) { //If there is something in the localStorage
        storedTodos = storedTodos.sort(((a,b) => b.result - a.result)); //Sort the array
        //Loop to display all scores saved in localStorage
        for (var k = 0; k < storedTodos.length; k++) { 
            var score = storedTodos[k]; //Get the object according to the index
            var text1 = score.initials; //Get the initials from actual object
            var text2 = score.result; //Get the result from actual object
            var z = k + 1; //Define the position of the score
            li = document.createElement("li"); //Create list element
            li.setAttribute("class", "Elist");
            li.textContent = z + ". " + text1 + ": " + text2; //Create text for the list element
            ScoresList.appendChild(li); //Add list element to the scores list
        }
    }
    BackBtn.setAttribute("class", "Back");
    BackBtn.textContent = "Regresar"; //Define text for the button to return
    section.appendChild(BackBtn); //Add button to return
    ClearBtn.setAttribute("class", "Clear");
    ClearBtn.textContent = "Borrar"; //Define text for the button to clear scores
    section.appendChild(ClearBtn); //Add button to clear scores

}

//Function to clear all the scores
function clearScores(event){
    var element3 = event.target;
    if (element3.matches(".Clear") === true) { //Verify that the button with class Clear was pressed
        localStorage.removeItem("Scores"); //Clear item Score from localStorage
        displayHighScores(); //Display High scores without anything
    }
}

//Function to go back after displaying scores
function GoBack(event){
    var element4 = event.target;
    if (element4.matches(".Back") === true) { //Verify that the button with class Back was pressed
        window.location.reload(false); //Reload window
    }
}


//Event Listeners for all relevant buttons
section.addEventListener("click", RenderScreen);
resultsSubmit.addEventListener("click", StoreScore);
HighScores.addEventListener("click", displayHighScores);
ClearBtn.addEventListener("click", clearScores);
BackBtn.addEventListener("click", GoBack);