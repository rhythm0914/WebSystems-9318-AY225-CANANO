// Services Management

const SERVICES_DATA = {
    business: [
        {
            id: 1,
            name: "New Business Registration",
            description: "Register new business establishments with the city government.",
            requirements: ["DTI/SEC Registration", "Barangay Clearance", "Valid IDs", "Lease Contract"],
            fees: "₱3,000 - ₱10,000 depending on business type",
            processingTime: "3-5 business days",
            form: "business_registration"
        },
        {
            id: 2,
            name: "Business Permit Renewal",
            description: "Renew existing business permits annually.",
            requirements: ["Previous Year's Permit", "Updated Financial Statements", "Clearance from BIR"],
            fees: "Based on gross receipts",
            processingTime: "2-3 business days",
            form: "business_renewal"
        },
        {
            id: 3,
            name: "Market Stall Application",
            description: "Apply for stall space in public markets.",
            requirements: ["Residency Proof", "Police Clearance", "Medical Certificate"],
            fees: "₱500 application fee + monthly rental",
            processingTime: "1-2 weeks",
            form: "market_stall"
        }
    ],
    health: [
        {
            id: 4,
            name: "Medical Certificate",
            description: "Official medical certificate for various purposes.",
            requirements: ["Valid ID", "Medical Check-up"],
            fees: "₱50 - ₱200 depending on type",
            processingTime: "Same day",
            form: "medical_certificate"
        },
        {
            id: 5,
            name: "Vaccination Appointment",
            description: "Schedule vaccination for COVID-19 and other vaccines.",
            requirements: ["Valid ID", "Medical History"],
            fees: "Free for residents",
            processingTime: "By appointment",
            form: "vaccination"
        },
        {
            id: 6,
            name: "Health Card Registration",
            description: "Register for city health card benefits.",
            requirements: ["Proof of Residency", "Birth Certificate", "2x2 Photo"],
            fees: "₱100 annual fee",
            processingTime: "1 business day",
            form: "health_card"
        }
    ],
    social: [
        {
            id: 7,
            name: "Senior Citizen ID",
            description: "Apply for Senior Citizen Identification Card.",
            requirements: ["Birth Certificate", "Valid ID", "1x1 Photo"],
            fees: "Free",
            processingTime: "1-2 business days",
            form: "senior_id"
        },
        {
            id: 8,
            name: "PWD Registration",
            description: "Register as Person With Disability for benefits.",
            requirements: ["Medical Certificate", "Valid ID", "2x2 Photo"],
            fees: "Free",
            processingTime: "1-2 business days",
            form: "pwd_registration"
        },
        {
            id: 9,
            name: "Educational Assistance",
            description: "Apply for city educational assistance program.",
            requirements: ["Report Card", "Certificate of Indigency", "Valid ID"],
            fees: "Free",
            processingTime: "2-3 weeks",
            form: "educational_assistance"
        }
    ],
    permits: [
        {
            id: 10,
            name: "Building Permit",
            description: "Permit for construction, renovation, or repair.",
            requirements: ["Land Title", "Building Plans", "Engineer's/Architect's License"],
            fees: "Based on construction cost",
            processingTime: "2-3 weeks",
            form: "building_permit"
        },
        {
            id: 11,
            name: "Zoning Clearance",
            description: "Clearance for land use and zoning compliance.",
            requirements: ["Land Title", "Tax Declaration", "Site Development Plan"],
            fees: "₱500 - ₱2,000",
            processingTime: "5-7 business days",
            form: "zoning_clearance"
        },
        {
            id: 12,
            name: "Occupancy Permit",
            description: "Permit to occupy newly constructed buildings.",
            requirements: ["Building Permit", "Certificate of Completion", "Fire Safety Certificate"],
            fees: "₱1,000 - ₱5,000",
            processingTime: "1-2 weeks",
            form: "occupancy_permit"
        }
    ],
    utilities: [
        {
            id: 13,
            name: "Real Property Tax Payment",
            description: "Pay real property taxes for land and buildings.",
            requirements: ["Tax Declaration Number", "Property Details"],
            fees: "Based on assessed value",
            processingTime: "Immediate",
            form: "property_tax"
        },
        {
            id: 14,
            name: "Business Tax Payment",
            description: "Pay business taxes and fees.",
            requirements: ["Business Permit Number", "Previous Payment Receipt"],
            fees: "Based on gross receipts",
            processingTime: "Immediate",
            form: "business_tax"
        },
        {
            id: 15,
            name: "Water Connection",
            description: "Apply for new water service connection.",
            requirements: ["Proof of Ownership", "Valid ID", "Barangay Clearance"],
            fees: "₱2,500 connection fee",
            processingTime: "1-2 weeks",
            form: "water_connection"
        }
    ]
};

class ServicesManager {
    constructor() {
        this.services = SERVICES_DATA;
        this.currentTab = 'business';
        this.init();
    }
    
    init() {
        this.renderServices();
        this.setupEventListeners();
        this.loadServiceHistory();
    }
    
    renderServices() {
        const services = this.services[this.currentTab] || [];
        const container = document.querySelector(`#${this.currentTab} .services-grid`);
        
        if (!container) return;
        
        container.innerHTML = services.map(service => this.createServiceCard(service)).join('');
    }
    
    createServiceCard(service) {
        return `
            <div class="service-card">
                <i class="${this.getServiceIcon(service.name)}"></i>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="service-details">
                    <p><strong>Processing Time:</strong> ${service.processingTime}</p>
                    <p><strong>Fees:</strong> ${service.fees}</p>
                </div>
                <button class="btn-service" onclick="servicesManager.openServiceDetails(${service.id})">
                    Apply Now
                </button>
                <button class="btn-service-outline" onclick="servicesManager.viewRequirements(${service.id})">
                    View Requirements
                </button>
            </div>
        `;
    }
    
