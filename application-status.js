//javascript//
document.addEventListener("DOMContentLoaded", function () {
    const STORAGE_KEY = "baharApplications";

    const form = document.getElementById("statusLookupForm");
    const referenceInput = document.getElementById("referenceInput");
    const emailInput = document.getElementById("emailInput");
    const message = document.getElementById("lookupMessage");
    const resultCard = document.getElementById("statusResult");

    if (!form) {
        console.error("Status form not found. Check application-status.html");
        return;
    }

    function getApplications() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Could not read localStorage:", error);
            return [];
        }
    }

    function getValue(application, keys, fallback = "Not available") {
        for (const key of keys) {
            if (application[key] !== undefined &&
                application[key] !== null &&
                String(application[key]).trim() !== "") {
                return application[key];
            }
        }
        return fallback;
    }

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "status-feedback " + (type || "");
    }

    function formatDate(value) {
        if (!value) return "Not available";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        return date.toLocaleDateString("en", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }

    function displayApplication(app) {
        const name = getValue(
            app, ["fullName", "name", "appFullName", "applicantName"], "Applicant"
        );

        const email = getValue(app, ["email", "appEmail"]);
        const reference = getValue(
            app,
            ["reference", "referenceNumber", "applicationReference",
             "applicationId", "trackingNumber"]
        );

        const program = getValue(app, ["program", "selectedProgram", "appProgram"]);
        const term = getValue(app, ["term", "intake", "appTerm", "semester"]);
        const country = getValue(app, ["country", "appCountry"]);
        const date = getValue(
            app,
            ["submittedAt", "submissionDate", "createdAt", "dateSubmitted", "date"],
            ""
        );

        const rawStatus = String(app.status || "Submitted").toLowerCase();
        let status = "Submitted";

        if (["under review", "under_review", "under-review", "review"].includes(rawStatus)) {
            status = "Under Review";
        } else if (["accepted", "approved"].includes(rawStatus)) {
            status = "Accepted";
        } else if (["rejected", "declined"].includes(rawStatus)) {
            status = "Rejected";
        }

        document.getElementById("resultGreeting").textContent = "Hello, " + name;
        document.getElementById("resultReference").textContent = "Reference: " + reference;
        document.getElementById("resultName").textContent = name;
        document.getElementById("resultEmail").textContent = email;
        document.getElementById("resultProgram").textContent = program;
        document.getElementById("resultTerm").textContent = term;
        document.getElementById("resultCountry").textContent = country;
        document.getElementById("resultDate").textContent = formatDate(date);

        const badge = document.getElementById("statusBadge");
        badge.textContent = status;
        badge.dataset.status = status.toLowerCase();

        const explanations = {
            "Submitted": "Your application has been received and is waiting for review.",
            "Under Review": "Your application is currently being reviewed by the admissions team.",
            "Accepted": "Your application is marked as accepted. Follow the university's official instructions.",
            "Rejected": "A decision has been recorded. Contact the admissions office if you need clarification."
        };

        const nextSteps = {
            "Submitted": "Keep your reference number and check your email regularly.",
            "Under Review": "Check your email for requests for additional documents or information.",
            "Accepted": "Review your official admission letter and follow the enrollment instructions.",
            "Rejected": "Contact the admissions office for clarification about the decision."
        };

        document.getElementById("statusExplanation").textContent = explanations[status];
        document.getElementById("nextStepTitle").textContent = "What happens next?";
        document.getElementById("nextStepText").textContent = nextSteps[status];

        const track = document.getElementById("progressTrack");
        track.dataset.stage =
            status === "Under Review" ? "review" :
            ["Accepted", "Rejected"].includes(status) ? "decision" : "submitted";

        track.querySelectorAll(".status-progress-step").forEach(step => {
            step.classList.remove("is-complete", "is-current");
        });

        const submitted = track.querySelector('[data-step="submitted"]');
        const review = track.querySelector('[data-step="review"]');
        const decision = track.querySelector('[data-step="decision"]');
        const lines = track.querySelectorAll(".status-progress-line");

        submitted.classList.add("is-complete");

        if (status === "Submitted") {
            submitted.classList.add("is-current");
        } else if (status === "Under Review") {
            review.classList.add("is-current");
            lines[0].classList.add("is-complete");
        } else {
            review.classList.add("is-complete");
            decision.classList.add("is-current");
            lines.forEach(line => line.classList.add("is-complete"));
        }

        const decisionIcon = decision.querySelector(".status-step-dot");
        decisionIcon.innerHTML = status === "Accepted"
            ? '<i class="bi bi-check-lg"></i>'
            : status === "Rejected"
                ? '<i class="bi bi-x-lg"></i>'
                : '<i class="bi bi-mortarboard"></i>';

        resultCard.hidden = false;
        showMessage("Application found successfully.", "success");
        resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        resultCard.hidden = true;

        const reference = referenceInput.value.trim().toLowerCase();
        const email = emailInput.value.trim().toLowerCase();

        if (!reference || !email) {
            showMessage("Please enter your reference number and email.", "error");
            return;
        }

        const applications = getApplications();

        const application = applications.find(app => {
            const savedReference = getValue(
                app,
                ["reference", "referenceNumber", "applicationReference",
                 "applicationId", "trackingNumber"],
                ""
            ).toString().trim().toLowerCase();

            const savedEmail = getValue(app, ["email", "appEmail"], "")
                .toString().trim().toLowerCase();

            return savedReference === reference && savedEmail === email;
        });

        if (!application) {
            showMessage(
                "Application not found. Check your reference number and email, and make sure you are using the same browser where you submitted the form.",
                "error"
            );
            return;
        }

        displayApplication(application);
    });

    const printButton = document.getElementById("printStatusButton");
    if (printButton) {
        printButton.addEventListener("click", function () {
            window.print();
        });
    }

    const year = document.getElementById("currentYear");
    if (year) year.textContent = new Date().getFullYear();
});

