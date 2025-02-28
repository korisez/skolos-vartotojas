// JavaScript for the debt management page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    initPage();
    
    // Initialize tabs
    initTabs();
    
    // Initialize debt history filtering
    initDebtHistoryFilters();
    
    // Initialize payment options
    initPaymentOptions();
});

// Initialize page
function initPage() {
    // Format currency values
    const amountElements = document.querySelectorAll('.amount');
    amountElements.forEach(element => {
        const amount = element.textContent.replace(/[^0-9.,]/g, '');
        element.textContent = formatCurrency(amount);
    });
    
    // Format date values
    const dateElements = document.querySelectorAll('.data-table tbody td:first-child, .schedule-table tbody td:first-child, .schedule-info .value:first-child');
    dateElements.forEach(element => {
        if (element.textContent.match(/^\d{4}-\d{2}-\d{2}$/)) {
            element.textContent = formatDate(element.textContent);
        }
    });
}

// Initialize tabs functionality
function initTabs() {
    const tabNavItems = document.querySelectorAll('.tab-nav li');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (!tabNavItems.length || !tabPanes.length) return;
    
    tabNavItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all tab nav items
            tabNavItems.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab nav item
            this.classList.add('active');
            
            // Get tab ID
            const tabId = this.getAttribute('data-tab');
            
            // Hide all tab panes
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Show the corresponding tab pane
            const activePane = document.getElementById(tabId);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });
}

// Initialize debt history filtering
function initDebtHistoryFilters() {
    const searchInput = document.querySelector('.search-box input');
    const dateFilter = document.querySelector('.date-filter');
    const statusFilter = document.querySelector('.status-filter');
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    
    if (!searchInput || !dateFilter || !statusFilter || !tableRows.length) return;
    
    // Search input handler
    searchInput.addEventListener('input', filterTable);
    
    // Date filter handler
    dateFilter.addEventListener('change', filterTable);
    
    // Status filter handler
    statusFilter.addEventListener('change', filterTable);
    
    function filterTable() {
        const searchText = searchInput.value.toLowerCase();
        const dateValue = dateFilter.value;
        const statusValue = statusFilter.value;
        
        tableRows.forEach(row => {
            let isVisible = true;
            
            // Filter by search text
            if (searchText) {
                const rowText = row.textContent.toLowerCase();
                if (!rowText.includes(searchText)) {
                    isVisible = false;
                }
            }
            
            // Filter by date
            if (isVisible && dateValue !== 'all') {
                const dateCell = row.cells[0].textContent;
                const rowDate = new Date(dateCell.split('.').reverse().join('-'));
                const now = new Date();
                
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const startOf3MonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                const startOf6MonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                
                switch (dateValue) {
                    case 'this-month':
                        if (rowDate < startOfMonth) isVisible = false;
                        break;
                    case 'last-month':
                        if (rowDate < startOfLastMonth || rowDate >= startOfMonth) isVisible = false;
                        break;
                    case 'last-3-months':
                        if (rowDate < startOf3MonthsAgo) isVisible = false;
                        break;
                    case 'last-6-months':
                        if (rowDate < startOf6MonthsAgo) isVisible = false;
                        break;
                    case 'this-year':
                        if (rowDate < startOfYear) isVisible = false;
                        break;
                }
            }
            
            // Filter by status
            if (isVisible && statusValue !== 'all') {
                const statusCell = row.cells[3].textContent.toLowerCase();
                if (statusValue === 'paid' && !statusCell.includes('apmokėta')) {
                    isVisible = false;
                } else if (statusValue === 'pending' && !statusCell.includes('laukiama')) {
                    isVisible = false;
                } else if (statusValue === 'late' && !statusCell.includes('vėluoja')) {
                    isVisible = false;
                }
            }
            
            // Apply visibility
            row.style.display = isVisible ? '' : 'none';
        });
    }
}

