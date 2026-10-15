
/* =========================================================
   BAHAR UNIVERSITY
   Main JavaScript
   Language | Theme | Login | Dashboard | Programs | Faculty
========================================================= */

"use strict";

/* =========================================================
   1. SAFE LOCAL STORAGE HELPERS
========================================================= */

const Storage = {
    get(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : value;
        } catch (error) {
            console.error("Storage read error:", error);
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.error("Storage write error:", error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error("Storage remove error:", error);
            return false;
        }
    }
};

function $(selector, parent = document) {
    return parent.querySelector(selector);
}

function $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}


/* =========================================================
   2. LANGUAGE: ENGLISH / DARI
========================================================= */

const languageBtn = $("#languageBtn");
const languageMenu = $("#languageMenu");
const currentLanguage = $("#currentLanguage");

const translations = {
    en: {
        login: "Login",
        dashboard: "My Dashboard",
        openAccount: "Open your account",
        lightMode: "Light Mode",
        darkMode: "Dark Mode",
        seeMore: "See More",
        seeLess: "See Less",
        qualification: "Qualification",
        experience: "Teaching Experience",
        email: "Email",
        aboutProfessor: "About the Professor",
        university: "BAHAR UNIVERSITY",
        loginSuccess: "Login successful!",
        fillFields: "Please fill in all fields.",
        invalidEmail: "Please enter a valid email address.",
        passwordLength: "Password must contain at least 6 characters.",
        storageError: "Unable to save your account. Check browser storage.",
        loginRequired: "Please log in to access your account.",
        logoutSuccess: "You have logged out successfully.",
        imageUnavailable: "Professor image unavailable",
        noPrograms: "No programs found.",
        noProfessors: "No professor information available."
    },

    fa: {
        login: "ورود",
        dashboard: "داشبورد من",
        openAccount: "مشاهده حساب کاربری",
        lightMode: "حالت روشن",
        darkMode: "حالت تاریک",
        seeMore: "استادان بیشتر",
        seeLess: "نمایش کمتر",
        qualification: "مدرک تحصیلی",
        experience: "سابقه تدریس",
        email: "ایمیل",
        aboutProfessor: "درباره استاد",
        university: "دانشگاه بهار",
        loginSuccess: "ورود موفقیت‌آمیز بود!",
        fillFields: "لطفاً تمام فیلدها را تکمیل کنید.",
        invalidEmail: "لطفاً یک ایمیل معتبر وارد کنید.",
        passwordLength: "رمز عبور باید حداقل ۶ کاراکتر باشد.",
        storageError: "ذخیره حساب انجام نشد. فضای ذخیره‌سازی مرورگر را بررسی کنید.",
        loginRequired: "برای دسترسی به حساب خود وارد شوید.",
        logoutSuccess: "با موفقیت از حساب خارج شدید.",
        imageUnavailable: "تصویر استاد در دسترس نیست",
        noPrograms: "برنامه‌ای پیدا نشد.",
        noProfessors: "اطلاعاتی درباره استاد در دسترس نیست."
    }
};

let currentLang = "en";

function t(key) {
    return translations[currentLang]?.[key]
        || translations.en[key]
        || key;
}

