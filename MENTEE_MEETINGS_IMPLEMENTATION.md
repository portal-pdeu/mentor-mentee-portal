# Mentee-Side Meetings Implementation

## Overview
Successfully implemented a comprehensive meetings section for mentees that mirrors the mentor-side UI while providing student-specific functionality and information display.

## Key Features Implemented

### 🎯 **Three Meeting Sections for Students**
1. **Upcoming Meetings** - Meetings scheduled for the future that the student has accepted or is pending response
2. **Recent Meetings** - Completed meetings that the student attended (accepted and completed)
3. **Rejected Meetings** - Meetings the student declined with visible rejection reasons

### 🚫 **No Scheduling Capability**
- Students cannot create new meetings (no "Create Meeting" button)
- Only mentors/faculty can schedule meetings through the system

### 📋 **Student-Specific Meeting Display**

#### **Upcoming Meetings**
- Shows meetings where student response is 'accepted' or 'pending'
- Includes "Join Meeting" button for quick access to meeting links
- Displays mentor name, date/time, duration, and purpose

#### **Recent Meetings (Completed)**
- Shows meetings the student attended (accepted and completed)
- Displays past meetings in chronological order (most recent first)
- Includes all meeting details for reference

#### **Rejected Meetings**
- Special red-themed cards for declined meetings
- **Prominently displays rejection reason** provided by the student
- Shows why the student couldn't attend (e.g., "Had to attend urgent family matter")
- Helps mentors understand attendance patterns

## Technical Implementation

### 📁 **Files Modified/Created**

#### **Enhanced Types (`src/types/index.ts`)**
```typescript
export interface InvitedStudent {
  studentId: string;
  studentName: string;
  studentEmail: string;
  rollNo: string;
  responseStatus: 'pending' | 'accepted' | 'declined';
  joinedAt?: string;
  declineReason?: string; // NEW: Reason for declining
}
```

#### **Meetings Service (`src/services/meetingsService.ts`)**
- Added `getMeetingsForStudent(studentId: string)` method
- Returns mock meetings with realistic data including rejection reasons
- Filters meetings where the student is invited

#### **Meetings Page (`src/app/meetings/page.tsx`)**
- Updated authorization to allow both Faculty and Student access
- Dynamic page title: "Meetings" for faculty, "My Meetings" for students
- Conditional "Create Meeting" button (faculty only)
- Loads appropriate data based on user type

#### **Meetings List Component (`src/components/meetings/MeetingsList.tsx`)**
- Added `isStudent` prop for conditional rendering
- New categorization methods for student perspective:
  - `getUpcomingMeetingsForStudent()` - Filters by response status
  - `getCompletedMeetings()` - Shows attended meetings only
  - `getRejectedMeetings()` - Shows declined meetings
- New `renderRejectedMeetingCard()` function with rejection reason display
- Conditional UI elements:
  - Hides delete options for students
  - Shows "Join Meeting" buttons for upcoming meetings
  - Different section titles and empty states

### 🎨 **UI/UX Features**

#### **Student-Friendly Interface**
- Clear section headers: "Upcoming", "Recent Meetings", "Rejected"
- Color-coded rejection cards (red theme)
- Join meeting buttons for easy access
- Mentor name display instead of student count

#### **Rejection Reason Display**
```tsx
<div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-lg">
  <div className="flex items-start gap-2">
    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
    <div>
      <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
        Reason for not attending:
      </p>
      <p className="text-sm text-red-700 dark:text-red-400">
        {declineReason}
      </p>
    </div>
  </div>
</div>
```

#### **Responsive Design**
- Works seamlessly on all screen sizes
- Maintains visual consistency with mentor interface
- Dark mode support throughout

## Sample Data Structure

### **Mock Meeting with Rejection Reason**
```typescript
{
  id: '4',
  title: 'Career Guidance Session',
  description: 'Discuss career opportunities and future plans',
  date: '2025-09-20',
  time: '15:00',
  duration: 60,
  mentorName: 'Dr. John Smith',
  invitedStudents: [
    {
      studentId: studentId,
      studentName: 'Current Student',
      responseStatus: 'declined',
      declineReason: 'Had to attend urgent family matter' // Displayed to student and mentor
    }
  ],
  status: 'completed'
}
```

## Benefits for Students

### 📚 **Academic Organization**
- Clear overview of all mentor interactions
- Historical record of attended meetings
- Transparency about declined meetings

### 🤝 **Mentor-Student Communication**
- Rejection reasons help mentors understand student constraints
- Easy access to join upcoming meetings
- Clear expectations about meeting attendance

### 📊 **Progress Tracking**
- Visual representation of mentorship engagement
- Pattern recognition for attendance issues
- Accountability through reason documentation

## Benefits for Mentors

### 👁️ **Student Engagement Insights**
- See rejection reasons to understand student challenges
- Track attendance patterns across mentees
- Better scheduling decisions based on historical data

### 📞 **Improved Communication**
- Understand why students miss meetings
- Address recurring attendance issues
- Plan more effective mentorship strategies

## Future Enhancement Opportunities

1. **Response Management**: Allow students to accept/decline pending meetings
2. **Feedback System**: Post-meeting feedback from both sides
3. **Availability Sharing**: Students can share their available time slots
4. **Notification System**: Real-time alerts for meeting updates
5. **Analytics Dashboard**: Meeting effectiveness metrics

## Usage Flow

### **For Students**
1. Navigate to "Meetings" from main navbar
2. View three organized sections of meetings
3. Join upcoming meetings with one click
4. Review past meeting history
5. See rejection reasons for accountability

### **For Mentors**
- Continue using existing interface
- Gain insights into student attendance patterns
- Use rejection reasons to improve scheduling

This implementation provides a complete, user-friendly meetings interface for students while maintaining the robust functionality that mentors need for effective mentorship management.