import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Workflow } from '@shared/schema';
import { getWorkflowStatus } from '@/lib/utils';
import { Settings } from 'lucide-react';

export function WorkflowStatus() {
  const { data: workflows, isLoading, error } = useQuery<Workflow[]>({
    queryKey: ['/api/workflows'],
  });

  return (
    <Card>
      <CardHeader className="px-5 py-4 border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold text-neutral-900">Flujos de Trabajo</CardTitle>
      </CardHeader>
      
      <CardContent className="p-5">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[50px]" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-sm text-neutral-500">
            Error al cargar los flujos de trabajo
          </div>
        ) : (
          <div className="space-y-4">
            {workflows?.map((workflow) => {
              const statusInfo = getWorkflowStatus(workflow.status);
              
              return (
                <div key={workflow.id}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-neutral-700">{workflow.name}</h3>
                    <span className={`text-xs font-medium ${statusInfo.colorClass}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <Progress value={workflow.progress} className="h-2 bg-neutral-200">
                    <div 
                      className={`h-full rounded-full`}
                      style={{ width: `${workflow.progress}%`, backgroundColor: statusInfo.color }}
                    />
                  </Progress>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-5">
          <Button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <Settings className="h-4 w-4 mr-1.5" />
            Gestionar flujos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default WorkflowStatus;
