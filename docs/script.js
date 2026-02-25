// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.8)';
        nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
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

// Apply animation to sections
document.querySelectorAll('.feature-card, .step, .doc-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Copy code to clipboard
document.querySelectorAll('.code-block').forEach(block => {
    block.style.cursor = 'pointer';
    block.title = 'Click to copy';

    block.addEventListener('click', () => {
        const code = block.querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            const originalText = block.innerHTML;
            block.innerHTML = '<code>✓ Copied to clipboard!</code>';
            setTimeout(() => {
                block.innerHTML = originalText;
            }, 2000);
        });
    });
});

// Terminal typing animation
const terminalCommands = document.querySelectorAll('.terminal-line .command');
let delay = 0;

terminalCommands.forEach((command, index) => {
    const text = command.textContent;
    command.textContent = '';
    command.style.opacity = '1';

    delay += 500;

    setTimeout(() => {
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                command.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                // Show output after last command
                if (index === terminalCommands.length - 1) {
                    setTimeout(() => {
                        document.querySelector('.terminal-line.output').style.opacity = '1';
                    }, 500);
                }
            }
        }, 50);
    }, delay);
});

// Add animation to stats on hero
const stats = document.querySelectorAll('.stat');
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            stats.forEach((stat, index) => {
                setTimeout(() => {
                    stat.style.opacity = '1';
                    stat.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(20px)';
    stat.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    heroObserver.observe(heroStats);
}

// FAQ smooth toggle
document.querySelectorAll('.faq-item').forEach(item => {
    const summary = item.querySelector('summary');

    summary.addEventListener('click', (e) => {
        e.preventDefault();

        // Close other open items
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item && otherItem.open) {
                otherItem.open = false;
            }
        });

        // Toggle current item
        item.open = !item.open;
    });
});

// Add demo video placeholder
const demoSection = document.createElement('section');
demoSection.id = 'demo';
demoSection.className = 'demo';
demoSection.style.padding = '6rem 0';
demoSection.style.background = 'var(--white)';
demoSection.innerHTML = `
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">See It In Action</h2>
            <p class="section-subtitle">Watch how easy it is to automate your job applications</p>
        </div>
        <div style="max-width: 900px; margin: 0 auto; text-align: center;">
            <div style="aspect-ratio: 16/9; background: var(--dark); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: white;">
                <div>
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🎬</div>
                    <div style="font-size: 1.25rem; opacity: 0.8;">Demo Video Coming Soon</div>
                </div>
            </div>
        </div>
    </div>
`;

// Insert demo section after how-it-works
const howItWorks = document.querySelector('.how-it-works');
if (howItWorks) {
    howItWorks.after(demoSection);
}

console.log('🤖 104 Auto-Apply site loaded successfully!');
