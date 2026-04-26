/**
 * ============================================================================
 * CALCULATOR - SINGLE UNIFIED JS FILE
 * ============================================================================
 * All functionality: Calculator logic + GSAP animations + DOM handling
 * Focused on performance and simplicity
 */

class Calculator {
    constructor() {
        this.reset();
    }

    reset() {
        this.previousValue = '';
        this.currentValue = '0';
        this.operation = null;
        this.newNumber = true;
    }

    appendNumber(num) {
        if (this.newNumber) {
            this.currentValue = num;
            this.newNumber = false;
        } else {
            if (num === '.' && this.currentValue.includes('.')) return;
            this.currentValue += num;
        }
    }

    delete() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
            this.newNumber = true;
        }
    }

    setOperation(op) {
        if (this.operation !== null && !this.newNumber) {
            this.calculate();
        }
        this.previousValue = this.currentValue;
        this.operation = op;
        this.newNumber = true;
    }

    calculate() {
        if (this.operation === null || this.newNumber) return;

        let result = 0;
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.currentValue = 'Error';
                    return;
                }
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
        }

        this.currentValue = result.toString();
        this.operation = null;
        this.newNumber = true;
    }

    percent() {
        const current = parseFloat(this.currentValue);
        this.currentValue = (current / 100).toString();
    }

    getDisplay() {
        return this.currentValue.length > 10
            ? parseFloat(this.currentValue).toExponential(5)
            : this.currentValue;
    }
}

// ============================================================================
// INITIALIZE APP
// ============================================================================

const calc = new Calculator();
const display = document.querySelector('.current-value');
const buttons = document.querySelectorAll('.btn');

function updateDisplay() {
    display.textContent = calc.getDisplay();
    gsap.to(display, { duration: 0.15, scale: 1.05, yoyo: true, repeat: 1 });
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        gsap.to(btn, { duration: 0.1, scale: 0.9, yoyo: true, repeat: 1 });

        const number = btn.getAttribute('data-number');
        const operator = btn.getAttribute('data-operator');
        const action = btn.getAttribute('data-action');

        if (number) {
            calc.appendNumber(number);
            updateDisplay();
        } else if (operator) {
            if (operator === '%') {
                calc.percent();
            } else {
                calc.setOperation(operator);
            }
            updateDisplay();
        } else if (action) {
            if (action === 'clear') {
                calc.reset();
            } else if (action === 'delete') {
                calc.delete();
            } else if (action === 'equals') {
                calc.calculate();
            }
            updateDisplay();
        }
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (/^[0-9.]$/.test(e.key)) {
        calc.appendNumber(e.key);
        updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        calc.setOperation(e.key);
        updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calc.calculate();
        updateDisplay();
    } else if (e.key === 'Backspace') {
        calc.delete();
        updateDisplay();
    } else if (e.key === 'Escape') {
        calc.reset();
        updateDisplay();
    }
});

// Initial display
updateDisplay();
console.log('✅ Calculator loaded');
