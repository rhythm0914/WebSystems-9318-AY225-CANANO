// Form Validation and Handling

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        this.errors = {};
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        // Get all form fields
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            const name = input.name || input.id;
            if (name) {
                this.fields[name] = input;
            }
        });
        
        // Add event listeners
        this.form.addEventListener('submit', (e) => this.validateForm(e));
        
        // Add real-time validation
        Object.values(this.fields).forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
        
        // Load draft if exists
        this.loadDraft();
    }
    
    validateField(field) {
        const name = field.name || field.id;
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        
        // Check required
        if (field.required && !value) {
            isValid = false;
            message = 'This field is required';
        }
        
        // Email validation
        else if (field.type === 'email' && value) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        else if (field.type === 'tel' && value) {
            if (!/^[\d\s\-\+\(\)]{10,}$/.test(value)) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
        }
        
        // Custom validation for specific fields
        else if (name === 'contactPhone' && value) {
            if (!/^09\d{9}$/.test(value.replace(/\D/g, ''))) {
                isValid = false;
                message = 'Please enter a valid Philippine mobile number (09XXXXXXXXX)';
            }
        }
        
        if (!isValid) {
            this.showError(field, message);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    validateForm(event) {
        if (event) event.preventDefault();
        
        let isValid = true;
        this.errors = {};
        
        // Validate all fields
        Object.entries(this.fields).forEach(([name, field]) => {
            if (!this.validateField(field)) {
                isValid = false;
                this.errors[name] = field.validationMessage || 'Invalid value';
            }
        });
        
        // Check terms agreement
        const agreeCheckbox = this.form.querySelector('input[type="checkbox"][required]');
        if (agreeCheckbox && !agreeCheckbox.checked) {
            isValid = false;
            this.showError(agreeCheckbox, 'You must agree to the terms and conditions');
        }
        
        if (isValid) {
            this.submitForm();
        } else {
            this.showFormError('Please correct the errors below');
        }
        
        return isValid;
    }
    
    showError(field, message) {
        const errorElement = document.getElementById(`${field.name || field.id}Error`) ||
                           field.nextElementSibling?.classList.contains('error-message') ? 
                           field.nextElementSibling : null;
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        field.classList.add('error');
        field.focus();
    }
    
    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name || field.id}Error`) ||
                           field.nextElementSibling?.classList.contains('error-message') ? 
                           field.nextElementSibling : null;
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        field.classList.remove('error');
    }
    
    showFormError(message) {
        // Create or update form error message
        let formError = this.form.querySelector('.form-error');
        if (!formError) {
            formError = document.createElement('div');
            formError.className = 'form-error alert alert-danger';
            this.form.prepend(formError);
        }
        formError.textContent = message;
        formError.style.display = 'block';
        
        // Scroll to error
        formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    getFormData() {
        const formData = {};
        Object.entries(this.fields).forEach(([name, field]) => {
            if (field.type === 'checkbox') {
                formData[name] = field.checked;
            } else if (field.type === 'file') {
                formData[name] = field.files;
            } else {
                formData[name] = field.value.trim();
            }
        });
        return formData;
    }
    
    submitForm() {
        const formData = this.getFormData();
        const formId = this.form.id;
        
        // Save to service requests if applicable
        if (formId === 'serviceRequestForm') {
            const requestId = saveServiceRequest(formData);
            if (requestId) {
                // Show success modal
                showSuccessModal('Service request submitted successfully!', requestId);
                this.clearForm();
                deleteFormDraft(formId);
            } else {
                this.showFormError('Failed to submit request. Please try again.');
            }
        }
        
        // Handle contact form
        else if (formId === 'feedbackForm') {
            const requestId = generateReferenceId();
            const modal = document.getElementById('contactSuccessModal');
            const refSpan = document.getElementById('contactReferenceId');
            
            if (modal && refSpan) {
                refSpan.textContent = requestId;
                modal.classList.add('active');
                this.clearForm();
                deleteFormDraft(formId);
            }
        }
    }
    
    clearForm() {
        this.form.reset();
        Object.values(this.fields).forEach(field => {
            this.clearFieldError(field);
        });
    }
    
    saveDraft() {
        const formData = this.getFormData();
        const formId = this.form.id;
        
        if (formId) {
            saveFormDraft(formId, formData);
            
            // Show save confirmation
            const saveBtn = this.form.querySelector('[onclick*="saveDraft"]');
            if (saveBtn) {
                const originalText = saveBtn.textContent;
                saveBtn.textContent = 'Draft Saved!';
                saveBtn.classList.add('btn-success');
                
                setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.classList.remove('btn-success');
                }, 2000);
            }
        }
    }
    
    loadDraft() {
        const formId = this.form.id;
        if (!formId) return;
        
        const draft = getFormDraft(formId);
        if (draft && draft.data) {
            // Load form data from draft
            Object.entries(draft.data).forEach(([name, value]) => {
                const field = this.fields[name];
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = value;
                    } else {
                        field.value = value;
                    }
                }
            });
            
            // Show draft loaded notification
            const notification = document.createElement('div');
            notification.className = 'draft-notification alert alert-info';
            notification.innerHTML = `
                <i class="fas fa-save"></i>
                Draft loaded from ${new Date(draft.savedAt).toLocaleDateString()}
                <button class="btn-clear-draft" onclick="clearDraft('${formId}')">Clear</button>
            `;
            this.form.prepend(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 5000);
        }
    }
}

// Global form instances
let serviceFormValidator;
let contactFormValidator;

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize service request form
    const serviceForm = document.getElementById('serviceRequestForm');
    if (serviceForm) {
        serviceFormValidator = new FormValidator('serviceRequestForm');
    }
    
    // Initialize contact form
    const contactForm = document.getElementById('feedbackForm');
    if (contactForm) {
        contactFormValidator = new FormValidator('feedbackForm');
    }
    
    // Add save draft functionality
    const saveDraftBtns = document.querySelectorAll('[onclick*="saveDraft"]');
    saveDraftBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (serviceFormValidator) {
                serviceFormValidator.saveDraft();
            }
        });
    });
});

// Clear draft function
function clearDraft(formId) {
    deleteFormDraft(formId);
    location.reload();
}

// Auto-save draft on form changes (with debounce)
function setupAutoSave(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const debouncedSave = debounce(function() {
        if (formId === 'serviceRequestForm' && serviceFormValidator) {
            serviceFormValidator.saveDraft();
        } else if (formId === 'feedbackForm' && contactFormValidator) {
            contactFormValidator.saveDraft();
        }
    }, 2000);
    
    form.addEventListener('input', debouncedSave);
    form.addEventListener('change', debouncedSave);
}

// Initialize auto-save for forms
document.addEventListener('DOMContentLoaded', function() {
    setupAutoSave('serviceRequestForm');
    setupAutoSave('feedbackForm');
});

// Form field character counters
function setupCharacterCounters() {
    const textareas = document.querySelectorAll('textarea[maxlength]');
    textareas.forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute('maxlength'));
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.fontSize = '0.9rem';
        counter.style.color = 'var(--gray-color)';
        counter.style.textAlign = 'right';
        counter.style.marginTop = '5px';
        
        textarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const currentLength = textarea.value.length;
            counter.textContent = `${currentLength}/${maxLength}`;
            
            if (currentLength > maxLength * 0.9) {
                counter.style.color = 'var(--warning-color)';
            } else {
                counter.style.color = 'var(--gray-color)';
            }
            
            if (currentLength > maxLength) {
                textarea.value = textarea.value.substring(0, maxLength);
                updateCounter();
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    });
}

// Initialize character counters
document.addEventListener('DOMContentLoaded', setupCharacterCounters);