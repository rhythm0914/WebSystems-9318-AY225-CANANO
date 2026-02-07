// Announcements Management

const ANNOUNCEMENTS_DATA = [
    {
        id: 1,
        title: "Citywide Clean-up Drive",
        date: "2024-01-20",
        category: "event",
        content: "The City Government of Bacoor will conduct a citywide clean-up drive on January 20, 2024, from 6:00 AM to 10:00 AM. All residents are encouraged to participate in this initiative to maintain the cleanliness of our city.",
        excerpt: "Join us for the monthly clean-up drive in all barangays.",
        importance: "high",
        department: "Environment",
        contact: "City Environment Office - (046) 434-1234"
    },
    {
        id: 2,
        title: "Tax Payment Extension",
        date: "2024-01-15",
        category: "advisory",
        content: "Due to numerous requests, the deadline for real property tax payment has been extended until January 31, 2024. Penalty charges will be waived during this extension period.",
        excerpt: "Deadline for real property tax payment extended until Jan 31.",
        importance: "medium",
        department: "Treasury",
        contact: "City Treasurer's Office - (046) 434-5678"
    },
    {
        id: 3,
        title: "New Health Center Opening",
        date: "2024-01-18",
        category: "news",
        content: "The new health center in Barangay Molino will officially open on January 25, 2024. Services include free consultations, vaccination, and maternal care.",
        excerpt: "New health center in Barangay Molino to open next week.",
        importance: "high",
        department: "Health",
        contact: "City Health Office - (046) 434-9012"
    },
    {
        id: 4,
        title: "Road Closure Advisory",
        date: "2024-01-12",
        category: "advisory",
        content: "Portion of Aguinaldo Highway will be closed from January 15-20 for road repairs. Alternative routes are available via Molino Road.",
        excerpt: "Road repairs on Aguinaldo Highway from Jan 15-20.",
        importance: "medium",
        department: "Engineering",
        contact: "City Engineering Office - (046) 434-3456"
    },
    {
        id: 5,
        title: "Scholarship Applications Open",
        date: "2024-01-10",
        category: "news",
        content: "City Scholarship applications for SY 2024-2025 are now open. Submit requirements to the City Mayor's Office until February 28, 2024.",
        excerpt: "Apply for city scholarships until February 28.",
        importance: "high",
        department: "Education",
        contact: "Mayor's Office - (046) 434-7890"
    },
    {
        id: 6,
        title: "Independence Day Celebration",
        date: "2024-06-12",
        category: "event",
        content: "Join us for the Independence Day celebration at Bacoor City Plaza on June 12, 2024. Activities include parade, cultural shows, and fireworks display.",
        excerpt: "Celebrate Independence Day at City Plaza.",
        importance: "medium",
        department: "Events",
        contact: "Events Management Office - (046) 434-2345"
    },
    {
        id: 7,
        title: "City Holiday Declaration",
        date: "2024-02-25",
        category: "holiday",
        content: "February 25, 2024 is declared a special non-working holiday in Bacoor City in celebration of the EDSA Revolution Anniversary.",
        excerpt: "Special non-working holiday on February 25.",
        importance: "low",
        department: "Mayor's Office",
        contact: "Mayor's Office - (046) 434-7890"
    },
    {
        id: 8,
        title: "Business Permit Renewal Reminder",
        date: "2024-01-05",
        category: "advisory",
        content: "Reminder to all business owners: Business permit renewal deadline is on January 20, 2024. Late renewals will incur penalties.",
        excerpt: "Business permit renewal deadline on January 20.",
        importance: "high",
        department: "Business Permits",
        contact: "BPLO - (046) 434-6789"
    }
];

class AnnouncementsManager {
    constructor() {
        this.announcements = ANNOUNCEMENTS_DATA;
        this.filteredAnnouncements = [...this.announcements];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.init();
    }
    
    init() {
        this.renderAnnouncements();
        this.setupEventListeners();
        this.markReadAnnouncements();
    }
    