function setLanguage(lang, save = true) {
    currentLang = lang === "fa" ? "fa" : "en";

    document.documentElement.lang = currentLang;
    document.documentElement.dir =
        currentLang === "fa" ? "rtl" : "ltr";

    $$("[data-en][data-fa]").forEach(element => {
        const value = currentLang === "fa"
            ? element.dataset.fa
            : element.dataset.en;

        // Preserve nested icons and markup.
        if (element.children.length === 0) {
            element.textContent = value;
        } else {
            const textNode = Array.from(element.childNodes)
                .find(node => node.nodeType === Node.TEXT_NODE);

            if (textNode) {
                textNode.textContent = value;
            }
        }
    });

    $$("[data-placeholder-en][data-placeholder-fa]").forEach(input => {
        input.placeholder = currentLang === "fa"
            ? input.dataset.placeholderFa
            : input.dataset.placeholderEn;
    });

    $$("[data-title-en][data-title-fa]").forEach(element => {
        element.title = currentLang === "fa"
            ? element.dataset.titleFa
            : element.dataset.titleEn;
    });

    if (currentLanguage) {
        currentLanguage.textContent =
            currentLang === "fa" ? "دری" : "EN";
    }

    if (languageMenu) {
        $$("[data-lang]", languageMenu).forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.lang === currentLang
            );

            button.setAttribute(
                "aria-pressed",
                String(button.dataset.lang === currentLang)
            );
        });
    }

    updateLoginButton();
    updateFacultyButton();
    updateProfessorModalLanguage();

    if (save) {
        Storage.set("baharLanguage", currentLang);
    }

    document.dispatchEvent(
        new CustomEvent("bahar:languagechange", {
            detail: { language: currentLang }
        })
    );
}

languageBtn?.addEventListener("click", event => {
    event.stopPropagation();

    languageMenu?.classList.toggle("show");

    languageBtn.setAttribute(
        "aria-expanded",
        String(languageMenu?.classList.contains("show") || false)
    );
});

$$("[data-lang]").forEach(button => {
    button.addEventListener("click", event => {
        event.stopPropagation();

        setLanguage(button.dataset.lang);

        languageMenu?.classList.remove("show");
        languageBtn?.setAttribute("aria-expanded", "false");
    });
});

document.addEventListener("click", event => {
    if (
        languageMenu &&
        !languageMenu.contains(event.target) &&
        !languageBtn?.contains(event.target)
    ) {
        languageMenu.classList.remove("show");
        languageBtn?.setAttribute("aria-expanded", "false");
    }
});


/* =========================================================
   3. DARK MODE
========================================================= */

const themeBtn = $("#themeBtn");
const themeIcon = $("#themeIcon");

function setTheme(theme, save = true) {
    const isDark = theme === "dark";

    document.documentElement.classList.toggle(
        "dark-mode",
        isDark
    );

    if (themeIcon) {
        themeIcon.className = isDark
            ? "bi bi-sun"
            : "bi bi-moon-stars";
    }

    if (themeBtn) {
        themeBtn.title = isDark
            ? t("lightMode")
            : t("darkMode");

        themeBtn.setAttribute(
            "aria-label",
            themeBtn.title
        );

        themeBtn.setAttribute(
            "aria-pressed",
            String(isDark)
        );
    }

    if (save) {
        Storage.set("baharTheme", isDark ? "dark" : "light");
    }

    document.dispatchEvent(
        new CustomEvent("bahar:themechange", {
            detail: { theme: isDark ? "dark" : "light" }
        })
    );
}

themeBtn?.addEventListener("click", () => {
    const isDark = document.documentElement
        .classList.contains("dark-mode");

    setTheme(isDark ? "light" : "dark");
});


/* =========================================================
   4. LOGIN MODAL
========================================================= */

const loginBtn = $("#loginBtn");
const loginModal = $("#loginModal");
const loginClose = $("#loginClose");
const loginOverlay = $("#loginOverlay");

function openLogin() {
    if (!loginModal) return;

    loginModal.classList.add("show");
    loginModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    $("#loginEmail")?.focus();
}