    openServiceDetails(serviceId) {
        const service = this.findServiceById(serviceId);
        if (!service) return;
        
        // Open the service form with this service
        openServiceForm(service.name);
        
        // Set the service type in the form
        const serviceType = document.getElementById('serviceType');
        if (serviceType) {
            serviceType.value = service.form;
        }
    }
    
    viewRequirements(serviceId) {
        const service = this.findServiceById(serviceId);
        if (!service) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>${service.name} - Requirements</h2>
                <div class="requirements-list">
                    <h3>Required Documents:</h3>
                    <ul>
                        ${service.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                    <h3>Processing Information:</h3>
                    <p><strong>Processing Time:</strong> ${service.processingTime}</p>
                    <p><strong>Fees:</strong> ${service.fees}</p>
                    <p><strong>Where to Apply:</strong> ${this.getDepartmentForService(service.name)}</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="servicesManager.openServiceDetails(${serviceId}); this.parentElement.parentElement.parentElement.remove()">
                        Proceed to Application
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    findServiceById(id) {
        for (const category in this.services) {
            const service = this.services[category].find(s => s.id === id);
            if (service) return service;
        }
        return null;
    }
    
    getServiceIcon(serviceName) {
        const icons = {
            'Business': 'fas fa-briefcase',
            'Health': 'fas fa-heartbeat',
            'Medical': 'fas fa-file-medical',
            'Vaccination': 'fas fa-syringe',
            'Permit': 'fas fa-file-certificate',
            'Tax': 'fas fa-money-check-alt',
            'Social': 'fas fa-hands-helping',
            'Senior': 'fas fa-user-friends',
            'Educational': 'fas fa-graduation-cap',
            'Building': 'fas fa-hard-hat',
            'Water': 'fas fa-tint'
        };
        
        for (const [key, icon] of Object.entries(icons)) {
            if (serviceName.includes(key)) {
                return icon;
            }
        }
        
        return 'fas fa-concierge-bell';
    }
    
    getDepartmentForService(serviceName) {
        if (serviceName.includes('Business')) return "Business Permits & Licensing Office";
        if (serviceName.includes('Health') || serviceName.includes('Medical')) return "City Health Office";
        if (serviceName.includes('Tax')) return "City Treasurer's Office";
        if (serviceName.includes('Permit')) return "City Engineering Office";
        if (serviceName.includes('Social') || serviceName.includes('Senior') || serviceName.includes('Educational')) 
            return "Social Welfare & Development Office";
        if (serviceName.includes('Building')) return "City Engineering Office";
        if (serviceName.includes('Water')) return "City Utilities Office";
        
        return "City Mayor's Office";
    }
    
    switchTab(tabId) {
        this.currentTab = tabId;
        this.renderServices();
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            }
        });
    }
    
    loadServiceHistory() {
        const serviceRequests = getServiceRequests();
        if (serviceRequests.length > 0) {
            this.displayServiceHistory(serviceRequests);
        }
    }
    
    displayServiceHistory(requests) {
        const historyContainer = document.getElementById('serviceHistory');
        if (!historyContainer) return;
        
        const recentRequests = requests.slice(0, 5); // Show only 5 most recent
        
        historyContainer.innerHTML = `
            <h3>Recent Service Requests</h3>
            <div class="history-list">
                ${recentRequests.map(request => `
                    <div class="history-item">
                        <div class="history-service">${request.serviceType || 'Service Request'}</div>
                        <div class="history-date">${new Date(request.submittedAt).toLocaleDateString()}</div>
                        <div class="history-status ${request.status}">${request.status}</div>
                        <div class="history-ref">${request.id}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    searchServices(query) {
        // This would implement search across all services
        console.log('Searching services for:', query);
        // Implementation would filter and display matching services
    }
    
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
        
        // Service search (if implemented)
        const serviceSearch = document.getElementById('serviceSearch');
        if (serviceSearch) {
            serviceSearch.addEventListener('input', debounce(() => {
                this.searchServices(serviceSearch.value);
            }, 300));
        }
    }
}

// Initialize services manager
let servicesManager;

document.addEventListener('DOMContentLoaded', function() {
    servicesManager = new ServicesManager();
    
    // Check for service in URL
    const urlParams = new URLSearchParams(window.location.search);
    const serviceName = urlParams.get('service');
    if (serviceName) {
        // Find and open the service
        for (const category in SERVICES_DATA) {
            const service = SERVICES_DATA[category].find(s => 
                s.name.toLowerCase().includes(serviceName.toLowerCase())
            );
            if (service) {
                servicesManager.openServiceDetails(service.id);
                break;
            }
        }
    }
});

// Calculate service fees
function calculateServiceFees(serviceType, businessSize) {
    const feeStructure = {
        'business_permit': {
            'micro': 3000,
            'small': 5000,
            'medium': 8000,
            'large': 10000
        },
        'building_permit': {
            'residential': 5000,
            'commercial': 10000,
            'industrial': 15000
        },
        'property_tax': (assessedValue) => assessedValue * 0.01
    };
    
    // This is a simplified calculation
    return feeStructure[serviceType] || 'Variable';
}

// Service status tracking
function trackServiceStatus(requestId) {
    const request = getServiceRequest(requestId);
    if (!request) return null;
    
    const statuses = ['pending', 'processing', 'for_payment', 'completed', 'cancelled'];
    const currentIndex = statuses.indexOf(request.status);
    const nextIndex = currentIndex < statuses.length - 1 ? currentIndex + 1 : currentIndex;
    
    return {
        current: request.status,
        next: statuses[nextIndex],
        progress: ((currentIndex + 1) / statuses.length) * 100
    };
}