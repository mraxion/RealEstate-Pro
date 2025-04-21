import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffWeeks = Math.round(diffDays / 7);
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffDays / 365);

  if (diffSecs < 60) {
    return 'hace unos segundos';
  } else if (diffMins < 60) {
    return `hace ${diffMins} minutos`;
  } else if (diffHours < 24) {
    return `hace ${diffHours} horas`;
  } else if (diffDays < 7) {
    return `hace ${diffDays} días`;
  } else if (diffWeeks < 4) {
    return `hace ${diffWeeks} semanas`;
  } else if (diffMonths < 12) {
    return `hace ${diffMonths} meses`;
  } else {
    return `hace ${diffYears} años`;
  }
}

export function getPropertyStatus(status: string): { label: string, colorClass: string } {
  switch (status.toLowerCase()) {
    case 'available':
    case 'disponible':
      return { label: 'Disponible', colorClass: 'bg-green-100 text-green-800' };
    case 'reserved':
    case 'reservado':
      return { label: 'Reservado', colorClass: 'bg-yellow-100 text-yellow-800' };
    case 'sold':
    case 'vendido':
      return { label: 'Vendido', colorClass: 'bg-red-100 text-red-800' };
    case 'rented':
    case 'alquilado':
      return { label: 'Alquilado', colorClass: 'bg-blue-100 text-blue-800' };
    default:
      return { label: status, colorClass: 'bg-gray-100 text-gray-800' };
  }
}

export function getLeadStage(stage: string): { label: string, colorClass: string } {
  switch (stage.toLowerCase()) {
    case 'new':
    case 'nuevo':
      return { label: 'Nuevo', colorClass: 'bg-blue-100 text-blue-800' };
    case 'qualified':
    case 'calificado':
      return { label: 'Calificado', colorClass: 'bg-indigo-100 text-indigo-800' };
    case 'interested':
    case 'interesado':
      return { label: 'Interesado', colorClass: 'bg-purple-100 text-purple-800' };
    case 'scheduled':
    case 'agendado':
      return { label: 'Agendado', colorClass: 'bg-yellow-100 text-yellow-800' };
    case 'closed':
    case 'cerrado':
      return { label: 'Cerrado', colorClass: 'bg-green-100 text-green-800' };
    case 'lost':
    case 'perdido':
      return { label: 'Perdido', colorClass: 'bg-red-100 text-red-800' };
    default:
      return { label: stage, colorClass: 'bg-gray-100 text-gray-800' };
  }
}

export function getWorkflowStatus(status: string): { label: string, colorClass: string, color: string } {
  switch (status.toLowerCase()) {
    case 'active':
    case 'activo':
      return { 
        label: 'Activo', 
        colorClass: 'text-green-500',
        color: 'bg-green-500'
      };
    case 'paused':
    case 'en pausa':
      return { 
        label: 'En pausa', 
        colorClass: 'text-yellow-500',
        color: 'bg-yellow-500'
      };
    case 'error':
      return { 
        label: 'Error', 
        colorClass: 'text-red-500',
        color: 'bg-red-500'
      };
    default:
      return { 
        label: status, 
        colorClass: 'text-gray-500',
        color: 'bg-gray-500'
      };
  }
}
