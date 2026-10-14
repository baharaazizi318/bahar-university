
/* =========================================================
   BAHAR UNIVERSITY - MAIN JAVASCRIPT
   Language + Dark Mode + Login + Sidebar + Programs
========================================================= */

"use strict";

/* =========================================================
   LANGUAGE
========================================================= */

const languageBtn = document.getElementById("languageBtn");
const languageMenu = document.getElementById("languageMenu");
const currentLanguage = document.getElementById("currentLanguage");

function setLanguage(lang) {
    document.querySelectorAll("[data-en][data-fa]").forEach(element => {
        element.textContent =
            lang === "fa" ? element.dataset.fa : element.dataset.en;
    });

    document.querySelectorAll(
        "[data-placeholder-en][data-placeholder-fa]"
    ).forEach(input => {
        input.placeholder =
            lang === "fa"
                ? input.dataset.placeholderFa
                : input.dataset.placeholderEn;
    });

    document.documentElement.lang = lang === "fa" ? "fa" : "en";
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";

    if (currentLanguage) {
        currentLanguage.textContent = lang === "fa" ? "دری" : "EN";
    }

    localStorage.setItem("baharLanguage", lang);
}

languageBtn?.addEventListener("click", event => {
    event.stopPropagation();
    languageMenu?.classList.toggle("show");
});

document.addEventListener("click", () => {
    languageMenu?.classList.remove("show");
});

document.querySelectorAll("[data-lang]").forEach(button => {
    button.addEventListener("click", event => {
        event.stopPropagation();
        setLanguage(button.dataset.lang);
        languageMenu?.classList.remove("show");
    });
});

/* =========================================================
   DARK MODE
========================================================= */

const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");

function setTheme(theme) {
    const dark = theme === "dark";

    document.documentElement.classList.toggle("dark-mode", dark);

    if (themeIcon) {
        themeIcon.className = dark
            ? "bi bi-sun"
            : "bi bi-moon-stars";
    }

    if (themeBtn) {
        themeBtn.title = dark ? "Light Mode" : "Dark Mode";
    }

    localStorage.setItem("baharTheme", theme);
}

themeBtn?.addEventListener("click", () => {
    const isDark =
        document.documentElement.classList.contains("dark-mode");

    setTheme(isDark ? "light" : "dark");
});

/* =========================================================
   LOGIN MODAL
========================================================= */

const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const loginClose = document.getElementById("loginClose");
const loginOverlay = document.getElementById("loginOverlay");

function openLogin() {
    if (!loginModal) return;

    loginModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeLogin() {
    if (!loginModal) return;

    loginModal.classList.remove("show", "active", "open");
    document.body.style.overflow = "";
    document.body.classList.remove("modal-open");
}

loginClose?.addEventListener("click", closeLogin);
loginOverlay?.addEventListener("click", closeLogin);

/* =========================================================
   SHOW / HIDE PASSWORD
========================================================= */

const passwordToggle = document.getElementById("passwordToggle");
const loginPassword = document.getElementById("loginPassword");

passwordToggle?.addEventListener("click", function () {
    if (!loginPassword) return;

    const showPassword = loginPassword.type === "password";

    loginPassword.type = showPassword ? "text" : "password";

    this.innerHTML = showPassword
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';
});

/* =========================================================
   MOBILE MENU
========================================================= */

const hamburger = document.getElementById("hamburger");
const mainNav = document.getElementById("mainNav");

hamburger?.addEventListener("click", () => {
    if (!mainNav) return;

    mainNav.classList.toggle("open");

    const icon = hamburger.querySelector("i");

    if (icon) {
        icon.className = mainNav.classList.contains("open")
            ? "bi bi-x-lg"
            : "bi bi-list";
    }
});

document.querySelectorAll("#mainNav a").forEach(link => {
    link.addEventListener("click", () => {
        mainNav?.classList.remove("open");

        const icon = hamburger?.querySelector("i");
        if (icon) icon.className = "bi bi-list";
    });
});

/* =========================================================
   PROGRAMS: SEARCH + FILTER + LOAD MORE
========================================================= */

const searchInput = document.getElementById("programSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const programCards = Array.from(
    document.querySelectorAll(".program-card")
);
const noResults = document.getElementById("noResults");
const loadMoreButton = document.getElementById("loadMore");

let activeFilter = "all";
let visibleLimit = 6;

function updatePrograms() {
    if (!programCards.length) return;

    const searchValue = (searchInput?.value || "")
        .toLowerCase()
        .trim();

    const matchedCards = programCards.filter(card => {
        const category = card.dataset.category || "";
        const searchableText = (
            card.dataset.search || card.textContent || ""
        ).toLowerCase();

        return (
            searchableText.includes(searchValue) &&
            (activeFilter === "all" || category === activeFilter)
        );
    });

    programCards.forEach(card => card.classList.add("hidden"));

    matchedCards.forEach((card, index) => {
        if (index < visibleLimit) {
            card.classList.remove("hidden");
        }
    });

    if (noResults) {
        noResults.classList.toggle("show", matchedCards.length === 0);
    }

    if (loadMoreButton) {
        loadMoreButton.style.display =
            matchedCards.length > visibleLimit ? "inline-flex" : "none";
    }
}

searchInput?.addEventListener("input", () => {
    visibleLimit = 6;
    updatePrograms();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        activeFilter = button.dataset.filter || "all";
        visibleLimit = 6;

        updatePrograms();
    });
});

loadMoreButton?.addEventListener("click", () => {
    visibleLimit += 6;
    updatePrograms();
});

/* =========================================================
   LOGIN + LOCAL STORAGE + SIDEBAR + LOGOUT
========================================================= */

