// Departments Management

const DEPARTMENTS_DATA = [
    {
        id: 1,
        name: "Mayor's Office",
        category: "administrative",
        description: "Office of the City Mayor, responsible for overall administration and governance.",
        contact: "(046) 434-0001",
        email: "mayor@bacoorcity.gov.ph",
        head: "Mayor Strike B. Revilla",
        services: ["Executive Functions", "Policy Making", "City Planning"],
        location: "City Hall, 2nd Floor",
        hours: "8:00 AM - 5:00 PM"
    },
    {
        id: 2,
        name: "City Treasurer's Office",
        category: "regulatory",
        description: "Responsible for revenue generation, tax collection, and financial management.",
        contact: "(046) 434-0002",
        email: "treasurer@bacoorcity.gov.ph",
        head: "City Treasurer Maria Santos",
        services: ["Tax Collection", "Business Permits", "Financial Management"],
        location: "City Hall, 1st Floor",
        hours: "8:00 AM - 5:00 PM"
    },
    {
        id: 3,
        name: "City Health Office",
        category: "service",
        description: "Provides health services, disease prevention, and health promotion programs.",
        contact: "(046) 434-0003",
        email: "health@bacoorcity.gov.ph",
        head: "City Health Officer Dr. Juan Dela Cruz",
        services: ["Medical Services", "Vaccination", "Maternal Care", "Disease Control"],
        location: "City Health Building",
        hours: "24/7 Emergency, 8AM-5PM Regular"
    },
    {
        id: 4,
        name: "City Engineering Office",
        category: "development",
        description: "Handles infrastructure projects, road maintenance, and public works.",
        contact: "(046) 434-0004",
        email: "engineering@bacoorcity.gov.ph",
        head: "City Engineer Roberto Garcia",
        services: ["Infrastructure Projects", "Road Maintenance", "Building Permits"],
        location: "Engineering Building",
        hours: "8:00 AM - 5:00 PM"
    },
    {
        id: 5,
        name: "Business Permits & Licensing Office",
        category: "regulatory",
        description: "Processes business permits, licenses, and regulates business establishments.",
        contact: "(046) 434-0005",
        email: "bplo@bacoorcity.gov.ph",
        head: "BPLO Chief Andrea Torres",
        services: ["Business Registration", "Permit Renewal", "Business Regulation"],
        location: "City Hall, Ground Floor",
        hours: "8:00 AM - 5:00 PM"
    },
    {
        id: 6,
        name: "Social Welfare & Development Office",
        category: "service",
        description: "Provides social services, assistance programs, and community development.",
        contact: "(046) 434-0006",
        email: "swdo@bacoorcity.gov.ph",
        head: "SWDO Head Lorna Mendoza",
        services: ["Social Assistance", "Livelihood Programs", "Disaster Response"],
        location: "Social Welfare Building",
        hours: "8:00 AM - 5:00 PM"
    },
    {
        id: 7,
        name: "City Environment & Natural Resources Office",
        category: "development",
        description: "Manages environmental programs, waste management, and natural resources.",
        contact: "(046) 434-0007",
        email: "environment@bacoorcity.gov.ph",
        head: "CENRO Chief Carlos Rivera",
        services: ["Waste Management", "Environmental Protection", "Tree Planting"],
        location: "Environment Building",
        hours: "8:00 AM - 5:00 PM"
    },
    {
        id: 8,
        name: "City Planning & Development Office",
        category: "development",
        description: "Responsible for urban planning, zoning, and development regulations.",
        contact: "(046) 434-0008",
        email: "planning@bacoorcity.gov.ph",
        head: "CPDO Head Patricia Gomez",
        services: ["Zoning", "Land Use Planning", "Development Permits"],
        location: "City Hall, 3rd Floor",
        hours: "8:00 AM - 5:00 PM"
    },
    {
        id: 9,
        name: "City Legal Office",
        category: "administrative",
        description: "Provides legal services, represents the city in legal matters.",
        contact: "(046) 434-0009",
        email: "legal@bacoorcity.gov.ph",
        head: "City Attorney Ramon Sevilla",
        services: ["Legal Advice", "Contract Review", "Litigation"],
        location: "City Hall, 2nd Floor",
        hours: "8:00 AM - 5:00 PM"
    },
    {
        id: 10,
        name: "City Agriculture Office",
        category: "service",
        description: "Supports agricultural development, farmers' assistance, and food security.",
        contact: "(046) 434-0010",
        email: "agriculture@bacoorcity.gov.ph",
        head: "Agriculturist Fernando Reyes",
        services: ["Farmers' Assistance", "Agricultural Training", "Crop Distribution"],
        location: "Agriculture Building",
        hours: "8:00 AM - 5:00 PM"
    }
];

class DepartmentsManager {
    constructor() {
        this.departments = DEPARTMENTS_DATA;
        this.filteredDepartments = [...this.departments];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.init();
    }
    
    init() {
        this.renderDepartments();
        this.setupEventListeners();
    }
    
