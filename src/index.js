//firebase stuff
// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app"
//import { getAnalytics } from "firebase/analytics"
//
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, addDoc, collection, serverTimestamp, query, where, orderBy, limit, getDoc, getDocs, updateDoc, Timestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyBBtZvv_iBPwFrL9GWPKo4XBywXZysXYOs",
authDomain: "language-learning-app-ff8ec.firebaseapp.com",
projectId: "language-learning-app-ff8ec",
storageBucket: "language-learning-app-ff8ec.appspot.com",
messagingSenderId: "563354718576",
appId: "1:563354718576:web:15d37b1e22898da7137fb5",
measurementId: "G-9CRKZX46B8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// App Code

var completedLessons;
var completedLessonsOfflineCache = [];
var logged_in = false;
var lessonScript;
var exerciseNumber;
var lessonNumber = 0;
var selectedValue = "";
var currentUser = undefined;
var cardQueue = [];
var justLoaded = true;
var practiceCards = [];
var vocabs = [];
var sounds = {};
var soundsInLengthOrder = [];
var speakerNumber = 2;
var showRomanization = false;
var firstLesson = 1;


function gtag_report_conversion(url) {
    var callback = function () {
        if (typeof(url) != 'undefined') {
            window.location = url;
        }
    };
    gtag('event', 'conversion', {
        'send_to': 'AW-16565511483/wUYSCO61p9kZELvKhts9',
        'value': 2.0,
        'currency': 'USD',
        'event_callback': callback
    });
    return false;
}

function gtag_report_conversion_custom(value) {
    var callback = function () {
        if (typeof(url) != 'undefined') {
            window.location = url;
        }
    };
    gtag('event', 'conversion', {
        'send_to': 'AW-16565511483/wUYSCO61p9kZELvKhts9',
        'value': value,
        'currency': 'USD',
        'event_callback': callback
    });
}


function hamburgerTray() {
    const hamburgerTray = document.getElementById('hamburger-container');
    const hamburgerButton = document.getElementById('hamburgerbutton');
    if (hamburgerTray.hidden) {
        //open hamburger tray
        hamburgerTray.hidden = false;
        hamburgerButton.classList.add('selected');
    } else {
        //close hamburger tray
        hamburgerTray.hidden = true;
        hamburgerButton.classList.remove('selected');
    }
}

function lessonSelectorMenu() {
    const lessonSelectorTray = document.getElementById('lessonselector-container');
    const lessonSelectorButton = document.getElementById('lessonselectorbutton');
    if (lessonSelectorTray.hidden) {
        //open lessonSelector tray
        lessonSelectorTray.hidden = false;
        lessonSelectorButton.classList.add('selected');
    } else {
        //close lessonSelector tray
        lessonSelectorTray.hidden = true;
        lessonSelectorButton.classList.remove('selected');
    }
}

