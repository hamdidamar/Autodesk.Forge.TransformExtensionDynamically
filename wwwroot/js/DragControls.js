
//let mainModel = null;
//let secondModel = null;
let extraZ = 0;


function onDragStart(event) {
    event.dataTransfer.effectAllowed = 'copy';
    // Hide the dragged image
    var img = document.getElementById("blank");
    event.dataTransfer.setDragImage(img, 0, 0);
}

// Load car model
const ModelState = {
    unloaded: 0,
    loading: 1,
    loaded: 2,
};
let modelState = ModelState.unloaded;
function onDragOver(event) {
    event.preventDefault();
    switch (modelState) {
        case ModelState.unloaded: {
            modelState = ModelState.loading;
            
            let documentId = "urn:" + "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZzJqcHlwcXhqdXBiYWJ6eWthOHJ0OHphZ296ejdrcnItZGVuZW1lMDEvRG9vci5pcHQ";

                Autodesk.Viewing.Document.load(documentId, (doc) => {
                    let items = doc.getRoot().search(
                        {
                            type: "geometry",
                            role: "3d",
                        },
                        true
                    );
                    if (items.length === 0) {
                        console.error("Document contains no viewables.");
                        return;
                    }

                    //let tr = new THREE.Matrix4();
                    //tr.set(
                    //    1,
                    //    0,
                    //    0,
                    //    0,
                    //    0,
                    //    1,
                    //    0,
                    //    0,
                    //    0,
                    //    0,
                    //    1,
                    //    0,
                    //    0,
                    //    0,
                    //    0,
                    //    1
                    //);
                    viewer
                        .loadDocumentNode(doc, items[0], {
                            keepCurrentModels: true,
                            //placementTransform: tr,
                        })
                        .then(function (model2) {
                            secondModel = model2;
                            let bb = secondModel.getBoundingBox();
                            extraZ = bb.max.z;
                            modelState = ModelState.loaded;
                        });
                });
            
            break;
        }

        case ModelState.loaded: {
            let res = viewer.impl.hitTest(
                event.clientX,
                event.clientY,
                true,
                null,
                [mainModel.getModelId()]
            );
            let pt = null;

            if (res) {
                pt = res.intersectPoint;
            } else {
                pt = viewer.impl.intersectGround(event.clientX, event.clientY);
            }

            let tr = secondModel.getPlacementTransform();
            tr.elements[12] = pt.x;
            tr.elements[13] = pt.y;
            tr.elements[14] = pt.z + extraZ;
            secondModel.setPlacementTransform(tr);
            viewer.impl.invalidate(true, true, true);

            break;
        }
    }
}

function onDrop(event) {
    event.preventDefault();
    modelState = ModelState.unloaded;
}


//Autodesk.Viewing.Initializer(options, function onInitialized() {
//    var viewerDiv = document.getElementById("forgeViewer");
//    viewer = new Autodesk.Viewing.GuiViewer3D(viewerDiv);
//    viewer.start();

//    getURN(myRevitFile, function (urn) {
//        let documentId = "urn:" + urn;

//        Autodesk.Viewing.Document.load(documentId, (doc) => {
//            let items = doc.getRoot().search(
//                {
//                    type: "geometry",
//                    role: "3d",
//                },
//                true
//            );
//            if (items.length === 0) {
//                console.error("Document contains no viewables.");
//                return;
//            }

//            viewer.loadDocumentNode(doc, items[0], {}).then(function (model1) {
//                mainModel = model1;
//            });
//        });
//    });
//});