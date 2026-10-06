const mongoose = require('mongoose');

/**
 * PYQ model — Previous Year Question Papers.
 * Maps to 'pyqs' collection. Supports all 6 BCA semesters.
 */
const pyqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'PYQ title is required'],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
      enum: [
        'semester-1',
        'semester-2',
        'semester-3',
        'semester-4',
        'semester-5',
        'semester-6',
      ],
    },
    semesterNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    semesterLabel: {
      type: String,
      default: '',
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    subjectCode: {
      type: String,
      default: '',
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Exam year is required'],
    },
    examType: {
      type: String,
      default: 'BNMU University Exam',
      trim: true,
    },
    paperType: {
      type: String,
      enum: ['Theory Paper', 'Practical Paper', 'Project', 'Viva'],
      default: 'Theory Paper',
    },
    maxMarks: {
      type: Number,
      default: 80,
    },
    duration: {
      type: String,
      default: '3 Hours',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    topicsCovered: {
      type: [String],
      default: [],
    },
    fileUrl: {
      type: String,
      default: '',
      trim: true,
    },
    fileName: {
      type: String,
      default: '',
      trim: true,
    },
    fileSize: {
      type: String,
      default: '',
      trim: true,
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

pyqSchema.index({ semester: 1, year: -1 });
pyqSchema.index({ subject: 'text', description: 'text' });
pyqSchema.index({ semesterNumber: 1, status: 1 });

module.exports = mongoose.model('PYQ', pyqSchema);
