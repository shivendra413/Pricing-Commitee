import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ActionButtonsProps {
  selectedRequestIds: string[];
  onSelectionClear: () => void;
}

export default function ActionButtons({ selectedRequestIds, onSelectionClear }: ActionButtonsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      return apiRequest("PATCH", "/api/discount-requests/bulk", { ids, status });
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/discount-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      onSelectionClear();
      toast({
        title: "Success",
        description: `Requests ${status} successfully`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update requests",
        variant: "destructive",
      });
    },
  });

  const handleBulkApprove = () => {
    if (selectedRequestIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select requests to approve",
        variant: "destructive",
      });
      return;
    }
    bulkUpdateMutation.mutate({ ids: selectedRequestIds, status: "approved" });
  };

  const handleBulkReject = () => {
    if (selectedRequestIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select requests to reject",
        variant: "destructive",
      });
      return;
    }
    bulkUpdateMutation.mutate({ ids: selectedRequestIds, status: "rejected" });
  };

  const handleExport = () => {
    if (selectedRequestIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select requests to export",
        variant: "destructive",
      });
      return;
    }
    
    // Mock export functionality
    toast({
      title: "Export Started",
      description: `Exporting ${selectedRequestIds.length} requests to PDF...`,
    });
  };

  return (
    <div className="full-width bg-card rounded-lg shadow-sm p-4" data-testid="action-buttons">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm disabled:opacity-50"
            onClick={handleBulkApprove}
            disabled={bulkUpdateMutation.isPending || selectedRequestIds.length === 0}
            data-testid="button-bulk-approve"
          >
            <i className="fas fa-check mr-2"></i>
            Approve Selected
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm disabled:opacity-50"
            onClick={handleBulkReject}
            disabled={bulkUpdateMutation.isPending || selectedRequestIds.length === 0}
            data-testid="button-bulk-reject"
          >
            <i className="fas fa-times mr-2"></i>
            Reject Selected
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm disabled:opacity-50"
            onClick={handleExport}
            disabled={selectedRequestIds.length === 0}
            data-testid="button-export"
          >
            <i className="fas fa-download mr-2"></i>
            Export Report
          </button>
        </div>
        <div className="text-sm text-muted-foreground" data-testid="selection-count">
          {selectedRequestIds.length} requests selected
        </div>
      </div>
    </div>
  );
}
