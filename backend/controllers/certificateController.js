const PDFDocument = require('pdfkit');
const Registration = require('../models/Registration');

/**
 * GET /api/certificates/:registrationId
 * Generate a participation certificate PDF for an approved registration
 */
exports.generateCertificate = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.registrationId)
      .populate('tournament', 'sport venue tournamentDate')
      .populate('user', 'username email');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Only approved registrations can get certificates
    if (registration.status !== 'approved') {
      return res.status(400).json({ message: 'Certificate is only available for approved registrations' });
    }

    // Only the user themselves or admin can generate
    if (req.user.role !== 'admin' && registration.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
    });

    // Set response headers for PDF download
    const filename = `certificate_${registration.teamName.replace(/\s+/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // --- Certificate Design ---
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Border
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
      .lineWidth(3)
      .strokeColor('#1e40af')
      .stroke();

    // Inner border
    doc.rect(40, 40, pageWidth - 80, pageHeight - 80)
      .lineWidth(1)
      .strokeColor('#93c5fd')
      .stroke();

    // Header decorative line
    doc.moveTo(100, 100)
      .lineTo(pageWidth - 100, 100)
      .lineWidth(2)
      .strokeColor('#1e40af')
      .stroke();

    // Title
    doc.fontSize(16)
      .fillColor('#64748b')
      .text('SPORTSYNC TOURNAMENT', 0, 70, { align: 'center' });

    doc.fontSize(36)
      .fillColor('#1e40af')
      .font('Helvetica-Bold')
      .text('CERTIFICATE', 0, 120, { align: 'center' });

    doc.fontSize(20)
      .fillColor('#059669')
      .text('OF PARTICIPATION', 0, 165, { align: 'center' });

    // Decorative line
    doc.moveTo(250, 200)
      .lineTo(pageWidth - 250, 200)
      .lineWidth(1)
      .strokeColor('#e2e8f0')
      .stroke();

    // Body text
    doc.fontSize(14)
      .fillColor('#334155')
      .font('Helvetica')
      .text('This is to certify that', 0, 220, { align: 'center' });

    // Team Name
    doc.fontSize(28)
      .fillColor('#0f172a')
      .font('Helvetica-Bold')
      .text(registration.teamName, 0, 250, { align: 'center' });

    // Captain info
    doc.fontSize(12)
      .fillColor('#64748b')
      .font('Helvetica')
      .text(`Captain: ${registration.captainName}`, 0, 290, { align: 'center' });

    // Participation text
    doc.fontSize(14)
      .fillColor('#334155')
      .font('Helvetica')
      .text('has successfully participated in the', 0, 320, { align: 'center' });

    // Sport name
    doc.fontSize(24)
      .fillColor('#059669')
      .font('Helvetica-Bold')
      .text(`${registration.tournament.sport} Tournament`, 0, 348, { align: 'center' });

    // Venue and Date
    const tournamentDate = new Date(registration.tournament.tournamentDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    doc.fontSize(12)
      .fillColor('#64748b')
      .font('Helvetica')
      .text(`Venue: ${registration.tournament.venue}  |  Date: ${tournamentDate}`, 0, 385, { align: 'center' });

    // College
    doc.fontSize(12)
      .fillColor('#64748b')
      .text(`College: ${registration.collegeName}`, 0, 408, { align: 'center' });

    // Bottom decorative line
    doc.moveTo(100, 450)
      .lineTo(pageWidth - 100, 450)
      .lineWidth(2)
      .strokeColor('#1e40af')
      .stroke();

    // Signature lines
    doc.fontSize(10)
      .fillColor('#94a3b8')
      .text('________________________', 120, 470, { align: 'left' })
      .text('Tournament Organizer', 120, 490, { align: 'left' });

    doc.text('________________________', pageWidth - 300, 470, { align: 'left' })
      .text('Sports Coordinator', pageWidth - 300, 490, { align: 'left' });

    // Footer
    doc.fontSize(9)
      .fillColor('#cbd5e1')
      .text(`Certificate ID: ${registration._id}`, 0, pageHeight - 80, { align: 'center' })
      .text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 0, pageHeight - 65, { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ message: 'Server error generating certificate' });
  }
};
