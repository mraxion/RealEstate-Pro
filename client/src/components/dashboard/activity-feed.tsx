import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from '@shared/schema';
import { timeAgo } from '@/lib/utils';
import { PlusCircle, Bell, CheckCircle, Trash } from 'lucide-react';

export function ActivityFeed() {
  const [viewAll, setViewAll] = useState(false);
  
  const { data: activities, isLoading, error } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  const getIconForActivity = (type: string) => {
    switch (type) {
      case 'property-created':
        return (
          <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
            <PlusCircle className="h-5 w-5 text-white" />
          </div>
        );
      case 'lead-created':
        return (
          <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center">
            <Bell className="h-5 w-5 text-white" />
          </div>
        );
      case 'appointment-created':
      case 'property-sold':
      case 'lead-converted':
        return (
          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
        );
      case 'property-deleted':
      case 'lead-deleted':
      case 'appointment-deleted':
        return (
          <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
            <Trash className="h-5 w-5 text-white" />
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center">
            <Bell className="h-5 w-5 text-white" />
          </div>
        );
    }
  };

  const displayedActivities = viewAll 
    ? activities
    : activities?.slice(0, 4);

  return (
    <Card>
      <CardHeader className="px-5 py-4 border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold text-neutral-900">Actividad Reciente</CardTitle>
      </CardHeader>
      
      <CardContent className="p-5">
        <div className="flow-root">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-4 text-sm text-neutral-500">
              Error al cargar las actividades
            </div>
          ) : activities?.length === 0 ? (
            <div className="text-center py-4 text-sm text-neutral-500">
              No hay actividades recientes
            </div>
          ) : (
            <ul className="-mb-8">
              {displayedActivities?.map((activity, index) => (
                <li key={activity.id}>
                  <div className={`relative pb-8 ${
                    index !== displayedActivities.length - 1 ? "": ""
                  }`}>
                    {index !== displayedActivities.length - 1 && (
                      <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-neutral-200" aria-hidden="true"></span>
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        {getIconForActivity(activity.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-neutral-800">{activity.description}</p>
                        <p className="mt-0.5 text-xs text-neutral-500">{timeAgo(activity.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            onClick={() => setViewAll(!viewAll)}
          >
            {viewAll ? "Ver menos" : "Ver todas las actividades"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ActivityFeed;
