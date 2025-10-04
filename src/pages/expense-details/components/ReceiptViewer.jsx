import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ReceiptViewer = ({ receipts, ocrData }) => {
  const [selectedReceipt, setSelectedReceipt] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!receipts || receipts?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Receipt" size={20} className="text-primary" />
          <span>Receipt</span>
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icon name="FileX" size={48} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No receipt uploaded</p>
        </div>
      </div>
    );
  }

  const currentReceipt = receipts?.[selectedReceipt];

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Receipt" size={20} className="text-primary" />
            <span>Receipt {receipts?.length > 1 ? `(${selectedReceipt + 1} of ${receipts?.length})` : ''}</span>
          </h2>
          <div className="flex items-center space-x-2">
            {receipts?.length > 1 && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReceipt(Math.max(0, selectedReceipt - 1))}
                  disabled={selectedReceipt === 0}
                  iconName="ChevronLeft"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReceipt(Math.min(receipts?.length - 1, selectedReceipt + 1))}
                  disabled={selectedReceipt === receipts?.length - 1}
                  iconName="ChevronRight"
                />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(true)}
              iconName="Maximize"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receipt Image */}
          <div className="space-y-4">
            <div className="relative bg-muted/30 rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
              <Image
                src={currentReceipt?.url}
                alt={`Receipt ${selectedReceipt + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
            
            {receipts?.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {receipts?.map((receipt, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedReceipt(index)}
                    className={`flex-shrink-0 w-16 h-20 rounded-md overflow-hidden border-2 expense-transition ${
                      selectedReceipt === index 
                        ? 'border-primary' :'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <Image
                      src={receipt?.url}
                      alt={`Receipt thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* OCR Extracted Data */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Scan" size={16} className="text-accent" />
              <span className="text-sm font-medium text-accent">OCR Extracted Data</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-xs text-success">Verified</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground">Amount</span>
                  <div className="flex items-center space-x-1">
                    <Icon name="Check" size={14} className="text-success" />
                    <span className="text-xs text-success">Match</span>
                  </div>
                </div>
                <p className="text-lg font-semibold text-foreground">${ocrData?.amount}</p>
              </div>

              <div className="bg-muted/30 p-3 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground">Date</span>
                  <div className="flex items-center space-x-1">
                    <Icon name="Check" size={14} className="text-success" />
                    <span className="text-xs text-success">Match</span>
                  </div>
                </div>
                <p className="font-medium text-foreground">{ocrData?.date}</p>
              </div>

              <div className="bg-muted/30 p-3 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground">Vendor</span>
                  <div className="flex items-center space-x-1">
                    <Icon name="Check" size={14} className="text-success" />
                    <span className="text-xs text-success">Match</span>
                  </div>
                </div>
                <p className="font-medium text-foreground">{ocrData?.vendor}</p>
              </div>

              <div className="bg-muted/30 p-3 rounded-md">
                <span className="text-sm font-medium text-muted-foreground">Tax Amount</span>
                <p className="font-medium text-foreground">${ocrData?.tax}</p>
              </div>

              <div className="bg-muted/30 p-3 rounded-md">
                <span className="text-sm font-medium text-muted-foreground">Payment Method</span>
                <p className="font-medium text-foreground">{ocrData?.paymentMethod}</p>
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/20 p-3 rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertCircle" size={16} className="text-accent" />
                <span className="text-sm font-medium text-accent">OCR Confidence</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Accuracy</span>
                  <span className="font-medium">{ocrData?.confidence}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full expense-transition" 
                    style={{ width: `${ocrData?.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-300 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
              iconName="X"
            />
            <Image
              src={currentReceipt?.url}
              alt={`Receipt ${selectedReceipt + 1} - Fullscreen`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ReceiptViewer;