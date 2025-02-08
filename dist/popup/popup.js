"use strict";
// Main function to run the extension OR THE UI
function main() {
    var _a;
    // THE MAIN FUNCTION TO GET THE QUESTION FROM THE WEBSITE
    const getQuestion = () => {
        const questionALL = document.querySelector('[data-testid^="question-renderer"]');
        if (!questionALL) {
            return false;
        }
        return questionALL.innerHTML;
    };
    const main = document.createElement("div");
    main.id = "extension-container";
    // Use CSS classes for better styling control
    main.innerHTML = `
    <div class="extension-header">
      <h3>Alef Solver</h3>
      <button id="close-btn">X</button>
    </div>
    <div class="extension-body">
      <p>Click the button below to copy the question</p>
      <button id="copy-btn" class="primary-btn">Copy Question</button>
    </div>
  `;
    // Add styles
    const styles = `
    #extension-container {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 9999;
      font-family: Arial, sans-serif;
    }

    .extension-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #eee;
    }

    #close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
    }

    .extension-body {
      padding: 15px;
    }
    .error{
    color:red;
    }
    .primary-btn {
      width: 100%;
      padding: 10px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .primary-btn:hover {
      background: #0056b3;
    }
  `;
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    main.appendChild(styleSheet);
    const copy = main.querySelector("#copy-btn");
    const close = main.querySelector("#close-btn");
    close === null || close === void 0 ? void 0 : close.addEventListener("click", () => {
        main.remove();
        console.log("closed");
    });
    // Add event listener to the copy button
    copy === null || copy === void 0 ? void 0 : copy.addEventListener("click", () => {
        var _a;
        const question = getQuestion();
        if (!question && !main.querySelector(".extension-body .error")) {
            const error = document.createElement("p");
            error.innerHTML = "No question found";
            error.classList.add("error");
            (_a = main.querySelector(".extension-body")) === null || _a === void 0 ? void 0 : _a.appendChild(error);
            return;
        }
        navigator.clipboard.writeText(` Role You are a teacher who can answer questions.
          Instruction Answer the following question in a short and direct manner
          ${getQuestion()}
          `);
    });
    (_a = document.querySelector(".root")) === null || _a === void 0 ? void 0 : _a.appendChild(main);
    if (!document.querySelector(".root")) {
        document.body.appendChild(main);
    }
}
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    var _a;
    let activeTab = tabs[0];
    console.log(activeTab);
    if ((_a = activeTab.url) === null || _a === void 0 ? void 0 : _a.startsWith("https://schools.alefed.com/")) {
        console.log("Detected Alefed school website");
        // Execute script on the active tab to fetch the questions and display them in an alert box.
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: main,
        });
    }
    else {
        const error = document.getElementsByClassName("error")[0];
        error.innerHTML = "This extension only works on Alef school website";
        console.log("Not on Alefed school website");
    }
});
