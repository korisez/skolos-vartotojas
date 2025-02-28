// JavaScript for the index/dashboard page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initDashboard();
    
    // Setup edit button for personal info
    setupPersonalInfoEdit();
    
    // Initialize notifications filtering
    initNotificationsFilter();
    
    // Initialize collection timeline
    initCollectionTimeline();
    
    // Setup payment button
    setupPaymentButton();
});

// Initialize dashboard
function initDashboard() {
    // Format currency values
    const amountElements = document.querySelectorAll('.amount');
    amountElements.forEach(element => {
        const amount = element.textContent.replace(/[^0-9.,]/g, '');
        element.textContent = formatCurrency(amount);
    });
    
    // Format date values
    const dateElements = document.querySelectorAll('.payment-table tbody td:first-child');
    dateElements.forEach(element => {
        element.textContent = formatDate(element.textContent);
    });
    
    // Initialize debt progress bar
    updateDebtProgressBar();
    
    // Simulate real-time data updates (in a real app, this would be via API)
    setupDemoDataUpdates();
}

// Update debt progress bar based on current and total amounts
function updateDebtProgressBar() {
    const progressBar = document.querySelector('.progress');
    if (!progressBar) return;
    
    // In a real application, these values would come from an API
    const currentDebt = 2450;
    const totalDebt = 7000;
    
    // Calculate percentage
    const percentage = (currentDebt / totalDebt) * 100;
    
    // Update progress bar width
    progressBar.style.width = percentage + '%';
    
    // Update color based on percentage
    if (percentage < 33) {
        progressBar.style.backgroundColor = 'var(--secondary)';
    } else if (percentage < 66) {
        progressBar.style.backgroundColor = 'var(--warning)';
    } else {
        progressBar.style.backgroundColor = 'var(--danger)';
    }
}

// Setup personal info edit functionality
function setupPersonalInfoEdit() {
    const editButton = document.querySelector('.personal-info .btn-edit');
    if (!editButton) return;
    
    editButton.addEventListener('click', function() {
        // In a real application, this would show a modal or redirect to the edit page
        window.location.href = 'nustatymai.html';
    });
}

// Initialize notifications filtering
function initNotificationsFilter() {
    const filterSelect = document.querySelector('.filter-search select');
    const searchInput = document.querySelector('.filter-search input[type="text"]');
    const notifications = document.querySelectorAll('.notification');
    
    if (!filterSelect || !searchInput || !notifications.length) return;
    
    // Filter change handler
    filterSelect.addEventListener('change', function() {
        filterNotifications();
    });
    
    // Search input handler
    searchInput.addEventListener('input', function() {
        filterNotifications();
    });
    
    // Function to filter notifications based on select and search input
    function filterNotifications() {
        const filterValue = filterSelect.value;
        const searchText = searchInput.value.toLowerCase();
        
        notifications.forEach(notification => {
            // Reset visibility
            let isVisible = true;
            
            // Filter by type
            if (filterValue === 'unread' && !notification.classList.contains('unread')) {
                isVisible = false;
            } else if (filterValue === 'important' && !notification.classList.contains('important')) {
                isVisible = false;
            }
            
            // Filter by search text
            if (searchText) {
                const notificationContent = notification.querySelector('.notification-content').textContent.toLowerCase();
                if (!notificationContent.includes(searchText)) {
                    isVisible = false;
                }
            }
            
            // Apply visibility
            notification.style.display = isVisible ? 'flex' : 'none';
        });
    }
}

