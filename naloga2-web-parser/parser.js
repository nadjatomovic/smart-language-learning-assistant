const puppeteer = require("puppeteer");
const fs = require("fs");

const URL = "https://en.wiktionary.org/wiki/Appendix:Basic_English_word_list";

async function main() {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();

    await page.goto(URL, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    const podatki = await page.evaluate(() => {
      const rezultat = [];
      let kategorija = null;

      const elementi = document.querySelectorAll("h2, a");

      for (const element of elementi) {
        if (element.tagName === "H2") {
          const naslov = element.innerText.replace("[edit]", "").trim();

          if (
            naslov.startsWith("Operations") ||
            naslov.startsWith("400 general words") ||
            naslov.startsWith("Things") ||
            naslov.startsWith("Qualities")
          ) {
            kategorija = naslov;
          } else {
            kategorija = null;
          }

          continue;
        }

        if (!kategorija) {
          continue;
        }

        const beseda = element.textContent.trim();
        const href = element.getAttribute("href") || "";

        if (
          /^[A-Za-z]+$/.test(beseda) &&
          !href.startsWith("#") &&
          !href.includes(":") &&
          !rezultat.some(zapis => zapis.beseda.toLowerCase() === beseda.toLowerCase())
        ) {
          rezultat.push({
            beseda,
            kategorija
          });
        }
      }

      return rezultat;
    });

    if (podatki.length === 0) {
      throw new Error("Na strani ni bilo mogoče najti besed.");
    }

    fs.writeFileSync(
      "besede.json",
      JSON.stringify(podatki, null, 2),
      "utf8"
    );

    console.log(`Prebranih besed: ${podatki.length}`);
    console.log("Podatki so shranjeni v datoteko besede.json.");
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error("Napaka:", error.message);
  process.exit(1);
});
