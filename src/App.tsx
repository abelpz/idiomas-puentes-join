import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useDocumentMeta } from './hooks/useDocumentMeta';

// Define the type for transfer data
type TransferMethod = {
  bank: string;
  accountHolder: string;
  accountNumber: string;
  accountType: string;
  idNumber?: string;
};

type LocalCurrency = {
  country: string;
  currency: string;
  symbol: string;
  flag: string;
  transferMethods: TransferMethod[];
};

// Local currency data
const localCurrencies: LocalCurrency[] = [
  {
    country: 'Venezuela',
    currency: 'Bolívares',
    symbol: 'Bs.',
    flag: '🇻🇪',
    transferMethods: [
      {
        bank: '0172 - Bancamiga',
        accountHolder: 'Idiomas Puentes',
        accountNumber: '04144337456',
        accountType: 'Pago Móvil',
        idNumber: 'V9829088'
      },
    ]
  }
];

function App() {
  const { t, i18n } = useTranslation();
  const donateSectionRef = useRef<HTMLDivElement>(null);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<LocalCurrency | null>(null);
  const [formData, setFormData] = useState({
    churchName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    message: ''
  });
  const [formStep, setFormStep] = useState(1);
  
  // Use the custom hook to manage meta tags
  useDocumentMeta();

  // Handle hash navigation on page load
  useEffect(() => {
    if ((window.location.hash === '#join' || window.location.hash === '#unete') && donateSectionRef.current) {
      setTimeout(() => {
        donateSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end',
        });
      }, 100);
    }
  }, []);

  // Update currentLang when i18n.language changes
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
  };

  const handleLocalCurrencyClick = (currency: LocalCurrency) => {
    setSelectedCurrency(currency);
    setIsDonateModalOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formStep < 3) {
      setFormStep(formStep + 1);
      return;
    }

    try {
      // Show success message
      alert(currentLang === 'en' 
        ? 'Thank you for your interest! We will contact you soon.'
        : '¡Gracias por su interés! Nos pondremos en contacto pronto.');
      
      // Reset form and close modal
      setFormData({
        churchName: '',
        contactName: '',
        email: '',
        phone: '',
        country: '',
        message: ''
      });
      setFormStep(1);
      setIsPartnerModalOpen(false);
    } catch (error) {
      alert(currentLang === 'en'
        ? 'There was an error submitting the form. Please try again or contact us directly.'
        : 'Hubo un error al enviar el formulario. Por favor, inténtelo de nuevo o contáctenos directamente.');
      console.error('Form submission error:', error);
    }
  };

  const handlePrevStep = () => {
    setFormStep(Math.max(1, formStep - 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const scrollToDonate = () => {
    donateSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'  // This will align the bottom of the element with the bottom of the viewport
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 items-center">
            <div className="flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="Idiomas Puentes"
                className="h-15 w-auto"
              />
            </div>
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center px-4 py-2 border-2 border-primary text-sm font-medium rounded-full text-primary hover:bg-primary hover:text-white transition-colors duration-200"
            >
              {currentLang === 'en' ? 'Español' : 'English'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pt-14 lg:pt-20">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-normal text-gray-900 sm:text-6xl md:text-7xl">
                <span className="block">{t('hero.title')}</span>
              </h1>
              <p className="mt-8 text-xl text-primary font-semibold sm:text-2xl">
                {t('hero.subtitle')}
              </p>
              <p className="mt-8 text-lg leading-8 text-gray-600 sm:text-xl">
                {t('hero.description')}
              </p>
              <div className="mt-12">
                <button 
                  onClick={scrollToDonate}
                  className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-white bg-primary hover:bg-primary/90 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  {t('donate.cta')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scripture Section */}
      <div className="py-12 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('scripture.title')}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('scripture.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-secondary opacity-10 blur transition duration-200 group-hover:opacity-20"></div>
              <div className="relative bg-white rounded-xl shadow-sm p-8 md:p-10">
                <blockquote className="italic text-gray-700 mb-4">
                  "{t('scripture.quote1')}"
                </blockquote>
                <cite className="block text-right text-gray-600 font-semibold">
                  — {t('scripture.reference1')}
                </cite>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-secondary to-primary opacity-10 blur transition duration-200 group-hover:opacity-20"></div>
              <div className="relative bg-white rounded-xl shadow-sm p-8 md:p-10">
                <blockquote className="italic text-gray-700 mb-4">
                  "{t('scripture.quote2')}"
                </blockquote>
                <cite className="block text-right text-gray-600 font-semibold">
                  — {t('scripture.reference2')}
                </cite>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section with Tools */}
      <div className="relative py-12 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('about.title')}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('about.description')}
            </p>
          </div>
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">
              {t('about.tools.title')}
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(t('about.tools.list', { returnObjects: true }) as string[]).map((tool: string, index: number) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {index === 0 && (
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                      {index === 1 && (
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      )}
                      {index === 2 && (
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      )}
                      {index === 3 && (
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      )}
                    </div>
                    <p className="text-gray-700">{tool}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div 
        ref={donateSectionRef} 
        id="join"
        className="py-12 sm:py-32 scroll-mt-0"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-secondary opacity-20 blur transition duration-200 group-hover:opacity-30"></div>
            <div className="relative bg-white rounded-xl shadow-sm p-8 md:p-12 transition duration-200 hover:shadow-lg">
              <div className="text-center space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {t('donate.cta')}
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    {t('donate.impact')}
                  </p>
                  <p className="text-gray-500 text-base max-w-2xl mx-auto">
                    {t('donate.details')}
                  </p>
                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-primary font-medium mb-2">
                      {currentLang === 'en' ? 'Do you want your church to be part of this global mission?' : '¿Quieres que tu iglesia sea parte de esta misión Global?'}
                    </p>
                    <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                      {currentLang === 'en' 
                        ? 'Join with us in equipping tribal churches. Share the resources and expertise that God has given you, and join a convergence of churches that are praying and working together to see the Church in every nation walking towards maturity in Christ.'
                        : 'Únete con nosotros para equipar a las iglesias tribales. Comparte los recursos y la experiencia que Dios te ha dado y únete con tu iglesia a una convergencia de iglesias que anhelan y trabajan juntas para ver a la Iglesia en cada nación caminando hacia la madurez en Cristo.'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button 
                    onClick={() => setIsDonateModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-full text-white bg-primary hover:bg-primary/90 transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    <span>{currentLang === 'en' ? 'Support Bible Translation' : 'Apoyar la Traducción Bíblica'}</span>
                  </button>
                  <button 
                    onClick={() => setIsPartnerModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-full text-gray-600 border-2 border-gray-300 hover:border-primary hover:text-primary transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{currentLang === 'en' ? 'Join as a Church' : 'Une tu Iglesia'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsDonateModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500"
                  onClick={() => setIsDonateModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {currentLang === 'en' ? 'Choose Your Donation Method' : 'Elige tu Método de Donación'}
                  </h3>
                  <div className="mt-8 space-y-6">
                    <a 
                      href="https://www.myclickandgive.com/login.php?id=26&r=eyJtIjoiVGhhbmsgeW91IGZvciB5b3VyIGdpZnQhIiwiYSI6IjEyNTMiLCJ0IjoiZ2l2ZS5waHAifQ== "
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-full text-white bg-primary hover:bg-primary/90 transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{currentLang === 'en' ? 'Donate Internationally' : 'Donar Internacionalmente'}</span>
                    </a>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-3 bg-white text-sm text-gray-500">
                          {currentLang === 'en' ? 'or donate from' : 'o dona desde'}
                        </span>
                      </div>
                    </div>

                    {localCurrencies.map((currency) => (
                      <button 
                        key={currency.country}
                        onClick={() => handleLocalCurrencyClick(currency)}
                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-full text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors duration-200"
                      >
                        <span className="text-xl">{currency.flag}</span>
                        <span>{currency.country}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Local Currency Transfer Details Modal */}
      {selectedCurrency && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedCurrency(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedCurrency(null)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
                    <span className="text-xl">{selectedCurrency.flag}</span>
                    <span>
                      {currentLang === 'en' 
                        ? `Donate in ${selectedCurrency.currency}` 
                        : `Donar en ${selectedCurrency.currency}`}
                    </span>
                  </h3>
                  <div className="mt-6 space-y-6">
                    {selectedCurrency.transferMethods.map((method, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h4 className="font-medium text-gray-900">{method.bank}</h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600">
                            <span className="font-medium">{currentLang === 'en' ? 'Account Holder' : 'Titular'}:</span> {method.accountHolder}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">{currentLang === 'en' ? 'Number' : 'Número'}:</span> {method.accountNumber}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">{currentLang === 'en' ? 'Type' : 'Tipo'}:</span> {method.accountType}
                          </p>
                          {method.idNumber && (
                            <p className="text-gray-600">
                              <span className="font-medium">ID:</span> {method.idNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partnership Modal */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsPartnerModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500"
                  onClick={() => setIsPartnerModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {currentLang === 'en' ? 'Join with Us' : 'Únete con Nosotros'}
                </h3>
                <p className="text-gray-600 mb-8">
                  {currentLang === 'en' 
                    ? 'Idiomas Puentes represents a convergence of the Global Church, working together to fulfill the Great Commission. Join us in this collaborative effort to bring God\'s Word to every language.'
                    : 'Idiomas Puentes representa una convergencia de la Iglesia Global, trabajando juntos para cumplir la Gran Comisión. Únete a este esfuerzo colaborativo para llevar la Palabra de Dios a cada idioma.'}
                </p>
                <form 
                  name="church-partnership"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={handleFormSubmit} 
                  className="space-y-6"
                >
                  <input type="hidden" name="form-name" value="church-partnership" />
                  <div hidden>
                    <input name="bot-field" />
                  </div>
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center w-full">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</div>
                      <div className={`flex-1 h-1 mx-2 ${formStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</div>
                      <div className={`flex-1 h-1 mx-2 ${formStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>3</div>
                    </div>
                  </div>

                  {/* Step 1: Basic Contact */}
                  {formStep === 1 && (
                    <>
                      <div>
                        <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                          {currentLang === 'en' ? 'Contact Person' : 'Persona de Contacto'}
                        </label>
                        <input
                          type="text"
                          name="contactName"
                          id="contactName"
                          required
                          value={formData.contactName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-3"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          {currentLang === 'en' ? 'Email Address' : 'Correo Electrónico'}
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-3"
                        />
                      </div>
                    </>
                  )}

                  {/* Step 2: Church Details */}
                  {formStep === 2 && (
                    <>
                      <div>
                        <label htmlFor="churchName" className="block text-sm font-medium text-gray-700">
                          {currentLang === 'en' ? 'Church Name' : 'Nombre de la Iglesia'}
                        </label>
                        <input
                          type="text"
                          name="churchName"
                          id="churchName"
                          required
                          value={formData.churchName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-3"
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          {currentLang === 'en' ? 'Country' : 'País'}
                        </label>
                        <input
                          type="text"
                          name="country"
                          id="country"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-3"
                        />
                      </div>
                    </>
                  )}

                  {/* Step 3: Additional Info */}
                  {formStep === 3 && (
                    <>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          {currentLang === 'en' ? 'Phone Number' : 'Teléfono'}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-3"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                          {currentLang === 'en' ? 'Message (Optional)' : 'Mensaje (Opcional)'}
                        </label>
                        <textarea
                          name="message"
                          id="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-3"
                        />
                      </div>
                    </>
                  )}

                  <div className="mt-8 flex justify-between gap-4">
                    {formStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 inline-flex justify-center rounded-full border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        {currentLang === 'en' ? 'Previous' : 'Anterior'}
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 inline-flex justify-center rounded-full border border-transparent px-6 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {formStep < 3 ? (currentLang === 'en' ? 'Next' : 'Siguiente') : (currentLang === 'en' ? 'Submit' : 'Enviar')}
                    </button>
                  </div>
                </form>
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900">
                    {currentLang === 'en' ? 'Contact Us Directly' : 'Contáctanos Directamente'}
                  </h4>
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      <a href="mailto:idiomaspuentes@gmail.com" className="text-primary hover:text-primary/90">
                        idiomaspuentes@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <div className="pb-4 -mt-12 text-center relative z-10">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-full text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-200 bg-white shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span>{currentLang === 'en' ? 'Learn More About Bible Translation Support' : 'Conoce más sobre el apoyo a la Traducción Bíblica Centrada en la Iglesia'}</span>
        </button>
      </div>
    </div>
  );
}

export default App; 