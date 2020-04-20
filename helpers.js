const cheerio = require("cheerio");

const mrBrightsideTitleVariations = ["mr brightside", "mr. brightside"];
const mrBrightsideArtistVariations = ["killers", "the killers"];

function getPositionFromHTML(html, database, app) {
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
        console.log("Song Found");
        position = $(".position", tableRow).text();
      }
    });
    handleFirebaseUpdate(position, database, app);
    return { position };
  } catch (error) {
    console.log("getPositionFromHTML", error);
    return { error };
  }
}

async function handleFirebaseUpdate(position, database, app) {
  console.log("handleFirebaseUpdate");
  const songFolder = process.env.IS_LOCAL ? "songs/test/" : "songs/";
  const ref = database.ref(songFolder + "killers_mrbrightside");
  console.log(app);
  const updated_at = new Date().getTime();

  console.log({ position, updated_at, songFolder });
  try {
    return await ref.set(
      {
        position,
        updated_at,
      },
      (error) => {
        console.log("before delete in set callback");
        console.log({ error });
        app.delete();
      }
    );
  } catch (e) {
    console.log("firebase update error", e);
  }
}

module.exports = {
  getPositionFromHTML,
};
