import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * @param {HTMLElement} element 
 * @param {object} options
 * @param {string} options.title 
 * @param {string} [options.filename] 
 */
export async function exportAsPdf(element, { title = 'City Comparison', filename } = {}) {
  const safeName = (filename || title).replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'comparison';

  element.classList.add('pdf-export-mode');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#0c0e14',
    logging: false,
    windowWidth: 1100,
  });

  element.classList.remove('pdf-export-mode');

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  const pdfWidth = 210;
  const pdfHeight = 297;
  const margin = 10;
  const contentWidth = pdfWidth - margin * 2;
  const contentHeight = (imgHeight / imgWidth) * contentWidth;

  const pdf = new jsPDF({
    orientation: contentHeight > pdfHeight * 1.2 ? 'portrait' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  pdf.setFillColor(12, 14, 20); 
  pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

  pdf.setDrawColor(110, 86, 255);
  pdf.setLineWidth(1.5);
  pdf.line(margin, 8, pdfWidth - margin, 8);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`MetroScope Flow — ${title}`, margin, 16);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(160, 160, 180);
  pdf.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, 21);

  pdf.setDrawColor(110, 86, 255);
  pdf.setLineWidth(0.3);
  pdf.line(margin, 24, pdfWidth - margin, 24);

  const headerHeight = 28;
  const footerHeight = 12;
  const availableHeight = pdfHeight - headerHeight - footerHeight;
  const scaledHeight = contentHeight;

  if (scaledHeight <= availableHeight) {
    pdf.addImage(imgData, 'PNG', margin, headerHeight, contentWidth, scaledHeight);
  } else {
    let remainingHeight = imgHeight;
    let sourceY = 0;
    let isFirstPage = true;

    while (remainingHeight > 0) {
      const pageAvailable = isFirstPage ? availableHeight : pdfHeight - margin * 2 - footerHeight;
      const pageAvailablePx = (pageAvailable / contentWidth) * imgWidth;
      const sliceHeight = Math.min(remainingHeight, pageAvailablePx);
      const sliceHeightMm = (sliceHeight / imgWidth) * contentWidth;

      if (!isFirstPage) {
        pdf.addPage();
        pdf.setFillColor(12, 14, 20);
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
      }

      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = imgWidth;
      sliceCanvas.height = sliceHeight;
      const ctx = sliceCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, sourceY, imgWidth, sliceHeight, 0, 0, imgWidth, sliceHeight);

      const sliceData = sliceCanvas.toDataURL('image/png');
      const yOffset = isFirstPage ? headerHeight : margin;
      pdf.addImage(sliceData, 'PNG', margin, yOffset, contentWidth, sliceHeightMm);

      sourceY += sliceHeight;
      remainingHeight -= sliceHeight;
      isFirstPage = false;
    }
  }

  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(120, 120, 140);
    pdf.text('metroscope-flow · Know Before You Move', margin, pdfHeight - 5);
    pdf.text(`Page ${i} of ${pageCount}`, pdfWidth - margin, pdfHeight - 5, { align: 'right' });
  }

  pdf.save(`${safeName}.pdf`);
}

/**
 * @param {HTMLElement} element 
 * @param {object} options
 * @param {string} [options.filename] 
 */
export async function exportAsPng(element, { filename = 'comparison' } = {}) {
  const safeName = filename.replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'comparison';

  element.classList.add('pdf-export-mode');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#0c0e14',
    logging: false,
    windowWidth: 1100,
  });

  element.classList.remove('pdf-export-mode');

  const link = document.createElement('a');
  link.download = `${safeName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
