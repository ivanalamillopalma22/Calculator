// Theme Changer Logic (Button version)
const toggleLightDarkBtn = document.getElementById('toggle-light-dark');
const colorThemeBtn = document.getElementById('color-theme-btn');

function setTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-color');
    document.body.classList.add('theme-' + theme);
    localStorage.setItem('calc-theme', theme);
    updateThemeButtons(theme);
}

function updateThemeButtons(currentTheme) {
    // Update button text for light/dark toggle
    if (currentTheme === 'color') {
        toggleLightDarkBtn.textContent = 'Light/Dark';
        colorThemeBtn.disabled = true;
    } else {
        colorThemeBtn.disabled = false;
        if (currentTheme === 'light') {
            toggleLightDarkBtn.textContent = 'Dark';
        } else {
            toggleLightDarkBtn.textContent = 'Light';
        }
    }
}

toggleLightDarkBtn.addEventListener('click', function() {
    const current = document.body.classList.contains('theme-dark') ? 'dark' : (document.body.classList.contains('theme-light') ? 'light' : 'color');
    if (current === 'color') {
        setTheme('light');
    } else if (current === 'light') {
        setTheme('dark');
    } else {
        setTheme('light');
    }
});

colorThemeBtn.addEventListener('click', function() {
    setTheme('color');
});

function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

const savedTheme = localStorage.getItem('calc-theme');
const initialTheme = savedTheme || detectSystemTheme();
setTheme(initialTheme);
let display = document.getElementById('display');
let historyDiv = document.getElementById('history');

function appendCharacter(char) {
    // Prevent multiple operators in a row (basic check)
    const lastChar = display.value.slice(-1);
    const operators = ['+', '-', '*', '/', '%', '.'];
    
    if (operators.includes(char) && operators.includes(lastChar)) {
        // Replace the last operator if user types another one
        display.value = display.value.slice(0, -1) + char;
        return;
    }
    
    display.value += char;
}

function clearDisplay() {
    display.value = '';
    historyDiv.innerText = '';
}

function deleteLast() {
    display.value = display.value.toString().slice(0, -1);
}

function appendParenthesis() {
    let value = display.value;
    let openCount = (value.match(/\(/g) || []).length;
    let closeCount = (value.match(/\)/g) || []).length;
    let lastChar = value.slice(-1);
    const operators = ['+', '-', '*', '/', '%', '('];

    // Logic to decide whether to open or close
    if (value === '' || operators.includes(lastChar)) {
        display.value += '(';
    } else if (openCount > closeCount) {
        display.value += ')';
    } else {
        // If balanced and last is a number or ), assume multiplication and open new
        // Or just open new. Let's add implicit multiplication if it's a number?
        // display.value += '*('; 
        // Let's just add '(' for simplicity and let user manage operators
        display.value += '(';
    }
}

function calculateResult() {
    try {
        let expression = display.value;
        
        // Handle percentage: replace % with /100
        // This is a simple replacement, might need more complex logic for "number + percentage"
        // But for standard "number %", it works as mod in JS. 
        // Calculators usually treat % as /100.
        // Let's replace % with /100 for calculation if it follows a number
        // Regex to find number followed by % -> number / 100
        // But wait, JS eval uses % as modulo.
        // If user wants percentage, they usually mean /100.
        // Let's replace % with /100.
        expression = expression.replace(/%/g, '/100');

        // Evaluate
        let result = eval(expression);
        
        // Check if result is valid
        if (result === undefined || isNaN(result) || !isFinite(result)) {
            throw new Error("Invalid");
        }

        historyDiv.innerText = display.value;
        display.value = result;
    } catch (error) {
        // historyDiv.innerText = display.value;
        display.value = 'Error';
        setTimeout(() => {
            display.value = '';
        }, 1500);
    }
}
