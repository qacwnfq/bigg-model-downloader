const fs = require('fs');
const path = require('path')
const request = require('request');

if (!fs.existsSync(getDownloadPath())) {
    fs.mkdirSync(getDownloadPath());
}

request(getBigModelUrl(), {json: true}, (err, res, body) => {
    if (err) return console.log(err);
    const modelList = body.results;
    modelList
        .map(model => model.bigg_id)
        .forEach(model => {
            console.log(`Downloading ${generateSbmlFileName(model)}`);
            request(getSbmlDownloadLink(model), {}, (err, res, body) => {
                    if (err) return console.log(err);
                    fs.writeFileSync(path.join(getDownloadPath(), generateSbmlFileName(model)), body);
                }
            );
        });
});

function getBigModelUrl() {
    return 'http://bigg.ucsd.edu/api/v2/models';
}

function getSbmlDownloadLink(model) {
    return `http://bigg.ucsd.edu/static/models/${model}.xml`;
}

function generateSbmlFileName(model) {
    return `${model}.xml`;
}

function getDownloadPath() {
    return 'models';
}

