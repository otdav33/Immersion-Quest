/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var json_stringify_pretty_compact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! json-stringify-pretty-compact */ \"./node_modules/json-stringify-pretty-compact/index.js\");\n\n\nconst template = [\n{\"type\": \"survey\", \"prompt\": \"\", \"options\": [\"\", \"\", \"\", \"\", \"\"]},\n{\"type\": \"mc\", \"prompt\": \"：\", \"options\": [\"\", \"\", \"\", \"\"], \"answer\": \"\"},\n//{\"type\": \"mc\", \"prompt\": \":\", \"options\": [\"\", \"\", \"\", \"\", \"\", \"\"], \"answer\": \"\", \"wrong-answer-text\": \"\"},\n{\"type\": \"ft\", \"prompt\": \"：\", \"options\": [\"\", \"\", \"\", \"\", \"\", \"\"], \"answer\": [\"\", \"\"]},\n{\"type\": \"tt\", \"prompt\": \":\", \"options\": [\"\", \"\", \"\", \"\"], \"answer\": [\"\", \"\"]},\n{\"type\": \"ts\", \"pretext\": \"\", \"options\": [\"\", \"\", \"\", \"\", \"\", \"\"], \"answer\": [\"\", \"\", \"\", \"\", \"\", \"\"]},\n{\"type\": \"intro\", \"pretext\": \"\", \"prompt\": \"<ruby>目<rt>め</rt></ruby> - eye\", \"options\": [\"目\"]},\n{\"type\": \"storyintro\", \"prompt\": \"<h1>Story X: Title</h1>\"},\n{\"type\": \"story\", \"pretext\": \"\", \"prompt\": \"\", \"options\": [\"\", \"\"]},\n{\"type\": \"storyoutro\", \"prompt\": \"\"},\n{\"type\": \"newcards\", \"cards\": [\"\", \"\", \"\", \"\", \"\", \"\"]},\n{\"type\": \"cardpractice\"},\n{\"type\": \"outro\", \"prompt\": \"\"}\n]\n\nconst formContainer = document.getElementById(\"formContainer\");\nconst outputBox = document.getElementById(\"output\");\nconst messageArea = document.getElementById(\"messageArea\");\nconst generateButton = document.getElementById(\"generateButton\");\n\nfunction makeSureEnoughFields() {\n    const e = this;\n    const innerBox = e.parentElement;\n    const inputs = innerBox.querySelectorAll(\"input\");\n    const secondlastInput = inputs[inputs.length - 2];\n    if (secondlastInput.value != \"\") {\n        let i = document.createElement(\"input\");\n        i.type = \"text\";\n        i.classList.add(e.classList[0]);\n        i.addEventListener(\"change\", makeSureEnoughFields);\n        innerBox.appendChild(i);\n    }\n}\n\nfunction changeType(e) {\n    const extrasBox = e.parentElement.querySelector(\".extrasBox\");\n    if (e.value == \"mc\") {\n        extrasBox.innerHTML = ' answer<input type=\"text\" class=\"answer\" />';\n    } else if (e.value == \"ft\" || e.value == \"tt\" || e.value == \"ts\") {\n        extrasBox.innerHTML = ' answer<span class=\"answersBox\"><span class=\"innerBox\"><input type=\"text\" class=\"answer\" /><input type=\"text\" class=\"answer\" /></span></span>';\n        formContainer.querySelectorAll(\".answer\").forEach((a) => {\n            a.addEventListener(\"change\", makeSureEnoughFields);\n        });\n    } else {\n        extrasBox.innerHTML = \"\";\n        const promptBox = e.parentElement.querySelector(\".prompt\");\n        if (e.value == \"intro\" && promptBox.value == \"\") {\n            promptBox.value = \"<ruby><rt></rt></ruby> - \";\n        } else if (e.value == \"storyintro\" && promptBox.value == \"\") {\n            promptBox.value = \"<h1>Story X: Title</h1>\";\n        } else if (promptBox.value == \"<ruby><rt></rt></ruby> - \" || promptBox.value == \"<h1>Story X: Title</h1>\") {\n            promptBox.value = \"\";\n        }\n    }\n}\n\nfunction addExercise() {\n    const div = document.createElement(\"div\");\n    div.classList.add(\"exercise\");\n    formContainer.appendChild(div);\n    var divinnerHTML = '<span class=\"innerExercise\"><select class=\"typeSelect\" onchange=\"changeType(this)\">';\n    for (let t in template) {\n        let typename = template[t][\"type\"];\n        divinnerHTML += '<option value=\"' + typename + '\">' + typename + '</option>';\n    }\n    divinnerHTML += '</select> ';\n    divinnerHTML += 'pretext<input type=\"text\" class=\"pretext\" /> ';\n    divinnerHTML += 'prompt<input type=\"text\" class=\"prompt\" /> ';\n    divinnerHTML += 'options<span class=\"optionsBox\"><span class=\"innerBox\"><input type=\"text\" class=\"option\" /><input type=\"text\" class=\"option\" /></span></span>';\n    divinnerHTML += '<span class=\"extrasBox\"></span>';\n    divinnerHTML += '</span><button onclick=\"this.parentElement.remove()\">remove exercise</button>';\n    div.innerHTML = divinnerHTML;\n    div.querySelectorAll(\".option\").forEach((o) => {\n        o.addEventListener(\"change\", makeSureEnoughFields);\n    });\n}\n\nfunction generate() {\n    const exercises = document.querySelectorAll(\".exercise\");\n    var o = [];\n    exercises.forEach((ex) => {\n        let t = ex.querySelector(\".typeSelect\").value;\n        let pretext = ex.querySelector(\".pretext\").value;\n        let pmpt = ex.querySelector(\".prompt\").value;\n        let options = ex.querySelectorAll(\".option\");\n        let multipleAnswers = ex.querySelectorAll(\".answersBox\").length > 0;\n        let answers = ex.querySelectorAll(\".answer\");\n        let line = {type: t};\n        if (pretext != \"\") {\n            line[\"pretext\"] = pretext;\n        }\n        if (pmpt != \"\") {\n            line[\"prompt\"] = pmpt;\n        }\n        let opts = [];\n        options.forEach((opt) => {\n            if (opt.value != \"\" && opt.value != null) {\n                opts.push(opt.value);\n            }\n        });\n        if (opts.length > 0) {\n            if (t == \"newcards\") {\n                line[\"cards\"] = opts;\n            } else {\n                line[\"options\"] = opts;\n            }\n        }\n        if (multipleAnswers) {\n            let anss = [];\n            answers.forEach((ans) => {\n                if (ans.value != \"\" && ans.value != null) {\n                    anss.push(ans.value);\n                }\n            });\n            if (anss.length > 0) {\n                line[\"answer\"] = anss;\n            }\n        } else {\n            if (answers.length > 0) {\n                if (answers[0].value != \"\") {\n                    line[\"answer\"] = answers[0].value;\n                }\n            }\n        }\n        o.push(line);\n    });\n    let opp = (0,json_stringify_pretty_compact__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(o);\n    messageArea.innerHTML = opp;\n    console.log(opp);\n}\n\nwindow.makeSureEnoughFields = makeSureEnoughFields;\nwindow.changeType = changeType;\nwindow.addExercise = addExercise;\nwindow.generate = generate;\n\naddExercise();\n\n\n//# sourceURL=webpack://lessoneditor/./src/index.js?");