(() => {
    const KEY = "baharUser";

    const form = document.getElementById("loginForm");
    const message = document.getElementById("loginMessage");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const roleInput = document.getElementById("accountType");
    const remember = document.getElementById("rememberMe");

    const sidebar = document.getElementById("userSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    const sidebarClose = document.getElementById("sidebarClose");
    const sidebarLogout = document.getElementById("sidebarLogout");
    const dashboardLogout = document.getElementById("dashboardLogout");

    const roleNames = {
        student: "Student",
        faculty: "Faculty / Professor",
        administrator: "Administrator",
        applicant: "Applicant"
    };

    function getUser() {
        try {
            const user = JSON.parse(
                localStorage.getItem(KEY) || "null"
            );

            return user?.isLoggedIn ? user : null;
        } catch (error) {
            console.error("Unable to read user data:", error);
            return null;
        }
    }

    function updateLoginButton() {
        const user = getUser();
        const label = loginBtn?.querySelector("span");

        if (label) {
            label.textContent = user ? "My Dashboard" : "Login";
        }

        if (loginBtn) {
            loginBtn.title = user ? "Open your account" : "Login";
        }
    }

    function openSidebar() {
        const user = getUser();

        if (!user || !sidebar || !backdrop) return;

        const nameElement = document.getElementById("sidebarName");
        const emailElement = document.getElementById("sidebarEmail");
        const roleElement = document.getElementById("sidebarRole");

        if (nameElement) {
            nameElement.textContent = user.name || "University User";
        }

        if (emailElement) {
            emailElement.textContent = user.email || "";
        }

        if (roleElement) {
            roleElement.textContent =
                roleNames[user.accountType] || "User";
        }

        sidebar.classList.add("open");
        backdrop.classList.add("show");
    }

    function closeSidebar() {
        sidebar?.classList.remove("open");
        backdrop?.classList.remove("show");
    }

    /* Login button */
    loginBtn?.addEventListener("click", event => {
        event.preventDefault();

        if (getUser()) {
            openSidebar();
        } else {
            openLogin();
        }
    });

    /* Login form */
    form?.addEventListener("submit", event => {
        event.preventDefault();

        const email = (emailInput?.value || "")
            .trim()
            .toLowerCase();

        const password = passwordInput?.value || "";
        const role = roleInput?.value || "";

        if (!email || !password || !role) {
            if (message) {
                message.textContent = "Please fill in all fields.";
                message.dataset.kind = "error";
            }
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (message) {
                message.textContent = "Please enter a valid email address.";
                message.dataset.kind = "error";
            }
            return;
        }

        if (password.length < 6) {
            if (message) {
                message.textContent =
                    "Password must contain at least 6 characters.";
                message.dataset.kind = "error";
            }
            return;
        }

        const name = email.split("@")[0]
            .replace(/[._-]+/g, " ")
            .replace(/\b\w/g, letter => letter.toUpperCase());

        // Never save the password in browser storage.
        const user = {
            name,
            email,
            accountType: role,
            isLoggedIn: true,
            rememberMe: !!remember?.checked,
            loggedInAt: new Date().toISOString()
        };

        try {
            localStorage.setItem(KEY, JSON.stringify(user));

            // Remove any old session-only login.
            sessionStorage.removeItem(KEY);

            // Verify that saving worked.
            const savedUser = JSON.parse(
                localStorage.getItem(KEY) || "null"
            );

            if (!savedUser || savedUser.email !== email) {
                throw new Error("Saved user could not be verified.");
            }

            if (message) {
                message.textContent = "Login successful!";
                message.dataset.kind = "success";
            }

            if (passwordInput) {
                passwordInput.value = "";
            }

            closeLogin();
            updateLoginButton();
            openSidebar();

        } catch (error) {
            console.error("Login storage error:", error);

            if (message) {
                message.textContent =
                    "Could not save login information. Check browser storage.";
                message.dataset.kind = "error";
            }
        }
    });

    /* Close sidebar */
    sidebarClose?.addEventListener("click", closeSidebar);
    backdrop?.addEventListener("click", closeSidebar);

    /* Close overlays with Escape */
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeSidebar();
            closeLogin();
        }
    });

    /* Logout: remove user data from both storage locations */
    function logoutUser(event) {
        event?.preventDefault();

        localStorage.removeItem(KEY);
        sessionStorage.removeItem(KEY);

        closeSidebar();
        closeLogin();

        document.getElementById("myDashboard")
            ?.classList.remove("show", "active", "open");

        updateLoginButton();

        form?.reset();

        if (message) {
            message.textContent = "";
            delete message.dataset.kind;
        }

        const storageMessage =
            document.getElementById("loginStorageMessage");

        if (storageMessage) {
            storageMessage.textContent = "";
        }
    }

    sidebarLogout?.addEventListener("click", logoutUser);
    dashboardLogout?.addEventListener("click", logoutUser);

    /* Restore saved account */
    const savedUser = getUser();

    if (savedUser) {
        if (emailInput) {
            emailInput.value = savedUser.email || "";
        }

        if (roleInput) {
            roleInput.value = savedUser.accountType || "";
        }

        if (remember) {
            remember.checked = !!savedUser.rememberMe;
        }
    }

    // Optional helpers for other parts of the website.
    window.getBaharUser = getUser;
    window.isBaharLoggedIn = () => !!getUser();
    window.baharLogout = logoutUser;

    updateLoginButton();
})();

/* =========================================================
   RESTORE SAVED SETTINGS
========================================================= */

try {
    setLanguage(localStorage.getItem("baharLanguage") || "en");
    setTheme(localStorage.getItem("baharTheme") || "light");
} catch (error) {
    console.error("Unable to restore saved settings:", error);
}

updatePrograms();