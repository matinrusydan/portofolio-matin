export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  link?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Portfolio Website',
    description: 'A modern portfolio website built with Next.js, featuring smooth animations and responsive design.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    image: '/placeholder.jpg',
    link: '#',
    github: '#'
  },
  {
    id: '2',
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration and admin dashboard.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    image: '/placeholder.jpg',
    link: '#',
    github: '#'
  },
  {
    id: '3',
    title: 'Task Management App',
    description: 'Collaborative task management application with real-time updates.',
    technologies: ['Vue.js', 'Firebase', 'Vuex', 'Tailwind CSS'],
    image: '/placeholder.jpg',
    link: '#',
    github: '#'
  },
  {
    id: '4',
    title: 'Weather Dashboard',
    description: 'Interactive weather dashboard with location-based forecasts and data visualization.',
    technologies: ['React', 'D3.js', 'OpenWeather API', 'CSS3'],
    image: '/placeholder.jpg',
    link: '#',
    github: '#'
  },
  {
    id: '5',
    title: 'Blog Platform',
    description: 'Content management system for blogging with markdown support and SEO optimization.',
    technologies: ['Gatsby', 'GraphQL', 'Netlify CMS', 'Styled Components'],
    image: '/placeholder.jpg',
    link: '#',
    github: '#'
  }
];