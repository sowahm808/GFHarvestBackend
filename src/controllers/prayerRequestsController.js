const { firestore } = require('../config/firebase');
const db = firestore;

function computeAgeData(birthday) {
  if (!birthday) return {};
  const birthDate = new Date(birthday);
  if (Number.isNaN(birthDate.getTime())) return {};
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  const ageGroup = age >= 18 ? 'adult' : 'child';
  const color = ageGroup === 'adult' ? 'purple' : 'blue';
  return { age, ageGroup, color };
}

exports.addRequest = async (req, res) => {
  const { userId, text, birthday, timeZone, gender } = req.body;
  if (!userId || !text) {
    return res.status(400).json({ message: 'userId and text are required' });
  }
  try {
    const ageData = computeAgeData(birthday);
    const docData = {
      userId,
      text,
      birthday: birthday || null,
      timeZone: timeZone || null,
      gender: gender || null,
      ...ageData,
      createdAt: new Date().toISOString(),
      prayedAt: null,
    };
    const docRef = await db.collection('prayerRequests').add(docData);
    res.status(201).json({ id: docRef.id, ...docData });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.listRequests = async (req, res) => {
  try {
    let query = db.collection('prayerRequests');
    if (req.query.userId) {
      query = query.where('userId', '==', req.query.userId);
    }
    const snapshot = await query.get();
    const requests = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.updateRequest = async (req, res) => {
  const { id } = req.params;
  const { text, birthday, timeZone, gender } = req.body;
  if (!text && !birthday && !timeZone && !gender) {
    return res
      .status(400)
      .json({ message: 'text, birthday, timeZone or gender must be provided' });
  }
  const updates = {};
  if (text) updates.text = text;
  if (birthday !== undefined) {
    updates.birthday = birthday;
    Object.assign(updates, computeAgeData(birthday));
  }
  if (timeZone !== undefined) updates.timeZone = timeZone;
  if (gender !== undefined) updates.gender = gender;
  try {
    await db.collection('prayerRequests').doc(id).update(updates);
    res.json({ id, ...updates });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.markPrayed = async (req, res) => {
  const { id } = req.params;
  const timestamp = new Date().toISOString();
  try {
    await db.collection('prayerRequests').doc(id).update({ prayedAt: timestamp });
    res.json({ id, prayedAt: timestamp });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
