interface ImagePreviewProps {
  imageUrl: string | null;
}

const ImagePreview = ({ imageUrl }: ImagePreviewProps) => {
  if (!imageUrl) return null;

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
      <img
        src={imageUrl}
        alt="Selected"
        className="w-full h-full object-contain bg-black/50"
      />
    </div>
  );
};

export default ImagePreview;