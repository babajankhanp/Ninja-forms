import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { FormBuilder } from './components/FormBuilder/FormBuilder';
import { FormList } from './components/FormBuilder/FormList';
import { FormEditor } from './components/FormBuilder/FormEditor';
import { FormRenderer } from './components/FormBuilder/FormRenderer';
import { useFormStore } from './store/formStore';

// Create a wrapper component to handle the form ID parameter
function FormRendererWrapper() {
  const { publishedId } = useParams();
  const { activeForm, setActiveForm, forms, publishedForms } = useFormStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
      const originalFormId = Object.entries(publishedForms).find(
      ([_, pubId]) => pubId === publishedId
    )?.[0];

    console.log(originalFormId,"originalFormId")

    if (originalFormId) {
      const form = forms.find(f => f.id === originalFormId);

      if (form) {
        setActiveForm(form.id);
      }
    }
    setTimeout(() => setIsLoading(false), 300);
  }, [publishedId, setActiveForm, forms, publishedForms]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading form...</span>
      </div>
    );
  }

  if (!activeForm) {
    return <Navigate to="/" />;
  }
  return <FormRenderer form={activeForm} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FormList />} />
          <Route path="new" element={<FormBuilder />} />
          <Route path="edit/:formId" element={<FormEditor />} />
          <Route path="forms/:publishedId" element={<FormRendererWrapper />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;