    renderAnnouncements() {
        const container = document.getElementById('announcementsContainer');
        if (!container) return;
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const announcementsToShow = this.filteredAnnouncements.slice(startIndex, endIndex);
        
        if (announcementsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-inbox"></i>
                    <h3>No announcements found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = announcementsToShow.map(ann => this.createAnnouncementCard(ann)).join('');
        
        // Update load more button
        this.updateLoadMoreButton();
    }
    
    createAnnouncementCard(announcement) {
        const readAnnouncements = getReadAnnouncements();
        const isRead = readAnnouncements.includes(announcement.id);
        const readClass = isRead ? 'read' : '';
        
        return `
            <div class="announcement-card ${readClass}" onclick="announcementsManager.openAnnouncement(${announcement.id})">
                <span class="ann-category ${announcement.category}">${this.getCategoryLabel(announcement.category)}</span>
                ${announcement.importance === 'high' ? '<span class="ann-importance"><i class="fas fa-exclamation-circle"></i> Important</span>' : ''}
                <h3>${announcement.title}</h3>
                <p>${announcement.excerpt}</p>
                <div class="ann-meta">
                    <span><i class="far fa-calendar"></i> ${this.formatDate(announcement.date)}</span>
                    <span><i class="fas fa-building"></i> ${announcement.department}</span>
                </div>
                ${isRead ? '<span class="ann-read"><i class="fas fa-check"></i> Read</span>' : ''}
            </div>
        `;
    }
    
    openAnnouncement(id) {
        const announcement = this.announcements.find(a => a.id === id);
        if (!announcement) return;
        
        // Mark as read
        markAnnouncementAsRead(id);
        
        const modal = document.getElementById('announcementModal');
        const content = document.getElementById('announcementModalContent');
        
        if (modal && content) {
            content.innerHTML = `
                <h2>${announcement.title}</h2>
                <div class="ann-meta">
                    <span class="ann-category ${announcement.category}">${this.getCategoryLabel(announcement.category)}</span>
                    <span><i class="far fa-calendar"></i> ${this.formatDate(announcement.date)}</span>
                    <span><i class="fas fa-building"></i> ${announcement.department}</span>
                </div>
                ${announcement.importance === 'high' ? 
                    '<div class="ann-alert"><i class="fas fa-exclamation-circle"></i> Important Announcement</div>' : ''}
                
                <div class="ann-content">
                    ${announcement.content.split('\n').map(para => `<p>${para}</p>`).join('')}
                </div>
                
                ${announcement.contact ? `
                    <div class="ann-contact">
                        <h4><i class="fas fa-phone"></i> Contact Information</h4>
                        <p>${announcement.contact}</p>
                    </div>
                ` : ''}
                
                <div class="ann-actions">
                    <button class="btn btn-outline" onclick="announcementsManager.shareAnnouncement(${id})">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                    <button class="btn btn-secondary" onclick="printAnnouncement(${id})">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>
            `;
            modal.classList.add('active');
        }
    }
    
    filterAnnouncements(category) {
        this.currentFilter = category;
        this.currentPage = 1;
        
        this.filteredAnnouncements = this.announcements.filter(ann => {
            const matchesCategory = category === 'all' || ann.category === category;
            const matchesSearch = !this.searchQuery || 
                ann.title.toLowerCase().includes(this.searchQuery) ||
                ann.content.toLowerCase().includes(this.searchQuery) ||
                ann.department.toLowerCase().includes(this.searchQuery);
            
            return matchesCategory && matchesSearch;
        });
        
        this.renderAnnouncements();
        
        // Update active filter button
        document.querySelectorAll('.filter-option').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            }
        });
    }
    
    searchAnnouncements(query) {
        this.searchQuery = query.toLowerCase();
        this.currentPage = 1;
        
        this.filteredAnnouncements = this.announcements.filter(ann => {
            const matchesCategory = this.currentFilter === 'all' || ann.category === this.currentFilter;
            const matchesSearch = !this.searchQuery || 
                ann.title.toLowerCase().includes(this.searchQuery) ||
                ann.content.toLowerCase().includes(this.searchQuery) ||
                ann.department.toLowerCase().includes(this.searchQuery);
            
            return matchesCategory && matchesSearch;
        });
        
        this.renderAnnouncements();
    }
    
    loadMore() {
        const totalPages = Math.ceil(this.filteredAnnouncements.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.appendAnnouncements();
        }
    }
    
    appendAnnouncements() {
        const container = document.getElementById('announcementsContainer');
        if (!container) return;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const announcementsToAppend = this.filteredAnnouncements.slice(startIndex, endIndex);
        
        announcementsToAppend.forEach(ann => {
            container.innerHTML += this.createAnnouncementCard(ann);
        });
        
        this.updateLoadMoreButton();
    }
    
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;
        
        const totalPages = Math.ceil(this.filteredAnnouncements.length / this.itemsPerPage);
        
        if (this.currentPage >= totalPages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
            loadMoreBtn.textContent = `Load More (${this.filteredAnnouncements.length - (this.currentPage * this.itemsPerPage)} remaining)`;
        }
    }
    
    markReadAnnouncements() {
        const readAnnouncements = getReadAnnouncements();
        readAnnouncements.forEach(id => {
            const card = document.querySelector(`.announcement-card[onclick*="${id}"]`);
            if (card) {
                card.classList.add('read');
            }
        });
    }
    
    shareAnnouncement(id) {
        const announcement = this.announcements.find(a => a.id === id);
        if (!announcement) return;
        
        const shareUrl = `${window.location.origin}${window.location.pathname}?announcement=${id}`;
        const shareText = `Check out this announcement from Bacoor City LGU: ${announcement.title}`;
        
        if (navigator.share) {
            navigator.share({
                title: announcement.title,
                text: shareText,
                url: shareUrl
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
                alert('Link copied to clipboard!');
            });
        }
    }
    
    getCategoryLabel(category) {
        const labels = {
            news: 'News',
            advisory: 'Advisory',
            event: 'Event',
            holiday: 'Holiday'
        };
        return labels[category] || category;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.filterAnnouncements(filter);
            });
        });
        
        // Search input
        const searchInput = document.getElementById('announcementSearch');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(() => {
                this.searchAnnouncements(searchInput.value);
            }, 300));
        }
        
        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMore());
        }
    }
}

