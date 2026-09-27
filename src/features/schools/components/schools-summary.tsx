import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

interface SchoolsSummaryProps {
  totalSchools: number;
  totalClasses: number;
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <VStack className="flex-1">
      <Text bold className="text-3xl text-primary-foreground">
        {value}
      </Text>
      <Text size="sm" className="text-primary-foreground/80">
        {label}
      </Text>
    </VStack>
  );
}

export function SchoolsSummary({ totalSchools, totalClasses }: SchoolsSummaryProps) {
  return (
    <HStack className="rounded-2xl bg-primary p-5">
      <Stat value={totalSchools} label={totalSchools === 1 ? 'escola' : 'escolas'} />
      <Stat value={totalClasses} label={totalClasses === 1 ? 'turma' : 'turmas'} />
    </HStack>
  );
}
