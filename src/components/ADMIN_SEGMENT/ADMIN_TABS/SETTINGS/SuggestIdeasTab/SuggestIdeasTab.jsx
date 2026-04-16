import React, { useState } from 'react';
import { ArrowLeft, ImagePlus, CheckCircle2, X } from 'lucide-react';

const SuggestIdeasTab = ({ onBack }) => {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (e) => {
    if (images.length < 5) {
      // In a real app, you'd handle file logic here
      setImages([...images, URL.createObjectURL(e.target.files[0])]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Thank you!</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          Your feedback helps us make the platform better for everyone.
        </p>
        <button 
          onClick={onBack}
          className="mt-8 text-blue-600 font-bold hover:underline"
        >
          Back to Settings
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header matching your Assistance screenshot */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Give a suggestion</h1>
      </header>

      <main className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">Share your ideas with our team!</h2>
            <p className="text-sm text-gray-500 mt-1">Help us improve the experience with your suggestions</p>
          </div>

          <div className="space-y-6">
            {/* Description Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">Description*</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your suggestion"
                rows={6}
                className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
              />
            </div>

            {/* Media Upload Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">Media (Optional)</label>
              <p className="text-[10px] text-gray-400">You can add up to 5 images</p>
              
              <div className="mt-2">
                <label className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                    <ImagePlus size={20} />
                    <span>Upload image</span>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                    disabled={images.length >= 5}
                    accept="image/*"
                  />
                </label>
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(idx)}
                        className="absolute top-0 right-0 bg-black/60 text-white p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                disabled={!description.trim()}
                onClick={() => setSubmitted(true)}
                className={`px-10 py-3 rounded-full cursor-pointer text-sm font-bold transition-all ${
                  description.trim() 
                    ? 'bg-black text-white hover:bg-gray-800 shadow-md active:scale-95' 
                    : 'bg-gray-300 text-white cursor-not-allowed'
                }`}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuggestIdeasTab;