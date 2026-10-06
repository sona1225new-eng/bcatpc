const mongoose = require('mongoose');

// Sub-schemas for nested academic structures
const subjectSchema = new mongoose.Schema(
  {
    code: { type: String, default: '' },
    name: { type: String, required: true },
    type: { type: String, enum: ['Theory', 'Practical', 'Project', 'Seminar'], default: 'Theory' },
    marks: { type: Number, default: 100 },
    credits: { type: Number, default: 4 },
  },
  { _id: false }
);

const semesterStructureSchema = new mongoose.Schema(
  {
    semester: { type: Number, required: true, min: 1, max: 6 },
    title: { type: String, default: '' },
    credits: { type: Number, default: 0 },
    subjects: [subjectSchema],
  },
  { _id: false }
);

const laboratorySchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    room: { type: String, default: '' },
    capacity: { type: String, default: '' },
    inCharge: { type: String, default: '' },
    software: [{ type: String }],
    description: { type: String, default: '' },
    keyPracticals: [{ type: String }],
  },
  { _id: false }
);

const careerPathwaySchema = new mongoose.Schema(
  {
    role: { type: String, default: '' },
    salary: { type: String, default: '' },
    icon: { type: String, default: '' },
  },
  { _id: false }
);

/**
 * Academic model — maps to 'academics' collection.
 * Stores the full BCA program overview, semester structure, and labs info.
 * Typically a single document; use Admin Dashboard to update it.
 */
const academicSchema = new mongoose.Schema(
  {
    programTitle: {
      type: String,
      default: 'Bachelor of Computer Applications (BCA)',
    },
    degree: { type: String, default: 'Undergraduate Degree (B.C.A.)' },
    duration: { type: String, default: '3 Years (6 Semesters)' },
    intake: { type: Number, default: 60 },
    affiliation: { type: String, default: 'B.N. Mandal University, Madhepura' },
    curriculumFramework: { type: String, default: 'Choice Based Credit System (CBCS) & NEP Aligned' },
    overview: { type: String, default: '' },
    objectives: [{ type: String }],
    eligibility: {
      qualification: { type: String, default: '' },
      subjectRequirement: { type: String, default: '' },
      minimumMarks: { type: String, default: '' },
      selectionCriteria: { type: String, default: '' },
    },
    careerPathways: [careerPathwaySchema],
    semestersStructure: [semesterStructureSchema],
    laboratories: [laboratorySchema],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Academic', academicSchema);
