
    
     /*  JAVASCRIPT */


    

        /* =========================================================
           LANGUAGE
        ========================================================= */

        const languageBtn =
            document.getElementById("languageBtn");

        const languageMenu =
            document.getElementById("languageMenu");

        const currentLanguage =
            document.getElementById("currentLanguage");


        /* Open / Close language menu */

        languageBtn.addEventListener("click", function (event) {

            event.stopPropagation();

            languageMenu.classList.toggle("show");

        });


        /* Close when clicking outside */

        document.addEventListener("click", function () {

            languageMenu.classList.remove("show");

        });


        /* Language buttons */

        document
            .querySelectorAll("[data-lang]")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    const lang = this.dataset.lang;

                    setLanguage(lang);

                    languageMenu.classList.remove("show");

                });

            });



        function setLanguage(lang) {

            const elements =
                document.querySelectorAll("[data-en][data-fa]");


            elements.forEach(function (element) {

                element.textContent =
                    lang === "fa"
                        ? element.dataset.fa
                        : element.dataset.en;

            });


            /* Change placeholders */

            document
                .querySelectorAll("[data-placeholder-en][data-placeholder-fa]")
                .forEach(function (input) {

                    input.placeholder =
                        lang === "fa"
                            ? input.dataset.placeholderFa
                            : input.dataset.placeholderEn;

                });


            /* HTML direction */

            document.documentElement.lang =
                lang === "fa"
                    ? "fa"
                    : "en";


            document.documentElement.dir =
                lang === "fa"
                    ? "rtl"
                    : "ltr";


            /* Current language */

            currentLanguage.textContent =
                lang === "fa"
                    ? "دری"
                    : "EN";


            /* Save */

            localStorage.setItem(
                "baharLanguage",
                lang
            );

        }



        /* =========================================================
           DARK MODE
        ========================================================= */

        const themeBtn =
            document.getElementById("themeBtn");

        const themeIcon =
            document.getElementById("themeIcon");


        function setTheme(theme) {

            if (theme === "dark") {

                document.documentElement.classList.add(
                    "dark-mode"
                );

                themeIcon.className =
                    "bi bi-sun";

                themeBtn.title =
                    "Light Mode";

            } else {

                document.documentElement.classList.remove(
                    "dark-mode"
                );

                themeIcon.className =
                    "bi bi-moon-stars";

                themeBtn.title =
                    "Dark Mode";

            }


            localStorage.setItem(
                "baharTheme",
                theme
            );

        }


        themeBtn.addEventListener(
            "click",
            function () {

                const isDark =
                    document.documentElement.classList.contains(
                        "dark-mode"
                    );

                setTheme(
                    isDark
                        ? "light"
                        : "dark"
                );

            }
        );



        /* =========================================================
           LOGIN MODAL
        ========================================================= */

        const loginBtn =
            document.getElementById("loginBtn");

        const loginModal =
            document.getElementById("loginModal");

        const loginClose =
            document.getElementById("loginClose");

        const loginOverlay =
            document.getElementById("loginOverlay");


        /* Open */

        loginBtn.addEventListener(
            "click",
            function () {

                loginModal.classList.add("show");

                document.body.style.overflow = "hidden";

            }
        );


        /* Close */

        function closeLogin() {

            loginModal.classList.remove("show");

            document.body.style.overflow = "";

        }


        loginClose.addEventListener(
            "click",
            closeLogin
        );


        loginOverlay.addEventListener(
            "click",
            closeLogin
        );


        /* ESC */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    loginModal.classList.contains("show")
                ) {

                    closeLogin();

                }

            }
        );



        /* =========================================================
           SHOW / HIDE PASSWORD
        ========================================================= */

        const passwordToggle =
            document.getElementById("passwordToggle");

        const loginPassword =
            document.getElementById("loginPassword");


        passwordToggle.addEventListener(
            "click",
            function () {

                if (
                    loginPassword.type === "password"
                ) {

                    loginPassword.type = "text";

                    this.innerHTML =
                        '<i class="bi bi-eye-slash"></i>';

                } else {

                    loginPassword.type = "password";

                    this.innerHTML =
                        '<i class="bi bi-eye"></i>';

                }

            }
        );



        /* =========================================================
           LOGIN FORM
        ========================================================= */

        const loginForm =
            document.getElementById("loginForm");

        const loginMessage =
            document.getElementById("loginMessage");


        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    document.getElementById("loginEmail").value.trim();

                const password =
                    document.getElementById("loginPassword").value.trim();


                if (
                    email === "" ||
                    password === ""
                ) {

                    loginMessage.textContent =
                        document.documentElement.lang === "fa"
                            ? "لطفاً ایمیل و رمز عبور را وارد کنید."
                            : "Please enter your email and password.";

                    return;

                }


                loginMessage.textContent =
                    document.documentElement.lang === "fa"
                        ? "ورود موفقانه انجام شد."
                        : "Demo login successful.";


                setTimeout(
                    function () {

                        closeLogin();

                        loginForm.reset();

                        loginMessage.textContent = "";

                    },
                    1200
                );

            }
        );



        /* =========================================================
           MOBILE MENU
        ========================================================= */

        const hamburger =
            document.getElementById("hamburger");

        const mainNav =
            document.getElementById("mainNav");


        hamburger.addEventListener(
            "click",
            function () {

                mainNav.classList.toggle("open");

                const icon =
                    hamburger.querySelector("i");


                if (
                    mainNav.classList.contains("open")
                ) {

                    icon.className =
                        "bi bi-x-lg";

                } else {

                    icon.className =
                        "bi bi-list";

                }

            }
        );


        /* Close mobile menu after clicking a link */

        document
            .querySelectorAll("#mainNav a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        mainNav.classList.remove("open");

                        hamburger
                            .querySelector("i")
                            .className = "bi bi-list";

                    }
                );

            });



        /* =========================================================
           LOAD SAVED SETTINGS
        ========================================================= */

        const savedLanguage =
            localStorage.getItem("baharLanguage")
            || "en";


        const savedTheme =
            localStorage.getItem("baharTheme")
            || "light";


        setLanguage(savedLanguage);

        setTheme(savedTheme);

    
