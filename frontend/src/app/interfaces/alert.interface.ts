interface AlertColor {
  border: string;
  background: string;
  name: string;
  hover: string;
  message: string;
}

const createAlertColor = (
  border: string,
  background: string,
  name: string,
  hover: string,
  message: string
): AlertColor => ({ border, background, name, hover, message });

export interface Alert {
  name:
    | 'Server Error'
    | 'Client Error'
    | 'Redirection'
    | 'Success'
    | 'Informational';
  message: string;
  color: AlertColor;
}

export const alertColorMap: Record<Alert['name'], AlertColor> = {
  Success: createAlertColor(
    'border-green-500',
    'bg-green-50',
    'text-green-800',
    'hover:text-red-600',
    'text-green-700'
  ),
  'Client Error': createAlertColor(
    'border-red-500',
    'bg-red-50',
    'text-red-800',
    'hover:text-red-600',
    'text-red-700'
  ),
  'Server Error': createAlertColor(
    'border-red-500',
    'bg-red-50',
    'text-red-800',
    'hover:text-red-600',
    'text-red-700'
  ),
  Redirection: createAlertColor(
    'border-yellow-500',
    'bg-yellow-50',
    'text-yellow-800',
    'hover:text-yellow-600',
    'text-yellow-700'
  ),
  Informational: createAlertColor(
    'border-blue-500',
    'bg-blue-50',
    'text-blue-800',
    'hover:text-blue-600',
    'text-blue-700'
  ),
};
