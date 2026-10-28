import { CurriculumSubject, CurriculumLesson, PracticeQuestion } from '../types';

export const CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  {
    id: 'math',
    name: 'الرياضيات',
    icon: 'Calculator',
    category: 'مشترك',
    unitsCount: 6,
    lessonsCount: 24,
    availableGrades: ['grade10', 'grade11_sci', 'grade11_lit', 'tawjihi_sci', 'tawjihi_lit'],
    description: 'منهاج كولنز الجديد - التفاضل، التكامل، المتجهات، الإحصاء والاحتمالات.'
  },
  {
    id: 'physics',
    name: 'الفيزياء',
    icon: 'Zap',
    category: 'علمي',
    unitsCount: 5,
    lessonsCount: 18,
    availableGrades: ['grade10', 'grade11_sci', 'tawjihi_sci'],
    description: 'الميكانيكا الخطية والدورانية، الكهرومغناطيسية، فيزياء الكم والفيزياء النووية.'
  },
  {
    id: 'chemistry',
    name: 'الكيمياء',
    icon: 'FlaskConical',
    category: 'علمي',
    unitsCount: 4,
    lessonsCount: 16,
    availableGrades: ['grade10', 'grade11_sci', 'tawjihi_sci'],
    description: 'الحموض والقواعد، سرعة التفاعلات، الاتزان الكيميائي، والكيمياء العضوية.'
  },
  {
    id: 'biology',
    name: 'العلوم الحياتية (الأحياء)',
    icon: 'Dna',
    category: 'علمي',
    unitsCount: 4,
    lessonsCount: 15,
    availableGrades: ['grade10', 'grade11_sci', 'tawjihi_sci'],
    description: 'البيولوجيا الجزيئية، التعبير الجيني، الوراثة المندلية وغير المندلية، المناعة.'
  },
  {
    id: 'arabic',
    name: 'اللغة العربية (مشترك وتخصص)',
    icon: 'BookOpen',
    category: 'مشترك',
    unitsCount: 5,
    lessonsCount: 20,
    availableGrades: ['grade7', 'grade8', 'grade9', 'grade10', 'grade11_sci', 'grade11_lit', 'tawjihi_sci', 'tawjihi_lit'],
    description: 'النحو والصرف (الممنوع من الصرف، التعجب، النداء)، البلاغة والنقد، وفنون الأدب.'
  },
  {
    id: 'english',
    name: 'اللغة الإنجليزية (Action Pack)',
    icon: 'Languages',
    category: 'مشترك',
    unitsCount: 6,
    lessonsCount: 22,
    availableGrades: ['grade10', 'grade11_sci', 'grade11_lit', 'tawjihi_sci', 'tawjihi_lit'],
    description: 'Action Pack Jordan - Conditionals, Passive Voice, Reported Speech, Academic Vocabulary.'
  },
  {
    id: 'jordan_history',
    name: 'تاريخ الأردن',
    icon: 'Landmark',
    category: 'مشترك',
    unitsCount: 4,
    lessonsCount: 14,
    availableGrades: ['tawjihi_sci', 'tawjihi_lit', 'tawjihi_btec'],
    description: 'نشأة إمارة شرق الأردن، المحطات التاريخية الهاشمية، الدستور وتطور الحياة النيابية.'
  },
  {
    id: 'islamic_edu',
    name: 'التربية الإسلامية',
    icon: 'Compass',
    category: 'مشترك',
    unitsCount: 5,
    lessonsCount: 20,
    availableGrades: ['grade10', 'grade11_sci', 'grade11_lit', 'tawjihi_sci', 'tawjihi_lit'],
    description: 'القرآن الكريم، الحديث النبوي الشريف، الفقه الإسلامي، المعاملات، والفكر الإسلامي.'
  }
];