function authTray() {
    const authTray = document.getElementById('auth-container');
    const authButton = document.getElementById('authbutton');
    if (authTray.hidden) {
        //open auth tray
        authTray.hidden = false;
        authButton.classList.add('selected');
    } else {
        //close auth tray
        authTray.hidden = true;
        authButton.classList.remove('selected');
    }
}
function loginEmail() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            currentUser = userCredential.user;
            feedbackArea.innerHTML = '<div style="color: green;">You have signed in successfully.</div>';
            authTray();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode == 'auth/invalid-credential') {
                feedbackArea.innerHTML = '<div style="color: red;">Wrong username/password</div>';
            } else if (errorCode == 'auth/invalid-email') {
                feedbackArea.innerHTML = '<div style="color: red;">Invalid email</div>';
            } else if (errorCode == 'auth/missing-password') {
                feedbackArea.innerHTML = '<div style="color: red;">Missing password</div>';
            } else {
                feedbackArea.innerHTML = '<div style="color: red;">Error signing in: ' + errorCode + ', ' + errorMessage + '</div>';
            }
        });
}
function signupEmail() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            currentUser = userCredential.user;
            feedbackArea.innerHTML = '<div style="color: green;">You have signed up successfully and are now signed in.</div>';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            feedbackArea.innerHTML = '<div style="color: red;">Error signing up: ' + errorCode + ', ' + errorMessage + '</div>';
            //alert("Error signing up: " + errorCode + errorMessage);
        });
}
function resetPassword() {
    const email = document.getElementById("email").value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Error resetting password: " + errorCode + ', ' + errorMessage);
        });
}
function logout() {
    signOut(auth).then(() => {
            feedbackArea.innerHTML = '<div style="color: green;">You have signed out successfully.</div>';
    }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            feedbackArea.innerHTML = '<div style="color: red;">Error logging out: ' + errorCode + ', ' + errorMessage + '</div>';
    });
}
function loginGoogle() {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            currentUser = user;
            feedbackArea.innerHTML = '<div style="color: green;">You have signed in successfully with Google.</div>';
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            feedbackArea.innerHTML = '<div style="color: red;">Error signing in: ' + errorCode + ', ' + errorMessage + ", credential: " + credential + '</div>';
        });
}
window.hamburgerTray = hamburgerTray;
window.lessonSelectorMenu = lessonSelectorMenu;
window.authTray = authTray;
window.signupEmail = signupEmail;
window.loginEmail = loginEmail;
window.resetPassword = resetPassword;
window.logout = logout;
window.loginGoogle = loginGoogle;

function showHideRomanization() {
    const romanizations = document.querySelectorAll('.romanization');
    const rButton = document.getElementById("showhideromanizationbutton");
    if (showRomanization) {
        showRomanization = false;
        rButton.classList.remove('selected');
        romanizations.forEach(r => {
            r.hidden = true;
        });
    } else {
        showRomanization = true;
        rButton.classList.add('selected');
        romanizations.forEach(r => {
            r.hidden = false;
        });
    }
}
window.showHideRomanization = showHideRomanization;

function lessonGo() {
    const lnum = document.getElementById("lessonnumber");
    loadLesson(Number(lnum.value));
}
window.lessonGo = lessonGo;

/*
function onClickRadioButton() {
    // Remove 'selected' class from all options
    const radioOptions = document.querySelectorAll('.radio-option');
    radioOptions.forEach(opt => {
        opt.classList.remove('selected');
    });

    // Add 'selected' class to the clicked option
    option.classList.add('selected');

    // Handle the selected value (optional)
    selectedValue = option.innerHTML;
    console.log('Selected value:', selectedValue);
}
*/

async function pushLessonProgress(progress) {
    const lesson = progress["lesson"];
    const exercise = progress["exercise"];
    const submittedAnswer = progress["submittedAnswer"];
    const correctAnswer = progress["correctAnswer"];
    const correctness = progress["correctness"];
    var uid = "guest";
    if (currentUser) { 
        uid = currentUser.uid;
    }
    try {
        var dict = {
            uid: uid,
            lesson: lesson,
            exercise: exercise,
            completionTimestamp: serverTimestamp(),
        }
        if (progress["correctAnswerExists"]) {
            dict = {
                uid: uid,
                lesson: lesson,
                exercise: exercise,
                completionTimestamp: serverTimestamp(),
                correctAnswer: correctAnswer,
                submittedAnswer: submittedAnswer
                //correctness: correctness
            }
        }
        const docRef = await addDoc(collection(db, "completed_lessons"), dict);
        console.log("Sending lesson progress to server -- Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error sending lesson progress to server -- Error adding document: ", e);
    }
}

async function pushSurveyData(question, answer) {
    var uid = "guest";
    if (currentUser) { 
        uid = currentUser.uid;
    }
    try {
        const docRef = await addDoc(collection(db, "survey_responses"), {
            uid: uid,
            question: question,
            answer: answer,
            completionTimestamp: serverTimestamp()
        });
        console.log("Sending survery data to server -- Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error sending survery data to server -- Error adding document: ", e);
    }
}

