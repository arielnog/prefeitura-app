import type { SchoolClassInput } from '@/features/classes/types';
import type { SchoolInput } from '@/features/schools/types';

type SchoolSeed = SchoolInput & { classes: SchoolClassInput[] };

const year = new Date().getFullYear();

export const SCHOOL_SEEDS: SchoolSeed[] = [
  {
    name: 'EMEF Monteiro Lobato',
    address: 'Rua das Palmeiras, 120 - Centro',
    classes: [
      { name: '1º Ano A', shift: 'morning', schoolYear: year },
      { name: '1º Ano B', shift: 'afternoon', schoolYear: year },
      { name: '5º Ano A', shift: 'morning', schoolYear: year },
    ],
  },
  {
    name: 'Escola Municipal Cecília Meireles',
    address: 'Av. Brasil, 845 - Jardim Primavera',
    classes: [
      { name: '3º Ano A', shift: 'morning', schoolYear: year },
      { name: 'EJA - Etapa 1', shift: 'evening', schoolYear: year },
    ],
  },
  {
    name: 'EMEI Pequeno Príncipe',
    address: 'Rua São José, 33 - Vila Nova',
    classes: [{ name: 'Pré II', shift: 'full', schoolYear: year }],
  },
  {
    name: 'Escola Rural Santa Luzia',
    address: 'Estrada Municipal, km 12 - Zona Rural',
    classes: [],
  },
];
