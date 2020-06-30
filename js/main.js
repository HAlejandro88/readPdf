const url = '../docs/pdf.pdf';


let pdfDoc = null, 
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;    


const scale = 1.5,
      canvas = document.querySelector('#pdf-render'),
      ctx = canvas.getContext('2d');


// Render the page 

const renderPage = num => {
    pageIsRendering = true,

    // Get Page
    pdfDoc.getPage(num).then(page => {
        // Set Scale
        const viewport =  page.getViewPort({scale })
    })
}

// Get the Document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ =>  {
    pdfDoc = pdfDoc_;
    
    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
})