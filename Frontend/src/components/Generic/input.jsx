import PropTypes from 'prop-types';
import { Building2 } from 'lucide-react';

function Input({ 
  type='text', 
  label='input', 
  name='input', 
  value, inputChange, 
  placeholder='input something...', 
  style='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed', 
  logo = <Building2 size={20} className="absolute left-3 top-3 text-gray-400" />,
  isRequired=false,
  processing=false
}) {
    return(
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2"> {label} </label>
        <div className="relative">
          {logo}
          {
            isRequired ?
            <input type={type} name={name} value={value} onChange={inputChange} placeholder={placeholder} className={style} disabled={processing} required/>
            : <input type={type} name={name} value={value} onChange={inputChange} placeholder={placeholder} className={style} disabled={processing} />
          }
        </div>
      </div>
    );
}

Input.propTypes = {
    type: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    inputChange: PropTypes.func,
    placeholder: PropTypes.string,
    style: PropTypes.string,
    isRequired: PropTypes.bool,
    processing: PropTypes.bool,
}

export default Input;