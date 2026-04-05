import ProjectsSection from '../components/sections/ProjectsSection';
import '../pages/Projects.css';
import PageHeader from '../components/ui/PageHeader';

export default function Projects() {
    return (
        <>
            <PageHeader
                title="Nos Projets"
                subtitle="Des projets complèts en cybersécurité, réseau, IoT et intégration système"
                breadcrumb="Projets"
            />
            <ProjectsSection preview={false} />
        </>
    );
}
