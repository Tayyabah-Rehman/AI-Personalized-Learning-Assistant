export const MODULES = [
  {
    id: "python-basics",
    title: "Python Basics",
    description: "Variables, data types, loops, and functions",
    icon: "🐍",
    totalLessons: 5,
    lessons: [
      { id: "py-1", title: "Variables & Data Types", difficulty: "Beginner", duration: 15 },
      { id: "py-2", title: "Control Flow (if/else)", difficulty: "Beginner", duration: 20 },
      { id: "py-3", title: "Loops (for/while)", difficulty: "Beginner", duration: 20 },
      { id: "py-4", title: "Functions", difficulty: "Intermediate", duration: 25 },
      { id: "py-5", title: "File Handling", difficulty: "Intermediate", duration: 25 },
    ],
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Supervised, unsupervised, and model evaluation",
    icon: "🤖",
    totalLessons: 5,
    lessons: [
      { id: "ml-1", title: "Intro to ML & Scikit-learn", difficulty: "Intermediate", duration: 30 },
      { id: "ml-2", title: "Linear & Logistic Regression", difficulty: "Intermediate", duration: 30 },
      { id: "ml-3", title: "Decision Trees & Random Forest", difficulty: "Intermediate", duration: 35 },
      { id: "ml-4", title: "Model Evaluation & Metrics", difficulty: "Intermediate", duration: 30 },
      { id: "ml-5", title: "Unsupervised Learning (K-Means)", difficulty: "Advanced", duration: 35 },
    ],
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "HTML, CSS, JavaScript, and React fundamentals",
    icon: "🌐",
    totalLessons: 5,
    lessons: [
      { id: "web-1", title: "HTML Fundamentals", difficulty: "Beginner", duration: 20 },
      { id: "web-2", title: "CSS Styling & Flexbox", difficulty: "Beginner", duration: 25 },
      { id: "web-3", title: "JavaScript Essentials", difficulty: "Intermediate", duration: 30 },
      { id: "web-4", title: "React Basics", difficulty: "Intermediate", duration: 35 },
      { id: "web-5", title: "APIs & Fetch", difficulty: "Intermediate", duration: 30 },
    ],
  },
  {
    id: "data-analysis",
    title: "Data Analysis",
    description: "Pandas, NumPy, and data visualization",
    icon: "📊",
    totalLessons: 4,
    lessons: [
      { id: "da-1", title: "NumPy Arrays", difficulty: "Beginner", duration: 20 },
      { id: "da-2", title: "Pandas DataFrames", difficulty: "Intermediate", duration: 30 },
      { id: "da-3", title: "Data Cleaning & EDA", difficulty: "Intermediate", duration: 35 },
      { id: "da-4", title: "Matplotlib & Seaborn Visualization", difficulty: "Intermediate", duration: 30 },
    ],
  },
  {
    id: "generative-ai",
    title: "Generative AI",
    description: "LLMs, prompt engineering, RAG, and building AI apps",
    icon: "✨",
    totalLessons: 6,
    lessons: [
      { id: "gen-1", title: "Introduction to Generative AI & LLMs", difficulty: "Beginner", duration: 25 },
      { id: "gen-2", title: "Prompt Engineering Techniques", difficulty: "Beginner", duration: 30 },
      { id: "gen-3", title: "OpenAI API — Chat & Completions", difficulty: "Intermediate", duration: 35 },
      { id: "gen-4", title: "LangChain Fundamentals", difficulty: "Intermediate", duration: 40 },
      { id: "gen-5", title: "Retrieval-Augmented Generation (RAG)", difficulty: "Advanced", duration: 45 },
      { id: "gen-6", title: "Building & Deploying AI Apps", difficulty: "Advanced", duration: 40 },
    ],
  },
  {
    id: "computer-vision",
    title: "Computer Vision",
    description: "Image processing, CNNs, object detection with OpenCV & YOLO",
    icon: "👁️",
    totalLessons: 6,
    lessons: [
      { id: "cv-1", title: "Image Basics with OpenCV", difficulty: "Beginner", duration: 25 },
      { id: "cv-2", title: "Image Preprocessing & Transformations", difficulty: "Beginner", duration: 30 },
      { id: "cv-3", title: "Convolutional Neural Networks (CNNs)", difficulty: "Intermediate", duration: 40 },
      { id: "cv-4", title: "Transfer Learning (ResNet, VGG)", difficulty: "Intermediate", duration: 35 },
      { id: "cv-5", title: "Object Detection with YOLOv8", difficulty: "Advanced", duration: 45 },
      { id: "cv-6", title: "Object Tracking & Segmentation", difficulty: "Advanced", duration: 45 },
    ],
  },
  {
    id: "nlp",
    title: "NLP",
    description: "Text processing, transformers, sentiment analysis & more",
    icon: "💬",
    totalLessons: 6,
    lessons: [
      { id: "nlp-1", title: "Text Preprocessing & Tokenization", difficulty: "Beginner", duration: 25 },
      { id: "nlp-2", title: "Bag of Words & TF-IDF", difficulty: "Beginner", duration: 30 },
      { id: "nlp-3", title: "Word Embeddings (Word2Vec, GloVe)", difficulty: "Intermediate", duration: 35 },
      { id: "nlp-4", title: "Transformers & BERT", difficulty: "Intermediate", duration: 45 },
      { id: "nlp-5", title: "Sentiment Analysis & Text Classification", difficulty: "Intermediate", duration: 35 },
      { id: "nlp-6", title: "Named Entity Recognition (NER)", difficulty: "Advanced", duration: 40 },
    ],
  },
  {
    id: "data-science",
    title: "Data Science",
    description: "End-to-end data science pipeline, statistics & feature engineering",
    icon: "🔬",
    totalLessons: 6,
    lessons: [
      { id: "ds-1", title: "Data Science Pipeline Overview", difficulty: "Beginner", duration: 20 },
      { id: "ds-2", title: "Statistics & Probability for DS", difficulty: "Beginner", duration: 30 },
      { id: "ds-3", title: "Feature Engineering & Selection", difficulty: "Intermediate", duration: 35 },
      { id: "ds-4", title: "Hypothesis Testing & A/B Testing", difficulty: "Intermediate", duration: 35 },
      { id: "ds-5", title: "Model Deployment with Streamlit", difficulty: "Intermediate", duration: 40 },
      { id: "ds-6", title: "End-to-End DS Project Walkthrough", difficulty: "Advanced", duration: 50 },
    ],
  },
];

export function getModuleById(id) {
  return MODULES.find((m) => m.id === id);
}

export function getLessonById(moduleId, lessonId) {
  const module = getModuleById(moduleId);
  if (!module) return null;
  return module.lessons.find((l) => l.id === lessonId);
}
