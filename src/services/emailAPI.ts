
import { authAPI } from "./api";

// Sample email data for demonstration
const MOCK_EMAILS = {
  inbox: [
    {
      id: "1",
      from: "john.doe@example.com",
      subject: "Welcome to our email client",
      preview: "Thank you for signing up with our email service. We're excited to have you on board!",
      body: "<p>Dear User,</p><p>Thank you for signing up with our email service. We're excited to have you on board!</p><p>With our platform, you can:</p><ul><li>Send and receive emails easily</li><li>Organize your inbox efficiently</li><li>Access advanced features like signatures and attachments</li></ul><p>If you have any questions, feel free to reply to this email.</p><p>Best regards,<br>The Email Team</p>",
      date: "2025-04-22T10:30:00Z",
      read: false,
      hasAttachment: false,
      folder: "inbox"
    },
    {
      id: "2",
      from: "marketing@company.com",
      subject: "Special Offer: Upgrade your email plan",
      preview: "Exclusive offer for our valued customers! Upgrade to our premium email plan and get 50% off for the first 3 months.",
      body: "<p>Dear Valued Customer,</p><p>We have an exclusive offer just for you!</p><p><strong>Upgrade to our premium email plan and get 50% off for the first 3 months.</strong></p><p>Premium features include:</p><ul><li>50GB storage</li><li>Advanced spam filtering</li><li>Custom domain support</li><li>Priority customer support</li></ul><p>Click the button below to upgrade now!</p><p><a href='#' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;'>Upgrade Now</a></p>",
      date: "2025-04-21T15:45:00Z",
      read: true,
      hasAttachment: false,
      folder: "inbox"
    },
    {
      id: "3",
      from: "support@example.com",
      subject: "Your monthly report",
      preview: "Here's your monthly email usage report. You've used 45% of your storage quota this month.",
      body: "<p>Dear User,</p><p>Here's your monthly email usage report:</p><ul><li>Storage used: 45% (4.5GB of 10GB)</li><li>Emails sent: 120</li><li>Emails received: 315</li></ul><p>You're well within your limits, but if you need more storage, consider upgrading your plan.</p><p>The Email Team</p>",
      date: "2025-04-20T09:15:00Z",
      read: true,
      hasAttachment: true,
      attachments: [
        {
          filename: "monthly_report_april.pdf",
          size: "2.4 MB",
          type: "application/pdf"
        }
      ],
      folder: "inbox"
    }
  ],
  sent: [
    {
      id: "4",
      to: "client@example.com",
      from: "me@example.com",
      subject: "Project proposal",
      preview: "As discussed, I'm sending you the project proposal for review. Let me know your thoughts.",
      body: "<p>Hi there,</p><p>As discussed during our meeting, I'm sending you the project proposal for your review.</p><p>Key points:</p><ul><li>Timeline: 6 weeks</li><li>Budget: $12,000</li><li>Deliverables: Full email system integration</li></ul><p>Please let me know if you have any questions or need any clarifications.</p><p>Best regards,<br>Me</p>",
      date: "2025-04-19T11:20:00Z",
      read: true,
      hasAttachment: true,
      attachments: [
        {
          filename: "project_proposal.docx",
          size: "1.2 MB",
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        },
        {
          filename: "budget_breakdown.xlsx",
          size: "0.8 MB",
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
      ],
      folder: "sent"
    }
  ],
  spam: [
    {
      id: "5",
      from: "suspicious@unknown.com",
      subject: "You've won a prize!!!",
      preview: "Congratulations! You are our lucky winner. Click here to claim your prize now!",
      body: "<p>CONGRATULATIONS!!!</p><p>You've been selected as our lucky winner of a brand new smartphone!</p><p>To claim your prize, click the link below and enter your personal information:</p><p><a href='#'>CLAIM YOUR PRIZE NOW</a></p>",
      date: "2025-04-18T07:55:00Z",
      read: false,
      hasAttachment: false,
      folder: "spam"
    }
  ],
  trash: []
};

export const emailAPI = {
  // Get emails from a specific folder
  getEmails: async (folder: string) => {
    // In a real app, this would call an API endpoint
    // For now, we use the mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_EMAILS[folder] || []);
      }, 800); // Add a delay to simulate network request
    });
  },

  // Get a single email by ID
  getEmail: async (id: string) => {
    // Find the email across all folders
    let email = null;
    for (const folder in MOCK_EMAILS) {
      email = MOCK_EMAILS[folder].find((e) => e.id === id);
      if (email) break;
    }
    return email;
  },

  // Send an email
  sendEmail: async (emailData) => {
    // In a real app, this would call an API endpoint
    console.log("Sending email:", emailData);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Add the email to the sent folder
        const newEmail = {
          id: Date.now().toString(),
          to: emailData.to,
          from: authAPI.getCurrentUser().email,
          subject: emailData.subject,
          preview: emailData.message.substring(0, 100),
          body: emailData.message,
          date: new Date().toISOString(),
          read: true,
          hasAttachment: emailData.attachments && emailData.attachments.length > 0,
          attachments: emailData.attachments?.map(file => ({
            filename: file.name,
            size: `${Math.round(file.size / 1024)} KB`,
            type: file.type
          })),
          folder: "sent"
        };
        
        MOCK_EMAILS.sent.unshift(newEmail);
        resolve(newEmail);
      }, 1500); // Add a delay to simulate network request
    });
  },

  // Delete an email (move to trash)
  deleteEmail: async (id: string) => {
    // Find the email across all folders
    let email = null;
    let emailFolder = null;
    let emailIndex = -1;
    
    for (const folder in MOCK_EMAILS) {
      if (folder === "trash") continue;
      
      const index = MOCK_EMAILS[folder].findIndex((e) => e.id === id);
      if (index !== -1) {
        email = MOCK_EMAILS[folder][index];
        emailFolder = folder;
        emailIndex = index;
        break;
      }
    }
    
    if (email && emailFolder && emailIndex !== -1) {
      // Remove from original folder
      MOCK_EMAILS[emailFolder].splice(emailIndex, 1);
      
      // Add to trash
      email.folder = "trash";
      MOCK_EMAILS.trash.unshift(email);
      
      return true;
    }
    
    return false;
  },

  // Mark an email as spam
  markAsSpam: async (id: string) => {
    // Find the email across all folders
    let email = null;
    let emailFolder = null;
    let emailIndex = -1;
    
    for (const folder in MOCK_EMAILS) {
      if (folder === "spam") continue;
      
      const index = MOCK_EMAILS[folder].findIndex((e) => e.id === id);
      if (index !== -1) {
        email = MOCK_EMAILS[folder][index];
        emailFolder = folder;
        emailIndex = index;
        break;
      }
    }
    
    if (email && emailFolder && emailIndex !== -1) {
      // Remove from original folder
      MOCK_EMAILS[emailFolder].splice(emailIndex, 1);
      
      // Add to spam
      email.folder = "spam";
      MOCK_EMAILS.spam.unshift(email);
      
      return true;
    }
    
    return false;
  }
};
