// JavaScript for the Documents page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    initTabs();
    
    // Initialize document filtering
    initDocumentFilters();
    
    // Initialize document actions
    initDocumentActions();
    
    // Initialize file upload
    initFileUpload();
    
    // Initialize pagination
    initPagination();
});

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

// Initialize document filtering
function initDocumentFilters() {
    const searchInput = document.querySelector('.search-box input');
    const dateFilter = document.querySelector('.date-filter');
    const docTypeFilter = document.querySelector('.doc-type-filter');
    const documentCards = document.querySelectorAll('.document-card');
    
    if (!searchInput || !dateFilter || !docTypeFilter || !documentCards.length) return;
    
    // Search input handler
    searchInput.addEventListener('input', filterDocuments);
    
    // Date filter handler
    dateFilter.addEventListener('change', filterDocuments);
    
    // Document type filter handler
    docTypeFilter.addEventListener('change', filterDocuments);
    
    function filterDocuments() {
        const searchText = searchInput.value.toLowerCase();
        const dateValue = dateFilter.value;
        const docTypeValue = docTypeFilter.value;
        
        documentCards.forEach(card => {
            let isVisible = true;
            
            // Filter by search text
            if (searchText) {
                const cardText = card.textContent.toLowerCase();
                if (!cardText.includes(searchText)) {
                    isVisible = false;
                }
            }
            
            // Filter by date
            if (isVisible && dateValue !== 'all') {
                const dateText = card.querySelector('.doc-date').textContent;
                const cardDate = new Date(dateText);
                const now = new Date();
                
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const startOf3MonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                const startOf6MonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                
                switch (dateValue) {
                    case 'this-month':
                        if (cardDate < startOfMonth) isVisible = false;
                        break;
                    case 'last-month':
                        if (cardDate < startOfLastMonth || cardDate >= startOfMonth) isVisible = false;
                        break;
                    case 'last-3-months':
                        if (cardDate < startOf3MonthsAgo) isVisible = false;
                        break;
                    case 'last-6-months':
                        if (cardDate < startOf6MonthsAgo) isVisible = false;
                        break;
                    case 'this-year':
                        if (cardDate < startOfYear) isVisible = false;
                        break;
                }
            }
            
            // Filter by document type
            if (isVisible && docTypeValue !== 'all') {
                const iconElement = card.querySelector('.document-icon i');
                const iconClass = iconElement ? iconElement.className : '';
                
                switch (docTypeValue) {
                    case 'contract':
                        if (!iconClass.includes('fa-file-contract')) isVisible = false;
                        break;
                    case 'invoice':
                        if (!iconClass.includes('fa-file-invoice')) isVisible = false;
                        break;
                    case 'receipt':
                        if (!iconClass.includes('fa-file-invoice-dollar')) isVisible = false;
                        break;
                    case 'notice':
                        if (!iconClass.includes('fa-envelope') && !iconClass.includes('fa-bell')) isVisible = false;
                        break;
                    case 'other':
                        if (iconClass.includes('fa-file-contract') || 
                            iconClass.includes('fa-file-invoice') || 
                            iconClass.includes('fa-file-invoice-dollar') || 
                            iconClass.includes('fa-envelope') || 
                            iconClass.includes('fa-bell')) {
                            isVisible = false;
                        }
                        break;
                }
            }
            
            // Apply visibility
            card.style.display = isVisible ? '' : 'none';
        });
        
        // Update pagination after filtering
        updatePagination();
    }
}

// Initialize document actions
function initDocumentActions() {
    const viewButtons = document.querySelectorAll('.btn-view');
    const downloadButtons = document.querySelectorAll('.btn-download');
    const modal = document.getElementById('document-preview-modal');
    const modalClose = document.querySelectorAll('.modal-close');
    
    if (!viewButtons.length) return;
    
    // View document button handler
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const docCard = this.closest('.document-card');
            const docTitle = docCard.querySelector('h4').textContent;
            const docNumber = docCard.querySelector('.doc-number').textContent;
            
            // Update modal title
            if (modal) {
                const modalTitle = modal.querySelector('.modal-header h3');
                if (modalTitle) {
                    modalTitle.textContent = docTitle;
                }
                
                // Show modal
                modal.style.display = 'flex';
                
                // Prevent scrolling on body
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Download document button handler
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const docCard = this.closest('.document-card');
            const docTitle = docCard.querySelector('h4').textContent;
            const docNumber = docCard.querySelector('.doc-number').textContent;
            
            // In a real application, this would trigger a download
            // For demo purposes, we'll just show an alert
            alert(`Atsisiunčiamas dokumentas: ${docTitle} (${docNumber})`);
        });
    });
    
    // Modal close button handler
    if (modalClose.length && modal) {
        modalClose.forEach(button => {
            button.addEventListener('click', function() {
                modal.style.display = 'none';
                
                // Restore scrolling on body
                document.body.style.overflow = '';
            });
        });
        
        // Close modal when clicking outside content
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                
                // Restore scrolling on body
                document.body.style.overflow = '';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
                
                // Restore scrolling on body
                document.body.style.overflow = '';
            }
        });
    }
}