export const VERIFIED_LESSONS: CurriculumLesson[] = [
  {
    id: 'math_tawjihi_1',
    title: 'قاعدة السلسلة ومشتقات الاقترانات المثلثية',
    unitId: 'diff_1',
    unitTitle: 'الوحدة الأولى: التفاضل وتطبيقاته',
    subjectId: 'math',
    subjectName: 'الرياضيات',
    grade: 'tawjihi_sci',
    gradeName: 'التوجيهي العلمي',
    objectives: [
      'تطبيق قاعدة السلسلة لإيجاد مشتقة اقتران مركب f(g(x))',
      'إيجاد مشتقات الاقترانات المثلثية: sin(x), cos(x), tan(x)',
      'التمييز بين اشتقاق زاوية الاقتران واشتقاق الاقتران نفسه'
    ],
    summaryText: 'إذا كان y = f(u) قابلاً للاشتقاق عند u، وكان u = g(x) قابلاً للاشتقاق عند x، فإن: dy/dx = (dy/du) * (du/dx). ومشتقة sin(u) هي cos(u) * u\'.',
    sourceBook: 'الرياضيات - الصف الثاني عشر العلمي (كولنز)، الجزء الأول',
    pageRange: 'ص 42 - 58',
    verified: true,
    sampleQuestionsCount: 12
  },
  {
    id: 'physics_tawjihi_1',
    title: 'الزخم الخطي والتصادمات ثنائية الأبعاد',
    unitId: 'mech_1',
    unitTitle: 'الوحدة الأولى: الزخم الخطي والدفع',
    subjectId: 'physics',
    subjectName: 'الفيزياء',
    grade: 'tawjihi_sci',
    gradeName: 'التوجيهي العلمي',
    objectives: [
      'تعريف الزخم الخطي p = m * v وعلاقته بالدفع I = F * Δt',
      'تطبيق قانون حفظ الزخم الخطي في التصادمات المرنة وغير المرنة',
      'حساب الطاقة الحركية الضائعة في التصادم عديم المرونة'
    ],
    summaryText: 'الزخم الخطي كمية متجهة تساوي حاصل ضرب كتلة الجسم في سرعته المتجهة. ويكون الزخم محفوظاً في أي نظام معزول مغلق: Σp_initial = Σp_final.',
    sourceBook: 'الفيزياء - الصف الثاني عشر العلمي، الجزء الأول (منهاج الأردن)',
    pageRange: 'ص 14 - 36',
    verified: true,
    sampleQuestionsCount: 15
  },
  {
    id: 'chemistry_tawjihi_1',
    title: 'مفهوم برونستد-لوري والأزواج المترافقة',
    unitId: 'chem_acids',
    unitTitle: 'الوحدة الأولى: الحموض والقواعد والاتزان الأيوني',
    subjectId: 'chemistry',
    subjectName: 'الكيمياء',
    grade: 'tawjihi_sci',
    gradeName: 'التوجيهي العلمي',
    objectives: [
      'تعريف الحمض كمانح للبروتون H+ والقاعدة كمستقبل للبروتون',
      'تحديد الأزواج المترافقة (حمض/قاعدة مرافقة) في معادلات التأين',
      'تفسير السلوك الأمفوتيري (المتردد) للماء وبعض الأيونات'
    ],
    summaryText: 'الحمض مادة تمنح بروتوناً أثناء التفاعل، والقاعدة مادة تستقبل بروتوناً. كل حمض يتحول إلى قاعدة مرافقة، وكل قاعدة تتحول إلى حمض مرافق.',
    sourceBook: 'الكيمياء - الصف الثاني عشر العلمي، الجزء الأول',
    pageRange: 'ص 18 - 32',
    verified: true,
    sampleQuestionsCount: 14
  },
  {
    id: 'arabic_tawjihi_1',
    title: 'أسلوب التعجب (القياسي والسماعي)',
    unitId: 'arabic_grammar_1',
    unitTitle: 'قواعد اللغة العربية المشتركة',
    subjectId: 'arabic',
    subjectName: 'اللغة العربية',
    grade: 'tawjihi_sci',
    gradeName: 'التوجيهي المشترك',
    objectives: [
      'التعرف على صيغتي التعجب القياسي: ما أَفْعَلَه و أَفْعِلْ بِه',
      'إعراب جملة التعجب: (ما: اسم تعجب في محل رفع مبتدأ، أفعل: فعل ماض، والفاعل مستتر، والمتعجب منه: مفعول به)',
      'التمييز بين التعجب القياسي والتعجب السماعي (مثل: لله درّه، سبحان الله)'
    ],
    summaryText: 'للتعجب صيغتان قياسيتان: "ما أفعَلَه" و "أَفْعِلْ به". صيغة "ما أفعله" تتكون من ما التعجبية وفعل التعجب والمتعجب منه ويكون منصوباً.',
    sourceBook: 'اللغة العربية المشتركة - المهارات، كتاب التوجيهي المعتمد',
    pageRange: 'ص 22 - 27',
    verified: true,
    sampleQuestionsCount: 10
  },
  {
    id: 'history_tawjihi_1',
    title: 'دستور عام 1952 وتطوره في عهد الملك طلال',
    unitId: 'hist_jordan_1',
    unitTitle: 'الوحدة الأولى: الإنجازات السياسية والدستورية للأردن',
    subjectId: 'jordan_history',
    subjectName: 'تاريخ الأردن',
    grade: 'tawjihi_sci',
    gradeName: 'التوجيهي المشترك',
    objectives: [
      'استنتاج أهم المبادئ التي أقرها دستور 1952 في عهد الملك طلال بن عبد الله',
      'توضيح مبدأ مسؤولية الوزارة أمام مجلس النواب',
      'بيان إقرار مجانية التعليم وإلزاميته'
    ],
    summaryText: 'صدر دستور 1952 في عهد الملك طلال، ويعد من أرقى الدساتير، حيث أقر أن الأمة مصدر السلطات وجعل الحكومة مسؤولة أمام البرلمان وأقر مجانية التعليم وإلزاميته.',
    sourceBook: 'تاريخ الأردن - مقرر شهادة الدراسة الثانوية العامة، وزارة التربية والتعليم',
    pageRange: 'ص 35 - 41',
    verified: true,
    sampleQuestionsCount: 12
  }
];