async function takeSurveyAnswer(question, action) {
    //get the answer to a survey question and call the function action with that answer as the sole argument
    const q = query(collection(db, "survey_responses"), where("uid", "==", currentUser.uid), where("question", "==", question), limit(1));
    const snapshot = await getDocs(q);
    if(snapshot.size > 0) {
        snapshot.forEach((doc) => {
            let d = doc.data();
            action(d.answer);
        });
    } else {
        console.error("Error: No survey answer found.");
    }
}
window.takeSurveyAnswer = takeSurveyAnswer;

async function addUpdateCard(card, review = undefined) {
    const q = query(collection(db, "cards"), where("uid", "==", currentUser.uid), where("card", "==", card), limit(1));
    const snapshot = await getDocs(q);
    if(snapshot.size > 0) {
        snapshot.forEach((doc) => {
            let d = doc.data();
            if (review != undefined) { //prevent double-introducing cards
                const now = Timestamp.now();
                let timestamps = d.timestamps + [serverTimestamp()];
                let reviews = d.reviews + [review];
                //calculate review intervals
                //TODO: change to ML review intervals
                const review_period_minutes = [10, 30, 60*24, 3*60*24, 7*60*24, 30*60*24, 60*60*24, 365*60*24, 1000*60*24, 10000*60*24]; //0 concecutive correct reviews -- 10 minute wait, 1 -- 30 minute wait, 2 -- 1 day wait, etc.
                let numCorrect = 0;
                for (let i = reviews.length; i--; i <= 0) {
                    if (reviews[i]) {
                        numCorrect += 1;
                    } else {
                        break;
                    }
                }
                const review_period = 60000*review_period_minutes[numCorrect];
                const laterTime = new Date(Date.now() + review_period);
                const reviewTimestamp = Timestamp.fromDate(laterTime);
                try {
                    const docRef = updateDoc(doc.ref, {
                        mostRecentTimestamp: serverTimestamp(),
                        timestamps: timestamps,
                        reviews: reviews,
                        nextReview: reviewTimestamp
                    });
                    console.log("Card update -- Document written with ID: ", docRef.id);
                } catch (e) {
                    console.error("Error updating card: ", e);
                }
            }
        });
    } else {
        //card does not exist, so add it
        try {
            const review_period = 60000*10; //10 minutes
            const laterTime = new Date(Date.now() + review_period);
            const reviewTimestamp = Timestamp.fromDate(laterTime);
            const docRef = await addDoc(collection(db, "cards"), {
                uid: currentUser.uid,
                card: card,
                mostRecentTimestamp: serverTimestamp(),
                timestamps: [],
                reviews: [], //where true is correct review and false is incorrect
                nextReview: reviewTimestamp
            });
            console.log("New card -- Card written with ID: ", docRef.id);
        } catch (e) {
            console.error("New card -- Error adding document: ", e);
        }
    }
}

function pushNewCards() {
    const timestamp = serverTimestamp();
    for (const c in cardQueue) {
        addUpdateCard(cardQueue[c]);
    }
    cardQueue = [];
}

async function getPracticeCards() {
    //const now = {nanoseconds: 0, seconds: Date.now()/1000};
    const now = Timestamp.now();
    const q = query(collection(db, "cards"), where("uid", "==", currentUser.uid), where("nextReview", "<=", now));
    const snapshot = await getDocs(q);
    console.log(snapshot.size);
    snapshot.forEach((doc) => {
        let d = doc.data();
        practiceCards.push(d.card);
    });
    return snapshot.size;
}

function generateCardPractice() {
    //getPracticeCards();
    console.log(practiceCards);
    var output = '<p>no cards -- press "next"</p>';
    if (practiceCards.length > 0) {
        let card = practiceCards[practiceCards.length - 1];
        output = '<p class="prompt">' + card + '</p>';
        output += '<div><button onclick="document.getElementById(\'hiddencard\').hidden = false;">show</button></div><div id="hiddencard" hidden>' + vocabs[card] + '</div>';
        output += '<div><button onclick="replaceCard(\'known\')">known</button><button onclick="replaceCard(\'unknown\')">unknown</button></div>';
    }
    return output;
}

