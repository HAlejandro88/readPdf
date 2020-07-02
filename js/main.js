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
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        }

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;

            }
        })

        // Output current page
        document.querySelector('#page-num').textContent = num;
    })
}

// check for pages rendering
const queueRenderPage = num => {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num)
    }
}

// Show Previus Page
 const showPrevPage = () => {
     if (pageNum <= 1) {
        return;
     }
     pageNum--;
     queueRenderPage(pageNum);
 }


 // Show Next Page

 const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
     }
     pageNum++;
     queueRenderPage(pageNum);
 }

// Get the Document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ =>  {
    pdfDoc = pdfDoc_;
    
    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
})
.catch(err => {
    // Display error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.messge));
    document.querySelector('body').insertBefore(div, canvas);

    // remove top bar
    document.querySelector('.top-bar').style.dispay = 'none';
})

// Button Events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);