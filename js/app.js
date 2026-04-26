/**
 * ============================================================================
 * MAIN APPLICATION ENTRY POINT
 * ============================================================================
 * Initializes calculator, manages DOM, handles events, and coordinates animations
 */

// Initialize calculator and animations
const calculator = new Calculator();
const animations = new CalculatorAnimations();

// Cache DOM elements
const displayPrevious = document.querySelector('.previous-value');
const displayCurrent = document.querySelector('.current-value');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const functionButtons = document.querySelectorAll('[data-action]');

// State tracking
let lastPressedOperator = null;

/**
 * ============================================================================
 * INITIALIZATION
 * ============================================================================
 */

/**
 * Initialize the application
 */
function initializeApp() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animations.disableAnimations();
    }

    // Trigger entrance animations
    animations.animateEnter();

    // Attach event listeners
    attachEventListeners();

    // Update display
    updateDisplay();

    console.log('✅ Calculator initialized successfully');
}

/**
 * ============================================================================
 * EVENT LISTENERS
 * ============================================================================
 */

/**
 * Attach all event listeners
 */
function attachEventListeners() {
    // Number buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', (e) => handleNumberClick(e, button));
        button.addEventListener('touchstart', (e) => handleButtonTouchStart(button));
        button.addEventListener('touchend', (e) => handleButtonTouchEnd(button));
    });

    // Operator buttons
    operatorButtons.forEach(button => {
        button.addEventListener('click', (e) => handleOperatorClick(e, button));
        button.addEventListener('touchstart', (e) => handleButtonTouchStart(button));
        button.addEventListener('touchend', (e) => handleButtonTouchEnd(button));
    });

    // Function buttons (Clear, Delete)
    functionButtons.forEach(button => {
        button.addEventListener('click', (e) => handleFunctionClick(e, button));
        button.addEventListener('touchstart', (e) => handleButtonTouchStart(button));
        button.addEventListener('touchend', (e) => handleButtonTouchEnd(button));
    });

    // Keyboard support
    document.addEventListener('keydown', handleKeyPress);

    // Hover effects (desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mouseenter', () => animations.animateButtonHover(button));
            button.addEventListener('mouseleave', () => animations.animateButtonHoverOut(button));
        });
    }

    // Handle reduced motion preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        if (e.matches) {
            animations.disableAnimations();
        } else {
            animations.enableAnimations();
        }
    });
}

/**
 * ============================================================================
 * EVENT HANDLERS
 * ============================================================================
 */

/**
 * Handle number button click
 * @param {Event} e - Click event
 * @param {Element} button - Button element
 */
function handleNumberClick(e, button) {
    e.preventDefault();
    const number = button.getAttribute('data-number');
    
    calculator.appendNumber(number);
    animations.animateButtonClick(button);
    animations.animateDisplayUpdate(displayCurrent);
    updateDisplay();
}

/**
 * Handle operator button click
 * @param {Event} e - Click event
 * @param {Element} button - Button element
 */
function handleOperatorClick(e, button) {
    e.preventDefault();
    const operator = button.getAttribute('data-operator');

    // Dehighlight previous operator
    if (lastPressedOperator) {
        animations.dehighlightOperator(lastPressedOperator);
    }

    // Handle percentage
    if (operator === '%') {
        calculator.percent();
        animations.animateButtonClick(button);
        animations.animateDisplayUpdate(displayCurrent);
        updateDisplay();
        return;
    }

    calculator.setOperation(operator);
    animations.animateButtonClick(button);
    animations.highlightOperator(button);
    lastPressedOperator = button;
    updateDisplay();
}

/**
 * Handle function button click (Clear, Delete, Equals)
 * @param {Event} e - Click event
 * @param {Element} button - Button element
 */
