const fs = require('node:fs/promises');
const axios = require("axios");
const { s3Client } = require("./aws-s3-client.js");

// Getting position data from Official Charts API
const API_URL = "https://backstage.officialcharts.com/ce-api/songs/killers-mr-brightside";

const getChartData = (result) => {
    const errorResponse = { position: null, weeksInTop100: null, updated_at: null }
    if (result.status !== 200) { return errorResponse }

    const chartTrackInfos = result.data?.content?.chartTrackInfos || [];
    const chartRuns = chartTrackInfos[0]?.chartRuns || [];
    const positions = chartRuns[chartRuns.length - 1]?.positions || [];
    const position = positions[positions.length - 1].position;
    const weeksInTop100 = (chartTrackInfos[0]?.stats || []).find(el => el.label == "Top. 100")?.value

    return position ? { position, weeksInTop100, updatedAt: new Date().getTime() } : errorResponse;
}


// Reading index_template.html and replacing strings with updated data
const loadFile = async (filepath) => {
    try {
        return await fs.readFile(filepath, { encoding: 'utf8' });
    } catch (err) {
        return null
    }
}

const findReplaceTemplate = (html, id, value, element = "span") => html.replace(`<${element} id="${id}_template"></${element}>`, `<${element} id="${id}_template">${value}</${element}>`)

const getUpdatedHtml = async (chartData) => {
    let rawHtml = await loadFile(__dirname + '/site/index_template.html')
    rawHtml = findReplaceTemplate(rawHtml, "answer", chartData.position ? `Yes, #${chartData.position}` : `No =(`);
    rawHtml = findReplaceTemplate(rawHtml, "total_weeks", `${chartData.weeksInTop100 || 302}+`);

    // setting date to UTC by also loading raw values into the JS then localizing date on FE
    rawHtml = findReplaceTemplate(rawHtml, "updated_at", `Updated: ${new Date(chartData.updatedAt).toLocaleDateString()} (UTC)`);
    rawHtml = rawHtml.replace("generated_data_json", JSON.stringify(chartData))

    return rawHtml;
}


// Updating static HTML site in S3
const S3_PATH = "ismrbrightsidestillintheukcharts.com"
const S3_FILE = "index.html"

module.exports.updateBrightsideData = async (event) => {
    let chartData = null
    try {
        // 1. get updated position
        const result = await axios(API_URL);
        chartData = getChartData(result)

        if (!chartData.position) { throw new Error("Received invalid chart data.") }
        if (result.status != 200) { throw new Error("Failed to retrieve chart data.") }

        // 2. read index_template.html return html string with updated data 
        const updatedHtml = await getUpdatedHtml(chartData)

        // 3. try to write updated data
        const command = s3Client.createPutObjectCommand(S3_PATH, S3_FILE, updatedHtml);
        const s3Response = await s3Client.send(command);

        if (!s3Response.success) {
            throw new Error("Failed to save data")
        }

        const response = {
            statusCode: 200,
            headers: {},
            body: {
                success: true,
                chartData,
                message: "Position successfully updated.",
                error: undefined
            },
            isBase64Encoded: false,
        };
        return response;
    } catch (error) { // 4. handle errors

        return {
            statusCode: 500,
            headers: {},
            body: {
                success: false,
                chartData,
                message: "Position update failed.",
                error,
            },
            isBase64Encoded: false,
        }
    }
};
