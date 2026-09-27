import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Excluir',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <AlertDialog isOpen={isOpen} onClose={isLoading ? undefined : onClose} size="md">
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading size="md" className="text-foreground">
            {title}
          </Heading>
        </AlertDialogHeader>
        <AlertDialogBody className="mb-4 mt-2">
          <Text size="sm" className="text-muted-foreground">
            {description}
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter className="gap-2">
          <Button variant="outline" onPress={onClose} isDisabled={isLoading}>
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button variant="destructive" onPress={onConfirm} isDisabled={isLoading}>
            {isLoading ? <ButtonSpinner /> : null}
            <ButtonText>{confirmLabel}</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
