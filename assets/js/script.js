var section = document.getElementById("Mainsection");
var InitialHeading = document.createElement("h1");
var InitialParagraph = document.createElement("p");
var InitialSubmitBtn = document.createElement("button");
var Question = document.createElement("p");
var List = document.createElement("ul");
var timerEl = document.getElementById("Text2");
var validationEl = document.createElement("p");
var i = 0;
var li;
var stop = false;
var showhigh = false;
var timer = 75000;
var valtext = "";
var original;
var original1;
var original2;
var resultsHeading = document.createElement("h1");
var resultsText = document.createElement("p");
var resultsInitials = document.createElement ("p");
var resultsInput = document.createElement ("input");
var resultsSubmit = document.createElement ("button");
var timeLeft = 75;
var todos = [];
var storedTodos;
var ScoresList = document.createElement("ul");
var ScoresHeading = document.createElement("h1");
var HighScores = document.getElementById("high");
var BackBtn = document.createElement("button");
var ClearBtn = document.createElement("button");

var QuestionsText = ["Los arreglos en Javascript pueden contener:",
                     "Los tipos de datos más comunes NO incluyen",
                     "La condición en un enunciado if/else va encerrada entre:",
                     "Una herramienta poderosa para imprimir contenido en el debugger mientras se desarrolla o debuggea es:",
                     "Cuando se asigna un string a una variable, el string debe ir encerrado entre:",
                     "Para evitar la propagación de eventos o el efecto bubbling, se usa:",
                     "¿Cuál sería la línea correcta para crear un heading <h1> en javascript y guardarlo en una variable?"];

var Choices = ["1. Números y strings%2. Otros arreglos%3. Booleanos%4. Todas las anteriores",
               "1. Strings%2. Booleanos%3. Alertas%4. Números",
               "1. Paréntesis ()%2. Comillas \"\"%3. Corchetes []%4. Llaves {}",
               "1. Javascript%2. console.log%3. terminal/bash%4. For loops",
               "1. Comillas \"\"%2. Comas ,,%3. Corchetes []%4. Llaves {}",
               "1. event.stopPropagation()%2. event.stopBubbling()%3. event.dontPropagate()%4. event.preventDefault()",
               "1. var h = document.createh1%2. var h = document.createHeading(h1)%3. var h = document.createElement(\"h1\")%4. var h = document.create(\"h1\")"];

var Answers = [3, 2, 0, 1, 0, 0, 2];

var QTLength = QuestionsText.length;

setInitialscreen();