window.replaceCard = function (known) {
    const k = known == "known";
    const card = practiceCards.pop();
    const cardarea = document.getElementById("cardarea");
    cardarea.innerHTML = generateCardPractice();
    addUpdateCard(card, k);
}

function preloadSounds(soundsToLoad) {
    sounds = {};
    speakerNumber = document.getElementById("speakers").value;
    for (var s in soundsToLoad) {
        sounds[soundsToLoad[s]] = new Audio("sounds/" + soundsToLoad[s] + speakerNumber + ".wav");
    }
    soundsInLengthOrder = soundsToLoad.sort((a, b) => b.length - a.length);
}
window.preloadSounds = preloadSounds;

function insertSounds(text) {
    //for (var s in sounds) {
    if (soundsInLengthOrder.length > 0) {
        const pattern = new RegExp(soundsInLengthOrder.join('|'), 'g');
        console.log(soundsInLengthOrder);
        text = text.replace(pattern, s => `<span class="sound" onclick="playSound('${s}')">${s}</span>`);
    }
    return text;
}

function playSound(sound) {
    sounds[sound].play();
}
window.playSound = playSound;

function displayExercise (exercise) {
    console.log(JSON.stringify(exercise, null, 2));
    if (exerciseNumber + 1 in lessonScript) {
        if (lessonScript[exerciseNumber + 1]["type"] == "cardpractice") {
            getPracticeCards(); //preload cards for next exercise
        }
    }
    if (exercise["type"] == "preloadsounds") {
        //sounds are preloaded on lesson load
        //preloadSounds(exercise["sounds"]);
        exerciseNumber += 1;
        if (lessonScript.length > exerciseNumber) {
            displayExercise(lessonScript[exerciseNumber]);
        }
        return;
    }
    var innerText = "";
    if (typeof exercise["pretext"] != "undefined") {
        innerText += "<h5 class=\"pretext\">" + exercise["pretext"] + "</h5>";
    }
    if (typeof exercise["prompt"] != "undefined") {
        //innerText += "<p class=\"prompt\">" + exercise["prompt"] + "</p>";
        innerText += exercise["prompt"];
    }
    innerText = insertSounds(innerText);
    if (typeof exercise["options"] != "undefined") {
        if (exercise["type"] == "mc" || exercise["type"] == "survey" || exercise["type"] == "intro" || exercise["type"] == "outro" || exercise["type"] == "story") {
            innerText += '<div class="radio-group" id="radio-group">';
            innerText += '</div>';
        }
        else if (exercise["type"] == "ft" || exercise["type"] == "tt" || exercise["type"] == "ts" || exercise["type"] == "t") {
            innerText += '<div id="translated-group"></div>';
            innerText += '<p>word bank:</p>';
            innerText += '<div id="word-bank">';
            innerText += '</div>';
        }
        else {
            console.error("Unhandled prompt type!");
        }
    }
    if (exercise["type"] == "drawing") {
        innerText += "<div class='canvascontainer'><img id='canvasbg' class='backgroundimage'>";
        innerText += "<canvas id='canvas' class='drawing' width=400 height=400></canvas></div>";
        innerText += "<p><button id='clearcanvas'>Clear and reset</button></p>";
    }
    if (exercise["type"] == "newcards") {
        innerText += '<p class="prompt">New cards:</p><ul class="cardannouncement">';
        for (var c in exercise["cards"]) {
            innerText += '<li class="cardannouncement">' + exercise["cards"][c] + '</li>';
            cardQueue.push(exercise["cards"][c]);
        }
        innerText += '</ul>';
    }
    if (exercise["type"] == "cardpractice") {
        innerText += '<div id="cardarea">';
        innerText += generateCardPractice();
        innerText += '</div>';
    }

    exerciseArea.innerHTML = innerText;

    if (typeof exercise["options"] != "undefined") {
        if (exercise["type"] == "mc" || exercise["type"] == "survey" || exercise["type"] == "intro" || exercise["type"] == "outro" || exercise["type"] == "story") {
            const radioGroup = document.getElementById("radio-group");
            for (var o in exercise["options"]) {
                let button = document.createElement('button');
                button.classList.add("radio-option");
                button.setAttribute('role', 'button');
                button.setAttribute('aria-pressed', 'false');
                button.setAttribute('tabindex', '0');
                button.setAttribute('data-option', exercise["options"][o]);
                button.innerHTML = exercise["options"][o];
                if (soundsInLengthOrder.length > 0) {
                    //add sound if relevant
                    const pattern = new RegExp(soundsInLengthOrder.join('|'), 'g');
                    const matches = exercise["options"][o].match(pattern);
                    if (matches != null) {
                        if (matches.length > 0) {
                            button.classList.add("sound");
                            button.setAttribute("onclick", 'playSound(\'' + matches[0] + '\')');
                        }
                    }
                }
                radioGroup.appendChild(button);
            }
        }
        else if (exercise["type"] == "ft" || exercise["type"] == "tt" || exercise["type"] == "ts" || exercise["type"] == "t") {
            const wordBank = document.getElementById("word-bank");
            for (var o in exercise["options"]) {
                let button = document.createElement('button');
                button.classList.add("translation-option");
                button.setAttribute('role', 'button');
                button.setAttribute('aria-pressed', 'false');
                button.setAttribute('tabindex', '0');                button.setAttribute('data-option', exercise["options"][o]);
                button.innerHTML = exercise["options"][o];
                if (soundsInLengthOrder.length > 0) {
                    //add sound if relevant
                    const pattern = new RegExp(soundsInLengthOrder.join('|'), 'g');
                    const matches = exercise["options"][o].match(pattern);
                    if (matches != null) {
                        if (matches.length > 0) {
                            button.classList.add("sound");
                            button.setAttribute("onclick", 'playSound(\'' + matches[0] + '\')');
                        }
                    }
                }
                wordBank.appendChild(button);
            }
        }
        else {
            console.error("Unhandled prompt type!");
        }
    }

    if (typeof exercise["by"] != "undefined") {
        exerciseArea.innerHTML += '<div class="flex-grow"></div><div class="by-line">' + exercise["by"] + '</div>';
    }

    //radio button click listener
    const radioOptions = document.querySelectorAll('.radio-option');
    radioOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove 'selected' class from all options
            radioOptions.forEach(opt => {
                opt.classList.remove('selected');
                opt.ariaPressed = false;
            });

            // Add 'selected' class to the clicked option
            option.classList.add('selected');
            option.ariaPressed = true;

            // Handle the selected value
            selectedValue = option.getAttribute("data-option");
        });
    });
    //word bank button click listener
    const translationOptions = document.querySelectorAll('.translation-option');
    translationOptions.forEach(option => {
        option.addEventListener('click', function() {
            console.log("word clicked");
            const translatedGroup = document.getElementById('translated-group');
            const wordBank = document.getElementById('word-bank');
            if (translatedGroup.contains(option)) {
                //already selected, so deselect it
                //option.classList.remove('selected');
                option.ariaPressed = false;
                wordBank.appendChild(option);
            } else {
                //option.classList.add('selected');
                option.ariaPressed = true;
                translatedGroup.appendChild(option);
            }
        });
    });
    if (innerText.includes("loadFromSurvey")){
        const toLoadFromSurvey = document.querySelectorAll(".loadFromSurvey");
        toLoadFromSurvey.forEach((e) => {
            takeSurveyAnswer(e.getAttribute("data-question"), function (answer) {
                e.innerText = answer;
            });
        });
    }

    if (exercise["type"] == "drawing") {
        var canvas = document.getElementById("canvas");
        var clearbutton = document.getElementById("clearcanvas");
        const ctx = canvas.getContext('2d');
        let currentStroke = 0;
        let isDrawing = false;
        let img = document.getElementById("canvasbg");

        ctx.lineWidth = 16;

        function loadStroke() {
            let imgToLoad = exercise["tracing"][currentStroke];
            if (imgToLoad) {
                img.src = `img/tracing/${imgToLoad}.png`;
            }
        }

        function resetCanvas() {
            currentStroke = 0;
            loadStroke();
            ctx.clearRect(0,0,canvas.width,canvas.height);
        }
        clearbutton.onclick = resetCanvas;

        /*
        function handleStart(e) {
            e.preventDefault();
            canvas.isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX*canvas.width/canvas.clientWidth,
                e.offsetY*canvas.height/canvas.clientHeight);
        }
        canvas.addEventListener('mousedown', handleStart);

        function handleMove(e) {
            if (canvas.isDrawing) {
                e.preventDefault();
                ctx.lineTo(e.offsetX*canvas.width/canvas.clientWidth,
                    e.offsetY*canvas.height/canvas.clientHeight);
                ctx.stroke();
            }
        }
        canvas.addEventListener('mousemove', handleMove);

        function handleEnd() {
            canvas.isDrawing = false;
            ctx.closePath();
            currentStroke += 1;
            loadStroke();
        }
        canvas.addEventListener('mouseup', handleEnd);
        canvas.addEventListener('mouseout', handleEnd);
        */


        function getCoordinates(e) {
            if (e.touches) {
                const rect = canvas.getBoundingClientRect();
                return {
                    x: (e.touches[0].clientX - rect.left) * canvas.width / rect.width,
                    y: (e.touches[0].clientY - rect.top) * canvas.height / rect.height
                };
            } else {
                return {
                    x: e.offsetX * canvas.width / canvas.clientWidth,
                    y: e.offsetY * canvas.height / canvas.clientHeight
                };
            }
        }

        function handleStart(e) {
            e.preventDefault();
            canvas.isDrawing = true;
            const coords = getCoordinates(e);
            ctx.beginPath();
            ctx.moveTo(coords.x, coords.y);
        }

        function handleMove(e) {
            if (canvas.isDrawing) {
                e.preventDefault();
                const coords = getCoordinates(e);
                ctx.lineTo(coords.x, coords.y);
                ctx.stroke();
            }
        }

        function handleEnd(e) {
            e.preventDefault();
            canvas.isDrawing = false;
            ctx.closePath();
            currentStroke += 1;
            loadStroke();
        }

        canvas.addEventListener('mousedown', handleStart);
        canvas.addEventListener('mousemove', handleMove);
        canvas.addEventListener('mouseup', handleEnd);
        canvas.addEventListener('mouseout', handleEnd); // To handle the case when the mouse leaves the canvas

        canvas.addEventListener('touchstart', handleStart, { passive: false });
        canvas.addEventListener('touchmove', handleMove, { passive: false });
        canvas.addEventListener('touchend', handleEnd, { passive: false });
        canvas.addEventListener('touchcancel', handleEnd, { passive: false }); // To handle the case when the touch is interrupted


        // Load the first stroke by default
        loadStroke();
    }

    const romanizations = document.querySelectorAll('.romanization');
    const rButton = document.getElementById("showhideromanizationbutton");
    if (romanizations.length == 0) {
        rButton.hidden = true;
    } else {
        rButton.hidden = false;
    }
    showRomanization = false;
    rButton.classList.remove('selected');
    romanizations.forEach(r => {
        r.hidden = true;
    });

    if (exercise["type"] == "requiresignin") {
        if (logged_in) {
            nextButtonClicked();
        } else {
            nextButton.hidden = true;
            //document.getElementById("nextButton").hidden = true;
        }
    }
}

