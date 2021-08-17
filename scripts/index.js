const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);

const [loadingIcon] = document.getElementsByClassName('loading-icon')
const [statusMessage] = document.getElementsByClassName('status')
const [webcamFeed] = document.getElementsByClassName('webcam-feed')
const image = document.getElementById('image')

const startWebcam = async () => {
    try {
        await webcam.start()
        console.log('Webcam started')
    } catch (err) {
        console.error(err)
    }
}

const prepareImage = (image) => {

    // Remove first 22 chars from string as they are meta info
    image = image.slice(22)
    return image
}

const getPrediction = async (image) => {

    image = prepareImage(image)

    // Send POST request
    const response = await fetch('http://localhost:4242/api/object-detection', {
        method: 'POST',
        body: JSON.stringify({"image": image})
    })
    const responseBody = await response.json()
    
    console.log("Response: " + responseBody.prediction)
    return responseBody.prediction
}

const beginLoop = async () => {
    
    const picture = webcam.snap()

    while (true) {

        const picture = webcam.snap()

        // Send the image to the API
        const imgAsBase64 = await getPrediction(picture);

        // Display the image
        image.setAttribute('src', `data:image/png;base64, ${imgAsBase64}`);
    
    }
}


startWebcam()
    .then(async () => {
        await beginLoop()
    })
