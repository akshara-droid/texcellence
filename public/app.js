const MODULES = [
    { id: 'dashboard', name: 'Dashboard', icon: 'layout-dashboard', endpoint: null },
    { id: 'attendance', name: 'Attendance', icon: 'calendar-days', endpoint: 'attendance' },
    { id: 'labour', name: 'Salary', icon: 'briefcase', endpoint: 'labour' },
    { id: 'loom', name: 'Loom Maintenance', icon: 'settings', endpoint: 'loom' },
    { id: 'production', name: 'Production', icon: 'factory', endpoint: 'production' },
    { id: 'beam', name: 'Beam Delivery', icon: 'box', endpoint: 'beam' },
    { id: 'sales', name: 'Sales', icon: 'trending-up', endpoint: 'sales' },
    { id: 'purchase', name: 'Purchase', icon: 'shopping-bag', endpoint: 'purchase' },
    { id: 'party', name: 'Party Details', icon: 'building-2', endpoint: 'party' },
    { id: 'delivery', name: 'Delivery', icon: 'truck', endpoint: 'delivery' },
    { id: 'settings', name: 'Settings', icon: 'settings', endpoint: null }
];

const SchemaForms = {
    attendance: [
        { label: 'Labour Name', name: 'labour_name', type: 'text' },
        { label: 'Date', name: 'date', type: 'date' },
        { label: 'Status', name: 'status', type: 'select', options: ['Present', 'Absent'] }
    ],
    labour: [
        { label: 'Name', name: 'name', type: 'text' },
        { label: 'Role', name: 'role', type: 'select', options: ['Weaver', 'Helper', 'Fitter'] },
        { label: 'Shift', name: 'shift', type: 'text' },
        { label: 'Monthly Salary (₹)', name: 'monthly_salary', type: 'number' },
        { label: 'Advance Given (₹)', name: 'advance_given', type: 'number' },
        { label: 'Date', name: 'date', type: 'date' }
    ],
    loom: [
        { label: 'Loom Number', name: 'loom_number', type: 'text' },
        { label: 'Issue Description', name: 'issue_description', type: 'text' },
        { label: 'Date', name: 'date', type: 'date' },
        { label: 'Status', name: 'status', type: 'select', options: ['Pending', 'Fixed'] }
    ],
    production: [
        { label: 'Date', name: 'date', type: 'date' },
        { label: 'Fabric Type', name: 'fabric_type', type: 'text' },
        { label: 'Quantity Produced', name: 'quantity_produced', type: 'number' },
        { label: 'Loom Number', name: 'loom_number', type: 'text' },
        { label: 'Shift', name: 'shift', type: 'text' }
    ],
    beam: [
        { label: 'Beam Number', name: 'beam_number', type: 'text' },
        { label: 'Yarn Type', name: 'yarn_type', type: 'text' },
        { label: 'Beam Length (Meters)', name: 'beam_length', type: 'number' },
        { label: 'Delivery Type', name: 'delivery_type', type: 'select', options: ['Inward', 'Outward'] },
        { label: 'Loom Number', name: 'loom_number', type: 'text' },
        { label: 'Date', name: 'date', type: 'date' }
    ],
    sales: [
        { label: 'Buyer Name', name: 'buyer_name', type: 'text' },
        { label: 'Item Name', name: 'item_name', type: 'text' },
        { label: 'Quantity', name: 'quantity', type: 'number' },
        { label: 'Rate (₹)', name: 'rate', type: 'number' },
        { label: 'Date', name: 'date', type: 'date' }
    ],
    purchase: [
        { label: 'Vendor Name', name: 'vendor_name', type: 'text' },
        { label: 'Item Name', name: 'item_name', type: 'text' },
        { label: 'Quantity', name: 'quantity', type: 'number' },
        { label: 'Rate (₹)', name: 'rate', type: 'number' },
        { label: 'Date', name: 'date', type: 'date' }
    ],
    party: [
        { label: 'Party Name', name: 'name', type: 'text' },
        { label: 'Contact', name: 'contact', type: 'text' },
        { label: 'Address', name: 'address', type: 'text' },
        { label: 'GST Number', name: 'gst', type: 'text' }
    ],
    delivery: [
        { label: 'Party Name', name: 'party_name', type: 'text' },
        { label: 'Fabric Type', name: 'fabric_type', type: 'text' },
        { label: 'Quantity', name: 'quantity', type: 'number' },
        { label: 'Delivery Type', name: 'delivery_type', type: 'select', options: ['Inward', 'Outward'] },
        { label: 'Vehicle Number', name: 'vehicle_number', type: 'text' },
        { label: 'Date', name: 'date', type: 'date' }
    ]
};

let currentActiveModule = 'dashboard';
let editingRecordId = null;