function loadLesson(lessonIndex, exerciseIndex = 0) {
    const url = "lessons/lesson" + lessonIndex + ".json";
    fetch(url)
        .then((response) =>  {
            if (response.ok) {
                response.json()
                    .then((json) => {
                        lessonNumber = lessonIndex
                        const j = json;
                        lessonScript = j;
                        if (exerciseIndex in j) {
                            exerciseNumber = exerciseIndex;
                        } else {
                            //assume that the user just tried to go too high and just send them to the last one
                            //TODO: go to lesson selector instead
                            exerciseNumber = j.length - 1;
                        }
                        for (var e in j) {
                            const exercise = j[e];
                            if (exercise["type"] == "preloadsounds") {
                                preloadSounds(exercise["sounds"]);
                                exerciseNumber += 1;
                                if (lessonScript.length > exerciseNumber) {
                                    displayExercise(lessonScript[exerciseNumber]);
                                }
                                return;
                            }
                        }
                        displayExercise(j[exerciseNumber]);
                        let value = 0;
                        if (lessonNumber == 0) {
                            value = 0.10;
                        } else {
                            value = lessonNumber / 2;
                            if (value > 2) {
                                value = 1;
                            }
                        }
                        gtag_report_conversion_custom(value);
                    });
            } else {
                feedbackArea.innerHTML = "The lesson could not be retrieved. Please sign up to the mailing list to be notified when that lesson is done (<a href=\"https://groups.google.com/g/immersion-quest\">https://groups.google.com/g/immersion-quest</a>). A discussion board is also available there in addition to normal updates. It is possible that there was a network error when retrieving the lesson.";
            }
        });
}
window.loadLesson = loadLesson;

