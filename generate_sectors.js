const fs = require('fs');
const path = require('path');

const sectors = [
  { path: 'barberia', title: 'Barbería', icon: '💈', bgImage: '/barberia-bg.jpg' },
  { path: 'fisioterapia', title: 'Fisioterapia', icon: '🦴', bgImage: '/fisioterapia-bg.jpg' },
  { path: 'peluqueria', title: 'Peluquería', icon: '💇‍♀️', bgImage: '/peluqueria-bg.jpg' },
  { path: 'salon-de-spa', title: 'Salón de spa', icon: '🌸', bgImage: '/salon-de-spa-bg.jpg' },
  { path: 'estudio-de-pilates', title: 'Estudio de pilates', icon: '🧘‍♀️', bgImage: '/estudio-de-pilates-bg.jpg' },
  { path: 'estudio-de-yoga', title: 'Estudio de yoga', icon: '🧘‍♂️', bgImage: '/estudio-de-yoga-bg.jpg' },
  { path: 'taller-de-reparacion-movil', title: 'Taller de reparación móvil', icon: '📱', bgImage: '/taller-de-reparacion-movil-bg.jpg' }
];

const baseDir = path.join(process.cwd(), 'app');

sectors.forEach(s => {
  const dirPath = path.join(baseDir, s.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const content = `import ComingSoonPage from '@/components/ui/ComingSoonPage';

export default function ${s.title.replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}Page() {
  return <ComingSoonPage title="${s.title}" icon="${s.icon}" bgImage="${s.bgImage}" />;
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});

console.log('Updated all 7 pages with bgImage props.');
