/**
 * ============================================================================
 * GSAP ANIMATIONS MODULE
 * ============================================================================
 * All GSAP animation effects for calculator UI
 * Separated from logic for better code organization
 */

class CalculatorAnimations {
    constructor() {
        this.animationDuration = 0.3;
        this.easeType = 'back.out';
        this.containerSelector = '.calculator-container';
        this.buttonSelector = '.btn';
        this.displaySelector = '.calculator-display';
        this.currentValueSelector = '.current-value';
        this.previousValueSelector = '.previous-value';
    }

    /**
     * ========================================================================
     * ENTRANCE ANIMATIONS
     * ========================================================================
     */

    /**
     * Animate calculator entrance with stagger
     */
    animateEnter() {
        // Main container entrance
        gsap.from(this.containerSelector, {
            duration: 0.6,
            opacity: 0,
            y: 30,
            scale: 0.95,
            ease: 'back.out'
        });

        // Display entrance
        gsap.from(this.displaySelector, {
            duration: 0.5,
            opacity: 0,
            y: -20,
            delay: 0.1,
            ease: 'power2.out'
        });

        // Buttons entrance with stagger
        gsap.from(this.buttonSelector, {
            duration: 0.4,
            opacity: 0,
            y: 20,
            delay: 0.2,
            stagger: {
                amount: 0.3,
                from: 'start'
            },
            ease: 'back.out'
        });
    }

    /**
     * ========================================================================
     * BUTTON ANIMATIONS
     * ========================================================================
     */

    /**
     * Animate button click with scale effect
     * @param {Element} button - Button element to animate
     */
    animateButtonClick(button) {
        // Scale animation
        gsap.to(button, {
            duration: this.animationDuration,
            scale: 0.92,
            ease: 'power2.in'
        });

        gsap.to(button, {
            duration: this.animationDuration * 0.8,
            scale: 1,
            delay: this.animationDuration,
            ease: 'elastic.out(1, 0.5)'
        });

        // Add ripple effect
        this.createRipple(button);
    }

    /**
     * Create ripple effect on button
     * @param {Element} button - Button element
     */
    createRipple(button) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = button.clientX - rect.left - size / 2;
        const y = button.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        button.appendChild(ripple);