function nextButtonClicked() {
    const exercise = lessonScript[exerciseNumber];
    if (exercise["type"] == "survey") {
        pushSurveyData(exercise["prompt"], selectedValue);
    }

    var correctAnswer = "";
    var correctness = false;
    var submittedAnswer = "";
    var correctAnswerExists = false;
    var correctAnswerToDisplay = "";
    if (typeof exercise["options"] != "undefined") {
        if (typeof exercise["answer"] != "undefined") {
            if (exercise["type"] == "ft" || exercise["type"] == "tt" || exercise["type"] == "ts" || exercise["type"] == "t") {
                const translatedGroup = document.getElementById('translated-group');
                var answerWords = [];
                for (let i = 0; i < translatedGroup.children.length; i++) {
                    answerWords.push(translatedGroup.children[i].innerHTML);
                }
                submittedAnswer = answerWords.join(" ");
                if (typeof exercise["answer"] == "string") {
                    //treat as regex
                    correctAnswer = submittedAnswer.match(exercise["answer"]);
                    if (correctAnswer != null) {
                        correctAnswer = correctAnswer[0];
                        correctness = correctAnswer == submittedAnswer;
                    } else {
                        correctness = false;
                    }
                    correctAnswer = exercise["answer"];
                    correctAnswerToDisplay = correctAnswer.replace(/\(([^)]+)\)\?/g, (match, p1) => {return `<ruby>${p1}<rt>optional</rt></ruby>`;}).replace(/\|/g, " <span style=\"color: blue;\">or</span> ").replace("(", "<span style=\"color: blue;\">(</span>").replace(")", "<span style=\"color: blue;\">)</span>");
                } else {
                    //if list, match exactly
                    correctAnswer = exercise["answer"].join(" ");
                    correctness = correctAnswer == submittedAnswer;
                }
            } else {
                correctAnswer = exercise["answer"];
                correctness = correctAnswer == selectedValue;
                submittedAnswer = selectedValue;
            }
            if (correctness) {
                feedbackArea.innerHTML = '<div style="color: green;">Correct!</div>';
            } else {
                if (correctAnswerToDisplay == "") {
                    correctAnswerToDisplay = correctAnswer;
                }
                var wrongAnswerText = '<div style="color: red;">Incorrect.</div> Correct answer: ' + correctAnswerToDisplay;
                if (typeof exercise["wrong-answer-text"] != "undefined") {
                    wrongAnswerText = exercise["wrong-answer-text"];
                }
                feedbackArea.innerHTML = wrongAnswerText;
                //TODO: remove hearts
            }
            correctAnswerExists = true;
        } else {
            feedbackArea.innerHTML = "";
        }
    }
    pushLessonProgress({
        "lesson": lessonNumber,
        "exercise": exerciseNumber,
        "correctAnswer": correctAnswer,
        "correctness": correctness,
        "submittedAnswer": submittedAnswer,
        "correctAnswerExists": correctAnswerExists
    });
    if (logged_in) {
        pushNewCards();
    } else {
        completedLessonsOfflineCache.push({"lesson": lessonNumber, "exercise": exerciseNumber});
    }
    if (exercise["type"] == "survey" && selectedValue == "skip past hiragana and katakana") {
        loadLesson(66);//TODO: change
    } else {
        exerciseNumber += 1;
        selectedValue = "";
        if (lessonScript.length > exerciseNumber) {
            displayExercise(lessonScript[exerciseNumber]);
        } else {
            //TODO: add lesson celebration stuff
            //TODO: go to lesson selector instead of just advancing lessons
            lessonNumber += 1;
            loadLesson(lessonNumber);
        }
    }
}

