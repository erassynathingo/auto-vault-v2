import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Car, 
  FileText, 
  DollarSign, 
  ClipboardCheck, 
  AlertTriangle,
  ChevronRight,
  Search,
  ArrowRight,
  Clock,
  Shield,
  Banknote
} from 'lucide-react';

const REGISTRATION_STEPS = [
  {
    title: 'Initial Documentation',
    icon: FileText,
    duration: '1-2 days',
    cost: 'NAD 500-1,000',
    steps: [
      'Gather vehicle import documents',
      'Prepare proof of purchase',
      'Original foreign registration papers',
      'Valid identification documents'
    ]
  },
  {
    title: 'Police Clearance',
    icon: Shield,
    duration: '2-3 days',
    cost: 'NAD 250-500',
    steps: [
      'Visit local police station',
      'Vehicle inspection',
      'Document verification',
      'Clearance certificate issuance'
    ]
  },
  {
    title: 'Technical Inspection',
    icon: Car,
    duration: '1 day',
    cost: 'NAD 350-700',
    steps: [
      'Vehicle roadworthiness check',
      'Emissions testing',
      'Safety features verification',
      'Technical report issuance'
    ]
  },
  {
    title: 'Registration & Payment',
    icon: Banknote,
    duration: '1-2 days',
    cost: 'NAD 1,500-3,000',
    steps: [
      'Submit all documents',
      'Pay registration fees',
      'Receive number plates',
      'Collect registration certificate'
    ]
  }
];

const COMMON_QUESTIONS = [
  {
    question: 'What documents do I need for registration?',
    answer: "You will need proof of purchase, import documents, police clearance, technical inspection report, and valid ID."
  },
  {
    question: 'How long does the process take?',
    answer: 'The complete process typically takes 5-7 working days, depending on document preparation and inspection scheduling.'
  },
  {
    question: 'What are the total costs involved?',
    answer: 'Total costs range from NAD 2,600-5,200, including all fees, inspections, and documentation.'
  },
  {
    question: 'Can I drive during the registration process?',
    answer: 'You may obtain a temporary permit while registration is in progress. This costs around NAD 200 and is valid for 7 days.'
  }
];

const Knowledge = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary-900 text-white">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center"
          style={{ opacity: 0.2 }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Guide to Car Registration
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Everything you need to know about registering your vehicle in Namibia
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for information..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Registration Process */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-16"
        >
          {/* Process Timeline */}
          <div>
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-bold text-gray-900 mb-8"
            >
              Registration Process
            </motion.h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {REGISTRATION_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="relative"
                  >
                    <div 
                      className={`
                        bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow
                        border-2 ${activeStep === index ? 'border-primary-500' : 'border-transparent'}
                      `}
                      onClick={() => setActiveStep(activeStep === index ? null : index)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-primary-100 p-3 rounded-lg">
                          <Icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {step.duration}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      
                      <div className="text-sm text-primary-600 font-medium mb-4">
                        Estimated Cost: {step.cost}
                      </div>

                      <AnimatePresence>
                        {activeStep === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <ul className="space-y-2 text-sm text-gray-600">
                              {step.steps.map((substep, i) => (
                                <li key={i} className="flex items-start">
                                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-primary-500" />
                                  {substep}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {index < REGISTRATION_STEPS.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <ArrowRight className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Common Questions */}
          <div>
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-bold text-gray-900 mb-8"
            >
              Common Questions
            </motion.h2>

            <div className="grid gap-6 md:grid-cols-2">
              {COMMON_QUESTIONS.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {item.question}
                  </h3>
                  <p className="text-gray-600">
                    {item.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div>
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-bold text-gray-900 mb-8"
            >
              Important Tips
            </motion.h2>

            <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-2xl p-8 text-white">
              <div className="grid gap-8 md:grid-cols-3">
                <motion.div variants={itemVariants} className="flex items-start space-x-4">
                  <ClipboardCheck className="w-8 h-8 text-primary-200 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Prepare Early</h3>
                    <p className="text-primary-100 text-sm">
                      Gather all required documents before starting the process to avoid delays.
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start space-x-4">
                  <AlertTriangle className="w-8 h-8 text-primary-200 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Avoid Common Mistakes</h3>
                    <p className="text-primary-100 text-sm">
                      Double-check all information and keep copies of all documents.
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start space-x-4">
                  <DollarSign className="w-8 h-8 text-primary-200 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Budget Accordingly</h3>
                    <p className="text-primary-100 text-sm">
                      Include all fees and potential additional costs in your budget.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Knowledge;