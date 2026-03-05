document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // --- Scroll Animations using Intersection Observer ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the animation class
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach(el => observer.observe(el));

    // --- Dynamic Cycle Connector Logic (Optional visual enhancement) ---
    // If we wanted to draw lines between cards dynamically, we could do it here.
    // --- Form Dynamic Fields Logic ---
    const roleSelect = document.getElementById('role');
    const farmerSpecs = document.getElementById('farmerSpecs');
    const restaurantSpecs = document.getElementById('restaurantSpecs');

    if (roleSelect) {
        roleSelect.addEventListener('change', (e) => {
            const selectedRole = e.target.value;

            // Hide both first
            farmerSpecs.classList.add('hidden');
            restaurantSpecs.classList.add('hidden');

            if (selectedRole === 'farmer') {
                farmerSpecs.classList.remove('hidden');
            } else if (selectedRole === 'restaurant') {
                restaurantSpecs.classList.remove('hidden');
            }
        });
    }

    // --- Form Submission Logic ---
    const joinForm = document.getElementById('joinForm');
    const formMessage = document.getElementById('formMessage');

    if (joinForm) {
        joinForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Joining...';
            submitBtn.disabled = true;

            const formData = new FormData(joinForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/join', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    formMessage.textContent = 'Success! Welcome to the EcoCycle ecosystem.';
                    formMessage.className = 'form-message success';
                    joinForm.reset();
                    farmerSpecs.classList.add('hidden');
                    restaurantSpecs.classList.add('hidden');
                } else {
                    formMessage.textContent = result.message || 'Something went wrong. Please try again.';
                    formMessage.className = 'form-message error';
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                formMessage.textContent = 'Network error. Please try again later.';
                formMessage.className = 'form-message error';
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;

                // Clear message after 5 seconds
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                }, 5000);
            }
        });
    }

    // --- Login Modal & SPA Logic ---
    const navLoginBtn = document.getElementById('navLoginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const loginRoleInput = document.getElementById('loginRole');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    // Views
    const landingSections = document.querySelectorAll('main > section:not(#dashboardView)');
    const dashboardView = document.getElementById('dashboardView');
    const farmerDashboard = document.getElementById('farmerDashboard');
    const restaurantDashboard = document.getElementById('restaurantDashboard');
    const logoutBtn = document.getElementById('logoutBtn');

    // Open Modal
    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('hidden');
        });
    }

    // Close Modal
    if (closeLogin) {
        closeLogin.addEventListener('click', () => {
            loginModal.classList.add('hidden');
            loginMessage.textContent = '';
            loginForm.reset();
        });
    }

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loginRoleInput.value = btn.dataset.role;
            loginMessage.textContent = '';
        });
    });

    // Handle Login (Mock Validation)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const role = loginRoleInput.value;

            if (email.length > 0) {
                // Success Mock
                loginModal.classList.add('hidden');

                // Hide Landing Page
                landingSections.forEach(sec => sec.classList.add('hidden'));

                // Show Dashboard
                dashboardView.classList.remove('hidden');
                farmerDashboard.classList.add('hidden');
                restaurantDashboard.classList.add('hidden');

                if (role === 'farmer') {
                    farmerDashboard.classList.remove('hidden');
                } else {
                    restaurantDashboard.classList.remove('hidden');
                }

                // Update Nav
                navLoginBtn.parentElement.style.display = 'none'; // hide the li
                window.scrollTo(0, 0);
            }
        });
    }

    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            dashboardView.classList.add('hidden');
            landingSections.forEach(sec => sec.classList.remove('hidden'));
            navLoginBtn.parentElement.style.display = 'block';
            loginForm.reset();
            window.scrollTo(0, 0);
        });
    }

    // --- Upload Waste Form Logic ---
    const uploadWasteForm = document.getElementById('uploadWasteForm');
    const uploadMessage = document.getElementById('uploadMessage');

    if (uploadWasteForm) {
        uploadWasteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = uploadWasteForm.querySelector('button');
            submitBtn.textContent = 'Uploading...';
            submitBtn.disabled = true;

            const formData = new FormData(uploadWasteForm);

            try {
                const response = await fetch('/api/upload-waste', {
                    method: 'POST',
                    body: formData // Note: no Content-Type header needed for FormData inside fetch
                });

                const result = await response.json();

                if (response.ok) {
                    uploadMessage.textContent = 'Image uploaded successfully!';
                    uploadMessage.className = 'form-message success';
                    uploadWasteForm.reset();
                } else {
                    uploadMessage.textContent = result.message || 'Upload failed.';
                    uploadMessage.className = 'form-message error';
                }
            } catch (error) {
                console.error('Upload Error:', error);
                uploadMessage.textContent = 'Network error during upload.';
                uploadMessage.className = 'form-message error';
            } finally {
                submitBtn.textContent = 'Upload Image';
                submitBtn.disabled = false;
                setTimeout(() => uploadMessage.textContent = '', 5000);
            }
        });
    }

});
