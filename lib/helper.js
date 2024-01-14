const fs = require('node:fs/promises');
const axios = require("axios");
const S3 = require("./aws-s3-client.js");

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
const index_template_html_path = __dirname + '/site/index_template.html';
const answer_template_str = "Yes, #43";
const updated_at_template_str = "Updated: 1/13/2024, 9:02:49 PM";
const total_weeks_template_str = "300+";

const loadFile = async (filepath) => {
    try {
        return await fs.readFile(filepath, { encoding: 'utf8' });
    } catch (err) {
        return null
    }
}

const getUpdatedHtml = async (chartData) => {
    let raw_html = await loadFile(index_template_html_path)
    const answer_value = chartData.position ? `Yes, #${chartData.position}` : `No =(`;
    const updated_at_value = new Date(chartData.updatedAt).toLocaleString();
    const total_weeks_value = chartData.weeksInTop100 ? `${chartData.weeksInTop100}+` : total_weeks_template_str;

    raw_html = raw_html.replace(answer_template_str, answer_value)
    raw_html = raw_html.replace(updated_at_template_str, updated_at_value)
    raw_html = raw_html.replace(total_weeks_template_str, total_weeks_value)
    return raw_html
}


// Updating static HTML site in S3
const S3_PATH = "ismrbrightsidestillintheukcharts.com/assets"
const S3_FILE = "index2.html"
const s3Client = new S3.S3Client(
    process.env.ACCESS_KEY_ID,
    process.env.SECRET_ACCESS_KEY
);

module.exports.updateBrightsideData = async (event) => {
    let chartData = null
    try {
        // 1. get updated position
        const result = await axios(API_URL);
        chartData = getChartData(result)

        if (!chartData.position) { throw new Error("Received invalid chart data.") }
        if (result.status != 200) { throw new Error("Failed to retrieve chart data.") }

        // 2. try to write updated data
        const s3PutRequest = s3Client.createPutPublicJsonRequest(
            S3_PATH,
            S3_FILE,
            await getUpdatedHtml(chartData)
        );
        const s3Response = await s3Client.put(s3PutRequest);
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
    } catch (error) { // 3. handle errors
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
