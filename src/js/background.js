// Particle System for Hero Background
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(79, 70, 229, ${Math.random() * 0.5 + 0.2})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize background effect
function initBackground() {
    const canvas = document.getElementById('hero-background');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    let animationFrameId;

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Create particles
    function createParticles() {
        const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(canvas));
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        particles.forEach((particle, i) => {
            particle.update();
            particle.draw(ctx);

            // Connect particles
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(79, 70, 229, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        particles.length = 0;
        createParticles();
    });

    // Initialize
    resizeCanvas();
    createParticles();
    animate();

    // Cleanup
    return () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initBackground); 