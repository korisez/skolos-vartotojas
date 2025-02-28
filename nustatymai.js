document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings tabs
    initSettingsTabs();
    
    // Initialize personal information form
    initPersonalInfoForm();
    
    // Initialize security section
    initSecuritySettings();
    
    // Initialize notification settings
    initNotificationSettings();
    
    // Initialize payment methods section
    initPaymentMethods();
    
    // Initialize language settings
    initLanguageSettings();
    
    // Initialize privacy settings
    initPrivacySettings();
});

/**
 * Initialize tabs navigation in settings
 */
function initSettingsTabs() {
    const tabLinks = document.querySelectorAll('.settings-nav li');
    const tabContents = document.querySelectorAll('.settings-tab');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all links
            tabLinks.forEach(item => item.classList.remove('active'));
            
            // Add active class to current link
            link.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Show current tab content
            const tabId = link.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // If on mobile, scroll to content
            if (window.innerWidth < 992) {
                document.querySelector('.settings-content').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Handle tab navigation from URL hash
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const tabLink = document.querySelector(`.settings-nav li[data-tab="${hash}"]`);
        if (tabLink) {
            tabLink.click();
        }
    }
}

/**
 * Initialize personal information form
 */
function initPersonalInfoForm() {
    const personalInfoForm = document.querySelector('#personal-info .settings-form');
    
    if (!personalInfoForm) return;
    
    personalInfoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postal-code').value,
            country: document.getElementById('country').value
        };
        
        // Validate form data
        let isValid = true;
        let errorMessage = '';
        
        if (!formData.email) {
            isValid = false;
            errorMessage += 'El. pašto adresas yra privalomas.\n';
        } else if (!isValidEmail(formData.email)) {
            isValid = false;
            errorMessage += 'Neteisingas el. pašto adresas.\n';
        }
        
        if (!formData.phone) {
            isValid = false;
            errorMessage += 'Telefono numeris yra privalomas.\n';
        }
        
        if (!isValid) {
            alert('Klaida:\n' + errorMessage);
            return;
        }
        
        // Simulate form submission with API call
        console.log('Saving personal information...', formData);
        
        // Show success message after brief timeout to simulate server response
        setTimeout(() => {
            alert('Jūsų asmeninė informacija buvo sėkmingai atnaujinta.');
        }, 1000);
    });
    
    // Handle avatar change button
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function() {
            alert('Šiuo metu profilio nuotraukos keitimas yra neįgyvendintas. Atsiprašome už nepatogumus.');
        });
    }
}

/**
 * Initialize security settings
 */
function initSecuritySettings() {
    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (type === 'password') {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });
    
    // Password form submission
    const passwordForm = document.querySelector('.password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validate inputs
            if (!currentPassword) {
                alert('Įveskite dabartinį slaptažodį.');
                return;
            }
            
            if (!newPassword) {
                alert('Įveskite naują slaptažodį.');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                alert('Nauji slaptažodžiai nesutampa.');
                return;
            }
            
            if (newPassword.length < 8) {
                alert('Slaptažodis turi būti bent 8 simbolių ilgio.');
                return;
            }
            
            // Simulate password change
            console.log('Changing password...');
            
            // Show success message
            setTimeout(() => {
                alert('Jūsų slaptažodis buvo sėkmingai pakeistas.');
                passwordForm.reset();
                hidePasswordStrength();
            }, 1000);
        });
    }
    
    // Password strength meter
    const newPasswordInput = document.getElementById('new-password');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            if (password) {
                showPasswordStrength(password);
            } else {
                hidePasswordStrength();
            }
        });
    }
    
    // Two-factor authentication button
    const enable2faBtn = document.querySelector('.enable-2fa-btn');
    if (enable2faBtn) {
        enable2faBtn.addEventListener('click', function() {
            alert('Dviejų faktorių autentifikacija šiuo metu nėra įgyvendinta. Ši funkcija bus prieinama netrukus.');
        });
    }
    
    // Session management
    const logoutSessionBtns = document.querySelectorAll('.session-item:not(.current) .btn-danger');
    logoutSessionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sessionItem = this.closest('.session-item');
            sessionItem.style.opacity = '0.5';
            setTimeout(() => {
                sessionItem.remove();
                alert('Sesija sėkmingai užbaigta.');
            }, 1000);
        });
    });
    
    const logoutAllBtn = document.querySelector('.logout-all-btn');
    if (logoutAllBtn) {
        logoutAllBtn.addEventListener('click', function() {
            if (confirm('Ar tikrai norite atsijungti iš visų įrenginių, išskyrus dabartinį?')) {
                const sessionItems = document.querySelectorAll('.session-item:not(.current)');
                sessionItems.forEach(item => {
                    item.style.opacity = '0.5';
                });
                
                setTimeout(() => {
                    sessionItems.forEach(item => item.remove());
                    alert('Sėkmingai atsijungta iš visų kitų įrenginių.');
                }, 1000);
            }
        });
    }
}

