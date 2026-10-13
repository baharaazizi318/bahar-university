
/* ==========================================
   BAHAR UNIVERSITY - ACADEMIC EXPLORER
   Search, Filters, Sorting and Program Details
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector) => document.querySelector(selector);

    // HTML elements
    const filters = $("#academicFilters");
    const cards = $("#academicCards");
    const search = $("#academicSearch");
    const clearButton = $("#clearAcademicSearch");
    const sort = $("#academicSort");

    const resultsTitle = $("#academicResultsTitle");
    const summary = $("#academicResultSummary");
    const activeFilters = $("#academicActiveFilters");
    const emptyState = $("#academicEmptyState");
    const resetButton = $("#resetAcademicSearch");

    const details = $("#schoolDetails");
    const detailsTitle = $("#detailsTitle");
    const detailsDescription = $("#detailsDescription");
    const detailsStats = $("#detailsStats");
    const detailsPrograms = $("#detailsPrograms");
    const programDetail = $("#programDetail");
    const closeDetails = $("#closeSchoolDetails");

    // Stop if essential HTML elements are missing
    if (!filters || !cards || !search) {
        console.error(
            "Academic Explorer: academicFilters, academicCards, or academicSearch is missing."
        );
        return;
    }

    // Academic data
    const schools = [
        {
            id: "computing",
            name: "School of Computing",
            icon: "⌘",
            category: "Computing",
            description: "Study programming, software development, information technology and modern digital systems.",
            keywords: ["computer", "technology", "IT", "software", "coding", "programming", "data", "AI", "cybersecurity", "web"],
            careers: ["Software Developer", "Data Analyst", "IT Specialist"],
            programs: [
                {
                    name: "Computer Science",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Learn programming, algorithms, databases and computer systems.",
                    subjects: ["Programming", "Algorithms", "Databases", "Operating Systems"],
                    careers: ["Software Developer", "Systems Analyst"],
                    keywords: ["coding", "computer", "software"]
                },
                {
                    name: "Software Engineering",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Learn to design, build, test and maintain software applications.",
                    subjects: ["Software Design", "Testing", "Web Development"],
                    careers: ["Software Engineer", "Web Developer"],
                    keywords: ["coding", "applications", "development"]
                },
                {
                    name: "Information Technology",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Explore networks, computer systems, technical support and IT infrastructure.",
                    subjects: ["Networking", "IT Infrastructure", "Cloud Systems"],
                    careers: ["IT Specialist", "Systems Administrator"],
                    keywords: ["network", "technical", "computer"]
                },
                {
                    name: "Cybersecurity",
                    level: "Program pathway varies",
                    duration: "Varies by program",
                    description: "Study digital security, cyber threats and ways to protect computer systems.",
                    subjects: ["Network Security", "Digital Forensics", "Secure Systems"],
                    careers: ["Security Analyst", "Security Consultant"],
                    keywords: ["security", "privacy", "protection"]
                },
                {
                    name: "Data Science",
                    level: "Program pathway varies",
                    duration: "Varies by program",
                    description: "Use programming and statistics to analyze data and discover patterns.",
                    subjects: ["Statistics", "Data Analysis", "Machine Learning"],
                    careers: ["Data Analyst", "Data Scientist"],
                    keywords: ["data", "statistics", "analytics"]
                },
                {
                    name: "Artificial Intelligence",
                    level: "Program pathway varies",
                    duration: "Varies by program",
                    description: "Explore intelligent systems, machine learning and AI applications.",
                    subjects: ["Machine Learning", "Algorithms", "AI Ethics"],
                    careers: ["AI Developer", "Machine Learning Engineer"],
                    keywords: ["AI", "automation", "intelligence"]
                },
                {
                    name: "Web Development",
                    level: "Certificate or degree",
                    duration: "Varies by program",
                    description: "Learn to build websites and web applications.",
                    subjects: ["HTML", "CSS", "JavaScript", "Web APIs"],
                    careers: ["Front-End Developer", "Back-End Developer"],
                    keywords: ["HTML", "CSS", "JavaScript", "website"]
                }
            ]
        },
        {
            id: "engineering",
            name: "School of Engineering",
            icon: "⚙",
            category: "Engineering",
            description: "Explore engineering, technical design, construction and practical problem-solving.",
            keywords: ["engineering", "construction", "buildings", "machines", "electricity", "energy", "design"],
            careers: ["Engineer", "Technical Designer", "Project Engineer"],
            programs: [
                {
                    name: "Civil Engineering",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Study the design and construction of roads, buildings, bridges and infrastructure.",
                    subjects: ["Structures", "Construction", "Geotechnics"],
                    careers: ["Civil Engineer", "Site Engineer"],
                    keywords: ["construction", "bridges", "buildings"]
                },
                {
                    name: "Electrical Engineering",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Explore electrical circuits, power systems and electronics.",
                    subjects: ["Circuits", "Power Systems", "Electronics"],
                    careers: ["Electrical Engineer", "Power Engineer"],
                    keywords: ["electricity", "energy", "circuits"]
                },
                {
                    name: "Mechanical Engineering",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Study machines, mechanics, materials and manufacturing.",
                    subjects: ["Mechanics", "Materials", "Thermodynamics"],
                    careers: ["Mechanical Engineer", "Design Engineer"],
                    keywords: ["machines", "mechanics", "manufacturing"]
                },
                {
                    name: "Computer Engineering",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Combine computer hardware, electronics and programming.",
                    subjects: ["Hardware", "Programming", "Embedded Systems"],
                    careers: ["Computer Engineer", "Hardware Engineer"],
                    keywords: ["computer", "hardware", "electronics"]
                }
            ]
        },
        {
            id: "business",
            name: "School of Business",
            icon: "▤",
            category: "Business",
            description: "Develop knowledge of management, finance, marketing and entrepreneurship.",
            keywords: ["business", "management", "leadership", "finance", "accounting", "marketing", "entrepreneurship"],
            careers: ["Business Analyst", "Manager", "Entrepreneur"],
            programs: [
                {
                    name: "Business Administration",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Build knowledge of management, operations, strategy and leadership.",
                    subjects: ["Management", "Strategy", "Finance"],
                    careers: ["Business Administrator", "Manager"],
                    keywords: ["business", "leadership", "management"]
                },
                {
                    name: "Accounting",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Learn financial reporting, budgeting and accounting principles.",
                    subjects: ["Financial Accounting", "Auditing", "Reporting"],
                    careers: ["Accountant", "Audit Assistant"],
                    keywords: ["finance", "accounts", "numbers"]
                },
                {
                    name: "Finance",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Explore investments, financial markets and risk management.",
                    subjects: ["Investments", "Financial Analysis", "Risk"],
                    careers: ["Financial Analyst", "Banking Associate"],
                    keywords: ["money", "banking", "investment"]
                },
                {
                    name: "Marketing",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Study branding, digital marketing and consumer behavior.",
                    subjects: ["Branding", "Digital Marketing", "Market Research"],
                    careers: ["Marketing Specialist", "Brand Coordinator"],
                    keywords: ["advertising", "branding", "social media"]
                }
            ]
        },
        {
            id: "health",
            name: "School of Health",
            icon: "✚",
            category: "Health",
            description: "Explore health sciences, public health and community wellbeing.",
            keywords: ["health", "medical", "medicine", "nursing", "public health", "nutrition", "laboratory"],
            careers: ["Public Health Assistant", "Research Assistant", "Community Health Worker"],
            programs: [
                {
                    name: "Public Health",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Study disease prevention, health promotion and community health.",
                    subjects: ["Epidemiology", "Health Promotion", "Biostatistics"],
                    careers: ["Public Health Officer", "Research Assistant"],
                    keywords: ["community", "prevention", "health policy"]
                },
                {
                    name: "Nursing",
                    level: "Professional degree pathway",
                    duration: "Varies by country",
                    description: "Learn about patient care, clinical practice and health assessment.",
                    subjects: ["Patient Care", "Anatomy", "Clinical Practice"],
                    careers: ["Nurse", "Community Nurse"],
                    keywords: ["patient", "hospital", "clinical"]
                },
                {
                    name: "Nutrition and Dietetics",
                    level: "Program pathway varies",
                    duration: "Varies by qualification",
                    description: "Explore nutrition science, food systems and dietary assessment.",
                    subjects: ["Human Nutrition", "Food Science", "Public Health"],
                    careers: ["Nutrition Assistant", "Researcher"],
                    keywords: ["food", "diet", "nutrition"]
                }
            ]
        },
        {
            id: "humanities",
            name: "School of Humanities",
            icon: "✎",
            category: "Humanities",
            description: "Develop communication, creative thinking and an understanding of people and society.",
            keywords: ["humanities", "media", "communication", "language", "literature", "history", "psychology", "education", "design"],
            careers: ["Writer", "Communications Specialist", "Educator"],
            programs: [
                {
                    name: "Media and Communication",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Explore media production, digital content and communication strategies.",
                    subjects: ["Media Studies", "Writing", "Digital Content"],
                    careers: ["Communications Officer", "Content Producer"],
                    keywords: ["media", "content", "writing"]
                },
                {
                    name: "Psychology",
                    level: "Program pathway varies",
                    duration: "Varies by country",
                    description: "Explore human behavior, cognition and research methods.",
                    subjects: ["Cognition", "Development", "Research Methods"],
                    careers: ["Research Assistant", "Community Support Worker"],
                    keywords: ["behavior", "mind", "people"]
                },
                {
                    name: "Education",
                    level: "Bachelor's Degree",
                    duration: "Varies by country",
                    description: "Study teaching methods, learning theory and curriculum design.",
                    subjects: ["Learning Theory", "Curriculum", "Assessment"],
                    careers: ["Educator", "Education Coordinator"],
                    keywords: ["teaching", "school", "learning"]
                },
                {
                    name: "Graphic Design",
                    level: "Bachelor's degree or diploma",
                    duration: "Varies by program",
                    description: "Develop visual communication, typography and digital design skills.",
                    subjects: ["Typography", "Visual Design", "Illustration"],
                    careers: ["Graphic Designer", "Brand Designer"],
                    keywords: ["design", "creative", "visual"]
                }
            ]
        },
        {
            id: "economics",
            name: "School of Economics",
            icon: "↗",
            category: "Economics",
            description: "Understand markets, economic policy, statistics and financial systems.",
            keywords: ["economics", "markets", "statistics", "policy", "trade", "development", "banking", "finance"],
            careers: ["Economic Analyst", "Policy Researcher", "Market Analyst"],
            programs: [
                {
                    name: "Economics",
                    level: "Bachelor's Degree",
                    duration: "Typically 4 years",
                    description: "Study how people, businesses and governments make economic decisions.",
                    subjects: ["Microeconomics", "Macroeconomics", "Statistics"],
                    careers: ["Economic Analyst", "Policy Analyst"],
                    keywords: ["markets", "policy", "statistics"]
                },
                {
                    name: "Development Economics",
                    level: "Program pathway varies",
                    duration: "Varies by program",
                    description: "Explore economic growth, development policy and poverty reduction.",
                    subjects: ["Development Policy", "Economic Growth", "Research Methods"],
                    careers: ["Development Analyst", "Research Assistant"],
                    keywords: ["development", "growth", "poverty"]
                },
                {
                    name: "Banking and Financial Services",
                    level: "Program pathway varies",
                    duration: "Varies by program",
                    description: "Explore banking operations, financial services and financial markets.",
                    subjects: ["Banking", "Risk", "Financial Markets"],
                    careers: ["Banking Associate", "Credit Analyst"],
                    keywords: ["bank", "credit", "finance", "money"]
                }
            ]
        }
    ];

    const categoryNames = {
        all: "All Schools",
        computing: "Computing",
        engineering: "Engineering",
        business: "Business",
        health: "Health",
        humanities: "Humanities",
        economics: "Economics"
    };

    const categoryIcons = {
        all: "▦",
        computing: "⌘",
        engineering: "⚙",
        business: "▤",
        health: "✚",
        humanities: "✎",
        economics: "↗"
    };

    const state = {
        category: "all",
        query: "",
        sort: "featured",
        selectedSchool: null
    };

    function normalize(value) {
        return String(value ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, " ")
            .trim()
            .replace(/\s+/g, " ");
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function getAllPrograms() {
        return schools.flatMap(school =>
            school.programs.map(program => ({
                ...program,
                schoolId: school.id,
                schoolName: school.name,
                category: school.category
            }))
        );
    }

    function schoolSearchText(school) {
        return normalize([
            school.name,
            school.category,
            school.description,
            ...school.keywords,
            ...school.careers,
            ...school.programs.flatMap(program => [
                program.name,
                program.level,
                program.duration,
                program.description,
                ...program.subjects,
                ...program.careers,
                ...program.keywords
            ])
        ].join(" "));
    }

    function getVisibleSchools() {
        const query = normalize(state.query);

        let result = schools.filter(school => {
            const matchesCategory =
                state.category === "all" ||
                school.id === state.category;

            const matchesSearch =
                !query || schoolSearchText(school).includes(query);

            return matchesCategory && matchesSearch;
        });

        if (state.sort === "name") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (state.sort === "programs") {
            result.sort((a, b) => b.programs.length - a.programs.length);
        }

        return result;
    }

    function renderFilters() {
        filters.innerHTML = Object.entries(categoryNames).map(([id, name]) => {
            const count = id === "all"
                ? schools.length
                : schools.filter(school => school.id === id).length;

            const active = state.category === id;

            return `
                <button
                    type="button"
                    class="academic-filter ${active ? "active" : ""}"
                    data-category="${id}"
                    aria-pressed="${active}"
                >
                    <span>${categoryIcons[id]} ${name}</span>
                    <span class="filter-count">${count}</span>
                </button>
            `;
        }).join("");
    }

    function renderActiveFilters() {
        if (!activeFilters) return;

        const tags = [];

        if (state.category !== "all") {
            tags.push(categoryNames[state.category]);
        }

        if (state.query.trim()) {
            tags.push(`Search: ${state.query.trim()}`);
        }

        activeFilters.innerHTML = tags.map(tag =>
            `<span class="active-filter-tag">${escapeHTML(tag)}</span>`
        ).join("");
    }

    function renderCards() {
        const visibleSchools = getVisibleSchools();

        if (resultsTitle) {
            resultsTitle.textContent = state.category === "all"
                ? "Explore All Schools"
                : categoryNames[state.category] || "Explore Schools";
        }

        const totalPrograms = visibleSchools.reduce(
            (total, school) => total + school.programs.length,
            0
        );

        if (summary) {
            summary.textContent =
                `${visibleSchools.length} ${visibleSchools.length === 1 ? "school" : "schools"} found · ` +
                `${totalPrograms} listed programs`;
        }

        if (emptyState) {
            emptyState.hidden = visibleSchools.length > 0;
        }

        cards.hidden = visibleSchools.length === 0;

        cards.innerHTML = visibleSchools.map((school, index) => `
            <article class="academic-school-card">
                <div class="school-card-top">
                    <div class="school-card-icon" aria-hidden="true">
                        ${school.icon}
                    </div>
                    <span class="school-card-label">
                        SCHOOL ${String(index + 1).padStart(2, "0")}
                    </span>
                </div>

                <h3 class="school-card-title">${escapeHTML(school.name)}</h3>

                <p class="school-card-description">
                    ${escapeHTML(school.description)}
                </p>

                <div class="school-card-meta">
                    <span>${school.programs.length} listed programs</span>
                    <span>${escapeHTML(school.category)}</span>
                </div>

                <div class="school-card-action">
                    <button
                        type="button"
                        data-open-school="${school.id}"
                    >
                        Explore School &amp; Programs →
                    </button>
                </div>
            </article>
        `).join("");

        renderActiveFilters();
        renderFilters();
    }

    function showProgram(program, activeButton) {
        if (!programDetail || !detailsPrograms) return;

        detailsPrograms.querySelectorAll(".details-program-button")
            .forEach(button => button.classList.remove("active"));

        activeButton?.classList.add("active");

        programDetail.innerHTML = `
            <span class="academic-eyebrow">PROGRAM OVERVIEW</span>
            <h3>${escapeHTML(program.name)}</h3>
            <span class="program-level">${escapeHTML(program.level)}</span>

            <p>${escapeHTML(program.description)}</p>

            <h4>Typical Duration</h4>
            <p>${escapeHTML(program.duration)}</p>

            <h4>Key Subjects</h4>
            <ul>
                ${program.subjects.map(subject =>
                    `<li>${escapeHTML(subject)}</li>`
                ).join("")}
            </ul>

            <h4>Possible Career Paths</h4>
            <ul>
                ${program.careers.map(career =>
                    `<li>${escapeHTML(career)}</li>`
                ).join("")}
            </ul>

            <p class="details-hint">
                Program availability, duration and professional requirements
                must be confirmed with the university.
            </p>
        `;
    }

    function openSchool(schoolId) {
        const school = schools.find(item => item.id === schoolId);

        if (!school || !details || !detailsPrograms) return;

        state.selectedSchool = schoolId;

        if (detailsTitle) detailsTitle.textContent = school.name;

        if (detailsDescription) {
            detailsDescription.textContent = school.description;
        }

        if (detailsStats) {
            detailsStats.innerHTML = `
                <div class="detail-stat">
                    <strong>${school.programs.length}</strong>
                    <span>Listed programs</span>
                </div>
                <div class="detail-stat">
                    <strong>${school.careers.length}</strong>
                    <span>Example career paths</span>
                </div>
                <div class="detail-stat">
                    <strong>${escapeHTML(school.category)}</strong>
                    <span>Academic field</span>
                </div>
            `;
        }

        detailsPrograms.innerHTML = school.programs.map((program, index) => `
            <button
                type="button"
                class="details-program-button ${index === 0 ? "active" : ""}"
                data-program-index="${index}"
            >
                <span>
                    <strong>${escapeHTML(program.name)}</strong>
                    <small>
                        ${escapeHTML(program.level)} · ${escapeHTML(program.duration)}
                    </small>
                </span>
                <span aria-hidden="true">→</span>
            </button>
        `).join("");

        details.hidden = false;
        showProgram(school.programs[0], detailsPrograms.querySelector("button"));

        details.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function resetSearch() {
        state.category = "all";
        state.query = "";
        state.sort = "featured";

        search.value = "";

        if (sort) sort.value = "featured";

        renderCards();
    }

    // Search input
    search.addEventListener("input", () => {
        state.query = search.value;
        renderCards();
    });

    // Clear search
    clearButton?.addEventListener("click", () => {
        search.value = "";
        state.query = "";
        renderCards();
        search.focus();
    });

    // School category filters
    filters.addEventListener("click", event => {
        const button = event.target.closest("[data-category]");
        if (!button || !filters.contains(button)) return;

        state.category = button.dataset.category || "all";
        renderCards();
    });

    // Sort results
    sort?.addEventListener("change", () => {
        state.sort = sort.value;
        renderCards();
    });

    // Open school details
    cards.addEventListener("click", event => {
        const button = event.target.closest("[data-open-school]");
        if (!button) return;

        openSchool(button.dataset.openSchool);
    });

    // Select a program
    detailsPrograms?.addEventListener("click", event => {
        const button = event.target.closest("[data-program-index]");
        if (!button || !state.selectedSchool) return;

        const school = schools.find(
            item => item.id === state.selectedSchool
        );

        if (!school) return;

        const index = Number(button.dataset.programIndex);
        const program = school.programs[index];

        if (program) showProgram(program, button);
    });

    // Search suggestions, if present in HTML
    document.querySelectorAll("[data-search-term]").forEach(button => {
        button.addEventListener("click", () => {
            search.value = button.dataset.searchTerm || "";
            state.query = search.value;
            renderCards();
            search.focus();
        });
    });

    // Reset all filters
    resetButton?.addEventListener("click", resetSearch);

    // Close school details
    closeDetails?.addEventListener("click", () => {
        if (details) details.hidden = true;
        state.selectedSchool = null;
    });

    // Initial display
    renderCards();

    // Log sample program count if needed for debugging
    console.info(
        `Academic Explorer ready: ${getAllPrograms().length} sample programs.`
    );
});