// Initialize file upload
function initFileUpload() {
    const fileInput = document.getElementById('file-upload');
    const uploadZone = document.querySelector('.upload-zone');
    const selectedFile = document.querySelector('.selected-file');
    const fileName = document.querySelector('.file-name');
    const fileSize = document.querySelector('.file-size');
    const removeButton = document.querySelector('.btn-remove');
    const uploadForm = document.querySelector('.upload-form');
    
    if (!fileInput || !uploadZone) return;
    
    // Handle file selection
    fileInput.addEventListener('change', function() {
        handleFileSelection(this.files);
    });
    
    // Handle drag and drop
    uploadZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('upload-zone-active');
    });
    
    uploadZone.addEventListener('dragleave', function() {
        this.classList.remove('upload-zone-active');
    });
    
    uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('upload-zone-active');
        
        // Handle the dropped files
        handleFileSelection(e.dataTransfer.files);
    });
    
    // Remove file button handler
    if (removeButton) {
        removeButton.addEventListener('click', function() {
            fileInput.value = '';
            if (selectedFile) {
                selectedFile.style.display = 'none';
            }
        });
    }
    
    // Form submission handler
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const titleInput = document.getElementById('doc-title');
            const typeSelect = document.getElementById('doc-type');
            const dateInput = document.getElementById('doc-date');
            
            // Validate form
            if (!titleInput.value.trim()) {
                alert('Prašome įvesti dokumento pavadinimą.');
                titleInput.focus();
                return;
            }
            
            if (!typeSelect.value) {
                alert('Prašome pasirinkti dokumento tipą.');
                typeSelect.focus();
                return;
            }
            
            if (!dateInput.value) {
                alert('Prašome įvesti dokumento datą.');
                dateInput.focus();
                return;
            }
            
            if (!fileInput.files.length) {
                alert('Prašome pasirinkti failą.');
                return;
            }
            
            // In a real application, this would upload the file to a server
            // For demo purposes, we'll just show a success message
            alert('Dokumentas sėkmingai įkeltas!');
            
            // Reset form
            uploadForm.reset();
            if (selectedFile) {
                selectedFile.style.display = 'none';
            }
            
            // Redirect to the All Documents tab
            const allDocumentsTab = document.querySelector('[data-tab="all-documents"]');
            if (allDocumentsTab) {
                allDocumentsTab.click();
            }
        });
    }
    
    function handleFileSelection(files) {
        if (files && files.length > 0) {
            const file = files[0];
            
            // Display file info
            if (fileName && fileSize && selectedFile) {
                fileName.textContent = file.name;
                fileSize.textContent = `(${formatFileSize(file.size)})`;
                selectedFile.style.display = 'flex';
            }
            
            // Set title input to file name without extension if empty
            const titleInput = document.getElementById('doc-title');
            if (titleInput && !titleInput.value.trim()) {
                const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
                titleInput.value = nameWithoutExt;
            }
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
}

// Initialize pagination
function initPagination() {
    const paginationButtons = document.querySelectorAll('.pagination .page-link:not(.disabled)');
    
    if (!paginationButtons.length) return;
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Skip if already active or disabled
            if (this.classList.contains('active') || this.classList.contains('disabled')) {
                return;
            }
            
            // Remove active class from all buttons
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real application, this would load the next page of documents
            // For demo purposes, we'll just show a message
            const pageNumber = this.textContent;
            
            if (pageNumber.includes('←') || pageNumber.includes('→')) {
                // Handle next/previous page
                const activePage = document.querySelector('.pagination .page-link.active');
                if (activePage) {
                    alert(`Navigating to ${pageNumber.includes('←') ? 'previous' : 'next'} page.`);
                }
            } else {
                alert(`Navigating to page ${pageNumber}.`);
            }
        });
    });
}

// Update pagination based on filtered results
function updatePagination() {
    const documentCards = document.querySelectorAll('.document-card');
    const pagination = document.querySelector('.pagination');
    
    if (!pagination) return;
    
    const visibleCards = Array.from(documentCards).filter(card => card.style.display !== 'none');
    
    // Hide pagination if no visible cards
    pagination.style.display = visibleCards.length > 0 ? 'flex' : 'none';
} 