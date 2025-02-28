// JavaScript for the index/dashboard page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initDashboard();
    
    // Setup edit button for personal info
    setupPersonalInfoEdit();
    
    // Initialize notifications filtering
    initNotificationsFilter();
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