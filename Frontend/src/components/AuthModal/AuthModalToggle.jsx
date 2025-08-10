import Button from "../Generic/button";

export default function AuthModalToggle({isLogin, isProcessing, switchMode}) {
    const basicButtonStyle = 'flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 disabled:cursor-not-allowed';
    const selectedButtonStyle = 'bg-white text-blue-600 shadow-sm';
    const nonselectedButtonStyle = 'text-gray-600 hover:text-blue-600';

    return(
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <Button text="Login" design={`${basicButtonStyle} ${isLogin? selectedButtonStyle : nonselectedButtonStyle}`} processing={isProcessing} interact={() => switchMode(true)}/>
            <Button text="Register" design={`${basicButtonStyle} ${!isLogin? selectedButtonStyle : nonselectedButtonStyle}`} processing={isProcessing} interact={() => switchMode(false)}/>
        </div>
    );
}