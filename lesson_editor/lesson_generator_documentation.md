The lesson generator is available at the URL [https://lessoneditor-b11a7.web.app/](https://lessoneditor-b11a7.web.app/).

It is a convenience utility that generates .json lesson files with its graphical interface.

Usage:

1. For each exercise:  
   1. Select the exercise type.  
      * survey – Gives a survey question to the user. Answers are logged to the server and may be retrieved and used in later lessons (which may be useful for interactive lessons of low to medium complexity).  
      * intro – Used for introducing a concept or vocabulary word. Autofills with a HTML template for furigana. For example, the prompt "\<ruby\>目\<rt\>め\</rt\>\</ruby\> \- eye" would introduce the character “目” with “め” on top of it as “eye.” Convention is to give them one option with the character that you are introducing. In the final product, they will be able to click on that option and have the character read to them.  
      * mc – Multiple choice. Remember to provide a correct answer when appropriate. Keep in mind that Japanese full-width punctuation characters (“。？：！”) are different characters than normal punctuation characters (“.?:\!”) and it will look wrong if you mix Japanese characters with English punctuation and vice-versa.  
      * t – Translation type exercise (or any exercise where you pick words from a word bank). Convention is to have the phrase to translate and a colon at the end (use the correct one ：/:).  Remember to include a correct answer if desired. You can put “\<ruby class=\\"required\\"\>です\<rt\>required\</rt\>\</ruby\>" instead of “です” to make it required to use that word, but also include that whole thing in the answer section so that it matches exactly. If you are entering it into the lesson generator, you don’t put the backslashes before the quotes, so it would be “\<ruby class="required"\>です\<rt\>required\</rt\>\</ruby\>” instead. If you are editing a .json file, you need the backslashes.  
      * storyintro – for the title of a story section  
      * story – for story segments  
      * newcards – Adds new cards to the flashcard deck (put the cards in the options field for the purposes of using the generator). Convention is to include only the word to study in the target language.  
      * cardpractice – will open an area to use to review cards (do this near the end of every lesson after the point where cards start getting introduced)  
      * outro – for closing remarks (optional)  
   2. Input pretext (words that go above the exercise to introduce the exercise) if and only if desired.  
   3. Include a prompt. (Note: you can navigate quickly between fields by tabbing around)  
   4. Include answer options if appropriate for your exercise in the “options” field.  
   5. Include the correct answer if appropriate for your exercise in the “answer” field.  
2. If an additional exercise is desired, click the plus button.  
3. Once done (or periodically as you work), click the “Generate” button in the bottom left corner, then copy the output JSON lesson from the text box next to it.  
4. Paste that JSON into a .json lesson file with an appropriate name.  
5. Edit the file if desired with a text editor of your choice.  
   1. Reorder exercises as you please. Make sure that all exercises except for the last one have a comma at the end.  
   2. You may add new fields to the end. One that is not included with the lesson generator is "wrong-answer-text" which gives a custom wrong answer message. Another is the “by” line, which you can add to the last exercise in the lesson to say who wrote it like this: {"type": "outro", "prompt": "end of lesson", "by": "lesson written by XXX"}  which adds the message in the bottom corner of the exercise.  
      Make sure that every entry has a comma after it except for the last one.  
   3. Other editing is also allowed. If you feel like you need some custom thing, please reach out.  
   4. You can use regex for tt, ft and ts type lessons instead of lists of words for answers if desired so that you can accept multiple correct answers.  
   5. Make sure that all quotes and brackets match up. Keep in mind that curly quotes (“”) are different characters than normal quotes (""). Syntax highlighting in your text editor should point this out for you.  
6. The .json file is ready for use.