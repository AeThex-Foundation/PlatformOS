const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 60, bottom: 60, left: 60, right: 60 }
});

const outputPath = path.join(__dirname, '..', 'public', 'docs', 'foundry-syllabus-v1.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const gold = '#D4AF37';
const darkRed = '#8B0000';
const black = '#000000';
const gray = '#666666';

doc.rect(0, 0, doc.page.width, 80).fill('#1a1a1a');
doc.fillColor(gold).fontSize(24).font('Helvetica-Bold')
   .text('AETHEX LABS // FOUNDRY SYLLABUS v1.0', 60, 25);
doc.fillColor('#cccccc').fontSize(10).font('Helvetica')
   .text('CLASSIFICATION: PUBLIC / COHORT 01', 60, 52);
doc.text('INSTRUCTOR: ANDERSON GLADNEY (mrpiglr)', 60, 64);

doc.y = 100;

doc.fillColor(darkRed).fontSize(16).font('Helvetica-Bold')
   .text('01 // MISSION OBJECTIVE', 60, doc.y);
doc.moveDown(0.5);
doc.fillColor(black).fontSize(11).font('Helvetica')
   .text('The Foundry is not a coding bootcamp. It is an architectural residency. The objective is to train the first 10 "AeThex Architects"—builders capable of designing high-concurrency, persistent metaverse systems using the proprietary tools developed by AeThex Labs.', {
     width: 490,
     align: 'left'
   });

doc.moveDown(1.5);

doc.fillColor(darkRed).fontSize(16).font('Helvetica-Bold')
   .text('02 // THE CURRICULUM');
doc.moveDown(0.8);

doc.fillColor(gold).fontSize(13).font('Helvetica-Bold')
   .text('PHASE 1: THE INFRASTRUCTURE (Weeks 1-2)');
doc.moveDown(0.3);
doc.fillColor(black).fontSize(11).font('Helvetica-Bold')
   .text('The Root: ', { continued: true });
doc.font('Helvetica').text('Understanding the .aethex TLD and alternative root systems.');
doc.font('Helvetica-Bold').text('The Security: ', { continued: true });
doc.font('Helvetica').text('Deconstructing Warden (Browser-side security) and how it evolves into the AEGIS Protocol.');
doc.font('Helvetica-Bold').text('The Identity: ', { continued: true });
doc.font('Helvetica').text('Implementing AeThex Passport (SSO) for cross-platform persistence.');

doc.moveDown(0.8);
doc.fillColor(gold).fontSize(13).font('Helvetica-Bold')
   .text('PHASE 2: THE ARCHITECTURE (Weeks 3-4)');
doc.moveDown(0.3);
doc.fillColor(black).fontSize(11).font('Helvetica-Bold')
   .text('Concurrency: ', { continued: true });
doc.font('Helvetica').text('Lessons from Lone Star Studio. How to manage economy and physics for 1,000+ concurrent users.');
doc.font('Helvetica-Bold').text('The Sync Layer: ', { continued: true });
doc.font('Helvetica').text('Introduction to NEXUS—the invisible thread connecting web, game engine, and blockchain.');

doc.moveDown(0.8);
doc.fillColor(gold).fontSize(13).font('Helvetica-Bold')
   .text('PHASE 3: THE BUILD (Weeks 5-6)');
doc.moveDown(0.3);
doc.fillColor(black).fontSize(11).font('Helvetica-Bold')
   .text('Deployment: ', { continued: true });
doc.font('Helvetica').text('Launching your first live application on the AeThex Network.');
doc.font('Helvetica-Bold').text('The Thesis: ', { continued: true });
doc.font('Helvetica').text('Each Architect must ship one functional module to graduate.');

doc.moveDown(1.5);

doc.fillColor(darkRed).fontSize(16).font('Helvetica-Bold')
   .text('03 // THE ASSETS');
doc.moveDown(0.5);
doc.fillColor(black).fontSize(11).font('Helvetica-Bold')
   .text('Access: ', { continued: true });
doc.font('Helvetica').text('Direct Discord channel with the Founding Team.');
doc.font('Helvetica-Bold').text('Real Estate: ', { continued: true });
doc.font('Helvetica').text('Priority Reservation of one (1) Premium .aethex Domain.');
doc.font('Helvetica-Bold').text('Certification: ', { continued: true });
doc.font('Helvetica').text('"AeThex Certified Architect" Badge (Metadata on Passport).');

doc.moveDown(1.5);

doc.fillColor(darkRed).fontSize(16).font('Helvetica-Bold')
   .text('04 // ENTRY REQUIREMENT');
doc.moveDown(0.5);
doc.fillColor(black).fontSize(11).font('Helvetica-Bold')
   .text('Cost: ', { continued: true });
doc.font('Helvetica').text('$500 USD.');
doc.font('Helvetica-Bold').text('Prerequisites: ', { continued: true });
doc.font('Helvetica').text('Basic understanding of Web2 (JS/React) or Game Dev (Lua/C#).');
doc.font('Helvetica-Bold').text('Commitment: ', { continued: true });
doc.font('Helvetica').text('6 Weeks. Asynchronous + Weekly Live Code Review.');

const footerY = doc.page.height - 40;
doc.rect(0, footerY - 10, doc.page.width, 50).fill('#1a1a1a');
doc.fillColor(gray).fontSize(9).font('Helvetica')
   .text('Managed by AeThex Labs. Powered by AeThex Corporation. Protected by AeThex Foundation.', 60, footerY, {
     width: 490,
     align: 'center'
   });

doc.end();

stream.on('finish', () => {
  console.log('PDF generated successfully:', outputPath);
});