        // Animate ripple
        gsap.to(ripple, {
            duration: 0.6,
            scale: 2.5,
            opacity: 0,
            ease: 'power2.out',
            onComplete: () => {
                ripple.remove();
            }
        });
    }

    /**
     * Animate button hover effect
     * @param {Element} button - Button element
     */
    animateButtonHover(button) {
        gsap.to(button, {
            duration: 0.2,
            y: -3,
            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
            ease: 'power2.out'
        });
    }

    /**
     * Animate button hover out
     * @param {Element} button - Button element
     */
    animateButtonHoverOut(button) {
        gsap.to(button, {
            duration: 0.2,
            y: 0,
            ease: 'power2.out'
        });
    }

    /**
     * Add highlight effect to active operator button
     * @param {Element} button - Button element
     */
    highlightOperator(button) {
        gsap.to(button, {
            duration: 0.2,
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.6)',
            ease: 'power2.out'
        });
    }

    /**
     * Remove highlight from operator button
     * @param {Element} button - Button element
     */
    dehighlightOperator(button) {
        gsap.to(button, {
            duration: 0.2,
            boxShadow: 'var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            ease: 'power2.out'
        });
    }

    /**
     * ========================================================================
     * DISPLAY ANIMATIONS
     * ========================================================================
     */

    /**
     * Animate display value update
     * @param {Element} displayElement - Display element
     */
    animateDisplayUpdate(displayElement) {
        gsap.to(displayElement, {
            duration: 0.15,
            scale: 1.05,
            ease: 'back.out'
        });

        gsap.to(displayElement, {
            duration: 0.15,
            scale: 1,
            delay: 0.15,
            ease: 'power2.out'
        });
    }

    /**
     * Animate equals operation with glow effect
     * @param {Element} displayElement - Display element
     */
    animateEquals(displayElement) {
        // Pulse glow effect
        gsap.to(displayElement, {
            duration: 0.2,
            scale: 1.1,
            textShadow: '0 0 20px rgba(236, 72, 153, 0.8)',
            ease: 'back.out'
        });

        gsap.to(displayElement, {
            duration: 0.5,
            scale: 1,
            textShadow: '0 0 5px rgba(236, 72, 153, 0)',
            delay: 0.2,
            ease: 'power2.out'
        });
    }

    /**
     * Animate clear operation
     * @param {Element} displayElement - Display element
     */
    animateClear(displayElement) {
        gsap.to(displayElement, {
            duration: 0.3,
            opacity: 0.5,
            scale: 0.95,
            ease: 'back.in'
        });

        gsap.to(displayElement, {
            duration: 0.2,
            opacity: 1,
            scale: 1,
            delay: 0.3,
            ease: 'back.out'
        });
    }

    /**
     * ========================================================================
     * ERROR ANIMATIONS
     * ========================================================================
     */

    /**
     * Animate error shake effect
     * @param {Element} element - Element to shake
     */
    animateError(element) {
        gsap.to(element, {
            duration: 0.05,
            x: -5,
            repeat: 5,
            yoyo: true,
            ease: 'none'
        });
    }

    /**
     * Flash error message
     * @param {Element} element - Element to flash
     */
    flashError(element) {
        gsap.to(element, {
            duration: 0.1,
            opacity: 0.5,
            repeat: 3,
            yoyo: true,
            ease: 'none'
        });
    }

    /**
     * ========================================================================
     * KEYBOARD ANIMATION
     * ========================================================================
     */

    /**
     * Animate key press highlighting
     * @param {Element} button - Button element that corresponds to key
     */
    animateKeyPress(button) {
        gsap.to(button, {
            duration: 0.1,
            scale: 0.95,
            ease: 'power2.in'
        });

        gsap.to(button, {
            duration: 0.1,
            scale: 1,
            delay: 0.1,
            ease: 'power2.out'
        });
    }

    /**
     * ========================================================================
     * UTILITY ANIMATIONS
     * ========================================================================
     */

    /**
     * Pulse animation (attention getter)
     * @param {Element} element - Element to pulse
     */
    pulse(element) {
        gsap.to(element, {
            duration: 0.5,
            scale: 1.05,
            repeat: 1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    /**
     * Fade in animation
     * @param {Element} element - Element to fade in
     * @param {number} duration - Animation duration
     */
    fadeIn(element, duration = 0.3) {
        gsap.to(element, {
            duration: duration,
            opacity: 1,
            ease: 'power2.out'
        });
    }

    /**
     * Fade out animation
     * @param {Element} element - Element to fade out
     * @param {number} duration - Animation duration
     */
    fadeOut(element, duration = 0.3) {
        gsap.to(element, {
            duration: duration,
            opacity: 0,
            ease: 'power2.out'
        });
    }

    /**
     * Slide up animation
     * @param {Element} element - Element to slide up
     * @param {number} distance - Distance to slide
     */
    slideUp(element, distance = 20) {
        gsap.to(element, {
            duration: this.animationDuration,
            y: -distance,
            opacity: 0,
            ease: 'power2.in'
        });
    }

    /**
     * Slide down animation
     * @param {Element} element - Element to slide down
     * @param {number} distance - Distance to slide
     */
    slideDown(element, distance = 20) {
        gsap.from(element, {
            duration: this.animationDuration,
            y: -distance,
            opacity: 0,
            ease: 'power2.out'
        });
    }

    /**
     * Bounce animation
     * @param {Element} element - Element to bounce
     */
    bounce(element) {
        gsap.to(element, {
            duration: 0.6,
            y: -20,
            ease: 'power2.out',
            repeat: 1,
            yoyo: true
        });
    }

    /**
     * ========================================================================
     * BATCH ANIMATIONS
     * ========================================================================
     */

    /**
     * Animate all buttons
     */
    animateAllButtons() {
        gsap.from(this.buttonSelector, {
            duration: 0.4,
            opacity: 0,
            y: 20,
            stagger: 0.05,
            ease: 'back.out'
        });
    }

    /**
     * Disable animations (for reduced motion preference)
     */
    disableAnimations() {
        this.animationDuration = 0;
    }

    /**
     * Enable animations
     */
    enableAnimations() {
        this.animationDuration = 0.3;
    }
}