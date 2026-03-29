import ProjectsSection from '../components/sections/ProjectsSection';
import '../pages/Projects.css';

export default function Projects() {
    return (
        <div style={{ paddingTop: '100px' }}>
            <ProjectsSection preview={false} />
        </div>
    );
}
