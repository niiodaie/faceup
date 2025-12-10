import React from 'react';
import { Button } from './ui/button';
import { Facebook, Twitter, Mail, Share2 } from 'lucide-react';

const SocialShare = ({ title = "Check out my FaceUp style!", url = window.location.href, image = null }) => {
  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);
  
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}&hashtags=FaceUp,Beauty,Style`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Check out FaceUp!');
    const body = encodeURIComponent(`${title}\n\nDiscover your perfect style with FaceUp: ${url}\n\n#FaceUp #Beauty #Style`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: 'Discover your perfect style with FaceUp!',
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(`${title} - ${url}`);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="w-full mt-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Share Your Style
        </h3>
        <p className="text-sm text-gray-600">
          Show off your FaceUp results with friends!
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={handleFacebookShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>

        <Button
          onClick={handleTwitterShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100"
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>

        <Button
          onClick={handleEmailShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
        >
          <Mail className="h-4 w-4" />
          Email
        </Button>

        <Button
          onClick={handleNativeShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      <div className="text-center mt-3">
        <p className="text-xs text-gray-500">
          Share your FaceUp journey and inspire others! ✨
        </p>
      </div>
    </div>
  );
};

export default SocialShare;

