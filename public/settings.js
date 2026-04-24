const DEFAULT_SETTINGS = {
    role: 'Admin',
    editLoomMaintenance: true,
    viewSalary: true,
    editProduction: true,
    maintenanceInterval: 30,
    autoMarkOverdue: true,
    defaultStatus: 'Pending',
    enableNotifications: true,
    maintenanceReminder: true,
    reminderTime: 5,
    loomFailureAlert: true,
    totalLooms: 50,
    loomPrefix: 'LM-',
    shiftType: 'Day',
    exportFormat: 'PDF',
    defaultDuration: 'Monthly',
    autoGenerateReports: false,
    language: 'English',
    dateFormat: 'DD-MM-YYYY'
};

function getSettings() {
    return JSON.parse(localStorage.getItem('texellenceAppSettings')) || DEFAULT_SETTINGS;
}

function saveSetting(key, value) {
    const settings = getSettings();
    settings[key] = value;
    localStorage.setItem('texellenceAppSettings', JSON.stringify(settings));
}

function updatePassword(newPassword) {
    const users = JSON.parse(localStorage.getItem('texellenceUsers')) || { admin: '' };
    users['admin'] = newPassword;
    localStorage.setItem('texellenceUsers', JSON.stringify(users));
}

function generateToggle(key, label) {
    const val = getSettings()[key];
    const activeClass = val ? 'active' : '';
    return `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px; margin-bottom: 12px;">
            <span style="color: var(--text-secondary); font-size: 0.95rem;">${label}</span>
            <div class="toggle-switch ${activeClass}" id="toggle-${key}" onclick="window.toggleSetting('${key}', this)"></div>
        </div>
    `;
}

window.toggleSetting = function(key, element) {
    const isActive = element.classList.contains('active');
    element.classList.toggle('active');
    saveSetting(key, !isActive);
}

window.handleSettingInput = function(key, element) {
    saveSetting(key, element.value);
}

window.handlePasswordChange = function(element) {
    if(element.value !== '') {
        updatePassword(element.value);
        alert('Admin Passcode updated successfully.');
    }
}

