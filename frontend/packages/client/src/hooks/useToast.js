import Toast from 'components/common/Toast';
import { useToast } from '@chakra-ui/react';

export default function useToastHook() {
  const toast = useToast();

  const popToast = (toastProps = {}) => {
    toast({
      position: 'bottom',
      duration: 5000,
      render: ({ onClose }) => <Toast onClose={onClose} {...toastProps} />,
    });
  };

  return {
    popToast,
  };
}
