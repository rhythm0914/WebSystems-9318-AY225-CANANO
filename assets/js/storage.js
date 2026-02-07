// LocalStorage Management

const STORAGE_KEYS = {
    THEME: 'bacoor-theme',
    RECENT_VIEWS: 'bacoor-recent-views',
    FORM_DRAFTS: 'bacoor-form-drafts',
    USER_PREFERENCES: 'bacoor-user-prefs',
    SERVICE_REQUESTS: 'bacoor-service-requests'
};

// User Preferences
function saveUserPreferences(prefs) {
    try {
        const existing = getUserPreferences();
        const updated = { ...existing, ...prefs };
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Error saving user preferences:', error);
        return false;
    }
}

function getUserPreferences() {
    try {
        const prefs = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        return prefs ? JSON.parse(prefs) : {};
    } catch (error) {
        console.error('Error getting user preferences:', error);
        return {};
    }
}

// Recent Views Tracking
function addToRecentViews(page, title) {
    try {
        let recentViews = getRecentViews();
        
        // Remove if already exists
        recentViews = recentViews.filter(view => view.page !== page);
        
        // Add to beginning
        recentViews.unshift({
            page: page,
            title: title,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 10 items
        recentViews = recentViews.slice(0, 10);
        
        localStorage.setItem(STORAGE_KEYS.RECENT_VIEWS, JSON.stringify(recentViews));
        return true;
    } catch (error) {
        console.error('Error adding to recent views:', error);
        return false;
    }
}

function getRecentViews() {
    try {
        const recentViews = localStorage.getItem(STORAGE_KEYS.RECENT_VIEWS);
        return recentViews ? JSON.parse(recentViews) : [];
    } catch (error) {
        console.error('Error getting recent views:', error);
        return [];
    }
}

function clearRecentViews() {
    localStorage.removeItem(STORAGE_KEYS.RECENT_VIEWS);
}

// Form Drafts Management
function saveFormDraft(formId, data) {
    try {
        let drafts = getFormDrafts();
        drafts[formId] = {
            data: data,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.FORM_DRAFTS, JSON.stringify(drafts));
        return true;
    } catch (error) {
        console.error('Error saving form draft:', error);
        return false;
    }
}

function getFormDraft(formId) {
    try {
        const drafts = getFormDrafts();
        return drafts[formId] || null;
    } catch (error) {
        console.error('Error getting form draft:', error);
        return null;
    }
}

function getFormDrafts() {
    try {
        const drafts = localStorage.getItem(STORAGE_KEYS.FORM_DRAFTS);
        return drafts ? JSON.parse(drafts) : {};
    } catch (error) {
        console.error('Error getting form drafts:', error);
        return {};
    }
}

function deleteFormDraft(formId) {
    try {
        let drafts = getFormDrafts();
        delete drafts[formId];
        localStorage.setItem(STORAGE_KEYS.FORM_DRAFTS, JSON.stringify(drafts));
        return true;
    } catch (error) {
        console.error('Error deleting form draft:', error);
        return false;
    }
}

// Service Requests History
function saveServiceRequest(requestData) {
    try {
        const requests = getServiceRequests();
        const requestId = generateReferenceId();
        
        const request = {
            id: requestId,
            ...requestData,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };
        
        requests.unshift(request);
        localStorage.setItem(STORAGE_KEYS.SERVICE_REQUESTS, JSON.stringify(requests));
        return requestId;
    } catch (error) {
        console.error('Error saving service request:', error);
        return null;
    }
}

function getServiceRequests() {
    try {
        const requests = localStorage.getItem(STORAGE_KEYS.SERVICE_REQUESTS);
        return requests ? JSON.parse(requests) : [];
    } catch (error) {
        console.error('Error getting service requests:', error);
        return [];
    }
}

function getServiceRequest(requestId) {
    try {
        const requests = getServiceRequests();
        return requests.find(req => req.id === requestId) || null;
    } catch (error) {
        console.error('Error getting service request:', error);
        return null;
    }
}

// Announcements Preferences
function markAnnouncementAsRead(announcementId) {
    try {
        const prefs = getUserPreferences();
        if (!prefs.readAnnouncements) {
            prefs.readAnnouncements = [];
        }
        
        if (!prefs.readAnnouncements.includes(announcementId)) {
            prefs.readAnnouncements.push(announcementId);
            saveUserPreferences(prefs);
        }
        return true;
    } catch (error) {
        console.error('Error marking announcement as read:', error);
        return false;
    }
}

function getReadAnnouncements() {
    try {
        const prefs = getUserPreferences();
        return prefs.readAnnouncements || [];
    } catch (error) {
        console.error('Error getting read announcements:', error);
        return [];
    }
}

// Clear All Data (for testing/reset)
function clearAllStorage() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}

// Check Storage Availability
function isStorageAvailable() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

// Initialize storage on page load
document.addEventListener('DOMContentLoaded', function() {
    // Track page view
    const pageTitle = document.title;
    const pagePath = window.location.pathname.split('/').pop() || 'index.html';
    addToRecentViews(pagePath, pageTitle);
    
    // Check storage availability
    if (!isStorageAvailable()) {
        console.warn('LocalStorage is not available. Some features may be limited.');
    }
    
    // Load saved form drafts
    loadFormDrafts();
});

// Load saved form drafts into forms
function loadFormDrafts() {
    // This would be implemented per form
    // Example implementation in forms.js
}