function closeLogin() {
    if (!loginModal) return;

    loginModal.classList.remove("show", "active", "open");
    loginModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

loginClose?.addEventListener("click", closeLogin);
loginOverlay?.addEventListener("click", closeLogin);


/* =========================================================
   5. SHOW / HIDE PASSWORD
========================================================= */

const passwordToggle = $("#passwordToggle");
const loginPassword = $("#loginPassword");

passwordToggle?.addEventListener("click", function () {
    if (!loginPassword) return;

    const showPassword = loginPassword.type === "password";

    loginPassword.type = showPassword ? "text" : "password";

    this.innerHTML = showPassword
        ? '<i class="bi bi-eye-slash" aria-hidden="true"></i>'
        : '<i class="bi bi-eye" aria-hidden="true"></i>';

    this.setAttribute(
        "aria-label",
        showPassword ? "Hide password" : "Show password"
    );
});


/* =========================================================
   6. MOBILE NAVIGATION
========================================================= */

const hamburger = $("#hamburger");
const mainNav = $("#mainNav");

hamburger?.addEventListener("click", () => {
    if (!mainNav) return;

    const isOpen = mainNav.classList.toggle("open");
    const icon = $("i", hamburger);

    if (icon) {
        icon.className = isOpen
            ? "bi bi-x-lg"
            : "bi bi-list";
    }

    hamburger.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
});

$$("#mainNav a").forEach(link => {
    link.addEventListener("click", () => {
        mainNav?.classList.remove("open");

        const icon = hamburger?.querySelector("i");
        if (icon) icon.className = "bi bi-list";

        hamburger?.setAttribute("aria-expanded", "false");
    });
});


/* =========================================================
   7. PROGRAM SEARCH, FILTER AND LOAD MORE
========================================================= */

const searchInput = $("#programSearch");
const filterButtons = $$(".filter-btn");
const programCards = $$(".program-card");
const noResults = $("#noResults");
const loadMoreButton = $("#loadMore");

let activeFilter = "all";
let visibleLimit = 6;

function updatePrograms() {
    if (!programCards.length) return;

    const searchValue = (searchInput?.value || "")
        .toLocaleLowerCase(currentLang)
        .trim();

    const matchedCards = programCards.filter(card => {
        const category = card.dataset.category || "all";

        const searchableText = (
            (card.dataset.search || "") + " " +
            card.textContent
        ).toLocaleLowerCase(currentLang);

        const matchesSearch =
            searchableText.includes(searchValue);

        const matchesFilter =
            activeFilter === "all" ||
            category === activeFilter;

        return matchesSearch && matchesFilter;
    });

    programCards.forEach(card => {
        card.classList.add("hidden");
        card.setAttribute("aria-hidden", "true");
    });

    matchedCards.slice(0, visibleLimit).forEach(card => {
        card.classList.remove("hidden");
        card.setAttribute("aria-hidden", "false");
    });

    if (noResults) {
        noResults.classList.toggle(
            "show",
            matchedCards.length === 0
        );

        noResults.textContent = t("noPrograms");
    }

    if (loadMoreButton) {
        loadMoreButton.style.display =
            matchedCards.length > visibleLimit
                ? "inline-flex"
                : "none";
    }
}

searchInput?.addEventListener("input", () => {
    visibleLimit = 6;
    updatePrograms();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(item => {
            item.classList.remove("active");
            item.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        activeFilter = button.dataset.filter || "all";
        visibleLimit = 6;

        updatePrograms();
    });
});

loadMoreButton?.addEventListener("click", () => {
    visibleLimit += 6;
    updatePrograms();
});

document.addEventListener("bahar:languagechange", updatePrograms);


/* =========================================================
   8. LOGIN, LOCAL STORAGE, SIDEBAR AND LOGOUT
========================================================= */

(() => {
    const USER_KEY = "baharUser";

    const form = $("#loginForm");
    const message = $("#loginMessage");
    const emailInput = $("#loginEmail");
    const passwordInput = $("#loginPassword");
    const roleInput = $("#accountType");
    const remember = $("#rememberMe");

    const sidebar = $("#userSidebar");
    const backdrop = $("#sidebarBackdrop");
    const sidebarClose = $("#sidebarClose");
    const sidebarLogout = $("#sidebarLogout");
    const dashboardLogout = $("#dashboardLogout");

    const roleNames = {
        student: {
            en: "Student",
            fa: "دانشجو"
        },
        faculty: {
            en: "Faculty / Professor",
            fa: "استاد"
        },
        administrator: {
            en: "Administrator",
            fa: "مدیر"
        },
        applicant: {
            en: "Applicant",
            fa: "متقاضی"
        }
    };

    function getUser() {
        try {
            const raw = Storage.get(USER_KEY);

            if (!raw) return null;

            const user = JSON.parse(raw);

            if (
                !user ||
                user.isLoggedIn !== true ||
                typeof user.email !== "string" ||
                !roleNames[user.accountType]
            ) {
                return null;
            }

            return user;
        } catch (error) {
            console.error("Unable to read user:", error);
            return null;
        }
    }

    function showMessage(text, kind = "error") {
        if (!message) return;

        message.textContent = text;
        message.dataset.kind = kind;
        message.setAttribute("role", "status");
    }

    function updateLoginButton() {
        const user = getUser();
        const label = loginBtn?.querySelector("span");

        if (label) {
            label.textContent = user
                ? t("dashboard")
                : t("login");
        }

        if (loginBtn) {
            loginBtn.title = user
                ? t("openAccount")
                : t("login");
        }
    }

    function openSidebar() {
        const user = getUser();

        if (!user || !sidebar || !backdrop) return;

        const nameElement = $("#sidebarName");
        const emailElement = $("#sidebarEmail");
        const roleElement = $("#sidebarRole");

        if (nameElement) {
            nameElement.textContent = user.name || "University User";
        }

        if (emailElement) {
            emailElement.textContent = user.email || "";
        }

        if (roleElement) {
            const role = roleNames[user.accountType];

            roleElement.textContent = role
                ? role[currentLang]
                : "User";
        }

        sidebar.classList.add("open");
        backdrop.classList.add("show");

        sidebar.setAttribute("aria-hidden", "false");
        backdrop.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
        sidebarClose?.focus();
    }

    function closeSidebar() {
        sidebar?.classList.remove("open");
        backdrop?.classList.remove("show");

        sidebar?.setAttribute("aria-hidden", "true");
        backdrop?.setAttribute("aria-hidden", "true");

        if (!loginModal?.classList.contains("show")) {
            document.body.style.overflow = "";
        }
    }

    function clearLoginMessage() {
        if (!message) return;

        message.textContent = "";
        delete message.dataset.kind;
    }

    loginBtn?.addEventListener("click", event => {
        event.preventDefault();

        if (getUser()) {
            openSidebar();
        } else {
            openLogin();
        }
    });

    form?.addEventListener("submit", event => {
        event.preventDefault();

        const email = (emailInput?.value || "")
            .trim()
            .toLowerCase();

        const password = passwordInput?.value || "";
        const role = roleInput?.value || "";

        if (!email || !password || !role) {
            showMessage(t("fillFields"));
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage(t("invalidEmail"));
            return;
        }

        if (password.length < 6) {
            showMessage(t("passwordLength"));
            return;
        }

        if (!roleNames[role]) {
            showMessage(t("fillFields"));
            return;
        }

        const name = email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b[a-z]/g, letter => letter.toUpperCase());

        // This is a demo login, not real authentication.
        // Never store passwords in localStorage or sessionStorage.
        const user = {
            name: name || "University User",
            email,
            accountType: role,
            isLoggedIn: true,
            rememberMe: !!remember?.checked,
            loggedInAt: new Date().toISOString()
        };

        try {
            const serializedUser = JSON.stringify(user);

            if (!Storage.set(USER_KEY, serializedUser)) {
                throw new Error("Local storage is unavailable.");
            }

            const savedUser = JSON.parse(
                localStorage.getItem(USER_KEY)
            );

            if (
                !savedUser ||
                savedUser.email !== email ||
                savedUser.accountType !== role
            ) {
                throw new Error("Storage verification failed.");
            }

            if (passwordInput) {
                passwordInput.value = "";
            }

            showMessage(t("loginSuccess"), "success");

            updateLoginButton();
            closeLogin();
            openSidebar();

        } catch (error) {
            console.error("Login error:", error);
            showMessage(t("storageError"));
        }
    });

    sidebarClose?.addEventListener("click", closeSidebar);
    backdrop?.addEventListener("click", closeSidebar);

    function logoutUser(event) {
        event?.preventDefault();

        const removed = Storage.remove(USER_KEY);

        if (!removed) {
            console.error("Unable to remove saved user.");
            return;
        }

        closeSidebar();
        closeLogin();

        $("#myDashboard")?.classList.remove(
            "show",
            "active",
            "open"
        );

        form?.reset();
        clearLoginMessage();
        updateLoginButton();

        const storageMessage = $("#loginStorageMessage");

        if (storageMessage) {
            storageMessage.textContent = t("logoutSuccess");
        }

        document.dispatchEvent(
            new CustomEvent("bahar:logout")
        );
    }

    sidebarLogout?.addEventListener("click", logoutUser);
    dashboardLogout?.addEventListener("click", logoutUser);

    // Restore saved account details, if available.
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

    // Public helpers for other scripts.
    window.getBaharUser = getUser;
    window.isBaharLoggedIn = () => !!getUser();
    window.baharLogout = logoutUser;
    window.openBaharDashboard = openSidebar;

    document.addEventListener("bahar:languagechange", () => {
        updateLoginButton();

        const user = getUser();
        const roleElement = $("#sidebarRole");

        if (user && roleElement) {
            roleElement.textContent =
                roleNames[user.accountType]?.[currentLang] || "User";
        }
    });

    updateLoginButton();
})();