// --- Three.js Advanced 3D Display ---
let scene, camera, renderer;
let particlesGeometry, particlesMaterial, particlesMesh;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if(!container) return;

    scene = new THREE.Scene();
    // Deep space fog
    scene.fog = new THREE.FogExp2(0x05050a, 0.001);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 1000;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create an amazing interactive particle network
    particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000; // High density
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    // Colorful particles (Cyan & Blue tones)
    const color1 = new THREE.Color(0x00f2fe);
    const color2 = new THREE.Color(0x4facfe);
    const color3 = new THREE.Color(0xffffff);

    for(let i = 0; i < particlesCount * 3; i+=3) {
        // Sphere distribution
        const r = 1500 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        posArray[i] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i+1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i+2] = r * Math.cos(phi);

        // Mix colors
        const mixedColor = color1.clone().lerp(color2, Math.random());
        if(Math.random() > 0.9) mixedColor.lerp(color3, 0.8); // Occasional white stars
        
        colorsArray[i] = mixedColor.r;
        colorsArray[i+1] = mixedColor.g;
        colorsArray[i+2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    // Custom shader-like material for glowing dots
    // Actually, PointsMaterial is sufficient, let's use a nice sprite or just additive blending
    particlesMaterial = new THREE.PointsMaterial({
        size: 4,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Interactivity
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate entire system slowly
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // Interactive camera wobble based on mouse
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Wave effect on particles
    const positions = particlesGeometry.attributes.position.array;
    for(let i = 0; i < positions.length; i+=3) {
        // Subtle pulsing or movement could go here, but rotation + camera move is amazing enough
        // and keeps performance high for 3000 particles
    }

    renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    try {
        initThreeJS(); // Initialize Three.js on DOMContentLoaded
    } catch(err) {
        console.error("ThreeJS Init Error: ", err);
    }
    
    // Auth Handle
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        let users = JSON.parse(localStorage.getItem('texellenceUsers')) || { admin: '' };
        let isValid = false;

        if (users[user] && users[user] === pass) {
            isValid = true;
        } else if (user === 'admin' && pass !== '' && users['admin'] === '') {
            isValid = true;
        }

        if (isValid) {
            document.getElementById('login-portal').classList.add('hidden');
            document.getElementById('app-layout').classList.remove('hidden');
            
            // Change particle colors dynamically on login
            if(particlesMaterial) {
                // Flash effect
                particlesMaterial.size = 6;
                setTimeout(() => { particlesMaterial.size = 4; }, 500);
            }
            
            // Added simple fallback to ensure initThreeJS triggers if canvas is empty
            if(!scene && document.getElementById('canvas-container')) {
                initThreeJS();
            }

            openModule('dashboard'); 
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });

    const resetForm = document.getElementById('forgot-password-form');
    if(resetForm) {
        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rUser = document.getElementById('reset-username').value;
            const rPass = document.getElementById('reset-password').value;
            
            if (rUser !== '' && rPass !== '') {
                let users = JSON.parse(localStorage.getItem('texellenceUsers')) || { admin: '' };
                users[rUser] = rPass;
                localStorage.setItem('texellenceUsers', JSON.stringify(users));

                alert("Passcode successfully updated!");
                showLoginBox();
                resetForm.reset();
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if(registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const regUser = document.getElementById('reg-username').value;
            const regPass = document.getElementById('reg-password').value;
            
            if (regUser !== '' && regPass !== '') {
                let users = JSON.parse(localStorage.getItem('texellenceUsers')) || { admin: '' };
                users[regUser] = regPass;
                localStorage.setItem('texellenceUsers', JSON.stringify(users));

                alert("Account created successfully! Admin authentication key saved.");
                showLoginBox();
                registerForm.reset();
            }
        });
    }

    // Modal close
    document.getElementById('close-modal').addEventListener('click', closeModal);
    
    // Form submission
    document.getElementById('crud-form').addEventListener('submit', handleFormSubmit);

    window.openModule = openModule;
    window.openAddModal = openAddModal;
    window.openEditModal = openEditModal;
});

function showLoginBox() {
    const loginBox = document.getElementById('login-box');
    const resetBox = document.getElementById('forgot-password-box');
    const registerBox = document.getElementById('register-box');
    if (loginBox) { loginBox.style.display = 'block'; loginBox.classList.remove('hidden'); }
    if (resetBox) { resetBox.style.display = 'none'; resetBox.classList.add('hidden'); }
    if (registerBox) { registerBox.style.display = 'none'; registerBox.classList.add('hidden'); }
}
window.showLoginBox = showLoginBox;