window.renderSettingsPage = function(container) {
    const s = getSettings();

    container.innerHTML = `
        <div class="view-section active">
            <h2 class="page-title">Settings</h2>
            <p class="page-subtitle">Manage system preferences and configuration</p>
            
            <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));">
                
                <!-- 1. User Access -->
                <div class="card glass-panel" style="text-align: left; align-items: flex-start; padding: 28px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 20px; color: #fff;"><i data-lucide="shield" style="width:18px; margin-right:8px; vertical-align:text-bottom; color: var(--accent-hover);"></i> User Access</h3>
                    <div class="form-group" style="margin-bottom: 16px; width: 100%;">
                        <label>Access Role</label>
                        <select onchange="window.handleSettingInput('role', this)">
                            <option value="Admin" ${s.role === 'Admin' ? 'selected' : ''}>Admin</option>
                            <option value="Staff" ${s.role === 'Staff' ? 'selected' : ''}>Staff</option>
                        </select>
                    </div>
                    <div style="width: 100%;">
                        ${generateToggle('editLoomMaintenance', 'Edit Loom Maintenance')}
                        ${generateToggle('viewSalary', 'View Salary')}
                        ${generateToggle('editProduction', 'Edit Production')}
                    </div>
                    <div class="form-group" style="margin-top: 16px; margin-bottom: 0; width: 100%;">
                        <label>Change Passcode</label>
                        <input type="password" placeholder="New Passcode..." onchange="window.handlePasswordChange(this)">
                    </div>
                </div>

                <!-- 2. Maintenance Schedule -->
                <div class="card glass-panel" style="text-align: left; align-items: flex-start; padding: 28px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 20px; color: #fff;"><i data-lucide="clock" style="width:18px; margin-right:8px; vertical-align:text-bottom; color: var(--accent-hover);"></i> Maintenance Schedule</h3>
                    <div class="form-group" style="margin-bottom: 16px; width: 100%;">
                        <label>Interval (Days)</label>
                        <input type="number" value="${s.maintenanceInterval}" onchange="window.handleSettingInput('maintenanceInterval', this)">
                    </div>
                    <div style="width: 100%;">
                        ${generateToggle('autoMarkOverdue', 'Auto-mark Overdue')}
                    </div>
                    <div class="form-group" style="margin-top: 16px; margin-bottom: 0; width: 100%;">
                        <label>Default Status</label>
                        <select onchange="window.handleSettingInput('defaultStatus', this)">
                            <option value="Pending" ${s.defaultStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Fixed" ${s.defaultStatus === 'Fixed' ? 'selected' : ''}>Fixed</option>
                        </select>
                    </div>
                </div>

                <!-- 3. Alerts & Notifications -->
                <div class="card glass-panel" style="text-align: left; align-items: flex-start; padding: 28px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 20px; color: #fff;"><i data-lucide="bell" style="width:18px; margin-right:8px; vertical-align:text-bottom; color: var(--accent-hover);"></i> Alerts & Notifications</h3>
                    <div style="width: 100%;">
                        ${generateToggle('enableNotifications', 'Enable Notifications')}
                        ${generateToggle('maintenanceReminder', 'Maintenance Reminder')}
                        ${generateToggle('loomFailureAlert', 'Loom Failure Alert')}
                    </div>
                    <div class="form-group" style="margin-top: 16px; margin-bottom: 0; width: 100%;">
                        <label>Reminder Time (Days Before Due)</label>
                        <input type="number" value="${s.reminderTime}" onchange="window.handleSettingInput('reminderTime', this)">
                    </div>
                </div>

                <!-- 4. Loom Configuration -->
                <div class="card glass-panel" style="text-align: left; align-items: flex-start; padding: 28px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 20px; color: #fff;"><i data-lucide="settings" style="width:18px; margin-right:8px; vertical-align:text-bottom; color: var(--accent-hover);"></i> Loom Configuration</h3>
                    <div class="form-group" style="margin-bottom: 16px; width: 100%;">
                        <label>Total Number of Looms</label>
                        <input type="number" value="${s.totalLooms}" onchange="window.handleSettingInput('totalLooms', this)">
                    </div>
                    <div class="form-group" style="margin-bottom: 16px; width: 100%;">
                        <label>Loom ID Prefix</label>
                        <input type="text" value="${s.loomPrefix}" onchange="window.handleSettingInput('loomPrefix', this)">
                    </div>
                    <div class="form-group" style="margin-bottom: 0; width: 100%;">
                        <label>Default Shift Type</label>
                        <select onchange="window.handleSettingInput('shiftType', this)">
                            <option value="Day" ${s.shiftType === 'Day' ? 'selected' : ''}>Day</option>
                            <option value="Night" ${s.shiftType === 'Night' ? 'selected' : ''}>Night</option>
                        </select>
                    </div>
                </div>

                <!-- 5. Data & Reports -->
                <div class="card glass-panel" style="text-align: left; align-items: flex-start; padding: 28px;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 20px; color: #fff;"><i data-lucide="file-text" style="width:18px; margin-right:8px; vertical-align:text-bottom; color: var(--accent-hover);"></i> Data & Reports</h3>
                    <div class="form-group" style="margin-bottom: 16px; width: 100%;">
                        <label>Export Format</label>
                        <select onchange="window.handleSettingInput('exportFormat', this)">
                            <option value="PDF" ${s.exportFormat === 'PDF' ? 'selected' : ''}>PDF</option>
                            <option value="Excel" ${s.exportFormat === 'Excel' ? 'selected' : ''}>Excel</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 16px; width: 100%;">
                        <label>Default Report Duration</label>
                        <select onchange="window.handleSettingInput('defaultDuration', this)">
                            <option value="Daily" ${s.defaultDuration === 'Daily' ? 'selected' : ''}>Daily</option>
                            <option value="Monthly" ${s.defaultDuration === 'Monthly' ? 'selected' : ''}>Monthly</option>
                        </select>
                    </div>
                    <div style="width: 100%;">
                        ${generateToggle('autoGenerateReports', 'Auto-generate Reports')}
                    </div>
                </div>

                <!-- 6. App Preferences -->
                <div class="card glass-panel" style="text-align: left; align-items: flex-start; justify-content: space-between; padding: 28px;">
                    <div style="width: 100%;">
                        <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 20px; color: #fff;"><i data-lucide="sliders" style="width:18px; margin-right:8px; vertical-align:text-bottom; color: var(--accent-hover);"></i> App Preferences</h3>
                        <div class="form-group" style="margin-bottom: 16px;">
                            <label>Language</label>
                            <select onchange="window.handleSettingInput('language', this)">
                                <option value="English" ${s.language === 'English' ? 'selected' : ''}>English</option>
                                <option value="Tamil" ${s.language === 'Tamil' ? 'selected' : ''}>Tamil</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 16px;">
                            <label>Date Format</label>
                            <select onchange="window.handleSettingInput('dateFormat', this)">
                                <option value="DD-MM-YYYY" ${s.dateFormat === 'DD-MM-YYYY' ? 'selected' : ''}>DD-MM-YYYY</option>
                                <option value="MM-DD-YYYY" ${s.dateFormat === 'MM-DD-YYYY' ? 'selected' : ''}>MM-DD-YYYY</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style="width: 100%; margin-top: 24px;">
                        <button class="btn-primary" onclick="logout()" style="width: 100%; padding: 16px; background: rgba(255, 71, 87, 0.1); color: #ff4757; border: 1px solid rgba(255, 71, 87, 0.3); font-weight: 600; box-shadow: none;">
                            <i data-lucide="log-out" style="width: 18px; display: inline-block; vertical-align: bottom; margin-right: 8px;"></i> Logout Securely
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `;
    
    if(window.lucide) {
        window.lucide.createIcons();
    }
};
