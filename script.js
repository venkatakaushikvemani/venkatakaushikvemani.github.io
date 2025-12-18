// Smooth scroll behavior for navigation links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const navBar = document.querySelector('.nav-bar');
                const navHeight = navBar ? navBar.offsetHeight : 70;
                
                // Get current scroll position
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                
                // Get target element position
                const targetRect = target.getBoundingClientRect();
                const targetTop = targetRect.top + currentScroll;
                
                // Calculate final position with nav offset
                const finalPosition = targetTop - navHeight - 20;
                
                window.scrollTo({
                    top: finalPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and timeline items
document.querySelectorAll('.section, .timeline-item, .project-card, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Active navigation link highlighting
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPosition = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
        
        let current = '';
        
        // Find which section is currently in view
        // We check from bottom to top so the last (lowest on page) section in view wins
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // A section is "active" if we've scrolled past its top minus some offset
            // The offset (150px) accounts for the nav bar and provides better UX
            if (scrollPosition >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        // If we're at the very top of the page, highlight the first section
        if (scrollPosition < 100 && sections.length > 0) {
            current = sections[0].getAttribute('id');
        }

        // Update active class on nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink(); // Initial call
});

// Add active class styling dynamically
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--color-accent);
        background: var(--color-surface-elevated);
    }
`;
document.head.appendChild(style);

// Parallax effect on hero section
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.3;
        hero.style.transform = `translateY(${parallax}px)`;
    });
}

// Stats counter animation
const stats = document.querySelectorAll('.stat-number');
const animateStats = () => {
    stats.forEach(stat => {
        const target = stat.textContent;
        if (target.includes('+')) {
            const num = parseInt(target);
            animateNumber(stat, 0, num, 1500);
        }
    });
};

function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Trigger stats animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Copy email to clipboard functionality
const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink) {
    emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailLink.getAttribute('href').replace('mailto:', '');
        navigator.clipboard.writeText(email).then(() => {
            // Create toast notification
            const toast = document.createElement('div');
            toast.textContent = 'Email copied to clipboard!';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--color-accent);
                color: var(--color-bg);
                padding: 1rem 2rem;
                border-radius: 8px;
                font-weight: 500;
                z-index: 1000;
                animation: slideUp 0.3s ease-out;
            `;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideDown 0.3s ease-out';
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        });
        
        // Still open email client after a moment
        setTimeout(() => {
            window.location.href = emailLink.getAttribute('href');
        }, 500);
    });
}

// Add toast animations
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translate(-50%, 20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {    
            opacity: 0;
            transform: translate(-50%, 20px);
        }
    }
`;
document.head.appendChild(toastStyle);