async function loadMostRecentLesson() {
    const q = query(collection(db, "completed_lessons"), where("uid", "==", currentUser.uid), orderBy("completionTimestamp", "desc"), limit(1));
    const snapshot = await getDocs(q);
    if(snapshot.size > 0) {
        snapshot.forEach((doc) => {
            let d = doc.data();
            loadLesson(d.lesson, d.exercise);
        });
    } else {
        //no lessons completed, just go to the first one
        loadLesson(firstLesson); //TODO: test survey vs no survey
    }
}

function loadTestLesson() {
    let files = this.files;
    if (files.length == 0) {
        feedbackArea.innerHTML = "No lesson files uploaded";
    } else {
        files[0].text().then((text) => {
            const j = JSON.parse(text);
            lessonScript = j;
            lessonNumber = -1;
            exerciseNumber = 0;
            for (var e in j) {
                const exercise = j[e];
                if (exercise["type"] == "preloadsounds") {
                    preloadSounds(exercise["sounds"]);
                    exerciseNumber += 1;
                    if (lessonScript.length > exerciseNumber) {
                        displayExercise(lessonScript[exerciseNumber]);
                    }
                    return;
                }
            }
            displayExercise(j[0]);
        });
    }
}

function test() {
    //start lesson tester
    exerciseArea.innerHTML = "<p>Upload test lesson</p><input id=\"testlessonupload\" type=\"file\" accept=\".json\">";
    let testlessonupload = document.getElementById("testlessonupload");
    testlessonupload.addEventListener("change", loadTestLesson);
}
window.test = test;

