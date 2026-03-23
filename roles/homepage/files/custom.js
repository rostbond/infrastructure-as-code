const script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js";
script.onload = () => {
    const particlesDiv = document.createElement('div');
    particlesDiv.id = 'tsparticles';
    particlesDiv.style.position = 'fixed';
    particlesDiv.style.top = '0';
    particlesDiv.style.left = '0';
    particlesDiv.style.width = '100%';
    particlesDiv.style.height = '100%';
    particlesDiv.style.zIndex = '-1';
    document.body.prepend(particlesDiv);

    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        particles: {
            number: { value: 140, density: { enable: true, area: 800 } },
            color: { value: ["#FFCC66", "#73D0FF", "#95E6CB", "#F28779", "#CBCCC6"] },
            opacity: {
                value: { min: 0.1, max: 0.4 },
                animation: { enable: true, speed: 0.5, sync: false }
            },
            size: { value: { min: 0.5, max: 2 } },
            move: { enable: true, speed: 0.1, direction: "none", outModes: { default: "out" } }
        }
    });
};
document.head.appendChild(script);

function applyTypewriter() {
    const greeting = document.querySelector('h1');
    if (greeting && !greeting.dataset.typed) {
        const text = greeting.innerText;
        greeting.innerText = '';
        greeting.dataset.typed = "true";
        greeting.style.fontFamily = "monospace";
        greeting.style.color = "#95e6cb";

        let i = 0;
        function type() {
            if (i < text.length) {
                greeting.innerText += text.charAt(i);
                i++;
                setTimeout(type, 80);
            } else {
                greeting.innerHTML += '<span class="cursor">_</span>';
                const style = document.createElement('style');
                style.innerHTML = ".cursor { animation: blink 1s step-end infinite; color: #ffcc66; } @keyframes blink { 50% { opacity: 0; } }";
                document.head.appendChild(style);
            }
        }
        type();
    }
}

const observer = new MutationObserver(() => {
    applyTypewriter();
});
observer.observe(document.body, { childList: true, subtree: true });