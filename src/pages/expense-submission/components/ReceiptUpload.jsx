import React, { useState, useRef, useCallback } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ReceiptUpload = ({ 
  onFileUpload, 
  onOCRComplete, 
  isProcessing = false, 
  ocrProgress = 0,
  uploadedFiles = []
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  // Mock OCR processing function
  const processOCR = useCallback(async (file) => {
    // Simulate OCR processing with progress updates
    const mockOCRData = {
      amount: '45.67',
      date: '2025-10-03',
      vendor: 'Starbucks Coffee',
      confidence: 0.92
    };

    // Simulate processing time with progress updates
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      // In real implementation, this would update progress
    }

    return mockOCRData;
  }, []);

  const handleDrag = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);

    const files = Array.from(e?.dataTransfer?.files);
    await handleFiles(files);
  }, []);

  const handleFileInput = useCallback(async (e) => {
    const files = Array.from(e?.target?.files);
    await handleFiles(files);
  }, []);

  const handleFiles = async (files) => {
    const validFiles = files?.filter(file => {
      const isValidType = file?.type?.startsWith('image/');
      const isValidSize = file?.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles?.length === 0) {
      alert('Please select valid image files (max 10MB each)');
      return;
    }

    // Create preview URLs
    const newPreviewUrls = validFiles?.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file?.name,
      size: file?.size
    }));

    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    onFileUpload(validFiles);

    // Process OCR for the first file
    if (validFiles?.length > 0) {
      try {
        const ocrResult = await processOCR(validFiles?.[0]);
        onOCRComplete(ocrResult);
      } catch (error) {
        console.error('OCR processing failed:', error);
      }
    }
  };

  const removeFile = (index) => {
    setPreviewUrls(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated?.[index]?.url);
      updated?.splice(index, 1);
      return updated;
    });
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="bg-card border border-border rounded-lg expense-shadow-sm">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Icon name="Upload" size={24} className="mr-2 text-primary" />
          Receipt Upload
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload receipt images for automatic data extraction using OCR technology.
        </p>
      </div>
      <div className="p-6">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center expense-transition ${
            dragActive
              ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          {isProcessing ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Loader2" size={32} className="text-primary animate-spin" />
              </div>
              <div className="space-y-2">
                <p className="text-foreground font-medium">Processing Receipt...</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full expense-transition"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Extracting data from your receipt ({ocrProgress}%)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Icon name="Upload" size={32} className="text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-foreground font-medium">
                  Drag and drop your receipts here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
              <Button
                variant="outline"
                onClick={openFileDialog}
                iconName="FolderOpen"
                iconPosition="left"
              >
                Choose Files
              </Button>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Supported formats: JPG, PNG, GIF, WebP</p>
                <p>Maximum file size: 10MB per file</p>
              </div>
            </div>
          )}
        </div>

        {/* File Previews */}
        {previewUrls?.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium text-foreground">Uploaded Receipts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {previewUrls?.map((preview, index) => (
                <div key={index} className="relative bg-muted rounded-lg overflow-hidden">
                  <div className="aspect-square">
                    <Image
                      src={preview?.url}
                      alt={`Receipt ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {preview?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(preview?.size)}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFile(index)}
                      iconName="Trash2"
                      iconPosition="left"
                      fullWidth
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OCR Tips */}
        <div className="mt-6 bg-accent/10 border border-accent/20 rounded-md p-4">
          <div className="flex items-start">
            <Icon name="Lightbulb" size={20} className="text-accent mr-3 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Tips for better OCR results:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Ensure the receipt is well-lit and clearly visible</li>
                <li>• Avoid shadows and reflections on the receipt</li>
                <li>• Keep the receipt flat and straight</li>
                <li>• Include the entire receipt in the image</li>
                <li>• Use high-resolution images when possible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptUpload;