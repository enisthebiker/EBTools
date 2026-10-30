const translations = {
    tr: {
        title: "İhtiyacın olan araçlar, tek bir yerde",
        description: "Görsellerini dönüştür, dosyalarını düzenle ve günlük işlerini kolaylaştıran ücretsiz araçları keşfet.",
        search: "Araç ara...",
        categories: "Araç kategorileri",
        noResults: "Sonuç bulunamadı.",
        footer: "Ücretsiz çevrimiçi araçlar · Geliştiren: Enis Baydemir"
    },
    en: {
        title: "The tools you need, all in one place",
        description: "Convert images, manage files and discover free tools that make everyday tasks easier.",
        search: "Search tools...",
        categories: "Tool categories",
        noResults: "No results found.",
        footer: "Free online tools · Developed by Enis Baydemir"
    }
};

const trButton = document.getElementById("trButton");
const enButton = document.getElementById("enButton");
const toolSearch = document.getElementById("toolSearch");
const toolCards = document.querySelectorAll(".tool-card");
const noResults = document.getElementById("noResults");

function setLanguage(language) {
    const t = translations[language];

    document.documentElement.lang = language;
    document.getElementById("pageTitle").textContent = t.title;
    document.getElementById("pageDescription").textContent = t.description;
    document.getElementById("categoriesTitle").textContent = t.categories;
    noResults.textContent = t.noResults;
    document.getElementById("footerText").textContent = t.footer;
    toolSearch.placeholder = t.search;
    toolSearch.setAttribute("aria-label", t.search);

    document.querySelectorAll("[data-tr][data-en]").forEach(element => {
        element.textContent = element.dataset[language];
    });

    trButton.classList.toggle("active", language === "tr");
    enButton.classList.toggle("active", language === "en");

    localStorage.setItem("ebToolsLanguage", language);

    // Dil değiştiğinde mevcut arama da yeni dile göre tekrar değerlendirilir.
    filterTools();
}

function filterTools() {
    const language = document.documentElement.lang === "tr" ? "tr" : "en";
    const query = toolSearch.value.trim().toLocaleLowerCase(language);
    let visibleCount = 0;

    toolCards.forEach(card => {
        const searchableText = (
            card.innerText + " " + (card.dataset.search || "")
        ).toLocaleLowerCase(language);

        const matches = searchableText.includes(query);
        card.classList.toggle("hidden", !matches);

        if (matches) visibleCount++;
    });

    noResults.classList.toggle("hidden", visibleCount > 0);
}

trButton.addEventListener("click", () => setLanguage("tr"));
enButton.addEventListener("click", () => setLanguage("en"));
toolSearch.addEventListener("input", filterTools);

const savedLanguage = localStorage.getItem("ebToolsLanguage");
setLanguage(savedLanguage === "en" ? "en" : "tr");