// Initialize announcements manager
let announcementsManager;

document.addEventListener('DOMContentLoaded', function() {
    announcementsManager = new AnnouncementsManager();
    
    // Check for announcement in URL
    const urlParams = new URLSearchParams(window.location.search);
    const announcementId = urlParams.get('announcement');
    if (announcementId) {
        announcementsManager.openAnnouncement(parseInt(announcementId));
    }
});

// Print announcement
function printAnnouncement(id) {
    const announcement = ANNOUNCEMENTS_DATA.find(a => a.id === id);
    if (!announcement) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>${announcement.title} - Bacoor City LGU</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #0056A8; border-bottom: 2px solid #0056A8; padding-bottom: 10px; }
                    .meta { color: #666; margin-bottom: 20px; }
                    .content { line-height: 1.6; }
                    .footer { margin-top: 40px; color: #666; font-size: 0.9em; border-top: 1px solid #ccc; padding-top: 10px; }
                </style>
            </head>
            <body>
                <h1>${announcement.title}</h1>
                <div class="meta">
                    <strong>Date:</strong> ${new Date(announcement.date).toLocaleDateString()}<br>
                    <strong>Category:</strong> ${announcement.category}<br>
                    <strong>Department:</strong> ${announcement.department}
                </div>
                <div class="content">
                    ${announcement.content.split('\n').map(para => `<p>${para}</p>`).join('')}
                </div>
                ${announcement.contact ? `
                    <div class="contact">
                        <strong>Contact:</strong> ${announcement.contact}
                    </div>
                ` : ''}
                <div class="footer">
                    Printed from Bacoor City LGU Website<br>
                    ${window.location.href}<br>
                    Printed on: ${new Date().toLocaleString()}
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Export announcements to CSV
function exportAnnouncementsToCSV() {
    const headers = ['Title', 'Date', 'Category', 'Department', 'Excerpt'];
    const rows = ANNOUNCEMENTS_DATA.map(ann => [
        ann.title,
        ann.date,
        ann.category,
        ann.department,
        ann.excerpt
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bacoor-announcements.csv';
    a.click();
}