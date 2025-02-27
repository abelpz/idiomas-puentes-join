import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useDocumentMeta = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Update document title
    document.title = t('meta.title');
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('meta.description'));
    }

    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', i18n.language);
  }, [t, i18n.language]); // Re-run when language changes
}; 