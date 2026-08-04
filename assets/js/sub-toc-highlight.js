document.addEventListener('DOMContentLoaded', () => {
    const subTocLinks = document.querySelectorAll('.sub-toc a');

    if (!subTocLinks.length) {
        return;
    }

    const linkMap = new Map();
    const headings = [];

    const setActive = (linkToActivate) => {
        subTocLinks.forEach((l) => l.classList.remove('active'));

        if (linkToActivate) {
            linkToActivate.classList.add('active');
        }
    };

    subTocLinks.forEach((link) => {
        const href = link.getAttribute('href');

        if (href && href.startsWith('#')) {
            const id = href.substring(1);
            const heading = document.getElementById(id);

            if (heading) {
                linkMap.set(id, link);
                headings.push(heading);
            }
        }

        link.addEventListener('click', () => {
            setActive(link);
        });
    });

    if (!headings.length) {
        return;
    }

    const observerOptions = {
        rootMargin: '-15% 0px -70% 0px',
        threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;

                if (linkMap.has(id)) {
                    setActive(linkMap.get(id));
                }
            }
        });
    }, observerOptions);

    headings.forEach((heading) => observer.observe(heading));
});
