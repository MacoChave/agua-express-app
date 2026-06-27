import { NextResponse } from 'next/server';

export async function GET() {
  // Mock PDF content (a basic valid PDF file structure).
  // In a real application, you would generate a PDF based on actual data
  // using a library like pdf-lib, pdfkit, or react-pdf.
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 73 >>
stream
BT
/F1 24 Tf
100 700 Td
(Reporte de Agua Express) Tj
0 -30 Td
(Generado desde el sistema) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000227 00000 n 
0000000315 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
437
%%EOF`;

  return new NextResponse(pdfContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="reporte_dashboard.pdf"',
    },
  });
}
