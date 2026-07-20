const path = require('path');
const resumeControllerPath = require.resolve('./controllers/resumeController');
console.log('cwd', process.cwd());
console.log('resumeControllerPath', resumeControllerPath);
const resumeCtrl = require('./controllers/resumeController');
const auth = require('./middleware/authMiddleware');
console.log('resumeCtrl keys', Object.keys(resumeCtrl));
console.log('types', typeof resumeCtrl.getResumes, typeof resumeCtrl.uploadResume, typeof resumeCtrl.deleteResume, typeof auth);
