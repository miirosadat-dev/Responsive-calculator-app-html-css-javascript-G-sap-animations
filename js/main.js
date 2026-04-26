/**
 * ============================================================================
 * RESPONSIVE CALCULATOR - MAIN APPLICATION
 * ============================================================================
 * Two-line display showing expression and current input
 */

// ============================================================================
// CALCULATOR LOGIC
// ============================================================================

class Calculator {
    constructor() {
        this.reset();
    }

    reset() {
        this.previousValue = null;
        this.currentValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
    }

    appendNumber(number) {
        if (number === '.' && this.currentValue.includes('.')) return;
        if (number === '.' && !this.currentValue) {
            this.currentValue = '0.';
            this.shouldResetDisplay = false;
            return;
        }
        if (this.currentValue === '0' && number !== '.') {
            this.currentValue = number;
        } else {
            this.currentValue += number;
        }
        this.shouldResetDisplay = false;
    }

    delete() {
        if (this.shouldResetDisplay) {
            this.shouldResetDisplay = false;
            return;
        }
        this.currentValue = this.currentValue.toString().slice(0, -1) || '0';
    }

    setOperation(nextOperation) {
        if (this.currentValue === '') {
            if (this.previousValue !== null) {
                this.operation = nextOperation;
            }
            return;
        }
        if (this.previousValue !== null && this.operation && !this.shouldResetDisplay) {
            this.previousValue = this.calculate();
        } else {
            this.previousValue = parseFloat(this.currentValue);
        }
        this.operation = nextOperation;
        this.currentValue = '';
        this.shouldResetDisplay = false;
    }

    percent() {
        const current = parseFloat(this.currentValue);
        if (isNaN(current)) return;
        let result = current / 100;
        if (this.previousValue !== null && this.operation) {
            result = (this.previousValue * current) / 100;
        }
        this.currentValue = this.formatNumber(result).toString();
        this.shouldResetDisplay = true;
    }

    calculate() {
        if (this.operation == null || this.previousValue === null) {
            return parseFloat(this.currentValue) || 0;
        }
        const current = parseFloat(this.currentValue);
        const previous = this.previousValue;
        let result = 0;

        switch (this.operation) {
            case '+':
                result = previous + current;
                break;
            case '-':
                result = previous - current;
                break;
            case '*':
                result = previous * current;
                break;
            case '/':
                if (current === 0) {
                    console.error('Cannot divide by zero');
                    return null;
                }
                result = previous / current;
                break;
            case '%':
                result = previous % current;
                break;
            default:
                return current;
        }
        return this.formatNumber(result);
    }

    equals() {
        const result = this.calculate();
        if (result === null) return null;
        this.currentValue = result.toString();
        this.previousValue = null;
        this.operation = null;
        this.shouldResetDisplay = true;
        return this.currentValue;
    }

    formatNumber(number) {
        return Math.round(number * 10000000000) / 10000000000;
    }

    getFormattedDisplay(value) {
        if (value === '' || value === null) return '0';
        const [integerPart, decimalPart] = value.toString().split('.');
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
    }

    // Get the expression line (previous value + operation)
    getExpressionDisplay() {
        if (this.previousValue === null) return '';
        const formatted = this.getFormattedDisplay(this.previousValue);
        if (this.operation) {
            return `${formatted} ${this.operation}`;
        }
        return formatted;
    }

    // Get the current input line
    getCurrentDisplay() {
        return this.getFormattedDisplay(this.currentValue || '0');
    }
}

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

const calculator = new Calculator();
let lastOperatorButton = null;

function init() {
    console.log('✅ Calculator initialized');
    
    const previousDisplay = document.querySelector('.previous-value');
    const currentDisplay = document.querySelector('.current-value');
    const numberButtons = document.querySelectorAll('[data-number]');
    const operatorButtons = document.querySelectorAll('[data-operator]');
    const functionButtons = document.querySelectorAll('[data-action]');

    function updateDisplay() {
        previousDisplay.textContent = calculator.getExpressionDisplay();
        currentDisplay.textContent = calculator.getCurrentDisplay();
    }

    // Number buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', function() {
            const number = this.getAttribute('data-number');
            calculator.appendNumber(number);
            updateDisplay();
        });
    });

    // Operator buttons
    operatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const operator = this.getAttribute('data-operator');

            if (lastOperatorButton && lastOperatorButton !== button) {
                lastOperatorButton.classList.remove('active');
            }

            if (operator === '%') {
                calculator.percent();
            } else {
                calculator.setOperation(operator);
                this.classList.add('active');
                lastOperatorButton = this;
            }
            updateDisplay();
        });
    });

    // Function buttons
    functionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');

            if (action === 'clear') {
                calculator.reset();
                if (lastOperatorButton) {
                    lastOperatorButton.classList.remove('active');
                    lastOperatorButton = null;
                }
            } else if (action === 'delete') {
                calculator.delete();
            } else if (action === 'equals') {
                calculator.equals();
                if (lastOperatorButton) {
                    lastOperatorButton.classList.remove('active');
                    lastOperatorButton = null;
                }
            }
            updateDisplay();
        });
    });

    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (/^[0-9.]$/.test(e.key)) {
            e.preventDefault();
            const button = document.querySelector(`[data-number="${e.key}"]`);
            if (button) {
                calculator.appendNumber(e.key);
                updateDisplay();
            }
        }

        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            e.preventDefault();
            const button = document.querySelector(`[data-operator="${e.key}"]`);
            if (button) {
                calculator.setOperation(e.key);
                updateDisplay();
            }
        }

        if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            calculator.equals();
            updateDisplay();
        }

        if (e.key === 'Backspace') {
            e.preventDefault();
            calculator.delete();
            updateDisplay();
        }

        if (e.key === 'Escape') {
            e.preventDefault();
            calculator.reset();
            if (lastOperatorButton) {
                lastOperatorButton.classList.remove('active');
                lastOperatorButton = null;
            }
            updateDisplay();
        }
    });

    updateDisplay();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}