function setInitialscreen(){
    storedTodos = JSON.parse(localStorage.getItem("Scores"));
    if (storedTodos !== null) {
        todos = storedTodos;
        console.log(todos);
    }
    stop = false;
    section.setAttribute("style", "text-align:center;")
    console.log("Pantalla inicial");
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


function StartTimer() {
    var timeInterval = setInterval(function () {
      timeLeft = timer / 1000;  
      console.log(timeLeft);
      if ((timeLeft >= 0) && (stop === false)){
        timerEl.textContent = original1 + timeLeft + original2;
        timer = timer - 1000;
      } else if ((timeLeft >= 0) && (showhigh === true)){
        console.log("Se ha presionado High Scores");
        clearInterval(timeInterval);
        return;
      } else if ((timeLeft < 0) || (stop === true)){
        clearInterval(timeInterval);
        timerEl.textContent = "";
        showFinalResults();
      }
    }, 1000);
}

function RenderScreen(event){
    var element = event.target;
    if (element.matches(".Initial") === true) {
        StartTimer();
        section.removeChild(InitialHeading);
        section.removeChild(InitialParagraph);
        section.removeChild(InitialSubmitBtn);
        renderQuestion();
    } else if (!stop && element.matches(".OptionBtn") === true) {
        validateAnswer(event);
        section.removeChild(Question);
        List.innerHTML = "";
        section.removeChild(List);
        renderQuestion();
    }

}

function renderQuestion(){

    if (i === QTLength){
        section.removeChild(validationEl);
        stop = true;
        console.log("STOP");
        return;
    }
    if(i > 0){
        section.removeChild(validationEl);
        validationEl.setAttribute("style", "border-top-style: solid; border-width: 5px; padding-top:15px; text-align:left;")
        validationEl.setAttribute("class", "QResult");
        validationEl.textContent = (valtext);
    }
    section.appendChild(Question);
    Question.setAttribute("class", "Question");
    section.appendChild(List);
    List.setAttribute("style", "text-align:center;");
    Question.textContent = QuestionsText[i];
    for (var j = 0; j < 4; j++){
        let choicesarray = Choices[i].split("%");
        li = document.createElement("button");
        li.setAttribute("class", "OptionBtn");
        li.setAttribute("data-index", j);
        List.appendChild(li);
        li.textContent =  choicesarray[j];
    }
    section.appendChild(validationEl);
    i++;
}

function validateAnswer(event){
    console.log("Valida");
    var m = i;
    m = m - 1;
    var index = event.target.dataset.index;
    var correct = Answers[m];
    if (index == correct){
        console.log("Respuesta correcta");
        valtext = "Correct!";
    }else{
        console.log("Equivocado, menos 10 segundos");
        valtext = "Wrong!";
        timer = timer - 10000;
    }
    
}

function showFinalResults(){
    section.innerHTML ="";
    console.log("Resultados");
    console.log(timer);
    resultsHeading.textContent = "Quiz terminado"
    resultsHeading.setAttribute("style", "font-family:Arial; font-size:30px;");
    if (timeLeft < 0){
        timeLeft = 0;
    }
    resultsText.textContent = "Tu resultado final es: " + timeLeft;
    resultsText.setAttribute("style", "font-size:20px; font-weight:bold;");
    resultsInitials.textContent = "Introduce tus iniciales";
    resultsInitials.setAttribute("style", "display: inline-block; font-size:20px; font-family:Verdana;");
    section.appendChild(resultsHeading);
    section.appendChild(resultsText);
    section.appendChild(resultsInitials);
    resultsInput.setAttribute("type", "text");
    resultsInput.setAttribute("style", "margin-left:30px;");
    resultsSubmit.setAttribute("type", "submit");
    resultsSubmit.setAttribute("class", "Store");
    resultsSubmit.textContent = "Submit";
    section.appendChild(resultsInput);
    section.appendChild(resultsSubmit);
    validationEl.setAttribute("style", "border-top-style: solid; border-width: 5px; padding-top:15px; text-align:left; font-size: 30px;");
    validationEl.textContent = (valtext);
    section.appendChild(validationEl);
}

function StoreScore(event){
    var element2 = event.target;
    if (element2.matches(".Store") === true) {
        var input = resultsInput.value.trim();
        console.log(input);
        if (input !== ""){
            var score = {
                initials : input,
                result : timeLeft
            };
            todos.push(score);
            console.log(todos);
            var almacenar = JSON.stringify(todos);

            localStorage.setItem("Scores", almacenar);
            displayHighScores();
        }else{
            alert("Introduce tus iniciales por favor");
            return;
        }
    }

}

function displayHighScores(){
    showhigh = true;
    console.log(stop);
    section.innerHTML = "";
    ScoresList.innerHTML = "";
    ScoresList.setAttribute("class", "Slist");
    section.appendChild(ScoresHeading);
    ScoresHeading.textContent = "HIGH SCORES";
    section.appendChild(ScoresList);
    storedTodos = JSON.parse(localStorage.getItem("Scores"));
    if (storedTodos !== null) {
        storedTodos = storedTodos.sort(((a,b) => b.result - a.result));
        for (var k = 0; k < storedTodos.length; k++) {
            var score = storedTodos[k];
            var text1 = score.initials;
            var text2 = score.result;
            var z = k + 1;
            li = document.createElement("li");
            li.setAttribute("class", "Elist");
            li.textContent = z + ". " + text1 + ": " + text2;
            ScoresList.appendChild(li);
        }
    }
    BackBtn.setAttribute("class", "Back");
    BackBtn.textContent = "Regresar";
    section.appendChild(BackBtn);
    ClearBtn.setAttribute("class", "Clear");
    ClearBtn.textContent = "Borrar";
    section.appendChild(ClearBtn);

}

function clearScores(event){
    var element3 = event.target;
    if (element3.matches(".Clear") === true) {
        console.log("Borra");
        localStorage.removeItem("Scores");
        displayHighScores();
    }
}

function GoBack(event){
    var element4 = event.target;
    if (element4.matches(".Back") === true) {
        console.log("Regresa");
        window.location.reload(false);
    }
}



section.addEventListener("click", RenderScreen);
resultsSubmit.addEventListener("click", StoreScore);
HighScores.addEventListener("click", displayHighScores);
ClearBtn.addEventListener("click", clearScores);
BackBtn.addEventListener("click", GoBack);