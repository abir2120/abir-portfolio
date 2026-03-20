/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              PORTFOLIO DATA — SINGLE SOURCE OF TRUTH        ║
 * ║                                                              ║
 * ║  Edit ALL your portfolio content from this one file.         ║
 * ║  Or use the visual Editor panel on the site (⚙ icon).       ║
 * ║                                                              ║
 * ║  Changes made in the visual editor are saved to              ║
 * ║  localStorage and override these defaults at runtime.        ║
 * ║  To reset, click "Reset to Defaults" in the editor.         ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ─── UPLOADED FILE METADATA ──────────────────────────────────
export interface UploadedFile {
  name: string
  type: string        // MIME type e.g. "application/pdf", "image/png"
  size: number        // bytes
  dataUrl: string     // base64 data URL for storage
  uploadedAt: string  // ISO date string
}

// ─── PROFILE / HEADER ────────────────────────────────────────
export interface ProfileData {
  initials: string
  fullName: string
  title: string
  logoUrl: string
  headerTagline1: string
  headerTagline2: string
}

export const defaultProfile: ProfileData = {
  initials: 'M A',
  fullName: 'M A',
  title: 'Building Engineer',
  logoUrl: '/logo-ma.png',
  headerTagline1: 'Portfolio 2025',
  headerTagline2: 'Architecture',
}

// ─── HOME SECTION ────────────────────────────────────────────
export interface StatItem {
  value: string
  label: string
}

export interface HomeData {
  subtitle: string
  headline: string
  headlineAccent: string
  headlineSuffix: string
  introParagraph: string
  descriptionParagraph: string
  stats: StatItem[]
  specializations: string[]
}

export const defaultHome: HomeData = {
  subtitle: 'Welcome',
  headline: 'Designing the ',
  headlineAccent: 'future',
  headlineSuffix: ',\none structure at a time.',
  introParagraph:
    "I'm M A, a building engineer passionate about creating innovative, sustainable, and aesthetically compelling structures. With expertise spanning structural analysis, architectural design, and modern construction methodologies, I bring visions to life.",
  descriptionParagraph:
    'This interactive portfolio showcases my journey through the lens of architecture — each floor of this building represents a facet of my professional identity. Explore by clicking the floors or using the navigation.',
  stats: [
    { value: '50+', label: 'Projects' },
    { value: '12', label: 'Years Exp.' },
    { value: '8', label: 'Awards' },
  ],
  specializations: [
    'Structural Engineering',
    'Sustainable Design',
    'BIM Modeling',
    'Urban Planning',
    'Seismic Analysis',
  ],
}

// ─── ABOUT SECTION ───────────────────────────────────────────
export interface TimelineItem {
  year: string
  title: string
  desc: string
}

export interface SkillItem {
  skill: string
  level: number
}

export interface AboutData {
  subtitle: string
  headline: string
  headlineAccent: string
  headlineSuffix: string
  bio1: string
  bio2: string
  timeline: TimelineItem[]
  skills: SkillItem[]
}

export const defaultAbout: AboutData = {
  subtitle: 'Biography',
  headline: 'Building with ',
  headlineAccent: 'purpose',
  headlineSuffix: ' & precision',
  bio1: 'With over a decade of experience in building engineering, I have contributed to projects ranging from residential complexes to commercial high-rises. My approach combines technical rigor with creative vision, ensuring every structure I design is both functional and inspiring.',
  bio2: "I hold a Master's degree in Structural Engineering and am a certified Professional Engineer (PE). My work has been recognized by multiple industry bodies for innovation in sustainable construction practices.",
  timeline: [
    { year: '2013', title: 'B.Sc. Civil Engineering', desc: 'Graduated with honors' },
    { year: '2015', title: 'M.Sc. Structural Engineering', desc: 'Research in seismic-resistant design' },
    { year: '2016', title: 'Junior Engineer at Apex Structures', desc: 'Residential & commercial projects' },
    { year: '2019', title: 'Senior Engineer at UrbanEdge', desc: 'Led 20+ major projects' },
    { year: '2022', title: 'Principal Engineer & Consultant', desc: 'Independent practice, global clients' },
  ],
  skills: [
    { skill: 'Structural Analysis', level: 95 },
    { skill: 'AutoCAD / Revit', level: 90 },
    { skill: 'BIM Coordination', level: 88 },
    { skill: 'Sustainable Design', level: 85 },
    { skill: 'Project Management', level: 82 },
  ],
}

// ─── PROJECTS SECTION ────────────────────────────────────────
export interface ProjectItem {
  title: string
  category: string
  year: string
  image: string
  description: string
  stats: { floors: number | string; area: string; status: string }
  gallery: string[]            // additional image data URLs
  documents: UploadedFile[]    // blueprints, PDFs, etc.
}

export interface ProjectsData {
  subtitle: string
  headline: string
  headlineAccent: string
  projects: ProjectItem[]
}

