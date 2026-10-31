const DATA_URL = "data/0953245S.PX";

let pxData = null;
let chart = null;

function extractQuotedValues(text) {
  return [...text.matchAll(/"([^"]*)"/g)].map(match => match[1]);
}

function getStatement(text, key) {
  const regex = new RegExp("^" + key + "=([\\s\\S]*?);", "m");
  const match = text.match(regex);

  if (!match) {
    throw new Error(`Manjka zapis ${key}.`);
  }

  return extractQuotedValues(match[1]);
}

function parsePx(text) {
  const dimensions = [
    ...getStatement(text, "STUB"),
    ...getStatement(text, "HEADING")
  ];

  const valuesByDimension = {};

  const valuesRegex = /^VALUES\("([^"]+)"\)=([\s\S]*?);/gm;
  let match;

  while ((match = valuesRegex.exec(text)) !== null) {
    valuesByDimension[match[1]] = extractQuotedValues(match[2]);
  }

  const dataMatch = text.match(/^DATA=\s*([\s\S]*?);/m);

  if (!dataMatch) {
    throw new Error("Podatkovni del DATA ni bil najden.");
  }

  const data = (dataMatch[1].match(/"[^"]*"|\S+/g) || []).map(token => {
    const value = token.replaceAll('"', "");

    if (/^-?\d+(\.\d+)?$/.test(value)) {
      return Number(value);
    }

    return null;
  });

  const sizes = dimensions.map(dimension => {
    const values = valuesByDimension[dimension];

    if (!values) {
      throw new Error(`Manjkajo vrednosti za dimenzijo ${dimension}.`);
    }

    return values.length;
  });

  const expectedLength = sizes.reduce((product, size) => product * size, 1);

  if (data.length !== expectedLength) {
    throw new Error("Število podatkov se ne ujema z dimenzijami PCAXIS datoteke.");
  }

  const strides = sizes.map((_, index) =>
    sizes.slice(index + 1).reduce((product, size) => product * size, 1)
  );

  return {
    dimensions,
    valuesByDimension,
    data,
    strides
  };
}

function getValue(indices) {
  let flatIndex = 0;

  for (let i = 0; i < indices.length; i++) {
    flatIndex += indices[i] * pxData.strides[i];
  }

  return pxData.data[flatIndex];
}

function aggregateByLanguage(schoolYear) {
  const statusDimension = pxData.dimensions.indexOf("STATUS JEZIKA");
  const languageDimension = pxData.dimensions.indexOf("VRSTA JEZIKA");
  const yearDimension = pxData.dimensions.indexOf("ŠOLSKO LETO");
  const educationDimension = pxData.dimensions.indexOf("VRSTA IZOBRAŽEVANJA");
  const gradeDimension = pxData.dimensions.indexOf("LETNIK");

  const languages = pxData.valuesByDimension["VRSTA JEZIKA"];
  const years = pxData.valuesByDimension["ŠOLSKO LETO"];

  const yearIndex = years.indexOf(schoolYear);

  const result = [];

  // Index 0 is "Vrsta jezika - SKUPAJ", therefore it is skipped.
  for (let languageIndex = 1; languageIndex < languages.length; languageIndex++) {
    let total = 0;

    // Sum all language-status categories.
    for (
      let statusIndex = 0;
      statusIndex < pxData.valuesByDimension["STATUS JEZIKA"].length;
      statusIndex++
    ) {
      const indices = new Array(pxData.dimensions.length).fill(0);

      indices[statusDimension] = statusIndex;
      indices[languageDimension] = languageIndex;
      indices[yearDimension] = yearIndex;

      // For education and grade, index 0 is the total category.
      indices[educationDimension] = 0;
      indices[gradeDimension] = 0;

      const value = getValue(indices);

      if (value !== null) {
        total += value;
      }
    }

    result.push({
      language: languages[languageIndex],
      total
    });
  }

  return result;
}

function renderChart(schoolYear) {
  const aggregated = aggregateByLanguage(schoolYear);

  const labels = aggregated.map(item => item.language);
  const values = aggregated.map(item => item.total);

  if (chart) {
    chart.destroy();
  }

  const ctx = document.getElementById("languageChart");

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: `Število dijakov (${schoolYear})`,
          data: values
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

async function loadData() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error("PCAXIS datoteke ni bilo mogoče naložiti.");
    }

    const buffer = await response.arrayBuffer();
    const text = new TextDecoder("windows-1250").decode(buffer);

    pxData = parsePx(text);

    const years = pxData.valuesByDimension["ŠOLSKO LETO"];
    const select = document.getElementById("schoolYear");

    years.forEach(year => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      select.appendChild(option);
    });

    select.value = years[years.length - 1];

    select.addEventListener("change", event => {
      renderChart(event.target.value);
    });

    renderChart(select.value);

    document.getElementById("status").textContent =
      "Podatki so uspešno naloženi iz PCAXIS datoteke.";
  } catch (error) {
    document.getElementById("status").textContent =
      `Napaka: ${error.message}`;
    console.error(error);
  }
}

loadData();
