import AuthModalToggle from "./AuthModalToggle";
import AuthModalForm from "./AuthModalForm";

export default function AuthModalBody({isLogin, isProcessing, switchMode, formData, handleInputChange, handleSubmit}){
    return(
        <div className="p-6 pb-4">
            <AuthModalToggle isLogin={isLogin} switchMode={switchMode} isProcessing={isProcessing}/>
            <AuthModalForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} isLogin={isLogin} isProcessing={isProcessing}/>
        </div>
    );
}