export const defaultProjects: ProjectsData = {
  subtitle: 'Portfolio',
  headline: 'Featured ',
  headlineAccent: 'projects',
  projects: [
    {
      title: 'Skyline Tower',
      category: 'Commercial',
      year: '2024',
      image: '/images/project1.jpg',
      description: 'A 45-story mixed-use tower featuring a double-skin glass facade and integrated renewable energy systems.',
      stats: { floors: 45, area: '120,000 sqft', status: 'Completed' },
      gallery: [],
      documents: [],
    },
    {
      title: 'Harbor Residences',
      category: 'Residential',
      year: '2023',
      image: '/images/project2.jpg',
      description: 'Luxury waterfront apartments with panoramic views, featuring post-tensioned concrete construction.',
      stats: { floors: 28, area: '85,000 sqft', status: 'Completed' },
      gallery: [],
      documents: [],
    },
    {
      title: 'Nova Civic Center',
      category: 'Institutional',
      year: '2023',
      image: '/images/project3.jpg',
      description: 'A public civic center with a dramatic cantilevered atrium and seismic base isolation system.',
      stats: { floors: 8, area: '45,000 sqft', status: 'Completed' },
      gallery: [],
      documents: [],
    },
    {
      title: 'EcoVerde Complex',
      category: 'Sustainable',
      year: '2022',
      image: '/images/project4.jpg',
      description: 'LEED Platinum certified green building with vertical gardens and net-zero energy design.',
      stats: { floors: 15, area: '62,000 sqft', status: 'Completed' },
      gallery: [],
      documents: [],
    },
  ],
}

// ─── LEARN SECTION ───────────────────────────────────────────
export interface CertificationItem {
  name: string
  issuer: string
  year: string
  document?: UploadedFile    // uploaded certificate file
}

export interface CourseItem {
  name: string
  provider: string
  status: 'Completed' | 'In Progress'
  document?: UploadedFile    // uploaded course certificate
}

export interface PublicationItem {
  title: string
  journal: string
  year: string
  document?: UploadedFile    // uploaded publication PDF
}

export interface LearnData {
  subtitle: string
  headline: string
  headlineAccent: string
  certifications: CertificationItem[]
  courses: CourseItem[]
  publications: PublicationItem[]
}

export const defaultLearn: LearnData = {
  subtitle: 'Credentials',
  headline: 'Knowledge & ',
  headlineAccent: 'certifications',
  certifications: [
    { name: 'Professional Engineer (PE)', issuer: 'National Board of Engineering', year: '2018' },
    { name: 'LEED Accredited Professional', issuer: 'U.S. Green Building Council', year: '2019' },
    { name: 'BIM Manager Certification', issuer: 'BuildingSMART International', year: '2020' },
    { name: 'Seismic Design Specialist', issuer: 'Structural Engineering Institute', year: '2021' },
  ],
  courses: [
    { name: 'Advanced Structural Dynamics', provider: 'MIT OpenCourseWare', status: 'Completed' },
    { name: 'Parametric Design with Grasshopper', provider: 'Coursera', status: 'Completed' },
    { name: 'AI in Construction Management', provider: 'Stanford Online', status: 'In Progress' },
    { name: 'Sustainable Urban Infrastructure', provider: 'edX / TU Delft', status: 'Completed' },
  ],
  publications: [
    { title: 'Innovative Approaches to Seismic Retrofitting in Heritage Buildings', journal: 'J. Structural Engineering', year: '2023' },
    { title: 'Optimizing BIM Workflows for Large-Scale Commercial Projects', journal: 'Construction Innovation', year: '2022' },
    { title: 'Comparative Analysis of Green Building Rating Systems', journal: 'Sustainable Cities & Society', year: '2021' },
  ],
}

// ─── CONTACT SECTION ─────────────────────────────────────────
export interface ContactInfoItem {
  icon: 'MapPin' | 'Mail' | 'Phone'
  label: string
  value: string
}

export interface ContactData {
  subtitle: string
  headline: string
  headlineAccent: string
  headlineSuffix: string
  contactInfo: ContactInfoItem[]
  availabilityText: string
  responseTime: string
}

export const defaultContact: ContactData = {
  subtitle: 'Get in Touch',
  headline: "Let's ",
  headlineAccent: 'build',
  headlineSuffix: ' something together',
  contactInfo: [
    { icon: 'MapPin', label: 'Location', value: 'New York, USA' },
    { icon: 'Mail', label: 'Email', value: 'hello@ma-eng.com' },
    { icon: 'Phone', label: 'Phone', value: '+1 (555) 123-4567' },
  ],
  availabilityText: 'Currently accepting new projects',
  responseTime: 'Average response time: 24 hours',
}

// ─── COMPLETE PORTFOLIO DATA TYPE ────────────────────────────
export interface PortfolioData {
  profile: ProfileData
  home: HomeData
  about: AboutData
  projects: ProjectsData
  learn: LearnData
  contact: ContactData
}

export const defaultPortfolioData: PortfolioData = {
  profile: defaultProfile,
  home: defaultHome,
  about: defaultAbout,
  projects: defaultProjects,
  learn: defaultLearn,
  contact: defaultContact,
}
