Design the frontend of a web application called "UniSync" — an AI-augmented peer collaboration platform for Pokhara University students (Computer, IT, Software faculties). The frontend must be implemented in Next.js with modular components, responsive design, and a social-style interface. Include the following:

### 1. Home Page
- Modern UI with **Pokhara University branding** only.
- Sections: Login, Signup, About UniSync, Features, Contact.
- **How UniSync Works Section**:
  - Step-by-step instructions with icons/photos:
    1. Sign up with your university email.
    2. Select your interests.
    3. Discover peers and posted ideas.
    4. Create agreements to collaborate.
    5. Work in groups with chat, file sharing, and media.
    6. Earn badges and feedback for completed projects.
  - Visual timeline or infographic showing the workflow.
  - Screenshots/illustrations of dashboard, peer cards, and idea feed.
- **Feature Highlights Section**:
  - Attractive cards or tiles summarizing each major feature:
    - Peer Discovery
    - Posted Ideas Feed
    - Agreements & Contracts
    - Messaging & Groups
    - Activity Logs
    - Badges & Credentials
    - LinkedIn/GitHub Integration
    - Search & Filters
    - Notifications
    - Gamification
- Login workflow:
  - University email verification (send verification mail).
  - Password authentication interface.
- Signup workflow:
  - Redirect to an **Interest Selection Form** after signup.

### 2. Interest Selection Form
- Multi-select interface for fields of interest (Computer Networks, AI, Software Engineering, Cybersecurity, etc.).
- Option to add custom interests.
- Attractive UI with checkboxes, dropdowns, and tags.
- Store selections visually in profile for peer recommendation.

### 3. Dashboard
- Personalized dashboard after login.
- Modules:
  - **Profile Section**:
    - Attractive, professional design with clear layout.
    - Upload profile photo, academic details, and description.
    - Add **LinkedIn and GitHub links** prominently to build trust.
    - Show badges, reputation score, and collaboration history.
    - Display current collaborations: “Currently working with [names] on [project].”
    - After project completion: show badges, start/end dates, project description, and feedback from groupmates.
  - **Discover Peers**:
    - Recommended peers in a **card-based UI** similar to Facebook’s “mutual friends.”
    - Display profile photo, name, interests, LinkedIn/GitHub links, and “Connect” button.
  - **Search Option**:
    - Global search bar at the top of the dashboard.
    - Search peers by name, skill, interest, or project.
    - Filter results by category (e.g., AI, Networking, Software Engineering).
    - Display results in card format with profile + trust links.
  - **Posted Ideas Feed**:
    - Scrollable feed of project/research ideas posted by students.
    - Options to like, comment, and request collaboration.
  - **Agreements Module**:
    - Digital contracts displayed in a modal/dialog.
    - Define roles and responsibilities (Project Lead, Contributor, Reviewer).
    - Show deadlines, contribution expectations, and penalty rules.
    - Accept/Reject workflow — all members must accept before collaboration starts.
    - Track project status: Pending → Active → Completed/Abandoned.
    - On completion: display verified badges, project description, timeline, and peer feedback.
  - **Messages & Groups**:
    - Real-time chat interface with group and private messaging.
    - When agreement is accepted, automatically create a **project group**.
    - Group features:
      - Upload research papers and credentials.
      - Share **photos and videos** directly in chat.
      - **Copy, paste, and text selection** supported in chat.
      - Add/remove members.
      - Threaded discussions for clarity.
      - File preview and media gallery for shared content.
      - Show “who is collaborating with whom” directly in group and profile views.
  - **Activity Logs**:
    - Timeline view of contributions, badges, abandonment tags, and peer validation.
  - **Notifications**:
    - Alerts for collaboration requests, agreement updates, peer matches, and group activity.
  - **External Resources**:
    - Upload documents, share files, and link references.

### 4. Navbar
- Persistent navigation bar across all pages.
- Sections:
  - Home
  - Features (dedicated page listing all features in detail with visuals)
  - Dashboard
  - Discover
  - Messages
  - Notifications
  - Profile

### 5. UI Components
- Responsive design using Next.js + TailwindCSS.
- Navigation bar with quick access to Home, Dashboard, Discover, Messages.
- Card-based layouts for peers/projects.
- Feed-style layout for posted ideas.
- Modal dialogs for agreements and contracts.
- Badge system with icons for completed contributions.
- Reputation score displayed visually (progress bar or rating stars).
- Gantt chart visualization for project scheduling.
- Search bar with autocomplete suggestions.
- Media upload components for photos/videos in chat.
- Instructional section with **illustrations/screenshots** on the Home Page.
- Chatbox with **copy/paste/select functionality**.

### 6. Extra Frontend Features
- **Gamification**: Leaderboards, streak counters, contribution badges.
- **Peer Validation**: Peers can endorse or validate each other’s contributions.
- **Export Credentials**: Button to download badges/logs for portfolio use.
- **Mutual Connections**: Show “You both share X interests” like Facebook mutual friends.
- **Idea Collaboration Requests**: Button on each idea post to request joining.
- **Abandonment Tags**: Projects marked as “Abandoned” with penalty indicators.
- **Completion Badges**: Projects marked as “Completed” with verified badges, timeline, and peer feedback.
- **LinkedIn/GitHub Integration**: Profiles display clickable LinkedIn and GitHub links to strengthen trust and professional credibility.
- **Project Visibility**: Profiles show ongoing collaborations and completed projects with descriptions.

### 7. Design Goals
- Intuitive, student-friendly interface.
- Crystal-clear, professional profiles that build trust.
- Smooth peer discovery and idea sharing.
- Verified academic credentials displayed visually.
- Strong trust-building via LinkedIn/GitHub integration.
- Collaboration groups with messaging, uploads, **photo/video sharing**, **copy/paste/select functionality**, and member management.
- Clear Home Page with **instructions + visuals** explaining how UniSync works.
- Dedicated **Features page in Navbar** for detailed feature exploration.
- Scalable, modular Next.js components.
