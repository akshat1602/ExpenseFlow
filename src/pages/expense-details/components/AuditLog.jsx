import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AuditLog = ({ auditEntries }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState('all');

  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case 'created': return 'Plus';
      case 'submitted': return 'Send';
      case 'approved': return 'CheckCircle';
      case 'rejected': return 'XCircle';
      case 'updated': return 'Edit';
      case 'commented': return 'MessageSquare';
      case 'escalated': return 'ArrowUp';
      case 'viewed': return 'Eye';
      case 'downloaded': return 'Download';
      default: return 'Activity';
    }
  };

  const getActionColor = (action) => {
    switch (action?.toLowerCase()) {
      case 'created': return 'text-accent';
      case 'submitted': return 'text-primary';
      case 'approved': return 'text-success';
      case 'rejected': return 'text-error';
      case 'updated': return 'text-warning';
      case 'commented': return 'text-secondary';
      case 'escalated': return 'text-warning';
      case 'viewed': return 'text-muted-foreground';
      case 'downloaded': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'approvals', label: 'Approvals' },
    { value: 'comments', label: 'Comments' },
    { value: 'updates', label: 'Updates' },
    { value: 'system', label: 'System Events' }
  ];

  const filteredEntries = auditEntries?.filter(entry => {
    if (filter === 'all') return true;
    if (filter === 'approvals') return ['approved', 'rejected', 'escalated']?.includes(entry?.action?.toLowerCase());
    if (filter === 'comments') return entry?.action?.toLowerCase() === 'commented';
    if (filter === 'updates') return ['updated', 'created', 'submitted']?.includes(entry?.action?.toLowerCase());
    if (filter === 'system') return entry?.isSystemEvent;
    return true;
  });

  const displayEntries = isExpanded ? filteredEntries : filteredEntries?.slice(0, 5);

  return (
    <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="History" size={20} className="text-primary" />
          <span>Audit Log</span>
          <span className="text-sm font-normal text-muted-foreground">
            ({filteredEntries?.length} entries)
          </span>
        </h2>

        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="text-sm border border-border rounded-md px-3 py-1 bg-background text-foreground"
          >
            {filterOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          >
            {isExpanded ? 'Show Less' : 'Show All'}
          </Button>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {displayEntries?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="History" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No audit entries found</p>
            <p className="text-sm text-muted-foreground">Activities will appear here as they occur</p>
          </div>
        ) : (
          displayEntries?.map((entry) => (
            <div key={entry?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/20 expense-transition">
              {/* Action Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center ${getActionColor(entry?.action)}`}>
                <Icon name={getActionIcon(entry?.action)} size={16} />
              </div>

              {/* Entry Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground text-sm">
                      {entry?.action}
                    </span>
                    {entry?.isSystemEvent && (
                      <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">
                        System
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {entry?.timestamp}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  {entry?.description}
                </p>

                {/* User Info */}
                {entry?.user && (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-border">
                      <Image
                        src={entry?.user?.avatar}
                        alt={entry?.user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {entry?.user?.name} ({entry?.user?.role})
                    </span>
                  </div>
                )}

                {/* Additional Details */}
                {entry?.details && (
                  <div className="mt-2 bg-muted/30 p-2 rounded text-xs">
                    <div className="flex items-center space-x-1 mb-1">
                      <Icon name="Info" size={10} className="text-muted-foreground" />
                      <span className="font-medium text-muted-foreground">Details</span>
                    </div>
                    {Object.entries(entry?.details)?.map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* IP Address and Browser Info */}
                {entry?.metadata && (
                  <div className="mt-1 flex items-center space-x-4 text-xs text-muted-foreground">
                    {entry?.metadata?.ipAddress && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Globe" size={10} />
                        <span>{entry?.metadata?.ipAddress}</span>
                      </div>
                    )}
                    {entry?.metadata?.userAgent && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Monitor" size={10} />
                        <span>{entry?.metadata?.userAgent}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Summary Stats */}
      {filteredEntries?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">
                {filteredEntries?.filter(e => ['approved', 'rejected']?.includes(e?.action?.toLowerCase()))?.length}
              </div>
              <div className="text-xs text-muted-foreground">Decisions</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {filteredEntries?.filter(e => e?.action?.toLowerCase() === 'commented')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Comments</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {filteredEntries?.filter(e => e?.action?.toLowerCase() === 'updated')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Updates</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {new Set(filteredEntries.map(e => e.user?.id).filter(Boolean))?.size}
              </div>
              <div className="text-xs text-muted-foreground">Users</div>
            </div>
          </div>
        </div>
      )}
      {!isExpanded && filteredEntries?.length > 5 && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            iconName="ChevronDown"
            iconPosition="right"
          >
            Show {filteredEntries?.length - 5} more entries
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuditLog;