const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const serviceAccount = require('./src/config/firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const files = [
  { file: 'quiz_jan_mar.json', quarter: 'Q1' },
  { file: 'quiz_apr_jun.json', quarter: 'Q2' },
  { file: 'quiz_jul_sep.json', quarter: 'Q3' },
  { file: 'quiz_oct_dec.json', quarter: 'Q4' },
];

async function uploadAll() {
  for (const { file, quarter } of files) {
    const filePath = path.resolve(__dirname, 'Data', file);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Skipping ${file}: file not found`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const batch = db.batch();
    const collectionRef = db.collection('bibleQuestions');

    data.forEach((entry) => {
      const docRef = collectionRef.doc(entry.id || uuidv4());
      batch.set(docRef, { ...entry, quarter });
    });

    await batch.commit();
    console.log(`✅ Uploaded ${data.length} questions from ${file} (${quarter})`);
  }
}

uploadAll()
  .then(() => console.log('🚀 All uploads complete'))
  .catch((err) => console.error('❌ Upload failed:', err));