// Initialize collection timeline
function initCollectionTimeline() {
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const timelineProgress = document.querySelector('.timeline-progress');
    
    if (!timelineSteps.length || !timelineProgress) return;
    
    // Find the current step
    let currentStepIndex = -1;
    timelineSteps.forEach((step, index) => {
        if (step.classList.contains('current')) {
            currentStepIndex = index;
        }
    });
    
    // If no current step is found, default to the first step
    if (currentStepIndex === -1) {
        currentStepIndex = 0;
        timelineSteps[0].classList.add('current');
    }
    
    // Mark all previous steps as completed if not already marked with a status
    for (let i = 0; i < currentStepIndex; i++) {
        if (!timelineSteps[i].classList.contains('warning') && 
            !timelineSteps[i].classList.contains('danger')) {
            timelineSteps[i].classList.add('completed');
        }
    }
    
    // Calculate progress percentage
    const progressPercentage = ((currentStepIndex) / (timelineSteps.length - 1)) * 100;
    timelineProgress.style.width = progressPercentage + '%';
    
    // Set progress color based on current step status
    const currentStep = timelineSteps[currentStepIndex];
    if (currentStep.classList.contains('warning')) {
        timelineProgress.style.backgroundColor = 'var(--warning)';
    } else if (currentStep.classList.contains('danger')) {
        timelineProgress.style.backgroundColor = 'var(--danger)';
    } else {
        timelineProgress.style.backgroundColor = 'var(--primary)';
    }
    
    // Add touch/click support for mobile devices
    let activeStep = null;
    
    timelineSteps.forEach(step => {
        step.addEventListener('click', function(e) {
            // If this step is already active, deactivate it
            if (step.classList.contains('hover-active')) {
                step.classList.remove('hover-active');
                activeStep = null;
            } else {
                // Deactivate any active step
                if (activeStep) {
                    activeStep.classList.remove('hover-active');
                }
                
                // Activate this step
                step.classList.add('hover-active');
                activeStep = step;
                
                // If there's a tooltip payment button, stop propagation to allow clicks on it
                const tooltipPaymentBtn = step.querySelector('.tooltip-payment-btn');
                if (tooltipPaymentBtn) {
                    tooltipPaymentBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const debtAmount = document.querySelector('.debt-amount .amount').textContent;
                        showPaymentModal(debtAmount);
                    });
                }
            }
        });
        
        // Add hover effect for timeline steps
        step.addEventListener('mouseenter', function() {
            const stepDetails = document.createElement('div');
            stepDetails.classList.add('step-details');
            
            // Get the step info based on the type of step
            const stepIcon = step.querySelector('.step-icon i').className;
            const stepName = step.querySelector('.step-name').textContent;
            const stepDate = step.querySelector('.step-date').textContent;
            
            // Get status class
            let statusClass = '';
            let statusText = '';
            if (step.classList.contains('completed')) {
                statusClass = 'success';
                statusText = 'Užbaigtas';
            } else if (step.classList.contains('warning')) {
                statusClass = 'warning';
                statusText = 'Reikalingas dėmesys';
            } else if (step.classList.contains('danger')) {
                statusClass = 'danger';
                statusText = 'Kritinis';
            } else {
                statusClass = 'info';
                statusText = 'Laukiama';
            }
            
            // Is this step the current one?
            const isCurrent = step.classList.contains('current');
            
            // Create content based on step type
            let stepContent = '';
            let actionText = '';
            if (stepIcon.includes('envelope')) {
                stepContent = 'Įspėjimas apie skolą siųstas paštu ir el. paštu.';
                actionText = isCurrent ? 'Reikalingas skubus mokėjimas' : 'Peržiūrėti detales';
            } else if (stepIcon.includes('file-contract')) {
                stepContent = 'Surenkama visa reikalinga dokumentacija teisiniam skolos išieškojimui.';
                actionText = 'Peržiūrėti dokumentus';
            } else if (stepIcon.includes('gavel')) {
                stepContent = 'Pradėtas teisminis procesas dėl skolos priteisimo.';
                actionText = 'Teismo detalės';
            } else if (stepIcon.includes('balance-scale')) {
                stepContent = 'Po teismo sprendimo išduotas vykdomasis raštas dėl skolos išieškojimo.';
                actionText = 'Vykdymo informacija';
            }
            
            // Always show payment button on all steps
            let paymentButton = `
                <button class="btn-primary btn-sm tooltip-payment-btn">
                    <i class="fas fa-credit-card"></i> Apmokėti skolą
                </button>
            `;
            
            stepDetails.innerHTML = `
                <div class="step-details-header">
                    <span>${stepName}</span>
                    <span class="status ${statusClass}">${statusText}</span>
                </div>
                <div class="step-details-date">${stepDate}</div>
                <div class="step-details-content">${stepContent}</div>
                <div class="step-details-actions">
                    <a href="#" class="step-action-link">${actionText}</a>
                    ${paymentButton}
                </div>
            `;
            
            // Append tooltip and position it
            step.appendChild(stepDetails);
            
            // Add click event to payment button in tooltip if it exists
            const tooltipPaymentBtn = stepDetails.querySelector('.tooltip-payment-btn');
            if (tooltipPaymentBtn) {
                tooltipPaymentBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const debtAmount = document.querySelector('.debt-amount .amount').textContent;
                    showPaymentModal(debtAmount);
                });
            }
        });
        
        step.addEventListener('mouseleave', function() {
            const stepDetails = step.querySelector('.step-details');
            if (stepDetails) {
                stepDetails.remove();
            }
        });
    });
    
    // Make timeline steps clickable for additional information and payment
    timelineSteps.forEach(step => {
        step.addEventListener('click', function(e) {
            // Always open payment modal on click for any step
            const debtAmount = document.querySelector('.debt-amount .amount').textContent;
            showPaymentModal(debtAmount);
        });
    });
}

