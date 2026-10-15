
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("scholarshipSearch");
    const typeSelect = document.getElementById("scholarshipType");
    const resetButton = document.getElementById("clearScholarshipFilters");
    const cards = [...document.querySelectorAll(".funding-card")];
    const count = document.getElementById("scholarshipCount");
    const emptyMessage = document.getElementById("scholarshipEmpty");

    function filterScholarships() {
        const query = searchInput.value.trim().toLowerCase();
        const selectedType = typeSelect.value;
        let visibleCount = 0;

        cards.forEach((card) => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            const description = card.querySelector("p").textContent.toLowerCase();
            const keywords = (card.dataset.search || "").toLowerCase();
            const type = card.dataset.type;

            const matchesSearch =
                title.includes(query) ||
                description.includes(query) ||
                keywords.includes(query);

            const matchesType =
                selectedType === "all" || type === selectedType;

            const visible = matchesSearch && matchesType;

            card.hidden = !visible;

            if (visible) {
                visibleCount++;
            }
        });

        count.textContent =
            `${visibleCount} ${visibleCount === 1 ? "opportunity" : "opportunities"}`;

        emptyMessage.hidden = visibleCount !== 0;
    }

    searchInput.addEventListener("input", filterScholarships);
    typeSelect.addEventListener("change", filterScholarships);

    resetButton.addEventListener("click", () => {
        searchInput.value = "";
        typeSelect.value = "all";
        filterScholarships();
        searchInput.focus();
    });

    filterScholarships();
});
