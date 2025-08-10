import LoadingSpinner from './LoadingSpinner';
import PropTypes from 'prop-types';


function defaultOnClick(){
  console.log("default handled");
}

function Button({ 
    type='button',
    text='This is a button',
    design='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105 shadow-lg',
    interact= defaultOnClick,
    processing=false,
    spin=false
  }) {
    return (
      <button
        type={type}
        className={design}
        onClick={interact}
        disabled={processing}
      >
        {processing && spin? <LoadingSpinner />:<></>}{text}
      </button>
    );
}

Button.propTypes = {
  type:       PropTypes.string,
  text:       PropTypes.string,
  design:      PropTypes.string,
  interact:   PropTypes.func,
};

export default Button;