// Setup payment button
function setupPaymentButton() {
    const paymentBtn = document.querySelector('.payment-btn');
    if (!paymentBtn) return;
    
    paymentBtn.addEventListener('click', function() {
        // Get debt amount from the page
        const debtAmount = document.querySelector('.debt-amount .amount').textContent;
        
        // Show payment modal (in a real app, this would open a proper payment form)
        showPaymentModal(debtAmount);
    });
}

// Show payment modal
function showPaymentModal(amount) {
    // Create modal container
    const modal = document.createElement('div');
    modal.classList.add('modal');
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Skolos apmokėjimas</h3>
                <button class="close-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="payment-details">
                    <div class="payment-amount">
                        <span class="label">Mokėtina suma:</span>
                        <span class="value">${amount}</span>
                    </div>
                    <div class="payment-options">
                        <div class="option-label">Pasirinkite mokėjimo būdą:</div>
                        <div class="options-container">
                            <div class="payment-option selected">
                                <i class="fas fa-credit-card"></i>
                                <span>Banko kortelė</span>
                            </div>
                            <div class="payment-option">
                                <i class="fas fa-university"></i>
                                <span>Banko pavedimas</span>
                            </div>
                            <div class="payment-option">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>Elektroninė bankininkystė</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="payment-actions">
                    <button class="btn-secondary cancel-payment">Atšaukti</button>
                    <button class="btn-primary confirm-payment">Apmokėti</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the document
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup close button
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        closePaymentModal(modal);
    });
    
    // Setup cancel button
    const cancelBtn = modal.querySelector('.cancel-payment');
    cancelBtn.addEventListener('click', () => {
        closePaymentModal(modal);
    });
    
    // Setup confirm button
    const confirmBtn = modal.querySelector('.confirm-payment');
    confirmBtn.addEventListener('click', () => {
        // In a real app, this would process the payment
        alert('Mokėjimas pradėtas! Jūs būsite nukreipti į mokėjimo procesą.');
        closePaymentModal(modal);
    });
    
    // Setup payment options
    const paymentOptions = modal.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            option.classList.add('selected');
        });
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePaymentModal(modal);
        }
    });
}

// Close payment modal
function closePaymentModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Demo: simulate real-time data updates (for demonstration purposes only)
function setupDemoDataUpdates() {
    // This function would normally connect to a WebSocket or use polling to get updates
    
    // Demo: simulate a new notification after 10 seconds
    setTimeout(() => {
        const notificationsCard = document.querySelector('.notifications');
        if (!notificationsCard) return;
        
        const newNotification = {
            icon: 'fa-bell',
            title: 'Naujas pranešimas',
            time: 'Ką tik',
            text: 'Sistema atnaujinta sėkmingai. Naujų funkcijų aprašymą rasite pagalbos skiltyje.',
            unread: true,
            important: false
        };
        
        addNotification(notificationsCard, newNotification);
    }, 10000);
} 