/**
 * Display password strength based on the password
 */
function showPasswordStrength(password) {
    const strengthContainer = document.querySelector('.password-strength');
    const strengthLevel = document.querySelector('.strength-level');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthContainer || !strengthLevel || !strengthText) return;
    
    strengthContainer.classList.remove('hidden');
    
    // Calculate password strength
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase letters
    if (/[a-z]/.test(password)) strength += 1; // Lowercase letters
    if (/[0-9]/.test(password)) strength += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Special characters
    
    // Update UI based on strength
    let percentage = 0;
    let text = '';
    let color = '';
    
    if (strength < 3) {
        percentage = 20;
        text = 'Silpnas';
        color = '#dc3545'; // Danger color
    } else if (strength < 5) {
        percentage = 60;
        text = 'Vidutinis';
        color = '#ffc107'; // Warning color
    } else {
        percentage = 100;
        text = 'Stiprus';
        color = '#28a745'; // Success color
    }
    
    strengthLevel.style.width = `${percentage}%`;
    strengthLevel.style.backgroundColor = color;
    strengthText.textContent = text;
}

/**
 * Hide password strength meter
 */
function hidePasswordStrength() {
    const strengthContainer = document.querySelector('.password-strength');
    if (strengthContainer) {
        strengthContainer.classList.add('hidden');
    }
}

/**
 * Initialize notification settings
 */
function initNotificationSettings() {
    const saveNotificationsBtn = document.querySelector('.save-notifications-btn');
    const selectAllBtn = document.querySelector('.select-all-btn');
    const clearAllBtn = document.querySelector('.clear-all-btn');
    const checkboxes = document.querySelectorAll('.notification-channels input[type="checkbox"]');
    
    if (!saveNotificationsBtn || !selectAllBtn || !clearAllBtn) return;
    
    // Save notifications settings
    saveNotificationsBtn.addEventListener('click', function() {
        console.log('Saving notification settings...');
        
        const settings = {};
        checkboxes.forEach(checkbox => {
            settings[checkbox.name] = checkbox.checked;
        });
        
        console.log('Notification settings:', settings);
        
        // Show success message
        setTimeout(() => {
            alert('Pranešimų nustatymai sėkmingai išsaugoti.');
        }, 1000);
    });
    
    // Select all checkboxes
    selectAllBtn.addEventListener('click', function() {
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
    });
    
    // Clear all checkboxes
    clearAllBtn.addEventListener('click', function() {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    });
}

/**
 * Initialize payment methods section
 */
function initPaymentMethods() {
    // Card actions
    const editCardBtns = document.querySelectorAll('.edit-card-btn');
    const removeCardBtns = document.querySelectorAll('.remove-card-btn');
    const addCardBtn = document.querySelector('.add-card-btn');
    
    // Edit card button
    editCardBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cardInfo = this.closest('.payment-method-card').querySelector('.card-info h3').textContent;
            alert(`Kortelės redagavimas (${cardInfo}) šiuo metu nėra įgyvendintas. Ši funkcija bus prieinama netrukus.`);
        });
    });
    
    // Remove card button
    removeCardBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cardItem = this.closest('.payment-method-card');
            const cardInfo = cardItem.querySelector('.card-info h3').textContent;
            
            if (confirm(`Ar tikrai norite pašalinti šią mokėjimo kortelę: ${cardInfo}?`)) {
                cardItem.style.opacity = '0.5';
                setTimeout(() => {
                    cardItem.remove();
                    alert('Mokėjimo kortelė sėkmingai pašalinta.');
                }, 1000);
            }
        });
    });
    
    // Add card button
    if (addCardBtn) {
        addCardBtn.addEventListener('click', function() {
            alert('Naujos mokėjimo kortelės pridėjimas šiuo metu nėra įgyvendintas. Ši funkcija bus prieinama netrukus.');
        });
    }
    
    // Auto payments toggle
    const autoPaymentsToggle = document.getElementById('auto-payments-toggle');
    const autoPaymentDetails = document.querySelector('.auto-payment-details');
    const savePaymentSettingsBtn = document.querySelector('.save-payment-settings-btn');
    
    if (autoPaymentsToggle && autoPaymentDetails) {
        // Toggle auto payment details visibility
        autoPaymentsToggle.addEventListener('change', function() {
            if (this.checked) {
                autoPaymentDetails.style.display = 'block';
            } else {
                autoPaymentDetails.style.display = 'none';
            }
        });
        
        // Initially hide auto payment details
        autoPaymentDetails.style.display = autoPaymentsToggle.checked ? 'block' : 'none';
    }
    
    // Save payment settings
    if (savePaymentSettingsBtn) {
        savePaymentSettingsBtn.addEventListener('click', function() {
            const settings = {
                autoPayments: autoPaymentsToggle ? autoPaymentsToggle.checked : false,
                paymentMethod: document.getElementById('auto-payment-card') ? document.getElementById('auto-payment-card').value : null,
                paymentDate: document.getElementById('auto-payment-date') ? document.getElementById('auto-payment-date').value : null
            };
            
            console.log('Saving payment settings:', settings);
            
            // Show success message
            setTimeout(() => {
                alert('Mokėjimo nustatymai sėkmingai išsaugoti.');
            }, 1000);
        });
    }
}