export const SAMPLE_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'q_math_01',
    subjectId: 'math',
    unitTitle: 'التفاضل وتطبيقاته',
    lessonTitle: 'قاعدة السلسلة',
    grade: 'tawjihi_sci',
    difficulty: 'توجيهي وزارة',
    type: 'mcq',
    question: 'إذا كان y = sin(3x² + 5)، فما هي المشتقة الأولى dy/dx؟',
    options: [
      '6x · cos(3x² + 5)',
      'cos(3x² + 5)',
      '6x · sin(3x² + 5)',
      '-6x · cos(3x² + 5)'
    ],
    correctAnswer: 0,
    explanation: 'باستخدام قاعدة السلسلة: مشتقة sin(u) هي cos(u) مضروبة في مشتقة الزاوية u\' = 6x. إذن: dy/dx = 6x · cos(3x² + 5).',
    learningObjective: 'إيجاد مشتقة الاقترانات المثلثية المركبة باستخدام قاعدة السلسلة',
    sourceReference: 'منهاج كولنز للرياضيات العلمي - صفحة 48'
  },
  {
    id: 'q_chem_01',
    subjectId: 'chemistry',
    unitTitle: 'الحموض والقواعد',
    lessonTitle: 'الأزواج المترافقة',
    grade: 'tawjihi_sci',
    difficulty: 'متوسط',
    type: 'mcq',
    question: 'في التفاعل: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻، ما هي القاعدة المرافقة للماء H₂O؟',
    options: [
      'OH⁻',
      'NH₄⁺',
      'H₃O⁺',
      'NH₃'
    ],
    correctAnswer: 0,
    explanation: 'الماء هنا يسلك كحمض لأنه منح بروتوناً H+، وعندما يفقد الحمض H+ يتحول إلى قاعدته المرافقة وهي أيون الهيدروكسيد OH⁻.',
    learningObjective: 'تحديد الحمض والقاعدة المرافقة وفق مفهوم برونستد-لوري',
    sourceReference: 'كتاب الكيمياء التوجيهي العلمي - صفحة 24'
  },
  {
    id: 'q_physics_01',
    subjectId: 'physics',
    unitTitle: 'الزخم الخطي والدفع',
    lessonTitle: 'حفظ الزخم',
    grade: 'tawjihi_sci',
    difficulty: 'متوسط',
    type: 'mcq',
    question: 'جسم كتلته 2 kg يتحرك بسرعة 6 m/s شرقاً، تصادم مع جسم ساكن كتلته 4 kg والتصقا معاً. ما سرعة الجسمين المشتركة بعد التصادم؟',
    options: [
      '2 m/s شرقاً',
      '3 m/s شرقاً',
      '4 m/s شرقاً',
      '1 m/s شرقاً'
    ],
    correctAnswer: 0,
    explanation: 'الزخم قبل التصادم = m1*v1 + m2*v2 = (2*6) + 0 = 12 kg·m/s. بعد التصادم، الكتلة الكلية = 2 + 4 = 6 kg. السرعة المشتركة v = 12 / 6 = 2 m/s شرقاً.',
    learningObjective: 'حساب السرعة بعد التصادم عديم المرونة باستخدام حفظ الزخم',
    sourceReference: 'كتاب الفيزياء التوجيهي - صفحة 29'
  },
  {
    id: 'q_arabic_01',
    subjectId: 'arabic',
    unitTitle: 'قواعد النحو',
    lessonTitle: 'أسلوب التعجب',
    grade: 'tawjihi_sci',
    difficulty: 'سهل',
    type: 'mcq',
    question: 'في الجملة: "ما أَجْمَلَ العِلْمَ!"، ما إعراب كلمة "العِلْمَ"؟',
    options: [
      'مفعول به منصوب وعلامة نصبه الفتحة',
      'فاعل مرفوع وعلامة رفعه الضمة',
      'خبر ما التعجبية مرفوع',
      'بدل منصوب'
    ],
    correctAnswer: 0,
    explanation: 'في صيغة التعجب القياسية (ما أَفْعَلَ)، المتعجب منه يقع مفعولاً به دائماً، والفاعل ضمير مستتر وجوباً تقديره هو.',
    learningObjective: 'إعراب المتعجب منه في صيغة ما أفعله القياسية',
    sourceReference: 'كتاب اللغة العربية المشتركة - المهارات ص 25'
  }
];

