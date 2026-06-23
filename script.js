document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY NAVBAR & MOBILE MENU TOGGLE
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

    // Scroll Effect for Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }

    // Close Menu on Link Click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileToggle) mobileToggle.classList.remove('open');
            if (navMenu) navMenu.classList.remove('open');
        });
    });

    // Active Navigation Highlight on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       2. SCROLL PARALLAX EFFECT (BACKGROUND SHAPES)
       ========================================================================== */
    const parallaxShapes = document.querySelectorAll('.parallax-bg-shape');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        parallaxShapes.forEach(shape => {
            const speed = parseFloat(shape.getAttribute('data-speed')) || 0.1;
            const yOffset = scrolled * speed;
            shape.style.transform = `translateY(${yOffset}px)`;
        });
    });


    /* ==========================================================================
       3. 3D CARD HOVER TILT EFFECT
       ========================================================================== */
    const tiltElements = document.querySelectorAll('.tilt-card, #hero-3d-card, #tech-graphic, .doctor-card');

    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const cardRect = element.getBoundingClientRect();
            
            // Get cursor coordinates relative to the card
            const mouseX = e.clientX - cardRect.left;
            const mouseY = e.clientY - cardRect.top;
            
            // Get card center coordinates
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            const centerX = cardWidth / 2;
            const centerY = cardHeight / 2;
            
            // Calculate tilt angle (max 15 degrees)
            const maxTilt = 15;
            const rotateY = ((mouseX - centerX) / centerX) * maxTilt;
            const rotateX = -((mouseY - centerY) / centerY) * maxTilt; // Negative to tilt towards pointer
            
            // Apply transform style
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        element.addEventListener('mouseleave', () => {
            // Reset to baseline with transition
            element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            element.style.transition = 'transform 0.5s ease-out';
        });

        element.addEventListener('mouseenter', () => {
            // Remove transitions during live movements for perfect tracking response
            element.style.transition = 'transform 0.1s ease';
        });
    });


    /* ==========================================================================
       4. SCROLL REVEAL (FADE IN UP) & STATS COUNTER
       ========================================================================== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                
                // If it's a stat item, trigger count animation
                if (entry.target.classList.contains('stat-item')) {
                    const numberEl = entry.target.querySelector('.stat-number');
                    if (numberEl && !numberEl.classList.contains('counted')) {
                        animateCounter(numberEl);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe reveal elements
    document.querySelectorAll('.fade-in, .fade-in-up, .stat-item').forEach(el => {
        revealObserver.observe(el);
    });

    // Animate Number Counters
    function animateCounter(element) {
        const targetString = element.getAttribute('data-target');
        const isDecimal = targetString.includes('.');
        const isPlus = targetString.includes('+');
        const isPercent = targetString.includes('%');
        
        // Extract raw number
        let target = parseFloat(targetString.replace(/[^0-9.]/g, ''));
        let start = 0;
        let duration = 2000; // 2 seconds
        let startTime = null;
        
        element.classList.add('counted');

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            let current = progress * target;
            
            // Format output
            let output = '';
            if (isDecimal) {
                output = current.toFixed(1);
            } else {
                output = Math.floor(current).toLocaleString();
            }
            
            if (isPlus) output += '+';
            if (isPercent) output += '%';
            
            element.textContent = output;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = targetString; // Ensure precision at end
            }
        }
        
        window.requestAnimationFrame(step);
    }


    /* ==========================================================================
       5. TESTIMONIALS SLIDER
       ========================================================================== */
    const track = document.getElementById('testimonials-track');
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');
    const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
    
    let currentIndex = 0;

    function updateSlider(index) {
        // Handle boundary loop
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentIndex = index;
        
        // Move track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update slides visibility classes
        slides.forEach((slide, i) => {
            if (i === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update active dots
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            updateSlider(currentIndex + 1);
        });

        prevBtn.addEventListener('click', () => {
            updateSlider(currentIndex - 1);
        });
    }

    // Dot navigation
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            updateSlider(i);
        });
    });

    // Auto rotate every 8 seconds
    let sliderTimer = setInterval(() => {
        updateSlider(currentIndex + 1);
    }, 8000);

    // Stop timer on hover
    const sliderContainer = document.querySelector('.testimonials-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(sliderTimer));
        sliderContainer.addEventListener('mouseleave', () => {
            sliderTimer = setInterval(() => {
                updateSlider(currentIndex + 1);
            }, 8000);
        });
    }


    /* ==========================================================================
       6. INTERACTIVE MULTI-STEP BOOKING FORM
       ========================================================================== */
    const form = document.getElementById('appointment-form');
    const formSteps = Array.from(document.querySelectorAll('.form-step'));
    const nextBtns = document.querySelectorAll('.btn-next-step');
    const prevBtns = document.querySelectorAll('.btn-prev-step');
    const progressBar = document.getElementById('progress-bar');
    const currentStepEl = document.getElementById('current-step');
    const timeSlots = document.querySelectorAll('.time-slot-btn');
    const hiddenTimeInput = document.getElementById('time-select');
    const timeError = document.getElementById('time-error');
    
    // Success / Loading Elements
    const loadingOverlay = document.getElementById('loading-overlay');
    const successScreen = document.getElementById('success-screen');
    const successCloseBtn = document.getElementById('btn-success-close');
    
    // Summary Data elements
    const summaryName = document.getElementById('summary-name');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');
    const summaryDoctor = document.getElementById('summary-doctor');

    let activeStepIndex = 0;

    // Set minimum date picker values dynamically to today
    const dateInput = document.getElementById('date-input');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0
        let dd = today.getDate();

        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;

        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    // Time Slot Selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            hiddenTimeInput.value = slot.getAttribute('data-time');
            
            // Clear slot error if shown
            const group = slot.closest('.form-group');
            if (group) group.classList.remove('error');
        });
    });

    // Step Navigations
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(activeStepIndex)) {
                activeStepIndex++;
                updateStepView();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            activeStepIndex--;
            updateStepView();
        });
    });

    function updateStepView() {
        formSteps.forEach((step, index) => {
            if (index === activeStepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update step counter text
        if (currentStepEl) currentStepEl.textContent = activeStepIndex + 1;

        // Update progress bar width
        const progressPercentage = ((activeStepIndex + 1) / formSteps.length) * 100;
        if (progressBar) progressBar.style.width = `${progressPercentage}%`;
    }

    // Validate active step inputs
    function validateStep(stepIndex) {
        const activeStep = formSteps[stepIndex];
        const inputs = Array.from(activeStep.querySelectorAll('input[required], select[required]'));
        let isValid = true;

        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            
            if (input.type === 'hidden') {
                // Time grid validation
                if (!input.value) {
                    formGroup.classList.add('error');
                    isValid = false;
                } else {
                    formGroup.classList.remove('error');
                }
            } else if (!input.value.trim()) {
                formGroup.classList.add('error');
                isValid = false;
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                formGroup.classList.add('error');
                isValid = false;
            } else {
                formGroup.classList.remove('error');
            }
        });

        return isValid;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Realtime clear errors on input
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup && input.value.trim()) {
                formGroup.classList.remove('error');
            }
        });
    });

    // Form Submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateStep(activeStepIndex)) {
                // Show loading screen
                loadingOverlay.classList.add('active');
                
                // Form values
                const name = document.getElementById('patient-name').value;
                const email = document.getElementById('patient-email').value;
                const rawDate = document.getElementById('date-input').value;
                const time = document.getElementById('time-select').value;
                
                // Doctor formatting
                const docSelect = document.getElementById('doctor-select');
                const doctorName = docSelect.options[docSelect.selectedIndex].text;
                
                // Date formatting
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = new Date(rawDate).toLocaleDateString('en-US', options);

                // Simulate API call delay
                setTimeout(() => {
                    loadingOverlay.classList.remove('active');
                    
                    // Populate success modal
                    summaryName.textContent = name;
                    summaryDate.textContent = formattedDate;
                    summaryTime.textContent = time;
                    summaryDoctor.textContent = doctorName;
                    
                    // Show success screen
                    successScreen.classList.add('active');
                }, 1800);
            }
        });
    }

    // Success Close & Form Reset
    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', () => {
            // Close success overlay
            successScreen.classList.remove('active');
            
            // Reset form
            form.reset();
            timeSlots.forEach(s => s.classList.remove('selected'));
            hiddenTimeInput.value = '';
            
            // Back to step 1
            activeStepIndex = 0;
            updateStepView();
        });
    }
});
