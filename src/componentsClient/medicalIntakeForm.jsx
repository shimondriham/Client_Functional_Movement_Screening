import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { doApiMethod } from '../services/apiService';


const heightOptions = Array.from({ length: 81 }, (_, i) => 140 + i);

const weightOptions = Array.from({ length: 111 }, (_, i) => 40 + i);

const fields = [
  {
    name: 'dateOfBirth',
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
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm({ mode: 'onChange' });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');


  const onSubmit = async (data) => {
    console.log('Form Data:', data);
    // setLoading(true);
    setApiError('');
    doApi(data);
  };

  // watch checkbox groups to enforce at-least-one validation before enabling Continue
  const watchedWorkouts = watch('workouts') || [];
  const watchedMedical = watch('medical') || [];
  const watchedEquipment = watch('equipment') || [];

  const workoutsValid = watchedWorkouts.length > 0;
  const medicalValid = watchedMedical.length > 0;
  const equipmentValid = watchedEquipment.length > 0;

  const formIsValid = isValid && workoutsValid && medicalValid && equipmentValid;

  // option arrays to reduce repetition
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="container mt-3 pb-5">
      <div className="card mx-auto" style={{ maxWidth: 600 }}>
        <div className="card-body">
          <h2 className="card-title">Medical Intake Form</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map(field => (
          <div key={field.name} className="mb-3 text-start">
            <label className="form-label">{field.label}</label>
            {field.type === 'select' ? (
              <select
                {...register(field.name, field.rules)}
                className="form-control"
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
                className={`form-control ${field.type === 'date' ? 'text-start' : ''}`}
                type={field.type || 'text'}
                inputMode={field.inputMode}
                placeholder={field.label}
                dir={field.type === 'date' ? 'ltr' : undefined}
              />
            )}
            {errors[field.name]
              ? <small className="text-danger">{errors[field.name].message || `* ${field.label} is required`}</small>
              : null}
          </div>
        ))}

        {/* Questionnaire — American multiple-choice style */}
        <hr />

        <h4 className="text-start">How many times per week do you exercise?</h4>
        <div className="mb-3 text-start">
          {frequencyOptions.map((opt, i) => (
            <div className="form-check" key={opt}>
              <input className="form-check-input" id={`freq${i}`} type="radio" value={opt} {...register('frequency', { required: 'Please select frequency' })} onClick={radioToggle('frequency')} />
              <label className="form-check-label" htmlFor={`freq${i}`}>{opt === '1-2' ? '1–2 times' : opt === '3-4' ? '3–4 times' : opt === '5+' ? '5 or more times' : opt}</label>
            </div>
          ))}
          {errors.frequency ? <small className="text-danger">{errors.frequency.message}</small> : null}
        </div>

        <h4 className="text-start">What types of workouts have you done in the past (if any)?</h4>
        <div className="mb-3 text-start">
          {(() => {
            const workouts = watch('workouts') || [];
            const neverSelected = workouts.includes("I haven’t trained before") || workouts.includes("I haven't trained before");
            return workoutOptions.map((opt, i) => (
              <div className="form-check" key={opt}>
                <input className="form-check-input" id={`w${i}`} type="checkbox" value={opt} {...register('workouts')} disabled={neverSelected && opt !== "I haven't trained before"} />
                <label className="form-check-label" htmlFor={`w${i}`}>{opt}</label>
              </div>
            ))
          })()}
        </div>

        <h4 className="text-start">What is your primary goal?</h4>
        <div className="mb-3 text-start">
          {goalOptions.map((g,i)=> (
            <div className="form-check" key={g}>
              <input className="form-check-input" id={`goal${i}`} type="radio" value={g} {...register('goal', { required: 'Please choose a goal' })} onClick={radioToggle('goal')} />
              <label className="form-check-label" htmlFor={`goal${i}`}>{g}</label>
            </div>
          ))}
          {errors.goal ? <small className="text-danger">{errors.goal.message}</small> : null}
        </div>

        <h4 className="text-start">Do you have any medical issues, pain, or physical limitations?</h4>
        <div className="mb-3 text-start">
          {(() => {
            const medical = watch('medical') || [];
            const noneSelected = medical.includes('None');
            return medicalOptions.map((opt,i)=>(
              <div className="form-check" key={opt}>
                <input className="form-check-input" id={`m${i}`} type="checkbox" value={opt} {...register('medical')} disabled={noneSelected && opt !== 'None'} />
                <label className="form-check-label" htmlFor={`m${i}`}>{opt}</label>
              </div>
            ))
          })()}
        </div>

        <h4 className="text-start">What difficulty level would you like to start with?</h4>
        <div className="mb-3 text-start">
          {difficultyOptions.map((opt,i)=>(
            <div className="form-check" key={opt}>
              <input className="form-check-input" id={`d${i}`} type="radio" value={opt} {...register('difficulty', { required: 'Choose difficulty' })} onClick={radioToggle('difficulty')} />
              <label className="form-check-label" htmlFor={`d${i}`}>{opt}</label>
            </div>
          ))}
          {errors.difficulty ? <small className="text-danger">{errors.difficulty.message}</small> : null}
        </div>

        <h4 className="text-start">How much time do you have for training per day?</h4>
        <div className="mb-3 text-start">
          {timeOptions.map((t,i)=>(
            <div className="form-check" key={t}>
              <input className="form-check-input" id={`t${i}`} type="radio" value={t} {...register('timePerDay', { required: 'Select time available' })} onClick={radioToggle('timePerDay')} />
              <label className="form-check-label" htmlFor={`t${i}`}>{t}</label>
            </div>
          ))}
          {errors.timePerDay ? <small className="text-danger">{errors.timePerDay.message}</small> : null}
        </div>

        <h4 className="text-start">Which equipment do you have access to?</h4>
        <div className="mb-3 text-start">
          {equipmentOptions.map((eq,i)=>(
            <div className="form-check" key={eq}>
              <input className="form-check-input" id={`eq${i}`} type="checkbox" value={eq} {...register('equipment')} />
              <label className="form-check-label" htmlFor={`eq${i}`}>{eq}</label>
            </div>
          ))}
        </div>


        {apiError ? <div className="mb-3"><small className="text-danger">{apiError}</small></div> : null}

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary" disabled={loading || !formIsValid}>
            {loading ? 'Submitting...' : 'Continue'}
          </button>
        </div>
          </form>
        </div>
      </div>
    </div>
  )
}


export default MedicalIntakeForm
