import Input from "../Generic/input";
import Button from "../Generic/button";
import { Mail, Lock, MapPin, Globe } from "lucide-react";

export default function AuthModalForm({handleSubmit, handleInputChange, isLogin, isProcessing, formData}) {
    const submitButtonStyle = 'w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105 mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-blue-600 disabled:hover:to-purple-600 flex items-center justify-center gap-2';
    let text = isLogin? 'Login':'Register';
    text = isProcessing? 'Processing..' : text;
    
    return(
        <form onSubmit={e => {e.preventDefault(); handleSubmit()}} className="space-y-4">
            <Input label='Hotel Name' name='hotel' value={formData.hotel} inputChange={handleInputChange} placeholder='Enter your hotel name' isRequired={true} processing={isProcessing} />
            <Input type='email' label='Email Address' name='email' value={formData.email} inputChange={handleInputChange} placeholder='Enter your Email' isRequired={false} processing={isProcessing} logo={<Mail size={20} className="absolute left-3 top-3 text-gray-400" />}/>
            <Input type='password' label='Password' name='password' value={formData.password} inputChange={handleInputChange} placeholder='Enter your password' isRequired={true} processing={isProcessing} logo={<Lock size={20} className="absolute left-3 top-3 text-gray-400" />}/>

            <div className={`transition-all duration-300 overflow-hidden ${ !isLogin ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0' }`}>
                <div className="space-y-4 pt-2">
                    <Input label='City' name='city' value={formData.city} inputChange={handleInputChange} placeholder='Enter your city' isRequired={!isLogin? true : false} processing={isProcessing} logo={<MapPin size={20} className="absolute left-3 top-3 text-gray-400" />}/>
                    <Input label='Country' name='country' value={formData.country} inputChange={handleInputChange} placeholder='Enter your country' isRequired={!isLogin? true : false} processing={isProcessing} logo={<Globe size={20} className="absolute left-3 top-3 text-gray-400" />}/>
                </div>
            </div>
            
            <Button type='submit' text={text} design={submitButtonStyle} processing={isProcessing} spin={true}/>
            
        </form>
    );
}