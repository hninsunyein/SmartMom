'use client';

import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import Button from './Button';

const SuccessDialog = ({ isOpen, onClose, title, message, onAction, actionText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-600 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {message}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onAction || onClose}
              className="flex-1"
              size="md"
            >
              {actionText || 'Continue'}
            </Button>
            {onAction && (
              <Button
                onClick={onClose}
                variant="secondary"
                className="flex-1"
                size="md"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessDialog;
