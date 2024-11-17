import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { FormBuilder } from './components/FormBuilder/FormBuilder';
import { FormList } from './components/FormBuilder/FormList';
import { FormEditor } from './components/FormBuilder/FormEditor';
import { FormRenderer } from './components/FormBuilder/FormRenderer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FormList />} />
          <Route path="new" element={<FormBuilder />} />
          <Route path="edit/:formId" element={<FormEditor />} />
          <Route path="forms/:formId" element={<FormRenderer />} />
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;