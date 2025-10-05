# Student Directory - Shared Access

## Overview
The Student Directory is now accessible to both **Mentors (Faculty)** and **Mentees (Students)**, providing a unified platform for exploring student information across the institution.

## Access Levels

### For Faculty (Mentors)
- Full access to student directory
- Can view all student profiles and details
- Access via main navbar: "Student Directory"
- Can search and filter students by various criteria
- Navigate back to "My Mentees" from directory menu

### For Students (Mentees)
- Full access to student directory  
- Can explore fellow students' information
- Access via main navbar: "Student Directory"
- Can search and filter students by various criteria
- Navigate back to "My Mentor" from directory menu

## Features Available to Both User Types

### 🔍 **Search & Filter**
- Search by name, roll number, email, or department
- Sort by name, roll number, CGPA, or department
- Real-time filtering with search results counter

### 📊 **Statistics Dashboard**
- Total Students count
- Filtered Results count
- Number of Departments
- Number of Schools

### 👥 **Student Profiles**
- View detailed student information
- Profile pictures with circular avatars
- Academic information (CGPA, grades)
- Contact details (email, phone)
- Mentor assignment status
- Department and school information

### 🎨 **View Options**
- Grid view for visual browsing
- List view for detailed information
- Responsive design for all devices

## Navigation

### Faculty Navigation
```
Hamburger Menu:
├── My Mentees (→ /mentor-dashboard)
└── Student Directory (current page)
```

### Student Navigation  
```
Hamburger Menu:
├── My Mentor (→ /my-mentor)
└── Student Directory (current page)
```

## Technical Implementation

### Shared Actions
- `/src/app/student-directory/actions.ts` - Dedicated server actions
- `getAllStudents()` - Fetch all students (accessible to both roles)
- `getFacultyByDocId()` - Get mentor details for student profiles
- `searchStudents()` - Advanced search functionality

### Authorization
- Both `Faculty` and `Student` roles can access the directory
- Proper role-based UI adjustments
- Secure server-side data fetching

### Components
- `StudentProfileModal` - Shared modal for viewing detailed profiles
- `StudentAvatar` - Robust image handling with fallbacks
- Responsive grid and list layouts

## Benefits

### For Students
- **Peer Discovery**: Explore fellow students and their academic achievements
- **Networking**: Find students in same department or with similar interests  
- **Mentor Visibility**: See which students have mentors assigned
- **Academic Insights**: View anonymized performance comparisons

### For Faculty
- **Comprehensive View**: Access all students beyond assigned mentees
- **Cross-Department Insights**: Explore students from other departments
- **Mentor Assignment Planning**: See which students need mentor assignment
- **Academic Monitoring**: Monitor overall student performance trends

## Usage Examples

### Student Use Cases
1. **Find Study Groups**: Search for students in same department/course
2. **Academic Benchmarking**: Compare performance with peers (CGPA)
3. **Contact Classmates**: Get email addresses for collaboration
4. **Mentor Information**: See which faculty are active mentors

### Faculty Use Cases  
1. **Student Discovery**: Find potential mentees across departments
2. **Collaboration Planning**: Identify students for research projects
3. **Performance Analysis**: Monitor academic trends across cohorts
4. **Mentorship Overview**: See mentor assignment distribution

## Future Enhancements
- Advanced filtering by academic performance ranges
- Integration with messaging system for direct contact
- Export functionality for student lists
- Analytics dashboard for performance insights