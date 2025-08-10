import { X, Building2 } from 'lucide-react';

export default function ModalHeader({onClose, ModalHeaderText, ModalHeaderError}) {
    return(
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
            <X size={24} />
            </button>

            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                    <Building2 size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{ModalHeaderText}</h2>
                <h4 className="text-2xs text-white mb-2">{ModalHeaderError}</h4>
            </div>
        </div>
    );
}