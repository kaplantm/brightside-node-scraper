const cheerio = require("cheerio");

const mrBrightsideTitleVariations = ["mr brightside", "mr. brightside"];
const mrBrightsideArtistVariations = ["killers", "the killers"];

function getPositionFromHTML(html, admin, app) {
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
    handleFirebaseUpdate(position, admin, app);
    return { position };
  } catch (error) {
    return { error };
  }
}

async function handleFirebaseUpdate(position, admin, app) {
  const db = admin.database();
  const ref = db.ref("songs/" + "killers_mrbrightside");

  await ref.set({
    position,
    updated_at: new Date().getTime(),
  });

  app.delete();

  return;
}

module.exports = {
  getPositionFromHTML,
};
