import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, UserCircle, Building2 } from 'lucide-react';

type GetStartedModalProps = {
  onClose: () => void;
};

export const GetStartedModal: FC<GetStartedModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleSelection = (type: 'agent' | 'client') => {
    onClose();
    navigate(`/register/${type}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Get Started with ShowPro</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleSelection('agent')}
            className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors flex items-center gap-4 group"
          >
            <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-100">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Real Estate Agent</h3>
              <p className="text-gray-600">Manage showings and grow your business</p>
            </div>
          </button>

          <button
            onClick={() => handleSelection('client')}
            className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors flex items-center gap-4 group"
          >
            <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-100">
              <UserCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Home Seeker</h3>
              <p className="text-gray-600">Find and schedule property viewings</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};