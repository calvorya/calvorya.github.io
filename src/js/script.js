document.addEventListener('DOMContentLoaded', function () {
    // Add a class to the body when the page is fully loaded
    setTimeout(() => {
        document.querySelector('.loading').classList.add('hidden');
    }, 1000);
    var toggler = document.querySelector('#navbar-toggler');
    var mobileMenuPanel = document.getElementById('mobileMenuPanel');
    var closeBtn = document.getElementById('closeMobileMenu');

    function openMobileMenu() {
        mobileMenuPanel.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    function closeMobileMenu() {
        mobileMenuPanel.style.display = 'none';
        document.body.style.overflow = '';
    }

    window.closeMobileMenu = closeMobileMenu;

    if (toggler) {
        toggler.addEventListener('click', function (e) {
            if (window.innerWidth < 992) {
                e.preventDefault();
                openMobileMenu();
            }
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileMenu);
    }
    // Close menu on resize to large screens
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 992) {
            closeMobileMenu();
        }
    });
});



