const DEFAULT_PAGE = 'overview';
const DEFAULT_TITLE = 'Gnist Guide';

function getActivePageFromHash() {
    const hash = window.location.hash.replace('#', '');

    if (!hash) {
        return DEFAULT_PAGE;
    }

    if (document.getElementById(`page-${hash}`)) {
        return hash;
    }

    const targetElement = document.getElementById(hash);

    if (targetElement) {
        const parentPage = targetElement.closest('.page');

        if (parentPage) {
            return parentPage.id.replace('page-', '');
        }
    }

    return DEFAULT_PAGE;
}

function renderView() {
    const activePageId = getActivePageFromHash();
    const targetHash = window.location.hash.replace('#', '');

    document.querySelectorAll('.page').forEach(page => {
        page.classList.toggle('active', page.id === `page-${activePageId}`);
    });

    document.querySelectorAll('.sub-toc-group').forEach(subToc => {
        subToc.classList.toggle('active', subToc.id === `sub-${activePageId}`);
    });

    document.querySelectorAll('.main-toc a').forEach(link => {
        link.classList.toggle('active', link.dataset.pageLink === activePageId);
    });

    const activePage = document.getElementById(`page-${activePageId}`);
    const pageHeading = activePage?.querySelector('h1');

    document.title = pageHeading ? `${pageHeading.textContent} - ${DEFAULT_TITLE}` : DEFAULT_TITLE;

    if (targetHash && targetHash !== activePageId) {
        const targetSection = document.getElementById(targetHash);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

window.addEventListener('hashchange', renderView);
window.addEventListener('DOMContentLoaded', renderView);

