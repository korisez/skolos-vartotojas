// JavaScript for the Help page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize help navigation
    initHelpNavigation();
    
    // Initialize accordion
    initAccordion();
    
    // Initialize help search
    initHelpSearch();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize live chat
    initLiveChat();
});

// Initialize help navigation
function initHelpNavigation() {
    const navItems = document.querySelectorAll('.help-nav li');
    const sections = document.querySelectorAll('.help-section');
    
    if (!navItems.length || !sections.length) return;
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Get section ID
            const sectionId = this.getAttribute('data-section');
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Show the corresponding section
            const activeSection = document.getElementById(sectionId);
            if (activeSection) {
                activeSection.classList.add('active');
                
                // If in mobile view, scroll to the section
                if (window.innerWidth < 992) {
                    const offset = document.querySelector('.help-sidebar').offsetHeight + 20;
                    window.scrollTo({
                        top: activeSection.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Initialize accordion
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    if (!accordionItems.length) return;
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        if (!header || !content) return;
        
        header.addEventListener('click', function() {
            // Toggle active class on the item
            const isActive = item.classList.contains('active');
            
            // If already active, close it
            if (isActive) {
                item.classList.remove('active');
            } else {
                // Close all other items
                accordionItems.forEach(accordionItem => {
                    accordionItem.classList.remove('active');
                });
                
                // Open this item
                item.classList.add('active');
            }
        });
    });
}

// Initialize help search
function initHelpSearch() {
    const searchInput = document.querySelector('.help-sidebar .search-box input');
    const searchButton = document.querySelector('.help-sidebar .search-box button');
    const accordionItems = document.querySelectorAll('.accordion-item');
    const navItems = document.querySelectorAll('.help-nav li');
    const sections = document.querySelectorAll('.help-section');
    
    if (!searchInput || !accordionItems.length) return;
    
    // Search function
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (!searchTerm) {
            // If search is empty, reset everything
            accordionItems.forEach(item => {
                item.style.display = '';
                item.classList.remove('active');
            });
            
            // Reset navigation
            if (navItems.length && sections.length) {
                const activeNav = document.querySelector('.help-nav li.active');
                const activeSectionId = activeNav ? activeNav.getAttribute('data-section') : 'faq';
                
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === activeSectionId) {
                        section.classList.add('active');
                    }
                });
            }
            
            return;
        }
        
        // Show FAQ section when searching
        if (navItems.length && sections.length) {
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            const faqNav = document.querySelector('.help-nav li[data-section="faq"]');
            const faqSection = document.getElementById('faq');
            
            if (faqNav) faqNav.classList.add('active');
            if (faqSection) faqSection.classList.add('active');
        }
        
        // Search through accordion items
        let hasResults = false;
        
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header h3');
            const content = item.querySelector('.accordion-content');
            
            if (!header || !content) return;
            
            const headerText = header.textContent.toLowerCase();
            const contentText = content.textContent.toLowerCase();
            
            if (headerText.includes(searchTerm) || contentText.includes(searchTerm)) {
                item.style.display = '';
                item.classList.add('active'); // Open matching items
                hasResults = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // If no results in FAQ, try searching in other sections
        if (!hasResults) {
            sections.forEach(section => {
                const sectionAccordions = section.querySelectorAll('.accordion-item');
                let sectionHasResults = false;
                
                sectionAccordions.forEach(item => {
                    const header = item.querySelector('.accordion-header h3');
                    const content = item.querySelector('.accordion-content');
                    
                    if (!header || !content) return;
                    
                    const headerText = header.textContent.toLowerCase();
                    const contentText = content.textContent.toLowerCase();
                    
                    if (headerText.includes(searchTerm) || contentText.includes(searchTerm)) {
                        item.style.display = '';
                        item.classList.add('active');
                        sectionHasResults = true;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                if (sectionHasResults) {
                    sections.forEach(s => s.classList.remove('active'));
                    section.classList.add('active');
                    
                    // Update navigation
                    navItems.forEach(nav => {
                        nav.classList.remove('active');
                        if (nav.getAttribute('data-section') === section.id) {
                            nav.classList.add('active');
                        }
                    });
                }
            });
        }
    }
    
    // Search on input
    searchInput.addEventListener('input', performSearch);
    
    // Search on button click
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });
    }
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
}

// Initialize contact form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const subjectSelect = document.getElementById('contact-subject');
        const messageTextarea = document.getElementById('contact-message');
        
        // Simple validation
        if (!nameInput.value.trim()) {
            alert('Prašome įvesti savo vardą ir pavardę.');
            nameInput.focus();
            return;
        }
        
        if (!emailInput.value.trim()) {
            alert('Prašome įvesti savo el. pašto adresą.');
            emailInput.focus();
            return;
        }
        
        if (!isValidEmail(emailInput.value.trim())) {
            alert('Prašome įvesti galiojantį el. pašto adresą.');
            emailInput.focus();
            return;
        }
        
        if (!subjectSelect.value) {
            alert('Prašome pasirinkti užklausos temą.');
            subjectSelect.focus();
            return;
        }
        
        if (!messageTextarea.value.trim()) {
            alert('Prašome įvesti žinutę.');
            messageTextarea.focus();
            return;
        }
        
        // In a real application, this would submit the form to a server
        // For demo purposes, we'll just show a success message
        alert('Jūsų užklausa sėkmingai išsiųsta. Susisieksime su jumis per 1 darbo dieną.');
        
        // Reset form
        contactForm.reset();
    });
    
    // Helper function to validate email
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}

// Initialize live chat
function initLiveChat() {
    const chatButton = document.querySelector('.chat-toggle');
    
    if (!chatButton) return;
    
    chatButton.addEventListener('click', function() {
        // In a real application, this would open a chat widget
        // For demo purposes, we'll just show a message
        alert('Pokalbių funkcija šiuo metu tobulinama. Prašome naudoti kontaktinę formą arba paskambinti mums.');
    });
} 