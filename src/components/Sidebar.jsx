import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside style={{ width: '200px', backgroundColor: '#f0f0f0', padding: '1rem' }}>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><NavLink to="/teacher" end>Dashboard</NavLink></li>
          <li><NavLink to="/teacher/add-syllabus">Add Syllabus</NavLink></li>
          <li><NavLink to="/teacher/submissions">Submissions</NavLink></li>
          {/* Add more links here */}
        </ul>
      </nav>
    </aside>
  );
}
