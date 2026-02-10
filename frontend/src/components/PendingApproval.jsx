import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const PendingApproval = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full border border-yellow-100">
                <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-yellow-200 rounded-full animate-ping opacity-25"></div>
                    <div className="bg-yellow-100 p-6 rounded-full relative z-10">
                        <FontAwesomeIcon icon={faClock} className="text-6xl text-yellow-600" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4">Account Under Review</h2>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    Your teacher account is currently pending approval from the administrator.
                    You can view your profile, but access to other features is restricted until your account is approved.
                </p>

                <div className="bg-blue-50 p-4 rounded-xl mb-8 flex items-start text-left">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                        Please ensure your profile details are accurate to speed up the verification process.
                    </p>
                </div>

                <NavLink
                    to="/teacher/profile"
                    className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                    Review My Profile
                </NavLink>
            </div>
        </div>
    );
};

export default PendingApproval;
