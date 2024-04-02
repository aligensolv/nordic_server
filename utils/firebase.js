import Admin from 'firebase-admin';

import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

Admin.initializeApp({
  credential: Admin.credential.cert(serviceAccount),
});

export default Admin;