function handleFunctionClick(e, button) {
    e.preventDefault();
    const action = button.getAttribute('data-action');

    animations.animateButtonClick(button);

    if (action === 'clear') {
        calculator.reset();
        animations.animateClear(displayCurrent);
        if (lastPressedOperator) {
            animations.dehighlightOperator(lastPressedOperator);
            lastPressedOperator = null;
        }
    } else if (action === 'delete') {
        calculator.delete();
        animations.animateDisplayUpdate(displayCurrent);
    } else if (action === 'equals') {
        const result = calculator.equals();
        if (result === null) {
            // Error occurred
            animations.animateError(displayCurrent);
        } else {
            animations.animateEquals(displayCurrent);
        }
        if (lastPressedOperator) {
            animations.dehighlightOperator(lastPressedOperator);
            lastPressedOperator = null;
        }
    }

    updateDisplay();
}

/**
 * Handle button touch start
 * @param {Element} button - Button element
 */
function handleButtonTouchStart(button) {
    gsap.to(button, {
        duration: 0.1,
        scale: 0.95
    });
}

/**
 * Handle button touch end
 * @param {Element} button - Button element
 */
function handleButtonTouchEnd(button) {
    gsap.to(button, {
        duration: 0.1,
        scale: 1,
        ease: 'elastic.out'
    });
}

/**
 * Handle keyboard input
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyPress(e) {
    const key = e.key;

    // Number keys (0-9)
    if (/^[0-9.]$/.test(key)) {
        e.preventDefault();
        const button = document.querySelector(`[data-number="${key}"]`);
        if (button) {
            calculator.appendNumber(key);
            animations.animateKeyPress(button);
            animations.animateDisplayUpdate(displayCurrent);
            updateDisplay();
        }
    }

    // Operators
    if (key === '+' || key === '-') {
        e.preventDefault();
        const button = document.querySelector(`[data-operator="${key}"]`);
        if (button) {
            calculator.setOperation(key);
            animations.animateKeyPress(button);
            updateDisplay();
        }
    }

    if (key === '*') {
        e.preventDefault();
        const button = document.querySelector(`[data-operator="*"]`);
        if (button) {
            calculator.setOperation('*');
            animations.animateKeyPress(button);
            updateDisplay();
        }
    }

    if (key === '/') {
        e.preventDefault();
        const button = document.querySelector(`[data-operator="/"]`);
        if (button) {
            calculator.setOperation('/');
            animations.animateKeyPress(button);
            updateDisplay();
        }
    }

    // Equals (Enter or =)
    if (key === 'Enter' || key === '=') {
        e.preventDefault();
        const button = document.querySelector('[data-action="equals"]');
        if (button) {
            calculator.equals();
            animations.animateKeyPress(button);
            animations.animateEquals(displayCurrent);
            updateDisplay();
        }
    }

    // Delete (Backspace)
    if (key === 'Backspace') {
        e.preventDefault();
        const button = document.querySelector('[data-action="delete"]');
        if (button) {
            calculator.delete();
            animations.animateKeyPress(button);
            animations.animateDisplayUpdate(displayCurrent);
            updateDisplay();
        }
    }

    // Clear (Escape)
    if (key === 'Escape') {
        e.preventDefault();
        const button = document.querySelector('[data-action="clear"]');
        if (button) {
            calculator.reset();
            animations.animateKeyPress(button);
            animations.animateClear(displayCurrent);
            updateDisplay();
        }
    }
}

/**
 * ============================================================================
 * DISPLAY UPDATE
 * ============================================================================
 */

/**
 * Update calculator display
 */
function updateDisplay() {
    // Format and display current value
    const formattedCurrent = calculator.getFormattedDisplay(calculator.currentValue || '0');
    displayCurrent.textContent = formattedCurrent;

    // Display previous value and operation
    if (calculator.previousValue !== null) {
        const formattedPrevious = calculator.getFormattedDisplay(calculator.previousValue);
        displayPrevious.textContent = `${formattedPrevious} ${calculator.operation || ''}`;
    } else {
        displayPrevious.textContent = '';
    }
}

/**
 * ============================================================================
 * RESPONSIVE BEHAVIOR
 * ============================================================================
 */

/**
 * Handle window resize
 */
window.addEventListener('resize', () => {
    // Recalculate if needed
});

/**
 * Handle orientation change
 */
window.addEventListener('orientationchange', () => {
    // Reflow animations if needed
    updateDisplay();
});

/**
 * ============================================================================
 * STARTUP
 * ============================================================================
 */

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}