/**
 * Initialize language settings
 */
function initLanguageSettings() {
    const languageSelect = document.getElementById('language-select');
    const dateFormatSelect = document.getElementById('date-format');
    const timeFormatSelect = document.getElementById('time-format');
    const currencySelect = document.getElementById('currency');
    const timezoneSelect = document.getElementById('timezone');
    const saveLanguageSettingsBtn = document.querySelector('.save-language-settings-btn');
    const restoreLanguageBtn = document.querySelector('.restore-language-btn');
    
    if (!saveLanguageSettingsBtn || !restoreLanguageBtn) return;
    
    // Save language settings
    saveLanguageSettingsBtn.addEventListener('click', function() {
        const settings = {
            language: languageSelect ? languageSelect.value : 'lt',
            dateFormat: dateFormatSelect ? dateFormatSelect.value : 'ymd',
            timeFormat: timeFormatSelect ? timeFormatSelect.value : '24h',
            currency: currencySelect ? currencySelect.value : 'eur',
            timezone: timezoneSelect ? timezoneSelect.value : 'europe-vilnius'
        };
        
        console.log('Saving language settings:', settings);
        
        // Update page language if changed
        if (languageSelect && settings.language !== 'lt') {
            alert('Kalbos keitimas reikalaus puslapio perkrovimo. Puslapis bus perkrautas po sėkmingo išsaugojimo.');
        }
        
        // Show success message
        setTimeout(() => {
            alert('Kalbos ir regiono nustatymai sėkmingai išsaugoti.');
            
            // In a real application, we would refresh the page with the new language
            // window.location.reload();
        }, 1000);
    });
    
    // Restore default language settings
    restoreLanguageBtn.addEventListener('click', function() {
        if (confirm('Ar tikrai norite atstatyti numatytuosius kalbos ir regiono nustatymus?')) {
            if (languageSelect) languageSelect.value = 'lt';
            if (dateFormatSelect) dateFormatSelect.value = 'ymd';
            if (timeFormatSelect) timeFormatSelect.value = '24h';
            if (currencySelect) currencySelect.value = 'eur';
            if (timezoneSelect) timezoneSelect.value = 'europe-vilnius';
            
            alert('Nustatymai atstatyti į numatytuosius.');
        }
    });
}

/**
 * Initialize privacy settings
 */
function initPrivacySettings() {
    const marketingConsent = document.getElementById('marketing-consent');
    const thirdPartyConsent = document.getElementById('third-party-consent');
    const analyticsConsent = document.getElementById('analytics-consent');
    const savePrivacySettingsBtn = document.querySelector('.save-privacy-settings-btn');
    const exportDataBtn = document.querySelector('.export-data-btn');
    const deleteAccountBtn = document.querySelector('.delete-account-btn');
    
    if (!savePrivacySettingsBtn || !exportDataBtn || !deleteAccountBtn) return;
    
    // Save privacy settings
    savePrivacySettingsBtn.addEventListener('click', function() {
        const settings = {
            marketingConsent: marketingConsent ? marketingConsent.checked : false,
            thirdPartyConsent: thirdPartyConsent ? thirdPartyConsent.checked : false,
            analyticsConsent: analyticsConsent ? analyticsConsent.checked : false
        };
        
        console.log('Saving privacy settings:', settings);
        
        // Show success message
        setTimeout(() => {
            alert('Privatumo nustatymai sėkmingai išsaugoti.');
        }, 1000);
    });
    
    // Export data
    exportDataBtn.addEventListener('click', function() {
        alert('Jūsų duomenys ruošiami eksportavimui. Kai jie bus paruošti, gausite pranešimą el. paštu su nuoroda atsisiųsti duomenis.');
    });
    
    // Delete account
    deleteAccountBtn.addEventListener('click', function() {
        const confirmed = confirm('Ar tikrai norite ištrinti savo paskyrą? Šis veiksmas negrįžtamas ir visi jūsų duomenys bus ištrinti.');
        
        if (confirmed) {
            const doubleConfirmed = confirm('DĖMESIO: Patvirtinkite, kad suprantate, jog ištrinus paskyrą, visi jūsų duomenys bus ištrinti ir jų nebus galima atkurti. Ar tikrai norite tęsti?');
            
            if (doubleConfirmed) {
                alert('Paskyros ištrynimo prašymas pateiktas. Gausite el. laišką su papildomais patvirtinimo veiksmais. Ačiū, kad naudojotės mūsų paslaugomis.');
            }
        }
    });
}

/**
 * Validate email address
 */
function isValidEmail(email) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
} 