function forgotPassword() {
    const loginBox = document.getElementById('login-box');
    const resetBox = document.getElementById('forgot-password-box');
    const registerBox = document.getElementById('register-box');
    if (loginBox) { loginBox.style.display = 'none'; loginBox.classList.add('hidden'); }
    if (resetBox) { resetBox.style.display = 'block'; resetBox.classList.remove('hidden'); }
    if (registerBox) { registerBox.style.display = 'none'; registerBox.classList.add('hidden'); }
}
window.forgotPassword = forgotPassword;

function showRegisterBox() {
    const loginBox = document.getElementById('login-box');
    const resetBox = document.getElementById('forgot-password-box');
    const registerBox = document.getElementById('register-box');
    if (loginBox) { loginBox.style.display = 'none'; loginBox.classList.add('hidden'); }
    if (resetBox) { resetBox.style.display = 'none'; resetBox.classList.add('hidden'); }
    if (registerBox) { registerBox.style.display = 'block'; registerBox.classList.remove('hidden'); }
}
window.showRegisterBox = showRegisterBox;

function logout() {
    document.getElementById('login-portal').classList.remove('hidden');
    document.getElementById('app-layout').classList.add('hidden');
    document.getElementById('password').value = '';
    
    // Reset view to dashboard internally
    currentActiveModule = 'dashboard';
    const targetNav = document.getElementById(`nav-dashboard`);
    if(targetNav) {
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        targetNav.classList.add('active');
    }
}
window.logout = logout;

function initSidebar() {
    const nav = document.getElementById('sidebar-nav');
    MODULES.forEach(mod => {
        const a = document.createElement('a');
        a.className = 'nav-item';
        a.id = `nav-${mod.id}`;
        a.onclick = () => openModule(mod.id);
        a.innerText = mod.name;
        nav.appendChild(a);
    });
}

async function fetchRecords(endpoint) {
    try {
        const res = await fetch(`/api/${endpoint}`, {
            headers: { 'Authorization': 'Bearer admin_token' }
        });
        return await res.json();
    } catch(e) {
        console.error("Fetch error:", e);
        return [];
    }
}