// Initialize payment options
function initPaymentOptions() {
    const amountOptions = document.querySelectorAll('.amount-option');
    const customAmountContainer = document.querySelector('.custom-amount');
    const customAmountInput = document.getElementById('custom-amount-input');
    const paymentMethodButtons = document.querySelectorAll('.payment-method-card .btn');
    
    if (!amountOptions.length) return;
    
    // Amount option selection
    amountOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            amountOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Handle custom amount
            const amount = this.getAttribute('data-amount');
            if (amount === 'custom') {
                customAmountContainer.classList.add('active');
                if (customAmountInput) {
                    customAmountInput.focus();
                }
            } else {
                customAmountContainer.classList.remove('active');
            }
        });
    });
    
    // Payment method selection
    if (paymentMethodButtons.length) {
        paymentMethodButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get selected amount
                let selectedAmount = 0;
                const activeAmountOption = document.querySelector('.amount-option.active');
                
                if (activeAmountOption) {
                    const amount = activeAmountOption.getAttribute('data-amount');
                    if (amount === 'custom') {
                        if (customAmountInput && customAmountInput.value.trim() !== '') {
                            selectedAmount = parseFloat(customAmountInput.value.trim());
                        } else {
                            alert('Prašome įvesti mokėjimo sumą.');
                            return;
                        }
                    } else {
                        selectedAmount = parseInt(amount);
                    }
                } else {
                    // Default to first amount if none selected
                    const firstOption = document.querySelector('.amount-option:not(.custom)');
                    if (firstOption) {
                        const amount = firstOption.getAttribute('data-amount');
                        selectedAmount = parseInt(amount);
                        firstOption.classList.add('active');
                    }
                }
                
                // Get payment method
                const paymentMethod = this.closest('.payment-method-card').querySelector('h5').textContent;
                
                // In a real application, this would redirect to a payment processor
                // For demo purposes, we'll just show an alert
                alert(`Jūs pasirinkote mokėti ${formatCurrency(selectedAmount)} naudojant ${paymentMethod}. Nukreipiame į mokėjimo puslapį...`);
            });
        });
    }
    
    // Pay now buttons in payment schedules
    const payNowButtons = document.querySelectorAll('.pay-now');
    if (payNowButtons.length) {
        payNowButtons.forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const amount = row.querySelector('.amount').textContent;
                const date = row.querySelector('td:first-child').textContent;
                
                // Show payment options tab
                const paymentOptionsTab = document.querySelector('[data-tab="payment-options"]');
                if (paymentOptionsTab) {
                    paymentOptionsTab.click();
                    
                    // Select corresponding amount option
                    const amountValue = parseFloat(amount.replace(/[^0-9.,]/g, '').replace(',', '.'));
                    const matchingOption = document.querySelector(`.amount-option[data-amount="${amountValue}"]`);
                    
                    if (matchingOption) {
                        amountOptions.forEach(opt => opt.classList.remove('active'));
                        matchingOption.classList.add('active');
                    } else {
                        // Use custom amount
                        const customOption = document.querySelector('.amount-option.custom');
                        if (customOption) {
                            amountOptions.forEach(opt => opt.classList.remove('active'));
                            customOption.classList.add('active');
                            customAmountContainer.classList.add('active');
                            if (customAmountInput) {
                                customAmountInput.value = amountValue;
                            }
                        }
                    }
                }
            });
        });
    }
    
    // View all payments in schedule
    const viewAllButton = document.querySelector('.view-all');
    if (viewAllButton) {
        viewAllButton.addEventListener('click', function() {
            // In a real application, this would show all payments
            // For demo, we'll show a message
            alert('Čia būtų rodomi visi mokėjimo grafiko mokėjimai.');
        });
    }
}

// Payment history button
document.addEventListener('DOMContentLoaded', function() {
    const paymentHistoryButton = document.querySelector('.payment-history .btn');
    if (paymentHistoryButton) {
        paymentHistoryButton.addEventListener('click', function() {
            // In a real application, this would show payment history
            // For demo, we'll switch to the debt history tab
            const debtHistoryTab = document.querySelector('[data-tab="debt-history"]');
            if (debtHistoryTab) {
                debtHistoryTab.click();
            }
        });
    }
}); 