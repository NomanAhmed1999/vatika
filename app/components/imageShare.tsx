import html2canvas from "html2canvas";
import { useEffect, useState } from "react";

const ShareModal = ({ onClose, bottleRef }: { onClose: () => void, bottleRef: React.RefObject<HTMLDivElement> }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Poll for image load in the bottleRef
  useEffect(() => {
    if (!bottleRef.current) return;
    const img = bottleRef.current.querySelector("img");
    if (img && img.complete) {
      setImageLoaded(true);
      return;
    }
    let interval: any = null;
    interval = setInterval(() => {
      const img = bottleRef.current?.querySelector("img");
      if (img && img.complete) {
        setImageLoaded(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [bottleRef]);

  // const handleDownload = async () => {
  //   if (!bottleRef.current) return;
  //   const canvas = await html2canvas(bottleRef.current);
  //   const link = document.createElement('a');
  //   link.download = 'bestie-bottle.png';
  //   link.href = canvas.toDataURL();
  //   link.click();
  // };


  const handleDownload = async () => {
    if (bottleRef.current) {
      setImageLoaded(false);
      let bestiesName = bottleRef.current.querySelector('#besties-name');
      console.log(bestiesName);
      
      bestiesName?.classList.add('pb-4');
      const canvas = await html2canvas(bottleRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      bestiesName?.classList.remove('pb-4');
      setImageLoaded(true);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'besties.png';
      link.click();
    }
  };
  
  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleWhatsAppShare = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this image!');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };
  const handleShare = async () => {
    if (!bottleRef.current) return;
    const canvas = await html2canvas(bottleRef.current);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], 'bestie-bottle.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Bestie Bottle',
            text: 'Check out our Bestie Bottle!',
            files: [file],
          });
        } catch (err) {
          alert("Sharing failed or cancelled.");
        }
      } else {
        alert("Sharing is not supported on this browser.");
      }
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Share Your Bestie Bottle</h2>
        <p className="mb-6 text-gray-600">Download or share the awesome photo you created!</p>
        <div className="flex flex-col gap-4">
            <button onClick={handleDownload} disabled={!imageLoaded} className={`bg-green-600 text-white py-2 rounded hover:bg-green-700 ${!imageLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {imageLoaded ? 'Download Image' : 'Loading...'}
            </button>
            <button onClick={handleShare} disabled={!imageLoaded} className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${!imageLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {imageLoaded ? 'Share (Mobile)' : 'Loading...'}
            </button>
            <button onClick={handleWhatsAppShare} disabled={!imageLoaded} className={`bg-green-500 text-white py-2 rounded hover:bg-green-600 ${!imageLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {imageLoaded ? 'Share on WhatsApp' : 'Loading...'}
            </button>
            <button onClick={handleFacebookShare} disabled={!imageLoaded} className={`bg-blue-800 text-white py-2 rounded hover:bg-blue-900 ${!imageLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {imageLoaded ? 'Share on Facebook' : 'Loading...'}
            </button>
            <button onClick={onClose} className="text-gray-600 underline mt-4">
                Close
            </button>
            </div>

      </div>
    </div>
  );
};

export default ShareModal;
