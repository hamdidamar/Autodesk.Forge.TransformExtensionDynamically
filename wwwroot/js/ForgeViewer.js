var viewer;
let mainModel = null;
let secondModel = null;
var _selectedModel = null;


function launchViewer(urn) {
    var options = {
        env: 'AutodeskProduction',
        getAccessToken: getForgeToken
    };

    Autodesk.Viewing.Initializer(options, () => {
        viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['HandleSelectionExtension', 'TransformationExtension'] });

        viewer.start();
        var documentId = 'urn:' + urn;
        Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
        //viewer.addEventListener(
        //    Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED,
        //    setSelectedModel);

        viewer.addEventListener(
            Autodesk.Viewing.SELECTION_CHANGED_EVENT,
            setSelectedModel);

        viewer.addEventListener(
            Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
            setSelectedModel);
    });
}

function onDocumentLoadSuccess(doc) {
    var viewables = doc.getRoot().getDefaultGeometry();
    viewer.loadDocumentNode(doc, viewables).then(i => {
        // documented loaded, any action?
        mainModel = i;
    });

    
}

function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
    fetch('/api/forge/oauth/token').then(res => {
        res.json().then(data => {
            callback(data.access_token, data.expires_in);
        });
    });
}

function setSelectedModel() {
    _selectedModel = viewer.getAggregateSelection()[0].model;
}