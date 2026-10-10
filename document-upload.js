
/* =========================================
   BAHAR UNIVERSITY
   DOCUMENT UPLOAD SYSTEM
   LocalStorage Demo
========================================= */

(() => {
    "use strict";

    const STORAGE_KEY = "baharDocuments";
    const APPLICATION_KEY = "baharApplications";

    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    const ALLOWED_TYPES = [
        "application/pdf",
        "image/jpeg",
        "image/png"
    ];

    const ALLOWED_EXTENSIONS = [
        "pdf",
        "jpg",
        "jpeg",
        "png"
    ];

    const DOCUMENT_LABELS = {
        identity: "Passport or National ID",
        transcript: "Academic Transcripts",
        certificate: "Graduation Certificate",
        english: "English Proficiency",
        cv: "CV or Resume",
        other: "Additional Document"
    };

    const REQUIRED_DOCUMENTS = [
        "identity",
        "transcript",
        "certificate"
    ];

    const selectedFiles = {};

    const form = document.getElementById("documentUploadForm");
    const referenceInput = document.getElementById("applicationReference");
    const emailInput = document.getElementById("applicantEmail");
    const confirmation = document.getElementById("confirmAccuracy");
    const message = document.getElementById("formMessage");
    const uploadedCount = document.getElementById("uploadedCount");
    const applicationMatch = document.getElementById("applicationMatch");

    const savedPanel = document.getElementById("savedDocumentsPanel");
    const savedList = document.getElementById("savedDocumentsList");

    if (!form || !referenceInput || !emailInput) {
        console.error(
            "Document Upload: Required HTML elements were not found."
        );
        return;
    }

    // =========================================
    // LOCAL STORAGE HELPERS
    // =========================================

    function readStorage(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Could not read localStorage:", error);
            return [];
        }
    }

    function writeStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function getReference() {
        return referenceInput.value.trim().toUpperCase();
    }

    function getEmail() {
        return emailInput.value.trim().toLowerCase();
    }

    function showMessage(text, type = "") {
        message.textContent = text;
        message.className = "du-message";

        if (type) {
            message.classList.add(type);
        }
    }

    function getExtension(filename) {
        const parts = filename.toLowerCase().split(".");

        return parts.length > 1 ? parts.pop() : "";
    }

    function formatSize(bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        }

        return Math.round(bytes / 1024) + " KB";
    }

    // =========================================
    // FILE VALIDATION
    // =========================================

    function validateFile(file) {
        if (!file) {
            return "Please select a file.";
        }

        const extension = getExtension(file.name);

        if (
            !ALLOWED_TYPES.includes(file.type) &&
            !ALLOWED_EXTENSIONS.includes(extension)
        ) {
            return "Only PDF, JPG and PNG files are accepted.";
        }

        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return "The file extension is not supported.";
        }

        if (file.size > MAX_FILE_SIZE) {
            return "File size must not exceed 2 MB.";
        }

        if (file.size === 0) {
            return "The selected file is empty.";
        }

        return "";
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);

            reader.onerror = () => {
                reject(new Error("Unable to read the selected file."));
            };

            reader.readAsDataURL(file);
        });
    }

    // =========================================
    // FIND SAVED DOCUMENT RECORD
    // =========================================

    function findDocumentRecord(reference, email) {
        return readStorage(STORAGE_KEY).find(record => {
            return (
                String(record.reference || "").toUpperCase() === reference &&
                String(record.email || "").toLowerCase() === email
            );
        });
    }

    function findApplication() {
        const reference = getReference();
        const email = getEmail();

        if (!reference) {
            if (applicationMatch) {
                applicationMatch.hidden = true;
            }

            return;
        }

        const applications = readStorage(APPLICATION_KEY);

        const application = applications.find(app => {
            const appReference = String(
                app.reference ||
                app.referenceNumber ||
                app.applicationReference ||
                app.applicationId ||
                app.trackingNumber ||
                ""
            ).trim().toUpperCase();

            const appEmail = String(
                app.email ||
                app.appEmail ||
                app.applicantEmail ||
                ""
            ).trim().toLowerCase();

            return (
                appReference === reference &&
                (!email || !appEmail || appEmail === email)
            );
        });

        if (application && applicationMatch) {
            const name =
                application.fullName ||
                application.name ||
                application.applicantName ||
                "";

            applicationMatch.textContent =
                "Application record found" +
                (name ? " for " + name : "") +
                ".";

            applicationMatch.hidden = false;
        } else if (applicationMatch) {
            applicationMatch.hidden = true;
        }
    }

    // =========================================
    // CHECKLIST
    // =========================================

    function updateChecklist() {
        updateCheck("reference", Boolean(getReference()));

        updateCheck(
            "email",
            Boolean(getEmail()) && emailInput.validity.valid
        );

        updateCheck("confirm", confirmation.checked);

        const record = findDocumentRecord(
            getReference(),
            getEmail()
        );

        const savedDocuments = record?.documents || [];

        REQUIRED_DOCUMENTS.forEach(kind => {
            const alreadySaved = savedDocuments.some(
                document => document.kind === kind
            );

            updateCheck(
                kind,
                Boolean(selectedFiles[kind]) || alreadySaved
            );
        });

        uploadedCount.textContent = Object.keys(selectedFiles).length;
    }

    function updateCheck(name, completed) {
        const item = document.getElementById("check-" + name);

        if (!item) return;

        item.classList.toggle("is-done", completed);

        const icon = item.querySelector("i");

        if (icon) {
            icon.className = completed
                ? "bi bi-check-circle-fill"
                : "bi bi-circle";
        }
    }

    function updateFileStatus(kind, text, state = "") {
        const status = document.getElementById("status-" + kind);

        if (!status) return;

        status.textContent = text;
        status.className = "du-status";

        if (state) {
            status.classList.add(state);
        }
    }

    // =========================================
    // DISPLAY SAVED DOCUMENTS
    // =========================================

    function renderSavedDocuments() {
        if (!savedPanel || !savedList) return;

        const reference = getReference();
        const email = getEmail();

        const record = findDocumentRecord(reference, email);

        savedList.replaceChildren();

        if (
            !reference ||
            !email ||
            !record ||
            !Array.isArray(record.documents) ||
            record.documents.length === 0
        ) {
            savedPanel.hidden = true;
            return;
        }

        record.documents.forEach(document => {
            const row = document.createElement("div");
            row.className = "du-saved-item";

            const info = document.createElement("div");

            const title = document.createElement("strong");
            title.textContent =
                DOCUMENT_LABELS[document.kind] || document.kind;

            const details = document.createElement("span");

            details.textContent =
                (document.fileName || "Saved document") +
                " · " +
                formatSize(document.size || 0);

            info.append(title, details);

            const removeButton = document.createElement("button");

            removeButton.type = "button";
            removeButton.textContent = "Remove";

            removeButton.addEventListener("click", () => {
                removeSavedDocument(
                    reference,
                    email,
                    document.kind
                );
            });

            row.append(info, removeButton);
            savedList.appendChild(row);

            if (!selectedFiles[document.kind]) {
                updateFileStatus(
                    document.kind,
                    "Previously saved: " + document.fileName,
                    "is-selected"
                );
            }
        });

        savedPanel.hidden = false;
    }

    // =========================================
    // REMOVE A SAVED DOCUMENT
    // =========================================

    function removeSavedDocument(reference, email, kind) {
        try {
            const records = readStorage(STORAGE_KEY);

            const record = records.find(item => {
                return (
                    String(item.reference || "").toUpperCase() === reference &&
                    String(item.email || "").toLowerCase() === email
                );
            });

            if (!record) return;

            record.documents = (record.documents || []).filter(
                document => document.kind !== kind
            );

            record.updatedAt = new Date().toISOString();

            writeStorage(STORAGE_KEY, records);

            updateFileStatus(kind, "No file selected");

            renderSavedDocuments();
            updateChecklist();

            showMessage(
                "Document removed from browser storage.",
                "success"
            );
        } catch (error) {
            showMessage(
                "Could not remove the document. Browser storage may be full.",
                "error"
            );
        }
    }

    // =========================================
    // SELECT FILES
    // =========================================

    document
        .querySelectorAll('input[type="file"][data-kind]')
        .forEach(input => {
            input.addEventListener("change", () => {
                const kind = input.dataset.kind;
                const file = input.files && input.files[0];

                if (!file) return;

                const error = validateFile(file);

                if (error) {
                    delete selectedFiles[kind];

                    updateFileStatus(kind, error, "is-error");

                    input.value = "";

                    updateChecklist();
                    showMessage(error, "error");

                    return;
                }

                selectedFiles[kind] = file;

                updateFileStatus(
                    kind,
                    file.name + " · " + formatSize(file.size),
                    "is-selected"
                );

                updateChecklist();
                showMessage("");
            });
        });

    // =========================================
    // INPUT EVENTS
    // =========================================

    [referenceInput, emailInput].forEach(input => {
        input.addEventListener("input", () => {
            updateChecklist();
            findApplication();
            renderSavedDocuments();
        });
    });

    confirmation.addEventListener("change", updateChecklist);

    // =========================================
    // CLEAR NEWLY SELECTED FILES
    // =========================================

    const clearButton = document.getElementById("clearFilesButton");

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            Object.keys(selectedFiles).forEach(kind => {
                delete selectedFiles[kind];
            });

            document
                .querySelectorAll('input[type="file"][data-kind]')
                .forEach(input => {
                    input.value = "";
                });

            Object.keys(DOCUMENT_LABELS).forEach(kind => {
                updateFileStatus(kind, "No file selected");
            });

            updateChecklist();
            renderSavedDocuments();

            showMessage(
                "Newly selected files cleared. Previously saved documents remain saved.",
                "success"
            );
        });
    }

    // =========================================
    // SAVE DOCUMENTS
    // =========================================

    form.addEventListener("submit", async event => {
        event.preventDefault();

        showMessage("");

        const reference = getReference();
        const email = getEmail();

        if (!reference) {
            showMessage(
                "Please enter your application reference number.",
                "error"
            );

            referenceInput.focus();
            return;
        }

        if (!email || !emailInput.validity.valid) {
            showMessage(
                "Please enter a valid email address.",
                "error"
            );

            emailInput.focus();
            return;
        }

        if (!confirmation.checked) {
            showMessage(
                "Please confirm that these documents are accurate and belong to you.",
                "error"
            );

            confirmation.focus();
            return;
        }

        const existingRecord = findDocumentRecord(reference, email);

        const savedKinds = new Set(
            (existingRecord?.documents || []).map(document => document.kind)
        );

        const missingDocuments = REQUIRED_DOCUMENTS.filter(kind => {
            return !selectedFiles[kind] && !savedKinds.has(kind);
        });

        if (missingDocuments.length > 0) {
            showMessage(
                "Please select the required documents: " +
                missingDocuments
                    .map(kind => DOCUMENT_LABELS[kind])
                    .join(", ") +
                ".",
                "error"
            );

            return;
        }

        const kinds = Object.keys(selectedFiles);

        if (kinds.length === 0) {
            showMessage(
                "There are no new files to save. Your previously saved documents remain available below.",
                "success"
            );

            renderSavedDocuments();
            return;
        }

        const submitButton = form.querySelector(
            'button[type="submit"]'
        );

        const originalButtonHTML = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML =
            '<i class="bi bi-hourglass-split"></i> Saving documents…';

        try {
            const newDocuments = [];

            for (const kind of kinds) {
                const file = selectedFiles[kind];

                const error = validateFile(file);

                if (error) {
                    throw new Error(
                        DOCUMENT_LABELS[kind] + ": " + error
                    );
                }

                const dataURL = await readFileAsDataURL(file);

                newDocuments.push({
                    kind: kind,
                    label: DOCUMENT_LABELS[kind],
                    fileName: file.name,
                    mimeType: file.type,
                    size: file.size,
                    dataUrl: dataURL,
                    uploadedAt: new Date().toISOString()
                });
            }

            const records = readStorage(STORAGE_KEY);

            let record = records.find(item => {
                return (
                    String(item.reference || "").toUpperCase() === reference &&
                    String(item.email || "").toLowerCase() === email
                );
            });

            if (!record) {
                record = {
                    reference: reference,
                    email: email,
                    documents: [],
                    createdAt: new Date().toISOString()
                };

                records.push(record);
            }

            const documentsByKind = new Map(
                (record.documents || []).map(document => [
                    document.kind,
                    document
                ])
            );

            newDocuments.forEach(document => {
                documentsByKind.set(document.kind, document);
            });

            record.documents = Array.from(documentsByKind.values());
            record.updatedAt = new Date().toISOString();
            record.confirmedAccuracy = true;

            writeStorage(STORAGE_KEY, records);

            kinds.forEach(kind => {
                delete selectedFiles[kind];

                const input = document.getElementById("file-" + kind);

                if (input) {
                    input.value = "";
                }
            });

            updateChecklist();
            renderSavedDocuments();

            showMessage(
                "Documents saved in this browser for reference " +
                reference +
                ". This is a local demo, not an official university submission.",
                "success"
            );
        } catch (error) {
            console.error("Document upload error:", error);

            if (error.name === "QuotaExceededError") {
                showMessage(
                    "Browser storage is full. Remove saved files or choose smaller files.",
                    "error"
                );
            } else {
                showMessage(
                    error.message || "Could not save documents. Please try again.",
                    "error"
                );
            }
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;
        }
    });

    // =========================================
    // READ OPTIONAL URL PARAMETERS
    // Example:
    // document-upload.html?reference=BAHAR-123&email=test@example.com
    // =========================================

    const params = new URLSearchParams(window.location.search);

    if (params.get("reference")) {
        referenceInput.value = params
            .get("reference")
            .trim()
            .toUpperCase();
    }

    if (params.get("email")) {
        emailInput.value = params.get("email").trim();
    }

    // =========================================
    // INITIAL PAGE SETUP
    // =========================================

    updateChecklist();
    findApplication();
    renderSavedDocuments();

})();