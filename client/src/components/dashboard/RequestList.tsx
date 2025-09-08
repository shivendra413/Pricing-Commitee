import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RequestWithCustomer } from "@/types/dashboard";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface RequestListProps {
  requests: RequestWithCustomer[];
  selectedRequestIds: string[];
  onRequestSelection: (requestId: string) => void;
  onRequestSelect: (request: RequestWithCustomer) => void;
}

export default function RequestList({ 
  requests, 
  selectedRequestIds, 
  onRequestSelection, 
  onRequestSelect 
}: RequestListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/discount-requests/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/discount-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Success",
        description: "Request updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update request",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    updateRequestMutation.mutate({ id: requestId, status: "approved" });
  };

  const handleReject = (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    updateRequestMutation.mutate({ id: requestId, status: "rejected" });
  };

  const getStatusClass = (stage: string) => {
    const statusClasses: Record<string, string> = {
      "Inquiry": "status-inquiry",
      "Negotiation": "status-negotiation",
      "Final Review": "status-review",
      "Ready to Close": "status-ready",
    };
    return statusClasses[stage] || "status-inquiry";
  };

  const getPriorityClass = (priority: string) => {
    const priorityClasses: Record<string, string> = {
      "High": "priority-high",
      "Medium": "priority-medium",
      "Low": "priority-low",
    };
    return priorityClasses[priority] || "priority-medium";
  };

  const getPriorityColor = (priority: string) => {
    const priorityColors: Record<string, string> = {
      "High": "text-red-600",
      "Medium": "text-orange-600",
      "Low": "text-green-600",
    };
    return priorityColors[priority] || "text-orange-600";
  };

  return (
    <div className="full-width bg-card rounded-lg shadow-sm p-4" data-testid="request-list">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <i className="fas fa-list-alt mr-2 text-blue-600"></i>
        Discount Requests
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-secondary">
            <tr>
              <th className="px-2 py-2 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      requests.forEach(request => onRequestSelection(request.id));
                    } else {
                      selectedRequestIds.forEach(id => onRequestSelection(id));
                    }
                  }}
                  data-testid="select-all-checkbox"
                />
              </th>
              <th className="px-2 py-2 text-left">Customer</th>
              <th className="px-2 py-2 text-left">Product</th>
              <th className="px-2 py-2 text-right">Discount %</th>
              <th className="px-2 py-2 text-right">Order Value (OMR)</th>
              <th className="px-2 py-2 text-center">Stage</th>
              <th className="px-2 py-2 text-center">Priority</th>
              <th className="px-2 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className={`request-row border-b border-border hover:bg-muted/50 cursor-pointer ${
                  selectedRequestIds.includes(request.id) ? 'selected' : ''
                } ${getPriorityClass(request.priority)}`}
                onClick={() => onRequestSelect(request)}
                data-testid={`request-row-${request.id}`}
              >
                <td className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRequestIds.includes(request.id)}
                    onChange={() => onRequestSelection(request.id)}
                    onClick={(e) => e.stopPropagation()}
                    data-testid={`select-request-${request.id}`}
                  />
                </td>
                <td className="px-2 py-2">
                  <div className="font-medium" data-testid={`customer-name-${request.id}`}>
                    {request.customer?.name || 'Unknown Customer'}
                  </div>
                  <div className="text-muted-foreground text-xs" data-testid={`customer-tier-${request.id}`}>
                    {request.customer?.tier || 'N/A'} Tier
                  </div>
                </td>
                <td className="px-2 py-2">
                  <div data-testid={`product-name-${request.id}`}>{request.product}</div>
                  <div className="text-muted-foreground text-xs" data-testid={`product-grade-${request.id}`}>
                    Grade {request.grade}
                  </div>
                </td>
                <td className="px-2 py-2 text-right font-semibold text-orange-600" data-testid={`discount-${request.id}`}>
                  {parseFloat(request.discountPercentage).toFixed(1)}%
                </td>
                <td className="px-2 py-2 text-right font-medium" data-testid={`order-value-${request.id}`}>
                  {parseFloat(request.orderValue).toLocaleString()}
                </td>
                <td className="px-2 py-2 text-center">
                  <span 
                    className={`px-2 py-1 text-xs rounded-full ${getStatusClass(request.stage)}`}
                    data-testid={`stage-${request.id}`}
                  >
                    {request.stage}
                  </span>
                </td>
                <td className="px-2 py-2 text-center">
                  <span 
                    className={`text-xs font-medium ${getPriorityColor(request.priority)}`}
                    data-testid={`priority-${request.id}`}
                  >
                    {request.priority}
                  </span>
                </td>
                <td className="px-2 py-2 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800 mx-1"
                    onClick={(e) => handleApprove(e, request.id)}
                    disabled={updateRequestMutation.isPending}
                    data-testid={`approve-${request.id}`}
                  >
                    <i className="fas fa-check"></i>
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 mx-1"
                    onClick={(e) => handleReject(e, request.id)}
                    disabled={updateRequestMutation.isPending}
                    data-testid={`reject-${request.id}`}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
