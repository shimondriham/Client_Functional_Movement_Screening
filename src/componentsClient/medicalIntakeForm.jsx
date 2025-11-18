import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { doApiMethod } from '../services/apiService';
import { addName, addIfShowNav } from '../featuers/myDetailsSlice';


const heightOptions = Array.from({ length: 81 }, (_, i) => 140 + i);

const weightOptions = Array.from({ length: 111 }, (_, i) => 40 + i);

const fields = [
  {
    name: 'birthdate',
    label: 'Date of Birth',
    type: 'date',
    rules: { 
      required: 'Date of Birth is required'
    }
  },
  {
    name: 'height',
    label: 'Height (cm)',
    type: 'select',
    options: heightOptions,
    rules: { required: 'Height is required' }
  },
  {
    name: 'weight',
    label: 'Weight (kg)',
    type: 'select',
    options: weightOptions,
    rules: { required: 'Weight is required' }
  }
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


      // dispatch to redux so header/navigation can show it
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
    <div className="container mt-3" style={{ maxWidth: 600, paddingBottom: '300px' }}>
      <h2>Medical Intake Form</h2>


      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map(field => (
          <div key={field.name} className="mb-3 text-start">
            <label className="form-label">{field.label}</label>
            {field.type === 'select' ? (
              <select
                {...register(field.name, field.rules)}
                className="form-control"
                size="1"
              >
                <option value="">Select {field.label}</option>
                {field.options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...register(field.name, field.rules)}
                className="form-control"
                type={field.type || 'text'}
                inputMode={field.inputMode}
                placeholder={field.label}
                style={field.type === 'date' ? { direction: 'ltr', textAlign: 'left' } : {}}
              />
            )}
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
