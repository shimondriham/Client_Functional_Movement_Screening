import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { doApiMethod } from '../services/apiService';

const heightOptions = Array.from({ length: 81 }, (_, i) => 140 + i);
const weightOptions = Array.from({ length: 111 }, (_, i) => 40 + i);

const fields = [
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', rules: { required: 'Date of Birth is required' } },
  { name: 'height', label: 'Height (cm)', type: 'select', options: heightOptions, rules: { required: 'Height is required' } },
  { name: 'weight', label: 'Weight (kg)', type: 'select', options: weightOptions, rules: { required: 'Weight is required' } }
];

function MedicalIntakeForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm({ mode: 'onChange' });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const onSubmit = async (data) => {
    setApiError('');
    setLoading(true);
    doApi(data);
  };

  const watchedWorkouts = watch('workouts') || [];
  const watchedMedical = watch('medical') || [];
  const watchedEquipment = watch('equipment') || [];

  const workoutsValid = watchedWorkouts.length > 0;
  const medicalValid = watchedMedical.length > 0;
  const equipmentValid = watchedEquipment.length > 0;
  const formIsValid = isValid && workoutsValid && medicalValid && equipmentValid;

  const frequencyOptions = ['Not at all', '1-2', '3-4', '5+'];
  const workoutOptions = ['Strength / Bodyweight training', 'Running / HIIT', 'Yoga / Pilates', 'Swimming', "I haven't trained before"];
  const goalOptions = ['Weight loss','Muscle gain','Toning / Body shaping','Improving cardiovascular endurance','General fitness maintenance','Rehabilitation / Strengthening after injury'];
  const medicalOptions = ['Back pain','Knee issues','Ankle problems','Blood pressure issues','None'];
  const difficultyOptions = ['Easy','Medium','Challenging'];
  const timeOptions = ['10–15 minutes','20–30 minutes','40–60 minutes','More than one hour'];
  const equipmentOptions = ['No equipment','Dumbbells','Resistance bands','Strength machines','Full gym access'];

  const radioToggle = (field) => (e) => {
    const cur = watch(field);
    if (cur === e.target.value) setValue(field, '', { shouldValidate: true, shouldDirty: true });
  };

  const doApi = async (_data) => {
    const url = "/users/edit";
    try {
      const res = await doApiMethod(url, 'PUT', _data);
      if (res?.status === 200) navigate('/dashboard');
      else setApiError('Unexpected response from server');
    } catch (error) {
      setApiError(error?.response?.data?.error || 'Failed to submit form.');
    } finally {
      setLoading(false);
    }
  }

  // Styles based on Fitwave.ai design line
  const uiStyle = {
    wrapper: { fontFamily: "'Inter', sans-serif", backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '40px 20px' },
    container: { maxWidth: '650px', margin: '0 auto' },
    header: { fontSize: '2rem', fontWeight: '800', marginBottom: '10px', textAlign: 'center' },
    brandItalic: { fontFamily: 'cursive', fontStyle: 'italic', fontWeight: '400', color: '#F2743E' },
    sectionTitle: { fontSize: '1.1rem', fontWeight: '700', marginTop: '30px', marginBottom: '15px', color: '#1A1A1A' },
    input: { backgroundColor: '#F7F7F7', border: 'none', borderRadius: '12px', padding: '12px 15px', fontSize: '1rem' },
    label: { fontWeight: '600', fontSize: '0.9rem', marginBottom: '8px', display: 'block' },
    button: { 
      backgroundColor: '#F2743E', color: 'white', border: 'none', borderRadius: '30px', 
      padding: '15px 40px', fontWeight: '700', width: '100%', marginTop: '40px', 
      cursor: 'pointer', opacity: (!formIsValid || loading) ? 0.6 : 1, transition: '0.3s' 
    }
  };

  return (
    <div style={uiStyle.wrapper}>
      <div style={uiStyle.container}>
        <h1 style={uiStyle.header}>Medical <span style={uiStyle.brandItalic}>Intake</span> Form</h1>
        <p style={{textAlign: 'center', color: '#666', marginBottom: '40px'}}>Help us tailor the perfect vitality journey for you.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Info Fields */}
          <div className="row">
            {fields.map(field => (
              <div key={field.name} className="col-md-4 mb-3">
                <label style={uiStyle.label}>{field.label}</label>
                {field.type === 'select' ? (
                  <select {...register(field.name, field.rules)} className="form-select shadow-none" style={uiStyle.input}>
                    <option value="">Select</option>
                    {field.options.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : (
                  <input {...register(field.name, field.rules)} className="form-control shadow-none" type={field.type} style={uiStyle.input} />
                )}
                {errors[field.name] && <small className="text-danger mt-1 d-block" style={{fontSize: '0.75rem'}}>{errors[field.name].message}</small>}
              </div>
            ))}
          </div>

          <hr style={{margin: '40px 0', borderColor: '#EEE'}} />

          {/* Questionnaire Sections */}
          {[
            { q: 'How many times per week do you exercise?', name: 'frequency', opts: frequencyOptions, type: 'radio' },
            { q: 'What types of workouts have you done in the past?', name: 'workouts', opts: workoutOptions, type: 'checkbox' },
            { q: 'What is your primary goal?', name: 'goal', opts: goalOptions, type: 'radio' },
            { q: 'Any medical issues or physical limitations?', name: 'medical', opts: medicalOptions, type: 'checkbox' },
            { q: 'Starting difficulty level?', name: 'difficulty', opts: difficultyOptions, type: 'radio' },
            { q: 'Training time available per day?', name: 'timePerDay', opts: timeOptions, type: 'radio' },
            { q: 'Access to equipment?', name: 'equipment', opts: equipmentOptions, type: 'checkbox' }
          ].map((section, idx) => (
            <div key={idx} className="mb-4">
              <h4 style={uiStyle.sectionTitle}>{section.q}</h4>
              <div className="d-flex flex-column gap-2">
                {section.opts.map((opt, i) => {
                  const workouts = watch('workouts') || [];
                  const medical = watch('medical') || [];
                  const isWorkoutDisabled = section.name === 'workouts' && (workouts.includes("I haven't trained before") && opt !== "I haven't trained before");
                  const isMedicalDisabled = section.name === 'medical' && (medical.includes('None') && opt !== 'None');

                  return (
                    <div className="form-check custom-check" key={opt}>
                      <input 
                        className="form-check-input" 
                        type={section.type} 
                        id={`${section.name}${i}`} 
                        value={opt} 
                        {...register(section.name, section.type === 'radio' ? { required: 'This field is required' } : {})}
                        disabled={isWorkoutDisabled || isMedicalDisabled}
                        onClick={section.type === 'radio' ? radioToggle(section.name) : undefined}
                      />
                      <label className="form-check-label" htmlFor={`${section.name}${i}`} style={{fontSize: '0.95rem', cursor: 'pointer'}}>
                        {opt}
                      </label>
                    </div>
                  );
                })}
              </div>
              {errors[section.name] && <small className="text-danger">{errors[section.name].message}</small>}
            </div>
          ))}

          {apiError && <div className="alert alert-danger mt-3">{apiError}</div>}

          <button type="submit" style={uiStyle.button} disabled={loading || !formIsValid}>
            {loading ? 'Saving Profile...' : 'Continue to Dashboard'}
          </button>
        </form>
      </div>

      <div style={{textAlign: 'center', marginTop: '40px', fontSize: '0.8rem', color: '#999'}}>
        © Fitwave.ai 2026 | Privacy & Data Protection
      </div>
    </div>
  )
}

export default MedicalIntakeForm;