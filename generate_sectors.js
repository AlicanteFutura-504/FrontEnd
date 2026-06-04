const fs = require('fs');
const path = require('path');

const sectors = [
  { path: 'barberia', title: 'Barbería', icon: '💈' },
  { path: 'fisioterapia', title: 'Fisioterapia', icon: '🦴' },
  { path: 'peluqueria', title: 'Peluquería', icon: '💇‍♀️' },
  { path: 'salon-de-spa', title: 'Salón de spa', icon: '🌸' },
  { path: 'estudio-de-pilates', title: 'Estudio de pilates', icon: '🧘‍♀️' },
  { path: 'estudio-de-yoga', title: 'Estudio de yoga', icon: '🧘‍♂️' },
  { path: 'taller-de-reparacion-movil', title: 'Taller de reparación móvil', icon: '📱' }
];

const baseDir = path.join(process.cwd(), 'app');

sectors.forEach(s => {
  const dirPath = path.join(baseDir, s.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const content = `import ComingSoonPage from '@/components/ui/ComingSoonPage';

export default function ${s.title.replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}Page() {
  return <ComingSoonPage title="${s.title}" icon="${s.icon}" />;
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});

console.log('Created 7 pages successfully with icons.');
