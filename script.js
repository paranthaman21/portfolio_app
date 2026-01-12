/* Particles JS Config */
document.addEventListener('DOMContentLoaded', () => {
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": ["#00f2ff", "#bc13fe"]
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                },
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 4, /* Continuous motion speed */
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse" /* Repulse on hover */
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 100, /* Free space bubble size */
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });

    /* Mobile Menu Toggle */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Hamburger animation
        hamburger.classList.toggle('toggle');

        // Link animation
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Close menu when link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    /* Contact Form Handling */
    /* Contact Form Handling with Supabase */
    // Initialize Supabase - REPLACE WITH YOUR ACTUAL URL AND KEY
    // Initialize Supabase
    const supabaseUrl = 'https://hsdxjzstsvkrdgpyhlxn.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzZHhqenN0c3ZrcmRncHlobHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMzIzNzcsImV4cCI6MjA4MzgwODM3N30.ATh3GZA5jbAQVMUN3rvPvOiI1fCeO_smPquXN8VaIPs';

    // Check if the global supabase object exists
    if (typeof supabase === 'undefined') {
        console.error('Supabase client library not loaded!');
        const formStatus = document.getElementById('form-status');
        if (formStatus) {
            formStatus.innerText = 'Error: Supabase library not loaded. Check your internet connection.';
            formStatus.style.color = 'red';
            formStatus.style.display = 'block';
        }
    }

    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';
            formStatus.style.display = 'none';
            formStatus.className = '';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Submit to Supabase
                const { error } = await supabaseClient
                    .from('contacts')
                    .insert([
                        {
                            name: data.name,
                            email: data.email,
                            message: data.message
                        }
                    ]);

                if (error) throw error;

                formStatus.innerText = 'Message sent successfully!';
                formStatus.style.color = 'green';
                formStatus.style.display = 'block';
                contactForm.reset();
            } catch (error) {
                console.error('Error submitting form:', error);
                // Show the actual error message to help functionality debugging
                formStatus.innerText = 'Error: ' + (error.message || 'An error occurred.');
                formStatus.style.color = 'red';
                formStatus.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }
});

/* Additional CSS for animations handled in JS */
/* Note: We handle simple classes here, but keyframes would be in CSS. */
