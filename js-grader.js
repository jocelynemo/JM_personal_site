/*
CS 146 - Assignment 3 JS Grader

How to use:
1. Place this file in the same directory as your HTML file (ex: index.html).
2. Include the following line AFTER your own script in the HTML file, but before the closing </body> tag:
    
        <script src="js-grader.js"></script>

3. Open your page using Live Server.
4. Open your browser's developer tools (Usually right-click -> Inspect or F12)
5. Refresh the page and check the console tab to see your grading results!

Please do not rename this file!
*/

document.addEventListener("DOMContentLoaded", async() => {
    console.log("JS Grader loaded successfully. :)");
    console.log("");
    console.log("-----Grading Criteria-----");

    //scoring
    let earned = 0;

    // helper function for counting matches to a regex expression
    function countMatches(text, regex) {
        const matches = text.match(regex);
        return matches ? matches.length : 0;
    }

    console.log("1.");
    // Check for external script
    const scripts = document.getElementsByTagName("script");
    for (let script of scripts) {
        let src = script.getAttribute("src");
        if (src && !src.includes("js-grader.js")) {
            earned += 10;
            console.log("\ta. External script linked: [10/10]");
            break;
        }
    }

    // if the script is not found
    if (earned === 0) {
        console.warn("\ta. No external script linked: [0/10] !!!");
    }

    //get script content
    let combinedJS = "";
    for (let i = 0; i < (scripts.length - 1); i++) {
        try{
            const src = scripts[i].getAttribute("src");
            if (src && !src.includes("js-grader.js")) {
                const response = await fetch(src);
                const text = await response.text();
                combinedJS += text + "\n";
            }
        } catch (e) {
            console.warn("\tUnable to fetch script content :( - ", scripts[i], " - ", e);
        }
    }


    console.log("2.");
    // check for DOM selection
    let selectionCount = 0;

    const querySelectorMatches = combinedJS.match(/document\.querySelector\s*\(/g);
    if (querySelectorMatches) {
        selectionCount += querySelectorMatches.length;
    }

    const getByIdMatches = combinedJS.match(/document\.getElementById\s*\(/g);
    if (getByIdMatches) {
        selectionCount += getByIdMatches.length;
    }

    const getByClassMatches = combinedJS.match(/document\.getElementsByClassName\s*\(/g);
    if (getByClassMatches) {
        selectionCount += getByClassMatches.length;
    }

    const getByTagMatches = combinedJS.match(/document\.getElementsByTagName\s*\(/g);
    if (getByTagMatches) {
        selectionCount += getByTagMatches.length;
    }

    if (selectionCount >= 3) {
        earned += 15;
        console.log(`\ta. Found ${selectionCount} DOM selection(s): [15/15]`);
    } else {
        console.warn(`\ta. Found only ${selectionCount} DOM selection(s) (3+ needed): [0/15] !!!`);
    }


    console.log("3.");
    // check for Dom Manipulation
    let manipulationCount = 0;
    const manipulationRegexPatterns = {
        textContent: /\.textContent\s*=/g,
        innerHTML: /\.innerHTML\s*=/g,
        innerText: /\.innerText\s*=/g,
        style: /\.style\.[a-zA-Z]+\s*=/g,
        classList: /\.classList\.(add|remove|toggle)\s*\(/g,
        className: /\.className\s*=/g,
        createElement: /document\.createElement\s*\(/g,
        appendChild: /\.appendChild\s*\(/g,
        append: /\.append\s*\(/g,
        prepend: /\.prepend\s*\(/g,
        insertHTML: /\.insertAdjacentHTML\s*\(/g,
        insertText: /\.insertAdjacentText\s*\(/g,
        setAttribute: /\.setAttribute\s*\(/g,
        removeAttribute: /\.removeAttribute\s*\(/g,
        hidden: /\.hidden\s*=\s*true/g,
        display: /\.style\.display\s*=/g,
        visibility: /\.style\.visibility\s*=/g
    };

    for (let key in manipulationRegexPatterns) {
        const matches = combinedJS.match(manipulationRegexPatterns[key]);
        if (matches) {
            manipulationCount += matches.length;
        }
    }

    if (manipulationCount >= 3) {
        earned += 20;
        console.log(`\ta. Found ${manipulationCount} DOM manipulation(s): [20/20]`);
    } else {
        console.warn(`\ta. Found only ${manipulationCount} DOM manipulation(s) (3+ needed): [0/20] !!!`);
    }

    console.log("4.");

    const listenerMatches = combinedJS.match(/([\w$.]+)\.addEventListener\s*\(\s*["'`](\w+)["'`]/g);

    let uniqueListeners = new Set();
    if (listenerMatches) {
        for (let match of listenerMatches) {
            uniqueListeners.add(match.trim());
        }
    }

    let uniqueCount = uniqueListeners.size;

    if (uniqueCount >= 3) {
        earned += 20;
        console.log(`\ta. Found ${uniqueCount} unique event listener(s): [20/20]`);
    } else {
        console.warn(`\ta. Found only ${uniqueCount} unique event listener(s) (3+ needed): [0/20] !!!`);
    }

    console.log("5.");
    console.log("\tInteractive elements will be manually checked for functionality: [20/20]");
    earned += 20;

    console.log("6.");
    console.log("Visitor Counter will be manually checked for functionality and use of localStorage: [15/15]");
    earned += 15;

    console.log("JS Score: ", earned);
    console.log("Canvas Score: " + (earned / 10) + "/10");

});