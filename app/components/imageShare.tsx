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

  // Prepare images for html2canvas to avoid CORS issues
  const prepareForCapture = () => {
    if (!bottleRef.current) return;
    
    // Find all images in the bottleRef
    const images = bottleRef.current.querySelectorAll('img');
    
    // Add crossOrigin attribute and update source to use our proxy
    images.forEach(img => {
      const originalSrc = img.getAttribute('src');
      if (originalSrc && originalSrc.startsWith('http')) {
        // Only proxy external images
        img.crossOrigin = 'anonymous';
        img.src = `/api/image-proxy?url=${encodeURIComponent(originalSrc)}`;
      }
    });
  };

  const handleDownload = async () => {
    if (bottleRef.current) {
      setImageLoaded(false);
      
      try {
        // Prepare images for capture
        prepareForCapture();
        
        // Capture the element
        const canvas = await html2canvas(bottleRef.current, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          scale: 2, // Higher quality
          logging: true
        });

        setImageLoaded(true);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'vatika-bestie-bottle.png';
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
        setImageLoaded(true); // Reset the button state even on error
        alert("Failed to generate image. Please try again.");
      }
    }
  };
  
  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  // const handleWhatsAppShare = () => {
  //   const url = encodeURIComponent(window.location.href);
  //   const text = encodeURIComponent('Check out my Vatika Bestie Bottle!');
  //   window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  // };
  
  const handleWhatsAppShare = async () => {
  if (!bottleRef.current) return;

  try {
    const canvas = await html2canvas(bottleRef.current, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 2,
    });

    canvas.toBlob(async (blob) => {
      if (!blob) return alert("Image creation failed");

      const file = new File([blob], 'vatika-bottle.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Vatika Bestie Bottle',
          text: 'Check out my Vatika Bestie Bottle!',
          files: [file],
        });
      } else {
        // Fallback for unsupported devices: just share the URL
        const text = encodeURIComponent('Check out my Vatika Bestie Bottle!');
        // const url = encodeURIComponent(window.location.href);
        // window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
        window.location.href = `intent://send/?text=${text}#Intent;package=com.whatsapp;scheme=whatsapp;end`;
      }
    }, 'image/png');
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};


  const handleShare = async () => {
    if (!bottleRef.current) return;
    
    try {
      setImageLoaded(false);
      
      // Prepare images for capture
      prepareForCapture();
      
      // Capture the element
      const canvas = await html2canvas(bottleRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: true
      });

      canvas.toBlob(async (blob) => {
        setImageLoaded(true);
        
        if (!blob) {
          alert("Failed to create image. Please try again.");
          return;
        }

        const file = new File([blob], 'vatika-bestie-bottle.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Vatika Bestie Bottle',
              text: 'Check out our Vatika Bestie Bottle!',
              files: [file],
            });
          } catch (err) {
            console.error("Sharing failed:", err);
            alert("Sharing failed or was cancelled.");
          }
        } else {
          alert("Native sharing is not supported on this browser. Try using the social share buttons instead.");
        }
      }, 'image/png');
    } catch (error) {
      console.error("Error generating image for sharing:", error);
      setImageLoaded(true); // Reset the button state even on error
      alert("Failed to generate image for sharing. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Share Your Bestie Bottle</h2>
        <p className="mb-6 text-gray-600">Download or share the awesome photo you created!</p>
        <div className="flex flex-col gap-4">
            <button onClick={handleDownload} disabled={!imageLoaded} className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${!imageLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {imageLoaded ? 'Download Image' : 'Loading...'}
            </button>
            {/* <button onClick={handleShare} disabled={!imageLoaded} className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${!imageLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {imageLoaded ? 'Share (Mobile)' : 'Loading...'}
            </button> */}
            <button onClick={handleShare} disabled={!imageLoaded} className={`bg-green-500 text-white py-2 rounded hover:bg-green-600 ${!imageLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
