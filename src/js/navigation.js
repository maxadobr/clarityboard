export function initializeBoardNavigation() {
    const boardsContainer = document.querySelector('.boards-container');
    const prevButton = document.getElementById('prev-board');
    const nextButton = document.getElementById('next-board');
    
    // Wait for boards to be loaded
    const observer = new MutationObserver((mutationsList, observer) => {
        const boards = document.querySelectorAll('.board');
        if (boards.length > 0) {
            setupNavigation(boardsContainer, prevButton, nextButton, boards);
            observer.disconnect(); // Stop observing once boards are found
        }
    });

    if (boardsContainer) {
        observer.observe(boardsContainer, { childList: true, subtree: true });
    }

    function setupNavigation(container, prevBtn, nextBtn, boards) {
        let currentBoardIndex = 0;

        if (!container || !prevBtn || !nextBtn || boards.length === 0) {
            const navButtons = document.querySelector('.board-nav-buttons');
            if (navButtons) navButtons.style.display = 'none';
            return;
        }

        const updateButtonsVisibility = () => {
            if (window.innerWidth < 768) {
                prevBtn.style.display = currentBoardIndex === 0 ? 'none' : 'flex';
                nextBtn.style.display = currentBoardIndex === boards.length - 1 ? 'none' : 'flex';
            } else {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
        };

        const scrollToBoard = (index) => {
            const boardWidth = container.offsetWidth;
            container.scrollTo({ left: index * boardWidth, behavior: 'smooth' });
            currentBoardIndex = index;
            updateButtonsVisibility();
        };

        prevBtn.addEventListener('click', () => { if (currentBoardIndex > 0) scrollToBoard(currentBoardIndex - 1); });
        nextBtn.addEventListener('click', () => { if (currentBoardIndex < boards.length - 1) scrollToBoard(currentBoardIndex + 1); });

        updateButtonsVisibility();
        window.addEventListener('resize', updateButtonsVisibility);
    }
}