/* =========================================================
   9. PROFESSORS: DATA AND SEE MORE / SEE LESS
========================================================= */

const professorDetails = [
    {
        name: "Dr. Hana Rahimi",
        title: "Professor of Computer Science",
        degree: "PhD in Computer Science",
        experience: "12 years",
        email: "hana.rahimi@baharuniversity.edu",
        bio: "Specializes in computer science, software development, and modern computing technologies."
    },
    {
        name: "Dr. Arian Ahmad",
        title: "Professor of Engineering",
        degree: "PhD in Engineering",
        experience: "10 years",
        email: "arian.ahmad@baharuniversity.edu",
        bio: "Focuses on engineering education, technical problem-solving, and practical research."
    },
    {
        name: "Dr. Sara Noor",
        title: "Professor of Economics",
        degree: "PhD in Economics",
        experience: "9 years",
        email: "sara.noor@baharuniversity.edu",
        bio: "Teaches economics, financial analysis, and economic development."
    },
    {
        name: "Dr. Kian Azimi",
        title: "Professor of Business",
        degree: "PhD in Business Administration",
        experience: "11 years",
        email: "kian.azimi@baharuniversity.edu",
        bio: "Specializes in business administration, management, and organizational leadership."
    }
];

const additionalProfessors = [
    {
        name: "Dr. Maryam Ahmadi",
        title: "Professor of Information Technology",
        image: "../university2/images/teacher5.jpg",
        degree: "PhD in Information Technology",
        experience: "8 years",
        email: "maryam.ahmadi@baharuniversity.edu",
        bio: "Teaches information technology, database systems, and digital solutions."
    },
    {
        name: "Dr. Omar Khan",
        title: "Professor of Mathematics",
        image: "../university2/images/teacher6.jpg",
        degree: "PhD in Mathematics",
        experience: "10 years",
        email: "omar.khan@baharuniversity.edu",
        bio: "Focuses on applied mathematics, statistics, and analytical problem-solving."
    },
    {
        name: "Dr. Layla Noor",
        title: "Professor of Public Health",
        image: "../university2/images/teacher7.jpg",
        degree: "PhD in Public Health",
        experience: "7 years",
        email: "layla.noor@baharuniversity.edu",
        bio: "Works in public health education, community health, and health promotion."
    },
    {
        name: "Dr. Ahmad Zia",
        title: "Professor of Civil Engineering",
        image: "../university2/images/teacher8.jpg",
        degree: "PhD in Civil Engineering",
        experience: "13 years",
        email: "ahmad.zia@baharuniversity.edu",
        bio: "Specializes in civil engineering, construction, and infrastructure design."
    },
    {
        name: "Dr. Farzana Ali",
        title: "Professor of Humanities",
        image: "../university2/images/teacher9.jpg",
        degree: "PhD in Humanities",
        experience: "8 years",
        email: "farzana.ali@baharuniversity.edu",
        bio: "Focuses on humanities, communication, and academic writing."
    },
    {
        name: "Dr. Bilal Safi",
        title: "Professor of Information Systems",
        image: "../university2/images/teacher10.jpg",
        degree: "PhD in Information Systems",
        experience: "9 years",
        email: "bilal.safi@baharuniversity.edu",
        bio: "Teaches information systems, systems analysis, and digital transformation."
    },
    {
        name: "Dr. Nadia Karim",
        title: "Professor of Biology",
        image: "../university2/images/teacher11.jpg",
        degree: "PhD in Biology",
        experience: "6 years",
        email: "nadia.karim@baharuniversity.edu",
        bio: "Specializes in biology, scientific research, and laboratory education."
    },
    {
        name: "Dr. Faisal Rahman",
        title: "Professor of Finance",
        image: "../university2/images/teacher12.jpg",
        degree: "PhD in Finance",
        experience: "12 years",
        email: "faisal.rahman@baharuniversity.edu",
        bio: "Focuses on finance, investment analysis, and financial management."
    }
];

