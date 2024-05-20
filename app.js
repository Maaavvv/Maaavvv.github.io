document.addEventListener('DOMContentLoaded', function () {
    const url = 'carteN.pdf';
    const pdfjsLib = window['pdfjs-dist/build/pdf'];

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

    let pdfDoc = null,
        pageNum = 1,
        scale = 1.5,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    const mapDiv = document.getElementById('map');
    mapDiv.appendChild(canvas);

    pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        renderPage(pageNum);
    });

    function renderPage(num) {
        pdfDoc.getPage(num).then(function (page) {
            const viewport = page.getViewport({ scale: scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            page.render(renderContext).promise.then(function () {
                initializeMap(viewport);
            });
        });
    }

    function initializeMap(viewport) {
        const map = L.map('map').setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        map.on('click', function(e) {
            const marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
            marker.bindPopup("Nouvel endroit").openPopup();
        });

        const overlay = L.imageOverlay(canvas.toDataURL(), [[0, 0], [viewport.height, viewport.width]]);
        overlay.addTo(map);
        map.fitBounds([[0, 0], [viewport.height, viewport.width]]);
    }
});
