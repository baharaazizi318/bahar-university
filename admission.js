
/* =====================================================
   BAHAR UNIVERSITY - ADMISSIONS APPLICATION
   LocalStorage + SweetAlert2
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const STORAGE_KEY = "baharApplications";

    const form = document.getElementById("admissionForm");
    const message = document.getElementById("admissionMessage");
    const receipt = document.getElementById("admissionReceipt");
    const referenceElement = document.getElementById("admissionReference");
    const submitButton = document.getElementById("admissionSubmit");
    const newApplicationButton = document.getElementById("newAdmissionButton");

    if (!form) {
        console.error("Admission form was not found.");
        return;
    }

    // Show a message below the form.
    function showMessage(text, type = "") {
        if (!message) return;

        message.textContent = text;
        message.className = "admission-message";

        if (type) {
            message.classList.add(type);
        }
    }

    // Read previously saved applications.
    function getApplications() {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return [];

        const applications = JSON.parse(saved);

        if (!Array.isArray(applications)) {
            throw new Error("Saved applications data is invalid.");
        }

        return applications;
    }

    // Generate a unique application reference.
    function generateReference() {
        return "BAHAR-" +
            Date.now().toString(36).toUpperCase() +
            "-" +
            Math.random().toString(36).substring(2, 7).toUpperCase();
    }

    // Show SweetAlert messages, with a fallback if the library is unavailable.
    function showAlert(options) {
        if (typeof Swal !== "undefined") {
            return Swal.fire(options);
        }

        window.alert(
            (options.title ? options.title + "\n\n" : "") +
            (options.text || "")
        );

        return Promise.resolve();
    }

    // Submit the application.
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        showMessage("");

        if (submitButton) {
            submitButton.disabled = true;
        }

        try {
            // Validate required fields.
            if (!form.checkValidity()) {
                form.reportValidity();
                showMessage(
                    "Please complete all required fields correctly.",
                    "error"
                );

                if (submitButton) submitButton.disabled = false;
                return;
            }

            const value = function (id) {
                const element = document.getElementById(id);
                return element ? element.value.trim() : "";
            };

            // Check birth date.
            const birthDate = value("appBirthDate");
            const today = new Date();
            const todayString = [
                today.getFullYear(),
                String(today.getMonth() + 1).padStart(2, "0"),
                String(today.getDate()).padStart(2, "0")
            ].join("-");

            if (birthDate && birthDate > todayString) {
                showMessage(
                    "Date of birth cannot be in the future.",
                    "error"
                );

                if (submitButton) submitButton.disabled = false;
                return;
            }

            // Validate email.
            const email = value("appEmail").toLowerCase();

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage("Please enter a valid email address.", "error");

                if (submitButton) submitButton.disabled = false;
                return;
            }

            // Validate personal statement.
            const statement = value("appStatement");

            if (statement.length < 30 || statement.length > 2000) {
                showMessage(
                    "Your personal statement must contain 30 to 2000 characters.",
                    "error"
                );

                document.getElementById("appStatement")?.focus();

                if (submitButton) submitButton.disabled = false;
                return;
            }

            // Build the application record.
            const application = {
                reference: generateReference(),
                fullName: value("appFullName"),
                email: email,
                phone: value("appPhone"),
                birthDate: birthDate,
                country: value("appCountry"),
                education: value("appEducation"),
                program: value("appProgram"),
                term: value("appTerm"),
                address: value("appAddress"),
                statement: statement,
                consent: document.getElementById("appConsent").checked,
                status: "Submitted",
                submittedAt: new Date().toISOString()
            };

            // Read old records and append the new application.
            const applications = getApplications();
            applications.push(application);

            // Save all applications.
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(applications)
            );

            // Verify that this application was saved.
            const savedApplications = getApplications();
            const savedApplication = savedApplications.find(function (item) {
                return item.reference === application.reference;
            });

            if (!savedApplication) {
                throw new Error("Could not verify the saved application.");
            }

            // Update the receipt on the page.
            if (referenceElement) {
                referenceElement.textContent = application.reference;
            }

            if (receipt) {
                receipt.hidden = false;
            }

            showMessage(
                "Your application has been saved successfully!",
                "success"
            );

            // Keep the button disabled to prevent accidental duplicate submits.
            if (submitButton) {
                submitButton.disabled = true;
            }

            console.log("Saved application:", savedApplication);
            console.log("All saved applications:", savedApplications);

            // Display SweetAlert only after saving has been verified.
            showAlert({
                icon: "success",
                title: "Application Submitted Successfully!",
                html:
                    "<p>Your application has been saved in this browser.</p>" +
                    "<p><strong>Reference Number:</strong></p>" +
                    "<p>" + application.reference + "</p>" +
                    "<p>Please keep your reference number for your records.</p>",
                confirmButtonText: "Great!",
                confirmButtonColor: "#245c7c",
                allowOutsideClick: false
            }).then(function () {
                if (receipt) {
                    receipt.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            });

        } catch (error) {
            console.error("Application saving failed:", error);

            showMessage(
                "Your application could not be saved. Please check the browser Console and try again.",
                "error"
            );

            if (submitButton) {
                submitButton.disabled = false;
            }

            showAlert({
                icon: "error",
                title: "Saving Failed",
                text:
                    "Your application could not be saved. Please try again.",
                confirmButtonText: "OK",
                confirmButtonColor: "#b42318"
            });
        }
    });

    // Start a new application after the previous one is saved.
    if (newApplicationButton) {
        newApplicationButton.addEventListener("click", function () {
            form.reset();

            if (receipt) {
                receipt.hidden = true;
            }

            if (submitButton) {
                submitButton.disabled = false;
            }

            showMessage("");

            form.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    // Inspect saved applications from the browser Console.
    window.getBaharApplications = function () {
        return getApplications();
    };
});