let allProfessors = [];


/* =========================================================
   10. PROFESSOR MODAL
========================================================= */

let professorModal = null;

function updateProfessorModalLanguage() {
    if (!professorModal) return;

    const labels = {
        "#professorModalLabel": "university",
        "#professorModalDegreeLabel": "qualification",
        "#professorModalExperienceLabel": "experience",
        "#professorModalEmailLabel": "email",
        "#professorModalBioLabel": "aboutProfessor"
    };

    Object.entries(labels).forEach(([selector, key]) => {
        const element = $(selector, professorModal);
        if (element) element.textContent = t(key);
    });

    const closeButton = $(
        "[data-close-professor]",
        professorModal
    );

    if (closeButton) {
        closeButton.setAttribute(
            "aria-label",
            currentLang === "fa" ? "بستن" : "Close"
        );
    }
}

function openProfessor(index) {
    const professor = allProfessors[index];

    if (!professor || !professorModal) return;

    $("#professorModalName", professorModal).textContent =
        professor.name;

    $("#professorModalTitle", professorModal).textContent =
        professor.title;

    $("#professorModalDegree", professorModal).textContent =
        professor.degree || "Not specified";

    $("#professorModalExperience", professorModal).textContent =
        professor.experience || "Not specified";

    $("#professorModalBio", professorModal).textContent =
        professor.bio || "";

    const image = $("#professorModalImage", professorModal);

    if (image) {
        image.src = professor.image || "";
        image.alt = professor.name;
        image.onerror = () => {
            image.removeAttribute("src");
            image.alt = t("imageUnavailable");
        };
    }

    const email = $("#professorModalEmail", professorModal);

    if (email) {
        email.textContent = professor.email || "";
        email.href = professor.email
            ? `mailto:${professor.email}`
            : "#";

        email.hidden = !professor.email;
    }

    professorModal.classList.add("is-open");
    professorModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("professor-modal-open");

    $("[data-close-professor]", professorModal)?.focus();
}