async function openModule(id) {
    currentActiveModule = id;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const targetNav = document.getElementById(`nav-${id}`);
    if (targetNav) targetNav.classList.add('active');
    
    const container = document.getElementById('view-container');
    const modObj = MODULES.find(m => m.id === id);
    
    if (id === 'dashboard') {
        let tilesHtml = MODULES.filter(m => m.id !== 'dashboard').map(m => `
            <div class="tile" onclick="openModule('${m.id}')">
                <div class="tile-name">${m.name}</div>
                <div class="tile-icon"><i data-lucide="${m.icon}" style="width: 42px; height: 42px; stroke-width: 1.5;"></i></div>
            </div>
        `).join('');
        container.innerHTML = `
            <div class="view-section active">
                <h2 class="page-title">Dashboard</h2>
                <p class="page-subtitle">Module index overview</p>
                <div class="dashboard-grid">${tilesHtml}</div>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    if (id === 'settings') {
        if(window.renderSettingsPage) {
            window.renderSettingsPage(container);
        }
        return;
    }

    // Role-Based Salary View Tabs
    if (id === 'labour') {
        container.innerHTML = `
            <div class="view-section active">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h2 class="page-title">Salary - Manage Salary Records</h2>
                    </div>
                    <button class="btn-primary" onclick="openAddModal()">+ Add New Entry</button>
                </div>
                
                <div class="tabs-container" style="display: flex; gap: 12px; margin-bottom: 24px; padding: 6px; background: rgba(0,0,0,0.3); border-radius: 12px; width: fit-content; border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(10px);">
                    <button class="tab-btn active" onclick="switchSalaryTab('Weaver', this)">Weaver</button>
                    <button class="tab-btn" onclick="switchSalaryTab('Helper', this)">Helper</button>
                    <button class="tab-btn" onclick="switchSalaryTab('Fitter', this)">Fitter</button>
                </div>

                <div class="table-container">
                    <table id="data-table">
                        <thead><tr id="table-head"><th>Loading...</th></tr></thead>
                        <tbody id="table-body"></tbody>
                    </table>
                </div>
            </div>
        `;
        
        window.currentSalaryTab = 'Weaver';
        window.switchSalaryTab = async function(role, btnElement) {
            window.currentSalaryTab = role;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            if(btnElement) btnElement.classList.add('active');
            
            const data = await fetchRecords('labour?role=' + role);
            populateTable(data, 'labour');
        };

        const data = await fetchRecords('labour?role=Weaver');
        populateTable(data, 'labour');
        return;
    }

    // Standard Data Table View
    container.innerHTML = `
        <div class="view-section active">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2 class="page-title">${modObj.name}</h2>
                    <p class="page-subtitle">Manage ${modObj.name} Records</p>
                </div>
                <button class="btn-primary" onclick="openAddModal()">+ Add New Entry</button>
            </div>
            
            <div class="table-container">
                <table id="data-table">
                    <thead><tr id="table-head"><th>Loading...</th></tr></thead>
                    <tbody id="table-body"></tbody>
                </table>
            </div>
        </div>
    `;

    // Fetch and populate table
    const data = await fetchRecords(modObj.endpoint);
    populateTable(data, id);
}

function getPillClass(val) {
    if(!val) return '';
    const v = val.toString().toLowerCase();
    if(v === 'pending' || v === 'absent') return 'pill pending';
    if(v === 'fixed' || v === 'settled' || v === 'present' || v === 'inward') return 'pill settled';
    if(v === 'outward') return 'pill outward';
    return '';
}

let currentDataStore = {};

function populateTable(data, modelId) {
    const head = document.getElementById('table-head');
    const body = document.getElementById('table-body');
    if (!data || data.length === 0) {
        head.innerHTML = `<th>Notice</th>`;
        body.innerHTML = `<tr><td style="text-align:center; padding: 40px;">No records found. Click 'Add New Entry' to initialize database seeding.</td></tr>`;
        return;
    }

    currentDataStore = {}; // Reset store
    data.forEach(d => currentDataStore[d._id] = d);

    let fields = SchemaForms[modelId].map(f => f.name);
    let labels = SchemaForms[modelId].map(f => f.label);

    if (modelId === 'labour') {
        fields = ['name', 'shift', 'monthly_salary', 'net_amount_display', 'date'];
        labels = ['Name', 'Shift', 'Monthly Salary (₹)', 'Net Amount (₹)', 'Date'];
    }

    // Build Head
    head.innerHTML = labels.map(l => `<th>${l}</th>`).join('') + `<th>Actions</th>`;

    // Build Body
    body.innerHTML = data.map(row => {
        let tr = `<tr>`;
        fields.forEach(f => {
            let val = row[f] || '-';
            if (modelId === 'labour' && f === 'net_amount_display') {
                 val = row['monthly_salary'] || '-';
            }
            // Status pill styling
            if(f === 'status' || f === 'delivery_type') {
                tr += `<td><span class="${getPillClass(val)}">${val}</span></td>`;
            } else {
                tr += `<td>${val}</td>`;
            }
        });
        // Actions mapping safely via ID
        tr += `
            <td>
                <button onclick="openEditModalById('${row._id}')" class="btn-primary" style="padding: 6px 12px; font-size: 0.8rem;">Edit</button>
            </td>
        </tr>`;
        return tr;
    }).join('');

    lucide.createIcons();
}

// Modal Logic
function buildFormFields(schema, record = {}) {
    return schema.map(field => {
        const val = record[field.name] || '';
        let inputHtml = '';
        
        if (field.type === 'select') {
            const options = field.options.map(opt => `<option value="${opt}" ${opt === val ? 'selected' : ''}>${opt}</option>`).join('');
            inputHtml = `<select name="${field.name}" required>${options}</select>`;
        } else {
            inputHtml = `<input type="${field.type}" name="${field.name}" value="${val}" required>`;
        }

        return `
            <div class="form-group">
                <label>${field.label}</label>
                ${inputHtml}
            </div>
        `;
    }).join('');
}

function openAddModal() {
    editingRecordId = null;
    document.getElementById('modal-title').innerText = `Add ${MODULES.find(m => m.id === currentActiveModule).name}`;
    document.getElementById('modal-form-fields').innerHTML = buildFormFields(SchemaForms[currentActiveModule]);
    document.getElementById('crud-modal').classList.remove('hidden');
}

function openEditModalById(id) {
    const record = currentDataStore[id];
    if(!record) return;
    
    editingRecordId = record._id;
    document.getElementById('modal-title').innerText = `Edit ${MODULES.find(m => m.id === currentActiveModule).name}`;
    document.getElementById('modal-form-fields').innerHTML = buildFormFields(SchemaForms[currentActiveModule], record);
    document.getElementById('crud-modal').classList.remove('hidden');
}

window.openEditModalById = openEditModalById;

function closeModal() {
    document.getElementById('crud-modal').classList.add('hidden');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    
    // Convert number strings to actual numbers based on schema
    SchemaForms[currentActiveModule].forEach(field => {
        if(field.type === 'number' && payload[field.name]) {
            payload[field.name] = Number(payload[field.name]);
        }
    });

    const endpoint = MODULES.find(m => m.id === currentActiveModule).endpoint;
    const url = editingRecordId ? `/api/${endpoint}/${editingRecordId}` : `/api/${endpoint}`;
    const method = editingRecordId ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer admin_token'
            },
            body: JSON.stringify(payload)
        });
        
        if(res.ok) {
            closeModal();
            openModule(currentActiveModule); // Refresh view
        } else {
            alert('Failed to save record.');
        }
    } catch(err) {
        console.error(err);
    }
}