/***/ }),

/***/ "./node_modules/json-stringify-pretty-compact/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/json-stringify-pretty-compact/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ stringify)\n/* harmony export */ });\n// Note: This regex matches even invalid JSON strings, but since we’re\n// working on the output of `JSON.stringify` we know that only valid strings\n// are present (unless the user supplied a weird `options.indent` but in\n// that case we don’t care since the output would be invalid anyway).\nconst stringOrChar = /(\"(?:[^\\\\\"]|\\\\.)*\")|[:,]/g;\n\nfunction stringify(passedObj, options = {}) {\n  const indent = JSON.stringify(\n    [1],\n    undefined,\n    options.indent === undefined ? 2 : options.indent\n  ).slice(2, -3);\n\n  const maxLength =\n    indent === \"\"\n      ? Infinity\n      : options.maxLength === undefined\n      ? 80\n      : options.maxLength;\n\n  let { replacer } = options;\n\n  return (function _stringify(obj, currentIndent, reserved) {\n    if (obj && typeof obj.toJSON === \"function\") {\n      obj = obj.toJSON();\n    }\n\n    const string = JSON.stringify(obj, replacer);\n\n    if (string === undefined) {\n      return string;\n    }\n\n    const length = maxLength - currentIndent.length - reserved;\n\n    if (string.length <= length) {\n      const prettified = string.replace(\n        stringOrChar,\n        (match, stringLiteral) => {\n          return stringLiteral || `${match} `;\n        }\n      );\n      if (prettified.length <= length) {\n        return prettified;\n      }\n    }\n\n    if (replacer != null) {\n      obj = JSON.parse(string);\n      replacer = undefined;\n    }\n\n    if (typeof obj === \"object\" && obj !== null) {\n      const nextIndent = currentIndent + indent;\n      const items = [];\n      let index = 0;\n      let start;\n      let end;\n\n      if (Array.isArray(obj)) {\n        start = \"[\";\n        end = \"]\";\n        const { length } = obj;\n        for (; index < length; index++) {\n          items.push(\n            _stringify(obj[index], nextIndent, index === length - 1 ? 0 : 1) ||\n              \"null\"\n          );\n        }\n      } else {\n        start = \"{\";\n        end = \"}\";\n        const keys = Object.keys(obj);\n        const { length } = keys;\n        for (; index < length; index++) {\n          const key = keys[index];\n          const keyPart = `${JSON.stringify(key)}: `;\n          const value = _stringify(\n            obj[key],\n            nextIndent,\n            keyPart.length + (index === length - 1 ? 0 : 1)\n          );\n          if (value !== undefined) {\n            items.push(keyPart + value);\n          }\n        }\n      }\n\n      if (items.length > 0) {\n        return [start, indent + items.join(`,\\n${nextIndent}`), end].join(\n          `\\n${currentIndent}`\n        );\n      }\n    }\n\n    return string;\n  })(passedObj, \"\", 0);\n}\n\n\n//# sourceURL=webpack://lessoneditor/./node_modules/json-stringify-pretty-compact/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;