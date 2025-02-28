// Common JavaScript functionality for all pages

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
    
    // User dropdown menu
    const userMenu = document.querySelector('.user-menu');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userMenu && dropdownMenu) {
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!userMenu.contains(event.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
        
        // Toggle dropdown on user menu click (for mobile)
        userMenu.addEventListener('click', function() {
            const style = window.getComputedStyle(dropdownMenu);
            if (style.display === 'none') {
                dropdownMenu.style.display = 'block';
            } else {
                dropdownMenu.style.display = 'none';
            }
        });
    }
});

// Function to handle language change
function changeLanguage(lang) {
    console.log('Changing language to: ' + lang);
    // In a real application, this would reload the page with the new language
    // or update the UI text using translations
    
    // Save language preference in local storage
    localStorage.setItem('preferredLanguage', lang);
    
    // For demonstration purposes, we'll just show an alert
    alert('Kalba pakeista į: ' + getLanguageName(lang));
}

// Get full language name from code
function getLanguageName(code) {
    const languages = {
        'lt': 'Lietuvių',
        'en': 'English',
        'ru': 'Русский'
    };
    return languages[code] || code;
}

// Check for saved language preference on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = savedLanguage;
        }
    }
});

// Function to format currency amounts
function formatCurrency(amount, currency = '€') {
    // Convert to number and handle commas/dots properly
    const numAmount = parseFloat(amount.toString().replace(',', '.'));
    
    // Format with Lithuanian locale (dots for thousands, commas for decimals)
    const formattedAmount = numAmount.toLocaleString('lt-LT', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Return with Euro symbol at the end
    return formattedAmount + ' ' + currency;
}

// Function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    
    // Return in Lithuanian format YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// Function to add a notification
function addNotification(container, notification) {
    const notificationList = container.querySelector('.notification-list');
    if (!notificationList) return;
    
    const notificationElement = document.createElement('li');
    notificationElement.className = `notification ${notification.unread ? 'unread' : ''} ${notification.important ? 'important' : ''}`;
    
    notificationElement.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${notification.icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-time">${notification.time}</div>
            <div class="notification-text">${notification.text}</div>
        </div>
    `;
    
    notificationList.prepend(notificationElement);
}

// Function to handle form submission with validation
function setupFormValidation(formSelector, validationRules, submitCallback) {
    const form = document.querySelector(formSelector);
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let isValid = true;
        const formData = {};
        
        // Validate each field according to rules
        for (const fieldName in validationRules) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field) continue;
            
            const value = field.value.trim();
            formData[fieldName] = value;
            
            const rule = validationRules[fieldName];
            const errorElement = form.querySelector(`[data-error-for="${fieldName}"]`);
            
            // Clear previous error
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
                field.classList.remove('error');
            }
            
            // Required field validation
            if (rule.required && value === '') {
                isValid = false;
                if (errorElement) {
                    errorElement.textContent = rule.requiredMessage || 'Šis laukas yra privalomas';
                    errorElement.style.display = 'block';
                    field.classList.add('error');
                }
                continue;
            }
            
            // Pattern validation
            if (rule.pattern && !rule.pattern.test(value) && value !== '') {
                isValid = false;
                if (errorElement) {
                    errorElement.textContent = rule.patternMessage || 'Neteisingas formatas';
                    errorElement.style.display = 'block';
                    field.classList.add('error');
                }
            }
        }
        
        // If all validations pass, call the callback
        if (isValid && typeof submitCallback === 'function') {
            submitCallback(formData);
        }
    });
} 