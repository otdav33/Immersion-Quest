Here is how to get/use the lesson tester:

1. Go to the web app.  
2. Open the web inspector. On some browsers, you right click on the web page, then click "Inspect."  
3. Go to the web inspector console. It should be a tab.  
4. In the console (make sure you have the console selected), type "test()" (without quotes), then hit enter.  
5. A file selection prompt should appear. Use it to upload the .json lesson file you would like to test. On success, it should load the lesson immediately. On failure, it will give an error. If it is a JSON parsing error, you probably have a syntax error in your lesson. If you need help with an error, include a screenshot of the error and also attach the lesson file you are working on.

Notes:

It will say "Document written with ID" or "new card written with id" with each lesson. That is just logging that the server was updated with your lesson progress.

When testing, the lesson number is internally set to \-1. This means that upon completion of the test lesson, it will spit you out to the beginning of the first lesson (which at the time of writing is the survey). If you get stuck at lesson \-1 and it causes an error, test a lesson and complete it.