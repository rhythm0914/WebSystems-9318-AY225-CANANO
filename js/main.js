// Main JavaScript File - Core Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all core functionalities
    initMobileMenu();
    initThemeToggle();
    initModals();
    initFAQAccordion();
    initServiceTabs();
    initFilters();
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navbar = document.getElementById('navbar');
    
    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', function() {
            navbar.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbar.contains(event.target) && !menuToggle.contains(event.target)) {
                navbar.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    }
}

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Check for saved theme preference or use preferred color scheme
        const savedTheme = localStorage.getItem('bacoor-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('bacoor-theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('bacoor-theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }
}

// Initialize theme from storage
function initTheme() {
    const savedTheme = localStorage.getItem('bacoor-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
}

// Modal Management
function initModals() {
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const modals = document.querySelectorAll('.modal');
    
    // Close modal when clicking close button
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modals.forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

// FAQ Accordion
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
            
            // Close other FAQs
            if (faqItem.classList.contains('active')) {
                document.querySelectorAll('.faq-item').forEach(item => {
                    if (item !== faqItem && item.classList.contains('active')) {
                        item.classList.remove('active');
                    }
                });
            }
        });
    });
}

// Service Tabs
function initServiceTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show active tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Filter Buttons
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn, .filter-option');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterBtnsContainer = this.parentElement;
            filterBtnsContainer.querySelectorAll('.active').forEach(activeBtn => {
                activeBtn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// Open Service Form
function openServiceForm(serviceName) {
    const formSection = document.getElementById('serviceFormSection');
    const formTitle = document.getElementById('formTitle');
    const serviceType = document.getElementById('serviceType');
    
    if (formSection && formTitle && serviceType) {
        formTitle.textContent = serviceName + ' Request Form';
        
        // Set service type based on service name
        let typeValue = '';
        if (serviceName.includes('Business')) typeValue = 'business_permit';
        if (serviceName.includes('Tax')) typeValue = 'tax_payment';
        if (serviceName.includes('Vaccination') || serviceName.includes('Medical') || serviceName.includes('Health')) 
            typeValue = 'health_service';
        
        if (typeValue) {
            serviceType.value = typeValue;
        }
        
        formSection.style.display = 'block';
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close Service Form
function closeServiceForm() {
    const formSection = document.getElementById('serviceFormSection');
    if (formSection) {
        formSection.style.display = 'none';
    }
}

// Open Announcement Modal
function openAnnouncementModal(announcementId) {
    // This would be populated with actual announcement data
    // For now, showing a sample modal
    const modal = document.getElementById('announcementModal');
    const content = document.getElementById('announcementModalContent');
    
    if (modal && content) {
        content.innerHTML = `
            <h2>Announcement Details</h2>
            <div class="ann-meta">
                <span class="ann-category news">News</span>
                <span><i class="far fa-calendar"></i> 2024-01-15</span>
            </div>
            <h3>Citywide Clean-up Drive</h3>
            <p>The City Government of Bacoor will conduct a citywide clean-up drive on January 20, 2024, from 6:00 AM to 10:00 AM. All residents are encouraged to participate.</p>
            <p><strong>Meeting Points:</strong> Each barangay hall</p>
            <p><strong>What to bring:</strong> Gloves, rakes, garbage bags</p>
            <p>For more information, please contact your barangay officials or the City Environment and Natural Resources Office.</p>
        `;
        modal.classList.add('active');
    }
}

// Close Announcement Modal
function closeAnnouncementModal() {
    const modal = document.getElementById('announcementModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Show Success Modal
function showSuccessModal(message, referenceId) {
    const modal = document.getElementById('successModal');
    const refSpan = document.getElementById('referenceId');
    
    if (modal && refSpan) {
        refSpan.textContent = referenceId;
        modal.classList.add('active');
    }
}

// Close Success Modal
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close Contact Success Modal
function closeContactSuccessModal() {
    const modal = document.getElementById('contactSuccessModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Format Phone Number
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

// Debounce function for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth Scroll to Element
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Validate Email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate Phone
function isValidPhone(phone) {
    const re = /^[\d\s\-\+\(\)]{10,}$/;
    return re.test(phone);
}

// Generate Reference ID
function generateReferenceId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BAC-${timestamp}-${random}`;
}