function closeProfessorModal() {
    if (!professorModal) return;

    professorModal.classList.remove("is-open");
    professorModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("professor-modal-open");
}


/* =========================================================
   11. INITIALIZE FACULTY
========================================================= */

function initializeFaculty() {
    const facultyGrid = $(".people-grid");

    if (!facultyGrid) return;

    // Avoid adding duplicate cards if initialization runs again.
    if (facultyGrid.dataset.initialized === "true") return;

    facultyGrid.dataset.initialized = "true";

    const existingCards = $$(".person", facultyGrid);

    // Map the existing HTML cards to the first four records.
    const originalProfessors = existingCards.map((card, index) => {
        const details = professorDetails[index] || {};

        const heading = $("h3", card);
        const description = $("p", card);
        const image = $("img", card);

        return {
            ...details,
            name: heading?.textContent.trim() || details.name || "Professor",
            title: description?.textContent.trim() || details.title || "",
            image: image?.getAttribute("src") || ""
        };
    });

    allProfessors = [
        ...originalProfessors,
        ...additionalProfessors
    ];

    // Assign stable indexes to original cards.
    existingCards.forEach((card, index) => {
        card.dataset.professor = String(index);
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-haspopup", "dialog");
    });

    // Add additional cards.
    additionalProfessors.forEach((professor, index) => {
        const professorIndex = originalProfessors.length + index;

        const card = document.createElement("article");
        card.className = "person extra-professor";
        card.dataset.professor = String(professorIndex);
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-haspopup", "dialog");

        const img = document.createElement("img");
        img.src = professor.image;
        img.alt = professor.name;
        img.loading = "lazy";

        img.addEventListener("error", () => {
            img.alt = `${professor.name} - ${t("imageUnavailable")}`;
        }, { once: true });

        const info = document.createElement("div");
        info.className = "person-info";

        const heading = document.createElement("h3");
        heading.textContent = professor.name;

        const description = document.createElement("p");
        description.textContent = professor.title;

        info.append(heading, description);
        card.append(img, info);
        facultyGrid.appendChild(card);
    });

    const extraCards = $$(".extra-professor", facultyGrid);

    // Initially hide extra cards.
    extraCards.forEach(card => {
        card.classList.remove("is-visible");
    });

    // Create the More / Less button.
    const wrapper = document.createElement("div");
    wrapper.className = "faculty-more-wrapper";

    const moreButton = document.createElement("button");
    moreButton.type = "button";
    moreButton.className = "faculty-more-btn";
    moreButton.id = "facultyMoreBtn";
    moreButton.setAttribute("aria-expanded", "false");

    wrapper.appendChild(moreButton);
    facultyGrid.insertAdjacentElement("afterend", wrapper);

    let visibleCount = 0;
    const perClick = 4;

    function updateMoreButton() {
        const allShown = visibleCount >= extraCards.length;

        moreButton.textContent = allShown
            ? t("seeLess")
            : t("seeMore");

        moreButton.setAttribute(
            "aria-expanded",
            String(visibleCount > 0)
        );

        moreButton.style.display =
            extraCards.length === 0 ? "none" : "inline-flex";
    }

    moreButton.addEventListener("click", () => {
        if (visibleCount >= extraCards.length) {
            visibleCount = 0;

            extraCards.forEach(card => {
                card.classList.remove("is-visible");
            });

            updateMoreButton();
            return;
        }

        const nextLimit = Math.min(
            visibleCount + perClick,
            extraCards.length
        );

        for (let i = visibleCount; i < nextLimit; i++) {
            extraCards[i].classList.add("is-visible");
        }

        visibleCount = nextLimit;
        updateMoreButton();
    });

    // Create the details modal.
    professorModal = document.createElement("div");
    professorModal.className = "professor-modal";
    professorModal.id = "professorModal";
    professorModal.setAttribute("aria-hidden", "true");

    const modalDialog = document.createElement("div");
    modalDialog.className = "professor-modal-dialog";
    modalDialog.setAttribute("role", "dialog");
    modalDialog.setAttribute("aria-modal", "true");
    modalDialog.setAttribute("aria-labelledby", "professorModalName");

    const modalBackdrop = document.createElement("div");
    modalBackdrop.className = "professor-modal-backdrop";
    modalBackdrop.dataset.closeProfessor = "";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "professor-modal-close";
    closeButton.dataset.closeProfessor = "";
    closeButton.innerHTML = "&times;";

    const image = document.createElement("img");
    image.className = "professor-modal-image";
    image.id = "professorModalImage";
    image.alt = "";

    const content = document.createElement("div");
    content.className = "professor-modal-content";

    const universityLabel = document.createElement("span");
    universityLabel.className = "professor-modal-label";
    universityLabel.id = "professorModalLabel";

    const name = document.createElement("h2");
    name.id = "professorModalName";

    const title = document.createElement("p");
    title.id = "professorModalTitle";
    title.className = "professor-modal-title";

    function createDetailRow(labelId, valueId) {
        const row = document.createElement("div");
        row.className = "professor-detail-row";

        const label = document.createElement("strong");
        label.id = labelId;

        const value = document.createElement("span");
        value.id = valueId;

        row.append(label, value);
        return row;
    }

    const degreeRow = createDetailRow(
        "professorModalDegreeLabel",
        "professorModalDegree"
    );

    const experienceRow = createDetailRow(
        "professorModalExperienceLabel",
        "professorModalExperience"
    );

    const emailRow = document.createElement("div");
    emailRow.className = "professor-detail-row";

    const emailLabel = document.createElement("strong");
    emailLabel.id = "professorModalEmailLabel";

    const email = document.createElement("a");
    email.id = "professorModalEmail";

    emailRow.append(emailLabel, email);

    const bio = document.createElement("div");
    bio.className = "professor-bio";

    const bioHeading = document.createElement("h3");
    bioHeading.id = "professorModalBioLabel";

    const bioText = document.createElement("p");
    bioText.id = "professorModalBio";

    bio.append(bioHeading, bioText);

    content.append(
        universityLabel,
        name,
        title,
        degreeRow,
        experienceRow,
        emailRow,
        bio
    );

    modalDialog.append(closeButton, image, content);
    professorModal.append(modalBackdrop, modalDialog);
    document.body.appendChild(professorModal);

    updateProfessorModalLanguage();

    // Click on a professor card.
    facultyGrid.addEventListener("click", event => {
        const card = event.target.closest(".person");

        if (!card || !facultyGrid.contains(card)) return;

        openProfessor(Number(card.dataset.professor));
    });

    // Keyboard support.
    facultyGrid.addEventListener("keydown", event => {
        const card = event.target.closest(".person");

        if (!card || !facultyGrid.contains(card)) return;

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProfessor(Number(card.dataset.professor));
        }
    });

    professorModal.addEventListener("click", event => {
        if (event.target.closest("[data-close-professor]")) {
            closeProfessorModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            professorModal?.classList.contains("is-open")
        ) {
            closeProfessorModal();
        }
    });

    updateMoreButton();
}

function updateFacultyButton() {
    const button = $("#facultyMoreBtn");

    if (!button) return;

    // Preserve the button's current More / Less state.
    const expanded = button.getAttribute("aria-expanded") === "true";

    button.textContent = expanded
        ? t("seeLess")
        : t("seeMore");
}

document.addEventListener("bahar:languagechange", () => {
    updateFacultyButton();
    updateProfessorModalLanguage();
});


/* =========================================================
   12. RESTORE SETTINGS AND START THE WEBSITE
========================================================= */

function initializeBaharUniversity() {
    const savedLanguage = Storage.get("baharLanguage", "en");
    const savedTheme = Storage.get("baharTheme", "light");

    setLanguage(savedLanguage, false);
    setTheme(savedTheme, false);

    updatePrograms();
    initializeFaculty();
}

// Run after the HTML has been parsed.
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeBaharUniversity,
        { once: true }
    );
} else {
    initializeBaharUniversity();
}
