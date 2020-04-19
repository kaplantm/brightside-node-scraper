const cheerio = require("cheerio");

const mrBrightsideTitleVariations = ["mr brightside", "mr. brightside"];
const mrBrightsideArtistVariations = ["killers", "the killers"];

function getPositionFromHTML(html) {
  let position = undefined;

  try {
    const $ = cheerio.load(html);
    const tableRows = $("tr");

    tableRows.each((i, tableRow) => {
      const title = $(".title", tableRow).text().trim();
      const artist = $(".artist", tableRow).text().trim();

      if (
        mrBrightsideTitleVariations.includes(title.toLowerCase()) &&
        mrBrightsideArtistVariations.includes(artist.toLowerCase())
      ) {
        position = $(".position", tableRow).text();
      }
    });
    return { position };
  } catch (error) {
    return { error };
  }
}

module.exports = {
  getPositionFromHTML,
};
