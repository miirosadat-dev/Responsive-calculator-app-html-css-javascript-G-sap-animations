/**
 * ============================================================================
 * CALCULATOR LOGIC MODULE
 * ============================================================================
 
 */

class Calculator {
    constructor() {
        this.reset();
    }

    /**
     * Reset calculator to initial state
     */
    reset() {
        this.previousValue = null;
        this.currentValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
    }

    /**
     * Append number to current value
     * @param {string} number - Number to append (0-9 or decimal point)
     */
    appendNumber(number) {
        // Prevent multiple decimal points
        if (number === '.' && this.currentValue.includes('.')) {
            return;
        }

        // Prevent leading zeros (except for decimals)
        if (number === '.' && !this.currentValue) {
            this.currentValue = '0.';
            this.shouldResetDisplay = false;
            return;
        }

        // Replace 0 with new number (unless decimal)
        if (this.currentValue === '0' && number !== '.') {
            this.currentValue = number;
        } else {
            this.currentValue += number;
        }

        this.shouldResetDisplay = false;
    }

    /**
     * Delete last digit from current value
     */
    delete() {
        if (this.shouldResetDisplay) {
            this.shouldResetDisplay = false;
            return;
        }

        this.currentValue = this.currentValue.toString().slice(0, -1) || '0';
    }

    /**
     * Set operation and store previous value
     * @param {string} nextOperation - Mathematical operation (+, -, *, /, %)
     */
    setOperation(nextOperation) {
        // If we're trying to set a new operation without a current value
        if (this.currentValue === '') {
            if (this.previousValue !== null) {
                this.operation = nextOperation;
            }
            return;
        }

        // If we already have a previous value and operation, calculate first
        if (this.previousValue !== null && this.operation && !this.shouldResetDisplay) {
            this.previousValue = this.calculate();
        } else {
            this.previousValue = parseFloat(this.currentValue);
        }

        this.operation = nextOperation;
        this.currentValue = '';
        this.shouldResetDisplay = false;
    }

    /**
     * Perform percentage calculation
     */
    percent() {
        const current = parseFloat(this.currentValue);
        
        if (isNaN(current)) {
            return;
        }

        let result = current / 100;

        // If we have a previous value and operation, calculate percentage of it
        if (this.previousValue !== null && this.operation) {
            result = (this.previousValue * current) / 100;
        }

        this.currentValue = this.formatNumber(result);
        this.shouldResetDisplay = true;
    }

    /**
     * Perform calculation based on current operation
     * @returns {number} Result of calculation
     */
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
                // Handle division by zero
                if (current === 0) {
                    this.handleError('Division by zero');
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

    /**
     * Execute equals operation
     * @returns {string|null} Formatted result or null if error
     */
    equals() {
        const result = this.calculate();

        if (result === null) {
            return null;
        }

        this.currentValue = result.toString();
        this.previousValue = null;
        this.operation = null;
        this.shouldResetDisplay = true;

        return this.currentValue;
    }

    /**
     * Format number to avoid floating point errors
     * Rounds to 10 decimal places
     * @param {number} number - Number to format
     * @returns {number} Formatted number
     */
    formatNumber(number) {
        return Math.round(number * 10000000000) / 10000000000;
    }

    /**
     * Format display value with comma separators
     * @param {string} value - Value to format
     * @returns {string} Formatted value with commas
     */
    getFormattedDisplay(value) {
        if (value === '' || value === null) {
            return '0';
        }

        // Split into integer and decimal parts
        const [integerPart, decimalPart] = value.toString().split('.');

        // Add comma separators to integer part
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Recombine with decimal part if exists
        return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
    }

    /**
     * Handle calculation errors
     * @param {string} error - Error message
     */
    handleError(error) {
        console.error('Calculator error:', error);
    }

    /**
     * Get current state
     * @returns {Object} Current calculator state
     */
    getState() {
        return {
            currentValue: this.currentValue,
            previousValue: this.previousValue,
            operation: this.operation
        };
    }

    /**
     * Set state (useful for testing)
     * @param {Object} state - State object
     */
    setState(state) {
        this.currentValue = state.currentValue || '';
        this.previousValue = state.previousValue || null;
        this.operation = state.operation || null;
    }
}