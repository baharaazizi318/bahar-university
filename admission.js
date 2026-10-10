
document.addEventListener("DOMContentLoaded", function () {

    const admissionForm = document.getElementById("admissionForm");
    const admissionMessage = document.getElementById("admissionMessage");
    const admissionReceipt = document.getElementById("admissionReceipt");
    const admissionReference = document.getElementById("admissionReference");
    const newAdmissionButton = document.getElementById("newAdmissionButton");
    const admissionSubmit = document.getElementById("admissionSubmit");

    // Stop if this page does not contain the admission form.
    if (!admissionForm) return;

    const STORAGE_KEY = "baharApplications";

    // Read saved applications safely.
    function getApplications() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) return [];

            const applications = JSON.parse(saved);

            return Array.isArray(applications) ? applications : [];
        } catch (error) {
            console.error("Could not read saved applications:", error);
            return [];
        }
    }

    // Show a message to the user.
    function showMessage(message, type) {
        admissionMessage.textContent = message;
        admissionMessage.className = "admission-message " + type;
    }

    // Generate a reference number.
    function generateReference() {
        return "BAHAR-" +
            Date.now().toString(36).toUpperCase() +
            "-" +
            Math.random().toString(36).slice(2, 7).toUpperCase();
    }

    // Submit the application.
    admissionForm.addEventListener("submit", function (event) {
        event.preventDefault();

        showMessage("", "");

        // Validate required fields.
        if (!admissionForm.checkValidity()) {
            admissionForm.reportValidity();
            showMessage(
                "Please complete all required fields correctly.",
                "error"
            );
            return;
        }

        const fullName = document.getElementById("appFullName").value.trim();
        const email = document.getElementById("appEmail").value.trim();
        const phone = document.getElementById("appPhone").value.trim();
        const birthDate = document.getElementById("appBirthDate").value;
        const country = document.getElementById("appCountry").value;
        const education = document.getElementById("appEducation").value;
        const program = document.getElementById("appProgram").value;
        const term = document.getElementById("appTerm").value;
        const address = document.getElementById("appAddress").value.trim();
        const statement = document.getElementById("appStatement").value.trim();
        const consent = document.getElementById("appConsent").checked;

        if (!consent) {
            showMessage(
                "Please confirm that your information is accurate.",
                "error"
            );
            return;
        }

        // Additional checks for valid data.
        if (birthDate && birthDate > new Date().toISOString().slice(0, 10)) {
            showMessage("Date of birth cannot be in the future.", "error");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage("Please enter a valid email address.", "error");
            return;
        }

        const application = {
            reference: generateReference(),
            fullName: fullName,
            email: email,
            phone: phone,
            birthDate: birthDate,
            country: country,
            education: education,
            program: program,
            term: term,
            address: address,
            statement: statement,
            consent: consent,
            submittedAt: new Date().toISOString()
        };

        try {
            // Read existing applications and add the new one.
            const applications = getApplications();
            applications.push(application);

            // Save all applications in localStorage.
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(applications)
            );

            // Verify that the saved data can be read back.
            const savedApplications = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

            const savedSuccessfully = savedApplications.some(
                item => item.reference === application.reference
            );

            if (!savedSuccessfully) {
                throw new Error("Application could not be verified.");
            }

            // Show confirmation.
            admissionReference.textContent = application.reference;
            admissionReceipt.hidden = false;
            showMessage(
                "Your application has been saved successfully!",
                "success"
            );

            // Prevent accidental duplicate submission.
            admissionSubmit.disabled = true;

            admissionReceipt.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            console.log("Application saved:", application);
            console.log("All saved applications:", savedApplications);

        } catch (error) {
            console.error("Application storage error:", error);

            showMessage(
                "The application could not be saved. Check browser storage settings and try again.",
                "error"
            );
        }
    });

    // Start a new application.
    if (newAdmissionButton) {
        newAdmissionButton.addEventListener("click", function () {
            admissionForm.reset();

            admissionReceipt.hidden = true;
            admissionSubmit.disabled = false;

            showMessage("", "");

            admissionForm.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

});