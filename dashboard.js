document.addEventListener('DOMContentLoaded', async () => {
    // Check Authentication
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    const user = session.user;
    const fullName = user.user_metadata?.full_name || user.email.split('@')[0];

    // Populate user data
    document.getElementById('userNameDisplay').textContent = fullName;
    document.getElementById('userAvatar').textContent = fullName.charAt(0).toUpperCase();

    // Logout Logic
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'index.html';
    });

    // Mobile Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    document.getElementById('openSidebar').addEventListener('click', () => {
        sidebar.classList.add('open');
    });
    document.getElementById('closeSidebar').addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // Initialize Charts using Chart.js
    initCharts();
});

function initCharts() {
    // Common Chart Configs
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#6b7280';
    const primaryColor = '#4f46e5';
    const primaryLight = 'rgba(79, 70, 229, 0.2)';
    const secondaryColors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    // 1. Bar Chart: Monthly Revenue
    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue ($)',
                data: [12000, 19000, 15000, 22000, 18000, 25000],
                backgroundColor: primaryColor,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { borderDash: [2, 4] } },
                x: { grid: { display: false } }
            }
        }
    });

    // 2. Pie Chart: User Distribution
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Desktop', 'Mobile', 'Tablet'],
            datasets: [{
                data: [55, 35, 10],
                backgroundColor: [primaryColor, secondaryColors[0], secondaryColors[1]],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 3. Line Chart: User Growth Trend
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Active Users',
                data: [5000, 6200, 5800, 7100, 8400, 8100, 9500],
                borderColor: primaryColor,
                backgroundColor: primaryLight,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: primaryColor
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { borderDash: [2, 4] } },
                x: { grid: { display: false } }
            }
        }
    });
}
