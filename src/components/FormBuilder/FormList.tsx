import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/formStore';
import { FileText, Calendar, Trash2, Edit2, Search, EyeIcon, BookCheck } from 'lucide-react';

export const FormList: React.FC = () => {
  const { forms, deleteForm, publishForm, publishedForms } = useFormStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  console.log(forms, "forms")

  if (forms.length === 0) {
    if (forms.length === 0) {
  return (
    <div className="text-center py-12">
      <FileText className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No forms</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new form.
      </p>
      <div className="mt-6">
        <button
          onClick={() => navigate('/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Edit2 className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Form
        </button>
      </div>
      {/* Instructions Section */}
      <div className="mt-8 p-4 border-t flex flex-col justify-center items-center text-center">
  <h4 className="text-md font-semibold text-gray-700 mb-2">
    Instructions
  </h4>
  <p className="max-w-lg text-sm text-gray-600 mb-4">
    A powerful and flexible form builder application that allows users to create, manage, and publish dynamic forms with custom validations and submission handling.
  </p>
  <ol className="list-decimal text-sm text-gray-600 my-2 flex flex-col items-start">
    <li>Create a form with schema definition and groups.</li>
    <li>
      Configure the submit API settings and validate the schema definition.
    </li>
    <li>Publish the form after verifying all details.</li>
    <li>View the published form using the "View Published Form" option.</li>
  </ol>
</div>
<h2>Backend is In Progress</h2>

    </div>
  );
}

  }

  const filteredForms = forms.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePublish = (formId: string) => {
    const publishedId = publishForm(formId);
    alert('Form published!');
    console.log(publishedId, "publishedId")
  };

  const openPublishedForm = (publishedId: string) => {
     if (publishedId) {
        navigate(`/forms/${publishedId}`);
     }
  };

  const editFormDefination = (formId:string)=> {
     navigate(`/edit/${formId}`)
  }

console.log(publishedForms)
console.log(forms, "forms")

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Your Forms</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForms.map((form) => (
          <div
            key={form.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/edit/${form.id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">{form.name}</h3>
              </div>
              <span className="text-sm text-gray-500">v{form.version}</span>
            </div>

            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(form.updatedAt).toLocaleDateString()}
            </div>

            <div className="mt-2 text-sm text-gray-600">
              {form.groups.length} groups • {form.groups.reduce((acc, group) => acc + group.fields.length, 0)} fields
            </div>

            <div className="mt-4 flex justify-end space-x-2 align-middle gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePublish(form.id);
                }}
                className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                title="Publish"
              >
                <div className='flex justify-center align-middle gap-1 items-center text-sm'><BookCheck size={18} />
                Publish</div>
              </button>
               <button
                onClick={(e) => {
                  e.stopPropagation();
                  editFormDefination(form.id);
                }}
                className="p-2 text-sm text-blue-600 cursor-pointer hover:bg-blue-50 rounded-md"
                title="Publish"
              >
                <div className='flex justify-center align-middle gap-1 items-center text-sm'><BookCheck size={18} />
                Edit</div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteForm(form.id);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                title="Delete"
              >
                  <div className='flex justify-center align-middle gap-1  items-center text-sm'>  <Trash2 size={18} />
                Delete</div>
              </button>
            </div>

            {publishedForms[form.id] && (
              <div
                className="mt-2 flex items-center text-sm text-blue-600 cursor-pointer hover:text-blue-800"
                onClick={(e) => {
                  e.stopPropagation();
                  openPublishedForm(publishedForms[form.id]);
                }}
              >
                <EyeIcon size={14} className="mr-1" />
                <span>View Published Form</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};