const db = getFirestore(app);

const bottombar = document.getElementById('bottombar');
const exerciseArea = document.getElementById('exercise');
const nextButton = document.getElementById('nextButton');
const feedbackArea = document.getElementById('feedbackArea');

nextButton.onclick = nextButtonClicked;

auth.onAuthStateChanged(user => {
    const loginContainer = document.getElementById('login-container');
    const logoutContainer = document.getElementById('logout-container');
    if (user) {
        currentUser = user;
        console.log("logged in");
        logged_in = true;
        loginContainer.hidden = true;
        logoutContainer.hidden = false;
        nextButton.hidden = false;

        if (completedLessonsOfflineCache != []) {
            for (p in completedLessonsOfflineCache) {
                pushLessonProgress(p);
            }
        }
        if (cardQueue != []) {
            pushNewCards();
        }
        if (justLoaded) {
            //TODO: load menu
            loadMostRecentLesson();
        }
    } else {
        currentUser = undefined;
        console.log("not logged in");
        logged_in = false;
        loginContainer.hidden = false;
        logoutContainer.hidden = true;
        if (justLoaded) {
            loadLesson(firstLesson);
        }
    }
    justLoaded = false;
});

document.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
      nextButtonClicked();
  }
});

fetch("lessons/vocab.json")
    .then((response) => response.json())
    .then((json) => {
        vocabs = json;
    });
