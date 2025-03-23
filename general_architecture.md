The following is a reference for programmers for how things are generally structured.

The language learning app itself is a program that parses .json lesson files and displays them as HTML exercise-by-exercise, recording data in firebase.

.json lesson files are structured as a list of dictionaries, where each dictionary represents an exercise. Each dictionary has a “type” key to represent the lesson type and other key-value pairs as necessary. Details are listed in the documentation for the lesson editor.

Survey data, completed lessons, etc are in firestore. Details can be found in the firebase console.

User authentication is handled by firebase. Security is handled primarily by firebase auth rules.

There are a number of global variables. This is an intentional architectural decision. Lesson and exercise index are tracked in this way, as are other state-keeping variables.

The build process is as follows: src/index.js is compiled with webpack to dist/main.js, which is moved to public/ with everything else. Everything is then deployed to firebase. The command to build and deploy is “npm run build”  
