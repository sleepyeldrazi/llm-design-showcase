// ============================================
// SecondBrain Landing Page — App Logic
// ============================================

(function () {
    'use strict';

    const TOTAL_DESIGNS = 5;
    let currentDesign = 1;

    // ---- Hash-based routing ----
    function getDesignFromHash() {
        const hash = window.location.hash.replace('#', '');
        const num = parseInt(hash, 10);
        if (num >= 1 && num <= TOTAL_DESIGNS) return num;
        return 1;
    }

    function setDesign(num, pushState = true) {
        if (num < 1 || num > TOTAL_DESIGNS) return;
        currentDesign = num;

        // Hide all design pages
        document.querySelectorAll('.design-page').forEach(page => {
            page.classList.remove('active');
        });

        // Show the selected design
        const target = document.getElementById(`design-${num}`);
        if (target) {
            target.classList.add('active');
        }

        // Update switcher buttons
        document.querySelectorAll('.switcher-btn').forEach(btn => {
            const designNum = parseInt(btn.dataset.design, 10);
            btn.classList.toggle('active', designNum === num);
        });

        // Update URL hash
        if (pushState) {
            window.history.pushState(null, '', `#${num}`);
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ---- Initialize ----
    function init() {
        const initialDesign = getDesignFromHash();
        setDesign(initialDesign, false);

        // Switcher button clicks
        document.querySelectorAll('.switcher-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const num = parseInt(btn.dataset.design, 10);
                setDesign(num);
            });
        });

        // Keyboard navigation (arrow keys)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const next = currentDesign < TOTAL_DESIGNS ? currentDesign + 1 : 1;
                setDesign(next);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = currentDesign > 1 ? currentDesign - 1 : TOTAL_DESIGNS;
                setDesign(prev);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            const num = getDesignFromHash();
            setDesign(num, false);
        });

        // Handle direct hash changes
        window.addEventListener('hashchange', () => {
            const num = getDesignFromHash();
            if (num !== currentDesign) {
                setDesign(num, false);
            }
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
