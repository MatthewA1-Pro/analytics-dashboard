document.addEventListener('DOMContentLoaded', async () => {
    // Check Authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Listen for auth events (e.g. password recovery)
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
            showForm(resetForm);
        } else if (event === 'SIGNED_IN') {
             window.location.href = 'dashboard.html';
        }
    });

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const verifyForm = document.getElementById('verifyForm');
    const forgotForm = document.getElementById('forgotForm');
    const resetForm = document.getElementById('resetForm');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Navigation Links 
    document.getElementById('linkToSignup').addEventListener('click', (e) => { e.preventDefault(); showForm(signupForm); });
    document.getElementById('linkToLogin').addEventListener('click', (e) => { e.preventDefault(); showForm(loginForm); });
    document.getElementById('linkToForgot').addEventListener('click', (e) => { e.preventDefault(); showForm(forgotForm); });
    document.getElementById('linkToLoginFromVerify').addEventListener('click', (e) => { e.preventDefault(); showForm(loginForm); });
    document.getElementById('linkToLoginFromForgot').addEventListener('click', (e) => { e.preventDefault(); showForm(loginForm); });
    document.getElementById('linkToLoginFromReset').addEventListener('click', (e) => { e.preventDefault(); showForm(loginForm); });

    function showForm(formElement) {
        [loginForm, signupForm, verifyForm, forgotForm, resetForm].forEach(f => f.classList.add('hidden'));
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        formElement.classList.remove('hidden');
    }

    function toggleLoading(show) {
        if(show) loadingOverlay.classList.remove('hidden');
        else loadingOverlay.classList.add('hidden');
    }

    // --- Login ---
    document.getElementById('login').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('loginError');
        
        toggleLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        toggleLoading(false);

        if (error) {
            errorEl.textContent = error.message;
        } else {
            window.location.href = 'dashboard.html';
        }
    });

    // --- Signup ---
    document.getElementById('signup').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const errorEl = document.getElementById('signupError');

        if (password.length < 6) {
            errorEl.textContent = 'Password must be at least 6 characters.';
            return;
        }

        toggleLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } }
        });
        toggleLoading(false);

        if (error) {
            errorEl.textContent = error.message;
        } else {
            // Check if email confirmation is required
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                errorEl.textContent = 'Email already in use.';
            } else if (data.session) {
                // Auto logged in (email confirmation disabled)
                window.location.href = 'dashboard.html';
            } else {
                // Needs real email verification
                document.getElementById('verifyMessage').textContent = `We've sent a verification link to ${email}. Please check your inbox.`;
                const simBtn = document.getElementById('simulateVerifyBtn');
                if (simBtn) simBtn.classList.add('hidden'); // Hide the simulate button since it's real now
                showForm(verifyForm);
            }
        }
    });

    // --- Forgot Password ---
    document.getElementById('forgot').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value.trim();
        const errorEl = document.getElementById('forgotError');
        const successEl = document.getElementById('forgotSuccess');

        toggleLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + window.location.pathname
        });
        toggleLoading(false);

        if (error) {
            errorEl.textContent = error.message;
            successEl.classList.add('hidden');
        } else {
            errorEl.textContent = '';
            successEl.classList.remove('hidden');
            successEl.textContent = 'Check your email for the reset link!';
            const simBtn = document.getElementById('simulateResetBtn');
            if (simBtn) simBtn.classList.add('hidden');
        }
    });

    // --- Reset Password ---
    document.getElementById('reset').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('resetPassword').value;
        const errorEl = document.getElementById('resetError');
        const successEl = document.getElementById('resetSuccess');
        
        toggleLoading(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        toggleLoading(false);

        if (error) {
            errorEl.textContent = error.message;
        } else {
            successEl.classList.remove('hidden');
            setTimeout(() => {
                showForm(loginForm);
            }, 2000);
        }
    });
});
