var admin = require("firebase-admin");

var serviceAccount = require("./flynovate-f94ea-f3e9dcffd532.json");

exports.initialize = () => {
    initialized = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://flynovate-f94ea-default-rtdb.firebaseio.com/"
    });
    console.log("APP IS INITIALIZED")
    return initialized
}

exports.uploadPDF = async (filename, companyName) => {
    var options = {
        destination: `reports/${companyName}/report-` + Date() + '.pdf'
    }
    var bucket = admin.storage().bucket("gs://flynovate-f94ea.appspot.com");
    await bucket.upload(filename, options)
}

exports.getPDF = async (companyName) => {
    var bucket = admin.storage().bucket("gs://flynovate-f94ea.appspot.com");
    var all_reports = await bucket.getFiles({ prefix: `reports/${companyName}` })
    var all_files = []
    var files = all_reports[0]
    for (var i = 0; i < files.length; i++) {
        file_name = files[i].name
        url = await bucket.file(file_name).getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        })
        all_files.push(url[0])
    }
    return all_files
}

exports.getImg = async (reportUser) => {
    var bucket = admin.storage().bucket("gs://flynovate-f94ea.appspot.com");
    var all_images = await bucket.getFiles({ prefix: `error_images/${reportUser}/not_created` })
    var all_files = {}
    var files = all_images[0]
    for (var i = 0; i < files.length; i++) {
        var key = files[i].name.split('/')[3]
        file_name = files[i].name
        url = await bucket.file(file_name).getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        })
        if (!(key in all_files)) {
            all_files[key] = []
        }
        all_files[key].push({ 'name': file_name, 'url': url[0] })
    }
    return [all_files, files]
}

exports.moveImages = async (imageFiles, reportUser) => {
    var bucket = admin.storage().bucket("gs://flynovate-f94ea.appspot.com");
    for (var i = 0; i < imageFiles.length; i++) {
        var myFileName = imageFiles[i].name
        var fileLocationName = imageFiles[i].name.split('/')[4]
        await bucket.file(myFileName).move(`error_images/${reportUser}/created/${fileLocationName}`).then((_) => {
        })
        console.log(fileLocationName)
    }
}

