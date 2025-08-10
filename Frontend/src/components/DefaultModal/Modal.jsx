import ModalHeader from "./ModalHeader";

function Modal({isModalOpen, onClose, ModalHeaderText, ModalHeaderError, Body}) {
    return(
        <div>
            {
                isModalOpen ?
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                            <ModalHeader onClose={onClose} ModalHeaderText={ModalHeaderText} ModalHeaderError={ModalHeaderError}/>
                            {Body}
                        </div>
                    </div>
                    :
                    <>
                    </>
            }
        </div>
    );
}


export default Modal;