    renderDepartments() {
        const container = document.getElementById('departmentsContainer');
        if (!container) return;
        
        if (this.filteredDepartments.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-building"></i>
                    <h3>No departments found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.filteredDepartments.map(dept => this.createDepartmentCard(dept)).join('');
    }
    
    createDepartmentCard(department) {
        const icon = this.getDepartmentIcon(department.category);
        
        return `
            <div class="department-card" onclick="departmentsManager.openDepartmentModal(${department.id})">
                <div class="department-icon">
                    <i class="${icon}"></i>
                </div>
                <h3>${department.name}</h3>
                <p>${department.description.substring(0, 100)}...</p>
                <div class="department-meta">
                    <span><i class="fas fa-phone"></i> ${department.contact}</span>
                    <span class="dept-category ${department.category}">${this.getCategoryLabel(department.category)}</span>
                </div>
            </div>
        `;
    }
    
    openDepartmentModal(id) {
        const department = this.departments.find(d => d.id === id);
        if (!department) return;
        
        const modal = document.getElementById('departmentModal');
        const content = document.getElementById('modalContent');
        
        if (modal && content) {
            const icon = this.getDepartmentIcon(department.category);
            
            content.innerHTML = `
                <div class="department-modal-header">
                    <div class="dept-modal-icon">
                        <i class="${icon}"></i>
                    </div>
                    <div>
                        <h2>${department.name}</h2>
                        <span class="dept-category ${department.category}">${this.getCategoryLabel(department.category)}</span>
                    </div>
                </div>
                
                <div class="department-details">
                    <div class="detail-item">
                        <h4><i class="fas fa-user-tie"></i> Department Head</h4>
                        <p>${department.head}</p>
                    </div>
                    
                    <div class="detail-item">
                        <h4><i class="fas fa-phone"></i> Contact Information</h4>
                        <p>Phone: ${department.contact}</p>
                        <p>Email: ${department.email}</p>
                    </div>
                    
                    <div class="detail-item">
                        <h4><i class="fas fa-map-marker-alt"></i> Location</h4>
                        <p>${department.location}</p>
                    </div>
                    
                    <div class="detail-item">
                        <h4><i class="fas fa-clock"></i> Office Hours</h4>
                        <p>${department.hours}</p>
                    </div>
                    
                    <div class="detail-item">
                        <h4><i class="fas fa-info-circle"></i> Description</h4>
                        <p>${department.description}</p>
                    </div>
                    
                    <div class="detail-item">
                        <h4><i class="fas fa-tasks"></i> Services</h4>
                        <div class="services-list">
                            ${department.services.map(service => `
                                <span class="service-tag">${service}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="department-actions">
                    <button class="btn btn-primary" onclick="departmentsManager.contactDepartment(${id})">
                        <i class="fas fa-envelope"></i> Contact Department
                    </button>
                    <button class="btn btn-secondary" onclick="departmentsManager.getDirections('${department.location}')">
                        <i class="fas fa-directions"></i> Get Directions
                    </button>
                </div>
            `;
            
            modal.classList.add('active');
        }
    }
    
    filterDepartments(category) {
        this.currentFilter = category;
        this.updateFilteredDepartments();
        this.renderDepartments();
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            }
        });
    }
    
    searchDepartments(query) {
        this.searchQuery = query.toLowerCase();
        this.updateFilteredDepartments();
        this.renderDepartments();
    }
    
    updateFilteredDepartments() {
        this.filteredDepartments = this.departments.filter(dept => {
            const matchesCategory = this.currentFilter === 'all' || dept.category === this.currentFilter;
            const matchesSearch = !this.searchQuery || 
                dept.name.toLowerCase().includes(this.searchQuery) ||
                dept.description.toLowerCase().includes(this.searchQuery) ||
                dept.head.toLowerCase().includes(this.searchQuery);
            
            return matchesCategory && matchesSearch;
        });
    }
    
    contactDepartment(id) {
        const department = this.departments.find(d => d.id === id);
        if (!department) return;
        
        window.location.href = `contact.html?department=${encodeURIComponent(department.name)}`;
    }
    
    getDirections(location) {
        const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(location + ', Bacoor City')}`;
        window.open(mapUrl, '_blank');
    }
    
    getDepartmentIcon(category) {
        const icons = {
            administrative: "fas fa-landmark",
            regulatory: "fas fa-file-contract",
            service: "fas fa-hands-helping",
            development: "fas fa-hard-hat"
        };
        return icons[category] || "fas fa-building";
    }
    
    getCategoryLabel(category) {
        const labels = {
            administrative: "Administrative",
            regulatory: "Regulatory",
            service: "Public Service",
            development: "Development"
        };
        return labels[category] || category;
    }
    
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.filterDepartments(filter);
            });
        });
        
        // Search input
        const searchInput = document.getElementById('departmentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(() => {
                this.searchDepartments(searchInput.value);
            }, 300));
        }
        
        // Modal close
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                const modal = document.getElementById('departmentModal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        }
    }
}

// Initialize departments manager
let departmentsManager;

document.addEventListener('DOMContentLoaded', function() {
    departmentsManager = new DepartmentsManager();
    
    // Check for department in URL
    const urlParams = new URLSearchParams(window.location.search);
    const departmentName = urlParams.get('department');
    if (departmentName) {
        const department = DEPARTMENTS_DATA.find(d => 
            d.name.toLowerCase().includes(departmentName.toLowerCase())
        );
        if (department) {
            departmentsManager.openDepartmentModal(department.id);
        }
    }
});

// Export departments to PDF (concept)
function exportDepartmentDirectory() {
    alert('This would generate and download a PDF directory of all departments. In a real implementation, this would use a PDF generation library.');
}