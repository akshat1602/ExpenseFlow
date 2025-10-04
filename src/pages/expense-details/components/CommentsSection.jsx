import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommentsSection = ({ comments, onAddComment, userRole, currentUser }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment?.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment?.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCommentTypeColor = (type) => {
    switch (type) {
      case 'approval': return 'text-success bg-success/10';
      case 'rejection': return 'text-error bg-error/10';
      case 'clarification': return 'text-warning bg-warning/10';
      case 'system': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted/30';
    }
  };

  const getCommentTypeIcon = (type) => {
    switch (type) {
      case 'approval': return 'CheckCircle';
      case 'rejection': return 'XCircle';
      case 'clarification': return 'HelpCircle';
      case 'system': return 'Settings';
      default: return 'MessageSquare';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center space-x-2">
        <Icon name="MessageSquare" size={20} className="text-primary" />
        <span>Comments & Activity</span>
        <span className="text-sm font-normal text-muted-foreground">
          ({comments?.length})
        </span>
      </h2>
      {/* Add Comment Form */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-border flex-shrink-0">
            <Image
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-3">
            <Input
              type="text"
              placeholder="Add a comment or note..."
              value={newComment}
              onChange={(e) => setNewComment(e?.target?.value)}
              className="bg-background"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Info" size={12} />
                <span>Comments are visible to all reviewers and the employee</span>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment?.trim() || isSubmitting}
                loading={isSubmitting}
                iconName="Send"
                iconPosition="right"
              >
                Add Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Comments List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {comments?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No comments yet</p>
            <p className="text-sm text-muted-foreground">Be the first to add a comment</p>
          </div>
        ) : (
          comments?.map((comment) => (
            <div key={comment?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/20 expense-transition">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-border flex-shrink-0">
                <Image
                  src={comment?.author?.avatar}
                  alt={comment?.author?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-foreground text-sm">
                    {comment?.author?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {comment?.author?.role}
                  </span>
                  {comment?.type && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center space-x-1 ${getCommentTypeColor(comment?.type)}`}>
                      <Icon name={getCommentTypeIcon(comment?.type)} size={10} />
                      <span>{comment?.type}</span>
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {comment?.timestamp}
                  </span>
                </div>
                
                <p className="text-sm text-foreground leading-relaxed">
                  {comment?.content}
                </p>

                {comment?.attachments && comment?.attachments?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {comment?.attachments?.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded text-xs">
                        <Icon name="Paperclip" size={12} className="text-muted-foreground" />
                        <span className="text-muted-foreground">{attachment?.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {comment?.edited && (
                  <div className="mt-1 flex items-center space-x-1 text-xs text-muted-foreground">
                    <Icon name="Edit" size={10} />
                    <span>Edited {comment?.editedAt}</span>
                  </div>
                )}
              </div>

              {comment?.author?.id === currentUser?.id && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    iconName="MoreHorizontal"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {/* Activity Summary */}
      {comments?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">
                {comments?.filter(c => c?.type === 'approval')?.length}
              </div>
              <div className="text-xs text-success">Approvals</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {comments?.filter(c => c?.type === 'clarification')?.length}
              </div>
              <div className="text-xs text-warning">Clarifications</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {comments?.filter(c => c?.type === 'rejection')?.length}
              </div>
              <div className="text-xs text-error">Rejections</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {comments?.filter(c => !c?.type || c?.type === 'comment')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Comments</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;