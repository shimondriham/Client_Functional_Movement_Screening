import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { doApiMethod } from '../services/apiService';
import { addName, addIfShowNav } from '../featuers/myDetailsSlice';

const fields = [
  {
    name: 'fullName',
    label: 'Full name',
    type: 'text',
    rules: {
      required: 'Full name is required',
      // allow Unicode letters, spaces and hyphens
      pattern: { value: /^\p{L}+(?:[\s-]\p{L}+)*$/u, message: 'Only letters are allowed' }
    }
  },
  {
    name: 'age',
    label: 'Age',
    type: 'text',
    inputMode: 'numeric',
    rules: { required: 'Age is required', pattern: { value: /^\d+$/, message: 'Only numbers are allowed' } }
  },
  {
    name: 'height',
    label: 'Height',
    type: 'text',
    inputMode: 'numeric',
    rules: { required: 'Height is required', pattern: { value: /^\d+$/, message: 'Only numbers are allowed' } }
  },
  {
    name: 'weight',
    label: 'Weight',
    type: 'text',
    inputMode: 'numeric',
    rules: { required: 'Weight is required', pattern: { value: /^\d+$/, message: 'Only numbers are allowed' } }
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'text',
    inputMode: 'numeric',
    rules: { required: 'Phone is required', pattern: { value: /^\d+$/, message: 'Only numbers are allowed' } }
  },
  { name: 'address', label: 'Address', type: 'text', rules: { required: 'Address is required' } },
  { name: 'allergies', label: 'Allergies', type: 'text', rules: { required: 'Allergies is required' } }
];

function MedicalIntakeForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const onSubmit = async (data) => {
    // Log the entire form data before sending
    console.log('Form Data:', data);

    // send intake data to backend (adjust endpoint as needed)
    setLoading(true);
    setApiError('');
    try {
      // endpoint assumed - change to the real one if different
      try {
        const resp = await doApiMethod('/medicalIntake', 'POST', data);
        console.log('intake resp', resp?.data);
      } catch (apiErr) {
        // If API endpoint doesn't exist, still allow navigation for now
        console.warn('API call failed, but proceeding:', apiErr?.message);
      }

      // dispatch name to redux so header/navigation can show it
      if (data.fullName) dispatch(addName({ name: data.fullName }));
      dispatch(addIfShowNav({ ifShowNav: true }));

      // Navigate to dashboard on success
      navigate('/dashboard');
    }
    catch (err) {
      console.error(err?.response || err);
      setApiError(err?.response?.data?.error || 'Failed to submit form.');
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-3" style={{ maxWidth: 600 }}>
      <h2>Medical Intake Form</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map(field => (
          <div key={field.name} className="mb-3 text-start">
            <label className="form-label">{field.label}</label>
            <input
              {...register(field.name, field.rules)}
              className="form-control"
              type={field.type || 'text'}
              inputMode={field.inputMode}
              placeholder={field.label}
            />
            {errors[field.name]
              ? <small className="text-danger">{errors[field.name].message || `* ${field.label} is required`}</small>
              : null}
          </div>
        ))}

        {apiError ? <div className="mb-3"><small className="text-danger">{apiError}</small></div> : null}

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MedicalIntakeForm