export const SAMPLE_TEXTBOOK_PHOTOS = [
  {
    id: 'photo_calculus_chain',
    title: 'تمرين 7: مشتقة الاقتران الكسري والمثلثي المركب',
    subject: 'الرياضيات العلمي',
    grade: 'توجيهي علمي',
    equation: 'f(x) = (3x² - 1) / √(4x + 1)',
    instruction: 'جد f\'(2) مبيناً خطوات الحل بالتفصيل',
    source: 'كتاب الرياضيات، ص 53، تمرين 7'
  },
  {
    id: 'photo_physics_inclined',
    title: 'مسألة قذف كرة وحفظ الزخم',
    subject: 'الفيزياء',
    grade: 'توجيهي علمي',
    equation: 'm₁ = 0.5kg, v₁ = 10m/s, θ = 30°',
    instruction: 'احسب مركبة الزخم الخطي الأفقية والعمودية قبل وبعد الارتطام',
    source: 'كتاب الفيزياء، ص 31، مسألة 4'
  },
  {
    id: 'photo_chem_ph',
    title: 'حساب الرقم الهيدروجيني والمحلول المنظم',
    subject: 'الكيمياء',
    grade: 'توجيهي علمي',
    equation: 'Ka = 1.8 × 10⁻⁵, [CH₃COOH] = 0.2M',
    instruction: 'احسب قيمة pH للمحلول بعد إضافة 0.05 مول من ملح خلات الصوديوم',
    source: 'كتاب الكيمياء، ص 64، تدريب 3'
  }
];
